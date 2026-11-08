// Servidor temporal para comprobar que la pantalla inicial de la aplicación carga sin errores

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CarpetaRaiz = path.join(__dirname, '..');
const Puerto = 8089;

const TiposContenido = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json'
};

// Entrega los archivos de la aplicación cuando el visor de prueba los solicita
const Servidor = http.createServer((Peticion, Respuesta) => {
  const Archivo = Peticion.url === '/' ? 'index.html' : Peticion.url.split('?')[0];
  const RutaArchivo = path.join(CarpetaRaiz, Archivo);
  if (!fs.existsSync(RutaArchivo)) {
    Respuesta.writeHead(404);
    Respuesta.end('Archivo no encontrado');
    return;
  }
  const Extension = path.extname(RutaArchivo);
  Respuesta.writeHead(200, { 'Content-Type': TiposContenido[Extension] || 'text/plain' });
  fs.createReadStream(RutaArchivo).pipe(Respuesta);
});

// Abre la pantalla inicial en segundo plano y verifica que los textos base aparezcan
Servidor.listen(Puerto, () => {
  const RutaChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const Argumentos = [
    '--headless',
    '--disable-gpu',
    '--dump-dom',
    `http://localhost:${Puerto}/`
  ];
  execFile(RutaChrome, Argumentos, (Falla, Salida) => {
    Servidor.close();
    if (Falla) {
      console.error('Error al abrir el visor de prueba:', Falla);
      process.exit(1);
    }
    const TieneMarca = Salida.includes('MiTecho');
    const TieneTexto = Salida.includes('Tu techo, en cifras de banco');
    console.log('¿Aparece MiTecho?:', TieneMarca);
    console.log('¿Aparece el texto de bienvenida?:', TieneTexto);
    if (TieneMarca && TieneTexto) {
      console.log('\nPRUEBA DE PANTALLA EXITOSA: La aplicación cargó correctamente.');
    } else {
      console.log('Contenido leído:\n', Salida.slice(0, 500));
    }
  });
});
