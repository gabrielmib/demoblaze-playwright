# Resultados de Pruebas Automatizadas — DemoBlaze Playwright

## Resumen Ejecutivo

| Campo | Valor |
|-------|-------|
| **Repositorio** | https://github.com/gabrielmib/demoblaze-playwright |
| **Fecha de ejecución** | 16/10/2026 |
| **Navegador** | Chromium (Desktop Chrome) |
| **Base URL** | https://demoblaze.com |
| **Estado general** | ✅ **TODAS LAS PRUEBAS PASARON** |
| **Tests ejecutados** | 1 |
| **Tests pasados** | 1 |
| **Tests fallidos** | 0 |
| **Tiempo total** | ~9.4 segundos |

---

## Casos de Prueba Ejecutados

Se ejecutaron los **casos 14 y 15** de la matriz de cobertura definida en `demoblaze-knowledge-base.md` (§22):

| # | Área | Escenario | Resultado |
|---|------|-----------|-----------|
| **14** | Order / Checkout | **Happy path**: agregar producto al carrito → ir al carrito → Place Order → llenar formulario → Purchase → SweetAlert "Thank you for your purchase!" → clic OK | ✅ **PASS** |
| **15** | Order / Checkout | **Post-purchase**: verificar que el carrito queda vacío (`#tbodyid` sin filas) después de la compra | ✅ **PASS** |

> Nota: Ambos casos se ejecutaron en un **único test secuencial** porque el caso 15 depende del estado del carrito generado por el caso 14 (compra previa). Playwright corre tests en paralelo por defecto, por lo que se implementaron como un solo flujo lógico que cubre ambos escenarios.

---

## Detalle del Flujo de Prueba

El test implementado en `tests/order.spec.ts` siguió estos pasos:

### Paso 1 — Navegar al home y agregar producto al carrito
1. Ir a `https://demoblaze.com/`
2. Esperar a que cargue el grid de productos (`#tbodyid .card`)
3. Clic en el primer producto (enlace del título) para abrir el detail page
4. Esperar a que cargue el detail page (selector `.name`)
5. Clic en **"Add to cart"**
6. Validar que apareció el diálogo nativo **"Product added"** (capturado por el fixture `DialogRecorder`)

### Paso 2 — Caso 14: Happy path de compra
7. Ir al carrito (`/cart.html`)
8. Validar que hay al menos 1 fila en el carrito (`#tbodyid tr`)
9. Validar que el total (`#totalp`) es mayor a 0
10. Clic en **Place Order** (abre el modal `#orderModal`)
11. Llenar el formulario de orden:
    - Name: `QA Tester`
    - Country: `USA`
    - City: `New York`
    - Credit card: `4111111111111111`
    - Month: `12`
    - Year: `2026`
12. Clic en **Purchase**
13. Validar que apareció el **SweetAlert** (`.sweet-alert`) con:
    - Texto `"Thank you for your purchase!"`
    - Patrón `Amount: <N> USD`
    - Patrón `Id: <N>`
    - Patrón `Date: <dd/mm/yyyy>`
14. Clic en el botón **OK** del SweetAlert (`.sweet-alert button.confirm`)

### Paso 3 — Caso 15: Carrito vacío después de la compra
15. Ir nuevamente al carrito (`/cart.html`)
16. Validar que no hay filas en el carrito (`#tbodyid tr` count = 0)

---

## Archivos Creados o Modificados

| Archivo | Descripción |
|---------|-------------|
| `tests/order.spec.ts` | Nuevo: spec de prueba con los casos 14 y 15 |
| `pages/CartPage.ts` | Nuevo: Page Object para el carrito (`#tbodyid`, `#totalp`, Place Order) |
| `pages/OrderModal.ts` | Nuevo: Page Object para el modal de orden (formulario, Purchase, SweetAlert) |
| `RESULTADOS_PRUEBAS_ORDEN_CASOS_14_15.md` | Nuevo: este archivo de resultados |

---

## Configuración del Entorno (`playwright.config.ts`)

```ts
testDir: './tests',
fullyParallel: true,
retries: 1,
reporter: [['list'], ['html', { open: 'never' }]],
use: {
  baseURL: 'https://demoblaze.com',
  actionTimeout: 15000,
  navigationTimeout: 30000,
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
},
expect: { timeout: 10000 },
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
],
```

---

## Conclusión

✅ **Ambos casos de prueba (14 y 15) pasaron exitosamente.** El flujo de compra completo de DemoBlaze funciona correctamente: se puede agregar un producto al carrito, completar el proceso de checkout, recibir la confirmación de compra vía SweetAlert, y el carrito queda vacío después de la compra.

El código de prueba se encuentra en `tests/order.spec.ts`, `pages/CartPage.ts` y `pages/OrderModal.ts`.
