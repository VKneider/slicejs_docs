const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
   if (_sliceDeprecated.has(oldName)) return;
   _sliceDeprecated.add(oldName);
   console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

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
      // Canonical change handler. `onOptionSelect` is kept as a deprecated alias.
      onChange: {
         type: 'function',
         default: null
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

      this.$selectContainer.setAttribute('role', 'button');
      this.$selectContainer.setAttribute('tabindex', '0');
      this.$selectContainer.setAttribute('aria-haspopup', 'listbox');
      this.$selectContainer.setAttribute('aria-expanded', 'false');
      this.$menu.setAttribute('role', 'listbox');

      const toggle = () => {
         if (!this.disabled) this._setOpen(!this.$menu.classList.contains('menu_open'));
      };
      this.$selectContainer.addEventListener('click', toggle);
      this.$selectContainer.addEventListener('keydown', (event) => {
         if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
         } else if (event.key === 'Escape') {
            this._setOpen(false);
         }
      });

      // Close on outside click instead of a hover-only `mouseleave`, which never
      // fired on touch devices and left the menu stuck open after a tap.
      this._onOutsideClick = (event) => {
         if (!this.contains(event.target)) this._setOpen(false);
      };
      document.addEventListener('click', this._onOutsideClick);

      this._value = [];

      slice.controller.setComponentProps(this, props);
   }

   init() {
      // Static props ensure all properties have default values
   }

   _setOpen(open) {
      this.$menu.classList.toggle('menu_open', open);
      this.$caret.classList.toggle('caret_open', open);
      this.$selectContainer.setAttribute('aria-expanded', open ? 'true' : 'false');
   }

   beforeDestroy() {
      document.removeEventListener('click', this._onOutsideClick);
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
         opt.setAttribute('role', 'option');
         opt.setAttribute('aria-selected', 'false');
         opt.addEventListener('click', async () => {
            const previousActive = this.$menu.querySelector('.active');
            if (previousActive && !this.multiple) {
               previousActive.classList.remove('active');
               previousActive.setAttribute('aria-selected', 'false');
            }

            if (this._value.length === 1 && !this.multiple) {
               this.removeOptionFromValue(this._value[0]);
               this.addSelectedOption(option);
               opt.classList.add('active');
               opt.setAttribute('aria-selected', 'true');
               if (this._onChange) await this._onChange.call(this);
               return;
            }

            if (this.isObjectInArray(option, this._value).found) {
               this.removeOptionFromValue(option);
               opt.classList.remove('active');
               opt.setAttribute('aria-selected', 'false');
            } else {
               this.addSelectedOption(option);
               opt.classList.add('active');
               opt.setAttribute('aria-selected', 'true');
            }
            if (this._onChange) await this._onChange.call(this);
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
         this._setOpen(false);
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

   get onChange() {
      return this._onChange;
   }

   set onChange(value) {
      if (typeof value === 'function') this._onChange = value;
   }

   // Deprecated alias for onChange.
   get onOptionSelect() {
      return this._onChange;
   }

   set onOptionSelect(value) {
      if (typeof value === 'function') {
         this._onChange ??= value;
         deprecate('onOptionSelect', 'onChange');
      }
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