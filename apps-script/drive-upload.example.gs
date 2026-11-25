/**
 * drive-upload.gs — Recibe archivos desde el Cuaderno de Zonas y los guarda en la carpeta de Drive del proyecto.
 *
 * Activarlo (una sola vez):
 *  1. script.google.com → Nuevo proyecto → pega este archivo.
 *  2. Cambia los códigos de abajo (deben ser los mismos que usas en el HTML; aquí van en claro porque
 *     este script es privado, solo tuyo).
 *  3. Implementar → Nueva implementación → Aplicación web.
 *       Ejecutar como: Yo   ·   Quién tiene acceso: Cualquier persona
 *  4. Autoriza Drive. Copia la URL que termina en /exec y pégala en CFG.UPLOAD_URL del HTML.
 *
 * El servidor valida el código en cada llamada: sin código válido no se sube ni se lee nada.
 * Los archivos se crean como tú, y su nombre lleva fecha y quién lo subió (trazabilidad).
 */
var CARPETA_ID = "12XAzpqHg2J1qpUGWmOgVt4wZYP-3Niah"; // Zonas Boom Crash - Recopilado
var INVITADOS = { "CODIGO-DAVID": "david" };   // código en claro → nombre corto (NO subir a git con códigos reales)
var ADMINS = ["CODIGO-ADMIN"];                     // código en claro (NO subir a git con códigos reales)
var MAX_BYTES = 20 * 1024 * 1024;

function doPost(e) {
  try {
    var p = JSON.parse(e.postData.contents);
    var quien = INVITADOS[p.codigo] || (ADMINS.indexOf(p.codigo) >= 0 ? "admin" : null);
    if (!quien) return salida({ ok: false, error: "codigo" });
    if (!p.name || !p.data) return salida({ ok: false, error: "datos" });
    var bytes = Utilities.base64Decode(p.data);
    if (bytes.length > MAX_BYTES) return salida({ ok: false, error: "tamano" });

    var fecha = Utilities.formatDate(new Date(), "America/Guayaquil", "yyyy-MM-dd_HHmm");
    var nombre = fecha + "_" + quien + "_" + String(p.name).replace(/[\\\/]/g, "_");
    var blob = Utilities.newBlob(bytes, p.mime || "application/octet-stream", nombre);
    DriveApp.getFolderById(CARPETA_ID).createFile(blob);
    return salida({ ok: true, name: nombre });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  }
}

// Solo admin: devuelve el último "avance" (JSON) enviado por una persona.
function doGet(e) {
  try {
    if (ADMINS.indexOf(e.parameter.codigo) < 0) return salida({ ok: false, error: "codigo" });
    if (e.parameter.accion !== "avance") return salida({ ok: false, error: "accion" });
    var quien = String(e.parameter.quien || "").replace(/[^\w\-]/g, "");
    var it = DriveApp.getFolderById(CARPETA_ID).getFiles(), mejor = null;
    while (it.hasNext()) {
      var f = it.next();
      if (f.getName().indexOf("_" + quien + "_avance_") < 0) continue;
      if (!mejor || f.getDateCreated() > mejor.getDateCreated()) mejor = f;
    }
    if (!mejor) return salida({ ok: false, error: "sin_avance" });
    return salida({ ok: true, archivo: mejor.getName(), avance: JSON.parse(mejor.getBlob().getDataAsString()) });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  }
}

function salida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Ejecútala UNA vez desde el editor (▶ Ejecutar) para dar el permiso de Drive al script.
function autorizar() {
  Logger.log("OK, carpeta: " + DriveApp.getFolderById(CARPETA_ID).getName());
}
