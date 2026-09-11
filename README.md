# Bulls and Cows

Juego web del clásico _Bulls and Cows_: adivina un número de dígitos distintos
con pistas tras cada intento. Reconstrucción de la versión de 2017
(`legacy/v1.0.0-alpha`) sobre Vue 3 y Cloudflare.

La documentación del análisis, las decisiones y el plan está en [`docs/`](docs/).

## Estructura

```
apps/web         SPA Vue 3 + Vite            → Cloudflare Pages
apps/api         Worker (API, OAuth, D1)     → Cloudflare Workers
packages/domain  Motor del juego. TS puro, sin dependencias. Corre en ambos.
packages/contracts  Esquemas Zod de la API: tipos para web, validación para api
infra/           Migraciones D1, cabeceras
docs/            Levantamiento, decisiones, arquitectura target, plan
```

Dentro de cada app las capas son hexagonales: `application/` (casos de uso,
stores), `ports/` (interfaces), `adapters/` (IndexedDB, fetch, D1), `ui/`.

## Requisitos

- Node 22 (`.nvmrc`)
- pnpm — `corepack enable` lo instala en la versión fijada en `package.json`

## Uso

```bash
pnpm install          # reproducible: pnpm-lock.yaml está versionado
pnpm dev              # SPA en http://localhost:5173
pnpm dev:api          # Worker en http://localhost:8787
pnpm check            # lint + format + typecheck + test + build (lo mismo que CI)
pnpm test:e2e         # Playwright (requiere `pnpm build` previo)
```

## Principios que impone la CI

- `no-console` es **error** en todo el repositorio.
- `packages/domain` no declara dependencias y pnpm impide importar ninguna.
- El lockfile se versiona; CI instala con `--frozen-lockfile`.
