export default class Switch extends HTMLElement {

   static props = {
      checked: { 
         type: 'boolean', 
         default: false 
      },
      disabled: { 
         type: 'boolean', 
         default: false 
      },
      label: { 
         type: 'string', 
         default: null 
      },
      labelPlacement: { 
         type: 'string', 
         default: 'right' 
      },
      customColor: { 
         type: 'string', 
         default: null 
      },
      toggle: { 
         type: 'function', 
         default: null 
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$switch = this.querySelector('.slice_switch');
      this.$checkbox = this.querySelector('input');
      
      // Handle toggle callback
      if (props.toggle) {
         this.toggle = props.toggle;
         this.$checkbox.addEventListener('click', () => this.toggle());
      }

      slice.controller.setComponentProps(this, props);
   }

   init() {
      // Set initial checked state (default applied by static props)
      this.$checkbox.checked = this.checked;

      // Set initial disabled state
      this.$checkbox.disabled = this.disabled;

      // Set label if provided
      if (this.label) {
         this.createLabel();
      }

      // Set label placement (default is 'right')
      this.applyLabelPlacement();

      // Apply custom color if provided
      if (this.customColor) {
         this.applyCustomColor();
      }

      // Set up change listener
      this.$checkbox.addEventListener('change', (e) => {
         this.checked = e.target.checked;
      });
   }

   createLabel() {
      if (!this.querySelector('.switch_label')) {
         const label = document.createElement('label');
         label.classList.add('switch_label');
         label.textContent = this.label;
         this.$switch.appendChild(label);
      }
   }

   applyLabelPlacement() {
      const placement = this.labelPlacement;
      switch (placement) {
         case 'left':
            this.$switch.style.flexDirection = 'row-reverse';
            break;
         case 'right':
            this.$switch.style.flexDirection = 'row';
            break;
         case 'top':
            this.$switch.style.flexDirection = 'column-reverse';
            break;
         case 'bottom':
            this.$switch.style.flexDirection = 'column';
            break;
         default:
            this.$switch.style.flexDirection = 'row';
      }
   }

   applyCustomColor() {
      this.style.setProperty('--success-color', this.customColor);
   }

   // Getters and setters for dynamic prop updates
   get checked() {
      return this._checked;
   }

   set checked(value) {
      this._checked = value;
      if (this.$checkbox) {
         this.$checkbox.checked = value;
      }
   }

   get disabled() {
      return this._disabled;
   }

   set disabled(value) {
      this._disabled = value;
      if (this.$checkbox) {
         this.$checkbox.disabled = value;
      }
      
      const slider = this.querySelector('.slider');
      if (slider) {
         slider.classList.toggle('disabled', value);
      }
   }

   get label() {
      return this._label;
   }

   set label(value) {
      this._label = value;
      const existingLabel = this.querySelector('.switch_label');
      
      if (value) {
         if (existingLabel) {
            existingLabel.textContent = value;
         } else {
            this.createLabel();
         }
      } else if (existingLabel) {
         existingLabel.remove();
      }
   }

   get labelPlacement() {
      return this._labelPlacement;
   }

   set labelPlacement(value) {
      this._labelPlacement = value;
      this.applyLabelPlacement();
   }

   get customColor() {
      return this._customColor;
   }

   set customColor(value) {
      this._customColor = value;
      if (value) {
         this.applyCustomColor();
      }
   }

   get toggle() {
      return this._toggle;
   }

   set toggle(value) {
      this._toggle = value;
   }
}

customElements.define('slice-switch', Switch);