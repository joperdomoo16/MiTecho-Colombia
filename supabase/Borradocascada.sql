-- Hace que los certificados y los leads comerciales se borren junto con la cuenta.
-- Antes quedaban sin dueño (usuario_id en blanco) cuando se borraba un usuario desde Authentication > Users.
-- Se pega en Supabase > SQL Editor > New query > Run. Se puede correr más de una vez sin problema.

begin;

alter table public.certificados drop constraint if exists certificados_usuario_id_fkey;
alter table public.certificados
  add constraint certificados_usuario_id_fkey
  foreign key (usuario_id) references auth.users (id) on delete cascade;

alter table public.leads_comerciales drop constraint if exists leads_comerciales_usuario_id_fkey;
alter table public.leads_comerciales
  add constraint leads_comerciales_usuario_id_fkey
  foreign key (usuario_id) references auth.users (id) on delete cascade;

commit;

