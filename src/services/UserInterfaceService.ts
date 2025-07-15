import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, exec } from 'child_process';
import { MessagesService } from './MessagesService';
import { BannerService } from './BannerService';

export class UserInterfaceService {
  constructor(
    private messagesService: MessagesService,
    private bannerService: BannerService
  ) { }

  /**
   * Solicita la ruta de la carpeta a cifrar
   */
  public askForFolderPath(): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const prompt = this.messagesService.getPrompt('folderPath');
      rl.question(prompt, (answer) => {
        rl.close();
        // Procesar la ruta para manejar diferentes escenarios de entrada
        let processedPath = answer.trim();

        // Caso especial: PowerShell drag-and-drop format "& 'path'" o "& \"path\""
        if (processedPath.startsWith('& ')) {
          processedPath = processedPath.substring(2).trim();
        }

        // Quitar comillas externas si existen
        if (
          (processedPath.startsWith('"') && processedPath.endsWith('"')) ||
          (processedPath.startsWith("'") && processedPath.endsWith("'"))
        ) {
          processedPath = processedPath.substring(1, processedPath.length - 1);
        }

        // Si la ruta no es absoluta, se intenta resolverla
        if (!path.isAbsolute(processedPath) && processedPath.includes(':')) {
          try {
            processedPath = path.resolve(processedPath);
          } catch (e) {
            // Si hay un error al resolver la ruta, mantener la original
          }
        }

        resolve(processedPath);
      });
    });
  }

  /**
   * Pregunta si el usuario desea continuar procesando más carpetas
   */
  public askToContinue(): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const prompt = this.messagesService.getPrompt('continueProcessing');
      rl.question(prompt, (answer) => {
        rl.close();
        resolve(answer.toLowerCase().startsWith('s'));
      });
    });
  }

  /**
   * Valida que la carpeta existe y es válida
   */
  public validateFolderPath(folderPath: string): boolean {
    try {
      // Intentar normalizar la ruta para manejar casos especiales
      const normalizedPath = path.normalize(folderPath);

      if (!fs.existsSync(normalizedPath)) {
        const errorMessage = this.messagesService.getError('folderNotExists', { path: normalizedPath });
        this.bannerService.showMessage(errorMessage, 'error');

        // Intentar ayudar al usuario mostrando información adicional
        console.log(`Sugerencia: Asegúrese que la ruta sea correcta y esté completa.`);
        console.log(`Ruta ingresada: ${folderPath}`);
        console.log(`Ruta normalizada: ${normalizedPath}`);

        return false;
      }

      if (!fs.statSync(normalizedPath).isDirectory()) {
        const errorMessage = this.messagesService.getError('notValidFolder', { path: normalizedPath });
        this.bannerService.showMessage(errorMessage, 'error');
        return false;
      }

      return true;
    } catch (error) {
      // En caso de error al procesar la ruta
      const errorMessage = this.messagesService.getError('folderNotExists', { path: folderPath });
      this.bannerService.showMessage(errorMessage, 'error');
      console.error('Error al validar la ruta:', error);
      return false;
    }
  }

  /**
   * Muestra el banner de inicio de proceso
   */
  public showProcessStartBanner(sourcePath: string): void {
    this.bannerService.showSectionSeparator();
    this.bannerService.showMessage(this.messagesService.getInfo('startingProcess'), 'info');
    this.bannerService.showSectionSeparator();
    this.bannerService.showMessage(this.messagesService.getInfo('sourceFolder', { path: sourcePath }), 'success');
  }

  /**
   * Muestra el banner de proceso completado
   */
  public showProcessCompletedBanner(outputPath: string): Promise<void> {
    this.bannerService.showSectionSeparator();
    this.bannerService.showMessage(this.messagesService.getSuccess('processCompleted'), 'success');
    this.bannerService.showSectionSeparator();
    this.bannerService.showMessage(this.messagesService.getSuccess('filesLocation', { path: outputPath }), 'info');
    this.bannerService.showSectionSeparator();

    // Preguntar si quiere abrir la carpeta de destino
    return this.askToOpenOutputFolder(outputPath);
  }

  /**
   * Pregunta si desea abrir la carpeta de salida
   */
  public askToOpenOutputFolder(outputPath: string): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const prompt = this.messagesService.getPrompt('openOutputFolder');
      rl.question(prompt, (answer) => {
        rl.close();
        if (answer.toLowerCase().startsWith('s')) {
          this.openOutputFolder(outputPath);
        }
        resolve();
      });
    });
  }

  /**
   * Abre la carpeta de salida donde están los archivos cifrados
   */
  private openOutputFolder(folderPath: string): void {
    try {
      // En Windows, tenemos varias opciones para abrir una carpeta
      if (process.platform === 'win32') {
        console.log(`[*] Abriendo carpeta: ${folderPath}`);

        // Normalizar la ruta para asegurar formato correcto en Windows
        const normalizedPath = path.normalize(folderPath);

        // Implementar múltiples métodos, intentando primero con los más efectivos

        // Método 1: Usar el comando "start" que funciona mejor para abrir una ventana del explorador
        exec(`start explorer "${normalizedPath}"`, { windowsHide: false }, (error) => {
          if (error) {
            console.log(`Intentando método alternativo para abrir la carpeta...`);

            // Método 2: Usar explorer.exe con parámetro "/n,/e," para forzar una nueva ventana
            exec(`explorer.exe /n,/e,"${normalizedPath}"`, { windowsHide: false }, (error2) => {
              if (error2) {
                // Método 3: Usar explorer.exe directo
                spawn('explorer.exe', [normalizedPath], { detached: true, windowsHide: false });
              }
            });
          }
        });
      }
      // En macOS, usar 'open'
      else if (process.platform === 'darwin') {
        spawn('open', [folderPath], { detached: true });
      }
      // En Linux, usar 'xdg-open'
      else if (process.platform === 'linux') {
        spawn('xdg-open', [folderPath], { detached: true });
      }
    } catch (error) {
      console.error('Error al intentar abrir la carpeta de destino:', error);
      console.log(`La carpeta se encuentra en: ${folderPath}`);
    }
  }

  /**
   * Muestra el banner de error
   */
  public showErrorBanner(error: any): void {
    this.bannerService.showSectionSeparator();
    this.bannerService.showMessage(this.messagesService.getError('encryptionError'), 'error');
    this.bannerService.showSectionSeparator();
    console.error('Detalles del error:', error);
    this.bannerService.showSectionSeparator();
  }

  /**
   * Muestra el mensaje de despedida y espera input para salir
   */
  public showExitMessage(): Promise<void> {
    const thankYouMessage = this.messagesService.getInfo('thankYou');
    const pressKeyMessage = this.messagesService.getInfo('pressAnyKey');

    console.log(`\n[*] ${thankYouMessage}`);
    console.log(`    ${pressKeyMessage}`);

    return new Promise((resolve) => {
      // Esperar input antes de cerrar
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', () => {
        resolve();
      });
    });
  }

  /**
   * Muestra un mensaje de validación cuando no se proporciona ruta válida
   */
  public showInvalidPathMessage(): void {
    const message = this.messagesService.getError('noValidPath');
    this.bannerService.showMessage(message, 'error');
  }

  /**
   * Muestra el banner de validación de licencia
   */
  public showLicenseValidationBanner(): void {
    this.bannerService.showSectionSeparator();
    this.bannerService.showMessage(this.messagesService.getInfo('checkingLicense'), 'info');
    this.bannerService.showSectionSeparator();
  }

  /**
   * Muestra el banner de licencia válida
   */
  public showLicenseValidBanner(): void {
    this.bannerService.showMessage(this.messagesService.getSuccess('licenseValid'), 'success');
  }

  /**
   * Muestra el banner de acceso denegado
   */
  public showAccessDeniedBanner(reason: string): void {
    this.bannerService.showMessage(this.messagesService.getError('accessDenied'), 'error');
    this.bannerService.showSectionSeparator();
  }

  /**
   * Muestra el banner de error de licencia
   */
  public showLicenseErrorBanner(error: string): void {
    this.bannerService.showSectionSeparator();
    this.bannerService.showMessage(this.messagesService.getError('licenseError'), 'error');
    this.bannerService.showSectionSeparator();
    console.error(`Error: ${error}`);
    this.bannerService.showSectionSeparator();
  }
}
