// Valores que pinta la plantilla del recorrido: dónde va el foco, dónde va la tarjeta y hacia dónde apunta la flecha

function Generarvalorestutorial() {
  const Actual = Recorridoactual(this);
  const Caja = this.Estadocomponente.Tutorialcaja;
  const Final = Boolean(Actual && Actual.Paso.Final);
  const Vacio = { Tutorialvisible: false, Tutorialtarjeta: false, Tutorialhoja: false };
  // La tarjeta sale solo cuando ya se midió la parte que va a iluminar; la hoja final no necesita medida
  if (!Actual || (!Final && !Caja)) return Vacio;

  const Paso = Actual.Paso, Ultimo = Actual.Indice >= Actual.Lista.length - 1;
  const Comun = {
    Tutorialvisible: true,
    Tutorialimagen: 'assets/tutorial/' + Paso.Imagen + '.svg',
    Tutorialtitulo: Paso.Titulo,
    Tutorialtexto: Paso.Texto,
    Tutorialcontador: Actual.Lista.length > 1 ? (Actual.Indice + 1) + ' de ' + Actual.Lista.length : '',
    Tutorialboton: Final ? 'Empezar' : Ultimo ? 'Entendido' : 'Siguiente',
    Tutorialsaltar: !Ultimo,
    Tutorialsiguiente: () => Avanzarrecorrido(this, false),
    Tutorialsaltarclic: () => Avanzarrecorrido(this, true)
  };
  if (Final) return { ...Vacio, ...Comun, Tutorialhoja: true };

  // El foco deja un poco de aire alrededor de la parte iluminada sin salirse del marco
  const Aire = 8, Lado = 16, Altotarjeta = 190;
  const Arriba = Caja.Arriba - Aire, Izquierda = Math.max(4, Caja.Izquierda - Aire);
  const Ancho = Math.min(Caja.Marcoancho - Izquierda - 4, Caja.Ancho + Aire * 2), Alto = Caja.Alto + Aire * 2;
  // La tarjeta va debajo si cabe; si no, encima, donde haya más espacio
  const Espacioabajo = Caja.Marcoalto - (Arriba + Alto + 14), Espacioarriba = Arriba - 14;
  const Debajo = Espacioabajo >= Altotarjeta || Espacioabajo > Espacioarriba;
  const Centro = Math.min(Caja.Marcoancho - Lado - 24, Math.max(Lado + 24, Caja.Izquierda + Caja.Ancho / 2));
  return {
    ...Vacio,
    ...Comun,
    Tutorialtarjeta: true,
    Tutorialfoco: 'top:' + Arriba + 'px;left:' + Izquierda + 'px;width:' + Ancho + 'px;height:' + Alto + 'px',
    Tutorialposicion: Debajo ? 'top:' + (Arriba + Alto + 14) + 'px' : 'bottom:' + (Caja.Marcoalto - Arriba + 14) + 'px',
    Tutorialflecha: (Debajo ? 'top:-7px' : 'bottom:-7px') + ';left:' + Math.round(Centro - Lado - 8) + 'px'
  };
}
