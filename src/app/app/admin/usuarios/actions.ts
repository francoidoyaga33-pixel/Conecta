"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getMyRole(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return ""
  const { data } = await supabase
    .from("conecta_profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  return data?.role ?? ""
}

export async function getUsuarios() {
  const myRole = await getMyRole()
  const admin = createAdminClient()

  let query = admin
    .from("conecta_profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (myRole === "financiero") {
    query = query.neq("role", "admin")
  } else if (myRole === "docente") {
    query = query.eq("role", "estudiante")
  }

  const { data, error } = await query
  if (error) return { users: [], error: error.message }
  return { users: data ?? [], error: null }
}

export async function createUsuario(formData: {
  nombre: string
  apellido: string
  email: string
  role: string
  password: string
  loginMethod: "email" | "dni"
  dni?: string
}) {
  const myRole = await getMyRole()
  const canCreateAnyRole = myRole === "admin"
  const canOnlyCreateEstudiante = myRole === "docente" || myRole === "financiero"

  if (canOnlyCreateEstudiante && formData.role !== "estudiante") {
    return { error: "Solo podés crear usuarios con rol de Estudiante." }
  }
  if (!canCreateAnyRole && !canOnlyCreateEstudiante) {
    return { error: "No tenés permisos para crear usuarios." }
  }

  if (formData.loginMethod === "dni" && !formData.dni) {
    return { error: "El DNI es obligatorio para este método de acceso." }
  }

  const admin = createAdminClient()

  // Para cuentas DNI se genera un email interno invisible al usuario
  const email = formData.loginMethod === "dni"
    ? `${formData.dni}@dni.conecta.internal`
    : formData.email

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      nombre: formData.nombre,
      apellido: formData.apellido,
      role: formData.role,
    },
  })

  if (authError) return { error: authError.message }

  const { error: profileError } = await admin
    .from("conecta_profiles")
    .insert({
      id: authData.user.id,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email,
      role: formData.role,
      activo: true,
    })

  if (profileError) return { error: profileError.message }

  // Si es cuenta DNI, guardar el DNI en el legajo para poder hacer login
  if (formData.loginMethod === "dni" && formData.dni) {
    await admin
      .from("conecta_legajos")
      .upsert({ id: authData.user.id, dni: formData.dni, updated_at: new Date().toISOString() })
  }

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

export async function changePassword(userId: string, newPassword: string) {
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.updateUserById(userId, { password: newPassword })
  if (error) return { error: error.message }
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
