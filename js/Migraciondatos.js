// Convierte los datos guardados por versiones anteriores (claves en inglés o camelCase) a los nombres actuales

// Nombre viejo de cada dato y su nombre nuevo. Los valores (por ejemplo 'fijo' o 'vis') no cambian
const Clavesantiguas = {
  added: 'Agregado', ahorro: 'Ahorro', ahorroMes: 'Ahorromes', anoPct: 'Anualporcentaje',
  avatarUrl: 'Avatarimagen', avgN: 'Promediomeses', barsOn: 'Barrasvisibles', caja: 'Caja',
  cajaNombre: 'Cajanombre', cash: 'Efectivo', cashOld: 'Efectivoanterior', cat: 'Categoria', ces: 'Cesantias',
  ciPlazo: 'Cuotainicialplazo', cityOpen: 'Ciudadabierta', cityQ: 'Ciudadbusqueda', ciudad: 'Ciudad',
  concepto: 'Concepto', consign: 'Consignacion', cuota: 'Cuota', dCuota: 'Deudacuota', dTipo: 'Deudatipo',
  daily: 'Diario', debtForm: 'Formulariodeuda', debts: 'Deudas', dias: 'Dias', edad: 'Edad',
  editingDebtId: 'Deudaeditandoid', email: 'Correo', emailOpen: 'Correoabierto', entInfo: 'Infoentidad',
  entTab: 'Entidadpestana', entidad: 'Entidad', entries: 'Registros', err: 'Falla', exForm: 'Formulariogasto',
  expenses: 'Egresosregistrados', fiForm: 'Formularioingresofijo', fijo: 'Fijo', fin: 'Financiacion',
  financiarGastos: 'Financiargastos', fixedExtra: 'Ingresosfijosextra', flex40: 'Flexibleporcentaje',
  form: 'Formulario', formError: 'Formularioerror', fuente: 'Fuente', gsBusy: 'Respaldoocupado',
  gsErr: 'Respaldoerror', gsLast: 'Respaldoultimo', gsMsg: 'Respaldomensaje', gsUrl: 'Respaldourl',
  help: 'Ayuda', helpOpen: 'Ayudaabierta', hora: 'Hora', ingView: 'Ingresovista',
  leadsSent: 'Contactosenviados', logged: 'Ingresado', loginBusy: 'Ingresoocupado',
  loginEmail: 'Ingresocorreo', loginError: 'Ingresoerror', loginMode: 'Ingresomodo',
  loginNotice: 'Ingresoaviso', loginPassConfirm: 'Ingresoclaveconfirmar', loginPassword: 'Ingresoclave',
  loginSuccessMsg: 'Ingresoexitomensaje', manualIng: 'Ingresomanual', medio: 'Medio', menu: 'Menu',
  meses: 'Meses', mesesReq: 'Mesesrequeridos', meta: 'Meta', mod: 'Modalidadelegida', monto: 'Monto',
  name: 'Nombreitem', noDebts: 'Sindeudas', nombre: 'Nombre', objetivo: 'Objetivousuario',
  ofAddOpen: 'Ofertasagregarabierto', ofCities: 'Ofertasciudades', ofQ: 'Ofertasbusqueda', on: 'Activa',
  opc: 'Opcioncompra', pagos: 'Pagos', paid: 'Pagada', panel: 'Panel', pareja: 'Pareja',
  parejaDeu: 'Parejadeudas', parejaIng: 'Parejaingreso', parejaNombre: 'Parejanombre', planView: 'Planvista',
  plazo: 'Plazo', pro: 'Pro', rate: 'Tasatipo', regKind: 'Registrotipo', rem: 'Recordatorios', saldo: 'Saldo',
  selDay: 'Diaseleccionado', setup: 'Cuestionario', setupDone: 'Cuestionariolisto', sheet: 'Hoja',
  sheetFreq: 'Hojafrecuencia', sheetKind: 'Hojatipo', short: 'Corto', shown: 'Mostrado',
  simStep: 'Simuladorpaso', sisben: 'Sisben', sisbenGrupo: 'Sisbengrupo', splashRetracted: 'Portadarecogida',
  step: 'Paso', subEstado: 'Estadosubsidio', subMonto: 'Montosubsidio', subVence: 'Vencesubsidio', subsidios: 'Subsidios',
  supAnim: 'Soporteanimado', supAsunto: 'Soporteasunto', supBusy: 'Soporteocupado',
  supDesc: 'Soportedescripcion', supDragging: 'Soportearrastrando', supEmail: 'Soportecorreo',
  supErr: 'Soporteerror', supNombre: 'Soportenombre', supSent: 'Soporteenviado', supY: 'Soportedesplazamiento',
  supportOpen: 'Soporteabierto', tasa: 'Tasa', term: 'Plazoelegido', theme: 'Temaelegido', tipo: 'Tipo',
  toast: 'Aviso', toastOn: 'Avisovisible', unlocked: 'Desbloqueado', unlocking: 'Desbloqueando',
  useAuto: 'Usarautomatico', variable: 'Variable', vinculo: 'Vinculo', weekly: 'Semanal'
};

function Renombrarclaves(Objeto) {
  if (!Objeto || typeof Objeto !== 'object' || Array.isArray(Objeto)) return Objeto;
  const Nuevo = {};
  for (const Clave in Objeto) {
    Nuevo[Clavesantiguas[Clave] || Clave] = Objeto[Clave];
  }
  return Nuevo;
}

// Se puede llamar varias veces sin problema: si los datos ya tienen los nombres nuevos, quedan igual
function Migrarestadoantiguo(Datos) {
  if (!Datos || typeof Datos !== 'object') return Datos;
  const Estado = Renombrarclaves(Datos);
  for (const Lista of ['Deudas', 'Registros', 'Egresosregistrados', 'Ingresosfijosextra']) {
    if (Array.isArray(Estado[Lista])) Estado[Lista] = Estado[Lista].map(Renombrarclaves);
  }
  for (const Campo of ['Cuestionario', 'Recordatorios', 'Formulariodeuda', 'Formulario', 'Formularioingresofijo', 'Formulariogasto', 'Consignacion']) {
    if (Estado[Campo]) Estado[Campo] = Renombrarclaves(Estado[Campo]);
  }
  if (Estado.Cuestionario && Array.isArray(Estado.Cuestionario.Deudas)) {
    Estado.Cuestionario.Deudas = Estado.Cuestionario.Deudas.map(Renombrarclaves);
  }
  // En Infoentidad las pestañas (caja y fna) son datos y se quedan igual; solo cambian los campos de adentro
  if (Estado.Infoentidad && typeof Estado.Infoentidad === 'object') {
    const Info = {};
    for (const Pestana in Estado.Infoentidad) Info[Pestana] = Renombrarclaves(Estado.Infoentidad[Pestana]);
    Estado.Infoentidad = Info;
  }
  return Estado;
}
