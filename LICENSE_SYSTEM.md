# Sistema de Licencias por MAC Address

## Descripción

Este sistema protege la aplicación de cifrado mediante validación de direcciones MAC autorizadas. Solo los equipos con MAC addresses registradas pueden ejecutar el software.

## Características

- ✅ **Validación por MAC Address**: Solo equipos autorizados pueden usar la aplicación
- 🔐 **Archivo de licencia cifrado**: Las MACs se almacenan de forma segura
- ⏰ **Fechas de expiración**: Opcional para limitar el tiempo de uso
- 🚫 **Acceso denegado**: Mensajes claros cuando el acceso es rechazado
- 📋 **Fácil administración**: Scripts para generar y gestionar licencias

## Instalación y Configuración

### 1. Generar el archivo de licencia inicial

```bash
npm run generate-license
```

Este comando:
- Detecta automáticamente la MAC del equipo actual
- Crea un archivo `secrets/license.enc` cifrado
- Incluye la MAC actual como autorizada

### 2. Agregar más equipos autorizados

Edita el archivo `src/generateLicense.ts` y agrega las MACs en el array `authorizedMacs`:

```typescript
authorizedMacs: [
  currentMac, // MAC actual (automática)
  'AABBCCDDEEFF', // MAC del equipo 1
  '112233445566', // MAC del equipo 2
  '998877665544'  // MAC del equipo 3
],
```

Luego regenera la licencia:
```bash
npm run generate-license
```

### 3. Configurar fecha de expiración (opcional)

En `src/generateLicense.ts`, descomenta y configura:

```typescript
expirationDate: '2024-12-31T23:59:59.000Z'
```

## Obtener la MAC Address de un equipo

### Método 1: Ejecutar el generador de licencias
```bash
npm run generate-license
```
Mostrará la MAC detectada al inicio.

### Método 2: Comando del sistema

**Windows:**
```cmd
getmac /format:table
```

**Linux/Mac:**
```bash
ifconfig | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}'
```

### Método 3: Código JavaScript
```javascript
const getmac = require('getmac');
getmac.getMac((err, macAddress) => {
  console.log('MAC:', macAddress.replace(/[:-]/g, '').toUpperCase());
});
```

## Estructura de archivos

```
secrets/
├── license.enc          # Archivo de licencia cifrado
└── rsa_public_mlls.pem  # Clave pública RSA

src/
├── LicenseManager.ts    # Gestor principal de licencias
├── generateLicense.ts   # Script para generar licencias
└── index.ts            # Aplicación principal (incluye validación)
```

## Flujo de validación

1. **Al iniciar la aplicación**:
   - Se muestra el banner de bienvenida
   - Se ejecuta la validación de licencia
   - Se obtiene la MAC del equipo actual

2. **Validación**:
   - Se lee y descifra el archivo `license.enc`
   - Se compara la MAC actual con las autorizadas
   - Se verifica la fecha de expiración (si existe)

3. **Resultados**:
   - ✅ **Éxito**: Continúa con el flujo normal
   - ❌ **Fallo**: Muestra error y termina la aplicación

## Mensajes de error

- **MAC no autorizada**: "Acceso denegado."
- **Licencia expirada**: "Licencia expirada. Fecha de expiración: YYYY-MM-DD"
- **Archivo no encontrado**: "Archivo de licencia no encontrado"
- **Error de descifrado**: "Error al leer archivo de licencia"

## Administración de licencias

### Agregar un nuevo equipo

1. Obtén la MAC del nuevo equipo
2. Edita `src/generateLicense.ts`
3. Agrega la nueva MAC al array `authorizedMacs`
4. Ejecuta `npm run generate-license`
5. Distribuye el nuevo archivo `secrets/license.enc`

### Revocar acceso a un equipo

1. Edita `src/generateLicense.ts`
2. Elimina la MAC del array `authorizedMacs`
3. Ejecuta `npm run generate-license`
4. Distribuye el archivo actualizado

### Extender fecha de expiración

1. Edita `src/generateLicense.ts`
2. Actualiza la fecha en `expirationDate`
3. Ejecuta `npm run generate-license`

## Seguridad

- **Cifrado AES-256-CBC**: El archivo de licencia está cifrado
- **Clave de cifrado**: Embebida en el código (modificable)
- **Normalización**: Las MACs se almacenan sin separadores y en mayúsculas
- **Validación estricta**: Coincidencia exacta requerida

## Distribución

Al distribuir la aplicación, incluye:
- El ejecutable compilado
- La carpeta `secrets/` con el archivo `license.enc`
- Las instrucciones para el usuario final

## Ejemplo de uso

```typescript
import { LicenseManager } from './LicenseManager';

const licenseManager = new LicenseManager();

// Validar licencia
const validation = await licenseManager.validateLicense();
if (!validation.isValid) {
  console.error('Acceso denegado:', validation.message);
  process.exit(1);
}

console.log('✅ Licencia válida, continuando...');
```

## Troubleshooting

### Error: "Module not found: getmac"
```bash
npm install getmac
```

### Error: "Archivo de licencia no encontrado"
```bash
npm run generate-license
```

### La MAC no coincide en diferentes interfaces
El sistema usa la MAC principal del equipo. Si hay múltiples interfaces, asegúrate de registrar la correcta.
