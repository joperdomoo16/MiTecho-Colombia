// Plantilla principal: junta las pantallas de cada pestaña y agrega la barra inferior

const Plantillaprincipal = Plantillainicio
+ Plantillaplan
+ Plantillamovimientos
+ Plantillaingresosplan
+ Plantillasimulador
+ `
      </div>
    </mt-if>

      <mt-if value="{{ Mostrarbarra }}">
        <div class="barra-inferior">
          <nav class="barra-pestanas" aria-label="Navegación principal" data-tutorial="barra">
            <button type="button" class="pestana {{ Pestanaclase.inicio }}" al-clic="{{ Pestanair.inicio }}" aria-current="{{ Pestanaactual.inicio }}"><span class="pestana-icono"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"></path></svg></span><span class="pestana-texto">Inicio</span></button>
            <button type="button" class="pestana {{ Pestanaclase.plan }}" al-clic="{{ Pestanair.plan }}" aria-current="{{ Pestanaactual.plan }}"><span class="pestana-icono"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"></path><path d="M5 4h12l-2.5 4.5L17 13H5"></path></svg></span><span class="pestana-texto">Mi plan</span></button>
            <button type="button" class="pestana pestana-registrar" al-clic="{{ Abrirhoja }}" data-tutorial="registrar"><span class="pestana-mas"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg></span><span class="pestana-texto">Registrar</span></button>
            <button type="button" class="pestana {{ Pestanaclase.simulador }}" al-clic="{{ Pestanair.simulador }}" aria-current="{{ Pestanaactual.simulador }}"><span class="pestana-icono"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"></path><circle cx="15" cy="6" r="2"></circle><circle cx="9" cy="12" r="2"></circle><circle cx="17" cy="18" r="2"></circle></svg></span><span class="pestana-texto">Simular</span></button>
            <button type="button" class="pestana {{ Pestanaclase.ingresos }}" al-clic="{{ Pestanair.ingresos }}" aria-current="{{ Pestanaactual.ingresos }}"><span class="pestana-icono"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20V4M7 4 3.5 7.5M7 4l3.5 3.5M17 4v16M17 20l-3.5-3.5M17 20l3.5-3.5"></path></svg></span><span class="pestana-texto">Movimientos</span></button>
          </nav>
          <div class="barra-anuncio" aria-hidden="true"></div>
        </div>
      </mt-if>
`;
