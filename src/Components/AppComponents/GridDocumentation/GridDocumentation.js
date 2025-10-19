export default class GridDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Ejemplo básico - 2 columnas
      await this.createGridExample(
         this.querySelector(".basicGrid"),
         async () => {
            const grid = await slice.build("Grid", { 
               columns: 2, 
               rows: 1 
            });

            // Crear cards de ejemplo
            for (let i = 1; i <= 2; i++) {
               const card = document.createElement("div");
               card.style.cssText = "background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); padding: 30px; border-radius: 8px; color: white; text-align: center; min-height: 150px; display: flex; align-items: center; justify-content: center;";
               card.innerHTML = `<h3 style="margin: 0; color: white;">Card ${i}</h3>`;
               await grid.setItem(card);
            }

            return grid;
         },
         `{
   columns: 2,  // 2 columns
   rows: 1      // 1 row
}

// Add items
await grid.setItem(card1);
await grid.setItem(card2);

// Static Props defaults:
// columns: 1
// rows: 1
// items: []`
      );

      // Ejemplo con 3 columnas
      await this.createGridExample(
         this.querySelector(".threeColumnsGrid"),
         async () => {
            const grid = await slice.build("Grid", { 
               columns: 3, 
               rows: 1 
            });

            // Crear cards de ejemplo
            for (let i = 1; i <= 3; i++) {
               const card = document.createElement("div");
               card.style.cssText = `background-color: var(--${i === 1 ? 'primary' : i === 2 ? 'secondary' : 'success'}-color); padding: 20px; border-radius: 8px; color: white; text-align: center; min-height: 120px; display: flex; flex-direction: column; justify-content: center;`;
               card.innerHTML = `<div style="font-size: 2em; margin-bottom: 10px;">${i === 1 ? '📊' : i === 2 ? '📈' : '📉'}</div><p style="margin: 0; color: white; font-weight: bold;">Metric ${i}</p>`;
               await grid.setItem(card);
            }

            return grid;
         },
         `{
   columns: 3,
   rows: 1
}

// Perfect for dashboards with 3 metrics
await grid.setItem(metricCard1);
await grid.setItem(metricCard2);
await grid.setItem(metricCard3);`
      );

      // Ejemplo con items en la inicialización
      await this.createGridExample(
         this.querySelector(".itemsInitGrid"),
         async () => {
            // Crear items primero
            const items = [];
            for (let i = 1; i <= 4; i++) {
               const card = document.createElement("div");
               card.style.cssText = "background-color: var(--tertiary-background-color); border: 2px solid var(--primary-color); padding: 20px; border-radius: 8px; text-align: center; min-height: 100px; display: flex; align-items: center; justify-content: center;";
               card.innerHTML = `<p style="margin: 0; color: var(--primary-color); font-weight: bold;">Item ${i}</p>`;
               items.push(card);
            }

            const grid = await slice.build("Grid", { 
               columns: 2, 
               rows: 2,
               items: items  // Pasar items en la inicialización
            });

            return grid;
         },
         `// Create items first
const card1 = await slice.build("Card", {...});
const card2 = await slice.build("Card", {...});
const card3 = await slice.build("Card", {...});
const card4 = await slice.build("Card", {...});

// Build Grid with items
const grid = await slice.build("Grid", {
   columns: 2,
   rows: 2,
   items: [card1, card2, card3, card4]
});

// Items are automatically added!
// Static Props Configuration:
// items: { type: "array", default: [] }`
      );

      // Ejemplo responsive
      await this.createGridExample(
         this.querySelector(".responsiveGrid"),
         async () => {
            const grid = await slice.build("Grid", { 
               columns: window.innerWidth > 770 ? 4 : 2, 
               rows: 1 
            });

            // Crear cards de ejemplo
            for (let i = 1; i <= 4; i++) {
               const card = document.createElement("div");
               card.style.cssText = "background-color: var(--secondary-background-color); border: 1px solid var(--primary-color-shade); padding: 15px; border-radius: 8px; text-align: center; min-height: 80px; display: flex; align-items: center; justify-content: center;";
               card.innerHTML = `<p style="margin: 0; color: var(--font-primary-color); font-size: 0.9em;">Product ${i}</p>`;
               await grid.setItem(card);
            }

            // Info adicional
            const info = document.createElement("div");
            info.style.cssText = "margin-top: 15px; padding: 10px; background-color: var(--tertiary-background-color); border-radius: 4px; text-align: center;";
            info.innerHTML = `<p style="margin: 0; color: var(--font-secondary-color); font-size: 0.85em;">📱 Current: ${window.innerWidth > 770 ? '4 columns (Desktop)' : '2 columns (Mobile)'}</p>`;
            
            const container = document.createElement("div");
            container.appendChild(grid);
            container.appendChild(info);

            return container;
         },
         `// Responsive Grid
const grid = await slice.build("Grid", {
   columns: window.innerWidth > 770 ? 4 : 2,
   rows: 1
});

// Listen to resize
window.addEventListener('resize', () => {
   grid.columns = window.innerWidth > 770 ? 4 : 2;
});

// Add items dynamically
products.forEach(async (product) => {
   const card = await slice.build("Card", product);
   await grid.setItem(card);
});`
      );

      // Añadir ejemplo de static props
      await this.createStaticPropsExample();
   }

   async createGridExample(container, buildFunction, codeString) {
      if (!container) {
         console.error("Container not found for Grid example");
         return;
      }

      // Crear el grid funcional
      const demo = await buildFunction();

      // Crear el CodeVisualizer
      const codeVisualizer = await slice.build("CodeVisualizer", {
         value: `const grid = await slice.build("Grid", ${codeString});`,
         language: "javascript"
      });

      // Crear contenedor del ejemplo
      const exampleDiv = document.createElement("div");
      exampleDiv.className = "gridExample";
      
      const demoContainer = document.createElement("div");
      demoContainer.className = "gridPreview";
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
         value: `// Grid Static Props Configuration:
export default class Grid extends HTMLElement {
   static props = {
      columns: { 
         type: "number", 
         default: 1, 
         required: false 
      },
      rows: { 
         type: "number", 
         default: 1, 
         required: false 
      },
      items: { 
         type: "array", 
         default: [], 
         required: false 
      },
      gap: {
         type: "string",
         default: "10px",
         required: false
      }
   };
}

// Example with automatic defaults:
const grid1 = await slice.build("Grid", {
   columns: 3
   // rows defaults to 1
   // items defaults to []
   // gap defaults to "10px"
});

// Example with all props:
const grid2 = await slice.build("Grid", {
   columns: 4,
   rows: 2,
   gap: "20px",
   items: [card1, card2, card3, card4]
});

// Dynamic modification:
grid.columns = 2;  // Change columns
grid.rows = 3;     // Change rows
await grid.setItem(newCard);  // Add item
grid.clear();      // Remove all items`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(defaultsExample);

      const methodsInfo = document.createElement("div");
      methodsInfo.innerHTML = '<h4>Grid Methods</h4>' +
         '<ul>' +
         '<li><strong>setItem(item):</strong> Adds a single item to the grid</li>' +
         '<li><strong>setItems(items):</strong> Adds multiple items to the grid</li>' +
         '<li><strong>clear():</strong> Removes all items from the grid</li>' +
         '</ul>' +
         '<h4>Grid Properties</h4>' +
         '<ul>' +
         '<li><strong>columns:</strong> Number of columns in the grid</li>' +
         '<li><strong>rows:</strong> Number of rows in the grid</li>' +
         '<li><strong>items:</strong> Array of items to add on initialization</li>' +
         '<li><strong>gap:</strong> Space between grid items (CSS value)</li>' +
         '</ul>';

      staticPropsContainer.appendChild(methodsInfo);

      const useCasesInfo = document.createElement("div");
      useCasesInfo.innerHTML = '<h4>Common Use Cases</h4>' +
         '<ul>' +
         '<li><strong>Dashboard Layouts:</strong> Display metrics, charts, and data cards</li>' +
         '<li><strong>Product Galleries:</strong> Show products in organized grid</li>' +
         '<li><strong>Card Collections:</strong> Organize cards with equal spacing</li>' +
         '<li><strong>Image Galleries:</strong> Display images in structured layout</li>' +
         '<li><strong>Feature Lists:</strong> Present features in organized sections</li>' +
         '</ul>' +
         '<h4>Best Practices</h4>' +
         '<ul>' +
         '<li>Use <code>columns</code> and <code>rows</code> for fixed layouts</li>' +
         '<li>Pass <code>items</code> array for initialization, or use <code>setItem()</code> for dynamic addition</li>' +
         '<li>Adjust columns based on screen width for responsive designs</li>' +
         '<li>Use consistent gap values across your application</li>' +
         '<li>Each grid item gets <code>grid-item</code> class automatically</li>' +
         '<li>Call <code>clear()</code> before rebuilding grid content</li>' +
         '</ul>';

      staticPropsContainer.appendChild(useCasesInfo);
   }
}

customElements.define("slice-griddocumentation", GridDocumentation);