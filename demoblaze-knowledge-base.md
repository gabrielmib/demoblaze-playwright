# DemoBlaze (STORE) — QA Knowledge Base for Playwright Automation

> **Target:** https://demoblaze.com/  ·  **App name / title:** `STORE`  ·  **Brand shown:** "PRODUCT STORE"
> **Purpose:** Reference for building a Playwright end-to-end automation suite.
> **How this was produced:** Live exploration with Playwright (Chromium) across every page, modal, category,
> the full purchase funnel, auth flows, and the underlying `api.demoblaze.com` XHR traffic. Raw evidence lives in
> the sibling files `results.json`, `login.json`, `html.json`, and the screenshots named in §26.

---

## 1. Application Overview

DemoBlaze is a **single-vendor e-commerce demo store** used widely for test-automation practice. It sells three
categories of hardware (Phones, Laptops, Monitors). The storefront is server-rendered static HTML enhanced by
jQuery + Bootstrap, with all dynamic data (catalog, cart, auth, orders) coming from a REST-ish JSON API at
`api.demoblaze.com`. It has **no real payment** — the "purchase" flow just shows a confirmation dialog.

High-value automation characteristics:

- **Client-side rendered product grid** (products injected into `#tbodyid` via AJAX — not present in static HTML).
- **Native `window.alert()` dialogs** for most feedback → must be handled or tests hang.
- **SweetAlert (`.sweet-alert`)** for the order-confirmation dialog (different from the native alerts).
- **Cookie-based cart** (`user=<uuid>` cookie) — cart survives navigation but not a fresh browser context.
- **Bootstrap modals** for Sign up / Log in / Contact / About us / Place order.
- **`load` never becomes `networkidle`** — the page keeps long-lived connections open.

---

## 2. Tech Stack & Architecture

| Aspect | Detail |
|---|---|
| Markup | Static HTML pages (`index.html`, `prod.html`, `cart.html`) |
| CSS | Bootstrap (via `node_modules/bootstrap`), custom `css/latostyle.css`, `css/latofonts.css` |
| JS libs | jQuery, video.js + videojs-contrib-hls, tether, Bootstrap JS |
| Data/API | `https://api.demoblaze.com/*` (AJAX, JSON) |
| Client state | `localStorage`/cookie — cart identity stored as cookie `user=<uuid>` |
| Dialogs | Native `alert()` (jQuery-driven) + SweetAlert for order confirmation |
| Pagination | AJAX to `/pagination` (no URL change) |

---

## 3. Site Map & URLs

| Page | URL | Key purpose |
|---|---|---|
| Home / catalog | `https://demoblaze.com/` (also `/index.html`) | Carousel, category list, product grid, pagination |
| Product detail | `https://demoblaze.com/prod.html?idp_=<id>` | Single product, Add to cart |
| Cart | `https://demoblaze.com/cart.html` | Cart table, total, delete, Place Order |
| API base | `https://api.demoblaze.com/` | All JSON endpoints |

**Product detail links** are always `prod.html?idp_=<numeric id>` (note the underscore).

---

## 4. Global Header / Navigation

Appears identically on Home, Product detail, and Cart pages.

| Label | id | Mechanism | Target / URL | Notes |
|---|---|---|---|---|
| PRODUCT STORE (brand + logo) | `#nava` (`.navbar-brand`) | link | `index.html` | Text = `PRODUCT STORE` |
| Home (current) | — | link | `index.html` | |
| Contact | — | Bootstrap modal | `#exampleModal` | `data-toggle="modal" data-target="#exampleModal"` |
| About us | — | Bootstrap modal | `#videoModal` | `data-toggle="modal" data-target="#videoModal"` |
| Cart | `#cartur` | link | `cart.html` | |
| Log in | `#login2` | Bootstrap modal | `#logInModal` | Visible only when logged out |
| Log out | `#logout2` | `onclick="logOut()"` | — | Hidden until logged in |
| (user) | `#nameofuser` | link | `#` | Hidden until logged in; shows `Welcome <username>` |
| Sign up | `#signin2` | Bootstrap modal | `#signInModal` | Visible only when logged out |

**Auth visibility rule (verified):**
- Logged out → `#login2` visible, `#signin2` visible, `#logout2` hidden, `#nameofuser` hidden/empty.
- Logged in → `#login2` hidden, `#signin2` hidden, `#logout2` visible, `#nameofuser` visible with `Welcome <username>`.

Home page also renders a **3-slide carousel** in the header area: `Samsung1.jpg`, `nexus1.jpg`, `iphone1.jpg`
(`.carousel-item img`, alts "First slide" / "Second slide" / "Third slide"). Hidden below ~800px width (CSS media query).

---

## 5. Footer

Present on every page (`#footc` + `<footer>`):

- **About Us** — marketing paragraph (performance-validation blurb).
- **Get in Touch** — `Address: 2390 El Camino Real` · `Phone: +440 123456` · `Email: demo@blazemeter.com`
- **PRODUCT STORE** logo block.
- Footer bar: `Copyright © Product Store`.

---

## 6. Home Page (`#contcont`)

Layout: left `col-lg-3` = Categories list; right `col-lg-9` = product grid `#tbodyid` + pagination.

Rendered product card markup (repeat per product):

```html
<div class="card h-100">
  <a href="prod.html?idp_=1"><img class="card-img-top img-fluid" src="imgs/galaxy_s6.jpg" alt=""></a>
  <div class="card-block">
    <h4 class="card-title"><a href="prod.html?idp_=1" class="hrefch">Samsung galaxy s6</a></h4>
    <h5>$360</h5>
    <p id="article" class="card-text">The Samsung Galaxy S6 is powered by ...</p>
  </div>
</div>
```

Default home grid (loaded via `GET /entries`) shows **9 products** (ids 1–9).

---

## 7. Categories & Filtering

Left sidebar list items (all `id="itemc"`, **duplicate ids — do not use `#itemc` alone**; select by text):

| Label | onclick | API call | Result count |
|---|---|---|---|
| Phones | `byCat('phone')` | `POST /bycat {"cat":"phone"}` | 7 |
| Laptops | `byCat('notebook')` | `POST /bycat {"cat":"notebook"}` | 6 |
| Monitors | `byCat('monitor')` | `POST /bycat {"cat":"monitor"}` | 2 |

Verified lists:
- **Phones:** Samsung galaxy s6, Nokia lumia 1520, Nexus 6, Samsung galaxy s7, Iphone 6 32gb, Sony xperia z5, HTC One M9
- **Laptops:** Sony vaio i5, Sony vaio i7, MacBook air, Dell i7 8gb, 2017 Dell 15.6 Inch, MacBook Pro
- **Monitors:** Apple monitor 24, ASUS Full HD

> The "CATEGORIES" heading is also rendered as an `<a id="cat">` (not a link target).

---

## 8. Pagination

- Controls: `#prev2` (Previous) and `#next2` (Next) inside `.pagination`. Their `value` holds the
  API cursor id (`next2.value = 9`, `prev2.value = 1` on load).
- Clicking **Next** calls `POST /pagination {"id":"9"}` and replaces the grid with items having `id > 9`.
- Page 2 returns **6 items** with **mixed categories** (monitors + notebooks): Apple monitor 24, MacBook air,
  Dell i7 8gb, 2017 Dell 15.6 Inch, ASUS Full HD, MacBook Pro.
- **Next is hidden** once the last page is reached (`ScannedCount != 9`).
- Clicking **Prev** calls `POST /pagination {"id":"<prev2.value>"}`, but `prev2.value` is set once on load
  (to the first id, `1`) and **never updated**. So Prev returns the `id > 1` window — ids **2–10** (Nokia
  lumia 1520 … Apple monitor 24), *not* the original id 1–9 list. Verified against the live site.
- **Category is not preserved** by pagination — Next always returns the global "after id 9" list.
- No URL change, no page-number indicators.

---

## 9. Product Detail (`prod.html?idp_=<id>`)

Selector map:

| Element | Selector | Example value |
|---|---|---|
| Title | `.name` | `Samsung galaxy s6` |
| Price | `.price-container` | `$360 *includes tax` |
| Image | `#imgp img` / `.product-image img` | `imgs/galaxy_s6.jpg` |
| Description | `#more-information p` | long paragraph |
| Add to cart | `a.btn-success` | `Add to cart` |

Data is fetched via `POST /view {"id":"<id>"}`. Price shown is `$` + value + ` *includes tax`.

**Add to cart** posts `POST /addtocart {"id":"<uuid>","cookie":"user=<uuid>","prod_id":<id>,"flag":false}` and
fires a native alert **"Product added"**. Adding the same product twice creates **two separate cart rows**
(no quantity merge).

---

## 10. Cart (`cart.html`)

Selector map:

| Element | Selector |
|---|---|
| Table headers | `.table thead th` → `Pic`, `Title`, `Price`, `x` |
| Rows | `#tbodyid tr` (cells: image, title, price, `Delete` link) |
| Row delete | `#tbodyid tr a` with `onclick="deleteItem('<uuid>')"` |
| Total | `#totalp` (number only, e.g. `1180`) |
| Place Order | `button.btn-success[data-target="#orderModal"]` (`.col-lg-1 button`) |

Background calls: `POST /viewcart {"cookie":"user=<uuid>","flag":false}` to list, `POST /deleteitem {"id":...}`
to remove one, `POST /deletecart {"cookie":...}` to clear all after purchase.

Verified behavior:
- Two added products → 2 rows; `#totalp` = sum (e.g. `360 + 820 = 1180`).
- Delete removes exactly one row and updates the total.
- After a completed purchase, cart is emptied (`#tbodyid` has no rows).
- Empty cart renders `<tbody id="tbodyid"></tbody>`; the **Place Order button still exists** in the DOM.

---

## 11. Order / Checkout ("Place order" modal `#orderModal`)

Opened by the Place Order button. Fields (all `type="text"`):

| Field | id | Label |
|---|---|---|
| Total display | (`#totalm`) | `Total:` (value appended) |
| Name | `#name` | Name: |
| Country | `#country` | Country: |
| City | `#city` | City: |
| Credit card | `#card` | Credit card: |
| Month | `#month` | Month: |
| Year | `#year` | Year: |
| Errors | `#errors` | (red inline label) |

**Purchase** button → `onclick="purchaseOrder()"`. On success it clears the cart and shows a **SweetAlert**
confirmation (`.sweet-alert`), then an `OK` button (`.sweet-alert button.confirm`).

Verified confirmation text (dynamic — assert with a regex/pattern, not equality):

```
Thank you for your purchase!
Id: 7223336
Amount: 360 USD
Card Number: 4111111111111111
Name: QA Tester
Date: 12/9/2026
OK
```

Note: the modal's `Total:` reflects the current cart (e.g. `Total: 360` after one item was removed).

---

## 12. Sign Up (`#signInModal`)

| Field | Selector | Type |
|---|---|---|
| Username | `#sign-username` | text |
| Password | `#sign-password` | password |
| Errors | `#errors` | label |

Submit button `onclick="register()"` ("Sign up"). Calls `POST /signup {"username":..,"password":"<base64>"}`
(password is **base64-encoded** in transit). Native alerts:
- Success → **"Sign up successful."**
- Duplicate username → **"This user already exist."** (also surfaced via `#errors`).

---

## 13. Log In / Log Out

**Log in** modal `#logInModal`: `#loginusername` (text), `#loginpassword` (password), submit `onclick="logIn()"`.
Calls `POST /login {"username":..,"password":"<base64>"}`.

| Scenario | Result |
|---|---|
| Unknown user | native alert **"User does not exist."** |
| Wrong password (existing user) | native alert **"Wrong password."** |
| Valid credentials | **No alert.** Modal closes; `#nameofuser` → `Welcome <username>`; `#login2` & `#signin2` hidden; `#logout2` visible |

**Log out** `#logout2` → `onclick="logOut()"`; reverts nav to logged-out state (no alert).

---

## 14. Contact (`#exampleModal`, "New message")

| Field | Selector |
|---|---|
| Contact Email | `#recipient-email` |
| Contact Name | `#recipient-name` |
| Message | `#message-text` (textarea) |

Submit button `onclick="send()"` ("Send message") → native alert **"Thanks for the message!!"**.
**No network call** — purely client-side.

---

## 15. About Us (`#videoModal`)

Contains a video.js player: `#videoModal video` → element id `example-video_html5_api`, poster
`https://demoblaze.com/imgs/front.jpg`. No inputs; only a Close button. Useful for smoke tests
(modal opens, video element exists).

---

## 16. Catalog Data Reference (15 products)

| id | Category | Title | Price (USD) | Image |
|---:|---|---|---:|---|
| 1 | phone | Samsung galaxy s6 | 360 | imgs/galaxy_s6.jpg |
| 2 | phone | Nokia lumia 1520 | 820 | imgs/Lumia_1520.jpg |
| 3 | phone | Nexus 6 | 650 | imgs/Nexus_6.jpg |
| 4 | phone | Samsung galaxy s7 | 800 | imgs/galaxy_s6.jpg |
| 5 | phone | Iphone 6 32gb | 790 | imgs/iphone_6.jpg |
| 6 | phone | Sony xperia z5 | 320 | imgs/xperia_z5.jpg |
| 7 | phone | HTC One M9 | 700 | imgs/HTC_M9.jpg |
| 8 | notebook | Sony vaio i5 | 790 | imgs/sony_vaio_5.jpg |
| 9 | notebook | Sony vaio i7 | 790 | imgs/sony_vaio_5.jpg |
| 10 | monitor | Apple monitor 24 | 400 | imgs/apple_cinema.jpg |
| 11 | notebook | MacBook air | 700 | imgs/macbook_air.jpg |
| 12 | notebook | Dell i7 8gb | 700 | imgs/dell.jpg |
| 13 | notebook | 2017 Dell 15.6 Inch | 700 | imgs/dell.jpg |
| 14 | monitor | ASUS Full HD | 230 | imgs/asusm.jpg |
| 15 | notebook | MacBook Pro | 1100 | imgs/macbook_air.jpg |

> **Automation gotchas:** `GET /entries` returns only ids **1–9**; ids **10–15** come only from the pagination
> endpoint. Title of id **9** is `"Sony vaio i7\n"` — it contains a **trailing newline**; always `.trim()`.

---

## 17. API Reference (`https://api.demoblaze.com`)

| Method | Path | Request body | Purpose | Notes |
|---|---|---|---|---|
| GET | `/entries` | — | List products (ids 1–9) | also triggers pagination client-side |
| POST | `/bycat` | `{"cat":"phone\|notebook\|monitor"}` | Products by category | 7 / 6 / 2 items |
| POST | `/pagination` | `{"id":"9"}` | Items with id > given | mixed categories |
| POST | `/view` | `{"id":"3"}` | Single product detail | numbers as string or int both seen |
| POST | `/addtocart` | `{"id":"<uuid>","cookie":"user=<uuid>","prod_id":N,"flag":false}` | Add to cart | `id` = unique cart-line uuid |
| POST | `/viewcart` | `{"cookie":"user=<uuid>","flag":false}` | List cart lines | includes `prod_id` |
| POST | `/deleteitem` | `{"id":"<cart-line uuid>"}` | Remove one line | |
| POST | `/deletecart` | `{"cookie":"user=<uuid>"}` | Clear cart | returns `"Item deleted."` |
| POST | `/signup` | `{"username":..,"password":"<base64>"}` | Register | |
| POST | `/login` | `{"username":..,"password":"<base64>"}` | Authenticate | errors: `User does not exist.` / `Wrong password.` |

Cart identity = the `user=<uuid>` cookie, generated client-side and reused across pages. For deterministic tests,
either reuse one authenticated storage state or expect a fresh empty cart per new context.

---

## 18. Dialog & Message Reference

**Native `window.alert()` (must be auto-accepted/handled):**

| Trigger | Message |
|---|---|
| Add to cart | `Product added` |
| Sign up success | `Sign up successful.` |
| Sign up duplicate | `This user already exist.` |
| Login unknown user | `User does not exist.` |
| Login wrong password | `Wrong password.` |
| Contact send | `Thanks for the message!!` |

**SweetAlert (NOT a native alert):** order confirmation block in `.sweet-alert` with OK
(`.sweet-alert button.confirm`), containing dynamic Id / Amount / Card Number / Name / Date.

---

## 19. Selector / Locator Reference (recommended)

Prefer role/text/placeholder where possible; ids are stable and reliable here.

| Area | Recommended locator |
|---|---|
| Category | `page.getByRole('link', { name: 'Phones' })` (avoid duplicate `#itemc`) |
| Product card | `#tbodyid .card` → `h4 a` (title), `h5` (price) |
| Product link | `.card h4 a` (href `prod.html?idp_=<id>`) |
| Next / Prev | `#next2` / `#prev2` |
| Add to cart | `page.getByRole('link', { name: 'Add to cart' })` |
| Cart rows | `#tbodyid tr`; delete `#tbodyid tr a` |
| Total | `#totalp` |
| Place Order | `page.getByRole('button', { name: 'Place Order' })` |
| Order fields | `#name`, `#country`, `#city`, `#card`, `#month`, `#year` |
| Purchase | `page.getByRole('button', { name: 'Purchase' })` |
| SweetAlert OK | `.sweet-alert button.confirm` |
| Sign up | `#signin2`, `#sign-username`, `#sign-password`, `#signInModal button` |
| Log in | `#login2`, `#loginusername`, `#loginpassword`, `#logInModal button` |
| User label | `#nameofuser` |
| Log out | `#logout2` |
| Contact | `.navbar-nav a[data-target="#exampleModal"]`, `#recipient-email`, `#recipient-name`, `#message-text` |
| About | `.navbar-nav a[data-target="#videoModal"]`, `#videoModal video` |

---

## 20. Automation-Critical Behaviors & Gotchas

1. **`networkidle` never fires** — the site holds connections open. Use `waitUntil: 'load'` (or
   `'domcontentloaded'`) and then explicitly `waitForSelector('#tbodyid .card')` / `waitForSelector('.name')`.
2. **Native alerts block the page.** Register `page.on('dialog', d => d.accept())` and **capture
   `d.message()`** to assert text. Without a handler the test hangs until timeout.
3. **Login success produces NO dialog** — assert the `#nameofuser` label and nav visibility instead.
4. **Order confirmation is SweetAlert**, not a native alert — assert `.sweet-alert` text and click
   `.sweet-alert button.confirm`.
5. **Dynamic confirmation values** (Id, Date, Amount) — use regex/substring matching, never exact match.
6. **Duplicate `id="itemc"`** on category links — select by text/role, not `#itemc`.
7. **Product grid is async** — never assert immediately after `goto`; wait for cards.
8. **Trailing newline in "Sony vaio i7"** — always trim titles.
9. **Cookie-based cart** — new browser context ⇒ empty cart; add items before any cart/order assertion.
10. **`prod.html` uses `idp_`** (underscore) in the query string.
11. **Modals are Bootstrap fade** — allow a short wait or wait for `.modal.show` before interacting.
12. **Place Order button exists even with an empty cart** — guard the flow by adding items first.
13. **Pagination resets category** — Next returns the global id>9 list (mixed categories); don't assume filtering.
    **Prev is off-by-one**: it always queries `id > 1` (its cursor never updates), returning ids 2–10, not page 1.
14. **Duplicate test users** — usernames are persisted server-side; generate unique usernames (e.g. `qa_<timestamp>`)
    per run, and use a fresh one for the "duplicate" negative test.
15. **Signup/Login passwords are base64-encoded** in the request payload (only relevant if you assert on the API).

---

## 21. Suggested Playwright Project Structure

```
demoblaze-playwright/
├─ playwright.config.ts          # baseURL, chromium project, HTML reporter, retries
├─ tests/
│  ├─ home.spec.ts               # carousel, nav, grid, footer
│  ├─ categories.spec.ts         # phone / laptop / monitor filtering
│  ├─ pagination.spec.ts         # next / prev
│  ├─ product.spec.ts            # detail fields, add to cart
│  ├─ cart.spec.ts               # add/remove/total, empty state
│  ├─ order.spec.ts              # place order happy + validation
│  ├─ auth.spec.ts               # signup/login/logout (+ negatives)
│  ├─ contact.spec.ts            # contact modal
│  └─ about.spec.ts              # about modal/video
├─ pages/                        # Page Object Models
│  ├─ HomePage.ts
│  ├─ ProductPage.ts
│  ├─ CartPage.ts
│  ├─ AuthPage.ts                # signup + login modals
│  └─ OrderModal.ts
├─ fixtures/
│  └─ dialogs.ts                 # alert capture helper
└─ utils/
   └─ data.ts                    # catalog constants, user factory
```

`playwright.config.ts` essentials:
- `use: { baseURL: 'https://demoblaze.com', actionTimeout: 15000 }`
- Chromium project; `retries: 1`; reporter `html`.
- **Do not** rely on `networkidle`.

---

## 22. Test Scenario / Coverage Matrix

| # | Area | Scenario | Expected |
|---|---|---|---|
| 1 | Home | Page loads | Title `STORE`; 9 product cards visible |
| 2 | Home | Carousel | 3 slides present, Next/Prev indicators work |
| 3 | Nav | Header links | Home/Contact/About us/Cart/Log in/Sign up shown when logged out |
| 4 | Category | Phones | 7 products listed |
| 5 | Category | Laptops | 6 products listed |
| 6 | Category | Monitors | 2 products listed |
| 7 | Pagination | Next | id>9 list (6 mixed items); Next button hidden |
| 8 | Pagination | Prev | preceding window (ids 2–10), not the first page |
| 9 | Product | Detail fields | title/price/description/Add to cart present |
| 10 | Product | Add to cart | dialog `Product added` |
| 11 | Cart | Reflect added items | N rows, total = sum |
| 12 | Cart | Delete item | row removed, total updated |
| 13 | Cart | Empty state | no rows |
| 14 | Order | Happy path | modal → SweetAlert "Thank you for your purchase!" with OK |
| 15 | Order | Post-purchase | cart cleared |
| 16 | Auth | Sign up new | dialog `Sign up successful.` |
| 17 | Auth | Sign up duplicate | dialog `This user already exist.` |
| 18 | Auth | Login unknown | dialog `User does not exist.` |
| 19 | Auth | Login wrong password | dialog `Wrong password.` |
| 20 | Auth | Login success | no alert; `#nameofuser` = `Welcome <user>`; Log out shown |
| 21 | Auth | Log out | nav reverts to logged-out |
| 22 | Contact | Send message | dialog `Thanks for the message!!` |
| 23 | About | Open modal | video element present |

---

## 23. Test Data Strategy

- **Catalog assertions:** use the fixed titles/prices from §16 (deterministic server data).
- **Users:** generate unique per run: `const user = 'qa_' + Date.now()`. Register once, reuse for login. For the
  duplicate-signup case, submit the same username twice.
- **Cart totals:** compute expected from known prices (e.g. 360 + 820 = 1180).
- **Confirmation:** assert with `expect(text).toContain('Thank you for your purchase!')` plus a regex for the
  `Id:` / `Amount:` / `Date:` lines.

---

## 24. Example Playwright Patterns

**Dialog capture (native alerts):**

```ts
const dialogs: string[] = [];
page.on('dialog', async d => { dialogs.push(d.message()); await d.accept(); });
// ...
await page.getByRole('link', { name: 'Add to cart' }).click();
await expect.poll(() => dialogs.at(-1)).toBe('Product added');
```

**Reliable navigation (avoid networkidle):**

```ts
async function gotoHome(page: Page) {
  await page.goto('/');
  await page.waitForSelector('#tbodyid .card');   // grid is async
}
```

**Add to cart → order happy path:**

```ts
await gotoHome(page);
await page.locator('#tbodyid .card h4 a').first().click();
await page.waitForSelector('.name');
await page.getByRole('link', { name: 'Add to cart' }).click();   // dialog auto-accepted

await page.goto('/cart.html');
await expect(page.locator('#totalp')).toHaveText('360');
await page.getByRole('button', { name: 'Place Order' }).click();
await page.fill('#name', 'QA Tester');
await page.fill('#country', 'USA');
await page.fill('#city', 'New York');
await page.fill('#card', '4111111111111111');
await page.fill('#month', '12');
await page.fill('#year', '2026');
await page.getByRole('button', { name: 'Purchase' }).click();

const sweet = page.locator('.sweet-alert');
await expect(sweet).toContainText('Thank you for your purchase!');
await expect(sweet).toContainText(/Amount: 360 USD/);
await page.locator('.sweet-alert button.confirm').click();
```

**Auth (login success asserts on DOM, not dialog):**

```ts
await page.click('#login2');
await page.fill('#loginusername', user);
await page.fill('#loginpassword', pass);
await page.click('#logInModal button:has-text("Log in")');
await expect(page.locator('#nameofuser')).toContainText(`Welcome ${user}`);
await expect(page.locator('#logout2')).toBeVisible();
```

---

## 25. Evidence Files (scratch, outside the repo)

| File | Contents |
|---|---|
| `C:/Users/gabri/AppData/Local/Temp/opencode/results.json` | Full DOM/API/dialog capture of every flow |
| `C:/Users/gabri/AppData/Local/Temp/opencode/login.json` | Focused auth flow results |
| `C:/Users/gabri/AppData/Local/Temp/opencode/html.json` | Rendered HTML of key components/modals |
| `C:/Users/gabri/AppData/Local/Temp/opencode/shots/*.png` | Screenshots of each page/modal |

## 26. Screenshots Captured

`01-home-full`, `02-category-phones`, `03-category-laptops`, `04-category-monitors`, `05-pagination-next`,
`06-product-detail`, `07-cart`, `08-order-modal`, `09-purchase-confirmation`, `10-signup-modal`, `11-login-modal`,
`12-logged-in`, `13-contact-modal`, `14-about-modal`.
