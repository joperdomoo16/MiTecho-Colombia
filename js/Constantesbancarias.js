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

const Consultartopevis = (ciudad) => (Ciudadesconsubsidioalto.includes(ciudad) ? 150 : 135);

const Unidadtributaria = 52374;
const Inflacionanual = 0.0517;
const ValorUvrHoy = 420.7199;
const EscenariosInflacion = [0.03, 0.045, 0.063];
const InflacionEquilibrioUvr = 0.0558;
const UmbralIngresoRenta = 6900000;
const TopeDeduccionInteresesUvt = 1200;
const TopeAnticipoNominaUvt = 100;
const TopePatrimonioDeclarar = 4500 * Unidadtributaria;

const Tasasreferencia = {
  promedio: { vis: 0.1435, novis: 0.1546, leasing: 0.1469, uvr: 0.075, label: 'Promedio bancos' },
  fna: { vis: 0.109, novis: 0.119, leasing: 0.109, uvr: 0.053, label: 'Fondo Nacional del Ahorro' },
  caja: { vis: 0.1135, novis: 0.1135, leasing: 0.1135, uvr: 0.1135, label: 'Crédito de tu Caja' }
};

const Factoresvariables = [0.88, 0.90, 0.96, 0.93, 0.98, 1.0];
const Mesesetiquetas = ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'];

const Modalidadesvivienda = {
  novis: { label: 'No VIS', desc: '30% · 70%', tope: 0.30, fin: 0.70, gastos: 0.04, gl: 'Escrituración (4%)', tag: 'NO VIS · 70%' },
  vis: { label: 'VIS', desc: '30% · 80%', tope: 0.30, fin: 0.80, gastos: 0.03, gl: 'Escrituración VIS (3%)', tag: 'VIS · 80%' },
  leasing: { label: 'Leasing', desc: '30% · 80%', tope: 0.30, fin: 0.80, gastos: 0, gl: 'Gastos diferidos', tag: 'LEASING · 85%' }
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

const Clavealmacenamiento = 'mitecho.datos.v1';
const Camposalmacenados = [
  'logged', 'setupDone', 'theme', 'fijo', 'variable', 'tipo', 'useAuto', 'manualIng',
  'pareja', 'mod', 'rate', 'term', 'debts', 'entries', 'added', 'fixedExtra',
  'expenses', 'cashOld', 'nombre', 'edad', 'ciudad', 'ahorro', 'ahorroMes', 'meta',
  'caja', 'cajaNombre', 'sisben', 'rem', 'ofCities', 'avgN', 'flex40', 'opc',
  'entidad', 'objetivo', 'sisbenGrupo', 'pro', 'ciPlazo', 'anoPct', 'leadsSent',
  'gsUrl', 'gsLast', 'email', 'parejaIng', 'parejaDeu', 'parejaNombre', 'entInfo', 'avatarUrl', 'financiarGastos', 'ingView', 'regKind', 'simStep'
];

// Funciones para dar formato en pesos colombianos, porcentajes y cálculo de anualidades
const Formatoenteropesos = (v) => '$' + Math.round(v).toLocaleString('es-CO');
const Formatonumero = (v) => Math.round(v).toLocaleString('es-CO');
const Formatomillones = (v) => (v / 1e6).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const Formatoporcentaje = (v) => (v * 100).toLocaleString('es-CO', { maximumFractionDigits: 2 }) + '%';
const Promediodatos = (a) => (a && a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

const Historialvariables = (s) => {
  const vb = s.tipo === 'fijo' ? 0 : (s.variable || 0);
  return [...Factoresvariables.map(f => f * vb), vb * 1.02 + (s.added || 0)];
};

const Calcularanualidad = (ea, years) => {
  const i = Math.pow(1 + ea, 1 / 12) - 1, n = Math.round(years * 12);
  return { i, n, a: (1 - Math.pow(1 + i, -n)) / i };
};

const Mesesvigencia = (txt) => {
  const m = String(txt || '').match(/^\s*(\d{1,2})\s*\/\s*(\d{4})\s*$/);
  if (!m) return null;
  const d = new Date();
  return (+m[2] * 12 + (+m[1])) - (d.getFullYear() * 12 + d.getMonth() + 1);
};

const Normalizartexto = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const BASE_ING = Ingresobase;
const FIJO = Ingresofijo;
const META = Metaingreso;
const AHORRO = Ahorrobase;
const SMMLV = Salariominimo;
const VIS150 = Ciudadesconsubsidioalto;
const visTopeOf = Consultartopevis;
function EscaparHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const UVT = Unidadtributaria;
const IPC = Inflacionanual;
const RATES = Tasasreferencia;
const VAR_F = Factoresvariables;
const MLAB = Mesesetiquetas;
const MODS = Modalidadesvivienda;
const THEMES = Temasinterfaz;
const FUENTES = Fuentesingreso;
const MEDIOS = Mediospago;
const DEBT_TYPES = Tiposdeuda;
const SHORT = Nombrescortosdeuda;
const STORE_KEY = Clavealmacenamiento;
const STORE_FIELDS = Camposalmacenados;
const cop = Formatoenteropesos;
const num = Formatonumero;
const m1 = Formatomillones;
const pctFmt = Formatoporcentaje;
const avgArr = Promediodatos;
const varHist = Historialvariables;
const annuity = Calcularanualidad;
const vigMeses = Mesesvigencia;
const norm = Normalizartexto;
const UVR_VALOR = ValorUvrHoy;
const ESC_IPC = EscenariosInflacion;
const IPC_EQ_UVR = InflacionEquilibrioUvr;
const UMBRAL_RENTA = UmbralIngresoRenta;
const TOPE_PAT_DECLARAR = TopePatrimonioDeclarar;
const escapeHtml = EscaparHtml;
