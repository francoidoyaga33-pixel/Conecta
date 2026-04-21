export interface ConectaTheme {
  id: string
  name: string
  description: string
  preview: {
    bg: string
    primary: string
    surface: string
    text: string
  }
  vars: Record<string, string>
}

export const CONECTA_THEMES: ConectaTheme[] = [
  {
    id: "oceano",
    name: "Océano",
    description: "Profesional y confiable. Transmite solidez institucional.",
    preview: { bg: "#FFFFFF", primary: "#2B7A9E", surface: "#F0F7FA", text: "#3D3D3D" },
    vars: {
      "--c-primary":     "#2B7A9E",
      "--c-primary-dark":"#246a8a",
      "--c-primary-05":  "rgba(43,122,158,0.05)",
      "--c-primary-10":  "rgba(43,122,158,0.10)",
      "--c-primary-20":  "rgba(43,122,158,0.20)",
      "--c-primary-30":  "rgba(43,122,158,0.30)",
      "--c-primary-text":"#B8D9EA",
      "--c-surface":     "#F0F7FA",
      "--c-surface-card":"#FFFFFF",
      "--c-text":        "#3D3D3D",
      "--c-text-muted":  "#666666",
      "--c-text-light":  "#888888",
      "--c-btn-radius":  "9999px",
      "--c-card-radius": "1.5rem",
      "--c-tag-radius":  "9999px",
    },
  },
]

export const DEFAULT_THEME_ID = "oceano"

export function getThemeById(id: string): ConectaTheme {
  return CONECTA_THEMES.find((t) => t.id === id) ?? CONECTA_THEMES[0]
}
