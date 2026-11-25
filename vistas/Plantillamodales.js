// Plantilla de las ventanas desplegables (registrar, menú, soporte técnico) y avisos en pantalla

const Plantillamodales = Plantillaregistrar + `
      <input type="file" id="mt-avatar-input" accept="image/*" style="display:none" al-cambiar="{{ Cambiararchivoavatar }}">
      <mt-if value="{{ Tienemenu }}">
        <div al-clic="{{ Cerrarmenu }}" style="position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:{{ Menuopacidad }};pointer-events:{{ Menueventos }};transition:opacity .2s ease-out;z-index:52"></div>
        <div style="position:absolute;top:104px;right:14px;width:284px;background:var(--cd);border:1px solid var(--ln);border-radius:28px;padding:8px;box-shadow:0 24px 48px -16px rgba(0,0,0,.55);z-index:53;transform-origin:top right;transform:{{ Menuescala }};opacity:{{ Menuopacidad }};pointer-events:{{ Menueventos }};transition:transform .24s cubic-bezier(.22,1,.36,1),opacity .15s ease-out;display:{{ Menuvisible }};flex-direction:column;gap:2px;box-sizing:border-box">
        <div class="mem">
          <div style="position:relative;flex:none">
            <div class="men" al-clic="{{ Abrirselectorfoto }}" title="Cambiar foto de perfil" style="overflow:hidden;position:relative;background:{{ Avatarfondo }};color:{{ Avatartexto }};cursor:pointer;border:{{ Avatarbordepequeno }};box-sizing:border-box">
              <mt-if value="{{ Tieneavatarimagen }}"><img src="{{ Avatarimagen }}" alt="Foto" style="width:100%;height:100%;object-fit:cover;display:block"></mt-if>
              <mt-if value="{{ Sinavatarimagen }}"><mt-if value="{{ Coniniciales }}">{{ Iniciales }}</mt-if><mt-if value="{{ Sininiciales }}"><svg class="sin-nombre-icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></mt-if></mt-if>
            </div>
            <button al-clic="{{ Abrirselectorfoto }}" aria-label="Cambiar foto" title="Cambiar foto" style="position:absolute;bottom:-2px;right:-2px;width:20px;height:20px;border-radius:10px;background:var(--ik);color:var(--bg);border:1.5px solid var(--cd);display:flex;align-items:center;justify-content:center;cursor:pointer">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </button>
          </div>
          <div class="meo" style="flex:1;min-width:0">
            <span class="m46" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ Nombrecompletousuario }}</span>
            <span class="m4k">{{ Ciudad }} · Ingreso {{ Tipominusculas }}</span>
            <button al-clic="{{ Abrirselectorfoto }}" style="margin-top:3px;padding:0;background:none;border:none;font:600 12px 'Familjen Grotesk',sans-serif;color:var(--at);cursor:pointer;text-align:left">
              Cambiar foto de perfil
            </button>
          </div>
        </div>
        <mt-for list="{{ Menuitems }}" as="Itemmenu">
          <button al-clic="{{ Itemmenu.Alclic }}" style="min-height:50px;padding:6px 10px;border-radius:18px;display:flex;align-items:center;gap:12px;text-align:left;background:{{ Itemmenu.Fondo }};color:{{ Itemmenu.Color }}">
            <span style="width:34px;height:34px;border-radius:17px;background:{{ Itemmenu.Iconofondo }};display:flex;align-items:center;justify-content:center;flex:none"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{ Itemmenu.Icono }}"></path></svg></span>
            <span class="m45"><span class="mep">{{ Itemmenu.Etiqueta }}</span><mt-if value="{{ Itemmenu.Subtexto }}"><span class="meq">{{ Itemmenu.Subtexto }}</span></mt-if></span>
            <span class="mer">{{ Itemmenu.Derecha }}</span>
          </button>
        </mt-for>
        <div class="mes"><img class="met" src="assets/Logoapp.webp" width="128" height="128" alt=""><div class="meu"><span class="m4t">MiTecho</span><span class="mev">VERSIÓN OFICIAL 2026 · COLOMBIA</span></div><div class="mew"><div class="mg"></div><div class="mh"></div><div class="mi"></div></div></div>
      </div>
      </mt-if>
      <mt-if value="{{ Tienesoporte }}">
        <div al-clic="{{ Cerrarsoporte }}" style="position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:{{ Soportefondoopacidad }};display:{{ Soportefondovisible }};z-index:56;transition:opacity .25s ease-out"></div>
        <div class="mt-sheet" style="position:absolute;left:0;right:0;bottom:0;background:var(--cd);border-radius:32px 32px 0 0;border-top:1px solid var(--ln);padding:12px 18px 30px;z-index:57;display:{{ Soportevisible }};flex-direction:column;gap:14px;max-height:88dvh;overflow-y:auto;box-sizing:border-box;transform:{{ Soportetransformacion }};transition:{{ Soportetransicion }};touch-action:pan-y">
          <div al-tocar-inicio="{{ Soportetocarinicio }}" al-tocar-mover="{{ Soportetocarmover }}" al-tocar-fin="{{ Soportetocarfin }}" style="display:flex;flex-direction:column;align-items:center;padding:4px 0 8px;margin:-4px -18px 0;cursor:grab;touch-action:none">
            <div class="mdx"></div>
          </div>
          <div style="display:flex;justify-content:flex-end;align-items:center">
            <button class="m55" al-clic="{{ Cerrarsoporte }}">Cerrar</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:3px">
            <span class="mee">Contáctanos</span>
            <span class="m3t">Completa tus datos y descríbenos tu consulta o reporte técnico.</span>
          </div>
          <mt-if value="{{ Soporteformulariovisible }}">
            <div style="display:flex;flex-direction:column;gap:11px">
              <div style="display:flex;flex-direction:column;gap:6px" role="group" aria-label="Tipo de solicitud">
                <span class="m42">TIPO DE SOLICITUD</span>
                <div style="display:flex;flex-wrap:wrap;gap:6px"><mt-for list="{{ Soportetipofichas }}" as="Ficha"><button type="button" al-clic="{{ Ficha.Alclic }}" style="min-height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ Ficha.Borde }};background:{{ Ficha.Fondo }};color:{{ Ficha.Color }};font:600 12px 'Hanken Grotesk',sans-serif;cursor:pointer">{{ Ficha.Etiqueta }}</button></mt-for></div>
                <span style="font:400 12px/1.4 'Hanken Grotesk',sans-serif;color:var(--mu)">{{ Soportetipoayuda }}</span>
              </div>
              <label style="display:flex;flex-direction:column;gap:5px">
                <span class="m42">NOMBRE COMPLETO (MÍN. 6 CARACTERES)</span>
                <input maxlength="70" class="my" value="{{ Soportenombrevalor }}" al-escribir="{{ Escribirsoportenombre }}" type="text" placeholder="Ej. Carlos Rodríguez" aria-label="Nombre completo" style="width:100%">
              </label>
              <label style="display:flex;flex-direction:column;gap:5px">
                <span class="m42">CORREO ELECTRÓNICO</span>
                <input maxlength="100" class="my" value="{{ Soportecorreovalor }}" al-escribir="{{ Escribirsoportecorreo }}" type="email" placeholder="nombre@correo.com" aria-label="Correo electrónico" style="width:100%">
              </label>
              <label style="display:flex;flex-direction:column;gap:5px">
                <span class="m42">ASUNTO (MÍN. 6 CARACTERES)</span>
                <input maxlength="100" class="my" value="{{ Soporteasuntovalor }}" al-escribir="{{ Escribirsoporteasunto }}" type="text" placeholder="Ej. Problema al iniciar sesión" aria-label="Asunto" style="width:100%">
              </label>
              <label style="display:flex;flex-direction:column;gap:5px">
                <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
                  <span class="m42">DESCRIPCIÓN DETALLADA</span>
                  <span style="font:500 12px 'IBM Plex Mono',monospace;color:{{ Soportedescripcioncolor }}">{{ Soportedescripcionconteo }}</span>
                </div>
                <textarea value="{{ Soportedescripcionvalor }}" al-escribir="{{ Escribirsoportedescripcion }}" rows="4" maxLength="500" placeholder="Cuéntanos en detalle en qué podemos ayudarte o qué fallo encontraste (mínimo 20 caracteres)..." aria-label="Descripción" style="width:100%;min-height:92px;border-radius:16px;border:1px solid var(--ln);background:var(--c2);padding:12px 14px;outline:none;font:500 14.5px/1.4 'Hanken Grotesk',sans-serif;color:var(--ik);box-sizing:border-box;resize:none"></textarea>
              </label>
              <mt-if value="{{ Soporteerror }}">
                <span class="mz">{{ Soporteerror }}</span>
              </mt-if>
              <button class="m3j" al-clic="{{ Enviarsoporte }}" style="width:100%;margin-top:2px">{{ Soportebotontexto }}</button>
            </div>
          </mt-if>
          <mt-if value="{{ Soporteenviadovisible }}">
            <div style="display:flex;flex-direction:column;gap:14px;padding:6px 0 4px">
              <div style="background:rgba(46,204,113,.12);border:1px solid rgba(46,204,113,.45);border-radius:22px;padding:18px 16px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px">
                <div style="width:44px;height:44px;border-radius:22px;background:rgba(46,204,113,.2);color:#2ECC71;display:flex;align-items:center;justify-content:center;font:700 22px 'Familjen Grotesk',sans-serif">✓</div>
                <span style="font:600 15px/1.4 'Familjen Grotesk',sans-serif;color:#2ECC71">Recibimos tu solicitud</span>
                <span style="font:500 12px 'IBM Plex Mono',monospace;letter-spacing:.08em;color:var(--mu)">NÚMERO DE RADICADO</span>
                <span style="font:600 18px 'IBM Plex Mono',monospace;color:var(--ik);user-select:all">{{ Soporteradicadotexto }}</span>
                <span style="font:400 13px/1.45 'Hanken Grotesk',sans-serif;color:var(--ik)">{{ Soportefechatexto }}</span>
              </div>
              <button class="m3j" al-clic="{{ Cerrarsoporte }}" style="width:100%">Entendido</button>
              <button al-clic="{{ Reiniciarsoporte }}" style="height:32px;background:none;border:none;font:600 12.5px 'Familjen Grotesk',sans-serif;color:var(--mu);cursor:pointer">Enviar otra solicitud</button>
            </div>
          </mt-if>
        </div>
      </mt-if>
      <div style="position:absolute;left:14px;right:14px;top:60px;padding:14px 16px;border-radius:20px;background:var(--ik);color:var(--bg);font:600 14px/1.35 'Hanken Grotesk',sans-serif;transform:{{ Avisodesplazamiento }};opacity:{{ Avisoopacidad }};transition:transform .3s cubic-bezier(.22,1,.36,1),opacity .2s ease-out;z-index:60;pointer-events:none">{{ Avisomensaje }}</div>
`;
