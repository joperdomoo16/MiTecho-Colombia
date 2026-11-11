// Plantilla de la barra superior con el logotipo, el botón de tema claro u oscuro y el acceso al perfil

const Plantillanavegacionsuperior = `
    <sc-if value="{{ Esapp }}" hint-placeholder-val="{{ false }}">
      <div ref="{{ Desplazamientoreferencia }}" class="mt-scroll m75">
  
        <div class="m76">
            <div class="m77"><img class="m78" src="assets/Logoapp.webp" width="128" height="128" alt="MiTecho"><div class="m79"><span class="m7a">MiTecho</span><div class="m7b"><div class="mg"></div><div class="mh"></div><div class="mi"></div></div></div></div>
            <div class="m7c">
              <button class="m7d" al-clic="{{ Alternartema }}" aria-label="Cambiar modo">
                <sc-if value="{{ Esoscuro }}" hint-placeholder-val="{{ true }}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg></sc-if>
                <sc-if value="{{ Esclaro }}" hint-placeholder-val="{{ false }}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg></sc-if>
              </button>
              <div class="m7e"><span class="m7f">{{ Ciudad }} · {{ Tipoetiqueta }}</span></div>
              <div style="position:relative;display:flex;align-items:center;justify-content:center">
                <sc-if value="{{ Esusuariopro }}" hint-placeholder-val="{{ false }}">
                  <div style="position:absolute;top:-7px;left:50%;transform:translateX(-50%);padding:1px 5px;border-radius:5px;background:#FFD23F;color:#0B0C0A;font:700 8px/1.1 'IBM Plex Mono',monospace;letter-spacing:.06em;box-shadow:0 2px 5px rgba(0,0,0,.35);white-space:nowrap;z-index:15;pointer-events:none">
                    PRO
                  </div>
                </sc-if>
                <button al-clic="{{ Abrirmenu }}" aria-label="Perfil y ayuda" data-tutorial="perfil" style="width:38px;height:38px;border-radius:19px;background:{{ Avatarfondo }};color:{{ Avatartexto }};display:flex;align-items:center;justify-content:center;font:700 12px 'Familjen Grotesk',sans-serif;box-shadow:{{ Avatarsombra }};border:{{ Avatarborde }};transition:box-shadow .15s ease-out;position:relative;overflow:hidden;padding:0">
                  <sc-if value="{{ Tieneavatarimagen }}" hint-placeholder-val="{{ false }}"><img src="{{ Avatarimagen }}" alt="Foto" style="width:100%;height:100%;object-fit:cover;display:block"></sc-if>
                  <sc-if value="{{ Sinavatarimagen }}" hint-placeholder-val="{{ true }}">{{ Iniciales }}</sc-if>
                </button>
              </div>
            </div>
          </div>
`;

