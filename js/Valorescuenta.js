// Borrar la cuenta de verdad (celular y nube) y mandar la copia de los datos al correo de la persona

// Todo lo que la app guarda en el celular, menos la foto, que pesa mucho para ir en un correo
function Datoslocalesexportables(Estado) {
  const Copia = {};
  Camposalmacenados.forEach(Clave => {
    if (Clave !== 'Avatarimagen' && Estado[Clave] !== undefined) Copia[Clave] = Estado[Clave];
  });
  return Copia;
}

function Generarvalorescuenta() {
  const Estadoactual = this.Estadocomponente;
  const Ocupado = Boolean(Estadoactual.Eliminacionocupado);
  const Exportando = Boolean(Estadoactual.Exportacionocupado);

  return {
    Tieneeliminacion: this.Pantalla === 'app' && Boolean(Estadoactual.Eliminacionabierta),
    Eliminacionpro: Boolean(Estadoactual.Pro),
    Eliminacionerror: Estadoactual.Eliminacionerror || '',
    Eliminacionbotontexto: Ocupado ? 'Borrando tu cuenta…' : 'Sí, borrar mi cuenta',
    Perfileliminar: () => this.Cambiarestado({ Eliminacionabierta: true, Eliminacionerror: '' }),
    Cancelareliminacion: () => {
      if (!Ocupado) this.Cambiarestado({ Eliminacionabierta: false, Eliminacionerror: '' });
    },
    Confirmareliminacion: async () => {
      if (Ocupado) return;
      this.Cambiarestado({ Eliminacionocupado: true, Eliminacionerror: '' });
      const Resultado = await Eliminarcuentaapi();
      if (!Resultado.ok) {
        const Mensaje = Resultado.estado === 401
          ? 'Tu sesión venció. Cierra sesión, vuelve a entrar y repite el borrado.'
          : (Resultado.error || 'No pudimos borrar tu cuenta en este momento, intenta de nuevo.');
        this.Cambiarestado({ Eliminacionocupado: false, Eliminacionerror: Mensaje });
        return;
      }
      // La nube ya quedó limpia; ahora se borra lo del celular sin volver a guardar nada al cerrar sesión
      Borrardatosalmacenados(Estadoactual.Correo);
      this.Cambiarestado({ Eliminacionabierta: false, Eliminacionocupado: false });
      this.Cerrarsesionusuario(true);
      this.Aviso('Tu cuenta y tus datos fueron borrados.');
    },
    Perfilexportartexto: Exportando ? 'Enviando tus datos…' : 'Enviar mis datos a mi correo',
    Perfilexportar: async () => {
      if (Exportando) return;
      this.Cambiarestado({ Exportacionocupado: true });
      const Resultado = await Exportardatosapi(Datoslocalesexportables(Estadoactual));
      this.Cambiarestado({ Exportacionocupado: false });
      if (Resultado.ok) {
        this.Aviso('Te enviamos la copia de tus datos a ' + ((Resultado.datos && Resultado.datos.correo) || Estadoactual.Correo || 'tu correo') + '.');
        return;
      }
      this.Aviso(Resultado.estado === 401 ? 'Tu sesión venció. Vuelve a iniciar sesión para pedir tus datos.' : (Resultado.error || 'No pudimos enviar tus datos, intenta de nuevo.'));
    }
  };
}
