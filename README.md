# DemoBlaze Playwright Automation

End-to-end automation for https://demoblaze.com, built from `demoblaze-knowledge-base.md`.
Covers **Sign up / Log in / Log out** and **Category filtering** (Phones, Laptops, Monitors).

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
npx playwright test tests/categories.spec.ts  # category suite
npm run test:headed   # watch in a browser
npm run test:ui       # Playwright UI mode
npm run report        # open the last HTML report
```

## Layout
```
pages/AuthPage.ts        # signup / login / logout + nav state POM
pages/HomePage.ts         # category filtering + product grid POM
fixtures/dialogs.ts      # native alert capture + auto-accept
fixtures/test.ts         # extended test exposing `auth`, `dialogs` and `home`
utils/data.ts            # unique user factory + shared password
tests/auth.spec.ts       # authentication scenarios
tests/categories.spec.ts # category filtering scenarios (Phones, Laptops, Monitors)
```

## Notes
- `networkidle` is never used; the app keeps connections open. Tests wait on concrete elements.
- Native `alert()` dialogs are auto-accepted and captured by `DialogRecorder`; assert via
  `expect.poll(() => dialogs.last())`.
- A successful login produces **no** dialog; it is asserted through the navbar (`#nameofuser`).
- Usernames are generated per test (`makeUser()`), so the suite is parallel-safe.

See `demoblaze-knowledge-base.md` for the full application map, selectors, API reference and the
remaining scenario matrix (catalog, cart, order, contact, about).
