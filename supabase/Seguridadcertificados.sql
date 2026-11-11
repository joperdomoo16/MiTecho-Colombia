-- Cierra la lectura pública de la tabla certificados. La política del código QR dejaba que cualquiera,
-- incluso sin sesión, leyera nombres, precios y créditos de todas las personas. El QR ya no existe en el reporte.
-- Pégalo en Supabase > SQL Editor y dale Run. Se puede correr más de una vez sin problema.

drop policy if exists "Validación pública de certificados por código QR" on public.certificados;

-- Cada persona solo ve los suyos; sin sesión no se ve nada
drop policy if exists "Usuarios ven sus certificados" on public.certificados;
create policy "Usuarios ven sus certificados" on public.certificados
  for select to authenticated
  using (auth.uid() = usuario_id);

-- Revisión: deben quedar solo dos políticas en certificados (registrar y ver los propios)
select policyname, cmd, roles, qual, with_check
from pg_policies
where tablename = 'certificados';
