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
    this.isQuickOpen = false;
    this.recentKey = 'slice-docs-recent';
    this.debuggerProps = [];
  }

  async init() {
    this.$input = this.querySelector('input');
    this.$panel = this.querySelector('.search-panel');
    this.$results = this.querySelector('.search-results');
    this.$clear = this.querySelector('.search-clear');
    this.$toggle = this.querySelector('.search-panel-toggle');
    this.$toggleArrow = this.querySelector('.search-panel-arrow');
    this.$count = this.querySelector('.search-count');

    if (this.$results) {
      this.$results.id = 'docs-search-results';
    }
    if (this.$toggle) {
      this.$toggle.setAttribute('aria-expanded', 'false');
      this.$toggle.setAttribute('aria-controls', 'docs-search-results');
    }

    if (this.$input) {
      this.$input.placeholder = this.placeholder || 'Search docs';
      this.$input.setAttribute('aria-controls', 'docs-search-results');
      this.$input.addEventListener('input', () => this.onSearch());
      this.$input.addEventListener('focus', () => {
        this.openPanel();
        if (!this.$input.value.trim()) {
          this.renderIdle(true);
        }
      });
      this.$input.addEventListener('keydown', (event) => this.onKeyDown(event));
    }

    if (this.$clear) {
      this.$clear.addEventListener('click', () => this.clearSearch());
    }

    if (this.$toggle) {
      this.$toggle.addEventListener('click', () => this.toggleQuickLinks());
    }

    this._onDocumentClick = (event) => {
      if (!this.contains(event.target)) {
        this.closePanel();
      }
    };
    document.addEventListener('click', this._onDocumentClick);

    // `/` and Cmd/Ctrl+K focus the docs search, the same accelerator readers
    // expect on a documentation site.
    this._onShortcut = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const typing = target?.closest?.('input, textarea, [contenteditable="true"]');
      if (typing) return;

      const slash = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey;
      const commandK = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);
      if (!slash && !commandK) return;

      event.preventDefault();
      this.$input?.focus();
      this.$input?.select?.();
      this.openPanel();
    };
    document.addEventListener('keydown', this._onShortcut);

    this.renderQuickLinks(false);
  }

  update() {
    if (this.$input?.value?.trim()) this.onSearch();
    else this.renderIdle(this.isQuickOpen);
  }

  normalize(value) {
    return (value || '').toLowerCase();
  }

  onSearch() {
    if (!this.$input) return;
    const query = this.normalize(this.$input.value).trim();
    if (!query) {
      this.renderIdle(true);
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

  loadRecent() {
    try {
      const raw = localStorage.getItem(this.recentKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string').slice(0, 5) : [];
    } catch {
      return [];
    }
  }

  remember(query) {
    const value = String(query || '').trim();
    if (!value) return;
    try {
      const recent = [value, ...this.loadRecent().filter((item) => item !== value)].slice(0, 5);
      localStorage.setItem(this.recentKey, JSON.stringify(recent));
    } catch {
      // Storage can be disabled; search still works for this session.
    }
  }

  clearRecent() {
    try {
      localStorage.removeItem(this.recentKey);
    } catch {
      // ignore
    }
  }

  renderIdle(open = false) {
    const recent = this.loadRecent();
    if (recent.length) this.renderRecent(recent, open);
    else this.renderQuickLinks(open);
  }

  renderRecent(recent, open = true) {
    if (!this.$results || !this.$panel) return;

    this.$results.innerHTML = '';
    this.activeIndex = -1;
    this.isQuickOpen = open;
    this.$panel.classList.toggle('closed', !open);
    this.setTitle('Recent searches');
    this.setCount('');

    recent.forEach((query, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-item search-recent';

      const title = document.createElement('div');
      title.className = 'search-title';
      title.textContent = query;

      const meta = document.createElement('div');
      meta.className = 'search-meta';
      meta.textContent = 'Recent search';

      button.append(title, meta);
      button.addEventListener('click', () => {
        if (!this.$input) return;
        this.$input.value = query;
        this.onSearch();
        this.$input.focus();
      });
      button.addEventListener('mouseenter', () => this.setActive(index));
      this.$results.appendChild(button);
    });

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'search-clear-recent';
    clear.textContent = 'Clear recent searches';
    clear.addEventListener('click', () => {
      this.clearRecent();
      this.renderQuickLinks(true);
    });
    this.$results.appendChild(clear);

    if (open) this.openPanel();
  }

  renderQuickLinks(open = false) {
    if (!this.$results || !this.$panel) return;
    const index = Array.isArray(this.docsIndex) ? this.docsIndex : [];
    const quick = index.slice(0, Math.min(this.maxResults || 10, 5));
    this.isQuickOpen = open;
    this.$panel.classList.toggle('closed', !open);
    this.setTitle('Quick links');
    this.setCount('');
    this.renderList(quick, '', open);
  }

  renderResults(matches, query) {
    if (!this.$results || !this.$panel) return;
    const total = matches.length;
    const resultList = matches.slice(0, this.maxResults || 10);
    this.isQuickOpen = true;
    this.$panel.classList.remove('closed');
    this.setTitle(`Results (${total})`);
    if (!total) {
      this.setCount(`No results for “${query}”`);
    } else if (total > resultList.length) {
      this.setCount(`Showing ${resultList.length} of ${total} results for “${query}”`);
    } else {
      this.setCount(`${total} result${total === 1 ? '' : 's'} for “${query}”`);
    }
    this.renderList(resultList, query, true);
  }

  renderList(list, query = '', open = true) {
    this.$results.innerHTML = '';
    this.activeIndex = -1;

    if (!list.length) {
      this.renderEmpty(query);
      if (open) this.openPanel();
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

    if (open) this.openPanel();
  }

  renderEmpty(query) {
    const empty = document.createElement('div');
    empty.className = 'search-empty';

    const title = document.createElement('p');
    title.className = 'search-empty-title';
    title.textContent = `No results for “${query}”.`;
    empty.appendChild(title);

    const hint = document.createElement('p');
    hint.className = 'search-empty-hint';
    hint.textContent = 'Try a shorter query or start from one of these pages:';
    empty.appendChild(hint);

    const index = Array.isArray(this.docsIndex) ? this.docsIndex : [];
    index.slice(0, 3).forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-item search-suggestion';
      button.innerHTML = `
        <div class="search-title">${item.title}</div>
        <div class="search-meta">${item.section || ''}${item.group ? ' / ' + item.group : ''}</div>
      `;
      button.addEventListener('click', () => this.selectItem(item));
      empty.appendChild(button);
    });

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'search-clear-recent';
    clear.textContent = 'Clear search';
    clear.addEventListener('click', () => this.clearSearch());
    empty.appendChild(clear);

    this.$results.appendChild(empty);
  }

  setTitle(text) {
    const title = this.$toggle?.querySelector('.search-panel-title');
    if (title) title.textContent = text;
  }

  setCount(text) {
    if (!this.$count) return;
    this.$count.textContent = text || '';
    this.$count.hidden = !text;
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

    if (event.key === 'Escape') {
      this.closePanel();
      return;
    }

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
  }

  setActive(index) {
    const items = Array.from(this.$results.querySelectorAll('.search-item'));
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });
    this.activeIndex = index;
  }

  selectItem(item) {
    this.remember(this.$input?.value?.trim());
    if (typeof this.onSelect === 'function') {
      this.onSelect(item);
    } else if (item?.route) {
      slice.router.navigate(item.route);
    }
    this.resetSearch();
  }

  resetSearch() {
    if (this.$input) this.$input.value = '';
    this.renderQuickLinks(false);
    this.closePanel();
  }

  clearSearch() {
    if (this.$input) this.$input.value = '';
    this.renderIdle(true);
    this.$input?.focus();
  }

  toggleQuickLinks() {
    if (!this.$panel) return;
    if (this.isQuickOpen) {
      this.closePanel();
      return;
    }
    this.renderIdle(true);
  }

  openPanel() {
    if (this.$panel) this.$panel.classList.add('open');
    this.$toggle?.setAttribute('aria-expanded', 'true');
  }

  closePanel() {
    if (this.$panel) this.$panel.classList.remove('open');
    this.$toggle?.setAttribute('aria-expanded', 'false');
  }

  beforeDestroy() {
    if (this._onDocumentClick) {
      document.removeEventListener('click', this._onDocumentClick);
      this._onDocumentClick = null;
    }
    if (this._onShortcut) {
      document.removeEventListener('keydown', this._onShortcut);
      this._onShortcut = null;
    }
  }
}

customElements.define('slice-inputsearchdocs', InputSearchDocs);
