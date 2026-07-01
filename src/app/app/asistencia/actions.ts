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
  // Obtener todos los perfiles con rol estudiante (simplificado, luego se puede agregar tabla de inscripciones)
  const { data } = await admin
    .from("conecta_profiles")
    .select("id, nombre, apellido, email")
    .eq("role", "estudiante")
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
