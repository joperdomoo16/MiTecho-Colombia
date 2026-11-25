// Reglas de ingreso por fuente, subsidios de vivienda, vivienda objetivo y proyección en UVR

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
  if (Estadoactual.Usarautomatico) return Automatico;
  return Estadoactual.Ingresomanual || 0;
}

// Revisa tramos de ingresos (2 y 4 SMMLV) y respeta subsidios con carta vigente aunque el hogar suba de ingresos
function Calcularsubsidioshogar(Estadoactual, Ingresototal, Egresocategoria, Egresofijo) {
  const Ingresomaximopesos = 4 * Salariominimo;
  const Cortepesos = 2 * Salariominimo;
  const Afiliadocaja = Estadoactual.Afiliadocaja !== undefined ? Boolean(Estadoactual.Afiliadocaja) : Boolean(Estadoactual.Caja);
  const Subsidiocajaelegible = Afiliadocaja && (Ingresototal <= Ingresomaximopesos);

  let Subsidiocajasalarios = 0;
  if (Subsidiocajaelegible) {
    Subsidiocajasalarios = Ingresototal <= Cortepesos ? 30 : 20;
  }

  const Declarado = (Elemento) => ['Asignado', 'Aplicado'].includes(Elemento.Estadosubsidio) && Elemento.Montosubsidio > 0;
  const Vencido = (Elemento) => {
    if (!Declarado(Elemento)) return false;
    const Restante = Mesesvigencia(Elemento.Vencesubsidio);
    return Restante !== null && Restante < 0;
  };
  const Asignado = (Elemento) => Declarado(Elemento) && !Vencido(Elemento);

  const Subsidiocajareal = Asignado(Egresocategoria);
  const Subsidiocajavencido = Vencido(Egresocategoria);
  const Subsidiocajamonto = Subsidiocajareal ? Egresocategoria.Montosubsidio : (Subsidiocajasalarios * Salariominimo);

  const Micasayaelegible = Boolean(Estadoactual.Sisben) && (Ingresototal <= Ingresomaximopesos);
  const Micasayagrupo = Estadoactual.Sisbengrupo === 'C9-D20' ? 20 : 30;
  let Subsidiomicasayasalarios = 0;
  if (Micasayaelegible) {
    if (Subsidiocajaelegible) {
      if (Ingresototal <= Cortepesos) {
        Subsidiomicasayasalarios = 20;
      } else {
        Subsidiomicasayasalarios = Math.max(0, Micasayagrupo - Subsidiocajasalarios);
      }
    } else {
      Subsidiomicasayasalarios = Micasayagrupo;
    }
  }

  const Subsidiofnareal = Asignado(Egresofijo);
  const Subsidiomicasayamonto = Subsidiofnareal ? Egresofijo.Montosubsidio : (Subsidiomicasayasalarios * Salariominimo);

  return {
    Afiliadocaja,
    Subsidiocajaelegible,
    Subsidiocajasalarios,
    Subsidiocajareal,
    Subsidiocajavencido,
    Subsidiocajamonto,
    Subsidiomicasayasalarios,
    Subsidiofnareal,
    Subsidiomicasayamonto
  };
}

// Aplica las mismas reglas del cierre financiero sobre la vivienda objetivo que definió la persona
function Armarobjetivovivienda(Contexto, Objetivo, Techo) {
  let Esnovis = Contexto.Modalidadelegida === 'novis' || Objetivo > Contexto.Topevis;
  if (Techo) Esnovis = Techo.Novis;

  let Tasagastos = Contexto.Porcentajegastos;
  if (Esnovis && Modalidadesvivienda.novis.Gastos !== undefined) {
    Tasagastos = Modalidadesvivienda.novis.Gastos;
  }

  const Gastostotal = Math.round(Objetivo * Tasagastos);
  const Gastospropios = Contexto.Financiargastos ? 0 : Gastostotal;
  const Subsidios = Esnovis ? 0 : (Contexto.Subsidiocajamonto + Contexto.Subsidiomicasayamonto);
  const Gastoscredito = Gastostotal - Gastospropios;
  const Porcentajefinanciacion = Esnovis ? Contexto.Financiacionnovis : Contexto.Financiacionvis;
  const Topebanco = Math.round(Objetivo * Porcentajefinanciacion);
  const Restanteprecio = Objetivo - Subsidios - Math.max(0, Contexto.Ahorrobaseusuario - Gastospropios);
  const Vivienda = Math.max(0, Math.min(Topebanco, Restanteprecio));

  const Necesario = Techo ? Techo.Credito : (Vivienda + Gastoscredito);
  const Cuotainicial = Techo ? Techo.Cuotainicial : (Objetivo - Math.max(0, Math.min(Contexto.Creditoporcapacidad - Gastoscredito, Vivienda)));
  const Subsidio = Techo ? Techo.Subsidio : Math.min(Subsidios, Cuotainicial);
  const Gastos = Techo ? Techo.Gastos : Gastospropios;
  const Ingresonecesario = Objetivo > 0 ? Math.round(Necesario / Contexto.Factor / Contexto.Tope + Contexto.Deudasmes) : Contexto.Deudasmes;
  const Objetivofalta = Techo ? Techo.Falta : Math.max(0, Cuotainicial - Subsidio + Gastos - Contexto.Ahorrobaseusuario);
  const Metadiaria = Objetivo > 0 ? Math.max(0, Ingresonecesario - Contexto.Fijopromedio - Contexto.Ingresovariable) / 26 : 0;

  return {
    Objetivo,
    Objetivonovis: Esnovis,
    Objetivocredito: Objetivo - Cuotainicial,
    Objetivocreditonecesario: Necesario,
    Objetivocuotainicial: Cuotainicial,
    Objetivogastos: Gastos,
    Objetivosubsidio: Subsidio,
    Objetivofalta,
    Ingresonecesario,
    Metadiaria
  };
}

// Estima cómo sube la cuota en UVR a 10 y 20 años frente a distintos niveles de inflación
function Calcularproyeccionuvr(Creditopesos, Plazomeses, Margenuvranual) {
  const Margen = Margenuvranual || 0.075;
  const Numero = Plazomeses || 240;
  const Uvrinicial = Valoruvrhoy;
  const Tasaperiodo = Math.pow(1 + Margen, 1 / 12) - 1;
  const Acumulado = (1 - Math.pow(1 + Tasaperiodo, -Numero)) / Tasaperiodo;
  const Cuotauvr = (Creditopesos / Uvrinicial) / Acumulado;
  const Cuotainicialuvr = Math.round(Cuotauvr * Uvrinicial);

  return Escenariosinflacion.map(Ipc => {
    const Cuotadiezanos = Math.round(Cuotauvr * Uvrinicial * Math.pow(1 + Ipc, 10));
    const Cuotaveinteanos = Math.round(Cuotauvr * Uvrinicial * Math.pow(1 + Ipc, 20));
    const Tasaequivalente = (1 + Margen) * (1 + Ipc) - 1;
    return {
      Ipc,
      Ipctexto: (Ipc * 100).toFixed(1).replace('.', ',') + '%',
      Cuotainicialuvr,
      Cuotadiezanos,
      Cuotaveinteanos,
      Tasaequivalente,
      Tasaequivalenteporcentaje: (Tasaequivalente * 100).toFixed(2).replace('.', ',') + '%'
    };
  });
}
