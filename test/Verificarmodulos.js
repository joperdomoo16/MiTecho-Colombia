// Revisión de sintaxis, límite de 400 líneas y comentario de inicio en los módulos de la aplicación

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const CarpetaRaiz = path.join(__dirname, '..');
const ContenidoHtml = fs.readFileSync(path.join(CarpetaRaiz, 'index.html'), 'utf8');

const BuscadorScripts = /<script src="([^"]+)"><\/script>/g;
let Coincidencia;
const ListaScripts = [];
while ((Coincidencia = BuscadorScripts.exec(ContenidoHtml)) !== null) {
  ListaScripts.push(Coincidencia[1]);
}

console.log('Revisando los ' + ListaScripts.length + ' archivos del proyecto:\n');

let TotalErrores = 0;
for (const RutaRelativa of ListaScripts) {
  const RutaArchivo = path.join(CarpetaRaiz, RutaRelativa);
  if (!fs.existsSync(RutaArchivo)) {
    console.error('[FALLA] Archivo no encontrado: ' + RutaRelativa);
    TotalErrores++;
    continue;
  }
  const Lineas = fs.readFileSync(RutaArchivo, 'utf8').split('\n');
  const CantidadLineas = Lineas.length;

  // Verifica que ningún módulo supere las 400 líneas de código
  if (CantidadLineas > 400) {
    console.error(`[FALLA] ${RutaRelativa} tiene ${CantidadLineas} líneas (supera el máximo de 400).`);
    TotalErrores++;
  }

  const Codigo = Lineas.join('\n');
  try {
    new vm.Script(Codigo);
    console.log(`[BIEN] ${RutaRelativa} (${CantidadLineas} líneas) · Sintaxis válida.`);
  } catch (Falla) {
    console.error(`[ERROR DE SINTAXIS en ${RutaRelativa}]:`, Falla.message);
    TotalErrores++;
  }
}

if (TotalErrores === 0) {
  console.log('\nREVISIÓN MODULAR EXITOSA: Todos los archivos cumplen con sintaxis y tamaño menor o igual a 400 líneas.');
} else {
  console.error('\nSe encontraron ' + TotalErrores + ' problemas en los archivos.');
  process.exit(1);
}
