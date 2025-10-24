export default class Route extends HTMLElement {
   constructor(props) {
      super();
      this.props = props;
      this.rendered = false;
      this.registeredInRouter = false;
   }

   init() {
      if (!this.props.path) {
         this.props.path = ' ';
      }

      if (!this.props.component) {
         this.props.component = slice.router.pathToRouteMap.get(this.props.path)?.component || ' ';
      }

      // ✅ Registrar la ruta en el Router principal
      this.registerRouteInRouter();
   }

   /**
    * Registra la ruta del Route en el Router principal
    * Esto permite que funcione con navigate(), guards, y metadata
    */
   registerRouteInRouter() {
      if (!slice.router) {
         slice.logger.logWarning('Route', 'Router not available yet, skipping route registration');
         return;
      }

      if (!this.props.path || this.props.path === ' ') {
         return;
      }

      // Agregar la ruta al pathToRouteMap del Router
      const routeConfig = {
         path: this.props.path,
         component: this.props.component,
         metadata: this.props.metadata || {},
         fullPath: this.props.path,
         // Marcar que esta ruta viene de un Route component
         source: 'Route',
         routeId: this.sliceId
      };

      // Solo registrar si no existe ya
      if (!slice.router.pathToRouteMap.has(this.props.path)) {
         slice.router.pathToRouteMap.set(this.props.path, routeConfig);
         this.registeredInRouter = true;
         
         slice.logger.logInfo(
            'Route', 
            `Registered route: ${this.props.path} -> ${this.props.component}${this.props.metadata ? ' (with metadata)' : ''}`
         );
      } else {
         slice.logger.logWarning(
            'Route',
            `Route ${this.props.path} already registered, skipping`
         );
      }
   }

   /**
    * Desregistra la ruta cuando el Route se destruye
    */
   unregisterRouteFromRouter() {
      if (!slice.router || !this.registeredInRouter) return;

      slice.router.pathToRouteMap.delete(this.props.path);
      slice.logger.logInfo('Route', `Unregistered route: ${this.props.path}`);
      this.registeredInRouter = false;
   }

   get path() {
      return this.props.path;
   }

   set path(value) {
      this.props.path = value;
   }

   get component() {
      return this.props.component;
   }

   set component(value) {
      this.props.component = value;
   }

   /**
    * Verifica si el path actual coincide con el path del Route
    * Soporta rutas estáticas y dinámicas con parámetros ${param}
    */
   matchesCurrentPath() {
      const currentPath = window.location.pathname;

      // 1. Match exacto (rutas estáticas)
      if (this.props.path === currentPath) {
         return { matches: true, params: {} };
      }

      // 2. Si la ruta tiene parámetros dinámicos ${param}
      if (this.props.path.includes('${')) {
         const { regex, paramNames } = this.compilePathPattern(this.props.path);
         const match = currentPath.match(regex);
         
         if (match) {
            // Extraer parámetros de la URL
            const params = {};
            paramNames.forEach((name, i) => {
               params[name] = match[i + 1];
            });
            
            return { matches: true, params };
         }
      }

      return { matches: false, params: {} };
   }

   /**
    * Convierte un patrón de ruta con ${param} en una expresión regular
    * Ejemplo: "/user/${id}" -> /^\/user\/([^/]+)$/
    */
   compilePathPattern(pattern) {
      const paramNames = [];
      const regexPattern = '^' + pattern.replace(/\$\{([^}]+)\}/g, (_, paramName) => {
         paramNames.push(paramName);
         return '([^/]+)'; // Captura cualquier caracter excepto /
      }) + '$';

      return { 
         regex: new RegExp(regexPattern), 
         paramNames 
      };
   }

   async render(params = {}) {
      const metadata = this.props.metadata || {};

      if (Route.componentCache[this.props.component]) {
         const cachedComponent = Route.componentCache[this.props.component];
         this.innerHTML = '';

         // Actualizar props del componente cacheado
         if (cachedComponent.props) {
            cachedComponent.props = {
               ...cachedComponent.props,
               params: params,
               metadata: metadata // ✅ Incluir metadata
            };
         }

         if (cachedComponent.update) {
            await cachedComponent.update();
         }

         this.appendChild(cachedComponent);
      } else {
         if (!this.props.component) {
            return;
         }

         if (!slice.controller.componentCategories.has(this.props.component)) {
            slice.logger.logError(`${this.sliceId}`, `Component ${this.props.component} not found`);
            return;
         }

         // Crear el componente con los parámetros y metadata de la ruta
         const component = await slice.build(this.props.component, {
            sliceId: this.props.component,
            params: params, // ✅ Pasar los parámetros al componente
            metadata: metadata // ✅ Pasar metadata al componente
         });

         this.innerHTML = '';
         this.appendChild(component);
         Route.componentCache[this.props.component] = component;
      }
      this.rendered = true;
   }

   async renderIfCurrentRoute() {
      const { matches, params } = this.matchesCurrentPath();
      
      if (matches) {
         if (this.rendered) {
            if (Route.componentCache[this.props.component]) {
               const cachedComponent = Route.componentCache[this.props.component];
               
               // Actualizar params y metadata en el componente cacheado
               if (cachedComponent.props) {
                  cachedComponent.props = {
                     ...cachedComponent.props,
                     params: params,
                     metadata: this.props.metadata || {}
                  };
               }

               if (cachedComponent.update) {
                  await cachedComponent.update();
               }
               return true;
            }
         }
         await this.render(params);
         return true;
      }
      return false;
   }

   removeComponent() {
      delete Route.componentCache[this.props.component];
      this.innerHTML = '';
      this.rendered = false;
   }

   /**
    * Cleanup cuando el componente se destruye
    */
   destroy() {
      this.unregisterRouteFromRouter();
      this.removeComponent();
   }
}

Route.componentCache = {};

customElements.define('slice-route', Route);