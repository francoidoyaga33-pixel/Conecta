# Weekly wrapper: exports every conecta_* table, zips the result, and prunes old backups.
# Run manually with: powershell -ExecutionPolicy Bypass -File scripts\run-backup.ps1
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$logFile = Join-Path $projectRoot "backups\backup-log.txt"
New-Item -ItemType Directory -Force -Path (Join-Path $projectRoot "backups") | Out-Null

function Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

try {
    Log "Iniciando backup..."
    node scripts/backup-db.js
    if ($LASTEXITCODE -ne 0) { throw "backup-db.js salió con código $LASTEXITCODE" }

    $latest = Get-ChildItem -Path "backups" -Directory |
        Where-Object { $_.Name -match '^\d{4}-\d{2}-\d{2}T' } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (-not $latest) { throw "No se encontró la carpeta de backup recién generada" }

    $zipName = Join-Path "backups" "conecta-backup-$(Get-Date -Format 'yyyy-MM-dd_HHmm').zip"
    Compress-Archive -Path "$($latest.FullName)\*" -DestinationPath $zipName -Force
    Remove-Item -Recurse -Force $latest.FullName
    Log "Backup comprimido en $zipName"

    # Retención: conservar solo los últimos 90 días de backups .zip
    $cutoff = (Get-Date).AddDays(-90)
    Get-ChildItem -Path "backups" -Filter "conecta-backup-*.zip" |
        Where-Object { $_.LastWriteTime -lt $cutoff } |
        ForEach-Object {
            Remove-Item -Force $_.FullName
            Log "Backup viejo eliminado: $($_.Name)"
        }

    Log "Backup semanal completado con éxito."
}
catch {
    Log "ERROR: $($_.Exception.Message)"
    throw
}
