"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  Calendar, DollarSign, MessageSquare, BarChart2,
  LogOut, ChevronRight, GraduationCap, NotebookPen,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ConectaLogo } from "../../_components/ConectaLogo"

type Role = "admin" | "docente" | "estudiante" | "tutor_padre" | "financiero"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: Role[]
  soon?: boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "docente", "estudiante", "tutor_padre", "financiero"],
  },
  {
    label: "Usuarios",
    href: "/app/admin/usuarios",
    icon: Users,
    roles: ["admin", "docente", "financiero"],
  },
  {
    label: "Académico",
    href: "/app/academico",
    icon: BookOpen,
    roles: ["admin", "docente"],
    soon: true,
  },
  {
    label: "Asistencia",
    href: "/app/asistencia",
    icon: ClipboardList,
    roles: ["admin", "docente"],
  },
  {
    label: "Bitácora",
    href: "/app/bitacora",
    icon: NotebookPen,
    roles: ["admin", "docente"],
  },
  {
    label: "Calendario",
    href: "/app/calendario",
    icon: Calendar,
    roles: ["admin", "docente", "estudiante", "tutor_padre"],
  },
  {
    label: "Finanzas",
    href: "/app/finanzas",
    icon: DollarSign,
    roles: ["admin", "financiero"],
    soon: true,
  },
  {
    label: "Mensajes",
    href: "/app/mensajes",
    icon: MessageSquare,
    roles: ["admin", "docente", "estudiante", "tutor_padre"],
    soon: true,
  },
  {
    label: "Reportes",
    href: "/app/reportes",
    icon: BarChart2,
    roles: ["admin", "financiero"],
    soon: true,
  },
  {
    label: "Mi aprendizaje",
    href: "/app/aprendizaje",
    icon: GraduationCap,
    roles: ["estudiante"],
    soon: true,
  },
]

interface SidebarProps {
  role: Role
  userName: string
  avatarUrl?: string | null
}

export function Sidebar({ role, userName, avatarUrl }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role))

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const roleLabels: Record<Role, string> = {
    admin: "Administrador",
    docente: "Docente",
    estudiante: "Estudiante",
    tutor_padre: "Tutor / Padre",
    financiero: "Área Financiera",
  }

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[#1a2332] flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <ConectaLogo size="sm" />
      </div>

      <Link href="/app/perfil" className="px-5 py-4 border-b border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors group">
        <div className="h-9 w-9 rounded-full bg-[#2B7A9E]/30 flex items-center justify-center text-sm font-bold text-[#7EC8E3] shrink-0 overflow-hidden">
          {avatarUrl
            ? <img src={avatarUrl} alt={userName} className="h-full w-full object-cover" />
            : userName.charAt(0).toUpperCase()
          }
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate group-hover:text-[#7EC8E3] transition-colors">{userName}</p>
          <p className="text-xs text-[#7EC8E3]">{roleLabels[role]}</p>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.soon ? "#" : item.href}
              onClick={item.soon ? (e) => e.preventDefault() : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                isActive
                  ? "bg-[#2B7A9E] text-white"
                  : item.soon
                  ? "text-white/30 cursor-not-allowed"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.soon && (
                <span className="text-[9px] font-semibold bg-white/10 text-white/40 px-1.5 py-0.5 rounded">
                  Próx.
                </span>
              )}
              {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
