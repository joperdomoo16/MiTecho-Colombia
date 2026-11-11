// Regla de fechas para las cuentas sin uso, tal como la dicen los términos y la política:
// la cuenta se borra al cumplir 12 meses sin uso y el aviso por correo sale 30 días antes.
// No usa nada de Supabase para poder probarla sola (test/Verificarplazos.js).

// La ley no fija un plazo: pide guardar los datos solo mientras sean necesarios (Decreto 1377 de 2013, art. 11).
// Si se cambia, hay que cambiar también Politicadeprivacidad.html y Terminosdeuso.html
export const Mesesinactividad = 12;
export const Diasaviso = 30;
const Undia = 86400000;

export function Sumarmeses(Tiempo: number, Meses: number): number {
  const Fecha = new Date(Tiempo);
  Fecha.setUTCMonth(Fecha.getUTCMonth() + Meses);
  return Fecha.getTime();
}

export type Decision =
  | { Accion: 'nada' }
  | { Accion: 'avisar'; Borrarel: number }
  | { Accion: 'esperar' }
  | { Accion: 'borrar' }
  | { Accion: 'cancelar' };

// Ultima: último uso (inicio de sesión, día que abrió la app o creación de la cuenta)
// Aviso: cuándo se mandó el correo de aviso (0 si no se ha mandado)
// Borrardesde: fecha de borrado que se le dijo a la persona (0 en avisos viejos que no la guardaban)
export function Decidirinactividad(Ultima: number, Aviso: number, Borrardesde: number, Ahora: number): Decision {
  const Cumple = Sumarmeses(Ultima, Mesesinactividad);
  // Volvió a usar la app después del aviso: se cancela el borrado
  if (Aviso && Ultima > Aviso) return { Accion: 'cancelar' };
  if (!Aviso) {
    if (Ahora < Cumple - Diasaviso * Undia) return { Accion: 'nada' };
    // Si el aviso sale tarde (por ejemplo, la tarea no corrió unos días) igual se dejan 30 días completos
    return { Accion: 'avisar', Borrarel: Math.max(Cumple, Ahora + Diasaviso * Undia) };
  }
  const Fechaborrado = Borrardesde || Math.max(Cumple, Aviso + Diasaviso * Undia);
  return Ahora >= Fechaborrado ? { Accion: 'borrar' } : { Accion: 'esperar' };
}
