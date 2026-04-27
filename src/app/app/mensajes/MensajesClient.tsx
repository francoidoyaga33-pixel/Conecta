"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  MessageSquare, Plus, Send, Search, X, Loader2,
} from "lucide-react"
import {
  getConversaciones, getMensajes, enviarMensaje,
  getOrCreateConversacion, getUsuariosDisponibles, marcarLeido,
} from "./actions"

interface Profile {
  id: string
  nombre: string
  apellido: string
  role: string
  avatar_url: string | null
}

interface Conversacion {
  id: string
  updatedAt: string
  otrosParticipantes: Profile[]
  ultimoMensaje: { contenido: string; created_at: string; autor_id: string } | null
  noLeidos: number
}

interface Mensaje {
  id: string
  autor_id: string
  contenido: string
  leido_por: string[]
  created_at: string
}

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  docente: "Docente",
  estudiante: "Estudiante",
  tutor_padre: "Tutor / Padre",
  financiero: "Área Financiera",
}

function getInitials(p: Profile) {
  return `${p.nombre.charAt(0)}${p.apellido.charAt(0)}`
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

export function MensajesClient({ currentUser }: { currentUser: Profile }) {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [texto, setTexto] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState("")
  const [showNuevo, setShowNuevo] = useState(false)
  const [usuarios, setUsuarios] = useState<Profile[]>([])
  const [searchUsuario, setSearchUsuario] = useState("")
  const mensajesEndRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeConv = conversaciones.find((c) => c.id === activeConvId)

  const loadConversaciones = useCallback(async () => {
    const data = await getConversaciones(currentUser.id)
    setConversaciones(data as Conversacion[])
    setLoading(false)
  }, [currentUser.id])

  const loadMensajes = useCallback(
    async (convId: string) => {
      const data = await getMensajes(convId)
      setMensajes(data as Mensaje[])
      await marcarLeido(convId, currentUser.id)
      setConversaciones((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, noLeidos: 0 } : c))
      )
    },
    [currentUser.id]
  )

  useEffect(() => {
    loadConversaciones()
  }, [loadConversaciones])

  useEffect(() => {
    if (!activeConvId) return
    setLoadingMsgs(true)
    loadMensajes(activeConvId).then(() => setLoadingMsgs(false))

    pollRef.current = setInterval(() => {
      loadMensajes(activeConvId)
      loadConversaciones()
    }, 4000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [activeConvId, loadMensajes, loadConversaciones])

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes])

  async function handleSend() {
    if (!texto.trim() || !activeConvId || sending) return
    setSending(true)
    await enviarMensaje(activeConvId, currentUser.id, texto)
    setTexto("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    await loadMensajes(activeConvId)
    await loadConversaciones()
    setSending(false)
  }

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      await handleSend()
    }
  }

  async function handleNuevoChat(otroId: string) {
    setShowNuevo(false)
    setSearchUsuario("")
    const result = await getOrCreateConversacion(currentUser.id, otroId)
    if ("conversacionId" in result && result.conversacionId) {
      await loadConversaciones()
      setActiveConvId(result.conversacionId)
    }
  }

  async function openNuevo() {
    setShowNuevo(true)
    const data = await getUsuariosDisponibles(currentUser.id)
    setUsuarios(data as Profile[])
  }

  const filteredConvs = conversaciones.filter((c) => {
    const nombre = c.otrosParticipantes
      .map((p) => `${p.nombre} ${p.apellido}`)
      .join(" ")
      .toLowerCase()
    return nombre.includes(search.toLowerCase())
  })

  const filteredUsuarios = usuarios.filter((u) =>
    `${u.nombre} ${u.apellido}`.toLowerCase().includes(searchUsuario.toLowerCase())
  )

  return (
    <div className="flex h-full overflow-hidden">
      {/* Panel izquierdo — conversaciones */}
      <div className="w-72 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#3D3D3D]">Mensajes</h2>
            <button
              onClick={openNuevo}
              title="Nueva conversación"
              className="h-8 w-8 rounded-lg bg-[#2B7A9E]/10 flex items-center justify-center text-[#2B7A9E] hover:bg-[#2B7A9E]/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
            </div>
          ) : filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="h-8 w-8 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">Sin conversaciones</p>
              <button
                onClick={openNuevo}
                className="mt-3 text-xs text-[#2B7A9E] hover:underline"
              >
                Iniciar una nueva
              </button>
            </div>
          ) : (
            filteredConvs.map((conv) => {
              const otros = conv.otrosParticipantes
              const nombre = otros.map((p) => `${p.nombre} ${p.apellido}`).join(", ")
              const isActive = conv.id === activeConvId
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left border-b border-gray-50 transition-colors ${
                    isActive
                      ? "bg-[#2B7A9E]/10 border-l-2 border-l-[#2B7A9E]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0 overflow-hidden">
                    {otros[0]?.avatar_url ? (
                      <img src={otros[0].avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : otros[0] ? (
                      getInitials(otros[0])
                    ) : (
                      "?"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm truncate ${
                          conv.noLeidos > 0
                            ? "font-bold text-[#3D3D3D]"
                            : "font-medium text-[#3D3D3D]"
                        }`}
                      >
                        {nombre || "Desconocido"}
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                        {conv.ultimoMensaje
                          ? formatTime(conv.ultimoMensaje.created_at)
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-gray-400 truncate">
                        {conv.ultimoMensaje?.contenido ?? "Sin mensajes"}
                      </p>
                      {conv.noLeidos > 0 && (
                        <span className="ml-2 shrink-0 h-4 min-w-[16px] px-1 rounded-full bg-[#2B7A9E] text-white text-[10px] font-bold flex items-center justify-center">
                          {conv.noLeidos}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Panel derecho — chat */}
      {!activeConvId ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F7FA]">
          <MessageSquare className="h-12 w-12 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-400">Seleccioná una conversación</p>
          <p className="text-xs text-gray-300 mt-1">o iniciá una nueva con el botón +</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-[#F5F7FA] overflow-hidden">
          {/* Header del chat */}
          {activeConv && (
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 shrink-0">
              <div className="h-9 w-9 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0 overflow-hidden">
                {activeConv.otrosParticipantes[0]?.avatar_url ? (
                  <img
                    src={activeConv.otrosParticipantes[0].avatar_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : activeConv.otrosParticipantes[0] ? (
                  getInitials(activeConv.otrosParticipantes[0])
                ) : (
                  "?"
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#3D3D3D]">
                  {activeConv.otrosParticipantes
                    .map((p) => `${p.nombre} ${p.apellido}`)
                    .join(", ")}
                </p>
                <p className="text-xs text-gray-400">
                  {activeConv.otrosParticipantes[0]
                    ? roleLabels[activeConv.otrosParticipantes[0].role] ?? ""
                    : ""}
                </p>
              </div>
            </div>
          )}

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {loadingMsgs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
              </div>
            ) : mensajes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-sm text-gray-400">
                  Aún no hay mensajes. ¡Iniciá la conversación!
                </p>
              </div>
            ) : (
              mensajes.map((m) => {
                const isMe = m.autor_id === currentUser.id
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? "bg-[#2B7A9E] text-white rounded-br-sm"
                          : "bg-white text-[#3D3D3D] shadow-sm rounded-bl-sm"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{m.contenido}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isMe ? "text-white/60" : "text-gray-400"
                        }`}
                      >
                        {formatTime(m.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={mensajesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value)
                  e.target.style.height = "auto"
                  e.target.style.height = e.target.scrollHeight + "px"
                }}
                onKeyDown={handleKeyDown}
                placeholder="Escribí un mensaje... (Enter para enviar)"
                rows={1}
                className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 max-h-32 leading-relaxed"
              />
              <button
                onClick={handleSend}
                disabled={!texto.trim() || sending}
                className="h-10 w-10 rounded-xl bg-[#2B7A9E] flex items-center justify-center text-white hover:bg-[#2B7A9E]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nueva conversación */}
      {showNuevo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#3D3D3D]">Nueva conversación</h3>
              <button
                onClick={() => { setShowNuevo(false); setSearchUsuario("") }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 py-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={searchUsuario}
                  onChange={(e) => setSearchUsuario(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
                  autoFocus
                />
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {filteredUsuarios.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Sin resultados</p>
                ) : (
                  filteredUsuarios.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleNuevoChat(u.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="h-9 w-9 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0 overflow-hidden">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          `${u.nombre.charAt(0)}${u.apellido.charAt(0)}`
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#3D3D3D]">
                          {u.nombre} {u.apellido}
                        </p>
                        <p className="text-xs text-gray-400">
                          {roleLabels[u.role] ?? u.role}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
