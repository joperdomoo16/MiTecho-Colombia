package co.mitecho.app;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInStatusCodes;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.tasks.Task;
import org.json.JSONObject;

// Pantalla principal de Android: maneja las barras del celular y el inicio de sesión con Google
public class ActividadPrincipal extends BridgeActivity {

    private static final int SOLICITUD_INICIO_GOOGLE = 9001;
    private static final int CODIGO_CANCELADO_GOOGLE = 12501;
    private static final String COLOR_FONDO = "#0B0C0A";
    private static final String MENSAJE_ERROR_GOOGLE = "No pudimos conectar con Google en este momento, intenta de nuevo o entra con tu correo.";

    private GoogleSignInClient clienteGoogle;

    private String colorEstadoActual = "#1E345B";
    private boolean iconosEstadoOscurosActual = false;
    private String colorNavegacionActual = COLOR_FONDO;
    private boolean iconosNavegacionOscurosActual = false;
    private boolean verticalBloqueadaActual = true;
    private int margenSuperiorDp = 28;
    private int margenInferiorDp = 44;
    private int margenIzquierdoDp = 0;
    private int margenDerechoDp = 0;

    @Override
    protected void onCreate(Bundle estadoGuardado) {
        super.onCreate(estadoGuardado);
        Window ventana = getWindow();
        // Desde que abre, ninguna pantalla se puede capturar ni grabar, y en apps recientes no se ven los datos
        ventana.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
        ventana.setBackgroundDrawable(new ColorDrawable(Color.parseColor(COLOR_FONDO)));
        WindowCompat.setDecorFitsSystemWindows(ventana, false);

        // Mide el alto de la barra de la hora y de los botones de abajo para que nada quede tapado
        View vistaRaiz = ventana.getDecorView();
        ViewCompat.setOnApplyWindowInsetsListener(vistaRaiz, (vista, margenes) -> {
            Insets barras = margenes.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            float densidad = getResources().getDisplayMetrics().density;
            if (densidad <= 0f) densidad = 1f;
            margenSuperiorDp = Math.round(barras.top / densidad);
            margenInferiorDp = Math.round(barras.bottom / densidad);
            margenIzquierdoDp = Math.round(barras.left / densidad);
            margenDerechoDp = Math.round(barras.right / densidad);
            enviarMargenesInterfaz();
            return margenes;
        });

        aplicarBarrasSistema();
        prepararClienteGoogle();

        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().setBackgroundColor(Color.parseColor(COLOR_FONDO));
            getBridge().getWebView().addJavascriptInterface(new PuenteNativo(this), "Puentenativo");
        }
    }

    // El identificador web de Google queda en strings.xml para no tenerlo metido en el código
    private void prepararClienteGoogle() {
        try {
            GoogleSignInOptions opciones = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.id_cliente_web_google))
                .requestEmail()
                .requestProfile()
                .build();
            clienteGoogle = GoogleSignIn.getClient(this, opciones);
        } catch (Exception errorGoogle) {
            clienteGoogle = null;
        }
    }

    void actualizarBarras(String colorEstado, boolean iconosEstadoOscuros, String colorNavegacion,
                          boolean iconosNavegacionOscuros, boolean bloquearVertical) {
        colorEstadoActual = colorEstado;
        iconosEstadoOscurosActual = iconosEstadoOscuros;
        colorNavegacionActual = colorNavegacion;
        iconosNavegacionOscurosActual = iconosNavegacionOscuros;
        verticalBloqueadaActual = bloquearVertical;
        aplicarBarrasSistema();
        enviarMargenesInterfaz();
    }

    // Cierra la sesión anterior de Google para que siempre salga el selector de cuentas
    void abrirSelectorGoogle() {
        if (clienteGoogle == null) {
            avisarErrorGoogle();
            return;
        }
        try {
            clienteGoogle.signOut().addOnCompleteListener(tarea -> {
                try {
                    startActivityForResult(clienteGoogle.getSignInIntent(), SOLICITUD_INICIO_GOOGLE);
                } catch (Exception errorSelector) {
                    avisarErrorGoogle();
                }
            });
        } catch (Exception errorConexion) {
            avisarErrorGoogle();
        }
    }

    // Le pasa a la interfaz los márgenes seguros como variables de CSS
    private void enviarMargenesInterfaz() {
        ejecutarEnInterfaz("if(document&&document.documentElement){"
            + "var s=document.documentElement.style;"
            + "s.setProperty('--sat','" + margenSuperiorDp + "px');"
            + "s.setProperty('--sab','" + margenInferiorDp + "px');"
            + "s.setProperty('--sal','" + margenIzquierdoDp + "px');"
            + "s.setProperty('--sar','" + margenDerechoDp + "px');"
            + "}");
    }

    private void ejecutarEnInterfaz(final String codigo) {
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().post(() -> getBridge().getWebView().evaluateJavascript(codigo, null));
        }
    }

    @Override
    public void onWindowFocusChanged(boolean tieneFoco) {
        super.onWindowFocusChanged(tieneFoco);
        if (tieneFoco) {
            aplicarBarrasSistema();
            enviarMargenesInterfaz();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        aplicarBarrasSistema();
        enviarMargenesInterfaz();
    }

    // Deja las barras transparentes y pone los íconos claros u oscuros según el tema
    private void aplicarBarrasSistema() {
        try {
            int orientacion = verticalBloqueadaActual
                ? ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                : ActivityInfo.SCREEN_ORIENTATION_USER;
            if (getRequestedOrientation() != orientacion) {
                setRequestedOrientation(orientacion);
            }

            Window ventana = getWindow();
            ventana.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            ventana.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            ventana.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
            ventana.setStatusBarColor(Color.TRANSPARENT);
            ventana.setNavigationBarColor(Color.TRANSPARENT);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                ventana.setNavigationBarDividerColor(Color.TRANSPARENT);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ventana.setNavigationBarContrastEnforced(false);
                ventana.setStatusBarContrastEnforced(false);
            }

            View vistaRaiz = ventana.getDecorView();
            int banderas = vistaRaiz.getSystemUiVisibility();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (iconosEstadoOscurosActual) {
                    banderas |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                } else {
                    banderas &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                }
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (iconosNavegacionOscurosActual) {
                    banderas |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                } else {
                    banderas &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                }
            }
            vistaRaiz.setSystemUiVisibility(banderas);

            WindowInsetsControllerCompat controlador = WindowCompat.getInsetsController(ventana, vistaRaiz);
            if (controlador != null) {
                controlador.setAppearanceLightStatusBars(iconosEstadoOscurosActual);
                controlador.setAppearanceLightNavigationBars(iconosNavegacionOscurosActual);
            }
        } catch (Exception errorBarras) {
            // Si el celular no soporta algún ajuste de barras, la app sigue funcionando igual
        }
    }

    // Recibe la cuenta que eligió la persona y se la pasa a la interfaz
    @Override
    public void onActivityResult(int codigoSolicitud, int codigoResultado, Intent datos) {
        super.onActivityResult(codigoSolicitud, codigoResultado, datos);
        if (codigoSolicitud != SOLICITUD_INICIO_GOOGLE) return;
        Task<GoogleSignInAccount> tarea = GoogleSignIn.getSignedInAccountFromIntent(datos);
        try {
            GoogleSignInAccount cuenta = tarea.getResult(ApiException.class);
            if (cuenta != null && cuenta.getIdToken() != null) {
                String correo = cuenta.getEmail() != null ? cuenta.getEmail() : "";
                String nombre = cuenta.getDisplayName() != null ? cuenta.getDisplayName() : "";
                ejecutarEnInterfaz("if(window.Googleexitoso){window.Googleexitoso("
                    + JSONObject.quote(cuenta.getIdToken()) + ","
                    + JSONObject.quote(correo) + ","
                    + JSONObject.quote(nombre) + ");}");
            } else {
                avisarErrorGoogle();
            }
        } catch (ApiException errorCuenta) {
            int codigo = errorCuenta.getStatusCode();
            if (codigo == GoogleSignInStatusCodes.SIGN_IN_CANCELLED || codigo == CommonStatusCodes.CANCELED
                || codigo == CODIGO_CANCELADO_GOOGLE) {
                ejecutarEnInterfaz("if(window.Googlecancelado){window.Googlecancelado();}");
            } else {
                avisarErrorGoogle();
            }
        } catch (Exception errorInesperado) {
            avisarErrorGoogle();
        }
    }

    // Siempre el mismo mensaje amable, sin códigos ni detalles internos de Google
    private void avisarErrorGoogle() {
        ejecutarEnInterfaz("if(window.Googlefallido){window.Googlefallido("
            + JSONObject.quote(MENSAJE_ERROR_GOOGLE) + ");}");
    }
}
