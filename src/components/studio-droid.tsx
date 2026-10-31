'use client';

import { useEffect, useId, useRef } from 'react';

// Adapted from CrewLabs' FeatureDroid: the same chassis, dome and three-leg rig,
// redrawn in the two printing inks used by NEXORA's hero globe.
export function StudioDroid() {
  const id = useId().replace(/:/g, '');
  const ref = useRef<SVGSVGElement>(null);
  const ink = '#0a0a0a';
  const paper = '#f1ead6';
  const lime = '#c6ff35';
  const fill = (name: string) => `url(#${id}-${name})`;

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    let inView = false;
    const sync = () => {
      svg.dataset.running = String(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(svg);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <svg
      ref={ref}
      className="studio-droid"
      viewBox="0 40 320 410"
      role="img"
      aria-labelledby={`${id}-title`}
    >
      <title id={`${id}-title`}>
        An animated astromech droid in cream and charcoal halftone with lime indicator lights
      </title>
      <defs>
        <pattern id={`${id}-paper`} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill={paper} />
          {Array.from({ length: 24 }, (_, i) => (
            <path
              key={i}
              d={`M${(i * 13 + 3) % 40} ${(i * 23 + 7) % 40}l${0.3 + (i % 3) * 0.3} ${i % 2 ? 0.6 : -0.4}`}
              stroke={ink}
              strokeWidth={0.3 + (i % 3) * 0.15}
              opacity="0.55"
            />
          ))}
        </pattern>
        <pattern
          id={`${id}-halftone`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(25)"
        >
          <rect width="3" height="3" fill={paper} />
          <circle cx="1.5" cy="1.5" r="0.85" fill={ink} />
        </pattern>
        <pattern
          id={`${id}-dark`}
          width="3.5"
          height="3.5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(25)"
        >
          <rect width="3.5" height="3.5" fill={ink} />
          <circle cx="1.75" cy="1.75" r="0.4" fill={paper} />
        </pattern>
        <pattern
          id={`${id}-steel`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-35)"
        >
          <rect width="3" height="3" fill={paper} />
          <path d="M0 0V3" stroke={ink} strokeWidth="0.85" />
        </pattern>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0.12" stopColor="black" />
          <stop offset="0.58" stopColor="#777" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <mask
          id={`${id}-shade-mask`}
          maskUnits="userSpaceOnUse"
          x="20"
          y="60"
          width="280"
          height="380"
        >
          <rect x="20" y="60" width="280" height="380" fill={fill('shade')} />
        </mask>
        <clipPath id={`${id}-dome-clip`}>
          <path d="M88 146A72 72 0 0 1 232 146Z" />
        </clipPath>
      </defs>

      <g className="studio-droid-suspension">
        <g className="studio-droid-body">
          {/* An irregular cream backing matches the hero's cut-paper outline. */}
          <path
            d="M80 146L79 130 84 114 86 105 95 92 103 84 116 75 128 70 143 66 155 67 169 65 185 69 198 74 210 82 220 92 228 107 234 121 238 144 266 148 282 151 286 163 285 215 287 260 284 301 285 339 280 349 279 367 288 371 291 386 294 391 297 403 291 423 286 433 270 435 247 433 229 435 222 426 218 405 221 391 226 387 226 372 191 368 181 385 182 397 186 405 185 425 178 437 160 441 144 438 136 430 134 414 138 398 138 386 129 369 94 369 94 387 101 393 101 405 94 426 89 434 65 433 47 435 31 432 27 419 22 402 25 393 33 385 32 371 38 366 37 349 34 342 35 299 33 256 35 212 34 168 37 152 53 147Z"
            fill={fill('paper')}
            stroke={paper}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* CrewLabs' mirrored side legs, shoulder hubs and hydraulic shins. */}
          {[false, true].map((mirror) => (
            <g key={String(mirror)} transform={mirror ? 'translate(320 0) scale(-1 1)' : undefined}>
              <rect
                x="42"
                y="156"
                width="44"
                height="180"
                rx="9"
                fill={fill('paper')}
                stroke={ink}
                strokeWidth="2"
              />
              <rect x="64" y="157" width="20" height="177" rx="8" fill={fill('halftone')} />
              <rect x="50" y="178" width="28" height="11" rx="2" fill={ink} />
              <path d="M50 200H78M46 232H82M52 262L76 268M50 310H78" stroke={ink} strokeWidth="1" />
              <path d="M48 208V225M48 242V300" stroke={paper} strokeWidth="2" />
              <circle cx="88" cy="176" r="18" fill={fill('steel')} stroke={ink} strokeWidth="2" />
              <circle cx="88" cy="176" r="8" fill={ink} />
              <circle cx="86" cy="174" r="3" fill={paper} />
              <rect
                x="56"
                y="330"
                width="16"
                height="52"
                fill={fill('steel')}
                stroke={ink}
                strokeWidth="1.5"
              />
              <path d="M60 334V376" stroke={paper} strokeWidth="2" />
              <rect
                x="44"
                y="326"
                width="40"
                height="16"
                rx="5"
                fill={fill('halftone')}
                stroke={ink}
                strokeWidth="1.5"
              />
              <rect
                x="40"
                y="374"
                width="48"
                height="24"
                rx="7"
                fill={fill('paper')}
                stroke={ink}
                strokeWidth="2"
              />
              <circle cx="64" cy="386" r="5" fill={ink} />
              <path d="M30 396H98L90 426H38Z" fill={fill('paper')} stroke={ink} strokeWidth="2" />
              <path d="M70 397H97L90 424H70Z" fill={fill('halftone')} />
              <path d="M38 420H92L90 426H38Z" fill={ink} />
              <path d="M41 404H59M43 409H56" stroke={ink} strokeWidth="1.5" />
            </g>
          ))}

          <rect
            x="146"
            y="350"
            width="28"
            height="36"
            rx="4"
            fill={fill('steel')}
            stroke={ink}
            strokeWidth="2"
          />
          <g className="studio-droid-centre-leg">
            <rect x="151" y="376" width="18" height="26" rx="3" fill={fill('steel')} stroke={ink} />
            <circle cx="160" cy="414" r="19" fill={ink} stroke={paper} strokeWidth="1.5" />
            <circle cx="160" cy="414" r="11" fill={fill('steel')} />
            <g className="studio-droid-wheel">
              <path
                d="M160 404V424M150 414H170M153 407L167 421M167 407L153 421"
                stroke={ink}
                strokeWidth="2"
              />
            </g>
            <circle cx="160" cy="414" r="3.5" fill={paper} stroke={ink} />
          </g>

          <rect
            x="88"
            y="146"
            width="144"
            height="214"
            rx="13"
            fill={fill('paper')}
            stroke={ink}
            strokeWidth="2.5"
          />
          <rect
            x="88"
            y="146"
            width="144"
            height="214"
            rx="13"
            fill={fill('halftone')}
            mask={fill('shade-mask')}
          />
          <path d="M94 155V342" stroke={paper} strokeWidth="3" />
          <rect
            x="92"
            y="138"
            width="136"
            height="15"
            rx="7"
            fill={fill('steel')}
            stroke={ink}
            strokeWidth="2"
          />
          <path d="M98 142H222" stroke={paper} strokeWidth="2" />

          {[162, 320].map((y) => (
            <g key={y}>
              <rect x="96" y={y} width="128" height="17" rx="3" fill={fill('dark')} stroke={ink} />
              <path d={`M100 ${y + 3}H220`} stroke={paper} strokeWidth="1.5" />
              <path d={`M104 ${y + 10}H147M167 ${y + 10}H211`} stroke={paper} strokeWidth="0.7" />
            </g>
          ))}

          <rect
            x="112"
            y="188"
            width="96"
            height="34"
            rx="4"
            fill={ink}
            stroke={paper}
            strokeWidth="0.8"
          />
          {[122, 140, 158, 176, 194].map((x, i) => (
            <rect
              key={x}
              x={x}
              y="195"
              width="11"
              height="6"
              rx="0.5"
              fill={i === 0 ? lime : paper}
              className="studio-droid-status"
              style={{ animationDelay: `${i * -0.6}s` }}
            />
          ))}
          <path
            d="M122 210H196"
            stroke={paper}
            strokeWidth="2"
            strokeDasharray="2 3"
            opacity="0.5"
          />
          <path className="studio-droid-progress" d="M122 210H196" stroke={lime} strokeWidth="2" />

          {[100, 166].map((x) => (
            <g key={x}>
              <rect x={x} y="232" width="54" height="24" rx="3" fill={ink} />
              {[238, 244, 250].map((y) => (
                <path key={y} d={`M${x + 5} ${y}h44`} stroke={paper} strokeWidth="1.5" />
              ))}
              <rect
                x={x}
                y="268"
                width="54"
                height="44"
                rx="3"
                fill={fill('steel')}
                stroke={ink}
                strokeWidth="1.5"
              />
              <rect
                x={x + 5}
                y="273"
                width="44"
                height="34"
                rx="1"
                fill={fill('paper')}
                stroke={ink}
              />
              {[276, 304].flatMap((y) =>
                [x + 8, x + 46].map((cx) => (
                  <circle key={`${cx}-${y}`} cx={cx} cy={y} r="1.5" fill={ink} />
                )),
              )}
              <path d={`M${x + 13} 280h26m-26 4h18`} stroke={ink} strokeWidth="0.8" />
            </g>
          ))}
          <rect
            x="90"
            y="342"
            width="140"
            height="18"
            rx="5"
            fill={fill('steel')}
            stroke={ink}
            strokeWidth="2"
          />
          <path d="M98 347H221" stroke={paper} strokeWidth="1.5" />
          <path d="M108 296L130 288M186 236L200 231" stroke={ink} strokeWidth="0.7" opacity="0.5" />
          <path d="M145 352h30" stroke={ink} strokeWidth="2" />

          {/* The face moves across a fixed hemisphere, like the hero's map. */}
          <g className="studio-droid-head">
            <path
              d="M88 146A72 72 0 0 1 232 146Z"
              fill={fill('paper')}
              stroke={ink}
              strokeWidth="2"
            />
            <g clipPath={fill('dome-clip')}>
              <path
                d="M88 146A72 72 0 0 1 232 146Z"
                fill={fill('halftone')}
                mask={fill('shade-mask')}
              />
              <g className="studio-droid-scan">
                <path
                  d="M108 146L124 92H137L128 146ZM212 146L196 92H183L192 146Z"
                  fill={fill('dark')}
                  stroke={ink}
                />
                <path d="M160 74V128M132 80L142 128M188 80L178 128" stroke={ink} strokeWidth="1" />
                <rect x="76" y="126" width="168" height="12" fill={fill('dark')} />
                <path d="M76 128H244" stroke={paper} strokeWidth="1" />
                <rect x="76" y="138" width="168" height="10" fill={ink} />
                <rect
                  x="152"
                  y="80"
                  width="16"
                  height="9"
                  rx="2"
                  fill={fill('steel')}
                  stroke={ink}
                />
                <circle cx="160" cy="81" r="3" fill={ink} />
                <circle
                  cx="160"
                  cy="106"
                  r="21"
                  fill={fill('steel')}
                  stroke={ink}
                  strokeWidth="1.5"
                />
                <circle cx="160" cy="106" r="17" fill={ink} stroke={paper} strokeWidth="0.7" />
                <g className="studio-droid-eye">
                  <circle cx="160" cy="106" r="10" fill={lime} />
                  <circle cx="161" cy="107" r="6" fill={ink} />
                  <circle cx="157" cy="103" r="2" fill={paper} />
                  <path d="M153 111L167 101" stroke={paper} strokeWidth="0.6" opacity="0.6" />
                </g>
                {[126, 194].map((x) => (
                  <g key={x}>
                    <circle cx={x} cy="120" r="6.5" fill={ink} stroke={paper} strokeWidth="0.8" />
                    <circle cx={x - 1} cy="119" r="2.5" fill={paper} />
                  </g>
                ))}
                {[100, 110, 120, 190, 200, 210].map((x, i) => (
                  <rect
                    key={x}
                    x={x}
                    y="140"
                    width="7"
                    height="4"
                    rx="0.5"
                    fill={i === 3 ? lime : paper}
                    className="studio-droid-status"
                    style={{ animationDelay: `${i * -0.4}s` }}
                  />
                ))}
              </g>
              <path d="M104 109Q115 85 144 81" fill="none" stroke={paper} strokeWidth="2" />
            </g>
            <path d="M88 146A72 72 0 0 1 232 146" fill="none" stroke={ink} strokeWidth="2" />
            <path d="M90 147H230" stroke={ink} strokeWidth="2" />
          </g>
        </g>
      </g>
    </svg>
  );
}
