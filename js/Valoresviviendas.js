// Catálogo de viviendas en el presupuesto: filtros de ciudad, alcance por proyecto y acciones de cierre

const Nombresvolverviviendas = { inicio: 'Inicio', plan: 'Mi plan', simulador: 'Simular', ingresos: 'Movimientos', ofertas: 'Viviendas' };

function Generarvaloresviviendas(Calculo) {
  const Estadoactual = this.Estadocomponente;
  const Ciudadbase = Estadoactual.Ciudad || 'Bogotá';
  const Ciudadesdefecto = Ciudadbase === 'Bogotá' ? ['Bogotá', 'Soacha'] : [Ciudadbase];
  const Ciudadesseleccionadas = Estadoactual.Ofertasciudades !== null ? Estadoactual.Ofertasciudades : Ciudadesdefecto;
  const Ordenadas = Ciudadesseleccionadas.includes(Ciudadbase) ? [Ciudadbase, ...Ciudadesseleccionadas.filter(Opcion => Opcion !== Ciudadbase)] : Ciudadesseleccionadas;

  const Deudas = Estadoactual.Deudas || [];
  const Cerrables = Deudas.filter(Deuda => Deuda.Activa !== false && Deuda.Cuota > 0 && !Egresosnoterminables.includes(Deuda.Corto));
  const Deudamayor = Cerrables.length ? Cerrables.reduce((Mayor, Actual) => Actual.Cuota > Mayor.Cuota ? Actual : Mayor) : null;
  const Deudanombre = Deudamayor ? (Nombresdeudapaso[Deudamayor.Corto] || (Deudamayor.Nombreitem ? Deudamayor.Nombreitem.toLowerCase() : 'tu deuda más alta')) : '';

  const Cupovishogar = Math.min(this.Calcular(Estadoactual, null, 'vis').Preciotecho, Calculo.Topevis);
  const Cuponovishogar = this.Calcular(Estadoactual, null, 'novis').Preciotecho;

  const Armartarjeta = Proyecto => {
    const Modalidadproyecto = Proyecto.Tipovivienda === 'VIS' ? 'vis' : 'novis';
    const Calculoproyecto = this.Calcular(Estadoactual, null, Modalidadproyecto);
    const Financiacion = Modalidadesvivienda[Modalidadproyecto].Financiacion;
    const Cupo = Modalidadproyecto === 'vis' ? Math.min(Calculoproyecto.Preciotecho, Calculoproyecto.Topevis) : Calculoproyecto.Preciotecho;
    const Bancoaprueba = Proyecto.Precioproyecto <= Cupo + 1;
    const Gastosproyecto = Estadoactual.Financiargastos ? 0 : Proyecto.Precioproyecto * (Modalidadesvivienda[Modalidadproyecto].Gastos ?? 0.03);
    const Creditoproyecto = Math.min(Calculoproyecto.Creditoporcapacidad, Proyecto.Precioproyecto * Financiacion);
    const Cuotainicialproyecto = Math.max(0, Proyecto.Precioproyecto - Creditoproyecto);
    const Subsidioproyecto = Modalidadproyecto === 'novis' ? 0 : Math.min(Cuotainicialproyecto, (Calculoproyecto.Subsidiocajamonto || 0) + (Calculoproyecto.Subsidiomicasayamonto || 0));
    const Faltaproyecto = Math.max(0, Cuotainicialproyecto + Gastosproyecto - Subsidioproyecto - Calculoproyecto.Ahorrohogar);
    let Estadoprevio = 0;
    if (!Bancoaprueba) Estadoprevio = 2;
    else if (Faltaproyecto > 1) Estadoprevio = 1;

    let Superaaccion = 'Prueba cambios en Simular';
    let Alsuperar = () => this.Cambiarestado({ Pestana: 'simulador', Simuladorpaso: 'form' });
    if (Estadoprevio === 2 && Deudamayor) {
      const Sinmayor = this.Calcular(Estadoactual, Deudas.map(D => D === Deudamayor ? { ...D, Activa: false } : D), Modalidadproyecto);
      const Cupomejorado = Modalidadproyecto === 'vis' ? Math.min(Sinmayor.Preciotecho, Sinmayor.Topevis) : Sinmayor.Preciotecho;
      Superaaccion = Proyecto.Precioproyecto <= Cupomejorado + 1
        ? 'Si terminas de pagar ' + Deudanombre + ', el préstamo te alcanzaría'
        : 'Revisa tus deudas para subir tu presupuesto';
      Alsuperar = () => this.Cambiarestado({ Panel: 'deudas', Menu: false });
    }

    return {
      Imagen: Proyecto.Imagen,
      Imagenalt: 'Foto de referencia de ' + Proyecto.Nombreproyecto,
      Etiquetatipo: Proyecto.Tipovivienda + ' · ' + Proyecto.Areaconstruida,
      Nombre: Proyecto.Nombreproyecto,
      Ubicacion: Proyecto.Ciudadproyecto + ' · ' + Proyecto.Barrio,
      Precio: '$' + Math.round(Proyecto.Precioproyecto / 1e6).toLocaleString('es-CO') + ' M',
      Esok: Estadoprevio === 0,
      Esahorro: Estadoprevio === 1,
      Essupera: Estadoprevio === 2,
      Faltamonto: '$' + Formatomillones(Faltaproyecto) + ' M',
      Superamonto: '$' + Formatomillones(Math.max(0, Proyecto.Precioproyecto - Cupo)) + ' M',
      Superaaccion,
      Alinteres: () => this.Aviso(Proyecto.Nombreproyecto + ' es un ejemplo de referencia en ' + Proyecto.Ciudadproyecto + ' para dimensionar tu presupuesto.'),
      Alahorrar: () => this.Cambiarestado({ Pestana: 'plan' }),
      Alsuperar,
      Estadoprevio,
      Programado: Proyecto.Precioproyecto
    };
  };

  const Tarjetas = Ordenadas.flatMap(Nombreciudad =>
    Catalogoproyectos.filter(Proyecto => Proyecto.Ciudadproyecto === Nombreciudad).map(Armartarjeta)
  ).sort((Primero, Segundo) => (Primero.Estadoprevio - Segundo.Estadoprevio) || (Primero.Programado - Segundo.Programado));

  const Dentro = Tarjetas.filter(Item => Item.Estadoprevio < 2);
  const Superan = Tarjetas.filter(Item => Item.Estadoprevio === 2);
  const Verextras = Boolean(Estadoactual.Ofertasvermas);
  const Visibles = Verextras ? Tarjetas : [...Dentro, ...(Superan.length ? [Superan[0]] : [])];
  const Ocultos = Math.max(0, Superan.length - (Verextras ? Superan.length : 1));

  const Conteo = (Ciudaditem) => Catalogoproyectos.filter(Proyecto => Proyecto.Ciudadproyecto === Ciudaditem).length;
  const Busqueda = Normalizartexto((Estadoactual.Ofertasbusqueda || '').trim());
  const Listaagregar = Directoriociudades.filter(([Nombreciudad, Dato]) =>
    !Ciudadesseleccionadas.includes(Nombreciudad) && (!Busqueda || Normalizartexto(Nombreciudad).includes(Busqueda) || Normalizartexto(Dato).includes(Busqueda))
  );

  const Pila = this.Historialnavegacion || [];
  const Ultimolugar = Pila.length ? Pila[Pila.length - 1].split('|')[0] : '';
  const Viviendasvolver = Nombresvolverviviendas[Ultimolugar] || 'Mi plan';
  const Presupuestomaximo = Calculo.Preciotecho || Math.max(Cupovishogar, Cuponovishogar);

  return {
    Viviendasvolver,
    Viviendasvolveraccion: () => { if (!Volverlugaranterior.call(this)) this.Cambiarestado({ Pestana: 'plan' }); },
    Viviendaspresupuesto: '$' + Formatomillones(Presupuestomaximo) + ' M',
    Viviendasahorro: '$' + Formatomillones(Calculo.Ahorrohogar) + ' M',
    Ofertasfichas: Ordenadas.map(Nombreciudad => ({
      Etiqueta: Nombreciudad,
      Quitarlabel: 'Quitar ' + Nombreciudad,
      Alquitar: () => this.Cambiarestado({ Ofertasciudades: Ciudadesseleccionadas.filter(Opcion => Opcion !== Nombreciudad), Ofertasvermas: false })
    })),
    Ofertasagregarabierto: Boolean(Estadoactual.Ofertasagregarabierto),
    Ofertasagregarmas: !Estadoactual.Ofertasagregarabierto,
    Ofertasagregaretiqueta: Estadoactual.Ofertasagregarabierto ? 'Cerrar' : 'Agregar ciudad',
    Alternarofertasagregar: () => this.Cambiarestado({ Ofertasagregarabierto: !Estadoactual.Ofertasagregarabierto, Ofertasbusqueda: '' }),
    Ofertasbusqueda: Estadoactual.Ofertasbusqueda || '',
    Escribirofertasbusqueda: (Elemento) => this.Cambiarestado({ Ofertasbusqueda: Textoseguro(Elemento.target.value, 40) }),
    Ofertasagregarvacio: Listaagregar.length === 0,
    Ofertasagregarlista: Listaagregar.map(([Nombreciudad, Dato]) => {
      const Numero = Conteo(Nombreciudad);
      return {
        Nombreitem: Nombreciudad,
        Departamento: Dato,
        Cantidad: Numero ? Numero + (Numero === 1 ? ' proyecto' : ' proyectos') : 'Sin proyectos',
        Alclic: () => this.Cambiarestado({ Ofertasciudades: [...Ciudadesseleccionadas, Nombreciudad], Ofertasagregarabierto: false, Ofertasbusqueda: '', Ofertasvermas: false })
      };
    }),
    Ofertasninguna: Ciudadesseleccionadas.length === 0,
    Ofertassinproyectos: Ciudadesseleccionadas.length > 0 && Tarjetas.length === 0,
    Ofertastarjetas: Visibles,
    Ofertashaymas: Ocultos > 0,
    Ofertasmastexto: Ocultos === 1 ? 'Ver 1 proyecto más que supera tu presupuesto' : 'Ver ' + Ocultos + ' proyectos más que superan tu presupuesto',
    Mostrarmasofertas: () => this.Cambiarestado({ Ofertasvermas: true })
  };
}
