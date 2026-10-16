import { Locator, Page } from '@playwright/test';

/**
 * Page Object for the storefront home page: product grid, category filtering and
 * pagination. Selectors verified against the live site (knowledge base sections 6, 7, 8).
 */
export class HomePage {
  constructor(private readonly page: Page) {}

  get productCards(): Locator {
    return this.page.locator('#tbodyid .card');
  }
  get productTitles(): Locator {
    return this.page.locator('#tbodyid .card h4 a');
  }
  get nextButton(): Locator {
    return this.page.locator('#next2');
  }
  get prevButton(): Locator {
    return this.page.locator('#prev2');
  }

  /** Open the storefront and wait for the async product grid to render. */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  /** Replace the grid with the next page of products (`POST /pagination`). */
  async goToNextPage(): Promise<void> {
    await this.nextButton.click();
  }

  /** Load an earlier window of products (`POST /pagination`). */
  async goToPreviousPage(): Promise<void> {
    await this.prevButton.click();
  }

  /** Filter the grid by a left-sidebar category (`POST /bycat`). */
  async filterByCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
    await this.page.getByRole('link', { name: category }).click();
  }
}
