export default class MainMenu extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      this.$menuButton = this.querySelector('.slice_menu_button');
      this.$closeButton = this.querySelector('.slice_close_menu');
      this.$menu = this.querySelector('.slice_menu');
      this.$overlay = this.querySelector('.slice_menu_overlay');

      this.$menuButton.addEventListener('click', () => {
         this.handleOpenMenu();
      });
      this.$closeButton.addEventListener('click', () => {
         this.handleCloseMenu();
      });
      if (this.$overlay) {
         this.$overlay.addEventListener('click', () => {
            this.handleCloseMenu();
         });
      }

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   init() {
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (canHover) {
         this.addEventListener('mouseleave', () => {
            if (this.classList.contains('slice_menu_open')){
               this.handleCloseMenu();
            }
         });
      }
   }

   add(value) {
      this.$menu.appendChild(value);
   }

   handleOpenMenu() {
      this.classList.add('slice_menu_open');
      if (this.$overlay) {
         this.$overlay.classList.add('is-visible');
      }
   }

   handleCloseMenu() {
      this.classList.remove('slice_menu_open');
      if (this.$overlay) {
         this.$overlay.classList.remove('is-visible');
      }
   }
}

customElements.define('slice-mainmenu', MainMenu);
