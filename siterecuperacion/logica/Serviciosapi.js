// Lectura de lo que trae el enlace del correo y envío de la clave nueva a Supabase

export const Configuracionbase = {
  Urlsupabase: 'https://tbliwiawziexlziqqcji.supabase.co',
  Claveanonima: 'sb_publishable_97ZjBlve6ihVdxgH2wWchw_b8VDbd_N'
};

// Supabase devuelve los datos del enlace después del # (y a veces después del ?)
export function Extraerdatosenlace() {
  const Parametroshash = new URLSearchParams(window.location.hash.substring(1));
  const Parametrosconsulta = new URLSearchParams(window.location.search.substring(1));
  const Buscar = (Nombre) => Parametroshash.get(Nombre) || Parametrosconsulta.get(Nombre);

  const Datos = {
    Tokenencontrado: Buscar('access_token'),
    Tipoaccion: Buscar('type'),
    Codigoerror: Buscar('error_code') || Buscar('error'),
    Errorurl: Buscar('error_description') || Buscar('error')
  };

  // Ya leído, se quita de la barra de direcciones para que el código no quede a la vista ni en el historial
  if (window.location.hash || window.location.search) {
    window.history.replaceState(null, '', window.location.pathname);
  }
  return Datos;
}

// Guarda la contraseña nueva con el código del enlace; la fecha va en hora de Colombia para el correo de aviso
export async function Guardarclavesupabase(Tokenacceso, Clavenueva) {
  const Fechacambio = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const Respuesta = await fetch(Configuracionbase.Urlsupabase + '/auth/v1/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'apikey': Configuracionbase.Claveanonima,
      'Authorization': 'Bearer ' + Tokenacceso
    },
    body: JSON.stringify({ password: Clavenueva, data: { fecha_cambio: Fechacambio } })
  });
  const Datos = await Respuesta.json().catch(() => null);

  if (Respuesta.ok) {
    return { Exitoso: true, Mensaje: 'Contraseña actualizada.' };
  }

  // Los mensajes de Supabase llegan en inglés, así que se traducen los casos que más pasan
  const Codigo = (Datos && Datos.error_code) || '';
  let Mensajefalla = 'No se pudo actualizar la contraseña. Es posible que el enlace ya haya vencido.';
  if (Codigo === 'same_password') Mensajefalla = 'La contraseña nueva tiene que ser distinta a la anterior.';
  else if (Codigo === 'weak_password') Mensajefalla = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
  else if (Respuesta.status === 401 || Respuesta.status === 403) Mensajefalla = 'El enlace ya venció o no es válido. Pide un correo nuevo desde la app.';

  return { Exitoso: false, Mensaje: Mensajefalla };
}
