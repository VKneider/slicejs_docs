export default class Link extends HTMLElement {
   constructor(props = {}) {
      super();
      this.props = props;
      this.render(props);
      this.init();
   }

   init() {
      this.addEventListener('click', this.onClick);
   }

   async onClick(event) {
      event.preventDefault();
      const path = this.querySelector('a')?.getAttribute('href');
      if (!path || path === '#') return;
      // External destinations are real links, not router routes.
      if (/^(https?:)?\/\//i.test(path)) {
         window.open(path, '_blank', 'noopener,noreferrer');
         return;
      }
      if (/^(mailto|tel):/i.test(path)) {
         window.location.href = path;
         return;
      }
      slice.router.navigate(path);
   }

   // Built with DOM APIs (setAttribute / textContent) instead of an innerHTML
   // template so a `path` like `javascript:...` or text containing markup can't
   // inject into the document.
   render(props = {}) {
      const { path = '#', classes = '', text = '' } = props;
      const anchor = document.createElement('a');
      anchor.setAttribute('href', path);
      anchor.setAttribute('data-route', '');
      if (/^(https?:)?\/\//i.test(path)) {
         anchor.setAttribute('target', '_blank');
         anchor.setAttribute('rel', 'noopener noreferrer');
      }
      if (classes) anchor.className = classes;
      anchor.textContent = text;
      this.replaceChildren(anchor);
   }
}

customElements.define('slice-link', Link);
