// Reglas para revisar lo que la persona escribe en los formularios antes de enviarlo

// Solo letras (con tildes y ñ), espacios, apóstrofo y guion, entre 2 y 70 caracteres.
// Devuelve el mensaje de error o un texto vacío si el nombre está bien.
function Validarnombre(Texto) {
  const Nombre = String(Texto || '').trim().replace(/\s+/g, ' ');
  if (Nombre.length < 2) return 'Escribe tu nombre para crear la cuenta.';
  if (Nombre.length > 70) return 'El nombre puede tener máximo 70 caracteres.';
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(Nombre)) return 'Escribe tu nombre como aparece en tu cédula, solo con letras.';
  return '';
}

// Deja el nombre limpio para guardarlo: sin espacios de más al inicio, al final ni repetidos
function Limpiarnombre(Texto) {
  return String(Texto || '').trim().replace(/\s+/g, ' ').slice(0, 70);
}
