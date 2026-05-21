"use client"

import { useState, useEffect, useTransition } from "react"
import { TopBar } from "../_components/TopBar"
import {
  ChevronLeft, ChevronRight, Plus, X, Clock, FileText,
  Calendar, Loader2, Pencil, Trash2, Users, Building2, Save, CheckCircle2,
} from "lucide-react"
import {
  getEventos, crearEvento, actualizarEvento, eliminarEvento,
  getGrupos, getMyProfile,
} from "./actions"
import { HorarioView } from "./HorarioView"

type EventType = "clase" | "examen" | "reunion" | "feriado" | "otro"
type Alcance = "institucion" | "grupo"

interface Evento {
  id: string
  titulo: string
  fecha: string
  hora_inicio: string | null
  hora_fin: string | null
  tipo: EventType
  descripcion: string | null
  grupo_id: string | null
  alcance: Alcance
  autor_id: string | null
  created_at: string
  conecta_grupos: { nombre: string; nivel: string } | null
  conecta_profiles: { nombre: string; apellido: string } | null
}

interface Grupo { id: string; nombre: string; nivel: string }

const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string; border: string }> = {
  clase:   { label: "Clase",    color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  examen:  { label: "Examen",   color: "text-rose-700",   bg: "bg-rose-50",   border: "border-rose-200" },
  reunion: { label: "Reunión",  color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  feriado: { label: "Feriado",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  otro:    { label: "Otro",     color: "text-gray-600",   bg: "bg-gray-100",  border: "border-gray-200" },
}

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

function fmtDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function todayISO() {
  const d = new Date()
  return fmtDate(d.getFullYear(), d.getMonth(), d.getDate())
}

const EMPTY_FORM = {
  titulo: "", fecha: todayISO(), hora_inicio: "08:00", hora_fin: "09:00",
  tipo: "clase" as EventType, descripcion: "", grupo_id: "", alcance: "institucion" as Alcance,
}

export default function CalendarioPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1) // 1-based

  const [eventos, setEventos] = useState<Evento[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loading, setLoading] = useState(true)
  const [myRole, setMyRole] = useState("")
  const [myId, setMyId] = useState("")
  const [tab, setTab] = useState<"calendario" | "horario">("calendario")

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<EventType | "todos">("todos")
  const [filtroGrupo, setFiltroGrupo] = useState<string>("todos")

  // Modal
  const [showModal, setShowModal] = useState(false)
  const [modalEvento, setModalEvento] = useState<Evento | null>(null)
  const [modoEditar, setModoEditar] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  async function loadEventos() {
    const data = await getEventos(year, month)
    setEventos(data as unknown as Evento[])
  }

  useEffect(() => {
    async function init() {
      const [gs, profile] = await Promise.all([getGrupos(), getMyProfile()])
      setGrupos(gs as Grupo[])
      setMyRole(profile?.role ?? "")
      setMyId(profile?.id ?? "")
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    setLoading(true)
    loadEventos().then(() => setLoading(false))
  }, [year, month])

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }
  function goToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth() + 1)
  }

  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const todayStr = todayISO()

  function eventosFiltered() {
    return eventos.filter((e) => {
      if (filtroTipo !== "todos" && e.tipo !== filtroTipo) return false
      if (filtroGrupo !== "todos") {
        if (filtroGrupo === "institucion" && e.grupo_id !== null) return false
        if (filtroGrupo !== "institucion" && e.grupo_id !== filtroGrupo) return false
      }
      return true
    })
  }

  function eventosDelDia(day: number) {
    const dateStr = fmtDate(year, month - 1, day)
    return eventosFiltered().filter(e => e.fecha === dateStr)
  }

  const proximos = eventosFiltered()
    .filter(e => e.fecha >= todayStr)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 6)

  function abrirNuevo(fecha?: string) {
    setModalEvento(null)
    setModoEditar(false)
    setForm({ ...EMPTY_FORM, fecha: fecha ?? fmtDate(year, month - 1, today.getDate()) })
    setSaved(false)
    setShowModal(true)
  }

  function abrirDetalle(ev: Evento) {
    setModalEvento(ev)
    setModoEditar(false)
    setSaved(false)
    setShowModal(true)
  }

  function abrirEditar(ev: Evento) {
    setModalEvento(ev)
    setModoEditar(true)
    setForm({
      titulo: ev.titulo,
      fecha: ev.fecha,
      hora_inicio: ev.hora_inicio ?? "08:00",
      hora_fin: ev.hora_fin ?? "09:00",
      tipo: ev.tipo,
      descripcion: ev.descripcion ?? "",
      grupo_id: ev.grupo_id ?? "",
      alcance: ev.alcance,
    })
    setSaved(false)
    setShowModal(true)
  }

  function cerrarModal() {
    setShowModal(false)
    setModalEvento(null)
    setModoEditar(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => {
      const next = { ...prev, [name]: value }
      if (name === "alcance" && value === "institucion") next.grupo_id = ""
      return next
    })
  }

  function handleGuardar() {
    if (!form.titulo.trim()) { alert("El título es obligatorio"); return }
    if (!form.fecha) { alert("La fecha es obligatoria"); return }
    if (form.alcance === "grupo" && !form.grupo_id) { alert("Seleccioná un grupo"); return }

    startTransition(async () => {
      const payload = {
        titulo: form.titulo,
        fecha: form.fecha,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        tipo: form.tipo,
        descripcion: form.descripcion,
        grupo_id: form.alcance === "grupo" ? form.grupo_id : null,
        alcance: form.alcance,
      }

      let result
      if (modoEditar && modalEvento) {
        result = await actualizarEvento(modalEvento.id, payload)
      } else {
        result = await crearEvento(payload)
      }

      if (result.error) { alert("Error: " + result.error); return }
      setSaved(true)
      await loadEventos()
      setTimeout(() => { setSaved(false); cerrarModal() }, 1200)
    })
  }

  function handleEliminar(id: string) {
    if (!confirm("¿Eliminar este evento?")) return
    startTransition(async () => {
      await eliminarEvento(id)
      await loadEventos()
      cerrarModal()
    })
  }

  const puedeCrear = myRole !== "estudiante" && myRole !== ""
  const puedeEditar = (ev: Evento) => myRole === "admin" || ev.autor_id === myId

  return (
    <>
      <TopBar title="Calendario" subtitle="Gestión de eventos del instituto" />

      {/* Tab toggle */}
      <div className="px-6 pt-4 pb-0">
        <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
          <button
            onClick={() => setTab("calendario")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === "calendario"
                ? "bg-white shadow-sm text-[#2B7A9E]"
                : "text-[#666] hover:text-[#3D3D3D]"
            }`}
          >
            Calendario
          </button>
          <button
            onClick={() => setTab("horario")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === "horario"
                ? "bg-white shadow-sm text-[#2B7A9E]"
                : "text-[#666] hover:text-[#3D3D3D]"
            }`}
          >
            Horario de clases
          </button>
        </div>
      </div>

      {tab === "horario" ? (
        <HorarioView role={myRole} />
      ) : (
        <main className="flex-1 p-6 flex gap-6 min-h-0 overflow-hidden">

          {/* ── CALENDARIO ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as EventType | "todos")}
                  className="appearance-none pl-3 pr-7 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                >
                  <option value="todos">Todos los tipos</option>
                  {(Object.keys(TYPE_CONFIG) as EventType[]).map(t => (
                    <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={filtroGrupo}
                  onChange={(e) => setFiltroGrupo(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                >
                  <option value="todos">Todos los grupos</option>
                  <option value="institucion">Solo institución</option>
                  {grupos.map(g => (
                    <option key={g.id} value={g.id}>{g.nombre}{g.nivel ? ` · ${g.nivel}` : ""}</option>
                  ))}
                </select>
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                <button
                  onClick={goToday}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-[#555] hover:bg-gray-50 transition-colors"
                >
                  Hoy
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col flex-1">
              {/* Nav mes */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <h2 className="text-base font-bold text-[#3D3D3D] min-w-[170px] text-center">
                    {MONTHS[month - 1]} {year}
                  </h2>
                  <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                {puedeCrear && (
                  <button
                    onClick={() => abrirNuevo()}
                    className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Nuevo evento
                  </button>
                )}
              </div>

              {/* Cabecera días */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_OF_WEEK.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-[#aaa] py-2">{d}</div>
                ))}
              </div>

              {/* Grid */}
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex-1">
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} className="bg-gray-50 min-h-[88px]" />
                    const dateStr = fmtDate(year, month - 1, day)
                    const dayEvs = eventosDelDia(day)
                    const isToday = dateStr === todayStr
                    return (
                      <div
                        key={i}
                        onClick={() => puedeCrear && abrirNuevo(dateStr)}
                        className={`bg-white min-h-[88px] p-1.5 group ${puedeCrear ? "cursor-pointer hover:bg-[#2B7A9E]/5" : ""} transition-colors`}
                      >
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold mb-1 ${
                          isToday ? "bg-[#2B7A9E] text-white" : "text-[#3D3D3D] group-hover:text-[#2B7A9E]"
                        }`}>
                          {day}
                        </span>
                        <div className="space-y-0.5">
                          {dayEvs.slice(0, 2).map(ev => (
                            <button
                              key={ev.id}
                              onClick={e => { e.stopPropagation(); abrirDetalle(ev) }}
                              className={`w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded truncate border ${TYPE_CONFIG[ev.tipo].bg} ${TYPE_CONFIG[ev.tipo].color} ${TYPE_CONFIG[ev.tipo].border}`}
                            >
                              {ev.hora_inicio ? `${ev.hora_inicio.slice(0, 5)} ` : ""}{ev.titulo}
                            </button>
                          ))}
                          {dayEvs.length > 2 && (
                            <p className="text-[10px] text-[#aaa] px-1">+{dayEvs.length - 2} más</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="w-64 shrink-0 space-y-4 overflow-y-auto">

            {/* Próximos eventos */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-xs font-bold text-[#3D3D3D] uppercase tracking-wider mb-3">Próximos</h3>
              {proximos.length === 0 ? (
                <p className="text-xs text-[#aaa] text-center py-6">Sin eventos próximos</p>
              ) : (
                <div className="space-y-2">
                  {proximos.map(ev => {
                    const cfg = TYPE_CONFIG[ev.tipo]
                    const [, mm, dd] = ev.fecha.split("-")
                    return (
                      <button
                        key={ev.id}
                        onClick={() => abrirDetalle(ev)}
                        className="w-full text-left flex items-start gap-2.5 rounded-lg hover:bg-gray-50 p-2 transition-colors"
                      >
                        <div className={`h-9 w-9 rounded-lg flex flex-col items-center justify-center shrink-0 border ${cfg.bg} ${cfg.border}`}>
                          <span className={`text-[11px] font-black leading-none ${cfg.color}`}>{dd}</span>
                          <span className={`text-[8px] uppercase ${cfg.color}`}>{MONTHS[parseInt(mm) - 1].slice(0, 3)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#3D3D3D] truncate">{ev.titulo}</p>
                          {ev.hora_inicio && (
                            <p className="text-[10px] text-[#aaa]">{ev.hora_inicio.slice(0,5)} – {ev.hora_fin?.slice(0,5)}</p>
                          )}
                          {ev.conecta_grupos && (
                            <p className="text-[10px] text-[#2B7A9E] font-medium truncate">{ev.conecta_grupos.nombre}</p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Leyenda */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-xs font-bold text-[#3D3D3D] uppercase tracking-wider mb-3">Tipos</h3>
              <div className="space-y-1.5">
                {(Object.entries(TYPE_CONFIG) as [EventType, typeof TYPE_CONFIG[EventType]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setFiltroTipo(filtroTipo === key ? "todos" : key)}
                    className={`flex items-center gap-2 w-full rounded-lg px-2 py-1 transition-colors ${
                      filtroTipo === key ? `${cfg.bg} ${cfg.color}` : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-sm shrink-0 border ${cfg.bg} ${cfg.border}`} />
                    <span className="text-xs text-[#555]">{cfg.label}</span>
                    <span className="ml-auto text-[10px] text-[#bbb]">
                      {eventos.filter(e => e.tipo === key).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grupos */}
            {grupos.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-[#3D3D3D] uppercase tracking-wider mb-3">Grupos</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setFiltroGrupo("todos")}
                    className={`flex items-center gap-2 w-full rounded-lg px-2 py-1.5 text-xs transition-colors ${
                      filtroGrupo === "todos" ? "bg-[#2B7A9E]/10 text-[#2B7A9E] font-semibold" : "text-[#555] hover:bg-gray-50"
                    }`}
                  >
                    <Building2 className="h-3 w-3 shrink-0" /> Todos
                  </button>
                  {grupos.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setFiltroGrupo(filtroGrupo === g.id ? "todos" : g.id)}
                      className={`flex items-center gap-2 w-full rounded-lg px-2 py-1.5 text-xs transition-colors ${
                        filtroGrupo === g.id ? "bg-[#2B7A9E]/10 text-[#2B7A9E] font-semibold" : "text-[#555] hover:bg-gray-50"
                      }`}
                    >
                      <Users className="h-3 w-3 shrink-0" />
                      <span className="truncate">{g.nombre}{g.nivel ? ` · ${g.nivel}` : ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── MODAL ── */}
          {showModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
              onClick={cerrarModal}
            >
              <div
                className="w-full max-w-md bg-white rounded-2xl shadow-xl"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-[#3D3D3D]">
                    <Calendar className="h-4 w-4 text-[#2B7A9E]" />
                    <h3 className="text-sm font-bold">
                      {!modalEvento ? "Nuevo evento" : modoEditar ? "Editar evento" : modalEvento.titulo}
                    </h3>
                  </div>
                  <button onClick={cerrarModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Detalle */}
                {modalEvento && !modoEditar ? (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TYPE_CONFIG[modalEvento.tipo].bg} ${TYPE_CONFIG[modalEvento.tipo].color} ${TYPE_CONFIG[modalEvento.tipo].border}`}>
                        {TYPE_CONFIG[modalEvento.tipo].label}
                      </span>
                      {modalEvento.conecta_grupos && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#2B7A9E]/10 text-[#2B7A9E]">
                          {modalEvento.conecta_grupos.nombre}
                        </span>
                      )}
                      {modalEvento.alcance === "institucion" && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                          Institución
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#555]">
                      <Calendar className="h-4 w-4 text-[#aaa]" />
                      {new Date(modalEvento.fecha + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </div>

                    {modalEvento.hora_inicio && (
                      <div className="flex items-center gap-2 text-sm text-[#555]">
                        <Clock className="h-4 w-4 text-[#aaa]" />
                        {modalEvento.hora_inicio.slice(0,5)} – {modalEvento.hora_fin?.slice(0,5)}
                      </div>
                    )}

                    {modalEvento.descripcion && (
                      <div className="flex items-start gap-2 text-sm text-[#555]">
                        <FileText className="h-4 w-4 text-[#aaa] mt-0.5 shrink-0" />
                        <p className="whitespace-pre-wrap">{modalEvento.descripcion}</p>
                      </div>
                    )}

                    {modalEvento.conecta_profiles && (
                      <p className="text-xs text-[#bbb]">
                        Creado por {modalEvento.conecta_profiles.nombre} {modalEvento.conecta_profiles.apellido}
                      </p>
                    )}

                    {puedeEditar(modalEvento) && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => abrirEditar(modalEvento)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-[#555] hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(modalEvento.id)}
                          disabled={isPending}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 text-rose-600 py-2.5 text-sm font-semibold hover:bg-rose-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Formulario nuevo/editar */
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#555] mb-1.5">Título <span className="text-red-400">*</span></label>
                      <input
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        placeholder="Ej: Clase de Matemáticas"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#555] mb-1.5">Tipo</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {(Object.keys(TYPE_CONFIG) as EventType[]).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, tipo: t }))}
                            className={`rounded-lg py-1.5 text-[10px] font-semibold transition-colors border ${
                              form.tipo === t
                                ? `${TYPE_CONFIG[t].bg} ${TYPE_CONFIG[t].color} ${TYPE_CONFIG[t].border}`
                                : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                            }`}
                          >
                            {TYPE_CONFIG[t].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#555] mb-1.5">Alcance</label>
                        <select
                          name="alcance"
                          value={form.alcance}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30"
                        >
                          <option value="institucion">Institución</option>
                          <option value="grupo">Grupo</option>
                        </select>
                      </div>
                      {form.alcance === "grupo" && (
                        <div>
                          <label className="block text-xs font-semibold text-[#555] mb-1.5">Grupo <span className="text-red-400">*</span></label>
                          <select
                            name="grupo_id"
                            value={form.grupo_id}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30"
                          >
                            <option value="">Seleccioná...</option>
                            {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#555] mb-1.5">Fecha <span className="text-red-400">*</span></label>
                      <input
                        type="date"
                        name="fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#555] mb-1.5">Inicio</label>
                        <input
                          type="time"
                          name="hora_inicio"
                          value={form.hora_inicio}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#555] mb-1.5">Fin</label>
                        <input
                          type="time"
                          name="hora_fin"
                          value={form.hora_fin}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#555] mb-1.5">Descripción</label>
                      <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        placeholder="Detalles del evento..."
                        rows={2}
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {saved ? (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                          <CheckCircle2 className="h-4 w-4" /> Guardado
                        </span>
                      ) : <span />}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={cerrarModal}
                          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#555] hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleGuardar}
                          disabled={isPending}
                          className="flex items-center gap-2 rounded-xl bg-[#2B7A9E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#246a8a] transition-colors disabled:opacity-50"
                        >
                          {isPending
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                            : <><Save className="h-4 w-4" /> Guardar</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      )}
    </>
  )
}
