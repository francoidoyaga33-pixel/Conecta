"use client"

import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-16">
      {/* Background geometric pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-0 right-0 w-[600px] h-[600px] opacity-5" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="80" r="6" fill="var(--c-primary)" />
          <circle cx="520" cy="160" r="6" fill="var(--c-primary)" />
          <circle cx="480" cy="320" r="6" fill="var(--c-primary)" />
          <circle cx="200" cy="260" r="6" fill="var(--c-primary)" />
          <circle cx="350" cy="220" r="6" fill="var(--c-primary)" />
          <circle cx="320" cy="440" r="6" fill="var(--c-primary)" />
          <circle cx="120" cy="180" r="6" fill="var(--c-primary)" />
          <line x1="300" y1="80" x2="120" y2="180" stroke="var(--c-primary)" strokeWidth="1.5" />
          <line x1="300" y1="80" x2="520" y2="160" stroke="var(--c-primary)" strokeWidth="1.5" />
          <line x1="300" y1="80" x2="350" y2="220" stroke="var(--c-primary)" strokeWidth="1.5" />
          <line x1="120" y1="180" x2="200" y2="260" stroke="var(--c-primary)" strokeWidth="1.5" />
          <line x1="520" y1="160" x2="480" y2="320" stroke="var(--c-primary)" strokeWidth="1.5" />
          <line x1="520" y1="160" x2="350" y2="220" stroke="var(--c-primary)" strokeWidth="1.5" />
          <line x1="200" y1="260" x2="350" y2="220" stroke="var(--c-primary)" strokeWidth="1.5" />
          <line x1="200" y1="260" x2="320" y2="440" stroke="var(--c-primary)" strokeWidth="1.5" />
          <line x1="350" y1="220" x2="480" y2="320" stroke="var(--c-primary)" strokeWidth="1.5" />
          <line x1="480" y1="320" x2="320" y2="440" stroke="var(--c-primary)" strokeWidth="1.5" />
        </svg>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--c-primary-10)] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block rounded-[var(--c-tag-radius)] bg-[var(--c-primary-10)] px-4 py-1.5 text-xs font-semibold tracking-widest text-[var(--c-primary)] uppercase mb-6">
            Educación Interactiva · 7 a 15 años
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-[var(--c-text)] leading-tight mb-6">
            Conecta el futuro
            <br />
            <span className="text-[var(--c-primary)]">de tus hijos</span>
            <br />
            con el conocimiento
          </h1>
          <p className="text-lg text-[var(--c-text-muted)] leading-relaxed mb-8 max-w-md">
            En Conecta creamos experiencias de aprendizaje dinámicas, personalizadas
            y divertidas para que cada niño descubra su máximo potencial.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#programas"
              className="rounded-[var(--c-btn-radius)] bg-[var(--c-primary)] px-7 py-3.5 text-sm font-bold text-white hover:bg-[var(--c-primary-dark)] transition-colors shadow-lg shadow-[var(--c-primary-20)]"
            >
              Ver programas
            </a>
            <a
              href="#nosotros"
              className="rounded-[var(--c-btn-radius)] border-2 border-[var(--c-primary)] px-7 py-3.5 text-sm font-bold text-[var(--c-primary)] hover:bg-[var(--c-primary-05)] transition-colors"
            >
              Conoce más
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-12 pt-8 border-t border-gray-100">
            {[
              { num: "200+", label: "Estudiantes" },
              { num: "8", label: "Años de experiencia" },
              { num: "95%", label: "Satisfacción" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-[var(--c-primary)]">{s.num}</p>
                <p className="text-xs text-[var(--c-text-light)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden md:flex items-center justify-center"
        >
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 rounded-[var(--c-card-radius)] bg-[var(--c-primary-10)]" />
            <div className="absolute inset-4 rounded-[var(--c-card-radius)] bg-[var(--c-primary-20)] flex items-center justify-center">
              <svg width="160" height="180" viewBox="0 0 160 180" fill="none">
                <circle cx="80" cy="20" r="10" fill="var(--c-primary)" />
                <circle cx="140" cy="55" r="10" fill="var(--c-primary)" />
                <circle cx="120" cy="110" r="10" fill="var(--c-primary)" />
                <circle cx="50" cy="80" r="10" fill="var(--c-primary)" />
                <circle cx="85" cy="70" r="10" fill="var(--c-primary)" />
                <circle cx="75" cy="140" r="10" fill="var(--c-primary)" />
                <circle cx="25" cy="45" r="10" fill="var(--c-primary)" />
                <circle cx="80" cy="170" r="8" fill="var(--c-primary)" />
                <line x1="80" y1="20" x2="25" y2="45" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="80" y1="20" x2="140" y2="55" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="80" y1="20" x2="85" y2="70" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="25" y1="45" x2="50" y2="80" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="140" y1="55" x2="120" y2="110" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="140" y1="55" x2="85" y2="70" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="50" y1="80" x2="85" y2="70" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="50" y1="80" x2="75" y2="140" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="85" y1="70" x2="120" y2="110" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="120" y1="110" x2="75" y2="140" stroke="var(--c-primary)" strokeWidth="2" />
                <line x1="75" y1="140" x2="80" y2="170" stroke="var(--c-primary)" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-[var(--c-primary-30)] flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-[var(--c-primary-30)]" />
        </div>
      </motion.div>
    </section>
  )
}
