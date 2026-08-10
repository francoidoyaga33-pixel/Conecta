"use client"

import { motion, AnimatePresence, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Bot, Cpu, Wrench, CheckCircle2, MapPinned } from "lucide-react"

interface Nivel {
  nombre: string
  etiqueta: string
  intro: string
  capacidades: string[]
  programas: { robotica: string; programacion: string; maker: string }
}

interface Track {
  id: string
  nombre: string
  subtitulo: string
  edad: string
  color: string
  descripcion: string
  capacidades?: string[]
  niveles?: Nivel[]
}

const TRACKS: Track[] = [
  {
    id: "conectarte",
    nombre: "CONECTARTE",
    subtitulo: "Estimulación temprana",
    edad: "4 a 5 años",
    color: "var(--c-primary)",
    descripcion:
      "Un espacio diseñado para el desarrollo temprano a través del juego y la exploración sensorial. En esta etapa, los pequeños desarrollan habilidades cognitivas, motoras y emocionales en un ambiente seguro y estimulante.",
    capacidades: [
      "Coordinación motora fina y gruesa",
      "Desarrollo del lenguaje y la comunicación",
      "Vínculo afectivo y socialización",
      "Exploración sensorial y creatividad",
      "Primeros acercamientos a la resolución de problemas",
    ],
  },
  {
    id: "conectaditos",
    nombre: "CONECTADITOS",
    subtitulo: "Iniciación en el aprendizaje",
    edad: "6 a 9 años",
    color: "#3E8E52",
    descripcion:
      "Un programa estructurado en tres niveles, enfocado en el desarrollo de habilidades esenciales para la transición hacia el aprendizaje digital y la resolución de problemas. Cada nivel integra tres programas: Robótica, Programación y Maker.",
    niveles: [
      {
        nombre: "Kilobyte",
        etiqueta: "Nivel 1",
        intro: "Los niños desarrollan confianza en su aprendizaje mediante experiencias multisensoriales y juegos interactivos.",
        capacidades: [
          "Exploración del entorno y resolución de problemas sencillos",
          "Desarrollo de la motricidad fina y coordinación",
          "Primeros pasos en la autonomía y la toma de decisiones",
          "Introducción a conceptos matemáticos y lógicos",
          "Expresión artística y creatividad",
        ],
        programas: {
          robotica: "Introducción a estructuras básicas, programación, mecanismos simples y ensamblaje.",
          programacion: "Primeros pasos en secuencias lógicas y comandos básicos.",
          maker: "Uso de materiales diversos para crear proyectos manuales y tecnológicos que resuelven problemas de la vida real.",
        },
      },
      {
        nombre: "Megabyte",
        etiqueta: "Nivel 2",
        intro: "Los niños profundizan en la creatividad, el pensamiento crítico y la colaboración a través de experiencias de aprendizaje guiadas.",
        capacidades: [
          "Desarrollo del pensamiento lógico y matemático",
          "Expresión oral y comunicación efectiva",
          "Coordinación y control motor avanzado",
          "Exploración tecnológica a través de juegos digitales",
          "Trabajo en equipo y desarrollo de la empatía",
        ],
        programas: {
          robotica: "Construcción de modelos con sensores básicos.",
          programacion: "Uso de plataformas visuales para programación con bloques.",
          maker: "Creación de prototipos con materiales reciclables y tecnológicos.",
        },
      },
      {
        nombre: "Gigabyte",
        etiqueta: "Nivel 3",
        intro: "En la etapa final de Conectaditos, los niños potencian su creatividad y pensamiento estratégico mediante proyectos prácticos.",
        capacidades: [
          "Razonamiento lógico y resolución de problemas complejos",
          "Expresión escrita y comprensión lectora",
          "Desarrollo de la iniciativa y autonomía",
          "Introducción a la programación lógica básica",
          "Habilidades socioemocionales y liderazgo",
        ],
        programas: {
          robotica: "Creación de proyectos autónomos y resolución de desafíos.",
          programacion: "Introducción a conceptos más avanzados como condicionales y bucles.",
          maker: "Integración de circuitos básicos y prototipos tecnológicos.",
        },
      },
    ],
  },
  {
    id: "conectados",
    nombre: "CONECTADOS",
    subtitulo: "Exploración del conocimiento y la tecnología",
    edad: "10 años en adelante",
    color: "#C2703D",
    descripcion:
      "Un programa innovador que fomenta el desarrollo del pensamiento computacional, la resolución de problemas y la aplicación de tecnologías en la vida cotidiana. Estructurado en tres niveles, cada uno integra Robótica, Programación y Maker.",
    niveles: [
      {
        nombre: "Terabyte",
        etiqueta: "Nivel 1",
        intro: "Introducción a la exploración digital y el pensamiento computacional a través de juegos y desafíos.",
        capacidades: [
          "Comprensión básica de la lógica de programación",
          "Desarrollo de habilidades numéricas y espaciales",
          "Introducción al pensamiento crítico",
          "Exploración del entorno digital de manera segura",
          "Trabajo en equipo y colaboración",
        ],
        programas: {
          robotica: "Construcción de robots básicos con sensores y programación en lenguaje de bloques por palabras.",
          programacion: "Introducción a la lógica computacional con bloques por palabras.",
          maker: "Creación de proyectos tecnológicos sencillos.",
        },
      },
      {
        nombre: "Petabyte",
        etiqueta: "Nivel 2",
        intro: "En esta etapa, los chicos aplican el conocimiento adquirido para crear y desarrollar proyectos propios.",
        capacidades: [
          "Programación básica con Python",
          "Creación de historias interactivas y videojuegos simples",
          "Resolución de problemas mediante el pensamiento computacional",
          "Uso responsable de herramientas digitales",
          "Desarrollo del liderazgo y habilidades de comunicación",
        ],
        programas: {
          robotica: "Diseño y programación de robots con más funciones.",
          programacion: "Desarrollo de algoritmos y estructuras más avanzadas.",
          maker: "Creación de prototipos tecnológicos con materiales diversos.",
        },
      },
      {
        nombre: "Exabyte",
        etiqueta: "Nivel 3",
        intro: "Los estudiantes alcanzan un nivel avanzado en la aplicación de tecnologías y resolución de problemas reales.",
        capacidades: [
          "Programación intermedia, lenguajes como Python avanzado",
          "Creación de proyectos STEM aplicados",
          "Pensamiento algorítmico y análisis de datos",
          "Resolución de problemas con inteligencia artificial básica",
          "Trabajo en equipo para proyectos interdisciplinarios",
        ],
        programas: {
          robotica: "Desarrollo de proyectos robóticos con múltiples funciones.",
          programacion: "Introducción a lenguajes de programación de texto.",
          maker: "Integración de hardware y software en proyectos innovadores.",
        },
      },
    ],
  },
]

const PROGRAMA_ICONS = { robotica: Bot, programacion: Cpu, maker: Wrench }
const PROGRAMA_LABELS = { robotica: "Robótica", programacion: "Programación", maker: "Maker" }

export function Programs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [activeTrackId, setActiveTrackId] = useState(TRACKS[0].id)
  const [activeLevel, setActiveLevel] = useState(0)

  const track = TRACKS.find((t) => t.id === activeTrackId)!

  function selectTrack(id: string) {
    setActiveTrackId(id)
    setActiveLevel(0)
  }

  return (
    <section id="programas" className="py-24 bg-[var(--c-surface-card)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block rounded-[var(--c-tag-radius)] bg-[var(--c-primary-10)] px-4 py-1.5 text-xs font-semibold tracking-widest text-[var(--c-primary)] uppercase mb-4">
            Nuestros programas
          </span>
          <h2 className="text-4xl font-black text-[var(--c-text)] mb-4">
            Un programa para cada etapa
          </h2>
          <p className="text-[var(--c-text-muted)] max-w-xl mx-auto mb-6">
            Tres trayectos pensados según la edad, con niveles que acompañan el crecimiento
            de cada chico en Robótica, Programación y Maker.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[var(--c-text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <MapPinned className="h-3.5 w-3.5 text-[var(--c-primary)]" /> Modalidad presencial
            </span>
          </div>
        </motion.div>

        {/* Track selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {TRACKS.map((t) => {
            const active = t.id === activeTrackId
            return (
              <button
                key={t.id}
                onClick={() => selectTrack(t.id)}
                className="rounded-[var(--c-tag-radius)] px-5 py-2.5 text-sm font-bold transition-colors border-2"
                style={
                  active
                    ? { backgroundColor: t.color, borderColor: t.color, color: "white" }
                    : { backgroundColor: "transparent", borderColor: t.color, color: t.color }
                }
              >
                {t.nombre}
                <span className="ml-1.5 font-medium opacity-80">· {t.edad}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Track content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            <div
              className="rounded-[var(--c-card-radius)] border-2 p-6 md:p-8 mb-8"
              style={{ borderColor: track.color }}
            >
              <span
                className="inline-block rounded-[var(--c-tag-radius)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white mb-3"
                style={{ backgroundColor: track.color }}
              >
                {track.subtitulo}
              </span>
              <p className="text-[var(--c-text-muted)] leading-relaxed max-w-3xl">{track.descripcion}</p>
            </div>

            {/* Single-level track (Conectarte) */}
            {track.capacidades && (
              <div className="grid sm:grid-cols-2 gap-3">
                {track.capacidades.map((c) => (
                  <div key={c} className="flex items-center gap-3 rounded-xl bg-[var(--c-surface)] px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: track.color }} />
                    <span className="text-sm text-[var(--c-text-muted)]">{c}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Multi-level tracks */}
            {track.niveles && (
              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {track.niveles.map((n, i) => (
                    <button
                      key={n.nombre}
                      onClick={() => setActiveLevel(i)}
                      className="rounded-lg px-4 py-2 text-xs font-bold transition-colors border"
                      style={
                        i === activeLevel
                          ? { backgroundColor: track.color, borderColor: track.color, color: "white" }
                          : { backgroundColor: "transparent", borderColor: "var(--c-primary-20)", color: "var(--c-text-muted)" }
                      }
                    >
                      {n.etiqueta} · {n.nombre.toUpperCase()}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={track.niveles[activeLevel].nombre}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-sm text-[var(--c-text-muted)] italic mb-5 max-w-3xl">
                      {track.niveles[activeLevel].intro}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-text-light)] mb-3">
                          Capacidades que se desarrollan
                        </p>
                        <div className="space-y-2.5">
                          {track.niveles[activeLevel].capacidades.map((c) => (
                            <div key={c} className="flex items-start gap-2.5">
                              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: track.color }} />
                              <span className="text-sm text-[var(--c-text-muted)]">{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-text-light)] mb-3">
                          Programas
                        </p>
                        <div className="space-y-3">
                          {(Object.keys(PROGRAMA_LABELS) as Array<keyof typeof PROGRAMA_LABELS>).map((key) => {
                            const Icon = PROGRAMA_ICONS[key]
                            return (
                              <div key={key} className="rounded-xl bg-[var(--c-surface)] p-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Icon className="h-4 w-4" style={{ color: track.color }} />
                                  <span className="text-sm font-bold text-[var(--c-text)]">{PROGRAMA_LABELS[key]}</span>
                                </div>
                                <p className="text-xs text-[var(--c-text-muted)] leading-relaxed">
                                  {track.niveles![activeLevel].programas[key]}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.a
          href="#contacto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-2 rounded-[var(--c-card-radius)] px-6 py-8 text-center"
          style={{ backgroundColor: "var(--c-primary)" }}
        >
          <p className="text-lg font-black text-white">¿Querés conocer más?</p>
          <p className="text-sm text-white/80 max-w-md">Consultá horarios, niveles y vacantes disponibles para cada programa.</p>
          <span className="mt-2 text-sm font-bold text-white underline underline-offset-4">Contactanos →</span>
        </motion.a>
      </div>
    </section>
  )
}
