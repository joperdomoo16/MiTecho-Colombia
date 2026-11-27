// Datos de la pantalla «Tu reporte en PDF»: vista previa y descarga con recompensa

const Etiquetastipoingreso = { fijo: 'Salario fijo', variable: 'Ingresos que cambian', mixto: 'Salario e ingresos variables' };

function Generarvaloresreporte(Calculo) {
  const Estadoactual = this.Estadocomponente;
  if (this.Pantalla !== 'app' || Estadoactual.Panel !== 'reporte') return { Esreporte: false };

  const Partes = [];
  const Primernombre = (Estadoactual.Nombre || '').trim().split(/\s+/)[0];
  if (Primernombre) Partes.push(Primernombre);
  Partes.push(Estadoactual.Ciudad || 'Bogotá');
  Partes.push(Etiquetastipoingreso[Estadoactual.Tipo] || 'Salario fijo');

  const Fechahoy = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '');
  const Volvertexto = this.Pestana === 'simulador' && Estadoactual.Simuladorpaso === 'result'
    ? 'Tu resultado' : (Nombrespestanas[this.Pestana] || 'Tu resultado');

  const Vistos = Number(Estadoactual.Anunciospdf || 0);
  const Faltan = Math.max(0, 3 - Vistos);
  const Desbloqueado = Boolean(Estadoactual.Desbloqueadopdf);
  let Botontexto = 'Ver un video corto y descargar';
  if (Desbloqueado) {
    Botontexto = 'Descargar reporte en PDF';
  } else if (Vistos > 0) {
    Botontexto = 'Ver un video corto y descargar (' + (Vistos + 1) + '/3)';
  }
  const Pienota = Desbloqueado
    ? 'Se abrirá la vista previa para guardarlo en PDF o imprimirlo.'
    : 'Es gratis: lo pagan los anuncios. Faltan ' + Faltan + (Faltan === 1 ? ' video corto' : ' videos cortos') + ' (si no hay video disponible, igual se descarga).';

  return {
    Esreporte: true,
    Reportevolver: Volvertexto,
    Reportefecha: Fechahoy,
    Reporteperfilresumen: Partes.join(' · '),
    Reporteinicio: !Estadoactual.Reportelisto,
    Reportelisto: Boolean(Estadoactual.Reportelisto),
    Reportemuestravideo: !Desbloqueado,
    Reportedesbloqueado: Desbloqueado,
    Reportebotontexto: Botontexto,
    Reportepienota: Pienota,
    Acciondescargarreporte: () => this.Generarpdf(),
    Abrirreporte: () => Generarcertificadopdf(Estadoactual, Calculo, Mensaje => this.Aviso(Mensaje)),
    Compartirreporte: async () => {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: 'Reporte MiTecho Colombia',
            text: 'Reporte MiTecho: vivienda hasta $' + Formatomillones(Calculo.Preciotecho) + ' M, préstamo $' + Formatomillones(Calculo.Creditotecho) + ' M, cuota estimada ' + Formatoenteropesos(Calculo.Cuotatecho) + '/mes.'
          });
          return;
        } catch (Falla) {}
      }
      Generarcertificadopdf(Estadoactual, Calculo, Mensaje => this.Aviso(Mensaje));
    }
  };
}
