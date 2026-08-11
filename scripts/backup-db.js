// Backs up every conecta_* table from Supabase into timestamped JSON files.
// Usage: node scripts/backup-db.js
const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const envPath = path.join(__dirname, "..", ".env.local")
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8").trim().split("\n").map((line) => {
    const i = line.indexOf("=")
    return [line.slice(0, i), line.slice(i + 1)]
  })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const TABLES = [
  "conecta_profiles",
  "conecta_legajos",
  "conecta_audit_log",
  "conecta_matriculas",
  "conecta_asistencia",
  "conecta_asistencia_docentes",
  "conecta_carga_horaria",
  "conecta_pagos_docentes",
  "conecta_avisos",
  "conecta_avisos_leidos",
  "conecta_bitacora",
  "conecta_mensajes",
  "conecta_conversaciones",
  "conecta_conversacion_participantes",
  "conecta_grupos",
  "conecta_horarios",
  "conecta_eventos",
  "conecta_interesados",
]

const PAGE_SIZE = 1000

async function fetchAllRows(table) {
  const rows = []
  let from = 0
  while (true) {
    const { data, error } = await supabase.from(table).select("*").range(from, from + PAGE_SIZE - 1)
    if (error) throw new Error(`${table}: ${error.message}`)
    rows.push(...data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
  return rows
}

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const outDir = path.join(__dirname, "..", "backups", timestamp)
  fs.mkdirSync(outDir, { recursive: true })

  const manifest = { timestamp, supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL, tables: {} }

  for (const table of TABLES) {
    process.stdout.write(`Backing up ${table}... `)
    try {
      const rows = await fetchAllRows(table)
      fs.writeFileSync(path.join(outDir, `${table}.json`), JSON.stringify(rows, null, 2))
      manifest.tables[table] = rows.length
      console.log(`${rows.length} filas`)
    } catch (err) {
      manifest.tables[table] = `ERROR: ${err.message}`
      console.log(`ERROR: ${err.message}`)
    }
  }

  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2))
  console.log(`\nBackup completo en: ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
