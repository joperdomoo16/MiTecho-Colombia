// Preparación de los datos para pantallas secundarias, ventanas desplegables, recordatorios y metas

// [clave, nombre en la ficha, plazo que se le explica a la persona]
const Tipossoporte = [
  ['soporte', 'Soporte técnico', 'Fallas o preguntas sobre la app. Respondemos en máximo 15 días hábiles.'],
  ['consulta', 'Consulta de mis datos', 'Saber qué datos tenemos y cómo los usamos. Respondemos en máximo 10 días hábiles.'],
  ['reclamo', 'Reclamo sobre mis datos', 'Corregir, borrar o revocar tu autorización. Respondemos en máximo 15 días hábiles.']
];

const Numerosayuda = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidos'];

function Generarvaloresadicionales(Calculo, Configuracion, Seleccion, Contexto) {
const Estadoactual = this.Estadocomponente, Esuvr = Estadoactual.Tasatipo === 'uvr' && Estadoactual.Modalidadelegida !== 'leasing' && Calculo.Entidadclave !== 'caja';
    const Interruptor = (Activo) => ({ Riel: Activo ? 'var(--ac)' : 'var(--c2)', Perilla: Activo ? 'var(--oa)' : 'var(--mu)', Posicion: Activo ? 'translateX(22px)' : 'none' });
    const Factorcorto = Calculo.Factor.toLocaleString('es-CO', { maximumFractionDigits: 1 });
    const Tasaanualtexto = Formatoporcentaje(Calculo.Tasaanual) + (Esuvr ? ' + UVR' : ' E.A.');
    const Objetivoporcentaje = Calculo.Objetivo, Creditoobjetivo = Math.min(Calculo.Creditoporcapacidad, Objetivoporcentaje * Configuracion.Financiacion), Cuotainicialobjetivo = Objetivoporcentaje - Creditoobjetivo, Gastosobjetivo = Objetivoporcentaje * Configuracion.Gastos;
    const Totalobjetivo = Cuotainicialobjetivo + Gastosobjetivo, Faltaobjetivo = Math.max(0, Totalobjetivo - Calculo.Efectivo), Mensual = Faltaobjetivo / (Estadoactual.Cuotainicialplazo || 24);
    const Mesesritmo = Estadoactual.Ahorromes > 0 ? Math.ceil(Faltaobjetivo / Estadoactual.Ahorromes) : null;
    let Cierremensaje, Cierrelisto = false;
    if (Faltaobjetivo <= 0) { Cierremensaje = 'Ya tienes la cuota inicial y los gastos para esta vivienda.'; Cierrelisto = true; }
    else if (Estadoactual.Ahorromes >= Mensual) { Cierremensaje = 'Vas bien: ahorrando ' + Formatoenteropesos(Estadoactual.Ahorromes) + ' al mes llegas en ' + Mesesritmo + ' meses.'; Cierrelisto = true; }
    else Cierremensaje = (Estadoactual.Ahorromes > 0 ? 'Hoy ahorras ' + Formatoenteropesos(Estadoactual.Ahorromes) + ': te faltan ' + Formatoenteropesos(Mensual - Estadoactual.Ahorromes) + ' más al mes. A tu ritmo llegas en ' + Mesesritmo + ' meses.' : 'Aún no registras ahorro mensual. Defínelo en tu perfil.');
    const Salario = Estadoactual.Tipo === 'variable' ? 0 : Estadoactual.Fijo, Prima = Salario, Cesantias = Salario, Interescesantias = Cesantias * 0.12;
    const Anualfijovalor = Calculo.Fijopromedio * 12, Anualvariablevalor = Calculo.Variablepromedio * 12, Total = Anualfijovalor + Anualvariablevalor + Prima + Cesantias + Interescesantias;
    const Aporte = (Prima + Cesantias) * (Estadoactual.Anualporcentaje ?? 50) / 100;
    const Mesessin = Estadoactual.Ahorromes > 0 ? Math.ceil(Calculo.Faltatecho / Estadoactual.Ahorromes) : null, Mesconsignacion = (Estadoactual.Ahorromes + Aporte / 12) > 0 ? Math.ceil(Calculo.Faltatecho / (Estadoactual.Ahorromes + Aporte / 12)) : null;
    const Totalingreso = 1400 * Unidadtributaria, Topepatrimonio = 4500 * Unidadtributaria, Consignado = Total;
    const Recordatoriofilas = [['Ingresos brutos del año', Total, Totalingreso, '1.400 UVT'], ['Consignaciones (si todo llega a tu cuenta)', Consignado, Totalingreso, '1.400 UVT'], ['Patrimonio (tu ahorro)', Calculo.Ahorrohogar || 0, Topepatrimonio, '4.500 UVT']];
    const Obligado = Recordatoriofilas.some(Fila => Fila[1] >= Fila[2]);

    return {
      Factorcorto,
      Tasaanualtexto,
      Plazotexto: Calculo.Plazo + ' años',
      Sensibilidadcreditotexto: Formatoenteropesos(Calculo.Sensibilidadcredito),
      Promediomesesetiqueta: Calculo.N + ' meses',
      Ipctexto: Formatoporcentaje(Inflacionanual),
      Factoretiqueta: '× ' + Factorcorto + ' CRÉDITO (' + Tasaanualtexto + ', ' + Calculo.Plazo + ' AÑOS)',
      // Los botones "Entender" abren Ayuda en su pregunta y la pantalla baja sola hasta ella
      Abrirayudacifra: () => this.Cambiarestado({ Ayuda: true, Ayudaabierta: 0, Ayudadesplazar: true }),
      Abrirayudacondiciones: () => this.Cambiarestado({ Ayuda: true, Ayudaabierta: 11, Ayudadesplazar: true }),
      Abrirayudapareja: () => this.Cambiarestado({ Ayuda: true, Ayudaabierta: 12, Ayudadesplazar: true }),
      Abrirayudaplazo: () => this.Cambiarestado({ Ayuda: true, Ayudaabierta: 21, Ayudadesplazar: true }),
      Cerrarayuda: () => this.Cambiarestado({ Ayuda: false }),
      Abrirprodesdeayuda: () => { this.Cambiarestado({ Ayuda: false }); this.Abrirpro(); },
      Contactarsoporteayuda: () => {
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
      Tienesoporte: Boolean(Estadoactual.Soporteabierto),
      Soportevisible: Estadoactual.Soporteabierto ? 'flex' : 'none',
      Soportefondovisible: Estadoactual.Soporteabierto ? 'block' : 'none',
      Soportetransformacion: Estadoactual.Soporteanimado ? ('translateY(' + (Math.max(0, Estadoactual.Soportedesplazamiento || 0)) + 'px)') : 'translateY(100%)',
      Soportetransicion: Estadoactual.Soportearrastrando ? 'none' : 'transform .32s cubic-bezier(.22,1,.36,1)',
      Soportefondoopacidad: Estadoactual.Soporteanimado ? Math.max(0, 1 - (Estadoactual.Soportedesplazamiento || 0) / 350) : 0,
      Soportetocarinicio: (Elemento) => {
        const Auxiliar = Elemento.Eventonativo ? Elemento.Eventonativo.touches[0] : (Elemento.touches ? Elemento.touches[0] : null);
        if (!Auxiliar) return;
        this.Soporteinicioy = Auxiliar.clientY;
        this.Cambiarestado({ Soportearrastrando: true });
      },
      Soportetocarmover: (Elemento) => {
        if (!this.Soporteinicioy) return;
        const Auxiliar = Elemento.Eventonativo ? Elemento.Eventonativo.touches[0] : (Elemento.touches ? Elemento.touches[0] : null);
        if (!Auxiliar) return;
        const Desplazamientoy = Auxiliar.clientY - this.Soporteinicioy;
        if (Desplazamientoy > 0) {
          this.Cambiarestado({ Soportedesplazamiento: Desplazamientoy });
        }
      },
      Soportetocarfin: () => {
        const Desplazamientoy = Estadoactual.Soportedesplazamiento || 0;
        this.Soporteinicioy = null;
        if (Desplazamientoy > 90) {
          this.Cambiarestado({ Soporteanimado: false, Soportearrastrando: false });
          clearTimeout(this.Soportetemporizador);
          this.Soportetemporizador = setTimeout(() => {
            this.Cambiarestado({ Soporteabierto: false, Soportedesplazamiento: 0, Soporteerror: '', Soporteocupado: false });
          }, 240);
        } else {
          this.Cambiarestado({ Soportedesplazamiento: 0, Soportearrastrando: false });
        }
      },
      Cerrarsoporte: () => {
        this.Cambiarestado({ Soporteanimado: false, Soportearrastrando: false });
        clearTimeout(this.Soportetemporizador);
        this.Soportetemporizador = setTimeout(() => {
          this.Cambiarestado({ Soporteabierto: false, Soportedesplazamiento: 0, Soporteerror: '', Soporteocupado: false });
        }, 240);
      },
      Soporteformulariovisible: !Estadoactual.Soporteenviado,
      Soporteenviadovisible: Boolean(Estadoactual.Soporteenviado),
      Soportenombrevalor: Estadoactual.Soportenombre || '',
      Soportecorreovalor: Estadoactual.Soportecorreo || '',
      Soporteasuntovalor: Estadoactual.Soporteasunto || '',
      Soportedescripcionvalor: Estadoactual.Soportedescripcion || '',
      Soportedescripcionconteo: ((Estadoactual.Soportedescripcion || '').trim().length) + ' / 500 caracteres · mín. 20',
      Soportedescripcioncolor: ((Estadoactual.Soportedescripcion || '').trim().length >= 20) ? 'var(--at)' : 'var(--mu)',
      Soporteerror: Estadoactual.Soporteerror || '',
      Soportebotontexto: Estadoactual.Soporteocupado ? 'Enviando solicitud…' : 'Enviar solicitud',
      Escribirsoportenombre: (Elemento) => this.Cambiarestado({ Soportenombre: Textoseguro(Elemento.target.value, 80), Soporteerror: '' }),
      Escribirsoportecorreo: (Elemento) => this.Cambiarestado({ Soportecorreo: Textoseguro(Elemento.target.value, 100), Soporteerror: '' }),
      Escribirsoporteasunto: (Elemento) => this.Cambiarestado({ Soporteasunto: Textoseguro(Elemento.target.value, 100), Soporteerror: '' }),
      Escribirsoportedescripcion: (Elemento) => this.Cambiarestado({ Soportedescripcion: Textoseguro(Elemento.target.value, 500, true), Soporteerror: '' }),
      // Cada tipo tiene su propio plazo legal de respuesta; el servidor calcula la fecha exacta con los festivos
      Soportetipofichas: Tipossoporte.map(([Clave, Etiqueta]) => ({ ...Seleccion((Estadoactual.Soportetipo || 'soporte') === Clave), Etiqueta, Alclic: () => this.Cambiarestado({ Soportetipo: Clave, Soporteerror: '' }) })),
      Soportetipoayuda: (Tipossoporte.find(([Clave]) => Clave === (Estadoactual.Soportetipo || 'soporte')) || Tipossoporte[0])[2],
      Soporteradicadotexto: Estadoactual.Soporteradicado || '',
      Soportefechatexto: Estadoactual.Soportefechamaxima ? 'Te respondemos a más tardar el ' + Estadoactual.Soportefechamaxima + '. También te enviamos el número de radicado a tu correo.' : 'También te enviamos el número de radicado a tu correo.',
      Reiniciarsoporte: () => this.Cambiarestado({ Soportetipo: 'soporte', Soporteasunto: '', Soportedescripcion: '', Soporteerror: '', Soporteenviado: false, Soporteocupado: false, Soporteradicado: '', Soportefechamaxima: '' }),
      Enviarsoporte: async () => {
        if (Estadoactual.Soporteocupado) return;
        const Nombre = (Estadoactual.Soportenombre || '').trim();
        const Correo = (Estadoactual.Soportecorreo || '').trim().toLowerCase();
        const Asunto = (Estadoactual.Soporteasunto || '').trim();
        const Descripcion = (Estadoactual.Soportedescripcion || '').trim();
        if (Nombre.length < 6) {
          this.Cambiarestado({ Soporteerror: 'El nombre debe tener al menos 6 caracteres.' });
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(Correo)) {
          this.Cambiarestado({ Soporteerror: 'Ingresa un correo electrónico válido (ej. nombre@correo.com).' });
          return;
        }
        if (Asunto.length < 6) {
          this.Cambiarestado({ Soporteerror: 'El asunto debe tener al menos 6 caracteres.' });
          return;
        }
        if (Descripcion.length < 20) {
          this.Cambiarestado({ Soporteerror: 'La descripción debe tener al menos 20 caracteres para explicar tu solicitud.' });
          return;
        }
        this.Cambiarestado({ Soporteocupado: true, Soporteerror: '' });
        const Resultado = await Registrarsolicitudsoporteapi({ tipo: Estadoactual.Soportetipo || 'soporte', nombre: Nombre, correo: Correo, asunto: Asunto, descripcion: Descripcion });
        // Si no llegó el radicado la solicitud no quedó guardada, así que se avisa en vez de dar las gracias
        if (!Resultado.ok || !Resultado.datos || !Resultado.datos.radicado) {
          this.Cambiarestado({ Soporteocupado: false, Soporteerror: Resultado.error || 'No pudimos enviar tu solicitud, intenta de nuevo.' });
          return;
        }
        this.Cambiarestado({ Soporteocupado: false, Soporteenviado: true, Soporteradicado: String(Resultado.datos.radicado), Soportefechamaxima: String(Resultado.datos.fecha_maxima || '') });
        this.Aviso('Recibimos tu solicitud. Radicado ' + Resultado.datos.radicado + '.');
      },
      Ayudapantalla: this.Pantalla === 'app' && Boolean(Estadoactual.Ayuda),
      Ayuda: (() => {
        const Ayudavalores = {};
        // Cada pregunta de ayuda tiene sus claves con el número en letras, por ejemplo Abiertotres
        for (let Indice = 0; Indice < Numerosayuda.length; Indice++) {
          const Activo = Estadoactual.Ayudaabierta === Indice;
          const Numero = Numerosayuda[Indice];
          Ayudavalores['Abierto' + Numero] = Activo;
          Ayudavalores['Signo' + Numero] = Activo ? '−' : '+';
          Ayudavalores['Fondo' + Numero] = Activo ? 'var(--ac)' : 'var(--c2)';
          Ayudavalores['Color' + Numero] = Activo ? 'var(--oa)' : 'var(--ik)';
          Ayudavalores['Alternar' + Numero] = () => this.Cambiarestado(Estadoprevio => ({ Ayudaabierta: Estadoprevio.Ayudaabierta === Indice ? -1 : Indice }));
        }
        return Ayudavalores;
      })(),
      Plazorecomendadonota: (() => {
        const Edad = Estadoactual.Edad || 0;
        const Maximolegal = Math.max(5, 75 - Edad);
        const Escaja = (Estadoactual.Entidad === 'caja' || Calculo.Entidadclave === 'caja');
        if (Edad > 45 && Maximolegal < (Estadoactual.Plazoelegido || 20)) {
          return 'Aviso: Por tu edad (' + Edad + ' años), el banco limitará tu crédito a máx. ' + Maximolegal + ' años (Edad + Plazo ≤ 75).';
        }
        if (Escaja && (Estadoactual.Plazoelegido || 20) > 20) {
          return 'Aviso: Las Cajas de Compensación financian a un plazo máximo de 20 años.';
        }
        if (Estadoactual.Plazoelegido === 15) {
          return '15 años: Pagas mucho menos intereses y terminas antes, pero exige una cuota mensual mayor.';
        }
        if (Estadoactual.Plazoelegido === 30) {
          return '30 años: Cuota mensual más baja para maximizar tu cupo, aunque pagas más intereses en el tiempo.';
        }
        return 'Recomendado: 20 años · Balance óptimo entre cuota mensual accesible y menores intereses pagados frente a 30 años.';
      })(),
      Ingresoetiquetaayuda: Estadoactual.Pareja ? 'Ingreso del hogar (con pareja)' : 'Ingreso mensual',
      Topevissalariosminimos: Calculo.Topevissalarios,
      Ingresonecesariotexto: Formatoenteropesos(Calculo.Ingresonecesario),
      ...this.Entidadvalores(Calculo, Seleccion),
      ...(() => {
        const Pagoinicial = Estadoactual.Parejaingreso ?? 2400000, Pagodeudas = Estadoactual.Parejadeudas ?? 300000;
        const Solo = this.Calcular({ ...Estadoactual, Pareja: false }), Juntos = this.Calcular({ ...Estadoactual, Pareja: true });
        const Digito = (Elemento) => +(Elemento.target.value.replace(/\D/g, '') || 0);
        const Franja = (Opcion) => Opcion <= 2 ? 30 : Opcion <= 4 ? 20 : 0;
        const Barrasolo = Franja(Solo.Salariosminimos), Barrajusta = Franja(Juntos.Salariosminimos);
        const Advertencia = Barrajusta < Barrasolo;
        const Subsidiomensaje = Juntos.Subsidiocajasobretope ? 'Juntos ganan más de 4 SMMLV, pero tu subsidio ya está asignado y lo mantenemos en el cálculo. Confirma con tu Caja que la asignación incluye a tu pareja.' : Advertencia ? 'Juntos ganan ' + Juntos.Salariosminimos.toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' SMMLV: ' + (Barrajusta ? 'el subsidio de Caja bajaría de ' + Barrasolo + ' a ' + Barrajusta + ' SMMLV.' : 'perderían el subsidio de Caja (tope 4 SMMLV).') : '';
        return {
          Parejaactiva: Boolean(Estadoactual.Pareja && Estadoactual.Pro),
          Parejasubtitulo: Estadoactual.Pro ? 'Suma ingresos y deudas de un segundo solicitante' : 'MiTecho Pro · suma ingresos y deudas de otra persona',
          Parejanombrecampo: Estadoactual.Parejanombre || '',
          Escribirparejanombre: (Elemento) => this.Cambiarestado({ Parejanombre: Textoseguro(Elemento.target.value, 70) }),
          Parejaingresotexto: Pagoinicial ? Formatoenteropesos(Pagoinicial) : '',
          Parejadeudastexto: Pagodeudas ? Formatoenteropesos(Pagodeudas) : '',
          Escribirparejaingreso: (Elemento) => this.Cambiarestado({ Parejaingreso: Digito(Elemento) }),
          Escribirparejadeudas: (Elemento) => this.Cambiarestado({ Parejadeudas: Digito(Elemento) }),
          Parejaahorrotexto: Estadoactual.Parejaahorro ? Formatoenteropesos(Estadoactual.Parejaahorro) : '',
          Escribirparejaahorro: (Elemento) => this.Cambiarestado({ Parejaahorro: Digito(Elemento) }),
          Parejaactividadcampo: Estadoactual.Parejaactividad || '',
          Escribirparejaactividad: (Elemento) => this.Cambiarestado({ Parejaactividad: Textoseguro(Elemento.target.value, 60) }),
          Parejasolomillones: '$' + Formatomillones(Solo.Preciotecho) + ' M',
          Parejajuntosmillones: '$' + Formatomillones(Juntos.Preciotecho) + ' M',
          Parejasubsidioaviso: (Advertencia || Juntos.Subsidiocajasobretope) && Estadoactual.Modalidadelegida === 'vis',
          Parejasubsidiomensaje: Subsidiomensaje,
          Parejamiingreso: Formatoenteropesos(Solo.Ingresototal),
          Parejasuingreso: Formatoenteropesos(Pagoinicial),
          Parejadeudastotal: '−' + Formatoenteropesos(Juntos.Deudasmes),
          Parejaneto: Formatoenteropesos(Juntos.Neto),
          Parejasubsidioayuda: Advertencia ? 'Con tus datos: ' + Subsidiomensaje : 'Con tus datos, sumar ingresos no cambia tu subsidio.'
        };
      })(),
      ...(() => {
        const Ayudauno = Calculo.Fijopromedio + Promediovariable(Calculo.Historial, 3, 0, Estadoactual), Ayudados = Calculo.Fijopromedio + Promediovariable(Calculo.Historial, 6, 0, Estadoactual);
        const Cuotaa = this.Calcular({ ...Estadoactual, Topeconservador: true }), Cuotab = this.Calcular({ ...Estadoactual, Topeconservador: false });
        const Cuotaplazouno = this.Calcular({ ...Estadoactual, Opcioncompra: 0.01 }, null, 'leasing'), Cuotaplazotreinta = this.Calcular({ ...Estadoactual, Opcioncompra: 0.30 }, null, 'leasing');
        return {
          Ayudapromediotitulo: Calculo.Variablepromedio > 0 ? 'Hoy usas ' + Calculo.N + ' meses: tu ingreso es ' + Formatoenteropesos(Calculo.Ingresotitular) + (Estadoactual.Pareja ? ' (sin pareja)' : '') : 'No tienes ingresos variables',
          Ayudapromediodetalle: Calculo.Variablepromedio > 0 ? 'Si ganas por ventas, turnos o comisiones, el banco no mira tu mejor mes sino el promedio de tus extractos. Con 3 meses tu ingreso sería ' + Formatoenteropesos(Ayudauno) + ' y con 6 meses ' + Formatoenteropesos(Ayudados) + '. Con 6 meses el promedio es más estable; con 3 pesan más los meses recientes.' : 'Con salario fijo el banco toma tu salario mensual. Si empiezas a registrar ingresos variables, aquí verás su promedio de 3 o 6 meses.',
          Ayudatopetitulo: 'Hoy usas ' + Math.round(Calculo.Tope * 100) + '%: cuota hasta ' + Formatoenteropesos(Calculo.Capacidadcuota),
          Ayudatopedetalle: 'Es la parte de tu ingreso, ya restadas las deudas, que puede ir a la cuota de vivienda. La norma permite hasta 40% en VIS (Decreto 257 de 2021) y en No VIS (Decreto 583 de 2025), pero algunos bancos aplican 30% en su estudio. Con tus datos tu techo va de $' + Formatomillones(Cuotaa.Preciotecho) + ' M con 30% a $' + Formatomillones(Cuotab.Preciotecho) + ' M con 40%.',
          Ayudaopciontitulo: Estadoactual.Modalidadelegida === 'leasing' ? 'Hoy usas ' + Formatoporcentaje(Calculo.Opcioncompra) + ': pago final de ' + Formatoenteropesos(Calculo.Opcioncompra * Calculo.Creditotecho) : 'Solo aplica si eliges leasing',
          Ayudaopciondetalle: 'En leasing el banco es dueño de la vivienda hasta el final; pagas un canon mensual y, al terminar, la opción de compra para que quede a tu nombre. Entre más alta, menor el canon y mayor el cupo: con tus datos, con 1% tu techo sería $' + Formatomillones(Cuotaplazouno.Preciotecho) + ' M y con 30% $' + Formatomillones(Cuotaplazotreinta.Preciotecho) + ' M, pero pagarías ' + Formatoenteropesos(Cuotaplazotreinta.Opcioncompra * Cuotaplazotreinta.Creditotecho) + ' al final.',
          Ayudavipdetalle: 'Si el precio de la vivienda queda en 90 salarios mínimos o menos es VIP (vivienda de interés prioritario). Aplican los mismos subsidios que en VIS y suele haber más proyectos con subsidios distritales. ' + (Calculo.Esvip ? 'Tu cupo actual está en rango VIP.' : 'Tu cupo actual está por encima del rango VIP.')
        };
      })(),
      Mostrarpromedio: Calculo.Variablepromedio > 0,
      Promedioopciones: [3, 6].map(Numero => ({ Etiqueta: Numero + ' meses', ...Seleccion(Calculo.N === Numero), Alclic: () => this.Cambiarestado({ Promediomeses: Numero }) })),
      // 40% es la norma vigente; el modo conservador muestra lo que pasaría si el banco aplica 30%
      Mostrarflexible: true,
      Flexibleopciones: [[false, '40% norma vigente'], [true, '30% conservador']].map(([Valor, Etiquetatexto]) => ({ Etiqueta: Etiquetatexto, ...Seleccion(!!Estadoactual.Topeconservador === Valor), Alclic: () => this.Cambiarestado({ Topeconservador: Valor }) })),
      Esleasing: Estadoactual.Modalidadelegida === 'leasing',
      Opcioncompraopciones: [0.01, 0.10, 0.30].map(Valor => ({ Etiqueta: Formatoporcentaje(Valor), ...Seleccion((Estadoactual.Opcioncompra ?? 0.10) === Valor), Alclic: () => this.Cambiarestado({ Opcioncompra: Valor }) })),
      Opcioncompratexto: Formatoenteropesos(Calculo.Opcioncompra * Calculo.Creditotecho),
      Opcioncompraporcentaje: Formatoporcentaje(Calculo.Opcioncompra),
      Esvip: Calculo.Esvip,
      Topeviptexto: Formatoenteropesos(Calculo.Topevip),
      Entidadopciones: Object.keys(Tasasreferencia).filter(Clave => Clave !== 'caja' || Estadoactual.Caja).map(Clave => ({ Etiqueta: Clave === 'caja' ? (Estadoactual.Cajanombre || 'Caja') : Clave === 'fna' ? 'FNA' : Tasasreferencia[Clave].Etiqueta, ...Seleccion(Calculo.Entidadclave === Clave), Alclic: () => this.Cambiarestado({ Entidad: Clave }) })),
      Tasanota: Notatasa(Calculo, Estadoactual, Tasaanualtexto),
      Esuvr,
      Uvrfilas: [1, 5, 10].map(Anioitem => ({ Etiqueta: 'Cuota año ' + Anioitem, value: Formatoenteropesos(Calculo.Cuotatecho * Math.pow(1 + Inflacionanual, Anioitem - 1)) })),
      Uvrescenarios: (Calculo.Proyeccionuvr || []).map(Escapar => ({
        Etiqueta: Escapar.Etiqueta || ((Escapar.Ipc * 100).toFixed(1).replace('.', ',') + '%'),
        Ipctexto: Escapar.Ipctexto,
        Cuotainicialuvr: Formatoenteropesos(Escapar.Cuotainicialuvr),
        Cuotadiezanos: Formatoenteropesos(Escapar.Cuotadiezanos),
        Cuotaveinteanos: Formatoenteropesos(Escapar.Cuotaveinteanos),
        Tasaequivalenteporcentaje: Escapar.Tasaequivalenteporcentaje,
        Veredicto: Escapar.Ipc <= 0.0558 ? 'Más barato en UVR' : 'Más barato en Pesos'
      })),
      Puntoequilibriouvr: '5,58% anual',
      Financiargastosactivo: Boolean(Estadoactual.Financiargastos),
      // El motor de la vista solo lee valores, así que los estados del interruptor se calculan aquí
      Financiargastosriel: Estadoactual.Financiargastos ? 'var(--ac)' : 'var(--c2)',
      Financiargastosperilla: Estadoactual.Financiargastos ? 'var(--oa)' : 'var(--mu)',
      Financiargastosposicion: Estadoactual.Financiargastos ? 'translateX(16px)' : 'none',
      Alternarfinanciargastos: () => this.Cambiarestado({ Financiargastos: !Estadoactual.Financiargastos }),
      Sisbenactivo: Estadoactual.Sisben,
      Sisbengrupoopciones: [['A1-C8', 'A1 a C8 · 30'], ['C9-D20', 'C9 a D20 · 20']].map(([Clave, Etiquetatexto]) => ({ Etiqueta: Etiquetatexto, ...Seleccion(Estadoactual.Sisbengrupo === Clave), Alclic: () => this.Cambiarestado({ Sisbengrupo: Clave }) })),
      Planescuotainicial: Estadoactual.Planvista === 'ci',
      Planesdeudas: Estadoactual.Planvista !== 'ci',
      Plantitulo: Estadoactual.Planvista === 'ci' ? 'Cuota inicial' : 'Apagar deudas',
      Plansegmentos: [['deudas', 'Apagar deudas'], ['ci', 'Cuota inicial']].map(([Clave, Etiquetatexto]) => { const Activo = (Estadoactual.Planvista || 'deudas') === Clave; return { Etiqueta: Etiquetatexto, Fondo: Activo ? 'var(--ik)' : 'transparent', Color: Activo ? 'var(--bg)' : 'var(--mu)', Alclic: () => this.Cambiarestado({ Planvista: Clave }) }; }),
      Cierreobjetivomillones: '$' + Formatomillones(Objetivoporcentaje) + ' M',
      Cierrefaltamillones: Formatomillones(Faltaobjetivo),
      Cierreancho: (Totalobjetivo > 0 ? Math.min(100, Calculo.Efectivo / Totalobjetivo * 100) : 100) + '%',
      Cierretengomillones: '$' + Formatomillones(Calculo.Efectivo) + ' M',
      Cierretotalmillones: '$' + Formatomillones(Totalobjetivo) + ' M',
      Cierreobjetivotexto: Formatoenteropesos(Objetivoporcentaje),
      Cierrecreditotexto: '−' + Formatoenteropesos(Creditoobjetivo),
      Cierrecuotainicialtexto: Formatoenteropesos(Cuotainicialobjetivo),
      Cierregastostexto: Formatoenteropesos(Gastosobjetivo),
      Cierretengotexto: '−' + Formatoenteropesos(Calculo.Efectivo),
      Cierrefaltatexto: Formatoenteropesos(Faltaobjetivo),
      Cierrecupocorto: Calculo.Creditoporcapacidad < Objetivoporcentaje * Configuracion.Financiacion - 1,
      Cierrecupomensaje: 'Con tu ingreso actual el banco te prestaría ' + Formatoenteropesos(Calculo.Creditoporcapacidad) + ', no el ' + Math.round(Configuracion.Financiacion * 100) + '% de esta vivienda. Para eso necesitas un ingreso de ' + Formatoenteropesos(Calculo.Ingresonecesario) + ' al mes.',
      Cierreplazos: [12, 24, 36].map(Numero => ({ Etiqueta: Numero + ' meses', ...Seleccion((Estadoactual.Cuotainicialplazo || 24) === Numero), Alclic: () => this.Cambiarestado({ Cuotainicialplazo: Numero }) })),
      Cierremensual: Formatoenteropesos(Mensual),
      Cierremensaje,
      Cierremensajefondo: Cierrelisto ? 'var(--ac)' : '#FFD23F',
      Cierreprimasmensaje: Salario > 0 ? 'Si destinas el ' + (Estadoactual.Anualporcentaje ?? 50) + '% de tus primas y cesantías, sumas ' + Formatoenteropesos(Aporte) + ' al año a tu cuota inicial.' : 'Sin contrato laboral no recibes primas ni cesantías. Mira tu año completo en Mi Año.',
      Iranual: () => this.Cambiarestado({ Pestana: 'ingresos', Ingresovista: 'ano' }),
      Anualingresomillones: Formatomillones(Total),
      Anualfijo: Formatoenteropesos(Anualfijovalor),
      Anualvariable: Formatoenteropesos(Anualvariablevalor),
      Anualprestacional: Salario > 0,
      Anualnoprestacional: Salario <= 0,
      Anualprima: Formatoenteropesos(Prima),
      Anualcesantias: Formatoenteropesos(Cesantias),
      Anualinterescesantias: Formatoenteropesos(Interescesantias),
      Anualtotal: Formatoenteropesos(Total),
      Anualporcentajeopciones: [0, 25, 50, 75, 100].map(Valor => ({ Etiqueta: Valor + '%', ...Seleccion((Estadoactual.Anualporcentaje ?? 50) === Valor), Alclic: () => this.Cambiarestado({ Anualporcentaje: Valor }) })),
      Anualaporte: Formatoenteropesos(Aporte),
      Anualaportemensaje: Calculo.Faltatecho <= 0 ? 'Tu cuota inicial ya está cubierta.' : !Aporte ? 'Sin aporte de primas ni cesantías.' : Mesessin ? 'Completas tu cuota inicial ' + Math.max(0, Mesessin - Mesconsignacion) + ' meses antes (en ' + Mesconsignacion + ' meses).' : 'Con este aporte completas tu cuota inicial en ' + Mesconsignacion + ' meses.',
      Rentafilas: Recordatoriofilas.map(([Etiquetatexto, Valor, Auxiliar, Unidadtope]) => ({ Etiqueta: Etiquetatexto + ' · tope ' + Unidadtope, value: Formatoenteropesos(Valor) + ' / ' + Formatoenteropesos(Auxiliar), Ancho: Math.min(100, Valor / Auxiliar * 100) + '%', Fondo: Valor >= Auxiliar ? 'var(--al)' : 'var(--ac)' })),
      Rentafondo: Obligado ? '#FFD23F' : 'var(--ac)',
      Rentamensaje: Obligado ? 'Superas al menos un tope: deberás declarar renta en 2027, entre agosto y octubre según los últimos dígitos de tu cédula.' : 'Con estos datos no superas los topes de 2026: no estarías obligado a declarar renta en 2027.',
      ...(() => {
        const Totalingresos = (Estadoactual.Fijo || 0) + (Estadoactual.Variable || 0) + (Estadoactual.Pareja ? (Estadoactual.Parejaingreso || 0) : 0);
        const Tributarenta = Totalingresos >= Umbralingresorenta;
        const Creditoestimado = Calculo.Creditotecho || (Calculo.Preciotecho * 0.8);
        const Interesprimeranio = Creditoestimado * (Calculo.Tasaanual || 0.1135);
        const Interesesdeducibles = Math.min(Interesprimeranio, Topededuccioninteresesuvt * Unidadtributaria);
        const Ahorrorentaanual = Tributarenta ? Math.round(Interesesdeducibles * 0.19) : 0;
        const Ahorrorentamensual = Math.round(Ahorrorentaanual / 12);
        const Superatopepatrimonio = Calculo.Preciotecho >= Topepatrimoniodeclarar;
        return {
          Tributarenta,
          Ahorrorentaanualtexto: Formatoenteropesos(Ahorrorentaanual),
          Ahorrorentamensualtexto: Formatoenteropesos(Ahorrorentamensual),
          Ahorrorentamensaje: Tributarenta
            ? 'Por los intereses de tu crédito podrías deducir hasta ' + Formatoenteropesos(Interesesdeducibles) + ' al año, ahorrando unos ' + Formatoenteropesos(Ahorrorentaanual) + '/año en tu impuesto (~' + Formatoenteropesos(Ahorrorentamensual) + '/mes en retención).'
            : 'Con tus ingresos actuales no pagas impuesto de renta (aplica desde ~$6,9 M/mes), por lo que la deducción de intereses no te genera ahorro en dinero.',
          Superatopepatrimonio,
          Alertapatrimoniomensaje: Superatopepatrimonio
            ? 'Al comprar una vivienda de ' + Formatoenteropesos(Calculo.Preciotecho) + ' tu patrimonio superará 4.500 UVT (' + Formatoenteropesos(Topepatrimoniodeclarar) + '): quedarás obligado a declarar renta ante la DIAN el año siguiente.'
            : ''
        };
      })(),
      Cierresobrante: Formatoenteropesos(Math.max(0, Contexto.Fijostotal + Contexto.Semana.reduce((Acumulado, Segundo) => Acumulado + Segundo, 0) - Calculo.Deudasmes - Contexto.Gastosmes)),
      Mostraranuncios: !Estadoactual.Pro,
      Abririnterescartera: () => this.Aviso('Próximamente: convenio de compra de cartera en MiTecho.'),
      Abririnteresafc: () => this.Aviso('Próximamente: cuentas AFC en MiTecho.'),
      Abririnteresahorro: () => this.Aviso('Próximamente: ahorro programado en MiTecho.'),
      Tieneconsignacion: this.Pantalla === 'app' && Boolean(Estadoactual.Consignacion),
      Consignacionvisible: (this.Pantalla === 'app' && Estadoactual.Consignacion) ? 'flex' : 'none',
      Consignacionfondovisible: (this.Pantalla === 'app' && Estadoactual.Consignacion) ? 'block' : 'none',
      Tienemenu: this.Pantalla === 'app' && Boolean(Estadoactual.Menu),
      Menuvisible: (this.Pantalla === 'app' && Estadoactual.Menu) ? 'flex' : 'none',
      Menufondovisible: (this.Pantalla === 'app' && Estadoactual.Menu) ? 'block' : 'none',
      Espro: this.Pantalla === 'app' && Estadoactual.Panel === 'pro',
      Proestado: Estadoactual.Pro ? 'Tu suscripción está activa. Gracias por apoyar MiTecho.' : 'Simula con tu pareja, guarda tu reporte en PDF, compara tasas por banco y usa la app sin anuncios.',
      Probeneficios: [
        { Titulo: 'Simulación en pareja o familia', Descripcion: 'Suma los ingresos y deudas de otra persona para ver cuánto podrían comprar juntos.' },
        { Titulo: 'Reporte PDF de tu simulación', Descripcion: 'Guarda el resumen de tus cifras para preparar tu visita al banco.' },
        { Titulo: 'Tasas por banco', Descripcion: 'Tu cuota en cada entidad con los datos de la Superintendencia Financiera.' },
        { Titulo: 'Sin anuncios', Descripcion: 'Ni banners ni videos en ninguna pantalla; el comparador queda abierto.' }
      ],
      Probotonuno: Estadoactual.Pro ? 'Administrar en Google Play' : 'Suscribirme',
      Probotonfondo: Estadoactual.Pro ? 'var(--c2)' : '#FFD23F',
      Probotoncolor: Estadoactual.Pro ? 'var(--ik)' : '#0B0C0A',
      // Pro lo activa el servidor cuando Google Play confirme el pago; desde aquí nunca se activa sin pagar
      Alternarplanpro: () => {
        if (Estadoactual.Pro) {
          window.open('https://play.google.com/store/account/subscriptions?package=co.mitecho.app', '_blank', 'noopener');
          return;
        }
        this.Aviso('La suscripción con Google Play estará disponible cuando MiTecho esté publicada en la tienda.');
      },
      Fuentes: [
        { Clave: 'Salario mínimo 2026', Valor: Formatoenteropesos(Salariominimo), Formactual: 'Decreto 1469 de 2025' },
        { Clave: 'UVT 2026', Valor: Formatoenteropesos(Unidadtributaria), Formactual: 'Resolución DIAN 000238 de 2025' },
        { Clave: 'Tope VIS en ' + Estadoactual.Ciudad, Valor: Calculo.Topevissalarios + ' SMMLV · ' + Formatoenteropesos(Calculo.Topevis), Formactual: '135 SMMLV general; 150 SMMLV en Bogotá, Medellín, Cali, Barranquilla, Bucaramanga, Cartagena, Cúcuta y sus áreas' },
        { Clave: 'Tope VIP', Valor: '90 SMMLV · ' + Formatoenteropesos(90 * Salariominimo), Formactual: 'Todo el país' },
        { Clave: 'Subsidio Caja de compensación', Valor: '30 / 20 SMMLV', Formactual: 'Hogar hasta 2 SMMLV / de 2 a 4 SMMLV, afiliado' },
        { Clave: 'Mi Casa Ya', Valor: '30 / 20 SMMLV', Formactual: 'Sisbén A1–C8 / C9–D20. Con Caja y hasta 2 SMMLV: 20 SMMLV (total 50). Sujeto a cupos' },
        { Clave: 'Tasa usada en pesos', Valor: 'VIS ' + Formatoporcentaje(this.Calcular({ ...Estadoactual, Entidad: 'promedio', Tasatipo: 'pesos' }, null, 'vis').Tasaanual) + ' · No VIS ' + Formatoporcentaje(this.Calcular({ ...Estadoactual, Entidad: 'promedio', Tasatipo: 'pesos' }, null, 'novis').Tasaanual), Formactual: (typeof Tasasmercadoactual !== 'undefined' && Tasasmercadoactual ? 'Promedio de la Superintendencia Financiera al ' + Fechatasasreferencia + ', más 0,5 puntos de margen prudente' : 'Valores de referencia al ' + Fechatasasreferencia + '; se actualizan al conectarte') },
        { Clave: 'Cuota máxima', Valor: '40% del ingreso', Formactual: 'VIS (Decreto 257 de 2021) y No VIS (Decreto 583 de 2025); modo conservador 30%' },
        { Clave: 'Financiación', Valor: 'No VIS 70% · VIS 80%', Formactual: 'Leasing habitacional hasta 80%–90%; opción de compra 1%–30%' },
        { Clave: 'IPC para proyección UVR', Valor: Formatoporcentaje(Inflacionanual), Formactual: 'Variación certificada por el DANE para la UVT 2026' },
        { Clave: 'Crédito con Caja de compensación', Valor: 'Desde 0,9% m.v.', Formactual: 'Líneas para afiliados, en pesos, plazo hasta 20 años; tasa según perfil' }
      ]
    };
  
}
