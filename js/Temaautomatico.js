// Tema de la app: claro, oscuro o automático. El automático usa el mismo modo del celular y cambia con él.
// Las funciones que reciben this se llaman con .call desde la app.

const Temasvalidos = ['claro', 'oscuro', 'auto'];

// Modo del celular; si el sistema no lo informa se usa el oscuro, que es el de la marca
function Temasistema() {
  try {
    return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'oscuro';
  } catch (Falla) {
    return 'oscuro';
  }
}

// Tema que se pinta: el elegido o, en automático, el del celular
function Resolvertema(Elegido, Mododefecto) {
  if (Elegido === 'auto') return Temasistema();
  if (Elegido === 'claro' || Elegido === 'oscuro') return Elegido;
  return Mododefecto === 'claro' ? 'claro' : 'oscuro';
}

// Repinta la app cuando el celular cambia de modo, y también al volver a ella por si cambió mientras estaba cerrada
function Escuchartemasistema(Componente) {
  if (typeof window === 'undefined' || Componente.Escuchatema) return;
  Componente.Escuchatema = true;
  const Revisar = () => { if (Componente.Estadocomponente.Temaelegido === 'auto') Componente.Forzaractualizacion(); };
  if (typeof matchMedia === 'function') {
    const Consulta = matchMedia('(prefers-color-scheme: light)');
    if (Consulta.addEventListener) Consulta.addEventListener('change', Revisar);
    else if (Consulta.addListener) Consulta.addListener(Revisar);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) Revisar(); });
}

// El sol o la luna de arriba, y la opción del menú, pasan al modo contrario del que se ve.
// Si estaba en automático deja de seguir al celular, y se avisa dónde volver a elegirlo
function Alternartemarapido() {
  const Nuevo = this.Temaactual === 'oscuro' ? 'claro' : 'oscuro';
  const Estabaenautomatico = this.Estadocomponente.Temaelegido === 'auto';
  this.Cambiarestado({ Temaelegido: Nuevo });
  if (Estabaenautomatico) this.Aviso('Modo ' + Nuevo + '. Para seguir el de tu celular, elige Automático en tu perfil.');
}

// Iconos y opciones de Apariencia del perfil
const Iconostema = {
  claro: 'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  oscuro: 'M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z',
  auto: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2'
};

function Generarvalorestema(Seleccion) {
  const Elegido = Temasvalidos.includes(this.Estadocomponente.Temaelegido) ? this.Estadocomponente.Temaelegido : this.Temaactual;
  return {
    Temaopciones: [['claro', 'Claro'], ['oscuro', 'Oscuro'], ['auto', 'Automático']].map(([Clave, Etiqueta]) => ({
      Etiqueta,
      Icono: Iconostema[Clave],
      Activa: Elegido === Clave,
      ...Seleccion(Elegido === Clave),
      Alclic: () => this.Cambiarestado({ Temaelegido: Clave })
    })),
    Temanota: '«Automático» usa el mismo modo de tu celular. Ahora está en modo ' + Temasistema() + '.',
    Temaetiqueta: this.Temaactual === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
  };
}
