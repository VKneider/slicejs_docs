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

   get name() {
      return this._name;
   }

   set name(value) {
      this._name = value;
      this.$icon.className = '';
      this.$icon.classList.add(`slc-${styleTypes[this._iconStyle]}${value}`);
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

      this.$icon.style.fontSize = value;
   }

   get color() {
      return this._color;
   }

   set color(value) {
      this._color = value;
      this.$icon.style.color = value;
   }
}

const styleTypes = { outlined: 'out', filled: 'fil' };
customElements.define('slice-icon', Icon);
