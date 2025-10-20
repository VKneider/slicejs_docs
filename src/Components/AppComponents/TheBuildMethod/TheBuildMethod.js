
export default class TheBuildMethod extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
   }

   async init() {
      await this.createExamples();
      await this.createFAQ();
   }

   async createExamples() {
      // Syntax example
      const syntaxExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `const component = await slice.build(componentName, props);`
      });
      this.querySelector(".syntax-example").appendChild(syntaxExample);

      // Basic example
      const basicExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Build a simple button
const myButton = await slice.build("Button", {
   value: "Click me!"
});

// Add the component to the DOM
document.querySelector("#container").appendChild(myButton);`
      });
      this.querySelector(".basic-example").appendChild(basicExample);

      // Props example
      const propsExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Build a component with multiple properties
const card = await slice.build("Card", {
   title: "My Card",
   text: "Card content goes here",
   icon: {
      name: "star",
      iconStyle: "filled"
   },
   customColor: {
      card: "#3a0ca3",
      icon: "#f72585"
   }
});

// Properties are available in the component constructor
// and can be accessed directly: this.title, this.text, etc.`
      });
      this.querySelector(".props-example").appendChild(propsExample);

      // Nested example
      const nestedExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Create a grid with child components
const grid = await slice.build("Grid", {
   columns: 3,
   rows: 1
});

// Build the child components
const card1 = await slice.build("Card", { title: "Card 1" });
const card2 = await slice.build("Card", { title: "Card 2" });
const card3 = await slice.build("Card", { title: "Card 3" });

// Add children to the grid
await grid.setItem(card1);
await grid.setItem(card2);
await grid.setItem(card3);

// Add the grid to the DOM
this.appendChild(grid);`
      });
      this.querySelector(".nested-example").appendChild(nestedExample);

      // SliceId example
      const sliceidExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Build a component with sliceId
const navbar = await slice.build("Navbar", {
   sliceId: "main-navbar",
   logo: { src: "/logo.png", path: "/" },
   items: [
      { text: "Home", path: "/" },
      { text: "About", path: "/about" }
   ]
});

// Later, anywhere in your application:
const navbar = slice.controller.getComponent("main-navbar");
if (navbar) {
   // You can access the component and modify it
   navbar.updateItems(newItems);
}

// Without sliceId, the component receives an automatic ID
// like "Button-1", "Card-2", etc.`
      });
      this.querySelector(".sliceid-example").appendChild(sliceidExample);

      // Error handling example
      const errorExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Always handle possible errors
try {
   const component = await slice.build("MyComponent", {
      title: "Test"
   });
   
   if (!component) {
      console.error("Component could not be built");
      return;
   }
   
   // Component was built successfully
   this.appendChild(component);
   
} catch (error) {
   console.error("Error building component:", error);
   // Show error message to user
   this.showErrorMessage("Could not load component");
}`
      });
      this.querySelector(".error-example").appendChild(errorExample);

      // Patterns example
      const patternsExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// PATTERN 1: Build multiple components in parallel
const [header, content, footer] = await Promise.all([
   slice.build("Header", { title: "My App" }),
   slice.build("Content", { data: myData }),
   slice.build("Footer", { year: 2025 })
]);

this.appendChild(header);
this.appendChild(content);
this.appendChild(footer);

// PATTERN 2: Build components dynamically from data
const products = [
   { id: 1, name: "Product A", price: 99 },
   { id: 2, name: "Product B", price: 149 },
   { id: 3, name: "Product C", price: 199 }
];

for (const product of products) {
   const card = await slice.build("ProductCard", {
      sliceId: \`product-\${product.id}\`,
      name: product.name,
      price: product.price
   });
   
   this.querySelector(".products").appendChild(card);
}

// PATTERN 3: Build and save reference
export default class Dashboard extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      // Save references as class properties
      this.statsWidget = null;
      this.chartWidget = null;
   }
   
   async init() {
      // Build and save references
      this.statsWidget = await slice.build("Stats", {
         sliceId: "dashboard-stats"
      });
      
      this.chartWidget = await slice.build("Chart", {
         sliceId: "dashboard-chart"
      });
      
      this.appendChild(this.statsWidget);
      this.appendChild(this.chartWidget);
   }
   
   async updateData(newData) {
      // Use saved references
      this.statsWidget.updateStats(newData.stats);
      this.chartWidget.updateChart(newData.chart);
   }
}

// PATTERN 4: Conditional construction
const user = await getCurrentUser();

if (user.isAdmin) {
   const adminPanel = await slice.build("AdminPanel", {
      userId: user.id
   });
   this.appendChild(adminPanel);
} else {
   const userDashboard = await slice.build("UserDashboard", {
      userId: user.id
   });
   this.appendChild(userDashboard);
}`
      });
      this.querySelector(".patterns-example").appendChild(patternsExample);
   }

   async createFAQ() {
      const faqQuestions = [
         {
            title: "Why does slice.build() return null sometimes?",
            text: "slice.build() returns null when the component doesn't exist in the registry, when resource loading fails (HTML, JS, CSS), or when there's an error in the component's constructor. Always check the return value before using it."
         },
         {
            title: "Can I build the same component multiple times?",
            text: "Yes, you can build the same component as many times as you need. Each call to slice.build() creates a new independent instance of the component. If using sliceId, make sure each instance has a unique ID."
         },
         {
            title: "When does the init() method execute?",
            text: "The init() method runs automatically after the component has been fully built, its properties have been assigned, and the template has been attached. It's the ideal place for initialization logic, building subcomponents, or setting up event listeners."
         },
         {
            title: "What's the difference between props in constructor and Static Props?",
            text: "Props passed to the constructor are dynamic values passed when building the component. Static Props are property definitions (type, default, required) in the component class that the Controller uses for validation and applying default values."
         },
         {
            title: "Can I build components inside the constructor?",
            text: "Not recommended. The constructor should be synchronous and fast. To build subcomponents, use the init() method which is asynchronous and runs after the component is fully initialized."
         },
         {
            title: "What happens if I forget to use await?",
            text: "If you forget await, you'll get a Promise instead of the component. This will cause errors when trying to add the component to the DOM or call its methods. Always use await with slice.build()."
         },
         {
            title: "How do I pass functions as props?",
            text: "You can pass functions directly in the props object: await slice.build('Button', { onClickCallback: () => { console.log('clicked'); } }). The function will be available in the component as this.onClickCallback."
         },
         {
            title: "Can I build a component without adding it to the DOM?",
            text: "Yes, you can build a component and keep it in memory without adding it to the DOM. This is useful for preparing components that will be shown conditionally later. Just remember the component uses memory until destroyed."
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

customElements.define("slice-the-build-method", TheBuildMethod);