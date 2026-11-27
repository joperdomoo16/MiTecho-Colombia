// Datos de «Ayuda»: buscador, 6 temas, 19 preguntas frecuentes dinámicas y 24 términos de glosario

const Temasayuda = [
  { Id: 'presupuesto', Titulo: 'Tu presupuesto', Conteo: '4 respuestas', Icono: 'M4 4h16v16H4zM8 8h8M8 12h4M8 16h4M16 12v4' },
  { Id: 'ahorro', Titulo: 'Ahorro y cuota inicial', Conteo: '3 respuestas', Icono: 'M3 6h18v12H3zM3 10h18M16 14h2' },
  { Id: 'subsidios', Titulo: 'Subsidios', Conteo: '3 respuestas', Icono: 'M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11z' },
  { Id: 'bancos', Titulo: 'Bancos, tasas y plazos', Conteo: '4 respuestas', Icono: 'M3 10l9-6 9 6M5 10v9M19 10v9M9 10v9M15 10v9M3 21h18' },
  { Id: 'registros', Titulo: 'Registros y metas', Conteo: '3 respuestas', Icono: 'M7 20V4M7 4 3.5 7.5M7 4l3.5 3.5M17 4v16M17 20l-3.5-3.5M17 20l3.5-3.5' },
  { Id: 'datos', Titulo: 'Tus datos y privacidad', Conteo: '2 respuestas', Icono: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }
];

const Glosariobase = [
  ['VIS', 'Vivienda de interés social. En las ciudades principales cuesta hasta 150 SMMLV ($262,6 M en 2026); en el resto del país hasta 135 SMMLV ($236,4 M).'],
  ['Cuota inicial', 'La parte del precio que pagas tú, sin préstamo (20% en VIS y 30% en No VIS).'],
  ['Salario mínimo (SMMLV)', '$1.750.905 en 2026. Se usa para calcular los topes VIS/VIP y los subsidios.'],
  ['Tasa anual (E. A.)', 'Lo que te cobra el banco en un año por prestarte el dinero.'],
  ['UVR', 'Unidad que sube con la inflación. Un crédito en UVR empieza con cuota más baja, pero cambia mes a mes.'],
  ['Leasing habitacional', 'Arriendas la vivienda al banco y al final pagas la opción de compra para que quede a tu nombre.'],
  ['VIP', 'Vivienda de interés prioritario: precio máximo de 90 SMMLV ($157,6 M en 2026).'],
  ['No VIS', 'Vivienda por encima del tope VIS. El banco financia hasta el 70% y no aplica subsidio de Caja.'],
  ['Capacidad de endeudamiento', 'Parte de tu ingreso libre (40% por norma, o 30% en bancos conservadores) que puede ir a la cuota.'],
  ['Cierre financiero', 'Cuando tu crédito + ahorro + subsidios alcanzan para pagar el valor total de la vivienda y la escritura.'],
  ['Notaría y registro', 'Gastos legales para escriturar y registrar el inmueble a tu nombre (aprox. 2% en VIS y 3% en No VIS).'],
  ['Ley 2434 de 2024', 'Permite sumar los gastos de notaría y registro dentro del crédito hipotecario para necesitar menos ahorro inicial.'],
  ['Caja de compensación', 'Entidad que entrega subsidios de vivienda en dinero a hogares afiliados que ganen hasta 4 SMMLV.'],
  ['Mi Casa Ya', 'Subsidio del Gobierno nacional para hogares con Sisbén IV (sujeto a cupos vigentes).'],
  ['FNA (Fondo Nacional del Ahorro)', 'Entidad pública que administra cesantías y ahorro voluntario (AVC) y financia vivienda con tasas preferenciales.'],
  ['Sisbén IV', 'Clasificación socioeconómica por grupos (A1–D20) usada para priorizar subsidios estatales.'],
  ['UVT', 'Unidad de Valor Tributario ($52.374 en 2026) que determina si debes declarar renta.'],
  ['Compra de cartera', 'Pasar tus deudas a un solo crédito con menor tasa o mayor plazo para reducir la cuota mensual.'],
  ['Racha', 'Días seguidos registrando lo que ganas en la app para estabilizar tu promedio mensual.'],
  ['Efectivo sin consignar', 'Dinero recibido en efectivo que aún no entra a tus cuentas bancarias y no se refleja en tus extractos.'],
  ['Opción de compra', 'Porcentaje del valor (1% a 30%) que pagas al finalizar un contrato de leasing habitacional.'],
  ['Factor de anualidad', 'Multiplicador financiero que convierte la cuota mensual máxima en monto de préstamo según tasa y plazo.'],
  ['Codeudor / pareja', 'Otra persona que firma el crédito contigo para sumar ingresos (y también sus deudas).'],
  ['Punto de equilibrio UVR', 'Tasa de inflación promedio (5,58% anual) por debajo de la cual un crédito en UVR sale más barato que en pesos.']
];

function Generarvaloresayuda(Calculo) {
  const Estadoactual = this.Estadocomponente;
  if (!this.Pantalla || this.Pantalla !== 'app' || !Estadoactual.Ayuda) return { Ayudapantalla: false };

  const Factor = Calculo.Factor.toLocaleString('es-CO', { maximumFractionDigits: 1 });
  const Respuestas = [
    { Destacada: true, Tema: 'presupuesto', Pregunta: '¿Por qué el banco no me presta todo el valor?', Texto: 'El banco presta una parte del precio: hasta el 80% en vivienda VIS y hasta el 70% en las demás. El resto lo pones tú: es la cuota inicial.' },
    { Destacada: true, Tema: 'ahorro', Pregunta: '¿Qué cuenta como ahorro para la cuota inicial?', Texto: 'Tus cuentas de ahorro, CDT, cuentas AFC, cesantías que puedas retirar para vivienda y los subsidios de Caja o Mi Casa Ya.' },
    { Destacada: true, Tema: 'bancos', Pregunta: '¿Me conviene pagar en pesos o en UVR?', Texto: 'En pesos la cuota no cambia durante todo el crédito. En UVR arranca más baja, pero sube con la inflación. El punto de equilibrio de referencia está en 5,58% anual.' },
    { Destacada: true, Tema: 'presupuesto', Pregunta: '¿Cómo puedo subir mi presupuesto?', Texto: 'Puedes terminar de pagar cuotas de deudas vigentes, sumar ingresos con tu pareja o un familiar, mejorar el promedio mensual de tus extractos o revisar si aplicas a un subsidio.' },
    { Tema: 'presupuesto', Pregunta: '¿Qué es la cifra grande del Inicio?', Texto: 'Es el precio de la vivienda más cara ($' + Formatomillones(Calculo.Preciotecho) + ' M hoy) que un banco podría financiarte según tu ingreso y tus deudas.' },
    { Tema: 'presupuesto', Pregunta: '¿Cómo calcula el banco mi cuota máxima?', Texto: 'Resta tus deudas mensuales de tus ingresos y deja usar hasta el 40% de ese valor libre (o 30% en modo conservador). Luego multiplica esa cuota por el factor del plazo y la tasa (× ' + Factor + ').' },
    { Tema: 'ahorro', Pregunta: '¿Por qué aún no puedo comprar al tope de mi presupuesto?', Texto: 'Además del préstamo del banco, la constructora pide el cierre financiero completo: tu cuota inicial más los gastos de escrituración (' + Formatoenteropesos(Calculo.Gastostecho) + '). Hoy cierras hasta $' + Formatomillones(Calculo.Preciohoy) + ' M.' },
    { Tema: 'ahorro', Pregunta: '¿Qué es financiar notaría y registro (Ley 2434)?', Texto: 'Permite sumar los gastos de escrituración al crédito hipotecario (disponible en Simular, dentro de Tu resultado). Necesitas menos ahorro inicial, aunque la cuota mensual sube un poco.' },
    { Tema: 'subsidios', Pregunta: '¿Cuánto subsidio da la Caja de Compensación?', Texto: 'En 2026 entrega 30 SMMLV ($52,5 M) si el hogar gana hasta 2 SMMLV, y 20 SMMLV ($35,0 M) entre 2 y 4 SMMLV, únicamente para vivienda VIS.' },
    { Tema: 'subsidios', Pregunta: '¿Qué necesito si trabajo como independiente?', Texto: 'Puedes afiliarte voluntariamente a una Caja aportando el 2% de tus ingresos (con el 0,6% no aplica vivienda). Por ejemplo, Compensar exige 12 meses de aportes antes de postularte.' },
    { Tema: 'subsidios', Pregunta: '¿Para qué sirven los datos de Caja o FNA?', Texto: 'Son opcionales: si ya tienes cesantías en FNA, un subsidio asignado o un crédito preaprobado, MiTecho usa tus valores reales en lugar del promedio general.' },
    { Tema: 'bancos', Pregunta: '¿Qué diferencia hay entre VIS, No VIS y Leasing?', Texto: 'En VIS el banco financia hasta el 80% y aplican subsidios; en No VIS financia hasta el 70%; y en Leasing habitacional arriendas al banco con opción de compra (80% financiado).' },
    { Tema: 'bancos', Pregunta: '¿Cómo funcionan los plazos (15, 20 o 30 años) y mi edad?', Texto: 'Por seguro de vida, tu edad más el plazo del crédito no deben pasar de 75 años. En Cajas de compensación el plazo máximo suele ser de 20 años.' },
    { Tema: 'bancos', Pregunta: '¿Cómo funciona comprar en pareja o familia?', Texto: 'En Simular puedes sumar los ingresos y deudas de tu pareja o un familiar codeudor. Ten en cuenta que la Caja evaluará el total del hogar para los topes de subsidio.' },
    { Tema: 'registros', Pregunta: '¿Cómo se calcula la meta de hoy y la racha?', Texto: 'La meta diaria divide lo que te falta frente al ingreso necesario de la vivienda que buscas entre 26 días del mes. La racha cuenta días seguidos registrando.' },
    { Tema: 'registros', Pregunta: '¿Por qué importa el efectivo sin consignar?', Texto: 'El banco confirma ingresos con tus extractos bancarios o billeteras. El efectivo que no consignas en cuenta, Nequi o DaviPlata no queda soportado.' },
    { Tema: 'registros', Pregunta: '¿Cómo se desbloquean las herramientas avanzadas?', Texto: 'Todas las funciones de MiTecho son gratuitas: el comparador por banco, simulación en pareja y reporte PDF se habilitan viendo videos cortos de anuncio.' },
    { Tema: 'datos', Pregunta: '¿Dónde se guardan mis datos y quién los ve?', Texto: 'Tus movimientos diarios se quedan solo en tu celular. Tu perfil financiero se respalda en tu cuenta (o solo en tu celular si entras sin cuenta) bajo la Ley 1581 de 2012.' },
    { Tema: 'datos', Pregunta: '¿Puedo descargar o borrar todos mis datos?', Texto: 'Sí. En Perfil y ajustes, dentro de Cuenta, puedes descargar una copia de tus datos o borrar por completo tu cuenta e información cuando quieras.' }
  ];

  const Nombrespanelayuda = {
    perfil: 'Perfil y ajustes',
    deudas: 'Tus deudas',
    tasas: 'Comparar bancos',
    reporte: 'Tu reporte',
    subsidios: 'Caja y subsidios'
  };

  const Consulta = Normalizartexto((Estadoactual.Ayudabusqueda || '').trim());
  const Temaactivo = Estadoactual.Ayudatema || '';
  const Preguntas = Respuestas.filter(Item => {
    if (Consulta) return Normalizartexto(Item.Pregunta + ' ' + Item.Texto).includes(Consulta);
    if (Temaactivo) return Item.Tema === Temaactivo;
    return Estadoactual.Ayudavertodas ? true : Item.Destacada;
  });

  const Glosariofiltrado = Glosariobase.filter(([Termino, Definicion]) =>
    !Consulta || Normalizartexto(Termino + ' ' + Definicion).includes(Consulta)
  );
  const Glosario = Consulta || Estadoactual.Ayudaglosariotodo ? Glosariofiltrado : Glosariofiltrado.slice(0, 6);

  return {
    Ayudapantalla: true,
    Ayudavolver: Nombrespanelayuda[Estadoactual.Panel] || Nombrespestanas[this.Pestana] || 'Inicio',
    Ayudabusqueda: Estadoactual.Ayudabusqueda || '',
    Escribirayudabusqueda: (Elemento) => this.Cambiarestado({ Ayudabusqueda: Textoseguro(Elemento.target.value, 60), Ayudaabierta: 0 }),
    Ayudatemas: Temasayuda.map(Tema => ({
      ...Tema,
      Activa: Temaactivo === Tema.Id ? 'true' : 'false',
      Clase: Temaactivo === Tema.Id ? 'is-activa' : '',
      Alclic: () => this.Cambiarestado({ Ayudatema: Temaactivo === Tema.Id ? '' : Tema.Id, Ayudaabierta: 0 })
    })),
    Ayudapreguntas: Preguntas.map((Item, Indice) => {
      const Abierta = Estadoactual.Ayudaabierta === Indice;
      return {
        Pregunta: Item.Pregunta,
        Texto: Item.Texto,
        Abierta,
        Abiertatexto: Abierta ? 'true' : 'false',
        Flechaclase: Abierta ? 'is-abierta' : '',
        Alternar: () => this.Cambiarestado({ Ayudaabierta: Abierta ? -1 : Indice })
      };
    }),
    Ayudasinpistas: Preguntas.length === 0,
    Ayudamostrarbotonver: !Consulta && !Temaactivo,
    Ayudavertodastexto: Estadoactual.Ayudavertodas ? 'Ver menos preguntas' : 'Ver las ' + Respuestas.length + ' respuestas',
    Alternarayudavertodas: () => this.Cambiarestado({ Ayudavertodas: !Estadoactual.Ayudavertodas, Ayudaabierta: 0 }),
    Ayudaglosario: Glosario.map(([Termino, Definicion]) => ({ Termino, Definicion })),
    Ayudaglosariomostrarboton: !Consulta && Glosariobase.length > 6,
    Ayudaglosariotexto: Estadoactual.Ayudaglosariotodo ? 'Ver menos términos' : 'Ver los ' + Glosariobase.length + ' términos',
    Alternarayudaglosario: () => this.Cambiarestado({ Ayudaglosariotodo: !Estadoactual.Ayudaglosariotodo })
  };
}
