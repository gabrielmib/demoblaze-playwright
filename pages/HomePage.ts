import { Locator, Page, expect } from '@playwright/test';

/** Bootstrap drives its carousel through the jQuery plugin; this is the only supported hook. */
type BootstrapCarousel = { carousel(command: 'pause'): void };

declare global {
  interface Window {
    jQuery: (selector: string) => BootstrapCarousel;
  }
}

const CAROUSEL = '#carouselExampleIndicators';

/**
 * Page Object for the storefront home page: the async product grid and the header
 * navigation, including the hero carousel.
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
    return this.page.locator(`${CAROUSEL} .carousel-item`);
  }

  get slideImages(): Locator {
    return this.slides.locator('img');
  }

  get slideIndicators(): Locator {
    return this.page.locator(`${CAROUSEL} .carousel-indicators li`);
  }

  get activeIndicator(): Locator {
    return this.page.locator(`${CAROUSEL} .carousel-indicators li.active`);
  }

  get visibleSlideImage(): Locator {
    return this.page.locator(`${CAROUSEL} .carousel-item.active img`);
  }

  /**
   * Present only while Bootstrap is running a slide transition. The site ships
   * Bootstrap 4.0.0-alpha.6, which uses `-left`/`-right`; stable 4.x uses
   * `-next`/`-prev`. Both are listed so the wait works on either version.
   */
  get transitioningSlides(): Locator {
    return this.page.locator(
      `${CAROUSEL} .carousel-item-left, ${CAROUSEL} .carousel-item-right,` +
        `${CAROUSEL} .carousel-item-next, ${CAROUSEL} .carousel-item-prev`
    );
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
  async gotoHome(): Promise<void> {
    await this.page.goto('/');
    await this.productCards.first().waitFor();
  }

  slideImageBySrc(src: string): Locator {
    return this.slides.locator(`img[src="${src}"]`);
  }

  /**
   * The carousel ships with `data-ride="carousel"`, so it advances roughly every
   * 3s on its own. Auto-rotation would race any assertion about the controls.
   */
  async pauseCarousel(): Promise<void> {
    await this.page.evaluate((sel) => window.jQuery(sel).carousel('pause'), CAROUSEL);
    await this.waitForIdle();
  }

  /**
   * Bootstrap ignores control clicks while it is sliding, so a click issued
   * mid-transition is silently dropped. Every carousel action therefore waits for
   * the previous transition to end before and after clicking.
   */
  async waitForIdle(): Promise<void> {
    await expect(this.transitioningSlides).toHaveCount(0);
  }

  async selectSlide(index: number): Promise<void> {
    await this.waitForIdle();
    await this.page.locator(`${CAROUSEL} .carousel-indicators li[data-slide-to="${index}"]`).click();
    await this.waitForIdle();
  }

  async clickNext(): Promise<void> {
    await this.waitForIdle();
    await this.page.locator('.carousel-control-next').click();
    await this.waitForIdle();
  }

  async clickPrevious(): Promise<void> {
    await this.waitForIdle();
    await this.page.locator('.carousel-control-prev').click();
    await this.waitForIdle();
  }
}
