import { Locator, Page } from '@playwright/test';

/**
 * Page Object for the Home page: navigation, category filtering and product grid.
 * Selectors verified against the live site (knowledge base sections 4, 6, 7, 19).
 */
export class HomePage {
  constructor(private readonly page: Page) {}

  get productGrid() {
    return this.page.locator('#tbodyid');
  }
  get productCards() {
    return this.page.locator('#tbodyid .card');
  }
  get categoryLinks() {
    return this.page.locator('#cat ~ ul a');
  }

  /** Navigate to the storefront and wait for the async product grid to render. */
  async gotoHome(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForSelector('#tbodyid .card');
  }

  /** Click a category link by its visible text and wait for the grid to update. */
  async filterByCategory(category: string): Promise<void> {
    const initialCount = await this.getCardCount();
    await this.page.getByRole('link', { name: category, exact: true }).click();

    // Wait for the grid to refresh with the filtered results
    await this.page.waitForFunction(
      (expected) => document.querySelectorAll('#tbodyid .card').length !== expected,
      initialCount,
      { timeout: 10000 },
    );
  }

  /** Return the titles of all visible product cards (trimmed). */
  async getProductTitles(): Promise<string[]> {
    return this.productCards.locator('h4 a').allTextContents().then(titles =>
      titles.map(t => t.trim()),
    );
  }

  /** Return the number of visible product cards. */
  getCardCount(): Promise<number> {
    return this.productCards.count();
  }
}
