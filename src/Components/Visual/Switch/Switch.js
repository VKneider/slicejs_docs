let _sliceSwitchSeq = 0;
const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
   if (_sliceDeprecated.has(oldName)) return;
   _sliceDeprecated.add(oldName);
   console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

export default class Switch extends HTMLElement {

   static props = {
      checked: {
         type: 'boolean',
         default: false
      },
      disabled: {
         type: 'boolean',
         default: false
      },
      label: {
         type: 'string',
         default: null
      },
      labelPlacement: {
         type: 'string',
         default: 'right'
      },
      customColor: {
         type: 'object',
         default: null
      },
      // Same family as Checkbox (and RadioGroup), so the three selection
      // controls read as one set inside a Form. `danger` is for a switch that
      // turns on something destructive (§3.3); `plain` drops the container chip.
      // Literal arrays: `slice types generate` only reads literals (§10).
      variant: {
         type: 'string',
         default: 'default',
         allowedValues: ['default', 'outlined', 'soft', 'danger', 'plain']
      },
      size: {
         type: 'string',
         default: 'md',
         allowedValues: ['sm', 'md', 'lg']
      },
      // Canonical change handler. `toggle` is kept as a deprecated alias.
      onChange: {
         type: 'function',
         default: null
      },
      toggle: {
         type: 'function',
         default: null
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$container = this.querySelector('.slice_switch_container');
      this.$switch = this.querySelector('.slice_switch');
      this.$checkbox = this.querySelector('input');
      // A checkbox that announces itself as a switch ("on/off", not
      // "checked/not checked"). The native element keeps focus, Space and
      // form behaviour; only the role changes.
      this.$checkbox.setAttribute('role', 'switch');

      slice.controller.setComponentProps(this, props);
   }

   init() {
      // Set initial checked state (default applied by static props)
      this.$checkbox.checked = this.checked;

      // Set initial disabled state
      this.$checkbox.disabled = this.disabled;

      // Set label if provided
      if (this.label) {
         this.createLabel();
      }

      // Set label placement (default is 'right')
      this.applyLabelPlacement();

      // Apply custom color if provided
      if (this.customColor) {
         this.applyCustomColor();
      }

      // Set up change listener
      this.$checkbox.addEventListener('change', (e) => {
         this.checked = e.target.checked;
         if (this._onChange) this._onChange(this.checked);
      });
   }

   createLabel() {
      if (!this.querySelector('.switch_label')) {
         // Associate the text label with the input via its [for] attribute, so clicking the
         // text toggles the switch. A bare sibling <label> forwards clicks to
         // nothing. Same fix Checkbox already had: its input sits
         // inside a wrapping <label> for the slider, but the TEXT label is a
         // separate sibling that forwards clicks nowhere.
         // Kept as a sibling (not wrapping the input) so applyLabelPlacement's
         // flex layout on .slice_switch is unaffected.
         if (!this.$checkbox.id) this.$checkbox.id = `slice-switch-${++_sliceSwitchSeq}`;
         const label = document.createElement('label');
         label.classList.add('switch_label');
         label.setAttribute('for', this.$checkbox.id);
         label.textContent = this.label;
         this.$switch.appendChild(label);
      }
   }

   applyLabelPlacement() {
      const placement = this.labelPlacement;
      switch (placement) {
         case 'left':
            this.$switch.style.flexDirection = 'row-reverse';
            break;
         case 'right':
            this.$switch.style.flexDirection = 'row';
            break;
         case 'top':
            this.$switch.style.flexDirection = 'column-reverse';
            break;
         case 'bottom':
            this.$switch.style.flexDirection = 'column';
            break;
         default:
            this.$switch.style.flexDirection = 'row';
      }
   }

   applyCustomColor() {
      const v = this._customColor;
      if (typeof v === 'string') deprecate('customColor: string', 'customColor { accent }');
      const accent = typeof v === 'string' ? v : (v && (v.accent ?? v.background)) || null;
      if (accent) {
         // `--success-color` keeps the historical behaviour (and anything that
         // reads it). `--slice-switch-custom-accent` is what makes the colour
         // win over a variant's own accent, which is declared on the container.
         this.style.setProperty('--success-color', accent);
         this.style.setProperty('--slice-switch-custom-accent', accent);
      }
   }

   // Getters and setters for dynamic prop updates
   get checked() {
      return this._checked;
   }

   set checked(value) {
      this._checked = value;
      if (this.$checkbox) {
         this.$checkbox.checked = value;
      }
   }

   get disabled() {
      return this._disabled;
   }

   set disabled(value) {
      this._disabled = value;
      if (this.$checkbox) {
         this.$checkbox.disabled = value;
      }
      
      const slider = this.querySelector('.slider');
      if (slider) {
         slider.classList.toggle('disabled', value);
      }
   }

   get label() {
      return this._label;
   }

   set label(value) {
      this._label = value;
      const existingLabel = this.querySelector('.switch_label');
      
      if (value) {
         if (existingLabel) {
            existingLabel.textContent = value;
         } else {
            this.createLabel();
         }
      } else if (existingLabel) {
         existingLabel.remove();
      }
   }

   get labelPlacement() {
      return this._labelPlacement;
   }

   set labelPlacement(value) {
      this._labelPlacement = value;
      this.applyLabelPlacement();
   }

   get customColor() {
      return this._customColor;
   }

   set customColor(value) {
      this._customColor = value;
      if (value) {
         this.applyCustomColor();
      }
   }

   get variant() {
      return this._variant;
   }

   set variant(value) {
      // Idempotent swap, list read back from `static props` (§3.3, §10).
      const { allowedValues, default: fallback } = Switch.props.variant;
      const next = allowedValues.includes(value) ? value : fallback;
      for (const v of allowedValues) this.$container.classList.remove('slice_switch--' + v);
      this.$container.classList.add('slice_switch--' + next);
      this._variant = next;
   }

   get size() {
      return this._size;
   }

   set size(value) {
      // `data-size` on the host; Switch.css decides what the values mean.
      const { allowedValues, default: fallback } = Switch.props.size;
      const next = allowedValues.includes(value) ? value : fallback;
      this.dataset.size = next;
      this._size = next;
   }

   get onChange() {
      return this._onChange;
   }

   set onChange(value) {
      // Accept null/non-function to CLEAR the handler, like Checkbox. Safe with
      // the `toggle` alias: defaults are applied before provided props, and the
      // alias only fills the field while it is still empty (??=).
      this._onChange = typeof value === 'function' ? value : null;
   }

   // Deprecated alias for onChange.
   get toggle() {
      return this._onChange;
   }

   set toggle(value) {
      if (typeof value === 'function') {
         this._onChange ??= value;
         deprecate('toggle', 'onChange');
      }
   }
}

customElements.define('slice-switch', Switch);