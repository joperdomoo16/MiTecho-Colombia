// Plantilla del aviso antes de borrar la cuenta: deja claro que no se puede deshacer y qué se conserva por ley

const Plantillaeliminacion = `
      <sc-if value="{{ Tieneeliminacion }}" hint-placeholder-val="{{ false }}">
        <div al-clic="{{ Cancelareliminacion }}" style="position:absolute;inset:0;background:rgba(0,0,0,.72);z-index:58"></div>
        <section role="alertdialog" aria-modal="true" aria-labelledby="titulo-eliminacion" aria-describedby="texto-eliminacion" class="mt-sheet" style="position:absolute;left:0;right:0;bottom:0;background:var(--cd);border-radius:32px 32px 0 0;border-top:1px solid var(--ln);padding:22px 18px 28px;z-index:59;display:flex;flex-direction:column;gap:14px;max-height:92dvh;overflow-y:auto;box-sizing:border-box">
          <div style="flex:none;display:flex;flex-direction:column;gap:8px">
            <span style="font:600 11px 'IBM Plex Mono',monospace;letter-spacing:.12em;color:var(--al)">ACCIÓN IRREVERSIBLE</span>
            <h2 id="titulo-eliminacion" class="mee" style="margin:0">Borrar mi cuenta</h2>
            <p id="texto-eliminacion" style="margin:0;font:600 15px/1.45 'Hanken Grotesk',sans-serif;color:var(--ik)">Este proceso es irreversible. Si lo aceptas, no será posible deshacerlo.</p>
          </div>
          <div style="flex:none;display:flex;flex-direction:column;gap:10px;background:var(--c2);border:1px solid var(--ln);border-radius:20px;padding:14px 16px">
            <p style="margin:0;font:400 13.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--ik)"><b style="font-family:'Familjen Grotesk',sans-serif">Se borran:</b> tu cuenta, tu perfil financiero, tus reportes PDF y todo lo guardado en este celular.</p>
            <p style="margin:0;font:400 13.5px/1.5 'Hanken Grotesk',sans-serif;color:var(--ik)"><b style="font-family:'Familjen Grotesk',sans-serif">Se conservan, como lo exige la ley:</b> la prueba de tu autorización, el registro de tus solicitudes de soporte y la constancia de este borrado (correo y fecha).</p>
          </div>
          <sc-if value="{{ Eliminacionpro }}" hint-placeholder-val="{{ false }}">
            <p style="flex:none;margin:0;font:600 13px/1.45 'Hanken Grotesk',sans-serif;color:var(--al)">Borrar la cuenta no cancela tu suscripción a MiTecho Pro. Cancélala primero en Google Play para que no te sigan cobrando.</p>
          </sc-if>
          <sc-if value="{{ Eliminacionerror }}" hint-placeholder-val="{{ false }}">
            <span class="mz" role="alert">{{ Eliminacionerror }}</span>
          </sc-if>
          <button type="button" al-clic="{{ Confirmareliminacion }}" style="flex:none;width:100%;height:50px;border-radius:25px;border:none;background:var(--al);color:#0B0C0A;font:700 14.5px 'Familjen Grotesk',sans-serif;cursor:pointer">{{ Eliminacionbotontexto }}</button>
          <button type="button" al-clic="{{ Cancelareliminacion }}" style="flex:none;height:44px;background:none;border:1px solid var(--ln);border-radius:22px;font:600 13.5px 'Familjen Grotesk',sans-serif;color:var(--ik);cursor:pointer">Cancelar</button>
        </section>
      </sc-if>
`;
