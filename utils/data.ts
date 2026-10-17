/** Shared test data for the DemoBlaze suite. See knowledge base section 23. */

/** The default grid returns ids 1-9; ids 10-15 only arrive via pagination. */
export const DEFAULT_CATALOG_SIZE = 9;

export const PASSWORD = 'Passw0rd!';

/** Stable, unique username per invocation so specs are parallel-safe. */
export function makeUser(prefix = 'qa'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
}
