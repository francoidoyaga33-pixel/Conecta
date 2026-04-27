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
    .select("id, nombre, nivel, docente_id")
    .order("nombre")

  if (profile.role === "docente") {
    query = query.eq("docente_id", profile.id)
  }

  const { data } = await query
  return data ?? []
}

export async function getEntradasBitacora(grupoId: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_bitacora")
    .select("id, fecha, tema, desarrollo, comentarios, material_url, created_at, docente_id")
    .eq("grupo_id", grupoId)
    .order("fecha", { ascending: false })
  return data ?? []
}

export async function getEntradaById(id: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_bitacora")
    .select("*")
    .eq("id", id)
    .single()
  return data
}

export async function crearEntrada(payload: {
  grupo_id: string
  fecha: string
  tema: string
  desarrollo: string
  comentarios: string
  material_url: string
}) {
  const profile = await getMyProfile()
  if (!profile) return { error: "No autorizado", data: null }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("conecta_bitacora")
    .insert({ ...payload, docente_id: profile.id })
    .select()
    .single()

  if (error) return { error: error.message, data: null }
  revalidatePath("/app/bitacora")
  return { error: null, data }
}

export async function actualizarEntrada(id: string, payload: {
  fecha: string
  tema: string
  desarrollo: string
  comentarios: string
  material_url: string
}) {
  const profile = await getMyProfile()
  if (!profile) return { error: "No autorizado" }

  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_bitacora")
    .update(payload)
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/app/bitacora")
  return { error: null }
}

export async function eliminarEntrada(id: string) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_bitacora")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/app/bitacora")
  return { error: null }
}

export async function uploadMaterial(grupoId: string, file: FormData) {
  const profile = await getMyProfile()
  if (!profile) return { error: "No autorizado", url: null }

  const supabase = await createClient()
  const f = file.get("file") as File
  if (!f) return { error: "Sin archivo", url: null }

  const ext = f.name.split(".").pop()
  const path = `bitacora/${grupoId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from("avatars") // reutilizamos el bucket; puedes crear uno "materiales" dedicado
    .upload(path, f, { upsert: false })

  if (error) return { error: error.message, url: null }

  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path)
  return { error: null, url: publicUrl }
}
