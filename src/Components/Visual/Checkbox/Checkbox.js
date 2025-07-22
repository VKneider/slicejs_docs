export default class Checkbox extends HTMLElement {

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
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$checkbox = this.querySelector('.slice_checkbox');
      this.$checkmark = this.querySelector('.checkmark');
      this.$input = this.querySelector('input');

      slice.controller.setComponentProps(this, props);
   }

   init() {
      // Set initial checked state (default applied by static props)
      this.$input.checked = this.checked;

      // Set initial disabled state
      this.$input.disabled = this.disabled;

      // Apply disabled styling if needed
      if (this.disabled) {
         this.$checkmark.classList.add('disabled');
      }

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
      this.$input.addEventListener('change', (e) => {
         this.checked = e.target.checked;
      });
   }

   createLabel() {
      if (!this.querySelector('.checkbox_label')) {
         const label = document.createElement('label');
         label.classList.add('checkbox_label');
         label.textContent = this.label;
         this.$checkbox.appendChild(label);
      }
   }

   applyLabelPlacement() {
      const placement = this.labelPlacement;
      switch (placement) {
         case 'left':
            this.$checkbox.style.flexDirection = 'row-reverse';
            break;
         case 'right':
            this.$checkbox.style.flexDirection = 'row';
            break;
         case 'top':
            this.$checkbox.style.flexDirection = 'column-reverse';
            break;
         case 'bottom':
            this.$checkbox.style.flexDirection = 'column';
            break;
         default:
            this.$checkbox.style.flexDirection = 'row';
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
      if (this.$input) {
         this.$input.checked = value;
      }
   }

   get disabled() {
      return this._disabled;
   }

   set disabled(value) {
      this._disabled = value;
      if (this.$input) {
         this.$input.disabled = value;
      }
      
      if (this.$checkmark) {
         this.$checkmark.classList.toggle('disabled', value);
      }
   }

   get label() {
      return this._label;
   }

   set label(value) {
      this._label = value;
      const existingLabel = this.querySelector('.checkbox_label');
      
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
}

customElements.define('slice-checkbox', Checkbox);