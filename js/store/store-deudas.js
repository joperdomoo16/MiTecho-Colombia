// Pantalla «Tus deudas»: cuánto podría costar la vivienda si la persona termina de pagar cada deuda.
// Se llama con .call desde la app para que this sea la aplicación.

// Ícono de cada tipo de deuda; los que no aparecen usan el del documento
const Iconosdeuda = {
  Tarjeta: 'M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5zM3 10h18M7 15h4',
  'Vehículo': 'M5 16v-4.5L7 6.5h10l2 5V16M4 16h16M6 16v2.5M18 16v2.5M8 13h.01M16 13h.01',
  Arriendo: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  Educativo: 'M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3',
  Otro: 'M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6'
};

// A qué pantalla vuelve el botón de arriba, según desde dónde se abrió
const Nombrespestanas = { inicio: 'Inicio', plan: 'Mi plan', simulador: 'Simular', ingresos: 'Movimientos', ofertas: 'Viviendas' };

function Generarvaloresdeudas(Calculo) {
  const Estadoactual = this.Estadocomponente;
  if (this.Pantalla !== 'app' || Estadoactual.Panel !== 'deudas') return { Esdeudas: false };
  const Deudas = Estadoactual.Deudas || [], Ciudad = Estadoactual.Ciudad || 'tu ciudad';
  // «Hoy» es con todas las deudas; las que se marcan como pagadas salen del cálculo
  const Hoy = this.Calcular(Estadoactual, Deudas.map(Deuda => ({ ...Deuda, Activa: true })));
  const Marcadas = Deudas.filter(Deuda => Deuda.Activa === false);
  const Subida = Calculo.Preciotecho - Hoy.Preciotecho;
  let Cambio = 'Marca una deuda para ver cuánto sube';
  if (Marcadas.length) {
    if (Subida >= 1e5) Cambio = '+$' + Formatomillones(Subida) + ' M frente a hoy';
    else if (Hoy.Topado) Cambio = 'No sube: ya llegaste al tope VIS de ' + Ciudad;
    else Cambio = 'Por ahora no sube';
  }

  const Saldo = Marcadas.reduce((Suma, Deuda) => Suma + (Deuda.Saldo || 0), 0);
  const Ahorro = Calculo.Ahorrohogar || 0;
  let Aviso = '';
  if (Saldo > 0) {
    if (Ahorro > Saldo) {
      const Pronombre = Marcadas.length === 1 ? 'la pagas' : 'las pagas';
      Aviso = 'Ojo: si ' + Pronombre + ' con tus ahorros, te quedan $' + Formatomillones(Ahorro - Saldo) + ' M para la cuota inicial. Hoy tienes $' + Formatomillones(Ahorro) + ' M.';
    } else {
      Aviso = 'Ojo: tus ahorros ($' + Formatomillones(Ahorro) + ' M) no alcanzan para pagar ese saldo de una vez. Puedes abonar mes a mes sin tocar tu ahorro para la vivienda.';
    }
  }

  // Más del 25% de los ingresos en deudas es cuando conviene pedir una compra de cartera
  const Proporcion = Hoy.Ingresototal > 0 ? Hoy.Deudasmes / Hoy.Ingresototal : 0;
  const Proporciontexto = (Proporcion * 100).toLocaleString('es-CO', { maximumFractionDigits: 1 }) + '%';

  return {
    Esdeudas: true,
    Deudasvolver: Nombrespestanas[this.Pestana] || 'Volver',
    Deudasprecio: Formatomillones(Calculo.Preciotecho),
    Deudascambio: Cambio,
    Deudascambioclase: Marcadas.length && Subida >= 1e5 ? 'is-sube' : '',
    Deudastarjetas: Deudas.map(Deuda => {
      const Terminable = !Egresosnoterminables.includes(Deuda.Corto), Pagada = Deuda.Activa === false;
      const Sinella = this.Calcular(Estadoactual, Deudas.map(Otra => ({ ...Otra, Activa: Otra !== Deuda })));
      const Ganancia = Sinella.Preciotecho - Hoy.Preciotecho, Nombre = Deuda.Nombreitem || Deuda.Corto || 'Deuda';
      return {
        Nombre,
        Detalle: 'Pagas ' + Formatoenteropesos(Deuda.Cuota) + ' al mes' + (Deuda.Saldo ? ' · Debes ' + Formatoenteropesos(Deuda.Saldo) : ''),
        Icono: Iconosdeuda[Deuda.Corto] || Iconosdeuda.Otro,
        Editaretiqueta: 'Editar ' + Nombre,
        Sube: Ganancia >= 1e5,
        Nosube: Ganancia < 1e5,
        Gananciainicio: Terminable ? 'Si la terminas de pagar: ' : 'Si dejas de pagarlo: ',
        Ganancia: '+$' + Formatomillones(Ganancia) + ' M',
        Ganancianota: Hoy.Topado ? 'Tu presupuesto ya llegó al tope VIS de ' + Ciudad + ': terminarla no lo sube.' : 'Por ahora terminarla casi no cambia tu presupuesto.',
        Interruptortexto: Terminable ? 'Simular que ya la pagué' : 'Simular que ya no lo pago',
        Pagada,
        Interruptorclase: Pagada ? 'is-activo' : '',
        Alternar: () => this.Fijardeuda(Deuda.id, { Activa: Pagada }),
        Editar: () => this.Editardeuda(Deuda.id)
      };
    }),
    Deudasvacio: !Deudas.length,
    Deudasavisovisible: Boolean(Aviso),
    Deudasaviso: Aviso,
    Deudasagregar: Deudas.length ? 'Agregar otra deuda' : 'Agregar una deuda',
    Deudasnotavisible: Deudas.length > 0 && Hoy.Ingresototal > 0,
    Deudasnota: 'Hoy tus deudas se llevan el ' + Proporciontexto + ' de tus ingresos. ' + (Proporcion > 0.25
      ? 'Como pasan del 25%, te sugerimos pedir una compra de cartera para bajar lo que pagas.'
      : 'Si pasaran del 25%, te sugeriríamos pedir una compra de cartera para bajar lo que pagas.')
  };
}
