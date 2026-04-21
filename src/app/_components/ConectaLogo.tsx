export function ConectaLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const scale = size === "sm" ? 0.6 : size === "lg" ? 1.4 : 1

  return (
    <div className="flex items-center gap-2" style={{ transform: `scale(${scale})`, transformOrigin: "left center" }}>
      <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="4" r="2.5" fill="#2B7A9E" />
        <circle cx="32" cy="12" r="2.5" fill="#2B7A9E" />
        <circle cx="28" cy="24" r="2.5" fill="#2B7A9E" />
        <circle cx="10" cy="18" r="2.5" fill="#2B7A9E" />
        <circle cx="20" cy="16" r="2.5" fill="#2B7A9E" />
        <circle cx="18" cy="30" r="2.5" fill="#2B7A9E" />
        <circle cx="6" cy="10" r="2.5" fill="#2B7A9E" />
        <circle cx="18" cy="40" r="2" fill="#2B7A9E" />
        <line x1="18" y1="4" x2="6" y2="10" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="18" y1="4" x2="32" y2="12" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="18" y1="4" x2="20" y2="16" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="6" y1="10" x2="10" y2="18" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="32" y1="12" x2="28" y2="24" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="32" y1="12" x2="20" y2="16" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="10" y1="18" x2="20" y2="16" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="10" y1="18" x2="18" y2="30" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="20" y1="16" x2="28" y2="24" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="28" y1="24" x2="18" y2="30" stroke="#2B7A9E" strokeWidth="1.2" />
        <line x1="18" y1="30" x2="18" y2="40" stroke="#2B7A9E" strokeWidth="1.2" />
      </svg>

      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black tracking-wider text-[#4A4A4A]">CONECTA</span>
        <span className="text-[9px] font-medium tracking-[0.25em] text-[#2B7A9E] uppercase">
          Educación Interactiva
        </span>
      </div>
    </div>
  )
}
