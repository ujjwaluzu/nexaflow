import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { brand } from '@/config/brand';
import { site } from '@/config/site';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { PrivacyControls } from '@/components/privacy-controls';
import { JsonLd } from '@/components/ui';
import { organizationSchema } from '@/lib/seo';
import './globals.css';
const geist = localFont({
  src: '../../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2',
  variable: '--font-heading',
  display: 'swap',
});
const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-body',
  display: 'swap',
});
const mono = localFont({
  src: '../../node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2',
  variable: '--font-mono',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${brand.name} — ${brand.tagline}`, template: `%s | ${brand.name}` },
  description: brand.description,
  icons: { icon: '/brand/symbol.svg', apple: '/brand/symbol.svg' },
  robots: { index: site.isPublic, follow: site.isPublic },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navigation />
        <main id="main-content">{children}</main>
        <Footer />
        <PrivacyControls />
        <JsonLd data={organizationSchema()} />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: brand.name,
            url: site.url,
          }}
        />
      </body>
    </html>
  );
}
