// Plantilla de bienvenida inicial (4 pasos para calcular el presupuesto y pantalla de resultado)

const Svgcandado = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';

const Plantillacuestionario = `
      <mt-if value="{{ Escuestionario }}">
        <div class="bienvenida">
          <header class="bienvenida-cabeza">
            <div class="bienvenida-top">
              <mt-if value="{{ Cuestionariomostraratras }}"><button type="button" class="bienvenida-atras" al-clic="{{ Cuestionarioatras }}" aria-label="Paso anterior"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button></mt-if>
              <span class="bienvenida-paso">{{ Cuestionariocontador }}</span>
            </div>
            <div class="bienvenida-barras"><mt-for list="{{ Cuestionariobarras }}" as="Barrapaso"><span class="bienvenida-tramo {{ Barrapaso.Clase }}"></span></mt-for></div>
          </header>

          <div class="mt-scroll bienvenida-cuerpo">
            <mt-if value="{{ Cuestionariopasocero }}">
              <h1 class="titulo-pantalla">¿Cómo recibes tu dinero?</h1>
              <p class="texto-guia">Así sabemos qué datos pedirte y cómo los va a mirar el banco.</p>
              <div class="bienvenida-opciones" role="radiogroup" aria-label="Tipo de ingresos">
                <mt-for list="{{ Tipoopciones }}" as="Opciontipo">
                  <button type="button" class="bienvenida-opcion {{ Opciontipo.Clase }}" role="radio" aria-checked="{{ Opciontipo.Activo }}" al-clic="{{ Opciontipo.Alclic }}">
                    <div class="bienvenida-opcion-textos">
                      <span class="bienvenida-opcion-titulo">{{ Opciontipo.Etiqueta }}</span>
                      <span class="texto-cuerpo">{{ Opciontipo.Descripcioncorta }}</span>
                    </div>
                    <span class="bienvenida-radio" aria-hidden="true"><span class="bienvenida-radio-punto"></span></span>
                  </button>
                </mt-for>
              </div>
            </mt-if>

            <mt-if value="{{ Cuestionariopasouno }}">
              <h1 class="titulo-pantalla">¿Cuánto recibes en un mes normal?</h1>
              <p class="texto-guia">Escribe un promedio. Después lo afinas registrando lo que ganas cada día.</p>
              <mt-if value="{{ Cuestionariomostrarfijo }}">
                <label class="bienvenida-campo"><span class="bienvenida-rotulo">{{ Cuestionariofijorotulo }}</span><span class="bienvenida-monto"><span class="bienvenida-signo">$</span><input class="bienvenida-numero" maxlength="12" value="{{ Cuestionariofijotexto }}" al-escribir="{{ Escribircuestionariofijo }}" inputMode="numeric" placeholder="0"></span></label>
              </mt-if>
              <mt-if value="{{ Cuestionariomostrarvariable }}">
                <label class="bienvenida-campo"><span class="bienvenida-rotulo">{{ Cuestionariovariablerotulo }}</span><span class="bienvenida-monto"><span class="bienvenida-signo">$</span><input class="bienvenida-numero" maxlength="12" value="{{ Cuestionariovariabletexto }}" al-escribir="{{ Escribircuestionariovariable }}" inputMode="numeric" placeholder="0"></span></label>
              </mt-if>
              <div class="bienvenida-tip">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"></path></svg>
                <p class="texto-cuerpo text-tinta"><b>¿No sabes el promedio?</b> Suma lo que ganas en una semana normal y multiplícalo por 4.</p>
              </div>
              <p class="bienvenida-info"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg><span>El banco lo confirma con tus extractos bancarios de los últimos meses o tu declaración de renta.</span></p>
            </mt-if>

            <mt-if value="{{ Cuestionariopasodos }}">
              <h1 class="titulo-pantalla">¿Pagas deudas cada mes?</h1>
              <p class="texto-guia">Tarjetas, créditos, libranzas o arriendo. El banco las resta de tus ingresos antes de prestarte.</p>
              <mt-if value="{{ Cuestionariotienedeudas }}">
                <div class="bienvenida-deudas">
                  <mt-for list="{{ Cuestionariodeudafilas }}" as="Filatabla">
                    <div class="bienvenida-deuda-fila"><span class="bienvenida-deuda-nombre">{{ Filatabla.Nombreitem }}</span><span class="bienvenida-deuda-cuota">{{ Filatabla.Cuota }}</span><button type="button" class="bienvenida-deuda-quitar" al-clic="{{ Filatabla.Alquitar }}" aria-label="Quitar deuda">×</button></div>
                  </mt-for>
                  <div class="bienvenida-deuda-total"><span class="texto-cuerpo">Total al mes</span><span class="sim-total">{{ Cuestionariodeudatotal }}</span></div>
                </div>
              </mt-if>
              <mt-if value="{{ Cuestionarioformdeudaabierto }}">
                <div class="tarjeta">
                  <div class="registro-fichas"><mt-for list="{{ Cuestionariotipofichas }}" as="Ficha"><button type="button" class="registro-ficha {{ Ficha.Clase }}" aria-pressed="{{ Ficha.Activo }}" al-clic="{{ Ficha.Alclic }}">{{ Ficha.Etiqueta }}</button></mt-for></div>
                  <label class="bienvenida-campo"><span class="bienvenida-rotulo">Cuota mensual</span><span class="bienvenida-monto"><span class="bienvenida-signo">$</span><input class="bienvenida-numero" maxlength="12" value="{{ Cuestionariodeudacuotatexto }}" al-escribir="{{ Escribircuestionariodeudacuota }}" inputMode="numeric" placeholder="0"></span></label>
                  <button type="button" class="boton-secundario" al-clic="{{ Cuestionarioagregardeuda }}">Agregar a la lista</button>
                </div>
              </mt-if>
              <mt-if value="{{ Cuestionarioformdeudacerrado }}">
                <button type="button" class="boton-secundario" al-clic="{{ Abrircuestionariodeuda }}">+ Agregar otra deuda</button>
              </mt-if>
              <div class="bienvenida-interruptor-caja">
                <button type="button" class="interruptor-fila" role="switch" aria-checked="{{ Cuestionariosindeudasactivo }}" al-clic="{{ Alternarsindeudas }}">
                  <span class="perfil-fila-textos"><span class="bienvenida-opcion-titulo" style="font-size:15px">No tengo deudas</span><span class="texto-pequeno">Actívalo si no pagas créditos, tarjetas ni arriendo.</span></span>
                  <span class="interruptor {{ Cuestionariosindeudasclase }}" aria-hidden="true"></span>
                </button>
              </div>
            </mt-if>

            <mt-if value="{{ Cuestionariopasotres }}">
              <h1 class="titulo-pantalla">¿Con cuánto ahorro cuentas?</h1>
              <p class="texto-guia">Tu ahorro paga la cuota inicial: la parte de la vivienda que el banco no presta.</p>
              <label class="bienvenida-campo"><span class="bienvenida-rotulo">Lo que ya tienes ahorrado</span><span class="bienvenida-monto"><span class="bienvenida-signo">$</span><input class="bienvenida-numero" maxlength="14" value="{{ Cuestionarioahorrotexto }}" al-escribir="{{ Escribircuestionarioahorro }}" inputMode="numeric" placeholder="0"></span><span class="texto-pequeno">Cuentas de ahorro, CDT o cesantías que puedas usar para vivienda.</span></label>
              <label class="bienvenida-campo"><span class="bienvenida-rotulo">Lo que puedes ahorrar al mes</span><span class="bienvenida-monto"><span class="bienvenida-signo">$</span><input class="bienvenida-numero" maxlength="12" value="{{ Cuestionarioahorromestexto }}" al-escribir="{{ Escribircuestionarioahorromes }}" inputMode="numeric" placeholder="0"></span></label>
              <div class="bienvenida-interruptor-caja">
                <button type="button" class="interruptor-fila" role="switch" aria-checked="{{ Cuestionariocajaactiva }}" al-clic="{{ Cuestionarioalternarcaja }}">
                  <span class="perfil-fila-textos"><span class="bienvenida-opcion-titulo" style="font-size:15px">Estoy afiliado a una Caja de compensación</span><span class="texto-pequeno">Si tienes contrato laboral, tu empresa ya te afilió. Da acceso a subsidios.</span></span>
                  <span class="interruptor {{ Cuestionariocajaclase }}" aria-hidden="true"></span>
                </button>
                <mt-if value="{{ Cuestionariocajaactiva }}">
                  <div class="subsidios-fichas"><mt-for list="{{ Cuestionariocajafichas }}" as="Ficha"><button type="button" class="subsidios-ficha {{ Ficha.Clase }}" aria-pressed="{{ Ficha.Activa }}" al-clic="{{ Ficha.Alclic }}">{{ Ficha.Etiqueta }}</button></mt-for></div>
                </mt-if>
              </div>
            </mt-if>

            <mt-if value="{{ Cuestionariopasocuatro }}">
              <span class="bienvenida-kicker">{{ Cuestionariolistofrase }}</span>
              <h1 class="titulo-pantalla">Podrías comprar una vivienda de hasta</h1>
              <section class="heroe sim-heroe" aria-label="Presupuesto inicial">
                <p class="heroe-precio"><span class="heroe-cifra sim-cifra">\${{ Cuestionarioprecio }}</span><span class="heroe-millones">millones</span></p>
                <div class="heroe-barra" aria-hidden="true"><span class="heroe-tramo-banco" style="flex:{{ Cuestionariobancopeso }}"></span><span class="heroe-tramo-propio" style="flex:{{ Cuestionariopropiopeso }}"></span></div>
                <div class="heroe-partes">
                  <div class="heroe-parte"><span class="heroe-parte-rotulo"><span class="heroe-punto heroe-tramo-banco" aria-hidden="true"></span>El banco te presta</span><span class="heroe-parte-valor">{{ Cuestionariocreditomillones }}</span></div>
                  <div class="heroe-parte"><span class="heroe-parte-rotulo"><span class="heroe-punto heroe-tramo-propio" aria-hidden="true"></span>Tú pones</span><span class="heroe-parte-valor">{{ Cuestionariopropiomillones }}</span></div>
                </div>
              </section>
              <p class="texto-guia">{{ Cuestionarioresultadofrase }}</p>
            </mt-if>
          </div>

          <footer class="bienvenida-pie">
            <mt-if value="{{ Cuestionarioerror }}"><span class="mz" role="alert">{{ Cuestionarioerror }}</span></mt-if>
            <button type="button" class="boton-primario" al-clic="{{ Cuestionariosiguiente }}">{{ Cuestionarioaccion }}</button>
            <p class="bienvenida-privacidad">${Svgcandado}<span>Tus datos son privados y solo se usan para tus cálculos.</span></p>
          </footer>
        </div>
      </mt-if>
`;
