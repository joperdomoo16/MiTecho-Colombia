// Servidor temporal para comprobar que la pantalla inicial de la aplicación carga sin errores

const Servidorhttp = require('http');
const Archivos = require('fs');
const Rutas = require('path');
const Sistema = require('os');
const { execFile: Ejecutararchivo } = require('child_process');

const Carpetaraiz = Rutas.join(__dirname, '..');
const Puerto = 8089;

const Tiposcontenido = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json'
};

// Entrega los archivos de la aplicación cuando el visor de prueba los solicita
const Servidor = Servidorhttp.createServer((Peticion, Respuesta) => {
  const Archivo = Peticion.url === '/' ? 'index.html' : Peticion.url.split('?')[0];
  const Rutaarchivo = Rutas.join(Carpetaraiz, Archivo);
  if (!Archivos.existsSync(Rutaarchivo)) {
    Respuesta.writeHead(404);
    Respuesta.end('Archivo no encontrado');
    return;
  }
  const Extension = Rutas.extname(Rutaarchivo);
  Respuesta.writeHead(200, { 'Content-Type': Tiposcontenido[Extension] || 'text/plain' });
  Archivos.createReadStream(Rutaarchivo).pipe(Respuesta);
});

// Abre la pantalla inicial en segundo plano y verifica que los textos base aparezcan
Servidor.listen(Puerto, () => {
  const Rutachrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const Argumentos = [
    '--headless',
    '--disable-gpu',
    '--dump-dom',
    // Perfil temporal para no chocar con el Chrome que esté abierto en el computador
    '--user-data-dir=' + Rutas.join(Sistema.tmpdir(), 'mitecho-prueba-chrome'),
    '--virtual-time-budget=4000',
    `http://localhost:${Puerto}/`
  ];
  Ejecutararchivo(Rutachrome, Argumentos, (Falla, Salida) => {
    Servidor.close();
    if (Falla) {
      console.error('Error al abrir el visor de prueba:', Falla);
      process.exit(1);
    }
    const Tienemarca = Salida.includes('MiTecho');
    const Tienetexto = Salida.includes('Tu techo, en cifras de banco');
    console.log('¿Aparece MiTecho?:', Tienemarca);
    console.log('¿Aparece el texto de bienvenida?:', Tienetexto);
    if (Tienemarca && Tienetexto) {
      console.log('\nPRUEBA DE PANTALLA EXITOSA: La aplicación cargó correctamente.');
    } else {
      console.log('Contenido leído:\n', Salida.slice(0, 500));
    }
  });
});
