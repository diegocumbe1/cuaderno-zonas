# Cuaderno de Zonas

Página estática (un solo `index.html`) para recopilar el método de un trader, probar una demo y subir archivos a Drive.
Sin backend ni base de datos: el acceso es por código (`?c=CODIGO`) y las subidas pasan por un Google Apps Script.

## Archivos
- `index.html` — la página (los códigos van como hash SHA-256 en `CFG.CODIGOS`).
- `vercel.json` — cabeceras `noindex`.
- `apps-script/drive-upload.example.gs` — plantilla del script de Drive. Copia a `drive-upload.gs` (ignorado por git), pon los códigos reales y pégalo en script.google.com.
- `scripts/generar_codigo.sh` — genera el hash de un código nuevo para `CFG.CODIGOS`.

## Despliegue
Conectar este repo a Vercel (Framework: Other, sin build). Cada `git push` a `main` publica.

## Regla de oro
Los códigos en claro solo viven en Apps Script y en tu gestor de contraseñas. Nunca en este repo.
