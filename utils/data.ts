/** Shared test data for the DemoBlaze suite. See knowledge base section 23. */

export const PASSWORD = 'Passw0rd!';

/** Stable, unique username per invocation so specs are parallel-safe. */
export function makeUser(prefix = 'qa'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
}

/** Products (ids 1-9) rendered by the home grid from `GET /entries` (KB §6, §8). */
export const FIRST_PAGE_PRODUCTS = [
  'Samsung galaxy s6',
  'Nokia lumia 1520',
  'Nexus 6',
  'Samsung galaxy s7',
  'Iphone 6 32gb',
  'Sony xperia z5',
  'HTC One M9',
  'Sony vaio i5',
  'Sony vaio i7',
];

/** Second page (ids 10-15): mixed monitors + notebooks from `POST /pagination` (KB §8). */
export const SECOND_PAGE_PRODUCTS = [
  'Apple monitor 24',
  'MacBook air',
  'Dell i7 8gb',
  '2017 Dell 15.6 Inch',
  'ASUS Full HD',
  'MacBook Pro',
];

/**
 * What "Previous" actually loads: the button posts `{ id: prev2.value }`, and that value is set
 * to the first product id on load and never updated, so it returns the ids 2-10 window rather than
 * the first page. Verified against the live site (knowledge base §8).
 */
export const PREVIOUS_PAGE_PRODUCTS = [
  'Nokia lumia 1520',
  'Nexus 6',
  'Samsung galaxy s7',
  'Iphone 6 32gb',
  'Sony xperia z5',
  'HTC One M9',
  'Sony vaio i5',
  'Sony vaio i7',
  'Apple monitor 24',
];

/** Products returned by the Monitors category filter (KB §7). */
export const MONITOR_PRODUCTS = ['Apple monitor 24', 'ASUS Full HD'];
