// Plantilla de la pantalla «Viviendas en tu presupuesto» con filtro por ciudad, leyenda y proyectos de referencia

const Svgcheckvivienda = '<svg class="leyenda-ok" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';
const Svgrelojvivienda = '<svg class="leyenda-ahorro" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7.5V12l3 2"></path></svg>';
const Svgequisvivienda = '<svg class="leyenda-supera" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"></path></svg>';
const Svgpinvivienda = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z"></path><circle cx="12" cy="11" r="2"></circle></svg>';

const Plantillaingresosplan = `
        <mt-if value="{{ Pestanaes.ofertas }}">
          <div class="barra-detalle"><button type="button" class="volver" al-clic="{{ Viviendasvolveraccion }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg><span>{{ Viviendasvolver }}</span></button><span class="barra-detalle-espacio"></span><button type="button" class="barra-icono" al-clic="{{ Abrirayuda }}" aria-label="Ayuda y glosario"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.5M12 17h.01"></path></svg></button></div>
          <h1 class="titulo-detalle">Viviendas en tu presupuesto</h1>
          <div class="detalle-cuerpo">
            <p class="texto-guia">Proyectos de referencia para que te hagas una idea de lo que puedes comprar. No son ofertas de venta.</p>
            <div class="viviendas-resumen">
              <span class="viviendas-resumen-pildora">Presupuesto: hasta {{ Viviendaspresupuesto }}</span>
              <span class="viviendas-resumen-pildora">Ahorro: {{ Viviendasahorro }}</span>
            </div>
            <div class="viviendas-ciudades" role="group" aria-label="Ciudades que estás viendo">
              <mt-for list="{{ Ofertasfichas }}" as="Ofertaficha"><span class="ciudad-ficha"><span>{{ Ofertaficha.Etiqueta }}</span><button type="button" class="ciudad-quitar" al-clic="{{ Ofertaficha.Alquitar }}" aria-label="{{ Ofertaficha.Quitarlabel }}">×</button></span></mt-for>
              <button type="button" class="ciudad-agregar" al-clic="{{ Alternarofertasagregar }}"><mt-if value="{{ Ofertasagregarmas }}"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg></mt-if><span>{{ Ofertasagregaretiqueta }}</span></button>
            </div>
            <mt-if value="{{ Ofertasagregarabierto }}">
              <div class="viviendas-buscador-caja">
                <div class="viviendas-buscador-cabeza"><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg><input maxlength="40" class="viviendas-buscador-entrada" value="{{ Ofertasbusqueda }}" al-escribir="{{ Escribirofertasbusqueda }}" autoFocus="{{ true }}" placeholder="Buscar ciudad" aria-label="Buscar ciudad"></div>
                <div class="mt-scroll viviendas-buscador-lista">
                  <mt-for list="{{ Ofertasagregarlista }}" as="Ciudadagregar"><button type="button" class="viviendas-buscador-fila" al-clic="{{ Ciudadagregar.Alclic }}"><span class="viviendas-buscador-textos"><span class="viviendas-buscador-nombre">{{ Ciudadagregar.Nombreitem }}</span><span class="viviendas-buscador-depto">{{ Ciudadagregar.Departamento }}</span></span><span class="viviendas-buscador-conteo">{{ Ciudadagregar.Cantidad }}</span><span class="viviendas-buscador-mas" aria-hidden="true">+</span></button></mt-for>
                  <mt-if value="{{ Ofertasagregarvacio }}"><div class="viviendas-vacio">No encontramos esa ciudad.</div></mt-if>
                </div>
              </div>
            </mt-if>
            <ul class="viviendas-leyenda" aria-label="Qué significan los avisos" data-tutorial="ofertas">
              <li>${Svgcheckvivienda}<span>Te alcanza hoy: préstamo y ahorro.</span></li>
              <li>${Svgrelojvivienda}<span>El préstamo te alcanza; te falta ahorro.</span></li>
              <li>${Svgequisvivienda}<span>Cuesta más de lo que te prestan.</span></li>
            </ul>
            <mt-if value="{{ Ofertasninguna }}"><div class="viviendas-vacio">Agrega al menos una ciudad para ver proyectos.</div></mt-if>
            <mt-if value="{{ Ofertassinproyectos }}"><div class="viviendas-vacio">Aún no hay ejemplos cargados para esa ciudad. Puedes probar el precio de cualquier vivienda en Simular.</div></mt-if>
            <mt-for list="{{ Ofertastarjetas }}" as="Proyectofila">
              <article class="proyecto-tarjeta">
                <div class="proyecto-imagen-caja">
                  <img class="proyecto-imagen" src="assets/proyectos/{{ Proyectofila.Imagen }}.webp" alt="{{ Proyectofila.Imagenalt }}">
                  <span class="proyecto-etiqueta">{{ Proyectofila.Etiquetatipo }}</span>
                </div>
                <div class="proyecto-cuerpo">
                  <div class="proyecto-encabezado">
                    <div class="proyecto-titulos">
                      <h2 class="proyecto-nombre">{{ Proyectofila.Nombre }}</h2>
                      <span class="proyecto-ubicacion">${Svgpinvivienda}<span>{{ Proyectofila.Ubicacion }}</span></span>
                    </div>
                    <span class="proyecto-precio">{{ Proyectofila.Precio }}</span>
                  </div>
                  <mt-if value="{{ Proyectofila.Esok }}"><div class="proyecto-aviso is-ok">${Svgcheckvivienda}<span><b>Te alcanza hoy</b> con tu préstamo y tu ahorro.</span></div></mt-if>
                  <mt-if value="{{ Proyectofila.Esahorro }}"><div class="proyecto-aviso is-ahorro">${Svgrelojvivienda}<span><b>El préstamo te alcanza.</b> Te faltan {{ Proyectofila.Faltamonto }} de ahorro.</span></div></mt-if>
                  <mt-if value="{{ Proyectofila.Essupera }}"><div class="proyecto-aviso is-supera">${Svgequisvivienda}<span><b>Cuesta {{ Proyectofila.Superamonto }} más</b> de lo que hoy te prestan.</span></div></mt-if>
                  <mt-if value="{{ Proyectofila.Esok }}"><div class="proyecto-acciones"><button type="button" class="proyecto-boton" al-clic="{{ Proyectofila.Alinteres }}">Me interesa</button><button type="button" class="proyecto-boton" al-clic="{{ Proyectofila.Alahorrar }}">Cómo ahorrar</button></div></mt-if>
                  <mt-if value="{{ Proyectofila.Esahorro }}"><div class="proyecto-acciones"><button type="button" class="proyecto-boton" al-clic="{{ Proyectofila.Alinteres }}">Me interesa</button><button type="button" class="proyecto-boton" al-clic="{{ Proyectofila.Alahorrar }}">Cómo ahorrar</button></div></mt-if>
                  <mt-if value="{{ Proyectofila.Essupera }}"><button type="button" class="enlace proyecto-enlace" al-clic="{{ Proyectofila.Alsuperar }}"><span>{{ Proyectofila.Superaaccion }}</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button></mt-if>
                </div>
              </article>
            </mt-for>
            <mt-if value="{{ Ofertashaymas }}"><button type="button" class="boton-secundario viviendas-mas" al-clic="{{ Mostrarmasofertas }}">{{ Ofertasmastexto }}</button></mt-if>
            <p class="texto-pequeno viviendas-nota"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg><span>Con “Me interesa” la constructora te contacta solo si lo autorizas.</span></p>
          </div>
        </mt-if>
`;
