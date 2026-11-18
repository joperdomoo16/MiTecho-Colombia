// Arma la carpeta dist/ que va dentro del APK. Aquí en el proyecto los archivos conservan sus comentarios;
// en la copia para el celular se quitan los comentarios y los espacios de más, sin cambiar el código.
const Archivos = require('fs');
const Rutas = require('path');
const { minify: Limpiarjs } = require('terser');
const Limpiadorcss = require('clean-css');

const Directoriodist = Rutas.join(__dirname, 'dist');

// Solo quita comentarios y espacios: no renombra variables ni reordena nada, porque los archivos comparten
// funciones entre sí y la huella del script del reporte en la CSP tiene que seguir igual
const Opcionesjs = { compress: false, mangle: false, format: { comments: false } };
const Opcionescss = { level: { 1: { specialComments: 0 } } };

async function Prepararjs(Origen, Destino) {
  const Resultado = await Limpiarjs(Archivos.readFileSync(Origen, 'utf8'), Opcionesjs);
  if (!Resultado || typeof Resultado.code !== 'string') throw new Error('No se pudo preparar ' + Origen);
  Archivos.writeFileSync(Destino, Resultado.code);
}

function Prepararcss(Origen, Destino) {
  const Resultado = new Limpiadorcss(Opcionescss).minify(Archivos.readFileSync(Origen, 'utf8'));
  if (Resultado.errors.length) throw new Error('No se pudo preparar ' + Origen + ': ' + Resultado.errors.join(' '));
  Archivos.writeFileSync(Destino, Resultado.styles);
}

// En el HTML solo se quitan los comentarios <!-- -->; index.html no tiene scripts escritos adentro
function Prepararhtml(Origen, Destino) {
  const Texto = Archivos.readFileSync(Origen, 'utf8');
  if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(Texto)) throw new Error(Origen + ' tiene un script escrito adentro: revisa la CSP antes de limpiarlo');
  Archivos.writeFileSync(Destino, Texto.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n+/g, '\n'));
}

// Recorre una carpeta: limpia .js y .css, y copia igual las imágenes, fuentes y demás archivos
async function Copiardirectorio(Origen, Destino) {
  if (!Archivos.existsSync(Origen)) return;
  Archivos.mkdirSync(Destino, { recursive: true });
  for (const Entrada of Archivos.readdirSync(Origen, { withFileTypes: true })) {
    const Rutaorigen = Rutas.join(Origen, Entrada.name);
    const Rutadestino = Rutas.join(Destino, Entrada.name);
    if (Entrada.isDirectory()) await Copiardirectorio(Rutaorigen, Rutadestino);
    else if (Entrada.name.endsWith('.js')) await Prepararjs(Rutaorigen, Rutadestino);
    else if (Entrada.name.endsWith('.css')) Prepararcss(Rutaorigen, Rutadestino);
    else Archivos.copyFileSync(Rutaorigen, Rutadestino);
  }
}

async function Prepararcarpeta(Carpeta = Directoriodist) {
  if (Archivos.existsSync(Carpeta)) Archivos.rmSync(Carpeta, { recursive: true, force: true });
  Archivos.mkdirSync(Carpeta, { recursive: true });
  Prepararhtml(Rutas.join(__dirname, 'index.html'), Rutas.join(Carpeta, 'index.html'));
  for (const Nombre of ['css', 'js', 'vistas', 'assets']) await Copiardirectorio(Rutas.join(__dirname, Nombre), Rutas.join(Carpeta, Nombre));
}

module.exports = { Prepararcarpeta };

if (require.main === module) {
  Prepararcarpeta()
    .then(() => console.log('Archivos de la app del celular empacados en dist/ sin comentarios.'))
    .catch(Falla => { console.error('No se pudo armar dist/: ' + Falla.message); process.exit(1); });
}
