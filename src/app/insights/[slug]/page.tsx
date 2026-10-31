import { notFound } from 'next/navigation';
import { articles } from '@/lib/content';
import { Breadcrumbs, FinalCTA, JsonLd } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
import { brand } from '@/config/brand';
import { site } from '@/config/site';
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = articles.find((a) => a.slug === slug);
  if (!item) return {};
  return {
    ...makeMetadata(item.title, item.description, `/insights/${slug}`),
    openGraph: {
      type: 'article' as const,
      title: item.title,
      description: item.description,
      publishedTime: item.date,
      url: `/insights/${slug}`,
      images: ['/opengraph-image'],
    },
  };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const Content = article.Content;
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Insights', href: '/insights' },
          { label: article.title, href: `/insights/${slug}` },
        ]}
      />
      <header className="page-hero shell">
        <h1>{article.title}</h1>
        <p className="lead" style={{ maxWidth: 760, marginTop: 30 }}>
          {article.description}
        </p>
        <div className="article-meta">
          <span>{brand.name} / Studio notes</span>
          <time dateTime={article.date}>30 October 2026</time>
          <span>{article.readingTime}</span>
        </div>
      </header>
      <article className="shell">
        <div className="prose-layout">
          <aside className="article-aside">
            <dl>
              <div>
                <dt>Published by</dt>
                <dd>{brand.name}</dd>
              </div>
              <div>
                <dt>Filed under</dt>
                <dd>{article.category}</dd>
              </div>
            </dl>
          </aside>
          <div className="prose">
            <Content />
          </div>
        </div>
      </article>
      <FinalCTA />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          dateModified: article.date,
          author: { '@type': 'Organization', name: brand.name, url: site.url },
          publisher: { '@type': 'Organization', name: brand.name, url: site.url },
          mainEntityOfPage: `${site.url}/insights/${slug}`,
          image: `${site.url}/opengraph-image`,
        }}
      />
    </>
  );
}
