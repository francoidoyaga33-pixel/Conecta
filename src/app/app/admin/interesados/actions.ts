"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function getInteresados() {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_interesados")
    .select("*")
    .order("created_at", { ascending: false })
  return data ?? []
}

export async function crearInteresado(payload: {
  nombre: string; apellido: string; email: string; telefono: string
  cursos_interes: string; canal: string; estado_venta: string
  seguimiento: string; observaciones: string; motivo_perdido: string
}) {
  const admin = createAdminClient()
  const { error } = await admin.from("conecta_interesados").insert(payload)
  if (error) return { error: error.message }
  revalidatePath("/app/admin/interesados")
  return { error: null }
}

export async function actualizarInteresado(id: string, payload: {
  nombre: string; apellido: string; email: string; telefono: string
  cursos_interes: string; canal: string; estado_venta: string
  seguimiento: string; observaciones: string; motivo_perdido: string
}) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_interesados")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/app/admin/interesados")
  return { error: null }
}

export async function eliminarInteresado(id: string) {
  const admin = createAdminClient()
  const { error } = await admin.from("conecta_interesados").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/app/admin/interesados")
  return { error: null }
}
