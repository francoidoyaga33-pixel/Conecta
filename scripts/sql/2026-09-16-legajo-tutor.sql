-- Legajo: datos de tutor (cuando el alumno no cuenta con padre/madre).
-- Correr manualmente en el SQL Editor de Supabase.

alter table conecta_legajos
  add column if not exists tiene_tutor boolean not null default false,
  add column if not exists nombre_tutor text,
  add column if not exists telefono_tutor text,
  add column if not exists email_tutor text,
  add column if not exists ocupacion_tutor text,
  add column if not exists parentesco_tutor text;
