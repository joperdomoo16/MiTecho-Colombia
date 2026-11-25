// Indicadores de la pestaña Inicio: presupuesto, avance del ahorro, racha y navegación inferior

function Avisotopevis(Calculo, Ciudad) {
  return 'Tu techo pasa el tope VIS de ' + (Ciudad || 'tu ciudad') + ' (' + Calculo.Topevissalarios + ' SMMLV = ' + Formatoenteropesos(Calculo.Topevis) + '). A ese precio la vivienda sería No VIS: el banco financia hasta el 70% y no aplica subsidio. Si buscas VIS, tu tope es ' + Formatoenteropesos(Calculo.Topevis) + '.';
}

function Generarvaloresinicio(Calculo, Configuracion, Seleccion, Oscuroactivo) {
  const Estadoactual = this.Estadocomponente;
  const Pestana = this.Pestana;
  const Mostrado = Estadoactual.Mostrado ?? Calculo.Preciotecho;
  const Pestanas = ['inicio', 'ingresos', 'simulador', 'plan', 'ofertas'];
  const Pestanaes = {};
  const Pestanaclase = {};
  const Pestanaactual = {};
  const Pestanair = {};

  Pestanas.forEach(Auxiliar => {
    Pestanaes[Auxiliar] = Pestana === Auxiliar;
    Pestanaclase[Auxiliar] = Pestana === Auxiliar ? 'is-activa' : '';
    Pestanaactual[Auxiliar] = Pestana === Auxiliar ? 'page' : false;
    Pestanair[Auxiliar] = () => {
      Reiniciarnavegacion.call(this);
      const Extraingresos = Auxiliar === 'ingresos'
        ? { Ingresovista: Estadoactual.Ingresovista || 'dia', Registrotipo: Estadoactual.Registrotipo || 'ing', Diaseleccionado: 6 }
        : {};
      this.Cambiarestado({
        Pestana: Auxiliar,
        Simuladorpaso: Auxiliar === 'simulador' ? (Estadoactual.Simuladorpaso || 'form') : Estadoactual.Simuladorpaso,
        ...Extraingresos
      });
    };
  });
  Pestanaes.Simuladorformulario = Pestana === 'simulador' && (Estadoactual.Simuladorpaso || 'form') === 'form';
  Pestanaes.Simuladorresultado = Pestana === 'simulador' && Estadoactual.Simuladorpaso === 'result';

  const Totalhoy = Sumamontos(Registrosdeldia(Estadoactual.Registros, Hoyregistro()));
  const Efectivopendiente = Estadoactual.Registros
    .filter(Elemento => !Elemento.Consignado && Elemento.Medio === 'Efectivo')
    .reduce((Acumulado, Elemento) => Acumulado + Elemento.Monto, 0) + Estadoactual.Efectivoanterior;

  const Necesariotecho = Calculo.Cuotainicialtecho + (Estadoactual.Financiargastos ? 0 : Calculo.Gastostecho);
  const Cuotainicialporcentaje = Necesariotecho > 0 ? Math.min(1, (Necesariotecho - Calculo.Faltatecho) / Necesariotecho) : 0;
  const Tienetecho = Calculo.Preciotecho > 0;
  const Tieneahorro = Necesariotecho - Calculo.Faltatecho;
  const Ahorroporcentaje = Necesariotecho > 0 ? Math.min(100, Math.round(Cuotainicialporcentaje * 100)) : 0;
  const Metaporcentaje = Math.min(100, Math.round(Totalhoy / Math.max(1, Calculo.Metadiaria) * 100));

  const Datosproyectos = Pestana === 'inicio'
    ? Proyectosalcanzables.call(this, Estadoactual, Calculo)
    : { Proyectosciudad: [], Alcanzables: [] };
  const Proyectosciudad = Datosproyectos.Proyectosciudad;
  const Alcanzables = Datosproyectos.Alcanzables;
  const Desde = Alcanzables.length ? Math.min(...Alcanzables.map(Proyecto => Proyecto.Precioproyecto)) : 0;

  const Fechasracha = [
    ...(Estadoactual.Diasregistrados || []),
    ...Estadoactual.Registros.filter(Elemento => Elemento.Fecha).map(Elemento => Elemento.Fecha),
    ...Estadoactual.Egresosregistrados.filter(Elemento => Elemento.Fecha).map(Elemento => Elemento.Fecha)
  ];
  const Rachadatos = Calcularracha(Fechasracha);
  const Mesesfaltantes = Math.max(0, Math.ceil(Calculo.Faltatecho / Math.max(1, Estadoactual.Ahorromes)));
  const Metavisible = Estadoactual.Tipo !== 'fijo';
  const Subsidiousado = Calculo.Subsidiotecho;
  const Primernombre = (Estadoactual.Nombre || '').trim().split(/\s+/)[0];

  let Ahorroaviso = 'Ya tienes la cuota inicial y los gastos de notaría y registro.';
  if (!Tienetecho) {
    if (Calculo.Ingresototal > 0) {
      Ahorroaviso = 'Tus cuotas de deudas se llevan todo tu ingreso, así el banco no te presta. Cada cuota que termines de pagar sube tu presupuesto.';
    } else {
      Ahorroaviso = 'Completa tus ingresos en tu perfil para calcular tu presupuesto.';
    }
  }

  let Rachatexto = 'Llevas ' + Rachadatos.Seguidos + ' días seguidos registrando.';
  if (Rachadatos.Seguidos === 0) Rachatexto = 'Empieza hoy tu racha: registra lo que ganes.';
  else if (Rachadatos.Seguidos === 1) Rachatexto = 'Llevas 1 día registrando.';

  let Viviendasresumen = 'Mira proyectos de referencia en otras ciudades';
  if (Alcanzables.length) {
    const Textoitem = Alcanzables.length === 1 ? ' proyecto de referencia desde $' : ' proyectos de referencia desde $';
    Viviendasresumen = Alcanzables.length + Textoitem + Math.round(Desde / 1e6).toLocaleString('es-CO') + ' M';
  } else if (Proyectosciudad.length) {
    Viviendasresumen = 'Mira los proyectos de referencia en ' + Estadoactual.Ciudad;
  }

  return {
    Raizreferencia: this.Raizreferencia,
    Desplazamientoreferencia: this.Desplazamientoreferencia,
    Esoscuro: Oscuroactivo,
    Esclaro: !Oscuroactivo,
    Alternartema: () => Alternartemarapido.call(this),
    Esapp: this.Pantalla === 'app',
    Estilocontenedorapp: Pestana === 'ofertas' ? 'es-detalle' : '',
    Mostrarbarrasuperior: Pestana !== 'ofertas',
    Tienehoja: this.Pantalla === 'app' && Boolean(Estadoactual.Hoja),
    Hojafondovisible: (this.Pantalla === 'app' && Estadoactual.Hoja) ? 'block' : 'none',
    Mostrarbarra: this.Pantalla === 'app' && !Estadoactual.Ayuda && !Estadoactual.Panel && Pestana !== 'ofertas',
    ...Generarvaloresacceso.call(this),
    Pestanaes,
    Pestanair,
    Pestanaclase,
    Pestanaactual,
    Saludotitulo: Primernombre ? 'Hola, ' + Primernombre : 'Hola',
    Abrirayuda: () => this.Cambiarestado({ Ayuda: true, Menu: false }),
    Heroebancopeso: Tienetecho ? Math.round(Calculo.Creditotecho / Calculo.Preciotecho * 1000) : 0,
    Heroepropiopeso: Tienetecho ? 1000 - Math.round(Calculo.Creditotecho / Calculo.Preciotecho * 1000) : 0,
    Heroepropiomillones: '$' + Formatomillones(Math.max(0, Calculo.Preciotecho - Calculo.Creditotecho)) + ' M',
    Heroepropionota: (Tienetecho ? 100 - Math.round(Calculo.Creditotecho / Calculo.Preciotecho * 100) : 0) + '% · cuota inicial',
    Heroesubsidiotexto: 'Tu subsidio ' + (Calculo.Subsidiomicasayasalarios ? 'de Caja y Mi Casa Ya' : 'de Caja') + ' cubre $' + Formatomillones(Subsidiousado) + ' M de esa cuota inicial.',
    Ahorroporcentaje,
    Ahorroporcentajetexto: Ahorroporcentaje + '%',
    Ahorroancho: Ahorroporcentaje + '%',
    Ahorroprogresoetiqueta: 'Llevas el ' + Ahorroporcentaje + '% del ahorro que necesitas',
    Ahorroconmonto: Tienetecho,
    Ahorrotienes: '$' + Formatomillones(Tieneahorro) + ' M',
    Ahorronecesario: '$' + Formatomillones(Necesariotecho) + ' M',
    Ahorroconfalta: Tienetecho && Calculo.Faltatecho > 0,
    Ahorrofaltamonto: '$' + Formatomillones(Calculo.Faltatecho) + ' M',
    Ahorrofaltaresto: Estadoactual.Ahorromes > 0
      ? ': unos ' + Formatearmeses(Mesesfaltantes) + ' si ahorras ' + Formatoenteropesos(Estadoactual.Ahorromes) + ' al mes.'
      : '. Escribe en tu perfil cuánto puedes ahorrar al mes y te decimos en cuánto tiempo llegas.',
    Ahorroconaviso: !Tienetecho || Calculo.Faltatecho <= 0,
    Ahorroaviso,
    Irplanahorro: () => this.Cambiarestado({ Pestana: 'plan' }),
    Metahoy: Formatoenteropesos(Totalhoy),
    Metaporcentaje,
    Metaprogresoetiqueta: 'Llevas el ' + Metaporcentaje + '% de tu meta de hoy',
    Rachatexto,
    Viviendasresumen,
    Irofertas: () => this.Cambiarestado({ Pestana: 'ofertas' }),
    Preciodestacado: Formatomillones(Mostrado),
    Creditomillones: '$' + Formatomillones(Calculo.Creditotecho) + ' M',
    Financiacionancho: (Calculo.Creditotecho / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Porcentajefinanciado: Math.round(Calculo.Creditotecho / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Tienesubsidio: Subsidiousado > 0,
    Cuotainicialmillones: '$' + Formatomillones(Calculo.Cuotainicialtecho) + ' M',
    Cuotainicialparte: Math.round(Calculo.Cuotainicialtecho / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Preciohoymillones: '$' + Formatomillones(Calculo.Preciohoy) + ' M',
    Limiteahorro: Calculo.Limiteahorro,
    Metaancho: Math.min(100, Totalhoy / Math.max(1, Calculo.Metadiaria) * 100) + '%',
    Metavisible,
    Tieneefectivo: Efectivopendiente > 0,
    Efectivomensaje: Formatoenteropesos(Efectivopendiente) + ' en efectivo sin consignar. El banco no los ve.',
    Iringresos: () => this.Cambiarestado({ Pestana: 'ingresos', Ingresovista: 'dia' }),
    Irsimulador: () => this.Cambiarestado({ Pestana: 'simulador', Simuladorpaso: 'form' }),
    Irresultado: () => this.Cambiarestado({ Pestana: 'simulador', Simuladorpaso: 'result' }),
    Irdeudas: () => this.Cambiarestado({ Panel: 'deudas', Menu: false }),
    Irperfil: () => this.Cambiarestado({ Panel: 'perfil' }),
    Avisomensaje: Estadoactual.Aviso,
    Avisodesplazamiento: Estadoactual.Avisovisible ? 'translateY(0)' : 'translateY(-140%)',
    Avisoopacidad: Estadoactual.Avisovisible ? 1 : 0
  };
}
