// Controlador principal que organiza las pantallas, gestiona la sesión y une los módulos de la aplicación

class Aplicacionmitecho extends Componentebase {
  Raizreferencia = Crearreferencia();
  Desplazamientoreferencia = Crearreferencia();

  Estadocomponente = Estadobaseinicial();

  get Temaactual() { return Resolvertema(this.Estadocomponente.Temaelegido, this.Propiedades.Modo); }
  get Pestana() { return this.Estadocomponente.Pestana || (['inicio','ingresos','simulador','plan','ofertas'].includes(this.Propiedades.Pantallainicial) ? this.Propiedades.Pantallainicial : 'inicio'); }
  get Pantalla() { if (this.Estadocomponente.Pantalla) return this.Estadocomponente.Pantalla; const Pantalladato = this.Propiedades.Pantallainicial ?? 'splash'; if (Pantalladato === 'splash') return 'splash'; if (Pantalladato === 'login') return 'login'; return Pantalladato === 'onboarding' || Pantalladato === 'setup' ? 'setup' : 'app'; }
  get Cuestionariolisto() { return this.Estadocomponente.Cuestionariolisto ?? !['login', 'onboarding', 'setup', 'splash'].includes(this.Propiedades.Pantallainicial ?? 'splash'); }

  Almontar() {
    const Guardado = Cargardatosalmacenados();
    if (Guardado && typeof Guardado === 'object') {
      const Cambios = {};
      Camposalmacenados.forEach(Clave => { if (Clave in Guardado) Cambios[Clave] = Guardado[Clave]; });
      if (!Cambios.Ingresovista) Cambios.Ingresovista = 'dia';
      if (!Cambios.Registrotipo) Cambios.Registrotipo = 'ing';
      if (!Cambios.Simuladorpaso) Cambios.Simuladorpaso = 'form';
      this.Cambiarestado(Cambios);
      // Un invitado no puede quedar con la sesión de otra cuenta abierta: sus datos terminarían en esa cuenta
      if (Cambios.Invitado && typeof Estadosesionactual === 'function' && Estadosesionactual().Autenticado) Soltarsesionabierta();
    }
    this.Temporizadorportadauno = setTimeout(() => this.Cambiarestado({ Portadaentrando: true }), 80);
    this.Temporizadorportadados = setTimeout(() => {
      if (this.Pantalla === 'splash') {
        if (this.Estadocomponente.Ingresado && this.Cuestionariolisto) {
          this.Cambiarestado({ Pantalla: 'app', Pestana: 'inicio' });
        } else if (this.Estadocomponente.Ingresado && this.Estadocomponente.Invitado) {
          this.Cambiarestado({ Pantalla: 'setup', Portadarecogida: true });
        } else {
          this.Cambiarestado({ Pantalla: 'login', Portadarecogida: true });
        }
      }
    }, 2200);
    this.Aplicartema();
    Escuchartemasistema(this);
    this.target = this.Calcular().Preciotecho;
    this.Cambiarestado({ Mostrado: this.target });
    this.Reiniciarbarras();
    this.Sincronizarcuenta();
    // Conecta el botón atrás y las notificaciones nativas de Android
    window.__InstanciaApp = this;
    window.ManejarAtras = () => this.ManejadorBotonAtras();
    window.AbrirDestinoNotificacion = (Destino) => {
      if (Destino === 'ingresos') {
        this.Cambiarestado({
          Pantalla: 'app',
          Pestana: 'ingresos',
          Ingresovista: 'dia',
          Menu: false,
          Ayuda: false,
          Hoja: false,
          Registrotipo: 'ing',
          Diaseleccionado: 6,
          Panel: null
        });
      }
    };
    if (window.Puentenativo) {
      if (typeof window.Puentenativo.obtenerDestinoPendiente === 'function') {
        const DestinoPendiente = window.Puentenativo.obtenerDestinoPendiente();
        if (DestinoPendiente === 'ingresos') {
          setTimeout(() => {
            this.Cambiarestado({
              Pantalla: 'app',
              Pestana: 'ingresos',
              Ingresovista: 'dia',
              Menu: false,
              Ayuda: false,
              Hoja: false,
              Registrotipo: 'ing',
              Diaseleccionado: 6,
              Panel: null
            });
          }, 600);
        }
      }
      if (typeof window.Puentenativo.programarRecordatorioRacha === 'function') {
        const Rec = (Guardado && Guardado.Recordatorios) || this.Estadocomponente.Recordatorios || {};
        const Activo = Rec.Diario !== false;
        window.Puentenativo.programarRecordatorioRacha(Activo, Rec.Hora || '20:00');
      }
      if (typeof window.Puentenativo.actualizarEstadoEfectivo === 'function') {
        const Regs = this.Estadocomponente.Registros || [];
        const Rec = (Guardado && Guardado.Recordatorios) || this.Estadocomponente.Recordatorios || {};
        const Efectivopendiente = Regs.filter(E => !E.Consignado && E.Medio === 'Efectivo').reduce((Acc, E) => Acc + (E.Monto || 0), 0) + (this.Estadocomponente.Efectivoanterior || 0);
        window.Puentenativo.actualizarEstadoEfectivo(Rec.Efectivo !== false && Efectivopendiente > 0);
      }
    }
    // Tasas de la Superintendencia: primero las del celular y, si son de otro día, las nuevas de Supabase
    if (typeof Cargartasasmercado === 'function') Cargartasasmercado().then(Cambio => Cambio && this.Cambiarestado({ Tasasactualizadas: Date.now() })).catch(() => null);
  }

  // El botón atrás del celular cierra primero lo que esté encima; el orden completo está en Navegacionatras.js
  ManejadorBotonAtras() {
    Manejaratras.call(this);
  }

  // Al abrir la app con sesión guardada se avisa que hubo actividad y se traen Pro y la autorización desde el servidor
  async Sincronizarcuenta() {
    if (!this.Estadocomponente.Ingresado || this.Estadocomponente.Invitado || typeof Registraractividadapi !== 'function') return;
    const Resultado = await Registraractividadapi().catch(() => null);
    if (!Resultado || !Resultado.ok || !Resultado.datos) return;
    this.Cambiarestado({ Pro: Boolean(Resultado.datos.pro), Autorizacionversion: String(Resultado.datos.autorizacion || '') });
  }

  // El banner solo sale en las pantallas de la app, sin Pro y con la autorización dada. Con una ventana encima
  // se oculta, pero su espacio queda reservado para que la barra de abajo no salte al abrirla o cerrarla
  Actualizaranuncios() {
    if (typeof Sincronizarbanner !== 'function') return;
    const Estado = this.Estadocomponente;
    const Autorizado = typeof Versionpolitica === 'undefined' || Estado.Autorizacionversion === Versionpolitica;
    const Ventanaencima = Boolean(Estado.Hoja || Estado.Soporteabierto || Estado.Eliminacionabierta || Estado.Menu || Estado.Tipoviviendaabierto || Estado.Calculoabierto || Estado.Vinculacionpendiente);
    Sincronizarbanner(Boolean(Estado.Ingresado && this.Pantalla === 'app' && !Estado.Pro && Autorizado && Estado.Tutorialvisto && !Recorridoactual(this)) ? (Ventanaencima ? 'reservar' : 'ver') : 'nada');
  }

  Alactualizar(Propiedadesprevias, Estadopasado) {
    this.Aplicartema();
    this.Actualizaranuncios();
    Registrarnavegacion.call(this);
    if (window.Puentenativo && typeof window.Puentenativo.actualizarEstadoEfectivo === 'function') {
      const Regs = this.Estadocomponente.Registros || [];
      const Rec = this.Estadocomponente.Recordatorios || {};
      const Efectivopendiente = Regs.filter(E => !E.Consignado && E.Medio === 'Efectivo').reduce((Acc, E) => Acc + (E.Monto || 0), 0) + (this.Estadocomponente.Efectivoanterior || 0);
      window.Puentenativo.actualizarEstadoEfectivo(Rec.Efectivo !== false && Efectivopendiente > 0);
    }
    clearTimeout(this.Temporizadorguardado);
    this.Temporizadorguardado = setTimeout(() => Guardardatosalmacenados(this.Estadocomponente), 250);
    clearTimeout(this.Temporizadornube);
    this.Temporizadornube = setTimeout(() => {
      if (this.Estadocomponente.Ingresado && !this.Estadocomponente.Invitado && typeof Estadosesionactual === 'function' && Estadosesionactual().Autenticado) {
        Guardarperfilapi(Armarperfilnube(this.Estadocomponente)).catch(() => null);
      }
    }, 2000);
    const Auxiliar = this.Calcular().Preciotecho;
    // Al cambiar de pantalla la cifra se pone directo en su valor, así nunca queda un número de una animación cortada
    if (this.Pantallaanterior !== this.Pantalla) {
      this.Pantallaanterior = this.Pantalla;
      cancelAnimationFrame(this.Cuadroanimacion);
      this.target = Auxiliar;
      if (this.Estadocomponente.Mostrado !== Auxiliar) this.Cambiarestado({ Mostrado: Auxiliar });
    } else if (this.target !== undefined && Math.abs(Auxiliar - this.target) > 1) {
      this.Animarhacia(Auxiliar);
    }
    if (this.Estadocomponente.Ayudadesplazar) this.Bajarapregunta();
    Medirrecorrido(this);
    const Llave = this.Pestana + '|' + this.Estadocomponente.Simuladorpaso + '|' + this.Estadocomponente.Ingresovista;
    if (this.Clavenavegacion !== undefined && this.Clavenavegacion !== Llave) {
      if (this.Desplazamientoreferencia.Actual) this.Desplazamientoreferencia.Actual.scrollTop = 0;
      this.Clavenavegacion = Llave;
      this.Reiniciarbarras();
    }
    this.Clavenavegacion = Llave;
    Restaurardesplazamiento.call(this);
  }

  Aldesmontar() {
    clearTimeout(this.Temporizadorportadauno);
    clearTimeout(this.Temporizadorportadados);
    clearTimeout(this.Temporizadorguardado);
    clearTimeout(this.Temporizadornube);
    cancelAnimationFrame(this.Cuadroanimacion);
    clearTimeout(this.Temporizadoraviso);
    clearTimeout(this.Temporizadorbarras);
  }

  Reiniciarbarras() {
    if (this.Estadocomponente.Barrasvisibles) this.Cambiarestado({ Barrasvisibles: false });
    clearTimeout(this.Temporizadorbarras);
    this.Temporizadorbarras = setTimeout(() => this.Cambiarestado({ Barrasvisibles: true }), 60);
  }

  Aplicartema() {
    const Nodo = this.Raizreferencia.Actual;
    if (!Nodo) return;
    if (this.Clavetemaprevio !== this.Temaactual) {
      this.Clavetemaprevio = this.Temaactual;
      const Tema = Temasinterfaz[this.Temaactual] || Temasinterfaz.oscuro;
      for (const Clave in Tema) Nodo.style.setProperty('--' + Clave, Tema[Clave]);
    }
    const Pantallaactual = this.Pantalla;
    const Esportada = Pantallaactual === 'splash' && !this.Estadocomponente.Portadarecogida;
    const Esclaro = this.Temaactual === 'claro';
    const Superiorazul = Pantallaactual === 'splash' || Pantallaactual === 'login';
    const Colorestado = Superiorazul ? '#1E345B' : (Esclaro ? '#F3F3EE' : '#0B0C0A');
    const Estadooscuro = !Superiorazul && Esclaro;
    // Con la barra de pestañas a la vista, la barra del celular toma su color para que se vean como una sola
    const Conpestanas = Pantallaactual === 'app' && !this.Estadocomponente.Ayuda && !this.Estadocomponente.Panel;
    const Colornavegacion = Conpestanas ? (Temasinterfaz[this.Temaactual] || Temasinterfaz.oscuro).nav : (Esclaro ? '#F3F3EE' : '#0B0C0A');
    const Navegacionoscura = !Esportada && Esclaro;
    const Bloquearvertical = Superiorazul;
    if (typeof document !== 'undefined' && this.Colornavegacionprevio !== Colornavegacion) {
      this.Colornavegacionprevio = Colornavegacion;
      document.body.style.backgroundColor = Colornavegacion;
    }
    const Puente = typeof window !== 'undefined' ? window.Puentenativo : null;
    if (Puente && typeof Puente.aplicarBarras === 'function') {
      const Clavebarras = Colornavegacion + '|' + Estadooscuro + '|' + Navegacionoscura + '|' + Bloquearvertical;
      if (this.Clavebarrasprevia !== Clavebarras) {
        this.Clavebarrasprevia = Clavebarras;
        Puente.aplicarBarras(Colorestado, Estadooscuro, Colornavegacion, Navegacionoscura, Bloquearvertical);
      }
    }
    // Ninguna pantalla deja tomar capturas: desde el inicio de sesión ya hay datos de la persona
    const Protegida = true;
    if (Puente && typeof Puente.protegerPantalla === 'function' && this.Pantallaprotegida !== Protegida) {
      this.Pantallaprotegida = Protegida;
      Puente.protegerPantalla(Protegida);
    }
  }

  Animarhacia(Auxiliar) {
    const Desde = this.Estadocomponente.Mostrado ?? Auxiliar;
    this.target = Auxiliar;
    cancelAnimationFrame(this.Cuadroanimacion);
    if (this.Propiedades.Animaciones === false) {
      this.Cambiarestado({ Mostrado: Auxiliar });
      return;
    }
    const Comienzo = performance.now();
    const Paso = () => {
      const Pantalladato = Math.min(1, (performance.now() - Comienzo) / 650);
      const Avance = 1 - Math.pow(1 - Pantalladato, 3);
      this.Cambiarestado({ Mostrado: Desde + (Auxiliar - Desde) * Avance });
      if (Pantalladato < 1) this.Cuadroanimacion = requestAnimationFrame(Paso);
    };
    Paso();
  }

  Calcular(Estadoactual = this.Estadocomponente, Deudasreemplazo, Modalidadreemplazo) {
    const Permitido = Estadoactual;
    return Calcularcapacidad(Permitido, Deudasreemplazo, Modalidadreemplazo);
  }

  // Entrar y salir de una cuenta, o del modo sin cuenta, está en Sesionusuario.js y Sesioninvitado.js
  Iniciarsesionusuario(Correo, Nombresugerido, Perfilremoto, Metadatoscuenta) {
    if (this.Estadocomponente.Invitado) {
      Vincularcuentainvitado.call(this, Correo, Nombresugerido, Perfilremoto, Metadatoscuenta);
      return;
    }
    Entrarconcuenta.call(this, Correo, Nombresugerido, Perfilremoto, Metadatoscuenta, null);
  }

  // Singuardar se usa al borrar la cuenta, para que no quede una copia de los datos en el celular
  Cerrarsesionusuario(Singuardar) {
    Salirdesesion.call(this, Singuardar);
  }

  Entrarsincuenta() {
    Entrarcomoinvitado.call(this);
  }

  Perfilvalores(Calculo, Fichaseleccion, Oscuroactivo) {
    return Generarvaloresperfil.call(this, Calculo, Fichaseleccion, Oscuroactivo);
  }

  Entidadvalores(Calculo, Seleccion) {
    return Generarvaloresentidades.call(this, Calculo, Seleccion);
  }

  Valoresextra(Calculo, Configuracion, Seleccion) {
    return Generarvaloresadicionales.call(this, Calculo, Configuracion, Seleccion);
  }

  Cuestionariovalores(Calculo, Fichaseleccion) {
    return Generarvaloressetup.call(this, Calculo, Fichaseleccion);
  }

  Aviso(Mensaje) {
    clearTimeout(this.Temporizadoraviso);
    this.Cambiarestado({ Aviso: Mensaje, Avisovisible: true });
    this.Temporizadoraviso = setTimeout(() => this.Cambiarestado({ Avisovisible: false }), 2600);
  }

  Ir(Pestana) {
    this.Cambiarestado({
      Pestana,
      Simuladorpaso: Pestana === 'simulador' ? (this.Estadocomponente.Simuladorpaso || 'form') : this.Estadocomponente.Simuladorpaso,
      ...(Pestana === 'ingresos' ? { Ingresovista: this.Estadocomponente.Ingresovista || 'dia', Registrotipo: this.Estadocomponente.Registrotipo || 'ing' } : {})
    });
  }

  Fijardeuda(Identificador, Cambios) {
    this.Cambiarestado(Estadoactual => ({ Deudas: Estadoactual.Deudas.map(Deuda => Deuda.id === Identificador ? { ...Deuda, ...Cambios } : Deuda) }));
  }

  Editardeuda(Identificador) {
    const Deuda = this.Estadocomponente.Deudas.find(Opcion => Opcion.id === Identificador);
    if (!Deuda) return;
    const Partes = Deuda.Nombreitem.split(' · ');
    const Nombrebase = Partes[0];
    const Entidad = Partes[1] || '';
    const Tipocoincide = Tiposdeuda.find(Auxiliar => Auxiliar === Nombrebase || Nombrescortosdeuda[Auxiliar] === Deuda.Corto);
    const Tipo = Tipocoincide || (Tiposdeuda.includes(Nombrebase) ? Nombrebase : 'Otro egreso fijo');
    const Nombre = Tipo === 'Otro egreso fijo' ? Nombrebase : '';
    this.Cambiarestado({
      Hoja: true,
      Hojamenu: false,
      Hojafecha: null,
      Hojatipo: 'deuda',
      Hojafrecuencia: 'fijo',
      Deudaeditandoid: Identificador,
      Formulariodeuda: { Tipo, Cuota: Deuda.Cuota, Saldo: Deuda.Saldo || 0, Entidad: Deuda.Entidad || Entidad, Nombre },
      Formularioerror: ''
    });
  }

  Eliminardeuda(Identificador) {
    const Deuda = this.Estadocomponente.Deudas.find(Opcion => Opcion.id === Identificador);
    if (!Deuda) return;
    if (typeof window !== 'undefined' && window.confirm && !window.confirm('¿Eliminar la deuda “' + Deuda.Nombreitem + '”?')) return;
    this.Cambiarestado(Estadoprevio => ({
      Deudas: Estadoprevio.Deudas.filter(Opcion => Opcion.id !== Identificador),
      Hoja: Estadoprevio.Deudaeditandoid === Identificador ? false : Estadoprevio.Hoja,
      Deudaeditandoid: Estadoprevio.Deudaeditandoid === Identificador ? null : Estadoprevio.Deudaeditandoid
    }));
    this.Aviso('Deuda “' + Deuda.Nombreitem + '” eliminada.');
  }

  Abrirpro(Mensaje) {
    if (Mensaje) this.Aviso(Mensaje);
  }

  async Generarpdf() {
    if (this.Estadocomponente.Desbloqueadopdf) {
      this.Cambiarestado({ Reportelisto: true });
      Generarcertificadopdf(this.Estadocomponente, this.Calcular(), Mensaje => this.Aviso(Mensaje));
      return;
    }
    const Vistos = Number(this.Estadocomponente.Anunciospdf || 0);
    this.Aviso('Para descargar el reporte en PDF debes ver 3 videos cortos (llevas ' + Vistos + '/3). Cargando video…');
    const Resultado = typeof Verrecompensa === 'function' ? await Verrecompensa() : { ok: true };
    if (Resultado && Resultado.ok) {
      const Nuevocount = Vistos + 1;
      if (Nuevocount >= 3) {
        this.Cambiarestado({ Desbloqueadopdf: true, Anunciospdf: 3, Reportelisto: true });
        this.Aviso('¡Descarga de PDF desbloqueada!');
        Generarcertificadopdf(this.Estadocomponente, this.Calcular(), Mensaje => this.Aviso(Mensaje));
      } else {
        const Faltan = 3 - Nuevocount;
        this.Cambiarestado({ Anunciospdf: Nuevocount });
        this.Aviso('Video ' + Nuevocount + ' de 3 completado. Mira ' + Faltan + (Faltan === 1 ? ' video más' : ' videos más') + ' para descargar el PDF.');
      }
    } else {
      this.Aviso(Resultado && Resultado.error ? Resultado.error : 'No se pudo cargar el video. Intenta de nuevo.');
    }
  }

  Valoresvista() {
    return Generarvalorespantallas.call(this);
  }
}

(function Comienzo() {
  const Plantilla = document.getElementById('mt-template');
  if (Plantilla && typeof Plantillaperfil !== 'undefined' && typeof Plantillaprincipal !== 'undefined' && typeof Plantillamodales !== 'undefined') {
    Plantilla.innerHTML = '<div class="m1" ref="{{ Raizreferencia }}"><div class="m2"><span>MITECHO COLOMBIA</span><span>·</span><span>VERSIÓN OFICIAL 2026</span></div><div class="m3"><div class="m4"></div><div style="position:absolute;top:0;left:0;right:0;height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 34px;font:600 15px \'Familjen Grotesk\',sans-serif;color:{{ Estadotinta }};z-index:30;background:{{ Estadofondo }};transition:background .25s ease-out"><span>9:41</span><div class="m5"><div class="m6"><div class="m7"></div><div class="m8"></div><div class="m9"></div><div class="ma"></div></div><div class="mb"><div class="mc"></div></div></div></div>'
      + Plantillaperfil
      + Plantillaprincipal
      + Plantillamodales
      // Los paneles van fuera de la pantalla principal para que no se corran cuando ella está desplazada
      + (typeof Plantillatasas !== 'undefined' ? Plantillatasas : '')
      + (typeof Plantilladeudas !== 'undefined' ? Plantilladeudas : '')
      + (typeof Plantillareporte !== 'undefined' ? Plantillareporte : '')
      + (typeof Plantillasubsidios !== 'undefined' ? Plantillasubsidios : '')
      + (typeof Plantillaautorizacion !== 'undefined' ? Plantillaautorizacion : '')
      + (typeof Plantillaeliminacion !== 'undefined' ? Plantillaeliminacion : '')
      + (typeof Plantillaavisoinvitado !== 'undefined' ? Plantillaavisoinvitado : '')
      + (typeof Plantillatipovivienda !== 'undefined' ? Plantillatipovivienda : '')
      + (typeof Plantillacalculo !== 'undefined' ? Plantillacalculo : '')
      + (typeof Plantillatutorial !== 'undefined' ? Plantillatutorial : '')
      + '</div></div>';
  }
  // Nada de la app se puede copiar ni cortar; pegar sí, para escribir cifras más rápido
  document.addEventListener('copy', Evento => Evento.preventDefault());
  document.addEventListener('cut', Evento => Evento.preventDefault());
  const Parametrosurl = new URLSearchParams(location.search);
  Motorvista.Montar(Aplicacionmitecho, document.getElementById('app'), document.getElementById('mt-template'), {
    Pantallainicial: Parametrosurl.get('pantalla') || 'splash',
    Modo: Parametrosurl.get('modo') === 'claro' ? 'claro' : 'oscuro',
    Animaciones: Parametrosurl.get('animaciones') !== 'no'
  });
})();
