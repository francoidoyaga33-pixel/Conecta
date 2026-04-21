"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Heart, Star, Users } from "lucide-react"

export function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="nosotros" className="py-24 bg-[var(--c-surface)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-[var(--c-card-radius)] bg-[var(--c-surface-card)] p-10 shadow-sm border border-[var(--c-primary-10)]">
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Heart, label: "Vocación docente", bg: "bg-rose-50", text: "text-rose-500" },
                { icon: Star, label: "Excelencia académica", bg: "bg-amber-50", text: "text-amber-500" },
                { icon: Users, label: "Grupos reducidos", bg: "bg-[var(--c-primary-10)]", text: "text-[var(--c-primary)]" },
                {
                  icon: () => (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  ),
                  label: "Metodología activa",
                  bg: "bg-emerald-50",
                  text: "text-emerald-500"
                },
              ].map(({ icon: Icon, label, bg, text }) => (
                <div key={label} className={`rounded-2xl p-6 flex flex-col gap-3 ${bg}`}>
                  <div className={text}>
                    <Icon />
                  </div>
                  <p className="text-sm font-semibold text-[var(--c-text)]">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[var(--c-primary-10)] -z-10" />
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <span className="inline-block rounded-[var(--c-tag-radius)] bg-[var(--c-primary-10)] px-4 py-1.5 text-xs font-semibold tracking-widest text-[var(--c-primary)] uppercase mb-4">
            Sobre nosotros
          </span>
          <h2 className="text-4xl font-black text-[var(--c-text)] leading-tight mb-6">
            Aprendemos juntos,<br />
            <span className="text-[var(--c-primary)]">crecemos juntos</span>
          </h2>
          <p className="text-[var(--c-text-muted)] leading-relaxed mb-4">
            Conecta es un instituto de educación interactiva dedicado a niños de 7 a 15 años.
            Creemos que cada niño aprende de manera única, por eso diseñamos experiencias
            pedagógicas que se adaptan a su ritmo, sus intereses y sus talentos.
          </p>
          <p className="text-[var(--c-text-muted)] leading-relaxed mb-8">
            Nuestros docentes son profesionales comprometidos con la innovación educativa,
            utilizando recursos tecnológicos y metodologías activas para hacer de cada
            clase una aventura del conocimiento.
          </p>

          <div className="space-y-3">
            {[
              "Clases presenciales y virtuales",
              "Seguimiento personalizado por alumno",
              "Comunicación constante con las familias",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[var(--c-primary)] shrink-0" />
                <p className="text-sm text-[var(--c-text-muted)]">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
