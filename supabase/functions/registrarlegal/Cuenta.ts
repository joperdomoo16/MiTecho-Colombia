// Acciones sobre la cuenta de la persona: borrarla, mandarle la copia de sus datos y registrar que sigue usando la app.
// Las solicitudes de soporte y la prueba de autorización no se borran: la ley pide poder demostrar que se atendieron.
import type { SupabaseClient, User } from 'npm:@supabase/supabase-js@2.45.4';
import { Enviarhoja, Enviardatos } from './Notificaciones.ts';
import { Hoybogota, Textofecha } from './Festivos.ts';

// Tablas con datos de la persona que se borran con la cuenta
const Tablasusuario = ['perfiles_financieros', 'transacciones', 'certificados', 'leads_comerciales'];
const Maximoexportaciones = 3;

function Nombrede(Usuario: User): string {
  const Metadatos = (Usuario.user_metadata || {}) as Record<string, unknown>;
  return String(Metadatos.nombre || Metadatos.full_name || Metadatos.name || '').trim().slice(0, 80);
}

// Deja constancia de la eliminación (correo y fecha), borra los datos y al final la cuenta de acceso
export async function Eliminarusuario(Administrador: SupabaseClient, Usuario: User, Motivo: 'usuario' | 'inactividad') {
  const Momento = new Date();
  const Correo = Usuario.email || '';
  const { error: Fallaconstancia } = await Administrador.from('eliminaciones').insert({
    usuario_id: Usuario.id, correo: Correo, motivo: Motivo, eliminada_en: Momento.toISOString()
  });
  if (Fallaconstancia) return { ok: false, mensaje: 'No pudimos borrar tu cuenta en este momento, intenta de nuevo.' };

  for (const Tabla of Tablasusuario) {
    const { error } = await Administrador.from(Tabla).delete().eq('usuario_id', Usuario.id);
    // Si una tabla no existe en el proyecto se sigue con las demás; cualquier otro error detiene el borrado
    if (error && error.code !== '42P01' && error.code !== 'PGRST205') return { ok: false, mensaje: 'No pudimos borrar tu cuenta en este momento, intenta de nuevo.' };
  }

  const { error: Fallacuenta } = await Administrador.auth.admin.deleteUser(Usuario.id);
  if (Fallacuenta) return { ok: false, mensaje: 'No pudimos borrar tu cuenta en este momento, intenta de nuevo.' };

  const Enhoja = await Enviarhoja('Eliminaciones', {
    correo: Correo, nombre: Nombrede(Usuario), motivo: Motivo === 'usuario' ? 'La persona la borró desde la app' : 'Inactividad', fecha: Momento.toISOString()
  });
  if (Enhoja) await Administrador.from('eliminaciones').update({ enviada_hoja: true }).eq('usuario_id', Usuario.id);
  return { ok: true };
}

async function Leertabla(Administrador: SupabaseClient, Tabla: string, Columna: string, Valor: string) {
  const { data, error } = await Administrador.from(Tabla).select('*').eq(Columna, Valor);
  return error ? [] : (data || []);
}

// Arma la copia con lo que hay en la nube y lo que la app guarda en el celular, y la manda al correo de la cuenta
export async function Exportardatos(Administrador: SupabaseClient, Usuario: User, Local: unknown) {
  const Metadatosapp = (Usuario.app_metadata || {}) as Record<string, unknown>;
  const Hoy = Textofecha(Hoybogota());
  const Previas = Metadatosapp.exportaciones as { fecha?: string; cantidad?: number } | undefined;
  const Cantidad = Previas && Previas.fecha === Hoy ? Number(Previas.cantidad || 0) : 0;
  if (Cantidad >= Maximoexportaciones) return { ok: false, estado: 429, mensaje: 'Ya pediste ' + Maximoexportaciones + ' copias hoy. Inténtalo de nuevo mañana.' };

  const Correo = Usuario.email || '';
  const [Perfil, Resumenes, Transacciones, Contactos, Soportecuenta, Soportecorreo, Autorizaciones] = await Promise.all([
    Leertabla(Administrador, 'perfiles_financieros', 'usuario_id', Usuario.id),
    Leertabla(Administrador, 'certificados', 'usuario_id', Usuario.id),
    Leertabla(Administrador, 'transacciones', 'usuario_id', Usuario.id),
    Leertabla(Administrador, 'leads_comerciales', 'usuario_id', Usuario.id),
    Leertabla(Administrador, 'solicitudes_soporte', 'usuario_id', Usuario.id),
    Leertabla(Administrador, 'solicitudes_soporte', 'correo', Correo),
    Leertabla(Administrador, 'autorizaciones', 'usuario_id', Usuario.id)
  ]);
  const Solicitudes = [...new Map([...Soportecuenta, ...Soportecorreo].map(Fila => [Fila.radicado, Fila])).values()];

  const Copia = {
    generada_en: new Date().toISOString(),
    responsable: 'RumoriaStudio, creadores de MiTecho · rumoriastudio@gmail.com',
    cuenta: {
      correo: Correo, nombre: Nombrede(Usuario), creada_en: Usuario.created_at, ultimo_ingreso: Usuario.last_sign_in_at,
      metodo: Metadatosapp.provider || '', pro: Boolean(Metadatosapp.pro)
    },
    perfil_financiero: Perfil,
    resumenes_pdf: Resumenes,
    solicitudes_de_soporte: Solicitudes,
    autorizaciones: Autorizaciones,
    registros_anteriores_en_la_nube: Transacciones,
    contactos_anteriores: Contactos,
    guardado_en_el_celular: Local && typeof Local === 'object' ? Local : {}
  };

  const Enviado = await Enviardatos(Correo, Nombrede(Usuario), JSON.stringify(Copia, null, 2));
  if (!Enviado) return { ok: false, estado: 502, mensaje: 'No pudimos enviar el correo en este momento, intenta de nuevo.' };
  await Administrador.auth.admin.updateUserById(Usuario.id, {
    app_metadata: { ...Metadatosapp, exportaciones: { fecha: Hoy, cantidad: Cantidad + 1 } }
  });
  return { ok: true, correo: Correo };
}

// Guarda el día en que la persona abrió la app (una vez al día) y le devuelve si tiene Pro y qué versión autorizó.
// Con esto el borrado por inactividad no toca a quien usa la app sin volver a iniciar sesión
export async function Registraractividad(Administrador: SupabaseClient, Usuario: User) {
  const Metadatosapp = (Usuario.app_metadata || {}) as Record<string, unknown>;
  const Hoy = Textofecha(Hoybogota());
  if (Metadatosapp.ultima_actividad !== Hoy || Metadatosapp.aviso_inactividad || Metadatosapp.borrar_desde) {
    const Nuevos = { ...Metadatosapp, ultima_actividad: Hoy };
    // Abrir la app cancela el borrado por inactividad que se hubiera avisado
    delete (Nuevos as Record<string, unknown>).aviso_inactividad;
    delete (Nuevos as Record<string, unknown>).borrar_desde;
    await Administrador.auth.admin.updateUserById(Usuario.id, { app_metadata: Nuevos });
  }
  const Autorizacion = Metadatosapp.autorizacion as { version?: string } | undefined;
  return { ok: true, pro: Boolean(Metadatosapp.pro), autorizacion: Autorizacion && Autorizacion.version ? Autorizacion.version : '' };
}
