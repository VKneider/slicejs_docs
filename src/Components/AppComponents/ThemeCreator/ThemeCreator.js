export default class ThemeCreator extends HTMLElement {
  static props = {
    themeName: { type: "string", default: "CustomTheme" },
    autoPreview: { type: "boolean", default: true }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    this.initializeElements();
    await this.createNavbar();
    this.setupEventListeners();
    this.loadDefaultTheme();
    this.createPreviewComponents();
    this.updatePreview();
  }

  initializeElements() {
    // Elementos de control
    this.$resetBtn = this.querySelector('#reset-theme');
    this.$exportBtn = this.querySelector('#export-theme');
    this.$previewBtn = this.querySelector('#preview-theme');

    // Elementos de color primario
    this.$primaryColor = this.querySelector('#primary-color');
    this.$primaryBg = this.querySelector('#primary-bg');
    this.$primaryContrast = this.querySelector('#primary-contrast');
    this.$primaryShade = this.querySelector('#primary-shade');

    // Elementos de color secundario
    this.$secondaryColor = this.querySelector('#secondary-color');
    this.$secondaryBg = this.querySelector('#secondary-bg');
    this.$secondaryContrast = this.querySelector('#secondary-contrast');

    // Elementos de estado
    this.$successColor = this.querySelector('#success-color');
    this.$warningColor = this.querySelector('#warning-color');
    this.$dangerColor = this.querySelector('#danger-color');

    // Elementos de tipografía
    this.$fontPrimary = this.querySelector('#font-primary');
    this.$fontSecondary = this.querySelector('#font-secondary');

    // Elementos adicionales
    this.$tertiaryBg = this.querySelector('#tertiary-bg');
    this.$mediumColor = this.querySelector('#medium-color');
    this.$disabledColor = this.querySelector('#disabled-color');

    // Elementos de previsualización
    this.$previewButtons = this.querySelector('.preview-buttons');
    this.$previewCards = this.querySelector('.preview-cards');
    this.$previewInputs = this.querySelector('.preview-inputs');
    this.$previewSwitches = this.querySelector('.preview-switches');

    // Elementos del modal
    this.$exportModal = this.querySelector('#export-modal');
    this.$closeModal = this.querySelector('.close');
    this.$exportCss = this.querySelector('#export-css');
    this.$copyCss = this.querySelector('#copy-css');
    this.$copyConfig = this.querySelector('#copy-config');
    this.$cssCode = this.querySelector('#css-code');
    this.$configCode = this.querySelector('#config-code');
  }

  async createNavbar() {
    const navbarContainer = this.querySelector('.navbar-container');
    let theme = slice.stylesManager.themeManager.currentTheme;

    const navBar = await slice.build('Navbar', {
      position: 'fixed',
      logo: {
        src: '/images/Slice.js-logo.png',
        path: '/',
      },
      items: [
        { text: 'Home', path: '/' },
        { text: 'Documentation', path: '/Documentation' },
        { text: 'Playground', path: '/Playground' },
        { text: 'Theme Creator', path: '/ThemeCreator' },
        { text: 'About', path: '/About' }
      ],
      buttons: [
        {
          value: 'Change Theme',
          onClickCallback: async () => {
            if (theme === 'Slice') {
              await slice.setTheme('Light');
              theme = 'Light';
            } else if (theme === 'Light') {
              await slice.setTheme('Dark');
              theme = 'Dark';
            } else if (theme === 'Dark') {
              await slice.setTheme('Slice');
              theme = 'Slice';
            }
          },
        },
      ],
    });

    if (navbarContainer) {
      navbarContainer.appendChild(navBar);
    }
  }

  setupEventListeners() {
    // Eventos para controles de color
    this.setupColorInputs();

    // Eventos para botones de acción
    if (this.$resetBtn) {
      this.$resetBtn.addEventListener('click', () => this.resetTheme());
    }
    if (this.$exportBtn) {
      this.$exportBtn.addEventListener('click', () => this.showExportModal());
    }
    if (this.$previewBtn) {
      this.$previewBtn.addEventListener('click', () => this.updatePreview());
    }

    // Eventos del modal
    if (this.$closeModal) {
      this.$closeModal.addEventListener('click', () => this.hideExportModal());
    }
    if (this.$exportCss) {
      this.$exportCss.addEventListener('click', () => this.downloadCssFile());
    }
    if (this.$copyCss) {
      this.$copyCss.addEventListener('click', () => this.copyCssCode());
    }
    if (this.$copyConfig) {
      this.$copyConfig.addEventListener('click', () => this.copyConfigCode());
    }

    // Cerrar modal al hacer clic fuera
    if (this.$exportModal) {
      window.addEventListener('click', (e) => {
        if (e.target === this.$exportModal) {
          this.hideExportModal();
        }
      });
    }
  }

  setupColorInputs() {
    const colorInputs = [
      this.$primaryColor,
      this.$primaryBg,
      this.$primaryContrast,
      this.$primaryShade,
      this.$secondaryColor,
      this.$secondaryBg,
      this.$secondaryContrast,
      this.$successColor,
      this.$warningColor,
      this.$dangerColor,
      this.$fontPrimary,
      this.$fontSecondary,
      this.$tertiaryBg,
      this.$mediumColor,
      this.$disabledColor
    ];

    colorInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          if (this.autoPreview) this.updatePreview();
        });
      }
    });
  }

  loadDefaultTheme() {
    // Cargar valores por defecto basados en el tema Light
    const defaultTheme = {
      primaryColor: '#0066ff',
      primaryBg: '#ffffff',
      primaryContrast: '#000000',
      primaryShade: '#dddddd',
      secondaryColor: '#63ccfd',
      secondaryBg: '#dddddd',
      secondaryContrast: '#ffffff',
      successColor: '#00ff40',
      warningColor: '#ffff40',
      dangerColor: '#ff0000',
      fontPrimary: '#000000',
      fontSecondary: '#474747',
      tertiaryBg: '#c4c4c4',
      mediumColor: '#92949c',
      disabledColor: '#7f7f7f'
    };

    this.applyThemeValues(defaultTheme);
  }

  applyThemeValues(theme) {
    const inputs = [
      { element: this.$primaryColor, value: theme.primaryColor },
      { element: this.$primaryBg, value: theme.primaryBg },
      { element: this.$primaryContrast, value: theme.primaryContrast },
      { element: this.$primaryShade, value: theme.primaryShade },
      { element: this.$secondaryColor, value: theme.secondaryColor },
      { element: this.$secondaryBg, value: theme.secondaryBg },
      { element: this.$secondaryContrast, value: theme.secondaryContrast },
      { element: this.$successColor, value: theme.successColor },
      { element: this.$warningColor, value: theme.warningColor },
      { element: this.$dangerColor, value: theme.dangerColor },
      { element: this.$fontPrimary, value: theme.fontPrimary },
      { element: this.$fontSecondary, value: theme.fontSecondary },
      { element: this.$tertiaryBg, value: theme.tertiaryBg },
      { element: this.$mediumColor, value: theme.mediumColor },
      { element: this.$disabledColor, value: theme.disabledColor }
    ];

    inputs.forEach(({ element, value }) => {
      if (element && value) {
        element.value = value;
      }
    });
  }

  async createPreviewComponents() {
    // Crear botones de previsualización
    const primaryButton = await slice.build('Button', {
      value: 'Primary Button',
      customColor: {
        button: 'var(--primary-color)',
        label: 'var(--primary-color-contrast)'
      }
    });

    const secondaryButton = await slice.build('Button', {
      value: 'Secondary Button',
      customColor: {
        button: 'var(--secondary-color)',
        label: 'var(--secondary-color-contrast)'
      }
    });

    const successButton = await slice.build('Button', {
      value: 'Success',
      customColor: {
        button: 'var(--success-color)',
        label: 'var(--success-contrast)'
      }
    });

    if (this.$previewButtons) {
      this.$previewButtons.appendChild(primaryButton);
      this.$previewButtons.appendChild(secondaryButton);
      this.$previewButtons.appendChild(successButton);
    }

    // Crear checkboxes de previsualización
    const checkbox1 = await slice.build('Checkbox', {
      label: 'Primary Checkbox',
      value: true,
      position: 'right'
    });

    const checkbox2 = await slice.build('Checkbox', {
      label: 'Secondary Checkbox',
      value: false,
      position: 'right'
    });

    if (this.$previewCards) {
      this.$previewCards.appendChild(checkbox1);
      this.$previewCards.appendChild(checkbox2);
    }

    // Crear inputs de previsualización
    const input1 = await slice.build('Input', {
      placeholder: 'Primary Input',
      value: 'Example text'
    });

    const input2 = await slice.build('Input', {
      placeholder: 'Secondary Input',
      value: 'Another text'
    });

    if (this.$previewInputs) {
      this.$previewInputs.appendChild(input1);
      this.$previewInputs.appendChild(input2);
    }

    // Crear switches de previsualización
    const switch1 = await slice.build('Switch', {
      value: true,
      label: 'Primary Switch'
    });

    const switch2 = await slice.build('Switch', {
      value: false,
      label: 'Secondary Switch'
    });

    if (this.$previewSwitches) {
      this.$previewSwitches.appendChild(switch1);
      this.$previewSwitches.appendChild(switch2);
    }
  }

  updatePreview() {
    const themeValues = this.getCurrentThemeValues();
    this.applyThemeToDocument(themeValues);
  }

  getCurrentThemeValues() {
    return {
      '--primary-color': this.$primaryColor?.value || '#0066ff',
      '--primary-color-rgb': this.hexToRgb(this.$primaryColor?.value || '#0066ff'),
      '--primary-background-color': this.$primaryBg?.value || '#ffffff',
      '--primary-color-contrast': this.$primaryContrast?.value || '#000000',
      '--primary-color-shade': this.$primaryShade?.value || '#dddddd',
      '--secondary-color': this.$secondaryColor?.value || '#63ccfd',
      '--secondary-color-rgb': this.hexToRgb(this.$secondaryColor?.value || '#63ccfd'),
      '--secondary-background-color': this.$secondaryBg?.value || '#dddddd',
      '--secondary-color-contrast': this.$secondaryContrast?.value || '#ffffff',
      '--tertiary-background-color': this.$tertiaryBg?.value || '#c4c4c4',
      '--success-color': this.$successColor?.value || '#00ff40',
      '--success-contrast': this.$successColor?.value || '#00ff40',
      '--warning-color': this.$warningColor?.value || '#ffff40',
      '--warning-contrast': this.$warningColor?.value || '#ffff40',
      '--danger-color': this.$dangerColor?.value || '#ff0000',
      '--danger-contrast': this.$dangerColor?.value || '#ff0000',
      '--medium-color': this.$mediumColor?.value || '#92949c',
      '--medium-contrast': this.$mediumColor?.value || '#92949c',
      '--disabled-color': this.$disabledColor?.value || '#7f7f7f',
      '--font-primary-color': this.$fontPrimary?.value || '#000000',
      '--font-secondary-color': this.$fontSecondary?.value || '#474747'
    };
  }

  applyThemeToDocument(themeValues) {
    const root = document.documentElement;
    Object.entries(themeValues).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '0, 0, 0';
  }

  resetTheme() {
    this.loadDefaultTheme();
    this.updatePreview();
  }

  showExportModal() {
    if (this.$exportModal) {
      this.$exportModal.style.display = 'block';
      this.populateExportContent();
    }
  }

  hideExportModal() {
    if (this.$exportModal) {
      this.$exportModal.style.display = 'none';
    }
  }

  populateExportContent() {
    const themeValues = this.getCurrentThemeValues();
    const themeName = 'CustomTheme';

    // Generar código CSS
    const cssCode = this.generateCssCode(themeValues, themeName);
    if (this.$cssCode) {
      this.$cssCode.value = cssCode;
    }

    // Generar configuración sliceConfig.json
    const configCode = this.generateConfigCode(themeName);
    if (this.$configCode) {
      this.$configCode.value = configCode;
    }
  }

  generateCssCode(themeValues, themeName) {
    let css = `/* ${themeName} Theme for slice.js */\n`;
    css += `/* Generated by Theme Creator */\n\n`;
    css += `:root {\n`;

    Object.entries(themeValues).forEach(([property, value]) => {
      css += `  ${property}: ${value};\n`;
    });

    css += `}\n`;
    return css;
  }

  generateConfigCode(themeName) {
    return `{
  "themeManager": {
    "enabled": true,
    "defaultTheme": "${themeName}",
    "saveThemeLocally": true,
    "useBrowserTheme": false
  }
}`;
  }

  downloadCssFile() {
    const themeName = 'CustomTheme';
    const cssCode = this.$cssCode?.value || '';

    const blob = new Blob([cssCode], { type: 'text/css' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeName}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async copyCssCode() {
    try {
      await navigator.clipboard.writeText(this.$cssCode?.value || '');
      this.showCopySuccess('CSS code copied to clipboard');
    } catch (err) {
      this.showCopyError('Error copying CSS code');
    }
  }

  async copyConfigCode() {
    try {
      await navigator.clipboard.writeText(this.$configCode?.value || '');
      this.showCopySuccess('Configuration copied to clipboard');
    } catch (err) {
      this.showCopyError('Error copying configuration');
    }
  }

  showCopySuccess(message) {
    this.showNotification(message, 'success');
  }

  showCopyError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
         position: fixed;
         top: 20px;
         right: 20px;
         padding: 15px 20px;
         border-radius: 5px;
         color: white;
         font-weight: 500;
         z-index: 10000;
         animation: slideIn 0.3s ease-out;
         background-color: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
      `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }
}

customElements.define('theme-creator', ThemeCreator);
