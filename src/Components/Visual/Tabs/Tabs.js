// Tabs: a tab strip and the panels it switches.
//
// The WAI-ARIA tabs pattern, complete: role=tablist / tab / tabpanel wired
// with aria-controls and aria-labelledby, one tab in the Tab order (roving
// tabindex), arrows / Home / End to move, automatic or manual activation.
//
// Around it:
//   variant      underline (the old 'primary') | pill | segmented (the old
//                'secondary') | enclosed; the indicator slides between tabs
//   size, orientation (horizontal | vertical), align (start | center | end |
//   stretch)
//   items        { id, label, icon, badge, disabled, hidden, closable, panel }
//                where `panel` is a node, a string, or a function called the
//                first time its tab opens (lazy, may be async)
//   overflow     arrow buttons appear when the tabs do not fit
//   state        stateKey remembers the tab; urlParam keeps it in the URL
//
// Memory: the panels are this component's. A panel is destroyed (with every
// Slice component inside it) when its tab is closed or replaced; a panel whose
// tab survives an `items` update is kept, so re-setting items never throws
// away what someone was working on.

import { texts } from '../../shared/text/texts.js';

const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
  if (_sliceDeprecated.has(oldName)) return;
  _sliceDeprecated.add(oldName);
  console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

const VARIANT_ALIASES = { primary: 'underline', secondary: 'segmented' };
const LEGACY_CLASS = { underline: 'primary', segmented: 'secondary' };

const TEXTS = {
  label: 'Tabs',
};

// Spanish mirrors TEXTS key by key; the app can override any of them with its dictionary.
const ES = {
  label: 'Pestañas',
};

const t = texts('slice.tabs', { en: TEXTS, es: ES });

let uid = 0;

export default class Tabs extends HTMLElement {
  static props = {
    items: {
      type: 'array',
      default: [],
      required: false,
      items: {
        type: 'object',
        schema: {
          id: { type: 'string', required: true },
          label: { type: 'string', required: true }
        }
      }
    },
    activeTab: { type: 'string', default: '', required: false },
    variant: {
      type: 'string',
      default: 'underline',
      required: false,
      allowedValues: ['underline', 'pill', 'segmented', 'enclosed', 'primary', 'secondary']
    },
    size: { type: 'string', default: 'md', allowedValues: ['sm', 'md', 'lg'] },
    orientation: { type: 'string', default: 'horizontal', allowedValues: ['horizontal', 'vertical'] },
    align: { type: 'string', default: 'start', allowedValues: ['start', 'center', 'end', 'stretch'] },
    activation: { type: 'string', default: 'auto', allowedValues: ['auto', 'manual'] },
    closable: { type: 'boolean', default: false },
    keepMounted: { type: 'boolean', default: true },
    ariaLabel: { type: 'string', default: 'Tabs' },
    // Per-instance overrides of any built-in text (see TEXTS).
    texts: { type: 'object', default: null },
    stateKey: { type: 'string', default: '' },
    urlParam: { type: 'string', default: '' },
    onChange: { type: 'function', default: null, required: false },
    onBeforeChange: { type: 'function', default: null },
    onClose: { type: 'function', default: null },
    onTabChange: { type: 'function', default: null, required: false }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.$root = this.querySelector('.slice_tabs');
    this.$list = this.querySelector('.slice_tabs_list');
    this.$indicator = this.querySelector('.slice_tabs_indicator');
    this.$panels = this.querySelector('.slice_tabs_panels');
    this.$scrollStart = this.querySelector('.slice_tabs_scroll--start');
    this.$scrollEnd = this.querySelector('.slice_tabs_scroll--end');

    this._uid = `slice-tabs-${++uid}`;
    this._items = [];
    this._tabs = new Map();     // id -> { item, button, panel, source, rendered, token, iconEl }
    this._order = [];           // ids of the tabs on screen, in order
    this._activeTab = '';
    this._variant = 'underline';
    this._size = 'md';
    this._orientation = 'horizontal';
    this._align = 'start';
    this._activation = 'auto';
    this._closable = false;
    this._keepMounted = true;
    this._ariaLabel = null;
    this._texts = {};
    this._stateKey = '';
    this._urlParam = '';
    this._onChange = null;
    this._onBeforeChange = null;
    this._onClose = null;
    this._inited = false;
    this._resizeObserver = null;

    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleAuxClick = this._handleAuxClick.bind(this);
    this._syncOverflow = this._syncOverflow.bind(this);
    this._scrollStartBy = () => this._scrollBy(-1);
    this._scrollEndBy = () => this._scrollBy(1);

    this.variant = 'underline';
    slice.controller.setComponentProps(this, props || {});
  }

  init() {
    this.$list.addEventListener('keydown', this._handleKeyDown);
    this.$list.addEventListener('click', this._handleClick);
    this.$list.addEventListener('auxclick', this._handleAuxClick);
    this.$list.addEventListener('scroll', this._syncOverflow, { passive: true });
    this.$scrollStart.addEventListener('click', this._scrollStartBy);
    this.$scrollEnd.addEventListener('click', this._scrollEndBy);
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        this._placeIndicator(false);
        this._syncOverflow();
      });
      this._resizeObserver.observe(this.$list);
    }
    this._inited = true;
    this._paintAriaLabel();
    // A language change repaints the strip's name; the active tab is not touched.
    slice.translator?.watch?.(this, () => this._paintAriaLabel());
    this.renderTabs();
  }

  beforeDestroy() {
    this.$list.removeEventListener('keydown', this._handleKeyDown);
    this.$list.removeEventListener('click', this._handleClick);
    this.$list.removeEventListener('auxclick', this._handleAuxClick);
    this.$list.removeEventListener('scroll', this._syncOverflow);
    this.$scrollStart.removeEventListener('click', this._scrollStartBy);
    this.$scrollEnd.removeEventListener('click', this._scrollEndBy);
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    for (const id of [...this._tabs.keys()]) this._dispose(id);
  }

  // ── Props ──────────────────────────────────────────────────────

  get items() { return this._items; }
  set items(value) {
    this._items = Array.isArray(value) ? value : [];
    if (this._inited) this.renderTabs();
  }

  get activeTab() { return this._activeTab; }
  set activeTab(value) {
    const id = typeof value === 'string' ? value : '';
    if (!this._inited) {
      this._activeTab = id;
      return;
    }
    this._select(id, { emit: false });
  }

  /** The item of the active tab. */
  get activeItem() { return this._tabs.get(this._activeTab)?.item ?? null; }

  get activeIndex() { return this._order.indexOf(this._activeTab); }

  get variant() { return this._variant; }
  set variant(value) {
    const raw = VARIANT_ALIASES[value] || value;
    const next = ['underline', 'pill', 'segmented', 'enclosed'].includes(raw) ? raw : 'underline';
    for (const name of ['underline', 'pill', 'segmented', 'enclosed', 'primary', 'secondary']) {
      this.$list.classList.remove(`variant-${name}`);
    }
    this._variant = next;
    this.$list.classList.add(`variant-${next}`);
    // The older class names, for stylesheets written against them.
    if (LEGACY_CLASS[next]) this.$list.classList.add(`variant-${LEGACY_CLASS[next]}`);
    this.dataset.variant = next;
    this._placeIndicator(false);
  }

  get size() { return this._size; }
  set size(value) {
    this._size = ['sm', 'md', 'lg'].includes(value) ? value : 'md';
    this.dataset.size = this._size;
    this._placeIndicator(false);
  }

  get orientation() { return this._orientation; }
  set orientation(value) {
    this._orientation = value === 'vertical' ? 'vertical' : 'horizontal';
    this.dataset.orientation = this._orientation;
    this.$list.setAttribute('aria-orientation', this._orientation);
    this._placeIndicator(false);
    this._syncOverflow();
  }

  get align() { return this._align; }
  set align(value) {
    this._align = ['start', 'center', 'end', 'stretch'].includes(value) ? value : 'start';
    this.dataset.align = this._align;
    this._placeIndicator(false);
  }

  get activation() { return this._activation; }
  set activation(value) { this._activation = value === 'manual' ? 'manual' : 'auto'; }

  get closable() { return this._closable; }
  set closable(value) {
    this._closable = value === true;
    if (this._inited) this.renderTabs();
  }

  get keepMounted() { return this._keepMounted; }
  set keepMounted(value) { this._keepMounted = value !== false; }

  get ariaLabel() { return this._ariaLabel ?? this._t('label'); }
  set ariaLabel(value) {
    // 'Tabs' is the English default, not an override: keeping null lets the
    // built-in t('label') answer, so the strip follows the translator.
    const text = typeof value === 'string' && value ? value : null;
    this._ariaLabel = text === Tabs.props.ariaLabel.default ? null : text;
    this._paintAriaLabel();
  }

  get texts() { return this._texts; }
  set texts(value) {
    this._texts = value && typeof value === 'object' ? { ...value } : {};
    this._paintAriaLabel();
  }

  get stateKey() { return this._stateKey; }
  set stateKey(value) { this._stateKey = typeof value === 'string' ? value : ''; }

  get urlParam() { return this._urlParam; }
  set urlParam(value) { this._urlParam = typeof value === 'string' ? value : ''; }

  get onChange() { return this._onChange; }
  set onChange(value) { this._onChange = typeof value === 'function' ? value : null; }

  get onBeforeChange() { return this._onBeforeChange; }
  set onBeforeChange(value) { this._onBeforeChange = typeof value === 'function' ? value : null; }

  get onClose() { return this._onClose; }
  set onClose(value) { this._onClose = typeof value === 'function' ? value : null; }

  get onTabChange() { return this._onChange; }
  set onTabChange(value) {
    if (typeof value === 'function') {
      this._onChange ??= value;
      deprecate('onTabChange', 'onChange');
    }
  }

  // ── Public API ─────────────────────────────────────────────────

  /** Activate a tab by id. Returns whether it is now the active tab. */
  select(id, { focus = false } = {}) {
    return this._select(id, { emit: true, focus });
  }

  next() { return this._step(1); }
  prev() { return this._step(-1); }

  /** Add a tab (at `index`, or at the end) and return its id. */
  addTab(item, index = this._items.length) {
    if (!item || typeof item.id !== 'string') return null;
    const list = this._items.filter((it) => it?.id !== item.id);
    list.splice(Math.max(0, Math.min(index, list.length)), 0, item);
    this.items = list;
    return item.id;
  }

  /** Remove a tab and destroy its panel. */
  removeTab(id) {
    if (!this._tabs.has(id)) return false;
    const wasActive = id === this._activeTab;
    const index = this._order.indexOf(id);
    this._items = this._items.filter((it) => it?.id !== id);
    this.renderTabs({ fallbackIndex: wasActive ? index : -1 });
    return true;
  }

  /** Set or clear (null) a tab's badge without re-rendering. */
  setBadge(id, value) {
    const entry = this._tabs.get(id);
    if (!entry) return;
    entry.item = { ...entry.item, badge: value };
    this._items = this._items.map((it) => (it?.id === id ? entry.item : it));
    this._paintBadge(entry);
  }

  /** The panel element of a tab, once it has one. */
  getPanel(id) { return this._tabs.get(id)?.panel ?? null; }

  // Older names, kept for callers that used them.
  renderPanels() { this.renderTabs(); }
  updateActiveButton() { this._syncSelection(); }

  // ── Rendering ──────────────────────────────────────────────────

  _t(key) {
    return this._texts[key] ?? t(key);
  }

  _paintAriaLabel() {
    if (this.$list) this.$list.setAttribute('aria-label', this._ariaLabel ?? this._t('label'));
  }

  renderTabs({ fallbackIndex = -1 } = {}) {
    if (!this.$list) return;

    const valid = this._items.filter((it) =>
      it && typeof it.id === 'string' && it.id && !it.hidden && (typeof it.label === 'string' || it.icon));
    const nextIds = new Set(valid.map((it) => it.id));

    // Tabs that are gone, or whose panel source changed, lose their panel.
    for (const [id, entry] of this._tabs) {
      if (!nextIds.has(id)) this._dispose(id);
      else {
        const item = valid.find((it) => it.id === id);
        if (item.panel !== entry.source) this._disposePanel(entry);
      }
    }

    this._order = valid.map((it) => it.id);
    for (const item of valid) {
      let entry = this._tabs.get(item.id);
      if (!entry) {
        entry = { item, button: this._buildButton(item), panel: null, source: undefined, rendered: false, token: 0, iconEl: null };
        this._tabs.set(item.id, entry);
      }
      entry.item = item;
      this._paintButton(entry);
      this.$list.appendChild(entry.button);   // re-appending keeps the order
      if (item.panel !== undefined && !entry.panel) this._buildPanel(entry);
    }
    for (const id of this._order) {
      const panel = this._tabs.get(id).panel;
      if (panel) this.$panels.appendChild(panel);
    }

    // Which tab is active: the URL, then what was remembered, then the
    // activeTab prop, then the neighbour of a closed tab, then the first.
    const usable = (id) => id && this._order.includes(id) && !this._tabs.get(id).item.disabled;
    let active = '';
    if (!this._initialPicked) {
      this._initialPicked = true;
      active = [this._readUrl(), this._readStored(), this._activeTab].find(usable) || '';
    } else if (usable(this._activeTab)) {
      active = this._activeTab;
    }
    if (!active && fallbackIndex >= 0) {
      const enabled = this._order.filter((id) => !this._tabs.get(id).item.disabled);
      active = enabled[Math.min(fallbackIndex, enabled.length - 1)] || '';
    }
    if (!active) active = this._order.find((id) => !this._tabs.get(id).item.disabled) || '';

    this._activeTab = active;
    this._syncSelection();
    this._ensureRendered(active);
    requestAnimationFrame(() => {
      this._placeIndicator(false);
      this._syncOverflow();
      this._revealActive(false);
    });
  }

  _buildButton(item) {
    const id = `${this._uid}-tab-${item.id}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'slice_tab_button';
    button.id = id;
    button.setAttribute('role', 'tab');
    button.dataset.tabId = item.id;
    button.innerHTML = '<span class="slice_tab_icon" hidden></span><span class="slice_tab_label"></span><span class="slice_tab_badge" hidden></span><span class="slice_tab_close" aria-hidden="true" hidden><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span>';
    return button;
  }

  _paintButton(entry) {
    const { item, button } = entry;
    button.querySelector('.slice_tab_label').textContent = item.label ?? '';
    if (!item.label && item.icon) button.setAttribute('aria-label', item.ariaLabel || item.icon);
    else button.removeAttribute('aria-label');
    if (item.title) button.title = item.title;
    else button.removeAttribute('title');
    button.disabled = item.disabled === true;
    button.setAttribute('aria-disabled', String(item.disabled === true));
    const closable = this._isClosable(item);
    button.querySelector('.slice_tab_close').hidden = !closable;
    button.classList.toggle('is-closable', closable);
    this._paintBadge(entry);
    this._paintIcon(entry);
  }

  _isClosable(item) {
    return item.closable === true || (this._closable && item.closable !== false);
  }

  _paintBadge(entry) {
    const badge = entry.button.querySelector('.slice_tab_badge');
    const value = entry.item.badge;
    const show = value !== undefined && value !== null && value !== false && value !== 0 && value !== '';
    badge.hidden = !show;
    badge.classList.toggle('is-dot', value === true);
    badge.textContent = !show || value === true ? '' : (typeof value === 'number' && value > 99 ? '99+' : String(value));
  }

  async _paintIcon(entry) {
    const slot = entry.button.querySelector('.slice_tab_icon');
    const name = entry.item.icon || '';
    if (!name) {
      slot.hidden = true;
      if (entry.iconEl) {
        slice.controller.destroyComponent(entry.iconEl);
        entry.iconEl.remove();
        entry.iconEl = null;
      }
      return;
    }
    slot.hidden = false;
    if (entry.iconEl) {
      entry.iconEl.name = name;
      return;
    }
    const token = (entry.iconToken = (entry.iconToken || 0) + 1);
    const el = await slice.build('Icon', { name, size: '16px' });
    if (!el) return;
    if (token !== entry.iconToken || entry.iconEl || !this._tabs.has(entry.item.id)) {
      slice.controller.destroyComponent(el);
      return;
    }
    entry.iconEl = el;
    slot.appendChild(el);
    this._placeIndicator(false);
  }

  _buildPanel(entry) {
    const panel = document.createElement('div');
    panel.className = 'slice_tab_panel';
    panel.dataset.tabId = entry.item.id;
    panel.id = `${this._uid}-panel-${entry.item.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', entry.button.id);
    panel.tabIndex = 0;
    panel.hidden = true;
    entry.button.setAttribute('aria-controls', panel.id);
    entry.panel = panel;
    entry.source = entry.item.panel;
    entry.rendered = false;
  }

  // A panel's content is put in the first time its tab is shown: a function
  // panel only runs then (lazy), and a node panel only pays layout then.
  async _ensureRendered(id) {
    const entry = this._tabs.get(id);
    if (!entry || !entry.panel || entry.rendered) return;
    entry.rendered = true;
    const source = entry.source;
    const token = ++entry.token;
    let content = source;
    if (typeof source === 'function') {
      entry.panel.classList.add('is-loading');
      entry.panel.setAttribute('aria-busy', 'true');
      try {
        content = await source({ id, item: entry.item, tabs: this });
      } catch (error) {
        slice.logger?.logError?.('Tabs', `Panel "${id}" failed to render`, error);
        content = 'This panel could not be loaded.';
      }
      if (token !== entry.token || !entry.panel) {
        // Closed or replaced while it was loading: do not leak what it built.
        if (content instanceof Node) {
          slice.controller.destroyByContainer(content);
          if (content.sliceId) slice.controller.destroyComponent(content);
        }
        return;
      }
      entry.panel.classList.remove('is-loading');
      entry.panel.removeAttribute('aria-busy');
    }
    if (content instanceof Node) entry.panel.appendChild(content);
    else if (content !== undefined && content !== null) entry.panel.textContent = String(content);
  }

  _disposePanel(entry) {
    if (!entry.panel) return;
    entry.token += 1;
    slice.controller.destroyByContainer(entry.panel);
    entry.panel.remove();
    entry.panel = null;
    entry.source = undefined;
    entry.rendered = false;
    entry.button.removeAttribute('aria-controls');
  }

  _dispose(id) {
    const entry = this._tabs.get(id);
    if (!entry) return;
    this._disposePanel(entry);
    if (entry.iconEl) slice.controller.destroyComponent(entry.iconEl);
    entry.iconToken = (entry.iconToken || 0) + 1;
    entry.button.remove();
    this._tabs.delete(id);
  }

  _syncSelection() {
    for (const id of this._order) {
      const { button, panel } = this._tabs.get(id);
      const active = id === this._activeTab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
      if (panel) {
        panel.hidden = !active;
        panel.classList.toggle('active', active);
      }
    }
    // With no active tab (all disabled), keep the strip reachable by Tab.
    if (!this._activeTab && this._order.length) {
      const first = this._tabs.get(this._order.find((id) => !this._tabs.get(id).item.disabled) || this._order[0]);
      first.button.tabIndex = 0;
    }
  }

  // ── Selection ──────────────────────────────────────────────────

  _select(id, { emit = true, focus = false } = {}) {
    const entry = this._tabs.get(id);
    if (!entry || entry.item.disabled) return false;
    if (id === this._activeTab) {
      if (focus) entry.button.focus();
      return true;
    }
    const previous = this._activeTab;
    if (emit && this._onBeforeChange && this._onBeforeChange(id, previous) === false) return false;

    // keepMounted: false re-runs a function panel the next time it opens.
    const leaving = this._tabs.get(previous);
    if (leaving && !this._keepMounted && typeof leaving.source === 'function' && leaving.panel) {
      slice.controller.destroyByContainer(leaving.panel);
      leaving.panel.replaceChildren();
      leaving.rendered = false;
      leaving.token += 1;
    }

    this._activeTab = id;
    this._syncSelection();
    this._ensureRendered(id);
    this._placeIndicator(true);
    this._revealActive(true);
    this._persist(id);
    if (focus) entry.button.focus();

    if (emit) {
      if (typeof this._onChange === 'function') this._onChange(id);
      this.dispatchEvent(new CustomEvent('tab-change', { detail: { tabId: id, item: entry.item, previous }, bubbles: true }));
    }
    return true;
  }

  _step(delta, { focus = false } = {}) {
    const enabled = this._order.filter((id) => !this._tabs.get(id).item.disabled);
    if (!enabled.length) return false;
    const current = enabled.indexOf(this._activeTab);
    const next = enabled[(current + delta + enabled.length) % enabled.length];
    return this._select(next, { emit: true, focus });
  }

  _close(id) {
    const entry = this._tabs.get(id);
    if (!entry || !this._isClosable(entry.item) || entry.item.disabled) return;
    if (this._onClose && this._onClose(id, entry.item) === false) return;
    const hadFocus = entry.button === document.activeElement;
    this.removeTab(id);
    if (hadFocus) this._tabs.get(this._activeTab)?.button.focus();
  }

  // ── State ──────────────────────────────────────────────────────

  _readStored() {
    if (!this._stateKey) return '';
    try { return localStorage.getItem(`slice-tabs:${this._stateKey}`) || ''; } catch { return ''; }
  }

  _readUrl() {
    if (!this._urlParam) return '';
    try { return new URLSearchParams(window.location.search).get(this._urlParam) || ''; } catch { return ''; }
  }

  _persist(id) {
    if (this._stateKey) {
      try { localStorage.setItem(`slice-tabs:${this._stateKey}`, id); } catch { /* storage unavailable */ }
    }
    if (this._urlParam) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set(this._urlParam, id);
        // replaceState: switching tabs is not a navigation, so Back still
        // leaves the page instead of stepping through every tab clicked.
        window.history.replaceState(window.history.state, '', url);
      } catch { /* not in a browser with history */ }
    }
  }

  // ── Indicator and overflow ─────────────────────────────────────

  _placeIndicator(animate) {
    if (!this.$indicator || !this._inited) return;
    const entry = this._tabs.get(this._activeTab);
    const show = !!entry && this._variant !== 'enclosed';
    this.$indicator.hidden = !show;
    if (!show) return;
    const b = entry.button;
    if (!b.offsetWidth && !b.offsetHeight) return;   // not laid out yet
    this.$indicator.classList.toggle('is-animated', animate && this.$indicator.classList.contains('is-placed'));
    const vertical = this._orientation === 'vertical';
    const s = this.$indicator.style;
    if (this._variant === 'underline') {
      if (vertical) {
        s.width = '';
        s.height = `${b.offsetHeight - 12}px`;
        s.transform = `translateY(${b.offsetTop + 6}px)`;
      } else {
        s.height = '';
        s.width = `${b.offsetWidth - 16}px`;
        s.transform = `translateX(${b.offsetLeft + 8}px)`;
      }
    } else {
      s.width = `${b.offsetWidth}px`;
      s.height = `${b.offsetHeight}px`;
      s.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
    }
    this.$indicator.classList.add('is-placed');
  }

  _syncOverflow() {
    const list = this.$list;
    if (!list || this._orientation === 'vertical') {
      this.$scrollStart.hidden = true;
      this.$scrollEnd.hidden = true;
      return;
    }
    const overflow = list.scrollWidth > list.clientWidth + 1;
    this.$scrollStart.hidden = !overflow || list.scrollLeft <= 1;
    this.$scrollEnd.hidden = !overflow || list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
    this.classList.toggle('slice_tabs--overflow', overflow);
  }

  _scrollBy(direction) {
    const list = this.$list;
    list.scrollBy({ left: direction * list.clientWidth * 0.7, behavior: this._motionOk() ? 'smooth' : 'auto' });
  }

  _revealActive(smooth) {
    const entry = this._tabs.get(this._activeTab);
    if (!entry || this._orientation === 'vertical') return;
    const list = this.$list;
    const b = entry.button;
    const pad = 32;
    let left = null;
    if (b.offsetLeft - pad < list.scrollLeft) left = b.offsetLeft - pad;
    else if (b.offsetLeft + b.offsetWidth + pad > list.scrollLeft + list.clientWidth) {
      left = b.offsetLeft + b.offsetWidth + pad - list.clientWidth;
    }
    if (left !== null) list.scrollTo({ left, behavior: smooth && this._motionOk() ? 'smooth' : 'auto' });
  }

  _motionOk() {
    return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // ── Events ─────────────────────────────────────────────────────

  _handleClick(event) {
    const button = event.target.closest('.slice_tab_button');
    if (!button || !this.$list.contains(button)) return;
    const id = button.dataset.tabId;
    if (event.target.closest('.slice_tab_close')) {
      event.stopPropagation();
      this._close(id);
      return;
    }
    this._select(id, { emit: true });
  }

  // Middle-click closes a closable tab, as in a browser.
  _handleAuxClick(event) {
    if (event.button !== 1) return;
    const button = event.target.closest('.slice_tab_button');
    if (!button) return;
    event.preventDefault();
    this._close(button.dataset.tabId);
  }

  _handleKeyDown(event) {
    const button = event.target.closest('.slice_tab_button');
    if (!button) return;
    const vertical = this._orientation === 'vertical';
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
    const enabled = this._order.filter((id) => !this._tabs.get(id).item.disabled);
    const current = enabled.indexOf(button.dataset.tabId);
    let target;

    if (event.key === nextKey) target = enabled[(current + 1) % enabled.length];
    else if (event.key === prevKey) target = enabled[(current - 1 + enabled.length) % enabled.length];
    else if (event.key === 'Home') target = enabled[0];
    else if (event.key === 'End') target = enabled[enabled.length - 1];
    else if (event.key === 'Delete' || (event.key === 'Backspace' && (event.metaKey || event.ctrlKey))) {
      event.preventDefault();
      this._close(button.dataset.tabId);
      return;
    } else {
      return;
    }

    event.preventDefault();
    if (!target) return;
    const entry = this._tabs.get(target);
    if (this._activation === 'auto') {
      this._select(target, { emit: true, focus: true });
    } else {
      // Manual: arrows move the focus only; Enter or Space (a click) selects.
      for (const id of this._order) this._tabs.get(id).button.tabIndex = id === target ? 0 : -1;
      entry.button.focus();
    }
  }
}

customElements.define('slice-tabs', Tabs);