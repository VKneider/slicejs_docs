export default class StructuralDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Controller documentation section - ACTUALIZADO
      const controllerExample = await slice.build("CodeVisualizer", {
         value: `// Accessing components through the Controller
// Get a reference to a component by its sliceId
const navbar = slice.controller.getComponent("main-navbar");

// Check if a component is registered
if (slice.controller.activeComponents.has("user-profile")) {
   // Component exists
}

// Get all active components
const allComponents = slice.controller.activeComponents;

// Static Props System
// Components can define static props for automatic defaults and validation
export default class Button extends HTMLElement {
   static props = {
      value: { 
         type: "string", 
         default: "Button", 
         required: false 
      },
      onClickCallback: { 
         type: "function", 
         default: null 
      }
   };
   
   constructor(props) {
      super();
      slice.attachTemplate(this);
      // Defaults applied automatically by Controller
      slice.controller.setComponentProps(this, props);
   }
}

// Build a component with Controller (defaults applied automatically)
const myButton = await slice.build("Button", {
   value: "Click Me"
   // onClickCallback uses default: null
});

// Automatic validation in development
// Controller validates props automatically when static props are defined
// Unknown props show warnings, missing required props show errors`,
         language: "javascript"
      });
      
      this.querySelector(".controller-example").appendChild(controllerExample);

      const controllerDestroyExample = await slice.build("CodeVisualizer", {
         value: `// Component destruction to avoid memory leaks
// 1) Destroy by container (recommended for dynamic lists)
const container = this.querySelector(".items");
slice.controller.destroyByContainer(container);
container.innerHTML = "";

// 2) Destroy by component or sliceId
slice.controller.destroyComponent(myComponent);
slice.controller.destroyComponent("product-42");

// 3) Destroy by pattern
slice.controller.destroyByPattern(/^item-/);

// beforeDestroy hook runs automatically
export default class MyComponent extends HTMLElement {
   beforeDestroy() {
      // Cleanup timers, subscriptions, or pending work
      clearInterval(this._pollingId);
   }
}`,
         language: "javascript"
      });

      this.querySelector(".controller-destroy-example").appendChild(controllerDestroyExample);

      // Router documentation section - ACTUALIZADO
      const routerExample = await slice.build("CodeVisualizer", {
         value: `// Declaring routes in routes.js (unchanged)
const routes = [
   { path: "/", component: "LandingPage" },
   { path: "/documentation", component: "DocumentationPage" },
   { 
      path: "/user/$id", // Dynamic route parameter
      component: "UserProfile" 
   },
   { path: "/404", component: "NotFound" }
];

export default routes;

// Basic navigation (unchanged)
await slice.router.navigate("/documentation");
const currentRoute = slice.router.activeRoute;

// Navigation using anchor elements
// The router automatically intercepts anchor clicks for internal navigation
const link = document.createElement("a");
link.href = "/documentation";
link.textContent = "Go to Documentation";
// Router automatically handles the click without page reload

// HTML anchor elements work automatically
// <a href="/user/123">View User Profile</a>
// No special setup required - router intercepts internal links

// Use Link component for enhanced functionality
const enhancedLink = await slice.build("Link", {
   href: "/user/123",
   text: "View User Profile"
});

// Anchor elements that are NOT intercepted:
// - External links (different domain)
// - Special protocols (mailto:, tel:, ftp:)
// - Hash links (#section)
// - Links with target="_blank" or download attribute
// - Links with class "external-link" or "no-intercept"
// - Links with data-no-intercept attribute

// Dynamic route management
// Add routes at runtime
slice.router.addRoute({ 
   path: "/admin", 
   component: "AdminPanel" 
});

// Remove routes dynamically
slice.router.removeRoute("/deprecated-page");

// Update entire route configuration
slice.router.updateRoutes(newRoutesArray);

// Get all registered routes
const allRoutes = slice.router.getAllRoutes();

// Router statistics and monitoring
const stats = slice.router.getStats();
console.log("Router initialized:", stats.isInitialized);
console.log("Currently navigating:", stats.isNavigating);
console.log("Active route:", stats.activeRoute);
console.log("Cache size:", stats.cache.size);
console.log("Routes count:", stats.matcher.routes.length);

// Router lifecycle management
// Destroy router and cleanup resources
slice.router.destroy();

// Reinitialize router (useful for testing)
await slice.router.reinitialize(optionalNewRoutes);`,
         language: "javascript"
      });
      
      this.querySelector(".router-example").appendChild(routerExample);

      // StylesManager documentation section (sin cambios)
      const stylesManagerExample = await slice.build("CodeVisualizer", {
         value: `// Configuring themes in sliceConfig.json
{
   "themeManager": {
      "enabled": true,
      "defaultTheme": "Light",
      "saveThemeLocally": true,
      "useBrowserTheme": false
   }
}

// Theme file structure (e.g., Light.css)
:root {
   --font-primary-color: #000;
   --primary-color: #0066ff;
   --primary-background-color: #fff;
   // ...more theme variables
}

// Switching themes in your components
// Change the current theme
await slice.setTheme("Dark");

// Get the current theme
const currentTheme = slice.theme;

// Access StylesManager directly (rarely needed)
slice.stylesManager.appendComponentStyles(".my-custom-style { color: red; }");`,
         language: "javascript"
      });
      
      this.querySelector(".styles-manager-example").appendChild(stylesManagerExample);

      // Logger documentation section (sin cambios)
      const loggerExample = await slice.build("CodeVisualizer", {
         value: `// Configuring logger in sliceConfig.json
{
   "logger": {
      "enabled": true,
      "showLogs": {
         "console": {
            "error": true,
            "warning": true,
            "info": false
         }
      }
   }
}

// Using Logger in your components
// Log an error
slice.logger.logError("MyComponent", "Failed to load data", error);

// Log a warning
slice.logger.logWarning("MyComponent", "Data partially loaded");

// Log information
slice.logger.logInfo("MyComponent", "Component initialized");

// Get all logs
const allLogs = slice.logger.getLogs();

// Get logs by type
const errorLogs = slice.logger.getLogsByLogType("error");

// Get logs for a specific component
const componentLogs = slice.logger.getLogsByComponent("my-component");

// Clear logs
slice.logger.clearLogs();`,
         language: "javascript"
      });
      
      this.querySelector(".logger-example").appendChild(loggerExample);

      // Debugger documentation section - ACTUALIZADO
      const debuggerExample = await slice.build("CodeVisualizer", {
         value: `// Configuring debugger in sliceConfig.json
{
   "debugger": {
      "enabled": true,
      "click": "right" // "right" for right-click, "left" for left-click
   }
}

// Enhanced debugger with static props integration
export default class MyComponent extends HTMLElement {
   // Static props automatically detected by debugger
   static props = {
      title: { 
         type: "string", 
         default: "Default Title", 
         required: false 
      },
      count: { 
         type: "number", 
         default: 0 
      },
      isActive: { 
         type: "boolean", 
         default: false,
         required: true 
      }
   };
   
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      
      // debuggerProps no longer needed for static props components
      // Debugger automatically detects static props configuration
   }
}

// Debugger shows enhanced information:
// - Static props configuration (type, default, required)
// - Prop states: Used (green), Missing (red), Optional (gray)
// - Default values applied automatically
// - Anti-interference protection from Router events
// - Real-time prop editing with validation

// Components without static props still work:
export default class LegacyComponent extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      
      // For components without static props, specify debuggerProps manually
      this.debuggerProps = ["value", "color", "isActive"];
   }
}`,
         language: "javascript"
      });
      
      this.querySelector(".debugger-example").appendChild(debuggerExample);

      // FAQ section - ACTUALIZADA
      const faqQuestions = [
         {
            title: "Can I create my own structural components?",
            text: "No. Structural components are part of the core Slice.js framework and are not meant to be created or modified by users."
         },
         {
            title: "How do I configure structural components?",
            text: "Most structural components are configured through the sliceConfig.json file in your project root. This file allows you to enable/disable features and set various configuration options for each structural component."
         },
         {
            title: "How are structural components initialized?",
            text: "Structural components are automatically initialized during the Slice.js bootstrap process in Slice.js. The initialization sequence is controlled by the Slice.js core and ensures components are loaded in the correct order to resolve dependencies."
         },
         {
            title: "Can I access structural components directly?",
            text: "Yes, most structural components are accessible through the global slice object, such as slice.controller, slice.router, slice.logger, etc. However, direct manipulation should be done carefully and only when necessary."
         },
         {
            title: "What are Static Props and how do I use them?",
            text: "Static Props allow you to define prop configuration directly in your component class. Include type, default values, and required status. The Controller automatically applies defaults and validates props in development mode."
         },
         {
            title: "How do components work without Static Props?",
            text: "Components without Static Props work perfectly fine using manual prop handling in the constructor. You can specify debuggerProps manually for debugging. Both approaches are supported."
         },
         {
            title: "How do I migrate to Static Props?",
            text: "Simply add a static props property to your component class with the prop configuration. Remove manual default value assignment from your constructor. The Controller will handle defaults automatically."
         },
         {
            title: "Can I manage routes dynamically?",
            text: "Yes! The Router supports addRoute(), removeRoute(), updateRoutes(), and getAllRoutes() for dynamic route management. You can also get detailed statistics with getStats() and manage the router lifecycle with destroy() and reinitialize()."
         },
         {
            title: "How does navigation with anchor elements work?",
            text: "The Router automatically intercepts clicks on anchor elements (<a href=`/path`>) and handles navigation without page reloads. You can also use the Link component for enhanced functionality with additional features."
         },
         {
            title: "How does the debugger work?",
            text: "The debugger automatically detects Static Props and shows enhanced information including prop configuration, default values, and prop states (Used/Missing/Optional). It includes anti-interference protection and works seamlessly with all types of components."
         },
         {
            title: "How do I extend the Router for advanced functionality?",
            text: "For advanced routing needs, you can implement route guards or middleware by extending the existing Router through service components. Create a custom RouterService that wraps the structural Router and adds your custom logic for route authorization, data prefetching, or analytics tracking. You can also use the new dynamic route management features."
         }
      ];

      const faqContainer = this.querySelector(".faq-section");
      
      for (const question of faqQuestions) {
         const detailsComponent = await slice.build("Details", {
            title: question.title,
            text: question.text
         });
         
         faqContainer.appendChild(detailsComponent);
      }
   }
}

customElements.define("slice-structuraldocumentation", StructuralDocumentation);