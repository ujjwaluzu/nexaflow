import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: site.isPublic
      ? { userAgent: '*', allow: '/', disallow: ['/api/', '/thank-you', '/404'] }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
