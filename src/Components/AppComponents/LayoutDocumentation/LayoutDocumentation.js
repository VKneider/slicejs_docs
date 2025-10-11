export default class LayoutDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Ejemplo básico con view
      await this.createLayoutExample(
         this.querySelector(".basicLayout"),
         async () => {
            // Crear el contenido con etiquetas explicativas
            const content = document.createElement("div");
            content.style.cssText = "padding: 30px; background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); border-radius: 8px; text-align: center;";
            
            const label = document.createElement("div");
            label.style.cssText = "background-color: var(--primary-background-color); color: var(--primary-color); padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; font-size: 0.85em; margin-bottom: 15px;";
            label.textContent = "📄 VIEW (content)";
            
            const title = document.createElement("h3");
            title.style.cssText = "color: white; margin: 10px 0;";
            title.textContent = "Main Content Area";
            
            const description = document.createElement("p");
            description.style.cssText = "color: rgba(255,255,255,0.9); margin: 10px 0 0 0;";
            description.textContent = "This is the view content passed to the Layout component";
            
            content.appendChild(label);
            content.appendChild(title);
            content.appendChild(description);

            const layout = await slice.build("Layout", {
               view: content
            });
            
            return layout;
         },
         `// Create content element
const content = document.createElement("div");
content.innerHTML = "<h2>Main Content</h2>";

// Build Layout with only view
const layout = await slice.build("Layout", {
   view: content  // ← This is the main content area
});

// Static Props defaults:
// layout: null (no fixed elements)
// view: null`
      );

      // Ejemplo con navbar y view
      await this.createLayoutExample(
         this.querySelector(".layoutAndView"),
         async () => {
            // Crear navbar con etiqueta
            const navbarWrapper = document.createElement("div");
            navbarWrapper.style.cssText = "position: relative;";
            
            const navbarLabel = document.createElement("div");
            navbarLabel.style.cssText = "position: absolute; top: -30px; left: 0; background-color: var(--success-color); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; z-index: 10;";
            navbarLabel.textContent = "🔧 LAYOUT (navbar)";
            
            const navbar = await slice.build("Navbar", {
               items: [
                  { text: "Home", path: "/" },
                  { text: "Docs", path: "/docs" },
                  { text: "About", path: "/about" }
               ]
            });
            
            navbarWrapper.appendChild(navbarLabel);
            navbarWrapper.appendChild(navbar);

            // Crear contenido con etiqueta
            const contentWrapper = document.createElement("div");
            contentWrapper.style.cssText = "position: relative; margin-top: 40px;";
            
            const contentLabel = document.createElement("div");
            contentLabel.style.cssText = "position: absolute; top: -30px; left: 0; background-color: var(--primary-color); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; z-index: 10;";
            contentLabel.textContent = "📄 VIEW (content)";
            
            const content = document.createElement("div");
            content.style.cssText = "padding: 40px; background-color: var(--secondary-background-color); border-radius: 8px; border: 2px solid var(--primary-color);";
            content.innerHTML = "<h3 style='color: var(--primary-color); margin-top: 0;'>Page Content</h3><p style='color: var(--font-secondary-color);'>The <strong>layout</strong> (navbar) appears first and stays fixed.<br>The <strong>view</strong> (this content) is the main area that can change.</p>";
            
            contentWrapper.appendChild(contentLabel);
            contentWrapper.appendChild(content);

            const layout = await slice.build("Layout", {
               layout: navbarWrapper,
               view: contentWrapper
            });
            
            return layout;
         },
         `// Create navbar (fixed element)
const navbar = await slice.build("Navbar", {
   items: [
      { text: "Home", path: "/" },
      { text: "Docs", path: "/docs" }
   ]
});

// Create main content
const content = document.createElement("div");
content.innerHTML = "<h2>Page Content</h2>";

// Build Layout with both
const layout = await slice.build("Layout", {
   layout: navbar,  // ← Fixed navbar (layout prop)
   view: content    // ← Main content (view prop)
});`
      );

      // Ejemplo usando onLayOut para múltiples elementos
      await this.createLayoutExample(
         this.querySelector(".onLayoutMethod"),
         async () => {
            // Navbar con etiqueta
            const navbarWrapper = document.createElement("div");
            navbarWrapper.style.cssText = "position: relative;";
            
            const navbarLabel = document.createElement("div");
            navbarLabel.style.cssText = "position: absolute; top: -30px; left: 0; background-color: var(--warning-color); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; z-index: 10;";
            navbarLabel.textContent = "⚙️ Added with onLayOut() #1";
            
            const navbar = await slice.build("Navbar", {
               items: [
                  { text: "Dashboard", path: "/" },
                  { text: "Profile", path: "/profile" }
               ]
            });
            
            navbarWrapper.appendChild(navbarLabel);
            navbarWrapper.appendChild(navbar);

            // Sidebar con etiqueta
            const sidebarWrapper = document.createElement("div");
            sidebarWrapper.style.cssText = "position: relative; margin-top: 40px;";
            
            const sidebarLabel = document.createElement("div");
            sidebarLabel.style.cssText = "position: absolute; top: -30px; left: 0; background-color: var(--warning-color); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; z-index: 10;";
            sidebarLabel.textContent = "⚙️ Added with onLayOut() #2";
            
            const sidebar = document.createElement("div");
            sidebar.style.cssText = "background-color: var(--tertiary-background-color); padding: 20px; border-radius: 8px; border: 2px solid var(--warning-color);";
            sidebar.innerHTML = "<h4 style='color: var(--warning-color); margin: 0 0 15px 0;'>📁 Sidebar Menu</h4><div style='color: var(--font-secondary-color); font-size: 0.9em;'><p style='margin: 5px 0; padding: 8px; background-color: var(--secondary-background-color); border-radius: 4px;'>⚙️ Settings</p><p style='margin: 5px 0; padding: 8px; background-color: var(--secondary-background-color); border-radius: 4px;'>👤 Profile</p><p style='margin: 5px 0; padding: 8px; background-color: var(--secondary-background-color); border-radius: 4px;'>📊 Analytics</p></div>";
            
            sidebarWrapper.appendChild(sidebarLabel);
            sidebarWrapper.appendChild(sidebar);

            // Content con etiqueta
            const contentWrapper = document.createElement("div");
            contentWrapper.style.cssText = "position: relative; margin-top: 40px;";
            
            const contentLabel = document.createElement("div");
            contentLabel.style.cssText = "position: absolute; top: -30px; left: 0; background-color: var(--primary-color); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; z-index: 10;";
            contentLabel.textContent = "📄 VIEW (main content)";
            
            const content = document.createElement("div");
            content.style.cssText = "padding: 40px; background-color: var(--secondary-background-color); border-radius: 8px; border: 2px solid var(--primary-color);";
            content.innerHTML = "<h3 style='color: var(--primary-color); margin-top: 0;'>📊 Main Dashboard</h3><p style='color: var(--font-secondary-color);'><strong>Both navbar and sidebar are fixed</strong> using <code>onLayOut()</code><br><br>They will stay visible even when the view changes.<br>The view is the only part that gets replaced with <code>showing()</code></p>";
            
            contentWrapper.appendChild(contentLabel);
            contentWrapper.appendChild(content);

            const layout = await slice.build("Layout", {
               view: contentWrapper
            });

            // Agregar elementos fijos
            layout.onLayOut(navbarWrapper);
            layout.onLayOut(sidebarWrapper);
            
            return layout;
         },
         `// Create fixed elements
const navbar = await slice.build("Navbar", { ... });
const sidebar = document.createElement("div");
sidebar.innerHTML = "<h4>Menu</h4>";

// Create main content
const content = document.createElement("div");
content.innerHTML = "<h2>Dashboard</h2>";

// Build Layout with view only
const layout = await slice.build("Layout", {
   view: content  // ← Initial content
});

// Add multiple fixed elements
layout.onLayOut(navbar);   // ← Fixed element #1
layout.onLayOut(sidebar);  // ← Fixed element #2

// Both navbar and sidebar persist
// Only the view changes with showing()`
      );

      // Ejemplo interactivo con showing()
      await this.createLayoutExample(
         this.querySelector(".showingMethod"),
         async () => {
            // Navbar
            const navbarWrapper = document.createElement("div");
            navbarWrapper.style.cssText = "position: relative;";
            
            const navbarLabel = document.createElement("div");
            navbarLabel.style.cssText = "position: absolute; top: -30px; left: 0; background-color: var(--success-color); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; z-index: 10;";
            navbarLabel.textContent = "🔒 FIXED with onLayOut()";
            
            const navbar = await slice.build("Navbar", {
               items: [
                  { text: "Home", path: "/" },
                  { text: "About", path: "/about" }
               ]
            });
            
            navbarWrapper.appendChild(navbarLabel);
            navbarWrapper.appendChild(navbar);

            // Home Page
            const homeWrapper = document.createElement("div");
            homeWrapper.style.cssText = "position: relative;";
            
            const homeLabel = document.createElement("div");
            homeLabel.style.cssText = "position: absolute; top: -30px; left: 0; background-color: var(--primary-color); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; z-index: 10;";
            homeLabel.textContent = "📄 VIEW - Home Page";
            
            const homePage = document.createElement("div");
            homePage.style.cssText = "padding: 40px; background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); border-radius: 8px; color: white;";
            homePage.innerHTML = "<h2 style='margin-top: 0; color: white;'>🏠 Home Page</h2><p style='color: rgba(255,255,255,0.9);'>This is the <strong>Home Page</strong> content in the view area.</p><p style='color: rgba(255,255,255,0.8); font-size: 0.9em;'>Click the buttons below to switch views!</p>";
            
            homeWrapper.appendChild(homeLabel);
            homeWrapper.appendChild(homePage);

            // About Page
            const aboutWrapper = document.createElement("div");
            aboutWrapper.style.cssText = "position: relative;";
            
            const aboutLabel = document.createElement("div");
            aboutLabel.style.cssText = "position: absolute; top: -30px; left: 0; background-color: var(--secondary-color); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; z-index: 10;";
            aboutLabel.textContent = "📄 VIEW - About Page";
            
            const aboutPage = document.createElement("div");
            aboutPage.style.cssText = "padding: 40px; background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%); border-radius: 8px; color: white;";
            aboutPage.innerHTML = "<h2 style='margin-top: 0; color: white;'>ℹ️ About Page</h2><p style='color: rgba(255,255,255,0.9);'>This is the <strong>About Page</strong> content in the view area.</p><p style='color: rgba(255,255,255,0.8); font-size: 0.9em;'>Notice the navbar stayed fixed! 🎯</p>";
            
            aboutWrapper.appendChild(aboutLabel);
            aboutWrapper.appendChild(aboutPage);

            const layout = await slice.build("Layout", {
               view: homeWrapper
            });
            layout.onLayOut(navbarWrapper);

            // Crear botones de control con etiqueta
            const controlWrapper = document.createElement("div");
            controlWrapper.style.cssText = "position: relative; margin-top: 40px;";
            
            const controlLabel = document.createElement("div");
            controlLabel.style.cssText = "position: absolute; top: -30px; left: 0; background-color: var(--success-color); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75em; font-weight: bold; z-index: 10;";
            controlLabel.textContent = "🔒 FIXED with onLayOut()";
            
            const buttonContainer = document.createElement("div");
            buttonContainer.style.cssText = "display: flex; gap: 10px; padding: 20px; background-color: var(--tertiary-background-color); border-radius: 8px; border: 2px solid var(--success-color);";

            const homeBtn = await slice.build("Button", {
               value: "🏠 Show Home",
               onClickCallback: async () => {
                  await layout.showing(homeWrapper);
               }
            });

            const aboutBtn = await slice.build("Button", {
               value: "ℹ️ Show About",
               onClickCallback: async () => {
                  await layout.showing(aboutWrapper);
               }
            });

            const info = document.createElement("p");
            info.style.cssText = "margin: 0 0 0 20px; color: var(--font-secondary-color); font-size: 0.9em; display: flex; align-items: center;";
            info.innerHTML = "👈 Click to switch views with <code>showing()</code>";

            buttonContainer.appendChild(homeBtn);
            buttonContainer.appendChild(aboutBtn);
            buttonContainer.appendChild(info);
            
            controlWrapper.appendChild(controlLabel);
            controlWrapper.appendChild(buttonContainer);
            
            layout.onLayOut(controlWrapper);
            
            return layout;
         },
         `// Create pages
const homePage = document.createElement("div");
homePage.innerHTML = "<h2>Home</h2>";

const aboutPage = document.createElement("div");
aboutPage.innerHTML = "<h2>About</h2>";

// Create navbar
const navbar = await slice.build("Navbar", { ... });

// Build Layout
const layout = await slice.build("Layout", {
   view: homePage  // ← Initial view
});

// Add fixed navbar
layout.onLayOut(navbar);

// Switch views dynamically
await layout.showing(homePage);   // ← Show home
await layout.showing(aboutPage);  // ← Show about

// The navbar stays fixed!
// Only the view changes!`
      );

      // Añadir ejemplo de static props
      await this.createStaticPropsExample();
   }

   async createLayoutExample(container, buildFunction, codeString) {
      if (!container) {
         console.error("Container not found for Layout example");
         return;
      }

      // Crear el layout funcional
      const layout = await buildFunction();

      // Crear el CodeVisualizer
      const codeVisualizer = await slice.build("CodeVisualizer", {
         value: `const layout = await slice.build("Layout", ${codeString});`,
         language: "javascript"
      });

      // Crear contenedor del ejemplo
      const exampleDiv = document.createElement("div");
      exampleDiv.className = "layoutExample";
      
      const layoutContainer = document.createElement("div");
      layoutContainer.className = "layoutPreview";
      layoutContainer.appendChild(layout);
      
      exampleDiv.appendChild(layoutContainer);
      exampleDiv.appendChild(codeVisualizer);

      container.appendChild(exampleDiv);
   }

   async createStaticPropsExample() {
      const staticPropsContainer = this.querySelector(".static-props-example");
      if (!staticPropsContainer) {
         console.error("Static props container not found");
         return;
      }

      const defaultsExample = await slice.build("CodeVisualizer", {
         value: `// Layout Static Props Configuration:
export default class Layout extends HTMLElement {
   static props = {
      layout: { 
         type: "object", 
         default: null, 
         required: false 
      },
      view: { 
         type: "object", 
         default: null, 
         required: false 
      }
   };
}

// Example with automatic defaults:
const layout1 = await slice.build("Layout", {
   view: myContent
   // layout uses automatic default: null
});

// Example with both props:
const layout2 = await slice.build("Layout", {
   layout: myNavbar,
   view: myContent
});

// Props explained:
// - layout: Initial fixed element (navbar, header)
// - view: Main content area that changes
// Both accept any HTMLElement or component`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(defaultsExample);

      const featuresInfo = document.createElement("div");
      featuresInfo.innerHTML = '<h4>Layout Features</h4>' +
         '<ul>' +
         '<li><strong>Flexible Structure:</strong> Combine fixed and dynamic elements</li>' +
         '<li><strong>View Management:</strong> Easy content switching with showing()</li>' +
         '<li><strong>Multiple Fixed Elements:</strong> Add multiple persistent components with onLayOut()</li>' +
         '<li><strong>Static Props:</strong> Automatic validation and defaults</li>' +
         '</ul>' +
         '<h4>When to Use Layout</h4>' +
         '<ul>' +
         '<li>Building app structures with fixed navigation</li>' +
         '<li>Creating pages with persistent sidebars</li>' +
         '<li>Managing dynamic content areas</li>' +
         '<li>Organizing complex multi-section applications</li>' +
         '</ul>';

      staticPropsContainer.appendChild(featuresInfo);

      const methodsInfo = document.createElement("div");
      methodsInfo.innerHTML = '<h4>Layout Methods</h4>' +
         '<ul>' +
         '<li><strong>onLayOut(element):</strong> Adds a fixed element (accumulative)</li>' +
         '<li><strong>showing(element):</strong> Replaces the current view (only one at a time)</li>' +
         '</ul>' +
         '<h4>Best Practices</h4>' +
         '<ul>' +
         '<li>Use <code>layout</code> prop for single fixed element on init</li>' +
         '<li>Use <code>onLayOut()</code> method for multiple fixed elements</li>' +
         '<li>Use <code>view</code> prop for initial content on init</li>' +
         '<li>Use <code>showing()</code> method to dynamically change content</li>' +
         '<li>Combine Layout with MultiRoute for automatic routing</li>' +
         '</ul>';

      staticPropsContainer.appendChild(methodsInfo);
   }
}

customElements.define("slice-layoutdocumentation", LayoutDocumentation);