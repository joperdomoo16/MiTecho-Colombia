// Armado del reporte de simulación de capacidad de compra, en tres hojas, para el usuario

// Ajusta la escala del certificado a la pantalla. Si se cambia, hay que actualizar su huella sha256 en la CSP de index.html
const Scriptajustecertificado = '(function(){function ajustar(){var z=Math.min(1,(window.innerWidth-24)/816);document.documentElement.style.setProperty("--z",z.toFixed(3));}ajustar();window.addEventListener("resize",ajustar);window.addEventListener("beforeprint",function(){document.documentElement.style.setProperty("--z","1")});window.addEventListener("afterprint",ajustar);})();';

// Letras y números al azar con el generador criptográfico del celular, sin letras que se confundan
function Generarcodigoaleatorio(Largo) {
  const Alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const Bytes = new Uint8Array(Largo);
  crypto.getRandomValues(Bytes);
  let Codigo = '';
  for (let Indice = 0; Indice < Largo; Indice++) {
    Codigo += Alfabeto[Bytes[Indice] % Alfabeto.length];
  }
  return Codigo;
}

// Construye las tres hojas del certificado adaptadas para un solicitante o para pareja
function Construircertificadohtml(Estadoactual, Calculobase) {
  // Todo el reporte se arma con los valores del techo, igual que Inicio y el Simulador
  const Calculo = Vistatecho(Calculobase);
  const Esuvr = Estadoactual.Tasatipo === 'uvr' && Estadoactual.Modalidadelegida !== 'leasing' && Calculo.Entidadclave !== 'caja';
  const Esleasing = Estadoactual.Modalidadelegida === 'leasing';
  const Plazolimitado = Calculo.Plazo < (Estadoactual.Plazoelegido || 20) && !Calculo.Preaprobadotasa;
  const Ahora = new Date();
  const Fechatexto = Ahora.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const Codigoreferencia = 'MT-' + Ahora.getFullYear() + '-' + Generarcodigoaleatorio(5);

  const Espareja = Boolean(Estadoactual.Pareja);
  const Escapar = typeof Escaparhtml === 'function' ? Escaparhtml : (Opcion => Opcion);
  const Nombretitular = Escapar(Estadoactual.Nombre || 'Solicitante Titular');
  const Nombrepareja = Escapar(Estadoactual.Parejanombre || 'Segundo Solicitante');
  const Nombrecompleto = Nombretitular + (Espareja ? ' y ' + Nombrepareja : '');
  const Nombretitularcorto = Nombretitular.split(' ')[0];
  const Nombreparejacorto = Nombrepareja.split(' ')[0];
  const Cajanombreescapado = Escapar(Estadoactual.Cajanombre || 'Compensar');
  const Sisbengrupoescapado = Escapar(Estadoactual.Sisbengrupo || 'A1-C8');
  const Ciudadescapada = Escapar(Estadoactual.Ciudad || 'Colombia');

  const Aportetitular = Espareja ? Math.round((Calculo.Ingresotitular / Math.max(1, Calculo.Ingresototal)) * 100) : 100;
  const Aportepareja = Espareja ? (100 - Aportetitular) : 0;

  const Perfiltitular = Estadoactual.Tipo === 'fijo'
    ? 'Empleado · Ingresos fijos mensuales'
    : Estadoactual.Tipo === 'variable'
    ? 'Independiente · Ventas y comisiones variables'
    : 'Ingresos mixtos: salario fijo más comisiones';
  const Perfilpareja = Escapar(Estadoactual.Parejaactividad || 'Actividad no registrada');

  const Deudastitular = (Estadoactual.Deudas || []).filter(Deuda => Deuda.Activa !== false).reduce((Acumulado, Deuda) => Acumulado + (Deuda.Cuota || 0), 0);
  const Deudaspareja = Espareja ? (Estadoactual.Parejadeudas || 0) : 0;

  const Infoentidades = Estadoactual.Infoentidad || {}, Egresocategoria = Infoentidades.caja || {}, Egresofijo = Infoentidades.fna || {};
  const Ahorroentidad = (Egresocategoria.Cesantias || 0) + (Egresocategoria.Ahorro || 0) + (Egresofijo.Cesantias || 0) + (Egresofijo.Ahorro || 0);
  const Ahorrotitular = (Estadoactual.Ahorro || 0) + Ahorroentidad;
  const Ahorropareja = Espareja ? (Estadoactual.Parejaahorro || 0) : 0;

  const Porcentajecredito = Calculo.Financiacionporcentaje > 0 ? Calculo.Financiacionporcentaje : 80;
  const Porcentajecuotainicial = Number((100 - Porcentajecredito).toFixed(1));
  const Anchocredito = Math.round(720 * (Porcentajecredito / 100));
  const Anchocuotainicial = 720 - Anchocredito;

  const Fraseportada = Espareja
    ? (Nombretitularcorto + ' y ' + Nombreparejacorto + ', según lo que declararon, podrían acceder a una vivienda de hasta')
    : (Nombretitularcorto + ', según lo que declaraste, podrías acceder a una vivienda de hasta');

  let Fichaestadocierre = '';
  let Resumencierretexto = '';
  if (Calculo.Estadocierre === 'cierre_completo' || Calculo.Estadocierre === 'limitado_tope_vis') {
    Fichaestadocierre = '<span class="estado-cierre"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Cuota inicial cubierta</span>';
    Resumencierretexto = 'El banco financia <strong>' + Formatoenteropesos(Calculo.Credito) + '</strong>, el ' + Porcentajereporte(Porcentajecredito) + ' del precio' + (Calculo.Financiargastos ? ' (incluye escrituración Ley 2434).' : '.') + ' El hogar cubre la cuota inicial con sus propios recursos' + (Calculo.Margendespuescierre > 0 ? (' y le queda un margen de <strong>' + Formatoenteropesos(Calculo.Margendespuescierre) + '</strong>.') : '.');
  } else if (Calculo.Estadocierre === 'falta_cuota_inicial') {
    Fichaestadocierre = '<span class="estado-cierre" style="background:var(--mitecho-dorado)"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.8" fill="none" stroke="#0B0C0A" stroke-width="1.6"/><path d="M6 3.2v3.2M6 8.2v.4" stroke="#0B0C0A" stroke-width="1.6" stroke-linecap="round"/></svg>Falta cuota inicial</span>';
    Resumencierretexto = 'Para la vivienda de <strong>' + Formatoenteropesos(Calculo.Precio) + '</strong> el banco prestaría <strong>' + Formatoenteropesos(Calculo.Credito) + '</strong>. Con los recursos propios de hoy faltan <strong>' + Formatoenteropesos(Calculo.Falta) + '</strong> de cuota inicial y gastos; mientras tanto, el hogar puede cerrar una compra de hasta <strong>' + Formatoenteropesos(Calculo.Preciohoyreal) + '</strong>.';
  } else {
    Fichaestadocierre = '<span class="estado-cierre" style="background:var(--mitecho-naranja);color:#FFF"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.8" fill="none" stroke="#FFF" stroke-width="1.6"/><path d="M4 4l4 4M8 4l-4 4" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"/></svg>Sin capacidad</span>';
    Resumencierretexto = 'El nivel de obligaciones financieras activas supera los ingresos reportados, por lo que no se cuenta con margen de cuota hipotecaria en este momento.';
  }

  if (Calculo.Techosobretopevis) Resumencierretexto += ' Este techo pasa el tope VIS (' + Calculo.Topevissalarios + ' SMMLV = ' + Formatoenteropesos(Calculo.Topevis) + '): a ese precio la vivienda es No VIS, el banco financia hasta el 70% y no aplica subsidio.';
  const Porcentajegastos = Calculo.Precio > 0 ? Calculo.Gastostecho / Calculo.Precio * 100 : 0;
  const Cascadamaxima = Math.max(Calculo.Efectivo, Calculo.Cuotainicial + Calculo.Gastos, Calculo.Falta, 10000000);
  const Escalamaxima = Math.ceil(Cascadamaxima / 10000000) * 10000000;
  const Pasostotal = 7;
  const Pasovalor = Escalamaxima / Pasostotal;
  let Ejemarcas = '';
  for (let Clave = 0; Clave <= Pasostotal; Clave++) {
    const Izquierdaporcentaje = (Clave / Pasostotal * 100).toFixed(3);
    const Millonvalor = Math.round((Clave * Pasovalor) / 1000000);
    Ejemarcas += '<li style="left:' + Izquierdaporcentaje + '%">' + Millonvalor + '</li>';
  }

  const Anchoahorrotitularporcentaje = (Ahorrotitular / Escalamaxima * 100).toFixed(3);
  const Anchoahorroparejaporcentaje = (Ahorropareja / Escalamaxima * 100).toFixed(3);
  const Izquierdaahorroparejaporcentaje = Anchoahorrotitularporcentaje;
  const Izquierdasubsidioporcentaje = ((Ahorrotitular + Ahorropareja) / Escalamaxima * 100).toFixed(3);
  const Anchosubsidioporcentaje = (((Calculo.Subsidiocaja || 0)) / Escalamaxima * 100).toFixed(3);
  const Izquierdamicasayaporcentaje = ((Ahorrotitular + Ahorropareja + (Calculo.Subsidiocaja || 0)) / Escalamaxima * 100).toFixed(3);
  const Anchomicasayaporcentaje = (((Calculo.Subsidiomicasaya || 0)) / Escalamaxima * 100).toFixed(3);
  const Anchorecursostotalporcentaje = (Calculo.Efectivo / Escalamaxima * 100).toFixed(3);
  const Izquierdacuotainicialporcentaje = (Math.max(0, Calculo.Efectivo - Calculo.Cuotainicial) / Escalamaxima * 100).toFixed(3);
  const Anchocuotainicialporcentaje = (Calculo.Cuotainicial / Escalamaxima * 100).toFixed(3);
  const Izquierdagastosporcentaje = (Math.max(0, Calculo.Efectivo - Calculo.Cuotainicial - Calculo.Gastos) / Escalamaxima * 100).toFixed(3);
  const Anchogastosporcentaje = (Calculo.Gastos / Escalamaxima * 100).toFixed(3);
  const Anchomargenporcentaje = (Math.max(0, Calculo.Margendespuescierre) / Escalamaxima * 100).toFixed(3);

  let Cascadahtml = '<div class="eje" aria-hidden="true"><span class="eje__guia">Cómo leer esta gráfica: hoja 3</span><ol>' + Ejemarcas + '</ol><span>millones COP</span></div>'
    + '<div class="cascada__fila"><dt><span class="op">+</span>Ahorro y cesantías de ' + Nombretitularcorto + '</dt><dd class="pista"><i class="c-p1" style="left:0;width:' + Anchoahorrotitularporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Ahorrotitular) + '</dd></div>';

  if (Espareja) {
    Cascadahtml += '<div class="cascada__fila"><dt><span class="op">+</span>Ahorro y cesantías de ' + Nombreparejacorto + '</dt><dd class="pista"><i class="c-p2" style="left:' + Izquierdaahorroparejaporcentaje + '%;width:' + Anchoahorroparejaporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Ahorropareja) + '</dd></div>';
  }

  if (Calculo.Subsidiocaja > 0) {
    Cascadahtml += '<div class="cascada__fila"><dt><span class="op">+</span>Subsidio de la Caja (' + Cajanombreescapado + ')</dt><dd class="pista"><i class="c-caja" style="left:' + Izquierdasubsidioporcentaje + '%;width:' + Anchosubsidioporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Calculo.Subsidiocaja) + '</dd></div>';
  } else if (Estadoactual.Caja && (Calculo.Techosobretopevis || !Calculo.Subsidiocajaelegible)) {
    Cascadahtml += '<div class="cascada__fila nulo"><dt><span class="op">+</span>Subsidio de la Caja (' + Cajanombreescapado + ')</dt><dd class="pista"><em>' + (!Calculo.Subsidiocajaelegible ? 'No aplica: ingresos del hogar superan 4 SMMLV' : 'No aplica: la vivienda pasa el tope VIS') + '</em></dd><dd>$0</dd></div>';
  } else {
    Cascadahtml += '<div class="cascada__fila nulo"><dt><span class="op">+</span>Subsidio de Caja de Compensación</dt><dd class="pista"><em>No aplica: el hogar no reporta afiliación a Caja</em></dd><dd>$0</dd></div>';
  }

  if (Calculo.Subsidiomicasaya > 0) {
    Cascadahtml += '<div class="cascada__fila"><dt><span class="op">+</span>Subsidio Mi Casa Ya (' + Sisbengrupoescapado + ')</dt><dd class="pista"><i class="c-caja" style="left:' + Izquierdamicasayaporcentaje + '%;width:' + Anchomicasayaporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Calculo.Subsidiomicasaya) + '</dd></div>';
  } else {
    Cascadahtml += '<div class="cascada__fila nulo"><dt><span class="op">+</span>Mi Casa Ya / concurrente</dt><dd class="pista"><em>' + (Calculo.Techosobretopevis ? 'No aplica: la vivienda pasa el tope VIS' : Estadoactual.Sisben ? (Calculo.Salariosminimos > 4 ? 'No aplica: ingresos superan 4 SMMLV' : 'Sin valor estimado') : 'No aplica: el hogar no registra Sisbén') + '</em></dd><dd>$0</dd></div>';
  }
  Cascadahtml += '<div class="cascada__fila suma"><dt><span class="op">=</span>Recursos propios del hogar</dt><dd class="pista"><i class="c-total" style="left:0;width:' + Anchorecursostotalporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Calculo.Efectivo) + '</dd></div>'
    + '<div class="cascada__fila resta"><dt><span class="op">−</span>Cuota inicial, ' + Porcentajereporte(Porcentajecuotainicial) + ' del precio</dt><dd class="pista"><i class="c-cuota" style="left:' + Izquierdacuotainicialporcentaje + '%;width:' + Anchocuotainicialporcentaje + '%"></i></dd><dd>−' + Formatoenteropesos(Calculo.Cuotainicial) + '</dd></div>'
    + '<div class="cascada__fila resta"><dt><span class="op">−</span>Notaría, escritura y registro' + (Calculo.Financiargastos ? ' (va en el crédito)' : ', ' + Porcentajereporte(Porcentajegastos)) + '</dt><dd class="pista"><i class="c-gastos" style="left:' + Izquierdagastosporcentaje + '%;width:' + Anchogastosporcentaje + '%"></i></dd><dd>−' + Formatoenteropesos(Calculo.Gastos) + '</dd></div>';

  if (Calculo.Falta > 0) {
    const Anchofaltaporcentaje = (Calculo.Falta / Escalamaxima * 100).toFixed(3);
    Cascadahtml += '<div class="cascada__fila suma" style="border-top:1.5px solid var(--mitecho-naranja)"><dt style="color:#B23F0A"><span class="op">!</span>Te falta para esta vivienda</dt><dd class="pista"><i style="left:0;width:' + Anchofaltaporcentaje + '%;background:var(--mitecho-naranja)"></i></dd><dd style="color:#B23F0A;font-weight:700">−' + Formatoenteropesos(Calculo.Falta) + '</dd></div>';
  } else {
    Cascadahtml += '<div class="cascada__fila suma"><dt><span class="op">=</span>Margen después del cierre</dt><dd class="pista"><i class="c-margen" style="left:0;width:' + Anchomargenporcentaje + '%"></i></dd><dd>' + Formatoenteropesos(Calculo.Margendespuescierre) + '</dd></div>';
  }

  let Cajatarjetahtml = '';
  const Tasaanualtextocampo = (Calculo.Tasaanual * 100).toFixed(2).replace('.', ',') + (Esuvr ? '% + UVR' : '% E.A.');
  const Tasamensualvalor = Calculo.Tasamensual || (Calculo.Anualidad ? Calculo.Anualidad.Tasaperiodica : (Math.pow(1 + Calculo.Tasaanual, 1 / 12) - 1));
  const Tasamensualtexto = (Tasamensualvalor * 100).toFixed(2).replace('.', ',') + '% mes vencido';

  if (Estadoactual.Caja && Calculo.Subsidiocaja > 0) {
    const Cajanom = Cajanombreescapado;
    const Cajalogo = Logocaja(Estadoactual.Cajanombre);
    const Subsidioficha = Calculo.Subsidiocajareal ? 'chip--asignado' : 'chip--estudio';
    const Subsidioestadotexto = Calculo.Subsidiocajareal ? 'Asignado' : Calculo.Subsidiocajavencido ? 'Asignación vencida' : 'Posible';
    Cajatarjetahtml = '<div class="caja__grid"><div class="caja__entidad"><div class="caja__logo" aria-hidden="true">' + Cajalogo + '</div><div><h3>' + Cajanom + '</h3><p>Caja de compensación familiar<br>a la que está afiliado el hogar</p></div></div><div class="caja__dato caja__dato--subsidio"><span>Subsidio de vivienda <em class="chip ' + Subsidioficha + '">' + Subsidioestadotexto + '</em></span><strong>' + Formatoenteropesos(Calculo.Subsidiocaja) + '</strong><small>' + (Calculo.Subsidiocajavencido ? 'Tu subsidio asignado venció; mostramos el estimado por ingresos. ' : '') + Calculo.Subsidiocajasalarios.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' SMMLV de 2026 (' + Formatoenteropesos(Salariominimo) + ' cada uno)' + (Calculo.Subsidiocajasobretope ? '. Confirma con tu Caja que la asignación incluye a todo el hogar' : Calculo.Subsidiocajareal ? '' : '. Lo confirma tu Caja de Compensación') + '</small></div><div class="caja__dato"><span>Tasa de referencia</span><strong>' + Tasaanualtextocampo + '</strong><small>Equivale a ' + Tasamensualtexto + '</small></div></div><ol class="pasos" aria-label="Estado del subsidio"><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Afiliación</b><span>Hogar afiliado</span></li><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Postulación</b><span>La haces en tu Caja</span></li><li class="paso ' + (Calculo.Subsidiocajareal ? 'hecho' : 'pendiente') + '"><i>' + (Calculo.Subsidiocajareal ? '<svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '') + '</i><b>Asignación</b><span>' + (Calculo.Subsidiocajareal ? 'Subsidio asignado' : Calculo.Subsidiocajavencido ? 'Asignación vencida' : 'Pendiente de postular') + '</span></li><li class="paso pendiente"><i></i><b>Desembolso</b><span>Al firmar la escritura</span></li></ol>';
  } else if (Estadoactual.Caja) {
    const Cajanom = Cajanombreescapado;
    const Cajalogo = Logocaja(Estadoactual.Cajanombre);
    Cajatarjetahtml = '<div class="caja__grid"><div class="caja__entidad"><div class="caja__logo" aria-hidden="true">' + Cajalogo + '</div><div><h3>' + Cajanom + '</h3><p>Caja de compensación familiar<br>Línea de crédito hipotecario</p></div></div><div class="caja__dato"><span>Subsidio de vivienda <em class="chip chip--no-aplica">' + (!Calculo.Subsidiocajaelegible ? 'Supera 4 SMMLV' : 'No VIS') + '</em></span><strong>$0</strong><small>' + (!Calculo.Subsidiocajaelegible ? 'Ingresos del hogar (' + Calculo.Salariosminimos.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' SMMLV) superan el tope de subsidio' : 'La vivienda del techo pasa el tope VIS') + '</small></div><div class="caja__dato"><span>' + (Calculo.Entidadclave === 'caja' ? 'Tasa de crédito de tu Caja' : 'Tasa de referencia') + '</span><strong>' + Tasaanualtextocampo + '</strong><small>Equivale a ' + Tasamensualtexto + '</small></div></div><ol class="pasos" aria-label="Estado del crédito"><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Afiliación</b><span>Hogar afiliado</span></li><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Perfilamiento</b><span>Capacidad evaluada</span></li><li class="paso pendiente"><i></i><b>Aprobación</b><span>Estudio de crédito</span></li><li class="paso pendiente"><i></i><b>Desembolso</b><span>Al firmar la escritura</span></li></ol>';
  } else {
    const Entidadnom = Estadoactual.Entidad === 'fna' ? 'Fondo Nacional del Ahorro' : 'Banca Hipotecaria';
    const Entidadlogo = Estadoactual.Entidad === 'fna' ? 'FNA' : 'BH';
    const Subsidioestadofna = Calculo.Subsidiofnareal ? 'Asignado según lo que declaraste' : 'Posiblemente elegible';
    const Subsidiofichafna = Calculo.Subsidiofnareal ? 'chip--asignado' : 'chip--estudio';
    const Subsidionombre = Calculo.Subsidiomicasaya > 0 ? ('Subsidio Mi Casa Ya <em class="chip ' + Subsidiofichafna + '">' + Subsidioestadofna + ' ' + (Calculo.Subsidiomicasayasalarios || 30) + ' SMMLV</em>') : 'Subsidio de vivienda <em class="chip chip--no-aplica">' + (Estadoactual.Sisben ? 'Sin subsidio' : 'Sin Sisbén') + '</em>';
    const Subsidiomontotexto = Calculo.Subsidiomicasaya > 0 ? Formatoenteropesos(Calculo.Subsidiomicasaya) : '$0';
    const Subsidiodetalletexto = Calculo.Subsidiomicasaya > 0 ? ('Subsidio nacional de vivienda vía ' + Entidadnom + (Calculo.Subsidiofnareal ? '' : '. Lo confirma la entidad')) : (Estadoactual.Sisben ? 'Sin postulación a subsidio' : 'No registra clasificación Sisbén IV');
    const Tasaetiqueta = Estadoactual.Entidad === 'fna' ? 'Tasa de referencia FNA' : 'Tasa de referencia';
    const Pasoaprobacion = Estadoactual.Entidad === 'fna' ? 'Aprobación FNA' : 'Aprobación bancaria';
    Cajatarjetahtml = '<div class="caja__grid"><div class="caja__entidad"><div class="caja__logo" aria-hidden="true">' + Entidadlogo + '</div><div><h3>' + Entidadnom + '</h3><p>' + (Estadoactual.Entidad === 'fna' ? 'Crédito del FNA' : 'Financiación hipotecaria comercial') + '<br>' + (Calculo.Subsidiomicasaya > 0 ? 'con subsidio Mi Casa Ya' : 'sin subsidio familiar') + '</p></div></div><div class="caja__dato' + (Calculo.Subsidiomicasaya > 0 ? ' caja__dato--subsidio' : '') + '"><span>' + Subsidionombre + '</span><strong>' + Subsidiomontotexto + '</strong><small>' + Subsidiodetalletexto + '</small></div><div class="caja__dato"><span>' + Tasaetiqueta + '</span><strong>' + Tasaanualtextocampo + '</strong><small>Equivale a ' + Tasamensualtexto + '</small></div></div><ol class="pasos" aria-label="Estado de la solicitud"><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Perfilamiento</b><span>Ingresos y capacidad</span></li><li class="paso hecho"><i><svg viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b>Simulación</b><span>Hecha en MiTecho</span></li><li class="paso pendiente"><i></i><b>' + Pasoaprobacion + '</b><span>Estudio de títulos y riesgo</span></li><li class="paso pendiente"><i></i><b>Desembolso</b><span>Al firmar la escritura</span></li></ol>';
  }

  let Deudascuerpotabla = '';
  const Deudaslista = Estadoactual.Deudas || [];
  const Deudasactivastitular = Deudaslista.filter(Deuda => Deuda.Activa !== false);
  const Saldotitular = Deudasactivastitular.reduce((Acumulado, Deuda) => Acumulado + (Deuda.Saldo || 0), 0);

  Deudascuerpotabla += '<tbody class="p1"><tr class="titular"><th scope="rowgroup"><i></i>' + Nombretitular + ' <small>' + Cantidadtexto(Deudasactivastitular.length, 'activa', 'activas') + '</small></th><td class="num">' + Formatoenteropesos(Deudastitular) + '</td><td class="num">' + Formatoenteropesos(Saldotitular) + '</td><td></td></tr>';
  if (Deudaslista.length === 0) {
    Deudascuerpotabla += '<tr><td colspan="4" style="color:var(--mitecho-tenue);padding-left:12px">No reporta deudas ni compromisos financieros activos</td></tr>';
  } else {
    Deudaslista.forEach(Deuda => {
      const Esactiva = Deuda.Activa !== false;
      const Cuotatexto = Formatoenteropesos(Deuda.Cuota || 0);
      const Saldotexto = Deuda.Saldo ? Formatoenteropesos(Deuda.Saldo) : 'No registra';
      const Deudanombre = Escapar(Deuda.Nombreitem || Deuda.Concepto || 'Obligación');
      if (Esactiva) {
        Deudascuerpotabla += '<tr><td>' + Deudanombre + '</td><td class="num">' + Cuotatexto + '</td><td class="num">' + Saldotexto + '</td><td><span class="estado">Se descuenta</span></td></tr>';
      } else {
        Deudascuerpotabla += '<tr class="excluida"><td><span>' + Deudanombre + '</span></td><td class="num">' + Cuotatexto + '</td><td class="num">' + Saldotexto + '</td><td><span class="estado estado--excluida">Excluida por el usuario</span></td></tr>';
      }
    });
  }
  Deudascuerpotabla += '</tbody>';

  if (Espareja) {
    Deudascuerpotabla += '<tbody class="p2"><tr class="titular"><th scope="rowgroup"><i></i>' + Nombrepareja + ' <small>' + (Deudaspareja > 0 ? 'declaradas' : 'sin deudas') + '</small></th><td class="num">' + Formatoenteropesos(Deudaspareja) + '</td><td class="num">—</td><td></td></tr>';
    if (Deudaspareja > 0) {
      Deudascuerpotabla += '<tr><td>Cuotas mensuales declaradas</td><td class="num">' + Formatoenteropesos(Deudaspareja) + '</td><td class="num">No registra</td><td><span class="estado">Se descuenta</span></td></tr>';
    } else {
      Deudascuerpotabla += '<tr><td colspan="4" style="color:var(--mitecho-tenue);padding-left:12px">No reporta obligaciones financieras activas</td></tr>';
    }
    Deudascuerpotabla += '</tbody>';
  }

  const Totaldeudasactivas = Deudasactivastitular.length + (Espareja && Deudaspareja > 0 ? 1 : 0);

  let Ecuacionhtml = '';
  if (Espareja) {
    Ecuacionhtml = '<div class="ecuacion"><div><small>Ingreso ' + Nombretitularcorto + '</small><strong>' + Formatoenteropesos(Calculo.Ingresotitular) + '</strong></div><span>+</span><div><small>Ingreso ' + Nombreparejacorto + '</small><strong>' + Formatoenteropesos(Calculo.Ingresototal - Calculo.Ingresotitular) + '</strong></div><span>−</span><div><small>Deudas del hogar</small><strong>' + Formatoenteropesos(Calculo.Deudasmes) + '</strong></div><span>=</span><div><small>Ingreso disponible</small><strong>' + Formatoenteropesos(Calculo.Neto) + '</strong></div><span>×</span><div><small>Cuota máx.</small><strong>' + Math.round(Calculo.Tope * 100) + '%</strong></div><div class="resultado"><small>Cuota máxima</small><strong>' + Formatoenteropesos(Calculo.Cuotamaxima) + '</strong></div></div>';
  } else {
    Ecuacionhtml = '<div class="ecuacion ecuacion--individual"><div><small>Ingreso mensual</small><strong>' + Formatoenteropesos(Calculo.Ingresototal) + '</strong></div><span>−</span><div><small>Deudas del solicitante</small><strong>' + Formatoenteropesos(Calculo.Deudasmes) + '</strong></div><span>=</span><div><small>Ingreso disponible</small><strong>' + Formatoenteropesos(Calculo.Neto) + '</strong></div><span>×</span><div><small>Cuota máx.</small><strong>' + Math.round(Calculo.Tope * 100) + '%</strong></div><div class="resultado"><small>Cuota máxima</small><strong>' + Formatoenteropesos(Calculo.Cuotamaxima) + '</strong></div></div>';
  }

  let Solicitanteshtml = '';
  if (Espareja) {
    Solicitanteshtml = '<div class="solicitantes"><article class="persona persona--1"><div class="persona__cab"><p class="persona__rol"><span class="mono">S1</span>Titular</p><p class="aporte"><span class="aporte__barra"><i style="width:' + Aportetitular + '%"></i></span><span><b>' + Aportetitular + '%</b> del ingreso del hogar</span></p></div><h3>' + Nombretitular + '</h3><p class="persona__perfil">' + Perfiltitular + '</p><dl class="cuentas"><div><dt>Ingreso bruto mensual</dt><dd>' + Formatoenteropesos(Calculo.Ingresotitular) + '</dd></div><div class="total"><dt>Ingreso evaluado</dt><dd>' + Formatoenteropesos(Calculo.Ingresotitular) + '</dd></div><div class="menos"><dt>Cuotas deudas activas</dt><dd>−' + Formatoenteropesos(Deudastitular) + '</dd></div><div class="total"><dt>Ingreso libre de deudas</dt><dd>' + Formatoenteropesos(Math.max(0, Calculo.Ingresotitular - Deudastitular)) + '</dd></div><div><dt>Ahorro y cesantías</dt><dd>' + Formatoenteropesos(Ahorrotitular) + '</dd></div></dl></article><article class="persona persona--2"><div class="persona__cab"><p class="persona__rol"><span class="mono">S2</span>Solicitante 2</p><p class="aporte"><span class="aporte__barra"><i style="width:' + Aportepareja + '%"></i></span><span><b>' + Aportepareja + '%</b> del ingreso del hogar</span></p></div><h3>' + Nombrepareja + '</h3><p class="persona__perfil">' + Perfilpareja + '</p><dl class="cuentas"><div><dt>Ingreso bruto mensual</dt><dd>' + Formatoenteropesos(Estadoactual.Parejaingreso || 0) + '</dd></div><div class="total"><dt>Ingreso evaluado</dt><dd>' + Formatoenteropesos(Estadoactual.Parejaingreso || 0) + '</dd></div><div class="menos"><dt>Cuotas deudas activas</dt><dd>−' + Formatoenteropesos(Deudaspareja) + '</dd></div><div class="total"><dt>Ingreso libre de deudas</dt><dd>' + Formatoenteropesos(Math.max(0, (Estadoactual.Parejaingreso || 0) - Deudaspareja)) + '</dd></div><div><dt>Ahorro y cesantías</dt><dd>' + Formatoenteropesos(Ahorropareja) + '</dd></div></dl></article></div>';
  } else {
    Solicitanteshtml = '<div class="solicitantes solicitantes--individual"><article class="persona persona--1"><div class="persona__cab"><p class="persona__rol"><span class="mono">S1</span>Solicitante Titular</p><p class="aporte"><span class="aporte__barra"><i style="width:100%"></i></span><span><b>100%</b> del ingreso evaluado</span></p></div><h3>' + Nombretitular + '</h3><p class="persona__perfil">' + Perfiltitular + ' · ' + Ciudadescapada + '</p><dl class="cuentas"><div><dt>Ingreso mensual</dt><dd>' + Formatoenteropesos(Calculo.Ingresototal) + '</dd></div><div class="total"><dt>Ingreso evaluado</dt><dd>' + Formatoenteropesos(Calculo.Ingresototal) + '</dd></div><div class="menos"><dt>Cuotas deudas activas</dt><dd>−' + Formatoenteropesos(Calculo.Deudasmes) + '</dd></div><div class="total"><dt>Ingreso libre de deudas</dt><dd>' + Formatoenteropesos(Calculo.Neto) + '</dd></div><div><dt>Ahorro y cesantías</dt><dd>' + Formatoenteropesos(Ahorrotitular) + '</dd></div></dl></article></div>';
  }

  return '<!doctype html>'
    + '<html lang="es-CO">'
    + '<head>'
    + '<meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<title>Reporte de simulación de capacidad de compra · MiTecho</title>'
    + '<link rel="preconnect" href="https://fonts.googleapis.com">'
    + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    + '<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@600;700&family=Hanken+Grotesk:wght@400;600&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">'
    + '<style>' + Estiloscertificado + '\n*{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}\n.persona__rol{white-space:nowrap}\n.pasos-reporte{margin:0;padding-left:18px;list-style:decimal;font-size:11px;line-height:1.4;color:var(--tinta-2)}\n.pasos-reporte li+li{margin-top:2px}\n.pasos-reporte b{color:var(--tinta);font-weight:600}\n.solicitantes--individual{grid-template-columns:1fr}\n.ecuacion--individual{grid-template-columns:1.2fr auto 1.2fr auto 1.2fr auto .8fr auto 1.3fr}\n</style>'
    + '</head>'
    + '<body>'
    + '<main class="doc">'
    + '<section class="hoja" aria-label="Hoja 1 de 3">'
    + '<p class="aviso-simulacion">' + Leyendareporte() + '</p>'
    + '<header class="plano">'
    + '<div class="plano__top">'
    + '<div class="marca">'
    + '<img src="' + Logocertificado + '" alt="MiTecho">'
    + '<div><span class="marca__nombre">MiTecho</span><span class="marca__doc">REPORTE DE SIMULACIÓN DE CAPACIDAD DE COMPRA</span></div>'
    + '</div>'
    + '<dl class="cajetin">'
    + '<div><dt>Fecha</dt><dd>' + Fechatexto + '</dd></div>'
    + '<div><dt>Tasas al</dt><dd>' + Fechatasasreferencia + '</dd></div>'
    + '<div><dt>Consulta</dt><dd>' + Codigoreferencia + '</dd></div>'
    + '<div><dt>Modalidad</dt><dd>' + (Calculo.Techosobretopevis ? 'No VIS (pasa tope VIS)' : Esuvr ? (Calculo.Configuracion.Etiqueta + ' en UVR') : Calculo.Configuracion.Etiqueta) + '</dd></div>'
    + '<div><dt>Plazo</dt><dd>' + Calculo.Plazo + ' años (' + (Calculo.Plazo * 12) + ' m)</dd></div>'
    + '<div><dt>' + (Esuvr ? 'Tasa' : 'Tasa E.A.') + '</dt><dd>' + Tasaanualtextocampo + '</dd></div>'
    + '</dl>'
    + '</div>'
    + '<p class="plano__frase">' + Fraseportada + '</p>'
    + '<div class="plano__cifra"><span class="moneda">$</span>' + Formatomillones(Calculo.Precio) + '<span class="unidad">M</span></div>'
    + '<figure class="cota">'
    + '<svg viewBox="0 0 720 72" aria-hidden="true">'
    + '<g stroke="#A3A898" stroke-width="1" fill="none">'
    + '<path d="M0.5 6V66M' + Anchocredito + '.5 30V66M719.5 6V66" stroke-opacity=".45"/>'
    + '<path d="M0 18H720M0 42H720"/>'
    + '</g>'
    + '<g stroke="#F2F4EC" stroke-width="1.6">'
    + '<path d="M-5 23L5 13M715 23L725 13M-5 47L5 37M' + (Anchocredito - 4) + ' 47L' + (Anchocredito + 6) + ' 37M715 47L725 37"/>'
    + '</g>'
    + '<text class="cota__txt" x="360" y="12" text-anchor="middle">precio máximo ' + Formatoenteropesos(Calculo.Precio) + ' COP</text>'
    + '<text class="cota__pct" x="' + Math.round(Anchocredito / 2) + '" y="36" text-anchor="middle">' + Porcentajereporte(Porcentajecredito) + '</text>'
    + '<text class="cota__pct" x="' + Math.round(Anchocredito + Anchocuotainicial / 2) + '" y="36" text-anchor="middle">' + Porcentajereporte(Porcentajecuotainicial) + '</text>'
    + '<rect x="0" y="52" width="' + Math.max(2, Anchocredito - 2) + '" height="20" rx="3" fill="#F2F4EC"/>'
    + '<rect x="' + (Anchocredito + 3) + '" y="52" width="' + Math.max(2, Anchocuotainicial - 3) + '" height="20" rx="3" fill="#D4FF3A"/>'
    + '</svg>'
    + '<figcaption class="cota__leyenda" style="grid-template-columns:' + Porcentajecredito + 'fr ' + Porcentajecuotainicial + 'fr">'
    + '<p><strong>' + Formatoenteropesos(Calculo.Credito) + '</strong>' + (Esleasing ? 'Financiación del leasing' : 'Crédito hipotecario del banco') + '</p>'
    + '<p><strong>' + Formatoenteropesos(Calculo.Cuotainicial) + '</strong>' + (Esleasing ? 'Pago inicial requerido' : 'Cuota inicial requerida') + '</p>'
    + '</figcaption>'
    + '</figure>'
    + '<ul class="plano__datos">'
    + '<li><span>' + (Esleasing ? 'Canon mensual estimado' : Esuvr ? 'Primera cuota en UVR' : 'Cuota mensual estimada') + '</span><strong>' + Formatoenteropesos(Calculo.Cuota) + '</strong><small>' + Math.round((Calculo.Cuota / Math.max(1, Calculo.Ingresototal)) * 100) + (Esuvr ? '% del ingreso; sube con la inflación' : '% del ingreso del hogar') + '</small></li>'
    + '<li><span>Tasa de interés</span><strong>' + Tasaanualtextocampo + '</strong><small>' + Calculo.Plazo + ' años' + (Plazolimitado ? ' (por la edad)' : '') + ', ' + (Calculo.Plazo * 12) + (Esuvr ? ' cuotas en UVR' : Esleasing ? ' cánones' : Plazolimitado ? ' cuotas fijas' : ' cuotas fijas en pesos') + '</small></li>'
    + '<li><span>Total pagado al banco</span><strong>' + Formatoenteropesos((Esuvr ? Totaluvr(Calculo.Cuota, Calculo.Plazo * 12) : Calculo.Cuota * Calculo.Plazo * 12) + (Esleasing ? Calculo.Opcioncompra * Calculo.Credito : 0)) + '</strong><small>' + (Esuvr ? 'Con inflación de ' + Porcentajereporte(Inflacionanual * 100) + ' al año, sin seguros' : Esleasing ? 'Incluye la opción de compra' : 'En ' + Calculo.Plazo + ' años, sin seguros') + '</small></li>'
    + '</ul>'
    + '</header>'
    + '<div class="cuerpo">'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Quiénes solicitan</h2><p>' + (Espareja ? 'Ingresos y deudas de cada persona antes de sumarlos como hogar' : 'Información financiera evaluada para el solicitante titular') + '</p></div>'
    + Solicitanteshtml
    + '</section>'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Cómo se calcula la cuota máxima</h2><p>La hoja 3 explica cómo leer los medidores</p></div>'
    + Ecuacionhtml
    + '<p class="nota-calculo">La cuota máxima para este hogar, con el ' + Math.round(Calculo.Tope * 100) + '% de su ingreso libre, es de ' + Formatoenteropesos(Calculo.Cuotamaxima) + ' mensuales.</p>'
    + '</section>'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Medidores clave de capacidad</h2><p>Indicadores frente a los límites del sistema financiero</p></div>'
    + '<div class="medidores">'
    + '<div class="medidor"><div class="medidor__cab"><span>Endeudamiento</span><strong>' + Porcentajereporte(Calculo.Endeudamientoporcentaje) + '</strong></div><div class="medidor__pista"><i style="width:' + Math.min(100, (Calculo.Endeudamientoporcentaje / 30) * 100) + '%"></i><b style="left:100%"></b></div><p>Compromisos actuales sobre el ingreso. Muchos bancos prefieren que no pasen del 30%.</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Financiación bancaria</span><strong>' + Porcentajereporte(Porcentajecredito) + '</strong></div><div class="medidor__pista"><i style="width:' + Porcentajecredito + '%"></i><b style="left:' + Math.round((Calculo.Techosobretopevis ? 0.7 : Calculo.Configuracion.Financiacion) * 100) + '%"></b></div><p>Parte del precio cubierta con ' + (Esleasing ? 'el leasing' : 'crédito hipotecario') + ' (máx. ' + Math.round((Calculo.Techosobretopevis ? 0.7 : Calculo.Configuracion.Financiacion) * 100) + '%).</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Recursos propios</span><strong>' + Porcentajereporte((Calculo.Cuotainicial / Math.max(1, Calculo.Precio)) * 100) + '</strong></div><div class="medidor__pista"><i style="width:' + Math.min(100, ((Calculo.Cuotainicial / Math.max(1, Calculo.Precio)) * 100)) + '%"></i></div><p>Cuota inicial requerida cubierta con ahorros y subsidios.</p></div>'
    + '</div>'
    + '</section>'
    + '</div>'
    + '<footer class="pie"><span>MiTecho Colombia · Reporte de simulación, no es una aprobación de crédito</span><span class="pie__ref"><span class="mono">' + Codigoreferencia + '</span><span>Hoja 1 de 3</span></span></footer>'
    + '</section>'
    + '<section class="hoja" aria-label="Hoja 2 de 3">'
    + '<p class="aviso-simulacion">' + Leyendareporte() + '</p>'
    + '<div class="franja">'
    + '<div class="marca"><img src="' + Logocertificado + '" alt="MiTecho"><div><span class="marca__nombre">MiTecho</span><span class="marca__doc">Reporte de simulación de capacidad de compra</span></div></div>'
    + '<p class="franja__ref"><b>' + Codigoreferencia + '</b><br>' + Nombrecompleto + '</p>'
    + '</div>'
    + '<div class="cuerpo">'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Cierre financiero</h2>' + Fichaestadocierre + '</div>'
    + '<p class="resumen-cierre">' + Resumencierretexto + '</p>'
    + '<dl class="cascada">' + Cascadahtml + '</dl>'
    + '</section>'
    + '<section class="bloque"><div class="caja">' + Cajatarjetahtml + '</div></section>'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Deudas reportadas por cada solicitante</h2><p>Las activas se restan del ingreso antes de calcular la cuota</p></div>'
    + '<table class="deudas"><thead><tr><th scope="col">Obligación</th><th scope="col" class="num">Cuota mensual</th><th scope="col" class="num">Saldo pendiente</th><th scope="col">En el cálculo</th></tr></thead>'
    + Deudascuerpotabla
    + '<tfoot><tr><th scope="row">Total del hogar</th><td class="num">' + Formatoenteropesos(Calculo.Deudasmes) + '</td><td class="num">' + Formatoenteropesos(Saldotitular) + (Espareja && Deudaspareja > 0 ? '*' : '') + '</td><td>' + Cantidadtexto(Totaldeudasactivas, 'deuda activa', 'deudas activas') + '</td></tr></tfoot>'
    + '</table>'
    + (Espareja && Deudaspareja > 0 ? '<p class="nota-calculo">* El saldo total no incluye las deudas de ' + Nombreparejacorto + ', porque solo se declaró su cuota mensual.</p>' : '')
    + '</section>'
    // Los pasos caben en la hoja 2 solo cuando hay una persona y pocas deudas; en pareja la hoja ya va llena
    + (!Espareja && Deudaslista.length <= 3 && !Calculo.Subsidiocajavencido ? '<section class="bloque"><div class="bloque__cab"><h2>Próximos pasos</h2><p>Según las cifras de este reporte</p></div>' + Pasosreporte(Estadoactual, Calculo) + '</section>' : '')
    + '<section class="bloque legal">'
    + '<div><h2>Nota legal y condiciones de uso</h2><p>Este reporte es una simulación educativa que genera MiTecho Colombia con la información que declaran los solicitantes, sin verificarla. MiTecho no es una entidad financiera y este documento no sirve como soporte ante un banco. Usa las fórmulas de capacidad de pago de la Ley 546 de 1999, los decretos reglamentarios vigentes en 2026 y las tasas promedio de referencia de la Superintendencia Financiera de Colombia. No es una aprobación de crédito ni una carta de compromiso. La aprobación final depende del estudio de títulos, de la capacidad de pago y del análisis de riesgo en centrales de información (Datacrédito, TransUnion) que haga el banco o la entidad que otorgue el crédito. La cuota estimada no incluye los seguros de vida e incendio que exige el banco. El subsidio depende de la vigencia de su asignación por parte de la Caja de Compensación.</p></div>'
    + '<div class="verifica"><span>Número de consulta<br><span class="mono">' + Codigoreferencia + '</span><br>Úsalo si nos escribes a soporte</span></div>'
    + '</section>'
    + '</div>'
    + '<footer class="pie"><span>MiTecho Colombia · Reporte de simulación, no es una aprobación de crédito</span><span class="pie__ref"><span class="mono">' + Codigoreferencia + '</span><span>Hoja 2 de 3</span></span></footer>'
    + '</section>'
    + Construirhojatreshtml(Estadoactual, Calculo, {
        Codigoreferencia,
        Nombrecompleto,
        Escalamaxima,
        Ejemarcas,
        Pasovalor,
        Ahorrotitular,
        Ahorropareja,
        Nombretitularcorto,
        Nombreparejacorto,
        Anchoahorrotitularporcentaje,
        Anchoahorroparejaporcentaje,
        Izquierdaahorroparejaporcentaje,
        Izquierdasubsidioporcentaje,
        Anchosubsidioporcentaje,
        Izquierdamicasayaporcentaje,
        Anchomicasayaporcentaje,
        Anchorecursostotalporcentaje,
        Izquierdacuotainicialporcentaje,
        Anchocuotainicialporcentaje,
        Izquierdagastosporcentaje,
        Anchogastosporcentaje,
        Anchomargenporcentaje,
        Porcentajecuotainicial
      })
    + '</main>'
    + '<script>' + Scriptajustecertificado + '</script>'
    + '</body></html>';
}

