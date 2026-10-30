import 'server-only';
import type { Enquiry } from '@/lib/validation/enquiry';
export async function database<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`database_${response.status}`);
  const body = await response.text();
  return body ? (JSON.parse(body) as T) : (undefined as T);
}
export async function saveLead(input: Enquiry) {
  const { id, name, email, company, country, service, description, budget, timeline, website_url } =
    input;
  // The UUID is the idempotency key. A retry never overwrites an accepted lead.
  await database('leads?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({
      id,
      name,
      email,
      company,
      country,
      service,
      description,
      budget,
      timeline,
      website_url,
      source: 'website',
      consent_version: 'enquiry-v1',
      consent_at: new Date().toISOString(),
    }),
  });
  return id;
}
export type Delivery = {
  id: string;
  lead_id: string;
  kind: 'client_email' | 'founder_email' | 'crm';
  status: string;
  attempts: number;
  created_at: string;
};
export type LeadRecord = Omit<Enquiry, 'consent' | 'honeypot'>;
