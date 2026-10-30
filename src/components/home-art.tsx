'use client';

import Image from 'next/image';
import { useEffect } from 'react';

export function HomeHeroArt() {
  return (
    <div className="home-hero-art">
      <Image
        className="hero-strip hero-glitch"
        src="/art/glitch-halftone-transparent.webp"
        width={686}
        height={919}
        alt="Black-and-cream halftone sticker of a person at a desk dissolving into streaming screens"
        sizes="9.64vw"
      />
      <Image
        className="hero-main-art"
        src="/art/globe-halftone-transparent.webp"
        width={820}
        height={820}
        alt="Black-and-cream halftone globe sticker on a stand, showing Africa and Europe"
        sizes="(max-width: 700px) 72vw, 500px"
        loading="eager"
        fetchPriority="high"
      />
      <Image
        className="hero-strip hero-laptop"
        src="/art/laptop-transparent.webp"
        width={820}
        height={822}
        alt="Halftone hands typing on a laptop"
        sizes="15vw"
      />
    </div>
  );
}

// Content is visible without JavaScript. Only off-screen sections are prepared
// for a reveal, so restored scroll positions and reduced motion remain usable.
export function RevealOnScroll() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll<HTMLElement>('.home-page [data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -24px 0px' },
    );

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight) return;
      section.classList.add('reveal-pending');
      observer.observe(section);
    });

    const showAll = () => {
      if (!motion.matches) return;
      observer.disconnect();
      sections.forEach((section) => section.classList.remove('reveal-pending'));
    };
    motion.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', showAll);
      sections.forEach((section) => section.classList.remove('reveal-pending'));
    };
  }, []);

  return null;
}
