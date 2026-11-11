// Recorrido guiado de la primera vez: oscurece la pantalla, deja iluminada una parte y explica para qué sirve.
// El recorrido inicial vive en Inicio; cada sección tiene además uno o dos consejos la primera vez que se abre.
// Cada parte que se ilumina lleva en la plantilla el atributo data-tutorial con el nombre de su objetivo.

const Pasosrecorrido = [
  { Objetivo: 'perfil', Imagen: 'Perfil', Titulo: 'Completa tu perfil financiero', Texto: 'Toca tu ícono para agregar ingresos, deudas, ahorro, Caja y Sisbén. Entre más datos, más cerca de la realidad queda tu techo.' },
  { Objetivo: 'techo', Imagen: 'Techo', Titulo: 'Este es tu techo', Texto: 'Es el precio de la vivienda que un banco podría financiarte según tus ingresos. Toca Entender para ver de dónde sale.' },
  { Objetivo: 'cuotainicial', Imagen: 'Ahorro', Titulo: 'Tu cuota inicial', Texto: 'Lo que ya tienes frente a lo que pide la vivienda, con los gastos de escritura incluidos.' },
  { Objetivo: 'barra', Imagen: 'Secciones', Titulo: 'Todo a un toque', Texto: 'Registros para anotar lo que ganas, Simulador para probar escenarios, Plan para apagar deudas y Ofertas para ver proyectos.' },
  { Objetivo: 'tasas', Imagen: 'Tasas', Titulo: 'Compara bancos', Texto: 'Tu cuota en cada entidad con datos de la Superintendencia Financiera. Es parte de MiTecho Pro.' },
  { Objetivo: '', Imagen: 'Listo', Titulo: '¡Listo para empezar!', Texto: 'Si tienes dudas, Ayuda y Soporte están siempre en tu ícono de perfil. Puedes volver a ver este recorrido desde el menú.', Final: true }
];

const Consejossecciones = {
  simulador: [
    { Objetivo: 'modalidad', Imagen: 'Simulador', Titulo: 'Elige el tipo de vivienda', Texto: 'En VIS el banco financia hasta el 80%, en No VIS hasta el 70%. Leasing es un arriendo con opción de compra al final.' },
    { Objetivo: 'tope', Imagen: 'Simulador', Titulo: 'Cuota máxima', Texto: 'La norma permite que la cuota llegue al 40% de tu ingreso libre. Con el modo conservador ves qué pasa si tu banco aplica 30%.' }
  ],
  ingresos: [
    { Objetivo: 'registrar', Imagen: 'Registro', Titulo: 'Anota en segundos', Texto: 'Con el botón + registras un ingreso o un gasto del día.' },
    { Objetivo: 'vistas', Imagen: 'Registro', Titulo: 'Día, mes y año', Texto: 'Tus registros se suman por mes. El promedio de los meses completos es el que mira el banco.' }
  ],
  plan: [{ Objetivo: 'plan', Imagen: 'Plan', Titulo: 'Apaga una deuda', Texto: 'Toca una deuda para ver cuánto más te prestaría el banco si la terminas de pagar.' }],
  ofertas: [{ Objetivo: 'ofertas', Imagen: 'Ofertas', Titulo: 'Qué significa cada color', Texto: 'Verde: puedes cerrar hoy. Amarillo: te alcanza el cupo, pero falta cuota inicial. Oscuro: supera tu cupo.' }],
  tasas: [{ Objetivo: 'oferta', Imagen: 'Tasas', Titulo: 'Compara una oferta', Texto: 'Si un banco te dio una tasa, escríbela aquí y mira si está por encima o por debajo del promedio.' }]
};

// Qué está mostrando el recorrido ahora mismo: el inicial, un consejo de sección o nada
function Recorridoactual(Componente) {
  const Estado = Componente.Estadocomponente;
  const Autorizado = typeof Versionpolitica === 'undefined' || Estado.Autorizacionversion === Versionpolitica;
  if (!Estado.Ingresado || Componente.Pantalla !== 'app' || !Autorizado || Estado.Menu || Estado.Ayuda || Estado.Hoja || Estado.Soporteabierto) return null;
  if (!Estado.Tutorialvisto) {
    if (Estado.Pestana !== 'inicio' || Estado.Panel) return null;
    const Paso = Math.min(Estado.Tutorialpaso || 0, Pasosrecorrido.length - 1);
    return { Tipo: 'recorrido', Seccion: '', Lista: Pasosrecorrido, Indice: Paso, Paso: Pasosrecorrido[Paso] };
  }
  const Seccion = Estado.Panel === 'tasas' ? (Estado.Pro ? 'tasas' : '') : Estado.Panel ? '' : Componente.Pestana === 'simulador' && Estado.Simuladorpaso === 'result' ? '' : Componente.Pestana;
  const Lista = Consejossecciones[Seccion];
  if (!Lista || (Estado.Consejosvistos || {})[Seccion]) return null;
  const Indice = Math.min(Estado.Consejopaso || 0, Lista.length - 1);
  return { Tipo: 'consejo', Seccion, Lista, Indice, Paso: Lista[Indice] };
}

// Pasa al siguiente paso o cierra el recorrido; al cerrar, ese recorrido queda como visto
function Avanzarrecorrido(Componente, Saltar) {
  const Actual = Recorridoactual(Componente);
  if (!Actual) return;
  const Ultimo = Saltar || Actual.Indice >= Actual.Lista.length - 1;
  if (Actual.Tipo === 'recorrido') {
    Componente.Cambiarestado(Ultimo ? { Tutorialvisto: true, Tutorialpaso: 0, Tutorialcaja: null } : { Tutorialpaso: Actual.Indice + 1, Tutorialcaja: null });
  } else {
    Componente.Cambiarestado(Ultimo
      ? Estadoprevio => ({ Consejosvistos: { ...(Estadoprevio.Consejosvistos || {}), [Actual.Seccion]: true }, Consejopaso: 0, Tutorialcaja: null })
      : { Consejopaso: Actual.Indice + 1, Tutorialcaja: null });
  }
}

// Después de cada dibujo mide dónde quedó la parte iluminada, relativa al marco de la app (que puede estar a escala)
function Medirrecorrido(Componente) {
  if (typeof document === 'undefined') return;
  // Al girar el celular o cambiar el tamaño de la ventana, la parte iluminada se vuelve a medir
  if (!Componente.Escucharecorrido) {
    Componente.Escucharecorrido = true;
    window.addEventListener('resize', () => Componente.Forzaractualizacion());
  }
  const Actual = Recorridoactual(Componente);
  const Estado = Componente.Estadocomponente;
  if (!Actual || !Actual.Paso.Objetivo) {
    if (Estado.Tutorialcaja) Componente.Cambiarestado({ Tutorialcaja: null });
    return;
  }
  const Elemento = document.querySelector('[data-tutorial="' + Actual.Paso.Objetivo + '"]');
  const Marco = document.querySelector('.m3');
  // Si esa parte no existe en esta pantalla (por ejemplo, la tarjeta de tasas sin datos), el paso se salta
  if (!Elemento || !Marco || !Elemento.getClientRects().length) {
    clearTimeout(Componente.Temporizadorrecorrido);
    Componente.Temporizadorrecorrido = setTimeout(() => {
      const Otra = Recorridoactual(Componente);
      if (Otra && Otra.Paso === Actual.Paso && !document.querySelector('[data-tutorial="' + Actual.Paso.Objetivo + '"]')) Avanzarrecorrido(Componente, false);
    }, 400);
    return;
  }
  const Rectanguloelemento = Elemento.getBoundingClientRect(), Rectangulomarco = Marco.getBoundingClientRect();
  const Escala = Rectangulomarco.width / (Marco.offsetWidth || Rectangulomarco.width) || 1;
  if (Rectanguloelemento.top < Rectangulomarco.top + 60 || Rectanguloelemento.bottom > Rectangulomarco.bottom - 80) {
    if (Componente.Ultimodesplazado !== Actual.Paso) {
      Componente.Ultimodesplazado = Actual.Paso;
      Elemento.scrollIntoView({ block: 'center' });
      requestAnimationFrame(() => Componente.Forzaractualizacion());
      return;
    }
  }
  const Caja = {
    Arriba: Math.round((Rectanguloelemento.top - Rectangulomarco.top) / Escala),
    Izquierda: Math.round((Rectanguloelemento.left - Rectangulomarco.left) / Escala),
    Ancho: Math.round(Rectanguloelemento.width / Escala),
    Alto: Math.round(Rectanguloelemento.height / Escala),
    Marcoancho: Math.round(Rectangulomarco.width / Escala),
    Marcoalto: Math.round(Rectangulomarco.height / Escala)
  };
  if (JSON.stringify(Caja) !== JSON.stringify(Estado.Tutorialcaja)) Componente.Cambiarestado({ Tutorialcaja: Caja });
}

