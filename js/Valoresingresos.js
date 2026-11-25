// Hoja Registrar: las cuatro opciones y los formularios de ingreso fijo y gasto del día.
// Lo registrado por día, mes y año se muestra en Movimientos (Valoresmovimientos.js).

// Lo que se puede anotar desde el botón Registrar y cómo afecta el presupuesto
const Opcionesregistro = [
  { Titulo: 'Ingreso de hoy', Detalle: 'Ventas, turnos, servicios o propinas.', Efecto: 'Sube tu promedio de ingresos', Clase: 'is-sube', Icono: 'M4.5 6h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0M6 10v4M18 10v4', Cambios: { Hojatipo: 'ingreso', Hojafrecuencia: 'diario' } },
  { Titulo: 'Gasto de hoy', Detalle: 'Comida, transporte o compras.', Efecto: 'Cambia lo que puedes ahorrar', Clase: '', Icono: 'M5.5 6h13A2.5 2.5 0 0 1 21 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-8A2.5 2.5 0 0 1 5.5 6zM3 10h18M16 14.5h2', Cambios: { Hojatipo: 'deuda', Hojafrecuencia: 'diario' } },
  { Titulo: 'Ingreso fijo del mes', Detalle: 'Salario, pensión o arriendo que recibes.', Efecto: 'Cuenta completo cada mes', Clase: 'is-sube', Icono: 'M5.5 5h13A2.5 2.5 0 0 1 21 7.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-11A2.5 2.5 0 0 1 5.5 5zM3 10h18M8 3v4M16 3v4', Cambios: { Hojatipo: 'ingreso', Hojafrecuencia: 'fijo' } },
  { Titulo: 'Deuda o pago fijo del mes', Detalle: 'Tarjeta, crédito o arriendo que pagas.', Efecto: 'Baja lo que te presta el banco', Clase: 'is-baja', Icono: 'M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5zM3 10h18M7 15h4', Cambios: { Hojatipo: 'deuda', Hojafrecuencia: 'fijo', Formulariodeuda: { Tipo: 'Tarjeta de crédito', Cuota: 0, Saldo: 0, Entidad: '', Nombre: '' } } }
];

function Generarvaloresingresos(Calculo, Configuracion, Seleccion, Fichaseleccion) {
  const Estadoactual = this.Estadocomponente;

  const Tiposingresofijo = ['Salario', 'Pensión', 'Arriendo que recibo', 'Honorarios fijos', 'Otro ingreso fijo'];
  const Categoriasgasto = ['Transporte', 'Alimentación', 'Insumos del negocio', 'Servicios públicos', 'Salud', 'Otros'];
  const Gastosmediospago = ['Efectivo', 'Nequi / DaviPlata', 'Tarjeta débito'];
  const Ingresofijoform = Estadoactual.Formularioingresofijo, Gasto = Estadoactual.Formulariogasto;
  const Digito = (Elemento, Maximo) => Limpiardigitos(Elemento.target.value, Maximo);
  const Hora = () => {
    const Dato = new Date();
    return String(Dato.getHours()).padStart(2, '0') + ':' + String(Dato.getMinutes()).padStart(2, '0');
  };

  // El título dice el día cuando se anota desde Movimientos en un día anterior
  const Fechahoja = Estadoactual.Hojafecha && Estadoactual.Hojafrecuencia !== 'fijo' ? Fechalarga(Estadoactual.Hojafecha) : '';
  const Esefectivo = Estadoactual.Formulario.Medio === 'Efectivo';

  return {
    Hojaenmenu: Boolean(Estadoactual.Hojamenu),
    Hojaenformulario: !Estadoactual.Hojamenu,
    Registroopciones: Opcionesregistro.map(Opcion => ({ ...Opcion, Alclic: () => this.Cambiarestado({ ...Opcion.Cambios, Hojamenu: false, Hojafecha: null, Deudaeditandoid: null, Formularioerror: '' }) })),
    Hojavolvermenu: () => this.Cambiarestado({ Hojamenu: true, Hojafecha: null, Deudaeditandoid: null, Formularioerror: '' }),
    Hojatitulo: Estadoactual.Hojatipo === 'deuda'
      ? (Estadoactual.Hojafrecuencia === 'fijo' ? (Estadoactual.Deudaeditandoid ? 'Editar deuda o pago fijo' : 'Deuda o pago fijo') : (Fechahoja ? 'Gasto del ' + Fechahoja : 'Gasto de hoy'))
      : (Estadoactual.Hojafrecuencia === 'fijo' ? 'Ingreso fijo del mes' : (Fechahoja ? 'Ingreso del ' + Fechahoja : 'Ingreso de hoy')),
    Hojaingresopista: Esefectivo ? 'Recuerda consignarlo: el banco solo ve lo que entra a tus cuentas.' : 'Cuenta para tu promedio de ingresos cuando termine el mes.',
    Hojaingresopistaclase: Esefectivo ? 'is-alerta' : '',
    Tipominusculas: { fijo: 'fijo', variable: 'variable', mixto: 'mixto' }[Estadoactual.Tipo],
    Deudastexto: Formatoenteropesos(Calculo.Deudasmes),
    Ingresofijotipofichas: Tiposingresofijo.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Ingresofijoform.Tipo === Opcion), Alclic: () => this.Cambiarestado({ Formularioingresofijo: { ...Ingresofijoform, Tipo: Opcion } }) })),
    Ingresofijomontotexto: Ingresofijoform.Monto ? Formatonumero(Ingresofijoform.Monto) : '',
    Escribiringresofijomonto: (Elemento) => this.Cambiarestado({ Formularioingresofijo: { ...Ingresofijoform, Monto: Digito(Elemento, Limitesfinancieros.IngresoMensual) }, Formularioerror: '' }),
    Ingresofijopista: Ingresofijoform.Monto ? 'Este ingreso suma $' + Formatomillones(Ingresofijoform.Monto * Calculo.Tope * Calculo.Factor / (Calculo.Financiacion || Configuracion.Financiacion)) + ' M al precio de tu vivienda.' : 'Ingresos que llegan igual cada mes: pensión, arriendos, honorarios.',
    Ingresofijoguardaretiqueta: Ingresofijoform.Monto ? 'Guardar · ' + Formatoenteropesos(Ingresofijoform.Monto) + '/mes' : 'Guardar ingreso fijo',
    Guardaringresofijo: () => {
      if (Ingresofijoform.Monto < 1000) { this.Cambiarestado({ Formularioerror: 'Escribe el monto mensual.' }); return; }
      if ((Estadoactual.Ingresosfijosextra || []).length >= Limitesfinancieros.MaxIngresosExtra) { this.Cambiarestado({ Formularioerror: 'Puedes registrar máximo ' + Limitesfinancieros.MaxIngresosExtra + ' ingresos fijos extra.' }); return; }
      const Ingresofijonombre = (Ingresofijoform.Tipo === 'Otro ingreso fijo' && (Ingresofijoform.Nombre || '').trim()) || Ingresofijoform.Tipo;
      this.Cambiarestado(Estadoprevio => ({ Ingresosfijosextra: [...Estadoprevio.Ingresosfijosextra, { Nombreitem: Ingresofijonombre, Monto: Ingresofijoform.Monto }], Hoja: false, Formularioingresofijo: { ...Estadoprevio.Formularioingresofijo, Monto: 0, Nombre: '' } }));
      this.Aviso(Ingresofijonombre + ' agregado: +' + Formatoenteropesos(Ingresofijoform.Monto) + '/mes. Tu presupuesto sube $' + Formatomillones(Ingresofijoform.Monto * Calculo.Tope * Calculo.Factor / (Calculo.Financiacion || Configuracion.Financiacion)) + ' M.');
    },
    Gastomontotexto: Gasto.Monto ? Formatonumero(Gasto.Monto) : '',
    Escribirgastomonto: (Elemento) => this.Cambiarestado({ Formulariogasto: { ...Gasto, Monto: Digito(Elemento, Limitesfinancieros.MovimientoDiario) }, Formularioerror: '' }),
    Gastocategoriafichas: Categoriasgasto.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Gasto.Categoria === Opcion), Alclic: () => this.Cambiarestado({ Formulariogasto: { ...Gasto, Categoria: Opcion } }) })),
    Gastomediofichas: Gastosmediospago.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Gasto.Medio === Opcion), Alclic: () => this.Cambiarestado({ Formulariogasto: { ...Gasto, Medio: Opcion } }) })),
    Gastoguardaretiqueta: Gasto.Monto ? 'Guardar gasto · −' + Formatoenteropesos(Gasto.Monto) : 'Guardar gasto',
    Guardargasto: () => {
      if (Gasto.Monto < 500) { this.Cambiarestado({ Formularioerror: 'Escribe cuánto gastaste.' }); return; }
      // Desde Movimientos se puede anotar en un día anterior de la semana; si no, va con la fecha de hoy
      const Fecha = Estadoactual.Hojafecha || Hoyregistro();
      this.Cambiarestado(Estadoprevio => ({ Diasregistrados: Marcardiaregistro(Estadoprevio.Diasregistrados, Fecha), Egresosregistrados: [...Estadoprevio.Egresosregistrados, { Fecha, Categoria: Gasto.Categoria, Nombre: Gasto.Categoria === 'Otros' ? (Gasto.Nombre || '').trim() : '', Medio: Gasto.Medio, Monto: Gasto.Monto, Hora: Hora() }], Hoja: false, Hojafecha: null, ...(Estadoactual.Hojafecha ? {} : { Diaseleccionado: 6 }), Registrotipo: 'egr', Formulariogasto: { ...Estadoprevio.Formulariogasto, Monto: 0, Nombre: '' } }));
      this.Aviso('Gasto de ' + Formatoenteropesos(Gasto.Monto) + ' en ' + ((Gasto.Categoria === 'Otros' && (Gasto.Nombre || '').trim()) || Gasto.Categoria.toLowerCase()) + ' registrado.');
    }
  };
}
