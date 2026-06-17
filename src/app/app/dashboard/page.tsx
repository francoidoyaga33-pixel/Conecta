export const dynamic = "force-dynamic"

import { TopBar } from "../_components/TopBar"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  GraduationCap, TrendingDown, BookOpen, ClipboardCheck,
  UserSearch, Users, Calendar, ClipboardList, NotebookPen,
  Bell, FolderOpen, ArrowRight, TrendingUp,
} from "lucide-react"
import Link from "next/link"

function pct(num: number, den: number) {
  if (den === 0) return 0
  return Math.round((num / den) * 100)
}

function mesActual() {
  const d = new Date()
  return { anio: d.getFullYear(), mes: d.getMonth() + 1 }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("conecta_profiles")
    .select("role, nombre")
    .eq("id", user!.id)
    .single()

  const role = profile?.role ?? ""
  const isAdmin = role === "admin"
  const isFinanciero = role === "financiero"
  const isDocente = role === "docente"
  const verDashboardEjecutivo = isAdmin || isFinanciero

  const admin = createAdminClient()
  const cicloActual = new Date().getFullYear()
  const { anio, mes } = mesActual()

  // ── Datos para dashboard ejecutivo ──
  let matriculaTotal = 0
  let nuevosAlumnos = 0
  let tasaDesercion = 0
  let asistenciaPromedio = 0
  let ocupacionGrupos: { nombre: string; nivel: string; inscriptos: number }[] = []
  let pipelineInteresados: { estado: string; count: number }[] = []
  let ultimasMatriculas: { nombre: string; apellido: string; grupo: string; fecha: string; estado: string }[] = []

  if (verDashboardEjecutivo) {
    const [matriculasRes, nuevosRes, asistenciaRes, gruposRes, interesadosRes, ultimasRes] = await Promise.all([
      // Matrículas del ciclo actual
      admin.from("conecta_matriculas").select("estado").eq("ciclo_lectivo", cicloActual),
      // Nuevos alumnos este año
      admin.from("conecta_profiles").select("id").eq("role", "estudiante")
        .gte("created_at", `${cicloActual}-01-01`),
      // Asistencia del mes actual
      admin.from("conecta_asistencia").select("estado")
        .gte("fecha", `${anio}-${String(mes).padStart(2, "0")}-01`),
      // Grupos con inscriptos
      admin.from("conecta_grupos").select(`
        nombre, nivel,
        conecta_matriculas(count)
      `).eq("activo", true).eq("conecta_matriculas.ciclo_lectivo", cicloActual),
      // Pipeline interesados
      admin.from("conecta_interesados").select("estado_venta"),
      // Últimas matrículas
      admin.from("conecta_matriculas")
        .select("alumno_id, grupo_id, estado, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ])

    const matriculas = matriculasRes.data ?? []
    matriculaTotal = matriculas.filter(m => m.estado === "habilitado").length
    const totalInscriptos = matriculas.length
    const desertores = matriculas.filter(m => m.estado === "inactivo").length
    tasaDesercion = pct(desertores, totalInscriptos)

    nuevosAlumnos = nuevosRes.data?.length ?? 0

    const asistencias = asistenciaRes.data ?? []
    const presentes = asistencias.filter(a => a.estado === "presente" || a.estado === "tardanza").length
    asistenciaPromedio = pct(presentes, asistencias.length)

    ocupacionGrupos = ((gruposRes.data ?? []) as any[])
      .map((g: any) => ({
        nombre: g.nombre,
        nivel: g.nivel ?? "",
        inscriptos: g.conecta_matriculas?.[0]?.count ?? 0,
      }))
      .sort((a: any, b: any) => b.inscriptos - a.inscriptos)
      .slice(0, 6)

    const estadoVentas: Record<string, number> = {}
    ;(interesadosRes.data ?? []).forEach((i: any) => {
      estadoVentas[i.estado_venta] = (estadoVentas[i.estado_venta] ?? 0) + 1
    })
    pipelineInteresados = Object.entries(estadoVentas).map(([estado, count]) => ({ estado, count }))

    const ultimasRaw = (ultimasRes.data ?? []) as any[]
    if (ultimasRaw.length > 0) {
      const alumnoIds = ultimasRaw.map((m: any) => m.alumno_id).filter(Boolean)
      const grupoIds = ultimasRaw.map((m: any) => m.grupo_id).filter(Boolean)

      const [perfilesRes, gruposRes2] = await Promise.all([
        alumnoIds.length > 0
          ? admin.from("conecta_profiles").select("id, nombre, apellido").in("id", alumnoIds)
          : Promise.resolve({ data: [] }),
        grupoIds.length > 0
          ? admin.from("conecta_grupos").select("id, nombre").in("id", grupoIds)
          : Promise.resolve({ data: [] }),
      ])

      const perfilesMap: Record<string, { nombre: string; apellido: string }> = {}
      ;(perfilesRes.data ?? []).forEach((p: any) => { perfilesMap[p.id] = p })
      const gruposMap: Record<string, string> = {}
      ;(gruposRes2.data ?? []).forEach((g: any) => { gruposMap[g.id] = g.nombre })

      ultimasMatriculas = ultimasRaw.map((m: any) => ({
        nombre: perfilesMap[m.alumno_id]?.nombre ?? "",
        apellido: perfilesMap[m.alumno_id]?.apellido ?? "",
        grupo: gruposMap[m.grupo_id] ?? "—",
        fecha: m.created_at,
        estado: m.estado,
      }))
    }
  }

  // ── Datos para docente ──
  let misGrupos: { id: string; nombre: string; nivel: string }[] = []
  if (isDocente) {
    const { data } = await admin
      .from("conecta_grupos")
      .select("id, nombre, nivel")
      .eq("docente_id", user!.id)
      .eq("activo", true)
    misGrupos = data ?? []
  }

  const ESTADO_VENTA_LABEL: Record<string, string> = {
    nuevo: "Nuevo", contactado: "Contactado", en_seguimiento: "En seguimiento",
    inscripto: "Inscripto", perdido: "Perdido",
  }
  const ESTADO_VENTA_COLOR: Record<string, string> = {
    nuevo: "bg-blue-50 text-blue-700", contactado: "bg-violet-50 text-violet-700",
    en_seguimiento: "bg-amber-50 text-amber-700", inscripto: "bg-emerald-50 text-emerald-700",
    perdido: "bg-red-50 text-red-600",
  }
  const ESTADO_MAT_COLOR: Record<string, string> = {
    habilitado: "bg-emerald-50 text-emerald-700",
    suspenso: "bg-amber-50 text-amber-700",
    inactivo: "bg-gray-100 text-gray-500",
  }
  const ESTADO_MAT_LABEL: Record<string, string> = {
    habilitado: "Habilitado", suspenso: "Suspenso", inactivo: "Inactivo",
  }

  const maxInscriptos = Math.max(...ocupacionGrupos.map(g => g.inscriptos), 1)

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle={verDashboardEjecutivo ? `Ciclo lectivo ${cicloActual}` : "Resumen general"}
      />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* ── DASHBOARD EJECUTIVO (admin / financiero) ── */}
        {verDashboardEjecutivo && (
          <>
            {/* KPIs principales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Matrícula activa",
                  value: matriculaTotal,
                  sub: `ciclo ${cicloActual}`,
                  icon: GraduationCap,
                  color: "text-[#2B7A9E]",
                  bg: "bg-[#2B7A9E]/10",
                },
                {
                  label: "Nuevos alumnos",
                  value: nuevosAlumnos,
                  sub: `ingresaron en ${cicloActual}`,
                  icon: TrendingUp,
                  color: "text-emerald-700",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Tasa de deserción",
                  value: `${tasaDesercion}%`,
                  sub: "inactivos / total inscriptos",
                  icon: TrendingDown,
                  color: tasaDesercion > 20 ? "text-red-600" : "text-amber-700",
                  bg: tasaDesercion > 20 ? "bg-red-50" : "bg-amber-50",
                },
                {
                  label: "Asistencia promedio",
                  value: asistenciaPromedio > 0 ? `${asistenciaPromedio}%` : "—",
                  sub: "mes actual",
                  icon: ClipboardCheck,
                  color: asistenciaPromedio >= 75 ? "text-emerald-700" : "text-amber-700",
                  bg: asistenciaPromedio >= 75 ? "bg-emerald-50" : "bg-amber-50",
                },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${s.bg}`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-sm font-semibold text-[#3D3D3D] mt-1">{s.label}</p>
                  <p className="text-xs text-[#aaa] mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Segunda fila: Ocupación de cursos + Pipeline interesados */}
            <div className="grid lg:grid-cols-2 gap-4">

              {/* Ocupación por grupo */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#2B7A9E]" />
                    <h2 className="text-sm font-bold text-[#3D3D3D]">Ocupación de cursos</h2>
                  </div>
                  <Link href="/app/admin/alumnos" className="text-xs font-semibold text-[#2B7A9E] hover:underline flex items-center gap-0.5">
                    Ver alumnos <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="p-5 space-y-3">
                  {ocupacionGrupos.length === 0 ? (
                    <p className="text-sm text-[#aaa] text-center py-6">Sin grupos activos</p>
                  ) : ocupacionGrupos.map(g => (
                    <div key={g.nombre}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-[#3D3D3D] truncate max-w-[200px]">
                          {g.nombre}{g.nivel ? <span className="text-[#aaa] font-normal"> · {g.nivel}</span> : null}
                        </p>
                        <p className="text-xs font-bold text-[#2B7A9E]">{g.inscriptos} alumnos</p>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2B7A9E] rounded-full transition-all"
                          style={{ width: `${pct(g.inscriptos, maxInscriptos)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline interesados */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <UserSearch className="h-4 w-4 text-[#2B7A9E]" />
                    <h2 className="text-sm font-bold text-[#3D3D3D]">Pipeline de interesados</h2>
                  </div>
                  <Link href="/app/admin/interesados" className="text-xs font-semibold text-[#2B7A9E] hover:underline flex items-center gap-0.5">
                    Ver todos <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="p-5">
                  {pipelineInteresados.length === 0 ? (
                    <p className="text-sm text-[#aaa] text-center py-6">Sin interesados registrados</p>
                  ) : (
                    <div className="space-y-2.5">
                      {["nuevo", "contactado", "en_seguimiento", "inscripto", "perdido"].map(estado => {
                        const item = pipelineInteresados.find(p => p.estado === estado)
                        const count = item?.count ?? 0
                        const total = pipelineInteresados.reduce((s, p) => s + p.count, 0)
                        return (
                          <div key={estado} className="flex items-center gap-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-28 text-center shrink-0 ${ESTADO_VENTA_COLOR[estado]}`}>
                              {ESTADO_VENTA_LABEL[estado]}
                            </span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  estado === "inscripto" ? "bg-emerald-500" :
                                  estado === "perdido" ? "bg-red-400" :
                                  estado === "en_seguimiento" ? "bg-amber-400" :
                                  estado === "contactado" ? "bg-violet-400" : "bg-blue-400"
                                }`}
                                style={{ width: `${pct(count, total)}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-[#3D3D3D] w-6 text-right shrink-0">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Últimas matrículas */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-[#2B7A9E]" />
                  <h2 className="text-sm font-bold text-[#3D3D3D]">Últimas inscripciones</h2>
                </div>
                <Link href="/app/admin/alumnos" className="text-xs font-semibold text-[#2B7A9E] hover:underline flex items-center gap-0.5">
                  Ver alumnos <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {ultimasMatriculas.length === 0 ? (
                <p className="text-sm text-[#aaa] text-center py-8">Sin inscripciones aún</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-50">
                    {ultimasMatriculas.map((m, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-[10px] font-bold text-[#2B7A9E] shrink-0">
                              {m.nombre.charAt(0)}{m.apellido.charAt(0)}
                            </div>
                            <p className="font-medium text-[#3D3D3D] text-sm">{m.apellido}, {m.nombre}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#555]">{m.grupo}</td>
                        <td className="px-5 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ESTADO_MAT_COLOR[m.estado] ?? "bg-gray-100 text-gray-500"}`}>
                            {ESTADO_MAT_LABEL[m.estado] ?? m.estado}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#bbb] text-right">
                          {new Date(m.fecha).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── ACCESOS RÁPIDOS (todos los roles) ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-[#3D3D3D] mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              { label: "Usuarios",     href: "/app/admin/usuarios",    icon: Users,         roles: ["admin", "docente", "financiero"] },
              { label: "Alumnos",      href: "/app/admin/alumnos",     icon: FolderOpen,    roles: ["admin", "financiero"] },
              { label: "Interesados",  href: "/app/admin/interesados", icon: UserSearch,    roles: ["admin", "financiero"] },
              { label: "Asistencia",   href: "/app/asistencia",        icon: ClipboardList, roles: ["admin", "docente"] },
              { label: "Bitácora",     href: "/app/bitacora",          icon: NotebookPen,   roles: ["admin", "docente"] },
              { label: "Avisos",       href: "/app/avisos",            icon: Bell,          roles: ["admin", "docente", "estudiante", "tutor_padre", "financiero"] },
              { label: "Calendario",   href: "/app/calendario",        icon: Calendar,      roles: ["admin", "docente", "estudiante", "tutor_padre"] },
              { label: "Mi perfil",    href: "/app/perfil",            icon: GraduationCap, roles: ["admin", "docente", "estudiante", "tutor_padre", "financiero"] },
            ]
              .filter(a => a.roles.includes(role))
              .map(action => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium bg-[#F5F7FA] text-[#3D3D3D] hover:bg-[#2B7A9E]/10 hover:text-[#2B7A9E] transition-colors"
                >
                  <action.icon className="h-3.5 w-3.5 shrink-0" />
                  {action.label}
                </Link>
              ))}
          </div>
        </div>

        {/* ── VISTA DOCENTE ── */}
        {isDocente && misGrupos.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#2B7A9E]" />
              <h2 className="text-sm font-bold text-[#3D3D3D]">Mis grupos</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {misGrupos.map(g => (
                <div key={g.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#3D3D3D]">{g.nombre}</p>
                    {g.nivel && <p className="text-xs text-[#aaa]">{g.nivel}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Link href="/app/asistencia" className="text-xs text-[#2B7A9E] font-medium hover:underline">Asistencia</Link>
                    <span className="text-[#ddd]">·</span>
                    <Link href="/app/bitacora" className="text-xs text-[#2B7A9E] font-medium hover:underline">Bitácora</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </>
  )
}
