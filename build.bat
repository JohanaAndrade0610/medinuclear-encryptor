@echo off
echo ===================================================
echo      COMPILANDO SISTEMA DE CIFRADO DE ARCHIVOS
echo ===================================================

echo.
echo [1/4] Instalando dependencias...
call npm install

echo.
echo [2/4] Compilando TypeScript...
call npm run build

echo.
echo [3/4] Creando ejecutable...
call npm run build:exe

echo.
echo [4/4] Copiando archivos necesarios...
if not exist "build\secrets" mkdir "build\secrets"
copy "secrets\*.pem" "build\secrets\"
if not exist "build\tmp" mkdir "build\tmp"

echo.
echo ===================================================
echo           ¡COMPILACION COMPLETADA!
echo ===================================================
echo.
echo El ejecutable se encuentra en: build\index.exe
echo.
echo Para distribuir, copie toda la carpeta "build" 
echo junto con la subcarpeta "secrets"
echo.
pause
