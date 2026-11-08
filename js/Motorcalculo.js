// Fórmulas para calcular cupo máximo de crédito, subsidios de vivienda y metas de ahorro

// Calcula el precio máximo de vivienda, el crédito bancario y la cuota mensual del hogar
function Calcularcapacidad(s, deudasManuales, modalidadManual) {
  const mod = modalidadManual || s.mod || 'vis';
  const cfg = Modalidadesvivienda[mod] || Modalidadesvivienda.vis;
  const financiarGastos = Boolean(s.financiarGastos);
  const N = s.avgN === 3 ? 3 : 6;
  const hist = Historialvariables(s);
  const cur = hist.length - 1;
  const varAvg = Promediodatos(hist.slice(cur - N + 1));
  const varPrev = Promediodatos(hist.slice(cur - N, cur));
  const fijoP = (s.tipo === 'variable' ? 0 : (s.fijo || 0)) + (s.fixedExtra || []).reduce((a, f) => a + f.monto, 0);
  const auto = fijoP + varAvg;

  const ing1 = s.solicitantes && s.solicitantes.length > 0
    ? s.solicitantes.reduce((a, sol) => a + (sol.ingreso_mensual || sol.ingreso || 0), 0)
    : (s.useAuto ? auto : (s.manualIng || 0));
  const ing2 = s.solicitantes && s.solicitantes.length > 0 ? 0 : (s.pareja ? (s.parejaIng ?? 2400000) : 0);
  const ing = ing1 + ing2;

  const debts = deudasManuales || s.debts || [];
  const deu1 = s.cuotas_deudas_activas !== undefined
    ? s.cuotas_deudas_activas
    : debts.filter(d => d.on !== false).reduce((a, d) => a + (d.cuota || 0), 0);
  const deu2 = s.cuotas_deudas_activas !== undefined ? 0 : (s.pareja ? (s.parejaDeu ?? 300000) : 0);
  const deu = deu1 + deu2;
  const ingresoLibre = ing - deu;
  const neto = Math.max(0, ingresoLibre);

  const tope = s.flex40 && mod !== 'vis' ? 0.40 : cfg.tope;
  const entK = s.entidad === 'caja' && !s.caja ? 'promedio' : (s.entidad || 'promedio');
  const ent = Tasasreferencia[entK] || Tasasreferencia.promedio;
  const EI = s.entInfo || {}, eC = EI.caja || {}, eF = EI.fna || {};
  const pre = entK === 'caja' ? eC : entK === 'fna' ? eF : {};
  const preTasa = pre.tasa > 0 ? pre.tasa / 100 : 0;
  const prePlazo = pre.plazo > 0 ? pre.plazo : 0;
  const preFin = pre.fin > 0 ? Math.min(1, pre.fin / 100) : 0;
  const preMonto = pre.monto > 0 ? pre.monto : 0;

  const ea = s.tasa_ea || preTasa || (s.rate === 'uvr' && mod !== 'leasing' && entK !== 'caja' ? ent.uvr : (ent[mod] || 0.1135));
  const plazoAnos = s.plazo_meses ? (s.plazo_meses / 12) : (prePlazo || Math.max(5, Math.min(s.term || 20, 75 - (s.edad || 0), entK === 'caja' ? 20 : 30)));
  const an = Calcularanualidad(ea, plazoAnos);
  const opc = mod === 'leasing' ? (s.opc ?? 0.10) : 0;
  const vN = Math.pow(1 + an.i, -an.n);
  const factor = an.a / (1 - opc * vN);

  const cuotaMaxima = Math.max(0, Math.round(neto * tope));
  const creditoPorCapacidad = preMonto || (cuotaMaxima > 0 ? Math.round(cuotaMaxima * factor) : 0);

  const visTopeS = Consultartopevis(s.ciudad || 'Bogotá');
  const visTope = visTopeS * Salariominimo;
  const vipTope = 90 * Salariominimo;
  const smm = Number((ing / Salariominimo).toFixed(2));
  const ingresoMaxCop = 4 * Salariominimo;
  const corteCop = 2 * Salariominimo;

  const afiliadoCaja = s.afiliado_caja !== undefined ? Boolean(s.afiliado_caja) : Boolean(s.caja);
  const subsidioCajaElegible = afiliadoCaja && (ing <= ingresoMaxCop);
  let subCajaS = 0;
  if (subsidioCajaElegible) {
    subCajaS = ing <= corteCop ? 30 : 20;
  }

  const asig = (e) => ['Asignado', 'Aplicado'].includes(e.subEstado) && e.subMonto > 0 && !(Mesesvigencia(e.subVence) !== null && Mesesvigencia(e.subVence) < 0);
  const subCajaReal = asig(eC);
  const subCajaMonto = subCajaReal ? (subsidioCajaElegible ? eC.subMonto : 0) : (subCajaS * Salariominimo);

  const mcyElegible = Boolean(s.sisben) && (ing <= ingresoMaxCop);
  const mcyGrpS = s.sisbenGrupo === 'C9-D20' ? 20 : 30;
  let subMcyS = 0;
  if (mcyElegible) {
    if (subsidioCajaElegible) {
      if (ing <= corteCop) subMcyS = 20;
      else subMcyS = Math.max(0, mcyGrpS - subCajaS);
    } else {
      subMcyS = mcyGrpS;
    }
  }
  const subFnaReal = asig(eF);
  const subMcyMonto = subFnaReal ? eF.subMonto : (subMcyS * Salariominimo);

  const ahorroEnt = (eC.ces || 0) + (eC.ahorro || 0) + (eF.ces || 0) + (eF.ahorro || 0);
  const ahorroBase = s.ahorro_y_cesantias !== undefined ? s.ahorro_y_cesantias : ((s.ahorro || 0) + ahorroEnt);

  const finVis = preFin || cfg.fin || 0.80;
  const finNoVis = preFin || 0.70;
  const pctGastos = cfg.gastos !== undefined ? cfg.gastos : 0.03;

  if (creditoPorCapacidad === 0) {
    return {
      ingreso_hogar: ing,
      ingreso_hogar_smmlv: smm,
      ingreso_libre: ingresoLibre,
      endeudamiento_pct: ing > 0 ? Number(((deu / ing) * 100).toFixed(1)) : 0,
      cuota_maxima: 0,
      credito_por_capacidad: 0,
      subsidio_caja_elegible: subsidioCajaElegible,
      subsidio_caja_aplicado: 0,
      recursos_propios: ahorroBase,
      modalidad: null,
      mod: null,
      limitante: 'sin_capacidad',
      precio_maximo: 0,
      precio: 0,
      precioHoy: 0,
      credito: 0,
      creditoUsado: 0,
      financiacion_pct: 0,
      cuota_inicial: 0,
      ci: 0,
      gastos_escrituracion: 0,
      gastos: 0,
      cuota_mensual: 0,
      cuota: 0,
      margen_despues_cierre: 0,
      faltante_para_cupo_completo: 0,
      falta: 0,
      estado: 'sin_capacidad',
      capped: false,
      limitAhorro: false,
      fin: 0,
      cfg, ing, ing1, deu, neto, tope, ea, plazo: plazoAnos, factor, cap: 0, cuotaMaxima: 0,
      visTope, visTopeS, vipTope, isVip: false, smm, subCajaS: 0, subMcyS: 0,
      subCaja: 0, subMcy: 0, subsidio: 0, cash: ahorroBase, opc, opcionCompra: 0,
      obj: 0, ingNec: deu, metaDiaria: 0, sens: 0, sensCred: 0, N, hist, varAvg, varPrev, fijoP, auto
    };
  }

  const recursosVis = ahorroBase + subCajaMonto + subMcyMonto;
  const precioCapacidadVis = (creditoPorCapacidad + recursosVis) / (1 + pctGastos);
  const precioRecursosVis = financiarGastos ? (recursosVis / (1 - finVis)) : (recursosVis / (1 - finVis + pctGastos));
  const precioVisTeorico = Math.min(precioCapacidadVis, precioRecursosVis);

  let modalidad = 'VIS';
  let modFinal = 'vis';
  let subCajaAplicado = subCajaMonto;
  let subMcyAplicado = subMcyMonto;
  let recursosPropios = recursosVis;
  let finMax = finVis;
  let precioMax = 0;
  let limitante = '';
  let estado = '';

  if (modalidadManual === 'novis' || (mod === 'novis' && !modalidadManual)) {
    const recursosNoVis = ahorroBase;
    const precioCapacidadNoVis = (creditoPorCapacidad + recursosNoVis) / (1 + pctGastos);
    const precioRecursosNoVis = financiarGastos ? (recursosNoVis / (1 - finNoVis)) : (recursosNoVis / (1 - finNoVis + pctGastos));
    const precioNoVisTeorico = Math.min(precioCapacidadNoVis, precioRecursosNoVis);
    modalidad = 'NO_VIS';
    modFinal = 'novis';
    subCajaAplicado = 0;
    subMcyAplicado = 0;
    recursosPropios = recursosNoVis;
    finMax = finNoVis;
    precioMax = Math.round(precioNoVisTeorico);
    if (precioRecursosNoVis < precioCapacidadNoVis) {
      limitante = 'recursos_propios';
      estado = 'falta_cuota_inicial';
    } else {
      limitante = 'capacidad_pago';
      estado = 'cierre_completo';
    }
  } else if (precioVisTeorico > visTope) {
    const recursosNoVis = ahorroBase;
    const precioCapacidadNoVis = (creditoPorCapacidad + recursosNoVis) / (1 + pctGastos);
    const precioRecursosNoVis = financiarGastos ? (recursosNoVis / (1 - finNoVis)) : (recursosNoVis / (1 - finNoVis + pctGastos));
    const precioNoVisTeorico = Math.min(precioCapacidadNoVis, precioRecursosNoVis);

    if (precioNoVisTeorico > visTope) {
      modalidad = 'NO_VIS';
      modFinal = 'novis';
      subCajaAplicado = 0;
      subMcyAplicado = 0;
      recursosPropios = recursosNoVis;
      finMax = finNoVis;
      precioMax = Math.round(precioNoVisTeorico);
      if (precioRecursosNoVis < precioCapacidadNoVis) {
        limitante = 'recursos_propios';
        estado = 'falta_cuota_inicial';
      } else {
        limitante = 'capacidad_pago';
        estado = 'cierre_completo';
      }
    } else {
      modalidad = 'VIS';
      modFinal = 'vis';
      subCajaAplicado = subCajaMonto;
      subMcyAplicado = subMcyMonto;
      recursosPropios = recursosVis;
      finMax = finVis;
      precioMax = visTope;
      limitante = 'tope_vis';
      estado = 'limitado_tope_vis';
    }
  } else {
    modalidad = 'VIS';
    modFinal = 'vis';
    subCajaAplicado = subCajaMonto;
    subMcyAplicado = subMcyMonto;
    recursosPropios = recursosVis;
    finMax = finVis;
    precioMax = Math.round(precioVisTeorico);
    if (precioRecursosVis < precioCapacidadVis) {
      limitante = 'recursos_propios';
      estado = 'falta_cuota_inicial';
    } else {
      limitante = 'capacidad_pago';
      estado = 'cierre_completo';
    }
  }

  const gastos = Math.round(precioMax * pctGastos);
  let credito = 0, ci = 0, margenDespuesCierre = 0, falta = 0;

  if (financiarGastos) {
    const credViv = Math.min(creditoPorCapacidad, Math.round(finMax * precioMax));
    credito = credViv + gastos;
    ci = precioMax - credViv;
    margenDespuesCierre = recursosPropios - ci;
    if (limitante === 'recursos_propios') {
      const precioCupo = creditoPorCapacidad / finMax;
      falta = Math.max(0, Math.round(precioCupo * (1 - finMax) - recursosPropios));
    }
  } else {
    credito = Math.min(
      creditoPorCapacidad,
      Math.round(finMax * precioMax),
      Math.max(0, Math.round(precioMax * (1 + pctGastos) - recursosPropios))
    );
    ci = precioMax - credito;
    margenDespuesCierre = recursosPropios - ci - gastos;
    if (limitante === 'recursos_propios') {
      const precioCupo = creditoPorCapacidad / finMax;
      falta = Math.max(0, Math.round(precioCupo * (1 - finMax + pctGastos) - recursosPropios));
    }
  }

  const cuota = Math.round(credito * (1 - opc * vN) / an.a);

  const endeudamientoPct = ing > 0 ? Number(((deu / ing) * 100).toFixed(1)) : 0;
  const financiacionPct = precioMax > 0 ? Number(((credito / precioMax) * 100).toFixed(1)) : 0;

  return {
    ingreso_hogar: ing,
    ingreso_hogar_smmlv: smm,
    ingreso_libre: ingresoLibre,
    endeudamiento_pct: endeudamientoPct,
    cuota_maxima: cuotaMaxima,
    credito_por_capacidad: creditoPorCapacidad,
    subsidio_caja_elegible: subsidioCajaElegible,
    subsidioCajaElegible,
    subsidio_caja_aplicado: subCajaAplicado,
    recursos_propios: recursosPropios,
    modalidad,
    mod: modFinal,
    limitante,
    precio_maximo: precioMax,
    precio: precioMax,
    precioHoy: precioMax,
    credito,
    creditoUsado: credito,
    financiacion_pct: financiacionPct,
    cuota_inicial: ci,
    ci,
    gastos_escrituracion: gastos,
    gastos,
    cuota_mensual: cuota,
    cuota,
    margen_despues_cierre: margenDespuesCierre,
    faltante_para_cupo_completo: falta,
    falta,
    estado,
    fin: finMax,
    capped: limitante === 'tope_vis',
    limitAhorro: limitante === 'recursos_propios',
    visTope,
    visTopeS,
    vipTope,
    isVip: modFinal === 'vis' && precioMax <= vipTope,
    smm,
    subCajaS: subCajaAplicado / Salariominimo,
    subMcyS: subMcyAplicado / Salariominimo,
    subCaja: subCajaAplicado,
    subMcy: subMcyAplicado,
    subCajaReal,
    subFnaReal,
    subsidio: subCajaAplicado + subMcyAplicado,
    cash: recursosPropios,
    cfg,
    ing,
    ing1,
    deu,
    neto,
    tope,
    ea,
    plazo: plazoAnos,
    factor,
    an,
    tasaMv: an.i,
    cap: cuotaMaxima,
    cuotaMaxima,
    opc,
    opcionCompra: opc * credito,
    obj: modFinal === 'vis' ? Math.min(s.objetivo > 0 ? s.objetivo : precioMax, visTope) : (s.objetivo > 0 ? s.objetivo : precioMax),
    ingNec: (precioMax * finMax) / factor / tope + deu,
    metaDiaria: Math.max(0, ((precioMax * finMax) / factor / tope + deu) - fijoP - ing2) / 26,
    sens: 100000 * tope * factor / finMax,
    sensCred: 100000 * tope * factor,
    financiarGastos,
    gastosFinanciados: financiarGastos ? gastos : 0,
    proyeccionUvr: Calcularproyeccionuvr(creditoPorCapacidad || credito, s.plazo_meses || (plazoAnos * 12), s.rate === 'uvr' ? ea : 0.075),
    N,
    hist,
    varAvg,
    varPrev,
    fijoP,
    auto
  };
}

// Calcula cómo cambia la cuota en UVR bajo distintos niveles de inflación anual
function Calcularproyeccionuvr(creditoPesos, plazoMeses, margenUvrEa) {
  const m = margenUvrEa || 0.075, n = plazoMeses || 240, u0 = ValorUvrHoy;
  const r = Math.pow(1 + m, 1 / 12) - 1, a = (1 - Math.pow(1 + r, -n)) / r;
  const cUvr = (creditoPesos / u0) / a, c1 = Math.round(cUvr * u0);
  return EscenariosInflacion.map(ipc => {
    const c10 = Math.round(cUvr * u0 * Math.pow(1 + ipc, 10));
    const c240 = Math.round(cUvr * u0 * Math.pow(1 + ipc, 20));
    const tEq = (1 + m) * (1 + ipc) - 1;
    return { ipc, ipcFmt: (ipc * 100).toFixed(1).replace('.', ',') + '%', c1, c10, c240, tEq, tEqPct: (tEq * 100).toFixed(2).replace('.', ',') + '%' };
  });
}

const calcularCapacidad = Calcularcapacidad;
const calcularProyeccionUvr = Calcularproyeccionuvr;
