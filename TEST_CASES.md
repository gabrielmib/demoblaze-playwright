# Test Cases - DemoBlaze Playwright Automation

Documentación de los casos de prueba automatizados en este repositorio.

---

## Suite: Authentication (`tests/auth.spec.ts`)

| # | Caso de prueba | Descripción | Prioridad | Estado |
|---|----------------|-------------|-----------|--------|
| 1 | sign up with a new user succeeds | Registra un usuario nuevo y verifica el diálogo "Sign up successful." | P1 | Automatizado |
| 2 | sign up with a duplicate username is rejected | Registra un usuario duplicado y verifica el diálogo "This user already exist." | P1 | Automatizado |
| 3 | log in with an unknown user is rejected | Intenta login con usuario inexistente y verifica "User does not exist." | P1 | Automatizado |
| 4 | log in with a wrong password is rejected | Login con contraseña incorrecta y verifica "Wrong password." | P1 | Automatizado |
| 5 | log in with valid credentials shows the user and no dialog | Login exitoso: sin diálogo, navbar muestra "Welcome <user>" y Log out visible | P0 | Automatizado |
| 6 | logout returns to the logged-out state | Logout: navbar regresa a estado logged-out (Log in/Sign up visibles, Log out oculto) | P1 | Automatizado |

---

## Suite: Categories (`tests/categories.spec.ts`)

| # | Caso de prueba | Descripción | Prioridad | Estado |
|---|----------------|-------------|-----------|--------|
| 7 | filtering by Phones shows 7 phone products | Filtra por categoría "Phones" y verifica 7 productos: Samsung galaxy s6, Nokia lumia 1520, Nexus 6, Samsung galaxy s7, Iphone 6 32gb, Sony xperia z5, HTC One M9 | P1 | Automatizado |
| 8 | filtering by Laptops shows 6 laptop products | Filtra por categoría "Laptops" y verifica 6 productos: Sony vaio i5, Sony vaio i7, MacBook air, Dell i7 8gb, 2017 Dell 15.6 Inch, MacBook Pro | P1 | Automatizado |
| 9 | filtering by Monitors shows 2 monitor products | Filtra por categoría "Monitors" y verifica 2 productos: Apple monitor 24, ASUS Full HD | P1 | Automatizado |

---

## Casos pendientes de automatización

| # | Área | Caso de prueba | Prioridad |
|---|------|----------------|-----------|
| 10 | Home | Page loads (title STORE, 9 cards) | P1 |
| 11 | Home | Carousel (3 slides, navegación) | P2 |
| 12 | Nav | Header links (estado logged-out) | P2 |
| 13 | Pagination | Next (lista id>9, 6 items mixtos) | P1 |
| 14 | Pagination | Prev (regresa a id 1-9) | P1 |
| 15 | Product | Detail fields (title/price/description) | P1 |
| 16 | Product | Add to cart (dialog "Product added") | P0 |
| 17 | Cart | Reflect items (N rows, total = suma) | P0 |
| 18 | Cart | Delete item (row eliminada, total actualizado) | P1 |
| 19 | Cart | Empty state (sin rows) | P2 |
| 20 | Order | Happy path (SweetAlert confirmation) | P0 |
| 21 | Order | Post-purchase (cart vaciado) | P1 |
| 22 | Contact | Send message (dialog "Thanks for the message!!") | P2 |
| 23 | About | Open modal (video element) | P3 |

---

## Resumen

| Estado | Cantidad |
|--------|----------|
| Automatizados | 9 |
| Pendientes | 14 |
| **Total** | **23** |

---

## Ejecución

```powershell
# Todas las pruebas
npm test

# Solo autenticación
npm run test:auth

# Solo categorías
npx playwright test tests/categories.spec.ts

# Ver reporte HTML
npm run report
```
