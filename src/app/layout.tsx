import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Conecta — Educación Interactiva",
  description: "Instituto de educación interactiva para niños de 7 a 15 años.",
  metadataBase: new URL("https://educaconecta.com"),
  openGraph: {
    title: "Conecta — Educación Interactiva",
    description: "Instituto de educación interactiva para niños de 7 a 15 años.",
    url: "https://educaconecta.com",
    siteName: "Conecta",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
