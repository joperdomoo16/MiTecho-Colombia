// Plantilla del Inicio: saludo, presupuesto para vivienda, ahorro, siguiente paso, meta de hoy y viviendas de referencia

const Plantillainicio = `
<mt-if value="{{ Pestanaes.inicio }}">
        <div class="inicio">
          <div class="inicio-saludo"><h1 class="titulo-pantalla">{{ Saludotitulo }}</h1><p class="texto-guia">Esto es lo que podrías comprar hoy, según tus ingresos y tus deudas.</p></div>
          <section class="heroe" aria-label="Tu presupuesto para vivienda" data-tutorial="techo">
            <div class="heroe-cabecera">
              <span class="heroe-rotulo">Tu vivienda puede costar hasta</span>
              <mt-if value="{{ Tipochipvisible }}"><button type="button" class="heroe-tipo" al-clic="{{ Abrirtipovivienda }}" aria-label="{{ Tipochipetiqueta }}" aria-haspopup="dialog"><span class="heroe-tipo-marco">{{ Tipochiptexto }}<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg></span></button></mt-if>
            </div>
            <p class="heroe-precio"><span class="heroe-cifra">\${{ Preciodestacado }}</span><span class="heroe-millones">millones</span></p>
            <div class="heroe-barra" aria-hidden="true"><span class="heroe-tramo-banco" style="flex:{{ Heroebancopeso }}"></span><span class="heroe-tramo-propio" style="flex:{{ Heroepropiopeso }}"></span></div>
            <div class="heroe-partes">
              <div class="heroe-parte"><span class="heroe-parte-rotulo"><span class="heroe-punto heroe-tramo-banco" aria-hidden="true"></span>El banco te presta</span><span class="heroe-parte-valor">{{ Creditomillones }}</span><span class="heroe-parte-nota">{{ Porcentajefinanciado }} del precio</span></div>
              <div class="heroe-parte"><span class="heroe-parte-rotulo"><span class="heroe-punto heroe-tramo-propio" aria-hidden="true"></span>Tú pones</span><span class="heroe-parte-valor">{{ Heroepropiomillones }}</span><span class="heroe-parte-nota">{{ Heroepropionota }}</span></div>
            </div>
            <mt-if value="{{ Tienesubsidio }}"><p class="heroe-subsidio">{{ Heroesubsidiotexto }}</p></mt-if>
            <button type="button" class="heroe-calculo" al-clic="{{ Abrircalculo }}" aria-haspopup="dialog"><span>¿Cómo lo calculamos?</span><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></button>
          </section>
          <section class="tarjeta" data-tutorial="cuotainicial">
            <div class="tarjeta-fila"><span class="tarjeta-icono" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"></rect><path d="M3 10h18M16 14.5h2"></path></svg></span><h2 class="titulo-tarjeta tarjeta-crece">Tu ahorro para comprar</h2><span class="tarjeta-cifra">{{ Ahorroporcentajetexto }}</span></div>
            <div class="progreso" role="progressbar" aria-label="{{ Ahorroprogresoetiqueta }}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{ Ahorroporcentaje }}"><div class="progreso-relleno" style="width:{{ Ahorroancho }}"></div></div>
            <mt-if value="{{ Ahorroconmonto }}"><p class="tarjeta-dato">Tienes <b>{{ Ahorrotienes }}</b> de <b>{{ Ahorronecesario }}</b> <span class="tarjeta-dato-nota">(cuota inicial + notaría y registro)</span></p></mt-if>
            <mt-if value="{{ Ahorroconfalta }}"><p class="texto-cuerpo">Te faltan <b class="dato-alerta">{{ Ahorrofaltamonto }}</b>{{ Ahorrofaltaresto }}</p></mt-if>
            <mt-if value="{{ Ahorroconaviso }}"><p class="texto-cuerpo">{{ Ahorroaviso }}</p></mt-if>
            <button type="button" class="enlace" al-clic="{{ Irplanahorro }}">Ver mi plan de ahorro<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>
          </section>
          <section class="tarjeta tarjeta-paso" aria-labelledby="siguiente-paso" data-tutorial="siguiente">
            <span class="paso-rotulo"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"></path></svg>Tu siguiente paso</span>
            <h2 id="siguiente-paso" class="titulo-tarjeta paso-titulo">{{ Siguientepasotitulo }}</h2>
            <p class="texto-cuerpo texto-tinta"><mt-for list="{{ Siguientepasopartes }}" as="Parte"><mt-if value="{{ Parte.Resaltar }}"><b>{{ Parte.Texto }}</b></mt-if><mt-if value="{{ Parte.Simple }}">{{ Parte.Texto }}</mt-if></mt-for></p>
            <button type="button" class="enlace" al-clic="{{ Irsiguientepaso }}">{{ Siguientepasoaccion }}<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>
          </section>
          <mt-if value="{{ Tieneefectivo }}">
            <button type="button" class="tarjeta tarjeta-efectivo" al-clic="{{ Iringresos }}"><span class="efectivo-icono" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="12" rx="2"></rect><circle cx="12" cy="12" r="2.5"></circle><path d="M6 10v4M18 10v4"></path></svg></span><span class="efectivo-texto">{{ Efectivomensaje }}</span></button>
          </mt-if>
          <mt-if value="{{ Metavisible }}">
            <section class="tarjeta tarjeta-meta" aria-label="Meta de hoy">
              <div class="meta-fila">
                <div class="meta-datos"><span class="texto-pequeno">Hoy llevas</span><span class="meta-cifra">{{ Metahoy }} <span class="meta-de">de {{ Metatexto }}</span></span></div>
                <button type="button" class="boton-secundario boton-chico" al-clic="{{ Abrirhoja }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>Registrar</button>
              </div>
              <div class="progreso progreso-delgado" role="progressbar" aria-label="{{ Metaprogresoetiqueta }}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{ Metaporcentaje }}"><div class="progreso-relleno" style="width:{{ Metaancho }}"></div></div>
              <p class="texto-pequeno con-icono"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2.5"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>{{ Rachatexto }}</p>
            </section>
          </mt-if>
          <button type="button" class="tarjeta-enlace" al-clic="{{ Irofertas }}" data-tutorial="viviendas">
            <span class="tarjeta-enlace-icono" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5l8-2v18M12 21V9l8 2v10M2 21h20M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"></path></svg></span>
            <span class="tarjeta-enlace-textos"><span class="tarjeta-enlace-titulo">Viviendas en tu presupuesto</span><span class="texto-pequeno">{{ Viviendasresumen }}</span></span>
            <svg aria-hidden="true" class="tarjeta-enlace-flecha" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
          </button>
          <p class="texto-pequeno inicio-aviso">MiTecho hace estimados con las reglas vigentes. No es asesoría financiera ni una oferta o aprobación de crédito de ningún banco.</p>
        </div>
        </mt-if>
`;
