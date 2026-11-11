// Plantilla del recorrido guiado: capa que bloquea los toques, foco que ilumina una parte, tarjeta con flecha
// y, al final, una hoja que sube desde abajo con el botón Empezar

const Plantillatutorial = `
      <sc-if value="{{ Tutorialvisible }}" hint-placeholder-val="{{ false }}">
        <div class="tutorial-capa" aria-hidden="true"></div>
        <sc-if value="{{ Tutorialtarjeta }}" hint-placeholder-val="{{ false }}">
          <span class="tutorial-foco" style="{{ Tutorialfoco }}" aria-hidden="true"></span>
          <section class="tutorial-tarjeta" style="{{ Tutorialposicion }}" role="dialog" aria-modal="true" aria-labelledby="tutorial-titulo" aria-describedby="tutorial-texto">
            <span class="tutorial-flecha" style="{{ Tutorialflecha }}" aria-hidden="true"></span>
            <div class="tutorial-cuerpo">
              <img src="{{ Tutorialimagen }}" alt="" width="56" height="56">
              <div><h2 id="tutorial-titulo">{{ Tutorialtitulo }}</h2><p id="tutorial-texto" aria-live="polite">{{ Tutorialtexto }}</p></div>
            </div>
            <div class="tutorial-pie">
              <span class="tutorial-contador">{{ Tutorialcontador }}</span>
              <sc-if value="{{ Tutorialsaltar }}" hint-placeholder-val="{{ true }}"><button type="button" class="tutorial-saltar" al-clic="{{ Tutorialsaltarclic }}">Saltar</button></sc-if>
              <button type="button" class="tutorial-siguiente" al-clic="{{ Tutorialsiguiente }}" autofocus="{{ true }}">{{ Tutorialboton }}</button>
            </div>
          </section>
        </sc-if>
        <sc-if value="{{ Tutorialhoja }}" hint-placeholder-val="{{ false }}">
          <div class="tutorial-capa tutorial-capa--oscura" aria-hidden="true"></div>
          <section class="tutorial-hoja" role="dialog" aria-modal="true" aria-labelledby="tutorial-titulo-final" aria-describedby="tutorial-texto-final">
            <button type="button" class="tutorial-cerrar" al-clic="{{ Tutorialsiguiente }}" aria-label="Cerrar">×</button>
            <img src="{{ Tutorialimagen }}" alt="" width="112" height="112">
            <h2 id="tutorial-titulo-final">{{ Tutorialtitulo }}</h2>
            <p id="tutorial-texto-final">{{ Tutorialtexto }}</p>
            <button type="button" class="tutorial-siguiente" al-clic="{{ Tutorialsiguiente }}" autofocus="{{ true }}">{{ Tutorialboton }}</button>
          </section>
        </sc-if>
      </sc-if>
`;
