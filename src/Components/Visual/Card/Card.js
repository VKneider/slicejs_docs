export default class Card extends HTMLElement {

   static props = {
      title: { 
         type: 'string', 
         default: null 
      },
      text: { 
         type: 'string', 
         default: null 
      },
      icon: { 
         type: 'object', 
         default: { name: 'sliceJs', iconStyle: 'filled' } 
      },
      customColor: { 
         type: 'object', 
         default: null 
      },
      isOpen: { 
         type: 'boolean', 
         default: false 
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$card = this.querySelector('.slice-card');
      this.$title = this.querySelector('.title');
      this.$text = this.querySelector('.text');
      this.$cover = this.querySelector('.card_cover');
      
      slice.controller.setComponentProps(this, props);

      // Set up cover click handler
      this.$cover.addEventListener('click', () => {
         this.isOpen = !this.isOpen;
      });

      // Set up hover effects
      this.$card.addEventListener('mouseover', () => {
         if (this.$color && this.$icon) {
            this.$cover.style.backgroundColor = this.$color.icon;
            this.$icon.color = this.$color.card;
         }
      });

      this.$card.addEventListener('mouseout', () => {
         if (this.$color && this.$icon) {
            this.$cover.style.backgroundColor = this.$color.card;
            this.$icon.color = this.$color.icon;
         }
      });
   }

   async init() {
      // Set default colors if no custom colors provided
      if (!this.customColor) {
         this.$color = {
            icon: 'var(--primary-color-contrast)',
            card: 'var(--primary-color)',
         };
      } else {
         this.$color = this.customColor;
      }

      // Set title if provided
      if (this.title) {
         this.$title.textContent = this.title;
      }

      // Set text if provided
      if (this.text) {
         this.$text.textContent = this.text;
      }

      // Create icon (uses default from static props if not provided)
      this.$icon = await slice.build('Icon', {
         name: this.icon.name,
         size: '150px',
         color: this.$color.icon,
         iconStyle: this.icon.iconStyle,
      });
      this.$cover.appendChild(this.$icon);

      // Set initial open/closed state
      this.updateOpenState();

      // Apply custom colors if provided
      if (this.customColor) {
         this.applyCustomColors();
      }
   }

   updateOpenState() {
      if (this.isOpen) {
         this.$cover.style.zIndex = 0;
      } else {
         this.$cover.style.zIndex = 1;
      }
   }

   applyCustomColors() {
      if (this.customColor.card) {
         this.$cover.style.backgroundColor = this.customColor.card;
      }
   }

   // Getters and setters for dynamic prop updates
   get title() {
      return this._title;
   }

   set title(value) {
      this._title = value;
      if (this.$title) {
         this.$title.textContent = value || '';
      }
   }

   get text() {
      return this._text;
   }

   set text(value) {
      this._text = value;
      if (this.$text) {
         this.$text.textContent = value || '';
      }
   }

   get icon() {
      return this._icon;
   }

   set icon(value) {
      this._icon = value;
      if (this.$icon && value) {
         this.$icon.name = value.name;
         this.$icon.iconStyle = value.iconStyle;
      }
   }

   get isOpen() {
      return this._isOpen;
   }

   set isOpen(value) {
      this._isOpen = value;
      this.updateOpenState();
   }

   get customColor() {
      return this._customColor;
   }

   set customColor(value) {
      this._customColor = value;
      if (value) {
         this.$color = value;
         this.applyCustomColors();
         
         // Update icon color if it exists
         if (this.$icon) {
            this.$icon.color = this.$color.icon;
         }
      }
   }
}

customElements.define('slice-card', Card);