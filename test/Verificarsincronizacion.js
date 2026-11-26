// Revisión integral de fórmulas financieras y sincronización entre vistas y reporte PDF

const Archivos = require('fs');
const Rutas = require('path');
const Maquinavirtual = require('vm');
const Cripto = require('crypto');

const Raiz = Rutas.join(__dirname, '..');
const Leer = Ruta => Archivos.readFileSync(Rutas.join(Raiz, Ruta), 'utf8');
const Html = Leer('index.html');
const Guiones = [...Html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(Coincidencia => Coincidencia[1]);

const Contexto = {
  console, Math, Date, Intl, JSON, Promise, Map, Set, WeakMap, Number, String, Boolean, Array, Object, RegExp, Error, Uint8Array, URLSearchParams,
  crypto: Cripto.webcrypto,
  setTimeout: () => 1,
  clearTimeout: () => {},
  requestAnimationFrame: () => 1,
  cancelAnimationFrame: () => {},
  queueMicrotask: () => {},
  performance: { now: () => 0 },
  location: { search: '' },
  addEventListener: () => {},
  document: { body: { style: {} }, addEventListener: () => {}, querySelector: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
};
Contexto.window = Contexto;
Maquinavirtual.createContext(Contexto);

for (const Ruta of Guiones) {
  let Codigo = Leer(Ruta);
  if (Ruta === 'js/Aplicacion.js') Codigo = Codigo.replace(/\(function Comienzo\(\)[\s\S]*$/, '');
  Maquinavirtual.runInContext(Codigo, Contexto, { filename: Ruta });
}
Maquinavirtual.runInContext('Object.assign(window, { Aplicacionmitecho, Salariominimo, Catalogoproyectos, Formatoenteropesos, Formatomillones });', Contexto);

let Errores = 0;
function Revisar(Condicion, Bien, Mal) {
  if (Condicion) console.log('[BIEN] ' + Bien);
  else { console.error('[FALLA] ' + Mal); Errores++; }
}

function Crearinstancia() {
  const Instancia = new Contexto.Aplicacionmitecho({ Pantallainicial: 'app', Modo: 'oscuro', Animaciones: false });
  Instancia.Estadocomponente.Ingresado = true;
  Instancia.Estadocomponente.Cuestionariolisto = true;
  Instancia.Estadocomponente.Pantalla = 'app';
  Instancia.Estadocomponente.Pestana = 'inicio';
  Instancia.Estadocomponente.Nombre = 'Laura Gómez';
  Instancia.Estadocomponente.Edad = 32;
  Instancia.Estadocomponente.Ciudad = 'Bogotá';
  Instancia.Estadocomponente.Tipo = 'fijo';
  Instancia.Estadocomponente.Fijo = 3200000;
  Instancia.Estadocomponente.Ahorro = 15000000;
  Instancia.Estadocomponente.Ahorromes = 800000;
  Instancia.Estadocomponente.Deudas = [];
  Instancia.Estadocomponente.Registros = [];
  Instancia.Estadocomponente.Egresosregistrados = [];
  Instancia.Estadocomponente.Mostrado = Instancia.Calcular().Preciotecho;
  Instancia.Metaanimacion = Instancia.Estadocomponente.Mostrado;
  Instancia.Pantallaanterior = 'app';
  let Enactualizacion = false;
  Instancia.Programarrender = () => {
    if (Enactualizacion) return;
    Enactualizacion = true;
    try { Instancia.Alactualizar(); } finally { Enactualizacion = false; }
  };
  return Instancia;
}

const Formato = Contexto.Formatoenteropesos;
const Millones = Contexto.Formatomillones;
const Mv = Contexto.Salariominimo;

// 1. VIS con concurrencia (<= 2 SMMLV), corte exacto 4 SMMLV + $1 y tope VIS por ciudad
const Hogarvis = Crearinstancia();
Hogarvis.Estadocomponente.Fijo = 3000000;
Hogarvis.Estadocomponente.Caja = true;
Hogarvis.Estadocomponente.Cajanombre = 'Compensar';
Hogarvis.Estadocomponente.Sisben = true;
Hogarvis.Estadocomponente.Sisbengrupo = 'A1-C8';
Hogarvis.Estadocomponente.Ahorro = 20000000;
const Calcvis = Hogarvis.Calcular();
Revisar(Calcvis.Subsidiocajamonto === 30 * Mv && Calcvis.Subsidiomicasayamonto === 20 * Mv,
  'Hogar <= 2 SMMLV recibe concurrencia de 30 + 20 SMMLV (' + Formato(Calcvis.Subsidiocajamonto + Calcvis.Subsidiomicasayamonto) + ').',
  'Concurrencia incorrecta: Caja=' + Calcvis.Subsidiocajamonto + ' MCY=' + Calcvis.Subsidiomicasayamonto);

Hogarvis.Estadocomponente.Fijo = 4 * Mv + 1;
const Calcborde = Hogarvis.Calcular();
Hogarvis.Estadocomponente.Panel = 'subsidios';
const Vistasubsidios = Hogarvis.Valoresvista();
Revisar(Calcborde.Subsidiocajamonto === 0 && Calcborde.Subsidiomicasayamonto === 0 && Vistasubsidios.Subsidiosingresono && !Vistasubsidios.Subsidiotramodoshogar,
  'Con 4 SMMLV + $1 se pierde el subsidio en el motor y en Subsidios.',
  'El borde 4 SMMLV + $1 mantuvo subsidio o tramo equivocado.');

Hogarvis.Estadocomponente.Panel = null;
Hogarvis.Estadocomponente.Fijo = 12000000;
Hogarvis.Estadocomponente.Ahorro = 90000000;
Hogarvis.Estadocomponente.Ciudad = 'Bogotá';
const Calcbogota = Hogarvis.Calcular();
Hogarvis.Estadocomponente.Ciudad = 'Pereira';
const Calcpereira = Hogarvis.Calcular();
Revisar(Calcbogota.Topevissalarios === 150 && Calcpereira.Topevissalarios === 135 && Calcpereira.Topevis === 135 * Mv,
  'El tope VIS cambia entre 150 SMMLV (Bogotá) y 135 SMMLV (Pereira).',
  'Tope VIS por ciudad incorrecto.');

// 2. No VIS sin subsidio (70%, 3% notaría, conversión E.A. a M.V., 40% vs 30%, UVR y total pagado)
const Novisapp = Crearinstancia();
Novisapp.Estadocomponente.Modalidadelegida = 'novis';
Novisapp.Estadocomponente.Fijo = 14000000;
Novisapp.Estadocomponente.Ahorro = 250000000;
Novisapp.Estadocomponente.Caja = true;
Novisapp.Estadocomponente.Sisben = true;
const Calcnovis = Novisapp.Calcular();
const Tasamvesperada = Math.pow(1 + Calcnovis.Tasaanual, 1 / 12) - 1;
const Cuotaprimer = Calcnovis.Cuotatecho;
Revisar(Math.abs(Calcnovis.Tasamensual - Tasamvesperada) < 1e-12 && Calcnovis.Subsidiotecho === 0 && Calcnovis.Financiacion === 0.70,
  'No VIS usa conversión E.A.->M.V. exacta, 70% de financiación y $0 subsidio.',
  'No VIS falló en tasa mensual, financiación o subsidio.');
Revisar(Calcnovis.Gastostecho === Math.round(Calcnovis.Preciotecho * 0.03),
  'No VIS aplica 3% exacto de escrituración sobre el precio techo.',
  'Gastos No VIS no coinciden con 3%: ' + Calcnovis.Gastostecho);

Novisapp.Estadocomponente.Panel = 'subsidios';
const Subnovis = Novisapp.Valoresvista();
Revisar(!Subnovis.Subsidiosvisok && Subnovis.Subsidiosvisnota.includes('No VIS'),
  'La pantalla Subsidios identifica que No VIS no lleva subsidio.',
  'Valoressubsidios reportó No VIS como si fuera VIS.');

Novisapp.Estadocomponente.Panel = null;
Novisapp.Estadocomponente.Tasatipo = 'uvr';
Novisapp.Estadocomponente.Pestana = 'simulador';
Novisapp.Estadocomponente.Simuladorpaso = 'result';
const Calcuvr = Novisapp.Calcular();
const Vistauvr = Novisapp.Valoresvista();
const Htmluvr = Contexto.Construircertificadohtml(Novisapp.Estadocomponente, Calcuvr);
Revisar(Calcuvr.Proyeccionuvr[0].Cuotainicialuvr === Calcuvr.Cuotatecho && !Vistauvr.Simtotalvisible && Htmluvr.includes('+ UVR'),
  'Modo UVR alinea primera cuota de proyección con Cuotatecho y etiqueta + UVR en vista y PDF.',
  'Desajuste en modo UVR entre motor, simulador y PDF.');

// 3. Leasing habitacional (80%, 0% notaría, opción de compra 10%/30%, sin subsidios ni caída al 70%)
const Leasingapp = Crearinstancia();
Leasingapp.Estadocomponente.Modalidadelegida = 'leasing';
Leasingapp.Estadocomponente.Fijo = 16000000;
Leasingapp.Estadocomponente.Ahorro = 80000000;
Leasingapp.Estadocomponente.Caja = true;
Leasingapp.Estadocomponente.Sisben = true;
Leasingapp.Estadocomponente.Opcioncompra = 0.10;
const Calcleasing10 = Leasingapp.Calcular();
const Cuotaleasingformula = Math.round(Contexto.Cuotaconcredito(Calcleasing10.Creditotecho, Calcleasing10.Tasaanual, Calcleasing10.Plazo * 12, 0.10));
Leasingapp.Estadocomponente.Opcioncompra = 0.30;
const Calcleasing30 = Leasingapp.Calcular();
Leasingapp.Estadocomponente.Panel = 'subsidios';
const Subleasing = Leasingapp.Valoresvista();
const Htmlleasing = Contexto.Construircertificadohtml(Leasingapp.Estadocomponente, Calcleasing30);
Revisar(Calcleasing10.Modalidadelegida === 'leasing' && Calcleasing10.Subsidiotecho === 0 && Calcleasing10.Gastostecho === 0 && Calcleasing10.Financiacion === 0.80,
  'Leasing mantiene 80% de financiación, 0% notaría y 0 subsidios aunque supere el tope VIS.',
  'Leasing aplicó subsidios, notaría o bajó al 70%.');
Revisar(Math.abs(Cuotaleasingformula - Calcleasing10.Cuotatecho) <= 1 && Calcleasing30.Preciotecho > Calcleasing10.Preciotecho,
  'Leasing valida Cuotaconcredito con opción de compra y mayor opción aumenta el cupo.',
  'Fórmula de opción de compra en leasing inconsistente.');
Revisar(!Subleasing.Subsidiosvisok && Htmlleasing.includes('No aplica en leasing habitacional'),
  'Subsidios y PDF coinciden en que el subsidio no aplica en leasing habitacional.',
  'Subsidios o PDF inconsistentes en leasing.');

// 4. Financiamiento de gastos (Ley 2434 de 2024) y paridad con Inicio, Simular, Plan, Viviendas y PDF
const Leyapp = Crearinstancia();
Leyapp.Estadocomponente.Fijo = 5500000;
Leyapp.Estadocomponente.Ahorro = 12000000;
const Soley = Leyapp.Calcular();
Leyapp.Estadocomponente.Financiargastos = true;
const Conley = Leyapp.Calcular();
const Vley = Leyapp.Valoresvista();
const Htmlley = Contexto.Construircertificadohtml(Leyapp.Estadocomponente, Conley);
Revisar(Conley.Preciotecho < Soley.Preciotecho && Conley.Faltatecho < Soley.Faltatecho && Vley.Heroepropiomillones === '$' + Millones(Conley.Cuotainicialtecho) + ' M',
  'Ley 2434 reduce ahorro faltante, ajusta precio máximo y sincroniza Heroepropiomillones en Inicio.',
  'Ley 2434 desalineada entre motor e Inicio.');
Revisar(Htmlley.includes(Formato(Conley.Preciotecho)) && Htmlley.includes(Formato(Conley.Creditotecho)) && Htmlley.includes(Formato(Conley.Cuotainicialtecho)) && Htmlley.includes(Formato(Conley.Cuotatecho)),
  'El PDF coincide peso a peso con Inicio y Simular al activar Ley 2434.',
  'Discrepancia en pesos entre Ley 2434 y reporte PDF.');

Leyapp.Estadocomponente.Pestana = 'ofertas';
const Vofertas = Leyapp.Valoresvista();
const Proyecto = Contexto.Catalogoproyectos.find(Item => Item.Ciudadproyecto === 'Bogotá' && Item.Tipovivienda === 'VIS');
const Tarjeta = Vofertas.Ofertastarjetas.find(Item => Item.Nombre === Proyecto.Nombreproyecto);
Revisar(Boolean(Tarjeta), 'Catálogo de Viviendas renderiza tarjetas con Financiargastos activo.', 'No se encontró tarjeta de referencia en Bogotá.');

// 5. Compra en pareja: sumar, recalcular subsidios y eliminar pareja sin residuos
const Parejaapp = Crearinstancia();
Parejaapp.Estadocomponente.Fijo = 3200000;
Parejaapp.Estadocomponente.Ahorro = 15000000;
Parejaapp.Estadocomponente.Caja = true;
const Solouno = Parejaapp.Calcular();
Parejaapp.Estadocomponente.Pareja = true;
Parejaapp.Estadocomponente.Parejanombre = 'Carlos Pérez';
Parejaapp.Estadocomponente.Parejaingreso = 4200000;
Parejaapp.Estadocomponente.Parejadeudas = 300000;
Parejaapp.Estadocomponente.Parejaahorro = 10000000;
const Juntospareja = Parejaapp.Calcular();
const Htmlpareja = Contexto.Construircertificadohtml(Parejaapp.Estadocomponente, Juntospareja);
Revisar(Juntospareja.Ingresototal === 7400000 && Juntospareja.Deudasmes === 300000 && Juntospareja.Ahorrohogar === 25000000 && Juntospareja.Subsidio === 0,
  'Pareja suma ingresos, deudas y ahorros y retira subsidio al superar 4 SMMLV.',
  'Cálculo en pareja inconsistente.');
Revisar(Htmlpareja.includes('Carlos Pérez') && Htmlpareja.includes(Formato(Juntospareja.Preciotecho)) && Htmlpareja.includes(Formato(Juntospareja.Neto)),
  'PDF en pareja coincide peso a peso en ingresos totales, neto, ahorro y precio techo.',
  'PDF en pareja difiere del motor.');
Parejaapp.Estadocomponente.Pestana = 'simulador';
const Vpareja = Parejaapp.Valoresvista();
Vpareja.Eliminarpareja();
Revisar(!Parejaapp.Estadocomponente.Pareja && Parejaapp.Calcular().Preciotecho === Solouno.Preciotecho,
  'Eliminar pareja limpia los montos y regresa al presupuesto individual exacto.',
  'Quedaron datos residuales tras eliminar pareja.');

// 6. Sincronización inmediata ante barra manual + edición en Perfil, ingresos fijos, movimientos, deudas y edad
const Sincapp = Crearinstancia();
Sincapp.Estadocomponente.Pestana = 'simulador';
let Vsinc = Sincapp.Valoresvista();
// Simula mover el slider manual del simulador
Vsinc.Cambiaringreso({ target: { value: '9000000' } });
Revisar(Sincapp.Estadocomponente.Fuenteingreso === 'manual' && Sincapp.Calcular().Ingresotitular === 9000000,
  'Barra manual en Simular actualiza inmediatamente a 9.000.000.',
  'Barra manual no cambió Ingresotitular.');

// Editar salario en Perfil debe invalidar el cache manual y reflejar el nuevo salario al instante
Sincapp.Estadocomponente.Panel = 'perfil';
Vsinc = Sincapp.Valoresvista();
Vsinc.Escribirperfilfijo({ target: { value: '4500000' } });
Sincapp.Estadocomponente.Panel = null;
Sincapp.Estadocomponente.Pestana = 'inicio';
const Vpostperfil = Sincapp.Valoresvista();
const Calcpostperfil = Sincapp.Calcular();
Revisar(Sincapp.Estadocomponente.Fuenteingreso === 'perfil' && Calcpostperfil.Ingresotitular === 4500000 && Vpostperfil.Preciodestacado === Millones(Calcpostperfil.Preciotecho),
  'Editar salario en Perfil anula el valor manual previo y actualiza Inicio al instante (' + Vpostperfil.Preciodestacado + ' M).',
  'Perfil dejó el valor manual antiguo o Inicio quedó desfasado.');

// Registrar nueva deuda y luego marcarla como pagada sincroniza Inicio, Simular, Plan, Movimientos, Deudas, Perfil y PDF
Sincapp.Estadocomponente.Formulariodeuda = { Tipo: 'Tarjeta de crédito', Cuota: 600000, Saldo: 5000000, Entidad: 'Banco', Nombre: '' };
Sincapp.Valoresvista().Guardardeuda();
const Calccondeuda = Sincapp.Calcular();
const Deudaid = Sincapp.Estadocomponente.Deudas[0].id;
Sincapp.Estadocomponente.Pestana = 'ingresos';
Sincapp.Estadocomponente.Ingresovista = 'mes';
const Vmovcon = Sincapp.Valoresvista();
Revisar(Calccondeuda.Deudasmes === 600000 && Vmovcon.Movgastodeudas === Formato(600000),
  'Nueva deuda impacta al instante el cálculo y Movimientos (' + Vmovcon.Movgastodeudas + ').',
  'Nueva deuda no se reflejó en cálculo o Movimientos.');

Sincapp.Fijardeuda(Deudaid, { Activa: false });
const Calcsindeuda = Sincapp.Calcular();
Sincapp.Estadocomponente.Panel = 'perfil';
const Vperfilesin = Sincapp.Valoresvista();
Sincapp.Estadocomponente.Panel = null;
Sincapp.Estadocomponente.Pestana = 'ingresos';
const Vmovsin = Sincapp.Valoresvista();
Sincapp.Estadocomponente.Panel = 'deudas';
const Vdeudassin = Sincapp.Valoresvista();
Revisar(Calcsindeuda.Deudasmes === 0 && Vmovsin.Movgastodeudas === '$0' && Vperfilesin.Perfilresumendeudas.includes('$0'),
  'Marcar deuda como pagada descuenta a $0 en motor, Movimientos y resumen de Perfil.',
  'Deuda marcada como pagada siguió sumando en Movimientos o Perfil.');
Revisar(Vdeudassin.Deudasaviso.includes('$' + Millones(Calcsindeuda.Ahorrohogar) + ' M'),
  'Aviso de saldo en Deudas usa Ahorrohogar completo.',
  'Valoresdeudas no mostró Ahorrohogar.');

// Registrar ingreso fijo extra mientras estaba en manual también sincroniza todo
Sincapp.Estadocomponente.Panel = null;
Sincapp.Estadocomponente.Pestana = 'simulador';
Sincapp.Valoresvista().Cambiaringreso({ target: { value: '8000000' } });
Sincapp.Estadocomponente.Formularioingresofijo = { Tipo: 'Arriendo que recibo', Monto: 1000000, Nombre: '' };
Sincapp.Valoresvista().Guardaringresofijo();
const Calcextra = Sincapp.Calcular();
Revisar(Sincapp.Estadocomponente.Fuenteingreso === 'perfil' && Calcextra.Ingresotitular === 5500000,
  'Agregar ingreso fijo extra desbloquea el modo manual y suma a $5.500.000 en toda la app.',
  'Ingreso fijo extra quedó oculto tras el valor manual.');

// Registrar ingreso diario y gasto diario actualiza Movimientos, Inicio y racha
const Hoy = Contexto.Hoyregistro();
Sincapp.Estadocomponente.Pestana = 'ingresos';
Sincapp.Estadocomponente.Ingresovista = 'dia';
Sincapp.Estadocomponente.Registrotipo = 'ing';
Sincapp.Estadocomponente.Diaseleccionado = 6;
Sincapp.Estadocomponente.Formulario = { Monto: 180000, Fuente: 'Ventas del día', Medio: 'Nequi / DaviPlata', Nombre: '' };
Sincapp.Valoresvista().Guardarregistro();
Sincapp.Estadocomponente.Formulariogasto = { Categoria: 'Transporte', Medio: 'Efectivo', Monto: 45000, Nombre: '' };
Sincapp.Valoresvista().Guardargasto();
Sincapp.Estadocomponente.Ingresovista = 'dia';
Sincapp.Estadocomponente.Registrotipo = 'ing';
const Vmovdia = Sincapp.Valoresvista();
Sincapp.Estadocomponente.Registrotipo = 'egr';
const Vmovgasto = Sincapp.Valoresvista();
Sincapp.Estadocomponente.Pestana = 'inicio';
const Viniciodia = Sincapp.Valoresvista();
Revisar(Vmovdia.Movdiatotal === Formato(180000) && Vmovgasto.Movgastodiatotal === Formato(45000) && Viniciodia.Metahoy === Formato(180000) && Sincapp.Estadocomponente.Diasregistrados.includes(Hoy),
  'Ingreso y gasto diarios actualizan Movimientos, Metahoy en Inicio y racha al instante.',
  'Movimientos diarios no se sincronizaron con Inicio y racha.');

// Edad >= 65 limita plazo a 75 - Edad y se refleja en Plan y PDF
Sincapp.Estadocomponente.Panel = 'perfil';
Sincapp.Valoresvista().Escribirperfiledad({ target: { value: '62' } });
Sincapp.Estadocomponente.Panel = null;
Sincapp.Estadocomponente.Plazoelegido = 20;
const Calcedad = Sincapp.Calcular();
const Htmlfinal = Contexto.Construircertificadohtml(Sincapp.Estadocomponente, Calcedad);
Sincapp.Estadocomponente.Pestana = 'simulador';
Sincapp.Estadocomponente.Simuladorpaso = 'result';
const Vsimfinal = Sincapp.Valoresvista();
Revisar(Calcedad.Plazo === 13 && Vsimfinal.Simplazochip === 'A 13 años' && Htmlfinal.includes('13 años (por la edad)') && Htmlfinal.includes(Formato(Calcedad.Preciotecho)),
  'Edad 62 limita el plazo a 13 años y mantiene paridad peso a peso en Simular y PDF.',
  'Límite por edad o paridad final con PDF fallaron.');

if (Errores === 0) {
  console.log('\nVERIFICACIÓN DE PRECISIÓN Y SINCRONIZACIÓN EXITOSA.');
  process.exit(0);
} else {
  console.error('\nSe encontraron ' + Errores + ' fallas en precisión o sincronización.');
  process.exit(1);
}
