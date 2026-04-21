"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { BookOpen, Cpu, Palette, Calculator, Globe, Music } from "lucide-react"

const programs = [
  {
    age: "7 a 10 años",
    tag: "Exploradores",
    tagClass: "bg-amber-100 text-amber-700",
    borderClass: "border-amber-200",
    accentColor: "#F59E0B",
    description: "Descubrimiento, juego y creatividad. Desarrollamos habilidades fundamentales a través de actividades lúdicas y colaborativas.",
    subjects: [
      { icon: Palette, name: "Arte y Creatividad" },
      { icon: Calculator, name: "Matemática Lúdica" },
      { icon: Globe, name: "Ciencias del Entorno" },
      { icon: Music, name: "Música y Expresión" },
    ],
  },
  {
    age: "11 a 15 años",
    tag: "Innovadores",
    tagClass: "bg-[var(--c-primary-10)] text-[var(--c-primary)]",
    borderClass: "border-[var(--c-primary-20)]",
    accentColor: null, // uses CSS var
    description: "Pensamiento crítico, tecnología y proyectos reales. Preparamos a los jóvenes para los desafíos del mundo contemporáneo.",
    subjects: [
      { icon: Cpu, name: "Programación & Tech" },
      { icon: BookOpen, name: "Comprensión Lectora" },
      { icon: Calculator, name: "Matemática Avanzada" },
      { icon: Globe, name: "Inglés Interactivo" },
    ],
    featured: true,
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
            Un programa para cada etapa
          </h2>
          <p className="text-[var(--c-text-muted)] max-w-xl mx-auto">
            Diseñamos nuestros contenidos adaptados a las necesidades cognitivas
            y emocionales de cada grupo de edad.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program, i) => (
            <motion.div
              key={program.age}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`rounded-[var(--c-card-radius)] border-2 ${program.borderClass} p-8 relative overflow-hidden ${
                program.featured ? "shadow-lg shadow-[var(--c-primary-10)]" : ""
              }`}
            >
              {program.featured && (
                <div
                  className="absolute top-4 right-4 rounded-[var(--c-tag-radius)] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: "var(--c-primary)" }}
                >
                  Más popular
                </div>
              )}

              <div className="mb-6">
                <span className={`inline-block rounded-[var(--c-tag-radius)] px-3 py-1 text-xs font-bold ${program.tagClass} mb-3`}>
                  {program.tag}
                </span>
                <h3 className="text-2xl font-black text-[var(--c-text)]">{program.age}</h3>
                <p className="text-[var(--c-text-muted)] mt-2 text-sm leading-relaxed">{program.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {program.subjects.map(({ icon: Icon, name }) => (
                  <div key={name} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <Icon
                      className="h-4 w-4 shrink-0"
                      style={{ color: program.accentColor ?? "var(--c-primary)" }}
                    />
                    <span className="text-xs font-medium text-[var(--c-text-muted)]">{name}</span>
                  </div>
                ))}
              </div>

              <a
                href="#contacto"
                className="mt-6 flex items-center justify-center rounded-[var(--c-btn-radius)] py-3 text-sm font-bold transition-colors"
                style={
                  program.featured
                    ? { backgroundColor: "var(--c-primary)", color: "white", border: "2px solid var(--c-primary)" }
                    : { backgroundColor: "transparent", color: "var(--c-primary)", border: "2px solid var(--c-primary)" }
                }
              >
                Inscribir a mi hijo
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
