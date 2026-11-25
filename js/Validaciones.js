// Topes financieros y limpieza de entradas para formularios y datos locales

const Limitesfinancieros = {
  Ingresomensual: 500000000,
  Deudacuota: 300000000,
  Deudasaldo: 5000000000,
  Ahorro: 5000000000,
  Ahorromensual: 200000000,
  Viviendaobjetivo: 10000000000,
  Movimientodiario: 200000000,
  Subsidio: 500000000,
  Creditopreaprobado: 10000000000,
  Edadminima: 18,
  Edadmaxima: 99,
  Mesesafiliacionmaximo: 600,
  Tasaeamaxima: 40,
  Plazoaniosminimo: 5,
  Plazoaniosmaximo: 30,
  Financiacionmaxima: 100,
  Maximodeudas: 30,
  Maximoingresosextra: 20
};

// Recorta el largo antes de convertir a número para que pegar cifras largas no desborde la precisión
function Limpiardigitos(Valor, Maximo = Limitesfinancieros.Ingresomensual) {
  const Solodigitos = String(Valor ?? '').replace(/\D/g, '');
  if (!Solodigitos) return 0;
  const Maximodigitos = String(Math.floor(Maximo)).length + 1;
  const Numero = Number(Solodigitos.slice(0, Maximodigitos));
  if (!Number.isFinite(Numero) || Numero < 0) return 0;
  return Math.min(Math.floor(Numero), Maximo);
}

function Limpiardecimal(Valor, Maximo = Limitesfinancieros.Tasaeamaxima, Decimales = 2) {
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

function Acotarnumero(Valor, Minimo, Maximo, Defecto = 0) {
  const Numero = Number(Valor);
  if (!Number.isFinite(Numero)) return Defecto;
  return Math.min(Maximo, Math.max(Minimo, Numero));
}

function Formatearmeses(Meses) {
  if (!Number.isFinite(Meses) || Meses <= 0) return '0 meses';
  const Redondeado = Math.ceil(Meses);
  if (Redondeado > 600) return 'más de 50 años';
  return Redondeado + (Redondeado === 1 ? ' mes' : ' meses');
}

// Revisa lo leído desde el celular para descartar valores corruptos o manipulados
function Sanitizarestado(Objeto) {
  if (!Objeto || typeof Objeto !== 'object') return Objeto;
  const Limites = Limitesfinancieros;
  if ('Invitado' in Objeto) Objeto.Invitado = Objeto.Invitado === true;
  if (Objeto.Invitado) {
    Objeto.Pro = false;
    Objeto.Correo = '';
    Objeto.Metodoingreso = 'invitado';
  }
  if ('Temaelegido' in Objeto && !['claro', 'oscuro', 'auto'].includes(Objeto.Temaelegido)) delete Objeto.Temaelegido;
  if ('Autorizacionfecha' in Objeto && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(String(Objeto.Autorizacionfecha || ''))) Objeto.Autorizacionfecha = '';
  if ('Fijo' in Objeto) Objeto.Fijo = Acotarnumero(Objeto.Fijo, 0, Limites.Ingresomensual, 0);
  if ('Variable' in Objeto) Objeto.Variable = Acotarnumero(Objeto.Variable, 0, Limites.Ingresomensual, 0);
  if ('Ingresomanual' in Objeto) Objeto.Ingresomanual = Acotarnumero(Objeto.Ingresomanual, 0, Limites.Ingresomensual, 0);
  if ('Ahorro' in Objeto) Objeto.Ahorro = Acotarnumero(Objeto.Ahorro, 0, Limites.Ahorro, 0);
  if ('Ahorromes' in Objeto) Objeto.Ahorromes = Acotarnumero(Objeto.Ahorromes, 0, Limites.Ahorromensual, 0);
  if ('Objetivousuario' in Objeto) Objeto.Objetivousuario = Acotarnumero(Objeto.Objetivousuario, 0, Limites.Viviendaobjetivo, 0);
  if ('Efectivoanterior' in Objeto) Objeto.Efectivoanterior = Acotarnumero(Objeto.Efectivoanterior, 0, Limites.Ahorro, 0);
  if ('Parejaingreso' in Objeto) Objeto.Parejaingreso = Acotarnumero(Objeto.Parejaingreso, 0, Limites.Ingresomensual, 0);
  if ('Parejadeudas' in Objeto) Objeto.Parejadeudas = Acotarnumero(Objeto.Parejadeudas, 0, Limites.Deudacuota, 0);
  if ('Parejaahorro' in Objeto) Objeto.Parejaahorro = Acotarnumero(Objeto.Parejaahorro, 0, Limites.Ahorro, 0);
  if ('Edad' in Objeto && Objeto.Edad !== null && Objeto.Edad !== '') {
    Objeto.Edad = Math.floor(Acotarnumero(Objeto.Edad, 0, Limites.Edadmaxima, 0)) || null;
  }
  if ('Plazoelegido' in Objeto) Objeto.Plazoelegido = Math.round(Acotarnumero(Objeto.Plazoelegido, Limites.Plazoaniosminimo, Limites.Plazoaniosmaximo, 20));
  if (Array.isArray(Objeto.Deudas)) {
    Objeto.Deudas = Objeto.Deudas.slice(0, Limites.Maximodeudas).map(Deudaitem => {
      if (!Deudaitem || typeof Deudaitem !== 'object') return Deudaitem;
      return {
        ...Deudaitem,
        Cuota: Acotarnumero(Deudaitem.Cuota, 0, Limites.Deudacuota, 0),
        Saldo: Acotarnumero(Deudaitem.Saldo, 0, Limites.Deudasaldo, 0)
      };
    });
  }
  if (Array.isArray(Objeto.Ingresosfijosextra)) {
    Objeto.Ingresosfijosextra = Objeto.Ingresosfijosextra.slice(0, Limites.Maximoingresosextra).map(Ingresoitem => {
      if (!Ingresoitem || typeof Ingresoitem !== 'object') return Ingresoitem;
      return { ...Ingresoitem, Monto: Acotarnumero(Ingresoitem.Monto, 0, Limites.Ingresomensual, 0) };
    });
  }
  if (Array.isArray(Objeto.Registros)) {
    Objeto.Registros = Objeto.Registros.map(Registroitem => {
      if (!Registroitem || typeof Registroitem !== 'object') return Registroitem;
      return { ...Registroitem, Monto: Acotarnumero(Registroitem.Monto, 0, Limites.Movimientodiario, 0) };
    });
  }
  if (Array.isArray(Objeto.Egresosregistrados)) {
    Objeto.Egresosregistrados = Objeto.Egresosregistrados.map(Egresoitem => {
      if (!Egresoitem || typeof Egresoitem !== 'object') return Egresoitem;
      return { ...Egresoitem, Monto: Acotarnumero(Egresoitem.Monto, 0, Limites.Movimientodiario, 0) };
    });
  }
  if (Objeto.Infoentidad && typeof Objeto.Infoentidad === 'object') {
    ['caja', 'fna'].forEach(Clave => {
      const Entidaditem = Objeto.Infoentidad[Clave];
      if (Entidaditem && typeof Entidaditem === 'object') {
        if ('Meses' in Entidaditem) Entidaditem.Meses = Math.floor(Acotarnumero(Entidaditem.Meses, 0, Limites.Mesesafiliacionmaximo, 0));
        if ('Mesesrequeridos' in Entidaditem) Entidaditem.Mesesrequeridos = Math.floor(Acotarnumero(Entidaditem.Mesesrequeridos, 0, Limites.Mesesafiliacionmaximo, 0));
        if ('Cesantias' in Entidaditem) Entidaditem.Cesantias = Acotarnumero(Entidaditem.Cesantias, 0, Limites.Ahorro, 0);
        if ('Ahorro' in Entidaditem) Entidaditem.Ahorro = Acotarnumero(Entidaditem.Ahorro, 0, Limites.Ahorro, 0);
        if ('Montosubsidio' in Entidaditem) Entidaditem.Montosubsidio = Acotarnumero(Entidaditem.Montosubsidio, 0, Limites.Subsidio, 0);
        if ('Monto' in Entidaditem) Entidaditem.Monto = Acotarnumero(Entidaditem.Monto, 0, Limites.Creditopreaprobado, 0);
        if ('Tasa' in Entidaditem) Entidaditem.Tasa = Acotarnumero(Entidaditem.Tasa, 0, Limites.Tasaeamaxima, 0);
        if ('Plazo' in Entidaditem) Entidaditem.Plazo = Math.floor(Acotarnumero(Entidaditem.Plazo, 0, Limites.Plazoaniosmaximo, 0));
        if ('Financiacion' in Entidaditem) Entidaditem.Financiacion = Math.floor(Acotarnumero(Entidaditem.Financiacion, 0, Limites.Financiacionmaxima, 0));
      }
    });
  }
  return Objeto;
}

// Acepta solo letras con tildes o ñ, espacios, guion y apóstrofo como aparecen en la cédula
function Validarnombre(Texto) {
  const Nombre = String(Texto || '').trim().replace(/\s+/g, ' ');
  if (Nombre.length < 2) return 'Escribe tu nombre para crear la cuenta.';
  if (Nombre.length > 70) return 'El nombre puede tener máximo 70 caracteres.';
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(Nombre)) return 'Escribe tu nombre como aparece en tu cédula, solo con letras.';
  return '';
}

function Limpiarnombre(Texto) {
  return String(Texto || '').trim().replace(/\s+/g, ' ').slice(0, 70);
}
