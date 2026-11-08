// Construcción de la tercera hoja con la guía práctica para leer el certificado de capacidad financiera

function Formatomillon(v) {
  return '$' + ((v || 0) / 1000000).toFixed(1).replace('.', ',') + ' M';
}

// Arma la tercera hoja explicando la gráfica de cierre financiero, los medidores y el glosario
function Construirhojatreshtml(s, c, meta) {
  const esc = typeof EscaparHtml === 'function' ? EscaparHtml : (x => x);
  const nomTitularCorto = esc(meta.nombreTitularCorto);
  const nomParejaCorto = esc(meta.nombreParejaCorto);
  const nomCompleto = esc(meta.nombreCompleto);
  const refCode = esc(meta.refCode);

  const pctEnd = Math.round((c.deu / Math.max(1, c.ing)) * 100);
  const wPistaEnd = Math.min(100, (pctEnd / 60) * 100).toFixed(1);
  const pctCuota = Math.round((c.cuota / Math.max(1, c.ing)) * 100);
  const wPistaCuota = Math.min(100, (pctCuota / 60) * 100).toFixed(1);
  const pctCarga = Math.round(((c.deu + c.cuota) / Math.max(1, c.ing)) * 100);
  const wPistaCarga = Math.min(100, (pctCarga / 60) * 100).toFixed(1);

  let filasPasouno = '<div class="cascada__fila">'
    + '<dt><span class="op">+</span>Ahorro de ' + nomTitularCorto + '</dt>'
    + '<dd class="pista"><i class="c-p1" style="left:0;width:' + meta.wAhorro1Pct + '%"></i></dd>'
    + '<dd>' + Formatomillon(meta.ahorroTitular) + '</dd>'
    + '</div>';

  if (s.pareja) {
    filasPasouno += '<div class="cascada__fila">'
      + '<dt><span class="op">+</span>Ahorro de ' + nomParejaCorto + '</dt>'
      + '<dd class="pista"><i class="c-p2" style="left:' + meta.leftAhorro2Pct + '%;width:' + meta.wAhorro2Pct + '%"></i></dd>'
      + '<dd>' + Formatomillon(meta.ahorroPareja) + '</dd>'
      + '</div>';
  }

  if (c.subCaja > 0) {
    filasPasouno += '<div class="cascada__fila">'
      + '<dt><span class="op">+</span>Subsidio de la Caja</dt>'
      + '<dd class="pista"><i class="c-caja" style="left:' + meta.leftSubPct + '%;width:' + meta.wSubPct + '%"></i></dd>'
      + '<dd>' + Formatomillon(c.subCaja) + '</dd>'
      + '</div>';
  }

  if (c.subMcy > 0) {
    filasPasouno += '<div class="cascada__fila">'
      + '<dt><span class="op">+</span>Subsidio Mi Casa Ya</dt>'
      + '<dd class="pista"><i class="c-caja" style="left:' + meta.leftMcyPct + '%;width:' + meta.wMcyPct + '%"></i></dd>'
      + '<dd>' + Formatomillon(c.subMcy) + '</dd>'
      + '</div>';
  }

  if (c.subCaja === 0 && c.subMcy === 0) {
    filasPasouno += '<div class="cascada__fila nulo">'
      + '<dt><span class="op">+</span>Subsidio de vivienda</dt>'
      + '<dd class="pista"><em>No aplica subsidio</em></dd>'
      + '<dd>$0</dd>'
      + '</div>';
  }

  const filaPasodos = '<div class="cascada__fila suma">'
    + '<dt><span class="op">=</span>Recursos propios</dt>'
    + '<dd class="pista"><i class="c-total" style="left:0;width:' + meta.wRecursosTotPct + '%"></i></dd>'
    + '<dd>' + Formatomillon(c.cash) + '</dd>'
    + '</div>';

  const filasPasotres = '<div class="cascada__fila resta">'
    + '<dt><span class="op">−</span>Cuota inicial, ' + meta.pctCi + '%</dt>'
    + '<dd class="pista"><i class="c-cuota" style="left:' + meta.leftCiPct + '%;width:' + meta.wCiPct + '%"></i></dd>'
    + '<dd>−' + Formatomillon(c.ci) + '</dd>'
    + '</div>'
    + '<div class="cascada__fila resta">'
    + '<dt><span class="op">−</span>Notaría y registro</dt>'
    + '<dd class="pista"><i class="c-gastos" style="left:' + meta.leftGastosPct + '%;width:' + meta.wGastosPct + '%"></i></dd>'
    + '<dd>−' + Formatomillon(c.gastos) + '</dd>'
    + '</div>';

  let filaPasocuatro = '';
  let notaPasocuatro = '';
  if (c.falta > 0) {
    const wFaltaPct = (c.falta / meta.scaleMax * 100).toFixed(3);
    filaPasocuatro = '<div class="cascada__fila suma" style="border-top:1.5px solid var(--mitecho-naranja)">'
      + '<dt style="color:#B23F0A"><span class="op">!</span>Cuota inicial faltante</dt>'
      + '<dd class="pista"><i style="left:0;width:' + wFaltaPct + '%;background:var(--mitecho-naranja)"></i></dd>'
      + '<dd style="color:#B23F0A;font-weight:700">−' + Formatomillon(c.falta) + '</dd>'
      + '</div>';
    notaPasocuatro = '<b>Lo que falta.</b> Indica el ahorro adicional necesario para poder aprovechar la capacidad plena de crédito.';
  } else {
    filaPasocuatro = '<div class="cascada__fila suma">'
      + '<dt><span class="op">=</span>Margen</dt>'
      + '<dd class="pista"><i class="c-margen" style="left:0;width:' + meta.wMargenPct + '%"></i></dd>'
      + '<dd>' + Formatomillon(c.margenDespuesCierre) + '</dd>'
      + '</div>';
    notaPasocuatro = '<b>Lo que sobra.</b> Si esta barra aparece, el pago se completa. Si no alcanza, la hoja 2 muestra cuánto falta.';
  }

  return '<section class="hoja" aria-label="Hoja 3 de 3">'
    + '<header class="franja">'
    + '<div class="marca">'
    + '<img src="' + LogoCertificado + '" alt="MiTecho">'
    + '<div><span class="marca__nombre">MiTecho</span><span class="marca__doc">Certificado de capacidad financiera</span></div>'
    + '</div>'
    + '<p class="franja__ref"><b>' + refCode + '</b><br>' + nomCompleto + '</p>'
    + '</header>'
    + '<div class="cuerpo">'
    + '<section class="bloque">'
    + '<h2 class="guia__titulo">Cómo leer este certificado</h2>'
    + '<p class="guia__lead">Las dos partes que más preguntas generan, explicadas con las cifras de este mismo certificado.</p>'
    + '</section>'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>La gráfica del cierre financiero</h2><span class="guia__hoja">Hoja 2</span></div>'
    + '<p class="guia__pregunta">Responde una pregunta: <strong>¿le alcanza al hogar para pagar lo que el banco no presta?</strong> Se lee de arriba hacia abajo.</p>'
    + '<div class="lectura">'
    + '<div class="lectura__cab" aria-hidden="true"><span></span><div class="eje"><span></span><ol>' + meta.ejeTicks + '</ol><span>millones</span></div><span></span></div>'
    + '<div class="lectura__paso"><span class="lectura__num">1</span><dl>' + filasPasouno + '</dl><p class="lectura__nota"><b>Lo que tiene el hogar.</b> Cada barra es una fuente de dinero y empieza donde termina la anterior, como bloques en fila.</p></div>'
    + '<div class="lectura__paso"><span class="lectura__num">2</span><dl>' + filaPasodos + '</dl><p class="lectura__nota"><b>El total.</b> La barra oscura suma todo lo anterior: el dinero propio del hogar.</p></div>'
    + '<div class="lectura__paso"><span class="lectura__num">3</span><dl>' + filasPasotres + '</dl><p class="lectura__nota"><b>Lo que hay que pagar.</b> Se descuentan del total y avanzan hacia la izquierda: primero la cuota inicial, luego los gastos.</p></div>'
    + '<div class="lectura__paso"><span class="lectura__num">4</span><dl>' + filaPasocuatro + '</dl><p class="lectura__nota">' + notaPasocuatro + '</p></div>'
    + '</div>'
    + '<div class="lectura__claves"><p class="signos"><span><b>+</b>suma</span><span><b>−</b>resta</span><span><b>=</b>resultado</span><span>Cada línea vertical marca ' + Math.round(meta.stepVal / 1000000) + ' millones de pesos</span></p></div>'
    + '</section>'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Los medidores</h2><span class="guia__hoja">Hoja 1</span></div>'
    + '<div class="medidor-guia">'
    + '<div class="mg" role="img" aria-label="Ejemplo de medidor: la barra llega a ' + pctEnd + '% y la línea de referencia está en 25%">'
    + '<span>0%</span>'
    + '<div class="mg__pista"><i style="width:' + wPistaEnd + '%"></i><b style="left:41.67%"></b>'
    + '<span class="mg__tag mg__tag--linea" style="left:41.67%"><strong>25%</strong>Límite de referencia</span>'
    + '<span class="mg__tag mg__tag--valor" style="left:' + wPistaEnd + '%"><strong>' + pctEnd + '%</strong>Valor del hogar</span></div>'
    + '<span>60%</span>'
    + '</div>'
    + '<p class="medidor-guia__regla"><b>Regla rápida</b>Si la barra termina antes de la línea, el indicador está dentro de lo recomendado. La pista completa equivale a 60% del ingreso.</p>'
    + '</div>'
    + '<div class="medidores medidores--guia">'
    + '<div class="medidor"><div class="medidor__cab"><span>Endeudamiento actual</span><strong>' + pctEnd + '%</strong></div><div class="medidor__pista"><i style="width:' + wPistaEnd + '%"></i><b style="left:41.67%"></b></div><p class="medidor__ejemplo">De cada <b>$100</b> que gana el hogar, <b>$' + pctEnd + '</b> ya pagan deudas. MiTecho lo considera saludable por debajo de $25.</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Cuota sobre el ingreso</span><strong>' + pctCuota + '%</strong></div><div class="medidor__pista"><i style="width:' + wPistaCuota + '%"></i><b style="left:50%"></b></div><p class="medidor__ejemplo">De cada <b>$100</b>, <b>$' + pctCuota + '</b> irían a la cuota de vivienda. La línea marca 30%, el máximo legal para un crédito VIS.</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Carga total al comprar</span><strong>' + pctCarga + '%</strong></div><div class="medidor__pista"><i style="width:' + wPistaCarga + '%"></i></div><p class="medidor__ejemplo">De cada <b>$100</b>, <b>$' + pctCarga + '</b> se irían en deudas y cuota, y <b>$' + Math.max(0, 100 - pctCarga) + '</b> quedan para el día a día. Sin línea: es informativo.</p></div>'
    + '</div>'
    + '</section>'
    + '<section class="bloque">'
    + '<div class="bloque__cab"><h2>Palabras del certificado</h2></div>'
    + '<dl class="glosario">'
    + '<div><dt>Cuota inicial</dt><dd>Parte del precio que el banco no presta. En VIS es mínimo el 20%.</dd></div>'
    + '<div><dt>Cierre financiero</dt><dd>Reunir crédito, ahorros, cesantías y subsidios para pagar la vivienda.</dd></div>'
    + '<div><dt>Margen</dt><dd>Lo que sobra después de pagar la cuota inicial y los gastos.</dd></div>'
    + '<div><dt>Ingreso libre</dt><dd>Lo que gana el hogar al mes menos las cuotas de sus deudas.</dd></div>'
    + '<div><dt>VIS</dt><dd>Vivienda de interés social: precio con tope y acceso a subsidios.</dd></div>'
    + '<div><dt>SMMLV</dt><dd>Salario mínimo mensual legal vigente: $1.750.905 en 2026.</dd></div>'
    + '<div><dt>Tasa E.A. y M.V.</dt><dd>Interés de un año completo (E.A.) y su equivalente mensual (M.V.).</dd></div>'
    + '<div><dt>Cesantías</dt><dd>Ahorro que el empleador consigna cada año; sirve para comprar vivienda.</dd></div>'
    + '<div><dt>' + (s.caja ? 'Subsidio de la Caja' : 'Subsidio de vivienda') + '</dt><dd>' + (s.caja ? 'Dinero que aporta la Caja de Compensación y que no se devuelve.' : 'Aporte estatal o institucional para adquisición de vivienda VIS.') + '</dd></div>'
    + '<div><dt>UVR</dt><dd>Unidad de Valor Real: actualiza la deuda con la inflación oficial diaria.</dd></div>'
    + '<div><dt>Ley 2434 de 2024</dt><dd>Permite financiar gastos notariales y de registro en el crédito.</dd></div>'
    + '<div><dt>Deducción tributaria</dt><dd>Art. 119 E.T.: resta intereses de vivienda hasta 1.200 UVT al año si pagas renta.</dd></div>'
    + '</dl>'
    + '</section>'
    + '</div>'
    + '<footer class="pie"><span>MiTecho Colombia. Orientación financiera: no es una aprobación de crédito.</span><span class="pie__ref"><span class="mono">' + meta.refCode + '</span><span>Hoja 3 de 3</span></span></footer>'
    + '</section>';
}

