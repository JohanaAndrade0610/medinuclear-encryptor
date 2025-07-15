import { FileEncryptionUseCase } from './usecases/FileEncryptionUseCase';
import { BannerService } from './services/BannerService';
import { MessagesService } from './services/MessagesService';
import { UserInterfaceService } from './services/UserInterfaceService';
import { LicenseManager } from './security/SimpleLicenseManager';
import * as path from 'path';
import * as fs from 'fs';

// Variable global para el banner service
let globalBannerService: BannerService;

// Función para restaurar la terminal al salir
function restoreTerminalOnExit() {
  if (globalBannerService) {
    globalBannerService.restoreTerminal();
  }
}

// Configurar manejadores de eventos de salida
process.on('exit', restoreTerminalOnExit);
process.on('SIGINT', () => {
  restoreTerminalOnExit();
  process.exit(0);
});
process.on('SIGTERM', () => {
  restoreTerminalOnExit();
  process.exit(0);
});

// Función principal
async function main(): Promise<void> {
  // Inicializar servicios
  const bannerService = new BannerService();
  globalBannerService = bannerService; // Asignar a la variable global
  const messagesService = new MessagesService();
  const uiService = new UserInterfaceService(messagesService, bannerService);
  const licenseManager = new LicenseManager();
  
  // Mostrar banner de bienvenida
  bannerService.showWelcomeBanner();

  // Validar licencia antes de continuar
  uiService.showLicenseValidationBanner();
  
  try {
    const licenseValidation = await licenseManager.validateLicense();
    
    if (!licenseValidation.isValid) {
      uiService.showAccessDeniedBanner(licenseValidation.message);
      await uiService.showExitMessage();
      process.exit(1);
    }
    
    // Licencia válida, mostrar confirmación
    uiService.showLicenseValidBanner();
  } catch (error) {
    uiService.showLicenseErrorBanner(String(error));
    await uiService.showExitMessage();
    process.exit(1);
  }
  
  let continueProcessing = true;

  while (continueProcessing) {
    try {
      const folderToEncrypt = await uiService.askForFolderPath();
      
      if (!folderToEncrypt) {
        uiService.showInvalidPathMessage();
        continue;
      }

      const absoluteFolderPath = path.resolve(folderToEncrypt);

      // Validar que la carpeta existe
      if (!uiService.validateFolderPath(absoluteFolderPath)) {
        continue;
      }

      // Configurar carpeta de salida (relativa al ejecutable)
      const executableDir = path.dirname(process.execPath);
      const outputFolder = path.join(executableDir, 'tmp', 'archivos_cifrados');
      
      // Si estamos en desarrollo, usar la ruta local
      const finalOutputFolder = fs.existsSync(executableDir + '\\secrets') 
        ? outputFolder 
        : path.resolve('tmp', 'archivos_cifrados');
        
      if (!fs.existsSync(finalOutputFolder)) {
        fs.mkdirSync(finalOutputFolder, { recursive: true });
      }

      // Mostrar banner de inicio de proceso
      uiService.showProcessStartBanner(absoluteFolderPath);

      const fileEncryptionUseCase = new FileEncryptionUseCase();

      // Iniciar el proceso de cifrado
      const startTime = Date.now();
      await fileEncryptionUseCase.encryptAllFilesInFolder(absoluteFolderPath, finalOutputFolder);
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      // Mostrar banner de proceso completado
      uiService.showProcessCompletedBanner(finalOutputFolder);

      // Preguntar si desea continuar
      continueProcessing = await uiService.askToContinue();

    } catch (error) {
      // Mostrar banner de error
      uiService.showErrorBanner(error);

      // Preguntar si desea intentar con otra carpeta
      continueProcessing = await uiService.askToContinue();
    }
  }

  // Mostrar mensaje de despedida y esperar tecla
  await uiService.showExitMessage();
  process.exit(0);
}

// Ejecutar la aplicación
main().catch((error) => {
  console.error('Error fatal en la aplicación:', error);
  process.exit(1);
});