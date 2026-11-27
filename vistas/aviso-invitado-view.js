// Plantilla del aviso antes de entrar sin cuenta y de la elección de datos al vincular una cuenta existente

const Plantillaavisoinvitado = `
      <mt-if value="{{ Avisoinvitadovisible }}">
        <div class="hoja-capa">
          <button type="button" class="hoja-velo" al-clic="{{ Cerraravisoinvitado }}" aria-label="Cerrar aviso"></button>
          <section role="dialog" aria-modal="true" aria-labelledby="titulo-invitado" aria-describedby="texto-invitado" class="mt-sheet hoja">
            <div class="hoja-manija" aria-hidden="true"></div>
            <span class="invitado-icono" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><path d="M12 9v4M12 17h.01"></path></svg></span>
            <h2 id="titulo-invitado" class="hoja-titulo">Continuar sin iniciar sesión</h2>
            <p id="texto-invitado" class="texto-cuerpo">Al continuar de forma anónima, está la posibilidad de que pierdas los datos ingresados. Podrás vincular tu cuenta en los ajustes cuando quieras.</p>
            <button type="button" class="boton-primario" al-clic="{{ Continuarinvitado }}">Continuar de forma anónima</button>
            <button type="button" class="boton-secundario" al-clic="{{ Cerraravisoinvitado }}">Volver e iniciar sesión</button>
          </section>
        </div>
      </mt-if>
      <mt-if value="{{ Vinculacionvisible }}">
        <div class="hoja-capa">
          <div class="hoja-velo"></div>
          <section role="alertdialog" aria-modal="true" aria-labelledby="titulo-vinculacion" aria-describedby="texto-vinculacion" class="mt-sheet hoja">
            <div class="hoja-manija" aria-hidden="true"></div>
            <h2 id="titulo-vinculacion" class="hoja-titulo">Esta cuenta ya tiene datos</h2>
            <p id="texto-vinculacion" class="texto-cuerpo">{{ Vinculaciontexto }}</p>
            <button type="button" class="vincular-opcion" al-clic="{{ Usardatoscelular }}"><span class="vincular-opciontitulo">Usar los de este celular</span><span class="vincular-opciontexto">Reemplazan el perfil que tenía la cuenta.</span></button>
            <button type="button" class="vincular-opcion" al-clic="{{ Usardatoscuenta }}"><span class="vincular-opciontitulo">Usar los de mi cuenta</span><span class="vincular-opciontexto">Lo que escribiste sin cuenta se borra de este celular.</span></button>
            <button type="button" class="invitado-boton" al-clic="{{ Cancelarvinculacion }}">Cancelar y seguir sin cuenta</button>
          </section>
        </div>
      </mt-if>
`;
