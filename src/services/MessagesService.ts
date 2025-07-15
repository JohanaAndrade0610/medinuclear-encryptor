export interface Messages {
  prompts: {
    folderPath: string;
    continueProcessing: string;
    openOutputFolder: string;
    exitMessage: string;
  };
  errors: {
    folderNotExists: string;
    notValidFolder: string;
    noValidPath: string;
    fatalError: string;
    encryptionError: string;
    licenseError: string;
    accessDenied: string;
    licenseExpired: string;
  };
  success: {
    processCompleted: string;
    filesLocation: string;
    licenseValid: string;
  };
  info: {
    startingProcess: string;
    sourceFolder: string;
    thankYou: string;
    pressAnyKey: string;
    checkingLicense: string;
  };
  warnings: {
    ensurePath: string;
  };
}

export class MessagesService {
  private messages: Messages = {
    prompts: {
      folderPath: '[+] Ingrese la ruta completa de la carpeta a cifrar:\n> ',
      continueProcessing: '\n¿Desea cifrar otra carpeta? (S/N): ',
      openOutputFolder: '\n[+] ¿Desea abrir la carpeta con los archivos cifrados? (S/N): ',
      exitMessage: 'Presione cualquier tecla para salir...'
    },
    errors: {
      folderNotExists: 'Error: La carpeta "{path}" no existe.',
      notValidFolder: 'Error: "{path}" no es una carpeta valida.',
      noValidPath: 'No se proporciono una ruta valida.',
      fatalError: 'Error fatal en la aplicación:',
      encryptionError: 'ERROR DURANTE EL CIFRADO',
      licenseError: 'ERROR DE LICENCIA',
      accessDenied: 'ACCESO DENEGADO - Equipo no autorizado',
      licenseExpired: 'LICENCIA EXPIRADA'
    },
    success: {
      processCompleted: '¡Proceso finalizado de manera exitosa!',
      filesLocation: 'Los archivos cifrados se encuentran en: {path}',
      licenseValid: 'Licencia válida - Acceso autorizado'
    },
    info: {
      startingProcess: 'Iniciando proceso de encriptado...',
      sourceFolder: 'Carpeta origen: {path}',
      thankYou: 'Gracias por usar el SISTEMA DE ENCRIPTADO MEDINUCLEAR',
      pressAnyKey: 'Presione cualquier tecla para salir...',
      checkingLicense: 'Verificando licencia del sistema...'
    },
    warnings: {
      ensurePath: 'Asegurese de tener la ruta completa de la carpeta a cifrar'
    }
  };

  /**
   * Obtiene un mensaje por su clave
   * @param category - Categoría del mensaje
   * @param key - Clave del mensaje
   * @param replacements - Objeto con los reemplazos a realizar
   */
  public getMessage(
    category: keyof Messages,
    key: string,
    replacements?: Record<string, string>
  ): string {
    let message = (this.messages[category] as any)[key] || `Missing message: ${category}.${key}`;
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        message = message.replace(`{${placeholder}}`, value);
      });
    }
    
    return message;
  }

  /**
   * Obtiene un mensaje de prompt
   */
  public getPrompt(key: keyof Messages['prompts']): string {
    return this.getMessage('prompts', key);
  }

  /**
   * Obtiene un mensaje de error
   */
  public getError(key: keyof Messages['errors'], replacements?: Record<string, string>): string {
    return this.getMessage('errors', key, replacements);
  }

  /**
   * Obtiene un mensaje de éxito
   */
  public getSuccess(key: keyof Messages['success'], replacements?: Record<string, string>): string {
    return this.getMessage('success', key, replacements);
  }

  /**
   * Obtiene un mensaje informativo
   */
  public getInfo(key: keyof Messages['info'], replacements?: Record<string, string>): string {
    return this.getMessage('info', key, replacements);
  }

  /**
   * Obtiene un mensaje de advertencia
   */
  public getWarning(key: keyof Messages['warnings'], replacements?: Record<string, string>): string {
    return this.getMessage('warnings', key, replacements);
  }

  /**
   * Permite cambiar todos los mensajes (útil para internacionalización)
   */
  public setMessages(newMessages: Messages): void {
    this.messages = newMessages;
  }

  /**
   * Permite actualizar mensajes específicos
   */
  public updateMessages(updates: Partial<Messages>): void {
    this.messages = { ...this.messages, ...updates };
  }

  /**
   * Obtiene todos los mensajes actuales
   */
  public getAllMessages(): Messages {
    return { ...this.messages };
  }
}
