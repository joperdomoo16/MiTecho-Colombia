// Función de Supabase que envía el correo de bienvenida una sola vez, la primera vez que la cuenta entra a MiTecho.
// La app la llama después de cada inicio de sesión; aquí se decide si toca enviar o si ya se envió.
// Secretos que hay que crear en Supabase (Edge Functions > Secrets): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y SMTP_FROM.
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los pone Supabase solo; nunca van dentro de la app.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { Plantillabienvenida } from './Plantillabienvenida.ts';

// La app abre como https://localhost en Android y capacitor://localhost en iPhone
const Origenespermitidos = ['https://localhost', 'capacitor://localhost'];
const Asunto = 'Bienvenido a MiTecho, ya puedes simular tu vivienda';

// Lee un secreto sin espacios ni saltos de línea de más (al pegarlo en el panel es fácil que se cuele un Enter)
function Leersecreto(Nombre: string, Pordefecto = ''): string {
  return (Deno.env.get(Nombre) ?? Pordefecto).trim();
}

function Cabeceras(Origen: string | null): Record<string, string> {
  const Cabecera: Record<string, string> = { 'Content-Type': 'application/json; charset=utf-8', 'Vary': 'Origin' };
  if (Origen && Origenespermitidos.includes(Origen)) {
    Cabecera['Access-Control-Allow-Origin'] = Origen;
    Cabecera['Access-Control-Allow-Headers'] = 'authorization, apikey, content-type';
    Cabecera['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
  }
  return Cabecera;
}

function Responder(Estado: number, Cuerpo: Record<string, unknown>, Origen: string | null): Response {
  return new Response(JSON.stringify(Cuerpo), { status: Estado, headers: Cabeceras(Origen) });
}

// El nombre y el correo van dentro del HTML, así que se escapan para que nadie meta etiquetas con su nombre
function Escaparhtml(Texto: string): string {
  return Texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Con correo y contraseña el nombre queda en "nombre"; con Google llega en "full_name" o "name"
function Nombredeusuario(Metadatos: Record<string, unknown>): string {
  const Crudo = String(Metadatos.nombre || Metadatos.full_name || Metadatos.name || '').trim().replace(/\s+/g, ' ');
  const Primero = Crudo.split(' ')[0] || '';
  return Primero.slice(0, 40) || 'futuro propietario';
}

Deno.serve(async (Peticion: Request) => {
  const Origen = Peticion.headers.get('Origin');
  if (Peticion.method === 'OPTIONS') return new Response(null, { status: 204, headers: Cabeceras(Origen) });
  if (Peticion.method !== 'POST') return Responder(405, { ok: false, mensaje: 'Método no permitido.' }, Origen);

  const Token = (Peticion.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!Token) return Responder(401, { ok: false, mensaje: 'Inicia sesión para continuar.' }, Origen);

  const Administrador = createClient(Leersecreto('SUPABASE_URL'), Leersecreto('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // Se toma el usuario del token, nunca de lo que mande la app, para que nadie pida correos para otra cuenta
  const { data: Datosusuario, error: Fallausuario } = await Administrador.auth.getUser(Token);
  const Usuario = Datosusuario?.user;
  if (Fallausuario || !Usuario || !Usuario.email) return Responder(401, { ok: false, mensaje: 'La sesión no es válida.' }, Origen);
  if (!Usuario.email_confirmed_at) return Responder(403, { ok: false, mensaje: 'Primero confirma tu correo.' }, Origen);

  const Metadatosapp = (Usuario.app_metadata || {}) as Record<string, unknown>;
  if (Metadatosapp.bienvenida_enviada) return Responder(200, { ok: true, enviado: false }, Origen);

  // La marca se pone antes de enviar para que dos inicios de sesión seguidos no manden dos correos
  const { error: Fallamarca } = await Administrador.auth.admin.updateUserById(Usuario.id, {
    app_metadata: { ...Metadatosapp, bienvenida_enviada: new Date().toISOString() }
  });
  if (Fallamarca) return Responder(500, { ok: false, mensaje: 'No pudimos procesar tu solicitud en este momento, intenta de nuevo.' }, Origen);

  const Html = Plantillabienvenida
    .replace(/\{\{nombre\}\}/g, Escaparhtml(Nombredeusuario((Usuario.user_metadata || {}) as Record<string, unknown>)))
    .replace(/\{\{correo\}\}/g, Escaparhtml(Usuario.email));

  try {
    // Supabase bloquea los puertos 25 y 587, por eso se usa el 465 con TLS directo
    const Cliente = new SMTPClient({
      connection: {
        hostname: Leersecreto('SMTP_HOST'),
        port: Number(Leersecreto('SMTP_PORT', '465')),
        tls: true,
        auth: { username: Leersecreto('SMTP_USER'), password: Leersecreto('SMTP_PASS') }
      }
    });
    await Cliente.send({ from: Leersecreto('SMTP_FROM'), to: Usuario.email, subject: Asunto, html: Html });
    await Cliente.close();
    return Responder(200, { ok: true, enviado: true }, Origen);
  } catch {
    // Si el correo no salió se quita la marca para intentarlo otra vez en el próximo inicio de sesión
    await Administrador.auth.admin.updateUserById(Usuario.id, { app_metadata: { ...Metadatosapp, bienvenida_enviada: null } });
    return Responder(502, { ok: false, mensaje: 'No pudimos enviar el correo de bienvenida en este momento.' }, Origen);
  }
});
