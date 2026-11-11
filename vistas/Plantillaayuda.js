// Plantilla de la pantalla de ayuda con las preguntas frecuentes y las leyes de vivienda en Colombia

const Plantillaayuda = `
<sc-if value="{{ Ayudapantalla }}" hint-placeholder-val="{{ false }}">
        <div class="mt-scroll m3l">
          <div class="m3m"><button class="m3n" al-clic="{{ Cerrarayuda }}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>Volver</button><span class="m3o">AYUDA</span></div>
          <div class="m5i">
            <h1 class="m65">Cómo leer tus cifras</h1>
            <p class="m66">Todo lo que ves en Inicio sale de la misma fórmula que usan los bancos en Colombia. Los valores de abajo son los tuyos de hoy.</p>
            <button al-clic="{{ Contactarsoporteayuda }}" style="margin-top:6px;width:100%;padding:12px 16px;border-radius:18px;background:var(--cd);border:1px solid var(--ln);display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;box-sizing:border-box;cursor:pointer">
              <div style="display:flex;align-items:center;gap:10px;min-width:0">
                <span style="width:32px;height:32px;border-radius:16px;background:var(--c2);color:var(--at);display:flex;align-items:center;justify-content:center;flex:none"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span>
                <div style="display:flex;flex-direction:column;gap:1px;min-width:0">
                  <span style="font:600 13.5px 'Familjen Grotesk',sans-serif;color:var(--ik)">¿Necesitas ayuda o reportar un problema?</span>
                  <span style="font:400 11.5px 'Hanken Grotesk',sans-serif;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Completa el formulario de soporte técnico</span>
                </div>
              </div>
              <span style="font:700 12.5px 'Familjen Grotesk',sans-serif;color:var(--at);flex:none">Contáctanos →</span>
            </button>
          </div>
          <div class="m67">
            <span class="m4z">TU CASA, EN DOS PARTES</span>
            <div class="m1j"><span class="m1d">Precio de la casa</span><span class="m68">{{ Preciomillones }}</span></div>
            <div class="m69">
              <div style="width:{{ Financiacionancho }};background:var(--ac);border-radius:12px;display:flex;align-items:center;padding:0 12px;box-sizing:border-box;font:700 13px 'Familjen Grotesk',sans-serif;color:var(--oa)">Banco</div>
              <div class="m6a">Tú</div>
            </div>
            <div class="m6b">
              <span>El banco te presta (crédito)</span><span class="m6c">{{ Porcentajefinanciado }}</span><span class="m6d">{{ Creditomillones }}</span>
              <span>Tú pones (cuota inicial)</span><span class="m6c">{{ Cuotainicialparte }}</span><span class="m6d">{{ Cuotainicialmillones }}</span>
            </div>
          </div>
          <div class="m6e">
  
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarcero }}">
                <span class="m6h">01</span>
                <span class="m6i">¿Qué es la cifra grande?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondocero }};color:{{ Ayuda.Colorcero }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signocero }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertocero }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">Es el <b class="m3e">precio de la vivienda más cara</b> que, según tus ingresos y deudas, un banco podría financiarte si tienes la cuota inicial completa. Hoy es <b class="m3e">{{ Preciomillones }}</b>.</p><p class="m66">Si tu ahorro todavía no alcanza para la cuota inicial y los gastos, en el inicio ves hasta cuánto cierras hoy y cuánto te falta. La cifra cambia cada vez que ajustas tus ingresos, agregas o apagas una deuda, o eliges otro tipo de vivienda.</p></div></sc-if>
            </div>
  
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternaruno }}">
                <span class="m6h">02</span>
                <span class="m6i">¿En qué se diferencia del crédito?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondouno }};color:{{ Ayuda.Coloruno }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signouno }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertouno }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">El banco nunca presta el valor completo de la casa. El <b class="m3e">crédito</b> es la parte que te presta; el resto lo pones tú como <b class="m3e">cuota inicial</b>.</p><div class="m6k"><div class="m6l"><span>Casa</span><span class="m6m">{{ Preciomillones }}</span></div><div class="m6l"><span>− Banco te presta</span><span class="m6m">{{ Creditomillones }}</span></div><div class="m6n"><span>= Tú pones</span><span class="m6o">{{ Cuotainicialmillones }}</span></div></div></div></sc-if>
            </div>
  
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternardos }}">
                <span class="m6h">03</span>
                <span class="m6i">¿Cómo lo calcula el banco?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondodos }};color:{{ Ayuda.Colordos }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signodos }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertodos }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">El banco revisa cuánto te queda libre cada mes y solo deja que la cuota de vivienda use una parte de eso.</p><div class="m6k"><div class="m6l"><span>{{ Ingresoetiquetaayuda }}</span><span class="m6m">{{ Ingresotexto }}</span></div><div class="m6l"><span>− Deudas mensuales</span><span class="m6m">{{ Deudastexto }}</span></div><div class="m6l"><span>{{ Topeetiqueta }}</span><span class="m6m">{{ Capacidadcuotatexto }}</span></div><div class="m6l"><span>{{ Factoretiqueta }}</span><span class="m6m">{{ Creditocadenatexto }}</span></div><sc-if value="{{ Vistopadafila }}" hint-placeholder-val="{{ false }}"><div class="m6p"><span>{{ Financiacionetiqueta }}</span><span class="m6m">{{ Preciosintopetexto }}</span></div></sc-if>
            <div class="m6n"><span>{{ Financiacionetiquetaultima }}</span><span class="m6o">{{ Preciotexto }}</span></div></div><p class="m66">El resultado de “× {{ Topeporcentaje }}” es la <b class="m3e">cuota mensual máxima</b> que te aprueban.</p></div></sc-if>
            </div>
  
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternartres }}">
                <span class="m6h">04</span>
                <span class="m6i">¿Por qué el porcentaje cambia entre VIS, No VIS y Leasing?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondotres }};color:{{ Ayuda.Colortres }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signotres }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertotres }}" hint-placeholder-val="{{ false }}"><div class="m6j"><div class="m6k"><div class="m6l"><span>NO VIS</span><span class="m6m">banco presta 70%</span></div><div class="m6l"><span>VIS</span><span class="m6m">banco presta 80%</span></div><div class="m6l"><span>LEASING</span><span class="m6m">banco financia 80%–90%</span></div></div><p class="m66">En <b class="m3e">{{ Ciudad }}</b> una vivienda es <b class="m3e">VIS</b> si cuesta hasta <b class="m3e">{{ Topevissalariosminimos }} salarios mínimos ({{ Topevistexto }})</b>, y <b class="m3e">VIP</b> si cuesta hasta 90 ({{ Topeviptexto }}). En VIS el banco financia hasta el 80% y puedes usar subsidios de Caja y Mi Casa Ya. Cambias la modalidad en Simular.</p></div></sc-if>
            </div>
  
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarcuatro }}">
                <span class="m6h">05</span>
                <span class="m6i">¿Qué es la cuota inicial?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondocuatro }};color:{{ Ayuda.Colorcuatro }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signocuatro }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertocuatro }}" hint-placeholder-val="{{ false }}"><div class="m6j">
                <p class="m66">Es tu parte del precio: <b class="m3e">{{ Cuotainicialmillones }}</b>. Llevas ahorrados <b class="m3e">{{ Ahorromillones }}</b>. La barra de Inicio muestra tu avance.</p>
                <p class="m66">Además separa <b class="m3e">{{ Gastostexto }}</b> para gastos de notaría, escritura y registro (aprox. 3%).</p>
                <p class="m66"><b class="m3e">Financiación con el banco (Ley 2434 de 2024):</b> Puedes solicitar que el banco incluya los gastos notariales en el crédito. Si lo activas en Simular, tus ahorros solo cubren la cuota inicial de la vivienda, aunque la cuota mensual sube ligeramente.</p>
              </div></sc-if>
            </div>
  
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarcinco }}">
                <span class="m6h">06</span>
                <span class="m6i">¿Qué son la meta de hoy y la racha?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondocinco }};color:{{ Ayuda.Colorcinco }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signocinco }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertocinco }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">La <b class="m3e">meta de hoy</b> es lo que necesitas ganar cada día para llegar al ingreso que pide la vivienda que buscas: (ingreso necesario <b class="m3e">{{ Ingresonecesariotexto }}</b> − ingresos fijos) ÷ 26 días = <b class="m3e">{{ Metatexto }}</b>. Cambia la vivienda objetivo en tu perfil.</p><p class="m66">La <b class="m3e">racha</b> cuenta los días seguidos en que registras. Entre más constantes tus registros, más se parece tu promedio al que verá el banco.</p></div></sc-if>
            </div>
  
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarseis }}">
                <span class="m6h">07</span>
                <span class="m6i">¿Por qué importa el efectivo sin consignar?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondoseis }};color:{{ Ayuda.Colorseis }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signoseis }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertoseis }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">El banco solo ve lo que entra a tus cuentas. El efectivo que no consignas <b class="m3e">no aparece en tus extractos</b> y no cuenta como ingreso.</p><p class="m66">Consígnalo o pásalo a Nequi o DaviPlata para que sume a tu cupo.</p></div></sc-if>
            </div>
  
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarsiete }}">
                <span class="m6h">08</span>
                <span class="m6i">¿Por qué $100.000 más suben tanto la casa?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondosiete }};color:{{ Ayuda.Colorsiete }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signosiete }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertosiete }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">Porque cada peso de cuota se multiplica por la tasa y el plazo del crédito (× {{ Factorcorto }} con {{ Tasaanualtexto }} a {{ Plazotexto }}).</p><div class="m6k"><div class="m6l"><span>Ingreso extra</span><span class="m6m">$100.000</span></div><div class="m6l"><span>{{ Topeetiqueta }}</span><span class="m6m">{{ Sensibilidadcapacidad }}</span></div><div class="m6l"><span>{{ Factoretiqueta }}</span><span class="m6m">{{ Sensibilidadcredito }}</span></div><div class="m6n"><span>{{ Financiacionetiqueta }}</span><span class="m6o">{{ Sensibilidadmillones }}</span></div></div></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarocho }}">
                <span class="m6h">09</span>
                <span class="m6i">¿Por qué no puedo comprar ya la casa que me aprueba el banco?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondoocho }};color:{{ Ayuda.Colorocho }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signoocho }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertoocho }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">El banco financia máximo el <b class="m3e">{{ Porcentajefinanciado }}</b> del precio. El resto lo cubren tu ahorro y tu subsidio. Juntos forman el <b class="m3e">cierre financiero</b> que exige la constructora.</p><div class="m6k"><div class="m6l"><span>Tu ahorro</span><span class="m6m">{{ Ahorrotexto }}</span></div><div class="m6l"><span>+ Subsidio</span><span class="m6m">{{ Subsidiotexto }}</span></div><div class="m6l"><span>÷ {{ Cuotainicialparte }} cuota inicial</span><span class="m6m"></span></div><div class="m6n"><span>= Puedes cerrar hoy</span><span class="m6o">{{ Preciohoymillones }}</span></div></div><p class="m66">Tu cupo del banco (<b class="m3e">{{ Preciomillones }}</b>) es tu meta. Cada peso que ahorras acerca lo que puedes cerrar hoy a esa meta.</p></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarnueve }}">
                <span class="m6h">10</span>
                <span class="m6i">¿Cuánto subsidio me da la Caja de Compensación?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondonueve }};color:{{ Ayuda.Colornueve }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signonueve }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertonueve }}" hint-placeholder-val="{{ false }}"><div class="m6j"><div class="m6k"><div class="m6l"><span>Hogar hasta 2 SMMLV</span><span class="m6m">30 SMMLV · $52,5 M</span></div><div class="m6l"><span>De 2 a 4 SMMLV</span><span class="m6m">20 SMMLV · $35,0 M</span></div><div class="m6l"><span>Más de 4 SMMLV</span><span class="m6m">No aplica</span></div><div class="m6n"><span>+ Mi Casa Ya (Sisbén, hasta 2 SMMLV)</span><span class="m6o">+20 SMMLV</span></div></div><p class="m66">Tu hogar gana <b class="m3e">{{ Salariosminimostexto }} SMMLV</b>. {{ Perfilsubsidiomensaje }}</p><p class="m66">El subsidio solo aplica para vivienda VIS, no se devuelve y se abona a la constructora como parte de tu cuota inicial. Si eres independiente puedes afiliarte a una Caja de forma voluntaria aportando el 0,6% o el 2% de tus ingresos.</p></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternardiez }}">
                <span class="m6h">11</span>
                <span class="m6i">¿De dónde salen estos valores?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondodiez }};color:{{ Ayuda.Colordiez }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signodiez }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertodiez }}" hint-placeholder-val="{{ false }}"><div class="m6j">
                <div class="m6q"><sc-for list="{{ Fuentes }}" as="Fuenteingreso" hint-placeholder-count="8"><div class="m62"><div class="m6r"><span class="m5n">{{ Fuenteingreso.Clave }}</span><span class="m6s">{{ Fuenteingreso.Valor }}</span></div><span class="m6t">{{ Fuenteingreso.Formactual }}</span></div></sc-for></div>
                <p class="m66">El crédito se calcula con la tasa y el plazo: tu cuota máxima × {{ Factorcorto }} (tasa {{ Tasaanualtexto }} a {{ Plazotexto }}). Así lo hacen los bancos; la regla rápida de “× 100” sobreestima el crédito con las tasas actuales.</p>
                <p class="m66">Son valores proyectados con rigor financiero conforme a la normatividad bancaria vigente y pueden variar según el estudio formal de títulos y riesgo que realice cada entidad financiera.</p>
              </div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternaronce }}">
                <span class="m6h">12</span>
                <span class="m6i">¿Qué son las condiciones del banco?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondoonce }};color:{{ Ayuda.Coloronce }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signoonce }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertoonce }}" hint-placeholder-val="{{ false }}"><div class="m6u">
                <p class="m66">Son las reglas que cada banco aplica al estudiar tu crédito. Las encuentras en <b class="m3e">Simular</b> y cambian tu cupo.</p>
                <div class="m6v"><span class="m6w">01 · PROMEDIO DE INGRESOS VARIABLES</span><span class="m2c">{{ Ayudapromediotitulo }}</span><span class="m6x">{{ Ayudapromediodetalle }}</span></div>
                <div class="m6v"><span class="m6w">02 · CUOTA MÁXIMA SOBRE TU INGRESO</span><span class="m2c">{{ Ayudatopetitulo }}</span><span class="m6x">{{ Ayudatopedetalle }}</span></div>
                <div class="m6v"><span class="m6w">03 · OPCIÓN DE COMPRA (LEASING)</span><span class="m2c">{{ Ayudaopciontitulo }}</span><span class="m6x">{{ Ayudaopciondetalle }}</span></div>
                <div class="m6v"><span class="m6w">04 · VIVIENDA VIP</span><span class="m2c">Hasta 90 SMMLV · {{ Topeviptexto }}</span><span class="m6x">{{ Ayudavipdetalle }}</span></div>
                <p class="m66">Cada entidad financiera aplica sus políticas de crédito dentro de estos límites regulatorios de acuerdo con tu historial crediticio, tipo de vinculación laboral y edad.</p>
              </div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternardoce }}">
                <span class="m6h">13</span>
                <span class="m6i">¿Cómo funciona comprar en pareja o en familia?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondodoce }};color:{{ Ayuda.Colordoce }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signodoce }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertodoce }}" hint-placeholder-val="{{ false }}"><div class="m6j">
                <p class="m66">El banco permite <b class="m3e">sumar ingresos</b> con tu pareja o un familiar (padres, hijos, hermanos) que firme el crédito contigo como codeudor. Suma los ingresos de los dos y también <b class="m3e">resta las deudas de los dos</b>.</p>
                <div class="m6k"><div class="m6l"><span>Tu ingreso</span><span class="m6m">{{ Parejamiingreso }}</span></div><div class="m6l"><span>+ Ingreso del otro solicitante</span><span class="m6m">{{ Parejasuingreso }}</span></div><div class="m6l"><span>− Deudas de los dos</span><span class="m6m">{{ Parejadeudastotal }}</span></div><div class="m6l"><span>= Ingreso neto del hogar</span><span class="m6m">{{ Parejaneto }}</span></div><div class="m6l"><span>Cupo solo tú</span><span class="m6m">{{ Parejasolomillones }}</span></div><div class="m6n"><span>Cupo juntos</span><span class="m6o">{{ Parejajuntosmillones }}</span></div></div>
                <p class="m66"><b class="m3e">Para el subsidio</b>, la Caja mira el ingreso total del hogar. Si juntos pasan de 2 salarios mínimos el subsidio baja de 30 a 20 SMMLV, y si pasan de 4 ya no aplica. {{ Parejasubsidioayuda }}</p>
                <p class="m66"><b class="m3e">Requisitos usuales:</b> los dos deben demostrar sus ingresos, tener buen historial en centrales de riesgo y ninguno puede ser dueño de otra vivienda si van a usar subsidio. Los dos quedan responsables de pagar el crédito completo, y el plazo suele limitarlo la edad del mayor.</p>
                <p class="m66">Actívalo en Simular → Compra en pareja / familia y escribe el ingreso y las deudas del otro solicitante.</p>
              </div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternartrece }}">
                <span class="m6h">14</span>
                <span class="m6i">¿Cómo registro ingresos y egresos?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondotrece }};color:{{ Ayuda.Colortrece }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signotrece }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertotrece }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">Con el botón <b class="m3e">+</b> eliges <b class="m3e">Ingreso</b> o <b class="m3e">Egreso</b>, y si es <b class="m3e">del día</b> o <b class="m3e">fijo mensual</b>.</p><div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">Ingresos del día</b> (ventas, turnos, comisiones): suben tu promedio de {{ Promediomesesetiqueta }}. Un ingreso de $100.000 suma $100.000 ÷ {{ Promediomesesetiqueta }} a tu ingreso mensual.</span></div><div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">Ingresos fijos</b> (salario, pensión, arriendos): cuentan completos cada mes.</span></div><div class="m6y"><span class="m71"></span><span class="m70"><b class="m3e">Egresos fijos</b> (cuotas de deudas, arriendo): el banco los resta de tu ingreso y bajan tu cupo.</span></div><div class="m6y"><span class="m72"></span><span class="m70"><b class="m3e">Gastos del día</b> (transporte, comida): no cambian tu cupo, pero sí lo que te queda para ahorrar.</span></div><p class="m66">Si recibes en <b class="m3e">efectivo</b>, consígnalo y márcalo como consignado tocando el registro: así aparece en tus extractos.</p></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarcatorce }}">
                <span class="m6h">15</span>
                <span class="m6i">¿Cómo funciona apagar deudas?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondocatorce }};color:{{ Ayuda.Colorcatorce }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signocatorce }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertocatorce }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">Cada cuota que dejas de pagar libera capacidad: <b class="m3e">cuota × {{ Topeporcentaje }} × {{ Factorcorto }}</b> es lo que el banco te prestaría de más.</p><p class="m66">La app también te dice si tienes la cuota inicial para aprovechar ese crédito extra. Si pagas una deuda con tus ahorros, tu cuota inicial baja: la app te avisa cuánto.</p><p class="m66">Si tus deudas pasan del 25% de tu ingreso, te sugerimos una <b class="m3e">compra de cartera</b> para bajar tus cuotas.</p></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarquince }}">
                <span class="m6h">16</span>
                <span class="m6i">¿Cómo uso el plan de cuota inicial?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondoquince }};color:{{ Ayuda.Colorquince }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signoquince }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertoquince }}" hint-placeholder-val="{{ false }}"><div class="m6j"><div class="m6k"><div class="m6l"><span>Vivienda que buscas</span><span class="m6m">{{ Cierreobjetivotexto }}</span></div><div class="m6l"><span>− Crédito del banco</span><span class="m6m">{{ Cierrecreditotexto }}</span></div><div class="m6l"><span>+ Gastos de escrituración</span><span class="m6m">{{ Cierregastostexto }}</span></div><div class="m6l"><span>− Ahorro y subsidio</span><span class="m6m">{{ Cierretengotexto }}</span></div><div class="m6n"><span>= Te falta</span><span class="m6o">{{ Cierrefaltatexto }}</span></div></div><p class="m66">Elige si la quieres en 12, 24 o 36 meses y la app calcula cuánto ahorrar al mes. Si financias los gastos con el banco (Ley 2434), la meta mensual disminuye porque no requieres pagar escrituración de contado. Está en <b class="m3e">Plan → Cuota inicial</b>.</p></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternardieciseis }}">
                <span class="m6h">17</span>
                <span class="m6i">¿Qué muestra Mi Año?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondodieciseis }};color:{{ Ayuda.Colordieciseis }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signodieciseis }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertodieciseis }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">En <b class="m3e">Registros → Año</b> ves tus ingresos de 12 meses. Si tienes contrato laboral suma la <b class="m3e">prima</b> (un salario al año, en junio y diciembre), las <b class="m3e">cesantías</b> (un salario al año) y sus <b class="m3e">intereses</b> (12%).</p><p class="m66">Puedes decidir qué porcentaje de primas y cesantías va a tu cuota inicial y ver cuántos meses te adelantas.</p><p class="m66">Revisa si deberás <b class="m3e">declarar renta</b>: ingresos de 1.400 UVT ($73.323.600) o patrimonio de 4.500 UVT ($235.683.000). Además, si pagas impuesto (ingresos desde ~$6,9 M/mes) puedes <b class="m3e">deducir hasta 1.200 UVT ($62,8 M)</b> de intereses de tu vivienda (Art. 119 E.T.).</p></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternardiecisiete }}">
                <span class="m6h">18</span>
                <span class="m6i">¿Qué significan las etiquetas de Ofertas?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondodiecisiete }};color:{{ Ayuda.Colordiecisiete }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signodiecisiete }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertodiecisiete }}" hint-placeholder-val="{{ false }}"><div class="m6j"><div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">Puede ser MiTecho</b>: tu cupo y tu cuota inicial alcanzan hoy.</span></div><div class="m6y"><span class="m73"></span><span class="m70"><b class="m3e">Falta inicial</b>: el banco te lo prestaría, pero te falta cuota inicial.</span></div><div class="m6y"><span class="m72"></span><span class="m70"><b class="m3e">Faltan de cupo</b>: el precio supera lo que el banco te presta.</span></div><p class="m66">Primero ves los proyectos de tu ciudad; puedes agregar o quitar ciudades en el filtro. Con <b class="m3e">Me interesa</b> la constructora te contacta, solo si lo autorizas.</p></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternardieciocho }}">
                <span class="m6h">19</span>
                <span class="m6i">¿Pesos o UVR? ¿Qué entidad elijo?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondodieciocho }};color:{{ Ayuda.Colordieciocho }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signodieciocho }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertodieciocho }}" hint-placeholder-val="{{ false }}"><div class="m6j">
                <p class="m66">En <b class="m3e">pesos</b> la tasa y la cuota son fijas todo el crédito. En <b class="m3e">UVR</b> la cuota inicial arranca ~31% más baja pero sube mes a mes con la inflación (IPC).</p>
                <div class="m6k">
                  <div class="m6l"><span>Punto de equilibrio</span><span class="m6m">5,58% anual</span></div>
                  <div class="m6l"><span>Inflación Sep 2026</span><span class="m6m">6,29% anual</span></div>
                  <div class="m6l"><span>Si inflación &lt; 5,58%</span><span class="m6m">Más barato UVR</span></div>
                  <div class="m6n"><span>Si inflación &gt; 5,58%</span><span class="m6o">Más barato Pesos</span></div>
                </div>
                <p class="m66"><b class="m3e">UVR no es UVT:</b> La UVR (Unidad de Valor Real) ajusta créditos con el IPC. La UVT es la medida tributaria de la DIAN. MiTecho proyecta escenarios a 3,0%, 4,5% y 6,3%.</p>
                <p class="m66">Puedes comparar el <b class="m3e">promedio de bancos</b>, el <b class="m3e">Fondo Nacional del Ahorro</b> y la línea de <b class="m3e">tu Caja</b>. El comparador se desbloquea con un video corto o con MiTecho Pro.</p>
              </div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternardiecinueve }}">
                <span class="m6h">20</span>
                <span class="m6i">¿Para qué sirven los datos de mi Caja o del FNA?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondodiecinueve }};color:{{ Ayuda.Colordiecinueve }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signodiecinueve }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertodiecinueve }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">Son <b class="m3e">opcionales</b>. En tu perfil puedes escribir lo que te informe tu Caja o el FNA en cuatro secciones iguales: afiliación, ahorro en la entidad, subsidio y crédito preaprobado.</p><div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">Ahorros</b>: tus cesantías y ahorro programado se suman a la cuota inicial.</span></div><div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">Subsidio asignado</b>: usamos el valor real y te avisamos si está por vencer o ya venció.</span></div><div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">Tiempo mínimo</b>: te decimos si ya cumples los meses de afiliación que te piden.</span></div><div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">Crédito preaprobado</b>: el Simulador usa su monto, tasa y plazo reales.</span></div><p class="m66">Entre más datos llenes, más preciso es tu estimado.</p></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarveinte }}">
                <span class="m6h">21</span>
                <span class="m6i">¿Dónde se guardan mis datos y quién los ve?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondoveinte }};color:{{ Ayuda.Colorveinte }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signoveinte }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertoveinte }}" hint-placeholder-val="{{ false }}"><div class="m6j"><p class="m66">MiTecho es una app de <b class="m3e">cálculos teóricos</b>. Tu perfil financiero se guarda en tu cuenta para que la app funcione, y tus registros diarios se quedan solo <b class="m3e">en tu celular</b>.</p><p class="m66">Tus datos no se venden ni se comparten con terceros, y solo se usan para la app y para atender las solicitudes de soporte que nos envíes (Ley 1581 de 2012).</p><p class="m66"><b class="m3e">MiTecho Pro</b> ($6.500 al mes) suma la simulación en pareja o familia, el reporte PDF, las tasas por banco y quita los anuncios (mira la pregunta 23). Puedes borrar todos tus datos desde Perfil → Borrar mi cuenta.</p></div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarveintiuno }}">
                <span class="m6h">22</span>
                <span class="m6i">¿Cómo elijo el plazo (15, 20 o 30 años) y qué límites aplican?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondoveintiuno }};color:{{ Ayuda.Colorveintiuno }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signoveintiuno }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertoveintiuno }}" hint-placeholder-val="{{ false }}"><div class="m6j">
                <p class="m66">El plazo es el tiempo en años durante el cual pagarás tu crédito hipotecario. En MiTecho puedes simular a <b class="m3e">15, 20 o 30 años</b>:</p>
                <div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">20 años (Recomendado estándar)</b>: Es el punto de equilibrio más usado en Colombia. Ofrece una cuota mensual cómoda sin pagar intereses excesivos a largo plazo.</span></div>
                <div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">30 años (Mayor cupo)</b>: Reduce la cuota mensual para que el banco te apruebe el mayor valor posible de vivienda si tus ingresos son justos, aunque pagas más intereses acumulados.</span></div>
                <div class="m6y"><span class="m6z"></span><span class="m70"><b class="m3e">15 años (Menor costo total)</b>: Ahorras millones en intereses y terminas antes, pero la cuota mensual es más alta y exige mayores ingresos.</span></div>
                <p class="m66"><b class="m3e">Límites y reglas bancarias obligatorias:</b></p>
                <div class="m6k">
                  <div class="m6l"><span>Regla de edad (Seguro de vida)</span><span class="m6m">Edad + Plazo ≤ 75 años</span></div>
                  <div class="m6l"><span>Cajas de Compensación</span><span class="m6m">Máximo 20 años</span></div>
                  <div class="m6l"><span>Bancos y FNA</span><span class="m6m">Hasta 30 años</span></div>
                  <div class="m6n"><span>Tu plazo evaluado</span><span class="m6o">{{ Plazotexto }}</span></div>
                </div>
                <p class="m66">Por ley y políticas de aseguradoras, si tienes más de 45 años el banco ajustará automáticamente el plazo para que no supere los 75 años. Si compras en pareja, el límite se rige por la edad del solicitante mayor.</p>
              </div></sc-if>
            </div>
            <div class="m6f">
              <button class="m6g" al-clic="{{ Ayuda.Alternarveintidos }}">
                <span class="m6h">23</span>
                <span class="m6i">¿Qué incluye la versión gratis y qué suma MiTecho Pro?</span>
                <span style="width:30px;height:30px;border-radius:15px;background:{{ Ayuda.Fondoveintidos }};color:{{ Ayuda.Colorveintidos }};display:flex;align-items:center;justify-content:center;font:600 16px 'Familjen Grotesk',sans-serif;flex:none;transition:background .15s ease-out">{{ Ayuda.Signoveintidos }}</span>
              </button>
              <sc-if value="{{ Ayuda.Abiertoveintidos }}" hint-placeholder-val="{{ false }}"><div class="m6j">
                <p class="m66">Con la versión gratis tienes todos los cálculos. <b class="m3e">MiTecho Pro</b> suma funciones para comprar acompañado, llevar tus cifras al banco y comparar entidades, sin anuncios.</p>
                <div class="m6k">
                  <div class="m6l"><span>Techo, crédito, cuota y cierre financiero</span><span class="m6m">Gratis</span></div>
                  <div class="m6l"><span>Simulador VIS, No VIS y leasing, en pesos o UVR</span><span class="m6m">Gratis</span></div>
                  <div class="m6l"><span>Registros, plan de cuota inicial y ofertas</span><span class="m6m">Gratis</span></div>
                  <div class="m6l"><span>Gastos de escrituración</span><span class="m6m">Gratis</span></div>
                  <div class="m6l"><span>Comparador bancos, FNA y Caja</span><span class="m6m">Gratis con un video</span></div>
                  <div class="m6l"><span>Simulación en pareja o familia</span><span class="m6m">Solo Pro</span></div>
                  <div class="m6l"><span>Reporte PDF de tu simulación</span><span class="m6m">Solo Pro</span></div>
                  <div class="m6l"><span>Tasas por banco (Superintendencia)</span><span class="m6m">Solo Pro</span></div>
                  <div class="m6n"><span>Anuncios</span><span class="m6o">Pro sin anuncios</span></div>
                </div>
                <p class="m66"><b class="m3e">$6.500 al mes</b>, con cobro recurrente en Google Play. Lo cancelas cuando quieras desde Google Play; borrar tu cuenta en MiTecho no cancela la suscripción.</p>
                <button al-clic="{{ Abrirprodesdeayuda }}" style="margin-top:4px;width:100%;height:44px;border-radius:22px;background:#FFD23F;color:#0B0C0A;border:none;font:700 14px 'Familjen Grotesk',sans-serif;cursor:pointer">Conocer MiTecho Pro</button>
              </div></sc-if>
            </div>
            <div class="m6f"></div>
          </div>
          <div style="margin:18px 0 6px;padding:18px;border-radius:24px;background:var(--cd);border:1px solid var(--ln);display:flex;flex-direction:column;gap:12px">
            <div style="display:flex;flex-direction:column;gap:4px">
              <span class="m4z">SOPORTE Y ATENCIÓN · MITECHO</span>
              <span style="font:600 18px/1.15 'Familjen Grotesk',sans-serif;color:var(--ik)">¿Necesitas ayuda o quieres reportar un problema?</span>
              <p class="m66" style="margin:2px 0 0">Si tienes dudas con tu cuenta, tus cálculos o encontraste algún inconveniente en la app, escríbenos y te responderemos a la brevedad.</p>
            </div>
            <button al-clic="{{ Contactarsoporteayuda }}" style="width:100%;height:50px;border-radius:25px;background:var(--ac);color:var(--oa);border:none;font:700 14.5px 'Familjen Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              <span>Pedir ayuda o reportar un problema</span>
            </button>
            <span style="font:500 11.5px 'IBM Plex Mono',monospace;color:var(--mu);text-align:center">rumoriastudio@gmail.com</span>
          </div>
          <div class="m74">MiTecho Colombia calcula tu capacidad financiera conforme a la Ley 546 de 1999 y normatividad vigente 2026. La aprobación definitiva depende del estudio de crédito de la entidad otorgante.</div>
        </div>
      </sc-if>
`;

