// Plantilla de autorización de datos (Ley 1581 de 2012) antes de entrar a la aplicación

const Svgcheckautorizacion = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';

const Plantillaautorizacion = `
      <mt-if value="{{ Autorizacionvisible }}">
        <section class="autorizacion" role="dialog" aria-modal="true" aria-labelledby="titulo-autorizacion">
          <header class="autorizacion-cabeza">
            <span class="autorizacion-antetitulo">Antes de continuar</span>
            <h1 id="titulo-autorizacion" class="autorizacion-titulo">Tu autorización para usar tus datos</h1>
            <p class="texto-cuerpo">La Ley 1581 de 2012 nos pide tu autorización. Te lo explicamos en corto:</p>
          </header>
          <div class="mt-scroll autorizacion-cuerpo">
            <ul class="autorizacion-lista">
              <li class="autorizacion-item"><span class="tarjeta-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg></span><div class="autorizacion-item-textos"><span class="autorizacion-item-titulo">Son cálculos teóricos</span><span class="texto-cuerpo">Los resultados son estimaciones educativas. No son una aprobación de crédito ni una oferta de un banco o una constructora.</span></div></li>
              <li class="autorizacion-item"><span class="tarjeta-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span><div class="autorizacion-item-textos"><span class="autorizacion-item-titulo">No vendemos ni compartimos tus datos</span><span class="texto-cuerpo">MiTecho no los usa para publicidad, estudios de crédito ni ningún otro fin.</span></div></li>
              <li class="autorizacion-item"><span class="tarjeta-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span><div class="autorizacion-item-textos"><span class="autorizacion-item-titulo">Para qué los guardamos</span><span class="texto-cuerpo">Para que la app funcione con tu cuenta (tu perfil, tus deudas, la vivienda que buscas y tus reportes) y para atender tus solicitudes de soporte. Tus registros diarios se quedan solo en tu celular.</span></div></li>
              <li class="autorizacion-item"><span class="tarjeta-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="7" rx="2"></rect><rect x="3" y="13" width="18" height="7" rx="2"></rect></svg></span><div class="autorizacion-item-textos"><span class="autorizacion-item-titulo">Quién los procesa</span><span class="texto-cuerpo">Solo los proveedores que hacen funcionar la app: Supabase para guardarlos y Google para el inicio de sesión y el soporte, siempre bajo nuestras instrucciones.</span></div></li>
              <li class="autorizacion-item"><span class="tarjeta-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 13z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg></span><div class="autorizacion-item-textos"><span class="autorizacion-item-titulo">Anuncios</span><span class="texto-cuerpo">La versión gratuita muestra anuncios de Google AdMob, que usan el identificador publicitario de tu celular, nunca tus datos financieros.</span></div></li>
              <mt-if value="{{ Autorizacioninvitado }}"><li class="autorizacion-item"><span class="tarjeta-icono" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="10" height="18" rx="2"></rect><path d="M12 18h.01"></path></svg></span><div class="autorizacion-item-textos"><span class="autorizacion-item-titulo">Entraste sin cuenta</span><span class="texto-cuerpo">Lo que escribas se queda solo en este celular. Si después vinculas una cuenta, te pediremos esta autorización para guardarlo en ella.</span></div></li></mt-if>
            </ul>
            <div class="autorizacion-enlaces">
              <a class="autorizacion-enlace" href="{{ Urlpolitica }}" target="_blank" rel="noopener noreferrer">Política de tratamiento de datos ↗</a>
              <a class="autorizacion-enlace" href="{{ Urlterminos }}" target="_blank" rel="noopener noreferrer">Términos de uso ↗</a>
            </div>
          </div>
          <footer class="autorizacion-pie">
            <button type="button" role="checkbox" aria-checked="{{ Autorizacionmarcadatexto }}" class="autorizacion-check" al-clic="{{ Marcarautorizacion }}">
              <span aria-hidden="true" class="autorizacion-caja {{ Autorizacioncajaclase }}"><mt-if value="{{ Autorizacionesta }}">${Svgcheckautorizacion}</mt-if></span>
              <span class="autorizacion-check-texto">Soy mayor de 18 años, leí la política y los términos de uso, y autorizo a RumoriaStudio, creadores de MiTecho, a tratar mis datos según la Ley 1581 de 2012.</span>
            </button>
            <mt-if value="{{ Autorizacionerror }}"><span class="mz" role="alert">{{ Autorizacionerror }}</span></mt-if>
            <button type="button" class="boton-primario" style="background:{{ Autorizacionbotonfondo }};color:{{ Autorizacionbotoncolor }}" al-clic="{{ Aceptarautorizacion }}" aria-disabled="{{ Autorizacionbotonbloqueado }}">{{ Autorizacionbotontexto }}</button>
            <button type="button" class="autorizacion-salir" al-clic="{{ Rechazarautorizacion }}">No autorizo y salgo</button>
            <p class="autorizacion-nota">{{ Autorizacionrevocartexto }}</p>
          </footer>
        </section>
      </mt-if>
`;
