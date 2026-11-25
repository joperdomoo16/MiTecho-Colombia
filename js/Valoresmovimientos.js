// Movimientos: lo que entra y lo que sale por día, por mes y por año, con el efectivo por consignar y los ingresos fijos.
// Se llama con .call desde la app para que this sea la aplicación.

const Iconosmovimiento = {
  billetera: 'M5.5 6h13A2.5 2.5 0 0 1 21 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-8A2.5 2.5 0 0 1 5.5 6zM3 10h18M16 14.5h2',
  efectivo: 'M4.5 6h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0M6 10v4M18 10v4',
  tendencia: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  usuario: 'M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 21a8 8 0 0 1 16 0',
  casa: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendario: 'M5.5 5h13A2.5 2.5 0 0 1 21 7.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-11A2.5 2.5 0 0 1 5.5 5zM3 10h18M8 3v4M16 3v4',
  carro: 'M5 16v-4.5L7 6.5h10l2 5V16M4 16h16M6 16v2.5M18 16v2.5M8 13h.01M16 13h.01',
  edificio: 'M4 21V5l8-2v18M12 21V9l8 2v10M2 21h20M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2',
  salud: 'M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11z',
  documento: 'M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6'
};
// Ícono de cada fuente de ingreso, de cada tipo de gasto y de cada ingreso fijo
const Iconosfuente = { 'Salario / Nómina': 'billetera', 'Ventas del día': 'efectivo', Comisiones: 'tendencia', Honorarios: 'usuario', Arriendos: 'casa' };
const Iconoscategoria = { Transporte: 'carro', 'Alimentación': 'billetera', 'Insumos del negocio': 'edificio', 'Servicios públicos': 'casa', Salud: 'salud' };
const Iconosfijo = { Salario: 'billetera', 'Pensión': 'calendario', 'Arriendo que recibo': 'casa', 'Honorarios fijos': 'usuario' };
const Iconomovimiento = (Mapa, Clave) => Iconosmovimiento[Mapa[Clave] || 'documento'];

const Mayuscula = (Texto) => Texto.charAt(0).toUpperCase() + Texto.slice(1);

function Generarvaloresmovimientos(Calculo) {
  const Estadoactual = this.Estadocomponente;
  if (this.Pantalla !== 'app' || this.Pestana !== 'ingresos') return {};
  const Esgasto = Estadoactual.Registrotipo === 'egr', Vista = ['mes', 'ano'].includes(Estadoactual.Ingresovista) ? Estadoactual.Ingresovista : 'dia';
  const Hoy = Hoyregistro(), Mesactual = Hoy.slice(0, 7), Anio = Hoy.slice(0, 4), Dias = Ultimosdias(Hoy);
  const Diaactual = Number.isInteger(Estadoactual.Diaseleccionado) && Estadoactual.Diaseleccionado >= 0 && Estadoactual.Diaseleccionado <= 6 ? Estadoactual.Diaseleccionado : 6;
  const Fechaelegida = Dias[Diaactual].Fecha, Eshoy = Fechaelegida === Hoy, Diacorto = Fechalarga(Fechaelegida).split(' de ')[0];
  const Registros = Estadoactual.Registros || [], Egresos = Estadoactual.Egresosregistrados || [];

  // Día: lo registrado ese día, la meta, la racha y el efectivo que falta consignar
  const Ingresosdia = Registrosdeldia(Registros, Fechaelegida), Gastosdia = Registrosdeldia(Egresos, Fechaelegida);
  const Totaldia = Sumamontos(Ingresosdia), Totalgastodia = Sumamontos(Gastosdia);
  const Meta = Calculo.Metadiaria, Metaporcentaje = Meta >= 1 ? Math.min(100, Math.round(Totaldia / Meta * 100)) : 0;
  const Seguidos = Calcularracha([...(Estadoactual.Diasregistrados || []), ...[...Registros, ...Egresos].filter(Registro => Registro.Fecha).map(Registro => Registro.Fecha)]).Seguidos;
  const Pendientes = Registros.filter(Registro => Registro.Medio === 'Efectivo' && !Registro.Consignado);
  const Efectivopendiente = Sumamontos(Pendientes) + (Estadoactual.Efectivoanterior || 0);

  // Mes: promedio que usa el banco y los últimos seis meses completos más el que va corriendo; el ingreso fijo cuenta en todos
  const Meses = Ultimosmeses(7, Hoy), Fijo = Calculo.Fijopromedio;
  const Valoresmes = Calculo.Historial.map(Valor => Valor === null ? (Fijo > 0 ? Fijo : null) : Valor + Fijo);
  const Completos = Valoresmes.slice(0, 6), Maximo = Math.max(1, ...Valoresmes.map(Valor => Valor || 0));
  // El mejor mes solo se nombra entre los que tienen ingresos registrados
  const Mejor = Completos.reduce((Elegido, Valor, Indice) => Calculo.Historial[Indice] !== null && (Elegido < 0 || Valor > Completos[Elegido]) ? Indice : Elegido, -1);
  const Nombremes = (Clave) => Mesesnombres[Number(Clave.slice(5, 7)) - 1];
  const Millonesmes = (Valor) => (Valor / 1e6).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const Promedio = Fijo + Calculo.Variablepromedio, Anual = Promedio * 12, Toperenta = 1400 * Unidadtributaria;

  // Ingresos fijos: el salario del perfil y los que la persona agregó
  const Salario = Estadoactual.Tipo === 'variable' ? 0 : (Estadoactual.Fijo || 0), Extras = Estadoactual.Ingresosfijosextra || [];
  const Fijostotal = Salario + Extras.reduce((Suma, Fila) => Suma + (Fila.Monto || 0), 0);

  // Gastos del mes o del año: pagos de deudas y gastos del día por tipo
  const Gastosperiodo = Vista === 'ano' ? Egresos.filter(Gasto => Fechaderegistro(Gasto).slice(0, 4) === Anio) : Registrosdelmes(Egresos, Mesactual);
  const Mesescongasto = Vista === 'ano' ? Math.max(1, new Set(Gastosperiodo.map(Gasto => Fechaderegistro(Gasto).slice(0, 7))).size) : 1;
  const Deudasmes = (Estadoactual.Deudas || []).reduce((Suma, Deuda) => Suma + (Deuda.Cuota || 0), 0);
  const Diariosmes = Sumamontos(Gastosperiodo) / Mesescongasto;
  const Porcategoria = {};
  Gastosperiodo.forEach(Gasto => { Porcategoria[Gasto.Categoria] = (Porcategoria[Gasto.Categoria] || 0) + (Gasto.Monto || 0) / Mesescongasto; });
  const Categoriamayor = Math.max(1, ...Object.values(Porcategoria));

  const Abrirhojadia = (Tipo) => () => this.Cambiarestado({ Hoja: true, Hojamenu: false, Hojatipo: Tipo, Hojafrecuencia: 'diario', Deudaeditandoid: null, Formularioerror: '', Hojafecha: Eshoy ? null : Fechaelegida });
  const Filaingreso = (Registro) => ({
    Icono: Iconomovimiento(Iconosfuente, Registro.Fuente), Titulo: Registro.Concepto || Registro.Fuente, Monto: Formatoenteropesos(Registro.Monto),
    Detalle: [Registro.Medio, Horadoce(Registro.Hora)].filter(Boolean).join(' · '),
    Sinconsignar: Registro.Medio === 'Efectivo' && !Registro.Consignado, Consignado: Registro.Medio === 'Efectivo' && Boolean(Registro.Consignado)
  });
  const Filagasto = (Gasto) => ({
    Icono: Iconomovimiento(Iconoscategoria, Gasto.Categoria), Titulo: Gasto.Nombre || Gasto.Categoria, Monto: '−' + Formatoenteropesos(Gasto.Monto),
    Detalle: [Gasto.Nombre ? Gasto.Categoria : '', Gasto.Medio, Horadoce(Gasto.Hora)].filter(Boolean).join(' · ')
  });

  return {
    Movtipos: [['ing', 'Ingresos'], ['egr', 'Gastos']].map(([Clave, Etiqueta]) => ({ Etiqueta, Activo: (Clave === 'egr') === Esgasto, Clase: (Clave === 'egr') === Esgasto ? 'is-activa' : '', Alclic: () => this.Cambiarestado({ Registrotipo: Clave }) })),
    Movperiodos: [['dia', 'Hoy'], ['mes', 'Este mes'], ['ano', 'Este año']].map(([Clave, Etiqueta]) => ({ Etiqueta, Activo: Clave === Vista, Clase: Clave === Vista ? 'is-activa' : '', Alclic: () => this.Cambiarestado({ Ingresovista: Clave }) })),
    Movdias: Dias.map((Dia, Indice) => ({
      Letra: Dia.Letra, Numero: Dia.Numero, Activo: Indice === Diaactual,
      Etiqueta: Indice === 6 ? 'Hoy' : Fechalarga(Dia.Fecha),
      Clase: (Indice === Diaactual ? 'is-activa ' : '') + (Registrosdeldia(Esgasto ? Egresos : Registros, Dia.Fecha).length ? 'con-registros' : ''),
      Alclic: () => this.Cambiarestado({ Diaseleccionado: Indice })
    })),
    Movesdia: Vista === 'dia', Movingresodia: !Esgasto && Vista === 'dia', Movingresomes: !Esgasto && Vista === 'mes', Movingresoano: !Esgasto && Vista === 'ano',
    Movgastodia: Esgasto && Vista === 'dia', Movgastoperiodo: Esgasto && Vista !== 'dia',
    Movdiatitulo: Eshoy ? 'Hoy, ' + Fechalarga(Hoy) : Mayuscula(Fechalarga(Fechaelegida)),
    Movdiatotal: Formatoenteropesos(Totaldia),
    Movconmeta: Meta >= 1, Movsinmeta: Meta < 1,
    Movmetatexto: 'Meta del día: ' + Formatoenteropesos(Meta),
    Movmetaporcentaje: Metaporcentaje,
    Movmetaporcentajetexto: Metaporcentaje + '%',
    Movmetaancho: Metaporcentaje + '%',
    Movmetaetiqueta: 'Llevas el ' + Metaporcentaje + '% de la meta ' + (Eshoy ? 'de hoy' : 'de ese día'),
    Movracha: (() => {
      if (Seguidos === 0) return 'Empieza hoy tu racha';
      if (Seguidos === 1) return '1 día registrando';
      return Seguidos + ' días seguidos registrando';
    })(),
    Movregistrostitulo: Eshoy ? 'Registros de hoy' : 'Registros del ' + Fechalarga(Fechaelegida),
    Movregistros: Ingresosdia.map(Filaingreso),
    Movsinregistros: !Ingresosdia.length,
    Movsinregistrostexto: Eshoy ? 'Todavía no registras ingresos hoy.' : 'Ese día no registraste ingresos.',
    Movefectivovisible: Efectivopendiente > 0,
    Movefectivotitulo: 'Tienes ' + Formatoenteropesos(Efectivopendiente) + ' en efectivo sin consignar',
    Consignarefectivo: () => {
      this.Cambiarestado(Estadoprevio => ({ Efectivoanterior: 0, Registros: Estadoprevio.Registros.map(Registro => Registro.Medio === 'Efectivo' && !Registro.Consignado ? { ...Registro, Consignado: true } : Registro) }));
      this.Aviso(Formatoenteropesos(Efectivopendiente) + ' consignados. Ya cuentan para el banco.');
    },
    Movregistraringreso: Eshoy ? 'Registrar ingreso' : 'Registrar ingreso del ' + Diacorto,
    Registraringresodia: Abrirhojadia('ingreso'),
    Movpromediotitulo: 'Tu promedio de los últimos ' + Calculo.N + ' meses',
    Movpromedio: Formatoenteropesos(Promedio),
    Movbarras: Valoresmes.map((Valor, Indice) => {
      let Clase = '';
      if (Indice === 6) Clase = 'is-parcial';
      else if (Indice === Mejor) Clase = 'is-mejor';
      return {
        Mes: Meses[Indice].Etiqueta.toLowerCase(),
        Valor: Valor === null ? '—' : Millonesmes(Valor),
        Altura: Math.max(Valor ? 4 : 0, Math.round((Valor || 0) / Maximo * 110)) + 'px',
        Clase
      };
    }),
    Movbarrasetiqueta: 'Ingresos por mes: ' + Valoresmes.map((Valor, Indice) => Nombremes(Meses[Indice].Clave) + (Indice === 6 ? ' va en ' : ' ') + (Valor === null ? 'sin registros' : Millonesmes(Valor) + ' millones')).join(', '),
    Movbarrasnota: 'Millones de pesos. ' + Mayuscula(Nombremes(Mesactual)) + ' aún no termina: va en $' + Millonesmes(Valoresmes[6] || 0) + ' M.',
    Movmejorvisible: Mejor >= 0,
    Movmejorinicio: Mejor >= 0 ? Mayuscula(Nombremes(Meses[Mejor].Clave)) + ' fue tu mejor mes: ' : '',
    Movmejormonto: Mejor >= 0 ? '$' + Millonesmes(Completos[Mejor]) + ' M' : '',
    Movfijostotal: Fijostotal ? Formatoenteropesos(Fijostotal) + ' al mes' : '',
    Movfijos: [
      ...(Salario ? [{ Icono: Iconosmovimiento.billetera, Titulo: 'Salario o ingreso fijo', Detalle: 'Desde tu perfil · cada mes', Monto: Formatoenteropesos(Salario), Puedequitar: false }] : []),
      ...Extras.map((Fila, Indice) => ({
        Icono: Iconomovimiento(Iconosfijo, Fila.Nombreitem), Titulo: Fila.Nombreitem, Detalle: 'Cada mes', Monto: Formatoenteropesos(Fila.Monto), Puedequitar: true,
        Quitaretiqueta: 'Quitar ' + Fila.Nombreitem,
        Quitar: () => this.Cambiarestado(Estadoprevio => ({ Ingresosfijosextra: Estadoprevio.Ingresosfijosextra.filter((Ignorado, Posicion) => Posicion !== Indice) }))
      }))
    ],
    Movsinfijos: !Fijostotal,
    Movaniotitulo: 'Ingresos estimados de ' + Anio,
    Movanual: '$' + Formatomillones(Anual) + ' M',
    Movrentainicio: Anual >= Toperenta ? 'Con lo que llevas registrado pasarías el tope de ingresos de 1.400 UVT (' : 'Con lo que llevas registrado, todavía no pasas el tope de ingresos de 1.400 UVT (',
    Movrentatope: '$' + Formatomillones(Toperenta) + ' M',
    Movrentafin: ' en ' + Anio + ')' + (Anual >= Toperenta ? ': es probable que debas declarar renta.' : '.'),
    Movgastodiatotal: Formatoenteropesos(Totalgastodia),
    Movgastostitulo: Eshoy ? 'Gastos de hoy' : 'Gastos del ' + Fechalarga(Fechaelegida),
    Movgastosdia: Gastosdia.map(Filagasto),
    Movsingastosdia: !Gastosdia.length,
    Movsingastosdiatexto: Eshoy ? 'Todavía no registras gastos hoy.' : 'Ese día no registraste gastos.',
    Movregistrargastodia: Eshoy ? 'Registrar gasto' : 'Registrar gasto del ' + Diacorto,
    Registrargastodia: Abrirhojadia('deuda'),
    Movgastotitulo: Vista === 'ano' ? 'Este año llevas (promedio por mes)' : 'En ' + Nombremes(Mesactual) + ' salieron',
    Movgastototal: Formatoenteropesos(Deudasmes + Diariosmes),
    Movgastodeudas: Formatoenteropesos(Deudasmes),
    Movgastodiarios: Formatoenteropesos(Diariosmes),
    Movcategorias: Object.keys(Porcategoria).sort((Una, Otra) => Porcategoria[Otra] - Porcategoria[Una]).map(Clave => ({ Nombre: Clave, Monto: Formatoenteropesos(Porcategoria[Clave]), Ancho: Math.round(Porcategoria[Clave] / Categoriamayor * 100) + '%' })),
    Movsincategorias: !Gastosperiodo.length,
    Movsincategoriastexto: Vista === 'ano' ? 'Todavía no registras gastos este año.' : 'Todavía no registras gastos este mes.',
    Registrargasto: () => this.Cambiarestado({ Hoja: true, Hojamenu: false, Hojatipo: 'deuda', Hojafrecuencia: 'diario', Deudaeditandoid: null, Formularioerror: '', Hojafecha: null })
  };
}
