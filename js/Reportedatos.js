// Datos que usa el reporte PDF: cuenta la misma historia que la app (el techo según los ingresos) y aparte dice
// hasta cuánto se cierra hoy con el ahorro. Aquí también están la leyenda, los porcentajes y los próximos pasos.

// La fecha de las tasas cambia cuando llegan las de la Superintendencia, por eso la leyenda se arma al momento
function Leyendareporte() {
  // En corto (30 oct 2026) para que la leyenda quepa en un solo renglón
  const Fechacorta = String(Fechatasasreferencia).replace(/ de ([a-záéíóú]+) de /i, (Coincidencia, Mes) => ' ' + Mes.slice(0, 3) + ' ');
  return 'Simulación educativa con datos declarados y tasas de la Superfinanciera al ' + Fechacorta + '. No es una aprobación ni una oferta de crédito. MiTecho no es una entidad financiera.';
}

// Porcentajes con coma decimal, como el resto de la app
function Porcentajereporte(Valor) {
  return Number(Valor || 0).toLocaleString('es-CO', { maximumFractionDigits: 1 }) + '%';
}

function Cantidadtexto(Numero, Singular, Plural) {
  return Numero + ' ' + (Numero === 1 ? Singular : Plural);
}

// Los valores del techo con los nombres que ya usa el generador, más lo que se cierra hoy
function Vistatecho(Calculo) {
  if (!Calculo || Calculo.Limitante === 'sin_capacidad') return { ...Calculo, Preciohoyreal: 0 };
  const Sinsubsidio = Calculo.Techosobretopevis;
  const Subsidiocaja = Sinsubsidio ? 0 : Calculo.Subsidiocaja, Subsidiomicasaya = Sinsubsidio ? 0 : Calculo.Subsidiomicasaya;
  const Gastos = Calculo.Financiargastos ? 0 : Calculo.Gastostecho;
  const Efectivo = Calculo.Ahorrohogar + Subsidiocaja + Subsidiomicasaya;
  return {
    ...Calculo,
    Preciohoyreal: Calculo.Precio,
    Precio: Calculo.Preciotecho,
    Credito: Calculo.Creditotecho,
    Cuotainicial: Calculo.Cuotainicialtecho,
    Gastos,
    Cuota: Calculo.Cuotatecho,
    Falta: Calculo.Faltatecho,
    Margendespuescierre: Math.max(0, Efectivo - Calculo.Cuotainicialtecho - Gastos),
    Financiacionporcentaje: Number((Calculo.Financiaciontecho * 100).toFixed(1)),
    Subsidiocaja,
    Subsidiomicasaya,
    Subsidiocajasalarios: Subsidiocaja / Salariominimo,
    Subsidiomicasayasalarios: Subsidiomicasaya / Salariominimo,
    Efectivo,
    Estadocierre: Calculo.Faltatecho > 0 ? 'falta_cuota_inicial' : 'cierre_completo'
  };
}

// En UVR la cuota sube con la inflación: el total pagado se estima con la inflación de referencia de la app
function Totaluvr(Cuota, Meses) {
  let Total = 0;
  for (let Mes = 0; Mes < Meses; Mes++) Total += Cuota * Math.pow(1 + Inflacionanual, Mes / 12);
  return Total;
}

// Tres pasos concretos según lo que muestra el reporte, para que la hoja 2 sirva para actuar
function Pasosreporte(Estadoactual, Calculo) {
  const Pasos = [];
  if (Calculo.Falta > 0) {
    const Meses = Estadoactual.Ahorromes > 0 ? Math.ceil(Calculo.Falta / Estadoactual.Ahorromes) : 0;
    Pasos.push('Te faltan <b>' + Formatoenteropesos(Calculo.Falta) + '</b> de cuota inicial y gastos para la vivienda de ' + Formatoenteropesos(Calculo.Precio) + (Meses ? ': ahorrando ' + Formatoenteropesos(Estadoactual.Ahorromes) + ' al mes llegas en ' + Cantidadtexto(Meses, 'mes', 'meses') + '.' : '.') + ' Hoy cierras hasta <b>' + Formatoenteropesos(Calculo.Preciohoyreal) + '</b>.');
  } else {
    Pasos.push('Tu cuota inicial y los gastos están cubiertos: ya puedes pedir el estudio de crédito en la entidad que elijas.');
  }
  if (Calculo.Subsidiocajavencido) Pasos.push('Tu subsidio asignado venció. Pide a tu Caja la prórroga o una nueva asignación antes de firmar la promesa de compraventa.');
  else if (Calculo.Subsidiocajareal) Pasos.push('Revisa la vigencia de tu subsidio' + (Estadoactual.Infoentidad && Estadoactual.Infoentidad.caja && Estadoactual.Infoentidad.caja.Vencesubsidio ? ' (vence en ' + Escaparhtml(Estadoactual.Infoentidad.caja.Vencesubsidio) + ')' : '') + ' y que la vivienda cumpla las condiciones de tu Caja.');
  else if (Estadoactual.Caja && Calculo.Subsidiocaja > 0) Pasos.push('Pregunta en tu Caja por la postulación al subsidio: este reporte lo cuenta como posible, no como asignado.');
  else if (!Estadoactual.Caja && Calculo.Modalidadelegida === 'vis') Pasos.push('Si te afilias a una Caja de compensación podrías postularte a subsidio para vivienda VIS.');
  if (Calculo.Deudasmes > 0) Pasos.push('Cada $100.000 de cuota de deuda que termines de pagar sube tu crédito en ' + Formatoenteropesos(Calculo.Sensibilidadcredito) + '.');
  Pasos.push('Pide a cada entidad la tasa y las condiciones por escrito: la tasa de este reporte es un promedio, no una oferta.');
  return '<ol class="pasos-reporte">' + Pasos.slice(0, 3).map(Paso => '<li>' + Paso + '</li>').join('') + '</ol>';
}

// Las dos letras del logo de la Caja: solo letras, así ningún símbolo escrito por la persona llega al HTML del reporte
function Logocaja(Nombre) {
  return (String(Nombre || 'Compensar').replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, '').slice(0, 2) || 'CA').toUpperCase();
}
