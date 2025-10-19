
export default class RoutingDocumentation extends HTMLElement {
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
      // Basic Route Example
      const basicRouteExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Simple single route example
const route = await slice.build("Route", {
   path: "/home",
   component: "HomePage"
});

document.body.appendChild(route);`
      });
      this.querySelector(".basic-route-example").appendChild(basicRouteExample);

      // Route Configuration Example
      const routeConfigExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// routes.js - Central route configuration
const routes = [
   { 
      path: "/", 
      component: "HomePage",
      metadata: {
         title: "Home - My App"
      }
   },
   { 
      path: "/about", 
      component: "AboutPage",
      metadata: {
         title: "About Us"
      }
   },
   { 
      path: "/contact", 
      component: "ContactPage",
      metadata: {
         title: "Contact Us",
         description: "Get in touch with our team"
      }
   },
   { 
      path: "/user/\${id}", 
      component: "UserProfile",
      metadata: {
         title: "User Profile",
         private: true // Requires authentication
      }
   },
   { 
      path: "/404", 
      component: "NotFound",
      metadata: {
         title: "Page Not Found"
      }
   }
];

export default routes;`
      });
      this.querySelector(".route-config-example").appendChild(routeConfigExample);

      // MultiRoute Example
      const multiRouteExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// MultiRoute for managing multiple related routes
import routes from "./routes.js";

const multiRoute = await slice.build("MultiRoute", {
   routes: routes
});

document.querySelector("#app").appendChild(multiRoute);`
      });
      this.querySelector(".multi-route-example").appendChild(multiRouteExample);

      // Dynamic Routes Example
      const dynamicRoutesExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Define route with dynamic parameter
const routes = [
   {
      path: "/user/\${id}",
      component: "UserProfile"
   },
   {
      path: "/product/\${category}/\${id}",
      component: "ProductDetail"
   }
];

// Component receives params automatically
export default class UserProfile extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      // Access route parameters
      const userId = props.params.id;
      console.log("User ID:", userId);
      
      this.loadUserData(userId);
   }
   
   async loadUserData(userId) {
      const response = await fetch(\`/api/users/\${userId}\`);
      const userData = await response.json();
      this.renderUserData(userData);
   }
}

// Navigate to user profile: /user/123
await slice.router.navigate("/user/123");`
      });
      this.querySelector(".dynamic-routes-example").appendChild(dynamicRoutesExample);

      // Programmatic Navigation Example
      const programmaticNavExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Programmatic navigation methods
// Basic navigation
await slice.router.navigate("/about");

// HTML anchor elements work automatically
// <a href="/contact">Contact</a>
// <a href="/user/123">View User</a>

// Links NOT intercepted by router:
// <a href="https://example.com">External</a>
// <a href="#section">Jump to Section</a>
// <a href="mailto:test@example.com">Email</a>
// <a href="/file.pdf" download>Download</a>
// <a href="/page" target="_blank">New Tab</a>
// <a href="/page" class="external-link">External</a>

// Browser navigation methods
slice.router.back();     // Go back in history
slice.router.forward();  // Go forward in history`
      });
      this.querySelector(".programmatic-nav-example").appendChild(programmaticNavExample);

      // Navigation Guards Example
      const navigationGuardsExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Navigation Guards - Control navigation flow
import Slice from "/Slice/Slice.js";

// beforeEach: Called before every navigation
slice.router.beforeEach(async (to, from, next) => {
   console.log("Navigating from:", from?.path);
   console.log("Navigating to:", to.path);
   
   // Check if route requires authentication
   if (to.metadata?.private) {
      const isAuthenticated = await checkAuthentication();
      
      if (!isAuthenticated) {
         // Redirect to login page - ALWAYS use return
         return next({ path: "/login" });
      }
   }
   
   // Continue navigation - ALWAYS use return
   return next();
});

// afterEach: Called after navigation completes
slice.router.afterEach((to, from) => {
   // Update page title
   document.title = to.metadata?.title || "My App";
   
   // Track page view
   console.log("Page loaded:", to.path);
   
   // Scroll to top
   window.scrollTo(0, 0);
});

// Helper function
async function checkAuthentication() {
   const token = localStorage.getItem("authToken");
   return !!token;
}

// IMPORTANT: Start router AFTER defining guards
await slice.router.start();`
      });
      this.querySelector(".navigation-guards-example").appendChild(navigationGuardsExample);

      // Starting Router Example
      const startingRouterExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Define guards first
slice.router.beforeEach(async (to, from, next) => {
   // Guard logic
   // ALWAYS use return next()
   return next();
});

slice.router.afterEach((to, from) => {
   // Post-navigation logic
});

// Start router AFTER guards are defined
await slice.router.start();`
      });
      this.querySelector(".starting-router-example").appendChild(startingRouterExample);

      // Nested Routes Example
      const nestedRoutesExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Nested routes example - AdminLayout component
export default class AdminLayout extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.contentArea = this.querySelector(".admin-content");
      
      slice.controller.setComponentProps(this, props);
   }
   
   async init() {
      // Create nested MultiRoute for admin section
      const adminRoutes = [
         { path: "/admin/dashboard", component: "AdminDashboard" },
         { path: "/admin/users", component: "UserManagement" },
         { path: "/admin/settings", component: "AdminSettings" }
      ];
      
      const nestedRouter = await slice.build("MultiRoute", {
         routes: adminRoutes
      });
      
      this.contentArea.appendChild(nestedRouter);
   }
}

// Route configuration with nesting
const routes = [
   {
      path: "/admin",
      component: "AdminLayout",
      children: [
         { path: "/admin/dashboard", component: "AdminDashboard" },
         { path: "/admin/users", component: "UserManagement" },
         { path: "/admin/settings", component: "AdminSettings" }
      ],
      metadata: {
         private: true,
         requiredRole: "admin"
      }
   }
];`
      });
      this.querySelector(".nested-routes-example").appendChild(nestedRoutesExample);
   }

   async createFAQ() {
      const faqQuestions = [
         {
            title: "What's the difference between Route and MultiRoute?",
            text: "Route is for a single route configuration, while MultiRoute manages multiple routes in a container. Use Route for simple cases and MultiRoute when you have several related routes in a section of your app."
         },
         {
            title: "How do I handle 404 pages?",
            text: "Add a route with path '/404' and component 'NotFound' to your routes configuration. The router automatically redirects to this route when no other route matches the current path."
         },
         {
            title: "Can I use query parameters in routes?",
            text: "Yes, you can access query parameters using URLSearchParams. For example: const params = new URLSearchParams(window.location.search); const id = params.get('id');"
         },
         {
            title: "How do I protect routes with authentication?",
            text: "Use the beforeEach navigation guard to check if a route requires authentication (via metadata.private) and redirect to login if the user is not authenticated. See the Router Guards documentation for detailed examples."
         },
         {
            title: "Can I pass data between routes?",
            text: "You can use URL parameters for simple data (like IDs), or store data in localStorage/sessionStorage for more complex scenarios. Route metadata can also be used to pass configuration to components."
         },
         {
            title: "How do nested routes work?",
            text: "Nested routes are defined using the children property in a route configuration. The parent component renders a MultiRoute for its children, creating a hierarchical routing structure."
         },
         {
            title: "Can I add routes dynamically?",
            text: "Yes, use slice.router.addRoute() to add routes at runtime, slice.router.removeRoute() to remove them, and slice.router.updateRoutes() to replace the entire route configuration."
         },
         {
            title: "How do I scroll to top on route change?",
            text: "Use the afterEach navigation guard to reset scroll position: slice.router.afterEach(() => { window.scrollTo(0, 0); });"
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

customElements.define("slice-routingdocumentation", RoutingDocumentation);