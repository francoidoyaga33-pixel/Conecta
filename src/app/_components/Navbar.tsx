"use client"

import { useState } from "react"
import { Menu, X, LogIn } from "lucide-react"
import Link from "next/link"
import { ConectaLogo } from "./ConectaLogo"

const links = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Programas", href: "#programas" },
  { label: "Metodología", href: "#metodologia" },
  { label: "Contacto", href: "#contacto" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <ConectaLogo size="sm" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[var(--c-text-muted)] hover:text-[var(--c-primary)] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--c-text-muted)] hover:text-[var(--c-primary)] transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            Ingresar
          </Link>
          <a
            href="#contacto"
            className="rounded-[var(--c-btn-radius)] bg-[var(--c-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--c-primary-dark)] transition-colors"
          >
            Inscribirse
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[var(--c-text-muted)]"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[var(--c-text-muted)] hover:text-[var(--c-primary)] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--c-text-muted)] hover:text-[var(--c-primary)] transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            Ingresar
          </Link>
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="rounded-[var(--c-btn-radius)] bg-[var(--c-primary)] px-5 py-2 text-sm font-semibold text-white text-center hover:bg-[var(--c-primary-dark)] transition-colors"
          >
            Inscribirse
          </a>
        </div>
      )}
    </header>
  )
}
