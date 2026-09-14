-- Legajo: ocupación del padre y de la madre.
-- Correr manualmente en el SQL Editor de Supabase.

alter table conecta_legajos
  add column if not exists ocupacion_padre text,
  add column if not exists ocupacion_madre text;
