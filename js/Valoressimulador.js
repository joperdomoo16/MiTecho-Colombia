// Preparación de los cálculos del simulador de crédito, nivel de deudas, cuotas y proyectos de vivienda

function Generarvaloressimulador(Calculo, Configuracion, Seleccion, Fichaseleccion) {
  const Estadoactual = this.Estadocomponente;
  // Las cuentas guardadas antes de existir los dos botones usaban el promedio o el valor manual
  const Fuenteactual = Estadoactual.Fuenteingreso || (Estadoactual.Usarautomatico ? 'promedio' : 'manual');
  const Deudafichas = Estadoactual.Deudas.map(Dato => ({
    Etiqueta: Dato.Corto + ' ' + Formatoenteropesos(Dato.Cuota),
    Activa: Boolean(Dato.Activa), Clase: Dato.Activa ? 'is-activa' : 'is-quitada',
    Alclic: () => this.Fijardeuda(Dato.id, { Activa: !Dato.Activa })
  }));

  const Topevis = Consultartopevis(Estadoactual.Ciudad) * Salariominimo;
  const Tasaopciones = [['pesos', 'Pesos fijos'], ['uvr', 'UVR']].map(([Clave, Etiquetatexto]) => ({ Etiqueta: Etiquetatexto, ...Seleccion(Estadoactual.Tasatipo === Clave), Alclic: () => this.Cambiarestado({ Tasatipo: Clave }) }));
  const Plazoopciones = [15, 20, 30].map(Numero => ({ Etiqueta: Numero + ' años', ...Seleccion(Estadoactual.Plazoelegido === Numero), Alclic: () => this.Cambiarestado({ Plazoelegido: Numero }) }));
  const Cuota = Calculo.Cuotatecho;
  const Formactual = Estadoactual.Formulario;
  const Formularioganancia = Formactual.Monto / Calculo.N * Calculo.Tope * Calculo.Factor / Configuracion.Financiacion;

  // Simular con pareja o familia: ver 1 video corto para desbloquear la función
  const Alternarpareja = async () => {
    if (!Estadoactual.Desbloqueadopareja) {
      this.Aviso('Mira 1 video corto para desbloquear la simulación en pareja…');
      const Resultado = typeof Verrecompensa === 'function' ? await Verrecompensa() : { ok: true };
      if (Resultado && Resultado.ok) {
        this.Cambiarestado({ Desbloqueadopareja: true, Pareja: true });
        this.Aviso('¡Simulación en pareja desbloqueada!');
      } else {
        this.Aviso(Resultado && Resultado.error ? Resultado.error : 'No se pudo cargar el video. Intenta de nuevo.');
      }
      return;
    }
    this.Cambiarestado({ Pareja: !Estadoactual.Pareja });
  };

  const Salariosminimos = Calculo.Salariosminimos;
  const Potencialsalarios = Estadoactual.Caja ? 0 : Salariosminimos <= 2 ? 30 : Salariosminimos <= 4 ? 20 : 0;
  const Subsidiosalarios = Calculo.Subsidiocajasalarios + Calculo.Subsidiomicasayasalarios;
  // Con Sisbén y sin Caja el motor sí suma Mi Casa Ya, así que el mensaje lo cuenta igual que el techo
  const Perfilsubsidiomensaje = Subsidiosalarios ? 'Te corresponden ' + Subsidiosalarios + ' SMMLV (' + Formatoenteropesos(Subsidiosalarios * Salariominimo) + ')' + (Calculo.Subsidiomicasayasalarios ? (Estadoactual.Caja ? ' sumando Mi Casa Ya' : ' de Mi Casa Ya') : '') + ' para vivienda VIS.'
    : !Estadoactual.Caja ? (Potencialsalarios ? 'No estás afiliado. Si te afilias, te corresponderían ' + Potencialsalarios + ' SMMLV (' + Formatoenteropesos(Potencialsalarios * Salariominimo) + ') para vivienda VIS.' : 'No estás afiliado. Con tus ingresos tampoco aplicarías a subsidio de Caja.')
    : Salariosminimos > 4 ? 'Con ingresos mayores a 4 SMMLV no aplicas a subsidio de Caja.' : 'Tu techo pasa el tope VIS, y una vivienda No VIS no lleva subsidio.';
  const Cajalista = Subsidiosalarios > 0;
  // El cierre muestra el subsidio que de verdad se usa en el techo: solo paga cuota inicial, no la escrituración
  const Subsidiocajausado = Calculo.Techosobretopevis ? 0 : Math.min(Calculo.Subsidiocajamonto, Calculo.Subsidiotecho);
  const Subsidiomicasayausado = Calculo.Techosobretopevis ? 0 : Math.max(0, Calculo.Subsidiotecho - Subsidiocajausado);
  // El perfil le explica a quien no tiene contrato cómo afiliarse a una Caja si gana hasta 4 SMMLV
  const Mostrarafiliacion = !Estadoactual.Caja && Estadoactual.Tipo !== 'fijo' && Salariosminimos <= 4;

  return {
    Deudafichas,
    Topevis,
    Tasaopciones,
    Plazoopciones,
    Cuota,
    Formactual,
    Formularioganancia,
    Ingresootro: Formactual.Fuente === 'Otros',
    Ingresonombre: Formactual.Nombre || '',
    Escribiringresonombre: (Elemento) => this.Cambiarestado({ Formulario: { ...Formactual, Nombre: Textoseguro(Elemento.target.value, 60) } }),
    Ingresofijootro: Estadoactual.Formularioingresofijo.Tipo === 'Otro ingreso fijo',
    Ingresofijonombrecampo: Estadoactual.Formularioingresofijo.Nombre || '',
    Escribiringresofijonombre: (Elemento) => this.Cambiarestado({ Formularioingresofijo: { ...Estadoactual.Formularioingresofijo, Nombre: Textoseguro(Elemento.target.value, 60) } }),
    Gastootro: Estadoactual.Formulariogasto.Categoria === 'Otros',
    Gastonombre: Estadoactual.Formulariogasto.Nombre || '',
    Escribirgastonombre: (Elemento) => this.Cambiarestado({ Formulariogasto: { ...Estadoactual.Formulariogasto, Nombre: Textoseguro(Elemento.target.value, 60) } }),
    Formdeudaotro: Estadoactual.Formulariodeuda.Tipo === 'Otro egreso fijo',
    Formdeudanombre: Estadoactual.Formulariodeuda.Nombre || '',
    Escribirdeudanombre: (Elemento) => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Nombre: Textoseguro(Elemento.target.value, 60) } }),
    Subsidiotexto: Formatoenteropesos(Calculo.Subsidio),
    Ahorrotexto: Formatoenteropesos(Calculo.Ahorrohogar),
    Salariosminimostexto: Calculo.Salariosminimos.toLocaleString('es-CO', { maximumFractionDigits: 1 }),
    Creditousadotexto: Formatoenteropesos(Calculo.Creditotecho),
    Tienesubsidiocaja: Subsidiocajausado > 0,
    Tienesubsidiomicasaya: Subsidiomicasayausado > 0,
    Subsidiocajasalarios: Math.round(Calculo.Subsidiocajamonto / Salariominimo),
    Subsidiocajatexto: Formatoenteropesos(Subsidiocajausado),
    Subsidiomicasayatexto: Formatoenteropesos(Subsidiomicasayausado),
    Subsidiomicasayasalariostexto: String(Math.round(Calculo.Subsidiomicasayamonto / Salariominimo)),
    Faltatexto: Calculo.Faltatecho > 0 ? Formatoenteropesos(Calculo.Faltatecho) : '✓',
    Simuladorsubsidiovisible: Estadoactual.Modalidadelegida === 'vis',
    // El orden importa: primero lo que de verdad entra al techo, después por qué no entra nada
    Simuladorsubsidiomensaje: Calculo.Subsidio > 0 && Calculo.Techosobretopevis ? 'Tu techo pasa el tope VIS: a ese precio la vivienda es No VIS y no sumamos subsidio. Si buscas VIS, el subsidio sí aplica.'
      : !Estadoactual.Caja && !Calculo.Subsidio ? 'No tienes Caja de compensación registrada, así que no sumamos subsidio. Actívala en tu perfil si estás afiliado.' : Calculo.Subsidio > 0 && Calculo.Subsidiotecho < Calculo.Subsidio - 1 ? 'Tu subsidio es de ' + Formatoenteropesos(Calculo.Subsidio) + ' (' + (Calculo.Subsidiocajasalarios + Calculo.Subsidiomicasayasalarios) + ' SMMLV), pero solo usamos ' + Formatoenteropesos(Calculo.Subsidiotecho) + ', lo que pide tu cuota inicial. El subsidio se gira al vendedor y no paga la escrituración.'
      : Calculo.Subsidio > 0 ? 'Sumamos ' + Formatoenteropesos(Calculo.Subsidio) + ' de subsidio (' + (Calculo.Subsidiocajasalarios + Calculo.Subsidiomicasayasalarios) + ' SMMLV' + (Calculo.Subsidiomicasayasalarios ? ', con Mi Casa Ya' : '') + ') a tu cuota inicial.' : 'Con ingresos de ' + Calculo.Salariosminimos.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' SMMLV no aplicas a subsidio de Caja (tope: 4 SMMLV).',
    Perfilsubsidiomensaje,
    Perfilsubsidiofondo: Cajalista ? 'var(--ac)' : 'var(--c2)',
    Perfilsubsidiocolor: Cajalista ? 'var(--oa)' : 'var(--ik)',
    Perfilsubsidioantetitulo: Cajalista ? 'rgba(11,12,10,.65)' : 'var(--fa)',
    Mostrarafiliacion,
    Afiliacionmensaje: 'Como independiente puedes afiliarte de forma voluntaria a una Caja de compensación aportando el 2% de tus ingresos (con el 0,6% no aplica el subsidio de vivienda). En Compensar, por ejemplo, piden 12 meses de aportes antes de postularte. Así podrías postularte a ' + Formatoenteropesos(Potencialsalarios * Salariominimo) + ' de subsidio para vivienda VIS.',
    Preciomillones: '$' + Formatomillones(Calculo.Preciotecho) + ' M',
    Ingresotexto: Formatoenteropesos(Calculo.Ingresototal),
    Topevistexto: Formatoenteropesos(Topevis),
    Sensibilidadcapacidad: Formatoenteropesos(100000 * Calculo.Tope),
    Sensibilidadcredito: Formatoenteropesos(100000 * Calculo.Tope * Calculo.Factor),
    Topeporcentaje: Math.round(Calculo.Tope * 100) + '%',
    Ingresoformato: Formatonumero(Calculo.Ingresotitular),
    Ingresovalor: Calculo.Ingresotitular,
    // Mover la barra pasa a ingreso manual; los dos botones eligen el promedio o lo declarado en el perfil financiero
    Cambiaringreso: (Elemento) => this.Cambiarestado({ Fuenteingreso: 'manual', Usarautomatico: false, Ingresomanual: Acotarnumero(Elemento.target.value, 0, Limitesfinancieros.IngresoMensual, 0) }),
    Ingresofuentes: [['promedio', 'Mi promedio'], ['perfil', 'Mi perfil']].map(([Clave, Etiqueta]) => ({
      Etiqueta, ...Seleccion(Fuenteactual === Clave), Activa: Fuenteactual === Clave ? 'true' : 'false',
      Alclic: () => this.Cambiarestado({ Fuenteingreso: Clave, Usarautomatico: Clave === 'promedio' })
    })),
    Alternarpareja,
    ...Valoresresultadosimulador.call(this, Calculo, Seleccion, Fuenteactual, Alternarpareja),
    Visaviso: Calculo.Topado || Calculo.Techosobretopevis,
    Vistopadafila: Calculo.Topado,
    Preciosintopetexto: Formatoenteropesos(Calculo.Creditoporcapacidad / Configuracion.Financiacion + (Estadoactual.Financiargastos ? Calculo.Gastosescrituracion : 0)),
    Financiacionetiquetaultima: Calculo.Topado ? 'TOPE VIS (' + Consultartopevis(Estadoactual.Ciudad) + ' SMMLV)' : '÷ ' + Math.round(Calculo.Financiaciontecho * 100) + '% FINANCIADO' + (Calculo.Techosobretopevis ? ' · NO VIS' : ''),
    Visavisomensaje: Calculo.Techosobretopevis ? Avisotopevis(Calculo, Estadoactual.Ciudad) : 'Tu cupo supera el tope VIS en ' + Estadoactual.Ciudad + ' (' + Consultartopevis(Estadoactual.Ciudad) + ' SMMLV = ' + Formatoenteropesos(Topevis) + '). Te mostramos viviendas VIS hasta ese valor; por encima serían No VIS y sin subsidio.',
    Topeetiqueta: '× ' + Math.round(Calculo.Tope * 100) + '% CAPACIDAD',
    Capacidadcuotatexto: Formatoenteropesos(Calculo.Capacidadcuota),
    Creditocadenatexto: Formatoenteropesos(Calculo.Creditoporcapacidad),
    Financiacionetiqueta: '÷ ' + Math.round(Configuracion.Financiacion * 100) + '% VIVIENDA',
    Preciotexto: Formatoenteropesos(Calculo.Preciotecho),
    Cuotamensual: Formatoenteropesos(Cuota),
    Bloqueado: !Estadoactual.Desbloqueado,
    Desbloquearetiqueta: Estadoactual.Desbloqueando ? 'Cargando el video…' : 'Ver un video corto para abrirlo',
    // El comparador se abre solo si la persona ve completo el video con recompensa de AdMob
    Desbloquear: async () => {
      if (Estadoactual.Desbloqueando) return;
      this.Cambiarestado({ Desbloqueando: true });
      const Resultado = typeof Verrecompensa === 'function' ? await Verrecompensa() : { ok: true };
      this.Cambiarestado({ Desbloqueado: Boolean(Resultado.ok), Desbloqueando: false });
      if (!Resultado.ok) this.Aviso(Resultado.error);
    },
    Cuotainicialtitulo: 'Cuota inicial ' + Math.round((1 - Configuracion.Financiacion) * 100) + '% + gastos',
    Cuotainicialtexto: Formatoenteropesos(Calculo.Cuotainicialtecho),
    Gastosetiqueta: Configuracion.Glosario,
    Gastosetiquetacierre: Estadoactual.Modalidadelegida === 'leasing' ? 'Los asume el leasing' : Estadoactual.Financiargastos ? 'Van dentro del préstamo' : 'Para poner la vivienda a tu nombre (' + Math.round((Calculo.Techosobretopevis ? Modalidadesvivienda.novis : Configuracion).Gastos * 100) + '% del precio)',
    Gastostexto: Formatoenteropesos(Calculo.Gastostecho),
    // El botón Registrar abre primero las cuatro opciones; las demás entradas van directo a su formulario
    Abrirhoja: () => this.Cambiarestado({ Hoja: true, Hojamenu: true, Hojafecha: null, Deudaeditandoid: null, Formularioerror: '' }),
    Abrirhojadeuda: () => this.Cambiarestado({ Hoja: true, Hojamenu: false, Hojafecha: null, Hojatipo: 'deuda', Hojafrecuencia: 'fijo', Deudaeditandoid: null, Formulariodeuda: { Tipo: 'Tarjeta de crédito', Cuota: 0, Saldo: 0, Entidad: '', Nombre: '' }, Formularioerror: '' }),
    Abriringresofijo: () => this.Cambiarestado({ Hoja: true, Hojamenu: false, Hojafecha: null, Hojatipo: 'ingreso', Hojafrecuencia: 'fijo', Deudaeditandoid: null, Formularioerror: '' }),
    Hojaegresofijo: Estadoactual.Hojatipo === 'deuda' && Estadoactual.Hojafrecuencia === 'fijo',
    Hojaingresodia: Estadoactual.Hojatipo !== 'deuda' && Estadoactual.Hojafrecuencia !== 'fijo',
    Hojaingresofijo: Estadoactual.Hojatipo !== 'deuda' && Estadoactual.Hojafrecuencia === 'fijo',
    Hojaegresodia: Estadoactual.Hojatipo === 'deuda' && Estadoactual.Hojafrecuencia !== 'fijo',
    Sindeudas: Estadoactual.Deudas.length === 0,
    Deudatipofichas: Tiposdeuda.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Estadoactual.Formulariodeuda.Tipo === Opcion), Alclic: () => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Tipo: Opcion } }) })),
    Formdeudacuotatexto: Estadoactual.Formulariodeuda.Cuota ? Formatonumero(Estadoactual.Formulariodeuda.Cuota) : '',
    Formdeudasaldotexto: Estadoactual.Formulariodeuda.Saldo ? Formatoenteropesos(Estadoactual.Formulariodeuda.Saldo) : '',
    Formdeudaentidad: Estadoactual.Formulariodeuda.Entidad,
    Escribirdeudacuota: (Elemento) => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Cuota: Limpiardigitos(Elemento.target.value, Limitesfinancieros.DeudaCuota) }, Formularioerror: '' }),
    Escribirdeudasaldo: (Elemento) => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Saldo: Limpiardigitos(Elemento.target.value, Limitesfinancieros.DeudaSaldo) } }),
    Escribirdeudaentidad: (Elemento) => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Entidad: Textoseguro(Elemento.target.value, 60) } }),
    Formdeudapista: Estadoactual.Formulariodeuda.Cuota ? 'Esta cuota le resta $' + Formatomillones(Estadoactual.Formulariodeuda.Cuota * Calculo.Tope * Calculo.Factor / Configuracion.Financiacion) + ' M a tu vivienda. Podrás apagarla en Plan para ver cuánto liberas.' : 'Incluye solo cuotas fijas que aparecen en tu historial crediticio o que pagas cada mes.',
    Guardardeudaetiqueta: Estadoactual.Deudaeditandoid ? (Estadoactual.Formulariodeuda.Cuota ? 'Guardar cambios · ' + Formatoenteropesos(Estadoactual.Formulariodeuda.Cuota) + '/mes' : 'Guardar cambios') : (Estadoactual.Formulariodeuda.Cuota ? 'Guardar · ' + Formatoenteropesos(Estadoactual.Formulariodeuda.Cuota) + '/mes' : 'Guardar deuda'),
    Formdeudaeditando: !!Estadoactual.Deudaeditandoid,
    Eliminardeudaactual: () => { if (Estadoactual.Deudaeditandoid) this.Eliminardeuda(Estadoactual.Deudaeditandoid); },
    Guardardeuda: () => {
      const Formdeuda = Estadoactual.Formulariodeuda;
      if (Formdeuda.Cuota < 1000) { this.Cambiarestado({ Formularioerror: 'Escribe la cuota mensual.' }); return; }
      if (!Estadoactual.Deudaeditandoid && (Estadoactual.Deudas || []).length >= Limitesfinancieros.MaxDeudas) { this.Cambiarestado({ Formularioerror: 'Puedes registrar máximo ' + Limitesfinancieros.MaxDeudas + ' deudas.' }); return; }
      const Base = (Formdeuda.Tipo === 'Otro egreso fijo' && (Formdeuda.Nombre || '').trim()) || Formdeuda.Tipo;
      const Nombreitem = Formdeuda.Entidad ? Base + ' · ' + Formdeuda.Entidad : Base;
      if (Estadoactual.Deudaeditandoid) {
        const Ideditar = Estadoactual.Deudaeditandoid;
        this.Cambiarestado(Estadoprevio => ({
          Deudas: Estadoprevio.Deudas.map(Dato => Dato.id === Ideditar ? { ...Dato, Nombreitem, Corto: Nombrescortosdeuda[Formdeuda.Tipo] || 'Deuda', Cuota: Formdeuda.Cuota, Saldo: Formdeuda.Saldo, Entidad: Formdeuda.Entidad } : Dato),
          Hoja: false,
          Deudaeditandoid: null,
          Formulariodeuda: { Tipo: Formdeuda.Tipo, Cuota: 0, Saldo: 0, Entidad: '', Nombre: '' }
        }));
        this.Aviso('Deuda “' + Nombreitem + '” actualizada: ' + Formatoenteropesos(Formdeuda.Cuota) + '/mes.');
      } else {
        this.Cambiarestado(Estadoprevio => ({
          Deudas: [...Estadoprevio.Deudas, { id: 'd' + Date.now(), Nombreitem, Corto: Nombrescortosdeuda[Formdeuda.Tipo] || 'Deuda', Cuota: Formdeuda.Cuota, Saldo: Formdeuda.Saldo, Entidad: Formdeuda.Entidad, Activa: true, Pagada: false }],
          Hoja: false,
          Formulariodeuda: { Tipo: Formdeuda.Tipo, Cuota: 0, Saldo: 0, Entidad: '', Nombre: '' }
        }));
        this.Aviso(Nombreitem + ' agregada: −' + Formatoenteropesos(Formdeuda.Cuota) + '/mes en tu cálculo.');
      }
    },
    Cerrarhoja: () => this.Cambiarestado({ Hoja: false, Hojafecha: null, Deudaeditandoid: null }),
    Formulariomontotexto: Formactual.Monto ? Formatonumero(Formactual.Monto) : '',
    Escribirmonto: (Elemento) => this.Cambiarestado({ Formulario: { ...Formactual, Monto: Limpiardigitos(Elemento.target.value, Limitesfinancieros.MovimientoDiario) }, Formularioerror: '' }),
    Fichasrapidas: [50000, 100000, 250000, 500000].map(Valor => ({ Etiqueta: '+' + Formatoenteropesos(Valor), Alclic: () => this.Cambiarestado({ Formulario: { ...Formactual, Monto: Math.min(Limitesfinancieros.MovimientoDiario, Formactual.Monto + Valor) }, Formularioerror: '' }) })),
    Fuentefichas: Fuentesingreso.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Formactual.Fuente === Opcion), Alclic: () => this.Cambiarestado({ Formulario: { ...Formactual, Fuente: Opcion } }) })),
    Mediofichas: Mediospago.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Formactual.Medio === Opcion), Alclic: () => this.Cambiarestado({ Formulario: { ...Formactual, Medio: Opcion } }) })),
    Formularioerror: Estadoactual.Formularioerror,
    Guardaretiqueta: Formactual.Monto ? 'Guardar · ' + Formatoenteropesos(Formactual.Monto) : 'Guardar ingreso',
    Guardarregistro: () => {
      if (Formactual.Monto < 1000) { this.Cambiarestado({ Formularioerror: 'Escribe un monto o toca una cifra rápida.' }); return; }
      const Dato = new Date(), Hora = String(Dato.getHours()).padStart(2, '0') + ':' + String(Dato.getMinutes()).padStart(2, '0');
      // Desde Movimientos se puede anotar en un día anterior de la semana; si no, va con la fecha de hoy
      const Fecha = Estadoactual.Hojafecha || Hoyregistro();
      this.Cambiarestado(Estadoprevio => ({ Diasregistrados: Marcardiaregistro(Estadoprevio.Diasregistrados, Fecha), Registros: [...Estadoprevio.Registros, { Fecha, Concepto: (Formactual.Fuente === 'Otros' && (Formactual.Nombre || '').trim()) || Formactual.Fuente, Fuente: Formactual.Fuente, Medio: Formactual.Medio, Monto: Formactual.Monto, Hora }], Hoja: false, Hojafecha: null, ...(Estadoactual.Hojafecha ? {} : { Diaseleccionado: 6 }), Formulario: { ...Estadoprevio.Formulario, Monto: 0, Nombre: '' } }));
      this.Aviso('+' + Formatoenteropesos(Formactual.Monto) + ' registrados. Cuentan para tu promedio de ingresos cuando termine el mes.');
    }
  };
}

// Lo que suman Simular y Tu resultado en el diseño nuevo: quién compra, opciones avanzadas, cuota, cierre y el reporte
function Valoresresultadosimulador(Calculo, Seleccion, Fuenteactual, Alternarpareja) {
  const Estadoactual = this.Estadocomponente, Cuota = Calculo.Cuotatecho, Plazo = Calculo.Plazo || Estadoactual.Plazoelegido;
  const Esleasing = Estadoactual.Modalidadelegida === 'leasing';
  const Esuvr = Estadoactual.Tasatipo === 'uvr' && !Esleasing && Calculo.Entidadclave !== 'caja';
  const Faltanpdf = Math.max(1, 3 - Number(Estadoactual.Anunciospdf || 0));
  return {
    Simquien: [[false, 'Solo yo'], [true, 'Con alguien más']].map(([Valor, Etiqueta]) => ({ Etiqueta, ...Seleccion(Boolean(Estadoactual.Pareja) === Valor), Alclic: () => { if (Boolean(Estadoactual.Pareja) !== Valor) Alternarpareja(); } })),
    Parejainactiva: !Estadoactual.Pareja,
    Simavanzado: Boolean(Estadoactual.Simuladoravanzado),
    Simavanzadoclase: Estadoactual.Simuladoravanzado ? 'is-abierta' : '',
    Simavanzadotexto: Esleasing ? 'Cuota máxima, promedio de ingresos y opción de compra' : 'Cuota máxima y promedio de tus ingresos',
    Alternarsimavanzado: () => this.Cambiarestado({ Simuladoravanzado: !Estadoactual.Simuladoravanzado }),
    Simingresonota: Fuenteactual === 'perfil' ? 'Es lo que pusiste en tu perfil financiero. Muévelo para probar.'
      : Fuenteactual === 'promedio' ? (Calculo.Variablepromedio > 0 ? 'Es tu ingreso fijo más el promedio de los últimos ' + Calculo.N + ' meses. Muévelo para probar.' : 'Es tu promedio de ingresos. Muévelo para probar.')
      : 'Es el valor que elegiste con la barra. Toca un botón para volver a tu promedio o a tu perfil.',
    Simcuotatitulo: Esleasing ? 'Tu canon mensual' : Esuvr ? 'Tu primera cuota' : 'Tu cuota mensual',
    Simplazotexto: 'al mes, durante ' + Plazo + ' años',
    Simplazochip: 'A ' + Plazo + ' años',
    Simmonedachip: Esleasing ? 'Leasing habitacional' : Esuvr ? 'Crédito en UVR' : 'Crédito en pesos',
    Simtasatexto: Formatoporcentaje(Calculo.Tasaanual) + (Esuvr ? ' + UVR' : ' E.A.'),
    // En UVR y en leasing el total no es la cuota por los meses: la cuota sube o queda el pago final
    Simtotalvisible: !Esuvr && !Esleasing && Cuota > 0,
    Simtotalpagar: '$' + Formatomillones(Cuota * Plazo * 12) + ' M',
    Simcomparar: Boolean(Estadoactual.Desbloqueado),
    Abrirtasassimulador: () => this.Cambiarestado({ Panel: 'tasas' }),
    Simfaltarotulo: Calculo.Faltatecho > 0 ? 'Te falta' : 'Cuota inicial cubierta',
    Simfaltaclase: Calculo.Faltatecho > 0 ? 'is-alerta' : '',
    Financiargastosclase: Estadoactual.Financiargastos ? 'is-activo' : '',
    Simpdfvisible: !Estadoactual.Desbloqueadopdf,
    Simpdfnota: 'Gratis: antes verás ' + (Faltanpdf === 1 ? '1 video corto.' : Faltanpdf + ' videos cortos.')
  };
}
