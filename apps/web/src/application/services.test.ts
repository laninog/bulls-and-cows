import { describe, expect, it } from 'vitest'
import { provideServices, useServices } from './services'
import { createTestServices } from './test-services'

describe('services container', () => {
  it('devuelve lo provisto', () => {
    const { services } = createTestServices()
    provideServices(services)
    expect(useServices()).toBe(services)
  })
})
