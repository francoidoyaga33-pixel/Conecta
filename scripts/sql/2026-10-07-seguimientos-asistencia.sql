-- Seguimiento de alumnos con faltas reiteradas (alerta a partir de 3 ausencias).
-- Correr manualmente en el SQL Editor de Supabase.

create table if not exists conecta_seguimientos (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references conecta_profiles(id) on delete cascade,
  grupo_id uuid not null references conecta_grupos(id) on delete cascade,
  estado text not null default 'abierto' check (estado in ('abierto', 'resuelto', 'baja')),
  notas text,
  motivo_baja text,
  creado_por uuid references conecta_profiles(id),
  cerrado_por uuid references conecta_profiles(id),
  cerrado_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conecta_seguimientos_baja_motivo check (estado <> 'baja' or coalesce(trim(motivo_baja), '') <> '')
);

create index if not exists conecta_seguimientos_alumno_grupo_idx
  on conecta_seguimientos (alumno_id, grupo_id);

-- Un solo seguimiento abierto por alumno y grupo
create unique index if not exists conecta_seguimientos_abierto_uniq
  on conecta_seguimientos (alumno_id, grupo_id) where estado = 'abierto';

alter table conecta_seguimientos enable row level security;
