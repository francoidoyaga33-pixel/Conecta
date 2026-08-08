"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function enviarContacto(payload: {
  nombre: string
  apellido: string
  email: string
  telefono: string
  cursos_interes: string
  mensaje: string
}) {
  const nombre = payload.nombre.trim()
  const apellido = payload.apellido.trim()
  const email = payload.email.trim()
  const mensaje = payload.mensaje.trim()

  if (!nombre || !apellido || !email || !mensaje) {
    return { error: "Completá los campos obligatorios." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Ingresá un email válido." }
  }

  const admin = createAdminClient()
  const { error } = await admin.from("conecta_interesados").insert({
    nombre,
    apellido,
    email,
    telefono: payload.telefono.trim(),
    cursos_interes: payload.cursos_interes,
    canal: "web",
    estado_venta: "nuevo",
    seguimiento: "",
    observaciones: mensaje,
    motivo_perdido: "",
  })

  if (error) return { error: "No pudimos enviar tu mensaje. Probá de nuevo en unos minutos." }
  return { error: null }
}
