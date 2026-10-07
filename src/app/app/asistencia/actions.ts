"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getMyProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from("conecta_profiles")
    .select("id, role, nombre, apellido")
    .eq("id", user.id)
    .single()
  return data
}

export async function getGrupos() {
  const profile = await getMyProfile()
  if (!profile) return []

  const admin = createAdminClient()
  let query = admin
    .from("conecta_grupos")
    .select("id, nombre, materia, nivel, docente_id")
    .order("materia")
    .order("nombre")

  // Docente solo ve sus grupos
  if (profile.role === "docente") {
    query = query.eq("docente_id", profile.id)
  }

  const { data } = await query
  return data ?? []
}

export async function getEstudiantesDeGrupo(grupoId: string) {
  const admin = createAdminClient()

  const { data: matriculas } = await admin
    .from("conecta_matriculas")
    .select("alumno_id")
    .eq("grupo_id", grupoId)
    .or("estado.is.null,estado.neq.inactivo")

  if (!matriculas || matriculas.length === 0) return []

  const alumnoIds = matriculas.map((m) => m.alumno_id).filter(Boolean)
  if (alumnoIds.length === 0) return []

  const { data } = await admin
    .from("conecta_profiles")
    .select("id, nombre, apellido, email")
    .in("id", alumnoIds)
    .eq("activo", true)
    .order("apellido")

  return data ?? []
}

export async function getAsistenciaDelDia(grupoId: string, fecha: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_asistencia")
    .select("estudiante_id, estado")
    .eq("grupo_id", grupoId)
    .eq("fecha", fecha)
  return data ?? []
}

export async function guardarAsistencia(
  grupoId: string,
  fecha: string,
  registros: { alumno_id: string; estado: "presente" | "ausente" | "tardanza" | "justificado" }[]
) {
  const profile = await getMyProfile()
  if (!profile) return { error: "No autorizado" }

  const admin = createAdminClient()

  // Eliminar registros existentes del día para reemplazarlos
  await admin
    .from("conecta_asistencia")
    .delete()
    .eq("grupo_id", grupoId)
    .eq("fecha", fecha)

  if (registros.length === 0) return { error: null }

  const rows = registros.map((r) => ({
    grupo_id: grupoId,
    estudiante_id: r.alumno_id,
    fecha,
    estado: r.estado,
    registrado_por: profile.id,
  }))

  const { error } = await admin.from("conecta_asistencia").insert(rows)
  if (error) return { error: error.message }

  revalidatePath("/app/asistencia")
  return { error: null }
}

export async function getDocentes() {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_profiles")
    .select("id, nombre, apellido, avatar_url")
    .eq("role", "docente")
    .eq("activo", true)
    .order("apellido")
  return data ?? []
}

export async function getAsistenciaDocentesDelDia(fecha: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_asistencia_docentes")
    .select("docente_id, estado, horas_trabajadas, materia, observaciones")
    .eq("fecha", fecha)
  return data ?? []
}

export async function guardarAsistenciaDocentes(
  fecha: string,
  registros: { docente_id: string; estado: string; horas_trabajadas: number; materia: string; observaciones: string }[]
) {
  const admin = createAdminClient()

  for (const r of registros) {
    await admin
      .from("conecta_asistencia_docentes")
      .upsert({ ...r, fecha }, { onConflict: "docente_id,fecha" })
  }

  revalidatePath("/app/asistencia")
  return { error: null }
}

export async function getReporteMensualDocentes(anio: number, mes: number) {
  const admin = createAdminClient()
  const primerDia = `${anio}-${String(mes).padStart(2, "0")}-01`
  const ultimoDia = new Date(anio, mes, 0)
  const ultimoDiaStr = `${anio}-${String(mes).padStart(2, "0")}-${String(ultimoDia.getDate()).padStart(2, "0")}`

  const { data } = await admin
    .from("conecta_asistencia_docentes")
    .select("docente_id, fecha, estado, horas_trabajadas, conecta_profiles!docente_id(nombre, apellido)")
    .gte("fecha", primerDia)
    .lte("fecha", ultimoDiaStr)
    .order("fecha")

  return data ?? []
}

export async function getReporteMensual(grupoId: string, anio: number, mes: number) {
  const admin = createAdminClient()

  // Días del mes
  const primerDia = `${anio}-${String(mes).padStart(2, "0")}-01`
  const ultimoDia = new Date(anio, mes, 0)
  const ultimoDiaStr = `${anio}-${String(mes).padStart(2, "0")}-${String(ultimoDia.getDate()).padStart(2, "0")}`

  const { data } = await admin
    .from("conecta_asistencia")
    .select("estudiante_id, fecha, estado, registrado_por, alumno:conecta_profiles!estudiante_id(nombre, apellido), registrador:conecta_profiles!registrado_por(nombre, apellido)")
    .eq("grupo_id", grupoId)
    .gte("fecha", primerDia)
    .lte("fecha", ultimoDiaStr)
    .order("fecha")

  return data ?? []
}

// ── Seguimiento de faltas ──

const UMBRAL_FALTAS = 3

export interface AlertaSeguimiento {
  seguimiento_id: string | null
  alumno_id: string
  grupo_id: string
  nombre: string
  apellido: string
  grupo: { nombre: string; materia: string | null; nivel: string | null }
  faltas: string[]
  notas: string
  created_at: string | null
}

export interface SeguimientoCerrado {
  id: string
  estado: "resuelto" | "baja"
  notas: string | null
  motivo_baja: string | null
  cerrado_at: string
  alumno: { nombre: string; apellido: string } | null
  grupo: { nombre: string; materia: string | null; nivel: string | null } | null
  cerrador: { nombre: string; apellido: string } | null
}

// Alumnos con UMBRAL_FALTAS o más ausencias desde su último seguimiento cerrado,
// más los que ya tienen un seguimiento abierto.
export async function getSeguimientos(): Promise<{ alertas: AlertaSeguimiento[]; cerrados: SeguimientoCerrado[] }> {
  const vacio = { alertas: [], cerrados: [] }
  const grupos = await getGrupos()
  if (grupos.length === 0) return vacio
  const grupoIds = grupos.map((g) => g.id)
  const grupoById = Object.fromEntries(grupos.map((g) => [g.id, g]))

  const admin = createAdminClient()
  const inicioCiclo = `${new Date().getFullYear()}-01-01`

  const [{ data: ausencias }, { data: seguimientos }, { data: matriculas }] = await Promise.all([
    admin
      .from("conecta_asistencia")
      .select("estudiante_id, grupo_id, fecha")
      .in("grupo_id", grupoIds)
      .eq("estado", "ausente")
      .gte("fecha", inicioCiclo)
      .order("fecha"),
    admin
      .from("conecta_seguimientos")
      .select("id, alumno_id, grupo_id, estado, notas, motivo_baja, cerrado_at, created_at, alumno:conecta_profiles!alumno_id(nombre, apellido), cerrador:conecta_profiles!cerrado_por(nombre, apellido)")
      .in("grupo_id", grupoIds)
      .order("created_at", { ascending: false }),
    admin
      .from("conecta_matriculas")
      .select("alumno_id, grupo_id")
      .in("grupo_id", grupoIds)
      .or("estado.is.null,estado.neq.inactivo"),
  ])

  const key = (alumnoId: string, grupoId: string) => `${alumnoId}|${grupoId}`
  const matriculados = new Set((matriculas ?? []).map((m) => key(m.alumno_id, m.grupo_id)))

  const abiertos: Record<string, any> = {}
  const ultimoCierre: Record<string, string> = {}
  for (const s of seguimientos ?? []) {
    const k = key(s.alumno_id, s.grupo_id)
    if (s.estado === "abierto") abiertos[k] = s
    else if (s.cerrado_at) {
      const dia = s.cerrado_at.slice(0, 10)
      if (!ultimoCierre[k] || dia > ultimoCierre[k]) ultimoCierre[k] = dia
    }
  }

  const faltasPorClave: Record<string, string[]> = {}
  for (const a of ausencias ?? []) {
    const k = key(a.estudiante_id, a.grupo_id)
    if (ultimoCierre[k] && a.fecha <= ultimoCierre[k]) continue
    ;(faltasPorClave[k] ??= []).push(a.fecha)
  }

  const claves = new Set<string>(Object.keys(abiertos))
  for (const [k, faltas] of Object.entries(faltasPorClave)) {
    if (faltas.length >= UMBRAL_FALTAS && matriculados.has(k)) claves.add(k)
  }

  const alumnoIds = Array.from(new Set(Array.from(claves).map((k) => k.split("|")[0])))
  const { data: perfiles } = alumnoIds.length
    ? await admin.from("conecta_profiles").select("id, nombre, apellido").in("id", alumnoIds)
    : { data: [] as { id: string; nombre: string; apellido: string }[] }
  const perfilById = Object.fromEntries((perfiles ?? []).map((p) => [p.id, p]))

  const alertas: AlertaSeguimiento[] = Array.from(claves).map((k) => {
    const [alumnoId, grupoId] = k.split("|")
    const abierto = abiertos[k]
    const perfil = perfilById[alumnoId]
    const g = grupoById[grupoId]
    return {
      seguimiento_id: abierto?.id ?? null,
      alumno_id: alumnoId,
      grupo_id: grupoId,
      nombre: perfil?.nombre ?? "?",
      apellido: perfil?.apellido ?? "?",
      grupo: { nombre: g?.nombre ?? "?", materia: g?.materia ?? null, nivel: g?.nivel ?? null },
      faltas: faltasPorClave[k] ?? [],
      notas: abierto?.notas ?? "",
      created_at: abierto?.created_at ?? null,
    }
  })
  alertas.sort((a, b) => b.faltas.length - a.faltas.length || a.apellido.localeCompare(b.apellido))

  const cerrados: SeguimientoCerrado[] = (seguimientos ?? [])
    .filter((s) => s.estado !== "abierto")
    .slice(0, 30)
    .map((s: any) => ({
      id: s.id,
      estado: s.estado,
      notas: s.notas,
      motivo_baja: s.motivo_baja,
      cerrado_at: s.cerrado_at,
      alumno: s.alumno,
      grupo: grupoById[s.grupo_id] ?? null,
      cerrador: s.cerrador,
    }))

  return { alertas, cerrados }
}

async function puedeVerGrupo(profile: { id: string; role: string }, grupoId: string) {
  if (profile.role === "admin") return true
  const admin = createAdminClient()
  const { data } = await admin.from("conecta_grupos").select("docente_id").eq("id", grupoId).single()
  return data?.docente_id === profile.id
}

export async function guardarSeguimiento(payload: {
  alumno_id: string
  grupo_id: string
  notas: string
  accion: "nota" | "resolver" | "baja"
  motivo_baja?: string
}) {
  const profile = await getMyProfile()
  if (!profile) return { error: "No autorizado" }
  if (!(await puedeVerGrupo(profile, payload.grupo_id))) return { error: "No autorizado" }
  if (payload.accion === "baja") {
    if (profile.role !== "admin") return { error: "Solo un administrador puede dar de baja" }
    if (!payload.motivo_baja?.trim()) return { error: "Indicá el motivo de la baja" }
  }

  const admin = createAdminClient()
  const ahora = new Date().toISOString()

  const { data: abierto } = await admin
    .from("conecta_seguimientos")
    .select("id")
    .eq("alumno_id", payload.alumno_id)
    .eq("grupo_id", payload.grupo_id)
    .eq("estado", "abierto")
    .maybeSingle()

  const cambios: Record<string, unknown> = { notas: payload.notas.trim() || null, updated_at: ahora }
  if (payload.accion !== "nota") {
    cambios.estado = payload.accion === "baja" ? "baja" : "resuelto"
    cambios.cerrado_at = ahora
    cambios.cerrado_por = profile.id
    if (payload.accion === "baja") cambios.motivo_baja = payload.motivo_baja!.trim()
  }

  const { error } = abierto
    ? await admin.from("conecta_seguimientos").update(cambios).eq("id", abierto.id)
    : await admin.from("conecta_seguimientos").insert({
        alumno_id: payload.alumno_id,
        grupo_id: payload.grupo_id,
        creado_por: profile.id,
        ...cambios,
      })
  if (error) return { error: error.message }

  if (payload.accion === "baja") {
    const { error: matError } = await admin
      .from("conecta_matriculas")
      .update({ estado: "inactivo", fecha_fin: ahora.slice(0, 10) })
      .eq("alumno_id", payload.alumno_id)
      .eq("grupo_id", payload.grupo_id)
      .or("estado.is.null,estado.neq.inactivo")
    if (matError) return { error: matError.message }
    revalidatePath("/app/admin/alumnos")
  }

  revalidatePath("/app/asistencia")
  return { error: null }
}
