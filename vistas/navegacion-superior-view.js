// Plantilla de la barra superior: la marca lleva al Inicio y a la derecha quedan ayuda, tema claro u oscuro y el perfil

const Plantillanavegacionsuperior = `
    <mt-if value="{{ Esapp }}">
      <div ref="{{ Desplazamientoreferencia }}" class="mt-scroll m75 {{ Estilocontenedorapp }}">

        <mt-if value="{{ Mostrarbarrasuperior }}">
        <div class="m76 barra-superior">
            <button type="button" class="barra-marca" al-clic="{{ Pestanair.inicio }}" aria-label="MiTecho, ir a Inicio"><img class="barra-logo" src="assets/Logoapp.webp" width="128" height="128" alt=""><span class="barra-nombre"><span class="barra-nombre-texto">MiTecho</span><span class="barra-colores" aria-hidden="true"><span></span><span></span><span></span></span></span></button>
            <div class="barra-acciones">
              <button type="button" class="barra-icono" al-clic="{{ Abrirayuda }}" aria-label="Ayuda y glosario"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.5M12 17h.01"></path></svg></button>
              <button type="button" class="barra-icono" al-clic="{{ Alternartema }}" aria-label="{{ Temaetiqueta }}">
                <mt-if value="{{ Esoscuro }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg></mt-if>
                <mt-if value="{{ Esclaro }}"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"></path></svg></mt-if>
              </button>
              <button type="button" class="barra-avatar" al-clic="{{ Abrirmenu }}" aria-label="Tu perfil y ajustes" data-tutorial="perfil">
                <span class="barra-avatar-circulo" style="background:{{ Avatarfondo }};color:{{ Avatartexto }};box-shadow:{{ Avatarsombra }}">
                  <mt-if value="{{ Tieneavatarimagen }}"><img src="{{ Avatarimagen }}" alt=""></mt-if>
                  <mt-if value="{{ Sinavatarimagen }}"><mt-if value="{{ Coniniciales }}">{{ Iniciales }}</mt-if><mt-if value="{{ Sininiciales }}"><svg class="sin-nombre-icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></mt-if></mt-if>
                </span>
              </button>
            </div>
          </div>
        </mt-if>
`;
