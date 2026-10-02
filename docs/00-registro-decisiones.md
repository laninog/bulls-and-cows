# Registro de decisiones

Decisiones tomadas sobre el alcance y la arquitectura de la modernización.
Formato ligero: cada entrada fija una decisión y su consecuencia arquitectónica.

| ID | Decisión | Fecha | Consecuencia |
|---|---|---|---|
| **D-01** | **Se conserva la autenticación.** El jugador se identifica con una cuenta externa. | 2026-09-11 | Se necesita un proveedor de identidad. Descarta el escenario "estático puro sin backend". |
| **D-02** | **Se conserva el histórico de partidas**, sincronizado entre dispositivos. | 2026-09-11 | Se necesita persistencia servidor asociada al usuario. Es el único motivo real de dependencia de infraestructura. |
| **D-03** | **No hay datos que migrar.** La base de datos original fue eliminada. | 2026-09-11 | Libertad total de modelo de datos y de proveedor. No hay compatibilidad hacia atrás que respetar. |
| **D-04** | **Alcance = corrección de todas las brechas (BF-01…BF-13) + todas las mejoras propuestas**: reglas del juego en la aplicación, i18n, accesibilidad, PWA real, CI/CD, seguridad, observabilidad. | 2026-09-11 | El proyecto deja de ser una actualización de dependencias y pasa a ser una reconstrucción con dominio heredado. |
| **D-05** | **PWA instalable con app shell cacheado offline.** Responsive móvil + escritorio. El juego requiere conexión; no hay cola de sincronización offline. | 2026-09-11 | `vite-plugin-pwa` con estrategia *precache* del shell. Se descarta la complejidad de escrituras diferidas y resolución de conflictos. |
| **D-06** | **Entrada numérica directa como mecanismo primario**, con los selectores `+/−` conservados como modo táctil alternativo. | 2026-09-11 | Habilita accesibilidad real (teclado, foco, lector de pantalla). Es un cambio funcional respecto al original, no una corrección. |
| ~~**D-07**~~ | ~~La lógica del juego permanece en cliente. El histórico es un registro personal, sin garantía de integridad.~~ | 2026-09-11 | **Revocada por D-11** al incorporarse el ranking al alcance. |
| **D-08** | **El juego es público**, abierto a cualquier jugador, con volumen inicial bajo. | 2026-09-11 | Descarta el autohospedaje doméstico como infraestructura de producción. Activa obligaciones de RGPD (aviso de privacidad, derecho de supresión, minimización) y la necesidad de protección frente a abuso. Resuelve P-01. |
| **D-09** | **Infraestructura: Cloudflare Pages + Workers + D1.** Identidad implementada como flujo OAuth de Google dentro del propio Worker. | 2026-09-11 | Consecuencia de D-08 + DR-02 + DR-03. El Worker es necesario de todos modos para acceder a D1, por lo que el coste marginal de alojar allí la identidad es bajo. Ver doc 03 §6.3. |
| **D-10** | **Minimización de datos personales:** no se almacena el correo electrónico del jugador. Sólo un identificador opaco derivado del proveedor y un alias elegido. | 2026-09-11 | Reduce el alcance del RGPD y la superficie en caso de brecha. El ámbito `email` deja de solicitarse a Google. |
| **D-11** | **Modo híbrido.** Partida *casual*: secreto y evaluación en el cliente, jugable sin cuenta y sin red. Partida *clasificatoria*: secreto generado, custodiado y evaluado en el Worker; es la única que puntúa. | 2026-09-11 | **Revoca D-07.** El Worker pasa a tener lógica de dominio y estado de partida. El coste es bajo porque el dominio es TypeScript puro sin dependencias: **el mismo paquete se ejecuta en navegador y en Worker**, no hay dos implementaciones. Redefine el puerto de juego (doc 03 §2.2). |
| **D-12** | **Métrica de ranking: mejor partida.** Por nivel, orden por número de intentos ascendente y, a igualdad, por duración. | 2026-09-11 | Una tabla por nivel. Basta con indexar `games`; no hace falta tabla de agregados mientras el volumen sea bajo. |
| **D-13** | **Perfil público: alias obligatorio y único**, país **autodeclarado y opcional**, participación en el ranking **opt-in explícito**. El continente se deriva del país, no se almacena. | 2026-09-11 | El nombre real del proveedor de identidad **nunca se publica**. Introduce la necesidad de moderación de alias. Sin país, el jugador sólo aparece en la tabla global. |
| **D-14** | **Tablas iniciales: global y por país, en periodos histórico y mensual, por nivel.** El ámbito continental se habilita cuando haya población que lo justifique. | 2026-09-11 | Evita 36 tablas casi vacías en el lanzamiento. Una tabla con una sola entrada se lee peor que ninguna tabla. |
| **D-15** | **El país se pregunta, no se infiere.** No se usa la geolocalización por IP que ofrece el CDN. | 2026-09-11 | Mejor postura de RGPD y mejor producto: el jugador compite por el país que elige, no por el que está de paso. |
| **D-16** | **Monorepo con workspaces, partido por lo desplegable:** `apps/web`, `apps/api`, `packages/domain`, `packages/contracts`, `infra/`. Las capas hexagonales (`application/`, `ports/`, `adapters/`, `ui/`) viven **dentro** de cada app. | 2026-09-11 | Evita mezclar los pipelines de Vite y Wrangler. `adapters/` es la capa hexagonal; `infra/` es IaC — nombres distintos para cosas distintas. |
| **D-17** | **pnpm** como gestor de paquetes, con `typescript` fijado a 6.0 por *override* mientras `typescript-eslint` no soporte 7.x. | 2026-09-11 | La estrictez de pnpm impide que `domain` importe dependencias no declaradas (verificado). El *override* se retira cuando el ecosistema alcance TS 7. |
| **D-18** | **Legacy: tag `legacy/v1.0.0-alpha` y eliminación** en la rama `main`. No se mantiene copia en el árbol. | 2026-09-11 | Sin ruido en lint, tsconfig ni búsquedas. Recuperable con `git show legacy/v1.0.0-alpha:<ruta>`. |
| **D-19** | **Identidad visual: se conserva y moderniza.** Índigo `#3f51b5` como color de marca y para los *bulls*; naranja del icono original para las *cows*; icono original como logotipo. Sin Material ni framework de componentes. Resuelve P-05. | 2026-10-02 | Paleta definida como tokens CSS (`ui/styles/tokens.css`), única fuente de color. El contraste WCAG 2.2 AA de todos los pares se verifica en `pnpm check` (`scripts/check-contrast.mjs`): cambiar un color que rompa el contraste rompe la CI. |
| **D-20** | **Modo oscuro desde el inicio, siguiendo la preferencia del sistema** (`prefers-color-scheme`). | 2026-10-02 | Los e2e de axe se ejecutan en ambos temas. Un selector manual, si se quiere, irá en la pantalla de ajustes (F2.3) sin cambios en los tokens. |
| **D-21** | **Criterio de accesibilidad endurecido: cero violaciones axe WCAG 2.2 A/AA**, no solo cero críticas como decía el plan. | 2026-10-02 | Alcanzado en F2.2 en las tres pantallas, ambos temas, escritorio y móvil. |
| **D-22** | **Repositorio en Bitbucket; CI en Bitbucket Pipelines**, empezando en el plan gratuito y midiendo consumo real. Se elimina el workflow de GitHub Actions. | 2026-10-02 | 50 minutos/mes sin ampliación posible: el pipeline ejecuta el gate rápido en cualquier rama y los e2e solo en `main`, PR o manualmente; `max-time` por paso. Si el consumo no cabe: plan Standard, runner propio o espejo en GitHub (valoradas y aparcadas). |
| **D-23** | **Despliegue a Cloudflare Pages por Direct Upload desde el pipeline** (`wrangler pages deploy`). | 2026-10-02 | Consecuencia de D-22: Pages no tiene integración nativa con Bitbucket. Requiere `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` como variables seguras del repositorio (F2.4). |

## Decisiones pendientes

| ID | Cuestión | Bloquea |
|---|---|---|
| ~~P-01~~ | ~~¿Personal o público?~~ → resuelto en **D-08** | — |
| **P-02** | ¿Se conserva Google como único proveedor de identidad, o se añaden otros (GitHub, email mágico)? El modo invitado existe por diseño en cualquier caso. | Alcance de la fase F4 |
| **P-03** | ¿Idiomas objetivo de la i18n? Se asume `es` + `en`. | Alcance de traducción |
| **P-04** | ¿Dominio propio para la versión pública, o subdominio de `pages.dev`? ¿Se libera el proyecto Firebase por completo? | Fases F5 y F6 |
| ~~P-05~~ | ~~¿Identidad visual actual o rediseño?~~ → resuelto en **D-19** | — |
| **P-06** | Moderación de alias: ¿filtro automático de términos, reporte manual, o ambos? ¿Quién resuelve los reportes? | Fase F7 |
| **P-07** | Periodo de reset de las tablas mensuales y política de archivo de las anteriores. | Fase F7 |
| **P-08** | ¿Puede una partida casual convertirse en clasificatoria a posteriori? Se asume **no**: se elige el modo al empezar. | Fase F7 |
