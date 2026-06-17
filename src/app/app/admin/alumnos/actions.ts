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
    .select("id, role")
    .eq("id", user.id)
    .single()
  return data
}

export async function getAlumnos() {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_profiles")
    .select("id, nombre, apellido, email, activo, created_at, avatar_url")
    .eq("role", "estudiante")
    .order("apellido")
  return data ?? []
}

export async function getAlumnoConLegajo(alumnoId: string) {
  const admin = createAdminClient()

  const [profileRes, legajoRes, matriculasRes] = await Promise.all([
    admin
      .from("conecta_profiles")
      .select("id, nombre, apellido, email, activo, created_at, avatar_url")
      .eq("id", alumnoId)
      .single(),
    admin
      .from("conecta_legajos")
      .select("*")
      .eq("id", alumnoId)
      .maybeSingle(),
    admin
      .from("conecta_matriculas")
      .select("id, estado, ciclo_lectivo, fecha_inicio, fecha_fin, observaciones, conecta_grupos(id, nombre, nivel)")
      .eq("alumno_id", alumnoId)
      .order("ciclo_lectivo", { ascending: false }),
  ])

  return {
    profile: profileRes.data,
    legajo: legajoRes.data,
    matriculas: matriculasRes.data ?? [],
  }
}

export async function guardarLegajo(alumnoId: string, data: {
  fecha_nacimiento: string
  dni: string
  cuil: string
  direccion: string
  localidad: string
  telefono: string
  nombre_padre: string
  telefono_padre: string
  email_padre: string
  nombre_madre: string
  telefono_madre: string
  email_madre: string
  enfermedades: string
  medicacion: string
  autorizados: string
  observaciones: string
}) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_legajos")
    .upsert({ id: alumnoId, ...data, updated_at: new Date().toISOString() })

  if (error) return { error: error.message }
  revalidatePath(`/app/admin/alumnos/${alumnoId}`)
  return { error: null }
}

export async function actualizarAvatarUrl(alumnoId: string, avatarUrl: string) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", alumnoId)
  if (error) return { error: error.message }
  revalidatePath(`/app/admin/alumnos/${alumnoId}`)
  return { error: null }
}

export async function getGrupos() {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_grupos")
    .select("id, nombre, nivel")
    .order("nombre")
  return data ?? []
}

export async function crearMatricula(payload: {
  alumno_id: string
  grupo_id: string
  estado: string
  ciclo_lectivo: number
  fecha_inicio: string
  observaciones: string
}) {
  const admin = createAdminClient()
  const { error } = await admin.from("conecta_matriculas").insert(payload)
  if (error) return { error: error.message }
  revalidatePath(`/app/admin/alumnos/${payload.alumno_id}`)
  revalidatePath("/app/dashboard")
  return { error: null }
}

export async function actualizarEstadoMatricula(matriculaId: string, estado: string, observaciones: string) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_matriculas")
    .update({ estado, observaciones })
    .eq("id", matriculaId)
  if (error) return { error: error.message }
  revalidatePath("/app/admin/alumnos")
  return { error: null }
}

export async function eliminarMatricula(matriculaId: string, alumnoId: string) {
  const admin = createAdminClient()
  const { error } = await admin.from("conecta_matriculas").delete().eq("id", matriculaId)
  if (error) return { error: error.message }
  revalidatePath(`/app/admin/alumnos/${alumnoId}`)
  return { error: null }
}

export async function getMatriculasConEstado() {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_matriculas")
    .select("alumno_id, estado, ciclo_lectivo, conecta_grupos(nombre)")
    .eq("ciclo_lectivo", new Date().getFullYear())
  return data ?? []
}
