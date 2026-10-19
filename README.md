# DemoBlaze Playwright Automation

End-to-end automation for https://demoblaze.com, built from `demoblaze-knowledge-base.md`.
It covers the **Sign up / Log in / Log out** flows and the **order / checkout** flow
(cases 14 and 15 of the coverage matrix).

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
npm run test:order    # order / checkout suite only
npm run test:headed   # watch in a browser
npm run test:ui       # Playwright UI mode
npm run report        # open the last HTML report
```

## Layout
```
pages/AuthPage.ts        # signup / login / logout + nav state POM
pages/CartPage.ts        # cart rows, total and Place Order trigger
pages/OrderModal.ts      # checkout form + SweetAlert confirmation POM
fixtures/dialogs.ts      # native alert capture + auto-accept
fixtures/test.ts         # extended test exposing `auth` and `dialogs`
utils/data.ts            # unique user factory + shared password
tests/auth.spec.ts       # authentication scenarios
tests/order.spec.ts      # order / checkout scenarios (cases 14 & 15)
```

## Notes
- `networkidle` is never used; the app keeps connections open. Tests wait on concrete elements.
- Native `alert()` dialogs are auto-accepted and captured by `DialogRecorder`; assert via
  `expect.poll(() => dialogs.last())`.
- A successful login produces **no** dialog; it is asserted through the navbar (`#nameofuser`).
- Usernames are generated per test (`makeUser()`), so the suite is parallel-safe.
- The purchase confirmation is a **SweetAlert** (`.sweet-alert`), not a native alert; the
  "Add to cart" native alert is captured with `DialogRecorder` as usual.
- The demo site is slow and keeps connections open, so the order flow waits for concrete
  elements with explicit timeouts instead of relying on the default action timeout.

See `demoblaze-knowledge-base.md` for the full application map, selectors, API reference and the
remaining scenario matrix (catalog, cart, order, contact, about).
