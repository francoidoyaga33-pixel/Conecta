"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Cpu, Bot, Factory, Globe, Calculator, PiggyBank, Sparkles } from "lucide-react"
import { MATERIAS } from "./materias"

const courses = [
  {
    icon: Cpu,
    name: MATERIAS[0],
    description: "Pensamiento lógico y proyectos de código real, desde los primeros bloques hasta lenguajes de programación.",
  },
  {
    icon: Bot,
    name: MATERIAS[1],
    description: "Diseño, armado y programación de robots para aprender ciencia y tecnología jugando.",
  },
  {
    icon: Factory,
    name: MATERIAS[2],
    description: "Diseño y fabricación digital: makers, prototipado e impresión 3D.",
  },
  {
    icon: Globe,
    name: MATERIAS[3],
    description: "Inglés interactivo con seguimiento personalizado, desde Starters hasta niveles avanzados.",
  },
  {
    icon: Calculator,
    name: MATERIAS[4],
    description: "Matemática aplicada con un enfoque lúdico que conecta la teoría con la vida real.",
  },
  {
    icon: PiggyBank,
    name: MATERIAS[5],
    description: "Educación financiera y espíritu emprendedor para chicos y jóvenes.",
  },
  {
    icon: Sparkles,
    name: MATERIAS[6],
    description: "Introducción a la Inteligencia Artificial: herramientas y proyectos del futuro.",
  },
]

export function Programs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="programas" className="py-24 bg-[var(--c-surface-card)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-[var(--c-tag-radius)] bg-[var(--c-primary-10)] px-4 py-1.5 text-xs font-semibold tracking-widest text-[var(--c-primary)] uppercase mb-4">
            Nuestros programas
          </span>
          <h2 className="text-4xl font-black text-[var(--c-text)] mb-4">
            Lo que enseñamos en Conecta
          </h2>
          <p className="text-[var(--c-text-muted)] max-w-xl mx-auto">
            Un abanico de disciplinas pensadas para chicos y jóvenes de 7 a 15 años,
            organizadas en grupos por edad y nivel de avance.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-[var(--c-card-radius)] border-2 border-[var(--c-primary-20)] p-6 hover:shadow-lg hover:shadow-[var(--c-primary-10)] transition-shadow"
            >
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--c-primary-10)" }}
              >
                <course.icon className="h-6 w-6" style={{ color: "var(--c-primary)" }} />
              </div>
              <h3 className="text-lg font-black text-[var(--c-text)] mb-2">{course.name}</h3>
              <p className="text-sm text-[var(--c-text-muted)] leading-relaxed">{course.description}</p>
            </motion.div>
          ))}

          <motion.a
            href="#contacto"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: courses.length * 0.08 }}
            className="rounded-[var(--c-card-radius)] p-6 flex flex-col items-start justify-center gap-3"
            style={{ backgroundColor: "var(--c-primary)" }}
          >
            <p className="text-lg font-black text-white">¿Querés conocer más?</p>
            <p className="text-sm text-white/80">Consultá horarios, niveles y vacantes disponibles para cada programa.</p>
            <span className="mt-2 text-sm font-bold text-white underline underline-offset-4">Contactanos →</span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
