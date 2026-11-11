// Revisión de que el PDF se presente como reporte de simulación y nunca como certificado o documento del banco

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');

for (const Nombre of ['Constantesbancarias', 'Historialregistros', 'Motorcalculo', 'Estiloscertificado', 'Reportedatos', 'Generadorpdfhojatres', 'Generadorpdf']) {
  Maquinavirtual.runInThisContext(Archivos.readFileSync(Rutas.join(__dirname, '../js/' + Nombre + '.js'), 'utf8'));
}

let Errores = 0;
function Revisar(Condicion, Bien, Mal) {
  if (Condicion) console.log('[BIEN] ' + Bien);
  else { console.error('[FALLA] ' + Mal); Errores++; }
}

const Base = { Nombre: 'Laura Gómez', Ciudad: 'Bogotá', Tipo: 'fijo', Fijo: 3000000, Ingresomanual: 3000000, Ahorro: 30000000, Deudas: [], Pareja: false };
const Perfiles = [
  { ...Base, Caja: true, Cajanombre: 'Compensar', Sisben: true },
  { ...Base, Caja: false, Entidad: 'fna', Sisben: true, Sisbengrupo: 'A1-C8' },
  { ...Base, Pareja: true, Parejanombre: 'Diego Ruiz', Parejaingreso: 2000000 }
];

const Prohibidas = ['Certificado oficial', 'CERTIFICADO', 'Código de verificación', 'preferencial', 'Preaprobado', 'Vigencia', 'puede comprar', 'pueden comprar', '>Elegible', '<svg viewBox="0 0 29 29"'];
for (const Perfil of Perfiles) {
  const Html = Construircertificadohtml(Perfil, Calcularcapacidad(Perfil));
  const Encontradas = Prohibidas.filter(Palabra => Html.includes(Palabra));
  Revisar(Encontradas.length === 0, 'Sin frases de certificado ni QR (' + (Perfil.Pareja ? 'pareja' : Perfil.Caja ? 'Caja' : 'FNA') + ').', 'El reporte todavía dice: ' + Encontradas.join(', '));
  Revisar(Html.split('class="aviso-simulacion"').length - 1 === 3, 'La leyenda de simulación sale en las 3 hojas.', 'La leyenda no está en las 3 hojas.');
  Revisar(Html.includes('Lo que te va a pedir el banco') && Html.includes('Número de consulta'), 'Trae la lista de documentos del banco y el número de consulta.', 'Falta la lista de documentos o el número de consulta.');
  Revisar(!/Hoja \d de 2/.test(Html), 'Todas las hojas dicen "de 3".', 'Queda una hoja marcada "de 2".');
}

const Visor = Archivos.readFileSync(Rutas.join(__dirname, '../js/Visorcertificado.js'), 'utf8');
Revisar(!Visor.includes('Descargar HTML') && !Visor.includes('mt-btn-dl'), 'El visor no ofrece descargar el HTML editable.', 'El visor todavía tiene el botón Descargar HTML.');

// Ataque de inyección: código HTML en todos los textos que escribe la persona; en el reporte solo puede salir como texto
const Carga = '"><img src=x onerror=alert(1)><svg onload=alert(2)><b data-inyeccion="1">';
const Ataque = { Nombre: Carga, Pareja: true, Parejanombre: Carga, Parejaactividad: Carga, Parejaingreso: 2000000, Ciudad: Carga, Caja: true, Cajanombre: '<img src=x>', Sisben: true, Sisbengrupo: Carga,
  Fijo: 3000000, Tipo: 'fijo', Ahorro: 20000000, Ahorromes: 500000, Modalidadelegida: 'vis', Tasatipo: 'pesos', Plazoelegido: 20, Registros: [], Ingresosfijosextra: [],
  Deudas: [{ Nombreitem: Carga, Concepto: Carga, Cuota: 100000, Saldo: 1000000, Activa: true }, { Nombreitem: Carga, Cuota: 50000, Activa: false }],
  Infoentidad: { caja: { Estadosubsidio: 'Asignado', Montosubsidio: 30000000, Vencesubsidio: Carga }, fna: {} } };
const Htmlataque = Construircertificadohtml(Ataque, Calcularcapacidad(Ataque));
Revisar(!/<img src=x|<svg onload|<b data-inyeccion/i.test(Htmlataque), 'Ningún texto escrito por la persona se convierte en HTML dentro del reporte.', 'El reporte dejó pasar HTML escrito por la persona.');
const Logos = Htmlataque.match(/class="caja__logo"[^>]*>[^<]*</g) || [];
Revisar(Logos.length > 0 && Logos.every(Logo => /aria-hidden="true">[A-ZÁÉÍÓÚÑ]{1,2}<$/.test(Logo)), 'El logo de la Caja solo muestra letras.', 'El logo de la Caja dejó pasar símbolos: ' + Logos.join(' '));

if (Errores === 0) {
  console.log('\nREVISIÓN DEL REPORTE EXITOSA: el PDF se presenta como simulación educativa.');
} else {
  console.error('\nSe encontraron ' + Errores + ' problemas en el reporte.');
  process.exit(1);
}
