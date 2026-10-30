import 'server-only';
export type EnquiryMode = 'local' | 'production' | 'unconfigured';
export function enquiryMode(): EnquiryMode {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const loopback = ['localhost', '127.0.0.1'].includes(new URL(url).hostname);
  if (
    loopback &&
    (process.env.ENQUIRY_MODE === 'local' ||
      (process.env.NODE_ENV !== 'production' && !process.env.SUPABASE_SERVICE_ROLE_KEY))
  )
    return 'local';
  const required = [
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RATE_LIMIT_SALT',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'CONTACT_NOTIFICATION_EMAIL',
  ];
  return required.every((key) => Boolean(process.env[key])) ? 'production' : 'unconfigured';
}
