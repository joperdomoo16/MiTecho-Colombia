// Tasas de vivienda por entidad que publica la Superintendencia Financiera (Formato 414), ya calculadas en Supabase.
// La app las guarda en el celular para usarlas sin internet y las vuelve a pedir una vez al día.

const Clavetasascelular = 'mitecho.tasas';
const Margenprudente = 0.005;
const Minimocreditos = 30;
const Semanassinreporte = 4;

// Tasas que usa el motor cuando ya llegaron las de la Superintendencia; mientras tanto vale null y se usan las de referencia
let Tasasmercadoactual = null;
let Filastasasmercado = [];

// Producto del Formato 414 que corresponde a lo que la persona eligió en el simulador
function Productosimulador(Modalidad, Tasatipo) {
  const Moneda = Tasatipo === 'uvr' ? 'uvr' : 'pesos';
  if (Modalidad === 'leasing') return 'leasing_novis_' + Moneda;
  return (Modalidad === 'novis' ? 'novis' : 'vis') + '_' + Moneda;
}

function Nombreproducto(Producto) {
  const Nombres = { vis: 'VIS', novis: 'No VIS', leasing_vis: 'Leasing VIS', leasing_novis: 'Leasing No VIS' };
  const Partes = Producto.split('_');
  const Moneda = Partes.pop();
  return Nombres[Partes.join('_')] + (Moneda === 'uvr' ? ' en UVR' : ' en pesos');
}

// '30 de octubre de 2026'; sin año cuando no hace falta repetirlo ('15 de septiembre')
function Fechacortatasas(Texto, Conanio = true) {
  const Fecha = new Date(String(Texto).slice(0, 10) + 'T12:00:00Z');
  if (isNaN(Fecha.getTime())) return '';
  const Opciones = { day: 'numeric', month: 'long', timeZone: 'UTC' };
  if (Conanio) Opciones.year = 'numeric';
  return new Intl.DateTimeFormat('es-CO', Opciones).format(Fecha);
}

// Arma las tasas que usa el motor: promedio del mercado y del Fondo Nacional del Ahorro, con margen prudente de 0,5 puntos
function Aplicartasasmercado(Filas) {
  if (!Array.isArray(Filas) || !Filas.length) return false;
  Filastasasmercado = Filas;
  const Tasade = (Nombre, Producto) => {
    const Fila = Filas.find(Item => Item.producto === Producto && (Nombre === 'Mercado' ? Item.codigo_entidad === '0' : Item.nombre_entidad === Nombre));
    return Fila && Number(Fila.tasa) > 0 ? Number(Fila.tasa) / 100 + Margenprudente : undefined;
  };
  const Armar = (Nombre) => {
    const Tasas = {
      vis: Tasade(Nombre, 'vis_pesos'), novis: Tasade(Nombre, 'novis_pesos'), leasing: Tasade(Nombre, 'leasing_novis_pesos') || Tasade(Nombre, 'leasing_vis_pesos'),
      Uvrvis: Tasade(Nombre, 'vis_uvr'), Uvrnovis: Tasade(Nombre, 'novis_uvr')
    };
    Object.keys(Tasas).forEach(Clave => { if (Tasas[Clave] === undefined) delete Tasas[Clave]; });
    return Tasas;
  };
  Tasasmercadoactual = { promedio: Armar('Mercado'), fna: Armar('Fondo Nacional del Ahorro') };
  const Hasta = Filas[0] && Filas[0].ventana_hasta;
  if (Hasta) Fechatasasreferencia = Fechacortatasas(Hasta);
  return true;
}

// Al abrir la app: primero lo guardado en el celular y, si tiene más de un día, se pide a Supabase lo nuevo
async function Cargartasasmercado() {
  let Guardadas = null;
  try { Guardadas = JSON.parse(localStorage.getItem(Clavetasascelular) || 'null'); } catch (Falla) { Guardadas = null; }
  let Cambio = Guardadas ? Aplicartasasmercado(Guardadas.Filas) : false;
  const Reciente = Guardadas && Date.now() - Number(Guardadas.Fecha || 0) < 86400000;
  if (Reciente || typeof Obtenertasasapi !== 'function') return Cambio;
  const Resultado = await Obtenertasasapi().catch(() => null);
  if (Resultado && Resultado.ok && Array.isArray(Resultado.datos) && Resultado.datos.length) {
    Cambio = Aplicartasasmercado(Resultado.datos) || Cambio;
    try { localStorage.setItem(Clavetasascelular, JSON.stringify({ Fecha: Date.now(), Filas: Resultado.datos })); } catch (Falla) {}
  }
  return Cambio;
}

// Entidades que reportaron el producto, con avisos de pocos datos y de entidades que dejaron de reportar
function Entidadesdelproducto(Producto) {
  const Mercado = Filastasasmercado.find(Fila => Fila.codigo_entidad === '0' && Fila.producto === Producto) || null;
  const Hasta = Mercado ? new Date(String(Mercado.ventana_hasta).slice(0, 10)).getTime() : Date.now();
  const Entidades = Filastasasmercado
    .filter(Fila => Fila.producto === Producto && Fila.codigo_entidad !== '0')
    .map(Fila => ({
      Nombre: Fila.nombre_entidad,
      Tasa: Number(Fila.tasa) / 100,
      Minima: Number(Fila.tasa_min) / 100,
      Maxima: Number(Fila.tasa_max) / 100,
      Creditos: Number(Fila.creditos),
      Pocosdatos: Number(Fila.creditos) < Minimocreditos,
      Sinreporte: Hasta - new Date(String(Fila.ultima_fecha).slice(0, 10)).getTime() > Semanassinreporte * 7 * 86400000
    }));
  return {
    Mercado: Mercado ? Number(Mercado.tasa) / 100 : null,
    Desde: Mercado ? Fechacortatasas(Mercado.ventana_desde, String(Mercado.ventana_desde).slice(0, 4) !== String(Mercado.ventana_hasta).slice(0, 4)) : '',
    Hasta: Mercado ? Fechacortatasas(Mercado.ventana_hasta) : '',
    Entidades
  };
}

// Nota que acompaña la tasa en el simulador: de dónde sale y cuánto margen prudente le sumamos
function Notatasa(Calculo, Estadoactual, Tasaanualtexto) {
  const Plazo = ' a ' + Calculo.Plazo + ' años' + (Calculo.Plazo < (Estadoactual.Plazoelegido || 20) ? ' (limitado por tu edad: edad más plazo no pasa de 75 años)' : '') + '.';
  if (Estadoactual.Tasaanualfija || Calculo.Preaprobadotasa) return 'Tasa de tu crédito preaprobado: ' + Tasaanualtexto + Plazo;
  if (Calculo.Entidadclave === 'caja') return 'Línea de vivienda de ' + (Estadoactual.Cajanombre || 'tu Caja') + ' para afiliados, en pesos y hasta 20 años. Confirma la tasa con tu Caja: ' + Tasaanualtexto + Plazo;
  const Modalidad = Estadoactual.Modalidadelegida || 'vis';
  const Clave = Estadoactual.Tasatipo === 'uvr' && Modalidad !== 'leasing' ? (Modalidad === 'vis' ? 'Uvrvis' : 'Uvrnovis') : Modalidad;
  const Tasas = Tasasmercadoactual && Tasasmercadoactual[Calculo.Entidadclave];
  const Quien = Calculo.Entidadclave === 'fna' ? 'Fondo Nacional del Ahorro' : 'bancos';
  if (!Tasas || Tasas[Clave] === undefined) return 'Tasa de referencia de ' + (Calculo.Entidadclave === 'fna' ? 'el ' : 'los ') + Quien + ' al ' + Fechatasasreferencia + ': ' + Tasaanualtexto + Plazo;
  const Base = Formatoporcentaje(Calculo.Tasaanual - Margenprudente) + (Clave.startsWith('Uvr') ? ' + UVR' : '');
  return 'Promedio de ' + (Calculo.Entidadclave === 'fna' ? 'el ' : 'los ') + Quien + ' en la Superintendencia Financiera, 8 semanas al ' + Fechatasasreferencia + ': ' + Base + ', más 0,5 de margen prudente = ' + Tasaanualtexto + Plazo;
}
