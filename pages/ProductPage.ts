import { Page, expect } from '@playwright/test';
import { CatalogProduct } from '../utils/data';

/**
 * Page Object for a single product (`prod.html?idp_=<id>`).
 * Selectors verified in knowledge base section 9.
 */
export class ProductPage {
  constructor(private readonly page: Page) {}

  get title() {
    return this.page.locator('.name');
  }
  get price() {
    return this.page.locator('.price-container');
  }
  get image() {
    return this.page.locator('#imgp img');
  }
  get description() {
    return this.page.locator('#more-information p');
  }
  get addToCartLink() {
    return this.page.getByRole('link', { name: 'Add to cart' });
  }

  /** Open a product by id and wait until the view API has filled the title. */
  async goto(productId: number): Promise<void> {
    await this.page.goto(`/prod.html?idp_=${productId}`);
    await expect(this.title).not.toBeEmpty();
  }

  /** Open a product from the home grid (ids 1–9). */
  async openFromCatalog(title: string): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForSelector('#tbodyid .card');
    await this.page.locator('#tbodyid .card h4 a', { hasText: title }).click();
    await expect(this.title).not.toBeEmpty();
  }

  async addToCart(): Promise<void> {
    await this.addToCartLink.click();
  }

  async expectDetails(product: CatalogProduct): Promise<void> {
    await expect(this.title).toHaveText(product.title);
    await expect(this.price).toContainText(`$${product.price}`);
    await expect(this.price).toContainText('*includes tax');
    await expect(this.image).toHaveAttribute('src', new RegExp(product.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    await expect(this.description).not.toBeEmpty();
    await expect(this.addToCartLink).toBeVisible();
  }
}
