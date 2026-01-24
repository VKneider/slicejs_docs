export default class MultiRoute extends HTMLElement {
   constructor(props) {
      super();
      this.props = props;
      this.renderedComponents = new Map(); // Cache para componentes renderizados
      this.registeredRoutes = []; // Track routes registered in Router
   }

   init() {
      if (!this.props.routes || !Array.isArray(this.props.routes)) {
         slice.logger.logError('MultiRoute', 'No valid routes array provided in props.');
         return;
      }

      // ✅ Registrar todas las rutas en el Router principal
      this.registerRoutesInRouter();
   }

   /**
    * Registra las rutas del MultiRoute en el Router principal
    * Esto permite que funcionen con navigate(), guards, y metadata
    */
   registerRoutesInRouter() {
      if (!slice.router) {
         slice.logger.logWarning('MultiRoute', 'Router not available yet, skipping route registration');
         return;
      }

      this.props.routes.forEach(route => {
         // Agregar la ruta al pathToRouteMap del Router
         const routeConfig = {
            path: route.path,
            component: route.component,
            metadata: route.metadata || {},
            fullPath: route.path,
            // Marcar que esta ruta viene de un MultiRoute
            source: 'MultiRoute',
            multiRouteId: this.sliceId
         };

         // Solo registrar si no existe ya
         if (!slice.router.pathToRouteMap.has(route.path)) {
            slice.router.pathToRouteMap.set(route.path, routeConfig);
            this.registeredRoutes.push(route.path);
            
            slice.logger.logInfo(
               'MultiRoute', 
               `Registered route: ${route.path} -> ${route.component}${route.metadata ? ' (with metadata)' : ''}`
            );
         } else {
            slice.logger.logWarning(
               'MultiRoute',
               `Route ${route.path} already registered, skipping`
            );
         }
      });
   }

   /**
    * Desregistra las rutas cuando el MultiRoute se destruye
    */
   unregisterRoutesFromRouter() {
      if (!slice.router) return;

      this.registeredRoutes.forEach(path => {
         slice.router.pathToRouteMap.delete(path);
         slice.logger.logInfo('MultiRoute', `Unregistered route: ${path}`);
      });
      
      this.registeredRoutes = [];
   }

   /**
    * Encuentra una ruta que coincida con el path actual
    * Soporta rutas estáticas y dinámicas con parámetros ${param}
    */
   matchRoute(currentPath) {
      // 1. Primero intentar match exacto (más rápido para rutas estáticas)
      const exactMatch = this.props.routes.find((route) => route.path === currentPath);
      if (exactMatch) {
         return { route: exactMatch, params: {} };
      }

      // 2. Si no hay match exacto, buscar rutas dinámicas
      for (const route of this.props.routes) {
         if (route.path.includes('${')) {
            const { regex, paramNames } = this.compilePathPattern(route.path);
            const match = currentPath.match(regex);
            
            if (match) {
               // Extraer parámetros de la URL
               const params = {};
               paramNames.forEach((name, i) => {
                  params[name] = match[i + 1];
               });
               
               return { route, params };
            }
         }
      }

      // 3. No se encontró ninguna ruta
      return { route: null, params: {} };
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

   async render() {
      const currentPath = window.location.pathname;
      const { route: routeMatch, params } = this.matchRoute(currentPath);

      if (routeMatch) {
         const { component, metadata } = routeMatch;

         if (this.renderedComponents.has(component)) {
            const cachedComponent = this.renderedComponents.get(component);
            this.innerHTML = '';

            // Actualizar props del componente cacheado
            if (cachedComponent.props) {
               cachedComponent.props = {
                  ...cachedComponent.props,
                  params: params,
                  metadata: metadata || {} // ✅ Incluir metadata
               };
            }

            // Si el componente en caché tiene un método update, lo ejecutamos
            if (cachedComponent.update) {
               await cachedComponent.update();
            }

            this.appendChild(cachedComponent);
         } else {
            if (!slice.controller.componentCategories.has(component)) {
               slice.logger.logError(`${this.sliceId}`, `Component ${component} not found`);
               return;
            }

            // Crear el componente con los parámetros y metadata de la ruta
            const newComponent = await slice.build(component, { 
               sliceId: component,
               params: params, // ✅ Pasar los parámetros al componente
               metadata: metadata || {} // ✅ Pasar metadata al componente
            });
            
            this.innerHTML = '';
            this.appendChild(newComponent);
            this.renderedComponents.set(component, newComponent);
         }

         // Emitir evento personalizado cuando el renderizado está completo
         this.dispatchEvent(new CustomEvent('route-rendered', {
            bubbles: true,
            detail: { 
               component, 
               path: currentPath,
               params: params,
               metadata: metadata || {} // ✅ Incluir metadata en el evento
            }
         }));
      } else {
         // Limpiamos el contenido si no hay una coincidencia de ruta
         this.innerHTML = '';
      }
   }

   async renderIfCurrentRoute() {
      const currentPath = window.location.pathname;
      const { route: routeMatch } = this.matchRoute(currentPath);

      if (routeMatch) {
         await this.render();
         return true;
      }
      return false;
   }

   removeComponent() {
      const currentPath = window.location.pathname;
      const { route: routeMatch } = this.matchRoute(currentPath);

      if (routeMatch) {
         const { component } = routeMatch;
         this.renderedComponents.delete(component);
         this.innerHTML = '';
      }
   }

   /**
    * Cleanup cuando el componente se destruye
    */
   destroy() {
      this.unregisterRoutesFromRouter();
      this.renderedComponents.clear();
      this.innerHTML = '';
   }
}

customElements.define('slice-multi-route', MultiRoute);