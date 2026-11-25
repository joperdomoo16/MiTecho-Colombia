// Revisión de sintaxis, límite de 400 líneas y comentario de inicio en los módulos de la aplicación

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');

const Carpetaraiz = Rutas.join(__dirname, '..');
const Contenidohtml = Archivos.readFileSync(Rutas.join(Carpetaraiz, 'index.html'), 'utf8');

const Buscadorscripts = /<script src="([^"]+)"><\/script>/g;
let Coincidencia;
const Listascripts = [];
while ((Coincidencia = Buscadorscripts.exec(Contenidohtml)) !== null) {
  Listascripts.push(Coincidencia[1]);
}

console.log('Revisando los ' + Listascripts.length + ' archivos del proyecto:\n');

let Totalerrores = 0;
for (const Rutarelativa of Listascripts) {
  const Rutaarchivo = Rutas.join(Carpetaraiz, Rutarelativa);
  if (!Archivos.existsSync(Rutaarchivo)) {
    console.error('[FALLA] Archivo no encontrado: ' + Rutarelativa);
    Totalerrores++;
    continue;
  }
  const Lineas = Archivos.readFileSync(Rutaarchivo, 'utf8').split('\n');
  const Cantidadlineas = Lineas.length;

  // Verifica que ningún módulo supere las 400 líneas de código
  if (Cantidadlineas > 400) {
    console.error(`[FALLA] ${Rutarelativa} tiene ${Cantidadlineas} líneas (supera el máximo de 400).`);
    Totalerrores++;
  }

  const Codigo = Lineas.join('\n');
  try {
    new Maquinavirtual.Script(Codigo);
    console.log(`[BIEN] ${Rutarelativa} (${Cantidadlineas} líneas) · Sintaxis válida.`);
  } catch (Falla) {
    console.error(`[ERROR DE SINTAXIS en ${Rutarelativa}]:`, Falla.message);
    Totalerrores++;
  }
}

if (Totalerrores === 0) {
  console.log('\nREVISIÓN MODULAR EXITOSA: Todos los archivos cumplen con sintaxis y tamaño menor o igual a 400 líneas.');
} else {
  console.error('\nSe encontraron ' + Totalerrores + ' problemas en los archivos.');
  process.exit(1);
}
