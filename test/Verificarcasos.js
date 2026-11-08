// Revisión automática de los ocho casos financieros de ejemplo contra el motor de cálculo

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RutaConstantes = path.join(__dirname, '../js/Constantesbancarias.js');
const RutaMotor = path.join(__dirname, '../js/Motorcalculo.js');
const RutaCasos = path.join(__dirname, 'Casosprueba.json');

vm.runInThisContext(fs.readFileSync(RutaConstantes, 'utf8'));
vm.runInThisContext(fs.readFileSync(RutaMotor, 'utf8'));

const DatosPrueba = JSON.parse(fs.readFileSync(RutaCasos, 'utf8'));

let ErroresTotales = 0;
console.log('Iniciando revisión de los ' + DatosPrueba.casos.length + ' casos de prueba...\n');

// Compara cada caso con los resultados esperados sin margen de error en pesos
for (const Caso of DatosPrueba.casos) {
  const Entrada = {
    ...Caso.entrada,
    ciudad: 'Bogotá',
    tasa_ea: DatosPrueba.parametros.tasa_ea,
    plazo_meses: DatosPrueba.parametros.plazo_meses
  };

  const Resultado = Calcularcapacidad(Entrada);
  const Esperado = Caso.esperado;

  const DiferenciaPrecio = Math.abs(Resultado.precio_maximo - Esperado.precio_maximo);
  const DiferenciaCredito = Math.abs(Resultado.credito - Esperado.credito);
  const DiferenciaCuota = Math.abs(Resultado.cuota_mensual - Esperado.cuota_mensual);
  const DiferenciaCuotaInicial = Math.abs(Resultado.cuota_inicial - Esperado.cuota_inicial);
  const DiferenciaGastos = Math.abs(Resultado.gastos_escrituracion - Esperado.gastos_escrituracion);
  const DiferenciaFaltante = Math.abs(Resultado.faltante_para_cupo_completo - Esperado.faltante_para_cupo_completo);
  const CoincideEstado = Resultado.estado === Esperado.estado;
  const CoincideLimitante = Resultado.limitante === Esperado.limitante;
  const CoincideModalidad = Resultado.modalidad === Esperado.modalidad;

  const EsCorrecto = DiferenciaPrecio === 0 && DiferenciaCredito === 0 && DiferenciaCuota === 0 &&
                     DiferenciaCuotaInicial === 0 && DiferenciaGastos === 0 && DiferenciaFaltante === 0 &&
                     CoincideEstado && CoincideLimitante && CoincideModalidad;

  if (EsCorrecto) {
    console.log(`[BIEN] Caso ${Caso.id}: ${Caso.nombre}`);
    console.log(`       Precio: $${Resultado.precio_maximo.toLocaleString('es-CO')} | Crédito: $${Resultado.credito.toLocaleString('es-CO')} | Estado: ${Resultado.estado}`);
  } else {
    ErroresTotales++;
    console.error(`[FALLA] Caso ${Caso.id}: ${Caso.nombre}`);
    console.error('       Esperado:', Esperado);
    console.error('       Obtenido:', {
      precio: Resultado.precio_maximo,
      credito: Resultado.credito,
      cuota: Resultado.cuota_mensual,
      ci: Resultado.cuota_inicial,
      gastos: Resultado.gastos_escrituracion,
      falta: Resultado.faltante_para_cupo_completo,
      estado: Resultado.estado,
      limitante: Resultado.limitante,
      modalidad: Resultado.modalidad
    });
  }
}

if (ErroresTotales === 0) {
  console.log('\nREVISIÓN FINANCIERA EXITOSA: Todos los casos pasaron con 0 pesos de diferencia.');
  process.exit(0);
} else {
  console.error(`\nREVISIÓN FALLIDA: Se presentaron ${ErroresTotales} diferencias.`);
  process.exit(1);
}
