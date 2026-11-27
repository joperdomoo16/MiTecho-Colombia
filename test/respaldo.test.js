// Revisión del respaldo en la nube: qué sube, que lo que baja se revise y que gane la copia más reciente

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');

// Se cargan en el mismo orden que en index.html, así se revisan los mismos topes que usa la app
for (const Nombre of ['store/constantes-bancarias', 'utils/validaciones', 'services/cloud-backup']) {
  Maquinavirtual.runInThisContext(Archivos.readFileSync(Rutas.join(__dirname, '../js/' + Nombre + '.js'), 'utf8'));
}

let Errores = 0;
function Revisar(Condicion, Bien, Mal) {
  if (Condicion) console.log('[BIEN] ' + Bien);
  else { console.error('[FALLA] ' + Mal); Errores++; }
}

const Estado = {
  Nombre: 'Ana Pérez', Fijo: 3000000, Tipo: 'fijo', Objetivousuario: 180000000, Financiargastos: true,
  Deudas: [{ id: 'd1', Nombreitem: 'Tarjeta Visa', Corto: 'Tarjeta', Entidad: 'Banco', Cuota: 400000, Saldo: 2000000, Activa: true, Pagada: false }],
  Ingresosfijosextra: [{ Nombreitem: 'Arriendo', Monto: 800000 }],
  Infoentidad: { caja: { Meses: 14, Estadosubsidio: 'Asignado', Montosubsidio: 35000000, Vencesubsidio: '12/2027' }, fna: {} },
  Registros: [{ Monto: 50000, Concepto: 'Ventas' }]
};

// Ida y vuelta
const Fila = Armarperfilnube(Estado);
const Vuelta = Leerrespaldoperfil(JSON.parse(JSON.stringify(Fila.datos_perfil)));
Revisar(Vuelta.Deudas.length === 1 && Vuelta.Deudas[0].Cuota === 400000 && Vuelta.Deudas[0].Nombreitem === 'Tarjeta Visa', 'Las deudas suben y vuelven iguales.', 'Las deudas no volvieron iguales.');
Revisar(Vuelta.Objetivousuario === 180000000 && Vuelta.Financiargastos === true, 'La vivienda objetivo y la escrituración financiada vuelven iguales.', 'La vivienda objetivo o la escrituración no volvieron.');
Revisar(Vuelta.Ingresosfijosextra[0].Monto === 800000 && Vuelta.Infoentidad.caja.Montosubsidio === 35000000 && Vuelta.Infoentidad.caja.Vencesubsidio === '12/2027', 'Ingresos fijos extra y datos de Caja vuelven iguales.', 'Ingresos extra o datos de Caja no volvieron.');
Revisar(!JSON.stringify(Fila).includes('Ventas') && !('registros' in Fila.datos_perfil), 'Los registros diarios no suben a la nube.', 'Los registros diarios se colaron en el respaldo.');

// Datos alterados en la nube
const Alterado = Leerrespaldoperfil({
  version: 1, objetivo: -5, financiar_gastos: 'si',
  deudas: [null, 'texto', { nombre: 'A\u0000B' + 'x'.repeat(500), cuota: 'NaN', saldo: -1 }, ...Array(60).fill({ cuota: 1 })],
  ingresos_fijos_extra: { no: 'es lista' },
  infoentidad: { caja: { Meses: Infinity, Vinculo: 'Hacker', Estadosubsidio: 'Regalado', Tasa: 1e30 } }
});
Revisar(Alterado.Deudas.length === 30, 'Se aceptan máximo 30 deudas y se descartan las que no son objetos.', 'Pasaron ' + Alterado.Deudas.length + ' deudas.');
Revisar(Alterado.Deudas[0].Nombreitem.length === 60 && !Alterado.Deudas[0].Nombreitem.includes('\u0000') && Alterado.Deudas[0].Cuota === 0 && Alterado.Deudas[0].Saldo === 0, 'Textos recortados y sin caracteres de control; números inválidos quedan en cero.', 'Una deuda alterada pasó sin limpiar.');
Revisar(Alterado.Objetivousuario === 0 && Alterado.Financiargastos === false && Alterado.Ingresosfijosextra.length === 0, 'Valores con tipo equivocado se descartan.', 'Pasó un valor con tipo equivocado.');
const Caja = Alterado.Infoentidad.caja;
Revisar(!('Vinculo' in Caja) && !('Estadosubsidio' in Caja) && !('Meses' in Caja) && Caja.Tasa === 40, 'En Caja/FNA solo pasan opciones conocidas y números con tope (tasa máxima 40% E.A.).', 'En Caja/FNA pasó un dato no permitido.');
Revisar(Object.keys(Leerrespaldoperfil({ version: 2, deudas: [] })).length === 0 && Object.keys(Leerrespaldoperfil('texto')).length === 0, 'Un respaldo con otra versión o forma no se usa.', 'Se usó un respaldo con forma desconocida.');

// Tamaño: el caso más grande cabe en el límite de 64 KB de la base de datos
const Grande = Armarrespaldoperfil({ Deudas: Array(40).fill({ id: 'x'.repeat(99), Nombreitem: 'ñ'.repeat(99), Corto: 'c'.repeat(99), Entidad: 'e'.repeat(99), Cuota: 9e12, Saldo: 9e12 }), Ingresosfijosextra: Array(40).fill({ Nombreitem: 'ñ'.repeat(99), Monto: 9e12 }) });
Revisar(Buffer.byteLength(JSON.stringify(Grande)) < 65536, 'El respaldo más grande cabe en el límite de la base de datos.', 'El respaldo puede pasar de 64 KB.');

// Cuál copia gana al entrar
const Remoto = { nombre: 'Ana', fijo: 5000000, actualizado_en: '2026-11-11T10:00:00Z', datos_perfil: Fila.datos_perfil };
const Nuevo = Aplicarperfilremoto({ Deudas: [], Fijo: 0 }, Remoto, null, '');
Revisar(Nuevo.Deudas.length === 1 && Nuevo.Fijo === 5000000 && Nuevo.Cuestionariolisto, 'En un celular nuevo se recuperan perfil y deudas desde la nube.', 'En un celular nuevo no se recuperaron las deudas.');
const Localnuevo = Aplicarperfilremoto({ Deudas: [{ id: 'l' }, { id: 'm' }], Fijo: 4000000 }, Remoto, { Guardadoen: '2026-11-11T11:00:00Z' }, '');
Revisar(Localnuevo.Deudas.length === 2 && Localnuevo.Fijo === 4000000, 'Si el celular tiene cambios más nuevos, la nube no los pisa.', 'La nube pisó cambios más nuevos del celular.');
const Localviejo = Aplicarperfilremoto({ Deudas: [{ id: 'l' }, { id: 'm' }], Fijo: 4000000 }, Remoto, { Guardadoen: '2026-11-10T11:00:00Z' }, '');
Revisar(Localviejo.Deudas.length === 1 && Localviejo.Fijo === 5000000, 'Si la nube es más nueva, se usa la nube.', 'No se usó la copia más nueva de la nube.');
const Sinrespaldo = Aplicarperfilremoto({ Deudas: [{ id: 'l' }] }, { fijo: 1, actualizado_en: '2026-11-11T10:00:00Z' }, null, '');
Revisar(Sinrespaldo.Deudas.length === 1, 'Si la nube no tiene respaldo, se conservan las deudas del celular.', 'Se borraron deudas del celular por falta de respaldo.');

if (Errores === 0) {
  console.log('\nREVISIÓN DEL RESPALDO EXITOSA: sube lo prometido, lo que baja se revisa y gana la copia más reciente.');
  process.exit(0);
} else {
  console.error('\nREVISIÓN DEL RESPALDO FALLIDA: ' + Errores + ' problemas.');
  process.exit(1);
}
