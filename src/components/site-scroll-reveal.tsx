'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const revealSelector = 'main section:not(.home-hero):not(.home-statement), main > article';

export function SiteScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-scroll-revealed');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    );

    const elements = document.querySelectorAll<HTMLElement>(revealSelector);
    const pending: HTMLElement[] = [];

    elements.forEach((element) => {
      if (element.getBoundingClientRect().top <= window.innerHeight) return;
      element.classList.add('is-scroll-reveal-pending');
      pending.push(element);
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      pending.forEach((element) => {
        element.classList.remove('is-scroll-reveal-pending', 'is-scroll-revealed');
      });
    };
  }, [pathname]);

  return null;
}
