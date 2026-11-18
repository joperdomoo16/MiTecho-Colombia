// Plantilla de las pantallas de bienvenida, inicio de sesión, recorrido inicial y primeros datos

const Plantillabienvenida = `
<mt-if value="{{ Esbienvenidaingreso }}">
  <div class="mk {{ Bienvenidaclase }}">
    <div class="ml" al-clic="{{ Tocarportada }}">
      <img class="mm" src="assets/Logoglyphgrande.webp" width="512" height="512" fetchpriority="high" alt="MiTecho" style="transform:{{ Portadalogomovimiento }};opacity:{{ Portadalogoopacidad }}">
      <span class="mn" style="opacity:{{ Portadatextoopacidad }};transform:{{ Portadatextomovimiento }}">MiTecho</span>
      <div class="mo" style="transform:{{ Portadafranja }};transform-origin:left center"><div class="mp"><div class="mg"></div><div class="mh"></div><div class="mi"></div></div></div>
      <span class="mj" style="opacity:{{ Portadatextoopacidad }};transform:{{ Portadatextomovimiento }}">Tu techo, en cifras de banco.</span>
    </div>
    <div class="mq">
      <h1 class="mr">Tu techo, en cifras de banco.</h1>
      <p class="ms">Registra lo que ganas cada día y estima cuánto podría prestarte un banco en Colombia.</p>
    </div>
    <div class="mt">
      <button class="mu" al-clic="{{ Ingresogoogle }}"><svg class="mv" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"></path><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"></path><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"></path><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"></path></svg><span>Continuar con Google</span></button>
      <mt-if value="{{ Correocerrado }}">
        <button class="mw" al-clic="{{ Abrircorreo }}">Iniciar sesión con correo</button>
      </mt-if>
      <mt-if value="{{ Correoabierto }}">
        <div class="mx">
          <mt-if value="{{ Noesmodorecuperar }}">
            <div style="display:flex;gap:6px;background:var(--c2);padding:4px;border-radius:18px">
              <button al-clic="{{ Elegiringreso }}" style="flex:1;height:36px;border-radius:14px;background:{{ Ingresopestanafondo }};color:{{ Ingresopestanacolor }};font:700 13px 'Familjen Grotesk',sans-serif;transition:background .15s ease-out">Iniciar sesión</button>
              <button al-clic="{{ Elegirregistro }}" style="flex:1;height:36px;border-radius:14px;background:{{ Registropestanafondo }};color:{{ Registropestanacolor }};font:700 13px 'Familjen Grotesk',sans-serif;transition:background .15s ease-out">Registrarme</button>
            </div>
            <mt-if value="{{ Esmodoregistro }}">
              <input class="my" value="{{ Nombreregistrovalor }}" al-escribir="{{ Escribirnombreregistro }}" type="text" maxlength="70" autocomplete="name" autocapitalize="words" placeholder="Tu nombre" aria-label="Nombre">
            </mt-if>
            <input maxlength="100" class="my" value="{{ Ingresocorreovalor }}" al-escribir="{{ Escribiringresocorreo }}" type="email" placeholder="nombre@correo.com" aria-label="Correo">
            <input maxlength="72" class="my" value="{{ Ingresoclavevalor }}" al-escribir="{{ Escribiringresoclave }}" type="password" placeholder="{{ Claveejemplo }}" aria-label="Contraseña">
            <mt-if value="{{ Esmodoregistro }}">
              <input maxlength="72" class="my" value="{{ Ingresoclaveconfirmarvalor }}" al-escribir="{{ Escribiringresoclaveconfirmar }}" type="password" placeholder="Confirmar contraseña" aria-label="Confirmar contraseña">
            </mt-if>
            <mt-if value="{{ Esmodoingreso }}">
              <div style="display:flex;justify-content:space-between;align-items:center;padding:1px 4px 3px">
                <span style="font:400 12.5px 'Hanken Grotesk',sans-serif;color:var(--mu)">¿Olvidaste tu contraseña?</span>
                <button type="button" al-clic="{{ Elegirrecuperar }}" style="background:none;border:none;padding:2px 0;color:var(--at);font:700 12.5px 'Familjen Grotesk',sans-serif;text-decoration:underline;text-underline-offset:3px;cursor:pointer;display:inline-flex;align-items:center;gap:4px"><span>Recuperar contraseña</span><span aria-hidden="true" style="font-size:12px;text-decoration:none">→</span></button>
              </div>
            </mt-if>
            <mt-if value="{{ Ingresoerror }}"><span class="mz">{{ Ingresoerror }}</span></mt-if>
            <mt-if value="{{ Ingresoexitomensaje }}">
              <div style="background:rgba(46,204,113,.12);border:1px solid rgba(46,204,113,.4);border-radius:14px;padding:10px 12px;display:flex;gap:8px;align-items:flex-start">
                <span style="color:#2ECC71;font-size:15px;line-height:1">✓</span>
                <span style="font:500 12.5px/1.4 'Hanken Grotesk',sans-serif;color:#2ECC71;flex:1">{{ Ingresoexitomensaje }}</span>
              </div>
            </mt-if>
            <mt-if value="{{ Esmodoingreso }}">
              <button class="m10" al-clic="{{ Ingresocorreo }}" style="width:100%">{{ Ingresobotontexto }}</button>
            </mt-if>
            <mt-if value="{{ Esmodoregistro }}">
              <button class="m10" al-clic="{{ Registrarcorreo }}" style="width:100%;background:var(--ac);color:var(--oa)">{{ Registrobotontexto }}</button>
            </mt-if>
            <button al-clic="{{ Cerrarcorreo }}" style="height:28px;font:500 12px 'Hanken Grotesk',sans-serif;color:var(--mu);background:none;border:none">Cancelar</button>
          </mt-if>
          <mt-if value="{{ Esmodorecuperar }}">
            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--c2);padding:6px 12px;border-radius:18px">
              <div style="display:flex;align-items:center;gap:8px">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--at)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span style="font:700 13.5px 'Familjen Grotesk',sans-serif;color:var(--ik)">Recuperar contraseña</span>
              </div>
              <button type="button" al-clic="{{ Elegiringreso }}" style="background:var(--cd);border:1px solid var(--ln);color:var(--ik);font:600 12px 'Hanken Grotesk',sans-serif;padding:5px 12px;border-radius:12px;cursor:pointer">← Volver</button>
            </div>
            <p style="font:400 12.5px/1.45 'Hanken Grotesk',sans-serif;color:var(--mu);margin:2px 4px 4px">Ingresa el correo de tu cuenta y te enviaremos un enlace seguro para restablecerla.</p>
            <input maxlength="100" class="my" value="{{ Ingresocorreovalor }}" al-escribir="{{ Escribiringresocorreo }}" type="email" placeholder="nombre@correo.com" aria-label="Correo">
            <mt-if value="{{ Ingresoerror }}"><span class="mz">{{ Ingresoerror }}</span></mt-if>
            <mt-if value="{{ Ingresoexitomensaje }}">
              <div style="background:rgba(46,204,113,.12);border:1px solid rgba(46,204,113,.4);border-radius:14px;padding:10px 12px;display:flex;gap:8px;align-items:flex-start">
                <span style="color:#2ECC71;font-size:15px;line-height:1">✓</span>
                <span style="font:500 12.5px/1.4 'Hanken Grotesk',sans-serif;color:#2ECC71;flex:1">{{ Ingresoexitomensaje }}</span>
              </div>
            </mt-if>
            <button class="m10" al-clic="{{ Recuperarcorreo }}" style="width:100%;background:var(--ac);color:var(--oa)">{{ Recuperarbotontexto }}</button>
            <button type="button" al-clic="{{ Elegiringreso }}" style="height:28px;font:500 12px 'Hanken Grotesk',sans-serif;color:var(--mu);background:none;border:none;cursor:pointer">Volver a iniciar sesión</button>
          </mt-if>
        </div>
      </mt-if>
      <div style="text-align:center;margin-top:4px;font:500 12.5px/1.4 'Hanken Grotesk',sans-serif;color:var(--mu)">¿Necesitas ayuda? <button al-clic="{{ Contactarsoporteingreso }}" style="background:none;border:none;padding:0;margin:0;color:var(--at);font:700 12.5px/1.4 'Familjen Grotesk',sans-serif;text-decoration:underline;text-underline-offset:3px;cursor:pointer">Contáctanos</button></div>
      <p class="m11">Al entrar te pediremos tu autorización para el tratamiento de tus datos (Ley 1581 de 2012).</p>
    </div>
  </div>
</mt-if>
  
      <mt-if value="{{ Escuestionario }}">
        <div class="m22">
          <div class="m23">
            <mt-if value="{{ Cuestionariomostraratras }}"><button class="m24" al-clic="{{ Cuestionarioatras }}" aria-label="Atrás"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg></button></mt-if>
            <span class="m25">{{ Cuestionariocontador }}</span>
            <div class="m15"><mt-for list="{{ Cuestionariobarras }}" as="Barrapaso"><div style="flex:1;height:3px;border-radius:2px;background:{{ Barrapaso.Fondo }};transition:background .2s ease-out"></div></mt-for></div>
          </div>
          <div class="mt-scroll m26">
            <mt-if value="{{ Cuestionariopasocero }}"><div class="m27">
              <div class="m19">TUS DATOS · INGRESOS</div><h2 class="m28">¿Cómo recibes tu plata?</h2><p class="ms">Así sabemos qué ingresos pedirte y cómo los va a mirar el banco.</p>
              <div class="m29">
                <mt-for list="{{ Tipoopciones }}" as="Opciontipo"><button al-clic="{{ Opciontipo.Alclic }}" style="width:100%;text-align:left;padding:16px 18px;border-radius:24px;background:{{ Opciontipo.Fondo }};border:1px solid {{ Opciontipo.Borde }};display:flex;align-items:center;gap:14px;transition:background .15s ease-out"><div class="m2a"><span style="font:600 20px 'Familjen Grotesk',sans-serif;color:{{ Opciontipo.Color }}">{{ Opciontipo.Etiqueta }}</span><span style="font:400 13px 'Hanken Grotesk',sans-serif;color:{{ Opciontipo.Subtexto }}">{{ Opciontipo.Descripcioncorta }}</span></div><div style="width:24px;height:24px;border-radius:12px;border:2px solid {{ Opciontipo.Anillo }};display:flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box"><div style="width:10px;height:10px;border-radius:5px;background:{{ Opciontipo.Punto }}"></div></div></button></mt-for>
              </div>
            </div></mt-if>
            <mt-if value="{{ Cuestionariopasouno }}"><div class="m27">
              <div class="m19">TUS DATOS · INGRESOS</div><h2 class="m28">¿Cuánto recibes al mes?</h2><p class="ms">Escribe valores aproximados. Después los afinas registrando cada día.</p>
              <mt-if value="{{ Cuestionariomostrarfijo }}"><div class="m2b"><span class="m2c">Salario o ingreso fijo mensual</span><div class="m2d"><span class="m1u">$</span><input class="m2e" maxlength="12" value="{{ Cuestionariofijotexto }}" al-escribir="{{ Escribircuestionariofijo }}" inputMode="numeric" placeholder="0" aria-label="Ingreso fijo"></div></div></mt-if>
              <mt-if value="{{ Cuestionariomostrarvariable }}"><div class="m2b"><span class="m2c">Ingresos variables al mes</span><div class="m2d"><span class="m1u">$</span><input class="m2e" maxlength="12" value="{{ Cuestionariovariabletexto }}" al-escribir="{{ Escribircuestionariovariable }}" inputMode="numeric" placeholder="0" aria-label="Ingresos variables"></div><span class="m2f">Si no lo sabes, suma lo de una semana normal y multiplícalo por 4.</span></div></mt-if>
              <div class="m2g"><span class="m1d">Ingreso mensual</span><span class="m2h">{{ Cuestionarioingresototal }}</span></div>
            </div></mt-if>
            <mt-if value="{{ Cuestionariopasodos }}"><div class="m27">
              <div class="m19">TUS DATOS · DEUDAS</div><h2 class="m28">¿Qué cuotas pagas cada mes?</h2><p class="ms">Tarjetas, créditos, libranzas o arriendo. El banco las resta de tu ingreso.</p>
              <mt-if value="{{ Cuestionariotienedeudas }}"><div class="m2i">
                <mt-for list="{{ Cuestionariodeudafilas }}" as="Filatabla"><div class="m2j"><span class="m2k">{{ Filatabla.Nombreitem }}</span><span class="m2c">{{ Filatabla.Cuota }}</span><button class="m2l" al-clic="{{ Filatabla.Alquitar }}" aria-label="Quitar">×</button></div></mt-for>
                <div class="m2m"><span class="m2n">Total al mes</span><span class="m2o">{{ Cuestionariodeudatotal }}</span></div>
              </div></mt-if>
              <div class="m2b"><div class="m1w"><mt-for list="{{ Cuestionariotipofichas }}" as="Ficha"><button al-clic="{{ Ficha.Alclic }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ Ficha.Borde }};background:{{ Ficha.Fondo }};color:{{ Ficha.Color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ Ficha.Etiqueta }}</button></mt-for></div><span class="m2p">CUOTA MENSUAL</span><div class="m2d"><span class="m1u">$</span><input class="m2e" maxlength="12" value="{{ Cuestionariodeudacuotatexto }}" al-escribir="{{ Escribircuestionariodeudacuota }}" inputMode="numeric" placeholder="0" aria-label="Cuota mensual"></div><button class="m2q" al-clic="{{ Cuestionarioagregardeuda }}">+ Agregar esta deuda</button></div>
              <button class="m2r" al-clic="{{ Alternarsindeudas }}"><span class="m2s">No tengo deudas</span><div style="width:54px;height:32px;border-radius:16px;background:{{ Cuestionarionoriel }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ Cuestionarionoperilla }};transform:{{ Cuestionarionoposicion }};transition:transform .18s ease-out"></div></div></button>
            </div></mt-if>
            <mt-if value="{{ Cuestionariopasotres }}"><div class="m27">
              <div class="m19">TUS DATOS · AHORRO Y SUBSIDIO</div><h2 class="m28">¿Con qué cuentas para la cuota inicial?</h2><p class="ms">Tu ahorro y el subsidio de tu Caja de compensación forman la cuota inicial. Sin ellos el banco no desembolsa.</p>
              <div class="m2b"><span class="m2c">Ahorro que ya tienes</span><div class="m2d"><span class="m1u">$</span><input class="m2t" maxlength="14" value="{{ Cuestionarioahorrotexto }}" al-escribir="{{ Escribircuestionarioahorro }}" inputMode="numeric" placeholder="0" aria-label="Ahorro actual"></div><span class="m2f">Cuentas de ahorro, CDT, cesantías que puedas retirar para vivienda.</span></div>
              <div class="m2b"><span class="m2c">¿Cuánto puedes ahorrar al mes?</span><div class="m2d"><span class="m1u">$</span><input class="m2t" maxlength="12" value="{{ Cuestionarioahorromestexto }}" al-escribir="{{ Escribircuestionarioahorromes }}" inputMode="numeric" placeholder="0" aria-label="Ahorro mensual"></div></div>
              <div class="m2i">
                <button class="m2u" al-clic="{{ Cuestionarioalternarcaja }}"><div class="m2a"><span class="m2v">Estoy afiliado a una Caja de compensación</span><span class="m2w">Si tienes contrato laboral, tu empresa ya te afilió.</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ Cuestionariocajariel }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ Cuestionariocajaperilla }};transform:{{ Cuestionariocajaposicion }};transition:transform .18s ease-out"></div></div></button>
                <mt-if value="{{ Cuestionariocajaactiva }}"><div class="m2x"><mt-for list="{{ Cuestionariocajafichas }}" as="Ficha"><button al-clic="{{ Ficha.Alclic }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ Ficha.Borde }};background:{{ Ficha.Fondo }};color:{{ Ficha.Color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ Ficha.Etiqueta }}</button></mt-for></div></mt-if>
                <button class="m2y" al-clic="{{ Cuestionarioalternarsisben }}"><div class="m2a"><span class="m2v">Tengo Sisbén</span><span class="m2w">Permite postularte a Mi Casa Ya (sujeto a cupos)</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ Cuestionariosisbenriel }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ Cuestionariosisbenperilla }};transform:{{ Cuestionariosisbenposicion }};transition:transform .18s ease-out"></div></div></button>
              </div>
              <div style="padding:14px 16px;border-radius:20px;background:{{ Cuestionariosubsidiofondo }};display:flex;flex-direction:column;gap:4px"><span style="font:500 10.5px 'IBM Plex Mono',monospace;color:{{ Cuestionariosubsidioantetitulo }}">TU HOGAR GANA {{ Cuestionariosalariosminimos }} SMMLV</span><span style="font:600 14px/1.4 'Hanken Grotesk',sans-serif;color:{{ Cuestionariosubsidiocolor }};text-wrap:pretty">{{ Cuestionariosubsidiomensaje }}</span></div>
            </div></mt-if>
            <mt-if value="{{ Cuestionariopasocuatro }}"><div class="m2z">
              <div class="m19">LISTO · {{ Cuestionariomodalidadetiqueta }}</div>
              <span class="m30">{{ Primernombre }}, hoy tu techo vale</span>
              <div class="m31"><span class="m32">$</span><span class="m33">{{ Cuestionarioprecio }}</span></div>
              <span class="m34">millones</span>
              <div class="m35"><div style="width:{{ Cuestionariofinanciacionancho }};background:var(--ac);border-radius:7px"></div><div class="m36"></div></div>
              <div class="m37"><div class="m38"><span class="m39">BANCO PRESTA {{ Cuestionariofinanciacionporcentaje }}</span><span class="m3a">{{ Cuestionariocreditomillones }}</span></div><div class="m3b"><span class="m39">TÚ PONES {{ Cuestionariopropioporcentaje }}</span><span class="m3a">{{ Cuestionariopropiomillones }}</span></div></div>
              <mt-if value="{{ Cuestionariotopevisvisible }}"><div class="mbf">{{ Cuestionariotopevismensaje }}</div></mt-if>
              <mt-if value="{{ Cuestionariotienesubsidio }}"><div class="m3c"><span class="m3d"></span>Tu subsidio cubre <b class="m3e">{{ Cuestionariosubsidiomillones }}</b> de la cuota inicial</div></mt-if>
              <div style="padding:14px 16px;border-radius:20px;background:{{ Cuestionariohoyfondo }};display:flex;justify-content:space-between;align-items:baseline;gap:10px"><span class="m3f">{{ Cuestionariohoyetiqueta }}</span><span class="m3g">{{ Cuestionariohoymillones }}</span></div>
              <p class="ms">{{ Cuestionariocierre }}</p>
            </div></mt-if>
          </div>
          <div class="m3h">
            <mt-if value="{{ Cuestionarioerror }}"><span class="m3i">{{ Cuestionarioerror }}</span></mt-if>
            <button class="m3j" al-clic="{{ Cuestionariosiguiente }}">{{ Cuestionarioaccion }}</button>
          </div>
        </div>
      </mt-if>
`;

