#!/usr/bin/env bash
# F0 — Migración del repositorio al esqueleto v2.
#
# Ejecutar UNA VEZ desde la raíz del repositorio, con el esqueleto ya copiado.
# Pasos:
#   1. Tag del estado legacy (HEAD de master, no el working tree).
#   2. Rama nueva `main` partiendo de master.
#   3. Eliminación de los ficheros del legacy (recuperables vía el tag).
#   4. Commit inicial del esqueleto.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if git rev-parse -q --verify refs/tags/legacy/v1.0.0-alpha >/dev/null; then
  echo "El tag legacy/v1.0.0-alpha ya existe; no se recrea."
else
  git tag -a legacy/v1.0.0-alpha master -m "Estado final de la versión legacy (Vue 2 + Firebase, 2017)"
  echo "Tag legacy/v1.0.0-alpha creado sobre master."
fi

if git show-ref -q --heads main; then
  git checkout main
else
  git checkout -b main master
fi

# Ficheros del legacy que desaparecen. docs/ y los nuevos directorios se conservan.
LEGACY=(
  .babelrc .eslintignore .eslintrc.js .postcssrc.js
  build config src static test index.html
)
for p in "${LEGACY[@]}"; do
  [ -e "$p" ] && git rm -rq --cached "$p" 2>/dev/null || true
  rm -rf "$p"
done

# Ficheros que la herramienta remota no puede escribir directamente.
if [ -d scripts/f0-protected ]; then
  mkdir -p .github/workflows .vscode
  mv scripts/f0-protected/ci.yml .github/workflows/ci.yml
  mv scripts/f0-protected/npmrc .npmrc
  mv scripts/f0-protected/vscode-extensions.json .vscode/extensions.json
  rmdir scripts/f0-protected
fi

git add -A
git commit -q -m "F0: esqueleto monorepo (pnpm, Vue 3, Worker, dominio, contratos, CI)

- apps/web: Vite + Vue 3 + TypeScript strict
- apps/api: Cloudflare Worker mínimo (/health)
- packages/domain: placeholder del motor, sin dependencias
- packages/contracts: esquemas Zod
- ESLint 9 flat (no-console = error), Prettier, Vitest, Playwright
- CI: lint → format → typecheck → test → build → e2e
- pnpm-lock.yaml versionado (SEC-04)

Legacy preservado en el tag legacy/v1.0.0-alpha."

echo
echo "Hecho. Siguiente:"
echo "  corepack enable && pnpm install --frozen-lockfile && pnpm check"
echo "  git push -u origin main --tags"
