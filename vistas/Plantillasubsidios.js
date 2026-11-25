// Plantilla de «Caja y subsidios»: resumen potencial, tramos 2026, requisitos y configuración de afiliación y Sisbén

const Svgchecks = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';
const Svgavisos = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 2.5 20h19z"></path><path d="M12 10v4.5M12 17.2h.01"></path></svg>';
const Svgrelojs = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7.5V12l3 2"></path></svg>';
const Svginfos = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>';
const Svgequiss = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"></path></svg>';

const Plantillasubsidios = `
      <mt-if value="{{ Essubsidios }}">
        <div class="mt-scroll m3l detalle">
          <div class="barra-detalle"><button type="button" class="volver" al-clic="{{ Cerrarpanel }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg><span>{{ Subsidiosvolver }}</span></button><span class="barra-detalle-espacio"></span><button type="button" class="barra-icono" al-clic="{{ Abrirayuda }}" aria-label="Ayuda y glosario"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.5M12 17h.01"></path></svg></button></div>
          <h1 class="titulo-detalle">Caja y subsidios</h1>
          <div class="detalle-cuerpo">
            <p class="texto-guia">Un subsidio es dinero que no se devuelve y se suma a tu cuota inicial. Revisa si puedes pedirlo.</p>

            <section class="subsidios-heroe" aria-label="Subsidio potencial">
              <p class="subsidios-heroe-rotulo">{{ Subsidiosheroerotulo }}</p>
              <p class="subsidios-heroe-cifra"><span class="subsidios-heroe-valor">{{ Subsidiosheroecifra }}</span><span class="subsidios-heroe-millones">millones</span></p>
              <p class="subsidios-heroe-nota">{{ Subsidiosheroenota }}</p>
            </section>

            <section class="tarjeta">
              <h2 class="titulo-tarjeta">Cuánto dan según los ingresos del hogar</h2>
              <div class="subsidios-tramos">
                <div class="subsidios-tramo {{ Subsidiotramo1clase }}">
                  <div class="subsidios-tramo-textos"><span class="subsidios-tramo-rango">{{ Subsidiotramo1rango }}</span><mt-if value="{{ Subsidiotramo1hogar }}"><span class="subsidios-insignia">Tu hogar</span></mt-if></div>
                  <span class="subsidios-tramo-monto">{{ Subsidiotramo1monto }}</span>
                </div>
                <div class="subsidios-tramo {{ Subsidiotramo2clase }}">
                  <div class="subsidios-tramo-textos"><span class="subsidios-tramo-rango">{{ Subsidiotramo2rango }}</span><mt-if value="{{ Subsidiotramo2hogar }}"><span class="subsidios-insignia">Tu hogar</span></mt-if></div>
                  <span class="subsidios-tramo-monto">{{ Subsidiotramo2monto }}</span>
                </div>
                <div class="subsidios-tramo {{ Subsidiotramo3clase }}">
                  <div class="subsidios-tramo-textos"><span class="subsidios-tramo-rango">{{ Subsidiotramo3rango }}</span><mt-if value="{{ Subsidiotramo3hogar }}"><span class="subsidios-insignia">Tu hogar</span></mt-if></div>
                  <span class="subsidios-tramo-monto is-no">No aplica</span>
                </div>
              </div>
              <p class="texto-pequeno">Valores 2026 de Compensar, solo para vivienda VIS. El subsidio se le entrega a la constructora como parte de tu cuota inicial.</p>
            </section>

            <section class="tarjeta">
              <h2 class="titulo-tarjeta">Requisitos que suelen pedir</h2>
              <ul class="subsidios-requisitos">
                <li class="subsidios-requisito">
                  <mt-if value="{{ Subsidiosingresook }}"><span class="subsidios-requisito-icono is-ok" aria-hidden="true">${Svgchecks}</span></mt-if>
                  <mt-if value="{{ Subsidiosingresono }}"><span class="subsidios-requisito-icono is-no" aria-hidden="true">${Svgequiss}</span></mt-if>
                  <div class="subsidios-requisito-textos"><span class="subsidios-requisito-titulo">Ingresos del hogar de hasta {{ Subsidiosingresotope }}</span><span class="texto-pequeno">Tu hogar gana {{ Subsidiosingresohogar }} al mes.</span></div>
                </li>
                <li class="subsidios-requisito">
                  <mt-if value="{{ Subsidiosvisok }}"><span class="subsidios-requisito-icono is-ok" aria-hidden="true">${Svgchecks}</span></mt-if>
                  <mt-if value="{{ Subsidiosvisaviso }}"><span class="subsidios-requisito-icono is-aviso" aria-hidden="true">${Svgavisos}</span></mt-if>
                  <div class="subsidios-requisito-textos"><span class="subsidios-requisito-titulo">Comprar vivienda VIS</span><span class="texto-pequeno">{{ Subsidiosvisnota }}</span></div>
                </li>
                <li class="subsidios-requisito">
                  <mt-if value="{{ Subsidioscajaok }}"><span class="subsidios-requisito-icono is-ok" aria-hidden="true">${Svgchecks}</span></mt-if>
                  <mt-if value="{{ Subsidioscajafalta }}"><span class="subsidios-requisito-icono is-aviso" aria-hidden="true">${Svgavisos}</span></mt-if>
                  <div class="subsidios-requisito-textos"><span class="subsidios-requisito-titulo">Estar afiliado a una Caja aportando el 2%</span><span class="texto-pequeno">{{ Subsidioscajadetalle }}</span></div>
                </li>
                <li class="subsidios-requisito">
                  <mt-if value="{{ Subsidiosaportesok }}"><span class="subsidios-requisito-icono is-ok" aria-hidden="true">${Svgchecks}</span></mt-if>
                  <mt-if value="{{ Subsidiosaportesfalta }}"><span class="subsidios-requisito-icono is-aviso" aria-hidden="true">${Svgrelojs}</span></mt-if>
                  <div class="subsidios-requisito-textos"><span class="subsidios-requisito-titulo">12 meses de afiliación y aportes</span><span class="texto-pequeno">Es lo que pide Compensar a independientes. A empleados les piden 3 meses.</span></div>
                </li>
                <li class="subsidios-requisito">
                  <span class="subsidios-requisito-icono is-info" aria-hidden="true">${Svginfos}</span>
                  <div class="subsidios-requisito-textos"><span class="subsidios-requisito-titulo">No tener vivienda ni otro subsidio</span><span class="texto-pequeno">Aplica para todas las personas de tu hogar.</span></div>
                </li>
              </ul>
              <p class="texto-pequeno">Cada Caja define sus requisitos, fechas y cupos. Confírmalos con la tuya antes de postularte.</p>
            </section>

            <section class="tarjeta">
              <h2 class="titulo-tarjeta">Tu Caja de compensación</h2>
              <button type="button" class="interruptor-fila" role="switch" aria-checked="{{ Subsidioscajaactiva }}" al-clic="{{ Alternarcaja }}"><span>Estoy afiliado a una Caja</span><span class="interruptor {{ Subsidioscajaclase }}" aria-hidden="true"></span></button>
              <mt-if value="{{ Subsidioscajaactiva }}">
                <div class="subsidios-fichas" role="group" aria-label="Tu Caja"><mt-for list="{{ Subsidioscajafichas }}" as="Ficha"><button type="button" class="subsidios-ficha {{ Ficha.Clase }}" aria-pressed="{{ Ficha.Activa }}" al-clic="{{ Ficha.Alclic }}">{{ Ficha.Etiqueta }}</button></mt-for></div>
              </mt-if>
              <p class="texto-pequeno">Cuando te afilies, márcalo aquí. Así contamos desde cuándo aportas y te avisamos cuando puedas postularte.</p>
            </section>

            <section class="tarjeta">
              <h2 class="titulo-tarjeta">¿Ya te asignaron un subsidio?</h2>
              <div class="subsidios-campos">
                <label class="subsidios-campo"><span class="subsidios-campo-rotulo">Valor asignado</span><input class="subsidios-entrada" maxlength="15" inputMode="numeric" value="{{ Subsidiosasignadotexto }}" al-escribir="{{ Escribirsubsidioasignado }}" placeholder="$0"></label>
                <label class="subsidios-campo"><span class="subsidios-campo-rotulo">Vence</span><input class="subsidios-entrada" maxlength="10" value="{{ Subsidiosvence }}" al-escribir="{{ Escribirsubsidiovence }}" placeholder="mm/aaaa"></label>
              </div>
              <mt-if value="{{ Subsidiosvigenciavisible }}"><div class="subsidios-estado {{ Subsidiosvigenciaclase }}" role="status">{{ Subsidiosvigenciatexto }}</div></mt-if>
              <p class="texto-pequeno">Usamos el valor real en tu presupuesto y te avisamos antes de que venza.</p>
            </section>

            <section class="tarjeta">
              <button type="button" class="interruptor-fila" role="switch" aria-checked="{{ Subsidiossisbenactivo }}" al-clic="{{ Alternarsisben }}"><span>Tengo Sisbén</span><span class="interruptor {{ Subsidiossisbenclase }}" aria-hidden="true"></span></button>
              <mt-if value="{{ Subsidiossisbenactivo }}">
                <span class="subsidios-grupo-etiqueta">Grupo Sisbén IV</span>
                <div class="subsidios-fichas" role="group" aria-label="Grupo Sisbén IV"><mt-for list="{{ Subsidiossisbenfichas }}" as="Opcion"><button type="button" class="subsidios-ficha {{ Opcion.Clase }}" aria-pressed="{{ Opcion.Activa }}" al-clic="{{ Opcion.Alclic }}">{{ Opcion.Etiqueta }}</button></mt-for></div>
              </mt-if>
              <p class="texto-pequeno">Con Sisbén puedes postularte a subsidios de vivienda del Gobierno cuando haya cupos.</p>
            </section>

            <section class="tarjeta sim-avanzado">
              <button type="button" class="sim-avanzado-boton" al-clic="{{ Alternarsubsidiosavanzado }}" aria-expanded="{{ Subsidiosavanzado }}"><span class="sim-avanzado-textos"><span class="titulo-tarjeta sim-subtitulo">Cesantías y crédito preaprobado</span><span class="texto-pequeno">Datos opcionales de tu Caja o del FNA</span></span><svg class="sim-avanzado-flecha" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></button>
              <mt-if value="{{ Subsidiosavanzado }}"><div class="sim-avanzado-cuerpo">
                <div class="m4q" style="margin:0"><mt-for list="{{ Entidadpestanas }}" as="Pestanaentidad"><button type="button" al-clic="{{ Pestanaentidad.Alclic }}" style="border-radius:18px;background:{{ Pestanaentidad.Fondo }};color:{{ Pestanaentidad.Color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 6px">{{ Pestanaentidad.Etiqueta }}</button></mt-for></div>
                <mt-for list="{{ Entidadsecciones }}" as="Seccionentidad">
                  <div class="m4x" style="margin:0">
                    <div class="m4y"><span class="m4z">{{ Seccionentidad.Numeroseccion }}</span><span class="m2c">{{ Seccionentidad.Titulo }}</span></div>
                    <span class="m2f">{{ Seccionentidad.Descripcioncorta }}</span>
                    <mt-if value="{{ Seccionentidad.status }}"><div style="padding:10px 12px;border-radius:14px;background:{{ Seccionentidad.Estadofondo }};font:600 12.5px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A">{{ Seccionentidad.status }}</div></mt-if>
                    <mt-for list="{{ Seccionentidad.Campos }}" as="Campoentidad">
                      <mt-if value="{{ Campoentidad.Esfichas }}"><div class="m50"><span class="m42">{{ Campoentidad.Etiqueta }}</span><div class="m1w"><mt-for list="{{ Campoentidad.Opciones }}" as="Opcioncampo"><button type="button" al-clic="{{ Opcioncampo.Alclic }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ Opcioncampo.Borde }};background:{{ Opcioncampo.Fondo }};color:{{ Opcioncampo.Color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ Opcioncampo.Etiqueta }}</button></mt-for></div></div></mt-if>
                      <mt-if value="{{ Campoentidad.Escampo }}"><label class="m51"><span class="m42">{{ Campoentidad.Etiqueta }}</span><input maxlength="20" class="m52" value="{{ Campoentidad.Valorcampo }}" al-escribir="{{ Campoentidad.Alescribir }}" inputMode="{{ Campoentidad.Modoteclado }}" placeholder="{{ Campoentidad.Ejemplo }}" aria-label="{{ Campoentidad.Etiqueta }}"><mt-if value="{{ Campoentidad.Pista }}"><span class="m53">{{ Campoentidad.Pista }}</span></mt-if></label></mt-if>
                    </mt-for>
                  </div>
                </mt-for>
                <button type="button" class="boton-secundario boton-chico" al-clic="{{ Entidadlimpiar }}">Borrar datos de {{ Entidadpestananombre }}</button>
              </div></mt-if>
            </section>

            <button type="button" class="boton-primario" al-clic="{{ Guardarsubsidios }}">Guardar</button>
          </div>
        </div>
      </mt-if>
`;
