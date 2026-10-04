/**
 * Cabeceras de seguridad (SEC-07). Fuente única: `apps/web/public/_headers` las
 * repite para los assets estáticos y un test comprueba que ambos coinciden.
 *
 * La CSP no necesita `unsafe-inline` ni `unsafe-eval`: la build de Vite no emite
 * scripts ni estilos en línea (`injectRegister: false` en la PWA) y Vue aplica
 * los estilos dinámicos por CSSOM, que la CSP no restringe.
 */

/** Cabeceras comunes a toda respuesta, de la SPA o de la API. */
export const BASE_SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
} as const

/** Cabeceras de los documentos y assets de la SPA. */
export const APP_SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
  ...BASE_SECURITY_HEADERS,
  'X-Frame-Options': 'DENY',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
} as const

/** Cabeceras de las respuestas JSON de la API: nada que cargar ni enmarcar. */
export const API_SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  ...BASE_SECURITY_HEADERS,
} as const
