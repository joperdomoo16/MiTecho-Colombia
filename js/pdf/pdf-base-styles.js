// Hoja de estilos principal del reporte PDF: variables de marca, portada y gráfica de cierre

const Estiloscertificadobase = `
:root{
  --mitecho-acento:#D4FF3A;
  --mitecho-azul:#1E345B;
  --mitecho-azul-oscuro:#0B1A39;
  --mitecho-naranja:#FF6A2B;
  --mitecho-dorado:#FFD23F;
  --mitecho-oliva:#4E6E00;
  --mitecho-fondo:#0B0C0A;
  --mitecho-tarjeta:#16180F;
  --mitecho-sub:#24271C;
  --mitecho-texto:#F2F4EC;
  --mitecho-gris:#A3A898;
  --mitecho-tenue:#6F7466;
  --papel:#F2F4EC;
  --papel-alto:#F9FAF5;
  --tinta:#0B0C0A;
  --tinta-2:#3A3E32;
  --tinta-3:#5E6356;
  --linea:#D6DACB;
  --linea-fuerte:#B7BCAA;
  --p1:var(--mitecho-azul);
  --p2:var(--mitecho-oliva);
  --f-display:'Familjen Grotesk','Hanken Grotesk',sans-serif;
  --f-texto:'Hanken Grotesk',system-ui,sans-serif;
  --f-mono:'IBM Plex Mono',ui-monospace,monospace;
  --margen:48px;
}

*,*::before,*::after{box-sizing:border-box}
html,body{margin:0}
body{
  background:var(--mitecho-fondo);
  color:var(--tinta);
  font:400 12px/1.45 var(--f-texto);
  -webkit-font-smoothing:antialiased;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
  font-variant-numeric:tabular-nums;
}
h1,h2,h3,p,dl,dd,ol,ul,figure{margin:0}
ol,ul{padding:0;list-style:none}
.mono{font-family:var(--f-mono);font-weight:500;letter-spacing:-.01em}

.doc{
  display:grid;
  justify-content:center;
  gap:36px;
  padding:40px 16px 64px;
}
.hoja{
  position:relative;
  width:8.5in;
  height:11in;
  overflow:hidden;
  background:var(--papel);
  display:flex;
  flex-direction:column;
  box-shadow:0 1px 0 rgba(255,255,255,.06),0 28px 70px rgba(0,0,0,.55);
  zoom:var(--z,1);
}

/* Cabecera azul de la primera hoja */
.plano{
  position:relative;
  color:var(--mitecho-texto);
  padding:14px var(--margen) 20px;
  background:
    linear-gradient(rgba(242,244,236,.055) 1px,transparent 1px) 0 0/120px 120px,
    linear-gradient(90deg,rgba(242,244,236,.055) 1px,transparent 1px) 0 0/120px 120px,
    linear-gradient(rgba(242,244,236,.028) 1px,transparent 1px) 0 0/24px 24px,
    linear-gradient(90deg,rgba(242,244,236,.028) 1px,transparent 1px) 0 0/24px 24px,
    linear-gradient(158deg,var(--mitecho-azul) 0%,var(--mitecho-azul-oscuro) 72%);
}
.plano__top{display:flex;justify-content:space-between;align-items:flex-start;gap:24px}
.marca{display:flex;align-items:center;gap:12px}
.marca img{width:52px;height:auto;display:block}
.marca__nombre{display:block;font:700 25px/1 var(--f-display);letter-spacing:-.02em}
.marca__doc{display:block;margin-top:5px;font:600 12.5px/1.2 var(--f-texto);color:var(--mitecho-gris)}

.cajetin{
  display:grid;
  grid-template-columns:repeat(3,auto);
  border:1px solid rgba(242,244,236,.24);
  border-radius:3px;
  background:rgba(11,26,57,.55);
}
.cajetin div{
  padding:6px 11px 7px;
  border-right:1px solid rgba(242,244,236,.16);
  border-bottom:1px solid rgba(242,244,236,.16);
}
.cajetin div:nth-child(3n){border-right:0}
.cajetin div:nth-last-child(-n+3){border-bottom:0}
.cajetin dt{font:600 9.5px/1.2 var(--f-texto);color:var(--mitecho-gris)}
.cajetin dd{margin-top:2px;font:500 11px/1.25 var(--f-mono);color:var(--mitecho-texto);white-space:nowrap}

.plano__frase{margin-top:14px;font:400 18px/1.3 var(--f-texto);color:var(--mitecho-texto)}
.plano__cifra{
  display:flex;
  align-items:baseline;
  margin-top:2px;
  font:700 86px/.92 var(--f-display);
  letter-spacing:-.045em;
  color:var(--mitecho-acento);
}
.plano__cifra .moneda{font-size:48px;align-self:flex-start;margin:9px 6px 0 0;letter-spacing:0}
.plano__cifra .unidad{margin-left:16px;font:600 30px/1 var(--f-display);letter-spacing:-.02em;color:var(--mitecho-texto)}

.cota{margin-top:18px}
.cota svg{display:block;width:100%;height:auto;overflow:visible}
.cota__txt{font:500 10.5px var(--f-mono);fill:var(--mitecho-gris)}
.cota__pct{font:600 11px var(--f-mono);fill:var(--mitecho-texto)}
.cota__leyenda{display:grid;grid-template-columns:80fr 20fr;gap:4px;margin-top:9px}
.cota__leyenda p{font-size:11px;color:var(--mitecho-gris);line-height:1.35}
.cota__leyenda strong{display:block;font:600 14px/1.2 var(--f-mono);color:var(--mitecho-texto)}
.cota__leyenda p:last-child strong{color:var(--mitecho-acento)}

.plano__datos{
  display:grid;
  grid-template-columns:1.05fr 1fr 1fr;
  margin-top:16px;
  border-top:1px solid rgba(242,244,236,.18);
}
.plano__datos li{padding:11px 16px 0 0}
.plano__datos li + li{padding-left:16px;border-left:1px solid rgba(242,244,236,.12)}
.plano__datos span{display:block;font-size:11px;color:var(--mitecho-gris)}
.plano__datos strong{display:block;margin:3px 0 2px;font:600 21px/1.1 var(--f-display);letter-spacing:-.015em;color:var(--mitecho-texto)}
.plano__datos small{font-size:11px;color:var(--mitecho-gris)}

/* Tarjetas de solicitantes, ecuación y medidores en fondo papel */
.cuerpo{flex:1;padding:14px var(--margen) 0}
.bloque + .bloque{margin-top:9px}
.bloque__cab{display:flex;justify-content:space-between;align-items:baseline;gap:20px;margin-bottom:10px}
.bloque__cab h2{font:600 18px/1.2 var(--f-display);letter-spacing:-.01em}
.bloque__cab p{font-size:11.5px;color:var(--tinta-3);text-align:right}

.solicitantes{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.persona{
  --c:var(--p1);
  position:relative;
  background:var(--papel-alto);
  border:1px solid var(--linea);
  border-radius:12px;
  padding:12px 16px 10px;
  overflow:hidden;
}
.persona--2{--c:var(--p2)}
.persona__rol{display:flex;align-items:center;gap:7px;font:600 11px/1 var(--f-texto);color:var(--c)}
.persona__rol .mono{padding:3px 6px;border-radius:4px;background:var(--c);color:var(--mitecho-texto);font-size:10px}
.persona h3{margin-top:7px;font:600 19px/1.15 var(--f-display);letter-spacing:-.015em}
.persona__perfil{margin-top:2px;font-size:11.5px;color:var(--tinta-3)}
.cuentas{margin-top:8px}
.cuentas div{display:flex;justify-content:space-between;gap:12px;padding:3px 0;border-top:1px dashed var(--linea)}
.cuentas dt{color:var(--tinta-2)}
.cuentas dd{font:500 12px var(--f-mono);color:var(--tinta)}
.cuentas .menos dd{color:#B23F0A}
.cuentas .vacio dd{color:var(--mitecho-tenue)}
.cuentas .total{border-top:1px solid var(--linea-fuerte)}
.cuentas .total dt{font-weight:600;color:var(--tinta)}
.cuentas .total dd{font-weight:600}
.persona__cab{display:flex;justify-content:space-between;align-items:center;gap:12px}
.aporte{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--tinta-3);white-space:nowrap}
.aporte__barra{width:64px;height:6px;border-radius:3px;background:var(--linea);overflow:hidden}
.aporte__barra i{display:block;height:100%;background:var(--c);border-radius:3px}
.aporte b{color:var(--c);font-weight:600}

.ecuacion{
  display:grid;
  grid-template-columns:1fr auto 1fr auto 1fr auto .62fr 1.1fr;
  align-items:stretch;
  border:1px solid var(--linea-fuerte);
  border-radius:12px;
  background:var(--papel-alto);
  overflow:hidden;
}
.ecuacion > div{padding:11px 12px 10px}
.ecuacion > span{display:grid;place-items:center;width:22px;font:600 18px/1 var(--f-display);color:var(--mitecho-tenue)}
.ecuacion small{display:block;font-size:10.5px;line-height:1.25;color:var(--tinta-3)}
.ecuacion strong{display:block;margin-top:5px;font:600 14px/1 var(--f-mono)}
.ecuacion:not(.ecuacion--individual){grid-template-columns:1fr auto 1fr auto 1fr auto 1fr auto .62fr 1.1fr}
.ecuacion .resultado{background:var(--mitecho-acento);border-left:1px solid var(--linea-fuerte)}
.ecuacion .resultado small{color:var(--mitecho-sub)}
.ecuacion .resultado strong{font:700 19px/1 var(--f-display);letter-spacing:-.01em;margin-top:4px}
.nota-calculo{margin-top:7px;font-size:11px;color:var(--tinta-3)}

.medidores{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:14px}
.medidor__cab{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.medidor__cab span{font-size:11px;font-weight:600;color:var(--tinta-2)}
.medidor__cab strong{font:700 18px/1 var(--f-display)}
.medidor__pista{position:relative;height:8px;margin-top:6px;border-radius:4px;background:var(--linea)}
.medidor__pista i{position:absolute;inset:0 auto 0 0;border-radius:4px;background:var(--mitecho-azul)}
.medidor__pista b{position:absolute;top:-4px;bottom:-4px;width:2px;margin-left:-1px;background:var(--tinta)}
.medidor p{margin-top:6px;font-size:10.5px;color:var(--tinta-3)}

.pie{
  display:flex;justify-content:space-between;align-items:center;gap:16px;
  margin:0 var(--margen);
  padding:10px 0 16px;
  border-top:1px solid var(--linea);
  font-size:10px;
  color:var(--tinta-3);
}
.pie .mono{font-size:10px;color:var(--tinta-2)}
.pie__ref{display:flex;gap:14px}

/* Franja superior y cascada de cierre en hoja 2 */
.franja{
  display:flex;justify-content:space-between;align-items:center;
  padding:12px var(--margen);
  color:var(--mitecho-texto);
  background:
    linear-gradient(90deg,rgba(242,244,236,.028) 1px,transparent 1px) 0 0/24px 24px,
    linear-gradient(158deg,var(--mitecho-azul) 0%,var(--mitecho-azul-oscuro) 80%);
}
.franja .marca img{width:34px}
.franja .marca__nombre{font-size:17px}
.franja .marca__doc{margin-top:3px;font-size:11px}
.franja__ref{font:400 11px/1.45 var(--f-texto);color:var(--mitecho-gris);text-align:right}
.franja__ref b{font:600 11px/1.45 var(--f-mono);color:var(--mitecho-texto)}

.estado-cierre{
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 10px 4px 8px;
  border-radius:999px;
  background:var(--mitecho-acento);
  font:600 11px/1 var(--f-texto);
  color:var(--tinta);
  white-space:nowrap;
}
.estado-cierre svg{width:12px;height:12px}

.resumen-cierre{font-size:12.5px;line-height:1.5;color:var(--tinta-2);max-width:84ch;margin:-2px 0 10px}
.resumen-cierre strong{color:var(--tinta);font-weight:600}

.cascada{border:1px solid var(--linea);border-radius:12px;background:var(--papel-alto);padding:4px 16px 8px}
.cascada__fila{display:grid;grid-template-columns:214px 1fr 112px;align-items:center;gap:14px;min-height:22px}
.cascada__fila + .cascada__fila{border-top:1px dashed var(--linea)}
.cascada__fila.suma{border-top:1px solid var(--linea-fuerte)}
.cascada__fila dt{font-size:11.5px;color:var(--tinta-2);line-height:1.25}
.cascada__fila dt .op{display:inline-block;width:14px;font-family:var(--f-mono);color:var(--mitecho-tenue)}
.cascada__fila.suma dt{font-weight:600;color:var(--tinta)}
.cascada__fila dd:last-child{text-align:right;font:500 12px var(--f-mono)}
.cascada__fila.suma dd:last-child{font-weight:600}
.cascada__fila.resta dd:last-child{color:#B23F0A}
.cascada__fila.nulo dd{color:var(--mitecho-tenue)}
.pista{position:relative;height:14px;background:linear-gradient(90deg,var(--linea) 1px,transparent 1px) 0 0/calc(100%/7) 100%;border-right:1px solid var(--linea)}
.pista i{position:absolute;top:1px;bottom:1px;border-radius:2px}
.pista em{font-style:normal;font-size:10.5px;color:var(--mitecho-tenue);position:absolute;left:4px;top:0;line-height:14px;background:var(--papel-alto);padding-right:4px}
.eje{display:grid;grid-template-columns:214px 1fr 112px;gap:14px;padding:4px 0 1px}
.eje ol{position:relative;height:14px;font:500 9.5px/14px var(--f-mono);color:var(--mitecho-tenue)}
.eje li{position:absolute;top:0;transform:translateX(-50%)}
.eje span{font-size:10px;color:var(--mitecho-tenue);text-align:right}
.c-p1{background:var(--p1)}
.c-p2{background:var(--p2)}
.c-caja{background:var(--mitecho-tarjeta)}
.c-total{background:var(--tinta-2)}
.c-cuota{background:var(--mitecho-acento);box-shadow:inset 0 0 0 1px rgba(11,12,10,.35)}
.c-gastos{background:repeating-linear-gradient(135deg,var(--mitecho-tenue) 0 2px,transparent 2px 5px);box-shadow:inset 0 0 0 1px var(--mitecho-tenue)}
.c-margen{background:var(--mitecho-acento);box-shadow:inset 0 0 0 1.5px var(--tinta)}
`;
