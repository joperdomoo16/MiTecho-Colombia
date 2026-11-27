// Plantilla de Simular y de Tu resultado: lo que cambia el presupuesto y el detalle de la cuota y del cierre financiero

const Svgflechasimulador = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';
const Svginfosimulador = '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>';
const Chiptiposimulador = `<mt-if value="{{ Tipochipvisible }}"><button type="button" class="heroe-tipo" al-clic="{{ Abrirtipovivienda }}" aria-label="{{ Tipochipetiqueta }}" aria-haspopup="dialog"><span class="heroe-tipo-marco">{{ Tipochiptexto }}${Svginfosimulador}</span></button></mt-if>`;

const Plantillasimulador = `
        <mt-if value="{{ Pestanaes.Simuladorformulario }}">
        <div class="simulador">
          <div class="inicio-saludo"><h1 class="titulo-pantalla">Simular</h1><p class="texto-guia">Prueba cambios y mira al instante qué pasa con tu presupuesto. Lo que cambies aquí también se ve en el Inicio.</p></div>
          <section class="heroe sim-heroe" aria-live="polite" aria-label="Resultado de la simulación">
            <div class="heroe-cabecera"><span class="heroe-rotulo">Vivienda de hasta</span>${Chiptiposimulador}</div>
            <p class="heroe-precio"><span class="heroe-cifra sim-cifra">\${{ Preciodestacado }}</span><span class="heroe-millones">millones</span></p>
            <div class="heroe-partes sim-partes">
              <div class="heroe-parte"><span class="heroe-parte-rotulo">El banco te presta</span><span class="heroe-parte-valor">{{ Creditomillones }}</span></div>
              <div class="heroe-parte"><span class="heroe-parte-rotulo">Cuota del crédito</span><span class="heroe-parte-valor">{{ Cuotamensual }}</span></div>
            </div>
            <mt-if value="{{ Visaviso }}"><p class="sim-heroe-nota">{{ Visavisomensaje }}</p></mt-if>
          </section>
          <mt-if value="{{ Simuladorsubsidiovisible }}"><p class="sim-nota">{{ Simuladorsubsidiomensaje }}</p></mt-if>

          <section class="tarjeta">
            <h2 class="titulo-tarjeta sim-subtitulo">¿Cuánto ganas al mes?</h2>
            <label class="sim-ingreso"><span class="sim-ingreso-cifra">\${{ Ingresoformato }}</span><input class="sim-deslizador" type="range" min="1500000" max="15000000" step="50000" value="{{ Ingresovalor }}" al-cambiar="{{ Cambiaringreso }}" aria-label="Ingresos al mes"></label>
            <div class="sim-rango" aria-hidden="true"><span>$1,5 M</span><span>$15 M</span></div>
            <div class="opciones sim-dos" role="group" aria-label="De dónde sale el ingreso"><mt-for list="{{ Ingresofuentes }}" as="Fuente"><button type="button" class="opcion {{ Fuente.Clase }}" aria-pressed="{{ Fuente.Activo }}" al-clic="{{ Fuente.Alclic }}">{{ Fuente.Etiqueta }}</button></mt-for></div>
            <p class="texto-pequeno">{{ Simingresonota }}</p>
          </section>

          <section class="tarjeta">
            <h2 class="titulo-tarjeta sim-subtitulo">¿Cuánto pagas de deudas al mes?</h2>
            <div class="sim-fichas"><mt-for list="{{ Deudafichas }}" as="Deudaficha"><button type="button" class="sim-ficha {{ Deudaficha.Clase }}" aria-pressed="{{ Deudaficha.Activa }}" al-clic="{{ Deudaficha.Alclic }}">{{ Deudaficha.Etiqueta }}</button></mt-for><button type="button" class="sim-ficha sim-ficha-agregar" al-clic="{{ Abrirhojadeuda }}">+ Agregar deuda</button></div>
            <div class="sim-fila-total"><span class="texto-pequeno">Total que cuenta el banco</span><span class="sim-total">{{ Deudastexto }}</span></div>
            <p class="texto-pequeno">Toca una deuda para sacarla del cálculo, como si ya la hubieras pagado.</p>
          </section>

          <section class="tarjeta" aria-labelledby="sim-tipo">
            <h2 id="sim-tipo" class="titulo-tarjeta sim-subtitulo">¿Qué tipo de vivienda buscas?</h2>
            <div class="sim-tipos" role="group" aria-labelledby="sim-tipo" data-tutorial="modalidad">
              <mt-for list="{{ Modalidadopciones }}" as="Modalidadopcion"><button type="button" class="tipo-opcion sim-tipo {{ Modalidadopcion.Clase }}" al-clic="{{ Modalidadopcion.Alclic }}" aria-pressed="{{ Modalidadopcion.Activa }}"><span class="sim-tipo-nombre">{{ Modalidadopcion.Etiqueta }}</span><span class="sim-tipo-detalle">{{ Modalidadopcion.Descripcioncorta }}</span><mt-if value="{{ Modalidadopcion.Recomendada }}"><span class="tipo-insignia">Para ti</span></mt-if></button></mt-for>
            </div>
            <mt-if value="{{ Tipoavisovisible }}"><div class="tipo-aviso {{ Tipoavisoclase }}" role="status"><span class="tipo-aviso-titulo">{{ Tipoavisotitulo }}</span><span class="tipo-aviso-texto">{{ Tipoavisotexto }}</span></div></mt-if>
            <mt-if value="{{ Esvip }}"><p class="texto-pequeno">Con este precio tu vivienda sería VIP (hasta 90 salarios mínimos = {{ Topeviptexto }}).</p></mt-if>
          </section>

          <section class="tarjeta" aria-labelledby="sim-plazo">
            <h2 id="sim-plazo" class="titulo-tarjeta sim-subtitulo">¿En cuántos años quieres pagar?</h2>
            <div class="opciones" role="group" aria-labelledby="sim-plazo"><mt-for list="{{ Plazoopciones }}" as="Opcion"><button type="button" class="opcion {{ Opcion.Clase }}" aria-pressed="{{ Opcion.Activo }}" al-clic="{{ Opcion.Alclic }}">{{ Opcion.Etiqueta }}</button></mt-for></div>
            <p class="texto-pequeno">{{ Plazorecomendadonota }}</p>
          </section>

          <section class="tarjeta" aria-labelledby="sim-quien">
            <h2 id="sim-quien" class="titulo-tarjeta sim-subtitulo">¿Compras con alguien más?</h2>
            <div class="opciones sim-dos" role="group" aria-labelledby="sim-quien"><mt-for list="{{ Simquien }}" as="Opcion"><button type="button" class="opcion {{ Opcion.Clase }}" aria-pressed="{{ Opcion.Activo }}" al-clic="{{ Opcion.Alclic }}">{{ Opcion.Etiqueta }}</button></mt-for></div>
            <mt-if value="{{ Parejaactiva }}">
              <p class="texto-pequeno">El banco suma los ingresos de los dos y también resta las deudas de los dos. Pide su autorización antes de escribir sus datos (Ley 1581 de 2012).</p>
              <label class="sim-campo"><span class="sim-campo-rotulo">Nombre (opcional)</span><input class="sim-campo-entrada" maxlength="70" value="{{ Parejanombrecampo }}" al-escribir="{{ Escribirparejanombre }}" placeholder="Ej: Diana Pérez"></label>
              <div class="sim-campos">
                <label class="sim-campo"><span class="sim-campo-rotulo">Su ingreso al mes</span><input class="sim-campo-entrada" maxlength="13" value="{{ Parejaingresotexto }}" al-escribir="{{ Escribirparejaingreso }}" inputMode="numeric" placeholder="$0"></label>
                <label class="sim-campo"><span class="sim-campo-rotulo">Sus deudas al mes</span><input class="sim-campo-entrada" maxlength="13" value="{{ Parejadeudastexto }}" al-escribir="{{ Escribirparejadeudas }}" inputMode="numeric" placeholder="$0"></label>
              </div>
              <div class="sim-campos">
                <label class="sim-campo"><span class="sim-campo-rotulo">Su ahorro y cesantías</span><input class="sim-campo-entrada" maxlength="15" value="{{ Parejaahorrotexto }}" al-escribir="{{ Escribirparejaahorro }}" inputMode="numeric" placeholder="$0"></label>
                <label class="sim-campo"><span class="sim-campo-rotulo">Su actividad</span><input class="sim-campo-entrada" maxlength="60" value="{{ Parejaactividadcampo }}" al-escribir="{{ Escribirparejaactividad }}" placeholder="Ej: Empleada"></label>
              </div>
              <mt-if value="{{ Parejacondatos }}">
                <div class="sim-fila-total"><span class="texto-pequeno">Solo tú: {{ Parejasolomillones }}</span><span class="sim-total">Juntos: {{ Parejajuntosmillones }}</span></div>
                <mt-if value="{{ Parejasubsidioaviso }}"><p class="texto-pequeno texto-tinta">{{ Parejasubsidiomensaje }}</p></mt-if>
              </mt-if>
              <mt-if value="{{ Parejasindatos }}"><p class="texto-pequeno">Escribe al menos el ingreso o el ahorro de la otra persona para calcular juntos.</p></mt-if>
              <button type="button" class="boton-secundario" al-clic="{{ Eliminarpareja }}">Quitar y borrar estos datos</button>
            </mt-if>
            <mt-if value="{{ Parejainactiva }}"><p class="texto-pequeno">Con tu pareja o un familiar pueden pedir el crédito juntos y sumar ingresos.</p></mt-if>
          </section>

          <section class="tarjeta sim-avanzado">
            <button type="button" class="sim-avanzado-boton" al-clic="{{ Alternarsimavanzado }}" aria-expanded="{{ Simavanzado }}" data-tutorial="tope"><span class="sim-avanzado-textos"><span class="titulo-tarjeta sim-subtitulo">Opciones avanzadas</span><span class="texto-pequeno">{{ Simavanzadotexto }}</span></span><svg class="sim-avanzado-flecha {{ Simavanzadoclase }}" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></button>
            <mt-if value="{{ Simavanzado }}"><div class="sim-avanzado-cuerpo">
              <div class="sim-grupo"><span id="sim-tope" class="sim-grupo-titulo">Cuota máxima del crédito</span><div class="opciones sim-dos" role="group" aria-labelledby="sim-tope"><mt-for list="{{ Flexibleopciones }}" as="Opcion"><button type="button" class="opcion {{ Opcion.Clase }}" aria-pressed="{{ Opcion.Activo }}" al-clic="{{ Opcion.Alclic }}">{{ Opcion.Etiqueta }}</button></mt-for></div><p class="texto-pequeno">La norma permite que la cuota llegue al 40% de tus ingresos. Aquí la calculamos sobre lo que te queda libre después de tus deudas. Algunos bancos son más estrictos: elige 30% para ver ese caso.</p></div>
              <mt-if value="{{ Mostrarpromedio }}"><div class="sim-grupo"><span id="sim-promedio" class="sim-grupo-titulo">Promedio de tus ingresos variables</span><div class="opciones sim-dos" role="group" aria-labelledby="sim-promedio"><mt-for list="{{ Promedioopciones }}" as="Opcion"><button type="button" class="opcion {{ Opcion.Clase }}" aria-pressed="{{ Opcion.Activo }}" al-clic="{{ Opcion.Alclic }}">{{ Opcion.Etiqueta }}</button></mt-for></div><p class="texto-pequeno">Los bancos miran el promedio de tus extractos de los últimos meses.</p></div></mt-if>
              <mt-if value="{{ Esleasing }}"><div class="sim-grupo"><span id="sim-opcion" class="sim-grupo-titulo">Opción de compra al final</span><div class="opciones" role="group" aria-labelledby="sim-opcion"><mt-for list="{{ Opcioncompraopciones }}" as="Opcion"><button type="button" class="opcion {{ Opcion.Clase }}" aria-pressed="{{ Opcion.Activo }}" al-clic="{{ Opcion.Alclic }}">{{ Opcion.Etiqueta }}</button></mt-for></div><p class="texto-pequeno">Entre más alta, menor el canon mensual y mayor el pago final ({{ Opcioncompratexto }}).</p></div></mt-if>
            </div></mt-if>
          </section>

          <button type="button" class="boton-primario" al-clic="{{ Irresultado }}">Ver resultado completo${Svgflechasimulador}</button>
        </div>
        </mt-if>

        <mt-if value="{{ Pestanaes.Simuladorresultado }}">
        <div class="simulador">
          <button type="button" class="volver sim-volver" al-clic="{{ Irsimulador }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>Simular</button>
          <div class="inicio-saludo"><h1 class="titulo-pantalla">Tu resultado</h1><p class="texto-guia">Con los datos que pusiste en Simular.</p></div>
          <section class="heroe sim-heroe" aria-label="Resumen de tu resultado">
            <div class="heroe-cabecera"><span class="heroe-rotulo">Podrías comprar una vivienda de hasta</span></div>
            <p class="heroe-precio"><span class="heroe-cifra">\${{ Preciodestacado }}</span><span class="heroe-millones">millones</span></p>
            <div class="sim-chips">${Chiptiposimulador}<span class="heroe-tipo-marco">{{ Simplazochip }}</span><span class="heroe-tipo-marco">{{ Simmonedachip }}</span></div>
            <div class="heroe-barra" aria-hidden="true"><span class="heroe-tramo-banco" style="flex:{{ Heroebancopeso }}"></span><span class="heroe-tramo-propio" style="flex:{{ Heroepropiopeso }}"></span></div>
            <div class="heroe-partes">
              <div class="heroe-parte"><span class="heroe-parte-rotulo"><span class="heroe-punto heroe-tramo-banco" aria-hidden="true"></span>Préstamo del banco</span><span class="heroe-parte-valor">{{ Creditomillones }}</span><span class="heroe-parte-nota">{{ Porcentajefinanciado }} del precio</span></div>
              <div class="heroe-parte"><span class="heroe-parte-rotulo"><span class="heroe-punto heroe-tramo-propio" aria-hidden="true"></span>Cuota inicial (tú)</span><span class="heroe-parte-valor">{{ Heroepropiomillones }}</span><span class="heroe-parte-nota">{{ Heroepropionota }}</span></div>
            </div>
          </section>
          <mt-if value="{{ Visaviso }}"><p class="sim-nota">{{ Visavisomensaje }}</p></mt-if>

          <section class="tarjeta sim-detalle">
            <h2 class="titulo-tarjeta">{{ Simcuotatitulo }}</h2>
            <p class="sim-cuota"><span class="sim-cuota-cifra">{{ Cuotamensual }}</span><span class="sim-cuota-plazo">{{ Simplazotexto }}</span></p>
            <div class="sim-fila"><span class="sim-fila-textos"><span>Tasa de interés</span><span class="texto-pequeno">{{ Tasanota }}</span></span><span class="sim-fila-valor">{{ Simtasatexto }}</span></div>
            <mt-if value="{{ Simtotalvisible }}"><div class="sim-fila"><span class="sim-fila-textos"><span>Total que pagarías</span><span class="texto-pequeno">Incluye intereses. Con una tasa más baja pagas menos.</span></span><span class="sim-fila-valor">{{ Simtotalpagar }}</span></div></mt-if>
            <mt-if value="{{ Bloqueado }}"><div class="sim-candado"><p class="texto-pequeno">Compara pesos y UVR y las tasas de cada banco.</p><button type="button" class="boton-secundario" al-clic="{{ Desbloquear }}">{{ Desbloquearetiqueta }}</button></div></mt-if>
            <mt-if value="{{ Simcomparar }}">
              <div class="sim-grupo"><span id="sim-moneda" class="sim-grupo-titulo">¿Cómo quieres pagar el crédito?</span><div class="opciones sim-dos" role="group" aria-labelledby="sim-moneda"><mt-for list="{{ Tasaopciones }}" as="Opcion"><button type="button" class="opcion {{ Opcion.Clase }}" aria-pressed="{{ Opcion.Activo }}" al-clic="{{ Opcion.Alclic }}">{{ Opcion.Etiqueta }}</button></mt-for></div><p class="texto-pequeno">En pesos la cuota no cambia. En UVR empieza más baja, pero sube con la inflación.</p></div>
              <div class="sim-grupo"><span id="sim-banco" class="sim-grupo-titulo">Tasa de qué banco</span><div class="sim-fichas" role="group" aria-labelledby="sim-banco"><mt-for list="{{ Entidadopciones }}" as="Opcion"><button type="button" class="sim-ficha {{ Opcion.Clase }}" aria-pressed="{{ Opcion.Activo }}" al-clic="{{ Opcion.Alclic }}">{{ Opcion.Etiqueta }}</button></mt-for></div></div>
              <mt-if value="{{ Esuvr }}"><div class="sim-uvr"><mt-for list="{{ Uvrfilas }}" as="Usofila"><div class="sim-fila"><span>{{ Usofila.Etiqueta }}</span><span class="sim-fila-valor">{{ Usofila.Valorfila }}</span></div></mt-for><p class="texto-pequeno">Punto de equilibrio: <b class="texto-tinta">{{ Puntoequilibriouvr }}</b>. Si la inflación promedio de los años del crédito es menor a 5,58% ganas con UVR; si es mayor, en pesos pagas menos.</p></div></mt-if>
            </mt-if>
            <button type="button" class="enlace" al-clic="{{ Abrirtasassimulador }}">Comparar bancos y tasas${Svgflechasimulador}</button>
          </section>

          <section class="tarjeta sim-detalle">
            <h2 class="titulo-tarjeta">Lo que necesitas para comprar</h2>
            <div class="sim-fila"><span>Precio de la vivienda</span><span class="sim-fila-valor">{{ Preciotexto }}</span></div>
            <div class="sim-fila"><span>Préstamo del banco</span><span class="sim-fila-valor">− {{ Creditousadotexto }}</span></div>
            <div class="sim-fila"><span class="sim-fila-textos"><span>Notaría y registro</span><span class="texto-pequeno">{{ Gastosetiquetacierre }}</span></span><span class="sim-fila-valor">{{ Gastostexto }}</span></div>
            <mt-if value="{{ Tienesubsidiocaja }}"><div class="sim-fila"><span>Subsidio de la Caja ({{ Subsidiocajasalarios }} salarios mínimos)</span><span class="sim-fila-valor">− {{ Subsidiocajatexto }}</span></div></mt-if>
            <mt-if value="{{ Tienesubsidiomicasaya }}"><div class="sim-fila"><span class="sim-fila-textos"><span>Mi Casa Ya ({{ Subsidiomicasayasalariostexto }} salarios mínimos)</span><span class="texto-pequeno">Aplica sobre todo a vivienda nueva; confírmalo con la entidad.</span></span><span class="sim-fila-valor">− {{ Subsidiomicasayatexto }}</span></div></mt-if>
            <div class="sim-fila"><span>Tu ahorro y cesantías</span><span class="sim-fila-valor">− {{ Ahorrotexto }}</span></div>
            <div class="sim-falta"><span class="sim-falta-rotulo">{{ Simfaltarotulo }}</span><span class="sim-falta-valor {{ Simfaltaclase }}">{{ Faltatexto }}</span></div>
            <mt-if value="{{ Esleasing }}"><div class="sim-fila"><span>Opción de compra al final ({{ Opcioncompraporcentaje }})</span><span class="sim-fila-valor">{{ Opcioncompratexto }}</span></div></mt-if>
            <p class="texto-pequeno">A esto los bancos le llaman <b class="texto-tinta">cierre financiero</b>.</p>
            <mt-if value="{{ Limiteahorro }}"><p class="texto-pequeno">Con lo que tienes hoy cierras hasta <b class="texto-tinta">{{ Preciohoymillones }}</b>.</p></mt-if>
            <mt-if value="{{ Mostrarfinanciargastos }}">
              <button type="button" class="interruptor-fila" al-clic="{{ Alternarfinanciargastos }}" aria-pressed="{{ Financiargastosactivo }}"><span class="sim-fila-textos"><span>Sumar la notaría y el registro al préstamo</span><span class="texto-pequeno">{{ Financiargastosnota }}</span></span><span class="interruptor {{ Financiargastosclase }}" aria-hidden="true"></span></button>
              <mt-if value="{{ Financiargastosimpacto }}">
                <div class="sim-gastos-impacto" role="status" aria-live="polite">
                  <span class="sim-gastos-impacto-titulo">Efecto frente a pagar notaría con ahorro</span>
                  <mt-for list="{{ Financiargastosfilas }}" as="Fila"><div class="sim-gastos-impacto-fila"><span>{{ Fila.Etiqueta }}</span><span class="sim-gastos-impacto-valor {{ Fila.Clase }}">{{ Fila.Valorfila }}</span></div></mt-for>
                </div>
              </mt-if>
            </mt-if>
          </section>

          <p class="texto-pequeno sim-aviso">Es un estimado con las reglas de la Superintendencia Financiera. La aprobación final depende del estudio de crédito del banco.</p>
          <div class="sim-botones">
            <button type="button" class="boton-primario" al-clic="{{ Descargarpdf }}"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"></path></svg>Descargar reporte PDF</button>
            <mt-if value="{{ Simpdfvisible }}"><p class="texto-pequeno sim-centro">{{ Simpdfnota }}</p></mt-if>
            <button type="button" class="boton-secundario" al-clic="{{ Pestanair.plan }}">Ver mi plan para comprar</button>
          </div>
        </div>
        </mt-if>
`;
