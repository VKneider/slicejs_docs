export default class InputSearchDocs extends HTMLElement {
  static props = {
    docsIndex: {
      type: 'array',
      default: [],
      required: false
    },
    placeholder: {
      type: 'string',
      default: 'Search docs',
      required: false
    },
    maxResults: {
      type: 'number',
      default: 10,
      required: false
    },
    onSelect: {
      type: 'function',
      default: null,
      required: false
    }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.activeIndex = -1;
    this.isQuickOpen = true;
    this.debuggerProps = [];
  }

  async init() {
    this.$input = this.querySelector('input');
    this.$panel = this.querySelector('.search-panel');
    this.$results = this.querySelector('.search-results');
    this.$clear = this.querySelector('.search-clear');
    this.$toggle = this.querySelector('.search-panel-toggle');
    this.$toggleArrow = this.querySelector('.search-panel-arrow');

    if (this.$input) {
      this.$input.placeholder = this.placeholder || 'Search docs';
      this.$input.addEventListener('input', () => this.onSearch());
      this.$input.addEventListener('focus', () => this.openPanel());
      this.$input.addEventListener('keydown', (event) => this.onKeyDown(event));
    }

    if (this.$clear) {
      this.$clear.addEventListener('click', () => this.clearSearch());
    }

    if (this.$toggle) {
      this.$toggle.addEventListener('click', () => this.toggleQuickLinks());
    }

    document.addEventListener('click', (event) => {
      if (!this.contains(event.target)) {
        this.closePanel();
      }
    });

    this.renderQuickLinks();
  }

  update() {
    this.renderQuickLinks();
  }

  normalize(value) {
    return (value || '').toLowerCase();
  }

  onSearch() {
    if (!this.$input) return;
    const query = this.normalize(this.$input.value).trim();
    if (!query) {
      this.renderQuickLinks();
      return;
    }

    const matches = this.filterIndex(query);
    this.renderResults(matches, query);
  }

  filterIndex(query) {
    const index = Array.isArray(this.docsIndex) ? this.docsIndex : [];
    return index.filter((entry) => {
      const haystack = [
        entry.title,
        entry.description,
        entry.section,
        entry.group,
        entry.route,
        ...(entry.tags || [])
      ]
        .map((value) => this.normalize(value))
        .join(' ');
      return haystack.includes(query);
    });
  }

  renderQuickLinks() {
    if (!this.$results || !this.$panel) return;
    const index = Array.isArray(this.docsIndex) ? this.docsIndex : [];
    const quick = index.slice(0, this.maxResults || 10);
    this.isQuickOpen = true;
    this.$panel.classList.remove('closed');
    if (this.$toggle) {
      this.$toggle.querySelector('.search-panel-title').textContent = 'Quick Links';
    }
    this.renderList(quick);
  }

  renderResults(matches, query) {
    if (!this.$results || !this.$panel) return;
    const resultList = matches.slice(0, this.maxResults || 10);
    this.isQuickOpen = true;
    this.$panel.classList.remove('closed');
    if (this.$toggle) {
      this.$toggle.querySelector('.search-panel-title').textContent = `Results (${resultList.length})`;
    }
    this.renderList(resultList, query);
  }

  renderList(list, query = '') {
    this.$results.innerHTML = '';
    this.activeIndex = -1;

    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = 'No results found.';
      this.$results.appendChild(empty);
      this.openPanel();
      return;
    }

    list.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-item';
      button.innerHTML = `
        <div class="search-title">${this.highlight(item.title, query)}</div>
        <div class="search-meta">${item.section || ''}${item.group ? ' / ' + item.group : ''}</div>
        <div class="search-desc">${item.description || ''}</div>
      `;
      button.addEventListener('click', () => this.selectItem(item));
      button.addEventListener('mouseenter', () => this.setActive(index));
      this.$results.appendChild(button);
    });

    this.openPanel();
  }

  highlight(text, query) {
    if (!query) return text || '';
    const value = text || '';
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'ig');
    return value.replace(regex, '<strong>$1</strong>');
  }

  onKeyDown(event) {
    if (!this.$results) return;
    const items = Array.from(this.$results.querySelectorAll('.search-item'));
    if (!items.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.setActive(Math.min(this.activeIndex + 1, items.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.setActive(Math.max(this.activeIndex - 1, 0));
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const active = items[this.activeIndex];
      active?.click();
    }

    if (event.key === 'Escape') {
      this.closePanel();
    }
  }

  setActive(index) {
    const items = Array.from(this.$results.querySelectorAll('.search-item'));
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });
    this.activeIndex = index;
  }

  selectItem(item) {
    if (typeof this.onSelect === 'function') {
      this.onSelect(item);
    } else if (item?.route) {
      slice.router.navigate(item.route);
    }
    this.clearSearch();
  }

  clearSearch() {
    if (this.$input) this.$input.value = '';
    this.renderQuickLinks();
  }

  toggleQuickLinks() {
    if (!this.$panel) return;
    this.isQuickOpen = !this.isQuickOpen;
    this.$panel.classList.toggle('closed', !this.isQuickOpen);
  }

  openPanel() {
    if (this.$panel) this.$panel.classList.add('open');
  }

  closePanel() {
    if (this.$panel) this.$panel.classList.remove('open');
  }
}

customElements.define('slice-inputsearchdocs', InputSearchDocs);
