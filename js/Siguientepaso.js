// Tarjeta "Tu siguiente paso" del Inicio: una sola acción, la que más acerca a la persona a su vivienda.
// Se llama con .call desde la app para que this sea la aplicación.

// El arriendo y los otros egresos fijos no se "terminan de pagar", por eso no se sugieren como deuda a cerrar
const Egresosnoterminables = ['Arriendo', 'Egreso'];

// Subsidio de vivienda que podría recibir un hogar según sus ingresos (de Caja, hasta 4 SMMLV)
function Subsidiopotencial(Ingresototal) {
  return (Ingresototal <= 2 * Salariominimo ? 30 : 20) * Salariominimo;
}

// Cómo se nombra cada tipo de deuda en «Termina de pagar…»
const Nombresdeudapaso = { Tarjeta: 'tu tarjeta', 'Vehículo': 'tu crédito de vehículo', Libranza: 'tu libranza', Consumo: 'tu crédito de consumo', Educativo: 'tu crédito educativo' };

function Elegirsiguientepaso(Calculo, Tiporecomendado) {
  const Estadoactual = this.Estadocomponente;
  const Irperfil = () => this.Cambiarestado({ Panel: 'perfil', Menu: false });
  const Irsubsidios = () => this.Cambiarestado({ Panel: 'subsidios', Menu: false });
  const Irplan = () => this.Cambiarestado({ Pestana: 'plan' });
  const Irdeudas = () => this.Cambiarestado({ Panel: 'deudas', Menu: false });

  if (Calculo.Ingresototal <= 0) {
    return { Titulo: 'Completa tus ingresos', Texto: 'Sin ingresos no podemos calcular cuánto te prestaría el banco.', Accion: 'Ir a mi perfil', Ir: Irperfil };
  }
  if (Calculo.Preciotecho <= 0) {
    return { Titulo: 'Baja tus cuotas de deudas', Texto: 'Hoy tus cuotas se llevan todo tu ingreso y el banco no te presta. Cada cuota que termines de pagar sube tu presupuesto.', Accion: 'Ver mis deudas', Ir: Irdeudas };
  }

  // Prioriza el subsidio en vivienda VIS cuando el hogar gana hasta 4 SMMLV
  if (!Estadoactual.Caja && Calculo.Ingresototal <= 4 * Salariominimo && Tiporecomendado === 'vis') {
    const Potencial = Subsidiopotencial(Calculo.Ingresototal);
    const Alcanza = Calculo.Faltatecho > 0 && Potencial >= Calculo.Faltatecho ? ': más de lo que te falta' : '';
    if (Estadoactual.Tipo === 'variable') {
      return { Titulo: 'Pide un subsidio de vivienda', Texto: 'Si te afilias a una Caja de compensación y cumples los requisitos, podrías recibir hasta **$' + Formatomillones(Potencial) + ' M**' + Alcanza + '. Como independiente, empieza pronto: suelen pedir 12 meses de aportes.', Accion: 'Ver si puedo pedirlo', Ir: Irsubsidios };
    }
    return { Titulo: 'Pide un subsidio de vivienda', Texto: 'Si tienes contrato laboral, tu empresa ya te afilió a una Caja: márcala en tu perfil. Si cumples los requisitos, podrías recibir hasta **$' + Formatomillones(Potencial) + ' M**' + Alcanza + '.', Accion: 'Ver si puedo pedirlo', Ir: Irsubsidios };
  }

  // Si lo que frena es la capacidad mensual, sugiere liberar la cuota más alta
  const Cerrables = (Estadoactual.Deudas || []).filter(Deuda => Deuda.Activa !== false && Deuda.Cuota > 0 && !Egresosnoterminables.includes(Deuda.Corto));
  if (Calculo.Limitante === 'capacidad_pago' && Cerrables.length) {
    const Mayor = Cerrables.reduce((Elegida, Deuda) => Deuda.Cuota > Elegida.Cuota ? Deuda : Elegida);
    const Sinella = this.Calcular(Estadoactual, Estadoactual.Deudas.map(Deuda => Deuda === Mayor ? { ...Deuda, Activa: false } : Deuda));
    const Subida = Sinella.Preciotecho - Calculo.Preciotecho;
    if (Subida >= 1e6) {
      return { Titulo: 'Termina de pagar ' + (Nombresdeudapaso[Mayor.Corto] || (Mayor.Nombreitem ? Mayor.Nombreitem.toLowerCase() : 'tu deuda más alta')), Texto: 'Pagas **' + Formatoenteropesos(Mayor.Cuota) + '** al mes. Cuando la termines, el banco podría prestarte más y tu presupuesto subiría **$' + Formatomillones(Subida) + ' M**.', Accion: 'Ver mis deudas', Ir: Irdeudas };
    }
  }

  // Cuando falta ahorro para cerrar, propone subir un 20% el aporte mensual
  if (Calculo.Faltatecho > 0) {
    const Falta = Formatoenteropesos(Calculo.Faltatecho), Ahorromes = Estadoactual.Ahorromes || 0;
    if (Ahorromes <= 0) {
      return { Titulo: 'Define cuánto ahorrar al mes', Texto: 'Te faltan **' + Falta + '** para la cuota inicial. Escribe en tu perfil cuánto puedes ahorrar al mes y te decimos en cuánto tiempo llegas.', Accion: 'Ir a mi perfil', Ir: Irperfil };
    }
    const Mesesritmo = Math.ceil(Calculo.Faltatecho / Ahorromes);
    const Ahorromas = Math.ceil(Ahorromes * 1.2 / 10000) * 10000, Mesesmas = Math.ceil(Calculo.Faltatecho / Ahorromas);
    if (Mesesritmo - Mesesmas >= 1) {
      return { Titulo: 'Ahorra un poco más cada mes', Texto: 'Si ahorras **' + Formatoenteropesos(Ahorromas) + '** al mes en vez de ' + Formatoenteropesos(Ahorromes) + ', compras unos ' + Formatearmeses(Mesesritmo - Mesesmas) + ' antes.', Accion: 'Ajustar mi plan', Ir: Irplan };
    }
    return { Titulo: 'Ya casi completas tu cuota inicial', Texto: 'Te faltan **' + Falta + '**: a tu ritmo de ' + Formatoenteropesos(Ahorromes) + ' al mes la completas en ' + Formatearmeses(Mesesritmo) + '.', Accion: 'Ajustar mi plan', Ir: Irplan };
  }

  // Con cuota inicial cubierta invita a comparar tasas entre bancos
  return { Titulo: 'Tu cuota inicial está lista', Texto: 'Revisa el detalle de tu crédito y compara la cuota entre entidades antes de ir al banco.', Accion: 'Ver mi resultado', Ir: () => this.Cambiarestado({ Pestana: 'simulador', Simuladorpaso: 'result' }) };
}

function Generarvaloressiguientepaso(Calculo, Tiporecomendado) {
  const Paso = Elegirsiguientepaso.call(this, Calculo, Tiporecomendado);
  // Las cifras van entre ** para mostrarlas en negrita, como en «Pagas **$380.000** al mes»
  const Partes = Paso.Texto.split('**').map((Texto, Posicion) => ({ Texto, Resaltar: Posicion % 2 === 1, Simple: Posicion % 2 === 0 }));
  return {
    Siguientepasotitulo: Paso.Titulo,
    Siguientepasopartes: Partes.filter(Parte => Parte.Texto),
    Siguientepasoaccion: Paso.Accion,
    Irsiguientepaso: Paso.Ir
  };
}
