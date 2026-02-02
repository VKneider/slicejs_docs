export default class CopyMarkdownMenu extends HTMLElement {
  static props = {
    markdownPath: {
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
    if (!this.markdownPath) return;
    try {
      const markdown = await this.fetchMarkdown();
      if (!markdown) return;
      await navigator.clipboard.writeText(markdown);
      this.showCopySuccess();
    } catch (error) {
      console.warn('Copy markdown failed:', error);
    }
  }

  async fetchMarkdown() {
    try {
      const response = await fetch('/markdown/' + this.markdownPath);
      if (!response.ok) return null;
      return await response.text();
    } catch (error) {
      console.warn('Fetch markdown failed:', error);
      return null;
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
