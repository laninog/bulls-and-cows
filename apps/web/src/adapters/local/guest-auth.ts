import type { AuthProvider, PlayerId, Session } from '../../ports'

const KEY = 'bnc:guest-id'

/**
 * Identidad de invitado: un UUID generado una vez y guardado localmente.
 * Existe desde el primer día para que, al iniciar sesión (F4), el histórico
 * local ya tenga dueño y pueda promoverse sin pérdida.
 */
export class GuestAuth implements AuthProvider {
  constructor(
    private readonly storage: Pick<Storage, 'getItem' | 'setItem'>,
    private readonly newId: () => PlayerId,
  ) {}

  async current(): Promise<Session> {
    let id = this.storage.getItem(KEY)
    if (!id) {
      id = this.newId()
      this.storage.setItem(KEY, id)
    }
    return { kind: 'guest', playerId: id }
  }

  async signIn(): Promise<void> {
    // F4: OAuth vía Worker. En modo local no hay cuenta.
  }

  async signOut(): Promise<void> {
    // F4.
  }
}
