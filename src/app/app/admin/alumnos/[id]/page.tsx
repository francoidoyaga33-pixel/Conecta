"use client"

import { useState, useEffect, useTransition } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { TopBar } from "../../../_components/TopBar"
import {
  ChevronLeft, Loader2, Save, CheckCircle2, Plus, X,
  User, Heart, Users, BookOpen, AlertCircle, UserCheck, UserX,
  Pencil, Trash2, GraduationCap, Camera,
} from "lucide-react"
import {
  getAlumnoConLegajo, guardarLegajo, getGrupos,
  crearMatricula, actualizarEstadoMatricula, eliminarMatricula, actualizarAvatarUrl,
} from "../actions"
import { createClient } from "@/lib/supabase/client"

interface Profile { id: string; nombre: string; apellido: string; email: string; activo: boolean; created_at: string; avatar_url: string | null }
interface Legajo {
  fecha_nacimiento: string | null; dni: string | null; cuil: string | null
  direccion: string | null; localidad: string | null; telefono: string | null
  nombre_padre: string | null; telefono_padre: string | null; email_padre: string | null
  nombre_madre: string | null; telefono_madre: string | null; email_madre: string | null
  enfermedades: string | null; medicacion: string | null
  autorizados: string | null; observaciones: string | null
}
interface Matricula {
  id: string; estado: string; ciclo_lectivo: number
  fecha_inicio: string | null; fecha_fin: string | null; observaciones: string | null
  conecta_grupos: { id: string; nombre: string; nivel: string } | null
}
interface Grupo { id: string; nombre: string; nivel: string }

const ESTADO_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  habilitado: { label: "Habilitado", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: UserCheck },
  inactivo:   { label: "Inactivo",   color: "text-gray-500",    bg: "bg-gray-100 border-gray-200",      icon: UserX },
  suspenso:   { label: "Suspenso",   color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",     icon: AlertCircle },
}

const EMPTY_LEGAJO: Legajo = {
  fecha_nacimiento: "", dni: "", cuil: "", direccion: "", localidad: "", telefono: "",
  nombre_padre: "", telefono_padre: "", email_padre: "",
  nombre_madre: "", telefono_madre: "", email_madre: "",
  enfermedades: "", medicacion: "", autorizados: "", observaciones: "",
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-[#aaa] uppercase tracking-wider mb-1">{label}</label>
      <p className="text-sm text-[#3D3D3D]">{value || <span className="text-[#ccc]">—</span>}</p>
    </div>
  )
}

function Input({ label, name, value, onChange, type = "text", placeholder = "" }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#555] mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E]"
      />
    </div>
  )
}

function Textarea({ label, name, value, onChange, placeholder = "" }: {
  label: string; name: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#555] mb-1.5">{label}</label>
      <textarea
        name={name} value={value} onChange={onChange} rows={2} placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] resize-none"
      />
    </div>
  )
}

export default function LegajoPage() {
  const { id } = useParams<{ id: string }>()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [legajo, setLegajo] = useState<Legajo | null>(null)
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loading, setLoading] = useState(true)

  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState<Legajo>(EMPTY_LEGAJO)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Modal matrícula
  const [showMatModal, setShowMatModal] = useState(false)
  const [matForm, setMatForm] = useState({ grupo_id: "", estado: "habilitado", ciclo_lectivo: new Date().getFullYear(), fecha_inicio: new Date().toISOString().slice(0, 10), observaciones: "" })
  const [editMatricula, setEditMatricula] = useState<Matricula | null>(null)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const path = `students/${id}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true })
    if (uploadError) {
      alert("Error al subir imagen: " + uploadError.message)
      setUploadingAvatar(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path)
    const result = await actualizarAvatarUrl(id, publicUrl)
    if (result.error) alert("Error: " + result.error)
    else await loadData()
    setUploadingAvatar(false)
    e.target.value = ""
  }

  async function loadData() {
    const [data, gs] = await Promise.all([
      getAlumnoConLegajo(id),
      getGrupos(),
    ])
    setProfile(data.profile as Profile)
    setLegajo(data.legajo as Legajo | null)
    setMatriculas(data.matriculas as unknown as Matricula[])
    setGrupos(gs as Grupo[])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function startEdit() {
    setForm({
      fecha_nacimiento: legajo?.fecha_nacimiento ?? "",
      dni: legajo?.dni ?? "",
      cuil: legajo?.cuil ?? "",
      direccion: legajo?.direccion ?? "",
      localidad: legajo?.localidad ?? "",
      telefono: legajo?.telefono ?? "",
      nombre_padre: legajo?.nombre_padre ?? "",
      telefono_padre: legajo?.telefono_padre ?? "",
      email_padre: legajo?.email_padre ?? "",
      nombre_madre: legajo?.nombre_madre ?? "",
      telefono_madre: legajo?.telefono_madre ?? "",
      email_madre: legajo?.email_madre ?? "",
      enfermedades: legajo?.enfermedades ?? "",
      medicacion: legajo?.medicacion ?? "",
      autorizados: legajo?.autorizados ?? "",
      observaciones: legajo?.observaciones ?? "",
    })
    setEditando(true)
  }

  function handleGuardar() {
    startTransition(async () => {
      const result = await guardarLegajo(id, {
        fecha_nacimiento: form.fecha_nacimiento ?? "",
        dni: form.dni ?? "",
        cuil: form.cuil ?? "",
        direccion: form.direccion ?? "",
        localidad: form.localidad ?? "",
        telefono: form.telefono ?? "",
        nombre_padre: form.nombre_padre ?? "",
        telefono_padre: form.telefono_padre ?? "",
        email_padre: form.email_padre ?? "",
        nombre_madre: form.nombre_madre ?? "",
        telefono_madre: form.telefono_madre ?? "",
        email_madre: form.email_madre ?? "",
        enfermedades: form.enfermedades ?? "",
        medicacion: form.medicacion ?? "",
        autorizados: form.autorizados ?? "",
        observaciones: form.observaciones ?? "",
      })
      if (result.error) { alert("Error: " + result.error); return }
      setSaved(true)
      await loadData()
      setTimeout(() => { setSaved(false); setEditando(false) }, 1200)
    })
  }

  function handleMatChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setMatForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function abrirNuevaMatricula() {
    setEditMatricula(null)
    setMatForm({ grupo_id: grupos[0]?.id ?? "", estado: "habilitado", ciclo_lectivo: new Date().getFullYear(), fecha_inicio: new Date().toISOString().slice(0, 10), observaciones: "" })
    setShowMatModal(true)
  }

  function abrirEditarMatricula(m: Matricula) {
    setEditMatricula(m)
    setMatForm({ grupo_id: m.conecta_grupos?.id ?? "", estado: m.estado, ciclo_lectivo: m.ciclo_lectivo, fecha_inicio: m.fecha_inicio ?? "", observaciones: m.observaciones ?? "" })
    setShowMatModal(true)
  }

  function handleGuardarMatricula() {
    startTransition(async () => {
      let result
      if (editMatricula) {
        result = await actualizarEstadoMatricula(editMatricula.id, matForm.estado, matForm.observaciones)
      } else {
        result = await crearMatricula({ alumno_id: id, ...matForm })
      }
      if (result.error) { alert("Error: " + result.error); return }
      setShowMatModal(false)
      await loadData()
    })
  }

  function handleEliminarMatricula(matriculaId: string) {
    if (!confirm("¿Eliminar esta matrícula?")) return
    startTransition(async () => {
      await eliminarMatricula(matriculaId, id)
      await loadData()
    })
  }

  if (loading) {
    return (
      <>
        <TopBar title="Legajo del alumno" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#2B7A9E]" />
        </main>
      </>
    )
  }

  if (!profile) return null

  const initials = `${profile.nombre.charAt(0)}${profile.apellido.charAt(0)}`

  return (
    <>
      <TopBar title="Legajo del alumno" subtitle={`${profile.apellido}, ${profile.nombre}`} />

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-5">

        <Link href="/app/admin/alumnos" className="flex items-center gap-1.5 text-sm text-[#2B7A9E] font-medium hover:underline">
          <ChevronLeft className="h-4 w-4" /> Volver a alumnos
        </Link>

        {/* Header alumno */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <label className="relative h-14 w-14 rounded-full shrink-0 cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
            />
            <div className="h-14 w-14 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xl font-black text-[#2B7A9E] overflow-hidden">
              {uploadingAvatar
                ? <Loader2 className="h-5 w-5 animate-spin text-[#2B7A9E]" />
                : profile.avatar_url
                ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                : initials}
            </div>
            {!uploadingAvatar && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </div>
            )}
          </label>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black text-[#3D3D3D]">{profile.apellido}, {profile.nombre}</p>
            <p className="text-sm text-[#aaa]">{profile.email}</p>
            <p className="text-xs text-[#bbb] mt-0.5">
              Miembro desde {new Date(profile.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* ── MATRÍCULAS ── */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-[#2B7A9E]" />
              <h2 className="text-sm font-bold text-[#3D3D3D]">Matrículas</h2>
            </div>
            <button
              onClick={abrirNuevaMatricula}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#2B7A9E] hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> Agregar
            </button>
          </div>

          {matriculas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BookOpen className="h-8 w-8 text-gray-200 mb-2" />
              <p className="text-sm text-[#aaa]">Sin matrículas registradas</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {matriculas.map(m => {
                const cfg = ESTADO_CONFIG[m.estado] ?? ESTADO_CONFIG.inactivo
                const Icon = cfg.icon
                return (
                  <div key={m.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#3D3D3D]">
                        {m.conecta_grupos?.nombre ?? "Grupo eliminado"}
                        {m.conecta_grupos?.nivel ? <span className="text-[#aaa] font-normal"> · {m.conecta_grupos.nivel}</span> : null}
                      </p>
                      <p className="text-xs text-[#bbb]">Ciclo {m.ciclo_lectivo}{m.fecha_inicio ? ` · Desde ${new Date(m.fecha_inicio + "T12:00:00").toLocaleDateString("es-AR")}` : ""}</p>
                      {m.observaciones && <p className="text-xs text-[#888] mt-0.5 italic">{m.observaciones}</p>}
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
                      <Icon className="h-3 w-3" /> {cfg.label}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => abrirEditarMatricula(m)} className="p-1.5 rounded-lg text-[#aaa] hover:text-[#2B7A9E] hover:bg-[#2B7A9E]/5 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleEliminarMatricula(m.id)} className="p-1.5 rounded-lg text-[#aaa] hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── LEGAJO DIGITAL ── */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#2B7A9E]" />
              <h2 className="text-sm font-bold text-[#3D3D3D]">Datos personales</h2>
            </div>
            {!editando && (
              <button onClick={startEdit} className="flex items-center gap-1.5 text-xs font-semibold text-[#2B7A9E] hover:underline">
                <Pencil className="h-3.5 w-3.5" /> Editar
              </button>
            )}
          </div>

          {editando ? (
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Fecha de nacimiento" name="fecha_nacimiento" value={form.fecha_nacimiento ?? ""} onChange={handleChange} type="date" />
                <Input label="DNI" name="dni" value={form.dni ?? ""} onChange={handleChange} placeholder="12345678" />
                <Input label="CUIL" name="cuil" value={form.cuil ?? ""} onChange={handleChange} placeholder="20-12345678-9" />
                <Input label="Teléfono" name="telefono" value={form.telefono ?? ""} onChange={handleChange} placeholder="+54 9 11 1234-5678" />
                <Input label="Dirección" name="direccion" value={form.direccion ?? ""} onChange={handleChange} placeholder="Av. Corrientes 1234" />
                <Input label="Localidad" name="localidad" value={form.localidad ?? ""} onChange={handleChange} placeholder="Buenos Aires" />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-[#3D3D3D] mb-3 flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-[#2B7A9E]" /> Datos familiares</p>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Nombre del padre" name="nombre_padre" value={form.nombre_padre ?? ""} onChange={handleChange} />
                  <Input label="Teléfono del padre" name="telefono_padre" value={form.telefono_padre ?? ""} onChange={handleChange} />
                  <Input label="Email del padre" name="email_padre" value={form.email_padre ?? ""} onChange={handleChange} type="email" />
                  <Input label="Nombre de la madre" name="nombre_madre" value={form.nombre_madre ?? ""} onChange={handleChange} />
                  <Input label="Teléfono de la madre" name="telefono_madre" value={form.telefono_madre ?? ""} onChange={handleChange} />
                  <Input label="Email de la madre" name="email_madre" value={form.email_madre ?? ""} onChange={handleChange} type="email" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-[#3D3D3D] mb-3 flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-[#2B7A9E]" /> Salud y autorizados</p>
                <div className="grid grid-cols-2 gap-4">
                  <Textarea label="Enfermedades / Condiciones" name="enfermedades" value={form.enfermedades ?? ""} onChange={handleChange} placeholder="Ej: Asma, alergia al maní..." />
                  <Textarea label="Medicación" name="medicacion" value={form.medicacion ?? ""} onChange={handleChange} placeholder="Ej: Ventolín, insulina..." />
                  <Textarea label="Autorizados a retirar" name="autorizados" value={form.autorizados ?? ""} onChange={handleChange} placeholder="Ej: María García (tía) - 11 1234-5678" />
                  <Textarea label="Observaciones generales" name="observaciones" value={form.observaciones ?? ""} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                {saved
                  ? <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium"><CheckCircle2 className="h-4 w-4" /> Guardado</span>
                  : <span />}
                <div className="flex gap-2">
                  <button onClick={() => setEditando(false)} className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-[#555] hover:bg-gray-50">Cancelar</button>
                  <button onClick={handleGuardar} disabled={isPending} className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] disabled:opacity-70">
                    {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : <><Save className="h-4 w-4" /> Guardar</>}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {!legajo ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="h-8 w-8 text-gray-200 mb-2" />
                  <p className="text-sm text-[#aaa]">Legajo vacío</p>
                  <button onClick={startEdit} className="mt-3 text-sm text-[#2B7A9E] font-medium hover:underline">Completar legajo</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    <Field label="Fecha de nacimiento" value={legajo.fecha_nacimiento ? new Date(legajo.fecha_nacimiento + "T12:00:00").toLocaleDateString("es-AR") : null} />
                    <Field label="DNI" value={legajo.dni} />
                    <Field label="CUIL" value={legajo.cuil} />
                    <Field label="Teléfono" value={legajo.telefono} />
                    <Field label="Dirección" value={legajo.direccion} />
                    <Field label="Localidad" value={legajo.localidad} />
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold text-[#3D3D3D] mb-3 flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-[#2B7A9E]" /> Datos familiares</p>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                      <Field label="Padre" value={legajo.nombre_padre} />
                      <Field label="Tel. padre" value={legajo.telefono_padre} />
                      <Field label="Email padre" value={legajo.email_padre} />
                      <Field label="Madre" value={legajo.nombre_madre} />
                      <Field label="Tel. madre" value={legajo.telefono_madre} />
                      <Field label="Email madre" value={legajo.email_madre} />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold text-[#3D3D3D] mb-3 flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-[#2B7A9E]" /> Salud y autorizados</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <Field label="Enfermedades / Condiciones" value={legajo.enfermedades} />
                      <Field label="Medicación" value={legajo.medicacion} />
                      <Field label="Autorizados a retirar" value={legajo.autorizados} />
                      <Field label="Observaciones" value={legajo.observaciones} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal matrícula */}
      {showMatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setShowMatModal(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#3D3D3D]">{editMatricula ? "Editar matrícula" : "Nueva matrícula"}</h2>
              <button onClick={() => setShowMatModal(false)} className="p-1 rounded-lg text-[#aaa] hover:text-[#3D3D3D]"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-4">
              {!editMatricula && (
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Curso / Grupo</label>
                  <select name="grupo_id" value={matForm.grupo_id} onChange={handleMatChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20">
                    {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}{g.nivel ? ` · ${g.nivel}` : ""}</option>)}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Estado</label>
                  <select name="estado" value={matForm.estado} onChange={handleMatChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20">
                    <option value="habilitado">Habilitado</option>
                    <option value="suspenso">Suspenso</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                {!editMatricula && (
                  <div>
                    <label className="block text-xs font-semibold text-[#555] mb-1.5">Ciclo lectivo</label>
                    <input type="number" name="ciclo_lectivo" value={matForm.ciclo_lectivo} onChange={handleMatChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20" />
                  </div>
                )}
              </div>
              {!editMatricula && (
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Fecha de inicio</label>
                  <input type="date" name="fecha_inicio" value={matForm.fecha_inicio} onChange={handleMatChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Observaciones</label>
                <textarea name="observaciones" value={matForm.observaciones} onChange={e => setMatForm(p => ({ ...p, observaciones: e.target.value }))} rows={2}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 resize-none" />
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowMatModal(false)} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-[#555] hover:bg-gray-50">Cancelar</button>
                <button onClick={handleGuardarMatricula} disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#2B7A9E] py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] disabled:opacity-70">
                  {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
