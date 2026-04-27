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
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_grupos")
    .select("id, nombre, nivel")
    .order("nombre")
  return data ?? []
}

export async function getEventos(anio: number, mes: number) {
  const admin = createAdminClient()
  const primerDia = `${anio}-${String(mes).padStart(2, "0")}-01`
  const ultimoDia = new Date(anio, mes, 0)
  const ultimoDiaStr = `${anio}-${String(mes).padStart(2, "0")}-${String(ultimoDia.getDate()).padStart(2, "0")}`

  const { data } = await admin
    .from("conecta_eventos")
    .select(`
      id, titulo, fecha, hora_inicio, hora_fin,
      tipo, descripcion, grupo_id, alcance, autor_id, created_at,
      conecta_grupos(nombre, nivel),
      conecta_profiles!autor_id(nombre, apellido)
    `)
    .gte("fecha", primerDia)
    .lte("fecha", ultimoDiaStr)
    .order("fecha")
    .order("hora_inicio")

  return data ?? []
}

export async function crearEvento(payload: {
  titulo: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  tipo: string
  descripcion: string
  grupo_id: string | null
  alcance: string
}) {
  const profile = await getMyProfile()
  if (!profile) return { error: "No autorizado" }
  if (profile.role === "estudiante") return { error: "Sin permisos para crear eventos" }

  const admin = createAdminClient()
  const { error } = await admin.from("conecta_eventos").insert({
    ...payload,
    grupo_id: payload.grupo_id || null,
    autor_id: profile.id,
  })

  if (error) return { error: error.message }
  revalidatePath("/app/calendario")
  return { error: null }
}

export async function actualizarEvento(id: string, payload: {
  titulo: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  tipo: string
  descripcion: string
  grupo_id: string | null
  alcance: string
}) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_eventos")
    .update({ ...payload, grupo_id: payload.grupo_id || null })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/app/calendario")
  return { error: null }
}

export async function eliminarEvento(id: string) {
  const admin = createAdminClient()
  const { error } = await admin.from("conecta_eventos").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/app/calendario")
  return { error: null }
}
