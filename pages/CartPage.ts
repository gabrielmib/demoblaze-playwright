import { Page } from '@playwright/test';

/**
 * Page Object for the Cart page (cart.html).
 * Selectors verified against knowledge base sections 10 and 11.
 */
export class CartPage {
  constructor(private readonly page: Page) {}

  get rows() {
    return this.page.locator('#tbodyid tr');
  }

  get total() {
    return this.page.locator('#totalp');
  }

  get placeOrderButton() {
    return this.page.getByRole('button', { name: 'Place Order' });
  }

  /** Open the cart page and wait for the table to render (tbody exists even when empty). */
  async gotoCart(): Promise<void> {
    // `domcontentloaded` because the demo site keeps connections open and the
    // `load` event can take a long time to fire.
    await this.page.goto('/cart.html', { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('#tbodyid', { state: 'attached', timeout: 30_000 });
  }

  /** Return the number of cart rows. */
  async rowCount(): Promise<number> {
    return await this.rows.count();
  }

  /** Return the cart total as a number. */
  async getTotalNumber(): Promise<number> {
    const text = await this.total.textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  /** Click the Place Order button to open the order modal. */
  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.page.waitForSelector('#orderModal', { state: 'visible', timeout: 30_000 });
  }
}
