// Mi plan: los seis pasos para comprar vivienda y el plan de ahorro del paso en el que va la persona.
// Se llama con .call desde la app para que this sea la aplicación.

// Plazos para juntar el ahorro; si quedó guardado otro plazo se usa el más cercano
const Plazosahorro = [12, 18, 24];

// Proyectos de referencia de la ciudad que caben en el presupuesto de su tipo de vivienda
function Proyectosalcanzables(Estadoactual, Calculo) {
  const Proyectosciudad = Catalogoproyectos.filter(Proyecto => Proyecto.Ciudadproyecto === Estadoactual.Ciudad);
  if (!Proyectosciudad.length) return { Proyectosciudad, Alcanzables: [] };
  const Cupovis = Math.min(this.Calcular(Estadoactual, null, 'vis').Preciotecho, Calculo.Topevis);
  const Cuponovis = this.Calcular(Estadoactual, null, 'novis').Preciotecho;
  const Alcanzables = Proyectosciudad.filter(Proyecto => Proyecto.Precioproyecto <= (Proyecto.Tipovivienda === 'VIS' ? Cupovis : Cuponovis) + 1);
  return { Proyectosciudad, Alcanzables };
}

// Lo que dice cada paso que lleva a otra pantalla: deudas, viviendas y bancos
function Detallespasos(Estadoactual, Calculo) {
  const Ciudad = Estadoactual.Ciudad || 'tu ciudad', Deudas = Estadoactual.Deudas || [];
  const Cerrables = Deudas.filter(Deuda => Deuda.Activa !== false && Deuda.Cuota > 0 && !Egresosnoterminables.includes(Deuda.Corto));
  const Sinellas = Cerrables.length ? this.Calcular(Estadoactual, Deudas.map(Deuda => Cerrables.includes(Deuda) ? { ...Deuda, Activa: false } : Deuda)) : Calculo;
  const Subida = Sinellas.Preciotecho - Calculo.Preciotecho;
  const { Proyectosciudad, Alcanzables } = Proyectosalcanzables.call(this, Estadoactual, Calculo);
  // Diferencia de cuota entre el banco más caro y el más barato, con el crédito de la persona
  const Datos = Entidadesdelproducto(Productosimulador(Estadoactual.Modalidadelegida, Estadoactual.Tasatipo));
  const Meses = Math.round(Calculo.Plazo * 12);
  const Cuotas = Calculo.Creditotecho > 0 ? Datos.Entidades.map(Entidad => Cuotaconcredito(Calculo.Creditotecho, Entidad.Tasa, Meses, Calculo.Opcioncompra)) : [];
  const Diferencia = Cuotas.length > 1 ? Math.max(...Cuotas) - Math.min(...Cuotas) : 0;
  let Detalledeudas = 'Opcional · mira cuánto pesan tus deudas';
  if (!Deudas.length) Detalledeudas = 'Opcional · no tienes deudas registradas';
  else if (Subida >= 1e5) Detalledeudas = 'Opcional · terminar tus deudas lo sube hasta $' + Formatomillones(Subida) + ' M';

  let Detalleviviendas = 'Mira proyectos de referencia en otras ciudades';
  if (Alcanzables.length) {
    Detalleviviendas = Alcanzables.length + (Alcanzables.length === 1 ? ' proyecto' : ' proyectos') + ' de referencia en ' + Ciudad;
  } else if (Proyectosciudad.length) {
    Detalleviviendas = 'Mira los proyectos de referencia en ' + Ciudad;
  }

  return {
    Deudas: Detalledeudas,
    Viviendas: Detalleviviendas,
    Bancos: Diferencia >= 1000 ? 'Tu cuota puede cambiar hasta ' + Formatoenteropesos(Diferencia) + ' al mes' : 'Mira la tasa y la cuota de cada banco'
  };
}

function Generarvaloresplan(Calculo, Tiporecomendado) {
  const Estadoactual = this.Estadocomponente;
  if (this.Pantalla !== 'app' || this.Pestana !== 'plan') return { Planpasos: [] };
  // Ahorro para la vivienda que busca la persona; sin vivienda escrita en el perfil es la de su presupuesto
  const Tienepresupuesto = Calculo.Preciotecho > 0;
  const Necesario = Calculo.Objetivocuotainicial + Calculo.Objetivogastos, Falta = Math.max(0, Calculo.Objetivofalta);
  const Tiene = Math.max(0, Necesario - Falta);
  const Porcentaje = Necesario > 0 ? Math.min(100, Math.round(Tiene / Necesario * 100)) : 0;
  const Ahorrolisto = Tienepresupuesto && Falta <= 0;
  let Actual = 4;
  if (!Tienepresupuesto) Actual = 1;
  else if (!Ahorrolisto) Actual = 2;

  const Guardado = Number(Estadoactual.Cuotainicialplazo) || 18;
  const Plazo = Plazosahorro.reduce((Mejor, Opcion) => Math.abs(Opcion - Guardado) < Math.abs(Mejor - Guardado) ? Opcion : Mejor);
  const Mensual = Falta / Plazo, Ahorromes = Estadoactual.Ahorromes || 0;
  let Mensaje, Alerta = false;
  if (Ahorromes <= 0) { Mensaje = 'Escribe en tu perfil cuánto ahorras al mes para saber si vas bien.'; Alerta = true; }
  else if (Mensual > Ahorromes) { Mensaje = 'Es ' + Formatoenteropesos(Mensual - Ahorromes) + ' más de lo que ahorras hoy.'; Alerta = true; }
  else if (Math.ceil(Falta / Ahorromes) >= Plazo) Mensaje = 'Hoy ahorras ' + Formatoenteropesos(Ahorromes) + ' al mes: vas bien para lograrlo.';
  else Mensaje = 'Es menos de lo que ahorras hoy: podrías comprar antes.';

  const Detalles = Detallespasos.call(this, Estadoactual, Calculo);
  const Vivienda = Estadoactual.Objetivousuario > 0 ? ' para la vivienda de $' + Formatomillones(Calculo.Objetivo) + ' M que buscas' : '';
  let Subtitulopasouno = 'Completa tus ingresos para calcularlo';
  let Destinopasouno = { Panel: 'perfil' };
  if (Tienepresupuesto) {
    Subtitulopasouno = 'Hasta $' + Formatomillones(Calculo.Preciotecho) + ' M para tu vivienda';
    Destinopasouno = { Pestana: 'inicio' };
  } else if (Calculo.Ingresototal > 0) {
    Subtitulopasouno = 'Tus deudas se llevan todo tu ingreso';
    Destinopasouno = { Panel: 'deudas' };
  }

  let Subtitulopasodos = 'Primero conoce tu presupuesto';
  if (Actual === 2) {
    Subtitulopasodos = 'Tienes $' + Formatomillones(Tiene) + ' M de $' + Formatomillones(Necesario) + ' M' + Vivienda;
  } else if (Ahorrolisto) {
    if (Estadoactual.Modalidadelegida === 'leasing') Subtitulopasodos = 'Ya tienes el pago inicial' + Vivienda;
    else if (Estadoactual.Financiargastos) Subtitulopasodos = 'Ya tienes la cuota inicial (gastos en el crédito)' + Vivienda;
    else Subtitulopasodos = 'Ya tienes la cuota inicial y los gastos' + Vivienda;
  }

  const Pasos = [
    { Titulo: 'Conoce tu presupuesto', Hecho: Tienepresupuesto, Subtitulo: Subtitulopasouno, Ir: () => this.Cambiarestado(Destinopasouno) },
    { Titulo: 'Junta tu ahorro', Hecho: Ahorrolisto, Subtitulo: Subtitulopasodos },
    { Titulo: 'Sube tu presupuesto', Subtitulo: Detalles.Deudas, Ir: () => this.Cambiarestado({ Panel: 'deudas' }) },
    { Titulo: 'Busca vivienda en tu presupuesto', Subtitulo: Detalles.Viviendas, Ir: () => this.Cambiarestado({ Pestana: 'ofertas' }) },
    { Titulo: 'Compara bancos', Subtitulo: Detalles.Bancos, Ir: () => this.Cambiarestado({ Panel: 'tasas' }) },
    { Titulo: 'Ve al banco con tu reporte', Subtitulo: 'Descárgalo en PDF y llévalo a tu cita', Ir: () => this.Cambiarestado({ Panel: 'reporte', Reportelisto: false }) }
  ];

  return {
    Planintro: 'Tu camino para comprar vivienda, paso a paso. Vas en el paso ' + Actual + '.',
    Planpasos: Pasos.map((Paso, Indice) => {
      const Numero = Indice + 1, Esactual = Numero === Actual, Abierto = Esactual && Numero === 2;
      const Enlace = !Abierto && Boolean(Paso.Ir);
      return {
        Numero, Titulo: Paso.Titulo, Abierto, Ir: Paso.Ir,
        Subtitulo: Esactual ? 'Estás aquí · ' + Paso.Subtitulo.charAt(0).toLowerCase() + Paso.Subtitulo.slice(1) : Paso.Subtitulo,
        Enlace, Enlaceactual: Enlace && Esactual, Enlacenormal: Enlace && !Esactual, Fijo: !Abierto && !Paso.Ir,
        Hecho: Boolean(Paso.Hecho), Pendiente: !Paso.Hecho, Clase: Esactual ? 'is-actual' : ''
      };
    }),
    Planahorroporcentaje: Porcentaje,
    Planahorroancho: Porcentaje + '%',
    Planahorroetiqueta: 'Llevas el ' + Porcentaje + '% del ahorro que necesitas',
    Planplazos: Plazosahorro.map(Meses => ({ Etiqueta: Meses + ' meses', Activo: Meses === Plazo, Clase: Meses === Plazo ? 'is-activa' : '', Alclic: () => this.Cambiarestado({ Cuotainicialplazo: Meses }) })),
    Planahorromes: Formatoenteropesos(Mensual),
    Planmensaje: Mensaje,
    Planmensajeclase: Alerta ? 'is-alerta' : '',
    // Como independiente sin Caja, el subsidio puede cubrir buena parte de lo que falta
    Plansubsidiovisible: Estadoactual.Tipo === 'variable' && !Estadoactual.Caja && Calculo.Ingresototal <= 4 * Salariominimo && Tiporecomendado === 'vis' && Falta > 0,
    Plansubsidiomonto: '$' + Formatomillones(Subsidiopotencial(Calculo.Ingresototal)) + ' M',
    Irsubsidio: () => this.Cambiarestado({ Panel: 'subsidios', Menu: false })
  };
}
