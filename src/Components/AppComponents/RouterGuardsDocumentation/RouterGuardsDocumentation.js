
export default class RouterGuardsDocumentation extends HTMLElement {
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
      // Basic beforeEach example
      const basicBeforeExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Import Slice and define your routes
import Slice from "/Slice/Slice.js";

// Define beforeEach hook BEFORE starting the router
slice.router.beforeEach(async (to, from, next) => {
   console.log("Navigating to:", to.path);
   console.log("Coming from:", from?.path || "initial load");
   
   // ALWAYS use return next() to prevent code execution after navigation
   return next();
});

// IMPORTANT: Start the router AFTER defining guards
await slice.router.start();`
      });
      this.querySelector(".basic-before-example").appendChild(basicBeforeExample);

      // Authentication guard example
      const authGuardExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Authentication guard with metadata check
slice.router.beforeEach(async (to, from, next) => {
   // Check if route requires authentication
   if (to.metadata?.private) {
      // Perform authentication check (could be async API call)
      const isAuthenticated = await checkUserAuthentication();
      
      if (!isAuthenticated) {
         // Redirect to login page - ALWAYS use return
         return next({ path: "/login" });
      }
   }
   
   // User is authenticated or route is public - ALWAYS use return
   return next();
});

// Helper function to check authentication
async function checkUserAuthentication() {
   try {
      const token = localStorage.getItem("authToken");
      if (!token) return false;
      
      // Validate token with backend
      const response = await fetch("/api/auth/validate", {
         headers: { "Authorization": \`Bearer \${token}\` }
      });
      
      return response.ok;
   } catch (error) {
      console.error("Authentication check failed:", error);
      return false;
   }
}

await slice.router.start();`
      });
      this.querySelector(".auth-guard-example").appendChild(authGuardExample);

      // Role-based authorization example
      const roleGuardExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Role-based authorization guard
slice.router.beforeEach(async (to, from, next) => {
   const requiredRole = to.metadata?.requiredRole;
   
   if (requiredRole) {
      const userRole = await getUserRole();
      
      if (userRole !== requiredRole) {
         // User doesn"t have required role - ALWAYS use return
         return next({ path: "/unauthorized" });
      }
   }
   
   // Role check passed - ALWAYS use return
   return next();
});

// Get user role from storage or API
async function getUserRole() {
   const userData = localStorage.getItem("user");
   if (!userData) return null;
   
   const user = JSON.parse(userData);
   return user.role;
}

await slice.router.start();`
      });
      this.querySelector(".role-guard-example").appendChild(roleGuardExample);

      // afterEach hook example
      const afterEachExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Analytics and logging with afterEach
slice.router.afterEach((to, from) => {
   // Log navigation for analytics
   console.log(\`Navigation completed: \${from?.path || "initial"} -> \${to.path}\`);
   
   // Send analytics event
   if (window.analytics) {
      window.analytics.track("page_view", {
         path: to.path,
         component: to.component,
         timestamp: new Date().toISOString()
      });
   }
   
   // Update page title
   document.title = to.metadata?.title || "My App";
   
   // Scroll to top on route change
   window.scrollTo(0, 0);
});

await slice.router.start();`
      });
      this.querySelector(".after-each-example").appendChild(afterEachExample);

      // Combined guards example
      const combinedExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Complete example with multiple guards
import Slice from "/Slice/Slice.js";

// beforeEach: Multiple checks in sequence
slice.router.beforeEach(async (to, from, next) => {
   // Show loading indicator
   if (slice.loading) {
      slice.loading.start();
   }
   
   // 1. Check authentication
   if (to.metadata?.private) {
      const isAuth = await checkAuth();
      if (!isAuth) {
         // ALWAYS use return when calling next()
         return next({ path: "/login" });
      }
   }
   
   // 2. Check permissions
   if (to.metadata?.permissions) {
      const hasPermission = await checkPermissions(to.metadata.permissions);
      if (!hasPermission) {
         return next({ path: "/forbidden" });
      }
   }
   
   // 3. Validate route params
   if (to.params?.id && !isValidId(to.params.id)) {
      return next({ path: "/404" });
   }
   
   // All checks passed - ALWAYS use return
   return next();
});

// afterEach: Cleanup and tracking
slice.router.afterEach((to, from) => {
   // Hide loading indicator
   if (slice.loading) {
      slice.loading.stop();
   }
   
   // Update meta tags
   updateMetaTags(to.metadata);
   
   // Track navigation
   trackPageView(to, from);
});

await slice.router.start();`
      });
      this.querySelector(".combined-example").appendChild(combinedExample);

      // Navigation cancellation example
      const cancelExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Prevent navigation based on conditions
slice.router.beforeEach(async (to, from, next) => {
   // Check if there"s unsaved data
   if (from && hasUnsavedChanges()) {
      const confirmed = confirm(
         "You have unsaved changes. Do you want to leave this page?"
      );
      
      if (!confirmed) {
         // Cancel navigation - ALWAYS use return
         return next(false);
      }
   }
   
   // Continue navigation - ALWAYS use return
   return next();
});

function hasUnsavedChanges() {
   // Check if form has unsaved data
   const form = document.querySelector("form.dirty");
   return !!form;
}

await slice.router.start();`
      });
      this.querySelector(".cancel-example").appendChild(cancelExample);

      // Data prefetching example
      const prefetchExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Prefetch data before navigation
slice.router.beforeEach(async (to, from, next) => {
   // Prefetch data for specific routes
   if (to.metadata?.prefetch) {
      try {
         const data = await fetchRouteData(to);
         
         // Store data for component to use
         to.state = { ...to.state, prefetchedData: data };
         
         // ALWAYS use return
         return next();
      } catch (error) {
         console.error("Failed to prefetch data:", error);
         // Still navigate even if prefetch fails - ALWAYS use return
         return next();
      }
   } else {
      // ALWAYS use return
      return next();
   }
});

async function fetchRouteData(route) {
   const response = await fetch(\`/api/\${route.metadata.prefetch}\`);
   return await response.json();
}

await slice.router.start();`
      });
      this.querySelector(".prefetch-example").appendChild(prefetchExample);

      // Error handling example
      const errorExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Robust error handling in guards
slice.router.beforeEach(async (to, from, next) => {
   try {
      // Perform async checks
      await validateRoute(to);
      // ALWAYS use return
      return next();
   } catch (error) {
      console.error("Navigation error:", error);
      
      // Redirect to error page - ALWAYS use return
      return next({ 
         path: "/error",
         state: { 
            error: error.message,
            originalPath: to.path 
         }
      });
   }
});

async function validateRoute(route) {
   // Simulate validation that might fail
   if (route.path === "/invalid") {
      throw new Error("Invalid route accessed");
   }
}

await slice.router.start();`
      });
      this.querySelector(".error-example").appendChild(errorExample);

      // Metadata example
      const metadataExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Route configuration with metadata for guards
const routes = [
   {
      path: "/dashboard",
      component: "Dashboard",
      metadata: {
         private: true,              // Requires authentication
         requiredRole: "user",       // Requires specific role
         title: "Dashboard",         // Page title
         breadcrumbs: ["Home", "Dashboard"],
         prefetch: "dashboard-data", // Data to prefetch
         permissions: ["read", "write"]
      }
   },
   {
      path: "/admin",
      component: "AdminPanel",
      metadata: {
         private: true,
         requiredRole: "admin",
         title: "Admin Panel",
         permissions: ["admin"]
      }
   },
   {
      path: "/login",
      component: "Login",
      metadata: {
         title: "Login",
         hideNav: true // Hide navigation bar
      }
   }
];

export default routes;`
      });
      this.querySelector(".metadata-example").appendChild(metadataExample);
   }

   async createFAQ() {
      const faqQuestions = [
         {
            title: "When should I use beforeEach vs afterEach?",
            text: "Use beforeEach when you need to control whether navigation happens (authentication, authorization, validation). Use afterEach for tasks that should happen after navigation completes (analytics, title updates, scroll reset)."
         },
         {
            title: "Can I have multiple beforeEach guards?",
            text: "You can only define one beforeEach hook. However, within that single hook, you can perform multiple checks in sequence. Each check should call next() appropriately based on its validation result."
         },
         {
            title: "What happens if I don't call next()?",
            text: "If you don't call next() in a beforeEach guard, the navigation will be stuck and the route won't change. Always ensure next() is called in all code paths, including error handlers. Remember to always use 'return next()' to prevent code execution after the navigation is resolved."
         },
         {
            title: "Can I access the current user in guards?",
            text: "Yes, you can access any data available in your application, including user data from localStorage, sessionStorage, or global state management. Guards have access to the full application context."
         },
         {
            title: "How do I handle async operations in guards?",
            text: "Make your guard function async and use await for async operations. Always wrap async calls in try-catch blocks to handle errors properly and ensure next() is called even if operations fail."
         },
         {
            title: "Can I modify the route object in guards?",
            text: "You shouldn't modify the to or from objects directly as they're meant to be read-only. If you need to pass additional context, consider using metadata in your route configuration or URL parameters."
         },
         {
            title: "How do I test navigation guards?",
            text: "Create unit tests that call your guard functions with mock to, from, and next parameters. Verify that next() is called with the correct arguments based on different scenarios (authenticated vs unauthenticated, different roles, etc.)."
         },
         {
            title: "Can guards access component instances?",
            text: "No, guards run before components are created. If you need component-level logic, use the component's init() method or lifecycle methods instead."
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

customElements.define("slice-routerguardsdocumentation", RouterGuardsDocumentation);