// Registros de ingresos y gastos con su fecha: de aquí salen el día, la semana, el mes y el promedio de ingresos variables.
// Nada de esto se inventa: si la persona no ha registrado, las vistas quedan vacías y el promedio usa lo que declaró en su perfil.

const Mesescortos = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const Letrasdia = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

// Fecha de hoy en Colombia como 'AAAA-MM-DD'
function Hoyregistro(Momento = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(Momento);
}

function Restardiasregistro(Fecha, Dias) {
  const [Anio, Mes, Dia] = Fecha.split('-').map(Number);
  return new Date(Date.UTC(Anio, Mes - 1, Dia) - Dias * 86400000).toISOString().slice(0, 10);
}

// Los registros guardados antes de que existiera la fecha se toman como de hoy
function Fechaderegistro(Registro) {
  return Registro && /^\d{4}-\d{2}-\d{2}$/.test(String(Registro.Fecha || '')) ? Registro.Fecha : Hoyregistro();
}

function Registrosdeldia(Lista, Fecha) {
  return (Lista || []).filter(Registro => Fechaderegistro(Registro) === Fecha);
}

function Registrosdelmes(Lista, Mes) {
  return (Lista || []).filter(Registro => Fechaderegistro(Registro).slice(0, 7) === Mes);
}

function Sumamontos(Lista) {
  return (Lista || []).reduce((Acumulado, Registro) => Acumulado + (Registro.Monto || 0), 0);
}

// Los últimos 7 días terminando hoy, con su letra y su número
function Ultimosdias(Hoy = Hoyregistro()) {
  return Array.from({ length: 7 }, (Ignorado, Indice) => {
    const Fecha = Restardiasregistro(Hoy, 6 - Indice);
    const Dia = new Date(Fecha + 'T12:00:00Z');
    return { Fecha, Letra: Letrasdia[Dia.getUTCDay()], Numero: Dia.getUTCDate() };
  });
}

// Meses 'AAAA-MM' desde hace (Cantidad - 1) meses hasta el actual
function Ultimosmeses(Cantidad, Hoy = Hoyregistro()) {
  const [Anio, Mes] = Hoy.split('-').map(Number);
  return Array.from({ length: Cantidad }, (Ignorado, Indice) => {
    const Total = Anio * 12 + (Mes - 1) - (Cantidad - 1 - Indice);
    const Mesnumero = Total % 12;
    return { Clave: Math.floor(Total / 12) + '-' + String(Mesnumero + 1).padStart(2, '0'), Etiqueta: Mescorto(Mesnumero) };
  });
}

function Mescorto(Numero) {
  return Mesescortos[Numero];
}

// Ingresos variables registrados en 7 meses (6 completos y el actual). null significa que ese mes no tiene registros
function Historialvariables(Estadousuario) {
  return Ultimosmeses(7).map(Mes => {
    const Delmes = Registrosdelmes(Estadousuario.Registros, Mes.Clave);
    return Delmes.length ? Sumamontos(Delmes) : null;
  });
}

// Promedio de los últimos N meses completos que tienen registros, como hace el banco con los extractos.
// Corrimiento 1 es la ventana anterior, para saber si el promedio subió o bajó. Sin registros vale lo declarado en el perfil
function Promediovariable(Historial, N, Corrimiento, Estadousuario) {
  const Completos = Historial.slice(0, -1), Fin = Completos.length - Corrimiento;
  const Ventana = Completos.slice(Math.max(0, Fin - N), Fin).filter(Valor => Valor !== null);
  if (Ventana.length) return Ventana.reduce((Acumulado, Valor) => Acumulado + Valor, 0) / Ventana.length;
  return Estadousuario.Tipo === 'fijo' ? 0 : (Estadousuario.Variable || 0);
}

// Cuántos meses completos con registros entran en el promedio
function Mesesconregistros(Historial, N) {
  return Historial.slice(0, -1).slice(-N).filter(Valor => Valor !== null).length;
}

// Semanas del mes actual: del día 1 al 7 es S1, del 8 al 14 S2, y así hasta S5
function Semanasdelmes(Lista, Hoy = Hoyregistro()) {
  const Semanas = [0, 0, 0, 0, 0];
  Registrosdelmes(Lista, Hoy.slice(0, 7)).forEach(Registro => {
    const Dia = Number(Fechaderegistro(Registro).slice(8, 10));
    Semanas[Math.min(4, Math.floor((Dia - 1) / 7))] += Registro.Monto || 0;
  });
  return Semanas;
}
