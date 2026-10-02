import { describe, expect, it, vi } from 'vitest'
import worker from './index'
import type { Env } from './index'

function env(): Env & { ASSETS: { fetch: ReturnType<typeof vi.fn> } } {
  return {
    APP_VERSION: 'test',
    ASSETS: { fetch: vi.fn(async () => new Response('<!doctype html>', { status: 200 })) },
  } as unknown as Env & { ASSETS: { fetch: ReturnType<typeof vi.fn> } }
}

describe('worker', () => {
  it('GET /api/health responde el contrato, sin caché', async () => {
    const e = env()
    const res = await worker.fetch(new Request('http://x/api/health'), e)
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(await res.json()).toEqual({ status: 'ok', version: 'test' })
    expect(e.ASSETS.fetch).not.toHaveBeenCalled()
  })

  it('una ruta de API desconocida es 404 JSON, no la SPA', async () => {
    const e = env()
    for (const path of ['/api', '/api/nope']) {
      const res = await worker.fetch(new Request(`http://x${path}`), e)
      expect(res.status).toBe(404)
      expect(await res.json()).toEqual({ error: 'not_found' })
    }
    expect(e.ASSETS.fetch).not.toHaveBeenCalled()
  })

  it('cualquier otra ruta se delega en los assets', async () => {
    const e = env()
    const req = new Request('http://x/rules')
    const res = await worker.fetch(req, e)
    expect(e.ASSETS.fetch).toHaveBeenCalledWith(req)
    expect(await res.text()).toBe('<!doctype html>')
  })

  it('/apix no se confunde con la API', async () => {
    const e = env()
    await worker.fetch(new Request('http://x/apix'), e)
    expect(e.ASSETS.fetch).toHaveBeenCalledTimes(1)
  })
})
