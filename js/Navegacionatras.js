// Orden en que el botón atrás del celular va cerrando lo que está abierto, de lo más encima a lo más abajo,
// y el historial que le permite volver a la pantalla desde donde la persona llegó.
// Las funciones que reciben this se llaman con .call desde la app.

const Limitehistorial = 20;

// Lugar de la app como texto: pestaña, paso del simulador y panel abierto
function Lugarnavegacion(Componente) {
  const Estado = Componente.Estadocomponente, Pestana = Componente.Pestana;
  return Pestana + '|' + (Pestana === 'simulador' ? (Estado.Simuladorpaso || 'form') : '') + '|' + (Estado.Panel || '');
}

// Dónde iba la pantalla en cada lugar, para que atrás vuelva al mismo punto y no al principio
function Seguirdesplazamiento() {
  if (this.Desplazamientos || typeof document === 'undefined') return;
  this.Desplazamientos = {};
  // Solo cuenta la pantalla principal o el panel abierto; Ayuda y las listas internas tienen su propio desplazamiento
  document.addEventListener('scroll', Evento => {
    const Nodo = Evento.target, Estado = this.Estadocomponente;
    const Principal = Nodo === this.Desplazamientoreferencia.Actual && !Estado.Panel;
    const Panel = Boolean(Estado.Panel) && !Estado.Ayuda && Nodo && Nodo.classList && Nodo.classList.contains('m3l');
    if (Principal || Panel) this.Desplazamientos[Lugarnavegacion(this)] = Nodo.scrollTop;
  }, { capture: true, passive: true });
}

// Después de pintar el lugar al que se volvió, la pantalla baja hasta donde estaba
function Restaurardesplazamiento() {
  const Valor = this.Desplazamientopendiente;
  this.Desplazamientopendiente = 0;
  if (!Valor || typeof document === 'undefined') return;
  const Nodo = this.Estadocomponente.Panel ? document.querySelector('.m3l.mt-scroll') : this.Desplazamientoreferencia.Actual;
  if (Nodo) Nodo.scrollTop = Valor;
}

// Se llama después de cada cambio: si la persona pasó a otro lugar, el anterior queda guardado para volver a él
function Registrarnavegacion() {
  Seguirdesplazamiento.call(this);
  if (this.Pantalla !== 'app') {
    this.Historialnavegacion = [];
    this.Lugarprevio = null;
    return;
  }
  const Lugar = Lugarnavegacion(this), Previo = this.Lugarprevio;
  this.Lugarprevio = Lugar;
  if (!Previo || Previo === Lugar) return;
  const Pila = this.Historialnavegacion || (this.Historialnavegacion = []);
  // Si volvió al lugar anterior con un botón de la pantalla (Volver, Ajustar), cuenta como atrás
  if (Pila[Pila.length - 1] === Lugar) {
    Pila.pop();
    return;
  }
  Pila.push(Previo);
  if (Pila.length > Limitehistorial) Pila.shift();
}

// Las pestañas de abajo son el primer nivel: al tocarlas empieza un historial nuevo y atrás lleva al Inicio
function Reiniciarnavegacion() {
  this.Historialnavegacion = [];
  this.Lugarprevio = null;
}

function Volverlugaranterior() {
  const Pila = this.Historialnavegacion || [];
  if (!Pila.length) return false;
  const Destino = Pila.pop();
  const [Pestana, Paso, Panel] = Destino.split('|');
  const Cambios = { Pestana, Panel: Panel || null, Menu: false };
  // Al salir del simulador hacia atrás, la próxima vez que se abra empieza en el formulario
  if (Paso) Cambios.Simuladorpaso = Paso;
  else if (this.Pestana === 'simulador') Cambios.Simuladorpaso = 'form';
  this.Lugarprevio = Destino;
  this.Desplazamientopendiente = (this.Desplazamientos || {})[Destino] || 0;
  this.Cambiarestado(Cambios);
  return true;
}

function Manejaratras() {
  const Estado = this.Estadocomponente;

  // Cierra primero las hojas y ventanas abiertas encima de la pantalla actual
  if (Estado.Vinculacionpendiente) {
    Cancelarvinculacioninvitado.call(this);
    return;
  }
  if (Estado.Avisoinvitado) {
    this.Cambiarestado({ Avisoinvitado: false });
    return;
  }
  if (Estado.Perfildato) {
    this.Cambiarestado({ Perfildato: '', Ciudadabierta: false });
    return;
  }
  if (Estado.Tipoviviendaabierto || Estado.Calculoabierto) {
    this.Cambiarestado({ Tipoviviendaabierto: false, Calculoabierto: false });
    return;
  }
  if (Estado.Eliminacionabierta) {
    this.Cambiarestado({ Eliminacionabierta: false });
    return;
  }
  if (Estado.Soporteabierto) {
    this.Cambiarestado({ Soporteabierto: false });
    return;
  }
  if (Estado.Hoja) {
    this.Cambiarestado({ Hoja: false });
    return;
  }
  if (Estado.Ayuda) {
    this.Cambiarestado({ Ayuda: false });
    return;
  }
  if (Estado.Menu) {
    this.Cambiarestado({ Menu: false });
    return;
  }
  if (typeof Recorridoactual === 'function' && Recorridoactual(this)) {
    Avanzarrecorrido(this, true);
    return;
  }

  // Si llegó desde otra pestaña o tarjeta, retrocede por el historial guardado
  if (this.Pantalla === 'app' && Volverlugaranterior.call(this)) return;

  if (Estado.Panel && this.Pantalla === 'app') {
    this.Cambiarestado({ Panel: null });
    return;
  }

  if (this.Pantalla === 'app') {
    if (Estado.Pestana === 'simulador' && Estado.Simuladorpaso === 'result') {
      this.Cambiarestado({ Simuladorpaso: 'form' });
      return;
    }
    if (Estado.Pestana === 'ingresos' && Estado.Ingresovista !== 'dia') {
      this.Cambiarestado({ Ingresovista: 'dia' });
      return;
    }
    if (Estado.Pestana && Estado.Pestana !== 'inicio') {
      this.Cambiarestado({ Pestana: 'inicio' });
      return;
    }
  }

  if (this.Pantalla === 'login') {
    if (Estado.Invitado) {
      this.Cambiarestado({ Pantalla: 'app', Correoabierto: false, Ingresomodo: 'login', Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' });
      return;
    }
    if (Estado.Ingresomodo === 'register' || Estado.Ingresomodo === 'recover') {
      this.Cambiarestado({ Ingresomodo: 'login', Ingresoerror: '', Ingresoexitomensaje: '' });
      return;
    }
    if (Estado.Correoabierto) {
      this.Cambiarestado({ Correoabierto: false, Ingresoerror: '', Ingresoexitomensaje: '' });
      return;
    }
  }

  if (this.Pantalla === 'setup') {
    const Paso = (Estado.Cuestionario && Estado.Cuestionario.Paso) || 0;
    if (Paso > 0) {
      this.Cambiarestado(Previo => ({ Cuestionario: { ...(Previo.Cuestionario || {}), Paso: Paso - 1 } }));
      return;
    }
  }

  // En el Inicio sin nada abierto exige un segundo toque para minimizar la aplicación
  const Ahora = Date.now();
  if (this.Ultimotoqueatras && (Ahora - this.Ultimotoqueatras) < 2200) {
    if (window.Puentenativo && typeof window.Puentenativo.minimizarApp === 'function') {
      window.Puentenativo.minimizarApp();
    }
  } else {
    this.Ultimotoqueatras = Ahora;
    this.Aviso('Presiona atrás de nuevo para salir.');
  }
}
