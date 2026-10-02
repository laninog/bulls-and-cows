// Verifica WCAG 2.2 AA sobre los tokens de color reales (tokens.css), en ambos temas.
// Texto: ≥ 4.5:1 (1.4.3). Componentes de interfaz y foco: ≥ 3:1 (1.4.11).
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../apps/web/src/ui/styles/tokens.css', import.meta.url), 'utf8')
const [lightCss, darkCss = ''] = css.split('@media (prefers-color-scheme: dark)')
const parse = (block) =>
  Object.fromEntries(
    [...block.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
  )
const themes = { light: parse(lightCss), dark: { ...parse(lightCss), ...parse(darkCss) } }

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

const TEXT = 4.5
const UI = 3
const pairs = [
  ['text', 'bg', TEXT],
  ['text', 'surface', TEXT],
  ['text', 'surface-2', TEXT],
  ['text-muted', 'bg', TEXT],
  ['text-muted', 'surface', TEXT],
  ['text-muted', 'surface-2', TEXT],
  ['accent', 'bg', TEXT],
  ['accent', 'surface', TEXT],
  ['accent-contrast', 'accent', TEXT],
  ['accent-contrast', 'accent-hover', TEXT],
  ['bull-fg', 'bull-bg', TEXT],
  ['cow-fg', 'cow-bg', TEXT],
  ['danger', 'bg', TEXT],
  ['danger', 'surface', TEXT],
  ['border-strong', 'surface', UI],
  ['border-strong', 'bg', UI],
  ['focus', 'bg', UI],
  ['focus', 'surface', UI],
]

let failed = 0
for (const [theme, p] of Object.entries(themes)) {
  for (const [fg, bg, min] of pairs) {
    if (!p[fg] || !p[bg]) {
      console.error(`FAIL ${theme}: falta --color-${p[fg] ? bg : fg}`)
      failed++
      continue
    }
    const r = ratio(p[fg], p[bg])
    if (r < min) {
      console.error(`FAIL ${theme} ${fg} on ${bg}: ${r.toFixed(2)} < ${min}`)
      failed++
    }
  }
}
if (failed) process.exit(1)
console.log(`Contraste WCAG AA: ${pairs.length * 2} pares ok (claro y oscuro).`)
