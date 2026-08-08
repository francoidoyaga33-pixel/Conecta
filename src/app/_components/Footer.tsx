import { Instagram } from "lucide-react"
import { ConectaLogo } from "./ConectaLogo"
import { INSTAGRAM_URL } from "./WhatsAppButton"

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <ConectaLogo size="sm" />

          <nav className="flex flex-wrap gap-6 justify-center">
            {["Nosotros", "Programas", "Metodología", "Contacto"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conecta en Instagram"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Instagram className="h-4 w-4" />
            @formacionconecta
          </a>

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Conecta Educación Interactiva
          </p>
        </div>
      </div>
    </footer>
  )
}
