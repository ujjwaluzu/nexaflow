import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { services } from '@/data/services';
import { industries } from '@/data/industries';
import { articles, projects } from '@/lib/content';
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/services',
    '/industries',
    '/work',
    '/about',
    '/process',
    '/contact',
    '/insights',
    '/privacy',
    '/terms',
    ...services.map((item) => `/services/${item.slug}`),
    ...industries.map((item) => `/industries/${item.slug}`),
    ...projects.map((item) => `/work/${item.slug}`),
    ...articles.map((item) => `/insights/${item.slug}`),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === '/insights' ? 'monthly' : 'yearly',
    priority: path === '' ? 1 : path.split('/').length === 2 ? 0.8 : 0.6,
  }));
}
