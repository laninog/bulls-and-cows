# Migraciones D1

Una migración por fichero, numeradas y **nunca editadas** una vez aplicadas:

    0001_initial.sql
    0002_add_players.sql

Se aplican con `wrangler d1 migrations apply` (F3). Este directorio es la fuente
de verdad del esquema: no se hacen cambios manuales en la base de datos.
