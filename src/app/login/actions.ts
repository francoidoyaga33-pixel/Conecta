"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function getEmailByDNI(dni: string): Promise<string | null> {
  const admin = createAdminClient()
  const { data: legajo } = await admin
    .from("conecta_legajos")
    .select("id")
    .eq("dni", dni)
    .maybeSingle()

  if (!legajo) return null

  const { data: profile } = await admin
    .from("conecta_profiles")
    .select("email")
    .eq("id", legajo.id)
    .maybeSingle()

  return profile?.email ?? null
}
