import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getSession lee el JWT desde la cookie sin hacer llamadas de red — apto para middleware
  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  // Proteger /app/* y /cambiar-contrasena
  if (pathname.startsWith("/app/") || pathname === "/cambiar-contrasena") {
    if (!session) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/login"
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirigir usuarios logueados fuera del login
  if (pathname === "/login" && session) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/app/dashboard"
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}

export const config = {
  // Solo interceptar rutas de la app, no assets ni API de Next.js
  matcher: ["/app/:path*", "/login", "/cambiar-contrasena"],
}
