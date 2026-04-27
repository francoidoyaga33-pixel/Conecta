import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { MensajesClient } from "./MensajesClient"

export default async function MensajesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("conecta_profiles")
    .select("id, nombre, apellido, role, avatar_url")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/login")

  return <MensajesClient currentUser={profile} />
}
