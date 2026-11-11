package co.mitecho.app;

import android.view.WindowManager;
import android.webkit.JavascriptInterface;

// Funciones del celular que la interfaz puede llamar con window.Puentenativo
public final class PuenteNativo {

    private final ActividadPrincipal actividad;
    private final AlmacenSeguro almacenSeguro;

    public PuenteNativo(ActividadPrincipal actividad) {
        this.actividad = actividad;
        this.almacenSeguro = new AlmacenSeguro(actividad);
    }

    // Cambia el color de las barras del celular y si la pantalla se queda vertical
    @JavascriptInterface
    public void aplicarBarras(final String colorEstado, final boolean iconosEstadoOscuros,
                              final String colorNavegacion, final boolean iconosNavegacionOscuros,
                              final boolean bloquearVertical) {
        actividad.runOnUiThread(() -> actividad.actualizarBarras(colorEstado, iconosEstadoOscuros,
            colorNavegacion, iconosNavegacionOscuros, bloquearVertical));
    }

    @JavascriptInterface
    public void iniciarSesionGoogle() {
        actividad.runOnUiThread(actividad::abrirSelectorGoogle);
    }

    // La protección contra capturas queda siempre puesta: aunque la interfaz pida quitarla, no se quita
    @JavascriptInterface
    public void protegerPantalla(final boolean proteger) {
        actividad.runOnUiThread(() -> actividad.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE));
    }

    @JavascriptInterface
    public boolean guardarSeguro(String clave, String valor) {
        return almacenSeguro.guardar(clave, valor);
    }

    @JavascriptInterface
    public String leerSeguro(String clave) {
        return almacenSeguro.leer(clave);
    }

    @JavascriptInterface
    public void borrarSeguro(String clave) {
        almacenSeguro.borrar(clave);
    }
}
