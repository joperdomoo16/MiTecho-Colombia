// Copia los correos de la carpeta correos/ dentro de las funciones de Supabase como módulos de texto.
// Hay que correrlo cada vez que se cambie uno de estos correos: node supabase/Actualizarplantilla.js
const Archivos = require('fs');
const Rutas = require('path');

// [correo de origen, función que lo envía, archivo que se genera, nombre de la constante]
const Plantillas = [
  ['Bienvenida.html', 'enviarbienvenida', 'Plantillabienvenida.ts', 'Plantillabienvenida'],
  ['Avisoinactividad.html', 'registrarlegal', 'Plantillainactividad.ts', 'Plantillainactividad']
];

for (const [Correo, Funcion, Archivo, Constante] of Plantillas) {
  const Origen = Rutas.join(__dirname, '..', 'correos', Correo);
  const Destino = Rutas.join(__dirname, 'functions', Funcion, Archivo);
  const Html = Archivos.readFileSync(Origen, 'utf8');
  // JSON.stringify deja el HTML como una cadena válida sin importar comillas o saltos de línea
  const Contenido = '// Archivo generado desde correos/' + Correo + ' con supabase/Actualizarplantilla.js; no se edita a mano\n'
    + 'export const ' + Constante + ' = ' + JSON.stringify(Html) + ';\n';
  Archivos.writeFileSync(Destino, Contenido);
  console.log('Plantilla actualizada en ' + Rutas.relative(Rutas.join(__dirname, '..'), Destino));
}
