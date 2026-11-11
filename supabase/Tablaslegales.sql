-- Tablas para las solicitudes de soporte y la prueba de autorización de datos (Ley 1581 de 2012)
-- Se pegan una sola vez en Supabase > SQL Editor > New query > Run.
-- Las dos tablas quedan con RLS activo y sin reglas: ni la app ni nadie con la llave pública puede leerlas
-- o escribirlas. Solo la función registrarlegal, que usa la llave de servicio, guarda en ellas.

create table if not exists public.solicitudes_soporte (
  id bigint generated always as identity primary key,
  radicado text not null unique,
  usuario_id uuid references auth.users (id) on delete set null,
  tipo text not null check (tipo in ('soporte', 'consulta', 'reclamo')),
  nombre text not null check (char_length(nombre) between 6 and 80),
  correo text not null check (char_length(correo) between 6 and 100),
  asunto text not null check (char_length(asunto) between 6 and 100),
  descripcion text not null check (char_length(descripcion) between 20 and 500),
  recibida_en timestamptz not null default now(),
  fecha_maxima date not null,
  fecha_prorroga date not null,
  estado text not null default 'Pendiente',
  origen_huella text not null default '',
  enviada_hoja boolean not null default false
);

-- Sirve para contar rápido cuántas solicitudes llegaron por correo o por conexión en la última hora
create index if not exists solicitudes_soporte_correo_idx on public.solicitudes_soporte (correo, recibida_en desc);
create index if not exists solicitudes_soporte_huella_idx on public.solicitudes_soporte (origen_huella, recibida_en desc);

-- La prueba de autorización se conserva aunque la persona borre su cuenta, porque la ley pide poder demostrarla;
-- por eso usuario_id no está amarrado a auth.users
create table if not exists public.autorizaciones (
  id bigint generated always as identity primary key,
  usuario_id uuid not null,
  nombre text not null default '',
  correo text not null,
  metodo text not null,
  version_politica text not null,
  plataforma text not null default '',
  autorizada_en timestamptz not null default now(),
  enviada_hoja boolean not null default false,
  unique (usuario_id, version_politica)
);

alter table public.solicitudes_soporte enable row level security;
alter table public.autorizaciones enable row level security;

revoke all on public.solicitudes_soporte from anon, authenticated;
revoke all on public.autorizaciones from anon, authenticated;
