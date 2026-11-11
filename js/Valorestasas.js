// Sección "Tasas por banco" (MiTecho Pro): compara la cuota del usuario con la tasa promedio de cada entidad
// según la Superintendencia Financiera. Muestra poco a primera vista y el detalle solo al tocar una entidad.

const Productostasas = ['vis_pesos', 'novis_pesos', 'vis_uvr', 'novis_uvr', 'leasing_novis_pesos', 'leasing_vis_pesos'];

// Cuota fija mensual de un crédito con tasa efectiva anual
function Cuotaconcredito(Credito, Tasaanual, Meses) {
  const Mensual = Math.pow(1 + Tasaanual, 1 / 12) - 1;
  if (!(Credito > 0) || !(Meses > 0)) return 0;
  return Mensual > 0 ? Credito * Mensual / (1 - Math.pow(1 + Mensual, -Meses)) : Credito / Meses;
}

// Cuánto prestaría la entidad con la cuota máxima del usuario a esa tasa
function Creditoconcuota(Cuota, Tasaanual, Meses) {
  const Mensual = Math.pow(1 + Tasaanual, 1 / 12) - 1;
  return Mensual > 0 ? Cuota * (1 - Math.pow(1 + Mensual, -Meses)) / Mensual : Cuota * Meses;
}

// Lee "13,5" o "13.5" como 0,135; devuelve null si no es una tasa razonable
function Leertasaescrita(Texto) {
  const Numero = parseFloat(String(Texto || '').replace(',', '.').replace(/[^\d.]/g, ''));
  return Numero > 0 && Numero < 40 ? Numero / 100 : null;
}

function Generarvalorestasas(Calculo, Seleccion) {
  const Estadoactual = this.Estadocomponente;
  const Espro = Boolean(Estadoactual.Pro);
  const Modo = Estadoactual.Tasasmodo === 'oferta' ? 'oferta' : 'perfil';
  const Disponibles = Productostasas.filter(Clave => Entidadesdelproducto(Clave).Entidades.length);
  const Elegido = Estadoactual.Tasasproducto && Disponibles.includes(Estadoactual.Tasasproducto)
    ? Estadoactual.Tasasproducto : Productosimulador(Estadoactual.Modalidadelegida, Estadoactual.Tasatipo);
  const Datos = Entidadesdelproducto(Elegido);
  const Meses = Math.round(Calculo.Plazo * 12);
  const Credito = Calculo.Creditotecho;
  const Esuvr = Elegido.endsWith('_uvr');

  // Posición de cada tasa en la barra: de la más baja a la más alta del producto
  const Tasas = Datos.Entidades.map(Entidad => Entidad.Tasa).concat(Datos.Mercado ? [Datos.Mercado] : []);
  const Piso = Math.min(...Tasas), Techo = Math.max(...Tasas);
  const Posicion = (Tasa) => (Techo > Piso ? (Tasa - Piso) / (Techo - Piso) * 100 : 50).toFixed(1) + '%';

  const Filas = Datos.Entidades.map(Entidad => ({ ...Entidad, Cuota: Cuotaconcredito(Credito, Entidad.Tasa, Meses) })).sort((Una, Otra) => Una.Cuota - Otra.Cuota);
  const Masbaja = Filas.length ? Filas[0].Cuota : 0;
  const Abierta = Estadoactual.Tasasabierta || '';

  const Oferta = Leertasaescrita(Estadoactual.Tasasoferta);
  const Cuotaoferta = Oferta ? Cuotaconcredito(Credito, Oferta, Meses) : 0;
  const Cuotamercado = Datos.Mercado ? Cuotaconcredito(Credito, Datos.Mercado, Meses) : 0;
  const Diferenciaoferta = Oferta && Datos.Mercado ? (Oferta - Datos.Mercado) * 100 : 0;

  return {
    Estasas: this.Pantalla === 'app' && Estadoactual.Panel === 'tasas',
    Abrirtasas: () => this.Cambiarestado({ Panel: 'tasas', Menu: false }),
    Tasasdisponibles: Disponibles.length > 0,
    Tasasentidadescantidad: String(new Set(Productostasas.flatMap(Clave => Entidadesdelproducto(Clave).Entidades.map(Entidad => Entidad.Nombre))).size),
    Tasasinicioicono: Espro ? '→' : 'PRO',
    Tasassindatos: Disponibles.length === 0,
    Tasasfuente: Datos.Hasta ? 'Superintendencia Financiera · del ' + Datos.Desde + ' al ' + Datos.Hasta : 'Superintendencia Financiera',
    // Sin Pro se ve la lista difuminada, sin poder tocarla, con la invitación encima
    Tasassinpro: !Espro && Disponibles.length > 0,
    Tasasdesenfoque: Espro ? 'none' : 'blur(6px)',
    Tasaseventos: Espro ? 'auto' : 'none',
    Abrirprodesdetasas: () => this.Abrirpro('Tasas por banco es parte de MiTecho Pro.'),
    Tasasmodos: [['perfil', 'Con mi perfil'], ['oferta', 'Comparar una oferta']].map(([Clave, Etiqueta]) => ({ Etiqueta, ...Seleccion(Modo === Clave), Alclic: () => this.Cambiarestado({ Tasasmodo: Clave }) })),
    Tasasmodoperfil: Modo === 'perfil',
    Tasasmodooferta: Modo === 'oferta',
    Tasasproductos: Disponibles.map(Clave => ({ Etiqueta: Nombreproducto(Clave), ...Seleccion(Clave === Elegido), Alclic: () => this.Cambiarestado({ Tasasproducto: Clave, Tasasabierta: '' }) })),
    Tasasresumen: Credito > 0
      ? Nombreproducto(Elegido) + ' · ' + Math.round(Calculo.Plazo) + ' años · crédito ' + '$' + Formatomillones(Credito) + ' M'
      : 'Completa tus ingresos en tu perfil financiero para calcular tu cuota.',
    Tasasorden: Esuvr ? 'Ordenado por cuota inicial estimada · en UVR la cuota sube con la inflación' : 'Ordenado por cuota estimada',
    Tasasfilas: Filas.map(Fila => {
      const Expandida = Abierta === Fila.Nombre;
      const Diferencia = Fila.Cuota - Masbaja;
      return {
        Nombre: Fila.Nombre,
        Cuota: Credito > 0 ? Formatoenteropesos(Fila.Cuota) : '—',
        Tasa: Formatoporcentaje(Fila.Tasa) + (Esuvr ? ' + UVR' : ' E.A.'),
        Punto: Posicion(Fila.Tasa),
        Marca: Fila.Pocosdatos ? 'Pocos datos' : Fila.Sinreporte ? 'Sin datos recientes' : '',
        Tienemarca: Fila.Pocosdatos || Fila.Sinreporte,
        Expandida,
        Abiertaetiqueta: Expandida ? 'true' : 'false',
        Alternar: () => this.Cambiarestado({ Tasasabierta: Expandida ? '' : Fila.Nombre }),
        Rango: 'De ' + Formatoporcentaje(Fila.Minima) + ' a ' + Formatoporcentaje(Fila.Maxima),
        Creditos: Fila.Creditos.toLocaleString('es-CO') + ' créditos en la ventana',
        Prestamo: Credito > 0 ? Formatoenteropesos(Creditoconcuota(Calculo.Capacidadcuota, Fila.Tasa, Meses)) : '—',
        Total: Credito > 0 ? Formatoenteropesos(Fila.Cuota * Meses) : '—',
        Comparacion: Diferencia < 1 ? 'Es la cuota más baja de la lista' : '+' + Formatoenteropesos(Diferencia) + ' al mes frente a la más baja'
      };
    }),
    Tasasmercadopunto: Datos.Mercado ? Posicion(Datos.Mercado) : '50%',
    Tasasmercadotexto: Datos.Mercado ? 'Promedio del mercado: ' + Formatoporcentaje(Datos.Mercado) + (Esuvr ? ' + UVR' : ' E.A.') : '',
    Tasasofertavalor: Estadoactual.Tasasoferta || '',
    Escribirtasaoferta: (Elemento) => this.Cambiarestado({ Tasasoferta: String(Elemento.target.value || '').replace(/[^\d,.]/g, '').slice(0, 6) }),
    Tasasofertalista: Boolean(Oferta && Datos.Mercado && Credito > 0),
    Tasasofertapunto: Oferta ? (Techo > Piso ? Math.min(100, Math.max(0, (Oferta - Piso) / (Techo - Piso) * 100)) : 50).toFixed(1) + '%' : '50%',
    Tasasofertacuota: Formatoenteropesos(Cuotaoferta),
    Tasasofertamensaje: !Oferta ? '' : Math.abs(Diferenciaoferta) < 0.05
      ? 'Tu oferta está en el promedio del mercado.'
      : ('Tu oferta está ' + Math.abs(Diferenciaoferta).toFixed(2).replace('.', ',') + ' puntos ' + (Diferenciaoferta < 0 ? 'por debajo' : 'por encima') + ' del promedio: ')
        + Formatoenteropesos(Math.abs(Cuotaoferta - Cuotamercado)) + (Diferenciaoferta < 0 ? ' menos' : ' más') + ' al mes que con la tasa promedio.',
    Tasasavisooficial: 'Promedio ponderado de créditos desembolsados por la entidad entre el ' + (Datos.Desde || '—') + ' y el ' + (Datos.Hasta || '—') + ', reportado a la Superintendencia Financiera (Formato 414). No es una oferta ni garantiza aprobación.',
    Tasasavisocuota: 'Cuota estimada sin seguros. La tasa de cada persona puede alejarse 1 a 2 puntos del promedio según el estudio de la entidad.' + (Esuvr ? ' En UVR la cifra es el margen sobre la UVR: la cuota sube con la inflación.' : '')
  };
}
