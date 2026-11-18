// Coordinador que reúne los datos listos para mostrar en todas las pantallas de la aplicación

function Generarvalorespantallas() {
  const Calculo = this.Calcular(), Configuracion = Calculo.Configuracion, Oscuroactivo = this.Temaactual === 'oscuro';
  const Seleccion = (Activo) => ({ Fondo: Activo ? 'var(--ac)' : 'transparent', Color: Activo ? 'var(--oa)' : 'var(--ik)', Borde: Activo ? 'var(--ac)' : 'var(--ln)', Subtexto: Activo ? 'var(--oa)' : 'var(--mu)' });
  const Fichaseleccion = (Activo) => ({ Fondo: Activo ? 'var(--ik)' : 'transparent', Color: Activo ? 'var(--bg)' : 'var(--ik)', Borde: Activo ? 'var(--ik)' : 'var(--ln)' });

  const Valoresiniciovista = Generarvaloresinicio.call(this, Calculo, Configuracion, Seleccion, Oscuroactivo);
  const Valoresingresosvista = Generarvaloresingresos.call(this, Calculo, Configuracion, Seleccion, Fichaseleccion);
  const Valoressimuladorvista = Generarvaloressimulador.call(this, Calculo, Configuracion, Seleccion, Fichaseleccion);

  return {
    ...Valoresiniciovista,
    ...Valoresingresosvista,
    ...Valoressimuladorvista,
    ...this.Valoresextra(Calculo, Configuracion, Seleccion, { Fijostotal: Valoresingresosvista.Fijostotal, Semana: Valoresingresosvista.Semana, Gastosmes: Valoresingresosvista.Gastosmes }),
    ...this.Cuestionariovalores(Calculo, Fichaseleccion),
    ...this.Perfilvalores(Calculo, Fichaseleccion, Oscuroactivo),
    ...Generarvaloresautorizacion.call(this),
    ...Generarvalorescuenta.call(this),
    ...Generarvalorestutorial.call(this),
    ...Generarvalorestasas.call(this, Calculo, Seleccion),
    Descargarpdf: () => this.Generarpdf()
  };
}
