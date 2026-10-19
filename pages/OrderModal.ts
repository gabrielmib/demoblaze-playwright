import { Page, expect } from '@playwright/test';

/**
 * Page Object for the Place Order modal (#orderModal).
 * Selectors verified against knowledge base sections 11 and 18.
 *
 * Order confirmation is a SweetAlert (`.sweet-alert`), NOT a native alert.
 */
export class OrderModal {
  constructor(private readonly page: Page) {}

  get nameField() {
    return this.page.locator('#name');
  }

  get countryField() {
    return this.page.locator('#country');
  }

  get cityField() {
    return this.page.locator('#city');
  }

  get cardField() {
    return this.page.locator('#card');
  }

  get monthField() {
    return this.page.locator('#month');
  }

  get yearField() {
    return this.page.locator('#year');
  }

  get purchaseButton() {
    return this.page.getByRole('button', { name: 'Purchase' });
  }

  get sweetAlert() {
    return this.page.locator('.sweet-alert');
  }

  get sweetAlertOkButton() {
    return this.page.locator('.sweet-alert button.confirm');
  }

  /** Fill all order form fields with valid test data. */
  async fillOrderDetails({
    name = 'QA Tester',
    country = 'USA',
    city = 'New York',
    card = '4111111111111111',
    month = '12',
    year = '2026',
  }: {
    name?: string;
    country?: string;
    city?: string;
    card?: string;
    month?: string;
    year?: string;
  } = {}): Promise<void> {
    await this.nameField.fill(name);
    await this.countryField.fill(country);
    await this.cityField.fill(city);
    await this.cardField.fill(card);
    await this.monthField.fill(month);
    await this.yearField.fill(year);
  }

  /** Click the Purchase button inside the order modal. */
  async clickPurchase(): Promise<void> {
    await this.purchaseButton.click();
  }

  /** Wait for the SweetAlert confirmation and return its visible text. */
  async waitForSweetAlert(timeout = 10000): Promise<string> {
    await this.sweetAlert.waitFor({ state: 'visible', timeout });
    return await this.sweetAlert.textContent() || '';
  }

  /** Click the OK button on the SweetAlert to dismiss it. */
  async clickSweetAlertOk(): Promise<void> {
    await this.sweetAlertOkButton.click();
  }

  /** Assert the SweetAlert contains the expected purchase confirmation. */
  async expectPurchaseConfirmation(timeout = 30_000): Promise<void> {
    await expect(this.sweetAlert).toContainText('Thank you for your purchase!', { timeout });
    await expect(this.sweetAlert).toContainText(/Amount:\s*\d+\s*USD/, { timeout });
    await expect(this.sweetAlert).toContainText(/Id:\s*\d+/, { timeout });
    await expect(this.sweetAlert).toContainText(/Date:\s*\d+\/\d+\/\d+/, { timeout });
  }
}
