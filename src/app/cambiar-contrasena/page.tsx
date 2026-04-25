"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ConectaLogo } from "../_components/ConectaLogo"
import { Lock, Loader2, CheckCircle } from "lucide-react"

export default function CambiarContrasenaPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Cambiar contraseña
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError("Error al cambiar la contraseña. Intentá de nuevo.")
      setLoading(false)
      return
    }

    // Marcar como cambiada
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from("conecta_profiles")
        .update({ password_changed: true })
        .eq("id", user.id)
    }

    setDone(true)
    setLoading(false)

    setTimeout(() => router.push("/app/dashboard"), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F0F7FA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <ConectaLogo size="md" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-lg font-black text-[#3D3D3D]">¡Contraseña actualizada!</h2>
              <p className="text-sm text-[#888] mt-1">Redirigiendo al dashboard...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-black text-[#3D3D3D]">Cambiá tu contraseña</h1>
                <p className="text-sm text-[#888] mt-1">
                  Es tu primer ingreso. Establecé una contraseña personal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">
                    Confirmá la contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repetí la contraseña"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#2B7A9E] py-3 text-sm font-bold text-white hover:bg-[#246a8a] transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                >
                  {loading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                    : "Guardar contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
