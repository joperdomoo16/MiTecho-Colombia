package siterecuperacion;

import com.sun.net.httpserver.HttpServer;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

// Punto de arranque del servidor para el cambio de contraseña de la aplicación móvil
public class ServidorRestablecer {

    private static final int PUERTO_POR_DEFECTO = 8080;

    // Configura el puerto, ubica la carpeta de archivos y enciende el servidor con hilos livianos
    public static void main(String[] argumentos) {
        int puerto = PUERTO_POR_DEFECTO;

        String variablePuerto = System.getenv("PORT");
        if (variablePuerto != null && !variablePuerto.isBlank()) {
            try {
                puerto = Integer.parseInt(variablePuerto);
            } catch (NumberFormatException errorFormato) {
                System.err.println("El puerto configurado no es un número válido, se usará " + PUERTO_POR_DEFECTO);
            }
        }

        File directorioArchivos = new File(".").getAbsoluteFile();
        if (new File(directorioArchivos, "siterecuperacion/index.html").exists()) {
            directorioArchivos = new File(directorioArchivos, "siterecuperacion");
        }

        try {
            HttpServer servidor = HttpServer.create(new InetSocketAddress(puerto), 0);

            servidor.createContext("/", new ManejadorEstatico(directorioArchivos));
            servidor.createContext("/api/actualizar-clave", new ManejadorApi());

            servidor.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
            servidor.start();

            System.out.println("Servidor de recuperación de MiTecho activo en http://localhost:" + puerto + "/");
        } catch (IOException errorArranque) {
            System.err.println("No se pudo iniciar el servidor: " + errorArranque.getMessage());
        }
    }
}
