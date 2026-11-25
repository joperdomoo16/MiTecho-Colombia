// Valores legales vigentes en Colombia para 2026 y tasas de referencia hipotecaria

const Ingresobase = 6200000;
const Ingresofijo = 3800000;
const Metaingreso = 186000;
const Ahorrobase = 24600000;
const Salariominimo = 1750905;
// Año de los valores legales de este archivo (salario mínimo, topes VIS y VIP)
const Aniovigente = 2026;

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
const Topeanticiponominauvt = 100;

const Tasasreferencia = {
  promedio: { vis: 0.1435, novis: 0.1546, leasing: 0.1469, Uvr: 0.075, Etiqueta: 'Promedio bancos' },
  fna: { vis: 0.109, novis: 0.119, leasing: 0.109, Uvr: 0.053, Etiqueta: 'Fondo Nacional del Ahorro' },
  caja: { vis: 0.1135, novis: 0.1135, leasing: 0.1135, Uvr: 0.1135, Etiqueta: 'Crédito de tu Caja' }
};


const Modalidadesvivienda = {
  // Tope de cuota: 40% del ingreso familiar en VIS (Decreto 257 de 2021) y No VIS (Decreto 583 de 2025)
  // Gastos del comprador: notaría y registro de la compraventa, impuesto de registro departamental (hasta 1%) y la hipoteca.
  // La Ley 2434 de 2024 baja notaría y registro de la hipoteca al 70% en No VIS y al 10% en VIS con subsidio, por eso 3% y 2%
  novis: { Etiqueta: 'No VIS', Descripcioncorta: 'Financia 70%', Tope: 0.40, Financiacion: 0.70, Gastos: 0.03, Glosario: 'Escrituración (3%)', Etiquetanodo: 'NO VIS · 70%' },
  vis: { Etiqueta: 'VIS', Descripcioncorta: 'Financia 80%', Tope: 0.40, Financiacion: 0.80, Gastos: 0.02, Glosario: 'Escrituración VIS (2%)', Etiquetanodo: 'VIS · 80%' },
  leasing: { Etiqueta: 'Leasing', Descripcioncorta: 'Financia 80%', Tope: 0.40, Financiacion: 0.80, Gastos: 0, Glosario: 'Gastos diferidos', Etiquetanodo: 'LEASING · 80%' }
};

// Colores del diseño nuevo de la app. Los nombres cortos (bg, cd, c2, ik...) los usan las pantallas que aún no se
// rediseñan; los largos (sf, ink, hero...) son los del diseño nuevo. --fa, el texto más tenue, llega a 4,5:1 de contraste
const Temasinterfaz = {
  oscuro: {
    bg:'#0B0C0A', cd:'#16180F', c2:'#22251B', ln:'rgba(255,255,255,.09)', ik:'#F2F4EC', mu:'#B3B8A7', fa:'#8F947F', ac:'#D4FF3A', oa:'#0B0C0A', at:'#D4FF3A', al:'#FF8A4C',
    dk:'#1C1E15', di:'#A3A898', fb:'#F2F4EC', of:'#0B0C0A', dm:'#2A2D22', ad:'#5E6B2A',
    sf:'#16180F', sf2:'#22251B', trk:'#2C3022', ink:'#F2F4EC', 'on-ac':'#0B0C0A', bar:'#D4FF3A', hero:'#1A2E52', 'hero-ink':'#F4F6FB', 'hero-mu':'#B9C6E4', 'hero-ln':'rgba(255,255,255,.14)',
    warn:'#FFD23F', 'warn-t':'#FFD23F', 'al-t':'#FF8A4C', nav:'#121410', scrim:'rgba(0,0,0,.62)', sel:'#F2F4EC', 'sel-t':'#0B0C0A',
    'soft-ac':'rgba(212,255,58,.10)', 'soft-warn':'rgba(255,210,63,.10)', 'soft-al':'rgba(255,138,76,.12)', shadow:'0 12px 32px rgba(0,0,0,.5)'
  },
  claro: {
    bg:'#F3F3EE', cd:'#FFFFFF', c2:'#ECEEE4', ln:'rgba(15,17,12,.10)', ik:'#10120D', mu:'#4C5244', fa:'#626858', ac:'#D4FF3A', oa:'#0B0C0A', at:'#3E5A00', al:'#FF8A4C',
    dk:'#0F110C', di:'#A3A898', fb:'#F2F4EC', of:'#0B0C0A', dm:'#E1E4D6', ad:'#9DB84A',
    sf:'#FFFFFF', sf2:'#ECEEE4', trk:'#E2E5D8', ink:'#10120D', 'on-ac':'#0B0C0A', bar:'#5B7F00', hero:'#1E345B', 'hero-ink':'#FFFFFF', 'hero-mu':'#C3CEE6', 'hero-ln':'rgba(255,255,255,.16)',
    warn:'#FFD23F', 'warn-t':'#7A5600', 'al-t':'#B4400F', nav:'#FFFFFF', scrim:'rgba(16,18,13,.45)', sel:'#10120D', 'sel-t':'#FFFFFF',
    'soft-ac':'#EEF9C8', 'soft-warn':'#FFF4CC', 'soft-al':'#FFE6D9', shadow:'0 12px 32px rgba(16,18,13,.16)'
  }
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
  'Entidad', 'Objetivousuario', 'Sisbengrupo', 'Pro', 'Cuotainicialplazo', 'Contactosenviados',
  'Correo', 'Invitado', 'Autorizacionversion', 'Autorizacionfecha', 'Fuenteingreso', 'Diasregistrados', 'Tutorialvisto', 'Consejosvistos', 'Parejaingreso', 'Parejadeudas', 'Parejanombre', 'Parejaahorro', 'Parejaactividad', 'Metodoingreso', 'Infoentidad', 'Avatarimagen', 'Financiargastos', 'Ingresovista', 'Registrotipo', 'Simuladorpaso',
  'Desbloqueado', 'Desbloqueadopareja', 'Desbloqueadotasas', 'Anunciostasas', 'Desbloqueadopdf', 'Anunciospdf'
];

// Funciones para dar formato en pesos colombianos, porcentajes y cálculo de anualidades
// Nada de lo que escribe la persona entra sin límite: se recorta y se quitan los caracteres de control
const Textoseguro = (Valor, Maximo, Multilinea = false) => String(Valor ?? '').replace(Multilinea ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, '').slice(0, Maximo);
const Numerofinito = (Valor) => (Number.isFinite(Number(Valor)) ? Number(Valor) : 0);
const Formatoenteropesos = (Valor) => '$' + Math.round(Numerofinito(Valor)).toLocaleString('es-CO');
const Formatonumero = (Valor) => Math.round(Numerofinito(Valor)).toLocaleString('es-CO');
const Formatomillones = (Valor) => (Numerofinito(Valor) / 1e6).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const Formatoporcentaje = (Valor) => (Numerofinito(Valor) * 100).toLocaleString('es-CO', { maximumFractionDigits: 2 }) + '%';
const Promediodatos = (Lista) => (Lista && Lista.length ? Lista.reduce((Sumando, Sumandob) => Sumando + Numerofinito(Sumandob), 0) / Lista.length : 0);

const Calcularanualidad = (Tasaanual, Anios) => {
  const TasaSegura = Number.isFinite(Tasaanual) && Tasaanual > 0 ? Math.min(Tasaanual, 1) : 0;
  const AniosSeguros = Number.isFinite(Anios) && Anios > 0 ? Math.min(Anios, 40) : 20;
  const Numero = Math.max(1, Math.round(AniosSeguros * 12));
  if (TasaSegura <= 0) return { Tasaperiodica: 0, Numerocuotas: Numero, Factoranualidad: Numero };
  const Tasamensualcalculo = Math.pow(1 + TasaSegura, 1 / 12) - 1;
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

