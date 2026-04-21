import { ConectaLogo } from "./ConectaLogo"

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

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Conecta Educación Interactiva
          </p>
        </div>
      </div>
    </footer>
  )
}
