// Run the production E2E screenshot test before this command. Images are actual captures.
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';
await mkdir('public/projects', { recursive: true });
await sharp('.local/visual/hero-desktop.png')
  .extract({ left: 0, top: 0, width: 1440, height: 900 })
  .resize(1400)
  .webp({ quality: 85 })
  .toFile('public/projects/studio-cover.webp');
await sharp('.local/visual/hero-mobile.png')
  .resize(430)
  .webp({ quality: 85 })
  .toFile('public/projects/studio-mobile.webp');
console.log('Updated actual desktop and mobile project captures.');
