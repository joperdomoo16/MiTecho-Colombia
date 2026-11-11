// Script de la hoja de Google de MiTecho. Recibe filas solo desde la función registrarlegal de Supabase.
// Va pegado en Extensiones > Apps Script de la hoja, y la clave se guarda en Configuración del proyecto >
// Propiedades del script con el nombre CLAVE (la misma que el secreto HOJA_CLAVE en Supabase).
// Crea solas las pestañas "Soporte", "Autorizaciones" y "Eliminaciones" la primera vez que llega una fila.

const Zonahoraria = 'America/Bogota';
const Estados = ['Pendiente', 'En prórroga', 'Respondida'];

// [título de la columna, dato que manda Supabase, formato]
const Columnas = {
  Soporte: [
    ['Radicado', 'radicado', ''],
    ['Fecha y hora de recepción', 'recibida', 'fechahora'],
    ['Tipo de solicitud', 'tipo', ''],
    ['Norma', 'norma', ''],
    ['Nombre', 'nombre', ''],
    ['Correo', 'correo', ''],
    ['Asunto', 'asunto', ''],
    ['Descripción', 'descripcion', ''],
    ['Usuario con cuenta', 'cuenta', ''],
    ['Fecha máxima de respuesta', 'maxima', 'fecha'],
    ['Fecha máxima con prórroga', 'prorroga', 'fecha'],
    ['Estado', '', ''],
    ['Fecha de respuesta', '', 'fecha']
  ],
  Autorizaciones: [
    ['Nombre', 'nombre', ''],
    ['Correo', 'correo', ''],
    ['Método de registro', 'metodo', ''],
    ['Fecha y hora de la autorización', 'fecha', 'fechahora'],
    ['Versión de la política', 'version', ''],
    ['Plataforma', 'plataforma', '']
  ],
  // Constancia de cuentas borradas: la política dice que se conservan el correo y la fecha
  Eliminaciones: [
    ['Correo', 'correo', ''],
    ['Nombre', 'nombre', ''],
    ['Motivo', 'motivo', ''],
    ['Fecha y hora de la eliminación', 'fecha', 'fechahora']
  ]
};

function Respuesta(Objeto) {
  return ContentService.createTextOutput(JSON.stringify(Objeto)).setMimeType(ContentService.MimeType.JSON);
}

// Compara la clave letra por letra sin salirse antes, para no dar pistas por el tiempo de respuesta
function Igualseguro(Uno, Otro) {
  if (Uno.length !== Otro.length) return false;
  let Diferencia = 0;
  for (let Indice = 0; Indice < Uno.length; Indice++) Diferencia |= Uno.charCodeAt(Indice) ^ Otro.charCodeAt(Indice);
  return Diferencia === 0;
}

// Un texto que empiece con = + - @ la hoja lo tomaría como fórmula; con el apóstrofo queda como texto normal
function Textoseguro(Valor) {
  const Texto = String(Valor == null ? '' : Valor).slice(0, 1000);
  return /^[=+\-@\t\r]/.test(Texto) ? "'" + Texto : Texto;
}

function Convertir(Valor, Formato) {
  if (Formato === 'fechahora') {
    const Momento = new Date(String(Valor));
    return isNaN(Momento.getTime()) ? Textoseguro(Valor) : Momento;
  }
  if (Formato === 'fecha') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(Valor))) return '';
    return Utilities.parseDate(String(Valor), Zonahoraria, 'yyyy-MM-dd');
  }
  return Textoseguro(Valor);
}

function Letra(Numero) {
  return String.fromCharCode(64 + Numero);
}

// Encabezados, formatos, lista de estados y colores de vencimiento; solo corre cuando la pestaña no existe
function Prepararpestana(Libro, Nombre) {
  const Existente = Libro.getSheetByName(Nombre);
  if (Existente) return Existente;
  const Hoja = Libro.insertSheet(Nombre);
  const Definicion = Columnas[Nombre];
  Hoja.getRange(1, 1, 1, Definicion.length).setValues([Definicion.map(Columna => Columna[0])])
    .setFontWeight('bold').setBackground('#12274A').setFontColor('#F2F4EC').setWrap(true);
  Hoja.setFrozenRows(1);
  Definicion.forEach((Columna, Indice) => {
    const Rango = Hoja.getRange(2, Indice + 1, Hoja.getMaxRows() - 1, 1);
    if (Columna[2] === 'fechahora') Rango.setNumberFormat('dd/mm/yyyy hh:mm am/pm');
    if (Columna[2] === 'fecha') Rango.setNumberFormat('dd/mm/yyyy');
    Hoja.setColumnWidth(Indice + 1, Columna[1] === 'descripcion' ? 360 : 170);
  });
  if (Nombre === 'Soporte') {
    const Estado = Definicion.findIndex(Columna => Columna[0] === 'Estado') + 1;
    const Maxima = Letra(Definicion.findIndex(Columna => Columna[1] === 'maxima') + 1);
    const Prorroga = Letra(Definicion.findIndex(Columna => Columna[1] === 'prorroga') + 1);
    const Columnaestado = Letra(Estado);
    const Filas = Hoja.getRange(2, 1, Hoja.getMaxRows() - 1, Definicion.length);
    Hoja.getRange(2, Estado, Hoja.getMaxRows() - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(Estados, true).setAllowInvalid(false).build()
    );
    Hoja.setConditionalFormatRules([
      // Rojo: venció el plazo y no se ha respondido
      SpreadsheetApp.newConditionalFormatRule().setRanges([Filas]).setBackground('#F8D0C4')
        .whenFormulaSatisfied('=OR(AND($' + Columnaestado + '2="Pendiente",$' + Maxima + '2<TODAY()),AND($' + Columnaestado + '2="En prórroga",$' + Prorroga + '2<TODAY()))').build(),
      // Amarillo: faltan dos días o menos
      SpreadsheetApp.newConditionalFormatRule().setRanges([Filas]).setBackground('#FFF1B8')
        .whenFormulaSatisfied('=AND($' + Columnaestado + '2="Pendiente",$' + Maxima + '2>=TODAY(),$' + Maxima + '2-TODAY()<=2)').build(),
      // Verde: ya respondida
      SpreadsheetApp.newConditionalFormatRule().setRanges([Filas]).setBackground('#D9F2DF')
        .whenFormulaSatisfied('=$' + Columnaestado + '2="Respondida"').build()
    ]);
  }
  return Hoja;
}

function doPost(Evento) {
  let Cuerpo;
  try {
    Cuerpo = JSON.parse((Evento && Evento.postData && Evento.postData.contents) || '{}');
  } catch (Falla) {
    return Respuesta({ ok: false });
  }
  const Clave = PropertiesService.getScriptProperties().getProperty('CLAVE') || '';
  if (Clave.length < 32 || typeof Cuerpo.clave !== 'string' || !Igualseguro(Cuerpo.clave, Clave)) return Respuesta({ ok: false });
  if (!Object.prototype.hasOwnProperty.call(Columnas, Cuerpo.pestana) || !Cuerpo.fila || typeof Cuerpo.fila !== 'object') return Respuesta({ ok: false });

  // El bloqueo evita que dos filas que llegan al mismo tiempo se escriban una encima de la otra
  const Bloqueo = LockService.getScriptLock();
  Bloqueo.waitLock(15000);
  try {
    const Libro = SpreadsheetApp.getActiveSpreadsheet();
    if (Libro.getSpreadsheetTimeZone() !== Zonahoraria) Libro.setSpreadsheetTimeZone(Zonahoraria);
    const Hoja = Prepararpestana(Libro, Cuerpo.pestana);
    const Fila = Columnas[Cuerpo.pestana].map(Columna => {
      if (Columna[0] === 'Estado') return 'Pendiente';
      return Columna[1] ? Convertir(Cuerpo.fila[Columna[1]], Columna[2]) : '';
    });
    Hoja.appendRow(Fila);
    return Respuesta({ ok: true });
  } finally {
    Bloqueo.releaseLock();
  }
}

// Si alguien abre la dirección en el navegador no ve nada de la hoja
function doGet() {
  return Respuesta({ ok: true });
}
