export default class MyNavigation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      this.$navigation = this.querySelector('.my_navigation');
      this.observer = null;
      this.boundUpdateNavigation = this.updateNavigation.bind(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = ['page'];
   }

   set page(value) {
      // Limpiar listeners y observers anteriores
      if (this._page) {
         this._page.removeEventListener('route-rendered', this.boundUpdateNavigation);
      }
      
      this._page = value;
      
      if (this._page) {
         // Escuchar el evento 'route-rendered' del MultiRoute
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
         // Escuchar el evento 'route-rendered' del MultiRoute
         this.page.addEventListener('route-rendered', this.boundUpdateNavigation);
         this.setupObserver();
         this.updateNavigation();
      }

      // Escuchar eventos de navegación del router
      window.addEventListener('popstate', this.boundUpdateNavigation);
   }

   setupObserver() {
      // Limpiar observer anterior si existe
      if (this.observer) {
         this.observer.disconnect();
      }

      // Crear MutationObserver como fallback para detectar cambios
      if (this.page) {
         this.observer = new MutationObserver(this.boundUpdateNavigation);

         // Observar cambios en el MultiRoute
         this.observer.observe(this.page, {
            childList: true,
            subtree: true
         });
      }
   }

   updateNavigation() {
      if (!this.page) return;

      // Limpiar navegación actual
      this.$navigation.innerHTML = '';
      
      // Buscar elementos con ID en el contenido actual del MultiRoute
      const idElements = this.page.querySelectorAll('[id]');

      if (idElements.length === 0) {
         return;
      }

      this.renderNavigationItems(idElements);
   }

   renderNavigationItems(idElements) {
      this.$navigation.innerHTML = '';
      
      idElements.forEach((element) => {
         // Filtrar elementos que no sean headers
         const tagName = element.tagName.toLowerCase();
         const isHeader = /^h[1-6]$/.test(tagName);
         
         if (!isHeader) return;

          const a = document.createElement('a');
          const titleText = element.querySelector('.doc-title-text')?.textContent
             || element.textContent
             || element.innerHTML;
          a.textContent = titleText;

         // Aplicar clase basada en la jerarquía
         for (let i = 1; i <= 6; i++) {
            if (tagName === `h${i}`) {
               a.classList.add(`nav-h${i}`);
               break;
            }
         }

         if (element.id) {
            a.href = `#${element.id}`;
            a.addEventListener('click', (event) => {
               event.preventDefault();
               const targetElement = document.getElementById(element.id);
               if (targetElement) {
                  targetElement.scrollIntoView({ 
                     behavior: 'smooth', 
                     block: 'center' 
                  });
               }
            });
         }
         
         this.$navigation.appendChild(a);
      });
   }

   // Limpiar el observer y listeners cuando se destruye el componente
   disconnectedCallback() {
      if (this.observer) {
         this.observer.disconnect();
      }
      if (this._page) {
         this._page.removeEventListener('route-rendered', this.boundUpdateNavigation);
      }
      window.removeEventListener('popstate', this.boundUpdateNavigation);
   }
   
}

customElements.define('slice-mynavigation', MyNavigation);
