import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/lib/content';
import { PageHero, FinalCTA } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Engineering insights',
  'Practical notes on software, automation and the decisions behind dependable digital systems.',
  '/insights',
);
export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Notes from the studio"
        title="Clear thinking, before the code."
        description="Practical notes on building software, connecting workflows and making technology decisions that hold up in real use."
      />
      <section className="shell">
        <div className="article-list">
          {articles.map((article) => (
            <Link href={`/insights/${article.slug}`} key={article.slug} className="article-card">
              <div className="mono">
                <time dateTime={article.date}>30 OCT 2026</time>
                <br />
                {article.readingTime}
              </div>
              <div>
                <span className="eyebrow">{article.category}</span>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
              </div>
              <ArrowUpRight size={24} />
            </Link>
          ))}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
