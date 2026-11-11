// Revisión de seguridad: política CSP, eventos en línea en plantillas y migración de datos guardados

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');
const Cifrado = require('crypto');

const Carpetaraiz = Rutas.join(__dirname, '..');
const Leer = (Ruta) => Archivos.readFileSync(Rutas.join(Carpetaraiz, Ruta), 'utf8');
let Errores = 0;
const Revisar = (Condicion, Bien, Falla) => {
  if (Condicion) console.log('[BIEN] ' + Bien);
  else { console.error('[FALLA] ' + Falla); Errores++; }
};

console.log('Iniciando revisión de seguridad...\n');

// La CSP de la app solo deja correr scripts propios y el del certificado por su huella
const Indice = Leer('index.html');
const Politica = (Indice.match(/Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
const Scripts = (Politica.match(/script-src ([^;]+)/) || [])[1] || '';
Revisar(Politica.length > 0, 'index.html tiene política CSP.', 'index.html no tiene política CSP.');
Revisar(!Scripts.includes('unsafe-inline') && !/\bhttps:/.test(Scripts), 'script-src no permite código en línea ni scripts de cualquier sitio.', 'script-src quedó abierto: ' + Scripts);

Maquinavirtual.runInThisContext(Leer('js/Generadorpdf.js'));
const Huella = Cifrado.createHash('sha256').update(Scriptajustecertificado).digest('base64');
Revisar(Scripts.includes("'sha256-" + Huella + "'"), 'La huella del script del certificado coincide con la CSP.', 'Cambió el script del certificado: actualiza la CSP con sha256-' + Huella);

// Las plantillas usan atributos al-* y nunca onclick, onerror o similares
const Plantillas = Archivos.readdirSync(Rutas.join(Carpetaraiz, 'vistas')).map(Nombre => Leer('vistas/' + Nombre)).join('\n') + Leer('js/app.js');
const Enlinea = Plantillas.match(/\son[a-z]+="/gi) || [];
Revisar(Enlinea.length === 0, 'Las plantillas no tienen eventos en línea.', 'Hay eventos en línea en las plantillas: ' + Enlinea.slice(0, 5).join(' '));

// Los datos guardados por la versión anterior se convierten y la conversión se puede repetir sin dañar nada
Maquinavirtual.runInThisContext(Leer('js/Migraciondatos.js'));
const Antiguo = { logged: true, debts: [{ id: 'd1', name: 'Tarjeta', cuota: 300000, on: true }], entInfo: { caja: { subMonto: 5000000, mesesReq: 12 } }, rem: { daily: true } };
const Migrado = Migrarestadoantiguo(Antiguo);
Revisar(Migrado.Ingresado === true && Migrado.Deudas[0].Cuota === 300000 && Migrado.Deudas[0].id === 'd1', 'La migración convierte el estado y las deudas.', 'La migración no convirtió el estado o las deudas.');
Revisar(Migrado.Infoentidad.caja.Montosubsidio === 5000000 && Migrado.Infoentidad.caja.Mesesrequeridos === 12, 'La migración respeta las pestañas de Caja y FNA.', 'La migración dañó los datos de Caja o FNA.');
Revisar(JSON.stringify(Migrarestadoantiguo(Migrado)) === JSON.stringify(Migrado), 'Migrar dos veces deja los datos iguales.', 'Migrar dos veces cambió los datos.');

// La plantilla que usa la función de Supabase debe ser la misma de correos/Bienvenida.html
const Plantillafuncion = Leer('supabase/functions/enviarbienvenida/Plantillabienvenida.ts');
const Htmlesperado = Leer('correos/Bienvenida.html');
Revisar(Plantillafuncion.includes(JSON.stringify(Htmlesperado)), 'La plantilla de la función de bienvenida está al día.', 'Cambió correos/Bienvenida.html: corre node supabase/Actualizarplantilla.js');

// Lo mismo con el aviso de inactividad, que además solo debe tener los tres datos que llena la función
const Avisofuncion = Leer('supabase/functions/registrarlegal/Plantillainactividad.ts');
const Avisohtml = Leer('correos/Avisoinactividad.html');
Revisar(Avisofuncion.includes(JSON.stringify(Avisohtml)), 'La plantilla del aviso de inactividad está al día.', 'Cambió correos/Avisoinactividad.html: corre node supabase/Actualizarplantilla.js');
const Datosaviso = [...new Set([...Avisohtml.matchAll(/\{\{(\w+)\}\}/g)].map(Coincidencia => Coincidencia[1]))].sort().join(',');
Revisar(Datosaviso === 'correo,fecha,nombre', 'El aviso de inactividad solo usa nombre, correo y fecha.', 'El aviso de inactividad usa datos que la función no llena: ' + Datosaviso);

// El nombre del registro solo acepta letras y se valida antes de enviarlo
Maquinavirtual.runInThisContext(Leer('js/Validaciones.js'));
Revisar(Validarnombre('María José Ñañez') === '' && Validarnombre('<script>') !== '' && Validarnombre(' ') !== '', 'La validación del nombre acepta nombres reales y rechaza código.', 'La validación del nombre no se comporta como debe.');

// Los encabezados de las peticiones tienen que ser los estándar; si uno se escribe mal, Supabase no entiende lo que se le manda
const Encabezadosvalidos = ['Content-Type', 'Accept', 'apikey', 'Authorization', 'Prefer'];
const Codigored = Leer('js/Servicioapi.js');
const Encabezadosusados = [...Codigored.matchAll(/'([A-Za-z]+(?:-[A-Za-z]+)*)'\s*:\s*['(]/g)].map(Coincidencia => Coincidencia[1]);
const Desconocidos = [...new Set(Encabezadosusados.filter(Nombre => !Encabezadosvalidos.includes(Nombre)))];
Revisar(Encabezadosusados.length > 0 && Desconocidos.length === 0, 'Los encabezados de las peticiones son los estándar.', 'Hay encabezados que no existen: ' + Desconocidos.join(', '));

// La app solo habla con Supabase: la hoja de Google se llena desde el servidor, con su clave guardada allá
const Codigoapp = Leer('index.html') + Archivos.readdirSync(Rutas.join(__dirname, '..', 'js')).map(Nombre => Leer('js/' + Nombre)).join('');
Revisar(!/script\.google(usercontent)?\.com/.test(Codigoapp), 'La app no llama directo a Google Apps Script.', 'La app todavía tiene direcciones de script.google.com.');

// La versión de la política tiene que ser la misma en la app, en la función del servidor y en la página publicada
const Versionapp = (Leer('js/Valoresautorizacion.js').match(/const Versionpolitica = '([\d.]+)'/) || [])[1];
const Versionservidor = (Leer('supabase/functions/registrarlegal/index.ts').match(/const Versionpolitica = '([\d.]+)'/) || [])[1];
const Versionpagina = (Leer('sitiolegal/Politicadeprivacidad.html').match(/<span class="chip">Versión ([\d.]+)<\/span>/) || [])[1];
Revisar(Versionapp && Versionapp === Versionservidor && Versionapp === Versionpagina, 'La versión de la política coincide en la app, el servidor y el sitio legal (' + Versionapp + ').', 'Las versiones de la política no coinciden: app ' + Versionapp + ', servidor ' + Versionservidor + ', sitio ' + Versionpagina + '.');

if (Errores === 0) {
  console.log('\nREVISIÓN DE SEGURIDAD EXITOSA: CSP, plantillas y migración en orden.');
} else {
  console.error('\nSe encontraron ' + Errores + ' problemas de seguridad.');
  process.exit(1);
}
