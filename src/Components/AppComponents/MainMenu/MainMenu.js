export default class MainMenu extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      this.$menuButton = this.querySelector('.slice_menu_button');
      this.$closeButton = this.querySelector('.slice_close_menu');
      this.$menu = this.querySelector('.slice_menu');
      this.$treeHost = this.querySelector('.slice_menu_tree_host');
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
      const menuButton = this.querySelector('.slice_menu_button');
      if (menuButton) {
         document.body.appendChild(menuButton);
         this._relocatedMenuButton = menuButton;
      }

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
      if (this.$treeHost) {
         this.$menu.insertBefore(value, this.$treeHost);
      } else {
         this.$menu.appendChild(value);
      }
   }

   setMenuTree(value) {
      if (!this.$treeHost) {
         return;
      }

      slice.controller.destroyByContainer(this.$treeHost);
      this.$treeHost.innerHTML = '';

      if (value instanceof Node) {
         this.$treeHost.appendChild(value);
      }
   }

   setEmptyState(message = 'No content found') {
      if (!this.$treeHost) {
         return;
      }

      slice.controller.destroyByContainer(this.$treeHost);
      this.$treeHost.innerHTML = '';
      const empty = document.createElement('p');
      empty.classList.add('slice_menu_empty');
      empty.textContent = message;
      this.$treeHost.appendChild(empty);
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

   beforeDestroy() {
      this._relocatedMenuButton?.remove();
   }
}

customElements.define('slice-mainmenu', MainMenu);
