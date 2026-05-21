"use client"

import { useState, useEffect, useTransition } from "react"
import { TopBar } from "../../_components/TopBar"
import {
  Plus, Search, Loader2, X, Save, CheckCircle2,
  Pencil, Trash2, ChevronDown, Instagram, Globe,
  Users, Phone, Mail, BookOpen, MessageSquare,
} from "lucide-react"
import { getInteresados, crearInteresado, actualizarInteresado, eliminarInteresado } from "./actions"

interface Interesado {
  id: string; nombre: string; apellido: string; email: string; telefono: string
  cursos_interes: string; canal: string; estado_venta: string
  seguimiento: string; observaciones: string; motivo_perdido: string
  created_at: string; updated_at: string
}

const CANAL_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  instagram: { label: "Instagram", icon: Instagram, color: "text-pink-700",   bg: "bg-pink-50" },
  facebook:  { label: "Facebook",  icon: Users,     color: "text-blue-700",   bg: "bg-blue-50" },
  web:       { label: "Web",       icon: Globe,     color: "text-violet-700", bg: "bg-violet-50" },
  referido:  { label: "Referido",  icon: Users,     color: "text-emerald-700",bg: "bg-emerald-50" },
  otro:      { label: "Otro",      icon: MessageSquare, color: "text-gray-600", bg: "bg-gray-100" },
}

const ESTADO_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  nuevo:          { label: "Nuevo",          color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  contactado:     { label: "Contactado",     color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  en_seguimiento: { label: "En seguimiento", color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  inscripto:      { label: "Inscripto",      color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200" },
  perdido:        { label: "Perdido",        color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200" },
}

const EMPTY_FORM = {
  nombre: "", apellido: "", email: "", telefono: "",
  cursos_interes: "", canal: "instagram", estado_venta: "nuevo",
  seguimiento: "", observaciones: "", motivo_perdido: "",
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return "Hoy"
  if (d === 1) return "Ayer"
  if (d < 7) return `Hace ${d} días`
  if (d < 30) return `Hace ${Math.floor(d / 7)} sem.`
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

export default function InteresadosPage() {
  const [interesados, setInteresados] = useState<Interesado[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroCanal, setFiltroCanal] = useState("todos")

  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Interesado | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  async function loadData() {
    const data = await getInteresados()
    setInteresados(data as Interesado[])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  function abrirNuevo() {
    setEditando(null)
    setForm(EMPTY_FORM)
    setSaved(false)
    setShowModal(true)
  }

  function abrirEditar(i: Interesado) {
    setEditando(i)
    setForm({
      nombre: i.nombre, apellido: i.apellido, email: i.email, telefono: i.telefono,
      cursos_interes: i.cursos_interes, canal: i.canal, estado_venta: i.estado_venta,
      seguimiento: i.seguimiento, observaciones: i.observaciones,
      motivo_perdido: i.motivo_perdido ?? "",
    })
    setSaved(false)
    setShowModal(true)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleGuardar() {
    if (!form.nombre.trim() || !form.apellido.trim()) { alert("Nombre y apellido son obligatorios"); return }
    startTransition(async () => {
      let result
      if (editando) {
        result = await actualizarInteresado(editando.id, form)
      } else {
        result = await crearInteresado(form)
      }
      if (result.error) { alert("Error: " + result.error); return }
      setSaved(true)
      await loadData()
      setTimeout(() => { setSaved(false); setShowModal(false) }, 1200)
    })
  }

  function handleEliminar(id: string) {
    if (!confirm("¿Eliminar este interesado?")) return
    startTransition(async () => {
      await eliminarInteresado(id)
      setInteresados(prev => prev.filter(i => i.id !== id))
    })
  }

  // Cambio de estado rápido inline — si pasa a "perdido" abre el modal para capturar el motivo
  function handleCambiarEstado(id: string, nuevoEstado: string) {
    const interesado = interesados.find(i => i.id === id)
    if (!interesado) return
    if (nuevoEstado === "perdido") {
      abrirEditar({ ...interesado, estado_venta: "perdido" })
      return
    }
    startTransition(async () => {
      await actualizarInteresado(id, { ...interesado, estado_venta: nuevoEstado })
      await loadData()
    })
  }

  const filtered = interesados.filter(i => {
    const matchSearch = `${i.nombre} ${i.apellido} ${i.email} ${i.cursos_interes}`
      .toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === "todos" || i.estado_venta === filtroEstado
    const matchCanal = filtroCanal === "todos" || i.canal === filtroCanal
    return matchSearch && matchEstado && matchCanal
  })

  const statsPorEstado = Object.keys(ESTADO_CONFIG).map(e => ({
    estado: e,
    count: interesados.filter(i => i.estado_venta === e).length,
  }))

  return (
    <>
      <TopBar title="Interesados" subtitle="Seguimiento de consultas y proceso de venta" />

      <main className="flex-1 p-6 space-y-5 max-w-6xl mx-auto w-full">

        {/* Kanban stats */}
        <div className="grid grid-cols-5 gap-2">
          {statsPorEstado.map(({ estado, count }) => {
            const cfg = ESTADO_CONFIG[estado]
            return (
              <button
                key={estado}
                onClick={() => setFiltroEstado(filtroEstado === estado ? "todos" : estado)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  filtroEstado === estado
                    ? `${cfg.bg} ${cfg.border} ring-2 ring-offset-1 ring-[#2B7A9E]/20`
                    : `${cfg.bg} ${cfg.border} opacity-70 hover:opacity-100`
                }`}
              >
                <p className={`text-xl font-black ${cfg.color}`}>{count}</p>
                <p className={`text-[10px] font-semibold mt-0.5 ${cfg.color}`}>{cfg.label}</p>
              </button>
            )
          })}
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-1 min-w-0 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text" placeholder="Buscar interesado o curso..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
              />
            </div>
            <div className="relative">
              <select value={filtroCanal} onChange={e => setFiltroCanal(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20">
                <option value="todos">Todos los canales</option>
                {Object.entries(CANAL_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={abrirNuevo}
            className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors"
          >
            <Plus className="h-4 w-4" /> Nuevo interesado
          </button>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-[#3D3D3D]">{interesados.length === 0 ? "Sin interesados aún" : "Sin resultados"}</p>
              <p className="text-xs text-[#aaa] mt-1">{interesados.length === 0 ? "Registrá el primer interesado" : "Probá con otros filtros"}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Interesado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden lg:table-cell">Curso de interés</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden md:table-cell">Canal</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden xl:table-cell">Seguimiento</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden md:table-cell">Hace</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(i => {
                  const canalCfg = CANAL_CONFIG[i.canal] ?? CANAL_CONFIG.otro
                  const estadoCfg = ESTADO_CONFIG[i.estado_venta] ?? ESTADO_CONFIG.nuevo
                  const CanalIcon = canalCfg.icon
                  return (
                    <tr key={i.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0">
                            {i.nombre.charAt(0)}{i.apellido.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#3D3D3D]">{i.apellido}, {i.nombre}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {i.email && <span className="text-[10px] text-[#aaa] flex items-center gap-0.5"><Mail className="h-2.5 w-2.5" />{i.email}</span>}
                              {i.telefono && <span className="text-[10px] text-[#aaa] flex items-center gap-0.5"><Phone className="h-2.5 w-2.5" />{i.telefono}</span>}
                            </div>
                            {i.estado_venta === "perdido" && i.motivo_perdido && (
                              <p className="text-[10px] text-red-500 mt-0.5 italic truncate max-w-[200px]">
                                Motivo: {i.motivo_perdido}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {i.cursos_interes
                          ? <span className="flex items-center gap-1 text-xs text-[#555]"><BookOpen className="h-3 w-3 text-[#aaa]" />{i.cursos_interes}</span>
                          : <span className="text-[#ccc] text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${canalCfg.bg} ${canalCfg.color}`}>
                          <CanalIcon className="h-3 w-3" />{canalCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={i.estado_venta}
                          onChange={e => handleCambiarEstado(i.id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2.5 py-1 border appearance-none cursor-pointer focus:outline-none ${estadoCfg.bg} ${estadoCfg.color} ${estadoCfg.border}`}
                        >
                          {Object.entries(ESTADO_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <p className="text-xs text-[#555] max-w-[160px] truncate">{i.seguimiento || <span className="text-[#ccc]">—</span>}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#bbb] hidden md:table-cell">
                        {timeAgo(i.updated_at ?? i.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => abrirEditar(i)} className="p-1.5 rounded-lg text-[#aaa] hover:text-[#2B7A9E] hover:bg-[#2B7A9E]/5 transition-colors" title="Editar">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleEliminar(i.id)} className="p-1.5 rounded-lg text-[#aaa] hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-[#aaa]">{filtered.length} interesado{filtered.length !== 1 ? "s" : ""} · {interesados.length} total</p>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#3D3D3D]">{editando ? "Editar interesado" : "Nuevo interesado"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-[#aaa] hover:text-[#3D3D3D]"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "nombre", label: "Nombre *", placeholder: "Juan" },
                  { name: "apellido", label: "Apellido *", placeholder: "García" },
                  { name: "email", label: "Email", placeholder: "juan@ejemplo.com" },
                  { name: "telefono", label: "Teléfono", placeholder: "+54 9 11 1234-5678" },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold text-[#555] mb-1.5">{f.label}</label>
                    <input name={f.name} value={form[f.name as keyof typeof form]} onChange={handleChange} placeholder={f.placeholder}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Curso de interés</label>
                <input name="cursos_interes" value={form.cursos_interes} onChange={handleChange} placeholder="Ej: Programación Nivel I, Diseño Gráfico"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Canal de llegada</label>
                  <select name="canal" value={form.canal} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20">
                    {Object.entries(CANAL_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Estado del proceso</label>
                  <select name="estado_venta" value={form.estado_venta} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20">
                    {Object.entries(ESTADO_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Seguimiento comercial</label>
                <textarea name="seguimiento" value={form.seguimiento} onChange={handleChange} rows={2}
                  placeholder="Ej: Llamé el lunes, quedó en confirmar la semana que viene..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 resize-none" />
              </div>

              {form.estado_venta === "perdido" && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <label className="block text-xs font-semibold text-red-700 mb-1.5">Motivo de pérdida</label>
                  <textarea name="motivo_perdido" value={form.motivo_perdido} onChange={handleChange} rows={2}
                    placeholder="Ej: Eligió otra institución, precio elevado, falta de horarios..."
                    className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Observaciones</label>
                <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={2}
                  placeholder="Notas adicionales..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 resize-none" />
              </div>

              <div className="flex items-center justify-between pt-1">
                {saved ? <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium"><CheckCircle2 className="h-4 w-4" /> Guardado</span> : <span />}
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-[#555] hover:bg-gray-50">Cancelar</button>
                  <button onClick={handleGuardar} disabled={isPending}
                    className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] disabled:opacity-70">
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
