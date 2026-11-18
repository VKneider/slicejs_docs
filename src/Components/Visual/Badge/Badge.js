// Badge — a status ("Paid", "Overdue"), a count (12) or a mark ("New") next
// to the thing it describes.
//
//   await slice.build('Badge', { label: 'Paid', tone: 'success' });
//   await slice.build('Badge', { value: 12, tone: 'danger', variant: 'filled' });
//   await slice.build('Badge', { label: 'Online', tone: 'success', indicator: true, pulse: true });
//
// Two separate choices, like the rest of the library:
//   tone     what it MEANS: neutral, accent, success, warning, danger, info.
//            Each follows its theme colour, so it means the same in any theme.
//   variant  how LOUD it is, with Button's names: soft (a tint, the default),
//            filled (the colour itself, for what must be seen) or outlined
//            (a line, for many badges side by side).
//
// Before tones, `variant` took the meaning ('success'…). It still does, with a
// note in the console, so nothing built with the old name breaks.

const TONES = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'];
const VARIANTS = ['soft', 'filled', 'outlined'];
const SIZES = ['sm', 'md', 'lg'];
const SHAPES = ['pill', 'rounded'];

let warnedVariantTone = false;

export default class Badge extends HTMLElement {
   static props = {
      tone: { type: 'string', default: 'neutral', allowedValues: TONES },
      variant: { type: 'string', default: 'soft', allowedValues: [...VARIANTS, ...TONES] },
      size: { type: 'string', default: 'md', allowedValues: SIZES },
      shape: { type: 'string', default: 'pill', allowedValues: SHAPES },
      label: { type: 'string', default: '' },
      // A count. Wins over `label`, and is capped by `max` ("99+").
      value: { type: 'number', default: null },
      max: { type: 'number', default: 99 },
      // A count of 0 hides the badge, unless this is on.
      showZero: { type: 'boolean', default: false },
      // An Icon name before the text.
      icon: { type: 'string', default: '' },
      // A small dot before the text: a live status ("● Online").
      indicator: { type: 'boolean', default: false },
      // The indicator breathes, for something happening now ("● Live").
      pulse: { type: 'boolean', default: false },
      // Only a dot, no text. `label` becomes its accessible name.
      dot: { type: 'boolean', default: false },
      // A colour of your own (a category, a team) instead of a tone.
      color: { type: 'string', default: '' },
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.classList.add('slice-badge');
      this.$body = this.querySelector('.slice-badge__body');
      this.$indicator = this.querySelector('.slice-badge__indicator');
      this.$icon = this.querySelector('.slice-badge__icon');
      this.$text = this.querySelector('.slice-badge__text');

      this._tone = 'neutral';
      this._appearance = 'soft';
      this._size = 'md';
      this._shape = 'pill';
      this._label = '';
      this._value = null;
      this._max = 99;
      this._showZero = false;
      this._iconName = '';
      this._indicator = false;
      this._pulse = false;
      this._dot = false;
      this._color = '';
      this._iconComponent = null;
      this._ready = false;

      slice.controller.setComponentProps(this, props);
      this._paint();
   }

   init() {
      this._ready = true;
      this._paintIcon();
   }

   beforeDestroy() {
      this._ready = false;
      if (this._iconComponent) slice.controller.destroyComponent(this._iconComponent);
      this._iconComponent = null;
   }

   // ── Props ──────────────────────────────────────────────────────

   get tone() { return this._tone; }
   set tone(value) {
      this._tone = TONES.includes(value) ? value : 'neutral';
      this._paint();
   }

   get variant() { return this._appearance; }
   set variant(value) {
      if (TONES.includes(value)) {
         // The old meaning of `variant`: take it as the tone.
         if (!warnedVariantTone && value !== 'neutral') {
            warnedVariantTone = true;
            slice.logger?.warn?.('Badge', `variant: '${value}' is a tone now. Use tone: '${value}' (variant is soft, filled or outlined).`);
         }
         this._tone = value;
      } else {
         this._appearance = VARIANTS.includes(value) ? value : 'soft';
      }
      this._paint();
   }

   get size() { return this._size; }
   set size(value) { this._size = SIZES.includes(value) ? value : 'md'; this._paint(); }

   get shape() { return this._shape; }
   set shape(value) { this._shape = SHAPES.includes(value) ? value : 'pill'; this._paint(); }

   get label() { return this._label; }
   set label(value) { this._label = value == null ? '' : String(value); this._paint(); }

   get value() { return this._value; }
   set value(value) {
      const n = value === null || value === undefined || value === '' ? null : Number(value);
      this._value = Number.isFinite(n) ? n : null;
      this._paint();
   }

   get max() { return this._max; }
   set max(value) { this._max = Number(value) > 0 ? Number(value) : 99; this._paint(); }

   get showZero() { return this._showZero; }
   set showZero(value) { this._showZero = value === true; this._paint(); }

   get icon() { return this._iconName; }
   set icon(value) { this._iconName = value ? String(value) : ''; this._ready && this._paintIcon(); }

   get indicator() { return this._indicator; }
   set indicator(value) { this._indicator = value === true; this._paint(); }

   get pulse() { return this._pulse; }
   set pulse(value) { this._pulse = value === true; this._paint(); }

   get dot() { return this._dot; }
   set dot(value) { this._dot = value === true; this._paint(); }

   get color() { return this._color; }
   set color(value) { this._color = value ? String(value) : ''; this._paint(); }

   /** The text it shows ("99+" for a value over max). */
   get text() {
      if (this._value !== null) return this._value > this._max ? `${this._max}+` : String(this._value);
      return this._label;
   }

   // ── Painting ───────────────────────────────────────────────────

   _paint() {
      if (!this.$body) return;
      this.dataset.tone = this._tone;
      this.dataset.variant = this._appearance;
      this.dataset.size = this._size;
      this.dataset.shape = this._shape;

      // A colour of your own takes the tone's place.
      if (this._color) this.style.setProperty('--slice-badge-color', this._color);
      else this.style.removeProperty('--slice-badge-color');
      this.classList.toggle('has-color', !!this._color);

      const dotOnly = this._dot;
      const text = dotOnly ? '' : this.text;
      const isCount = this._value !== null && !dotOnly;
      const emptyCount = isCount && this._value === 0 && !this._showZero;

      this.classList.toggle('is-dot', dotOnly);
      this.classList.toggle('is-count', isCount);
      this.$text.textContent = text;
      this.$text.hidden = !text;
      this.$indicator.hidden = dotOnly || !this._indicator;
      this.classList.toggle('is-pulsing', this._pulse && (this._indicator || dotOnly));

      // A dot paints nothing to read: its name is the label.
      if (dotOnly) {
         this.$body.setAttribute('role', 'img');
         this.$body.setAttribute('aria-label', this._label || 'New');
      } else {
         this.$body.removeAttribute('role');
         this.$body.removeAttribute('aria-label');
      }

      this.hidden = emptyCount || (!dotOnly && !text && !this._iconName);
   }

   async _paintIcon() {
      const name = this._iconName;
      if (!name) {
         if (this._iconComponent) slice.controller.destroyComponent(this._iconComponent);
         this._iconComponent = null;
         this.$icon.replaceChildren();
         this.$icon.hidden = true;
         this._paint();
         return;
      }
      if (this._iconComponent) {
         this._iconComponent.name = name;
         this.$icon.hidden = false;
         this._paint();
         return;
      }
      const icon = await slice.build('Icon', { name, size: '1.1em' });
      if (!icon) return;
      if (!this._ready || this._iconName !== name || this._iconComponent) {
         slice.controller.destroyComponent(icon);
         if (this._ready && this._iconComponent && this._iconName) this._iconComponent.name = this._iconName;
         return;
      }
      this._iconComponent = icon;
      this.$icon.replaceChildren(icon);
      this.$icon.hidden = false;
      this._paint();
   }
}

customElements.define('slice-badge', Badge);