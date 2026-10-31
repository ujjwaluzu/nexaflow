import { PageHero, FinalCTA } from '@/components/ui';
import { SelectedWork } from '@/components/sections';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Selected work',
  'Documented engineering work with honest scope, technical decisions and outcomes. Explore the studio’s independent website build.',
  '/work',
);
export default function WorkPage() {
  return (
    <>
      <PageHero
        title="The thinking behind the build."
        description="A closer look at the problems, decisions and systems behind our work. Explore the scope, technical choices and lessons from each build. Independent projects are clearly identified."
      />
      <SelectedWork full />
      <FinalCTA />
    </>
  );
}
