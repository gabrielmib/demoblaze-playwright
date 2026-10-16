import { Page, Response, expect } from '@playwright/test';

type ViewCartBody = {
  Items?: unknown[];
};

/**
 * Page Object for the cart (`cart.html`).
 * Selectors verified in knowledge base section 10.
 * The table is filled by POST /viewcart after navigation.
 */
export class CartPage {
  constructor(private readonly page: Page) {}

  get rows() {
    return this.page.locator('#tbodyid tr');
  }
  get headers() {
    return this.page.locator('.table thead th');
  }
  get total() {
    return this.page.locator('#totalp');
  }
  get placeOrder() {
    return this.page.getByRole('button', { name: 'Place Order' });
  }

  rowByTitle(title: string) {
    return this.rows.filter({ hasText: title });
  }

  /**
   * Open the cart and wait until every line from /viewcart has been painted.
   * Each line is a separate /view call, so the table grows after the list returns.
   */
  async open(): Promise<void> {
    const listed = this.viewCartResponse();
    await this.page.goto('/cart.html');
    await this.settle(await listed);
  }

  /**
   * Delete one line. The site reloads the page after /deleteitem, which refetches the cart.
   */
  async deleteByTitle(title: string): Promise<void> {
    const listed = this.viewCartResponse();
    await this.rowByTitle(title).locator('a').first().click();
    await this.settle(await listed);
  }

  private viewCartResponse(): Promise<Response> {
    return this.page.waitForResponse(
      (response) => response.url().includes('/viewcart') && response.request().method() === 'POST',
    );
  }

  private async settle(response: Response): Promise<void> {
    const body = (await response.json()) as ViewCartBody;
    await expect(this.rows).toHaveCount(body.Items?.length ?? 0);
  }

  async expectHeaders(): Promise<void> {
    await expect(this.headers).toHaveText(['Pic', 'Title', 'Price', 'x']);
  }

  async expectTotal(amount: number): Promise<void> {
    await expect(this.total).toHaveText(String(amount));
  }
}
