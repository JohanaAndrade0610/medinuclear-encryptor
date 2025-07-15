# Lanzador normal para MEDINUCLEAR Encriptador
$Host.UI.RawUI.WindowTitle = "MEDINUCLEAR Encriptador"

Write-Host "Iniciando MEDINUCLEAR Encriptador..."

# Ejecutar la aplicación
if (Test-Path "build\index-win.exe") {
    & "build\index-win.exe"
}
elseif (Test-Path "MEDINUCLEAR_Encriptador\index-win.exe") {
    & "MEDINUCLEAR_Encriptador\index-win.exe"
}
else {
    Write-Host "No se encontró el ejecutable de la aplicación" -ForegroundColor Red
    Write-Host "Verifica que el archivo index-win.exe esté en la carpeta build o MEDINUCLEAR_Encriptador" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
}
