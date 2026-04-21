"use client"

import { useState } from "react"
import { TopBar } from "../../_components/TopBar"
import {
  Plus, Search, UserCheck, UserX,
  Pencil, Trash2, X, Loader2, Shield, BookOpen,
  GraduationCap, Users, DollarSign
} from "lucide-react"

type Role = "admin" | "docente" | "estudiante" | "tutor_padre" | "financiero"

interface ConectaUser {
  id: string
  nombre: string
  apellido: string
  email: string
  role: Role
  activo: boolean
  created_at: string
}

// TODO: reemplazar con datos reales de conecta_profiles
const MOCK_USERS: ConectaUser[] = []

const ROLE_CONFIG: Record<Role, { label: string; icon: React.ElementType; color: string }> = {
  admin:       { label: "Administrador",   icon: Shield,        color: "bg-violet-100 text-violet-700" },
  docente:     { label: "Docente",         icon: BookOpen,      color: "bg-blue-100 text-blue-700" },
  estudiante:  { label: "Estudiante",      icon: GraduationCap, color: "bg-emerald-100 text-emerald-700" },
  tutor_padre: { label: "Tutor / Padre",   icon: Users,         color: "bg-amber-100 text-amber-700" },
  financiero:  { label: "Área Financiera", icon: DollarSign,    color: "bg-rose-100 text-rose-700" },
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<ConectaUser[]>(MOCK_USERS)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "todos">("todos")
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState<ConectaUser | null>(null)

  const filtered = users.filter((u) => {
    const matchSearch = `${u.nombre} ${u.apellido} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchRole = roleFilter === "todos" || u.role === roleFilter
    return matchSearch && matchRole
  })

  function handleToggleActive(userId: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, activo: !u.activo } : u))
    )
    // TODO: update en conecta_profiles
  }

  function handleDelete(userId: string) {
    if (!confirm("¿Eliminar este usuario?")) return
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    // TODO: delete en conecta_profiles + auth.users
  }

  function handleSave(user: Omit<ConectaUser, "id" | "created_at" | "activo">) {
    if (editUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...user } : u))
      )
      // TODO: update conecta_profiles
    } else {
      const newUser: ConectaUser = {
        ...user,
        id: crypto.randomUUID(),
        activo: true,
        created_at: new Date().toISOString(),
      }
      setUsers((prev) => [newUser, ...prev])
      // TODO: crear en Supabase auth + insertar en conecta_profiles
    }
    setShowModal(false)
    setEditUser(null)
  }

  return (
    <>
      <TopBar title="Gestión de Usuarios" subtitle="Administrá los usuarios del sistema" />

      <main className="flex-1 p-6 space-y-4">
        {/* Actions bar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-1 min-w-0">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
              />
            </div>

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | "todos")}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
            >
              <option value="todos">Todos los roles</option>
              {(Object.keys(ROLE_CONFIG) as Role[]).map((r) => (
                <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { setEditUser(null); setShowModal(true) }}
            className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo usuario
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-[#3D3D3D]">
                {users.length === 0 ? "Aún no hay usuarios en el sistema" : "Sin resultados"}
              </p>
              <p className="text-xs text-[#aaa] mt-1">
                {users.length === 0
                  ? "Creá el primer usuario con el botón de arriba"
                  : "Probá con otro filtro o término de búsqueda"}
              </p>
              {users.length === 0 && (
                <button
                  onClick={() => { setEditUser(null); setShowModal(true) }}
                  className="mt-4 flex items-center gap-1.5 rounded-lg bg-[#2B7A9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Crear primer usuario
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Rol</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider hidden md:table-cell">Alta</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const roleConf = ROLE_CONFIG[user.role]
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#2B7A9E]/10 flex items-center justify-center text-xs font-bold text-[#2B7A9E] shrink-0">
                            {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#3D3D3D]">{user.nombre} {user.apellido}</p>
                            <p className="text-xs text-[#aaa]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${roleConf.color}`}>
                          <roleConf.icon className="h-3 w-3" />
                          {roleConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#aaa] hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.activo ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"
                        }`}>
                          {user.activo ? <><UserCheck className="h-3 w-3" /> Activo</> : <><UserX className="h-3 w-3" /> Inactivo</>}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => { setEditUser(user); setShowModal(true) }}
                            className="p-1.5 rounded-lg text-[#aaa] hover:text-[#2B7A9E] hover:bg-[#2B7A9E]/10 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(user.id)}
                            className="p-1.5 rounded-lg text-[#aaa] hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title={user.activo ? "Desactivar" : "Activar"}
                          >
                            {user.activo ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 rounded-lg text-[#aaa] hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary */}
        {users.length > 0 && (
          <p className="text-xs text-[#aaa]">
            {filtered.length} de {users.length} usuario{users.length !== 1 ? "s" : ""}
          </p>
        )}
      </main>

      {showModal && (
        <UserModal
          user={editUser}
          onClose={() => { setShowModal(false); setEditUser(null) }}
          onSave={handleSave}
        />
      )}
    </>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

function UserModal({
  user,
  onClose,
  onSave,
}: {
  user: ConectaUser | null
  onClose: () => void
  onSave: (data: Omit<ConectaUser, "id" | "created_at" | "activo">) => void
}) {
  const [form, setForm] = useState({
    nombre: user?.nombre ?? "",
    apellido: user?.apellido ?? "",
    email: user?.email ?? "",
    role: user?.role ?? ("docente" as Role),
    password: "",
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate async save; TODO: real Supabase call
    await new Promise((r) => setTimeout(r, 600))
    onSave({ nombre: form.nombre, apellido: form.apellido, email: form.email, role: form.role as Role })
    setLoading(false)
  }

  const isEdit = !!user

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#3D3D3D]">
            {isEdit ? "Editar usuario" : "Nuevo usuario"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-[#aaa] hover:text-[#3D3D3D]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "nombre", label: "Nombre", placeholder: "Juan" },
              { name: "apellido", label: "Apellido", placeholder: "García" },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">{label}</label>
                <input
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@conecta.edu"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1.5">Rol</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
            >
              {(Object.keys(ROLE_CONFIG) as Role[]).map((r) => (
                <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
              ))}
            </select>
          </div>

          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">
                Contraseña temporal
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required={!isEdit}
                minLength={6}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
              />
              <p className="text-xs text-[#aaa] mt-1">El usuario podrá cambiarla al ingresar.</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-[#555] hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-[#2B7A9E] py-2.5 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : isEdit ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
