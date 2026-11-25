// Revisión de los festivos de Colombia y de la fecha máxima de respuesta que calcula la función registrarlegal

const Rutas = require('path');
const Enlace = require('url');

let Errores = 0;
function Revisar(Condicion, Bien, Mal) {
  if (Condicion) console.log('[BIEN] ' + Bien);
  else { console.error('[FALLA] ' + Mal); Errores++; }
}

(async () => {
  // Node 23.6 o superior lee TypeScript directo, así se prueba el mismo archivo que corre en Supabase
  const Ruta = Enlace.pathToFileURL(Rutas.join(__dirname, '..', 'supabase', 'functions', 'registrarlegal', 'Festivos.ts')).href;
  const { Festivosdelanio, Calcularplazos, Textofecha, Hoybogota } = await import(Ruta);

  // Festivos 2026 publicados en el calendario oficial
  const Esperados2026 = ['2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03', '2026-05-01', '2026-05-18', '2026-06-08',
    '2026-06-15', '2026-06-29', '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25'];
  const Calculados = [...Festivosdelanio(2026)].sort();
  Revisar(JSON.stringify(Calculados) === JSON.stringify(Esperados2026), 'Los 18 festivos de 2026 coinciden con el calendario oficial.', 'Festivos 2026 distintos: ' + Calculados.join(', '));

  const Pascuas = { 2025: '2025-04-18', 2027: '2027-03-26', 2028: '2028-04-14' };
  for (const Anio in Pascuas) {
    Revisar(Festivosdelanio(Number(Anio)).has(Pascuas[Anio]), 'Viernes Santo ' + Anio + ' bien calculado.', 'Viernes Santo ' + Anio + ' mal calculado.');
  }

  // Recibida el lunes 9 de noviembre de 2026: el lunes 16 es festivo, así que 15 días hábiles llegan al 1 de diciembre
  const Recepcion = new Date(Date.UTC(2026, 10, 9));
  const Soporte = Calcularplazos('soporte', Recepcion);
  const Consulta = Calcularplazos('consulta', Recepcion);
  const Reclamo = Calcularplazos('reclamo', Recepcion);
  Revisar(Textofecha(Soporte.Maxima) === '2026-12-01', 'Soporte: fecha máxima 1 de diciembre de 2026.', 'Soporte dio ' + Textofecha(Soporte.Maxima));
  Revisar(Textofecha(Consulta.Maxima) === '2026-11-24', 'Consulta: fecha máxima 24 de noviembre de 2026.', 'Consulta dio ' + Textofecha(Consulta.Maxima));
  Revisar(Textofecha(Consulta.Prorroga) === '2026-12-01', 'Consulta: prórroga de 5 días hábiles hasta el 1 de diciembre.', 'Prórroga de consulta dio ' + Textofecha(Consulta.Prorroga));
  // 8 días hábiles después del 1 de diciembre, saltando el 8 de diciembre que es festivo
  Revisar(Textofecha(Reclamo.Prorroga) === '2026-12-14', 'Reclamo: prórroga de 8 días hábiles hasta el 14 de diciembre.', 'Prórroga de reclamo dio ' + Textofecha(Reclamo.Prorroga));

  // A las 11 de la noche en Bogotá ya es el día siguiente en UTC, pero la solicitud cuenta como recibida ese día
  Revisar(Textofecha(Hoybogota(new Date('2026-11-10T04:00:00Z'))) === '2026-11-09', 'La fecha de recepción usa la hora de Bogotá.', 'La fecha de recepción no usa la hora de Bogotá.');

  // Cuentas sin uso: los términos dicen que se borran a los 12 meses con aviso por correo 30 días antes
  const Rutaplazo = Enlace.pathToFileURL(Rutas.join(__dirname, '..', 'supabase', 'functions', 'registrarlegal', 'Plazoinactividad.ts')).href;
  const { Decidirinactividad, Sumarmeses } = await import(Rutaplazo);
  const Hoy = Date.UTC(2026, 10, 9, 8);
  const Undia = 86400000;
  const Hace = (Meses) => Sumarmeses(Hoy, -Meses);

  Revisar(Decidirinactividad(Hace(10), 0, 0, Hoy).Accion === 'nada', 'Con 10 meses sin uso no se manda nada.', 'Con 10 meses sin uso ya hizo algo.');

  const Once = Decidirinactividad(Hace(11), 0, 0, Hoy);
  Revisar(Once.Accion === 'avisar' && Once.Borrarel === Sumarmeses(Hace(11), 12), 'Con 11 meses sin uso se manda el aviso y el borrado queda para el día en que se cumplen 12 meses.', 'Con 11 meses sin uso no avisa bien: ' + JSON.stringify(Once));

  const Avisoprevio = Hoy - 30 * Undia;
  const Doce = Decidirinactividad(Hace(12), Avisoprevio, Sumarmeses(Hace(12), 12), Hoy);
  Revisar(Doce.Accion === 'borrar', 'Con 12 meses sin uso y el aviso ya enviado, la cuenta se borra.', 'Con 12 meses y aviso previo no borra: ' + JSON.stringify(Doce));

  const Volvio = Decidirinactividad(Avisoprevio + 5 * Undia, Avisoprevio, Sumarmeses(Hace(12), 12), Hoy);
  Revisar(Volvio.Accion === 'cancelar', 'Si la persona volvió después del aviso, el aviso se cancela.', 'Volvió después del aviso y no se canceló: ' + JSON.stringify(Volvio));

  // Casos de borde: nunca se borra sin aviso y siempre hay 30 días completos entre el aviso y el borrado
  Revisar(Decidirinactividad(Hace(14), 0, 0, Hoy).Accion === 'avisar', 'Sin aviso previo nunca se borra, aunque pasen más de 12 meses.', 'Borró una cuenta sin haberla avisado.');
  const Tarde = Decidirinactividad(Hace(12), 0, 0, Hoy);
  Revisar(Tarde.Accion === 'avisar' && Tarde.Borrarel === Hoy + 30 * Undia, 'Si el aviso sale tarde, igual se dejan 30 días completos antes de borrar.', 'El aviso tardío no deja 30 días: ' + JSON.stringify(Tarde));
  Revisar(Decidirinactividad(Hace(12), Hoy - 10 * Undia, Hoy + 20 * Undia, Hoy).Accion === 'esperar', 'Antes de la fecha avisada la cuenta no se borra.', 'Borró antes de la fecha que se le dijo a la persona.');

  if (Errores === 0) console.log('\nREVISIÓN DE PLAZOS EXITOSA: festivos, fechas máximas de respuesta y cuentas sin uso correctos.');
  else { console.error('\nSe encontraron ' + Errores + ' problemas en los plazos.'); process.exit(1); }
})();
