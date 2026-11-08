// Controlador principal que organiza las pantallas, gestiona la sesión y une los módulos de la aplicación

class Component extends MTComponent {
  rootRef = createRef();
  scrollRef = createRef();
  obRef = createRef();

  state = Estadobaseinicial();

  get T() { return this.state.theme || this.props.modo || 'oscuro'; }
  get tab() { return this.state.tab || (['inicio','ingresos','simulador','plan','ofertas'].includes(this.props.pantallaInicial) ? this.props.pantallaInicial : 'inicio'); }
  get screen() { if (this.state.screen) return this.state.screen; const p = this.props.pantallaInicial ?? 'splash'; if (p === 'splash') return 'splash'; if (p === 'login') return 'login'; return p === 'onboarding' || p === 'setup' ? p : 'app'; }
  get setupDone() { return this.state.setupDone ?? !['login', 'onboarding', 'setup', 'splash'].includes(this.props.pantallaInicial ?? 'splash'); }
  afterWelcome() { this.setState(this.setupDone ? { screen: 'app', tab: 'inicio' } : { screen: 'setup', setup: { ...this.state.setup, step: 0, err: '' } }); }
  get onboarding() { return this.screen === 'onboarding'; }

  componentDidMount() {
    const saved = Cargardatosalmacenados();
    if (saved && typeof saved === 'object') {
      const patch = {};
      Camposalmacenados.forEach(k => { if (k in saved) patch[k] = saved[k]; });
      if (!patch.ingView) patch.ingView = 'dia';
      if (!patch.regKind) patch.regKind = 'ing';
      if (!patch.simStep) patch.simStep = 'form';
      this.setState(patch);
    }
    this.sp1 = setTimeout(() => this.setState({ splashIn: true }), 80);
    this.sp2 = setTimeout(() => {
      if (this.screen === 'splash') {
        if (this.state.logged && this.setupDone) {
          this.setState({ screen: 'app', tab: 'inicio' });
        } else {
          this.setState({ screen: 'login', splashRetracted: true });
        }
      }
    }, 2200);
    this.applyTheme();
    this.target = this.calc().precio;
    this.setState({ shown: this.target });
    this.kickBars();
  }

  componentDidUpdate(pp, ps) {
    this.applyTheme();
    clearTimeout(this.saveT);
    this.saveT = setTimeout(() => Guardardatosalmacenados(this.state), 250);
    clearTimeout(this.cloudT);
    this.cloudT = setTimeout(() => {
      if (this.state.logged && typeof EstadoSesionActual === 'function' && EstadoSesionActual().autenticado) {
        GuardarPerfilApi({
          nombre: this.state.nombre || '',
          edad: this.state.edad,
          ciudad: this.state.ciudad || 'Bogotá',
          tipo_ingreso: this.state.tipo || 'fijo',
          fijo: this.state.fijo || 0,
          variable: this.state.variable || 0,
          ahorro: this.state.ahorro || 0,
          ahorro_mes: this.state.ahorroMes || 0,
          afiliado_caja: !!this.state.caja,
          caja_nombre: this.state.cajaNombre || '',
          sisben: !!this.state.sisben,
          sisben_grupo: this.state.sisbenGrupo || 'A1-C8',
          modalidad: this.state.mod || 'vis',
          tasa_tipo: this.state.rate || 'pesos',
          plazo_anios: this.state.term || 20,
          pareja: !!this.state.pareja,
          pareja_nombre: this.state.parejaNombre || '',
          pareja_ing: this.state.parejaIng || 0,
          pareja_deu: this.state.parejaDeu || 0
        }).catch(() => null);
      }
    }, 2000);
    const t = this.calc().precio;
    if (this.target !== undefined && Math.abs(t - this.target) > 1) this.animateTo(t);
    const key = this.tab + '|' + this.state.simStep + '|' + this.state.ingView;
    if (this.navKey !== undefined && this.navKey !== key) {
      if (this.scrollRef.current) this.scrollRef.current.scrollTop = 0;
      this.navKey = key;
      this.kickBars();
    }
    this.navKey = key;
  }

  componentWillUnmount() {
    clearTimeout(this.sp1);
    clearTimeout(this.sp2);
    clearTimeout(this.saveT);
    clearTimeout(this.cloudT);
    cancelAnimationFrame(this.raf);
    clearTimeout(this.tt);
    clearTimeout(this.bt);
  }

  kickBars() {
    if (this.state.barsOn) this.setState({ barsOn: false });
    clearTimeout(this.bt);
    this.bt = setTimeout(() => this.setState({ barsOn: true }), 60);
  }

  applyTheme() {
    const el = this.rootRef.current;
    if (!el) return;
    if (this._themeKey !== this.T) {
      this._themeKey = this.T;
      const th = Temasinterfaz[this.T] || Temasinterfaz.oscuro;
      for (const k in th) el.style.setProperty('--' + k, th[k]);
    }
    const sc = this.screen;
    const isSplash = sc === 'splash' && !this.state.splashRetracted;
    const isLight = this.T === 'claro';
    const topBlue = sc === 'splash' || sc === 'login';
    const statusHex = topBlue ? '#1E345B' : (isLight ? '#F3F2EC' : '#0B0C0A');
    const darkStatus = !topBlue && isLight;
    const navHex = isLight ? '#F3F2EC' : '#0B0C0A';
    const darkNav = !isSplash && isLight;
    const lockPortrait = topBlue;
    if (typeof document !== 'undefined' && this._navHex !== navHex) {
      this._navHex = navHex;
      document.body.style.backgroundColor = navHex;
    }
    if (typeof window !== 'undefined' && window.MiTechoBars && typeof window.MiTechoBars.setBars === 'function') {
      const barKey = darkStatus + '|' + darkNav + '|' + lockPortrait;
      if (this._barKey !== barKey) {
        this._barKey = barKey;
        window.MiTechoBars.setBars(statusHex, darkStatus, navHex, darkNav, lockPortrait);
      }
    }
  }

  animateTo(t) {
    const from = this.state.shown ?? t;
    this.target = t;
    cancelAnimationFrame(this.raf);
    if (this.props.animaciones === false) {
      this.setState({ shown: t });
      return;
    }
    const start = performance.now();
    const step = () => {
      const p = Math.min(1, (performance.now() - start) / 650);
      const e = 1 - Math.pow(1 - p, 3);
      this.setState({ shown: from + (t - from) * e });
      if (p < 1) this.raf = requestAnimationFrame(step);
    };
    step();
  }

  calc(s = this.state, debtsOverride, modOverride) {
    return Calcularcapacidad(s, debtsOverride, modOverride);
  }

  iniciarSesionUsuario(correo, nombreSugerido, perfilRemoto) {
    const base = Estadobaseinicial();
    const guardadoLocal = typeof Cargardatosusuario === 'function' ? Cargardatosusuario(correo) : null;
    if (guardadoLocal && typeof guardadoLocal === 'object') {
      Camposalmacenados.forEach(k => {
        if (k in guardadoLocal) base[k] = guardadoLocal[k];
      });
    }
    if (perfilRemoto && typeof perfilRemoto === 'object') {
      base.nombre = perfilRemoto.nombre || base.nombre || nombreSugerido || '';
      base.edad = perfilRemoto.edad ?? base.edad;
      base.ciudad = perfilRemoto.ciudad || base.ciudad || 'Bogotá';
      base.tipo = perfilRemoto.tipo_ingreso || base.tipo || 'fijo';
      base.fijo = perfilRemoto.fijo ?? base.fijo;
      base.variable = perfilRemoto.variable ?? base.variable;
      base.ahorro = perfilRemoto.ahorro ?? base.ahorro;
      base.ahorroMes = perfilRemoto.ahorro_mes ?? base.ahorroMes;
      base.caja = perfilRemoto.afiliado_caja ?? base.caja;
      base.cajaNombre = perfilRemoto.caja_nombre || base.cajaNombre || '';
      base.sisben = perfilRemoto.sisben ?? base.sisben;
      base.sisbenGrupo = perfilRemoto.sisben_grupo || base.sisbenGrupo || 'A1-C8';
      base.mod = perfilRemoto.modalidad || base.mod || 'vis';
      base.rate = perfilRemoto.tasa_tipo || base.rate || 'pesos';
      base.term = perfilRemoto.plazo_anios ?? base.term;
      base.pareja = perfilRemoto.pareja ?? base.pareja;
      base.parejaNombre = perfilRemoto.pareja_nombre || base.parejaNombre || '';
      base.parejaIng = perfilRemoto.pareja_ing ?? base.parejaIng;
      base.parejaDeu = perfilRemoto.pareja_deu ?? base.parejaDeu;
      base.setupDone = true;
    } else if (!base.nombre && nombreSugerido) {
      base.nombre = nombreSugerido;
    }
    base.email = correo || '';
    base.logged = true;
    base.theme = this.state.theme || base.theme || 'oscuro';
    base.splashIn = true;
    base.splashRetracted = true;
    base.emailOpen = false;
    base.loginPassword = '';
    base.loginPassConfirm = '';
    base.loginError = '';
    base.loginNotice = '';
    base.loginSuccessMsg = '';
    base.screen = base.setupDone ? 'app' : 'onboarding';
    base.tab = 'inicio';
    base.obIdx = 0;
    this.setState(base);
    Guardardatosalmacenados(base);
    this.toast('Sesión iniciada con ' + (base.nombre || correo) + '.');
  }

  cerrarSesionUsuario() {
    if (this.state.logged && this.state.email) {
      Guardardatosalmacenados(this.state);
    }
    if (typeof CerrarSesionApi === 'function') {
      CerrarSesionApi().catch(() => null);
    }
    Borrardatosalmacenados();
    const limpio = Estadobaseinicial();
    limpio.theme = this.state.theme || 'oscuro';
    limpio.screen = 'login';
    limpio.splashIn = true;
    limpio.splashRetracted = true;
    limpio.logged = false;
    this.setState(limpio);
    this.toast('Sesión cerrada.');
  }

  login(via) {
    this.setState({
      logged: true,
      screen: this.setupDone ? 'app' : 'onboarding',
      tab: 'inicio',
      obIdx: 0,
      emailOpen: false,
      loginError: ''
    });
    this.toast('Sesión iniciada con ' + via + '.');
  }

  profileVals(c, chipSel, dark) {
    return Generarvaloresperfil.call(this, c, chipSel, dark);
  }

  entVals(c, sel) {
    return Generarvaloresentidades.call(this, c, sel);
  }

  extraVals(c, cfg, sel, ctx) {
    return Generarvaloresadicionales.call(this, c, cfg, sel, ctx);
  }

  setupVals(c, chipSel) {
    return Generarvaloressetup.call(this, c, chipSel);
  }

  async gsCall(payload, method) {
    return Enviarrespaldonube(this.state.gsUrl, payload, method, this.state.email);
  }

  gsPayload() {
    return Prepararrespaldonube(this.state, this.calc());
  }

  toast(msg) {
    clearTimeout(this.tt);
    this.setState({ toast: msg, toastOn: true });
    this.tt = setTimeout(() => this.setState({ toastOn: false }), 2600);
  }

  go(tab) {
    this.setState({
      tab,
      simStep: tab === 'simulador' ? (this.state.simStep || 'form') : this.state.simStep,
      ...(tab === 'ingresos' ? { ingView: this.state.ingView || 'dia', regKind: this.state.regKind || 'ing' } : {})
    });
  }

  setDebt(id, patch) {
    this.setState(s => ({ debts: s.debts.map(d => d.id === id ? { ...d, ...patch } : d) }));
  }

  editDebt(id) {
    const d = this.state.debts.find(x => x.id === id);
    if (!d) return;
    const parts = d.name.split(' · ');
    const baseName = parts[0];
    const entidad = parts[1] || '';
    const tipoMatch = DEBT_TYPES.find(t => t === baseName || SHORT[t] === d.short);
    const tipo = tipoMatch || (DEBT_TYPES.includes(baseName) ? baseName : 'Otro egreso fijo');
    const nombre = tipo === 'Otro egreso fijo' ? baseName : '';
    this.setState({
      sheet: true,
      sheetKind: 'deuda',
      sheetFreq: 'fijo',
      editingDebtId: id,
      debtForm: { tipo, cuota: d.cuota, saldo: d.saldo || 0, entidad: d.entidad || entidad, nombre },
      formError: ''
    });
  }

  deleteDebt(id) {
    const d = this.state.debts.find(x => x.id === id);
    if (!d) return;
    if (typeof window !== 'undefined' && window.confirm && !window.confirm('¿Eliminar la deuda “' + d.name + '”?')) return;
    this.setState(st => ({
      debts: st.debts.filter(x => x.id !== id),
      sheet: st.editingDebtId === id ? false : st.sheet,
      editingDebtId: st.editingDebtId === id ? null : st.editingDebtId
    }));
    this.toast('Deuda “' + d.name + '” eliminada.');
  }

  generatePdf() {
    Generarcertificadopdf(this.state, this.calc(), msg => this.toast(msg));
  }

  renderVals() {
    return Generarvalorespantallas.call(this);
  }
}

(function start() {
  const tpl = document.getElementById('mt-template');
  if (tpl && typeof Plantillaperfil !== 'undefined' && typeof Plantillaprincipal !== 'undefined' && typeof Plantillamodales !== 'undefined') {
    tpl.innerHTML = '<div class="m1" ref="{{ rootRef }}"><div class="m2"><span>MITECHO COLOMBIA</span><span>·</span><span>VERSIÓN OFICIAL 2026</span></div><div class="m3"><div class="m4"></div><div style="position:absolute;top:0;left:0;right:0;height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 34px;font:600 15px \'Familjen Grotesk\',sans-serif;color:{{ statusInk }};z-index:30;background:{{ statusBg }};transition:background .25s ease-out"><span>9:41</span><div class="m5"><div class="m6"><div class="m7"></div><div class="m8"></div><div class="m9"></div><div class="ma"></div></div><div class="mb"><div class="mc"></div></div></div></div>'
      + Plantillaperfil
      + Plantillaprincipal
      + Plantillamodales
      + '</div></div>';
  }
  const q = new URLSearchParams(location.search);
  MT.mount(Component, document.getElementById('app'), document.getElementById('mt-template'), {
    pantallaInicial: q.get('pantalla') || 'splash',
    modo: q.get('modo') === 'claro' ? 'claro' : 'oscuro',
    animaciones: q.get('animaciones') !== 'no'
  });
})();
