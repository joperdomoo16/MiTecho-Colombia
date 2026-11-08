package siterecuperacion;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

// Entrega el archivo principal y los archivos de diseño y lógica cuando se abre el enlace del correo
public class ManejadorEstatico implements HttpHandler {

    private final File directorioRaiz;

    public ManejadorEstatico(File directorioRaiz) {
        this.directorioRaiz = directorioRaiz;
    }

    // Busca el archivo pedido dentro de la carpeta y lo envía al celular
    @Override
    public void handle(HttpExchange intercambio) throws IOException {
        String rutaPeticion = intercambio.getRequestURI().getPath();

        if (rutaPeticion.equals("/") || rutaPeticion.equals("/restablecer-contrasena") || rutaPeticion.isBlank()) {
            rutaPeticion = "/index.html";
        }

        File archivoSolicitado = new File(directorioRaiz, rutaPeticion).getCanonicalFile();

        // Impide que se lean archivos por fuera de la carpeta autorizada
        if (!archivoSolicitado.getPath().startsWith(directorioRaiz.getCanonicalPath())) {
            enviarError(intercambio, 403, "Acceso no permitido.");
            return;
        }

        if (!archivoSolicitado.exists() || archivoSolicitado.isDirectory()) {
            enviarError(intercambio, 404, "El archivo solicitado no existe.");
            return;
        }

        String tipoContenido = determinarTipoMime(archivoSolicitado.getName());
        intercambio.getResponseHeaders().set("Content-Type", tipoContenido);

        if (archivoSolicitado.getName().endsWith(".html")) {
            intercambio.getResponseHeaders().set("Cache-Control", "no-cache, must-revalidate");
        } else {
            intercambio.getResponseHeaders().set("Cache-Control", "public, max-age=3600");
        }

        intercambio.sendResponseHeaders(200, archivoSolicitado.length());

        try (FileInputStream entrada = new FileInputStream(archivoSolicitado);
             OutputStream salida = intercambio.getResponseBody()) {
            byte[] bufer = new byte[8192];
            int bytesLeidos;
            while ((bytesLeidos = entrada.read(bufer)) != -1) {
                salida.write(bufer, 0, bytesLeidos);
            }
        }
    }

    // Define el tipo de archivo según su extensión para que el visor lo interprete bien
    private String determinarTipoMime(String nombreArchivo) {
        String nombre = nombreArchivo.toLowerCase();
        if (nombre.endsWith(".html")) return "text/html; charset=UTF-8";
        if (nombre.endsWith(".css")) return "text/css; charset=UTF-8";
        if (nombre.endsWith(".js")) return "application/javascript; charset=UTF-8";
        if (nombre.endsWith(".xml")) return "application/xml; charset=UTF-8";
        if (nombre.endsWith(".txt")) return "text/plain; charset=UTF-8";
        if (nombre.endsWith(".png")) return "image/png";
        if (nombre.endsWith(".svg")) return "image/svg+xml";
        if (nombre.endsWith(".json")) return "application/json; charset=UTF-8";
        return "application/octet-stream";
    }

    // Responde con un aviso corto en texto cuando el archivo no se encuentra
    private void enviarError(HttpExchange intercambio, int codigoEstado, String mensaje) throws IOException {
        byte[] bytes = mensaje.getBytes(StandardCharsets.UTF_8);
        intercambio.getResponseHeaders().set("Content-Type", "text/plain; charset=UTF-8");
        intercambio.sendResponseHeaders(codigoEstado, bytes.length);
        try (OutputStream salida = intercambio.getResponseBody()) {
            salida.write(bytes);
        }
    }
}
