// Bloques HTML internos de las hojas 1 y 2 del reporte PDF: solicitantes, cascada, entidad y deudas

const Iconopasopdf = '<svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function Armarcascadapdf(Estadoactual, Calculo, Datos) {
  let Html = '<div class="eje" aria-hidden="true"><span class="eje__guia">Cómo leer esta gráfica: hoja 3</span><ol>' + Datos.Ejemarcas + '</ol><span>millones COP</span></div>'
    + '<div class="cascada__fila"><dt><span class="op">+</span>Ahorro y cesantías de ' + Datos.Nombretitularcorto + '</dt><dd class="pista"><i class="c-p1" style="left:0;width:' + Datos.Anchoahorrotitularporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Datos.Ahorrotitular) + '</dd></div>';

  if (Datos.Espareja) {
    Html += '<div class="cascada__fila"><dt><span class="op">+</span>Ahorro y cesantías de ' + Datos.Nombreparejacorto + '</dt><dd class="pista"><i class="c-p2" style="left:' + Datos.Izquierdaahorroparejaporcentaje + '%;width:' + Datos.Anchoahorroparejaporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Datos.Ahorropareja) + '</dd></div>';
  }

  if (Calculo.Subsidiocaja > 0) {
    Html += '<div class="cascada__fila"><dt><span class="op">+</span>Subsidio de la Caja (' + Datos.Cajanombreescapado + ')</dt><dd class="pista"><i class="c-caja" style="left:' + Datos.Izquierdasubsidioporcentaje + '%;width:' + Datos.Anchosubsidioporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Calculo.Subsidiocaja) + '</dd></div>';
  } else if (Estadoactual.Caja && (Calculo.Techosobretopevis || !Calculo.Subsidiocajaelegible)) {
    const Motivocaja = !Calculo.Subsidiocajaelegible
      ? 'No aplica: ingresos del hogar superan 4 SMMLV'
      : 'No aplica: la vivienda pasa el tope VIS';
    Html += '<div class="cascada__fila nulo"><dt><span class="op">+</span>Subsidio de la Caja (' + Datos.Cajanombreescapado + ')</dt><dd class="pista"><em>' + Motivocaja + '</em></dd><dd>$0</dd></div>';
  } else {
    Html += '<div class="cascada__fila nulo"><dt><span class="op">+</span>Subsidio de Caja de Compensación</dt><dd class="pista"><em>No aplica: el hogar no reporta afiliación a Caja</em></dd><dd>$0</dd></div>';
  }

  if (Calculo.Subsidiomicasaya > 0) {
    Html += '<div class="cascada__fila"><dt><span class="op">+</span>Subsidio Mi Casa Ya (' + Datos.Sisbengrupoescapado + ')</dt><dd class="pista"><i class="c-caja" style="left:' + Datos.Izquierdamicasayaporcentaje + '%;width:' + Datos.Anchomicasayaporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Calculo.Subsidiomicasaya) + '</dd></div>';
  } else {
    let Motivomicasaya = 'No aplica: el hogar no registra Sisbén';
    if (Calculo.Techosobretopevis) {
      Motivomicasaya = 'No aplica: la vivienda pasa el tope VIS';
    } else if (Estadoactual.Sisben) {
      Motivomicasaya = Calculo.Salariosminimos > 4 ? 'No aplica: ingresos superan 4 SMMLV' : 'Sin valor estimado';
    }
    Html += '<div class="cascada__fila nulo"><dt><span class="op">+</span>Mi Casa Ya / concurrente</dt><dd class="pista"><em>' + Motivomicasaya + '</em></dd><dd>$0</dd></div>';
  }

  const Notaescritura = Calculo.Financiargastos ? ' (va en el crédito)' : ', ' + Porcentajereporte(Datos.Porcentajegastos);
  Html += '<div class="cascada__fila suma"><dt><span class="op">=</span>Recursos propios del hogar</dt><dd class="pista"><i class="c-total" style="left:0;width:' + Datos.Anchorecursostotalporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Calculo.Efectivo) + '</dd></div>'
    + '<div class="cascada__fila resta"><dt><span class="op">−</span>Cuota inicial, ' + Porcentajereporte(Datos.Porcentajecuotainicial) + ' del precio</dt><dd class="pista"><i class="c-cuota" style="left:' + Datos.Izquierdacuotainicialporcentaje + '%;width:' + Datos.Anchocuotainicialporcentaje + '%"></i></dd><dd>−' + Formatoenteropesos(Calculo.Cuotainicial) + '</dd></div>'
    + '<div class="cascada__fila resta"><dt><span class="op">−</span>Notaría, escritura y registro' + Notaescritura + '</dt><dd class="pista"><i class="c-gastos" style="left:' + Datos.Izquierdagastosporcentaje + '%;width:' + Datos.Anchogastosporcentaje + '%"></i></dd><dd>−' + Formatoenteropesos(Calculo.Gastos) + '</dd></div>';

  if (Calculo.Falta > 0) {
    const Anchofaltaporcentaje = (Calculo.Falta / Datos.Escalamaxima * 100).toFixed(3);
    Html += '<div class="cascada__fila suma" style="border-top:1.5px solid var(--mitecho-naranja)"><dt style="color:#B23F0A"><span class="op">!</span>Te falta para esta vivienda</dt><dd class="pista"><i style="left:0;width:' + Anchofaltaporcentaje + '%;background:var(--mitecho-naranja)"></i></dd><dd style="color:#B23F0A;font-weight:700">−' + Formatoenteropesos(Calculo.Falta) + '</dd></div>';
  } else {
    Html += '<div class="cascada__fila suma"><dt><span class="op">=</span>Margen después del cierre</dt><dd class="pista"><i class="c-margen" style="left:0;width:' + Datos.Anchomargenporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Calculo.Margendespuescierre) + '</dd></div>';
  }
  return Html;
}

function Armartarjetacajapdf(Estadoactual, Calculo, Cajanombreescapado, Tasaanualtextocampo, Tasamensualtexto) {
  if (Estadoactual.Caja && Calculo.Subsidiocaja > 0) {
    const Cajalogo = Logocaja(Estadoactual.Cajanombre);
    const Subsidioficha = Calculo.Subsidiocajareal ? 'chip--asignado' : 'chip--estudio';
    let Subsidioestadotexto = 'Posible';
    if (Calculo.Subsidiocajareal) Subsidioestadotexto = 'Asignado';
    else if (Calculo.Subsidiocajavencido) Subsidioestadotexto = 'Asignación vencida';

    const Prefijovencido = Calculo.Subsidiocajavencido ? 'Tu subsidio asignado venció; mostramos el estimado por ingresos. ' : '';
    const Salariostexto = Calculo.Subsidiocajasalarios.toLocaleString('es-CO', { maximumFractionDigits: 1 });
    let Notasubsidio = '. Lo confirma tu Caja de Compensación';
    if (Calculo.Subsidiocajasobretope) Notasubsidio = '. Confirma con tu Caja que la asignación incluye a todo el hogar';
    else if (Calculo.Subsidiocajareal) Notasubsidio = '';

    const Claseasignacion = Calculo.Subsidiocajareal ? 'hecho' : 'pendiente';
    const Iconoasignacion = Calculo.Subsidiocajareal ? Iconopasopdf : '';
    let Textoasignacion = 'Pendiente de postular';
    if (Calculo.Subsidiocajareal) Textoasignacion = 'Subsidio asignado';
    else if (Calculo.Subsidiocajavencido) Textoasignacion = 'Asignación vencida';

    return '<div class="caja__grid"><div class="caja__entidad"><div class="caja__logo" aria-hidden="true">' + Cajalogo + '</div><div><h3>' + Cajanombreescapado + '</h3><p>Caja de compensación familiar<br>a la que está afiliado el hogar</p></div></div>'
      + '<div class="caja__dato caja__dato--subsidio"><span>Subsidio de vivienda <em class="chip ' + Subsidioficha + '">' + Subsidioestadotexto + '</em></span><strong>' + Formatoenteropesos(Calculo.Subsidiocaja) + '</strong><small>' + Prefijovencido + Salariostexto + ' SMMLV de 2026 (' + Formatoenteropesos(Salariominimo) + ' cada uno)' + Notasubsidio + '</small></div>'
      + '<div class="caja__dato"><span>Tasa de referencia</span><strong>' + Tasaanualtextocampo + '</strong><small>Equivale a ' + Tasamensualtexto + '</small></div></div>'
      + '<ol class="pasos" aria-label="Estado del subsidio">'
      + '<li class="paso hecho"><i>' + Iconopasopdf + '</i><b>Afiliación</b><span>Hogar afiliado</span></li>'
      + '<li class="paso hecho"><i>' + Iconopasopdf + '</i><b>Postulación</b><span>La haces en tu Caja</span></li>'
      + '<li class="paso ' + Claseasignacion + '"><i>' + Iconoasignacion + '</i><b>Asignación</b><span>' + Textoasignacion + '</span></li>'
      + '<li class="paso pendiente"><i></i><b>Desembolso</b><span>Al firmar la escritura</span></li></ol>';
  }

  if (Estadoactual.Caja) {
    const Cajalogo = Logocaja(Estadoactual.Cajanombre);
    const Chiprazon = !Calculo.Subsidiocajaelegible ? 'Supera 4 SMMLV' : 'No VIS';
    const Salariostexto = Calculo.Salariosminimos.toLocaleString('es-CO', { maximumFractionDigits: 1 });
    const Detallerazon = !Calculo.Subsidiocajaelegible
      ? 'Ingresos del hogar (' + Salariostexto + ' SMMLV) superan el tope de subsidio'
      : 'La vivienda del techo pasa el tope VIS';
    const Titulotasa = Calculo.Entidadclave === 'caja' ? 'Tasa de crédito de tu Caja' : 'Tasa de referencia';

    return '<div class="caja__grid"><div class="caja__entidad"><div class="caja__logo" aria-hidden="true">' + Cajalogo + '</div><div><h3>' + Cajanombreescapado + '</h3><p>Caja de compensación familiar<br>Línea de crédito hipotecario</p></div></div>'
      + '<div class="caja__dato"><span>Subsidio de vivienda <em class="chip chip--no-aplica">' + Chiprazon + '</em></span><strong>$0</strong><small>' + Detallerazon + '</small></div>'
      + '<div class="caja__dato"><span>' + Titulotasa + '</span><strong>' + Tasaanualtextocampo + '</strong><small>Equivale a ' + Tasamensualtexto + '</small></div></div>'
      + '<ol class="pasos" aria-label="Estado del crédito">'
      + '<li class="paso hecho"><i>' + Iconopasopdf + '</i><b>Afiliación</b><span>Hogar afiliado</span></li>'
      + '<li class="paso hecho"><i>' + Iconopasopdf + '</i><b>Perfilamiento</b><span>Capacidad evaluada</span></li>'
      + '<li class="paso pendiente"><i></i><b>Aprobación</b><span>Estudio de crédito</span></li>'
      + '<li class="paso pendiente"><i></i><b>Desembolso</b><span>Al firmar la escritura</span></li></ol>';
  }

  const Esfna = Estadoactual.Entidad === 'fna';
  const Entidadnom = Esfna ? 'Fondo Nacional del Ahorro' : 'Banca Hipotecaria';
  const Entidadlogo = Esfna ? 'FNA' : 'BH';
  const Subsidioestadofna = Calculo.Subsidiofnareal ? 'Asignado según lo que declaraste' : 'Posiblemente elegible';
  const Subsidiofichafna = Calculo.Subsidiofnareal ? 'chip--asignado' : 'chip--estudio';

  let Subsidionombre = '';
  let Subsidiodetalletexto = '';
  if (Calculo.Subsidiomicasaya > 0) {
    Subsidionombre = 'Subsidio Mi Casa Ya <em class="chip ' + Subsidiofichafna + '">' + Subsidioestadofna + ' ' + (Calculo.Subsidiomicasayasalarios || 30) + ' SMMLV</em>';
    Subsidiodetalletexto = 'Subsidio nacional de vivienda vía ' + Entidadnom + (Calculo.Subsidiofnareal ? '' : '. Lo confirma la entidad');
  } else {
    const Chipsin = Estadoactual.Sisben ? 'Sin subsidio' : 'Sin Sisbén';
    Subsidionombre = 'Subsidio de vivienda <em class="chip chip--no-aplica">' + Chipsin + '</em>';
    Subsidiodetalletexto = Estadoactual.Sisben ? 'Sin postulación a subsidio' : 'No registra clasificación Sisbén IV';
  }

  const Subsidiomontotexto = Calculo.Subsidiomicasaya > 0 ? Formatoenteropesos(Calculo.Subsidiomicasaya) : '$0';
  const Tasaetiqueta = Esfna ? 'Tasa de referencia FNA' : 'Tasa de referencia';
  const Pasoaprobacion = Esfna ? 'Aprobación FNA' : 'Aprobación bancaria';
  const Lineatipo = Esfna ? 'Crédito del FNA' : 'Financiación hipotecaria comercial';
  const Lineasubsidio = Calculo.Subsidiomicasaya > 0 ? 'con subsidio Mi Casa Ya' : 'sin subsidio familiar';
  const Clasedatosubsidio = Calculo.Subsidiomicasaya > 0 ? ' caja__dato--subsidio' : '';

  return '<div class="caja__grid"><div class="caja__entidad"><div class="caja__logo" aria-hidden="true">' + Entidadlogo + '</div><div><h3>' + Entidadnom + '</h3><p>' + Lineatipo + '<br>' + Lineasubsidio + '</p></div></div>'
    + '<div class="caja__dato' + Clasedatosubsidio + '"><span>' + Subsidionombre + '</span><strong>' + Subsidiomontotexto + '</strong><small>' + Subsidiodetalletexto + '</small></div>'
    + '<div class="caja__dato"><span>' + Tasaetiqueta + '</span><strong>' + Tasaanualtextocampo + '</strong><small>Equivale a ' + Tasamensualtexto + '</small></div></div>'
    + '<ol class="pasos" aria-label="Estado de la solicitud">'
    + '<li class="paso hecho"><i>' + Iconopasopdf + '</i><b>Perfilamiento</b><span>Ingresos y capacidad</span></li>'
    + '<li class="paso hecho"><i>' + Iconopasopdf + '</i><b>Simulación</b><span>Hecha en MiTecho</span></li>'
    + '<li class="paso pendiente"><i></i><b>' + Pasoaprobacion + '</b><span>Estudio de títulos y riesgo</span></li>'
    + '<li class="paso pendiente"><i></i><b>Desembolso</b><span>Al firmar la escritura</span></li></ol>';
}

function Armartabladeudaspdf(Datos) {
  let Html = '<tbody class="p1"><tr class="titular"><th scope="rowgroup"><i></i>' + Datos.Nombretitular + ' <small>' + Cantidadtexto(Datos.Deudasactivastitular.length, 'activa', 'activas') + '</small></th><td class="num">' + Formatoenteropesos(Datos.Deudastitular) + '</td><td class="num">' + Formatoenteropesos(Datos.Saldotitular) + '</td><td></td></tr>';
  if (Datos.Deudaslista.length === 0) {
    Html += '<tr><td colspan="4" style="color:var(--mitecho-tenue);padding-left:12px">No reporta deudas ni compromisos financieros activos</td></tr>';
  } else {
    Datos.Deudaslista.forEach(Deuda => {
      const Esactiva = Deuda.Activa !== false;
      const Cuotatexto = Formatoenteropesos(Deuda.Cuota || 0);
      const Saldotexto = Deuda.Saldo ? Formatoenteropesos(Deuda.Saldo) : 'No registra';
      const Deudanombre = Datos.Escapar(Deuda.Nombreitem || Deuda.Concepto || 'Obligación');
      if (Esactiva) {
        Html += '<tr><td>' + Deudanombre + '</td><td class="num">' + Cuotatexto + '</td><td class="num">' + Saldotexto + '</td><td><span class="estado">Se descuenta</span></td></tr>';
      } else {
        Html += '<tr class="excluida"><td><span>' + Deudanombre + '</span></td><td class="num">' + Cuotatexto + '</td><td class="num">' + Saldotexto + '</td><td><span class="estado estado--excluida">Excluida por el usuario</span></td></tr>';
      }
    });
  }
  Html += '</tbody>';

  if (Datos.Espareja) {
    const Etiquetadeudaspareja = Datos.Deudaspareja > 0 ? 'declaradas' : 'sin deudas';
    Html += '<tbody class="p2"><tr class="titular"><th scope="rowgroup"><i></i>' + Datos.Nombrepareja + ' <small>' + Etiquetadeudaspareja + '</small></th><td class="num">' + Formatoenteropesos(Datos.Deudaspareja) + '</td><td class="num">—</td><td></td></tr>';
    if (Datos.Deudaspareja > 0) {
      Html += '<tr><td>Cuotas mensuales declaradas</td><td class="num">' + Formatoenteropesos(Datos.Deudaspareja) + '</td><td class="num">No registra</td><td><span class="estado">Se descuenta</span></td></tr>';
    } else {
      Html += '<tr><td colspan="4" style="color:var(--mitecho-tenue);padding-left:12px">No reporta obligaciones financieras activas</td></tr>';
    }
    Html += '</tbody>';
  }
  return Html;
}

function Armarsolicitantespdf(Estadoactual, Calculo, Datos) {
  if (Datos.Espareja) {
    const Ingresopareja = Estadoactual.Parejaingreso || 0;
    return '<div class="solicitantes">'
      + '<article class="persona persona--1"><div class="persona__cab"><p class="persona__rol"><span class="mono">S1</span>Titular</p><p class="aporte"><span class="aporte__barra"><i style="width:' + Datos.Aportetitular + '%"></i></span><span><b>' + Datos.Aportetitular + '%</b> del ingreso del hogar</span></p></div><h3>' + Datos.Nombretitular + '</h3><p class="persona__perfil">' + Datos.Perfiltitular + '</p><dl class="cuentas"><div><dt>Ingreso bruto mensual</dt><dd>' + Formatoenteropesos(Calculo.Ingresotitular) + '</dd></div><div class="total"><dt>Ingreso evaluado</dt><dd>' + Formatoenteropesos(Calculo.Ingresotitular) + '</dd></div><div class="menos"><dt>Cuotas deudas activas</dt><dd>−' + Formatoenteropesos(Datos.Deudastitular) + '</dd></div><div class="total"><dt>Ingreso libre de deudas</dt><dd>' + Formatoenteropesos(Math.max(0, Calculo.Ingresotitular - Datos.Deudastitular)) + '</dd></div><div><dt>Ahorro y cesantías</dt><dd>' + Formatoenteropesos(Datos.Ahorrotitular) + '</dd></div></dl></article>'
      + '<article class="persona persona--2"><div class="persona__cab"><p class="persona__rol"><span class="mono">S2</span>Solicitante 2</p><p class="aporte"><span class="aporte__barra"><i style="width:' + Datos.Aportepareja + '%"></i></span><span><b>' + Datos.Aportepareja + '%</b> del ingreso del hogar</span></p></div><h3>' + Datos.Nombrepareja + '</h3><p class="persona__perfil">' + Datos.Perfilpareja + '</p><dl class="cuentas"><div><dt>Ingreso bruto mensual</dt><dd>' + Formatoenteropesos(Ingresopareja) + '</dd></div><div class="total"><dt>Ingreso evaluado</dt><dd>' + Formatoenteropesos(Ingresopareja) + '</dd></div><div class="menos"><dt>Cuotas deudas activas</dt><dd>−' + Formatoenteropesos(Datos.Deudaspareja) + '</dd></div><div class="total"><dt>Ingreso libre de deudas</dt><dd>' + Formatoenteropesos(Math.max(0, Ingresopareja - Datos.Deudaspareja)) + '</dd></div><div><dt>Ahorro y cesantías</dt><dd>' + Formatoenteropesos(Datos.Ahorropareja) + '</dd></div></dl></article>'
      + '</div>';
  }
  return '<div class="solicitantes solicitantes--individual"><article class="persona persona--1"><div class="persona__cab"><p class="persona__rol"><span class="mono">S1</span>Solicitante Titular</p><p class="aporte"><span class="aporte__barra"><i style="width:100%"></i></span><span><b>100%</b> del ingreso evaluado</span></p></div><h3>' + Datos.Nombretitular + '</h3><p class="persona__perfil">' + Datos.Perfiltitular + ' · ' + Datos.Ciudadescapada + '</p><dl class="cuentas"><div><dt>Ingreso mensual</dt><dd>' + Formatoenteropesos(Calculo.Ingresototal) + '</dd></div><div class="total"><dt>Ingreso evaluado</dt><dd>' + Formatoenteropesos(Calculo.Ingresototal) + '</dd></div><div class="menos"><dt>Cuotas deudas activas</dt><dd>−' + Formatoenteropesos(Calculo.Deudasmes) + '</dd></div><div class="total"><dt>Ingreso libre de deudas</dt><dd>' + Formatoenteropesos(Calculo.Neto) + '</dd></div><div><dt>Ahorro y cesantías</dt><dd>' + Formatoenteropesos(Datos.Ahorrotitular) + '</dd></div></dl></article></div>';
}
