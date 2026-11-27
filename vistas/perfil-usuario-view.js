// Plantilla de «Perfil y ajustes» (cuenta e invitado), hojas de edición de datos y panel «Recordatorios»

const Svgvolverperfil = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>';
const Svgflechaperfil = '<svg class="perfil-fila-flecha" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>';
const Svgayudaperfil = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.5M12 17h.01"></path></svg>';
const Svgcerrarperfil = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"></path></svg>';

const Plantillaperfilusuario = `
      <mt-if value="{{ Esperfil }}">
        <div class="mt-scroll m3l detalle">
          <div class="barra-detalle"><button type="button" class="volver" al-clic="{{ Cerrarpanel }}">${Svgvolverperfil}<span>{{ Perfilvolver }}</span></button><span class="barra-detalle-espacio"></span><button type="button" class="barra-icono" al-clic="{{ Abrirayuda }}" aria-label="Ayuda y glosario">${Svgayudaperfil}</button></div>
          <h1 class="titulo-detalle">Perfil y ajustes</h1>
          <div class="detalle-cuerpo">
            <div class="perfil-cabecera">
              <div class="perfil-avatar-envoltura">
                <button type="button" class="perfil-avatar {{ Perfilavatarclase }}" al-clic="{{ Abrirselectorfoto }}" title="Cambiar foto de perfil" aria-label="Cambiar foto de perfil">
                  <mt-if value="{{ Tieneavatarimagen }}"><img src="{{ Avatarimagen }}" alt="Foto de perfil"></mt-if>
                  <mt-if value="{{ Sinavatarimagen }}"><mt-if value="{{ Coniniciales }}">{{ Iniciales }}</mt-if><mt-if value="{{ Sininiciales }}"><svg class="sin-nombre-icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></mt-if></mt-if>
                </button>
              </div>
              <div class="perfil-identidad">
                <h2 class="perfil-nombre">{{ Perfilnombremostrar }}</h2>
                <p class="perfil-meta">{{ Perfilmetaprincipal }}</p>
                <mt-if value="{{ Noesinvitado }}"><p class="perfil-submeta">{{ Perfilmetasecundaria }}</p></mt-if>
                <mt-if value="{{ Tieneavatarimagen }}"><div class="perfil-foto-acciones"><button type="button" class="perfil-foto-boton" al-clic="{{ Abrirselectorfoto }}">Cambiar foto</button><span class="perfil-submeta">·</span><button type="button" class="perfil-foto-boton perfil-foto-quitar" al-clic="{{ Quitaravatarimagen }}">Quitar foto</button></div></mt-if>
              </div>
            </div>

            <mt-if value="{{ Esinvitado }}">
              <section class="tarjeta perfil-vincular" aria-labelledby="titulo-vincular">
                <div class="perfil-vincular-cabeza">
                  <span class="tarjeta-icono" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>
                  <h2 id="titulo-vincular" class="titulo-tarjeta">Vincula tu cuenta</h2>
                </div>
                <p class="texto-cuerpo">Si cambias de celular o borras la app, sin cuenta perderías tus datos. Al vincularla, todo lo que ya registraste se queda.</p>
                <button type="button" class="perfil-google" al-clic="{{ Vincularcongoogle }}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"></path><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"></path><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"></path><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"></path></svg><span>Continuar con Google</span></button>
                <button type="button" class="boton-secundario perfil-vincular-correo" al-clic="{{ Vincularconcorreo }}">Usar mi correo</button>
              </section>
            </mt-if>

            <section class="tarjeta">
              <div class="perfil-avance-cabeza">
                <h2 class="perfil-avance-titulo">Tu perfil va en {{ Perfilavance }}%</h2>
                <span class="perfil-avance-valor">{{ Perfilavance }}%</span>
              </div>
              <div class="progreso progreso-delgado" role="progressbar" aria-label="{{ Perfilavanceetiqueta }}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{ Perfilavance }}"><div class="progreso-relleno" style="width:{{ Perfilavanceancho }}"></div></div>
              <p class="texto-cuerpo">{{ Perfilavancetexto }}</p>
              <mt-if value="{{ Perfilavancependiente }}"><button type="button" class="enlace" al-clic="{{ Perfilcompletaraccion }}"><span>Completar ahora</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button></mt-if>
            </section>

            <h2 class="perfil-seccion">Mis datos</h2>
            <div class="perfil-lista">
              <button type="button" class="perfil-fila" al-clic="{{ Abrirperfilpersonales }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Datos personales</span><span class="perfil-fila-valor">{{ Perfilresumenpersonales }}</span></span>${Svgflechaperfil}</button>
              <button type="button" class="perfil-fila" al-clic="{{ Abrirperfilingresos }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="12" rx="2"></rect><circle cx="12" cy="12" r="2.5"></circle></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Ingresos</span><span class="perfil-fila-valor">{{ Perfilresumeningresos }}</span></span>${Svgflechaperfil}</button>
              <button type="button" class="perfil-fila" al-clic="{{ Abrirperfilahorro }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"></rect><path d="M3 10h18M16 14.5h2"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Ahorro</span><span class="perfil-fila-valor">{{ Perfilresumenahorro }}</span></span>${Svgflechaperfil}</button>
              <button type="button" class="perfil-fila" al-clic="{{ Abrirperfildeudas }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="M3 10h18M7 15h4"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Deudas</span><span class="perfil-fila-valor">{{ Perfilresumendeudas }}</span></span>${Svgflechaperfil}</button>
              <button type="button" class="perfil-fila" al-clic="{{ Abrirperfilsubsidios }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11z"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Caja y subsidios</span><span class="perfil-fila-valor">{{ Perfilresumencaja }}</span></span><mt-if value="{{ Perfilcajacompletar }}"><span class="pildora-completar">Completar</span></mt-if>${Svgflechaperfil}</button>
            </div>

            <h2 class="perfil-seccion">Apariencia</h2>
            <section class="tarjeta">
              <span class="perfil-temas-rotulo">Tema de la app</span>
              <div class="perfil-temas" role="group" aria-label="Apariencia">
                <mt-for list="{{ Temaopciones }}" as="Opciontema">
                  <button type="button" class="perfil-tema {{ Opciontema.Clase }}" aria-pressed="{{ Opciontema.Activa }}" al-clic="{{ Opciontema.Alclic }}">
                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{ Opciontema.Icono }}"></path></svg>
                    <span>{{ Opciontema.Etiqueta }}</span>
                  </button>
                </mt-for>
              </div>
              <p class="texto-pequeno">{{ Temanota }}</p>
            </section>

            <h2 class="perfil-seccion">Avisos</h2>
            <section class="tarjeta perfil-avisos">
              <button type="button" class="interruptor-fila" role="switch" aria-checked="{{ Diarioactivo }}" al-clic="{{ Alternardiario }}"><span>Recordarme registrar lo que gano</span><span class="interruptor {{ Diarioclase }}" aria-hidden="true"></span></button>
              <button type="button" class="perfil-avisos-hora" al-clic="{{ Abrirpanelrecordatorios }}">{{ Avisosresumenhora }} ›</button>
            </section>

            <h2 class="perfil-seccion">Ayuda</h2>
            <div class="perfil-lista">
              <button type="button" class="perfil-fila" al-clic="{{ Abrirayuda }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.5M12 17h.01"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Centro de ayuda y glosario</span><span class="perfil-fila-valor">Qué significa cada cifra y cada palabra</span></span>${Svgflechaperfil}</button>
              <button type="button" class="perfil-fila" al-clic="{{ Contactarsoporteayuda }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Escríbenos</span><span class="perfil-fila-valor">Te respondemos por correo</span></span>${Svgflechaperfil}</button>
              <button type="button" class="perfil-fila" al-clic="{{ Verbienvenidaotrarez }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6M3.5 15a9 9 0 1 0 2.1-9.4L1 10"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Ver otra vez la bienvenida</span></span>${Svgflechaperfil}</button>
            </div>

            <h2 class="perfil-seccion">Cuenta</h2>
            <div class="perfil-lista">
              <mt-if value="{{ Esinvitado }}">
                <button type="button" class="perfil-fila" al-clic="{{ Vincularcongoogle }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M19 8v6M22 11h-6"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Vincular cuenta</span><span class="perfil-fila-valor">Con Google o con tu correo</span></span><span class="pildora-recomendado">Recomendado</span>${Svgflechaperfil}</button>
              </mt-if>
              <button type="button" class="perfil-fila" al-clic="{{ Perfilexportar }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">{{ Perfilexportartexto }}</span></span>${Svgflechaperfil}</button>
              <mt-if value="{{ Noesinvitado }}">
                <button type="button" class="perfil-fila" al-clic="{{ Cerrarsesionperfil }}"><span class="perfil-fila-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo">Cerrar sesión</span></span>${Svgflechaperfil}</button>
              </mt-if>
              <button type="button" class="perfil-fila" al-clic="{{ Perfileliminar }}"><span class="perfil-fila-icono is-peligro" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"></path></svg></span><span class="perfil-fila-textos"><span class="perfil-fila-titulo is-peligro">{{ Perfilborrartexto }}</span><span class="perfil-fila-valor">{{ Perfilborrarsubtitulo }}</span></span>${Svgflechaperfil}</button>
            </div>

            <footer class="perfil-pie">
              <img class="perfil-pie-logo" src="assets/Logoapp.webp" width="128" height="128" alt="">
              <div class="perfil-pie-textos"><span class="perfil-pie-marca">MiTecho · Colombia</span><span>Versión 2026 · RumoriaStudio</span></div>
            </footer>
          </div>
        </div>
      </mt-if>

      <mt-if value="{{ Esperfildato }}">
        <div class="hoja-capa">
          <button type="button" class="hoja-velo" al-clic="{{ Cerrarperfildato }}" aria-label="Cerrar"></button>
          <section class="hoja mt-sheet registro" role="dialog" aria-modal="true" aria-labelledby="titulo-perfil-dato">
            <div class="hoja-manija" aria-hidden="true"></div>
            <div class="hoja-cabecera"><h2 id="titulo-perfil-dato" class="hoja-titulo">{{ Perfildatotitulo }}</h2><button type="button" class="hoja-cerrar" al-clic="{{ Cerrarperfildato }}" aria-label="Cerrar">${Svgcerrarperfil}</button></div>

            <mt-if value="{{ Perfildatopersonales }}">
              <label class="registro-campo"><span class="registro-rotulo">Nombre completo</span><input class="registro-entrada" maxlength="70" value="{{ Perfilnombre }}" al-escribir="{{ Escribirperfilnombre }}" placeholder="Tu nombre"></label>
              <label class="registro-campo"><span class="registro-rotulo">Edad</span><input class="registro-entrada" maxlength="2" value="{{ Perfiledad }}" al-escribir="{{ Escribirperfiledad }}" inputMode="numeric" placeholder="0"></label>
              <p class="texto-pequeno">{{ Edadpista }}</p>
              <div class="registro-campo">
                <span class="registro-rotulo">Ciudad</span>
                <button type="button" class="registro-entrada" al-clic="{{ Alternarciudad }}" aria-expanded="{{ Ciudadabierta }}" style="display:flex;align-items:center;justify-content:space-between;text-align:left"><span>{{ Ciudad }} · {{ Ciudaddepartamento }}</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="transform:{{ Ciudadflecha }}"><path d="M6 9l6 6 6-6"></path></svg></button>
                <mt-if value="{{ Ciudadabierta }}">
                  <div class="viviendas-buscador-caja">
                    <div class="viviendas-buscador-cabeza"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg><input class="viviendas-buscador-entrada" maxlength="50" value="{{ Ciudadbusqueda }}" al-escribir="{{ Escribirciudad }}" autoFocus="{{ true }}" placeholder="Buscar ciudad" aria-label="Buscar ciudad"></div>
                    <div class="mt-scroll viviendas-buscador-lista">
                      <mt-for list="{{ Ciudadlista }}" as="Ciudadfila"><button type="button" class="viviendas-buscador-fila" al-clic="{{ Ciudadfila.Alclic }}"><span class="viviendas-buscador-textos"><span class="viviendas-buscador-nombre">{{ Ciudadfila.Nombreitem }}</span><span class="viviendas-buscador-depto">{{ Ciudadfila.Departamento }}</span></span></button></mt-for>
                      <mt-if value="{{ Ciudadvacia }}"><div class="viviendas-vacio">No encontramos esa ciudad.</div></mt-if>
                    </div>
                  </div>
                </mt-if>
              </div>
            </mt-if>

            <mt-if value="{{ Perfildatoingresos }}">
              <div class="registro-grupo"><span class="registro-rotulo">Cómo recibes tu dinero</span><div class="registro-fichas"><mt-for list="{{ Perfiltipofichas }}" as="Ficha"><button type="button" class="registro-ficha {{ Ficha.Clase }}" aria-pressed="{{ Ficha.Activo }}" al-clic="{{ Ficha.Alclic }}">{{ Ficha.Etiqueta }}</button></mt-for></div></div>
              <mt-if value="{{ Perfilmostrarfijo }}"><label class="registro-campo"><span class="registro-rotulo">Salario o ingreso fijo mensual</span><input class="registro-entrada" maxlength="13" value="{{ Perfilfijo }}" al-escribir="{{ Escribirperfilfijo }}" inputMode="numeric" placeholder="$0"></label></mt-if>
              <mt-if value="{{ Perfilmostrarvariable }}"><label class="registro-campo"><span class="registro-rotulo">Ingresos variables al mes</span><input class="registro-entrada" maxlength="13" value="{{ Perfilvariable }}" al-escribir="{{ Escribirperfilvariable }}" inputMode="numeric" placeholder="$0"></label></mt-if>
              <div class="sim-fila-total"><span class="texto-pequeno">Ingreso mensual</span><span class="sim-total">{{ Perfilingresototal }}</span></div>
            </mt-if>

            <mt-if value="{{ Perfildatoahorro }}">
              <label class="registro-campo"><span class="registro-rotulo">Ahorro que ya tienes</span><input class="registro-entrada" maxlength="15" value="{{ Perfilahorro }}" al-escribir="{{ Escribirperfilahorro }}" inputMode="numeric" placeholder="$0"></label>
              <label class="registro-campo"><span class="registro-rotulo">Cuánto ahorras al mes</span><input class="registro-entrada" maxlength="13" value="{{ Perfilahorromes }}" al-escribir="{{ Escribirperfilahorromes }}" inputMode="numeric" placeholder="$0"></label>
              <label class="registro-campo"><span class="registro-rotulo">Precio de la vivienda que buscas (opcional)</span><input class="registro-entrada" maxlength="16" value="{{ Perfilobjetivo }}" al-escribir="{{ Escribirperfilobjetivo }}" inputMode="numeric" placeholder="$0"></label>
              <div class="sim-tipos"><mt-for list="{{ Modalidadopciones }}" as="Modalidadopcion"><button type="button" class="tipo-opcion sim-tipo {{ Modalidadopcion.Clase }}" al-clic="{{ Modalidadopcion.Alclic }}" aria-pressed="{{ Modalidadopcion.Activa }}"><span class="sim-tipo-nombre">{{ Modalidadopcion.Etiqueta }}</span><span class="sim-tipo-detalle">{{ Modalidadopcion.Descripcioncorta }}</span><mt-if value="{{ Modalidadopcion.Recomendada }}"><span class="tipo-insignia">Para ti</span></mt-if></button></mt-for></div>
            </mt-if>

            <button type="button" class="boton-primario" al-clic="{{ Cerrarperfildato }}">Listo</button>
          </section>
        </div>
      </mt-if>

      <mt-if value="{{ Esrecordatorio }}">
        <div class="mt-scroll m3l detalle">
          <div class="barra-detalle"><button type="button" class="volver" al-clic="{{ Volveraperfil }}">${Svgvolverperfil}<span>Perfil y ajustes</span></button><span class="barra-detalle-espacio"></span><button type="button" class="barra-icono" al-clic="{{ Abrirayuda }}" aria-label="Ayuda y glosario">${Svgayudaperfil}</button></div>
          <h1 class="titulo-detalle">Recordatorios</h1>
          <div class="detalle-cuerpo">
            <p class="texto-guia">Te avisamos para que no se te pase ningún registro y tu promedio no se caiga.</p>
            <section class="tarjeta">
              <button type="button" class="interruptor-fila" role="switch" aria-checked="{{ Diarioactivo }}" al-clic="{{ Alternardiario }}"><span>Recordarme registrar</span><span class="interruptor {{ Diarioclase }}" aria-hidden="true"></span></button>
              <mt-if value="{{ Diarioactivo }}">
                <div class="registro-grupo"><span class="registro-rotulo">Hora</span><div class="registro-fichas"><mt-for list="{{ Horafichas }}" as="Ficha"><button type="button" class="registro-ficha {{ Ficha.Clase }}" aria-pressed="{{ Ficha.Activo }}" al-clic="{{ Ficha.Alclic }}">{{ Ficha.Etiqueta }}</button></mt-for></div></div>
                <div class="registro-grupo"><span class="registro-rotulo">Días</span><div class="m5r"><mt-for list="{{ Diafichas }}" as="Diafila"><button type="button" class="registro-ficha {{ Diafila.Clase }}" aria-pressed="{{ Diafila.Activo }}" al-clic="{{ Diafila.Alclic }}" style="padding:0">{{ Diafila.Etiqueta }}</button></mt-for></div></div>
              </mt-if>
            </section>
            <section class="tarjeta">
              <h2 class="titulo-tarjeta">Otros avisos</h2>
              <mt-for list="{{ Recordatoriointerruptores }}" as="Opciontipo"><button type="button" class="interruptor-fila" role="switch" aria-checked="{{ Opciontipo.Activo }}" al-clic="{{ Opciontipo.Alclic }}"><span class="perfil-fila-textos"><span class="perfil-fila-titulo">{{ Opciontipo.Etiqueta }}</span><span class="texto-pequeno">{{ Opciontipo.Subtexto }}</span></span><span class="interruptor {{ Opciontipo.Clase }}" aria-hidden="true"></span></button></mt-for>
            </section>
          </div>
        </div>
      </mt-if>
`;
