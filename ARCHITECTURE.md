# Arquitectura Refactorizada del Sistema de Encriptación

## Descripción

El código ha sido refactorizado para separar las responsabilidades en diferentes servicios, haciendo el código más modular, mantenible y fácil de personalizar.

## Estructura de Clases

### 1. BannerService
**Archivo:** `src/BannerService.ts`

Responsable de mostrar banners, mensajes formateados y separadores en la consola.

**Métodos principales:**
- `showWelcomeBanner()`: Muestra el banner de bienvenida predeterminado
- `showCustomBanner(asciiArt: string[])`: Muestra un banner personalizado con arte ASCII
- `showSectionSeparator()`: Muestra separadores de sección
- `showMessage(message, type)`: Muestra mensajes con formato específico (info, success, error, warning)

### 2. MessagesService
**Archivo:** `src/MessagesService.ts`

Gestiona todos los textos y mensajes de la aplicación, facilitando la internacionalización.

**Métodos principales:**
- `getPrompt(key)`: Obtiene mensajes de entrada del usuario
- `getError(key, replacements)`: Obtiene mensajes de error
- `getSuccess(key, replacements)`: Obtiene mensajes de éxito
- `getInfo(key, replacements)`: Obtiene mensajes informativos
- `getWarning(key, replacements)`: Obtiene mensajes de advertencia
- `setMessages(newMessages)`: Permite cambiar todos los mensajes (útil para idiomas)

### 3. UserInterfaceService
**Archivo:** `src/UserInterfaceService.ts`

Maneja toda la interacción con el usuario, incluyendo prompts, validaciones y mensajes de estado.

**Métodos principales:**
- `askForFolderPath()`: Solicita la ruta de la carpeta
- `askToContinue()`: Pregunta si continuar procesando
- `validateFolderPath(path)`: Valida que la carpeta existe
- `showProcessStartBanner(path)`: Muestra banner de inicio de proceso
- `showProcessCompletedBanner(path)`: Muestra banner de proceso completado
- `showErrorBanner(error)`: Muestra banner de error
- `showExitMessage()`: Muestra mensaje de despedida

## Personalización

### Cambiar el Banner ASCII

1. Ve a [patorjk.com](https://patorjk.com/software/taag/)
2. Genera tu arte ASCII
3. Usa `bannerService.showCustomBanner(tuArteAscii)`

```typescript
const miAscii = [
  "  ███╗   ███╗██╗    ",
  "  ████╗ ████║██║    ",
  "  ██╔████╔██║██║    ",
  "  ██║╚██╔╝██║██║    ",
  "  ██║ ╚═╝ ██║██║    ",
  "  ╚═╝     ╚═╝╚═╝    "
];

bannerService.showCustomBanner(miAscii);
```

### Cambiar Idioma

```typescript
const englishMessages = {
  prompts: {
    folderPath: '[+] Enter folder path:\n> ',
    continueProcessing: '\nContinue? (Y/N): ',
    // ... más mensajes
  },
  // ... más categorías
};

messagesService.setMessages(englishMessages);
```

### Personalizar Colores

Los colores se definen en `BannerService` y pueden ser modificados editando la propiedad `colors`.

## Ventajas de la Refactorización

1. **Separación de Responsabilidades**: Cada clase tiene una función específica
2. **Fácil Mantenimiento**: Los cambios se hacen en lugares específicos
3. **Reutilización**: Los servicios pueden usarse en otras partes del código
4. **Internacionalización**: Fácil cambio de idiomas
5. **Personalización**: Banners y mensajes personalizables
6. **Testeo**: Cada servicio puede ser probado independientemente

## Uso en el Main

```typescript
// Inicializar servicios
const bannerService = new BannerService();
const messagesService = new MessagesService();
const uiService = new UserInterfaceService(messagesService, bannerService);

// Usar los servicios
bannerService.showWelcomeBanner();
const folderPath = await uiService.askForFolderPath();
// ...
```

## Archivos de Ejemplo

Ver `src/examples/CustomizationExamples.ts` para ejemplos completos de personalización.
