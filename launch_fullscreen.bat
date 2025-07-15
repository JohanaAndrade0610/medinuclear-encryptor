@echo off
REM Lanzador en pantalla completa para MEDINUCLEAR Encriptador
title MEDINUCLEAR Encriptador

REM Maximizar la ventana de la consola
powershell -Command "& {Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\"user32.dll\")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); [DllImport(\"kernel32.dll\")] public static extern IntPtr GetConsoleWindow(); }'; $consolePtr = [Win32]::GetConsoleWindow(); [Win32]::ShowWindow($consolePtr, 3)}"

REM Configurar el buffer de la consola para pantalla completa
mode con cols=200 lines=50

REM Ejecutar la aplicación
if exist "build\index-win.exe" (
    "build\index-win.exe"
) else if exist "MEDINUCLEAR_Encriptador\index-win.exe" (
    "MEDINUCLEAR_Encriptador\index-win.exe"
) else (
    echo No se encontró el ejecutable de la aplicación
    echo Verifica que el archivo index-win.exe esté en la carpeta build o MEDINUCLEAR_Encriptador
    pause
)

pause
