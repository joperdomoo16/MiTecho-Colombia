// Preparación de los cálculos del simulador de crédito, nivel de deudas, cuotas y proyectos de vivienda

function Generarvaloressimulador(Calculo, Configuracion, Seleccion, Fichaseleccion) {
  const Estadoactual = this.Estadocomponente, Oscuroactivo = this.Temaactual === 'oscuro', Pestana = this.Pestana;
  // Las cuentas guardadas antes de existir los dos botones usaban el promedio o el valor manual
  const Fuenteactual = Estadoactual.Fuenteingreso || (Estadoactual.Usarautomatico ? 'promedio' : 'manual');
  const Deudastodas = Estadoactual.Deudas.map(Dato => ({ ...Dato, Activa: true }));
  const Cuotatodas = this.Calcular(Estadoactual, Deudastodas);
  const Creditoliberado = Math.max(0, Calculo.Creditotecho - Cuotatodas.Creditotecho);
  const Deudabanco = Math.max(0, Calculo.Preciotecho - Cuotatodas.Preciotecho), Deudahoy = Math.max(0, Calculo.Preciohoy - Cuotatodas.Preciohoy);
  const Faltamas = Math.max(0, Calculo.Faltatecho - Cuotatodas.Faltatecho);
  const Saldoapagado = Estadoactual.Deudas.filter(Dato => !Dato.Activa).reduce((Acumulado, Dato) => Acumulado + (Dato.Saldo || 0), 0);
  const Cuotasaldo = Saldoapagado ? this.Calcular({ ...Estadoactual, Ahorro: Math.max(0, Estadoactual.Ahorro - Saldoapagado) }) : null;

  let Planmensaje = '', Planlisto = false;
  if (Creditoliberado > 0) {
    if (Calculo.Topado && Deudabanco < 1) Planmensaje = 'Tu cupo ya supera el tope VIS. El crédito extra no sube el precio de una vivienda VIS.';
    else if (Faltamas < 1) { Planlisto = true; Planmensaje = 'Tienes la cuota inicial para usarlo: tu vivienda puede subir $' + Formatomillones(Deudabanco) + ' M.'; }
    else if (Deudahoy > 1) Planmensaje = 'Hoy tu vivienda sube $' + Formatomillones(Deudahoy) + ' M. Para usar todo el cupo necesitas ' + Formatoenteropesos(Faltamas) + ' más de cuota inicial.';
    else Planmensaje = 'Hoy tu límite es la cuota inicial, no el banco. Para usar este cupo necesitas ' + Formatoenteropesos(Faltamas) + ' más de cuota inicial' + (Calculo.Subsidio ? ', ya contando tu subsidio.' : '.');
  }

  const Deudatarjetas = Estadoactual.Deudas.map(Dato => {
    const Apagadoitem = !Dato.Activa;
    return {
      id: Dato.id,
      Nombreitem: Dato.Nombreitem,
      detail: Formatoenteropesos(Dato.Cuota) + '/mes' + (Dato.Saldo ? ' · saldo ' + Formatoenteropesos(Dato.Saldo) : ''),
      Fondo: Apagadoitem ? 'var(--ac)' : 'var(--cd)',
      Borde: Apagadoitem ? 'var(--ac)' : 'var(--ln)',
      Color: Apagadoitem ? 'var(--oa)' : 'var(--ik)',
      Subtexto: Apagadoitem ? 'rgba(11,12,10,.65)' : 'var(--mu)',
      Linea: Apagadoitem ? 'rgba(11,12,10,.15)' : 'var(--ln)',
      Riel: Apagadoitem ? 'var(--oa)' : 'var(--c2)',
      Perilla: Apagadoitem ? 'var(--ac)' : 'var(--mu)',
      Posicion: Apagadoitem ? 'translateX(18px)' : 'none',
      Estadocomponente: Apagadoitem ? 'APAGADA · LIBERA' : 'SI LA APAGAS',
      Impacto: '+$' + Formatomillones(Dato.Cuota * Calculo.Tope * Calculo.Factor) + ' M crédito',
      Botonfondo: Apagadoitem ? 'rgba(11,12,10,.1)' : 'var(--c2)',
      Botonborde: Apagadoitem ? 'rgba(11,12,10,.15)' : 'var(--ln)',
      Alclic: () => this.Fijardeuda(Dato.id, { Activa: !Dato.Activa }),
      Aleditar: () => this.Editardeuda(Dato.id),
      Aleliminar: () => this.Eliminardeuda(Dato.id)
    };
  });

  const Deudafichas = Estadoactual.Deudas.map(Dato => ({
    Etiqueta: Dato.Corto + ' ' + Formatoenteropesos(Dato.Cuota),
    Fondo: Dato.Activa ? 'var(--c2)' : 'transparent',
    Borde: Dato.Activa ? 'var(--c2)' : 'var(--ln)',
    Color: Dato.Activa ? 'var(--ik)' : 'var(--fa)',
    Decoracion: Dato.Activa ? 'none' : 'line-through',
    Alclic: () => this.Fijardeuda(Dato.id, { Activa: !Dato.Activa })
  }));

  const Deudafilasmes = Estadoactual.Deudas.filter(Dato => Dato.Activa).map(Dato => ({
    Nombreitem: Dato.Nombreitem,
    Cuota: Formatoenteropesos(Dato.Cuota),
    Pagada: Dato.Pagada,
    Cajafondo: Dato.Pagada ? 'var(--ac)' : 'transparent',
    Cajaborde: Dato.Pagada ? 'var(--ac)' : 'var(--fa)',
    Color: Dato.Pagada ? 'var(--mu)' : 'var(--ik)',
    Decoracion: Dato.Pagada ? 'line-through' : 'none',
    Alternarpagada: () => this.Fijardeuda(Dato.id, { Pagada: !Dato.Pagada }),
    Aleditar: () => this.Editardeuda(Dato.id)
  }));

  const Deudaproporcion = Calculo.Deudasmes / Math.max(1, Calculo.Ingresototal);
  const Modalidadopciones = Object.keys(Modalidadesvivienda).map(Clave => {
    const Objeto = Seleccion(Estadoactual.Modalidadelegida === Clave);
    return { Etiqueta: Modalidadesvivienda[Clave].Etiqueta, Descripcioncorta: Modalidadesvivienda[Clave].Descripcioncorta, ...Objeto, Alclic: () => this.Cambiarestado({ Modalidadelegida: Clave }) };
  });
  const Topevis = Consultartopevis(Estadoactual.Ciudad) * Salariominimo;
  const Tasaopciones = [['pesos', 'Pesos fijos'], ['uvr', 'UVR']].map(([Clave, Etiquetatexto]) => ({ Etiqueta: Etiquetatexto, ...Seleccion(Estadoactual.Tasatipo === Clave), Alclic: () => this.Cambiarestado({ Tasatipo: Clave }) }));
  const Plazoopciones = [15, 20, 30].map(Numero => ({ Etiqueta: Numero + ' años', ...Seleccion(Estadoactual.Plazoelegido === Numero), Alclic: () => this.Cambiarestado({ Plazoelegido: Numero }) }));
  const Cuota = Calculo.Cuotatecho;
  const Fotosegura = Imagensegura(Estadoactual.Avatarimagen);
  const Deslizadorporcentaje = (Calculo.Ingresotitular - 1500000) / (15000000 - 1500000);
  const Formactual = Estadoactual.Formulario;
  const Formularioganancia = Formactual.Monto / Calculo.N * Calculo.Tope * Calculo.Factor / Configuracion.Financiacion;

  const Salariosminimos = Calculo.Salariosminimos;
  const Potencialsalarios = Estadoactual.Caja ? 0 : Salariosminimos <= 2 ? 30 : Salariosminimos <= 4 ? 20 : 0;
  const Subsidiosalarios = Calculo.Subsidiocajasalarios + Calculo.Subsidiomicasayasalarios;
  const Perfilsubsidiomensaje = !Estadoactual.Caja ? (Potencialsalarios ? 'No estás afiliado. Si te afilias, te corresponderían ' + Potencialsalarios + ' SMMLV (' + Formatoenteropesos(Potencialsalarios * Salariominimo) + ') para vivienda VIS.' : 'No estás afiliado. Con tus ingresos tampoco aplicarías a subsidio de Caja.')
    : Subsidiosalarios ? 'Te corresponden ' + Subsidiosalarios + ' SMMLV (' + Formatoenteropesos(Subsidiosalarios * Salariominimo) + ')' + (Calculo.Subsidiomicasayasalarios ? ' sumando Mi Casa Ya' : '') + ' para vivienda VIS.' : 'Con ingresos mayores a 4 SMMLV no aplicas a subsidio de Caja.';
  const Cajalista = Estadoactual.Caja && Subsidiosalarios > 0;
  const Mostrarafiliacion = !Estadoactual.Caja && Estadoactual.Tipo !== 'fijo' && Salariosminimos < 4;

  const Ciudadesseleccionadas = Estadoactual.Ofertasciudades ?? [Estadoactual.Ciudad];
  const Ordenadas = Ciudadesseleccionadas.includes(Estadoactual.Ciudad) ? [Estadoactual.Ciudad, ...Ciudadesseleccionadas.filter(Opcion => Opcion !== Estadoactual.Ciudad)] : Ciudadesseleccionadas;
  const Tarjeta = Proyecto => {
    const Modalidadproyecto = Proyecto.Tipovivienda === 'VIS' ? 'vis' : 'novis', Calculoproyecto = this.Calcular(Estadoactual, null, Modalidadproyecto), Financiacion = Modalidadesvivienda[Modalidadproyecto].Financiacion;
    // El techo de esa modalidad ya cuenta el ahorro: con más cuota inicial el banco puede financiar menos del máximo
    const Cupo = Modalidadproyecto === 'vis' ? Math.min(Calculoproyecto.Preciotecho, Calculoproyecto.Topevis) : Calculoproyecto.Preciotecho;
    const Bancoaprueba = Proyecto.Precioproyecto <= Cupo + 1, Gastosproyecto = Estadoactual.Financiargastos ? 0 : Proyecto.Precioproyecto * (Modalidadesvivienda[Modalidadproyecto].Gastos ?? 0.03);
    const Faltaproyecto = Math.max(0, Proyecto.Precioproyecto + Gastosproyecto - Math.min(Calculoproyecto.Creditoporcapacidad, Proyecto.Precioproyecto * Financiacion) - Calculoproyecto.Efectivo);
    const Estadoprevio = !Bancoaprueba ? 2 : Faltaproyecto > 1 ? 1 : 0;
    return {
      Alinteres: () => this.Aviso('Proyecto ' + Proyecto.Nombreproyecto + ': información en sala de ventas ' + Proyecto.Ciudadproyecto + '.'),
      Imagenfondo: 'url(assets/proyectos/' + Proyecto.Imagen + '.webp)',
      Area: Proyecto.Areaconstruida.toUpperCase() + ' · ' + Proyecto.Tipovivienda.toUpperCase(),
      Nombre: Proyecto.Nombreproyecto,
      Precio: '$' + Formatomillones(Proyecto.Precioproyecto) + ' M',
      Meta: Proyecto.Barrio + ' · ' + Proyecto.Ciudadproyecto + ' · ' + Proyecto.Areaconstruida + ' · ' + Proyecto.Tipovivienda + (Calculoproyecto.Subsidio ? ' · Subsidio $' + Formatomillones(Calculoproyecto.Subsidio) + ' M' : ''),
      Ajuste: Estadoprevio === 0 ? 'PUEDE SER MITECHO' : Estadoprevio === 1 ? 'FALTA INICIAL $' + Formatomillones(Faltaproyecto) + ' M' : 'FALTAN $' + Formatomillones(Proyecto.Precioproyecto - Cupo) + ' M DE CUPO',
      Etiquetafondo: ['var(--ac)', '#FFD23F', 'var(--dk)'][Estadoprevio],
      Etiquetacolor: ['var(--oa)', '#0B0C0A', '#F2F4EC'][Estadoprevio],
      Estadoprevio: Estadoprevio,
      Programado: Proyecto.Precioproyecto
    };
  };
  const Conteo = (Ciudaditem) => Catalogoproyectos.filter(Proyecto => Proyecto.Ciudadproyecto === Ciudaditem).length;
  const Busqueda = Normalizartexto(Estadoactual.Ofertasbusqueda.trim());
  const Listaagregar = Directoriociudades.filter(([Nombreciudad, Dato]) => !Ciudadesseleccionadas.includes(Nombreciudad) && (!Busqueda || Normalizartexto(Nombreciudad).includes(Busqueda) || Normalizartexto(Dato).includes(Busqueda)));

  return {
    Deudafichas,
    Deudafilasmes,
    Modalidadopciones,
    Topevis,
    Tasaopciones,
    Plazoopciones,
    Cuota,
    Deslizadorporcentaje,
    Formactual,
    Formularioganancia,
    Ingresootro: Formactual.Fuente === 'Otros',
    Ingresonombre: Formactual.Nombre || '',
    Escribiringresonombre: (Elemento) => this.Cambiarestado({ Formulario: { ...Formactual, Nombre: Textoseguro(Elemento.target.value, 60) } }),
    Ingresofijootro: Estadoactual.Formularioingresofijo.Tipo === 'Otro ingreso fijo',
    Ingresofijonombrecampo: Estadoactual.Formularioingresofijo.Nombre || '',
    Escribiringresofijonombre: (Elemento) => this.Cambiarestado({ Formularioingresofijo: { ...Estadoactual.Formularioingresofijo, Nombre: Textoseguro(Elemento.target.value, 60) } }),
    Gastootro: Estadoactual.Formulariogasto.Categoria === 'Otros',
    Gastonombre: Estadoactual.Formulariogasto.Nombre || '',
    Escribirgastonombre: (Elemento) => this.Cambiarestado({ Formulariogasto: { ...Estadoactual.Formulariogasto, Nombre: Textoseguro(Elemento.target.value, 60) } }),
    Formdeudaotro: Estadoactual.Formulariodeuda.Tipo === 'Otro egreso fijo',
    Formdeudanombre: Estadoactual.Formulariodeuda.Nombre || '',
    Escribirdeudanombre: (Elemento) => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Nombre: Textoseguro(Elemento.target.value, 60) } }),
    Correovisible: (Estadoactual.Correo || '') + ' · ' + (Estadoactual.Metodoingreso === 'google' ? 'Google' : 'Correo'),
    Abrirmenu: () => this.Cambiarestado({ Menu: true }),
    Cerrarmenu: () => this.Cambiarestado({ Menu: false }),
    Esusuariopro: !!Estadoactual.Pro,
    Avatarimagen: Fotosegura,
    Tieneavatarimagen: !!Fotosegura,
    Sinavatarimagen: !Fotosegura,
    Avatarfondo: Fotosegura ? 'transparent' : (Estadoactual.Pro ? '#FFD23F' : 'var(--ac)'),
    Avatartexto: Fotosegura ? 'transparent' : (Estadoactual.Pro ? '#0B0C0A' : 'var(--oa)'),
    Avatarborde: Estadoactual.Pro ? '2px solid #FFD23F' : 'none',
    Avatarbordepequeno: Estadoactual.Pro ? '2px solid #FFD23F' : '1px solid var(--ln)',
    Avatarbordegrande: Estadoactual.Pro ? '3px solid #FFD23F' : '2px solid var(--ln)',
    Avatarsombra: Estadoactual.Pro ? '0 0 0 2px rgba(255,210,63,.4), 0 2px 8px rgba(0,0,0,.25)' : (Estadoactual.Menu ? '0 0 0 4px var(--ad)' : 'none'),
    Abrirselectorfoto: () => {
      if (typeof document !== 'undefined') {
        const Nodo = document.getElementById('mt-avatar-input');
        if (Nodo) { Nodo.value = ''; Nodo.click(); }
      }
    },
    Cambiararchivoavatar: (Elemento) => {
      const Destinoconsignacion = (Elemento.Eventonativo && Elemento.Eventonativo.target) || Elemento.target;
      const Archivo = Destinoconsignacion && Destinoconsignacion.files && Destinoconsignacion.files[0];
      if (!Archivo) return;
      if (!Archivo.type || !Archivo.type.startsWith('image/')) {
        this.Aviso('Por favor selecciona una imagen válida.');
        return;
      }
      if (Archivo.size > 8 * 1024 * 1024) {
        this.Aviso('La imagen no debe superar los 8 MB.');
        return;
      }
      Procesarfotoperfil(Archivo, (Imagendatos) => {
        this.Cambiarestado({ Avatarimagen: Imagendatos });
        this.Aviso('Foto de perfil actualizada.');
      });
    },
    Quitaravatarimagen: () => {
      this.Cambiarestado({ Avatarimagen: '' });
      this.Aviso('Foto de perfil eliminada.');
    },
    Menuopacidad: Estadoactual.Menu ? 1 : 0,
    Menueventos: Estadoactual.Menu ? 'auto' : 'none',
    Menuescala: Estadoactual.Menu ? 'scale(1)' : 'scale(.92) translateY(-8px)',
    Avataranillo: Estadoactual.Menu ? '4px' : '0px',
    Menuitems: [
      { Etiqueta: 'Ayuda', Subtexto: 'Qué significa cada cifra', Icono: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01', Fondo: 'var(--ac)', Color: 'var(--oa)', Iconofondo: 'rgba(11,12,10,.1)', Derecha: '→', Alclic: () => this.Cambiarestado({ Menu: false, Ayuda: true, Ayudaabierta: 0 }) },
      { Etiqueta: 'MiTecho Pro', Subtexto: Estadoactual.Pro ? 'Activo · pareja, PDF, tasas y sin anuncios' : 'Pareja, PDF, tasas y sin anuncios · $6.500/mes', Icono: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: '#FFD23F', Derecha: Estadoactual.Pro ? 'ACTIVO' : '', Alclic: () => this.Cambiarestado({ Menu: false, Panel: 'pro' }) },
      { Etiqueta: 'Tasas por banco', Subtexto: 'Pro · datos de la Superintendencia Financiera', Icono: 'M4 20V10M10 20V4M16 20v-7M22 20H2', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: Estadoactual.Pro ? '' : 'PRO', Alclic: () => this.Cambiarestado({ Menu: false, Panel: 'tasas' }) },
      { Etiqueta: 'Mi perfil financiero', Subtexto: 'Ciudad, tipo de ingreso, edad', Icono: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: '', Alclic: () => this.Cambiarestado({ Menu: false, Panel: 'perfil' }) },
      { Etiqueta: 'Recordatorios', Subtexto: 'Aviso diario para registrar', Icono: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: Estadoactual.Recordatorios.Diario ? Estadoactual.Recordatorios.Hora : 'APAGADO', Alclic: () => this.Cambiarestado({ Menu: false, Panel: 'rem' }) },
      { Etiqueta: Oscuroactivo ? 'Modo claro' : 'Modo oscuro', Subtexto: '', Icono: Oscuroactivo ? 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' : 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: '', Alclic: () => this.Cambiarestado({ Temaelegido: Oscuroactivo ? 'claro' : 'oscuro' }) },
      { Etiqueta: 'Ver tutorial otra vez', Subtexto: '', Icono: 'M1 4v6h6M3.5 15a9 9 0 1 0 2.1-9.4L1 10', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: '', Alclic: () => this.Cambiarestado({ Menu: false, Ayuda: false, Panel: '', Pestana: 'inicio', Tutorialvisto: false, Tutorialpaso: 0, Tutorialcaja: null, Consejosvistos: {}, Consejopaso: 0 }) },
      { Etiqueta: 'Cerrar sesión', Subtexto: '', Icono: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9', Fondo: 'transparent', Color: 'var(--al)', Iconofondo: 'var(--c2)', Derecha: '', Alclic: () => this.Cerrarsesionusuario() }
    ],
    Subsidiotexto: Formatoenteropesos(Calculo.Subsidio),
    Ahorrotexto: Formatoenteropesos(Calculo.Ahorrohogar),
    Salariosminimostexto: Calculo.Salariosminimos.toLocaleString('es-CO', { maximumFractionDigits: 1 }),
    Creditousadotexto: Formatoenteropesos(Calculo.Creditotecho),
    Tienesubsidiocaja: Calculo.Subsidiocaja > 0 && !Calculo.Techosobretopevis,
    Tienesubsidiomicasaya: Calculo.Subsidiomicasaya > 0 && !Calculo.Techosobretopevis,
    Subsidiocajasalarios: Calculo.Subsidiocajasalarios,
    Subsidiocajatexto: Formatoenteropesos(Calculo.Subsidiocaja),
    Subsidiomicasayatexto: Formatoenteropesos(Calculo.Subsidiomicasaya),
    Subsidiomicasayasalariostexto: String(Math.round(Calculo.Subsidiomicasayasalarios)),
    Faltaetiqueta: Calculo.Faltatecho > 0 ? '= Te falta' : '= Cuota inicial cubierta',
    Faltatexto: Calculo.Faltatecho > 0 ? Formatoenteropesos(Calculo.Faltatecho) : '✓',
    Faltacolor: Calculo.Faltatecho > 0 ? 'var(--al)' : 'var(--at)',
    Simuladorsubsidiovisible: Estadoactual.Modalidadelegida === 'vis',
    Simuladorsubsidiopunto: Calculo.Subsidio > 0 ? 'var(--ac)' : '#FFD23F',
    Simuladorsubsidiomensaje: !Estadoactual.Caja ? 'No tienes Caja de compensación registrada, así que no sumamos subsidio. Actívala en tu perfil si estás afiliado.' : Calculo.Subsidio > 0 ? 'Sumamos ' + Formatoenteropesos(Calculo.Subsidio) + ' de subsidio (' + (Calculo.Subsidiocajasalarios + Calculo.Subsidiomicasayasalarios) + ' SMMLV' + (Calculo.Subsidiomicasayasalarios ? ', con Mi Casa Ya' : '') + ') a tu cuota inicial.' : 'Con ingresos de ' + Calculo.Salariosminimos.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' SMMLV no aplicas a subsidio de Caja (tope: 4 SMMLV).',
    Perfilsubsidiomensaje,
    Perfilsubsidiofondo: Cajalista ? 'var(--ac)' : 'var(--c2)',
    Perfilsubsidiocolor: Cajalista ? 'var(--oa)' : 'var(--ik)',
    Perfilsubsidioantetitulo: Cajalista ? 'rgba(11,12,10,.65)' : 'var(--fa)',
    Afiliacionmensaje: 'Como independiente puedes afiliarte de forma voluntaria a una Caja de compensación aportando el 0,6% o el 2% de tus ingresos. Así podrías postularte a ' + Formatoenteropesos(Potencialsalarios * Salariominimo) + ' de subsidio para vivienda VIS.',
    Preciomillones: '$' + Formatomillones(Calculo.Preciotecho) + ' M',
    Ingresotexto: Formatoenteropesos(Calculo.Ingresototal),
    Topevistexto: Formatoenteropesos(Topevis),
    Sensibilidadcapacidad: Formatoenteropesos(100000 * Calculo.Tope),
    Sensibilidadcredito: Formatoenteropesos(100000 * Calculo.Tope * Calculo.Factor),
    Topeporcentaje: Math.round(Calculo.Tope * 100) + '%',
    Ingresofuenteetiqueta: Fuenteactual === 'perfil' ? 'PERFIL FINANCIERO' : Fuenteactual === 'promedio' ? (Calculo.Variablepromedio > 0 ? 'FIJO + PROMEDIO ' + Calculo.N + ' MESES' : 'PROMEDIO DE INGRESOS') : 'MANUAL',
    Ingresoformato: Formatonumero(Calculo.Ingresotitular),
    Ingresovalor: Calculo.Ingresotitular,
    Ingresodeslizadorancho: (Deslizadorporcentaje * 100) + '%',
    // Mover la barra pasa a ingreso manual; los dos botones eligen el promedio o lo declarado en el perfil financiero
    Cambiaringreso: (Elemento) => this.Cambiarestado({ Fuenteingreso: 'manual', Usarautomatico: false, Ingresomanual: +Elemento.target.value }),
    Ingresofuentes: [['promedio', 'Usar promedio de ingresos'], ['perfil', 'Usar ingresos del perfil financiero']].map(([Clave, Etiqueta]) => ({
      Etiqueta, ...Seleccion(Fuenteactual === Clave), Activa: Fuenteactual === Clave ? 'true' : 'false',
      Alclic: () => this.Cambiarestado({ Fuenteingreso: Clave, Usarautomatico: Clave === 'promedio' })
    })),
    // Simular con pareja o familia es de Pro; sin Pro el interruptor lleva a la pantalla de Pro
    Alternarpareja: () => {
      if (!Estadoactual.Pro) {
        this.Abrirpro('La simulación con tu pareja o familia es parte de MiTecho Pro.');
        return;
      }
      this.Cambiarestado({ Pareja: !Estadoactual.Pareja });
    },
    Parejariel: Estadoactual.Pareja && Estadoactual.Pro ? 'var(--ac)' : 'var(--c2)',
    Parejaperilla: Estadoactual.Pareja && Estadoactual.Pro ? 'var(--oa)' : 'var(--mu)',
    Parejaposicion: Estadoactual.Pareja && Estadoactual.Pro ? 'translateX(22px)' : 'none',
    Visaviso: Calculo.Topado || Calculo.Techosobretopevis,
    Vistopadafila: Calculo.Topado,
    Preciosintopetexto: Formatoenteropesos(Calculo.Creditoporcapacidad / Configuracion.Financiacion),
    Financiacionetiquetaultima: Calculo.Topado ? 'TOPE VIS (' + Consultartopevis(Estadoactual.Ciudad) + ' SMMLV)' : '÷ ' + Math.round(Calculo.Financiaciontecho * 100) + '% FINANCIADO' + (Calculo.Techosobretopevis ? ' · NO VIS' : ''),
    Visavisomensaje: Calculo.Techosobretopevis ? Avisotopevis(Calculo, Estadoactual.Ciudad) : 'Tu cupo supera el tope VIS en ' + Estadoactual.Ciudad + ' (' + Consultartopevis(Estadoactual.Ciudad) + ' SMMLV = ' + Formatoenteropesos(Topevis) + '). Te mostramos viviendas VIS hasta ese valor; por encima serían No VIS y sin subsidio.',
    Netotexto: Formatoenteropesos(Calculo.Neto),
    Topeetiqueta: '× ' + Math.round(Calculo.Tope * 100) + '% CAPACIDAD',
    Capacidadcuotatexto: Formatoenteropesos(Calculo.Capacidadcuota),
    Creditotexto: Formatoenteropesos(Calculo.Creditotecho),
    Creditocadenatexto: Formatoenteropesos(Calculo.Creditoporcapacidad),
    Financiacionetiqueta: '÷ ' + Math.round(Configuracion.Financiacion * 100) + '% VIVIENDA',
    Preciotexto: Formatoenteropesos(Calculo.Preciotecho),
    Cuotaetiqueta: 'Cuota mensual ' + (Estadoactual.Tasatipo === 'pesos' ? '(' + Formatoporcentaje(Calculo.Tasaanual) + ' E.A.)' : 'inicial en UVR (UVR + ' + Formatoporcentaje(Calculo.Tasaanual) + ')'),
    Cuotamensual: Formatoenteropesos(Cuota),
    Bloqueado: !Estadoactual.Desbloqueado && !Estadoactual.Pro,
    Desbloquearetiqueta: Estadoactual.Desbloqueando ? 'Cargando el video…' : 'Ver un video corto para abrirlo',
    // El comparador se abre solo si la persona ve completo el video con recompensa de AdMob
    Desbloquear: async () => {
      if (Estadoactual.Desbloqueando) return;
      this.Cambiarestado({ Desbloqueando: true });
      const Resultado = typeof Verrecompensa === 'function' ? await Verrecompensa() : { ok: true };
      this.Cambiarestado({ Desbloqueado: Boolean(Resultado.ok), Desbloqueando: false });
      if (!Resultado.ok) this.Aviso(Resultado.error);
    },
    Cuotainicialtitulo: 'Cuota inicial ' + Math.round((1 - Configuracion.Financiacion) * 100) + '% + gastos',
    Cuotainicialtexto: Formatoenteropesos(Calculo.Cuotainicialtecho),
    Gastosetiqueta: Configuracion.Glosario,
    Gastosetiquetacierre: (Estadoactual.Modalidadelegida === 'leasing' ? 'Gastos de escritura (los asume el leasing)' : Estadoactual.Financiargastos ? 'Escrituración (va en el crédito)' : '+ ' + (Calculo.Techosobretopevis ? Modalidadesvivienda.novis : Configuracion).Glosario),
    Gastostexto: Formatoenteropesos(Calculo.Gastostecho),
    Totalpropios: Formatoenteropesos(Calculo.Cuotainicialtecho + Calculo.Gastostecho),
    Planinteres: Creditoliberado > 0 ? 'Con lo que apagaste, el banco te presta' : 'Apaga una deuda y mira cuánto más te presta el banco',
    Liberadomillones: Formatomillones(Creditoliberado),
    Deudatarjetas,
    Plancupo: Deudabanco > 1 ? '$' + Formatomillones(Cuotatodas.Preciotecho) + ' → $' + Formatomillones(Calculo.Preciotecho) + ' M' : '$' + Formatomillones(Calculo.Preciotecho) + ' M',
    Planhoy: Deudahoy > 1 ? '$' + Formatomillones(Cuotatodas.Preciohoy) + ' → $' + Formatomillones(Calculo.Preciohoy) + ' M' : '$' + Formatomillones(Calculo.Preciohoy) + ' M',
    Planmensajevisible: !!Planmensaje,
    Planmensaje,
    Planmensajefondo: Planlisto ? 'var(--ac)' : '#FFD23F',
    Saldovisible: Saldoapagado > 0,
    Saldomensaje: Saldoapagado ? 'Ojo: si pagas estas deudas con tus ahorros (' + Formatoenteropesos(Saldoapagado) + ' de saldo), tu cuota inicial baja y hoy cerrarías hasta $' + Formatomillones(Cuotasaldo.Preciohoy) + ' M.' : '',
    Sensibilidadcreditomillones: '$' + Formatomillones(Calculo.Sensibilidadcredito) + ' M',
    Mostrarcartera: Deudaproporcion > 0.25,
    Carteramensaje: 'Tus deudas son el ' + Math.round(Deudaproporcion * 100) + '% de tu ingreso',
    Ofertaspersonalizadas: Estadoactual.Ofertasciudades !== null,
    Ofertasreiniciar: () => this.Cambiarestado({ Ofertasciudades: null, Ofertasagregarabierto: false, Ofertasbusqueda: '' }),
    Ofertasfichas: Ordenadas.map(Nombreciudad => {
      const Inicio = Nombreciudad === Estadoactual.Ciudad;
      return {
        Etiqueta: Nombreciudad,
        Fondo: Inicio ? 'var(--ac)' : 'var(--c2)',
        Color: Inicio ? 'var(--oa)' : 'var(--ik)',
        Fondox: Inicio ? 'rgba(11,12,10,.1)' : 'var(--bg)',
        Alquitar: () => this.Cambiarestado({ Ofertasciudades: Ciudadesseleccionadas.filter(Opcion => Opcion !== Nombreciudad) })
      };
    }),
    Ofertasagregarabierto: Estadoactual.Ofertasagregarabierto,
    Ofertasagregaretiqueta: Estadoactual.Ofertasagregarabierto ? 'Cerrar' : '+ Agregar ciudad',
    Alternarofertasagregar: () => this.Cambiarestado({ Ofertasagregarabierto: !Estadoactual.Ofertasagregarabierto, Ofertasbusqueda: '' }),
    Ofertasbusqueda: Estadoactual.Ofertasbusqueda,
    Escribirofertasbusqueda: (Elemento) => this.Cambiarestado({ Ofertasbusqueda: Textoseguro(Elemento.target.value, 40) }),
    Ofertasagregarvacio: Listaagregar.length === 0,
    Ofertasagregarlista: Listaagregar.map(([Nombreciudad, Dato]) => {
      const Numero = Conteo(Nombreciudad);
      return {
        Nombreitem: Nombreciudad,
        Departamento: Dato,
        Cantidad: Numero ? Numero + (Numero === 1 ? ' PROYECTO' : ' PROYECTOS') : 'SIN PROYECTOS',
        Cantidadcolor: Numero ? 'var(--at)' : 'var(--fa)',
        Alclic: () => this.Cambiarestado({ Ofertasciudades: [...Ciudadesseleccionadas, Nombreciudad], Ofertasagregarabierto: false, Ofertasbusqueda: '' })
      };
    }),
    Ofertasninguna: Ciudadesseleccionadas.length === 0,
    Ofertasgrupos: Ordenadas.map(Nombreciudad => {
      const Items = Catalogoproyectos.filter(Proyecto => Proyecto.Ciudadproyecto === Nombreciudad).map(Tarjeta).sort((Acumulado, Segundo) => (Acumulado.Estadoprevio - Segundo.Estadoprevio) || (Acumulado.Programado - Segundo.Programado));
      return {
        Ciudaditem: Nombreciudad,
        Inicio: Nombreciudad === Estadoactual.Ciudad,
        Cantidad: Items.length + (Items.length === 1 ? ' proyecto' : ' proyectos'),
        Items,
        Vacio: Items.length === 0,
        Vaciomensaje: 'Aún no hay proyectos aliados en ' + Nombreciudad + '. Te avisamos cuando lleguen.'
      };
    }),
    Abrirhoja: () => this.Cambiarestado({ Hoja: true, Hojatipo: Estadoactual.Registrotipo === 'egr' && Pestana === 'ingresos' ? 'deuda' : 'ingreso', Hojafrecuencia: 'diario', Deudaeditandoid: null, Formularioerror: '' }),
    Abrirhojadeuda: () => this.Cambiarestado({ Hoja: true, Hojatipo: 'deuda', Hojafrecuencia: 'fijo', Deudaeditandoid: null, Formulariodeuda: { Tipo: 'Tarjeta de crédito', Cuota: 0, Saldo: 0, Entidad: '', Nombre: '' }, Formularioerror: '' }),
    Abrirhojagasto: () => this.Cambiarestado({ Hoja: true, Hojatipo: 'deuda', Hojafrecuencia: 'diario', Deudaeditandoid: null, Formularioerror: '' }),
    Abriringresofijo: () => this.Cambiarestado({ Hoja: true, Hojatipo: 'ingreso', Hojafrecuencia: 'fijo', Deudaeditandoid: null, Formularioerror: '' }),
    Hojaegresofijo: Estadoactual.Hojatipo === 'deuda' && Estadoactual.Hojafrecuencia === 'fijo',
    Hojaingresodia: Estadoactual.Hojatipo !== 'deuda' && Estadoactual.Hojafrecuencia !== 'fijo',
    Hojaingresofijo: Estadoactual.Hojatipo !== 'deuda' && Estadoactual.Hojafrecuencia === 'fijo',
    Hojaegresodia: Estadoactual.Hojatipo === 'deuda' && Estadoactual.Hojafrecuencia !== 'fijo',
    Sindeudas: Estadoactual.Deudas.length === 0,
    Hojaantetitulo: Estadoactual.Hojatipo === 'deuda' ? (Estadoactual.Hojafrecuencia === 'fijo' ? (Estadoactual.Deudaeditandoid ? 'EDITAR DEUDA O EGRESO' : 'LO QUE EL BANCO TE DESCUENTA') : 'GASTO DEL DÍA') : (Estadoactual.Hojafrecuencia === 'fijo' ? 'LLEGA CADA MES' : 'REGISTRO EN 3 SEGUNDOS'),
    Hojatipos: [['ingreso', 'Ingreso'], ['deuda', 'Egreso']].map(([Clave, Etiquetatexto]) => ({ Etiqueta: Etiquetatexto, Fondo: Estadoactual.Hojatipo === Clave ? (Clave === 'deuda' ? 'var(--ik)' : 'var(--ac)') : 'transparent', Color: Estadoactual.Hojatipo === Clave ? (Clave === 'deuda' ? 'var(--bg)' : 'var(--oa)') : 'var(--mu)', Alclic: () => this.Cambiarestado({ Hojatipo: Clave, Formularioerror: '' }) })),
    Deudatipofichas: Tiposdeuda.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Estadoactual.Formulariodeuda.Tipo === Opcion), Alclic: () => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Tipo: Opcion } }) })),
    Formdeudacuotatexto: Estadoactual.Formulariodeuda.Cuota ? Formatonumero(Estadoactual.Formulariodeuda.Cuota) : '',
    Formdeudasaldotexto: Estadoactual.Formulariodeuda.Saldo ? Formatoenteropesos(Estadoactual.Formulariodeuda.Saldo) : '',
    Formdeudaentidad: Estadoactual.Formulariodeuda.Entidad,
    Escribirdeudacuota: (Elemento) => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Cuota: +(Elemento.target.value.replace(/\D/g, '') || 0) }, Formularioerror: '' }),
    Escribirdeudasaldo: (Elemento) => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Saldo: +(Elemento.target.value.replace(/\D/g, '') || 0) } }),
    Escribirdeudaentidad: (Elemento) => this.Cambiarestado({ Formulariodeuda: { ...Estadoactual.Formulariodeuda, Entidad: Textoseguro(Elemento.target.value, 60) } }),
    Formdeudapista: Estadoactual.Formulariodeuda.Cuota ? 'Esta cuota le resta $' + Formatomillones(Estadoactual.Formulariodeuda.Cuota * Calculo.Tope * Calculo.Factor / Configuracion.Financiacion) + ' M a tu vivienda. Podrás apagarla en Plan para ver cuánto liberas.' : 'Incluye solo cuotas fijas que aparecen en tu historial crediticio o que pagas cada mes.',
    Guardardeudaetiqueta: Estadoactual.Deudaeditandoid ? (Estadoactual.Formulariodeuda.Cuota ? 'Guardar cambios · ' + Formatoenteropesos(Estadoactual.Formulariodeuda.Cuota) + '/mes' : 'Guardar cambios') : (Estadoactual.Formulariodeuda.Cuota ? 'Guardar · ' + Formatoenteropesos(Estadoactual.Formulariodeuda.Cuota) + '/mes' : 'Guardar deuda'),
    Formdeudaeditando: !!Estadoactual.Deudaeditandoid,
    Eliminardeudaactual: () => { if (Estadoactual.Deudaeditandoid) this.Eliminardeuda(Estadoactual.Deudaeditandoid); },
    Guardardeuda: () => {
      const Formdeuda = Estadoactual.Formulariodeuda;
      if (Formdeuda.Cuota < 1000) { this.Cambiarestado({ Formularioerror: 'Escribe la cuota mensual.' }); return; }
      const Base = (Formdeuda.Tipo === 'Otro egreso fijo' && (Formdeuda.Nombre || '').trim()) || Formdeuda.Tipo;
      const Nombreitem = Formdeuda.Entidad ? Base + ' · ' + Formdeuda.Entidad : Base;
      if (Estadoactual.Deudaeditandoid) {
        const Ideditar = Estadoactual.Deudaeditandoid;
        this.Cambiarestado(Estadoprevio => ({
          Deudas: Estadoprevio.Deudas.map(Dato => Dato.id === Ideditar ? { ...Dato, Nombreitem, Corto: Nombrescortosdeuda[Formdeuda.Tipo] || 'Deuda', Cuota: Formdeuda.Cuota, Saldo: Formdeuda.Saldo, Entidad: Formdeuda.Entidad } : Dato),
          Hoja: false,
          Deudaeditandoid: null,
          Formulariodeuda: { Tipo: Formdeuda.Tipo, Cuota: 0, Saldo: 0, Entidad: '', Nombre: '' }
        }));
        this.Aviso('Deuda “' + Nombreitem + '” actualizada: ' + Formatoenteropesos(Formdeuda.Cuota) + '/mes.');
      } else {
        this.Cambiarestado(Estadoprevio => ({
          Deudas: [...Estadoprevio.Deudas, { id: 'd' + Date.now(), Nombreitem, Corto: Nombrescortosdeuda[Formdeuda.Tipo] || 'Deuda', Cuota: Formdeuda.Cuota, Saldo: Formdeuda.Saldo, Entidad: Formdeuda.Entidad, Activa: true, Pagada: false }],
          Hoja: false,
          Formulariodeuda: { Tipo: Formdeuda.Tipo, Cuota: 0, Saldo: 0, Entidad: '', Nombre: '' }
        }));
        this.Aviso(Nombreitem + ' agregada: −' + Formatoenteropesos(Formdeuda.Cuota) + '/mes en tu cálculo.');
      }
    },
    Cerrarhoja: () => this.Cambiarestado({ Hoja: false, Deudaeditandoid: null }),
    Hojaopacidad: Estadoactual.Hoja ? 1 : 0,
    Hojaeventos: Estadoactual.Hoja ? 'auto' : 'none',
    Hojadesplazamiento: Estadoactual.Hoja ? 'translateY(0)' : 'translateY(105%)',
    Formulariomontotexto: Formactual.Monto ? Formatonumero(Formactual.Monto) : '',
    Escribirmonto: (Elemento) => this.Cambiarestado({ Formulario: { ...Formactual, Monto: +(Elemento.target.value.replace(/\D/g, '') || 0) }, Formularioerror: '' }),
    Fichasrapidas: [50000, 100000, 250000, 500000].map(Valor => ({ Etiqueta: '+' + Formatoenteropesos(Valor), Alclic: () => this.Cambiarestado({ Formulario: { ...Formactual, Monto: Formactual.Monto + Valor }, Formularioerror: '' }) })),
    Fuentefichas: Fuentesingreso.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Formactual.Fuente === Opcion), Alclic: () => this.Cambiarestado({ Formulario: { ...Formactual, Fuente: Opcion } }) })),
    Mediofichas: Mediospago.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Formactual.Medio === Opcion), Alclic: () => this.Cambiarestado({ Formulario: { ...Formactual, Medio: Opcion } }) })),
    Formularioerror: Estadoactual.Formularioerror,
    Guardaretiqueta: Formactual.Monto ? 'Guardar · ' + Formatoenteropesos(Formactual.Monto) : 'Guardar ingreso',
    Guardarregistro: () => {
      if (Formactual.Monto < 1000) { this.Cambiarestado({ Formularioerror: 'Escribe un monto o toca una cifra rápida.' }); return; }
      const Dato = new Date(), Hora = String(Dato.getHours()).padStart(2, '0') + ':' + String(Dato.getMinutes()).padStart(2, '0');
      this.Cambiarestado(Estadoprevio => ({ Diasregistrados: Marcardiaregistro(Estadoprevio.Diasregistrados), Registros: [...Estadoprevio.Registros, { Fecha: Hoyregistro(), Concepto: (Formactual.Fuente === 'Otros' && (Formactual.Nombre || '').trim()) || Formactual.Fuente, Fuente: Formactual.Fuente, Medio: Formactual.Medio, Monto: Formactual.Monto, Hora }], Hoja: false, Diaseleccionado: 6, Formulario: { ...Estadoprevio.Formulario, Monto: 0, Nombre: '' } }));
      this.Aviso('+' + Formatoenteropesos(Formactual.Monto) + ' registrados. Cuentan para tu promedio de ingresos cuando termine el mes.');
    }
  };
}
