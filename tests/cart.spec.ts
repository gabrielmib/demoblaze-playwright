import { test, expect } from '../fixtures/test';
import { PRODUCTS } from '../utils/data';

test.describe('Cart', () => {
  test('lists added products and sums their prices', async ({ product, cart, dialogs }) => {
    const galaxy = PRODUCTS.galaxyS6;
    const nokia = PRODUCTS.nokiaLumia;

    await product.goto(galaxy.id);
    await product.addToCart();
    await expect.poll(() => dialogs.last()).toBe('Product added');

    await product.goto(nokia.id);
    await product.addToCart();
    await expect.poll(() => dialogs.count).toBe(2);

    await cart.open();

    await cart.expectHeaders();
    await expect(cart.rows).toHaveCount(2);
    await expect(cart.rowByTitle(galaxy.title)).toContainText(String(galaxy.price));
    await expect(cart.rowByTitle(nokia.title)).toContainText(String(nokia.price));
    await expect(cart.rowByTitle(galaxy.title).locator('a')).toHaveText('Delete');
    await cart.expectTotal(galaxy.price + nokia.price);
    await expect(cart.placeOrder).toBeVisible();
  });

  test('delete removes one row and updates the total', async ({ product, cart, dialogs }) => {
    const galaxy = PRODUCTS.galaxyS6;
    const nokia = PRODUCTS.nokiaLumia;

    await product.goto(galaxy.id);
    await product.addToCart();
    await expect.poll(() => dialogs.last()).toBe('Product added');
    await product.goto(nokia.id);
    await product.addToCart();
    await expect.poll(() => dialogs.count).toBe(2);

    await cart.open();
    await cart.expectTotal(galaxy.price + nokia.price);

    await cart.deleteByTitle(nokia.title);

    await expect(cart.rowByTitle(nokia.title)).toHaveCount(0);
    await expect(cart.rowByTitle(galaxy.title)).toHaveCount(1);
    await cart.expectTotal(galaxy.price);
  });

  test('empty cart has no rows and still shows Place Order', async ({ cart }) => {
    await cart.open();

    await expect(cart.rows).toHaveCount(0);
    await expect(cart.placeOrder).toBeVisible();
  });
});
