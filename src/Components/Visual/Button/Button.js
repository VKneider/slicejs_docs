// Warns once per deprecated prop name (kept module-scoped so each component
// reports a given alias only once per session).
const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
   if (_sliceDeprecated.has(oldName)) return;
   _sliceDeprecated.add(oldName);
   console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

import { applySize, applyClassName, SIZE_VALUES } from '../../shared/props.js';

export default class Button extends HTMLElement {

   static props = {
      value: {
         type: 'string',
         default: 'Button',
         required: false
      },
      // Visual style, all derived from theme tokens. `filled` preserves the
      // original solid look.
      variant: {
         type: 'string',
         default: 'filled',
         required: false,
         allowedValues: ['filled', 'outlined', 'ghost', 'soft', 'danger']
      },
      // Density. `md` is the default; `sm` is for dense toolbars and table rows.
      size: {
         type: 'string',
         default: 'md',
         required: false,
         // Generated from SIZE_VALUES so the runtime validation the framework
         // already performs checks against the shared list (shared/props.js).
         allowedValues: SIZE_VALUES
      },
      className: {
         type: 'string',
         default: '',
         required: false
      },
      // Canonical click handler. `onClickCallback` is kept as a deprecated alias.
      onClick: {
         type: 'function',
         default: null
      },
      onClickCallback: {
         type: 'function',
         default: null
      },
      customColor: {
         type: 'object',
         default: null
      },
      icon: {
         type: 'object',
         default: null
      },
      // A disabled button looks inert, leaves the Tab order and ignores clicks
      // (the handler lives on the wrapper, so it is checked there too).
      disabled: {
         type: 'boolean',
         default: false
      },
      // The accessible name when it should differ from the label, and the
      // only name of an icon-only button (value: '', icon set).
      ariaLabel: {
         type: 'string',
         default: ''
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$value = this.querySelector('.slice_button_value');
      this.$button = this.querySelector('.slice_button');
      this.$container = this.querySelector('.slice_button_container');

      // type="button" prevents accidental form submission when used inside a form.
      this.$button.setAttribute('type', 'button');

      // Listener is attached unconditionally; the handler is resolved at click
      // time so it works whether it arrived via onClick or the legacy alias.
      this.$container.addEventListener('click', async () => {
         if (this._disabled) return;
         if (this._onClick) await this._onClick();
      });

      slice.controller.setComponentProps(this, props);
   }

   async init() {
      await this.update();   // build the Icon child if `icon` is set
   }

   // Reconcile the Icon child with the current `icon` prop, in place. The setter
   // updates an existing icon; building or removing one is async, so it lives here.
   // After changing `icon` post-build, call update() to apply the structural change.
   async update() {
      if (this._icon && !this.$icon) {
         this.$icon = await slice.build('Icon', {
            name: this._icon.name,
            iconStyle: this._icon.iconStyle,
            size: this._icon.size || '20px',
            color: this._icon.color || 'currentColor',
         });
         this.$button.insertBefore(this.$icon, this.$value);
      } else if (!this._icon && this.$icon) {
         slice.controller.destroyComponent(this.$icon);
         this.$icon = null;
      }
   }

   get onClick() {
      return this._onClick;
   }

   set onClick(value) {
      // Accept null/non-function to CLEAR the handler — needed to permanently
      // disable a button (the click listener lives on the wrapper container, so
      // the stale handler would otherwise keep firing).
      this._onClick = typeof value === 'function' ? value : null;
   }

   // Deprecated alias for onClick.
   set onClickCallback(value) {
      if (typeof value === 'function') {
         this._onClick ??= value;
         deprecate('onClickCallback', 'onClick');
      }
   }

   get icon() {
      return this._icon;
   }

   set icon(value) {
      // Accept a bare string as shorthand for { name }. Without this, the
      // obvious `icon: 'trash-bin'` left Icon with name: undefined and it
      // rendered an EMPTY <svg> with no warning at all - which reads as a
      // styling bug, not as a wrong argument.
      const icon = typeof value === 'string' ? { name: value } : value;
      this._icon = icon;
      if (!this.$icon || !icon) return;   // appear/disappear handled in update()
      // Read from `icon`, never from `value`: on the shorthand path `value` is
      // still the raw string and `value.name` is undefined, which would blank
      // the icon this very setter is meant to apply.
      this.$icon.name = icon.name;
      this.$icon.iconStyle = icon.iconStyle;
      // Per-instance icon sizing/colour. Omitting them keeps the previous
      // behaviour (20px, `currentColor`); set them to make one Button's icon
      // differ from another's without a stylesheet override.
      if (icon.size) this.$icon.size = icon.size;
      if (icon.color) this.$icon.color = icon.color;
   }

   get disabled() {
      return this._disabled;
   }

   set disabled(value) {
      this._disabled = value === true;
      this.$button.disabled = this._disabled;
      this.toggleAttribute('disabled', this._disabled);
   }

   get variant() {
      return this._variant;
   }

   set variant(value) {
      const allowed = ['filled', 'outlined', 'ghost', 'soft', 'danger'];
      const next = allowed.includes(value) ? value : 'filled';
      if (this._variant) {
         this.$button.classList.remove('slice_button--' + this._variant);
      }
      this._variant = next;
      this.$button.classList.add('slice_button--' + next);
   }

   get size() {
      return this._size;
   }

   set size(value) {
      // One list, from shared/props.js — not a literal in this file. An
      // unknown value falls back rather than rendering at whatever the next
      // rule in the stylesheet happens to say.
      const next = applySize(this, value, 'md');

      if (this._size) {
         this.$button.classList.remove('slice_button--' + this._size);
      }
      this._size = next;
      this.$button.classList.add('slice_button--' + next);
   }

   get className() {
      return this._className;
   }

   /**
    * The escape hatch: mark this instance so YOUR css can find it.
    *
    * Added to the component's own classes, never substituted for them — a
    * className that replaced them would strip the control of its structural
    * classes and break it in silence.
    */
   set className(value) {
      applyClassName(this, value);
      this._className = typeof value === 'string' ? value : '';
   }

   get value() {
      return this._value;
   }

   set value(value) {
      this._value = value;
      this.$value.textContent = value;
      // No label: an icon-only button. The empty label leaves the layout so
      // the icon sits centred in a square.
      this.$value.hidden = !value;
      this._applyName();
   }

   get ariaLabel() {
      return this._ariaLabel;
   }

   set ariaLabel(value) {
      this._ariaLabel = value ? String(value) : '';
      this._applyName();
   }

   // Keep an accessible name even for icon-only buttons.
   _applyName() {
      const name = this._ariaLabel || this._value;
      if (name) this.$button.setAttribute('aria-label', name);
      else this.$button.removeAttribute('aria-label');
   }

   get customColor() {
      return this._customColor;
   }

   // Canonical shape: { background, text }. Legacy { button, label } still works.
   set customColor(value) {
      this._customColor = value;
      if (!value) return;

      if (value.button || value.label) {
         deprecate('customColor { button, label }', 'customColor { background, text }');
      }

      const background = value.background ?? value.button;
      const text = value.text ?? value.label;

      if (background) {
         this.$button.style.backgroundColor = background;
         this.$button.style.borderColor = background;
      }
      if (text) {
         this.$button.style.color = text;
         this.$value.style.color = text;
         if (this.$icon) {
            this.$icon.style.color = text;
         }
      }
   }
}

customElements.define('slice-button', Button);