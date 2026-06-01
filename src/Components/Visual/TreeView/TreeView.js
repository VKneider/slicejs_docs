const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
   if (_sliceDeprecated.has(oldName)) return;
   _sliceDeprecated.add(oldName);
   console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

export default class TreeView extends HTMLElement {

   static props = {
      items: {
         type: 'array',
         default: [],
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
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);

      this.$treeView = this.querySelector('.simple_treeview');
      slice.controller.setComponentProps(this, props);
   }

   async init() {
      if (this.items) {
         await this.setTreeItems(this.items);
      }
   }

   set items(values) {
      this._items = values;
   }

   get items() {
      return this._items;
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

   async setTreeItem(item) {
      if (this._onClick) {
         item.onClick = this._onClick;
      }

      const treeItem = await slice.build('TreeItem', item);
      treeItem.classList.add('tree_item');
      this.$treeView.appendChild(treeItem);
   }

   async setTreeItems(items) {
      for (let i = 0; i < items.length; i++) {
         await this.setTreeItem(items[i]);
      }
   }
}

customElements.define('slice-treeview', TreeView);
