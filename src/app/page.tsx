import Image from 'next/image';
import { HomeHeroArt } from '@/components/home-art';
import { HomeScrollMotion } from '@/components/home-scroll-motion';
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
  const heroWords = brand.heroHeadline[1].replace(/\.$/, '').split(' ');

  return (
    <div className="home-page">
      <HomeScrollMotion />
      <section className="home-hero">
        <div className="shell hero-copy">
          <HomeHeroArt />
          <h1 aria-label={brand.heroHeadline.join(' ')}>
            <span className="hero-word-art" aria-hidden="true">
              <Image
                className="hero-word-image hero-word-glitch"
                src="/art/glitch-halftone-transparent.webp"
                width={686}
                height={919}
                alt=""
                sizes="(max-width: 639px) 28vw, 220px"
              />
              <Image
                className="hero-word-image hero-word-laptop"
                src="/art/laptop-transparent.webp"
                width={820}
                height={822}
                alt=""
                sizes="(max-width: 639px) 34vw, 270px"
              />
            </span>
            <span aria-hidden="true">
              {heroWords.slice(0, -1).join(' ')}{' '}
              <span className="accent">{heroWords.at(-1)}</span>
              <span className="accent">.</span>
            </span>
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
