// Plantilla de la ventana de autorización de datos. No tiene botón de cerrar: o se autoriza o se sale de la cuenta

const Plantillaautorizacion = `
      <sc-if value="{{ Autorizacionvisible }}" hint-placeholder-val="{{ false }}">
        <div style="position:absolute;inset:0;background:rgba(0,0,0,.72);z-index:58"></div>
        <section role="dialog" aria-modal="true" aria-labelledby="titulo-autorizacion" class="mt-sheet" style="position:absolute;left:0;right:0;bottom:0;background:var(--cd);border-radius:32px 32px 0 0;border-top:1px solid var(--ln);padding:22px 18px 28px;z-index:59;display:flex;flex-direction:column;gap:14px;max-height:92dvh;overflow-y:auto;box-sizing:border-box">
          <div style="flex:none;display:flex;flex-direction:column;gap:6px">
            <span style="font:600 11px 'IBM Plex Mono',monospace;letter-spacing:.12em;color:var(--at)">ANTES DE CONTINUAR</span>
            <h2 id="titulo-autorizacion" class="mee" style="margin:0">Tu autorización para el tratamiento de tus datos</h2>
            <p class="m3t" style="margin:0">Para usar MiTecho necesitamos que leas esto y nos des tu autorización, como lo pide la Ley 1581 de 2012.</p>
          </div>
          <div style="flex:none;display:flex;flex-direction:column;gap:10px;background:var(--c2);border:1px solid var(--ln);border-radius:20px;padding:14px 16px">
            <p style="margin:0;font:400 13.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--ik)"><b style="font-family:'Familjen Grotesk',sans-serif">MiTecho es una app de cálculos teóricos.</b> Los resultados son estimaciones educativas. No son una aprobación de crédito ni una oferta de un banco o una constructora.</p>
            <p style="margin:0;font:400 13.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--ik)"><b style="font-family:'Familjen Grotesk',sans-serif">Tus datos no se venden ni se comparten con terceros.</b> MiTecho no los usa para publicidad, estudios de crédito ni ningún otro fin.</p>
            <p style="margin:0;font:400 13.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--ik)"><b style="font-family:'Familjen Grotesk',sans-serif">¿Para qué se guardan?</b> Solo para que la app funcione con tu cuenta (tu perfil financiero y los reportes que generes) y para atender las solicitudes de soporte que tú nos envíes. Tus registros diarios de ingresos y gastos se quedan solo en tu celular.</p>
            <p style="margin:0;font:400 13.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--ik)"><b style="font-family:'Familjen Grotesk',sans-serif">¿Quién los procesa?</b> Solo los proveedores técnicos que hacen funcionar la app: Supabase para guardarlos y Google para el inicio de sesión y el registro de soporte. Lo hacen bajo nuestras instrucciones y no pueden usarlos para nada más.</p>
            <p style="margin:0;font:400 13.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--ik)"><b style="font-family:'Familjen Grotesk',sans-serif">Anuncios.</b> La versión gratuita puede mostrar anuncios de Google AdMob, que usa el identificador publicitario de tu celular, nunca tus datos financieros. Puedes limitarlo desde los ajustes del celular.</p>
          </div>
          <a href="{{ Urlpolitica }}" target="_blank" rel="noopener noreferrer" style="flex:none;display:flex;align-items:center;justify-content:center;text-align:center;min-height:44px;padding:10px 18px;box-sizing:border-box;border-radius:22px;border:1px solid var(--ln);color:var(--ik);font:600 13.5px 'Familjen Grotesk',sans-serif;text-decoration:none">Leer la política de tratamiento de datos completa</a>
          <a href="{{ Urlterminos }}" target="_blank" rel="noopener noreferrer" style="flex:none;align-self:center;padding:4px 8px;color:var(--at);font:600 13px 'Familjen Grotesk',sans-serif;text-decoration:underline;text-underline-offset:3px">Leer los términos de uso</a>
          <button type="button" role="checkbox" aria-checked="{{ Autorizacionmarcadatexto }}" al-clic="{{ Marcarautorizacion }}" style="flex:none;display:flex;align-items:flex-start;gap:12px;background:none;border:none;padding:4px 0;text-align:left;cursor:pointer">
            <span aria-hidden="true" style="flex:none;width:24px;height:24px;border-radius:8px;border:2px solid {{ Autorizacioncasillaborde }};background:{{ Autorizacioncasillafondo }};color:var(--oa);display:flex;align-items:center;justify-content:center;font:700 15px 'Familjen Grotesk',sans-serif;box-sizing:border-box">{{ Autorizacioncasillasigno }}</span>
            <span style="font:500 13.5px/1.45 'Hanken Grotesk',sans-serif;color:var(--ik)">Soy mayor de 18 años, he leído la política y los términos de uso, y autorizo a RumoriaStudio, creadores de MiTecho, a tratar mis datos según la Ley 1581 de 2012.</span>
          </button>
          <sc-if value="{{ Autorizacionerror }}" hint-placeholder-val="{{ false }}">
            <span class="mz" role="alert">{{ Autorizacionerror }}</span>
          </sc-if>
          <button type="button" al-clic="{{ Aceptarautorizacion }}" aria-disabled="{{ Autorizacionbotonbloqueado }}" style="flex:none;width:100%;height:50px;border-radius:25px;border:none;background:{{ Autorizacionbotonfondo }};color:{{ Autorizacionbotoncolor }};font:700 14.5px 'Familjen Grotesk',sans-serif;cursor:pointer;transition:background .15s ease-out">{{ Autorizacionbotontexto }}</button>
          <button type="button" al-clic="{{ Rechazarautorizacion }}" style="flex:none;height:44px;background:none;border:none;font:600 13px 'Familjen Grotesk',sans-serif;color:var(--mu);cursor:pointer">No autorizo y salgo</button>
          <p style="flex:none;margin:0;text-align:center;font:400 11.5px/1.45 'Hanken Grotesk',sans-serif;color:var(--mu)">Puedes revocar tu autorización cuando quieras escribiendo a rumoriastudio@gmail.com o borrando tu cuenta desde tu perfil.</p>
        </section>
      </sc-if>
`;
