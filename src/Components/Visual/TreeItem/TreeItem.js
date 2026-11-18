/**
 * Map a consumer's tree item onto TreeItem's props.
 *
 * `children` and `text` are accepted as aliases for `items` and `value`.
 * Not as a nicety: `children` is a getter-only property on `HTMLElement`, so
 * spreading an item that carries one made `setComponentProps` throw
 * `Cannot set property children`, the instance was never created, and a whole
 * branch of the tree vanished with nothing on screen but one console ERROR.
 *
 * Only the keys TreeItem declares are forwarded, so no future data shape can
 * clobber a native DOM property the same way.
 */
function treeItemProps(item, onClick) {
   const children = item.items ?? item.children;
   const props = {
      value: item.value ?? item.text ?? item.label ?? '',
      path: item.path ?? '',
   };

   if (Array.isArray(children) && children.length > 0) props.items = children;
   if (typeof onClick === 'function') props.onClick = onClick;
   else if (typeof item.onClick === 'function') props.onClick = item.onClick;

   return props;
}

const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
   if (_sliceDeprecated.has(oldName)) return;
   _sliceDeprecated.add(oldName);
   console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

export default class TreeItem extends HTMLElement {

   static props = {
      value: {
         type: 'string',
         default: '',
         required: false
      },
      path: {
         type: 'string',
         default: '',
         required: false
      },
      // Canonical handler. `onClickCallback` is kept as a deprecated alias.
      onClick: {
         type: 'function',
         default: null
      },
      onClickCallback: {
         type: 'function',
         default: null
      },
      items: {
         type: 'array',
         default: [],
         required: false
      },
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);

      this.$item = this.querySelector('.slice_tree_item');

      this.$item.addEventListener('click', async () => {
         if (this._onClick) await this._onClick(this);
      });

      slice.controller.setComponentProps(this, props);
   }

   get onClick() {
      return this._onClick;
   }

   set onClick(value) {
      if (typeof value === 'function') this._onClick = value;
   }

   // Deprecated alias for onClick.
   set onClickCallback(value) {
      if (typeof value === 'function') {
         this._onClick ??= value;
         deprecate('onClickCallback', 'onClick');
      }
   }

   async init() {
      if (this._items?.length) {
         for (let i = 0; i < this._items.length; i++) {
            await this.setItem(this._items[i], this.$container);
         }
      }
      // Restaurar el estado del contenedor desde el localStorage
      this.restoreState();
   }

   set value(value) {
      this.$item.textContent = value;
      this._value = value;
   }

   get value() {
      return this._value;
   }

   set path(value) {
      this.$item.path = value;
      this._path = value;
   }

   get path() {
      return this._path;
   }

   set items(values) {
      this._items = values;
      if (!values?.length) return;
      this.classList.add('is-branch');
      const caret = document.createElement('div');
      caret.classList.add('caret');
      // Crear un contenedor para items
      const container = document.createElement('div');
      container.classList.add('container');
      this.appendChild(container);
      // Añadir
      this.$container = container;

      const toggleContainer = () => {
         const isOpen = caret.classList.toggle('caret_open');
      
         if (isOpen) {
            // Calcular la altura completa del contenedor
            const fullHeight = this.$container.scrollHeight + 'px';
      
            // Establecer la altura para iniciar la animación
            this.$container.style.height = fullHeight;
      
            // Después de que la animación termine, ajustar la altura a 'auto'
            this.$container.addEventListener('transitionend', function onTransitionEnd() {
               this.style.height = 'auto';
               this.removeEventListener('transitionend', onTransitionEnd);
            });
         } else {
            // Establecer la altura para iniciar la animación de cierre
            this.$container.style.height = this.$container.scrollHeight + 'px';
      
            // Forzar el reflujo para que la transición funcione
            requestAnimationFrame(() => {
               this.$container.style.height = '0';
            });
         }
      
         // Alternar la clase container_open
         this.$container.classList.toggle('container_open');
      
         // Guardar el estado en localStorage
         localStorage.setItem(this.getContainerKey(), isOpen ? 'open' : 'closed');
      };
      
      caret.addEventListener('click', (event) => {
         event.stopPropagation();
         toggleContainer();
      });

      if (!this.path) {
         this.$item.addEventListener('click', toggleContainer);
      }

      this.$item.appendChild(caret);
   }

   getContainerKey() {
      return `treeitem-${this._value}`;
   }

   restoreState() {
      const state = localStorage.getItem(this.getContainerKey());
      if (state === 'open') {
         const caret = this.$item.querySelector('.caret');
         if (caret) {
            caret.classList.add('caret_open');
         }
         if (this.$container) {
            this.$container.classList.add('container_open');
         }
      }
   }

   /**
    * Open or close this branch programmatically.
    *
    * Public because a parent that has to show a tree expanded has no other
    * lever: the label's click handler is only wired for branches with no
    * `path`, and the caret is a 10px triangle.
    */
   setExpanded(open) {
      if (!this.$container) return;

      const caret = this.$item.querySelector('.caret');
      const wantOpen = open === true;

      if (caret) caret.classList.toggle('caret_open', wantOpen);
      this.$container.classList.toggle('container_open', wantOpen);
      // height:auto rather than a pixel value: descendants that expand later
      // would otherwise be clipped, the same reason openBranch does it.
      this.$container.style.height = wantOpen ? 'auto' : '0px';

      localStorage.setItem(this.getContainerKey(), wantOpen ? 'open' : 'closed');
   }

   setActive(active) {
      this.$item.classList.toggle('is-active', active);
   }

  async setItem(value, addTo) {
      // Normalised, not spread, and not mutated in place: the old code did
      // `value.onClick = this._onClick`, which wrote the handler onto the
      // caller's own data object and shared it with every later branch.
      const item = await slice.build('TreeItem', treeItemProps(value, this._onClick));
      addTo.appendChild(item);
   }
}

customElements.define('slice-treeitem', TreeItem);
