// Preparación de los datos de inicio de sesión, pantalla principal, racha diaria y avance de ahorro

function Generarvaloresinicio(c, cfg, sel, dark) {
  const s = this.state, tab = this.tab;
  const shown = s.shown ?? c.precio;
  const tabs = ['inicio', 'ingresos', 'simulador', 'plan', 'ofertas'];
  const tabIs = {}, tabBg = {}, tabFg = {}, tabGo = {};
  tabs.forEach(t => {
    tabIs[t] = tab === t;
    tabBg[t] = tab === t ? 'var(--ac)' : 'transparent';
    tabFg[t] = tab === t ? 'var(--oa)' : 'var(--di)';
    tabGo[t] = () => this.setState({
      tab: t,
      simStep: t === 'simulador' ? (s.simStep || 'form') : s.simStep,
      ...(t === 'ingresos' ? { ingView: s.ingView || 'dia', regKind: s.regKind || 'ing' } : {})
    });
  });
  tabIs.simForm = tab === 'simulador' && (s.simStep || 'form') === 'form';
  tabIs.simResult = tab === 'simulador' && s.simStep === 'result';

  const todayTotal = s.entries.reduce((a, e) => a + e.monto, 0);
  const cashPend = s.entries.filter(e => e.medio === 'Efectivo').reduce((a, e) => a + e.monto, 0) + s.cashOld;
  const ciPct = c.ci > 0 ? Math.min(1, c.cash / c.ci) : 1;
  const monthsLeft = Math.max(0, Math.ceil(c.falta / Math.max(1, s.ahorroMes)));
  const obIdx = s.obIdx;
  const subUsed = Math.min(c.subsidio, c.ci);
  const own = Math.max(0, c.ci - subUsed);
  const smm = c.smm;
  const potS = s.caja ? 0 : smm <= 2 ? 30 : smm <= 4 ? 20 : 0;
  const subS = c.subCajaS + c.subMcyS;
  const showAfil = !s.caja && s.tipo !== 'fijo' && smm < 4;

  return {
    rootRef: this.rootRef,
    scrollRef: this.scrollRef,
    obRef: this.obRef,
    isDark: dark,
    isLight: !dark,
    toggleTheme: () => this.setState({ theme: dark ? 'claro' : 'oscuro' }),
    isOnboarding: this.onboarding,
    isApp: this.screen === 'app',
    hasSheet: this.screen === 'app' && Boolean(s.sheet),
    sheetDisplay: (this.screen === 'app' && s.sheet) ? 'flex' : 'none',
    sheetBackdropDisplay: (this.screen === 'app' && s.sheet) ? 'block' : 'none',
    showDock: this.screen === 'app' && !s.help && !s.panel,
    isWelcomeAuth: this.screen === 'splash' || this.screen === 'login',
    isSplashMode: this.screen === 'splash' && !s.splashRetracted,
    welcomeStateClass: (this.screen === 'splash' && !s.splashRetracted) ? 'is-splash' : 'is-login',
    onSplashTap: () => {
      if (this.screen === 'splash' && !s.splashRetracted) {
        this.setState({ splashIn: true, splashRetracted: true, screen: 'login' });
      }
    },
    isLogin: this.screen === 'login' || Boolean(s.splashRetracted),
    isSplash: this.screen === 'splash' && !s.splashRetracted,
    skipSplash: () => {
      this.setState({ splashIn: true, splashRetracted: true, screen: 'login' });
    },
    spLogoT: s.splashIn ? 'scale(1)' : 'scale(.8)',
    spLogoO: s.splashIn ? 1 : 0,
    spTextO: s.splashIn ? 1 : 0,
    spTextT: s.splashIn ? 'translateY(0)' : 'translateY(14px)',
    spBandT: s.splashIn ? 'scaleX(1)' : 'scaleX(0)',
    statusBg: this.screen === 'splash' || this.screen === 'login' ? '#1E345B' : 'var(--bg)',
    statusInk: this.screen === 'splash' || this.screen === 'login' ? '#F4F6FB' : 'var(--ik)',
    emailOpen: Boolean(s.emailOpen),
    emailClosed: !s.emailOpen,
    isNotRecoverMode: s.loginMode !== 'recover',
    isRecoverMode: s.loginMode === 'recover',
    isLoginMode: (!s.loginMode || s.loginMode === 'login'),
    isRegisterMode: s.loginMode === 'register',
    loginTabBg: (!s.loginMode || s.loginMode === 'login') ? 'var(--ac)' : 'transparent',
    loginTabColor: (!s.loginMode || s.loginMode === 'login') ? 'var(--oa)' : 'var(--mu)',
    regTabBg: s.loginMode === 'register' ? 'var(--ac)' : 'transparent',
    regTabColor: s.loginMode === 'register' ? 'var(--oa)' : 'var(--mu)',
    passPlaceholder: s.loginMode === 'register' ? 'Contraseña (mínimo 6 caracteres)' : 'Contraseña',
    loginPassConfirmVal: s.loginPassConfirm || '',
    loginSuccessMsg: s.loginSuccessMsg || '',
    regBtnText: s.loginBusy ? 'Registrando…' : 'Registrarme',
    recoverBtnText: s.loginBusy ? 'Enviando enlace…' : 'Enviar enlace de recuperación',
    loginEmailVal: s.loginEmail,
    loginPassVal: s.loginPassword || '',
    loginError: s.loginError,
    loginNotice: s.loginNotice,
    loginBtnText: s.loginBusy ? 'Entrando…' : 'Entrar',
    openEmail: () => this.setState({ emailOpen: true, loginMode: 'login', loginError: '', loginNotice: '', loginSuccessMsg: '' }),
    closeEmail: () => this.setState({ emailOpen: false, loginMode: 'login', loginError: '', loginNotice: '', loginSuccessMsg: '' }),
    contactSupportLogin: () => {
      clearTimeout(this._supTimer);
      this.setState({
        supportOpen: true,
        supNombre: s.supNombre || s.nombre || '',
        supEmail: s.supEmail || s.email || s.loginEmail || '',
        supAsunto: '',
        supDesc: '',
        supErr: '',
        supSent: false,
        supBusy: false,
        supY: 0,
        supDragging: false,
        supAnim: false
      });
      this._supTimer = setTimeout(() => this.setState({ supAnim: true }), 25);
    },
    setLoginTab: () => this.setState({ loginMode: 'login', loginError: '', loginNotice: '', loginSuccessMsg: '' }),
    setRegisterTab: () => this.setState({ loginMode: 'register', loginError: '', loginNotice: '', loginSuccessMsg: '' }),
    setRecoverTab: () => this.setState({ loginMode: 'recover', loginError: '', loginNotice: '', loginSuccessMsg: '' }),
    onLoginEmail: (e) => this.setState({ loginEmail: e.target.value, loginError: '', loginNotice: '', loginSuccessMsg: '' }),
    onLoginPass: (e) => this.setState({ loginPassword: e.target.value, loginError: '', loginNotice: '', loginSuccessMsg: '' }),
    onLoginPassConfirm: (e) => this.setState({ loginPassConfirm: e.target.value, loginError: '', loginNotice: '', loginSuccessMsg: '' }),
    loginGoogle: async () => {
      this.setState({ loginBusy: true, loginError: '', loginNotice: '', loginSuccessMsg: '' });
      if (typeof window !== 'undefined' && window.MiTechoBars && typeof window.MiTechoBars.signInGoogle === 'function') {
        window.MiTechoOnGoogleNativeSuccess = async (idToken, email, name) => {
          try {
            const res = await IniciarSesionConIdTokenGoogle(idToken);
            this.setState({ loginBusy: false });
            if (res.ok) {
              const u = (res.datos && res.datos.user) || {};
              const userEmail = email || u.email || '';
              const userName = name || (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.nombre)) || userEmail;
              let p = null;
              const resPerfil = await ObtenerPerfilApi();
              if (resPerfil.ok && Array.isArray(resPerfil.datos) && resPerfil.datos.length > 0) {
                p = resPerfil.datos[0];
              }
              this.iniciarSesionUsuario(userEmail, userName, p);
            } else {
              this.setState({ loginError: res.error || 'No se pudo iniciar sesión con Google.' });
            }
          } catch (e) {
            this.setState({ loginBusy: false, loginError: 'Error al procesar la sesión.' });
          }
        };
        window.MiTechoOnGoogleNativeError = (errMsg) => {
          this.setState({ loginBusy: false, loginError: errMsg || 'No se pudo conectar con Google.' });
        };
        window.MiTechoOnGoogleNativeCancel = () => {
          this.setState({ loginBusy: false });
        };
        window.MiTechoBars.signInGoogle();
        return;
      }
      try {
        const check = await fetch(Configuracionapi.urlBase + '/auth/v1/authorize?provider=google', { redirect: 'manual' });
        if (check.status === 400) {
          this.setState({
            loginBusy: false,
            loginNotice: 'Para usar Google directo debes activar el proveedor en Supabase. Puedes ingresar o registrarte con tu correo (incluyendo Gmail) abajo.'
          });
          this.toast('Ingresa o regístrate con tu correo abajo.');
          return;
        }
        window.location.href = Configuracionapi.urlBase + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(window.location.origin);
      } catch (err) {
        this.setState({ loginBusy: false, loginNotice: 'Ingresa con tu correo y contraseña abajo.' });
        this.toast('Ingresa o regístrate con tu correo abajo.');
      }
    },
    loginEmail: async () => {
      const email = (s.loginEmail || '').trim().toLowerCase();
      const pass = s.loginPassword || '';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        this.setState({ loginError: 'Escribe un correo válido.' });
        return;
      }
      if (!pass || pass.length < 6) {
        this.setState({ loginError: 'Escribe tu contraseña (mínimo 6 caracteres).' });
        return;
      }
      this.setState({ loginBusy: true, loginError: '', loginNotice: '', loginSuccessMsg: '' });
      const res = await IniciarSesionApi(email, pass);
      this.setState({ loginBusy: false });
      if (res.ok) {
        let p = null;
        const resPerfil = await ObtenerPerfilApi();
        if (resPerfil.ok && Array.isArray(resPerfil.datos) && resPerfil.datos.length > 0) {
          p = resPerfil.datos[0];
        }
        this.iniciarSesionUsuario(email, '', p);
      } else {
        const err = res.error || '';
        const msg = err.includes('email_not_confirmed')
          ? 'Por favor revisa tu correo y confirma tu cuenta con el enlace que te enviamos antes de entrar.'
          : (err.includes('invalid_grant') || err.includes('credentials')
            ? 'Correo o contraseña incorrectos. Si no tienes cuenta, selecciona "Registrarme".'
            : (res.error || 'No se pudo iniciar sesión.'));
        this.setState({ loginError: msg });
      }
    },
    registerEmail: async () => {
      const email = (s.loginEmail || '').trim().toLowerCase();
      const pass = s.loginPassword || '';
      const passConf = s.loginPassConfirm || '';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        this.setState({ loginError: 'Escribe un correo válido para registrarte.' });
        return;
      }
      if (!pass || pass.length < 6) {
        this.setState({ loginError: 'La contraseña debe tener al menos 6 caracteres.' });
        return;
      }
      if (pass !== passConf) {
        this.setState({ loginError: 'Las contraseñas no coinciden. Por favor verifícalas.' });
        return;
      }
      this.setState({ loginBusy: true, loginError: '', loginNotice: '', loginSuccessMsg: '' });
      const res = await RegistrarUsuarioApi({ email, password: pass, nombre: s.nombre, ciudad: s.ciudad });
      this.setState({ loginBusy: false });
      if (res.ok) {
        this.setState({
          email,
          loginMode: 'login',
          loginPassword: '',
          loginPassConfirm: '',
          loginSuccessMsg: 'Te enviamos un correo de confirmación. Por favor revisa tu bandeja de entrada para verificar tu cuenta y luego regresa a la app para iniciar sesión.'
        });
        this.toast('Revisa tu correo para confirmar tu cuenta.');
      } else {
        const msg = (res.error && res.error.includes('already registered'))
          ? 'Este correo ya está registrado. Selecciona "Iniciar sesión" para entrar.'
          : (res.error || 'No se pudo crear la cuenta.');
        this.setState({ loginError: msg });
      }
    },
    recoverEmail: async () => {
      const email = (s.loginEmail || '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        this.setState({ loginError: 'Escribe un correo válido para recuperar tu contraseña.' });
        return;
      }
      this.setState({ loginBusy: true, loginError: '', loginNotice: '', loginSuccessMsg: '' });
      const res = await RecuperarContrasenaApi(email);
      this.setState({ loginBusy: false });
      if (res.ok) {
        this.setState({
          loginSuccessMsg: 'Si este correo está registrado en MiTecho, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada o spam.'
        });
        this.toast('Solicitud procesada.');
      } else {
        this.setState({ loginError: res.error || 'No se pudo enviar el correo de recuperación. Intenta nuevamente.' });
      }
    },
    obIsLast: obIdx === 2,
    obCounter: '0' + (obIdx + 1) + ' / 03',
    obBars: [0, 1, 2].map(k => ({ bg: k <= obIdx ? 'var(--ac)' : 'var(--c2)' })),
    obNotLast: obIdx < 2,
    onObScroll: (e) => {
      const k = Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth);
      if (k !== s.obIdx) this.setState({ obIdx: k });
    },
    obNext: () => {
      const el = this.obRef.current;
      if (el) el.scrollTo({ left: (obIdx + 1) * el.clientWidth, behavior: 'smooth' });
    },
    skipOnboarding: () => this.afterWelcome(),
    enterApp: () => this.afterWelcome(),
    tabIs,
    tabBg,
    tabFg,
    tabGo,
    heroPrice: m1(shown),
    modLabel: cfg.tag,
    creditoM: '$' + m1(c.creditoUsado) + ' M',
    capM: '$' + m1(c.cap) + ' M',
    deltaMes: (c.varAvg >= c.varPrev ? '↑ $' : '↓ $') + m1(Math.abs(c.varAvg - c.varPrev) * c.tope * c.factor / cfg.fin) + ' M',
    finW: (c.creditoUsado / Math.max(1, c.precio) * 100) + '%',
    finPct: Math.round(c.creditoUsado / Math.max(1, c.precio) * 100) + '%',
    subW: (subUsed / Math.max(1, c.precio) * 100) + '%',
    ownPct: Math.round(own / Math.max(1, c.precio) * 100) + '%',
    ownM: '$' + m1(own) + ' M',
    hasSub: subUsed > 0,
    subM: '$' + m1(subUsed) + ' M',
    subLabel: c.subMcyS ? 'Caja + Mi Casa Ya' : 'de Caja',
    ciTitle: 'Cuota inicial ' + Math.round((1 - cfg.fin) * 100) + '%',
    ciRatio: '$' + m1(c.cash) + ' M / $' + m1(c.ci) + ' M',
    ciBarW: (ciPct * 100) + '%',
    ciPct: Math.round(ciPct * 100) + '%',
    ciMonths: monthsLeft ? (s.ahorroMes ? 'Te faltan ' + monthsLeft + ' meses ahorrando ' + cop(s.ahorroMes) + ' al mes.' : 'Te faltan ' + cop(c.falta) + '. Define tu ahorro mensual en el perfil.') : 'Ya tienes tu cuota inicial completa.',
    ciM: '$' + m1(c.ci) + ' M',
    ciShare: Math.round(c.ci / Math.max(1, c.precio) * 100) + '%',
    precioHoyM: '$' + m1(c.precioHoy) + ' M',
    limitAhorro: c.limitAhorro,
    streak: Array.from({ length: 14 }, (_, k) => ({ bg: k === 5 ? 'var(--ad)' : k < 12 ? 'var(--ac)' : k === 12 && s.added ? 'var(--ac)' : 'var(--dm)' })),
    streakLabel: (s.added ? 13 : 12) + ' días',
    metaW: Math.min(100, todayTotal / Math.max(1, c.metaDiaria) * 100) + '%',
    hasCash: cashPend > 0,
    cashMsg: cop(cashPend) + ' en efectivo sin consignar. El banco no los ve.',
    showAfil,
    afilShort: 'Afíliate a una Caja y podrías recibir ' + cop(potS * SMMLV) + ' de subsidio.',
    sensM: '$' + m1(c.sens) + ' M',
    goIngresos: () => this.setState({ tab: 'ingresos', ingView: 'dia' }),
    goSim: () => this.setState({ tab: 'simulador', simStep: 'form' }),
    goSimResult: () => this.setState({ tab: 'simulador', simStep: 'result' }),
    goPlan: () => this.setState({ tab: 'plan' }),
    goPerfil: () => this.setState({ panel: 'perfil' }),
    toastMsg: s.toast,
    toastY: s.toastOn ? 'translateY(0)' : 'translateY(-140%)',
    toastO: s.toastOn ? 1 : 0
  };
}

