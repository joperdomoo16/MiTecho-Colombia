// Plantilla del recorrido guiado: capa que bloquea toques fuera del paso, recorte iluminado, tarjeta con flecha y hoja final

const Plantillatutorial = `
      <mt-if value="{{ Tutorialvisible }}">
        <div class="tutorial-capa" aria-hidden="true"></div>
        <mt-if value="{{ Tutorialtarjeta }}">
          <span class="tutorial-foco {{ Tutorialmodoclase }}" style="{{ Tutorialfoco }}" aria-hidden="true"></span>
          <section class="tutorial-tarjeta" style="{{ Tutorialposicion }}" role="dialog" aria-modal="true" aria-labelledby="tutorial-titulo" aria-describedby="tutorial-texto">
            <span class="tutorial-flecha {{ Tutorialflechaclase }}" style="{{ Tutorialflecha }}" aria-hidden="true"></span>
            <div class="tutorial-cuerpo">
              <img src="{{ Tutorialimagen }}" alt="" width="56" height="56">
              <div><h2 id="tutorial-titulo">{{ Tutorialtitulo }}</h2><p id="tutorial-texto" aria-live="polite">{{ Tutorialtexto }}</p></div>
            </div>
            <div class="tutorial-pie">
              <span class="tutorial-contador">{{ Tutorialcontador }}</span>
              <mt-if value="{{ Tutorialsaltar }}"><button type="button" class="tutorial-saltar" al-clic="{{ Tutorialsaltarclic }}">{{ Tutorialsaltartexto }}</button></mt-if>
              <button type="button" class="tutorial-siguiente" al-clic="{{ Tutorialsiguiente }}" autofocus="{{ true }}">{{ Tutorialboton }}</button>
            </div>
          </section>
        </mt-if>
        <mt-if value="{{ Tutorialhoja }}">
          <div class="tutorial-capa tutorial-capa--oscura {{ Tutorialmodoclase }}" aria-hidden="true"></div>
          <section class="tutorial-hoja" role="dialog" aria-modal="true" aria-labelledby="tutorial-titulo-final" aria-describedby="tutorial-texto-final">
            <button type="button" class="tutorial-cerrar" al-clic="{{ Tutorialsiguiente }}" aria-label="Cerrar">×</button>
            <img src="{{ Tutorialimagen }}" alt="" width="112" height="112">
            <h2 id="tutorial-titulo-final">{{ Tutorialtitulo }}</h2>
            <p id="tutorial-texto-final">{{ Tutorialtexto }}</p>
            <button type="button" class="tutorial-siguiente" al-clic="{{ Tutorialsiguiente }}" autofocus="{{ true }}">{{ Tutorialboton }}</button>
          </section>
        </mt-if>
      </mt-if>
`;
