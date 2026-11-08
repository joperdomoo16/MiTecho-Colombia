// Punto de entrada que conecta la lectura del enlace, las validaciones y los botones de la pantalla

import { Extraertokenurl, Enviarclaveservidor } from './Serviciosapi.js';
import { Validarcamposclave } from './Validaciones.js';
import {
  Alternarvisibilidadcampo,
  Actualizarinterfazreglas,
  Mostraralertaerror,
  Ocultaralertaerror,
  Cambiarvistaseccion,
  Actualizarbotonguardar
} from './Interfaz.js';

let Tokenactivo = null;

// Lee lo que se escribió en ambos campos y actualiza el estado de las reglas en pantalla
function Revisarentradas() {
  const Camponueva = document.getElementById('nueva-clave');
  const Campoconfirmar = document.getElementById('confirmar-clave');
  const Valornueva = Camponueva ? Camponueva.value : '';
  const Valorconfirmar = Campoconfirmar ? Campoconfirmar.value : '';

  const Estadovalidacion = Validarcamposclave(Valornueva, Valorconfirmar);
  Actualizarinterfazreglas(Estadovalidacion);
  return Estadovalidacion;
}

// Envía la nueva contraseña cuando se da clic en el botón de guardar
async function Guardarnuevaclave() {
  const Camponueva = document.getElementById('nueva-clave');
  const Valornueva = Camponueva ? Camponueva.value : '';
  const Estadovalidacion = Revisarentradas();

  if (!Estadovalidacion.Todovalido) {
    Mostraralertaerror('Por favor verifica que la contraseña tenga al menos 6 caracteres y que ambos campos coincidan.');
    return;
  }

  if (!Tokenactivo) {
    Cambiarvistaseccion('expirado');
    return;
  }

  Actualizarbotonguardar(true);
  Ocultaralertaerror();

  try {
    const Resultado = await Enviarclaveservidor(Tokenactivo, Valornueva);
    if (Resultado.Exitoso) {
      Cambiarvistaseccion('exito');
    } else {
      Mostraralertaerror(Resultado.Mensaje);
      Actualizarbotonguardar(false);
    }
  } catch (Falla) {
    Mostraralertaerror('Ocurrió un problema de conexión. Revisa tu acceso a internet e intenta de nuevo.');
    Actualizarbotonguardar(false);
  }
}

// Verifica el código del enlace recibido por correo y activa los botones de la pantalla
function Iniciaraplicacion() {
  const Datosurl = Extraertokenurl();

  if (Datosurl.Errorurl || !Datosurl.Tokenencontrado) {
    Cambiarvistaseccion('expirado');
    return;
  }

  Tokenactivo = Datosurl.Tokenencontrado;

  const Camponueva = document.getElementById('nueva-clave');
  const Campoconfirmar = document.getElementById('confirmar-clave');
  const Botonvernueva = document.getElementById('ver-nueva-clave');
  const Botonverconfirmar = document.getElementById('ver-confirmar-clave');
  const Botonguardar = document.getElementById('boton-guardar');

  if (Camponueva) {
    Camponueva.addEventListener('input', Revisarentradas);
  }
  if (Campoconfirmar) {
    Campoconfirmar.addEventListener('input', Revisarentradas);
  }
  if (Botonvernueva) {
    Botonvernueva.addEventListener('click', () => Alternarvisibilidadcampo('nueva-clave'));
  }
  if (Botonverconfirmar) {
    Botonverconfirmar.addEventListener('click', () => Alternarvisibilidadcampo('confirmar-clave'));
  }
  if (Botonguardar) {
    Botonguardar.addEventListener('click', Guardarnuevaclave);
  }
}

window.addEventListener('DOMContentLoaded', Iniciaraplicacion);
