// Tercera hoja del reporte PDF: guía paso a paso de la cascada, medidores, documentos y glosario

function Formatomillon(Valor) {
  return '$' + ((Valor || 0) / 1000000).toFixed(1).replace('.', ',') + ' M';
}

function Construirhojatreshtml(Estadoactual, Calculo, Meta) {
  const Escapar = typeof Escaparhtml === 'function' ? Escaparhtml : (Opcion => Opcion);
  // Los nombres ya vienen escapados desde Construircertificadohtml
  const Nomtitularcorto = Meta.Nombretitularcorto;
  const Nomparejacorto = Meta.Nombreparejacorto;
  const Nomcompleto = Meta.Nombrecompleto;
  const Codigoreferencia = Escapar(Meta.Codigoreferencia);

  const Esleasing = Estadoactual.Modalidadelegida === 'leasing';
  const Esnovis = Calculo.Modalidadelegida === 'novis' || Calculo.Techosobretopevis;
  const Porcentajeendeudamiento = Math.round((Calculo.Deudasmes / Math.max(1, Calculo.Ingresototal)) * 100);
  const Anchopistaendeudamiento = Math.min(100, (Porcentajeendeudamiento / 60) * 100).toFixed(1);
  const Porcentajecuota = Math.round((Calculo.Cuota / Math.max(1, Calculo.Ingresototal)) * 100);
  const Anchopistacuota = Math.min(100, (Porcentajecuota / 60) * 100).toFixed(1);
  const Topesobrelibre = Math.round(Calculo.Tope * 100);
  const Topesobretotal = Math.round((Calculo.Cuotamaxima / Math.max(1, Calculo.Ingresototal)) * 100);
  const Lineacota = Math.min(100, (Topesobretotal / 60) * 100).toFixed(1);
  const Porcentajecarga = Math.round(((Calculo.Deudasmes + Calculo.Cuota) / Math.max(1, Calculo.Ingresototal)) * 100);
  const Anchopistacarga = Math.min(100, (Porcentajecarga / 60) * 100).toFixed(1);
  const Clasetagvalor = Number(Anchopistaendeudamiento) < 42 ? 'mg__tag mg__tag--valor mg__tag--valor-der' : 'mg__tag mg__tag--valor';

  let Filaspasouno = '<div class="cascada__fila">'
    + '<dt><span class="op">+</span>Ahorro de ' + Nomtitularcorto + '</dt>'
    + '<dd class="pista"><i class="c-p1" style="left:0;width:' + Meta.Anchoahorrotitularporcentaje + '%"></i></dd>'
    + '<dd>' + Formatomillon(Meta.Ahorrotitular) + '</dd>'
    + '</div>';

  if (Meta.Espareja) {
    Filaspasouno += '<div class="cascada__fila">'
      + '<dt><span class="op">+</span>Ahorro de ' + Nomparejacorto + '</dt>'
      + '<dd class="pista"><i class="c-p2" style="left:' + Meta.Izquierdaahorroparejaporcentaje + '%;width:' + Meta.Anchoahorroparejaporcentaje + '%"></i></dd>'
      + '<dd>' + Formatomillon(Meta.Ahorropareja) + '</dd>'
      + '</div>';
  }

  if (Calculo.Subsidiocaja > 0) {
    Filaspasouno += '<div class="cascada__fila">'
      + '<dt><span class="op">+</span>Subsidio de la Caja</dt>'
      + '<dd class="pista"><i class="c-caja" style="left:' + Meta.Izquierdasubsidioporcentaje + '%;width:' + Meta.Anchosubsidioporcentaje + '%"></i></dd>'
      + '<dd>' + Formatomillon(Calculo.Subsidiocaja) + '</dd>'
      + '</div>';
  }

  if (Calculo.Subsidiomicasaya > 0) {
    Filaspasouno += '<div class="cascada__fila">'
      + '<dt><span class="op">+</span>Subsidio Mi Casa Ya</dt>'
      + '<dd class="pista"><i class="c-caja" style="left:' + Meta.Izquierdamicasayaporcentaje + '%;width:' + Meta.Anchomicasayaporcentaje + '%"></i></dd>'
      + '<dd>' + Formatomillon(Calculo.Subsidiomicasaya) + '</dd>'
      + '</div>';
  }

  if (Calculo.Subsidiocaja === 0 && Calculo.Subsidiomicasaya === 0) {
    Filaspasouno += '<div class="cascada__fila nulo">'
      + '<dt><span class="op">+</span>Subsidio de vivienda</dt>'
      + '<dd class="pista"><em>No aplica subsidio</em></dd>'
      + '<dd>$0</dd>'
      + '</div>';
  }

  const Filapasodos = '<div class="cascada__fila suma">'
    + '<dt><span class="op">=</span>Recursos propios</dt>'
    + '<dd class="pista"><i class="c-total" style="left:0;width:' + Meta.Anchorecursostotalporcentaje + '%"></i></dd>'
    + '<dd>' + Formatomillon(Calculo.Efectivo) + '</dd>'
    + '</div>';

  let Rotulocuotapasotres = 'Cuota inicial, ' + Porcentajereporte(Meta.Porcentajecuotainicial);
  if (Esleasing) Rotulocuotapasotres = 'Pago inicial, ' + Porcentajereporte(Meta.Porcentajecuotainicial);

  let Rotulogastospasotres = 'Notaría y registro';
  if (Esleasing) Rotulogastospasotres = 'Notaría (leasing)';
  else if (Calculo.Financiargastos) Rotulogastospasotres = 'Notaría (en crédito)';

  const Filaspasotres = '<div class="cascada__fila resta">'
    + '<dt><span class="op">−</span>' + Rotulocuotapasotres + '</dt>'
    + '<dd class="pista"><i class="c-cuota" style="left:' + Meta.Izquierdacuotainicialporcentaje + '%;width:' + Meta.Anchocuotainicialporcentaje + '%"></i></dd>'
    + '<dd>−' + Formatomillon(Calculo.Cuotainicial) + '</dd>'
    + '</div>'
    + '<div class="cascada__fila resta">'
    + '<dt><span class="op">−</span>' + Rotulogastospasotres + '</dt>'
    + '<dd class="pista"><i class="c-gastos" style="left:' + Meta.Izquierdagastosporcentaje + '%;width:' + Meta.Anchogastosporcentaje + '%"></i></dd>'
    + '<dd>−' + Formatomillon(Calculo.Gastos) + '</dd>'
    + '</div>';

  let Filapasocuatro = '';
  let Notapasocuatro = '';
  if (Calculo.Falta > 0) {
    const Anchofaltaporcentaje = (Calculo.Falta / Meta.Escalamaxima * 100).toFixed(3);
    const Solocuotainicial = Calculo.Financiargastos || Esleasing;
    const Titulofalta = Solocuotainicial ? 'Cuota inicial faltante' : 'Cuota inicial y gastos faltantes';
    Filapasocuatro = '<div class="cascada__fila suma" style="border-top:1.5px solid var(--mitecho-naranja)">'
      + '<dt style="color:#B23F0A"><span class="op">!</span>' + Titulofalta + '</dt>'
      + '<dd class="pista"><i style="left:0;width:' + Anchofaltaporcentaje + '%;background:var(--mitecho-naranja)"></i></dd>'
      + '<dd style="color:#B23F0A;font-weight:700">−' + Formatomillon(Calculo.Falta) + '</dd>'
      + '</div>';
    if (Solocuotainicial) {
      Notapasocuatro = '<b>Lo que falta.</b> Indica el ahorro adicional necesario para cubrir la cuota inicial y aprovechar el cupo de crédito.';
    } else {
      Notapasocuatro = '<b>Lo que falta.</b> Indica el ahorro adicional necesario para cubrir la cuota inicial más notaría y registro.';
    }
  } else {
    Filapasocuatro = '<div class="cascada__fila suma">'
      + '<dt><span class="op">=</span>Margen</dt>'
      + '<dd class="pista"><i class="c-margen" style="left:0;width:' + Meta.Anchomargenporcentaje + '%"></i></dd>'
      + '<dd>' + Formatomillon(Calculo.Margendespuescierre) + '</dd>'
      + '</div>';
    Notapasocuatro = '<b>Lo que sobra.</b> Si esta barra aparece, el pago se completa. Si no alcanza, la hoja 2 muestra cuánto falta.';
  }

  let Detallemedidorcuota = 'De cada <b>$100</b> del ingreso total, <b>$' + Porcentajecuota + '</b> irían a la cuota. La línea marca el límite legal del <b>' + Topesobrelibre + '%</b> sobre el ingreso libre de deudas.';
  if (Calculo.Deudasmes > 0) {
    Detallemedidorcuota = 'De cada <b>$100</b> del ingreso total, <b>$' + Porcentajecuota + '</b> irían a la cuota. El límite del ' + Topesobrelibre + '% se aplica sobre el ingreso libre de deudas y equivale al <b>' + Topesobretotal + '%</b> del ingreso total.';
  }

  const Porcentajevisinicial = Math.round((1 - Modalidadesvivienda.vis.Financiacion) * 100);
  const Porcentajenovisinicial = Math.round((1 - Modalidadesvivienda.novis.Financiacion) * 100);
  let Glosariocuotainicial = 'Parte del precio que el banco no presta: mínimo ' + Porcentajevisinicial + '% en VIS y ' + Porcentajenovisinicial + '% en No VIS.';
  if (Esleasing) {
    Glosariocuotainicial = 'Aporte inicial que asume el hogar: en leasing habitacional suele ser desde el ' + Math.round((1 - Modalidadesvivienda.leasing.Financiacion) * 100) + '%.';
  }

  const Tituloglosariosubsidio = Estadoactual.Caja && !Esnovis && !Esleasing ? 'Subsidio de la Caja' : 'Subsidio de vivienda';
  let Detalleglosariosubsidio = 'Aporte estatal o de Caja para vivienda VIS que no se devuelve si se cumplen requisitos.';
  if (Estadoactual.Caja && !Esnovis && !Esleasing) {
    Detalleglosariosubsidio = 'Dinero que aporta la Caja de Compensación para vivienda VIS y que no se devuelve.';
  }

  return '<section class="hoja" aria-label="Hoja 3 de 3">'
    + '<p class="aviso-simulacion">' + Leyendareporte() + '</p>'
    + '<header class="franja"><div class="marca"><img src="' + Logocertificado + '" alt="MiTecho"><div><span class="marca__nombre">MiTecho</span><span class="marca__doc">Reporte de simulación de capacidad de compra</span></div></div><p class="franja__ref"><b>' + Codigoreferencia + '</b><br>' + Nomcompleto + '</p></header>'
    + '<div class="cuerpo"><section class="bloque"><h2 class="guia__titulo">Cómo leer este reporte</h2></section>'
    + '<section class="bloque"><div class="bloque__cab"><h2>La gráfica del cierre financiero</h2><span class="guia__hoja">Hoja 2</span></div>'
    + '<p class="guia__pregunta">Responde una pregunta: <strong>¿le alcanza al hogar para pagar lo que el banco no presta?</strong> Se lee de arriba hacia abajo.</p>'
    + '<div class="lectura"><div class="lectura__cab" aria-hidden="true"><span></span><div class="eje"><span></span><ol>' + Meta.Ejemarcas + '</ol><span>millones</span></div><span></span></div>'
    + '<div class="lectura__paso"><span class="lectura__num">1</span><dl>' + Filaspasouno + '</dl><p class="lectura__nota"><b>Lo que tiene el hogar.</b> Cada barra es una fuente de dinero y empieza donde termina la anterior, como bloques en fila.</p></div>'
    + '<div class="lectura__paso"><span class="lectura__num">2</span><dl>' + Filapasodos + '</dl><p class="lectura__nota"><b>El total.</b> La barra oscura suma todo lo anterior: el dinero propio del hogar.</p></div>'
    + '<div class="lectura__paso"><span class="lectura__num">3</span><dl>' + Filaspasotres + '</dl><p class="lectura__nota"><b>Lo que hay que pagar.</b> Se descuentan del total y avanzan hacia la izquierda: primero la cuota inicial, luego los gastos.</p></div>'
    + '<div class="lectura__paso"><span class="lectura__num">4</span><dl>' + Filapasocuatro + '</dl><p class="lectura__nota">' + Notapasocuatro + '</p></div></div>'
    + '<div class="lectura__claves"><p class="signos"><span><b>+</b>suma</span><span><b>−</b>resta</span><span><b>=</b>resultado</span><span>Cada línea vertical marca ' + Math.round(Meta.Pasovalor / 1000000) + ' millones de pesos</span></p></div></section>'
    + '<section class="bloque"><div class="bloque__cab"><h2>Los medidores</h2><span class="guia__hoja">Hoja 1</span></div>'
    + '<div class="medidor-guia"><div class="mg" role="img" aria-label="Ejemplo de medidor: la barra llega a ' + Porcentajeendeudamiento + '% y la línea de referencia está en 25%"><span>0%</span><div class="mg__pista"><i style="width:' + Anchopistaendeudamiento + '%"></i><b style="left:41.67%"></b><span class="mg__tag mg__tag--linea" style="left:41.67%"><strong>25%</strong>Límite de referencia</span><span class="' + Clasetagvalor + '" style="left:' + Anchopistaendeudamiento + '%"><strong>' + Porcentajeendeudamiento + '%</strong>Valor del hogar</span></div><span>60%</span></div><p class="medidor-guia__regla"><b>Regla rápida</b>Si la barra termina antes de la línea, el indicador está dentro de lo recomendado. La pista completa equivale a 60% del ingreso.</p></div>'
    + '<div class="medidores medidores--guia">'
    + '<div class="medidor"><div class="medidor__cab"><span>Endeudamiento actual</span><strong>' + Porcentajeendeudamiento + '%</strong></div><div class="medidor__pista"><i style="width:' + Anchopistaendeudamiento + '%"></i><b style="left:41.67%"></b></div><p class="medidor__ejemplo">De cada <b>$100</b> que gana el hogar, <b>$' + Porcentajeendeudamiento + '</b> ya pagan deudas. MiTecho lo considera saludable por debajo de $25.</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Cuota sobre el ingreso</span><strong>' + Porcentajecuota + '%</strong></div><div class="medidor__pista"><i style="width:' + Anchopistacuota + '%"></i><b style="left:' + Lineacota + '%"></b></div><p class="medidor__ejemplo">' + Detallemedidorcuota + '</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Carga total al comprar</span><strong>' + Porcentajecarga + '%</strong></div><div class="medidor__pista"><i style="width:' + Anchopistacarga + '%"></i></div><p class="medidor__ejemplo">De cada <b>$100</b>, <b>$' + Porcentajecarga + '</b> se irían en deudas y cuota, y <b>$' + Math.max(0, 100 - Porcentajecarga) + '</b> quedan para el día a día. Sin línea: es informativo.</p></div>'
    + '</div></section>'
    + '<section class="bloque"><div class="bloque__cab"><h2>Lo que te va a pedir el banco</h2></div>'
    + '<ul class="documentos"><li><b>Empleados:</b> certificado laboral y desprendibles de nómina recientes.</li><li><b>Todos:</b> cédula y extractos bancarios de 3 a 6 meses.</li><li><b>Ingresos del año:</b> certificado de ingresos y retenciones o declaración de renta.</li><li><b>Independientes:</b> certificación de ingresos firmada por un contador público.</li></ul>'
    + '<p class="documentos-nota"><b>Nueva o usada:</b> confirma con la entidad que su crédito y tu subsidio apliquen a la vivienda que vas a comprar; Mi Casa Ya aplica principalmente a vivienda nueva.</p></section>'
    + '<section class="bloque"><div class="bloque__cab"><h2>Palabras del reporte</h2></div>'
    + '<dl class="glosario"><div><dt>Cuota inicial</dt><dd>' + Glosariocuotainicial + '</dd></div><div><dt>Cierre financiero</dt><dd>Reunir crédito, ahorros, cesantías y subsidios para pagar la vivienda.</dd></div><div><dt>Margen</dt><dd>Lo que sobra después de pagar la cuota inicial y los gastos.</dd></div><div><dt>Ingreso libre</dt><dd>Lo que gana el hogar al mes menos las cuotas de sus deudas.</dd></div><div><dt>SMMLV</dt><dd>Salario mínimo mensual legal vigente: ' + Formatoenteropesos(Salariominimo) + ' en ' + Aniovigente + '.</dd></div><div><dt>' + Tituloglosariosubsidio + '</dt><dd>' + Detalleglosariosubsidio + '</dd></div></dl></section>'
    + '</div>'
    + '<footer class="pie"><span>MiTecho Colombia · Reporte de simulación, no es una aprobación de crédito</span><span class="pie__ref"><span class="mono">' + Meta.Codigoreferencia + '</span><span>Hoja 3 de 3</span></span></footer></section>';
}
