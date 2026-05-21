"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, X, Loader2, Save, Trash2, CheckCircle2 } from "lucide-react"
import { getHorario, crearHorario, actualizarHorario, eliminarHorario, getGrupos } from "./actions"

interface HorarioBloque {
  id: string
  grupo_id: string | null
  docente_id: string | null
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  materia: string
  aula: string | null
  color: string
  conecta_grupos: { nombre: string; nivel: string } | null
  conecta_profiles: { nombre: string; apellido: string } | null
}

interface Grupo { id: string; nombre: string; nivel: string }

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const HORAS = Array.from({ length: 16 }, (_, i) => i + 7) // 7 a 22
const PX_POR_HORA = 64
const START_HOUR = 7

const COLORES = [
  "#2B7A9E", "#7C3AED", "#059669", "#D97706",
  "#DC2626", "#0891B2", "#9333EA", "#4338CA",
]

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + (m || 0)
}

function blockStyle(hora_inicio: string, hora_fin: string) {
  const startMin = timeToMinutes(hora_inicio)
  const endMin = timeToMinutes(hora_fin)
  const top = ((startMin - START_HOUR * 60) / 60) * PX_POR_HORA
  const height = Math.max(((endMin - startMin) / 60) * PX_POR_HORA - 2, 22)
  return { top, height }
}

const EMPTY_FORM = {
  dia_semana: 1,
  hora_inicio: "08:00",
  hora_fin: "09:00",
  materia: "",
  grupo_id: "",
  aula: "",
  color: "#2B7A9E",
}

export function HorarioView({ role }: { role: string }) {
  const [bloques, setBloques] = useState<HorarioBloque[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [filtroGrupo, setFiltroGrupo] = useState("todos")

  const canEdit = role === "admin" || role === "docente"

  async function loadData() {
    const [h, g] = await Promise.all([getHorario(), getGrupos()])
    setBloques(h as unknown as HorarioBloque[])
    setGrupos(g as Grupo[])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  function abrirNuevo(dia?: number, hora?: number) {
    setEditingId(null)
    setForm({
      ...EMPTY_FORM,
      dia_semana: dia ?? 1,
      hora_inicio: `${String(hora ?? 8).padStart(2, "0")}:00`,
      hora_fin: `${String((hora ?? 8) + 1).padStart(2, "0")}:00`,
      grupo_id: grupos[0]?.id ?? "",
    })
    setSaved(false)
    setShowModal(true)
  }

  function abrirEditar(b: HorarioBloque) {
    setEditingId(b.id)
    setForm({
      dia_semana: b.dia_semana,
      hora_inicio: b.hora_inicio.slice(0, 5),
      hora_fin: b.hora_fin.slice(0, 5),
      materia: b.materia,
      grupo_id: b.grupo_id ?? "",
      aula: b.aula ?? "",
      color: b.color,
    })
    setSaved(false)
    setShowModal(true)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleGuardar() {
    if (!form.materia.trim()) { alert("La materia es obligatoria"); return }
    startTransition(async () => {
      const payload = {
        ...form,
        dia_semana: Number(form.dia_semana),
        grupo_id: form.grupo_id || null,
        aula: form.aula || null,
      }
      const result = editingId
        ? await actualizarHorario(editingId, payload)
        : await crearHorario(payload)
      if (result.error) { alert("Error: " + result.error); return }
      setSaved(true)
      await loadData()
      setTimeout(() => { setSaved(false); setShowModal(false) }, 1000)
    })
  }

  function handleEliminar() {
    if (!editingId || !confirm("¿Eliminar esta clase?")) return
    startTransition(async () => {
      await eliminarHorario(editingId)
      setShowModal(false)
      await loadData()
    })
  }

  const bloquesFiltered = filtroGrupo === "todos"
    ? bloques
    : bloques.filter(b => b.grupo_id === filtroGrupo)

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-[#2B7A9E]" />
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <select
          value={filtroGrupo}
          onChange={e => setFiltroGrupo(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
        >
          <option value="todos">Todos los grupos</option>
          {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
        </select>
        {canEdit && (
          <button
            onClick={() => abrirNuevo()}
            className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors"
          >
            <Plus className="h-4 w-4" /> Nueva clase
          </button>
        )}
      </div>

      {/* Grilla */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-auto">
        <div className="min-w-[640px]">
          {/* Header días */}
          <div
            className="grid sticky top-0 z-20 bg-white border-b border-gray-100"
            style={{ gridTemplateColumns: "56px repeat(6, 1fr)" }}
          >
            <div className="h-10 border-r border-gray-100" />
            {DIAS.map(d => (
              <div key={d} className="h-10 flex items-center justify-center text-xs font-bold text-[#555] border-r border-gray-100 last:border-r-0">
                {d}
              </div>
            ))}
          </div>

          {/* Cuerpo */}
          <div className="flex">
            {/* Columna horas */}
            <div className="w-14 shrink-0 border-r border-gray-100">
              {HORAS.map(h => (
                <div
                  key={h}
                  className="border-b border-gray-50 flex items-start justify-end pr-2 pt-1"
                  style={{ height: PX_POR_HORA }}
                >
                  <span className="text-[10px] text-gray-400 font-medium">{h}:00</span>
                </div>
              ))}
            </div>

            {/* Columnas por día */}
            {DIAS.map((dia, diaIdx) => {
              const diaBloques = bloquesFiltered.filter(b => b.dia_semana === diaIdx + 1)
              return (
                <div
                  key={dia}
                  className="flex-1 border-r border-gray-100 last:border-r-0 relative"
                  style={{ height: HORAS.length * PX_POR_HORA }}
                >
                  {/* Líneas de hora (clickeables para crear) */}
                  {HORAS.map(h => (
                    <div
                      key={h}
                      className="absolute w-full border-b border-gray-50 transition-colors hover:bg-[#2B7A9E]/5"
                      style={{ top: (h - START_HOUR) * PX_POR_HORA, height: PX_POR_HORA, cursor: canEdit ? "pointer" : "default" }}
                      onClick={() => canEdit && abrirNuevo(diaIdx + 1, h)}
                    />
                  ))}

                  {/* Bloques de clases */}
                  {diaBloques.map(b => {
                    const { top, height } = blockStyle(b.hora_inicio, b.hora_fin)
                    return (
                      <div
                        key={b.id}
                        onClick={e => { e.stopPropagation(); if (canEdit) abrirEditar(b) }}
                        className="absolute left-0.5 right-0.5 rounded-lg px-2 py-1 z-10 shadow-sm overflow-hidden"
                        style={{
                          top,
                          height,
                          backgroundColor: b.color + "22",
                          borderLeft: `3px solid ${b.color}`,
                          cursor: canEdit ? "pointer" : "default",
                        }}
                      >
                        <p
                          className="text-[11px] font-bold truncate leading-tight"
                          style={{ color: b.color }}
                        >
                          {b.materia}
                        </p>
                        {height > 38 && (
                          <>
                            {b.conecta_grupos && (
                              <p className="text-[10px] text-gray-500 truncate">{b.conecta_grupos.nombre}</p>
                            )}
                            {b.aula && (
                              <p className="text-[10px] text-gray-400 truncate">Aula {b.aula}</p>
                            )}
                            <p className="text-[9px] text-gray-400 mt-0.5">
                              {b.hora_inicio.slice(0, 5)} – {b.hora_fin.slice(0, 5)}
                            </p>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {bloques.length === 0 && !loading && (
        <p className="text-center text-sm text-gray-400 py-4">
          No hay clases cargadas.{canEdit ? " Hacé click en una celda para agregar." : ""}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#3D3D3D]">
                {editingId ? "Editar clase" : "Nueva clase"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Materia *</label>
                <input
                  name="materia" value={form.materia} onChange={handleChange}
                  placeholder="Ej: Matemáticas, Lengua, Programación"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Día</label>
                  <select
                    name="dia_semana" value={form.dia_semana} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                  >
                    {DIAS.map((d, i) => <option key={i} value={i + 1}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Grupo</label>
                  <select
                    name="grupo_id" value={form.grupo_id} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                  >
                    <option value="">Sin grupo</option>
                    {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Hora inicio</label>
                  <input
                    type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange}
                    min="07:00" max="22:00"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Hora fin</label>
                  <input
                    type="time" name="hora_fin" value={form.hora_fin} onChange={handleChange}
                    min="07:00" max="22:00"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Aula</label>
                <input
                  name="aula" value={form.aula} onChange={handleChange}
                  placeholder="Ej: A1, Sala 3, Lab. Informática"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, color: c }))}
                      className={`h-7 w-7 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  {editingId && (
                    <button
                      onClick={handleEliminar}
                      disabled={isPending}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" /> Eliminar
                    </button>
                  )}
                  {saved && (
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Guardado
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-[#555] hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGuardar}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] disabled:opacity-70"
                  >
                    {isPending
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                      : <><Save className="h-4 w-4" /> Guardar</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
