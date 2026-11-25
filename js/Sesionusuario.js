// Entrar con una cuenta y cerrar la sesión. Se llaman con .call desde la app para que this sea la aplicación.

// Datosinvitado llega cuando alguien que usaba la app sin cuenta la vincula: en ese caso se queda con lo
// que tenía en este celular en vez de lo que hubiera guardado antes en la cuenta
function Entrarconcuenta(Correo, Nombresugerido, Perfilremoto, Metadatoscuenta, Datosinvitado) {
  const Base = Estadobaseinicial();
  if (Datosinvitado && typeof Datosinvitado === 'object') {
    Object.keys(Datosinvitado).forEach(Clave => { Base[Clave] = Datosinvitado[Clave]; });
    if (!Base.Nombre && Nombresugerido) Base.Nombre = Nombresugerido;
  } else {
    const Guardadolocal = typeof Cargardatosusuario === 'function' ? Cargardatosusuario(Correo) : null;
    if (Guardadolocal && typeof Guardadolocal === 'object') {
      Camposalmacenados.forEach(Clave => {
        if (Clave in Guardadolocal) Base[Clave] = Guardadolocal[Clave];
      });
    }
    if (Perfilremoto && typeof Perfilremoto === 'object') {
      Aplicarperfilremoto(Base, Perfilremoto, Guardadolocal, Nombresugerido);
    } else if (!Base.Nombre && Nombresugerido) {
      Base.Nombre = Nombresugerido;
    }
  }
  Base.Correo = Correo || '';
  // Pro lo marca el servidor (después Google Play Billing); lo guardado en el celular no cuenta
  Base.Pro = Boolean(Metadatoscuenta && Metadatoscuenta.pro);
  Base.Metodoingreso = Metadatoscuenta && Metadatoscuenta.provider === 'google' ? 'google' : 'correo';
  Base.Ingresado = true;
  Base.Invitado = false;
  // Si la cuenta todavía no autorizó la versión vigente de la política, la ventana de autorización sale sola.
  // La autorización que se dio sin cuenta no pasa: la prueba tiene que quedar en el servidor con la cuenta
  const Autorizacion = Metadatoscuenta && Metadatoscuenta.autorizacion;
  Base.Autorizacionversion = Autorizacion && Autorizacion.version ? String(Autorizacion.version) : '';
  Base.Autorizacionfecha = '';
  Base.Temaelegido = this.Estadocomponente.Temaelegido || Base.Temaelegido || 'oscuro';
  Base.Portadaentrando = true;
  Base.Portadarecogida = true;
  Base.Correoabierto = false;
  Base.Ingresoclave = '';
  Base.Ingresoclaveconfirmar = '';
  Base.Ingresoerror = '';
  Base.Ingresoaviso = '';
  Base.Ingresoexitomensaje = '';
  Base.Pantalla = Base.Cuestionariolisto ? 'app' : 'setup';
  Base.Pestana = 'inicio';
  this.Cambiarestado(Base);
  Guardardatosalmacenados(Base);
  this.Aviso('Sesión iniciada con ' + (Base.Nombre || Correo) + '.');
  // El servidor manda la bienvenida solo la primera vez que la cuenta entra; las demás veces no hace nada
  if (typeof Enviarbienvenidaapi === 'function') Enviarbienvenidaapi().catch(() => null);
}

// Singuardar se usa al borrar la cuenta o los datos, para que no quede una copia en el celular
function Salirdesesion(Singuardar) {
  if (!Singuardar && this.Estadocomponente.Ingresado && this.Estadocomponente.Correo && !this.Estadocomponente.Invitado) {
    Guardardatosalmacenados(this.Estadocomponente);
  }
  if (typeof Cerrarsesionapi === 'function') {
    Cerrarsesionapi().catch(() => null);
  }
  Borrardatosalmacenados();
  const Limpio = Estadobaseinicial();
  Limpio.Temaelegido = this.Estadocomponente.Temaelegido || 'oscuro';
  Limpio.Pantalla = 'login';
  Limpio.Portadaentrando = true;
  Limpio.Portadarecogida = true;
  Limpio.Ingresado = false;
  this.Cambiarestado(Limpio);
  this.Aviso('Sesión cerrada.');
}
