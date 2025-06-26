import { FileEncryptionUseCase } from './FileEncryptionUseCase';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

// Función para mostrar el banner de bienvenida
function showWelcomeBanner(): void {
  console.clear();
  console.log('=======================================================================');
  console.log('           BIENVENIDO AL SISTEMA DE ENCRIPTACION MEDINUCLEAR');
  console.log('=======================================================================');
  console.log('              Version 1.0.0 - Seguridad Garantizada');
  console.log('=======================================================================');
}

// Función para solicitar la ruta de entrada
function askForFolderPath(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('[+] Ingrese la ruta completa de la carpeta a cifrar:\n> ', (answer) => {
      rl.close();
      resolve(answer.trim().replace(/"/g, '')); // Remover comillas si las hay
    });
  });
}

// Función para validar que la carpeta existe
function validateFolderPath(folderPath: string): boolean {
  if (!fs.existsSync(folderPath)) {
    console.log(`[!] Error: La carpeta "${folderPath}" no existe.`);
    return false;
  }

  if (!fs.statSync(folderPath).isDirectory()) {
    console.log(`[!] Error: "${folderPath}" no es una carpeta valida.`);
    return false;
  }

  return true;
}

// Función para preguntar si desea continuar
function askToContinue(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\n¿Desea cifrar otra carpeta? (S/N): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith('s'));
    });
  });
}

// Función principal
async function main(): Promise<void> {
  showWelcomeBanner();
  
  let continueProcessing = true;

  while (continueProcessing) {
    try {
      const folderToEncrypt = await askForFolderPath();
      
      if (!folderToEncrypt) {
        console.log('[!] No se proporciono una ruta valida.');
        continue;
      }

      const absoluteFolderPath = path.resolve(folderToEncrypt);

      // Validar que la carpeta existe
      if (!validateFolderPath(absoluteFolderPath)) {
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

      console.log('\n===============================================================');
      console.log('[*] INICIANDO PROCESO DE CIFRADO...');
      console.log('===============================================================');
      console.log(`[+] Carpeta origen: ${absoluteFolderPath}`);

      const fileEncryptionUseCase = new FileEncryptionUseCase();

      // Iniciar el proceso de cifrado
      const startTime = Date.now();
      await fileEncryptionUseCase.encryptAllFilesInFolder(absoluteFolderPath, finalOutputFolder);
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      console.log('\n===============================================================');
      console.log('[+] PROCESO COMPLETADO EXITOSAMENTE!');
      console.log('===============================================================');
      console.log(`[+] Los archivos cifrados se encuentran en: ${finalOutputFolder}`);
      console.log('===============================================================');

      // Preguntar si desea continuar
      continueProcessing = await askToContinue();

    } catch (error) {
      console.log('\n===============================================================');
      console.log('[!] ERROR DURANTE EL CIFRADO');
      console.log('===============================================================');
      console.error('Detalles del error:', error);
      console.log('===============================================================');

      // Preguntar si desea intentar con otra carpeta
      continueProcessing = await askToContinue();
    }
  }

  console.log('\n[*] Gracias por usar el Sistema de Encriptado MEDINUCLEAR');
  console.log('    Presione cualquier tecla para salir...');
  
  // Esperar input antes de cerrar
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', () => {
    process.exit(0);
  });
}

// Ejecutar la aplicación
main().catch((error) => {
  console.error('Error fatal en la aplicación:', error);
  process.exit(1);
});