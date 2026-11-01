import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { articles, projects } from '@/lib/content';
import { services } from '@/data/services';
import { metadata } from '@/lib/seo';
import { readingOutlines } from '@/data/reading';
import { sectionId } from '@/lib/reading';
describe('content and SEO contracts', () => {
  it('has four complete, distinct service divisions', () => {
    expect(services).toHaveLength(4);
    expect(new Set(services.map((s) => s.headline)).size).toBe(4);
    for (const s of services) {
      expect(s.deliverables).toHaveLength(4);
      expect(s.faqs.length).toBeGreaterThanOrEqual(4);
      expect(s.engagement.length).toBeGreaterThan(100);
    }
  });
  it('publishes unique slugs with substantial MDX source', () => {
    for (const [items, directory] of [
      [articles, 'insights'],
      [projects, 'case-studies'],
    ] as const) {
      expect(new Set(items.map((item) => item.slug)).size).toBe(items.length);
      for (const item of items)
        expect(
          readFileSync(`content/${directory}/${item.slug}.mdx`, 'utf8').split(/\s+/).length,
        ).toBeGreaterThan(450);
    }
  });
  it('labels initial work as independent without invented outcomes', () => {
    expect(projects[0].category).toBe('Independent studio project');
    expect(projects[0].externalUrl).toBeUndefined();
    expect(projects[0].outcomes.every((value) => !/%|revenue|customers/.test(value))).toBe(true);
  });
  it('keeps reading contents complete and heading anchors unique', () => {
    for (const [items, directory] of [
      [articles, 'insights'],
      [projects, 'case-studies'],
    ] as const) {
      for (const item of items) {
        const source = readFileSync(`content/${directory}/${item.slug}.mdx`, 'utf8');
        const headings = [...source.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());
        expect(readingOutlines[item.slug], item.slug).toEqual(headings);
        expect(new Set(headings.map(sectionId)).size, item.slug).toBe(headings.length);
      }
    }
  });
  it('generates canonical, Open Graph and Twitter metadata', () => {
    const result = metadata('A clear title', 'A unique page description', '/services');
    expect(result.alternates?.canonical).toBe('/services');
    expect(result.openGraph).toHaveProperty('url', '/services');
    expect(result.twitter).toHaveProperty('card', 'summary_large_image');
  });
});
