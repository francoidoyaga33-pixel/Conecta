"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { Bell, Loader2, BookOpen, Briefcase, AlertTriangle } from "lucide-react"
import { getAvisos, getAvisosLeidos, marcarLeido } from "../avisos/actions"

interface TopBarProps {
  title: string
  subtitle?: string
}

type Categoria = "academico" | "administrativo" | "urgente"

interface NotifAviso {
  id: string
  titulo: string
  categoria: Categoria
  created_at: string
}

const CAT_ICON: Record<Categoria, React.ElementType> = {
  academico: BookOpen,
  administrativo: Briefcase,
  urgente: AlertTriangle,
}

const CAT_COLOR: Record<Categoria, string> = {
  academico: "text-blue-700 bg-blue-50",
  administrativo: "text-violet-700 bg-violet-50",
  urgente: "text-red-700 bg-red-50",
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

export function TopBar({ title, subtitle }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [avisos, setAvisos] = useState<NotifAviso[]>([])
  const [leidos, setLeidos] = useState<Set<string>>(new Set())
  const [, startTransition] = useTransition()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [avs, leidosArr] = await Promise.all([getAvisos(), getAvisosLeidos()])
      if (cancelled) return
      setAvisos((avs as unknown as NotifAviso[]).slice(0, 8))
      setLeidos(new Set(leidosArr))
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  function handleMarcarLeido(id: string) {
    setLeidos((prev) => { const next = new Set(Array.from(prev)); next.add(id); return next })
    startTransition(async () => { await marcarLeido(id) })
  }

  const noLeidos = avisos.filter((a) => !leidos.has(a.id)).length

  return (
    <header className="h-14 border-b border-gray-100 bg-white flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-base font-bold text-[#3D3D3D]">{title}</h1>
        {subtitle && <p className="text-xs text-[#888]">{subtitle}</p>}
      </div>

      <div className="relative" ref={panelRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative p-2 rounded-lg text-[#888] hover:bg-gray-50 hover:text-[#3D3D3D] transition-colors"
        >
          <Bell className="h-4 w-4" />
          {noLeidos > 0 && (
            <span className="absolute top-0.5 right-0.5 h-3.5 min-w-[14px] px-[3px] rounded-full bg-[#2B7A9E] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {noLeidos > 9 ? "9+" : noLeidos}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-[#3D3D3D]">Notificaciones</p>
              {noLeidos > 0 && <span className="text-[11px] text-[#2B7A9E] font-semibold">{noLeidos} sin leer</span>}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-4 w-4 animate-spin text-[#2B7A9E]" />
                </div>
              ) : avisos.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="h-6 w-6 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-[#aaa]">No hay notificaciones</p>
                </div>
              ) : (
                avisos.map((aviso) => {
                  const Icon = CAT_ICON[aviso.categoria]
                  const isLeido = leidos.has(aviso.id)
                  return (
                    <Link
                      key={aviso.id}
                      href="/app/avisos"
                      onClick={() => { if (!isLeido) handleMarcarLeido(aviso.id); setOpen(false) }}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${isLeido ? "opacity-60" : ""}`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${CAT_COLOR[aviso.categoria]}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {!isLeido && <span className="h-1.5 w-1.5 rounded-full bg-[#2B7A9E] shrink-0" />}
                          <p className="text-xs font-semibold text-[#3D3D3D] truncate">{aviso.titulo}</p>
                        </div>
                        <p className="text-[10px] text-[#aaa] mt-0.5">{timeAgo(aviso.created_at)}</p>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            <Link
              href="/app/avisos"
              onClick={() => setOpen(false)}
              className="block text-center py-2.5 text-xs font-semibold text-[#2B7A9E] hover:bg-gray-50 border-t border-gray-100 transition-colors"
            >
              Ver todos los avisos
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
