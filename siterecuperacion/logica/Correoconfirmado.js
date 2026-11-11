// Decide qué mensaje ver después de dar clic en el enlace de confirmación del correo

import { Extraerdatosenlace } from './Serviciosapi.js';
import { Cambiarvistaseccion } from './Interfaz.js';

// Si el enlace venció o ya se usó, Supabase lo avisa con error_code (por ejemplo otp_expired)
function Mostrarresultado() {
  const Datosurl = Extraerdatosenlace();
  Cambiarvistaseccion(Datosurl.Codigoerror ? 'expirado' : 'exito');
}

window.addEventListener('DOMContentLoaded', Mostrarresultado);
