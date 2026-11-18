import { applySize, SIZE_VALUES } from '../../shared/props.js';
// A Card is one thing — a product, a person, a file, a project, a metric —
// usually shown among others like it in a grid or a list. It sums the thing up
// and, when it can be opened, leads to it.
//
//   media      `image`, or `icon` as a large mark (the banner)
//   header     `headerIcon`, `title`, `subtitle`, `badge`
//   body       `text`, then `content` (any nodes or components)
//   footer     `actions`, always visible
//
// The whole card can lead somewhere with `href` (a link) or `onClick` (a
// button). The title becomes that link or button and its hit area is
// stretched over the card, so the card is one control for assistive tech and
// the actions in the footer stay separate controls instead of buttons inside
// a button. `selectable` turns the card into a toggle (picking a plan, say).
//
// What a Card is not: a section of a page (use a plain container), content
// that folds open (Details), a passing message (Toast), or a dialog (Modal).

const VARIANTS = ['outlined', 'elevated', 'filled', 'ghost'];
const VARIANT_ALIASES = { default: 'outlined', minimal: 'ghost' };
const LAYOUTS = ['vertical', 'horizontal'];
const ALIGNS = ['start', 'end', 'between', 'stretch'];
const BADGE_VARIANTS = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'];

const warned = new Set();
function warnOnce(key, message) {
   if (warned.has(key)) return;
   warned.add(key);
   console.warn(`[Card] ${message}`);
}

export default class Card extends HTMLElement {
   static props = {
      title: { type: 'string', default: '' },
      subtitle: { type: 'string', default: '' },
      text: { type: 'string', default: '' },
      content: { type: 'any', default: null },
      // The banner: an icon name, or { name, size, color }. `iconStyle` inside
      // the object is accepted and ignored (Lucide has one style).
      icon: { type: ['string', 'object'], default: null },
      // The small mark beside the title: a name, or { name, size, color }.
      headerIcon: { type: ['string', 'object'], default: null },
      image: { type: 'string', default: '' },
      imageAlt: { type: 'string', default: '' },
      mediaRatio: { type: 'string', default: '16 / 9' },
      // 'New', 12, or Badge props: { label, value, tone, variant, icon, dot }.
      badge: { type: 'any', default: null },
      actions: { type: 'array', default: [] },
      actionsAlign: { type: 'string', default: 'start', allowedValues: ALIGNS },
      href: { type: 'string', default: '' },
      target: { type: 'string', default: '' },
      onClick: { type: 'function', default: null },
      selectable: { type: 'boolean', default: false },
      selected: { type: 'boolean', default: false },
      onSelect: { type: 'function', default: null },
      disabled: { type: 'boolean', default: false },
      loading: { type: 'boolean', default: false },
      variant: { type: 'string', default: 'outlined', allowedValues: [...VARIANTS, ...Object.keys(VARIANT_ALIASES)] },
      size: { type: 'string', default: 'md', allowedValues: SIZE_VALUES },
      layout: { type: 'string', default: 'vertical', allowedValues: LAYOUTS },
      // Lift on hover when the card can be opened. false keeps it still.
      interactive: { type: 'boolean', default: true },
      headingLevel: { type: 'number', default: 3 },
      ariaLabel: { type: 'string', default: '' },
      // { accent, background, text, border }
      customColor: { type: 'object', default: null },
      // Removed: folding content belongs to Details. Accepted so old code
      // does not break, with a warning.
      details: { type: 'any', default: null },
      open: { type: 'boolean', default: null },
      isOpen: { type: 'boolean', default: null },
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.classList.add('slice-card');

      this.$media = this.querySelector('.slice-card__media');
      this.$main = this.querySelector('.slice-card__main');
      this.$mark = this.querySelector('.slice-card__mark');
      this.$title = this.querySelector('.slice-card__title');
      this.$subtitle = this.querySelector('.slice-card__subtitle');
      this.$badge = this.querySelector('.slice-card__badge');
      this.$text = this.querySelector('.slice-card__text');
      this.$content = this.querySelector('.slice-card__content');
      this.$skeleton = this.querySelector('.slice-card__skeleton');
      this.$footer = this.querySelector('.slice-card__footer');

      this._title = '';
      this._subtitle = '';
      this._text = '';
      this._content = null;
      this._icon = null;
      this._headerIcon = null;
      this._image = '';
      this._imageAlt = '';
      this._mediaRatio = '16 / 9';
      this._badge = null;
      this._actions = [];
      this._actionsAlign = 'start';
      this._href = '';
      this._target = '';
      this._onClick = null;
      this._selectable = false;
      this._selected = false;
      this._onSelect = null;
      this._disabled = false;
      this._loading = false;
      this._variant = 'outlined';
      this._size = 'md';
      this._layout = 'vertical';
      this._interactive = true;
      this._headingLevel = 3;
      this._ariaLabel = '';
      this._customColor = null;

      this._ready = false;
      this._contentNodes = [];
      this._actionNodes = [];
      this._ownActions = new Set();
      this._tokens = { media: 0, mark: 0, badge: 0, actions: 0 };
      this._handleTargetClick = this._handleTargetClick.bind(this);

      slice.controller.setComponentProps(this, props);
   }

   async init() {
      this._ready = true;
      this._renderLooks();
      this._renderHeading();
      this._renderBody();
      this._renderState();
      await Promise.all([this._renderMedia(), this._renderMark(), this._renderBadge(), this._renderActions()]);
   }

   beforeDestroy() {
      this._ready = false;
      for (const key of Object.keys(this._tokens)) this._tokens[key]++;
      this._destroyIn(this.$media);
      this._destroyIn(this.$mark);
      this._destroyIn(this.$badge);
      this._destroyNodes(this._actionNodes.filter((n) => this._ownActions.has(n)));
      this._actionNodes = [];
      this._destroyNodes(this._contentNodes);
      this._contentNodes = [];
   }

   // ── Props ──────────────────────────────────────────────────────

   get title() { return this._title; }
   set title(value) { this._title = value == null ? '' : String(value); this._ready && this._renderHeading(); }

   get subtitle() { return this._subtitle; }
   set subtitle(value) { this._subtitle = value == null ? '' : String(value); this._ready && this._renderHeading(); }

   get text() { return this._text; }
   set text(value) { this._text = value == null ? '' : String(value); this._ready && this._renderBody(); }

   get content() { return this._content; }
   set content(value) { this._content = value ?? null; this._ready && this._renderBody(); }

   get icon() { return this._icon; }
   set icon(value) { this._icon = value || null; this._ready && this._renderMedia(); }

   get headerIcon() { return this._headerIcon; }
   set headerIcon(value) { this._headerIcon = value || null; this._ready && this._renderMark(); }

   get image() { return this._image; }
   set image(value) { this._image = value ? String(value) : ''; this._ready && this._renderMedia(); }

   get imageAlt() { return this._imageAlt; }
   set imageAlt(value) {
      this._imageAlt = value ? String(value) : '';
      const img = this.$media.querySelector('img');
      if (img) img.alt = this._imageAlt;
   }

   get mediaRatio() { return this._mediaRatio; }
   set mediaRatio(value) {
      this._mediaRatio = value ? String(value) : '16 / 9';
      this.style.setProperty('--slice-card-media-ratio', this._mediaRatio);
   }

   get badge() { return this._badge; }
   set badge(value) { this._badge = value === '' || value === false ? null : value ?? null; this._ready && this._renderBadge(); }

   get actions() { return this._actions; }
   set actions(value) { this._actions = Array.isArray(value) ? value : []; this._ready && this._renderActions(); }

   get actionsAlign() { return this._actionsAlign; }
   set actionsAlign(value) {
      this._actionsAlign = ALIGNS.includes(value) ? value : 'start';
      this.$footer.dataset.align = this._actionsAlign;
   }

   get href() { return this._href; }
   set href(value) { this._href = value ? String(value) : ''; this._ready && this._renderHeading(); }

   get target() { return this._target; }
   set target(value) { this._target = value ? String(value) : ''; this._ready && this._renderHeading(); }

   get onClick() { return this._onClick; }
   set onClick(value) { this._onClick = typeof value === 'function' ? value : null; this._ready && this._renderHeading(); }

   get selectable() { return this._selectable; }
   set selectable(value) { this._selectable = value === true; this._ready && this._renderHeading(); }

   get selected() { return this._selected; }
   set selected(value) {
      this._selected = value === true;
      this.classList.toggle('is-selected', this._selected);
      if (this._targetEl && this._selectable) this._targetEl.setAttribute('aria-pressed', String(this._selected));
   }

   get onSelect() { return this._onSelect; }
   set onSelect(value) { this._onSelect = typeof value === 'function' ? value : null; }

   get disabled() { return this._disabled; }
   set disabled(value) { this._disabled = value === true; this._ready && this._renderState(); }

   get loading() { return this._loading; }
   set loading(value) { this._loading = value === true; this._ready && this._renderState(); }

   get variant() { return this._variant; }
   set variant(value) {
      const name = VARIANT_ALIASES[value] || value;
      const next = VARIANTS.includes(name) ? name : 'outlined';
      for (const v of VARIANTS) this.classList.remove(`slice-card--${v}`);
      this.classList.add(`slice-card--${next}`);
      this._variant = next;
   }

   get size() { return this._size; }
   set size(value) { this._size = applySize(this, value, 'md'); }

   get layout() { return this._layout; }
   set layout(value) {
      this._layout = LAYOUTS.includes(value) ? value : 'vertical';
      this.classList.toggle('slice-card--horizontal', this._layout === 'horizontal');
   }

   get interactive() { return this._interactive; }
   set interactive(value) {
      this._interactive = value !== false;
      this.classList.toggle('is-still', !this._interactive);
   }

   get headingLevel() { return this._headingLevel; }
   set headingLevel(value) {
      const level = Number(value);
      this._headingLevel = level >= 1 && level <= 6 ? Math.round(level) : 3;
      this.$title.setAttribute('aria-level', String(this._headingLevel));
   }

   get ariaLabel() { return this._ariaLabel; }
   set ariaLabel(value) { this._ariaLabel = value ? String(value) : ''; this._ready && this._renderHeading(); }

   get customColor() { return this._customColor; }
   set customColor(value) {
      this._customColor = value && typeof value === 'object' ? value : null;
      const map = { accent: '--slice-card-accent', background: '--slice-card-bg', text: '--slice-card-text', border: '--slice-card-border' };
      for (const [key, cssVar] of Object.entries(map)) {
         const color = this._customColor?.[key];
         if (color) this.style.setProperty(cssVar, color);
         else this.style.removeProperty(cssVar);
      }
   }

   get details() { return null; }
   set details(value) {
      if (value) warnOnce('details', '"details" was removed: put a Details component in `content` for content that folds open.');
   }

   get open() { return false; }
   set open(value) {
      if (value != null) warnOnce('open', '"open" was removed with "details": Card no longer folds open. Use a Details in `content`.');
   }

   get isOpen() { return false; }
   set isOpen(value) {
      if (value != null) warnOnce('isOpen', '"isOpen" was removed with "details": Card no longer folds open. Use a Details in `content`.');
   }

   // ── Rendering ──────────────────────────────────────────────────

   get clickable() {
      return !!(this._href || this._onClick || this._selectable);
   }

   _renderLooks() {
      if (!this.classList.contains(`slice-card--${this._variant}`)) this.variant = this._variant;
      if (!this.dataset.size) this.size = this._size;
      this.layout = this._layout;
      this.interactive = this._interactive;
      this.headingLevel = this._headingLevel;
      this.actionsAlign = this._actionsAlign;
      this.mediaRatio = this._mediaRatio;
      this.customColor = this._customColor;
   }

   _renderHeading() {
      this._targetEl?.removeEventListener('click', this._handleTargetClick);
      this._targetEl = null;
      this.$title.replaceChildren();

      const clickable = this.clickable;
      this.classList.toggle('is-clickable', clickable);

      if (clickable) {
         let target;
         if (this._href) {
            target = document.createElement('a');
            target.href = slice.href(this._href);
            if (this._target) {
               target.target = this._target;
               if (this._target === '_blank') target.rel = 'noopener noreferrer';
            }
         } else {
            target = document.createElement('button');
            target.type = 'button';
            if (this._selectable) target.setAttribute('aria-pressed', String(this._selected));
         }
         target.className = 'slice-card__target';
         // With no title, the target still needs a name: it is the card's only control.
         const name = this._title || this._ariaLabel || this._subtitle;
         target.textContent = this._title || '';
         if (!this._title) target.setAttribute('aria-label', name || 'Open');
         else if (this._ariaLabel) target.setAttribute('aria-label', this._ariaLabel);
         target.addEventListener('click', this._handleTargetClick);
         this.$title.appendChild(target);
         this._targetEl = target;
      } else if (this._title) {
         this.$title.textContent = this._title;
      }
      this.$title.hidden = !this._title && !clickable;
      this.$title.classList.toggle('is-unlabelled', !this._title);

      this.$subtitle.textContent = this._subtitle;
      this.$subtitle.hidden = !this._subtitle;
      this._renderState();
   }

   _renderBody() {
      this.$text.textContent = this._text;
      this.$text.hidden = !this._text;

      const list = (Array.isArray(this._content) ? this._content : [this._content])
         .filter((item) => item !== null && item !== undefined && item !== false && item !== '');
      const nodes = list.map((item) => {
         if (item instanceof Node) return item;
         const p = document.createElement('p');
         p.className = 'slice-card__paragraph';
         p.textContent = String(item);
         return p;
      });
      // Nodes that are gone are destroyed with what is inside them; nodes kept keep their state.
      this._destroyNodes(this._contentNodes.filter((n) => !nodes.includes(n)));
      this.$content.replaceChildren(...nodes);
      this._contentNodes = nodes;
      this.$content.hidden = nodes.length === 0;
   }

   _renderState() {
      this.classList.toggle('is-disabled', this._disabled);
      this.classList.toggle('is-loading', this._loading);
      this.classList.toggle('is-selected', this._selected);
      if (this._disabled) this.setAttribute('aria-disabled', 'true');
      else this.removeAttribute('aria-disabled');
      if (this._loading) this.setAttribute('aria-busy', 'true');
      else this.removeAttribute('aria-busy');
      this.$skeleton.hidden = !this._loading;

      const target = this._targetEl;
      if (target) {
         const off = this._disabled || this._loading;
         if (target.tagName === 'BUTTON') target.disabled = off;
         else if (off) {
            target.removeAttribute('href');
            target.setAttribute('aria-disabled', 'true');
         } else {
            target.href = slice.href(this._href);
            target.removeAttribute('aria-disabled');
         }
      }
      for (const node of this._actionNodes) {
         if (this._ownActions.has(node)) node.disabled = this._disabled || node._cardActionDisabled === true;
      }
   }

   async _renderMedia() {
      const token = ++this._tokens.media;
      this._destroyIn(this.$media);
      this.$media.classList.remove('has-image', 'has-icon');

      if (this._image) {
         const img = document.createElement('img');
         img.className = 'slice-card__image';
         img.alt = this._imageAlt;
         img.loading = 'lazy';
         img.decoding = 'async';
         img.addEventListener('error', () => {
            if (token !== this._tokens.media) return;
            // A broken image falls back to the icon, or to no media at all.
            img.remove();
            this.$media.classList.remove('has-image');
            if (this._iconName(this._icon)) this._buildMediaIcon(token);
            else this.$media.hidden = true;
         }, { once: true });
         img.src = this._image;
         this.$media.appendChild(img);
         this.$media.classList.add('has-image');
         this.$media.hidden = false;
         return;
      }
      if (this._iconName(this._icon)) {
         await this._buildMediaIcon(token);
         return;
      }
      this.$media.hidden = true;
   }

   async _buildMediaIcon(token) {
      const spec = typeof this._icon === 'object' ? this._icon : {};
      const icon = await slice.build('Icon', {
         name: this._iconName(this._icon),
         size: spec.size || 'var(--slice-card-icon-size)',
         color: spec.color || 'currentColor',
      });
      if (token !== this._tokens.media || !this._ready) {
         if (icon) slice.controller.destroyComponent(icon);
         return;
      }
      if (!icon) return;
      this.$media.appendChild(icon);
      this.$media.classList.add('has-icon');
      this.$media.hidden = false;
   }

   async _renderMark() {
      const token = ++this._tokens.mark;
      this._destroyIn(this.$mark);
      const name = this._iconName(this._headerIcon);
      if (!name) {
         this.$mark.hidden = true;
         return;
      }
      const spec = typeof this._headerIcon === 'object' ? this._headerIcon : {};
      const icon = await slice.build('Icon', { name, size: spec.size || '20px', color: spec.color || 'currentColor' });
      if (token !== this._tokens.mark || !this._ready) {
         if (icon) slice.controller.destroyComponent(icon);
         return;
      }
      if (!icon) return;
      this.$mark.appendChild(icon);
      this.$mark.hidden = false;
   }

   async _renderBadge() {
      const token = ++this._tokens.badge;
      this._destroyIn(this.$badge);
      const spec = this._badgeProps(this._badge);
      if (!spec) {
         this.$badge.hidden = true;
         return;
      }
      const badge = await slice.build('Badge', spec);
      if (token !== this._tokens.badge || !this._ready) {
         if (badge) slice.controller.destroyComponent(badge);
         return;
      }
      if (!badge) return;
      this.$badge.appendChild(badge);
      this.$badge.hidden = false;
   }

   _badgeProps(value) {
      if (value === null || value === undefined || value === '') return null;
      if (typeof value === 'number') return { value, tone: 'accent' };
      if (typeof value === 'string') return { label: value, tone: 'accent' };
      if (typeof value === 'object') {
         // `variant` used to carry the meaning; Badge now calls it `tone`.
         const { variant, ...rest } = value;
         const tone = BADGE_VARIANTS.includes(value.tone) ? value.tone : BADGE_VARIANTS.includes(variant) ? variant : 'accent';
         return { ...rest, tone, ...(variant && !BADGE_VARIANTS.includes(variant) ? { variant } : {}) };
      }
      return null;
   }

   async _renderActions() {
      const token = ++this._tokens.actions;
      const built = [];
      const own = [];
      const buttonSize = this._size === 'lg' ? 'md' : 'sm';
      for (const action of this._actions) {
         if (!action) continue;
         if (action instanceof Node) {
            built.push(action);
            continue;
         }
         if (typeof action !== 'object' || action.hidden) continue;
         const caption = action.value ?? action.text ?? action.label ?? '';
         const props = {
            value: String(caption),
            variant: action.variant || 'outlined',
            size: action.size || buttonSize,
            disabled: this._disabled || action.disabled === true,
            onClick: () => {
               if (this._disabled) return;
               return action.onClick?.({ card: this, action });
            },
         };
         if (action.icon) props.icon = action.icon;
         if (action.color || action.customColor) props.customColor = action.customColor || action.color;
         if (action.className) props.className = action.className;
         const button = await slice.build('Button', props);
         if (!button) continue;
         button._cardActionDisabled = action.disabled === true;
         own.push(button);
         if (token !== this._tokens.actions || !this._ready) {
            this._destroyNodes(own);
            return;
         }
         built.push(button);
      }
      this._destroyNodes(this._actionNodes.filter((n) => this._ownActions.has(n)));
      this.$footer.replaceChildren(...built);
      this._actionNodes = built;
      this._ownActions = new Set(own);
      this.$footer.hidden = built.length === 0;
   }

   // ── Events ─────────────────────────────────────────────────────

   _handleTargetClick(event) {
      if (this._disabled || this._loading) {
         event.preventDefault();
         return;
      }
      if (this._selectable) {
         this.selected = !this._selected;
         this._onSelect?.(this._selected, { card: this });
         this.dispatchEvent(new CustomEvent('card-select', { bubbles: true, detail: { selected: this._selected } }));
      }
      this._onClick?.({ card: this, event });
   }

   // ── Helpers ────────────────────────────────────────────────────

   _iconName(spec) {
      if (!spec) return '';
      return typeof spec === 'string' ? spec : spec.name || '';
   }

   _destroyIn(container) {
      if (!container) return;
      slice.controller.destroyByContainer(container);
      container.replaceChildren();
   }

   _destroyNodes(nodes) {
      for (const node of nodes) {
         if (!node) continue;
         if (node.sliceId) slice.controller.destroyComponent(node);
         else slice.controller.destroyByContainer(node);
         node.remove();
      }
   }
}

customElements.define('slice-card', Card);