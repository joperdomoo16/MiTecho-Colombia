// Estilos complementarios del reporte PDF: entidad, tabla de deudas, guía de hoja 3 e impresión

const Estiloscertificadocomplemento = `
/* Tarjeta de Caja o entidad financiera */
.caja{
  position:relative;
  background:var(--mitecho-tarjeta);
  color:var(--mitecho-texto);
  border-radius:16px;
  padding:15px 20px 13px;
  overflow:hidden;
}
.caja::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:
    linear-gradient(rgba(212,255,58,.04) 1px,transparent 1px) 0 0/24px 24px,
    linear-gradient(90deg,rgba(212,255,58,.04) 1px,transparent 1px) 0 0/24px 24px;
  -webkit-mask-image:linear-gradient(100deg,transparent 35%,#000 100%);
          mask-image:linear-gradient(100deg,transparent 35%,#000 100%);
}
.caja__grid{
  position:relative;z-index:1;
  display:grid;
  grid-template-columns:1.15fr 1.1fr .85fr;
  gap:20px;
  align-items:start;
}
.caja__entidad{display:flex;gap:12px;align-items:center}
.caja__logo{
  flex:none;
  display:grid;place-items:center;
  width:50px;height:50px;
  border-radius:12px;
  background:var(--mitecho-sub);
  border:1px solid rgba(212,255,58,.35);
  font:700 18px/1 var(--f-display);
  color:var(--mitecho-acento);
  letter-spacing:-.02em;
}
.caja__entidad h3{font:600 22px/1.1 var(--f-display);letter-spacing:-.015em}
.caja__entidad p{margin-top:3px;font-size:11px;color:var(--mitecho-gris);line-height:1.35}
.caja__dato > span{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--mitecho-gris)}
.caja__dato strong{display:block;margin-top:6px;font:700 27px/1 var(--f-display);letter-spacing:-.025em}
.caja__dato small{display:block;margin-top:5px;font-size:11px;color:var(--mitecho-gris)}
.caja__dato--subsidio strong{color:var(--mitecho-acento)}
.chip{display:inline-block;padding:3px 8px;border-radius:999px;font:600 10.5px/1.2 var(--f-texto)}
.chip--asignado{background:var(--mitecho-acento);color:var(--tinta)}
.chip--estudio{background:var(--mitecho-dorado);color:var(--tinta)}
.chip--no-aplica{background:var(--mitecho-sub);color:var(--mitecho-gris)}

.pasos{
  position:relative;z-index:1;
  display:grid;grid-template-columns:repeat(4,1fr);
  margin-top:13px;padding-top:11px;
  border-top:1px solid rgba(242,244,236,.1);
}
.paso{position:relative;padding-right:10px}
.paso::before{content:"";position:absolute;left:18px;right:2px;top:7px;height:2px;background:var(--mitecho-sub)}
.paso:last-child::before{display:none}
.paso.hecho::before{background:var(--mitecho-acento)}
.paso.hecho:has(+ .pendiente)::before{background:var(--mitecho-sub)}
.paso i{
  position:relative;z-index:1;
  display:grid;place-items:center;
  width:16px;height:16px;border-radius:50%;
  border:2px solid var(--mitecho-tenue);
  background:var(--mitecho-tarjeta);
}
.paso.hecho i{background:var(--mitecho-acento);border-color:var(--mitecho-acento)}
.paso.hecho i svg{width:9px;height:9px}
.paso b{display:block;margin-top:7px;font:600 11.5px/1.2 var(--f-texto)}
.paso span{display:block;margin-top:1px;font-size:10.5px;color:var(--mitecho-gris)}
.paso.pendiente b{color:var(--mitecho-gris)}

/* Tabla de deudas y bloque legal */
.deudas{width:100%;border-collapse:collapse;font-size:11.5px}
.deudas th,.deudas td{padding:3.5px 8px;text-align:left;vertical-align:middle}
.deudas thead th{font:600 10.5px/1.2 var(--f-texto);color:var(--tinta-3);border-bottom:1px solid var(--linea-fuerte);padding-top:0;padding-bottom:5px}
.deudas .num{text-align:right;font:500 11.5px var(--f-mono);white-space:nowrap}
.deudas thead .num{font:600 10.5px/1.2 var(--f-texto)}
.deudas td:first-child,.deudas th:first-child{padding-left:12px}
.deudas tbody tr:not(.titular) td{border-bottom:1px dashed var(--linea);color:var(--tinta-2)}
.deudas tbody tr:not(.titular) .num{color:var(--tinta)}
.deudas .titular th,.deudas .titular td{padding-top:7px;border-bottom:1px solid var(--linea);font-weight:600}
.deudas .titular th{font:600 12px/1.2 var(--f-texto)}
.deudas .titular th i{display:inline-block;width:9px;height:9px;margin-right:8px;border-radius:2px;background:var(--c);vertical-align:0}
.deudas .titular th small{margin-left:6px}
.deudas .titular .num{font-weight:600;color:var(--c)}
.deudas .titular small{font-weight:400;color:var(--tinta-3);font-size:11px}
.deudas tbody.p1{--c:var(--p1)}
.deudas tbody.p2{--c:var(--p2)}
.deudas tr.excluida td{color:var(--mitecho-tenue)!important;text-decoration:none}
.deudas tr.excluida td:first-child span{text-decoration:line-through;text-decoration-color:var(--linea-fuerte)}
.deudas tfoot th,.deudas tfoot td{padding-top:6px;border-top:1.5px solid var(--tinta);font-weight:600}
.deudas tfoot .num{font-weight:600}
.estado{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.estado::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--mitecho-naranja)}
.estado--excluida::before{background:transparent;box-shadow:inset 0 0 0 1.5px var(--mitecho-tenue)}

.legal{display:grid;grid-template-columns:1fr 84px;gap:20px;align-items:start;padding:12px 0 0;border-top:1px solid var(--linea)}
.legal h2{font:600 12px/1.2 var(--f-display);margin-bottom:4px}
.legal p{column-count:2;column-gap:22px;column-fill:balance;font-size:10px;line-height:1.45;color:var(--tinta-3)}
.verifica{text-align:center;align-self:center}

.aviso-simulacion{
  margin:0;
  padding:6px 18px;
  background:#FFF4D6;
  border-bottom:1px solid #E8C96A;
  color:#5A4300;
  font-size:9.5px;
  line-height:1.35;
  font-weight:600;
  text-align:center;
  flex:none;
}

.documentos{display:grid;grid-template-columns:1fr 1fr;gap:2px 24px;margin:4px 0 0;padding-left:0;font-size:10.5px;line-height:1.45;color:var(--tinta-2)}
.documentos li{margin:0}
.documentos-nota{margin:4px 0 0;font-size:10px;line-height:1.4;color:var(--tinta-3)}
.verifica svg{display:block;width:72px;height:72px;margin:0 auto;fill:var(--tinta)}
.verifica span{display:block;margin-top:6px;font-size:9.5px;line-height:1.3;color:var(--tinta-3)}
.verifica .mono{font-size:9.5px;color:var(--tinta-2)}

/* Guía de lectura y glosario en hoja 3 */
.eje .eje__guia{text-align:left;color:var(--mitecho-oliva);font-weight:600}
.guia__titulo{font:700 27px/1.05 var(--f-display);letter-spacing:-.025em}
.guia__lead{margin-top:6px;font-size:13px;line-height:1.5;color:var(--tinta-2)}
.guia__pregunta{margin:-2px 0 11px;font-size:12.5px;line-height:1.5;color:var(--tinta-2)}
.guia__pregunta strong{color:var(--tinta);font-weight:600}
.bloque__cab .guia__hoja{font:500 10.5px/1 var(--f-mono);color:var(--mitecho-texto);background:var(--mitecho-azul);padding:4px 8px;border-radius:4px}

.lectura{border:1px solid var(--linea);border-radius:12px;background:var(--papel-alto);padding:4px 16px 4px}
.lectura__paso,.lectura__cab{display:grid;grid-template-columns:24px 1fr 250px;gap:16px;align-items:start}
.lectura__paso{padding:7px 0}
.lectura__paso + .lectura__paso{border-top:1px solid var(--linea-fuerte)}
.lectura__cab{padding:5px 0 0}
.lectura__cab span{font-size:10px;color:var(--mitecho-tenue)}
.lectura .cascada__fila,.lectura .eje{grid-template-columns:128px 1fr 58px;gap:10px}
.lectura .eje{padding:0}
.lectura .cascada__fila dd:last-child{font-size:11.5px}
.lectura .cascada__fila:first-child{border-top:0}
.lectura__num{
  display:grid;place-items:center;
  width:22px;height:22px;margin-top:1px;
  border-radius:50%;
  background:var(--mitecho-acento);
  box-shadow:inset 0 0 0 1.5px var(--tinta);
  font:700 12px/1 var(--f-display);
}
.lectura__nota{font-size:11.5px;line-height:1.45;color:var(--tinta-2)}
.lectura__nota b{font:600 12px/1.3 var(--f-display);color:var(--tinta)}
.lectura__claves{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:9px;font-size:11px;color:var(--tinta-3)}
.signos{display:flex;gap:14px;white-space:nowrap}
.signos b{font:600 12px var(--f-mono);color:var(--tinta);margin-right:4px}
.leyenda{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px 14px}
.leyenda li{display:flex;align-items:center;gap:6px;white-space:nowrap}
.leyenda i{display:block;width:16px;height:10px;border-radius:2px}

.medidor-guia{
  display:grid;
  grid-template-columns:1.5fr 1fr;
  gap:28px;
  align-items:center;
  padding:10px 18px 14px;
  border:1px solid var(--linea);
  border-radius:12px;
  background:var(--papel-alto);
}
.mg{display:flex;align-items:center;gap:10px;padding:34px 0 36px}
.mg > span{font:500 10.5px var(--f-mono);color:var(--mitecho-tenue)}
.mg__pista{position:relative;flex:1;height:14px;border-radius:7px;background:var(--linea)}
.mg__pista > i{position:absolute;inset:0 auto 0 0;border-radius:7px;background:var(--mitecho-azul)}
.mg__pista > b{position:absolute;top:-6px;bottom:-6px;width:3px;margin-left:-1.5px;background:var(--tinta);border-radius:1px}
.mg__tag{position:absolute;display:flex;height:24px;font-size:11px;line-height:1.2;color:var(--tinta-2);white-space:nowrap}
.mg__tag strong{font:700 13px/1 var(--f-display);color:var(--tinta);margin-right:5px}
.mg__tag--linea{bottom:100%;margin-bottom:6px;margin-left:-.75px;padding-left:7px;border-left:1.5px solid var(--tinta);align-items:flex-start}
.mg__tag--valor{top:100%;margin-top:4px;transform:translateX(-100%);margin-left:.75px;padding-right:7px;border-right:1.5px solid var(--mitecho-azul);align-items:flex-end}
.mg__tag--valor-der{transform:none;margin-left:-.75px;padding-right:0;padding-left:7px;border-right:0;border-left:1.5px solid var(--mitecho-azul)}
.medidor-guia__regla{font-size:12px;line-height:1.5;color:var(--tinta-2)}
.medidor-guia__regla b{display:block;margin-bottom:2px;font:600 12.5px/1.3 var(--f-display);color:var(--tinta)}

.medidores--guia{margin-top:14px;gap:24px}
.medidor__que{margin-top:8px;font-size:11.5px;line-height:1.45;color:var(--tinta)}
.medidor__ejemplo{margin-top:7px;font-size:11.5px;line-height:1.45;color:var(--tinta-2)}
.medidor__ejemplo b{font-weight:600;color:var(--tinta)}

.glosario{display:grid;grid-template-columns:repeat(3,1fr);gap:8px 24px}
.glosario div{padding-top:6px;border-top:1px solid var(--linea)}
.glosario dt{font:600 12.5px/1.25 var(--f-display)}
.glosario dd{margin-top:2px;font-size:11px;line-height:1.42;color:var(--tinta-3)}

@page{size:letter;margin:0}
@media print{
  body{background:none}
  .doc{display:block;padding:0}
  .hoja{box-shadow:none;zoom:1;break-after:page;page-break-after:always}
  .hoja:last-child{break-after:auto;page-break-after:auto}
}
`;

const Estiloscertificado = Estiloscertificadobase + Estiloscertificadocomplemento;
