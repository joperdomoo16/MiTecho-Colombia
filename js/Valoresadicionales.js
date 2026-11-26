// Soporte técnico, simulación en pareja, parámetros avanzados de UVR y fuentes normativas

const Tipossoporte = [
  ['soporte', 'Soporte técnico', 'Fallas o preguntas sobre la app. Respondemos en máximo 15 días hábiles.'],
  ['consulta', 'Consulta de mis datos', 'Saber qué datos tenemos y cómo los usamos. Respondemos en máximo 10 días hábiles.'],
  ['reclamo', 'Reclamo sobre mis datos', 'Corregir, borrar o revocar tu autorización. Respondemos en máximo 15 días hábiles.']
];

function Obtenerpuntotoque(Elemento) {
  if (Elemento.Eventonativo && Elemento.Eventonativo.touches) return Elemento.Eventonativo.touches[0];
  if (Elemento.touches) return Elemento.touches[0];
  return null;
}

function Generarvaloresadicionales(Calculo, Configuracion, Seleccion) {
  const Estadoactual = this.Estadocomponente;
  const Esuvr = Estadoactual.Tasatipo === 'uvr' && Estadoactual.Modalidadelegida !== 'leasing' && Calculo.Entidadclave !== 'caja';
  const Factorcorto = Calculo.Factor.toLocaleString('es-CO', { maximumFractionDigits: 1 });
  const Tasaanualtexto = Formatoporcentaje(Calculo.Tasaanual) + (Esuvr ? ' + UVR' : ' E.A.');
  const Objetivoporcentaje = Calculo.Objetivo;
  const Creditoobjetivo = Calculo.Objetivocredito;
  const Gastosobjetivo = Calculo.Objetivogastos;
  const Tengoobjetivo = Calculo.Ahorrohogar + Calculo.Objetivosubsidio;
  const Faltaobjetivo = Calculo.Objetivofalta;

  const Edad = Estadoactual.Edad || 0;
  const Maximolegal = Math.max(5, 75 - Edad);
  const Escaja = Estadoactual.Entidad === 'caja' || Calculo.Entidadclave === 'caja';
  let Plazorecomendadonota = 'Recomendado: 20 años · Balance entre cuota mensual cómoda y menos intereses pagados frente a 30 años.';
  if (Edad > 45 && Maximolegal < (Estadoactual.Plazoelegido || 20)) {
    Plazorecomendadonota = 'Aviso: Por tu edad (' + Edad + ' años), el banco limitará tu crédito a máx. ' + Maximolegal + ' años (Edad + Plazo <= 75).';
  } else if (Escaja && (Estadoactual.Plazoelegido || 20) > 20) {
    Plazorecomendadonota = 'Aviso: Las Cajas de Compensación financian a un plazo máximo de 20 años.';
  } else if (Estadoactual.Plazoelegido === 15) {
    Plazorecomendadonota = '15 años: Pagas mucho menos intereses y terminas antes, pero exige una cuota mensual mayor.';
  } else if (Estadoactual.Plazoelegido === 30) {
    Plazorecomendadonota = '30 años: Cuota mensual más baja para maximizar tu cupo, aunque pagas más intereses en el tiempo.';
  }

  const Pagoinicial = Estadoactual.Parejaingreso || 0;
  const Pagodeudas = Estadoactual.Parejadeudas || 0;
  const Ahorropareja = Estadoactual.Parejaahorro || 0;
  const Parejacondatos = Boolean(Estadoactual.Pareja && (Pagoinicial > 0 || Pagodeudas > 0 || Ahorropareja > 0));
  const Solo = this.Calcular({ ...Estadoactual, Pareja: false });
  const Juntos = this.Calcular({ ...Estadoactual, Pareja: true });
  const Digito = (Elemento, Maximo) => Limpiardigitos(Elemento.target.value, Maximo);
  const Franja = (Opcion) => {
    if (Opcion <= 2) return 30;
    if (Opcion <= 4) return 20;
    return 0;
  };
  const Barrasolo = Franja(Solo.Salariosminimos);
  const Barrajusta = Franja(Juntos.Salariosminimos);
  const Advertencia = Barrajusta < Barrasolo;

  let Subsidiomensaje = '';
  if (Juntos.Subsidiocajasobretope) {
    Subsidiomensaje = 'Juntos ganan más de 4 SMMLV, pero tu subsidio ya está asignado y lo mantenemos en el cálculo. Confirma con tu Caja que la asignación incluye a tu pareja.';
  } else if (Advertencia) {
    const Salariosjuntos = Juntos.Salariosminimos.toLocaleString('es-CO', { maximumFractionDigits: 1 });
    const Efectotramo = Barrajusta
      ? 'el subsidio de Caja bajaría de ' + Barrasolo + ' a ' + Barrajusta + ' SMMLV.'
      : 'perderían el subsidio de Caja (tope 4 SMMLV).';
    Subsidiomensaje = 'Juntos ganan ' + Salariosjuntos + ' SMMLV: ' + Efectotramo;
  }

  const Ayudauno = Calculo.Fijopromedio + Promediovariable(Calculo.Historial, 3, 0, Estadoactual);
  const Ayudados = Calculo.Fijopromedio + Promediovariable(Calculo.Historial, 6, 0, Estadoactual);
  const Cuotaa = this.Calcular({ ...Estadoactual, Topeconservador: true });
  const Cuotab = this.Calcular({ ...Estadoactual, Topeconservador: false });
  const Cuotaplazouno = this.Calcular({ ...Estadoactual, Opcioncompra: 0.01 }, null, 'leasing');
  const Cuotaplazotreinta = this.Calcular({ ...Estadoactual, Opcioncompra: 0.30 }, null, 'leasing');

  const Pesosvis = this.Calcular({ ...Estadoactual, Entidad: 'promedio', Tasatipo: 'pesos' }, null, 'vis').Tasaanual;
  const Pesosnovis = this.Calcular({ ...Estadoactual, Entidad: 'promedio', Tasatipo: 'pesos' }, null, 'novis').Tasaanual;
  const Fuentetasas = typeof Tasasmercadoactual !== 'undefined' && Tasasmercadoactual
    ? 'Promedio de la Superintendencia Financiera al ' + Fechatasasreferencia + ', más 0,5 puntos de margen prudente'
    : 'Valores de referencia al ' + Fechatasasreferencia + '; se actualizan al conectarte';

  return {
    Factorcorto,
    Tasaanualtexto,
    Plazotexto: Calculo.Plazo + ' años',
    Sensibilidadcreditotexto: Formatoenteropesos(Calculo.Sensibilidadcredito),
    Promediomesesetiqueta: Calculo.N + ' meses',
    Ipctexto: Formatoporcentaje(Inflacionanual),
    Factoretiqueta: '× ' + Factorcorto + ' CRÉDITO (' + Tasaanualtexto + ', ' + Calculo.Plazo + ' AÑOS)',
    Cerrarayuda: () => this.Cambiarestado({ Ayuda: false }),
    Abrirprodesdeayuda: () => { this.Cambiarestado({ Ayuda: false }); this.Abrirpro(); },
    Plazorecomendadonota,
    Contactarsoporteayuda: () => {
      clearTimeout(this.Soportetemporizador);
      this.Cambiarestado({
        Soporteabierto: true,
        Soportenombre: Estadoactual.Soportenombre || Estadoactual.Nombre || '',
        Soportecorreo: Estadoactual.Soportecorreo || Estadoactual.Correo || Estadoactual.Ingresocorreo || '',
        Soportetipo: 'soporte',
        Soporteasunto: '',
        Soportedescripcion: '',
        Soporteradicado: '',
        Soportefechamaxima: '',
        Soporteerror: '',
        Soporteenviado: false,
        Soporteocupado: false,
        Soportedesplazamiento: 0,
        Soportearrastrando: false,
        Soporteanimado: false
      });
      this.Soportetemporizador = setTimeout(() => this.Cambiarestado({ Soporteanimado: true }), 25);
    },
    Tienesoporte: Boolean(Estadoactual.Soporteabierto),
    Soportevisible: Estadoactual.Soporteabierto ? 'flex' : 'none',
    Soportefondovisible: Estadoactual.Soporteabierto ? 'block' : 'none',
    Soportetransformacion: Estadoactual.Soporteanimado ? ('translateY(' + (Math.max(0, Estadoactual.Soportedesplazamiento || 0)) + 'px)') : 'translateY(100%)',
    Soportetransicion: Estadoactual.Soportearrastrando ? 'none' : 'transform .32s cubic-bezier(.22,1,.36,1)',
    Soportefondoopacidad: Estadoactual.Soporteanimado ? Math.max(0, 1 - (Estadoactual.Soportedesplazamiento || 0) / 350) : 0,
    Soportetocarinicio: (Elemento) => {
      const Toque = Obtenerpuntotoque(Elemento);
      if (!Toque) return;
      this.Soporteinicioy = Toque.clientY;
      this.Cambiarestado({ Soportearrastrando: true });
    },
    Soportetocarmover: (Elemento) => {
      if (!this.Soporteinicioy) return;
      const Toque = Obtenerpuntotoque(Elemento);
      if (!Toque) return;
      const Desplazamientoy = Toque.clientY - this.Soporteinicioy;
      if (Desplazamientoy > 0) this.Cambiarestado({ Soportedesplazamiento: Desplazamientoy });
    },
    Soportetocarfin: () => {
      const Desplazamientoy = Estadoactual.Soportedesplazamiento || 0;
      this.Soporteinicioy = null;
      if (Desplazamientoy > 90) {
        this.Cambiarestado({ Soporteanimado: false, Soportearrastrando: false });
        clearTimeout(this.Soportetemporizador);
        this.Soportetemporizador = setTimeout(() => {
          this.Cambiarestado({ Soporteabierto: false, Soportedesplazamiento: 0, Soporteerror: '', Soporteocupado: false });
        }, 240);
      } else {
        this.Cambiarestado({ Soportedesplazamiento: 0, Soportearrastrando: false });
      }
    },
    Cerrarsoporte: () => {
      this.Cambiarestado({ Soporteanimado: false, Soportearrastrando: false });
      clearTimeout(this.Soportetemporizador);
      this.Soportetemporizador = setTimeout(() => {
        this.Cambiarestado({ Soporteabierto: false, Soportedesplazamiento: 0, Soporteerror: '', Soporteocupado: false });
      }, 240);
    },
    Soporteformulariovisible: !Estadoactual.Soporteenviado,
    Soporteenviadovisible: Boolean(Estadoactual.Soporteenviado),
    Soportenombrevalor: Estadoactual.Soportenombre || '',
    Soportecorreovalor: Estadoactual.Soportecorreo || '',
    Soporteasuntovalor: Estadoactual.Soporteasunto || '',
    Soportedescripcionvalor: Estadoactual.Soportedescripcion || '',
    Soportedescripcionconteo: ((Estadoactual.Soportedescripcion || '').trim().length) + ' / 500 caracteres · mín. 20',
    Soportedescripcioncolor: ((Estadoactual.Soportedescripcion || '').trim().length >= 20) ? 'var(--at)' : 'var(--mu)',
    Soporteerror: Estadoactual.Soporteerror || '',
    Soportebotontexto: Estadoactual.Soporteocupado ? 'Enviando solicitud…' : 'Enviar solicitud',
    Escribirsoportenombre: (Elemento) => this.Cambiarestado({ Soportenombre: Textoseguro(Elemento.target.value, 80), Soporteerror: '' }),
    Escribirsoportecorreo: (Elemento) => this.Cambiarestado({ Soportecorreo: Textoseguro(Elemento.target.value, 100), Soporteerror: '' }),
    Escribirsoporteasunto: (Elemento) => this.Cambiarestado({ Soporteasunto: Textoseguro(Elemento.target.value, 100), Soporteerror: '' }),
    Escribirsoportedescripcion: (Elemento) => this.Cambiarestado({ Soportedescripcion: Textoseguro(Elemento.target.value, 500, true), Soporteerror: '' }),
    Soportetipofichas: Tipossoporte.map(([Clave, Etiqueta]) => ({
      ...Seleccion((Estadoactual.Soportetipo || 'soporte') === Clave),
      Etiqueta,
      Alclic: () => this.Cambiarestado({ Soportetipo: Clave, Soporteerror: '' })
    })),
    Soportetipoayuda: (Tipossoporte.find(([Clave]) => Clave === (Estadoactual.Soportetipo || 'soporte')) || Tipossoporte[0])[2],
    Soporteradicadotexto: Estadoactual.Soporteradicado || '',
    Soportefechatexto: Estadoactual.Soportefechamaxima
      ? 'Te respondemos a más tardar el ' + Estadoactual.Soportefechamaxima + '. También te enviamos el número de radicado a tu correo.'
      : 'También te enviamos el número de radicado a tu correo.',
    Reiniciarsoporte: () => this.Cambiarestado({ Soportetipo: 'soporte', Soporteasunto: '', Soportedescripcion: '', Soporteerror: '', Soporteenviado: false, Soporteocupado: false, Soporteradicado: '', Soportefechamaxima: '' }),
    Enviarsoporte: async () => {
      if (Estadoactual.Soporteocupado) return;
      const Nombre = (Estadoactual.Soportenombre || '').trim();
      const Correo = (Estadoactual.Soportecorreo || '').trim().toLowerCase();
      const Asunto = (Estadoactual.Soporteasunto || '').trim();
      const Descripcion = (Estadoactual.Soportedescripcion || '').trim();
      if (Nombre.length < 6) { this.Cambiarestado({ Soporteerror: 'El nombre debe tener al menos 6 caracteres.' }); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(Correo)) { this.Cambiarestado({ Soporteerror: 'Ingresa un correo electrónico válido (ej. nombre@correo.com).' }); return; }
      if (Asunto.length < 6) { this.Cambiarestado({ Soporteerror: 'El asunto debe tener al menos 6 caracteres.' }); return; }
      if (Descripcion.length < 20) { this.Cambiarestado({ Soporteerror: 'La descripción debe tener al menos 20 caracteres para explicar tu solicitud.' }); return; }
      this.Cambiarestado({ Soporteocupado: true, Soporteerror: '' });
      const Resultado = await Registrarsolicitudsoporteapi({ tipo: Estadoactual.Soportetipo || 'soporte', nombre: Nombre, correo: Correo, asunto: Asunto, descripcion: Descripcion });
      if (!Resultado.ok || !Resultado.datos || !Resultado.datos.radicado) {
        this.Cambiarestado({ Soporteocupado: false, Soporteerror: Resultado.error || 'No pudimos enviar tu solicitud, intenta de nuevo.' });
        return;
      }
      this.Cambiarestado({ Soporteocupado: false, Soporteenviado: true, Soporteradicado: String(Resultado.datos.radicado), Soportefechamaxima: String(Resultado.datos.fecha_maxima || '') });
      this.Aviso('Recibimos tu solicitud. Radicado ' + Resultado.datos.radicado + '.');
    },
    Ingresoetiquetaayuda: Parejacondatos ? 'Ingreso del hogar (con pareja)' : 'Ingreso mensual',
    Topevissalariosminimos: Calculo.Topevissalarios,
    Ingresonecesariotexto: Formatoenteropesos(Calculo.Ingresonecesario),
    ...this.Entidadvalores(Calculo, Seleccion),
    Parejaactiva: Boolean(Estadoactual.Pareja),
    Parejacondatos,
    Parejasindatos: Boolean(Estadoactual.Pareja) && !Parejacondatos,
    Eliminarpareja: () => {
      this.Cambiarestado({
        Pareja: false,
        Parejanombre: '',
        Parejaingreso: 0,
        Parejadeudas: 0,
        Parejaahorro: 0,
        Parejaactividad: ''
      });
      this.Aviso('Quitamos y borramos los datos de la otra persona.');
    },
    Parejanombrecampo: Estadoactual.Parejanombre || '',
    Escribirparejanombre: (Elemento) => this.Cambiarestado({ Parejanombre: Textoseguro(Elemento.target.value, 70) }),
    Parejaingresotexto: Pagoinicial ? Formatoenteropesos(Pagoinicial) : '',
    Parejadeudastexto: Pagodeudas ? Formatoenteropesos(Pagodeudas) : '',
    Escribirparejaingreso: (Elemento) => this.Cambiarestado({ Parejaingreso: Digito(Elemento, Limitesfinancieros.Ingresomensual) }),
    Escribirparejadeudas: (Elemento) => this.Cambiarestado({ Parejadeudas: Digito(Elemento, Limitesfinancieros.Deudacuota) }),
    Parejaahorrotexto: Ahorropareja ? Formatoenteropesos(Ahorropareja) : '',
    Escribirparejaactividad: (Elemento) => this.Cambiarestado({ Parejaactividad: Textoseguro(Elemento.target.value, 60) }),
    Escribirparejaahorro: (Elemento) => this.Cambiarestado({ Parejaahorro: Digito(Elemento, Limitesfinancieros.Ahorro) }),
    Parejaactividadcampo: Estadoactual.Parejaactividad || '',
    Parejasolomillones: '$' + Formatomillones(Solo.Preciotecho) + ' M',
    Parejajuntosmillones: '$' + Formatomillones(Juntos.Preciotecho) + ' M',
    Parejasubsidioaviso: Parejacondatos && (Advertencia || Juntos.Subsidiocajasobretope) && Estadoactual.Modalidadelegida === 'vis',
    Parejasubsidiomensaje: Subsidiomensaje,
    Parejamiingreso: Formatoenteropesos(Solo.Ingresototal),
    Parejasuingreso: Formatoenteropesos(Pagoinicial),
    Parejadeudastotal: '−' + Formatoenteropesos(Juntos.Deudasmes),
    Parejaneto: Formatoenteropesos(Juntos.Neto),
    Parejasubsidioayuda: Advertencia ? 'Con tus datos: ' + Subsidiomensaje : 'Con tus datos, sumar ingresos no cambia tu subsidio.',
    Ayudapromediotitulo: Calculo.Variablepromedio > 0
      ? 'Hoy usas ' + Calculo.N + ' meses: tu ingreso es ' + Formatoenteropesos(Calculo.Ingresotitular) + (Parejacondatos ? ' (sin pareja)' : '')
      : 'No tienes ingresos variables',
    Ayudapromediodetalle: Calculo.Variablepromedio > 0
      ? 'Si ganas por ventas, turnos o comisiones, el banco no mira tu mejor mes sino el promedio de tus extractos. Con 3 meses tu ingreso sería ' + Formatoenteropesos(Ayudauno) + ' y con 6 meses ' + Formatoenteropesos(Ayudados) + '. Con 6 meses el promedio es más estable; con 3 pesan más los meses recientes.'
      : 'Con salario fijo el banco toma tu salario mensual. Si empiezas a registrar ingresos variables, aquí verás su promedio de 3 o 6 meses.',
    Ayudatopetitulo: 'Hoy usas ' + Math.round(Calculo.Tope * 100) + '%: cuota hasta ' + Formatoenteropesos(Calculo.Capacidadcuota),
    Ayudatopedetalle: 'Es la parte de tu ingreso, ya restadas las deudas, que puede ir a la cuota de vivienda. La norma permite hasta 40% en VIS (Decreto 257 de 2021) y en No VIS (Decreto 583 de 2025), pero algunos bancos aplican 30% en su estudio. Con tus datos tu techo va de $' + Formatomillones(Cuotaa.Preciotecho) + ' M con 30% a $' + Formatomillones(Cuotab.Preciotecho) + ' M con 40%.',
    Ayudaopciontitulo: Estadoactual.Modalidadelegida === 'leasing'
      ? 'Hoy usas ' + Formatoporcentaje(Calculo.Opcioncompra) + ': pago final de ' + Formatoenteropesos(Calculo.Opcioncompra * Calculo.Creditotecho)
      : 'Solo aplica si eliges leasing',
    Ayudaopciondetalle: 'En leasing el banco es dueño de la vivienda hasta el final; pagas un canon mensual y, al terminar, la opción de compra para que quede a tu nombre. Entre más alta, menor el canon y mayor el cupo: con tus datos, con 1% tu techo sería $' + Formatomillones(Cuotaplazouno.Preciotecho) + ' M y con 30% $' + Formatomillones(Cuotaplazotreinta.Preciotecho) + ' M, pero pagarías ' + Formatoenteropesos(Cuotaplazotreinta.Opcioncompra * Cuotaplazotreinta.Creditotecho) + ' al final.',
    Ayudavipdetalle: 'Si el precio de la vivienda queda en 90 salarios mínimos o menos es VIP (vivienda de interés prioritario). Aplican los mismos subsidios que en VIS y suele haber más proyectos con subsidios distritales. ' + (Calculo.Esvip ? 'Tu cupo actual está en rango VIP.' : 'Tu cupo actual está por encima del rango VIP.'),
    Mostrarpromedio: Calculo.Variablepromedio > 0,
    Promedioopciones: [3, 6].map(Numero => ({ Etiqueta: Numero + ' meses', ...Seleccion(Calculo.N === Numero), Alclic: () => this.Cambiarestado({ Promediomeses: Numero }) })),
    Flexibleopciones: [[false, '40% norma vigente'], [true, '30% conservador']].map(([Valor, Etiquetatexto]) => ({ Etiqueta: Etiquetatexto, ...Seleccion(Boolean(Estadoactual.Topeconservador) === Valor), Alclic: () => this.Cambiarestado({ Topeconservador: Valor }) })),
    Esleasing: Estadoactual.Modalidadelegida === 'leasing',
    Opcioncompraopciones: [0.01, 0.10, 0.30].map(Valor => ({ Etiqueta: Formatoporcentaje(Valor), ...Seleccion((Estadoactual.Opcioncompra ?? 0.10) === Valor), Alclic: () => this.Cambiarestado({ Opcioncompra: Valor }) })),
    Opcioncompratexto: Formatoenteropesos(Calculo.Opcioncompra * Calculo.Creditotecho),
    Opcioncompraporcentaje: Formatoporcentaje(Calculo.Opcioncompra),
    Esvip: Calculo.Esvip,
    Topeviptexto: Formatoenteropesos(Calculo.Topevip),
    Entidadopciones: Object.keys(Tasasreferencia).filter(Clave => Clave !== 'caja' || Estadoactual.Caja).map(Clave => {
      let Etiqueta = Tasasreferencia[Clave].Etiqueta;
      if (Clave === 'caja') Etiqueta = Estadoactual.Cajanombre || 'Caja';
      else if (Clave === 'fna') Etiqueta = 'FNA';
      return { Etiqueta, ...Seleccion(Calculo.Entidadclave === Clave), Alclic: () => this.Cambiarestado({ Entidad: Clave }) };
    }),
    Tasanota: Notatasa(Calculo, Estadoactual, Tasaanualtexto),
    Esuvr,
    Uvrfilas: [1, 5, 10].map(Anioitem => ({
      Etiqueta: 'Cuota año ' + Anioitem,
      Valorfila: Formatoenteropesos(Calculo.Cuotatecho * Math.pow(1 + Inflacionanual, Anioitem - 1))
    })),
    Uvrescenarios: (Calculo.Proyeccionuvr || []).map(Escenario => ({
      Etiqueta: Escenario.Etiqueta || ((Escenario.Ipc * 100).toFixed(1).replace('.', ',') + '%'),
      Ipctexto: Escenario.Ipctexto,
      Cuotainicialuvr: Formatoenteropesos(Escenario.Cuotainicialuvr),
      Cuotadiezanos: Formatoenteropesos(Escenario.Cuotadiezanos),
      Cuotaveinteanos: Formatoenteropesos(Escenario.Cuotaveinteanos),
      Tasaequivalenteporcentaje: Escenario.Tasaequivalenteporcentaje,
      Veredicto: Escenario.Ipc <= 0.0558 ? 'Más barato en UVR' : 'Más barato en Pesos'
    })),
    Puntoequilibriouvr: '5,58% anual',
    Financiargastosactivo: Boolean(Estadoactual.Financiargastos),
    Alternarfinanciargastos: () => this.Cambiarestado({ Financiargastos: !Estadoactual.Financiargastos }),
    Sisbenactivo: Estadoactual.Sisben,
    Sisbengrupoopciones: [['A1-C8', 'A1 a C8 · 30'], ['C9-D20', 'C9 a D20 · 20']].map(([Clave, Etiquetatexto]) => ({ Etiqueta: Etiquetatexto, ...Seleccion(Estadoactual.Sisbengrupo === Clave), Alclic: () => this.Cambiarestado({ Sisbengrupo: Clave }) })),
    Cierreobjetivotexto: Formatoenteropesos(Objetivoporcentaje),
    Cierrecreditotexto: '−' + Formatoenteropesos(Creditoobjetivo),
    Cierregastostexto: Formatoenteropesos(Gastosobjetivo),
    Cierretengotexto: '−' + Formatoenteropesos(Tengoobjetivo),
    Cierrefaltatexto: Formatoenteropesos(Faltaobjetivo),
    Abririnterescartera: () => this.Aviso('Próximamente: convenio de compra de cartera en MiTecho.'),
    Abririnteresafc: () => this.Aviso('Próximamente: cuentas AFC en MiTecho.'),
    Abririnteresahorro: () => this.Aviso('Próximamente: ahorro programado en MiTecho.'),
    Tienemenu: this.Pantalla === 'app' && Boolean(Estadoactual.Menu),
    Menuvisible: (this.Pantalla === 'app' && Estadoactual.Menu) ? 'flex' : 'none',
    Menufondovisible: (this.Pantalla === 'app' && Estadoactual.Menu) ? 'block' : 'none',
    Espro: false,
    Proestado: '',
    Probeneficios: [],
    Probotonuno: '',
    Probotonfondo: 'var(--c2)',
    Probotoncolor: 'var(--ik)',
    Alternarplanpro: () => {},
    Fuentes: [
      { Clave: 'Salario mínimo 2026', Valor: Formatoenteropesos(Salariominimo), Formactual: 'Decreto 1469 de 2025' },
      { Clave: 'UVT 2026', Valor: Formatoenteropesos(Unidadtributaria), Formactual: 'Resolución DIAN 000238 de 2025' },
      { Clave: 'Tope VIS en ' + Estadoactual.Ciudad, Valor: Calculo.Topevissalarios + ' SMMLV · ' + Formatoenteropesos(Calculo.Topevis), Formactual: '135 SMMLV general; 150 SMMLV en Bogotá, Medellín, Cali, Barranquilla, Bucaramanga, Cartagena, Cúcuta y sus áreas' },
      { Clave: 'Tope VIP', Valor: '90 SMMLV · ' + Formatoenteropesos(90 * Salariominimo), Formactual: 'Todo el país' },
      { Clave: 'Subsidio Caja de compensación', Valor: '30 / 20 SMMLV', Formactual: 'Hogar hasta 2 SMMLV / de 2 a 4 SMMLV, afiliado' },
      { Clave: 'Mi Casa Ya', Valor: '30 / 20 SMMLV', Formactual: 'Sisbén A1–C8 / C9–D20. Con Caja y hasta 2 SMMLV: 20 SMMLV (total 50). Sujeto a cupos' },
      { Clave: 'Tasa usada en pesos', Valor: 'VIS ' + Formatoporcentaje(Pesosvis) + ' · No VIS ' + Formatoporcentaje(Pesosnovis), Formactual: Fuentetasas },
      { Clave: 'Cuota máxima', Valor: '40% del ingreso', Formactual: 'VIS (Decreto 257 de 2021) y No VIS (Decreto 583 de 2025); modo conservador 30%' },
      { Clave: 'Financiación', Valor: 'No VIS 70% · VIS 80%', Formactual: 'Leasing habitacional hasta 80%–90%; opción de compra 1%–30%' },
      { Clave: 'IPC para proyección UVR', Valor: Formatoporcentaje(Inflacionanual), Formactual: 'Variación certificada por el DANE para la UVT 2026' },
      { Clave: 'Crédito con Caja de compensación', Valor: 'Desde 0,9% m.v.', Formactual: 'Líneas para afiliados, en pesos, plazo hasta 20 años; tasa según perfil' }
    ]
  };
}
