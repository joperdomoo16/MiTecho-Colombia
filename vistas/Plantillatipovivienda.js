// Plantilla de la hoja «¿Qué es una vivienda VIS?»: qué es VIS y por qué la vivienda de la persona cuenta como VIS o No VIS

const Plantillatipovivienda = `
      <mt-if value="{{ Tipoviviendavisible }}">
        <div class="hoja-capa">
          <button type="button" class="hoja-velo" al-clic="{{ Cerrartipovivienda }}" aria-label="Cerrar"></button>
          <section class="hoja mt-sheet" role="dialog" aria-modal="true" aria-labelledby="titulo-tipo" aria-describedby="texto-tipo">
            <div class="hoja-manija" aria-hidden="true"></div>
            <div class="hoja-cabecera"><h2 id="titulo-tipo" class="hoja-titulo">{{ Tipohojatitulo }}</h2><button type="button" class="hoja-cerrar" al-clic="{{ Cerrartipovivienda }}" aria-label="Cerrar"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></div>
            <p id="texto-tipo" class="tipo-definicion"><b>VIS</b> significa <b>vivienda de interés social</b>. En {{ Tipociudad }} es la que cuesta hasta <b>{{ Tipotopetexto }}</b> ({{ Tipotopesalarios }} salarios mínimos de {{ Tipoanio }}).</p>
            <ul class="tipo-lista">
              <li><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg><span>El banco te presta hasta el <b>80%</b> del precio. En las demás viviendas, hasta el 70%.</span></li>
              <li><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg><span>Puedes pedir <b>subsidios</b> de tu Caja de compensación o del Gobierno.</span></li>
              <li><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg><span>Pagas <b>menos gastos</b> de notaría y registro.</span></li>
            </ul>
            <p class="tipo-caso {{ Tipocasoclase }}">{{ Tipohojacaso }}</p>
            <mt-if value="{{ Tipovolvervisible }}"><button type="button" class="boton-secundario" al-clic="{{ Volvertiporecomendado }}">Volver a la recomendada</button></mt-if>
            <div class="hoja-botones"><button type="button" class="boton-secundario" al-clic="{{ Verglosario }}">Ver glosario</button><button type="button" class="boton-primario" al-clic="{{ Cerrartipovivienda }}" autofocus="{{ true }}">Entendido</button></div>
          </section>
        </div>
      </mt-if>
`;
