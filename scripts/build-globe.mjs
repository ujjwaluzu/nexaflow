// Rebuild the server-rendered first frame after updating the local land geometry.
// Keep this projection in sync with spinning-globe.tsx.
import { readFile, writeFile } from 'node:fs/promises';
import { geoGraticule, geoOrthographic, geoPath } from 'd3-geo';

const land = JSON.parse(
  await readFile(new URL('../public/art/globe-land.json', import.meta.url), 'utf8'),
);
const projection = geoOrthographic()
  .translate([330, 254])
  .scale(205)
  .rotate([-20, -15, 0])
  .angle(18)
  .precision(0.35);
const path = geoPath(projection).digits(2);
const frame = { land: path(land), grid: path(geoGraticule().step([30, 30])()) };
await writeFile(
  new URL('../src/lib/globe-initial.json', import.meta.url),
  JSON.stringify(frame) + '\n',
);
