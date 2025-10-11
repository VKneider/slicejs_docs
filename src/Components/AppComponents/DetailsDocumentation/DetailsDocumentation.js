export default class DetailsDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Ejemplo básico
      await this.createDetailsExample(
         this.querySelector(".myDetails"),
         {
            title: "What is Slice.js?",
            text: "Click to expand and see more information"
         },
         `{
   title: "What is Slice.js?",
   text: "Click to expand and see more information"
   // Static Props defaults:
   // title: "" (default string)
   // text: "" (default string)
}`,
         null,
         "Basic expandable section - Click to toggle"
      );

      // Ejemplo con contenido básico
      await this.createDetailsExample(
         this.querySelector(".basicDetails"),
         {
            title: "Framework Features",
            text: "Explore the key features of Slice.js"
         },
         `{
   title: "Framework Features",
   text: "Explore the key features of Slice.js"
}

// Add content using addDetail() method
const features = document.createElement("p");
features.textContent = "Component-based architecture...";
myDetails.addDetail(features);`,
         async (details) => {
            const content = document.createElement("div");
            content.style.padding = "15px";
            content.innerHTML = `
               <p style="color: var(--font-secondary-color); margin: 0;">
                  <strong>Slice.js</strong> is a modern JavaScript framework featuring:
                  component-based architecture, reactive data binding, built-in routing,
                  and a comprehensive set of visual components.
               </p>
            `;
            details.addDetail(content);
         },
         "Details with simple text content"
      );

      // Ejemplo con componente CodeVisualizer
      await this.createDetailsExample(
         this.querySelector(".withContentDetails"),
         {
            title: "How to Build a Component",
            text: "Step-by-step guide with code example"
         },
         `{
   title: "How to Build a Component",
   text: "Step-by-step guide with code example"
}

// Add a CodeVisualizer component
const codeExample = await slice.build("CodeVisualizer", {
   value: "const button = await slice.build("Button", { value: "Click" });",
   language: "javascript"
});

myDetails.addDetail(codeExample);`,
         async (details) => {
            const codeExample = await slice.build("CodeVisualizer", {
               value: `// Building a component is simple
const button = await slice.build("Button", {
   value: "Click Me",
   onClickCallback: () => {
      console.log("Button clicked!");
   }
});

// Append to DOM
document.body.appendChild(button);`,
               language: "javascript"
            });
            details.addDetail(codeExample);
         },
         "Details with CodeVisualizer component"
      );

      // Ejemplo con múltiple contenido
      await this.createDetailsExample(
         this.querySelector(".multipleContentDetails"),
         {
            title: "Component Props",
            text: "Learn about different prop types"
         },
         `{
   title: "Component Props",
   text: "Learn about different prop types"
}

// Add multiple content items
myDetails.addDetail(titleElement);
myDetails.addDetail(codeExample1);
myDetails.addDetail(description);
myDetails.addDetail(codeExample2);`,
         async (details) => {
            // Título
            const title1 = document.createElement("h4");
            title1.textContent = "1. String Props";
            title1.style.color = "var(--primary-color)";
            title1.style.marginTop = "10px";
            details.addDetail(title1);

            const code1 = await slice.build("CodeVisualizer", {
               value: `const input = await slice.build("Input", {
   placeholder: "Enter your name"
});`,
               language: "javascript"
            });
            details.addDetail(code1);

            // Segundo ejemplo
            const title2 = document.createElement("h4");
            title2.textContent = "2. Function Props";
            title2.style.color = "var(--primary-color)";
            title2.style.marginTop = "20px";
            details.addDetail(title2);

            const code2 = await slice.build("CodeVisualizer", {
               value: `const button = await slice.build("Button", {
   value: "Submit",
   onClickCallback: () => alert("Submitted!")
});`,
               language: "javascript"
            });
            details.addDetail(code2);
         },
         "Details with multiple content sections"
      );

      // Ejemplo anidado
      await this.createDetailsExample(
         this.querySelector(".nestedDetails"),
         {
            title: "Framework Architecture",
            text: "Explore the different layers"
         },
         `{
   title: "Framework Architecture",
   text: "Explore the different layers"
}

// Nest Details inside Details
const childDetails = await slice.build("Details", {
   title: "Core Components",
   text: "Learn about core components"
});

parentDetails.addDetail(childDetails);`,
         async (details) => {
            // Crear Details anidado
            const nestedDetails1 = await slice.build("Details", {
               title: "🔧 Core Layer",
               text: "Router, Controller, and State Management"
            });

            const nestedContent1 = document.createElement("p");
            nestedContent1.style.cssText = "padding: 10px; color: var(--font-secondary-color);";
            nestedContent1.textContent = "The core layer handles routing, component lifecycle, and state management.";
            nestedDetails1.addDetail(nestedContent1);

            details.addDetail(nestedDetails1);

            // Segundo Details anidado
            const nestedDetails2 = await slice.build("Details", {
               title: "🎨 Visual Layer",
               text: "UI Components and Styling"
            });

            const nestedContent2 = document.createElement("p");
            nestedContent2.style.cssText = "padding: 10px; color: var(--font-secondary-color);";
            nestedContent2.textContent = "The visual layer provides ready-to-use UI components like Button, Input, Select, etc.";
            nestedDetails2.addDetail(nestedContent2);

            details.addDetail(nestedDetails2);
         },
         "Nested Details components for hierarchical content"
      );

      // Ejemplo con código complejo
      await this.createDetailsExample(
         this.querySelector(".codeExampleDetails"),
         {
            title: "Complete Component Example",
            text: "Full implementation with all features"
         },
         `{
   title: "Complete Component Example",
   text: "Full implementation with all features"
}

// Add comprehensive code example
const fullExample = await slice.build("CodeVisualizer", {
   value: "...",
   language: "javascript"
});

myDetails.addDetail(fullExample);`,
         async (details) => {
            const fullCode = await slice.build("CodeVisualizer", {
               value: `// Complete Button component example
export default class Button extends HTMLElement {
   static props = {
      value: { type: "string", default: "Button" },
      onClickCallback: { type: "function", default: null },
      customColor: { type: "object", default: null }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      this.$button = this.querySelector(".slice_button");
      this.$value = this.querySelector(".slice_button_value");
      
      if (props.onClickCallback) {
         this.$button.addEventListener("click", 
            () => props.onClickCallback()
         );
      }
      
      slice.controller.setComponentProps(this, props);
   }

   init() {
      // Component initialization
      if (this.customColor) {
         this.applyCustomColors();
      }
   }

   get value() {
      return this._value;
   }

   set value(val) {
      this._value = val;
      this.$value.textContent = val;
   }
}

customElements.define("slice-button", Button);`,
               language: "javascript"
            });
            details.addDetail(fullCode);

            const note = document.createElement("div");
            note.className = "example-note";
            note.innerHTML = `
               <strong>💡 Best Practice:</strong> Use Static Props to define your component"s 
               API clearly. This provides automatic defaults, type validation, and better 
               debugging experience.
            `;
            details.addDetail(note);
         },
         "Details with comprehensive code documentation"
      );

      // Añadir ejemplo de static props avanzado
      await this.createStaticPropsExample();
   }

   async createStaticPropsExample() {
      const staticPropsContainer = this.querySelector(".static-props-example");
      if (!staticPropsContainer) return;

      // Ejemplo mostrando toda la configuración
      const configExample = await slice.build("CodeVisualizer", {
         value: `// Details Static Props Configuration:
export default class Details extends HTMLElement {
   static props = {
      title: { 
         type: "string", 
         default: "", 
         required: false 
      },
      text: { 
         type: "string", 
         default: "", 
         required: false 
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      // DOM references
      this.$detailsTitle = this.querySelector(".details_title");
      this.$detailsText = this.querySelector(".details_text");
      this.$details = this.querySelector(".full_details");
      this.$summary = this.querySelector(".details_summary");
      this.$container = this.querySelector(".details_container");
      
      // Event listeners
      this.$summary.addEventListener("click", () => {
         this.toggleDetails();
      });
      
      slice.controller.setComponentProps(this, props);
   }

   // Toggle expand/collapse with smooth animation
   toggleDetails() {
      const isOpen = this.$container.classList.toggle("details_open");
      // ... animation logic
   }

   // Add content dynamically
   addDetail(element) {
      this.$details.appendChild(element);
   }
}

// Example usage with automatic defaults:
const details = await slice.build("Details", {
   title: "Expandable Section",
   text: "Click to see more"
   // All props use automatic defaults if not specified
});

// Add content dynamically
const content = document.createElement("p");
content.textContent = "Additional information here";
details.addDetail(content);

// Add Slice components
const button = await slice.build("Button", { value: "Action" });
details.addDetail(button);

// Add multiple items
details.addDetail(codeExample);
details.addDetail(description);
details.addDetail(anotherComponent);`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(configExample);

      // Características adicionales
      const additionalInfo = document.createElement("div");
      additionalInfo.innerHTML = `
         <h4>Key Features</h4>
         <ul>
            <li><strong>Smooth animations:</strong> Built-in expand/collapse animations with CSS transitions</li>
            <li><strong>Flexible content:</strong> Add any HTML element or Slice component using addDetail()</li>
            <li><strong>Nested support:</strong> Details can be nested inside each other for hierarchical content</li>
            <li><strong>Automatic state:</strong> Handles open/closed state automatically with visual indicators</li>
            <li><strong>Accessible:</strong> Keyboard navigation and screen reader friendly</li>
         </ul>
         
         <h4>Common Use Cases</h4>
         <ul>
            <li><strong>FAQs:</strong> Create expandable question-answer sections</li>
            <li><strong>Documentation:</strong> Progressive disclosure of complex information</li>
            <li><strong>Code examples:</strong> Combine with CodeVisualizer for interactive tutorials</li>
            <li><strong>Feature lists:</strong> Show detailed information on demand</li>
            <li><strong>Settings panels:</strong> Organize configuration options</li>
         </ul>
         
         <h4>Methods</h4>
         <ul>
            <li><strong>addDetail(element):</strong> Add content inside the expandable section</li>
            <li><strong>toggleDetails():</strong> Programmatically toggle open/closed state</li>
         </ul>
      `;
      staticPropsContainer.appendChild(additionalInfo);
   }

   async createDetailsExample(appendTo, detailsProps, codeProps, contentCallback = null, description = "") {
      const div = document.createElement("div");
      div.classList.add("detailsContainer");
      
      const exampleDiv = document.createElement("div");
      exampleDiv.classList.add("detailsExample");
      
      // Crear el componente Details
      const details = await slice.build("Details", detailsProps);
      
      // Agregar contenido si se proporciona el callback
      if (contentCallback) {
         await contentCallback(details);
      }
      
      exampleDiv.appendChild(details);
      div.appendChild(exampleDiv);

      // Nota descriptiva
      if (description) {
         const note = document.createElement("div");
         note.className = "example-note";
         note.innerHTML = `<strong>💡 Note:</strong> ${description}`;
         div.appendChild(note);
      }

      // Código de ejemplo
      const componentCode = await slice.build("CodeVisualizer", {
         value: `const details = await slice.build("Details", ${codeProps});`,
         language: "javascript",
      });

      div.appendChild(componentCode);

      if (appendTo) {
         appendTo.appendChild(div);
      }
   }
}

customElements.define("slice-detailsdocumentation", DetailsDocumentation);