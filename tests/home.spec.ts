import { test, expect } from '../fixtures/test';
import { DEFAULT_CATALOG_SIZE } from '../utils/data';

const SLIDES = [
  { src: 'Samsung1.jpg', alt: 'First slide' },
  { src: 'nexus1.jpg', alt: 'Second slide' },
  { src: 'iphone1.jpg', alt: 'Third slide' },
];

test.describe('Home', () => {
  test('page loads the title and the default catalog', async ({ home, page }) => {
    await home.gotoHome();

    await expect(page).toHaveTitle('STORE');
    await expect(home.productCards).toHaveCount(DEFAULT_CATALOG_SIZE);
  });

  test('page loads every product card with a title and a price', async ({ home }) => {
    await home.gotoHome();

    // toHaveText against a list already pins the element count, so the count is
    // not asserted again here.
    await expect(home.productTitles).toHaveText([
      'Samsung galaxy s6',
      'Nokia lumia 1520',
      'Nexus 6',
      'Samsung galaxy s7',
      'Iphone 6 32gb',
      'Sony xperia z5',
      'HTC One M9',
      'Sony vaio i5',
      'Sony vaio i7',
    ]);
    await expect(home.productPrices).toHaveText([
      '$360',
      '$820',
      '$650',
      '$800',
      '$790',
      '$320',
      '$700',
      '$790',
      '$790',
    ]);
  });
});

test.describe('Home carousel', () => {
  test('carousel renders three slides with one showing', async ({ home }) => {
    await home.gotoHome();
    await home.pauseCarousel();

    await expect(home.slides).toHaveCount(SLIDES.length);
    for (const { src, alt } of SLIDES) {
      await expect(home.slideImageBySrc(src)).toHaveAttribute('alt', alt);
    }

    // Only the active slide is laid out; the others collapse to zero size.
    await expect(home.visibleSlideImage).toBeVisible();
  });

  test('next and previous controls move between slides', async ({ home }) => {
    await home.gotoHome();
    await home.pauseCarousel();

    await home.selectSlide(0);
    await expect(home.activeIndicator).toHaveAttribute('data-slide-to', '0');
    await expect(home.visibleSlideImage).toHaveAttribute('alt', 'First slide');

    await home.clickNext();
    await expect(home.activeIndicator).toHaveAttribute('data-slide-to', '1');
    await expect(home.visibleSlideImage).toHaveAttribute('alt', 'Second slide');

    await home.clickNext();
    await expect(home.activeIndicator).toHaveAttribute('data-slide-to', '2');
    await expect(home.visibleSlideImage).toHaveAttribute('alt', 'Third slide');

    await home.clickPrevious();
    await expect(home.activeIndicator).toHaveAttribute('data-slide-to', '1');
    await expect(home.visibleSlideImage).toHaveAttribute('alt', 'Second slide');
  });

  test('indicators jump straight to the chosen slide', async ({ home }) => {
    await home.gotoHome();
    await home.pauseCarousel();

    await home.selectSlide(2);
    await expect(home.activeIndicator).toHaveAttribute('data-slide-to', '2');
    await expect(home.visibleSlideImage).toHaveAttribute('alt', 'Third slide');

    await home.selectSlide(0);
    await expect(home.activeIndicator).toHaveAttribute('data-slide-to', '0');
    await expect(home.visibleSlideImage).toHaveAttribute('alt', 'First slide');
  });
});

test.describe('Header navigation', () => {
  test('header shows the public links while logged out', async ({ home, auth }) => {
    await home.gotoHome();

    await expect(home.brand).toHaveText('PRODUCT STORE');
    await expect(home.homeLink).toBeVisible();
    await expect(home.contactLink).toBeVisible();
    await expect(home.aboutLink).toBeVisible();
    await expect(home.cartLink).toBeVisible();
    await expect(auth.loginLink).toBeVisible();
    await expect(auth.signupLink).toBeVisible();

    // Nothing that only exists once signed in should leak into the logged-out header.
    await expect(auth.logoutLink).toBeHidden();
    await expect(auth.userLabel).toBeHidden();
  });

  test('header links point at their page or modal', async ({ home, auth }) => {
    await home.gotoHome();

    await expect(home.brand).toHaveAttribute('href', 'index.html');
    await expect(home.homeLink).toHaveAttribute('href', 'index.html');
    await expect(home.cartLink).toHaveAttribute('href', 'cart.html');
    await expect(home.contactLink).toHaveAttribute('data-target', '#exampleModal');
    await expect(home.aboutLink).toHaveAttribute('data-target', '#videoModal');
    await expect(auth.loginLink).toHaveAttribute('data-target', '#logInModal');
    await expect(auth.signupLink).toHaveAttribute('data-target', '#signInModal');
  });
});
