-- Tasas de vivienda por entidad, calculadas con los datos abiertos de la Superintendencia Financiera (Formato 414).
-- Se pega una sola vez en Supabase > SQL Editor > New query > Run.
-- Son datos públicos: cualquiera puede leerlos, pero solo la función actualizartasas (llave de servicio) los escribe.

create table if not exists public.tasas_vivienda_semanal (
  codigo_entidad text not null,
  nombre_entidad text not null,
  producto text not null,
  tasa numeric(7, 4) not null,
  tasa_min numeric(7, 4) not null,
  tasa_max numeric(7, 4) not null,
  monto numeric not null,
  creditos integer not null,
  ultima_fecha date not null,
  ventana_desde date not null,
  ventana_hasta date not null,
  actualizado_en timestamptz not null default now(),
  primary key (codigo_entidad, producto)
);

alter table public.tasas_vivienda_semanal enable row level security;

drop policy if exists "Cualquiera lee las tasas" on public.tasas_vivienda_semanal;
create policy "Cualquiera lee las tasas" on public.tasas_vivienda_semanal
  for select to anon, authenticated using (true);

revoke insert, update, delete on public.tasas_vivienda_semanal from anon, authenticated;
grant select on public.tasas_vivienda_semanal to anon, authenticated;
