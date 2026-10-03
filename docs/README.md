# Documentación — Bulls and Cows Legacy

Repositorio de trabajo para el análisis y la modernización de la aplicación
**Bulls and Cows** (`github.com/laninog/bulls-and-cows`, tag `v1.0.0-alpha`).

## Contexto

La aplicación sigue publicada en Firebase Hosting, pero **la Realtime Database
fue eliminada**. En consecuencia, la versión desplegada es hoy no funcional más
allá de la pantalla de login: cualquier operación de persistencia falla.

El objetivo del trabajo es doble:

1. Modernizar la aplicación (stack, calidad, seguridad).
2. Evaluar alternativas de infraestructura fuera de Firebase.

## Índice

| Doc | Contenido | Estado |
|---|---|---|
| [`00-registro-decisiones.md`](00-registro-decisiones.md) | Decisiones tomadas (D-nn) y cuestiones pendientes (P-nn) | vivo |
| [`01-levantamiento-funcional.md`](01-levantamiento-funcional.md) | Qué hace la aplicación: reglas de juego, actores, casos de uso, pantallas, modelo de datos funcional, brechas | v1 — completo |
| [`02-levantamiento-tecnico.md`](02-levantamiento-tecnico.md) | Cómo está construida: stack, arquitectura, build, testing, seguridad, catálogo de deuda técnica | v1 — completo |
| [`03-arquitectura-target.md`](03-arquitectura-target.md) | Drivers, arquitectura de puertos y adaptadores, stack objetivo, modelo de datos, comparativa de infraestructura | v1 — pendiente de cerrar P-01 |
| `04-plan-de-migracion.md` | Fases, alcance por fase, criterios de aceptación | pendiente |

## Convenciones

- **RF-nn** — requisito funcional observado (lo que la aplicación hace hoy).
- **RN-nn** — regla de negocio.
- **BF-nn** — brecha funcional (comportamiento anómalo o incompleto).
- **DT-nn** — deuda técnica, con severidad `Crítica` / `Alta` / `Media` / `Baja`.
- **SEC-nn** — hallazgo de seguridad.
- **DR-nn** — driver de arquitectura.
- **D-nn** — decisión tomada. **P-nn** — decisión pendiente.

Los documentos 01 y 02 son **descriptivos**: documentan el sistema tal como
está. Las decisiones y propuestas viven en 00, 03 y 04.

## Estado del análisis

Análisis realizado por lectura estática del código en `master`
(`460b871`). **No se ha ejecutado la aplicación**: la cadena de build es de
2017 y no se ha intentado instalar dependencias. Todo hallazgo marcado
*(no verificado en ejecución)* requiere confirmación empírica antes de darse
por cierto.
