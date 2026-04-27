"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TopBar } from "../../_components/TopBar"
import {
  BookOpen, Loader2, ChevronRight, Users,
  Clock, TrendingUp, TrendingDown, Search,
} from "lucide-react"
import { getDocentes } from "./actions"

interface DocenteRow {
  id: string
  nombre: string
  apellido: string
  email: string
  avatar_url: string | null
  cantidadGrupos: number
  totalAlumnos: number
  habilitados: number
  inactivos: number
  tasaRetencion: number | null
  horasSemanales: number
}

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<DocenteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    getDocentes().then(data => {
      setDocentes(data as DocenteRow[])
      setLoading(false)
    })
  }, [])

  const filtered = docentes.filter(d =>
    `${d.nombre} ${d.apellido} ${d.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const totalHoras = docentes.reduce((s, d) => s + d.horasSemanales, 0)
  const totalAlumnos = docentes.reduce((s, d) => s + d.habilitados, 0)

  return (
    <>
      <TopBar title="Gestión de Docentes" subtitle="Carga horaria, grupos y rendimiento" />

      <main className="flex-1 p-6 space-y-5 max-w-5xl mx-auto w-full">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Docentes activos",   value: docentes.length,  color: "text-[#2B7A9E]",  bg: "bg-[#2B7A9E]/10",  icon: BookOpen },
            { label: "Horas semanales",     value: `${totalHoras}h`, color: "text-violet-700", bg: "bg-violet-50",      icon: Clock },
            { label: "Alumnos habilitados", value: totalAlumnos,     color: "text-emerald-700",bg: "bg-emerald-50",     icon: Users },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className={`text-xs font-medium mt-0.5 ${s.color} opacity-80`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text" placeholder="Buscar docente..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
          />
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-[#3D3D3D]">
                {docentes.length === 0 ? "Sin docentes activos" : "Sin resultados"}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Docente</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden md:table-cell">Grupos</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden md:table-cell">Alumnos</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden lg:table-cell">Hs/semana</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Retención</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(d => {
                  const retencion = d.tasaRetencion
                  const buena = retencion !== null && retencion >= 80
                  const regular = retencion !== null && retencion >= 60 && retencion < 80
                  return (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0 overflow-hidden">
                            {d.avatar_url
                              ? <img src={d.avatar_url} alt="" className="h-full w-full object-cover" />
                              : `${d.nombre.charAt(0)}${d.apellido.charAt(0)}`}
                          </div>
                          <div>
                            <p className="font-semibold text-[#3D3D3D]">{d.apellido}, {d.nombre}</p>
                            <p className="text-xs text-[#aaa]">{d.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className="text-sm font-bold text-[#3D3D3D]">{d.cantidadGrupos}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <div>
                          <span className="text-sm font-bold text-emerald-700">{d.habilitados}</span>
                          {d.inactivos > 0 && (
                            <span className="text-xs text-red-400 ml-1">-{d.inactivos}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        {d.horasSemanales > 0
                          ? <span className="text-sm font-bold text-violet-700">{d.horasSemanales}h</span>
                          : <span className="text-xs text-[#ccc]">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {retencion !== null ? (
                          <div className="flex items-center justify-center gap-1">
                            {buena
                              ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                              : regular
                              ? <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                              : <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
                            <span className={`text-sm font-bold ${buena ? "text-emerald-700" : regular ? "text-amber-700" : "text-red-600"}`}>
                              {retencion}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#ccc]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/app/admin/docentes/${d.id}`}
                          className="flex items-center gap-1 text-xs font-medium text-[#2B7A9E] hover:underline"
                        >
                          Ver detalle <ChevronRight className="h-3 w-3" />
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
          <p className="text-xs text-[#aaa]">{filtered.length} docente{filtered.length !== 1 ? "s" : ""}</p>
        )}
      </main>
    </>
  )
}
