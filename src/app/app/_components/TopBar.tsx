import { Bell } from "lucide-react"

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-14 border-b border-gray-100 bg-white flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-base font-bold text-[#3D3D3D]">{title}</h1>
        {subtitle && <p className="text-xs text-[#888]">{subtitle}</p>}
      </div>
      <button className="relative p-2 rounded-lg text-[#888] hover:bg-gray-50 hover:text-[#3D3D3D] transition-colors">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#2B7A9E]" />
      </button>
    </header>
  )
}
