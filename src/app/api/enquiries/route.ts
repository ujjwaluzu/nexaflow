import { after } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createHmac } from 'node:crypto';
import * as Sentry from '@sentry/nextjs';
import { handleEnquiry } from '@/lib/enquiry-handler';
import { enquiryMode } from '@/lib/integrations/config';
import { database, saveLead } from '@/lib/integrations/database';
import { processDeliveries } from '@/lib/integrations/delivery';
import { saveLocal } from '@/lib/integrations/local';
const localLimits = new Map<string, { count: number; expires: number }>();
async function localRateLimit(key: string) {
  const now = Date.now();
  for (const [id, value] of localLimits) if (value.expires <= now) localLimits.delete(id);
  const value = localLimits.get(key) || { count: 0, expires: now + 600000 };
  value.count++;
  localLimits.set(key, value);
  return value.count <= 5;
}
export async function POST(request: Request) {
  const mode = enquiryMode();
  if (mode === 'production') {
    try {
      // This header is trusted only inside the Cloudflare runtime, never on next start.
      const { env } = getCloudflareContext();
      const ip = request.headers.get('cf-connecting-ip');
      if (!ip || !env.ENQUIRY_RATE_LIMITER) throw new Error('missing_rate_limiter');
      const key = createHmac('sha256', process.env.RATE_LIMIT_SALT!).update(ip).digest('hex');
      if (!(await env.ENQUIRY_RATE_LIMITER.limit({ key })).success)
        return Response.json(
          { error: 'Too many requests. Please wait a minute before trying again.' },
          { status: 429, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } },
        );
    } catch {
      return Response.json(
        { error: 'The secure enquiry connection is unavailable. Please try again later.' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }
  }
  return handleEnquiry(request, {
    mode,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    rateLimit:
      mode === 'local'
        ? localRateLimit
        : async (key) =>
            database<boolean>('rpc/check_enquiry_rate', {
              method: 'POST',
              body: JSON.stringify({ bucket_key: key }),
            }),
    save: mode === 'local' ? saveLocal : saveLead,
    deliver: async (id) => {
      if (mode === 'production')
        after(async () => {
          try {
            const result = await processDeliveries(id);
            if (result.failed) Sentry.captureException(new Error('enquiry_delivery_pending'));
          } catch {
            Sentry.captureException(new Error('enquiry_delivery_pending'));
          }
        });
    },
    report: () => {
      Sentry.captureException(new Error('enquiry_pipeline_failed'));
    },
  });
}
