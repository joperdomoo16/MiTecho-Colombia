// Modo sin cuenta: todo se guarda solo en este celular y nada sube a Supabase hasta que la persona vincule una cuenta.
// Se llaman con .call desde la app para que this sea la aplicación.

// Estos campos los pone el inicio de sesión de la cuenta; no pasan desde lo que se hizo sin cuenta
const Camposnovinculables = ['Ingresado', 'Correo', 'Metodoingreso', 'Pro', 'Autorizacionversion', 'Autorizacionfecha', 'Invitado'];

// El token se borra del celular de una vez; el aviso al servidor para cerrarlo sigue por su lado
function Soltarsesionabierta() {
  if (typeof Cerrarsesionapi === 'function') Cerrarsesionapi().catch(() => null);
  if (typeof Limpiartokenssesion === 'function') Limpiartokenssesion();
}

function Entrarcomoinvitado() {
  // Si quedó abierta la sesión de otra cuenta en el celular se cierra, para que nada de esto suba a esa cuenta
  Soltarsesionabierta();
  const Base = Estadobaseinicial();
  Base.Temaelegido = this.Estadocomponente.Temaelegido || this.Temaactual;
  Base.Ingresado = true;
  Base.Invitado = true;
  Base.Metodoingreso = 'invitado';
  Base.Correo = '';
  Base.Pro = false;
  Base.Portadaentrando = true;
  Base.Portadarecogida = true;
  Base.Pantalla = 'setup';
  Base.Pestana = 'inicio';
  this.Cambiarestado(Base);
  Guardardatosalmacenados(Base);
  this.Aviso('Entraste sin cuenta. Lo que escribas se queda en este celular.');
}

// Copia de lo que la persona guardó sin cuenta, lista para pasarla a la cuenta que vincule
function Extraerdatosinvitado(Estado) {
  const Datos = {};
  Camposalmacenados.forEach(Clave => {
    if (!Camposnovinculables.includes(Clave) && Estado[Clave] !== undefined) Datos[Clave] = Estado[Clave];
  });
  return Datos;
}

// Llega aquí cuando un invitado entra con Google o con su correo. Si la cuenta es nueva, se queda con lo del
// celular; si ya tenía un perfil guardado, la persona elige cuáles datos siguen
function Vincularcuentainvitado(Correo, Nombresugerido, Perfilremoto, Metadatoscuenta) {
  const Guardadolocal = typeof Cargardatosusuario === 'function' ? Cargardatosusuario(Correo) : null;
  const Cuentacondatos = Boolean(Perfilremoto && typeof Perfilremoto === 'object') || Boolean(Guardadolocal && Guardadolocal.Cuestionariolisto);
  if (!Cuentacondatos) {
    Entrarconcuenta.call(this, Correo, Nombresugerido, Perfilremoto, Metadatoscuenta, Extraerdatosinvitado(this.Estadocomponente));
    this.Aviso('Listo, vinculaste tu cuenta. Lo que tenías en este celular quedó guardado en ella.');
    return;
  }
  this.Cambiarestado({
    Vinculacionpendiente: { Correo, Nombresugerido, Perfilremoto, Metadatoscuenta },
    Ingresoocupado: false,
    Correoabierto: false,
    Ingresoclave: '',
    Ingresoclaveconfirmar: ''
  });
}

function Resolvervinculacion(Usarcelular) {
  const Pendiente = this.Estadocomponente.Vinculacionpendiente;
  if (!Pendiente) return;
  const Datosinvitado = Usarcelular ? Extraerdatosinvitado(this.Estadocomponente) : null;
  Entrarconcuenta.call(this, Pendiente.Correo, Pendiente.Nombresugerido, Pendiente.Perfilremoto, Pendiente.Metadatoscuenta, Datosinvitado);
  this.Aviso(Usarcelular
    ? 'Listo, vinculaste tu cuenta con los datos de este celular.'
    : 'Listo, entraste a tu cuenta con los datos que ya tenía.');
}

// Cancelar deja todo como estaba: se cierra la sesión de la cuenta y la persona sigue sin cuenta con sus datos
function Cancelarvinculacioninvitado() {
  Soltarsesionabierta();
  this.Cambiarestado({
    Vinculacionpendiente: null,
    Pantalla: 'app',
    Correoabierto: false,
    Ingresomodo: 'login',
    Ingresoocupado: false,
    Ingresoclave: '',
    Ingresoclaveconfirmar: '',
    Ingresoerror: '',
    Ingresoaviso: '',
    Ingresoexitomensaje: ''
  });
  this.Aviso('No vinculamos ninguna cuenta. Sigues sin cuenta en este celular.');
}
