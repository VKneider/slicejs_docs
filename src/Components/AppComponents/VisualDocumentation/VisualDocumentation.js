export default class VisualDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    this.querySelectorAll('[data-nav]').forEach((link) => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const path = link.getAttribute('href');
        if (path && slice.router && slice.router.navigate) {
          await slice.router.navigate(path);
        }
      });
    });
  }
}

customElements.define('slice-visualdocumentation', VisualDocumentation);
