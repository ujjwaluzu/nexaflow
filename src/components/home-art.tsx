'use client';

import { useEffect } from 'react';
import { SpinningGlobe } from './spinning-globe';

export function HomeHeroArt() {
  return (
    <div className="home-hero-art">
      <span className="hero-side-word hero-side-built" aria-hidden="true">
        Built
      </span>
      <SpinningGlobe />
      <span className="hero-side-word hero-side-around" aria-hidden="true">
        Around
      </span>
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
