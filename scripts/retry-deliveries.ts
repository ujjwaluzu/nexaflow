import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
const { processDeliveries } = await import('../src/lib/integrations/delivery');
const { database } = await import('../src/lib/integrations/database');
// Recover tasks abandoned by a terminated worker. Resend idempotency keys last 24h.
await database(
  'lead_deliveries?status=eq.processing&updated_at=lt.' +
    new Date(Date.now() - 15 * 60000).toISOString(),
  { method: 'PATCH', body: JSON.stringify({ status: 'failed', last_error: 'lease_expired' }) },
);
const result = await processDeliveries();
console.log(JSON.stringify(result));
if (result.failed) process.exitCode = 1;
