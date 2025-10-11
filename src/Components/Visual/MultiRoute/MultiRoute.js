export default class MultiRoute extends HTMLElement {
   constructor(props) {
      super();
      this.props = props;
      this.renderedComponents = new Map();
   }

   init() {
      if (!this.props.routes || !Array.isArray(this.props.routes)) {
         slice.logger.logError('MultiRoute', 'No valid routes array provided in props.');
         return;
      }
   }

   async render() {
      const currentPath = window.location.pathname;
      const routeMatch = this.props.routes.find((route) => route.path === currentPath);

      if (routeMatch) {
         const { component } = routeMatch;

         if (this.renderedComponents.has(component)) {
            const cachedComponent = this.renderedComponents.get(component);
            this.innerHTML = '';

            if (cachedComponent.update) {
               await cachedComponent.update();
            }

            this.appendChild(cachedComponent);
         } else {
            if (!slice.controller.componentCategories.has(component)) {
               slice.logger.logError(`${this.sliceId}`, `Component ${component} not found`);
               return;
            }

            const newComponent = await slice.build(component, { sliceId: component });
            this.innerHTML = '';
            this.appendChild(newComponent);
            this.renderedComponents.set(component, newComponent);
         }

         // ✅ Emitir evento personalizado cuando el renderizado está completo
         this.dispatchEvent(new CustomEvent('route-rendered', {
            bubbles: true,
            detail: { component, path: currentPath }
         }));
      } else {
         this.innerHTML = '';
      }
   }

   async renderIfCurrentRoute() {
      const currentPath = window.location.pathname;
      const routeMatch = this.props.routes.find((route) => route.path === currentPath);

      if (routeMatch) {
         await this.render();
         return true;
      }
      return false;
   }

   removeComponent() {
      const currentPath = window.location.pathname;
      const routeMatch = this.props.routes.find((route) => route.path === currentPath);

      if (routeMatch) {
         const { component } = routeMatch;
         this.renderedComponents.delete(component);
         this.innerHTML = '';
      }
   }
}

customElements.define('slice-multi-route', MultiRoute);