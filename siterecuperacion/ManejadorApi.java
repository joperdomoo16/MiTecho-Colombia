package siterecuperacion;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

// Recibe la nueva clave enviada desde el formulario y la procesa con el cliente de Supabase
public class ManejadorApi implements HttpHandler {

    // Atiende la solicitud de cambio de contraseña y devuelve la respuesta en formato de texto estructurado
    @Override
    public void handle(HttpExchange intercambio) throws IOException {
        String metodo = intercambio.getRequestMethod();

        intercambio.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        intercambio.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
        intercambio.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equalsIgnoreCase(metodo)) {
            intercambio.sendResponseHeaders(204, -1);
            return;
        }

        if (!"POST".equalsIgnoreCase(metodo)) {
            enviarRespuestaJson(intercambio, 405, "{\"ok\":false,\"mensaje\":\"Método no permitido.\"}");
            return;
        }

        String cuerpoSolicitud;
        try (InputStream entrada = intercambio.getRequestBody()) {
            cuerpoSolicitud = new String(entrada.readAllBytes(), StandardCharsets.UTF_8);
        }

        String token = extraerCampoJson(cuerpoSolicitud, "token");
        String nuevaClave = extraerCampoJson(cuerpoSolicitud, "nuevaClave");

        if (token == null || token.isBlank()) {
            enviarRespuestaJson(intercambio, 400, "{\"ok\":false,\"mensaje\":\"Falta el código de autorización.\"}");
            return;
        }

        if (nuevaClave == null || nuevaClave.length() < 6) {
            enviarRespuestaJson(intercambio, 400, "{\"ok\":false,\"mensaje\":\"La contraseña debe tener al menos 6 caracteres.\"}");
            return;
        }

        ClienteSupabase.Resultado resultado = ClienteSupabase.actualizarContrasena(token, nuevaClave);

        int codigoRespuesta = resultado.esExitoso() ? 200 : 400;
        String jsonRespuesta = "{\"ok\":" + resultado.esExitoso() + ",\"mensaje\":\"" + resultado.obtenerMensaje() + "\"}";
        enviarRespuestaJson(intercambio, codigoRespuesta, jsonRespuesta);
    }

    // Envía el resultado de la operación hacia la pantalla del celular
    private void enviarRespuestaJson(HttpExchange intercambio, int estado, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        intercambio.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        intercambio.sendResponseHeaders(estado, bytes.length);
        try (OutputStream salida = intercambio.getResponseBody()) {
            salida.write(bytes);
        }
    }

    // Obtiene el valor de un campo dentro del mensaje enviado por el formulario
    private String extraerCampoJson(String json, String nombreCampo) {
        if (json == null || nombreCampo == null) return null;
        String etiqueta = "\"" + nombreCampo + "\":";
        int indice = json.indexOf(etiqueta);
        if (indice == -1) return null;

        int inicioValor = json.indexOf("\"", indice + etiqueta.length());
        if (inicioValor == -1) return null;
        int finValor = json.indexOf("\"", inicioValor + 1);
        if (finValor == -1) return null;

        return json.substring(inicioValor + 1, finValor);
    }
}
