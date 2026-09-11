import { describe, expect, it } from 'vitest'
import worker from './index'

const env = { APP_VERSION: 'test' }

describe('api placeholder', () => {
  it('responde /health con el contrato', async () => {
    const res = await worker.fetch(new Request('http://x/health'), env)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok', version: 'test' })
  })
  it('devuelve 404 para rutas desconocidas', async () => {
    const res = await worker.fetch(new Request('http://x/nope'), env)
    expect(res.status).toBe(404)
  })
})
