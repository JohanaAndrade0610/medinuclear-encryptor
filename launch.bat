@echo off
REM Lanzador normal para MEDINUCLEAR Encriptador
title MEDINUCLEAR Encriptador

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
