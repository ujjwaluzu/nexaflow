import 'server-only';
import { brand } from '@/config/brand';
import { database, type Delivery, type LeadRecord } from './database';
function safeHeader(value: string) {
  return value.replace(/[\r\n]/g, ' ');
}
export async function sendEmail(job: Delivery, lead: LeadRecord) {
  const client = job.kind === 'client_email';
  const body = {
    from: process.env.RESEND_FROM_EMAIL!,
    to: [client ? lead.email : process.env.CONTACT_NOTIFICATION_EMAIL!],
    subject: client
      ? `Your enquiry to ${safeHeader(brand.name)}`
      : `New ${safeHeader(brand.name)} enquiry · ${safeHeader(lead.service)}`,
    text: client
      ? `Hi ${lead.name},\n\nThank you for telling ${brand.name} about your project. Your enquiry has been received and will be reviewed. No project has been booked or agreed at this stage.\n\nReference: ${lead.id}\n\n${brand.tagline}`
      : `New project enquiry\n\nName: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company || 'Not provided'}\nCountry: ${lead.country}\nService: ${lead.service}\nBudget: ${lead.budget}\nTimeline: ${lead.timeline}\nWebsite: ${lead.website_url || 'Not provided'}\n\n${lead.description}\n\nReference: ${lead.id}`,
    reply_to: client ? process.env.CONTACT_NOTIFICATION_EMAIL! : lead.email,
  };
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': job.id,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`email_${response.status}`);
}
export async function syncCRM(lead: LeadRecord) {
  if (!process.env.HUBSPOT_ACCESS_TOKEN) return 'skipped' as const;
  const properties = {
    email: lead.email,
    firstname: lead.name,
    company: lead.company,
    country: lead.country,
  };
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: [{ id: lead.email, idProperty: 'email', properties }] }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`crm_${response.status}`);
  return 'sent' as const;
}
export async function processDeliveries(leadId?: string) {
  const jobs = await database<Delivery[]>(
    `lead_deliveries?status=in.(pending,failed)&attempts=lt.20&order=created_at.asc&limit=50${leadId ? `&lead_id=eq.${encodeURIComponent(leadId)}` : ''}`,
  );
  const results = await Promise.allSettled(
    jobs.map(async (job) => {
      // Resend retains idempotency keys for 24h. An uncertain older retry needs
      // provider reconciliation before another send, rather than risking duplicates.
      if (
        job.kind !== 'crm' &&
        job.attempts > 0 &&
        Date.now() - new Date(job.created_at).getTime() > 23 * 60 * 60 * 1000
      ) {
        await database(`lead_deliveries?id=eq.${job.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'needs_review',
            last_error: 'idempotency_window_expired',
            updated_at: new Date().toISOString(),
          }),
        });
        return;
      }
      // Atomic claim prevents two requests/retry workers from sending the same task.
      const claimed = await database<Delivery[]>('rpc/claim_delivery', {
        method: 'POST',
        body: JSON.stringify({ delivery_id: job.id }),
      });
      if (!claimed.length) return;
      let status = 'sent';
      try {
        const [lead] = await database<LeadRecord[]>(
          `leads?id=eq.${job.lead_id}&select=id,name,email,company,country,service,description,budget,timeline,website_url`,
        );
        if (!lead) throw new Error('missing_lead');
        if (job.kind === 'crm') status = await syncCRM(lead);
        else await sendEmail(job, lead);
        await database(`lead_deliveries?id=eq.${job.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status, last_error: null, updated_at: new Date().toISOString() }),
        });
      } catch (error) {
        const code =
          error instanceof Error && /^(email|crm|database)_\d+$/.test(error.message)
            ? error.message
            : 'delivery_failed';
        await database(`lead_deliveries?id=eq.${job.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'failed',
            last_error: code,
            updated_at: new Date().toISOString(),
          }),
        });
        throw new Error(code);
      }
    }),
  );
  return {
    processed: results.length,
    failed: results.filter((result) => result.status === 'rejected').length,
  };
}
