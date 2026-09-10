-- Guías por rol para cada tema del módulo Académico.
-- Correr manualmente en el SQL Editor de Supabase.

alter table conecta_planificaciones
  add column if not exists guia_docente text,
  add column if not exists guia_estudiante text;
