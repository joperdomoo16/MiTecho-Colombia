// Preparación de los datos para pantallas secundarias, ventanas desplegables, recordatorios y metas

function Generarvaloresadicionales(c, cfg, sel, ctx) {
const s = this.state, isUvr = s.rate === 'uvr' && s.mod !== 'leasing' && c.entK !== 'caja';
    const tg = (on) => ({ track: on ? 'var(--ac)' : 'var(--c2)', knob: on ? 'var(--oa)' : 'var(--mu)', x: on ? 'translateX(22px)' : 'none' });
    const factorShort = c.factor.toLocaleString('es-CO', { maximumFractionDigits: 1 });
    const eaFmt = pctFmt(c.ea) + (isUvr ? ' + UVR' : ' E.A.');
    const objP = c.obj, credObj = Math.min(c.credito, objP * cfg.fin), ciObj = objP - credObj, gastosObj = objP * cfg.gastos;
    const totalObj = ciObj + gastosObj, faltaObj = Math.max(0, totalObj - c.cash), mensual = faltaObj / (s.ciPlazo || 24);
    const mesesRitmo = s.ahorroMes > 0 ? Math.ceil(faltaObj / s.ahorroMes) : null;
    let p8Msg, p8Ok = false;
    if (faltaObj <= 0) { p8Msg = 'Ya tienes la cuota inicial y los gastos para esta vivienda.'; p8Ok = true; }
    else if (s.ahorroMes >= mensual) { p8Msg = 'Vas bien: ahorrando ' + cop(s.ahorroMes) + ' al mes llegas en ' + mesesRitmo + ' meses.'; p8Ok = true; }
    else p8Msg = (s.ahorroMes > 0 ? 'Hoy ahorras ' + cop(s.ahorroMes) + ': te faltan ' + cop(mensual - s.ahorroMes) + ' más al mes. A tu ritmo llegas en ' + mesesRitmo + ' meses.' : 'Aún no registras ahorro mensual. Defínelo en tu perfil.');
    const sal = s.tipo === 'variable' ? 0 : s.fijo, prima = sal, ces = sal, intCes = ces * 0.12;
    const anoFijoV = c.fijoP * 12, anoVarV = c.varAvg * 12, total = anoFijoV + anoVarV + prima + ces + intCes;
    const aporte = (prima + ces) * (s.anoPct ?? 50) / 100;
    const mSin = s.ahorroMes > 0 ? Math.ceil(c.falta / s.ahorroMes) : null, mCon = (s.ahorroMes + aporte / 12) > 0 ? Math.ceil(c.falta / (s.ahorroMes + aporte / 12)) : null;
    const tIng = 1400 * UVT, tPat = 4500 * UVT, consig = total * 0.9;
    const rRows = [['Ingresos brutos del año', total, tIng, '1.400 UVT'], ['Consignaciones y depósitos', consig, tIng, '1.400 UVT'], ['Patrimonio (tu ahorro)', s.ahorro || 0, tPat, '4.500 UVT']];
    const obliged = rRows.some(r => r[1] >= r[2]);

    return {
      factorShort,
      eaFmt,
      plazoFmt: c.plazo + ' años',
      sensCredFmt: cop(c.sensCred),
      avgNLabel: c.N + ' meses',
      ipcFmt: pctFmt(IPC),
      factorLabel: '× ' + factorShort + ' CRÉDITO (' + eaFmt + ', ' + c.plazo + ' AÑOS)',
      openHelpCond: () => this.setState({ help: true, helpOpen: 11 }),
      openHelpPareja: () => this.setState({ help: true, helpOpen: 12 }),
      openHelpPlazo: () => this.setState({ help: true, helpOpen: 21 }),
      closeHelp: () => this.setState({ help: false }),
      contactSupportHelp: () => {
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
      hasSupportModal: Boolean(s.supportOpen),
      supDisplay: s.supportOpen ? 'flex' : 'none',
      supBackdropDisplay: s.supportOpen ? 'block' : 'none',
      supTransform: s.supAnim ? ('translateY(' + (Math.max(0, s.supY || 0)) + 'px)') : 'translateY(100%)',
      supTransition: s.supDragging ? 'none' : 'transform .32s cubic-bezier(.22,1,.36,1)',
      supBackdropOpacity: s.supAnim ? Math.max(0, 1 - (s.supY || 0) / 350) : 0,
      onSupTouchStart: (e) => {
        const t = e.nativeEvent ? e.nativeEvent.touches[0] : (e.touches ? e.touches[0] : null);
        if (!t) return;
        this._supStartY = t.clientY;
        this.setState({ supDragging: true });
      },
      onSupTouchMove: (e) => {
        if (!this._supStartY) return;
        const t = e.nativeEvent ? e.nativeEvent.touches[0] : (e.touches ? e.touches[0] : null);
        if (!t) return;
        const dy = t.clientY - this._supStartY;
        if (dy > 0) {
          this.setState({ supY: dy });
        }
      },
      onSupTouchEnd: () => {
        const dy = s.supY || 0;
        this._supStartY = null;
        if (dy > 90) {
          this.setState({ supAnim: false, supDragging: false });
          clearTimeout(this._supTimer);
          this._supTimer = setTimeout(() => {
            this.setState({ supportOpen: false, supY: 0, supErr: '', supBusy: false });
          }, 240);
        } else {
          this.setState({ supY: 0, supDragging: false });
        }
      },
      closeSupportModal: () => {
        this.setState({ supAnim: false, supDragging: false });
        clearTimeout(this._supTimer);
        this._supTimer = setTimeout(() => {
          this.setState({ supportOpen: false, supY: 0, supErr: '', supBusy: false });
        }, 240);
      },
      supFormVisible: !s.supSent,
      supSentVisible: Boolean(s.supSent),
      supNombreVal: s.supNombre || '',
      supEmailVal: s.supEmail || '',
      supAsuntoVal: s.supAsunto || '',
      supDescVal: s.supDesc || '',
      supDescCount: ((s.supDesc || '').trim().length) + ' / 500 caracteres · mín. 20',
      supDescColor: ((s.supDesc || '').trim().length >= 20) ? 'var(--at)' : 'var(--mu)',
      supErr: s.supErr || '',
      supBtnText: s.supBusy ? 'Enviando solicitud…' : 'Enviar solicitud',
      onSupNombre: (e) => this.setState({ supNombre: (e.target.value || '').slice(0, 80), supErr: '' }),
      onSupEmail: (e) => this.setState({ supEmail: (e.target.value || '').slice(0, 100), supErr: '' }),
      onSupAsunto: (e) => this.setState({ supAsunto: (e.target.value || '').slice(0, 100), supErr: '' }),
      onSupDesc: (e) => this.setState({ supDesc: (e.target.value || '').slice(0, 500), supErr: '' }),
      resetSupportForm: () => this.setState({ supAsunto: '', supDesc: '', supErr: '', supSent: false, supBusy: false }),
      submitSupportForm: async () => {
        if (s.supBusy) return;
        const nombre = (s.supNombre || '').trim();
        const email = (s.supEmail || '').trim().toLowerCase();
        const asunto = (s.supAsunto || '').trim();
        const descripcion = (s.supDesc || '').trim();
        if (nombre.length < 6) {
          this.setState({ supErr: 'El nombre debe tener al menos 6 caracteres.' });
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          this.setState({ supErr: 'Ingresa un correo electrónico válido (ej. nombre@correo.com).' });
          return;
        }
        if (asunto.length < 6) {
          this.setState({ supErr: 'El asunto debe tener al menos 6 caracteres.' });
          return;
        }
        if (descripcion.length < 20) {
          this.setState({ supErr: 'La descripción debe tener al menos 20 caracteres para explicar tu solicitud.' });
          return;
        }
        this.setState({ supBusy: true, supErr: '' });
        if (typeof RegistrarSolicitudSoporteApi === 'function') {
          await RegistrarSolicitudSoporteApi({ nombre, email, asunto, descripcion, ciudad: s.ciudad });
        }
        this.setState({ supBusy: false, supSent: true });
        this.toast('Gracias por contactarnos, responderemos tu solicitud lo más pronto posible');
      },
      helpScreen: this.screen === 'app' && Boolean(s.help),
      help: (() => {
        const h = {};
        for (let i = 0; i < 22; i++) {
          const on = s.helpOpen === i;
          h['o' + i] = on;
          h['s' + i] = on ? '−' : '+';
          h['b' + i] = on ? 'var(--ac)' : 'var(--c2)';
          h['c' + i] = on ? 'var(--oa)' : 'var(--ik)';
          h['t' + i] = () => this.setState(st => ({ helpOpen: st.helpOpen === i ? -1 : i }));
        }
        return h;
      })(),
      plazoRecomendadoNota: (() => {
        const edad = s.edad || 0;
        const maxLegal = Math.max(5, 75 - edad);
        const esCaja = (s.entidad === 'caja' || c.entK === 'caja');
        if (edad > 45 && maxLegal < (s.term || 20)) {
          return 'Aviso: Por tu edad (' + edad + ' años), el banco limitará tu crédito a máx. ' + maxLegal + ' años (Edad + Plazo ≤ 75).';
        }
        if (esCaja && (s.term || 20) > 20) {
          return 'Aviso: Las Cajas de Compensación financian a un plazo máximo de 20 años.';
        }
        if (s.term === 15) {
          return '15 años: Pagas mucho menos intereses y terminas antes, pero exige una cuota mensual mayor.';
        }
        if (s.term === 30) {
          return '30 años: Cuota mensual más baja para maximizar tu cupo, aunque pagas más intereses en el tiempo.';
        }
        return 'Recomendado: 20 años · Balance óptimo entre cuota mensual accesible y menores intereses pagados frente a 30 años.';
      })(),
      ingLabelHelp: s.pareja ? 'Ingreso del hogar (con pareja)' : 'Ingreso mensual',
      visTopeSmm: c.visTopeS,
      ingNecFmt: cop(c.ingNec),
      ...this.entVals(c, sel),
      openHelpPareja: () => this.setState({ help: true, helpOpen: 12 }),
      ...(() => {
        const pI = s.parejaIng ?? 2400000, pD = s.parejaDeu ?? 300000;
        const solo = this.calc({ ...s, pareja: false }), juntos = this.calc({ ...s, pareja: true });
        const dig = (e) => +(e.target.value.replace(/\D/g, '') || 0);
        const band = (x) => x <= 2 ? 30 : x <= 4 ? 20 : 0;
        const bSolo = band(solo.smm), bJ = band(juntos.smm);
        const warn = bJ < bSolo;
        const subMsg = warn ? 'Juntos ganan ' + juntos.smm.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' SMMLV: ' + (bJ ? 'el subsidio de Caja bajaría de ' + bSolo + ' a ' + bJ + ' SMMLV.' : 'perderían el subsidio de Caja (tope 4 SMMLV).') : '';
        return {
          parejaOn: !!s.pareja,
          parejaSub: 'Suma ingresos y deudas de un segundo solicitante',
          pjNombre: s.parejaNombre || '',
          onPjNombre: (e) => this.setState({ parejaNombre: (e.target.value || '').slice(0, 70) }),
          pjIngTxt: pI ? cop(pI) : '',
          pjDeuTxt: pD ? cop(pD) : '',
          onPjIng: (e) => this.setState({ parejaIng: dig(e) }),
          onPjDeu: (e) => this.setState({ parejaDeu: dig(e) }),
          pjSoloM: '$' + m1(solo.precio) + ' M',
          pjJuntosM: '$' + m1(juntos.precio) + ' M',
          pjSubWarn: warn && s.mod === 'vis',
          pjSubMsg: subMsg,
          pjMiIng: cop(solo.ing),
          pjSuIng: cop(pI),
          pjDeuTot: '−' + cop(juntos.deu),
          pjNeto: cop(juntos.neto),
          pjSubHelp: warn ? 'Con tus datos: ' + subMsg : 'Con tus datos, sumar ingresos no cambia tu subsidio.'
        };
      })(),
      ...(() => {
        const a3 = c.fijoP + avgArr(c.hist.slice(-3)), a6 = c.fijoP + avgArr(c.hist.slice(-6));
        const cA = this.calc({ ...s, flex40: false }), cB = this.calc({ ...s, flex40: true });
        const cL1 = this.calc({ ...s, opc: 0.01 }, null, 'leasing'), cL30 = this.calc({ ...s, opc: 0.30 }, null, 'leasing');
        return {
          hcAvgT: c.varAvg > 0 ? 'Hoy usas ' + c.N + ' meses: tu ingreso es ' + cop(c.ing1) + (s.pareja ? ' (sin pareja)' : '') : 'No tienes ingresos variables',
          hcAvgD: c.varAvg > 0 ? 'Si ganas por ventas, turnos o comisiones, el banco no mira tu mejor mes sino el promedio de tus extractos. Con 3 meses tu ingreso sería ' + cop(a3) + ' y con 6 meses ' + cop(a6) + '. Con 6 meses el promedio es más estable; con 3 pesan más los meses recientes.' : 'Con salario fijo el banco toma tu salario mensual. Si empiezas a registrar ingresos variables, aquí verás su promedio de 3 o 6 meses.',
          hcTopeT: 'Hoy usas ' + Math.round(c.tope * 100) + '%: cuota hasta ' + cop(c.cap),
          hcTopeD: 'Es la parte de tu ingreso, ya restadas las deudas, que puede ir a la cuota de vivienda. En VIS la ley la fija en 30%. En No VIS y leasing algunos bancos aceptan hasta 40%: con tus datos en ' + MODS[s.mod === 'vis' ? 'novis' : s.mod].label + ' el cupo pasaría de $' + m1(s.mod === 'vis' ? this.calc({ ...s, flex40: false }, null, 'novis').precio : cA.precio) + ' M a $' + m1(s.mod === 'vis' ? this.calc({ ...s, flex40: true }, null, 'novis').precio : cB.precio) + ' M.',
          hcOpcT: s.mod === 'leasing' ? 'Hoy usas ' + pctFmt(c.opc) + ': pago final de ' + cop(c.opcionCompra) : 'Solo aplica si eliges leasing',
          hcOpcD: 'En leasing el banco es dueño de la vivienda hasta el final; pagas un canon mensual y, al terminar, la opción de compra para que quede a tu nombre. Entre más alta, menor el canon y mayor el cupo: con tus datos, con 1% tu cupo sería $' + m1(cL1.precio) + ' M y con 30% $' + m1(cL30.precio) + ' M, pero pagarías ' + cop(cL30.opcionCompra) + ' al final.',
          hcVipD: 'Si el precio de la vivienda queda en 90 salarios mínimos o menos es VIP (vivienda de interés prioritario). Aplican los mismos subsidios que en VIS y suele haber más proyectos con subsidios distritales. ' + (c.isVip ? 'Tu cupo actual está en rango VIP.' : 'Tu cupo actual está por encima del rango VIP.')
        };
      })(),
      showAvgSel: c.varAvg > 0,
      avgOpts: [3, 6].map(n => ({ label: n + ' meses', ...sel(c.N === n), onClick: () => this.setState({ avgN: n }) })),
      showFlex: s.mod !== 'vis',
      flexOpts: [[false, '30% estándar'], [true, '40% flexible']].map(([v, l]) => ({ label: l, ...sel(!!s.flex40 === v), onClick: () => this.setState({ flex40: v }) })),
      isLeasing: s.mod === 'leasing',
      opcOpts: [0.01, 0.10, 0.30].map(v => ({ label: pctFmt(v), ...sel((s.opc ?? 0.10) === v), onClick: () => this.setState({ opc: v }) })),
      opcFmt: cop(c.opcionCompra),
      opcPct: pctFmt(c.opc),
      isVip: c.isVip,
      vipTopeFmt: cop(c.vipTope),
      entOpts: Object.keys(RATES).filter(k => k !== 'caja' || s.caja).map(k => ({ label: k === 'caja' ? (s.cajaNombre || 'Caja') : k === 'fna' ? 'FNA' : RATES[k].label, ...sel(c.entK === k), onClick: () => this.setState({ entidad: k }) })),
      rateNote: (c.entK === 'fna' ? 'Tasa de referencia FNA 2026 (requiere afiliación por cesantías o ahorro voluntario)' : c.entK === 'caja' ? 'Línea de vivienda de ' + (s.cajaNombre || 'tu Caja') + ' para afiliados: desde 0,9% m.v., en pesos y hasta 20 años. Confirma la tasa con tu Caja' : 'Promedio ponderado Superfinanciera, semana al 23 oct 2026') + ': ' + eaFmt + ' a ' + c.plazo + ' años' + (c.plazo < (s.term || 20) ? ' (limitado por tu edad)' : '') + '.',
      isUvr,
      uvrRows: [1, 5, 10].map(y => ({ label: 'Cuota año ' + y, value: cop(c.cuota * Math.pow(1 + IPC, y - 1)) })),
      uvrEscenarios: (c.proyeccionUvr || []).map(esc => ({
        label: esc.label || ((esc.ipc * 100).toFixed(1).replace('.', ',') + '%'),
        ipcFmt: esc.ipcFmt,
        c1: cop(esc.c1),
        c10: cop(esc.c10),
        c240: cop(esc.c240),
        tEqPct: esc.tEqPct,
        veredicto: esc.ipc <= 0.0558 ? 'Más barato en UVR' : 'Más barato en Pesos'
      })),
      puntoEquilibrioUvr: '5,58% anual',
      financiarGastosOn: Boolean(s.financiarGastos),
      toggleFinanciarGastos: () => this.setState({ financiarGastos: !s.financiarGastos }),
      sisbenOn: s.sisben,
      sisGrpOpts: [['A1-C8', 'A1 a C8 · 30'], ['C9-D20', 'C9 a D20 · 20']].map(([k, l]) => ({ label: l, ...sel(s.sisbenGrupo === k), onClick: () => this.setState({ sisbenGrupo: k }) })),
      planIsCi: s.planView === 'ci',
      planIsDeudas: s.planView !== 'ci',
      planTitle: s.planView === 'ci' ? 'Cuota inicial' : 'Apagar deudas',
      planSegs: [['deudas', 'Apagar deudas'], ['ci', 'Cuota inicial']].map(([k, l]) => { const on = (s.planView || 'deudas') === k; return { label: l, bg: on ? 'var(--ik)' : 'transparent', color: on ? 'var(--bg)' : 'var(--mu)', onClick: () => this.setState({ planView: k }) }; }),
      p8ObjM: '$' + m1(objP) + ' M',
      p8FaltaM: m1(faltaObj),
      p8W: (totalObj > 0 ? Math.min(100, c.cash / totalObj * 100) : 100) + '%',
      p8TengoM: '$' + m1(c.cash) + ' M',
      p8TotalM: '$' + m1(totalObj) + ' M',
      p8ObjFmt: cop(objP),
      p8CredFmt: '−' + cop(credObj),
      p8CiFmt: cop(ciObj),
      p8GastosFmt: cop(gastosObj),
      p8TengoFmt: '−' + cop(c.cash),
      p8FaltaFmt: cop(faltaObj),
      p8CupoCorto: c.credito < objP * cfg.fin - 1,
      p8CupoMsg: 'Con tu ingreso actual el banco te prestaría ' + cop(c.credito) + ', no el ' + Math.round(cfg.fin * 100) + '% de esta vivienda. Para eso necesitas un ingreso de ' + cop(c.ingNec) + ' al mes.',
      p8Plazos: [12, 24, 36].map(n => ({ label: n + ' meses', ...sel((s.ciPlazo || 24) === n), onClick: () => this.setState({ ciPlazo: n }) })),
      p8Mensual: cop(mensual),
      p8Msg,
      p8MsgBg: p8Ok ? 'var(--ac)' : '#FFD23F',
      p8PrimasMsg: sal > 0 ? 'Si destinas el ' + (s.anoPct ?? 50) + '% de tus primas y cesantías, sumas ' + cop(aporte) + ' al año a tu cuota inicial.' : 'Sin contrato laboral no recibes primas ni cesantías. Mira tu año completo en Mi Año.',
      goAno: () => this.setState({ tab: 'ingresos', ingView: 'ano' }),
      anoIngM: m1(total),
      anoFijo: cop(anoFijoV),
      anoVar: cop(anoVarV),
      anoPrest: sal > 0,
      anoNoPrest: sal <= 0,
      anoPrima: cop(prima),
      anoCes: cop(ces),
      anoIntCes: cop(intCes),
      anoTotal: cop(total),
      anoPctOpts: [0, 25, 50, 75, 100].map(v => ({ label: v + '%', ...sel((s.anoPct ?? 50) === v), onClick: () => this.setState({ anoPct: v }) })),
      anoAporte: cop(aporte),
      anoAporteMsg: c.falta <= 0 ? 'Tu cuota inicial ya está cubierta.' : !aporte ? 'Sin aporte de primas ni cesantías.' : mSin ? 'Completas tu cuota inicial ' + Math.max(0, mSin - mCon) + ' meses antes (en ' + mCon + ' meses).' : 'Con este aporte completas tu cuota inicial en ' + mCon + ' meses.',
      rentaRows: rRows.map(([l, v, t, u]) => ({ label: l + ' · tope ' + u, value: cop(v) + ' / ' + cop(t), w: Math.min(100, v / t * 100) + '%', bg: v >= t ? 'var(--al)' : 'var(--ac)' })),
      rentaBg: obliged ? '#FFD23F' : 'var(--ac)',
      rentaMsg: obliged ? 'Superas al menos un tope: deberás declarar renta en 2027, entre agosto y octubre según los últimos dígitos de tu cédula.' : 'Con estos datos no superas los topes de 2026: no estarías obligado a declarar renta en 2027.',
      ...(() => {
        const totIng = (s.fijo || 0) + (s.variable || 0) + (s.pareja ? (s.parejaIng || 0) : 0);
        const tributaRenta = totIng >= UmbralIngresoRenta;
        const credEstimado = c.credito || (c.precio * 0.8);
        const intAno1 = credEstimado * (c.ea || 0.1135);
        const intDeducibles = Math.min(intAno1, TopeDeduccionInteresesUvt * Unidadtributaria);
        const ahorroRentaAno = tributaRenta ? Math.round(intDeducibles * 0.19) : 0;
        const ahorroRentaMes = Math.round(ahorroRentaAno / 12);
        const superaTopePatrimonio = c.precio >= TopePatrimonioDeclarar;
        return {
          tributaRenta,
          ahorroRentaAnoFmt: cop(ahorroRentaAno),
          ahorroRentaMesFmt: cop(ahorroRentaMes),
          ahorroRentaMsg: tributaRenta
            ? 'Por los intereses de tu crédito podrías deducir hasta ' + cop(intDeducibles) + ' al año, ahorrando unos ' + cop(ahorroRentaAno) + '/año en tu impuesto (~' + cop(ahorroRentaMes) + '/mes en retención).'
            : 'Con tus ingresos actuales no pagas impuesto de renta (aplica desde ~$6,9 M/mes), por lo que la deducción de intereses no te genera ahorro en dinero.',
          superaTopePatrimonio,
          alertaPatrimonioMsg: superaTopePatrimonio
            ? 'Al comprar una vivienda de ' + cop(c.precio) + ' tu patrimonio superará 4.500 UVT (' + cop(TopePatrimonioDeclarar) + '): quedarás obligado a declarar renta ante la DIAN el año siguiente.'
            : ''
        };
      })(),
      cierreSobrante: cop(Math.max(0, ctx.fixTot + ctx.wk.reduce((a, b) => a + b, 0) - c.deu - ctx.gastosMes)),
      showAds: !s.pro,
      openLeadCartera: () => this.toast('Próximamente: convenio de compra de cartera en MiTecho.'),
      openLeadAfc: () => this.toast('Próximamente: cuentas AFC en MiTecho.'),
      openLeadAhorro: () => this.toast('Próximamente: ahorro programado en MiTecho.'),
      hasCs: this.screen === 'app' && Boolean(s.cs),
      csDisplay: (this.screen === 'app' && s.cs) ? 'flex' : 'none',
      csBackdropDisplay: (this.screen === 'app' && s.cs) ? 'block' : 'none',
      hasMenu: this.screen === 'app' && Boolean(s.menu),
      menuDisplay: (this.screen === 'app' && s.menu) ? 'flex' : 'none',
      menuBackdropDisplay: (this.screen === 'app' && s.menu) ? 'block' : 'none',
      isPro: this.screen === 'app' && s.panel === 'pro',
      proStatus: s.pro ? 'Tu suscripción está activa. Gracias por apoyar MiTecho.' : 'Todo lo que necesitas para llegar a tu vivienda, sin interrupciones.',
      proPerks: [
        { t: 'Sin anuncios', d: 'Ni banners ni videos en ninguna pantalla.' },
        { t: 'Comparador completo', d: 'Pesos vs. UVR, plazos, entidades y desglose de escrituración sin ver videos.' },
        { t: 'Reporte PDF ilimitado', d: 'Tu capacidad financiera lista para llevar al banco.' },
        { t: 'Alertas de subsidios', d: 'Te avisamos cuando abran cupos de Mi Casa Ya o de tu Caja.' },
        { t: 'Plan de cuota inicial', d: 'Seguimiento mes a mes de tu ahorro con primas y cesantías.' }
      ],
      proBtn: s.pro ? 'Cancelar suscripción' : 'Probar 7 días gratis',
      proBtnBg: s.pro ? 'var(--c2)' : '#FFD23F',
      proBtnColor: s.pro ? 'var(--ik)' : '#0B0C0A',
      toggleProPlan: () => {
        this.setState({ pro: !s.pro });
        this.toast(s.pro ? 'Suscripción cancelada.' : 'MiTecho Pro activado: 7 días gratis, luego $12.900 al mes.');
      },
      sources: [
        { k: 'Salario mínimo 2026', v: cop(SMMLV), f: 'Decreto 1469 de 2025' },
        { k: 'UVT 2026', v: cop(UVT), f: 'Resolución DIAN 000238 de 2025' },
        { k: 'Tope VIS en ' + s.ciudad, v: c.visTopeS + ' SMMLV · ' + cop(c.visTope), f: '135 SMMLV general; 150 SMMLV en Bogotá, Medellín, Cali, Barranquilla, Bucaramanga, Cartagena, Cúcuta y sus áreas' },
        { k: 'Tope VIP', v: '90 SMMLV · ' + cop(90 * SMMLV), f: 'Todo el país' },
        { k: 'Subsidio Caja de compensación', v: '30 / 20 SMMLV', f: 'Hogar hasta 2 SMMLV / de 2 a 4 SMMLV, afiliado' },
        { k: 'Mi Casa Ya', v: '30 / 20 SMMLV', f: 'Sisbén A1–C8 / C9–D20. Con Caja y hasta 2 SMMLV: 20 SMMLV (total 50). Sujeto a cupos' },
        { k: 'Tasa promedio en pesos', v: 'VIS 14,35% · No VIS 15,46%', f: 'Superfinanciera, semana al 23 oct 2026' },
        { k: 'Cuota máxima', v: '30% del ingreso', f: 'VIS por ley; No VIS y leasing hasta 40% según el banco' },
        { k: 'Financiación', v: 'No VIS 70% · VIS 80%', f: 'Leasing habitacional hasta 80%–90%; opción de compra 1%–30%' },
        { k: 'IPC para proyección UVR', v: pctFmt(IPC), f: 'Variación certificada por el DANE para la UVT 2026' },
        { k: 'Crédito con Caja de compensación', v: 'Desde 0,9% m.v.', f: 'Líneas para afiliados, en pesos, plazo hasta 20 años; tasa según perfil' }
      ]
    };
  
}
