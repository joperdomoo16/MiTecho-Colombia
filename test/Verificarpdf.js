// Revisión de la adaptación del certificado para personas individuales y parejas

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');

const Rutaconstantes = Rutas.join(__dirname, '../js/Constantesbancarias.js');
const Rutamotor = Rutas.join(__dirname, '../js/Motorcalculo.js');
const Rutaestilos = Rutas.join(__dirname, '../js/Estiloscertificado.js');
const Rutahojatres = Rutas.join(__dirname, '../js/Generadorpdfhojatres.js');
const Rutagenerador = Rutas.join(__dirname, '../js/Generadorpdf.js');

for (const Nombre of ['Constantesbancarias', 'Historialregistros', 'Motorsubsidios', 'Motorcalculo', 'Logocertificado', 'Estiloscertificadobase', 'Estiloscertificado', 'Reportedatos', 'Generadorpdfsecciones', 'Generadorpdfhojatres', 'Generadorpdf']) {
  Maquinavirtual.runInThisContext(Archivos.readFileSync(Rutas.join(__dirname, '../js/' + Nombre + '.js'), 'utf8'));
}

let Errores = 0;
console.log('Iniciando revisión del generador de certificados...\n');

// Primer caso: solicitante individual sin Caja de Compensación y sin deudas
const Usuarioindividual = {
  Nombre: 'Alejandro Restrepo',
  Ciudad: 'Medellín',
  Tipo: 'fijo',
  Fijo: 4500000,
  Ingresomanual: 4500000,
  Ahorro: 20000000,
  Pareja: false,
  Caja: false,
  Deudas: []
};
const Calculoindividual = Calcularcapacidad(Usuarioindividual);
const Htmlindividual = Construircertificadohtml(Usuarioindividual, Calculoindividual);

if (Htmlindividual.includes('<article class="persona persona--2">') || Htmlindividual.includes('Segundo solicitante</h3>')) {
  console.error('[FALLA] El certificado individual incluyó por error al segundo solicitante.');
  Errores++;
} else {
  console.log('[BIEN] Certificado individual: Omite al segundo solicitante.');
}

if (!Htmlindividual.includes('solicitantes--individual')) {
  console.error('[FALLA] El certificado individual no aplicó el diseño de una sola columna.');
  Errores++;
} else {
  console.log('[BIEN] Certificado individual: Aplica diseño de una sola columna.');
}

if (!Htmlindividual.includes('Sin caja') && !Htmlindividual.includes('Banca Hipotecaria')) {
  console.error('[FALLA] El certificado individual sin caja no adaptó la tarjeta de entidad.');
  Errores++;
} else {
  console.log('[BIEN] Certificado individual: Adapta la tarjeta a Banca Hipotecaria sin subsidio de caja.');
}

// Segundo caso: solicitante individual afiliada a Caja de Compensación con subsidio
const Usuariocamila = {
  Nombre: 'Camila Arango',
  Ciudad: 'Bogotá',
  Tipo: 'fijo',
  Fijo: 2600000,
  Ingresomanual: 2600000,
  Ahorro: 5000000,
  Pareja: false,
  Caja: true,
  Cajanombre: 'Compensar',
  Deudas: []
};
const Calculocamila = Calcularcapacidad(Usuariocamila);
const Htmlcamila = Construircertificadohtml(Usuariocamila, Calculocamila);

if (Htmlcamila.includes('Compensar') && Htmlcamila.includes('Subsidio de vivienda')) {
  console.log('[BIEN] Certificado con subsidio: Muestra la Caja de Compensación y el subsidio.');
} else {
  console.error('[FALLA] No se mostró la Caja de Compensación para la persona con subsidio.');
  Errores++;
}

// Tercer caso: pareja con ingresos mayores a cuatro salarios mínimos
const Usuariocarlosdiana = {
  Nombre: 'Carlos Eduardo Mendoza',
  Pareja: true,
  Parejanombre: 'Diana Gómez',
  Ciudad: 'Bogotá',
  Tipo: 'mixto',
  Fijo: 4500000,
  Ingresomanual: 6037000,
  Parejaingreso: 3000000,
  Ahorro: 20000000,
  Parejaahorro: 12000000,
  Caja: true,
  Cajanombre: 'Compensar',
  Deudas: [
    { Nombreitem: 'Tarjeta de crédito', Cuota: 450000, Saldo: 5800000, Activa: true },
    { Nombreitem: 'Crédito de vehículo', Cuota: 580000, Saldo: 24500000, Activa: true },
    { Nombreitem: 'Crédito de consumo', Cuota: 310000, Saldo: 7400000, Activa: true }
  ],
  Parejadeudas: 570000,
  Tasaanualfija: 0.1135,
  Plazomesesfijo: 240
};
const Calculocarlosdiana = Calcularcapacidad(Usuariocarlosdiana);
const Htmlcarlosdiana = Construircertificadohtml(Usuariocarlosdiana, Calculocarlosdiana);

if (Htmlcarlosdiana.includes('Carlos Eduardo Mendoza') && Htmlcarlosdiana.includes('Diana Gómez')) {
  console.log('[BIEN] Certificado en pareja: Incluye a ambos solicitantes con sus cuentas y aportes.');
} else {
  console.error('[FALLA] El certificado en pareja no mostró a ambos solicitantes.');
  Errores++;
}

if (Htmlcarlosdiana.includes('Supera 4 SMMLV') && Htmlcarlosdiana.includes('Falta cuota inicial')) {
  console.log('[BIEN] Caso Carlos y Diana: Detecta ingresos mayores a 4 salarios mínimos y alerta de cuota inicial faltante.');
} else {
  console.error('[FALLA] El caso de Carlos y Diana no mostró los avisos esperados.');
  Errores++;
}

// Cuarto caso: deudas activas sin saldo registrado, gastos sin financiar y luego financiados
const Usuariosinsaldo = {
  ...Usuarioindividual,
  Fijo: 6000000,
  Ingresomanual: 6000000,
  Ahorro: 10000000,
  Deudas: [{ Nombreitem: 'Tarjeta de crédito', Cuota: 600000, Saldo: 0, Activa: true }],
  Financiargastos: false
};
const Htmlsinsaldo = Construircertificadohtml(Usuariosinsaldo, Calcularcapacidad(Usuariosinsaldo));
const Htmlfinanciado = Construircertificadohtml({ ...Usuariosinsaldo, Financiargastos: true }, Calcularcapacidad({ ...Usuariosinsaldo, Financiargastos: true }));
const Htmlleasing = Construircertificadohtml({ ...Usuariosinsaldo, Modalidadelegida: 'leasing', Caja: true }, Calcularcapacidad({ ...Usuariosinsaldo, Modalidadelegida: 'leasing', Caja: true }));

if (Htmlsinsaldo.includes('Cuota inicial y gastos faltantes') && Htmlfinanciado.includes('Cuota inicial faltante')) {
  console.log('[BIEN] Paso 4 Hoja 3: Coincide con Financiargastos activo o inactivo.');
} else {
  console.error('[FALLA] Paso 4 Hoja 3 no ajustó el rótulo según Financiargastos.');
  Errores++;
}

if (Htmlsinsaldo.includes('<td class="num">No registra</td><td>1 deuda activa</td>') && Htmlsinsaldo.includes('equivale al <b>')) {
  console.log('[BIEN] Hoja 2 y 3: Muestra No registra en saldo total sin capital y explica el tope sobre ingreso libre.');
} else {
  console.error('[FALLA] Faltó No registra en saldo total o la aclaración del tope en Hoja 3.');
  Errores++;
}

if (Htmlleasing.includes('No aplica en leasing habitacional') && Htmlleasing.includes('Notaría (leasing)')) {
  console.log('[BIEN] Modalidad leasing: Ajusta subsidios y notaría en Hoja 2 y 3.');
} else {
  console.error('[FALLA] Modalidad leasing no adaptó los textos de subsidio o notaría.');
  Errores++;
}

const Parejaencero = { ...Usuarioindividual, Pareja: true, Parejaingreso: 0, Parejadeudas: 0, Parejaahorro: 0 };
const Calculoparejacero = Calcularcapacidad(Parejaencero);
const Htmlparejacero = Construircertificadohtml(Parejaencero, Calculoparejacero);
if (Calculoparejacero.Ingresototal === Calculoindividual.Ingresototal && Htmlparejacero.includes('solicitantes--individual') && !Htmlparejacero.includes('<article class="persona persona--2">')) {
  console.log('[BIEN] Pareja en ceros: No suma montos ficticios ni genera segundo solicitante en el PDF.');
} else {
  console.error('[FALLA] Pareja en ceros alteró el cálculo o generó segundo solicitante fantasma.');
  Errores++;
}

if (Errores === 0) {
  console.log('\nREVISIÓN DEL CERTIFICADO EXITOSA: Todos los perfiles se adaptan bien.');
  process.exit(0);
} else {
  console.error(`\nREVISIÓN FALLIDA: Se presentaron ${Errores} errores en el certificado.`);
  process.exit(1);
}
