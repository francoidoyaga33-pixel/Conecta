"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  Calendar, DollarSign, MessageSquare, BarChart2,
  LogOut, ChevronRight, ChevronLeft, GraduationCap, NotebookPen, Bell,
  FolderOpen, UserSearch, GraduationCap as TeacherIcon,
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
    label: "Alumnos",
    href: "/app/admin/alumnos",
    icon: FolderOpen,
    roles: ["admin", "financiero"],
  },
  {
    label: "Interesados",
    href: "/app/admin/interesados",
    icon: UserSearch,
    roles: ["admin", "financiero"],
  },
  {
    label: "Docentes",
    href: "/app/admin/docentes",
    icon: TeacherIcon,
    roles: ["admin"],
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
    label: "Avisos",
    href: "/app/avisos",
    icon: Bell,
    roles: ["admin", "docente", "estudiante", "tutor_padre", "financiero"],
  },
  {
    label: "Mensajes",
    href: "/app/mensajes",
    icon: MessageSquare,
    roles: ["admin", "docente", "estudiante", "tutor_padre"],
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

const COLLAPSED_KEY = "conecta_sidebar_collapsed"

export function Sidebar({ role, userName, avatarUrl }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(COLLAPSED_KEY) === "1") setCollapsed(true)
  }, [])

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0")
      return next
    })
  }

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
    <aside
      className={`${collapsed ? "w-20" : "w-64"} shrink-0 h-screen sticky top-0 bg-[#1a2332] flex flex-col relative transition-[width] duration-200`}
    >
      <button
        onClick={toggleCollapsed}
        title={collapsed ? "Expandir menú" : "Colapsar menú"}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-[#1a2332] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#223047] transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      <div className={`px-5 py-5 border-b border-white/10 flex ${collapsed ? "justify-center px-0" : ""}`}>
        <ConectaLogo size="sm" iconOnly={collapsed} />
      </div>

      <Link
        href="/app/perfil"
        title={collapsed ? userName : undefined}
        className={`px-5 py-4 border-b border-white/10 flex items-center hover:bg-white/5 transition-colors group ${
          collapsed ? "justify-center px-0" : "gap-3"
        }`}
      >
        <div className="h-9 w-9 rounded-full bg-[#2B7A9E]/30 flex items-center justify-center text-sm font-bold text-[#7EC8E3] shrink-0 overflow-hidden">
          {avatarUrl
            ? <img src={avatarUrl} alt={userName} className="h-full w-full object-cover" />
            : userName.charAt(0).toUpperCase()
          }
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate group-hover:text-[#7EC8E3] transition-colors">{userName}</p>
            <p className="text-xs text-[#7EC8E3]">{roleLabels[role]}</p>
          </div>
        )}
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.soon ? "#" : item.href}
              onClick={item.soon ? (e) => e.preventDefault() : undefined}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-[#2B7A9E] text-white"
                  : item.soon
                  ? "text-white/30 cursor-not-allowed"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.soon && (
                <span className="text-[9px] font-semibold bg-white/10 text-white/40 px-1.5 py-0.5 rounded">
                  Próx.
                </span>
              )}
              {!collapsed && isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          title={collapsed ? "Cerrar sesión" : undefined}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && "Cerrar sesión"}
        </button>
      </div>
    </aside>
  )
}
