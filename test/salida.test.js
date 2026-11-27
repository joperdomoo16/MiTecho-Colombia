// Revisión de entradas extremas: ningún cálculo da Infinity, NaN o notación científica,
// la carga que sube a la nube sale acotada y los datos de AdMob y versión se muestran antes de publicar

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');

const Raiz = Rutas.join(__dirname, '..');
const Leer = Ruta => Archivos.readFileSync(Rutas.join(Raiz, Ruta), 'utf8');
for (const Nombre of ['store/constantes-bancarias', 'utils/validaciones', 'utils/historial-registros', 'utils/motor-subsidios', 'utils/motor-calculo', 'services/cloud-backup']) {
  Maquinavirtual.runInThisContext(Leer('js/' + Nombre + '.js'));
}

let Errores = 0;
function Revisar(Condicion, Bien, Mal) {
  if (Condicion) console.log('[BIEN] ' + Bien);
  else { console.error('[FALLA] ' + Mal); Errores++; }
}

const Cadenalarga = '9'.repeat(40);
Revisar(Limpiardigitos(Cadenalarga) === Limitesfinancieros.Ingresomensual, 'Pegar 40 nueves queda en el tope de ingresos.', 'Limpiardigitos no recorta cifras largas.');
Revisar(Limpiardigitos(Cadenalarga, Limitesfinancieros.Ahorro) === Limitesfinancieros.Ahorro, 'Pegar 40 nueves en ahorro queda en su tope.', 'El ahorro no queda acotado.');
Revisar(Limpiardecimal('9'.repeat(30) + ',' + '9'.repeat(30)) === Limitesfinancieros.Tasaeamaxima, 'Una tasa escrita con cifras largas queda en 40%.', 'La tasa no queda acotada.');

function Texto(Valor) {
  return Formatoenteropesos(Valor) + Formatomillones(Valor) + Formatonumero(Valor) + Formatoporcentaje(Valor);
}
Revisar(!/NaN|Infinity|e\+/i.test(Texto(Infinity) + Texto(NaN) + Texto(1e40)), 'Los formatos de pesos y millones nunca muestran NaN, Infinity ni notación científica.', 'Un formato muestra NaN, Infinity o e+.');

const Extremos = {
  Fijo: Limitesfinancieros.Ingresomensual, Variable: Limitesfinancieros.Ingresomensual, Tipo: 'mixto',
  Ahorro: Limitesfinancieros.Ahorro, Ahorromes: Limitesfinancieros.Ahorromensual,
  Objetivousuario: Limitesfinancieros.Viviendaobjetivo, Ciudad: 'Bogotá', Plazoelegido: 5,
  Deudas: Array.from({ length: Limitesfinancieros.Maximodeudas }, () => ({ Cuota: Limitesfinancieros.Deudacuota, Saldo: Limitesfinancieros.Deudasaldo, Activa: true })),
  Ingresosfijosextra: Array.from({ length: Limitesfinancieros.Maximoingresosextra }, () => ({ Monto: Limitesfinancieros.Ingresomensual })),
  Pareja: true, Parejaingreso: Limitesfinancieros.Ingresomensual, Parejadeudas: Limitesfinancieros.Deudacuota
};
const Ceros = { Fijo: 0, Variable: 0, Ahorro: 0, Ahorromes: 0, Objetivousuario: 0, Deudas: [], Ciudad: 'Bogotá' };
function Revisarnumeros(Objeto, Ruta, Malos) {
  Object.keys(Objeto || {}).forEach(Clave => {
    const Valor = Objeto[Clave];
    if (typeof Valor === 'number' && !Number.isFinite(Valor)) Malos.push(Ruta + Clave);
    else if (typeof Valor === 'number' && Math.abs(Valor) >= 1e21) Malos.push(Ruta + Clave + ' (muy grande)');
    else if (Valor && typeof Valor === 'object' && !Array.isArray(Valor)) Revisarnumeros(Valor, Ruta + Clave + '.', Malos);
  });
}
for (const Modalidad of ['vis', 'novis', 'leasing']) {
  for (const [Nombre, Entrada] of [['extremos', Extremos], ['en ceros', Ceros]]) {
    const Malos = [];
    let Resultado = null;
    try {
      Resultado = Calcularcapacidad({ ...Entrada, Modalidadelegida: Modalidad });
    } catch (Falla) {
      Malos.push('lanzó ' + Falla.message);
    }
    if (Resultado) Revisarnumeros(Resultado, '', Malos);
    Revisar(Malos.length === 0, 'Cálculo ' + Modalidad + ' con valores ' + Nombre + ' sin Infinity ni NaN.', 'Cálculo ' + Modalidad + ' ' + Nombre + ': ' + Malos.slice(0, 5).join(', '));
    if (Resultado) Revisar(!/e\+|NaN|Infinity/.test(Texto(Resultado.Preciomaximo) + Texto(Resultado.Credito) + Texto(Resultado.Cuotamensual)), 'Los textos de ' + Modalidad + ' ' + Nombre + ' no traen notación científica.', 'Texto con e+ en ' + Modalidad + ' ' + Nombre);
  }
}

const Cargaenvenenada = Acotarcargaperfil({ fijo: Infinity, ahorro: 1e40, nombre: 'x'.repeat(5000), pareja_ing: NaN, datos_perfil: { texto: 'y'.repeat(30000) } });
Revisar(Cargaenvenenada.fijo === 0 && Cargaenvenenada.ahorro === 1e10 && Cargaenvenenada.nombre.length === 200 && Cargaenvenenada.pareja_ing === 0 && Object.keys(Cargaenvenenada.datos_perfil).length === 0,
  'La carga hacia Supabase descarta Infinity, NaN, números enormes y textos desmedidos.', 'Acotarcargaperfil dejó pasar valores extremos.');
Revisar(/Acotarcargaperfil\(Perfil\)/.test(Leer('js/services/api-service.js')), 'Guardarperfilapi pasa el perfil por la limpieza antes de enviarlo.', 'Guardarperfilapi no limpia el perfil.');

const Anuncios = Leer('js/services/anuncios.js');
const Textos = Leer('android/app/src/main/res/values/strings.xml');
const Gradle = Leer('android/app/build.gradle');
const Versioncodigo = (Gradle.match(/versionCode\s+(\d+)/) || [])[1];
const Versionnombre = (Gradle.match(/versionName\s+"([^"]+)"/) || [])[1];
Revisar(Versionnombre === JSON.parse(Leer('package.json')).version, 'versionName ' + Versionnombre + ' coincide con package.json (versionCode ' + Versioncodigo + ').', 'versionName y package.json no coinciden.');
if (/Prueba:\s*true/.test(Anuncios) || /3940256099942544/.test(Textos + Anuncios)) {
  // Es solo informativo: en fase de testing los ID de prueba son lo correcto y no bloquean npm test
  console.log('\n[AVISO] AdMob está con ID de prueba (Prueba: true). Es lo correcto en testing. Para producción cambia Banner y Recompensa en js/services/anuncios.js, Prueba a false, y admob_app_id en strings.xml.');
} else {
  console.log('[BIEN] AdMob usa ID de producción.');
}

if (Errores) { console.error('\nREVISIÓN DE SALIDA FALLIDA: ' + Errores + ' errores.'); process.exit(1); }
console.log('\nREVISIÓN DE SALIDA EXITOSA: entradas extremas y carga a la nube bajo control.');
