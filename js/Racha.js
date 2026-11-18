// Racha de días con registros: se arma con los días reales en que la persona anotó un ingreso o un gasto

const Undiaracha = 86400000;
const Diasvisiblesracha = 14;

// Fecha de hoy en Colombia como 'AAAA-MM-DD', sin importar la zona horaria del celular
function Diahoyracha(Momento = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(Momento);
}

function Restardiasracha(Fechatexto, Dias) {
  const [Anio, Mes, Dia] = Fechatexto.split('-').map(Number);
  return new Date(Date.UTC(Anio, Mes - 1, Dia) - Dias * Undiaracha).toISOString().slice(0, 10);
}

// Se llama al guardar un ingreso o un gasto; guarda como máximo un año de días para no llenar el celular
function Marcardiaregistro(Dias) {
  const Lista = Array.isArray(Dias) ? Dias : [];
  const Hoy = Diahoyracha();
  return Lista.includes(Hoy) ? Lista : [...Lista, Hoy].slice(-366);
}

// Cuenta los días seguidos con registros. Si hoy todavía no registra, la racha sigue viva desde ayer
function Calcularracha(Dias, Momento = new Date()) {
  const Conjunto = new Set(Array.isArray(Dias) ? Dias : []);
  const Hoy = Diahoyracha(Momento);
  const Registrahoy = Conjunto.has(Hoy);
  let Seguidos = 0;
  let Cursor = Registrahoy ? Hoy : Restardiasracha(Hoy, 1);
  while (Conjunto.has(Cursor)) {
    Seguidos++;
    Cursor = Restardiasracha(Cursor, 1);
  }
  // Cuadros de los últimos 14 días, del más viejo al de hoy
  const Cuadros = [];
  for (let Atras = Diasvisiblesracha - 1; Atras >= 0; Atras--) {
    const Fecha = Restardiasracha(Hoy, Atras);
    Cuadros.push({ Fecha, Lleno: Conjunto.has(Fecha), Eshoy: Atras === 0 });
  }
  return { Seguidos, Registrahoy, Cuadros };
}
