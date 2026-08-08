"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useTransition } from "react"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { MATERIAS } from "./materias"
import { enviarContacto } from "./contactActions"

const EMPTY_FORM = {
  nombre: "", apellido: "", email: "", phone: "", cursos_interes: "", message: "",
}

export function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [form, setForm] = useState(EMPTY_FORM)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await enviarContacto({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.phone,
        cursos_interes: form.cursos_interes,
        mensaje: form.message,
      })
      if (result.error) { setError(result.error); return }
      setSent(true)
      setForm(EMPTY_FORM)
    })
  }

  return (
    <section id="contacto" className="py-24 bg-[var(--c-surface-card)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-[var(--c-tag-radius)] bg-[var(--c-primary-10)] px-4 py-1.5 text-xs font-semibold tracking-widest text-[var(--c-primary)] uppercase mb-4">
            Contacto
          </span>
          <h2 className="text-4xl font-black text-[var(--c-text)] mb-4">
            ¿Listo para conectar?
          </h2>
          <p className="text-[var(--c-text-muted)] max-w-xl mx-auto">
            Escribinos y te contamos todo sobre nuestros programas, horarios y aranceles.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {[
              { icon: Mail, label: "Email", value: "Formacionconectafca@gmail.com" },
              { icon: Phone, label: "Teléfono", value: "+54 9 3704 71-5907" },
              { icon: MapPin, label: "Dirección", value: "Maipú 1545" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[var(--c-primary-10)] flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[var(--c-primary)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--c-text-light)] uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm text-[var(--c-text)] font-medium">{value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-[var(--c-card-radius)] bg-[var(--c-surface)] p-6 mt-8">
              <p className="text-sm font-semibold text-[var(--c-text)] mb-2">Horarios de atención</p>
              <p className="text-sm text-[var(--c-text-muted)]">Lunes a viernes: 9:00 – 13:00 y 17:00 – 21:00 hs</p>
              <p className="text-sm text-[var(--c-text-muted)]">Sábados: 9:00 – 13:00 hs</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {sent ? (
              <div className="rounded-[var(--c-card-radius)] bg-[var(--c-primary-05)] border border-[var(--c-primary-20)] p-10 text-center">
                <div className="h-16 w-16 rounded-full bg-[var(--c-primary-10)] flex items-center justify-center mx-auto mb-4">
                  <Send className="h-7 w-7 text-[var(--c-primary)]" />
                </div>
                <h3 className="font-bold text-[var(--c-text)] text-lg mb-2">¡Mensaje enviado!</h3>
                <p className="text-sm text-[var(--c-text-muted)]">
                  Nos comunicaremos con vos a la brevedad. ¡Gracias por contactarte con Conecta!
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm font-semibold text-[var(--c-primary)] underline underline-offset-4"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-text-muted)] mb-1.5">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[var(--c-text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-30)] focus:border-[var(--c-primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-text-muted)] mb-1.5">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Tu apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[var(--c-text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-30)] focus:border-[var(--c-primary)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--c-text-muted)] mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[var(--c-text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-30)] focus:border-[var(--c-primary)] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-text-muted)] mb-1.5">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+54 9 ..."
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[var(--c-text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-30)] focus:border-[var(--c-primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--c-text-muted)] mb-1.5">Programa de interés</label>
                    <select
                      name="cursos_interes"
                      value={form.cursos_interes}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[var(--c-text)] focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-30)] focus:border-[var(--c-primary)] transition-colors"
                    >
                      <option value="">No estoy seguro/a</option>
                      {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--c-text-muted)] mb-1.5">Mensaje</label>
                  <textarea
                    name="message"
                    placeholder="Contanos sobre tu hijo/a: edad, intereses, y cualquier consulta que tengas..."
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[var(--c-text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-30)] focus:border-[var(--c-primary)] transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-[var(--c-btn-radius)] bg-[var(--c-primary)] py-3.5 text-sm font-bold text-white hover:bg-[var(--c-primary-dark)] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Enviar mensaje</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
