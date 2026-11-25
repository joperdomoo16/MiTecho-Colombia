// Lo que se ve del modo sin cuenta: el aviso antes de entrar, la vinculación desde el perfil y el menú del invitado

const Iconovincular = 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7';

// Menuitemsbase es la lista del menú que ya armó el simulador; para el invitado se cambia "Cerrar sesión"
function Generarvaloresinvitado(Menuitemsbase) {
  const Estadoactual = this.Estadocomponente;
  const Invitado = Boolean(Estadoactual.Invitado);
  const Enlogin = this.Pantalla === 'login';
  const Pendiente = Estadoactual.Vinculacionpendiente;
  // Abre el inicio de sesión para vincular; el panel que estaba abierto se conserva para volver a él
  const Abrirvinculacion = (Cambiosextra) => this.Cambiarestado({
    Pantalla: 'login', Menu: false, Ayuda: false, Correoabierto: false, Ingresomodo: 'login',
    Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '', Portadaentrando: true, Portadarecogida: true,
    ...Cambiosextra
  });

  const Valores = {
    Esinvitado: Invitado,
    Noesinvitado: !Invitado,
    Mostrarinvitado: Enlogin && !Invitado,
    Esvinculacion: Enlogin && Invitado,
    Avisoinvitadovisible: Enlogin && !Invitado && Boolean(Estadoactual.Avisoinvitado),
    Abriravisoinvitado: () => this.Cambiarestado({ Avisoinvitado: true, Correoabierto: false, Ingresoerror: '' }),
    Cerraravisoinvitado: () => this.Cambiarestado({ Avisoinvitado: false }),
    Continuarinvitado: () => this.Entrarsincuenta(),
    Vinculacionvisible: Boolean(Pendiente),
    Vinculaciontexto: Pendiente ? 'La cuenta ' + Pendiente.Correo + ' ya tiene un perfil guardado. Elige con qué datos quieres seguir.' : '',
    Usardatoscelular: () => Resolvervinculacion.call(this, true),
    Usardatoscuenta: () => Resolvervinculacion.call(this, false),
    Cancelarvinculacion: () => Cancelarvinculacioninvitado.call(this),
    Vincularconcorreo: () => Abrirvinculacion({ Correoabierto: true, Ingresomodo: 'register' }),
    Vincularcongoogle: () => {
      Abrirvinculacion({});
      // Google se abre de una vez con el mismo flujo del inicio de sesión
      const Valoreslogin = Generarvalorespantallas.call(this);
      if (typeof Valoreslogin.Ingresogoogle === 'function') Valoreslogin.Ingresogoogle();
    },
    Volvervinculacion: () => this.Cambiarestado({ Pantalla: 'app', Correoabierto: false, Ingresomodo: 'login', Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' })
  };
  if (!Invitado) return Valores;

  // Sin cuenta cambia lo que se ve en el perfil y "Cerrar sesión" pasa a ser "Vincular cuenta"
  Valores.Nombrecompletousuario = Estadoactual.Nombre || 'Invitado';
  Valores.Correovisible = 'Sin cuenta · tus datos están solo en este celular';
  if (Array.isArray(Menuitemsbase)) {
    Valores.Menuitems = Menuitemsbase.map(Item => (Item.Etiqueta === 'Cerrar sesión'
      ? { ...Item, Etiqueta: 'Vincular cuenta', Subtexto: 'Guarda tus datos en una cuenta', Icono: Iconovincular, Color: 'var(--at)', Derecha: '→', Alclic: () => Abrirvinculacion({}) }
      : Item));
  }
  return Valores;
}
