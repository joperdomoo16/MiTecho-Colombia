// Cambios visuales en el formulario, mensajes de alerta y vistas de confirmación

// Muestra u oculta el texto escrito en un campo de contraseña al dar clic en el ícono del ojo
export function Alternarvisibilidadcampo(Idcampo) {
  const Campo = document.getElementById(Idcampo);
  if (Campo) {
    Campo.type = Campo.type === 'password' ? 'text' : 'password';
  }
}

// Marca en verde las condiciones que ya cumple la contraseña mientras la persona escribe
export function Actualizarinterfazreglas(Estadovalidacion) {
  const Reglalongitud = document.getElementById('regla-longitud');
  const Reglacoincidencia = document.getElementById('regla-coincidencia');

  if (Reglalongitud) {
    Reglalongitud.className = 'regla-clave' + (Estadovalidacion.Longitudvalida ? ' cumplida' : '');
  }
  if (Reglacoincidencia) {
    Reglacoincidencia.className = 'regla-clave' + (Estadovalidacion.Coinciden ? ' cumplida' : '');
  }
}

// Muestra el cuadro de alerta con el mensaje del problema ocurrido
export function Mostraralertaerror(Mensaje) {
  const Contenedoralerta = document.getElementById('caja-alerta');
  const Textoalerta = document.getElementById('texto-alerta');
  if (Textoalerta) {
    Textoalerta.textContent = Mensaje;
  }
  if (Contenedoralerta) {
    Contenedoralerta.className = 'caja-mensaje error';
  }
}

// Esconde el cuadro de alerta antes de enviar una nueva solicitud
export function Ocultaralertaerror() {
  const Contenedoralerta = document.getElementById('caja-alerta');
  if (Contenedoralerta) {
    Contenedoralerta.className = 'caja-mensaje error oculto';
  }
}

// Cambia entre el formulario, el mensaje de éxito y el aviso de enlace vencido
export function Cambiarvistaseccion(Nombrevista) {
  const Seccionformulario = document.getElementById('seccion-formulario');
  const Seccionexito = document.getElementById('seccion-exito');
  const Seccionexpirado = document.getElementById('seccion-expirado');

  if (Seccionformulario) {
    Seccionformulario.className = Nombrevista === 'formulario' ? 'seccion-estado' : 'seccion-estado oculto';
  }
  if (Seccionexito) {
    Seccionexito.className = Nombrevista === 'exito' ? 'seccion-estado estado-centrado' : 'seccion-estado estado-centrado oculto';
  }
  if (Seccionexpirado) {
    Seccionexpirado.className = Nombrevista === 'expirado' ? 'seccion-estado estado-centrado' : 'seccion-estado estado-centrado oculto';
  }
}

// Desactiva el botón mientras se guarda la contraseña para evitar varios envíos seguidos
export function Actualizarbotonguardar(Ocupado) {
  const Boton = document.getElementById('boton-guardar');
  if (!Boton) return;
  Boton.disabled = Ocupado;
  Boton.textContent = Ocupado ? 'Guardando...' : 'Guardar nueva contraseña';
}
