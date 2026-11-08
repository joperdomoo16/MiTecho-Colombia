// Preparación de los datos del perfil del usuario, entidades financieras y configuración inicial

function Generarvaloresperfil(c, chipSel, dark) {
const s = this.state, r = s.rem;
    const digits = (e) => +(e.target.value.replace(/\D/g, '') || 0);
    const parts = s.nombre.trim().split(/\s+/).filter(Boolean);
    const tg = (on) => ({ track: on ? 'var(--ac)' : 'var(--c2)', knob: on ? 'var(--oa)' : 'var(--mu)', x: on ? 'translateX(22px)' : 'none' });
    const setRem = (patch) => this.setState(st => ({ rem: { ...st.rem, ...patch } }));
    const CIUDADES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena'];
    const HORAS = ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];
    const todayTotal = s.entries.reduce((a, e) => a + e.monto, 0);
    const maxPlazo = Math.max(0, Math.min(30, 75 - (s.edad || 0)));
    const dailyT = tg(r.daily);

    return {
      isPerfil: this.screen === 'app' && s.panel === 'perfil',
      isRem: this.screen === 'app' && s.panel === 'rem',
      closePanel: () => this.setState({ panel: null }),
      firstName: parts[0] || 'Hola',
      fullName: s.nombre || 'Sin nombre',
      initials: ((parts[0] || '?')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase(),
      ciudad: s.ciudad,
      metaFmt: cop(c.metaDiaria),
      ahorroM: '$' + m1(s.ahorro) + ' M',
      pfNombre: s.nombre,
      onPfNombre: (e) => this.setState({ nombre: (e.target.value || '').slice(0, 70) }),
      pfEdad: s.edad ? String(s.edad) : '',
      onPfEdad: (e) => this.setState({ edad: Math.min(99, digits(e)) }),
      edadHint: s.edad ? 'Con ' + s.edad + ' años, el plazo máximo de tu crédito sería de unos ' + maxPlazo + ' años.' : 'Tu edad define el plazo máximo del crédito.',
      cityOpen: s.cityOpen,
      cityQ: s.cityQ,
      cityChevron: s.cityOpen ? 'rotate(180deg)' : 'none',
      cityBorder: s.cityOpen ? 'var(--ad)' : 'transparent',
      cityDept: (CITIES.find(x => x[0] === s.ciudad) || ['', 'Colombia'])[1],
      toggleCity: () => this.setState({ cityOpen: !s.cityOpen, cityQ: '' }),
      onCityQ: (e) => this.setState({ cityQ: e.target.value }),
      ...(() => {
        const q = norm(s.cityQ.trim());
        const f = q ? CITIES.filter(([cn, d]) => norm(cn).includes(q) || norm(d).includes(q)) : CITIES;
        return {
          cityCount: f.length + (f.length === 1 ? ' CIUDAD' : ' CIUDADES'),
          cityEmpty: f.length === 0,
          cityList: f.map(([cn, d]) => {
            const sel = cn === s.ciudad;
            return {
              name: cn,
              dept: d,
              sel,
              bg: sel ? 'var(--ac)' : 'transparent',
              color: sel ? 'var(--oa)' : 'var(--ik)',
              sub: sel ? 'rgba(11,12,10,.65)' : 'var(--mu)',
              onClick: () => this.setState({ ciudad: cn, cityOpen: false, cityQ: '' })
            };
          })
        };
      })(),
      ciudadChips: CIUDADES.map(x => ({ label: x, ...chipSel(s.ciudad === x), onClick: () => this.setState({ ciudad: x }) })),
      pfTipoChips: [['fijo', 'Fijo'], ['variable', 'Variable'], ['mixto', 'Mixto']].map(([k, l]) => ({ label: l, ...chipSel(s.tipo === k), onClick: () => this.setState({ tipo: k, useAuto: true }) })),
      pfShowFijo: s.tipo !== 'variable',
      pfShowVar: s.tipo !== 'fijo',
      pfFijo: s.fijo ? cop(s.fijo) : '',
      onPfFijo: (e) => this.setState({ fijo: digits(e), useAuto: true }),
      pfVar: s.variable ? cop(s.variable) : '',
      onPfVar: (e) => this.setState({ variable: digits(e), useAuto: true }),
      pfIngTotal: cop((s.tipo === 'variable' ? 0 : s.fijo) + (s.tipo === 'fijo' ? 0 : s.variable)),
      pfAhorro: s.ahorro ? cop(s.ahorro) : '',
      onPfAhorro: (e) => this.setState({ ahorro: digits(e) }),
      pfAhorroMes: s.ahorroMes ? cop(s.ahorroMes) : '',
      onPfAhorroMes: (e) => this.setState({ ahorroMes: digits(e) }),
      pfObj: s.objetivo ? cop(s.objetivo) : '',
      onPfObj: (e) => this.setState({ objetivo: digits(e) }),
      pfMetaInfo: 'Con esta vivienda tu meta diaria es ' + cop(c.metaDiaria) + ': (ingreso necesario ' + cop(c.ingNec) + ' − ingresos fijos ' + cop(c.fijoP) + ') ÷ 26 días.',
      cajaOn: s.caja,
      toggleCaja: () => this.setState({ caja: !s.caja }),
      cajaTrack: tg(s.caja).track,
      cajaKnob: tg(s.caja).knob,
      cajaX: tg(s.caja).x,
      cajaChips: ['Compensar', 'Colsubsidio', 'Cafam', 'Comfama', 'Comfenalco', 'Comfandi', 'Cajacopi', 'Otra'].map(x => ({ label: x, ...chipSel(s.cajaNombre === x), onClick: () => this.setState({ cajaNombre: x }) })),
      toggleSisben: () => this.setState({ sisben: !s.sisben }),
      sisbenTrack: tg(s.sisben).track,
      sisbenKnob: tg(s.sisben).knob,
      sisbenX: tg(s.sisben).x,
      pfDebtCount: s.debts.length ? s.debts.length + (s.debts.length === 1 ? ' deuda registrada' : ' deudas registradas') : 'Sin deudas registradas',
      pfDebtSum: cop(s.debts.filter(d => d.on).reduce((a, d) => a + d.cuota, 0)) + ' al mes en el cálculo',
      pfGoDebts: () => this.setState({ panel: null, tab: 'plan' }),
      pfExport: () => this.toast('Te enviamos tus datos a ' + (s.email || 'tu correo') + '.'),
      pfDelete: () => {
        if (!window.confirm('¿Borrar todos tus datos de este celular? Esta acción no se puede deshacer.')) return;
        Borrardatosalmacenados(s.email);
        this.cerrarSesionUsuario();
      },
      remPreviewO: r.daily ? 1 : 0.4,
      remHora: r.daily ? r.hora : 'Apagado',
      remPreview: r.daily ? 'Hoy llevas ' + cop(todayTotal) + '. Registra lo que falta y mantén tu racha.' : 'Recordatorio diario apagado.',
      toggleDaily: () => setRem({ daily: !r.daily }),
      dailyOn: r.daily,
      dailyTrack: dailyT.track,
      dailyKnob: dailyT.knob,
      dailyX: dailyT.x,
      horaChips: HORAS.map(x => ({ label: x, ...chipSel(r.hora === x), onClick: () => setRem({ hora: x }) })),
      diaChips: ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((l, i) => ({ label: l, bg: r.dias[i] ? 'var(--ik)' : 'transparent', color: r.dias[i] ? 'var(--bg)' : 'var(--mu)', border: r.dias[i] ? 'var(--ik)' : 'var(--ln)', onClick: () => setRem({ dias: r.dias.map((v, j) => j === i ? !v : v) }) })),
      remToggles: [
        ['cash', 'Efectivo sin consignar', 'Si pasan 3 días con efectivo sin consignar'],
        ['weekly', 'Resumen semanal', 'Los lunes: cuánto subió tu techo'],
        ['pagos', 'Pago de cuotas', '2 días antes de cada cuota de tus deudas'],
        ['subsidios', 'Subsidios y proyectos', 'Proyectos VIS y subsidios que te caben']
      ].map(([k, l, sub]) => ({ label: l, sub, ...tg(r[k]), onClick: () => setRem({ [k]: !r[k] }) }))
    };
  
}

function Generarvaloresentidades(c, sel) {
const s = this.state, tab = s.entTab === 'fna' ? 'fna' : 'caja', E = (s.entInfo || {})[tab] || {};
    const set = (k, v) => this.setState(st => ({ entInfo: { ...(st.entInfo || {}), [tab]: { ...((st.entInfo || {})[tab] || {}), [k]: v } } }));
    const money = (k, label, hint) => ({ isInput: true, label, val: E[k] ? cop(E[k]) : '', mode: 'numeric', ph: '$0', hint: hint || '', onInput: (e) => set(k, +(e.target.value.replace(/\D/g, '') || 0)) });
    const numF = (k, label, ph, hint, dec) => ({ isInput: true, label, val: E[k] ? String(E[k]).replace('.', ',') : '', mode: dec ? 'decimal' : 'numeric', ph, hint: hint || '', onInput: (e) => { const t = e.target.value.replace(',', '.').replace(dec ? /[^\d.]/g : /\D/g, ''); set(k, t === '' ? 0 : (dec ? parseFloat(t) || 0 : +t)); } });
    const textF = (k, label, ph) => ({ isInput: true, label, val: E[k] || '', mode: 'text', ph, hint: '', onInput: (e) => set(k, e.target.value.slice(0, 20)) });
    const chips = (k, label, opts) => ({ isChips: true, label, opts: opts.map(o => ({ label: o, ...sel(E[k] === o), onClick: () => set(k, E[k] === o ? '' : o) })) });
    const isFna = tab === 'fna', name = isFna ? 'FNA' : (s.cajaNombre || 'tu Caja');
    let afilSt = {}, subSt = {};
    if (E.meses > 0 && E.mesesReq > 0) {
      const f = E.mesesReq - E.meses;
      if (f <= 0) afilSt = { status: 'Cumples el tiempo mínimo (' + E.meses + ' de ' + E.mesesReq + ' meses).', statusBg: 'var(--ac)' };
      else { const d = new Date(); d.setMonth(d.getMonth() + f); afilSt = { status: 'Te faltan ' + f + (f === 1 ? ' mes' : ' meses') + ': lo cumples en ' + d.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }) + '.', statusBg: '#FFD23F' }; }
    } else if (E.meses > 0 || E.mesesReq > 0) afilSt = { status: 'Escribe ' + (E.meses > 0 ? 'el tiempo mínimo que te pide la entidad' : 'tus meses de afiliación') + ' para saber si ya cumples.', statusBg: 'var(--c2)' };
    const vm = vigMeses(E.subVence);
    if (E.subVence && vm === null) subSt = { status: 'Escribe la vigencia como mes/año, por ejemplo 12/2027.', statusBg: 'var(--c2)' };
    else if (vm !== null && vm < 0) subSt = { status: 'Tu subsidio venció. No lo sumamos a tu cuota inicial; pregunta en ' + name + ' si puedes prorrogarlo.', statusBg: 'var(--al)' };
    else if (vm !== null && vm <= 3) subSt = { status: 'Tu subsidio vence en ' + (vm <= 0 ? 'este mes' : vm + (vm === 1 ? ' mes' : ' meses')) + '. Úsalo antes o pide una prórroga.', statusBg: '#FFD23F' };
    else if (vm !== null) subSt = { status: 'Vigente por ' + vm + ' meses más.', statusBg: 'var(--ac)' };

    const sections = [
      { n: '01', title: 'Afiliación', desc: isFna ? 'Cómo ahorras en el Fondo Nacional del Ahorro.' : 'Tu vínculo con ' + name + '.', fields: [
        chips('vinculo', 'TIPO DE VINCULACIÓN', isFna ? ['Cesantías', 'Ahorro voluntario (AVC)', 'Ambos'] : ['Dependiente', 'Independiente', 'Pensionado']),
        numF('meses', 'MESES DE AFILIACIÓN', '0'),
        numF('mesesReq', 'TIEMPO MÍNIMO QUE TE PIDE (MESES)', '0', isFna ? 'Pregúntalo en el FNA: es el ahorro mínimo antes de pedir crédito.' : 'Pregúntalo en ' + name + ': es la afiliación mínima para postularte al subsidio.') ], ...afilSt },
      { n: '02', title: 'Ahorro en la entidad', desc: 'Saldos que puedes usar para la cuota inicial. No los incluyas si ya los sumaste en "Ahorro para cuota inicial".', fields: [
        money('ces', isFna ? 'SALDO DE CESANTÍAS EN EL FNA' : 'SALDO DE CESANTÍAS (TU FONDO)'),
        money('ahorro', isFna ? 'SALDO DE AHORRO VOLUNTARIO (AVC)' : 'AHORRO PROGRAMADO EN LA CAJA') ] },
      { n: '03', title: 'Subsidio', desc: 'Si ya te postulaste o te asignaron un subsidio, usamos el valor real en vez del estimado.', fields: [
        chips('subEstado', 'ESTADO', ['No me he postulado', 'Postulado', 'Asignado', 'Aplicado']),
        money('subMonto', 'VALOR ASIGNADO', isFna ? 'Por ejemplo, Mi Casa Ya tramitado con el FNA.' : 'Aparece en la carta de asignación de tu Caja.'),
        textF('subVence', 'VIGENCIA (MES/AÑO)', '12/2027') ], ...subSt },
      { n: '04', title: 'Crédito preaprobado', desc: 'Si ' + name + ' ya te preaprobó un crédito, escribe sus condiciones. Se usan cuando eliges esta entidad en Simular.', fields: [
        money('monto', 'MONTO PREAPROBADO'),
        numF('tasa', 'TASA E.A. (%)', '0,0', '', true),
        numF('plazo', 'PLAZO (AÑOS)', '0'),
        numF('fin', 'FINANCIACIÓN (% DEL INMUEBLE)', '0', 'Hasta 80% en VIS; el FNA puede financiar más en VIS y VIP.') ] }
    ];

    const KEYS = ['vinculo', 'meses', 'mesesReq', 'ces', 'ahorro', 'subEstado', 'subMonto', 'subVence', 'monto', 'tasa', 'plazo', 'fin'];
    const filled = (o) => KEYS.filter(k => o && o[k] !== undefined && o[k] !== '' && o[k] !== 0).length;
    const tot = filled((s.entInfo || {}).caja) + filled((s.entInfo || {}).fna);
    const using = [];
    if (c.ahorroEnt > 0) using.push('Sumamos ' + cop(c.ahorroEnt) + ' de cesantías y ahorros a tu cuota inicial');
    const EI = s.entInfo || {};
    ['caja', 'fna'].forEach(k => { const o = EI[k] || {}; if (o.meses > 0 && o.mesesReq > o.meses) using.push('Aún no cumples el tiempo mínimo en ' + (k === 'fna' ? 'el FNA' : (s.cajaNombre || 'tu Caja')) + ': ' + (k === 'fna' ? 'el crédito' : 'el subsidio') + ' podría no aplicar todavía'); });
    if (c.subCajaReal) using.push('Usamos tu subsidio asignado por la Caja');
    if (c.subFnaReal) using.push('Usamos tu subsidio asignado con el FNA');
    if (c.preMonto || c.preTasa) using.push('Simular usa el crédito preaprobado de ' + (c.entK === 'fna' ? 'FNA' : s.cajaNombre || 'tu Caja'));
    else if (filled(E) && (E.monto || E.tasa)) using.push('Elige ' + name + ' en Simular para usar su crédito preaprobado');

    return {
      entTabs: [['caja', s.cajaNombre ? 'Caja · ' + s.cajaNombre : 'Caja de compensación'], ['fna', 'Fondo Nacional del Ahorro']].map(([k, l]) => { const on = tab === k; return { label: l, bg: on ? 'var(--ik)' : 'transparent', color: on ? 'var(--bg)' : 'var(--mu)', onClick: () => this.setState({ entTab: k }) }; }),
      entSections: sections,
      entTabName: name,
      entPrecLabel: tot ? tot + ' DE ' + (KEYS.length * 2) + ' DATOS' : 'ESTIMADO GENERAL',
      entPrecW: Math.round(tot / (KEYS.length * 2) * 100) + '%',
      entUsing: using,
      entClear: () => this.setState(st => ({ entInfo: { ...(st.entInfo || {}), [tab]: {} } }))
    };
  
}

function Generarvaloressetup(c, chipSel) {
const s = this.state, su = s.setup, step = su.step;
    const suSet = (patch) => this.setState(st => ({ setup: { ...st.setup, ...patch, err: '' } }));
    const err = (m) => this.setState(st => ({ setup: { ...st.setup, err: m } }));
    const digits = (e) => +(e.target.value.replace(/\D/g, '') || 0);
    const fijo = su.tipo === 'variable' ? 0 : su.fijo, vari = su.tipo === 'fijo' ? 0 : su.variable;
    const suSmm = (fijo + vari) / SMMLV, suMod = suSmm <= 4 ? 'vis' : 'novis';
    const scState = { ...s, tipo: su.tipo, fijo, variable: vari, added: 0, useAuto: true, pareja: false, fixedExtra: [], ahorro: su.ahorro, caja: su.caja, sisben: su.sisben };
    const sc = this.calc(scState, su.debts.map(d => ({ ...d, on: true })), suMod);
    const tgl = (on) => ({ track: on ? 'var(--ac)' : 'var(--c2)', knob: on ? 'var(--oa)' : 'var(--mu)', x: on ? 'translateX(22px)' : 'none' });
    const subS = (su.caja && suSmm <= 4 ? (suSmm <= 2 ? 30 : 20) : 0) + (su.sisben && suSmm <= 2 ? 20 : 0);
    const potS = suSmm <= 2 ? 30 : suSmm <= 4 ? 20 : 0;
    const suSubMsg = suSmm > 4 ? 'Con ingresos mayores a 4 SMMLV no aplicas a subsidio de Caja. Te mostraremos vivienda No VIS.'
      : !su.caja ? 'Sin Caja no recibes subsidio. ' + (su.tipo !== 'fijo' ? 'Como independiente puedes afiliarte aportando el 0,6% o el 2% de tus ingresos y postularte a ' + cop(potS * SMMLV) + '.' : 'Pregúntale a tu empresa a qué Caja te afilió.')
      : 'Te corresponden ' + subS + ' SMMLV (' + cop(subS * SMMLV) + ')' + (su.sisben && suSmm <= 2 ? ' sumando Mi Casa Ya' : '') + ' para vivienda VIS.';
    const subOk = su.caja && subS > 0 && suSmm <= 4;
    const TIPOS = [['fijo', 'Fijo', 'Salario o pensión'], ['variable', 'Variable', 'Ventas, turnos, comisiones, servicios'], ['mixto', 'Mixto', 'Salario más ingresos variables']];
    const finish = () => {
      const nuevoEstado = { fijo, variable: vari, tipo: su.tipo, manualIng: fijo + vari, useAuto: true, added: 0, fixedExtra: [], mod: suMod, ahorro: su.ahorro, ahorroMes: su.ahorroMes || s.ahorroMes, caja: su.caja, cajaNombre: su.cajaNombre, sisben: su.sisben, debts: su.debts.map((d, i) => ({ id: 's' + i, name: d.name, short: SHORT[d.tipo] || 'Deuda', cuota: d.cuota, saldo: 0, on: true, paid: false })), setupDone: true, screen: 'app', tab: 'inicio' };
      this.setState(nuevoEstado);
      if (typeof EstadoSesionActual === 'function' && EstadoSesionActual().autenticado) {
        GuardarPerfilApi({
          nombre: s.nombre || '',
          edad: s.edad,
          ciudad: s.ciudad || 'Bogotá',
          tipo_ingreso: su.tipo || 'fijo',
          fijo: fijo || 0,
          variable: vari || 0,
          ahorro: su.ahorro || 0,
          ahorro_mes: su.ahorroMes || s.ahorroMes || 0,
          afiliado_caja: !!su.caja,
          caja_nombre: su.cajaNombre || '',
          sisben: !!su.sisben,
          sisben_grupo: s.sisbenGrupo || 'A1-C8',
          modalidad: suMod || 'vis',
          tasa_tipo: s.rate || 'pesos',
          plazo_anios: s.term || 20,
          pareja: !!s.pareja,
          pareja_nombre: s.parejaNombre || '',
          pareja_ing: s.parejaIng || 0,
          pareja_deu: s.parejaDeu || 0
        }).catch(() => null);
      }
    };

    return {
      isSetup: this.screen === 'setup',
      suStep0: step === 0,
      suStep1: step === 1,
      suStep2: step === 2,
      suStep3: step === 3,
      suStep4: step === 4,
      suCounter: step < 4 ? 'PASO ' + (step + 1) + ' DE 4' : 'TU RESULTADO',
      suBars: [0, 1, 2, 3].map(k => ({ bg: k <= step ? 'var(--ac)' : 'var(--c2)' })),
      suShowBack: step > 0,
      suBack: () => suSet({ step: step - 1 }),
      tipoOpts: TIPOS.map(([k, l, d]) => {
        const on = su.tipo === k;
        return {
          label: l,
          desc: d,
          bg: on ? 'var(--ac)' : 'var(--cd)',
          border: on ? 'var(--ac)' : 'var(--ln)',
          color: on ? 'var(--oa)' : 'var(--ik)',
          sub: on ? 'rgba(11,12,10,.65)' : 'var(--mu)',
          ring: on ? 'var(--oa)' : 'var(--fa)',
          dot: on ? 'var(--oa)' : 'transparent',
          onClick: () => suSet({ tipo: k })
        };
      }),
      suShowFijo: su.tipo !== 'variable',
      suShowVar: su.tipo !== 'fijo',
      suFijoTxt: su.fijo ? num(su.fijo) : '',
      suVarTxt: su.variable ? num(su.variable) : '',
      onSuFijo: (e) => suSet({ fijo: digits(e) }),
      onSuVar: (e) => suSet({ variable: digits(e) }),
      suIngTotal: cop(fijo + vari),
      suHasDebts: su.debts.length > 0,
      suDeuTotal: cop(su.debts.reduce((a, d) => a + d.cuota, 0)),
      suDebtRows: su.debts.map((d, i) => ({ name: d.name, cuota: cop(d.cuota), onRemove: () => this.setState(st => ({ setup: { ...st.setup, debts: st.setup.debts.filter((_, j) => j !== i) } })) })),
      suTypeChips: DEBT_TYPES.map(x => ({ label: x, ...chipSel(su.dTipo === x), onClick: () => suSet({ dTipo: x }) })),
      suDCuotaTxt: su.dCuota ? num(su.dCuota) : '',
      onSuDCuota: (e) => suSet({ dCuota: digits(e) }),
      suAddDebt: () => {
        if (su.dCuota < 1000) return err('Escribe la cuota mensual.');
        suSet({ debts: [...su.debts, { tipo: su.dTipo, name: su.dTipo, cuota: su.dCuota }], dCuota: 0, noDebts: false });
      },
      suNoTrack: su.noDebts ? 'var(--ac)' : 'var(--c2)',
      suNoKnob: su.noDebts ? 'var(--oa)' : 'var(--mu)',
      suNoX: su.noDebts ? 'translateX(22px)' : 'none',
      toggleSuNoDebts: () => suSet(su.noDebts ? { noDebts: false } : { noDebts: true, debts: [], dCuota: 0 }),
      suErr: su.err,
      suCta: ['Continuar', 'Continuar', 'Continuar', 'Ver mi resultado', 'Ir a mi inicio'][step],
      suNext: () => {
        if (step === 1 && fijo + vari < 100000) return err('Escribe cuánto recibes al mes.');
        if (step === 2) {
          const debts = su.dCuota >= 1000 ? [...su.debts, { tipo: su.dTipo, name: su.dTipo, cuota: su.dCuota }] : su.debts;
          if (!debts.length && !su.noDebts) return err('Agrega tus deudas o marca “No tengo deudas”.');
          return suSet({ debts, dCuota: 0, step: 3 });
        }
        if (step < 4) return suSet({ step: step + 1 });
        finish();
      },
      suPrice: m1(sc.precio),
      suCredM: '$' + m1(sc.creditoUsado) + ' M',
      suOwnM: '$' + m1(Math.max(0, sc.ci - Math.min(sc.subsidio, sc.ci))) + ' M',
      ...(() => {
        const sub = Math.min(sc.subsidio, sc.ci), own = Math.max(0, sc.ci - sub), P = Math.max(1, sc.precio);
        return { suFinW: (sc.creditoUsado / P * 100) + '%', suFinPct: Math.round(sc.creditoUsado / P * 100) + '%', suOwnPct: Math.round(own / P * 100) + '%' };
      })(),
      suModLabel: suMod === 'vis' ? 'VIVIENDA VIS' : 'VIVIENDA NO VIS',
      suHasSub: sc.subsidio > 0,
      suSubM: cop(Math.min(sc.subsidio, sc.ci)),
      suHoyLabel: sc.limitAhorro ? 'Con lo que tienes hoy cierras hasta' : 'Ya tienes la cuota inicial completa',
      suHoyM: '$' + m1(sc.precioHoy) + ' M',
      suHoyBg: sc.limitAhorro ? '#FFD23F' : 'var(--ac)',
      suOutro: sc.limitAhorro ? (su.ahorroMes ? 'Ahorrando ' + cop(su.ahorroMes) + ' al mes completas tu cuota inicial en ' + Math.ceil(sc.falta / su.ahorroMes) + ' meses.' : 'Define cuánto puedes ahorrar al mes para calcular en cuánto tiempo llegas.') + ' Registra tus ingresos cada día para que tu cupo suba.' : 'Registra tus ingresos cada día para que esta cifra suba.',
      suAhorroTxt: su.ahorro ? num(su.ahorro) : '',
      onSuAhorro: (e) => suSet({ ahorro: digits(e) }),
      suAhMesTxt: su.ahorroMes ? num(su.ahorroMes) : '',
      onSuAhMes: (e) => suSet({ ahorroMes: digits(e) }),
      suCajaOn: su.caja,
      suToggleCaja: () => suSet({ caja: !su.caja }),
      suCajaTrack: tgl(su.caja).track,
      suCajaKnob: tgl(su.caja).knob,
      suCajaX: tgl(su.caja).x,
      suCajaChips: ['Compensar', 'Colsubsidio', 'Cafam', 'Comfama', 'Comfenalco', 'Comfandi', 'Cajacopi', 'Otra'].map(x => ({ label: x, ...chipSel(su.cajaNombre === x), onClick: () => suSet({ cajaNombre: x }) })),
      suToggleSisben: () => suSet({ sisben: !su.sisben }),
      suSisTrack: tgl(su.sisben).track,
      suSisKnob: tgl(su.sisben).knob,
      suSisX: tgl(su.sisben).x,
      suSmm: suSmm.toLocaleString('es-CO', { maximumFractionDigits: 1 }),
      suSubMsg,
      suSubBg: subOk ? 'var(--ac)' : 'var(--c2)',
      suSubColor: subOk ? 'var(--oa)' : 'var(--ik)',
      suSubKicker: subOk ? 'rgba(11,12,10,.65)' : 'var(--fa)',
      suFormula: ''
    };
  
}
