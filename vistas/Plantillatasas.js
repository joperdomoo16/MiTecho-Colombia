// Plantilla de "Tasas por banco": dos cifras por entidad, una barra para leer de un vistazo y el detalle al tocar

const Plantillatasas = `
      <sc-if value="{{ Estasas }}" hint-placeholder-val="{{ false }}">
        <div class="mt-scroll m3l">
          <div class="m3m"><button class="m3n" al-clic="{{ Cerrarpanel }}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>Volver</button><span class="m3o">TASAS POR BANCO · PRO</span></div>
          <div style="margin:14px 18px 0;display:flex;flex-direction:column;gap:4px">
            <h2 class="mee" style="margin:0">Tasas por banco</h2>
            <span class="m3t">{{ Tasasfuente }}</span>
          </div>
          <sc-if value="{{ Tasassindatos }}" hint-placeholder-val="{{ false }}">
            <p class="m3t" style="margin:18px 18px 0;line-height:1.5">Aún no tenemos las tasas de la Superintendencia en este celular. Conéctate a internet y vuelve a abrir esta sección.</p>
          </sc-if>
          <sc-if value="{{ Tasasdisponibles }}" hint-placeholder-val="{{ true }}">
            <div style="position:relative;margin-top:14px">
              <div style="filter:{{ Tasasdesenfoque }};pointer-events:{{ Tasaseventos }};display:flex;flex-direction:column;gap:12px;padding:0 14px">
                <div data-tutorial="oferta" style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><sc-for list="{{ Tasasmodos }}" as="Modo" hint-placeholder-count="2"><button type="button" al-clic="{{ Modo.Alclic }}" style="height:40px;border-radius:20px;border:1px solid {{ Modo.Borde }};background:{{ Modo.Fondo }};color:{{ Modo.Color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ Modo.Etiqueta }}</button></sc-for></div>
                <div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px"><sc-for list="{{ Tasasproductos }}" as="Producto" hint-placeholder-count="4"><button type="button" al-clic="{{ Producto.Alclic }}" style="flex:none;height:32px;padding:0 12px;border-radius:16px;border:1px solid {{ Producto.Borde }};background:{{ Producto.Fondo }};color:{{ Producto.Color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ Producto.Etiqueta }}</button></sc-for></div>
                <span class="m4k">{{ Tasasresumen }}</span>

                <sc-if value="{{ Tasasmodoperfil }}" hint-placeholder-val="{{ true }}">
                  <div style="display:flex;flex-direction:column;background:var(--cd);border:1px solid var(--ln);border-radius:22px;overflow:hidden">
                    <div style="display:flex;justify-content:space-between;gap:10px;padding:12px 16px;border-bottom:1px solid var(--ln)"><span class="m42">{{ Tasasorden }}</span></div>
                    <sc-for list="{{ Tasasfilas }}" as="Fila" hint-placeholder-count="5">
                      <button type="button" al-clic="{{ Fila.Alternar }}" aria-expanded="{{ Fila.Abiertaetiqueta }}" style="display:flex;flex-direction:column;gap:8px;padding:14px 16px;border-bottom:1px solid var(--ln);text-align:left;width:100%;background:none">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;width:100%">
                          <span style="font:600 14.5px 'Familjen Grotesk',sans-serif;color:var(--ik);min-width:0">{{ Fila.Nombre }}</span>
                          <span style="font:600 15px 'IBM Plex Mono',monospace;color:var(--ik);white-space:nowrap">{{ Fila.Cuota }}<small style="font:500 11px 'Hanken Grotesk',sans-serif;color:var(--mu)">/mes</small></span>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;width:100%">
                          <span style="flex:none;width:92px;font:500 12px 'IBM Plex Mono',monospace;color:var(--mu)">{{ Fila.Tasa }}</span>
                          <div style="position:relative;flex:1;height:6px;border-radius:3px;background:var(--c2)">
                            <span aria-hidden="true" style="position:absolute;top:-4px;bottom:-4px;left:{{ Tasasmercadopunto }};width:2px;background:var(--mu);border-radius:1px"></span>
                            <span aria-hidden="true" style="position:absolute;top:50%;left:{{ Fila.Punto }};width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:6px;background:var(--ac)"></span>
                          </div>
                        </div>
                        <sc-if value="{{ Fila.Tienemarca }}" hint-placeholder-val="{{ false }}"><span style="align-self:flex-start;padding:2px 8px;border-radius:8px;background:var(--c2);font:600 10.5px 'IBM Plex Mono',monospace;color:var(--mu)">{{ Fila.Marca }}</span></sc-if>
                        <sc-if value="{{ Fila.Expandida }}" hint-placeholder-val="{{ false }}">
                          <div style="display:grid;grid-template-columns:1fr auto;gap:6px 12px;width:100%;padding-top:6px;border-top:1px dashed var(--ln);font:400 12.5px/1.4 'Hanken Grotesk',sans-serif;color:var(--mu)">
                            <span>Rango de tasas</span><span style="color:var(--ik)">{{ Fila.Rango }}</span>
                            <span>Datos</span><span style="color:var(--ik)">{{ Fila.Creditos }}</span>
                            <span>Te prestaría hasta</span><span style="color:var(--ik)">{{ Fila.Prestamo }}</span>
                            <span>Total pagado</span><span style="color:var(--ik)">{{ Fila.Total }}</span>
                            <span style="grid-column:1/-1;color:var(--at)">{{ Fila.Comparacion }}</span>
                          </div>
                        </sc-if>
                      </button>
                    </sc-for>
                    <span style="padding:10px 16px;font:400 11.5px 'Hanken Grotesk',sans-serif;color:var(--mu)">La línea vertical es el promedio del mercado. {{ Tasasmercadotexto }}</span>
                  </div>
                </sc-if>

                <sc-if value="{{ Tasasmodooferta }}" hint-placeholder-val="{{ false }}">
                  <div style="display:flex;flex-direction:column;gap:12px;background:var(--cd);border:1px solid var(--ln);border-radius:22px;padding:16px">
                    <label style="display:flex;flex-direction:column;gap:6px"><span class="m42">TASA QUE TE OFRECIERON (% E.A.)</span>
                      <input class="my" value="{{ Tasasofertavalor }}" al-escribir="{{ Escribirtasaoferta }}" inputMode="decimal" placeholder="Ej. 13,5" aria-label="Tasa que te ofrecieron" style="width:100%"></label>
                    <sc-if value="{{ Tasasofertalista }}" hint-placeholder-val="{{ false }}">
                      <div style="position:relative;height:6px;border-radius:3px;background:var(--c2);margin:8px 0 4px">
                        <span aria-hidden="true" style="position:absolute;top:-4px;bottom:-4px;left:{{ Tasasmercadopunto }};width:2px;background:var(--mu)"></span>
                        <span aria-hidden="true" style="position:absolute;top:50%;left:{{ Tasasofertapunto }};width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:7px;background:var(--ac)"></span>
                      </div>
                      <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="m3t">Tu cuota con esa tasa</span><span style="font:600 18px 'IBM Plex Mono',monospace;color:var(--ik)">{{ Tasasofertacuota }}</span></div>
                      <p style="margin:0;font:500 13px/1.5 'Hanken Grotesk',sans-serif;color:var(--ik)">{{ Tasasofertamensaje }}</p>
                    </sc-if>
                    <span style="font:400 11.5px 'Hanken Grotesk',sans-serif;color:var(--mu)">{{ Tasasmercadotexto }}</span>
                  </div>
                </sc-if>

                <div style="display:flex;flex-direction:column;gap:8px;padding:4px 4px 0">
                  <p style="margin:0;font:400 11.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--mu)">{{ Tasasavisooficial }}</p>
                  <p style="margin:0;font:400 11.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--mu)"><b style="color:var(--ik)">Vivienda nueva o usada.</b> La mayoría de entidades financia vivienda nueva y usada, pero algunas líneas de crédito y subsidios tienen restricciones (por ejemplo, Mi Casa Ya se orienta a vivienda nueva y solo en algunos casos aplica a usada, y algunas entidades limitan la antigüedad del inmueble). Las tasas de esta sección incluyen créditos de vivienda nueva y usada. <b style="color:var(--ik)">Antes de decidir, verifica estas condiciones con la entidad con la que te interesa financiar.</b></p>
                  <p style="margin:0;font:400 11.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--mu)">{{ Tasasavisocuota }}</p>
                </div>
              </div>
              <sc-if value="{{ Tasassinpro }}" hint-placeholder-val="{{ false }}">
                <div style="position:absolute;left:14px;right:14px;top:96px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;background:var(--cd);border:1px solid var(--ln);border-radius:24px;padding:20px 18px;box-shadow:0 18px 40px rgba(0,0,0,.35)">
                  <span style="padding:3px 8px;border-radius:6px;background:#FFD23F;color:#0B0C0A;font:700 10px 'IBM Plex Mono',monospace;letter-spacing:.06em">PRO</span>
                  <span style="font:700 17px/1.3 'Familjen Grotesk',sans-serif;color:var(--ik)">Compara tu cuota en cada entidad con datos de la Superintendencia</span>
                  <button type="button" al-clic="{{ Abrirprodesdetasas }}" style="height:46px;padding:0 22px;border-radius:23px;background:var(--ac);color:var(--oa);font:700 14px 'Familjen Grotesk',sans-serif">Conocer MiTecho Pro</button>
                </div>
              </sc-if>
            </div>
          </sc-if>
        </div>
      </sc-if>
`;
