/** Milisegundos desde epoch. Inyectado: el dominio no conoce el tiempo; la aplicación sí. */
export type Clock = () => number
