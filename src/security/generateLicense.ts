import { LicenseManager } from './SimpleLicenseManager';

/**
 * Script para generar un archivo de licencia
 * Ejecutar: npm run generate-license
 */
async function generateLicense() {
  const licenseManager = new LicenseManager();

  try {
    // Configuración de la licencia - SOLO MACs específicas autorizadas
    const licenseConfig = {
      applicationName: 'Sistema de encriptación MEDINUCLEAR',
      version: '1.0.0',
      authorizedMacs: [
        '4074E025CE39',
        '4A58D0FA0A09',
        'CC4740E3F713'
      ],
    };

    // Crear el archivo de licencia
    licenseManager.createLicenseFile(licenseConfig);

    // Probar la validación
    const validation = await licenseManager.validateLicense();
    console.log(`✅ Validación: ${validation.message}`);

  } catch (error) {
    console.error('❌ Error al generar licencia:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateLicense().catch(console.error);
}

export { generateLicense };
