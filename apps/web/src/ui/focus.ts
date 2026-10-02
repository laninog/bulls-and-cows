/**
 * Gestión de foco tras navegar (patrón SPA accesible): el foco va al elemento
 * marcado con `data-autofocus` de la vista o, si no hay, a su encabezado
 * principal. Así el lector de pantalla anuncia la nueva vista y el usuario de
 * teclado no se queda en el enlace que pulsó.
 */
export function focusView(root: ParentNode = document): HTMLElement | null {
  const main = root.querySelector('main')
  if (!main) return null
  const target =
    main.querySelector<HTMLElement>('[data-autofocus]') ?? main.querySelector<HTMLElement>('h2')
  if (!target) return null
  if (!target.matches('input, button, select, textarea, a[href], [tabindex]')) {
    target.setAttribute('tabindex', '-1')
  }
  target.focus()
  return target
}
