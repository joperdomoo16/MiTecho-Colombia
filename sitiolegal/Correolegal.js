// Enlaces de correo y botones "Copiar" de las páginas legales.
// En el celular el enlace mailto abre la app de correo. En el computador se abre Gmail en otra pestaña,
// porque Chrome sin un programa de correo configurado no hace nada con mailto. Si el navegador
// bloquea la pestaña, se intenta con mailto como respaldo.
(function () {
  const Correooficial = 'rumoriastudio@gmail.com';
  const Escelular = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

  // Saca destinatario, asunto y mensaje de un enlace mailto
  function Leermailto(Enlace) {
    const Resto = Enlace.replace(/^mailto:/i, '');
    const Posicion = Resto.indexOf('?');
    const Datos = { Para: decodeURIComponent(Posicion < 0 ? Resto : Resto.slice(0, Posicion)) || Correooficial, Asunto: '', Mensaje: '' };
    if (Posicion >= 0) {
      Resto.slice(Posicion + 1).split('&').forEach(function (Par) {
        const Igual = Par.indexOf('=');
        const Nombre = (Igual < 0 ? Par : Par.slice(0, Igual)).toLowerCase();
        const Valor = Igual < 0 ? '' : decodeURIComponent(Par.slice(Igual + 1));
        if (Nombre === 'subject') Datos.Asunto = Valor;
        if (Nombre === 'body') Datos.Mensaje = Valor;
      });
    }
    return Datos;
  }

  function Urlgmail(Datos) {
    return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(Datos.Para) +
      (Datos.Asunto ? '&su=' + encodeURIComponent(Datos.Asunto) : '') +
      (Datos.Mensaje ? '&body=' + encodeURIComponent(Datos.Mensaje) : '');
  }

  // Cambia el texto del botón un par de segundos para confirmar que se copió
  function Avisar(Boton, Texto) {
    const Original = Boton.getAttribute('data-texto') || Boton.textContent;
    Boton.setAttribute('data-texto', Original);
    Boton.textContent = Texto;
    Boton.classList.add('copiado');
    clearTimeout(Boton.Temporizador);
    Boton.Temporizador = setTimeout(function () {
      Boton.textContent = Original;
      Boton.classList.remove('copiado');
    }, 2000);
  }

  function Copiar(Texto, Boton) {
    // Plan B para navegadores sin portapapeles moderno: un campo oculto y execCommand
    function Respaldo() {
      const Campo = document.createElement('textarea');
      Campo.value = Texto;
      Campo.setAttribute('readonly', '');
      Campo.style.position = 'fixed';
      Campo.style.opacity = '0';
      document.body.appendChild(Campo);
      Campo.select();
      let Copiado = false;
      try { Copiado = document.execCommand('copy'); } catch (Falla) { Copiado = false; }
      document.body.removeChild(Campo);
      Avisar(Boton, Copiado ? '¡Copiado!' : 'Copia manual');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(Texto).then(function () { Avisar(Boton, '¡Copiado!'); }, Respaldo);
    } else {
      Respaldo();
    }
  }

  document.addEventListener('click', function (Evento) {
    if (!Evento.target || !Evento.target.closest) return;
    const Boton = Evento.target.closest('.btn-copiar');
    if (Boton) {
      Evento.preventDefault();
      Copiar(Boton.getAttribute('data-copiar') || Correooficial, Boton);
      return;
    }
    const Enlace = Evento.target.closest('a[href^="mailto:"]');
    if (!Enlace || Escelular || Evento.defaultPrevented || Evento.button !== 0 || Evento.metaKey || Evento.ctrlKey || Evento.shiftKey || Evento.altKey) return;
    Evento.preventDefault();
    const Direccion = Enlace.getAttribute('href');
    const Ventana = window.open(Urlgmail(Leermailto(Direccion)), '_blank');
    if (Ventana) {
      try { Ventana.opener = null; } catch (Falla) { /* algunas ventanas no dejan cambiar opener y no pasa nada */ }
    } else {
      window.location.href = Direccion;
    }
  });
})();
