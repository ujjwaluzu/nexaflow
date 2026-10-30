import Image from 'next/image';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/content';
import { Breadcrumbs, Button, FinalCTA, PageHero } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = projects.find((p) => p.slug === slug);
  return item ? makeMetadata(item.title, item.description, `/work/${slug}`) : {};
}
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const Content = project.Content;
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Work', href: '/work' },
          { label: project.title, href: `/work/${slug}` },
        ]}
      />
      <PageHero
        eyebrow={project.category}
        title={project.title}
        description={project.description}
      />
      <div className="shell">
        <Image
          className="case-cover"
          src={project.cover}
          alt="Actual desktop homepage of the independent studio website"
          width={1400}
          height={875}
          priority
        />
        <dl className="case-meta">
          <div>
            <dt>Context</dt>
            <dd>{project.category}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Foundation</dt>
            <dd>{project.stack.join(' / ')}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Repository implementation</dd>
          </div>
        </dl>
        <div className="prose-layout">
          <aside className="article-aside">
            <dl>
              <div>
                <dt>Project boundaries</dt>
                <dd>Independent work. No client relationship or commercial metrics claimed.</dd>
              </div>
              <div>
                <dt>External deployment</dt>
                <dd>
                  {project.externalUrl ? (
                    <a href={project.externalUrl}>Visit project</a>
                  ) : (
                    'Not published as a verified deployment.'
                  )}
                </dd>
              </div>
            </dl>
          </aside>
          <article className="prose">
            <Content />
          </article>
        </div>
        <section className="split-content content-section">
          <div>
            <p className="eyebrow">From the actual build</p>
            <h2 style={{ marginTop: 20 }}>Designed for the smaller screen, too.</h2>
            <p style={{ marginTop: 25 }}>
              This image is a capture of the mobile interface, not a fabricated product mockup.
            </p>
          </div>
          <Image
            src={project.gallery[0].src}
            width={430}
            height={732}
            alt={project.gallery[0].alt}
            style={{ maxWidth: 330, marginInline: 'auto', border: '1px solid var(--border)' }}
          />
        </section>
        {project.githubUrl && <Button href={project.githubUrl}>Explore the source</Button>}
      </div>
      <FinalCTA />
    </>
  );
}
