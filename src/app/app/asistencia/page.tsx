"use client"

import { useState, useEffect, useTransition } from "react"
import { TopBar } from "../_components/TopBar"
import {
  ClipboardList, ChevronDown, Calendar, CheckCircle2,
  XCircle, Clock, FileCheck, Loader2, Save, BarChart2, ArrowLeft
} from "lucide-react"
import {
  getGrupos, getEstudiantesDeGrupo, getAsistenciaDelDia,
  guardarAsistencia, getReporteMensual, getMyProfile,
  getDocentes, getAsistenciaDocentesDelDia, guardarAsistenciaDocentes, getReporteMensualDocentes,
} from "./actions"

type EstadoAsistencia = "presente" | "ausente" | "tardanza" | "justificado"

interface Grupo { id: string; nombre: string; nivel: string }
interface Estudiante { id: string; nombre: string; apellido: string; email: string }
interface RegistroAsistencia { estudiante_id: string; estado: EstadoAsistencia }
interface Docente { id: string; nombre: string; apellido: string; avatar_url: string | null }
interface RegistroDocente { docente_id: string; estado: EstadoAsistencia; horas_trabajadas: number; observaciones: string }

const ESTADO_CONFIG: Record<EstadoAsistencia, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  presente:    { label: "Presente",    color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200",  icon: CheckCircle2 },
  ausente:     { label: "Ausente",     color: "text-red-700",     bg: "bg-red-50 border-red-200",          icon: XCircle },
  tardanza:    { label: "Tardanza",    color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",      icon: Clock },
  justificado: { label: "Justificado", color: "text-blue-700",    bg: "bg-blue-50 border-blue-200",        icon: FileCheck },
}

const ESTADOS: EstadoAsistencia[] = ["presente", "ausente", "tardanza", "justificado"]

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

export default function AsistenciaPage() {
  const [modo, setModo] = useState<"alumnos" | "docentes">("alumnos")
  const [vista, setVista] = useState<"registro" | "reporte">("registro")
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [grupoId, setGrupoId] = useState("")
  const [fecha, setFecha] = useState(todayISO())
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [registros, setRegistros] = useState<Record<string, EstadoAsistencia>>({})
  const [loading, setLoading] = useState(true)
  const [loadingEst, setLoadingEst] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [myRole, setMyRole] = useState("")

  // Reporte alumnos
  const now = new Date()
  const [reporteAnio, setReporteAnio] = useState(now.getFullYear())
  const [reporteMes, setReporteMes] = useState(now.getMonth() + 1)
  const [reporteData, setReporteData] = useState<any[]>([])
  const [loadingReporte, setLoadingReporte] = useState(false)

  // Docentes
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [fechaDoc, setFechaDoc] = useState(todayISO())
  const [registrosDoc, setRegistrosDoc] = useState<Record<string, RegistroDocente>>({})
  const [loadingDoc, setLoadingDoc] = useState(false)
  const [savedDoc, setSavedDoc] = useState(false)
  const [reporteDocData, setReporteDocData] = useState<any[]>([])
  const [loadingReporteDoc, setLoadingReporteDoc] = useState(false)
  const [reporteDocAnio, setReporteDocAnio] = useState(now.getFullYear())
  const [reporteDocMes, setReporteDocMes] = useState(now.getMonth() + 1)

  useEffect(() => {
    async function init() {
      const [gs, profile] = await Promise.all([getGrupos(), getMyProfile()])
      setGrupos(gs as Grupo[])
      setMyRole(profile?.role ?? "")
      if (gs.length > 0) setGrupoId(gs[0].id)
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (!grupoId) return
    setLoadingEst(true)
    Promise.all([
      getEstudiantesDeGrupo(grupoId),
      getAsistenciaDelDia(grupoId, fecha),
    ]).then(([ests, asist]) => {
      setEstudiantes(ests as Estudiante[])
      const map: Record<string, EstadoAsistencia> = {}
      ;(asist as RegistroAsistencia[]).forEach((r) => { map[r.estudiante_id] = r.estado })
      // Default: presente para los que no tienen registro
      ;(ests as Estudiante[]).forEach((e) => {
        if (!map[e.id]) map[e.id] = "presente"
      })
      setRegistros(map)
      setLoadingEst(false)
    })
  }, [grupoId, fecha])

  useEffect(() => {
    if (vista !== "reporte" || !grupoId) return
    setLoadingReporte(true)
    getReporteMensual(grupoId, reporteAnio, reporteMes).then((data) => {
      setReporteData(data)
      setLoadingReporte(false)
    })
  }, [vista, grupoId, reporteAnio, reporteMes])

  // Cargar docentes cuando se activa el modo docentes
  useEffect(() => {
    if (modo !== "docentes") return
    getDocentes().then((data) => setDocentes(data as Docente[]))
  }, [modo])

  // Cargar asistencia del día para docentes
  useEffect(() => {
    if (modo !== "docentes" || vista !== "registro" || docentes.length === 0) return
    setLoadingDoc(true)
    getAsistenciaDocentesDelDia(fechaDoc).then((asist) => {
      const map: Record<string, RegistroDocente> = {}
      docentes.forEach((d) => {
        const existing = (asist as RegistroDocente[]).find((r) => r.docente_id === d.id)
        map[d.id] = existing ?? { docente_id: d.id, estado: "presente", horas_trabajadas: 0, observaciones: "" }
      })
      setRegistrosDoc(map)
      setLoadingDoc(false)
    })
  }, [modo, vista, fechaDoc, docentes])

  // Reporte mensual docentes
  useEffect(() => {
    if (modo !== "docentes" || vista !== "reporte") return
    setLoadingReporteDoc(true)
    getReporteMensualDocentes(reporteDocAnio, reporteDocMes).then((data) => {
      setReporteDocData(data)
      setLoadingReporteDoc(false)
    })
  }, [modo, vista, reporteDocAnio, reporteDocMes])

  function handleGuardarDocentes() {
    startTransition(async () => {
      const rows = Object.values(registrosDoc)
      await guardarAsistenciaDocentes(fechaDoc, rows)
      setSavedDoc(true)
      setTimeout(() => setSavedDoc(false), 2500)
    })
  }

  function buildReporteDocentes() {
    const byDocente: Record<string, { nombre: string; apellido: string; dias: Record<string, { estado: EstadoAsistencia; horas: number }> }> = {}
    const diasSet = new Set<string>()

    reporteDocData.forEach((r: any) => {
      const id = r.docente_id
      const nombre = r.conecta_profiles?.nombre ?? "?"
      const apellido = r.conecta_profiles?.apellido ?? "?"
      if (!byDocente[id]) byDocente[id] = { nombre, apellido, dias: {} }
      byDocente[id].dias[r.fecha] = { estado: r.estado, horas: r.horas_trabajadas }
      diasSet.add(r.fecha)
    })

    const dias = Array.from(diasSet).sort()
    const docentesList = Object.entries(byDocente).sort((a, b) => a[1].apellido.localeCompare(b[1].apellido))
    return { dias, docentesList }
  }

  function setEstado(alumnoId: string, estado: EstadoAsistencia) {
    setRegistros((prev) => ({ ...prev, [alumnoId]: estado }))
  }

  function handleGuardar() {
    startTransition(async () => {
      const rows = estudiantes.map((e) => ({
        alumno_id: e.id,
        estado: registros[e.id] ?? "presente",
      }))
      const result = await guardarAsistencia(grupoId, fecha, rows)
      if (result.error) { alert("Error: " + result.error); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  // Calcular stats del día
  const stats = ESTADOS.reduce((acc, e) => {
    acc[e] = Object.values(registros).filter((v) => v === e).length
    return acc
  }, {} as Record<EstadoAsistencia, number>)

  // Reporte: construir tabla
  function buildReporteTable() {
    const byAlumno: Record<string, { nombre: string; apellido: string; dias: Record<string, EstadoAsistencia> }> = {}
    const diasSet = new Set<string>()

    reporteData.forEach((r: any) => {
      const alumnoId = r.estudiante_id
      const nombre = r.conecta_profiles?.nombre ?? "?"
      const apellido = r.conecta_profiles?.apellido ?? "?"
      if (!byAlumno[alumnoId]) byAlumno[alumnoId] = { nombre, apellido, dias: {} }
      byAlumno[alumnoId].dias[r.fecha] = r.estado
      diasSet.add(r.fecha)
    })

    const dias = Array.from(diasSet).sort()
    const alumnos = Object.entries(byAlumno).sort((a, b) =>
      a[1].apellido.localeCompare(b[1].apellido)
    )

    return { dias, alumnos }
  }

  const colorCelda: Record<EstadoAsistencia, string> = {
    presente: "bg-emerald-100 text-emerald-800",
    ausente: "bg-red-100 text-red-800",
    tardanza: "bg-amber-100 text-amber-800",
    justificado: "bg-blue-100 text-blue-800",
  }
  const abrev: Record<EstadoAsistencia, string> = {
    presente: "P", ausente: "A", tardanza: "T", justificado: "J",
  }

  if (loading) {
    return (
      <>
        <TopBar title="Asistencia" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#2B7A9E]" />
        </main>
      </>
    )
  }

  return (
    <>
      <TopBar title="Asistencia" subtitle="Registro y seguimiento de asistencia" />

      <main className="flex-1 p-6 space-y-5 max-w-5xl mx-auto w-full">

        {/* Toggle alumnos / docentes — solo admin */}
        {myRole === "admin" && (
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
            {(["alumnos", "docentes"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setModo(m); setVista("registro") }}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                  modo === m ? "bg-white text-[#2B7A9E] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m === "alumnos" ? "Alumnos" : "Docentes"}
              </button>
            ))}
          </div>
        )}

        {/* ── VISTA DOCENTES ── */}
        {modo === "docentes" && (
          <>
            {/* Sub-tabs registro / reporte */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                {(["registro", "reporte"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVista(v)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      vista === v ? "bg-white text-[#2B7A9E] shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {v === "registro" ? "Registro diario" : "Reporte mensual"}
                  </button>
                ))}
              </div>
              {vista === "registro" && (
                <input
                  type="date" value={fechaDoc}
                  onChange={(e) => setFechaDoc(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                />
              )}
            </div>

            {vista === "registro" && (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loadingDoc ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
                  </div>
                ) : docentes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-sm text-[#aaa]">Sin docentes activos</p>
                  </div>
                ) : (
                  <>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Docente</th>
                          <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Estado</th>
                          <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Hs. trabajadas</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden lg:table-cell">Observaciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {docentes.map((d) => {
                          const reg = registrosDoc[d.id] ?? { docente_id: d.id, estado: "presente", horas_trabajadas: 0, observaciones: "" }
                          const estadoCfg = ESTADO_CONFIG[reg.estado]
                          return (
                            <tr key={d.id} className="hover:bg-gray-50/50">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0 overflow-hidden">
                                    {d.avatar_url
                                      ? <img src={d.avatar_url} alt="" className="h-full w-full object-cover" />
                                      : `${d.nombre.charAt(0)}${d.apellido.charAt(0)}`}
                                  </div>
                                  <p className="font-medium text-[#3D3D3D]">{d.apellido}, {d.nombre}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-center gap-1 flex-wrap">
                                  {ESTADOS.map((e) => {
                                    const cfg = ESTADO_CONFIG[e]
                                    const active = reg.estado === e
                                    return (
                                      <button
                                        key={e}
                                        onClick={() => setRegistrosDoc((prev) => ({ ...prev, [d.id]: { ...reg, estado: e } }))}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                                          active ? `${cfg.bg} ${cfg.color} border-current` : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                                        }`}
                                      >
                                        {cfg.label}
                                      </button>
                                    )
                                  })}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-center">
                                  <input
                                    type="number" min="0" max="12" step="0.5"
                                    value={reg.horas_trabajadas}
                                    onChange={(e) => setRegistrosDoc((prev) => ({ ...prev, [d.id]: { ...reg, horas_trabajadas: Number(e.target.value) } }))}
                                    className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-center text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3 hidden lg:table-cell">
                                <input
                                  type="text"
                                  value={reg.observaciones}
                                  onChange={(e) => setRegistrosDoc((prev) => ({ ...prev, [d.id]: { ...reg, observaciones: e.target.value } }))}
                                  placeholder="Opcional..."
                                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                      {savedDoc
                        ? <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium"><CheckCircle2 className="h-4 w-4" /> Guardado</span>
                        : <span />}
                      <button
                        onClick={handleGuardarDocentes}
                        disabled={isPending}
                        className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] disabled:opacity-70"
                      >
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : <><Save className="h-4 w-4" /> Guardar</>}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {vista === "reporte" && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <select value={reporteDocMes} onChange={(e) => setReporteDocMes(Number(e.target.value))}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20">
                    {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                  <input type="number" value={reporteDocAnio} onChange={(e) => setReporteDocAnio(Number(e.target.value))}
                    className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20" />
                </div>
                {loadingReporteDoc ? (
                  <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-gray-100">
                    <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
                  </div>
                ) : reporteDocData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100">
                    <p className="text-sm text-[#aaa]">Sin datos para este mes</p>
                  </div>
                ) : (() => {
                  const { dias, docentesList } = buildReporteDocentes()
                  return (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-auto">
                      <table className="text-xs w-full">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="text-left px-4 py-3 font-semibold text-[#888] uppercase tracking-wider sticky left-0 bg-gray-50">Docente</th>
                            {dias.map((d) => (
                              <th key={d} className="text-center px-2 py-3 font-semibold text-[#888] min-w-[36px]">
                                {new Date(d + "T12:00:00").getDate()}
                              </th>
                            ))}
                            <th className="text-center px-3 py-3 font-semibold text-[#888]">Total hs</th>
                            <th className="text-center px-3 py-3 font-semibold text-[#888]">Presencia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {docentesList.map(([id, info]) => {
                            const totalHs = Object.values(info.dias).reduce((s, d) => s + (d.horas ?? 0), 0)
                            const presentes = Object.values(info.dias).filter((d) => d.estado === "presente" || d.estado === "tardanza").length
                            const pct = dias.length > 0 ? Math.round((presentes / dias.length) * 100) : null
                            return (
                              <tr key={id} className="hover:bg-gray-50/50">
                                <td className="px-4 py-2 font-medium text-[#3D3D3D] sticky left-0 bg-white">
                                  {info.apellido}, {info.nombre}
                                </td>
                                {dias.map((d) => {
                                  const reg = info.dias[d]
                                  if (!reg) return <td key={d} className="text-center px-2 py-2 text-[#ddd]">—</td>
                                  return (
                                    <td key={d} className={`text-center px-2 py-2 font-semibold rounded ${colorCelda[reg.estado]}`}>
                                      {abrev[reg.estado]}
                                    </td>
                                  )
                                })}
                                <td className="text-center px-3 py-2 font-bold text-violet-700">{totalHs}h</td>
                                <td className="text-center px-3 py-2">
                                  <span className={`font-bold ${pct !== null && pct >= 80 ? "text-emerald-700" : pct !== null && pct >= 60 ? "text-amber-700" : "text-red-600"}`}>
                                    {pct !== null ? `${pct}%` : "—"}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                })()}
              </div>
            )}
          </>
        )}

        {/* ── VISTA ALUMNOS ── */}
        {modo === "alumnos" && (
          <>
        {/* Controles superiores */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {/* Selector grupo */}
            <div className="relative">
              <select
                value={grupoId}
                onChange={(e) => setGrupoId(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
              >
                {grupos.length === 0 && <option value="">Sin grupos</option>}
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>{g.nombre} {g.nivel ? `· ${g.nivel}` : ""}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Selector fecha (solo en registro) */}
            {vista === "registro" && (
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
              />
            )}

            {/* Mes/Año para reporte */}
            {vista === "reporte" && (
              <>
                <select
                  value={reporteMes}
                  onChange={(e) => setReporteMes(Number(e.target.value))}
                  className="appearance-none px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                >
                  {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <select
                  value={reporteAnio}
                  onChange={(e) => setReporteAnio(Number(e.target.value))}
                  className="appearance-none px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                >
                  {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </>
            )}
          </div>

          {/* Tabs vista */}
          <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
            <button
              onClick={() => setVista("registro")}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                vista === "registro" ? "bg-[#2B7A9E] text-white" : "text-[#555] hover:bg-gray-50"
              }`}
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Registro
            </button>
            <button
              onClick={() => setVista("reporte")}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                vista === "reporte" ? "bg-[#2B7A9E] text-white" : "text-[#555] hover:bg-gray-50"
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              Reporte
            </button>
          </div>
        </div>

        {/* ── VISTA REGISTRO ── */}
        {vista === "registro" && (
          <>
            {/* Stats rápidas */}
            <div className="grid grid-cols-4 gap-3">
              {ESTADOS.map((e) => {
                const conf = ESTADO_CONFIG[e]
                const Icon = conf.icon
                return (
                  <div key={e} className={`rounded-xl border p-3 flex items-center gap-3 ${conf.bg}`}>
                    <Icon className={`h-5 w-5 ${conf.color}`} />
                    <div>
                      <p className={`text-lg font-black ${conf.color}`}>{stats[e]}</p>
                      <p className={`text-xs font-medium ${conf.color} opacity-80`}>{conf.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Lista estudiantes */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {loadingEst ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
                </div>
              ) : estudiantes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ClipboardList className="h-10 w-10 text-gray-200 mb-3" />
                  <p className="text-sm font-medium text-[#3D3D3D]">No hay estudiantes en este grupo</p>
                  <p className="text-xs text-[#aaa] mt-1">Asigná estudiantes al grupo para registrar asistencia</p>
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#888] uppercase tracking-wider">
                      {estudiantes.length} estudiante{estudiantes.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const all: Record<string, EstadoAsistencia> = {}
                          estudiantes.forEach((e) => { all[e.id] = "presente" })
                          setRegistros(all)
                        }}
                        className="text-xs text-emerald-600 font-medium hover:underline"
                      >
                        Todos presentes
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {estudiantes.map((est) => {
                      const estado = registros[est.id] ?? "presente"
                      return (
                        <div key={est.id} className="flex items-center gap-4 px-4 py-3">
                          <div className="h-8 w-8 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0">
                            {est.nombre.charAt(0)}{est.apellido.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#3D3D3D] truncate">{est.apellido}, {est.nombre}</p>
                          </div>
                          <div className="flex gap-1.5">
                            {ESTADOS.map((e) => {
                              const conf = ESTADO_CONFIG[e]
                              const isSelected = estado === e
                              return (
                                <button
                                  key={e}
                                  onClick={() => setEstado(est.id, e)}
                                  title={conf.label}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                    isSelected
                                      ? `${conf.bg} ${conf.color} border-current`
                                      : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                  }`}
                                >
                                  {conf.label.charAt(0)}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Botón guardar */}
            {estudiantes.length > 0 && (
              <div className="flex items-center justify-between">
                {saved ? (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Asistencia guardada
                  </span>
                ) : <span />}
                <button
                  onClick={handleGuardar}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors disabled:opacity-70"
                >
                  {isPending
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                    : <><Save className="h-4 w-4" /> Guardar asistencia</>}
                </button>
              </div>
            )}
          </>
        )}

          {/* ── VISTA REPORTE ALUMNOS ── */}
          {vista === "reporte" && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {loadingReporte ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
              </div>
            ) : (() => {
              const { dias, alumnos } = buildReporteTable()
              if (alumnos.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <BarChart2 className="h-10 w-10 text-gray-200 mb-3" />
                    <p className="text-sm font-medium text-[#3D3D3D]">Sin registros para este período</p>
                    <p className="text-xs text-[#aaa] mt-1">Registrá asistencia diaria para ver el reporte mensual</p>
                  </div>
                )
              }

              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[160px]">
                          Estudiante
                        </th>
                        {dias.map((d) => (
                          <th key={d} className="px-2 py-3 text-center text-xs font-semibold text-[#888] min-w-[36px]">
                            {new Date(d + "T12:00:00").getDate()}
                          </th>
                        ))}
                        <th className="px-3 py-3 text-center text-xs font-semibold text-[#888] uppercase tracking-wider">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {alumnos.map(([alumnoId, data]) => {
                        const total = dias.length
                        const presentes = dias.filter((d) => data.dias[d] === "presente" || data.dias[d] === "tardanza").length
                        const pct = total > 0 ? Math.round((presentes / total) * 100) : 0
                        return (
                          <tr key={alumnoId} className="hover:bg-gray-50/50">
                            <td className="px-4 py-2.5 font-medium text-[#3D3D3D] sticky left-0 bg-white z-10">
                              {data.apellido}, {data.nombre}
                            </td>
                            {dias.map((d) => {
                              const estado = data.dias[d] as EstadoAsistencia | undefined
                              return (
                                <td key={d} className="px-1 py-2.5 text-center">
                                  {estado ? (
                                    <span className={`inline-block w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center ${colorCelda[estado]}`}>
                                      {abrev[estado]}
                                    </span>
                                  ) : (
                                    <span className="inline-block w-6 h-6 rounded bg-gray-50 text-gray-300 text-[10px] flex items-center justify-center">–</span>
                                  )}
                                </td>
                              )
                            })}
                            <td className="px-3 py-2.5 text-center">
                              <span className={`font-bold ${pct >= 75 ? "text-emerald-700" : "text-red-600"}`}>
                                {pct}%
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  {/* Leyenda */}
                  <div className="px-4 py-3 border-t border-gray-100 flex gap-4 flex-wrap">
                    {ESTADOS.map((e) => (
                      <span key={e} className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${colorCelda[e]}`}>
                        <span className="font-bold">{abrev[e]}</span> {ESTADO_CONFIG[e].label}
                      </span>
                    ))}
                    <span className="text-xs text-[#aaa] ml-auto">% incluye presentes y tardanzas</span>
                  </div>
                </div>
              )
            })()}
          </div>
          )}
          </>
        )}
      </main>
    </>
  )
}
