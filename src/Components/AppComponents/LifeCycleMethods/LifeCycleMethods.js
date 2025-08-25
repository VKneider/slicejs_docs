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
  }

  async createLifecycleFlowExample() {
    const lifecycleFlowExample = await slice.build('CodeVisualizer', {
      value: "// LifeCycle Flow in Slice.js Components\n\n// 1. Component Creation\nconst myComponent = await slice.build(\"MyComponent\", { name: \"example\" });\n\n// 2. Constructor execution\nconstructor(props) {\n  super();\n  slice.attachTemplate(this);           // Attach HTML template\n  slice.controller.setComponentProps(this, props); // Set props\n}\n\n// 3. init() method execution (ONCE)\nasync init() {\n  // This runs only ONCE when component is first created\n  console.log(\"Component initialized\");\n}\n\n// 4. update() method execution (ON RE-RENDERS)\nasync update() {\n  // This runs EVERY TIME the component needs to refresh\n  console.log(\"Component updated\");\n}\n\n// Router behavior:\n// First navigation to route: constructor → init()\n// Return to cached route: update()",
      language: 'javascript'
    });
    this.querySelector('.lifecycle-flow-visualization').appendChild(lifecycleFlowExample);
  }

  async createInitExample() {
    const initExample = await slice.build('CodeVisualizer', {
      value: "export default class UserProfile extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    // ✅ Perfect for init(): One-time setup tasks\n    \n    // 1. Get DOM references\n    this.$userInfo = this.querySelector(\".user-info\");\n    this.$avatar = this.querySelector(\".avatar\");\n    \n    // 2. Fetch initial data\n    this.userData = await this.fetchUserData(this.userId);\n    \n    // 3. Create child components\n    this.editButton = await slice.build(\"Button\", {\n      text: \"Edit Profile\",\n      onClick: () => this.editProfile()\n    });\n    \n    // 4. Set up event listeners\n    this.addEventListener(\"click\", this.handleClick.bind(this));\n    \n    // 5. Initial render\n    this.renderUserData();\n    \n    // 6. Append child components\n    this.appendChild(this.editButton);\n  }\n  \n  async fetchUserData(userId) {\n    // This will only run once when component is created\n    const response = await fetch(\"/api/users/\" + userId);\n    return response.json();\n  }\n  \n  renderUserData() {\n    this.$userInfo.textContent = this.userData.name;\n    this.$avatar.src = this.userData.avatar;\n  }\n}",
      language: 'javascript'
    });
    this.querySelector('.init-example').appendChild(initExample);
  }

  async createUpdateExample() {
    const updateExample = await slice.build('CodeVisualizer', {
      value: "export default class ProductList extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    // One-time setup\n    this.$productContainer = this.querySelector(\".products\");\n    this.dataService = slice.controller.getComponent(\"data-service\");\n    \n    // Initial load\n    await this.loadProducts();\n  }\n\n  async update() {\n    // ✅ Perfect for update(): Refresh tasks that run on re-renders\n    \n    // 1. Re-fetch data that might have changed\n    await this.loadProducts();\n    \n    // 2. Re-apply any dynamic styles or DOM changes\n    this.applyCurrentTheme();\n    \n    // 3. Update child components if needed\n    this.updateChildComponents();\n    \n    // 4. Sync with any external state changes\n    this.syncWithGlobalState();\n    \n    console.log(\"ProductList updated - data refreshed\");\n  }\n  \n  async loadProducts() {\n    // This method is called both in init() and update()\n    try {\n      this.products = await this.dataService.fetchProducts();\n      this.renderProducts();\n    } catch (error) {\n      console.error(\"Failed to load products:\", error);\n    }\n  }\n}",
      language: 'javascript'
    });
    this.querySelector('.update-example').appendChild(updateExample);
  }

  async createRouterExample() {
    const routerExample = await slice.build('CodeVisualizer', {
      value: "// How Router Manages Component LifeCycle\n\n// MultiRoute component behavior:\nexport default class MultiRoute extends HTMLElement {\n  async render() {\n    const currentPath = window.location.pathname;\n    const routeMatch = this.props.routes.find(route => route.path === currentPath);\n\n    if (routeMatch) {\n      const { component } = routeMatch;\n\n      if (this.renderedComponents.has(component)) {\n        // 🔄 Component exists in cache - call update()\n        const cachedComponent = this.renderedComponents.get(component);\n        \n        this.innerHTML = \"\";\n        \n        // This triggers the update() method\n        if (cachedComponent.update) {\n          await cachedComponent.update();\n        }\n        \n        this.appendChild(cachedComponent);\n      } else {\n        // 🆕 New component - full creation cycle\n        const newComponent = await slice.build(component, { sliceId: component });\n        \n        // This triggers: constructor → init()\n        this.innerHTML = \"\";\n        this.appendChild(newComponent);\n        \n        // Cache for future use\n        this.renderedComponents.set(component, newComponent);\n      }\n    }\n  }\n}\n\n// Navigation flow:\n// /dashboard (first time)    → constructor → init()\n// /profile                   → (Dashboard cached)\n// /dashboard (return)        → update()",
      language: 'javascript'
    });
    this.querySelector('.router-integration-example').appendChild(routerExample);
  }

  async createBestPracticesExamples() {
    // init() best practices
    const initBestPractices = await slice.build('CodeVisualizer', {
      value: "// ✅ GOOD - init() Best Practices\n\nasync init() {\n  // 1. Get DOM references first\n  this.$container = this.querySelector(\".container\");\n  this.$button = this.querySelector(\".submit-btn\");\n  \n  // 2. Set up services and dependencies\n  this.apiService = slice.controller.getComponent(\"api-service\");\n  \n  // 3. Fetch initial data\n  this.initialData = await this.apiService.fetchInitialData();\n  \n  // 4. Create child components\n  this.modal = await slice.build(\"Modal\", { title: \"Confirmation\" });\n  \n  // 5. Set up event listeners\n  this.$button.addEventListener(\"click\", this.handleSubmit.bind(this));\n  \n  // 6. Initial render\n  this.render();\n}\n\n// ❌ AVOID - Don't do these in init()\nasync init() {\n  // ❌ Don't put data that changes frequently\n  this.livePrice = await this.fetchCurrentPrice(); // Better in update()\n}",
      language: 'javascript'
    });
    this.querySelector('.init-best-practices').appendChild(initBestPractices);

    // update() best practices
    const updateBestPractices = await slice.build('CodeVisualizer', {
      value: "// ✅ GOOD - update() Best Practices\n\nasync update() {\n  // 1. Check if DOM references still exist (safety)\n  if (!this.$container) {\n    this.$container = this.querySelector(\".container\");\n  }\n  \n  // 2. Refresh data that might have changed\n  const latestData = await this.apiService.fetchLatestData();\n  \n  // 3. Update only what's necessary\n  if (this.hasDataChanged(latestData)) {\n    this.data = latestData;\n    this.render();\n  }\n  \n  // 4. Re-apply dynamic styles\n  this.applyThemeStyles();\n}\n\n// ❌ AVOID - Don't do these in update()\nasync update() {\n  // ❌ Don't recreate event listeners\n  this.$button.addEventListener(\"click\", this.handleClick); // Memory leak!\n  \n  // ❌ Don't recreate child components unnecessarily\n  this.modal = await slice.build(\"Modal\", {}); // Expensive!\n}",
      language: 'javascript'
    });
    this.querySelector('.update-best-practices').appendChild(updateBestPractices);

    // Common pitfalls
    const commonPitfalls = await slice.build('CodeVisualizer', {
      value: "// ⚠️ Common LifeCycle Pitfalls and Solutions\n\n// ❌ PITFALL 1: Assuming DOM is ready in constructor\nexport default class BadComponent extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    \n    // ❌ WRONG: DOM not ready yet!\n    this.$button = this.querySelector(\".btn\"); // Returns null!\n  }\n}\n\n// ✅ SOLUTION: Access DOM in init()\nexport default class GoodComponent extends HTMLElement {\n  async init() {\n    // ✅ CORRECT: DOM is ready now\n    this.$button = this.querySelector(\".btn\");\n    this.$button.addEventListener(\"click\", this.onClick.bind(this));\n  }\n}\n\n// ❌ PITFALL 2: Not handling missing DOM in update()\nasync update() {\n  // ❌ WRONG: Assumes DOM element exists\n  this.$icon.style.color = \"red\"; // Might be null!\n}\n\n// ✅ SOLUTION: Always check DOM elements  \nasync update() {\n  // ✅ CORRECT: Safe DOM access\n  if (this.$icon) {\n    this.$icon.style.color = \"red\";\n  }\n}",
      language: 'javascript'
    });
    this.querySelector('.common-pitfalls').appendChild(commonPitfalls);
  }


  
}

customElements.define("slice-lifecyclemethods", LifeCycleMethods);
