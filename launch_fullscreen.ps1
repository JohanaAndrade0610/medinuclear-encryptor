# Lanzador en pantalla completa para MEDINUCLEAR Encriptador
$Host.UI.RawUI.WindowTitle = "MEDINUCLEAR Encriptador"

# Función para maximizar la ventana de consola
Add-Type -TypeDefinition @'
    using System;
    using System.Runtime.InteropServices;
    public class Win32 {
        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        [DllImport("kernel32.dll")]
        public static extern IntPtr GetConsoleWindow();
        [DllImport("user32.dll")]
        public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
    }
'@

try {
    # Obtener el handle de la ventana de consola
    $consolePtr = [Win32]::GetConsoleWindow()
    
    # Maximizar la ventana (3 = SW_MAXIMIZE)
    [Win32]::ShowWindow($consolePtr, 3)
    
    # Configurar el buffer de la consola
    $console = $Host.UI.RawUI
    $console.BufferSize = New-Object System.Management.Automation.Host.Size(200, 3000)
    $console.WindowSize = New-Object System.Management.Automation.Host.Size(200, 50)
    
    Write-Host "Ventana configurada en pantalla completa" -ForegroundColor Green
} catch {
    Write-Host "No se pudo configurar la pantalla completa automáticamente" -ForegroundColor Yellow
}

# Ejecutar la aplicación
$exePath = ""
if (Test-Path "build\index-win.exe") {
    $exePath = "build\index-win.exe"
} elseif (Test-Path "MEDINUCLEAR_Encriptador\index-win.exe") {
    $exePath = "MEDINUCLEAR_Encriptador\index-win.exe"
} else {
    Write-Host "No se encontró el ejecutable de la aplicación" -ForegroundColor Red
    Write-Host "Verifica que el archivo index-win.exe esté en la carpeta build o MEDINUCLEAR_Encriptador" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host "Ejecutando: $exePath" -ForegroundColor Cyan
& $exePath

Read-Host "Presiona Enter para salir"
