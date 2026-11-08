// Plantilla de la pantalla de perfil del titular, segundo solicitante, recordatorios y respaldo en la nube

const Plantillaperfilusuario = `
<sc-if value="{{ isPerfil }}" hint-placeholder-val="{{ false }}">
        <div class="mt-scroll m3l">
          <div class="m3m"><button class="m3n" onClick="{{ closePanel }}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>Volver</button><span class="m3o">MI PERFIL</span></div>
          <div class="m3p">
            <div style="position:relative;flex:none">
              <sc-if value="{{ isProUser }}" hint-placeholder-val="{{ false }}">
                <div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);padding:2px 8px;border-radius:6px;background:#FFD23F;color:#0B0C0A;font:700 9px/1 'IBM Plex Mono',monospace;letter-spacing:.06em;box-shadow:0 2px 6px rgba(0,0,0,.35);white-space:nowrap;z-index:2;pointer-events:none">
                  MI TECHO PRO
                </div>
              </sc-if>
              <div class="m3q" onClick="{{ triggerPhotoUpload }}" title="Cambiar foto de perfil" style="overflow:hidden;position:relative;background:{{ avatarBg }};color:{{ avatarFg }};cursor:pointer;border:{{ avatarBorderLg }};box-sizing:border-box">
                <sc-if value="{{ hasAvatarImg }}" hint-placeholder-val="{{ false }}"><img src="{{ avatarUrl }}" alt="Foto" style="width:100%;height:100%;object-fit:cover;display:block"></sc-if>
                <sc-if value="{{ noAvatarImg }}" hint-placeholder-val="{{ true }}">{{ initials }}</sc-if>
              </div>
              <button onClick="{{ triggerPhotoUpload }}" aria-label="Cambiar foto de perfil" title="Cambiar foto de perfil" style="position:absolute;bottom:0;right:0;width:28px;height:28px;border-radius:14px;background:var(--ik);color:var(--bg);border:2px solid var(--cd);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.3)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </button>
            </div>
            <div class="m3r">
              <span class="m3s">{{ fullName }}</span>
              <span class="m3t">{{ emailShow }}</span>
              <div style="display:flex;align-items:center;gap:10px;margin-top:4px">
                <button onClick="{{ triggerPhotoUpload }}" style="padding:0;background:none;border:none;font:600 12.5px 'Familjen Grotesk',sans-serif;color:var(--at);cursor:pointer;text-align:left">
                  Cambiar foto
                </button>
                <sc-if value="{{ hasAvatarImg }}" hint-placeholder-val="{{ false }}">
                  <span style="color:var(--ln);font-size:12px">·</span>
                  <button onClick="{{ removeAvatarImg }}" style="padding:0;background:none;border:none;font:500 12.5px 'Familjen Grotesk',sans-serif;color:var(--al);cursor:pointer">
                    Quitar foto
                  </button>
                </sc-if>
              </div>
            </div>
          </div>
          <div class="m3u"><div class="m3v"><span class="m3w">CON ESTOS DATOS TU TECHO VALE</span><span class="m3x">\${{ heroPrice }} M</span></div><span class="m3y">Se actualiza mientras editas</span></div>
          <div class="m3z">Datos personales</div>
          <div class="m40"><label class="m41"><span class="m42">NOMBRE COMPLETO</span><input class="m43" maxlength="70" value="{{ pfNombre }}" onInput="{{ onPfNombre }}" placeholder="Tu nombre" aria-label="NOMBRE COMPLETO"></label><label class="m41"><span class="m42">EDAD</span><input class="m43" maxlength="2" value="{{ pfEdad }}" onInput="{{ onPfEdad }}" inputMode="numeric" placeholder="0" aria-label="EDAD"></label><div class="m44">
            <span class="m42">CIUDAD</span>
            <button onClick="{{ toggleCity }}" aria-expanded="{{ cityOpen }}" style="width:100%;min-height:48px;padding:0 12px 0 14px;border-radius:16px;background:var(--c2);border:1px solid {{ cityBorder }};display:flex;align-items:center;gap:10px;text-align:left;box-sizing:border-box">
              <span class="m45"><span class="m46">{{ ciudad }}</span><span class="m47">{{ cityDept }}</span></span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--mu);transform:{{ cityChevron }};transition:transform .2s ease-out;flex:none"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
            <sc-if value="{{ cityOpen }}" hint-placeholder-val="{{ false }}">
              <div class="m48">
                <div class="m49">
                  <svg class="m4a" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>
                  <input class="m4b" maxlength="50" value="{{ cityQ }}" onInput="{{ onCityQ }}" autoFocus="{{ true }}" placeholder="Escribe para buscar" aria-label="Buscar ciudad">
                  <span class="m4c">{{ cityCount }}</span>
                </div>
                <div class="mt-scroll m4d">
                  <sc-for list="{{ cityList }}" as="ct" hint-placeholder-count="6"><button onClick="{{ ct.onClick }}" style="width:100%;min-height:44px;padding:8px 14px;display:flex;align-items:center;gap:10px;text-align:left;background:{{ ct.bg }};border-bottom:1px solid var(--ln)"><span class="m45"><span style="font:600 14px 'Hanken Grotesk',sans-serif;color:{{ ct.color }}">{{ ct.name }}</span><span style="font:400 11.5px 'Hanken Grotesk',sans-serif;color:{{ ct.sub }}">{{ ct.dept }}</span></span><sc-if value="{{ ct.sel }}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" style="color:{{ ct.color }};flex:none"><path d="M5 12l5 5L20 7"></path></svg></sc-if></button></sc-for>
                  <sc-if value="{{ cityEmpty }}" hint-placeholder-val="{{ false }}"><div class="m4e">No encontramos esa ciudad. Revisa cómo la escribiste.</div></sc-if>
                </div>
              </div>
            </sc-if>
          </div></div>
          <div class="m4f">{{ edadHint }}</div>
          <div class="m3z">Ingresos</div>
          <div class="m40"><div class="m4g"><span class="m42">TIPO DE INGRESO</span><div class="m1w"><sc-for list="{{ pfTipoChips }}" as="c" hint-placeholder-count="3"><button onClick="{{ c.onClick }}" style="height:36px;padding:0 13px;border-radius:18px;border:1px solid {{ c.border }};background:{{ c.bg }};color:{{ c.color }};font:600 12.5px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ c.label }}</button></sc-for></div></div><sc-if value="{{ pfShowFijo }}" hint-placeholder-val="{{ true }}"><label class="m41"><span class="m42">SALARIO O INGRESO FIJO MENSUAL</span><input class="m43" value="{{ pfFijo }}" onInput="{{ onPfFijo }}" inputMode="numeric" placeholder="$0" aria-label="SALARIO O INGRESO FIJO MENSUAL"></label></sc-if><sc-if value="{{ pfShowVar }}" hint-placeholder-val="{{ true }}"><label class="m41"><span class="m42">INGRESOS VARIABLES AL MES</span><input class="m43" value="{{ pfVar }}" onInput="{{ onPfVar }}" inputMode="numeric" placeholder="$0" aria-label="INGRESOS VARIABLES AL MES"></label></sc-if><div class="m4h"><span class="m2n">Ingreso mensual</span><span class="m4i">{{ pfIngTotal }}</span></div></div>
          <div class="m3z">Ahorro y metas</div>
          <div class="m40"><label class="m41"><span class="m42">AHORRO PARA CUOTA INICIAL</span><input class="m43" value="{{ pfAhorro }}" onInput="{{ onPfAhorro }}" inputMode="numeric" placeholder="$0" aria-label="AHORRO PARA CUOTA INICIAL"></label><label class="m41"><span class="m42">CUÁNTO AHORRAS AL MES</span><input class="m43" value="{{ pfAhorroMes }}" onInput="{{ onPfAhorroMes }}" inputMode="numeric" placeholder="$0" aria-label="CUÁNTO AHORRAS AL MES"></label><label class="m4j"><span class="m42">PRECIO DE LA VIVIENDA QUE BUSCAS</span><input class="m43" value="{{ pfObj }}" onInput="{{ onPfObj }}" inputMode="numeric" placeholder="$0" aria-label="Precio de la vivienda que buscas"><span class="m2f">{{ pfMetaInfo }}</span></label></div>
          <div class="m3z">Caja de compensación y subsidios</div>
          <div class="m40">
            <button class="m2u" onClick="{{ toggleCaja }}"><div class="m2a"><span class="m2v">Estoy afiliado a una Caja</span><span class="m4k">Necesario para recibir subsidio de vivienda</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ cajaTrack }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ cajaKnob }};transform:{{ cajaX }};transition:transform .18s ease-out"></div></div></button>
            <sc-if value="{{ cajaOn }}" hint-placeholder-val="{{ true }}"><div class="m4l"><span class="m42">TU CAJA</span><div class="m1w"><sc-for list="{{ cajaChips }}" as="c" hint-placeholder-count="8"><button onClick="{{ c.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ c.border }};background:{{ c.bg }};color:{{ c.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ c.label }}</button></sc-for></div></div></sc-if>
            <button class="m2y" onClick="{{ toggleSisben }}"><div class="m2a"><span class="m2v">Tengo Sisbén</span><span class="m2w">Permite postularte a Mi Casa Ya (sujeto a cupos)</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ sisbenTrack }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ sisbenKnob }};transform:{{ sisbenX }};transition:transform .18s ease-out"></div></div></button>
            <sc-if value="{{ sisbenOn }}" hint-placeholder-val="{{ false }}"><div class="m4m"><span class="m42">GRUPO SISBÉN IV</span><div class="m1w"><sc-for list="{{ sisGrpOpts }}" as="o" hint-placeholder-count="3"><button onClick="{{ o.onClick }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ o.border }};background:{{ o.bg }};color:{{ o.color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ o.label }}</button></sc-for></div></div></sc-if>
          </div>
          <div style="margin:8px 14px 0;padding:14px 16px;border-radius:20px;background:{{ pfSubBg }};display:flex;flex-direction:column;gap:4px"><span style="font:500 10.5px 'IBM Plex Mono',monospace;color:{{ pfSubKicker }}">TU HOGAR GANA {{ smmFmt }} SMMLV</span><span style="font:600 15px/1.35 'Hanken Grotesk',sans-serif;color:{{ pfSubColor }};text-wrap:pretty">{{ pfSubMsg }}</span></div>
          <sc-if value="{{ showAfil }}" hint-placeholder-val="{{ false }}"><div class="m4n">{{ afilMsg }}</div></sc-if>
          <div class="m4o"><span class="m2v">Datos de tu Caja o del FNA</span><span class="m42">OPCIONAL</span></div>
          <div class="m4p">Si ya tienes esta información, escríbela y tu estimado se ajusta a tu caso real. Deja en blanco lo que no sepas.</div>
          <div class="m4q"><sc-for list="{{ entTabs }}" as="et" hint-placeholder-count="2"><button onClick="{{ et.onClick }}" style="border-radius:18px;background:{{ et.bg }};color:{{ et.color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 6px">{{ et.label }}</button></sc-for></div>
          <div class="m4r">
            <div class="m4s"><span class="m4t">Precisión del estimado</span><span class="m4u">{{ entPrecLabel }}</span></div>
            <div class="m4v"><div style="height:100%;width:{{ entPrecW }};background:var(--ac);border-radius:4px;transition:width .4s ease-out"></div></div>
            <sc-for list="{{ entUsing }}" as="u" hint-placeholder-count="0"><span class="m4w">✓ {{ u }}</span></sc-for>
          </div>
          <sc-for list="{{ entSections }}" as="es" hint-placeholder-count="4">
            <div class="m4x">
              <div class="m4y"><span class="m4z">{{ es.n }}</span><span class="m2c">{{ es.title }}</span></div>
              <span class="m2f">{{ es.desc }}</span>
              <sc-if value="{{ es.status }}"><div style="padding:10px 12px;border-radius:14px;background:{{ es.statusBg }};font:600 12.5px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A">{{ es.status }}</div></sc-if>
              <sc-for list="{{ es.fields }}" as="fd" hint-placeholder-count="2">
                  <sc-if value="{{ fd.isChips }}"><div class="m50"><span class="m42">{{ fd.label }}</span><div class="m1w"><sc-for list="{{ fd.opts }}" as="op" hint-placeholder-count="3"><button onClick="{{ op.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ op.border }};background:{{ op.bg }};color:{{ op.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ op.label }}</button></sc-for></div></div></sc-if>
                  <sc-if value="{{ fd.isInput }}"><label class="m51"><span class="m42">{{ fd.label }}</span><input class="m52" value="{{ fd.val }}" onInput="{{ fd.onInput }}" inputMode="{{ fd.mode }}" placeholder="{{ fd.ph }}" aria-label="{{ fd.label }}"><sc-if value="{{ fd.hint }}"><span class="m53">{{ fd.hint }}</span></sc-if></label></sc-if>
                </sc-for>
            </div>
          </sc-for>
          <div class="m54"><button class="m55" onClick="{{ entClear }}">Borrar datos de {{ entTabName }}</button></div>
          <div class="m3z">Vivienda que buscas</div>
          <div class="m56">
            <sc-for list="{{ modOpts }}" as="mo" hint-placeholder-count="3"><button onClick="{{ mo.onClick }}" style="padding:14px 12px;border-radius:20px;border:1px solid {{ mo.border }};background:{{ mo.bg }};text-align:left;display:flex;flex-direction:column;gap:6px"><span style="font:600 14px 'Familjen Grotesk',sans-serif;color:{{ mo.color }}">{{ mo.label }}</span><span style="font:500 11px 'IBM Plex Mono',monospace;color:{{ mo.sub }}">{{ mo.desc }}</span></button></sc-for>
          </div>
          <div class="m3z">Deudas</div>
          <button class="m57" onClick="{{ pfGoDebts }}"><div class="m2a"><span class="m2v">{{ pfDebtCount }}</span><span class="m4k">{{ pfDebtSum }}</span></div><span class="m58">Administrar →</span></button>
          <div class="m3z">Respaldo en la nube</div>
          <div class="m59">
            <div class="m5c"><button class="m5d" onClick="{{ gsSync }}">{{ gsSyncLabel }}</button><button class="m5e" onClick="{{ gsRestore }}">Restaurar</button></div>
            <span style="font:400 12px/1.4 'Hanken Grotesk',sans-serif;color:{{ gsStatusColor }}">{{ gsStatus }}</span>
          </div>
          <div class="m5f">
            <button class="m5g" onClick="{{ pfExport }}">Descargar mis datos</button>
            <button class="m5h" onClick="{{ pfDelete }}">Borrar mi cuenta</button>
          </div>
        </div>
      </sc-if>
      <sc-if value="{{ isRem }}" hint-placeholder-val="{{ false }}">
        <div class="mt-scroll m3l">
          <div class="m3m"><button class="m3n" onClick="{{ closePanel }}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>Volver</button><span class="m3o">RECORDATORIOS</span></div>
          <div class="m5i">
            <h1 class="m5j">Recordatorios</h1>
            <p class="ms">Te avisamos para que no se te pase ningún registro y tu promedio no se caiga.</p>
          </div>
          <div style="margin:20px 14px 0;padding:14px;border-radius:24px;background:rgba(127,127,127,.14);border:1px solid var(--ln);display:flex;gap:12px;align-items:flex-start;opacity:{{ remPreviewO }};transition:opacity .2s ease-out">
            <img class="m5k" src="assets/logo-app.png" alt="">
            <div class="m5l"><div class="m5m"><span class="m5n">MiTecho</span><span class="m4k">{{ remHora }}</span></div><span class="m5o">{{ remPreview }}</span></div>
          </div>
          <div class="m5p">VISTA PREVIA</div>
          <div class="m3z">Registro diario</div>
          <div class="m40">
            <button class="m2u" onClick="{{ toggleDaily }}"><div class="m2a"><span class="m2v">Recordarme registrar</span><span class="m4k">Un aviso al final del día</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ dailyTrack }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ dailyKnob }};transform:{{ dailyX }};transition:transform .18s ease-out"></div></div></button>
            <sc-if value="{{ dailyOn }}" hint-placeholder-val="{{ true }}">
              <div class="m4l"><span class="m42">HORA</span><div class="m1w"><sc-for list="{{ horaChips }}" as="c" hint-placeholder-count="3"><button onClick="{{ c.onClick }}" style="height:36px;padding:0 13px;border-radius:18px;border:1px solid {{ c.border }};background:{{ c.bg }};color:{{ c.color }};font:600 12.5px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ c.label }}</button></sc-for></div></div>
              <div class="m5q"><span class="m42">DÍAS</span><div class="m5r"><sc-for list="{{ diaChips }}" as="d" hint-placeholder-count="7"><button onClick="{{ d.onClick }}" style="height:42px;border-radius:21px;border:1px solid {{ d.border }};background:{{ d.bg }};color:{{ d.color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ d.label }}</button></sc-for></div></div>
            </sc-if>
          </div>
          <div class="m3z">Otros avisos</div>
          <div class="m40">
            <sc-for list="{{ remToggles }}" as="t" hint-placeholder-count="4"><button class="m2u" onClick="{{ t.onClick }}"><div class="m2a"><span class="m2v">{{ t.label }}</span><span class="m2w">{{ t.sub }}</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ t.track }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ t.knob }};transform:{{ t.x }};transition:transform .18s ease-out"></div></div></button></sc-for>
          </div>
        </div>
      </sc-if>
      <sc-if value="{{ isPro }}" hint-placeholder-val="{{ false }}">
        <div class="mt-scroll m3l">
          <div class="m3m"><button class="m3n" onClick="{{ closePanel }}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>Volver</button><span class="m3o">MITECHO PRO</span></div>
          <div class="m5s">
            <div class="m5t"><div class="mg"></div><div class="mh"></div><div class="mi"></div></div>
            <span class="m5u">MiTecho Pro</span>
            <div class="m5v"><span class="m5w">$12.900</span><span class="m5x">al mes</span></div>
            <span class="m5y">{{ proStatus }}</span>
          </div>
          <div class="m5z">
            <sc-for list="{{ proPerks }}" as="pk" hint-placeholder-count="5"><div class="m60"><span class="m61"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"></path></svg></span><div class="m62"><span class="m2c">{{ pk.t }}</span><span class="m2f">{{ pk.d }}</span></div></div></sc-for>
          </div>
          <div class="m63">
            <button onClick="{{ toggleProPlan }}" style="height:56px;border-radius:28px;background:{{ proBtnBg }};color:{{ proBtnColor }};font:700 15px 'Familjen Grotesk',sans-serif">{{ proBtn }}</button>
            <span class="m64">Cobro mensual recurrente. Cancela cuando quieras desde este menú.</span>
          </div>
        </div>
      </sc-if>
`;

