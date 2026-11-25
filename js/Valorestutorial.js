// Posición del recorte iluminado, la tarjeta explicativa y su flecha según el espacio libre en pantalla

function Generarvalorestutorial() {
  const Actual = Recorridoactual(this);
  const Caja = this.Estadocomponente.Tutorialcaja;
  const Final = Boolean(Actual && Actual.Paso.Final);
  const Vacio = { Tutorialvisible: false, Tutorialtarjeta: false, Tutorialhoja: false };
  if (!Actual || (!Final && !Caja)) return Vacio;

  const Paso = Actual.Paso;
  const Ultimo = Actual.Indice >= Actual.Lista.length - 1;
  const Modoclase = this.Temaactual === 'claro' ? 'es-claro' : 'es-oscuro';

  let Textoboton = 'Siguiente';
  if (Final) Textoboton = 'Empezar';
  else if (Ultimo) Textoboton = 'Entendido';

  const Textosaltar = Actual.Tipo === 'recorrido' ? 'Saltar' : 'Omitir';
  const Contador = Actual.Lista.length > 1 ? (Actual.Indice + 1) + ' de ' + Actual.Lista.length : '';

  const Comun = {
    Tutorialvisible: true,
    Tutorialmodoclase: Modoclase,
    Tutorialimagen: 'assets/tutorial/' + Paso.Imagen + '.svg',
    Tutorialtitulo: Paso.Titulo,
    Tutorialtexto: Paso.Texto,
    Tutorialcontador: Contador,
    Tutorialboton: Textoboton,
    Tutorialsaltar: !Final,
    Tutorialsaltartexto: Textosaltar,
    Tutorialsiguiente: () => Avanzarrecorrido(this, false),
    Tutorialsaltarclic: () => Avanzarrecorrido(this, true)
  };
  if (Final) return { ...Vacio, ...Comun, Tutorialhoja: true };

  const Aire = Paso.Aire !== undefined ? Paso.Aire : 4;
  const Margenborde = Paso.Objetivo === 'barra' ? 0 : 4;
  const Arriba = Math.max(Margenborde, Caja.Arriba - Aire);
  const Izquierda = Math.max(Margenborde, Caja.Izquierda - Aire);
  const Derecha = Math.min(Caja.Marcoancho - Margenborde, Caja.Izquierda + Caja.Ancho + Aire);
  const Abajo = Math.min(Caja.Marcoalto - Margenborde, Caja.Arriba + Caja.Alto + Aire);
  const Ancho = Math.max(24, Derecha - Izquierda);
  const Alto = Math.max(24, Abajo - Arriba);

  const Radiobase = (Caja.Radio || 18) + Aire;
  let Radiofoco = Radiobase + 'px';
  if (Paso.Objetivo === 'barra' && Abajo >= Caja.Marcoalto - 2) {
    Radiofoco = Radiobase + 'px ' + Radiobase + 'px 0 0';
  }

  const Lado = 16;
  const Separacion = 14;
  const Altotarjeta = 184;
  const Topesuperior = Caja.Topesuperior || 12;
  const Topeinferior = 12;
  const Enbarrainferior = Paso.Objetivo === 'barra' || Paso.Objetivo === 'registrar';
  const Reservaabajo = Enbarrainferior ? Topeinferior : 80;

  const Espacioabajolibre = (Caja.Marcoalto - Reservaabajo) - (Abajo + Separacion);
  const Espacioabajototal = (Caja.Marcoalto - Topeinferior) - (Abajo + Separacion);
  const Espacioarriba = (Arriba - Separacion) - Topesuperior;

  let Debajo = true;
  if (Espacioabajolibre >= Altotarjeta) {
    Debajo = true;
  } else if (Espacioarriba >= Altotarjeta) {
    Debajo = false;
  } else {
    Debajo = Espacioabajototal >= Espacioarriba;
  }

  let Tutorialposicion;
  if (Debajo) {
    const Topetarjeta = Math.max(Topesuperior, Math.min(Abajo + Separacion, Caja.Marcoalto - Topeinferior - Altotarjeta));
    Tutorialposicion = 'top:' + Math.round(Topetarjeta) + 'px';
  } else {
    const Fondotarjeta = Math.max(Topeinferior, Math.min(Caja.Marcoalto - Arriba + Separacion, Caja.Marcoalto - Topesuperior - Altotarjeta));
    Tutorialposicion = 'bottom:' + Math.round(Fondotarjeta) + 'px';
  }

  const Centroreal = Caja.Izquierda + Caja.Ancho / 2;
  const Centroflecha = Math.min(Caja.Marcoancho - Lado - 22, Math.max(Lado + 22, Centroreal));
  const Flechaizquierda = Math.round(Centroflecha - Lado - 8);

  return {
    ...Vacio,
    ...Comun,
    Tutorialtarjeta: true,
    Tutorialfoco: 'top:' + Arriba + 'px;left:' + Izquierda + 'px;width:' + Ancho + 'px;height:' + Alto + 'px;border-radius:' + Radiofoco,
    Tutorialposicion,
    Tutorialflechaclase: Debajo ? 'es-arriba' : 'es-abajo',
    Tutorialflecha: 'left:' + Flechaizquierda + 'px'
  };
}
