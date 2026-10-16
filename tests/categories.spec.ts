import { test, expect } from '../fixtures/test';

test.describe('Categories', () => {
  test('filtering by Phones shows 7 phone products', async ({ home }) => {
    await home.gotoHome();

    await home.filterByCategory('Phones');

    const count = await home.getCardCount();
    expect(count).toBe(7);

    const titles = await home.getProductTitles();
    expect(titles).toContain('Samsung galaxy s6');
    expect(titles).toContain('Nokia lumia 1520');
    expect(titles).toContain('Nexus 6');
    expect(titles).toContain('Samsung galaxy s7');
    expect(titles).toContain('Iphone 6 32gb');
    expect(titles).toContain('Sony xperia z5');
    expect(titles).toContain('HTC One M9');
  });

  test('filtering by Laptops shows 6 laptop products', async ({ home }) => {
    await home.gotoHome();

    await home.filterByCategory('Laptops');

    const count = await home.getCardCount();
    expect(count).toBe(6);

    const titles = await home.getProductTitles();
    expect(titles).toContain('Sony vaio i5');
    expect(titles).toContain('Sony vaio i7');
    expect(titles).toContain('MacBook air');
    expect(titles).toContain('Dell i7 8gb');
    expect(titles).toContain('2017 Dell 15.6 Inch');
    expect(titles).toContain('MacBook Pro');
  });

  test('filtering by Monitors shows 2 monitor products', async ({ home }) => {
    await home.gotoHome();

    await home.filterByCategory('Monitors');

    const count = await home.getCardCount();
    expect(count).toBe(2);

    const titles = await home.getProductTitles();
    expect(titles).toContain('Apple monitor 24');
    expect(titles).toContain('ASUS Full HD');
  });
});
