import { ArrowDownRight } from 'lucide-react';
import { HomeHeroArt, RevealOnScroll } from '@/components/home-art';
import { Button, FinalCTA } from '@/components/ui';
import {
  Capabilities,
  IndustriesPreview,
  ProcessPreview,
  SelectedWork,
  WhyStudio,
} from '@/components/sections';
import { metadata as makeMetadata } from '@/lib/seo';
import { brand } from '@/config/brand';
import './home.css';
export const metadata = makeMetadata(brand.heroHeadline.join(' '), brand.description, '/');
export default function Home() {
  return (
    <div className="home-page">
      <RevealOnScroll />
      <section className="home-hero">
        <div className="shell hero-copy">
          <HomeHeroArt />
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
        <div className="hero-baseline shell">
          <span className="mono">Clear thinking. Considered design. Dependable engineering.</span>
          <a href="#capabilities" className="mono">
            Explore the studio <ArrowDownRight size={17} />
          </a>
        </div>
      </section>
      <WhyStudio />
      <Capabilities />
      <SelectedWork editorial />
      <ProcessPreview />
      <IndustriesPreview />
      <FinalCTA editorial />
    </div>
  );
}
