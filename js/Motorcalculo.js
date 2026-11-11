// Fórmulas para calcular cupo máximo de crédito, subsidios de vivienda y metas de ahorro

// Ingreso del titular según lo que la persona eligió en el simulador:
// perfil = lo que declaró en su perfil financiero, promedio = fijo más promedio de variables, manual = la barra del simulador
function Ingresosegunfuente(Estadoactual, Automatico) {
  const Fuente = Estadoactual.Fuenteingreso;
  if (Fuente === 'perfil') {
    const Fijo = Estadoactual.Tipo === 'variable' ? 0 : (Estadoactual.Fijo || 0);
    const Variable = Estadoactual.Tipo === 'fijo' ? 0 : (Estadoactual.Variable || 0);
    const Extras = (Estadoactual.Ingresosfijosextra || []).reduce((Acumulado, Fijoextra) => Acumulado + Fijoextra.Monto, 0);
    return Fijo + Variable + Extras;
  }
  if (Fuente === 'promedio') return Automatico;
  if (Fuente === 'manual') return Estadoactual.Ingresomanual || 0;
  return Estadoactual.Usarautomatico ? Automatico : (Estadoactual.Ingresomanual || 0);
}

// Calcula el precio máximo de vivienda, el crédito bancario y la cuota mensual del hogar
function Calcularcapacidad(Estadoactual, Deudasmanuales, Modalidadmanual) {
  const Modalidadelegida = Modalidadmanual || Estadoactual.Modalidadelegida || 'vis';
  const Configuracion = Modalidadesvivienda[Modalidadelegida] || Modalidadesvivienda.vis;
  const Financiargastos = Boolean(Estadoactual.Financiargastos);
  const N = Estadoactual.Promediomeses === 3 ? 3 : 6;
  // Promedio de los meses completos con registros; sin registros vale lo que la persona declaró en su perfil
  const Historial = Historialvariables(Estadoactual);
  const Variablepromedio = Promediovariable(Historial, N, 0, Estadoactual);
  const Variableanterior = Promediovariable(Historial, N, 1, Estadoactual);
  const Fijopromedio = (Estadoactual.Tipo === 'variable' ? 0 : (Estadoactual.Fijo || 0)) + (Estadoactual.Ingresosfijosextra || []).reduce((Acumulado, Fijoextra) => Acumulado + Fijoextra.Monto, 0);
  const Automatico = Fijopromedio + Variablepromedio;

  const Ingresotitular = Estadoactual.Solicitantes && Estadoactual.Solicitantes.length > 0
    ? Estadoactual.Solicitantes.reduce((Acumulado, Solicitante) => Acumulado + (Solicitante.Ingresomensual || Solicitante.Ingreso || 0), 0)
    : Ingresosegunfuente(Estadoactual, Automatico);
  const Ingresovariable = Estadoactual.Solicitantes && Estadoactual.Solicitantes.length > 0 ? 0 : (Estadoactual.Pareja ? (Estadoactual.Parejaingreso ?? 2400000) : 0);
  const Ingresototal = Ingresotitular + Ingresovariable;

  const Deudas = Deudasmanuales || Estadoactual.Deudas || [];
  const Deudastitular = Estadoactual.Cuotasdeudasactivas !== undefined
    ? Estadoactual.Cuotasdeudasactivas
    : Deudas.filter(Deuda => Deuda.Activa !== false).reduce((Acumulado, Deuda) => Acumulado + (Deuda.Cuota || 0), 0);
  const Deudaspareja = Estadoactual.Cuotasdeudasactivas !== undefined ? 0 : (Estadoactual.Pareja ? (Estadoactual.Parejadeudas ?? 300000) : 0);
  const Deudasmes = Deudastitular + Deudaspareja;
  const Ingresolibre = Ingresototal - Deudasmes;
  const Neto = Math.max(0, Ingresolibre);

  // La norma permite que la cuota llegue al 40% del ingreso; el modo conservador usa el 30% que aplican algunos bancos
  const Tope = Estadoactual.Topeconservador ? 0.30 : Configuracion.Tope;
  const Entidadclave = Estadoactual.Entidad === 'caja' && !Estadoactual.Caja ? 'promedio' : (Estadoactual.Entidad || 'promedio');
  // Si ya llegaron las tasas de la Superintendencia se usan (con margen prudente); si no, las de referencia
  const Mercadoentidad = typeof Tasasmercadoactual !== 'undefined' && Tasasmercadoactual ? Tasasmercadoactual[Entidadclave] : null;
  const Entidad = { ...(Tasasreferencia[Entidadclave] || Tasasreferencia.promedio), ...(Mercadoentidad || {}) };
  const Margenuvr = (Modalidadelegida === 'vis' ? Entidad.Uvrvis : Entidad.Uvrnovis) || Entidad.Uvr;
  const Infoentidades = Estadoactual.Infoentidad || {}, Egresocategoria = Infoentidades.caja || {}, Egresofijo = Infoentidades.fna || {};
  const Preaprobado = Entidadclave === 'caja' ? Egresocategoria : Entidadclave === 'fna' ? Egresofijo : {};
  const Preaprobadotasa = Preaprobado.Tasa > 0 ? Preaprobado.Tasa / 100 : 0;
  const Preaprobadoplazo = Preaprobado.Plazo > 0 ? Preaprobado.Plazo : 0;
  const Preaprobadofinanciacion = Preaprobado.Financiacion > 0 ? Math.min(1, Preaprobado.Financiacion / 100) : 0;
  const Preaprobadomonto = Preaprobado.Monto > 0 ? Preaprobado.Monto : 0;

  const Tasaanual = Estadoactual.Tasaanualfija || Preaprobadotasa || (Estadoactual.Tasatipo === 'uvr' && Modalidadelegida !== 'leasing' && Entidadclave !== 'caja' ? Margenuvr : (Entidad[Modalidadelegida] || 0.1135));
  const Plazoanios = Estadoactual.Plazomesesfijo ? (Estadoactual.Plazomesesfijo / 12) : (Preaprobadoplazo || Math.max(5, Math.min(Estadoactual.Plazoelegido || 20, 75 - (Estadoactual.Edad || 0), Entidadclave === 'caja' ? 20 : 30)));
  const Anualidad = Calcularanualidad(Tasaanual, Plazoanios);
  const Opcioncompra = Modalidadelegida === 'leasing' ? (Estadoactual.Opcioncompra ?? 0.10) : 0;
  const Valorn = Math.pow(1 + Anualidad.Tasaperiodica, -Anualidad.Numerocuotas);
  const Factor = Anualidad.Factoranualidad / (1 - Opcioncompra * Valorn);

  const Cuotamaxima = Math.max(0, Math.round(Neto * Tope));
  const Creditoporcapacidad = Preaprobadomonto || (Cuotamaxima > 0 ? Math.round(Cuotamaxima * Factor) : 0);

  const Topevissalarios = Consultartopevis(Estadoactual.Ciudad || 'Bogotá');
  const Topevis = Topevissalarios * Salariominimo;
  const Topevip = 90 * Salariominimo;
  const Salariosminimos = Number((Ingresototal / Salariominimo).toFixed(2));
  const Ingresomaximopesos = 4 * Salariominimo;
  const Cortepesos = 2 * Salariominimo;

  const Afiliadocaja = Estadoactual.Afiliadocaja !== undefined ? Boolean(Estadoactual.Afiliadocaja) : Boolean(Estadoactual.Caja);
  const Subsidiocajaelegible = Afiliadocaja && (Ingresototal <= Ingresomaximopesos);
  let Subsidiocajasalarios = 0;
  if (Subsidiocajaelegible) {
    Subsidiocajasalarios = Ingresototal <= Cortepesos ? 30 : 20;
  }

  const Declarado = (Elemento) => ['Asignado', 'Aplicado'].includes(Elemento.Estadosubsidio) && Elemento.Montosubsidio > 0;
  const Vencido = (Elemento) => Declarado(Elemento) && Mesesvigencia(Elemento.Vencesubsidio) !== null && Mesesvigencia(Elemento.Vencesubsidio) < 0;
  const Asignado = (Elemento) => Declarado(Elemento) && !Vencido(Elemento);
  const Subsidiocajareal = Asignado(Egresocategoria);
  // Un subsidio ya asignado se respeta aunque el ingreso del hogar pase de 4 SMMLV (por ejemplo al sumar la pareja)
  const Subsidiocajamonto = Subsidiocajareal ? Egresocategoria.Montosubsidio : (Subsidiocajasalarios * Salariominimo);

  const Micasayaelegible = Boolean(Estadoactual.Sisben) && (Ingresototal <= Ingresomaximopesos);
  const Micasayagrupo = Estadoactual.Sisbengrupo === 'C9-D20' ? 20 : 30;
  let Subsidiomicasayasalarios = 0;
  if (Micasayaelegible) {
    if (Subsidiocajaelegible) {
      if (Ingresototal <= Cortepesos) Subsidiomicasayasalarios = 20;
      else Subsidiomicasayasalarios = Math.max(0, Micasayagrupo - Subsidiocajasalarios);
    } else {
      Subsidiomicasayasalarios = Micasayagrupo;
    }
  }
  const Subsidiofnareal = Asignado(Egresofijo);
  const Subsidiomicasayamonto = Subsidiofnareal ? Egresofijo.Montosubsidio : (Subsidiomicasayasalarios * Salariominimo);

  const Ahorroentidad = (Egresocategoria.Cesantias || 0) + (Egresocategoria.Ahorro || 0) + (Egresofijo.Cesantias || 0) + (Egresofijo.Ahorro || 0);
  const Ahorropareja = Estadoactual.Pareja ? (Estadoactual.Parejaahorro || 0) : 0;
  const Ahorrobaseusuario = Estadoactual.Ahorroycesantias !== undefined ? Estadoactual.Ahorroycesantias : ((Estadoactual.Ahorro || 0) + Ahorroentidad + Ahorropareja);

  const Financiacionvis = Preaprobadofinanciacion || Configuracion.Financiacion || 0.80;
  const Financiacionnovis = Preaprobadofinanciacion || 0.70;
  const Porcentajegastos = Configuracion.Gastos !== undefined ? Configuracion.Gastos : 0.03;

  if (Creditoporcapacidad === 0) {
    return {
      Ingresohogar: Ingresototal,
      Ingresohogarsalarios: Salariosminimos,
      Ingresolibre: Ingresolibre,
      Endeudamientoporcentaje: Ingresototal > 0 ? Number(((Deudasmes / Ingresototal) * 100).toFixed(1)) : 0,
      Cuotamaxima: 0, Creditoporcapacidad: 0, Subsidiocajaelegible, Subsidiocajaaplicado: 0, Recursospropios: Ahorrobaseusuario,
      Modalidad: null, Modalidadelegida: null, Limitante: 'sin_capacidad', Preciomaximo: 0, Precio: 0, Preciohoy: 0,
      Preciocupo: 0, Creditocupo: 0, Subsidiocupo: 0, Cuotainicialcupo: 0, Faltacupo: 0,
      Preciotecho: 0, Creditotecho: 0, Subsidiotecho: 0, Cuotainicialtecho: 0, Gastostecho: 0, Cuotatecho: 0, Financiaciontecho: 0, Faltatecho: 0,
      Techosobretopevis: false, Subsidiocajavencido: Vencido(Egresocategoria), Subsidiocajasobretope: false, Ahorropareja, Ahorrohogar: Ahorrobaseusuario,
      Credito: 0, Creditousado: 0, Financiacionporcentaje: 0, Cuotainicial: 0, Gastosescrituracion: 0, Gastos: 0, Cuotamensual: 0, Cuota: 0,
      Margendespuescierre: 0, Faltanteparacupocompleto: 0, Falta: 0, Estadocierre: 'sin_capacidad', Topado: false, Limiteahorro: false, Financiacion: 0,
      Configuracion, Ingresototal, Ingresotitular, Deudasmes, Neto, Tope, Tasaanual, Plazo: Plazoanios, Factor, Capacidadcuota: 0, 
      Topevis, Topevissalarios, Topevip, Esvip: false, Salariosminimos, Subsidiocajasalarios: 0, Subsidiomicasayasalarios: 0,
      Subsidiocaja: 0, Subsidiomicasaya: 0, Subsidio: 0, Efectivo: Ahorrobaseusuario, Opcioncompra, Opcioncompravalor: 0,
      Objetivo: 0, Ingresonecesario: Deudasmes, Metadiaria: 0, Sensibilidad: 0, Sensibilidadcredito: 0, N, Historial, Variablepromedio, Variableanterior, Fijopromedio, Automatico,
      Entidadclave, Ahorroentidad, Preaprobadomonto, Preaprobadotasa
    };
  }

  const Recursosvis = Ahorrobaseusuario + Subsidiocajamonto + Subsidiomicasayamonto;
  const Preciocapacidadvis = (Creditoporcapacidad + Recursosvis) / (1 + Porcentajegastos);
  const Preciorecursosvis = Financiargastos ? (Recursosvis / (1 - Financiacionvis)) : (Recursosvis / (1 - Financiacionvis + Porcentajegastos));
  const Preciovisteorico = Math.min(Preciocapacidadvis, Preciorecursosvis);

  // Techo según los ingresos: lo que el banco prestaría si ya tuvieras la cuota inicial completa
  const Cupovis = Creditoporcapacidad / Financiacionvis;
  const Noviscupo = Modalidadmanual === 'novis' || (Modalidadelegida === 'novis' && !Modalidadmanual) || Cupovis > Topevis;
  const Preciocupo = Math.round(Noviscupo ? Creditoporcapacidad / Financiacionnovis : Cupovis);
  const Creditocupo = Math.min(Creditoporcapacidad, Preciocupo);
  const Cuotainicialcupo = Math.max(0, Preciocupo - Creditocupo);
  const Subsidiocupo = Noviscupo ? 0 : Math.min(Cuotainicialcupo, Subsidiocajamonto + Subsidiomicasayamonto);
  // Lo que falta, sumando los gastos de escritura, para comprar ese techo con lo que la persona tiene hoy
  const Gastoscupototal = Math.round(Preciocupo * (Noviscupo ? (Modalidadesvivienda.novis.Gastos ?? Porcentajegastos) : Porcentajegastos));
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

  if (Modalidadmanual === 'novis' || (Modalidadelegida === 'novis' && !Modalidadmanual)) {
    const Recursosnovis = Ahorrobaseusuario;
    const Preciocapacidadnovis = (Creditoporcapacidad + Recursosnovis) / (1 + Porcentajegastos);
    const Preciorecursosnovis = Financiargastos ? (Recursosnovis / (1 - Financiacionnovis)) : (Recursosnovis / (1 - Financiacionnovis + Porcentajegastos));
    const Precionovisteorico = Math.min(Preciocapacidadnovis, Preciorecursosnovis);
    Modalidad = 'NO_VIS';
    Modalidadfinal = 'novis';
    Subsidiocajaaplicado = 0;
    Subsidiomicasayaaplicado = 0;
    Recursospropios = Recursosnovis;
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
    const Recursosnovis = Ahorrobaseusuario;
    const Preciocapacidadnovis = (Creditoporcapacidad + Recursosnovis) / (1 + Porcentajegastos);
    const Preciorecursosnovis = Financiargastos ? (Recursosnovis / (1 - Financiacionnovis)) : (Recursosnovis / (1 - Financiacionnovis + Porcentajegastos));
    const Precionovisteorico = Math.min(Preciocapacidadnovis, Preciorecursosnovis);

    if (Precionovisteorico > Topevis) {
      Modalidad = 'NO_VIS';
      Modalidadfinal = 'novis';
      Subsidiocajaaplicado = 0;
      Subsidiomicasayaaplicado = 0;
      Recursospropios = Recursosnovis;
      Financiacionmaxima = Financiacionnovis;
      Preciomax = Math.round(Precionovisteorico);
      if (Preciorecursosnovis < Preciocapacidadnovis) {
        Limitante = 'recursos_propios';
        Estado = 'falta_cuota_inicial';
      } else {
        Limitante = 'capacidad_pago';
        Estado = 'cierre_completo';
      }
    } else {
      Modalidad = 'VIS';
      Modalidadfinal = 'vis';
      Subsidiocajaaplicado = Subsidiocajamonto;
      Subsidiomicasayaaplicado = Subsidiomicasayamonto;
      Recursospropios = Recursosvis;
      Financiacionmaxima = Financiacionvis;
      Preciomax = Topevis;
      Limitante = 'tope_vis';
      Estado = 'limitado_tope_vis';
    }
  } else {
    Modalidad = 'VIS';
    Modalidadfinal = 'vis';
    Subsidiocajaaplicado = Subsidiocajamonto;
    Subsidiomicasayaaplicado = Subsidiomicasayamonto;
    Recursospropios = Recursosvis;
    Financiacionmaxima = Financiacionvis;
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
  let Credito = 0, Cuotainicial = 0, Margendespuescierre = 0, Falta = 0;

  if (Financiargastos) {
    const Creditovivienda = Math.min(Creditoporcapacidad, Math.round(Financiacionmaxima * Preciomax));
    Credito = Creditovivienda + Gastos;
    Cuotainicial = Preciomax - Creditovivienda;
    Margendespuescierre = Recursospropios - Cuotainicial;
    if (Limitante === 'recursos_propios') {
      const Preciocupo = Creditoporcapacidad / Financiacionmaxima;
      Falta = Math.max(0, Math.round(Preciocupo * (1 - Financiacionmaxima) - Recursospropios));
    }
  } else {
    Credito = Math.min(
      Creditoporcapacidad,
      Math.round(Financiacionmaxima * Preciomax),
      Math.max(0, Math.round(Preciomax * (1 + Porcentajegastos) - Recursospropios))
    );
    Cuotainicial = Preciomax - Credito;
    Margendespuescierre = Recursospropios - Cuotainicial - Gastos;
    if (Limitante === 'recursos_propios') {
      const Preciocupo = Creditoporcapacidad / Financiacionmaxima;
      Falta = Math.max(0, Math.round(Preciocupo * (1 - Financiacionmaxima + Porcentajegastos) - Recursospropios));
    }
  }

  const Cuota = Math.round(Credito * (1 - Opcioncompra * Valorn) / Anualidad.Factoranualidad);

  const Endeudamientoporcentaje = Ingresototal > 0 ? Number(((Deudasmes / Ingresototal) * 100).toFixed(1)) : 0;
  const Financiacionporcentaje = Preciomax > 0 ? Number(((Credito / Preciomax) * 100).toFixed(1)) : 0;
  // Todo lo del techo sale de aquí, para que Inicio, Simulador, Plan, Ofertas y el reporte digan lo mismo
  const Contecho = Limitante === 'recursos_propios';
  const Preciotecho = Contecho ? Preciocupo : Preciomax, Creditotecho = Contecho ? Creditocupo : Credito;
  const Cuotatecho = Math.round(Creditotecho * (1 - Opcioncompra * Valorn) / Anualidad.Factoranualidad);
  // Si el techo pasa el tope VIS, esa vivienda ya sería No VIS: el banco financia 70% y no hay subsidio
  const Techosobretopevis = Modalidadelegida !== 'novis' && (Contecho ? Noviscupo : Modalidadfinal === 'novis');

  return {
    Ingresohogar: Ingresototal,
    Ingresohogarsalarios: Salariosminimos,
    Ingresolibre: Ingresolibre,
    Endeudamientoporcentaje: Endeudamientoporcentaje,
    Cuotamaxima: Cuotamaxima,
    Creditoporcapacidad: Creditoporcapacidad,
    Subsidiocajaelegible: Subsidiocajaelegible,
    Subsidiocajaaplicado: Subsidiocajaaplicado,
    Recursospropios: Recursospropios,
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
    // Si lo que frena es el ahorro, el techo es lo que permiten los ingresos; si no, es lo que ya se puede cerrar hoy
    Preciotecho,
    Creditotecho,
    Subsidiotecho: Contecho ? Subsidiocupo : Math.min(Subsidiocajaaplicado + Subsidiomicasayaaplicado, Cuotainicial),
    Cuotainicialtecho: Contecho ? Cuotainicialcupo : Cuotainicial,
    Gastostecho: Contecho ? Gastoscupototal : Gastos,
    Cuotatecho,
    Financiaciontecho: Preciotecho > 0 ? Creditotecho / Preciotecho : 0,
    Faltatecho: Contecho ? Faltacupo : 0,
    Techosobretopevis,
    Subsidiocajavencido: Vencido(Egresocategoria),
    Subsidiocajasobretope: Subsidiocajareal && !Subsidiocajaelegible,
    Ahorropareja,
    Ahorrohogar: Ahorrobaseusuario,
    Credito,
    Creditousado: Credito,
    Financiacionporcentaje: Financiacionporcentaje,
    Cuotainicial: Cuotainicial,
    Gastosescrituracion: Gastos,
    Gastos,
    Cuotamensual: Cuota,
    Cuota,
    Margendespuescierre: Margendespuescierre,
    Faltanteparacupocompleto: Falta,
    Falta,
    Estadocierre: Estado,
    Financiacion: Financiacionmaxima,
    Topado: Limitante === 'tope_vis',
    Limiteahorro: Limitante === 'recursos_propios',
    Topevis,
    Topevissalarios,
    Topevip,
    Esvip: Modalidadfinal === 'vis' && Preciomax <= Topevip,
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
    Objetivo: Modalidadfinal === 'vis' ? Math.min(Estadoactual.Objetivousuario > 0 ? Estadoactual.Objetivousuario : Preciotecho, Topevis) : (Estadoactual.Objetivousuario > 0 ? Estadoactual.Objetivousuario : Preciotecho),
    Ingresonecesario: (Preciomax * Financiacionmaxima) / Factor / Tope + Deudasmes,
    Metadiaria: Math.max(0, ((Preciomax * Financiacionmaxima) / Factor / Tope + Deudasmes) - Fijopromedio - Ingresovariable) / 26,
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
    // Datos de la entidad que usan las pantallas de Simular y de Caja/FNA
    Entidadclave,
    Ahorroentidad,
    Preaprobadomonto,
    Preaprobadotasa
  };
}

// Calcula cómo cambia la cuota en UVR bajo distintos niveles de inflación anual
function Calcularproyeccionuvr(Creditopesos, Plazomeses, Margenuvranual) {
  const Margen = Margenuvranual || 0.075, Numero = Plazomeses || 240, Uvrinicial = Valoruvrhoy;
  const Tasaperiodo = Math.pow(1 + Margen, 1 / 12) - 1, Acumulado = (1 - Math.pow(1 + Tasaperiodo, -Numero)) / Tasaperiodo;
  const Cuotauvr = (Creditopesos / Uvrinicial) / Acumulado, Cuotainicialuvr = Math.round(Cuotauvr * Uvrinicial);
  return Escenariosinflacion.map(Ipc => {
    const Cuotadiezanos = Math.round(Cuotauvr * Uvrinicial * Math.pow(1 + Ipc, 10));
    const Cuotaveinteanos = Math.round(Cuotauvr * Uvrinicial * Math.pow(1 + Ipc, 20));
    const Tasaequivalente = (1 + Margen) * (1 + Ipc) - 1;
    return { Ipc, Ipctexto: (Ipc * 100).toFixed(1).replace('.', ',') + '%', Cuotainicialuvr, Cuotadiezanos, Cuotaveinteanos, Tasaequivalente, Tasaequivalenteporcentaje: (Tasaequivalente * 100).toFixed(2).replace('.', ',') + '%' };
  });
}

