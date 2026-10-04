import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import worker from './index'
import type { Env } from './index'
import { API_SECURITY_HEADERS, APP_SECURITY_HEADERS } from './security-headers'

/** Cabeceras de la regla `/*` de un fichero `_headers`. */
function parseAllPathsRule(text: string): Record<string, string> {
  const headers: Record<string, string> = {}
  let inRule = false
  for (const line of text.split('\n')) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      inRule = line.trim() === '/*'
      continue
    }
    if (!inRule) continue
    const i = line.indexOf(':')
    headers[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return headers
}

const env = { APP_VERSION: 't', ASSETS: { fetch: async () => new Response('') } } as unknown as Env

describe('cabeceras de seguridad', () => {
  it('_headers de la SPA coincide exactamente con APP_SECURITY_HEADERS', () => {
    const text = readFileSync(new URL('../../web/public/_headers', import.meta.url), 'utf8')
    expect(parseAllPathsRule(text)).toEqual(APP_SECURITY_HEADERS)
  })

  it('la CSP no admite unsafe-*, ni orígenes externos, ni ser enmarcada', () => {
    const csp = APP_SECURITY_HEADERS['Content-Security-Policy']
    expect(csp).not.toMatch(/unsafe-|https?:|\*|data:/)
    expect(csp).toContain("default-src 'none'")
    expect(csp).toContain("frame-ancestors 'none'")
  })

  it('toda respuesta de la API las lleva, también los errores', async () => {
    for (const path of ['/api/health', '/api/nope']) {
      const res = await worker.fetch(new Request(`https://x${path}`), env)
      for (const [name, value] of Object.entries(API_SECURITY_HEADERS))
        expect(res.headers.get(name), `${path} ${name}`).toBe(value)
    }
  })
})
