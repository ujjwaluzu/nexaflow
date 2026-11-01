import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  ChevronRight,
  Layers3,
  Network,
  Workflow,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { brand } from '@/config/brand';
import { site } from '@/config/site';
export function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link href={href} className={`button ${secondary ? 'button-secondary' : 'button-primary'}`}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function SectionHeading({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
      </div>
      {children && <div className="section-heading-aside">{children}</div>}
    </div>
  );
}
export function PageHero({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero shell">
      <h1>{title}</h1>
      <div className="page-hero-bottom">
        <p className="lead">{description}</p>
        {children}
      </div>
    </section>
  );
}
export function FinalCTA({ editorial = false }: { editorial?: boolean }) {
  return (
    <section
      className={`final-cta shell${editorial ? ' home-final-cta' : ''}`}
      id={editorial ? 'end' : undefined}
      data-reveal={editorial || undefined}
    >
      <div className="final-cta-grid">
        <h2>
          Have something
          <br />
          worth <span className="accent">building</span>
          <span className="accent">?</span>
        </h2>
        <div>
          <p>
            Tell us what you’re trying to achieve. We’ll help you work out the right technology and
            build a solution around it.
          </p>
          <Button href="/contact">Start a project</Button>
        </div>
      </div>
    </section>
  );
}
export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  const list = [{ label: 'Home', href: '/' }, ...items];
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: list.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            item: `${site.url}${item.href}`,
          })),
        }}
      />
      <nav className="breadcrumbs shell" aria-label="Breadcrumb">
        <ol>
          {list.map((item, i) => (
            <li key={item.href}>
              {i > 0 && (
                <ChevronRight className="breadcrumb-separator" size={14} aria-hidden="true" />
              )}
              {i === list.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
export function ServiceIcon({ index, size = 28 }: { index: number; size?: number }) {
  const Icon = [Braces, Layers3, Workflow, Network][index % 4];
  return <Icon size={size} strokeWidth={1.4} />;
}
export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={item.question}>
          <summary>
            <span className="mono muted">0{i + 1}</span>
            {item.question}
            <span className="faq-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
export function EmptyProjectNote() {
  return (
    <p className="small muted">
      This is an independent studio build. No client engagement or commercial outcome is implied.
      More work will be published when it can be documented accurately.
    </p>
  );
}
export function BrandName() {
  return <>{brand.name}</>;
}
export { ArrowRight };
