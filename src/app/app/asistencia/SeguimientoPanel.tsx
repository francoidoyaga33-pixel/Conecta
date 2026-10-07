"use client"

import { useState, useTransition } from "react"
import { AlertTriangle, CheckCircle2, Loader2, Save, UserX, X, History } from "lucide-react"
import { guardarSeguimiento, type AlertaSeguimiento, type SeguimientoCerrado } from "./actions"

function labelGrupo(g: { nombre: string; materia?: string | null; nivel?: string | null }) {
  let label = g.nombre
  if (g.materia && g.materia !== g.nombre) label += ` · ${g.materia}`
  if (g.nivel) label += ` · ${g.nivel}`
  return label
}

function fechaCorta(iso: string) {
  return new Date(iso.length === 10 ? iso + "T12:00:00" : iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })
}

function fechaLarga(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function SeguimientoPanel({
  alertas, cerrados, loading, esAdmin, onChange,
}: {
  alertas: AlertaSeguimiento[]
  cerrados: SeguimientoCerrado[]
  loading: boolean
  esAdmin: boolean
  onChange: () => Promise<void>
}) {
  const [notas, setNotas] = useState<Record<string, string>>({})
  const [guardadoKey, setGuardadoKey] = useState<string | null>(null)
  const [bajaDe, setBajaDe] = useState<AlertaSeguimiento | null>(null)
  const [motivoBaja, setMotivoBaja] = useState("")
  const [isPending, startTransition] = useTransition()

  const keyOf = (a: AlertaSeguimiento) => `${a.alumno_id}|${a.grupo_id}`
  const notaDe = (a: AlertaSeguimiento) => notas[keyOf(a)] ?? a.notas

  function ejecutar(a: AlertaSeguimiento, accion: "nota" | "resolver" | "baja", motivo?: string) {
    startTransition(async () => {
      const result = await guardarSeguimiento({
        alumno_id: a.alumno_id,
        grupo_id: a.grupo_id,
        notas: notaDe(a),
        accion,
        motivo_baja: motivo,
      })
      if (result.error) { alert("Error: " + result.error); return }
      await onChange()
      setNotas((prev) => { const next = { ...prev }; delete next[keyOf(a)]; return next })
      if (accion === "baja") { setBajaDe(null); setMotivoBaja("") }
      if (accion === "nota") {
        setGuardadoKey(keyOf(a))
        setTimeout(() => setGuardadoKey(null), 2500)
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-gray-100">
        <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {alertas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-gray-100">
          <CheckCircle2 className="h-10 w-10 text-emerald-200 mb-3" />
          <p className="text-sm font-medium text-[#3D3D3D]">No hay alumnos para seguir</p>
          <p className="text-xs text-[#aaa] mt-1">Acá van a aparecer los alumnos que acumulen 3 faltas o más</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map((a) => {
            const k = keyOf(a)
            return (
              <div key={k} className="bg-white rounded-xl border border-amber-200 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#3D3D3D]">{a.apellido}, {a.nombre}</p>
                      <p className="text-xs text-[#888]">{labelGrupo(a.grupo)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-700">
                      {a.faltas.length} falta{a.faltas.length !== 1 ? "s" : ""}
                    </span>
                    <p className="text-[11px] text-[#aaa] mt-1">
                      {a.seguimiento_id && a.created_at ? `En seguimiento desde ${fechaLarga(a.created_at)}` : "Nueva alerta"}
                    </p>
                  </div>
                </div>

                {a.faltas.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {a.faltas.map((f) => (
                      <span key={f} className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-700">{fechaCorta(f)}</span>
                    ))}
                  </div>
                )}

                <textarea
                  value={notaDe(a)}
                  onChange={(e) => setNotas((prev) => ({ ...prev, [k]: e.target.value }))}
                  placeholder="Notas del seguimiento: con quién se habló, qué se acordó..."
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 resize-y"
                />

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {guardadoKey === k
                    ? <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium"><CheckCircle2 className="h-3.5 w-3.5" /> Nota guardada</span>
                    : <span />}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => ejecutar(a, "nota")}
                      disabled={isPending}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#555] hover:bg-gray-50 disabled:opacity-60"
                    >
                      <Save className="h-3.5 w-3.5" /> Guardar nota
                    </button>
                    <button
                      onClick={() => { if (confirm("¿Marcar el seguimiento como resuelto? El contador de faltas vuelve a cero.")) ejecutar(a, "resolver") }}
                      disabled={isPending}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resuelto
                    </button>
                    {esAdmin && (
                      <button
                        onClick={() => { setBajaDe(a); setMotivoBaja("") }}
                        disabled={isPending}
                        className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        <UserX className="h-3.5 w-3.5" /> Dar de baja
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {cerrados.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <History className="h-3.5 w-3.5 text-[#888]" />
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wider">Historial</p>
          </div>
          <div className="divide-y divide-gray-50">
            {cerrados.map((s) => (
              <div key={s.id} className="px-4 py-3 space-y-1">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm font-medium text-[#3D3D3D]">
                    {s.alumno ? `${s.alumno.apellido}, ${s.alumno.nombre}` : "?"}
                    {s.grupo && <span className="text-xs font-normal text-[#888]"> · {labelGrupo(s.grupo)}</span>}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${s.estado === "baja" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {s.estado === "baja" ? "Baja" : "Resuelto"}
                    </span>
                    <span className="text-[11px] text-[#aaa]">
                      {fechaLarga(s.cerrado_at)}{s.cerrador ? ` · ${s.cerrador.nombre} ${s.cerrador.apellido}` : ""}
                    </span>
                  </div>
                </div>
                {s.motivo_baja && <p className="text-xs text-red-700"><span className="font-semibold">Motivo de la baja:</span> {s.motivo_baja}</p>}
                {s.notas && <p className="text-xs text-[#666] whitespace-pre-line">{s.notas}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {bajaDe && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !isPending && setBajaDe(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#3D3D3D]">Dar de baja</h3>
                <p className="text-xs text-[#888] mt-0.5">{bajaDe.apellido}, {bajaDe.nombre} · {labelGrupo(bajaDe.grupo)}</p>
              </div>
              <button onClick={() => setBajaDe(null)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#555]">Motivo de la baja *</label>
              <textarea
                value={motivoBaja}
                onChange={(e) => setMotivoBaja(e.target.value)}
                rows={4}
                autoFocus
                placeholder="Detallá la razón de la baja..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 resize-y"
              />
              <p className="text-[11px] text-[#aaa]">La matrícula del alumno en este grupo pasa a "Inactivo" y deja de aparecer en la asistencia.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setBajaDe(null)} disabled={isPending} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[#555] hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={() => ejecutar(bajaDe, "baja", motivoBaja)}
                disabled={isPending || !motivoBaja.trim()}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                Confirmar baja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
