// Plantilla de las pantallas de bienvenida, inicio de sesión, recorrido inicial y primeros datos

const Plantillabienvenida = `
<sc-if value="{{ isWelcomeAuth }}" hint-placeholder-val="{{ true }}">
  <div class="mk {{ welcomeStateClass }}">
    <div class="ml" onClick="{{ onSplashTap }}">
      <img class="mm" src="assets/logo-glyph.png" alt="MiTecho" style="transform:{{ spLogoT }};opacity:{{ spLogoO }}">
      <span class="mn" style="opacity:{{ spTextO }};transform:{{ spTextT }}">MiTecho</span>
      <div class="mo" style="transform:{{ spBandT }};transform-origin:left center"><div class="mp"><div class="mg"></div><div class="mh"></div><div class="mi"></div></div></div>
      <span class="mj" style="opacity:{{ spTextO }};transform:{{ spTextT }}">Tu techo, en cifras de banco.</span>
    </div>
    <div class="mq">
      <h1 class="mr">Tu techo, en cifras de banco.</h1>
      <p class="ms">Registra lo que ganas cada día y mira cuánta vivienda te aprobaría hoy un banco en Colombia.</p>
    </div>
    <div class="mt">
      <button class="mu" onClick="{{ loginGoogle }}"><svg class="mv" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"></path><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"></path><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"></path><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"></path></svg><span>Continuar con Google</span></button>
      <sc-if value="{{ emailClosed }}" hint-placeholder-val="{{ true }}">
        <button class="mw" onClick="{{ openEmail }}">Iniciar sesión con correo</button>
      </sc-if>
      <sc-if value="{{ emailOpen }}" hint-placeholder-val="{{ false }}">
        <div class="mx">
          <sc-if value="{{ isNotRecoverMode }}" hint-placeholder-val="{{ true }}">
            <div style="display:flex;gap:6px;background:var(--c2);padding:4px;border-radius:18px">
              <button onClick="{{ setLoginTab }}" style="flex:1;height:36px;border-radius:14px;background:{{ loginTabBg }};color:{{ loginTabColor }};font:700 13px 'Familjen Grotesk',sans-serif;transition:background .15s ease-out">Iniciar sesión</button>
              <button onClick="{{ setRegisterTab }}" style="flex:1;height:36px;border-radius:14px;background:{{ regTabBg }};color:{{ regTabColor }};font:700 13px 'Familjen Grotesk',sans-serif;transition:background .15s ease-out">Registrarme</button>
            </div>
            <input class="my" value="{{ loginEmailVal }}" onInput="{{ onLoginEmail }}" type="email" placeholder="nombre@correo.com" aria-label="Correo">
            <input class="my" value="{{ loginPassVal }}" onInput="{{ onLoginPass }}" type="password" placeholder="{{ passPlaceholder }}" aria-label="Contraseña">
            <sc-if value="{{ isRegisterMode }}" hint-placeholder-val="{{ false }}">
              <input class="my" value="{{ loginPassConfirmVal }}" onInput="{{ onLoginPassConfirm }}" type="password" placeholder="Confirmar contraseña" aria-label="Confirmar contraseña">
            </sc-if>
            <sc-if value="{{ isLoginMode }}" hint-placeholder-val="{{ true }}">
              <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 4px 3px">
                <span style="font:400 12.5px 'Hanken Grotesk',sans-serif;color:var(--mu)">¿Olvidaste tu contraseña?</span>
                <button type="button" onClick="{{ setRecoverTab }}" style="background:none;border:none;padding:2px 0;color:var(--at);font:700 12.5px 'Familjen Grotesk',sans-serif;text-decoration:underline;text-underline-offset:3px;cursor:pointer;display:inline-flex;align-items:center;gap:4px"><span>Recuperar contraseña</span><span aria-hidden="true" style="font-size:12px;text-decoration:none">→</span></button>
              </div>
            </sc-if>
            <sc-if value="{{ loginError }}" hint-placeholder-val="{{ false }}"><span class="mz">{{ loginError }}</span></sc-if>
            <sc-if value="{{ loginSuccessMsg }}" hint-placeholder-val="{{ false }}">
              <div style="background:rgba(46,204,113,.12);border:1px solid rgba(46,204,113,.4);border-radius:14px;padding:10px 12px;display:flex;gap:8px;align-items:flex-start">
                <span style="color:#2ECC71;font-size:15px;line-height:1">✓</span>
                <span style="font:500 12.5px/1.4 'Hanken Grotesk',sans-serif;color:#2ECC71;flex:1">{{ loginSuccessMsg }}</span>
              </div>
            </sc-if>
            <sc-if value="{{ isLoginMode }}" hint-placeholder-val="{{ true }}">
              <button class="m10" onClick="{{ loginEmail }}" style="width:100%">{{ loginBtnText }}</button>
            </sc-if>
            <sc-if value="{{ isRegisterMode }}" hint-placeholder-val="{{ false }}">
              <button class="m10" onClick="{{ registerEmail }}" style="width:100%;background:var(--ac);color:var(--oa)">{{ regBtnText }}</button>
            </sc-if>
            <button onClick="{{ closeEmail }}" style="height:28px;font:500 12px 'Hanken Grotesk',sans-serif;color:var(--mu);background:none;border:none">Cancelar</button>
          </sc-if>
          <sc-if value="{{ isRecoverMode }}" hint-placeholder-val="{{ false }}">
            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--c2);padding:6px 12px;border-radius:18px">
              <div style="display:flex;align-items:center;gap:8px">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--at)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span style="font:700 13.5px 'Familjen Grotesk',sans-serif;color:var(--ik)">Recuperar contraseña</span>
              </div>
              <button type="button" onClick="{{ setLoginTab }}" style="background:var(--cd);border:1px solid var(--ln);color:var(--ik);font:600 12px 'Hanken Grotesk',sans-serif;padding:5px 12px;border-radius:12px;cursor:pointer">← Volver</button>
            </div>
            <p style="font:400 12.5px/1.45 'Hanken Grotesk',sans-serif;color:var(--mu);margin:2px 4px 4px">Ingresa el correo de tu cuenta y te enviaremos un enlace seguro para restablecerla.</p>
            <input class="my" value="{{ loginEmailVal }}" onInput="{{ onLoginEmail }}" type="email" placeholder="nombre@correo.com" aria-label="Correo">
            <sc-if value="{{ loginError }}" hint-placeholder-val="{{ false }}"><span class="mz">{{ loginError }}</span></sc-if>
            <sc-if value="{{ loginSuccessMsg }}" hint-placeholder-val="{{ false }}">
              <div style="background:rgba(46,204,113,.12);border:1px solid rgba(46,204,113,.4);border-radius:14px;padding:10px 12px;display:flex;gap:8px;align-items:flex-start">
                <span style="color:#2ECC71;font-size:15px;line-height:1">✓</span>
                <span style="font:500 12.5px/1.4 'Hanken Grotesk',sans-serif;color:#2ECC71;flex:1">{{ loginSuccessMsg }}</span>
              </div>
            </sc-if>
            <button class="m10" onClick="{{ recoverEmail }}" style="width:100%;background:var(--ac);color:var(--oa)">{{ recoverBtnText }}</button>
            <button type="button" onClick="{{ setLoginTab }}" style="height:28px;font:500 12px 'Hanken Grotesk',sans-serif;color:var(--mu);background:none;border:none;cursor:pointer">Volver a iniciar sesión</button>
          </sc-if>
        </div>
      </sc-if>
      <div style="text-align:center;margin-top:4px;font:500 12.5px/1.4 'Hanken Grotesk',sans-serif;color:var(--mu)">¿Necesitas ayuda? <button onClick="{{ contactSupportLogin }}" style="background:none;border:none;padding:0;margin:0;color:var(--at);font:700 12.5px/1.4 'Familjen Grotesk',sans-serif;text-decoration:underline;text-underline-offset:3px;cursor:pointer">Contáctanos</button></div>
      <p class="m11">Al continuar aceptas los Términos y la Política de tratamiento de datos (Ley 1581 de 2012).</p>
    </div>
  </div>
</sc-if>
  
      <sc-if value="{{ isOnboarding }}" hint-placeholder-val="{{ false }}">
        <div class="m12">
          <div class="m13">
            <span class="m14">{{ obCounter }}</span>
            <div class="m15"><sc-for list="{{ obBars }}" as="b"><div style="flex:1;height:3px;border-radius:2px;background:{{ b.bg }};transition:background .2s ease-out"></div></sc-for></div>
            <button class="m16" onClick="{{ skipOnboarding }}">Saltar</button>
          </div>
          <div ref="{{ obRef }}" onScroll="{{ onObScroll }}" class="mt-scroll m17">
            <div class="m18">
              <div class="m19">CÓMO CALCULA EL BANCO</div>
              <h2 class="m1a">Tu casa cabe en tres operaciones.</h2>
              <div class="m1b">
                <div class="m1c"><span class="m1d">(Ingreso − Deudas)</span><span class="m1e">× 30%</span></div>
                <div class="m1c"><span class="m1d">Lo que te presta</span><span class="m1e">× {{ factorShort }}</span></div>
                <div class="m1f"><span class="m1g">Precio de tu vivienda</span><span class="m1h">÷ 70%</span></div>
              </div>
              <p class="ms">El 30% restante es tu cuota inicial. En vivienda VIS el banco financia hasta el 80%.</p>
            </div>
            <div class="m18">
              <div class="m19">DIARIO · MENSUAL · ANUAL</div>
              <h2 class="m1a">Cada peso que registras sube tu techo.</h2>
              <div class="m1i">
                <div class="m1j"><span class="m1k">Registras</span><span class="m1l">+$100.000</span></div>
                <div class="m1m"></div>
                <div class="m1j"><span class="m1k">El banco te presta</span><span class="m1n">+{{ sensCredFmt }}</span></div>
                <div class="m1j"><span class="m1k">Tu vivienda sube</span><span class="m1o">+{{ sensM }}</span></div>
              </div>
              <p class="ms">Ventas, turnos, comisiones o salario: lo anotas en 3 segundos y la app calcula tu promedio como lo hace el banco.</p>
            </div>
            <div class="m18">
              <div class="m19">TU PRIMER PASO</div>
              <h2 class="m1a">Anota hoy lo que ganaste.</h2>
              <div class="m1p">
                <div class="m1q"><div class="m1r">Ingreso</div><div class="m1s">Deuda / egreso</div></div>
                <div class="m1t"><span class="m1u">$</span><span class="m1v">85.000</span></div>
                <div class="m1w"><span class="m1x">Ventas del día</span><span class="m1y">Nequi / DaviPlata</span></div>
              </div>
              <p class="ms">Con el botón + registras un ingreso o una deuda en segundos. Tu techo se recalcula al instante.</p>
            </div>
          </div>
          <div class="m1z">
            <sc-if value="{{ obIsLast }}" hint-placeholder-val="{{ false }}"><button class="m20" onClick="{{ enterApp }}">Empezar<span class="m21">→</span></button></sc-if>
            <sc-if value="{{ obNotLast }}" hint-placeholder-val="{{ true }}"><button class="m20" onClick="{{ obNext }}">Siguiente<span class="m21">→</span></button></sc-if>
          </div>
        </div>
      </sc-if>
  
      <sc-if value="{{ isSetup }}" hint-placeholder-val="{{ false }}">
        <div class="m22">
          <div class="m23">
            <sc-if value="{{ suShowBack }}" hint-placeholder-val="{{ false }}"><button class="m24" onClick="{{ suBack }}" aria-label="Atrás"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg></button></sc-if>
            <span class="m25">{{ suCounter }}</span>
            <div class="m15"><sc-for list="{{ suBars }}" as="b" hint-placeholder-count="3"><div style="flex:1;height:3px;border-radius:2px;background:{{ b.bg }};transition:background .2s ease-out"></div></sc-for></div>
          </div>
          <div class="mt-scroll m26">
            <sc-if value="{{ suStep0 }}" hint-placeholder-val="{{ true }}"><div class="m27">
              <div class="m19">TUS DATOS · INGRESOS</div><h2 class="m28">¿Cómo recibes tu plata?</h2><p class="ms">Así sabemos qué ingresos pedirte y cómo los va a mirar el banco.</p>
              <div class="m29">
                <sc-for list="{{ tipoOpts }}" as="t" hint-placeholder-count="3"><button onClick="{{ t.onClick }}" style="width:100%;text-align:left;padding:16px 18px;border-radius:24px;background:{{ t.bg }};border:1px solid {{ t.border }};display:flex;align-items:center;gap:14px;transition:background .15s ease-out"><div class="m2a"><span style="font:600 20px 'Familjen Grotesk',sans-serif;color:{{ t.color }}">{{ t.label }}</span><span style="font:400 13px 'Hanken Grotesk',sans-serif;color:{{ t.sub }}">{{ t.desc }}</span></div><div style="width:24px;height:24px;border-radius:12px;border:2px solid {{ t.ring }};display:flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box"><div style="width:10px;height:10px;border-radius:5px;background:{{ t.dot }}"></div></div></button></sc-for>
              </div>
            </div></sc-if>
            <sc-if value="{{ suStep1 }}" hint-placeholder-val="{{ false }}"><div class="m27">
              <div class="m19">TUS DATOS · INGRESOS</div><h2 class="m28">¿Cuánto recibes al mes?</h2><p class="ms">Escribe valores aproximados. Después los afinas registrando cada día.</p>
              <sc-if value="{{ suShowFijo }}" hint-placeholder-val="{{ true }}"><div class="m2b"><span class="m2c">Salario o ingreso fijo mensual</span><div class="m2d"><span class="m1u">$</span><input class="m2e" value="{{ suFijoTxt }}" onInput="{{ onSuFijo }}" inputMode="numeric" placeholder="0" aria-label="Ingreso fijo"></div></div></sc-if>
              <sc-if value="{{ suShowVar }}" hint-placeholder-val="{{ true }}"><div class="m2b"><span class="m2c">Ingresos variables al mes</span><div class="m2d"><span class="m1u">$</span><input class="m2e" value="{{ suVarTxt }}" onInput="{{ onSuVar }}" inputMode="numeric" placeholder="0" aria-label="Ingresos variables"></div><span class="m2f">Si no lo sabes, suma lo de una semana normal y multiplícalo por 4.</span></div></sc-if>
              <div class="m2g"><span class="m1d">Ingreso mensual</span><span class="m2h">{{ suIngTotal }}</span></div>
            </div></sc-if>
            <sc-if value="{{ suStep2 }}" hint-placeholder-val="{{ false }}"><div class="m27">
              <div class="m19">TUS DATOS · DEUDAS</div><h2 class="m28">¿Qué cuotas pagas cada mes?</h2><p class="ms">Tarjetas, créditos, libranzas o arriendo. El banco las resta de tu ingreso.</p>
              <sc-if value="{{ suHasDebts }}" hint-placeholder-val="{{ false }}"><div class="m2i">
                <sc-for list="{{ suDebtRows }}" as="r" hint-placeholder-count="2"><div class="m2j"><span class="m2k">{{ r.name }}</span><span class="m2c">{{ r.cuota }}</span><button class="m2l" onClick="{{ r.onRemove }}" aria-label="Quitar">×</button></div></sc-for>
                <div class="m2m"><span class="m2n">Total al mes</span><span class="m2o">{{ suDeuTotal }}</span></div>
              </div></sc-if>
              <div class="m2b"><div class="m1w"><sc-for list="{{ suTypeChips }}" as="c" hint-placeholder-count="7"><button onClick="{{ c.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ c.border }};background:{{ c.bg }};color:{{ c.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ c.label }}</button></sc-for></div><span class="m2p">CUOTA MENSUAL</span><div class="m2d"><span class="m1u">$</span><input class="m2e" value="{{ suDCuotaTxt }}" onInput="{{ onSuDCuota }}" inputMode="numeric" placeholder="0" aria-label="Cuota mensual"></div><button class="m2q" onClick="{{ suAddDebt }}">+ Agregar esta deuda</button></div>
              <button class="m2r" onClick="{{ toggleSuNoDebts }}"><span class="m2s">No tengo deudas</span><div style="width:54px;height:32px;border-radius:16px;background:{{ suNoTrack }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ suNoKnob }};transform:{{ suNoX }};transition:transform .18s ease-out"></div></div></button>
            </div></sc-if>
            <sc-if value="{{ suStep3 }}" hint-placeholder-val="{{ false }}"><div class="m27">
              <div class="m19">TUS DATOS · AHORRO Y SUBSIDIO</div><h2 class="m28">¿Con qué cuentas para la cuota inicial?</h2><p class="ms">Tu ahorro y el subsidio de tu Caja de compensación forman la cuota inicial. Sin ellos el banco no desembolsa.</p>
              <div class="m2b"><span class="m2c">Ahorro que ya tienes</span><div class="m2d"><span class="m1u">$</span><input class="m2t" value="{{ suAhorroTxt }}" onInput="{{ onSuAhorro }}" inputMode="numeric" placeholder="0" aria-label="Ahorro actual"></div><span class="m2f">Cuentas de ahorro, CDT, cesantías que puedas retirar para vivienda.</span></div>
              <div class="m2b"><span class="m2c">¿Cuánto puedes ahorrar al mes?</span><div class="m2d"><span class="m1u">$</span><input class="m2t" value="{{ suAhMesTxt }}" onInput="{{ onSuAhMes }}" inputMode="numeric" placeholder="0" aria-label="Ahorro mensual"></div></div>
              <div class="m2i">
                <button class="m2u" onClick="{{ suToggleCaja }}"><div class="m2a"><span class="m2v">Estoy afiliado a una Caja de compensación</span><span class="m2w">Si tienes contrato laboral, tu empresa ya te afilió.</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ suCajaTrack }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ suCajaKnob }};transform:{{ suCajaX }};transition:transform .18s ease-out"></div></div></button>
                <sc-if value="{{ suCajaOn }}" hint-placeholder-val="{{ true }}"><div class="m2x"><sc-for list="{{ suCajaChips }}" as="c" hint-placeholder-count="8"><button onClick="{{ c.onClick }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ c.border }};background:{{ c.bg }};color:{{ c.color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ c.label }}</button></sc-for></div></sc-if>
                <button class="m2y" onClick="{{ suToggleSisben }}"><div class="m2a"><span class="m2v">Tengo Sisbén</span><span class="m2w">Permite postularte a Mi Casa Ya (sujeto a cupos)</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ suSisTrack }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ suSisKnob }};transform:{{ suSisX }};transition:transform .18s ease-out"></div></div></button>
              </div>
              <div style="padding:14px 16px;border-radius:20px;background:{{ suSubBg }};display:flex;flex-direction:column;gap:4px"><span style="font:500 10.5px 'IBM Plex Mono',monospace;color:{{ suSubKicker }}">TU HOGAR GANA {{ suSmm }} SMMLV</span><span style="font:600 14px/1.4 'Hanken Grotesk',sans-serif;color:{{ suSubColor }};text-wrap:pretty">{{ suSubMsg }}</span></div>
            </div></sc-if>
            <sc-if value="{{ suStep4 }}" hint-placeholder-val="{{ false }}"><div class="m2z">
              <div class="m19">LISTO · {{ suModLabel }}</div>
              <span class="m30">{{ firstName }}, hoy tu techo vale</span>
              <div class="m31"><span class="m32">$</span><span class="m33">{{ suPrice }}</span></div>
              <span class="m34">millones</span>
              <div class="m35"><div style="width:{{ suFinW }};background:var(--ac);border-radius:7px"></div><div class="m36"></div></div>
              <div class="m37"><div class="m38"><span class="m39">BANCO PRESTA {{ suFinPct }}</span><span class="m3a">{{ suCredM }}</span></div><div class="m3b"><span class="m39">TÚ PONES {{ suOwnPct }}</span><span class="m3a">{{ suOwnM }}</span></div></div>
              <sc-if value="{{ suHasSub }}" hint-placeholder-val="{{ false }}"><div class="m3c"><span class="m3d"></span>Tu subsidio cubre <b class="m3e">{{ suSubM }}</b> de la cuota inicial</div></sc-if>
              <div style="padding:14px 16px;border-radius:20px;background:{{ suHoyBg }};display:flex;justify-content:space-between;align-items:baseline;gap:10px"><span class="m3f">{{ suHoyLabel }}</span><span class="m3g">{{ suHoyM }}</span></div>
              <p class="ms">{{ suOutro }}</p>
            </div></sc-if>
          </div>
          <div class="m3h">
            <sc-if value="{{ suErr }}" hint-placeholder-val="{{ false }}"><span class="m3i">{{ suErr }}</span></sc-if>
            <button class="m3j" onClick="{{ suNext }}">{{ suCta }}</button>
          </div>
        </div>
      </sc-if>
`;

