import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for the storefront home page: the async product grid, the
 * category sidebar and the header navigation.
 * Selectors verified against the live site (knowledge base sections 4, 6).
 */
export class HomePage {
  constructor(private readonly page: Page) {}

  get productCards(): Locator {
    return this.page.locator('#tbodyid .card');
  }

  get productTitles(): Locator {
    return this.productCards.locator('h4 a');
  }

  get productPrices(): Locator {
    return this.productCards.locator('h5');
  }

  get slides(): Locator {
    return this.page.locator('#carouselExampleIndicators .carousel-item');
  }

  get slideImages(): Locator {
    return this.slides.locator('img');
  }

  get slideIndicators(): Locator {
    return this.page.locator('#carouselExampleIndicators .carousel-indicators li');
  }

  get activeIndicator(): Locator {
    return this.page.locator('#carouselExampleIndicators .carousel-indicators li.active');
  }

  get activeSlides(): Locator {
    return this.page.locator('#carouselExampleIndicators .carousel-item.active');
  }

  get visibleSlideImage(): Locator {
    return this.page.locator('#carouselExampleIndicators .carousel-item.active img');
  }

  /** The nav holds exactly the 8 header links; the carousel controls sit outside it. */
  get navbar(): Locator {
    return this.page.locator('.navbar-nav');
  }

  get brand(): Locator {
    return this.page.locator('.navbar-brand');
  }

  // The Home link renders the literal text "Home (current)", not "Home".
  get homeLink(): Locator {
    return this.navbar.getByRole('link', { name: 'Home (current)', exact: true });
  }

  get contactLink(): Locator {
    return this.navbar.getByRole('link', { name: 'Contact', exact: true });
  }

  get aboutLink(): Locator {
    return this.navbar.getByRole('link', { name: 'About us', exact: true });
  }

  get cartLink(): Locator {
    return this.navbar.getByRole('link', { name: 'Cart', exact: true });
  }

  /** Open the storefront and wait for the async product grid to render. */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.productCards.first().waitFor();
  }

  /** Titles currently in the grid, trimmed: "Sony vaio i7" carries a trailing newline. */
  async productTitleList(): Promise<string[]> {
    const titles = await this.productTitles.allTextContents();
    return titles.map((title) => title.trim());
  }

  async expectTitle(expected: string): Promise<void> {
    await expect(this.page).toHaveTitle(expected);
  }

  async expectProductCount(count: number): Promise<void> {
    await expect(this.productCards).toHaveCount(count);
  }

  /**
   * The carousel ships with `data-ride="carousel"`, so it advances roughly every
   * 3s on its own. Auto-rotation would race any assertion about the controls, so
   * these tests pause it first and drive the slides explicitly.
   */
  async pauseCarousel(): Promise<void> {
    await this.page.evaluate(() => {
      type CarouselApi = { carousel(command: string): void };
      const $ = (window as unknown as { jQuery: (selector: string) => CarouselApi }).jQuery;
      $('#carouselExampleIndicators').carousel('pause');
    });
  }

  async selectSlide(index: number): Promise<void> {
    await this.slideIndicators.nth(index).click();
  }

  async clickNext(): Promise<void> {
    await this.page.locator('.carousel-control-next').click();
  }

  async clickPrevious(): Promise<void> {
    await this.page.locator('.carousel-control-prev').click();
  }

  /** Asserts the indicator marked active, and that exactly one slide is showing. */
  async expectActiveSlide(index: number): Promise<void> {
    await expect(this.activeIndicator).toHaveAttribute('data-slide-to', String(index));
    await expect(this.activeSlides).toHaveCount(1);
  }

  async expectVisibleSlideAlt(alt: string): Promise<void> {
    await expect(this.visibleSlideImage).toHaveAttribute('alt', alt);
    await expect(this.visibleSlideImage).toBeVisible();
  }
}