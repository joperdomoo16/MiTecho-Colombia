package co.mitecho.app;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
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

// Actividad principal de Android que controla las barras del celular y el inicio de sesión con Google
public class MainActivity extends BridgeActivity {

    private static final int RC_SIGN_IN_GOOGLE = 9001;
    private static final String GOOGLE_WEB_CLIENT_ID = "76574046298-n64bp6m7kbr66iqpud7sve52q90j0q6v.apps.googleusercontent.com";
    private GoogleSignInClient googleSignInClient;

    private String currentStatusHex = "#1E345B";
    private boolean currentDarkStatusIcons = false;
    private String currentNavHex = "#0B0C0A";
    private boolean currentDarkNavIcons = false;
    private boolean currentLockPortrait = true;
    private int insetTopDp = 28;
    private int insetBottomDp = 44;
    private int insetLeftDp = 0;
    private int insetRightDp = 0;

    // Prepara la ventana del celular, calcula el espacio de las barras y conecta las funciones nativas
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.setBackgroundDrawable(new ColorDrawable(Color.parseColor("#0B0C0A")));
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // Mide el alto de la barra de hora y de los botones inferiores del celular
        View decorView = window.getDecorView();
        ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, insets) -> {
            Insets sysBars = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            float density = getResources().getDisplayMetrics().density;
            if (density <= 0f) density = 1f;
            insetTopDp = Math.round(sysBars.top / density);
            insetBottomDp = Math.round(sysBars.bottom / density);
            insetLeftDp = Math.round(sysBars.left / density);
            insetRightDp = Math.round(sysBars.right / density);
            pushInsetsToWebView();
            return insets;
        });

        applySystemBars(currentStatusHex, currentDarkStatusIcons, currentNavHex, currentDarkNavIcons, currentLockPortrait);

        // Prepara el selector de cuentas de Google del celular
        try {
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(GOOGLE_WEB_CLIENT_ID)
                .requestEmail()
                .requestProfile()
                .build();
            googleSignInClient = GoogleSignIn.getClient(this, gso);
        } catch (Exception ignored) {
        }

        // Expone las funciones para cambiar el color de las barras, abrir el correo e iniciar sesión con Google
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().setBackgroundColor(Color.parseColor("#0B0C0A"));
            getBridge().getWebView().addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void setBars(final String statusHex, final boolean darkStatusIcons, final String navHex, final boolean darkNavIcons, final boolean lockPortrait) {
                    runOnUiThread(() -> {
                        currentStatusHex = statusHex;
                        currentDarkStatusIcons = darkStatusIcons;
                        currentNavHex = navHex;
                        currentDarkNavIcons = darkNavIcons;
                        currentLockPortrait = lockPortrait;
                        applySystemBars(statusHex, darkStatusIcons, navHex, darkNavIcons, lockPortrait);
                        pushInsetsToWebView();
                    });
                }

                @JavascriptInterface
                public void openEmail(final String to, final String subject, final String body) {
                    runOnUiThread(() -> {
                        try {
                            String uriText = "mailto:" + Uri.encode(to)
                                + "?subject=" + Uri.encode(subject)
                                + "&body=" + Uri.encode(body);
                            Intent sendIntent = new Intent(Intent.ACTION_SENDTO, Uri.parse(uriText));
                            sendIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(sendIntent);
                        } catch (Exception e) {
                            try {
                                Intent fallback = new Intent(Intent.ACTION_SEND);
                                fallback.setType("message/rfc822");
                                fallback.putExtra(Intent.EXTRA_EMAIL, new String[]{to});
                                fallback.putExtra(Intent.EXTRA_SUBJECT, subject);
                                fallback.putExtra(Intent.EXTRA_TEXT, body);
                                fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(Intent.createChooser(fallback, "Enviar correo"));
                            } catch (Exception ignored) {
                            }
                        }
                    });
                }

                @JavascriptInterface
                public boolean hasNativeGoogle() {
                    return true;
                }

                @JavascriptInterface
                public void signInGoogle() {
                    runOnUiThread(() -> {
                        try {
                            if (googleSignInClient != null) {
                                googleSignInClient.signOut().addOnCompleteListener(task -> {
                                    try {
                                        Intent signInIntent = googleSignInClient.getSignInIntent();
                                        startActivityForResult(signInIntent, RC_SIGN_IN_GOOGLE);
                                    } catch (Exception err) {
                                        notifyGoogleLoginError(err.getMessage() != null ? err.getMessage() : "No se pudo iniciar selector de Google.");
                                    }
                                });
                            } else {
                                notifyGoogleLoginError("Cliente de Google no disponible.");
                            }
                        } catch (Exception e) {
                            notifyGoogleLoginError(e.getMessage() != null ? e.getMessage() : "Error al conectar con Google.");
                        }
                    });
                }
            }, "MiTechoBars");
        }
    }

    // Envía a la interfaz los márgenes seguros de la parte superior e inferior del celular
    private void pushInsetsToWebView() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            final String js = "if(document&&document.documentElement){"
                + "var s=document.documentElement.style;"
                + "s.setProperty('--sat','" + insetTopDp + "px');"
                + "s.setProperty('--sab','" + insetBottomDp + "px');"
                + "s.setProperty('--sal','" + insetLeftDp + "px');"
                + "s.setProperty('--sar','" + insetRightDp + "px');"
                + "}";
            getBridge().getWebView().post(() -> getBridge().getWebView().evaluateJavascript(js, null));
        }
    }

    // Vuelve a aplicar el estilo de las barras cuando el usuario regresa a la ventana
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applySystemBars(currentStatusHex, currentDarkStatusIcons, currentNavHex, currentDarkNavIcons, currentLockPortrait);
            pushInsetsToWebView();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        applySystemBars(currentStatusHex, currentDarkStatusIcons, currentNavHex, currentDarkNavIcons, currentLockPortrait);
        pushInsetsToWebView();
    }

    // Ajusta la orientación del celular y el contraste de los íconos según el modo claro u oscuro
    private void applySystemBars(String statusHex, boolean darkStatusIcons, String navHex, boolean darkNavIcons, boolean lockPortrait) {
        try {
            int targetOrientation = lockPortrait
                ? ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                : ActivityInfo.SCREEN_ORIENTATION_USER;
            if (getRequestedOrientation() != targetOrientation) {
                setRequestedOrientation(targetOrientation);
            }

            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

            window.setStatusBarColor(Color.TRANSPARENT);
            window.setNavigationBarColor(Color.TRANSPARENT);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                window.setNavigationBarDividerColor(Color.TRANSPARENT);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                window.setNavigationBarContrastEnforced(false);
                window.setStatusBarContrastEnforced(false);
            }

            View decorView = window.getDecorView();
            int flags = decorView.getSystemUiVisibility();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (darkStatusIcons) {
                    flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                } else {
                    flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                }
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (darkNavIcons) {
                    flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                } else {
                    flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                }
            }

            decorView.setSystemUiVisibility(flags);

            WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, decorView);
            if (controller != null) {
                controller.setAppearanceLightStatusBars(darkStatusIcons);
                controller.setAppearanceLightNavigationBars(darkNavIcons);
            }
        } catch (Exception ignored) {
        }
    }

    // Recibe la cuenta seleccionada en la ventana de Google y entrega los datos a la aplicación
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RC_SIGN_IN_GOOGLE) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                GoogleSignInAccount account = task.getResult(ApiException.class);
                if (account != null && account.getIdToken() != null) {
                    String token = account.getIdToken();
                    String email = account.getEmail() != null ? account.getEmail() : "";
                    String name = account.getDisplayName() != null ? account.getDisplayName() : "";
                    notifyGoogleLoginSuccess(token, email, name);
                } else {
                    notifyGoogleLoginError("No se obtuvo el código de autenticación de Google.");
                }
            } catch (ApiException e) {
                int code = e.getStatusCode();
                if (code == GoogleSignInStatusCodes.SIGN_IN_CANCELLED || code == CommonStatusCodes.CANCELED || code == 12501) {
                    notifyGoogleLoginCancel();
                } else {
                    notifyGoogleLoginError("Error Google (" + code + "): " + (e.getMessage() != null ? e.getMessage() : "No configurado"));
                }
            } catch (Exception e) {
                notifyGoogleLoginError(e.getMessage() != null ? e.getMessage() : "Error inesperado al conectar cuenta.");
            }
        }
    }

    // Avisa a la aplicación que el inicio de sesión con Google fue exitoso
    private void notifyGoogleLoginSuccess(String token, String email, String name) {
        if (getBridge() != null && getBridge().getWebView() != null) {
            final String js = "if(window.MiTechoOnGoogleNativeSuccess){window.MiTechoOnGoogleNativeSuccess("
                + JSONObject.quote(token) + ","
                + JSONObject.quote(email) + ","
                + JSONObject.quote(name) + ");}";
            getBridge().getWebView().post(() -> getBridge().getWebView().evaluateJavascript(js, null));
        }
    }

    // Envía a la pantalla el motivo cuando falla la conexión con Google
    private void notifyGoogleLoginError(String message) {
        if (getBridge() != null && getBridge().getWebView() != null) {
            final String js = "if(window.MiTechoOnGoogleNativeError){window.MiTechoOnGoogleNativeError("
                + JSONObject.quote(message) + ");}";
            getBridge().getWebView().post(() -> getBridge().getWebView().evaluateJavascript(js, null));
        }
    }

    // Avisa cuando la persona cierra el selector de cuentas sin elegir ninguna
    private void notifyGoogleLoginCancel() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            final String js = "if(window.MiTechoOnGoogleNativeCancel){window.MiTechoOnGoogleNativeCancel();}";
            getBridge().getWebView().post(() -> getBridge().getWebView().evaluateJavascript(js, null));
        }
    }
}
