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

  // Registrar en auditoría
  const supabase = await createClient()
  const { data: { user: me } } = await supabase.auth.getUser()
  if (me) {
    const descripcion = formData.loginMethod === "dni"
      ? `Creó al usuario ${formData.nombre} ${formData.apellido} (DNI: ${formData.dni}) — Rol: ${formData.role}`
      : `Creó al usuario ${formData.nombre} ${formData.apellido} (${formData.email}) — Rol: ${formData.role}`
    await admin.from("conecta_audit_log").insert({
      accion: "CREAR_USUARIO",
      descripcion,
      realizado_por: me.id,
    })
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
  const myRole = await getMyRole()
  if (myRole !== "admin") return { error: "Solo los administradores pueden eliminar usuarios." }

  const supabase = await createClient()
  const { data: { user: me } } = await supabase.auth.getUser()

  const admin = createAdminClient()

  // Guardar datos del usuario antes de eliminarlo
  const { data: target } = await admin
    .from("conecta_profiles")
    .select("nombre, apellido, email, role")
    .eq("id", userId)
    .single()

  const { error: profileError } = await admin
    .from("conecta_profiles")
    .delete()
    .eq("id", userId)

  if (profileError) return { error: profileError.message }

  const { error: authError } = await admin.auth.admin.deleteUser(userId)
  if (authError) return { error: authError.message }

  // Registrar en auditoría
  if (me && target) {
    const descripcion = target.email.includes("@dni.conecta")
      ? `Eliminó al usuario ${target.nombre} ${target.apellido} (DNI: ${target.email.split("@")[0]}) — Rol: ${target.role}`
      : `Eliminó al usuario ${target.nombre} ${target.apellido} (${target.email}) — Rol: ${target.role}`
    await admin.from("conecta_audit_log").insert({
      accion: "ELIMINAR_USUARIO",
      descripcion,
      realizado_por: me.id,
    })
  }

  revalidatePath("/app/admin/usuarios")
  return { error: null }
}

export async function getAuditLog() {
  const myRole = await getMyRole()
  if (myRole !== "admin") return []

  const admin = createAdminClient()
  const { data: logs } = await admin
    .from("conecta_audit_log")
    .select("id, accion, descripcion, created_at, realizado_por")
    .order("created_at", { ascending: false })
    .limit(50)

  if (!logs || logs.length === 0) return []

  const autorIds = Array.from(new Set(logs.map(l => l.realizado_por).filter(Boolean)))
  const { data: perfiles } = autorIds.length > 0
    ? await admin.from("conecta_profiles").select("id, nombre, apellido").in("id", autorIds)
    : { data: [] }

  const perfilesMap: Record<string, { nombre: string; apellido: string }> = {}
  ;(perfiles ?? []).forEach((p: any) => { perfilesMap[p.id] = p })

  return logs.map(l => ({
    ...l,
    autor: l.realizado_por ? perfilesMap[l.realizado_por] ?? null : null,
  }))
}
