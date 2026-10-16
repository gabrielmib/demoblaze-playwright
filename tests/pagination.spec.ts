import { test, expect } from '../fixtures/test';
import {
  FIRST_PAGE_PRODUCTS,
  MONITOR_PRODUCTS,
  PREVIOUS_PAGE_PRODUCTS,
  SECOND_PAGE_PRODUCTS,
} from '../utils/data';

test.describe('Pagination', () => {
  test('next shows the second page of products', async ({ home }) => {
    await home.goto();
    await expect(home.productTitles).toHaveText(FIRST_PAGE_PRODUCTS);

    await home.goToNextPage();

    await expect(home.productTitles).toHaveText(SECOND_PAGE_PRODUCTS);
  });

  test('next is hidden once the last page is reached', async ({ home }) => {
    await home.goto();

    await home.goToNextPage();
    await expect(home.productTitles).toHaveText(SECOND_PAGE_PRODUCTS);

    await expect(home.nextButton).toBeHidden();
  });

  test('previous loads the preceding window of products', async ({ home }) => {
    await home.goto();
    await expect(home.productTitles).toHaveText(FIRST_PAGE_PRODUCTS);

    await home.goToPreviousPage();

    await expect(home.productTitles).toHaveText(PREVIOUS_PAGE_PRODUCTS);
  });

  test('pagination is not restricted by the active category', async ({ home }) => {
    await home.goto();
    await home.filterByCategory('Monitors');
    await expect(home.productTitles).toHaveText(MONITOR_PRODUCTS);

    await home.goToNextPage();

    await expect(home.productTitles).toHaveText(SECOND_PAGE_PRODUCTS);
  });
});
