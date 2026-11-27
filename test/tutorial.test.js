// Revisión del recorrido guiado: anclajes data-tutorial, ilustraciones, geometría del foco y la flecha,
// botón permanente para saltar u omitir y coordinación con los anuncios

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');

const Raiz = Rutas.join(__dirname, '..');
const Leer = Ruta => Archivos.readFileSync(Rutas.join(Raiz, Ruta), 'utf8');
Maquinavirtual.runInThisContext(Leer('js/utils/tutorial.js'));
Maquinavirtual.runInThisContext(Leer('js/store/store-tutorial.js'));

let Errores = 0;
function Revisar(Condicion, Bien, Mal) {
  if (Condicion) console.log('[BIEN] ' + Bien);
  else { console.error('[FALLA] ' + Mal); Errores++; }
}

console.log('Iniciando revisión del recorrido guiado...\n');
const Plantillas = Archivos.readdirSync(Rutas.join(Raiz, 'vistas')).map(Nombre => Leer('vistas/' + Nombre)).join('\n');
const Todos = [...Pasosrecorrido, ...Object.values(Consejossecciones).flat()];
const Sinmarca = Todos.filter(Paso => Paso.Objetivo && !Plantillas.includes('data-tutorial="' + Paso.Objetivo + '"')).map(Paso => Paso.Objetivo);
Revisar(Sinmarca.length === 0, 'Cada paso tiene su parte marcada con data-tutorial en las plantillas.', 'Pasos sin marca en las plantillas: ' + Sinmarca.join(', '));
const Sinimagen = Todos.filter(Paso => !Archivos.existsSync(Rutas.join(Raiz, 'assets/tutorial', Paso.Imagen + '.svg'))).map(Paso => Paso.Imagen);
Revisar(Sinimagen.length === 0, 'Todas las ilustraciones existen en assets/tutorial.', 'Faltan ilustraciones: ' + Sinimagen.join(', '));
Revisar(Pasosrecorrido.length <= 7 && Pasosrecorrido[Pasosrecorrido.length - 1].Final, 'El recorrido inicial es corto (' + Pasosrecorrido.length + ' pasos) y cierra con la hoja final.', 'El recorrido inicial es largo o no cierra con la hoja final.');

const Cssfoco = (Leer('css/views.css').match(/\.tutorial-foco\b[^}]*\}/g) || []).join('\n');
Revisar(!/0\s+0\s+0\s+2px/.test(Cssfoco), 'El hueco iluminado no dibuja borde de color alrededor del objetivo.', 'Queda un borde alrededor de .tutorial-foco.');

function Crearcomponente(Estado, Tema) {
  const Componente = {
    Estadocomponente: { Ingresado: true, Autorizacionversion: '', Pestana: 'inicio', ...Estado },
    Pantalla: 'app',
    Temaactual: Tema || 'oscuro'
  };
  Object.defineProperty(Componente, 'Pestana', { get() { return this.Estadocomponente.Pestana; } });
  Componente.Cambiarestado = Cambio => {
    Componente.Estadocomponente = {
      ...Componente.Estadocomponente,
      ...(typeof Cambio === 'function' ? Cambio(Componente.Estadocomponente) : Cambio)
    };
  };
  return Componente;
}

const Nuevo = Crearcomponente({});
Revisar(Recorridoactual(Nuevo) && Recorridoactual(Nuevo).Paso === Pasosrecorrido[0], 'Una cuenta nueva empieza el recorrido en el paso 1 (perfil).', 'Una cuenta nueva no empieza en el paso 1.');
for (let Indice = 0; Indice < Pasosrecorrido.length; Indice++) Avanzarrecorrido(Nuevo, false);
Revisar(Nuevo.Estadocomponente.Tutorialvisto === true && !Recorridoactual(Nuevo), 'Al tocar Siguiente hasta Empezar el recorrido queda visto.', 'El recorrido no se marcó como visto al terminar.');

const Saltando = Crearcomponente({});
Avanzarrecorrido(Saltando, true);
Revisar(Saltando.Estadocomponente.Tutorialvisto === true, 'Saltar cierra el recorrido de una vez.', 'Saltar no cerró el recorrido.');

const Conmenu = Crearcomponente({ Menu: true });
Revisar(!Recorridoactual(Conmenu), 'No sale encima del menú, de Ayuda ni de otras ventanas.', 'El recorrido sale encima del menú.');
const Conhojacalculo = Crearcomponente({ Calculoabierto: true });
Revisar(!Recorridoactual(Conhojacalculo), 'No sale encima de las hojas informativas abiertas.', 'El recorrido sale encima de la hoja de cálculo.');

const Sinautorizar = Crearcomponente({});
Maquinavirtual.runInThisContext("var Versionpolitica = '1.2';");
Revisar(!Recorridoactual(Sinautorizar), 'Espera a que la persona acepte la autorización de datos.', 'El recorrido sale antes de la autorización.');

const Seccion = Crearcomponente({ Autorizacionversion: '1.2', Tutorialvisto: true, Pestana: 'plan', Tutorialcaja: { Arriba: 290, Izquierda: 20, Ancho: 350, Alto: 280, Radio: 20, Topesuperior: 56, Marcoancho: 390, Marcoalto: 844 } });
const Valoresplanvista = Generarvalorestutorial.call(Seccion);
Revisar(Recorridoactual(Seccion) && Recorridoactual(Seccion).Tipo === 'consejo', 'La primera vez en Plan sale su consejo.', 'No salió el consejo de Plan.');
Revisar(Valoresplanvista.Tutorialsaltar === true && Valoresplanvista.Tutorialsaltartexto === 'Omitir', 'Los consejos de un solo paso también muestran el botón Omitir.', 'Falta el botón Omitir en el consejo de Plan.');
Avanzarrecorrido(Seccion, false);
Revisar(!Recorridoactual(Seccion) && Seccion.Estadocomponente.Consejosvistos.plan, 'El consejo de Plan no se repite.', 'El consejo de Plan se repite.');

const Avatarvista = Crearcomponente({ Autorizacionversion: '1.2', Tutorialcaja: { Arriba: 64, Izquierda: 334, Ancho: 38, Alto: 38, Radio: 19, Topesuperior: 56, Marcoancho: 390, Marcoalto: 844 } }, 'claro');
const Valoresavatar = Generarvalorestutorial.call(Avatarvista);
Revisar(
  Valoresavatar.Tutorialfoco.includes('top:60px;left:330px;width:46px;height:46px;border-radius:23px') &&
  Valoresavatar.Tutorialflechaclase === 'es-arriba' &&
  Valoresavatar.Tutorialflecha === 'left:328px' &&
  Valoresavatar.Tutorialmodoclase === 'es-claro',
  'El recorte circular y la flecha apuntan con exactitud al centro del ícono de perfil.',
  'Desfase en foco o flecha de perfil: ' + Valoresavatar.Tutorialfoco + ' | ' + Valoresavatar.Tutorialflecha
);

const Sinpro = Crearcomponente({ Autorizacionversion: '1.2', Tutorialvisto: true, Panel: 'tasas', Pro: false, Desbloqueadotasas: false });
Revisar(!Recorridoactual(Sinpro), 'Sin desbloquear tasas no sale el consejo de tasas.', 'Sale el consejo de tasas estando bloqueado.');
const Contasasabiertas = Crearcomponente({ Autorizacionversion: '1.2', Tutorialvisto: true, Panel: 'tasas', Pro: false, Desbloqueadotasas: true });
Revisar(Boolean(Recorridoactual(Contasasabiertas)), 'Al desbloquear tasas con videos sí se activa su consejo.', 'No sale el consejo de tasas al desbloquearlo con videos.');

const App = Leer('js/app.js');
Revisar(/Sincronizarbanner\(Boolean\([^\n]*Estado\.Tutorialvisto && !Recorridoactual\(this\)/.test(App), 'Los anuncios esperan a que termine el recorrido.', 'El banner puede salir durante el recorrido.');
Revisar(!/Plantillaavisoperfil|Esbienvenida |Despuesbienvenida/.test(App + Plantillas), 'La bienvenida y el aviso de perfil anteriores ya no existen.', 'Quedan restos de la bienvenida o del aviso anterior.');

if (Errores) { console.error('\nREVISIÓN DEL RECORRIDO FALLIDA: ' + Errores + ' errores.'); process.exit(1); }
console.log('\nREVISIÓN DEL RECORRIDO EXITOSA: pasos, geometría, consejos y anuncios en orden.');
