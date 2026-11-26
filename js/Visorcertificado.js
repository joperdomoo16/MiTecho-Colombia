// Visor superpuesto para previsualizar e imprimir como PDF el reporte de simulación

function Cerrarvisorcertificado() {
  if (typeof document === 'undefined') return false;
  const Visor = document.getElementById('mt-pdf-viewer');
  if (!Visor || Visor.style.display === 'none') return false;
  Visor.style.display = 'none';
  if (typeof Sincronizarbanner === 'function') Sincronizarbanner('ver');
  return true;
}

function Generarcertificadopdf(Estadoactual, Calculo, Funcionaviso) {
  const Contenidohtml = Construircertificadohtml(Estadoactual, Calculo);

  if (typeof document === 'undefined') {
    if (Funcionaviso) Funcionaviso('Generación en entorno sin pantalla.');
    return Contenidohtml;
  }

  let Visor = document.getElementById('mt-pdf-viewer');
  if (!Visor) {
    Visor = document.createElement('div');
    Visor.id = 'mt-pdf-viewer';
    document.body.appendChild(Visor);
  }
  Visor.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#0B0C0A;display:flex;flex-direction:column;align-items:center;'
    + 'padding:calc(var(--sat-eff, env(safe-area-inset-top, 0px)) + 8px) calc(var(--sar-eff, env(safe-area-inset-right, 0px)) + 8px) '
    + 'calc(var(--sab-base, env(safe-area-inset-bottom, 0px)) + 8px) calc(var(--sal-eff, env(safe-area-inset-left, 0px)) + 8px);box-sizing:border-box;';

  while (Visor.firstChild) Visor.removeChild(Visor.firstChild);

  const Cabecera = document.createElement('div');
  Cabecera.style.cssText = 'width:100%;max-width:920px;flex:none;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 12px;background:#16180F;border:1px solid rgba(255,255,255,.12);border-radius:14px 14px 0 0;box-sizing:border-box;';

  const Marca = document.createElement('div');
  Marca.style.cssText = 'display:flex;align-items:center;gap:8px;min-width:0;flex:1 1 auto;';
  const Logo = document.createElement('img');
  Logo.src = Logocertificado;
  Logo.alt = 'MiTecho';
  Logo.style.cssText = 'width:24px;height:24px;flex:none;border-radius:6px;';
  const Titulo = document.createElement('span');
  Titulo.style.cssText = 'font:700 14px/1.2 sans-serif;color:#F2F4EC;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
  Titulo.textContent = 'Reporte PDF';
  Marca.appendChild(Logo);
  Marca.appendChild(Titulo);

  const Acciones = document.createElement('div');
  Acciones.style.cssText = 'display:flex;align-items:center;gap:8px;flex:none;';

  const Botonimprimir = document.createElement('button');
  Botonimprimir.type = 'button';
  Botonimprimir.id = 'mt-btn-print';
  Botonimprimir.style.cssText = 'min-height:40px;background:#D4FF3A;color:#0B0C0A;border:none;border-radius:20px;padding:0 14px;font:700 13px/1 sans-serif;cursor:pointer;white-space:nowrap;';
  Botonimprimir.textContent = 'Guardar PDF';

  const Botoncerrar = document.createElement('button');
  Botoncerrar.type = 'button';
  Botoncerrar.id = 'mt-btn-close';
  Botoncerrar.setAttribute('aria-label', 'Cerrar visor');
  Botoncerrar.style.cssText = 'min-height:40px;background:#22251B;color:#F2F4EC;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:0 14px;font:600 13px/1 sans-serif;cursor:pointer;white-space:nowrap;';
  Botoncerrar.textContent = 'Cerrar';

  Acciones.appendChild(Botonimprimir);
  Acciones.appendChild(Botoncerrar);
  Cabecera.appendChild(Marca);
  Cabecera.appendChild(Acciones);

  const Marco = document.createElement('iframe');
  Marco.id = 'mt-pdf-frame';
  Marco.style.cssText = 'width:100%;max-width:920px;flex:1 1 auto;min-height:0;border:1px solid rgba(255,255,255,.12);border-top:none;border-radius:0 0 14px 14px;background:#0B0C0A;box-sizing:border-box;';
  Marco.srcdoc = Contenidohtml;

  Visor.appendChild(Cabecera);
  Visor.appendChild(Marco);
  Visor.style.display = 'flex';
  if (typeof Sincronizarbanner === 'function') Sincronizarbanner('nada');

  Botoncerrar.onclick = () => { Cerrarvisorcertificado(); };
  Botonimprimir.onclick = () => {
    const Puente = typeof window !== 'undefined' ? window.Puentenativo : null;
    if (Puente && typeof Puente.imprimirReporte === 'function') {
      Puente.imprimirReporte(Contenidohtml, 'Reporte MiTecho');
      return;
    }
    try {
      Marco.contentWindow.focus();
      Marco.contentWindow.print();
    } catch (Falla) {
      window.print();
    }
  };

  if (Funcionaviso) Funcionaviso('Reporte listo. Toca "Guardar PDF" para descargarlo o imprimirlo.');
  return Contenidohtml;
}
