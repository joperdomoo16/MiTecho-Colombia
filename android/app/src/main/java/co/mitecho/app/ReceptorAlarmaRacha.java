package co.mitecho.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

// Recibe las alarmas de racha (mediodía y noche) y la de efectivo sin consignar
public final class ReceptorAlarmaRacha extends BroadcastReceiver {

    @Override
    public void onReceive(Context contexto, Intent intent) {
        if (intent == null) return;
        String accion = intent.getAction();
        if (accion == null) return;

        if (NotificadorRacha.ACCION_RACHA_MEDIODIA.equals(accion)) {
            NotificadorRacha.mostrarNotificacionRacha(contexto, false);
            NotificadorRacha.reprogramarSiguiente(contexto, accion);
        } else if (NotificadorRacha.ACCION_RACHA_NOCHE.equals(accion)) {
            NotificadorRacha.mostrarNotificacionRacha(contexto, true);
            NotificadorRacha.reprogramarSiguiente(contexto, accion);
        } else if (NotificadorRacha.ACCION_EFECTIVO.equals(accion)) {
            NotificadorRacha.mostrarNotificacionEfectivo(contexto);
            NotificadorRacha.reprogramarSiguiente(contexto, accion);
        } else if (Intent.ACTION_BOOT_COMPLETED.equals(accion)
                || "android.intent.action.QUICKBOOT_POWERON".equals(accion)) {
            NotificadorRacha.reprogramarTodas(contexto);
        }
    }
}
