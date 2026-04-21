import { TopBar } from "../_components/TopBar"
import { Users, BookOpen, ClipboardList, TrendingUp, Calendar, AlertCircle } from "lucide-react"

// TODO: reemplazar con datos reales de conecta_profiles y demás tablas
const MOCK_STATS = [
  { label: "Estudiantes activos", value: "—", icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Docentes", value: "—", icon: BookOpen, color: "bg-emerald-50 text-emerald-600" },
  { label: "Asistencia hoy", value: "—", icon: ClipboardList, color: "bg-amber-50 text-amber-600" },
  { label: "Pagos pendientes", value: "—", icon: TrendingUp, color: "bg-rose-50 text-rose-600" },
]

const MOCK_UPCOMING = [
  { label: "Reunión de docentes", date: "Pendiente de configurar", icon: Calendar },
  { label: "Entrega de calificaciones", date: "Pendiente de configurar", icon: ClipboardList },
]

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Resumen general del instituto" />

      <main className="flex-1 p-6 space-y-6">
        {/* Setup notice */}
        <div className="flex items-start gap-3 rounded-xl bg-[#2B7A9E]/5 border border-[#2B7A9E]/20 px-4 py-3.5">
          <AlertCircle className="h-4 w-4 text-[#2B7A9E] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#2B7A9E]">Sistema en configuración inicial</p>
            <p className="text-xs text-[#2B7A9E]/70 mt-0.5">
              Las estadísticas se activarán una vez que se complete la configuración de la base de datos.
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_STATS.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-[#3D3D3D]">{stat.value}</p>
              <p className="text-xs text-[#888] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Upcoming */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-[#3D3D3D] mb-4">Próximos eventos</h2>
            <div className="space-y-3">
              {MOCK_UPCOMING.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#2B7A9E]/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-[#2B7A9E]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#3D3D3D]">{item.label}</p>
                    <p className="text-xs text-[#aaa]">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-[#3D3D3D] mb-4">Accesos rápidos</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Gestionar usuarios", href: "/app/admin/usuarios", icon: Users, available: true },
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
