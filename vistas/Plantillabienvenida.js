// Plantilla de las pantallas de entrada: portada e inicio de sesión (Google, correo y recuperar contraseña)

const Plantillabienvenida = `
<mt-if value="{{ Esbienvenidaingreso }}">
  <div class="mk {{ Bienvenidaclase }}">
    <div class="ml" al-clic="{{ Tocarportada }}">
      <img class="mm" src="assets/Logoglyphgrande.webp" width="512" height="512" fetchpriority="high" alt="MiTecho" style="transform:{{ Portadalogomovimiento }};opacity:{{ Portadalogoopacidad }}">
      <span class="mn" style="opacity:{{ Portadatextoopacidad }};transform:{{ Portadatextomovimiento }}">MiTecho</span>
      <div class="mo" style="transform:{{ Portadafranja }};transform-origin:left center"><div class="mp"><div class="mg"></div><div class="mh"></div><div class="mi"></div></div></div>
      <span class="mj" style="opacity:{{ Portadatextoopacidad }};transform:{{ Portadatextomovimiento }}">Tu techo, en cifras de banco.</span>
    </div>
    <div class="mq">
      <h1 class="mr">Tu techo, en cifras de banco.</h1>
      <p class="ms">Registra lo que ganas cada día y estima cuánto podría prestarte un banco en Colombia.</p>
    </div>
    <div class="mt">
      <mt-if value="{{ Esvinculacion }}"><p class="invitado-nota" role="status">Vincula tu cuenta: lo que guardaste en este celular pasa a ella.</p></mt-if>
      <button type="button" class="mu" al-clic="{{ Ingresogoogle }}"><svg class="mv" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"></path><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"></path><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"></path><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"></path></svg><span>Continuar con Google</span></button>
      <mt-if value="{{ Correocerrado }}">
        <button type="button" class="mw" al-clic="{{ Abrircorreo }}">Iniciar sesión con correo</button>
      </mt-if>
      <mt-if value="{{ Correoabierto }}">
        <div class="tarjeta entrada-tarjeta">
          <mt-if value="{{ Noesmodorecuperar }}">
            <div class="entrada-tabs">
              <button type="button" class="entrada-tab {{ Ingresotabclase }}" al-clic="{{ Elegiringreso }}">Iniciar sesión</button>
              <button type="button" class="entrada-tab {{ Registrotabclase }}" al-clic="{{ Elegirregistro }}">Registrarme</button>
            </div>
            <mt-if value="{{ Esmodoregistro }}">
              <label class="entrada-campo"><span class="entrada-rotulo">Tu nombre</span><input class="entrada-input" value="{{ Nombreregistrovalor }}" al-escribir="{{ Escribirnombreregistro }}" type="text" maxlength="70" autocomplete="name" autocapitalize="words" placeholder="Ej. Camila Gómez"></label>
            </mt-if>
            <label class="entrada-campo"><span class="entrada-rotulo">Correo</span><input maxlength="100" class="entrada-input" value="{{ Ingresocorreovalor }}" al-escribir="{{ Escribiringresocorreo }}" type="email" placeholder="nombre@correo.com"></label>
            <label class="entrada-campo"><span class="entrada-rotulo">Contraseña</span><input maxlength="72" class="entrada-input" value="{{ Ingresoclavevalor }}" al-escribir="{{ Escribiringresoclave }}" type="password" placeholder="{{ Claveejemplo }}"></label>
            <mt-if value="{{ Esmodoregistro }}">
              <label class="entrada-campo"><span class="entrada-rotulo">Confirmar contraseña</span><input maxlength="72" class="entrada-input" value="{{ Ingresoclaveconfirmarvalor }}" al-escribir="{{ Escribiringresoclaveconfirmar }}" type="password" placeholder="Repite tu contraseña"></label>
            </mt-if>
            <mt-if value="{{ Esmodoingreso }}">
              <div class="entrada-recuperar-fila">
                <span class="texto-pequeno">¿Olvidaste tu contraseña?</span>
                <button type="button" class="entrada-recuperar-link" al-clic="{{ Elegirrecuperar }}">Recuperar contraseña →</button>
              </div>
            </mt-if>
            <mt-if value="{{ Ingresoerror }}"><span class="mz" role="alert">{{ Ingresoerror }}</span></mt-if>
            <mt-if value="{{ Ingresoexitomensaje }}"><div class="entrada-exito" role="status"><span>✓</span><span>{{ Ingresoexitomensaje }}</span></div></mt-if>
            <mt-if value="{{ Esmodoingreso }}">
              <button type="button" class="boton-primario" style="min-height:48px" al-clic="{{ Ingresocorreo }}">{{ Ingresobotontexto }}</button>
            </mt-if>
            <mt-if value="{{ Esmodoregistro }}">
              <button type="button" class="boton-primario" style="min-height:48px" al-clic="{{ Registrarcorreo }}">{{ Registrobotontexto }}</button>
            </mt-if>
            <button type="button" class="entrada-cancelar" al-clic="{{ Cerrarcorreo }}">Cancelar</button>
          </mt-if>
          <mt-if value="{{ Esmodorecuperar }}">
            <div class="entrada-recuperar-cabeza">
              <span class="entrada-recuperar-titulo"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--at)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="4.5"></circle><path d="M21 2l-9.6 9.6M15.5 7.5l3 3"></path></svg><span>Recuperar contraseña</span></span>
              <button type="button" class="entrada-volver" al-clic="{{ Elegiringreso }}">← Volver</button>
            </div>
            <p class="texto-cuerpo">Escribe el correo de tu cuenta y te enviaremos un enlace seguro para crear una contraseña nueva.</p>
            <label class="entrada-campo"><span class="entrada-rotulo">Correo de tu cuenta</span><input maxlength="100" class="entrada-input" value="{{ Ingresocorreovalor }}" al-escribir="{{ Escribiringresocorreo }}" type="email" placeholder="nombre@correo.com"></label>
            <mt-if value="{{ Ingresoerror }}"><span class="mz" role="alert">{{ Ingresoerror }}</span></mt-if>
            <mt-if value="{{ Ingresoexitomensaje }}"><div class="entrada-exito" role="status"><span>✓</span><span>{{ Ingresoexitomensaje }}</span></div></mt-if>
            <button type="button" class="boton-primario" style="min-height:48px" al-clic="{{ Recuperarcorreo }}">{{ Recuperarbotontexto }}</button>
            <button type="button" class="entrada-cancelar" al-clic="{{ Elegiringreso }}">Volver a iniciar sesión</button>
          </mt-if>
        </div>
      </mt-if>
      <mt-if value="{{ Mostrarinvitado }}"><button type="button" class="invitado-boton" al-clic="{{ Abriravisoinvitado }}">Continuar sin iniciar sesión</button></mt-if>
      <mt-if value="{{ Esvinculacion }}"><button type="button" class="invitado-boton" al-clic="{{ Volvervinculacion }}">Volver sin vincular</button></mt-if>
      <div class="entrada-ayuda">¿Necesitas ayuda? <button type="button" class="entrada-recuperar-link" al-clic="{{ Contactarsoporteingreso }}">Contáctanos</button></div>
      <p class="m11">Al entrar te pediremos tu autorización para el tratamiento de tus datos (Ley 1581 de 2012).</p>
    </div>
  </div>
</mt-if>
`;
