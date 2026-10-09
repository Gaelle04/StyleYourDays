import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium, expect } from '@playwright/test';

const root = resolve('dist/styleyourdays/browser');
const contentTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};
let server, browser, origin;

before(async () => {
  server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = resolve(root, '.' + pathname);
      if (!file.startsWith(root + '/') && file !== root) {
        res.writeHead(403).end();
        return;
      }
      if (!extname(pathname)) file = resolve(root, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, {
        'Content-Type': contentTypes[extname(file)] || 'application/octet-stream',
      });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  const executablePath =
    process.env.CHROMIUM_PATH ||
    (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
});
after(async () => {
  await browser?.close();
  if (server?.listening) await new Promise((resolve) => server.close(resolve));
});

for (const [route, heading, title, count] of [
  ['/', 'Style your days', 'SYD', 0],
  ['/about', 'About SYD', 'About | SYD', 0],
  ['/foryou', 'For You', 'For You | SYD', 16],
  ['/latesttrends', 'The Latest Trends', 'The Latest Trends | SYD', 12],
  ['/missing-page', 'Page not found', 'Page not found | SYD', 0],
]) {
  test(`direct route ${route} renders without browser errors`, async () => {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(origin + route);
    await page
      .getByRole('heading', { name: heading, level: 1, exact: true })
      .waitFor({ state: 'attached' });
    assert.equal(await page.title(), title);
    assert.equal(await page.locator('.outfit-grid li').count(), count);
    for (const image of await page.locator('.outfit-grid img').all()) {
      const response = await page.request.get(
        new URL(await image.getAttribute('src'), origin).href,
      );
      assert.equal(response.status(), 200, 'original gallery image exists');
    }
    assert.deepEqual(errors, []);
    await page.close();
  });
}

test('navigation stays in Angular and updates the current page', async () => {
  const page = await browser.newPage();
  await page.goto(origin);
  await page.evaluate(() => {
    window.navigationMarker = 'same-document';
  });
  for (const [name, route] of [
    ['For You', '/foryou'],
    ['Latest Trends', '/latesttrends'],
    ['About', '/about'],
    ['Home', '/'],
  ]) {
    await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
    await page.waitForURL(origin + route);
    await page.locator(`nav a[aria-current="page"]`).waitFor();
    assert.equal(await page.evaluate(() => window.navigationMarker), 'same-document');
    assert.equal(await page.locator('nav a[aria-current="page"]').textContent(), name);
  }
  await page.close();
});

test('gallery search filters, reports empty results, and clears', async () => {
  const page = await browser.newPage();
  await page.goto(origin + '/latesttrends');
  const search = page.getByRole('searchbox', { name: 'Search your style' });
  await search.fill('  MiDi  ');
  await page.getByRole('status').filter({ hasText: '1 outfit found' }).waitFor();
  assert.equal(await page.locator('.outfit-grid li').count(), 1);
  assert.match(await page.locator('.outfit-grid a').getAttribute('href'), /38210296831207592/);
  await search.fill('no-matching-outfit');
  await page.getByText('No outfits match your search. Try a different style.').waitFor();
  assert.equal(await page.locator('.outfit-grid li').count(), 0);
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.outfit-grid li')).toHaveCount(12);
  await page.close();
});

test('all pages fit a mobile viewport and gallery assets load', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const route of ['/', '/about', '/foryou', '/latesttrends']) {
    await page.goto(origin + route);
    await page.locator('main h1').waitFor({ state: 'attached' });
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `${route} has no horizontal overflow`,
    );
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        (img) => img.complete && img.naturalWidth > 0,
        await image.elementHandle(),
      );
    }
  }
  await page.close();
});

test('browser history and refresh retain the selected route', async () => {
  const page = await browser.newPage();
  await page.goto(origin);
  await page.getByRole('navigation').getByRole('link', { name: 'For You', exact: true }).click();
  await expect(page.locator('.outfit-grid li')).toHaveCount(16);
  await page.getByRole('navigation').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'About SYD' })).toBeVisible();
  await page.goBack();
  await expect(page.locator('.outfit-grid li')).toHaveCount(16);
  await page.reload();
  await expect(page.locator('.outfit-grid li')).toHaveCount(16);
  assert.equal(new URL(page.url()).pathname, '/foryou');
  await page.close();
});

test('keyboard skip link and back to top stay on the gallery route', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(origin + '/foryou');
  await expect(page.locator('.outfit-grid li')).toHaveCount(16);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  assert.equal(new URL(page.url()).pathname, '/foryou');
  await page.locator('#moreideas').scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: 'Back to top' }).click();
  await expect(page).toHaveURL(origin + '/foryou#main-content');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(200);
  await expect(page.locator('.outfit-grid li')).toHaveCount(16);
  await page.close();
});

test('For You search matches descriptive styles and clears whitespace', async () => {
  const page = await browser.newPage();
  await page.goto(origin + '/foryou');
  const search = page.getByRole('searchbox', { name: 'Search your style' });
  await search.fill('boots');
  await expect(page.locator('.outfit-grid li')).toHaveCount(1);
  await expect(page.locator('.outfit-grid img')).toHaveAttribute('alt', /knee-high boots/);
  await search.fill('   ');
  await expect(page.locator('.outfit-grid li')).toHaveCount(16);
  await page.close();
});

test('pages pass automated WCAG A and AA accessibility checks', async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const route of ['/', '/about', '/foryou', '/latesttrends', '/missing-page']) {
    await page.goto(origin + route);
    await page.locator('main h1').waitFor({ state: 'attached' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    assert.deepEqual(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      [],
      route,
    );
  }
  await context.close();
});
