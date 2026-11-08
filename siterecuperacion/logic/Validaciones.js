// Revisa que la contraseña tenga al menos seis caracteres y que ambos campos sean iguales

// Comprueba el largo mínimo y que las dos contraseñas escritas sean idénticas
export function Validarcamposclave(Clavenueva, Claveconfirmada) {
  const Textoactual = Clavenueva || '';
  const Textorepetido = Claveconfirmada || '';

  const Longitudvalida = Textoactual.length >= 6;
  const Coinciden = Textoactual.length > 0 && Textoactual === Textorepetido;

  return {
    Longitudvalida,
    Coinciden,
    Todovalido: Longitudvalida && Coinciden
  };
}
