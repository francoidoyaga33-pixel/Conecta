"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUsuarios() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("conecta_profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return { users: [], error: error.message }
  return { users: data ?? [], error: null }
}

export async function createUsuario(formData: {
  nombre: string
  apellido: string
  email: string
  role: string
  password: string
}) {
  const admin = createAdminClient()

  // Crear usuario en Auth
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      nombre: formData.nombre,
      apellido: formData.apellido,
      role: formData.role,
    },
  })

  if (authError) return { error: authError.message }

  // Insertar perfil
  const { error: profileError } = await admin
    .from("conecta_profiles")
    .insert({
      id: authData.user.id,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      role: formData.role,
      activo: true,
    })

  if (profileError) return { error: profileError.message }

  revalidatePath("/app/admin/usuarios")
  return { error: null }
}

export async function toggleUsuarioActivo(userId: string, activo: boolean) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_profiles")
    .update({ activo })
    .eq("id", userId)

  if (error) return { error: error.message }
  revalidatePath("/app/admin/usuarios")
  return { error: null }
}

export async function deleteUsuario(userId: string) {
  const admin = createAdminClient()

  const { error: profileError } = await admin
    .from("conecta_profiles")
    .delete()
    .eq("id", userId)

  if (profileError) return { error: profileError.message }

  const { error: authError } = await admin.auth.admin.deleteUser(userId)
  if (authError) return { error: authError.message }

  revalidatePath("/app/admin/usuarios")
  return { error: null }
}
