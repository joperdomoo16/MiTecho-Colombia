// Motor liviano para actualizar la pantalla del celular sin perder el foco ni las animaciones

(function () {
  const EVENTS = {
    onclick: 'click', oninput: 'input', onchange: 'input', onscroll: 'scroll',
    ontouchstart: 'touchstart', ontouchmove: 'touchmove', ontouchend: 'touchend'
  };
  const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  const WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  const tplIds = new WeakMap();
  let tplSeq = 0;

  function createRef() { return { current: null }; }

  function literal(expr) {
    if (expr === 'true') return [true, true];
    if (expr === 'false') return [true, false];
    if (expr === 'null') return [true, null];
    if (/^-?\d+(\.\d+)?$/.test(expr)) return [true, +expr];
    const m = expr.match(/^(['"])(.*)\1$/);
    return m ? [true, m[2]] : [false];
  }

  function lookup(expr, scopes) {
    expr = expr.trim();
    const lit = literal(expr);
    if (lit[0]) return lit[1];
    const parts = expr.split('.');
    let v, found = false;
    for (let i = scopes.length - 1; i >= 0; i--) {
      const s = scopes[i];
      if (s && typeof s === 'object' && parts[0] in s) { v = s[parts[0]]; found = true; break; }
    }
    if (!found) return undefined;
    for (let k = 1; k < parts.length; k++) { if (v == null) return undefined; v = v[parts[k]]; }
    return v;
  }

  function interp(str, scopes) {
    return str.replace(HOLE, (_, p) => { const v = lookup(p, scopes); return v == null || v === false ? '' : String(v); });
  }

  function tid(node) { let id = tplIds.get(node); if (!id) { id = 't' + (++tplSeq); tplIds.set(node, id); } return id; }

  function build(node, scopes, ctx, out, loopKey) {
    const key = tid(node) + loopKey;
    if (node.nodeType === 3) {
      const t = document.createTextNode(node.nodeValue.includes('{{') ? interp(node.nodeValue, scopes) : node.nodeValue);
      t.__mk = key; out.appendChild(t); return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.localName;
    if (tag === 'sc-for') {
      const list = lookup((node.getAttribute('list') || '').replace(HOLE, '$1'), scopes);
      const as = node.getAttribute('as') || 'item';
      if (Array.isArray(list)) list.forEach((item, idx) => {
        const scope = { [as]: item, $index: idx };
        for (const c of node.childNodes) build(c, scopes.concat([scope]), ctx, out, loopKey + '|' + key + ':' + idx);
      });
      return;
    }
    if (tag === 'sc-if') {
      if (lookup((node.getAttribute('value') || '').replace(HOLE, '$1'), scopes)) for (const c of node.childNodes) build(c, scopes, ctx, out, loopKey);
      return;
    }
    const el = document.createElementNS(node.namespaceURI, tag);
    el.__mk = key;
    for (const a of node.attributes) {
      const name = a.name, raw = a.value;
      if (name.startsWith('hint-')) continue;
      const whole = raw.match(WHOLE);
      if (EVENTS[name]) {
        const fn = whole ? lookup(whole[1], scopes) : null;
        if (typeof fn === 'function') el.setAttribute('data-on-' + EVENTS[name], ctx.handler(fn));
        continue;
      }
      if (name === 'ref') {
        const obj = whole ? lookup(whole[1], scopes) : null;
        if (obj) el.setAttribute('data-ref', ctx.ref(obj));
        continue;
      }
      let v = whole ? lookup(whole[1], scopes) : (raw.includes('{{') ? interp(raw, scopes) : raw);
      if (name === 'autofocus') { if (v) el.setAttribute('data-autofocus', ''); continue; }
      if (name.startsWith('aria-') && v != null) v = String(v);
      if (v === false || v == null) continue;
      el.setAttribute(name, v === true ? '' : String(v));
      if (tag === 'textarea' && name === 'value') el.value = String(v);
    }
    for (const c of node.childNodes) build(c, scopes, ctx, el, loopKey);
    out.appendChild(el);
  }

  function sameKind(a, b) {
    return a.nodeType === b.nodeType && (a.nodeType !== 1 || (a.localName === b.localName && a.namespaceURI === b.namespaceURI));
  }

  function morphEl(live, next, inserted) {
    for (const a of Array.from(live.attributes)) if (!next.hasAttribute(a.name) && a.name !== 'style') live.removeAttribute(a.name);
    for (const a of next.attributes) if (live.getAttribute(a.name) !== a.value) live.setAttribute(a.name, a.value);
    if (live.localName === 'input' || live.localName === 'textarea') {
      const nv = next.getAttribute('value') ?? '';
      if (live.value !== nv) live.value = nv;
    }
    morphChildren(live, next, inserted);
  }

  function morphChildren(live, next, inserted) {
    const nextNodes = Array.from(next.childNodes);
    const byKey = new Map();
    for (const l of live.childNodes) if (l.__mk) byKey.set(l.__mk, l);
    nextNodes.forEach((n, i) => {
      const at = live.childNodes[i] || null;
      const l = byKey.get(n.__mk);
      if (l && sameKind(l, n)) {
        byKey.delete(n.__mk);
        if (n.nodeType === 3) { if (l.nodeValue !== n.nodeValue) l.nodeValue = n.nodeValue; }
        else morphEl(l, n, inserted);
        if (l !== at) live.insertBefore(l, at);
      } else {
        live.insertBefore(n, at);
        inserted.push(n);
      }
    });
    while (live.childNodes.length > nextNodes.length) live.removeChild(live.lastChild);
  }

  class MTComponent {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(update) {
      const patch = typeof update === 'function' ? update(this.state, this.props) : update;
      if (patch == null) return;
      this.state = Object.assign({}, this.state, patch);
      this.__schedule && this.__schedule();
    }
    forceUpdate() { this.__schedule && this.__schedule(); }
  }

  function mount(Comp, host, tplEl, props) {
    const comp = new Comp(props);
    const tpl = tplEl.content;
    let handlers = new Map(), refs = new Map(), scheduled = false, mounted = false, prevState = null;

    function dispatch(type, e, ownOnly) {
      let stopped = false;
      let el = e.target;
      while (el && el !== host.parentNode) {
        const id = el.nodeType === 1 && el.getAttribute('data-on-' + type);
        if (id && handlers.has(id)) {
          handlers.get(id)({
            type, nativeEvent: e, target: e.target, currentTarget: el,
            preventDefault: () => e.preventDefault(), stopPropagation: () => { stopped = true; }
          });
        }
        if (stopped || ownOnly) break;
        el = el.parentNode;
      }
    }
    host.addEventListener('click', e => dispatch('click', e));
    host.addEventListener('input', e => dispatch('input', e));
    host.addEventListener('change', e => dispatch('input', e));
    host.addEventListener('scroll', e => dispatch('scroll', e, true), true);
    host.addEventListener('touchstart', e => dispatch('touchstart', e), { passive: true });
    host.addEventListener('touchmove', e => dispatch('touchmove', e), { passive: true });
    host.addEventListener('touchend', e => dispatch('touchend', e), { passive: true });

    function render() {
      scheduled = false;
      let hSeq = 0, rSeq = 0;
      const nextHandlers = new Map(), nextRefs = new Map();
      const ctx = {
        handler(fn) { const id = 'h' + (++hSeq); nextHandlers.set(id, fn); return id; },
        ref(obj) { const id = 'r' + (++rSeq); nextRefs.set(id, obj); return id; }
      };
      const vals = comp.renderVals();
      const scratch = document.createElement('div');
      for (const n of tpl.childNodes) build(n, [vals], ctx, scratch, '');
      const inserted = [];
      morphChildren(host, scratch, inserted);
      handlers = nextHandlers; refs = nextRefs;
      host.querySelectorAll('[data-ref]').forEach(el => { const obj = refs.get(el.getAttribute('data-ref')); if (obj) obj.current = el; });
      for (const n of inserted) {
        if (n.nodeType !== 1) continue;
        const af = n.hasAttribute('data-autofocus') ? n : n.querySelector('[data-autofocus]');
        if (af) { af.focus({ preventScroll: true }); break; }
      }
      const ps = prevState; prevState = comp.state;
      if (!mounted) { mounted = true; comp.componentDidMount && comp.componentDidMount(); }
      else comp.componentDidUpdate && comp.componentDidUpdate(comp.props, ps);
    }
    comp.__schedule = () => { if (!scheduled) { scheduled = true; queueMicrotask(render); } };
    render();
    return comp;
  }

  window.MTComponent = MTComponent;
  window.createRef = createRef;
  window.MT = { mount };
})();
