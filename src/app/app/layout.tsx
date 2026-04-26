import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "./_components/Sidebar"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Conecta — Sistema de Gestión",
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("conecta_profiles")
    .select("role, nombre, apellido, password_changed, avatar_url")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/login")

  // Redirigir a cambiar contraseña si es el primer ingreso
  if (!profile.password_changed) {
    redirect("/cambiar-contrasena")
  }

  const role = profile.role as "admin" | "docente" | "estudiante" | "tutor_padre" | "financiero"
  const userName = `${profile.nombre} ${profile.apellido}`
  const avatarUrl = profile.avatar_url ?? null

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      <Sidebar role={role} userName={userName} avatarUrl={avatarUrl} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
