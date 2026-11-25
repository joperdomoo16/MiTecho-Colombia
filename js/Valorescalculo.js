// Hoja «Así calculamos tu presupuesto»: los cuatro pasos del cálculo con las cifras de la persona.
// Se llama con .call desde la app para que this sea la aplicación.

function Generarvalorescalculo(Calculo, Configuracion) {
  const Estadoactual = this.Estadocomponente, Ciudad = Estadoactual.Ciudad || 'tu ciudad';
  const Esnovis = Calculo.Techosobretopevis || Estadoactual.Modalidadelegida === 'novis', Esleasing = Estadoactual.Modalidadelegida === 'leasing';
  const Financiacion = Esnovis ? Modalidadesvivienda.novis.Financiacion : Configuracion.Financiacion;
  const Financiado = Calculo.Preciotecho > 0 ? Calculo.Creditotecho / Calculo.Preciotecho : 0;
  // El último paso dice por qué el precio llega hasta ahí: el tope VIS, el porcentaje que presta el banco o el ahorro que se suma
  let Detalleprecio;
  if (Calculo.Topado) Detalleprecio = 'Con lo que te presta el banco pasarías el tope VIS de ' + Ciudad + ', así que tu presupuesto llega hasta ese tope';
  else if (Math.abs(Financiado - Financiacion) < 0.01) Detalleprecio = (Esleasing ? 'Con leasing' : Esnovis ? 'En vivienda No VIS' : 'En vivienda VIS') + ' el banco presta hasta el ' + Math.round(Financiacion * 100) + '% del precio';
  else Detalleprecio = 'El banco presta el ' + Math.round(Financiado * 100) + '% del precio y tú pones el resto con tu ahorro' + (Calculo.Subsidiotecho > 0 ? ' y tu subsidio' : '');
  const Pasos = [
    ['Lo que te queda libre cada mes', 'Tus ingresos (' + Formatoenteropesos(Calculo.Ingresototal) + ') menos lo que pagas de deudas (' + Formatoenteropesos(Calculo.Deudasmes) + ')', '= ' + Formatoenteropesos(Calculo.Neto)],
    ['La cuota máxima del crédito', Estadoactual.Topeconservador
      ? 'El 30% de lo que te queda libre, como lo calculan algunos bancos (modo conservador).'
      : 'El 40% de lo que te queda libre. La ley permite hasta el 40% de tus ingresos; restamos tus deudas para no inflar el cálculo.', '= ' + Formatoenteropesos(Calculo.Capacidadcuota) + ' al mes'],
    ['Lo que te prestaría el banco', 'Con esa cuota, a ' + Calculo.Plazo + ' años y con una tasa de ' + Formatoporcentaje(Calculo.Tasaanual) + ' anual', '= $' + Formatomillones(Calculo.Creditoporcapacidad) + ' M'],
    ['El precio de tu vivienda', Detalleprecio, '= $' + Formatomillones(Calculo.Preciotecho) + ' M']
  ];
  return {
    Calculovisible: this.Pantalla === 'app' && Boolean(Estadoactual.Calculoabierto),
    Abrircalculo: () => this.Cambiarestado({ Calculoabierto: true }),
    Cerrarcalculo: () => this.Cambiarestado({ Calculoabierto: false }),
    Probarcambios: () => this.Cambiarestado({ Calculoabierto: false, Panel: null, Pestana: 'simulador', Simuladorpaso: 'form' }),
    Calculopasos: Pasos.map(([Titulo, Detalle, Valor], Indice) => ({ Numero: Indice + 1, Titulo, Detalle, Valor }))
  };
}
