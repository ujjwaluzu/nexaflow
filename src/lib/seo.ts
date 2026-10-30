import type { Metadata } from 'next';
import { brand } from '@/config/brand';
import { site } from '@/config/site';
export function metadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${brand.name}`,
      description,
      url: path,
      siteName: brand.name,
      type: 'website',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${brand.name} — ${brand.tagline}`,
        },
      ],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
  };
}
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    description: brand.description,
    url: site.url,
    logo: `${site.url}/brand/symbol.svg`,
    ...(brand.email ? { email: brand.email } : {}),
    ...(brand.socialLinks.length ? { sameAs: brand.socialLinks.map((link) => link.url) } : {}),
  };
}
