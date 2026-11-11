// Plantilla de las pantallas de inicio, simulador de crédito y barra inferior de pestañas

const Plantillaprincipal = `
<sc-if value="{{ Pestanaes.inicio }}" hint-placeholder-val="{{ true }}">
          <div class="m7g" data-tutorial="techo">
            <div class="m7h"><span class="m30">Hola, {{ Primernombre }}. Según tus ingresos, tu techo vale</span><button class="m7i" al-clic="{{ Abrirayudacifra }}" aria-label="Qué significa esta cifra"><span class="m7j">?</span>Entender</button></div>
            <div class="m7k"><span class="m7l">$</span><span class="m7m">{{ Preciodestacado }}</span></div>
            <div class="m7n"><span class="m7o">millones</span><span class="m7p">{{ Ingresobase }}</span></div>
            <div class="m7q">
              <div class="m7r">
                <div style="width:{{ Financiacionancho }};background:var(--ac);border-radius:7px;transition:width .5s cubic-bezier(.22,1,.36,1)"></div>
                <sc-if value="{{ Tienesubsidio }}" hint-placeholder-val="{{ false }}"><div style="width:{{ Subsidioancho }};background:#FFD23F;border-radius:7px;transition:width .5s cubic-bezier(.22,1,.36,1)"></div></sc-if>
                <div class="m36"></div>
              </div>
              <div class="m37">
                <div class="m38"><span class="m39">BANCO PRESTA {{ Porcentajefinanciado }}</span><span class="m3a">{{ Creditomillones }}</span></div>
                <div class="m3b"><span class="m39">TÚ PONES {{ Propioporcentaje }}</span><span class="m3a">{{ Propiomillones }}</span></div>
              </div>
              <sc-if value="{{ Tienesubsidio }}" hint-placeholder-val="{{ false }}"><div class="m7s"><span class="m3d"></span>Subsidio {{ Subsidioetiqueta }}: <b class="m3e">{{ Subsidiomillones }}</b></div></sc-if>
              <sc-if value="{{ Techotopevisvisible }}" hint-placeholder-val="{{ false }}"><div class="mbf" style="margin-top:10px">{{ Techotopevismensaje }}</div></sc-if>
            </div>
          </div>
          <button class="m7t" al-clic="{{ Irresultado }}" data-tutorial="cuotainicial">
            <div class="m7u"><span class="m2c">{{ Cuotainicialtituloplan }}</span><span class="m7v">{{ Cuotainicialproporcion }}</span></div>
            <div class="m7w"><div style="position:absolute;left:0;top:0;bottom:0;width:{{ Cuotainicialbarraancho }};min-width:96px;background:var(--ac);border-radius:22px;display:flex;align-items:center;justify-content:flex-end;padding-right:4px;box-sizing:border-box;transition:width .6s cubic-bezier(.22,1,.36,1)"><div class="m7x"><div class="m7y"></div><div class="m7y"></div><div class="m7y"></div></div></div><span class="m7z">{{ Cuotainicialporcentaje }}</span></div>
            <div class="m2f">{{ Cuotainicialmeses }}</div>
            <sc-if value="{{ Limiteahorro }}" hint-placeholder-val="{{ true }}"><div class="m80"><span class="m81">Con lo que tienes hoy cierras hasta</span><span class="m82">{{ Preciohoymillones }}</span></div></sc-if>
          </button>
          <div class="m83">
            <div class="m84">
              <span class="m85">RACHA</span>
              <div class="m86"><sc-for list="{{ Racha }}" as="Diaracha" hint-placeholder-count="14"><div style="aspect-ratio:1;border-radius:3px;background:{{ Diaracha.Fondo }}"></div></sc-for></div>
              <span class="m3a">{{ Rachaetiqueta }}</span>
            </div>
            <button class="m87" al-clic="{{ Iringresos }}">
              <span class="m85">META DE HOY</span>
              <span class="m88">{{ Metatexto }}</span>
              <div class="m89"><div style="width:{{ Metaancho }};max-width:100%;height:100%;border-radius:3px;background:var(--ik);transition:width .6s ease-out"></div></div>
            </button>
          </div>
          <sc-if value="{{ Tieneefectivo }}" hint-placeholder-val="{{ true }}">
            <button class="m8a" al-clic="{{ Iringresos }}"><span class="m8b">{{ Efectivomensaje }}</span><span class="m8c">VER</span></button>
          </sc-if>
          <sc-if value="{{ Mostrarafiliacion }}" hint-placeholder-val="{{ false }}"><button class="m8d" al-clic="{{ Irperfil }}"><span class="m8e">{{ Afiliacioncorto }}</span><span class="m8f">VER</span></button></sc-if>
          <button class="m8g" al-clic="{{ Irsimulador }}"><span class="m8h">Por cada <b class="m3e">$100.000</b> más de ingreso, tu vivienda sube <b class="m6o">{{ Sensibilidadmillones }}</b></span><span class="m8i">→</span></button>
          <sc-if value="{{ Tasasdisponibles }}" hint-placeholder-val="{{ false }}"><button class="m8g" al-clic="{{ Abrirtasas }}" data-tutorial="tasas"><span class="m8h">Compara tu cuota en <b class="m3e">{{ Tasasentidadescantidad }} entidades financieras</b> con datos de la Superintendencia Financiera</span><span class="m8i">{{ Tasasinicioicono }}</span></button></sc-if>
        </sc-if>
`
+ Plantillaingresosplan
+ `
        <sc-if value="{{ Pestanaes.simForm }}" hint-placeholder-val="{{ false }}">
          <div class="maz"><h1 class="m8l">Simulador</h1></div>
          <div class="mb0">
            <div class="m1j"><span class="m2c">Ingreso mensual</span><span class="m85">{{ Ingresofuenteetiqueta }}</span></div>
            <div class="m1t"><span class="m1u">$</span><span class="mae">{{ Ingresoformato }}</span></div>
            <div class="mb1">
              <div class="mb2"></div>
              <div style="position:absolute;left:0;top:0;bottom:0;width:{{ Ingresodeslizadorancho }};min-width:44px;border-radius:22px;background:var(--ac);display:flex;align-items:center;justify-content:flex-end;padding-right:4px;box-sizing:border-box"><div class="m7x"><div class="m7y"></div><div class="m7y"></div><div class="m7y"></div></div></div>
              <input class="mb3" type="range" min="1500000" max="15000000" step="50000" value="{{ Ingresovalor }}" al-cambiar="{{ Cambiaringreso }}" aria-label="Ingreso mensual">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px" role="group" aria-label="De dónde sale el ingreso"><sc-for list="{{ Ingresofuentes }}" as="Fuente" hint-placeholder-count="2"><button type="button" al-clic="{{ Fuente.Alclic }}" aria-pressed="{{ Fuente.Activa }}" style="min-height:48px;padding:6px 12px;border-radius:18px;border:1px solid {{ Fuente.Borde }};background:{{ Fuente.Fondo }};color:{{ Fuente.Color }};font:600 12.5px/1.25 'Familjen Grotesk',sans-serif;text-align:center;cursor:pointer">{{ Fuente.Etiqueta }}</button></sc-for></div>
          </div>
          <div class="mb4">
            <div class="m1j"><span class="m2c">Deudas totales mensuales</span><span class="m46">{{ Deudastexto }}</span></div>
            <div class="mb5">
              <sc-for list="{{ Deudafichas }}" as="Deudaficha" hint-placeholder-count="3"><button al-clic="{{ Deudaficha.Alclic }}" style="height:36px;padding:0 12px;border-radius:18px;border:1px solid {{ Deudaficha.Borde }};background:{{ Deudaficha.Fondo }};color:{{ Deudaficha.Color }};font:600 12px 'Hanken Grotesk',sans-serif;text-decoration:{{ Deudaficha.Decoracion }};white-space:nowrap">{{ Deudaficha.Etiqueta }}</button></sc-for>
            </div>
            <div class="mb6"><span class="m4k">Toca una deuda para quitarla del cálculo.</span><button class="mb7" al-clic="{{ Abrirhojadeuda }}">+ Agregar deuda</button></div>
          </div>
          <button class="mb8" al-clic="{{ Alternarpareja }}">
            <div class="m2a"><span class="m2c">Compra en pareja / familia</span><span class="m4k">{{ Parejasubtitulo }}</span></div>
            <div style="width:54px;height:32px;border-radius:16px;background:{{ Parejariel }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ Parejaperilla }};transform:{{ Parejaposicion }};transition:transform .18s ease-out"></div></div>
          </button>
          <sc-if value="{{ Parejaactiva }}" hint-placeholder-val="{{ false }}"><div class="mb9">
            <div class="m7h"><span class="m2c">Segundo solicitante</span><button class="mba" al-clic="{{ Abrirayudapareja }}" aria-label="Cómo funciona comprar en pareja"><span class="m7j">?</span>Entender</button></div>
            <span class="m4k">Antes de escribir los ingresos y deudas de otra persona, pídele su autorización (Ley 1581 de 2012).</span>
            <label class="mbc"><span class="m42">NOMBRE COMPLETO (OPCIONAL)</span><input class="m52" maxlength="70" value="{{ Parejanombrecampo }}" al-escribir="{{ Escribirparejanombre }}" placeholder="Ej: Diana Pérez" aria-label="NOMBRE DEL SEGUNDO SOLICITANTE (OPCIONAL)"></label>
            <div class="mbb"><label class="mbc"><span class="m42">SU INGRESO MENSUAL</span><input class="m52" value="{{ Parejaingresotexto }}" al-escribir="{{ Escribirparejaingreso }}" inputMode="numeric" placeholder="$0" aria-label="SU INGRESO MENSUAL"></label><label class="mbc"><span class="m42">SUS DEUDAS MENSUALES</span><input class="m52" value="{{ Parejadeudastexto }}" al-escribir="{{ Escribirparejadeudas }}" inputMode="numeric" placeholder="$0" aria-label="SUS DEUDAS MENSUALES"></label></div>
            <div class="mbb"><label class="mbc"><span class="m42">SU AHORRO Y CESANTÍAS</span><input class="m52" value="{{ Parejaahorrotexto }}" al-escribir="{{ Escribirparejaahorro }}" inputMode="numeric" placeholder="$0" aria-label="SU AHORRO Y CESANTÍAS"></label><label class="mbc"><span class="m42">SU ACTIVIDAD</span><input class="m52" maxlength="60" value="{{ Parejaactividadcampo }}" al-escribir="{{ Escribirparejaactividad }}" placeholder="Ej: Empleada" aria-label="SU ACTIVIDAD"></label></div>
            <div class="mav"><span>Solo tú: {{ Parejasolomillones }}</span><span class="m6o">Juntos: {{ Parejajuntosmillones }}</span></div>
            <sc-if value="{{ Parejasubsidioaviso }}" hint-placeholder-val="{{ false }}"><span class="mbd">{{ Parejasubsidiomensaje }}</span></sc-if>
          </div></sc-if>
          <div class="mbe">Modalidad</div>
          <div class="m56" data-tutorial="modalidad">
            <sc-for list="{{ Modalidadopciones }}" as="Modalidadopcion" hint-placeholder-count="3"><button al-clic="{{ Modalidadopcion.Alclic }}" style="padding:14px 12px;border-radius:20px;border:1px solid {{ Modalidadopcion.Borde }};background:{{ Modalidadopcion.Fondo }};text-align:left;display:flex;flex-direction:column;gap:6px;transition:background .15s ease-out"><span style="font:600 14px 'Familjen Grotesk',sans-serif;color:{{ Modalidadopcion.Color }}">{{ Modalidadopcion.Etiqueta }}</span><span style="font:500 11px 'IBM Plex Mono',monospace;color:{{ Modalidadopcion.Subtexto }}">{{ Modalidadopcion.Descripcioncorta }}</span></button></sc-for>
          </div>
          <sc-if value="{{ Visaviso }}" hint-placeholder-val="{{ false }}"><div class="mbf">{{ Visavisomensaje }}</div></sc-if>
          <div class="mar"><div class="m7h"><span class="m2c">Condiciones del banco</span><button class="mba" al-clic="{{ Abrirayudacondiciones }}" aria-label="Qué son las condiciones del banco"><span class="m7j">?</span>Entender</button></div>
            <sc-if value="{{ Mostrarpromedio }}" hint-placeholder-val="{{ true }}"><div class="m50"><span class="m42">PROMEDIO DE INGRESOS VARIABLES</span><div class="m1w"><sc-for list="{{ Promedioopciones }}" as="Opcion" hint-placeholder-count="3"><button al-clic="{{ Opcion.Alclic }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ Opcion.Borde }};background:{{ Opcion.Fondo }};color:{{ Opcion.Color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ Opcion.Etiqueta }}</button></sc-for></div></div></sc-if>
            <sc-if value="{{ Mostrarflexible }}" hint-placeholder-val="{{ true }}"><div class="m50" data-tutorial="tope"><span class="m42">CUOTA MÁXIMA SOBRE TU INGRESO</span><div class="m1w"><sc-for list="{{ Flexibleopciones }}" as="Opcion" hint-placeholder-count="3"><button al-clic="{{ Opcion.Alclic }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ Opcion.Borde }};background:{{ Opcion.Fondo }};color:{{ Opcion.Color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ Opcion.Etiqueta }}</button></sc-for></div><span class="m2f">La norma permite que la cuota llegue al 40% de tu ingreso en VIS y No VIS. Algunos bancos aplican 30%: elige el modo conservador para ver ese escenario.</span></div></sc-if>
            <sc-if value="{{ Esleasing }}" hint-placeholder-val="{{ false }}"><div class="m50"><span class="m42">OPCIÓN DE COMPRA AL FINAL</span><div class="m1w"><sc-for list="{{ Opcioncompraopciones }}" as="Opcion" hint-placeholder-count="3"><button al-clic="{{ Opcion.Alclic }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ Opcion.Borde }};background:{{ Opcion.Fondo }};color:{{ Opcion.Color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ Opcion.Etiqueta }}</button></sc-for></div><span class="m2f">Entre más alta, menor el canon mensual y mayor el pago final ({{ Opcioncompratexto }}).</span></div></sc-if>
            <div class="m50"><div class="m7h"><span class="m42">PLAZO DEL CRÉDITO</span><button class="mba" al-clic="{{ Abrirayudaplazo }}" aria-label="Cómo elegir el plazo del crédito"><span class="m7j">?</span>Entender</button></div><div class="mbv"><sc-for list="{{ Plazoopciones }}" as="Opciontipo" hint-placeholder-count="3"><button al-clic="{{ Opciontipo.Alclic }}" style="height:38px;border-radius:19px;border:1px solid {{ Opciontipo.Borde }};background:{{ Opciontipo.Fondo }};color:{{ Opciontipo.Color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ Opciontipo.Etiqueta }}</button></sc-for></div><span class="m2f">{{ Plazorecomendadonota }}</span></div>
            <sc-if value="{{ Esvip }}" hint-placeholder-val="{{ false }}"><span class="mat">Con este precio tu vivienda sería VIP (hasta 90 SMMLV = {{ Topeviptexto }}).</span></sc-if></div>
          <sc-if value="{{ Simuladorsubsidiovisible }}" hint-placeholder-val="{{ false }}"><div class="mbg"><span style="width:10px;height:10px;border-radius:3px;background:{{ Simuladorsubsidiopunto }};flex:none;margin-top:4px"></span><span class="mbh">{{ Simuladorsubsidiomensaje }}</span></div></sc-if>
          <div class="mbi">
            <div class="mbj"><span class="m3w">VIVIENDA HASTA</span><span class="mbk">\${{ Preciodestacado }} M</span></div>
            <button class="mbl" al-clic="{{ Irresultado }}">Ver resultado →</button>
          </div>
        </sc-if>
  
        <sc-if value="{{ Pestanaes.simResult }}" hint-placeholder-val="{{ false }}">
          <div class="m3m"><button class="m3n" al-clic="{{ Irsimulador }}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>Ajustar</button></div>
          <div class="mbm">
            <span class="m8t">Precio máximo de la propiedad</span>
            <div class="m31"><span class="mbn">$</span><span class="mbo">{{ Preciodestacado }}</span><span class="mbp">M</span></div>
          </div>
          <div class="mbq">
            <div class="m6p"><span>INGRESO − DEUDAS</span><span class="m6m">{{ Netotexto }}</span></div>
            <div class="m6p"><span>{{ Topeetiqueta }}</span><span class="m6m">{{ Capacidadcuotatexto }}</span></div>
            <div class="m6p"><span>{{ Factoretiqueta }}</span><span class="m6m">{{ Creditocadenatexto }}</span></div>
            <sc-if value="{{ Vistopadafila }}" hint-placeholder-val="{{ false }}"><div class="m6p"><span>{{ Financiacionetiqueta }}</span><span class="m6m">{{ Preciosintopetexto }}</span></div></sc-if>
            <div class="mbr"><span>{{ Financiacionetiquetaultima }}</span><span class="mbs">{{ Preciotexto }}</span></div>
          </div>
          <sc-if value="{{ Visaviso }}" hint-placeholder-val="{{ false }}"><div class="mbf" style="margin:0 0 12px">{{ Visavisomensaje }}</div></sc-if>
          <div class="mbt">
            <div class="m1j"><span class="m2c">Crédito que prestaría el banco</span></div>
            <span class="mbu">{{ Creditotexto }}</span>
            <div class="m8m">
              <sc-for list="{{ Tasaopciones }}" as="Filatabla" hint-placeholder-count="2"><button al-clic="{{ Filatabla.Alclic }}" style="height:38px;border-radius:19px;border:1px solid {{ Filatabla.Borde }};background:{{ Filatabla.Fondo }};color:{{ Filatabla.Color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ Filatabla.Etiqueta }}</button></sc-for>
            </div>
            <div class="m7h" style="margin-top:2px"><span class="m42" style="margin:0">PLAZO DEL CRÉDITO</span><button class="mba" al-clic="{{ Abrirayudaplazo }}" aria-label="Cómo elegir el plazo del crédito"><span class="m7j">?</span>Entender</button></div>
            <div class="mbv">
              <sc-for list="{{ Plazoopciones }}" as="Opciontipo" hint-placeholder-count="3"><button al-clic="{{ Opciontipo.Alclic }}" style="height:38px;border-radius:19px;border:1px solid {{ Opciontipo.Borde }};background:{{ Opciontipo.Fondo }};color:{{ Opciontipo.Color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ Opciontipo.Etiqueta }}</button></sc-for>
            </div>
            <span class="m2f">{{ Plazorecomendadonota }}</span>
            <div class="m1w"><sc-for list="{{ Entidadopciones }}" as="Opcion" hint-placeholder-count="3"><button al-clic="{{ Opcion.Alclic }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ Opcion.Borde }};background:{{ Opcion.Fondo }};color:{{ Opcion.Color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ Opcion.Etiqueta }}</button></sc-for></div>
            <span class="m2f">{{ Tasanota }}</span>
            <sc-if value="{{ Esuvr }}" hint-placeholder-val="{{ false }}"><div class="maq"><sc-for list="{{ Uvrfilas }}" as="Usofila" hint-placeholder-count="3"><span>{{ Usofila.Etiqueta }}</span><span class="m9i">{{ Usofila.value }}</span></sc-for></div><span class="m2f">Punto de equilibrio: <b>{{ Puntoequilibriouvr }}</b>. Si la inflación promedio de los 20 años es menor a 5,58% ganas con UVR; si supera 5,58%, Pesos fijos te ahorra dinero.</span></sc-if>
            <div class="mbw"><span class="m3t">{{ Cuotaetiqueta }}</span><span class="mbx">{{ Cuotamensual }}</span></div>
            <sc-if value="{{ Bloqueado }}" hint-placeholder-val="{{ true }}">
              <div class="mby">
                <span class="mbz">Compara Pesos vs. UVR, plazos y entidades.</span>
                <button class="mc0" al-clic="{{ Desbloquear }}">{{ Desbloquearetiqueta }}</button>
              </div>
            </sc-if>
          </div>
          <div class="mc1">
            <div class="m62"><span class="m2c">Cierre financiero</span><span class="m4k">Precio y escrituración, menos crédito, subsidio y ahorro</span></div>
            <div class="maq">
              <span>Precio de la vivienda</span><span class="m9i">{{ Preciotexto }}</span>
              <span>{{ Gastosetiquetacierre }}</span><span class="m9i">{{ Gastostexto }}</span>
              <span>− Crédito del banco</span><span class="m9i">{{ Creditousadotexto }}</span>
              <sc-if value="{{ Tienesubsidiocaja }}"><span>− Subsidio Caja ({{ Subsidiocajasalarios }} SMMLV)</span><span class="m9i">{{ Subsidiocajatexto }}</span></sc-if>
              <sc-if value="{{ Tienesubsidiomicasaya }}"><span>− Mi Casa Ya ({{ Subsidiomicasayasalariostexto }} SMMLV)</span><span class="m9i">{{ Subsidiomicasayatexto }}</span><span class="m2f" style="grid-column:1/-1;margin-top:-2px">Mi Casa Ya aplica principalmente a vivienda nueva; confírmalo con la entidad.</span></sc-if>
              <span>− Tu ahorro y cesantías</span><span class="m9i">{{ Ahorrotexto }}</span>
              <span class="m9j">{{ Faltaetiqueta }}</span><span style="color:{{ Faltacolor }};font-weight:700;text-align:right;border-top:1px solid var(--ln);padding-top:8px">{{ Faltatexto }}</span>
              <sc-if value="{{ Esleasing }}" hint-placeholder-val="{{ false }}"><span>Opción de compra al final ({{ Opcioncompraporcentaje }})</span><span class="m9i">{{ Opcioncompratexto }}</span></sc-if>
            </div>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--ln)"><button class="mb8" al-clic="{{ Alternarfinanciargastos }}" style="width:100%;padding:4px 0;background:transparent;border:none"><div class="m2a"><span class="m2c" style="font-size:12px">Financiar escrituración en el crédito</span><span class="m4k" style="font-size:11px">Ley 2434 de 2024 · Cuota inicial cubre solo la vivienda</span></div><div style="width:40px;height:24px;border-radius:12px;background:{{ Financiargastosriel }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:10px;background:{{ Financiargastosperilla }};transform:{{ Financiargastosposicion }};transition:transform .18s ease-out"></div></div></button></div>
            <sc-if value="{{ Limiteahorro }}" hint-placeholder-val="{{ true }}"><div class="mc2"><span class="mc3">Con lo que tienes hoy cierras hasta</span><span class="mc4">{{ Preciohoymillones }}</span></div></sc-if>
          </div>
          <div class="max"><span class="may">i</span><span>Valores proyectados según políticas de riesgo de la Superintendencia Financiera. La aprobación definitiva depende del estudio del banco.</span></div>
          <div class="mc5">
            <button class="mc6" al-clic="{{ Irplan }}">Liberar cupo apagando deudas</button>
            <button class="mc7" al-clic="{{ Descargarpdf }}">PDF</button>
          </div>
        </sc-if>
      </div>
    </sc-if>

      <sc-if value="{{ Mostrarbarra }}" hint-placeholder-val="{{ true }}">
        <nav class="mdu" aria-label="Navegación principal" data-tutorial="barra">
          <button al-clic="{{ Pestanair.inicio }}" aria-label="Inicio" style="height:48px;padding:0 12px;border-radius:24px;background:{{ Pestanafondo.inicio }};color:{{ Pestanatexto.inicio }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z"></path></svg><sc-if value="{{ Pestanaes.inicio }}"><span class="mdv">Inicio</span></sc-if></button>
          <button al-clic="{{ Pestanair.ingresos }}" aria-label="Registros" style="height:48px;padding:0 12px;border-radius:24px;background:{{ Pestanafondo.ingresos }};color:{{ Pestanatexto.ingresos }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"></path></svg><sc-if value="{{ Pestanaes.ingresos }}"><span class="mdv">Registros</span></sc-if></button>
          <button al-clic="{{ Pestanair.simulador }}" aria-label="Simulador" style="height:48px;padding:0 12px;border-radius:24px;background:{{ Pestanafondo.simulador }};color:{{ Pestanatexto.simulador }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><path d="M8 6h8M8 10h8M8 14h4"></path></svg><sc-if value="{{ Pestanaes.simulador }}"><span class="mdv">Simular</span></sc-if></button>
          <button al-clic="{{ Pestanair.plan }}" aria-label="Plan" style="height:48px;padding:0 12px;border-radius:24px;background:{{ Pestanafondo.plan }};color:{{ Pestanatexto.plan }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 3"></path></svg><sc-if value="{{ Pestanaes.plan }}"><span class="mdv">Plan</span></sc-if></button>
          <button al-clic="{{ Pestanair.ofertas }}" aria-label="Ofertas" style="height:48px;padding:0 12px;border-radius:24px;background:{{ Pestanafondo.ofertas }};color:{{ Pestanatexto.ofertas }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"></path><circle cx="8" cy="8" r="1.5"></circle></svg><sc-if value="{{ Pestanaes.ofertas }}"><span class="mdv">Ofertas</span></sc-if></button>
          <button class="mdw" al-clic="{{ Abrirhoja }}" aria-label="Registrar ingreso" data-tutorial="registrar"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"></path></svg></button>
        </nav>
      </sc-if>
  
      <sc-if value="{{ Tienehoja }}" hint-placeholder-val="{{ false }}">
        <div al-clic="{{ Cerrarhoja }}" style="position:absolute;inset:0;background:rgba(0,0,0,.55);opacity:{{ Hojaopacidad }};pointer-events:{{ Hojaeventos }};transition:opacity .2s ease-out;z-index:50"></div>
        <div class="mt-sheet" style="position:absolute;left:0;right:0;bottom:0;background:var(--cd);border-radius:32px 32px 0 0;border-top:1px solid var(--ln);padding:10px 18px 30px;transform:{{ Hojadesplazamiento }};transition:transform .32s cubic-bezier(.22,1,.36,1);z-index:51;display:{{ Hojavisible }};flex-direction:column;gap:14px">
          <div class="mdx"></div>
          <div class="m8k"><span class="m4z">{{ Hojaantetitulo }}</span><button class="m55" al-clic="{{ Cerrarhoja }}">Cerrar</button></div>
`;
