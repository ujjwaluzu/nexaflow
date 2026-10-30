# Prompt: redesign the NEXORA home page

Redesign the home page of my site (NEXORA, an independent digital engineering studio) to match the attached `index.html` and the images in `assets/`. Use `index.html` as the visual source of truth and rebuild it inside my existing project, in my current stack and component structure. Keep my existing copy, routes and SEO metadata unless I say otherwise.

## Design direction
- Dark editorial look: near-black `#0a0a0a` ground, cream `#f1ead6` text, one small orange accent `#ff7a3d` (the full stop in the hero and the question mark in the closing call to action).
- Display type: Anton, uppercase, very large, tight line-height. Body: Manrope. Labels: IBM Plex Mono, small, uppercase, letter-spaced.
- Art: black-and-cream halftone, wireframe and sticker artwork (the files in `assets/`), with hairline circles as a layout device. Keep this handmade, print-meets-tech feel. Do not add gradients, glassmorphism or stock illustration.
- References: Mint & Marble (condensed type, split "WE ... BUILD" headline, oversized circles) and Terrixa (pale grey section, rounded outlined cards alternating with solid black cards, pill buttons with arrows, thin rules).

## Sections, in order
1. Nav: wordmark, links, outlined "Start a project" pill.
2. Hero: huge "Built around your business." headline overlapping the handshake art, glitch photo left, laptop sticker right (hidden below 900px), two pill CTAs.
3. Statement: "We [brain sticker + short paragraph] Build".
4. Capabilities: four tall arch-shaped cards (Web Engineering, Software Engineering, AI & Automation, Digital Infrastructure). The first is filled cream.
5. Selected work: the NEXORA studio website with the mechanical-hand art, the stack line, and the independent-build disclaimer.
6. Process: pale grey section (`#e7ebf1`), five rounded cards alternating outlined and solid black.
7. Where we can help: Startups and Small businesses cards, sector pills, and the "not a list of existing clients" note.
8. Closing call to action: "Have something worth building?" with concentric hairline circles.
9. Footer: four columns.

## Requirements
- Fully responsive. Grids collapse to one column on phones and nothing scrolls sideways.
- Accessible: real `<a>` and `<button>` elements, visible focus states, alt text on all art, text contrast of at least 4.5:1.
- Optimise the images (WebP or AVIF, lazy-loaded below the fold, explicit width and height).
- Add subtle motion only: a fade-up on scroll, and a slow float on the hero art. Respect `prefers-reduced-motion`.
- Do not change the copy, add invented stats or client logos, or add placeholder text.

## Deliverable
Rebuild the page, list the files you changed, and tell me anything in `index.html` you could not reproduce.
