// Copia los archivos y carpetas de la aplicación móvil hacia la carpeta lista para instalar en el celular
const fs = require('fs');
const path = require('path');

const Directoriodist = path.join(__dirname, 'dist');
if (fs.existsSync(Directoriodist)) {
  fs.rmSync(Directoriodist, { recursive: true, force: true });
}
fs.mkdirSync(Directoriodist, { recursive: true });

fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(Directoriodist, 'index.html'));

// Recorre una carpeta y copia todo su contenido conservando las subcarpetas
function Copiardirectorio(Origen, Destino) {
  if (!fs.existsSync(Origen)) return;
  fs.mkdirSync(Destino, { recursive: true });
  const Entradas = fs.readdirSync(Origen, { withFileTypes: true });
  for (const Entrada of Entradas) {
    const Rutaorigen = path.join(Origen, Entrada.name);
    const Rutadestino = path.join(Destino, Entrada.name);
    if (Entrada.isDirectory()) {
      Copiardirectorio(Rutaorigen, Rutadestino);
    } else {
      fs.copyFileSync(Rutaorigen, Rutadestino);
    }
  }
}

Copiardirectorio(path.join(__dirname, 'css'), path.join(Directoriodist, 'css'));
Copiardirectorio(path.join(__dirname, 'js'), path.join(Directoriodist, 'js'));
Copiardirectorio(path.join(__dirname, 'vistas'), path.join(Directoriodist, 'vistas'));
Copiardirectorio(path.join(__dirname, 'assets'), path.join(Directoriodist, 'assets'));

console.log('Archivos de la aplicación móvil empacados en dist/.');
