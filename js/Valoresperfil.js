// Preparación de los datos del perfil del usuario, entidades financieras y configuración inicial

function Generarvaloresperfil(Calculo, Fichaseleccion, Oscuroactivo) {
  const Estadoactual = this.Estadocomponente, Recordatorio = Estadoactual.Recordatorios;
  const Digitos = (Elemento, Maximo) => Limpiardigitos(Elemento.target.value, Maximo);
  const Partes = Estadoactual.Nombre.trim().split(/\s+/).filter(Boolean);
  const Interruptor = (Activo) => ({ Riel: Activo ? 'var(--ac)' : 'var(--c2)', Perilla: Activo ? 'var(--oa)' : 'var(--mu)', Posicion: Activo ? 'translateX(22px)' : 'none' });
  const Fijarrecordatorio = (Cambios) => this.Cambiarestado(Estadoprevio => ({ Recordatorios: { ...Estadoprevio.Recordatorios, ...Cambios } }));
  const Horasrecordatorio = ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];
  const Fotosegura = Imagensegura(Estadoactual.Avatarimagen);
  const Plazomaximo = Math.max(0, Math.min(30, 75 - (Estadoactual.Edad || 0)));
  const Invitado = Boolean(Estadoactual.Invitado);
  const Primernombre = Partes[0] || (Invitado ? 'Invitado' : 'Hola');
  const Etiquetastipo = { fijo: 'Salario fijo', variable: 'Ingresos que cambian', mixto: 'Las dos cosas' };
  const Ingresomensual = (Estadoactual.Tipo === 'variable' ? 0 : (Estadoactual.Fijo || 0)) + (Estadoactual.Tipo === 'fijo' ? 0 : (Estadoactual.Variable || 0));
  const Deudasactivas = (Estadoactual.Deudas || []).filter(Dato => Dato.Activa !== false);
  const Sumadeudas = Deudasactivas.reduce((Suma, Dato) => Suma + (Dato.Cuota || 0), 0);

  let Completos = 0;
  const Faltantes = [];
  if ((Estadoactual.Nombre || '').trim()) Completos++; else Faltantes.push('tu nombre');
  if (Estadoactual.Edad >= 18) Completos++; else Faltantes.push('tu edad');
  if (Ingresomensual > 0) Completos++; else Faltantes.push('tus ingresos');
  if ((Estadoactual.Ahorro || 0) > 0 || (Estadoactual.Ahorromes || 0) > 0) Completos++; else Faltantes.push('tu ahorro');
  if (Estadoactual.Caja || Estadoactual.Sisben) Completos++; else Faltantes.push('tus datos de Caja y subsidios');
  const Avance = Math.round(Completos / 5 * 100);
  const Siguientedato = !Estadoactual.Caja && !Estadoactual.Sisben ? 'subsidios' : (!Estadoactual.Nombre || !Estadoactual.Edad ? 'personales' : Ingresomensual <= 0 ? 'ingresos' : 'ahorro');
  const Avancetexto = Avance >= 100
    ? 'Tu perfil está completo: todos tus datos entran en el cálculo.'
    : 'Agrega ' + Faltantes[Faltantes.length - 1] + ' para que tu presupuesto sea más preciso.';

  const Horabonita = (Recordatorio.Hora || '8:00 PM').replace('PM', 'p. m.').replace('AM', 'a. m.');
  const Activosdias = (Recordatorio.Dias || []).filter(Boolean).length;
  const Avisosresumenhora = !Recordatorio.Diario ? 'Recordatorio apagado · tocar para ajustar'
    : (Activosdias >= 7 ? 'Todos los días' : Activosdias + ' días a la semana') + ' a las ' + Horabonita;

  const Datospersonales = [Estadoactual.Nombre ? Partes[0] : '', Estadoactual.Edad ? Estadoactual.Edad + ' años' : '', Estadoactual.Ciudad || 'Bogotá'].filter(Boolean).join(' · ');
  const Ingresotextoresumen = Ingresomensual > 0 ? Formatoenteropesos(Ingresomensual) + ' al mes' + (Estadoactual.Tipo !== 'fijo' ? ' (promedio)' : '') : 'Sin registrar';
  const Ahorroresumentexto = (Estadoactual.Ahorro || 0) > 0 || (Estadoactual.Ahorromes || 0) > 0
    ? Formatoenteropesos(Estadoactual.Ahorro || 0) + ' · ahorras ' + Formatoenteropesos(Estadoactual.Ahorromes || 0) + ' al mes' : 'Sin ahorros registrados';
  const Cajasubsidio = Estadoactual.Caja ? (Estadoactual.Cajanombre || 'Afiliado a Caja') + (Estadoactual.Sisben ? ' · Sisbén' : '') : (Estadoactual.Sisben ? 'Sin Caja · con Sisbén' : 'Sin afiliación');
  const Titulosdato = { personales: 'Datos personales', ingresos: 'Ingresos', ahorro: 'Ahorro y vivienda' };

  return {
    Esperfil: this.Pantalla === 'app' && Estadoactual.Panel === 'perfil',
    Esrecordatorio: this.Pantalla === 'app' && Estadoactual.Panel === 'rem',
    Cerrarpanel: () => this.Cambiarestado({ Panel: null, Perfildato: '', Ciudadabierta: false }),
    Perfilvolver: Nombrespestanas[this.Pestana] || 'Inicio',
    Perfilavatarclase: Invitado && !Fotosegura && !Partes[0] ? 'is-invitado' : 'is-cuenta',
    Perfilnombremostrar: (Estadoactual.Nombre || '').trim() || (Invitado ? 'Invitado' : 'Sin nombre'),
    Perfilmetaprincipal: Invitado ? 'Sin cuenta · tus datos están solo en este celular' : (Estadoactual.Correo || ''),
    Perfilmetasecundaria: (Estadoactual.Ciudad || 'Bogotá') + ' · ' + (Etiquetastipo[Estadoactual.Tipo] || 'Salario fijo'),
    Perfilavance: Avance,
    Perfilavanceancho: Avance + '%',
    Perfilavanceetiqueta: 'Tu perfil está completo en un ' + Avance + '%',
    Perfilavancetexto: Avancetexto,
    Perfilavancependiente: Avance < 100,
    Perfilcompletaraccion: () => {
      if (Siguientedato === 'subsidios') this.Cambiarestado({ Panel: 'subsidios' });
      else this.Cambiarestado({ Perfildato: Siguientedato, Ciudadabierta: false });
    },
    Perfilresumenpersonales: Datospersonales,
    Perfilresumeningresos: Ingresotextoresumen,
    Perfilresumenahorro: Ahorroresumentexto,
    Perfilresumendeudas: Estadoactual.Deudas.length ? Estadoactual.Deudas.length + (Estadoactual.Deudas.length === 1 ? ' deuda · ' : ' deudas · ') + Formatoenteropesos(Sumadeudas) + ' al mes' : 'Sin deudas registradas',
    Perfilresumencaja: Cajasubsidio,
    Perfilcajacompletar: !Estadoactual.Caja && !Estadoactual.Sisben,
    Abrirperfilpersonales: () => this.Cambiarestado({ Perfildato: 'personales', Ciudadabierta: false }),
    Abrirperfilingresos: () => this.Cambiarestado({ Perfildato: 'ingresos' }),
    Abrirperfilahorro: () => this.Cambiarestado({ Perfildato: 'ahorro' }),
    Abrirperfildeudas: () => this.Cambiarestado({ Panel: 'deudas' }),
    Abrirperfilsubsidios: () => this.Cambiarestado({ Panel: 'subsidios' }),
    Esperfildato: this.Pantalla === 'app' && Estadoactual.Panel === 'perfil' && Boolean(Estadoactual.Perfildato),
    Perfildatotitulo: Titulosdato[Estadoactual.Perfildato] || 'Editar datos',
    Perfildatopersonales: Estadoactual.Perfildato === 'personales',
    Perfildatoingresos: Estadoactual.Perfildato === 'ingresos',
    Perfildatoahorro: Estadoactual.Perfildato === 'ahorro',
    Cerrarperfildato: () => this.Cambiarestado({ Perfildato: '', Ciudadabierta: false }),
    Diarioclase: Recordatorio.Diario ? 'is-activo' : '',
    Avisosresumenhora: Avisosresumenhora,
    Abrirpanelrecordatorios: () => this.Cambiarestado({ Panel: 'rem' }),
    Volveraperfil: () => this.Cambiarestado({ Panel: 'perfil' }),
    Verbienvenidaotrarez: () => this.Cambiarestado({ Panel: null, Ayuda: false, Pestana: 'inicio', Tutorialvisto: false, Tutorialpaso: 0, Tutorialcaja: null, Consejosvistos: {}, Consejopaso: 0 }),
    Cerrarsesionperfil: () => this.Cerrarsesionusuario(),
    Perfilborrarsubtitulo: Invitado ? 'Se borra todo lo que guardaste en este celular' : 'Se borran todos tus datos',
    Primernombre,
    Nombrecompletousuario: Estadoactual.Nombre || 'Sin nombre',
    Iniciales: ((Partes[0] || '?')[0] + (Partes[1] ? Partes[1][0] : '')).toUpperCase(),
    // Sin nombre no se pone un signo de pregunta en la foto
    Coniniciales: Boolean(Partes[0]),
    Sininiciales: !Partes[0],
    Ciudad: Estadoactual.Ciudad,
    Metatexto: Formatoenteropesos(Calculo.Metadiaria),
    Ahorromillones: '$' + Formatomillones(Estadoactual.Ahorro) + ' M',
    Perfilnombre: Estadoactual.Nombre,
    Escribirperfilnombre: (Elemento) => this.Cambiarestado({ Nombre: Textoseguro(Elemento.target.value, 70) }),
    Perfiledad: Estadoactual.Edad ? String(Estadoactual.Edad) : '',
    Escribirperfiledad: (Elemento) => this.Cambiarestado({ Edad: Digitos(Elemento, Limitesfinancieros.EdadMax) }),
    // La app es solo para mayores de edad, como dice la política
    Edadpista: Estadoactual.Edad && Estadoactual.Edad < 18 ? 'MiTecho es solo para mayores de 18 años.' : Estadoactual.Edad ? 'Con ' + Estadoactual.Edad + ' años, el plazo máximo de tu crédito sería de unos ' + Plazomaximo + ' años.' : 'Tu edad define el plazo máximo del crédito.',
    Ciudadabierta: Estadoactual.Ciudadabierta,
    Ciudadbusqueda: Estadoactual.Ciudadbusqueda,
    Ciudadflecha: Estadoactual.Ciudadabierta ? 'rotate(180deg)' : 'none',
    Ciudadborde: Estadoactual.Ciudadabierta ? 'var(--ad)' : 'transparent',
    Ciudaddepartamento: (Directoriociudades.find(Opcion => Opcion[0] === Estadoactual.Ciudad) || ['', 'Colombia'])[1],
    Alternarciudad: () => this.Cambiarestado({ Ciudadabierta: !Estadoactual.Ciudadabierta, Ciudadbusqueda: '' }),
    Escribirciudad: (Elemento) => this.Cambiarestado({ Ciudadbusqueda: Textoseguro(Elemento.target.value, 40) }),
    ...(() => {
      const Busqueda = Normalizartexto(Estadoactual.Ciudadbusqueda.trim());
      const Filtradas = Busqueda ? Directoriociudades.filter(([Nombreciudad, Dato]) => Normalizartexto(Nombreciudad).includes(Busqueda) || Normalizartexto(Dato).includes(Busqueda)) : Directoriociudades;
      return {
        Ciudadconteo: Filtradas.length + (Filtradas.length === 1 ? ' CIUDAD' : ' CIUDADES'),
        Ciudadvacia: Filtradas.length === 0,
        Ciudadlista: Filtradas.map(([Nombreciudad, Dato]) => {
          const Seleccion = Nombreciudad === Estadoactual.Ciudad;
          return {
            Nombreitem: Nombreciudad,
            Departamento: Dato,
            Seleccion,
            Fondo: Seleccion ? 'var(--ac)' : 'transparent',
            Color: Seleccion ? 'var(--oa)' : 'var(--ik)',
            Subtexto: Seleccion ? 'rgba(11,12,10,.65)' : 'var(--mu)',
            Alclic: () => this.Cambiarestado({ Ciudad: Nombreciudad, Ciudadabierta: false, Ciudadbusqueda: '' })
          };
        })
      };
    })(),
    Perfiltipofichas: [['fijo', 'Salario fijo'], ['variable', 'Ingresos que cambian'], ['mixto', 'Las dos cosas']].map(([Clave, Etiquetatexto]) => ({ Etiqueta: Etiquetatexto, ...Fichaseleccion(Estadoactual.Tipo === Clave), Alclic: () => this.Cambiarestado({ Tipo: Clave, Usarautomatico: true }) })),
    Perfilmostrarfijo: Estadoactual.Tipo !== 'variable',
    Perfilmostrarvariable: Estadoactual.Tipo !== 'fijo',
    Perfilfijo: Estadoactual.Fijo ? Formatoenteropesos(Estadoactual.Fijo) : '',
    Escribirperfilfijo: (Elemento) => this.Cambiarestado({ Fijo: Digitos(Elemento, Limitesfinancieros.IngresoMensual), Usarautomatico: true }),
    Perfilvariable: Estadoactual.Variable ? Formatoenteropesos(Estadoactual.Variable) : '',
    Escribirperfilvariable: (Elemento) => this.Cambiarestado({ Variable: Digitos(Elemento, Limitesfinancieros.IngresoMensual), Usarautomatico: true }),
    Perfilingresototal: Formatoenteropesos((Estadoactual.Tipo === 'variable' ? 0 : Estadoactual.Fijo) + (Estadoactual.Tipo === 'fijo' ? 0 : Estadoactual.Variable)),
    Perfilahorro: Estadoactual.Ahorro ? Formatoenteropesos(Estadoactual.Ahorro) : '',
    Escribirperfilahorro: (Elemento) => this.Cambiarestado({ Ahorro: Digitos(Elemento, Limitesfinancieros.Ahorro) }),
    Perfilahorromes: Estadoactual.Ahorromes ? Formatoenteropesos(Estadoactual.Ahorromes) : '',
    Escribirperfilahorromes: (Elemento) => this.Cambiarestado({ Ahorromes: Digitos(Elemento, Limitesfinancieros.AhorroMensual) }),
    Perfilobjetivo: Estadoactual.Objetivousuario ? Formatoenteropesos(Estadoactual.Objetivousuario) : '',
    Escribirperfilobjetivo: (Elemento) => this.Cambiarestado({ Objetivousuario: Digitos(Elemento, Limitesfinancieros.ViviendaObjetivo) }),
    Perfilmetainfo: 'Con esta vivienda tu meta diaria es ' + Formatoenteropesos(Calculo.Metadiaria) + ': (ingreso necesario ' + Formatoenteropesos(Calculo.Ingresonecesario) + ' − ingresos fijos ' + Formatoenteropesos(Calculo.Fijopromedio) + ') ÷ 26 días.',
    Cajaactiva: Estadoactual.Caja,
    Alternarcaja: () => this.Cambiarestado({ Caja: !Estadoactual.Caja }),
    Cajariel: Interruptor(Estadoactual.Caja).Riel,
    Cajaperilla: Interruptor(Estadoactual.Caja).Perilla,
    Cajaposicion: Interruptor(Estadoactual.Caja).Posicion,
    Cajafichas: ['Compensar', 'Colsubsidio', 'Cafam', 'Comfama', 'Comfenalco', 'Comfandi', 'Cajacopi', 'Otra'].map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Estadoactual.Cajanombre === Opcion), Alclic: () => this.Cambiarestado({ Cajanombre: Opcion }) })),
    Alternarsisben: () => this.Cambiarestado({ Sisben: !Estadoactual.Sisben }),
    Sisbenriel: Interruptor(Estadoactual.Sisben).Riel,
    Sisbenperilla: Interruptor(Estadoactual.Sisben).Perilla,
    Sisbenposicion: Interruptor(Estadoactual.Sisben).Posicion,
    Perfildeudascantidad: Estadoactual.Deudas.length ? Estadoactual.Deudas.length + (Estadoactual.Deudas.length === 1 ? ' deuda registrada' : ' deudas registradas') : 'Sin deudas registradas',
    Perfildeudassuma: Formatoenteropesos(Estadoactual.Deudas.filter(Dato => Dato.Activa !== false).reduce((Acumulado, Dato) => Acumulado + Dato.Cuota, 0)) + ' al mes en el cálculo',
    Perfilirdeudas: () => this.Cambiarestado({ Panel: null, Pestana: 'plan' }),
    Alternardiario: () => {
      const NuevoActivo = !Recordatorio.Diario;
      Fijarrecordatorio({ Diario: NuevoActivo });
      if (window.Puentenativo) {
        if (NuevoActivo && typeof window.Puentenativo.solicitarPermisoNotificaciones === 'function') {
          window.Puentenativo.solicitarPermisoNotificaciones();
        }
        if (typeof window.Puentenativo.programarRecordatorioRacha === 'function') {
          window.Puentenativo.programarRecordatorioRacha(NuevoActivo, Recordatorio.Hora || '20:00');
        }
      }
    },
    Diarioactivo: Recordatorio.Diario,
    Horafichas: Horasrecordatorio.map(Opcion => ({
      Etiqueta: Opcion,
      ...Fichaseleccion(Recordatorio.Hora === Opcion),
      Alclic: () => {
        Fijarrecordatorio({ Hora: Opcion });
        if (window.Puentenativo && typeof window.Puentenativo.programarRecordatorioRacha === 'function') {
          window.Puentenativo.programarRecordatorioRacha(Recordatorio.Diario !== false, Opcion);
        }
      }
    })),
    Diafichas: ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((Etiquetatexto, Indice) => ({ Etiqueta: Etiquetatexto, ...Fichaseleccion(Boolean(Recordatorio.Dias[Indice])), Alclic: () => Fijarrecordatorio({ Dias: Recordatorio.Dias.map((Valor, Posicionotra) => Posicionotra === Indice ? !Valor : Valor) }) })),
    Recordatoriointerruptores: [
      ['Efectivo', 'Efectivo sin consignar', 'Aviso diario si tienes efectivo pendiente por consignar'],
      ['Semanal', 'Resumen semanal', 'Los lunes: cuánto subió tu techo'],
      ['Pagos', 'Pago de cuotas', '2 días antes de cada cuota de tus deudas'],
      ['Subsidios', 'Subsidios y proyectos', 'Proyectos VIS y subsidios que te caben']
    ].map(([Clave, Etiquetatexto, Subtexto]) => ({
      Etiqueta: Etiquetatexto,
      Subtexto,
      Activo: Boolean(Recordatorio[Clave]),
      Clase: Recordatorio[Clave] ? 'is-activo' : '',
      Alclic: () => {
        const Nuevo = !Recordatorio[Clave];
        Fijarrecordatorio({ [Clave]: Nuevo });
        if (Clave === 'Efectivo' && window.Puentenativo && typeof window.Puentenativo.actualizarEstadoEfectivo === 'function') {
          const Regs = Estadoactual.Registros || [];
          const Efectivopendiente = Regs.filter(E => !E.Consignado && E.Medio === 'Efectivo').reduce((Acc, E) => Acc + (E.Monto || 0), 0) + (Estadoactual.Efectivoanterior || 0);
          window.Puentenativo.actualizarEstadoEfectivo(Nuevo && Efectivopendiente > 0);
        }
      }
    }))
  };

}

function Generarvaloresentidades(Calculo, Seleccion) {
  const Estadoactual = this.Estadocomponente, Pestana = Estadoactual.Entidadpestana === 'fna' ? 'fna' : 'caja', E = (Estadoactual.Infoentidad || {})[Pestana] || {};
  const Fijar = (Clave, Valor) => this.Cambiarestado(Estadoprevio => ({ Infoentidad: { ...(Estadoprevio.Infoentidad || {}), [Pestana]: { ...((Estadoprevio.Infoentidad || {})[Pestana] || {}), [Clave]: Valor } } }));
  const Campodinero = (Clave, Etiqueta, Pista, Maximo = Limitesfinancieros.Ahorro) => ({ Escampo: true, Etiqueta, Valorcampo: E[Clave] ? Formatoenteropesos(E[Clave]) : '', Modoteclado: 'numeric', Ejemplo: '$0', Pista: Pista || '', Alescribir: (Elemento) => Fijar(Clave, Limpiardigitos(Elemento.target.value, Maximo)) });
  const Camponumero = (Clave, Etiqueta, Ejemplo, Pista, Decimal, Maximo = Limitesfinancieros.MesesAfiliacionMax) => ({ Escampo: true, Etiqueta, Valorcampo: E[Clave] ? String(E[Clave]).replace('.', ',') : '', Modoteclado: Decimal ? 'decimal' : 'numeric', Ejemplo, Pista: Pista || '', Alescribir: (Elemento) => Fijar(Clave, Decimal ? Limpiardecimal(Elemento.target.value, Maximo, 2) : Limpiardigitos(Elemento.target.value, Maximo)) });
  const Campotexto = (Clave, Etiqueta, Ejemplo) => ({ Escampo: true, Etiqueta, Valorcampo: E[Clave] || '', Modoteclado: 'text', Ejemplo, Pista: '', Alescribir: (Elemento) => Fijar(Clave, Textoseguro(Elemento.target.value, 20)) });
  const Fichas = (Clave, Etiqueta, Opciones) => ({ Esfichas: true, Etiqueta, Opciones: Opciones.map(Objeto => ({ Etiqueta: Objeto, ...Seleccion(E[Clave] === Objeto), Alclic: () => Fijar(Clave, E[Clave] === Objeto ? '' : Objeto) })) });
  const Esfna = Pestana === 'fna', Nombreitem = Esfna ? 'FNA' : (Estadoactual.Cajanombre || 'tu Caja');
  let Afiliacionestado = {}, Subsidioestado = {};
  if (E.Meses > 0 && E.Mesesrequeridos > 0) {
    const Filtradas = E.Mesesrequeridos - E.Meses;
    if (Filtradas <= 0) Afiliacionestado = { status: 'Cumples el tiempo mínimo (' + E.Meses + ' de ' + E.Mesesrequeridos + ' meses).', Estadofondo: 'var(--ac)' };
    else { const Dato = new Date(); Dato.setMonth(Dato.getMonth() + Filtradas); Afiliacionestado = { status: 'Te faltan ' + Filtradas + (Filtradas === 1 ? ' mes' : ' meses') + ': lo cumples en ' + Dato.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }) + '.', Estadofondo: '#FFD23F' }; }
  } else if (E.Meses > 0 || E.Mesesrequeridos > 0) Afiliacionestado = { status: 'Escribe ' + (E.Meses > 0 ? 'el tiempo mínimo que te pide la entidad' : 'tus meses de afiliación') + ' para saber si ya cumples.', Estadofondo: 'var(--c2)' };
  const Valormes = Mesesvigencia(E.Vencesubsidio);
  if (E.Vencesubsidio && Valormes === null) Subsidioestado = { status: 'Escribe la vigencia como mes/año, por ejemplo 12/2027.', Estadofondo: 'var(--c2)' };
  else if (Valormes !== null && Valormes < 0) Subsidioestado = { status: 'Tu subsidio venció. No lo sumamos a tu cuota inicial; pregunta en ' + Nombreitem + ' si puedes prorrogarlo.', Estadofondo: 'var(--al)' };
  else if (Valormes !== null && Valormes <= 3) Subsidioestado = { status: 'Tu subsidio vence en ' + (Valormes <= 0 ? 'este mes' : Valormes + (Valormes === 1 ? ' mes' : ' meses')) + '. Úsalo antes o pide una prórroga.', Estadofondo: '#FFD23F' };
  else if (Valormes !== null) Subsidioestado = { status: 'Vigente por ' + Valormes + ' meses más.', Estadofondo: 'var(--ac)' };

  const Secciones = [
    {
      Numeroseccion: '01', Titulo: 'Afiliación', Descripcioncorta: Esfna ? 'Cómo ahorras en el Fondo Nacional del Ahorro.' : 'Tu vínculo con ' + Nombreitem + '.', Campos: [
        Fichas('Vinculo', 'TIPO DE VINCULACIÓN', Esfna ? ['Cesantías', 'Ahorro voluntario (AVC)', 'Ambos'] : ['Dependiente', 'Independiente', 'Pensionado']),
        Camponumero('Meses', 'MESES DE AFILIACIÓN', '0', '', false, Limitesfinancieros.MesesAfiliacionMax),
        Camponumero('Mesesrequeridos', 'TIEMPO MÍNIMO QUE TE PIDE (MESES)', '0', Esfna ? 'Pregúntalo en el FNA: es el ahorro mínimo antes de pedir crédito.' : 'Pregúntalo en ' + Nombreitem + ': es la afiliación mínima para postularte al subsidio.', false, Limitesfinancieros.MesesAfiliacionMax)], ...Afiliacionestado
    },
    {
      Numeroseccion: '02', Titulo: 'Ahorro en la entidad', Descripcioncorta: 'Saldos que puedes usar para la cuota inicial. No los incluyas si ya los sumaste en "Ahorro para cuota inicial".', Campos: [
        Campodinero('Cesantias', Esfna ? 'SALDO DE CESANTÍAS EN EL FNA' : 'SALDO DE CESANTÍAS (TU FONDO)', '', Limitesfinancieros.Ahorro),
        Campodinero('Ahorro', Esfna ? 'SALDO DE AHORRO VOLUNTARIO (AVC)' : 'AHORRO PROGRAMADO EN LA CAJA', '', Limitesfinancieros.Ahorro)]
    },
    {
      Numeroseccion: '03', Titulo: 'Subsidio', Descripcioncorta: 'Si ya te postulaste o te asignaron un subsidio, usamos el valor real en vez del estimado.', Campos: [
        Fichas('Estadosubsidio', 'ESTADO', ['No me he postulado', 'Postulado', 'Asignado', 'Aplicado']),
        Campodinero('Montosubsidio', 'VALOR ASIGNADO', Esfna ? 'Por ejemplo, Mi Casa Ya tramitado con el FNA.' : 'Aparece en la carta de asignación de tu Caja.', Limitesfinancieros.Subsidio),
        Campotexto('Vencesubsidio', 'VIGENCIA (MES/AÑO)', '12/2027')], ...Subsidioestado
    },
    {
      Numeroseccion: '04', Titulo: 'Crédito preaprobado', Descripcioncorta: 'Si ' + Nombreitem + ' ya te preaprobó un crédito, escribe sus condiciones. Se usan cuando eliges esta entidad en Simular.', Campos: [
        Campodinero('Monto', 'MONTO PREAPROBADO', '', Limitesfinancieros.CreditoPreaprobado),
        Camponumero('Tasa', 'TASA E.A. (%)', '0,0', '', true, Limitesfinancieros.TasaEAMax),
        Camponumero('Plazo', 'PLAZO (AÑOS)', '0', '', false, Limitesfinancieros.PlazoAniosMax),
        Camponumero('Financiacion', 'FINANCIACIÓN (% DEL INMUEBLE)', '0', 'Hasta 80% en VIS; el FNA puede financiar más en VIS y VIP.', false, Limitesfinancieros.FinanciacionMax)]
    }
  ];

  const Clavesentidad = ['Vinculo', 'Meses', 'Mesesrequeridos', 'Cesantias', 'Ahorro', 'Estadosubsidio', 'Montosubsidio', 'Vencesubsidio', 'Monto', 'Tasa', 'Plazo', 'Financiacion'];
  const Llenos = (Objeto) => Clavesentidad.filter(Clave => Objeto && Objeto[Clave] !== undefined && Objeto[Clave] !== '' && Objeto[Clave] !== 0).length;
  const Totaldatos = Llenos((Estadoactual.Infoentidad || {}).caja) + Llenos((Estadoactual.Infoentidad || {}).fna);
  const Usando = [];
  if (Calculo.Ahorroentidad > 0) Usando.push('Sumamos ' + Formatoenteropesos(Calculo.Ahorroentidad) + ' de cesantías y ahorros a tu cuota inicial');
  const Infoentidades = Estadoactual.Infoentidad || {};
  ['caja', 'fna'].forEach(Clave => { const Objeto = Infoentidades[Clave] || {}; if (Objeto.Meses > 0 && Objeto.Mesesrequeridos > Objeto.Meses) Usando.push('Aún no cumples el tiempo mínimo en ' + (Clave === 'fna' ? 'el FNA' : (Estadoactual.Cajanombre || 'tu Caja')) + ': ' + (Clave === 'fna' ? 'el crédito' : 'el subsidio') + ' podría no aplicar todavía'); });
  if (Calculo.Subsidiocajareal) Usando.push('Usamos tu subsidio asignado por la Caja');
  if (Calculo.Subsidiofnareal) Usando.push('Usamos tu subsidio asignado con el FNA');
  if (Calculo.Preaprobadomonto || Calculo.Preaprobadotasa) Usando.push('Simular usa el crédito preaprobado de ' + (Calculo.Entidadclave === 'fna' ? 'FNA' : Estadoactual.Cajanombre || 'tu Caja'));
  else if (Llenos(E) && (E.Monto || E.Tasa)) Usando.push('Elige ' + Nombreitem + ' en Simular para usar su crédito preaprobado');

  return {
    Entidadpestanas: [['caja', Estadoactual.Cajanombre ? 'Caja · ' + Estadoactual.Cajanombre : 'Caja de compensación'], ['fna', 'Fondo Nacional del Ahorro']].map(([Clave, Etiquetatexto]) => { const Activo = Pestana === Clave; return { Etiqueta: Etiquetatexto, Fondo: Activo ? 'var(--ik)' : 'transparent', Color: Activo ? 'var(--bg)' : 'var(--mu)', Alclic: () => this.Cambiarestado({ Entidadpestana: Clave }) }; }),
    Entidadsecciones: Secciones,
    Entidadpestananombre: Nombreitem,
    Entidadprecisionetiqueta: Totaldatos ? Totaldatos + ' DE ' + (Clavesentidad.length * 2) + ' DATOS' : 'ESTIMADO GENERAL',
    Entidadprecisionancho: Math.round(Totaldatos / (Clavesentidad.length * 2) * 100) + '%',
    Entidadusando: Usando,
    Entidadlimpiar: () => this.Cambiarestado(Estadoprevio => ({ Infoentidad: { ...(Estadoprevio.Infoentidad || {}), [Pestana]: {} } }))
  };
}
