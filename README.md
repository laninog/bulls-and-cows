# Bulls and Cows

Juego web del clásico _Bulls and Cows_: adivina un número de dígitos distintos
con pistas tras cada intento. Reconstrucción de la versión de 2017
(`legacy/v1.0.0-alpha`) sobre Vue 3 y Cloudflare Workers.

La documentación del análisis, las decisiones y el plan está en [`docs/`](docs/).

## Estructura

```
apps/web            SPA Vue 3 + Vite (PWA). Su build son los assets del Worker.
apps/api            Worker único: sirve la SPA y la API en /api/*  → Cloudflare Workers
packages/domain     Motor del juego. TS puro, sin dependencias. Corre en navegador y Worker.
packages/contracts  Esquemas Zod de la API: tipos para web, validación para api
infra/              Migraciones D1
docs/               Levantamiento, decisiones, arquitectura target, plan
```

Dentro de cada app las capas son hexagonales: `application/` (casos de uso,
stores), `ports/` (interfaces), `adapters/` (IndexedDB, fetch, D1), `ui/`.

## Requisitos

- Node 22 (`.nvmrc`)
- pnpm 10 (versión fijada en `package.json`; con pnpm ≥ 9.7 se autogestiona)

## Uso

```bash
pnpm install          # reproducible: pnpm-lock.yaml está versionado
pnpm dev              # SPA con recarga en caliente en http://localhost:5173
pnpm dev:lan          # ídem, accesible desde otros equipos de la red
pnpm check            # auditoría no incluida; lint, formato, contraste, tipos, tests, build
pnpm check:audit      # auditoría de dependencias (necesita red)
pnpm build && pnpm --filter @bnc/api preview   # el Worker real sirviendo la build en :4173
pnpm test:e2e         # Playwright contra el Worker real (requiere `pnpm build`)
```

## Despliegue

Producción: **https://bulls-and-cows.gameslab.workers.dev**

GitHub Actions despliega a Cloudflare **solo desde `main` y solo si pasan
`check` y `e2e`**, publicando exactamente la build que pasó las pruebas. Cada PR
del propio repositorio recibe una URL de previsualización (`pr-<n>`).

Configuración, una sola vez:

1. **Token de API** — Cloudflare → _My Profile → API Tokens → Create Token_ →
   plantilla **Edit Cloudflare Workers**. Limítalo a tu cuenta y quita los
   permisos que no use el despliegue (el Worker solo necesita _Workers Scripts: Edit_
   más las lecturas de cuenta y usuario).
2. **Account ID** — panel de Cloudflare → _Workers & Pages_, columna derecha.
3. **Subdominio `workers.dev`** — _Workers & Pages_ → elige uno si aún no lo
   tienes (solo la primera vez en la cuenta). Forma parte de la URL pública:
   mejor un nombre neutro que uno personal.
4. **Secretos en GitHub** — _Settings → Secrets and variables → Actions →
   New repository secret_: `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.

El siguiente push a `main` despliega en `https://bulls-and-cows.<subdominio>.workers.dev`.
El job comprueba después que `/api/health` responde con el commit desplegado
(reintenta hasta 2 minutos mientras la versión se propaga). Si Wrangler falla, el
error aparece como anotación en el resumen del run.

## Principios que impone la CI

- `no-console` es **error** en todo el repositorio.
- `packages/domain` no declara dependencias y pnpm impide importar ninguna.
- El lockfile se versiona; CI instala con `--frozen-lockfile`.
- Vulnerabilidades altas o críticas en dependencias rompen la build.
- Contraste WCAG AA de la paleta y cero violaciones axe en todas las pantallas.
- Los _source maps_ nunca se publican (`.assetsignore`).
