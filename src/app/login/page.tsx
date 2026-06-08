"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ConectaLogo } from "../_components/ConectaLogo"
import { Loader2, Lock, Mail, CreditCard } from "lucide-react"
import { getEmailByDNI } from "./actions"

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isDNI = /^\d+$/.test(identifier.trim())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    let email = identifier.trim()

    if (isDNI) {
      const found = await getEmailByDNI(email)
      if (!found) {
        setError("No se encontró un usuario con ese DNI.")
        setLoading(false)
        return
      }
      email = found
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError("Credenciales incorrectas.")
      setLoading(false)
      return
    }

    router.push("/app/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#F0F7FA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <ConectaLogo size="md" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h1 className="text-xl font-black text-[#3D3D3D]">Iniciar sesión</h1>
            <p className="text-sm text-[#888] mt-1">Sistema de Gestión Educativa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">
                Email o DNI
              </label>
              <div className="relative">
                {isDNI && identifier.length > 0
                  ? <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  : <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="tu@email.com o tu DNI"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/30 focus:border-[#2B7A9E] transition-colors"
                />
              </div>
              {isDNI && identifier.length > 0 && (
                <p className="text-xs text-[#2B7A9E] mt-1">Ingresando con DNI</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Ingresando...</> : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#aaa] mt-6">
          © {new Date().getFullYear()} Conecta Educación Interactiva
        </p>
      </div>
    </div>
  )
}
