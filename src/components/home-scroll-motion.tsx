'use client';

import { useEffect } from 'react';

type ScrollEffect = {
  animation: Animation;
  anchor: HTMLElement;
  start: number;
  end: number;
  top: number;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function HomeScrollMotion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};

    const setup = () => {
      dispose();
      if (preference.matches) return;

      const page = document.querySelector<HTMLElement>('.home-page');
      const section = page?.querySelector<HTMLElement>('.home-statement');
      if (!page || !section) return;

      const compact = window.innerWidth < 768;
      const effects: ScrollEffect[] = [];
      let frame = 0;
      let position = window.scrollY;
      let disposed = false;

      const add = (
        selector: string,
        anchor: HTMLElement,
        keyframes: Keyframe[],
        start = 0.95,
        end = 0.25,
      ) => {
        page.querySelectorAll<HTMLElement>(selector).forEach((element) => {
          const animation = element.animate(keyframes, {
            duration: 1000,
            fill: 'both',
            easing: 'linear',
          });
          animation.pause();
          effects.push({ animation, anchor, start, end, top: 0 });
        });
      };

      add(
        '.statement-word:first-child',
        section,
        [
          { transform: `translate3d(${compact ? -45 : -180}px, 0, 0) rotate(-8deg)`, opacity: 0.15 },
          { transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: 1 },
        ],
      );
      add(
        '.statement-word:last-child',
        section,
        [
          { transform: `translate3d(${compact ? 45 : 180}px, 0, 0) rotate(8deg)`, opacity: 0.15 },
          { transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: 1 },
        ],
      );
      add(
        '.brain-sticker',
        section,
        [{ transform: 'scale(0.7) rotate(-18deg)' }, { transform: 'scale(1) rotate(5deg)' }],
        1,
        -0.35,
      );

      const update = () => {
        frame = 0;
        const target = window.scrollY;
        position += (target - position) * 0.18;
        if (Math.abs(target - position) < 0.25) position = target;
        const viewport = window.innerHeight;

        for (const effect of effects) {
          const from = effect.top - viewport * effect.start;
          const to = effect.top - viewport * effect.end;
          effect.animation.currentTime = clamp((position - from) / Math.max(1, to - from)) * 1000;
        }
        if (position !== target) frame = requestAnimationFrame(update);
      };
      const schedule = () => {
        if (!frame && !disposed) frame = requestAnimationFrame(update);
      };
      const measure = () => {
        const rect = section.getBoundingClientRect();
        for (const effect of effects) effect.top = rect.top + window.scrollY;
        schedule();
      };

      measure();
      const resize = new ResizeObserver(measure);
      resize.observe(page);
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', measure);

      dispose = () => {
        disposed = true;
        cancelAnimationFrame(frame);
        resize.disconnect();
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', measure);
        effects.forEach(({ animation }) => animation.cancel());
      };
    };

    setup();
    preference.addEventListener('change', setup);
    window.addEventListener('resize', setup);
    return () => {
      dispose();
      preference.removeEventListener('change', setup);
      window.removeEventListener('resize', setup);
    };
  }, []);

  return null;
}
