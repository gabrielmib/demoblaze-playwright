import { test, expect } from '../fixtures/test';
import { PRODUCTS } from '../utils/data';

test.describe('Product detail', () => {
  test('shows title, price, image, description and add to cart', async ({ product, page }) => {
    const galaxy = PRODUCTS.galaxyS6;

    await product.openFromCatalog(galaxy.title);

    await expect(page).toHaveURL(new RegExp(`idp_=${galaxy.id}`));
    await product.expectDetails(galaxy);
  });

  test('add to cart shows Product added', async ({ product, dialogs }) => {
    await product.goto(PRODUCTS.galaxyS6.id);

    await product.addToCart();

    await expect.poll(() => dialogs.last()).toBe('Product added');
  });

  test('adding the same product twice creates two cart rows', async ({ product, cart, dialogs }) => {
    const galaxy = PRODUCTS.galaxyS6;
    await product.goto(galaxy.id);

    await product.addToCart();
    await expect.poll(() => dialogs.count).toBe(1);
    await product.addToCart();
    await expect.poll(() => dialogs.count).toBe(2);
    expect(dialogs.messages).toEqual(['Product added', 'Product added']);

    await cart.open();

    await expect(cart.rowByTitle(galaxy.title)).toHaveCount(2);
    await cart.expectTotal(galaxy.price * 2);
  });
});
