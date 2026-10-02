import type { PlayerId } from './types'

export type Session =
  | { readonly kind: 'guest'; readonly playerId: PlayerId }
  | { readonly kind: 'user'; readonly playerId: PlayerId; readonly alias: string }

export interface AuthProvider {
  current(): Promise<Session>
  signIn(): Promise<void>
  signOut(): Promise<void>
}
