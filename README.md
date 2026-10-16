# DemoBlaze Playwright Automation

End-to-end automation for https://demoblaze.com, built from `demoblaze-knowledge-base.md`.
Covered flows: **Sign up / Log in / Log out**, **product detail**, and **cart**.

## Stack
- TypeScript
- @playwright/test (Chromium only)
- Page Object Model + fixtures

## Setup

```powershell
npm install
npx playwright install chromium
```

## Run

```powershell
npm test              # full suite
npm run test:auth     # auth suite only
npm run test:product  # product detail only
npm run test:cart     # cart suite only
npm run test:headed   # watch in a browser
npm run test:ui       # Playwright UI mode
npm run report        # open the last HTML report
```

## Layout
```
pages/AuthPage.ts        # signup / login / logout + nav state POM
pages/ProductPage.ts     # product detail + add to cart
pages/CartPage.ts        # cart rows, total, delete
fixtures/dialogs.ts      # native alert capture + auto-accept
fixtures/test.ts         # extended test exposing page objects and `dialogs`
utils/data.ts            # catalog constants, unique user factory, shared password
tests/auth.spec.ts       # authentication scenarios
tests/product.spec.ts    # product detail and add to cart
tests/cart.spec.ts       # cart rows, total, delete, empty state
```

## Notes
- `networkidle` is never used; the app keeps connections open. Tests wait on concrete elements.
- Native `alert()` dialogs are auto-accepted and captured by `DialogRecorder`; assert via
  `expect.poll(() => dialogs.last())`.
- A successful login produces **no** dialog; it is asserted through the navbar (`#nameofuser`).
- Usernames are generated per test (`makeUser()`), so the suite is parallel-safe.
- The anonymous cart key is the raw `document.cookie` string. Each test sets a unique `user` cookie so it does not share the public cart.
- Adding the same product twice creates two rows; the total is the sum of the line prices.

See `demoblaze-knowledge-base.md` for the full application map, selectors, API reference and the
remaining scenario matrix (catalog, cart, order, contact, about).
