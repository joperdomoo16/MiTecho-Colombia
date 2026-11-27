// Plantilla de la hoja «Así calculamos tu presupuesto»: los cuatro pasos que llevan del ingreso al precio de la vivienda

const Plantillacalculo = `
      <mt-if value="{{ Calculovisible }}">
        <div class="hoja-capa">
          <button type="button" class="hoja-velo" al-clic="{{ Cerrarcalculo }}" aria-label="Cerrar"></button>
          <section class="hoja mt-sheet" role="dialog" aria-modal="true" aria-labelledby="titulo-calculo">
            <div class="hoja-manija" aria-hidden="true"></div>
            <div class="hoja-cabecera"><h2 id="titulo-calculo" class="hoja-titulo">Así calculamos tu presupuesto</h2><button type="button" class="hoja-cerrar" al-clic="{{ Cerrarcalculo }}" aria-label="Cerrar"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></div>
            <ol class="calculo-pasos">
              <mt-for list="{{ Calculopasos }}" as="Pasocalculo">
                <li class="calculo-paso"><span class="calculo-numero" aria-hidden="true">{{ Pasocalculo.Numero }}</span><div class="calculo-textos"><span class="calculo-titulo">{{ Pasocalculo.Titulo }}</span><span class="texto-pequeno">{{ Pasocalculo.Detalle }}</span><span class="calculo-valor">{{ Pasocalculo.Valor }}</span></div></li>
              </mt-for>
            </ol>
            <p class="hoja-nota"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg><span>Es un estimado con las reglas de la Superintendencia Financiera. La aprobación final la da el banco cuando estudia tu caso.</span></p>
            <div class="hoja-botones"><button type="button" class="boton-secundario" al-clic="{{ Probarcambios }}">Probar cambios</button><button type="button" class="boton-primario" al-clic="{{ Cerrarcalculo }}" autofocus="{{ true }}">Entendido</button></div>
          </section>
        </div>
      </mt-if>
`;
