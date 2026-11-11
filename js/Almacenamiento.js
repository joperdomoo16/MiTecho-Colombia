// Guardado y lectura de datos por usuario en la memoria del celular y recorte de foto de perfil

// Crea un nombre único por correo para que los datos de cada cuenta queden separados
function Obtenerclaveusuario(Correo) {
  const Limpio = String(Correo || '').trim().toLowerCase();
  return Limpio ? (Clavealmacenamiento + '.' + Limpio) : Clavealmacenamiento;
}

// Lee la clave nueva y, si no existe, trae la de la versión anterior convertida a los nombres actuales
function Leerconmigracion(Clavenueva, Claveantigua) {
  const Actual = localStorage.getItem(Clavenueva);
  if (Actual) return JSON.parse(Actual);
  const Antiguo = localStorage.getItem(Claveantigua);
  if (!Antiguo) return null;
  const Convertido = Migrarestadoantiguo(JSON.parse(Antiguo));
  localStorage.setItem(Clavenueva, JSON.stringify(Convertido));
  localStorage.removeItem(Claveantigua);
  return Convertido;
}

function Cargardatosalmacenados() {
  try {
    return Leerconmigracion(Clavealmacenamiento, Clavealmacenamientoantigua);
  } catch (Falla) {
    return null;
  }
}

function Cargardatosusuario(Correo) {
  try {
    if (!Correo) return null;
    const Limpio = String(Correo).trim().toLowerCase();
    return Leerconmigracion(Obtenerclaveusuario(Correo), Clavealmacenamientoantigua + '.' + Limpio);
  } catch (Falla) {
    return null;
  }
}

function Guardardatosalmacenados(Estadocomponente) {
  try {
    if (!Estadocomponente || !Estadocomponente.Ingresado) {
      localStorage.removeItem(Clavealmacenamiento);
      return true;
    }
    const Objeto = {};
    Camposalmacenados.forEach(Clave => {
      if (Estadocomponente[Clave] !== undefined) {
        Objeto[Clave] = Estadocomponente[Clave];
      }
    });
    const Serializado = JSON.stringify(Objeto);
    localStorage.setItem(Clavealmacenamiento, Serializado);
    if (Estadocomponente.Correo) {
      localStorage.setItem(Obtenerclaveusuario(Estadocomponente.Correo), Serializado);
    }
    return true;
  } catch (Falla) {
    return false;
  }
}

function Borrardatosalmacenados(Correo) {
  try {
    localStorage.removeItem(Clavealmacenamiento);
    localStorage.removeItem(Clavealmacenamientoantigua);
    if (Correo) {
      localStorage.removeItem(Obtenerclaveusuario(Correo));
      localStorage.removeItem(Clavealmacenamientoantigua + '.' + String(Correo).trim().toLowerCase());
    }
    return true;
  } catch (Falla) {
    return false;
  }
}

function Procesarfotoperfil(Archivo, Alterminar) {
  if (!Archivo || !Archivo.type.startsWith('image/')) return;
  const Lector = new FileReader();
  Lector.onload = (Eventolectura) => {
    const Imagen = new Image();
    Imagen.onload = () => {
      const Lienzo = document.createElement('canvas');
      const Tamano = 180;
      Lienzo.width = Tamano;
      Lienzo.height = Tamano;
      const Contexto = Lienzo.getContext('2d');
      const Dimensionminima = Math.min(Imagen.width, Imagen.height);
      const Origenx = (Imagen.width - Dimensionminima) / 2;
      const Origeny = (Imagen.height - Dimensionminima) / 2;
      Contexto.drawImage(Imagen, Origenx, Origeny, Dimensionminima, Dimensionminima, 0, 0, Tamano, Tamano);
      const Imagendatos = Lienzo.toDataURL('image/jpeg', 0.85);
      Alterminar(Imagendatos);
    };
    Imagen.src = Eventolectura.target.result;
  };
  Lector.readAsDataURL(Archivo);
}


// La foto guardada en el celular solo se muestra si es una imagen JPEG o PNG en base64, como la que arma la app
function Imagensegura(Valor) {
  return typeof Valor === 'string' && Valor.length < 3000000 && /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$/.test(Valor) ? Valor : '';
}
