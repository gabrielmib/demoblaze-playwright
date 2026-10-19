import { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import type { DialogRecorder } from '../fixtures/dialogs';
import type { AuthPage } from '../pages/AuthPage';
import { CartPage } from '../pages/CartPage';
import { OrderModal } from '../pages/OrderModal';

/**
 * The demo storefront is slow and keeps connections open, so every wait in this
 * flow is explicit and generous instead of relying on Playwright defaults.
 */
const TIMEOUT = 30_000;

/**
 * Open the storefront and wait for the async product grid.
 * The grid is injected via AJAX and the public demo site can exceed the
 * default action timeout on a cold cache, so the navigation is retried.
 */
async function gotoHome(page: Page, auth: AuthPage): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await auth.gotoHome();
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(2000);
    }
  }
  throw lastError;
}

/**
 * Open the first product and add it to the cart.
 * The click must not wait for the navigation to settle (the site keeps
 * connections open), so we wait for the URL and for a concrete element.
 */
async function addFirstProductToCart(page: Page, dialogs: DialogRecorder): Promise<void> {
  await page.locator('#tbodyid .card h4 a').first().click({ noWaitAfter: true });
  await page.waitForURL(/prod\.html/, { timeout: TIMEOUT });
  await page.waitForSelector('.name', { timeout: TIMEOUT });

  // "Add to cart" posts to /addtocart and answers with a native alert.
  await page.getByRole('link', { name: 'Add to cart' }).click();
  await expect.poll(() => dialogs.last(), { timeout: TIMEOUT }).toBe('Product added');
}

test.describe('Order / Checkout (cases 14 & 15)', () => {
  // The full purchase funnel is several round-trips to a slow public demo site.
  test.setTimeout(90_000);

  test('case 14 & 15: purchase happy path and cart cleared after purchase', async ({
    page,
    auth,
    dialogs,
  }) => {
    const cart = new CartPage(page);
    const order = new OrderModal(page);

    // --- Setup: go to home and add first product to cart ---
    await gotoHome(page, auth);
    await addFirstProductToCart(page, dialogs);

    // --- Case 14: Order happy path ---
    await cart.gotoCart();
    await expect(cart.rows).toHaveCount(1, { timeout: TIMEOUT });
    const totalBefore = await cart.getTotalNumber();
    expect(totalBefore).toBeGreaterThan(0);

    await cart.clickPlaceOrder();
    await order.fillOrderDetails();
    await order.clickPurchase();

    // SweetAlert confirmation (not a native alert)
    await order.expectPurchaseConfirmation();
    await order.clickSweetAlertOk();

    // --- Case 15: Cart cleared after purchase ---
    await cart.gotoCart();
    await expect(cart.rows).toHaveCount(0, { timeout: TIMEOUT });
  });
});
