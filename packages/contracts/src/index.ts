import { z } from 'zod'
import { LEVELS } from '@bnc/domain'

/** Placeholder: F3 define aquí los contratos reales de la API. */
export const HealthResponse = z.object({
  status: z.literal('ok'),
  version: z.string(),
})
export type HealthResponse = z.infer<typeof HealthResponse>

export const LevelSchema = z.union([
  z.literal(LEVELS[0]),
  z.literal(LEVELS[1]),
  z.literal(LEVELS[2]),
  z.literal(LEVELS[3]),
])
