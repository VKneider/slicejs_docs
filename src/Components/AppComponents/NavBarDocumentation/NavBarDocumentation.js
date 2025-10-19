export default class NavBarDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Ejemplo básico - solo items
      await this.createNavbarExample(
         this.querySelector(".myNavbar"),
         {
            items: [
               { text: "Home", path: "/" },
               { text: "About", path: "/about" },
               { text: "Contact", path: "/contact" }
            ]
         },
         `{
   items: [
      { text: "Home", path: "/" },
      { text: "About", path: "/about" },
      { text: "Contact", path: "/contact" }
   ]
   // Static Props defaults:
   // logo: null
   // buttons: []
   // position: "static"
   // direction: "normal"
}`
      );

      // Ejemplo con logo
      await this.createNavbarExample(
         this.querySelector(".logoNavbar"),
         {
            logo: {
               src: "/images/Slice.js-logo.png",
               path: "/"
            },
            items: [
               { text: "Home", path: "/" },
               { text: "Documentation", path: "/docs" }
            ]
         },
         `{
   logo: {
      src: "/images/Slice.js-logo.png",
      path: "/"
   },
   items: [
      { text: "Home", path: "/" },
      { text: "Documentation", path: "/docs" }
   ]
   // Static Props Configuration:
   // logo: { type: "object", default: null }
   // items: { type: "array", default: [] }
}`
      );

      // Ejemplo completo - con logo, items y buttons
      await this.createNavbarExample(
         this.querySelector(".fullNavbar"),
         {
            logo: {
               src: "/images/Slice.js-logo.png",
               path: "/"
            },
            items: [
               { text: "Home", path: "/" },
               { text: "Documentation", path: "/docs" },
               { text: "Playground", path: "/playground" }
            ],
            buttons: [
               {
                  value: "Get Started",
                  onClickCallback: () => {
                     console.log("Get Started clicked!");
                  }
               }
            ]
         },
         `{
   logo: {
      src: "/images/Slice.js-logo.png",
      path: "/"
   },
   items: [
      { text: "Home", path: "/" },
      { text: "Documentation", path: "/docs" },
      { text: "Playground", path: "/playground" }
   ],
   buttons: [
      {
         value: "Get Started",
         onClickCallback: () => {
            console.log("Get Started clicked!");
         }
      }
   ]
   // Static Props provide automatic validation
   // buttons: { type: "array", default: [] }
}`
      );

      // Ejemplo con posición fija
      await this.createNavbarExample(
         this.querySelector(".fixedNavbar"),
         {
            position: "fixed",
            logo: {
               src: "/images/Slice.js-logo.png",
               path: "/"
            },
            items: [
               { text: "Home", path: "/" },
               { text: "About", path: "/about" }
            ]
         },
         `{
   position: "fixed",
   logo: {
      src: "/images/Slice.js-logo.png",
      path: "/"
   },
   items: [
      { text: "Home", path: "/" },
      { text: "About", path: "/about" }
   ]
   // Static Props Configuration:
   // position: { type: "string", default: "static" }
   // Values: "static" | "fixed"
}`
      );

      // Ejemplo con dirección reversa
      await this.createNavbarExample(
         this.querySelector(".reverseNavbar"),
         {
            direction: "reverse",
            logo: {
               src: "/images/Slice.js-logo.png",
               path: "/"
            },
            items: [
               { text: "Home", path: "/" },
               { text: "About", path: "/about" }
            ]
         },
         `{
   direction: "reverse",
   logo: {
      src: "/images/Slice.js-logo.png",
      path: "/"
   },
   items: [
      { text: "Home", path: "/" },
      { text: "About", path: "/about" }
   ]
   // Static Props Configuration:
   // direction: { type: "string", default: "normal" }
   // Values: "normal" | "reverse"
}`
      );

      // Añadir ejemplo de static props avanzado
      await this.createStaticPropsExample();
   }

   async createStaticPropsExample() {
      const staticPropsContainer = this.querySelector(".static-props-example");
      if (!staticPropsContainer) return;

      // Ejemplo mostrando todas las props con defaults
      const defaultsExample = await slice.build("CodeVisualizer", {
         value: `// Navbar Static Props Configuration:
export default class Navbar extends HTMLElement {
   static props = {
      logo: { 
         type: "object", 
         default: null, 
         required: false 
      },
      items: { 
         type: "array", 
         default: [], 
         required: false 
      },
      buttons: { 
         type: "array", 
         default: [], 
         required: false 
      },
      position: { 
         type: "string", 
         default: "static", 
         required: false 
      },
      direction: { 
         type: "string", 
         default: "normal", 
         required: false 
      }
   };
}

// Example with automatic defaults:
const navbar1 = await slice.build("Navbar", {
   items: [
      { text: "Home", path: "/" }
   ]
   // All other props use automatic defaults:
   // logo: null
   // buttons: []
   // position: "static"
   // direction: "normal"
});

// Example with all features:
const navbar2 = await slice.build("Navbar", {
   position: "fixed",
   direction: "reverse",
   logo: {
      src: "/logo.png",
      path: "/"
   },
   items: [
      { text: "Home", path: "/" },
      { text: "Docs", path: "/docs" }
   ],
   buttons: [
      {
         value: "Login",
         onClickCallback: () => console.log("Login")
      }
   ]
});`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(defaultsExample);

      // Características responsivas
      const responsiveInfo = document.createElement("div");
      responsiveInfo.innerHTML = `
         <h4>Responsive Features</h4>
         <ul>
            <li><strong>Desktop Mode (>1020px):</strong> Full horizontal navigation bar</li>
            <li><strong>Mobile Mode (≤1020px):</strong> Automatic hamburger menu with slide-in navigation</li>
            <li><strong>Auto-detection:</strong> Switches automatically based on screen width</li>
         </ul>
      `;
      staticPropsContainer.appendChild(responsiveInfo);

      // Props details
      const propsDetails = document.createElement("div");
      propsDetails.innerHTML = `
         <h4>Props Details</h4>
         <ul>
            <li><strong>logo:</strong> Object with "src" (image path) and "path" (navigation link)</li>
            <li><strong>items:</strong> Array of navigation items with "text" and "path"</li>
            <li><strong>buttons:</strong> Array of button objects with "value" and "onClickCallback"</li>
            <li><strong>position:</strong> "static" or "fixed" - defines navbar positioning</li>
            <li><strong>direction:</strong> "normal" or "reverse" - reverses the order of logo and menu</li>
         </ul>
      `;
      staticPropsContainer.appendChild(propsDetails);
   }

   async createNavbarExample(appendTo, navbarProps, codeProps) {
      const navbar = await slice.build("Navbar", navbarProps);

      const componentCode = await slice.build("CodeVisualizer", {
         value: `const navbar = await slice.build("Navbar", ${codeProps});`,
         language: "javascript",
      });

      const div = document.createElement("div");
      div.classList.add("navbarContainer");
      
      const exampleDiv = document.createElement("div");
      exampleDiv.classList.add("navbarExample");
      exampleDiv.appendChild(navbar);
      
      div.appendChild(exampleDiv);
      div.appendChild(componentCode);

      if (appendTo) {
         appendTo.appendChild(div);
      }
   }
}

customElements.define("slice-navbardocumentation", NavBarDocumentation);