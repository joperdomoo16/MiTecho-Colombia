// Tipo de vivienda según su precio: la etiqueta del Inicio, la hoja que explica por qué y el aviso de cada modalidad.
// Se llama con .call desde la app para que this sea la aplicación.

// La recomendación sale de calcular como VIS: el motor la pasa a No VIS solo cuando el techo supera el tope de la ciudad
function Tiporecomendadovivienda(Calculovis) {
  return Calculovis.Preciotecho > 0 && (Calculovis.Techosobretopevis || Calculovis.Modalidadelegida === 'novis') ? 'novis' : 'vis';
}

function Generarvalorestipovivienda(Calculo, Seleccion) {
  const Estadoactual = this.Estadocomponente;
  const Elegido = Modalidadesvivienda[Estadoactual.Modalidadelegida] ? Estadoactual.Modalidadelegida : 'vis';
  const Calculovis = Elegido === 'vis' ? Calculo : this.Calcular(Estadoactual, null, 'vis');
  const Recomendado = Tiporecomendadovivienda(Calculovis), Contecho = Calculovis.Preciotecho > 0;
  const Ciudad = Estadoactual.Ciudad || 'tu ciudad', Topetexto = Formatoenteropesos(Calculovis.Topevis);
  const Techovis = Formatoenteropesos(Calculovis.Preciotecho), Techoactual = Formatoenteropesos(Calculo.Preciotecho);
  // El subsidio de vivienda es para hogares que ganan hasta 4 SMMLV
  const Consubsidio = Calculovis.Salariosminimos <= 4;
  const Forzadonovis = Elegido === 'novis' && Recomendado === 'vis', Cuentanovis = Elegido === 'novis' || Recomendado === 'novis';

  // Texto de la hoja «¿Qué es una vivienda VIS?» según el caso de la persona
  const Presupuesto = '$' + Formatomillones(Calculo.Preciotecho) + ' M', Presupuestovis = '$' + Formatomillones(Calculovis.Preciotecho) + ' M';
  let Titulo = '¿Qué es una vivienda VIS?', Caso;
  if (Elegido === 'leasing') {
    Titulo = 'Estás calculando con leasing';
    Caso = 'Con leasing habitacional el banco compra la vivienda y es su dueño hasta que pagas la opción de compra al final. Por su precio, tu vivienda contaría como ' + (Recomendado === 'vis' ? 'VIS' : 'No VIS') + '.';
  } else if (Forzadonovis) {
    Titulo = 'Estás calculando con No VIS';
    Caso = 'Tu presupuesto como VIS (' + Presupuestovis + ') está por debajo de ese tope, así que te conviene VIS: el banco presta hasta el 80%' + (Consubsidio ? ' y puedes pedir subsidio.' : '.');
  } else if (Recomendado === 'novis') {
    Titulo = '¿Por qué tu vivienda es No VIS?';
    Caso = 'Tu presupuesto (' + Presupuesto + ') pasa ese tope, así que esa vivienda es No VIS: el banco presta hasta el 70% y no aplica subsidio. Si prefieres VIS, busca viviendas de hasta ' + Topetexto + '.';
  } else if (Calculovis.Topado) {
    Caso = 'Con tus ingresos podrías pasar ese tope, pero como No VIS el banco te prestaría menos y sin subsidio. Por eso lo calculamos como vivienda VIS de hasta ' + Topetexto + '.';
  } else {
    Caso = 'Tu presupuesto (' + Presupuesto + ') está por debajo de ese tope. Por eso lo calculamos como vivienda VIS.' + (Consubsidio ? '' : ' Con ingresos mayores a 4 salarios mínimos no aplica el subsidio, pero sigue siendo VIS.');
  }

  // Aviso debajo de las modalidades: por qué aplica, por qué no aplica o por qué no se recomienda la que está elegida
  let Avisotitulo, Avisotexto, Avisotono = 'is-ok';
  if (Elegido === 'leasing') {
    Avisotono = 'is-info';
    Avisotitulo = 'Leasing no es la que te recomendamos de entrada';
    Avisotexto = 'Con leasing el banco compra la vivienda y es su dueño hasta que pagas la opción de compra al final; mientras tanto pagas un canon mensual. Suele financiar hasta el 80% (en algunos programas hasta el 90%), pero no todos los bancos lo ofrecen para VIS. Si vas a usar subsidio, confirma con tu Caja y con el banco que lo acepten con leasing.';
  } else if (Forzadonovis && Calculo.Preciotecho <= Calculovis.Topevis) {
    Avisotono = 'is-alerta';
    Avisotitulo = 'No VIS no aplica para ti';
    Avisotexto = 'Una vivienda es No VIS cuando cuesta más de ' + Topetexto + ' en ' + Ciudad + ', y con tus ingresos llegarías hasta ' + Techoactual + '. Te conviene VIS: el banco presta hasta el 80%, la tasa suele ser más baja' + (Consubsidio ? ' y puedes usar subsidio.' : '.');
  } else if (Forzadonovis) {
    Avisotono = 'is-alerta';
    Avisotitulo = 'No te recomendamos No VIS';
    Avisotexto = 'Como No VIS llegarías hasta ' + Techoactual + ', pero el banco presta solo hasta el 70%, la tasa suele ser más alta, no aplica subsidio y la cuota inicial sube a ' + Formatoenteropesos(Calculo.Cuotainicialtecho) + '. Como VIS tu presupuesto es de ' + Techovis + ' con una cuota inicial de ' + Formatoenteropesos(Calculovis.Cuotainicialtecho) + '.';
  } else if (Elegido === 'novis') {
    Avisotitulo = 'No VIS es la que aplica para ti';
    Avisotexto = 'Tu presupuesto de ' + Techoactual + ' pasa el tope VIS de ' + Ciudad + ' (' + Topetexto + '). En No VIS el banco presta hasta el 70% y no aplica subsidio. Si prefieres VIS, busca viviendas de hasta ' + Topetexto + '.';
  } else if (Recomendado === 'novis') {
    Avisotono = 'is-alerta';
    Avisotitulo = 'VIS no aplica con todo tu presupuesto';
    Avisotexto = Avisotopevis(Calculo, Estadoactual.Ciudad);
  } else if (Calculovis.Topado) {
    Avisotitulo = 'VIS es la recomendada para ti';
    Avisotexto = 'Te alcanza para más que el tope VIS de ' + Ciudad + ', pero como No VIS el banco te prestaría menos y sin subsidio. Por eso calculamos una VIS de hasta ' + Topetexto + ', con 80% de financiación.';
  } else {
    Avisotitulo = 'VIS es la recomendada para ti';
    Avisotexto = 'Tu presupuesto de ' + Techovis + ' está por debajo del tope VIS de ' + Ciudad + ' (' + Topetexto + '). El banco presta hasta el 80%' + (Consubsidio ? ' y puedes usar subsidio de vivienda.' : '. Con ingresos mayores a 4 SMMLV no aplica el subsidio, pero sigue siendo VIS.');
  }

  let Tipochiptexto = 'Vivienda VIS';
  if (Elegido === 'leasing') Tipochiptexto = 'Leasing';
  else if (Cuentanovis) Tipochiptexto = 'Vivienda No VIS';

  return {
    Tiporecomendado: Recomendado,
    Tipochipvisible: Contecho,
    Tipochiptexto,
    Tipochipetiqueta: Tipochiptexto + ': qué significa',
    Abrirtipovivienda: () => this.Cambiarestado({ Tipoviviendaabierto: true }),
    Cerrartipovivienda: () => this.Cambiarestado({ Tipoviviendaabierto: false }),
    Tipoviviendavisible: this.Pantalla === 'app' && Boolean(Estadoactual.Tipoviviendaabierto),
    Tipohojatitulo: Titulo,
    Tipohojacaso: Caso,
    Tipociudad: Ciudad,
    Tipotopetexto: '$' + Formatomillones(Calculovis.Topevis) + ' millones',
    Tipotopesalarios: Calculovis.Topevissalarios,
    Tipoanio: Aniovigente,
    Tipocasoclase: Forzadonovis || Elegido === 'leasing' || Recomendado === 'novis' ? 'is-aviso' : '',
    Verglosario: () => this.Cambiarestado({ Tipoviviendaabierto: false, Ayuda: true }),
    Tipovolvervisible: Forzadonovis || Elegido === 'leasing',
    Volvertiporecomendado: () => {
      this.Cambiarestado({ Modalidadelegida: 'vis', Tipoviviendaabierto: false });
      this.Aviso('Volviste a la modalidad recomendada para ti.');
    },
    Modalidadopciones: Object.keys(Modalidadesvivienda).map(Clave => ({
      Etiqueta: Modalidadesvivienda[Clave].Etiqueta,
      Descripcioncorta: Modalidadesvivienda[Clave].Descripcioncorta,
      ...Seleccion(Elegido === Clave),
      Activa: Elegido === Clave,
      Recomendada: Contecho && Clave === Recomendado,
      Alclic: () => this.Cambiarestado({ Modalidadelegida: Clave })
    })),
    Tipoavisovisible: Contecho || Elegido === 'leasing',
    Tipoavisoclase: Avisotono,
    Tipoavisotitulo: Avisotitulo,
    Tipoavisotexto: Avisotexto
  };
}
