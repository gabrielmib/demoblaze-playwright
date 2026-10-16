import { test as base } from '@playwright/test';
import { DialogRecorder } from './dialogs';
import { AuthPage } from '../pages/AuthPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

type Fixtures = {
  /** Anonymous cart key. DemoBlaze stores the cart under the raw `document.cookie` string. */
  cartUser: string;
  dialogs: DialogRecorder;
  auth: AuthPage;
  product: ProductPage;
  cart: CartPage;
};

export const test = base.extend<Fixtures>({
  cartUser: [
    async ({ context }, use) => {
      const id = `${Date.now()}_${Math.floor(Math.random() * 1_000_000_000)}`;
      await context.addCookies([
        { name: 'user', value: id, url: 'https://demoblaze.com/' },
      ]);
      await use(id);
    },
    { auto: true },
  ],
  dialogs: async ({ page }, use) => {
    const recorder = new DialogRecorder();
    recorder.attach(page);
    await use(recorder);
  },
  auth: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  product: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
