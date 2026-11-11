// Preparación de los datos de inicio de sesión, pantalla principal, racha diaria y avance de ahorro

// Aviso cuando el techo pasa el tope VIS: a ese precio la vivienda ya sería No VIS
function Avisotopevis(Calculo, Ciudad) {
  return 'Tu techo pasa el tope VIS de ' + (Ciudad || 'tu ciudad') + ' (' + Calculo.Topevissalarios + ' SMMLV = ' + Formatoenteropesos(Calculo.Topevis) + '). A ese precio la vivienda sería No VIS: el banco financia hasta el 70% y no aplica subsidio. Si buscas VIS, tu tope es ' + Formatoenteropesos(Calculo.Topevis) + '.';
}

function Generarvaloresinicio(Calculo, Configuracion, Seleccion, Oscuroactivo) {
  const Estadoactual = this.Estadocomponente, Pestana = this.Pestana;
  const Mostrado = Estadoactual.Mostrado ?? Calculo.Preciotecho;
  const Pestanas = ['inicio', 'ingresos', 'simulador', 'plan', 'ofertas'];
  const Pestanaes = {}, Pestanafondo = {}, Pestanatexto = {}, Pestanair = {};
  Pestanas.forEach(Auxiliar => {
    Pestanaes[Auxiliar] = Pestana === Auxiliar;
    Pestanafondo[Auxiliar] = Pestana === Auxiliar ? 'var(--ac)' : 'transparent';
    Pestanatexto[Auxiliar] = Pestana === Auxiliar ? 'var(--oa)' : 'var(--di)';
    Pestanair[Auxiliar] = () => this.Cambiarestado({
      Pestana: Auxiliar,
      Simuladorpaso: Auxiliar === 'simulador' ? (Estadoactual.Simuladorpaso || 'form') : Estadoactual.Simuladorpaso,
      ...(Auxiliar === 'ingresos' ? { Ingresovista: Estadoactual.Ingresovista || 'dia', Registrotipo: Estadoactual.Registrotipo || 'ing' } : {})
    });
  });
  Pestanaes.simForm = Pestana === 'simulador' && (Estadoactual.Simuladorpaso || 'form') === 'form';
  Pestanaes.simResult = Pestana === 'simulador' && Estadoactual.Simuladorpaso === 'result';

  const Totalhoy = Sumamontos(Registrosdeldia(Estadoactual.Registros, Hoyregistro()));
  const Efectivopendiente = Estadoactual.Registros.filter(Elemento => !Elemento.Consignado).filter(Elemento => Elemento.Medio === 'Efectivo').reduce((Acumulado, Elemento) => Acumulado + Elemento.Monto, 0) + Estadoactual.Efectivoanterior;
  // Lo que pide el techo (cuota inicial y gastos) frente a lo que ya tiene el hogar (ahorro y subsidio que aplica a ese techo)
  const Necesariotecho = Calculo.Cuotainicialtecho + (Estadoactual.Financiargastos ? 0 : Calculo.Gastostecho);
  const Cuotainicialporcentaje = Necesariotecho > 0 ? Math.min(1, (Necesariotecho - Calculo.Faltatecho) / Necesariotecho) : 0;
  // La racha cuenta los días marcados y también los días que tienen ingresos o gastos con fecha
  const Rachadatos = Calcularracha([...(Estadoactual.Diasregistrados || []), ...Estadoactual.Registros.filter(Elemento => Elemento.Fecha).map(Elemento => Elemento.Fecha), ...Estadoactual.Egresosregistrados.filter(Elemento => Elemento.Fecha).map(Elemento => Elemento.Fecha)]);
  const Mesesfaltantes = Math.max(0, Math.ceil(Calculo.Faltatecho / Math.max(1, Estadoactual.Ahorromes)));
  const Subsidiousado = Calculo.Subsidiotecho;
  const Propio = Math.max(0, Calculo.Cuotainicialtecho - Subsidiousado);
  const Salariosminimos = Calculo.Salariosminimos;
  const Potencialsalarios = Estadoactual.Caja ? 0 : Salariosminimos <= 2 ? 30 : Salariosminimos <= 4 ? 20 : 0;
  const Subsidiosalarios = Calculo.Subsidiocajasalarios + Calculo.Subsidiomicasayasalarios;
  const Mostrarafiliacion = !Estadoactual.Caja && Estadoactual.Tipo !== 'fijo' && Salariosminimos < 4;

  return {
    Raizreferencia: this.Raizreferencia,
    Desplazamientoreferencia: this.Desplazamientoreferencia,
    Esoscuro: Oscuroactivo,
    Esclaro: !Oscuroactivo,
    Alternartema: () => this.Cambiarestado({ Temaelegido: Oscuroactivo ? 'claro' : 'oscuro' }),
    Esapp: this.Pantalla === 'app',
    Tienehoja: this.Pantalla === 'app' && Boolean(Estadoactual.Hoja),
    Hojavisible: (this.Pantalla === 'app' && Estadoactual.Hoja) ? 'flex' : 'none',
    Hojafondovisible: (this.Pantalla === 'app' && Estadoactual.Hoja) ? 'block' : 'none',
    Mostrarbarra: this.Pantalla === 'app' && !Estadoactual.Ayuda && !Estadoactual.Panel,
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
    Ingresopestanafondo: (!Estadoactual.Ingresomodo || Estadoactual.Ingresomodo === 'login') ? 'var(--ac)' : 'transparent',
    Ingresopestanacolor: (!Estadoactual.Ingresomodo || Estadoactual.Ingresomodo === 'login') ? 'var(--oa)' : 'var(--mu)',
    Registropestanafondo: Estadoactual.Ingresomodo === 'register' ? 'var(--ac)' : 'transparent',
    Registropestanacolor: Estadoactual.Ingresomodo === 'register' ? 'var(--oa)' : 'var(--mu)',
    Claveejemplo: Estadoactual.Ingresomodo === 'register' ? 'Contraseña (mínimo 6 caracteres)' : 'Contraseña',
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
    Pestanafondo,
    Pestanatexto,
    Pestanair,
    Preciodestacado: Formatomillones(Mostrado),
    Modalidadetiqueta: Configuracion.Etiquetanodo,
    Creditomillones: '$' + Formatomillones(Calculo.Creditotecho) + ' M',
    Capacidadcuotamillones: '$' + Formatomillones(Calculo.Capacidadcuota) + ' M',
    Ingresobase: 'Con ingresos de $' + Formatomillones(Calculo.Ingresototal) + ' M al mes',
    Financiacionancho: (Calculo.Creditotecho / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Porcentajefinanciado: Math.round(Calculo.Creditotecho / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Subsidioancho: (Subsidiousado / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Propioporcentaje: Math.round(Propio / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Propiomillones: '$' + Formatomillones(Propio) + ' M',
    Tienesubsidio: Subsidiousado > 0,
    Subsidiomillones: '$' + Formatomillones(Subsidiousado) + ' M',
    Subsidioetiqueta: Calculo.Subsidiomicasayasalarios ? 'Caja + Mi Casa Ya' : 'de Caja',
    Cuotainicialtituloplan: 'Cuota inicial y gastos',
    Cuotainicialproporcion: '$' + Formatomillones(Necesariotecho - Calculo.Faltatecho) + ' M / $' + Formatomillones(Necesariotecho) + ' M',
    Techotopevisvisible: Calculo.Techosobretopevis,
    Techotopevismensaje: Calculo.Techosobretopevis ? Avisotopevis(Calculo, Estadoactual.Ciudad) : '',
    Cuotainicialbarraancho: (Cuotainicialporcentaje * 100) + '%',
    Cuotainicialporcentaje: Math.round(Cuotainicialporcentaje * 100) + '%',
    Cuotainicialmeses: !Calculo.Preciotecho ? 'Completa tus ingresos en tu perfil financiero para calcular tu techo.' : Mesesfaltantes ? (Estadoactual.Ahorromes ? 'Te faltan ' + Mesesfaltantes + ' meses ahorrando ' + Formatoenteropesos(Estadoactual.Ahorromes) + ' al mes.' : 'Te faltan ' + Formatoenteropesos(Calculo.Faltatecho) + '. Define tu ahorro mensual en el perfil.') : 'Ya tienes tu cuota inicial completa.',
    Cuotainicialmillones: '$' + Formatomillones(Calculo.Cuotainicialtecho) + ' M',
    Cuotainicialparte: Math.round(Calculo.Cuotainicialtecho / Math.max(1, Calculo.Preciotecho) * 100) + '%',
    Preciohoymillones: '$' + Formatomillones(Calculo.Preciohoy) + ' M',
    Limiteahorro: Calculo.Limiteahorro,
    // Racha real: un cuadro por cada uno de los últimos 14 días, lleno si ese día registró un ingreso o un gasto
    Racha: Rachadatos.Cuadros.map(Cuadro => ({ Fondo: Cuadro.Lleno ? 'var(--ac)' : Cuadro.Eshoy ? 'var(--ad)' : 'var(--dm)' })),
    Rachaetiqueta: Rachadatos.Seguidos === 0 ? 'Empieza hoy' : Rachadatos.Seguidos + (Rachadatos.Seguidos === 1 ? ' día' : ' días'),
    Metaancho: Math.min(100, Totalhoy / Math.max(1, Calculo.Metadiaria) * 100) + '%',
    Tieneefectivo: Efectivopendiente > 0,
    Efectivomensaje: Formatoenteropesos(Efectivopendiente) + ' en efectivo sin consignar. El banco no los ve.',
    Mostrarafiliacion,
    Afiliacioncorto: 'Afíliate a una Caja y podrías recibir ' + Formatoenteropesos(Potencialsalarios * Salariominimo) + ' de subsidio.',
    Sensibilidadmillones: '$' + Formatomillones(Calculo.Sensibilidad) + ' M',
    Iringresos: () => this.Cambiarestado({ Pestana: 'ingresos', Ingresovista: 'dia' }),
    Irsimulador: () => this.Cambiarestado({ Pestana: 'simulador', Simuladorpaso: 'form' }),
    Irresultado: () => this.Cambiarestado({ Pestana: 'simulador', Simuladorpaso: 'result' }),
    Irplan: () => this.Cambiarestado({ Pestana: 'plan' }),
    Irperfil: () => this.Cambiarestado({ Panel: 'perfil' }),
    Avisomensaje: Estadoactual.Aviso,
    Avisodesplazamiento: Estadoactual.Avisovisible ? 'translateY(0)' : 'translateY(-140%)',
    Avisoopacidad: Estadoactual.Avisovisible ? 1 : 0
  };
}

