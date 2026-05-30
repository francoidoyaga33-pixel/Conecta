"use client"

import { useState, useEffect, useTransition } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { TopBar } from "../../../_components/TopBar"
import {
  ChevronLeft, Loader2, BookOpen, Users, TrendingUp,
  TrendingDown, Clock, ClipboardCheck, Pencil, Save,
  CheckCircle2, X, BarChart2, DollarSign, Plus,
} from "lucide-react"
import { getDocenteDetalle, guardarCargaHoraria, getGruposParaAsignar, asignarGrupoADocente } from "../actions"

interface GrupoMetrica {
  id: string; nombre: string; nivel: string
  habilitados: number; inactivos: number; total: number
  retencion: number | null; asistenciaPromedio: number | null
  horasSemanales: number; cargaId: string | null
}
interface GrupoAsignable {
  id: string; nombre: string; nivel: string
  docente_id: string | null; docenteNombre: string | null
}
interface Pago {
  id: string; periodo: string; horas_contratadas: number; horas_dictadas: number
  valor_hora: number; estado: string; recibo_url: string | null
}
interface Profile {
  id: string; nombre: string; apellido: string; email: string
  avatar_url: string | null; created_at: string
}

const ESTADO_PAGO_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendiente: { label: "Pendiente", color: "text-amber-700", bg: "bg-amber-50" },
  pagado:    { label: "Pagado",    color: "text-emerald-700", bg: "bg-emerald-50" },
  cancelado: { label: "Cancelado", color: "text-gray-500",    bg: "bg-gray-100" },
}

function PctBar({ value, color }: { value: number | null; color: string }) {
  if (value === null) return <span className="text-xs text-[#ccc]">—</span>
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-bold text-[#3D3D3D] w-8 text-right">{value}%</span>
    </div>
  )
}

export default function DocenteDetallePage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<{
    profile: Profile | null
    grupos: GrupoMetrica[]
    pagos: Pago[]
    totalHoras: number
    cicloActual: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  // Modal carga horaria
  const [editGrupo, setEditGrupo] = useState<GrupoMetrica | null>(null)
  const [horasForm, setHorasForm] = useState("")
  const [obsForm, setObsForm] = useState("")
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  // Modal asignar grupos
  const [showAsignar, setShowAsignar] = useState(false)
  const [gruposDisponibles, setGruposDisponibles] = useState<GrupoAsignable[]>([])
  const [loadingGrupos, setLoadingGrupos] = useState(false)

  async function abrirAsignar() {
    setShowAsignar(true)
    setLoadingGrupos(true)
    const data = await getGruposParaAsignar()
    setGruposDisponibles(data as GrupoAsignable[])
    setLoadingGrupos(false)
  }

  async function toggleGrupo(grupo: GrupoAsignable) {
    const esMio = grupo.docente_id === id
    const nuevoDocente = esMio ? null : id
    const result = await asignarGrupoADocente(grupo.id, nuevoDocente)
    if (result.error) { alert("Error: " + result.error); return }
    setGruposDisponibles(prev =>
      prev.map(g => g.id === grupo.id ? { ...g, docente_id: nuevoDocente, docenteNombre: esMio ? null : (data?.profile ? `${data.profile.apellido}, ${data.profile.nombre}` : null) } : g)
    )
    await loadData()
  }

  async function loadData() {
    const result = await getDocenteDetalle(id)
    setData(result as any)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [id])

  function abrirEditHoras(g: GrupoMetrica) {
    setEditGrupo(g)
    setHorasForm(String(g.horasSemanales || ""))
    setObsForm("")
    setSaved(false)
  }

  function handleGuardarHoras() {
    if (!editGrupo) return
    const horas = parseFloat(horasForm)
    if (isNaN(horas) || horas < 0) { alert("Ingresá una cantidad válida de horas"); return }

    startTransition(async () => {
      const result = await guardarCargaHoraria({
        docenteId: id,
        grupoId: editGrupo.id,
        horasSemanales: horas,
        observaciones: obsForm,
        cargaId: editGrupo.cargaId,
      })
      if (result.error) { alert("Error: " + result.error); return }
      setSaved(true)
      await loadData()
      setTimeout(() => { setSaved(false); setEditGrupo(null) }, 1200)
    })
  }

  if (loading) {
    return (
      <>
        <TopBar title="Detalle del docente" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#2B7A9E]" />
        </main>
      </>
    )
  }

  const profile = data?.profile
  const grupos = data?.grupos ?? []
  const pagos = data?.pagos ?? []
  const totalHoras = data?.totalHoras ?? 0

  if (!profile) return null

  // Métricas globales del docente
  const totalAlumnos = grupos.reduce((s, g) => s + g.total, 0)
  const totalHabilitados = grupos.reduce((s, g) => s + g.habilitados, 0)
  const retGlobal = totalAlumnos > 0 ? Math.round((totalHabilitados / totalAlumnos) * 100) : null
  const asistGrupos = grupos.filter(g => g.asistenciaPromedio !== null)
  const asistGlobal = asistGrupos.length > 0
    ? Math.round(asistGrupos.reduce((s, g) => s + (g.asistenciaPromedio ?? 0), 0) / asistGrupos.length)
    : null

  return (
    <>
      <TopBar title="Detalle del docente" subtitle={`${profile.apellido}, ${profile.nombre}`} />

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-5">

        <Link href="/app/admin/docentes" className="flex items-center gap-1.5 text-sm text-[#2B7A9E] font-medium hover:underline">
          <ChevronLeft className="h-4 w-4" /> Volver a docentes
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xl font-black text-[#2B7A9E] shrink-0 overflow-hidden">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              : `${profile.nombre.charAt(0)}${profile.apellido.charAt(0)}`}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black text-[#3D3D3D]">{profile.apellido}, {profile.nombre}</p>
            <p className="text-sm text-[#aaa]">{profile.email}</p>
          </div>
        </div>

        {/* KPIs del docente */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Grupos a cargo",
              value: grupos.length,
              icon: BookOpen,
              color: "text-[#2B7A9E]",
              bg: "bg-[#2B7A9E]/10",
            },
            {
              label: "Total alumnos",
              value: totalAlumnos,
              icon: Users,
              color: "text-emerald-700",
              bg: "bg-emerald-50",
            },
            {
              label: "Hs/semana",
              value: totalHoras > 0 ? `${totalHoras}h` : "—",
              icon: Clock,
              color: "text-violet-700",
              bg: "bg-violet-50",
            },
            {
              label: "Retención global",
              value: retGlobal !== null ? `${retGlobal}%` : "—",
              icon: retGlobal !== null && retGlobal >= 75 ? TrendingUp : TrendingDown,
              color: retGlobal !== null && retGlobal >= 75 ? "text-emerald-700" : "text-red-600",
              bg: retGlobal !== null && retGlobal >= 75 ? "bg-emerald-50" : "bg-red-50",
            },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className={`text-xs font-medium mt-0.5 ${s.color} opacity-80`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabla de grupos con métricas */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-[#2B7A9E]" />
              <h2 className="text-sm font-bold text-[#3D3D3D]">Grupos asignados — Ciclo {data?.cicloActual}</h2>
            </div>
            <button
              onClick={abrirAsignar}
              className="flex items-center gap-1.5 rounded-lg bg-[#2B7A9E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#246a8a] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Asignar grupos
            </button>
          </div>

          {grupos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-8 w-8 text-gray-200 mb-2" />
              <p className="text-sm text-[#aaa]">Sin grupos asignados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Grupo</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Alumnos</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">% Retención</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Asistencia mes</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Hs/sem</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {grupos.map(g => (
                    <tr key={g.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#3D3D3D]">{g.nombre}</p>
                        {g.nivel && <p className="text-xs text-[#aaa]">{g.nivel}</p>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-emerald-700">{g.habilitados}</span>
                        {g.inactivos > 0 && (
                          <span className="text-xs text-red-400 ml-1">-{g.inactivos}</span>
                        )}
                        <span className="text-xs text-[#bbb] ml-1">/ {g.total}</span>
                      </td>
                      <td className="px-4 py-3 min-w-[140px]">
                        <PctBar
                          value={g.retencion}
                          color={g.retencion !== null && g.retencion >= 80
                            ? "bg-emerald-400"
                            : g.retencion !== null && g.retencion >= 60
                            ? "bg-amber-400"
                            : "bg-red-400"}
                        />
                      </td>
                      <td className="px-4 py-3 min-w-[140px]">
                        <PctBar
                          value={g.asistenciaPromedio}
                          color={g.asistenciaPromedio !== null && g.asistenciaPromedio >= 75
                            ? "bg-[#2B7A9E]"
                            : "bg-amber-400"}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {g.horasSemanales > 0
                          ? <span className="text-sm font-bold text-violet-700">{g.horasSemanales}h</span>
                          : <span className="text-xs text-[#ccc]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => abrirEditHoras(g)}
                          className="p-1.5 rounded-lg text-[#aaa] hover:text-[#2B7A9E] hover:bg-[#2B7A9E]/5 transition-colors"
                          title="Editar carga horaria"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {asistGlobal !== null && (
                  <tfoot>
                    <tr className="border-t border-gray-100 bg-gray-50">
                      <td className="px-4 py-3 text-xs font-bold text-[#555]">Total / Promedio</td>
                      <td className="px-4 py-3 text-center text-xs font-bold text-emerald-700">{totalHabilitados} / {totalAlumnos}</td>
                      <td className="px-4 py-3 text-xs font-bold text-[#555]">{retGlobal ?? "—"}%</td>
                      <td className="px-4 py-3 text-xs font-bold text-[#555]">{asistGlobal ?? "—"}%</td>
                      <td className="px-4 py-3 text-center text-xs font-bold text-violet-700">{totalHoras}h</td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>

        {/* Liquidaciones / Pagos */}
        {pagos.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#2B7A9E]" />
              <h2 className="text-sm font-bold text-[#3D3D3D]">Liquidaciones</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Período</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Hs contrat.</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Hs dictadas</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pagos.map((p: any) => {
                  const cfg = ESTADO_PAGO_CONFIG[p.estado] ?? ESTADO_PAGO_CONFIG.pendiente
                  const total = (p.horas_dictadas ?? 0) * (p.valor_hora ?? 0)
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#3D3D3D]">{p.periodo ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-[#555]">{p.horas_contratadas ?? "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={p.horas_dictadas < p.horas_contratadas ? "text-amber-600 font-semibold" : "text-[#555]"}>
                          {p.horas_dictadas ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#3D3D3D]">
                        ${total.toLocaleString("es-AR")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </main>

      {/* Modal asignar grupos */}
      {showAsignar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setShowAsignar(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#3D3D3D]">Asignar grupos</h2>
                <p className="text-xs text-[#aaa] mt-0.5">{profile?.apellido}, {profile?.nombre}</p>
              </div>
              <button onClick={() => setShowAsignar(false)} className="p-1 rounded-lg text-[#aaa] hover:text-[#3D3D3D]">
                <X className="h-4 w-4" />
              </button>
            </div>

            {loadingGrupos ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
              </div>
            ) : gruposDisponibles.length === 0 ? (
              <p className="text-sm text-[#aaa] text-center py-8">No hay grupos activos en el sistema</p>
            ) : (
              <div className="overflow-y-auto space-y-2 pr-1">
                {gruposDisponibles.map(g => {
                  const esMio = g.docente_id === id
                  const deOtro = g.docente_id !== null && !esMio
                  return (
                    <div
                      key={g.id}
                      onClick={() => !deOtro && toggleGrupo(g)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                        esMio
                          ? "border-[#2B7A9E] bg-[#2B7A9E]/5 cursor-pointer"
                          : deOtro
                          ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                          : "border-gray-200 bg-white hover:border-[#2B7A9E]/40 cursor-pointer"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#3D3D3D]">{g.nombre}</p>
                        {g.nivel && <p className="text-xs text-[#aaa]">{g.nivel}</p>}
                        {deOtro && <p className="text-xs text-amber-600 mt-0.5">Asignado a: {g.docenteNombre}</p>}
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        esMio ? "border-[#2B7A9E] bg-[#2B7A9E]" : "border-gray-300"
                      }`}>
                        {esMio && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <p className="text-xs text-[#bbb] mt-4">Los grupos asignados a otro docente no se pueden seleccionar directamente.</p>
          </div>
        </div>
      )}

      {/* Modal carga horaria */}
      {editGrupo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setEditGrupo(null)}>
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#3D3D3D]">Carga horaria</h2>
              <button onClick={() => setEditGrupo(null)} className="p-1 rounded-lg text-[#aaa] hover:text-[#3D3D3D]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#888] mb-4 bg-gray-50 rounded-lg px-3 py-2 font-medium">
              {editGrupo.nombre}{editGrupo.nivel ? ` · ${editGrupo.nivel}` : ""}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">
                  Horas semanales <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min="0" step="0.5"
                    value={horasForm}
                    onChange={e => setHorasForm(e.target.value)}
                    placeholder="0"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
                  />
                  <span className="text-sm text-[#888] font-medium">hs</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Observaciones</label>
                <input
                  value={obsForm} onChange={e => setObsForm(e.target.value)}
                  placeholder="Ej: Incluye tutoría adicional"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {saved
                  ? <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium"><CheckCircle2 className="h-4 w-4" /> Guardado</span>
                  : <span />}
                <div className="flex gap-2">
                  <button onClick={() => setEditGrupo(null)} className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-[#555] hover:bg-gray-50">Cancelar</button>
                  <button onClick={handleGuardarHoras} disabled={isPending}
                    className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] disabled:opacity-70">
                    {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : <><Save className="h-4 w-4" /> Guardar</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
