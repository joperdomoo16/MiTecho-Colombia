// Valores legales vigentes en Colombia para 2026 y tasas de referencia hipotecaria

const Ingresobase = 6200000;
const Ingresofijo = 3800000;
const Metaingreso = 186000;
const Ahorrobase = 24600000;
const Salariominimo = 1750905;

// Municipios donde el precio tope de vivienda de interés social llega a 150 salarios mínimos
const Ciudadesconsubsidioalto = [
  'Bogotá','Soacha','Chía','Mosquera','Funza','Madrid','Cota','Cajicá','Zipaquirá',
  'Facatativá','La Calera','Sopó','Tenjo','Tocancipá','Medellín','Bello','Itagüí',
  'Envigado','Sabaneta','La Estrella','Caldas','Copacabana','Girardota','Cali',
  'Jamundí','Yumbo','Candelaria','Barranquilla','Soledad','Malambo','Galapa',
  'Puerto Colombia','Bucaramanga','Floridablanca','Girón','Piedecuesta','Cartagena',
  'Turbaco','Cúcuta','Villa del Rosario','Los Patios'
];

const Consultartopevis = (Ciudad) => (Ciudadesconsubsidioalto.includes(Ciudad) ? 150 : 135);

const Unidadtributaria = 52374;
const Inflacionanual = 0.0517;

// Semana de las tasas promedio de la Superintendencia Financiera que usa la app; se actualiza junto con las tasas
// Se reemplaza por la fecha de corte real cuando llegan las tasas de la Superintendencia (js/Tasasmercado.js)
let Fechatasasreferencia = '23 oct 2026';
const Valoruvrhoy = 420.7199;
const Escenariosinflacion = [0.03, 0.045, 0.063];
const Inflacionequilibriouvr = 0.0558;
const Umbralingresorenta = 6900000;
const Topededuccioninteresesuvt = 1200;
const Topeanticiponominauvt = 100;
const Topepatrimoniodeclarar = 4500 * Unidadtributaria;

const Tasasreferencia = {
  promedio: { vis: 0.1435, novis: 0.1546, leasing: 0.1469, Uvr: 0.075, Etiqueta: 'Promedio bancos' },
  fna: { vis: 0.109, novis: 0.119, leasing: 0.109, Uvr: 0.053, Etiqueta: 'Fondo Nacional del Ahorro' },
  caja: { vis: 0.1135, novis: 0.1135, leasing: 0.1135, Uvr: 0.1135, Etiqueta: 'Crédito de tu Caja' }
};


const Modalidadesvivienda = {
  // Tope de cuota: 40% del ingreso familiar en VIS (Decreto 257 de 2021) y No VIS (Decreto 583 de 2025)
  novis: { Etiqueta: 'No VIS', Descripcioncorta: 'Financia 70%', Tope: 0.40, Financiacion: 0.70, Gastos: 0.04, Glosario: 'Escrituración (4%)', Etiquetanodo: 'NO VIS · 70%' },
  vis: { Etiqueta: 'VIS', Descripcioncorta: 'Financia 80%', Tope: 0.40, Financiacion: 0.80, Gastos: 0.03, Glosario: 'Escrituración VIS (3%)', Etiquetanodo: 'VIS · 80%' },
  leasing: { Etiqueta: 'Leasing', Descripcioncorta: 'Financia 80%', Tope: 0.40, Financiacion: 0.80, Gastos: 0, Glosario: 'Gastos diferidos', Etiquetanodo: 'LEASING · 80%' }
};

const Temasinterfaz = {
  oscuro: { bg:'#0B0C0A',cd:'#16180F',c2:'#24271C',ln:'rgba(255,255,255,.07)',ik:'#F2F4EC',mu:'#A3A898',fa:'#6F7466',ac:'#D4FF3A',oa:'#0B0C0A',at:'#D4FF3A',al:'#FF6A2B',dk:'#1C1E15',di:'#A3A898',fb:'#F2F4EC',of:'#0B0C0A',dm:'#2A2D22',ad:'#5E6B2A' },
  claro: { bg:'#F1F2EC',cd:'#FFFFFF',c2:'#E6E9DC',ln:'rgba(15,17,12,.09)',ik:'#0F110C',mu:'#565C4D',fa:'#7C8273',ac:'#D4FF3A',oa:'#0B0C0A',at:'#4A6900',al:'#FF6A2B',dk:'#0F110C',di:'#A3A898',fb:'#F2F4EC',of:'#0B0C0A',dm:'#E1E4D6',ad:'#9DB84A' }
};

const Fuentesingreso = ['Salario / Nómina', 'Ventas del día', 'Comisiones', 'Honorarios', 'Arriendos', 'Otros'];
const Mediospago = ['Nequi / DaviPlata', 'Cuenta bancaria', 'Efectivo'];

const Tiposdeuda = [
  'Tarjeta de crédito', 'Crédito de vehículo', 'Libranza',
  'Crédito de consumo', 'Crédito educativo', 'Arriendo', 'Otro egreso fijo'
];

const Nombrescortosdeuda = {
  'Tarjeta de crédito': 'Tarjeta',
  'Crédito de vehículo': 'Vehículo',
  'Libranza': 'Libranza',
  'Crédito de consumo': 'Consumo',
  'Crédito educativo': 'Educativo',
  'Arriendo': 'Arriendo',
  'Otro egreso fijo': 'Egreso'
};

const Clavealmacenamiento = 'mitecho.datos.v2';
// Clave de la versión anterior; sus datos se convierten una vez y luego se borran
const Clavealmacenamientoantigua = 'mitecho.datos.v1';
const Camposalmacenados = [
  'Ingresado', 'Cuestionariolisto', 'Temaelegido', 'Fijo', 'Variable', 'Tipo', 'Usarautomatico', 'Ingresomanual',
  'Pareja', 'Modalidadelegida', 'Tasatipo', 'Plazoelegido', 'Deudas', 'Registros', 'Agregado', 'Ingresosfijosextra',
  'Egresosregistrados', 'Efectivoanterior', 'Nombre', 'Edad', 'Ciudad', 'Ahorro', 'Ahorromes', 'Meta',
  'Caja', 'Cajanombre', 'Sisben', 'Recordatorios', 'Ofertasciudades', 'Promediomeses', 'Flexibleporcentaje', 'Topeconservador', 'Opcioncompra',
  'Entidad', 'Objetivousuario', 'Sisbengrupo', 'Pro', 'Cuotainicialplazo', 'Anualporcentaje', 'Contactosenviados',
  'Correo', 'Autorizacionversion', 'Fuenteingreso', 'Diasregistrados', 'Tutorialvisto', 'Consejosvistos', 'Parejaingreso', 'Parejadeudas', 'Parejanombre', 'Parejaahorro', 'Parejaactividad', 'Metodoingreso', 'Infoentidad', 'Avatarimagen', 'Financiargastos', 'Ingresovista', 'Registrotipo', 'Simuladorpaso'
];

// Funciones para dar formato en pesos colombianos, porcentajes y cálculo de anualidades
// Nada de lo que escribe la persona entra sin límite: se recorta y se quitan los caracteres de control
const Textoseguro = (Valor, Maximo, Multilinea = false) => String(Valor ?? '').replace(Multilinea ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, '').slice(0, Maximo);
const Formatoenteropesos = (Valor) => '$' + Math.round(Valor).toLocaleString('es-CO');
const Formatonumero = (Valor) => Math.round(Valor).toLocaleString('es-CO');
const Formatomillones = (Valor) => (Valor / 1e6).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const Formatoporcentaje = (Valor) => (Valor * 100).toLocaleString('es-CO', { maximumFractionDigits: 2 }) + '%';
const Promediodatos = (Lista) => (Lista && Lista.length ? Lista.reduce((Sumando, Sumandob) => Sumando + Sumandob, 0) / Lista.length : 0);

const Calcularanualidad = (Tasaanual, Anios) => {
  const Tasamensualcalculo = Math.pow(1 + Tasaanual, 1 / 12) - 1, Numero = Math.round(Anios * 12);
  return { Tasaperiodica: Tasamensualcalculo, Numerocuotas: Numero, Factoranualidad: (1 - Math.pow(1 + Tasamensualcalculo, -Numero)) / Tasamensualcalculo };
};

const Mesesvigencia = (Textovalor) => {
  const Coincidencia = String(Textovalor || '').match(/^\s*(\d{1,2})\s*\/\s*(\d{4})\s*$/);
  if (!Coincidencia) return null;
  const Fecha = new Date();
  return (+Coincidencia[2] * 12 + (+Coincidencia[1])) - (Fecha.getFullYear() * 12 + Fecha.getMonth() + 1);
};

const Normalizartexto = (Auxiliar) => Auxiliar.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function Escaparhtml(Texto) {
  if (Texto === null || Texto === undefined) return '';
  return String(Texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

