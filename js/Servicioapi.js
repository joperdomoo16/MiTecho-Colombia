// Conexión de la aplicación móvil con el servidor de cuentas y base de datos en Supabase

const Configuracionapi = {
  urlBase: (typeof window !== 'undefined' && window.__MITECHO_API_URL__) || 'https://tbliwiawziexlziqqcji.supabase.co',
  anonKey: (typeof window !== 'undefined' && window.__MITECHO_ANON_KEY__) || 'sb_publishable_97ZjBlve6ihVdxgH2wWchw_b8VDbd_N',
  googleSheetsUrl: (typeof window !== 'undefined' && window.__MITECHO_SHEETS_URL__) || 'https://script.google.com/macros/s/AKfycbxuu7Hs6O_7OudmeDU_-jololBgAyuAbgAyR8DOuqIFGTxjg62Fh4fmi7xFJd8hFQsU5w/exec',
  tiempoEsperaMs: 8000
};

const ClaveTokenAuth = 'mitecho.auth.token';
const ClaveUidAuth = 'mitecho.auth.uid';
const ClaveEmailAuth = 'mitecho.auth.email';

function ObtenerTokenSesion() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(ClaveTokenAuth) : null;
}

function ObtenerUidSesion() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(ClaveUidAuth) : null;
}

function GuardarTokensSesion(token, uid, email) {
  if (typeof localStorage === 'undefined') return;
  if (token) localStorage.setItem(ClaveTokenAuth, token);
  if (uid) localStorage.setItem(ClaveUidAuth, uid);
  if (email) localStorage.setItem(ClaveEmailAuth, email);
}

function LimpiarTokensSesion() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(ClaveTokenAuth);
  localStorage.removeItem(ClaveUidAuth);
  localStorage.removeItem(ClaveEmailAuth);
}

async function PeticionHttpSegura(url, opciones = {}) {
  const controlador = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controlador ? setTimeout(() => controlador.abort(), Configuracionapi.tiempoEsperaMs) : null;

  try {
    const respuesta = await fetch(url, {
      ...opciones,
      signal: controlador ? controlador.signal : undefined
    });
    if (timer) clearTimeout(timer);

    const datosJson = await respuesta.json().catch(() => null);
    if (!respuesta.ok) {
      const msg = (datosJson && (datosJson.msg || datosJson.message || datosJson.error_description || datosJson.error))
        || ('Error en el servidor (' + respuesta.status + ')');
      return { ok: false, error: msg, estado: respuesta.status };
    }
    return { ok: true, datos: datosJson, estado: respuesta.status };
  } catch (error) {
    if (timer) clearTimeout(timer);
    return { ok: false, error: error.message || 'Error de conexión', offline: true };
  }
}

async function PeticionAuth(endpoint, body) {
  const url = Configuracionapi.urlBase + '/auth/v1/' + endpoint;
  return PeticionHttpSegura(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': Configuracionapi.anonKey
    },
    body: JSON.stringify(body)
  });
}

async function PeticionRest(ruta, opciones = {}) {
  const token = ObtenerTokenSesion();
  const url = Configuracionapi.urlBase + '/rest/v1/' + ruta;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'apikey': Configuracionapi.anonKey,
    'Authorization': 'Bearer ' + (token || Configuracionapi.anonKey),
    ...(opciones.headers || {})
  };
  return PeticionHttpSegura(url, { ...opciones, headers });
}

// Inicia sesión con correo y contraseña y guarda la sesión en el celular
async function IniciarSesionApi(correo, contrasena) {
  const res = await PeticionAuth('token?grant_type=password', { email: correo, password: contrasena });
  if (res.ok && res.datos && res.datos.access_token) {
    GuardarTokensSesion(res.datos.access_token, res.datos.user && res.datos.user.id, correo);
  }
  return res;
}

async function IniciarSesionConIdTokenGoogle(idToken) {
  const res = await PeticionAuth('token?grant_type=id_token', {
    provider: 'google',
    id_token: idToken
  });
  if (res.ok && res.datos && res.datos.access_token) {
    const user = res.datos.user || {};
    GuardarTokensSesion(res.datos.access_token, user.id, user.email || '');
  }
  return res;
}

async function RegistrarUsuarioApi(datosUsuario) {
  const res = await PeticionAuth('signup', {
    email: datosUsuario.email,
    password: datosUsuario.password,
    data: { nombre: datosUsuario.nombre || '', ciudad: datosUsuario.ciudad || 'Bogotá' }
  });
  if (res.ok && res.datos && res.datos.access_token) {
    GuardarTokensSesion(res.datos.access_token, res.datos.user && res.datos.user.id, datosUsuario.email);
  }
  return res;
}

async function RecuperarContrasenaApi(correo) {
  return PeticionAuth('recover', { email: correo });
}

async function CerrarSesionApi() {
  const token = ObtenerTokenSesion();
  if (token) {
    await PeticionHttpSegura(Configuracionapi.urlBase + '/auth/v1/logout', {
      method: 'POST',
      headers: { 'apikey': Configuracionapi.anonKey, 'Authorization': 'Bearer ' + token }
    }).catch(() => null);
  }
  LimpiarTokensSesion();
  return { ok: true };
}

async function ObtenerPerfilApi() {
  const uid = ObtenerUidSesion();
  if (!uid) return { ok: false, error: 'No hay sesión activa' };
  return PeticionRest('perfiles_financieros?select=*&usuario_id=eq.' + encodeURIComponent(uid), { method: 'GET' });
}

async function GuardarPerfilApi(perfil) {
  const uid = ObtenerUidSesion();
  if (!uid) return { ok: false, error: 'No hay sesión activa' };
  const payload = { ...perfil, usuario_id: uid, actualizado_en: new Date().toISOString() };
  return PeticionRest('perfiles_financieros', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(payload)
  });
}

async function SincronizarRegistrosApi(entradas, egresos) {
  const uid = ObtenerUidSesion();
  if (!uid) return { ok: false, error: 'No hay sesión activa' };
  const items = [
    ...(entradas || []).map(e => ({ usuario_id: uid, tipo: 'ingreso', concepto: e.concepto, fuente: e.fuente, medio: e.medio, monto: e.monto, hora: e.hora || '' })),
    ...(egresos || []).map(e => ({ usuario_id: uid, tipo: 'gasto', concepto: e.nombre || e.cat, fuente: e.cat, medio: e.medio, monto: e.monto, hora: e.hora || '' }))
  ];
  if (!items.length) return { ok: true, datos: [] };
  return PeticionRest('transacciones', { method: 'POST', body: JSON.stringify(items) });
}

async function RegistrarCertificadoEmitidoApi(refCode, resumen) {
  const uid = ObtenerUidSesion();
  const payload = {
    usuario_id: uid || null,
    ref_code: refCode,
    nombre_titular: resumen.nombreTitular || 'Solicitante',
    nombre_pareja: resumen.nombrePareja || null,
    precio_maximo: Math.round(resumen.precio || 0),
    credito_estimado: Math.round(resumen.credito || 0),
    cuota_mensual: Math.round(resumen.cuota || 0),
    subsidio_asignado: Math.round(resumen.subsidio || 0),
    estado_cierre: resumen.estado || 'cierre_completo'
  };
  return PeticionRest('certificados', { method: 'POST', body: JSON.stringify(payload) });
}

async function ConsultarValidezCertificadoApi(refCode) {
  return PeticionRest('certificados?select=*&ref_code=eq.' + encodeURIComponent(refCode), { method: 'GET' });
}

async function RegistrarLeadComercialApi(datosLead) {
  const uid = ObtenerUidSesion();
  const payload = {
    usuario_id: uid || null,
    nombre: datosLead.nombre || '',
    celular: datosLead.celular || '',
    ciudad: datosLead.ciudad || 'Bogotá',
    producto: datosLead.producto || 'Crédito hipotecario',
    entidad: datosLead.entidad || 'Entidad aliada',
    autorizo_habeas_data: true
  };
  const resSb = await PeticionRest('leads_comerciales', { method: 'POST', body: JSON.stringify(payload) });
  try {
    if (Configuracionapi.googleSheetsUrl) {
      await fetch(Configuracionapi.googleSheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...datosLead,
          autorizoLey1581: true
        })
      });
    }
  } catch (e) {}
  return resSb;
}

async function RegistrarSolicitudSoporteApi(datosSoporte) {
  const uid = ObtenerUidSesion();
  const payload = {
    usuario_id: uid || null,
    nombre: datosSoporte.nombre || '',
    celular: datosSoporte.email || '',
    ciudad: datosSoporte.ciudad || 'Bogotá',
    producto: 'SOPORTE: ' + (datosSoporte.asunto || ''),
    entidad: (datosSoporte.descripcion || '').slice(0, 500),
    autorizo_habeas_data: true
  };
  const resSb = await PeticionRest('leads_comerciales', { method: 'POST', body: JSON.stringify(payload) }).catch(() => ({ ok: true }));
  try {
    if (Configuracionapi.googleSheetsUrl) {
      await fetch(Configuracionapi.googleSheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'soporte_tecnico',
          destino: 'rumoriastudio@gmail.com',
          nombre: datosSoporte.nombre,
          email: datosSoporte.email,
          asunto: datosSoporte.asunto,
          descripcion: datosSoporte.descripcion,
          ciudad: datosSoporte.ciudad || 'Bogotá',
          fecha: new Date().toISOString()
        })
      });
    }
  } catch (e) {}
  return resSb;
}

function EstadoSesionActual() {
  return {
    autenticado: !!ObtenerTokenSesion(),
    token: ObtenerTokenSesion(),
    uid: ObtenerUidSesion(),
    email: typeof localStorage !== 'undefined' ? localStorage.getItem(ClaveEmailAuth) : null
  };
}
