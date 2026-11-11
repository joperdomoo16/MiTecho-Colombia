-- Tarea diaria que borra las cuentas al cumplir 12 meses sin uso, con aviso por correo 30 días antes.
-- Antes de correrla:
--   1. Crea el secreto TAREA_CLAVE en Edge Functions > Secrets con una clave larga al azar (mínimo 32 caracteres).
--   2. Reemplaza PEGA_AQUI_TAREA_CLAVE abajo por esa misma clave.
-- Luego pégala en Supabase > SQL Editor > New query > Run. Corre todos los días a las 3:00 a. m. de Bogotá (8:00 UTC).

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Si ya existía la tarea, se borra para volver a crearla con la clave nueva
select cron.unschedule(jobid) from cron.job where jobname = 'depurar-cuentas-inactivas';

select cron.schedule(
  'depurar-cuentas-inactivas',
  '0 8 * * *',
  $$
  select net.http_post(
    url := 'https://tbliwiawziexlziqqcji.supabase.co/functions/v1/registrarlegal',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-clave-tarea', 'PEGA_AQUI_TAREA_CLAVE'),
    body := '{"accion":"depurar"}'::jsonb,
    timeout_milliseconds := 120000
  );
  $$
);
