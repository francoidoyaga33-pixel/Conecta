"use client"

import { useState, useEffect, useRef } from "react"
import { TopBar } from "../_components/TopBar"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Camera, User, Mail, Shield, CheckCircle } from "lucide-react"

const ROLE_LABELS: Record<string, string> = {
  admin:       "Administrador",
  docente:     "Docente",
  estudiante:  "Estudiante",
  tutor_padre: "Tutor / Padre",
  financiero:  "Área Financiera",
}

interface Profile {
  id: string
  nombre: string
  apellido: string
  email: string
  role: string
  activo: boolean
  avatar_url: string | null
  created_at: string
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function loadProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("conecta_profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    setProfile(data)
    setLoading(false)
  }

  useEffect(() => { loadProfile() }, [])

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setUploading(true)
    const supabase = createClient()

    const ext = file.name.split(".").pop()
    const path = `${profile.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true })

    if (uploadError) {
      alert("Error al subir la imagen.")
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(path)

    await supabase
      .from("conecta_profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", profile.id)

    setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : prev)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setUploading(false)
  }

  if (loading) {
    return (
      <>
        <TopBar title="Mi perfil" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#2B7A9E]" />
        </main>
      </>
    )
  }

  if (!profile) return null

  const initials = `${profile.nombre.charAt(0)}${profile.apellido.charAt(0)}`.toUpperCase()

  return (
    <>
      <TopBar title="Mi perfil" subtitle="Tu información personal" />

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-6">

        {/* Avatar */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center gap-4">
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.nombre}
                className="h-24 w-24 rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-2xl font-black text-[#2B7A9E]">
                {initials}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#2B7A9E] flex items-center justify-center text-white hover:bg-[#246a8a] transition-colors shadow-md disabled:opacity-60"
            >
              {uploading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Camera className="h-4 w-4" />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="text-center">
            <p className="text-lg font-black text-[#3D3D3D]">{profile.nombre} {profile.apellido}</p>
            <p className="text-sm text-[#2B7A9E] font-medium">{ROLE_LABELS[profile.role] ?? profile.role}</p>
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Foto actualizada
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#3D3D3D]">Datos de la cuenta</h2>

          {[
            { icon: User, label: "Nombre completo", value: `${profile.nombre} ${profile.apellido}` },
            { icon: Mail, label: "Correo electrónico", value: profile.email },
            { icon: Shield, label: "Rol", value: ROLE_LABELS[profile.role] ?? profile.role },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <div className="h-9 w-9 rounded-lg bg-[#2B7A9E]/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-[#2B7A9E]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#aaa] uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-[#3D3D3D] mt-0.5">{value}</p>
              </div>
            </div>
          ))}

          <div className="pt-1">
            <p className="text-xs text-[#aaa]">
              Miembro desde {new Date(profile.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

      </main>
    </>
  )
}
