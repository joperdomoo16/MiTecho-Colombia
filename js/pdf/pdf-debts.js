// Acciones de deudas, desbloqueo del reporte PDF y conexión con alarmas nativas de Android

function Sincronizarefectivonativo(Componente, Recordatoriosguardados) {
  if (!window.Puentenativo || typeof window.Puentenativo.actualizarEstadoEfectivo !== 'function') return;
  const Registros = Componente.Estadocomponente.Registros || [];
  const Recordatorios = Recordatoriosguardados || Componente.Estadocomponente.Recordatorios || {};
  const Efectivopendiente = Registros
    .filter(Registro => !Registro.Consignado && Registro.Medio === 'Efectivo')
    .reduce((Suma, Registro) => Suma + (Registro.Monto || 0), 0) + (Componente.Estadocomponente.Efectivoanterior || 0);
  window.Puentenativo.actualizarEstadoEfectivo(Recordatorios.Efectivo !== false && Efectivopendiente > 0);
}

function Conectarnotificacionesandroid(Componente, Guardado) {
  const Abrirmovimientos = () => {
    Componente.Cambiarestado({
      Pantalla: 'app',
      Pestana: 'ingresos',
      Ingresovista: 'dia',
      Menu: false,
      Ayuda: false,
      Hoja: false,
      Registrotipo: 'ing',
      Diaseleccionado: 6,
      Panel: null
    });
  };

  window.Volveratrasapp = () => Componente.Manejadorbotonatras();
  window.Abrirdestinonotificacion = (Destino) => {
    if (Destino === 'ingresos') Abrirmovimientos();
  };

  if (!window.Puentenativo) return;
  if (typeof window.Puentenativo.obtenerDestinoPendiente === 'function') {
    const Destinopendiente = window.Puentenativo.obtenerDestinoPendiente();
    if (Destinopendiente === 'ingresos') {
      setTimeout(Abrirmovimientos, 600);
    }
  }
  const Recordatorios = (Guardado && Guardado.Recordatorios) || Componente.Estadocomponente.Recordatorios || {};
  if (typeof window.Puentenativo.programarRecordatorioRacha === 'function') {
    window.Puentenativo.programarRecordatorioRacha(Recordatorios.Diario !== false, Recordatorios.Hora || '20:00');
  }
  Sincronizarefectivonativo(Componente, Recordatorios);
}

function Editardeudaactiva(Identificador) {
  const Deuda = this.Estadocomponente.Deudas.find(Opcion => Opcion.id === Identificador);
  if (!Deuda) return;
  const Partes = Deuda.Nombreitem.split(' · ');
  const Nombrebase = Partes[0];
  const Entidad = Partes[1] || '';
  const Tipocoincide = Tiposdeuda.find(Auxiliar => Auxiliar === Nombrebase || Nombrescortosdeuda[Auxiliar] === Deuda.Corto);
  const Tipo = Tipocoincide || (Tiposdeuda.includes(Nombrebase) ? Nombrebase : 'Otro egreso fijo');
  const Nombre = Tipo === 'Otro egreso fijo' ? Nombrebase : '';
  this.Cambiarestado({
    Hoja: true,
    Hojamenu: false,
    Hojafecha: null,
    Hojatipo: 'deuda',
    Hojafrecuencia: 'fijo',
    Deudaeditandoid: Identificador,
    Formulariodeuda: { Tipo, Cuota: Deuda.Cuota, Saldo: Deuda.Saldo || 0, Entidad: Deuda.Entidad || Entidad, Nombre },
    Formularioerror: ''
  });
}

function Eliminardeudaactiva(Identificador) {
  const Deuda = this.Estadocomponente.Deudas.find(Opcion => Opcion.id === Identificador);
  if (!Deuda) return;
  if (typeof window !== 'undefined' && window.confirm && !window.confirm('¿Eliminar la deuda “' + Deuda.Nombreitem + '”?')) return;
  this.Cambiarestado(Estadoprevio => ({
    Deudas: Estadoprevio.Deudas.filter(Opcion => Opcion.id !== Identificador),
    Hoja: Estadoprevio.Deudaeditandoid === Identificador ? false : Estadoprevio.Hoja,
    Deudaeditandoid: Estadoprevio.Deudaeditandoid === Identificador ? null : Estadoprevio.Deudaeditandoid
  }));
  this.Aviso('Deuda “' + Deuda.Nombreitem + '” eliminada.');
}

async function Desbloquearygenerarpdf() {
  if (this.Estadocomponente.Desbloqueadopdf) {
    this.Cambiarestado({ Reportelisto: true });
    Generarcertificadopdf(this.Estadocomponente, this.Calcular(), Mensaje => this.Aviso(Mensaje));
    return;
  }
  const Vistos = Number(this.Estadocomponente.Anunciospdf || 0);
  this.Aviso('Para descargar el reporte en PDF debes ver 3 videos cortos (llevas ' + Vistos + '/3). Cargando video…');
  const Resultado = typeof Verrecompensa === 'function' ? await Verrecompensa() : { ok: true };
  if (Resultado && Resultado.ok) {
    const Nuevoconteo = Vistos + 1;
    if (Nuevoconteo >= 3) {
      this.Cambiarestado({ Desbloqueadopdf: true, Anunciospdf: 3, Reportelisto: true });
      this.Aviso('Descarga de PDF desbloqueada.');
      Generarcertificadopdf(this.Estadocomponente, this.Calcular(), Mensaje => this.Aviso(Mensaje));
    } else {
      const Faltan = 3 - Nuevoconteo;
      this.Cambiarestado({ Anunciospdf: Nuevoconteo });
      this.Aviso('Video ' + Nuevoconteo + ' de 3 completado. Mira ' + Faltan + (Faltan === 1 ? ' video más' : ' videos más') + ' para descargar el PDF.');
    }
  } else {
    this.Aviso(Resultado && Resultado.error ? Resultado.error : 'No se pudo cargar el video. Intenta de nuevo.');
  }
}
