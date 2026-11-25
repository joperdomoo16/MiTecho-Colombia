// Visor superpuesto para previsualizar e imprimir como PDF el reporte de simulación

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
    Visor.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(11,12,10,.88);backdrop-filter:blur(10px);display:flex;flex-direction:column;align-items:center;padding:12px;box-sizing:border-box;';
    document.body.appendChild(Visor);
  }

  while (Visor.firstChild) Visor.removeChild(Visor.firstChild);

  const Cabecera = document.createElement('div');
  Cabecera.style.cssText = 'width:100%;max-width:920px;display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:#16180F;border:1px solid rgba(255,255,255,.1);border-radius:12px 12px 0 0;box-sizing:border-box;';

  const Marca = document.createElement('div');
  Marca.style.cssText = 'display:flex;align-items:center;gap:10px';
  const Logo = document.createElement('img');
  Logo.src = Logocertificado;
  Logo.alt = 'MiTecho';
  Logo.style.cssText = 'width:28px;height:auto';
  const Titulo = document.createElement('span');
  Titulo.style.cssText = 'font:700 15px sans-serif;color:#F2F4EC';
  Titulo.textContent = 'Reporte de simulación';
  Marca.appendChild(Logo);
  Marca.appendChild(Titulo);

  const Acciones = document.createElement('div');
  Acciones.style.cssText = 'display:flex;align-items:center;gap:8px';
  const Botonimprimir = document.createElement('button');
  Botonimprimir.type = 'button';
  Botonimprimir.id = 'mt-btn-print';
  Botonimprimir.style.cssText = 'background:#D4FF3A;color:#0B0C0A;border:none;border-radius:8px;padding:8px 14px;font:600 12px sans-serif;cursor:pointer;display:flex;align-items:center;gap:6px';
  Botonimprimir.textContent = 'Guardar como PDF / Imprimir';

  const Botoncerrar = document.createElement('button');
  Botoncerrar.type = 'button';
  Botoncerrar.id = 'mt-btn-close';
  Botoncerrar.setAttribute('aria-label', 'Cerrar visor');
  Botoncerrar.style.cssText = 'background:transparent;color:#A3A898;border:none;font-size:18px;cursor:pointer;padding:4px 8px';
  Botoncerrar.textContent = 'Cerrar';

  Acciones.appendChild(Botonimprimir);
  Acciones.appendChild(Botoncerrar);
  Cabecera.appendChild(Marca);
  Cabecera.appendChild(Acciones);

  const Marco = document.createElement('iframe');
  Marco.id = 'mt-pdf-frame';
  Marco.style.cssText = 'width:100%;max-width:920px;flex:1;border:1px solid rgba(255,255,255,.1);border-top:none;border-radius:0 0 12px 12px;background:#0B0C0A;box-sizing:border-box';
  Marco.srcdoc = Contenidohtml;

  Visor.appendChild(Cabecera);
  Visor.appendChild(Marco);
  Visor.style.display = 'flex';

  Botoncerrar.onclick = () => { Visor.style.display = 'none'; };
  Botonimprimir.onclick = () => {
    try {
      Marco.contentWindow.focus();
      Marco.contentWindow.print();
    } catch (Falla) {
      window.print();
    }
  };

  if (Funcionaviso) Funcionaviso('Reporte listo. Da clic en "Guardar como PDF / Imprimir" y elige "Guardar como PDF".');
  return Contenidohtml;
}
