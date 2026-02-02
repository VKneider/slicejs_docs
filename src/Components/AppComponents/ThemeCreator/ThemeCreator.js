export default class ThemeCreator extends HTMLElement {
  static props = {
    themeName: { type: "string", default: "CustomTheme" },
    autoPreview: { type: "boolean", default: true }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    
    // Guardar el tema original para restaurarlo cuando sea necesario
    this.originalThemeValues = null;
  }

  async init() {
    this.initializeElements();
    this.setupEventListeners();
    
    // Guardar el tema original antes de cualquier modificación
    this.saveOriginalTheme();
    
    this.loadCurrentThemeValues(); // Cargar valores del tema actual en lugar de valores por defecto
    
    // Crear componentes programáticamente
    await this.createActionButtons();
    await this.createThemeNameInput();
    
    // Crear navbar primero, luego componentes de preview secuencialmente
    await this.createNavbar();
    await this.createPreviewComponents();
    
    // NO llamar updatePreview() aquí para evitar modificar el tema global
    // this.updatePreview();
  }

  initializeElements() {
    // Contenedores para componentes
    this.$resetBtnContainer = this.querySelector('#reset-theme-container');
    this.$exportBtnContainer = this.querySelector('#export-theme-container');
    this.$previewBtnContainer = this.querySelector('#preview-theme-container');
    this.$themeNameContainer = this.querySelector('#theme-name-container');

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
    if (!navbarContainer) return;
    
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
      buttons: [],
    });

    const themeSelector = await slice.build('ThemeSelector', {
      themes: [
        {
          name: 'EmeraldLight',
          colors: { primary: '#10B981', secondary: '#FEFFFE' },
          description: 'Official Slice.js theme'
        },
        {
          name: 'Light',
          colors: { primary: '#F3F4F6', secondary: '#374151' },
          description: 'Clean and bright'
        },
        {
          name: 'Dark',
          colors: { primary: '#18181B', secondary: '#F3F4F6' },
          description: 'Easy on the eyes'
        },
        {
          name: 'CobaltBlue',
          colors: { primary: '#1D4ED8', secondary: '#F97316' },
          description: 'Professional blue with orange accents and light background'
        },
        {
          name: 'Purple',
          colors: { primary: '#9333EA', secondary: '#10B981' },
          description: 'Creative purple'
        }
      ]
    });

    navBar.querySelector('.nav_bar_buttons')?.appendChild(themeSelector);
    navbarContainer.appendChild(navBar); 

    setTimeout(() => {
      this.loadCurrentThemeValues();
    }, 100);
  
  }

  setupEventListeners() {
    // Eventos para controles de color
    this.setupColorInputs();

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

  async createActionButtons() {
    // Crear botón Reset
    if (this.$resetBtnContainer) {
      this.$resetBtn = await slice.build('Button', {
        value: '🔄 Reset',
        customColor: {
          button: 'var(--secondary-color)',
          label: 'var(--secondary-color-contrast)'
        },
        onClickCallback: () => this.resetTheme()
      });
      this.$resetBtnContainer.appendChild(this.$resetBtn);
    }

    // Crear botón Export
    if (this.$exportBtnContainer) {
      this.$exportBtn = await slice.build('Button', {
        value: '📥 Export Theme',
        customColor: {
          button: 'var(--primary-color)',
          label: 'var(--primary-color-contrast)'
        },
        onClickCallback: () => this.showExportModal()
      });
      this.$exportBtnContainer.appendChild(this.$exportBtn);
    }

    // Crear botón Preview
    if (this.$previewBtnContainer) {
      this.$previewBtn = await slice.build('Button', {
        value: '👁️ Preview',
        customColor: {
          button: 'var(--secondary-color)',
          label: 'var(--secondary-color-contrast)'
        },
        onClickCallback: () => this.updatePreview()
      });
      this.$previewBtnContainer.appendChild(this.$previewBtn);
    }
  }

  async createThemeNameInput() {
    if (this.$themeNameContainer) {
      this.$themeName = await slice.build('Input', {
        value: 'CustomTheme',
        placeholder: 'Enter theme name'
      });
      this.$themeNameContainer.appendChild(this.$themeName);
    }
  }

  setupButtonCallbacks() {
    // Los callbacks ya se configuran en createActionButtons()
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

  loadCurrentThemeValues() {
    // Obtener el elemento style del ThemeManager en el head
    const themeStyleElement = slice.stylesManager.themeManager.themeStyle;
    const cssContent = themeStyleElement.textContent;
    
    console.log('ThemeCreator - CSS del tema actual:', cssContent);
    
    // Extraer valores de CSS variables usando regex
    const extractCssValue = (varName) => {
      const regex = new RegExp(`${varName}:\\s*([^;]+);`);
      const match = cssContent.match(regex);
      return match ? match[1].trim() : null;
    };
    
    const themeValues = {
      primaryColor: extractCssValue('--primary-color'),
      primaryBg: extractCssValue('--primary-background-color'),
      primaryContrast: extractCssValue('--primary-color-contrast'),
      primaryShade: extractCssValue('--primary-color-shade'),
      secondaryColor: extractCssValue('--secondary-color'),
      secondaryBg: extractCssValue('--secondary-background-color'),
      secondaryContrast: extractCssValue('--secondary-color-contrast'),
      successColor: extractCssValue('--success-color'),
      warningColor: extractCssValue('--warning-color'),
      dangerColor: extractCssValue('--danger-color'),
      fontPrimary: extractCssValue('--font-primary-color'),
      fontSecondary: extractCssValue('--font-secondary-color'),
      tertiaryBg: extractCssValue('--tertiary-background-color'),
      mediumColor: extractCssValue('--medium-color'),
      disabledColor: extractCssValue('--disabled-color')
    };

    console.log('ThemeCreator - Valores extraídos:', themeValues);
    
    // Solo aplicar si tenemos al menos algunos valores válidos
    if (themeValues.primaryColor) {
      this.applyThemeValues(themeValues);
    } else {
      console.log('ThemeCreator - No se pudieron extraer valores del CSS del tema');
    }
  }

  applyThemeValues(theme) {
    console.log('ThemeCreator - Aplicando valores:', theme);
    
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
      if (element && value && value !== null) {
        element.value = value;
        console.log(`ThemeCreator - Aplicado ${value} a ${element.id}`);
      } else if (element && !value) {
        console.log(`ThemeCreator - Valor nulo para ${element.id}`);
      }
    });
  }

  async createPreviewComponents() {
    // Crear componentes secuencialmente para evitar conflictos con Slice
    const components = [];

    // Botones de previsualización
    components.push(await slice.build('Button', {
      value: 'Primary Button',
      customColor: {
        button: 'var(--primary-color)',
        label: 'var(--primary-color-contrast)'
      }
    }));

    components.push(await slice.build('Button', {
      value: 'Secondary Button',
      customColor: {
        button: 'var(--secondary-color)',
        label: 'var(--secondary-color-contrast)'
      }
    }));

    components.push(await slice.build('Button', {
      value: 'Success',
      customColor: {
        button: 'var(--success-color)',
        label: 'var(--success-contrast)'
      }
    }));

    // Checkboxes de previsualización
    components.push(await slice.build('Checkbox', {
      label: 'Primary Checkbox',
      checked: true,
      labelPlacement: 'right'
    }));

    components.push(await slice.build('Checkbox', {
      label: 'Secondary Checkbox',
      checked: false,
      labelPlacement: 'right'
    }));

    // Inputs de previsualización
    components.push(await slice.build('Input', {
      placeholder: 'Primary Input',
      value: 'Example text'
    }));

    components.push(await slice.build('Input', {
      placeholder: 'Secondary Input',
      value: 'Another text'
    }));

    // Switches de previsualización
    components.push(await slice.build('Switch', {
      checked: true,
      label: 'Primary Switch'
    }));

    components.push(await slice.build('Switch', {
      checked: false,
      label: 'Secondary Switch'
    }));

    // Agregar componentes a sus contenedores
    if (this.$previewButtons) {
      components.slice(0, 3).forEach(component => this.$previewButtons.appendChild(component));
    }

    if (this.$previewCards) {
      components.slice(3, 5).forEach(component => this.$previewCards.appendChild(component));
    }

    if (this.$previewInputs) {
      components.slice(5, 7).forEach(component => this.$previewInputs.appendChild(component));
    }

    if (this.$previewSwitches) {
      components.slice(7, 9).forEach(component => this.$previewSwitches.appendChild(component));
    }
  }



  updatePreview() {
    const themeValues = this.getCurrentThemeValues();
    this.applyThemeToPreviewContainer(themeValues);
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

  getThemeName() {
    // Obtener el valor del componente Input creado programáticamente
    if (this.$themeName) {
      // El componente Input tiene una propiedad value
      return this.$themeName.value || 'CustomTheme';
    }
    return 'CustomTheme';
  }

  applyThemeToPreviewContainer(themeValues) {
    // Aplicar el tema solo al contenedor de preview, no al documento completo
    const previewContainer = this.querySelector('.preview-container');
    if (previewContainer) {
      Object.entries(themeValues).forEach(([property, value]) => {
        if (value && value !== null) {
          previewContainer.style.setProperty(property, value);
        }
      });
    }
  }

  saveOriginalTheme() {
    // Guardar las variables CSS originales del tema actual
    const computedStyle = getComputedStyle(document.documentElement);
    this.originalThemeValues = {};
    
    const cssVars = [
      '--primary-color', '--primary-background-color', '--primary-color-contrast', '--primary-color-shade',
      '--secondary-color', '--secondary-background-color', '--secondary-color-contrast',
      '--success-color', '--warning-color', '--danger-color',
      '--font-primary-color', '--font-secondary-color',
      '--tertiary-background-color', '--medium-color', '--disabled-color'
    ];
    
    cssVars.forEach(varName => {
      this.originalThemeValues[varName] = computedStyle.getPropertyValue(varName).trim();
    });
  }

  restoreOriginalTheme() {
    // Restaurar las variables CSS originales
    if (this.originalThemeValues) {
      const root = document.documentElement;
      Object.entries(this.originalThemeValues).forEach(([property, value]) => {
        if (value) {
          root.style.setProperty(property, value);
        }
      });
    }
  }

  // Método para limpiar cuando el componente se destruya
  disconnectedCallback() {
    // Restaurar el tema original cuando se salga del ThemeCreator
    this.restoreOriginalTheme();
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '0, 0, 0';
  }

  resetTheme() {
    this.loadCurrentThemeValues(); // Reset a los valores del tema actual en lugar de valores por defecto
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
    const themeName = this.getThemeName();

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
    const themeName = this.getThemeName();
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
