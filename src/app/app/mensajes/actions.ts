"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function getConversaciones(userId: string) {
  const admin = createAdminClient()

  const { data: participaciones } = await admin
    .from("conecta_conversacion_participantes")
    .select("conversacion_id")
    .eq("usuario_id", userId)

  if (!participaciones || participaciones.length === 0) return []

  const convIds = participaciones.map((p) => p.conversacion_id)

  const { data: conversaciones } = await admin
    .from("conecta_conversaciones")
    .select("id, updated_at")
    .in("id", convIds)
    .order("updated_at", { ascending: false })

  if (!conversaciones) return []

  const result = await Promise.all(
    conversaciones.map(async (conv) => {
      const { data: participants } = await admin
        .from("conecta_conversacion_participantes")
        .select("usuario_id")
        .eq("conversacion_id", conv.id)
        .neq("usuario_id", userId)

      const otherIds = (participants ?? []).map((p) => p.usuario_id)

      const { data: profiles } = await admin
        .from("conecta_profiles")
        .select("id, nombre, apellido, avatar_url, role")
        .in("id", otherIds.length > 0 ? otherIds : ["none"])

      const { data: ultimoMensaje } = await admin
        .from("conecta_mensajes")
        .select("contenido, created_at, autor_id")
        .eq("conversacion_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      const { data: mensajes } = await admin
        .from("conecta_mensajes")
        .select("leido_por")
        .eq("conversacion_id", conv.id)
        .neq("autor_id", userId)

      const noLeidos = (mensajes ?? []).filter(
        (m) => !(m.leido_por as string[]).includes(userId)
      ).length

      return {
        id: conv.id,
        updatedAt: conv.updated_at,
        otrosParticipantes: profiles ?? [],
        ultimoMensaje: ultimoMensaje ?? null,
        noLeidos,
      }
    })
  )

  return result
}

export async function getMensajes(conversacionId: string) {
  const admin = createAdminClient()

  const { data } = await admin
    .from("conecta_mensajes")
    .select("id, autor_id, contenido, leido_por, created_at")
    .eq("conversacion_id", conversacionId)
    .order("created_at", { ascending: true })

  return data ?? []
}

export async function marcarLeido(conversacionId: string, userId: string) {
  const admin = createAdminClient()

  const { data: mensajes } = await admin
    .from("conecta_mensajes")
    .select("id, leido_por")
    .eq("conversacion_id", conversacionId)
    .neq("autor_id", userId)

  if (!mensajes) return

  for (const m of mensajes) {
    const leidoPor = m.leido_por as string[]
    if (!leidoPor.includes(userId)) {
      await admin
        .from("conecta_mensajes")
        .update({ leido_por: [...leidoPor, userId] })
        .eq("id", m.id)
    }
  }
}

export async function enviarMensaje(
  conversacionId: string,
  autorId: string,
  contenido: string
) {
  const admin = createAdminClient()

  const { error } = await admin.from("conecta_mensajes").insert({
    conversacion_id: conversacionId,
    autor_id: autorId,
    contenido: contenido.trim(),
    leido_por: [autorId],
  })

  if (error) return { error: error.message }

  await admin
    .from("conecta_conversaciones")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversacionId)

  revalidatePath("/app/mensajes")
  return { error: null }
}

export async function getOrCreateConversacion(userId: string, otroId: string) {
  const admin = createAdminClient()

  const { data: misParticipaciones } = await admin
    .from("conecta_conversacion_participantes")
    .select("conversacion_id")
    .eq("usuario_id", userId)

  if (misParticipaciones && misParticipaciones.length > 0) {
    const myConvIds = misParticipaciones.map((p) => p.conversacion_id)

    const { data: otras } = await admin
      .from("conecta_conversacion_participantes")
      .select("conversacion_id")
      .eq("usuario_id", otroId)
      .in("conversacion_id", myConvIds)

    if (otras && otras.length > 0) {
      return { conversacionId: otras[0].conversacion_id }
    }
  }

  const { data: nueva, error } = await admin
    .from("conecta_conversaciones")
    .insert({})
    .select("id")
    .single()

  if (error || !nueva) return { error: error?.message ?? "Error al crear conversación" }

  await admin.from("conecta_conversacion_participantes").insert([
    { conversacion_id: nueva.id, usuario_id: userId },
    { conversacion_id: nueva.id, usuario_id: otroId },
  ])

  revalidatePath("/app/mensajes")
  return { conversacionId: nueva.id }
}

export async function getUsuariosDisponibles(currentUserId: string) {
  const admin = createAdminClient()

  const { data } = await admin
    .from("conecta_profiles")
    .select("id, nombre, apellido, role, avatar_url")
    .neq("id", currentUserId)
    .eq("activo", true)
    .order("apellido")

  return data ?? []
}
