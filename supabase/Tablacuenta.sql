-- Constancia de cada cuenta borrada (correo, fecha y motivo), que la política promete conservar.
-- Se pega una sola vez en Supabase > SQL Editor > New query > Run.
-- Igual que las otras tablas legales: RLS activo y sin reglas, solo la función registrarlegal la usa.

create table if not exists public.eliminaciones (
  id bigint generated always as identity primary key,
  usuario_id uuid not null,
  correo text not null,
  motivo text not null check (motivo in ('usuario', 'inactividad')),
  eliminada_en timestamptz not null default now(),
  enviada_hoja boolean not null default false
);

alter table public.eliminaciones enable row level security;
revoke all on public.eliminaciones from anon, authenticated;
