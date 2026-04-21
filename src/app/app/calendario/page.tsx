"use client"

import { useState, useEffect } from "react"
import { TopBar } from "../_components/TopBar"
import {
  ChevronLeft, ChevronRight, Plus, X, Clock, FileText, Calendar,
} from "lucide-react"

type EventType = "clase" | "examen" | "reunion" | "feriado" | "otro"

interface CalendarEvent {
  id: string
  title: string
  date: string        // YYYY-MM-DD
  startTime: string   // HH:MM
  endTime: string     // HH:MM
  type: EventType
  description: string
}

const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string }> = {
  clase:   { label: "Clase",    color: "text-blue-700",   bg: "bg-blue-100" },
  examen:  { label: "Examen",   color: "text-rose-700",   bg: "bg-rose-100" },
  reunion: { label: "Reunión",  color: "text-violet-700", bg: "bg-violet-100" },
  feriado: { label: "Feriado",  color: "text-amber-700",  bg: "bg-amber-100" },
  otro:    { label: "Otro",     color: "text-gray-600",   bg: "bg-gray-100" },
}

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

const STORAGE_KEY = "conecta_calendar_events"

function loadEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveEvents(events: CalendarEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export default function CalendarioPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [form, setForm] = useState<Omit<CalendarEvent, "id">>({
    title: "",
    date: "",
    startTime: "08:00",
    endTime: "09:00",
    type: "clase",
    description: "",
  })

  useEffect(() => {
    setEvents(loadEvents())
  }, [])

  function openNewEvent(date?: string) {
    setSelectedEvent(null)
    setForm({
      title: "",
      date: date ?? formatDate(year, month, today.getDate()),
      startTime: "08:00",
      endTime: "09:00",
      type: "clase",
      description: "",
    })
    setShowModal(true)
  }

  function openEventDetail(ev: CalendarEvent) {
    setSelectedEvent(ev)
    setShowModal(true)
  }

  function handleSave() {
    if (!form.title.trim() || !form.date) return
    const next = [
      ...events,
      { ...form, id: crypto.randomUUID() },
    ]
    setEvents(next)
    saveEvents(next)
    setShowModal(false)
  }

  function handleDelete(id: string) {
    const next = events.filter((e) => e.id !== id)
    setEvents(next)
    saveEvents(next)
    setShowModal(false)
    setSelectedEvent(null)
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())

  function eventsForDay(day: number) {
    const dateStr = formatDate(year, month, day)
    return events.filter(e => e.date === dateStr)
  }

  // Upcoming events (next 7 days from today)
  const upcoming = events
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5)

  return (
    <>
      <TopBar title="Calendario" subtitle="Gestión de eventos del instituto" />

      <main className="flex-1 p-6 flex gap-6 min-h-0">
        {/* Calendar */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="text-base font-bold text-[#3D3D3D] min-w-[160px] text-center">
                  {MONTHS[month]} {year}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => openNewEvent()}
                className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nuevo evento
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS_OF_WEEK.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-[#aaa] py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
              {cells.map((day, i) => {
                if (!day) return <div key={i} className="bg-gray-50 min-h-[90px]" />
                const dateStr = formatDate(year, month, day)
                const dayEvents = eventsForDay(day)
                const isToday = dateStr === todayStr
                return (
                  <div
                    key={i}
                    onClick={() => openNewEvent(dateStr)}
                    className="bg-white min-h-[90px] p-1.5 cursor-pointer hover:bg-[#2B7A9E]/5 transition-colors group"
                  >
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold mb-1 ${
                      isToday ? "bg-[#2B7A9E] text-white" : "text-[#3D3D3D] group-hover:text-[#2B7A9E]"
                    }`}>
                      {day}
                    </span>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map(ev => (
                        <button
                          key={ev.id}
                          onClick={e => { e.stopPropagation(); openEventDetail(ev) }}
                          className={`w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded truncate ${TYPE_CONFIG[ev.type].bg} ${TYPE_CONFIG[ev.type].color}`}
                        >
                          {ev.title}
                        </button>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-[10px] text-[#aaa] px-1">+{dayEvents.length - 2} más</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar: upcoming events */}
        <div className="w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-xs font-bold text-[#3D3D3D] uppercase tracking-wider mb-3">
              Próximos eventos
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-xs text-[#aaa] text-center py-6">Sin eventos próximos</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map(ev => {
                  const cfg = TYPE_CONFIG[ev.type]
                  const [, mm, dd] = ev.date.split("-")
                  return (
                    <button
                      key={ev.id}
                      onClick={() => openEventDetail(ev)}
                      className="w-full text-left flex items-start gap-2.5 rounded-lg hover:bg-gray-50 p-2 transition-colors"
                    >
                      <div className={`h-8 w-8 rounded-lg flex flex-col items-center justify-center shrink-0 ${cfg.bg}`}>
                        <span className={`text-[10px] font-black leading-none ${cfg.color}`}>{dd}</span>
                        <span className={`text-[8px] uppercase ${cfg.color}`}>{MONTHS[parseInt(mm) - 1].slice(0, 3)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#3D3D3D] truncate">{ev.title}</p>
                        <p className="text-[10px] text-[#aaa]">{ev.startTime} – {ev.endTime}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-xs font-bold text-[#3D3D3D] uppercase tracking-wider mb-3">Tipos</h3>
            <div className="space-y-1.5">
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-sm ${cfg.bg}`} />
                  <span className="text-xs text-[#555]">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#3D3D3D]">
                <Calendar className="h-4 w-4 text-[#2B7A9E]" />
                <h3 className="text-sm font-bold">
                  {selectedEvent ? selectedEvent.title : "Nuevo evento"}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedEvent ? (
              /* Detail view */
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_CONFIG[selectedEvent.type].bg} ${TYPE_CONFIG[selectedEvent.type].color}`}>
                    {TYPE_CONFIG[selectedEvent.type].label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#555]">
                  <Calendar className="h-4 w-4 text-[#aaa]" />
                  {selectedEvent.date.split("-").reverse().join("/")}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#555]">
                  <Clock className="h-4 w-4 text-[#aaa]" />
                  {selectedEvent.startTime} – {selectedEvent.endTime}
                </div>
                {selectedEvent.description && (
                  <div className="flex items-start gap-2 text-sm text-[#555]">
                    <FileText className="h-4 w-4 text-[#aaa] mt-0.5" />
                    <p>{selectedEvent.description}</p>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(selectedEvent.id)}
                  className="w-full mt-2 rounded-xl border border-rose-200 text-rose-600 py-2.5 text-sm font-semibold hover:bg-rose-50 transition-colors"
                >
                  Eliminar evento
                </button>
              </div>
            ) : (
              /* Create form */
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Título *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
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
                        onClick={() => setForm(f => ({ ...f, type: t }))}
                        className={`rounded-lg py-1.5 text-[10px] font-semibold transition-colors ${
                          form.type === t
                            ? `${TYPE_CONFIG[t].bg} ${TYPE_CONFIG[t].color} ring-2 ring-offset-1 ring-[#2B7A9E]/30`
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {TYPE_CONFIG[t].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Fecha *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#555] mb-1.5">Inicio</label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#555] mb-1.5">Fin</label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Descripción (opcional)</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Detalles del evento..."
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={!form.title.trim() || !form.date}
                  className="w-full rounded-xl bg-[#2B7A9E] py-3 text-sm font-bold text-white hover:bg-[#246a8a] transition-colors disabled:opacity-40"
                >
                  Guardar evento
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
