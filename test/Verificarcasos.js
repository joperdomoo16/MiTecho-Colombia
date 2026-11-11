// Revisión automática de los ocho casos financieros de ejemplo contra el motor de cálculo

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');

const Rutaconstantes = Rutas.join(__dirname, '../js/Constantesbancarias.js');
const Rutamotor = Rutas.join(__dirname, '../js/Motorcalculo.js');
const Rutacasos = Rutas.join(__dirname, 'Casosprueba.json');

Maquinavirtual.runInThisContext(Archivos.readFileSync(Rutaconstantes, 'utf8'));
Maquinavirtual.runInThisContext(Archivos.readFileSync(Rutas.join(__dirname, '../js/Historialregistros.js'), 'utf8'));
Maquinavirtual.runInThisContext(Archivos.readFileSync(Rutamotor, 'utf8'));

const Datosprueba = JSON.parse(Archivos.readFileSync(Rutacasos, 'utf8'));

let Errorestotales = 0;
console.log('Iniciando revisión de los ' + Datosprueba.casos.length + ' casos de prueba...\n');

// Compara cada caso con los resultados esperados sin margen de error en pesos
for (const Caso of Datosprueba.casos) {
  // Estos ocho casos se validaron con el tope del 30%, que hoy es el modo conservador; el 40% se revisa en Verificarinicio.js
  const Entrada = {
    ...Caso.entrada,
    Topeconservador: true,
    Ciudad: 'Bogotá',
    Tasaanualfija: Datosprueba.parametros.Tasaanualfija,
    Plazomesesfijo: Datosprueba.parametros.Plazomesesfijo
  };

  const Resultado = Calcularcapacidad(Entrada);
  const Esperado = Caso.esperado;

  const Diferenciaprecio = Math.abs(Resultado.Preciomaximo - Esperado.Preciomaximo);
  const Diferenciacredito = Math.abs(Resultado.Credito - Esperado.Credito);
  const Diferenciacuota = Math.abs(Resultado.Cuotamensual - Esperado.Cuotamensual);
  const Diferenciacuotainicial = Math.abs(Resultado.Cuotainicial - Esperado.Cuotainicial);
  const Diferenciagastos = Math.abs(Resultado.Gastosescrituracion - Esperado.Gastosescrituracion);
  const Diferenciafaltante = Math.abs(Resultado.Faltanteparacupocompleto - Esperado.Faltanteparacupocompleto);
  const Coincideestado = Resultado.Estadocierre === Esperado.Estadocierre;
  const Coincidelimitante = Resultado.Limitante === Esperado.Limitante;
  const Coincidemodalidad = Resultado.Modalidad === Esperado.Modalidad;

  const Escorrecto = Diferenciaprecio === 0 && Diferenciacredito === 0 && Diferenciacuota === 0 &&
                     Diferenciacuotainicial === 0 && Diferenciagastos === 0 && Diferenciafaltante === 0 &&
                     Coincideestado && Coincidelimitante && Coincidemodalidad;

  if (Escorrecto) {
    console.log(`[BIEN] Caso ${Caso.id}: ${Caso.Nombre}`);
    console.log(`       Precio: $${Resultado.Preciomaximo.toLocaleString('es-CO')} | Crédito: $${Resultado.Credito.toLocaleString('es-CO')} | Estado: ${Resultado.Estadocierre}`);
  } else {
    Errorestotales++;
    console.error(`[FALLA] Caso ${Caso.id}: ${Caso.Nombre}`);
    console.error('       Esperado:', Esperado);
    console.error('       Obtenido:', {
      Precio: Resultado.Preciomaximo,
      Credito: Resultado.Credito,
      Cuota: Resultado.Cuotamensual,
      Cuotainicial: Resultado.Cuotainicial,
      Gastos: Resultado.Gastosescrituracion,
      Falta: Resultado.Faltanteparacupocompleto,
      Estadocierre: Resultado.Estadocierre,
      Limitante: Resultado.Limitante,
      Modalidad: Resultado.Modalidad
    });
  }
}

if (Errorestotales === 0) {
  console.log('\nREVISIÓN FINANCIERA EXITOSA: Todos los casos pasaron con 0 pesos de diferencia.');
  process.exit(0);
} else {
  console.error(`\nREVISIÓN FALLIDA: Se presentaron ${Errorestotales} diferencias.`);
  process.exit(1);
}
