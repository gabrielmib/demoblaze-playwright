# Guía de contribución

Gracias por contribuir a la automatización de **DemoBlaze** con Playwright + TypeScript.
Este documento describe las reglas del repositorio y las buenas prácticas de desarrollo que
esperamos en cada aporte.

Stack del proyecto:

- TypeScript
- `@playwright/test` (proyecto `chromium`)
- Patrón Page Object Model (POM) + fixtures personalizados

---

## 1. Reglas del repositorio

La rama `master` está **protegida**. Esto significa:

- **No se puede hacer push directo** a `master`. Todo cambio entra por **Pull Request (PR)**.
- El PR necesita **al menos 1 aprobación** ("review") de otro miembro.
- Si se suben commits nuevos después de una aprobación, esa aprobación se **descarta** y hay que
  volver a revisar (`dismiss stale reviews`).
- La **última push** del PR también requiere aprobación.
- El historial es **lineal**: no se permiten merge commits. Usa *Squash and merge* o *Rebase and merge*.
- Deben **resolverse todas las conversaciones** del PR antes de fusionar.
- Force-push y borrado de la rama `master` están bloqueados.

> Consejo para el autor y el revisor: trabaja siempre en una rama y abre un PR, incluso para
> cambios pequeños. Facilita la revisión y deja historial del porqué de cada cambio.

---

## 2. Flujo de trabajo (fork-less, colaborador directo)

1. Sincroniza `master`:

   ```powershell
   git checkout master
   git pull origin master
   ```

2. Crea una rama descriptiva:

   ```powershell
   git checkout -b feat/login-validation
   ```

3. Implementa el cambio siguiendo las secciones 4-6 de esta guía.

4. Verifica antes de comitear:

   ```powershell
   npx tsc --noEmit
   npm test
   ```

5. Comitea con mensajes claros (sección 3):

   ```powershell
   git add .
   git commit -m "feat(auth): validate empty password on login"
   ```

6. Sube la rama y abre el PR:

   ```powershell
   git push -u origin feat/login-validation
   gh pr create --base master --title "feat(auth): validación de password vacío" --body "Descripción del cambio"
   ```

7. Atiende los comentarios de revisión, resuelve las conversaciones y espera la aprobación.

### Nombres de rama

Usa un prefijo por tipo de cambio, en minúsculas y con guiones:

| Prefijo     | Uso                                    |
| ----------- | -------------------------------------- |
| `feat/`     | Nueva funcionalidad o escenario de test |
| `fix/`      | Corrección de un bug                   |
| `refactor/` | Reestructuración sin cambio de comportamiento |
| `docs/`     | Documentación                          |
| `chore/`    | Tareas de mantenimiento / dependencias |

---

## 3. Convención de commits

Adoptamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance opcional>): <descripción en imperativo>
```

Tipos permitidos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.

Ejemplos:

```
feat(cart): add scenario to remove an item
fix(auth): avoid race when reopening a Bootstrap modal
docs(readme): document test:ui command
chore(deps): bump @playwright/test to 1.64
```

Recomendaciones:

- Título corto (<= 72 caracteres), en imperativo ("add", no "added").
- Un commit = un cambio lógico. Evita commits gigantes mezclando temas.
- Explica el **qué** y el **porqué** en el cuerpo si no es obvio.

---

## 4. Buenas prácticas para pruebas Playwright

Este repositorio ya sigue ciertas convenciones; respétalas:

- **Page Object Model**: la interacción con la UI vive en `pages/`, no en los specs.
  Cada página nueva debe exponer métodos con intención de negocio (`login()`, `addToCart()`),
  no detalles de implementación.
- **Fixtures**: expón los Page Objects a través de `fixtures/test.ts` para que los tests usen
  `async ({ auth, dialogs })`. Añade un fixture por cada Page Object nuevo.
- **Selectores**: prioriza `id`, `role`, `getByRole`/`getByText` estables. Verifica los selectores
  contra el sitio real y documéntalos (ver `demoblaze-knowledge-base.md`). Evita selectores
  frágiles como índices posicionales o estilos CSS.
- **Nunca uses `networkidle`**. El sitio mantiene conexiones abiertas y la espera no termina.
  Espera a elementos concretos con `waitFor`/auto-waiting de Playwright.
- **Evita `waitForTimeout`** salvo justificación clara. El código actual solo lo usa como último
  recurso dentro de la lógica de reintento de modales. Prefiere aserciones con auto-retry
  (`expect.poll`, `expect(locator)`) sobre esperas fijas.
- **Aserciones web-first**: usa las aserciones de Playwright (`toBeVisible`, `toContainText`,
  `expect.poll`) en lugar de leer valores y comparar manualmente.
- **Aislamiento y paralelismo**: los datos de prueba deben ser únicos por test. Usa `makeUser()`
  (en `utils/data.ts`) en vez de usuarios fijos, para que la suite siga siendo *parallel-safe*.
- **Sin dependencias entre tests**: cada test debe poder ejecutarse solo y en cualquier orden.
- **Un test, un comportamiento**: nombre el test por el comportamiento esperado
  ("log in with a wrong password is rejected"), no por pasos ("test 3").
- **Sin secretos ni datos reales**: no comitees credenciales reales ni datos personales.
  Los datos de prueba no sensibles comparten `utils/data.ts`; los secretos van por variables de
  entorno y `.env` (ignorado por Git).

---

## 5. Buenas prácticas de código (TypeScript)

- **Modo estricto**: `tsconfig.json` tiene `strict: true`. No lo debilites ni uses `any`
  innecesariamente; prefiere tipos explícitos en las firmas públicas.
- **Sin errores de compilación**: antes de abrir el PR ejecuta `npx tsc --noEmit` y corrige todo.
- **Nombres claros**: clases `PascalCase` (`AuthPage`), métodos/variables `camelCase`,
  constantes `UPPER_SNAKE_CASE` (`PASSWORD`).
- **Funciones pequeñas y con una responsabilidad**. Extrae helpers a `utils/` cuando se repitan.
- **Comentarios**: comenta el *porqué* (decisiones no obvias, workarounds), no el *qué* obvio.
  Mantén el estilo de docstring `/** ... */` que ya usa el proyecto.
- **Formato y estilo**: sigue el estilo existente (comillas simples, punto y coma, indentación de
  2 espacios) para mantener los diffs limpios.
- **Manejo de errores**: no silencies fallos con `catch {}` vacío salvo que sea intencional y
  esté comentado (como en el reintento de modales).

---

## 6. Checklist antes de abrir un PR

- [ ] El cambio está en una rama propia (no en `master`).
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm test` pasa en local (o explico por qué lo relevante no aplica).
- [ ] Añadí/actualicé tests para el comportamiento nuevo o modificado.
- [ ] No incluí `node_modules/`, artefactos (`test-results/`, `playwright-report/`) ni secretos.
- [ ] Los commits siguen Conventional Commits.
- [ ] El PR tiene título y descripción claros (qué cambia y por qué), y referencia el issue si existe.
- [ ] Actualicé la documentación afectada (`README.md`, knowledge base, etc.).

> Nota sobre el historial lineal: al fusionar, elige *Squash and merge* (recomendado para cambios
> pequeños) o *Rebase and merge*. No uses *Create a merge commit*.

---

## 7. Guía para revisores

- Revisa el PR completo, no solo el último commit.
- Verifica: correctitud, cobertura de casos (feliz y de error), y adherencia a las secciones 4-5.
- Sé respetuoso y específico en los comentarios; explica el porqué de cada sugerencia.
- Aprueba solo cuando el checklist de la sección 6 esté satisfecho.
- Si pides cambios, resuelve las conversaciones tras la corrección.

---

## 8. Referencias

- Guía de integración con GitHub y opencode del equipo: `GITHUB_OPENCODE_SETUP.md`
- Mapa de la aplicación, selectores y matriz de escenarios: `demoblaze-knowledge-base.md`
- Documentación de Playwright: https://playwright.dev/docs/best-practices
- Conventional Commits: https://www.conventionalcommits.org/
