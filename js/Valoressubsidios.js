// Datos de la pantalla «Caja y subsidios»: tramos 2026, requisitos, afiliación, subsidio asignado y Sisbén

function Generarvaloressubsidios(Calculo, Seleccion) {
  const Estadoactual = this.Estadocomponente;
  if (this.Pantalla !== 'app' || Estadoactual.Panel !== 'subsidios') return { Essubsidios: false };

  const Caja = (Estadoactual.Infoentidad && Estadoactual.Infoentidad.caja) || {};
  const Fijarcaja = (Clave, Valor) => this.Cambiarestado(Previo => {
    const Actualcaja = (Previo.Infoentidad && Previo.Infoentidad.caja) || {};
    const Siguiente = { ...Actualcaja, [Clave]: Valor };
    if (Clave === 'Montosubsidio') Siguiente.Estadosubsidio = Valor > 0 ? 'Asignado' : '';
    return { Infoentidad: { ...(Previo.Infoentidad || {}), caja: Siguiente } };
  });

  const Salarios = Calculo.Salariosminimos;
  const Dos = 2 * Salariominimo, Cuatro = 4 * Salariominimo;
  const Potencial = Salarios <= 2 ? 30 * Salariominimo : Salarios <= 4 ? 20 * Salariominimo : 0;
  const Montoheroe = Calculo.Subsidio > 0 ? Calculo.Subsidio : Potencial;

  let Heroerotulo = 'Con los ingresos de tu hogar podrías postularte a un subsidio de hasta';
  let Heroenota = 'Se suma a tu cuota inicial para comprar vivienda VIS.';
  if (Salarios > 4) {
    Heroerotulo = 'Tu hogar supera el tope de 4 salarios mínimos';
    Heroenota = 'Los subsidios de Caja aplican hasta ' + Formatoenteropesos(Cuatro) + ' al mes.';
  } else if (Calculo.Subsidio > 0) {
    Heroerotulo = 'Tu subsidio estimado para vivienda VIS es de';
    Heroenota = Calculo.Faltatecho <= 0
      ? 'Ya completas la cuota inicial de tu vivienda.'
      : Calculo.Subsidio >= Calculo.Faltatecho
        ? 'Más de los $' + Formatomillones(Calculo.Faltatecho) + ' M que te faltan para comprar.'
        : 'Cubre $' + Formatomillones(Calculo.Subsidio) + ' M de tu cuota inicial.';
  } else if (Calculo.Faltatecho > 0 && Potencial > 0) {
    Heroenota = Potencial >= Calculo.Faltatecho
      ? 'Más de los $' + Formatomillones(Calculo.Faltatecho) + ' M que te faltan para comprar.'
      : 'Ayuda a cubrir $' + Formatomillones(Potencial) + ' M de los $' + Formatomillones(Calculo.Faltatecho) + ' M que te faltan.';
  }

  const Esvis = Calculo.Preciotecho > 0 && !Calculo.Techosobretopevis;
  const Vigencia = Mesesvigencia(Caja.Vencesubsidio);
  let Vigilabel = '', Vigiaclase = '';
  if (Caja.Vencesubsidio && Vigencia === null) Vigilabel = 'Escribe la fecha como mm/aaaa, por ejemplo 12/2027.';
  else if (Vigencia !== null && Vigencia < 0) { Vigilabel = 'Ese subsidio ya venció. Pregunta en tu Caja si puedes prorrogarlo.'; Vigiaclase = 'is-alerta'; }
  else if (Vigencia !== null && Vigencia <= 3) { Vigilabel = 'Vence pronto: úsalo o pide prórroga en tu Caja.'; }
  else if (Vigencia !== null) { Vigilabel = 'Vigente por ' + Vigencia + ' meses más.'; Vigiaclase = 'is-ok'; }

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
    Subsidiotramo1rango: 'Hasta ' + Formatoenteropesos(Dos) + ' al mes',
    Subsidiotramo1monto: Formatoenteropesos(30 * Salariominimo),
    Subsidiotramo1hogar: Salarios <= 2,
    Subsidiotramo1clase: Salarios <= 2 ? 'is-hogar' : '',
    Subsidiotramo2rango: 'De ' + Formatoenteropesos(Dos + 1) + ' a ' + Formatoenteropesos(Cuatro),
    Subsidiotramo2monto: Formatoenteropesos(20 * Salariominimo),
    Subsidiotramo2hogar: Salarios > 2 && Salarios <= 4,
    Subsidiotramo2clase: Salarios > 2 && Salarios <= 4 ? 'is-hogar' : '',
    Subsidiotramo3rango: 'Más de ' + Formatoenteropesos(Cuatro),
    Subsidiotramo3hogar: Salarios > 4,
    Subsidiotramo3clase: Salarios > 4 ? 'is-hogar' : '',
    Subsidiosingresook: Salarios <= 4,
    Subsidiosingresono: Salarios > 4,
    Subsidiosingresotope: Formatoenteropesos(Cuatro),
    Subsidiosingresohogar: Formatoenteropesos(Calculo.Ingresototal),
    Subsidiosvisok: Esvis,
    Subsidiosvisaviso: !Esvis,
    Subsidiosvisnota: Calculo.Preciotecho <= 0
      ? 'Completa tus ingresos para revisar el tope VIS.'
      : (Esvis ? 'Tu presupuesto ($' + Formatomillones(Calculo.Preciotecho) + ' M) es VIS.'
        : 'Tu presupuesto ($' + Formatomillones(Calculo.Preciotecho) + ' M) pasa el tope VIS de ' + (Estadoactual.Ciudad || 'tu ciudad') + '.'),
    Subsidioscajaok: Boolean(Estadoactual.Caja),
    Subsidioscajafalta: !Estadoactual.Caja,
    Subsidioscajadetalle: Estadoactual.Caja
      ? 'Ya marcaste afiliación' + (Estadoactual.Cajanombre ? ' (' + Estadoactual.Cajanombre + ')' : '') + '. Verifica que tu aporte sea del 2%.'
      : (Estadoactual.Tipo === 'fijo' ? 'Si tienes contrato laboral, tu empresa ya te afilió; actívalo abajo.' : 'Como independiente es voluntario. Con el aporte del 0,6% no aplica para vivienda.'),
    Subsidiosaportesok: Boolean(Estadoactual.Caja && (Caja.Meses || 0) >= (Estadoactual.Tipo === 'fijo' ? 3 : 12)),
    Subsidiosaportesfalta: !(Estadoactual.Caja && (Caja.Meses || 0) >= (Estadoactual.Tipo === 'fijo' ? 3 : 12)),
    Subsidioscajaclase: Estadoactual.Caja ? 'is-activo' : '',
    Subsidioscajaactiva: Boolean(Estadoactual.Caja),
    Subsidioscajafichas: ['Compensar', 'Colsubsidio', 'Cafam', 'Comfama', 'Comfenalco', 'Comfandi', 'Cajacopi', 'Otra'].map(Nombre => ({
      Etiqueta: Nombre, Activa: Estadoactual.Cajanombre === Nombre, Clase: Estadoactual.Cajanombre === Nombre ? 'is-activa' : '',
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
      Etiqueta, Activa: Estadoactual.Sisbengrupo === Clave, Clase: Estadoactual.Sisbengrupo === Clave ? 'is-activa' : '',
      Alclic: () => this.Cambiarestado({ Sisbengrupo: Clave })
    })),
    Subsidiosavanzado: Boolean(Estadoactual.Subsidiosavanzado),
    Alternarsubsidiosavanzado: () => this.Cambiarestado({ Subsidiosavanzado: !Estadoactual.Subsidiosavanzado }),
    Guardarsubsidios
  };
}
