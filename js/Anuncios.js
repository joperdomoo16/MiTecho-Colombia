// Anuncios de AdMob: banner abajo en las pantallas de la app y video con recompensa para abrir el comparador.
// Mientras la app no esté publicada se usan solo los ID de prueba de Google: no cobran, no cuentan impresiones
// y no ponen en riesgo la cuenta de AdMob. Al publicar se cambian aquí y en android/app/src/main/res/values/strings.xml

const Configuracionanuncios = {
  Banner: 'ca-app-pub-3940256099942544/6300978111',
  Recompensa: 'ca-app-pub-3940256099942544/5224354917',
  Prueba: true
};

const Estadoanuncios = { Inicio: null, Deseado: false, Creado: false, Altura: 0, Cola: Promise.resolve() };

// Solo existe dentro del celular; en el computador (pruebas) no hay anuncios
function Pluginanuncios() {
  const Capacitor = typeof window !== 'undefined' ? window.Capacitor : null;
  const Esnativo = Capacitor && typeof Capacitor.isNativePlatform === 'function' && Capacitor.isNativePlatform();
  return Esnativo && Capacitor.Plugins && Capacitor.Plugins.AdMob ? Capacitor.Plugins.AdMob : null;
}

// La altura del banner sube la barra de navegación para que no quede tapada
function Fijaralturaanuncio(Alto) {
  document.documentElement.style.setProperty('--alto-anuncio', Math.max(0, Math.round(Alto || 0)) + 'px');
}

function Iniciaranuncios() {
  if (Estadoanuncios.Inicio) return Estadoanuncios.Inicio;
  const Plugin = Pluginanuncios();
  if (!Plugin) {
    Estadoanuncios.Inicio = Promise.resolve(false);
    return Estadoanuncios.Inicio;
  }
  Estadoanuncios.Inicio = Plugin.initialize({ initializeForTesting: Configuracionanuncios.Prueba })
    .then(() => {
      Plugin.addListener('bannerAdSizeChanged', Tamano => {
        Estadoanuncios.Altura = Tamano && Tamano.height ? Tamano.height : 0;
        if (Estadoanuncios.Deseado) Fijaralturaanuncio(Estadoanuncios.Altura);
      });
      Plugin.addListener('bannerAdFailedToLoad', () => Fijaralturaanuncio(0));
      return true;
    })
    .catch(() => false);
  return Estadoanuncios.Inicio;
}

// Se llama en cada cambio de pantalla; los pedidos al plugin van en fila para que mostrar y ocultar no se crucen
function Sincronizarbanner(Mostrar) {
  if (Mostrar === Estadoanuncios.Deseado) return;
  Estadoanuncios.Deseado = Mostrar;
  const Plugin = Pluginanuncios();
  if (!Plugin) return;
  Estadoanuncios.Cola = Estadoanuncios.Cola.then(async () => {
    if (!(await Iniciaranuncios())) return;
    if (Estadoanuncios.Deseado !== Mostrar) return;
    if (!Mostrar) {
      Fijaralturaanuncio(0);
      await Plugin.hideBanner().catch(() => null);
      return;
    }
    if (Estadoanuncios.Creado) {
      await Plugin.resumeBanner().catch(() => null);
      Fijaralturaanuncio(Estadoanuncios.Altura);
      return;
    }
    // El complemento ya deja el banner encima de la barra de botones del celular; no se suma margen propio
    await Plugin.showBanner({
      adId: Configuracionanuncios.Banner, adSize: 'ADAPTIVE_BANNER', position: 'BOTTOM_CENTER',
      margin: 0, isTesting: Configuracionanuncios.Prueba
    }).then(() => { Estadoanuncios.Creado = true; }).catch(() => Fijaralturaanuncio(0));
  });
}

// Muestra el video y responde { ok } solo si la persona lo vio completo
function Verrecompensa() {
  const Plugin = Pluginanuncios();
  if (!Plugin) return Promise.resolve({ ok: true });
  return new Promise(Resolver => {
    let Ganado = false;
    let Terminado = false;
    const Escuchas = [];
    const Terminar = (Resultado) => {
      if (Terminado) return;
      Terminado = true;
      Escuchas.forEach(Escucha => Promise.resolve(Escucha).then(Manejador => Manejador && Manejador.remove()).catch(() => null));
      Resolver(Resultado);
    };
    const Fallo = { ok: false, error: 'No pudimos cargar el video en este momento, intenta de nuevo.' };
    Escuchas.push(Plugin.addListener('onRewardedVideoAdReward', () => { Ganado = true; }));
    Escuchas.push(Plugin.addListener('onRewardedVideoAdDismissed', () => Terminar(Ganado ? { ok: true } : { ok: false, error: 'Mira el video completo para abrir el comparador.' })));
    Escuchas.push(Plugin.addListener('onRewardedVideoAdFailedToShow', () => Terminar(Fallo)));
    Iniciaranuncios()
      .then(Listo => {
        if (!Listo) throw new Error('sin anuncios');
        return Plugin.prepareRewardVideoAd({ adId: Configuracionanuncios.Recompensa, isTesting: Configuracionanuncios.Prueba });
      })
      .then(() => Plugin.showRewardVideoAd())
      .catch(() => Terminar(Fallo));
  });
}
