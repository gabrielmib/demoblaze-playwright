/** Shared test data for the DemoBlaze suite. See knowledge base sections 16 and 23. */

export const PASSWORD = 'Passw0rd!';

export type CatalogProduct = {
  id: number;
  title: string;
  price: number;
  image: string;
};

/** Fixed catalog rows from knowledge base section 16. Prices are USD integers. */
export const PRODUCTS = {
  galaxyS6: {
    id: 1,
    title: 'Samsung galaxy s6',
    price: 360,
    image: 'imgs/galaxy_s6.jpg',
  },
  nokiaLumia: {
    id: 2,
    title: 'Nokia lumia 1520',
    price: 820,
    image: 'imgs/Lumia_1520.jpg',
  },
} as const satisfies Record<string, CatalogProduct>;

/** Stable, unique username per invocation so specs are parallel-safe. */
export function makeUser(prefix = 'qa'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
}
