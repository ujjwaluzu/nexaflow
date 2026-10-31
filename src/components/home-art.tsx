import { SpinningGlobe } from './spinning-globe';

export function HomeHeroArt() {
  return (
    <div className="home-hero-art">
      <span className="hero-side-word hero-side-enhanced" aria-hidden="true">
        Enhance
      </span>
      <SpinningGlobe />
      <span className="hero-side-word hero-side-around" aria-hidden="true">
        Around
      </span>
    </div>
  );
}
