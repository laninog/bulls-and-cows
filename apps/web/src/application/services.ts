import type { AuthProvider, GameSession, HistoryRepository } from '../ports'

/**
 * Contenedor mínimo. La aplicación (stores) solo conoce los puertos; quién los
 * implementa lo decide `main.ts` (producción) o cada test.
 */
export interface Services {
  readonly auth: AuthProvider
  readonly games: GameSession
  readonly history: HistoryRepository
}

let current: Services | null = null

export function provideServices(services: Services): void {
  current = services
}

export function useServices(): Services {
  if (!current) throw new Error('Services not provided. Call provideServices() first.')
  return current
}
