// Callout — a highlighted passage inside content: a note, a tip, something important,
// a warning before a step, a definition. It is part of what the page *says*, so it is
// never a live region and never goes away by itself; that is the difference with Alert,
// which reports what just happened (saved, failed, undo).
//
//   await slice.build('Callout', { tone: 'info', title: 'Note', text: 'A short note for this example.' });
//   await slice.build('Callout', {
//     tone: 'warning', title: 'Before you start',
//     content: ['Back up your data.', linkToTheGuide],     // text becomes paragraphs; nodes go as they are
//   });
//
// Two choices, as in Alert and Badge:
//   tone     what it MEANS: neutral, accent, info, success, warning, danger
//   variant  how LOUD it is: soft (a tint, the default), outlined, ghost (only the side bar)

import { destroyNodes, iconName, toNodes } from '../../shared/content/nodes.js';

const TONE_ICONS = {
   neutral: '',
   accent: 'star',
   info: 'info-circle',
   success: 'check-circle',
   warning: 'exclamation-circle',
   danger: 'close-circle',
};

let calloutCount = 0;

export default class Callout extends HTMLElement {
   static props = {
      tone: { type: 'string', default: 'info', allowedValues: ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] },
      variant: { type: 'string', default: 'soft', allowedValues: ['soft', 'outlined', 'ghost'] },
      size: { type: 'string', default: 'md', allowedValues: ['sm', 'md'] },
      // A short label in bold: "Note", "Tip", "Before you start".
      title: { type: 'string', default: '' },
      // One paragraph of plain text.
      text: { type: 'string', default: '' },
      // More: a string (a paragraph), a node, a component, or an array of them.
      content: { type: 'any', default: null },
      // An Icon name or { name }; '' for the tone's own, false for none.
      icon: { type: 'any', default: '' },
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.classList.add('slice-callout');
      this.$box = this.querySelector('.slice-callout__box');
      this.$icon = this.querySelector('.slice-callout__icon');
      this.$title = this.querySelector('.slice-callout__title');
      this.$text = this.querySelector('.slice-callout__text');
      this.$content = this.querySelector('.slice-callout__content');

      this._tone = 'info';
      this._variant = 'soft';
      this._size = 'md';
      this._title = '';
      this._text = '';
      this._content = null;
      this._icon = /** @type {unknown} */ ('');

      // Internal state: never a prop's `_<name>`.
      this._ready = false;
      this._contentNodes = /** @type {Node[]} */ ([]);
      this._iconComponent = /** @type {any} */ (null);
      this._iconShown = '';
      this._iconRev = 0;

      calloutCount += 1;
      this.$title.id = `slice-callout-title-${calloutCount}`;

      slice.controller.setComponentProps(this, props);
      this._paint();
   }

   async init() {
      this._ready = true;
      this._paintContent();
      await this._paintIcon();
   }

   beforeDestroy() {
      this._ready = false;
      this._iconRev++;
      if (this._iconComponent) slice.controller.destroyComponent(this._iconComponent);
      this._iconComponent = null;
      destroyNodes(this._contentNodes);
      this._contentNodes = [];
   }

   // ── Props ──────────────────────────────────────────────────────

   get tone() { return this._tone; }
   set tone(value) {
      const { allowedValues, default: fallback } = Callout.props.tone;
      this._tone = allowedValues.includes(value) ? value : fallback;
      this._paint();
      if (this._ready) this._paintIcon();
   }

   get variant() { return this._variant; }
   set variant(value) {
      const { allowedValues, default: fallback } = Callout.props.variant;
      this._variant = allowedValues.includes(value) ? value : fallback;
      this._paint();
   }

   get size() { return this._size; }
   set size(value) {
      const { allowedValues, default: fallback } = Callout.props.size;
      this._size = allowedValues.includes(value) ? value : fallback;
      this._paint();
   }

   get title() { return this._title; }
   set title(value) { this._title = value == null ? '' : String(value); this._paint(); }

   get text() { return this._text; }
   set text(value) { this._text = value == null ? '' : String(value); this._paint(); }

   get content() { return this._content; }
   set content(value) { this._content = value ?? null; if (this._ready) this._paintContent(); }

   get icon() { return this._icon; }
   set icon(value) {
      this._icon = value === false ? false : (value || '');
      if (this._ready) this._paintIcon();
   }

   // ── Painting ───────────────────────────────────────────────────

   _paint() {
      if (!this.$box) return;
      this.dataset.tone = this._tone;
      this.dataset.variant = this._variant;
      this.dataset.size = this._size;
      this.$title.textContent = this._title;
      this.$title.hidden = !this._title;
      this.$text.textContent = this._text;
      this.$text.hidden = !this._text;
      // The title names the note for screen readers ("Note, …"); without one it is unnamed.
      if (this._title) this.$box.setAttribute('aria-labelledby', this.$title.id);
      else this.$box.removeAttribute('aria-labelledby');
      this.classList.toggle('has-title', !!this._title);
   }

   _paintContent() {
      const nodes = toNodes(this._content, 'slice-callout__paragraph');
      destroyNodes(this._contentNodes.filter((node) => !nodes.includes(node)));
      this.$content.replaceChildren(...nodes);
      this._contentNodes = nodes;
      this.$content.hidden = nodes.length === 0;
   }

   async _paintIcon() {
      const name = this._icon === false ? '' : (iconName(this._icon) || TONE_ICONS[this._tone] || '');
      this.$icon.hidden = !name;
      this.classList.toggle('has-icon', !!name);
      if (!name) {
         this._iconShown = '';
         return;
      }
      if (this._iconComponent) {
         if (this._iconShown !== name) this._iconComponent.name = name;
         this._iconShown = name;
         return;
      }
      const rev = ++this._iconRev;
      const icon = await slice.build('Icon', { name, size: this._size === 'sm' ? '18px' : '20px', color: 'currentColor' });
      if (!icon) return;
      if (!this._ready || rev !== this._iconRev || this._iconComponent) {
         slice.controller.destroyComponent(icon);
         return;
      }
      this._iconComponent = icon;
      this._iconShown = name;
      // The tone may have changed while it was being built.
      const current = this._icon === false ? '' : (iconName(this._icon) || TONE_ICONS[this._tone] || '');
      if (current && current !== name) {
         icon.name = current;
         this._iconShown = current;
      }
      this.$icon.replaceChildren(icon);
   }
}

customElements.define('slice-callout', Callout);
