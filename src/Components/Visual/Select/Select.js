export default class Select extends HTMLElement {

   static props = {
      options: { 
         type: 'array', 
         default: [], 
         required: false 
      },
      disabled: { 
         type: 'boolean', 
         default: false 
      },
      label: { 
         type: 'string', 
         default: '', 
         required: false 
      },
      multiple: { 
         type: 'boolean', 
         default: false 
      },
      visibleProp: { 
         type: 'string', 
         default: 'text', 
         required: false 
      },
      onOptionSelect: { 
         type: 'function', 
         default: null 
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$dropdown = this.querySelector('.slice_select_dropdown');
      this.$selectContainer = this.querySelector('.slice_select_container');
      this.$label = this.querySelector('.slice_select_label');
      this.$select = this.querySelector('.slice_select');
      this.$menu = this.querySelector('.slice_select_menu');
      this.$caret = this.querySelector('.caret');

      this.$selectContainer.addEventListener('click', () => {
         if (!this.disabled) {
            this.$menu.classList.toggle('menu_open');
            this.$caret.classList.toggle('caret_open');
         }
      });
      
      this.$dropdown.addEventListener('mouseleave', () => {
         this.$menu.classList.remove('menu_open');
         this.$caret.classList.remove('caret_open');
      });

      this._value = [];

      slice.controller.setComponentProps(this, props);
   }

   init() {
      // Static props ensure all properties have default values
   }

   get options() {
      return this._options;
   }

   set options(values) {
      // ✅ Validar que values no sea null o undefined
      if (!values || !Array.isArray(values)) return;
      
      this._options = values;
      
      // ✅ Limpiar menú si existe
      if (this.$menu) {
         this.$menu.innerHTML = '';
      }
      
      values.forEach((option) => {
         const opt = document.createElement('div');
         opt.textContent = option[this.visibleProp];
         opt.addEventListener('click', async () => {
            if (this.$menu.querySelector('.active') && !this.multiple) {
               this.$menu.querySelector('.active').classList.remove('active');
            }

            if (this._value.length === 1 && !this.multiple) {
               this.removeOptionFromValue(this._value[0]);
               this.addSelectedOption(option);
               if (this.onOptionSelect) await this.onOptionSelect.call(this);
               return;
            }

            if (this.isObjectInArray(option, this._value).found) {
               this.removeOptionFromValue(option);
               opt.classList.remove('active');
            } else {
               this.addSelectedOption(option);
               opt.classList.add('active');
            }
            if (this.onOptionSelect) await this.onOptionSelect.call(this);
         });
         this.$menu.appendChild(opt);
      });
   }

   removeOptionFromValue(option) {
      const optionIndex = this.isObjectInArray(option, this._value).index;
      if (optionIndex !== -1) {
         this._value.splice(optionIndex, 1);
         this.updateSelectLabel();
      }

      if (this._value.length === 0) {
         this.$label.classList.remove('slice_select_value');
      }
   }

   updateSelectLabel() {
      this.$select.value = '';

      if (this._value.length > 0) {
         this.$select.value = this._value.map((option) => option[this.visibleProp]).join(', ');
         this.$label.classList.add('slice_select_value');
      } else {
         this.$label.classList.remove('slice_select_value');
      }
   }

   addSelectedOption(option) {
      this._value.push(option);
      this.updateSelectLabel();
      this.$label.classList.add('slice_select_value');
      if (!this.multiple) {
         this.$menu.classList.remove('menu_open');
      }
   }

   get value() {
      if (this._value.length === 1) {
         return this._value[0];
      }
      return this._value;
   }

   set value(valueParam) {
      // ✅ Validar que valueParam sea un array
      if (!valueParam || !Array.isArray(valueParam)) return;
      
      this._value = [];

      if (valueParam.length > 1 && !this.multiple) {
         console.error('Select is not multiple, you can only select one option');
         return;
      }

      // ✅ Validar que exista this._options antes de verificar
      if (!this._options) {
         console.error('Cannot set value before options are defined');
         return;
      }

      const validOptions = valueParam.every((option) => 
         this.isObjectInArray(option, this._options).found
      );

      if (!validOptions) {
         console.error('Error: At least one of the provided options is not in this.options');
         return;
      }

      this.$label.classList.add('slice_select_value');
      valueParam.forEach((option) => this.addSelectedOption(option));
   }

   get label() {
      return this._label;
   }

   set label(value) {
      this._label = value;
      // ✅ Validar que value no sea null o undefined
      if (value !== null && value !== undefined && this.$label) {
         this.$label.textContent = value;
      }
   }

   get multiple() {
      return this._multiple;
   }
   
   set multiple(value) {
      this._multiple = value;
   }

   get disabled() {
      return this._disabled;
   }

   set disabled(value) {
      this._disabled = value;
      // ✅ Actualizar estado visual del select cuando cambia disabled
      if (this.$selectContainer) {
         if (value) {
            this.$selectContainer.style.opacity = '0.5';
            this.$selectContainer.style.cursor = 'not-allowed';
         } else {
            this.$selectContainer.style.opacity = '1';
            this.$selectContainer.style.cursor = 'pointer';
         }
      }
   }

   get visibleProp() {
      return this._visibleProp;
   }

   set visibleProp(value) {
      this._visibleProp = value;
      // Si existía ya this._options, regenerar los divs de opciones
      if (this._options && this._options.length > 0) {
         this.options = this._options;
      }
   }

   get onOptionSelect() {
      return this._onOptionSelect;
   }

   set onOptionSelect(value) {
      this._onOptionSelect = value;
   }

   isObjectInArray(objeto, arreglo) {
      for (let i = 0; i < arreglo.length; i++) {
         if (this.sameObject(arreglo[i], objeto)) {
            return { found: true, index: i };
         }
      }
      return { found: false, index: -1 };
   }
   
   sameObject(objetoA, objetoB) {
      const keysA = Object.keys(objetoA);
      const keysB = Object.keys(objetoB);

      if (keysA.length !== keysB.length) {
         return false;
      }

      for (const key of keysA) {
         const valueA = objetoA[key];
         const valueB = objetoB[key];

         if (typeof valueA === 'object' && typeof valueB === 'object') {
            if (!this.sameObject(valueA, valueB)) {
               return false;
            }
         } else if (valueA !== valueB) {
            return false;
         }
      }

      return true;
   }
}

customElements.define('slice-select', Select);