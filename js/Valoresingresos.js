// Preparación de los registros de ingresos y gastos: día, semanas del mes, meses y consignaciones.
// Todo sale de lo que la persona registró, con su fecha; si no hay registros, las vistas quedan vacías

function Generarvaloresingresos(Calculo, Configuracion, Seleccion, Fichaseleccion) {
  const Estadoactual = this.Estadocomponente;
  const Hoy = Hoyregistro(), Mesactual = Hoy.slice(0, 7);
  const Esgasto = (Estadoactual.Registrotipo || 'ing') === 'egr';
  const Dias = Ultimosdias(Hoy);
  const Diaactual = (typeof Estadoactual.Diaseleccionado === 'number' && Estadoactual.Diaseleccionado >= 0 && Estadoactual.Diaseleccionado <= 6) ? Estadoactual.Diaseleccionado : 6;
  const Fechaelegida = Dias[Diaactual].Fecha, Eshoy = Fechaelegida === Hoy;
  // Cada registro conserva su posición en la lista guardada, para poder consignarlo después
  const Ingresosconindice = Estadoactual.Registros.map((Elemento, Indice) => ({ Elemento, Indice }));
  const Ingresosdia = Ingresosconindice.filter(Item => Fechaderegistro(Item.Elemento) === Fechaelegida);
  const Gastosdia = Registrosdeldia(Estadoactual.Egresosregistrados, Fechaelegida);
  const Seleccionmonto = Sumamontos(Ingresosdia.map(Item => Item.Elemento)), Gastoseleccionado = Sumamontos(Gastosdia);
  const Gastosmes = Sumamontos(Registrosdelmes(Estadoactual.Egresosregistrados, Mesactual));
  const Variablemes = Sumamontos(Registrosdelmes(Estadoactual.Registros, Mesactual));
  const Fijoefectivo = Estadoactual.Tipo === 'variable' ? 0 : Estadoactual.Fijo;
  const Fijostotal = Fijoefectivo + Estadoactual.Ingresosfijosextra.reduce((Acumulado, Fila) => Acumulado + Fila.Monto, 0);

  const Semanadias = Dias.map((Dia, Indice) => {
    const Activo = Diaactual === Indice;
    const Monto = Sumamontos(Registrosdeldia(Esgasto ? Estadoactual.Egresosregistrados : Estadoactual.Registros, Dia.Fecha));
    return {
      Diasemana: Dia.Letra, Numerodia: Dia.Numero,
      Fondo: Activo ? 'var(--ik)' : 'transparent',
      Borde: Activo ? 'var(--ik)' : 'var(--ln)',
      Color: Activo ? 'var(--bg)' : 'var(--ik)',
      Subtexto: Activo ? 'var(--bg)' : 'var(--mu)',
      Punto: Monto ? (Activo ? 'var(--ac)' : 'var(--at)') : 'transparent',
      Alclic: () => this.Cambiarestado({ Diaseleccionado: Indice })
    };
  });

  const Abrirconsignacion = (Destinoconsignacion) => this.Cambiarestado({ Consignacion: { target: Destinoconsignacion, Medio: 'Nequi / DaviPlata' } });
  const Filade = (Elemento, Indice) => {
    const Efectivo = Elemento.Medio === 'Efectivo';
    return {
      Inicial: Elemento.Fuente.slice(0, 2).toUpperCase(),
      Concepto: Elemento.Concepto,
      Meta: Elemento.Consignado ? Elemento.Fuente + ' · Efectivo → ' + Elemento.Medio + ' · ' + Elemento.Hora : Elemento.Fuente + ' · ' + Elemento.Medio + ' · ' + Elemento.Hora,
      Monto: Formatoenteropesos(Elemento.Monto),
      Efectivo,
      Hecho: !!Elemento.Consignado,
      Sinclic: !Efectivo,
      Cursor: Efectivo ? 'pointer' : 'default',
      Filafondo: Efectivo ? 'rgba(255,106,43,.08)' : 'transparent',
      Alclic: Efectivo ? () => Abrirconsignacion(Indice) : undefined
    };
  };
  const Filaanterior = Eshoy && Estadoactual.Efectivoanterior > 0 ? [{ Inicial: 'EF', Concepto: 'Efectivo de días anteriores', Meta: 'Sin consignar · Efectivo', Monto: Formatoenteropesos(Estadoactual.Efectivoanterior), Efectivo: true, Hecho: false, Sinclic: false, Cursor: 'pointer', Filafondo: 'rgba(255,106,43,.08)', Alclic: () => Abrirconsignacion('old') }] : [];
  const Diaregistros = [...Ingresosdia.map(Item => Filade(Item.Elemento, Item.Indice)).reverse(), ...Filaanterior];
  const Metaporcentaje = Seleccionmonto / Math.max(1, Calculo.Metadiaria);

  // Semanas del mes en curso y los últimos 6 meses, con lo registrado de verdad
  const Semana = Semanasdelmes(Estadoactual.Registros, Hoy);
  const Semanaactual = Math.min(4, Math.floor((Number(Hoy.slice(8, 10)) - 1) / 7));
  const Anchomaximo = Math.max(1, ...Semana);
  const Semanabarras = Semana.map((Valor, Indice) => ({ Valorcampo: Valor ? Formatonumero(Valor / 1000) + ' mil' : '—', Etiqueta: 'S' + (Indice + 1), Altura: Estadoactual.Barrasvisibles && Valor ? Math.max(8, Valor / Anchomaximo * 78) + '%' : '0%', Fondo: Indice === Semanaactual ? 'var(--ac)' : 'var(--c2)' }));
  const Mesesinfo = Ultimosmeses(7, Hoy);
  const Meses = Calculo.Historial.slice(1).map((Valor, Clave) => [Mesesinfo[Clave + 1].Etiqueta, (Valor || 0) + Calculo.Fijopromedio]);
  const Promediotres = Calculo.Fijopromedio + Promediovariable(Calculo.Historial, 3, 0, Estadoactual);
  const Promedioseis = Calculo.Fijopromedio + Promediovariable(Calculo.Historial, 6, 0, Estadoactual);
  const Mesesusados = Mesesconregistros(Calculo.Historial, Calculo.N);
  const Mesmaximo = Math.max(1, ...Meses.map(Mesdato => Mesdato[1])) * 1.15;
  const Mesbarras = Meses.map(([Etiquetatexto, Valor], Indice) => ({ Etiqueta: Etiquetatexto, Altura: Estadoactual.Barrasvisibles ? (Valor / Mesmaximo * 100) + '%' : '0%', Fondo: Indice === Meses.length - 1 ? 'var(--ac)' : Indice >= 3 ? 'var(--ik)' : 'var(--c2)' }));

  const Consignacionactual = Estadoactual.Consignacion;
  const Esanterior = Consignacionactual && Consignacionactual.target === 'old';
  const Entidad = Consignacionactual && !Esanterior ? Estadoactual.Registros[Consignacionactual.target] : null;
  const Consignacionmonto = Esanterior ? Estadoactual.Efectivoanterior : Entidad ? Entidad.Monto : 0;

  const Tiposingresofijo = ['Salario', 'Pensión', 'Arriendo que recibo', 'Honorarios fijos', 'Otro ingreso fijo'];
  const Categoriasgasto = ['Transporte', 'Alimentación', 'Insumos del negocio', 'Servicios públicos', 'Salud', 'Otros'];
  const Gastosmediospago = ['Efectivo', 'Nequi / DaviPlata', 'Tarjeta débito'];
  const Ingresofijoform = Estadoactual.Formularioingresofijo, Gasto = Estadoactual.Formulariogasto;
  const Digito = (Elemento) => +(Elemento.target.value.replace(/\D/g, '') || 0);
  const Hora = () => {
    const Dato = new Date();
    return String(Dato.getHours()).padStart(2, '0') + ':' + String(Dato.getMinutes()).padStart(2, '0');
  };
  const Ingresototal = (Estadoactual.Registrotipo || 'ing') === 'ing';
  const Egresoregistros = Gastosdia.slice().reverse().map(Elemento => ({ Inicial: Elemento.Categoria.slice(0, 2).toUpperCase(), Concepto: Elemento.Nombre || Elemento.Categoria, Meta: (Elemento.Nombre ? Elemento.Categoria + ' · ' : '') + Elemento.Medio + ' · ' + Elemento.Hora, Monto: '−' + Formatoenteropesos(Elemento.Monto) }));
  const Deudasuma = Estadoactual.Deudas.filter(Dato => Dato.Activa).reduce((Acumulado, Dato) => Acumulado + Dato.Cuota, 0);
  const Categoriabase = { 'Transporte': 0, 'Alimentación': 0, 'Insumos del negocio': 0, 'Servicios públicos': 0, 'Salud': 0, 'Otros': 0 };
  Registrosdelmes(Estadoactual.Egresosregistrados, Mesactual).forEach(Elemento => { Categoriabase[Elemento.Categoria] = (Categoriabase[Elemento.Categoria] || 0) + Elemento.Monto; });
  const Categoriamaxima = Math.max(1, ...Object.values(Categoriabase));

  return {
    Fijostotal,
    Semana,
    Gastosmes,
    Fijotexto: Formatoenteropesos(Fijostotal),
    Gastosmestexto: Formatoenteropesos(Gastosmes),
    Tipoetiqueta: { fijo: 'Fijo', variable: 'Variable', mixto: 'Mixto' }[Estadoactual.Tipo],
    Tipominusculas: { fijo: 'fijo', variable: 'variable', mixto: 'mixto' }[Estadoactual.Tipo],
    Semanadias,
    Diaregistros,
    Diatitulo: Eshoy ? 'Hoy llevas' : 'Ese día registraste',
    Diatotal: Formatonumero(Seleccionmonto),
    Diametaporcentaje: Math.round(Metaporcentaje * 100) + '%',
    Diametaancho: Math.min(100, Metaporcentaje * 100) + '%',
    Diametamensaje: Metaporcentaje >= 1 ? 'Meta cumplida. Todo lo extra suma a tu cupo.' : 'Te faltan ' + Formatoenteropesos(Math.max(0, Calculo.Metadiaria - Seleccionmonto)) + ' para el ingreso que necesita tu vivienda.',
    Registroscantidad: Diaregistros.length + (Diaregistros.length === 1 ? ' registro' : ' registros'),
    Promediomestexto: Formatonumero(Calculo.Fijopromedio + Calculo.Variablepromedio),
    Mesmensaje: Mesesusados ? 'Promedio de ' + Mesesusados + (Mesesusados === 1 ? ' mes completo' : ' meses completos') + ' con registros. ' + (Math.abs(Calculo.Variablepromedio - Calculo.Variableanterior) < 1 ? 'Tu crédito se mantiene igual que en el período anterior.' : 'Frente al período anterior tu crédito ' + (Calculo.Variablepromedio > Calculo.Variableanterior ? 'subió' : 'bajó') + ' $' + Formatomillones(Math.abs(Calculo.Variablepromedio - Calculo.Variableanterior) * Calculo.Tope * Calculo.Factor) + ' millones.') : (Estadoactual.Tipo === 'fijo' ? 'Con ingreso fijo el promedio es tu salario. Si registras ingresos extra, aquí verás su promedio.' : 'Aún no tienes meses completos registrados: usamos el ingreso variable de tu perfil. Registra tus ingresos para que el promedio sea el de tus extractos.'),
    Variablemestexto: Formatoenteropesos(Variablemes),
    Semanabarras,
    Variabletotal: Formatoenteropesos(Variablemes),
    Deudastexto: Formatoenteropesos(Calculo.Deudasmes),
    Flujoneto: Formatoenteropesos(Fijostotal + Variablemes - Calculo.Deudasmes - Gastosmes),
    Promediotres: '$' + Formatomillones(Promediotres) + ' M',
    Promedioseis: '$' + Formatomillones(Promedioseis) + ' M',
    Promediolinea: (Promediotres / Mesmaximo * 100) + '%',
    Mesbarras,
    Consignacionopacidad: Consignacionactual ? 1 : 0,
    Consignacioneventos: Consignacionactual ? 'auto' : 'none',
    Consignaciondesplazamiento: Consignacionactual ? 'translateY(0)' : 'translateY(105%)',
    Consignacionconcepto: Esanterior ? 'Efectivo de días anteriores · 3 registros' : Entidad ? Entidad.Concepto + ' · ' + Entidad.Hora : '',
    Consignacionmonto: Formatonumero(Consignacionmonto),
    Cerrarconsignacion: () => this.Cambiarestado({ Consignacion: null }),
    Consignacionopciones: ['Nequi / DaviPlata', 'Cuenta bancaria'].map(Mesdato => {
      const Activo = Consignacionactual && Consignacionactual.Medio === Mesdato;
      return {
        Etiqueta: Mesdato,
        Fondo: Activo ? 'var(--ac)' : 'transparent',
        Borde: Activo ? 'var(--ac)' : 'var(--ln)',
        Color: Activo ? 'var(--oa)' : 'var(--ik)',
        Anillo: Activo ? 'var(--oa)' : 'var(--fa)',
        Punto: Activo ? 'var(--oa)' : 'transparent',
        Alclic: () => this.Cambiarestado(Estadoprevio => ({ Consignacion: { ...Estadoprevio.Consignacion, Medio: Mesdato } }))
      };
    }),
    Confirmarconsignacion: () => {
      if (!Consignacionactual) return;
      if (Esanterior) this.Cambiarestado({ Efectivoanterior: 0, Consignacion: null });
      else this.Cambiarestado(Estadoprevio => ({ Registros: Estadoprevio.Registros.map((Elemento, Indice) => Indice === Consignacionactual.target ? { ...Elemento, Medio: Consignacionactual.Medio, Consignado: true } : Elemento), Consignacion: null }));
      this.Aviso(Formatoenteropesos(Consignacionmonto) + ' consignados en ' + Consignacionactual.Medio + '. Ya cuentan para el banco.');
    },
    Registroingreso: Ingresototal,
    Registroegreso: !Ingresototal,
    Registrotipos: [['ing', 'Ingresos', 'LO QUE ENTRA'], ['egr', 'Egresos', 'LO QUE SALE']].map(([Clave, Etiquetatexto, Subtexto]) => {
      const Activo = (Estadoactual.Registrotipo || 'ing') === Clave;
      return {
        Etiqueta: Etiquetatexto,
        Subtexto,
        Fondo: Activo ? (Clave === 'ing' ? 'var(--ac)' : 'var(--al)') : 'var(--cd)',
        Borde: Activo ? 'transparent' : 'var(--ln)',
        Color: Activo ? (Clave === 'ing' ? 'var(--oa)' : '#120A05') : 'var(--ik)',
        Alclic: () => this.Cambiarestado({ Registrotipo: Clave })
      };
    }),
    Egresodiatitulo: Eshoy ? 'Hoy gastaste' : 'Ese día gastaste',
    Egresodiatotal: Formatonumero(Gastoseleccionado),
    Egresodiaingreso: Formatoenteropesos(Seleccionmonto),
    Egresodiagasto: '−' + Formatoenteropesos(Gastoseleccionado),
    Egresodianeto: Formatoenteropesos(Seleccionmonto - Gastoseleccionado),
    Egresoregistros,
    Egresocantidad: Egresoregistros.length + (Egresoregistros.length === 1 ? ' gasto' : ' gastos'),
    Iregresosmes: () => this.Cambiarestado({ Ingresovista: 'mes', Registrotipo: 'egr' }),
    Egresofijostexto: Formatoenteropesos(Deudasuma),
    Egresomestotal: Formatonumero(Deudasuma + Gastosmes),
    Egresofijosancho: (Deudasuma / Math.max(1, Deudasuma + Gastosmes) * 100) + '%',
    Categoriafilas: Categoriasgasto.filter(Clave => Categoriabase[Clave] > 0).map(Clave => ({ Etiqueta: Clave, Monto: Formatoenteropesos(Categoriabase[Clave]), Ancho: Estadoactual.Barrasvisibles ? (Categoriabase[Clave] / Categoriamaxima * 100) + '%' : '0%' })),
    Fijostotaltexto: Formatoenteropesos(Fijostotal),
    Fijosfilas: [...(Fijoefectivo ? [{ Inicial: 'SA', Concepto: 'Salario / ingreso fijo', Meta: 'Desde tu perfil · cada mes', Monto: Formatoenteropesos(Fijoefectivo), Puedequitar: false }] : []),
      ...Estadoactual.Ingresosfijosextra.map((Fila, Indice) => ({ Inicial: Fila.Nombreitem.slice(0, 2).toUpperCase(), Concepto: Fila.Nombreitem, Meta: 'Fijo mensual', Monto: Formatoenteropesos(Fila.Monto), Puedequitar: true, Alquitar: () => this.Cambiarestado(Estadoprevio => ({ Ingresosfijosextra: Estadoprevio.Ingresosfijosextra.filter((Ignorado, Posicionotra) => Posicionotra !== Indice) })) }))],
    Hojafrecuencias: [['diario', Estadoactual.Hojatipo === 'deuda' ? 'Gasto del día' : 'Del día'], ['fijo', 'Fijo mensual']].map(([Clave, Etiquetatexto]) => {
      const Activo = Estadoactual.Hojafrecuencia === Clave;
      return { Etiqueta: Etiquetatexto, Fondo: Activo ? 'var(--ik)' : 'transparent', Color: Activo ? 'var(--bg)' : 'var(--mu)', Borde: Activo ? 'var(--ik)' : 'var(--ln)', Alclic: () => this.Cambiarestado({ Hojafrecuencia: Clave, Formularioerror: '' }) };
    }),
    Ingresofijotipofichas: Tiposingresofijo.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Ingresofijoform.Tipo === Opcion), Alclic: () => this.Cambiarestado({ Formularioingresofijo: { ...Ingresofijoform, Tipo: Opcion } }) })),
    Ingresofijomontotexto: Ingresofijoform.Monto ? Formatonumero(Ingresofijoform.Monto) : '',
    Escribiringresofijomonto: (Elemento) => this.Cambiarestado({ Formularioingresofijo: { ...Ingresofijoform, Monto: Digito(Elemento) }, Formularioerror: '' }),
    Ingresofijopista: Ingresofijoform.Monto ? 'Este ingreso suma $' + Formatomillones(Ingresofijoform.Monto * Calculo.Tope * Calculo.Factor / Configuracion.Financiacion) + ' M al precio de tu vivienda.' : 'Ingresos que llegan igual cada mes: pensión, arriendos, honorarios.',
    Ingresofijoguardaretiqueta: Ingresofijoform.Monto ? 'Guardar · ' + Formatoenteropesos(Ingresofijoform.Monto) + '/mes' : 'Guardar ingreso fijo',
    Guardaringresofijo: () => {
      if (Ingresofijoform.Monto < 1000) { this.Cambiarestado({ Formularioerror: 'Escribe el monto mensual.' }); return; }
      const Ingresofijonombre = (Ingresofijoform.Tipo === 'Otro ingreso fijo' && (Ingresofijoform.Nombre || '').trim()) || Ingresofijoform.Tipo;
      this.Cambiarestado(Estadoprevio => ({ Ingresosfijosextra: [...Estadoprevio.Ingresosfijosextra, { Nombreitem: Ingresofijonombre, Monto: Ingresofijoform.Monto }], Hoja: false, Formularioingresofijo: { ...Estadoprevio.Formularioingresofijo, Monto: 0, Nombre: '' } }));
      this.Aviso(Ingresofijonombre + ' agregado: +' + Formatoenteropesos(Ingresofijoform.Monto) + '/mes. Tu techo sube $' + Formatomillones(Ingresofijoform.Monto * Calculo.Tope * Calculo.Factor / Configuracion.Financiacion) + ' M.');
    },
    Gastomontotexto: Gasto.Monto ? Formatonumero(Gasto.Monto) : '',
    Escribirgastomonto: (Elemento) => this.Cambiarestado({ Formulariogasto: { ...Gasto, Monto: Digito(Elemento) }, Formularioerror: '' }),
    Gastocategoriafichas: Categoriasgasto.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Gasto.Categoria === Opcion), Alclic: () => this.Cambiarestado({ Formulariogasto: { ...Gasto, Categoria: Opcion } }) })),
    Gastomediofichas: Gastosmediospago.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Gasto.Medio === Opcion), Alclic: () => this.Cambiarestado({ Formulariogasto: { ...Gasto, Medio: Opcion } }) })),
    Gastoguardaretiqueta: Gasto.Monto ? 'Guardar gasto · −' + Formatoenteropesos(Gasto.Monto) : 'Guardar gasto',
    Guardargasto: () => {
      if (Gasto.Monto < 500) { this.Cambiarestado({ Formularioerror: 'Escribe cuánto gastaste.' }); return; }
      this.Cambiarestado(Estadoprevio => ({ Diasregistrados: Marcardiaregistro(Estadoprevio.Diasregistrados), Egresosregistrados: [...Estadoprevio.Egresosregistrados, { Fecha: Hoyregistro(), Categoria: Gasto.Categoria, Nombre: Gasto.Categoria === 'Otros' ? (Gasto.Nombre || '').trim() : '', Medio: Gasto.Medio, Monto: Gasto.Monto, Hora: Hora() }], Hoja: false, Diaseleccionado: 6, Registrotipo: 'egr', Formulariogasto: { ...Estadoprevio.Formulariogasto, Monto: 0, Nombre: '' } }));
      this.Aviso('Gasto de ' + Formatoenteropesos(Gasto.Monto) + ' en ' + ((Gasto.Categoria === 'Otros' && (Gasto.Nombre || '').trim()) || Gasto.Categoria.toLowerCase()) + ' registrado.');
    },
    Ingresocodigo: (Estadoactual.Ingresovista || 'dia') === 'dia' ? 'P5 · MI DÍA' : (Estadoactual.Ingresovista || 'dia') === 'mes' ? 'P6 · MI MES' : 'P7 · MI AÑO',
    Ingresosegmentos: [['dia', 'Día', ''], ['mes', 'Mes', ''], ['ano', 'Año', 'F2']].map(([Clave, Etiquetatexto, Auxiliar]) => ({ Etiqueta: Etiquetatexto, Etiquetanodo: Auxiliar, Fondo: (Estadoactual.Ingresovista || 'dia') === Clave ? 'var(--ik)' : 'transparent', Color: (Estadoactual.Ingresovista || 'dia') === Clave ? 'var(--bg)' : 'var(--mu)', Alclic: () => this.Cambiarestado({ Ingresovista: Clave }) })),
    Ingresoesdia: (Estadoactual.Ingresovista || 'dia') === 'dia',
    Ingresoesmes: (Estadoactual.Ingresovista || 'dia') === 'mes',
    Ingresoesanual: (Estadoactual.Ingresovista || 'dia') === 'ano'
  };
}

