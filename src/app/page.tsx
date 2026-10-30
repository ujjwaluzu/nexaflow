import { ArrowDownRight } from 'lucide-react';
import { HeroGraphic } from '@/components/hero-graphic';
import { Button, FinalCTA, Label } from '@/components/ui';
import {
  Capabilities,
  IndustriesPreview,
  ProcessPreview,
  SelectedWork,
  WhyStudio,
} from '@/components/sections';
import { metadata as makeMetadata } from '@/lib/seo';
import { brand } from '@/config/brand';
export const metadata = makeMetadata(brand.heroHeadline.join(' '), brand.description, '/');
export default function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <Label>Independent digital engineering studio</Label>
          <h1>
            {brand.heroHeadline.map((line, index) => (
              <span key={index}>
                {index > 0 && <br />}
                {line.replace(/\.$/, '')}
                {line.endsWith('.') && <span className="accent">.</span>}
              </span>
            ))}
          </h1>
          <p className="hero-statement">{brand.statement}</p>
          <p className="hero-description">
            From high-performance websites to custom software and intelligent automation, we turn
            complex business challenges into working digital solutions.
          </p>
          <div className="hero-actions">
            <Button href="/contact">Start a project</Button>
            <Button href="/work" secondary>
              Explore our work
            </Button>
          </div>
        </div>
        <HeroGraphic />
        <div className="hero-baseline">
          <span className="mono">Clear thinking. Considered design. Dependable engineering.</span>
          <a href="#capabilities" className="mono">
            Explore the studio <ArrowDownRight size={17} />
          </a>
        </div>
      </section>
      <Capabilities />
      <SelectedWork />
      <WhyStudio />
      <ProcessPreview />
      <IndustriesPreview />
      <FinalCTA />
    </>
  );
}
