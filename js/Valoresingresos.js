// Preparación de los cálculos de ingresos diarios, flujo de la semana, gastos y consignaciones

function Generarvaloresingresos(c, cfg, sel, chipSel) {
  const s = this.state;
  const todayTotal = s.entries.reduce((a, e) => a + e.monto, 0);
  const cashPend = s.entries.filter(e => e.medio === 'Efectivo').reduce((a, e) => a + e.monto, 0) + s.cashOld;
  const exToday = s.expenses.reduce((a, e) => a + e.monto, 0);
  const exDays = [45000, 30000, 62000, 0, 28000, exToday, null];
  const gastosMes = 640000 + exToday;
  const fijoEff = s.tipo === 'variable' ? 0 : s.fijo;
  const fixTot = fijoEff + s.fixedExtra.reduce((a, f) => a + f.monto, 0);
  const days = [['L', 27, 212000], ['M', 28, 168000], ['M', 29, 240000], ['J', 30, 0], ['V', 31, 195000], ['S', 1, todayTotal], ['D', 2, null]];

  const curDay = (typeof s.selDay === 'number' && s.selDay >= 0 && s.selDay <= 6) ? s.selDay : 5;
  const weekDays = days.map(([d, n, amt], i) => {
    const on = curDay === i, future = amt === null;
    let diaAmt = amt;
    if ((s.regKind || 'ing') === 'egr' && !future) diaAmt = exDays[i];
    return {
      d, n,
      bg: on ? 'var(--ik)' : 'transparent',
      border: on ? 'var(--ik)' : 'var(--ln)',
      color: on ? 'var(--bg)' : future ? 'var(--fa)' : 'var(--ik)',
      sub: on ? 'var(--bg)' : 'var(--mu)',
      dot: diaAmt ? (on ? 'var(--ac)' : 'var(--at)') : 'transparent',
      onClick: () => !future && this.setState({ selDay: i })
    };
  });

  const selAmt = (days[curDay] && days[curDay][2]) || 0;
  const isToday = curDay === 5;
  const openCs = (target) => this.setState({ consign: { target, medio: 'Nequi / DaviPlata' } });

  const rowOf = (e, i) => {
    const cash = e.medio === 'Efectivo';
    return {
      ini: e.fuente.slice(0, 2).toUpperCase(),
      concepto: e.concepto,
      meta: e.consignado ? e.fuente + ' · Efectivo → ' + e.medio + ' · ' + e.hora : e.fuente + ' · ' + e.medio + ' · ' + e.hora,
      monto: cop(e.monto),
      cash,
      done: !!e.consignado,
      noClick: !cash,
      cursor: cash ? 'pointer' : 'default',
      rowBg: cash ? 'rgba(255,106,43,.08)' : 'transparent',
      onClick: cash ? () => openCs(i) : undefined
    };
  };

  const oldRow = s.cashOld > 0 ? [{ ini: 'EF', concepto: 'Efectivo de días anteriores', meta: 'Ventas del día · 3 registros · Efectivo', monto: cop(s.cashOld), cash: true, done: false, noClick: false, cursor: 'pointer', rowBg: 'rgba(255,106,43,.08)', onClick: () => openCs('old') }] : [];
  const dayEntries = isToday ? [...s.entries.map(rowOf).reverse(), ...oldRow]
    : selAmt ? [{ ini: 'VE', concepto: 'Ventas del día', meta: 'Nequi / DaviPlata', monto: cop(selAmt * 0.6), cash: false }, { ini: 'CO', concepto: 'Comisiones', meta: 'Cuenta bancaria', monto: cop(selAmt * 0.4), cash: false }] : [];
  const metaP = selAmt / Math.max(1, c.metaDiaria);

  const wk = [0.235, 0.277, 0.208, 0.28].map((f, k) => f * s.variable + (k === 3 ? s.added : 0));
  const wMax = Math.max(1, ...wk);
  const weekBars = wk.map((v, i) => ({ val: num(v / 1000) + ' mil', label: 'S' + (i + 1), h: s.barsOn ? Math.max(8, v / wMax * 78) + '%' : '0%', bg: i === 3 ? 'var(--ac)' : 'var(--c2)' }));
  const months = c.hist.slice(1).map((v, k) => [MLAB[k + 1], v + c.fijoP]);
  const avg3 = c.fijoP + avgArr(c.hist.slice(-3));
  const avg6 = c.fijoP + avgArr(c.hist.slice(-6));
  const mMax = Math.max(1, ...months.map(m => m[1])) * 1.15;
  const monthBars = months.map(([l, v], i) => ({ label: l, h: s.barsOn ? (v / mMax * 100) + '%' : '0%', bg: i >= 3 ? 'var(--ik)' : 'var(--c2)' }));

  const cs = s.consign;
  const isOld = cs && cs.target === 'old';
  const ent = cs && !isOld ? s.entries[cs.target] : null;
  const csAmt = isOld ? s.cashOld : ent ? ent.monto : 0;

  const FI = ['Salario', 'Pensión', 'Arriendo que recibo', 'Honorarios fijos', 'Otro ingreso fijo'];
  const CATS = ['Transporte', 'Alimentación', 'Insumos del negocio', 'Servicios públicos', 'Salud', 'Otros'];
  const EXM = ['Efectivo', 'Nequi / DaviPlata', 'Tarjeta débito'];
  const fi = s.fiForm, ex = s.exForm;
  const dig = (e) => +(e.target.value.replace(/\D/g, '') || 0);
  const hora = () => {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };
  const ing = (s.regKind || 'ing') === 'ing';
  const selEx = exDays[curDay] || 0;
  const egEntries = isToday ? s.expenses.slice().reverse().map(e => ({ ini: e.cat.slice(0, 2).toUpperCase(), concepto: e.nombre || e.cat, meta: (e.nombre ? e.cat + ' · ' : '') + e.medio + ' · ' + e.hora, monto: '−' + cop(e.monto) }))
    : selEx ? [{ ini: 'TR', concepto: 'Transporte', meta: 'Efectivo', monto: '−' + cop(selEx * 0.4) }, { ini: 'AL', concepto: 'Alimentación', meta: 'Nequi / DaviPlata', monto: '−' + cop(selEx * 0.6) }] : [];
  const deuSum = s.debts.filter(d => d.on).reduce((a, d) => a + d.cuota, 0);
  const catBase = { 'Transporte': 186000, 'Alimentación': 240000, 'Insumos del negocio': 150000, 'Servicios públicos': 64000, 'Salud': 0, 'Otros': 0 };
  s.expenses.forEach(e => { catBase[e.cat] = (catBase[e.cat] || 0) + e.monto; });
  const catMax = Math.max(1, ...Object.values(catBase));

  return {
    fixTot,
    wk,
    gastosMes,
    fijoFmt: cop(fixTot),
    gastosMesFmt: cop(gastosMes),
    tipoLabel: { fijo: 'Fijo', variable: 'Variable', mixto: 'Mixto' }[s.tipo],
    tipoLower: { fijo: 'fijo', variable: 'variable', mixto: 'mixto' }[s.tipo],
    weekDays,
    dayEntries,
    dayTitle: isToday ? 'Hoy llevas' : 'Ese día registraste',
    dayTotal: num(selAmt),
    dayMetaPct: Math.round(metaP * 100) + '%',
    dayMetaW: Math.min(100, metaP * 100) + '%',
    dayMetaMsg: metaP >= 1 ? 'Meta cumplida. Todo lo extra suma a tu cupo.' : 'Te faltan ' + cop(Math.max(0, c.metaDiaria - selAmt)) + ' para el ingreso que necesita tu vivienda.',
    entryCount: dayEntries.length + ' registros',
    creditUp: '$' + m1(Math.abs(c.varAvg - c.varPrev) * c.tope * c.factor) + ' millones',
    creditUpVerb: c.varAvg >= c.varPrev ? 'subió' : 'bajó',
    weekBars,
    varTotal: cop(wk.reduce((a, b) => a + b, 0)),
    deudasFmt: cop(c.deu),
    flujoNeto: cop(fixTot + wk.reduce((a, b) => a + b, 0) - c.deu - gastosMes),
    avg3: '$' + m1(avg3) + ' M',
    avg6: '$' + m1(avg6) + ' M',
    avgLine: (avg3 / mMax * 100) + '%',
    monthBars,
    csFade: cs ? 1 : 0,
    csPE: cs ? 'auto' : 'none',
    csY: cs ? 'translateY(0)' : 'translateY(105%)',
    csConcept: isOld ? 'Efectivo de días anteriores · 3 registros' : ent ? ent.concepto + ' · ' + ent.hora : '',
    csAmt: num(csAmt),
    closeConsign: () => this.setState({ consign: null }),
    csOpts: ['Nequi / DaviPlata', 'Cuenta bancaria'].map(m => {
      const on = cs && cs.medio === m;
      return {
        label: m,
        bg: on ? 'var(--ac)' : 'transparent',
        border: on ? 'var(--ac)' : 'var(--ln)',
        color: on ? 'var(--oa)' : 'var(--ik)',
        ring: on ? 'var(--oa)' : 'var(--fa)',
        dot: on ? 'var(--oa)' : 'transparent',
        onClick: () => this.setState(st => ({ consign: { ...st.consign, medio: m } }))
      };
    }),
    confirmConsign: () => {
      if (!cs) return;
      if (isOld) this.setState({ cashOld: 0, consign: null });
      else this.setState(st => ({ entries: st.entries.map((e, i) => i === cs.target ? { ...e, medio: cs.medio, consignado: true } : e), consign: null }));
      this.toast(cop(csAmt) + ' consignados en ' + cs.medio + '. Ya cuentan para el banco.');
    },
    regIng: ing,
    regEgr: !ing,
    regKinds: [['ing', 'Ingresos', 'LO QUE ENTRA'], ['egr', 'Egresos', 'LO QUE SALE']].map(([k, l, sub]) => {
      const on = (s.regKind || 'ing') === k;
      return {
        label: l,
        sub,
        bg: on ? (k === 'ing' ? 'var(--ac)' : 'var(--al)') : 'var(--cd)',
        border: on ? 'transparent' : 'var(--ln)',
        color: on ? (k === 'ing' ? 'var(--oa)' : '#120A05') : 'var(--ik)',
        onClick: () => this.setState({ regKind: k })
      };
    }),
    egDayTitle: isToday ? 'Hoy gastaste' : 'Ese día gastaste',
    egDayTotal: num(selEx),
    egDayIng: cop(selAmt),
    egDayEx: '−' + cop(selEx),
    egDayNet: cop(selAmt - selEx),
    egEntries,
    egCount: egEntries.length + ' gastos',
    goEgrMes: () => this.setState({ ingView: 'mes', regKind: 'egr' }),
    egFijosFmt: cop(deuSum),
    egMesTotal: num(deuSum + gastosMes),
    egFijosW: (deuSum / Math.max(1, deuSum + gastosMes) * 100) + '%',
    catRows: CATS.filter(k => catBase[k] > 0).map(k => ({ label: k, monto: cop(catBase[k]), w: s.barsOn ? (catBase[k] / catMax * 100) + '%' : '0%' })),
    fixTotFmt: cop(fixTot),
    fixRows: [...(fijoEff ? [{ ini: 'SA', concepto: 'Salario / ingreso fijo', meta: 'Desde tu perfil · cada mes', monto: cop(fijoEff), canRemove: false }] : []),
      ...s.fixedExtra.map((f, i) => ({ ini: f.name.slice(0, 2).toUpperCase(), concepto: f.name, meta: 'Fijo mensual', monto: cop(f.monto), canRemove: true, onRemove: () => this.setState(st => ({ fixedExtra: st.fixedExtra.filter((_, j) => j !== i) })) }))],
    sheetFreqs: [['diario', s.sheetKind === 'deuda' ? 'Gasto del día' : 'Del día'], ['fijo', 'Fijo mensual']].map(([k, l]) => {
      const on = s.sheetFreq === k;
      return { label: l, bg: on ? 'var(--ik)' : 'transparent', color: on ? 'var(--bg)' : 'var(--mu)', border: on ? 'var(--ik)' : 'var(--ln)', onClick: () => this.setState({ sheetFreq: k, formError: '' }) };
    }),
    fiTipoChips: FI.map(x => ({ label: x, ...chipSel(fi.tipo === x), onClick: () => this.setState({ fiForm: { ...fi, tipo: x } }) })),
    fiMontoTxt: fi.monto ? num(fi.monto) : '',
    onFiMonto: (e) => this.setState({ fiForm: { ...fi, monto: dig(e) }, formError: '' }),
    fiHint: fi.monto ? 'Este ingreso suma $' + m1(fi.monto * c.tope * c.factor / cfg.fin) + ' M al precio de tu vivienda.' : 'Ingresos que llegan igual cada mes: pensión, arriendos, honorarios.',
    fiSaveLabel: fi.monto ? 'Guardar · ' + cop(fi.monto) + '/mes' : 'Guardar ingreso fijo',
    saveFixedIncome: () => {
      if (fi.monto < 1000) { this.setState({ formError: 'Escribe el monto mensual.' }); return; }
      const fiName = (fi.tipo === 'Otro ingreso fijo' && (fi.nombre || '').trim()) || fi.tipo;
      this.setState(st => ({ fixedExtra: [...st.fixedExtra, { name: fiName, monto: fi.monto }], sheet: false, fiForm: { ...st.fiForm, monto: 0, nombre: '' } }));
      this.toast(fiName + ' agregado: +' + cop(fi.monto) + '/mes. Tu techo sube $' + m1(fi.monto * c.tope * c.factor / cfg.fin) + ' M.');
    },
    exMontoTxt: ex.monto ? num(ex.monto) : '',
    onExMonto: (e) => this.setState({ exForm: { ...ex, monto: dig(e) }, formError: '' }),
    exCatChips: CATS.map(x => ({ label: x, ...chipSel(ex.cat === x), onClick: () => this.setState({ exForm: { ...ex, cat: x } }) })),
    exMedioChips: EXM.map(x => ({ label: x, ...chipSel(ex.medio === x), onClick: () => this.setState({ exForm: { ...ex, medio: x } }) })),
    exSaveLabel: ex.monto ? 'Guardar gasto · −' + cop(ex.monto) : 'Guardar gasto',
    saveExpense: () => {
      if (ex.monto < 500) { this.setState({ formError: 'Escribe cuánto gastaste.' }); return; }
      this.setState(st => ({ expenses: [...st.expenses, { cat: ex.cat, nombre: ex.cat === 'Otros' ? (ex.nombre || '').trim() : '', medio: ex.medio, monto: ex.monto, hora: hora() }], sheet: false, selDay: 5, regKind: 'egr', exForm: { ...st.exForm, monto: 0, nombre: '' } }));
      this.toast('Gasto de ' + cop(ex.monto) + ' en ' + ((ex.cat === 'Otros' && (ex.nombre || '').trim()) || ex.cat.toLowerCase()) + ' registrado.');
    },
    ingCode: (s.ingView || 'dia') === 'dia' ? 'P5 · MI DÍA' : (s.ingView || 'dia') === 'mes' ? 'P6 · MI MES' : 'P7 · MI AÑO',
    ingSegs: [['dia', 'Día', ''], ['mes', 'Mes', ''], ['ano', 'Año', 'F2']].map(([k, l, t]) => ({ label: l, tag: t, bg: (s.ingView || 'dia') === k ? 'var(--ik)' : 'transparent', color: (s.ingView || 'dia') === k ? 'var(--bg)' : 'var(--mu)', onClick: () => this.setState({ ingView: k }) })),
    ingIsDia: (s.ingView || 'dia') === 'dia',
    ingIsMes: (s.ingView || 'dia') === 'mes',
    ingIsAno: (s.ingView || 'dia') === 'ano'
  };
}

