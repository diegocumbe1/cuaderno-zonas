#!/usr/bin/env bash
# Uso: ./generar_codigo.sh "Mi-Codigo-Largo-Aleatorio"
# Imprime la línea para pegar en CFG.CODIGOS del HTML (guarda el hash, no el código).
[ -z "$1" ] && { echo "Uso: $0 \"codigo\""; exit 1; }
h=$(printf "%s" "$1" | shasum -a 256 | cut -d' ' -f1)
echo "    \"$h\":{rol:\"invitado\",nombre:\"NOMBRE\"},   // cambia rol (admin|invitado) y nombre"
