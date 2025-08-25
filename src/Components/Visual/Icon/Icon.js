export default class Icon extends HTMLElement {

   static props = {
      name: { 
         type: 'string', 
         default: 'youtube', 
         required: false 
      },
      size: { 
         type: 'string', 
         default: 'small' 
      },
      color: { 
         type: 'string', 
         default: 'black' 
      },
      iconStyle: { 
         type: 'string', 
         default: 'filled' 
      }
   };

   constructor(props) {
      super();

      slice.attachTemplate(this);
      this.$icon = this.querySelector('i');

      slice.controller.setComponentProps(this, props);
   }

   get random() {
      return this.$icon.classList;
   }

   set random(value) {}

   init() {
      // Static props ensure all properties have default values
      // No need for manual default checking
   }

   update() {
      // Re-apply all properties to ensure proper styling after router navigation
      // This method is called on each re-render by MultiRoute
      if (this.$icon) {
         if (this._name) this.name = this._name;
         if (this._iconStyle) this.iconStyle = this._iconStyle;
         if (this._size) this.size = this._size;
         if (this._color) this.color = this._color;
      }
   }

   get name() {
      return this._name;
   }

   set name(value) {
      this._name = value;
      if (this.$icon) {
         this.$icon.className = '';
         this.$icon.classList.add(`slc-${styleTypes[this._iconStyle]}${value}`);
      }
   }

   get iconStyle() {
      return this._iconStyle;
   }

   set iconStyle(value) {
      if (value !== 'filled' && value !== 'outlined') value = 'filled';
      this._iconStyle = value;
      this.name = this._name;
   }

   get size() {
      return this._size;
   }

   set size(value) {
      switch (value) {
         case 'small':
            this._size = '16px';
            break;
         case 'medium':
            this._size = '20px';
            break;
         case 'large':
            this._size = '24px';
            break;
         default:
            this._size = value;
      }

      if (this.$icon) {
         this.$icon.style.fontSize = this._size;
      }
   }

   get color() {
      return this._color;
   }

   set color(value) {
      this._color = value;
      if (this.$icon) {
         this.$icon.style.color = value;
      }
   }
}

const styleTypes = { outlined: 'out', filled: 'fil' };
customElements.define('slice-icon', Icon);
