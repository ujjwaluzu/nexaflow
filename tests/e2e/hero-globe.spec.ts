import { expect, test } from '@playwright/test';

const globeName = 'A rotating world globe in warm cream and charcoal on a sculpted stand';

test('the SVG map turns while its stand stays fixed and pauses offscreen', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const land = page.locator('.hero-globe-land');
  const stand = page.locator('.hero-globe-stand');
  await expect(page.getByRole('img', { name: globeName })).toBeVisible();
  const first = await land.getAttribute('d');
  await expect.poll(() => land.getAttribute('d')).not.toBe(first);
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  const bounds = await stand.boundingBox();
  const standMarkup = await stand.innerHTML();
  const start = await land.getAttribute('d');
  for (let quarter = 0; quarter < 4; quarter++) {
    const before = await land.getAttribute('d');
    await page.clock.fastForward(7500);
    expect(await land.getAttribute('d')).not.toBe(before);
    expect(await stand.innerHTML()).toBe(standMarkup);
    expect(await stand.boundingBox()).toEqual(bounds);
  }
  expect(start).toMatch(/^M/);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  await page.clock.runFor(100);
  const paused = await land.getAttribute('d');
  await page.clock.fastForward(3000);
  expect(await land.getAttribute('d')).toBe(paused);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.clock.runFor(100);
  await page.clock.fastForward(3000);
  expect(await land.getAttribute('d')).not.toBe(paused);
});

test('reduced motion keeps the SVG still and responds to preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  const mapRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('/globe-land.json')) mapRequests.push(request.url());
  });
  await page.goto('/');
  const land = page.locator('.hero-globe-land');
  const initial = await land.getAttribute('d');
  await page.clock.fastForward(3000);
  expect(await land.getAttribute('d')).toBe(initial);
  expect(mapRequests).toHaveLength(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => land.getAttribute('d')).not.toBe(initial);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(land).toHaveAttribute('d', initial!);
  await page.clock.fastForward(3000);
  expect(await land.getAttribute('d')).toBe(initial);
});

test('a failed map download leaves a complete static SVG', async ({ page }) => {
  await page.route('**/art/globe-land.json', (route) => route.abort());
  const failed = page.waitForEvent('requestfailed', (request) =>
    request.url().endsWith('/globe-land.json'),
  );
  await page.goto('/');
  await failed;
  await expect(page.getByRole('img', { name: globeName })).toBeVisible();
  await expect(page.locator('.hero-globe-land')).toHaveAttribute('d', /^M.+Z$/);
  await expect(page.locator('.hero-globe-stand')).toBeVisible();
});

test('the complete SVG globe is visible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('img', { name: globeName })).toBeVisible();
  await expect(page.locator('.hero-globe-land')).toHaveAttribute('d', /^M.+Z$/);
  await expect(page.locator('.hero-globe-stand')).toBeVisible();
  await context.close();
});
