import { DateLicenseManager } from "../security/DateLicenseManager";

/**
 * Script para probar el acceso denegado
 */
class TestLicenseManager extends DateLicenseManager {
  // Sobrescribir para simular una MAC diferente
  public async getCurrentMacAddress(): Promise<string> {
    // Simular una MAC no autorizada
    return 'FAKEMACADDRESS123';
  }
}

async function testAccessDenied() {
  console.log('🧪 Probando acceso con MAC no autorizada...\n');
  
  const testManager = new TestLicenseManager();

  try {
    const currentMac = await testManager.getCurrentMacAddress();
    console.log(`🔍 MAC simulada: ${currentMac}`);

    const validation = await testManager.validateLicense();
    
    if (validation.isValid) {
      console.log('✅ Acceso autorizado:', validation.message);
    } else {
      console.log('❌ ACCESO DENEGADO:', validation.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testAccessDenied().catch(console.error);
}

export { testAccessDenied };
