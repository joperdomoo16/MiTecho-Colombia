// Cuestionario inicial de bienvenida en cuatro pasos y resumen del primer presupuesto

function Generarvalorescuestionario(Calculo, Fichaseleccion) {
  const Estadoactual = this.Estadocomponente;
  const Cuestionarioactual = Estadoactual.Cuestionario;
  const Paso = Cuestionarioactual.Paso;
  const Cuestionariofijar = (Cambios) => this.Cambiarestado(Estadoprevio => ({ Cuestionario: { ...Estadoprevio.Cuestionario, ...Cambios, Falla: '' } }));
  const Falla = (Mensajeerror) => this.Cambiarestado(Estadoprevio => ({ Cuestionario: { ...Estadoprevio.Cuestionario, Falla: Mensajeerror } }));
  const Digitos = (Elemento, Maximo) => Limpiardigitos(Elemento.target.value, Maximo);
  const Fijo = Cuestionarioactual.Tipo === 'variable' ? 0 : Cuestionarioactual.Fijo;
  const Variablemes = Cuestionarioactual.Tipo === 'fijo' ? 0 : Cuestionarioactual.Variable;

  const Datosperfil = {
    Fijo,
    Variable: Variablemes,
    Tipo: Cuestionarioactual.Tipo,
    Ingresomanual: Fijo + Variablemes,
    Usarautomatico: true,
    Fuenteingreso: 'perfil',
    Agregado: 0,
    Ingresosfijosextra: [],
    Modalidadelegida: 'vis',
    Ahorro: Cuestionarioactual.Ahorro,
    Ahorromes: Cuestionarioactual.Ahorromes || Estadoactual.Ahorromes,
    Caja: Cuestionarioactual.Caja,
    Cajanombre: Cuestionarioactual.Cajanombre,
    Sisben: Cuestionarioactual.Sisben,
    Deudas: Cuestionarioactual.Deudas.map((Dato, Indice) => ({
      id: 's' + Indice,
      Nombreitem: Dato.Nombreitem,
      Corto: Nombrescortosdeuda[Dato.Tipo] || 'Deuda',
      Cuota: Dato.Cuota,
      Saldo: 0,
      Activa: true,
      Pagada: false
    }))
  };
  const Calculocuestionario = this.Calcular({ ...Estadoactual, ...Datosperfil });
  const Propiotecho = Math.max(0, Calculocuestionario.Preciotecho - Calculocuestionario.Creditotecho);
  const Bancopeso = Calculocuestionario.Preciotecho > 0 ? Math.round(Calculocuestionario.Creditotecho / Calculocuestionario.Preciotecho * 1000) : 4;
  const Propiopeso = Calculocuestionario.Preciotecho > 0 ? Math.max(1, 1000 - Bancopeso) : 1;

  const Tiposingreso = [
    ['fijo', 'Salario fijo', 'Recibes lo mismo cada mes: empleo o pensión.'],
    ['variable', 'Ingresos que cambian', 'Ventas, turnos, comisiones o servicios. Varían cada mes.'],
    ['mixto', 'Las dos cosas', 'Un salario más ingresos extra.']
  ];
  const Primernombre = (Estadoactual.Nombre || '').trim().split(/\s+/)[0];
  const Deudaformabierta = Boolean(Cuestionarioactual.Deudaabierta) || (Cuestionarioactual.Deudas.length === 0 && !Cuestionarioactual.Sindeudas);

  const Terminar = () => {
    this.Cambiarestado({ ...Datosperfil, Cuestionariolisto: true, Pantalla: 'app', Pestana: 'inicio' });
    if (typeof Estadosesionactual === 'function' && Estadosesionactual().Autenticado) {
      Guardarperfilapi(Armarperfilnube({ ...Estadoactual, ...Datosperfil })).catch(() => null);
    }
  };

  return {
    Escuestionario: this.Pantalla === 'setup',
    Cuestionariopasocero: Paso === 0,
    Cuestionariopasouno: Paso === 1,
    Cuestionariopasodos: Paso === 2,
    Cuestionariopasotres: Paso === 3,
    Cuestionariopasocuatro: Paso === 4,
    Cuestionariocontador: Paso < 4 ? 'Paso ' + (Paso + 1) + ' de 4' : 'Tu presupuesto',
    Cuestionariobarras: [0, 1, 2, 3].map(Clave => ({ Clase: Clave <= Paso ? 'is-lleno' : '' })),
    Cuestionariomostraratras: Paso > 0,
    Cuestionarioatras: () => Cuestionariofijar({ Paso: Paso - 1 }),
    Tipoopciones: Tiposingreso.map(([Clave, Etiqueta, Descripcioncorta]) => {
      const Activo = Cuestionarioactual.Tipo === Clave;
      return {
        Etiqueta,
        Descripcioncorta,
        Activo: Activo ? 'true' : 'false',
        Clase: Activo ? 'is-activa' : '',
        Alclic: () => Cuestionariofijar({ Tipo: Clave })
      };
    }),
    Cuestionariomostrarfijo: Cuestionarioactual.Tipo !== 'variable',
    Cuestionariomostrarvariable: Cuestionarioactual.Tipo !== 'fijo',
    Cuestionariofijorotulo: Cuestionarioactual.Tipo === 'fijo' ? 'Tus ingresos de un mes' : 'Salario o ingreso fijo mensual',
    Cuestionariovariablerotulo: Cuestionarioactual.Tipo === 'variable' ? 'Tus ingresos de un mes' : 'Ingresos variables al mes',
    Cuestionariofijotexto: Cuestionarioactual.Fijo ? Formatonumero(Cuestionarioactual.Fijo) : '',
    Cuestionariovariabletexto: Cuestionarioactual.Variable ? Formatonumero(Cuestionarioactual.Variable) : '',
    Escribircuestionariofijo: (Elemento) => Cuestionariofijar({ Fijo: Digitos(Elemento, Limitesfinancieros.Ingresomensual) }),
    Escribircuestionariovariable: (Elemento) => Cuestionariofijar({ Variable: Digitos(Elemento, Limitesfinancieros.Ingresomensual) }),
    Cuestionariotienedeudas: Cuestionarioactual.Deudas.length > 0,
    Cuestionariodeudatotal: Formatoenteropesos(Cuestionarioactual.Deudas.reduce((Acumulado, Dato) => Acumulado + Dato.Cuota, 0)),
    Cuestionariodeudafilas: Cuestionarioactual.Deudas.map((Dato, Indice) => ({
      Nombreitem: Dato.Nombreitem,
      Cuota: Formatoenteropesos(Dato.Cuota),
      Alquitar: () => this.Cambiarestado(Estadoprevio => ({
        Cuestionario: { ...Estadoprevio.Cuestionario, Deudas: Estadoprevio.Cuestionario.Deudas.filter((Ignorado, Posicionotra) => Posicionotra !== Indice) }
      }))
    })),
    Cuestionarioformdeudaabierto: Deudaformabierta,
    Cuestionarioformdeudacerrado: !Deudaformabierta,
    Abrircuestionariodeuda: () => Cuestionariofijar({ Deudaabierta: true, Sindeudas: false }),
    Cuestionariotipofichas: Tiposdeuda.map(Opcion => ({ Etiqueta: Opcion, ...Fichaseleccion(Cuestionarioactual.Deudatipo === Opcion), Alclic: () => Cuestionariofijar({ Deudatipo: Opcion }) })),
    Cuestionariodeudacuotatexto: Cuestionarioactual.Deudacuota ? Formatonumero(Cuestionarioactual.Deudacuota) : '',
    Escribircuestionariodeudacuota: (Elemento) => Cuestionariofijar({ Deudacuota: Digitos(Elemento, Limitesfinancieros.Deudacuota) }),
    Cuestionarioagregardeuda: () => {
      if (Cuestionarioactual.Deudacuota < 1000) return Falla('Escribe la cuota mensual.');
      if (Cuestionarioactual.Deudas.length >= Limitesfinancieros.Maximodeudas) return Falla('Puedes registrar máximo ' + Limitesfinancieros.Maximodeudas + ' deudas.');
      Cuestionariofijar({
        Deudas: [...Cuestionarioactual.Deudas, { Tipo: Cuestionarioactual.Deudatipo, Nombreitem: Cuestionarioactual.Deudatipo, Cuota: Cuestionarioactual.Deudacuota }],
        Deudacuota: 0,
        Sindeudas: false,
        Deudaabierta: false
      });
    },
    Cuestionariosindeudasactivo: Boolean(Cuestionarioactual.Sindeudas),
    Cuestionariosindeudasclase: Cuestionarioactual.Sindeudas ? 'is-activo' : '',
    Alternarsindeudas: () => Cuestionariofijar(Cuestionarioactual.Sindeudas ? { Sindeudas: false } : { Sindeudas: true, Deudas: [], Deudacuota: 0, Deudaabierta: false }),
    Cuestionarioerror: Cuestionarioactual.Falla,
    Cuestionarioaccion: ['Continuar', 'Continuar', 'Continuar', 'Ver mi presupuesto', 'Ir a mi inicio'][Paso],
    Cuestionariosiguiente: () => {
      if (Paso === 1 && Fijo + Variablemes < 100000) return Falla('Escribe cuánto recibes al mes.');
      if (Paso === 2) {
        const Deudas = Cuestionarioactual.Deudacuota >= 1000
          ? [...Cuestionarioactual.Deudas, { Tipo: Cuestionarioactual.Deudatipo, Nombreitem: Cuestionarioactual.Deudatipo, Cuota: Cuestionarioactual.Deudacuota }]
          : Cuestionarioactual.Deudas;
        if (!Deudas.length && !Cuestionarioactual.Sindeudas) return Falla('Agrega tus deudas o marca “No tengo deudas”.');
        return Cuestionariofijar({ Deudas, Deudacuota: 0, Deudaabierta: false, Paso: 3 });
      }
      if (Paso < 4) return Cuestionariofijar({ Paso: Paso + 1 });
      Terminar();
    },
    Cuestionariolistofrase: Primernombre ? 'Listo, ' + Primernombre : 'Listo',
    Cuestionarioprecio: Formatomillones(Calculocuestionario.Preciotecho),
    Cuestionariobancopeso: Bancopeso,
    Cuestionariopropiopeso: Propiopeso,
    Cuestionariocreditomillones: '$' + Formatomillones(Calculocuestionario.Creditotecho) + ' M',
    Cuestionariopropiomillones: '$' + Formatomillones(Propiotecho) + ' M',
    Cuestionarioresultadofrase: Cuestionarioactual.Ahorro > 0
      ? 'Ya tienes ahorrados $' + Formatomillones(Cuestionarioactual.Ahorro) + ' M. En tu inicio te mostramos cómo juntar lo que falta, paso a paso.'
      : 'En tu inicio te mostramos cómo juntar tu cuota inicial, paso a paso.',
    Cuestionarioahorrotexto: Cuestionarioactual.Ahorro ? Formatonumero(Cuestionarioactual.Ahorro) : '',
    Escribircuestionarioahorro: (Elemento) => Cuestionariofijar({ Ahorro: Digitos(Elemento, Limitesfinancieros.Ahorro) }),
    Cuestionarioahorromestexto: Cuestionarioactual.Ahorromes ? Formatonumero(Cuestionarioactual.Ahorromes) : '',
    Escribircuestionarioahorromes: (Elemento) => Cuestionariofijar({ Ahorromes: Digitos(Elemento, Limitesfinancieros.Ahorromensual) }),
    Cuestionariocajaactiva: Boolean(Cuestionarioactual.Caja),
    Cuestionariocajaclase: Cuestionarioactual.Caja ? 'is-activo' : '',
    Cuestionarioalternarcaja: () => Cuestionariofijar({ Caja: !Cuestionarioactual.Caja }),
    Cuestionariocajafichas: ['Compensar', 'Colsubsidio', 'Cafam', 'Comfama', 'Comfenalco', 'Comfandi', 'Cajacopi', 'Otra'].map(Opcion => ({
      Etiqueta: Opcion,
      ...Fichaseleccion(Cuestionarioactual.Cajanombre === Opcion),
      Alclic: () => Cuestionariofijar({ Cajanombre: Opcion })
    }))
  };
}
