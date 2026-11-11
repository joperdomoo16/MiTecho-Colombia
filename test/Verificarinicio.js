// Revisión del inicio: techo según ingresos, fuente del ingreso y racha con los días reales de registro

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');

for (const Nombre of ['Constantesbancarias', 'Historialregistros', 'Motorcalculo', 'Racha']) {
  Maquinavirtual.runInThisContext(Archivos.readFileSync(Rutas.join(__dirname, '../js/' + Nombre + '.js'), 'utf8'));
}

let Errores = 0;
function Revisar(Condicion, Bien, Mal) {
  if (Condicion) console.log('[BIEN] ' + Bien);
  else { console.error('[FALLA] ' + Mal); Errores++; }
}

// Techo: sin ahorro ya no da cero si los ingresos alcanzan, y nunca queda por debajo de lo que se cierra hoy
const Base = { Ciudad: 'Bogotá', Tipo: 'fijo', Fijo: 3500000, Deudas: [], Fuenteingreso: 'perfil' };
const Sinahorro = Calcularcapacidad({ ...Base, Ahorro: 0 });
Revisar(Sinahorro.Precio === 0 && Sinahorro.Preciotecho > 100000000, 'Sin ahorro el techo según ingresos no es cero (' + Sinahorro.Preciotecho + ').', 'Sin ahorro el techo quedó en ' + Sinahorro.Preciotecho);
Revisar(Sinahorro.Creditotecho + Sinahorro.Cuotainicialtecho === Sinahorro.Preciotecho, 'Banco presta + tú pones suman el techo.', 'Las partes del techo no suman el total.');
for (const Ahorro of [0, 3500000, 30000000, 200000000]) {
  const Calculo = Calcularcapacidad({ ...Base, Ahorro });
  Revisar(Calculo.Preciotecho >= Calculo.Precio, 'Con ahorro de ' + Ahorro + ' el techo no baja de lo que se cierra hoy.', 'Con ahorro de ' + Ahorro + ' el techo quedó por debajo de lo que se cierra hoy.');
}
Revisar(Calcularcapacidad({ ...Base, Deudas: [{ Cuota: 4000000, Activa: true }] }).Preciotecho === 0, 'Con deudas mayores al ingreso el techo es cero.', 'Con deudas mayores al ingreso el techo no es cero.');

// Tope de cuota: 40% del ingreso libre por norma (Decretos 257 de 2021 y 583 de 2025); 30% solo en modo conservador
for (const Modalidad of ['vis', 'novis', 'leasing']) {
  const Normal = Calcularcapacidad({ ...Base, Ahorro: 300000000, Modalidadelegida: Modalidad });
  const Conservador = Calcularcapacidad({ ...Base, Ahorro: 300000000, Modalidadelegida: Modalidad, Topeconservador: true });
  Revisar(Normal.Tope === 0.40 && Normal.Capacidadcuota === Math.round(Normal.Neto * 0.40), 'En ' + Modalidad + ' la cuota máxima es el 40% del ingreso libre.', 'En ' + Modalidad + ' el tope no es 40%: ' + Normal.Tope);
  Revisar(Conservador.Tope === 0.30 && Conservador.Capacidadcuota === Math.round(Conservador.Neto * 0.30), 'En ' + Modalidad + ' el modo conservador usa 30%.', 'En ' + Modalidad + ' el modo conservador no usa 30%.');
  Revisar(Normal.Creditoporcapacidad === Math.round(Normal.Capacidadcuota * Normal.Factor), 'En ' + Modalidad + ' el crédito es la cuota máxima por el factor de la anualidad.', 'En ' + Modalidad + ' el crédito no sale de la cuota máxima.');
  Revisar(Math.abs(Normal.Creditoporcapacidad / Conservador.Creditoporcapacidad - 4 / 3) < 0.001, 'En ' + Modalidad + ' con 40% el banco presta un tercio más que con 30%.', 'En ' + Modalidad + ' la relación entre 40% y 30% no es 4/3.');
}
Revisar(Modalidadesvivienda.leasing.Financiacion === 0.80 && Modalidadesvivienda.leasing.Etiquetanodo.includes('80%'), 'La etiqueta del leasing dice el mismo 80% que financia el cálculo.', 'La etiqueta del leasing no coincide con lo que financia el cálculo.');

// Fuente del ingreso
const Perfil = Calcularcapacidad({ ...Base, Tipo: 'mixto', Fijo: 2000000, Variable: 1000000, Fuenteingreso: 'perfil' });
const Manual = Calcularcapacidad({ ...Base, Fuenteingreso: 'manual', Ingresomanual: 5000000 });
const Antiguo = Calcularcapacidad({ Ciudad: 'Bogotá', Tipo: 'fijo', Fijo: 3500000, Deudas: [], Usarautomatico: false, Ingresomanual: 2000000 });
Revisar(Perfil.Ingresotitular === 3000000, 'Con el perfil financiero se suman fijo y variable declarados.', 'El ingreso del perfil dio ' + Perfil.Ingresotitular);
Revisar(Manual.Ingresotitular === 5000000, 'Con la barra del simulador se usa el valor manual.', 'El ingreso manual dio ' + Manual.Ingresotitular);
Revisar(Antiguo.Ingresotitular === 2000000, 'Las cuentas guardadas antes de los dos botones siguen calculando igual.', 'Una cuenta antigua cambió de ingreso: ' + Antiguo.Ingresotitular);

// Racha: solo cuenta días reales y seguidos
const Hoy = new Date('2026-11-10T15:00:00Z');
Revisar(Calcularracha([], Hoy).Seguidos === 0, 'Sin registros la racha es cero.', 'Sin registros la racha no es cero.');
Revisar(Calcularracha(['2026-11-08', '2026-11-09', '2026-11-10'], Hoy).Seguidos === 3, 'Tres días seguidos hasta hoy dan una racha de 3.', 'La racha de tres días seguidos no dio 3.');
Revisar(Calcularracha(['2026-11-08', '2026-11-09'], Hoy).Seguidos === 2, 'Si hoy todavía no registra, la racha de ayer sigue viva.', 'La racha se perdió antes de terminar el día.');
Revisar(Calcularracha(['2026-11-05', '2026-11-06', '2026-11-08'], Hoy).Seguidos === 0, 'Un día sin registrar corta la racha.', 'La racha no se cortó con un día vacío.');
const Cuadros = Calcularracha(['2026-11-10'], Hoy).Cuadros;
Revisar(Cuadros.length === 14 && Cuadros[13].Eshoy && Cuadros[13].Lleno && Cuadros.filter(Cuadro => Cuadro.Lleno).length === 1, 'Los 14 cuadros terminan en hoy y solo se llena el día registrado.', 'Los cuadros de la racha no corresponden a los días.');
// A las 11 de la noche en Colombia ya es otro día en UTC, pero el registro cuenta para el día de Colombia
Revisar(Diahoyracha(new Date('2026-11-11T04:00:00Z')) === '2026-11-10', 'El día de la racha usa la hora de Colombia.', 'El día de la racha no usa la hora de Colombia.');
Revisar(Marcardiaregistro(Marcardiaregistro([])).length === 1, 'Registrar dos veces el mismo día cuenta un solo día.', 'Un mismo día quedó contado dos veces.');

if (Errores === 0) {
  console.log('\nREVISIÓN DEL INICIO EXITOSA: techo, fuente de ingreso y racha correctos.');
} else {
  console.error('\nSe encontraron ' + Errores + ' problemas en el inicio.');
  process.exit(1);
}
