// Preparación de los datos del perfil del usuario, entidades financieras y configuración inicial

function Generarvaloresperfil(Calculo, Fichaseleccion, Oscuroactivo) {
const Estadoactual = this.Estadocomponente, Recordatorio = Estadoactual.Recordatorios;
    const Digitos = (Elemento) => +(Elemento.target.value.replace(/\D/g, '') || 0);
    const Partes = Estadoactual.Nombre.trim().split(/\s+/).filter(Boolean);
    const Interruptor = (Activo) => ({ Riel: Activo ? 'var(--ac)' : 'var(--c2)', Perilla: Activo ? 'var(--oa)' : 'var(--mu)', Posicion: Activo ? 'translateX(22px)' : 'none' });
    const Fijarrecordatorio = (Cambios) => this.Cambiarestado(Estadoprevio => ({ Recordatorios: { ...Estadoprevio.Recordatorios, ...Cambios } }));
    const Ciudadesconstante = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena'];
    const Horasrecordatorio = ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];
    const Totalhoy = Estadoactual.Registros.reduce((Acumulado, Elemento) => Acumulado + Elemento.Monto, 0);
    const Plazomaximo = Math.max(0, Math.min(30, 75 - (Estadoactual.Edad || 0)));
    const Diariointerruptor = Interruptor(Recordatorio.Diario);

    return {
      Esperfil: this.Pantalla === 'app' && Estadoactual.Panel === 'perfil',
      Esrecordatorio: this.Pantalla === 'app' && Estadoactual.Panel === 'rem',
      Cerrarpanel: () => this.Cambiarestado({ Panel: null }),
      Primernombre: Partes[0] || 'Hola',
      Nombrecompletousuario: Estadoactual.Nombre || 'Sin nombre',
      Iniciales: ((Partes[0] || '?')[0] + (Partes[1] ? Partes[1][0] : '')).toUpperCase(),
      Ciudad: Estadoactual.Ciudad,
      Metatexto: Formatoenteropesos(Calculo.Metadiaria),
      Ahorromillones: '$' + Formatomillones(Estadoactual.Ahorro) + ' M',
      Perfilnombre: Estadoactual.Nombre,
      Escribirperfilnombre: (Elemento) => this.Cambiarestado({ Nombre: Textoseguro(Elemento.target.value, 70) }),
      Perfiledad: Estadoactual.Edad ? String(Estadoactual.Edad) : '',
      Escribirperfiledad: (Elemento) => this.Cambiarestado({ Edad: Math.min(99, Digitos(Elemento)) }),
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
      Ciudadfichas: Ciudadesconstante.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Estadoactual.Ciudad === Opcion), Alclic: () => this.Cambiarestado({ Ciudad: Opcion }) })),
      Perfiltipofichas: [['fijo', 'Fijo'], ['variable', 'Variable'], ['mixto', 'Mixto']].map(([Clave, Etiquetatexto]) => ({ Etiqueta: Etiquetatexto, ...Fichaseleccion(Estadoactual.Tipo === Clave), Alclic: () => this.Cambiarestado({ Tipo: Clave, Usarautomatico: true }) })),
      Perfilmostrarfijo: Estadoactual.Tipo !== 'variable',
      Perfilmostrarvariable: Estadoactual.Tipo !== 'fijo',
      Perfilfijo: Estadoactual.Fijo ? Formatoenteropesos(Estadoactual.Fijo) : '',
      Escribirperfilfijo: (Elemento) => this.Cambiarestado({ Fijo: Digitos(Elemento), Usarautomatico: true }),
      Perfilvariable: Estadoactual.Variable ? Formatoenteropesos(Estadoactual.Variable) : '',
      Escribirperfilvariable: (Elemento) => this.Cambiarestado({ Variable: Digitos(Elemento), Usarautomatico: true }),
      Perfilingresototal: Formatoenteropesos((Estadoactual.Tipo === 'variable' ? 0 : Estadoactual.Fijo) + (Estadoactual.Tipo === 'fijo' ? 0 : Estadoactual.Variable)),
      Perfilahorro: Estadoactual.Ahorro ? Formatoenteropesos(Estadoactual.Ahorro) : '',
      Escribirperfilahorro: (Elemento) => this.Cambiarestado({ Ahorro: Digitos(Elemento) }),
      Perfilahorromes: Estadoactual.Ahorromes ? Formatoenteropesos(Estadoactual.Ahorromes) : '',
      Escribirperfilahorromes: (Elemento) => this.Cambiarestado({ Ahorromes: Digitos(Elemento) }),
      Perfilobjetivo: Estadoactual.Objetivousuario ? Formatoenteropesos(Estadoactual.Objetivousuario) : '',
      Escribirperfilobjetivo: (Elemento) => this.Cambiarestado({ Objetivousuario: Digitos(Elemento) }),
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
      Perfildeudassuma: Formatoenteropesos(Estadoactual.Deudas.filter(Dato => Dato.Activa).reduce((Acumulado, Dato) => Acumulado + Dato.Cuota, 0)) + ' al mes en el cálculo',
      Perfilirdeudas: () => this.Cambiarestado({ Panel: null, Pestana: 'plan' }),
      Recordatoriovistaopacidad: Recordatorio.Diario ? 1 : 0.4,
      Recordatoriohora: Recordatorio.Diario ? Recordatorio.Hora : 'Apagado',
      Recordatoriovista: Recordatorio.Diario ? 'Hoy llevas ' + Formatoenteropesos(Totalhoy) + '. Registra lo que falta y mantén tu racha.' : 'Recordatorio diario apagado.',
      Alternardiario: () => Fijarrecordatorio({ Diario: !Recordatorio.Diario }),
      Diarioactivo: Recordatorio.Diario,
      Diarioriel: Diariointerruptor.Riel,
      Diarioperilla: Diariointerruptor.Perilla,
      Diarioposicion: Diariointerruptor.Posicion,
      Horafichas: Horasrecordatorio.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Recordatorio.Hora === Opcion), Alclic: () => Fijarrecordatorio({ Hora: Opcion }) })),
      Diafichas: ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((Etiquetatexto, Indice) => ({ Etiqueta: Etiquetatexto, Fondo: Recordatorio.Dias[Indice] ? 'var(--ik)' : 'transparent', Color: Recordatorio.Dias[Indice] ? 'var(--bg)' : 'var(--mu)', Borde: Recordatorio.Dias[Indice] ? 'var(--ik)' : 'var(--ln)', Alclic: () => Fijarrecordatorio({ Dias: Recordatorio.Dias.map((Valor, Posicionotra) => Posicionotra === Indice ? !Valor : Valor) }) })),
      Recordatoriointerruptores: [
        ['Efectivo', 'Efectivo sin consignar', 'Si pasan 3 días con efectivo sin consignar'],
        ['Semanal', 'Resumen semanal', 'Los lunes: cuánto subió tu techo'],
        ['Pagos', 'Pago de cuotas', '2 días antes de cada cuota de tus deudas'],
        ['Subsidios', 'Subsidios y proyectos', 'Proyectos VIS y subsidios que te caben']
      ].map(([Clave, Etiquetatexto, Subtexto]) => ({ Etiqueta: Etiquetatexto, Subtexto, ...Interruptor(Recordatorio[Clave]), Alclic: () => Fijarrecordatorio({ [Clave]: !Recordatorio[Clave] }) }))
    };
  
}

function Generarvaloresentidades(Calculo, Seleccion) {
const Estadoactual = this.Estadocomponente, Pestana = Estadoactual.Entidadpestana === 'fna' ? 'fna' : 'caja', E = (Estadoactual.Infoentidad || {})[Pestana] || {};
    const Fijar = (Clave, Valor) => this.Cambiarestado(Estadoprevio => ({ Infoentidad: { ...(Estadoprevio.Infoentidad || {}), [Pestana]: { ...((Estadoprevio.Infoentidad || {})[Pestana] || {}), [Clave]: Valor } } }));
    const Campodinero = (Clave, Etiqueta, Pista) => ({ Escampo: true, Etiqueta, Valorcampo: E[Clave] ? Formatoenteropesos(E[Clave]) : '', Modoteclado: 'numeric', Ejemplo: '$0', Pista: Pista || '', Alescribir: (Elemento) => Fijar(Clave, +(Elemento.target.value.replace(/\D/g, '') || 0)) });
    const Camponumero = (Clave, Etiqueta, Ejemplo, Pista, Decimal) => ({ Escampo: true, Etiqueta, Valorcampo: E[Clave] ? String(E[Clave]).replace('.', ',') : '', Modoteclado: Decimal ? 'decimal' : 'numeric', Ejemplo, Pista: Pista || '', Alescribir: (Elemento) => { const Auxiliar = Elemento.target.value.replace(',', '.').replace(Decimal ? /[^\d.]/g : /\D/g, ''); Fijar(Clave, Auxiliar === '' ? 0 : (Decimal ? parseFloat(Auxiliar) || 0 : +Auxiliar)); } });
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
      { Numeroseccion: '01', Titulo: 'Afiliación', Descripcioncorta: Esfna ? 'Cómo ahorras en el Fondo Nacional del Ahorro.' : 'Tu vínculo con ' + Nombreitem + '.', Campos: [
        Fichas('Vinculo', 'TIPO DE VINCULACIÓN', Esfna ? ['Cesantías', 'Ahorro voluntario (AVC)', 'Ambos'] : ['Dependiente', 'Independiente', 'Pensionado']),
        Camponumero('Meses', 'MESES DE AFILIACIÓN', '0'),
        Camponumero('Mesesrequeridos', 'TIEMPO MÍNIMO QUE TE PIDE (MESES)', '0', Esfna ? 'Pregúntalo en el FNA: es el ahorro mínimo antes de pedir crédito.' : 'Pregúntalo en ' + Nombreitem + ': es la afiliación mínima para postularte al subsidio.') ], ...Afiliacionestado },
      { Numeroseccion: '02', Titulo: 'Ahorro en la entidad', Descripcioncorta: 'Saldos que puedes usar para la cuota inicial. No los incluyas si ya los sumaste en "Ahorro para cuota inicial".', Campos: [
        Campodinero('Cesantias', Esfna ? 'SALDO DE CESANTÍAS EN EL FNA' : 'SALDO DE CESANTÍAS (TU FONDO)'),
        Campodinero('Ahorro', Esfna ? 'SALDO DE AHORRO VOLUNTARIO (AVC)' : 'AHORRO PROGRAMADO EN LA CAJA') ] },
      { Numeroseccion: '03', Titulo: 'Subsidio', Descripcioncorta: 'Si ya te postulaste o te asignaron un subsidio, usamos el valor real en vez del estimado.', Campos: [
        Fichas('Estadosubsidio', 'ESTADO', ['No me he postulado', 'Postulado', 'Asignado', 'Aplicado']),
        Campodinero('Montosubsidio', 'VALOR ASIGNADO', Esfna ? 'Por ejemplo, Mi Casa Ya tramitado con el FNA.' : 'Aparece en la carta de asignación de tu Caja.'),
        Campotexto('Vencesubsidio', 'VIGENCIA (MES/AÑO)', '12/2027') ], ...Subsidioestado },
      { Numeroseccion: '04', Titulo: 'Crédito preaprobado', Descripcioncorta: 'Si ' + Nombreitem + ' ya te preaprobó un crédito, escribe sus condiciones. Se usan cuando eliges esta entidad en Simular.', Campos: [
        Campodinero('Monto', 'MONTO PREAPROBADO'),
        Camponumero('Tasa', 'TASA E.A. (%)', '0,0', '', true),
        Camponumero('Plazo', 'PLAZO (AÑOS)', '0'),
        Camponumero('Financiacion', 'FINANCIACIÓN (% DEL INMUEBLE)', '0', 'Hasta 80% en VIS; el FNA puede financiar más en VIS y VIP.') ] }
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

function Generarvaloressetup(Calculo, Fichaseleccion) {
const Estadoactual = this.Estadocomponente, Cuestionarioactual = Estadoactual.Cuestionario, Paso = Cuestionarioactual.Paso;
    const Cuestionariofijar = (Cambios) => this.Cambiarestado(Estadoprevio => ({ Cuestionario: { ...Estadoprevio.Cuestionario, ...Cambios, Falla: '' } }));
    const Falla = (Mensajeerror) => this.Cambiarestado(Estadoprevio => ({ Cuestionario: { ...Estadoprevio.Cuestionario, Falla: Mensajeerror } }));
    const Digitos = (Elemento) => +(Elemento.target.value.replace(/\D/g, '') || 0);
    const Fijo = Cuestionarioactual.Tipo === 'variable' ? 0 : Cuestionarioactual.Fijo, Variablemes = Cuestionarioactual.Tipo === 'fijo' ? 0 : Cuestionarioactual.Variable;
    const Cuestionariosalariosminimos = (Fijo + Variablemes) / Salariominimo, Cuestionariomodalidad = Cuestionariosalariosminimos <= 4 ? 'vis' : 'novis';
    const Estadocuestionario = { ...Estadoactual, Tipo: Cuestionarioactual.Tipo, Fijo, Variable: Variablemes, Agregado: 0, Usarautomatico: true, Pareja: false, Ingresosfijosextra: [], Ahorro: Cuestionarioactual.Ahorro, Caja: Cuestionarioactual.Caja, Sisben: Cuestionarioactual.Sisben };
    const Calculocuestionario = this.Calcular(Estadocuestionario, Cuestionarioactual.Deudas.map(Dato => ({ ...Dato, Activa: true })), Cuestionariomodalidad);
    const Interruptorcuestionario = (Activo) => ({ Riel: Activo ? 'var(--ac)' : 'var(--c2)', Perilla: Activo ? 'var(--oa)' : 'var(--mu)', Posicion: Activo ? 'translateX(22px)' : 'none' });
    const Subsidiosalarios = (Cuestionarioactual.Caja && Cuestionariosalariosminimos <= 4 ? (Cuestionariosalariosminimos <= 2 ? 30 : 20) : 0) + (Cuestionarioactual.Sisben && Cuestionariosalariosminimos <= 2 ? 20 : 0);
    const Potencialsalarios = Cuestionariosalariosminimos <= 2 ? 30 : Cuestionariosalariosminimos <= 4 ? 20 : 0;
    const Cuestionariosubsidiomensaje = Cuestionariosalariosminimos > 4 ? 'Con ingresos mayores a 4 SMMLV no aplicas a subsidio de Caja. Te mostraremos vivienda No VIS.'
      : !Cuestionarioactual.Caja ? 'Sin Caja no recibes subsidio. ' + (Cuestionarioactual.Tipo !== 'fijo' ? 'Como independiente puedes afiliarte aportando el 0,6% o el 2% de tus ingresos y postularte a ' + Formatoenteropesos(Potencialsalarios * Salariominimo) + '.' : 'Pregúntale a tu empresa a qué Caja te afilió.')
      : 'Te corresponden ' + Subsidiosalarios + ' SMMLV (' + Formatoenteropesos(Subsidiosalarios * Salariominimo) + ')' + (Cuestionarioactual.Sisben && Cuestionariosalariosminimos <= 2 ? ' sumando Mi Casa Ya' : '') + ' para vivienda VIS.';
    const Subsidiolisto = Cuestionarioactual.Caja && Subsidiosalarios > 0 && Cuestionariosalariosminimos <= 4;
    const Tiposingreso = [['fijo', 'Fijo', 'Salario o pensión'], ['variable', 'Variable', 'Ventas, turnos, comisiones, servicios'], ['mixto', 'Mixto', 'Salario más ingresos variables']];
    const Terminar = () => {
      const Nuevoestado = { Fijo, Variable: Variablemes, Tipo: Cuestionarioactual.Tipo, Ingresomanual: Fijo + Variablemes, Usarautomatico: true, Fuenteingreso: 'perfil', Agregado: 0, Ingresosfijosextra: [], Modalidadelegida: Cuestionariomodalidad, Ahorro: Cuestionarioactual.Ahorro, Ahorromes: Cuestionarioactual.Ahorromes || Estadoactual.Ahorromes, Caja: Cuestionarioactual.Caja, Cajanombre: Cuestionarioactual.Cajanombre, Sisben: Cuestionarioactual.Sisben, Deudas: Cuestionarioactual.Deudas.map((Dato, Indice) => ({ id: 's' + Indice, Nombreitem: Dato.Nombreitem, Corto: Nombrescortosdeuda[Dato.Tipo] || 'Deuda', Cuota: Dato.Cuota, Saldo: 0, Activa: true, Pagada: false })), Cuestionariolisto: true, Pantalla: 'app', Pestana: 'inicio' };
      this.Cambiarestado(Nuevoestado);
      if (typeof Estadosesionactual === 'function' && Estadosesionactual().Autenticado) {
        Guardarperfilapi({
          nombre: Estadoactual.Nombre || '',
          edad: Estadoactual.Edad,
          ciudad: Estadoactual.Ciudad || 'Bogotá',
          tipo_ingreso: Cuestionarioactual.Tipo || 'fijo',
          fijo: Fijo || 0,
          variable: Variablemes || 0,
          ahorro: Cuestionarioactual.Ahorro || 0,
          ahorro_mes: Cuestionarioactual.Ahorromes || Estadoactual.Ahorromes || 0,
          afiliado_caja: !!Cuestionarioactual.Caja,
          caja_nombre: Cuestionarioactual.Cajanombre || '',
          sisben: !!Cuestionarioactual.Sisben,
          sisben_grupo: Estadoactual.Sisbengrupo || 'A1-C8',
          modalidad: Cuestionariomodalidad || 'vis',
          tasa_tipo: Estadoactual.Tasatipo || 'pesos',
          plazo_anios: Estadoactual.Plazoelegido || 20,
          pareja: !!Estadoactual.Pareja,
          pareja_nombre: Estadoactual.Parejanombre || '',
          pareja_ing: Estadoactual.Parejaingreso || 0,
          pareja_deu: Estadoactual.Parejadeudas || 0
        }).catch(() => null);
      }
    };

    return {
      Escuestionario: this.Pantalla === 'setup',
      Cuestionariopasocero: Paso === 0,
      Cuestionariopasouno: Paso === 1,
      Cuestionariopasodos: Paso === 2,
      Cuestionariopasotres: Paso === 3,
      Cuestionariopasocuatro: Paso === 4,
      Cuestionariocontador: Paso < 4 ? 'PASO ' + (Paso + 1) + ' DE 4' : 'TU RESULTADO',
      Cuestionariobarras: [0, 1, 2, 3].map(Clave => ({ Fondo: Clave <= Paso ? 'var(--ac)' : 'var(--c2)' })),
      Cuestionariomostraratras: Paso > 0,
      Cuestionarioatras: () => Cuestionariofijar({ Paso: Paso - 1 }),
      Tipoopciones: Tiposingreso.map(([Clave, Etiquetatexto, Dato]) => {
        const Activo = Cuestionarioactual.Tipo === Clave;
        return {
          Etiqueta: Etiquetatexto,
          Descripcioncorta: Dato,
          Fondo: Activo ? 'var(--ac)' : 'var(--cd)',
          Borde: Activo ? 'var(--ac)' : 'var(--ln)',
          Color: Activo ? 'var(--oa)' : 'var(--ik)',
          Subtexto: Activo ? 'rgba(11,12,10,.65)' : 'var(--mu)',
          Anillo: Activo ? 'var(--oa)' : 'var(--fa)',
          Punto: Activo ? 'var(--oa)' : 'transparent',
          Alclic: () => Cuestionariofijar({ Tipo: Clave })
        };
      }),
      Cuestionariomostrarfijo: Cuestionarioactual.Tipo !== 'variable',
      Cuestionariomostrarvariable: Cuestionarioactual.Tipo !== 'fijo',
      Cuestionariofijotexto: Cuestionarioactual.Fijo ? Formatonumero(Cuestionarioactual.Fijo) : '',
      Cuestionariovariabletexto: Cuestionarioactual.Variable ? Formatonumero(Cuestionarioactual.Variable) : '',
      Escribircuestionariofijo: (Elemento) => Cuestionariofijar({ Fijo: Digitos(Elemento) }),
      Escribircuestionariovariable: (Elemento) => Cuestionariofijar({ Variable: Digitos(Elemento) }),
      Cuestionarioingresototal: Formatoenteropesos(Fijo + Variablemes),
      Cuestionariotienedeudas: Cuestionarioactual.Deudas.length > 0,
      Cuestionariodeudatotal: Formatoenteropesos(Cuestionarioactual.Deudas.reduce((Acumulado, Dato) => Acumulado + Dato.Cuota, 0)),
      Cuestionariodeudafilas: Cuestionarioactual.Deudas.map((Dato, Indice) => ({ Nombreitem: Dato.Nombreitem, Cuota: Formatoenteropesos(Dato.Cuota), Alquitar: () => this.Cambiarestado(Estadoprevio => ({ Cuestionario: { ...Estadoprevio.Cuestionario, Deudas: Estadoprevio.Cuestionario.Deudas.filter((Ignorado, Posicionotra) => Posicionotra !== Indice) } })) })),
      Cuestionariotipofichas: Tiposdeuda.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Cuestionarioactual.Deudatipo === Opcion), Alclic: () => Cuestionariofijar({ Deudatipo: Opcion }) })),
      Cuestionariodeudacuotatexto: Cuestionarioactual.Deudacuota ? Formatonumero(Cuestionarioactual.Deudacuota) : '',
      Escribircuestionariodeudacuota: (Elemento) => Cuestionariofijar({ Deudacuota: Digitos(Elemento) }),
      Cuestionarioagregardeuda: () => {
        if (Cuestionarioactual.Deudacuota < 1000) return Falla('Escribe la cuota mensual.');
        Cuestionariofijar({ Deudas: [...Cuestionarioactual.Deudas, { Tipo: Cuestionarioactual.Deudatipo, Nombreitem: Cuestionarioactual.Deudatipo, Cuota: Cuestionarioactual.Deudacuota }], Deudacuota: 0, Sindeudas: false });
      },
      Cuestionarionoriel: Cuestionarioactual.Sindeudas ? 'var(--ac)' : 'var(--c2)',
      Cuestionarionoperilla: Cuestionarioactual.Sindeudas ? 'var(--oa)' : 'var(--mu)',
      Cuestionarionoposicion: Cuestionarioactual.Sindeudas ? 'translateX(22px)' : 'none',
      Alternarsindeudas: () => Cuestionariofijar(Cuestionarioactual.Sindeudas ? { Sindeudas: false } : { Sindeudas: true, Deudas: [], Deudacuota: 0 }),
      Cuestionarioerror: Cuestionarioactual.Falla,
      Cuestionarioaccion: ['Continuar', 'Continuar', 'Continuar', 'Ver mi resultado', 'Ir a mi inicio'][Paso],
      Cuestionariosiguiente: () => {
        if (Paso === 1 && Fijo + Variablemes < 100000) return Falla('Escribe cuánto recibes al mes.');
        if (Paso === 2) {
          const Deudas = Cuestionarioactual.Deudacuota >= 1000 ? [...Cuestionarioactual.Deudas, { Tipo: Cuestionarioactual.Deudatipo, Nombreitem: Cuestionarioactual.Deudatipo, Cuota: Cuestionarioactual.Deudacuota }] : Cuestionarioactual.Deudas;
          if (!Deudas.length && !Cuestionarioactual.Sindeudas) return Falla('Agrega tus deudas o marca “No tengo deudas”.');
          return Cuestionariofijar({ Deudas: Deudas, Deudacuota: 0, Paso: 3 });
        }
        if (Paso < 4) return Cuestionariofijar({ Paso: Paso + 1 });
        Terminar();
      },
      Cuestionarioprecio: Formatomillones(Calculocuestionario.Precio),
      Cuestionariocreditomillones: '$' + Formatomillones(Calculocuestionario.Creditousado) + ' M',
      Cuestionariopropiomillones: '$' + Formatomillones(Math.max(0, Calculocuestionario.Cuotainicial - Math.min(Calculocuestionario.Subsidio, Calculocuestionario.Cuotainicial))) + ' M',
      ...(() => {
        const Subtexto = Math.min(Calculocuestionario.Subsidio, Calculocuestionario.Cuotainicial), Propio = Math.max(0, Calculocuestionario.Cuotainicial - Subtexto), P = Math.max(1, Calculocuestionario.Precio);
        return { Cuestionariofinanciacionancho: (Calculocuestionario.Creditousado / P * 100) + '%', Cuestionariofinanciacionporcentaje: Math.round(Calculocuestionario.Creditousado / P * 100) + '%', Cuestionariopropioporcentaje: Math.round(Propio / P * 100) + '%' };
      })(),
      Cuestionariomodalidadetiqueta: Cuestionariomodalidad === 'vis' ? 'VIVIENDA VIS' : 'VIVIENDA NO VIS',
      Cuestionariotienesubsidio: Calculocuestionario.Subsidio > 0,
      Cuestionariosubsidiomillones: Formatoenteropesos(Math.min(Calculocuestionario.Subsidio, Calculocuestionario.Cuotainicial)),
      Cuestionariohoyetiqueta: Calculocuestionario.Limiteahorro ? 'Con lo que tienes hoy cierras hasta' : 'Ya tienes la cuota inicial completa',
      Cuestionariohoymillones: '$' + Formatomillones(Calculocuestionario.Preciohoy) + ' M',
      Cuestionariohoyfondo: Calculocuestionario.Limiteahorro ? '#FFD23F' : 'var(--ac)',
      Cuestionariocierre: Calculocuestionario.Limiteahorro ? (Cuestionarioactual.Ahorromes ? 'Ahorrando ' + Formatoenteropesos(Cuestionarioactual.Ahorromes) + ' al mes completas tu cuota inicial en ' + Math.ceil(Calculocuestionario.Falta / Cuestionarioactual.Ahorromes) + ' meses.' : 'Define cuánto puedes ahorrar al mes para calcular en cuánto tiempo llegas.') + ' Registra tus ingresos cada día para que tu cupo suba.' : 'Registra tus ingresos cada día para que esta cifra suba.',
      Cuestionarioahorrotexto: Cuestionarioactual.Ahorro ? Formatonumero(Cuestionarioactual.Ahorro) : '',
      Escribircuestionarioahorro: (Elemento) => Cuestionariofijar({ Ahorro: Digitos(Elemento) }),
      Cuestionarioahorromestexto: Cuestionarioactual.Ahorromes ? Formatonumero(Cuestionarioactual.Ahorromes) : '',
      Escribircuestionarioahorromes: (Elemento) => Cuestionariofijar({ Ahorromes: Digitos(Elemento) }),
      Cuestionariocajaactiva: Cuestionarioactual.Caja,
      Cuestionarioalternarcaja: () => Cuestionariofijar({ Caja: !Cuestionarioactual.Caja }),
      Cuestionariocajariel: Interruptorcuestionario(Cuestionarioactual.Caja).Riel,
      Cuestionariocajaperilla: Interruptorcuestionario(Cuestionarioactual.Caja).Perilla,
      Cuestionariocajaposicion: Interruptorcuestionario(Cuestionarioactual.Caja).Posicion,
      Cuestionariocajafichas: ['Compensar', 'Colsubsidio', 'Cafam', 'Comfama', 'Comfenalco', 'Comfandi', 'Cajacopi', 'Otra'].map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Cuestionarioactual.Cajanombre === Opcion), Alclic: () => Cuestionariofijar({ Cajanombre: Opcion }) })),
      Cuestionarioalternarsisben: () => Cuestionariofijar({ Sisben: !Cuestionarioactual.Sisben }),
      Cuestionariosisbenriel: Interruptorcuestionario(Cuestionarioactual.Sisben).Riel,
      Cuestionariosisbenperilla: Interruptorcuestionario(Cuestionarioactual.Sisben).Perilla,
      Cuestionariosisbenposicion: Interruptorcuestionario(Cuestionarioactual.Sisben).Posicion,
      Cuestionariosalariosminimos: Cuestionariosalariosminimos.toLocaleString('es-CO', { maximumFractionDigits: 1 }),
      Cuestionariosubsidiomensaje,
      Cuestionariosubsidiofondo: Subsidiolisto ? 'var(--ac)' : 'var(--c2)',
      Cuestionariosubsidiocolor: Subsidiolisto ? 'var(--oa)' : 'var(--ik)',
      Cuestionariosubsidioantetitulo: Subsidiolisto ? 'rgba(11,12,10,.65)' : 'var(--fa)',
      Cuestionarioformula: ''
    };
  
}
