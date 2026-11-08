// Plantilla de las pantallas de inicio, simulador de crédito y barra inferior de pestañas

const Plantillaprincipal = `
<sc-if value="{{ tabIs.inicio }}" hint-placeholder-val="{{ true }}">
          <div class="m7g">
            <div class="m7h"><span class="m30">Hola, {{ firstName }}. Hoy tu techo vale</span><button class="m7i" onClick="{{ openHelp }}" aria-label="Qué significa esta cifra"><span class="m7j">?</span>Entender</button></div>
            <div class="m7k"><span class="m7l">$</span><span class="m7m">{{ heroPrice }}</span></div>
            <div class="m7n"><span class="m7o">millones</span><span class="m7p">{{ deltaMes }} este mes</span></div>
            <div class="m7q">
              <div class="m7r">
                <div style="width:{{ finW }};background:var(--ac);border-radius:7px;transition:width .5s cubic-bezier(.22,1,.36,1)"></div>
                <sc-if value="{{ hasSub }}" hint-placeholder-val="{{ false }}"><div style="width:{{ subW }};background:#FFD23F;border-radius:7px;transition:width .5s cubic-bezier(.22,1,.36,1)"></div></sc-if>
                <div class="m36"></div>
              </div>
              <div class="m37">
                <div class="m38"><span class="m39">BANCO PRESTA {{ finPct }}</span><span class="m3a">{{ creditoM }}</span></div>
                <div class="m3b"><span class="m39">TÚ PONES {{ ownPct }}</span><span class="m3a">{{ ownM }}</span></div>
              </div>
              <sc-if value="{{ hasSub }}" hint-placeholder-val="{{ false }}"><div class="m7s"><span class="m3d"></span>Subsidio {{ subLabel }}: <b class="m3e">{{ subM }}</b></div></sc-if>
            </div>
          </div>
          <button class="m7t" onClick="{{ goSimResult }}">
            <div class="m7u"><span class="m2c">{{ ciTitle }}</span><span class="m7v">{{ ciRatio }}</span></div>
            <div class="m7w"><div style="position:absolute;left:0;top:0;bottom:0;width:{{ ciBarW }};min-width:96px;background:var(--ac);border-radius:22px;display:flex;align-items:center;justify-content:flex-end;padding-right:4px;box-sizing:border-box;transition:width .6s cubic-bezier(.22,1,.36,1)"><div class="m7x"><div class="m7y"></div><div class="m7y"></div><div class="m7y"></div></div></div><span class="m7z">{{ ciPct }}</span></div>
            <div class="m2f">{{ ciMonths }}</div>
            <sc-if value="{{ limitAhorro }}" hint-placeholder-val="{{ true }}"><div class="m80"><span class="m81">Con lo que tienes hoy cierras hasta</span><span class="m82">{{ precioHoyM }}</span></div></sc-if>
          </button>
          <div class="m83">
            <div class="m84">
              <span class="m85">RACHA</span>
              <div class="m86"><sc-for list="{{ streak }}" as="s" hint-placeholder-count="14"><div style="aspect-ratio:1;border-radius:3px;background:{{ s.bg }}"></div></sc-for></div>
              <span class="m3a">{{ streakLabel }}</span>
            </div>
            <button class="m87" onClick="{{ goIngresos }}">
              <span class="m85">META DE HOY</span>
              <span class="m88">{{ metaFmt }}</span>
              <div class="m89"><div style="width:{{ metaW }};max-width:100%;height:100%;border-radius:3px;background:var(--ik);transition:width .6s ease-out"></div></div>
            </button>
          </div>
          <sc-if value="{{ hasCash }}" hint-placeholder-val="{{ true }}">
            <button class="m8a" onClick="{{ goIngresos }}"><span class="m8b">{{ cashMsg }}</span><span class="m8c">VER</span></button>
          </sc-if>
          <sc-if value="{{ showAfil }}" hint-placeholder-val="{{ false }}"><button class="m8d" onClick="{{ goPerfil }}"><span class="m8e">{{ afilShort }}</span><span class="m8f">VER</span></button></sc-if>
          <button class="m8g" onClick="{{ goSim }}"><span class="m8h">Por cada <b class="m3e">$100.000</b> más de ingreso, tu vivienda sube <b class="m6o">{{ sensM }}</b></span><span class="m8i">→</span></button>
        </sc-if>
`
+ Plantillaingresosplan
+ `
        <sc-if value="{{ tabIs.simForm }}" hint-placeholder-val="{{ false }}">
          <div class="maz"><h1 class="m8l">Simulador</h1></div>
          <div class="mb0">
            <div class="m1j"><span class="m2c">Ingreso mensual</span><span class="m85">{{ ingSourceLabel }}</span></div>
            <div class="m1t"><span class="m1u">$</span><span class="mae">{{ ingresoFmt }}</span></div>
            <div class="mb1">
              <div class="mb2"></div>
              <div style="position:absolute;left:0;top:0;bottom:0;width:{{ ingSliderW }};min-width:44px;border-radius:22px;background:var(--ac);display:flex;align-items:center;justify-content:flex-end;padding-right:4px;box-sizing:border-box"><div class="m7x"><div class="m7y"></div><div class="m7y"></div><div class="m7y"></div></div></div>
              <input class="mb3" type="range" min="1500000" max="15000000" step="50000" value="{{ ingresoVal }}" onChange="{{ onIngreso }}" aria-label="Ingreso mensual">
            </div>
            <button onClick="{{ useAuto }}" style="height:44px;border-radius:22px;border:1px solid {{ autoBorder }};background:{{ autoBg }};color:{{ autoColor }};font:600 13px 'Familjen Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px">{{ autoLabel }}</button>
          </div>
          <div class="mb4">
            <div class="m1j"><span class="m2c">Deudas totales mensuales</span><span class="m46">{{ deudasFmt }}</span></div>
            <div class="mb5">
              <sc-for list="{{ debtChips }}" as="dc" hint-placeholder-count="3"><button onClick="{{ dc.onClick }}" style="height:36px;padding:0 12px;border-radius:18px;border:1px solid {{ dc.border }};background:{{ dc.bg }};color:{{ dc.color }};font:600 12px 'Hanken Grotesk',sans-serif;text-decoration:{{ dc.deco }};white-space:nowrap">{{ dc.label }}</button></sc-for>
            </div>
            <div class="mb6"><span class="m4k">Toca una deuda para quitarla del cálculo.</span><button class="mb7" onClick="{{ openDebtSheet }}">+ Agregar deuda</button></div>
          </div>
          <button class="mb8" onClick="{{ togglePareja }}">
            <div class="m2a"><span class="m2c">Compra en pareja / familia</span><span class="m4k">{{ parejaSub }}</span></div>
            <div style="width:54px;height:32px;border-radius:16px;background:{{ parejaTrack }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ parejaKnob }};transform:{{ parejaX }};transition:transform .18s ease-out"></div></div>
          </button>
          <sc-if value="{{ parejaOn }}" hint-placeholder-val="{{ false }}"><div class="mb9">
            <div class="m7h"><span class="m2c">Segundo solicitante</span><button class="mba" onClick="{{ openHelpPareja }}" aria-label="Cómo funciona comprar en pareja"><span class="m7j">?</span>Entender</button></div>
            <label class="mbc"><span class="m42">NOMBRE COMPLETO (OPCIONAL)</span><input class="m52" maxlength="70" value="{{ pjNombre }}" onInput="{{ onPjNombre }}" placeholder="Ej: Diana Pérez" aria-label="NOMBRE DEL SEGUNDO SOLICITANTE (OPCIONAL)"></label>
            <div class="mbb"><label class="mbc"><span class="m42">SU INGRESO MENSUAL</span><input class="m52" value="{{ pjIngTxt }}" onInput="{{ onPjIng }}" inputMode="numeric" placeholder="$0" aria-label="SU INGRESO MENSUAL"></label><label class="mbc"><span class="m42">SUS DEUDAS MENSUALES</span><input class="m52" value="{{ pjDeuTxt }}" onInput="{{ onPjDeu }}" inputMode="numeric" placeholder="$0" aria-label="SUS DEUDAS MENSUALES"></label></div>
            <div class="mav"><span>Solo tú: {{ pjSoloM }}</span><span class="m6o">Juntos: {{ pjJuntosM }}</span></div>
            <sc-if value="{{ pjSubWarn }}" hint-placeholder-val="{{ false }}"><span class="mbd">{{ pjSubMsg }}</span></sc-if>
          </div></sc-if>
          <div class="mbe">Modalidad</div>
          <div class="m56">
            <sc-for list="{{ modOpts }}" as="mo" hint-placeholder-count="3"><button onClick="{{ mo.onClick }}" style="padding:14px 12px;border-radius:20px;border:1px solid {{ mo.border }};background:{{ mo.bg }};text-align:left;display:flex;flex-direction:column;gap:6px;transition:background .15s ease-out"><span style="font:600 14px 'Familjen Grotesk',sans-serif;color:{{ mo.color }}">{{ mo.label }}</span><span style="font:500 11px 'IBM Plex Mono',monospace;color:{{ mo.sub }}">{{ mo.desc }}</span></button></sc-for>
          </div>
          <sc-if value="{{ visWarn }}" hint-placeholder-val="{{ false }}"><div class="mbf">{{ visWarnMsg }}</div></sc-if>
          <div class="mar"><div class="m7h"><span class="m2c">Condiciones del banco</span><button class="mba" onClick="{{ openHelpCond }}" aria-label="Qué son las condiciones del banco"><span class="m7j">?</span>Entender</button></div>
            <sc-if value="{{ showAvgSel }}" hint-placeholder-val="{{ true }}"><div class="m50"><span class="m42">PROMEDIO DE INGRESOS VARIABLES</span><div class="m1w"><sc-for list="{{ avgOpts }}" as="o" hint-placeholder-count="3"><button onClick="{{ o.onClick }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ o.border }};background:{{ o.bg }};color:{{ o.color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ o.label }}</button></sc-for></div></div></sc-if>
            <sc-if value="{{ showFlex }}" hint-placeholder-val="{{ true }}"><div class="m50"><span class="m42">CUOTA MÁXIMA SOBRE TU INGRESO</span><div class="m1w"><sc-for list="{{ flexOpts }}" as="o" hint-placeholder-count="3"><button onClick="{{ o.onClick }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ o.border }};background:{{ o.bg }};color:{{ o.color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ o.label }}</button></sc-for></div><span class="m2f">La ley fija 30% en VIS. En No VIS y leasing algunos bancos aceptan hasta 40%.</span></div></sc-if>
            <sc-if value="{{ isLeasing }}" hint-placeholder-val="{{ false }}"><div class="m50"><span class="m42">OPCIÓN DE COMPRA AL FINAL</span><div class="m1w"><sc-for list="{{ opcOpts }}" as="o" hint-placeholder-count="3"><button onClick="{{ o.onClick }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ o.border }};background:{{ o.bg }};color:{{ o.color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ o.label }}</button></sc-for></div><span class="m2f">Entre más alta, menor el canon mensual y mayor el pago final ({{ opcFmt }}).</span></div></sc-if>
            <div class="m50"><div class="m7h"><span class="m42">PLAZO DEL CRÉDITO</span><button class="mba" onClick="{{ openHelpPlazo }}" aria-label="Cómo elegir el plazo del crédito"><span class="m7j">?</span>Entender</button></div><div class="mbv"><sc-for list="{{ termOpts }}" as="t" hint-placeholder-count="3"><button onClick="{{ t.onClick }}" style="height:38px;border-radius:19px;border:1px solid {{ t.border }};background:{{ t.bg }};color:{{ t.color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ t.label }}</button></sc-for></div><span class="m2f">{{ plazoRecomendadoNota }}</span></div>
            <sc-if value="{{ isVip }}" hint-placeholder-val="{{ false }}"><span class="mat">Con este precio tu vivienda sería VIP (hasta 90 SMMLV = {{ vipTopeFmt }}).</span></sc-if></div>
          <sc-if value="{{ simSubShow }}" hint-placeholder-val="{{ false }}"><div class="mbg"><span style="width:10px;height:10px;border-radius:3px;background:{{ simSubDot }};flex:none;margin-top:4px"></span><span class="mbh">{{ simSubMsg }}</span></div></sc-if>
          <div class="mbi">
            <div class="mbj"><span class="m3w">VIVIENDA HASTA</span><span class="mbk">\${{ heroPrice }} M</span></div>
            <button class="mbl" onClick="{{ goSimResult }}">Ver resultado →</button>
          </div>
        </sc-if>
  
        <sc-if value="{{ tabIs.simResult }}" hint-placeholder-val="{{ false }}">
          <div class="m3m"><button class="m3n" onClick="{{ goSim }}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>Ajustar</button></div>
          <div class="mbm">
            <span class="m8t">Precio máximo de la propiedad</span>
            <div class="m31"><span class="mbn">$</span><span class="mbo">{{ heroPrice }}</span><span class="mbp">M</span></div>
          </div>
          <div class="mbq">
            <div class="m6p"><span>INGRESO − DEUDAS</span><span class="m6m">{{ netoFmt }}</span></div>
            <div class="m6p"><span>{{ topeLabel }}</span><span class="m6m">{{ capFmt }}</span></div>
            <div class="m6p"><span>{{ factorLabel }}</span><span class="m6m">{{ creditoFmt }}</span></div>
            <sc-if value="{{ visCappedRow }}" hint-placeholder-val="{{ false }}"><div class="m6p"><span>{{ finLabel }}</span><span class="m6m">{{ precioSinTopeFmt }}</span></div></sc-if>
            <div class="mbr"><span>{{ finLabelLast }}</span><span class="mbs">{{ precioFmt }}</span></div>
          </div>
          <div class="mbt">
            <div class="m1j"><span class="m2c">Crédito que prestaría el banco</span></div>
            <span class="mbu">{{ creditoFmt }}</span>
            <div class="m8m">
              <sc-for list="{{ rateOpts }}" as="r" hint-placeholder-count="2"><button onClick="{{ r.onClick }}" style="height:38px;border-radius:19px;border:1px solid {{ r.border }};background:{{ r.bg }};color:{{ r.color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ r.label }}</button></sc-for>
            </div>
            <div class="m7h" style="margin-top:2px"><span class="m42" style="margin:0">PLAZO DEL CRÉDITO</span><button class="mba" onClick="{{ openHelpPlazo }}" aria-label="Cómo elegir el plazo del crédito"><span class="m7j">?</span>Entender</button></div>
            <div class="mbv">
              <sc-for list="{{ termOpts }}" as="t" hint-placeholder-count="3"><button onClick="{{ t.onClick }}" style="height:38px;border-radius:19px;border:1px solid {{ t.border }};background:{{ t.bg }};color:{{ t.color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ t.label }}</button></sc-for>
            </div>
            <span class="m2f">{{ plazoRecomendadoNota }}</span>
            <div class="m1w"><sc-for list="{{ entOpts }}" as="o" hint-placeholder-count="3"><button onClick="{{ o.onClick }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ o.border }};background:{{ o.bg }};color:{{ o.color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ o.label }}</button></sc-for></div>
            <span class="m2f">{{ rateNote }}</span>
            <sc-if value="{{ isUvr }}" hint-placeholder-val="{{ false }}"><div class="maq"><sc-for list="{{ uvrRows }}" as="u" hint-placeholder-count="3"><span>{{ u.label }}</span><span class="m9i">{{ u.value }}</span></sc-for></div><span class="m2f">Punto de equilibrio: <b>{{ puntoEquilibrioUvr }}</b>. Si la inflación promedio de los 20 años es menor a 5,58% ganas con UVR; si supera 5,58%, Pesos fijos te ahorra dinero.</span></sc-if>
            <div class="mbw"><span class="m3t">{{ cuotaLabel }}</span><span class="mbx">{{ cuotaMensual }}</span></div>
            <sc-if value="{{ locked }}" hint-placeholder-val="{{ true }}">
              <div class="mby">
                <span class="mbz">Compara Pesos vs. UVR, plazos, entidades y el desglose de escrituración.</span>
                <button class="mc0" onClick="{{ unlock }}">{{ unlockLabel }}</button>
              </div>
            </sc-if>
          </div>
          <div class="mc1">
            <div class="m62"><span class="m2c">Cierre financiero</span><span class="m4k">Crédito + subsidio + ahorro = 100% de la vivienda</span></div>
            <div class="maq">
              <span>Precio de la vivienda</span><span class="m9i">{{ precioFmt }}</span>
              <span>Crédito del banco</span><span class="m9i">{{ creditoUsadoFmt }}</span>
              <sc-if value="{{ hasCajaSub }}"><span>+ Subsidio Caja ({{ subCajaS }} SMMLV)</span><span class="m9i">{{ subCajaFmt }}</span></sc-if>
              <sc-if value="{{ hasMcySub }}"><span>+ Mi Casa Ya (20 SMMLV)</span><span class="m9i">{{ subMcyFmt }}</span></sc-if>
              <span>+ Tu ahorro</span><span class="m9i">{{ ahorroFmt }}</span>
              <span class="m9j">{{ faltaLabel }}</span><span style="color:{{ faltaColor }};font-weight:700;text-align:right;border-top:1px solid var(--ln);padding-top:8px">{{ faltaFmt }}</span>
              <span>{{ gastosLabel }}</span><span class="m9i">{{ gastosFmt }}</span>
              <sc-if value="{{ isLeasing }}" hint-placeholder-val="{{ false }}"><span>Opción de compra al final ({{ opcPct }})</span><span class="m9i">{{ opcFmt }}</span></sc-if>
            </div>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--ln)"><button class="mb8" onClick="{{ toggleFinanciarGastos }}" style="width:100%;padding:4px 0;background:transparent;border:none"><div class="m2a"><span class="m2c" style="font-size:12px">Financiar escrituración en el crédito</span><span class="m4k" style="font-size:11px">Ley 2434 de 2024 · Cuota inicial cubre solo la vivienda</span></div><div style="width:40px;height:24px;border-radius:12px;background:{{ financiarGastosOn ? 'var(--ac)' : 'var(--c2)' }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:10px;background:{{ financiarGastosOn ? 'var(--oa)' : 'var(--mu)' }};transform:{{ financiarGastosOn ? 'translateX(16px)' : 'none' }};transition:transform .18s ease-out"></div></div></button></div>
            <sc-if value="{{ limitAhorro }}" hint-placeholder-val="{{ true }}"><div class="mc2"><span class="mc3">Con lo que tienes hoy cierras hasta</span><span class="mc4">{{ precioHoyM }}</span></div></sc-if>
          </div>
          <div class="max"><span class="may">i</span><span>Valores proyectados según políticas de riesgo de la Superintendencia Financiera. La aprobación definitiva depende del estudio del banco.</span></div>
          <div class="mc5">
            <button class="mc6" onClick="{{ goPlan }}">Liberar cupo apagando deudas</button>
            <button class="mc7" onClick="{{ downloadPdf }}">PDF</button>
          </div>
        </sc-if>
      </div>
    </sc-if>

      <sc-if value="{{ showDock }}" hint-placeholder-val="{{ true }}">
        <nav class="mdu" aria-label="Navegación principal">
          <button onClick="{{ tabGo.inicio }}" aria-label="Inicio" style="height:48px;padding:0 12px;border-radius:24px;background:{{ tabBg.inicio }};color:{{ tabFg.inicio }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z"></path></svg><sc-if value="{{ tabIs.inicio }}"><span class="mdv">Inicio</span></sc-if></button>
          <button onClick="{{ tabGo.ingresos }}" aria-label="Registros" style="height:48px;padding:0 12px;border-radius:24px;background:{{ tabBg.ingresos }};color:{{ tabFg.ingresos }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"></path></svg><sc-if value="{{ tabIs.ingresos }}"><span class="mdv">Registros</span></sc-if></button>
          <button onClick="{{ tabGo.simulador }}" aria-label="Simulador" style="height:48px;padding:0 12px;border-radius:24px;background:{{ tabBg.simulador }};color:{{ tabFg.simulador }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><path d="M8 6h8M8 10h8M8 14h4"></path></svg><sc-if value="{{ tabIs.simulador }}"><span class="mdv">Simular</span></sc-if></button>
          <button onClick="{{ tabGo.plan }}" aria-label="Plan 30%" style="height:48px;padding:0 12px;border-radius:24px;background:{{ tabBg.plan }};color:{{ tabFg.plan }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 3"></path></svg><sc-if value="{{ tabIs.plan }}"><span class="mdv">Plan</span></sc-if></button>
          <button onClick="{{ tabGo.ofertas }}" aria-label="Ofertas" style="height:48px;padding:0 12px;border-radius:24px;background:{{ tabBg.ofertas }};color:{{ tabFg.ofertas }};display:flex;align-items:center;gap:7px;transition:background .15s ease-out"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"></path><circle cx="8" cy="8" r="1.5"></circle></svg><sc-if value="{{ tabIs.ofertas }}"><span class="mdv">Ofertas</span></sc-if></button>
          <button class="mdw" onClick="{{ openSheet }}" aria-label="Registrar ingreso"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"></path></svg></button>
        </nav>
      </sc-if>
  
      <sc-if value="{{ hasSheet }}" hint-placeholder-val="{{ false }}">
        <div onClick="{{ closeSheet }}" style="position:absolute;inset:0;background:rgba(0,0,0,.55);opacity:{{ sheetFade }};pointer-events:{{ sheetPE }};transition:opacity .2s ease-out;z-index:50"></div>
        <div class="mt-sheet" style="position:absolute;left:0;right:0;bottom:0;background:var(--cd);border-radius:32px 32px 0 0;border-top:1px solid var(--ln);padding:10px 18px 30px;transform:{{ sheetY }};transition:transform .32s cubic-bezier(.22,1,.36,1);z-index:51;display:{{ sheetDisplay }};flex-direction:column;gap:14px">
          <div class="mdx"></div>
          <div class="m8k"><span class="m4z">{{ sheetKicker }}</span><button class="m55" onClick="{{ closeSheet }}">Cerrar</button></div>
`;
