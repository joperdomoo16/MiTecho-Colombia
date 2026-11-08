// Guardado y lectura de datos por usuario en la memoria del celular y recorte de foto de perfil

// Crea un nombre único por correo para que los datos de cada cuenta queden separados
function Obtenerclaveusuario(correo) {
  const limpio = String(correo || '').trim().toLowerCase();
  return limpio ? (Clavealmacenamiento + '.' + limpio) : Clavealmacenamiento;
}

function Cargardatosalmacenados() {
  try {
    return JSON.parse(localStorage.getItem(Clavealmacenamiento) || 'null');
  } catch (e) {
    return null;
  }
}

function Cargardatosusuario(correo) {
  try {
    if (!correo) return null;
    return JSON.parse(localStorage.getItem(Obtenerclaveusuario(correo)) || 'null');
  } catch (e) {
    return null;
  }
}

function Guardardatosalmacenados(state) {
  try {
    if (!state || !state.logged) {
      localStorage.removeItem(Clavealmacenamiento);
      return true;
    }
    const o = {};
    Camposalmacenados.forEach(k => {
      if (k !== 'gsUrl' && state[k] !== undefined) {
        o[k] = state[k];
      }
    });
    const serializado = JSON.stringify(o);
    localStorage.setItem(Clavealmacenamiento, serializado);
    if (state.email) {
      localStorage.setItem(Obtenerclaveusuario(state.email), serializado);
    }
    return true;
  } catch (e) {
    return false;
  }
}

function Borrardatosalmacenados(correo) {
  try {
    localStorage.removeItem(Clavealmacenamiento);
    if (correo) {
      localStorage.removeItem(Obtenerclaveusuario(correo));
    }
    return true;
  } catch (e) {
    return false;
  }
}

function Procesarfotoperfil(file, callback) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 180;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      callback(dataUrl);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

const cargarDatosAlmacenados = Cargardatosalmacenados;
const guardarDatosAlmacenados = Guardardatosalmacenados;
const borrarDatosAlmacenados = Borrardatosalmacenados;
const procesarImagenPerfil = Procesarfotoperfil;
