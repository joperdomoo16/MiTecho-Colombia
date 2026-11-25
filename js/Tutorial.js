// Recorrido inicial en Inicio y consejos puntuales la primera vez que se entra a cada sección.
// Cada bloque resaltado se marca en su plantilla con el atributo data-tutorial.

const Pasosrecorrido = [
  { Objetivo: 'perfil', Imagen: 'Perfil', Aire: 4, Titulo: 'Completa tu perfil financiero', Texto: 'Toca tu ícono para agregar ingresos, deudas, ahorro, Caja y Sisbén. Entre más datos completes, más real queda tu presupuesto.' },
  { Objetivo: 'techo', Imagen: 'Techo', Aire: 4, Titulo: 'Este es tu presupuesto', Texto: 'Es el precio de la vivienda que un banco podría financiarte según tus ingresos y tus deudas. Toca ¿Cómo lo calculamos? para ver de dónde sale.' },
  { Objetivo: 'cuotainicial', Imagen: 'Ahorro', Aire: 4, Titulo: 'Tu ahorro para comprar', Texto: 'Lo que ya tienes frente a lo que pide la vivienda, con la notaría y el registro incluidos.' },
  { Objetivo: 'barra', Imagen: 'Secciones', Aire: 2, Titulo: 'Todo a un toque', Texto: 'Mi plan para avanzar paso a paso, Registrar para anotar lo que ganas o gastas, Simular para probar escenarios y Movimientos para ver tus registros.' },
  { Objetivo: 'siguiente', Imagen: 'Plan', Aire: 4, Titulo: 'Tu siguiente paso', Texto: 'Te decimos qué hacer ahora para acercarte a tu vivienda: pedir un subsidio, terminar de pagar una deuda o ahorrar un poco más.' },
  { Objetivo: '', Imagen: 'Listo', Titulo: '¡Listo para empezar!', Texto: 'Si tienes dudas, Ayuda y Soporte están siempre en tu ícono de perfil. Puedes volver a ver este recorrido desde el menú.', Final: true }
];

const Consejossecciones = {
  ingresos: [
    { Objetivo: 'registrar', Imagen: 'Registro', Aire: 4, Titulo: 'Anota en segundos', Texto: 'Con el botón Registrar anotas un ingreso o un gasto del día.' },
    { Objetivo: 'vistas', Imagen: 'Registro', Aire: 3, Titulo: 'Hoy, este mes y este año', Texto: 'Tus registros se suman por mes. El promedio de los meses completos es el que mira el banco.' }
  ],
  plan: [
    { Objetivo: 'plan', Imagen: 'Plan', Aire: 4, Titulo: 'Tu camino paso a paso', Texto: 'Este es el paso en el que vas hoy. También puedes tocar cualquiera de los otros pasos para revisar qué sigue.' }
  ],
  ofertas: [
    { Objetivo: 'ofertas', Imagen: 'Ofertas', Aire: 4, Titulo: 'Qué significa cada aviso', Texto: 'El chulo verde indica que te alcanza hoy; el reloj amarillo, que te falta ahorro; y la equis naranja, que supera tu préstamo.' }
  ],
  tasas: [
    { Objetivo: 'oferta', Imagen: 'Tasas', Aire: 4, Titulo: 'Compara una oferta', Texto: 'Si un banco te dio una tasa, escríbela aquí y mira si está por encima o por debajo del promedio.' }
  ]
};

function Hayventanaencima(Estado) {
  return Boolean(
    Estado.Menu || Estado.Ayuda || Estado.Hoja || Estado.Soporteabierto ||
    Estado.Tipoviviendaabierto || Estado.Calculoabierto || Estado.Avisoinvitado ||
    Estado.Eliminacionabierta || Estado.Vinculacionpendiente || Estado.Perfildato
  );
}

function Recorridoactual(Componente) {
  const Estado = Componente.Estadocomponente;
  const Autorizado = typeof Versionpolitica === 'undefined' || Estado.Autorizacionversion === Versionpolitica;
  if (!Estado.Ingresado || Componente.Pantalla !== 'app' || !Autorizado || Hayventanaencima(Estado)) return null;

  if (!Estado.Tutorialvisto) {
    if (Estado.Pestana !== 'inicio' || Estado.Panel) return null;
    const Paso = Math.min(Estado.Tutorialpaso || 0, Pasosrecorrido.length - 1);
    return { Tipo: 'recorrido', Seccion: '', Lista: Pasosrecorrido, Indice: Paso, Paso: Pasosrecorrido[Paso] };
  }

  let Seccion = '';
  if (Estado.Panel === 'tasas') {
    if (Estado.Pro || Estado.Desbloqueadotasas) Seccion = 'tasas';
  } else if (!Estado.Panel) {
    if (!(Componente.Pestana === 'simulador' && Estado.Simuladorpaso === 'result')) {
      Seccion = Componente.Pestana;
    }
  }
  const Lista = Consejossecciones[Seccion];
  if (!Lista || (Estado.Consejosvistos || {})[Seccion]) return null;
  const Indice = Math.min(Estado.Consejopaso || 0, Lista.length - 1);
  return { Tipo: 'consejo', Seccion, Lista, Indice, Paso: Lista[Indice] };
}

function Avanzarrecorrido(Componente, Saltar) {
  const Actual = Recorridoactual(Componente);
  if (!Actual) return;
  const Ultimo = Saltar || Actual.Indice >= Actual.Lista.length - 1;
  if (Actual.Tipo === 'recorrido') {
    if (Ultimo) {
      Componente.Cambiarestado({ Tutorialvisto: true, Tutorialpaso: 0, Tutorialcaja: null });
    } else {
      Componente.Cambiarestado({ Tutorialpaso: Actual.Indice + 1, Tutorialcaja: null });
    }
    return;
  }
  if (Ultimo) {
    Componente.Cambiarestado(Estadoprevio => ({
      Consejosvistos: { ...(Estadoprevio.Consejosvistos || {}), [Actual.Seccion]: true },
      Consejopaso: 0,
      Tutorialcaja: null
    }));
  } else {
    Componente.Cambiarestado({ Consejopaso: Actual.Indice + 1, Tutorialcaja: null });
  }
}

function Elementorecorridovalido(Elemento) {
  if (!Elemento || !Elemento.getClientRects().length) return false;
  if (typeof Elemento.closest === 'function' && Elemento.closest('[aria-hidden="true"], [inert]')) return false;
  return true;
}

// Obtiene el borde exacto de la pieza visual sin tragarse espacio vacío alrededor
function Calcularbordesobjetivo(Elemento, Objetivo) {
  if (Objetivo === 'perfil') {
    const Circulo = Elemento.querySelector('.barra-avatar-circulo') || Elemento;
    const Rectangulo = Circulo.getBoundingClientRect();
    return { Izquierda: Rectangulo.left, Arriba: Rectangulo.top, Derecha: Rectangulo.right, Abajo: Rectangulo.bottom, Radio: 19 };
  }
  if (Objetivo === 'vistas') {
    const Botones = Array.from(Elemento.querySelectorAll('.periodo')).filter(Nodo => Nodo.getClientRects().length > 0);
    if (Botones.length > 0) {
      const Rectangulos = Botones.map(Nodo => Nodo.getBoundingClientRect());
      return {
        Izquierda: Math.min(...Rectangulos.map(Item => Item.left)),
        Arriba: Math.min(...Rectangulos.map(Item => Item.top)),
        Derecha: Math.max(...Rectangulos.map(Item => Item.right)),
        Abajo: Math.max(...Rectangulos.map(Item => Item.bottom)),
        Radio: 22
      };
    }
  }
  const Base = Elemento.getBoundingClientRect();
  let Izquierda = Base.left;
  let Arriba = Base.top;
  let Derecha = Base.right;
  let Abajo = Base.bottom;
  const Botonmas = Elemento.querySelector('.pestana-mas');
  if (Botonmas && Botonmas.getClientRects().length) {
    const Rectmas = Botonmas.getBoundingClientRect();
    Izquierda = Math.min(Izquierda, Rectmas.left);
    Arriba = Math.min(Arriba, Rectmas.top);
    Derecha = Math.max(Derecha, Rectmas.right);
    Abajo = Math.max(Abajo, Rectmas.bottom);
  }
  let Radio = 18;
  if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
    const Leido = parseFloat(window.getComputedStyle(Elemento).borderTopLeftRadius);
    if (Leido > 0) Radio = Leido;
  }
  return { Izquierda, Arriba, Derecha, Abajo, Radio };
}

// Mide la pieza iluminada descontando el borde físico del marco .m3 y su escala en pantalla
function Medirrecorrido(Componente) {
  if (typeof document === 'undefined') return;
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
  if (!Marco || !Elementorecorridovalido(Elemento)) {
    if (Estado.Tutorialcaja) Componente.Cambiarestado({ Tutorialcaja: null });
    clearTimeout(Componente.Temporizadorrecorrido);
    Componente.Temporizadorrecorrido = setTimeout(() => {
      const Otra = Recorridoactual(Componente);
      const Destino = Otra && Otra.Paso.Objetivo ? document.querySelector('[data-tutorial="' + Otra.Paso.Objetivo + '"]') : null;
      if (Otra && Otra.Paso === Actual.Paso && !Elementorecorridovalido(Destino)) {
        Avanzarrecorrido(Componente, false);
      }
    }, 250);
    return;
  }

  const Rectangulomarco = Marco.getBoundingClientRect();
  const Escala = Rectangulomarco.width / (Marco.offsetWidth || Rectangulomarco.width) || 1;
  const Origenx = Rectangulomarco.left + (Marco.clientLeft || 0) * Escala;
  const Origeny = Rectangulomarco.top + (Marco.clientTop || 0) * Escala;
  const Marcoancho = Marco.clientWidth || Math.round(Rectangulomarco.width / Escala);
  const Marcoalto = Marco.clientHeight || Math.round(Rectangulomarco.height / Escala);
  const Isla = Marco.querySelector('.m4');
  const Topesuperior = Isla && Isla.getClientRects().length ? 56 : 12;

  const Bordes = Calcularbordesobjetivo(Elemento, Actual.Paso.Objetivo);
  const Arribareal = (Bordes.Arriba - Origeny) / Escala;
  const Abajoreal = (Bordes.Abajo - Origeny) / Escala;
  const Encontenedorscroll = typeof Elemento.closest === 'function' && Boolean(Elemento.closest('.mt-scroll'));

  if (Encontenedorscroll && (Arribareal < Topesuperior + 8 || Abajoreal > Marcoalto - 84)) {
    if (Componente.Ultimodesplazado !== Actual.Paso) {
      Componente.Ultimodesplazado = Actual.Paso;
      Elemento.scrollIntoView({ block: 'center' });
      requestAnimationFrame(() => Componente.Forzaractualizacion());
      return;
    }
  }

  const Caja = {
    Arriba: Math.round(Arribareal),
    Izquierda: Math.round((Bordes.Izquierda - Origenx) / Escala),
    Ancho: Math.round((Bordes.Derecha - Bordes.Izquierda) / Escala),
    Alto: Math.round((Bordes.Abajo - Bordes.Arriba) / Escala),
    Radio: Math.round(Bordes.Radio),
    Topesuperior,
    Marcoancho,
    Marcoalto
  };
  if (JSON.stringify(Caja) !== JSON.stringify(Estado.Tutorialcaja)) {
    Componente.Cambiarestado({ Tutorialcaja: Caja });
  }
}
