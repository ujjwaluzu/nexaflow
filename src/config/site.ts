const configuredURL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);
const hostname = new URL(configuredURL).hostname;
export const site = {
  url: configuredURL,
  isPublic: Boolean(
    process.env.NEXT_PUBLIC_SITE_URL &&
    !['localhost', '127.0.0.1', '0.0.0.0', '[::1]'].includes(hostname),
  ),
  navigation: [
    { label: 'Services', href: '/services' },
    { label: 'Industries', href: '/industries' },
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Insights', href: '/insights' },
  ],
};
