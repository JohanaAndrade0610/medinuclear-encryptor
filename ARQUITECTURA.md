# Arquitectura del Proyecto - Sistema de Encriptación MEDINUCLEAR

## 📁 Estructura de Carpetas

```
src/
├── index.ts                    # Punto de entrada principal
├── services/                   # Servicios de aplicación
│   ├── BannerService.ts       # Manejo de banners y UI visual
│   ├── MessagesService.ts     # Gestión de mensajes del sistema
│   ├── UserInterfaceService.ts # Interfaz de usuario e interacciones
│   └── index.ts               # Exports del módulo services
├── security/                   # Módulos de seguridad
│   ├── DateLicenseManager.ts   # Gestor de licencias con fecha
│   ├── generateLicense.ts      # Generador de licencias
│   ├── LicenseManager.ts       # Interfaz base de licencias
│   ├── SimpleLicenseManager.ts # Implementación simple de licencias
│   └── index.ts               # Exports del módulo security
├── usecases/                   # Casos de uso del negocio
│   ├── FileEncryptionUseCase.ts # Lógica principal de encriptación
│   └── index.ts               # Exports del módulo usecases
└── tests/                      # Archivos de pruebas
    └── testAccessDenied.ts     # Test de acceso denegado
```

## 🏗️ Principios de Arquitectura

### **Separación de Responsabilidades**
- **Services**: Servicios de infraestructura (UI, mensajes, banners)
- **Security**: Todo lo relacionado con licencias y seguridad
- **Usecases**: Lógica de negocio principal (encriptación)
- **Tests**: Pruebas unitarias y de integración

### **Imports Organizados**
Cada carpeta tiene su propio `index.ts` que facilita los imports:

```typescript
// Antes
import { BannerService } from './services/BannerService';
import { MessagesService } from './services/MessagesService';

// Ahora
import { BannerService, MessagesService } from './services';
```

### **Beneficios de esta Estructura**

1. **Mantenibilidad**: Código organizado por responsabilidades
2. **Escalabilidad**: Fácil agregar nuevos servicios o casos de uso
3. **Legibilidad**: Estructura clara y autodocumentada
4. **Reutilización**: Módulos independientes y reutilizables
5. **Testing**: Separación clara facilita las pruebas

### **Flujo de Dependencias**

```
index.ts
├── services/ (UI e interacciones)
├── security/ (Validación de licencias)
└── usecases/ (Lógica de encriptación)
```

### **Próximos Pasos Recomendados**

1. Agregar interfaces para mayor desacoplamiento
2. Implementar inyección de dependencias
3. Agregar más tests unitarios
4. Documentar cada módulo con JSDoc
