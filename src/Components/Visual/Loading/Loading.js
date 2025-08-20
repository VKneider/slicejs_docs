export default class Loading extends HTMLElement {

   static props = {
      isActive: { 
         type: 'boolean', 
         default: false, 
         required: false 
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
   }

   init() {}

   start() {
      document.body.appendChild(this);
      this._isActive = true;
   }

   stop() {
      this.remove();
      this._isActive = false;
   }

   get isActive() {
      return this._isActive;
   }

   set isActive(value) {
      if (value === true) {
         this._isActive = true;
         if (!this._isActive) this.start();
      }

      if (value === false) {
         this._isActive = false;
         this.stop();
      }
   }
}

customElements.define('slice-loading', Loading);
