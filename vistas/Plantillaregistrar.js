// Plantilla de la hoja Registrar: primero se elige qué anotar y luego se llena ese formulario

const Svgcerrarregistro = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"></path></svg>';
const Svgpistaregistro = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>';
const Fichasregistro = (Lista, Rotulo, Identificador) => `<div class="registro-grupo"><span id="${Identificador}" class="registro-rotulo">${Rotulo}</span><div class="registro-fichas" role="group" aria-labelledby="${Identificador}"><mt-for list="{{ ${Lista} }}" as="Ficha"><button type="button" class="registro-ficha {{ Ficha.Clase }}" aria-pressed="{{ Ficha.Activo }}" al-clic="{{ Ficha.Alclic }}">{{ Ficha.Etiqueta }}</button></mt-for></div></div>`;
const Nombreregistro = (Condicion, Valor, Escribir, Ejemplo) => `<mt-if value="{{ ${Condicion} }}"><label class="registro-campo"><span class="registro-rotulo">Nombre (opcional)</span><input class="registro-entrada" maxlength="60" value="{{ ${Valor} }}" al-escribir="{{ ${Escribir} }}" placeholder="${Ejemplo}"></label></mt-if>`;
const Montoregistro = (Pregunta, Signo, Clase, Valor, Escribir) => `<label class="registro-campo"><span class="registro-rotulo">${Pregunta}</span><span class="registro-monto"><span class="registro-signo ${Clase}">${Signo}</span><input class="registro-monto-entrada" maxlength="12" value="{{ ${Valor} }}" al-escribir="{{ ${Escribir} }}" inputMode="numeric" placeholder="0"></span></label>`;
const Pistaregistro = (Valor, Clase) => `<div class="registro-pista ${Clase}">${Svgpistaregistro}<p>{{ ${Valor} }}</p></div>`;
const Errorregistro = '<mt-if value="{{ Formularioerror }}"><p class="registro-error" role="alert">{{ Formularioerror }}</p></mt-if>';

const Plantillaregistrar = `
      <mt-if value="{{ Tienehoja }}">
        <div class="hoja-capa">
          <button type="button" class="hoja-velo" al-clic="{{ Cerrarhoja }}" aria-label="Cerrar"></button>
          <section class="hoja mt-sheet registro" role="dialog" aria-modal="true" aria-labelledby="titulo-registro">
            <div class="hoja-manija" aria-hidden="true"></div>
            <mt-if value="{{ Hojaenmenu }}">
              <div class="hoja-cabecera"><div class="registro-encabezado"><h2 id="titulo-registro" class="hoja-titulo">¿Qué quieres registrar?</h2><p class="texto-pequeno">Te contamos cómo afecta cada cosa a tu presupuesto.</p></div><button type="button" class="hoja-cerrar" al-clic="{{ Cerrarhoja }}" aria-label="Cerrar">${Svgcerrarregistro}</button></div>
              <div class="registro-opciones"><mt-for list="{{ Registroopciones }}" as="Opcion"><button type="button" class="registro-opcion" al-clic="{{ Opcion.Alclic }}"><span class="registro-opcion-icono" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{ Opcion.Icono }}"></path></svg></span><span class="registro-opcion-textos"><span class="registro-opcion-titulo">{{ Opcion.Titulo }}</span><span class="texto-pequeno">{{ Opcion.Detalle }}</span><span class="registro-opcion-efecto {{ Opcion.Clase }}">{{ Opcion.Efecto }}</span></span><svg class="registro-opcion-flecha" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></button></mt-for></div>
            </mt-if>
            <mt-if value="{{ Hojaenformulario }}">
              <div class="registro-cabecera"><button type="button" class="registro-atras" al-clic="{{ Hojavolvermenu }}" aria-label="Volver a las opciones"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button><h2 id="titulo-registro" class="hoja-titulo registro-titulo">{{ Hojatitulo }}</h2><button type="button" class="hoja-cerrar" al-clic="{{ Cerrarhoja }}" aria-label="Cerrar">${Svgcerrarregistro}</button></div>

              <mt-if value="{{ Hojaingresodia }}">
                ${Montoregistro('¿Cuánto recibiste?', '$', '', 'Formulariomontotexto', 'Escribirmonto')}
                <div class="registro-fichas"><mt-for list="{{ Fichasrapidas }}" as="Ficha"><button type="button" class="registro-ficha registro-ficha-rapida" al-clic="{{ Ficha.Alclic }}">{{ Ficha.Etiqueta }}</button></mt-for></div>
                ${Fichasregistro('Fuentefichas', '¿De dónde viene?', 'registro-fuente')}
                ${Nombreregistro('Ingresootro', 'Ingresonombre', 'Escribiringresonombre', 'Ej. Venta de postres')}
                ${Fichasregistro('Mediofichas', '¿Cómo lo recibiste?', 'registro-medio')}
                ${Pistaregistro('Hojaingresopista', '{{ Hojaingresopistaclase }}')}
                ${Errorregistro}
                <button type="button" class="boton-primario" al-clic="{{ Guardarregistro }}">{{ Guardaretiqueta }}</button>
              </mt-if>

              <mt-if value="{{ Hojaegresodia }}">
                ${Montoregistro('¿Cuánto gastaste?', '−$', 'is-gasto', 'Gastomontotexto', 'Escribirgastomonto')}
                ${Fichasregistro('Gastocategoriafichas', '¿En qué?', 'registro-categoria')}
                ${Nombreregistro('Gastootro', 'Gastonombre', 'Escribirgastonombre', 'Ej. Regalo de cumpleaños')}
                ${Fichasregistro('Gastomediofichas', '¿Cómo pagaste?', 'registro-pago')}
                <div class="registro-pista">${Svgpistaregistro}<p>Los gastos del día no cambian lo que te presta el banco, pero sí lo que puedes ahorrar.</p></div>
                ${Errorregistro}
                <button type="button" class="boton-primario" al-clic="{{ Guardargasto }}">{{ Gastoguardaretiqueta }}</button>
              </mt-if>

              <mt-if value="{{ Hojaingresofijo }}">
                ${Montoregistro('¿Cuánto recibes cada mes?', '$', '', 'Ingresofijomontotexto', 'Escribiringresofijomonto')}
                ${Fichasregistro('Ingresofijotipofichas', '¿Qué tipo de ingreso es?', 'registro-tipofijo')}
                ${Nombreregistro('Ingresofijootro', 'Ingresofijonombrecampo', 'Escribiringresofijonombre', 'Ej. Renta de parqueadero')}
                ${Pistaregistro('Ingresofijopista', '')}
                ${Errorregistro}
                <button type="button" class="boton-primario" al-clic="{{ Guardaringresofijo }}">{{ Ingresofijoguardaretiqueta }}</button>
              </mt-if>

              <mt-if value="{{ Hojaegresofijo }}">
                ${Montoregistro('¿Cuánto pagas cada mes?', '$', '', 'Formdeudacuotatexto', 'Escribirdeudacuota')}
                ${Fichasregistro('Deudatipofichas', '¿Qué estás pagando?', 'registro-tipodeuda')}
                ${Nombreregistro('Formdeudaotro', 'Formdeudanombre', 'Escribirdeudanombre', 'Ej. Cuota del gimnasio')}
                <div class="registro-campos">
                  <label class="registro-campo"><span class="registro-rotulo">Cuánto debes</span><input class="registro-entrada" maxlength="15" value="{{ Formdeudasaldotexto }}" al-escribir="{{ Escribirdeudasaldo }}" inputMode="numeric" placeholder="$0"></label>
                  <label class="registro-campo"><span class="registro-rotulo">Entidad (opcional)</span><input class="registro-entrada" maxlength="60" value="{{ Formdeudaentidad }}" al-escribir="{{ Escribirdeudaentidad }}" placeholder="Ej. Bancolombia"></label>
                </div>
                ${Pistaregistro('Formdeudapista', 'is-aviso')}
                ${Errorregistro}
                <button type="button" class="boton-primario" al-clic="{{ Guardardeuda }}">{{ Guardardeudaetiqueta }}</button>
                <mt-if value="{{ Formdeudaeditando }}"><button type="button" class="boton-secundario registro-eliminar" al-clic="{{ Eliminardeudaactual }}">Eliminar esta deuda</button></mt-if>
              </mt-if>
            </mt-if>
          </section>
        </div>
      </mt-if>
`;
