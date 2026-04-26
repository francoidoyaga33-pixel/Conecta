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
  return data ? { ...data, uid: user.id } : null
}

export async function getGrupos() {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_grupos")
    .select("id, nombre, nivel")
    .eq("activo", true)
    .order("nombre")
  return data ?? []
}

export async function getAvisos() {
  const profile = await getMyProfile()
  if (!profile) return []

  const admin = createAdminClient()

  // Traemos todos los avisos relevantes según rol
  let query = admin
    .from("conecta_avisos")
    .select(`
      id, titulo, contenido, categoria, alcance,
      grupo_id, alumno_id, created_at, autor_id,
      conecta_profiles!autor_id(nombre, apellido),
      conecta_grupos(nombre)
    `)
    .order("created_at", { ascending: false })

  // Filtrar según quién es el usuario
  if (profile.role === "estudiante") {
    // Ve avisos de institución, los de su grupo (no implementado aún grupal), o dirigidos a él
    query = query.or(`alcance.eq.institucion,alumno_id.eq.${profile.id}`)
  } else if (profile.role === "tutor_padre") {
    query = query.or(`alcance.eq.institucion,alumno_id.eq.${profile.id}`)
  }
  // admin, docente, financiero ven todos

  const { data } = await query
  return data ?? []
}

export async function getAvisosLeidos() {
  const profile = await getMyProfile()
  if (!profile) return []

  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_avisos_leidos")
    .select("aviso_id")
    .eq("user_id", profile.id)
  return (data ?? []).map((r: any) => r.aviso_id as string)
}

export async function marcarLeido(avisoId: string) {
  const profile = await getMyProfile()
  if (!profile) return { error: "No autorizado" }

  const admin = createAdminClient()
  await admin
    .from("conecta_avisos_leidos")
    .upsert({ user_id: profile.id, aviso_id: avisoId }, { onConflict: "user_id,aviso_id" })

  revalidatePath("/app/avisos")
  return { error: null }
}

export async function crearAviso(payload: {
  titulo: string
  contenido: string
  categoria: "academico" | "administrativo" | "urgente"
  alcance: "institucion" | "grupo" | "alumno"
  grupo_id?: string | null
  alumno_id?: string | null
}) {
  const profile = await getMyProfile()
  if (!profile) return { error: "No autorizado" }
  if (profile.role === "estudiante" || profile.role === "tutor_padre") {
    return { error: "No tenés permisos para crear avisos" }
  }

  const admin = createAdminClient()
  const { error } = await admin.from("conecta_avisos").insert({
    ...payload,
    autor_id: profile.id,
    grupo_id: payload.grupo_id || null,
    alumno_id: payload.alumno_id || null,
  })

  if (error) return { error: error.message }
  revalidatePath("/app/avisos")
  return { error: null }
}

export async function eliminarAviso(id: string) {
  const admin = createAdminClient()
  const { error } = await admin.from("conecta_avisos").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/app/avisos")
  return { error: null }
}

export async function getEstudiantes() {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_profiles")
    .select("id, nombre, apellido")
    .eq("role", "estudiante")
    .eq("activo", true)
    .order("apellido")
  return data ?? []
}
