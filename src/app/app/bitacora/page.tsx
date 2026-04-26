"use client"

import { useState, useEffect, useTransition, useRef } from "react"
import { TopBar } from "../_components/TopBar"
import {
  BookOpen, Plus, ChevronDown, Search, Loader2, Pencil,
  Trash2, X, Save, Paperclip, ExternalLink, Calendar,
  ChevronLeft, CheckCircle2, FileText
} from "lucide-react"
import {
  getGrupos, getEntradasBitacora, crearEntrada,
  actualizarEntrada, eliminarEntrada, getMyProfile
} from "./actions"

interface Grupo { id: string; nombre: string; nivel: string }
interface Entrada {
  id: string
  fecha: string
  tema: string
  desarrollo: string
  comentarios: string
  material_url: string
  created_at: string
  docente_id: string
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function formatFecha(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })
}

const EMPTY_FORM = { fecha: todayISO(), tema: "", desarrollo: "", comentarios: "", material_url: "" }

export default function BitacoraPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [grupoId, setGrupoId] = useState("")
  const [entradas, setEntradas] = useState<Entrada[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [myProfileId, setMyProfileId] = useState("")
  const [myRole, setMyRole] = useState("")

  // Editor
  const [modo, setModo] = useState<"lista" | "nuevo" | "editar" | "ver">("lista")
  const [entradaActiva, setEntradaActiva] = useState<Entrada | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  // Material upload
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadingFile, setUploadingFile] = useState(false)

  useEffect(() => {
    async function init() {
      const [gs, profile] = await Promise.all([getGrupos(), getMyProfile()])
      setGrupos(gs as Grupo[])
      setMyProfileId(profile?.id ?? "")
      setMyRole(profile?.role ?? "")
      if (gs.length > 0) setGrupoId(gs[0].id)
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (!grupoId) return
    setLoading(true)
    getEntradasBitacora(grupoId).then((data) => {
      setEntradas(data as Entrada[])
      setLoading(false)
    })
  }, [grupoId])

  function abrirNuevo() {
    setForm({ ...EMPTY_FORM, fecha: todayISO() })
    setEntradaActiva(null)
    setModo("nuevo")
  }

  function abrirEditar(e: Entrada) {
    setForm({
      fecha: e.fecha,
      tema: e.tema,
      desarrollo: e.desarrollo,
      comentarios: e.comentarios,
      material_url: e.material_url ?? "",
    })
    setEntradaActiva(e)
    setModo("editar")
  }

  function abrirVer(e: Entrada) {
    setEntradaActiva(e)
    setModo("ver")
  }

  function volver() {
    setModo("lista")
    setEntradaActiva(null)
    setSaved(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)

    const fd = new FormData()
    fd.append("file", file)

    // Upload directo vía supabase client (client-side)
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const path = `bitacora/${grupoId}/${Date.now()}.${ext}`

    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: false })
    if (error) { alert("Error al subir archivo: " + error.message); setUploadingFile(false); return }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path)
    setForm((prev) => ({ ...prev, material_url: publicUrl }))
    setUploadingFile(false)
  }

  function handleGuardar() {
    if (!form.tema.trim()) { alert("El tema es obligatorio"); return }

    startTransition(async () => {
      if (modo === "nuevo") {
        const result = await crearEntrada({ ...form, grupo_id: grupoId })
        if (result.error) { alert("Error: " + result.error); return }
        const updated = await getEntradasBitacora(grupoId)
        setEntradas(updated as Entrada[])
        setSaved(true)
        setTimeout(() => { setSaved(false); volver() }, 1500)
      } else if (modo === "editar" && entradaActiva) {
        const result = await actualizarEntrada(entradaActiva.id, form)
        if (result.error) { alert("Error: " + result.error); return }
        const updated = await getEntradasBitacora(grupoId)
        setEntradas(updated as Entrada[])
        setSaved(true)
        setTimeout(() => { setSaved(false); volver() }, 1500)
      }
    })
  }

  function handleEliminar(id: string) {
    if (!confirm("¿Eliminar esta entrada? No se puede deshacer.")) return
    startTransition(async () => {
      await eliminarEntrada(id)
      const updated = await getEntradasBitacora(grupoId)
      setEntradas(updated as Entrada[])
      if (modo !== "lista") volver()
    })
  }

  const filtered = entradas.filter((e) =>
    `${e.tema} ${e.desarrollo} ${e.comentarios}`.toLowerCase().includes(search.toLowerCase())
  )

  const puedeEditar = (e: Entrada) => myRole === "admin" || e.docente_id === myProfileId

  // ── EDITOR ──
  if (modo === "nuevo" || modo === "editar") {
    return (
      <>
        <TopBar
          title={modo === "nuevo" ? "Nueva entrada" : "Editar entrada"}
          subtitle={grupos.find((g) => g.id === grupoId)?.nombre}
        />
        <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-5">
          <button onClick={volver} className="flex items-center gap-1.5 text-sm text-[#2B7A9E] font-medium hover:underline">
            <ChevronLeft className="h-4 w-4" /> Volver
          </button>

          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            {/* Fecha */}
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">Fecha de clase</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
              />
            </div>

            {/* Tema */}
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">Tema del día <span className="text-red-400">*</span></label>
              <input
                name="tema"
                value={form.tema}
                onChange={handleChange}
                placeholder="Ej: Introducción a las fracciones"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
              />
            </div>

            {/* Desarrollo */}
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">Desarrollo de la clase</label>
              <textarea
                name="desarrollo"
                value={form.desarrollo}
                onChange={handleChange}
                rows={6}
                placeholder="Describí cómo fue el desarrollo de la clase, actividades realizadas, metodología..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] resize-none"
              />
            </div>

            {/* Comentarios */}
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">Comentarios / Observaciones</label>
              <textarea
                name="comentarios"
                value={form.comentarios}
                onChange={handleChange}
                rows={3}
                placeholder="Observaciones sobre el grupo, alumnos en particular, próximos pasos..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] resize-none"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">Material adjunto</label>
              <div className="flex gap-2 items-center">
                <input
                  name="material_url"
                  value={form.material_url}
                  onChange={handleChange}
                  placeholder="URL del material o subí un archivo"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingFile}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#555] hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                  Subir
                </button>
                <input ref={fileRef} type="file" className="hidden" onChange={handleFileUpload} />
              </div>
              {form.material_url && (
                <a href={form.material_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#2B7A9E] mt-1.5 hover:underline">
                  <ExternalLink className="h-3 w-3" /> Ver material adjunto
                </a>
              )}
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-between pt-1">
              {saved ? (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Guardado
                </span>
              ) : <span />}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={volver}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-[#555] hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors disabled:opacity-70"
                >
                  {isPending
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                    : <><Save className="h-4 w-4" /> Guardar</>}
                </button>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  // ── VISTA DETALLE ──
  if (modo === "ver" && entradaActiva) {
    return (
      <>
        <TopBar title="Detalle de entrada" subtitle={grupos.find((g) => g.id === grupoId)?.nombre} />
        <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-5">
          <div className="flex items-center justify-between">
            <button onClick={volver} className="flex items-center gap-1.5 text-sm text-[#2B7A9E] font-medium hover:underline">
              <ChevronLeft className="h-4 w-4" /> Volver
            </button>
            {puedeEditar(entradaActiva) && (
              <div className="flex gap-2">
                <button
                  onClick={() => abrirEditar(entradaActiva)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-[#555] hover:bg-gray-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  onClick={() => handleEliminar(entradaActiva.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-100 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#2B7A9E]/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-[#2B7A9E]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#3D3D3D]">{entradaActiva.tema}</h2>
                <p className="text-sm text-[#aaa] mt-0.5 capitalize">{formatFecha(entradaActiva.fecha)}</p>
              </div>
            </div>

            {entradaActiva.desarrollo && (
              <div>
                <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Desarrollo de la clase</p>
                <p className="text-sm text-[#3D3D3D] whitespace-pre-wrap leading-relaxed">{entradaActiva.desarrollo}</p>
              </div>
            )}

            {entradaActiva.comentarios && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1.5">Comentarios / Observaciones</p>
                <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{entradaActiva.comentarios}</p>
              </div>
            )}

            {entradaActiva.material_url && (
              <div>
                <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Material adjunto</p>
                <a
                  href={entradaActiva.material_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2B7A9E]/30 text-sm font-medium text-[#2B7A9E] hover:bg-[#2B7A9E]/5 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Ver material
                </a>
              </div>
            )}
          </div>
        </main>
      </>
    )
  }

  // ── LISTA ──
  return (
    <>
      <TopBar title="Bitácora de clases" subtitle="Registro del desarrollo de cada clase" />

      <main className="flex-1 p-6 space-y-5 max-w-4xl mx-auto w-full">
        {/* Controles */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap flex-1 min-w-0">
            {/* Grupo */}
            <div className="relative">
              <select
                value={grupoId}
                onChange={(e) => setGrupoId(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
              >
                {grupos.length === 0 && <option value="">Sin grupos</option>}
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>{g.nombre}{g.nivel ? ` · ${g.nivel}` : ""}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Buscador */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por tema..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
              />
            </div>
          </div>

          {(myRole === "admin" || myRole === "docente") && (
            <button
              onClick={abrirNuevo}
              className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors"
            >
              <Plus className="h-4 w-4" /> Nueva entrada
            </button>
          )}
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-[#3D3D3D]">
                {entradas.length === 0 ? "Aún no hay entradas en la bitácora" : "Sin resultados para esa búsqueda"}
              </p>
              <p className="text-xs text-[#aaa] mt-1">
                {entradas.length === 0 ? "Registrá la primera clase con el botón de arriba" : "Probá con otro término"}
              </p>
            </div>
          ) : (
            filtered.map((entrada) => (
              <div
                key={entrada.id}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#2B7A9E]/30 transition-colors cursor-pointer group"
                onClick={() => abrirVer(entrada)}
              >
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-xl bg-[#2B7A9E]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="h-4 w-4 text-[#2B7A9E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[#3D3D3D] group-hover:text-[#2B7A9E] transition-colors truncate">
                        {entrada.tema}
                      </p>
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {entrada.material_url && (
                          <a
                            href={entrada.material_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-[#aaa] hover:text-[#2B7A9E] hover:bg-[#2B7A9E]/5 transition-colors"
                            title="Ver material"
                          >
                            <Paperclip className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {puedeEditar(entrada) && (
                          <>
                            <button
                              onClick={() => abrirEditar(entrada)}
                              className="p-1.5 rounded-lg text-[#aaa] hover:text-[#2B7A9E] hover:bg-[#2B7A9E]/5 transition-colors"
                              title="Editar"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleEliminar(entrada.id)}
                              className="p-1.5 rounded-lg text-[#aaa] hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-[#aaa]" />
                      <p className="text-xs text-[#aaa] capitalize">{formatFecha(entrada.fecha)}</p>
                    </div>
                    {entrada.desarrollo && (
                      <p className="text-xs text-[#888] mt-1.5 line-clamp-2 leading-relaxed">
                        {entrada.desarrollo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-[#aaa]">
            {filtered.length} entrada{filtered.length !== 1 ? "s" : ""}{search ? ` para "${search}"` : ""}
          </p>
        )}
      </main>
    </>
  )
}
