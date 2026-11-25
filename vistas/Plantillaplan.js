// Plantilla de Mi plan: los seis pasos para comprar vivienda; el paso del ahorro se abre con su plan cuando es en el que va la persona

const Plantillaplan = `
        <mt-if value="{{ Pestanaes.plan }}">
        <div class="plan">
          <div class="inicio-saludo" data-tutorial="plan"><h1 class="titulo-pantalla">Mi plan</h1><p class="texto-guia">{{ Planintro }}</p></div>
          <ol class="plan-pasos" aria-label="Pasos para comprar tu vivienda">
            <mt-for list="{{ Planpasos }}" as="Paso">
              <li>
                <mt-if value="{{ Paso.Abierto }}">
                  <div class="tarjeta plan-ahorro">
                    <div class="plan-ahorro-cabecera"><span class="plan-insignia is-actual" aria-hidden="true">{{ Paso.Numero }}</span><span class="plan-paso-textos"><span class="plan-paso-titulo">{{ Paso.Titulo }}</span><span class="texto-pequeno">{{ Paso.Subtitulo }}</span></span></div>
                    <div class="progreso" role="progressbar" aria-label="{{ Planahorroetiqueta }}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{ Planahorroporcentaje }}"><div class="progreso-relleno" style="width:{{ Planahorroancho }}"></div></div>
                    <div class="plan-plazo">
                      <span id="plazo-ahorro" class="plan-pregunta">¿En cuánto tiempo quieres comprar?</span>
                      <div class="opciones" role="group" aria-labelledby="plazo-ahorro"><mt-for list="{{ Planplazos }}" as="Plazo"><button type="button" class="opcion {{ Plazo.Clase }}" aria-pressed="{{ Plazo.Activo }}" al-clic="{{ Plazo.Alclic }}">{{ Plazo.Etiqueta }}</button></mt-for></div>
                    </div>
                    <div class="plan-cifra"><span class="texto-pequeno">Tendrías que ahorrar</span><span class="plan-cifra-valor">{{ Planahorromes }} <span class="plan-cifra-mes">al mes</span></span><span class="texto-pequeno plan-mensaje {{ Planmensajeclase }}">{{ Planmensaje }}</span></div>
                    <mt-if value="{{ Plansubsidiovisible }}">
                      <div class="aviso-suave"><span class="aviso-suave-icono" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11z"></path></svg></span><div class="aviso-suave-textos"><p class="aviso-suave-texto"><b>¿Trabajas como independiente?</b> Si te afilias a una Caja de compensación aportando el 2%, podrías postularte a un subsidio de hasta <b>{{ Plansubsidiomonto }}</b> para tu cuota inicial. En Compensar, por ejemplo, piden 12 meses de aportes.</p><button type="button" class="enlace" al-clic="{{ Irsubsidio }}">Ver si puedo pedirlo<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button></div></div>
                    </mt-if>
                  </div>
                </mt-if>
                <mt-if value="{{ Paso.Enlace }}">
                  <button type="button" class="plan-paso {{ Paso.Clase }}" al-clic="{{ Paso.Ir }}"><mt-if value="{{ Paso.Hecho }}"><span class="plan-insignia is-hecho" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span><span class="solo-lector">Paso completado.</span></mt-if><mt-if value="{{ Paso.Pendiente }}"><span class="plan-insignia {{ Paso.Clase }}" aria-hidden="true">{{ Paso.Numero }}</span></mt-if><span class="plan-paso-textos"><span class="plan-paso-titulo">{{ Paso.Titulo }}</span><span class="texto-pequeno">{{ Paso.Subtitulo }}</span></span><svg aria-hidden="true" class="plan-paso-flecha" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></button>
                </mt-if>
                <mt-if value="{{ Paso.Fijo }}">
                  <div class="plan-paso {{ Paso.Clase }}"><mt-if value="{{ Paso.Hecho }}"><span class="plan-insignia is-hecho" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span><span class="solo-lector">Paso completado.</span></mt-if><mt-if value="{{ Paso.Pendiente }}"><span class="plan-insignia {{ Paso.Clase }}" aria-hidden="true">{{ Paso.Numero }}</span></mt-if><span class="plan-paso-textos"><span class="plan-paso-titulo">{{ Paso.Titulo }}</span><span class="texto-pequeno">{{ Paso.Subtitulo }}</span></span></div>
                </mt-if>
              </li>
            </mt-for>
          </ol>
        </div>
        </mt-if>
`;
