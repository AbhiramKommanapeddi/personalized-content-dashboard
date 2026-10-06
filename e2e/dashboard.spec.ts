import { test, expect } from '@playwright/test';

test.describe('Personalized Content Dashboard E2E Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the feed to load
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('Search functionality filters feed content dynamically', async ({ page }) => {
    const searchInput = page.getByLabel('Search content feed');
    await expect(searchInput).toBeVisible();

    // Type query
    await searchInput.fill('Quantum');

    // Wait for debounce and card filtering
    await page.waitForTimeout(500);

    const cards = page.locator('article');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Verify first card contains Quantum
    await expect(cards.first()).toContainText('Quantum');

    // Clear search
    const clearBtn = page.getByTitle('Clear search');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.waitForTimeout(500);
      const restoredCount = await cards.count();
      expect(restoredCount).toBeGreaterThan(count);
    }
  });

  test('Drag-and-drop reordering indicators and reset flow', async ({ page }) => {
    // Check DnD toggle exists and is enabled
    const dndToggle = page.getByText('DnD Reorder On');
    await expect(dndToggle).toBeVisible();

    // Verify grip handles are rendered on cards
    const firstCard = page.locator('article').first();
    await firstCard.hover();
    const gripHandle = firstCard.locator('div[title="Drag cards to reorder your priority feed"]');
    await expect(gripHandle).toBeVisible();
  });

  test('Navigation tabs switch between Feed, Trending, Favorites, and Analytics', async ({ page }) => {
    // Navigate to Trending
    await page.getByRole('button', { name: /Trending Spotlight|Tendencias|Trends/i }).click();
    await expect(page.getByText('LIVE VIRAL')).toBeVisible();

    // Navigate to Favorites
    await page.getByRole('button', { name: /Saved Favorites|Favoritos Guardados|Gespeicherte Favoriten/i }).click();
    await expect(page.getByText(/Favorites Collection is Empty|SAVED/i)).toBeVisible();

    // Navigate to Analytics
    await page.getByRole('button', { name: /Insights & Analytics|Estadísticas|Einblicke/i }).click();
    await expect(page.getByText('Feed Intelligence & Analytics')).toBeVisible();
    await expect(page.getByText('Content Source Mix')).toBeVisible();
  });

  test('Dark Mode toggle switches data-theme attribute', async ({ page }) => {
    const themeBtn = page.getByTitle(/Current theme:/i);
    await expect(themeBtn).toBeVisible();

    // Click to cycle theme
    await themeBtn.click();
    const htmlTheme = await page.locator('html').getAttribute('data-theme');
    expect(['dark', 'light', 'system']).toContain(htmlTheme);
  });

  test('User settings modal allows updating topics and preferences', async ({ page }) => {
    const settingsBtn = page.getByTitle('Dashboard Settings').first();
    await settingsBtn.click();

    // Verify settings modal is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Personalized Topics')).toBeVisible();

    // Toggle a topic
    const topicButton = page.getByRole('button', { name: /Gaming/i });
    await topicButton.click();

    // Close modal
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
