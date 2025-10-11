export default class TreeViewDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Ejemplo básico - lista simple
      await this.createTreeViewExample(
         this.querySelector(".basicTreeView"),
         {
            items: [
               { value: "Item 1", path: "/item1" },
               { value: "Item 2", path: "/item2" },
               { value: "Item 3", path: "/item3" }
            ],
            onClickCallback: (item) => {
               console.log("Clicked:", item.value);
            }
         },
         `{
   items: [
      { value: "Item 1", path: "/item1" },
      { value: "Item 2", path: "/item2" },
      { value: "Item 3", path: "/item3" }
   ],
   onClickCallback: (item) => {
      console.log("Clicked:", item.value);
   }
}`
      );

      // Ejemplo con estructura jerárquica
      await this.createTreeViewExample(
         this.querySelector(".hierarchicalTreeView"),
         {
            items: [
               {
                  value: "Components",
                  items: [
                     { value: "Button", path: "/components/button" },
                     { value: "Input", path: "/components/input" },
                     { value: "Select", path: "/components/select" }
                  ]
               },
               {
                  value: "Documentation",
                  items: [
                     { value: "Getting Started", path: "/docs/getting-started" },
                     { value: "API Reference", path: "/docs/api" }
                  ]
               }
            ],
            onClickCallback: async (item) => {
               if (item.path) {
                  console.log("Navigate to:", item.path);
               }
            }
         },
         `{
   items: [
      {
         value: "Components",
         items: [
            { value: "Button", path: "/components/button" },
            { value: "Input", path: "/components/input" },
            { value: "Select", path: "/components/select" }
         ]
      },
      {
         value: "Documentation",
         items: [
            { value: "Getting Started", path: "/docs/getting-started" },
            { value: "API Reference", path: "/docs/api" }
         ]
      }
   ],
   onClickCallback: async (item) => {
      if (item.path) {
         console.log("Navigate to:", item.path);
      }
   }
}`
      );

      // Ejemplo con navegación compleja
      await this.createTreeViewExample(
         this.querySelector(".navigationTreeView"),
         {
            items: [
               {
                  value: "Visual Components",
                  items: [
                     {
                        value: "Form Elements",
                        items: [
                           { value: "Button", path: "/visual/button" },
                           { value: "Input", path: "/visual/input" },
                           { value: "Checkbox", path: "/visual/checkbox" }
                        ]
                     },
                     {
                        value: "Layout",
                        items: [
                           { value: "Grid", path: "/visual/grid" },
                           { value: "Card", path: "/visual/card" }
                        ]
                     }
                  ]
               },
               {
                  value: "Service Components",
                  items: [
                     { value: "FetchManager", path: "/service/fetch" },
                     { value: "LocalStorage", path: "/service/storage" }
                  ]
               }
            ],
            onClickCallback: async (item) => {
               if (item.path) {
                  console.log("Navigate to:", item.path);
               }
            }
         },
         `{
   items: [
      {
         value: "Visual Components",
         items: [
            {
               value: "Form Elements",
               items: [
                  { value: "Button", path: "/visual/button" },
                  { value: "Input", path: "/visual/input" },
                  { value: "Checkbox", path: "/visual/checkbox" }
               ]
            },
            {
               value: "Layout",
               items: [
                  { value: "Grid", path: "/visual/grid" },
                  { value: "Card", path: "/visual/card" }
               ]
            }
         ]
      },
      {
         value: "Service Components",
         items: [
            { value: "FetchManager", path: "/service/fetch" },
            { value: "LocalStorage", path: "/service/storage" }
         ]
      }
   ],
   onClickCallback: async (item) => {
      if (item.path) {
         console.log("Navigate to:", item.path);
      }
   }
}`
      );

      // Añadir ejemplo de static props
      await this.createStaticPropsExample();

      // Añadir ejemplo de TreeItem props
      await this.createTreeItemPropsExample();
   }

   async createTreeViewExample(container, props, codeString) {
      if (!container) {
         console.error("Container not found for TreeView example");
         return;
      }

      // Crear el treeview
      const treeview = await slice.build("TreeView", props);

      // Crear el CodeVisualizer
      const codeVisualizer = await slice.build("CodeVisualizer", {
         value: `const treeview = await slice.build("TreeView", ${codeString});`,
         language: "javascript"
      });

      // Añadir directamente al contenedor
      container.appendChild(treeview);
      container.appendChild(codeVisualizer);
   }

   async createStaticPropsExample() {
      const staticPropsContainer = this.querySelector(".static-props-example");
      if (!staticPropsContainer) {
         console.error("Static props container not found");
         return;
      }

      // Ejemplo mostrando todas las props con defaults
      const defaultsExample = await slice.build("CodeVisualizer", {
         value: `// TreeView Static Props Configuration:
export default class TreeView extends HTMLElement {
   static props = {
      items: { 
         type: "array", 
         default: [], 
         required: false 
      },
      onClickCallback: { 
         type: "function", 
         default: null 
      }
   };
}

// Example with automatic defaults:
const treeview1 = await slice.build("TreeView", {
   items: [
      { value: "Home", path: "/" }
   ]
   // onClickCallback uses automatic default: null
});

// Example with callback:
const treeview2 = await slice.build("TreeView", {
   items: [
      { value: "Documentation", path: "/docs" },
      { value: "About", path: "/about" }
   ],
   onClickCallback: async (item) => {
      if (item.path) {
         await slice.router.navigate(item.path);
      }
   }
});

// Example with hierarchical structure:
const treeview3 = await slice.build("TreeView", {
   items: [
      {
         value: "Components",
         items: [
            { value: "Button", path: "/button" },
            { value: "Input", path: "/input" }
         ]
      }
   ],
   onClickCallback: (item) => {
      console.log("Clicked:", item.value);
   }
});`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(defaultsExample);

      // Características del TreeView
      const featuresInfo = document.createElement("div");
      featuresInfo.innerHTML = `
         <h4>TreeView Features</h4>
         <ul>
            <li><strong>Hierarchical Structure:</strong> Create nested menus with unlimited depth</li>
            <li><strong>State Persistence:</strong> Automatically saves open/closed state in localStorage</li>
            <li><strong>Expandable Nodes:</strong> Parent items with children are automatically collapsible</li>
            <li><strong>Navigation Support:</strong> Items with path property trigger navigation callbacks</li>
            <li><strong>Smooth Animations:</strong> Built-in transitions for expanding/collapsing nodes</li>
            <li><strong>Click Handling:</strong> Custom callbacks for click events on any item</li>
         </ul>

         <h4>When to Use TreeView</h4>
         <ul>
            <li>Navigation menus with multiple levels</li>
            <li>File/folder structure visualization</li>
            <li>Category and subcategory organization</li>
            <li>Hierarchical data representation</li>
            <li>Documentation navigation (like this documentation!)</li>
         </ul>
      `;

      staticPropsContainer.appendChild(featuresInfo);
   }

   async createTreeItemPropsExample() {
      const treeItemPropsContainer = this.querySelector(".treeitem-props-example");
      if (!treeItemPropsContainer) {
         console.error("TreeItem props container not found");
         return;
      }

      const treeItemExample = await slice.build("CodeVisualizer", {
         value: `// TreeItem Static Props Configuration:
export default class TreeItem extends HTMLElement {
   static props = {
      value: { 
         type: "string", 
         default: "", 
         required: false 
      },
      path: { 
         type: "string", 
         default: "", 
         required: false 
      },
      onClickCallback: { 
         type: "function", 
         default: null 
      },
      items: { 
         type: "array", 
         default: [], 
         required: false 
      }
   };
}

// TreeItem Properties Explained:
// - value: Display text for the item
// - path: Optional URL path for navigation
// - onClickCallback: Function called when item is clicked
// - items: Array of child TreeItems (for nested structure)

// Simple item (leaf node):
const leafItem = {
   value: "Button Documentation",
   path: "/docs/button"
};

// Parent item with children:
const parentItem = {
   value: "Components",  // No path - clicking toggles expand/collapse
   items: [
      { value: "Button", path: "/button" },
      { value: "Input", path: "/input" }
   ]
};

// Deep nesting example:
const deepStructure = {
   value: "Root Level",
   items: [
      {
         value: "Level 1",
         items: [
            {
               value: "Level 2",
               items: [
                  { value: "Level 3", path: "/deep" }
               ]
            }
         ]
      }
   ]
};`,
         language: "javascript"
      });

      treeItemPropsContainer.appendChild(treeItemExample);

      // Comportamiento adicional
      const behaviorInfo = document.createElement("div");
      behaviorInfo.innerHTML = `
         <h4>TreeItem Behavior</h4>
         <ul>
            <li><strong>Items with path:</strong> Clicking triggers the onClickCallback with navigation</li>
            <li><strong>Items without path (parents):</strong> Clicking toggles expand/collapse</li>
            <li><strong>State persistence:</strong> Each item's expanded state is saved to localStorage</li>
            <li><strong>Automatic caret:</strong> Parent items automatically show expand/collapse indicator</li>
            <li><strong>Smooth transitions:</strong> Height animations when expanding/collapsing</li>
         </ul>

         <h4>Working with State Persistence</h4>
         <p>TreeView automatically saves the expanded/collapsed state of each parent item using localStorage. The state is keyed by the item's value, so the tree will remember user preferences across page reloads.</p>

         <h4>Best Practices</h4>
         <ul>
            <li>Use descriptive value properties for better state persistence</li>
            <li>Provide path only for navigable items (leaf nodes)</li>
            <li>Keep onClickCallback consistent across all items</li>
            <li>Organize deep structures logically for better user experience</li>
            <li>Consider item nesting depth - too many levels can be overwhelming</li>
         </ul>
      `;

      treeItemPropsContainer.appendChild(behaviorInfo);
   }
}

customElements.define("slice-treeviewdocumentation", TreeViewDocumentation);