export default class LoadingDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Ejemplo básico con start() y stop()
      await this.createLoadingExample(
         this.querySelector(".basicLoading"),
         async () => {
            const demoContainer = document.createElement("div");
            demoContainer.style.cssText = "padding: 40px; background-color: var(--secondary-background-color); border-radius: 8px; text-align: center;";

            const title = document.createElement("h3");
            title.style.cssText = "color: var(--primary-color); margin-top: 0;";
            title.textContent = "Basic Loading Control";

            const description = document.createElement("p");
            description.style.cssText = "color: var(--font-secondary-color); margin-bottom: 20px;";
            description.textContent = "Click the buttons to show/hide the loading spinner";

            const buttonContainer = document.createElement("div");
            buttonContainer.style.cssText = "display: flex; gap: 10px; justify-content: center;";

            const loading = await slice.build("Loading", {
               isActive: false
            });

            const startBtn = await slice.build("Button", {
               value: "▶️ Show Loading",
               onClickCallback: () => {
                  loading.start();
               }
            });

            const stopBtn = await slice.build("Button", {
               value: "⏹️ Hide Loading",
               onClickCallback: () => {
                  loading.stop();
               }
            });

            buttonContainer.appendChild(startBtn);
            buttonContainer.appendChild(stopBtn);

            demoContainer.appendChild(title);
            demoContainer.appendChild(description);
            demoContainer.appendChild(buttonContainer);

            return demoContainer;
         },
         `// Create Loading component
const loading = await slice.build("Loading", {
   isActive: false  // Starts hidden
});

// Show the loading spinner
loading.start();

// Hide the loading spinner
loading.stop();

// Static Props defaults:
// isActive: false`
      );

      // Ejemplo con isActive prop
      await this.createLoadingExample(
         this.querySelector(".isActiveLoading"),
         async () => {
            const demoContainer = document.createElement("div");
            demoContainer.style.cssText = "padding: 40px; background-color: var(--secondary-background-color); border-radius: 8px; text-align: center;";

            const title = document.createElement("h3");
            title.style.cssText = "color: var(--primary-color); margin-top: 0;";
            title.textContent = "Using isActive Property";

            const description = document.createElement("p");
            description.style.cssText = "color: var(--font-secondary-color); margin-bottom: 20px;";
            description.textContent = "Control loading state with the isActive property";

            const buttonContainer = document.createElement("div");
            buttonContainer.style.cssText = "display: flex; gap: 10px; justify-content: center;";

            const loading = await slice.build("Loading", {
               isActive: false
            });

            const toggleBtn = await slice.build("Button", {
               value: "🔄 Toggle Loading",
               onClickCallback: () => {
                  loading.isActive = !loading.isActive;
               }
            });

            buttonContainer.appendChild(toggleBtn);

            demoContainer.appendChild(title);
            demoContainer.appendChild(description);
            demoContainer.appendChild(buttonContainer);

            return demoContainer;
         },
         `// Create Loading component
const loading = await slice.build("Loading", {
   isActive: false
});

// Toggle with property
loading.isActive = true;   // Shows loading
loading.isActive = false;  // Hides loading

// Check current state
if (loading.isActive) {
   console.log("Loading is visible");
}

// Static Props Configuration:
// isActive: { type: "boolean", default: false }`
      );

      // Ejemplo con container localizado
      await this.createLoadingExample(
         this.querySelector(".containerLoading"),
         async () => {
            const demoContainer = document.createElement("div");
            demoContainer.style.cssText = "padding: 40px; background-color: var(--secondary-background-color); border-radius: 8px;";

            const title = document.createElement("h3");
            title.style.cssText = "color: var(--primary-color); margin-top: 0;";
            title.textContent = "Loading in Specific Container";

            const description = document.createElement("p");
            description.style.cssText = "color: var(--font-secondary-color); margin-bottom: 20px;";
            description.textContent = "Loading can be shown inside a specific container instead of fullscreen";

            // Crear containers de ejemplo
            const cardsContainer = document.createElement("div");
            cardsContainer.style.cssText = "display: grid; grid-template-columns: 1fr 1fr; gap: 20px;";

            // Card 1
            const card1 = document.createElement("div");
            card1.style.cssText = "background-color: var(--tertiary-background-color); padding: 20px; border-radius: 8px; min-height: 200px; border: 2px solid var(--primary-color);";
            card1.innerHTML = "<h4 style='color: var(--primary-color); margin: 0 0 10px 0;'>📦 Card 1</h4><p style='color: var(--font-secondary-color); font-size: 0.9em;'>Click button to load data in this card only</p>";

            const loading1 = await slice.build("Loading", {});
            
            const btn1 = await slice.build("Button", {
               value: "Load Card 1",
               onClickCallback: async () => {
                  loading1.start(card1);
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  loading1.stop();
               }
            });
            btn1.style.marginTop = "10px";
            card1.appendChild(btn1);

            // Card 2
            const card2 = document.createElement("div");
            card2.style.cssText = "background-color: var(--tertiary-background-color); padding: 20px; border-radius: 8px; min-height: 200px; border: 2px solid var(--secondary-color);";
            card2.innerHTML = "<h4 style='color: var(--secondary-color); margin: 0 0 10px 0;'>📦 Card 2</h4><p style='color: var(--font-secondary-color); font-size: 0.9em;'>Click button to load data in this card only</p>";

            const loading2 = await slice.build("Loading", {});
            
            const btn2 = await slice.build("Button", {
               value: "Load Card 2",
               onClickCallback: async () => {
                  loading2.start(card2);
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  loading2.stop();
               }
            });
            btn2.style.marginTop = "10px";
            card2.appendChild(btn2);

            cardsContainer.appendChild(card1);
            cardsContainer.appendChild(card2);

            demoContainer.appendChild(title);
            demoContainer.appendChild(description);
            demoContainer.appendChild(cardsContainer);

            return demoContainer;
         },
         `// Create Loading instances
const loading1 = await slice.build("Loading", {});
const loading2 = await slice.build("Loading", {});

// Get container references
const card1 = document.querySelector(".card-1");
const card2 = document.querySelector(".card-2");

// Show loading in specific container
loading1.start(card1);  // ← Only in card1
loading2.start(card2);  // ← Only in card2

// Hide loading
loading1.stop();
loading2.stop();

// The loading appears only inside the container,
// not fullscreen!`
      );

      // Ejemplo con simulación de carga
      await this.createLoadingExample(
         this.querySelector(".asyncLoading"),
         async () => {
            const demoContainer = document.createElement("div");
            demoContainer.style.cssText = "padding: 40px; background-color: var(--secondary-background-color); border-radius: 8px; text-align: center;";

            const title = document.createElement("h3");
            title.style.cssText = "color: var(--primary-color); margin-top: 0;";
            title.textContent = "Simulating Async Operation";

            const description = document.createElement("p");
            description.style.cssText = "color: var(--font-secondary-color); margin-bottom: 20px;";
            description.textContent = "Loading appears during async operations";

            const statusText = document.createElement("p");
            statusText.style.cssText = "color: var(--primary-color); font-weight: bold; margin-bottom: 20px; min-height: 24px;";
            statusText.textContent = "Ready";

            const loading = await slice.build("Loading", {
               isActive: false
            });

            const loadBtn = await slice.build("Button", {
               value: "📡 Simulate API Call",
               onClickCallback: async () => {
                  loading.start();
                  statusText.textContent = "⏳ Loading data...";
                  
                  // Simular carga de 3 segundos
                  await new Promise(resolve => setTimeout(resolve, 3000));
                  
                  loading.stop();
                  statusText.textContent = "✅ Data loaded successfully!";
                  
                  setTimeout(() => {
                     statusText.textContent = "Ready";
                  }, 2000);
               }
            });

            demoContainer.appendChild(title);
            demoContainer.appendChild(description);
            demoContainer.appendChild(statusText);
            demoContainer.appendChild(loadBtn);

            return demoContainer;
         },
         `// Create Loading component
const loading = await slice.build("Loading", {});

async function fetchData() {
   // Show loading
   loading.start();
   
   try {
      // Perform async operation
      const response = await fetch("/api/data");
      const data = await response.json();
      
      // Process data...
      console.log("Data loaded:", data);
   } catch (error) {
      console.error("Error:", error);
   } finally {
      // Always hide loading
      loading.stop();
   }
}

// Call the async function
await fetchData();`
      );

      // Añadir ejemplo de static props
      await this.createStaticPropsExample();
   }

   async createLoadingExample(container, buildFunction, codeString) {
      if (!container) {
         console.error("Container not found for Loading example");
         return;
      }

      // Crear el ejemplo funcional
      const demo = await buildFunction();

      // Crear el CodeVisualizer
      const codeVisualizer = await slice.build("CodeVisualizer", {
         value: codeString,
         language: "javascript"
      });

      // Crear contenedor del ejemplo
      const exampleDiv = document.createElement("div");
      exampleDiv.className = "loadingExample";
      
      const demoContainer = document.createElement("div");
      demoContainer.className = "loadingPreview";
      demoContainer.appendChild(demo);
      
      exampleDiv.appendChild(demoContainer);
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
         value: `// Loading Static Props Configuration:
export default class Loading extends HTMLElement {
   static props = {
      isActive: { 
         type: "boolean", 
         default: false, 
         required: false 
      },
      container: {
         type: "object",
         default: null,
         required: false
      }
   };
}

// Example 1: Fullscreen loading (default)
const loading1 = await slice.build("Loading", {
   // No container = fullscreen (document.body)
});
loading1.start(); // Shows fullscreen

// Example 2: Loading with container prop
const myCard = document.querySelector(".my-card");
const loading2 = await slice.build("Loading", {
   container: myCard  // Set default container
});
loading2.start(); // Shows in myCard

// Example 3: Container as parameter (overrides prop)
const loading3 = await slice.build("Loading", {});
const section = document.querySelector(".my-section");
loading3.start(section); // Shows in section

// Props explained:
// - isActive: Controls visibility (true = visible, false = hidden)
// - container: Default container (null = document.body)`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(defaultsExample);

      const methodsInfo = document.createElement("div");
      methodsInfo.innerHTML = '<h4>Loading Methods</h4>' +
         '<ul>' +
         '<li><strong>start(container):</strong> Shows the loading spinner. If <code>container</code> is provided, shows inside that element. Otherwise uses document.body (fullscreen)</li>' +
         '<li><strong>stop():</strong> Hides the loading spinner and removes it from DOM</li>' +
         '</ul>' +
         '<h4>Loading Properties</h4>' +
         '<ul>' +
         '<li><strong>isActive:</strong> Boolean property to get/set loading state</li>' +
         '<li><strong>container:</strong> Default container element for the loading (null = document.body)</li>' +
         '<li>Setting <code>isActive = true</code> calls <code>start()</code></li>' +
         '<li>Setting <code>isActive = false</code> calls <code>stop()</code></li>' +
         '</ul>';

      staticPropsContainer.appendChild(methodsInfo);

      const useCasesInfo = document.createElement("div");
      useCasesInfo.innerHTML = '<h4>Common Use Cases</h4>' +
         '<ul>' +
         '<li><strong>API Calls:</strong> Show loading while fetching data from server</li>' +
         '<li><strong>Form Submissions:</strong> Display loading during form processing</li>' +
         '<li><strong>Page Transitions:</strong> Show loading between route changes</li>' +
         '<li><strong>File Uploads:</strong> Indicate upload progress</li>' +
         '<li><strong>Heavy Computations:</strong> Show loading during intensive operations</li>' +
         '</ul>' +
         '<h4>Best Practices</h4>' +
         '<ul>' +
         '<li>Always call <code>stop()</code> after operations complete</li>' +
         '<li>Use try/catch/finally to ensure loading stops even on errors</li>' +
         '<li>Create one loading instance and reuse it throughout your app</li>' +
         '<li>Consider using <code>isActive</code> property for cleaner code</li>' +
         '<li>Provide feedback messages alongside loading spinner</li>' +
         '</ul>';

      staticPropsContainer.appendChild(useCasesInfo);
   }
}

customElements.define("slice-loadingdocumentation", LoadingDocumentation);