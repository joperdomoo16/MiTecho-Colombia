// Preparación de los datos de inicio de sesión, pantalla principal, racha diaria y avance de ahorro

// Aviso cuando el techo pasa el tope VIS: a ese precio la vivienda ya sería No VIS
function Avisotopevis(Calculo, Ciudad) {
  return 'Tu techo pasa el tope VIS de ' + (Ciudad || 'tu ciudad') + ' (' + Calculo.Topevissalarios + ' SMMLV = ' + Formatoenteropesos(Calculo.Topevis) + '). A ese precio la vivienda sería No VIS: el banco financia hasta el 70% y no aplica subsidio. Si buscas VIS, tu tope es ' + Formatoenteropesos(Calculo.Topevis) + '.';
}

function Generarvaloresinicio(Calculo, Configuracion, Seleccion, Oscuroactivo) {
  const Estadoactual = this.Estadocomponente, Pestana = this.Pestana;
  const Mostrado = Estadoactual.Mostrado ?? Calculo.Preciotecho;
  const Pestanas = ['inicio', 'ingresos', 'simulador', 'plan', 'ofertas'];
  const Pestanaes = {}, Pestanaclase = {}, Pestanaactual = {}, Pestanair = {};
  Pestanas.forEach(Auxiliar => {
    Pestanaes[Auxiliar] = Pestana === Auxiliar;
    Pestanaclase[Auxiliar] = Pestana === Auxiliar ? 'is-activa' : '';
    Pestanaactual[Auxiliar] = Pestana === Auxiliar ? 'page' : false;
    // Las pestañas de abajo empiezan un historial nuevo: desde ellas, atrás lleva al Inicio
    Pestanair[Auxiliar] = () => {
      Reiniciarnavegacion.call(this);
      this.Cambiarestado({
        Pestana: Auxiliar,
        Simuladorpaso: Auxiliar === 'simulador' ? (Estadoactual.Simuladorpaso || 'form') : Estadoactual.Simuladorpaso,
        ...(Auxiliar === 'ingresos' ? { Ingresovista: Estadoactual.Ingresovista || 'dia', Registrotipo: Estadoactual.Registrotipo || 'ing', Diaseleccionado: 6 } : {})
      });
    };
  });
  Pestanaes.simForm = Pestana === 'simulador' && (Estadoactual.Simuladorpaso || 'form') === 'form';
  Pestanaes.simResult = Pestana === 'simulador' && Estadoactual.Simuladorpaso === 'result';

  const Totalhoy = Sumamontos(Registrosdeldia(Estadoactual.Registros, Hoyregistro()));
  const Efectivopendiente = Estadoactual.Registros.filter(Elemento => !Elemento.Consignado).filter(Elemento => Elemento.Medio === 'Efectivo').reduce((Acumulado, Elemento) => Acumulado + Elemento.Monto, 0) + Estadoactual.Efectivoanterior;
  // Lo que pide el techo (cuota inicial y gastos) frente a lo que ya tiene el hogar (ahorro y subsidio que aplica a ese techo)
  const Necesariotecho = Calculo.Cuotainicialtecho + (Estadoactual.Financiargastos ? 0 : Calculo.Gastostecho);
  const Cuotainicialporcentaje = Necesariotecho > 0 ? Math.min(1, (Necesariotecho - Calculo.Faltatecho) / Necesariotecho) : 0;
  const Tienetecho = Calculo.Preciotecho > 0, Tieneahorro = Necesariotecho - Calculo.Faltatecho;
  const Ahorroporcentaje = Necesariotecho > 0 ? Math.min(100, Math.round(Cuotainicialporcentaje * 100)) : 0;
  const Metaporcentaje = Math.min(100, Math.round(Totalhoy / Math.max(1, Calculo.Metadiaria) * 100));
  // Proyectos de referencia que caben en el presupuesto (solo se cuentan en el Inicio)
  const { Proyectosciudad, Alcanzables } = Pestana === 'inicio' ? Proyectosalcanzables.call(this, Estadoactual, Calculo) : { Proyectosciudad: [], Alcanzables: [] };
  const Desde = Alcanzables.length ? Math.min(...Alcanzables.map(Proyecto => Proyecto.Precioproyecto)) : 0;
  // La racha cuenta los días marcados y también los días que tienen ingresos o gastos con fecha
  const Rachadatos = Calcularracha([...(Estadoactual.Diasregistrados || []), ...Estadoactual.Registros.filter(Elemento => Elemento.Fecha).map(Elemento => Elemento.Fecha), ...Estadoactual.Egresosregistrados.filter(Elemento => Elemento.Fecha).map(Elemento => Elemento.Fecha)]);
  const Mesesfaltantes = Math.max(0, Math.ceil(Calculo.Faltatecho / Math.max(1, Estadoactual.Ahorromes)));
  // Con salario fijo no hay ventas del día que registrar: la meta de hoy solo aparece con ingresos variables o mixtos
  const Metavisible = Estadoactual.Tipo !== 'fijo';
  const Subsidiousado = Calculo.Subsidiotecho;
  const Primernombre = (Estadoactual.Nombre || '').trim().split(/\s+/)[0];

  return {
    Raizreferencia: this.Raizreferencia,
    Desplazamientoreferencia: this.Desplazamientoreferencia,
    Esoscuro: Oscuroactivo,
    Esclaro: !Oscuroactivo,
    Alternartema: () => Alternartemarapido.call(this),
    Esapp: this.Pantalla === 'app',
    Estilocontenedorapp: Pestana === 'ofertas' ? 'es-detalle' : '',
    Mostrarbarrasuperior: Pestana !== 'ofertas',
    Tienehoja: this.Pantalla === 'app' && Boolean(Estadoactual.Hoja),
    Hojafondovisible: (this.Pantalla === 'app' && Estadoactual.Hoja) ? 'block' : 'none',
    Mostrarbarra: this.Pantalla === 'app' && !Estadoactual.Ayuda && !Estadoactual.Panel && Pestana !== 'ofertas',
    Esbienvenidaingreso: this.Pantalla === 'splash' || this.Pantalla === 'login',
    Esmodoportada: this.Pantalla === 'splash' && !Estadoactual.Portadarecogida,
    Bienvenidaclase: (this.Pantalla === 'splash' && !Estadoactual.Portadarecogida) ? 'is-splash' : 'is-login',
    Tocarportada: () => {
      if (this.Pantalla === 'splash' && !Estadoactual.Portadarecogida) {
        this.Cambiarestado({ Portadaentrando: true, Portadarecogida: true, Pantalla: 'login' });
      }
    },
    Esingreso: this.Pantalla === 'login' || Boolean(Estadoactual.Portadarecogida),
    Esportada: this.Pantalla === 'splash' && !Estadoactual.Portadarecogida,
    Saltarportada: () => {
      this.Cambiarestado({ Portadaentrando: true, Portadarecogida: true, Pantalla: 'login' });
    },
    Portadalogomovimiento: Estadoactual.Portadaentrando ? 'scale(1)' : 'scale(.8)',
    Portadalogoopacidad: Estadoactual.Portadaentrando ? 1 : 0,
    Portadatextoopacidad: Estadoactual.Portadaentrando ? 1 : 0,
    Portadatextomovimiento: Estadoactual.Portadaentrando ? 'translateY(0)' : 'translateY(14px)',
    Portadafranja: Estadoactual.Portadaentrando ? 'scaleX(1)' : 'scaleX(0)',
    Estadofondo: this.Pantalla === 'splash' || this.Pantalla === 'login' ? '#1E345B' : 'var(--bg)',
    Estadotinta: this.Pantalla === 'splash' || this.Pantalla === 'login' ? '#F4F6FB' : 'var(--ik)',
    Correoabierto: Boolean(Estadoactual.Correoabierto),
    Correocerrado: !Estadoactual.Correoabierto,
    Noesmodorecuperar: Estadoactual.Ingresomodo !== 'recover',
    Esmodorecuperar: Estadoactual.Ingresomodo === 'recover',
    Esmodoingreso: (!Estadoactual.Ingresomodo || Estadoactual.Ingresomodo === 'login'),
    Esmodoregistro: Estadoactual.Ingresomodo === 'register',
    Ingresotabclase: (!Estadoactual.Ingresomodo || Estadoactual.Ingresomodo === 'login') ? 'is-activa' : '',
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
          } catch (Elemento) {
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
        // El nombre que la persona escribió al registrarse queda guardado en su cuenta de Supabase
        const Datoscuenta = (Resultado.datos && Resultado.datos.user && Resultado.datos.user.user_metadata) || {};
        this.Iniciarsesionusuario(Correo, Limpiarnombre(Datoscuenta.nombre || ''), Perfilfila, Resultado.datos && Resultado.datos.user && Resultado.datos.user.app_metadata);
      } else {
        const Falla = Resultado.error || '';
        const Mensaje = Resultado.codigo === 'email_not_confirmed'
          ? 'Por favor revisa tu correo y confirma tu cuenta con el enlace que te enviamos antes de entrar.'
          : (Falla.includes('invalid_grant') || Falla.includes('credentials')
            ? 'Correo o contraseña incorrectos. Si no tienes cuenta, selecciona "Registrarme".'
            : (Resultado.offline ? Resultado.error : 'No se pudo iniciar sesión, intenta de nuevo.'));
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
          this.Aviso('¡Bienvenido! Tu cuenta ha sido creada exitosamente.');
          return;
        }
        this.Cambiarestado({
          Correo,
          Nombre,
          Ingresomodo: 'login',
          Ingresoclave: '',
          Ingresoclaveconfirmar: '',
          Ingresoexitomensaje: 'Te enviamos un correo de confirmación. Por favor revisa tu bandeja de entrada para verificar tu cuenta y luego regresa a la app para iniciar sesión.'
        });
        this.Aviso('Revisa tu correo para confirmar tu cuenta.');
      } else {
        const Mensaje = (Resultado.error && Resultado.error.includes('already registered'))
          ? 'Este correo ya está registrado. Selecciona "Iniciar sesión" para entrar.'
          : (Resultado.offline ? Resultado.error : 'No se pudo crear la cuenta, intenta de nuevo.');
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
          Ingresoexitomensaje: 'Si este correo está registrado en MiTecho, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada o spam.'
        });
        this.Aviso('Solicitud procesada.');
      } else {
        this.Cambiarestado({ Ingresoerror: Resultado.offline ? Resultado.error : 'No se pudo enviar el correo de recuperación. Intenta nuevamente.' });
      }
    },
    Pestanaes,
    Pestanair,
    Pestanaclase,
    Pestanaactual,
    Saludotitulo: Primernombre ? 'Hola, ' + Primernombre : 'Hola',
    Abrirayuda: () => this.Cambiarestado({ Ayuda: true, Menu: false }),
    // Presupuesto: lo que presta el banco y lo que pone la persona (cuota inicial, con el subsidio si aplica)
    Heroebancopeso: Tienetecho ? Math.round(Calculo.Creditotecho / Calculo.Preciotecho * 1000) : 0,
    Heroepropiopeso: Tienetecho ? 1000 - Math.round(Calculo.Creditotecho / Calculo.Preciotecho * 1000) : 0,
    Heroepropiomillones: '$' + Formatomillones(Math.max(0, Calculo.Preciotecho - Calculo.Creditotecho)) + ' M',
    Heroepropionota: (Tienetecho ? 100 - Math.round(Calculo.Creditotecho / Calculo.Preciotecho * 100) : 0) + '% · cuota inicial',
    Heroesubsidiotexto: 'Tu subsidio ' + (Calculo.Subsidiomicasayasalarios ? 'de Caja y Mi Casa Ya' : 'de Caja') + ' cubre $' + Formatomillones(Subsidiousado) + ' M de esa cuota inicial.',
    // Ahorro para comprar: lo que pide el presupuesto (cuota inicial, notaría y registro) frente a lo que ya hay
    Ahorroporcentaje,
    Ahorroporcentajetexto: Ahorroporcentaje + '%',
    Ahorroancho: Ahorroporcentaje + '%',
    Ahorroprogresoetiqueta: 'Llevas el ' + Ahorroporcentaje + '% del ahorro que necesitas',
    Ahorroconmonto: Tienetecho,
    Ahorrotienes: '$' + Formatomillones(Tieneahorro) + ' M',
    Ahorronecesario: '$' + Formatomillones(Necesariotecho) + ' M',
    Ahorroconfalta: Tienetecho && Calculo.Faltatecho > 0,
    Ahorrofaltamonto: '$' + Formatomillones(Calculo.Faltatecho) + ' M',
    Ahorrofaltaresto: Estadoactual.Ahorromes > 0 ? ': unos ' + Formatearmeses(Mesesfaltantes) + ' si ahorras ' + Formatoenteropesos(Estadoactual.Ahorromes) + ' al mes.' : '. Escribe en tu perfil cuánto puedes ahorrar al mes y te decimos en cuánto tiempo llegas.',
    Ahorroconaviso: !Tienetecho || Calculo.Faltatecho <= 0,
    Ahorroaviso: !Tienetecho ? (Calculo.Ingresototal > 0 ? 'Tus cuotas de deudas se llevan todo tu ingreso, así el banco no te presta. Cada cuota que termines de pagar sube tu presupuesto.' : 'Completa tus ingresos en tu perfil para calcular tu presupuesto.') : 'Ya tienes la cuota inicial y los gastos de notaría y registro.',
    Irplanahorro: () => this.Cambiarestado({ Pestana: 'plan' }),
    // Meta de hoy y racha de días registrando
    Metahoy: Formatoenteropesos(Totalhoy),
    Metaporcentaje,
    Metaprogresoetiqueta: 'Llevas el ' + Metaporcentaje + '% de tu meta de hoy',
    Rachatexto: Rachadatos.Seguidos === 0 ? 'Empieza hoy tu racha: registra lo que ganes.' : Rachadatos.Seguidos === 1 ? 'Llevas 1 día registrando.' : 'Llevas ' + Rachadatos.Seguidos + ' días seguidos registrando.',
    // Los precios de los proyectos van en millones redondos, como en la lista de viviendas
    Viviendasresumen: Alcanzables.length ? Alcanzables.length + (Alcanzables.length === 1 ? ' proyecto de referencia desde $' : ' proyectos de referencia desde $') + Math.round(Desde / 1e6).toLocaleString('es-CO') + ' M'
      : Proyectosciudad.length ? 'Mira los proyectos de referencia en ' + Estadoactual.Ciudad : 'Mira proyectos de referencia en otras ciudades',
    Irofertas: () => this.Cambiarestado({ Pestana: 'ofertas' }),
    Preciodestacado: Formatomillones(Mostrado),
    Creditomillones: '$' + Formatomillones(Calculo.Creditotecho) + ' M',
    Financiacionancho: (Calculo.Creditotecho / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Porcentajefinanciado: Math.round(Calculo.Creditotecho / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Tienesubsidio: Subsidiousado > 0,
    Cuotainicialmillones: '$' + Formatomillones(Calculo.Cuotainicialtecho) + ' M',
    Cuotainicialparte: Math.round(Calculo.Cuotainicialtecho / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Preciohoymillones: '$' + Formatomillones(Calculo.Preciohoy) + ' M',
    Limiteahorro: Calculo.Limiteahorro,
    Metaancho: Math.min(100, Totalhoy / Math.max(1, Calculo.Metadiaria) * 100) + '%',
    Metavisible,
    Tieneefectivo: Efectivopendiente > 0,
    Efectivomensaje: Formatoenteropesos(Efectivopendiente) + ' en efectivo sin consignar. El banco no los ve.',
    Iringresos: () => this.Cambiarestado({ Pestana: 'ingresos', Ingresovista: 'dia' }),
    Irsimulador: () => this.Cambiarestado({ Pestana: 'simulador', Simuladorpaso: 'form' }),
    Irresultado: () => this.Cambiarestado({ Pestana: 'simulador', Simuladorpaso: 'result' }),
    Irdeudas: () => this.Cambiarestado({ Panel: 'deudas', Menu: false }),
    Irperfil: () => this.Cambiarestado({ Panel: 'perfil' }),
    Avisomensaje: Estadoactual.Aviso,
    Avisodesplazamiento: Estadoactual.Avisovisible ? 'translateY(0)' : 'translateY(-140%)',
    Avisoopacidad: Estadoactual.Avisovisible ? 1 : 0
  };
}

