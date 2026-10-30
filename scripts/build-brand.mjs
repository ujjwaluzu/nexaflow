// Projection helpers from Anatomy (MIT). See THIRD_PARTY_NOTICES.md.
import { mkdirSync, writeFileSync } from 'node:fs';
import { iso, pathOf, depthOf, fitProjection } from './lib/iso-kit.mjs';
const bounds = [];
for (const x of [-135, 145])
  for (const y of [-25, 101]) for (const z of [-22, 219]) bounds.push([x, y, z]);
const P = fitProjection(bounds, 700, 540, { pad: 28, azimuth: 58, elevation: 24 });
const project = (p) => iso(p, P);
const polygon = (pts) => pathOf(pts.map(project), true);
const parts = [];
const add = (pts, fill, name) =>
  parts.push({
    key: pts.reduce((sum, p) => sum + depthOf(p, P), 0) / pts.length,
    path: polygon(pts),
    fill,
    name,
  });
function prism(ring, y, depth, fill = '#b9c4d2', name = 'structural member') {
  const front = ring.map(([x, z]) => [x, y + depth, z]);
  const back = ring.map(([x, z]) => [x, y, z]);
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    add(
      [back[i], back[j], front[j], front[i]],
      ring[j][1] === ring[i][1] ? '#e0e5ec' : '#637183',
      name,
    );
  }
  add(front, fill, name);
}
function box(x, y, z, w, d, h, fill, name) {
  prism(
    [
      [x, z],
      [x + w, z],
      [x + w, z + h],
      [x, z + h],
    ],
    y,
    d,
    fill,
    name,
  );
}
// Parts: four feet, base and lip, two sole plates, two uprights, diagonal,
// four joint plates, 32 square fasteners, two caps, two rulers, 8 brackets.
for (const x of [-114, 100]) for (const y of [-8, 65]) box(x, y, -22, 14, 14, 8, '#252d38', 'foot');
box(-135, -25, -14, 280, 125, 10, '#27313e', 'baseplate');
box(-135, 99, -14, 280, 2, 10, '#48576a', 'baseplate lip');
for (const x of [-99, 76]) box(x - 10, 5, -4, 54, 60, 5, '#56677c', 'sole plate');
box(-98, 18, 1, 31, 38, 215, '#c6ced8', 'left upright');
box(77, 18, 1, 31, 38, 215, '#c6ced8', 'right upright');
prism(
  [
    [-67, 216],
    [-45, 216],
    [77, 40],
    [77, 1],
    [55, 1],
    [-67, 177],
  ],
  18,
  38,
  '#648cff',
  'diagonal brace',
);
for (const x of [-98, 77]) {
  box(x, 18, 216, 31, 38, 3, '#e0e5ec', 'end cap');
  for (const z of [8, 185]) {
    box(x + 3, 56, z, 25, 2, 25, '#909eaf', 'splice plate');
    for (const dx of [8, 20])
      for (const dz of [5, 19]) box(x + dx, 58, z + dz, 3, 2, 3, '#394658', 'square fastener');
  }
  for (const z of [60, 110]) {
    box(x, 18, z, 31, 2, 5, '#7d8fa5', 'rear cross member');
    box(x, 54, z, 31, 2, 5, '#a9b7c8', 'front cross member');
  }
}
for (const x of [-116, 122])
  for (const y of [0, 80]) box(x, y, -4, 5, 5, 2, '#a9b7c8', 'base fastener');
parts.sort((a, b) => a.key - b.key);
const guide = [];
for (let i = -5; i <= 5; i++) {
  guide.push(`<path d="${pathOf([project([-170, i * 35, -23]), project([190, i * 35, -23])])}"/>`);
  guide.push(`<path d="${pathOf([project([i * 35, -150, -23]), project([i * 35, 180, -23])])}"/>`);
}
for (const blueprint of [false, true]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 540"><defs><radialGradient id="floor"><stop stop-color="#283548" stop-opacity=".4"/><stop offset="1" stop-color="#101318" stop-opacity="0"/></radialGradient></defs><ellipse cx="350" cy="410" rx="315" ry="100" fill="url(#floor)"/><g fill="none" stroke="#4a5b70" stroke-width=".6" opacity=".28">${guide.join('')}</g><g stroke-linejoin="round" stroke-width="${blueprint ? '.8' : '.6'}" stroke="${blueprint ? '#648cff' : '#343e4b'}">${parts.map((p) => `<path d="${p.path}" fill="${blueprint ? '#101a2b' : p.fill}"/>`).join('')}</g></svg>`;
  mkdirSync('public/brand', { recursive: true });
  writeFileSync(`public/brand/structure${blueprint ? '-blueprint' : ''}.svg`, svg);
}
console.log(`Built structural identity: ${parts.length} projected faces.`);
