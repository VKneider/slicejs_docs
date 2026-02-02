export default class CopyMarkdownMenu extends HTMLElement {
  static props = {
    markdownPath: {
      type: 'string',
      default: '',
      required: false
    },
    markdownContent: {
      type: 'string',
      default: '',
      required: false
    },
    label: {
      type: 'string',
      default: '❐',
      required: false
    }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.$buttonSlot = this.querySelector('.copy-md-button-slot');
    this.$menu = this.querySelector('.copy-md-menu');
    this.$menuItem = this.querySelector('.copy-md-menu-item');

    slice.controller.setComponentProps(this, props);
  }

  async init() {
    await this.renderButton();
    this.setupMenuHandlers();
  }

  set markdownPath(value) {
    this._markdownPath = value;
  }

  get markdownPath() {
    return this._markdownPath;
  }

  set markdownContent(value) {
    this._markdownContent = value;
  }

  get markdownContent() {
    return this._markdownContent;
  }

  set label(value) {
    this._label = value;
    if (this.$button) {
      this.$button.value = value;
    }
  }

  get label() {
    return this._label;
  }

  async renderButton() {
    this.$button = await slice.build('Button', {
      value: this.label || '❐',
      onClickCallback: () => this.toggleMenu()
    });

    this.$buttonSlot.appendChild(this.$button);
  }

  setupMenuHandlers() {
    this.$buttonSlot.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    this.$menuItem.addEventListener('click', async () => {
      await this.copyMarkdown();
      this.closeMenu();
    });

    document.addEventListener('click', () => {
      this.closeMenu();
    });
  }

  toggleMenu() {
    this.$menu.classList.toggle('open');
  }

  closeMenu() {
    this.$menu.classList.remove('open');
  }

  async copyMarkdown() {
    if (!this.markdownContent) return;
    try {
      await navigator.clipboard.writeText(this.markdownContent);
      this.showCopySuccess();
    } catch (error) {
      console.warn('Copy markdown failed:', error);
    }
  }

  showCopySuccess() {
    if (!this.$button) return;
    const original = this.$button.value || '❐';
    this.$button.value = '✓';
    setTimeout(() => {
      this.$button.value = original;
    }, 1500);
  }
}

customElements.define('slice-copymarkdownmenu', CopyMarkdownMenu);
