export default class VisualDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    const COMPONENTS_URL = 'https://components.slicejs.com';
    const linkBtn = this.querySelector('.components-cta-link');
    const redirectCountdown = this.querySelector('.redirect-countdown');

    if (linkBtn) {
      linkBtn.href = COMPONENTS_URL;
    }

    if (redirectCountdown) {
      let countdown = 10;
      redirectCountdown.textContent = `Redirecting in ${countdown}s`;

      const interval = setInterval(() => {
        countdown--;
        redirectCountdown.textContent = `Redirecting in ${countdown}s`;
        if (countdown <= 0) {
          clearInterval(interval);
          window.location.href = COMPONENTS_URL;
        }
      }, 1000);

      this._redirectInterval = interval;

      this.querySelector('.cancel-redirect')?.addEventListener('click', () => {
        clearInterval(interval);
        redirectCountdown.textContent = 'Redirect cancelled';
        this._redirectInterval = null;
      });
    }
  }

  async update() {}

  beforeDestroy() {
    if (this._redirectInterval) {
      clearInterval(this._redirectInterval);
      this._redirectInterval = null;
    }
  }
}

customElements.define('slice-visualdocumentation', VisualDocumentation);
