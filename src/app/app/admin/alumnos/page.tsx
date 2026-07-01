"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TopBar } from "../../_components/TopBar"
import {
  Search, GraduationCap, Loader2, ChevronRight,
  UserCheck, UserX, AlertCircle, FileText
} from "lucide-react"
import { getAlumnos, getMatriculasConEstado } from "./actions"

interface Alumno {
  id: string
  nombre: string
  apellido: string
  email: string
  activo: boolean
  created_at: string
  avatar_url: string | null
}

interface Matricula {
  alumno_id: string
  estado: string
  ciclo_lectivo: number
  conecta_grupos: { nombre: string; materia: string | null; nivel: string | null } | null
}

function labelGrupo(g: { nombre: string; materia?: string | null; nivel?: string | null } | null) {
  if (!g) return null
  let label = g.nombre
  if (g.materia && g.materia !== g.nombre) label += ` · ${g.materia}`
  if (g.nivel) label += ` · ${g.nivel}`
  return label
}

const ESTADO_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  habilitado: { label: "Habilitado",  color: "text-emerald-700", bg: "bg-emerald-50", icon: UserCheck },
  inactivo:   { label: "Inactivo",    color: "text-gray-500",    bg: "bg-gray-100",   icon: UserX },
  suspenso:   { label: "Suspenso",    color: "text-amber-700",   bg: "bg-amber-50",   icon: AlertCircle },
}

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [filtroCurso, setFiltroCurso] = useState<string>("todos")

  useEffect(() => {
    Promise.all([getAlumnos(), getMatriculasConEstado()]).then(([a, m]) => {
      setAlumnos(a as Alumno[])
      setMatriculas(m as unknown as Matricula[])
      setLoading(false)
    })
  }, [])

  // Enriquecer alumno con su estado de matrícula actual
  function getEstadoAlumno(alumnoId: string) {
    const m = matriculas.find(m => m.alumno_id === alumnoId)
    return m?.estado ?? null
  }

  function getGrupoAlumno(alumnoId: string) {
    const m = matriculas.find(m => m.alumno_id === alumnoId)
    return m ? labelGrupo(m.conecta_grupos) : null
  }

  const cursosUnicos = Array.from(
    new Set(matriculas.map(m => labelGrupo(m.conecta_grupos)).filter(Boolean))
  ).sort() as string[]

  const filtered = alumnos.filter(a => {
    const matchSearch = `${a.nombre} ${a.apellido} ${a.email}`
      .toLowerCase().includes(search.toLowerCase())
    const estado = getEstadoAlumno(a.id)
    const grupo = getGrupoAlumno(a.id)
    const matchEstado =
      filtroEstado === "todos" ? true :
      filtroEstado === "sin_matricula" ? !estado :
      estado === filtroEstado
    const matchCurso =
      filtroCurso === "todos" ? true :
      filtroCurso === "sin_curso" ? !grupo :
      grupo === filtroCurso
    return matchSearch && matchEstado && matchCurso
  })

  const stats = {
    total: alumnos.length,
    habilitados: matriculas.filter(m => m.estado === "habilitado").length,
    suspensos: matriculas.filter(m => m.estado === "suspenso").length,
    sinMatricula: alumnos.filter(a => !matriculas.find(m => m.alumno_id === a.id)).length,
  }

  return (
    <>
      <TopBar title="Gestión de Alumnos" subtitle="Legajos y estados de matrícula" />

      <main className="flex-1 p-6 space-y-5 max-w-5xl mx-auto w-full">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total alumnos",    value: stats.total,         color: "text-[#2B7A9E]",  bg: "bg-[#2B7A9E]/10" },
            { label: "Habilitados",      value: stats.habilitados,   color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "Suspendidos",      value: stats.suspensos,     color: "text-amber-700",   bg: "bg-amber-50" },
            { label: "Sin matrícula",    value: stats.sinMatricula,  color: "text-gray-500",    bg: "bg-gray-100" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 ${s.bg}`}>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className={`text-xs font-medium mt-0.5 ${s.color} opacity-80`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alumno..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
          >
            <option value="todos">Todos los estados</option>
            <option value="habilitado">Habilitado</option>
            <option value="suspenso">Suspenso</option>
            <option value="inactivo">Inactivo</option>
            <option value="sin_matricula">Sin matrícula</option>
          </select>
          <select
            value={filtroCurso}
            onChange={e => setFiltroCurso(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
          >
            <option value="todos">Todos los cursos</option>
            <option value="sin_curso">Sin curso</option>
            {cursosUnicos.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <GraduationCap className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-[#3D3D3D]">Sin resultados</p>
              <p className="text-xs text-[#aaa] mt-1">Probá con otro filtro o búsqueda</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Alumno</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden md:table-cell">Curso actual</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden md:table-cell">Alta</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(alumno => {
                  const estado = getEstadoAlumno(alumno.id)
                  const grupo = getGrupoAlumno(alumno.id)
                  const estadoCfg = estado ? ESTADO_CONFIG[estado] : null

                  return (
                    <tr key={alumno.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0 overflow-hidden">
                            {alumno.avatar_url
                              ? <img src={alumno.avatar_url} alt="" className="h-full w-full object-cover" />
                              : `${alumno.nombre.charAt(0)}${alumno.apellido.charAt(0)}`}
                          </div>
                          <div>
                            <p className="font-medium text-[#3D3D3D]">{alumno.apellido}, {alumno.nombre}</p>
                            {alumno.email.includes("@dni.conecta")
                              ? <p className="text-xs text-[#2B7A9E]">DNI: {alumno.email.split("@")[0]}</p>
                              : <p className="text-xs text-[#aaa]">{alumno.email}</p>
                            }
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#555] hidden md:table-cell">
                        {grupo ?? <span className="text-[#ccc]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {estadoCfg ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${estadoCfg.bg} ${estadoCfg.color}`}>
                            <estadoCfg.icon className="h-3 w-3" />
                            {estadoCfg.label}
                          </span>
                        ) : (
                          <span className="text-xs text-[#ccc]">Sin matrícula</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#aaa] hidden md:table-cell">
                        {new Date(alumno.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/app/admin/alumnos/${alumno.id}`}
                          className="flex items-center gap-1 text-xs font-medium text-[#2B7A9E] hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Legajo
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-[#aaa]">{filtered.length} alumno{filtered.length !== 1 ? "s" : ""}</p>
        )}
      </main>
    </>
  )
}
