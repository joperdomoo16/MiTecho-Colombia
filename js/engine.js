// Motor liviano para actualizar la pantalla del celular sin perder el foco ni las animaciones

(function () {
  // Las plantillas usan atributos al-* en vez de onclick para que la CSP no tenga que permitir código en línea
  const Eventos = {
    'al-clic': 'click', 'al-escribir': 'input', 'al-cambiar': 'input', 'al-desplazar': 'scroll',
    'al-tocar-inicio': 'touchstart', 'al-tocar-mover': 'touchmove', 'al-tocar-fin': 'touchend'
  };
  const Hueco = /\{\{\s*([^}]+?)\s*\}\}/g;
  const Completoexpresion = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  const Idsplantilla = new WeakMap();
  let Secuenciaplantilla = 0;

  function Crearreferencia() { return { Actual: null }; }

  function Leerliteral(Expresion) {
    if (Expresion === 'true') return [true, true];
    if (Expresion === 'false') return [true, false];
    if (Expresion === 'null') return [true, null];
    if (/^-?\d+(\.\d+)?$/.test(Expresion)) return [true, +Expresion];
    const Coincidencia = Expresion.match(/^(['"])(.*)\1$/);
    return Coincidencia ? [true, Coincidencia[2]] : [false];
  }

  function Buscarvalor(Expresion, Ambitos) {
    Expresion = Expresion.trim();
    const Literal = Leerliteral(Expresion);
    if (Literal[0]) return Literal[1];
    const Partes = Expresion.split('.');
    let Valor, Encontrado = false;
    for (let Indice = Ambitos.length - 1; Indice >= 0; Indice--) {
      const Ambitoactual = Ambitos[Indice];
      if (Ambitoactual && typeof Ambitoactual === 'object' && Partes[0] in Ambitoactual) { Valor = Ambitoactual[Partes[0]]; Encontrado = true; break; }
    }
    if (!Encontrado) return undefined;
    for (let Indiceparte = 1; Indiceparte < Partes.length; Indiceparte++) { if (Valor == null) return undefined; Valor = Valor[Partes[Indiceparte]]; }
    return Valor;
  }

  function Interpolar(Texto, Ambitos) {
    return Texto.replace(Hueco, (Ignorado, Ruta) => { const Valor = Buscarvalor(Ruta, Ambitos); return Valor == null || Valor === false ? '' : String(Valor); });
  }

  function Idplantilla(Nodoplantilla) { let Identificador = Idsplantilla.get(Nodoplantilla); if (!Identificador) { Identificador = 't' + (++Secuenciaplantilla); Idsplantilla.set(Nodoplantilla, Identificador); } return Identificador; }

  function Construirnodo(Nodoplantilla, Ambitos, Contexto, Salida, Claveciclo) {
    const Llave = Idplantilla(Nodoplantilla) + Claveciclo;
    if (Nodoplantilla.nodeType === 3) {
      const Auxiliar = document.createTextNode(Nodoplantilla.nodeValue.includes('{{') ? Interpolar(Nodoplantilla.nodeValue, Ambitos) : Nodoplantilla.nodeValue);
      Auxiliar.Clavenodo = Llave; Salida.appendChild(Auxiliar); return;
    }
    if (Nodoplantilla.nodeType !== 1) return;
    const Etiquetanodo = Nodoplantilla.localName;
    if (Etiquetanodo === 'sc-for') {
      const Lista = Buscarvalor((Nodoplantilla.getAttribute('list') || '').replace(Hueco, '$1'), Ambitos);
      const Alias = Nodoplantilla.getAttribute('as') || 'item';
      if (Array.isArray(Lista)) Lista.forEach((Itemlista, Posicionlista) => {
        const Ambito = { [Alias]: Itemlista, Indiceciclo: Posicionlista };
        for (const Hijo of Nodoplantilla.childNodes) Construirnodo(Hijo, Ambitos.concat([Ambito]), Contexto, Salida, Claveciclo + '|' + Llave + ':' + Posicionlista);
      });
      return;
    }
    if (Etiquetanodo === 'sc-if') {
      if (Buscarvalor((Nodoplantilla.getAttribute('value') || '').replace(Hueco, '$1'), Ambitos)) for (const Hijo of Nodoplantilla.childNodes) Construirnodo(Hijo, Ambitos, Contexto, Salida, Claveciclo);
      return;
    }
    const Nodo = document.createElementNS(Nodoplantilla.namespaceURI, Etiquetanodo);
    Nodo.Clavenodo = Llave;
    for (const Atributo of Nodoplantilla.attributes) {
      const Nombreatributo = Atributo.name, Crudo = Atributo.value;
      if (Nombreatributo.startsWith('hint-')) continue;
      const Completo = Crudo.match(Completoexpresion);
      if (Eventos[Nombreatributo]) {
        const Funcion = Completo ? Buscarvalor(Completo[1], Ambitos) : null;
        if (typeof Funcion === 'function') Nodo.setAttribute('data-on-' + Eventos[Nombreatributo], Contexto.Manejador(Funcion));
        continue;
      }
      if (Nombreatributo === 'ref') {
        const Objetivo = Completo ? Buscarvalor(Completo[1], Ambitos) : null;
        if (Objetivo) Nodo.setAttribute('data-ref', Contexto.Referencia(Objetivo));
        continue;
      }
      let Valor = Completo ? Buscarvalor(Completo[1], Ambitos) : (Crudo.includes('{{') ? Interpolar(Crudo, Ambitos) : Crudo);
      if (Nombreatributo === 'autofocus') { if (Valor) Nodo.setAttribute('data-autofocus', ''); continue; }
      if (Nombreatributo.startsWith('aria-') && Valor != null) Valor = String(Valor);
      if (Valor === false || Valor == null) continue;
      Nodo.setAttribute(Nombreatributo, Valor === true ? '' : String(Valor));
      if (Etiquetanodo === 'textarea' && Nombreatributo === 'value') Nodo.value = String(Valor);
    }
    for (const Hijo of Nodoplantilla.childNodes) Construirnodo(Hijo, Ambitos, Contexto, Nodo, Claveciclo);
    Salida.appendChild(Nodo);
  }

  function Mismotipo(Atributo, Segundo) {
    return Atributo.nodeType === Segundo.nodeType && (Atributo.nodeType !== 1 || (Atributo.localName === Segundo.localName && Atributo.namespaceURI === Segundo.namespaceURI));
  }

  function Mezclarnodo(Vivo, Siguiente, Insertados) {
    for (const Atributo of Array.from(Vivo.attributes)) if (!Siguiente.hasAttribute(Atributo.name) && Atributo.name !== 'style') Vivo.removeAttribute(Atributo.name);
    for (const Atributo of Siguiente.attributes) if (Vivo.getAttribute(Atributo.name) !== Atributo.value) Vivo.setAttribute(Atributo.name, Atributo.value);
    if (Vivo.localName === 'input' || Vivo.localName === 'textarea') {
      const Nuevovalor = Siguiente.getAttribute('value') ?? '';
      if (Vivo.value !== Nuevovalor) Vivo.value = Nuevovalor;
    }
    Mezclarhijos(Vivo, Siguiente, Insertados);
  }

  function Mezclarhijos(Vivo, Siguiente, Insertados) {
    const Siguientesnodos = Array.from(Siguiente.childNodes);
    const Porclave = new Map();
    for (const Nodovivo of Vivo.childNodes) if (Nodovivo.Clavenodo) Porclave.set(Nodovivo.Clavenodo, Nodovivo);
    Siguientesnodos.forEach((Nodonuevo, Indice) => {
      const Posicionactual = Vivo.childNodes[Indice] || null;
      const Nodovivo = Porclave.get(Nodonuevo.Clavenodo);
      if (Nodovivo && Mismotipo(Nodovivo, Nodonuevo)) {
        Porclave.delete(Nodonuevo.Clavenodo);
        if (Nodonuevo.nodeType === 3) { if (Nodovivo.nodeValue !== Nodonuevo.nodeValue) Nodovivo.nodeValue = Nodonuevo.nodeValue; }
        else Mezclarnodo(Nodovivo, Nodonuevo, Insertados);
        if (Nodovivo !== Posicionactual) Vivo.insertBefore(Nodovivo, Posicionactual);
      } else {
        Vivo.insertBefore(Nodonuevo, Posicionactual);
        Insertados.push(Nodonuevo);
      }
    });
    while (Vivo.childNodes.length > Siguientesnodos.length) Vivo.removeChild(Vivo.lastChild);
  }

  class Componentebase {
    constructor(Propiedades) { this.Propiedades = Propiedades || {}; this.Estadocomponente = {}; }
    Cambiarestado(Actualizacion) {
      const Cambios = typeof Actualizacion === 'function' ? Actualizacion(this.Estadocomponente, this.Propiedades) : Actualizacion;
      if (Cambios == null) return;
      this.Estadocomponente = Object.assign({}, this.Estadocomponente, Cambios);
      this.Programarrender && this.Programarrender();
    }
    Forzaractualizacion() { this.Programarrender && this.Programarrender(); }
  }

  function Montar(Clasecomponente, Anfitrion, Elementoplantilla, Propiedades) {
    const Componente = new Clasecomponente(Propiedades);
    const Plantilla = Elementoplantilla.content;
    let Manejadores = new Map(), Referencias = new Map(), Programado = false, Montado = false, Estadoanterior = null;

    function Despachar(Tipoevento, Evento, Propiosolo) {
      let Detenido = false;
      let Nodo = Evento.target;
      while (Nodo && Nodo !== Anfitrion.parentNode) {
        const Identificador = Nodo.nodeType === 1 && Nodo.getAttribute('data-on-' + Tipoevento);
        if (Identificador && Manejadores.has(Identificador)) {
          Manejadores.get(Identificador)({
            type: Tipoevento, Eventonativo: Evento, target: Evento.target, currentTarget: Nodo,
            preventDefault: () => Evento.preventDefault(), stopPropagation: () => { Detenido = true; }
          });
        }
        if (Detenido || Propiosolo) break;
        Nodo = Nodo.parentNode;
      }
    }
    Anfitrion.addEventListener('click', Evento => Despachar('click', Evento));
    Anfitrion.addEventListener('input', Evento => Despachar('input', Evento));
    Anfitrion.addEventListener('change', Evento => Despachar('input', Evento));
    Anfitrion.addEventListener('scroll', Evento => Despachar('scroll', Evento, true), true);
    Anfitrion.addEventListener('touchstart', Evento => Despachar('touchstart', Evento), { passive: true });
    Anfitrion.addEventListener('touchmove', Evento => Despachar('touchmove', Evento), { passive: true });
    Anfitrion.addEventListener('touchend', Evento => Despachar('touchend', Evento), { passive: true });

    function Dibujar() {
      Programado = false;
      let Secuenciamanejador = 0, Secuenciareferencia = 0;
      const Siguientesmanejadores = new Map(), Siguientesreferencias = new Map();
      const Contexto = {
        Manejador(Funcion) { const Identificador = 'h' + (++Secuenciamanejador); Siguientesmanejadores.set(Identificador, Funcion); return Identificador; },
        Referencia(Objetivo) { const Identificador = 'r' + (++Secuenciareferencia); Siguientesreferencias.set(Identificador, Objetivo); return Identificador; }
      };
      const Valores = Componente.Valoresvista();
      const Borrador = document.createElement('div');
      for (const Nodonuevo of Plantilla.childNodes) Construirnodo(Nodonuevo, [Valores], Contexto, Borrador, '');
      const Insertados = [];
      Mezclarhijos(Anfitrion, Borrador, Insertados);
      Manejadores = Siguientesmanejadores; Referencias = Siguientesreferencias;
      Anfitrion.querySelectorAll('[data-ref]').forEach(Nodo => { const Objetivo = Referencias.get(Nodo.getAttribute('data-ref')); if (Objetivo) Objetivo.Actual = Nodo; });
      for (const Nodonuevo of Insertados) {
        if (Nodonuevo.nodeType !== 1) continue;
        const Afiliacion = Nodonuevo.hasAttribute('data-autofocus') ? Nodonuevo : Nodonuevo.querySelector('[data-autofocus]');
        if (Afiliacion) { Afiliacion.focus({ preventScroll: true }); break; }
      }
      const Estadopasado = Estadoanterior; Estadoanterior = Componente.Estadocomponente;
      if (!Montado) { Montado = true; Componente.Almontar && Componente.Almontar(); }
      else Componente.Alactualizar && Componente.Alactualizar(Componente.Propiedades, Estadopasado);
    }
    Componente.Programarrender = () => { if (!Programado) { Programado = true; queueMicrotask(Dibujar); } };
    Dibujar();
    return Componente;
  }

  window.Componentebase = Componentebase;
  window.Crearreferencia = Crearreferencia;
  window.Motorvista = { Montar };
})();
