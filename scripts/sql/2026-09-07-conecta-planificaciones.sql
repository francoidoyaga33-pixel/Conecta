-- Módulo académico: planificación de contenidos por curso.
-- Correr manualmente en el SQL Editor de Supabase.

create table if not exists conecta_planificaciones (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references conecta_grupos(id) on delete cascade,
  docente_id uuid not null references conecta_profiles(id),
  ciclo_lectivo integer not null default extract(year from now())::int,
  orden integer not null default 0,
  unidad text,
  titulo text not null,
  descripcion text,
  fecha_estimada date,
  estado text not null default 'planificado' check (estado in ('planificado', 'en_curso', 'completado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conecta_planificaciones_grupo_idx
  on conecta_planificaciones (grupo_id, ciclo_lectivo, orden);

alter table conecta_planificaciones enable row level security;
