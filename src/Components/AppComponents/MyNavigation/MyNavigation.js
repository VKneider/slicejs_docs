export default class MyNavigation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      this.$navigation = this.querySelector('.my_navigation_links');
      this.$title = this.querySelector('.my_navigation_title');
      this.observer = null;
      this.headings = [];
      this.activeId = '';
      this._raf = 0;
      this.boundUpdateNavigation = this.updateNavigation.bind(this);
      this.boundScrollSpy = this.scrollSpy.bind(this);
      this.boundScheduleSpy = this.scheduleSpy.bind(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = ['page'];
   }

   set page(value) {
      if (this._page) {
         this._page.removeEventListener('route-rendered', this.boundUpdateNavigation);
      }

      this._page = value;

      if (this._page) {
         this._page.addEventListener('route-rendered', this.boundUpdateNavigation);
         this.setupObserver();
         this.updateNavigation();
      }
   }

   get page() {
      return this._page;
   }

   init() {
      if (this.page) {
         this.page.addEventListener('route-rendered', this.boundUpdateNavigation);
         this.setupObserver();
         this.updateNavigation();
      }

      window.addEventListener('popstate', this.boundUpdateNavigation);
      window.addEventListener('scroll', this.boundScheduleSpy, { passive: true });
      window.addEventListener('resize', this.boundScheduleSpy);
   }

   setupObserver() {
      if (this.observer) {
         this.observer.disconnect();
      }

      if (!this.page) return;

      this.observer = new MutationObserver(() => {
         if (this._raf) return;
         this._raf = requestAnimationFrame(() => {
            this._raf = 0;
            this.updateNavigation();
         });
      });

      this.observer.observe(this.page, {
         childList: true,
         subtree: true
      });
   }

   updateNavigation() {
      if (!this.page || !this.$navigation) return;

      this.observer?.disconnect();

      this.headings = Array.from(this.page.querySelectorAll('h2[id], h3[id], h4[id]'))
         .filter((heading) => !heading.closest('slice-mainmenu'));

      this.$navigation.replaceChildren();
      this.activeId = '';

      if (!this.headings.length) {
         this.$title.hidden = true;
         const empty = document.createElement('p');
         empty.className = 'my_navigation_empty';
         empty.textContent = 'No sections on this page.';
         this.$navigation.appendChild(empty);
         return;
      }

      this.$title.hidden = false;

      for (const heading of this.headings) {
         const level = heading.tagName.toLowerCase();
         const link = document.createElement('a');
         link.className = `nav-${level}`;
         link.href = `#${heading.id}`;
         link.textContent = heading.querySelector('.doc-title-text')?.textContent
            || heading.textContent
            || heading.id;

         link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.getElementById(heading.id);
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', `#${heading.id}`);
            this.setActive(heading.id);
            this.boundScheduleSpy();
         });

         this.$navigation.appendChild(link);
      }

      this.setupObserver();
      this.scrollSpy();
   }

   setupObserver() {
      if (this.observer) {
         this.observer.disconnect();
      }

      if (!this.page) return;

      this.observer = new MutationObserver(() => {
         if (this._raf) return;
         this._raf = requestAnimationFrame(() => {
            this._raf = 0;
            this.updateNavigation();
         });
      });

      this.observer.observe(this.page, {
         childList: true,
         subtree: true
      });
   }

   scheduleSpy() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
         this._raf = 0;
         this.scrollSpy();
      });
   }

   scrollSpy() {
      if (!this.headings.length) return;

      const offset = (Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--docs-navbar-height'), 10) || 74) + 24;
      let current = this.headings[0];

      for (const heading of this.headings) {
         if (heading.getBoundingClientRect().top <= offset) {
            current = heading;
         } else {
            break;
         }
      }

      this.setActive(current?.id || '');
   }

   setActive(id) {
      if (id === this.activeId) return;
      this.activeId = id;

      this.$navigation.querySelectorAll('a').forEach((link) => {
         link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
   }

   beforeDestroy() {
      this.observer?.disconnect();
      this.observer = null;
      cancelAnimationFrame(this._raf);
      this._raf = 0;

      if (this._page) {
         this._page.removeEventListener('route-rendered', this.boundUpdateNavigation);
      }

      window.removeEventListener('popstate', this.boundUpdateNavigation);
      window.removeEventListener('scroll', this.boundScheduleSpy);
      window.removeEventListener('resize', this.boundScheduleSpy);
   }

   disconnectedCallback() {
      this.beforeDestroy();
   }
}

customElements.define('slice-mynavigation', MyNavigation);
