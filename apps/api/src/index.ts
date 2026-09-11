import type { HealthResponse } from '@bnc/contracts'

export interface Env {
  APP_VERSION: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/health') {
      const body: HealthResponse = { status: 'ok', version: env.APP_VERSION }
      return Response.json(body)
    }
    return new Response('Not found', { status: 404 })
  },
} satisfies ExportedHandler<Env>
