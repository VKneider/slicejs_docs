export default class NotFound extends HTMLElement {

   static props = {
      // No props needed for this component
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
   }

   init() {
      //change title of the page
      // Keep the 404 title identical to the manifest entry.
      document.title = 'Not found | Slice.js';
   }
}

customElements.define('slice-notfound', NotFound);
