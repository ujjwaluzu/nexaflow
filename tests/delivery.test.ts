import { afterEach, describe, it, expect, vi } from 'vitest';
import { sendEmail, syncCRM, processDeliveries } from '@/lib/integrations/delivery';
import { saveLead } from '@/lib/integrations/database';
import { lead } from './fixtures';
const job = {
  id: '02831675-7e02-4668-bdd1-b5345cbbaf81',
  lead_id: lead.id,
  kind: 'client_email' as const,
  status: 'pending',
  attempts: 0,
  created_at: new Date().toISOString(),
};
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe('database and provider integration', () => {
  it('holds uncertain email retries beyond the provider idempotency window for review', async () => {
    const oldJob = {
      ...job,
      attempts: 1,
      created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    };
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json([oldJob]))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetch);
    await processDeliveries();
    expect(JSON.parse(fetch.mock.calls[1][1].body).status).toBe('needs_review');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it('saves through server-authenticated REST with idempotency', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-server-key');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://database.test');
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetch);
    await saveLead(lead);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('leads?on_conflict=id');
    expect(options.headers.Authorization).toBe('Bearer test-server-key');
    const body = JSON.parse(options.body);
    expect(body.consent_version).toBe('enquiry-v1');
    expect(body).not.toHaveProperty('honeypot');
  });
  it('sends transactional text email with a stable idempotency key', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetch);
    await sendEmail(job, lead);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(options.headers['Idempotency-Key']).toBe(job.id);
    expect(JSON.parse(options.body).to).toEqual([lead.email]);
    expect(JSON.parse(options.body).text).toContain(lead.id);
  });
  it('propagates email failures for durable retry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 429 })));
    await expect(sendEmail(job, lead)).rejects.toThrow('email_429');
  });
  it('skips optional CRM when it has no credentials', async () => {
    vi.stubEnv('HUBSPOT_ACCESS_TOKEN', '');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(await syncCRM(lead)).toBe('skipped');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('upserts CRM contacts by email when configured', async () => {
    vi.stubEnv('HUBSPOT_ACCESS_TOKEN', 'test-token');
    const fetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetch);
    expect(await syncCRM(lead)).toBe('sent');
    expect(JSON.parse(fetch.mock.calls[0][1].body).inputs[0].idProperty).toBe('email');
  });
  it('claims a task, sends it, and marks completion', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json([job]))
      .mockResolvedValueOnce(Response.json([job]))
      .mockResolvedValueOnce(Response.json([lead]))
      .mockResolvedValueOnce(Response.json({ id: 'message' }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetch);
    expect(await processDeliveries(lead.id)).toEqual({ processed: 1, failed: 0 });
    expect(fetch.mock.calls[1][0]).toContain('rpc/claim_delivery');
    expect(JSON.parse(fetch.mock.calls[4][1].body).status).toBe('sent');
  });
  it('records a failed delivery without discarding the saved lead', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json([job]))
      .mockResolvedValueOnce(Response.json([job]))
      .mockResolvedValueOnce(Response.json([lead]))
      .mockResolvedValueOnce(new Response('{}', { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetch);
    expect(await processDeliveries()).toEqual({ processed: 1, failed: 1 });
    expect(JSON.parse(fetch.mock.calls[4][1].body)).toMatchObject({
      status: 'failed',
      last_error: 'email_500',
    });
  });
});
