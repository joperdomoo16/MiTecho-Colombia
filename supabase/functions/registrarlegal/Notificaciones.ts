// Envío de las filas a la hoja de Google y de los correos de soporte con el mismo SMTP de la bienvenida.
// Secretos: HOJA_URL y HOJA_CLAVE (los da el script de Google), CORREO_SOPORTE y los SMTP_* de siempre.
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { Plantillainactividad } from './Plantillainactividad.ts';

export function Leersecreto(Nombre: string, Pordefecto = ''): string {
  return (Deno.env.get(Nombre) ?? Pordefecto).trim();
}

export function Escaparhtml(Texto: string): string {
  return String(Texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Manda una fila a la pestaña indicada. El script revisa la clave antes de escribir, así nadie más puede llenar la hoja
export async function Enviarhoja(Pestana: 'Soporte' | 'Autorizaciones' | 'Eliminaciones', Fila: Record<string, string>): Promise<boolean> {
  const Url = Leersecreto('HOJA_URL');
  const Clave = Leersecreto('HOJA_CLAVE');
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(Url) || !Clave) return false;
  try {
    const Respuesta = await fetch(Url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave: Clave, pestana: Pestana, fila: Fila }),
      redirect: 'follow'
    });
    const Datos = await Respuesta.json().catch(() => null);
    return Boolean(Datos && Datos.ok);
  } catch {
    return false;
  }
}

// Correo sencillo con la misma franja azul y el papel claro del correo de bienvenida
function Armarcorreo(Titulo: string, Introduccion: string, Filas: [string, string][], Nota: string): string {
  const Letra = "'Hanken Grotesk',Arial,Helvetica,sans-serif";
  const Titular = "'Familjen Grotesk','Hanken Grotesk',Arial,Helvetica,sans-serif";
  const Celdas = Filas.map(([Etiqueta, Valor]) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #D6DACB;font-family:${Letra};font-size:12px;line-height:16px;font-weight:600;color:#5A6050;text-transform:uppercase;letter-spacing:.5px;width:38%;vertical-align:top;">${Escaparhtml(Etiqueta)}</td>`
    + `<td style="padding:10px 0;border-bottom:1px solid #D6DACB;font-family:${Letra};font-size:15px;line-height:22px;color:#0B0C0A;vertical-align:top;white-space:pre-wrap;">${Escaparhtml(Valor)}</td></tr>`).join('');
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${Escaparhtml(Titulo)}</title></head>`
    + `<body style="margin:0;padding:0;background-color:#EBEEE3;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EBEEE3"><tr><td align="center" style="padding:28px 12px 36px;">`
    + `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">`
    + `<tr><td bgcolor="#12274A" style="background-color:#12274A;border-radius:16px 16px 0 0;padding:26px 32px 30px;">`
    + `<p style="margin:0;font-family:${Titular};font-size:20px;line-height:24px;font-weight:700;color:#F2F4EC;">MiTecho<br><span style="font-family:${Letra};font-size:12px;font-weight:600;color:#A3A898;">Un producto de RumoriaStudio</span></p>`
    + `<h1 style="margin:28px 0 0;font-family:${Titular};font-size:28px;line-height:33px;font-weight:700;color:#F2F4EC;">${Escaparhtml(Titulo)}</h1>`
    + `<p style="margin:10px 0 0;font-family:${Letra};font-size:15px;line-height:23px;color:#C9CDBF;">${Escaparhtml(Introduccion)}</p></td></tr>`
    + `<tr><td bgcolor="#F9FAF5" style="background-color:#F9FAF5;border-radius:0 0 16px 16px;padding:18px 32px 26px;">`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${Celdas}</table>`
    + `<p style="margin:18px 0 0;font-family:${Letra};font-size:13px;line-height:20px;color:#5A6050;">${Escaparhtml(Nota)}</p>`
    + `</td></tr></table></td></tr></table></body></html>`;
}

type Adjunto = { filename: string; content: string; contentType: string; encoding: 'text' };

async function Enviarcorreo(Destino: string, Asunto: string, Html: string, Responder = '', Adjuntos: Adjunto[] = []): Promise<boolean> {
  try {
    const Cliente = new SMTPClient({
      connection: {
        hostname: Leersecreto('SMTP_HOST'),
        port: Number(Leersecreto('SMTP_PORT', '465')),
        tls: true,
        auth: { username: Leersecreto('SMTP_USER'), password: Leersecreto('SMTP_PASS') }
      }
    });
    await Cliente.send({ from: Leersecreto('SMTP_FROM'), to: Destino, subject: Asunto, html: Html, ...(Responder ? { replyTo: Responder } : {}), ...(Adjuntos.length ? { attachments: Adjuntos } : {}) });
    await Cliente.close();
    return true;
  } catch {
    return false;
  }
}

export type Datossolicitud = {
  Radicado: string; Tipo: string; Tiponombre: string; Norma: string; Nombre: string; Correo: string;
  Asunto: string; Descripcion: string; Recibida: string; Maxima: string; Prorroga: string; Concuenta: boolean;
};

// Aviso interno a RumoriaStudio; al dar Responder le contesta directo a la persona
export function Avisarsoporte(Datos: Datossolicitud): Promise<boolean> {
  const Destino = Leersecreto('CORREO_SOPORTE', 'rumoriastudio@gmail.com');
  const Html = Armarcorreo('Nueva solicitud ' + Datos.Radicado, 'Llegó una solicitud desde la app. Respóndela antes de la fecha máxima.', [
    ['Radicado', Datos.Radicado], ['Tipo', Datos.Tiponombre + ' (' + Datos.Norma + ')'], ['Recibida', Datos.Recibida],
    ['Fecha máxima', Datos.Maxima], ['Con prórroga', Datos.Prorroga], ['Nombre', Datos.Nombre], ['Correo', Datos.Correo],
    ['Cuenta en la app', Datos.Concuenta ? 'Sí' : 'No'], ['Asunto', Datos.Asunto], ['Descripción', Datos.Descripcion]
  ], 'Si necesitas la prórroga, avísale a la persona antes de la fecha máxima y explícale el motivo.');
  return Enviarcorreo(Destino, '[' + Datos.Radicado + '] ' + Datos.Tiponombre + ': ' + Datos.Asunto, Html, Datos.Correo);
}

// Acuse de recibo para la persona: es su prueba de que la solicitud llegó y de hasta cuándo tenemos para responder
export function Enviaracuse(Datos: Datossolicitud): Promise<boolean> {
  const Html = Armarcorreo('Recibimos tu solicitud', 'Hola, ' + Datos.Nombre.split(' ')[0] + '. Guarda este correo: el número de radicado identifica tu caso.', [
    ['Radicado', Datos.Radicado], ['Tipo', Datos.Tiponombre], ['Asunto', Datos.Asunto], ['Recibida', Datos.Recibida],
    ['Te respondemos a más tardar', Datos.Maxima]
  ], 'Si por algún motivo necesitamos más tiempo, te avisaremos antes de esa fecha. Para cualquier duda sobre este caso responde este correo o escribe a rumoriastudio@gmail.com indicando tu número de radicado.');
  return Enviarcorreo(Datos.Correo, 'Radicado ' + Datos.Radicado + ': recibimos tu solicitud en MiTecho', Html, Leersecreto('CORREO_SOPORTE', 'rumoriastudio@gmail.com'));
}

// Copia de los datos de la persona en un archivo JSON, solo al correo de su propia cuenta
export function Enviardatos(Correo: string, Nombre: string, Contenido: string): Promise<boolean> {
  const Html = Armarcorreo('Tus datos en MiTecho', 'Hola' + (Nombre ? ', ' + Nombre.split(' ')[0] : '') + '. Adjuntamos la copia de los datos que tenemos de tu cuenta, como lo pediste desde la app.', [
    ['Archivo', 'MiTecho_mis_datos.json'], ['Contenido', 'Cuenta, perfil financiero, resúmenes PDF, solicitudes de soporte, autorización y los datos guardados en tu celular']
  ], 'Si no pediste esta copia, escríbenos a rumoriastudio@gmail.com. Guarda este archivo en un lugar seguro porque tiene información financiera tuya.');
  return Enviarcorreo(Correo, 'Copia de tus datos en MiTecho', Html, Leersecreto('CORREO_SOPORTE', 'rumoriastudio@gmail.com'), [
    { filename: 'MiTecho_mis_datos.json', content: Contenido, contentType: 'application/json', encoding: 'text' }
  ]);
}

// Aviso de que la cuenta se va a borrar por falta de uso, con el diseño de correos/Avisoinactividad.html.
// El texto del correo dice 12 meses: si cambia Mesesinactividad, hay que cambiar también el HTML
export function Avisarinactividad(Correo: string, Nombre: string, Fechaborrado: string): Promise<boolean> {
  // Nombre, correo y fecha se escapan para que nadie pueda meter etiquetas con su nombre
  const Html = Plantillainactividad
    .replace(/\{\{nombre\}\}/g, Escaparhtml(Nombre.split(' ')[0] || 'futuro propietario'))
    .replace(/\{\{correo\}\}/g, Escaparhtml(Correo))
    .replace(/\{\{fecha\}\}/g, Escaparhtml(Fechaborrado));
  return Enviarcorreo(Correo, 'Tu cuenta de MiTecho se eliminará el ' + Fechaborrado, Html, Leersecreto('CORREO_SOPORTE', 'rumoriastudio@gmail.com'));
}
