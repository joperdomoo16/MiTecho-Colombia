// Cliente HTTP hacia Supabase: cuentas, respaldo del perfil, tasas semanales y trámites legales

const Configuracionapi = {
  Urlbase: 'https://tbliwiawziexlziqqcji.supabase.co',
  Claveanonima: 'sb_publishable_97ZjBlve6ihVdxgH2wWchw_b8VDbd_N',
  Tiempoesperams: 8000,
  Urlcorreoconfirmado: 'https://mitecho-co.web.app/Correoconfirmado',
  Urlrestablecer: 'https://mitecho-co.web.app/Restablecercontrasena'
};

const Mensajesinconexion = 'No pudimos conectarnos en este momento, revisa tu internet e intenta de nuevo.';

// En el celular la sesión va cifrada en el Keystore; en el computador vive solo en memoria RAM mientras corre la pestaña
const Sesionmemoria = new Map();

function Puentesesion() {
  const Puente = typeof window !== 'undefined' ? window.Puentenativo : null;
  return Puente && typeof Puente.leerSeguro === 'function' ? Puente : null;
}

function Leerdatosesion(Clave) {
  const Puente = Puentesesion();
  if (Puente) return Puente.leerSeguro(Clave) || null;
  return Sesionmemoria.get(Clave) || null;
}

function Guardardatosesion(Clave, Valor) {
  if (!Valor) return;
  const Puente = Puentesesion();
  if (Puente) {
    Puente.guardarSeguro(Clave, String(Valor));
    return;
  }
  Sesionmemoria.set(Clave, String(Valor));
}

function Borrardatosesion(Clave) {
  const Puente = Puentesesion();
  if (Puente) Puente.borrarSeguro(Clave);
  Sesionmemoria.delete(Clave);
}

// Migra y borra cualquier rastro viejo que haya quedado de primeras versiones
function Migrarsesionantigua() {
  if (typeof localStorage === 'undefined') return;
  const Antiguas = { token: 'mitecho.auth.token', uid: 'mitecho.auth.uid', correo: 'mitecho.auth.email' };
  for (const Clave in Antiguas) {
    try {
      const Valor = localStorage.getItem(Antiguas[Clave]);
      if (Valor !== null) {
        Guardardatosesion(Clave, Valor);
        localStorage.removeItem(Antiguas[Clave]);
      }
    } catch (Falla) {}
  }
}
Migrarsesionantigua();

function Obtenertokensesion() {
  return Leerdatosesion('token');
}

function Obteneruidsesion() {
  return Leerdatosesion('uid');
}

function Guardartokenssesion(Token, Uid, Correo, Renovacion) {
  Guardardatosesion('token', Token);
  if (Renovacion) Guardardatosesion('renovacion', Renovacion);
  Guardardatosesion('uid', Uid);
  Guardardatosesion('correo', Correo);
}

function Limpiartokenssesion() {
  Borrardatosesion('token');
  Borrardatosesion('renovacion');
  Borrardatosesion('uid');
  Borrardatosesion('correo');
}

async function Peticionhttpsegura(Url, Opciones = {}) {
  const Controlador = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const Temporizador = Controlador ? setTimeout(() => Controlador.abort(), Configuracionapi.Tiempoesperams) : null;

  try {
    const Respuesta = await fetch(Url, {
      ...Opciones,
      signal: Controlador ? Controlador.signal : undefined
    });
    if (Temporizador) clearTimeout(Temporizador);

    const Datosjson = await Respuesta.json().catch(() => null);
    if (!Respuesta.ok) {
      const Mensaje = (Datosjson && (Datosjson.msg || Datosjson.mensaje || Datosjson.message || Datosjson.error_description || Datosjson.error))
        || ('Error en el servidor (' + Respuesta.status + ')');
      const Codigo = (Datosjson && Datosjson.error_code) || '';
      return { ok: false, error: Mensaje, codigo: Codigo, estado: Respuesta.status };
    }
    return { ok: true, datos: Datosjson, estado: Respuesta.status };
  } catch (Fallared) {
    if (Temporizador) clearTimeout(Temporizador);
    return { ok: false, error: Mensajesinconexion, offline: true };
  }
}

async function Peticionauth(Ruta, Cuerpo) {
  const Url = Configuracionapi.Urlbase + '/auth/v1/' + Ruta;
  return Peticionhttpsegura(Url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': Configuracionapi.Claveanonima
    },
    body: JSON.stringify(Cuerpo)
  });
}

// Comparte una sola renovación activa cuando varias llamadas reciben 401 al mismo tiempo
let Renovacionencurso = null;
function Renovarsesionapi() {
  const Renovacion = Leerdatosesion('renovacion');
  if (!Renovacion) return Promise.resolve(false);
  if (!Renovacionencurso) {
    Renovacionencurso = Peticionauth('token?grant_type=refresh_token', { refresh_token: Renovacion }).then(Resultado => {
      const Datos = Resultado.ok && Resultado.datos;
      if (!Datos || !Datos.access_token) return false;
      Guardartokenssesion(Datos.access_token, Datos.user && Datos.user.id, Datos.user && Datos.user.email, Datos.refresh_token);
      return true;
    }).finally(() => { Renovacionencurso = null; });
  }
  return Renovacionencurso;
}

async function Peticionconsesion(Hacerpeticion) {
  const Resultado = await Hacerpeticion();
  if (Resultado.ok || Resultado.estado !== 401 || !Leerdatosesion('renovacion')) return Resultado;
  const Renovada = await Renovarsesionapi();
  return Renovada ? Hacerpeticion() : Resultado;
}

async function Peticionrest(Ruta, Opciones = {}) {
  return Peticionconsesion(() => Peticionrestdirecta(Ruta, Opciones));
}

async function Peticionrestdirecta(Ruta, Opciones) {
  const Token = Obtenertokensesion();
  const Url = Configuracionapi.Urlbase + '/rest/v1/' + Ruta;
  const Cabeceras = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'apikey': Configuracionapi.Claveanonima,
    'Authorization': 'Bearer ' + (Token || Configuracionapi.Claveanonima),
    ...(Opciones.headers || {})
  };
  return Peticionhttpsegura(Url, { ...Opciones, headers: Cabeceras });
}

async function Iniciarsesionapi(Correo, Contrasena) {
  const Resultado = await Peticionauth('token?grant_type=password', { email: Correo, password: Contrasena });
  if (Resultado.ok && Resultado.datos && Resultado.datos.access_token) {
    Guardartokenssesion(Resultado.datos.access_token, Resultado.datos.user && Resultado.datos.user.id, Correo, Resultado.datos.refresh_token);
  }
  return Resultado;
}

async function Iniciarsesiongoogle(Tokenid) {
  const Resultado = await Peticionauth('token?grant_type=id_token', {
    provider: 'google',
    id_token: Tokenid
  });
  if (Resultado.ok && Resultado.datos && Resultado.datos.access_token) {
    const Usuarioremoto = Resultado.datos.user || {};
    Guardartokenssesion(Resultado.datos.access_token, Usuarioremoto.id, Usuarioremoto.email || '', Resultado.datos.refresh_token);
  }
  return Resultado;
}

async function Registrarusuarioapi(Datosusuario) {
  const Resultado = await Peticionauth('signup?redirect_to=' + encodeURIComponent(Configuracionapi.Urlcorreoconfirmado), {
    email: Datosusuario.email,
    password: Datosusuario.password,
    data: { nombre: Datosusuario.nombre || '', ciudad: Datosusuario.ciudad || 'Bogotá' }
  });
  if (Resultado.ok && Resultado.datos && Resultado.datos.access_token) {
    Guardartokenssesion(Resultado.datos.access_token, Resultado.datos.user && Resultado.datos.user.id, Datosusuario.email, Resultado.datos.refresh_token);
  }
  return Resultado;
}

async function Recuperarcontrasenaapi(Correo) {
  return Peticionauth('recover?redirect_to=' + encodeURIComponent(Configuracionapi.Urlrestablecer), { email: Correo });
}

async function Cerrarsesionapi() {
  const Token = Obtenertokensesion();
  if (Token) {
    await Peticionhttpsegura(Configuracionapi.Urlbase + '/auth/v1/logout', {
      method: 'POST',
      headers: { 'apikey': Configuracionapi.Claveanonima, 'Authorization': 'Bearer ' + Token }
    }).catch(() => null);
  }
  Limpiartokenssesion();
  return { ok: true };
}

async function Obtenerperfilapi() {
  const Uid = Obteneruidsesion();
  if (!Uid) return { ok: false, error: 'No hay sesión activa' };
  return Peticionrest('perfiles_financieros?select=*&usuario_id=eq.' + encodeURIComponent(Uid), { method: 'GET' });
}

async function Guardarperfilapi(Perfil) {
  const Uid = Obteneruidsesion();
  if (!Uid) return { ok: false, error: 'No hay sesión activa' };
  const Limpio = typeof Acotarcargaperfil === 'function' ? Acotarcargaperfil(Perfil) : Perfil;
  const Carga = { ...Limpio, usuario_id: Uid, actualizado_en: new Date().toISOString() };
  return Peticionrest('perfiles_financieros', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(Carga)
  });
}

function Peticionlegal(Cuerpo) {
  return Peticionconsesion(() => Peticionlegaldirecta(Cuerpo));
}

function Peticionlegaldirecta(Cuerpo) {
  const Token = Obtenertokensesion();
  const Cabeceras = { 'Content-Type': 'application/json', 'apikey': Configuracionapi.Claveanonima };
  if (Token) Cabeceras['Authorization'] = 'Bearer ' + Token;
  return Peticionhttpsegura(Configuracionapi.Urlbase + '/functions/v1/registrarlegal', {
    method: 'POST',
    headers: Cabeceras,
    body: JSON.stringify(Cuerpo)
  });
}

function Plataformaactual() {
  const Capacitor = typeof window !== 'undefined' ? window.Capacitor : null;
  const Nombre = Capacitor && typeof Capacitor.getPlatform === 'function' ? Capacitor.getPlatform() : 'web';
  const Nombres = { android: 'Android', ios: 'iOS' };
  return Nombres[Nombre] || 'Web';
}

async function Registrarsolicitudsoporteapi(Datossoporte) {
  return Peticionlegal({
    accion: 'soporte',
    tipo: Datossoporte.tipo || 'soporte',
    nombre: Datossoporte.nombre || '',
    correo: Datossoporte.correo || '',
    asunto: Datossoporte.asunto || '',
    descripcion: Datossoporte.descripcion || ''
  });
}

async function Obtenertasasapi() {
  return Peticionhttpsegura(Configuracionapi.Urlbase + '/rest/v1/tasas_vivienda_semanal?select=*', {
    method: 'GET',
    headers: { 'Accept': 'application/json', 'apikey': Configuracionapi.Claveanonima }
  });
}

async function Eliminarcuentaapi() {
  if (!Obtenertokensesion()) return { ok: false, estado: 401, error: 'Tu sesión venció. Vuelve a iniciar sesión para continuar.' };
  return Peticionlegal({ accion: 'eliminar', confirmacion: 'ELIMINAR' });
}

async function Exportardatosapi(Local) {
  if (!Obtenertokensesion()) return { ok: false, estado: 401, error: 'Tu sesión venció. Vuelve a iniciar sesión para continuar.' };
  return Peticionlegal({ accion: 'exportar', local: Local || {} });
}

async function Registraractividadapi() {
  if (!Obtenertokensesion()) return { ok: false, estado: 401 };
  return Peticionlegal({ accion: 'actividad' });
}

async function Registrarautorizacionapi() {
  if (!Obtenertokensesion()) return { ok: false, estado: 401, error: 'Tu sesión venció. Vuelve a iniciar sesión para continuar.' };
  return Peticionlegal({ accion: 'autorizacion', plataforma: Plataformaactual() });
}

async function Enviarbienvenidaapi() {
  const Token = Obtenertokensesion();
  if (!Token) return { ok: false, error: 'No hay sesión activa' };
  return Peticionconsesion(() => Peticionhttpsegura(Configuracionapi.Urlbase + '/functions/v1/enviarbienvenida', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': Configuracionapi.Claveanonima, 'Authorization': 'Bearer ' + Obtenertokensesion() },
    body: '{}'
  }));
}

function Estadosesionactual() {
  return {
    Autenticado: Boolean(Obtenertokensesion()),
    Token: Obtenertokensesion(),
    Uid: Obteneruidsesion(),
    Correo: Leerdatosesion('correo')
  };
}
