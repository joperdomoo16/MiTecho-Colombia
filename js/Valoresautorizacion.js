// Ventana que pide la autorización de tratamiento de datos (Ley 1581 de 2012) antes de usar la app.
// Sale la primera vez que la cuenta entra y otra vez si cambia la versión de la política.

// Debe ser la misma versión de supabase/functions/registrarlegal/index.ts y la que dice Politicadeprivacidad.html
const Versionpolitica = '1.2';
const Urlpolitica = 'https://mitecho-co.web.app/Politicadeprivacidad';
const Urlterminos = 'https://mitecho-co.web.app/Terminosdeuso';

function Generarvaloresautorizacion() {
  const Estadoactual = this.Estadocomponente;
  const Pendiente = Boolean(Estadoactual.Ingresado) && Estadoactual.Autorizacionversion !== Versionpolitica
    && !['login', 'splash'].includes(this.Pantalla);
  const Marcada = Boolean(Estadoactual.Autorizacionmarcada);
  const Ocupado = Boolean(Estadoactual.Autorizacionocupado);
  const Lista = Marcada && !Ocupado;

  return {
    Autorizacionvisible: Pendiente,
    Urlpolitica,
    Urlterminos,
    Autorizacionmarcadatexto: Marcada ? 'true' : 'false',
    Autorizacioncasillafondo: Marcada ? 'var(--ac)' : 'transparent',
    Autorizacioncasillaborde: Marcada ? 'var(--ac)' : 'var(--mu)',
    Autorizacioncasillasigno: Marcada ? '✓' : '',
    Autorizacionbotonfondo: Lista ? 'var(--ac)' : 'var(--c2)',
    Autorizacionbotoncolor: Lista ? 'var(--oa)' : 'var(--mu)',
    Autorizacionbotonbloqueado: Lista ? 'false' : 'true',
    Autorizacionbotontexto: Ocupado ? 'Guardando tu autorización…' : 'Autorizo y continúo',
    Autorizacionerror: Estadoactual.Autorizacionerror || '',
    Marcarautorizacion: () => {
      if (Ocupado) return;
      this.Cambiarestado({ Autorizacionmarcada: !Marcada, Autorizacionerror: '' });
    },
    Aceptarautorizacion: async () => {
      if (Ocupado) return;
      if (!Marcada) {
        this.Cambiarestado({ Autorizacionerror: 'Marca la casilla para confirmar que leíste y autorizas.' });
        return;
      }
      this.Cambiarestado({ Autorizacionocupado: true, Autorizacionerror: '' });
      const Resultado = await Registrarautorizacionapi();
      if (Resultado.ok && Resultado.datos && Resultado.datos.version) {
        this.Cambiarestado({ Autorizacionocupado: false, Autorizacionmarcada: false, Autorizacionversion: String(Resultado.datos.version) });
        this.Aviso('Gracias. Tu autorización quedó guardada.');
        return;
      }
      // Sin sesión válida no se puede guardar la prueba, así que toca volver a entrar
      if (Resultado.estado === 401) {
        this.Cambiarestado({ Autorizacionocupado: false, Autorizacionmarcada: false });
        this.Cerrarsesionusuario();
        this.Aviso('Tu sesión venció. Vuelve a iniciar sesión para continuar.');
        return;
      }
      this.Cambiarestado({ Autorizacionocupado: false, Autorizacionerror: Resultado.error || 'No pudimos guardar tu autorización, intenta de nuevo.' });
    },
    Rechazarautorizacion: () => {
      if (Ocupado) return;
      this.Cambiarestado({ Autorizacionmarcada: false, Autorizacionerror: '' });
      this.Cerrarsesionusuario();
      this.Aviso('Sin tu autorización no podemos guardar tus datos. Puedes volver cuando quieras.');
    }
  };
}
