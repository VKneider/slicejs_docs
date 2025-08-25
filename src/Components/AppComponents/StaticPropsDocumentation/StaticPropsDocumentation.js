export default class StaticPropsDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Introduction to Static Props
      const introCard = await slice.build('Card', {
         title: 'Static Props System',
         text: 'Slice.js provides a powerful Static Props system that ensures type safety, performance, and consistency across all components. This system allows you to define and validate component properties at build time.',
         icon: {
            name: 'settings',
            iconStyle: 'filled',
         },
         customColor: {
            card: '#9b59b6',
            icon: 'white',
         },
      });

      this.querySelector('.intro-section').appendChild(introCard);

      // How Static Props Work
      const howItWorks = await slice.build('Details', {
         title: 'How Static Props Work',
         text: 'Static Props are processed during the component build phase and provide immediate access to validated properties.',
      });

      const howItWorksCode = await slice.build('CodeVisualizer', {
         value: `// 1. Component receives props during build
const button = await slice.build("Button", {
   text: "Click me",
   variant: "primary",
   onClick: () => console.log("clicked")
});

// 2. Props are set using the controller
constructor(props) {
   super();
   slice.attachTemplate(this);
   
   // This line processes and validates all props
   slice.controller.setComponentProps(this, props);
   
   // 3. Props are now available as instance properties
   console.log(this.text);        // "Click me"
   console.log(this.variant);     // "primary"
   console.log(this.onClick);     // function
}`,
         language: 'javascript',
      });

      howItWorks.addDetail(howItWorksCode);
      this.querySelector('.how-it-works').appendChild(howItWorks);

      // Benefits of Static Props
      const benefits = await slice.build('Details', {
         title: 'Benefits of Static Props',
         text: 'Static Props provide several advantages over traditional dynamic property systems.',
      });

      const benefitsList = await slice.build('CodeVisualizer', {
         value: `✅ Type Safety
- Props are validated at build time
- No runtime property access errors
- Better IDE support and autocomplete

✅ Performance
- Direct property access (no lookups)
- No dynamic property resolution
- Optimized for modern JavaScript engines

✅ Consistency
- Same props always work the same way
- Predictable component behavior
- Easier debugging and testing

✅ Developer Experience
- Clear prop documentation
- Better error messages
- Intuitive component API`,
         language: 'markdown',
      });

      benefits.addDetail(benefitsList);
      this.querySelector('.benefits').appendChild(benefits);

      // Static Props vs Dynamic Props
      const comparison = await slice.build('Details', {
         title: 'Static Props vs Dynamic Props',
         text: 'Understanding the difference between Static and Dynamic props helps you choose the right approach for your components.',
      });

      const comparisonTable = await slice.build('CodeVisualizer', {
         value: `// STATIC PROPS (Recommended)
const component = await slice.build("MyComponent", {
   title: "My Title",
   isEnabled: true
});

// Access directly
console.log(this.title);      // "My Title"
console.log(this.isEnabled);  // true

// DYNAMIC PROPS (Legacy)
const component = await slice.build("MyComponent", {});
component.setAttribute("data-title", "My Title");
component.setAttribute("data-enabled", "true");

// Access via attributes
const title = component.getAttribute("data-title");
const enabled = component.getAttribute("data-enabled") === "true";`,
         language: 'javascript',
      });

      comparison.addDetail(comparisonTable);
      this.querySelector('.comparison').appendChild(comparison);

      // Best Practices
      const bestPractices = await slice.build('Details', {
         title: 'Best Practices for Static Props',
         text: 'Follow these guidelines to create robust and maintainable components with Static Props.',
      });

      const bestPracticesCode = await slice.build('CodeVisualizer', {
         value: `// 1. Always use setComponentProps in constructor
constructor(props) {
   super();
   slice.attachTemplate(this);
   slice.controller.setComponentProps(this, props);
}

// 2. Provide default values for optional props
constructor(props) {
   super();
   slice.attachTemplate(this);
   slice.controller.setComponentProps(this, props);
   
   // Set defaults after props are set
   this.variant = this.variant || "primary";
   this.size = this.size || "medium";
   this.disabled = this.disabled || false;
}

// 3. Validate required props
constructor(props) {
   super();
   slice.attachTemplate(this);
   slice.controller.setComponentProps(this, props);
   
   // Validate required props
   if (!this.text) {
      throw new Error("Button component requires a text prop");
   }
}

// 4. Use descriptive prop names
const button = await slice.build("Button", {
   buttonText: "Click me",           // ✅ Clear and descriptive
   btnText: "Click me",              // ❌ Abbreviated and unclear
   onClickHandler: () => {},         // ✅ Descriptive
   click: () => {}                   // ❌ Too generic
});`,
         language: 'javascript',
      });

      bestPractices.addDetail(bestPracticesCode);
      this.querySelector('.best-practices').appendChild(bestPractices);

      // Real-world Examples
      const examples = await slice.build('Details', {
         title: 'Real-world Examples',
         text: 'See how Static Props are used in actual Slice.js components.',
      });

      const buttonExample = await slice.build('CodeVisualizer', {
         value: `// Button Component with Static Props
export default class Button extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      
      // Access static props
      this.text = this.text || "Button";
      this.variant = this.variant || "primary";
      this.size = this.size || "medium";
      this.disabled = this.disabled || false;
      this.onClick = this.onClick || (() => {});
      
      this.init();
   }
   
   init() {
      this.textContent = this.text;
      this.className = \`btn btn-\${this.variant} btn-\${this.size}\`;
      this.disabled = this.disabled;
      
      if (this.onClick) {
         this.addEventListener("click", this.onClick);
      }
   }
}

// Usage
const button = await slice.build("Button", {
   text: "Save Changes",
   variant: "success",
   size: "large",
   onClick: () => saveData()
});`,
         language: 'javascript',
      });

      const cardExample = await slice.build('CodeVisualizer', {
         value: `// Card Component with Static Props
export default class Card extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      
      // Access static props
      this.title = this.title || "";
      this.content = this.content || "";
      this.image = this.image || null;
      this.actions = this.actions || [];
      
      this.init();
   }
   
   init() {
      if (this.title) {
         const titleEl = this.querySelector(".card-title");
         if (titleEl) titleEl.textContent = this.title;
      }
      
      if (this.content) {
         const contentEl = this.querySelector(".card-content");
         if (contentEl) contentEl.textContent = this.content;
      }
      
      if (this.image) {
         const imgEl = this.querySelector(".card-image");
         if (imgEl) imgEl.src = this.image;
      }
      
      if (this.actions.length > 0) {
         this.renderActions();
      }
   }
}

// Usage
const card = await slice.build("Card", {
   title: "Welcome to Slice.js",
   content: "A powerful component framework for modern web development",
   image: "/images/slice-logo.png",
   actions: [
      { text: "Learn More", onClick: () => navigate("/docs") },
      { text: "Get Started", onClick: () => navigate("/start") }
   ]
});`,
         language: 'javascript',
      });

      examples.addDetail(buttonExample);
      examples.addDetail(cardExample);
      this.querySelector('.examples').appendChild(examples);

      // Migration Guide
      const migration = await slice.build('Details', {
         title: 'Migrating to Static Props',
         text: 'If you have existing components using dynamic props, here\'s how to migrate them to use Static Props.',
      });

      const migrationCode = await slice.build('CodeVisualizer', {
         value: `// BEFORE: Dynamic Props (Legacy)
export default class OldButton extends HTMLElement {
   constructor() {
      super();
      slice.attachTemplate(this);
   }
   
   connectedCallback() {
      // Access props via attributes
      const text = this.getAttribute("data-text") || "Button";
      const variant = this.getAttribute("data-variant") || "primary";
      
      this.textContent = text;
      this.className = \`btn btn-\${variant}\`;
   }
}

// AFTER: Static Props (Recommended)
export default class NewButton extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      
      // Access props directly
      this.text = this.text || "Button";
      this.variant = this.variant || "primary";
      
      this.init();
   }
   
   init() {
      this.textContent = this.text;
      this.className = \`btn btn-\${this.variant}\`;
   }
}

// Usage changes
// OLD: <button data-text="Click me" data-variant="success"></button>
// NEW: await slice.build("NewButton", { text: "Click me", variant: "success" })`,
         language: 'javascript',
      });

      migration.addDetail(migrationCode);
      this.querySelector('.migration').appendChild(migration);
   }
}

customElements.define('slice-staticpropsdocumentation', StaticPropsDocumentation);
