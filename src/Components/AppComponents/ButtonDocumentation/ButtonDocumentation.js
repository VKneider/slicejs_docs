export default class ButtonDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      const grid = await slice.build("Grid", { columns: 2, rows: 1 });
      grid.classList.add("buttonsGrid");

      // Ejemplo básico mostrando static props defaults
      const simpleButton = await this.createButton(null, {});
      const myButton = await this.createButton(
         null,
         {
            value: "Slice Button",
         },
         `{
        value: "Slice Button",
        // onClickCallback defaults to null (from static props)
        // customColor defaults to null (from static props)
        // icon defaults to null (from static props)
      }`
      );

      if (window.screen.width <= 770) {
         grid.columns = 1;
      }

      await grid.setItem(simpleButton);
      await grid.setItem(myButton);

      this.querySelector(".myButton").appendChild(grid);

      // Ejemplo de customización mostrando static props
      await this.createButton(
         this.querySelector(".colorButton"),
         {
            value: "Color Button",
            customColor: { label: "black", button: "red" },
         },
         `{
        value: "Color Button",
        customColor: { label: "black", button: "red" },
        // Static Props Configuration:
        // value: { type: "string", default: "Button", required: false }
        // customColor: { type: "object", default: null }
      }`
      );

      // Ejemplo de callback mostrando static props
      const clickButton = await this.createButton(
         this.querySelector(".onClick"),
         {
            value: "Click",
            onClickCallback: () => {
               if (clickButton.value === "Click") {
                  clickButton.value = "Clicked";
               } else {
                  clickButton.value = "Click";
               }
            },
         },
         `{
        value: "Click",
        onClickCallback: () => {
          if (myButton.value === "Click") {
            myButton.value = "Clicked";
          } else {
            myButton.value = "Click";
          }
        },
        // Static Props provide automatic validation:
        // onClickCallback: { type: "function", default: null }
      }`
      );

      // Añadir ejemplo de static props avanzado
      await this.createStaticPropsExample();
   }

   // ✨ NUEVO: Método para mostrar ejemplo avanzado de static props
   async createStaticPropsExample() {
      const staticPropsContainer = document.createElement("div");
      staticPropsContainer.classList.add("static-props-example");
      
      const title = document.createElement("h2");
      title.textContent = "Static Props Features";
      title.id = "staticPropsFeatures";
      staticPropsContainer.appendChild(title);

      const description = document.createElement("p");
      description.innerHTML = `
         The Button component now uses <strong>Static Props</strong> for enhanced development experience. 
         Right-click any button to see enhanced debugger information including prop configuration, 
         default values, and prop states.
      `;
      staticPropsContainer.appendChild(description);

      // Ejemplo con defaults automáticos
      const defaultsButton = await this.createButton(
         null,
         {}, // Sin props - todos usan defaults
         `{
        // ✨ All props use automatic defaults from static props:
        // value: "Button" (default from static props)
        // onClickCallback: null (default from static props)
        // customColor: null (default from static props)
        // icon: null (default from static props)
      }`
      );

      // Ejemplo con icon
      const iconButton = await this.createButton(
         null,
         {
            value: "Download",
            icon: { name: "download", iconStyle: "solid" }
         },
         `{
        value: "Download",
        icon: { name: "download", iconStyle: "solid" },
        // ✨ Static Props automatically handle:
        // - Type validation (icon must be object)
        // - Default application for unspecified props
        // - Development warnings for invalid props
      }`
      );

      // Ejemplo mostrando validación
      const validationExample = await slice.build("CodeVisualizer", {
         value: `// Button Static Props Configuration:
export default class Button extends HTMLElement {
   static props = {
      value: { 
         type: "string", 
         default: "Button", 
         required: false 
      },
      onClickCallback: { 
         type: "function", 
         default: null 
      },
      customColor: { 
         type: "object", 
         default: null 
      },
      icon: { 
         type: "object", 
         default: null 
      }
   };
   
   constructor(props) {
      super();
      slice.attachTemplate(this);
      // Defaults applied automatically by Controller
      slice.controller.setComponentProps(this, props);
   }
}

// Development-time validation examples:
const button1 = await slice.build("Button", {
   value: "OK",
   unknownProp: "invalid" // Shows warning in development console
});

const button2 = await slice.build("Button", {
   value: 123 // Type mismatch warning (expects string)
});

// Enhanced debugger features:
// - Right-click any button to see prop configuration
// - View default values and current values
// - See prop states: Used (green), Optional (gray)
// - Anti-interference protection from Router events`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(defaultsButton);
      staticPropsContainer.appendChild(iconButton);
      staticPropsContainer.appendChild(validationExample);

      // Insertar después del último ejemplo existente
      const onClickSection = this.querySelector(".onClick");
      onClickSection.parentNode.insertBefore(staticPropsContainer, onClickSection.nextSibling);
   }

   async createButton(appendTo, buttonProps, codeProps) {
      if (!codeProps) {
         codeProps = `{
        // ✨ Using Button static props defaults:
        // value: "Button" (automatic default)
        // onClickCallback: null (automatic default)
        // customColor: null (automatic default)
        // icon: null (automatic default)
      }`;
      }
      const myButton = await slice.build("Button", buttonProps);

      const componentCode = await slice.build("CodeVisualizer", {
         value: `const myButton = await slice.build("Button", ${codeProps});

`,
         language: "javascript",
      });

      const div = document.createElement("div");
      const buttonDiv = document.createElement("div");
      buttonDiv.classList.add("buttons");
      buttonDiv.appendChild(myButton);
      div.classList.add("buttonsContainer");
      div.appendChild(buttonDiv);
      div.appendChild(componentCode);

      if (appendTo) {
         appendTo.appendChild(div);
      }
      if (buttonProps.onClickCallback) {
         return myButton;
      }

      return div;
   }
}

customElements.define("slice-buttondocumentation", ButtonDocumentation);