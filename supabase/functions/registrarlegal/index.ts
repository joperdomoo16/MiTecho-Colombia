// Función de Supabase que recibe las solicitudes de soporte (desde Ayuda y desde Contáctanos del inicio de sesión)
// y la autorización de tratamiento de datos que se pide al entrar por primera vez.
// Guarda la prueba en la base de datos, calcula la fecha máxima de respuesta según la ley colombiana,
// copia la fila en la hoja de Google y manda los correos. La app nunca habla directo con Google.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { Calcularplazos, Hoybogota, Textofecha, Fechalarga } from './Festivos.ts';
import { Leersecreto, Enviarhoja, Avisarsoporte, Enviaracuse } from './Notificaciones.ts';
import { Eliminarusuario, Exportardatos, Registraractividad } from './Cuenta.ts';
import { Depurarinactivos } from './Inactividad.ts';

declare const EdgeRuntime: { waitUntil(Promesa: Promise<unknown>): void } | undefined;

// Debe ser la misma versión que Versionpolitica en js/Valoresautorizacion.js y la que dice Politicadeprivacidad.html
const Versionpolitica = '1.2';
const Origenespermitidos = ['https://localhost', 'capacitor://localhost'];
const Plataformas = ['Android', 'iOS', 'Web'];
const Letrasradicado = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function Cabeceras(Origen: string | null): Record<string, string> {
  const Cabecera: Record<string, string> = { 'Content-Type': 'application/json; charset=utf-8', 'Vary': 'Origin' };
  if (Origen && Origenespermitidos.includes(Origen)) {
    Cabecera['Access-Control-Allow-Origin'] = Origen;
    Cabecera['Access-Control-Allow-Headers'] = 'authorization, apikey, content-type';
    Cabecera['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
  }
  return Cabecera;
}

function Responder(Estado: number, Cuerpo: Record<string, unknown>, Origen: string | null): Response {
  return new Response(JSON.stringify(Cuerpo), { status: Estado, headers: Cabeceras(Origen) });
}

// Quita caracteres de control y espacios de más; en la descripción se respetan los saltos de línea
function Limpiar(Valor: unknown, Maximo: number, Multilinea = false): string {
  const Texto = String(Valor ?? '').replace(Multilinea ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ');
  const Ordenado = Multilinea ? Texto.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : Texto.replace(/\s+/g, ' ');
  return Ordenado.trim().slice(0, Maximo);
}

// Ejecuta el envío de hoja y correos después de responder, para que la app no se quede esperando
function Despues(Tarea: Promise<unknown>): Promise<unknown> | null {
  if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime && typeof EdgeRuntime.waitUntil === 'function') {
    EdgeRuntime.waitUntil(Tarea);
    return null;
  }
  return Tarea;
}

async function Huella(Peticion: Request): Promise<string> {
  const Direccion = (Peticion.headers.get('x-forwarded-for') || Peticion.headers.get('cf-connecting-ip') || '').split(',')[0].trim();
  const Bytes = new TextEncoder().encode(Direccion + '|' + Leersecreto('HOJA_CLAVE'));
  const Resumen = new Uint8Array(await crypto.subtle.digest('SHA-256', Bytes));
  return Array.from(Resumen.slice(0, 16), Byte => Byte.toString(16).padStart(2, '0')).join('');
}

function Nuevoradicado(Dia: Date): string {
  const Azar = crypto.getRandomValues(new Uint8Array(5));
  const Sufijo = Array.from(Azar, Byte => Letrasradicado[Byte % Letrasradicado.length]).join('');
  return 'MT-' + Textofecha(Dia).replace(/-/g, '') + '-' + Sufijo;
}

function Horabogota(Momento: Date): string {
  return new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' }).format(Momento);
}

type Cliente = ReturnType<typeof createClient>;

async function Usuariodetoken(Administrador: Cliente, Peticion: Request) {
  const Token = (Peticion.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!Token || Token.startsWith('sb_')) return null;
  const { data, error } = await Administrador.auth.getUser(Token);
  return error ? null : data?.user ?? null;
}

async function Contar(Administrador: Cliente, Columna: string, Valor: string, Desde: string): Promise<number> {
  let Consulta = Administrador.from('solicitudes_soporte').select('id', { count: 'exact', head: true }).gte('recibida_en', Desde);
  if (Columna) Consulta = Consulta.eq(Columna, Valor);
  const { count } = await Consulta;
  return count ?? 0;
}

async function Registrarsoporte(Administrador: Cliente, Peticion: Request, Cuerpo: Record<string, unknown>, Origen: string | null) {
  const Tipo = ['soporte', 'consulta', 'reclamo'].includes(String(Cuerpo.tipo)) ? String(Cuerpo.tipo) : 'soporte';
  const Nombre = Limpiar(Cuerpo.nombre, 80);
  const Correo = Limpiar(Cuerpo.correo, 100).toLowerCase();
  const Asunto = Limpiar(Cuerpo.asunto, 100);
  const Descripcion = Limpiar(Cuerpo.descripcion, 500, true);
  if (Nombre.length < 6) return Responder(400, { ok: false, mensaje: 'El nombre debe tener al menos 6 caracteres.' }, Origen);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(Correo)) return Responder(400, { ok: false, mensaje: 'Ingresa un correo electrónico válido.' }, Origen);
  if (Asunto.length < 6) return Responder(400, { ok: false, mensaje: 'El asunto debe tener al menos 6 caracteres.' }, Origen);
  if (Descripcion.length < 20) return Responder(400, { ok: false, mensaje: 'La descripción debe tener al menos 20 caracteres.' }, Origen);

  // Límite para que nadie use el formulario para llenar la hoja o mandar correos masivos
  const Haceunahora = new Date(Date.now() - 3600000).toISOString();
  const Origenhuella = await Huella(Peticion);
  const [Porconexion, Porcorreo, Total] = await Promise.all([
    Contar(Administrador, 'origen_huella', Origenhuella, Haceunahora),
    Contar(Administrador, 'correo', Correo, Haceunahora),
    Contar(Administrador, '', '', Haceunahora)
  ]);
  if (Porconexion >= 5 || Porcorreo >= 3 || Total >= 300) {
    return Responder(429, { ok: false, mensaje: 'Ya recibimos varias solicitudes en la última hora. Espera un momento antes de enviar otra.' }, Origen);
  }

  const Usuario = await Usuariodetoken(Administrador, Peticion);
  const Momento = new Date();
  const Hoy = Hoybogota(Momento);
  const { Maxima, Prorroga, Plazo } = Calcularplazos(Tipo, Hoy);

  let Radicado = '';
  for (let Intento = 0; Intento < 3 && !Radicado; Intento++) {
    const Propuesto = Nuevoradicado(Hoy);
    const { error } = await Administrador.from('solicitudes_soporte').insert({
      radicado: Propuesto, usuario_id: Usuario?.id ?? null, tipo: Tipo, nombre: Nombre, correo: Correo, asunto: Asunto,
      descripcion: Descripcion, recibida_en: Momento.toISOString(), fecha_maxima: Textofecha(Maxima),
      fecha_prorroga: Textofecha(Prorroga), origen_huella: Origenhuella
    });
    if (!error) Radicado = Propuesto;
    else if (error.code !== '23505') break;
  }
  if (!Radicado) return Responder(500, { ok: false, mensaje: 'No pudimos registrar tu solicitud en este momento, intenta de nuevo.' }, Origen);

  const Datos = {
    Radicado, Tipo, Tiponombre: Plazo.Nombre, Norma: Plazo.Norma, Nombre, Correo, Asunto, Descripcion,
    Recibida: Horabogota(Momento), Maxima: Fechalarga(Maxima), Prorroga: Fechalarga(Prorroga), Concuenta: Boolean(Usuario)
  };
  const Tarea = (async () => {
    const Enhoja = await Enviarhoja('Soporte', {
      radicado: Radicado, recibida: Momento.toISOString(), tipo: Plazo.Nombre, norma: Plazo.Norma, nombre: Nombre, correo: Correo,
      asunto: Asunto, descripcion: Descripcion, cuenta: Usuario ? 'Sí' : 'No', maxima: Textofecha(Maxima), prorroga: Textofecha(Prorroga)
    });
    if (Enhoja) await Administrador.from('solicitudes_soporte').update({ enviada_hoja: true }).eq('radicado', Radicado);
    await Avisarsoporte(Datos);
    await Enviaracuse(Datos);
  })().catch(() => null);
  const Pendiente = Despues(Tarea);
  if (Pendiente) await Pendiente;

  return Responder(200, { ok: true, radicado: Radicado, fecha_maxima: Datos.Maxima, tipo: Plazo.Nombre }, Origen);
}

function Metododeingreso(Metadatos: Record<string, unknown>): string {
  const Proveedor = String(Metadatos.provider || (Array.isArray(Metadatos.providers) ? Metadatos.providers[0] : '') || '');
  if (Proveedor === 'email') return 'Correo y contraseña';
  if (Proveedor === 'google') return 'Google';
  return Proveedor || 'Desconocido';
}

async function Registrarautorizacion(Administrador: Cliente, Peticion: Request, Cuerpo: Record<string, unknown>, Origen: string | null) {
  const Usuario = await Usuariodetoken(Administrador, Peticion);
  if (!Usuario || !Usuario.email) return Responder(401, { ok: false, mensaje: 'Tu sesión venció. Vuelve a iniciar sesión para continuar.' }, Origen);

  const Metadatosapp = (Usuario.app_metadata || {}) as Record<string, unknown>;
  const Previa = Metadatosapp.autorizacion as { version?: string; fecha?: string } | undefined;
  if (Previa && Previa.version === Versionpolitica) {
    return Responder(200, { ok: true, version: Versionpolitica, fecha: Previa.fecha || '' }, Origen);
  }

  // El nombre y el método salen de la cuenta en Supabase, no de lo que mande el celular
  const Metadatos = (Usuario.user_metadata || {}) as Record<string, unknown>;
  const Nombre = Limpiar(Metadatos.nombre || Metadatos.full_name || Metadatos.name || '', 80);
  const Metodo = Metododeingreso(Metadatosapp);
  const Plataforma = Plataformas.includes(String(Cuerpo.plataforma)) ? String(Cuerpo.plataforma) : 'Desconocida';
  const Momento = new Date();

  const { error: Fallaguardar } = await Administrador.from('autorizaciones').upsert({
    usuario_id: Usuario.id, nombre: Nombre, correo: Usuario.email, metodo: Metodo,
    version_politica: Versionpolitica, plataforma: Plataforma, autorizada_en: Momento.toISOString()
  }, { onConflict: 'usuario_id,version_politica', ignoreDuplicates: true });
  if (Fallaguardar) return Responder(500, { ok: false, mensaje: 'No pudimos guardar tu autorización, intenta de nuevo.' }, Origen);

  const { error: Fallamarca } = await Administrador.auth.admin.updateUserById(Usuario.id, {
    app_metadata: { ...Metadatosapp, autorizacion: { version: Versionpolitica, fecha: Momento.toISOString() } }
  });
  if (Fallamarca) return Responder(500, { ok: false, mensaje: 'No pudimos guardar tu autorización, intenta de nuevo.' }, Origen);

  const Tarea = (async () => {
    const Enhoja = await Enviarhoja('Autorizaciones', {
      nombre: Nombre, correo: Usuario.email ?? '', metodo: Metodo, fecha: Momento.toISOString(), version: Versionpolitica, plataforma: Plataforma
    });
    if (Enhoja) await Administrador.from('autorizaciones').update({ enviada_hoja: true }).eq('usuario_id', Usuario.id).eq('version_politica', Versionpolitica);
  })().catch(() => null);
  const Pendiente = Despues(Tarea);
  if (Pendiente) await Pendiente;

  return Responder(200, { ok: true, version: Versionpolitica, fecha: Momento.toISOString() }, Origen);
}

// Borrar la cuenta, mandar la copia de datos o registrar actividad: siempre sobre la cuenta del token, nunca sobre otra
async function Accioncuenta(Administrador: Cliente, Peticion: Request, Cuerpo: Record<string, unknown>, Origen: string | null) {
  const Usuario = await Usuariodetoken(Administrador, Peticion);
  if (!Usuario || !Usuario.email) return Responder(401, { ok: false, mensaje: 'Tu sesión venció. Vuelve a iniciar sesión para continuar.' }, Origen);
  if (Cuerpo.accion === 'actividad') return Responder(200, await Registraractividad(Administrador, Usuario), Origen);
  if (Cuerpo.accion === 'eliminar') {
    // La app manda esta palabra solo después de que la persona aceptó el aviso de que no se puede deshacer
    if (Cuerpo.confirmacion !== 'ELIMINAR') return Responder(400, { ok: false, mensaje: 'Confirma que quieres borrar tu cuenta.' }, Origen);
    const Resultado = await Eliminarusuario(Administrador, Usuario, 'usuario');
    return Responder(Resultado.ok ? 200 : 500, Resultado, Origen);
  }
  const Resultado = await Exportardatos(Administrador, Usuario, Cuerpo.local);
  return Responder(Resultado.ok ? 200 : (Resultado.estado || 500), Resultado, Origen);
}

// Compara letra por letra sin salirse antes, para no dar pistas por el tiempo de respuesta
function Igualseguro(Uno: string, Otro: string): boolean {
  if (Uno.length !== Otro.length) return false;
  let Diferencia = 0;
  for (let Indice = 0; Indice < Uno.length; Indice++) Diferencia |= Uno.charCodeAt(Indice) ^ Otro.charCodeAt(Indice);
  return Diferencia === 0;
}

// Solo la tarea programada conoce TAREA_CLAVE; sin ella nadie puede disparar el borrado por inactividad
async function Tareadepurar(Administrador: Cliente, Peticion: Request, Origen: string | null) {
  const Clave = Leersecreto('TAREA_CLAVE');
  const Recibida = Peticion.headers.get('x-clave-tarea') || '';
  if (Clave.length < 32 || !Igualseguro(Recibida, Clave)) return Responder(401, { ok: false, mensaje: 'No autorizado.' }, Origen);
  return Responder(200, { ok: true, ...(await Depurarinactivos(Administrador)) }, Origen);
}

Deno.serve(async (Peticion: Request) => {
  const Origen = Peticion.headers.get('Origin');
  if (Peticion.method === 'OPTIONS') return new Response(null, { status: 204, headers: Cabeceras(Origen) });
  if (Peticion.method !== 'POST') return Responder(405, { ok: false, mensaje: 'Método no permitido.' }, Origen);

  // La copia de datos trae lo guardado en el celular, por eso esa acción acepta un cuerpo más grande
  const Texto = await Peticion.text();
  if (Texto.length > 300000) return Responder(413, { ok: false, mensaje: 'La solicitud es demasiado larga.' }, Origen);
  let Cuerpo: Record<string, unknown>;
  try {
    Cuerpo = JSON.parse(Texto || '{}');
  } catch {
    return Responder(400, { ok: false, mensaje: 'Solicitud no válida.' }, Origen);
  }
  if (!Cuerpo || typeof Cuerpo !== 'object' || Array.isArray(Cuerpo)) return Responder(400, { ok: false, mensaje: 'Solicitud no válida.' }, Origen);
  if (Cuerpo.accion !== 'exportar' && Texto.length > 4000) return Responder(413, { ok: false, mensaje: 'La solicitud es demasiado larga.' }, Origen);

  const Administrador = createClient(Leersecreto('SUPABASE_URL'), Leersecreto('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  try {
    if (Cuerpo.accion === 'soporte') return await Registrarsoporte(Administrador, Peticion, Cuerpo, Origen);
    if (Cuerpo.accion === 'autorizacion') return await Registrarautorizacion(Administrador, Peticion, Cuerpo, Origen);
    if (Cuerpo.accion === 'depurar') return await Tareadepurar(Administrador, Peticion, Origen);
    if (['eliminar', 'exportar', 'actividad'].includes(String(Cuerpo.accion))) return await Accioncuenta(Administrador, Peticion, Cuerpo, Origen);
    return Responder(400, { ok: false, mensaje: 'Solicitud no válida.' }, Origen);
  } catch {
    return Responder(500, { ok: false, mensaje: 'No pudimos procesar tu solicitud en este momento, intenta de nuevo.' }, Origen);
  }
});
