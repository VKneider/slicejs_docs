export default class SliceConfigDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      this.$configViewer = this.querySelector('.config-json-preview');
      this.$categoryExamples = this.querySelector('.component-category-examples');
      
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Create JSON configuration viewer
      const configVisualizer = await slice.build('CodeVisualizer', {
         value: this.getFormattedConfig(),
         language: 'javascript'
      });
      
      this.$configViewer.appendChild(configVisualizer);
      
      // Create CLI command examples for each category
      await this.createCategoryExamples();
      
      // Create code examples for each main section
      await this.createSectionExamples();
      
      // Initialize expandable details
      await this.initializeDetailsComponents();
   }
   
   getFormattedConfig() {
      return `{
    "debugger": {
        "enabled": false,
        "click": "right"
    },
    "stylesManager":{
        "requestedStyles":["sliceStyles"]
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
    "paths": {
        "components": {
            "AppComponents":{
                "path":"/Components/AppComponents",
                "type":"Visual"
            },
            "Visual":{
                "path":"/Components/Visual",
                "type":"Visual"
            },
            "Service":{
                "path":"/Components/Service",
                "type":"Service"
            }
        },
        "themes": "/Themes",
        "styles": "/Styles",
        "routesFile":"/routes.js"
    },
    "router":{
        "defaultRoute": "/"
    },
    "loading":{
        "enabled": true
    },
    "production": {
        "enabled": false
    }
}`;
   }
   
   async createCategoryExamples() {
      // Create examples for component categories
      
      // AppComponents
      const appComponentExample = await slice.build('CodeVisualizer', {
         value: `// Create an AppComponent from CLI
npm run slice:create AppComponents MyDashboard

// Resulting structure
├── src/
│   ├── Components/
│   │   ├── AppComponents/
│   │   │   ├── MyDashboard/
│   │   │   │   ├── MyDashboard.js
│   │   │   │   ├── MyDashboard.html
│   │   │   │   └── MyDashboard.css`,
         language: 'bash'
      });
      
      // Visual
      const visualComponentExample = await slice.build('CodeVisualizer', {
         value: `// Create a Visual component from CLI
npm run slice:create Visual DataTable

// Resulting structure
├── src/
│   ├── Components/
│   │   ├── Visual/
│   │   │   ├── DataTable/
│   │   │   │   ├── DataTable.js
│   │   │   │   ├── DataTable.html
│   │   │   │   └── DataTable.css`,
         language: 'bash'
      });
      
      // Service
      const serviceComponentExample = await slice.build('CodeVisualizer', {
         value: `// Create a Service component from CLI
npm run slice:create Service DataProvider

// Resulting structure
├── src/
│   ├── Components/
│   │   ├── Service/
│   │   │   ├── DataProvider/
│   │   │   │   └── DataProvider.js`,
         language: 'bash'
      });
      
      // Add content to corresponding sections
      this.querySelector('.app-components-example').appendChild(appComponentExample);
      this.querySelector('.visual-components-example').appendChild(visualComponentExample);
      this.querySelector('.service-components-example').appendChild(serviceComponentExample);
   }
   
   async createSectionExamples() {
      // Loading customization example
      const loadingExample = await slice.build('CodeVisualizer', {
         value: `// Customize the Loading component in src/Components/Visual/Loading/Loading.js

export default class Loading extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = ['isActive'];
   }

   init() {
      // Customize initial behavior
      const loadingSpinner = this.querySelector('.loading-spinner');
      loadingSpinner.style.borderColor = 'var(--custom-spinner-color)';
   }

   start() {
      // Show component and custom loading animation
      document.body.appendChild(this);
      this._isActive = true;
      
      // Custom loading start logic
      console.log('Custom loading started');
   }

   stop() {
      // Stop and hide the animation
      this.remove();
      this._isActive = false;
      
      // Custom logic when loading finishes
      console.log('Custom loading finished');
   }
}

customElements.define('slice-loading', Loading);`,
         language: 'javascript'
      });
      
      // Theme customization example
      const themeExample = await slice.build('CodeVisualizer', {
         value: `// Create a new theme in src/Themes/MyCustomTheme.css

:root {
  /* Main colors */
  --font-primary-color: #333333;
  --font-secondary-color: #666666;
  
  /* Primary */
  --primary-color: #5D4FEB;
  --primary-color-rgb: 93, 79, 235;
  --primary-background-color: #F8F9FA;
  --primary-color-contrast: #FFFFFF;
  --primary-color-shade: #4A3FC9;
  
  /* Secondary */
  --secondary-color: #30B8C4;
  --secondary-color-rgb: 48, 184, 196;
  --secondary-background-color: #EDF7F8;
  --secondary-color-contrast: #FFFFFF;
  
  /* Tertiary */
  --tertiary-background-color: #F0F1F6;
  
  /* States */
  --success-color: #28C76F;
  --success-contrast: #FFFFFF;
  --warning-color: #FFAB00;
  --warning-contrast: #FFFFFF;
  --danger-color: #EA5455;
  --danger-contrast: #FFFFFF;
  --medium-color: #ABB4BD;
  --medium-contrast: #FFFFFF;
  --disabled-color: #C3C3C3;
  
  /* Borders and radiusing */
  --border-radius-slice: 8px;
  --slice-border: 1px;
}`,
         language: 'css'
      });
      
      // Configuration update example
      const updateConfigExample = await slice.build('CodeVisualizer', {
         value: `// Modify sliceConfig.json to use the new theme and enable the debugger

{
    "debugger": {
        "enabled": true,  // Enable the debugger
        "click": "left"   // Change to left click
    },
    "themeManager": {
        "enabled": true,
        "defaultTheme": "MyCustomTheme",  // Use the new theme
        "saveThemeLocally": true,         // Save preference in localStorage
        "useBrowserTheme": false
    },
    "logger": {
        "enabled": true,
        "showLogs": {
            "console": {
                "error": true,
                "warning": true,
                "info": true  // Also show info messages
            }
        }
    }
    // Rest of the configuration...
}`,
         language: 'javascript'
      });
      
      // Add examples to corresponding sections
      this.querySelector('.loading-example').appendChild(loadingExample);
      this.querySelector('.theme-example').appendChild(themeExample);
      this.querySelector('.config-update-example').appendChild(updateConfigExample);
   }
   
   async initializeDetailsComponents() {
      // Create expandable detail components for each section
      const sections = [
         {
            title: "Debugger Configuration",
            text: `The 'debugger' section controls debugging tools for visual components. When enabled, it allows inspecting and modifying component properties in real-time.

Options:
- enabled: Activates/deactivates the debugger (true/false)
- click: Defines which click will activate the debugger ('left' or 'right')`
         },
         {
            title: "Styles Manager",
            text: `The 'stylesManager' section controls global styles that will be loaded automatically.

Options:
- requestedStyles: Array with CSS filenames to load from the styles folder.`
         },
         {
            title: "Theme Manager",
            text: `The 'themeManager' section controls the application's theme system.

Options:
- enabled: Activates/deactivates the theme system (true/false)
- defaultTheme: Default theme to use
- saveThemeLocally: Saves theme preference in localStorage
- useBrowserTheme: Uses the browser theme (light/dark)`
         },
         {
            title: "Logger",
            text: `The 'logger' section configures the logging system for debugging and tracking.

Options:
- enabled: Activates/deactivates the logger (true/false)
- showLogs: Configures which types of messages to show and where
  - console: Configuration for the browser console
    - error: Shows error messages
    - warning: Shows warnings
    - info: Shows informational messages`
         },
        
         {
            title: "Router",
            text: `The 'router' section configures the application router.

Options:
- defaultRoute: Default route when none is specified.`
         },
         {
            title: "Loading",
            text: `The 'loading' section configures the global loading component.

Options:
- enabled: Activates/deactivates the loading component (true/false)

When activated, the Router will use the Loading component during navigation. This component can be customized by modifying the files in src/Components/Visual/Loading/.`
         },
         {
            title: "Production",
            text: `The 'production' section configures options for the production environment.

Options:
- enabled: Activates/deactivates production mode (true/false)

When activated, optimized and minified versions of resources will be used.`
         }
      ];
      
      for (const section of sections) {
         const details = await slice.build('Details', section);
         this.querySelector('.config-details-container').appendChild(details);
      }
   }
}

customElements.define('slice-config-documentation', SliceConfigDocumentation);