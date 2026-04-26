import { TopBar } from "../_components/TopBar"
import { createClient } from "@/lib/supabase/server"
import { Users, BookOpen, ClipboardList, TrendingUp, Calendar, Shield, GraduationCap, DollarSign } from "lucide-react"
import Link from "next/link"

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  admin:       { label: "Administrador",   color: "bg-violet-100 text-violet-700" },
  docente:     { label: "Docente",         color: "bg-blue-100 text-blue-700" },
  estudiante:  { label: "Estudiante",      color: "bg-emerald-100 text-emerald-700" },
  tutor_padre: { label: "Tutor / Padre",   color: "bg-amber-100 text-amber-700" },
  financiero:  { label: "Área Financiera", color: "bg-rose-100 text-rose-700" },
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("conecta_profiles")
    .select("role")
    .eq("id", user!.id)
    .single()

  const isAdmin = profile?.role === "admin"

  // Fetch stats and users for admin
  let users: { id: string; nombre: string; apellido: string; email: string; role: string; activo: boolean }[] = []
  let stats = { estudiantes: 0, docentes: 0, total: 0 }

  if (isAdmin) {
    const { data } = await supabase
      .from("conecta_profiles")
      .select("id, nombre, apellido, email, role, activo")
      .order("created_at", { ascending: false })

    users = data ?? []
    stats = {
      estudiantes: users.filter(u => u.role === "estudiante").length,
      docentes: users.filter(u => u.role === "docente").length,
      total: users.length,
    }
  }

  return (
    <>
      <TopBar title="Dashboard" subtitle="Resumen general del instituto" />

      <main className="flex-1 p-6 space-y-6">

        {isAdmin && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total usuarios", value: stats.total, icon: Users, color: "bg-blue-50 text-blue-600" },
                { label: "Docentes", value: stats.docentes, icon: BookOpen, color: "bg-emerald-50 text-emerald-600" },
                { label: "Estudiantes", value: stats.estudiantes, icon: GraduationCap, color: "bg-amber-50 text-amber-600" },
                { label: "Pagos pendientes", value: "—", icon: TrendingUp, color: "bg-rose-50 text-rose-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-black text-[#3D3D3D]">{stat.value}</p>
                  <p className="text-xs text-[#888] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Users table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-[#3D3D3D]">Usuarios del sistema</h2>
                <Link
                  href="/app/admin/usuarios"
                  className="text-xs font-semibold text-[#2B7A9E] hover:underline"
                >
                  Gestionar →
                </Link>
              </div>
              {users.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#aaa]">No hay usuarios aún</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Usuario</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Rol</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden md:table-cell">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => {
                      const roleConf = ROLE_CONFIG[u.role] ?? { label: u.role, color: "bg-gray-100 text-gray-600" }
                      return (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0">
                                {u.nombre.charAt(0)}{u.apellido.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-[#3D3D3D]">{u.nombre} {u.apellido}</p>
                                <p className="text-xs text-[#aaa]">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${roleConf.color}`}>
                              {roleConf.label}
                            </span>
                          </td>
                          <td className="px-5 py-3 hidden md:table-cell">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                              u.activo ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"
                            }`}>
                              {u.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Quick actions */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-[#3D3D3D] mb-4">Accesos rápidos</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Gestionar usuarios", href: "/app/admin/usuarios", icon: Users, available: isAdmin },
                { label: "Tomar asistencia", href: "#", icon: ClipboardList, available: false },
                { label: "Ver calendario", href: "/app/calendario", icon: Calendar, available: true },
                { label: "Reportes", href: "#", icon: TrendingUp, available: false },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.available ? action.href : undefined}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                    action.available
                      ? "bg-[#F5F7FA] text-[#3D3D3D] hover:bg-[#2B7A9E]/10 hover:text-[#2B7A9E]"
                      : "bg-gray-50 text-[#bbb] pointer-events-none"
                  }`}
                >
                  <action.icon className="h-3.5 w-3.5 shrink-0" />
                  {action.label}
                  {!action.available && (
                    <span className="ml-auto text-[9px] bg-gray-100 text-gray-400 px-1 rounded">Próx.</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
