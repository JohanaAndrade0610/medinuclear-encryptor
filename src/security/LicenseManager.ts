import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
const getmac = require('getmac');

export interface LicenseConfig {
  authorizedMacs: string[];
  applicationName: string;
  version: string;
  expirationDate?: string;
}

export class LicenseManager {
  private readonly licenseFilePath: string;
  private readonly encryptionKey: string;

  constructor() {
    // Configurar rutas relativas al ejecutable
    const executableDir = path.dirname(process.execPath);
    const isDevelopment = !fs.existsSync(path.join(executableDir, 'secrets'));
    
    this.licenseFilePath = isDevelopment 
      ? path.resolve('secrets', 'license.enc')
      : path.join(executableDir, 'secrets', 'license.enc');
    
    // Clave de cifrado (en producción podrías usar algo más complejo)
    this.encryptionKey = 'MEDINUCLEAR_2024_SECURE_KEY_32CHARS!';
  }

  /**
   * Obtiene la MAC address principal del equipo
   */
  public async getCurrentMacAddress(): Promise<string> {
    try {
      const mac = await new Promise<string>((resolve, reject) => {
        getmac((err: any, macAddress: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(macAddress);
          }
        });
      });
      
      // Normalizar la MAC (mayúsculas, sin separadores)
      return mac.replace(/[:-]/g, '').toUpperCase();
    } catch (error) {
      throw new Error(`No se pudo obtener la MAC address: ${error}`);
    }
  }

  /**
   * Cifra un texto usando AES-256-CBC
   */
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Descifra un texto usando AES-256-CBC
   */
  private decrypt(encryptedText: string): string {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encrypted = textParts.join(':');
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Crea un archivo de licencia cifrado
   */
  public createLicenseFile(config: LicenseConfig): void {
    try {
      // Normalizar las MACs en la configuración
      const normalizedConfig = {
        ...config,
        authorizedMacs: config.authorizedMacs.map(mac => 
          mac.replace(/[:-]/g, '').toUpperCase()
        )
      };

      const licenseData = JSON.stringify(normalizedConfig, null, 2);
      const encryptedData = this.encrypt(licenseData);

      // Crear directorio si no existe
      const dir = path.dirname(this.licenseFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(this.licenseFilePath, encryptedData, 'utf8');
      console.log(`✅ Archivo de licencia creado: ${this.licenseFilePath}`);
    } catch (error) {
      throw new Error(`Error al crear archivo de licencia: ${error}`);
    }
  }

  /**
   * Lee y descifra el archivo de licencia
   */
  private readLicenseFile(): LicenseConfig {
    try {
      if (!fs.existsSync(this.licenseFilePath)) {
        throw new Error('Archivo de licencia no encontrado');
      }

      const encryptedData = fs.readFileSync(this.licenseFilePath, 'utf8');
      const decryptedData = this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      throw new Error(`Error al leer archivo de licencia: ${error}`);
    }
  }

  /**
   * Valida si el equipo actual tiene licencia válida
   */
  public async validateLicense(): Promise<{ isValid: boolean; message: string; config?: LicenseConfig }> {
    try {
      const currentMac = await this.getCurrentMacAddress();
      const licenseConfig = this.readLicenseFile();

      // Verificar si la MAC está autorizada
      const isAuthorized = licenseConfig.authorizedMacs.includes(currentMac);

      if (!isAuthorized) {
        return {
          isValid: false,
          message: `Acceso denegado.`
        };
      }

      // Verificar fecha de expiración si existe
      if (licenseConfig.expirationDate) {
        const expirationDate = new Date(licenseConfig.expirationDate);
        const currentDate = new Date();

        if (currentDate > expirationDate) {
          return {
            isValid: false,
            message: `Licencia expirada. Fecha de expiración: ${licenseConfig.expirationDate}`
          };
        }
      }

      return {
        isValid: true,
        message: 'Licencia válida',
        config: licenseConfig
      };

    } catch (error) {
      return {
        isValid: false,
        message: `Error de validación: ${error}`
      };
    }
  }

  /**
   * Obtiene información de la licencia actual
   */
  public async getLicenseInfo(): Promise<string> {
    try {
      const currentMac = await this.getCurrentMacAddress();
      const licenseConfig = this.readLicenseFile();

      let info = `📋 Información de Licencia:\n`;
      info += `   Aplicación: ${licenseConfig.applicationName}\n`;
      info += `   Versión: ${licenseConfig.version}\n`;
      info += `   MAC actual: ${currentMac}\n`;
      info += `   MACs autorizadas: ${licenseConfig.authorizedMacs.length}\n`;
      
      if (licenseConfig.expirationDate) {
        info += `   Expira: ${licenseConfig.expirationDate}\n`;
      }

      return info;
    } catch (error) {
      return `❌ Error al obtener información de licencia: ${error}`;
    }
  }
}
