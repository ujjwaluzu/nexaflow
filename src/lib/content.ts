import { z } from 'zod';
import type { ComponentType } from 'react';
import StudioWebsite from '../../content/case-studies/studio-website.mdx';
import Automation from '../../content/insights/automate-the-handoff.mdx';
import MVP from '../../content/insights/scope-a-useful-mvp.mdx';
import ReliableForms from '../../content/insights/reliable-enquiry-forms.mdx';
import { brand } from '@/config/brand';
export const contentSchema = z.object({
  title: z.string().min(5),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(30),
  published: z.boolean(),
  date: z.iso.date(),
  category: z.string(),
  readingTime: z.string(),
});
export type Article = z.infer<typeof contentSchema> & { Content: ComponentType };
const articleData = [
  {
    title: 'Automate the handoff, not the whole business.',
    slug: 'automate-the-handoff',
    description:
      'A practical way to choose a first automation: follow one piece of work across the gap between two tools.',
    published: true,
    date: '2026-10-30',
    category: 'Automation',
    readingTime: '5 min read',
    Content: Automation,
  },
  {
    title: 'What belongs in a useful MVP?',
    slug: 'scope-a-useful-mvp',
    description:
      'Define the question your first release needs to answer, then build the smallest coherent workflow that can answer it.',
    published: true,
    date: '2026-10-30',
    category: 'Software engineering',
    readingTime: '5 min read',
    Content: MVP,
  },
  {
    title: 'The form is only the beginning.',
    slug: 'reliable-enquiry-forms',
    description:
      'A dependable enquiry flow needs validation, durable storage, delivery handling and an honest confirmation state.',
    published: true,
    date: '2026-10-30',
    category: 'Engineering notes',
    readingTime: '5 min read',
    Content: ReliableForms,
  },
];
export const articles: Article[] = articleData
  .map((item) => ({ ...contentSchema.parse(item), Content: item.Content }))
  .filter((item) => item.published);
export const projectSchema = contentSchema.extend({
  cover: z.string(),
  gallery: z.array(z.object({ src: z.string(), alt: z.string() })),
  role: z.string(),
  stack: z.array(z.string()),
  overview: z.string(),
  problem: z.string(),
  solution: z.string(),
  architecture: z.string(),
  challenges: z.string(),
  outcomes: z.array(z.string()),
  externalUrl: z.url().optional(),
  githubUrl: z.url().optional(),
});
export const projects = [
  {
    ...projectSchema.parse({
      title: `${brand.name} / The studio website`,
      slug: 'studio-website',
      description:
        'An independent studio website connecting a custom identity, service content and a validated enquiry pipeline.',
      published: true,
      date: '2026-10-30',
      category: 'Independent studio project',
      readingTime: '6 min read',
      cover: '/projects/studio-cover.webp',
      gallery: [
        {
          src: '/projects/studio-mobile.webp',
          alt: 'Actual mobile homepage of this studio website',
        },
      ],
      role: 'Brand direction, UX, engineering and content',
      stack: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'PostgreSQL',
        'Resend',
        'Cloudflare',
      ],
      overview: 'The current studio website, built in this repository.',
      problem:
        'Explain four connected disciplines clearly and provide a reliable path from interest to enquiry.',
      solution:
        'A coherent content system, accessible page architecture and server-side lead handling.',
      architecture:
        'Server-rendered marketing pages, local MDX content, a Zod-validated API and a PostgreSQL outbox for delivery tasks.',
      challenges:
        'Keep a new studio credible without inventing client work, and make unavailable external integrations explicit.',
      outcomes: [
        'A complete content-led website in this repository',
        'A local testing mode for the enquiry workflow',
        'Deployment configuration and operating documentation',
      ],
    }),
    Content: StudioWebsite,
  },
].filter((item) => item.published);
