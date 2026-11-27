// Plantilla de «Comparar bancos»: la cuota con la tasa de cada entidad, de la más baja a la más alta, y una oferta propia para comparar

const Plantillatasas = `
      <mt-if value="{{ Estasas }}">
        <div class="mt-scroll m3l detalle">
          <div class="barra-detalle"><button type="button" class="volver" al-clic="{{ Cerrarpanel }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg><span>{{ Tasasvolver }}</span></button><span class="barra-detalle-espacio"></span><button type="button" class="barra-icono" al-clic="{{ Abrirayuda }}" aria-label="Ayuda y glosario"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01"></path></svg></button></div>
          <h1 class="titulo-detalle">Comparar bancos</h1>
          <div class="detalle-cuerpo">
            <p class="texto-guia">{{ Tasasguia }}</p>
            <span class="bancos-fuente"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6M5 10v9M19 10v9M9 10v9M15 10v9M3 21h18"></path></svg>{{ Tasasfuente }}</span>
            <mt-if value="{{ Tasassindatos }}"><p class="texto-pequeno">Aún no tenemos las tasas de la Superintendencia en este celular. Conéctate a internet y vuelve a abrir esta sección.</p></mt-if>
            <mt-if value="{{ Tasasdisponibles }}">
              <div class="bancos-grupo"><span id="bancos-producto" class="bancos-rotulo">Tipo de crédito</span><div class="bancos-fichas" role="group" aria-labelledby="bancos-producto"><mt-for list="{{ Tasasproductos }}" as="Producto"><button type="button" class="bancos-ficha {{ Producto.Clase }}" aria-pressed="{{ Producto.Activo }}" al-clic="{{ Producto.Alclic }}">{{ Producto.Etiqueta }}</button></mt-for></div></div>
              <mt-if value="{{ Tasassinpro }}">
                <section class="tarjeta bancos-candado"><h2 class="titulo-tarjeta">Compara tu cuota en cada banco</h2><p class="texto-pequeno">Con los datos de la Superintendencia Financiera. Mira 3 videos cortos para abrir la comparación; queda abierta desde ese momento.</p><span class="texto-pequeno texto-tinta">{{ Tasasanunciosprogreso }}</span><button type="button" class="boton-primario" al-clic="{{ Desbloqueartasas }}">{{ Tasasbotontexto }}</button></section>
              </mt-if>
              <div class="bancos-contenido {{ Tasasbloqueoclase }}" aria-hidden="{{ Tasasbloqueado }}" inert="{{ Tasasbloqueado }}">
                <mt-if value="{{ Tasasdiferenciavisible }}"><div class="bancos-idea"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"></path></svg><p>Entre la tasa más baja y la más alta hay <b>{{ Tasasdiferenciames }} al mes</b> de diferencia. En {{ Tasasanios }} años son <b>{{ Tasasdiferenciatotal }}</b>.</p></div></mt-if>
                <p class="texto-pequeno">{{ Tasasorden }}</p>
                <ol class="bancos-lista" aria-label="Entidades ordenadas de menor a mayor cuota">
                  <mt-for list="{{ Tasasfilas }}" as="Fila"><li class="bancos-fila {{ Fila.Clase }}">
                    <button type="button" class="bancos-fila-boton" al-clic="{{ Fila.Alternar }}" aria-expanded="{{ Fila.Abiertaetiqueta }}"><span class="bancos-puesto" aria-hidden="true">{{ Fila.Puesto }}</span><span class="bancos-textos"><span class="bancos-nombre">{{ Fila.Nombre }}</span><span class="texto-pequeno">{{ Fila.Tasa }}</span></span><span class="bancos-cuota"><span class="bancos-cuota-valor">{{ Fila.Cuota }}</span><span class="texto-pequeno">al mes</span></span></button>
                    <div class="bancos-barra" aria-hidden="true"><div class="bancos-barra-relleno" style="width:{{ Fila.Ancho }}"></div></div>
                    <mt-if value="{{ Fila.Esmasbaja }}"><span class="bancos-etiqueta">La cuota más baja</span></mt-if>
                    <mt-if value="{{ Fila.Tienenota }}"><span class="texto-pequeno">{{ Fila.Nota }}</span></mt-if>
                    <mt-if value="{{ Fila.Expandida }}"><dl class="bancos-detalle"><div><dt>Rango de tasas</dt><dd>{{ Fila.Rango }}</dd></div><div><dt>Datos</dt><dd>{{ Fila.Creditos }}</dd></div><div><dt>Te prestaría hasta</dt><dd>{{ Fila.Prestamo }}</dd></div><div><dt>Total pagado</dt><dd>{{ Fila.Total }}</dd></div><p class="texto-pequeno">{{ Fila.Comparacion }}</p></dl></mt-if>
                  </li></mt-for>
                </ol>
                <section class="tarjeta" data-tutorial="oferta">
                  <h2 class="titulo-tarjeta bancos-subtitulo">¿Ya te ofrecieron una tasa?</h2>
                  <p class="texto-pequeno">Escríbela y te decimos si está por encima o por debajo del promedio.</p>
                  <label class="bancos-oferta"><span class="solo-lector">Tasa anual que te ofrecieron</span><input class="bancos-oferta-entrada" maxlength="6" value="{{ Tasasofertavalor }}" al-escribir="{{ Escribirtasaoferta }}" inputMode="decimal" placeholder="Ej.: 13,5"><span class="bancos-oferta-unidad">% anual</span></label>
                  <mt-if value="{{ Tasasofertalista }}"><div class="bancos-oferta-resultado"><span class="texto-pequeno">Tu cuota con esa tasa</span><span class="bancos-cuota-valor">{{ Tasasofertacuota }}</span></div><p class="texto-cuerpo">{{ Tasasofertamensaje }}</p></mt-if>
                  <p class="texto-pequeno">{{ Tasasmercadotexto }}</p>
                </section>
              </div>
              <p class="texto-pequeno">{{ Tasasavisooficial }}</p>
              <p class="texto-pequeno"><b class="texto-tinta">Vivienda nueva o usada.</b> La mayoría de entidades financia vivienda nueva y usada, pero algunas líneas de crédito y subsidios tienen restricciones (por ejemplo, Mi Casa Ya se orienta a vivienda nueva y solo en algunos casos aplica a usada, y algunas entidades limitan la antigüedad del inmueble). Las tasas de esta sección incluyen créditos de vivienda nueva y usada. <b class="texto-tinta">Antes de decidir, verifica estas condiciones con la entidad con la que te interesa financiar.</b></p>
              <p class="texto-pequeno">{{ Tasasavisocuota }}</p>
            </mt-if>
          </div>
        </div>
      </mt-if>
`;
