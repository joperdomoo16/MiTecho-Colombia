// Ensamblaje de las tres hojas del reporte de simulación en tamaño carta

// Si cambia este script debe actualizarse también su huella sha256 en la CSP de index.html
const Scriptajustecertificado = '(function(){function ajustar(){var z=Math.min(1,(window.innerWidth-24)/816);document.documentElement.style.setProperty("--z",z.toFixed(3));}ajustar();window.addEventListener("resize",ajustar);window.addEventListener("beforeprint",function(){document.documentElement.style.setProperty("--z","1")});window.addEventListener("afterprint",ajustar);})();';

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

function Construircertificadohtml(Estadoactual, Calculobase) {
  const Calculo = Vistatecho(Calculobase);
  const Esuvr = Estadoactual.Tasatipo === 'uvr' && Estadoactual.Modalidadelegida !== 'leasing' && Calculo.Entidadclave !== 'caja';
  const Esleasing = Estadoactual.Modalidadelegida === 'leasing';
  const Plazolimitado = Calculo.Plazo < (Estadoactual.Plazoelegido || 20) && !Calculo.Preaprobadotasa;
  const Ahora = new Date();
  const Fechatexto = Ahora.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const Codigoreferencia = 'MT-' + Ahora.getFullYear() + '-' + Generarcodigoaleatorio(5);

  const Espareja = Boolean(
    Estadoactual.Pareja &&
    ((Estadoactual.Parejaingreso || 0) > 0 || (Estadoactual.Parejadeudas || 0) > 0 || (Estadoactual.Parejaahorro || 0) > 0)
  );
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

  let Perfiltitular = 'Ingresos mixtos: salario fijo más comisiones';
  if (Estadoactual.Tipo === 'fijo') Perfiltitular = 'Empleado · Ingresos fijos mensuales';
  else if (Estadoactual.Tipo === 'variable') Perfiltitular = 'Independiente · Ventas y comisiones variables';
  const Perfilpareja = Escapar(Estadoactual.Parejaactividad || 'Actividad no registrada');

  const Deudaslista = Estadoactual.Deudas || [];
  const Deudasactivastitular = Deudaslista.filter(Deuda => Deuda.Activa !== false);
  const Deudastitular = Deudasactivastitular.reduce((Acumulado, Deuda) => Acumulado + (Deuda.Cuota || 0), 0);
  const Saldotitular = Deudasactivastitular.reduce((Acumulado, Deuda) => Acumulado + (Deuda.Saldo || 0), 0);
  const Tienesaldotitular = Deudasactivastitular.some(Deuda => (Deuda.Saldo || 0) > 0);
  const Deudaspareja = Espareja ? (Estadoactual.Parejadeudas || 0) : 0;
  const Totaldeudasactivas = Deudasactivastitular.length + (Espareja && Deudaspareja > 0 ? 1 : 0);

  const Infoentidades = Estadoactual.Infoentidad || {};
  const Egresocategoria = Infoentidades.caja || {};
  const Egresofijo = Infoentidades.fna || {};
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
    const Notafinalescritura = Calculo.Financiargastos ? ' (incluye escrituración Ley 2434).' : '.';
    const Notamargen = Calculo.Margendespuescierre > 0
      ? (' y le queda un margen de <strong>' + Formatoenteropesos(Calculo.Margendespuescierre) + '</strong>.')
      : '.';
    Fichaestadocierre = '<span class="estado-cierre"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="#0B0C0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Cuota inicial cubierta</span>';
    Resumencierretexto = 'El banco financia <strong>' + Formatoenteropesos(Calculo.Credito) + '</strong>, el ' + Porcentajereporte(Porcentajecredito) + ' del precio' + Notafinalescritura + ' El hogar cubre la cuota inicial con sus propios recursos' + Notamargen;
  } else if (Calculo.Estadocierre === 'falta_cuota_inicial') {
    const Detallefalta = Calculo.Financiargastos || Esleasing ? 'de cuota inicial' : 'de cuota inicial y gastos';
    Fichaestadocierre = '<span class="estado-cierre" style="background:var(--mitecho-dorado)"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.8" fill="none" stroke="#0B0C0A" stroke-width="1.6"/><path d="M6 3.2v3.2M6 8.2v.4" stroke="#0B0C0A" stroke-width="1.6" stroke-linecap="round"/></svg>Falta cuota inicial</span>';
    Resumencierretexto = 'Para la vivienda de <strong>' + Formatoenteropesos(Calculo.Precio) + '</strong> el banco prestaría <strong>' + Formatoenteropesos(Calculo.Credito) + '</strong>. Con los recursos propios de hoy faltan <strong>' + Formatoenteropesos(Calculo.Falta) + '</strong> ' + Detallefalta + '; mientras tanto, el hogar puede cerrar una compra de hasta <strong>' + Formatoenteropesos(Calculo.Preciohoyreal) + '</strong>.';
  } else {
    Fichaestadocierre = '<span class="estado-cierre" style="background:var(--mitecho-naranja);color:#FFF"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.8" fill="none" stroke="#FFF" stroke-width="1.6"/><path d="M4 4l4 4M8 4l-4 4" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"/></svg>Sin capacidad</span>';
    Resumencierretexto = 'El nivel de obligaciones financieras activas supera los ingresos reportados, por lo que no se cuenta con margen de cuota hipotecaria en este momento.';
  }
  if (Calculo.Techosobretopevis) {
    Resumencierretexto += ' Este techo pasa el tope VIS (' + Calculo.Topevissalarios + ' SMMLV = ' + Formatoenteropesos(Calculo.Topevis) + '): a ese precio la vivienda es No VIS, el banco financia hasta el ' + Math.round(Modalidadesvivienda.novis.Financiacion * 100) + '% y no aplica subsidio.';
  }

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

  const Metricas = {
    Espareja, Escapar, Codigoreferencia, Nombrecompleto, Nombretitular, Nombrepareja,
    Nombretitularcorto, Nombreparejacorto, Cajanombreescapado, Sisbengrupoescapado, Ciudadescapada,
    Aportetitular, Aportepareja, Perfiltitular, Perfilpareja,
    Deudaslista, Deudasactivastitular, Deudastitular, Saldotitular, Tienesaldotitular, Deudaspareja,
    Ahorrotitular, Ahorropareja, Escalamaxima, Ejemarcas, Pasovalor, Porcentajecuotainicial, Porcentajegastos,
    Anchoahorrotitularporcentaje: (Ahorrotitular / Escalamaxima * 100).toFixed(3),
    Anchoahorroparejaporcentaje: (Ahorropareja / Escalamaxima * 100).toFixed(3),
    Izquierdaahorroparejaporcentaje: (Ahorrotitular / Escalamaxima * 100).toFixed(3),
    Izquierdasubsidioporcentaje: ((Ahorrotitular + Ahorropareja) / Escalamaxima * 100).toFixed(3),
    Anchosubsidioporcentaje: (((Calculo.Subsidiocaja || 0)) / Escalamaxima * 100).toFixed(3),
    Izquierdamicasayaporcentaje: ((Ahorrotitular + Ahorropareja + (Calculo.Subsidiocaja || 0)) / Escalamaxima * 100).toFixed(3),
    Anchomicasayaporcentaje: (((Calculo.Subsidiomicasaya || 0)) / Escalamaxima * 100).toFixed(3),
    Anchorecursostotalporcentaje: (Calculo.Efectivo / Escalamaxima * 100).toFixed(3),
    Izquierdacuotainicialporcentaje: (Math.max(0, Calculo.Efectivo - Calculo.Cuotainicial) / Escalamaxima * 100).toFixed(3),
    Anchocuotainicialporcentaje: (Calculo.Cuotainicial / Escalamaxima * 100).toFixed(3),
    Izquierdagastosporcentaje: (Math.max(0, Calculo.Efectivo - Calculo.Cuotainicial - Calculo.Gastos) / Escalamaxima * 100).toFixed(3),
    Anchogastosporcentaje: (Calculo.Gastos / Escalamaxima * 100).toFixed(3),
    Anchomargenporcentaje: (Math.max(0, Calculo.Margendespuescierre) / Escalamaxima * 100).toFixed(3)
  };

  const Tasaanualtextocampo = (Calculo.Tasaanual * 100).toFixed(2).replace('.', ',') + (Esuvr ? '% + UVR' : '% E.A.');
  let Tasamensualvalor = Math.pow(1 + Calculo.Tasaanual, 1 / 12) - 1;
  if (Calculo.Tasamensual) Tasamensualvalor = Calculo.Tasamensual;
  else if (Calculo.Anualidad) Tasamensualvalor = Calculo.Anualidad.Tasaperiodica;
  const Tasamensualtexto = (Tasamensualvalor * 100).toFixed(2).replace('.', ',') + '% mes vencido';

  const Cascadahtml = Armarcascadapdf(Estadoactual, Calculo, Metricas);
  const Cajatarjetahtml = Armartarjetacajapdf(Estadoactual, Calculo, Cajanombreescapado, Tasaanualtextocampo, Tasamensualtexto);
  const Deudascuerpotabla = Armartabladeudaspdf(Metricas);
  const Solicitanteshtml = Armarsolicitantespdf(Estadoactual, Calculo, Metricas);

  let Ecuacionhtml = '';
  if (Espareja) {
    Ecuacionhtml = '<div class="ecuacion"><div><small>Ingreso ' + Nombretitularcorto + '</small><strong>' + Formatoenteropesos(Calculo.Ingresotitular) + '</strong></div><span>+</span><div><small>Ingreso ' + Nombreparejacorto + '</small><strong>' + Formatoenteropesos(Calculo.Ingresototal - Calculo.Ingresotitular) + '</strong></div><span>−</span><div><small>Deudas del hogar</small><strong>' + Formatoenteropesos(Calculo.Deudasmes) + '</strong></div><span>=</span><div><small>Ingreso disponible</small><strong>' + Formatoenteropesos(Calculo.Neto) + '</strong></div><span>×</span><div><small>Cuota máx.</small><strong>' + Math.round(Calculo.Tope * 100) + '%</strong></div><div class="resultado"><small>Cuota máxima</small><strong>' + Formatoenteropesos(Calculo.Cuotamaxima) + '</strong></div></div>';
  } else {
    Ecuacionhtml = '<div class="ecuacion ecuacion--individual"><div><small>Ingreso mensual</small><strong>' + Formatoenteropesos(Calculo.Ingresototal) + '</strong></div><span>−</span><div><small>Deudas del solicitante</small><strong>' + Formatoenteropesos(Calculo.Deudasmes) + '</strong></div><span>=</span><div><small>Ingreso disponible</small><strong>' + Formatoenteropesos(Calculo.Neto) + '</strong></div><span>×</span><div><small>Cuota máx.</small><strong>' + Math.round(Calculo.Tope * 100) + '%</strong></div><div class="resultado"><small>Cuota máxima</small><strong>' + Formatoenteropesos(Calculo.Cuotamaxima) + '</strong></div></div>';
  }

  let Modalidadcajetin = Calculo.Configuracion.Etiqueta;
  if (Calculo.Techosobretopevis) Modalidadcajetin = 'No VIS (pasa tope VIS)';
  else if (Esuvr) Modalidadcajetin = Calculo.Configuracion.Etiqueta + ' en UVR';

  let Rotulocuota = 'Cuota mensual estimada';
  if (Esleasing) Rotulocuota = 'Canon mensual estimado';
  else if (Esuvr) Rotulocuota = 'Primera cuota en UVR';

  let Subtitulotasa = ' cuotas fijas en pesos';
  if (Esuvr) Subtitulotasa = ' cuotas en UVR';
  else if (Esleasing) Subtitulotasa = ' cánones';
  else if (Plazolimitado) Subtitulotasa = ' cuotas fijas';

  const Basepagado = Esuvr ? Totaluvr(Calculo.Cuota, Calculo.Plazo * 12) : Calculo.Cuota * Calculo.Plazo * 12;
  const Totalpagadobanco = Basepagado + (Esleasing ? Calculo.Opcioncompra * Calculo.Credito : 0);
  let Subtitulototal = 'En ' + Calculo.Plazo + ' años, sin seguros';
  if (Esuvr) Subtitulototal = 'Con inflación de ' + Porcentajereporte(Inflacionanual * 100) + ' al año, sin seguros';
  else if (Esleasing) Subtitulototal = 'Incluye la opción de compra';

  const Topemedidorfinanciacion = Math.round((Calculo.Techosobretopevis ? Modalidadesvivienda.novis.Financiacion : Calculo.Configuracion.Financiacion) * 100);
  const Esnovis = Calculo.Modalidadelegida === 'novis' || Calculo.Techosobretopevis;
  let Descripcionrecursos = 'Cuota inicial requerida cubierta con ahorros y subsidios.';
  if (Esleasing) Descripcionrecursos = 'Pago inicial requerido cubierto con ahorros y cesantías.';
  else if (Esnovis) Descripcionrecursos = 'Cuota inicial requerida cubierta con ahorros y cesantías.';

  let Saldototaltexto = '—';
  if (Tienesaldotitular) Saldototaltexto = Formatoenteropesos(Saldotitular) + (Espareja && Deudaspareja > 0 ? '*' : '');
  else if (Totaldeudasactivas > 0) Saldototaltexto = 'No registra';

  const Bloquepasoshojados = !Espareja && Deudaslista.length <= 3 && !Calculo.Subsidiocajavencido
    ? '<section class="bloque"><div class="bloque__cab"><h2>Próximos pasos</h2><p>Según las cifras de este reporte</p></div>' + Pasosreporte(Estadoactual, Calculo) + '</section>'
    : '';

  return '<!doctype html>'
    + '<html lang="es-CO"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<title>Reporte de simulación de capacidad de compra · MiTecho</title>'
    + '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    + '<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@600;700&family=Hanken+Grotesk:wght@400;600&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">'
    + '<style>' + Estiloscertificado + '\n*{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}\n.persona__rol{white-space:nowrap}\n.pasos-reporte{margin:0;padding-left:18px;list-style:decimal;font-size:11px;line-height:1.4;color:var(--tinta-2)}\n.pasos-reporte li+li{margin-top:2px}\n.pasos-reporte b{color:var(--tinta);font-weight:600}\n.solicitantes--individual{grid-template-columns:1fr}\n.ecuacion--individual{grid-template-columns:1.2fr auto 1.2fr auto 1.2fr auto .8fr auto 1.3fr}\n</style>'
    + '</head><body><main class="doc">'
    + '<section class="hoja" aria-label="Hoja 1 de 3">'
    + '<p class="aviso-simulacion">' + Leyendareporte() + '</p>'
    + '<header class="plano"><div class="plano__top"><div class="marca"><img src="' + Logocertificado + '" alt="MiTecho"><div><span class="marca__nombre">MiTecho</span><span class="marca__doc">REPORTE DE SIMULACIÓN DE CAPACIDAD DE COMPRA</span></div></div>'
    + '<dl class="cajetin"><div><dt>Fecha</dt><dd>' + Fechatexto + '</dd></div><div><dt>Tasas al</dt><dd>' + Fechatasasreferencia + '</dd></div><div><dt>Consulta</dt><dd>' + Codigoreferencia + '</dd></div><div><dt>Modalidad</dt><dd>' + Modalidadcajetin + '</dd></div><div><dt>Plazo</dt><dd>' + Calculo.Plazo + ' años (' + (Calculo.Plazo * 12) + ' m)</dd></div><div><dt>' + (Esuvr ? 'Tasa' : 'Tasa E.A.') + '</dt><dd>' + Tasaanualtextocampo + '</dd></div></dl></div>'
    + '<p class="plano__frase">' + Fraseportada + '</p>'
    + '<div class="plano__cifra"><span class="moneda">$</span>' + Formatomillones(Calculo.Precio) + '<span class="unidad">M</span></div>'
    + '<figure class="cota"><svg viewBox="0 0 720 72" aria-hidden="true"><g stroke="#A3A898" stroke-width="1" fill="none"><path d="M0.5 6V66M' + Anchocredito + '.5 30V66M719.5 6V66" stroke-opacity=".45"/><path d="M0 18H720M0 42H720"/></g><g stroke="#F2F4EC" stroke-width="1.6"><path d="M-5 23L5 13M715 23L725 13M-5 47L5 37M' + (Anchocredito - 4) + ' 47L' + (Anchocredito + 6) + ' 37M715 47L725 37"/></g>'
    + '<text class="cota__txt" x="360" y="12" text-anchor="middle">precio máximo ' + Formatoenteropesos(Calculo.Precio) + ' COP</text>'
    + '<text class="cota__pct" x="' + Math.round(Anchocredito / 2) + '" y="36" text-anchor="middle">' + Porcentajereporte(Porcentajecredito) + '</text>'
    + '<text class="cota__pct" x="' + Math.round(Anchocredito + Anchocuotainicial / 2) + '" y="36" text-anchor="middle">' + Porcentajereporte(Porcentajecuotainicial) + '</text>'
    + '<rect x="0" y="52" width="' + Math.max(2, Anchocredito - 2) + '" height="20" rx="3" fill="#F2F4EC"/><rect x="' + (Anchocredito + 3) + '" y="52" width="' + Math.max(2, Anchocuotainicial - 3) + '" height="20" rx="3" fill="#D4FF3A"/></svg>'
    + '<figcaption class="cota__leyenda" style="grid-template-columns:' + Porcentajecredito + 'fr ' + Porcentajecuotainicial + 'fr"><p><strong>' + Formatoenteropesos(Calculo.Credito) + '</strong>' + (Esleasing ? 'Financiación del leasing' : 'Crédito hipotecario del banco') + '</p><p><strong>' + Formatoenteropesos(Calculo.Cuotainicial) + '</strong>' + (Esleasing ? 'Pago inicial requerido' : 'Cuota inicial requerida') + '</p></figcaption></figure>'
    + '<ul class="plano__datos"><li><span>' + Rotulocuota + '</span><strong>' + Formatoenteropesos(Calculo.Cuota) + '</strong><small>' + Math.round((Calculo.Cuota / Math.max(1, Calculo.Ingresototal)) * 100) + (Esuvr ? '% del ingreso; sube con la inflación' : '% del ingreso del hogar') + '</small></li>'
    + '<li><span>Tasa de interés</span><strong>' + Tasaanualtextocampo + '</strong><small>' + Calculo.Plazo + ' años' + (Plazolimitado ? ' (por la edad)' : '') + ', ' + (Calculo.Plazo * 12) + Subtitulotasa + '</small></li>'
    + '<li><span>Total pagado al banco</span><strong>' + Formatoenteropesos(Totalpagadobanco) + '</strong><small>' + Subtitulototal + '</small></li></ul></header>'
    + '<div class="cuerpo"><section class="bloque"><div class="bloque__cab"><h2>Quiénes solicitan</h2><p>' + (Espareja ? 'Ingresos y deudas de cada persona antes de sumarlos como hogar' : 'Información financiera evaluada para el solicitante titular') + '</p></div>' + Solicitanteshtml + '</section>'
    + '<section class="bloque"><div class="bloque__cab"><h2>Cómo se calcula la cuota máxima</h2><p>La hoja 3 explica cómo leer los medidores</p></div>' + Ecuacionhtml + '<p class="nota-calculo">La cuota máxima para este hogar, con el ' + Math.round(Calculo.Tope * 100) + '% de su ingreso libre, es de ' + Formatoenteropesos(Calculo.Cuotamaxima) + ' mensuales.</p></section>'
    + '<section class="bloque"><div class="bloque__cab"><h2>Medidores clave de capacidad</h2><p>Indicadores frente a los límites del sistema financiero</p></div><div class="medidores">'
    + '<div class="medidor"><div class="medidor__cab"><span>Endeudamiento</span><strong>' + Porcentajereporte(Calculo.Endeudamientoporcentaje) + '</strong></div><div class="medidor__pista"><i style="width:' + Math.min(100, (Calculo.Endeudamientoporcentaje / 30) * 100) + '%"></i><b style="left:100%"></b></div><p>Compromisos actuales sobre el ingreso. Muchos bancos prefieren que no pasen del 30%.</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Financiación bancaria</span><strong>' + Porcentajereporte(Porcentajecredito) + '</strong></div><div class="medidor__pista"><i style="width:' + Porcentajecredito + '%"></i><b style="left:' + Topemedidorfinanciacion + '%"></b></div><p>Parte del precio cubierta con ' + (Esleasing ? 'el leasing' : 'crédito hipotecario') + ' (máx. ' + Topemedidorfinanciacion + '%).</p></div>'
    + '<div class="medidor"><div class="medidor__cab"><span>Recursos propios</span><strong>' + Porcentajereporte((Calculo.Cuotainicial / Math.max(1, Calculo.Precio)) * 100) + '</strong></div><div class="medidor__pista"><i style="width:' + Math.min(100, ((Calculo.Cuotainicial / Math.max(1, Calculo.Precio)) * 100)) + '%"></i></div><p>' + Descripcionrecursos + '</p></div>'
    + '</div></section></div>'
    + '<footer class="pie"><span>MiTecho Colombia · Reporte de simulación, no es una aprobación de crédito</span><span class="pie__ref"><span class="mono">' + Codigoreferencia + '</span><span>Hoja 1 de 3</span></span></footer></section>'
    + '<section class="hoja" aria-label="Hoja 2 de 3">'
    + '<p class="aviso-simulacion">' + Leyendareporte() + '</p>'
    + '<div class="franja"><div class="marca"><img src="' + Logocertificado + '" alt="MiTecho"><div><span class="marca__nombre">MiTecho</span><span class="marca__doc">Reporte de simulación de capacidad de compra</span></div></div><p class="franja__ref"><b>' + Codigoreferencia + '</b><br>' + Nombrecompleto + '</p></div>'
    + '<div class="cuerpo"><section class="bloque"><div class="bloque__cab"><h2>Cierre financiero</h2>' + Fichaestadocierre + '</div><p class="resumen-cierre">' + Resumencierretexto + '</p><dl class="cascada">' + Cascadahtml + '</dl></section>'
    + '<section class="bloque"><div class="caja">' + Cajatarjetahtml + '</div></section>'
    + '<section class="bloque"><div class="bloque__cab"><h2>Deudas reportadas por cada solicitante</h2><p>Las activas se restan del ingreso antes de calcular la cuota</p></div>'
    + '<table class="deudas"><thead><tr><th scope="col">Obligación</th><th scope="col" class="num">Cuota mensual</th><th scope="col" class="num">Saldo pendiente</th><th scope="col">En el cálculo</th></tr></thead>' + Deudascuerpotabla
    + '<tfoot><tr><th scope="row">Total del hogar</th><td class="num">' + Formatoenteropesos(Calculo.Deudasmes) + '</td><td class="num">' + Saldototaltexto + '</td><td>' + Cantidadtexto(Totaldeudasactivas, 'deuda activa', 'deudas activas') + '</td></tr></tfoot></table>'
    + (Espareja && Deudaspareja > 0 && Tienesaldotitular ? '<p class="nota-calculo">* El saldo total no incluye las deudas de ' + Nombreparejacorto + ', porque solo se declaró su cuota mensual.</p>' : '')
    + '</section>' + Bloquepasoshojados
    + '<section class="bloque legal"><div><h2>Nota legal y condiciones de uso</h2><p>Este reporte es una simulación educativa que genera MiTecho Colombia con la información que declaran los solicitantes, sin verificarla. MiTecho no es una entidad financiera y este documento no sirve como soporte ante un banco. Usa las fórmulas de capacidad de pago de la Ley 546 de 1999, los decretos reglamentarios vigentes en ' + Aniovigente + ' y las tasas promedio de referencia de la Superintendencia Financiera de Colombia. No es una aprobación de crédito ni una carta de compromiso. La aprobación final depende del estudio de títulos, de la capacidad de pago y del análisis de riesgo en centrales de información (Datacrédito, TransUnion) que haga el banco o la entidad que otorgue el crédito. La cuota estimada no incluye los seguros de vida e incendio que exige el banco. El subsidio depende de la vigencia de su asignación por parte de la Caja de Compensación.</p></div>'
    + '<div class="verifica"><span>Número de consulta<br><span class="mono">' + Codigoreferencia + '</span><br>Úsalo si nos escribes a soporte</span></div></section></div>'
    + '<footer class="pie"><span>MiTecho Colombia · Reporte de simulación, no es una aprobación de crédito</span><span class="pie__ref"><span class="mono">' + Codigoreferencia + '</span><span>Hoja 2 de 3</span></span></footer></section>'
    + Construirhojatreshtml(Estadoactual, Calculo, Metricas)
    + '</main><script>' + Scriptajustecertificado + '</script></body></html>';
}
