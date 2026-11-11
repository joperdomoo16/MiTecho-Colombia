// Borrado de cuentas sin uso, como lo prometen los términos y la política: aviso por correo 30 días antes
// y borrado al cumplir 12 meses sin uso. La regla de fechas está en Plazoinactividad.ts.
// Lo dispara una tarea programada de Supabase (pg_cron) una vez al día con la clave TAREA_CLAVE.
import type { SupabaseClient, User } from 'npm:@supabase/supabase-js@2.45.4';
import { Eliminarusuario } from './Cuenta.ts';
import { Avisarinactividad } from './Notificaciones.ts';
import { Fechalarga, Hoybogota } from './Festivos.ts';
import { Decidirinactividad } from './Plazoinactividad.ts';

// Topes por ejecución para no pasarse del límite de correos de Gmail ni del tiempo de la función
const Maximoavisos = 80;
const Maximoborrados = 50;

function Fechaonula(Valor: unknown): number {
  const Tiempo = Valor ? new Date(String(Valor)).getTime() : NaN;
  return isNaN(Tiempo) ? 0 : Tiempo;
}

function Nombrede(Usuario: User): string {
  const Metadatos = (Usuario.user_metadata || {}) as Record<string, unknown>;
  return String(Metadatos.nombre || Metadatos.full_name || Metadatos.name || '').trim();
}

async function Quitaraviso(Administrador: SupabaseClient, Usuario: User, Metadatos: Record<string, unknown>) {
  const Nuevos = { ...Metadatos };
  delete Nuevos.aviso_inactividad;
  delete Nuevos.borrar_desde;
  await Administrador.auth.admin.updateUserById(Usuario.id, { app_metadata: Nuevos });
}

export async function Depurarinactivos(Administrador: SupabaseClient) {
  const Ahora = Date.now();
  const Resumen = { revisados: 0, avisos: 0, borrados: 0, cancelados: 0, fallas: 0 };

  for (let Pagina = 1; Pagina < 1000; Pagina++) {
    const { data, error } = await Administrador.auth.admin.listUsers({ page: Pagina, perPage: 1000 });
    if (error) { Resumen.fallas++; break; }
    const Usuarios = data?.users || [];
    for (const Usuario of Usuarios) {
      Resumen.revisados++;
      const Metadatos = (Usuario.app_metadata || {}) as Record<string, unknown>;
      // Cuenta como uso el último inicio de sesión, el último día que abrió la app o la creación de la cuenta
      const Ultima = Math.max(Fechaonula(Usuario.last_sign_in_at), Fechaonula(Metadatos.ultima_actividad), Fechaonula(Usuario.created_at));
      const Decision = Decidirinactividad(Ultima, Fechaonula(Metadatos.aviso_inactividad), Fechaonula(Metadatos.borrar_desde), Ahora);

      if (Decision.Accion === 'cancelar') {
        await Quitaraviso(Administrador, Usuario, Metadatos);
        Resumen.cancelados++;
      } else if (Decision.Accion === 'avisar') {
        if (Resumen.avisos >= Maximoavisos || !Usuario.email) continue;
        const Fechaborrado = Hoybogota(new Date(Decision.Borrarel));
        const Enviado = await Avisarinactividad(Usuario.email, Nombrede(Usuario), Fechalarga(Fechaborrado));
        if (!Enviado) { Resumen.fallas++; continue; }
        await Administrador.auth.admin.updateUserById(Usuario.id, {
          app_metadata: { ...Metadatos, aviso_inactividad: new Date(Ahora).toISOString(), borrar_desde: new Date(Decision.Borrarel).toISOString() }
        });
        Resumen.avisos++;
      } else if (Decision.Accion === 'borrar' && Resumen.borrados < Maximoborrados) {
        const Resultado = await Eliminarusuario(Administrador, Usuario, 'inactividad');
        if (Resultado.ok) Resumen.borrados++; else Resumen.fallas++;
      }
    }
    if (Usuarios.length < 1000) break;
  }
  return Resumen;
}
