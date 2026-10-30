'use client';

import { useEffect, useId, useRef } from 'react';
import type { GeoPermissibleObjects } from 'd3-geo';
import initial from '@/lib/globe-initial.json';

export function SpinningGlobe() {
  const id = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const landRef = useRef<SVGPathElement>(null);
  const gridRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    let disposed = false;
    let loading = false;
    let inView = false;
    let frame = 0;
    let elapsed = 0;
    let previous = 0;
    let lastPaint = -Infinity;
    let draw: ((angle: number) => void) | undefined;

    const tick = (now: number) => {
      if (previous) elapsed += now - previous;
      previous = now;
      // 30fps suffices for a slow turn; avoid rebuilding paths at 120Hz.
      if (now - lastPaint >= 1000 / 30) {
        draw?.((elapsed % 30_000) * (360 / 30_000));
        lastPaint = now;
      }
      frame = requestAnimationFrame(tick);
    };

    const load = async () => {
      if (loading || disposed) return;
      loading = true;
      try {
        const [geo, response] = await Promise.all([
          import('d3-geo'),
          fetch('/art/globe-land.json', { signal: controller.signal }),
        ]);
        if (!response.ok) return;
        const land = (await response.json()) as GeoPermissibleObjects;
        if (disposed) return;
        const projection = geo
          .geoOrthographic()
          .translate([330, 254])
          .scale(205)
          .rotate([-20, -15, 0])
          .angle(18)
          .precision(0.35);
        const path = geo.geoPath(projection).digits(2);
        const grid = geo.geoGraticule().step([30, 30])();
        draw = (angle) => {
          projection.rotate([-20 - angle, -15, 0]);
          landRef.current?.setAttribute('d', path(land) ?? '');
          gridRef.current?.setAttribute('d', path(grid) ?? '');
        };
        sync();
      } catch {
        // The server-rendered SVG remains complete if the map cannot load.
      }
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      lastPaint = -Infinity;
      if (motion.matches) {
        elapsed = 0;
        landRef.current?.setAttribute('d', initial.land);
        gridRef.current?.setAttribute('d', initial.grid);
      } else if (inView && !document.hidden) {
        if (draw) frame = requestAnimationFrame(tick);
        else void load();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(svg);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div className="hero-main-art">
      <svg
        ref={svgRef}
        className="hero-globe-frame"
        viewBox="0 0 640 640"
        role="img"
        aria-labelledby={`${id}-title`}
      >
        <title id={`${id}-title`}>
          A rotating world globe in warm cream and charcoal on a sculpted stand
        </title>
        <defs>
          {/* Two printing inks, shared with the neighboring collage stickers. */}
          <pattern
            id={`${id}-sea`}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(25)"
          >
            <rect width="5" height="5" fill="#0a0a0a" />
            <circle cx="2.5" cy="2.5" r="0.55" fill="#f1ead6" opacity="0.7" />
          </pattern>
          <pattern id={`${id}-land`} width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="#f1ead6" />
            {Array.from({ length: 32 }, (_, i) => (
              <path
                key={i}
                d={`M${(i * 31 + 7) % 80} ${(i * 47 + 13) % 80}l${0.4 + (i % 4) * 0.3} ${i % 2 ? 0.5 : -0.4}`}
                stroke="#0a0a0a"
                strokeWidth={0.35 + (i % 3) * 0.2}
                strokeLinecap="round"
                opacity="0.55"
              />
            ))}
          </pattern>
          <pattern
            id={`${id}-shade`}
            width="4.5"
            height="4.5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(25)"
          >
            <circle cx="2.25" cy="2.25" r="1.15" fill="#0a0a0a" />
          </pattern>
          <radialGradient id={`${id}-shade-fade`} cx="30%" cy="24%" r="78%">
            <stop offset="0.2" stopColor="#000" />
            <stop offset="0.6" stopColor="#777" />
            <stop offset="1" stopColor="#fff" />
          </radialGradient>
          <mask id={`${id}-shade-mask`}>
            <circle cx="330" cy="254" r="205" fill={`url(#${id}-shade-fade)`} />
          </mask>
          <pattern
            id={`${id}-metal`}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-35)"
          >
            <rect width="5" height="5" fill="#f1ead6" />
            <path d="M0 0V5" stroke="#0a0a0a" strokeWidth="0.85" />
          </pattern>
          <filter
            id={`${id}-paper-edge`}
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology in="SourceGraphic" operator="dilate" radius="2" result="backing" />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.022"
              numOctaves="1"
              seed="12"
              result="paper"
            />
            <feDisplacementMap
              in="backing"
              in2="paper"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <clipPath id={`${id}-sphere`}>
            <circle cx="330" cy="254" r="205" />
          </clipPath>
        </defs>
        {/* Static cut-paper backing: the animated map never changes this outline. */}
        <g
          className="hero-globe-paper"
          fill="#f1ead6"
          stroke="#f1ead6"
          strokeLinejoin="round"
          filter={`url(#${id}-paper-edge)`}
        >
          <circle cx="330" cy="254" r="215" strokeWidth="1" />
          <g transform="rotate(-18 330 254)">
            <path
              d="M330 26A228 228 0 0 0 330 482"
              fill="none"
              strokeWidth="30"
              strokeLinecap="round"
            />
            <circle cx="330" cy="25" r="14" />
          </g>
          <path
            d="M400 468C398 516 353 530 351 554L351 580H322V553C324 523 372 508 376 468Z"
            strokeWidth="15"
          />
          <path d="M225 588V600C225 633 451 633 451 600V588Z" strokeWidth="14" />
          <ellipse cx="338" cy="588" rx="113" ry="27" strokeWidth="14" />
        </g>
        <g className="hero-globe-stand">
          <path
            d="M400 468C398 516 353 530 351 554L351 574H322V553C324 523 372 508 376 468Z"
            fill={`url(#${id}-metal)`}
            stroke="#0a0a0a"
            strokeWidth="3"
          />
          <path
            d="M225 588V600C225 633 451 633 451 600V588Z"
            fill="#0a0a0a"
            stroke="#f1ead6"
            strokeWidth="2"
          />
          <ellipse cx="338" cy="588" rx="113" ry="27" fill={`url(#${id}-metal)`} />
          <ellipse
            cx="338"
            cy="584"
            rx="98"
            ry="20"
            fill={`url(#${id}-sea)`}
            stroke="#f1ead6"
            strokeWidth="1.5"
          />
          <path d="M282 579Q338 565 394 579" fill="none" stroke="#f1ead6" strokeWidth="1" />
          <path
            d="M228 603C266 622 409 622 448 603"
            fill="none"
            stroke="#f1ead6"
            strokeWidth="1.5"
          />
          <g transform="rotate(-18 330 254)">
            <path d="M330 26A228 228 0 0 0 330 482" fill="none" stroke="#0a0a0a" strokeWidth="20" />
            <path
              d="M330 26A228 228 0 0 0 330 482"
              fill="none"
              stroke={`url(#${id}-metal)`}
              strokeWidth="13"
            />
            <path
              d="M330 26A228 228 0 0 0 330 482"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="1.5"
            />
            {Array.from({ length: 37 }, (_, i) => (
              <path
                key={i}
                d={`M330 23V${i % 3 === 0 ? 33 : 29}`}
                transform={`rotate(${-i * 5} 330 254)`}
                stroke="#0a0a0a"
                strokeWidth={i % 3 === 0 ? 1.5 : 1}
              />
            ))}
            <path d="M330 27V49M330 459V481" stroke="#f1ead6" strokeWidth="9" />
            <circle cx="330" cy="25" r="7" fill="#f1ead6" stroke="#0a0a0a" strokeWidth="2" />
          </g>
        </g>
        <circle cx="330" cy="254" r="208" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2" />
        <g clipPath={`url(#${id}-sphere)`}>
          <circle cx="330" cy="254" r="205" fill={`url(#${id}-sea)`} />
          <path
            ref={gridRef}
            className="hero-globe-grid"
            d={initial.grid}
            fill="none"
            stroke="#f1ead6"
            strokeWidth="0.75"
            opacity="0.4"
          />
          <path
            ref={landRef}
            className="hero-globe-land"
            d={initial.land}
            fill={`url(#${id}-land)`}
            stroke="#f1ead6"
            strokeWidth="0.45"
            strokeLinejoin="round"
          />
          <circle
            cx="330"
            cy="254"
            r="205"
            fill={`url(#${id}-shade)`}
            mask={`url(#${id}-shade-mask)`}
          />
        </g>
        <circle
          cx="330"
          cy="254"
          r="204.5"
          fill="none"
          stroke="#f1ead6"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        <path
          d="M158 159A198 198 0 0 1 347 57"
          fill="none"
          stroke="#f1ead6"
          strokeOpacity="0.65"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
