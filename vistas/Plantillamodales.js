// Plantilla de las ventanas desplegables de registro diario, soporte técnico y avisos en pantalla

const Plantillamodales = `
<div class="mdy">
          <sc-for list="{{ sheetKinds }}" as="sk" hint-placeholder-count="2"><button onClick="{{ sk.onClick }}" style="border-radius:20px;background:{{ sk.bg }};color:{{ sk.color }};font:700 14px 'Familjen Grotesk',sans-serif;transition:background .15s ease-out">{{ sk.label }}</button></sc-for>
        </div>
        <div class="m8m"><sc-for list="{{ sheetFreqs }}" as="sf" hint-placeholder-count="2"><button onClick="{{ sf.onClick }}" style="height:40px;border-radius:20px;border:1px solid {{ sf.border }};background:{{ sf.bg }};color:{{ sf.color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ sf.label }}</button></sc-for></div>
        <sc-if value="{{ sheetIngFijo }}" hint-placeholder-val="{{ false }}"><div class="m2z">
          <div class="m50"><span class="m6c">TIPO DE INGRESO FIJO</span><div class="m1w"><sc-for list="{{ fiTipoChips }}" as="c" hint-placeholder-count="4"><button onClick="{{ c.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ c.border }};background:{{ c.bg }};color:{{ c.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ c.label }}</button></sc-for></div></div><sc-if value="{{ fiOtro }}" hint-placeholder-val="{{ false }}"><label class="mdz"><span class="m42">NOMBRE (OPCIONAL)</span><input class="me0" value="{{ fiNombre }}" onInput="{{ onFiNombre }}" maxLength="{{ 40 }}" placeholder="Ej. Renta de parqueadero" aria-label="Nombre opcional"></label></sc-if>
          <div class="m79"><span class="m6c">MONTO MENSUAL</span><div class="me1"><span class="m8u">$</span><input class="me2" value="{{ fiMontoTxt }}" onInput="{{ onFiMonto }}" inputMode="numeric" placeholder="0" aria-label="Monto mensual"></div></div>
          <span class="m2f">{{ fiHint }}</span>
          <sc-if value="{{ formError }}" hint-placeholder-val="{{ false }}"><span class="me3">{{ formError }}</span></sc-if>
          <button class="m3j" onClick="{{ saveFixedIncome }}">{{ fiSaveLabel }}</button>
        </div></sc-if>
        <sc-if value="{{ sheetEgrDia }}" hint-placeholder-val="{{ false }}"><div class="m2z">
          <div class="me1"><span class="m9g">−$</span><input class="me2" value="{{ exMontoTxt }}" onInput="{{ onExMonto }}" inputMode="numeric" placeholder="0" aria-label="Monto del gasto"></div>
          <div class="m50"><span class="m6c">CATEGORÍA</span><div class="m1w"><sc-for list="{{ exCatChips }}" as="c" hint-placeholder-count="4"><button onClick="{{ c.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ c.border }};background:{{ c.bg }};color:{{ c.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ c.label }}</button></sc-for></div></div><sc-if value="{{ exOtro }}" hint-placeholder-val="{{ false }}"><label class="mdz"><span class="m42">NOMBRE (OPCIONAL)</span><input class="me0" value="{{ exNombre }}" onInput="{{ onExNombre }}" maxLength="{{ 40 }}" placeholder="Ej. Regalo de cumpleaños" aria-label="Nombre opcional"></label></sc-if>
          <div class="m50"><span class="m6c">PAGASTE CON</span><div class="m1w"><sc-for list="{{ exMedioChips }}" as="c" hint-placeholder-count="4"><button onClick="{{ c.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ c.border }};background:{{ c.bg }};color:{{ c.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ c.label }}</button></sc-for></div></div>
          <span class="m2f">Los gastos del día no cambian tu cupo hipotecario; sí lo que te queda para ahorrar.</span>
          <sc-if value="{{ formError }}" hint-placeholder-val="{{ false }}"><span class="me3">{{ formError }}</span></sc-if>
          <button class="me4" onClick="{{ saveExpense }}">{{ exSaveLabel }}</button>
        </div></sc-if>
        <sc-if value="{{ sheetEgrFijo }}" hint-placeholder-val="{{ false }}">
          <div class="m2z">
            <div class="m50"><span class="m6c">TIPO</span><div class="m1w"><sc-for list="{{ debtTypeChips }}" as="dt" hint-placeholder-count="6"><button onClick="{{ dt.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ dt.border }};background:{{ dt.bg }};color:{{ dt.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ dt.label }}</button></sc-for></div></div><sc-if value="{{ dfOtro }}" hint-placeholder-val="{{ false }}"><label class="mdz"><span class="m42">NOMBRE (OPCIONAL)</span><input class="me0" value="{{ dfNombre }}" onInput="{{ onDfNombre }}" maxLength="{{ 40 }}" placeholder="Ej. Cuota del gimnasio" aria-label="Nombre opcional"></label></sc-if>
            <div class="me5"><span class="m6c">CUOTA MENSUAL</span><div class="m1t"><span class="me6">$</span><input class="me7" value="{{ dfCuotaTxt }}" onInput="{{ onDfCuota }}" inputMode="numeric" placeholder="0" aria-label="Cuota mensual"></div></div>
            <div class="m5c">
              <label class="me8"><span class="m42">SALDO PENDIENTE</span><input class="me9" value="{{ dfSaldoTxt }}" onInput="{{ onDfSaldo }}" inputMode="numeric" placeholder="$0" aria-label="Saldo"></label>
              <label class="me8"><span class="m42">ENTIDAD (OPCIONAL)</span><input class="mea" value="{{ dfEntidad }}" onInput="{{ onDfEntidad }}" placeholder="Ej. Bancolombia" aria-label="Entidad"></label>
            </div>
            <span class="m2f">{{ dfHint }}</span>
            <sc-if value="{{ formError }}" hint-placeholder-val="{{ false }}"><span class="me3">{{ formError }}</span></sc-if>
            <button class="meb" onClick="{{ saveDebt }}">{{ saveDebtLabel }}</button>
            <sc-if value="{{ dfIsEditing }}" hint-placeholder-val="{{ false }}">
              <button onClick="{{ deleteCurrentDebt }}" style="height:46px;border-radius:23px;background:rgba(255,106,43,.1);border:1px solid rgba(255,106,43,.3);color:var(--al);font:600 14px 'Familjen Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Eliminar esta deuda
              </button>
            </sc-if>
          </div>
        </sc-if>
        <sc-if value="{{ sheetIngDia }}" hint-placeholder-val="{{ true }}"><div class="m2z">
        <div class="me1"><span class="m8u">$</span><input class="mec" value="{{ formMontoTxt }}" onInput="{{ onMonto }}" inputMode="numeric" placeholder="0" aria-label="Monto"></div>
        <div class="m1w"><sc-for list="{{ quickChips }}" as="q" hint-placeholder-count="4"><button class="med" onClick="{{ q.onClick }}">{{ q.label }}</button></sc-for></div>
        <div class="m50"><span class="m6c">FUENTE</span><div class="m1w"><sc-for list="{{ fuenteChips }}" as="f" hint-placeholder-count="6"><button onClick="{{ f.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ f.border }};background:{{ f.bg }};color:{{ f.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ f.label }}</button></sc-for></div></div><sc-if value="{{ ingOtro }}" hint-placeholder-val="{{ false }}"><label class="mdz"><span class="m42">NOMBRE (OPCIONAL)</span><input class="me0" value="{{ ingNombre }}" onInput="{{ onIngNombre }}" maxLength="{{ 40 }}" placeholder="Ej. Venta de postres" aria-label="Nombre opcional"></label></sc-if>
        <div class="m50"><span class="m6c">LO RECIBISTE POR</span><div class="m1w"><sc-for list="{{ medioChips }}" as="md" hint-placeholder-count="3"><button onClick="{{ md.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ md.border }};background:{{ md.bg }};color:{{ md.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ md.label }}</button></sc-for></div></div>
        <sc-if value="{{ formError }}" hint-placeholder-val="{{ false }}"><span class="me3">{{ formError }}</span></sc-if>
        <button class="m3j" onClick="{{ saveEntry }}">{{ saveLabel }}</button>
        </div></sc-if>
      </div>
      </sc-if>

      <sc-if value="{{ hasCs }}" hint-placeholder-val="{{ false }}">
        <div onClick="{{ closeConsign }}" style="position:absolute;inset:0;background:rgba(0,0,0,.55);opacity:{{ csFade }};pointer-events:{{ csPE }};transition:opacity .2s ease-out;z-index:54"></div>
        <div style="position:absolute;left:0;right:0;bottom:0;background:var(--cd);border-radius:32px 32px 0 0;border-top:1px solid var(--ln);padding:10px 18px 30px;transform:{{ csY }};transition:transform .32s cubic-bezier(.22,1,.36,1);z-index:55;display:{{ csDisplay }};flex-direction:column;gap:16px">
          <div class="mdx"></div>
          <div class="m8k"><span class="mej">EFECTIVO SIN CONSIGNAR</span><button class="m55" onClick="{{ closeConsign }}">Cerrar</button></div>
          <div class="m79"><span class="mee">Marcar como consignado</span><span class="m3t">{{ csConcept }}</span></div>
          <div class="m1t"><span class="mek">$</span><span class="mel">{{ csAmt }}</span></div>
          <div class="m50"><span class="m6c">¿A DÓNDE LO CONSIGNASTE?</span>
            <div class="m5c"><sc-for list="{{ csOpts }}" as="o" hint-placeholder-count="2"><button onClick="{{ o.onClick }}" style="min-height:76px;padding:12px 14px;border-radius:20px;border:1px solid {{ o.border }};background:{{ o.bg }};text-align:left;display:flex;flex-direction:column;justify-content:space-between;gap:8px;transition:background .15s ease-out"><span style="width:22px;height:22px;border-radius:11px;border:2px solid {{ o.ring }};display:flex;align-items:center;justify-content:center;box-sizing:border-box"><span style="width:9px;height:9px;border-radius:5px;background:{{ o.dot }}"></span></span><span style="font:600 14px 'Familjen Grotesk',sans-serif;color:{{ o.color }}">{{ o.label }}</span></button></sc-for></div>
          </div>
          <span class="md0">Al consignarlo aparece en tus extractos y el banco lo cuenta como ingreso.</span>
          <button class="m3j" onClick="{{ confirmConsign }}">Ya lo consigné</button>
        </div>
      </sc-if>

      <sc-if value="{{ hasMenu }}" hint-placeholder-val="{{ false }}">
        <div onClick="{{ closeMenu }}" style="position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:{{ menuFade }};pointer-events:{{ menuPE }};transition:opacity .2s ease-out;z-index:52"></div>
        <div style="position:absolute;top:104px;right:14px;width:284px;background:var(--cd);border:1px solid var(--ln);border-radius:28px;padding:8px;box-shadow:0 24px 48px -16px rgba(0,0,0,.55);z-index:53;transform-origin:top right;transform:{{ menuScale }};opacity:{{ menuFade }};pointer-events:{{ menuPE }};transition:transform .24s cubic-bezier(.22,1,.36,1),opacity .15s ease-out;display:{{ menuDisplay }};flex-direction:column;gap:2px;box-sizing:border-box">
        <input type="file" id="mt-avatar-input" accept="image/*" style="display:none" onchange="{{ onAvatarFileChange }}">
        <div class="mem">
          <div style="position:relative;flex:none">
            <sc-if value="{{ isProUser }}" hint-placeholder-val="{{ false }}">
              <div style="position:absolute;top:-6px;left:50%;transform:translateX(-50%);padding:1px 5px;border-radius:4px;background:#FFD23F;color:#0B0C0A;font:700 7.5px/1 'IBM Plex Mono',monospace;letter-spacing:.05em;box-shadow:0 2px 4px rgba(0,0,0,.35);white-space:nowrap;z-index:2;pointer-events:none">
                PRO
              </div>
            </sc-if>
            <div class="men" onClick="{{ triggerPhotoUpload }}" title="Cambiar foto de perfil" style="overflow:hidden;position:relative;background:{{ avatarBg }};color:{{ avatarFg }};cursor:pointer;border:{{ avatarBorderSm }};box-sizing:border-box">
              <sc-if value="{{ hasAvatarImg }}" hint-placeholder-val="{{ false }}"><img src="{{ avatarUrl }}" alt="Foto" style="width:100%;height:100%;object-fit:cover;display:block"></sc-if>
              <sc-if value="{{ noAvatarImg }}" hint-placeholder-val="{{ true }}">{{ initials }}</sc-if>
            </div>
            <button onClick="{{ triggerPhotoUpload }}" aria-label="Cambiar foto" title="Cambiar foto" style="position:absolute;bottom:-2px;right:-2px;width:20px;height:20px;border-radius:10px;background:var(--ik);color:var(--bg);border:1.5px solid var(--cd);display:flex;align-items:center;justify-content:center;cursor:pointer">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </button>
          </div>
          <div class="meo" style="flex:1;min-width:0">
            <span class="m46" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ fullName }}</span>
            <span class="m4k">{{ ciudad }} · Ingreso {{ tipoLower }}</span>
            <button onClick="{{ triggerPhotoUpload }}" style="margin-top:3px;padding:0;background:none;border:none;font:600 11.5px 'Familjen Grotesk',sans-serif;color:var(--at);cursor:pointer;text-align:left">
              Cambiar foto de perfil
            </button>
          </div>
        </div>
        <sc-for list="{{ menuItems }}" as="mi" hint-placeholder-count="6">
          <button onClick="{{ mi.onClick }}" style="min-height:50px;padding:6px 10px;border-radius:18px;display:flex;align-items:center;gap:12px;text-align:left;background:{{ mi.bg }};color:{{ mi.color }}">
            <span style="width:34px;height:34px;border-radius:17px;background:{{ mi.iconBg }};display:flex;align-items:center;justify-content:center;flex:none"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{ mi.icon }}"></path></svg></span>
            <span class="m45"><span class="mep">{{ mi.label }}</span><sc-if value="{{ mi.sub }}"><span class="meq">{{ mi.sub }}</span></sc-if></span>
            <span class="mer">{{ mi.right }}</span>
          </button>
        </sc-for>
        <div class="mes"><img class="met" src="assets/logo-app.png" alt=""><div class="meu"><span class="m4t">MiTecho</span><span class="mev">VERSIÓN OFICIAL 2026 · COLOMBIA</span></div><div class="mew"><div class="mg"></div><div class="mh"></div><div class="mi"></div></div></div>
      </div>
      </sc-if>
      <sc-if value="{{ hasSupportModal }}" hint-placeholder-val="{{ false }}">
        <div onClick="{{ closeSupportModal }}" style="position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:{{ supBackdropOpacity }};display:{{ supBackdropDisplay }};z-index:56;transition:opacity .25s ease-out"></div>
        <div class="mt-sheet" style="position:absolute;left:0;right:0;bottom:0;background:var(--cd);border-radius:32px 32px 0 0;border-top:1px solid var(--ln);padding:12px 18px 30px;z-index:57;display:{{ supDisplay }};flex-direction:column;gap:14px;max-height:88dvh;overflow-y:auto;box-sizing:border-box;transform:{{ supTransform }};transition:{{ supTransition }};touch-action:pan-y">
          <div onTouchStart="{{ onSupTouchStart }}" onTouchMove="{{ onSupTouchMove }}" onTouchEnd="{{ onSupTouchEnd }}" style="display:flex;flex-direction:column;align-items:center;padding:4px 0 8px;margin:-4px -18px 0;cursor:grab;touch-action:none">
            <div class="mdx"></div>
          </div>
          <div style="display:flex;justify-content:flex-end;align-items:center">
            <button class="m55" onClick="{{ closeSupportModal }}">Cerrar</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:3px">
            <span class="mee">Contáctanos</span>
            <span class="m3t">Completa tus datos y descríbenos tu consulta o reporte técnico.</span>
          </div>
          <sc-if value="{{ supFormVisible }}" hint-placeholder-val="{{ true }}">
            <div style="display:flex;flex-direction:column;gap:11px">
              <label style="display:flex;flex-direction:column;gap:5px">
                <span class="m42">NOMBRE COMPLETO (MÍN. 6 CARACTERES)</span>
                <input class="my" value="{{ supNombreVal }}" onInput="{{ onSupNombre }}" type="text" placeholder="Ej. Carlos Rodríguez" aria-label="Nombre completo" style="width:100%">
              </label>
              <label style="display:flex;flex-direction:column;gap:5px">
                <span class="m42">CORREO ELECTRÓNICO</span>
                <input class="my" value="{{ supEmailVal }}" onInput="{{ onSupEmail }}" type="email" placeholder="nombre@correo.com" aria-label="Correo electrónico" style="width:100%">
              </label>
              <label style="display:flex;flex-direction:column;gap:5px">
                <span class="m42">ASUNTO (MÍN. 6 CARACTERES)</span>
                <input class="my" value="{{ supAsuntoVal }}" onInput="{{ onSupAsunto }}" type="text" placeholder="Ej. Problema al iniciar sesión" aria-label="Asunto" style="width:100%">
              </label>
              <label style="display:flex;flex-direction:column;gap:5px">
                <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
                  <span class="m42">DESCRIPCIÓN DETALLADA</span>
                  <span style="font:500 10px 'IBM Plex Mono',monospace;color:{{ supDescColor }}">{{ supDescCount }}</span>
                </div>
                <textarea value="{{ supDescVal }}" onInput="{{ onSupDesc }}" rows="4" maxLength="500" placeholder="Cuéntanos en detalle en qué podemos ayudarte o qué fallo encontraste (mínimo 20 caracteres)..." aria-label="Descripción" style="width:100%;min-height:92px;border-radius:16px;border:1px solid var(--ln);background:var(--c2);padding:12px 14px;outline:none;font:500 14.5px/1.4 'Hanken Grotesk',sans-serif;color:var(--ik);box-sizing:border-box;resize:none"></textarea>
              </label>
              <sc-if value="{{ supErr }}" hint-placeholder-val="{{ false }}">
                <span class="mz">{{ supErr }}</span>
              </sc-if>
              <button class="m3j" onClick="{{ submitSupportForm }}" style="width:100%;margin-top:2px">{{ supBtnText }}</button>
            </div>
          </sc-if>
          <sc-if value="{{ supSentVisible }}" hint-placeholder-val="{{ false }}">
            <div style="display:flex;flex-direction:column;gap:14px;padding:6px 0 4px">
              <div style="background:rgba(46,204,113,.12);border:1px solid rgba(46,204,113,.45);border-radius:22px;padding:18px 16px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px">
                <div style="width:44px;height:44px;border-radius:22px;background:rgba(46,204,113,.2);color:#2ECC71;display:flex;align-items:center;justify-content:center;font:700 22px 'Familjen Grotesk',sans-serif">✓</div>
                <span style="font:600 15px/1.4 'Familjen Grotesk',sans-serif;color:#2ECC71">Gracias por contactarnos, responderemos tu solicitud lo más pronto posible</span>
              </div>
              <button class="m3j" onClick="{{ closeSupportModal }}" style="width:100%">Entendido</button>
              <button onClick="{{ resetSupportForm }}" style="height:32px;background:none;border:none;font:600 12.5px 'Familjen Grotesk',sans-serif;color:var(--mu);cursor:pointer">Enviar otra solicitud</button>
            </div>
          </sc-if>
        </div>
      </sc-if>
      <div style="position:absolute;left:14px;right:14px;top:60px;padding:14px 16px;border-radius:20px;background:var(--ik);color:var(--bg);font:600 14px/1.35 'Hanken Grotesk',sans-serif;transform:{{ toastY }};opacity:{{ toastO }};transition:transform .3s cubic-bezier(.22,1,.36,1),opacity .2s ease-out;z-index:60;pointer-events:none">{{ toastMsg }}</div>
`;
