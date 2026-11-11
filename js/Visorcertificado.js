// Visor en pantalla del reporte de simulación: lo muestra y lo guarda como PDF con la impresión del celular

function Generarcertificadopdf(Estadoactual, Calculo, Funcionaviso) {
  const Contenidohtml = Construircertificadohtml(Estadoactual, Calculo);

  if (typeof document === 'undefined') {
    if (Funcionaviso) Funcionaviso('Generación en entorno no gráfico.');
    return Contenidohtml;
  }

  let Visor = document.getElementById('mt-pdf-viewer');
  if (!Visor) {
    Visor = document.createElement('div');
    Visor.id = 'mt-pdf-viewer';
    Visor.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(11,12,10,.88);backdrop-filter:blur(10px);display:flex;flex-direction:column;align-items:center;padding:12px;box-sizing:border-box;';
    document.body.appendChild(Visor);
  }

  Visor.innerHTML = '<div style="width:100%;max-width:920px;display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:#16180F;border:1px solid rgba(255,255,255,.1);border-radius:12px 12px 0 0;box-sizing:border-box;">'
    + '<div style="display:flex;align-items:center;gap:10px"><img src="' + Logocertificado + '" style="width:28px;height:auto">'
    + '<span style="font:700 15px sans-serif;color:#F2F4EC">Reporte de simulación</span></div>'
    + '<div style="display:flex;align-items:center;gap:8px">'
    + '<button id="mt-btn-print" style="background:#D4FF3A;color:#0B0C0A;border:none;border-radius:8px;padding:8px 14px;font:600 12px sans-serif;cursor:pointer;display:flex;align-items:center;gap:6px">Guardar como PDF / Imprimir</button>'
    + '<button id="mt-btn-close" style="background:transparent;color:#A3A898;border:none;font-size:18px;cursor:pointer;padding:4px 8px">&times;</button>'
    + '</div></div>'
    + '<iframe id="mt-pdf-frame" style="width:100%;max-width:920px;flex:1;border:1px solid rgba(255,255,255,.1);border-top:none;border-radius:0 0 12px 12px;background:#0B0C0A;box-sizing:border-box"></iframe>';

  Visor.style.display = 'flex';

  const Marco = document.getElementById('mt-pdf-frame');
  const Marcodocumento = Marco.contentWindow || Marco.contentDocument;
  const Documentodestino = Marco.contentDocument || Marco.contentWindow.document;
  Documentodestino.open();
  Documentodestino.write(Contenidohtml);
  Documentodestino.close();

  document.getElementById('mt-btn-close').onclick = () => { Visor.style.display = 'none'; };
  document.getElementById('mt-btn-print').onclick = () => {
    try {
      Marco.contentWindow.focus();
      Marco.contentWindow.print();
    } catch (Falla) {
      window.print();
    }
  };

  setTimeout(() => {
    try {
      Marco.contentWindow.focus();
      Marco.contentWindow.print();
    } catch (Falla) {}
  }, 400);

  if (Funcionaviso) Funcionaviso('Reporte generado. Selecciona "Guardar como PDF" en tu celular.');
  return Contenidohtml;
}

