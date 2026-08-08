import type { CSSProperties } from "react"
import { getThemeById } from "./_themes"
import { createAdminClient } from "@/lib/supabase/admin"
import { Navbar } from "./_components/Navbar"
import { Hero } from "./_components/Hero"
import { About } from "./_components/About"
import { Programs } from "./_components/Programs"
import { Methodology } from "./_components/Methodology"
import { Contact } from "./_components/Contact"
import { Footer } from "./_components/Footer"
import { FloatingSocialButtons } from "./_components/WhatsAppButton"

export const dynamic = "force-dynamic"

async function getStats() {
  const admin = createAdminClient()

  const [{ count: estudiantes }, { count: grupos }, { data: gruposMateria }] = await Promise.all([
    admin.from("conecta_profiles").select("id", { count: "exact", head: true }).eq("role", "estudiante"),
    admin.from("conecta_grupos").select("id", { count: "exact", head: true }),
    admin.from("conecta_grupos").select("materia"),
  ])

  const programas = new Set((gruposMateria ?? []).map((g) => g.materia)).size

  return {
    estudiantes: Math.max(10, Math.floor((estudiantes ?? 0) / 10) * 10),
    grupos: grupos ?? 0,
    programas,
  }
}

export default async function ConectaPage() {
  const theme = getThemeById("oceano")
  const stats = await getStats()

  return (
    <div style={theme.vars as CSSProperties}>
      <Navbar />
      <main>
        <Hero stats={stats} />
        <About />
        <Programs />
        <Methodology />
        <Contact />
      </main>
      <Footer />
      <FloatingSocialButtons />
    </div>
  )
}
