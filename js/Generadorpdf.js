// Armado y descarga del certificado de capacidad financiera de tres hojas para el usuario

// Construye las tres hojas del certificado adaptadas para un solicitante o para pareja
function Construircertificadohtml(s, c) {
  const ahora = new Date();
  const fechaStr = ahora.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const refCode = 'MT-' + ahora.getFullYear() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();

  const esPareja = Boolean(s.pareja);
  const esc = typeof EscaparHtml === 'function' ? EscaparHtml : (x => x);
  const nombreTitular = esc(s.nombre || 'Solicitante Titular');
  const nombrePareja = esc(s.parejaNombre || 'Segundo Solicitante');
  const nombreCompleto = nombreTitular + (esPareja ? ' y ' + nombrePareja : '');
  const nombreTitularCorto = nombreTitular.split(' ')[0];
  const nombreParejaCorto = nombrePareja.split(' ')[0];
  const cajaNombreEsc = esc(s.cajaNombre || 'Compensar');
  const sisbenGrupoEsc = esc(s.sisbenGrupo || 'A1-C8');
  const ciudadEsc = esc(s.ciudad || 'Colombia');

  const aporte1 = esPareja ? Math.round((c.ing1 / Math.max(1, c.ing)) * 100) : 100;
  const aporte2 = esPareja ? (100 - aporte1) : 0;

  const perfilTitular = s.tipo === 'fijo'
    ? 'Empleado · Ingresos fijos mensuales'
    : s.tipo === 'variable'
    ? 'Independiente · Ventas y comisiones variables'
    : 'Ingresos mixtos: salario fijo más comisiones';
  const perfilPareja = esc(s.parejaPerfil || 'Actividad económica y laboral complementaria');

  const deudasTitular = (s.debts || []).filter(d => d.on !== false).reduce((a, d) => a + (d.cuota || 0), 0);
  const deudasPareja = esPareja ? (s.parejaDeu || 0) : 0;

  const EI = s.entInfo || {}, eC = EI.caja || {}, eF = EI.fna || {};
  const ahorroEnt = (eC.ces || 0) + (eC.ahorro || 0) + (eF.ces || 0) + (eF.ahorro || 0);
  const ahorroTitular = (s.ahorro || 0) + ahorroEnt;
  const ahorroPareja = esPareja ? (s.parejaAhorro || 0) : 0;

  const pctCred = c.financiacion_pct > 0 ? c.financiacion_pct : (c.precio > 0 ? Number(((c.credito / c.precio) * 100).toFixed(1)) : 80);
  const pctCi = Number((100 - pctCred).toFixed(1));
  const wCred = Math.round(720 * (pctCred / 100));
  const wCi = 720 - wCred;

  const fraseHero = esPareja
    ? (nombreTitularCorto + ' y ' + nombreParejaCorto + ' pueden comprar una vivienda de hasta')
    : (nombreTitularCorto + ' puede comprar una vivienda de hasta');

  let chipEstadoCierre = '';
  let resumenCierreTxt = '';
  if (c.estado === 'cierre_completo' || c.estado === 'limitado_tope_vis') {
    chipEstadoCierre = '<span class="estado-cierre"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Cuota inicial cubierta</span>';
    resumenCierreTxt = 'El banco financia <strong>' + Formatoenteropesos(c.credito) + '</strong>, el ' + pctCred + '% del precio' + (c.financiarGastos ? ' (incluye escrituración Ley 2434).' : '.') + ' El hogar cubre la cuota inicial con sus propios recursos' + (c.margenDespuesCierre > 0 ? (' y le queda un margen de <strong>' + Formatoenteropesos(c.margenDespuesCierre) + '</strong>.') : '.');
  } else if (c.estado === 'falta_cuota_inicial') {
    chipEstadoCierre = '<span class="estado-cierre" style="background:var(--mitecho-dorado)"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.8" fill="none" stroke="#0B0C0A" stroke-width="1.6"/><path d="M6 3.2v3.2M6 8.2v.4" stroke="#0B0C0A" stroke-width="1.6" stroke-linecap="round"/></svg>Falta cuota inicial</span>';
    resumenCierreTxt = 'El banco puede prestar hasta <strong>' + Formatoenteropesos(c.credito_por_capacidad) + '</strong>, pero con los recursos propios actuales el hogar puede cerrar una compra de hasta <strong>' + Formatoenteropesos(c.precio) + '</strong>. Faltan <strong>' + Formatoenteropesos(c.falta) + '</strong> de cuota inicial para usar el cupo bancario completo.';
  } else {
    chipEstadoCierre = '<span class="estado-cierre" style="background:var(--mitecho-naranja);color:#FFF"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.8" fill="none" stroke="#FFF" stroke-width="1.6"/><path d="M4 4l4 4M8 4l-4 4" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"/></svg>Sin capacidad</span>';
    resumenCierreTxt = 'El nivel de obligaciones financieras activas supera los ingresos reportados, por lo que no se cuenta con margen de cuota hipotecaria en este momento.';
  }

  const maxCascadaVal = Math.max(c.cash, c.ci + c.gastos, c.falta, 10000000);
  const scaleMax = Math.ceil(maxCascadaVal / 10000000) * 10000000;
  const numSteps = 7;
  const stepVal = scaleMax / numSteps;
  let ejeTicks = '';
  for (let k = 0; k <= numSteps; k++) {
    const leftPct = (k / numSteps * 100).toFixed(3);
    const millonVal = Math.round((k * stepVal) / 1000000);
    ejeTicks += '<li style="left:' + leftPct + '%">' + millonVal + '</li>';
  }

  const wAhorro1Pct = (ahorroTitular / scaleMax * 100).toFixed(3);
  const wAhorro2Pct = (ahorroPareja / scaleMax * 100).toFixed(3);
  const leftAhorro2Pct = wAhorro1Pct;
  const leftSubPct = ((ahorroTitular + ahorroPareja) / scaleMax * 100).toFixed(3);
  const wSubPct = (((c.subCaja || 0)) / scaleMax * 100).toFixed(3);
  const leftMcyPct = ((ahorroTitular + ahorroPareja + (c.subCaja || 0)) / scaleMax * 100).toFixed(3);
  const wMcyPct = (((c.subMcy || 0)) / scaleMax * 100).toFixed(3);
  const wRecursosTotPct = (c.cash / scaleMax * 100).toFixed(3);
  const leftCiPct = (Math.max(0, c.cash - c.ci) / scaleMax * 100).toFixed(3);
  const wCiPct = (c.ci / scaleMax * 100).toFixed(3);
  const leftGastosPct = (Math.max(0, c.cash - c.ci - c.gastos) / scaleMax * 100).toFixed(3);
  const wGastosPct = (c.gastos / scaleMax * 100).toFixed(3);
  const wMargenPct = (Math.max(0, c.margenDespuesCierre) / scaleMax * 100).toFixed(3);

  let cascadaHtml = '<div class="eje" aria-hidden="true"><span class="eje__guia">Cómo leer esta gráfica: hoja 3</span><ol>' + ejeTicks + '</ol><span>millones COP</span></div>'
    + '<div class="cascada__fila"><dt><span class="op">+</span>Ahorro y cesantías de ' + nombreTitularCorto + '</dt><dd class="pista"><i class="c-p1" style="left:0;width:' + wAhorro1Pct + '%"></i></dd><dd>' + Formatoenteropesos(ahorroTitular) + '</dd></div>';

  if (esPareja) {
    cascadaHtml += '<div class="cascada__fila"><dt><span class="op">+</span>Ahorro y cesantías de ' + nombreParejaCorto + '</dt><dd class="pista"><i class="c-p2" style="left:' + leftAhorro2Pct + '%;width:' + wAhorro2Pct + '%"></i></dd><dd>' + Formatoenteropesos(ahorroPareja) + '</dd></div>';
  }

  if (c.subCaja > 0) {
    cascadaHtml += '<div class="cascada__fila"><dt><span class="op">+</span>Subsidio de la Caja (' + cajaNombreEsc + ')</dt><dd class="pista"><i class="c-caja" style="left:' + leftSubPct + '%;width:' + wSubPct + '%"></i></dd><dd>' + Formatoenteropesos(c.subCaja) + '</dd></div>';
  } else if (s.caja && !c.subsidioCajaElegible) {
    cascadaHtml += '<div class="cascada__fila nulo"><dt><span class="op">+</span>Subsidio de la Caja (' + cajaNombreEsc + ')</dt><dd class="pista"><em>No aplica: ingresos del hogar superan el tope de 4 SMMLV</em></dd><dd>$0</dd></div>';
  } else {
    cascadaHtml += '<div class="cascada__fila nulo"><dt><span class="op">+</span>Subsidio de Caja de Compensación</dt><dd class="pista"><em>No aplica: el hogar no reporta afiliación a Caja</em></dd><dd>$0</dd></div>';
  }

  if (c.subMcy > 0) {
    cascadaHtml += '<div class="cascada__fila"><dt><span class="op">+</span>Subsidio Mi Casa Ya (' + sisbenGrupoEsc + ')</dt><dd class="pista"><i class="c-caja" style="left:' + leftMcyPct + '%;width:' + wMcyPct + '%"></i></dd><dd>' + Formatoenteropesos(c.subMcy) + '</dd></div>';
  } else {
    cascadaHtml += '<div class="cascada__fila nulo"><dt><span class="op">+</span>Mi Casa Ya / concurrente</dt><dd class="pista"><em>' + (s.sisben ? (c.smm > 4 ? 'No aplica: ingresos superan tope de 4 SMMLV' : 'En proceso de asignación') : 'No aplica: el hogar no registra Sisbén') + '</em></dd><dd>$0</dd></div>';
  }
  cascadaHtml += '<div class="cascada__fila suma"><dt><span class="op">=</span>Recursos propios del hogar</dt><dd class="pista"><i class="c-total" style="left:0;width:' + wRecursosTotPct + '%"></i></dd><dd>' + Formatoenteropesos(c.cash) + '</dd></div>'
    + '<div class="cascada__fila resta"><dt><span class="op">−</span>Cuota inicial, ' + pctCi + '% del precio</dt><dd class="pista"><i class="c-cuota" style="left:' + leftCiPct + '%;width:' + wCiPct + '%"></i></dd><dd>−' + Formatoenteropesos(c.ci) + '</dd></div>'
    + '<div class="cascada__fila resta"><dt><span class="op">−</span>Notaría, escritura y registro, 3%</dt><dd class="pista"><i class="c-gastos" style="left:' + leftGastosPct + '%;width:' + wGastosPct + '%"></i></dd><dd>−' + Formatoenteropesos(c.gastos) + '</dd></div>';

  if (c.falta > 0) {
    const wFaltaPct = (c.falta / scaleMax * 100).toFixed(3);
    cascadaHtml += '<div class="cascada__fila suma" style="border-top:1.5px solid var(--mitecho-naranja)"><dt style="color:#B23F0A"><span class="op">!</span>Cuota inicial faltante para cupo completo</dt><dd class="pista"><i style="left:0;width:' + wFaltaPct + '%;background:var(--mitecho-naranja)"></i></dd><dd style="color:#B23F0A;font-weight:700">−' + Formatoenteropesos(c.falta) + '</dd></div>';
  } else {
    cascadaHtml += '<div class="cascada__fila suma"><dt><span class="op">=</span>Margen después del cierre</dt><dd class="pista"><i class="c-margen" style="left:0;width:' + wMargenPct + '%"></i></dd><dd>' + Formatoenteropesos(c.margenDespuesCierre) + '</dd></div>';
  }

  let cajaCardHtml = '';
  const tasaEaTxt = (c.ea * 100).toFixed(2).replace('.', ',') + '% E.A.';
  const tasaMvVal = c.tasaMv || (c.an ? c.an.i : (Math.pow(1 + c.ea, 1 / 12) - 1));
  const tasaMvTxt = (tasaMvVal * 100).toFixed(2).replace('.', ',') + '% mes vencido';

  if (s.caja && c.subsidioCajaElegible && c.subCaja > 0) {
    const cajaNom = cajaNombreEsc;
    const cajaLogo = (s.cajaNombre || 'Compensar').slice(0, 2).toUpperCase();
    const subChip = c.subCajaReal ? 'chip--asignado' : 'chip--estudio';
    const subEstadoTxt = c.subCajaReal ? 'Asignado' : 'Elegible';
    cajaCardHtml = '<div class="caja__grid"><div class="caja__entidad"><div class="caja__logo" aria-hidden="true">' + cajaLogo + '</div><div><h3>' + cajaNom + '</h3><p>Caja de compensación familiar<br>a la que está afiliado el hogar</p></div></div><div class="caja__dato caja__dato--subsidio"><span>Subsidio de vivienda <em class="chip ' + subChip + '">' + subEstadoTxt + '</em></span><strong>' + Formatoenteropesos(c.subCaja) + '</strong><small>' + c.subCajaS + ' SMMLV de 2026 (' + Formatoenteropesos(Salariominimo) + ' cada uno)</small></div><div class="caja__dato"><span>Tasa preferencial por convenio</span><strong>' + tasaEaTxt + '</strong><small>Equivale a ' + tasaMvTxt + '</small></div></div><ol class="pasos" aria-label="Estado del subsidio"><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Afiliación</b><span>Hogar afiliado</span></li><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Postulación</b><span>Radicada en la Caja</span></li><li class="paso ' + (c.subCajaReal ? 'hecho' : 'pendiente') + '"><i>' + (c.subCajaReal ? '<svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '') + '</i><b>Asignación</b><span>' + (c.subCajaReal ? 'Subsidio asignado' : 'En trámite de asignación') + '</span></li><li class="paso pendiente"><i></i><b>Desembolso</b><span>Al firmar la escritura</span></li></ol>';
  } else if (s.caja && !c.subsidioCajaElegible) {
    const cajaNom = cajaNombreEsc;
    const cajaLogo = (s.cajaNombre || 'Compensar').slice(0, 2).toUpperCase();
    cajaCardHtml = '<div class="caja__grid"><div class="caja__entidad"><div class="caja__logo" aria-hidden="true">' + cajaLogo + '</div><div><h3>' + cajaNom + '</h3><p>Caja de compensación familiar<br>Línea de crédito hipotecario</p></div></div><div class="caja__dato"><span>Subsidio de vivienda <em class="chip chip--no-aplica">Supera 4 SMMLV</em></span><strong>$0</strong><small>Ingresos del hogar (' + c.smm + ' SMMLV) superan tope de subsidio</small></div><div class="caja__dato"><span>Tasa de crédito de tu Caja</span><strong>' + tasaEaTxt + '</strong><small>Equivale a ' + tasaMvTxt + '</small></div></div><ol class="pasos" aria-label="Estado del crédito"><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Afiliación</b><span>Hogar afiliado</span></li><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Perfilamiento</b><span>Capacidad evaluada</span></li><li class="paso pendiente"><i></i><b>Aprobación</b><span>Estudio de crédito</span></li><li class="paso pendiente"><i></i><b>Desembolso</b><span>Al firmar la escritura</span></li></ol>';
  } else {
    const entNom = s.entidad === 'fna' ? 'Fondo Nacional del Ahorro' : 'Banca Hipotecaria';
    const entLogo = s.entidad === 'fna' ? 'FNA' : 'BH';
    const subEstadoFna = c.subFnaReal ? 'Asignado' : 'Elegible';
    const subChipFna = c.subFnaReal ? 'chip--asignado' : 'chip--estudio';
    const subNom = c.subMcy > 0 ? ('Subsidio Mi Casa Ya <em class="chip ' + subChipFna + '">' + subEstadoFna + ' ' + (c.subMcyS || 30) + ' SMMLV</em>') : 'Subsidio de vivienda <em class="chip chip--no-aplica">' + (s.sisben ? 'Sin subsidio' : 'Sin Sisbén') + '</em>';
    const subMontoTxt = c.subMcy > 0 ? Formatoenteropesos(c.subMcy) : '$0';
    const subDetalleTxt = c.subMcy > 0 ? ('Subsidio nacional de vivienda vía ' + entNom) : (s.sisben ? 'Sin postulación a subsidio' : 'No registra clasificación Sisbén IV');
    const tasaLabel = s.entidad === 'fna' ? 'Tasa preferencial FNA' : 'Tasa de referencia';
    const pasoAprobacion = s.entidad === 'fna' ? 'Aprobación FNA' : 'Aprobación bancaria';
    cajaCardHtml = '<div class="caja__grid"><div class="caja__entidad"><div class="caja__logo" aria-hidden="true">' + entLogo + '</div><div><h3>' + entNom + '</h3><p>' + (s.entidad === 'fna' ? 'Crédito hipotecario por cesantías o AVC' : 'Financiación hipotecaria comercial') + '<br>' + (c.subMcy > 0 ? 'con subsidio Mi Casa Ya' : 'sin subsidio familiar') + '</p></div></div><div class="caja__dato' + (c.subMcy > 0 ? ' caja__dato--subsidio' : '') + '"><span>' + subNom + '</span><strong>' + subMontoTxt + '</strong><small>' + subDetalleTxt + '</small></div><div class="caja__dato"><span>' + tasaLabel + '</span><strong>' + tasaEaTxt + '</strong><small>Equivale a ' + tasaMvTxt + '</small></div></div><ol class="pasos" aria-label="Estado de la solicitud"><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Perfilamiento</b><span>Ingresos y capacidad</span></li><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Preaprobado</b><span>Simulación de crédito</span></li><li class="paso pendiente"><i></i><b>' + pasoAprobacion + '</b><span>Estudio de títulos y riesgo</span></li><li class="paso pendiente"><i></i><b>Desembolso</b><span>Al firmar la escritura</span></li></ol>';
  }

  let deudasTbody = '';
  const debtsList = s.debts || [];
  const activeDebts1 = debtsList.filter(d => d.on !== false);

  deudasTbody += '<tbody class="p1"><tr class="titular"><th scope="rowgroup"><i></i>' + nombreTitular + ' <small>' + activeDebts1.length + ' activas</small></th><td class="num">' + Formatoenteropesos(deudasTitular) + '</td><td class="num">' + Formatoenteropesos(activeDebts1.reduce((a, d) => a + (d.saldo || 0), 0)) + '</td><td></td></tr>';
  if (debtsList.length === 0) {
    deudasTbody += '<tr><td colspan="4" style="color:var(--mitecho-tenue);padding-left:12px">No reporta deudas ni compromisos financieros activos</td></tr>';
  } else {
    debtsList.forEach(d => {
      const isActiva = d.on !== false;
      const cuotaFmt = Formatoenteropesos(d.cuota || 0);
      const saldoFmt = d.saldo ? Formatoenteropesos(d.saldo) : 'No registra';
      const dName = esc(d.name || d.concepto || 'Obligación');
      if (isActiva) {
        deudasTbody += '<tr><td>' + dName + '</td><td class="num">' + cuotaFmt + '</td><td class="num">' + saldoFmt + '</td><td><span class="estado">Se descuenta</span></td></tr>';
      } else {
        deudasTbody += '<tr class="excluida"><td><span>' + dName + '</span></td><td class="num">' + cuotaFmt + '</td><td class="num">' + saldoFmt + '</td><td><span class="estado estado--excluida">Excluida por el usuario</span></td></tr>';
      }
    });
  }
  deudasTbody += '</tbody>';

  if (esPareja) {
    deudasTbody += '<tbody class="p2"><tr class="titular"><th scope="rowgroup"><i></i>' + nombrePareja + ' <small>' + (deudasPareja > 0 ? '1 activa' : '0 activas') + '</small></th><td class="num">' + Formatoenteropesos(deudasPareja) + '</td><td class="num">' + (deudasPareja > 0 ? Formatoenteropesos(deudasPareja * 24) : '$0') + '</td><td></td></tr>';
    if (deudasPareja > 0) {
      deudasTbody += '<tr><td>Compromiso financiero / Libranza</td><td class="num">' + Formatoenteropesos(deudasPareja) + '</td><td class="num">' + Formatoenteropesos(deudasPareja * 24) + '</td><td><span class="estado">Se descuenta</span></td></tr>';
    } else {
      deudasTbody += '<tr><td colspan="4" style="color:var(--mitecho-tenue);padding-left:12px">No reporta obligaciones financieras activas</td></tr>';
    }
    deudasTbody += '</tbody>';
  }

  const numTotalDeudasActivas = activeDebts1.length + (esPareja && deudasPareja > 0 ? 1 : 0);

  let ecuacionHtml = '';
  if (esPareja) {
    ecuacionHtml = '<div class="ecuacion"><div><small>Ingreso ' + nombreTitularCorto + '</small><strong>' + Formatoenteropesos(c.ing1) + '</strong></div><span>+</span><div><small>Ingreso ' + nombreParejaCorto + '</small><strong>' + Formatoenteropesos(c.ing - c.ing1) + '</strong></div><span>−</span><div><small>Deudas del hogar</small><strong>' + Formatoenteropesos(c.deu) + '</strong></div><span>=</span><div><small>Ingreso disponible</small><strong>' + Formatoenteropesos(c.neto) + '</strong></div><span>×</span><div><small>30% cuota máx.</small><strong>30%</strong></div><div class="resultado"><small>Cuota máxima</small><strong>' + Formatoenteropesos(c.cuotaMaxima) + '</strong></div></div>';
  } else {
    ecuacionHtml = '<div class="ecuacion ecuacion--individual"><div><small>Ingreso mensual</small><strong>' + Formatoenteropesos(c.ing) + '</strong></div><span>−</span><div><small>Deudas del solicitante</small><strong>' + Formatoenteropesos(c.deu) + '</strong></div><span>=</span><div><small>Ingreso disponible</small><strong>' + Formatoenteropesos(c.neto) + '</strong></div><span>×</span><div><small>30% cuota máx.</small><strong>30%</strong></div><div class="resultado"><small>Cuota máxima</small><strong>' + Formatoenteropesos(c.cuotaMaxima) + '</strong></div></div>';
  }

  let solicitantesHtml = '';
  if (esPareja) {
    solicitantesHtml = '<div class="solicitantes"><article class="persona persona--1"><div class="persona__cab"><p class="persona__rol"><span class="mono">S1</span>Titular</p><p class="aporte"><span class="aporte__barra"><i style="width:' + aporte1 + '%"></i></span><span><b>' + aporte1 + '%</b> del ingreso del hogar</span></p></div><h3>' + nombreTitular + '</h3><p class="persona__perfil">' + perfilTitular + '</p><dl class="cuentas"><div><dt>Ingreso bruto mensual</dt><dd>' + Formatoenteropesos(c.ing1) + '</dd></div><div class="total"><dt>Ingreso evaluado</dt><dd>' + Formatoenteropesos(c.ing1) + '</dd></div><div class="menos"><dt>Cuotas deudas activas</dt><dd>−' + Formatoenteropesos(deudasTitular) + '</dd></div><div class="total"><dt>Ingreso libre de deudas</dt><dd>' + Formatoenteropesos(Math.max(0, c.ing1 - deudasTitular)) + '</dd></div><div><dt>Ahorro y cesantías</dt><dd>' + Formatoenteropesos(ahorroTitular) + '</dd></div></dl></article><article class="persona persona--2"><div class="persona__cab"><p class="persona__rol"><span class="mono">S2</span>Segundo solicitante</p><p class="aporte"><span class="aporte__barra"><i style="width:' + aporte2 + '%"></i></span><span><b>' + aporte2 + '%</b> del ingreso del hogar</span></p></div><h3>' + nombrePareja + '</h3><p class="persona__perfil">' + perfilPareja + '</p><dl class="cuentas"><div><dt>Ingreso bruto mensual</dt><dd>' + Formatoenteropesos(s.parejaIng || 0) + '</dd></div><div class="total"><dt>Ingreso evaluado</dt><dd>' + Formatoenteropesos(s.parejaIng || 0) + '</dd></div><div class="menos"><dt>Cuotas deudas activas</dt><dd>−' + Formatoenteropesos(deudasPareja) + '</dd></div><div class="total"><dt>Ingreso libre de deudas</dt><dd>' + Formatoenteropesos(Math.max(0, (s.parejaIng || 0) - deudasPareja)) + '</dd></div><div><dt>Ahorro y cesantías</dt><dd>' + Formatoenteropesos(ahorroPareja) + '</dd></div></dl></article></div>';
  } else {
    solicitantesHtml = '<div class="solicitantes solicitantes--individual"><article class="persona persona--1"><div class="persona__cab"><p class="persona__rol"><span class="mono">S1</span>Solicitante Titular</p><p class="aporte"><span class="aporte__barra"><i style="width:100%"></i></span><span><b>100%</b> del ingreso evaluado</span></p></div><h3>' + nombreTitular + '</h3><p class="persona__perfil">' + perfilTitular + ' · ' + ciudadEsc + '</p><dl class="cuentas"><div><dt>Ingreso mensual</dt><dd>' + Formatoenteropesos(c.ing) + '</dd></div><div class="total"><dt>Ingreso evaluado</dt><dd>' + Formatoenteropesos(c.ing) + '</dd></div><div class="menos"><dt>Cuotas deudas activas</dt><dd>−' + Formatoenteropesos(c.deu) + '</dd></div><div class="total"><dt>Ingreso libre de deudas</dt><dd>' + Formatoenteropesos(c.neto) + '</dd></div><div><dt>Ahorro y cesantías</dt><dd>' + Formatoenteropesos(ahorroTitular) + '</dd></div></dl></article></div>';
  }

  return '<!doctype html>'
    + '<html lang="es-CO">'
    + '<head>'
    + '<meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<title>Certificado de capacidad financiera · MiTecho</title>'
    + '<link rel="preconnect" href="https://fonts.googleapis.com">'
    + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    + '<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@600;700&family=Hanken+Grotesk:wght@400;600&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">'
    + '<style>' + EstilosCertificado + '\n.solicitantes--individual{grid-template-columns:1fr}\n.ecuacion--individual{grid-template-columns:1.2fr auto 1.2fr auto 1.2fr auto .8fr auto 1.3fr}\n</style>'
    + '</head>'
    + '<body>'
    + '<main class="doc">'
    + '<section class="hoja" aria-label="Hoja 1 de 2">'
    + '<header class="plano">'
    + '<div class="plano__top">'
    + '<div class="marca">'
    + '<img src="' + LogoCertificado + '" alt="MiTecho">'
    + '<div><span class="marca__nombre">MiTecho</span><span class="marca__doc">CERTIFICADO DE CAPACIDAD FINANCIERA</span></div>'
    + '</div>'
    + '<dl class="cajetin">'
    + '<div><dt>Emisión</dt><dd>' + fechaStr + '</dd></div>'
    + '<div><dt>Vigencia</dt><dd>30 días</dd></div>'
    + '<div><dt>Referencia</dt><dd>' + refCode + '</dd></div>'
    + '<div><dt>Modalidad</dt><dd>' + (s.rate === 'uvr' ? (c.cfg.label + ' en UVR') : c.cfg.label) + '</dd></div>'
    + '<div><dt>Plazo</dt><dd>' + c.plazo + ' años (' + (c.plazo * 12) + ' m)</dd></div>'
    + '<div><dt>Tasa E.A.</dt><dd>' + tasaEaTxt + '</dd></div>'
    + '</dl>'
    + '</div>'
    + '<p class="plano__frase">' + fraseHero + '</p>'
    + '<div class="plano__cifra"><span class="moneda">$</span>' + Formatomillones(c.precio) + '<span class="unidad">M</span></div>'
    + '<figure class="cota">'
    + '<svg viewBox="0 0 720 72" aria-hidden="true">'
    + '<g stroke="#A3A898" stroke-width="1" fill="none">'
    + '<path d="M0.5 6V66M' + wCred + '.5 30V66M719.5 6V66" stroke-opacity=".45"/>'
    + '<path d="M0 18H720M0 42H720"/>'
    + '</g>'
    + '<g stroke="#F2F4EC" stroke-width="1.6">'
    + '<path d="M-5 23L5 13M715 23L725 13M-5 47L5 37M' + (wCred - 4) + ' 47L' + (wCred + 6) + ' 37M715 47L725 37"/>'
    + '</g>'
    + '<text class="cota__txt" x="360" y="12" text-anchor="middle">precio máximo ' + Formatoenteropesos(c.precio) + ' COP</text>'
    + '<text class="cota__pct" x="' + Math.round(wCred / 2) + '" y="36" text-anchor="middle">' + pctCred + '%</text>'
    + '<text class="cota__pct" x="' + Math.round(wCred + wCi / 2) + '" y="36" text-anchor="middle">' + pctCi + '%</text>'
    + '<rect x="0" y="52" width="' + Math.max(2, wCred - 2) + '" height="20" rx="3" fill="#F2F4EC"/>'
    + '<rect x="' + (wCred + 3) + '" y="52" width="' + Math.max(2, wCi - 3) + '" height="20" rx="3" fill="#D4FF3A"/>'
    + '</svg>'
    + '<figcaption class="cota__leyenda" style="grid-template-columns:' + pctCred + 'fr ' + pctCi + 'fr">'
    + '<p><strong>' + Formatoenteropesos(c.credito) + '</strong>Crédito hipotecario del banco</p>'
    + '<p><strong>' + Formatoenteropesos(c.ci) + '</strong>Cuota inicial requerida</p>'
    + '</figcaption>'
    + '</figure>'
    + '<ul class="plano__datos">'
    + '<li><span>Cuota mensual estimada</span><strong>' + Formatoenteropesos(c.cuota) + '</strong><small>' + Math.round((c.cuota / Math.max(1, c.ing)) * 100) + '% del ingreso del hogar</small></li>'
    + '<li><span>Tasa de interés</span><strong>' + tasaEaTxt + '</strong><small>' + c.plazo + ' años, ' + (c.plazo * 12) + ' cuotas fijas en pesos</small></li>'
    + '<li><span>Total pagado al banco</span><strong>' + Formatoenteropesos(c.cuota * c.plazo * 12) + '</strong><small>En ' + c.plazo + ' años, sin seguros</small></li>'
    + '</ul>'
    + '</header>'
    + '<div class="cuerpo">'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Quiénes solicitan</h2><p>' + (esPareja ? 'Ingresos y deudas de cada persona antes de sumarlos como hogar' : 'Información financiera evaluada para el solicitante titular') + '</p></div>'
    + solicitantesHtml
    + '</section>'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Cómo se calcula la cuota máxima</h2><p>La hoja 3 explica cómo leer los medidores</p></div>'
    + ecuacionHtml
    + '<p class="nota-calculo">La cuota máxima permitida por ley para este hogar es de ' + Formatoenteropesos(c.cuotaMaxima) + ' mensuales.</p>'
    + '</section>'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Medidores clave de capacidad</h2><p>Indicadores frente a los límites del sistema financiero</p></div>'
    + '<div class="medidores">'
    + '<div class="medidor"><div class="medidor__cab"><span>Endeudamiento</span><strong>' + c.endeudamiento_pct + '%</strong></div><div class="medidor__pista"><i style="width:' + Math.min(100, (c.endeudamiento_pct / 30) * 100) + '%"></i><b style="left:100%"></b></div><p>Compromisos actuales sobre el ingreso. El banco tolera hasta el 30%.</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Financiación bancaria</span><strong>' + pctCred + '%</strong></div><div class="medidor__pista"><i style="width:' + pctCred + '%"></i><b style="left:' + (c.cfg.fin * 100) + '%"></b></div><p>Parte del precio cubierta con crédito hipotecario (máx. ' + (c.cfg.fin * 100) + '%).</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Recursos propios</span><strong>' + ((c.ci / Math.max(1, c.precio)) * 100).toFixed(1) + '%</strong></div><div class="medidor__pista"><i style="width:' + Math.min(100, ((c.ci / Math.max(1, c.precio)) * 100)) + '%"></i></div><p>Cuota inicial requerida cubierta con ahorros y subsidios.</p></div>'
    + '</div>'
    + '</section>'
    + '</div>'
    + '<footer class="pie"><span>MiTecho Colombia · Certificado oficial de capacidad financiera</span><span class="pie__ref"><span class="mono">' + refCode + '</span><span>Hoja 1 de 3</span></span></footer>'
    + '</section>'
    + '<section class="hoja" aria-label="Hoja 2 de 3">'
    + '<div class="franja">'
    + '<div class="marca"><img src="' + LogoCertificado + '" alt="MiTecho"><div><span class="marca__nombre">MiTecho</span><span class="marca__doc">Certificado de capacidad financiera</span></div></div>'
    + '<p class="franja__ref"><b>' + refCode + '</b><br>' + nombreCompleto + '</p>'
    + '</div>'
    + '<div class="cuerpo">'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Cierre financiero</h2>' + chipEstadoCierre + '</div>'
    + '<p class="resumen-cierre">' + resumenCierreTxt + '</p>'
    + '<dl class="cascada">' + cascadaHtml + '</dl>'
    + '</section>'
    + '<section class="bloque"><div class="caja">' + cajaCardHtml + '</div></section>'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Deudas reportadas por cada solicitante</h2><p>Las activas se restan del ingreso antes de calcular la cuota</p></div>'
    + '<table class="deudas"><thead><tr><th scope="col">Obligación</th><th scope="col" class="num">Cuota mensual</th><th scope="col" class="num">Saldo pendiente</th><th scope="col">En el cálculo</th></tr></thead>'
    + deudasTbody
    + '<tfoot><tr><th scope="row">Total del hogar</th><td class="num">' + Formatoenteropesos(c.deu) + '</td><td class="num">' + Formatoenteropesos(c.deu * 24) + '</td><td>' + numTotalDeudasActivas + ' deudas activas</td></tr></tfoot>'
    + '</table>'
    + '</section>'
    + '<section class="bloque legal">'
    + '<div><h2>Nota legal y condiciones de uso</h2><p>Este certificado es una orientación financiera que genera MiTecho Colombia con la información que reportan los solicitantes. Usa las fórmulas de capacidad de pago de la Ley 546 de 1999, los decretos reglamentarios vigentes en 2026 y las tasas promedio de referencia de la Superintendencia Financiera de Colombia. No es una aprobación de crédito ni una carta de compromiso. La aprobación final depende del estudio de títulos, de la capacidad de pago y del análisis de riesgo en centrales de información (Datacrédito, TransUnion) que haga el banco o la entidad que otorgue el crédito. La cuota estimada no incluye los seguros de vida e incendio que exige el banco. El subsidio depende de la vigencia de su asignación por parte de la Caja de Compensación.</p></div>'
    + '<div class="verifica">' + QrCertificado + '<span>Código de verificación<br><span class="mono">' + refCode + '</span></span></div>'
    + '</section>'
    + '</div>'
    + '<footer class="pie"><span>MiTecho Colombia. Orientación financiera: no es una aprobación de crédito.</span><span class="pie__ref"><span class="mono">' + refCode + '</span><span>Hoja 2 de 3</span></span></footer>'
    + '</section>'
    + Construirhojatreshtml(s, c, {
        refCode,
        nombreCompleto,
        scaleMax,
        ejeTicks,
        stepVal,
        ahorroTitular,
        ahorroPareja,
        nombreTitularCorto,
        nombreParejaCorto,
        wAhorro1Pct,
        wAhorro2Pct,
        leftAhorro2Pct,
        leftSubPct,
        wSubPct,
        leftMcyPct,
        wMcyPct,
        wRecursosTotPct,
        leftCiPct,
        wCiPct,
        leftGastosPct,
        wGastosPct,
        wMargenPct,
        pctCi
      })
    + '</main>'
    + '<script>(function(){function ajustar(){var z=Math.min(1,(window.innerWidth-24)/816);document.documentElement.style.setProperty("--z",z.toFixed(3));}ajustar();window.addEventListener("resize",ajustar);window.addEventListener("beforeprint",function(){document.documentElement.style.setProperty("--z","1")});window.addEventListener("afterprint",ajustar);})();</script>'
    + '</body></html>';
}

function Generarcertificadopdf(s, c, toastFn) {
  const htmlContent = Construircertificadohtml(s, c);
  const safeName = (s.nombre || 'Usuario').replace(/[^a-zA-Z0-9]/g, '_');

  if (typeof document === 'undefined') {
    if (toastFn) toastFn('Generación en entorno no gráfico.');
    return htmlContent;
  }

  let visor = document.getElementById('mt-pdf-viewer');
  if (!visor) {
    visor = document.createElement('div');
    visor.id = 'mt-pdf-viewer';
    visor.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(11,12,10,.88);backdrop-filter:blur(10px);display:flex;flex-direction:column;align-items:center;padding:12px;box-sizing:border-box;';
    document.body.appendChild(visor);
  }

  visor.innerHTML = '<div style="width:100%;max-width:920px;display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:#16180F;border:1px solid rgba(255,255,255,.1);border-radius:12px 12px 0 0;box-sizing:border-box;">'
    + '<div style="display:flex;align-items:center;gap:10px"><img src="' + LogoCertificado + '" style="width:28px;height:auto">'
    + '<span style="font:700 15px sans-serif;color:#F2F4EC">Certificado de Capacidad Financiera</span></div>'
    + '<div style="display:flex;align-items:center;gap:8px">'
    + '<button id="mt-btn-print" style="background:#D4FF3A;color:#0B0C0A;border:none;border-radius:8px;padding:8px 14px;font:600 12px sans-serif;cursor:pointer;display:flex;align-items:center;gap:6px">Guardar como PDF / Imprimir</button>'
    + '<button id="mt-btn-dl" style="background:#24271C;color:#F2F4EC;border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:8px 12px;font:500 12px sans-serif;cursor:pointer">Descargar HTML</button>'
    + '<button id="mt-btn-close" style="background:transparent;color:#A3A898;border:none;font-size:18px;cursor:pointer;padding:4px 8px">&times;</button>'
    + '</div></div>'
    + '<iframe id="mt-pdf-frame" style="width:100%;max-width:920px;flex:1;border:1px solid rgba(255,255,255,.1);border-top:none;border-radius:0 0 12px 12px;background:#0B0C0A;box-sizing:border-box"></iframe>';

  visor.style.display = 'flex';

  const frame = document.getElementById('mt-pdf-frame');
  const frameDoc = frame.contentWindow || frame.contentDocument;
  const docTarget = frame.contentDocument || frame.contentWindow.document;
  docTarget.open();
  docTarget.write(htmlContent);
  docTarget.close();

  document.getElementById('mt-btn-close').onclick = () => { visor.style.display = 'none'; };
  document.getElementById('mt-btn-print').onclick = () => {
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } catch (e) {
      window.print();
    }
  };
  document.getElementById('mt-btn-dl').onclick = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Certificado_Capacidad_MiTecho_' + safeName + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (toastFn) toastFn('Copia HTML descargada correctamente.');
  };

  setTimeout(() => {
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } catch (e) {}
  }, 400);

  if (toastFn) toastFn('Certificado generado. Selecciona "Guardar como PDF" en tu dispositivo.');
  return htmlContent;
}

const generarCertificadoPdf = Generarcertificadopdf;
const construirCertificadoHtml = Construircertificadohtml;
