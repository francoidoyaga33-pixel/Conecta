"use client"

import { useState, useEffect, useTransition } from "react"
import { TopBar } from "../_components/TopBar"
import {
  BookOpen, ChevronDown, Loader2, Plus, Pencil, Trash2,
  ChevronUp, X, Save, CheckCircle2, Circle, PlayCircle, Calendar,
} from "lucide-react"
import {
  getGrupos, getPlanificaciones, crearItem, actualizarItem, eliminarItem, reordenarItem,
} from "./actions"

interface Grupo { id: string; nombre: string; materia: string | null; nivel: string | null; docente_id: string | null; docenteNombre: string | null }
interface Item {
  id: string
  grupo_id: string
  orden: number
  unidad: string | null
  titulo: string
  descripcion: string | null
  fecha_estimada: string | null
  estado: "planificado" | "en_curso" | "completado"
}

function labelGrupo(g: { nombre: string; materia?: string | null; nivel?: string | null }) {
  let label = g.nombre
  if (g.materia && g.materia !== g.nombre) label += ` · ${g.materia}`
  if (g.nivel) label += ` · ${g.nivel}`
  return label
}

const ESTADO_CONFIG: Record<Item["estado"], { label: string; color: string; bg: string; icon: React.ElementType }> = {
  planificado: { label: "Planificado", color: "text-gray-500",    bg: "bg-gray-100 border-gray-200",     icon: Circle },
  en_curso:    { label: "En curso",    color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",    icon: PlayCircle },
  completado:  { label: "Completado",  color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
}
const ESTADOS: Item["estado"][] = ["planificado", "en_curso", "completado"]

const EMPTY_FORM = { unidad: "", titulo: "", descripcion: "", fechaEstimada: "" }

export default function AcademicoPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [grupoId, setGrupoId] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingItems, setLoadingItems] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    getGrupos().then((gs) => {
      setGrupos(gs as Grupo[])
      if (gs.length > 0) setGrupoId(gs[0].id)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!grupoId) { setItems([]); return }
    setLoadingItems(true)
    getPlanificaciones(grupoId).then((data) => {
      setItems(data as Item[])
      setLoadingItems(false)
    })
  }, [grupoId])

  function abrirNuevo() {
    setEditItem(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function abrirEditar(item: Item) {
    setEditItem(item)
    setForm({
      unidad: item.unidad ?? "",
      titulo: item.titulo,
      descripcion: item.descripcion ?? "",
      fechaEstimada: item.fecha_estimada ?? "",
    })
    setShowModal(true)
  }

  function recargarItems() {
    return getPlanificaciones(grupoId).then((data) => setItems(data as Item[]))
  }

  function handleGuardar() {
    if (!form.titulo.trim()) { alert("El título es obligatorio"); return }
    startTransition(async () => {
      const result = editItem
        ? await actualizarItem(editItem.id, grupoId, { ...form, estado: editItem.estado })
        : await crearItem({ grupoId, ...form })
      if (result.error) { alert("Error: " + result.error); return }
      await recargarItems()
      setShowModal(false)
    })
  }

  function handleEliminar(item: Item) {
    if (!confirm(`¿Eliminar "${item.titulo}"?`)) return
    startTransition(async () => {
      const result = await eliminarItem(item.id, grupoId)
      if (result.error) { alert("Error: " + result.error); return }
      await recargarItems()
    })
  }

  function handleEstado(item: Item, estado: Item["estado"]) {
    startTransition(async () => {
      const result = await actualizarItem(item.id, grupoId, {
        unidad: item.unidad ?? "",
        titulo: item.titulo,
        descripcion: item.descripcion ?? "",
        fechaEstimada: item.fecha_estimada,
        estado,
      })
      if (result.error) { alert("Error: " + result.error); return }
      await recargarItems()
    })
  }

  function handleMover(item: Item, direccion: "arriba" | "abajo") {
    startTransition(async () => {
      await reordenarItem(item.id, grupoId, direccion)
      await recargarItems()
    })
  }

  const grupoActual = grupos.find(g => g.id === grupoId)
  const totalCompletados = items.filter(i => i.estado === "completado").length
  const progreso = items.length > 0 ? Math.round((totalCompletados / items.length) * 100) : 0

  if (loading) {
    return (
      <>
        <TopBar title="Académico" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#2B7A9E]" />
        </main>
      </>
    )
  }

  return (
    <>
      <TopBar title="Académico" subtitle="Planificación de contenidos por curso" />

      <main className="flex-1 p-6 space-y-5 max-w-4xl mx-auto w-full">

        {grupos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-10 w-10 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-[#3D3D3D]">Sin cursos asignados</p>
            <p className="text-xs text-[#aaa] mt-1">No tenés grupos a cargo para planificar</p>
          </div>
        ) : (
          <>
            {/* Selector de curso */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="relative">
                <select
                  value={grupoId}
                  onChange={(e) => setGrupoId(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
                >
                  {grupos.map((g) => (
                    <option key={g.id} value={g.id}>
                      {labelGrupo(g)}{g.docenteNombre ? ` — ${g.docenteNombre}` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={abrirNuevo}
                className="flex items-center gap-1.5 rounded-lg bg-[#2B7A9E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#246a8a] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar tema
              </button>
            </div>

            {/* Progreso */}
            {items.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-[#888] uppercase tracking-wider">Progreso del ciclo</p>
                    <p className="text-xs font-bold text-[#3D3D3D]">{totalCompletados} / {items.length} completados</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${progreso}%` }} />
                  </div>
                </div>
                <span className="text-lg font-black text-emerald-700">{progreso}%</span>
              </div>
            )}

            {/* Lista de temas */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {loadingItems ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <BookOpen className="h-10 w-10 text-gray-200 mb-3" />
                  <p className="text-sm font-medium text-[#3D3D3D]">Sin temas planificados</p>
                  <p className="text-xs text-[#aaa] mt-1">Agregá las unidades que vas a dictar en {grupoActual ? labelGrupo(grupoActual) : "este curso"}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {items.map((item, i) => {
                    const cfg = ESTADO_CONFIG[item.estado]
                    return (
                      <div key={item.id} className="flex items-start gap-3 px-4 py-3.5">
                        <div className="flex flex-col items-center gap-0.5 pt-0.5">
                          <button
                            onClick={() => handleMover(item, "arriba")}
                            disabled={i === 0 || isPending}
                            className="text-gray-300 hover:text-[#2B7A9E] disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-xs font-bold text-gray-300 w-5 text-center">{i + 1}</span>
                          <button
                            onClick={() => handleMover(item, "abajo")}
                            disabled={i === items.length - 1 || isPending}
                            className="text-gray-300 hover:text-[#2B7A9E] disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          {item.unidad && (
                            <p className="text-[10px] font-bold text-[#2B7A9E] uppercase tracking-wider mb-0.5">{item.unidad}</p>
                          )}
                          <p className="text-sm font-semibold text-[#3D3D3D]">{item.titulo}</p>
                          {item.descripcion && (
                            <p className="text-xs text-[#888] mt-0.5">{item.descripcion}</p>
                          )}
                          {item.fecha_estimada && (
                            <p className="text-xs text-[#aaa] mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.fecha_estimada + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          )}

                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {ESTADOS.map((e) => {
                              const c = ESTADO_CONFIG[e]
                              const active = item.estado === e
                              return (
                                <button
                                  key={e}
                                  onClick={() => handleEstado(item, e)}
                                  disabled={isPending}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${
                                    active ? `${c.bg} ${c.color} border-current` : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <c.icon className="h-3 w-3" /> {c.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => abrirEditar(item)}
                            className="p-1.5 rounded-lg text-[#aaa] hover:text-[#2B7A9E] hover:bg-[#2B7A9E]/5 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleEliminar(item)}
                            className="p-1.5 rounded-lg text-[#aaa] hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modal agregar/editar tema */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#3D3D3D]">{editItem ? "Editar tema" : "Nuevo tema"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-[#aaa] hover:text-[#3D3D3D]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Unidad (opcional)</label>
                <input
                  value={form.unidad}
                  onChange={(e) => setForm(p => ({ ...p, unidad: e.target.value }))}
                  placeholder="Ej: Unidad 1"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Título <span className="text-red-400">*</span></label>
                <input
                  value={form.titulo}
                  onChange={(e) => setForm(p => ({ ...p, titulo: e.target.value }))}
                  placeholder="Ej: Ecuaciones lineales"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm(p => ({ ...p, descripcion: e.target.value }))}
                  rows={3}
                  placeholder="Objetivos, contenidos, recursos..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Fecha estimada (opcional)</label>
                <input
                  type="date"
                  value={form.fechaEstimada}
                  onChange={(e) => setForm(p => ({ ...p, fechaEstimada: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-[#555] hover:bg-gray-50">Cancelar</button>
                <button
                  onClick={handleGuardar}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#2B7A9E] py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] disabled:opacity-70"
                >
                  {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : <><Save className="h-4 w-4" /> Guardar</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
