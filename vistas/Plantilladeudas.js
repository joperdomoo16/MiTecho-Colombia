// Plantilla de «Tus deudas»: cuánto podría costar la vivienda si la persona termina de pagar cada deuda

const Plantilladeudas = `
      <mt-if value="{{ Esdeudas }}">
        <div class="mt-scroll m3l detalle">
          <div class="barra-detalle"><button type="button" class="volver" al-clic="{{ Cerrarpanel }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg><span>{{ Deudasvolver }}</span></button><span class="barra-detalle-espacio"></span><button type="button" class="barra-icono" al-clic="{{ Abrirayuda }}" aria-label="Ayuda y glosario"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.5M12 17h.01"></path></svg></button></div>
          <h1 class="titulo-detalle">Tus deudas</h1>
          <div class="detalle-cuerpo">
            <p class="texto-guia">El banco resta de tus ingresos lo que pagas cada mes por deudas. Cuando terminas de pagar una, ese dinero queda libre para la cuota de tu vivienda.</p>
            <section class="deudas-heroe" aria-live="polite" aria-label="Presupuesto con deudas pagadas">
              <span class="deudas-heroe-rotulo">Con las deudas que marques como pagadas, tu vivienda podría costar hasta</span>
              <p class="deudas-heroe-precio"><span class="deudas-heroe-cifra">\${{ Deudasprecio }}</span><span class="deudas-heroe-millones">millones</span></p>
              <span class="deudas-heroe-cambio {{ Deudascambioclase }}">{{ Deudascambio }}</span>
            </section>
            <mt-for list="{{ Deudastarjetas }}" as="Deuda">
              <section class="tarjeta">
                <div class="deuda-cabecera"><span class="deuda-icono" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{ Deuda.Icono }}"></path></svg></span><div class="deuda-textos"><div class="deuda-titulo-fila"><h2 class="titulo-tarjeta deuda-nombre">{{ Deuda.Nombre }}</h2><button type="button" class="deuda-editar" al-clic="{{ Deuda.Editar }}" aria-label="{{ Deuda.Editaretiqueta }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg></button></div><span class="texto-pequeno">{{ Deuda.Detalle }}</span></div></div>
                <div class="deuda-ganancia"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"></path><path d="M15 7h6v6"></path></svg><mt-if value="{{ Deuda.Sube }}"><span>{{ Deuda.Gananciainicio }}<b>{{ Deuda.Ganancia }}</b> para tu vivienda</span></mt-if><mt-if value="{{ Deuda.Nosube }}"><span>{{ Deuda.Ganancianota }}</span></mt-if></div>
                <button type="button" class="interruptor-fila" role="switch" aria-checked="{{ Deuda.Pagada }}" al-clic="{{ Deuda.Alternar }}"><span>{{ Deuda.Interruptortexto }}</span><span class="interruptor {{ Deuda.Interruptorclase }}" aria-hidden="true"></span></button>
              </section>
            </mt-for>
            <mt-if value="{{ Deudasvacio }}"><p class="texto-cuerpo">No tienes deudas registradas. Agrégalas para que el cálculo sea igual al del banco.</p></mt-if>
            <mt-if value="{{ Deudasavisovisible }}"><div class="aviso-suave"><span class="aviso-suave-icono" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 2.5 20h19z"></path><path d="M12 10v4.5M12 17.2h.01"></path></svg></span><p class="aviso-suave-texto">{{ Deudasaviso }}</p></div></mt-if>
            <button type="button" class="boton-secundario" al-clic="{{ Abrirhojadeuda }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>{{ Deudasagregar }}</button>
            <mt-if value="{{ Deudasnotavisible }}"><p class="texto-pequeno deudas-nota"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg><span>{{ Deudasnota }}</span></p></mt-if>
          </div>
        </div>
      </mt-if>
`;
