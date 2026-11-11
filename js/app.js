// Controlador principal que organiza las pantallas, gestiona la sesión y une los módulos de la aplicación

class Aplicacionmitecho extends Componentebase {
  Raizreferencia = Crearreferencia();
  Desplazamientoreferencia = Crearreferencia();

  Estadocomponente = Estadobaseinicial();

  get Temaactual() { return this.Estadocomponente.Temaelegido || this.Propiedades.Modo || 'oscuro'; }
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
    }
    this.Temporizadorportadauno = setTimeout(() => this.Cambiarestado({ Portadaentrando: true }), 80);
    this.Temporizadorportadados = setTimeout(() => {
      if (this.Pantalla === 'splash') {
        if (this.Estadocomponente.Ingresado && this.Cuestionariolisto) {
          this.Cambiarestado({ Pantalla: 'app', Pestana: 'inicio' });
        } else {
          this.Cambiarestado({ Pantalla: 'login', Portadarecogida: true });
        }
      }
    }, 2200);
    this.Aplicartema();
    this.target = this.Calcular().Preciotecho;
    this.Cambiarestado({ Mostrado: this.target });
    this.Reiniciarbarras();
    this.Sincronizarcuenta();
    // Tasas de la Superintendencia: primero las del celular y, si son de otro día, las nuevas de Supabase
    if (typeof Cargartasasmercado === 'function') Cargartasasmercado().then(Cambio => Cambio && this.Cambiarestado({ Tasasactualizadas: Date.now() })).catch(() => null);
  }

  // Al abrir la app con sesión guardada se avisa que hubo actividad y se traen Pro y la autorización desde el servidor
  async Sincronizarcuenta() {
    if (!this.Estadocomponente.Ingresado || typeof Registraractividadapi !== 'function') return;
    const Resultado = await Registraractividadapi().catch(() => null);
    if (!Resultado || !Resultado.ok || !Resultado.datos) return;
    this.Cambiarestado({ Pro: Boolean(Resultado.datos.pro), Autorizacionversion: String(Resultado.datos.autorizacion || '') });
  }

  // El banner solo sale en las pantallas de la app, sin Pro, con la autorización dada y sin ventanas abiertas encima
  Actualizaranuncios() {
    if (typeof Sincronizarbanner !== 'function') return;
    const Estado = this.Estadocomponente;
    const Autorizado = typeof Versionpolitica === 'undefined' || Estado.Autorizacionversion === Versionpolitica;
    Sincronizarbanner(Boolean(Estado.Ingresado && this.Pantalla === 'app' && !Estado.Pro && Autorizado && Estado.Tutorialvisto && !Recorridoactual(this) && !Estado.Hoja && !Estado.Soporteabierto && !Estado.Eliminacionabierta && !Estado.Menu));
  }

  Alactualizar(Propiedadesprevias, Estadopasado) {
    this.Aplicartema();
    this.Actualizaranuncios();
    clearTimeout(this.Temporizadorguardado);
    this.Temporizadorguardado = setTimeout(() => Guardardatosalmacenados(this.Estadocomponente), 250);
    clearTimeout(this.Temporizadornube);
    this.Temporizadornube = setTimeout(() => {
      if (this.Estadocomponente.Ingresado && typeof Estadosesionactual === 'function' && Estadosesionactual().Autenticado) {
        Guardarperfilapi({
          nombre: this.Estadocomponente.Nombre || '',
          edad: this.Estadocomponente.Edad,
          ciudad: this.Estadocomponente.Ciudad || 'Bogotá',
          tipo_ingreso: this.Estadocomponente.Tipo || 'fijo',
          fijo: this.Estadocomponente.Fijo || 0,
          variable: this.Estadocomponente.Variable || 0,
          ahorro: this.Estadocomponente.Ahorro || 0,
          ahorro_mes: this.Estadocomponente.Ahorromes || 0,
          afiliado_caja: !!this.Estadocomponente.Caja,
          caja_nombre: this.Estadocomponente.Cajanombre || '',
          sisben: !!this.Estadocomponente.Sisben,
          sisben_grupo: this.Estadocomponente.Sisbengrupo || 'A1-C8',
          modalidad: this.Estadocomponente.Modalidadelegida || 'vis',
          tasa_tipo: this.Estadocomponente.Tasatipo || 'pesos',
          plazo_anios: this.Estadocomponente.Plazoelegido || 20,
          pareja: !!this.Estadocomponente.Pareja,
          pareja_nombre: this.Estadocomponente.Parejanombre || '',
          pareja_ing: this.Estadocomponente.Parejaingreso || 0,
          pareja_deu: this.Estadocomponente.Parejadeudas || 0
        }).catch(() => null);
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
  }

  // Baja la pantalla de Ayuda hasta la pregunta que abrió un botón "Entender"
  Bajarapregunta() {
    this.Cambiarestado({ Ayudadesplazar: false });
    setTimeout(() => {
      // La pregunta abierta es el único bloque que, además del botón, muestra su contenido
      const Pregunta = [...document.querySelectorAll('.m6f')].find(Bloque => Bloque.children.length > 1);
      if (Pregunta) Pregunta.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 80);
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
    const Colorestado = Superiorazul ? '#1E345B' : (Esclaro ? '#F3F2EC' : '#0B0C0A');
    const Estadooscuro = !Superiorazul && Esclaro;
    const Colornavegacion = Esclaro ? '#F3F2EC' : '#0B0C0A';
    const Navegacionoscura = !Esportada && Esclaro;
    const Bloquearvertical = Superiorazul;
    if (typeof document !== 'undefined' && this.Colornavegacionprevio !== Colornavegacion) {
      this.Colornavegacionprevio = Colornavegacion;
      document.body.style.backgroundColor = Colornavegacion;
    }
    const Puente = typeof window !== 'undefined' ? window.Puentenativo : null;
    if (Puente && typeof Puente.aplicarBarras === 'function') {
      const Clavebarras = Estadooscuro + '|' + Navegacionoscura + '|' + Bloquearvertical;
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

  // La simulación con pareja o familia es de Pro: sin Pro se calcula solo con el titular aunque haya datos de pareja guardados
  Calcular(Estadoactual = this.Estadocomponente, Deudasreemplazo, Modalidadreemplazo) {
    const Permitido = Estadoactual.Pro || !Estadoactual.Pareja ? Estadoactual : { ...Estadoactual, Pareja: false };
    return Calcularcapacidad(Permitido, Deudasreemplazo, Modalidadreemplazo);
  }

  Iniciarsesionusuario(Correo, Nombresugerido, Perfilremoto, Metadatoscuenta) {
    const Base = Estadobaseinicial();
    const Guardadolocal = typeof Cargardatosusuario === 'function' ? Cargardatosusuario(Correo) : null;
    if (Guardadolocal && typeof Guardadolocal === 'object') {
      Camposalmacenados.forEach(Clave => {
        if (Clave in Guardadolocal) Base[Clave] = Guardadolocal[Clave];
      });
    }
    if (Perfilremoto && typeof Perfilremoto === 'object') {
      Base.Nombre = Perfilremoto.nombre || Base.Nombre || Nombresugerido || '';
      Base.Edad = Perfilremoto.edad ?? Base.Edad;
      Base.Ciudad = Perfilremoto.ciudad || Base.Ciudad || 'Bogotá';
      Base.Tipo = Perfilremoto.tipo_ingreso || Base.Tipo || 'fijo';
      Base.Fijo = Perfilremoto.fijo ?? Base.Fijo;
      Base.Variable = Perfilremoto.variable ?? Base.Variable;
      Base.Ahorro = Perfilremoto.ahorro ?? Base.Ahorro;
      Base.Ahorromes = Perfilremoto.ahorro_mes ?? Base.Ahorromes;
      Base.Caja = Perfilremoto.afiliado_caja ?? Base.Caja;
      Base.Cajanombre = Perfilremoto.caja_nombre || Base.Cajanombre || '';
      Base.Sisben = Perfilremoto.sisben ?? Base.Sisben;
      Base.Sisbengrupo = Perfilremoto.sisben_grupo || Base.Sisbengrupo || 'A1-C8';
      Base.Modalidadelegida = Perfilremoto.modalidad || Base.Modalidadelegida || 'vis';
      Base.Tasatipo = Perfilremoto.tasa_tipo || Base.Tasatipo || 'pesos';
      Base.Plazoelegido = Perfilremoto.plazo_anios ?? Base.Plazoelegido;
      Base.Pareja = Perfilremoto.pareja ?? Base.Pareja;
      Base.Parejanombre = Perfilremoto.pareja_nombre || Base.Parejanombre || '';
      Base.Parejaingreso = Perfilremoto.pareja_ing ?? Base.Parejaingreso;
      Base.Parejadeudas = Perfilremoto.pareja_deu ?? Base.Parejadeudas;
      Base.Cuestionariolisto = true;
    } else if (!Base.Nombre && Nombresugerido) {
      Base.Nombre = Nombresugerido;
    }
    Base.Correo = Correo || '';
    // Pro lo marca el servidor (después Google Play Billing); lo guardado en el celular no cuenta
    Base.Pro = Boolean(Metadatoscuenta && Metadatoscuenta.pro);
    Base.Metodoingreso = Metadatoscuenta && Metadatoscuenta.provider === 'google' ? 'google' : 'correo';
    Base.Ingresado = true;
    // Si la cuenta todavía no autorizó la versión vigente de la política, la ventana de autorización sale sola
    const Autorizacion = Metadatoscuenta && Metadatoscuenta.autorizacion;
    Base.Autorizacionversion = Autorizacion && Autorizacion.version ? String(Autorizacion.version) : '';
    Base.Temaelegido = this.Estadocomponente.Temaelegido || Base.Temaelegido || 'oscuro';
    Base.Portadaentrando = true;
    Base.Portadarecogida = true;
    Base.Correoabierto = false;
    Base.Ingresoclave = '';
    Base.Ingresoclaveconfirmar = '';
    Base.Ingresoerror = '';
    Base.Ingresoaviso = '';
    Base.Ingresoexitomensaje = '';
    Base.Pantalla = Base.Cuestionariolisto ? 'app' : 'setup';
    Base.Pestana = 'inicio';
    this.Cambiarestado(Base);
    Guardardatosalmacenados(Base);
    this.Aviso('Sesión iniciada con ' + (Base.Nombre || Correo) + '.');
    // El servidor manda la bienvenida solo la primera vez que la cuenta entra; las demás veces no hace nada
    if (typeof Enviarbienvenidaapi === 'function') Enviarbienvenidaapi().catch(() => null);
  }

  // Singuardar se usa al borrar la cuenta, para que no quede una copia de los datos en el celular
  Cerrarsesionusuario(Singuardar) {
    if (!Singuardar && this.Estadocomponente.Ingresado && this.Estadocomponente.Correo) {
      Guardardatosalmacenados(this.Estadocomponente);
    }
    if (typeof Cerrarsesionapi === 'function') {
      Cerrarsesionapi().catch(() => null);
    }
    Borrardatosalmacenados();
    const Limpio = Estadobaseinicial();
    Limpio.Temaelegido = this.Estadocomponente.Temaelegido || 'oscuro';
    Limpio.Pantalla = 'login';
    Limpio.Portadaentrando = true;
    Limpio.Portadarecogida = true;
    Limpio.Ingresado = false;
    this.Cambiarestado(Limpio);
    this.Aviso('Sesión cerrada.');
  }

  Iniciosesion(Via) {
    this.Cambiarestado({
      Ingresado: true,
      Pantalla: this.Cuestionariolisto ? 'app' : 'setup',
      Pestana: 'inicio',
      Correoabierto: false,
      Ingresoerror: ''
    });
    this.Aviso('Sesión iniciada con ' + Via + '.');
  }

  Perfilvalores(Calculo, Fichaseleccion, Oscuroactivo) {
    return Generarvaloresperfil.call(this, Calculo, Fichaseleccion, Oscuroactivo);
  }

  Entidadvalores(Calculo, Seleccion) {
    return Generarvaloresentidades.call(this, Calculo, Seleccion);
  }

  Valoresextra(Calculo, Configuracion, Seleccion, Contexto) {
    return Generarvaloresadicionales.call(this, Calculo, Configuracion, Seleccion, Contexto);
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
    this.Cambiarestado({ Panel: 'pro', Menu: false });
    if (Mensaje) this.Aviso(Mensaje);
  }

  Generarpdf() {
    if (!this.Estadocomponente.Pro) {
      this.Abrirpro('El reporte PDF de tu simulación es parte de MiTecho Pro.');
      return;
    }
    Generarcertificadopdf(this.Estadocomponente, this.Calcular(), Mensaje => this.Aviso(Mensaje));
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
      + (typeof Plantillatasas !== 'undefined' ? Plantillatasas : '')
      + Plantillaprincipal
      + Plantillamodales
      + (typeof Plantillaautorizacion !== 'undefined' ? Plantillaautorizacion : '')
      + (typeof Plantillaeliminacion !== 'undefined' ? Plantillaeliminacion : '')
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
