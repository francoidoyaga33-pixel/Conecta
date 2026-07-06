"use client"

import { useState, useEffect, useTransition } from "react"
import { TopBar } from "../../_components/TopBar"
import {
  Plus, Search, UserCheck, UserX,
  Trash2, X, Loader2, Shield, BookOpen,
  GraduationCap, Users, DollarSign, KeyRound, CreditCard, Mail, ClipboardList
} from "lucide-react"
import { getUsuarios, createUsuario, toggleUsuarioActivo, deleteUsuario, changePassword, getMyRole, getAuditLog } from "./actions"

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

const ROLE_CONFIG: Record<Role, { label: string; icon: React.ElementType; color: string }> = {
  admin:       { label: "Administrador",   icon: Shield,        color: "bg-violet-100 text-violet-700" },
  docente:     { label: "Docente",         icon: BookOpen,      color: "bg-blue-100 text-blue-700" },
  estudiante:  { label: "Estudiante",      icon: GraduationCap, color: "bg-emerald-100 text-emerald-700" },
  tutor_padre: { label: "Tutor / Padre",   icon: Users,         color: "bg-amber-100 text-amber-700" },
  financiero:  { label: "Área Financiera", icon: DollarSign,    color: "bg-rose-100 text-rose-700" },
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<ConectaUser[]>([])
  const [loading, setLoading] = useState(true)
  const [myRole, setMyRole] = useState<string>("")
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "todos">("todos")
  const [showModal, setShowModal] = useState(false)
  const [passwordTarget, setPasswordTarget] = useState<ConectaUser | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [showAudit, setShowAudit] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const isAdmin = myRole === "admin"
  const allowedRoles = isAdmin
    ? (Object.keys(ROLE_CONFIG) as Role[])
    : (["estudiante"] as Role[])

  async function loadUsers() {
    setLoading(true)
    const [{ users }, role] = await Promise.all([getUsuarios(), getMyRole()])
    setUsers(users as ConectaUser[])
    setMyRole(role)
    if (role === "admin") {
      const log = await getAuditLog()
      setAuditLog(log as any[])
    }
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = users.filter((u) => {
    const matchSearch = `${u.nombre} ${u.apellido} ${u.email}`
      .toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "todos" || u.role === roleFilter
    return matchSearch && matchRole
  })

  function handleToggleActive(userId: string, activo: boolean) {
    startTransition(async () => {
      await toggleUsuarioActivo(userId, !activo)
      await loadUsers()
    })
  }

  async function handleDelete(userId: string) {
    setDeleteError(null)
    setIsDeleting(true)
    setConfirmingId(null)
    try {
      const result = await deleteUsuario(userId)
      if (result?.error) {
        setDeleteError(result.error)
      } else {
        await loadUsers()
      }
    } catch (e) {
      setDeleteError("Excepción: " + String(e))
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleChangePassword(userId: string, newPassword: string) {
    const result = await changePassword(userId, newPassword)
    if (result.error) {
      alert("Error: " + result.error)
      return
    }
    setPasswordTarget(null)
  }

  async function handleSave(data: { nombre: string; apellido: string; email: string; role: string; password: string; loginMethod: "email" | "dni"; dni?: string }) {
    const result = await createUsuario(data)
    if (result.error) {
      alert("Error: " + result.error)
      return
    }
    setShowModal(false)
    await loadUsers()
  }

  return (
    <>
      <TopBar title="Gestión de Usuarios" subtitle="Administrá los usuarios del sistema" />

      <main className="flex-1 p-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-1 min-w-0">
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
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[#2B7A9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#246a8a] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo usuario
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#2B7A9E]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-[#3D3D3D]">
                {users.length === 0 ? "Aún no hay usuarios en el sistema" : "Sin resultados"}
              </p>
              <p className="text-xs text-[#aaa] mt-1">
                {users.length === 0 ? "Creá el primer usuario con el botón de arriba" : "Probá con otro filtro"}
              </p>
              {users.length === 0 && (
                <button
                  onClick={() => setShowModal(true)}
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
                            {user.email.includes("@dni.conecta")
                              ? <span className="inline-flex items-center gap-1 text-xs text-[#2B7A9E]"><CreditCard className="h-3 w-3" /> DNI: {user.email.split("@")[0]}</span>
                              : <p className="text-xs text-[#aaa]">{user.email}</p>
                            }
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
                          {user.activo
                            ? <><UserCheck className="h-3 w-3" /> Activo</>
                            : <><UserX className="h-3 w-3" /> Inactivo</>}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          {confirmingId === user.id ? (
                            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                              <span className="text-xs text-red-600 font-medium whitespace-nowrap">¿Eliminar?</span>
                              <button
                                onClick={() => handleDelete(user.id)}
                                disabled={isDeleting}
                                className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded px-2 py-0.5 disabled:opacity-50"
                              >
                                {isDeleting ? "..." : "Sí"}
                              </button>
                              <button
                                onClick={() => setConfirmingId(null)}
                                className="text-xs font-bold text-[#555] hover:text-[#333] rounded px-2 py-0.5"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => setPasswordTarget(user)}
                                disabled={isDeleting}
                                className="p-1.5 rounded-lg text-[#aaa] hover:text-[#2B7A9E] hover:bg-[#2B7A9E]/10 transition-colors disabled:opacity-40"
                                title="Cambiar contraseña"
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleActive(user.id, user.activo)}
                                disabled={isDeleting}
                                className="p-1.5 rounded-lg text-[#aaa] hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-40"
                                title={user.activo ? "Desactivar" : "Activar"}
                              >
                                {user.activo ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                              </button>
                              <button
                                onClick={() => setConfirmingId(user.id)}
                                disabled={isDeleting}
                                className="p-1.5 rounded-lg text-[#aaa] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {users.length > 0 && (
          <p className="text-xs text-[#aaa]">
            {filtered.length} de {users.length} usuario{users.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Registro de auditoría — solo admins */}
        {isAdmin && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowAudit(v => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[#2B7A9E]" />
                <span className="text-sm font-bold text-[#3D3D3D]">Registro de actividad</span>
                {auditLog.length > 0 && (
                  <span className="text-xs bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">{auditLog.length}</span>
                )}
              </div>
              <span className="text-xs text-[#aaa]">{showAudit ? "Ocultar" : "Ver"}</span>
            </button>

            {showAudit && (
              auditLog.length === 0 ? (
                <p className="text-sm text-[#aaa] text-center py-8 border-t border-gray-100">Sin registros de actividad</p>
              ) : (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {auditLog.map((entry: any) => {
                    const quien = entry.autor
                      ? `${entry.autor.nombre} ${entry.autor.apellido}`
                      : "Desconocido"
                    return (
                      <div key={entry.id} className="px-5 py-3 flex items-start gap-3">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${entry.accion === "CREAR_USUARIO" ? "bg-emerald-50" : "bg-red-50"}`}>
                          {entry.accion === "CREAR_USUARIO"
                            ? <Plus className="h-3.5 w-3.5 text-emerald-600" />
                            : <Trash2 className="h-3.5 w-3.5 text-red-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#3D3D3D]">{entry.descripcion}</p>
                          <p className="text-xs text-[#aaa] mt-0.5">
                            Por <span className="font-medium">{quien}</span> · {new Date(entry.created_at).toLocaleString("es-AR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </div>
        )}
      </main>

      {showModal && (
        <UserModal
          allowedRoles={allowedRoles}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {passwordTarget && (
        <ChangePasswordModal
          user={passwordTarget}
          onClose={() => setPasswordTarget(null)}
          onSave={handleChangePassword}
        />
      )}

      {/* Toast de error — fijo, siempre visible */}
      {deleteError && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white border border-red-300 rounded-xl shadow-xl p-4 flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-bold text-red-600">Error al eliminar</p>
            <p className="text-xs text-red-500 mt-1 break-all">{deleteError}</p>
          </div>
          <button onClick={() => setDeleteError(null)} className="text-red-400 hover:text-red-600 shrink-0 text-lg leading-none">✕</button>
        </div>
      )}
    </>
  )
}

function ChangePasswordModal({
  user,
  onClose,
  onSave,
}: {
  user: ConectaUser
  onClose: () => void
  onSave: (userId: string, newPassword: string) => Promise<void>
}) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      alert("Las contraseñas no coinciden.")
      return
    }
    setLoading(true)
    await onSave(user.id, password)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-[#3D3D3D]">Cambiar contraseña</h2>
            <p className="text-xs text-[#aaa] mt-0.5">{user.nombre} {user.apellido}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#aaa] hover:text-[#3D3D3D]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1.5">Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1.5">Confirmar contraseña</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí la contraseña"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
            />
          </div>

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
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function UserModal({
  allowedRoles,
  onClose,
  onSave,
}: {
  allowedRoles: Role[]
  onClose: () => void
  onSave: (data: { nombre: string; apellido: string; email: string; role: string; password: string; loginMethod: "email" | "dni"; dni?: string }) => Promise<void>
}) {
  const DOMINIOS = ["@gmail.com", "@outlook.com", "@hotmail.com", "@yahoo.com", "@icloud.com", "@live.com"]

  const [loginMethod, setLoginMethod] = useState<"email" | "dni">("email")
  const [form, setForm] = useState({ nombre: "", apellido: "", emailLocal: "", emailDomain: "@gmail.com", emailCustom: "", dni: "", role: allowedRoles[0] ?? "estudiante", password: "" })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const domain = form.emailDomain === "custom" ? form.emailCustom : form.emailDomain
    const email = `${form.emailLocal}${domain}`
    await onSave({ ...form, email, loginMethod, dni: loginMethod === "dni" ? form.dni : undefined })
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#3D3D3D]">Nuevo usuario</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-[#aaa] hover:text-[#3D3D3D]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Toggle método de acceso */}
          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1.5">Método de acceso</label>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  loginMethod === "email" ? "bg-white text-[#2B7A9E] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("dni")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  loginMethod === "dni" ? "bg-white text-[#2B7A9E] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" /> DNI
              </button>
            </div>
          </div>

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

          {loginMethod === "email" ? (
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">Email</label>
              <div className="flex gap-1.5">
                <input
                  name="emailLocal"
                  type="text"
                  value={form.emailLocal}
                  onChange={handleChange}
                  placeholder="usuario"
                  required
                  className="flex-1 min-w-0 rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
                />
                <select
                  name="emailDomain"
                  value={form.emailDomain}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-200 px-2 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] bg-white"
                >
                  {DOMINIOS.map(d => <option key={d} value={d}>{d}</option>)}
                  <option value="custom">Otro...</option>
                </select>
              </div>
              {form.emailDomain === "custom" && (
                <input
                  name="emailCustom"
                  type="text"
                  value={form.emailCustom}
                  onChange={handleChange}
                  placeholder="@miempresa.com"
                  required
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
                />
              )}
              {form.emailLocal && (
                <p className="text-xs text-[#aaa] mt-1">
                  {form.emailLocal}{form.emailDomain === "custom" ? form.emailCustom : form.emailDomain}
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">DNI</label>
              <input
                name="dni"
                type="text"
                inputMode="numeric"
                value={form.dni}
                onChange={handleChange}
                placeholder="Ej: 12345678"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
              />
              <p className="text-xs text-[#aaa] mt-1">El alumno podrá ingresar usando su DNI como usuario.</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1.5">Rol</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20"
            >
              {allowedRoles.map((r) => (
                <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1.5">Contraseña temporal</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#2B7A9E]/20 focus:border-[#2B7A9E] transition-colors"
            />
            <p className="text-xs text-[#aaa] mt-1">El usuario podrá cambiarla al ingresar.</p>
          </div>

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
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creando...</> : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
