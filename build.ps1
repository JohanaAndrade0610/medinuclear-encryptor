# Script de compilación para PowerShell
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "     COMPILANDO SISTEMA DE CIFRADO DE ARCHIVOS" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "[1/4] Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "[2/4] Compilando TypeScript..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "[3/4] Creando ejecutable..." -ForegroundColor Yellow
npm run build:exe

Write-Host ""
Write-Host "[4/4] Copiando archivos necesarios..." -ForegroundColor Yellow
if (!(Test-Path "build\secrets")) {
    New-Item -ItemType Directory -Path "build\secrets" -Force
}
Copy-Item "secrets\*.pem" "build\secrets\"

if (!(Test-Path "build\tmp")) {
    New-Item -ItemType Directory -Path "build\tmp" -Force
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "          ¡COMPILACION COMPLETADA!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Write-Host "El ejecutable se encuentra en: build\index.exe" -ForegroundColor White
Write-Host ""
Write-Host "Para distribuir, copie toda la carpeta 'build'" -ForegroundColor White
Write-Host "junto con la subcarpeta 'secrets'" -ForegroundColor White
Write-Host ""
Read-Host "Presione Enter para continuar"
