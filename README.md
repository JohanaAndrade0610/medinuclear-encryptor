# Sistema de Cifrado de Archivos Empresarial

## 🔐 Descripción
Sistema de cifrado de archivos empresarial que permite cifrar carpetas completas de forma segura usando cifrado híbrido RSA + AES.

## 📋 Características
- ✅ Cifrado híbrido RSA-2048 + AES-256
- ✅ Interfaz de usuario interactiva
- ✅ Procesamiento recursivo de carpetas
- ✅ Ejecutable standalone (no requiere instalación de Node.js)
- ✅ Validación de rutas y manejo de errores
- ✅ Mensajes informativos detallados

## 🚀 Uso para Desarrolladores

### Instalación de dependencias
```bash
npm install
```

### Compilación
```bash
npm run build
```

### Ejecución en modo desarrollo
```bash
npm start
```

### Crear ejecutable distribuible
```bash
npm run build:exe
```

O usar los scripts automatizados:
- **Windows CMD**: `build.bat`
- **PowerShell**: `build.ps1`

## 📦 Distribución

### Para crear el paquete de distribución:
1. Ejecutar `build.bat` o `build.ps1`
2. Se creará la carpeta `build/` con:
   - `index.exe` - Ejecutable principal
   - `secrets/` - Carpeta con la llave pública RSA
   - `tmp/` - Carpeta para archivos cifrados

### Para entregar a los usuarios finales:
1. Copiar toda la carpeta `build/`
2. El usuario solo necesita ejecutar `index.exe`
3. No requiere instalación de Node.js ni Visual Studio

## 🔧 Estructura del Proyecto
```
cifrado-archivos/
├── src/
│   ├── index.ts                 # Punto de entrada con interfaz de usuario
│   └── FileEncryptionUseCase.ts # Lógica de cifrado
├── secrets/
│   └── rsa_public_mlls.pem      # Llave pública RSA
├── tmp/
│   └── archivos_cifrados/       # Archivos cifrados de salida
├── build/                       # Ejecutables compilados
├── dist/                        # JavaScript compilado
├── package.json
├── tsconfig.json
├── build.bat                    # Script de compilación (CMD)
└── build.ps1                    # Script de compilación (PowerShell)
```

## 🔐 Seguridad
- Cifrado RSA-2048 para las claves AES
- Cifrado AES-256-CBC para los archivos
- IV únicos para cada archivo
- Preservación de extensiones de archivo
- Claves AES aleatorias por archivo

## ⚡ Rendimiento
- Procesamiento asíncrono
- Manejo eficiente de memoria
- Soporte para archivos grandes
- Procesamiento recursivo de carpetas

## 🆘 Solución de Problemas

### Error "No se pudo encontrar la llave pública RSA"
- Verificar que existe `secrets/rsa_public_mlls.pem`
- Asegurar que la carpeta `secrets/` se incluye en la distribución

### Error de permisos
- Ejecutar como administrador si es necesario
- Verificar permisos de escritura en la carpeta de destino

### Error "La carpeta no existe"
- Verificar que la ruta ingresada es correcta
- Usar rutas absolutas o relativas válidas
- Evitar caracteres especiales en las rutas
