# NOTE: Decide if will run library upgrade to export to this project
$ErrorActionPreference = 'Stop'
$popLocation = $false
if ($PWD.Path -ne $PSScriptRoot) {
  Write-Host ("Set Location to: {0}" -f $PSScriptRoot)
  Push-Location -Path $PSScriptRoot
  $popLocation = $true
}

$configToml = Join-Path -Path $PWD -ChildPath 'config.toml'
if (-not (Test-Path $configToml)) {
  Write-Error -Message ("Invalid Hugo directory. Config file not found: {0}" -f $configToml)
}

# Run Hugo Commands for building
hugo --cleanDestinationDir

# Copy CNAME to docs folder
$cname = Join-Path -Path $PSScriptRoot -ChildPath 'CNAME'
if (-not (Test-Path $cname)) {
  Write-Error -Message ("CNAME file not found! At {0}" -f $cname)
}

Write-Host "Copying CNAME..." -NoNewline
$dest = Join-Path -Path $PSScriptRoot -ChildPath 'docs'
Copy-Item -Path $cname -Destination $dest
Write-Host "DONE" -ForegroundColor Green

if ($true -eq $popLocation) {
  Pop-Location
}