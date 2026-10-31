import { expect, test } from '@playwright/test';

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
  '/404',
];

for (const width of [320, 360, 390, 430, 639, 640, 768, 899, 900, 1023, 1024, 1440, 1920, 2560]) {
  test(`public pages fit a ${width}px viewport`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);

      const layout = await page.evaluate(() => {
        const clipped = [
          ...document.querySelectorAll<HTMLElement>(
            'main h1, main h2, main h3, main p, main a, .statement-word, .footer-grid a',
          ),
        ]
          .filter((element) => {
            if (!element.getBoundingClientRect().width) return false;
            const range = document.createRange();
            range.selectNodeContents(element);
            const outsideViewport = [...range.getClientRects()].some(
              (rect) => rect.left < -1 || rect.right > innerWidth + 1,
            );
            const outsideBox =
              getComputedStyle(element).display !== 'inline' &&
              element.scrollWidth > element.clientWidth + 2;
            return outsideViewport || outsideBox;
          })
          .map((element) => element.textContent?.slice(0, 100));

        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          clipped,
        };
      });

      expect(layout.overflow, `${route} at ${width}px scrolls horizontally`).toBe(false);
      expect(layout.clipped, `${route} at ${width}px clips content`).toEqual([]);
    }
  });
}

test('navigation stays reachable in landscape and closes across the desktop breakpoint', async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 360 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
  await toggle.click();
  await expect(mobileNav).toBeVisible();
  const contact = mobileNav.getByRole('link', { name: 'Start a project' });
  await contact.scrollIntoViewIfNeeded();
  await expect(contact).toBeInViewport();
  await contact.click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(mobileNav).toBeHidden();

  await toggle.click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(mobileNav).toBeHidden();
  await expect(toggle).toBeHidden();
  await expect(
    page.getByRole('navigation', { name: 'Main navigation', exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 900, height: 360 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
