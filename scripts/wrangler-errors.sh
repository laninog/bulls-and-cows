#!/usr/bin/env bash
# Convierte los bloques "[ERROR]" de un log de Wrangler en anotaciones de GitHub Actions,
# para que la causa de un fallo de despliegue se vea en el resumen del run sin abrir el log.
# Uso: wrangler-errors.sh <log> <título>
set -euo pipefail
log=$1
title=${2:-wrangler}
sed 's/\x1b\[[0-9;]*m//g' "$log" | awk -v title="$title" '
  /\[ERROR\]/ { if (msg != "") print "::error title=" title "::" msg; msg = ""; n = 6; sub(/^.*\[ERROR\][ ]*/, "") }
  n > 0 { n--; gsub(/%/, "%25"); gsub(/\r/, ""); if ($0 ~ /[^ ]/) msg = msg (msg == "" ? "" : "%0A") $0 }
  END {
    if (msg != "") print "::error title=" title "::" msg
    else print "::error title=" title "::Wrangler falló sin bloque [ERROR]; revisa el log del paso."
  }'
