import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  await db.exec(readFileSync('migrations/001_enquiries.sql', 'utf8'));
});
afterAll(async () => {
  await db.close();
});
describe('migration in embedded PostgreSQL', () => {
  it('persists a valid lead and atomically creates three outbox tasks', async () => {
    await db.query(
      "insert into leads(id,name,email,country,service,description,budget,timeline,consent_version,consent_at) values($1,'Test User','user@example.test','India','Web Engineering',$2,'Unsure','Exploring','enquiry-v1',now())",
      [
        'cf9277fc-947a-4c76-8ded-c9180140a589',
        'A realistic project description with sufficient detail.',
      ],
    );
    const result = await db.query<{ count: number }>(
      'select count(*)::int as count from lead_deliveries',
    );
    expect(result.rows[0].count).toBe(3);
  });
  it('allows exactly five requests per rate-limit bucket', async () => {
    const results = [];
    for (let i = 0; i < 6; i++)
      results.push(
        (
          await db.query<{ allowed: boolean }>('select check_enquiry_rate($1) as allowed', [
            'a'.repeat(64),
          ])
        ).rows[0].allowed,
      );
    expect(results).toEqual([true, true, true, true, true, false]);
  });
  it('claims each delivery only once', async () => {
    const [{ id }] = (await db.query<{ id: string }>('select id from lead_deliveries limit 1'))
      .rows;
    expect((await db.query('select * from claim_delivery($1)', [id])).rows).toHaveLength(1);
    expect((await db.query('select * from claim_delivery($1)', [id])).rows).toHaveLength(0);
  });
  it('rejects invalid service values at the database boundary', async () => {
    await expect(
      db.query("update leads set service='invented' where id=$1", [
        'cf9277fc-947a-4c76-8ded-c9180140a589',
      ]),
    ).rejects.toThrow();
  });
  it.each(['anon', 'authenticated'])(
    'does not allow the %s role to read private records',
    async (role) => {
      await db.exec(`set role ${role}`);
      try {
        await expect(db.query('select * from public.leads')).rejects.toThrow(/permission denied/);
      } finally {
        await db.exec('reset role');
      }
    },
  );
  it('removes delivery records with a lead', async () => {
    await db.exec('delete from leads');
    expect((await db.query('select * from lead_deliveries')).rows).toHaveLength(0);
  });
});
