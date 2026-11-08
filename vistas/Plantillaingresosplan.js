// Plantilla de las pestañas de registro de ingresos, plan de ahorro y catálogo de vivienda

const Plantillaingresosplan = `
        <sc-if value="{{ tabIs.ingresos }}" hint-placeholder-val="{{ false }}">
          <div class="m8j">
            <div class="m8k"><h1 class="m8l">Mis registros</h1></div>
            <div class="m8m"><sc-for list="{{ regKinds }}" as="rk" hint-placeholder-count="2"><button onClick="{{ rk.onClick }}" style="height:56px;border-radius:20px;border:1px solid {{ rk.border }};background:{{ rk.bg }};color:{{ rk.color }};display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;padding:0 16px;transition:background .15s ease-out"><span class="m8n">{{ rk.label }}</span><span class="m8o">{{ rk.sub }}</span></button></sc-for></div>
            <div class="m8p"><sc-for list="{{ ingSegs }}" as="is" hint-placeholder-count="3"><button onClick="{{ is.onClick }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;background:{{ is.bg }};color:{{ is.color }};font:600 13px 'Familjen Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px"><span>{{ is.label }}</span><sc-if value="{{ is.tag }}"><span class="m8q">{{ is.tag }}</span></sc-if></button></sc-for></div>
          </div>
  
          <sc-if value="{{ ingIsDia }}" hint-placeholder-val="{{ true }}">
            <sc-if value="{{ regIng }}" hint-placeholder-val="{{ true }}">
            <div class="m8r">
              <sc-for list="{{ weekDays }}" as="d" hint-placeholder-count="7"><button onClick="{{ d.onClick }}" style="flex:1;min-width:38px;height:62px;border-radius:18px;background:{{ d.bg }};border:1px solid {{ d.border }};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span style="font:600 11px 'IBM Plex Mono',monospace;color:{{ d.sub }}">{{ d.d }}</span><span style="font:600 16px 'Familjen Grotesk',sans-serif;color:{{ d.color }}">{{ d.n }}</span><div style="width:5px;height:5px;border-radius:3px;background:{{ d.dot }}"></div></button></sc-for>
            </div>
            <div class="m8s"><span class="m8t">{{ dayTitle }}</span><div class="m1t"><span class="m8u">$</span><span class="m8v">{{ dayTotal }}</span></div><div class="m8w"><div class="m8y"><div style="width:{{ dayMetaW }};max-width:100%;height:100%;border-radius:4px;background:var(--ac);transition:width .6s ease-out"></div></div><div class="m8x" style="display:flex;justify-content:space-between;align-items:center"><span>{{ dayMetaPct }} de la meta diaria</span><span class="m3e">{{ dayMetaMsg }}</span></div></div></div>
            <div class="m8z"><span class="m2v">{{ entryCount }}</span><span class="m85">ORDEN DE REGISTRO</span></div>
            <div class="mdl">
              <sc-for list="{{ dayEntries }}" as="e" hint-placeholder-count="3">
                <div onClick="{{ e.onClick }}" style="width:100%;padding:12px 14px;border-radius:18px;background:{{ e.rowBg }};border:1px solid var(--ln);display:flex;align-items:center;gap:12px;cursor:{{ e.cursor }};box-sizing:border-box">
                  <div class="m90">{{ e.ini }}</div>
                  <div class="m91"><span class="m92">{{ e.concepto }}</span><span class="m4k">{{ e.meta }}</span></div>
                  <div class="m93">
                    <span class="m46">{{ e.monto }}</span>
                    <sc-if value="{{ e.cash }}"><span class="m94">EFECTIVO</span></sc-if>
                    <sc-if value="{{ e.done }}"><span class="m96">CONSIGNADO</span></sc-if>
                  </div>
                </div>
              </sc-for>
            </div>
            </sc-if>
            <sc-if value="{{ regEgr }}" hint-placeholder-val="{{ false }}">
            <div class="m8r">
              <sc-for list="{{ weekDays }}" as="d" hint-placeholder-count="7"><button onClick="{{ d.onClick }}" style="flex:1;min-width:38px;height:62px;border-radius:18px;background:{{ d.bg }};border:1px solid {{ d.border }};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span style="font:600 11px 'IBM Plex Mono',monospace;color:{{ d.sub }}">{{ d.d }}</span><span style="font:600 16px 'Familjen Grotesk',sans-serif;color:{{ d.color }}">{{ d.n }}</span><div style="width:5px;height:5px;border-radius:3px;background:{{ d.dot }}"></div></button></sc-for>
            </div>
            <div class="m8s"><span class="m8t">{{ egDayTitle }}</span><div class="m1t"><span class="m8u">$</span><span class="m8v">{{ egDayTotal }}</span></div><div class="m8w" style="display:flex;flex-direction:row;justify-content:space-between;padding:12px 16px"><span style="font:500 12px 'IBM Plex Mono',monospace;color:var(--mu)">Entró {{ egDayIng }}</span><span style="font:500 12px 'IBM Plex Mono',monospace;color:var(--mu)">Salió {{ egDayEx }}</span><span style="font:700 12px 'IBM Plex Mono',monospace;color:var(--ik)">Quedó {{ egDayNet }}</span></div></div>
            <div class="m8z"><span class="m2v">{{ egCount }}</span><span class="m85">ORDEN DE REGISTRO</span></div>
            <div class="mdl">
              <sc-for list="{{ egEntries }}" as="e" hint-placeholder-count="2">
                <div style="width:100%;padding:12px 14px;border-radius:18px;background:transparent;border:1px solid var(--ln);display:flex;align-items:center;gap:12px;box-sizing:border-box">
                  <div class="m90">{{ e.ini }}</div>
                  <div class="m91"><span class="m92">{{ e.concepto }}</span><span class="m4k">{{ e.meta }}</span></div>
                  <span class="m46" style="color:var(--al)">{{ e.monto }}</span>
                </div>
              </sc-for>
            </div>
            </sc-if>
          </sc-if>

          <sc-if value="{{ ingIsMes }}" hint-placeholder-val="{{ false }}">
            <sc-if value="{{ regIng }}" hint-placeholder-val="{{ true }}">
            <div class="m8s"><span class="m8t">Tu promedio móvil {{ avgNLabel }}</span><div class="m1t"><span class="m8u">$</span><span class="m8v">{{ ingresoFmt }}</span><span class="m8i">/mes</span></div><div class="m98">Con lo que registraste este mes tu crédito <b class="m3e">{{ creditUpVerb }} {{ creditUp }}</b>.</div></div>
            <div class="m8z"><span class="m2v">Semanas de este mes</span><span class="m85">TOTAL {{ varTotal }}</span></div>
            <div class="m9x">
              <div class="m9y">
                <sc-for list="{{ weekBars }}" as="w" hint-placeholder-count="4">
                  <div class="m9z">
                    <span class="ma1">{{ w.val }}</span>
                    <div class="ma0"><div style="width:100%;height:{{ w.h }};background:{{ w.bg }};border-radius:6px;transition:height .6s cubic-bezier(.22,1,.36,1)"></div></div>
                    <span class="ma2">{{ w.label }}</span>
                  </div>
                </sc-for>
              </div>
            </div>
            <div class="m8z"><span class="m2v">Últimos meses</span><span class="m85">HISTORIAL</span></div>
            <div class="m9x">
              <div class="m9y" style="position:relative">
                <div style="position:absolute;left:0;right:0;top:{{ avgLine }};border-top:1.5px dashed var(--at);z-index:1;pointer-events:none"></div>
                <sc-for list="{{ monthBars }}" as="m" hint-placeholder-count="6">
                  <div class="m9z">
                    <div class="ma0"><div style="width:100%;height:{{ m.h }};background:{{ m.bg }};border-radius:6px;transition:height .6s cubic-bezier(.22,1,.36,1)"></div></div>
                    <span class="ma2">{{ m.label }}</span>
                  </div>
                </sc-for>
              </div>
            </div>
            <div class="m9h"><div class="m1j"><span>Promedio últimos 3 meses</span><span class="m9i">{{ avg3 }}</span></div><div class="m1j"><span>Promedio últimos 6 meses</span><span class="m9i">{{ avg6 }}</span></div><div class="m1m"></div><div class="m1j"><span class="m9j">Flujo neto estimado</span><span class="m9k">{{ flujoNeto }}</span></div></div>
            <div class="m8z"><span class="m2v">Ingresos fijos</span><span class="m85">TOTAL {{ fixTotFmt }}</span></div>
            <div class="mdl">
              <sc-for list="{{ fixRows }}" as="f" hint-placeholder-count="1">
                <div style="width:100%;padding:12px 14px;border-radius:18px;background:var(--cd);border:1px solid var(--ln);display:flex;align-items:center;gap:12px;box-sizing:border-box">
                  <div class="m90">{{ f.ini }}</div>
                  <div class="m91"><span class="m92">{{ f.concepto }}</span><span class="m4k">{{ f.meta }}</span></div>
                  <span class="m46">{{ f.monto }}</span>
                  <sc-if value="{{ f.canRemove }}"><button class="m2l" onClick="{{ f.onRemove }}" aria-label="Quitar">×</button></sc-if>
                </div>
              </sc-for>
              <button class="mab" onClick="{{ openFixedIncome }}">+ Agregar ingreso fijo mensual</button>
            </div>
            </sc-if>
            <sc-if value="{{ regEgr }}" hint-placeholder-val="{{ false }}">
            <div class="m8s"><span class="m8t">Tus egresos de este mes</span><div class="m1t"><span class="m8u">$</span><span class="m8v">{{ egMesTotal }}</span></div><div class="m8w"><div class="m8y"><div style="width:{{ egFijosW }};background:var(--ik);border-radius:3px;height:100%"></div></div><div class="m8x" style="display:flex;justify-content:space-between;align-items:center"><span>Fijos {{ egFijosFmt }}</span><span>Variables {{ gastosMesFmt }}</span></div></div></div>
            <div class="m8z"><span class="m2v">Cuotas fijas mensuales</span><span class="m85">DEUDAS</span></div>
            <div class="mdl">
              <sc-for list="{{ debtRowsMes }}" as="d" hint-placeholder-count="2">
                <div style="width:100%;padding:12px 14px;border-radius:18px;background:var(--cd);border:1px solid var(--ln);display:flex;align-items:center;gap:12px;box-sizing:border-box">
                  <button onClick="{{ d.onTogglePaid }}" style="width:24px;height:24px;border-radius:12px;border:2px solid {{ d.boxBorder }};background:{{ d.boxBg }};display:flex;align-items:center;justify-content:center;flex:none;cursor:pointer"><sc-if value="{{ d.paid }}"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--oa)" stroke-width="3"><path d="M5 12l5 5L20 7"></path></svg></sc-if></button>
                  <div class="m91"><span style="font:600 14px 'Hanken Grotesk',sans-serif;color:{{ d.color }};text-decoration:{{ d.deco }}">{{ d.name }}</span></div>
                  <span class="m46">{{ d.cuota }}</span>
                  <button class="mag" onClick="{{ d.onEdit }}" aria-label="Editar deuda"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                </div>
              </sc-for>
              <button class="mab" onClick="{{ openDebtSheet }}">+ Agregar deuda o egreso fijo</button>
            </div>
            <div class="m8z"><span class="m2v">Gastos del día a día</span><span class="m85">ESTE MES</span></div>
            <div class="mak">
              <sc-for list="{{ catRows }}" as="k" hint-placeholder-count="4"><div class="mal"><div class="mam"><span>{{ k.label }}</span><span class="m3e">{{ k.monto }}</span></div><div class="m4v"><div style="height:100%;width:{{ k.w }};background:var(--al);border-radius:4px;transition:width .6s cubic-bezier(.22,1,.36,1)"></div></div></div></sc-for>
              <button class="man" onClick="{{ openExpenseSheet }}">+ Registrar gasto</button>
            </div>
            </sc-if>
          </sc-if>
  
          <sc-if value="{{ ingIsAno }}" hint-placeholder-val="{{ false }}">
            <div class="m8s"><span class="m8t">Ingresos estimados 2026</span><div class="m1t"><span class="m8u">$</span><span class="mao">{{ anoIngM }}</span><span class="m8i">M</span></div></div>
            <div class="map"><span class="m2c">Consolidado de 12 meses</span><div class="maq"><span>Ingresos fijos</span><span class="m9i">{{ anoFijo }}</span><span>Ingresos variables (promedio)</span><span class="m9i">{{ anoVar }}</span><sc-if value="{{ anoPrest }}"><span>Primas (junio + diciembre)</span><span class="m9i">{{ anoPrima }}</span><span>Cesantías (se consignan en febrero)</span><span class="m9i">{{ anoCes }}</span><span>Intereses de cesantías (12%)</span><span class="m9i">{{ anoIntCes }}</span></sc-if><span class="m9j">Total del año</span><span class="m9k">{{ anoTotal }}</span></div></div>
            <sc-if value="{{ anoPrest }}" hint-placeholder-val="{{ true }}"><div class="mar"><span class="m2c">¿Cuánto de primas y cesantías va a tu cuota inicial?</span><div class="m1w"><sc-for list="{{ anoPctOpts }}" as="o" hint-placeholder-count="3"><button onClick="{{ o.onClick }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ o.border }};background:{{ o.bg }};color:{{ o.color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ o.label }}</button></sc-for></div><div class="m4s"><span class="m3t">Aportas al año</span><span class="mas">{{ anoAporte }}</span></div><span class="mat">{{ anoAporteMsg }}</span><span class="m2f">Las cesantías se pueden retirar para comprar vivienda.</span></div></sc-if>
            <sc-if value="{{ anoNoPrest }}" hint-placeholder-val="{{ false }}"><div class="mar"><span class="m2c">Primas y cesantías</span><span class="mau">Solo aplican si tienes contrato laboral. Como independiente puedes ahorrar en una cuenta AFC o en el FNA.</span></div></sc-if>
            <div class="mar"><div class="m1j"><span class="m2c">¿Debes declarar renta?</span><span class="m42">AÑO GRAVABLE 2026</span></div><sc-for list="{{ rentaRows }}" as="r" hint-placeholder-count="3"><div class="mal"><div class="mav"><span>{{ r.label }}</span><span class="maw">{{ r.value }}</span></div><div class="m4v"><div style="height:100%;width:{{ r.w }};background:{{ r.bg }};border-radius:4px"></div></div></div></sc-for><div style="padding:12px 14px;border-radius:16px;background:{{ rentaBg }};font:600 13px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A">{{ rentaMsg }}</div></div>
            <sc-if value="{{ superaTopePatrimonio }}" hint-placeholder-val="{{ false }}"><div style="margin-top:10px;padding:10px 12px;border-radius:14px;background:#FFD23F;font:600 12px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A">{{ alertaPatrimonioMsg }}</div></sc-if>
            <div class="mar" style="margin-top:10px"><div class="m1j"><span class="m2c">Deducción de intereses de vivienda</span><span class="m42">ART. 119 E.T.</span></div><p class="m66" style="margin:4px 0 8px">{{ ahorroRentaMsg }}</p><div class="max"><span class="may">i</span><span>Esta deducción reduce el impuesto de renta ante la DIAN, pero no incrementa la capacidad de crédito que te aprueba el banco.</span></div></div>
            <div class="max"><span class="may">i</span><span>Valores estimados con UVT 2026 de $52.374. Confirma tu obligación tributaria con un contador o directamente ante la DIAN.</span></div>
          </sc-if>
        </sc-if>

        <sc-if value="{{ tabIs.plan }}" hint-placeholder-val="{{ false }}">
          <div class="maz"><h1 class="m8l">{{ planTitle }}</h1></div>
          <div class="mc8"><sc-for list="{{ planSegs }}" as="ps" hint-placeholder-count="2"><button onClick="{{ ps.onClick }}" style="border-radius:18px;background:{{ ps.bg }};color:{{ ps.color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ ps.label }}</button></sc-for></div>
          <sc-if value="{{ planIsDeudas }}" hint-placeholder-val="{{ true }}">
          <div class="mc9">
            <span class="m8t">{{ planLead }}</span>
            <div class="mca"><span class="mcb">+$</span><span class="mcc">{{ freedM }}</span><span class="mbp">M</span></div>
            <span class="m8i">más de crédito</span>
            <div class="mcd">
              <div class="mce"><span class="m85">CUPO DE VIVIENDA</span><span class="m46">{{ planCupo }}</span></div>
              <div class="mcf"><span class="m85">PUEDES CERRAR HOY</span><span class="m46">{{ planHoy }}</span></div>
            </div>
          </div>
          <sc-if value="{{ planMsgShow }}" hint-placeholder-val="{{ false }}"><div style="margin:16px 14px 0;padding:14px 16px;border-radius:20px;background:{{ planMsgBg }};font:600 14px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A;text-wrap:pretty">{{ planMsg }}</div></sc-if>
          <sc-if value="{{ saldoShow }}" hint-placeholder-val="{{ false }}"><div class="mcg">{{ saldoMsg }}</div></sc-if>
          <div class="mch">
            <sc-for list="{{ debtCards }}" as="dk" hint-placeholder-count="3">
              <div style="width:100%;text-align:left;padding:12px 14px;border-radius:18px;background:{{ dk.bg }};border:1px solid {{ dk.border }};display:flex;flex-direction:column;gap:8px;box-sizing:border-box;transition:background .2s ease-out">
                <div class="mci" style="gap:8px">
                  <div class="m2a" onClick="{{ dk.onClick }}" style="cursor:pointer;flex:1;min-width:0">
                    <span style="font:600 15px 'Familjen Grotesk',sans-serif;color:{{ dk.color }};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">{{ dk.name }}</span>
                    <span style="font:400 12px 'Hanken Grotesk',sans-serif;color:{{ dk.sub }}">{{ dk.detail }}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;flex:none">
                    <button onClick="{{ dk.onEdit }}" aria-label="Editar deuda" title="Editar deuda" style="width:28px;height:28px;border-radius:14px;background:{{ dk.btnBg }};border:1px solid {{ dk.btnBorder }};color:{{ dk.color }};display:flex;align-items:center;justify-content:center;cursor:pointer"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                    <button onClick="{{ dk.onDelete }}" aria-label="Eliminar deuda" title="Eliminar deuda" style="width:28px;height:28px;border-radius:14px;background:{{ dk.btnBg }};border:1px solid {{ dk.btnBorder }};color:var(--al);display:flex;align-items:center;justify-content:center;cursor:pointer"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    <div onClick="{{ dk.onClick }}" style="width:44px;height:26px;border-radius:13px;background:{{ dk.track }};position:relative;flex:none;transition:background .15s ease-out;cursor:pointer">
                      <div style="position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:10px;background:{{ dk.knob }};transform:{{ dk.x }};transition:transform .18s ease-out"></div>
                    </div>
                  </div>
                </div>
                <div onClick="{{ dk.onClick }}" style="display:flex;justify-content:space-between;align-items:center;width:100%;border-top:1px solid {{ dk.line }};padding-top:7px;cursor:pointer;box-sizing:border-box">
                  <span style="font:500 10.5px 'IBM Plex Mono',monospace;color:{{ dk.sub }};letter-spacing:.02em">{{ dk.state }}</span>
                  <span style="font:700 13px 'Familjen Grotesk',sans-serif;color:{{ dk.color }};white-space:nowrap;margin-right:2px">{{ dk.impact }}</span>
                </div>
              </div>
            </sc-for>
            <button class="mcj" onClick="{{ openDebtSheet }}"><span class="mck">+</span>Agregar deuda o egreso fijo</button>
            <sc-if value="{{ noDebts }}" hint-placeholder-val="{{ false }}"><span class="mcl">No tienes deudas registradas. Agrega tus cuotas para que el cálculo sea igual al del banco.</span></sc-if>
          </div>
          <sc-if value="{{ showCartera }}" hint-placeholder-val="{{ false }}"><div class="mcm"><span class="mcn">{{ carteraMsg }}</span><span class="mco">Una compra de cartera con una entidad bancaria podría bajar tus cuotas y liberar cupo hipotecario.</span></div></sc-if>
          <div class="m98">Por cada <b class="m3e">$100.000</b> de cuota que dejas de pagar, el banco te presta <b class="m6o">{{ sensCredM }}</b> más. Fórmula: cuota liberada × {{ topePct }} × {{ factorShort }} (tasa {{ eaFmt }} a {{ plazoFmt }}).</div>
        <div class="max"><span class="may">i</span><span>Valores proyectados según políticas de riesgo de la Superintendencia Financiera. La aprobación definitiva depende del estudio del banco.</span></div>
          </sc-if>
          <sc-if value="{{ planIsCi }}" hint-placeholder-val="{{ false }}">
            <div class="mc9">
              <span class="m8t">Para tu vivienda de {{ p8ObjM }} te falta</span>
              <div class="mca"><span class="mcb">$</span><span class="mcq">{{ p8FaltaM }}</span><span class="mbp">M</span></div>
              <div class="mcr"><div style="height:100%;width:{{ p8W }};background:var(--ac);border-radius:6px;transition:width .6s cubic-bezier(.22,1,.36,1)"></div></div>
              <div class="mcs"><span>TIENES {{ p8TengoM }}</span><span>META {{ p8TotalM }}</span></div>
            </div>
            <div class="mct"><span class="m2c">Tu meta de cuota inicial</span><div class="maq"><span>Vivienda que buscas</span><span class="m9i">{{ p8ObjFmt }}</span><span>− Crédito del banco ({{ finPct }})</span><span class="m9i">{{ p8CredFmt }}</span><span>= Cuota inicial</span><span class="m9i">{{ p8CiFmt }}</span><span>+ {{ gastosLabel }}</span><span class="m9i">{{ p8GastosFmt }}</span><span>− Ahorro + subsidio</span><span class="m9i">{{ p8TengoFmt }}</span><span class="m9j">Te falta</span><span class="m9k">{{ p8FaltaFmt }}</span></div><sc-if value="{{ p8CupoCorto }}" hint-placeholder-val="{{ false }}"><span class="mcu">{{ p8CupoMsg }}</span></sc-if></div>
            <div class="mar"><span class="m2c">¿En cuánto tiempo la quieres?</span><div class="m1w"><sc-for list="{{ p8Plazos }}" as="o" hint-placeholder-count="3"><button onClick="{{ o.onClick }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ o.border }};background:{{ o.bg }};color:{{ o.color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ o.label }}</button></sc-for></div><div class="m4s"><span class="m3t">Debes ahorrar al mes</span><span class="mcv">{{ p8Mensual }}</span></div><div style="padding:12px 14px;border-radius:16px;background:{{ p8MsgBg }};font:600 13px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A">{{ p8Msg }}</div></div>
            <button class="mcw" onClick="{{ goAno }}"><span class="mcx">{{ p8PrimasMsg }}</span><span class="m58">Mi Año →</span></button>
            <sc-if value="{{ showAds }}" hint-placeholder-val="{{ true }}"><div class="mar"><div class="mcy"><span class="m42">AHORRO · CUENTA AFC</span></div><span class="mcz">Ahorra tu cuota inicial en una cuenta AFC</span><span class="md0">Los aportes que uses para comprar vivienda pueden ser renta exenta, con los límites que fija la ley. Puedes abrirla en tu banco habitual.</span></div></sc-if>
            <div class="max"><span class="may">i</span><span>Valores proyectados según políticas de riesgo de la Superintendencia Financiera. La aprobación definitiva depende del estudio del banco.</span></div>
          </sc-if>
        </sc-if>
  
        <sc-if value="{{ tabIs.ofertas }}" hint-placeholder-val="{{ false }}">
          <div class="maz"><h1 class="m8l">Ofertas</h1></div>
          <div class="md2">Tu cupo es de <b class="m3e">\${{ heroPrice }} M</b> y hoy puedes cerrar hasta <b class="m6o">{{ precioHoyM }}</b>.</div>
          <div class="md3">
            <span class="md4"><span class="md5"></span>Puedes cerrar hoy</span>
            <span class="md4"><span class="md6"></span>Te alcanza el cupo, falta cuota inicial</span>
            <span class="md4"><span class="md7"></span>Supera tu cupo</span>
          </div>
          <div class="md8">
            <div class="m8k"><span class="m6c">MOSTRANDO CIUDADES</span><sc-if value="{{ ofCustom }}" hint-placeholder-val="{{ false }}"><button class="md9" onClick="{{ ofReset }}">Restablecer</button></sc-if></div>
            <div class="mb5">
              <sc-for list="{{ ofChips }}" as="oc" hint-placeholder-count="1"><div style="height:36px;padding:0 4px 0 13px;border-radius:18px;background:{{ oc.bg }};color:{{ oc.color }};display:flex;align-items:center;gap:6px"><span class="mda">{{ oc.label }}</span><button onClick="{{ oc.onRemove }}" aria-label="Quitar ciudad" style="width:28px;height:28px;border-radius:14px;background:{{ oc.xBg }};color:{{ oc.color }};font:600 14px 'Familjen Grotesk',sans-serif;display:flex;align-items:center;justify-content:center">×</button></div></sc-for>
              <button class="mdb" onClick="{{ toggleOfAdd }}">{{ ofAddLabel }}</button>
            </div>
            <sc-if value="{{ ofAddOpen }}" hint-placeholder-val="{{ false }}">
              <div class="m48">
                <div class="mdc"><svg class="m4a" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg><input class="m4b" value="{{ ofQ }}" onInput="{{ onOfQ }}" autoFocus="{{ true }}" placeholder="Buscar ciudad" aria-label="Buscar ciudad"></div>
                <div class="mt-scroll mdd">
                  <sc-for list="{{ ofAddList }}" as="ca" hint-placeholder-count="5"><button class="mde" onClick="{{ ca.onClick }}"><span class="m45"><span class="m92">{{ ca.name }}</span><span class="m47">{{ ca.dept }}</span></span><span style="font:500 10px 'IBM Plex Mono',monospace;color:{{ ca.countColor }};white-space:nowrap">{{ ca.count }}</span><span class="m8i">+</span></button></sc-for>
                  <sc-if value="{{ ofAddEmpty }}" hint-placeholder-val="{{ false }}"><div class="mdf">No encontramos esa ciudad.</div></sc-if>
                </div>
              </div>
            </sc-if>
          </div>
          <sc-if value="{{ ofNone }}" hint-placeholder-val="{{ false }}"><div class="mdg">Agrega al menos una ciudad para ver proyectos.</div></sc-if>
          <div class="max"><span class="may">i</span><span>Precios de referencia. Tu aprobación final depende del estudio de crédito del banco.</span></div>
          <sc-for list="{{ ofGroups }}" as="g" hint-placeholder-count="1">
            <div class="mdh"><span class="mdi">{{ g.city }}</span><sc-if value="{{ g.home }}"><span class="mdj">TU CIUDAD</span></sc-if><span class="mdk"></span><span class="m85">{{ g.count }}</span></div>
            <div class="mdl">
              <sc-for list="{{ g.items }}" as="p" hint-placeholder-count="2">
              <div class="mdm">
                <div class="mdn"><div role="img" aria-label="{{ p.nombre }}" style="position:absolute;inset:0;background-image:{{ p.bgImg }};background-size:cover;background-position:center"></div><div class="mdo"></div><span class="mdp">{{ p.area }}</span><span style="position:absolute;right:12px;bottom:10px;font:600 11px 'IBM Plex Mono',monospace;padding:4px 8px;border-radius:10px;background:{{ p.tagBg }};color:{{ p.tagColor }}">{{ p.fit }}</span></div>
                <div class="mdq">
                  <div class="m4s"><span class="m46">{{ p.nombre }}</span><span class="mdr">{{ p.precio }}</span></div>
                  <span class="m4k">{{ p.meta }}</span>
                  <button class="mds" onClick="{{ p.onLead }}">Me interesa</button>
                </div>
              </div>
            </sc-for>
              <sc-if value="{{ g.empty }}"><div class="mdt">{{ g.emptyMsg }}</div></sc-if>
            </div>
          </sc-for>
        </sc-if>
`;

