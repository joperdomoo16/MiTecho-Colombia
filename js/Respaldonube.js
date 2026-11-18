// Respaldo del perfil financiero en la nube: lo que sube, cómo se revisa al bajar y cuál copia gana al entrar.
// Los registros diarios no suben: la política de privacidad promete que se quedan solo en el celular

const Clavesentidadnumero = ['Meses', 'Mesesrequeridos', 'Cesantias', 'Ahorro', 'Montosubsidio', 'Monto', 'Tasa', 'Plazo', 'Financiacion'];
const Vinculospermitidos = ['Dependiente', 'Independiente', 'Pensionado', 'Cesantías', 'Ahorro voluntario (AVC)', 'Ambos'];
const Estadossubsidio = ['No me he postulado', 'Postulado', 'Asignado', 'Aplicado'];
const Tipospermitidos = ['fijo', 'variable', 'mixto'];
const Modalidadespermitidas = ['vis', 'novis', 'leasing'];
const Tasaspermitidas = ['pesos', 'uvr'];
const Sisbenpermitidos = ['A1-C8', 'C9-D20'];

// Un número que llega de afuera solo sirve si es finito, no es negativo y no pasa del tope
function Numeroseguro(Valor, Maximo) {
  const Numero = Number(Valor);
  return Number.isFinite(Numero) && Numero >= 0 ? Math.min(Numero, Maximo) : 0;
}

function Limiteentidad(Clave) {
  const L = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : null;
  if (!L) return 1e10;
  if (Clave === 'Meses' || Clave === 'Mesesrequeridos') return L.MesesAfiliacionMax;
  if (Clave === 'Cesantias' || Clave === 'Ahorro') return L.Ahorro;
  if (Clave === 'Montosubsidio') return L.Subsidio;
  if (Clave === 'Monto') return L.CreditoPreaprobado;
  if (Clave === 'Tasa') return L.TasaEAMax;
  if (Clave === 'Plazo') return L.PlazoAniosMax;
  if (Clave === 'Financiacion') return L.FinanciacionMax;
  return L.Ahorro;
}

function Respaldoentidad(Datos) {
  const Origen = Datos && typeof Datos === 'object' ? Datos : {}, Limpio = {};
  Clavesentidadnumero.forEach(Clave => {
    const Valor = Numeroseguro(Origen[Clave], Limiteentidad(Clave));
    if (Valor > 0) Limpio[Clave] = Clave === 'Tasa' ? Number(Valor.toFixed(2)) : Math.floor(Valor);
  });
  if (Vinculospermitidos.includes(Origen.Vinculo)) Limpio.Vinculo = Origen.Vinculo;
  if (Estadossubsidio.includes(Origen.Estadosubsidio)) Limpio.Estadosubsidio = Origen.Estadosubsidio;
  if (Origen.Vencesubsidio) Limpio.Vencesubsidio = Textoseguro(Origen.Vencesubsidio, 20);
  return Limpio;
}

// Lo que sube con el perfil: deudas, vivienda objetivo, ingresos fijos extra, datos de Caja/FNA y la escrituración financiada
function Armarrespaldoperfil(Estado) {
  const L = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : {
    DeudaCuota: 3e8, DeudaSaldo: 5e9, ViviendaObjetivo: 1e10, IngresoMensual: 5e8, MaxDeudas: 30, MaxIngresosExtra: 20
  };
  return {
    version: 1,
    deudas: (Estado.Deudas || []).slice(0, L.MaxDeudas).map(Deuda => ({
      id: Textoseguro(Deuda.id, 30), nombre: Textoseguro(Deuda.Nombreitem, 60), corto: Textoseguro(Deuda.Corto, 20), entidad: Textoseguro(Deuda.Entidad, 60),
      cuota: Math.floor(Numeroseguro(Deuda.Cuota, L.DeudaCuota)), saldo: Math.floor(Numeroseguro(Deuda.Saldo, L.DeudaSaldo)), activa: Deuda.Activa !== false, pagada: Boolean(Deuda.Pagada)
    })),
    objetivo: Math.floor(Numeroseguro(Estado.Objetivousuario, L.ViviendaObjetivo)),
    ingresos_fijos_extra: (Estado.Ingresosfijosextra || []).slice(0, L.MaxIngresosExtra).map(Ingreso => ({ nombre: Textoseguro(Ingreso.Nombreitem, 60), monto: Math.floor(Numeroseguro(Ingreso.Monto, L.IngresoMensual)) })),
    infoentidad: { caja: Respaldoentidad((Estado.Infoentidad || {}).caja), fna: Respaldoentidad((Estado.Infoentidad || {}).fna) },
    financiar_gastos: Boolean(Estado.Financiargastos)
  };
}

// Lo que llega de la nube se revisa campo por campo; si el respaldo no tiene la forma esperada no se usa nada
function Leerrespaldoperfil(Datos) {
  if (!Datos || typeof Datos !== 'object' || Datos.version !== 1) return {};
  const L = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : {
    DeudaCuota: 3e8, DeudaSaldo: 5e9, ViviendaObjetivo: 1e10, IngresoMensual: 5e8, MaxDeudas: 30, MaxIngresosExtra: 20
  };
  const Lista = (Valor, Maximo) => Array.isArray(Valor) ? Valor.filter(Elemento => Elemento && typeof Elemento === 'object').slice(0, Maximo) : [];
  return {
    Deudas: Lista(Datos.deudas, L.MaxDeudas).map((Deuda, Indice) => ({
      id: Textoseguro(Deuda.id, 30) || 'n' + Indice, Nombreitem: Textoseguro(Deuda.nombre, 60) || 'Deuda', Corto: Textoseguro(Deuda.corto, 20) || 'Deuda',
      Entidad: Textoseguro(Deuda.entidad, 60), Cuota: Math.floor(Numeroseguro(Deuda.cuota, L.DeudaCuota)), Saldo: Math.floor(Numeroseguro(Deuda.saldo, L.DeudaSaldo)), Activa: Deuda.activa !== false, Pagada: Deuda.pagada === true
    })),
    Objetivousuario: Math.floor(Numeroseguro(Datos.objetivo, L.ViviendaObjetivo)),
    Ingresosfijosextra: Lista(Datos.ingresos_fijos_extra, L.MaxIngresosExtra).map(Ingreso => ({ Nombreitem: Textoseguro(Ingreso.nombre, 60) || 'Ingreso fijo', Monto: Math.floor(Numeroseguro(Ingreso.monto, L.IngresoMensual)) })),
    Infoentidad: { caja: Respaldoentidad(Datos.infoentidad && Datos.infoentidad.caja), fna: Respaldoentidad(Datos.infoentidad && Datos.infoentidad.fna) },
    Financiargastos: Datos.financiar_gastos === true
  };
}

// Fila completa de perfiles_financieros; todos los valores van sanitizados y acotados antes de enviarse
function Armarperfilnube(Estado) {
  const L = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : {
    IngresoMensual: 5e8, Ahorro: 5e9, AhorroMensual: 2e8, DeudaCuota: 3e8, EdadMax: 99, PlazoAniosMin: 5, PlazoAniosMax: 30
  };
  const Edadlimpia = Estado.Edad !== null && Estado.Edad !== undefined && Estado.Edad !== ''
    ? Math.floor(Numeroseguro(Estado.Edad, L.EdadMax)) || null
    : null;
  const Plazolimpio = Math.max(L.PlazoAniosMin, Math.min(L.PlazoAniosMax, Math.round(Numeroseguro(Estado.Plazoelegido || 20, L.PlazoAniosMax)) || 20));
  return {
    nombre: Textoseguro(Estado.Nombre || '', 70),
    edad: Edadlimpia,
    ciudad: Textoseguro(Estado.Ciudad || 'Bogotá', 60) || 'Bogotá',
    tipo_ingreso: Tipospermitidos.includes(Estado.Tipo) ? Estado.Tipo : 'fijo',
    fijo: Math.floor(Numeroseguro(Estado.Fijo, L.IngresoMensual)),
    variable: Math.floor(Numeroseguro(Estado.Variable, L.IngresoMensual)),
    ahorro: Math.floor(Numeroseguro(Estado.Ahorro, L.Ahorro)),
    ahorro_mes: Math.floor(Numeroseguro(Estado.Ahorromes, L.AhorroMensual)),
    afiliado_caja: !!Estado.Caja,
    caja_nombre: Textoseguro(Estado.Cajanombre || '', 40),
    sisben: !!Estado.Sisben,
    sisben_grupo: Sisbenpermitidos.includes(Estado.Sisbengrupo) ? Estado.Sisbengrupo : 'A1-C8',
    modalidad: Modalidadespermitidas.includes(Estado.Modalidadelegida) ? Estado.Modalidadelegida : 'vis',
    tasa_tipo: Tasaspermitidas.includes(Estado.Tasatipo) ? Estado.Tasatipo : 'pesos',
    plazo_anios: Plazolimpio,
    pareja: !!Estado.Pareja,
    pareja_nombre: Textoseguro(Estado.Parejanombre || '', 70),
    pareja_ing: Math.floor(Numeroseguro(Estado.Parejaingreso, L.IngresoMensual)),
    pareja_deu: Math.floor(Numeroseguro(Estado.Parejadeudas, L.DeudaCuota)),
    datos_perfil: Armarrespaldoperfil(Estado)
  };
}

// Al entrar gana la copia más reciente: si el celular tiene cambios que no alcanzaron a subir, la nube no los pisa
function Aplicarperfilremoto(Base, Remoto, Guardadolocal, Nombresugerido) {
  const L = typeof Limitesfinancieros !== 'undefined' ? Limitesfinancieros : {
    IngresoMensual: 5e8, Ahorro: 5e9, AhorroMensual: 2e8, DeudaCuota: 3e8, EdadMax: 99, PlazoAniosMin: 5, PlazoAniosMax: 30
  };
  const Horalocal = (Guardadolocal && Date.parse(Guardadolocal.Guardadoen || '')) || 0;
  const Horanube = Date.parse(Remoto.actualizado_en || '') || 0;
  Base.Cuestionariolisto = true;
  if (Horalocal > Horanube) {
    if (!Base.Nombre) Base.Nombre = Textoseguro(Remoto.nombre || Nombresugerido || '', 70);
    return Base;
  }
  Base.Nombre = Textoseguro(Remoto.nombre || Base.Nombre || Nombresugerido || '', 70);
  Base.Edad = Remoto.edad != null ? (Math.floor(Numeroseguro(Remoto.edad, L.EdadMax)) || null) : Base.Edad;
  Base.Ciudad = Textoseguro(Remoto.ciudad || Base.Ciudad || 'Bogotá', 60) || 'Bogotá';
  Base.Tipo = Tipospermitidos.includes(Remoto.tipo_ingreso) ? Remoto.tipo_ingreso : (Base.Tipo || 'fijo');
  Base.Fijo = Remoto.fijo != null ? Math.floor(Numeroseguro(Remoto.fijo, L.IngresoMensual)) : Base.Fijo;
  Base.Variable = Remoto.variable != null ? Math.floor(Numeroseguro(Remoto.variable, L.IngresoMensual)) : Base.Variable;
  Base.Ahorro = Remoto.ahorro != null ? Math.floor(Numeroseguro(Remoto.ahorro, L.Ahorro)) : Base.Ahorro;
  Base.Ahorromes = Remoto.ahorro_mes != null ? Math.floor(Numeroseguro(Remoto.ahorro_mes, L.AhorroMensual)) : Base.Ahorromes;
  Base.Caja = Remoto.afiliado_caja ?? Base.Caja;
  Base.Cajanombre = Textoseguro(Remoto.caja_nombre || Base.Cajanombre || '', 40);
  Base.Sisben = Remoto.sisben ?? Base.Sisben;
  Base.Sisbengrupo = Sisbenpermitidos.includes(Remoto.sisben_grupo) ? Remoto.sisben_grupo : (Base.Sisbengrupo || 'A1-C8');
  Base.Modalidadelegida = Modalidadespermitidas.includes(Remoto.modalidad) ? Remoto.modalidad : (Base.Modalidadelegida || 'vis');
  Base.Tasatipo = Tasaspermitidas.includes(Remoto.tasa_tipo) ? Remoto.tasa_tipo : (Base.Tasatipo || 'pesos');
  Base.Plazoelegido = Remoto.plazo_anios != null ? Math.max(L.PlazoAniosMin, Math.min(L.PlazoAniosMax, Math.round(Numeroseguro(Remoto.plazo_anios, L.PlazoAniosMax)) || 20)) : Base.Plazoelegido;
  Base.Pareja = Remoto.pareja ?? Base.Pareja;
  Base.Parejanombre = Textoseguro(Remoto.pareja_nombre || Base.Parejanombre || '', 70);
  Base.Parejaingreso = Remoto.pareja_ing != null ? Math.floor(Numeroseguro(Remoto.pareja_ing, L.IngresoMensual)) : Base.Parejaingreso;
  Base.Parejadeudas = Remoto.pareja_deu != null ? Math.floor(Numeroseguro(Remoto.pareja_deu, L.DeudaCuota)) : Base.Parejadeudas;
  return Object.assign(Base, Leerrespaldoperfil(Remoto.datos_perfil));
}
