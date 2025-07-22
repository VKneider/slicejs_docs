export default class SliceConfigDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      this.$configViewer = this.querySelector(".config-json-preview");
      this.$categoryExamples = this.querySelector(".component-category-examples");
      
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Create JSON configuration viewer
      const configVisualizer = await slice.build("CodeVisualizer", {
         value: this.getCompleteConfigExample(),
         language: "json"
      });
      
      this.$configViewer.appendChild(configVisualizer);
      
      // Create individual section examples
      await this.createSectionExamples();
      
      // Initialize expandable details
      await this.initializeDetailsComponents();
      
      // Create practical examples
      await this.createPracticalExamples();
   }
   
   getCompleteConfigExample() {
      return `{
  "debugger": {
    "enabled": false,
    "click": "right"
  },
  "stylesManager": {
    "requestedStyles": ["sliceStyles"]
  },
  "themeManager": {
    "enabled": true,
    "defaultTheme": "Slice",
    "saveThemeLocally": false,
    "useBrowserTheme": false
  },
  "logger": {
    "enabled": true,
    "showLogs": {
      "console": {
        "error": true,
        "warning": true,
        "info": false
      }
    }
  },
  "router": {
    "defaultRoute": "/"
  },
  "loading": {
    "enabled": true
  },
  "production": {
    "enabled": false
  },
  "paths": {
    "components": {
      "AppComponents": {
        "path": "/src/Components/AppComponents",
        "type": "Visual"
      },
      "Visual": {
        "path": "/src/Components/Visual",
        "type": "Visual"
      },
      "Service": {
        "path": "/src/Components/Service",
        "type": "Service"
      },
      "Structural": {
        "path": "/Slice/Components/Structural",
        "type": "Structural"
      }
    },
    "routes": "/src/routes.js",
    "themes": "/src/Themes",
    "styles": "/src/Styles"
  }
}`;
   }
   
   async createSectionExamples() {
      // Debugger configuration example
      const debuggerExample = await slice.build("CodeVisualizer", {
         value: `// Debugger Configuration Examples

// Enable debugger with right-click (default)
{
  "debugger": {
    "enabled": true,
    "click": "right"
  }
}

// Enable debugger with left-click
{
  "debugger": {
    "enabled": true,
    "click": "left"
  }
}

// Disable debugger completely (production recommended)
{
  "debugger": {
    "enabled": false
  }
}`,
         language: "json"
      });
      
      // Theme Manager example
      const themeExample = await slice.build("CodeVisualizer", {
         value: `// Theme Manager Configuration Examples

// Basic theme configuration
{
  "themeManager": {
    "enabled": true,
    "defaultTheme": "Light",
    "saveThemeLocally": true,
    "useBrowserTheme": false
  }
}

// Auto browser theme detection
{
  "themeManager": {
    "enabled": true,
    "defaultTheme": "Light",
    "saveThemeLocally": true,
    "useBrowserTheme": true  // Uses system preference
  }
}

// Custom theme configuration
{
  "themeManager": {
    "enabled": true,
    "defaultTheme": "MyCustomTheme",
    "saveThemeLocally": false,
    "useBrowserTheme": false
  }
}`,
         language: "json"
      });

      // Router configuration example
      const routerExample = await slice.build("CodeVisualizer", {
         value: `// Router Configuration Examples

// Basic router configuration
{
  "router": {
    "defaultRoute": "/"
  }
}

// Custom default route
{
  "router": {
    "defaultRoute": "/dashboard"
  }
}

// Home page as default
{
  "router": {
    "defaultRoute": "/home"
  }
}`,
         language: "json"
      });

      // Logger configuration example
      const loggerExample = await slice.build("CodeVisualizer", {
         value: `// Logger Configuration Examples

// Development configuration (verbose)
{
  "logger": {
    "enabled": true,
    "showLogs": {
      "console": {
        "error": true,
        "warning": true,
        "info": true
      }
    }
  }
}

// Production configuration (errors only)
{
  "logger": {
    "enabled": true,
    "showLogs": {
      "console": {
        "error": true,
        "warning": false,
        "info": false
      }
    }
  }
}

// Completely disable logging
{
  "logger": {
    "enabled": false
  }
}`,
         language: "json"
      });

      // Loading configuration example
      const loadingExample = await slice.build("CodeVisualizer", {
         value: `// Loading Component Configuration Examples

// Enable loading component
{
  "loading": {
    "enabled": true
  }
}

// Disable loading component
{
  "loading": {
    "enabled": false
  }
}`,
         language: "json"
      });

      // Paths configuration example
      const pathsExample = await slice.build("CodeVisualizer", {
         value: `// Paths Configuration Examples

// Default paths configuration
{
  "paths": {
    "components": {
      "AppComponents": {
        "path": "/src/Components/AppComponents",
        "type": "Visual"
      },
      "Visual": {
        "path": "/src/Components/Visual", 
        "type": "Visual"
      },
      "Service": {
        "path": "/src/Components/Service",
        "type": "Service"
      }
    },
    "routes": "/src/routes.js",
    "themes": "/src/Themes",
    "styles": "/src/Styles"
  }
}

// Custom paths configuration
{
  "paths": {
    "components": {
      "Pages": {
        "path": "/src/Pages",
        "type": "Visual"
      },
      "Widgets": {
        "path": "/src/Widgets",
        "type": "Visual"
      },
      "Services": {
        "path": "/src/Services",
        "type": "Service"
      }
    },
    "routes": "/src/config/routes.js",
    "themes": "/assets/themes",
    "styles": "/assets/styles"
  }
}`,
         language: "json"
      });

      // Add examples to DOM
      this.querySelector(".debugger-config-example").appendChild(debuggerExample);
      this.querySelector(".theme-config-example").appendChild(themeExample);
      this.querySelector(".router-config-example").appendChild(routerExample);
      this.querySelector(".logger-config-example").appendChild(loggerExample);
      this.querySelector(".loading-config-example").appendChild(loadingExample);
      this.querySelector(".paths-config-example").appendChild(pathsExample);
   }

   async createPracticalExamples() {
      // Development vs Production example
      const envExample = await slice.build("CodeVisualizer", {
         value: `// Development Environment Configuration
{
  "debugger": { "enabled": true, "click": "right" },
  "logger": {
    "enabled": true,
    "showLogs": {
      "console": { "error": true, "warning": true, "info": true }
    }
  },
  "production": { "enabled": false },
  "loading": { "enabled": true },
  "themeManager": {
    "enabled": true,
    "defaultTheme": "Light",
    "saveThemeLocally": true
  }
}

// Production Environment Configuration  
{
  "debugger": { "enabled": false },
  "logger": {
    "enabled": true,
    "showLogs": {
      "console": { "error": true, "warning": false, "info": false }
    }
  },
  "production": { "enabled": true },
  "loading": { "enabled": true },
  "themeManager": {
    "enabled": true,
    "defaultTheme": "Light",
    "saveThemeLocally": true,
    "useBrowserTheme": true
  }
}`,
         language: "json"
      });

      // Multi-project setup example
      const multiProjectExample = await slice.build("CodeVisualizer", {
         value: `// Large Application Configuration
{
  "paths": {
    "components": {
      "AdminComponents": {
        "path": "/src/Admin/Components",
        "type": "Visual"
      },
      "UserComponents": {
        "path": "/src/User/Components", 
        "type": "Visual"
      },
      "SharedComponents": {
        "path": "/src/Shared/Components",
        "type": "Visual"
      },
      "ApiServices": {
        "path": "/src/Services/Api",
        "type": "Service"
      },
      "UtilServices": {
        "path": "/src/Services/Utils",
        "type": "Service"
      }
    },
    "routes": "/src/config/routes.js",
    "themes": "/src/assets/themes",
    "styles": "/src/assets/styles"
  },
  "router": {
    "defaultRoute": "/dashboard"
  },
  "themeManager": {
    "enabled": true,
    "defaultTheme": "Corporate",
    "saveThemeLocally": true,
    "useBrowserTheme": false
  },
  "loading": {
    "enabled": true
  }
}`,
         language: "json"
      });

      this.querySelector(".env-examples").appendChild(envExample);
      this.querySelector(".multi-project-examples").appendChild(multiProjectExample);
   }
   
   async initializeDetailsComponents() {
      const sections = [
         {
            title: "Debugger Configuration",
            text: `Controls the debugging tools for development. The debugger allows you to inspect and modify component properties in real-time, view Static Props configuration, and monitor component states.

Key Options:
• enabled (boolean): Activates/deactivates the debugger
• click ("left" | "right"): Defines which mouse click activates the debugger

The debugger automatically detects Static Props and shows enhanced information including prop configuration, default values, and prop states (Used/Missing/Optional). It includes anti-interference protection to prevent conflicts with Router events.

Best Practice: Enable in development, disable in production.`
         },
         {
            title: "Theme Manager Configuration", 
            text: `Controls the application"s theme system, allowing dynamic theme switching and consistent styling across components.

Key Options:
• enabled (boolean): Activates/deactivates the theme system
• defaultTheme (string): Default theme name to use on startup
• saveThemeLocally (boolean): Saves user theme preference in localStorage
• useBrowserTheme (boolean): Uses system preference (light/dark mode)

Themes are CSS files located in the themes directory. The system uses CSS variables for consistent styling across components. Built-in themes include "Light", "Dark", and "Slice".

Usage: slice.setTheme("ThemeName") for runtime theme switching.`
         },
         {
            title: "Router Configuration",
            text: `Configures the application"s routing system, which handles navigation between views using the History API.

Key Options:
• defaultRoute (string): Default route when none is specified

The router automatically intercepts clicks on anchor elements for internal navigation. Links that are NOT intercepted include external links, special protocols (mailto:, tel:), download links, target="_blank", and elements with "external-link" or "no-intercept" classes.

The router supports dynamic routes, nested routes, component pooling, and provides statistics for monitoring.`
         },
         {
            title: "Logger Configuration",
            text: `Configures the logging system for debugging, error tracking, and application monitoring.

Key Options:
• enabled (boolean): Activates/deactivates the logger
• showLogs.console.error (boolean): Shows error messages in console
• showLogs.console.warning (boolean): Shows warning messages in console  
• showLogs.console.info (boolean): Shows informational messages in console

The logger provides structured logging with component context. Use slice.logger.logError(), slice.logger.logWarning(), and slice.logger.logInfo() methods. You can filter logs by type or component and clear logs when needed.

Best Practice: Enable all levels in development, only errors in production.`
         },
         {
            title: "Loading Component Configuration",
            text: `Controls the global loading component that displays during navigation and async operations.

Key Options:
• enabled (boolean): Activates/deactivates the loading component

When enabled, the Router automatically uses the Loading component during navigation. The component can be customized by modifying files in the Visual/Loading directory. Use slice.loading.start() and slice.loading.stop() for manual control.`
         },
         {
            title: "Production Configuration",
            text: `Configures optimizations and features for production deployment.

Key Options:
• enabled (boolean): Activates production mode

When production mode is enabled, the framework may apply performance optimizations and disable development warnings. This setting affects how the application behaves in production environment.

Best Practice: Enable for production builds, disable for development.`
         },
         {
            title: "Paths Configuration",
            text: `Defines the directory structure and paths for different types of components and resources.

Key Sections:
• components: Maps component categories to their filesystem paths
• routes: Location of the routes configuration file
• themes: Directory containing theme CSS files
• styles: Directory containing global style files

Each component category in the "components" object defines:
• path: Filesystem location relative to project root
• type: Component type ("Visual", "Service", or "Structural")

This configuration is used by the Slice CLI for component generation and by the framework for resource loading. Custom paths allow flexible project structures.`
         }
      ];
      
      for (const section of sections) {
         const details = await slice.build("Details", section);
         this.querySelector(".config-details-container").appendChild(details);
      }
   }
}

customElements.define("slice-config-documentation", SliceConfigDocumentation);