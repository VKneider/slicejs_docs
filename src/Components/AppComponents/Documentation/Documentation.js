

export default class Documentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
   }

   async init() {
      await this.createIntroSection();
      await this.createFeaturesSection();
      await this.createArchitectureSection();
      await this.createWorkflowSection();
      await this.createExamplesSection();
      await this.createLearningPaths();
   }

   async createIntroSection() {
      // CTA Buttons
      const ctaContainer = this.querySelector(".cta-buttons");
      
      const getStartedBtn = await slice.build("Button", {
         value: "Get Started",
         onClickCallback: async () => {
            await slice.router.navigate("/Documentation/Installation");
         }
      });
      
      const viewDocsBtn = await slice.build("Button", {
         value: "Browse Components",
         onClickCallback: async () => {
            await slice.router.navigate("/Documentation/Visual");
         }
      });
      
      ctaContainer.appendChild(getStartedBtn);
      ctaContainer.appendChild(viewDocsBtn);

      // Code Preview
      const codePreview = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Build a component
const card = await slice.build("Card", {
   title: "Welcome to Slice.js",
   text: "Start building amazing apps"
});

// Add to your page
document.querySelector("#app").appendChild(card);

// That's it! No complex setup needed.`
      });
      
      this.querySelector(".code-preview").appendChild(codePreview);
   }

   async createFeaturesSection() {
      const features = [
         {
            icon: "⚡",
            title: "No Build Step Required",
            description: "Start coding immediately. No webpack, no babel, no complex configuration. Just HTML, CSS, and JavaScript."
         },
         {
            icon: "🎯",
            title: "Component-Based",
            description: "Build reusable components that encapsulate their own logic, styles, and templates. Clean and maintainable code."
         },
         {
            icon: "🚀",
            title: "Built on Web Standards",
            description: "Uses native Web Components API. No proprietary abstractions. Learn once, use everywhere."
         },
         {
            icon: "📦",
            title: "Batteries Included",
            description: "Router, state management, component lifecycle, and a rich library of pre-built components out of the box."
         },
         {
            icon: "🎨",
            title: "Theme System",
            description: "Built-in theming with CSS variables. Switch between light, dark, or custom themes instantly."
         },
         {
            icon: "🔧",
            title: "Developer Friendly",
            description: "Intuitive API, helpful error messages, and comprehensive documentation. Focus on building, not debugging."
         }
      ];

      const grid = this.querySelector(".features-grid");
      
      features.forEach(feature => {
         const card = document.createElement("div");
         card.className = "feature-card";
         card.innerHTML = `
            <span class="feature-icon">${feature.icon}</span>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
         `;
         grid.appendChild(card);
      });
   }

   async createArchitectureSection() {
      const components = [
         {
            type: "visual",
            icon: "🎨",
            title: "Visual Components",
            count: "15+ Components",
            description: "Pre-built UI components like buttons, cards, grids, forms, and more. Customize them or create your own.",
            link: "/Documentation/Visual"
         },
         {
            type: "structural",
            icon: "⚙️",
            title: "Structural Components",
            count: "Core Infrastructure",
            description: "Router, Controller, StylesManager, and Logger. The backbone that powers your application.",
            link: "/Documentation/Structural"
         },
         {
            type: "service",
            icon: "🔧",
            title: "Service Components",
            count: "Business Logic",
            description: "Handle API calls, data storage, authentication, and other application services.",
            link: "/Documentation/Service"
         }
      ];

      const grid = this.querySelector(".architecture-grid");
      
      components.forEach(comp => {
         const card = document.createElement("div");
         card.className = `arch-card ${comp.type}`;
         card.innerHTML = `
            <span class="arch-icon">${comp.icon}</span>
            <h3>${comp.title}</h3>
            <div class="component-count">${comp.count}</div>
            <p>${comp.description}</p>
         `;
         
         card.addEventListener("click", async () => {
            await slice.router.navigate(comp.link);
         });
         
         grid.appendChild(card);
      });
   }

   async createWorkflowSection() {
      const steps = [
         {
            number: "1",
            title: "Install",
            description: "Install Slice.js CLI with npm"
         },
         {
            number: "2",
            title: "Initialize",
            description: "Create a new project structure"
         },
         {
            number: "3",
            title: "Build",
            description: "Create your components"
         },
         {
            number: "4",
            title: "Deploy",
            description: "Build and ship to production"
         }
      ];

      const container = this.querySelector(".workflow-steps");
      
      steps.forEach((step, index) => {
         const stepEl = document.createElement("div");
         stepEl.className = "workflow-step";
         stepEl.innerHTML = `
            <div class="step-number">${step.number}</div>
            <h4>${step.title}</h4>
            <p>${step.description}</p>
         `;
         container.appendChild(stepEl);
         
         if (index < steps.length - 1) {
            const arrow = document.createElement("div");
            arrow.className = "arrow";
            arrow.textContent = "→";
            container.appendChild(arrow);
         }
      });
   }

   async createExamplesSection() {
      const examples = [
         {
            title: "Blog Platform",
            description: "Complete blogging system with routing, posts, comments, and user authentication.",
            code: `const blog = await slice.build("BlogLayout", {
   posts: recentPosts,
   sidebar: true
});`
         },
         {
            title: "Dashboard",
            description: "Admin dashboard with charts, data tables, and real-time updates.",
            code: `const dashboard = await slice.build("Dashboard", {
   widgets: ["stats", "chart", "users"],
   refreshInterval: 30000
});`
         },
         {
            title: "E-commerce",
            description: "Product catalog, shopping cart, and checkout flow with payment integration.",
            code: `const store = await slice.build("ProductGrid", {
   products: inventory,
   filters: ["price", "category"]
});`
         }
      ];

      const grid = this.querySelector(".examples-grid");
      
      for (const example of examples) {
         const card = await slice.build("Card", {
            title: example.title,
            text: example.description
         });
         
         const code = await slice.build("CodeVisualizer", {
            language: "javascript",
            value: example.code
         });
         
         card.appendChild(code);
         grid.appendChild(card);
      }
   }

   async createLearningPaths() {
      const paths = [
         {
            icon: "🎓",
            title: "Complete Beginner",
            description: "New to web development or Slice.js? Start here with the fundamentals and work your way up.",
            link: "/Documentation/Slice"
         },
         {
            icon: "⚡",
            title: "Quick Start",
            description: "Already know web development? Jump right in with installation and build your first component.",
            link: "/Documentation/Installation"
         },
         {
            icon: "🔍",
            title: "Component Explorer",
            description: "Browse the component library to see what's available and how to use each component.",
            link: "/Documentation/Visual"
         },
         {
            icon: "📚",
            title: "Deep Dive",
            description: "Learn about routing, state management, lifecycle methods, and advanced patterns.",
            link: "/Documentation/Routing"
         }
      ];

      const grid = this.querySelector(".paths-grid");
      
      paths.forEach(path => {
         const card = document.createElement("div");
         card.className = "path-card";
         card.innerHTML = `
            <div class="path-header">
               <span class="path-icon">${path.icon}</span>
               <h3>${path.title}</h3>
            </div>
            <p>${path.description}</p>
            <a href="${path.link}" class="path-link">Start Learning →</a>
         `;
         
         card.addEventListener("click", async (e) => {
            if (e.target.tagName !== "A") {
               await slice.router.navigate(path.link);
            }
         });
         
         grid.appendChild(card);
      });
   }
}

customElements.define("slice-documentation", Documentation);