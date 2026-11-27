// Pantallas de portada, inicio de sesión con Google o correo, registro y recuperación de clave

function Generarvaloresacceso() {
  const Estadoactual = this.Estadocomponente;
  const Enportada = this.Pantalla === 'splash' && !Estadoactual.Portadarecogida;
  const Azulsuperior = this.Pantalla === 'splash' || this.Pantalla === 'login';
  const Modoingreso = !Estadoactual.Ingresomodo || Estadoactual.Ingresomodo === 'login';

  return {
    Esbienvenidaingreso: Azulsuperior,
    Esmodoportada: Enportada,
    Bienvenidaclase: Enportada ? 'is-splash' : 'is-login',
    Tocarportada: () => {
      if (this.Pantalla === 'splash' && !Estadoactual.Portadarecogida) {
        this.Cambiarestado({ Portadaentrando: true, Portadarecogida: true, Pantalla: 'login' });
      }
    },
    Esingreso: this.Pantalla === 'login' || Boolean(Estadoactual.Portadarecogida),
    Esportada: Enportada,
    Saltarportada: () => {
      this.Cambiarestado({ Portadaentrando: true, Portadarecogida: true, Pantalla: 'login' });
    },
    Portadalogomovimiento: Estadoactual.Portadaentrando ? 'scale(1)' : 'scale(.8)',
    Portadalogoopacidad: Estadoactual.Portadaentrando ? 1 : 0,
    Portadatextoopacidad: Estadoactual.Portadaentrando ? 1 : 0,
    Portadatextomovimiento: Estadoactual.Portadaentrando ? 'translateY(0)' : 'translateY(14px)',
    Portadafranja: Estadoactual.Portadaentrando ? 'scaleX(1)' : 'scaleX(0)',
    Estadofondo: Azulsuperior ? '#1E345B' : 'var(--bg)',
    Estadotinta: Azulsuperior ? '#F4F6FB' : 'var(--ik)',
    Correoabierto: Boolean(Estadoactual.Correoabierto),
    Correocerrado: !Estadoactual.Correoabierto,
    Noesmodorecuperar: Estadoactual.Ingresomodo !== 'recover',
    Esmodorecuperar: Estadoactual.Ingresomodo === 'recover',
    Esmodoingreso: Modoingreso,
    Esmodoregistro: Estadoactual.Ingresomodo === 'register',
    Ingresotabclase: Modoingreso ? 'is-activa' : '',
    Registrotabclase: Estadoactual.Ingresomodo === 'register' ? 'is-activa' : '',
    Claveejemplo: Estadoactual.Ingresomodo === 'register' ? 'Mínimo 6 caracteres' : 'Tu contraseña',
    Ingresoclaveconfirmarvalor: Estadoactual.Ingresoclaveconfirmar || '',
    Ingresoexitomensaje: Estadoactual.Ingresoexitomensaje || '',
    Registrobotontexto: Estadoactual.Ingresoocupado ? 'Registrando…' : 'Registrarme',
    Recuperarbotontexto: Estadoactual.Ingresoocupado ? 'Enviando enlace…' : 'Enviar enlace de recuperación',
    Nombreregistrovalor: Estadoactual.Nombreregistro || '',
    Ingresocorreovalor: Estadoactual.Ingresocorreo,
    Ingresoclavevalor: Estadoactual.Ingresoclave || '',
    Ingresoerror: Estadoactual.Ingresoerror,
    Ingresoaviso: Estadoactual.Ingresoaviso,
    Ingresobotontexto: Estadoactual.Ingresoocupado ? 'Entrando…' : 'Entrar',
    Abrircorreo: () => this.Cambiarestado({ Correoabierto: true, Ingresomodo: 'login', Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' }),
    Cerrarcorreo: () => this.Cambiarestado({ Correoabierto: false, Ingresomodo: 'login', Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' }),
    Contactarsoporteingreso: () => {
      clearTimeout(this.Soportetemporizador);
      this.Cambiarestado({
        Soporteabierto: true,
        Soportenombre: Estadoactual.Soportenombre || Estadoactual.Nombre || '',
        Soportecorreo: Estadoactual.Soportecorreo || Estadoactual.Correo || Estadoactual.Ingresocorreo || '',
        Soportetipo: 'soporte',
        Soporteasunto: '',
        Soportedescripcion: '',
        Soporteradicado: '',
        Soportefechamaxima: '',
        Soporteerror: '',
        Soporteenviado: false,
        Soporteocupado: false,
        Soportedesplazamiento: 0,
        Soportearrastrando: false,
        Soporteanimado: false
      });
      this.Soportetemporizador = setTimeout(() => this.Cambiarestado({ Soporteanimado: true }), 25);
    },
    Elegiringreso: () => this.Cambiarestado({ Ingresomodo: 'login', Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' }),
    Elegirregistro: () => this.Cambiarestado({ Ingresomodo: 'register', Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' }),
    Elegirrecuperar: () => this.Cambiarestado({ Ingresomodo: 'recover', Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' }),
    Escribirnombreregistro: (Elemento) => this.Cambiarestado({ Nombreregistro: Textoseguro(Elemento.target.value, 70), Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' }),
    Escribiringresocorreo: (Elemento) => this.Cambiarestado({ Ingresocorreo: Textoseguro(Elemento.target.value, 100), Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' }),
    Escribiringresoclave: (Elemento) => this.Cambiarestado({ Ingresoclave: Textoseguro(Elemento.target.value, 72), Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' }),
    Escribiringresoclaveconfirmar: (Elemento) => this.Cambiarestado({ Ingresoclaveconfirmar: Textoseguro(Elemento.target.value, 72), Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' }),
    Ingresogoogle: async () => {
      this.Cambiarestado({ Ingresoocupado: true, Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' });
      if (typeof window !== 'undefined' && window.Puentenativo && typeof window.Puentenativo.iniciarSesionGoogle === 'function') {
        window.Googleexitoso = async (Tokenid, Correo, Nombreitem) => {
          try {
            const Resultado = await Iniciarsesiongoogle(Tokenid);
            this.Cambiarestado({ Ingresoocupado: false });
            if (Resultado.ok) {
              const Usuario = (Resultado.datos && Resultado.datos.user) || {};
              const Correousuario = Correo || Usuario.email || '';
              const Nombreusuario = Nombreitem || (Usuario.user_metadata && (Usuario.user_metadata.full_name || Usuario.user_metadata.nombre)) || Correousuario;
              let Perfilfila = null;
              const Resultadoperfil = await Obtenerperfilapi();
              if (Resultadoperfil.ok && Array.isArray(Resultadoperfil.datos) && Resultadoperfil.datos.length > 0) {
                Perfilfila = Resultadoperfil.datos[0];
              }
              this.Iniciarsesionusuario(Correousuario, Nombreusuario, Perfilfila, Usuario.app_metadata);
            } else {
              this.Cambiarestado({ Ingresoerror: 'No se pudo iniciar sesión con Google, intenta de nuevo.' });
            }
          } catch (Falla) {
            this.Cambiarestado({ Ingresoocupado: false, Ingresoerror: 'Error al procesar la sesión.' });
          }
        };
        window.Googlefallido = (Fallamensaje) => {
          this.Cambiarestado({ Ingresoocupado: false, Ingresoerror: Fallamensaje || 'No se pudo conectar con Google.' });
        };
        window.Googlecancelado = () => {
          this.Cambiarestado({ Ingresoocupado: false });
        };
        window.Puentenativo.iniciarSesionGoogle();
        return;
      }
      try {
        const Verificacion = await fetch(Configuracionapi.Urlbase + '/auth/v1/authorize?provider=google', { redirect: 'manual' });
        if (Verificacion.status === 400) {
          this.Cambiarestado({
            Ingresoocupado: false,
            Ingresoaviso: 'Para usar Google directo debes activar el proveedor en Supabase. Puedes ingresar o registrarte con tu correo (incluyendo Gmail) abajo.'
          });
          this.Aviso('Ingresa o regístrate con tu correo abajo.');
          return;
        }
        window.location.href = Configuracionapi.Urlbase + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(window.location.origin);
      } catch (Falla) {
        this.Cambiarestado({ Ingresoocupado: false, Ingresoaviso: 'Ingresa con tu correo y contraseña abajo.' });
        this.Aviso('Ingresa o regístrate con tu correo abajo.');
      }
    },
    Ingresocorreo: async () => {
      const Correo = (Estadoactual.Ingresocorreo || '').trim().toLowerCase();
      const Clave = Estadoactual.Ingresoclave || '';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(Correo)) {
        this.Cambiarestado({ Ingresoerror: 'Escribe un correo válido.' });
        return;
      }
      if (!Clave || Clave.length < 6) {
        this.Cambiarestado({ Ingresoerror: 'Escribe tu contraseña (mínimo 6 caracteres).' });
        return;
      }
      this.Cambiarestado({ Ingresoocupado: true, Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' });
      const Resultado = await Iniciarsesionapi(Correo, Clave);
      this.Cambiarestado({ Ingresoocupado: false });
      if (Resultado.ok) {
        let Perfilfila = null;
        const Resultadoperfil = await Obtenerperfilapi();
        if (Resultadoperfil.ok && Array.isArray(Resultadoperfil.datos) && Resultadoperfil.datos.length > 0) {
          Perfilfila = Resultadoperfil.datos[0];
        }
        const Datoscuenta = (Resultado.datos && Resultado.datos.user && Resultado.datos.user.user_metadata) || {};
        this.Iniciarsesionusuario(Correo, Limpiarnombre(Datoscuenta.nombre || ''), Perfilfila, Resultado.datos && Resultado.datos.user && Resultado.datos.user.app_metadata);
      } else {
        const Falla = Resultado.error || '';
        let Mensaje = 'No se pudo iniciar sesión, intenta de nuevo.';
        if (Resultado.codigo === 'email_not_confirmed') {
          Mensaje = 'Por favor revisa tu correo y confirma tu cuenta con el enlace que te enviamos antes de entrar.';
        } else if (Falla.includes('invalid_grant') || Falla.includes('credentials')) {
          Mensaje = 'Correo o contraseña incorrectos. Si no tienes cuenta, selecciona "Registrarme".';
        } else if (Resultado.offline) {
          Mensaje = Resultado.error;
        }
        this.Cambiarestado({ Ingresoerror: Mensaje });
      }
    },
    Registrarcorreo: async () => {
      const Fallanombre = Validarnombre(Estadoactual.Nombreregistro);
      if (Fallanombre) {
        this.Cambiarestado({ Ingresoerror: Fallanombre });
        return;
      }
      const Nombre = Limpiarnombre(Estadoactual.Nombreregistro);
      const Correo = (Estadoactual.Ingresocorreo || '').trim().toLowerCase();
      const Clave = Estadoactual.Ingresoclave || '';
      const Claveconfirmada = Estadoactual.Ingresoclaveconfirmar || '';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(Correo)) {
        this.Cambiarestado({ Ingresoerror: 'Escribe un correo válido para registrarte.' });
        return;
      }
      if (!Clave || Clave.length < 6) {
        this.Cambiarestado({ Ingresoerror: 'La contraseña debe tener al menos 6 caracteres.' });
        return;
      }
      if (Clave !== Claveconfirmada) {
        this.Cambiarestado({ Ingresoerror: 'Las contraseñas no coinciden. Por favor verifícalas.' });
        return;
      }
      this.Cambiarestado({ Ingresoocupado: true, Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' });
      const Resultado = await Registrarusuarioapi({ email: Correo, password: Clave, nombre: Nombre, ciudad: Estadoactual.Ciudad });
      this.Cambiarestado({ Ingresoocupado: false });
      if (Resultado.ok) {
        if (Resultado.datos && Resultado.datos.access_token) {
          const Datoscuenta = (Resultado.datos.user && Resultado.datos.user.user_metadata) || {};
          this.Iniciarsesionusuario(Correo, Limpiarnombre(Datoscuenta.nombre || Nombre), null, Resultado.datos.user && Resultado.datos.user.app_metadata);
          this.Aviso('Bienvenido. Tu cuenta quedó creada.');
          return;
        }
        this.Cambiarestado({
          Correo,
          Nombre,
          Ingresomodo: 'login',
          Ingresoclave: '',
          Ingresoclaveconfirmar: '',
          Ingresoexitomensaje: 'Te enviamos un correo de confirmación. Revisa tu bandeja de entrada para activar tu cuenta y vuelve a entrar.'
        });
        this.Aviso('Revisa tu correo para confirmar tu cuenta.');
      } else {
        let Mensaje = 'No se pudo crear la cuenta, intenta de nuevo.';
        if (Resultado.error && Resultado.error.includes('already registered')) {
          Mensaje = 'Este correo ya está registrado. Selecciona "Iniciar sesión" para entrar.';
        } else if (Resultado.offline) {
          Mensaje = Resultado.error;
        }
        this.Cambiarestado({ Ingresoerror: Mensaje });
      }
    },
    Recuperarcorreo: async () => {
      const Correo = (Estadoactual.Ingresocorreo || '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(Correo)) {
        this.Cambiarestado({ Ingresoerror: 'Escribe un correo válido para recuperar tu contraseña.' });
        return;
      }
      this.Cambiarestado({ Ingresoocupado: true, Ingresoerror: '', Ingresoaviso: '', Ingresoexitomensaje: '' });
      const Resultado = await Recuperarcontrasenaapi(Correo);
      this.Cambiarestado({ Ingresoocupado: false });
      if (Resultado.ok) {
        this.Cambiarestado({
          Ingresoexitomensaje: 'Si este correo está registrado en MiTecho, te enviamos un enlace para cambiar tu contraseña. Revisa tu bandeja de entrada o correo no deseado.'
        });
        this.Aviso('Solicitud procesada.');
      } else {
        this.Cambiarestado({ Ingresoerror: Resultado.offline ? Resultado.error : 'No se pudo enviar el correo de recuperación. Intenta de nuevo.' });
      }
    }
  };
}
