export default class Grid extends HTMLElement {

   static props = {
      columns: { 
         type: 'number', 
         default: 1, 
         required: false 
      },
      rows: { 
         type: 'number', 
         default: 1, 
         required: false 
      },
      items: { 
         type: 'array', 
         default: [], 
         required: false 
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);

      this.$grid = this.querySelector('.grid-container');

      slice.controller.setComponentProps(this, props);
   }

   async init() {
      // Static props ensure columns and rows have default values
      // No need for manual validation
   }

   set columns(value) {
      this._columns = value;
      this.$grid.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
   }

   get columns() {
      return this._columns;
   }

   set rows(value) {
      this.$grid.style.gridTemplateRows = `repeat(${value}, 1fr)`;
      this._rows = value;
   }

   get rows() {
      return this._rows;
   }

   set items(values) {
      this.setItems(values);
      this._items = values;
   }

   get items() {
      return this._items;
   }

   async setItem(item) {
      if (!item || !item.classList) {
         console.warn('Grid: Invalid item provided to setItem', item);
         return;
      }
      item.classList.add('grid-item');
      this.$grid.appendChild(item);
   }

   async setItems(items) {
      if (!items || !Array.isArray(items)) {
         console.warn('Grid: Invalid items array provided', items);
         return;
      }
      for (let i = 0; i < items.length; i++) {
         await this.setItem(items[i]);
      }
   }
}

customElements.define('slice-grid', Grid);

