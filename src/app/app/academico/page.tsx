"use client"

import { useState, useEffect, useTransition } from "react"
import { TopBar } from "../_components/TopBar"
import {
  BookOpen, ChevronDown, ChevronRight, Loader2, Plus, Pencil, Trash2,
  X, Save, CheckCircle2, Circle, PlayCircle, Calendar, GraduationCap, UserCheck,
  Bot, Code2, Hammer, Globe2, DollarSign, Calculator, Sparkles,
} from "lucide-react"
import {
  getMyProfile, getGrupos, getPlanificaciones, crearItem, actualizarItem, eliminarItem,
} from "./actions"

type Role = "admin" | "docente" | "estudiante" | "tutor_padre" | "financiero"

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
  guia_docente: string | null
  guia_estudiante: string | null
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

const EMPTY_FORM = { unidad: "", titulo: "", descripcion: "", fechaEstimada: "", guiaDocente: "", guiaEstudiante: "" }

interface MateriaVisual {
  icon: React.ElementType
  gradient: string
  accentText: string
  accentBg: string
  accentBorder: string
  dotBg: string
}

const MATERIA_CONFIG: Record<string, MateriaVisual> = {
  "Robótica":        { icon: Bot,        gradient: "from-orange-500 to-amber-500",  accentText: "text-orange-700",  accentBg: "bg-orange-50",  accentBorder: "border-orange-200",  dotBg: "bg-orange-400" },
  "Programación":    { icon: Code2,      gradient: "from-violet-500 to-purple-600", accentText: "text-violet-700",  accentBg: "bg-violet-50",  accentBorder: "border-violet-200",  dotBg: "bg-violet-400" },
  "Fábrica Digital": { icon: Hammer,     gradient: "from-amber-500 to-yellow-500",  accentText: "text-amber-700",   accentBg: "bg-amber-50",   accentBorder: "border-amber-200",   dotBg: "bg-amber-400" },
  "Inglés":          { icon: Globe2,     gradient: "from-teal-500 to-cyan-500",     accentText: "text-teal-700",    accentBg: "bg-teal-50",    accentBorder: "border-teal-200",    dotBg: "bg-teal-400" },
  "Finanzas":        { icon: DollarSign, gradient: "from-emerald-500 to-green-600", accentText: "text-emerald-700", accentBg: "bg-emerald-50", accentBorder: "border-emerald-200", dotBg: "bg-emerald-400" },
  "Matemáticas":     { icon: Calculator, gradient: "from-red-500 to-rose-500",      accentText: "text-red-700",     accentBg: "bg-red-50",     accentBorder: "border-red-200",     dotBg: "bg-red-400" },
  "Taller IA":       { icon: Sparkles,   gradient: "from-indigo-500 to-blue-600",   accentText: "text-indigo-700",  accentBg: "bg-indigo-50",  accentBorder: "border-indigo-200",  dotBg: "bg-indigo-400" },
}
const DEFAULT_MATERIA_VISUAL: MateriaVisual = {
  icon: BookOpen, gradient: "from-[#2B7A9E] to-[#1f5f7a]", accentText: "text-[#2B7A9E]", accentBg: "bg-[#2B7A9E]/5", accentBorder: "border-[#2B7A9E]/20", dotBg: "bg-[#2B7A9E]",
}

function getMateriaVisual(materia: string | null | undefined): MateriaVisual {
  return (materia && MATERIA_CONFIG[materia]) || DEFAULT_MATERIA_VISUAL
}

// Convierte texto plano (encabezados numerados/con ":", viñetas con "-") en bloques legibles
function GuiaTexto({ text, dotColor }: { text: string; dotColor: string }) {
  const lines = text.split("\n")
  type Block = { type: "header" | "bullets" | "text"; content: string[] }
  const blocks: Block[] = []
  let bullets: string[] = []

  const flushBullets = () => {
    if (bullets.length) { blocks.push({ type: "bullets", content: bullets }); bullets = [] }
  }

  lines.forEach((raw) => {
    const line = raw.trim()
    if (!line) { flushBullets(); return }
    const isBullet = /^[-•]\s/.test(line)
    const isHeader = !isBullet && (/^\d+\.\s/.test(line) || (/:$/.test(line) && line.length < 60))
    if (isBullet) {
      bullets.push(line.replace(/^[-•]\s/, ""))
    } else if (isHeader) {
      flushBullets()
      blocks.push({ type: "header", content: [line] })
    } else {
      flushBullets()
      blocks.push({ type: "text", content: [line] })
    }
  })
  flushBullets()

  return (
    <div className="space-y-2">
      {blocks.map((b, i) => {
        if (b.type === "header") {
          return <p key={i} className="text-xs font-bold text-[#3D3D3D] uppercase tracking-wide mt-3 first:mt-0">{b.content[0]}</p>
        }
        if (b.type === "bullets") {
          return (
            <ul key={i} className="space-y-1.5">
              {b.content.map((c, j) => (
                <li key={j} className="text-sm text-[#555] leading-snug flex gap-2">
                  <span className={`shrink-0 mt-[7px] h-1.5 w-1.5 rounded-full ${dotColor}`} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )
        }
        return <p key={i} className="text-sm text-[#555] leading-relaxed">{b.content[0]}</p>
      })}
    </div>
  )
}

export default function AcademicoPage() {
  const [role, setRole] = useState<Role | null>(null)
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [grupoId, setGrupoId] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingItems, setLoadingItems] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const [detailItem, setDetailItem] = useState<Item | null>(null)

  const puedeEditar = role === "admin" || role === "docente"

  useEffect(() => {
    Promise.all([getMyProfile(), getGrupos()]).then(([profile, gs]) => {
      setRole((profile?.role as Role) ?? null)
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
      guiaDocente: item.guia_docente ?? "",
      guiaEstudiante: item.guia_estudiante ?? "",
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
        guiaDocente: item.guia_docente ?? "",
        guiaEstudiante: item.guia_estudiante ?? "",
      })
      if (result.error) { alert("Error: " + result.error); return }
      await recargarItems()
    })
  }

  const grupoActual = grupos.find(g => g.id === grupoId)
  const materiaVisual = getMateriaVisual(grupoActual?.materia)
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
            <p className="text-xs text-[#aaa] mt-1">
              {role === "estudiante" ? "No estás matriculado en ningún curso todavía" : "No tenés grupos a cargo para planificar"}
            </p>
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

              {puedeEditar && (
                <button
                  onClick={abrirNuevo}
                  className="flex items-center gap-1.5 rounded-lg bg-[#2B7A9E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#246a8a] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Agregar tema
                </button>
              )}
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
                  <p className="text-xs text-[#aaa] mt-1">
                    {puedeEditar
                      ? `Agregá las unidades que vas a dictar en ${grupoActual ? labelGrupo(grupoActual) : "este curso"}`
                      : "Todavía no hay temas cargados para este curso"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {items.map((item, i) => {
                    const cfg = ESTADO_CONFIG[item.estado]
                    return (
                      <div key={item.id} className="flex items-start gap-3 px-4 py-3.5">
                        <span className="text-xs font-bold text-gray-300 w-5 text-center pt-0.5 shrink-0">{i + 1}</span>

                        <div
                          onClick={() => setDetailItem(item)}
                          className="flex-1 min-w-0 text-left group cursor-pointer"
                        >
                          {item.unidad && (
                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${materiaVisual.accentText}`}>{item.unidad}</p>
                          )}
                          <p className="text-sm font-semibold text-[#3D3D3D] transition-colors flex items-center gap-1">
                            <span className="group-hover:opacity-70 transition-opacity">{item.titulo}</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                          </p>
                          {item.descripcion && (
                            <p className="text-xs text-[#888] mt-0.5">{item.descripcion}</p>
                          )}
                          {item.fecha_estimada && (
                            <p className="text-xs text-[#aaa] mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.fecha_estimada + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          )}

                          {puedeEditar ? (
                            <div className="flex gap-1.5 mt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
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
                          ) : (
                            <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.color} border-current`}>
                              <cfg.icon className="h-3 w-3" /> {cfg.label}
                            </span>
                          )}
                        </div>

                        {puedeEditar && (
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
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modal detalle de la clase — contenido según rol */}
      {detailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setDetailItem(null)}>
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[88vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

              {/* Banner temático por materia */}
              <div className={`relative shrink-0 px-6 py-5 bg-gradient-to-br ${materiaVisual.gradient}`}>
                <button
                  onClick={() => setDetailItem(null)}
                  className="absolute top-4 right-4 p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-start gap-3 pr-8">
                  <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <materiaVisual.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    {grupoActual?.materia && (
                      <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{grupoActual.materia}</p>
                    )}
                    {detailItem.unidad && (
                      <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{detailItem.unidad}</p>
                    )}
                    <h2 className="text-lg font-black text-white leading-tight mt-0.5">{detailItem.titulo}</h2>
                  </div>
                </div>
                {detailItem.descripcion && (
                  <p className="text-sm text-white/90 mt-3 leading-relaxed">{detailItem.descripcion}</p>
                )}
              </div>

              <div className="p-6 space-y-5 overflow-y-auto">
                {(role === "admin" || role === "docente") && (
                  <div className={`rounded-xl border overflow-hidden ${materiaVisual.accentBorder}`}>
                    <div className={`px-4 py-2.5 flex items-center gap-1.5 ${materiaVisual.accentBg} ${materiaVisual.accentText} text-xs font-bold uppercase tracking-wide`}>
                      <UserCheck className="h-3.5 w-3.5" /> Cómo desarrollar la clase
                    </div>
                    <div className="p-4">
                      {detailItem.guia_docente
                        ? <GuiaTexto text={detailItem.guia_docente} dotColor={materiaVisual.dotBg} />
                        : <p className="text-sm text-[#aaa] italic">Todavía no se cargó una guía para el docente en este tema.</p>}
                    </div>
                  </div>
                )}

                {(role === "admin" || role === "estudiante") && (
                  <div className="rounded-xl border border-emerald-200 overflow-hidden">
                    <div className="px-4 py-2.5 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wide">
                      <GraduationCap className="h-3.5 w-3.5" /> Cómo recibir la clase
                    </div>
                    <div className="p-4">
                      {detailItem.guia_estudiante
                        ? <GuiaTexto text={detailItem.guia_estudiante} dotColor="bg-emerald-400" />
                        : <p className="text-sm text-[#aaa] italic">Todavía no se cargó una guía para el estudiante en este tema.</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      )}

      {/* Modal agregar/editar tema */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                  rows={2}
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
              <div>
                <label className="block text-xs font-semibold text-[#2B7A9E] mb-1.5">Cómo desarrollar la clase (para el docente)</label>
                <textarea
                  value={form.guiaDocente}
                  onChange={(e) => setForm(p => ({ ...p, guiaDocente: e.target.value }))}
                  rows={3}
                  placeholder="Pasos para dar la clase, materiales a preparar, tiempos..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-700 mb-1.5">Cómo recibir la clase (para el estudiante)</label>
                <textarea
                  value={form.guiaEstudiante}
                  onChange={(e) => setForm(p => ({ ...p, guiaEstudiante: e.target.value }))}
                  rows={3}
                  placeholder="Qué traer, qué se espera que hagan, cómo prepararse..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] resize-none"
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
