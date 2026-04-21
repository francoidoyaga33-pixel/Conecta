"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Zap, Target, RefreshCcw, MessageCircle } from "lucide-react"

const pillars = [
  {
    icon: Zap,
    title: "Aprendizaje activo",
    description: "Los estudiantes aprenden haciendo. Proyectos, experimentos y desafíos prácticos que generan comprensión profunda.",
  },
  {
    icon: Target,
    title: "Objetivos personalizados",
    description: "Cada alumno tiene un plan de avance propio, con metas claras y alcanzables según su ritmo y capacidad.",
  },
  {
    icon: RefreshCcw,
    title: "Retroalimentación continua",
    description: "Evaluaciones formativas frecuentes y feedback inmediato que permiten ajustar y mejorar constantemente.",
  },
  {
    icon: MessageCircle,
    title: "Comunicación abierta",
    description: "Mantenemos a las familias informadas y en contacto permanente con los docentes para un acompañamiento integral.",
  },
]

export function Methodology() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="metodologia" className="py-24 bg-[var(--c-surface)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-[var(--c-tag-radius)] bg-[var(--c-primary-10)] px-4 py-1.5 text-xs font-semibold tracking-widest text-[var(--c-primary)] uppercase mb-4">
            Nuestra metodología
          </span>
          <h2 className="text-4xl font-black text-[var(--c-text)] mb-4">
            ¿Por qué elegir Conecta?
          </h2>
          <p className="text-[var(--c-text-muted)] max-w-xl mx-auto">
            Nuestra metodología combina lo mejor de la pedagogía moderna
            con tecnología educativa de punta.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[var(--c-surface-card)] rounded-[var(--c-card-radius)] p-6 border border-[var(--c-primary-10)] hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-[var(--c-primary-10)] flex items-center justify-center mb-5">
                <pillar.icon className="h-6 w-6 text-[var(--c-primary)]" />
              </div>
              <h3 className="font-bold text-[var(--c-text)] mb-2">{pillar.title}</h3>
              <p className="text-sm text-[var(--c-text-muted)] leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Quote / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 rounded-[var(--c-card-radius)] bg-[var(--c-primary)] px-10 py-12 text-center text-white"
        >
          <p className="text-2xl font-bold mb-2">
            &ldquo;Cada niño es un universo de posibilidades.&rdquo;
          </p>
          <p className="text-[var(--c-primary-text)] text-sm mb-8">
            En Conecta trabajamos cada día para que esas posibilidades se conviertan en logros reales.
          </p>
          <a
            href="#contacto"
            className="inline-block rounded-[var(--c-btn-radius)] bg-white px-8 py-3 text-sm font-bold hover:opacity-90 transition-opacity"
            style={{ color: "var(--c-primary)" }}
          >
            Quiero inscribir a mi hijo
          </a>
        </motion.div>
      </div>
    </section>
  )
}
