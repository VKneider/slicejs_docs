export default class RoutingDocumentation extends HTMLElement {
    constructor(props) {
        super();
        slice.attachTemplate(this);

        slice.controller.setComponentProps(this, props);
        this.debuggerProps = [];
    }

    async init() {
        // Code examples for the documentation
        const routesConfigExample = await slice.build("CodeVisualizer", {
            language: "javascript",
            value: `// src/routes.js
const routes = [
   { path: "/", component: "HomePage" },
   { path: "/about", component: "AboutPage" },
   { path: "/contact", component: "ContactPage" },
   { 
      path: "/blog", 
      component: "BlogPage",
      children: [
         { path: "/post/:id", component: "BlogPostPage" },
         { path: "/category/:category", component: "BlogCategoryPage" }
      ] 
   },
   { path: "/dashboard", component: "DashboardPage" },
   { path: "/404", component: "NotFoundPage" }
];

export default routes;`
        });
        this.querySelector(".routes-config-example").appendChild(routesConfigExample);

        const routeComponentExample = await slice.build("CodeVisualizer", {
            language: "javascript",
            value: `// Creating a Route component programmatically
const userProfileRoute = await slice.build("Route", {
  path: "/profile",
  component: "UserProfile"
});
this.querySelector(".content-container").appendChild(userProfileRoute);`
        });

        this.querySelector(".route-component-example").appendChild(routeComponentExample);

        const multiRouteExample = await slice.build("CodeVisualizer", {
            language: "javascript",
            value: `// Creating a MultiRoute component for related routes
const dashboardRoutes = await slice.build("MultiRoute", {
  routes: [
    { path: "/dashboard", component: "DashboardHome" },
    { path: "/dashboard/analytics", component: "DashboardAnalytics" },
    { path: "/dashboard/settings", component: "DashboardSettings" },
    { path: "/dashboard/profile", component: "DashboardProfile" }
  ]
});

// Append to your main content area
document.getElementById("main-content").appendChild(dashboardRoutes);`
        });

        this.querySelector(".multi-route-example").appendChild(multiRouteExample);

        const dynamicRoutesExample = await slice.build("CodeVisualizer", {
            language: "javascript",
            value: `// Dynamic routes configuration
const routes = [
  { path: "/user/\$id", component: "UserProfile" },
  { path: "/blog/\$category/\$slug", component: "BlogPost" },
  { path: "/shop/\$category", component: "CategoryPage" }
];

// Component receiving route parameters
export default class UserProfile extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    
    // Access route parameters
    this.userId = props.params?.id;
    
    slice.controller.setComponentProps(this, props);
  }
  
  async init() {
    if (this.userId) {
      await this.loadUserData(this.userId);
    }
  }
}`
        });

        this.querySelector(".dynamic-routes-example").appendChild(dynamicRoutesExample);

        // Programmatic navigation example - UPDATED with anchor elements
        const programmaticNavExample = await slice.build("CodeVisualizer", {
            language: "javascript",
            value: `// Programmatic navigation using slice.router.navigate()
async function navigateToProfile(userId) {
  await slice.router.navigate(\`/user/\${userId}\`);
}

// Navigate with options
await slice.router.navigate("/dashboard", {
  replace: true,  // Replace current history entry
  state: { from: "home" }  // Add state data
});

// Navigation using anchor elements (automatic interception)
// The router automatically intercepts clicks on internal links
const navLink = document.createElement("a");
navLink.href = "/about";
navLink.textContent = "About Us";
// No special setup needed - router handles the click automatically

// HTML anchor elements work out of the box:
// <a href="/contact">Contact</a>
// <a href="/user/123">View User</a>

// Using the Link component for enhanced functionality
const enhancedLink = await slice.build("Link", {
  href: "/dashboard",
  text: "Go to Dashboard",
  classes: "nav-link"
});

// Links that are NOT intercepted by the router:
// External links: <a href="https://example.com">External</a>
// Hash links: <a href="#section">Jump to Section</a>
// Special protocols: <a href="mailto:test@example.com">Email</a>
// Download links: <a href="/file.pdf" download>Download</a>
// Target blank: <a href="/page" target="_blank">Open in New Tab</a>
// Marked as external: <a href="/page" class="external-link">External</a>
// No intercept attribute: <a href="/page" data-no-intercept>No Intercept</a>

// Browser navigation methods
slice.router.back();     // Go back in history
slice.router.forward();  // Go forward in history`
        });

        this.querySelector(".programmatic-nav-example").appendChild(programmaticNavExample);

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
      // Create nested routes for admin section
      const childRoutes = await slice.build("MultiRoute", {
         routes: [
            { path: "/admin", component: "AdminDashboard" },
            { path: "/admin/users", component: "UserManagement" },
            { path: "/admin/settings", component: "AdminSettings" }
         ]
      });
      
      this.contentArea.appendChild(childRoutes);
   }
}`
        });
        this.querySelector(".nested-routes-example").appendChild(nestedRoutesExample);

        // Create navigation visualization examples
        const navVisualization = document.createElement("div");
        navVisualization.classList.add("route-visualization");

        const routeDiv = document.createElement("div");
        routeDiv.classList.add("visualization-route");
        routeDiv.innerHTML = `
         <div class="vis-route-path">/about</div>
         <div class="vis-route-component">AboutPage Component</div>
      `;

        const multiRouteDiv = document.createElement("div");
        multiRouteDiv.classList.add("visualization-multiroute");
        multiRouteDiv.innerHTML = `
         <div class="vis-route-container">
            <div class="vis-route-path">/dashboard</div>
            <div class="vis-route-path">/dashboard/profile</div>
            <div class="vis-route-path">/dashboard/settings</div>
         </div>
         <div class="vis-route-component">Currently Active Component</div>
      `;

        navVisualization.appendChild(routeDiv);
        navVisualization.appendChild(multiRouteDiv);

        this.querySelector(".routing-visualization").appendChild(navVisualization);
    }
}

customElements.define("slice-routingdocumentation", RoutingDocumentation);