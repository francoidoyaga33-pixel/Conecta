"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const cicloActual = new Date().getFullYear()

function mesActual() {
  const d = new Date()
  return {
    desde: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`,
  }
}

export async function getDocentes() {
  const admin = createAdminClient()

  const { data: docentes } = await admin
    .from("conecta_profiles")
    .select("id, nombre, apellido, email, avatar_url, activo")
    .eq("role", "docente")
    .eq("activo", true)
    .order("apellido")

  if (!docentes || docentes.length === 0) return []

  // Grupos por docente
  const { data: grupos } = await admin
    .from("conecta_grupos")
    .select("id, nombre, nivel, docente_id")
    .eq("activo", true)

  // Matrículas del ciclo actual
  const { data: matriculas } = await admin
    .from("conecta_matriculas")
    .select("alumno_id, estado, grupo_id")
    .eq("ciclo_lectivo", cicloActual)

  // Carga horaria
  const { data: cargas } = await admin
    .from("conecta_carga_horaria")
    .select("docente_id, horas_semanales")
    .eq("ciclo_lectivo", cicloActual)

  return docentes.map(d => {
    const misGrupos = (grupos ?? []).filter(g => g.docente_id === d.id)
    const grupoIds = misGrupos.map(g => g.id)
    const misMatriculas = (matriculas ?? []).filter(m => grupoIds.includes(m.grupo_id))
    const habilitados = misMatriculas.filter(m => m.estado === "habilitado").length
    const inactivos = misMatriculas.filter(m => m.estado === "inactivo").length
    const total = misMatriculas.length
    const tasaRetencion = total > 0 ? Math.round((habilitados / total) * 100) : null
    const horasSemanales = (cargas ?? [])
      .filter(c => c.docente_id === d.id)
      .reduce((s, c) => s + Number(c.horas_semanales), 0)

    return {
      ...d,
      cantidadGrupos: misGrupos.length,
      totalAlumnos: total,
      habilitados,
      inactivos,
      tasaRetencion,
      horasSemanales,
    }
  })
}

export async function getDocenteDetalle(docenteId: string) {
  const admin = createAdminClient()
  const { desde } = mesActual()

  const [profileRes, gruposRes, cargaRes, pagosRes] = await Promise.all([
    admin
      .from("conecta_profiles")
      .select("id, nombre, apellido, email, avatar_url, activo, created_at")
      .eq("id", docenteId)
      .single(),
    admin
      .from("conecta_grupos")
      .select("id, nombre, nivel")
      .eq("docente_id", docenteId)
      .order("nombre"),
    admin
      .from("conecta_carga_horaria")
      .select("id, grupo_id, horas_semanales, observaciones")
      .eq("docente_id", docenteId)
      .eq("ciclo_lectivo", cicloActual),
    admin
      .from("conecta_pagos_docentes")
      .select("*")
      .eq("docente_id", docenteId)
      .order("created_at", { ascending: false })
      .limit(6),
  ])

  const grupos = gruposRes.data ?? []
  const grupoIds = grupos.map(g => g.id)

  // Matrículas por grupo
  const { data: matriculas } = await admin
    .from("conecta_matriculas")
    .select("grupo_id, estado")
    .in("grupo_id", grupoIds.length > 0 ? grupoIds : ["none"])
    .eq("ciclo_lectivo", cicloActual)

  // Asistencia del mes actual
  const { data: asistencia } = await admin
    .from("conecta_asistencia")
    .select("grupo_id, estado")
    .in("grupo_id", grupoIds.length > 0 ? grupoIds : ["none"])
    .gte("fecha", desde)

  // Enriquecer grupos con métricas
  const gruposConMetricas = grupos.map(g => {
    const mats = (matriculas ?? []).filter(m => m.grupo_id === g.id)
    const habilitados = mats.filter(m => m.estado === "habilitado").length
    const inactivos = mats.filter(m => m.estado === "inactivo").length
    const total = mats.length
    const retencion = total > 0 ? Math.round((habilitados / total) * 100) : null

    const asistGrupo = (asistencia ?? []).filter(a => a.grupo_id === g.id)
    const presentes = asistGrupo.filter(a => a.estado === "presente" || a.estado === "tardanza").length
    const asistProm = asistGrupo.length > 0 ? Math.round((presentes / asistGrupo.length) * 100) : null

    const carga = (cargaRes.data ?? []).find(c => c.grupo_id === g.id)

    return {
      ...g,
      habilitados,
      inactivos,
      total,
      retencion,
      asistenciaPromedio: asistProm,
      horasSemanales: carga?.horas_semanales ?? 0,
      cargaId: carga?.id ?? null,
    }
  })

  const totalHoras = gruposConMetricas.reduce((s, g) => s + Number(g.horasSemanales), 0)

  return {
    profile: profileRes.data,
    grupos: gruposConMetricas,
    pagos: pagosRes.data ?? [],
    totalHoras,
    cicloActual,
  }
}

export async function getGruposParaAsignar() {
  const admin = createAdminClient()
  const { data: grupos } = await admin
    .from("conecta_grupos")
    .select("id, nombre, materia, nivel, docente_id")
    .order("materia")
    .order("nombre")

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

export async function asignarGrupoADocente(grupoId: string, docenteId: string | null) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("conecta_grupos")
    .update({ docente_id: docenteId })
    .eq("id", grupoId)
  if (error) return { error: error.message }
  revalidatePath("/app/admin/docentes")
  return { error: null }
}

export async function guardarCargaHoraria(payload: {
  docenteId: string
  grupoId: string
  horasSemanales: number
  observaciones: string
  cargaId: string | null
}) {
  const admin = createAdminClient()

  if (payload.cargaId) {
    const { error } = await admin
      .from("conecta_carga_horaria")
      .update({ horas_semanales: payload.horasSemanales, observaciones: payload.observaciones })
      .eq("id", payload.cargaId)
    if (error) return { error: error.message }
  } else {
    const { error } = await admin
      .from("conecta_carga_horaria")
      .upsert({
        docente_id: payload.docenteId,
        grupo_id: payload.grupoId,
        horas_semanales: payload.horasSemanales,
        observaciones: payload.observaciones,
        ciclo_lectivo: cicloActual,
      }, { onConflict: "docente_id,grupo_id,ciclo_lectivo" })
    if (error) return { error: error.message }
  }

  revalidatePath(`/app/admin/docentes/${payload.docenteId}`)
  return { error: null }
}
