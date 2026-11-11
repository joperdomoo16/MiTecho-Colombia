// Festivos de Colombia y cuenta de días hábiles para saber hasta cuándo hay plazo de responder.
// Las fechas se manejan como días sueltos (medianoche UTC) para que la hora del servidor no corra el día.

const Undia = 86400000;

function Fecha(Anio: number, Mes: number, Dia: number): Date {
  return new Date(Date.UTC(Anio, Mes - 1, Dia));
}

function Sumardias(Base: Date, Dias: number): Date {
  return new Date(Base.getTime() + Dias * Undia);
}

export function Textofecha(Valor: Date): string {
  return Valor.toISOString().slice(0, 10);
}

// Domingo de Pascua con el método de Meeus; de ahí salen Semana Santa, Ascensión, Corpus y Sagrado Corazón
function Domingopascua(Anio: number): Date {
  const A = Anio % 19, B = Math.floor(Anio / 100), C = Anio % 100;
  const D = Math.floor(B / 4), E = B % 4, F = Math.floor((B + 8) / 25);
  const G = Math.floor((B - F + 1) / 3), H = (19 * A + B - D - G + 15) % 30;
  const I = Math.floor(C / 4), K = C % 4, L = (32 + 2 * E + 2 * I - H - K) % 7;
  const M = Math.floor((A + 11 * H + 22 * L) / 451);
  const Mes = Math.floor((H + L - 7 * M + 114) / 31);
  const Dia = ((H + L - 7 * M + 114) % 31) + 1;
  return Fecha(Anio, Mes, Dia);
}

// Ley Emiliani (Ley 51 de 1983): si el festivo no cae lunes, se pasa al lunes siguiente
function Pasaralunes(Valor: Date): Date {
  const Diasemana = Valor.getUTCDay();
  if (Diasemana === 1) return Valor;
  return Sumardias(Valor, (8 - Diasemana) % 7);
}

const Memoriafestivos = new Map<number, Set<string>>();

export function Festivosdelanio(Anio: number): Set<string> {
  const Guardado = Memoriafestivos.get(Anio);
  if (Guardado) return Guardado;
  const Pascua = Domingopascua(Anio);
  const Lista: Date[] = [
    // Fijos: se celebran el día que caen
    Fecha(Anio, 1, 1), Fecha(Anio, 5, 1), Fecha(Anio, 7, 20), Fecha(Anio, 8, 7), Fecha(Anio, 12, 8), Fecha(Anio, 12, 25),
    // Jueves y Viernes Santo
    Sumardias(Pascua, -3), Sumardias(Pascua, -2),
    // Los que se pasan al lunes
    ...[[1, 6], [3, 19], [6, 29], [8, 15], [10, 12], [11, 1], [11, 11]].map(([Mes, Dia]) => Pasaralunes(Fecha(Anio, Mes, Dia))),
    // Ascensión, Corpus Christi y Sagrado Corazón ya caen lunes contando desde Pascua
    Sumardias(Pascua, 43), Sumardias(Pascua, 64), Sumardias(Pascua, 71)
  ];
  const Conjunto = new Set(Lista.map(Textofecha));
  Memoriafestivos.set(Anio, Conjunto);
  return Conjunto;
}

export function Eshabil(Valor: Date): boolean {
  const Diasemana = Valor.getUTCDay();
  if (Diasemana === 0 || Diasemana === 6) return false;
  return !Festivosdelanio(Valor.getUTCFullYear()).has(Textofecha(Valor));
}

// Fecha de hoy en Bogotá, sin importar en qué país esté el servidor
export function Hoybogota(Momento = new Date()): Date {
  const Partes = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(Momento);
  const [Anio, Mes, Dia] = Partes.split('-').map(Number);
  return Fecha(Anio, Mes, Dia);
}

// Los términos en días se cuentan desde el día siguiente a la recepción y solo cuentan los hábiles
export function Sumardiashabiles(Recepcion: Date, Cantidad: number): Date {
  let Actual = Recepcion;
  let Contados = 0;
  while (Contados < Cantidad) {
    Actual = Sumardias(Actual, 1);
    if (Eshabil(Actual)) Contados++;
  }
  return Actual;
}

// Plazos por tipo de solicitud:
// soporte: derecho de petición, Ley 1755 de 2015 art. 14; la prórroga no puede pasar del doble del plazo inicial
// consulta: Ley 1581 de 2012 art. 14, 10 días hábiles y hasta 5 más
// reclamo: Ley 1581 de 2012 art. 15, 15 días hábiles y hasta 8 más
export const Plazos: Record<string, { Dias: number; Prorroga: number; Nombre: string; Norma: string }> = {
  soporte: { Dias: 15, Prorroga: 15, Nombre: 'Soporte técnico o pregunta', Norma: 'Ley 1755 de 2015, art. 14' },
  consulta: { Dias: 10, Prorroga: 5, Nombre: 'Consulta sobre mis datos', Norma: 'Ley 1581 de 2012, art. 14' },
  reclamo: { Dias: 15, Prorroga: 8, Nombre: 'Reclamo sobre mis datos', Norma: 'Ley 1581 de 2012, art. 15' }
};

export function Calcularplazos(Tipo: string, Recepcion: Date) {
  const Plazo = Plazos[Tipo] || Plazos.soporte;
  const Maxima = Sumardiashabiles(Recepcion, Plazo.Dias);
  const Prorroga = Sumardiashabiles(Maxima, Plazo.Prorroga);
  return { Maxima, Prorroga, Plazo };
}

// "1 de diciembre de 2026", para mostrar en la app y en los correos
export function Fechalarga(Valor: Date): string {
  return new Intl.DateTimeFormat('es-CO', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }).format(Valor);
}
