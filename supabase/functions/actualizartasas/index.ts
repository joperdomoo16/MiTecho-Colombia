// Función de Supabase que trae de datos.gov.co las tasas de vivienda de las últimas 8 semanas (Formato 414 de la
// Superintendencia Financiera), calcula el promedio ponderado por monto de cada entidad y producto, y lo guarda
// en la tabla tasas_vivienda_semanal. La dispara una tarea programada de martes a viernes con la clave TAREA_CLAVE.
// La app nunca consulta datos.gov.co: solo lee la tabla ya calculada.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const Conjunto = 'https://www.datos.gov.co/resource/qzsc-9esp.json';
const Semanas = 8;
const Undia = 86400000;

function Leersecreto(Nombre: string, Pordefecto = ''): string {
  return (Deno.env.get(Nombre) ?? Pordefecto).trim();
}

function Responder(Estado: number, Cuerpo: Record<string, unknown>): Response {
  return new Response(JSON.stringify(Cuerpo), { status: Estado, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}

function Igualseguro(Uno: string, Otro: string): boolean {
  if (Uno.length !== Otro.length) return false;
  let Diferencia = 0;
  for (let Indice = 0; Indice < Uno.length; Indice++) Diferencia |= Uno.charCodeAt(Indice) ^ Otro.charCodeAt(Indice);
  return Diferencia === 0;
}

function Sintildes(Texto: string): string {
  return Texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Solo compra de vivienda y leasing habitacional; construcción, libranza y vivienda de empleados quedan por fuera
function Clavedeproducto(Producto: string): string | null {
  const Texto = Sintildes(Producto);
  const Moneda = Texto.includes('uvr') ? 'uvr' : 'pesos';
  const Tipo = Texto.includes('no vis') || Texto.includes('diferente de vis') ? 'novis' : 'vis';
  if (Texto.startsWith('adquisicion de vivienda')) return Tipo + '_' + Moneda;
  if (Texto.startsWith('adquisicion leasing habitacional')) return 'leasing_' + Tipo + '_' + Moneda;
  return null;
}

// Nombres cortos para mostrar; la clave de cada entidad es su código, no el nombre
const Alias: Record<string, string> = {
  'banagrario': 'Banco Agrario',
  'bbva colombia': 'BBVA',
  'banco davibank': 'Davibank',
  'banco davivienda': 'Davivienda',
  'banco caja social s.a.': 'Banco Caja Social',
  'banco serfinanza s.a.': 'Serfinanza'
};
function Nombrecorto(Nombre: string): string {
  const Clave = Nombre.trim().toLowerCase();
  return Alias[Clave] || Nombre.trim().replace(/\s+S\.?A\.?$/i, '');
}

Deno.serve(async (Peticion: Request) => {
  if (Peticion.method !== 'POST') return Responder(405, { ok: false, mensaje: 'Método no permitido.' });
  const Clave = Leersecreto('TAREA_CLAVE');
  if (Clave.length < 32 || !Igualseguro(Peticion.headers.get('x-clave-tarea') || '', Clave)) return Responder(401, { ok: false, mensaje: 'No autorizado.' });

  const Inicio = new Date();
  const Desde = new Date(Inicio.getTime() - Semanas * 7 * Undia).toISOString().slice(0, 10);
  // Se piden las filas sueltas y de la más nueva a la más vieja: agrupar dentro de datos.gov.co, o filtrar sin
  // ese orden, puede tardar más de dos minutos en un conjunto de 16 millones de filas; así responde en segundos
  const Limite = 50000;
  const Parametros = new URLSearchParams({
    '$select': 'codigo_entidad, nombre_entidad, producto_de_cr_dito, tasa_efectiva_promedio, montos_desembolsados, numero_de_creditos, fecha_corte',
    '$where': "tipo_de_cr_dito = 'Vivienda' AND tasa_efectiva_promedio > 0 AND fecha_corte >= '" + Desde + "'",
    '$order': ':id DESC',
    '$limit': String(Limite)
  });
  const Cabeceras: Record<string, string> = { 'Accept': 'application/json' };
  // El token de datos.gov.co es opcional; si existe va como secreto, nunca dentro de la app
  if (Leersecreto('SOCRATA_TOKEN')) Cabeceras['X-App-Token'] = Leersecreto('SOCRATA_TOKEN');

  let Filasfuente: Record<string, string>[];
  // Si datos.gov.co no contesta en 90 segundos se corta, para alcanzar a responder antes de que la tarea se rinda
  const Corte = new AbortController();
  const Reloj = setTimeout(() => Corte.abort(), 90000);
  try {
    console.log('Consultando datos.gov.co desde', Desde);
    const Respuesta = await fetch(Conjunto + '?' + Parametros.toString(), { headers: Cabeceras, signal: Corte.signal });
    if (!Respuesta.ok) return Responder(502, { ok: false, mensaje: 'datos.gov.co respondió ' + Respuesta.status });
    Filasfuente = await Respuesta.json();
    console.log('Filas recibidas', Array.isArray(Filasfuente) ? Filasfuente.length : 0);
  } catch {
    return Responder(502, { ok: false, mensaje: Corte.signal.aborted ? 'datos.gov.co tardó más de 90 segundos.' : 'No se pudo consultar datos.gov.co.' });
  } finally {
    clearTimeout(Reloj);
  }
  if (!Array.isArray(Filasfuente) || !Filasfuente.length) return Responder(502, { ok: false, mensaje: 'datos.gov.co no devolvió tasas.' });
  // Si llegó justo el límite quedaron filas por fuera; mejor no guardar promedios incompletos
  if (Filasfuente.length >= Limite) return Responder(502, { ok: false, mensaje: 'La descarga llegó al límite de filas, no se guardó nada.' });

  // Cada fila es un reporte semanal; se suman por entidad y producto, y también en el total del mercado
  const Grupos = new Map<string, { codigo: string; nombre: string; producto: string; suma: number; monto: number; creditos: number; min: number; max: number; ultima: string }>();
  let Ventanahasta = '';
  for (const Fila of Filasfuente) {
    const Producto = Clavedeproducto(String(Fila.producto_de_cr_dito || ''));
    const Monto = Number(Fila.montos_desembolsados);
    const Tasa = Number(Fila.tasa_efectiva_promedio);
    if (!Producto || !(Monto > 0) || !(Tasa > 0)) continue;
    const Ultima = String(Fila.fecha_corte || '').slice(0, 10);
    if (Ultima > Ventanahasta) Ventanahasta = Ultima;
    for (const [Codigo, Nombre] of [[String(Fila.codigo_entidad), Nombrecorto(String(Fila.nombre_entidad))], ['0', 'Mercado']]) {
      const Llave = Codigo + '|' + Producto;
      const Actual = Grupos.get(Llave) || { codigo: Codigo, nombre: Nombre, producto: Producto, suma: 0, monto: 0, creditos: 0, min: Infinity, max: -Infinity, ultima: '' };
      Actual.suma += Tasa * Monto;
      Actual.monto += Monto;
      Actual.creditos += Number(Fila.numero_de_creditos) || 0;
      Actual.min = Math.min(Actual.min, Tasa);
      Actual.max = Math.max(Actual.max, Tasa);
      if (Ultima > Actual.ultima) Actual.ultima = Ultima;
      Grupos.set(Llave, Actual);
    }
  }

  const Marca = Inicio.toISOString();
  const Filas = [...Grupos.values()].map(Grupo => ({
    codigo_entidad: Grupo.codigo, nombre_entidad: Grupo.nombre, producto: Grupo.producto,
    tasa: Number((Grupo.suma / Grupo.monto).toFixed(4)), tasa_min: Grupo.min, tasa_max: Grupo.max,
    monto: Math.round(Grupo.monto), creditos: Grupo.creditos, ultima_fecha: Grupo.ultima,
    ventana_desde: Desde, ventana_hasta: Ventanahasta, actualizado_en: Marca
  }));

  const Administrador = createClient(Leersecreto('SUPABASE_URL'), Leersecreto('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: Fallaguardar } = await Administrador.from('tasas_vivienda_semanal').upsert(Filas, { onConflict: 'codigo_entidad,producto' });
  if (Fallaguardar) return Responder(500, { ok: false, mensaje: 'No se pudieron guardar las tasas.' });
  // Lo que no llegó en esta descarga (entidades o productos sin créditos en 8 semanas) se borra
  await Administrador.from('tasas_vivienda_semanal').delete().lt('actualizado_en', Marca);
  return Responder(200, { ok: true, filas: Filas.length, desde: Desde, hasta: Ventanahasta });
});
