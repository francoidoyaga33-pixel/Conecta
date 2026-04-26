"use client"

import { useState, useEffect, useTransition } from "react"
import { TopBar } from "../_components/TopBar"
import {
  Bell, Plus, X, Loader2, Save, CheckCircle2,
  BookOpen, Briefcase, AlertTriangle, Users, User, Building2,
  Trash2, ChevronDown, Filter
} from "lucide-react"
import {
  getAvisos, getAvisosLeidos, marcarLeido, crearAviso,
  eliminarAviso, getGrupos, getEstudiantes, getMyProfile
} from "./actions"

type Categoria = "academico" | "administrativo" | "urgente"
type Alcance = "institucion" | "grupo" | "alumno"

interface Aviso {
  id: string
  titulo: string
  contenido: string
  categoria: Categoria
  alcance: Alcance
  grupo_id: string | null
  alumno_id: string | null
  created_at: string
  autor_id: string
  conecta_profiles: { nombre: string; apellido: string } | null
  conecta_grupos: { nombre: string } | null
}

interface Grupo { id: string; nombre: string; nivel: string }
interface Estudiante { id: string; nombre: string; apellido: string }

const CAT_CONFIG: Record<Categoria, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  academico:      { label: "Académico",      icon: BookOpen,       color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  administrativo: { label: "Administrativo", icon: Briefcase,      color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  urgente:        { label: "Urgente",        icon: AlertTriangle,  color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200" },
}

const ALCANCE_CONFIG: Record<Alcance, { label: string; icon: React.ElementType }> = {
  institucion: { label: "Institución",  icon: Building2 },
  grupo:       { label: "Grupo",        icon: Users },
  alumno:      { label: "Alumno",       icon: User },
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "Ahora"
  if (m < 60) return `Hace ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `Hace ${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `Hace ${d}d`
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

const EMPTY_FORM = {
  titulo: "",
  contenido: "",
  categoria: "academico" as Categoria,
  alcance: "institucion" as Alcance,
  grupo_id: "",
  alumno_id: "",
}

export default function AvisosPage() {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [leidos, setLeidos] = useState<Set<string>>(new Set())
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [loading, setLoading] = useState(true)
  const [myRole, setMyRole] = useState("")
  const [myId, setMyId] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | "todos">("todos")
  const [filtroAlcance, setFiltroAlcance] = useState<Alcance | "todos">("todos")
  const [soloNoLeidos, setSoloNoLeidos] = useState(false)

  async function loadData() {
    const [avs, leidosArr, gs, ests, profile] = await Promise.all([
      getAvisos(),
      getAvisosLeidos(),
      getGrupos(),
      getEstudiantes(),
      getMyProfile(),
    ])
    setAvisos(avs as unknown as Aviso[])
    setLeidos(new Set(leidosArr))
    setGrupos(gs as Grupo[])
    setEstudiantes(ests as Estudiante[])
    setMyRole(profile?.role ?? "")
    setMyId(profile?.id ?? "")
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      // Reset dependent fields
      if (name === "alcance") {
        next.grupo_id = ""
        next.alumno_id = ""
      }
      return next
    })
  }

  function handleCrear() {
    if (!form.titulo.trim()) { alert("El título es obligatorio"); return }
    if (form.alcance === "grupo" && !form.grupo_id) { alert("Seleccioná un grupo"); return }
    if (form.alcance === "alumno" && !form.alumno_id) { alert("Seleccioná un alumno"); return }

    startTransition(async () => {
      const result = await crearAviso({
        titulo: form.titulo,
        contenido: form.contenido,
        categoria: form.categoria,
        alcance: form.alcance,
        grupo_id: form.alcance === "grupo" ? form.grupo_id : null,
        alumno_id: form.alcance === "alumno" ? form.alumno_id : null,
      })
      if (result.error) { alert("Error: " + result.error); return }
      setSaved(true)
      setTimeout(() => { setSaved(false); setShowModal(false); setForm(EMPTY_FORM) }, 1200)
      await loadData()
    })
  }

  function handleMarcarLeido(avisoId: string) {
    startTransition(async () => {
      await marcarLeido(avisoId)
      setLeidos((prev) => { const next = new Set(Array.from(prev)); next.add(avisoId); return next })
    })
  }

  function handleEliminar(id: string) {
    if (!confirm("¿Eliminar este aviso?")) return
    startTransition(async () => {
      await eliminarAviso(id)
      setAvisos((prev) => prev.filter((a) => a.id !== id))
    })
  }

  const puedeCrear = myRole === "admin" || myRole === "docente" || myRole === "financiero"
  const puedeEliminar = (aviso: Aviso) => myRole === "admin" || aviso.autor_id === myId

  const filtered = avisos.filter((a) => {
    if (filtroCategoria !== "todos" && a.categoria !== filtroCategoria) return false
    if (filtroAlcance !== "todos" && a.alcance !== filtroAlcance) return false
    if (soloNoLeidos && leidos.has(a.id)) return false
    return true
  })

  const noLeidos = avisos.filter((a) => !leidos.has(a.id)).length

  return (
    <>
      <TopBar
        title="Avisos"
        subtitle={noLeidos > 0 ? `${noLeidos} sin leer` : "Todo al día"}
      />

      <main className="flex-1 p-6 space-y-5 max-w-4xl mx-auto w-full">

        {/* Barra de controles */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {/* Filtro categoría */}
            <div className="relative">
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value as Categoria | "todos")}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
              >
                <option value="todos">Todas las categorías</option>
                <option value="academico">Académico</option>
                <option value="administrativo">Administrativo</option>
                <option value="urgente">Urgente</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filtro alcance */}
            <div className="relative">
              <select
                value={filtroAlcance}
                onChange={(e) => setFiltroAlcance(e.target.value as Alcance | "todos")}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
              >
                <option value="todos">Todo el alcance</option>
                <option value="institucion">Institución</option>
                <option value="grupo">Grupo</option>
                <option value="alumno">Alumno</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Toggle no leídos */}
            <button
              onClick={() => setSoloNoLeidos((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                soloNoLeidos
                  ? "bg-[#2B7A9E] border-[#2B7A9E] text-white"
                  : "border-gray-200 bg-white text-[#555] hover:bg-gray-50"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Sin leer {noLeidos > 0 && <span className="ml-0.5 bg-white/20 text-white rounded-full px-1.5 text-xs font-bold">{noLeidos}</span>}
            </button>
          </div>

          {puedeCrear && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors"
            >
              <Plus className="h-4 w-4" /> Nuevo aviso
            </button>
          )}
        </div>

        {/* Lista de avisos */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-10 w-10 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-[#3D3D3D]">
              {avisos.length === 0 ? "No hay avisos aún" : "No hay avisos con estos filtros"}
            </p>
            <p className="text-xs text-[#aaa] mt-1">
              {avisos.length === 0 ? "Los avisos publicados aparecerán aquí" : "Probá con otros filtros"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((aviso) => {
              const cat = CAT_CONFIG[aviso.categoria]
              const alc = ALCANCE_CONFIG[aviso.alcance]
              const AlcIcon = alc.icon
              const CatIcon = cat.icon
              const isLeido = leidos.has(aviso.id)

              return (
                <div
                  key={aviso.id}
                  className={`bg-white rounded-xl border transition-colors ${
                    aviso.categoria === "urgente" && !isLeido
                      ? "border-red-200 shadow-sm shadow-red-50"
                      : isLeido
                      ? "border-gray-100 opacity-75"
                      : "border-gray-200"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icono categoría */}
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${cat.bg} ${cat.border} border`}>
                        <CatIcon className={`h-4 w-4 ${cat.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {!isLeido && (
                                <span className="h-2 w-2 rounded-full bg-[#2B7A9E] shrink-0" />
                              )}
                              <p className={`text-sm font-semibold truncate ${isLeido ? "text-[#888]" : "text-[#3D3D3D]"}`}>
                                {aviso.titulo}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
                                <CatIcon className="h-2.5 w-2.5" />
                                {cat.label}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#888] bg-gray-100 px-2 py-0.5 rounded-full">
                                <AlcIcon className="h-2.5 w-2.5" />
                                {aviso.alcance === "grupo" && aviso.conecta_grupos
                                  ? aviso.conecta_grupos.nombre
                                  : alc.label}
                              </span>
                              <span className="text-[10px] text-[#bbb]">{timeAgo(aviso.created_at)}</span>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center gap-1 shrink-0">
                            {!isLeido && (
                              <button
                                onClick={() => handleMarcarLeido(aviso.id)}
                                className="p-1.5 rounded-lg text-[#aaa] hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Marcar como leído"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {puedeEliminar(aviso) && (
                              <button
                                onClick={() => handleEliminar(aviso.id)}
                                className="p-1.5 rounded-lg text-[#aaa] hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Contenido */}
                        {aviso.contenido && (
                          <p className="text-sm text-[#666] mt-2 leading-relaxed whitespace-pre-wrap">
                            {aviso.contenido}
                          </p>
                        )}

                        {/* Autor */}
                        {aviso.conecta_profiles && (
                          <p className="text-[11px] text-[#bbb] mt-2">
                            Por {aviso.conecta_profiles.nombre} {aviso.conecta_profiles.apellido}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-[#aaa]">
            {filtered.length} aviso{filtered.length !== 1 ? "s" : ""}
            {noLeidos > 0 && ` · ${noLeidos} sin leer`}
          </p>
        )}
      </main>

      {/* Modal nuevo aviso */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#3D3D3D]">Nuevo aviso</h2>
              <button onClick={() => { setShowModal(false); setForm(EMPTY_FORM) }} className="p-1 rounded-lg text-[#aaa] hover:text-[#3D3D3D]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Título <span className="text-red-400">*</span></label>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Examen de matemáticas el viernes"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
                />
              </div>

              {/* Categoría + Alcance */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Categoría</label>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                  >
                    <option value="academico">Académico</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Alcance</label>
                  <select
                    name="alcance"
                    value={form.alcance}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                  >
                    <option value="institucion">Institución (todos)</option>
                    <option value="grupo">Grupo específico</option>
                    <option value="alumno">Alumno específico</option>
                  </select>
                </div>
              </div>

              {/* Selector grupo */}
              {form.alcance === "grupo" && (
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Grupo <span className="text-red-400">*</span></label>
                  <select
                    name="grupo_id"
                    value={form.grupo_id}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                  >
                    <option value="">Seleccioná un grupo...</option>
                    {grupos.map((g) => <option key={g.id} value={g.id}>{g.nombre} {g.nivel ? `· ${g.nivel}` : ""}</option>)}
                  </select>
                </div>
              )}

              {/* Selector alumno */}
              {form.alcance === "alumno" && (
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Alumno <span className="text-red-400">*</span></label>
                  <select
                    name="alumno_id"
                    value={form.alumno_id}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                  >
                    <option value="">Seleccioná un alumno...</option>
                    {estudiantes.map((e) => <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>)}
                  </select>
                </div>
              )}

              {/* Contenido */}
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Contenido</label>
                <textarea
                  name="contenido"
                  value={form.contenido}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Detalle del aviso..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] resize-none"
                />
              </div>

              {/* Preview categoría */}
              <div className={`rounded-lg p-3 flex items-center gap-2 ${CAT_CONFIG[form.categoria].bg} border ${CAT_CONFIG[form.categoria].border}`}>
                {(() => { const Icon = CAT_CONFIG[form.categoria].icon; return <Icon className={`h-4 w-4 ${CAT_CONFIG[form.categoria].color}`} /> })()}
                <p className={`text-xs font-semibold ${CAT_CONFIG[form.categoria].color}`}>
                  Vista previa · {CAT_CONFIG[form.categoria].label} · {ALCANCE_CONFIG[form.alcance].label}
                </p>
              </div>

              {/* Botones */}
              <div className="flex items-center justify-between pt-1">
                {saved ? (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Publicado
                  </span>
                ) : <span />}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setForm(EMPTY_FORM) }}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-[#555] hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCrear}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors disabled:opacity-70"
                  >
                    {isPending
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Publicando...</>
                      : <><Save className="h-4 w-4" /> Publicar</>}
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
