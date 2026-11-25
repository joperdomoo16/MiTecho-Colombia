// Coordinador que reúne los datos listos para mostrar en todas las pantallas de la aplicación

function Generarvalorespantallas() {
  const Calculo = this.Calcular(), Configuracion = Calculo.Configuracion, Oscuroactivo = this.Temaactual === 'oscuro';
  const Seleccion = (Activo) => ({ Activo, Clase: Activo ? 'is-activa' : '', Fondo: Activo ? 'var(--ac)' : 'transparent', Color: Activo ? 'var(--oa)' : 'var(--ik)', Borde: Activo ? 'var(--ac)' : 'var(--ln)', Subtexto: Activo ? 'var(--oa)' : 'var(--mu)' });
  const Fichaseleccion = (Activo) => ({ Activo, Clase: Activo ? 'is-activa' : '', Fondo: Activo ? 'var(--ik)' : 'transparent', Color: Activo ? 'var(--bg)' : 'var(--ik)', Borde: Activo ? 'var(--ik)' : 'var(--ln)' });

  const Valoresiniciovista = Generarvaloresinicio.call(this, Calculo, Configuracion, Seleccion, Oscuroactivo);
  const Valoresingresosvista = Generarvaloresingresos.call(this, Calculo, Configuracion, Seleccion, Fichaseleccion);
  const Valoressimuladorvista = Generarvaloressimulador.call(this, Calculo, Configuracion, Seleccion, Fichaseleccion);
  const Valoresmenuvista = Generarvaloresmenu.call(this);
  const Valorestipovista = Generarvalorestipovivienda.call(this, Calculo, Seleccion);

  return {
    ...Valoresiniciovista,
    ...Valoresingresosvista,
    ...Valoressimuladorvista,
    ...Valoresmenuvista,
    ...this.Valoresextra(Calculo, Configuracion, Seleccion),
    ...Generarvaloressetup.call(this, Calculo, Fichaseleccion),
    ...this.Perfilvalores(Calculo, Fichaseleccion, Oscuroactivo),
    ...Generarvaloresautorizacion.call(this),
    ...Generarvalorescuenta.call(this),
    ...Generarvalorestutorial.call(this),
    ...Generarvalorestasas.call(this, Calculo, Seleccion),
    ...Valorestipovista,
    ...Generarvalorestema.call(this, Seleccion),
    ...Generarvalorescalculo.call(this, Calculo, Configuracion),
    ...Generarvaloresplan.call(this, Calculo, Valorestipovista.Tiporecomendado),
    ...Generarvaloresdeudas.call(this, Calculo),
    ...Generarvaloresmovimientos.call(this, Calculo),
    ...Generarvaloressiguientepaso.call(this, Calculo, Valorestipovista.Tiporecomendado),
    ...Generarvaloresviviendas.call(this, Calculo),
    ...Generarvaloresreporte.call(this, Calculo),
    ...Generarvaloressubsidios.call(this, Calculo, Seleccion),
    ...Generarvaloresayuda.call(this, Calculo),
    ...Generarvaloresinvitado.call(this, Valoresmenuvista.Menuitems),
    Descargarpdf: () => this.Cambiarestado({ Panel: 'reporte', Reportelisto: false })
  };
}
