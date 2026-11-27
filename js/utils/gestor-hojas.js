// Gesto táctil reutilizable para cerrar cualquier hoja inferior deslizando hacia abajo

function Cerrarhojadeslizada(Componente, Hoja) {
  const Estado = Componente.Estadocomponente;
  if (Hoja && Hoja.classList && Hoja.classList.contains('tutorial-hoja')) {
    if (typeof Avanzarrecorrido === 'function') Avanzarrecorrido(Componente, true);
    return;
  }
  if (Estado.Vinculacionpendiente && typeof Cancelarvinculacioninvitado === 'function') {
    Cancelarvinculacioninvitado.call(Componente);
    return;
  }
  if (Estado.Avisoinvitado) {
    Componente.Cambiarestado({ Avisoinvitado: false });
    return;
  }
  if (Estado.Perfildato) {
    Componente.Cambiarestado({ Perfildato: '', Ciudadabierta: false });
    return;
  }
  if (Estado.Tipoviviendaabierto || Estado.Calculoabierto) {
    Componente.Cambiarestado({ Tipoviviendaabierto: false, Calculoabierto: false });
    return;
  }
  if (Estado.Eliminacionabierta) {
    Componente.Cambiarestado({ Eliminacionabierta: false, Eliminacionerror: '' });
    return;
  }
  if (Estado.Soporteabierto) {
    Componente.Cambiarestado({ Soporteabierto: false, Soporteanimado: false, Soportedesplazamiento: 0, Soportearrastrando: false });
    return;
  }
  if (Estado.Hoja) {
    Componente.Cambiarestado({ Hoja: false, Hojafecha: null, Deudaeditandoid: null });
  }
}

function Buscarvelohoja(Hoja) {
  if (!Hoja || !Hoja.parentElement) return null;
  const Velo = Hoja.parentElement.querySelector('.hoja-velo, .tutorial-capa--oscura');
  return Velo || null;
}

function Conectararrastrehojas(Componente) {
  if (typeof document === 'undefined' || Componente.Arrastrehojasactivo) return;
  Componente.Arrastrehojasactivo = true;

  let Hojaactual = null;
  let Veloactual = null;
  let Inicioy = 0;
  let Iniciox = 0;
  let Iniciotiempo = 0;
  let Desdetope = false;
  let Arrastrando = false;
  let Desplazamiento = 0;

  const Reiniciar = () => {
    Hojaactual = null;
    Veloactual = null;
    Arrastrando = false;
    Desplazamiento = 0;
  };

  document.addEventListener('touchstart', Evento => {
    if (!Evento.touches || Evento.touches.length !== 1) return;
    const Destino = Evento.target;
    if (!Destino || typeof Destino.closest !== 'function') return;
    if (Destino.closest('input, textarea, select')) return;
    const Hoja = Destino.closest('.mt-sheet, .tutorial-hoja');
    if (!Hoja) return;
    if (Componente.Estadocomponente.Soporteabierto && !Hoja.classList.contains('hoja') && !Hoja.classList.contains('tutorial-hoja')) return;

    const Enencabezado = Boolean(Destino.closest('.hoja-manija, .hoja-cabecera, .registro-cabecera'));
    if (!Enencabezado && Hoja.scrollTop > 0) return;

    const Toque = Evento.touches[0];
    Hojaactual = Hoja;
    Veloactual = Buscarvelohoja(Hoja);
    Inicioy = Toque.clientY;
    Iniciox = Toque.clientX;
    Iniciotiempo = Date.now();
    Desdetope = Enencabezado;
    Arrastrando = false;
    Desplazamiento = 0;
  }, { passive: true });

  document.addEventListener('touchmove', Evento => {
    if (!Hojaactual || !Evento.touches || Evento.touches.length !== 1) return;
    const Toque = Evento.touches[0];
    const Deltay = Toque.clientY - Inicioy;
    const Deltax = Math.abs(Toque.clientX - Iniciox);

    if (!Arrastrando) {
      if (Deltay <= 6) return;
      if (Deltax > Deltay || (!Desdetope && Hojaactual.scrollTop > 0)) {
        Reiniciar();
        return;
      }
      Arrastrando = true;
      Hojaactual.style.transition = 'none';
      if (Veloactual) Veloactual.style.transition = 'none';
    }

    Evento.preventDefault();
    Desplazamiento = Math.max(0, Deltay);
    Hojaactual.style.transform = 'translateY(' + Desplazamiento + 'px)';
    if (Veloactual) {
      Veloactual.style.opacity = String(Math.max(0.15, 1 - Desplazamiento / 320));
    }
  }, { passive: false });

  const Terminararrastre = () => {
    if (!Hojaactual) return;
    const Hoja = Hojaactual;
    const Velo = Veloactual;
    const Recorrido = Desplazamiento;
    const Activo = Arrastrando;
    const Duracion = Math.max(1, Date.now() - Iniciotiempo);
    const Velocidad = Recorrido / Duracion;
    Reiniciar();

    if (!Activo) return;
    const Debecerrar = Recorrido > 80 || (Recorrido > 32 && Velocidad > 0.45);
    if (Debecerrar) {
      Hoja.style.transition = 'transform .18s ease-out';
      Hoja.style.transform = 'translateY(100%)';
      if (Velo) {
        Velo.style.transition = 'opacity .18s ease-out';
        Velo.style.opacity = '0';
      }
      setTimeout(() => {
        Hoja.style.transition = '';
        Hoja.style.transform = '';
        if (Velo) {
          Velo.style.transition = '';
          Velo.style.opacity = '';
        }
        Cerrarhojadeslizada(Componente, Hoja);
      }, 170);
      return;
    }

    Hoja.style.transition = 'transform .2s cubic-bezier(.22,1,.36,1)';
    Hoja.style.transform = 'translateY(0)';
    if (Velo) {
      Velo.style.transition = 'opacity .2s ease-out';
      Velo.style.opacity = '';
    }
    setTimeout(() => {
      Hoja.style.transition = '';
      Hoja.style.transform = '';
      if (Velo) Velo.style.transition = '';
    }, 210);
  };

  document.addEventListener('touchend', Terminararrastre, { passive: true });
  document.addEventListener('touchcancel', Terminararrastre, { passive: true });
}
