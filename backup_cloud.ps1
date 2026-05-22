param(
  [switch]$SaveCredentials
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackupRoot = Join-Path $ProjectRoot "backups\nube"
$ConfigPath = Join-Path $BackupRoot "backup-config.json"
$DefaultUrl = "https://cm-odontologia-sistema.onrender.com"

function Ensure-BackupFolder {
  if (-not (Test-Path $BackupRoot)) {
    New-Item -ItemType Directory -Path $BackupRoot | Out-Null
  }
}

function Read-PlainPasswordFromSecureString($securePassword) {
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

function Save-BackupCredentials {
  Ensure-BackupFolder
  $url = Read-Host "URL del sistema [$DefaultUrl]"
  if ([string]::IsNullOrWhiteSpace($url)) { $url = $DefaultUrl }
  $username = Read-Host "Usuario administrador"
  $securePassword = Read-Host "Contrasena" -AsSecureString
  $encryptedPassword = $securePassword | ConvertFrom-SecureString

  $config = [ordered]@{
    url = $url.TrimEnd("/")
    username = $username
    password = $encryptedPassword
    createdAt = (Get-Date).ToString("s")
  }

  $config | ConvertTo-Json | Set-Content -Path $ConfigPath -Encoding UTF8
  Write-Host ""
  Write-Host "Credenciales guardadas en:"
  Write-Host $ConfigPath
  Write-Host "La contrasena queda cifrada para este usuario de Windows."
}

function Load-BackupCredentials {
  if (-not (Test-Path $ConfigPath)) {
    throw "No existe configuracion. Ejecuta primero: powershell -ExecutionPolicy Bypass -File backup_cloud.ps1 -SaveCredentials"
  }

  $config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
  $securePassword = $config.password | ConvertTo-SecureString
  $password = Read-PlainPasswordFromSecureString $securePassword

  return [ordered]@{
    url = [string]$config.url
    username = [string]$config.username
    password = $password
  }
}

function Export-CsvIfArray($folder, $name, $items) {
  if ($null -eq $items) { return }
  if ($items.Count -eq 0) {
    "" | Set-Content -Path (Join-Path $folder "$name.csv") -Encoding UTF8
    return
  }
  $items | Export-Csv -Path (Join-Path $folder "$name.csv") -NoTypeInformation -Encoding UTF8
}

if ($SaveCredentials) {
  Save-BackupCredentials
  exit 0
}

Ensure-BackupFolder
$credentials = Load-BackupCredentials
$stamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
$destination = Join-Path $BackupRoot "respaldo-$stamp"
New-Item -ItemType Directory -Path $destination | Out-Null

$loginBody = @{
  username = $credentials.username
  password = $credentials.password
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "$($credentials.url)/api/login" -Method Post -ContentType "application/json" -Body $loginBody
$headers = @{ Authorization = "Bearer $($login.token)" }
$data = Invoke-RestMethod -Uri "$($credentials.url)/api/bootstrap" -Method Get -Headers $headers

$data | ConvertTo-Json -Depth 20 | Set-Content -Path (Join-Path $destination "respaldo-completo.json") -Encoding UTF8
Export-CsvIfArray $destination "pacientes" $data.patients
Export-CsvIfArray $destination "agenda-citas" $data.appointments
Export-CsvIfArray $destination "historial-clinico" $data.clinicalHistory
Export-CsvIfArray $destination "pagos" $data.payments
Export-CsvIfArray $destination "egresos" $data.expenses
Export-CsvIfArray $destination "caja-diaria" $data.cashSessions
Export-CsvIfArray $destination "caja-chica" $data.pettyCashAllocations
Export-CsvIfArray $destination "tratamientos" $data.treatments
Export-CsvIfArray $destination "odontograma" $data.odontogram

Write-Host "Respaldo creado correctamente:"
Write-Host $destination
