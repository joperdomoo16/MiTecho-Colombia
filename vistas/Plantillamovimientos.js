// Plantilla de Movimientos: ingresos y gastos de hoy (o de otro día de la semana), del mes y del año, más los ingresos fijos

const Svgmasmovimientos = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>';
const Svgfilamovimientos = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{ Fila.Icono }}"></path></svg>';

const Plantillamovimientos = `
        <mt-if value="{{ Pestanaes.ingresos }}">
        <div class="movimientos">
          <div class="inicio-saludo"><h1 class="titulo-pantalla">Movimientos</h1><p class="texto-guia">Lo que entra y lo que sale. Con esto calculamos tu promedio.</p></div>
          <div class="segmentos" role="group" aria-label="Tipo de movimiento"><mt-for list="{{ Movtipos }}" as="Tipo"><button type="button" class="segmento {{ Tipo.Clase }}" aria-pressed="{{ Tipo.Activo }}" al-clic="{{ Tipo.Alclic }}">{{ Tipo.Etiqueta }}</button></mt-for></div>
          <div class="periodos" role="group" aria-label="Periodo" data-tutorial="vistas"><mt-for list="{{ Movperiodos }}" as="Periodo"><button type="button" class="periodo {{ Periodo.Clase }}" aria-pressed="{{ Periodo.Activo }}" al-clic="{{ Periodo.Alclic }}">{{ Periodo.Etiqueta }}</button></mt-for></div>
          <mt-if value="{{ Movesdia }}"><div class="dias" role="group" aria-label="Día de la semana"><mt-for list="{{ Movdias }}" as="Dia"><button type="button" class="dia {{ Dia.Clase }}" aria-pressed="{{ Dia.Activo }}" aria-label="{{ Dia.Etiqueta }}" al-clic="{{ Dia.Alclic }}"><span class="dia-letra" aria-hidden="true">{{ Dia.Letra }}</span><span class="dia-numero" aria-hidden="true">{{ Dia.Numero }}</span><span class="dia-punto" aria-hidden="true"></span></button></mt-for></div></mt-if>

          <mt-if value="{{ Movingresodia }}">
            <section class="tarjeta">
              <span class="texto-pequeno">{{ Movdiatitulo }}</span>
              <p class="mov-cifra">{{ Movdiatotal }}</p>
              <mt-if value="{{ Movconmeta }}">
                <div class="mov-meta"><span>{{ Movmetatexto }}</span><span class="mov-meta-porcentaje">{{ Movmetaporcentajetexto }}</span></div>
                <div class="progreso" role="progressbar" aria-label="{{ Movmetaetiqueta }}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{ Movmetaporcentaje }}"><div class="progreso-relleno" style="width:{{ Movmetaancho }}"></div></div>
                <p class="texto-pequeno">Es lo que necesitas ganar por día (26 días al mes) para mantener tu presupuesto.</p>
              </mt-if>
              <mt-if value="{{ Movsinmeta }}"><p class="texto-pequeno">Tus ingresos fijos ya cubren lo que pide tu vivienda. Lo que registres suma a tu presupuesto.</p></mt-if>
              <span class="mov-racha"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2.5"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>{{ Movracha }}</span>
            </section>
            <section class="mov-seccion" aria-labelledby="mov-registros"><h2 id="mov-registros" class="titulo-tarjeta mov-subtitulo">{{ Movregistrostitulo }}</h2>
              <ul class="mov-lista"><mt-for list="{{ Movregistros }}" as="Fila"><li class="mov-fila"><span class="mov-fila-icono" aria-hidden="true">${Svgfilamovimientos}</span><span class="mov-fila-textos"><span class="mov-fila-titulo">{{ Fila.Titulo }}</span><span class="texto-pequeno">{{ Fila.Detalle }}</span></span><span class="mov-fila-montos"><span class="mov-fila-monto">{{ Fila.Monto }}</span><mt-if value="{{ Fila.Sinconsignar }}"><span class="etiqueta is-alerta">Sin consignar</span></mt-if><mt-if value="{{ Fila.Consignado }}"><span class="etiqueta">Consignado</span></mt-if></span></li></mt-for></ul>
              <mt-if value="{{ Movsinregistros }}"><p class="texto-pequeno mov-vacio">{{ Movsinregistrostexto }}</p></mt-if>
            </section>
            <mt-if value="{{ Movefectivovisible }}">
              <section class="mov-efectivo"><div class="mov-efectivo-fila"><span class="mov-efectivo-icono" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="12" rx="2"></rect><circle cx="12" cy="12" r="2.5"></circle><path d="M6 10v4M18 10v4"></path></svg></span><div class="mov-efectivo-textos"><span class="mov-efectivo-titulo">{{ Movefectivotitulo }}</span><p class="texto-cuerpo texto-tinta">El banco solo ve lo que entra a tus cuentas. Consígnalo o pásalo a Nequi o DaviPlata para que cuente.</p></div></div>
                <button type="button" class="boton-secundario mov-efectivo-boton" al-clic="{{ Consignarefectivo }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>Ya lo consigné</button></section>
            </mt-if>
            <button type="button" class="boton-primario" al-clic="{{ Registraringresodia }}">${Svgmasmovimientos}{{ Movregistraringreso }}</button>
          </mt-if>

          <mt-if value="{{ Movingresomes }}">
            <section class="tarjeta">
              <span class="texto-pequeno">{{ Movpromediotitulo }}</span>
              <p class="mov-cifra-linea"><span class="mov-cifra mov-cifra-media">{{ Movpromedio }}</span><span class="mov-cifra-unidad">al mes</span></p>
              <p class="texto-pequeno">Este es el ingreso que usamos para calcular tu presupuesto.</p>
              <div class="mov-barras" role="img" aria-label="{{ Movbarrasetiqueta }}"><mt-for list="{{ Movbarras }}" as="Barra"><div class="mov-barra" aria-hidden="true"><span class="mov-barra-valor">{{ Barra.Valor }}</span><div class="mov-barra-cuerpo {{ Barra.Clase }}" style="height:{{ Barra.Altura }}"></div><span class="mov-barra-mes">{{ Barra.Mes }}</span></div></mt-for></div>
              <p class="texto-pequeno">{{ Movbarrasnota }}</p>
            </section>
            <mt-if value="{{ Movmejorvisible }}"><div class="mov-nota"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"></path><path d="M15 7h6v6"></path></svg><p>{{ Movmejorinicio }}<b>{{ Movmejormonto }}</b>. Si registras así todo el año, tu promedio sube y tu presupuesto también.</p></div></mt-if>
            <section class="mov-seccion" aria-labelledby="mov-fijos"><div class="mov-seccion-cabecera"><h2 id="mov-fijos" class="titulo-tarjeta mov-subtitulo">Ingresos fijos</h2><span class="mov-seccion-total">{{ Movfijostotal }}</span></div>
              <ul class="mov-lista"><mt-for list="{{ Movfijos }}" as="Fila"><li class="mov-fila"><span class="mov-fila-icono" aria-hidden="true">${Svgfilamovimientos}</span><span class="mov-fila-textos"><span class="mov-fila-titulo">{{ Fila.Titulo }}</span><span class="texto-pequeno">{{ Fila.Detalle }}</span></span><span class="mov-fila-monto">{{ Fila.Monto }}</span><mt-if value="{{ Fila.Puedequitar }}"><button type="button" class="mov-quitar" al-clic="{{ Fila.Quitar }}" aria-label="{{ Fila.Quitaretiqueta }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></mt-if></li></mt-for></ul>
              <mt-if value="{{ Movsinfijos }}"><p class="texto-pequeno mov-vacio">No tienes ingresos fijos. Si te llega lo mismo cada mes (salario, pensión o un arriendo), agrégalo aquí.</p></mt-if>
              <button type="button" class="boton-secundario" al-clic="{{ Abriringresofijo }}">${Svgmasmovimientos}Agregar ingreso fijo</button>
            </section>
          </mt-if>

          <mt-if value="{{ Movingresoano }}">
            <section class="tarjeta"><span class="texto-pequeno">{{ Movaniotitulo }}</span><p class="mov-cifra mov-cifra-media">{{ Movanual }}</p><p class="texto-pequeno">Tu promedio mensual por 12 meses.</p></section>
            <section class="tarjeta"><h2 class="titulo-tarjeta mov-subtitulo">¿Debes declarar renta?</h2><p class="texto-cuerpo">{{ Movrentainicio }}<b class="texto-tinta">{{ Movrentatope }}</b>{{ Movrentafin }}</p><p class="texto-pequeno">Hay otros topes (patrimonio, compras con tarjeta). Confírmalo con un contador o en la DIAN.</p></section>
          </mt-if>

          <mt-if value="{{ Movgastodia }}">
            <section class="tarjeta"><span class="texto-pequeno">{{ Movdiatitulo }}</span><p class="mov-cifra">{{ Movgastodiatotal }}</p><p class="texto-pequeno">Gastos del día. Las deudas y los pagos fijos se cuentan aparte, cada mes.</p></section>
            <section class="mov-seccion" aria-labelledby="mov-gastos"><h2 id="mov-gastos" class="titulo-tarjeta mov-subtitulo">{{ Movgastostitulo }}</h2>
              <ul class="mov-lista"><mt-for list="{{ Movgastosdia }}" as="Fila"><li class="mov-fila"><span class="mov-fila-icono" aria-hidden="true">${Svgfilamovimientos}</span><span class="mov-fila-textos"><span class="mov-fila-titulo">{{ Fila.Titulo }}</span><span class="texto-pequeno">{{ Fila.Detalle }}</span></span><span class="mov-fila-monto">{{ Fila.Monto }}</span></li></mt-for></ul>
              <mt-if value="{{ Movsingastosdia }}"><p class="texto-pequeno mov-vacio">{{ Movsingastosdiatexto }}</p></mt-if>
            </section>
            <button type="button" class="boton-primario" al-clic="{{ Registrargastodia }}">${Svgmasmovimientos}{{ Movregistrargastodia }}</button>
          </mt-if>

          <mt-if value="{{ Movgastoperiodo }}">
            <section class="tarjeta"><span class="texto-pequeno">{{ Movgastotitulo }}</span><p class="mov-cifra mov-cifra-media">{{ Movgastototal }}</p>
              <div class="mov-partes"><div class="mov-parte"><span class="texto-pequeno">Pagos de deudas</span><span class="mov-parte-valor">{{ Movgastodeudas }}</span></div><div class="mov-parte"><span class="texto-pequeno">Gastos del día</span><span class="mov-parte-valor">{{ Movgastodiarios }}</span></div></div>
              <p class="texto-pequeno">Lo que pagas de deudas baja lo que te presta el banco. Los gastos del día no, pero sí lo que puedes ahorrar.</p></section>
            <section class="tarjeta"><h2 class="titulo-tarjeta mov-subtitulo">Gastos del día por tipo</h2>
              <mt-for list="{{ Movcategorias }}" as="Categoria"><div class="mov-categoria"><div class="mov-categoria-fila"><span>{{ Categoria.Nombre }}</span><span class="mov-categoria-monto">{{ Categoria.Monto }}</span></div><div class="progreso progreso-delgado"><div class="progreso-relleno" style="width:{{ Categoria.Ancho }}"></div></div></div></mt-for>
              <mt-if value="{{ Movsincategorias }}"><p class="texto-pequeno">{{ Movsincategoriastexto }}</p></mt-if>
            </section>
            <button type="button" class="boton-primario" al-clic="{{ Registrargasto }}">${Svgmasmovimientos}Registrar gasto</button>
          </mt-if>
        </div>
        </mt-if>
`;
