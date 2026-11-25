// Foto de perfil y menú que se abre desde ella: opciones, datos de la cuenta y cambio de foto.
// Se llama con .call desde la app para que this sea la aplicación.

function Generarvaloresmenu() {
  const Estadoactual = this.Estadocomponente, Oscuroactivo = this.Temaactual === 'oscuro';
  const Fotosegura = Imagensegura(Estadoactual.Avatarimagen);
  return {
    Correovisible: (Estadoactual.Correo || '') + ' · ' + (Estadoactual.Metodoingreso === 'google' ? 'Google' : 'Correo'),
    Abrirmenu: () => this.Cambiarestado({ Panel: 'perfil', Menu: false }),
    Cerrarmenu: () => this.Cambiarestado({ Menu: false }),
    Avatarimagen: Fotosegura,
    Tieneavatarimagen: !!Fotosegura,
    Sinavatarimagen: !Fotosegura,
    Avatarfondo: Fotosegura ? 'transparent' : 'var(--ac)',
    Avatartexto: Fotosegura ? 'transparent' : 'var(--oa)',
    Avatarbordepequeno: '1px solid var(--ln)',
    Avatarbordegrande: '2px solid var(--ln)',
    Avatarsombra: Estadoactual.Menu ? '0 0 0 4px var(--ad)' : 'none',
    Abrirselectorfoto: () => {
      if (typeof document !== 'undefined') {
        const Nodo = document.getElementById('mt-avatar-input');
        if (Nodo) { Nodo.value = ''; Nodo.click(); }
      }
    },
    Cambiararchivoavatar: (Elemento) => {
      const Destinoconsignacion = (Elemento.Eventonativo && Elemento.Eventonativo.target) || Elemento.target;
      const Archivo = Destinoconsignacion && Destinoconsignacion.files && Destinoconsignacion.files[0];
      if (!Archivo) return;
      if (!Archivo.type || !Archivo.type.startsWith('image/')) {
        this.Aviso('Por favor selecciona una imagen válida.');
        return;
      }
      if (Archivo.size > 8 * 1024 * 1024) {
        this.Aviso('La imagen no debe superar los 8 MB.');
        return;
      }
      Procesarfotoperfil(Archivo, (Imagendatos) => {
        this.Cambiarestado({ Avatarimagen: Imagendatos });
        this.Aviso('Foto de perfil actualizada.');
      });
    },
    Quitaravatarimagen: () => {
      this.Cambiarestado({ Avatarimagen: '' });
      this.Aviso('Foto de perfil eliminada.');
    },
    Menuopacidad: Estadoactual.Menu ? 1 : 0,
    Menueventos: Estadoactual.Menu ? 'auto' : 'none',
    Menuescala: Estadoactual.Menu ? 'scale(1)' : 'scale(.92) translateY(-8px)',
    Avataranillo: Estadoactual.Menu ? '4px' : '0px',
    Menuitems: [
      { Etiqueta: 'Ayuda', Subtexto: 'Qué significa cada cifra', Icono: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01', Fondo: 'var(--ac)', Color: 'var(--oa)', Iconofondo: 'rgba(11,12,10,.1)', Derecha: '→', Alclic: () => this.Cambiarestado({ Menu: false, Ayuda: true, Ayudaabierta: 0 }) },
      { Etiqueta: 'Tasas por banco', Subtexto: 'Tasas de la Superintendencia Financiera', Icono: 'M4 20V10M10 20V4M16 20v-7M22 20H2', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: Estadoactual.Desbloqueadotasas ? '' : (Estadoactual.Anunciostasas ? (Estadoactual.Anunciostasas + '/3') : '3 VIDEOS'), Alclic: () => this.Cambiarestado({ Menu: false, Panel: 'tasas' }) },
      { Etiqueta: 'Mi perfil financiero', Subtexto: 'Ciudad, tipo de ingreso, edad', Icono: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: '', Alclic: () => this.Cambiarestado({ Menu: false, Panel: 'perfil' }) },
      { Etiqueta: 'Recordatorios', Subtexto: 'Aviso diario para registrar', Icono: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: Estadoactual.Recordatorios.Diario ? Estadoactual.Recordatorios.Hora : 'APAGADO', Alclic: () => this.Cambiarestado({ Menu: false, Panel: 'rem' }) },
      { Etiqueta: Oscuroactivo ? 'Modo claro' : 'Modo oscuro', Subtexto: '', Icono: Oscuroactivo ? 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' : 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: '', Alclic: () => Alternartemarapido.call(this) },
      { Etiqueta: 'Ver tutorial otra vez', Subtexto: '', Icono: 'M1 4v6h6M3.5 15a9 9 0 1 0 2.1-9.4L1 10', Fondo: 'transparent', Color: 'var(--ik)', Iconofondo: 'var(--c2)', Derecha: '', Alclic: () => this.Cambiarestado({ Menu: false, Ayuda: false, Panel: '', Pestana: 'inicio', Tutorialvisto: false, Tutorialpaso: 0, Tutorialcaja: null, Consejosvistos: {}, Consejopaso: 0 }) },
      { Etiqueta: 'Cerrar sesión', Subtexto: '', Icono: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9', Fondo: 'transparent', Color: 'var(--al)', Iconofondo: 'var(--c2)', Derecha: '', Alclic: () => this.Cerrarsesionusuario() }
    ]
  };
}
