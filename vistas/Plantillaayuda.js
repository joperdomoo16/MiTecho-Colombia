// Plantilla de «Ayuda»: buscador, temas, preguntas frecuentes, glosario y contacto a soporte

const Plantillaayuda = `
      <mt-if value="{{ Ayudapantalla }}">
        <div class="mt-scroll m3l detalle ayuda-capa">
          <div class="barra-detalle"><button type="button" class="volver" al-clic="{{ Cerrarayuda }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg><span>{{ Ayudavolver }}</span></button></div>
          <h1 class="titulo-detalle">Ayuda</h1>
          <div class="detalle-cuerpo">
            <p class="texto-guia">Respuestas cortas y sin letra pequeña.</p>

            <label class="ayuda-buscador">
              <span class="solo-lector">Buscar en la ayuda</span>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>
              <input class="ayuda-buscador-entrada" type="search" maxlength="60" value="{{ Ayudabusqueda }}" al-escribir="{{ Escribirayudabusqueda }}" placeholder="Buscar VIS, subsidio, tasa...">
            </label>

            <h2 class="ayuda-seccion">Temas</h2>
            <div class="ayuda-temas">
              <mt-for list="{{ Ayudatemas }}" as="Tema">
                <button type="button" class="ayuda-tema {{ Tema.Clase }}" aria-pressed="{{ Tema.Activa }}" al-clic="{{ Tema.Alclic }}">
                  <span class="ayuda-tema-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{ Tema.Icono }}"></path></svg></span>
                  <span class="ayuda-tema-titulo">{{ Tema.Titulo }}</span>
                  <span class="ayuda-tema-conteo">{{ Tema.Conteo }}</span>
                </button>
              </mt-for>
            </div>

            <h2 class="ayuda-seccion">Preguntas frecuentes</h2>
            <section class="tarjeta ayuda-acordeon">
              <mt-for list="{{ Ayudapreguntas }}" as="Item">
                <div class="ayuda-pregunta">
                  <button type="button" class="ayuda-pregunta-boton" aria-expanded="{{ Item.Abiertatexto }}" al-clic="{{ Item.Alternar }}">
                    <span>{{ Item.Pregunta }}</span>
                    <svg class="ayuda-pregunta-flecha {{ Item.Flechaclase }}" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
                  </button>
                  <mt-if value="{{ Item.Abierta }}"><p class="ayuda-respuesta">{{ Item.Texto }}</p></mt-if>
                </div>
              </mt-for>
              <mt-if value="{{ Ayudasinpistas }}"><p class="ayuda-respuesta" style="padding-top:12px">No encontramos preguntas con esa palabra.</p></mt-if>
            </section>
            <mt-if value="{{ Ayudamostrarbotonver }}"><button type="button" class="boton-secundario boton-chico ayuda-glosario-boton" al-clic="{{ Alternarayudavertodas }}">{{ Ayudavertodastexto }}</button></mt-if>

            <h2 class="ayuda-seccion">Glosario</h2>
            <section class="tarjeta">
              <dl class="ayuda-glosario">
                <mt-for list="{{ Ayudaglosario }}" as="Entrada">
                  <div class="ayuda-termino"><dt>{{ Entrada.Termino }}</dt><dd>{{ Entrada.Definicion }}</dd></div>
                </mt-for>
              </dl>
              <mt-if value="{{ Ayudaglosariomostrarboton }}"><button type="button" class="boton-secundario boton-chico ayuda-glosario-boton" al-clic="{{ Alternarayudaglosario }}">{{ Ayudaglosariotexto }}</button></mt-if>
            </section>

            <section class="tarjeta">
              <h2 class="titulo-tarjeta">¿No encontraste tu respuesta?</h2>
              <p class="texto-cuerpo">Escríbenos y te respondemos lo antes posible.</p>
              <button type="button" class="boton-primario" al-clic="{{ Contactarsoporteayuda }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg><span>Escribir a soporte</span></button>
              <span class="ayuda-correo">rumoriastudio@gmail.com</span>
            </section>

            <p class="texto-pequeno">MiTecho hace cálculos teóricos según la Ley 546 de 1999 y las normas vigentes en 2026. La aprobación final depende del estudio de crédito de cada entidad.</p>
          </div>
        </div>
      </mt-if>
`;
