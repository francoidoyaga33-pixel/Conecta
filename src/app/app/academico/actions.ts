"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const cicloActual = new Date().getFullYear()

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

  if (profile.role === "estudiante") {
    const { data: matriculas } = await admin
      .from("conecta_matriculas")
      .select("grupo_id")
      .eq("alumno_id", profile.id)
      .eq("ciclo_lectivo", cicloActual)

    const grupoIds = Array.from(new Set((matriculas ?? []).map(m => m.grupo_id).filter(Boolean)))
    if (grupoIds.length === 0) return []

    const { data: grupos } = await admin
      .from("conecta_grupos")
      .select("id, nombre, materia, nivel, docente_id")
      .in("id", grupoIds)
      .order("materia")
      .order("nombre")

    return (grupos ?? []).map(g => ({ ...g, docenteNombre: null }))
  }

  if (profile.role !== "admin" && profile.role !== "docente") return []

  let query = admin
    .from("conecta_grupos")
    .select("id, nombre, materia, nivel, docente_id")
    .order("materia")
    .order("nombre")

  if (profile.role === "docente") {
    query = query.eq("docente_id", profile.id)
  }

  const { data: grupos } = await query
  if (!grupos || grupos.length === 0) return []

  const docenteIds = Array.from(new Set(grupos.map(g => g.docente_id).filter(Boolean)))
  let docentes: { id: string; nombre: string; apellido: string }[] = []
  if (docenteIds.length > 0) {
    const { data } = await admin
      .from("conecta_profiles")
      .select("id, nombre, apellido")
      .in("id", docenteIds)
    docentes = data ?? []
  }

  return grupos.map(g => {
    const doc = docentes.find(d => d.id === g.docente_id)
    return {
      ...g,
      docenteNombre: doc ? `${doc.apellido}, ${doc.nombre}` : null,
    }
  })
}

export async function getPlanificaciones(grupoId: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from("conecta_planificaciones")
    .select("*")
    .eq("grupo_id", grupoId)
    .eq("ciclo_lectivo", cicloActual)
    .order("orden")
  return data ?? []
}

async function puedeEditarGrupo(grupoId: string) {
  const profile = await getMyProfile()
  if (!profile) return { ok: false as const, error: "No autorizado" }
  if (profile.role === "admin") return { ok: true as const, profile }
  if (profile.role !== "docente") return { ok: false as const, error: "No autorizado" }

  const admin = createAdminClient()
  const { data: grupo } = await admin
    .from("conecta_grupos")
    .select("docente_id")
    .eq("id", grupoId)
    .single()

  if (!grupo || grupo.docente_id !== profile.id) return { ok: false as const, error: "No autorizado" }
  return { ok: true as const, profile }
}

export async function crearItem(payload: {
  grupoId: string
  unidad: string
  titulo: string
  descripcion: string
  fechaEstimada: string | null
  guiaDocente: string
  guiaEstudiante: string
}) {
  const check = await puedeEditarGrupo(payload.grupoId)
  if (!check.ok) return { error: check.error }

  const admin = createAdminClient()

  const { data: maxOrdenRow } = await admin
    .from("conecta_planificaciones")
    .select("orden")
    .eq("grupo_id", payload.grupoId)
    .eq("ciclo_lectivo", cicloActual)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle()

  const orden = (maxOrdenRow?.orden ?? -1) + 1

  const { error } = await admin.from("conecta_planificaciones").insert({
    grupo_id: payload.grupoId,
    docente_id: check.profile.id,
    ciclo_lectivo: cicloActual,
    orden,
    unidad: payload.unidad || null,
    titulo: payload.titulo,
    descripcion: payload.descripcion || null,
    fecha_estimada: payload.fechaEstimada || null,
    guia_docente: payload.guiaDocente || null,
    guia_estudiante: payload.guiaEstudiante || null,
  })
  if (error) return { error: error.message }

  revalidatePath("/app/academico")
  return { error: null }
}

export async function actualizarItem(id: string, grupoId: string, payload: {
  unidad: string
  titulo: string
  descripcion: string
  fechaEstimada: string | null
  estado: string
  guiaDocente: string
  guiaEstudiante: string
}) {
  const check = await puedeEditarGrupo(grupoId)
  if (!check.ok) return { error: check.error }

  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_planificaciones")
    .update({
      unidad: payload.unidad || null,
      titulo: payload.titulo,
      descripcion: payload.descripcion || null,
      fecha_estimada: payload.fechaEstimada || null,
      estado: payload.estado,
      guia_docente: payload.guiaDocente || null,
      guia_estudiante: payload.guiaEstudiante || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/app/academico")
  return { error: null }
}

export async function eliminarItem(id: string, grupoId: string) {
  const check = await puedeEditarGrupo(grupoId)
  if (!check.ok) return { error: check.error }

  const admin = createAdminClient()
  const { error } = await admin.from("conecta_planificaciones").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/app/academico")
  return { error: null }
}
