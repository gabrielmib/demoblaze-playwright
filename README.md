# DemoBlaze Playwright Automation

End-to-end automation for https://demoblaze.com, built from `demoblaze-knowledge-base.md`.
It covers the storefront (**page load**, **carousel** and **header navigation**) and the
**Sign up / Log in / Log out** flows.

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
npm run test:headed   # watch in a browser
npm run test:ui       # Playwright UI mode
npm run report        # open the last HTML report
```

## Layout
```
pages/AuthPage.ts        # signup / login / logout + nav state POM
pages/HomePage.ts        # product grid + carousel + header nav POM
fixtures/dialogs.ts      # native alert capture + auto-accept
fixtures/test.ts         # extended test exposing `auth`, `home` and `dialogs`
utils/data.ts            # catalog size, unique user factory + shared password
tests/auth.spec.ts       # authentication scenarios
tests/home.spec.ts       # storefront load, carousel + header nav scenarios
```

## Notes
- `networkidle` is never used; the app keeps connections open. Tests wait on concrete elements.
- Native `alert()` dialogs are auto-accepted and captured by `DialogRecorder`; assert via
  `expect.poll(() => dialogs.last())`.
- A successful login produces **no** dialog; it is asserted through the navbar (`#nameofuser`).
- Usernames are generated per test (`makeUser()`), so the suite is parallel-safe.

See `demoblaze-knowledge-base.md` for the full application map, selectors, API reference and the
remaining scenario matrix (catalog, cart, order, contact, about).
