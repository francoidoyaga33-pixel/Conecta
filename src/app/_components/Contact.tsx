"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"

export function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1200)
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
              { icon: Mail, label: "Email", value: "info@conecta.edu.ar" },
              { icon: Phone, label: "Teléfono", value: "+54 9 XXX XXX XXXX" },
              { icon: MapPin, label: "Dirección", value: "Tu ciudad, Argentina" },
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
              <p className="text-sm text-[var(--c-text-muted)]">Lunes a viernes: 8:00 – 18:00 hs</p>
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
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: "name", label: "Nombre completo", type: "text", placeholder: "Tu nombre" },
                  { name: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
                  { name: "phone", label: "Teléfono (opcional)", type: "tel", placeholder: "+54 9 ..." },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-[var(--c-text-muted)] mb-1.5">{label}</label>
                    <input
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[var(--c-text)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-30)] focus:border-[var(--c-primary)] transition-colors"
                      required={name !== "phone"}
                    />
                  </div>
                ))}
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[var(--c-btn-radius)] bg-[var(--c-primary)] py-3.5 text-sm font-bold text-white hover:bg-[var(--c-primary-dark)] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
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
