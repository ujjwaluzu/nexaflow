import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
const routes = [
  '/',
  '/services',
  '/services/web-engineering',
  '/services/software-engineering',
  '/services/ai-automation',
  '/services/digital-infrastructure',
  '/industries',
  '/industries/startups',
  '/industries/small-business',
  '/work',
  '/work/studio-website',
  '/about',
  '/process',
  '/contact',
  '/insights',
  '/insights/automate-the-handoff',
  '/insights/scope-a-useful-mvp',
  '/insights/reliable-enquiry-forms',
  '/privacy',
  '/terms',
  '/thank-you',
];
test('all public pages have a useful heading and unique metadata', async ({ page }) => {
  const titles = new Set();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    const title = await page.title();
    expect(title, route).not.toBe('');
    expect(titles.has(title), `duplicate title at ${route}`).toBe(false);
    titles.add(title);
    if (route != '/thank-you') {
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(new URL(canonical!).pathname).toBe(route);
    }
  }
});
test('navigation and project links work', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', {
    name: isMobile ? 'Mobile navigation' : 'Main navigation',
    exact: true,
  });
  await nav.getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
  await page.getByRole('link', { name: 'Explore web engineering', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Your website');
  await page.goto('/work');
  await page.getByRole('link', { name: 'Read the case study', exact: true }).click();
  await expect(page).toHaveURL(/\/work\/studio-website$/);
});
test('illustration controls and FAQ disclosures are accessible', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Blueprint', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Blueprint', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.goto('/services/ai-automation');
  const summary = page.locator('summary').first();
  await summary.click();
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
});
test('form gives accessible errors and saves a local enquiry end to end', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send project enquiry' }).click();
  await expect(page.locator('#name-error')).toBeVisible();
  await expect(page.locator('#name')).toBeFocused();
  await page.getByLabel('Full name').fill('QA Test Founder');
  await page.getByLabel('Email', { exact: false }).fill(`qa-${crypto.randomUUID()}@example.test`);
  await page.getByLabel('Company name').fill('Local QA only');
  await page.getByLabel('Country', { exact: false }).fill('India');
  await page.getByLabel('What can we help with?').selectOption('Web Engineering');
  await page
    .getByLabel('Tell us about your project')
    .fill(
      'This is a local test enquiry for the studio website. Verify the full validation and persistence workflow without contacting any live external service.',
    );
  await page.getByLabel('Budget currency').selectOption('Other');
  await page.getByLabel('Expected timeline').selectOption('Exploring options');
  await page.getByLabel('I agree that my details').check();
  await page.getByRole('button', { name: 'Send project enquiry' }).click();
  await expect(page).toHaveURL(/\/thank-you\?reference=.*&mode=local/, { timeout: 20000 });
  await expect(page.locator('main')).toContainText('no live email or CRM service was contacted');
  const id = new URL(page.url()).searchParams.get('reference');
  const stored = JSON.parse(
    await readFile(join(process.cwd(), '.local', 'enquiries', `${id}.json`), 'utf8'),
  );
  expect(stored.lead.name).toBe('QA Test Founder');
  expect(stored.deliveries[0].status).toBe('simulated');
});
test('form failure retains the entered values', async ({ page }) => {
  await page.goto('/contact');
  await page.route('**/api/enquiries', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Test-only service interruption.' }),
    }),
  );
  await page.getByLabel('Full name').fill('Failure Test');
  await page.getByLabel('Email', { exact: false }).fill('failure@example.test');
  await page.getByLabel('Country', { exact: false }).fill('India');
  await page.getByLabel('What can we help with?').selectOption('Not sure yet');
  await page
    .getByLabel('Tell us about your project')
    .fill(
      'A sufficiently detailed test enquiry to verify that a failed save retains the information in the form.',
    );
  await page.getByLabel('Expected timeline').selectOption('Exploring options');
  await page.getByLabel('I agree that my details').check();
  await page.getByRole('button', { name: 'Send project enquiry' }).click();
  await expect(page.locator('main').getByRole('alert')).toHaveText(
    'Test-only service interruption.',
  );
  await expect(page.getByLabel('Full name')).toHaveValue('Failure Test');
});
test('mobile menu supports keyboard dismissal', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});
test('key pages pass automated WCAG checks', async ({ page }) => {
  for (const route of [
    '/',
    '/contact',
    '/services/web-engineering',
    '/work/studio-website',
    '/privacy',
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      ),
    ).toEqual([]);
  }
});
test('layouts fit phone, tablet and desktop widths', async ({ page }) => {
  for (const width of [360, 390, 430, 768, 1024, 1440, 1720]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      '/',
      '/contact',
      '/services/software-engineering',
      '/work/studio-website',
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
});
test('missing pages return 404 and metadata routes work', async ({ page, request }) => {
  for (const path of ['/404', '/does-not-exist']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('reconnect');
  }
  for (const path of ['/sitemap.xml', '/robots.txt', '/opengraph-image'])
    expect((await request.get(path)).status()).toBe(200);
});
test('capture actual studio screenshots', async ({ page, isMobile }, testInfo) => {
  await mkdir('.local/visual', { recursive: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty('complete', true);
    expect(
      await image.evaluate((element: HTMLImageElement) => element.naturalWidth),
    ).toBeGreaterThan(0);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({
    path: `.local/visual/home-${testInfo.project.name}.png`,
    fullPage: true,
    scale: 'css',
  });
  await page.screenshot({ path: `.local/visual/hero-${testInfo.project.name}.png`, scale: 'css' });
  if (!isMobile) {
    await page.getByRole('button', { name: 'Blueprint', exact: true }).click();
    await page.screenshot({ path: '.local/visual/blueprint.png' });
  }
  await page.goto('/contact');
  await page.screenshot({
    path: `.local/visual/contact-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
