export default class LifeCycleMethods extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    await this.createLifecycleFlowExample();
    await this.createInitExample();
    await this.createUpdateExample();
    await this.createRouterExample();
    await this.createBestPracticesExamples();
    await this.createComponentDestructionExamples();
    await this.createDestructionBestPractices();
    await this.createDestructionPitfalls();
  }

  async createLifecycleFlowExample() {
    const lifecycleFlowExample = await slice.build('CodeVisualizer', {
      value: `// LifeCycle Flow in Slice.js Components

// 1. Component Creation
const myComponent = await slice.build("MyComponent", { name: "example" });

// 2. Constructor execution
constructor(props) {
  super();
  slice.attachTemplate(this);           // Attach HTML template
  slice.controller.setComponentProps(this, props); // Set props
  this.debuggerProps = ['name'];        // Optional: props for debugger
}

// 3. init() method execution (ONCE)
async init() {
  // This runs only ONCE when component is first created
  console.log("Component initialized");
  
  // Perfect for:
  // - Getting DOM references
  // - Setting up event listeners
  // - Fetching initial data
  // - Creating child components
}

// 4. update() method execution (ON RE-RENDERS)
async update() {
  // This runs EVERY TIME the component needs to refresh
  console.log("Component updated");
  
  // Perfect for:
  // - Re-fetching data
  // - Updating child components
  // - Destroying and recreating dynamic components
}

// Router behavior:
// First navigation to route: constructor → init()
// Return to same route: update()`,
      language: 'javascript'
    });
    this.querySelector('.lifecycle-flow-visualization').appendChild(lifecycleFlowExample);
  }

  async createInitExample() {
    const initExample = await slice.build('CodeVisualizer', {
      value: `export default class UserProfile extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = ['userId'];
  }

  async init() {
    // ✅ Perfect for init(): One-time setup tasks
    
    // 1. Get DOM references
    this.$userInfo = this.querySelector(".user-info");
    this.$avatar = this.querySelector(".avatar");
    
    // 2. Fetch initial data
    this.userData = await this.fetchUserData(this.userId);
    
    // 3. Create static child components (ones that won't change)
    this.editButton = await slice.build("Button", {
      sliceId: "edit-profile-btn",
      value: "Edit Profile",
      onClickCallback: () => this.editProfile()
    });
    
    // 4. Set up event listeners
    this.addEventListener("click", this.handleClick.bind(this));
    
    // 5. Initial render
    this.renderUserData();
    
    // 6. Append static child components
    this.appendChild(this.editButton);
  }
  
  async fetchUserData(userId) {
    const response = await fetch("/api/users/" + userId);
    return response.json();
  }
  
  renderUserData() {
    this.$userInfo.textContent = this.userData.name;
    this.$avatar.src = this.userData.avatar;
  }
  
  get userId() {
    return this._userId;
  }
  
  set userId(value) {
    this._userId = value;
  }
}

customElements.define('slice-user-profile', UserProfile);`,
      language: 'javascript'
    });
    this.querySelector('.init-example').appendChild(initExample);
  }

  async createUpdateExample() {
    const updateExample = await slice.build('CodeVisualizer', {
      value: `export default class ProductList extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    // One-time setup
    this.$productContainer = this.querySelector(".products-container");
    
    // Initial load and render
    await this.loadAndRenderProducts();
  }

  async update() {
    // ✅ Perfect for update(): Refresh tasks on re-renders
    
    // STEP 1: Destroy old dynamic child components
    slice.controller.destroyByContainer(this.$productContainer);
    
    // STEP 2: Clear container
    this.$productContainer.innerHTML = '';
    
    // STEP 3: Re-fetch and re-render
    await this.loadAndRenderProducts();
  }
  
  async loadAndRenderProducts() {
    try {
      // Fetch fresh data
      this.products = await this.fetchProducts();
      
      // Create new child components with consistent IDs
      for (const product of this.products) {
        const productCard = await slice.build('ProductCard', {
          sliceId: \`product-\${product.id}\`,
          title: product.title,
          price: product.price,
          image: product.image
        });
        
        this.$productContainer.appendChild(productCard);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      this.$productContainer.innerHTML = '<p>Error loading products</p>';
    }
  }
  
  async fetchProducts() {
    const response = await fetch('/api/products');
    return response.json();
  }
  
  get products() {
    return this._products;
  }
  
  set products(value) {
    this._products = value;
  }
}

customElements.define('slice-product-list', ProductList);`,
      language: 'javascript'
    });
    this.querySelector('.update-example').appendChild(updateExample);
  }

  async createRouterExample() {
    const routerExample = await slice.build('CodeVisualizer', {
      value: `// How Router Manages Component LifeCycle

// MultiRoute component behavior:
 export default class MultiRoute extends HTMLElement {
   async renderRoute() {
    const currentPath = window.location.pathname;
    const routeMatch = this.props.routes.find(route => route.path === currentPath);

    if (routeMatch) {
      const { component } = routeMatch;

      if (this.renderedComponents.has(component)) {
        // 🔄 Component exists in cache - call update()
        const cachedComponent = this.renderedComponents.get(component);
        
         this.innerHTML = "";
        
        // This triggers the update() method
        if (cachedComponent.update) {
          await cachedComponent.update();
        }
        
        this.appendChild(cachedComponent);
      } else {
        // 🆕 New component - full creation cycle
        const newComponent = await slice.build(component, { 
          sliceId: component 
        });
        
        // This triggers: constructor → init()
         this.innerHTML = "";
        this.appendChild(newComponent);
        
        // Cache for future navigations
        this.renderedComponents.set(component, newComponent);
      }
    }
  }
}

 // Navigation flow example:
// User navigates to /dashboard (first time)
//   → constructor → init()
//
// User navigates to /profile
//   → Dashboard component stays cached
//
// User returns to /dashboard
//   → update() is called on cached component`,
      language: 'javascript'
    });
    this.querySelector('.router-integration-example').appendChild(routerExample);
  }

  async createBestPracticesExamples() {
    // init() best practices
    const initBestPractices = await slice.build('CodeVisualizer', {
      value: `// ✅ GOOD - init() Best Practices

async init() {
  // 1. Get DOM references first
  this.$container = this.querySelector(".container");
  this.$submitButton = this.querySelector(".submit-btn");
  
  // 2. Fetch initial data ONCE
  this.initialData = await this.fetchInitialData();
  
  // 3. Create static child components (won't change)
  this.modal = await slice.build("Modal", { 
    sliceId: "confirmation-modal",
    title: "Confirmation" 
  });
  
  // 4. Set up event listeners ONCE
  this.$submitButton.addEventListener("click", this.handleSubmit.bind(this));
  
  // 5. Initial UI update
  this.updateUserUI();
}

// ❌ AVOID - Don't do these in init()

async init() {
  // ❌ Don't create dynamic child components that change
  // (these should be in update() with proper cleanup)
  for (const item of this.items) {
    const card = await slice.build("Card", { data: item });
    this.appendChild(card);
  }
  
  // ❌ Don't fetch frequently-changing data
  this.livePrice = await this.fetchCurrentPrice();
  // ↑ This will be stale on next navigation
  // Better in update() where it re-fetches
}`,
      language: 'javascript'
    });
    this.querySelector('.init-best-practices').appendChild(initBestPractices);

    // update() best practices
    const updateBestPractices = await slice.build('CodeVisualizer', {
      value: `// ✅ GOOD - update() Best Practices

async update() {
  // 1. Destroy old dynamic child components FIRST
  const container = this.querySelector(".dynamic-content");
  slice.controller.destroyByContainer(container);
  
  // 2. Clear the DOM
  container.innerHTML = '';
  
  // 3. Refresh data that might have changed
  const latestData = await this.fetchLatestData();
  
  // 4. Recreate child components with fresh data
  for (const item of latestData) {
    const component = await slice.build("ListItem", {
      sliceId: \`item-\${item.id}\`,
      ...item
    });
    container.appendChild(component);
  }
  
  // 5. Re-apply dynamic styles if needed
  this.applyCurrentTheme();
}

// ❌ AVOID - Don't do these in update()

async update() {
  // ❌ Don't recreate event listeners
  this.$button.addEventListener("click", this.handleClick);
  // ↑ Creates memory leak! Do this ONCE in init()
  
  // ❌ Don't recreate static components
  this.header = await slice.build("Header", {});
  // ↑ Expensive and unnecessary!
  
  // ❌ Don't recreate without destroying first
  for (const item of this.items) {
    const card = await slice.build("Card", { data: item });
    this.appendChild(card);
  }
  // ↑ MEMORY LEAK! Old components still in activeComponents
  // Always destroy before recreating!
}`,
      language: 'javascript'
    });
    this.querySelector('.update-best-practices').appendChild(updateBestPractices);

    // Common pitfalls
    const commonPitfalls = await slice.build('CodeVisualizer', {
      value: `// ⚠️ Common LifeCycle Pitfalls and Solutions

// ❌ PITFALL 1: Accessing DOM in constructor
export default class BadComponent extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    
    // ❌ WRONG: Template not attached yet!
    this.$button = this.querySelector(".btn"); // Returns null!
  }
}

// ✅ SOLUTION: Access DOM in init()
export default class GoodComponent extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }
  
  async init() {
    // ✅ CORRECT: Template is attached now
    this.$button = this.querySelector(".btn");
    this.$button.addEventListener("click", this.onClick.bind(this));
  }
}

// ❌ PITFALL 2: Creating dynamic components without cleanup
async update() {
  // ❌ WRONG: Old components never destroyed
  this.items = await fetchItems();
  for (const item of this.items) {
    const card = await slice.build("Card", { data: item });
    this.appendChild(card);
  }
  // Result: Memory leak grows with each update!
}

// ✅ SOLUTION: Always destroy before recreating
async update() {
  // ✅ CORRECT: Clean up first
  const container = this.querySelector(".items-container");
  slice.controller.destroyByContainer(container);
  container.innerHTML = '';
  
  this.items = await fetchItems();
  for (const item of this.items) {
    const card = await slice.build("Card", { 
      sliceId: \`card-\${item.id}\`,
      data: item 
    });
    container.appendChild(card);
  }
}

// ❌ PITFALL 3: Not using consistent sliceIds
  async update() {
  // ❌ WRONG: Random IDs prevent efficient cleanup
  const component = await slice.build("Item", {
    sliceId: \`item-\${Math.random()}\`,
    data: item
  });
}

// ✅ SOLUTION: Use consistent IDs based on data
  async update() {
  // ✅ CORRECT: Predictable IDs for easy cleanup
  const component = await slice.build("Item", {
    sliceId: \`item-\${item.id}\`,
    data: item
  });
  // Can later destroy with: destroyByPattern(/^item-/)
}`,
      language: 'javascript'
    });
    this.querySelector('.common-pitfalls').appendChild(commonPitfalls);
  }

  async createComponentDestructionExamples() {
    const destructionIntro = await slice.build('CodeVisualizer', {
      value: `// Component Destruction Methods in Controller

// 1️⃣ destroyComponent() - Flexible destruction
// Accepts: component, array of components, sliceId, or array of sliceIds

// Single component
slice.controller.destroyComponent(myComponent);

// Single sliceId
slice.controller.destroyComponent('product-123');

// Multiple components
slice.controller.destroyComponent([comp1, comp2, comp3]);

// Multiple sliceIds
slice.controller.destroyComponent(['user-1', 'user-2', 'user-3']);


// 2️⃣ destroyByContainer() - Destroy all inside container
// Destroys ALL Slice components within a container element

const container = this.querySelector('.products-container');
slice.controller.destroyByContainer(container);
// Returns: number of components destroyed


// 3️⃣ destroyByPattern() - Destroy by ID pattern
// Uses RegExp to match sliceIds

// Destroy all products
slice.controller.destroyByPattern(/^product-/);

// Destroy all temporary components
slice.controller.destroyByPattern('temp');

// Destroy specific range
slice.controller.destroyByPattern(/^user-(1|2|3)$/);`,
      language: 'javascript'
    });
    this.querySelector('.component-destruction-examples').appendChild(destructionIntro);

    // Real-world example
    const realWorldExample = await slice.build('CodeVisualizer', {
      value: `// Real-World Example: Dynamic Product List

export default class ProductList extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    
    this.products = []; // Store data, NOT components
  }

  async init() {
    this.$container = this.querySelector('.products-container');
    await this.loadProducts();
    await this.buildProductCards();
  }

  async update() {
    // Pattern 1: Destroy by container (SIMPLEST)
    slice.controller.destroyByContainer(this.$container);
    this.$container.innerHTML = '';
    
    // Pattern 2: Destroy by pattern (MORE EXPLICIT)
    // slice.controller.destroyByPattern(/^product-/);
    // this.$container.innerHTML = '';
    
    // Pattern 3: Destroy by calculated IDs (MOST CONTROL)
    // const oldIds = this.products.map(p => \`product-\${p.id}\`);
    // slice.controller.destroyComponent(oldIds);
    // this.$container.innerHTML = '';
    
    await this.loadProducts();
    await this.buildProductCards();
  }

  async loadProducts() {
    const response = await fetch('/api/products');
    this.products = await response.json();
  }

  async buildProductCards() {
    for (const product of this.products) {
      const card = await slice.build('ProductCard', {
        sliceId: \`product-\${product.id}\`, // Consistent ID
        title: product.title,
        price: product.price
      });
      this.$container.appendChild(card);
    }
  }
  
  get products() {
    return this._products;
  }
  
  set products(value) {
    this._products = value;
  }
}

customElements.define('slice-product-list', ProductList);`,
      language: 'javascript'
    });
    this.querySelector('.component-destruction-examples').appendChild(realWorldExample);
  }

  async createDestructionBestPractices() {
    const bestPractices = await slice.build('CodeVisualizer', {
      value: `// ✅ Best Practices for Component Destruction

// 1. Use destroyByContainer for simplicity
async update() {
  const container = this.querySelector('.items');
  slice.controller.destroyByContainer(container); // Simple!
  container.innerHTML = '';
  await this.buildItems();
}

// 2. Use consistent sliceIds based on data
async buildProductCards() {
  for (const product of this.products) {
    await slice.build('ProductCard', {
      sliceId: \`product-\${product.id}\`, // ✅ Consistent
      data: product
    });
  }
}

// 3. Store data, not component references
constructor(props) {
  this.items = [];        // ✅ Store data
  // this.components = []; // ❌ Don't do this
}

// 4. Always destroy before recreating
async update() {
  // ✅ ALWAYS: Destroy → Clear → Recreate
  slice.controller.destroyByContainer(this.$container);
  this.$container.innerHTML = '';
  await this.buildItems();
}

// 5. Use beforeDestroy hook for cleanup
export default class MyComponent extends HTMLElement {
  beforeDestroy() {
    // Cleanup timers, subscriptions, or pending work
    clearInterval(this._pollingId);
    this.abortController?.abort();
    window.removeEventListener('resize', this._onResize);
  }
}`,
      language: 'javascript'
    });
    this.querySelector('.destruction-best-practices').appendChild(bestPractices);
  }

  async createDestructionPitfalls() {
    const pitfalls = await slice.build('CodeVisualizer', {
      value: `// ❌ Common Destruction Pitfalls

// PITFALL 1: Recreating without destroying
async update() {
  // ❌ WRONG: Old components stay in memory
  this.$container.innerHTML = ''; // Only removes from DOM!
  
  for (const item of this.items) {
    const comp = await slice.build('Item', { data: item });
    this.$container.appendChild(comp);
  }
  // Result: activeComponents Map grows infinitely!
}

// ✅ CORRECT: Destroy first
async update() {
  slice.controller.destroyByContainer(this.$container);
  this.$container.innerHTML = '';
  // Now safe to recreate
}


// PITFALL 2: Saving component references unnecessarily
constructor(props) {
  // ❌ WRONG: Extra work and state to manage
  this.childComponents = [];
}

async update() {
  // ❌ WRONG: Manual tracking
  for (const comp of this.childComponents) {
    slice.controller.destroyComponent(comp);
  }
  this.childComponents = [];
}

// ✅ CORRECT: Use built-in methods
async update() {
  // ✅ No tracking needed!
  slice.controller.destroyByContainer(this.$container);
}


// PITFALL 3: Using random or inconsistent IDs
async update() {
  // ❌ WRONG: Can't destroy efficiently later
  await slice.build('Card', {
    sliceId: \`card-\${Math.random()}\`
  });
}

// ✅ CORRECT: Predictable IDs
async update() {
  await slice.build('Card', {
    sliceId: \`card-\${item.id}\`
  });
}


// PITFALL 4: Forgetting to clear innerHTML
async update() {
  // ❌ WRONG: DOM elements remain even after destroy
  slice.controller.destroyByContainer(this.$container);
  // Container still has old HTML!
}

// ✅ CORRECT: Always clear
async update() {
  slice.controller.destroyByContainer(this.$container);
  this.$container.innerHTML = ''; // Clean slate
}`,
      language: 'javascript'
    });
    this.querySelector('.destruction-pitfalls').appendChild(pitfalls);
  }
}

customElements.define("slice-lifecyclemethods", LifeCycleMethods);
