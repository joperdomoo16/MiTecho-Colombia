package siterecuperacion;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;

// Envía la solicitud de cambio de contraseña directamente al servicio de cuentas de Supabase
public class ClienteSupabase {

    private static final String URL_BASE = "https://tbliwiawziexlziqqcji.supabase.co";
    private static final String CLAVE_ANON = "sb_publishable_97ZjBlve6ihVdxgH2wWchw_b8VDbd_N";
    private static final ZoneId ZONA_BOGOTA = ZoneId.of("America/Bogota");
    private static final DateTimeFormatter FORMATO_FECHA_CAMBIO = DateTimeFormatter
            .ofLocalizedDateTime(FormatStyle.MEDIUM, FormatStyle.SHORT)
            .withLocale(Locale.forLanguageTag("es-CO"));
    private static final HttpClient CLIENTE_HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    // Guarda si el cambio salió bien y el mensaje para mostrar en la pantalla
    public static class Resultado {
        private final boolean exitoso;
        private final String mensaje;

        public Resultado(boolean exitoso, String mensaje) {
            this.exitoso = exitoso;
            this.mensaje = mensaje;
        }

        public boolean esExitoso() {
            return exitoso;
        }

        public String obtenerMensaje() {
            return mensaje;
        }
    }

    // Envía la clave nueva junto con la fecha y hora de Colombia para el correo de confirmación
    public static Resultado actualizarContrasena(String tokenAcceso, String nuevaClave) {
        if (tokenAcceso == null || tokenAcceso.isBlank()) {
            return new Resultado(false, "El código de autorización no es válido.");
        }
        if (nuevaClave == null || nuevaClave.length() < 6) {
            return new Resultado(false, "La contraseña debe tener al menos 6 caracteres.");
        }

        String fechaCambio = ZonedDateTime.now(ZONA_BOGOTA).format(FORMATO_FECHA_CAMBIO);
        String jsonCuerpo = "{\"password\":\"" + escaparJson(nuevaClave)
                + "\",\"data\":{\"fecha_cambio\":\"" + escaparJson(fechaCambio) + "\"}}";

        try {
            HttpRequest peticion = HttpRequest.newBuilder()
                    .uri(URI.create(URL_BASE + "/auth/v1/user"))
                    .timeout(Duration.ofSeconds(12))
                    .header("Content-Type", "application/json")
                    .header("apikey", CLAVE_ANON)
                    .header("Authorization", "Bearer " + tokenAcceso.trim())
                    .PUT(HttpRequest.BodyPublishers.ofString(jsonCuerpo))
                    .build();

            HttpResponse<String> respuesta = CLIENTE_HTTP.send(peticion, HttpResponse.BodyHandlers.ofString());

            int codigoEstado = respuesta.statusCode();
            if (codigoEstado >= 200 && codigoEstado < 300) {
                return new Resultado(true, "Contraseña actualizada correctamente.");
            }

            String cuerpo = respuesta.body();
            String mensajeError = extraerMensajeError(cuerpo);
            if (mensajeError != null) {
                return new Resultado(false, mensajeError);
            }
            return new Resultado(false, "No se pudo actualizar la contraseña (código " + codigoEstado + ").");
        } catch (IOException | InterruptedException errorRed) {
            return new Resultado(false, "Problema de conexión con el servidor: " + errorRed.getMessage());
        }
    }

    // Protege las comillas y barras para que el texto de datos se arme sin errores
    private static String escaparJson(String texto) {
        return texto.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    // Busca el motivo del error cuando el servidor rechaza el cambio de contraseña
    private static String extraerMensajeError(String json) {
        if (json == null || json.isBlank()) return null;
        if (json.contains("\"msg\":")) {
            return limpiarValorJson(json, json.indexOf("\"msg\":") + 6);
        }
        if (json.contains("\"message\":")) {
            return limpiarValorJson(json, json.indexOf("\"message\":") + 10);
        }
        if (json.contains("\"error_description\":")) {
            return limpiarValorJson(json, json.indexOf("\"error_description\":") + 20);
        }
        return null;
    }

    // Recorta el texto que viene entre comillas dentro de la respuesta del servidor
    private static String limpiarValorJson(String json, int inicio) {
        int primeraComilla = json.indexOf("\"", inicio);
        if (primeraComilla == -1) return null;
        int segundaComilla = json.indexOf("\"", primeraComilla + 1);
        if (segundaComilla == -1) return null;
        return json.substring(primeraComilla + 1, segundaComilla);
    }
}
