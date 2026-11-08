// Revisión de la adaptación del certificado para personas individuales y parejas

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RutaConstantes = path.join(__dirname, '../js/Constantesbancarias.js');
const RutaMotor = path.join(__dirname, '../js/Motorcalculo.js');
const RutaEstilos = path.join(__dirname, '../js/Estiloscertificado.js');
const RutaHojatres = path.join(__dirname, '../js/Generadorpdfhojatres.js');
const RutaGenerador = path.join(__dirname, '../js/Generadorpdf.js');

vm.runInThisContext(fs.readFileSync(RutaConstantes, 'utf8'));
vm.runInThisContext(fs.readFileSync(RutaMotor, 'utf8'));
vm.runInThisContext(fs.readFileSync(RutaEstilos, 'utf8'));
vm.runInThisContext(fs.readFileSync(RutaHojatres, 'utf8'));
vm.runInThisContext(fs.readFileSync(RutaGenerador, 'utf8'));

let Errores = 0;
console.log('Iniciando revisión del generador de certificados...\n');

// Primer caso: solicitante individual sin Caja de Compensación y sin deudas
const UsuarioIndividual = {
  nombre: 'Alejandro Restrepo',
  ciudad: 'Medellín',
  tipo: 'fijo',
  fijo: 4500000,
  manualIng: 4500000,
  ahorro: 20000000,
  pareja: false,
  caja: false,
  debts: []
};
const CalculoIndividual = Calcularcapacidad(UsuarioIndividual);
const HtmlIndividual = Construircertificadohtml(UsuarioIndividual, CalculoIndividual);

if (HtmlIndividual.includes('<article class="persona persona--2">') || HtmlIndividual.includes('Segundo solicitante</h3>')) {
  console.error('[FALLA] El certificado individual incluyó por error al segundo solicitante.');
  Errores++;
} else {
  console.log('[BIEN] Certificado individual: Omite al segundo solicitante.');
}

if (!HtmlIndividual.includes('solicitantes--individual')) {
  console.error('[FALLA] El certificado individual no aplicó el diseño de una sola columna.');
  Errores++;
} else {
  console.log('[BIEN] Certificado individual: Aplica diseño de una sola columna.');
}

if (!HtmlIndividual.includes('Sin caja') && !HtmlIndividual.includes('Banca Hipotecaria')) {
  console.error('[FALLA] El certificado individual sin caja no adaptó la tarjeta de entidad.');
  Errores++;
} else {
  console.log('[BIEN] Certificado individual: Adapta la tarjeta a Banca Hipotecaria sin subsidio de caja.');
}

// Segundo caso: solicitante individual afiliada a Caja de Compensación con subsidio
const UsuarioCamila = {
  nombre: 'Camila Arango',
  ciudad: 'Bogotá',
  tipo: 'fijo',
  fijo: 2600000,
  manualIng: 2600000,
  ahorro: 5000000,
  pareja: false,
  caja: true,
  cajaNombre: 'Compensar',
  debts: []
};
const CalculoCamila = Calcularcapacidad(UsuarioCamila);
const HtmlCamila = Construircertificadohtml(UsuarioCamila, CalculoCamila);

if (HtmlCamila.includes('Compensar') && HtmlCamila.includes('Subsidio de vivienda')) {
  console.log('[BIEN] Certificado con subsidio: Muestra la Caja de Compensación y el subsidio.');
} else {
  console.error('[FALLA] No se mostró la Caja de Compensación para la persona con subsidio.');
  Errores++;
}

// Tercer caso: pareja con ingresos mayores a cuatro salarios mínimos
const UsuarioCarlosDiana = {
  nombre: 'Carlos Eduardo Mendoza',
  pareja: true,
  parejaNombre: 'Diana Gómez',
  ciudad: 'Bogotá',
  tipo: 'mixto',
  fijo: 4500000,
  manualIng: 6037000,
  parejaIng: 3000000,
  ahorro: 20000000,
  parejaAhorro: 12000000,
  caja: true,
  cajaNombre: 'Compensar',
  debts: [
    { name: 'Tarjeta de crédito', cuota: 450000, saldo: 5800000, on: true },
    { name: 'Crédito de vehículo', cuota: 580000, saldo: 24500000, on: true },
    { name: 'Crédito de consumo', cuota: 310000, saldo: 7400000, on: true }
  ],
  parejaDeu: 570000,
  tasa_ea: 0.1135,
  plazo_meses: 240
};
const CalculoCarlosDiana = Calcularcapacidad(UsuarioCarlosDiana);
const HtmlCarlosDiana = Construircertificadohtml(UsuarioCarlosDiana, CalculoCarlosDiana);

if (HtmlCarlosDiana.includes('Carlos Eduardo Mendoza') && HtmlCarlosDiana.includes('Diana Gómez')) {
  console.log('[BIEN] Certificado en pareja: Incluye a ambos solicitantes con sus cuentas y aportes.');
} else {
  console.error('[FALLA] El certificado en pareja no mostró a ambos solicitantes.');
  Errores++;
}

if (HtmlCarlosDiana.includes('Supera 4 SMMLV') && HtmlCarlosDiana.includes('Falta cuota inicial')) {
  console.log('[BIEN] Caso Carlos y Diana: Detecta ingresos mayores a 4 salarios mínimos y alerta de cuota inicial faltante.');
} else {
  console.error('[FALLA] El caso de Carlos y Diana no mostró los avisos esperados.');
  Errores++;
}

if (Errores === 0) {
  console.log('\nREVISIÓN DEL CERTIFICADO EXITOSA: Todos los perfiles se adaptan bien.');
  process.exit(0);
} else {
  console.error(`\nREVISIÓN FALLIDA: Se presentaron ${Errores} errores en el certificado.`);
  process.exit(1);
}
