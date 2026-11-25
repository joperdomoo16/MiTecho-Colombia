// Reglas para revisar y acotar todo lo que la persona escribe en los formularios antes de calcular o guardar

// Topes coherentes con la realidad financiera colombiana: evitan pérdida de precisión,
// desbordamiento de la interfaz y valores extremos hacia el servidor.
const Limitesfinancieros = {
  IngresoMensual: 500000000,       // Hasta $500 millones / mes
  DeudaCuota: 300000000,           // Hasta $300 millones / mes en una cuota
  DeudaSaldo: 5000000000,          // Hasta $5.000 millones de saldo
  Ahorro: 5000000000,              // Hasta $5.000 millones de ahorro acumulado
  AhorroMensual: 200000000,        // Hasta $200 millones / mes de ahorro
  ViviendaObjetivo: 10000000000,   // Hasta $10.000 millones precio vivienda
  MovimientoDiario: 200000000,     // Hasta $200 millones por movimiento diario
  Subsidio: 500000000,             // Hasta $500 millones de subsidio
  CreditoPreaprobado: 10000000000, // Hasta $10.000 millones preaprobado
  EdadMin: 18,
  EdadMax: 99,
  MesesAfiliacionMax: 600,         // Hasta 50 años
  TasaEAMax: 40,                   // Hasta 40% E.A.
  PlazoAniosMin: 5,
  PlazoAniosMax: 30,
  FinanciacionMax: 100,
  MaxDeudas: 30,
  MaxIngresosExtra: 20
};

// Convierte una entrada de texto en entero >= 0 acotado a Maximo.
// Recorta los dígitos antes de parsear para que 40 dígitos nunca produzcan Infinity ni pierdan precisión.
function Limpiardigitos(Valor, Maximo = Limitesfinancieros.IngresoMensual) {
  const SoloDigitos = String(Valor ?? '').replace(/\D/g, '');
  if (!SoloDigitos) return 0;
  const MaxDigitos = String(Math.floor(Maximo)).length + 1;
  const Numero = Number(SoloDigitos.slice(0, MaxDigitos));
  if (!Number.isFinite(Numero) || Numero < 0) return 0;
  return Math.min(Math.floor(Numero), Maximo);
}

// Convierte una entrada decimal (ej. tasa "12,5" o "12.5") acotada entre 0 y Maximo
function Limpiardecimal(Valor, Maximo = Limitesfinancieros.TasaEAMax, Decimales = 2) {
  const Crudo = String(Valor ?? '').replace(',', '.').replace(/[^\d.]/g, '');
  if (!Crudo) return 0;
  const Partes = Crudo.split('.');
  const Entero = Partes[0].slice(0, 4);
  const Fraccion = Partes.length > 1 ? Partes.slice(1).join('').slice(0, Decimales) : '';
  const Normalizado = Fraccion ? (Entero + '.' + Fraccion) : Entero;
  const Numero = parseFloat(Normalizado);
  if (!Number.isFinite(Numero) || Numero < 0) return 0;
  return Math.min(Numero, Maximo);
}

// Garantiza un número finito dentro de [Minimo, Maximo]
function Acotarnumero(Valor, Minimo, Maximo, Defecto = 0) {
  const Numero = Number(Valor);
  if (!Number.isFinite(Numero)) return Defecto;
  return Math.min(Maximo, Math.max(Minimo, Numero));
}

// Evita mostrar cifras absurdas de meses (ej. "1.116e+127 meses" o "95000 meses")
function Formatearmeses(Meses) {
  if (!Number.isFinite(Meses) || Meses <= 0) return '0 meses';
  const Redondeado = Math.ceil(Meses);
  if (Redondeado > 600) return 'más de 50 años';
  return Redondeado + (Redondeado === 1 ? ' mes' : ' meses');
}

// Sanitiza un objeto de estado cargado desde almacenamiento local para reparar valores extremos previos
function Sanitizarestado(Objeto) {
  if (!Objeto || typeof Objeto !== 'object') return Objeto;
  const L = Limitesfinancieros;
  if ('Invitado' in Objeto) Objeto.Invitado = Objeto.Invitado === true;
  if (Objeto.Invitado) {
    // Así nadie activa Pro ni se hace pasar por una cuenta editando lo guardado en el celular
    Objeto.Pro = false;
    Objeto.Correo = '';
    Objeto.Metodoingreso = 'invitado';
  }
  if ('Temaelegido' in Objeto && !['claro', 'oscuro', 'auto'].includes(Objeto.Temaelegido)) delete Objeto.Temaelegido;
  if ('Autorizacionfecha' in Objeto && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(String(Objeto.Autorizacionfecha || ''))) Objeto.Autorizacionfecha = '';
  if ('Fijo' in Objeto) Objeto.Fijo = Acotarnumero(Objeto.Fijo, 0, L.IngresoMensual, 0);
  if ('Variable' in Objeto) Objeto.Variable = Acotarnumero(Objeto.Variable, 0, L.IngresoMensual, 0);
  if ('Ingresomanual' in Objeto) Objeto.Ingresomanual = Acotarnumero(Objeto.Ingresomanual, 0, L.IngresoMensual, 0);
  if ('Ahorro' in Objeto) Objeto.Ahorro = Acotarnumero(Objeto.Ahorro, 0, L.Ahorro, 0);
  if ('Ahorromes' in Objeto) Objeto.Ahorromes = Acotarnumero(Objeto.Ahorromes, 0, L.AhorroMensual, 0);
  if ('Objetivousuario' in Objeto) Objeto.Objetivousuario = Acotarnumero(Objeto.Objetivousuario, 0, L.ViviendaObjetivo, 0);
  if ('Efectivoanterior' in Objeto) Objeto.Efectivoanterior = Acotarnumero(Objeto.Efectivoanterior, 0, L.Ahorro, 0);
  if ('Parejaingreso' in Objeto) Objeto.Parejaingreso = Acotarnumero(Objeto.Parejaingreso, 0, L.IngresoMensual, 0);
  if ('Parejadeudas' in Objeto) Objeto.Parejadeudas = Acotarnumero(Objeto.Parejadeudas, 0, L.DeudaCuota, 0);
  if ('Parejaahorro' in Objeto) Objeto.Parejaahorro = Acotarnumero(Objeto.Parejaahorro, 0, L.Ahorro, 0);
  if ('Edad' in Objeto && Objeto.Edad !== null && Objeto.Edad !== '') {
    Objeto.Edad = Math.floor(Acotarnumero(Objeto.Edad, 0, L.EdadMax, 0)) || null;
  }
  if ('Plazoelegido' in Objeto) Objeto.Plazoelegido = Math.round(Acotarnumero(Objeto.Plazoelegido, L.PlazoAniosMin, L.PlazoAniosMax, 20));
  if (Array.isArray(Objeto.Deudas)) {
    Objeto.Deudas = Objeto.Deudas.slice(0, L.MaxDeudas).map(D => (D && typeof D === 'object') ? {
      ...D,
      Cuota: Acotarnumero(D.Cuota, 0, L.DeudaCuota, 0),
      Saldo: Acotarnumero(D.Saldo, 0, L.DeudaSaldo, 0)
    } : D);
  }
  if (Array.isArray(Objeto.Ingresosfijosextra)) {
    Objeto.Ingresosfijosextra = Objeto.Ingresosfijosextra.slice(0, L.MaxIngresosExtra).map(I => (I && typeof I === 'object') ? {
      ...I,
      Monto: Acotarnumero(I.Monto, 0, L.IngresoMensual, 0)
    } : I);
  }
  if (Array.isArray(Objeto.Registros)) {
    Objeto.Registros = Objeto.Registros.map(R => (R && typeof R === 'object') ? {
      ...R,
      Monto: Acotarnumero(R.Monto, 0, L.MovimientoDiario, 0)
    } : R);
  }
  if (Array.isArray(Objeto.Egresosregistrados)) {
    Objeto.Egresosregistrados = Objeto.Egresosregistrados.map(E => (E && typeof E === 'object') ? {
      ...E,
      Monto: Acotarnumero(E.Monto, 0, L.MovimientoDiario, 0)
    } : E);
  }
  if (Objeto.Infoentidad && typeof Objeto.Infoentidad === 'object') {
    ['caja', 'fna'].forEach(Clave => {
      const E = Objeto.Infoentidad[Clave];
      if (E && typeof E === 'object') {
        if ('Meses' in E) E.Meses = Math.floor(Acotarnumero(E.Meses, 0, L.MesesAfiliacionMax, 0));
        if ('Mesesrequeridos' in E) E.Mesesrequeridos = Math.floor(Acotarnumero(E.Mesesrequeridos, 0, L.MesesAfiliacionMax, 0));
        if ('Cesantias' in E) E.Cesantias = Acotarnumero(E.Cesantias, 0, L.Ahorro, 0);
        if ('Ahorro' in E) E.Ahorro = Acotarnumero(E.Ahorro, 0, L.Ahorro, 0);
        if ('Montosubsidio' in E) E.Montosubsidio = Acotarnumero(E.Montosubsidio, 0, L.Subsidio, 0);
        if ('Monto' in E) E.Monto = Acotarnumero(E.Monto, 0, L.CreditoPreaprobado, 0);
        if ('Tasa' in E) E.Tasa = Acotarnumero(E.Tasa, 0, L.TasaEAMax, 0);
        if ('Plazo' in E) E.Plazo = Math.floor(Acotarnumero(E.Plazo, 0, L.PlazoAniosMax, 0));
        if ('Financiacion' in E) E.Financiacion = Math.floor(Acotarnumero(E.Financiacion, 0, L.FinanciacionMax, 0));
      }
    });
  }
  return Objeto;
}

// Solo letras (con tildes y ñ), espacios, apóstrofo y guion, entre 2 y 70 caracteres.
// Devuelve el mensaje de error o un texto vacío si el nombre está bien.
function Validarnombre(Texto) {
  const Nombre = String(Texto || '').trim().replace(/\s+/g, ' ');
  if (Nombre.length < 2) return 'Escribe tu nombre para crear la cuenta.';
  if (Nombre.length > 70) return 'El nombre puede tener máximo 70 caracteres.';
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(Nombre)) return 'Escribe tu nombre como aparece en tu cédula, solo con letras.';
  return '';
}

// Deja el nombre limpio para guardarlo: sin espacios de más al inicio, al final ni repetidos
function Limpiarnombre(Texto) {
  return String(Texto || '').trim().replace(/\s+/g, ' ').slice(0, 70);
}
