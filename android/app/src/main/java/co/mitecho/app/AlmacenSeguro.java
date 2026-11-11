package co.mitecho.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

// Guarda la sesión cifrada con una llave que nunca sale del Keystore del celular
public final class AlmacenSeguro {

    private static final String PROVEEDOR_KEYSTORE = "AndroidKeyStore";
    private static final String ALIAS_LLAVE = "mitecho_sesion";
    private static final String ARCHIVO_PREFERENCIAS = "sesion_segura";
    private static final String TRANSFORMACION = "AES/GCM/NoPadding";
    private static final int LARGO_VECTOR = 12;
    private static final int LARGO_ETIQUETA_BITS = 128;

    // Solo estos datos se pueden guardar desde la interfaz, cualquier otra clave se rechaza
    private static final Set<String> CLAVES_PERMITIDAS = new HashSet<>(Arrays.asList("token", "renovacion", "uid", "correo"));

    private final SharedPreferences preferencias;

    public AlmacenSeguro(Context contexto) {
        preferencias = contexto.getSharedPreferences(ARCHIVO_PREFERENCIAS, Context.MODE_PRIVATE);
    }

    public static boolean esClavePermitida(String clave) {
        return clave != null && CLAVES_PERMITIDAS.contains(clave);
    }

    // Busca la llave en el Keystore y si todavía no existe la crea una sola vez
    private SecretKey obtenerLlave() throws Exception {
        KeyStore almacen = KeyStore.getInstance(PROVEEDOR_KEYSTORE);
        almacen.load(null);
        if (almacen.containsAlias(ALIAS_LLAVE)) {
            KeyStore.SecretKeyEntry entrada = (KeyStore.SecretKeyEntry) almacen.getEntry(ALIAS_LLAVE, null);
            return entrada.getSecretKey();
        }
        KeyGenerator generador = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, PROVEEDOR_KEYSTORE);
        generador.init(new KeyGenParameterSpec.Builder(ALIAS_LLAVE,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(256)
            .build());
        return generador.generateKey();
    }

    // El vector lo genera el Keystore en cada guardado y se pega adelante del texto cifrado
    public boolean guardar(String clave, String valor) {
        if (!esClavePermitida(clave)) return false;
        if (valor == null || valor.isEmpty()) {
            borrar(clave);
            return true;
        }
        try {
            Cipher cifrador = Cipher.getInstance(TRANSFORMACION);
            cifrador.init(Cipher.ENCRYPT_MODE, obtenerLlave());
            byte[] vector = cifrador.getIV();
            byte[] cifrado = cifrador.doFinal(valor.getBytes(StandardCharsets.UTF_8));
            byte[] paquete = new byte[vector.length + cifrado.length];
            System.arraycopy(vector, 0, paquete, 0, vector.length);
            System.arraycopy(cifrado, 0, paquete, vector.length, cifrado.length);
            preferencias.edit().putString(clave, Base64.encodeToString(paquete, Base64.NO_WRAP)).apply();
            return true;
        } catch (Exception errorCifrado) {
            return false;
        }
    }

    public String leer(String clave) {
        if (!esClavePermitida(clave)) return null;
        String guardado = preferencias.getString(clave, null);
        if (guardado == null) return null;
        try {
            byte[] paquete = Base64.decode(guardado, Base64.NO_WRAP);
            if (paquete.length <= LARGO_VECTOR) return null;
            Cipher cifrador = Cipher.getInstance(TRANSFORMACION);
            GCMParameterSpec parametros = new GCMParameterSpec(LARGO_ETIQUETA_BITS, paquete, 0, LARGO_VECTOR);
            cifrador.init(Cipher.DECRYPT_MODE, obtenerLlave(), parametros);
            byte[] plano = cifrador.doFinal(paquete, LARGO_VECTOR, paquete.length - LARGO_VECTOR);
            return new String(plano, StandardCharsets.UTF_8);
        } catch (Exception errorDescifrado) {
            // Si el dato quedó dañado o la llave cambió, mejor borrarlo y pedir sesión otra vez
            borrar(clave);
            return null;
        }
    }

    public void borrar(String clave) {
        if (!esClavePermitida(clave)) return;
        preferencias.edit().remove(clave).apply();
    }
}
