import type { CSSProperties } from "react"
import { getThemeById } from "./_themes"
import { Navbar } from "./_components/Navbar"
import { Hero } from "./_components/Hero"
import { About } from "./_components/About"
import { Programs } from "./_components/Programs"
import { Methodology } from "./_components/Methodology"
import { Contact } from "./_components/Contact"
import { Footer } from "./_components/Footer"

export default function ConectaPage() {
  const theme = getThemeById("oceano")

  return (
    <div style={theme.vars as CSSProperties}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <Methodology />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
