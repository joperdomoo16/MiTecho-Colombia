// Revisión de lo que Firebase Hosting publicaría: solo los sitios legales, la página de recuperación y los logos.
// El hosting publica la raíz del proyecto con una lista de exclusiones, así que una carpeta nueva podría quedar en internet sin querer

const Archivos = require('fs');
const Rutas = require('path');

const Raiz = Rutas.join(__dirname, '..');
const Exclusiones = JSON.parse(Archivos.readFileSync(Rutas.join(Raiz, 'firebase.json'), 'utf8')).hosting.ignore;
const Permitidos = [/^404\.html$/,/^sitiolegal\/[^/]+\.(html|css|js|png|webp|svg|ico)$/, /^siterecuperacion\/(?:[a-z]+\/)?[^/]+\.(html|css|js)$/, /^assets\/Logo(app|glyph)\.(png|webp)$/];

// Convierte los patrones de Firebase (** y *) en expresiones regulares
function Patron(Texto) {
  const Escapado = Texto.replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*\//g, '\u0001').replace(/\/\*\*/g, '\u0002').replace(/\*\*/g, '\u0003').replace(/\*/g, '[^/]*');
  return new RegExp('^' + Escapado.replace(/\u0001/g, '(?:.*/)?').replace(/\u0002/g, '(?:/.*)?').replace(/\u0003/g, '.*') + '$');
}
const Patrones = Exclusiones.map(Patron);
const Excluido = Ruta => Patrones.some(Expresion => Expresion.test(Ruta));

function Publicados(Carpeta = '') {
  return Archivos.readdirSync(Rutas.join(Raiz, Carpeta), { withFileTypes: true }).flatMap(Entrada => {
    const Ruta = Carpeta ? Carpeta + '/' + Entrada.name : Entrada.name;
    if (Entrada.isDirectory()) return Excluido(Ruta) || Excluido(Ruta + '/x') ? [] : Publicados(Ruta);
    return Excluido(Ruta) ? [] : [Ruta];
  });
}

console.log('Iniciando revisión de lo que se publica en el hosting...\n');
const Lista = Publicados();
const Sobrantes = Lista.filter(Ruta => !Permitidos.some(Expresion => Expresion.test(Ruta)));
console.log('       Se publicarían ' + Lista.length + ' archivos.');
if (Sobrantes.length) {
  console.error('[FALLA] Se publicarían archivos que no son de los sitios: ' + Sobrantes.join(', '));
  console.error('\nREVISIÓN DEL HOSTING FALLIDA: agrega esas rutas a "ignore" en firebase.json.');
  process.exit(1);
}
console.log('[BIEN] Solo se publican los sitios legales, la página de recuperación y los logos.');
console.log('\nREVISIÓN DEL HOSTING EXITOSA: nada del código interno queda en internet.');
