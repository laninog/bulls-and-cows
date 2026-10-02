import type { HealthResponse } from '@bnc/contracts'

export interface Env {
  APP_VERSION: string
  /** Assets estáticos de la SPA (apps/web/dist). */
  ASSETS: Fetcher
}

const json = (body: unknown, init?: ResponseInit) =>
  Response.json(body, {
    ...init,
    headers: { 'Cache-Control': 'no-store', ...(init?.headers ?? {}) },
  })

async function handleApi(url: URL, env: Env): Promise<Response> {
  if (url.pathname === '/api/health') {
    const body: HealthResponse = { status: 'ok', version: env.APP_VERSION }
    return json(body)
  }
  // Una ruta de API desconocida es un 404 JSON, nunca el index.html de la SPA.
  return json({ error: 'not_found' }, { status: 404 })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return handleApi(url, env)
    // Con run_worker_first limitado a /api/*, el resto no debería llegar aquí; si llega, a los assets.
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
