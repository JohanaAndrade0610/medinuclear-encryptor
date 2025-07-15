import * as readline from 'readline';
import * as fs from 'fs';
import { MessagesService } from './MessagesService';
import { BannerService } from './BannerService';

export class UserInterfaceService {
  constructor(
    private messagesService: MessagesService,
    private bannerService: BannerService
  ) {}

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
        resolve(answer.trim().replace(/"/g, '')); // Remover comillas si las hay
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
    if (!fs.existsSync(folderPath)) {
      const errorMessage = this.messagesService.getError('folderNotExists', { path: folderPath });
      this.bannerService.showMessage(errorMessage, 'error');
      return false;
    }

    if (!fs.statSync(folderPath).isDirectory()) {
      const errorMessage = this.messagesService.getError('notValidFolder', { path: folderPath });
      this.bannerService.showMessage(errorMessage, 'error');
      return false;
    }

    return true;
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
  public showProcessCompletedBanner(outputPath: string): void {
    this.bannerService.showSectionSeparator();
    this.bannerService.showMessage(this.messagesService.getSuccess('processCompleted'), 'success');
    this.bannerService.showSectionSeparator();
    this.bannerService.showMessage(this.messagesService.getSuccess('filesLocation', { path: outputPath }), 'info');
    this.bannerService.showSectionSeparator();
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
