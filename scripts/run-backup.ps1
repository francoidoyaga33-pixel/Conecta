# Weekly wrapper: exports every conecta_* table, zips the result, and prunes old backups.
# Run manually with: powershell -ExecutionPolicy Bypass -File scripts\run-backup.ps1
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Carpeta de Google Drive (Google Drive para escritorio) donde se copia cada backup.
# Si esta ruta no existe en la PC donde corre el script, la copia a Drive simplemente se omite.
$driveBackupDir = "G:\My Drive\Conecta Backups"

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

    if (Test-Path (Split-Path -Parent $driveBackupDir)) {
        New-Item -ItemType Directory -Force -Path $driveBackupDir | Out-Null
        Copy-Item -Path $zipName -Destination $driveBackupDir -Force
        Log "Backup copiado a Google Drive: $driveBackupDir\$(Split-Path -Leaf $zipName)"
    } else {
        Log "AVISO: no se encontró Google Drive ($driveBackupDir); se omitió la copia a Drive."
    }

    # Retención: conservar solo los últimos 90 días de backups .zip
    $cutoff = (Get-Date).AddDays(-90)
    Get-ChildItem -Path "backups" -Filter "conecta-backup-*.zip" |
        Where-Object { $_.LastWriteTime -lt $cutoff } |
        ForEach-Object {
            Remove-Item -Force $_.FullName
            Log "Backup viejo eliminado: $($_.Name)"
        }
    if (Test-Path $driveBackupDir) {
        Get-ChildItem -Path $driveBackupDir -Filter "conecta-backup-*.zip" |
            Where-Object { $_.LastWriteTime -lt $cutoff } |
            ForEach-Object {
                Remove-Item -Force $_.FullName
                Log "Backup viejo eliminado de Drive: $($_.Name)"
            }
    }

    Log "Backup semanal completado con éxito."
}
catch {
    Log "ERROR: $($_.Exception.Message)"
    throw
}
