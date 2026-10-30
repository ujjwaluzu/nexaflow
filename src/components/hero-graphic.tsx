'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
export function HeroGraphic() {
  const [blueprint, setBlueprint] = useState(false);
  const reduced = useReducedMotion();
  return (
    <figure className="hero-figure">
      <div className="figure-top mono">
        <span>
          <i className="status-dot" />
          Connected by design
        </span>
        <span>FIG. 01</span>
      </div>
      <motion.div
        className="hero-object"
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        whileHover={reduced ? undefined : { y: -5 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <Image
          src={blueprint ? '/brand/structure-blueprint.svg' : '/brand/structure.svg'}
          alt="A structural N: two bolted steel uprights connected by a blue diagonal brace on a shared foundation"
          width={700}
          height={540}
          priority
        />
      </motion.div>
      <figcaption className="figure-bottom">
        <div className="figure-mode" role="group" aria-label="Illustration view">
          <button onClick={() => setBlueprint(false)} aria-pressed={!blueprint}>
            Assembled
          </button>
          <button onClick={() => setBlueprint(true)} aria-pressed={blueprint}>
            Blueprint
          </button>
        </div>
        <span className="mono" aria-live="polite">
          {blueprint ? '02 / STRUCTURE' : '01 / ASSEMBLY'}
        </span>
      </figcaption>
    </figure>
  );
}
