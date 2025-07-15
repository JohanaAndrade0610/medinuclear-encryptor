import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export class FileEncryptionUseCase {
  // LEER LLAVE PUBLICA
  private RSA_PUBLIC_KEY!: string;

  constructor() {
    try {
      // Intentar cargar desde diferentes ubicaciones posibles
      const possiblePaths = [
        './secrets/rsa_public_mlls.pem',
        path.join(__dirname, '../secrets/rsa_public_mlls.pem'),
        path.join(process.cwd(), 'secrets/rsa_public_mlls.pem'),
        path.join(path.dirname(process.execPath), 'secrets/rsa_public_mlls.pem')
      ];

      let keyLoaded = false;
      for (const keyPath of possiblePaths) {
        try {
          if (fs.existsSync(keyPath)) {
            this.RSA_PUBLIC_KEY = fs.readFileSync(keyPath, 'utf-8');
            keyLoaded = true;
            console.log(`\x1b[32m[+] Llave publica cargada desde: ${keyPath}\x1b[0m`);
            console.log(''); // Salto de línea
            break;
          }
        } catch (error) {
          // Continuar con la siguiente ruta
        }
      }

      if (!keyLoaded) {
        throw new Error('No se pudo encontrar la llave pública RSA');
      }
    } catch (error) {
      console.error('[!] Error al cargar la llave publica:', error);
      throw error;
    }
  }

  // Método para cifrar un único archivo
  private async encryptFile(filePath: string, outputFilePath: string): Promise<void> {
    try {
      // Obtener la extensión y el contenido del archivo
      const fileExtension = path.extname(filePath);
      const fileBuffer = fs.readFileSync(filePath);

      // Convertir la longitud de la extensión a 4 bytes
      const extensionLengthBuffer = Buffer.alloc(4);
      extensionLengthBuffer.writeUInt32BE(fileExtension.length, 0);

      // Convertir la extensión a bytes
      const extensionBuffer = Buffer.from(fileExtension, 'utf-8');

      // Generar clave y IV para AES
      const aesKey = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);

      // Cifrar el archivo con AES
      const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
      const encryptedFile = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);

      // Combinar extensión, IV y archivo cifrado
      const finalEncryptedFile = Buffer.concat([
        extensionLengthBuffer,
        extensionBuffer,
        iv,
        encryptedFile,
      ]);

      // Cifrar la clave AES con RSA
      const encryptedAesKey = crypto.publicEncrypt(
        {
          key: this.RSA_PUBLIC_KEY,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        aesKey,
      );

      // Guardar el archivo cifrado
      fs.writeFileSync(outputFilePath, finalEncryptedFile);

      // Guardar la clave cifrada
      const keyFilePath = `${outputFilePath.replace('.enc', '')}.key`;
      fs.writeFileSync(keyFilePath, encryptedAesKey);
    } catch (error) {
      console.error(`[!] Error al encriptar el archivo ${filePath}:`, error);
      throw new Error('Fallo en el encriptado del archivo');
    }
  }

  // Método para encriptar todos los archivos dentro de una carpeta (recursivamente)
  async encryptAllFilesInFolder(folderPath: string, outputFolderPath: string): Promise<void> {
    try {
      const items = fs.readdirSync(folderPath);

      for (const item of items) {
        const itemPath = path.join(folderPath, item);
        const outputItemPath = path.join(outputFolderPath, item);

        if (fs.statSync(itemPath).isDirectory()) {
          // Crear la carpeta en la salida
          if (!fs.existsSync(outputItemPath)) {
            fs.mkdirSync(outputItemPath, { recursive: true });
          }

          // Procesar la subcarpeta recursivamente
          await this.encryptAllFilesInFolder(itemPath, outputItemPath);
        } else if (fs.statSync(itemPath).isFile()) {
          // Cifrar el archivo y guardarlo en la carpeta de salida
          await this.encryptFile(itemPath, `${outputItemPath}.enc`);
        }
      }
      console.log(`[+] Carpeta procesada: ${folderPath}`);
    } catch (error) {
      console.error('[!] Error al procesar la carpeta:', error);
      throw new Error('Fallo al procesar la carpeta');
    }
  }
}