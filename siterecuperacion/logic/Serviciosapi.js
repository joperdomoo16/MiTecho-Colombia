// Lectura del código que llega en el enlace del correo y envío de la nueva clave al servidor

export const Configuracionbase = {
  Urlsupabase: 'https://tbliwiawziexlziqqcji.supabase.co',
  Claveanonima: 'sb_publishable_97ZjBlve6ihVdxgH2wWchw_b8VDbd_N'
};

// Busca el código temporal de autorización en la dirección del enlace abierto desde el correo
export function Extraertokenurl() {
  const Fragmentohash = window.location.hash.substring(1);
  const Parametroshash = new URLSearchParams(Fragmentohash);
  const Fragmentoconsulta = window.location.search.substring(1);
  const Parametrosconsulta = new URLSearchParams(Fragmentoconsulta);

  const Tokenencontrado = Parametroshash.get('access_token') || Parametrosconsulta.get('access_token');
  const Tipoaccion = Parametroshash.get('type') || Parametrosconsulta.get('type');
  const Errorurl = Parametroshash.get('error_description')
    || Parametrosconsulta.get('error_description')
    || Parametroshash.get('error')
    || Parametrosconsulta.get('error');

  return {
    Tokenencontrado,
    Tipoaccion,
    Errorurl
  };
}

// Envía la contraseña nueva y la hora de Colombia al servidor para actualizar la cuenta
export async function Enviarclaveservidor(Tokenacceso, Clavenueva) {
  let Respuesta = await fetch('/api/actualizar-clave', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: Tokenacceso, nuevaClave: Clavenueva })
  }).catch(() => null);

  let Datos = Respuesta ? await Respuesta.json().catch(() => null) : null;

  // Si el servidor intermedio no responde, envía el cambio directo a Supabase
  if (!Respuesta || !Datos) {
    const Fechacambio = new Date().toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    Respuesta = await fetch(Configuracionbase.Urlsupabase + '/auth/v1/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Configuracionbase.Claveanonima,
        'Authorization': 'Bearer ' + Tokenacceso
      },
      body: JSON.stringify({
        password: Clavenueva,
        data: { fecha_cambio: Fechacambio }
      })
    });
    Datos = await Respuesta.json().catch(() => null);
  }

  if (Respuesta.ok && (!Datos || Datos.ok !== false)) {
    return { Exitoso: true, Mensaje: 'Contraseña actualizada.' };
  }

  const Mensajefalla = (Datos && (Datos.mensaje || Datos.msg || Datos.message || Datos.error_description))
    || 'No se pudo actualizar la contraseña. Es posible que el enlace ya haya vencido.';

  return { Exitoso: false, Mensaje: Mensajefalla };
}
