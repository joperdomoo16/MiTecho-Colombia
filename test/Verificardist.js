// Revisión de la copia que va dentro del APK: sin comentarios, con todos los archivos y con el mismo funcionamiento

const Archivos = require('fs');
const Rutas = require('path');
const Sistema = require('os');
const Maquinavirtual = require('vm');
const Cifrado = require('crypto');
const { minify: Limpiarjs } = require('terser');
const { Prepararcarpeta } = require('../Preparardist.js');

const Raiz = Rutas.join(__dirname, '..');
let Errores = 0;
function Revisar(Condicion, Bien, Mal) {
  if (Condicion) console.log('[BIEN] ' + Bien);
  else { console.error('[FALLA] ' + Mal); Errores++; }
}

function Listar(Carpeta, Base = Carpeta) {
  return Archivos.readdirSync(Carpeta, { withFileTypes: true }).flatMap(Entrada => {
    const Ruta = Rutas.join(Carpeta, Entrada.name);
    return Entrada.isDirectory() ? Listar(Ruta, Base) : [Rutas.relative(Base, Ruta).split(Rutas.sep).join('/')];
  });
}

// Carga los archivos del motor y del reporte en un contexto aparte y devuelve sus resultados para un mismo perfil
function Resultados(Carpeta) {
  const Contexto = { console, Intl, Date, Math, JSON, crypto: Cifrado.webcrypto };
  Maquinavirtual.createContext(Contexto);
  for (const Nombre of ['Constantesbancarias', 'Historialregistros', 'Motorcalculo', 'Estiloscertificado', 'Reportedatos', 'Generadorpdfhojatres', 'Generadorpdf']) {
    Maquinavirtual.runInContext(Archivos.readFileSync(Rutas.join(Carpeta, 'js', Nombre + '.js'), 'utf8'), Contexto);
  }
  return Maquinavirtual.runInContext(`(() => {
    const Estado = { Nombre: 'Prueba Perfil', Tipo: 'mixto', Fijo: 3200000, Variable: 1300000, Fuenteingreso: 'perfil', Ahorro: 25000000, Caja: true,
      Sisben: true, Ciudad: 'Bogotá', Modalidadelegida: 'vis', Tasatipo: 'pesos', Plazoelegido: 20, Edad: 32, Ingresosfijosextra: [], Registros: [],
      Deudas: [{ Nombreitem: 'Tarjeta', Cuota: 350000, Saldo: 4200000, Activa: true }], Infoentidad: { caja: {}, fna: {} } };
    const Calculo = Calcularcapacidad(Estado);
    const Html = Construircertificadohtml(Estado, Calculo).replace(/MT-\\d{4}-[A-Z0-9]{5}/g, 'MT-CODIGO');
    return { Calculo: JSON.stringify(Calculo, (Clave, Valor) => typeof Valor === 'number' ? Math.round(Valor) : Valor), Html, Script: Scriptajustecertificado };
  })()`, Contexto);
}

(async () => {
  console.log('Iniciando revisión de la copia para el APK...\n');
  const Temporal = Archivos.mkdtempSync(Rutas.join(Sistema.tmpdir(), 'mitecho-dist-'));
  try {
    await Prepararcarpeta(Temporal);
    const Fuente = ['index.html', ...['css', 'js', 'vistas', 'assets'].flatMap(Nombre => Listar(Rutas.join(Raiz, Nombre)).map(Ruta => Nombre + '/' + Ruta))].sort();
    const Copia = Listar(Temporal).sort();
    Revisar(JSON.stringify(Fuente) === JSON.stringify(Copia), 'La copia tiene los mismos ' + Copia.length + ' archivos del proyecto.', 'Faltan o sobran archivos en la copia.');

    // Si al volver a limpiar un archivo conservando comentarios sale igual que sin ellos, es que ya no tiene ninguno
    const Concomentarios = [];
    for (const Ruta of Copia.filter(Ruta => Ruta.endsWith('.js'))) {
      const Codigo = Archivos.readFileSync(Rutas.join(Temporal, Ruta), 'utf8');
      const Conservando = await Limpiarjs(Codigo, { compress: false, mangle: false, format: { comments: 'all' } });
      const Sinellos = await Limpiarjs(Codigo, { compress: false, mangle: false, format: { comments: false } });
      if (Conservando.code !== Sinellos.code) Concomentarios.push(Ruta);
    }
    for (const Ruta of Copia.filter(Ruta => Ruta.endsWith('.css'))) if (Archivos.readFileSync(Rutas.join(Temporal, Ruta), 'utf8').includes('/*')) Concomentarios.push(Ruta);
    if (Archivos.readFileSync(Rutas.join(Temporal, 'index.html'), 'utf8').includes('<!--')) Concomentarios.push('index.html');
    Revisar(Concomentarios.length === 0, 'Ningún archivo de la copia tiene comentarios.', 'Quedaron comentarios en: ' + Concomentarios.join(', '));

    const Delproyecto = Resultados(Raiz), Delacopia = Resultados(Temporal);
    Revisar(Delproyecto.Calculo === Delacopia.Calculo, 'El motor de la copia da los mismos números que el del proyecto.', 'El motor de la copia calcula distinto.');
    Revisar(Delproyecto.Html === Delacopia.Html, 'El reporte PDF de la copia sale idéntico al del proyecto.', 'El reporte de la copia cambió.');
    const Huella = Cifrado.createHash('sha256').update(Delacopia.Script).digest('base64');
    Revisar(Archivos.readFileSync(Rutas.join(Temporal, 'index.html'), 'utf8').includes("'sha256-" + Huella + "'"), 'La huella del script del reporte sigue coincidiendo con la CSP.', 'La CSP de la copia no coincide con el script del reporte.');

    const Antes = Copia.reduce((Total, Ruta) => Total + Archivos.statSync(Rutas.join(Raiz, Ruta)).size, 0);
    const Despues = Copia.reduce((Total, Ruta) => Total + Archivos.statSync(Rutas.join(Temporal, Ruta)).size, 0);
    console.log('       Tamaño: ' + Math.round(Antes / 1024) + ' KB en el proyecto, ' + Math.round(Despues / 1024) + ' KB en la copia.');
  } finally {
    Archivos.rmSync(Temporal, { recursive: true, force: true });
  }
  if (Errores) { console.error('\nREVISIÓN DE LA COPIA FALLIDA: ' + Errores + ' errores.'); process.exit(1); }
  console.log('\nREVISIÓN DE LA COPIA EXITOSA: dist/ sale sin comentarios y funciona igual.');
})().catch(Falla => { console.error('[FALLA] ' + Falla.message); process.exit(1); });
