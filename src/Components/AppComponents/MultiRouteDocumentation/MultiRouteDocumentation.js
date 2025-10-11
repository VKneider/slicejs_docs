export default class MultiRouteDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      const grid = await slice.build("Grid", { columns: 2, rows: 1 });
      grid.classList.add("multiRouteGrid");

      // Basic example showing static props defaults
      const simpleMultiRoute = await this.createMultiRoute(null, {});
      const myMultiRoute = await this.createMultiRoute(
         null,
         {
            routes: [
               { path: "/home", component: "HomeComponent" },
               { path: "/about", component: "AboutComponent" }
            ]
         },
         `{
        routes: [
          { path: "/home", component: "HomeComponent" },
          { path: "/about", component: "AboutComponent" }
        ],
        // routes defaults to [] (from static props)
      }`
      );

      if (window.screen.width <= 770) {
         grid.columns = 1;
      }

      await grid.setItem(simpleMultiRoute);
      await grid.setItem(myMultiRoute);

      this.querySelector(".myMultiRoute").appendChild(grid);

      // Advanced example showing dynamic route handling
      await this.createMultiRoute(
         this.querySelector(".advancedExample"),
         {
            routes: [
               { path: "/dashboard", component: "DashboardComponent" },
               { path: "/profile", component: "ProfileComponent" },
               { path: "/settings", component: "SettingsComponent" }
            ]
         },
         `{
        routes: [
          { path: "/dashboard", component: "DashboardComponent" },
          { path: "/profile", component: "ProfileComponent" },
          { path: "/settings", component: "SettingsComponent" }
        ],
        // Static Props Configuration:
        // routes: { type: "array", default: [], required: true }
      }`
      );

      // Add static props example
      await this.createStaticPropsExample();
   }

   // Method to show advanced static props example
   async createStaticPropsExample() {
      const staticPropsContainer = document.createElement("div");
      staticPropsContainer.classList.add("static-props-example");
      
      const title = document.createElement("h2");
      title.textContent = "Static Props Features";
      title.id = "staticPropsFeatures";
      staticPropsContainer.appendChild(title);

      const description = document.createElement("p");
      description.innerHTML = `
         The MultiRoute component uses <strong>Static Props</strong> for enhanced development experience. 
         Right-click any MultiRoute to see enhanced debugger information including prop configuration, 
         default values, and prop states.
      `;
      staticPropsContainer.appendChild(description);

      // Example with automatic defaults
      const defaultsMultiRoute = await this.createMultiRoute(
         null,
         {}, // No props - all use defaults
         `{
        // ✨ All props use automatic defaults from static props:
        // routes: [] (default from static props)
      }`
      );

      // Example showing validation
      const validationExample = await slice.build("CodeVisualizer", {
         value: `// MultiRoute Static Props Configuration:
export default class MultiRoute extends HTMLElement {
   static props = {
      routes: { 
         type: "array", 
         default: [], 
         required: true 
      }
   };
   
   constructor(props) {
      super();
      // Defaults applied automatically by Controller
      slice.controller.setComponentProps(this, props);
   }
   
   async render() {
      const currentPath = window.location.pathname;
      const routeMatch = this.props.routes.find((route) => route.path === currentPath);
      
      if (routeMatch) {
         const { component } = routeMatch;
         // Component caching and rendering logic
         if (this.renderedComponents.has(component)) {
            const cachedComponent = this.renderedComponents.get(component);
            this.innerHTML = "";
            if (cachedComponent.update) {
               await cachedComponent.update();
            }
            this.appendChild(cachedComponent);
         } else {
            const newComponent = await slice.build(component, { sliceId: component });
            this.innerHTML = "";
            this.appendChild(newComponent);
            this.renderedComponents.set(component, newComponent);
         }
      } else {
         this.innerHTML = "";
      }
   }
}

// Development-time validation examples:
const multiRoute1 = await slice.build("MultiRoute", {
   routes: "invalid" // Shows warning in development console
});

const multiRoute2 = await slice.build("MultiRoute", {
   unknownProp: "invalid" // Shows warning for unknown props
});

// Enhanced debugger features:
// - Right-click any MultiRoute to see prop configuration
// - View default values and current values
// - See prop states: Used (green), Optional (gray)
// - Component caching information`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(defaultsMultiRoute);
      staticPropsContainer.appendChild(validationExample);

      // Insert after the last existing example
      const advancedSection = this.querySelector(".advancedExample");
      advancedSection.parentNode.insertBefore(staticPropsContainer, advancedSection.nextSibling);
   }

   async createMultiRoute(appendTo, multiRouteProps, codeProps) {
      if (!codeProps) {
         codeProps = `{
        // ✨ Using MultiRoute static props defaults:
        // routes: [] (automatic default)
      }`;
      }
      const myMultiRoute = await slice.build("MultiRoute", multiRouteProps);

      const componentCode = await slice.build("CodeVisualizer", {
         value: `const myMultiRoute = await slice.build("MultiRoute", ${codeProps});

// MultiRoute automatically handles:
// - Route matching based on current pathname
// - Component caching for performance
// - Dynamic component rendering
// - Component lifecycle management`,
         language: "javascript",
      });

      const div = document.createElement("div");
      const multiRouteDiv = document.createElement("div");
      multiRouteDiv.classList.add("multiRoutes");
      multiRouteDiv.appendChild(myMultiRoute);
      div.classList.add("multiRouteContainer");
      div.appendChild(multiRouteDiv);
      div.appendChild(componentCode);

      if (appendTo) {
         appendTo.appendChild(div);
      }

      return div;
   }
}

customElements.define("slice-multi-route-documentation", MultiRouteDocumentation);
