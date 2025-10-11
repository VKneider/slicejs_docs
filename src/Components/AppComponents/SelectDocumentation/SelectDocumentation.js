export default class SelectDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Ejemplo básico
      await this.createSelectExample(
         this.querySelector(".mySelect"),
         {
            options: [
               { text: "Option 1", value: 1 },
               { text: "Option 2", value: 2 },
               { text: "Option 3", value: 3 }
            ]
         },
         `{
   options: [
      { text: "Option 1", value: 1 },
      { text: "Option 2", value: 2 },
      { text: "Option 3", value: 3 }
   ]
   // Static Props defaults:
   // label: ""
   // disabled: false
   // multiple: false
   // visibleProp: "text"
   // onOptionSelect: null
}`
      );

      // Ejemplo con label
      await this.createSelectExample(
         this.querySelector(".basicSelect"),
         {
            label: "Select an option",
            options: [
               { text: "Red", value: "red" },
               { text: "Green", value: "green" },
               { text: "Blue", value: "blue" }
            ]
         },
         `{
   label: "Select an option",
   options: [
      { text: "Red", value: "red" },
      { text: "Green", value: "green" },
      { text: "Blue", value: "blue" }
   ]
   // Static Props Configuration:
   // label: { type: "string", default: "" }
}`
      );

      // Ejemplo con label alternativo
      await this.createSelectExample(
         this.querySelector(".labelSelect"),
         {
            label: "Choose your favorite fruit",
            options: [
               { text: "Apple", value: "apple" },
               { text: "Banana", value: "banana" },
               { text: "Orange", value: "orange" },
               { text: "Mango", value: "mango" }
            ],
            onOptionSelect: function() {
               // Callback se usa internamente para actualizar el display
            }
         },
         `{
   label: "Choose your favorite fruit",
   options: [
      { text: "Apple", value: "apple" },
      { text: "Banana", value: "banana" },
      { text: "Orange", value: "orange" },
      { text: "Mango", value: "mango" }
   ]
}`,
         true
      );

      // Ejemplo de selección múltiple
      await this.createSelectExample(
         this.querySelector(".multipleSelect"),
         {
            label: "Select multiple options",
            multiple: true,
            options: [
               { text: "JavaScript", value: "js" },
               { text: "Python", value: "py" },
               { text: "Java", value: "java" },
               { text: "C++", value: "cpp" }
            ],
            onOptionSelect: function() {
               // Callback se usa internamente para actualizar el display
            }
         },
         `{
   label: "Select multiple options",
   multiple: true,
   options: [
      { text: "JavaScript", value: "js" },
      { text: "Python", value: "py" },
      { text: "Java", value: "java" },
      { text: "C++", value: "cpp" }
   ]
   // Static Props Configuration:
   // multiple: { type: "boolean", default: false }
}`,
         true
      );

      // Ejemplo con callback
      await this.createSelectExample(
         this.querySelector(".callbackSelect"),
         {
            label: "Select a country",
            options: [
               { text: "USA", value: "us" },
               { text: "Canada", value: "ca" },
               { text: "Mexico", value: "mx" },
               { text: "Brazil", value: "br" }
            ],
            onOptionSelect: function() {
               console.log("Selected value:", this.value);
            }
         },
         `{
   label: "Select a country",
   options: [
      { text: "USA", value: "us" },
      { text: "Canada", value: "ca" },
      { text: "Mexico", value: "mx" },
      { text: "Brazil", value: "br" }
   ],
   onOptionSelect: function() {
      console.log("Selected value:", this.value);
   }
   // Static Props Configuration:
   // onOptionSelect: { type: "function", default: null }
   // Gets called whenever an option is selected/deselected
}`,
         true
      );

      // Ejemplo con visibleProp personalizado
      await this.createSelectExample(
         this.querySelector(".visiblePropSelect"),
         {
            label: "Select a user",
            visibleProp: "name",
            options: [
               { name: "John Doe", id: 1, email: "john@example.com" },
               { name: "Jane Smith", id: 2, email: "jane@example.com" },
               { name: "Bob Johnson", id: 3, email: "bob@example.com" }
            ],
            onOptionSelect: function() {
               // Callback se usa internamente para actualizar el display
            }
         },
         `{
   label: "Select a user",
   visibleProp: "name",
   options: [
      { name: "John Doe", id: 1, email: "john@example.com" },
      { name: "Jane Smith", id: 2, email: "jane@example.com" },
      { name: "Bob Johnson", id: 3, email: "bob@example.com" }
   ]
   // Static Props Configuration:
   // visibleProp: { type: "string", default: "text" }
   // Specifies which property to display from each option object
}`,
         true
      );

      // Ejemplo deshabilitado
      await this.createSelectExample(
         this.querySelector(".disabledSelect"),
         {
            label: "This select is disabled",
            disabled: true,
            options: [
               { text: "Option 1", value: 1 },
               { text: "Option 2", value: 2 }
            ]
         },
         `{
   label: "This select is disabled",
   disabled: true,
   options: [
      { text: "Option 1", value: 1 },
      { text: "Option 2", value: 2 }
   ]
   // Static Props Configuration:
   // disabled: { type: "boolean", default: false }
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
         value: `// Select Static Props Configuration:
export default class Select extends HTMLElement {
   static props = {
      options: { 
         type: "array", 
         default: [], 
         required: false 
      },
      disabled: { 
         type: "boolean", 
         default: false 
      },
      label: { 
         type: "string", 
         default: "", 
         required: false 
      },
      multiple: { 
         type: "boolean", 
         default: false 
      },
      visibleProp: { 
         type: "string", 
         default: "text", 
         required: false 
      },
      onOptionSelect: { 
         type: "function", 
         default: null 
      }
   };
}

// Example with automatic defaults:
const select1 = await slice.build("Select", {
   options: [
      { text: "Option 1", value: 1 },
      { text: "Option 2", value: 2 }
   ]
   // All other props use automatic defaults:
   // label: ""
   // disabled: false
   // multiple: false
   // visibleProp: "text"
   // onOptionSelect: null
});

// Example with all features:
const select2 = await slice.build("Select", {
   label: "Select programming languages",
   multiple: true,
   options: [
      { text: "JavaScript", value: "js" },
      { text: "Python", value: "py" }
   ],
   onOptionSelect: function() {
      console.log("Selection changed:", this.value);
   }
});

// Working with the Select value:
const mySelect = await slice.build("Select", {
   label: "Choose one",
   options: [
      { text: "Option A", value: "a" },
      { text: "Option B", value: "b" }
   ]
});

// Get current value (returns single object or array if multiple)
console.log(mySelect.value);

// Set value programmatically
mySelect.value = [{ text: "Option A", value: "a" }];`,
         language: "javascript"
      });

      staticPropsContainer.appendChild(defaultsExample);

      // Características adicionales
      const additionalInfo = document.createElement("div");
      additionalInfo.innerHTML = `
         <h4>Important Features</h4>
         <ul>
            <li><strong>Value property:</strong> Returns a single object for single selection, or an array for multiple selection</li>
            <li><strong>Option matching:</strong> Automatically detects if an option is already selected using deep object comparison</li>
            <li><strong>Visual feedback:</strong> Selected options are highlighted with an "active" class</li>
            <li><strong>Auto-close:</strong> Single selection mode automatically closes the dropdown after selection</li>
         </ul>
         
         <h4>Option Object Structure</h4>
         <ul>
            <li>Each option must be an object</li>
            <li>By default, the component looks for a "text" property to display</li>
            <li>Use <code>visibleProp</code> to specify a different property name</li>
            <li>Options can have any additional properties (id, value, data, etc.)</li>
         </ul>
      `;
      staticPropsContainer.appendChild(additionalInfo);
   }

   async createSelectExample(appendTo, selectProps, codeProps, showValue = false) {
      const div = document.createElement("div");
      div.classList.add("selectContainer");
      
      const exampleDiv = document.createElement("div");
      exampleDiv.classList.add("selectExample");

      // Si showValue es true, crear el display y modificar el callback ANTES de crear el Select
      let valueDisplay;
      if (showValue) {
         valueDisplay = document.createElement("div");
         valueDisplay.classList.add("selectedValueDisplay");
         valueDisplay.textContent = "Selected: (none)";
         
         // Guardar el callback original si existe
         const originalCallback = selectProps.onOptionSelect;
         
         // Crear nuevo callback que actualiza el display
         selectProps.onOptionSelect = function() {
            const displayValue = this.value 
               ? JSON.stringify(this.value, null, 2) 
               : "(none)";
            valueDisplay.textContent = `Selected: ${displayValue}`;
            
            // Llamar al callback original si existía
            if (originalCallback) {
               originalCallback.call(this);
            }
         };
      }

      // Ahora crear el Select con el callback modificado
      const select = await slice.build("Select", selectProps);
      exampleDiv.appendChild(select);
      div.appendChild(exampleDiv);

      // Añadir el display de valor si existe
      if (valueDisplay) {
         div.appendChild(valueDisplay);
      }

      const componentCode = await slice.build("CodeVisualizer", {
         value: `const select = await slice.build("Select", ${codeProps});`,
         language: "javascript",
      });

      div.appendChild(componentCode);

      if (appendTo) {
         appendTo.appendChild(div);
      }
   }
}

customElements.define("slice-selectdocumentation", SelectDocumentation);