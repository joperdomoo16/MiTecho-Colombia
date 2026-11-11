// Plantilla de las pestañas de registro de ingresos, plan de ahorro y catálogo de vivienda

const Plantillaingresosplan = `
        <sc-if value="{{ Pestanaes.ingresos }}" hint-placeholder-val="{{ false }}">
          <div class="m8j">
            <div class="m8k"><h1 class="m8l">Mis registros</h1></div>
            <div class="m8m"><sc-for list="{{ Registrotipos }}" as="Tiporegistro" hint-placeholder-count="2"><button al-clic="{{ Tiporegistro.Alclic }}" style="height:56px;border-radius:20px;border:1px solid {{ Tiporegistro.Borde }};background:{{ Tiporegistro.Fondo }};color:{{ Tiporegistro.Color }};display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;padding:0 16px;transition:background .15s ease-out"><span class="m8n">{{ Tiporegistro.Etiqueta }}</span><span class="m8o">{{ Tiporegistro.Subtexto }}</span></button></sc-for></div>
            <div class="m8p" data-tutorial="vistas"><sc-for list="{{ Ingresosegmentos }}" as="Segmentoingreso" hint-placeholder-count="3"><button al-clic="{{ Segmentoingreso.Alclic }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;background:{{ Segmentoingreso.Fondo }};color:{{ Segmentoingreso.Color }};font:600 13px 'Familjen Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px"><span>{{ Segmentoingreso.Etiqueta }}</span><sc-if value="{{ Segmentoingreso.Etiquetanodo }}"><span class="m8q">{{ Segmentoingreso.Etiquetanodo }}</span></sc-if></button></sc-for></div>
          </div>
  
          <sc-if value="{{ Ingresoesdia }}" hint-placeholder-val="{{ true }}">
            <sc-if value="{{ Registroingreso }}" hint-placeholder-val="{{ true }}">
            <div class="m8r">
              <sc-for list="{{ Semanadias }}" as="Diafila" hint-placeholder-count="7"><button al-clic="{{ Diafila.Alclic }}" style="flex:1;min-width:38px;height:62px;border-radius:18px;background:{{ Diafila.Fondo }};border:1px solid {{ Diafila.Borde }};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span style="font:600 11px 'IBM Plex Mono',monospace;color:{{ Diafila.Subtexto }}">{{ Diafila.Diasemana }}</span><span style="font:600 16px 'Familjen Grotesk',sans-serif;color:{{ Diafila.Color }}">{{ Diafila.Numerodia }}</span><div style="width:5px;height:5px;border-radius:3px;background:{{ Diafila.Punto }}"></div></button></sc-for>
            </div>
            <div class="m8s"><span class="m8t">{{ Diatitulo }}</span><div class="m1t"><span class="m8u">$</span><span class="m8v">{{ Diatotal }}</span></div><div class="m8w"><div class="m8y"><div style="width:{{ Diametaancho }};max-width:100%;height:100%;border-radius:4px;background:var(--ac);transition:width .6s ease-out"></div></div><div class="m8x" style="display:flex;justify-content:space-between;align-items:center"><span>{{ Diametaporcentaje }} de la meta diaria</span><span class="m3e">{{ Diametamensaje }}</span></div></div></div>
            <div class="m8z"><span class="m2v">{{ Registroscantidad }}</span><span class="m85">ORDEN DE REGISTRO</span></div>
            <div class="mdl">
              <sc-for list="{{ Diaregistros }}" as="Registrofila" hint-placeholder-count="3">
                <div al-clic="{{ Registrofila.Alclic }}" style="width:100%;padding:12px 14px;border-radius:18px;background:{{ Registrofila.Filafondo }};border:1px solid var(--ln);display:flex;align-items:center;gap:12px;cursor:{{ Registrofila.Cursor }};box-sizing:border-box">
                  <div class="m90">{{ Registrofila.Inicial }}</div>
                  <div class="m91"><span class="m92">{{ Registrofila.Concepto }}</span><span class="m4k">{{ Registrofila.Meta }}</span></div>
                  <div class="m93">
                    <span class="m46">{{ Registrofila.Monto }}</span>
                    <sc-if value="{{ Registrofila.Efectivo }}"><span class="m94">EFECTIVO</span></sc-if>
                    <sc-if value="{{ Registrofila.Hecho }}"><span class="m96">CONSIGNADO</span></sc-if>
                  </div>
                </div>
              </sc-for>
            </div>
            </sc-if>
            <sc-if value="{{ Registroegreso }}" hint-placeholder-val="{{ false }}">
            <div class="m8r">
              <sc-for list="{{ Semanadias }}" as="Diafila" hint-placeholder-count="7"><button al-clic="{{ Diafila.Alclic }}" style="flex:1;min-width:38px;height:62px;border-radius:18px;background:{{ Diafila.Fondo }};border:1px solid {{ Diafila.Borde }};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span style="font:600 11px 'IBM Plex Mono',monospace;color:{{ Diafila.Subtexto }}">{{ Diafila.Diasemana }}</span><span style="font:600 16px 'Familjen Grotesk',sans-serif;color:{{ Diafila.Color }}">{{ Diafila.Numerodia }}</span><div style="width:5px;height:5px;border-radius:3px;background:{{ Diafila.Punto }}"></div></button></sc-for>
            </div>
            <div class="m8s"><span class="m8t">{{ Egresodiatitulo }}</span><div class="m1t"><span class="m8u">$</span><span class="m8v">{{ Egresodiatotal }}</span></div><div class="m8w" style="display:flex;flex-direction:row;justify-content:space-between;padding:12px 16px"><span style="font:500 12px 'IBM Plex Mono',monospace;color:var(--mu)">Entró {{ Egresodiaingreso }}</span><span style="font:500 12px 'IBM Plex Mono',monospace;color:var(--mu)">Salió {{ Egresodiagasto }}</span><span style="font:700 12px 'IBM Plex Mono',monospace;color:var(--ik)">Quedó {{ Egresodianeto }}</span></div></div>
            <div class="m8z"><span class="m2v">{{ Egresocantidad }}</span><span class="m85">ORDEN DE REGISTRO</span></div>
            <div class="mdl">
              <sc-for list="{{ Egresoregistros }}" as="Registrofila" hint-placeholder-count="2">
                <div style="width:100%;padding:12px 14px;border-radius:18px;background:transparent;border:1px solid var(--ln);display:flex;align-items:center;gap:12px;box-sizing:border-box">
                  <div class="m90">{{ Registrofila.Inicial }}</div>
                  <div class="m91"><span class="m92">{{ Registrofila.Concepto }}</span><span class="m4k">{{ Registrofila.Meta }}</span></div>
                  <span class="m46" style="color:var(--al)">{{ Registrofila.Monto }}</span>
                </div>
              </sc-for>
            </div>
            </sc-if>
          </sc-if>

          <sc-if value="{{ Ingresoesmes }}" hint-placeholder-val="{{ false }}">
            <sc-if value="{{ Registroingreso }}" hint-placeholder-val="{{ true }}">
            <div class="m8s"><span class="m8t">Tu promedio móvil {{ Promediomesesetiqueta }}</span><div class="m1t"><span class="m8u">$</span><span class="m8v">{{ Promediomestexto }}</span><span class="m8i">/mes</span></div><div class="m98">{{ Mesmensaje }}</div></div>
            <div class="m8z"><span class="m2v">Ingresos registrados este mes</span><span class="m85">TOTAL {{ Variabletotal }}</span></div>
            <div class="m9x">
              <div class="m9y">
                <sc-for list="{{ Semanabarras }}" as="Barrasemana" hint-placeholder-count="4">
                  <div class="m9z">
                    <span class="ma1">{{ Barrasemana.Valorcampo }}</span>
                    <div class="ma0"><div style="width:100%;height:{{ Barrasemana.Altura }};background:{{ Barrasemana.Fondo }};border-radius:6px;transition:height .6s cubic-bezier(.22,1,.36,1)"></div></div>
                    <span class="ma2">{{ Barrasemana.Etiqueta }}</span>
                  </div>
                </sc-for>
              </div>
            </div>
            <div class="m8z"><span class="m2v">Últimos meses</span><span class="m85">HISTORIAL</span></div>
            <div class="m9x">
              <div class="m9y" style="position:relative">
                <div style="position:absolute;left:0;right:0;top:{{ Promediolinea }};border-top:1.5px dashed var(--at);z-index:1;pointer-events:none"></div>
                <sc-for list="{{ Mesbarras }}" as="Barrames" hint-placeholder-count="6">
                  <div class="m9z">
                    <div class="ma0"><div style="width:100%;height:{{ Barrames.Altura }};background:{{ Barrames.Fondo }};border-radius:6px;transition:height .6s cubic-bezier(.22,1,.36,1)"></div></div>
                    <span class="ma2">{{ Barrames.Etiqueta }}</span>
                  </div>
                </sc-for>
              </div>
            </div>
            <div class="m9h"><div class="m1j"><span>Promedio últimos 3 meses</span><span class="m9i">{{ Promediotres }}</span></div><div class="m1j"><span>Promedio últimos 6 meses</span><span class="m9i">{{ Promedioseis }}</span></div><div class="m1m"></div><div class="m1j"><span class="m9j">Flujo neto de este mes</span><span class="m9k">{{ Flujoneto }}</span></div></div>
            <div class="m8z"><span class="m2v">Ingresos fijos</span><span class="m85">TOTAL {{ Fijostotaltexto }}</span></div>
            <div class="mdl">
              <sc-for list="{{ Fijosfilas }}" as="Fuentefila" hint-placeholder-count="1">
                <div style="width:100%;padding:12px 14px;border-radius:18px;background:var(--cd);border:1px solid var(--ln);display:flex;align-items:center;gap:12px;box-sizing:border-box">
                  <div class="m90">{{ Fuentefila.Inicial }}</div>
                  <div class="m91"><span class="m92">{{ Fuentefila.Concepto }}</span><span class="m4k">{{ Fuentefila.Meta }}</span></div>
                  <span class="m46">{{ Fuentefila.Monto }}</span>
                  <sc-if value="{{ Fuentefila.Puedequitar }}"><button class="m2l" al-clic="{{ Fuentefila.Alquitar }}" aria-label="Quitar">×</button></sc-if>
                </div>
              </sc-for>
              <button class="mab" al-clic="{{ Abriringresofijo }}">+ Agregar ingreso fijo mensual</button>
            </div>
            </sc-if>
            <sc-if value="{{ Registroegreso }}" hint-placeholder-val="{{ false }}">
            <div class="m8s"><span class="m8t">Tus egresos de este mes</span><div class="m1t"><span class="m8u">$</span><span class="m8v">{{ Egresomestotal }}</span></div><div class="m8w"><div class="m8y"><div style="width:{{ Egresofijosancho }};background:var(--ik);border-radius:3px;height:100%"></div></div><div class="m8x" style="display:flex;justify-content:space-between;align-items:center"><span>Fijos {{ Egresofijostexto }}</span><span>Variables {{ Gastosmestexto }}</span></div></div></div>
            <div class="m8z"><span class="m2v">Cuotas fijas mensuales</span><span class="m85">DEUDAS</span></div>
            <div class="mdl">
              <sc-for list="{{ Deudafilasmes }}" as="Diafila" hint-placeholder-count="2">
                <div style="width:100%;padding:12px 14px;border-radius:18px;background:var(--cd);border:1px solid var(--ln);display:flex;align-items:center;gap:12px;box-sizing:border-box">
                  <button al-clic="{{ Diafila.Alternarpagada }}" style="width:24px;height:24px;border-radius:12px;border:2px solid {{ Diafila.Cajaborde }};background:{{ Diafila.Cajafondo }};display:flex;align-items:center;justify-content:center;flex:none;cursor:pointer"><sc-if value="{{ Diafila.Pagada }}"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--oa)" stroke-width="3"><path d="M5 12l5 5L20 7"></path></svg></sc-if></button>
                  <div class="m91"><span style="font:600 14px 'Hanken Grotesk',sans-serif;color:{{ Diafila.Color }};text-decoration:{{ Diafila.Decoracion }}">{{ Diafila.Nombreitem }}</span></div>
                  <span class="m46">{{ Diafila.Cuota }}</span>
                  <button class="mag" al-clic="{{ Diafila.Aleditar }}" aria-label="Editar deuda"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                </div>
              </sc-for>
              <button class="mab" al-clic="{{ Abrirhojadeuda }}">+ Agregar deuda o egreso fijo</button>
            </div>
            <div class="m8z"><span class="m2v">Gastos del día a día</span><span class="m85">ESTE MES</span></div>
            <div class="mak">
              <sc-for list="{{ Categoriafilas }}" as="Categoriafila" hint-placeholder-count="4"><div class="mal"><div class="mam"><span>{{ Categoriafila.Etiqueta }}</span><span class="m3e">{{ Categoriafila.Monto }}</span></div><div class="m4v"><div style="height:100%;width:{{ Categoriafila.Ancho }};background:var(--al);border-radius:4px;transition:width .6s cubic-bezier(.22,1,.36,1)"></div></div></div></sc-for>
              <button class="man" al-clic="{{ Abrirhojagasto }}">+ Registrar gasto</button>
            </div>
            </sc-if>
          </sc-if>
  
          <sc-if value="{{ Ingresoesanual }}" hint-placeholder-val="{{ false }}">
            <div class="m8s"><span class="m8t">Ingresos estimados 2026</span><div class="m1t"><span class="m8u">$</span><span class="mao">{{ Anualingresomillones }}</span><span class="m8i">M</span></div></div>
            <div class="map"><span class="m2c">Consolidado de 12 meses</span><div class="maq"><span>Ingresos fijos</span><span class="m9i">{{ Anualfijo }}</span><span>Ingresos variables (promedio)</span><span class="m9i">{{ Anualvariable }}</span><sc-if value="{{ Anualprestacional }}"><span>Primas (junio + diciembre)</span><span class="m9i">{{ Anualprima }}</span><span>Cesantías (se consignan en febrero)</span><span class="m9i">{{ Anualcesantias }}</span><span>Intereses de cesantías (12%)</span><span class="m9i">{{ Anualinterescesantias }}</span></sc-if><span class="m9j">Total del año</span><span class="m9k">{{ Anualtotal }}</span></div></div>
            <sc-if value="{{ Anualprestacional }}" hint-placeholder-val="{{ true }}"><div class="mar"><span class="m2c">¿Cuánto de primas y cesantías va a tu cuota inicial?</span><div class="m1w"><sc-for list="{{ Anualporcentajeopciones }}" as="Opcion" hint-placeholder-count="3"><button al-clic="{{ Opcion.Alclic }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ Opcion.Borde }};background:{{ Opcion.Fondo }};color:{{ Opcion.Color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ Opcion.Etiqueta }}</button></sc-for></div><div class="m4s"><span class="m3t">Aportas al año</span><span class="mas">{{ Anualaporte }}</span></div><span class="mat">{{ Anualaportemensaje }}</span><span class="m2f">Las cesantías se pueden retirar para comprar vivienda.</span></div></sc-if>
            <sc-if value="{{ Anualnoprestacional }}" hint-placeholder-val="{{ false }}"><div class="mar"><span class="m2c">Primas y cesantías</span><span class="mau">Solo aplican si tienes contrato laboral. Como independiente puedes ahorrar en una cuenta AFC o en el FNA.</span></div></sc-if>
            <div class="mar"><div class="m1j"><span class="m2c">¿Debes declarar renta?</span><span class="m42">AÑO GRAVABLE 2026</span></div><sc-for list="{{ Rentafilas }}" as="Filatabla" hint-placeholder-count="3"><div class="mal"><div class="mav"><span>{{ Filatabla.Etiqueta }}</span><span class="maw">{{ Filatabla.value }}</span></div><div class="m4v"><div style="height:100%;width:{{ Filatabla.Ancho }};background:{{ Filatabla.Fondo }};border-radius:4px"></div></div></div></sc-for><div style="padding:12px 14px;border-radius:16px;background:{{ Rentafondo }};font:600 13px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A">{{ Rentamensaje }}</div></div>
            <sc-if value="{{ Superatopepatrimonio }}" hint-placeholder-val="{{ false }}"><div style="margin-top:10px;padding:10px 12px;border-radius:14px;background:#FFD23F;font:600 12px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A">{{ Alertapatrimoniomensaje }}</div></sc-if>
            <div class="mar" style="margin-top:10px"><div class="m1j"><span class="m2c">Deducción de intereses de vivienda</span><span class="m42">ART. 119 E.T.</span></div><p class="m66" style="margin:4px 0 8px">{{ Ahorrorentamensaje }}</p><div class="max"><span class="may">i</span><span>Esta deducción reduce el impuesto de renta ante la DIAN, pero no incrementa la capacidad de crédito que te aprueba el banco.</span></div></div>
            <div class="max"><span class="may">i</span><span>Valores estimados con UVT 2026 de $52.374. Confirma tu obligación tributaria con un contador o directamente ante la DIAN.</span></div>
          </sc-if>
        </sc-if>

        <sc-if value="{{ Pestanaes.plan }}" hint-placeholder-val="{{ false }}">
          <div class="maz"><h1 class="m8l">{{ Plantitulo }}</h1></div>
          <div class="mc8"><sc-for list="{{ Plansegmentos }}" as="Segmentoplan" hint-placeholder-count="2"><button al-clic="{{ Segmentoplan.Alclic }}" style="border-radius:18px;background:{{ Segmentoplan.Fondo }};color:{{ Segmentoplan.Color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ Segmentoplan.Etiqueta }}</button></sc-for></div>
          <sc-if value="{{ Planesdeudas }}" hint-placeholder-val="{{ true }}">
          <div class="mc9" data-tutorial="plan">
            <span class="m8t">{{ Planinteres }}</span>
            <div class="mca"><span class="mcb">+$</span><span class="mcc">{{ Liberadomillones }}</span><span class="mbp">M</span></div>
            <span class="m8i">más de crédito</span>
            <div class="mcd">
              <div class="mce"><span class="m85">CUPO DE VIVIENDA</span><span class="m46">{{ Plancupo }}</span></div>
              <div class="mcf"><span class="m85">PUEDES CERRAR HOY</span><span class="m46">{{ Planhoy }}</span></div>
            </div>
          </div>
          <sc-if value="{{ Planmensajevisible }}" hint-placeholder-val="{{ false }}"><div style="margin:16px 14px 0;padding:14px 16px;border-radius:20px;background:{{ Planmensajefondo }};font:600 14px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A;text-wrap:pretty">{{ Planmensaje }}</div></sc-if>
          <sc-if value="{{ Saldovisible }}" hint-placeholder-val="{{ false }}"><div class="mcg">{{ Saldomensaje }}</div></sc-if>
          <div class="mch">
            <sc-for list="{{ Deudatarjetas }}" as="Deudatarjeta" hint-placeholder-count="3">
              <div style="width:100%;text-align:left;padding:12px 14px;border-radius:18px;background:{{ Deudatarjeta.Fondo }};border:1px solid {{ Deudatarjeta.Borde }};display:flex;flex-direction:column;gap:8px;box-sizing:border-box;transition:background .2s ease-out">
                <div class="mci" style="gap:8px">
                  <div class="m2a" al-clic="{{ Deudatarjeta.Alclic }}" style="cursor:pointer;flex:1;min-width:0">
                    <span style="font:600 15px 'Familjen Grotesk',sans-serif;color:{{ Deudatarjeta.Color }};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">{{ Deudatarjeta.Nombreitem }}</span>
                    <span style="font:400 12px 'Hanken Grotesk',sans-serif;color:{{ Deudatarjeta.Subtexto }}">{{ Deudatarjeta.detail }}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;flex:none">
                    <button al-clic="{{ Deudatarjeta.Aleditar }}" aria-label="Editar deuda" title="Editar deuda" style="width:28px;height:28px;border-radius:14px;background:{{ Deudatarjeta.Botonfondo }};border:1px solid {{ Deudatarjeta.Botonborde }};color:{{ Deudatarjeta.Color }};display:flex;align-items:center;justify-content:center;cursor:pointer"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                    <button al-clic="{{ Deudatarjeta.Aleliminar }}" aria-label="Eliminar deuda" title="Eliminar deuda" style="width:28px;height:28px;border-radius:14px;background:{{ Deudatarjeta.Botonfondo }};border:1px solid {{ Deudatarjeta.Botonborde }};color:var(--al);display:flex;align-items:center;justify-content:center;cursor:pointer"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    <div al-clic="{{ Deudatarjeta.Alclic }}" style="width:44px;height:26px;border-radius:13px;background:{{ Deudatarjeta.Riel }};position:relative;flex:none;transition:background .15s ease-out;cursor:pointer">
                      <div style="position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:10px;background:{{ Deudatarjeta.Perilla }};transform:{{ Deudatarjeta.Posicion }};transition:transform .18s ease-out"></div>
                    </div>
                  </div>
                </div>
                <div al-clic="{{ Deudatarjeta.Alclic }}" style="display:flex;justify-content:space-between;align-items:center;width:100%;border-top:1px solid {{ Deudatarjeta.Linea }};padding-top:7px;cursor:pointer;box-sizing:border-box">
                  <span style="font:500 10.5px 'IBM Plex Mono',monospace;color:{{ Deudatarjeta.Subtexto }};letter-spacing:.02em">{{ Deudatarjeta.Estadocomponente }}</span>
                  <span style="font:700 13px 'Familjen Grotesk',sans-serif;color:{{ Deudatarjeta.Color }};white-space:nowrap;margin-right:2px">{{ Deudatarjeta.Impacto }}</span>
                </div>
              </div>
            </sc-for>
            <button class="mcj" al-clic="{{ Abrirhojadeuda }}"><span class="mck">+</span>Agregar deuda o egreso fijo</button>
            <sc-if value="{{ Sindeudas }}" hint-placeholder-val="{{ false }}"><span class="mcl">No tienes deudas registradas. Agrega tus cuotas para que el cálculo sea igual al del banco.</span></sc-if>
          </div>
          <sc-if value="{{ Mostrarcartera }}" hint-placeholder-val="{{ false }}"><div class="mcm"><span class="mcn">{{ Carteramensaje }}</span><span class="mco">Una compra de cartera con una entidad bancaria podría bajar tus cuotas y liberar cupo hipotecario.</span></div></sc-if>
          <div class="m98">Por cada <b class="m3e">$100.000</b> de cuota que dejas de pagar, el banco te presta <b class="m6o">{{ Sensibilidadcreditomillones }}</b> más. Fórmula: cuota liberada × {{ Topeporcentaje }} × {{ Factorcorto }} (tasa {{ Tasaanualtexto }} a {{ Plazotexto }}).</div>
        <div class="max"><span class="may">i</span><span>Valores proyectados según políticas de riesgo de la Superintendencia Financiera. La aprobación definitiva depende del estudio del banco.</span></div>
          </sc-if>
          <sc-if value="{{ Planescuotainicial }}" hint-placeholder-val="{{ false }}">
            <div class="mc9">
              <span class="m8t">Para tu vivienda de {{ Cierreobjetivomillones }} te falta</span>
              <div class="mca"><span class="mcb">$</span><span class="mcq">{{ Cierrefaltamillones }}</span><span class="mbp">M</span></div>
              <div class="mcr"><div style="height:100%;width:{{ Cierreancho }};background:var(--ac);border-radius:6px;transition:width .6s cubic-bezier(.22,1,.36,1)"></div></div>
              <div class="mcs"><span>TIENES {{ Cierretengomillones }}</span><span>META {{ Cierretotalmillones }}</span></div>
            </div>
            <div class="mct"><span class="m2c">Tu meta de cuota inicial</span><div class="maq"><span>Vivienda que buscas</span><span class="m9i">{{ Cierreobjetivotexto }}</span><span>− Crédito del banco ({{ Porcentajefinanciado }})</span><span class="m9i">{{ Cierrecreditotexto }}</span><span>= Cuota inicial</span><span class="m9i">{{ Cierrecuotainicialtexto }}</span><span>+ {{ Gastosetiqueta }}</span><span class="m9i">{{ Cierregastostexto }}</span><span>− Ahorro + subsidio</span><span class="m9i">{{ Cierretengotexto }}</span><span class="m9j">Te falta</span><span class="m9k">{{ Cierrefaltatexto }}</span></div><sc-if value="{{ Cierrecupocorto }}" hint-placeholder-val="{{ false }}"><span class="mcu">{{ Cierrecupomensaje }}</span></sc-if></div>
            <div class="mar"><span class="m2c">¿En cuánto tiempo la quieres?</span><div class="m1w"><sc-for list="{{ Cierreplazos }}" as="Opcion" hint-placeholder-count="3"><button al-clic="{{ Opcion.Alclic }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ Opcion.Borde }};background:{{ Opcion.Fondo }};color:{{ Opcion.Color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ Opcion.Etiqueta }}</button></sc-for></div><div class="m4s"><span class="m3t">Debes ahorrar al mes</span><span class="mcv">{{ Cierremensual }}</span></div><div style="padding:12px 14px;border-radius:16px;background:{{ Cierremensajefondo }};font:600 13px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A">{{ Cierremensaje }}</div></div>
            <button class="mcw" al-clic="{{ Iranual }}"><span class="mcx">{{ Cierreprimasmensaje }}</span><span class="m58">Mi Año →</span></button>
            <sc-if value="{{ Mostraranuncios }}" hint-placeholder-val="{{ true }}"><div class="mar"><div class="mcy"><span class="m42">AHORRO · CUENTA AFC</span></div><span class="mcz">Ahorra tu cuota inicial en una cuenta AFC</span><span class="md0">Los aportes que uses para comprar vivienda pueden ser renta exenta, con los límites que fija la ley. Puedes abrirla en tu banco habitual.</span></div></sc-if>
            <div class="max"><span class="may">i</span><span>Valores proyectados según políticas de riesgo de la Superintendencia Financiera. La aprobación definitiva depende del estudio del banco.</span></div>
          </sc-if>
        </sc-if>
  
        <sc-if value="{{ Pestanaes.ofertas }}" hint-placeholder-val="{{ false }}">
          <div class="maz"><h1 class="m8l">Ofertas</h1></div>
          <div class="md2">Tu cupo es de <b class="m3e">\${{ Preciodestacado }} M</b> y hoy puedes cerrar hasta <b class="m6o">{{ Preciohoymillones }}</b>.</div>
          <div class="md3" data-tutorial="ofertas">
            <span class="md4"><span class="md5"></span>Puedes cerrar hoy</span>
            <span class="md4"><span class="md6"></span>Te alcanza el cupo, falta cuota inicial</span>
            <span class="md4"><span class="md7"></span>Supera tu cupo</span>
          </div>
          <div class="md8">
            <div class="m8k"><span class="m6c">MOSTRANDO CIUDADES</span><sc-if value="{{ Ofertaspersonalizadas }}" hint-placeholder-val="{{ false }}"><button class="md9" al-clic="{{ Ofertasreiniciar }}">Restablecer</button></sc-if></div>
            <div class="mb5">
              <sc-for list="{{ Ofertasfichas }}" as="Ofertaficha" hint-placeholder-count="1"><div style="height:36px;padding:0 4px 0 13px;border-radius:18px;background:{{ Ofertaficha.Fondo }};color:{{ Ofertaficha.Color }};display:flex;align-items:center;gap:6px"><span class="mda">{{ Ofertaficha.Etiqueta }}</span><button al-clic="{{ Ofertaficha.Alquitar }}" aria-label="Quitar ciudad" style="width:28px;height:28px;border-radius:14px;background:{{ Ofertaficha.Fondox }};color:{{ Ofertaficha.Color }};font:600 14px 'Familjen Grotesk',sans-serif;display:flex;align-items:center;justify-content:center">×</button></div></sc-for>
              <button class="mdb" al-clic="{{ Alternarofertasagregar }}">{{ Ofertasagregaretiqueta }}</button>
            </div>
            <sc-if value="{{ Ofertasagregarabierto }}" hint-placeholder-val="{{ false }}">
              <div class="m48">
                <div class="mdc"><svg class="m4a" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg><input maxlength="40" class="m4b" value="{{ Ofertasbusqueda }}" al-escribir="{{ Escribirofertasbusqueda }}" autoFocus="{{ true }}" placeholder="Buscar ciudad" aria-label="Buscar ciudad"></div>
                <div class="mt-scroll mdd">
                  <sc-for list="{{ Ofertasagregarlista }}" as="Ciudadagregar" hint-placeholder-count="5"><button class="mde" al-clic="{{ Ciudadagregar.Alclic }}"><span class="m45"><span class="m92">{{ Ciudadagregar.Nombreitem }}</span><span class="m47">{{ Ciudadagregar.Departamento }}</span></span><span style="font:500 10px 'IBM Plex Mono',monospace;color:{{ Ciudadagregar.Cantidadcolor }};white-space:nowrap">{{ Ciudadagregar.Cantidad }}</span><span class="m8i">+</span></button></sc-for>
                  <sc-if value="{{ Ofertasagregarvacio }}" hint-placeholder-val="{{ false }}"><div class="mdf">No encontramos esa ciudad.</div></sc-if>
                </div>
              </div>
            </sc-if>
          </div>
          <sc-if value="{{ Ofertasninguna }}" hint-placeholder-val="{{ false }}"><div class="mdg">Agrega al menos una ciudad para ver proyectos.</div></sc-if>
          <div class="max"><span class="may">i</span><span>Precios de referencia. Tu aprobación final depende del estudio de crédito del banco.</span></div>
          <sc-for list="{{ Ofertasgrupos }}" as="Grupooferta" hint-placeholder-count="1">
            <div class="mdh"><span class="mdi">{{ Grupooferta.Ciudaditem }}</span><sc-if value="{{ Grupooferta.Inicio }}"><span class="mdj">TU CIUDAD</span></sc-if><span class="mdk"></span><span class="m85">{{ Grupooferta.Cantidad }}</span></div>
            <div class="mdl">
              <sc-for list="{{ Grupooferta.Items }}" as="Proyectofila" hint-placeholder-count="2">
              <div class="mdm">
                <div class="mdn"><div role="img" aria-label="{{ Proyectofila.Nombre }}" style="position:absolute;inset:0;background-image:{{ Proyectofila.Imagenfondo }};background-size:cover;background-position:center"></div><div class="mdo"></div><span class="mdp">{{ Proyectofila.Area }}</span><span style="position:absolute;right:12px;bottom:10px;font:600 11px 'IBM Plex Mono',monospace;padding:4px 8px;border-radius:10px;background:{{ Proyectofila.Etiquetafondo }};color:{{ Proyectofila.Etiquetacolor }}">{{ Proyectofila.Ajuste }}</span></div>
                <div class="mdq">
                  <div class="m4s"><span class="m46">{{ Proyectofila.Nombre }}</span><span class="mdr">{{ Proyectofila.Precio }}</span></div>
                  <span class="m4k">{{ Proyectofila.Meta }}</span>
                  <button class="mds" al-clic="{{ Proyectofila.Alinteres }}">Me interesa</button>
                </div>
              </div>
            </sc-for>
              <sc-if value="{{ Grupooferta.Vacio }}"><div class="mdt">{{ Grupooferta.Vaciomensaje }}</div></sc-if>
            </div>
          </sc-for>
        </sc-if>
`;

