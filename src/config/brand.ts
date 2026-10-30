// Replace provisional identity here. No domain, registration or availability is implied.
export const brand = {
  name: 'NEXORA',
  tagline: "Engineering what's next.",
  heroHeadline: ['Built around', 'your business.'],
  description:
    'An independent digital engineering studio specialising in web engineering, software development and intelligent automation.',
  statement: 'We build the digital systems that help businesses move forward.',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  founderName: '',
  legalName: '',
  address: '',
  socialLinks: [] as { label: string; url: string }[],
  copyrightYear: new Date().getFullYear(),
};
