// Coordinador que reúne los datos listos para mostrar en todas las pantallas de la aplicación

function Generarvalorespantallas() {
  const c = this.calc(), cfg = c.cfg, dark = this.T === 'oscuro';
  const sel = (on) => ({ bg: on ? 'var(--ac)' : 'transparent', color: on ? 'var(--oa)' : 'var(--ik)', border: on ? 'var(--ac)' : 'var(--ln)', sub: on ? 'var(--oa)' : 'var(--mu)' });
  const chipSel = (on) => ({ bg: on ? 'var(--ik)' : 'transparent', color: on ? 'var(--bg)' : 'var(--ik)', border: on ? 'var(--ik)' : 'var(--ln)' });

  const valsInicio = Generarvaloresinicio.call(this, c, cfg, sel, dark);
  const valsIngresos = Generarvaloresingresos.call(this, c, cfg, sel, chipSel);
  const valsSimulador = Generarvaloressimulador.call(this, c, cfg, sel, chipSel);

  return {
    ...valsInicio,
    ...valsIngresos,
    ...valsSimulador,
    ...this.extraVals(c, cfg, sel, { fixTot: valsIngresos.fixTot, wk: valsIngresos.wk, gastosMes: valsIngresos.gastosMes }),
    ...this.setupVals(c, chipSel),
    ...this.profileVals(c, chipSel, dark),
    downloadPdf: () => this.generatePdf()
  };
}
