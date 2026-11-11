-- Tarea que actualiza las tasas de vivienda por banco de martes a viernes a las 6:00 a. m. de Bogotá (11:00 UTC).
-- Antes de correrla reemplaza PEGA_AQUI_TAREA_CLAVE por la misma clave del secreto TAREA_CLAVE.
-- Luego pégala en Supabase > SQL Editor > New query > Run.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule(jobid) from cron.job where jobname = 'actualizar-tasas-vivienda';

select cron.schedule(
  'actualizar-tasas-vivienda',
  '0 11 * * 2-5',
  $$
  select net.http_post(
    url := 'https://tbliwiawziexlziqqcji.supabase.co/functions/v1/actualizartasas',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-clave-tarea', 'PEGA_AQUI_TAREA_CLAVE'),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
  $$
);
