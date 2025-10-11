export default class MultiRouteDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Ejemplo básico con componentes de documentación
      await this.createMultiRouteExample(
         this.querySelector(".myMultiRoute"),
         {
            routes: [
               { path: '/demo/button', component: 'ButtonDocumentation' },
               { path: '/demo/input', component: 'InputDocumentation' }
            ]
         },
         `{
   routes: [
      { path: '/demo/button', component: 'ButtonDocumentation' },
      { path: '/demo/input', component: 'InputDocumentation' }
   ]
}`,
         'Interactive example - Click buttons to navigate between documentation pages',
         [
            { label: '🔘 Button Docs', path: '/demo/button' },
            { label: '⌨️ Input Docs', path: '/demo/input' }
         ]
      );

      // Ejemplo básico con más opciones
      await this.createMultiRouteExample(
         this.querySelector(".basicMultiRoute"),
         {
            routes: [
               { path: '/docs/button', component: 'ButtonDocumentation' },
               { path: '/docs/select', component: 'SelectDocumentation' },
               { path: '/docs/checkbox', component: 'CheckboxDocumentation' }
            ]
         },
         `{
   routes: [
      { path: '/docs/button', component: 'ButtonDocumentation' },
      { path: '/docs/select', component: 'SelectDocumentation' },
      { path: '/docs/checkbox', component: 'CheckboxDocumentation' }
   ]
}`,
         'Basic routes - Navigate between different component documentations',
         [
            { label: '🔘 Button', path: '/docs/button' },
            { label: '📋 Select', path: '/docs/select' },
            { label: '☑️ Checkbox', path: '/docs/checkbox' }
         ]
      );

      // Ejemplo de páginas de la aplicación
      await this.createMultiRouteExample(
         this.querySelector(".dashboardMultiRoute"),
         {
            routes: [
               { path: '/app/playground', component: 'Playground' },
               { path: '/app/theme', component: 'ThemeCreator' },
               { path: '/app/about', component: 'TheSliceTeam' }
            ]
         },
         `{
   routes: [
      { path: '/app/playground', component: 'Playground' },
      { path: '/app/theme', component: 'ThemeCreator' },
      { path: '/app/about', component: 'TheSliceTeam' }
   ]
}`,
         'Application pages - Navigate between real app pages',
         [
            { label: '🎮 Playground', path: '/app/playground' },
            { label: '🎨 Theme Creator', path: '/app/theme' },
            { label: '👥 About Team', path: '/app/about' }
         ]
      );

      // Ejemplo con documentaciones de componentes visuales
      await this.createMultiRouteExample(
         this.querySelector(".nestedMultiRoute"),
         {
            routes: [
               { path: '/visual/button', component: 'ButtonDocumentation' },
               { path: '/visual/input', component: 'InputDocumentation' },
               { path: '/visual/select', component: 'SelectDocumentation' },
               { path: '/visual/switch', component: 'SwitchDocumentation' }
            ]
         },
         `{
   routes: [
      { path: '/visual/button', component: 'ButtonDocumentation' },
      { path: '/visual/input', component: 'InputDocumentation' },
      { path: '/visual/select', component: 'SelectDocumentation' },
      { path: '/visual/switch', component: 'SwitchDocumentation' }
   ]
}`,
         'Visual components documentation',
         [
            { label: '🔘 Button', path: '/visual/button' },
            { label: '⌨️ Input', path: '/visual/input' },
            { label: '📋 Select', path: '/visual/select' },
            { label: '🔄 Switch', path: '/visual/switch' }
         ]
      );

      // Ejemplo de caching - mismo componente, diferentes rutas
      await this.createMultiRouteExample(
         this.querySelector(".cachingMultiRoute"),
         {
            routes: [
               { path: '/cache/doc1', component: 'ButtonDocumentation' },
               { path: '/cache/doc2', component: 'ButtonDocumentation' },
               { path: '/cache/doc3', component: 'ButtonDocumentation' }
            ]
         },
         `{
   routes: [
      { path: '/cache/doc1', component: 'ButtonDocumentation' },
      { path: '/cache/doc2', component: 'ButtonDocumentation' },
      { path: '/cache/doc3', component: 'ButtonDocumentation' }
   ]
}

// 🔄 Component Caching Demo:
// All three routes use the same 'ButtonDocumentation' component
// The component is created once and reused for all routes
// Check the console to see caching in action!`,
         '⚡ Caching demo - All routes share the same ButtonDocumentation component',
         [
            { label: '📄 Route 1', path: '/cache/doc1' },
            { label: '📄 Route 2', path: '/cache/doc2' },
            { label: '📄 Route 3', path: '/cache/doc3' }
         ]
      );

      // Ejemplo de rutas dinámicas (sin navegación, solo código)
      await this.createMultiRouteExample(
         this.querySelector(".dynamicMultiRoute"),
         null,
         `// Initial routes
const myMultiRoute = await slice.build("MultiRoute", {
   routes: [
      { path: '/shop/electronics', component: 'CategoryPage' },
      { path: '/shop/clothing', component: 'CategoryPage' }
   ]
});

// Add a new route dynamically
myMultiRoute.routes.push(
   { path: '/shop/books', component: 'CategoryPage' }
);

// Or replace all routes
myMultiRoute.routes = [
   { path: '/shop/electronics', component: 'CategoryPage' },
   { path: '/shop/clothing', component: 'CategoryPage' },
   { path: '/shop/books', component: 'CategoryPage' }
];

// Routes can be added, removed, or modified at runtime
// Useful for user-based navigation or conditional routing`,
         'Dynamic route management (code example only)'
      );

      // Añadir ejemplo de static props avanzado
      await this.createStaticPropsExample();
   }

   async createStaticPropsExample() {
      const staticPropsContainer = this.querySelector(".static-props-example");
      if (!staticPropsContainer) return;

      // Ejemplo mostrando toda la configuración
      const configExample = await slice.build("CodeVisualizer", {
         value: `// MultiRoute Static Props Configuration:
export default class MultiRoute extends HTMLElement {
   static props = {
      routes: { 
         type: 'array', 
         default: [], 
         required: false 
      }
   };

   constructor(props) {
      super();
      this.renderedComponents = new Map(); // Cache
      
      slice.controller.setComponentProps(this, props);
   }

   async render() {
      const currentPath = window.location.pathname;
      const routeMatch = this.routes.find(
         (route) => route.path === currentPath
      );

      if (routeMatch) {
         const { component } = routeMatch;
         
         // Check cache first
         if (this.renderedComponents.has(component)) {
            const cachedComponent = this.renderedComponents.get(component);
            this.innerHTML = '';
            
            // Call update if available
            if (cachedComponent.update) {
               await cachedComponent.update();
            }
            
            this.appendChild(cachedComponent);
         } else {
            // Build new component and cache it
            const newComponent = await slice.build(component, {
               sliceId: component
            });
            this.innerHTML = '';
            this.appendChild(newComponent);
            this.renderedComponents.set(component, newComponent);
         }
         
         // Emit event for observers (like MyNavigation)
         this.dispatchEvent(new CustomEvent('route-rendered', {
            bubbles: true,
            detail: { component, path: currentPath }
         }));
      } else {
         this.innerHTML = '';
      }
   }
}

// Example usage with automatic defaults:
const multiRoute = await slice.build("MultiRoute", {
   routes: [
      { path: '/page1', component: 'Page1' },
      { path: '/page2', component: 'Page2' }
   ]
});

// MultiRoute automatically handles:
// ✅ Route matching based on window.location.pathname
// ✅ Component caching for performance
// ✅ Calling update() on cached components
// ✅ Emitting 'route-rendered' events
// ✅ Cleaning up when no route matches`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(configExample);

      // Características adicionales
      const additionalInfo = document.createElement("div");
      additionalInfo.innerHTML = `
         <h4>Key Features</h4>
         <ul>
            <li><strong>Automatic caching:</strong> Components are cached per component name, not per route</li>
            <li><strong>Smart updates:</strong> Cached components with an update() method are automatically updated</li>
            <li><strong>Event system:</strong> Emits 'route-rendered' event for integration with other components</li>
            <li><strong>Clean state:</strong> Clears content when no route matches</li>
            <li><strong>Performance:</strong> Minimizes DOM operations by reusing components</li>
         </ul>
         
         <h4>Route Object Structure</h4>
         <ul>
            <li><strong>path</strong> (required): The URL pathname to match</li>
            <li><strong>component</strong> (required): The name of the component to render</li>
         </ul>
         
         <h4>Methods</h4>
         <ul>
            <li><strong>render():</strong> Manually trigger route rendering</li>
            <li><strong>renderIfCurrentRoute():</strong> Render only if a route matches current path</li>
            <li><strong>removeComponent():</strong> Remove cached component for current route</li>
         </ul>
         
         <h4>Best Practices</h4>
         <ul>
            <li>Use MultiRoute for sections with multiple related views</li>
            <li>Implement update() method in components for dynamic content</li>
            <li>Keep route paths organized and hierarchical</li>
            <li>Use component caching for better performance</li>
            <li>Listen to 'route-rendered' events for UI synchronization</li>
         </ul>
      `;
      staticPropsContainer.appendChild(additionalInfo);
   }

   async createMultiRouteExample(appendTo, multiRouteProps, codeProps, description = '', navigationButtons = null) {
      const div = document.createElement("div");
      div.classList.add("multiRouteContainer");
      
      // Crear botones de navegación si se proporcionan
      if (navigationButtons && navigationButtons.length > 0) {
         const navContainer = document.createElement("div");
         navContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
         `;

         for (const navButton of navigationButtons) {
            const button = await slice.build('Button', {
               value: navButton.label,
               customColor: {
                  button: 'var(--primary-color)',
                  label: 'var(--primary-color-contrast)'
               },
               onClickCallback: async () => {
                  // Navegar a la ruta
                  await slice.router.navigate(navButton.path);
                  
                  // Renderizar el MultiRoute
                  if (multiRoute) {
                     await multiRoute.render();
                  }
                  
                  // Actualizar el estado visual
                  updateActiveButton(button);
               }
            });
            
            navContainer.appendChild(button);
         }

         // Función para actualizar el botón activo
         const updateActiveButton = (activeBtn) => {
            const buttons = navContainer.querySelectorAll('slice-button');
            buttons.forEach(btn => {
               const btnElement = btn.querySelector('.slice_button');
               if (btn === activeBtn) {
                  btnElement.style.cssText = `
                     background-color: var(--secondary-color) !important;
                     border-color: var(--secondary-color) !important;
                  `;
               } else {
                  btnElement.style.cssText = `
                     background-color: var(--primary-color) !important;
                     border-color: var(--primary-color) !important;
                  `;
               }
            });
         };

         div.appendChild(navContainer);
      }
      
      const exampleDiv = document.createElement("div");
      exampleDiv.classList.add("multiRouteExample");
      
      // Solo crear MultiRoute si se proporcionaron las props
      let multiRoute = null;
      if (multiRouteProps) {
         multiRoute = await slice.build("MultiRoute", multiRouteProps);
         
         // Escuchar el evento route-rendered para actualizar la info
         multiRoute.addEventListener('route-rendered', (event) => {
            const { component, path } = event.detail;
            console.log(`🔄 MultiRoute rendered: ${component} at ${path}`);
            
            if (routeInfo) {
               const matchedRoute = multiRouteProps.routes.find(r => r.path === path);
               routeInfo.innerHTML = `
                  <strong>Configured Routes:</strong> ${multiRouteProps.routes.length} route(s)<br>
                  <strong>Current Path:</strong> ${path}<br>
                  <strong>Active Component:</strong> ${component}<br>
                  <strong>Status:</strong> <span class="cache-status cached">✓ Route Active</span>
               `;
            }
         });
         
         // Renderizar si la ruta actual coincide
         await multiRoute.renderIfCurrentRoute();
         
         exampleDiv.appendChild(multiRoute);
      }
      
      // Crear info sobre las rutas
      const routeInfo = document.createElement("div");
      routeInfo.classList.add("route-info");
      
      if (multiRouteProps) {
         const currentMatch = multiRouteProps.routes.find(r => r.path === window.location.pathname);
         routeInfo.innerHTML = `
            <strong>Configured Routes:</strong> ${multiRouteProps.routes.length} route(s)<br>
            <strong>Current Path:</strong> ${window.location.pathname}<br>
            <strong>Status:</strong> ${currentMatch
               ? `<span class="cache-status cached">✓ Active Route</span>` 
               : '<span class="cache-status new">No Match</span>'}
         `;
      } else {
         routeInfo.innerHTML = `
            <strong>Note:</strong> This is a code-only example (no interactive demo)
         `;
      }
      
      if (description) {
         routeInfo.innerHTML += `<br><strong>Description:</strong> ${description}`;
      }
      
      exampleDiv.appendChild(routeInfo);
      div.appendChild(exampleDiv);

      const componentCode = await slice.build("CodeVisualizer", {
         value: `const multiRoute = await slice.build("MultiRoute", ${codeProps});`,
         language: "javascript",
      });

      div.appendChild(componentCode);

      if (appendTo) {
         appendTo.appendChild(div);
      }
   }
}

customElements.define("slice-multiroutedocumentation", MultiRouteDocumentation);