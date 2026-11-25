package co.mitecho.app;

import android.Manifest;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import java.util.Calendar;

// Gestiona las notificaciones de racha (2 veces al día) y la alerta de efectivo sin consignar
public final class NotificadorRacha {

    public static final String CANAL_ID = "recordatorios_mitecho";

    public static final String ACCION_RACHA_MEDIODIA = "co.mitecho.app.RACHA_MEDIODIA";
    public static final String ACCION_RACHA_NOCHE = "co.mitecho.app.RACHA_NOCHE";
    public static final String ACCION_EFECTIVO = "co.mitecho.app.EFECTIVO_SIN_CONSIGNAR";

    public static final int ID_NOTIF_RACHA = 2026;
    public static final int ID_NOTIF_EFECTIVO = 2027;

    public static final int CODIGO_ALARMA_MEDIODIA = 3001;
    public static final int CODIGO_ALARMA_NOCHE = 3002;
    public static final int CODIGO_ALARMA_EFECTIVO = 3003;
    public static final int CODIGO_PERMISO_NOTIFICACIONES = 101;

    private static final String PREF_NOMBRE = "mitecho_recordatorios";
    private static final String PREF_ACTIVO = "racha_activo";
    private static final String PREF_TIENE_EFECTIVO = "tiene_efectivo";
    private static final String PREF_HORA_NOCHE = "racha_hora_noche";
    private static final String PREF_MINUTO_NOCHE = "racha_minuto_noche";

    private NotificadorRacha() {}

    public static void crearCanal(Context contexto) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel canal = new NotificationChannel(
                CANAL_ID,
                "Recordatorios de MiTecho",
                NotificationManager.IMPORTANCE_HIGH
            );
            canal.setDescription("Avisos de racha de ahorro y alertas de movimientos en efectivo.");
            canal.enableLights(true);
            canal.setLightColor(Color.parseColor("#1E345B"));
            canal.enableVibration(true);
            NotificationManager gestor = contexto.getSystemService(NotificationManager.class);
            if (gestor != null) {
                gestor.createNotificationChannel(canal);
            }
        }
    }

    public static void solicitarPermiso(Activity actividad) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(actividad, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(actividad,
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    CODIGO_PERMISO_NOTIFICACIONES);
            }
        }
    }

    // Programa las notificaciones de racha (2 veces al día: 1:00 PM y noche) y la de efectivo
    public static void programarRecordatorios(Context contexto, boolean activo, String horaNocheTexto) {
        int horaNoche = 20;
        int minutoNoche = 0;
        if (horaNocheTexto != null && horaNocheTexto.contains(":")) {
            try {
                String limpia = horaNocheTexto.trim().toUpperCase();
                boolean esPm = limpia.contains("PM");
                boolean esAm = limpia.contains("AM");
                String soloTiempo = limpia.replace("PM", "").replace("AM", "").trim();
                String[] partes = soloTiempo.split(":");
                int h = Integer.parseInt(partes[0].trim());
                int m = Integer.parseInt(partes[1].trim());
                if (esPm && h < 12) h += 12;
                if (esAm && h == 12) h = 0;
                if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                    horaNoche = h;
                    minutoNoche = m;
                }
            } catch (Exception ignorada) {
                horaNoche = 20;
                minutoNoche = 0;
            }
        }

        SharedPreferences prefs = contexto.getSharedPreferences(PREF_NOMBRE, Context.MODE_PRIVATE);
        prefs.edit()
            .putBoolean(PREF_ACTIVO, activo)
            .putInt(PREF_HORA_NOCHE, horaNoche)
            .putInt(PREF_MINUTO_NOCHE, minutoNoche)
            .apply();

        AlarmManager gestorAlarma = (AlarmManager) contexto.getSystemService(Context.ALARM_SERVICE);
        if (gestorAlarma == null) return;

        PendingIntent piMediodia = crearPendingIntent(contexto, ACCION_RACHA_MEDIODIA, CODIGO_ALARMA_MEDIODIA);
        PendingIntent piNoche = crearPendingIntent(contexto, ACCION_RACHA_NOCHE, CODIGO_ALARMA_NOCHE);
        PendingIntent piEfectivo = crearPendingIntent(contexto, ACCION_EFECTIVO, CODIGO_ALARMA_EFECTIVO);

        if (!activo) {
            gestorAlarma.cancel(piMediodia);
            gestorAlarma.cancel(piNoche);
            gestorAlarma.cancel(piEfectivo);
            return;
        }

        Calendar calMediodia = calcularSiguienteMomento(13, 0);
        programarAlarmaSegura(gestorAlarma, calMediodia.getTimeInMillis(), piMediodia);

        Calendar calNoche = calcularSiguienteMomento(horaNoche, minutoNoche);
        programarAlarmaSegura(gestorAlarma, calNoche.getTimeInMillis(), piNoche);

        Calendar calEfectivo = calcularSiguienteMomento(16, 30);
        programarAlarmaSegura(gestorAlarma, calEfectivo.getTimeInMillis(), piEfectivo);
    }

    // Actualiza si el usuario tiene efectivo pendiente por consignar
    public static void actualizarEstadoEfectivo(Context contexto, boolean tieneEfectivo) {
        SharedPreferences prefs = contexto.getSharedPreferences(PREF_NOMBRE, Context.MODE_PRIVATE);
        prefs.edit().putBoolean(PREF_TIENE_EFECTIVO, tieneEfectivo).apply();
    }

    public static void reprogramarSiguiente(Context contexto, String accion) {
        SharedPreferences prefs = contexto.getSharedPreferences(PREF_NOMBRE, Context.MODE_PRIVATE);
        boolean activo = prefs.getBoolean(PREF_ACTIVO, true);
        if (!activo) return;

        AlarmManager gestorAlarma = (AlarmManager) contexto.getSystemService(Context.ALARM_SERVICE);
        if (gestorAlarma == null) return;

        Calendar c = Calendar.getInstance();
        c.add(Calendar.DAY_OF_YEAR, 1);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);

        if (ACCION_RACHA_MEDIODIA.equals(accion)) {
            c.set(Calendar.HOUR_OF_DAY, 13);
            c.set(Calendar.MINUTE, 0);
            PendingIntent pi = crearPendingIntent(contexto, ACCION_RACHA_MEDIODIA, CODIGO_ALARMA_MEDIODIA);
            programarAlarmaSegura(gestorAlarma, c.getTimeInMillis(), pi);
        } else if (ACCION_RACHA_NOCHE.equals(accion)) {
            int h = prefs.getInt(PREF_HORA_NOCHE, 20);
            int m = prefs.getInt(PREF_MINUTO_NOCHE, 0);
            c.set(Calendar.HOUR_OF_DAY, h);
            c.set(Calendar.MINUTE, m);
            PendingIntent pi = crearPendingIntent(contexto, ACCION_RACHA_NOCHE, CODIGO_ALARMA_NOCHE);
            programarAlarmaSegura(gestorAlarma, c.getTimeInMillis(), pi);
        } else if (ACCION_EFECTIVO.equals(accion)) {
            c.set(Calendar.HOUR_OF_DAY, 16);
            c.set(Calendar.MINUTE, 30);
            PendingIntent pi = crearPendingIntent(contexto, ACCION_EFECTIVO, CODIGO_ALARMA_EFECTIVO);
            programarAlarmaSegura(gestorAlarma, c.getTimeInMillis(), pi);
        }
    }

    public static void reprogramarTodas(Context contexto) {
        SharedPreferences prefs = contexto.getSharedPreferences(PREF_NOMBRE, Context.MODE_PRIVATE);
        boolean activo = prefs.getBoolean(PREF_ACTIVO, true);
        int h = prefs.getInt(PREF_HORA_NOCHE, 20);
        int m = prefs.getInt(PREF_MINUTO_NOCHE, 0);
        programarRecordatorios(contexto, activo, h + ":" + (m < 10 ? "0" + m : m));
    }

    // Lanza el recordatorio diario de registros en la barra del celular
    public static void mostrarNotificacionRacha(Context contexto, boolean esNoche) {
        crearCanal(contexto);
        PendingIntent pendingApp = crearPendingIntentLanzarApp(contexto, "ingresos", 4001);

        String titulo = "Mantén tu racha en MiTecho";
        String texto = esNoche
            ? "¿Anotaste tus movimientos de hoy? Mantén viva tu racha para simular mejor tu crédito de vivienda."
            : "Registra tus ingresos o gastos para que tu proyección de vivienda esté lo más ajustada a tu realidad.";

        String textoExpandido = "Recuerda registrar tus movimientos para mantener tu racha activa y lograr que la simulación de tu vivienda se acerque cada vez más a tus números reales.";

        NotificationCompat.Builder constructor = new NotificationCompat.Builder(contexto, CANAL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setColor(Color.parseColor("#1E345B"))
            .setContentTitle(titulo)
            .setContentText(texto)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(textoExpandido))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingApp);

        NotificationManager gestor = (NotificationManager) contexto.getSystemService(Context.NOTIFICATION_SERVICE);
        if (gestor != null) {
            gestor.notify(ID_NOTIF_RACHA, constructor.build());
        }
    }

    // Avisa en la tarde solo cuando quedan ingresos en efectivo pendientes por consignar
    public static void mostrarNotificacionEfectivo(Context contexto) {
        SharedPreferences prefs = contexto.getSharedPreferences(PREF_NOMBRE, Context.MODE_PRIVATE);
        boolean tieneEfectivo = prefs.getBoolean(PREF_TIENE_EFECTIVO, false);
        if (!tieneEfectivo) return;

        crearCanal(contexto);
        PendingIntent pendingApp = crearPendingIntentLanzarApp(contexto, "ingresos", 4002);

        String titulo = "El banco no ve tu efectivo";
        String texto = "Tienes movimientos sin consignar. Recuerda que el banco no los ve. Si ya los consignaste, márcalos en la app; si no, MiTecho te espera.";
        String textoExpandido = "Tienes movimientos en efectivo sin consignar. Recuerda que el banco solo cuenta lo que entra a tus extractos. Si ya los consignaste, actualízalos en la app.";

        NotificationCompat.Builder constructor = new NotificationCompat.Builder(contexto, CANAL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setColor(Color.parseColor("#FF6A2B"))
            .setContentTitle(titulo)
            .setContentText(texto)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(textoExpandido))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingApp);

        NotificationManager gestor = (NotificationManager) contexto.getSystemService(Context.NOTIFICATION_SERVICE);
        if (gestor != null) {
            gestor.notify(ID_NOTIF_EFECTIVO, constructor.build());
        }
    }

    private static PendingIntent crearPendingIntent(Context contexto, String accion, int codigo) {
        Intent intent = new Intent(contexto, ReceptorAlarmaRacha.class);
        intent.setAction(accion);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getBroadcast(contexto, codigo, intent, flags);
    }

    private static PendingIntent crearPendingIntentLanzarApp(Context contexto, String destino, int codigo) {
        Intent intentApp = new Intent(contexto, ActividadPrincipal.class);
        intentApp.setAction(Intent.ACTION_MAIN);
        intentApp.addCategory(Intent.CATEGORY_LAUNCHER);
        intentApp.putExtra("destino", destino);
        intentApp.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getActivity(contexto, codigo, intentApp, flags);
    }

    private static void programarAlarmaSegura(AlarmManager gestor, long tiempoMillis, PendingIntent intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            gestor.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, tiempoMillis, intent);
        } else {
            gestor.set(AlarmManager.RTC_WAKEUP, tiempoMillis, intent);
        }
    }

    private static Calendar calcularSiguienteMomento(int hora, int minuto) {
        Calendar c = Calendar.getInstance();
        c.set(Calendar.HOUR_OF_DAY, hora);
        c.set(Calendar.MINUTE, minuto);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        if (c.getTimeInMillis() <= System.currentTimeMillis()) {
            c.add(Calendar.DAY_OF_YEAR, 1);
        }
        return c;
    }
}
