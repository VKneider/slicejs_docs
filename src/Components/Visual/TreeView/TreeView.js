// TreeView — a hierarchical list: navigation sidebars, file trees, category
// pickers, nested settings.
//
// RENDERING. The tree is drawn as ONE flat list of rows (role="treeitem" with
// aria-level / aria-setsize / aria-posinset — the flat form of the ARIA tree
// pattern) instead of a component per node. That is what makes the rest
// possible: a roving keyboard focus across levels, virtual scrolling of tens
// of thousands of nodes, filtering, and drag and drop. Rows are cached by key
// and only re-drawn when their content changes, so opening a branch inserts
// rows instead of rebuilding the tree. (`TreeItem` is still a component of its
// own, for anyone using it on its own.)
//
// ITEMS. `{ label | value | text, path, id, icon, badge, description,
// items | children, disabled, hidden, expanded, actions, href }`.
// `items` may be a function (async too): the branch loads when first opened.
//
// KEYS. id → path → the parent's key + the label (with a counter for twins).
// Stable across reloads, so remembered open branches (`stateKey`) survive one.
//
// KEYBOARD (WAI-ARIA tree view): ↑ ↓ move, → opens a branch or steps into it,
// ← closes it or steps to the parent, Home / End jump, * opens every sibling,
// typing jumps by label, Enter activates, Space toggles the check (or selects),
// Shift+F10 / the context-menu key opens the row's actions.

import { texts } from '../../shared/text/texts.js';

const TEXTS = {
   searchPlaceholder: 'Search…',
   emptyMessage: 'Nothing matches.',
   search: 'Search',
   loading: 'Loading…',
   actionsFor: 'Actions for {label}',
};

// Spanish mirrors TEXTS key by key; the app can override any of them with its dictionary.
const ES = {
   searchPlaceholder: 'Buscar…',
   emptyMessage: 'No hay coincidencias.',
   search: 'Buscar',
   loading: 'Cargando…',
   actionsFor: 'Acciones de {label}',
};

const t = texts('slice.treeView', { en: TEXTS, es: ES });

function fill(template, values) {
   return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

let _sliceTreeViewSeq = 0;

const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
   if (_sliceDeprecated.has(oldName)) return;
   _sliceDeprecated.add(oldName);
   console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

// Accent- and case-insensitive text, the same rule DataGridEngine searches by.
function fold(text) {
   return String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const ROW_HEIGHTS = { sm: 28, md: 34, lg: 40 };
const DRAG_OPEN_DELAY = 650;

export default class TreeView extends HTMLElement {

   static props = {
      items: {
         type: 'array',
         default: [],
         required: false
      },
      // The current page: its row is marked and its branch opened.
      activePath: {
         type: 'string',
         default: '',
         required: false
      },
      // Keep `activePath` in step with slice.router and back / forward.
      followRoute: {
         type: 'boolean',
         default: true,
         required: false
      },
      // How much starts open: 'none' (only what activePath, stateKey and each
      // item's `expanded` open) or 'all'.
      expanded: {
         type: 'string',
         default: 'none',
         required: false,
         allowedValues: ['none', 'all']
      },
      // Remember which branches are open, in localStorage under this key.
      stateKey: {
         type: 'string',
         default: null,
         required: false
      },
      // 'single' highlights one row (aria-selected); 'multiple' adds tri-state
      // checkboxes (a parent is checked, unchecked or mixed from its children).
      selection: {
         type: 'string',
         default: 'none',
         required: false,
         allowedValues: ['none', 'single', 'multiple']
      },
      // Keys of the selected (or checked) nodes.
      selected: {
         type: 'array',
         default: [],
         required: false
      },
      // A search box over the tree. `filter` sets the query from code.
      searchable: {
         type: 'boolean',
         default: false,
         required: false
      },
      filter: {
         type: 'string',
         default: '',
         required: false
      },
      searchPlaceholder: {
         type: 'string',
         default: null,
         required: false
      },
      emptyMessage: {
         type: 'string',
         default: null,
         required: false
      },
      // Rows are dragged to reorder them or move them into another branch.
      draggable: {
         type: 'boolean',
         default: false,
         required: false
      },
      // `(item) => DropDown items` for a ⋯ menu on every row (or `actions` per item).
      nodeActions: {
         type: 'function',
         default: null,
         required: false
      },
      // Click on a row with a `path` → slice.router.navigate(path).
      navigate: {
         type: 'boolean',
         default: false,
         required: false
      },
      // Only render the rows in view. Rows have one height (from `size`, or `rowHeight`).
      virtual: {
         type: 'boolean',
         default: false,
         required: false
      },
      rowHeight: {
         type: 'number',
         default: null,
         required: false
      },
      // The tree scrolls past this height (any CSS length).
      maxHeight: {
         type: 'string',
         default: null,
         required: false
      },
      size: {
         type: 'string',
         default: 'md',
         required: false,
         allowedValues: ['sm', 'md', 'lg']
      },
      // How the current page is marked.
      indicator: {
         type: 'string',
         default: 'tint',
         required: false,
         allowedValues: ['tint', 'pill', 'bar']
      },
      // Vertical lines down each open branch.
      guides: {
         type: 'boolean',
         default: true,
         required: false
      },
      ariaLabel: {
         type: 'string',
         default: null,
         required: false
      },
      // Per-instance overrides of any built-in text (see TEXTS).
      texts: {
         type: 'object',
         default: null,
         required: false
      },
      // `(row, event)`: a row was activated (click / Enter). `row.item` is your
      // object, `row.path` and `row.value` its path and label.
      onClick: {
         type: 'function',
         default: null
      },
      onClickCallback: {
         type: 'function',
         default: null
      },
      // `(item, expanded)` when a branch opens or closes.
      onToggle: {
         type: 'function',
         default: null
      },
      // `(item | null)` in 'single' selection.
      onSelect: {
         type: 'function',
         default: null
      },
      // `(keys, items)` in 'multiple' selection.
      onSelectionChange: {
         type: 'function',
         default: null
      },
      // `({ item, target, position: 'before' | 'after' | 'inside' })` before a
      // drop. Return false (or a Promise of false) to refuse it.
      onMove: {
         type: 'function',
         default: null
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);

      this.$search = this.querySelector('.slice_treeview_search');
      this.$searchInput = this.querySelector('.slice_treeview_search_input');
      this.$treeView = this.querySelector('.simple_treeview');
      this.$empty = this.querySelector('.slice_treeview_empty');

      this._uid = `slice-tree-${++_sliceTreeViewSeq}`;
      this._items = [];
      this._roots = [];
      this._nodes = new Map();          // key → node
      this._byItem = new WeakMap();     // item object → node
      this._expandedKeys = new Set();
      this._checked = new Set();
      this._selectedKey = null;
      this._activeKey = null;
      this._focusKey = null;
      this._rows = new Map();           // key → row element
      this._visible = [];
      this._query = '';
      this._inited = false;
      this._renderToken = 0;
      this._renderQueued = null;
      this._typeahead = '';
      this._typeaheadTimer = 0;
      this._drag = null;
      this._dragTimer = 0;
      this._scrollFrame = 0;
      this._searchTimer = 0;
      this._rowSeq = 0;
      this._pendingSelected = null;
      this._texts = {};

      for (const name of [
         '_handleClick', '_handleKeydown', '_handleFocusIn', '_handleContextMenu', '_handleScroll',
         '_handleSearchInput', '_handleRoute', '_handleDragStart', '_handleDragOver',
         '_handleDragLeave', '_handleDrop', '_handleDragEnd'
      ]) {
         this[name] = this[name].bind(this);
      }
      this.$treeView.addEventListener('click', this._handleClick);
      this.$treeView.addEventListener('keydown', this._handleKeydown);
      this.$treeView.addEventListener('focusin', this._handleFocusIn);
      this.$treeView.addEventListener('contextmenu', this._handleContextMenu);
      this.$treeView.addEventListener('scroll', this._handleScroll, { passive: true });
      this.$treeView.addEventListener('dragstart', this._handleDragStart);
      this.$treeView.addEventListener('dragover', this._handleDragOver);
      this.$treeView.addEventListener('dragleave', this._handleDragLeave);
      this.$treeView.addEventListener('drop', this._handleDrop);
      this.$treeView.addEventListener('dragend', this._handleDragEnd);
      this.$searchInput.addEventListener('input', this._handleSearchInput);

      slice.controller.setComponentProps(this, props);
   }

   async init() {
      for (const name of ['size', 'indicator', 'selection', 'expanded']) {
         if (this[`_${name}`] === undefined) this[name] = TreeView.props[name].default;
      }
      if (this._guides === undefined) this.guides = true;
      if (this._followRoute === undefined) this._followRoute = true;
      if (this._searchPlaceholder === undefined) this.searchPlaceholder = TreeView.props.searchPlaceholder.default;
      if (this._emptyMessage === undefined) this.emptyMessage = TreeView.props.emptyMessage.default;

      // Raw window listeners: removed in beforeDestroy (§9).
      window.addEventListener('router:change', this._handleRoute);
      window.addEventListener('popstate', this._handleRoute);
      // The router announces navigations on slice.events when the app enables
      // the event bus, and on window otherwise (never both): listen to both.
      if (slice.events && typeof slice.events.subscribe === 'function') {
         this._routeSubscription = slice.events.subscribe('router:change', this._handleRoute, { component: this });
      }

      this._inited = true;
      this._buildModel();
      if (this._pendingSelected) {
         this._applySelected(this._pendingSelected);
         this._pendingSelected = null;
      }
      this._restoreExpanded();
      if (this._activePath) this._activateByPath(this._activePath, true);
      // A language change repaints the search box, the empty message and the
      // rows' menus. The open branches, the selection and the focused row stay
      // as they are.
      slice.translator?.watch?.(this, () => {
         this._retranslate();
      });
      await this._render();
   }

   // A cached MultiRoute brought the view back: follow the URL again.
   update() {
      if (this._followRoute) this._handleRoute();
   }

   beforeDestroy() {
      window.removeEventListener('router:change', this._handleRoute);
      window.removeEventListener('popstate', this._handleRoute);
      if (this._routeSubscription && typeof slice.events?.unsubscribe === 'function') {
         slice.events.unsubscribe('router:change', this._routeSubscription);
         this._routeSubscription = null;
      }
      clearTimeout(this._typeaheadTimer);
      clearTimeout(this._dragTimer);
      clearTimeout(this._searchTimer);
      if (this._scrollFrame) cancelAnimationFrame(this._scrollFrame);
      for (const row of this._rows.values()) this._releaseRow(row);
      this._rows.clear();
   }

   // ------------------------------------------------------------------ props

   get items() { return this._items; }
   set items(values) {
      this._items = Array.isArray(values) ? values : [];
      if (!this._inited) return;
      this._buildModel();
      if (this._activePath) this._activateByPath(this._activePath, false);
      this._render();
   }

   get activePath() { return this._activePath; }
   set activePath(value) {
      this._activePath = value ? String(value) : '';
      if (this._inited) {
         this._activateByPath(this._activePath, true);
         this._render();
      }
   }

   get followRoute() { return this._followRoute !== false; }
   set followRoute(value) { this._followRoute = value !== false; }

   get expanded() { return this._expanded; }
   set expanded(value) {
      this._expanded = this._pick('expanded', value);
      if (this._inited && this._expanded === 'all') this.expandAll();
   }

   get stateKey() { return this._stateKey; }
   set stateKey(value) { this._stateKey = value ? String(value) : null; }

   get selection() { return this._selection; }
   set selection(value) {
      this._selection = this._pick('selection', value);
      if (this._selection === 'multiple') this.$treeView.setAttribute('aria-multiselectable', 'true');
      else this.$treeView.removeAttribute('aria-multiselectable');
      this.classList.toggle('slice_treeview--checks', this._selection === 'multiple');
      if (this._inited) this._render();
   }

   get selected() {
      if (this._selection === 'single') return this._selectedKey === null ? [] : [this._selectedKey];
      return [...this._checked];
   }
   set selected(value) {
      const keys = (Array.isArray(value) ? value : []).map(String);
      // Before init the selection mode may not be known yet: applied in init().
      if (!this._inited) {
         this._pendingSelected = keys;
         return;
      }
      this._applySelected(keys);
      this._render();
   }

   _applySelected(keys) {
      if (this._selection === 'single') {
         this._selectedKey = keys.find((key) => this._nodes.has(key)) ?? null;
      } else {
         this._checked = new Set(keys.filter((key) => this._nodes.has(key)));
         this._normalizeChecks();
      }
   }

   get searchable() { return this._searchable === true; }
   set searchable(value) {
      this._searchable = value === true;
      this.$search.hidden = !this._searchable;
   }

   get filter() { return this._query; }
   set filter(value) {
      this._query = value ? String(value) : '';
      if (this.$searchInput.value !== this._query) this.$searchInput.value = this._query;
      if (this._inited) this._render();
   }

   get searchPlaceholder() { return this._searchPlaceholder; }
   set searchPlaceholder(value) {
      // Only the override is kept: no prop means the built-in (translated) text.
      this._searchPlaceholder = value === null || value === undefined ? null : String(value);
      this.$searchInput.placeholder = this._searchPlaceholder ?? this._t('searchPlaceholder');
      this.$searchInput.setAttribute('aria-label', this._searchPlaceholder || this._t('search'));
   }

   get emptyMessage() { return this._emptyMessage; }
   set emptyMessage(value) {
      this._emptyMessage = value === null || value === undefined ? null : String(value);
      this.$empty.textContent = this._emptyMessage ?? this._t('emptyMessage');
   }

   get texts() { return this._texts; }
   set texts(value) {
      // Only the overrides are kept: every key left out falls back to the
      // translator (or to the English default).
      this._texts = value && typeof value === 'object' ? { ...value } : {};
      if (this._inited) this._retranslate();
   }

   get draggable() { return this._draggable === true; }
   set draggable(value) {
      this._draggable = value === true;
      if (this._inited) this._render();
   }

   get nodeActions() { return this._nodeActions; }
   set nodeActions(value) {
      this._nodeActions = typeof value === 'function' ? value : null;
      if (this._inited) this._render();
   }

   get navigate() { return this._navigate === true; }
   set navigate(value) { this._navigate = value === true; }

   get virtual() { return this._virtual === true; }
   set virtual(value) {
      this._virtual = value === true;
      this.classList.toggle('slice_treeview--virtual', this._virtual);
      if (this._inited) this._render();
   }

   get rowHeight() { return this._rowHeight; }
   set rowHeight(value) {
      const number = Number(value);
      this._rowHeight = Number.isFinite(number) && number > 0 ? number : null;
      this._applyRowHeight();
   }

   get maxHeight() { return this._maxHeight; }
   set maxHeight(value) {
      this._maxHeight = value ? String(value) : null;
      this.$treeView.style.maxHeight = this._maxHeight ?? '';
   }

   get size() { return this._size; }
   set size(value) {
      this._size = this._pick('size', value);
      this.dataset.size = this._size;
      this._applyRowHeight();
   }

   get indicator() { return this._indicator; }
   set indicator(value) {
      this._indicator = this._pick('indicator', value);
      this.dataset.indicator = this._indicator;
   }

   get guides() { return this._guides !== false; }
   set guides(value) {
      this._guides = value !== false;
      this.classList.toggle('slice_treeview--guides', this._guides);
   }

   get ariaLabel() { return this._ariaLabel; }
   set ariaLabel(value) {
      this._ariaLabel = value ? String(value) : null;
      if (this._ariaLabel) this.$treeView.setAttribute('aria-label', this._ariaLabel);
      else this.$treeView.removeAttribute('aria-label');
   }

   get onClick() { return this._onClick; }
   set onClick(value) { if (typeof value === 'function') this._onClick = value; }

   // Deprecated alias for onClick.
   get onClickCallback() { return this._onClick; }
   set onClickCallback(value) {
      if (typeof value === 'function') {
         this._onClick ??= value;
         deprecate('onClickCallback', 'onClick');
      }
   }

   get onToggle() { return this._onToggle; }
   set onToggle(value) { this._onToggle = typeof value === 'function' ? value : null; }
   get onSelect() { return this._onSelect; }
   set onSelect(value) { this._onSelect = typeof value === 'function' ? value : null; }
   get onSelectionChange() { return this._onSelectionChange; }
   set onSelectionChange(value) { this._onSelectionChange = typeof value === 'function' ? value : null; }
   get onMove() { return this._onMove; }
   set onMove(value) { this._onMove = typeof value === 'function' ? value : null; }

   _pick(name, value) {
      const { allowedValues, default: fallback } = TreeView.props[name];
      return allowedValues.includes(value) ? value : fallback;
   }

   _applyRowHeight() {
      this.style.setProperty('--tv-row-height', `${this._effectiveRowHeight()}px`);
   }

   _effectiveRowHeight() {
      return this._rowHeight ?? ROW_HEIGHTS[this._size] ?? ROW_HEIGHTS.md;
   }

   // ------------------------------------------------------------- public API

   /** Open a branch (by key, item or path). Loads a lazy branch. */
   async expand(target) { await this._setExpanded(this._resolve(target), true); }
   /** Close a branch. */
   async collapse(target) { await this._setExpanded(this._resolve(target), false); }
   /** Open or close a branch. */
   async toggle(target) {
      const node = this._resolve(target);
      if (node) await this._setExpanded(node, !this._expandedKeys.has(node.key));
   }

   /** Open every loaded branch (lazy ones stay closed until opened by hand). */
   expandAll() {
      for (const node of this._nodes.values()) if (node.children && node.children.length > 0) this._expandedKeys.add(node.key);
      this._saveExpanded();
      return this._render();
   }

   collapseAll() {
      this._expandedKeys.clear();
      this._saveExpanded();
      return this._render();
   }

   /** Move keyboard focus to a node, opening its ancestors. */
   focusNode(target) {
      const node = this._resolve(target);
      if (!node) return;
      this._openAncestors(node);
      this._focusKey = node.key;
      this._render().then(() => this._focusRow(node.key));
   }

   /** The item objects of the selected (or checked) nodes. */
   getSelectedItems() {
      return this.selected.map((key) => this._nodes.get(key)?.item).filter(Boolean);
   }

   clearSelection() {
      this._selectedKey = null;
      this._checked.clear();
      this._render();
      this._emitSelection();
   }

   /** Load a lazy branch again. */
   async reload(target) {
      const node = this._resolve(target);
      if (!node || !node.lazy) return;
      node.loaded = false;
      node.children = null;
      if (this._expandedKeys.has(node.key)) await this._load(node);
      await this._render();
   }

   /** The key a node gets (handy for `selected`, `expand()`...). */
   keyOf(item) {
      return this._byItem.get(item)?.key ?? null;
   }

   // Old API.
   openAllBranches() { return this.expandAll(); }

   activateByPath(path) {
      this._activateByPath(path, true);
      return this._render();
   }

   setActiveTreeItem(target) {
      const node = this._resolve(target);
      if (!node) return;
      this._activeKey = node.key;
      this._render();
   }

   async setTreeItems(items) {
      this.items = items;
      await this._render();
   }

   async setTreeItem(item) {
      this.items = [...this._items, item];
      await this._render();
   }

   // ------------------------------------------------------------------ model

   _buildModel() {
      const nodes = new Map();
      const byItem = new WeakMap();
      this._roots = this._buildNodes(this._items, null, 0, nodes, byItem);
      // Rows of nodes that are gone are released.
      for (const [key, row] of this._rows) {
         if (!nodes.has(key)) {
            this._releaseRow(row);
            this._rows.delete(key);
         }
      }
      this._nodes = nodes;
      this._byItem = byItem;
      for (const key of [...this._checked]) if (!nodes.has(key)) this._checked.delete(key);
      if (this._selectedKey !== null && !nodes.has(this._selectedKey)) this._selectedKey = null;
      if (this._expanded === 'all') {
         for (const node of nodes.values()) if (node.children && node.children.length > 0) this._expandedKeys.add(node.key);
      }
      if (this._selection === 'multiple') this._normalizeChecks();
   }

   // Items → nodes, recursively. Shared by the whole-tree build and by a lazy
   // branch loading its children.
   _buildNodes(items, parent, level, nodes, byItem) {
      const out = [];
      const seen = new Map();
      for (const item of Array.isArray(items) ? items : []) {
         if (!item || typeof item !== 'object' || item.hidden === true) continue;
         const label = String(item.label ?? item.value ?? item.text ?? '');
         let key = item.id ?? item.path ?? null;
         if (key === null || key === undefined || key === '') {
            const base = `${parent ? parent.key : ''}/${label}`;
            const count = seen.get(base) ?? 0;
            seen.set(base, count + 1);
            key = count === 0 ? base : `${base}#${count}`;
         }
         key = String(key);
         const previous = this._nodes.get(key);
         const source = item.items ?? item.children;
         const node = {
            key,
            item,
            label,
            path: item.path ? String(item.path) : '',
            parent,
            level,
            lazy: typeof source === 'function' ? source : null,
            children: null,
            loaded: false,
            loading: false
         };
         if (Array.isArray(source)) {
            node.children = this._buildNodes(source, node, level + 1, nodes, byItem);
            node.loaded = true;
         } else if (node.lazy && previous?.lazy === node.lazy && previous.loaded) {
            // A lazy branch keeps what it already loaded across a rebuild.
            node.children = previous.children;
            node.loaded = true;
            for (const child of node.children) this._reparent(child, node, level + 1, nodes, byItem);
         }
         if (item.expanded === true && !previous) this._expandedKeys.add(key);
         nodes.set(key, node);
         byItem.set(item, node);
         out.push(node);
      }
      return out;
   }

   _reparent(node, parent, level, nodes, byItem) {
      node.parent = parent;
      node.level = level;
      nodes.set(node.key, node);
      byItem.set(node.item, node);
      for (const child of node.children ?? []) this._reparent(child, node, level + 1, nodes, byItem);
   }

   _resolve(target) {
      if (target === null || target === undefined) return null;
      if (typeof target === 'string') {
         return this._nodes.get(target) ?? [...this._nodes.values()].find((node) => node.path === target) ?? null;
      }
      if (target instanceof Element) {
         const key = target.dataset?.key ?? target.closest?.('[data-key]')?.dataset.key;
         if (key) return this._nodes.get(key) ?? null;
         if (target.path) return this._resolve(String(target.path));
         return null;
      }
      if (typeof target === 'object') return this._byItem.get(target) ?? (target.key ? this._nodes.get(target.key) : null) ?? null;
      return null;
   }

   _hasChildren(node) {
      return !!node.lazy || (Array.isArray(node.children) && node.children.length > 0);
   }

   _openAncestors(node) {
      for (let parent = node.parent; parent; parent = parent.parent) this._expandedKeys.add(parent.key);
   }

   _activateByPath(path, open) {
      const node = path ? [...this._nodes.values()].find((candidate) => candidate.path === path) : null;
      this._activeKey = node ? node.key : null;
      if (node && open) {
         this._openAncestors(node);
         this._saveExpanded();
      }
   }

   async _setExpanded(node, open) {
      if (!node || !this._hasChildren(node)) return;
      if (open === this._expandedKeys.has(node.key) && (!open || node.loaded)) return;
      if (open) this._expandedKeys.add(node.key);
      else this._expandedKeys.delete(node.key);
      this._saveExpanded();
      if (this._onToggle) this._onToggle(node.item, open);
      if (open) this._animateNext = true;
      else await this._animateCollapse(node);
      if (open && node.lazy && !node.loaded) {
         const loading = this._load(node);
         await this._render();
         await loading;
      }
      await this._render();
   }

   async _load(node) {
      if (node.loading) return node.loading;
      const run = (async () => {
         let list = [];
         try {
            list = await node.lazy(node.item);
         } catch (error) {
            console.error('TreeView: loading a branch failed', error);
         }
         node.children = this._buildNodes(Array.isArray(list) ? list : [], node, node.level + 1, this._nodes, this._byItem);
         node.loaded = true;
         node.loading = false;
         // A checked parent checks what it just loaded.
         if (this._selection === 'multiple' && this._checked.has(node.key)) {
            this._walk(node.children, (child) => this._checked.add(child.key));
         }
      })();
      node.loading = run;
      return run;
   }

   _walk(nodes, visit) {
      for (const node of nodes ?? []) {
         visit(node);
         if (node.children) this._walk(node.children, visit);
      }
   }

   // ------------------------------------------------------------ persistence

   _storageKey() {
      return this._stateKey ? `slice-tree:${this._stateKey}` : null;
   }

   _restoreExpanded() {
      const key = this._storageKey();
      if (!key) return;
      try {
         const saved = JSON.parse(localStorage.getItem(key) || 'null');
         if (Array.isArray(saved)) for (const k of saved) this._expandedKeys.add(String(k));
      } catch {
         /* a corrupt entry is ignored */
      }
   }

   _saveExpanded() {
      const key = this._storageKey();
      if (!key) return;
      try {
         localStorage.setItem(key, JSON.stringify([...this._expandedKeys]));
      } catch {
         /* storage full or blocked: not worth failing over */
      }
   }

   // -------------------------------------------------------------- checking

   // A parent is checked when every child is; mixed when some are.
   _checkState(node) {
      if (!node.children || node.children.length === 0 || !node.loaded) return this._checked.has(node.key);
      let all = true;
      let some = false;
      for (const child of node.children) {
         const state = this._checkState(child);
         if (state === true) some = true;
         else if (state === 'mixed') {
            some = true;
            all = false;
         } else all = false;
      }
      if (all) return true;
      return some ? 'mixed' : false;
   }

   // After `selected` is set from outside: a checked parent checks its
   // descendants, and parents follow their children.
   _normalizeChecks() {
      for (const key of [...this._checked]) {
         const node = this._nodes.get(key);
         if (node?.children) this._walk(node.children, (child) => this._checked.add(child.key));
      }
      this._syncParents();
   }

   _syncParents() {
      const visit = (nodes) => {
         for (const node of nodes) {
            if (node.children && node.loaded && node.children.length > 0) {
               visit(node.children);
               if (this._checkState(node) === true) this._checked.add(node.key);
               else this._checked.delete(node.key);
            }
         }
      };
      visit(this._roots);
   }

   _toggleCheck(node) {
      if (this._isDisabled(node)) return;
      const next = this._checkState(node) !== true;
      const apply = (target) => {
         if (next) this._checked.add(target.key);
         else this._checked.delete(target.key);
      };
      apply(node);
      if (node.children) this._walk(node.children, (child) => { if (!this._isDisabled(child)) apply(child); });
      this._syncParents();
      this._render();
      this._emitSelection();
   }

   _select(node) {
      if (this._isDisabled(node)) return;
      this._selectedKey = node.key;
      this._render();
      if (this._onSelect) this._onSelect(node.item);
   }

   _emitSelection() {
      if (!this._onSelectionChange) return;
      const keys = this.selected;
      this._onSelectionChange(keys, keys.map((key) => this._nodes.get(key)?.item).filter(Boolean));
   }

   _isDisabled(node) {
      for (let current = node; current; current = current.parent) if (current.item.disabled === true) return true;
      return false;
   }

   // ---------------------------------------------------------------- render

   _t(key, values = {}) {
      return fill(this._texts[key] ?? t(key), values);
   }

   /**
    * Repaint everything that carries a built-in word: the search box, the empty
    * message and the action menu of every row.
    *
    * Rows are cached by content, so they are dropped and rebuilt. What has to
    * survive lives on the component, not on a row: the open branches and the
    * selection are untouched, and the focused row gets its focus back without
    * being scrolled anywhere.
    */
   _retranslate() {
      this.$searchInput.placeholder = this._searchPlaceholder ?? this._t('searchPlaceholder');
      this.$searchInput.setAttribute('aria-label', this._searchPlaceholder || this._t('search'));
      this.$empty.textContent = this._emptyMessage ?? this._t('emptyMessage');
      const focused = this.$treeView.contains(document.activeElement);
      for (const row of this._rows.values()) this._releaseRow(row);
      this._rows.clear();
      this._render().then(() => {
         if (focused) this._rows.get(this._focusKey)?.focus({ preventScroll: true });
      });
   }

   // The rows to show, in order: open branches only, or, while filtering,
   // every match and its ancestors (opened for the occasion).
   _computeVisible() {
      const query = fold(this._query.trim());
      const out = [];
      let matches = null;
      if (query) {
         matches = new Set();
         const mark = (node) => {
            let keep = fold(node.label).includes(query);
            if (node.children) for (const child of node.children) if (mark(child)) keep = true;
            if (keep) matches.add(node.key);
            return keep;
         };
         for (const root of this._roots) mark(root);
      }
      const walk = (nodes) => {
         const shown = matches ? nodes.filter((node) => matches.has(node.key)) : nodes;
         shown.forEach((node, index) => {
            const open = matches ? !!node.children && node.children.some((child) => matches.has(child.key)) : this._expandedKeys.has(node.key);
            out.push({ node, posinset: index + 1, setsize: shown.length, open });
            if (open) {
               if (node.loading && !node.loaded) out.push({ loading: true, node, level: node.level + 1 });
               else if (node.children) walk(node.children);
            }
         });
      };
      walk(this._roots);
      return { list: out, query };
   }

   async _render() {
      if (!this._inited) return;
      // Coalesce: one render per frame-ish burst, the newest state wins.
      const token = ++this._renderToken;
      const { list, query } = this._computeVisible();
      this._visible = list;
      this._lastQuery = query;
      if (this._focusKey === null || !list.some((entry) => !entry.loading && entry.node.key === this._focusKey)) {
         const fallback = list.find((entry) => !entry.loading && entry.node.key === this._activeKey) ??
            list.find((entry) => !entry.loading && entry.node.key === this._selectedKey) ??
            list.find((entry) => !entry.loading);
         this._focusKey = fallback ? fallback.node.key : null;
      }

      let slice0 = 0;
      let slice1 = list.length;
      const height = this._effectiveRowHeight();
      if (this._virtual) {
         const viewport = this.$treeView.clientHeight || 400;
         const top = this.$treeView.scrollTop;
         slice0 = Math.max(0, Math.floor(top / height) - 8);
         slice1 = Math.min(list.length, Math.ceil((top + viewport) / height) + 8);
      }

      const wanted = [];
      const keep = new Set();
      for (let i = slice0; i < slice1; i++) {
         const entry = list[i];
         if (entry.loading) {
            wanted.push(this._loadingRow(entry));
            continue;
         }
         let row = this._rows.get(entry.node.key);
         const signature = this._signature(entry.node, query);
         if (!row || row._signature !== signature) {
            if (row) this._releaseRow(row);
            row = await this._buildRow(entry.node, query);
            if (token !== this._renderToken) return;
            row._signature = signature;
            this._rows.set(entry.node.key, row);
         }
         this._syncRow(row, entry);
         keep.add(entry.node.key);
         wanted.push(row);
      }
      if (token !== this._renderToken) return;

      if (this._virtual) {
         // Rows out of view are released: a 20,000-node tree keeps ~40 rows.
         for (const [key, row] of this._rows) {
            if (!keep.has(key)) {
               this._releaseRow(row);
               this._rows.delete(key);
            }
         }
         const before = this._spacer('top', slice0 * height);
         const after = this._spacer('bottom', (list.length - slice1) * height);
         wanted.unshift(before);
         wanted.push(after);
      }

      const hadFocus = this.$treeView.contains(document.activeElement);
      // Rows a branch just revealed unfold, one after the other.
      const animate = this._animateNext && !this._virtual && this._motionOk();
      this._animateNext = false;
      if (animate) {
         let index = 0;
         for (const node of wanted) {
            if (node.isConnected || !node.classList?.contains('slice_treeview_row')) continue;
            node.style.setProperty('--tv-enter-index', String(Math.min(index++, 12)));
            node.classList.add('is-entering');
            node.addEventListener('animationend', () => node.classList.remove('is-entering'), { once: true });
         }
      }
      this._place(wanted);
      this.$empty.hidden = list.length > 0 || (this._items.length === 0 && !query);
      if (hadFocus && !this.$treeView.contains(document.activeElement)) this._focusRow(this._focusKey);
   }

   // Insert / move only what changed, so the focused row is never detached.
   _place(wanted) {
      const container = this.$treeView;
      let cursor = container.firstChild;
      for (const node of wanted) {
         if (node === cursor) {
            cursor = cursor.nextSibling;
            continue;
         }
         container.insertBefore(node, cursor);
      }
      while (cursor) {
         const next = cursor.nextSibling;
         cursor.remove();
         cursor = next;
      }
   }

   _spacer(side, height) {
      const key = `_${side}Spacer`;
      if (!this[key]) {
         this[key] = document.createElement('div');
         this[key].className = 'slice_treeview_spacer';
         this[key].setAttribute('role', 'none');
      }
      this[key].style.height = `${height}px`;
      return this[key];
   }

   _signature(node, query) {
      const item = node.item;
      const actions = !!(item.actions || this._nodeActions);
      return [node.label, item.icon ?? '', item.badge ?? '', item.description ?? '', node.level,
         this._hasChildren(node), query && fold(node.label).includes(query) ? query : '',
         actions, this._draggable && !this._isDisabled(node), this._selection === 'multiple'].join('\u0001');
   }

   async _buildRow(node, query) {
      const item = node.item;
      const row = document.createElement('div');
      row.className = 'slice_treeview_row';
      row.id = `${this._uid}-r${++this._rowSeq}`;
      row.setAttribute('role', 'treeitem');
      row.dataset.key = node.key;
      // What onClick receives: the row, carrying the node's data (the old
      // TreeItem exposed `path` and `value` the same way).
      row.item = item;
      row.path = node.path;
      row.value = node.label;
      row.key = node.key;

      const content = document.createElement('div');
      content.className = 'slice_treeview_content';

      const toggle = document.createElement('span');
      toggle.className = 'slice_treeview_toggle';
      toggle.setAttribute('aria-hidden', 'true');
      if (!this._hasChildren(node)) toggle.classList.add('slice_treeview_toggle--leaf');
      content.appendChild(toggle);

      if (this._selection === 'multiple') {
         const check = document.createElement('span');
         check.className = 'slice_treeview_check';
         check.setAttribute('aria-hidden', 'true');
         content.appendChild(check);
      }

      if (item.icon) {
         const slot = document.createElement('span');
         slot.className = 'slice_treeview_icon';
         slot.setAttribute('aria-hidden', 'true');
         if (item.icon instanceof Node) slot.appendChild(item.icon.cloneNode(true));
         else {
            try {
               slot.appendChild(await slice.build('Icon', { name: String(item.icon), size: 'small' }));
            } catch {
               /* unknown icon: leave the slot empty */
            }
         }
         content.appendChild(slot);
      }

      const text = document.createElement('span');
      text.className = 'slice_treeview_text';
      const label = document.createElement('span');
      label.className = 'slice_treeview_label';
      // The row is named by its label only, not by its badge or ⋯ button.
      label.id = `${row.id}-label`;
      row.setAttribute('aria-labelledby', label.id);
      this._highlight(label, node.label, query);
      text.appendChild(label);
      if (item.description) {
         const description = document.createElement('span');
         description.className = 'slice_treeview_description';
         description.id = `${row.id}-description`;
         description.textContent = String(item.description);
         row.setAttribute('aria-describedby', description.id);
         text.appendChild(description);
      }
      content.appendChild(text);

      if (item.badge !== undefined && item.badge !== null && item.badge !== '') {
         const badge = document.createElement('span');
         badge.className = 'slice_treeview_badge';
         badge.textContent = String(item.badge);
         content.appendChild(badge);
      }

      const actions = item.actions ?? (this._nodeActions ? this._nodeActions(item) : null);
      if (Array.isArray(actions) && actions.length > 0) {
         const holder = document.createElement('span');
         holder.className = 'slice_treeview_actions';
         const menu = await slice.build('DropDown', {
            icon: 'dots-horizontal',
            ariaLabel: this._t('actionsFor', { label: node.label }),
            variant: 'ghost',
            size: 'sm',
            items: actions,
            placement: 'bottom-end'
         });
         // The row is the tab stop; the menu opens with Shift+F10 / right click.
         menu.querySelector('.slice_dropdown')?.setAttribute('tabindex', '-1');
         holder.appendChild(menu);
         content.appendChild(holder);
         row._menu = menu;
      }

      if (this._draggable && !this._isDisabled(node)) row.draggable = true;
      row.appendChild(content);
      return row;
   }

   _highlight(target, text, query) {
      if (!query) {
         target.textContent = text;
         return;
      }
      // Map folded positions back onto the original characters.
      let folded = '';
      const origin = [];
      for (let i = 0; i < text.length; i++) {
         const piece = fold(text[i]);
         for (let j = 0; j < piece.length; j++) origin.push(i);
         folded += piece;
      }
      const at = folded.indexOf(query);
      if (at === -1) {
         target.textContent = text;
         return;
      }
      const start = origin[at];
      const end = (origin[at + query.length - 1] ?? text.length - 1) + 1;
      const mark = document.createElement('mark');
      mark.textContent = text.slice(start, end);
      target.replaceChildren(document.createTextNode(text.slice(0, start)), mark, document.createTextNode(text.slice(end)));
   }

   _motionOk() {
      return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
   }

   // Closing a branch: its visible descendants fold away first, then the
   // render takes them out. The chevron turns at once.
   async _animateCollapse(node) {
      if (this._virtual || !this._motionOk()) return;
      const row = this._rows.get(node.key);
      if (row) row.setAttribute('aria-expanded', 'false');
      const leaving = [];
      for (const entry of this._visible) {
         if (entry.loading) continue;
         for (let parent = entry.node.parent; parent; parent = parent.parent) {
            if (parent === node) {
               const descendant = this._rows.get(entry.node.key);
               if (descendant?.isConnected) leaving.push(descendant);
               break;
            }
         }
      }
      if (leaving.length === 0) return;
      leaving.forEach((element, index) => {
         element.style.setProperty('--tv-leave-index', String(Math.min(leaving.length - 1 - index, 8)));
         element.classList.add('is-leaving');
      });
      await new Promise((resolve) => setTimeout(resolve, 190 + Math.min(leaving.length, 9) * 12));
   }

   _syncRow(row, entry) {
      row.classList.remove('is-leaving');
      const node = entry.node;
      const level = node.level + 1;
      row.setAttribute('aria-level', String(level));
      row.setAttribute('aria-setsize', String(entry.setsize));
      row.setAttribute('aria-posinset', String(entry.posinset));
      row.style.setProperty('--tv-level', String(node.level));
      row.tabIndex = node.key === this._focusKey ? 0 : -1;
      const branch = this._hasChildren(node);
      row.classList.toggle('is-branch', branch);
      if (branch) row.setAttribute('aria-expanded', entry.open ? 'true' : 'false');
      else row.removeAttribute('aria-expanded');
      const active = node.key === this._activeKey;
      row.classList.toggle('is-active', active);
      if (active) row.setAttribute('aria-current', 'page');
      else row.removeAttribute('aria-current');
      if (this._selection === 'single') row.setAttribute('aria-selected', node.key === this._selectedKey ? 'true' : 'false');
      else row.removeAttribute('aria-selected');
      if (this._selection === 'multiple') {
         const state = this._checkState(node);
         row.setAttribute('aria-checked', state === 'mixed' ? 'mixed' : state ? 'true' : 'false');
      } else row.removeAttribute('aria-checked');
      const disabled = this._isDisabled(node);
      if (disabled) row.setAttribute('aria-disabled', 'true');
      else row.removeAttribute('aria-disabled');
      row.classList.toggle('is-loading', !!node.loading && !node.loaded);
   }

   _loadingRow(entry) {
      const row = document.createElement('div');
      row.className = 'slice_treeview_row slice_treeview_row--loading';
      row.setAttribute('role', 'none');
      row.style.setProperty('--tv-level', String(entry.level));
      const content = document.createElement('div');
      content.className = 'slice_treeview_content';
      const toggle = document.createElement('span');
      toggle.className = 'slice_treeview_toggle slice_treeview_toggle--leaf';
      const spinner = document.createElement('span');
      spinner.className = 'slice_treeview_spinner';
      spinner.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'slice_treeview_label';
      label.textContent = this._t('loading');
      content.append(toggle, spinner, label);
      row.appendChild(content);
      return row;
   }

   _releaseRow(row) {
      slice.controller.destroyByContainer(row);
      if (row._menu?.sliceId) slice.controller.destroyComponent(row._menu);
      row._menu = null;
      row.remove();
   }

   _focusRow(key) {
      if (key === null || key === undefined) return;
      const row = this._rows.get(key);
      if (row && row.isConnected) {
         row.focus({ preventScroll: true });
         this._scrollIntoView(key);
      }
   }

   _scrollIntoView(key) {
      const index = this._visible.findIndex((entry) => !entry.loading && entry.node.key === key);
      if (index === -1) return;
      if (this._virtual) {
         const height = this._effectiveRowHeight();
         const top = index * height;
         const view = this.$treeView;
         if (top < view.scrollTop) view.scrollTop = top;
         else if (top + height > view.scrollTop + view.clientHeight) view.scrollTop = top + height - view.clientHeight;
         return;
      }
      this._rows.get(key)?.scrollIntoView({ block: 'nearest' });
   }

   // ---------------------------------------------------------------- events

   _rowOf(target) {
      const row = target?.closest?.('.slice_treeview_row');
      if (!row || !row.dataset.key) return null;
      return row;
   }

   async _handleClick(event) {
      const row = this._rowOf(event.target);
      if (!row) return;
      // The row's ⋯ menu handles its own clicks.
      if (event.target.closest('.slice_treeview_actions')) return;
      const node = this._nodes.get(row.dataset.key);
      if (!node) return;
      this._focusKey = node.key;
      row.tabIndex = 0;
      if (event.target.closest('.slice_treeview_toggle') && this._hasChildren(node)) {
         await this._setExpanded(node, !this._expandedKeys.has(node.key));
         return;
      }
      if (event.target.closest('.slice_treeview_check')) {
         this._toggleCheck(node);
         return;
      }
      await this._activate(node, row, event);
   }

   // Activation (click, Enter). A branch without a path opens and closes; a
   // row with a path becomes the current page. onClick always hears it.
   async _activate(node, row, event) {
      if (this._isDisabled(node)) return;
      const branch = this._hasChildren(node);
      if (branch && !node.path) await this._setExpanded(node, !this._expandedKeys.has(node.key));
      if (this._selection === 'single') this._select(node);
      else if (this._selection === 'multiple' && !branch && !node.path) this._toggleCheck(node);
      if (node.path) {
         this._activeKey = node.key;
         this._render();
      }
      if (this._onClick) await this._onClick(row, event);
      if (this._navigate && node.path && typeof slice?.router?.navigate === 'function') {
         await slice.router.navigate(node.path);
      }
   }

   _handleFocusIn(event) {
      const row = this._rowOf(event.target);
      if (!row || row.dataset.key === this._focusKey) return;
      const previous = this._rows.get(this._focusKey);
      if (previous) previous.tabIndex = -1;
      this._focusKey = row.dataset.key;
      row.tabIndex = 0;
   }

   _handleKeydown(event) {
      const row = this._rowOf(event.target);
      if (!row || event.target !== row) return;
      const node = this._nodes.get(row.dataset.key);
      if (!node) return;
      const rows = this._visible.filter((entry) => !entry.loading);
      const index = rows.findIndex((entry) => entry.node.key === node.key);
      const go = (target) => {
         if (!target) return;
         event.preventDefault();
         this._focusKey = target.key;
         if (this._virtual && !this._rows.has(target.key)) {
            this._scrollIntoView(target.key);
            this._render().then(() => this._focusRow(target.key));
         } else this._focusRow(target.key);
      };
      const open = this._expandedKeys.has(node.key) || (this._lastQuery && rows[index]?.open);
      switch (event.key) {
         case 'ArrowDown': go(rows[index + 1]?.node); break;
         case 'ArrowUp': go(rows[index - 1]?.node); break;
         case 'Home': go(rows[0]?.node); break;
         case 'End': go(rows[rows.length - 1]?.node); break;
         case 'ArrowRight':
            event.preventDefault();
            if (!this._hasChildren(node)) break;
            if (!open) this._setExpanded(node, true);
            else go(rows[index + 1]?.node?.parent === node ? rows[index + 1].node : null);
            break;
         case 'ArrowLeft':
            event.preventDefault();
            if (this._hasChildren(node) && open && !this._lastQuery) this._setExpanded(node, false);
            else go(node.parent);
            break;
         case 'Enter':
            event.preventDefault();
            this._activate(node, row, event);
            break;
         case ' ':
            event.preventDefault();
            if (this._selection === 'multiple') this._toggleCheck(node);
            else if (this._selection === 'single') this._select(node);
            else this._activate(node, row, event);
            break;
         case '*': {
            event.preventDefault();
            const siblings = node.parent ? node.parent.children : this._roots;
            Promise.all(siblings.filter((sibling) => this._hasChildren(sibling)).map((sibling) => this._setExpanded(sibling, true)));
            break;
         }
         case 'ContextMenu':
            event.preventDefault();
            this._openActions(row);
            break;
         case 'F10':
            if (event.shiftKey) {
               event.preventDefault();
               this._openActions(row);
            }
            break;
         default:
            if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
               this._typeTo(event.key, rows, index, go);
            }
      }
   }

   _typeTo(char, rows, index, go) {
      clearTimeout(this._typeaheadTimer);
      this._typeahead += fold(char);
      this._typeaheadTimer = window.setTimeout(() => { this._typeahead = ''; }, 500);
      const query = this._typeahead.length > 1 && new Set(this._typeahead).size === 1 ? this._typeahead[0] : this._typeahead;
      const offset = query.length === 1 ? 1 : 0;
      for (let i = 0; i < rows.length; i++) {
         const candidate = rows[(index + offset + i) % rows.length].node;
         if (fold(candidate.label).startsWith(query)) {
            go(candidate);
            return;
         }
      }
   }

   _openActions(row) {
      const menu = row?._menu;
      if (menu && typeof menu.open === 'function') menu.open({ focus: 'first' });
   }

   _handleContextMenu(event) {
      const row = this._rowOf(event.target);
      if (!row?._menu) return;
      event.preventDefault();
      this._openActions(row);
   }

   _handleScroll() {
      if (!this._virtual || this._scrollFrame) return;
      this._scrollFrame = requestAnimationFrame(() => {
         this._scrollFrame = 0;
         this._render();
      });
   }

   _handleSearchInput() {
      clearTimeout(this._searchTimer);
      this._searchTimer = window.setTimeout(() => { this.filter = this.$searchInput.value; }, 120);
   }

   _handleRoute() {
      if (!this._followRoute || !this._inited) return;
      const path = slice.path;
      const node = [...this._nodes.values()].find((candidate) => candidate.path === path);
      if (!node) return;
      this._activateByPath(path, true);
      this._render();
   }

   // ------------------------------------------------------------ drag & drop

   _handleDragStart(event) {
      if (!this._draggable) return;
      const row = this._rowOf(event.target);
      const node = row && this._nodes.get(row.dataset.key);
      if (!node || this._isDisabled(node)) return;
      this._drag = { key: node.key };
      row.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', node.label);
   }

   _dropPosition(row, event) {
      const box = row.getBoundingClientRect();
      const y = (event.clientY - box.top) / box.height;
      if (y < 0.28) return 'before';
      if (y > 0.72) return 'after';
      return 'inside';
   }

   _canDrop(dragged, target, position) {
      if (!dragged || !target || dragged === target) return false;
      for (let parent = target; parent; parent = parent.parent) if (parent === dragged) return false;
      if (position === 'inside' && target.lazy && !target.loaded) return false;
      return !this._isDisabled(target);
   }

   _handleDragOver(event) {
      if (!this._drag) return;
      const row = this._rowOf(event.target);
      const target = row && this._nodes.get(row.dataset.key);
      const dragged = this._nodes.get(this._drag.key);
      this._clearDropMarks();
      if (!target) return;
      const position = this._dropPosition(row, event);
      if (!this._canDrop(dragged, target, position)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      row.classList.add(`is-drop-${position}`);
      this._drag.target = target.key;
      this._drag.position = position;
      // Hovering a closed branch opens it, to drop deeper.
      if (position === 'inside' && this._hasChildren(target) && !this._expandedKeys.has(target.key)) {
         if (this._drag.opening !== target.key) {
            clearTimeout(this._dragTimer);
            this._drag.opening = target.key;
            this._dragTimer = window.setTimeout(() => this._setExpanded(target, true), DRAG_OPEN_DELAY);
         }
      } else {
         clearTimeout(this._dragTimer);
         if (this._drag) this._drag.opening = null;
      }
   }

   _handleDragLeave(event) {
      const row = this._rowOf(event.target);
      if (row && !row.contains(event.relatedTarget)) row.classList.remove('is-drop-before', 'is-drop-after', 'is-drop-inside');
   }

   async _handleDrop(event) {
      if (!this._drag) return;
      event.preventDefault();
      const { key, target: targetKey, position } = this._drag;
      this._handleDragEnd();
      const dragged = this._nodes.get(key);
      const target = this._nodes.get(targetKey);
      if (!this._canDrop(dragged, target, position)) return;
      if (this._onMove) {
         const verdict = await this._onMove({ item: dragged.item, target: target.item, position });
         if (verdict === false) return;
      }
      this._move(dragged, target, position);
   }

   _handleDragEnd() {
      clearTimeout(this._dragTimer);
      this._clearDropMarks();
      this.$treeView.querySelectorAll('.is-dragging').forEach((row) => row.classList.remove('is-dragging'));
      this._drag = null;
   }

   _clearDropMarks() {
      this.$treeView.querySelectorAll('.is-drop-before, .is-drop-after, .is-drop-inside')
         .forEach((row) => row.classList.remove('is-drop-before', 'is-drop-after', 'is-drop-inside'));
   }

   // Moves the item in YOUR arrays (the tree reflects your data), then redraws.
   _move(dragged, target, position) {
      const listOf = (node) => {
         if (!node) return this._items;
         const holder = node.item;
         const key = Array.isArray(holder.items) ? 'items' : Array.isArray(holder.children) ? 'children' : 'items';
         if (!Array.isArray(holder[key])) holder[key] = [];
         return holder[key];
      };
      const from = listOf(dragged.parent);
      const at = from.indexOf(dragged.item);
      if (at === -1) return;
      from.splice(at, 1);
      if (position === 'inside') {
         listOf(target).push(dragged.item);
         this._expandedKeys.add(target.key);
      } else {
         const into = listOf(target.parent);
         const index = into.indexOf(target.item);
         into.splice(position === 'before' ? index : index + 1, 0, dragged.item);
      }
      // Keys follow the data, so the moved row keeps its identity when it has
      // an id or path; others are re-keyed from their new place.
      this._buildModel();
      this._saveExpanded();
      this._focusKey = this._byItem.get(dragged.item)?.key ?? null;
      this._render().then(() => this._focusRow(this._focusKey));
   }
}

customElements.define('slice-treeview', TreeView);