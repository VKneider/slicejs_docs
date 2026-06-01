export default class Table extends HTMLElement {
  static props = {
    headers: { type: 'array', default: [], required: false },
    rows: { type: 'array', default: [], required: false }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.$head = this.querySelector('.table_head');
    this.$body = this.querySelector('.table_body');

    slice.controller.setComponentProps(this, props);
  }

  init() {
    this.renderTable();
  }

  set headers(value) {
    this._headers = Array.isArray(value) ? value : [];
    this.renderTable();
  }

  get headers() {
    return this._headers;
  }

  set rows(value) {
    this._rows = Array.isArray(value) ? value : [];
    this.renderTable();
  }

  get rows() {
    return this._rows;
  }

  renderTable() {
    if (!this.$head || !this.$body) return;

    this.$head.innerHTML = '';
    this.$body.innerHTML = '';

    const headers = Array.isArray(this.headers) ? this.headers : [];
    const rows = Array.isArray(this.rows) ? this.rows : [];

    if (headers.length > 0) {
      const headRow = document.createElement('tr');
      headers.forEach((header) => {
        const th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.textContent = header;
        headRow.appendChild(th);
      });
      this.$head.appendChild(headRow);
    }

    rows.forEach((row) => {
      const tr = document.createElement('tr');
      (Array.isArray(row) ? row : []).forEach((cell, index) => {
        const td = document.createElement('td');
        this.renderCell(td, cell);
        if (headers[index]) {
          td.dataset.label = headers[index];
        }
        tr.appendChild(td);
      });
      this.$body.appendChild(tr);
    });
  }

  // Cells are rendered safely by default. A cell can be:
  //  - a DOM Node            -> appended as-is (recommended for rich content)
  //  - { html: '<...>' }     -> explicit opt-in for TRUSTED raw HTML
  //  - anything else         -> coerced to text via textContent (escaped, no XSS)
  // Plain strings are NO LONGER injected as HTML, which removes the XSS vector
  // when rows contain unsanitized/user data.
  renderCell(td, cell) {
    if (cell instanceof Node) {
      td.appendChild(cell);
    } else if (cell && typeof cell === 'object' && typeof cell.html === 'string') {
      td.innerHTML = cell.html;
    } else {
      td.textContent = cell === null || cell === undefined ? '' : String(cell);
    }
  }
}

customElements.define('slice-table', Table);
