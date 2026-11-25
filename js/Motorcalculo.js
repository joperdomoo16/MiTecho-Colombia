// Motor de capacidad hipotecaria: calcula techo por ingresos, cierre financiero hoy y límites VIS o No VIS

function Calcularcapacidad(Estadoactual, Deudasmanuales, Modalidadmanual) {
  const Modalidadelegida = Modalidadmanual || Estadoactual.Modalidadelegida || 'vis';
  const Configuracion = Modalidadesvivienda[Modalidadelegida] || Modalidadesvivienda.vis;
  const Financiargastos = Boolean(Estadoactual.Financiargastos);
  const N = Estadoactual.Promediomeses === 3 ? 3 : 6;

  const Historial = Historialvariables(Estadoactual);
  const Variablepromedio = Promediovariable(Historial, N, 0, Estadoactual);
  const Variableanterior = Promediovariable(Historial, N, 1, Estadoactual);
  const Salariobase = Estadoactual.Tipo === 'variable' ? 0 : (Estadoactual.Fijo || 0);
  const Sumaextras = (Estadoactual.Ingresosfijosextra || []).reduce((Acumulado, Fijoextra) => Acumulado + Fijoextra.Monto, 0);
  const Fijopromedio = Salariobase + Sumaextras;
  const Automatico = Fijopromedio + Variablepromedio;

  const Tienesolicitantes = Boolean(Estadoactual.Solicitantes && Estadoactual.Solicitantes.length > 0);
  let Ingresotitular = 0;
  let Ingresovariable = 0;
  if (Tienesolicitantes) {
    Ingresotitular = Estadoactual.Solicitantes.reduce((Acumulado, Solicitante) => Acumulado + (Solicitante.Ingresomensual || Solicitante.Ingreso || 0), 0);
  } else {
    Ingresotitular = Ingresosegunfuente(Estadoactual, Automatico);
    if (Estadoactual.Pareja) {
      Ingresovariable = Estadoactual.Parejaingreso ?? 2400000;
    }
  }
  const Ingresototal = Ingresotitular + Ingresovariable;

  const Deudas = Deudasmanuales || Estadoactual.Deudas || [];
  let Deudastitular = 0;
  let Deudaspareja = 0;
  if (Estadoactual.Cuotasdeudasactivas !== undefined) {
    Deudastitular = Estadoactual.Cuotasdeudasactivas;
  } else {
    Deudastitular = Deudas.filter(Deuda => Deuda.Activa !== false).reduce((Acumulado, Deuda) => Acumulado + (Deuda.Cuota || 0), 0);
    if (Estadoactual.Pareja) {
      Deudaspareja = Estadoactual.Parejadeudas ?? 300000;
    }
  }
  const Deudasmes = Deudastitular + Deudaspareja;
  const Ingresolibre = Ingresototal - Deudasmes;
  const Neto = Math.max(0, Ingresolibre);

  const Tope = Estadoactual.Topeconservador ? 0.30 : Configuracion.Tope;
  let Entidadclave = Estadoactual.Entidad || 'promedio';
  if (Entidadclave === 'caja' && !Estadoactual.Caja) Entidadclave = 'promedio';

  const Mercadoentidad = typeof Tasasmercadoactual !== 'undefined' && Tasasmercadoactual ? Tasasmercadoactual[Entidadclave] : null;
  const Entidad = { ...(Tasasreferencia[Entidadclave] || Tasasreferencia.promedio), ...(Mercadoentidad || {}) };
  const Margenuvr = (Modalidadelegida === 'vis' ? Entidad.Uvrvis : Entidad.Uvrnovis) || Entidad.Uvr;

  const Infoentidades = Estadoactual.Infoentidad || {};
  const Egresocategoria = Infoentidades.caja || {};
  const Egresofijo = Infoentidades.fna || {};
  let Preaprobado = {};
  if (Entidadclave === 'caja') Preaprobado = Egresocategoria;
  else if (Entidadclave === 'fna') Preaprobado = Egresofijo;

  const Preaprobadotasa = Preaprobado.Tasa > 0 ? Preaprobado.Tasa / 100 : 0;
  const Preaprobadoplazo = Preaprobado.Plazo > 0 ? Preaprobado.Plazo : 0;
  const Preaprobadofinanciacion = Preaprobado.Financiacion > 0 ? Math.min(1, Preaprobado.Financiacion / 100) : 0;
  const Preaprobadomonto = Preaprobado.Monto > 0 ? Preaprobado.Monto : 0;

  const Usaruvr = Estadoactual.Tasatipo === 'uvr' && Modalidadelegida !== 'leasing' && Entidadclave !== 'caja';
  let Tasaanual = Entidad[Modalidadelegida] || 0.1135;
  if (Usaruvr) Tasaanual = Margenuvr;
  if (Preaprobadotasa) Tasaanual = Preaprobadotasa;
  if (Estadoactual.Tasaanualfija) Tasaanual = Estadoactual.Tasaanualfija;

  let Plazoanios = 20;
  if (Estadoactual.Plazomesesfijo) {
    Plazoanios = Estadoactual.Plazomesesfijo / 12;
  } else if (Preaprobadoplazo) {
    Plazoanios = Preaprobadoplazo;
  } else {
    const Topeentidad = Entidadclave === 'caja' ? 20 : 30;
    Plazoanios = Math.max(5, Math.min(Estadoactual.Plazoelegido || 20, 75 - (Estadoactual.Edad || 0), Topeentidad));
  }

  const Anualidad = Calcularanualidad(Tasaanual, Plazoanios);
  let Opcioncompra = 0;
  if (Modalidadelegida === 'leasing') Opcioncompra = Estadoactual.Opcioncompra ?? 0.10;
  const Valorn = Math.pow(1 + Anualidad.Tasaperiodica, -Anualidad.Numerocuotas);
  const Factor = Anualidad.Factoranualidad / (1 - Opcioncompra * Valorn);

  const Cuotamaxima = Math.max(0, Math.round(Neto * Tope));
  let Creditoporcapacidad = 0;
  if (Preaprobadomonto) Creditoporcapacidad = Preaprobadomonto;
  else if (Cuotamaxima > 0) Creditoporcapacidad = Math.round(Cuotamaxima * Factor);

  const Topevissalarios = Consultartopevis(Estadoactual.Ciudad || 'Bogotá');
  const Topevis = Topevissalarios * Salariominimo;
  const Topevip = 90 * Salariominimo;
  const Salariosminimos = Number((Ingresototal / Salariominimo).toFixed(2));

  const Datossubsidios = Calcularsubsidioshogar(Estadoactual, Ingresototal, Egresocategoria, Egresofijo);
  const Subsidiocajaelegible = Datossubsidios.Subsidiocajaelegible;
  const Subsidiocajareal = Datossubsidios.Subsidiocajareal;
  const Subsidiocajavencido = Datossubsidios.Subsidiocajavencido;
  const Subsidiocajamonto = Datossubsidios.Subsidiocajamonto;
  const Subsidiofnareal = Datossubsidios.Subsidiofnareal;
  const Subsidiomicasayamonto = Datossubsidios.Subsidiomicasayamonto;

  const Ahorroentidad = (Egresocategoria.Cesantias || 0) + (Egresocategoria.Ahorro || 0) + (Egresofijo.Cesantias || 0) + (Egresofijo.Ahorro || 0);
  const Ahorropareja = Estadoactual.Pareja ? (Estadoactual.Parejaahorro || 0) : 0;
  let Ahorrobaseusuario = (Estadoactual.Ahorro || 0) + Ahorroentidad + Ahorropareja;
  if (Estadoactual.Ahorroycesantias !== undefined) Ahorrobaseusuario = Estadoactual.Ahorroycesantias;

  const Financiacionvis = Preaprobadofinanciacion || Configuracion.Financiacion || 0.80;
  const Financiacionnovis = Preaprobadofinanciacion || 0.70;
  const Porcentajegastos = Configuracion.Gastos !== undefined ? Configuracion.Gastos : 0.03;
  const Gastosnovisbase = Modalidadesvivienda.novis.Gastos !== undefined ? Modalidadesvivienda.novis.Gastos : Porcentajegastos;

  const Contextoobjetivo = {
    Modalidadelegida, Topevis, Porcentajegastos, Financiargastos,
    Subsidiocajamonto, Subsidiomicasayamonto, Financiacionvis, Financiacionnovis,
    Ahorrobaseusuario, Creditoporcapacidad, Factor, Tope, Deudasmes, Fijopromedio, Ingresovariable
  };
  const Objetivousuario = Estadoactual.Objetivousuario > 0 ? Estadoactual.Objetivousuario : 0;

  if (Creditoporcapacidad === 0) {
    return {
      Ingresohogar: Ingresototal,
      Ingresohogarsalarios: Salariosminimos,
      Ingresolibre,
      Endeudamientoporcentaje: Ingresototal > 0 ? Number(((Deudasmes / Ingresototal) * 100).toFixed(1)) : 0,
      Cuotamaxima: 0, Creditoporcapacidad: 0, Subsidiocajaelegible, Subsidiocajaaplicado: 0, Recursospropios: Ahorrobaseusuario,
      Modalidad: null, Modalidadelegida: null, Limitante: 'sin_capacidad', Preciomaximo: 0, Precio: 0, Preciohoy: 0,
      Preciocupo: 0, Creditocupo: 0, Subsidiocupo: 0, Cuotainicialcupo: 0, Faltacupo: 0,
      Preciotecho: 0, Creditotecho: 0, Subsidiotecho: 0, Cuotainicialtecho: 0, Gastostecho: 0, Cuotatecho: 0, Financiaciontecho: 0, Faltatecho: 0,
      Techosobretopevis: false, Subsidiocajavencido, Subsidiocajasobretope: false, Ahorropareja, Ahorrohogar: Ahorrobaseusuario,
      Credito: 0, Creditousado: 0, Financiacionporcentaje: 0, Cuotainicial: 0, Gastosescrituracion: 0, Gastos: 0, Cuotamensual: 0, Cuota: 0,
      Margendespuescierre: 0, Faltanteparacupocompleto: 0, Falta: 0, Estadocierre: 'sin_capacidad', Topado: false, Limiteahorro: false, Financiacion: 0,
      Configuracion, Ingresototal, Ingresotitular, Deudasmes, Neto, Tope, Tasaanual, Plazo: Plazoanios, Factor, Capacidadcuota: 0,
      Topevis, Topevissalarios, Topevip, Esvip: false, Salariosminimos, Subsidiocajasalarios: 0, Subsidiomicasayasalarios: 0,
      Subsidiocaja: 0, Subsidiomicasaya: 0, Subsidio: 0, Efectivo: Ahorrobaseusuario, Opcioncompra, Opcioncompravalor: 0,
      ...Armarobjetivovivienda(Contextoobjetivo, Objetivousuario, null),
      Sensibilidad: 0, Sensibilidadcredito: 0, N, Historial, Variablepromedio, Variableanterior, Fijopromedio, Automatico,
      Entidadclave, Ahorroentidad, Preaprobadomonto, Preaprobadotasa, Subsidiocajamonto, Subsidiomicasayamonto
    };
  }

  const Recursosvis = Ahorrobaseusuario + Subsidiocajamonto + Subsidiomicasayamonto;
  const Preciocapacidadvis = (Creditoporcapacidad + Recursosvis) / (1 + Porcentajegastos);
  const Preciogastosvis = !Financiargastos && Porcentajegastos > 0 ? Ahorrobaseusuario / Porcentajegastos : Infinity;
  const Divisorvis = Financiargastos ? (1 - Financiacionvis) : (1 - Financiacionvis + Porcentajegastos);
  const Preciorecursosvis = Math.min(Recursosvis / Divisorvis, Preciogastosvis);
  const Preciovisteorico = Math.min(Preciocapacidadvis, Preciorecursosvis);

  // Techo máximo respaldado por ingresos; si se financia la escrituración, esa suma entra en el cupo
  const Gastosvis = Financiargastos ? Porcentajegastos : 0;
  const Gastosnovis = Financiargastos ? Gastosnovisbase : 0;
  const Cupovis = Creditoporcapacidad / (Financiacionvis + Gastosvis);
  const Esnovisexplicito = Modalidadmanual === 'novis' || (Modalidadelegida === 'novis' && !Modalidadmanual);
  const Noviscupo = Esnovisexplicito || Cupovis > Topevis;
  const Preciocupo = Math.round(Noviscupo ? Creditoporcapacidad / (Financiacionnovis + Gastosnovis) : Cupovis);
  const Gastoscupototal = Math.round(Preciocupo * (Noviscupo ? Gastosnovisbase : Porcentajegastos));
  const Creditocupo = Math.min(Creditoporcapacidad - (Financiargastos ? Gastoscupototal : 0), Preciocupo);
  const Cuotainicialcupo = Math.max(0, Preciocupo - Creditocupo);
  const Subsidiocupo = Noviscupo ? 0 : Math.min(Cuotainicialcupo, Subsidiocajamonto + Subsidiomicasayamonto);
  const Gastoscupo = Financiargastos ? 0 : Gastoscupototal;
  const Faltacupo = Math.max(0, Cuotainicialcupo + Gastoscupo - Ahorrobaseusuario - Subsidiocupo);

  let Modalidad = 'VIS';
  let Modalidadfinal = 'vis';
  let Subsidiocajaaplicado = Subsidiocajamonto;
  let Subsidiomicasayaaplicado = Subsidiomicasayamonto;
  let Recursospropios = Recursosvis;
  let Financiacionmaxima = Financiacionvis;
  let Preciomax = 0;
  let Limitante = '';
  let Estado = '';

  const Divisornovis = Financiargastos ? (1 - Financiacionnovis) : (1 - Financiacionnovis + Porcentajegastos);
  const Preciocapacidadnovis = (Creditoporcapacidad + Ahorrobaseusuario) / (1 + Porcentajegastos);
  const Preciorecursosnovis = Ahorrobaseusuario / Divisornovis;
  const Precionovisteorico = Math.min(Preciocapacidadnovis, Preciorecursosnovis);

  if (Esnovisexplicito || (Preciovisteorico > Topevis && Precionovisteorico > Topevis)) {
    Modalidad = 'NO_VIS';
    Modalidadfinal = 'novis';
    Subsidiocajaaplicado = 0;
    Subsidiomicasayaaplicado = 0;
    Recursospropios = Ahorrobaseusuario;
    Financiacionmaxima = Financiacionnovis;
    Preciomax = Math.round(Precionovisteorico);
    if (Preciorecursosnovis < Preciocapacidadnovis) {
      Limitante = 'recursos_propios';
      Estado = 'falta_cuota_inicial';
    } else {
      Limitante = 'capacidad_pago';
      Estado = 'cierre_completo';
    }
  } else if (Preciovisteorico > Topevis) {
    Preciomax = Topevis;
    Limitante = 'tope_vis';
    Estado = 'limitado_tope_vis';
  } else {
    Preciomax = Math.round(Preciovisteorico);
    if (Preciorecursosvis < Preciocapacidadvis) {
      Limitante = 'recursos_propios';
      Estado = 'falta_cuota_inicial';
    } else {
      Limitante = 'capacidad_pago';
      Estado = 'cierre_completo';
    }
  }

  const Gastos = Math.round(Preciomax * Porcentajegastos);
  let Credito = 0;
  let Cuotainicial = 0;
  let Margendespuescierre = 0;
  let Falta = 0;

  if (Financiargastos) {
    const Creditovivienda = Math.max(0, Math.min(Creditoporcapacidad - Gastos, Math.round(Financiacionmaxima * Preciomax)));
    Credito = Math.min(Creditoporcapacidad, Creditovivienda + Gastos);
    Cuotainicial = Preciomax - Creditovivienda;
    Margendespuescierre = Recursospropios - Cuotainicial - (Creditovivienda + Gastos - Credito);
    if (Limitante === 'recursos_propios') Falta = Faltacupo;
  } else {
    Credito = Math.min(
      Creditoporcapacidad,
      Math.round(Financiacionmaxima * Preciomax),
      Math.max(0, Math.round(Preciomax * (1 + Porcentajegastos) - Recursospropios))
    );
    Cuotainicial = Preciomax - Credito;
    Margendespuescierre = Recursospropios - Cuotainicial - Gastos;
    if (Limitante === 'recursos_propios') Falta = Faltacupo;
  }

  const Cuota = Math.round(Credito * (1 - Opcioncompra * Valorn) / Anualidad.Factoranualidad);
  const Endeudamientoporcentaje = Ingresototal > 0 ? Number(((Deudasmes / Ingresototal) * 100).toFixed(1)) : 0;
  const Financiacionporcentaje = Preciomax > 0 ? Number(((Credito / Preciomax) * 100).toFixed(1)) : 0;

  // Todas las vistas toman el techo de aquí para que Inicio, Simular, Plan, Viviendas y el PDF coincidan
  const Contecho = Limitante === 'recursos_propios';
  const Preciotecho = Contecho ? Preciocupo : Preciomax;
  let Creditotecho = Credito;
  if (Contecho) Creditotecho = Creditocupo + (Financiargastos ? Gastoscupototal : 0);
  const Cuotatecho = Math.round(Creditotecho * (1 - Opcioncompra * Valorn) / Anualidad.Factoranualidad);
  const Techosobretopevis = Modalidadelegida !== 'novis' && (Contecho ? Noviscupo : Modalidadfinal === 'novis');

  let Gastostechopropios = Math.max(0, Gastos - (Financiargastos ? Credito - (Preciomax - Cuotainicial) : 0));
  if (Contecho) Gastostechopropios = Financiargastos ? 0 : Gastoscupototal;

  const Techo = {
    Novis: Modalidadfinal === 'novis' || Techosobretopevis,
    Credito: Creditotecho,
    Cuotainicial: Contecho ? Cuotainicialcupo : Cuotainicial,
    Subsidio: Contecho ? Subsidiocupo : Math.min(Subsidiocajaaplicado + Subsidiomicasayaaplicado, Cuotainicial),
    Gastos: Gastostechopropios,
    Falta: Contecho ? Faltacupo : 0
  };

  return {
    Ingresohogar: Ingresototal,
    Ingresohogarsalarios: Salariosminimos,
    Ingresolibre,
    Endeudamientoporcentaje,
    Cuotamaxima,
    Creditoporcapacidad,
    Subsidiocajaelegible,
    Subsidiocajaaplicado,
    Recursospropios,
    Modalidad,
    Modalidadelegida: Modalidadfinal,
    Limitante,
    Preciomaximo: Preciomax,
    Precio: Preciomax,
    Preciohoy: Preciomax,
    Preciocupo,
    Creditocupo,
    Subsidiocupo,
    Cuotainicialcupo,
    Gastoscupo,
    Faltacupo,
    Preciotecho,
    Creditotecho,
    Subsidiotecho: Techo.Subsidio,
    Cuotainicialtecho: Techo.Cuotainicial,
    Gastostecho: Contecho ? Gastoscupototal : Gastos,
    Cuotatecho,
    Financiaciontecho: Preciotecho > 0 ? Creditotecho / Preciotecho : 0,
    Faltatecho: Contecho ? Faltacupo : 0,
    Techosobretopevis,
    Subsidiocajavencido,
    Subsidiocajasobretope: Subsidiocajareal && !Subsidiocajaelegible,
    Ahorropareja,
    Ahorrohogar: Ahorrobaseusuario,
    Credito,
    Creditousado: Credito,
    Financiacionporcentaje,
    Cuotainicial,
    Gastosescrituracion: Gastos,
    Gastos,
    Cuotamensual: Cuota,
    Cuota,
    Margendespuescierre,
    Faltanteparacupocompleto: Falta,
    Falta,
    Estadocierre: Estado,
    Financiacion: Financiacionmaxima,
    Topado: Limitante === 'tope_vis',
    Limiteahorro: Limitante === 'recursos_propios',
    Topevis,
    Topevissalarios,
    Topevip,
    Esvip: Modalidadfinal === 'vis' && Preciotecho > 0 && Preciotecho <= Topevip,
    Salariosminimos,
    Subsidiocajasalarios: Subsidiocajaaplicado / Salariominimo,
    Subsidiomicasayasalarios: Subsidiomicasayaaplicado / Salariominimo,
    Subsidiocaja: Subsidiocajaaplicado,
    Subsidiomicasaya: Subsidiomicasayaaplicado,
    Subsidiocajareal,
    Subsidiofnareal,
    Subsidio: Subsidiocajaaplicado + Subsidiomicasayaaplicado,
    Efectivo: Recursospropios,
    Configuracion,
    Ingresototal,
    Ingresotitular,
    Deudasmes,
    Neto,
    Tope,
    Tasaanual,
    Plazo: Plazoanios,
    Factor,
    Anualidad,
    Tasamensual: Anualidad.Tasaperiodica,
    Capacidadcuota: Cuotamaxima,
    Opcioncompra,
    Opcioncompravalor: Opcioncompra * Credito,
    ...Armarobjetivovivienda(Contextoobjetivo, Objetivousuario || Preciotecho, Objetivousuario ? null : Techo),
    Sensibilidad: 100000 * Tope * Factor / Financiacionmaxima,
    Sensibilidadcredito: 100000 * Tope * Factor,
    Financiargastos,
    Gastosfinanciados: Financiargastos ? Gastos : 0,
    Proyeccionuvr: Calcularproyeccionuvr(Creditoporcapacidad || Credito, Estadoactual.Plazomesesfijo || (Plazoanios * 12), Estadoactual.Tasatipo === 'uvr' ? Tasaanual : 0.075),
    N,
    Historial,
    Variablepromedio,
    Variableanterior,
    Fijopromedio,
    Automatico,
    Entidadclave,
    Ahorroentidad,
    Subsidiocajamonto,
    Subsidiomicasayamonto,
    Preaprobadomonto,
    Preaprobadotasa
  };
}
