// Plantilla de «Tu reporte en PDF»: vista previa del documento, contenido incluido y descarga

const Svgcheckreporte = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';

const Plantillareporte = `
      <mt-if value="{{ Esreporte }}">
        <div class="mt-scroll m3l detalle">
          <div class="barra-detalle"><button type="button" class="volver" al-clic="{{ Cerrarpanel }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg><span>{{ Reportevolver }}</span></button><span class="barra-detalle-espacio"></span><button type="button" class="barra-icono" al-clic="{{ Abrirayuda }}" aria-label="Ayuda y glosario"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.5M12 17h.01"></path></svg></button></div>
          <h1 class="titulo-detalle">Tu reporte en PDF</h1>
          <div class="detalle-cuerpo">
            <p class="texto-guia">Un resumen de tus cifras para llevar al banco o a la constructora.</p>
            <figure class="reporte-hoja" aria-label="Vista previa del reporte">
              <div class="reporte-hoja-cabeza">
                <span class="reporte-hoja-marca"><img class="reporte-hoja-logo" src="assets/Logoapp.webp" width="128" height="128" alt="">MiTecho</span>
                <span class="reporte-hoja-fecha">{{ Reportefecha }}</span>
              </div>
              <div class="reporte-hoja-titulos">
                <h2 class="reporte-hoja-titulo">Reporte de capacidad para comprar vivienda</h2>
                <p class="reporte-hoja-sub">{{ Reporteperfilresumen }}</p>
              </div>
              <div class="reporte-celdas">
                <div class="reporte-celda"><span class="reporte-celda-rotulo">Vivienda hasta</span><span class="reporte-celda-valor">\${{ Preciodestacado }} M</span></div>
                <div class="reporte-celda"><span class="reporte-celda-rotulo">Préstamo del banco</span><span class="reporte-celda-valor">{{ Creditomillones }}</span></div>
                <div class="reporte-celda"><span class="reporte-celda-rotulo">Cuota inicial</span><span class="reporte-celda-valor">{{ Heroepropiomillones }}</span></div>
                <div class="reporte-celda"><span class="reporte-celda-rotulo">Cuota mensual</span><span class="reporte-celda-valor">{{ Cuotamensual }}</span></div>
              </div>
              <div class="reporte-barra" aria-hidden="true"><span class="reporte-tramo-banco" style="flex:{{ Heroebancopeso }}"></span><span class="reporte-tramo-propio" style="flex:{{ Heroepropiopeso }}"></span></div>
              <p class="reporte-hoja-pie">Estimado teórico de MiTecho. No es una aprobación de crédito.</p>
            </figure>

            <section class="tarjeta">
              <h2 class="titulo-tarjeta">Qué incluye</h2>
              <ul class="reporte-incluye">
                <li>${Svgcheckreporte}<span>Tus ingresos y lo que pagas de deudas</span></li>
                <li>${Svgcheckreporte}<span>Cuánto te prestaría el banco, a qué plazo y con qué tasa</span></li>
                <li>${Svgcheckreporte}<span>Lo que necesitas para comprar y cuánto te falta</span></li>
                <li>${Svgcheckreporte}<span>Ideas para subir tu presupuesto</span></li>
              </ul>
            </section>

            <div class="reporte-aviso">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>
              <span>Es un estimado de MiTecho. No es un certificado ni una aprobación de un banco.</span>
            </div>

            <mt-if value="{{ Reporteinicio }}">
              <button type="button" class="boton-primario" al-clic="{{ Acciondescargarreporte }}">
                <mt-if value="{{ Reportemuestravideo }}"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M10 8.5l6 3.5-6 3.5z"></path></svg></mt-if>
                <mt-if value="{{ Reportedesbloqueado }}"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"></path></svg></mt-if>
                <span>{{ Reportebotontexto }}</span>
              </button>
              <p class="texto-pequeno reporte-centro">{{ Reportepienota }}</p>
            </mt-if>

            <mt-if value="{{ Reportelisto }}">
              <section class="tarjeta reporte-listo" role="status">
                <div class="reporte-listo-cabeza">
                  <span class="reporte-listo-check" aria-hidden="true">${Svgcheckreporte}</span>
                  <div class="reporte-listo-textos">
                    <h2 class="reporte-listo-titulo">Tu reporte está listo</h2>
                    <p class="texto-pequeno">Ábrelo para guardarlo en Descargas como PDF o compartirlo.</p>
                  </div>
                </div>
                <div class="reporte-listo-acciones">
                  <button type="button" class="boton-secundario boton-chico" al-clic="{{ Abrirreporte }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6zM14 3v4h4"></path></svg><span>Abrir</span></button>
                  <button type="button" class="boton-secundario boton-chico" al-clic="{{ Compartirreporte }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"></path></svg><span>Compartir</span></button>
                </div>
              </section>
            </mt-if>
          </div>
        </div>
      </mt-if>
`;
