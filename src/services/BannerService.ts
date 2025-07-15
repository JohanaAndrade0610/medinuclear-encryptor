import { exec } from 'child_process';

export class BannerService {
  private readonly colors = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    bold: '\x1b[1m',
    navyBlue: '\x1b[38;5;33m'
  };

    /**
   * Centra un texto en la terminal
   * @param text - El texto a centrar
   * @returns El texto centrado con espacios
   */
  private centerText(text: string): string {
    const terminalWidth = process.stdout.columns || 80;
    const textLength = text.length;
    const padding = Math.max(0, Math.floor((terminalWidth - textLength) / 2));
    return ' '.repeat(padding) + text;
  }

  /**
   * Restaura la terminal al estado normal
   */
  public restoreTerminal(): void {
    // Simplemente limpiar la pantalla al salir
    console.clear();
  }

  /**
   * Muestra el banner de bienvenida del sistema
   */
  public showWelcomeBanner(): void {
    // Limpiar pantalla antes de mostrar el banner
    console.clear();

    const { reset, cyan, yellow, green, blue, navyBlue} = this.colors;

    // Separador superior
    this.showSectionSeparator();
    console.log('');
    
    // Banner principal centrado
    console.log(navyBlue+ this.centerText('BIENVENIDO AL SISTEMA DE ENCRIPTADO MEDINUCLEAR') + reset);
    console.log(navyBlue + this.centerText('Version 1.0.0') + reset);
    console.log('');
  }
  /**
   * Muestra el separador de sección
   */
public showSectionSeparator(): void {
  const { cyan, reset } = this.colors;
  const terminalWidth = process.stdout.columns || 80;
  const separator = '─'.repeat(terminalWidth); // Usando el carácter de línea horizontal
  console.log(cyan + separator + reset);
}

  /**
   * Muestra un mensaje con formato específico
   * @param message - El mensaje a mostrar
   * @param type - Tipo de mensaje (info, success, error, warning)
   */
  public showMessage(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void {
    const { reset, cyan, green, yellow } = this.colors;
    
    let prefix = '';
    let color = reset;
    
    switch (type) {
      case 'info':
        prefix = '[*]';
        color = cyan;
        break;
      case 'success':
        prefix = '[+]';
        color = green;
        break;
      case 'error':
        prefix = '[!]';
        color = '\x1b[31m'; // Rojo
        break;
      case 'warning':
        prefix = '[!]';
        color = yellow;
        break;
    }
    
    console.log(color + `${prefix} ${message}` + reset);
  }
}
