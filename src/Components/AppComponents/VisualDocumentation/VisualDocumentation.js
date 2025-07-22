export default class VisualDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Create code example for visual component
      const buildExample = await slice.build("CodeVisualizer", {
         value: `// Example: Building a visual component with Static Props
const myButton = await slice.build("Button", {
   value: "Click me!",
   onClickCallback: () => {
      console.log("Button clicked");
   }
   // customColor and icon use their defaults from static props
});

// Add to the DOM
document.getElementById("container").appendChild(myButton);

// Building with minimal props (defaults applied automatically)
const simpleButton = await slice.build("Button", {
   // value defaults to "Button"
   // onClickCallback defaults to null
   // customColor defaults to null
   // icon defaults to null
});

// Static Props provide automatic validation in development
const buttonWithUnknownProp = await slice.build("Button", {
   value: "OK",
   unknownProp: "This shows a warning in development console"
});`,
         language: "javascript"
      });
      
      this.querySelector(".visual-build-example").appendChild(buildExample);

      // Create lifecycle example
      const lifecycleExample = await slice.build("CodeVisualizer", {
         value: `// Modern Visual Component with Static Props
export default class CustomVisualComponent extends HTMLElement {
   // Define Static Props for automatic defaults and validation
   static props = {
      value: { 
         type: "string", 
         default: "Default Text",
         required: false 
      },
      color: { 
         type: "string", 
         default: "#000000" 
      },
      disabled: { 
         type: "boolean", 
         default: false 
      },
      items: { 
         type: "array", 
         default: [] 
      },
      config: { 
         type: "object", 
         default: null 
      },
      onClickCallback: { 
         type: "function", 
         default: null 
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      // Get references to DOM elements
      this.$button = this.querySelector(".my-button");
      this.$text = this.querySelector(".my-text");
      
      // Set up event listeners
      this.$button.addEventListener("click", this.handleClick.bind(this));
      
      // setComponentProps applies defaults automatically from static props
      slice.controller.setComponentProps(this, props);
      
      // debuggerProps no longer needed - debugger detects static props automatically
   }

   // Lifecycle method - runs once after construction
   async init() {
      // No need to check for defaults - they"re already applied by Controller
      // Values are guaranteed to be set based on static props configuration
      
      // Apply initial styling
      this.updateAppearance();
      
      // Additional async initialization logic
      await this.loadExternalData();
   }
   
   // Custom methods and getters/setters...
}
   
   // Lifecycle method - runs every time the component is rendered
   async update() {
      // Update component state based on current data
      this.updateUI();
      
      // Refresh data or perform other operations needed on re-render
      await this.refreshData();
   }
   
   // Custom methods
   handleClick() {
      if (this.onClickCallback) {
         this.onClickCallback();
      }
   }
   
   updateAppearance() {
      this.$text.style.color = this.color;
      this.$button.disabled = this.disabled;
   }
   
   // Getters and setters for properties
   get value() {
      return this._value;
   }
   
   set value(newValue) {
      this._value = newValue;
      if (this.$text) this.$text.textContent = newValue;
   }
   
   get color() {
      return this._color;
   }
   
   set color(newColor) {
      this._color = newColor;
      this.updateAppearance();
   }
   
   get disabled() {
      return this._disabled;
   }
   
   set disabled(value) {
      this._disabled = value;
      this.updateAppearance();
   }
   
   // Array and object props work seamlessly
   get items() {
      return this._items;
   }
   
   set items(newItems) {
      this._items = newItems;
      this.renderItems();
   }
   
   renderItems() {
      // Render logic for items array
      if (this.items && this.items.length > 0) {
         // Implement rendering logic
      }
   }
}

customElements.define("my-visual-component", CustomVisualComponent);

// ✨ Legacy Component (still supported - 100% backward compatible)
export default class LegacyComponent extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      // Manual default handling (old way - still works)
      this.value = props.value || "Default Text";
      this.disabled = props.disabled !== undefined ? props.disabled : false;
      
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = ["value", "disabled"]; // Still needed for legacy components
   }
}`,
         language: "javascript"
      });
      
      this.querySelector(".visual-lifecycle-example").appendChild(lifecycleExample);

      // Create nested components example - ACTUALIZADO
      const nestedComponentsExample = await slice.build("CodeVisualizer", {
         value: `// Parent component: Form.js with Static Props
export default class Form extends HTMLElement {
   static props = {
      title: { 
         type: "string", 
         default: "Form",
         required: false 
      },
      fields: { 
         type: "array", 
         default: [],
         required: true // This will show error if not provided
      },
      submitText: { 
         type: "string", 
         default: "Submit" 
      },
      onSubmitCallback: { 
         type: "function", 
         default: null 
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$formContainer = this.querySelector(".form-container");
      
      // Static props applied automatically
      slice.controller.setComponentProps(this, props);
   }

   async init() {
      // Create form title using automatic default
      const formTitle = document.createElement("h2");
      formTitle.textContent = this.title; // Guaranteed to have value
      this.$formContainer.appendChild(formTitle);
      
      // Create child components for each field
      for (const field of this.fields) {
         // Child components can also use static props
         const input = await slice.build("Input", {
            placeholder: field.label,
            type: field.type || "text", // Input component"s default
            required: field.required || false
         });
         
         // Store reference for form validation
         input.fieldName = field.name;
         this.$formContainer.appendChild(input);
      }
      
      // Create submit button with automatic default
      const submitButton = await slice.build("Button", {
         value: this.submitText, // Uses default if not specified
         onClickCallback: () => this.handleSubmit()
      });
      
      this.$formContainer.appendChild(submitButton);
   }
   
   handleSubmit() {
      // Collect form data
      const formData = this.collectFormData();
      
      if (this.onSubmitCallback) {
         this.onSubmitCallback(formData);
      }
   }
   
   collectFormData() {
      // Implementation for collecting form data
      const inputs = this.$formContainer.querySelectorAll("slice-input");
      const data = {};
      
      inputs.forEach(input => {
         if (input.fieldName) {
            data[input.fieldName] = input.value;
         }
      });
      
      return data;
   }
}

customElements.define("slice-form", Form);`,
         language: "javascript"
      });
      
      this.querySelector(".nested-components-example").appendChild(nestedComponentsExample);

      // Usage example for nested components - ACTUALIZADO
      const nestedComponentsUsageExample = await slice.build("CodeVisualizer", {
         value: `// Using the Form component with Static Props
const contactForm = await slice.build("Form", {
   // title uses default: "Form"
   fields: [
      { name: "name", label: "Your Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "message", label: "Message", type: "text", required: false }
   ],
   // submitText uses default: "Submit"
   onSubmitCallback: (formData) => {
      console.log("Form submitted:", formData);
      // Handle form submission
   }
});

document.getElementById("form-container").appendChild(contactForm);

// ✨ Example with custom values overriding defaults
const registrationForm = await slice.build("Form", {
   title: "User Registration", // Override default
   submitText: "Create Account", // Override default
   fields: [
      { name: "username", label: "Username", required: true },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "confirmPassword", label: "Confirm Password", type: "password", required: true }
   ],
   onSubmitCallback: (formData) => {
      // Registration logic
      registerUser(formData);
   }
});

// ✨ Minimal usage - relies heavily on defaults
const simpleForm = await slice.build("Form", {
   fields: [{ name: "search", label: "Search", type: "text" }]
   // title defaults to "Form"
   // submitText defaults to "Submit"
   // onSubmitCallback defaults to null
});`,
         language: "javascript"
      });
      
      this.querySelector(".nested-components-usage").appendChild(nestedComponentsUsageExample);

      // Create details components for FAQs - ACTUALIZADO
      const questions = [
         {
            title: "How do I pass data between components?",
            text: "You can pass data between components in several ways: 1) Through props when building a component, 2) Using custom events with addEventListener and dispatchEvent, 3) Through a shared service component, or 4) Using the slice.controller to access other components directly via getComponent()."
         },
         {
            title: "What are Static Props and how do I use them?",
            text: "Static Props allow you to define prop configuration directly in your component class. Include type, default values, and required status. The Controller automatically applies defaults and validates props in development mode. This eliminates manual default value handling and provides better debugging information."
         },
         {
            title: "Should I use Static Props in my components?",
            text: "Both Static Props and manual prop handling are supported approaches. Static Props provide cleaner code, automatic defaults, and better debugging. Manual prop handling gives you full control. You can use either approach based on your preferences."
         },
         {
            title: "How does the debugger work with my components?",
            text: "The debugger automatically detects Static Props and shows enhanced information including prop configuration, default values, and prop states (Used/Missing/Optional). For components with Static Props, you dont need to manually specify debuggerProps. Components using manual prop handling still work with manual debuggerProps specification."
         },
         {
            title: "Can I create dynamic components at runtime?",
            text: "Yes, you can dynamically create components at runtime using slice.build() and then append them to the DOM. This is useful for creating components based on user interactions or data received from an API. Static Props make this even more powerful as defaults are applied automatically."
         },
         {
            title: "How do I handle component cleanup?",
            text: "To properly clean up a component, you should remove all event listeners and cancel any pending operations when the component is no longer needed. You can create a custom destroy() method in your component class that handles cleanup tasks."
         },
         {
            title: "Can I extend existing visual components?",
            text: "Yes, you can extend existing components by creating a new class that inherits from the component you want to extend. When extending components with Static Props, you can override or extend the static props configuration in your derived class."
         },
         {
            title: "How do I handle component loading states?",
            text: "For components that need to load data asynchronously, you can use the built-in Loading component in Slice.js. Use slice.loading.start() to show the loading indicator and slice.loading.stop() to hide it when your data is ready."
         },
         {
            title: "What prop types are supported in Static Props?",
            text: "Static Props support the following types: string, number, boolean, array, object, and function. You can specify type, default value, and whether the prop is required. The system provides automatic validation in development mode."
         },
         {
            title: "How do I validate complex prop structures?",
            text: "While Static Props provide basic type validation, for complex validation (like validating object shapes or array contents), you can implement custom validation in your components constructor or init method. The development-time warnings from Static Props help catch common issues early."
         }
      ];

      const faqContainer = this.querySelector(".faq-section");
      
      for (const question of questions) {
         const detailsComponent = await slice.build("Details", {
            title: question.title,
            text: question.text
         });
         
         faqContainer.appendChild(detailsComponent);
      }
   }
}

customElements.define("slice-visualdocumentation", VisualDocumentation);