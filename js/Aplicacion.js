// Componente raíz de MiTecho: ciclo de vida, barras del celular, sincronización y montaje

class Aplicacionmitecho extends Componentebase {
  Raizreferencia = Crearreferencia();
  Desplazamientoreferencia = Crearreferencia();
  Estadocomponente = Estadobaseinicial();

  get Temaactual() {
    return Resolvertema(this.Estadocomponente.Temaelegido, this.Propiedades.Modo);
  }

  get Pestana() {
    if (this.Estadocomponente.Pestana) return this.Estadocomponente.Pestana;
    if (['inicio', 'ingresos', 'simulador', 'plan', 'ofertas'].includes(this.Propiedades.Pantallainicial)) {
      return this.Propiedades.Pantallainicial;
    }
    return 'inicio';
  }

  get Pantalla() {
    if (this.Estadocomponente.Pantalla) return this.Estadocomponente.Pantalla;
    const Pantalladato = this.Propiedades.Pantallainicial ?? 'splash';
    if (Pantalladato === 'splash') return 'splash';
    if (Pantalladato === 'login') return 'login';
    if (Pantalladato === 'onboarding' || Pantalladato === 'setup') return 'setup';
    return 'app';
  }

  get Cuestionariolisto() {
    if (this.Estadocomponente.Cuestionariolisto !== undefined && this.Estadocomponente.Cuestionariolisto !== null) {
      return this.Estadocomponente.Cuestionariolisto;
    }
    return !['login', 'onboarding', 'setup', 'splash'].includes(this.Propiedades.Pantallainicial ?? 'splash');
  }

  Almontar() {
    const Guardado = Cargardatosalmacenados();
    if (Guardado && typeof Guardado === 'object') {
      const Cambios = {};
      Camposalmacenados.forEach(Clave => {
        if (Clave in Guardado) Cambios[Clave] = Guardado[Clave];
      });
      if (!Cambios.Ingresovista) Cambios.Ingresovista = 'dia';
      if (!Cambios.Registrotipo) Cambios.Registrotipo = 'ing';
      if (!Cambios.Simuladorpaso) Cambios.Simuladorpaso = 'form';
      this.Cambiarestado(Cambios);
      if (Cambios.Invitado && typeof Estadosesionactual === 'function' && Estadosesionactual().Autenticado) {
        Soltarsesionabierta();
      }
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
    this.Metaanimacion = this.Calcular().Preciotecho;
    this.Cambiarestado({ Mostrado: this.Metaanimacion });
    this.Reiniciarbarras();
    this.Sincronizarcuenta();
    Conectarnotificacionesandroid(this, Guardado);
    if (typeof Conectararrastrehojas === 'function') Conectararrastrehojas(this);
    if (typeof Cargartasasmercado === 'function') {
      Cargartasasmercado().then(Cambio => Cambio && this.Cambiarestado({ Tasasactualizadas: Date.now() })).catch(() => null);
    }
  }

  Manejadorbotonatras() {
    Manejaratras.call(this);
  }

  async Sincronizarcuenta() {
    if (!this.Estadocomponente.Ingresado || this.Estadocomponente.Invitado || typeof Registraractividadapi !== 'function') return;
    const Resultado = await Registraractividadapi().catch(() => null);
    if (!Resultado || !Resultado.ok || !Resultado.datos) return;
    this.Cambiarestado({ Pro: Boolean(Resultado.datos.pro), Autorizacionversion: String(Resultado.datos.autorizacion || '') });
  }

  Actualizaranuncios() {
    if (typeof Sincronizarbanner !== 'function') return;
    const Estado = this.Estadocomponente;
    const Autorizado = typeof Versionpolitica === 'undefined' || Estado.Autorizacionversion === Versionpolitica;
    const Ventanaencima = Boolean(
      Estado.Hoja || Estado.Soporteabierto || Estado.Eliminacionabierta || Estado.Menu ||
      Estado.Tipoviviendaabierto || Estado.Calculoabierto || Estado.Vinculacionpendiente ||
      Estado.Perfildato || Estado.Avisoinvitado
    );
    const Modoventana = Ventanaencima ? 'reservar' : 'ver';
    Sincronizarbanner(Boolean(Estado.Ingresado && this.Pantalla === 'app' && !Estado.Pro && Autorizado && Estado.Tutorialvisto && !Recorridoactual(this)) ? Modoventana : 'nada');
  }

  Alactualizar() {
    this.Aplicartema();
    this.Actualizaranuncios();
    Registrarnavegacion.call(this);
    Sincronizarefectivonativo(this);
    clearTimeout(this.Temporizadorguardado);
    this.Temporizadorguardado = setTimeout(() => Guardardatosalmacenados(this.Estadocomponente), 250);
    clearTimeout(this.Temporizadornube);
    this.Temporizadornube = setTimeout(() => {
      if (this.Estadocomponente.Ingresado && !this.Estadocomponente.Invitado && typeof Estadosesionactual === 'function' && Estadosesionactual().Autenticado) {
        Guardarperfilapi(Armarperfilnube(this.Estadocomponente)).catch(() => null);
      }
    }, 2000);
    const Auxiliar = this.Calcular().Preciotecho;
    if (this.Pantallaanterior !== this.Pantalla) {
      this.Pantallaanterior = this.Pantalla;
      cancelAnimationFrame(this.Cuadroanimacion);
      this.Metaanimacion = Auxiliar;
      if (this.Estadocomponente.Mostrado !== Auxiliar) this.Cambiarestado({ Mostrado: Auxiliar });
    } else if (this.Metaanimacion !== undefined && Math.abs(Auxiliar - this.Metaanimacion) > 1) {
      this.Animarhacia(Auxiliar);
    }
    if (this.Estadocomponente.Ayudadesplazar) this.Bajarapregunta();
    const Llave = this.Pestana + '|' + this.Estadocomponente.Simuladorpaso + '|' + this.Estadocomponente.Ingresovista;
    if (this.Clavenavegacion !== undefined && this.Clavenavegacion !== Llave) {
      if (this.Desplazamientoreferencia.Actual) this.Desplazamientoreferencia.Actual.scrollTop = 0;
      this.Clavenavegacion = Llave;
      this.Reiniciarbarras();
    }
    this.Clavenavegacion = Llave;
    Restaurardesplazamiento.call(this);
    Medirrecorrido(this);
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
    const Fondobase = Esclaro ? '#F3F3EE' : '#0B0C0A';
    const Colorestado = Superiorazul ? '#1E345B' : Fondobase;
    const Estadooscuro = !Superiorazul && Esclaro;
    const Conpestanas = Pantallaactual === 'app' && !this.Estadocomponente.Ayuda && !this.Estadocomponente.Panel;
    const Colornavegacion = Conpestanas ? (Temasinterfaz[this.Temaactual] || Temasinterfaz.oscuro).nav : Fondobase;
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
    if (Puente && typeof Puente.protegerPantalla === 'function' && !this.Pantallaprotegida) {
      this.Pantallaprotegida = true;
      Puente.protegerPantalla(true);
    }
  }

  Animarhacia(Auxiliar) {
    const Desde = this.Estadocomponente.Mostrado ?? Auxiliar;
    this.Metaanimacion = Auxiliar;
    cancelAnimationFrame(this.Cuadroanimacion);
    if (this.Propiedades.Animaciones === false) {
      this.Cambiarestado({ Mostrado: Auxiliar });
      return;
    }
    const Comienzo = performance.now();
    const Paso = () => {
      const Avancetiempo = Math.min(1, (performance.now() - Comienzo) / 650);
      const Avance = 1 - Math.pow(1 - Avancetiempo, 3);
      this.Cambiarestado({ Mostrado: Desde + (Auxiliar - Desde) * Avance });
      if (Avancetiempo < 1) this.Cuadroanimacion = requestAnimationFrame(Paso);
    };
    Paso();
  }

  Calcular(Estadoactual = this.Estadocomponente, Deudasreemplazo, Modalidadreemplazo) {
    return Calcularcapacidad(Estadoactual, Deudasreemplazo, Modalidadreemplazo);
  }

  Iniciarsesionusuario(Correo, Nombresugerido, Perfilremoto, Metadatoscuenta) {
    if (this.Estadocomponente.Invitado) {
      Vincularcuentainvitado.call(this, Correo, Nombresugerido, Perfilremoto, Metadatoscuenta);
      return;
    }
    Entrarconcuenta.call(this, Correo, Nombresugerido, Perfilremoto, Metadatoscuenta, null);
  }

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
    return Generarvalorescuestionario.call(this, Calculo, Fichaseleccion);
  }

  Aviso(Mensaje) {
    clearTimeout(this.Temporizadoraviso);
    this.Cambiarestado({ Aviso: Mensaje, Avisovisible: true });
    this.Temporizadoraviso = setTimeout(() => this.Cambiarestado({ Avisovisible: false }), 2600);
  }

  Ir(Pestana) {
    const Extraingresos = Pestana === 'ingresos'
      ? { Ingresovista: this.Estadocomponente.Ingresovista || 'dia', Registrotipo: this.Estadocomponente.Registrotipo || 'ing' }
      : {};
    this.Cambiarestado({
      Pestana,
      Simuladorpaso: Pestana === 'simulador' ? (this.Estadocomponente.Simuladorpaso || 'form') : this.Estadocomponente.Simuladorpaso,
      ...Extraingresos
    });
  }

  Fijardeuda(Identificador, Cambios) {
    this.Cambiarestado(Estadoactual => ({
      Deudas: Estadoactual.Deudas.map(Deuda => Deuda.id === Identificador ? { ...Deuda, ...Cambios } : Deuda)
    }));
  }

  Editardeuda(Identificador) {
    Editardeudaactiva.call(this, Identificador);
  }

  Eliminardeuda(Identificador) {
    Eliminardeudaactiva.call(this, Identificador);
  }

  Abrirpro(Mensaje) {
    if (Mensaje) this.Aviso(Mensaje);
  }

  Generarpdf() {
    return Desbloquearygenerarpdf.call(this);
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
  document.addEventListener('copy', Evento => Evento.preventDefault());
  document.addEventListener('cut', Evento => Evento.preventDefault());
  const Parametrosurl = new URLSearchParams(location.search);
  Motorvista.Montar(Aplicacionmitecho, document.getElementById('app'), document.getElementById('mt-template'), {
    Pantallainicial: Parametrosurl.get('pantalla') || 'splash',
    Modo: Parametrosurl.get('modo') === 'claro' ? 'claro' : 'oscuro',
    Animaciones: Parametrosurl.get('animaciones') !== 'no'
  });
})();
