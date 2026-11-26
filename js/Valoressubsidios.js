// Pantalla Caja y subsidios: topes por ingresos en 2026, afiliación, vigencia y Sisbén

function Generarvaloressubsidios(Calculo) {
  const Estadoactual = this.Estadocomponente;
  if (this.Pantalla !== 'app' || Estadoactual.Panel !== 'subsidios') return { Essubsidios: false };

  const Caja = (Estadoactual.Infoentidad && Estadoactual.Infoentidad.caja) || {};
  const Fijarcaja = (Clave, Valor) => this.Cambiarestado(Previo => {
    const Actualcaja = (Previo.Infoentidad && Previo.Infoentidad.caja) || {};
    const Siguiente = { ...Actualcaja, [Clave]: Valor };
    if (Clave === 'Montosubsidio') Siguiente.Estadosubsidio = Valor > 0 ? 'Asignado' : '';
    return { Infoentidad: { ...(Previo.Infoentidad || {}), caja: Siguiente } };
  });

  const Ingresototal = Calculo.Ingresototal || 0;
  const Dos = 2 * Salariominimo;
  const Cuatro = 4 * Salariominimo;
  const Menorados = Ingresototal <= Dos;
  const Menoracuatro = Ingresototal <= Cuatro;
  const Sobretopecuatro = Ingresototal > Cuatro;
  let Potencial = 0;
  if (Menorados) Potencial = 30 * Salariominimo;
  else if (Menoracuatro) Potencial = 20 * Salariominimo;

  const Montoheroe = Calculo.Subsidio > 0 ? Calculo.Subsidio : Potencial;

  let Heroerotulo = 'Con los ingresos de tu hogar podrías postularte a un subsidio de hasta';
  let Heroenota = 'Se suma a tu cuota inicial para comprar vivienda VIS.';
  if (Sobretopecuatro) {
    Heroerotulo = 'Tu hogar supera el tope de 4 salarios mínimos';
    Heroenota = 'Los subsidios de Caja aplican hasta ' + Formatoenteropesos(Cuatro) + ' al mes.';
  } else if (Calculo.Subsidio > 0) {
    Heroerotulo = 'Tu subsidio estimado para vivienda VIS es de';
    if (Calculo.Faltatecho <= 0) {
      Heroenota = 'Ya completas la cuota inicial de tu vivienda.';
    } else if (Calculo.Subsidio >= Calculo.Faltatecho) {
      Heroenota = 'Más de los $' + Formatomillones(Calculo.Faltatecho) + ' M que te faltan para comprar.';
    } else {
      Heroenota = 'Cubre $' + Formatomillones(Calculo.Subsidio) + ' M de tu cuota inicial.';
    }
  } else if (Calculo.Faltatecho > 0 && Potencial > 0) {
    if (Potencial >= Calculo.Faltatecho) {
      Heroenota = 'Más de los $' + Formatomillones(Calculo.Faltatecho) + ' M que te faltan para comprar.';
    } else {
      Heroenota = 'Ayuda a cubrir $' + Formatomillones(Potencial) + ' M de los $' + Formatomillones(Calculo.Faltatecho) + ' M que te faltan.';
    }
  }

  const Esleasing = Estadoactual.Modalidadelegida === 'leasing';
  const Esnovisexplicito = Estadoactual.Modalidadelegida === 'novis';
  const Esvis = Calculo.Preciotecho > 0 && !Esleasing && !Esnovisexplicito && !Calculo.Techosobretopevis;
  const Vigencia = Mesesvigencia(Caja.Vencesubsidio);
  let Vigilabel = '';
  let Vigiaclase = '';
  if (Caja.Vencesubsidio && Vigencia === null) {
    Vigilabel = 'Escribe la fecha como mm/aaaa, por ejemplo 12/2027.';
  } else if (Vigencia !== null && Vigencia < 0) {
    Vigilabel = 'Ese subsidio ya venció. Pregunta en tu Caja si puedes prorrogarlo.';
    Vigiaclase = 'is-alerta';
  } else if (Vigencia !== null && Vigencia <= 3) {
    Vigilabel = 'Vence pronto: úsalo o pide prórroga en tu Caja.';
  } else if (Vigencia !== null) {
    Vigilabel = 'Vigente por ' + Vigencia + ' meses más.';
    Vigiaclase = 'is-ok';
  }

  let Notavis = 'Completa tus ingresos para revisar el tope VIS.';
  if (Esleasing) {
    Notavis = 'Elegiste leasing habitacional: en esta modalidad no sumamos subsidio de vivienda.';
  } else if (Esnovisexplicito) {
    Notavis = 'Elegiste vivienda No VIS: los subsidios aplican solo a vivienda VIS.';
  } else if (Calculo.Preciotecho > 0) {
    if (Esvis) {
      Notavis = 'Tu presupuesto ($' + Formatomillones(Calculo.Preciotecho) + ' M) es VIS.';
    } else {
      Notavis = 'Tu presupuesto ($' + Formatomillones(Calculo.Preciotecho) + ' M) pasa el tope VIS de ' + (Estadoactual.Ciudad || 'tu ciudad') + '.';
    }
  }

  let Detallecaja = 'Como independiente es voluntario. Con el aporte del 0,6% no aplica para vivienda.';
  if (Estadoactual.Caja) {
    const Sufijo = Estadoactual.Cajanombre ? ' (' + Estadoactual.Cajanombre + ')' : '';
    Detallecaja = 'Ya marcaste afiliación' + Sufijo + '. Verifica que tu aporte sea del 2%.';
  } else if (Estadoactual.Tipo === 'fijo') {
    Detallecaja = 'Si tienes contrato laboral, tu empresa ya te afilió; actívalo abajo.';
  }

  const Mesesexigidos = Estadoactual.Tipo === 'fijo' ? 3 : 12;
  const Cumpleaportes = Boolean(Estadoactual.Caja && (Caja.Meses || 0) >= Mesesexigidos);

  const Guardarsubsidios = () => {
    this.Aviso('Datos de Caja y subsidios guardados.');
    if (!Volverlugaranterior.call(this)) this.Cambiarestado({ Panel: null });
  };

  return {
    Essubsidios: true,
    Subsidiosvolver: Nombrespestanas[this.Pestana] || 'Volver',
    Subsidiosheroerotulo: Heroerotulo,
    Subsidiosheroecifra: '$' + Formatomillones(Montoheroe),
    Subsidiosheroenota: Heroenota,
    Subsidiotramounorango: 'Hasta ' + Formatoenteropesos(Dos) + ' al mes',
    Subsidiotramounomonto: Formatoenteropesos(30 * Salariominimo),
    Subsidiotramounohogar: Menorados,
    Subsidiotramounoclase: Menorados ? 'is-hogar' : '',
    Subsidiotramodosrango: 'De ' + Formatoenteropesos(Dos + 1) + ' a ' + Formatoenteropesos(Cuatro),
    Subsidiotramodosmonto: Formatoenteropesos(20 * Salariominimo),
    Subsidiotramodoshogar: !Menorados && Menoracuatro,
    Subsidiotramodosclase: !Menorados && Menoracuatro ? 'is-hogar' : '',
    Subsidiotramotresrango: 'Más de ' + Formatoenteropesos(Cuatro),
    Subsidiotramotreshogar: Sobretopecuatro,
    Subsidiotramotresclase: Sobretopecuatro ? 'is-hogar' : '',
    Subsidiosingresook: Menoracuatro,
    Subsidiosingresono: Sobretopecuatro,
    Subsidiosingresotope: Formatoenteropesos(Cuatro),
    Subsidiosingresohogar: Formatoenteropesos(Calculo.Ingresototal),
    Subsidiosvisok: Esvis,
    Subsidiosvisaviso: !Esvis,
    Subsidiosvisnota: Notavis,
    Subsidioscajaok: Boolean(Estadoactual.Caja),
    Subsidioscajafalta: !Estadoactual.Caja,
    Subsidioscajadetalle: Detallecaja,
    Subsidiosaportesok: Cumpleaportes,
    Subsidiosaportesfalta: !Cumpleaportes,
    Subsidioscajaclase: Estadoactual.Caja ? 'is-activo' : '',
    Subsidioscajaactiva: Boolean(Estadoactual.Caja),
    Subsidioscajafichas: ['Compensar', 'Colsubsidio', 'Cafam', 'Comfama', 'Comfenalco', 'Comfandi', 'Cajacopi', 'Otra'].map(Nombre => ({
      Etiqueta: Nombre,
      Activa: Estadoactual.Cajanombre === Nombre,
      Clase: Estadoactual.Cajanombre === Nombre ? 'is-activa' : '',
      Alclic: () => this.Cambiarestado({ Cajanombre: Nombre })
    })),
    Subsidiosasignadotexto: Caja.Montosubsidio ? Formatoenteropesos(Caja.Montosubsidio) : '',
    Escribirsubsidioasignado: (Elemento) => Fijarcaja('Montosubsidio', Limpiardigitos(Elemento.target.value, Limitesfinancieros.Subsidio)),
    Subsidiosvence: Caja.Vencesubsidio || '',
    Escribirsubsidiovence: (Elemento) => Fijarcaja('Vencesubsidio', Textoseguro(Elemento.target.value, 10)),
    Subsidiosvigenciavisible: Boolean(Vigilabel),
    Subsidiosvigenciaclase: Vigiaclase,
    Subsidiosvigenciatexto: Vigilabel,
    Subsidiossisbenactivo: Boolean(Estadoactual.Sisben),
    Subsidiossisbenclase: Estadoactual.Sisben ? 'is-activo' : '',
    Subsidiossisbenfichas: [['A1-C8', 'A1 a C8 · 30 SMMLV'], ['C9-D20', 'C9 a D20 · 20 SMMLV']].map(([Clave, Etiqueta]) => ({
      Etiqueta,
      Activa: Estadoactual.Sisbengrupo === Clave,
      Clase: Estadoactual.Sisbengrupo === Clave ? 'is-activa' : '',
      Alclic: () => this.Cambiarestado({ Sisbengrupo: Clave })
    })),
    Subsidiosavanzado: Boolean(Estadoactual.Subsidiosavanzado),
    Alternarsubsidiosavanzado: () => this.Cambiarestado({ Subsidiosavanzado: !Estadoactual.Subsidiosavanzado }),
    Guardarsubsidios
  };
}
