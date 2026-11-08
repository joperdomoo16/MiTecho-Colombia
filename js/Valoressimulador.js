// Preparación de los cálculos del simulador de crédito, nivel de deudas, cuotas y proyectos de vivienda

function Generarvaloressimulador(c, cfg, sel, chipSel) {
  const s = this.state, dark = this.T === 'oscuro', tab = this.tab;
  const debtsAll = s.debts.map(d => ({ ...d, on: true }));
  const cAll = this.calc(s, debtsAll);
  const freedCred = Math.max(0, c.credito - cAll.credito);
  const dBank = Math.max(0, c.precio - cAll.precio), dHoy = Math.max(0, c.precioHoy - cAll.precioHoy);
  const needMore = Math.max(0, c.falta - cAll.falta);
  const saldoOff = s.debts.filter(d => !d.on).reduce((a, d) => a + (d.saldo || 0), 0);
  const cSaldo = saldoOff ? this.calc({ ...s, ahorro: Math.max(0, s.ahorro - saldoOff) }) : null;

  let planMsg = '', planOk = false;
  if (freedCred > 0) {
    if (c.capped && dBank < 1) planMsg = 'Tu cupo ya supera el tope VIS. El crédito extra no sube el precio de una vivienda VIS.';
    else if (needMore < 1) { planOk = true; planMsg = 'Tienes la cuota inicial para usarlo: tu vivienda puede subir $' + m1(dBank) + ' M.'; }
    else if (dHoy > 1) planMsg = 'Hoy tu vivienda sube $' + m1(dHoy) + ' M. Para usar todo el cupo necesitas ' + cop(needMore) + ' más de cuota inicial.';
    else planMsg = 'Hoy tu límite es la cuota inicial, no el banco. Para usar este cupo necesitas ' + cop(needMore) + ' más de cuota inicial' + (c.subsidio ? ', ya contando tu subsidio.' : '.');
  }

  const debtCards = s.debts.map(d => {
    const off = !d.on;
    return {
      id: d.id,
      name: d.name,
      detail: cop(d.cuota) + '/mes' + (d.saldo ? ' · saldo ' + cop(d.saldo) : ''),
      bg: off ? 'var(--ac)' : 'var(--cd)',
      border: off ? 'var(--ac)' : 'var(--ln)',
      color: off ? 'var(--oa)' : 'var(--ik)',
      sub: off ? 'rgba(11,12,10,.65)' : 'var(--mu)',
      line: off ? 'rgba(11,12,10,.15)' : 'var(--ln)',
      track: off ? 'var(--oa)' : 'var(--c2)',
      knob: off ? 'var(--ac)' : 'var(--mu)',
      x: off ? 'translateX(18px)' : 'none',
      state: off ? 'APAGADA · LIBERA' : 'SI LA APAGAS',
      impact: '+$' + m1(d.cuota * c.tope * c.factor) + ' M crédito',
      btnBg: off ? 'rgba(11,12,10,.1)' : 'var(--c2)',
      btnBorder: off ? 'rgba(11,12,10,.15)' : 'var(--ln)',
      onClick: () => this.setDebt(d.id, { on: !d.on }),
      onEdit: () => this.editDebt(d.id),
      onDelete: () => this.deleteDebt(d.id)
    };
  });

  const debtChips = s.debts.map(d => ({
    label: d.short + ' ' + cop(d.cuota),
    bg: d.on ? 'var(--c2)' : 'transparent',
    border: d.on ? 'var(--c2)' : 'var(--ln)',
    color: d.on ? 'var(--ik)' : 'var(--fa)',
    deco: d.on ? 'none' : 'line-through',
    onClick: () => this.setDebt(d.id, { on: !d.on })
  }));

  const debtRowsMes = s.debts.filter(d => d.on).map(d => ({
    name: d.name,
    cuota: cop(d.cuota),
    paid: d.paid,
    boxBg: d.paid ? 'var(--ac)' : 'transparent',
    boxBorder: d.paid ? 'var(--ac)' : 'var(--fa)',
    color: d.paid ? 'var(--mu)' : 'var(--ik)',
    deco: d.paid ? 'line-through' : 'none',
    onTogglePaid: () => this.setDebt(d.id, { paid: !d.paid }),
    onEdit: () => this.editDebt(d.id)
  }));

  const debtRatio = c.deu / Math.max(1, c.ing);
  const modOpts = Object.keys(MODS).map(k => {
    const o = sel(s.mod === k);
    return { label: MODS[k].label, desc: MODS[k].desc, ...o, onClick: () => this.setState({ mod: k }) };
  });
  const visTope = visTopeOf(s.ciudad) * SMMLV;
  const rateOpts = [['pesos', 'Pesos fijos'], ['uvr', 'UVR']].map(([k, l]) => ({ label: l, ...sel(s.rate === k), onClick: () => this.setState({ rate: k }) }));
  const termOpts = [15, 20, 30].map(n => ({ label: n + ' años', ...sel(s.term === n), onClick: () => this.setState({ term: n }) }));
  const cuota = c.cuota;
  const sliderP = (c.ing1 - 1500000) / (15000000 - 1500000);
  const f = s.form;
  const formGain = f.monto / c.N * c.tope * c.factor / cfg.fin;

  const smm = c.smm;
  const potS = s.caja ? 0 : smm <= 2 ? 30 : smm <= 4 ? 20 : 0;
  const subS = c.subCajaS + c.subMcyS;
  const pfSubMsg = !s.caja ? (potS ? 'No estás afiliado. Si te afilias, te corresponderían ' + potS + ' SMMLV (' + cop(potS * SMMLV) + ') para vivienda VIS.' : 'No estás afiliado. Con tus ingresos tampoco aplicarías a subsidio de Caja.')
    : subS ? 'Te corresponden ' + subS + ' SMMLV (' + cop(subS * SMMLV) + ')' + (c.subMcyS ? ' sumando Mi Casa Ya' : '') + ' para vivienda VIS.' : 'Con ingresos mayores a 4 SMMLV no aplicas a subsidio de Caja.';
  const ok = s.caja && subS > 0;
  const showAfil = !s.caja && s.tipo !== 'fijo' && smm < 4;

  const selCity = s.ofCities ?? [s.ciudad];
  const ordered = selCity.includes(s.ciudad) ? [s.ciudad, ...selCity.filter(x => x !== s.ciudad)] : selCity;
  const card = p => {
    const pm = p.m === 'VIS' ? 'vis' : 'novis', cp = this.calc(s, null, pm), fin = MODS[pm].fin;
    const cupo = cp.credito / fin, bankOk = p.p <= cupo + 1 && (pm !== 'vis' || p.p <= cp.visTope);
    const faltaP = Math.max(0, p.p - Math.min(cp.credito, p.p * fin) - cp.cash);
    const st = !bankOk ? 2 : faltaP > 1 ? 1 : 0;
    return {
      onLead: () => this.toast('Proyecto ' + p.n + ': información en sala de ventas ' + p.c + '.'),
      bgImg: 'url(https://unsplash.com/photos/' + p.img + '/download?w=800)',
      area: p.a.toUpperCase() + ' · ' + p.m.toUpperCase(),
      nombre: p.n,
      precio: '$' + m1(p.p) + ' M',
      meta: p.b + ' · ' + p.c + ' · ' + p.a + ' · ' + p.m + (cp.subsidio ? ' · Subsidio $' + m1(cp.subsidio) + ' M' : ''),
      fit: st === 0 ? 'PUEDE SER MITECHO' : st === 1 ? 'FALTA INICIAL $' + m1(faltaP) + ' M' : 'FALTAN $' + m1(p.p - cupo) + ' M DE CUPO',
      tagBg: ['var(--ac)', '#FFD23F', 'var(--dk)'][st],
      tagColor: ['var(--oa)', '#0B0C0A', '#F2F4EC'][st],
      _st: st,
      _p: p.p
    };
  };
  const cnt = (city) => PROYECTOS.filter(p => p.c === city).length;
  const q = norm(s.ofQ.trim());
  const addList = CITIES.filter(([cn, d]) => !selCity.includes(cn) && (!q || norm(cn).includes(q) || norm(d).includes(q)));

  return {
    debtChips,
    debtRowsMes,
    modOpts,
    visTope,
    rateOpts,
    termOpts,
    cuota,
    sliderP,
    f,
    formGain,
    ingOtro: f.fuente === 'Otros',
    ingNombre: f.nombre || '',
    onIngNombre: (e) => this.setState({ form: { ...f, nombre: e.target.value } }),
    fiOtro: s.fiForm.tipo === 'Otro ingreso fijo',
    fiNombre: s.fiForm.nombre || '',
    onFiNombre: (e) => this.setState({ fiForm: { ...s.fiForm, nombre: e.target.value } }),
    exOtro: s.exForm.cat === 'Otros',
    exNombre: s.exForm.nombre || '',
    onExNombre: (e) => this.setState({ exForm: { ...s.exForm, nombre: e.target.value } }),
    dfOtro: s.debtForm.tipo === 'Otro egreso fijo',
    dfNombre: s.debtForm.nombre || '',
    onDfNombre: (e) => this.setState({ debtForm: { ...s.debtForm, nombre: e.target.value } }),
    gsUrl: s.gsUrl,
    onGsUrl: (e) => this.setState({ gsUrl: e.target.value.trim() }),
    emailShow: (s.email || '') + ' · ' + (s.loginEmail ? 'Correo' : 'Google'),
    gsSyncLabel: s.gsBusy ? 'Sincronizando…' : 'Sincronizar',
    gsStatus: s.gsMsg || (s.gsLast ? 'Última copia: ' + new Date(s.gsLast).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : 'Guarda o restaura una copia de tu perfil y registros en la nube.'),
    gsStatusColor: s.gsErr ? 'var(--al)' : 'var(--mu)',
    gsSync: async () => {
      if (s.gsBusy) return;
      this.setState({ gsBusy: true, gsMsg: '', gsErr: false });
      try {
        const j = await this.gsCall(this.gsPayload());
        this.setState({ gsBusy: false, gsLast: Date.now(), gsMsg: 'Copia guardada: ' + (j.nuevos || 0) + ' registros nuevos.' });
      } catch (err) {
        this.setState({ gsBusy: false, gsErr: true, gsMsg: err.message || 'No se pudo conectar con la hoja.' });
      }
    },
    gsRestore: async () => {
      if (s.gsBusy) return;
      this.setState({ gsBusy: true, gsMsg: '', gsErr: false });
      try {
        const j = await this.gsCall(null, 'GET');
        if (!j.estado) throw new Error('No hay copia para ' + s.email + '.');
        const patch = {};
        Camposalmacenados.forEach(k => { if (k !== 'gsUrl' && k in j.estado) patch[k] = j.estado[k]; });
        this.setState({ ...patch, gsBusy: false, gsMsg: 'Datos restaurados desde la nube.' });
      } catch (err) {
        this.setState({ gsBusy: false, gsErr: true, gsMsg: err.message || 'No se pudo restaurar.' });
      }
    },
    openMenu: () => this.setState({ menu: true }),
    closeMenu: () => this.setState({ menu: false }),
    isProUser: !!s.pro,
    avatarUrl: s.avatarUrl || '',
    hasAvatarImg: !!s.avatarUrl,
    noAvatarImg: !s.avatarUrl,
    avatarBg: s.avatarUrl ? 'transparent' : (s.pro ? '#FFD23F' : 'var(--ac)'),
    avatarFg: s.avatarUrl ? 'transparent' : (s.pro ? '#0B0C0A' : 'var(--oa)'),
    avatarBorder: s.pro ? '2px solid #FFD23F' : 'none',
    avatarBorderSm: s.pro ? '2px solid #FFD23F' : '1px solid var(--ln)',
    avatarBorderLg: s.pro ? '3px solid #FFD23F' : '2px solid var(--ln)',
    avatarShadow: s.pro ? '0 0 0 2px rgba(255,210,63,.4), 0 2px 8px rgba(0,0,0,.25)' : (s.menu ? '0 0 0 4px var(--ad)' : 'none'),
    triggerPhotoUpload: () => {
      if (typeof document !== 'undefined') {
        const el = document.getElementById('mt-avatar-input');
        if (el) { el.value = ''; el.click(); }
      }
    },
    onAvatarFileChange: (e) => {
      const target = (e.nativeEvent && e.nativeEvent.target) || e.target;
      const file = target && target.files && target.files[0];
      if (!file) return;
      if (!file.type || !file.type.startsWith('image/')) {
        this.toast('Por favor selecciona una imagen válida.');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        this.toast('La imagen no debe superar los 8 MB.');
        return;
      }
      Procesarfotoperfil(file, (dataUrl) => {
        this.setState({ avatarUrl: dataUrl });
        this.toast('Foto de perfil actualizada.');
      });
    },
    removeAvatarImg: () => {
      this.setState({ avatarUrl: '' });
      this.toast('Foto de perfil eliminada.');
    },
    menuFade: s.menu ? 1 : 0,
    menuPE: s.menu ? 'auto' : 'none',
    menuScale: s.menu ? 'scale(1)' : 'scale(.92) translateY(-8px)',
    avatarRing: s.menu ? '4px' : '0px',
    menuItems: [
      { label: 'Ayuda', sub: 'Qué significa cada cifra', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01', bg: 'var(--ac)', color: 'var(--oa)', iconBg: 'rgba(11,12,10,.1)', right: '→', onClick: () => this.setState({ menu: false, help: true, helpOpen: 0 }) },
      { label: 'MiTecho Pro', sub: s.pro ? 'Activo · sin anuncios' : 'Sin anuncios · $12.900/mes', icon: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z', bg: 'transparent', color: 'var(--ik)', iconBg: '#FFD23F', right: s.pro ? 'ACTIVO' : '', onClick: () => this.setState({ menu: false, panel: 'pro' }) },
      { label: 'Mi perfil financiero', sub: 'Ciudad, tipo de ingreso, edad', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', bg: 'transparent', color: 'var(--ik)', iconBg: 'var(--c2)', right: '', onClick: () => this.setState({ menu: false, panel: 'perfil' }) },
      { label: 'Recordatorios', sub: 'Aviso diario para registrar', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0', bg: 'transparent', color: 'var(--ik)', iconBg: 'var(--c2)', right: s.rem.daily ? s.rem.hora : 'APAGADO', onClick: () => this.setState({ menu: false, panel: 'rem' }) },
      { label: dark ? 'Modo claro' : 'Modo oscuro', sub: '', icon: dark ? 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' : 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z', bg: 'transparent', color: 'var(--ik)', iconBg: 'var(--c2)', right: '', onClick: () => this.setState({ theme: dark ? 'claro' : 'oscuro' }) },
      { label: 'Ver bienvenida otra vez', sub: '', icon: 'M1 4v6h6M3.5 15a9 9 0 1 0 2.1-9.4L1 10', bg: 'transparent', color: 'var(--ik)', iconBg: 'var(--c2)', right: '', onClick: () => this.setState({ menu: false, help: false, screen: 'onboarding', obIdx: 0 }) },
      { label: 'Cerrar sesión', sub: '', icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9', bg: 'transparent', color: 'var(--al)', iconBg: 'var(--c2)', right: '', onClick: () => this.cerrarSesionUsuario() }
    ],
    subsidioFmt: cop(c.subsidio),
    ahorroFmt: cop(s.ahorro),
    smmFmt: c.smm.toLocaleString('es-CO', { maximumFractionDigits: 1 }),
    creditoUsadoFmt: cop(c.creditoUsado),
    hasCajaSub: c.subCaja > 0,
    hasMcySub: c.subMcy > 0,
    subCajaS: c.subCajaS,
    subCajaFmt: cop(c.subCaja),
    subMcyFmt: cop(c.subMcy),
    faltaLabel: c.falta > 0 ? '= Te falta' : '= Cuota inicial cubierta',
    faltaFmt: c.falta > 0 ? cop(c.falta) : '✓',
    faltaColor: c.falta > 0 ? 'var(--al)' : 'var(--at)',
    simSubShow: s.mod === 'vis',
    simSubDot: c.subsidio > 0 ? 'var(--ac)' : '#FFD23F',
    simSubMsg: !s.caja ? 'No tienes Caja de compensación registrada, así que no sumamos subsidio. Actívala en tu perfil si estás afiliado.' : c.subsidio > 0 ? 'Sumamos ' + cop(c.subsidio) + ' de subsidio (' + (c.subCajaS + c.subMcyS) + ' SMMLV' + (c.subMcyS ? ', con Mi Casa Ya' : '') + ') a tu cuota inicial.' : 'Con ingresos de ' + c.smm.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' SMMLV no aplicas a subsidio de Caja (tope: 4 SMMLV).',
    pfSubMsg,
    pfSubBg: ok ? 'var(--ac)' : 'var(--c2)',
    pfSubColor: ok ? 'var(--oa)' : 'var(--ik)',
    pfSubKicker: ok ? 'rgba(11,12,10,.65)' : 'var(--fa)',
    afilMsg: 'Como independiente puedes afiliarte de forma voluntaria a una Caja de compensación aportando el 0,6% o el 2% de tus ingresos. Así podrías postularte a ' + cop(potS * SMMLV) + ' de subsidio para vivienda VIS.',
    precioM: '$' + m1(c.precio) + ' M',
    ingFmt: cop(c.ing),
    visTopeFmt: cop(visTope),
    sensCap: cop(100000 * c.tope),
    sensCred: cop(100000 * c.tope * c.factor),
    topePct: Math.round(c.tope * 100) + '%',
    ingSourceLabel: s.useAuto ? (c.varAvg > 0 ? 'FIJO + PROMEDIO ' + c.N + ' MESES' : 'INGRESO FIJO') : 'MANUAL',
    ingresoFmt: num(c.ing1),
    ingresoVal: c.ing1,
    ingSliderW: (sliderP * 100) + '%',
    onIngreso: (e) => this.setState({ useAuto: false, manualIng: +e.target.value }),
    useAuto: () => this.setState({ useAuto: !s.useAuto, manualIng: c.ing1 }),
    autoLabel: s.useAuto ? 'Usando promedio de Mis Ingresos' : 'Traer promedio automático desde Mis Ingresos',
    autoBg: s.useAuto ? 'var(--c2)' : 'transparent',
    autoBorder: s.useAuto ? 'var(--c2)' : 'var(--ad)',
    autoColor: s.useAuto ? 'var(--mu)' : 'var(--at)',
    togglePareja: () => this.setState({ pareja: !s.pareja }),
    parejaTrack: s.pareja ? 'var(--ac)' : 'var(--c2)',
    parejaKnob: s.pareja ? 'var(--oa)' : 'var(--mu)',
    parejaX: s.pareja ? 'translateX(22px)' : 'none',
    visWarn: c.capped,
    visCappedRow: c.capped,
    precioSinTopeFmt: cop(c.credito / cfg.fin),
    finLabelLast: c.capped ? 'TOPE VIS (' + visTopeOf(s.ciudad) + ' SMMLV)' : '÷ ' + Math.round(cfg.fin * 100) + '% VIVIENDA',
    visWarnMsg: 'Tu cupo supera el tope VIS en ' + s.ciudad + ' (' + visTopeOf(s.ciudad) + ' SMMLV = ' + cop(visTope) + '). Te mostramos viviendas VIS hasta ese valor; por encima serían No VIS y sin subsidio.',
    netoFmt: cop(c.neto),
    topeLabel: '× ' + Math.round(c.tope * 100) + '% CAPACIDAD',
    capFmt: cop(c.cap),
    creditoFmt: cop(c.credito),
    finLabel: '÷ ' + Math.round(cfg.fin * 100) + '% VIVIENDA',
    precioFmt: cop(c.precio),
    cuotaLabel: 'Cuota mensual ' + (s.rate === 'pesos' ? (s.mod === 'vis' ? '(14,35% E.A.)' : '(15,46% E.A.)') : 'inicial en UVR (UVR + 7,5%)'),
    cuotaMensual: cop(cuota),
    locked: !s.unlocked && !s.pro,
    unlockLabel: s.unlocking ? 'Reproduciendo anuncio…' : 'Ver video de 15 s o activar Pro',
    unlock: () => {
      if (s.unlocking) return;
      this.setState({ unlocking: true });
      setTimeout(() => this.setState({ unlocked: true, unlocking: false }), 1400);
    },
    ciCardTitle: 'Cuota inicial ' + Math.round((1 - cfg.fin) * 100) + '% + gastos',
    ciFmt: cop(c.ci),
    gastosLabel: cfg.gl,
    gastosFmt: (s.unlocked || s.pro) ? cop(c.gastos) : 'Ver con video',
    totalPropios: cop(c.ci + c.gastos),
    planLead: freedCred > 0 ? 'Con lo que apagaste, el banco te presta' : 'Apaga una deuda y mira cuánto más te presta el banco',
    freedM: m1(freedCred),
    debtCards,
    planCupo: dBank > 1 ? '$' + m1(cAll.precio) + ' → $' + m1(c.precio) + ' M' : '$' + m1(c.precio) + ' M',
    planHoy: dHoy > 1 ? '$' + m1(cAll.precioHoy) + ' → $' + m1(c.precioHoy) + ' M' : '$' + m1(c.precioHoy) + ' M',
    planMsgShow: !!planMsg,
    planMsg,
    planMsgBg: planOk ? 'var(--ac)' : '#FFD23F',
    saldoShow: saldoOff > 0,
    saldoMsg: saldoOff ? 'Ojo: si pagas estas deudas con tus ahorros (' + cop(saldoOff) + ' de saldo), tu cuota inicial baja y hoy cerrarías hasta $' + m1(cSaldo.precioHoy) + ' M.' : '',
    sensCredM: '$' + m1(c.sensCred) + ' M',
    showCartera: debtRatio > 0.25,
    carteraMsg: 'Tus deudas son el ' + Math.round(debtRatio * 100) + '% de tu ingreso',
    ofCustom: s.ofCities !== null,
    ofReset: () => this.setState({ ofCities: null, ofAddOpen: false, ofQ: '' }),
    ofChips: ordered.map(cn => {
      const home = cn === s.ciudad;
      return {
        label: cn,
        bg: home ? 'var(--ac)' : 'var(--c2)',
        color: home ? 'var(--oa)' : 'var(--ik)',
        xBg: home ? 'rgba(11,12,10,.1)' : 'var(--bg)',
        onRemove: () => this.setState({ ofCities: selCity.filter(x => x !== cn) })
      };
    }),
    ofAddOpen: s.ofAddOpen,
    ofAddLabel: s.ofAddOpen ? 'Cerrar' : '+ Agregar ciudad',
    toggleOfAdd: () => this.setState({ ofAddOpen: !s.ofAddOpen, ofQ: '' }),
    ofQ: s.ofQ,
    onOfQ: (e) => this.setState({ ofQ: e.target.value }),
    ofAddEmpty: addList.length === 0,
    ofAddList: addList.map(([cn, d]) => {
      const n = cnt(cn);
      return {
        name: cn,
        dept: d,
        count: n ? n + (n === 1 ? ' PROYECTO' : ' PROYECTOS') : 'SIN PROYECTOS',
        countColor: n ? 'var(--at)' : 'var(--fa)',
        onClick: () => this.setState({ ofCities: [...selCity, cn], ofAddOpen: false, ofQ: '' })
      };
    }),
    ofNone: selCity.length === 0,
    ofGroups: ordered.map(cn => {
      const items = PROYECTOS.filter(p => p.c === cn).map(card).sort((a, b) => (a._st - b._st) || (a._p - b._p));
      return {
        city: cn,
        home: cn === s.ciudad,
        count: items.length + (items.length === 1 ? ' proyecto' : ' proyectos'),
        items,
        empty: items.length === 0,
        emptyMsg: 'Aún no hay proyectos aliados en ' + cn + '. Te avisamos cuando lleguen.'
      };
    }),
    openSheet: () => this.setState({ sheet: true, sheetKind: s.regKind === 'egr' && tab === 'ingresos' ? 'deuda' : 'ingreso', sheetFreq: 'diario', editingDebtId: null, formError: '' }),
    openDebtSheet: () => this.setState({ sheet: true, sheetKind: 'deuda', sheetFreq: 'fijo', editingDebtId: null, debtForm: { tipo: 'Tarjeta de crédito', cuota: 0, saldo: 0, entidad: '', nombre: '' }, formError: '' }),
    openExpenseSheet: () => this.setState({ sheet: true, sheetKind: 'deuda', sheetFreq: 'diario', editingDebtId: null, formError: '' }),
    openFixedIncome: () => this.setState({ sheet: true, sheetKind: 'ingreso', sheetFreq: 'fijo', editingDebtId: null, formError: '' }),
    sheetEgrFijo: s.sheetKind === 'deuda' && s.sheetFreq === 'fijo',
    sheetIngDia: s.sheetKind !== 'deuda' && s.sheetFreq !== 'fijo',
    sheetIngFijo: s.sheetKind !== 'deuda' && s.sheetFreq === 'fijo',
    sheetEgrDia: s.sheetKind === 'deuda' && s.sheetFreq !== 'fijo',
    noDebts: s.debts.length === 0,
    sheetKicker: s.sheetKind === 'deuda' ? (s.sheetFreq === 'fijo' ? (s.editingDebtId ? 'EDITAR DEUDA O EGRESO' : 'LO QUE EL BANCO TE DESCUENTA') : 'GASTO DEL DÍA') : (s.sheetFreq === 'fijo' ? 'LLEGA CADA MES' : 'REGISTRO EN 3 SEGUNDOS'),
    sheetKinds: [['ingreso', 'Ingreso'], ['deuda', 'Egreso']].map(([k, l]) => ({ label: l, bg: s.sheetKind === k ? (k === 'deuda' ? 'var(--ik)' : 'var(--ac)') : 'transparent', color: s.sheetKind === k ? (k === 'deuda' ? 'var(--bg)' : 'var(--oa)') : 'var(--mu)', onClick: () => this.setState({ sheetKind: k, formError: '' }) })),
    debtTypeChips: DEBT_TYPES.map(x => ({ label: x, ...chipSel(s.debtForm.tipo === x), onClick: () => this.setState({ debtForm: { ...s.debtForm, tipo: x } }) })),
    dfCuotaTxt: s.debtForm.cuota ? num(s.debtForm.cuota) : '',
    dfSaldoTxt: s.debtForm.saldo ? cop(s.debtForm.saldo) : '',
    dfEntidad: s.debtForm.entidad,
    onDfCuota: (e) => this.setState({ debtForm: { ...s.debtForm, cuota: +(e.target.value.replace(/\D/g, '') || 0) }, formError: '' }),
    onDfSaldo: (e) => this.setState({ debtForm: { ...s.debtForm, saldo: +(e.target.value.replace(/\D/g, '') || 0) } }),
    onDfEntidad: (e) => this.setState({ debtForm: { ...s.debtForm, entidad: e.target.value } }),
    dfHint: s.debtForm.cuota ? 'Esta cuota le resta $' + m1(s.debtForm.cuota * c.tope * c.factor / cfg.fin) + ' M a tu vivienda. Podrás apagarla en Plan para ver cuánto liberas.' : 'Incluye solo cuotas fijas que aparecen en tu historial crediticio o que pagas cada mes.',
    saveDebtLabel: s.editingDebtId ? (s.debtForm.cuota ? 'Guardar cambios · ' + cop(s.debtForm.cuota) + '/mes' : 'Guardar cambios') : (s.debtForm.cuota ? 'Guardar · ' + cop(s.debtForm.cuota) + '/mes' : 'Guardar deuda'),
    dfIsEditing: !!s.editingDebtId,
    deleteCurrentDebt: () => { if (s.editingDebtId) this.deleteDebt(s.editingDebtId); },
    saveDebt: () => {
      const df = s.debtForm;
      if (df.cuota < 1000) { this.setState({ formError: 'Escribe la cuota mensual.' }); return; }
      const base = (df.tipo === 'Otro egreso fijo' && (df.nombre || '').trim()) || df.tipo;
      const name = df.entidad ? base + ' · ' + df.entidad : base;
      if (s.editingDebtId) {
        const editId = s.editingDebtId;
        this.setState(st => ({
          debts: st.debts.map(d => d.id === editId ? { ...d, name, short: SHORT[df.tipo] || 'Deuda', cuota: df.cuota, saldo: df.saldo, entidad: df.entidad } : d),
          sheet: false,
          editingDebtId: null,
          debtForm: { tipo: df.tipo, cuota: 0, saldo: 0, entidad: '', nombre: '' }
        }));
        this.toast('Deuda “' + name + '” actualizada: ' + cop(df.cuota) + '/mes.');
      } else {
        this.setState(st => ({
          debts: [...st.debts, { id: 'd' + Date.now(), name, short: SHORT[df.tipo] || 'Deuda', cuota: df.cuota, saldo: df.saldo, entidad: df.entidad, on: true, paid: false }],
          sheet: false,
          debtForm: { tipo: df.tipo, cuota: 0, saldo: 0, entidad: '', nombre: '' }
        }));
        this.toast(name + ' agregada: −' + cop(df.cuota) + '/mes en tu cálculo.');
      }
    },
    closeSheet: () => this.setState({ sheet: false, editingDebtId: null }),
    sheetFade: s.sheet ? 1 : 0,
    sheetPE: s.sheet ? 'auto' : 'none',
    sheetY: s.sheet ? 'translateY(0)' : 'translateY(105%)',
    formMontoTxt: f.monto ? num(f.monto) : '',
    onMonto: (e) => this.setState({ form: { ...f, monto: +(e.target.value.replace(/\D/g, '') || 0) }, formError: '' }),
    quickChips: [50000, 100000, 250000, 500000].map(v => ({ label: '+' + cop(v), onClick: () => this.setState({ form: { ...f, monto: f.monto + v }, formError: '' }) })),
    fuenteChips: FUENTES.map(x => ({ label: x, ...chipSel(f.fuente === x), onClick: () => this.setState({ form: { ...f, fuente: x } }) })),
    medioChips: MEDIOS.map(x => ({ label: x, ...chipSel(f.medio === x), onClick: () => this.setState({ form: { ...f, medio: x } }) })),
    formError: s.formError,
    saveLabel: f.monto ? 'Guardar · tu techo sube $' + m1(formGain) + ' M' : 'Guardar ingreso',
    saveEntry: () => {
      if (f.monto < 1000) { this.setState({ formError: 'Escribe un monto o toca una cifra rápida.' }); return; }
      const d = new Date(), hora = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      this.setState(st => ({ entries: [...st.entries, { concepto: (f.fuente === 'Otros' && (f.nombre || '').trim()) || f.fuente, fuente: f.fuente, medio: f.medio, monto: f.monto, hora }], added: st.added + f.monto, sheet: false, selDay: 5, form: { ...st.form, monto: 0, nombre: '' } }));
      this.toast('+' + cop(f.monto) + ' registrados. Tu techo sube $' + m1(formGain) + ' M.');
    }
  };
}

