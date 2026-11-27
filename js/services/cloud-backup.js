// Sincronización del perfil financiero con Supabase; los movimientos diarios nunca salen del celular

const Clavesentidadnumero = ['Meses', 'Mesesrequeridos', 'Cesantias', 'Ahorro', 'Montosubsidio', 'Monto', 'Tasa', 'Plazo', 'Financiacion'];
const Vinculospermitidos = ['Dependiente', 'Independiente', 'Pensionado', 'Cesantías', 'Ahorro voluntario (AVC)', 'Ambos'];
const Estadossubsidio = ['No me he postulado', 'Postulado', 'Asignado', 'Aplicado'];
const Tipospermitidos = ['fijo', 'variable', 'mixto'];
const Modalidadespermitidas = ['vis', 'novis', 'leasing'];
const Tasaspermitidas = ['pesos', 'uvr'];
const Sisbenpermitidos = ['A1-C8', 'C9-D20'];

function Numeroseguro(Valor, Maximo) {
  const Numero = Number(Valor);
  return Number.isFinite(Numero) && Numero >= 0 ? Math.min(Numero, Maximo) : 0;
}

function Limiteentidad(Clave) {
  const Limites = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : null;
  if (!Limites) return 1e10;
  if (Clave === 'Meses' || Clave === 'Mesesrequeridos') return Limites.Mesesafiliacionmaximo;
  if (Clave === 'Cesantias' || Clave === 'Ahorro') return Limites.Ahorro;
  if (Clave === 'Montosubsidio') return Limites.Subsidio;
  if (Clave === 'Monto') return Limites.Creditopreaprobado;
  if (Clave === 'Tasa') return Limites.Tasaeamaxima;
  if (Clave === 'Plazo') return Limites.Plazoaniosmaximo;
  if (Clave === 'Financiacion') return Limites.Financiacionmaxima;
  return Limites.Ahorro;
}

function Respaldoentidad(Datos) {
  const Origen = Datos && typeof Datos === 'object' ? Datos : {};
  const Limpio = {};
  Clavesentidadnumero.forEach(Clave => {
    const Valor = Numeroseguro(Origen[Clave], Limiteentidad(Clave));
    if (Valor > 0) Limpio[Clave] = Clave === 'Tasa' ? Number(Valor.toFixed(2)) : Math.floor(Valor);
  });
  if (Vinculospermitidos.includes(Origen.Vinculo)) Limpio.Vinculo = Origen.Vinculo;
  if (Estadossubsidio.includes(Origen.Estadosubsidio)) Limpio.Estadosubsidio = Origen.Estadosubsidio;
  if (Origen.Vencesubsidio) Limpio.Vencesubsidio = Textoseguro(Origen.Vencesubsidio, 20);
  return Limpio;
}

function Armarrespaldoperfil(Estado) {
  const Limites = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : {
    Deudacuota: 3e8, Deudasaldo: 5e9, Viviendaobjetivo: 1e10, Ingresomensual: 5e8, Maximodeudas: 30, Maximoingresosextra: 20
  };
  return {
    version: 1,
    deudas: (Estado.Deudas || []).slice(0, Limites.Maximodeudas).map(Deuda => ({
      id: Textoseguro(Deuda.id, 30),
      nombre: Textoseguro(Deuda.Nombreitem, 60),
      corto: Textoseguro(Deuda.Corto, 20),
      entidad: Textoseguro(Deuda.Entidad, 60),
      cuota: Math.floor(Numeroseguro(Deuda.Cuota, Limites.Deudacuota)),
      saldo: Math.floor(Numeroseguro(Deuda.Saldo, Limites.Deudasaldo)),
      activa: Deuda.Activa !== false,
      pagada: Boolean(Deuda.Pagada)
    })),
    objetivo: Math.floor(Numeroseguro(Estado.Objetivousuario, Limites.Viviendaobjetivo)),
    ingresos_fijos_extra: (Estado.Ingresosfijosextra || []).slice(0, Limites.Maximoingresosextra).map(Ingreso => ({
      nombre: Textoseguro(Ingreso.Nombreitem, 60),
      monto: Math.floor(Numeroseguro(Ingreso.Monto, Limites.Ingresomensual))
    })),
    infoentidad: {
      caja: Respaldoentidad((Estado.Infoentidad || {}).caja),
      fna: Respaldoentidad((Estado.Infoentidad || {}).fna)
    },
    financiar_gastos: Boolean(Estado.Financiargastos)
  };
}

// Revisa campo por campo lo que llega del servidor y descarta respaldos con formato desconocido
function Leerrespaldoperfil(Datos) {
  if (!Datos || typeof Datos !== 'object' || Datos.version !== 1) return {};
  const Limites = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : {
    Deudacuota: 3e8, Deudasaldo: 5e9, Viviendaobjetivo: 1e10, Ingresomensual: 5e8, Maximodeudas: 30, Maximoingresosextra: 20
  };
  const Lista = (Valor, Maximo) => {
    if (!Array.isArray(Valor)) return [];
    return Valor.filter(Elemento => Elemento && typeof Elemento === 'object').slice(0, Maximo);
  };
  return {
    Deudas: Lista(Datos.deudas, Limites.Maximodeudas).map((Deuda, Indice) => ({
      id: Textoseguro(Deuda.id, 30) || 'n' + Indice,
      Nombreitem: Textoseguro(Deuda.nombre, 60) || 'Deuda',
      Corto: Textoseguro(Deuda.corto, 20) || 'Deuda',
      Entidad: Textoseguro(Deuda.entidad, 60),
      Cuota: Math.floor(Numeroseguro(Deuda.cuota, Limites.Deudacuota)),
      Saldo: Math.floor(Numeroseguro(Deuda.saldo, Limites.Deudasaldo)),
      Activa: Deuda.activa !== false,
      Pagada: Deuda.pagada === true
    })),
    Objetivousuario: Math.floor(Numeroseguro(Datos.objetivo, Limites.Viviendaobjetivo)),
    Ingresosfijosextra: Lista(Datos.ingresos_fijos_extra, Limites.Maximoingresosextra).map(Ingreso => ({
      Nombreitem: Textoseguro(Ingreso.nombre, 60) || 'Ingreso fijo',
      Monto: Math.floor(Numeroseguro(Ingreso.monto, Limites.Ingresomensual))
    })),
    Infoentidad: {
      caja: Respaldoentidad(Datos.infoentidad && Datos.infoentidad.caja),
      fna: Respaldoentidad(Datos.infoentidad && Datos.infoentidad.fna)
    },
    Financiargastos: Datos.financiar_gastos === true
  };
}

// Última revisión antes de enviar: ningún número sale infinito o gigante y ningún texto pasa de su largo
function Acotarcargaperfil(Carga) {
  const Limpia = {};
  Object.keys(Carga || {}).forEach(Clave => {
    const Valor = Carga[Clave];
    if (typeof Valor === 'number') {
      Limpia[Clave] = Numeroseguro(Valor, 1e10);
    } else if (typeof Valor === 'string') {
      Limpia[Clave] = Textoseguro(Valor, 200);
    } else if (typeof Valor === 'boolean' || Valor === null) {
      Limpia[Clave] = Valor;
    } else if (Valor && typeof Valor === 'object') {
      const Texto = JSON.stringify(Valor);
      Limpia[Clave] = Texto.length <= 20000 ? Valor : {};
    }
  });
  return Limpia;
}

function Armarperfilnube(Estado) {
  const Limites = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : {
    Ingresomensual: 5e8, Ahorro: 5e9, Ahorromensual: 2e8, Deudacuota: 3e8, Edadmaxima: 99, Plazoaniosminimo: 5, Plazoaniosmaximo: 30
  };
  let Edadlimpia = null;
  if (Estado.Edad !== null && Estado.Edad !== undefined && Estado.Edad !== '') {
    Edadlimpia = Math.floor(Numeroseguro(Estado.Edad, Limites.Edadmaxima)) || null;
  }
  const Plazobase = Math.round(Numeroseguro(Estado.Plazoelegido || 20, Limites.Plazoaniosmaximo)) || 20;
  const Plazolimpio = Math.max(Limites.Plazoaniosminimo, Math.min(Limites.Plazoaniosmaximo, Plazobase));
  return {
    nombre: Textoseguro(Estado.Nombre || '', 70),
    edad: Edadlimpia,
    ciudad: Textoseguro(Estado.Ciudad || 'Bogotá', 60) || 'Bogotá',
    tipo_ingreso: Tipospermitidos.includes(Estado.Tipo) ? Estado.Tipo : 'fijo',
    fijo: Math.floor(Numeroseguro(Estado.Fijo, Limites.Ingresomensual)),
    variable: Math.floor(Numeroseguro(Estado.Variable, Limites.Ingresomensual)),
    ahorro: Math.floor(Numeroseguro(Estado.Ahorro, Limites.Ahorro)),
    ahorro_mes: Math.floor(Numeroseguro(Estado.Ahorromes, Limites.Ahorromensual)),
    afiliado_caja: Boolean(Estado.Caja),
    caja_nombre: Textoseguro(Estado.Cajanombre || '', 40),
    sisben: Boolean(Estado.Sisben),
    sisben_grupo: Sisbenpermitidos.includes(Estado.Sisbengrupo) ? Estado.Sisbengrupo : 'A1-C8',
    modalidad: Modalidadespermitidas.includes(Estado.Modalidadelegida) ? Estado.Modalidadelegida : 'vis',
    tasa_tipo: Tasaspermitidas.includes(Estado.Tasatipo) ? Estado.Tasatipo : 'pesos',
    plazo_anios: Plazolimpio,
    pareja: Boolean(Estado.Pareja),
    pareja_nombre: Textoseguro(Estado.Parejanombre || '', 70),
    pareja_ing: Math.floor(Numeroseguro(Estado.Parejaingreso, Limites.Ingresomensual)),
    pareja_deu: Math.floor(Numeroseguro(Estado.Parejadeudas, Limites.Deudacuota)),
    datos_perfil: Armarrespaldoperfil(Estado)
  };
}

// Compara fechas para conservar siempre la copia más reciente entre el celular y la nube
function Aplicarperfilremoto(Base, Remoto, Guardadolocal, Nombresugerido) {
  const Limites = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : {
    Ingresomensual: 5e8, Ahorro: 5e9, Ahorromensual: 2e8, Deudacuota: 3e8, Edadmaxima: 99, Plazoaniosminimo: 5, Plazoaniosmaximo: 30
  };
  const Horalocal = (Guardadolocal && Date.parse(Guardadolocal.Guardadoen || '')) || 0;
  const Horanube = Date.parse(Remoto.actualizado_en || '') || 0;
  Base.Cuestionariolisto = true;
  if (Horalocal > Horanube) {
    if (!Base.Nombre) Base.Nombre = Textoseguro(Remoto.nombre || Nombresugerido || '', 70);
    return Base;
  }
  Base.Nombre = Textoseguro(Remoto.nombre || Base.Nombre || Nombresugerido || '', 70);
  if (Remoto.edad != null) Base.Edad = Math.floor(Numeroseguro(Remoto.edad, Limites.Edadmaxima)) || null;
  Base.Ciudad = Textoseguro(Remoto.ciudad || Base.Ciudad || 'Bogotá', 60) || 'Bogotá';
  Base.Tipo = Tipospermitidos.includes(Remoto.tipo_ingreso) ? Remoto.tipo_ingreso : (Base.Tipo || 'fijo');
  if (Remoto.fijo != null) Base.Fijo = Math.floor(Numeroseguro(Remoto.fijo, Limites.Ingresomensual));
  if (Remoto.variable != null) Base.Variable = Math.floor(Numeroseguro(Remoto.variable, Limites.Ingresomensual));
  if (Remoto.ahorro != null) Base.Ahorro = Math.floor(Numeroseguro(Remoto.ahorro, Limites.Ahorro));
  if (Remoto.ahorro_mes != null) Base.Ahorromes = Math.floor(Numeroseguro(Remoto.ahorro_mes, Limites.Ahorromensual));
  Base.Caja = Remoto.afiliado_caja ?? Base.Caja;
  Base.Cajanombre = Textoseguro(Remoto.caja_nombre || Base.Cajanombre || '', 40);
  Base.Sisben = Remoto.sisben ?? Base.Sisben;
  Base.Sisbengrupo = Sisbenpermitidos.includes(Remoto.sisben_grupo) ? Remoto.sisben_grupo : (Base.Sisbengrupo || 'A1-C8');
  Base.Modalidadelegida = Modalidadespermitidas.includes(Remoto.modalidad) ? Remoto.modalidad : (Base.Modalidadelegida || 'vis');
  Base.Tasatipo = Tasaspermitidas.includes(Remoto.tasa_tipo) ? Remoto.tasa_tipo : (Base.Tasatipo || 'pesos');
  if (Remoto.plazo_anios != null) {
    const Plazoremoto = Math.round(Numeroseguro(Remoto.plazo_anios, Limites.Plazoaniosmaximo)) || 20;
    Base.Plazoelegido = Math.max(Limites.Plazoaniosminimo, Math.min(Limites.Plazoaniosmaximo, Plazoremoto));
  }
  Base.Pareja = Remoto.pareja ?? Base.Pareja;
  Base.Parejanombre = Textoseguro(Remoto.pareja_nombre || Base.Parejanombre || '', 70);
  if (Remoto.pareja_ing != null) Base.Parejaingreso = Math.floor(Numeroseguro(Remoto.pareja_ing, Limites.Ingresomensual));
  if (Remoto.pareja_deu != null) Base.Parejadeudas = Math.floor(Numeroseguro(Remoto.pareja_deu, Limites.Deudacuota));
  return Object.assign(Base, Leerrespaldoperfil(Remoto.datos_perfil));
}
