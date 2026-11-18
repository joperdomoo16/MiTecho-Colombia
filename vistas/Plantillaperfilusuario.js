// Plantilla de la pantalla de perfil del titular, segundo solicitante, recordatorios y opciones de la cuenta

const Plantillaperfilusuario = `
<mt-if value="{{ Esperfil }}">
        <div class="mt-scroll m3l">
          <div class="m3m"><button class="m3n" al-clic="{{ Cerrarpanel }}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>Volver</button><span class="m3o">MI PERFIL</span></div>
          <div class="m3p">
            <div style="position:relative;flex:none">
              <mt-if value="{{ Esusuariopro }}">
                <div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);padding:2px 8px;border-radius:6px;background:#FFD23F;color:#0B0C0A;font:700 9px/1 'IBM Plex Mono',monospace;letter-spacing:.06em;box-shadow:0 2px 6px rgba(0,0,0,.35);white-space:nowrap;z-index:2;pointer-events:none">
                  MI TECHO PRO
                </div>
              </mt-if>
              <div class="m3q" al-clic="{{ Abrirselectorfoto }}" title="Cambiar foto de perfil" style="overflow:hidden;position:relative;background:{{ Avatarfondo }};color:{{ Avatartexto }};cursor:pointer;border:{{ Avatarbordegrande }};box-sizing:border-box">
                <mt-if value="{{ Tieneavatarimagen }}"><img src="{{ Avatarimagen }}" alt="Foto" style="width:100%;height:100%;object-fit:cover;display:block"></mt-if>
                <mt-if value="{{ Sinavatarimagen }}">{{ Iniciales }}</mt-if>
              </div>
              <button al-clic="{{ Abrirselectorfoto }}" aria-label="Cambiar foto de perfil" title="Cambiar foto de perfil" style="position:absolute;bottom:0;right:0;width:28px;height:28px;border-radius:14px;background:var(--ik);color:var(--bg);border:2px solid var(--cd);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.3)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </button>
            </div>
            <div class="m3r">
              <span class="m3s">{{ Nombrecompletousuario }}</span>
              <span class="m3t">{{ Correovisible }}</span>
              <div style="display:flex;align-items:center;gap:10px;margin-top:4px">
                <button al-clic="{{ Abrirselectorfoto }}" style="padding:0;background:none;border:none;font:600 12.5px 'Familjen Grotesk',sans-serif;color:var(--at);cursor:pointer;text-align:left">
                  Cambiar foto
                </button>
                <mt-if value="{{ Tieneavatarimagen }}">
                  <span style="color:var(--ln);font-size:12px">·</span>
                  <button al-clic="{{ Quitaravatarimagen }}" style="padding:0;background:none;border:none;font:500 12.5px 'Familjen Grotesk',sans-serif;color:var(--al);cursor:pointer">
                    Quitar foto
                  </button>
                </mt-if>
              </div>
            </div>
          </div>
          <div class="m3u"><div class="m3v"><span class="m3w">CON ESTOS DATOS TU TECHO VALE</span><span class="m3x">\${{ Preciodestacado }} M</span></div><span class="m3y">Se actualiza mientras editas</span></div>
          <div class="m3z">Datos personales</div>
          <div class="m40"><label class="m41"><span class="m42">NOMBRE COMPLETO</span><input class="m43" maxlength="70" value="{{ Perfilnombre }}" al-escribir="{{ Escribirperfilnombre }}" placeholder="Tu nombre" aria-label="NOMBRE COMPLETO"></label><label class="m41"><span class="m42">EDAD</span><input class="m43" maxlength="2" value="{{ Perfiledad }}" al-escribir="{{ Escribirperfiledad }}" inputMode="numeric" placeholder="0" aria-label="EDAD"></label><div class="m44">
            <span class="m42">CIUDAD</span>
            <button al-clic="{{ Alternarciudad }}" aria-expanded="{{ Ciudadabierta }}" style="width:100%;min-height:48px;padding:0 12px 0 14px;border-radius:16px;background:var(--c2);border:1px solid {{ Ciudadborde }};display:flex;align-items:center;gap:10px;text-align:left;box-sizing:border-box">
              <span class="m45"><span class="m46">{{ Ciudad }}</span><span class="m47">{{ Ciudaddepartamento }}</span></span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--mu);transform:{{ Ciudadflecha }};transition:transform .2s ease-out;flex:none"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
            <mt-if value="{{ Ciudadabierta }}">
              <div class="m48">
                <div class="m49">
                  <svg class="m4a" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>
                  <input class="m4b" maxlength="50" value="{{ Ciudadbusqueda }}" al-escribir="{{ Escribirciudad }}" autoFocus="{{ true }}" placeholder="Escribe para buscar" aria-label="Buscar ciudad">
                  <span class="m4c">{{ Ciudadconteo }}</span>
                </div>
                <div class="mt-scroll m4d">
                  <mt-for list="{{ Ciudadlista }}" as="Ciudadfila"><button al-clic="{{ Ciudadfila.Alclic }}" style="width:100%;min-height:44px;padding:8px 14px;display:flex;align-items:center;gap:10px;text-align:left;background:{{ Ciudadfila.Fondo }};border-bottom:1px solid var(--ln)"><span class="m45"><span style="font:600 14px 'Hanken Grotesk',sans-serif;color:{{ Ciudadfila.Color }}">{{ Ciudadfila.Nombreitem }}</span><span style="font:400 11.5px 'Hanken Grotesk',sans-serif;color:{{ Ciudadfila.Subtexto }}">{{ Ciudadfila.Departamento }}</span></span><mt-if value="{{ Ciudadfila.Seleccion }}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" style="color:{{ Ciudadfila.Color }};flex:none"><path d="M5 12l5 5L20 7"></path></svg></mt-if></button></mt-for>
                  <mt-if value="{{ Ciudadvacia }}"><div class="m4e">No encontramos esa ciudad. Revisa cómo la escribiste.</div></mt-if>
                </div>
              </div>
            </mt-if>
          </div></div>
          <div class="m4f">{{ Edadpista }}</div>
          <div class="m3z">Ingresos</div>
          <div class="m40"><div class="m4g"><span class="m42">TIPO DE INGRESO</span><div class="m1w"><mt-for list="{{ Perfiltipofichas }}" as="Ficha"><button al-clic="{{ Ficha.Alclic }}" style="height:36px;padding:0 13px;border-radius:18px;border:1px solid {{ Ficha.Borde }};background:{{ Ficha.Fondo }};color:{{ Ficha.Color }};font:600 12.5px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ Ficha.Etiqueta }}</button></mt-for></div></div><mt-if value="{{ Perfilmostrarfijo }}"><label class="m41"><span class="m42">SALARIO O INGRESO FIJO MENSUAL</span><input class="m43" maxlength="13" value="{{ Perfilfijo }}" al-escribir="{{ Escribirperfilfijo }}" inputMode="numeric" placeholder="$0" aria-label="SALARIO O INGRESO FIJO MENSUAL"></label></mt-if><mt-if value="{{ Perfilmostrarvariable }}"><label class="m41"><span class="m42">INGRESOS VARIABLES AL MES</span><input class="m43" maxlength="13" value="{{ Perfilvariable }}" al-escribir="{{ Escribirperfilvariable }}" inputMode="numeric" placeholder="$0" aria-label="INGRESOS VARIABLES AL MES"></label></mt-if><div class="m4h"><span class="m2n">Ingreso mensual</span><span class="m4i">{{ Perfilingresototal }}</span></div></div>
          <div class="m3z">Ahorro y metas</div>
          <div class="m40"><label class="m41"><span class="m42">AHORRO PARA CUOTA INICIAL</span><input class="m43" maxlength="15" value="{{ Perfilahorro }}" al-escribir="{{ Escribirperfilahorro }}" inputMode="numeric" placeholder="$0" aria-label="AHORRO PARA CUOTA INICIAL"></label><label class="m41"><span class="m42">CUÁNTO AHORRAS AL MES</span><input class="m43" maxlength="13" value="{{ Perfilahorromes }}" al-escribir="{{ Escribirperfilahorromes }}" inputMode="numeric" placeholder="$0" aria-label="CUÁNTO AHORRAS AL MES"></label><label class="m4j" data-campo="vivienda-objetivo"><span class="m42">PRECIO DE LA VIVIENDA QUE BUSCAS</span><input class="m43" maxlength="16" value="{{ Perfilobjetivo }}" al-escribir="{{ Escribirperfilobjetivo }}" inputMode="numeric" placeholder="$0" aria-label="Precio de la vivienda que buscas"><span class="m2f">{{ Perfilmetainfo }}</span></label></div>
          <div class="m3z">Caja de compensación y subsidios</div>
          <div class="m40">
            <button class="m2u" al-clic="{{ Alternarcaja }}"><div class="m2a"><span class="m2v">Estoy afiliado a una Caja</span><span class="m4k">Necesario para recibir subsidio de vivienda</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ Cajariel }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ Cajaperilla }};transform:{{ Cajaposicion }};transition:transform .18s ease-out"></div></div></button>
            <mt-if value="{{ Cajaactiva }}"><div class="m4l"><span class="m42">TU CAJA</span><div class="m1w"><mt-for list="{{ Cajafichas }}" as="Ficha"><button al-clic="{{ Ficha.Alclic }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ Ficha.Borde }};background:{{ Ficha.Fondo }};color:{{ Ficha.Color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ Ficha.Etiqueta }}</button></mt-for></div></div></mt-if>
            <button class="m2y" al-clic="{{ Alternarsisben }}"><div class="m2a"><span class="m2v">Tengo Sisbén</span><span class="m2w">Permite postularte a Mi Casa Ya (sujeto a cupos)</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ Sisbenriel }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ Sisbenperilla }};transform:{{ Sisbenposicion }};transition:transform .18s ease-out"></div></div></button>
            <mt-if value="{{ Sisbenactivo }}"><div class="m4m"><span class="m42">GRUPO SISBÉN IV</span><div class="m1w"><mt-for list="{{ Sisbengrupoopciones }}" as="Opcion"><button al-clic="{{ Opcion.Alclic }}" style="flex:1;min-width:64px;height:38px;padding:0 10px;border-radius:19px;border:1px solid {{ Opcion.Borde }};background:{{ Opcion.Fondo }};color:{{ Opcion.Color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap">{{ Opcion.Etiqueta }}</button></mt-for></div></div></mt-if>
          </div>
          <div style="margin:8px 14px 0;padding:14px 16px;border-radius:20px;background:{{ Perfilsubsidiofondo }};display:flex;flex-direction:column;gap:4px"><span style="font:500 10.5px 'IBM Plex Mono',monospace;color:{{ Perfilsubsidioantetitulo }}">TU HOGAR GANA {{ Salariosminimostexto }} SMMLV</span><span style="font:600 15px/1.35 'Hanken Grotesk',sans-serif;color:{{ Perfilsubsidiocolor }};text-wrap:pretty">{{ Perfilsubsidiomensaje }}</span></div>
          <mt-if value="{{ Mostrarafiliacion }}"><div class="m4n">{{ Afiliacionmensaje }}</div></mt-if>
          <div class="m4o"><span class="m2v">Datos de tu Caja o del FNA</span><span class="m42">OPCIONAL</span></div>
          <div class="m4p">Si ya tienes esta información, escríbela y tu estimado se ajusta a tu caso real. Deja en blanco lo que no sepas.</div>
          <div class="m4q"><mt-for list="{{ Entidadpestanas }}" as="Pestanaentidad"><button al-clic="{{ Pestanaentidad.Alclic }}" style="border-radius:18px;background:{{ Pestanaentidad.Fondo }};color:{{ Pestanaentidad.Color }};font:600 13px 'Familjen Grotesk',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 6px">{{ Pestanaentidad.Etiqueta }}</button></mt-for></div>
          <div class="m4r">
            <div class="m4s"><span class="m4t">Precisión del estimado</span><span class="m4u">{{ Entidadprecisionetiqueta }}</span></div>
            <div class="m4v"><div style="height:100%;width:{{ Entidadprecisionancho }};background:var(--ac);border-radius:4px;transition:width .4s ease-out"></div></div>
            <mt-for list="{{ Entidadusando }}" as="Usofila"><span class="m4w">✓ {{ Usofila }}</span></mt-for>
          </div>
          <mt-for list="{{ Entidadsecciones }}" as="Seccionentidad">
            <div class="m4x">
              <div class="m4y"><span class="m4z">{{ Seccionentidad.Numeroseccion }}</span><span class="m2c">{{ Seccionentidad.Titulo }}</span></div>
              <span class="m2f">{{ Seccionentidad.Descripcioncorta }}</span>
              <mt-if value="{{ Seccionentidad.status }}"><div style="padding:10px 12px;border-radius:14px;background:{{ Seccionentidad.Estadofondo }};font:600 12.5px/1.4 'Hanken Grotesk',sans-serif;color:#0B0C0A">{{ Seccionentidad.status }}</div></mt-if>
              <mt-for list="{{ Seccionentidad.Campos }}" as="Campoentidad">
                  <mt-if value="{{ Campoentidad.Esfichas }}"><div class="m50"><span class="m42">{{ Campoentidad.Etiqueta }}</span><div class="m1w"><mt-for list="{{ Campoentidad.Opciones }}" as="Opcioncampo"><button al-clic="{{ Opcioncampo.Alclic }}" style="height:34px;padding:0 12px;border-radius:17px;border:1px solid {{ Opcioncampo.Borde }};background:{{ Opcioncampo.Fondo }};color:{{ Opcioncampo.Color }};font:600 12px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ Opcioncampo.Etiqueta }}</button></mt-for></div></div></mt-if>
                  <mt-if value="{{ Campoentidad.Escampo }}"><label class="m51"><span class="m42">{{ Campoentidad.Etiqueta }}</span><input maxlength="20" class="m52" value="{{ Campoentidad.Valorcampo }}" al-escribir="{{ Campoentidad.Alescribir }}" inputMode="{{ Campoentidad.Modoteclado }}" placeholder="{{ Campoentidad.Ejemplo }}" aria-label="{{ Campoentidad.Etiqueta }}"><mt-if value="{{ Campoentidad.Pista }}"><span class="m53">{{ Campoentidad.Pista }}</span></mt-if></label></mt-if>
                </mt-for>
            </div>
          </mt-for>
          <div class="m54"><button class="m55" al-clic="{{ Entidadlimpiar }}">Borrar datos de {{ Entidadpestananombre }}</button></div>
          <div class="m3z">Vivienda que buscas</div>
          <div class="m56">
            <mt-for list="{{ Modalidadopciones }}" as="Modalidadopcion"><button al-clic="{{ Modalidadopcion.Alclic }}" style="padding:14px 12px;border-radius:20px;border:1px solid {{ Modalidadopcion.Borde }};background:{{ Modalidadopcion.Fondo }};text-align:left;display:flex;flex-direction:column;gap:6px"><span style="font:600 14px 'Familjen Grotesk',sans-serif;color:{{ Modalidadopcion.Color }}">{{ Modalidadopcion.Etiqueta }}</span><span style="font:500 11px 'IBM Plex Mono',monospace;color:{{ Modalidadopcion.Subtexto }}">{{ Modalidadopcion.Descripcioncorta }}</span></button></mt-for>
          </div>
          <div class="m3z">Deudas</div>
          <button class="m57" al-clic="{{ Perfilirdeudas }}"><div class="m2a"><span class="m2v">{{ Perfildeudascantidad }}</span><span class="m4k">{{ Perfildeudassuma }}</span></div><span class="m58">Administrar →</span></button>
          <div class="m5f">
            <button class="m5g" al-clic="{{ Perfilexportar }}">{{ Perfilexportartexto }}</button>
            <button class="m5h" al-clic="{{ Perfileliminar }}">Borrar mi cuenta</button>
          </div>
        </div>
      </mt-if>
      <mt-if value="{{ Esrecordatorio }}">
        <div class="mt-scroll m3l">
          <div class="m3m"><button class="m3n" al-clic="{{ Cerrarpanel }}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>Volver</button><span class="m3o">RECORDATORIOS</span></div>
          <div class="m5i">
            <h1 class="m5j">Recordatorios</h1>
            <p class="ms">Te avisamos para que no se te pase ningún registro y tu promedio no se caiga.</p>
          </div>
          <div style="margin:20px 14px 0;padding:14px;border-radius:24px;background:rgba(127,127,127,.14);border:1px solid var(--ln);display:flex;gap:12px;align-items:flex-start;opacity:{{ Recordatoriovistaopacidad }};transition:opacity .2s ease-out">
            <img class="m5k" src="assets/Logoapp.webp" width="128" height="128" alt="">
            <div class="m5l"><div class="m5m"><span class="m5n">MiTecho</span><span class="m4k">{{ Recordatoriohora }}</span></div><span class="m5o">{{ Recordatoriovista }}</span></div>
          </div>
          <div class="m5p">VISTA PREVIA</div>
          <div class="m3z">Registro diario</div>
          <div class="m40">
            <button class="m2u" al-clic="{{ Alternardiario }}"><div class="m2a"><span class="m2v">Recordarme registrar</span><span class="m4k">Un aviso al final del día</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ Diarioriel }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ Diarioperilla }};transform:{{ Diarioposicion }};transition:transform .18s ease-out"></div></div></button>
            <mt-if value="{{ Diarioactivo }}">
              <div class="m4l"><span class="m42">HORA</span><div class="m1w"><mt-for list="{{ Horafichas }}" as="Ficha"><button al-clic="{{ Ficha.Alclic }}" style="height:36px;padding:0 13px;border-radius:18px;border:1px solid {{ Ficha.Borde }};background:{{ Ficha.Fondo }};color:{{ Ficha.Color }};font:600 12.5px 'Hanken Grotesk',sans-serif;white-space:nowrap">{{ Ficha.Etiqueta }}</button></mt-for></div></div>
              <div class="m5q"><span class="m42">DÍAS</span><div class="m5r"><mt-for list="{{ Diafichas }}" as="Diafila"><button al-clic="{{ Diafila.Alclic }}" style="height:42px;border-radius:21px;border:1px solid {{ Diafila.Borde }};background:{{ Diafila.Fondo }};color:{{ Diafila.Color }};font:600 13px 'Familjen Grotesk',sans-serif">{{ Diafila.Etiqueta }}</button></mt-for></div></div>
            </mt-if>
          </div>
          <div class="m3z">Otros avisos</div>
          <div class="m40">
            <mt-for list="{{ Recordatoriointerruptores }}" as="Opciontipo"><button class="m2u" al-clic="{{ Opciontipo.Alclic }}"><div class="m2a"><span class="m2v">{{ Opciontipo.Etiqueta }}</span><span class="m2w">{{ Opciontipo.Subtexto }}</span></div><div style="width:54px;height:32px;border-radius:16px;background:{{ Opciontipo.Riel }};position:relative;flex:none;transition:background .15s ease-out"><div style="position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:13px;background:{{ Opciontipo.Perilla }};transform:{{ Opciontipo.Posicion }};transition:transform .18s ease-out"></div></div></button></mt-for>
          </div>
        </div>
      </mt-if>
`;

