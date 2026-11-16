const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
   if (_sliceDeprecated.has(oldName)) return;
   _sliceDeprecated.add(oldName);
   console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

// The enumerated vocabularies (`variant`, `size`) are declared as LITERAL arrays
// inside `static props` below, and the setters read the accepted set back from
// there. There is no module-level list to keep in sync.
//
// That is deliberate, not stylistic. `slice types generate` walks this file's AST
// and only understands literal values, so `allowedValues: SOME_CONST` silently
// degrades the generated union to plain `string`. Declaring the list inline keeps
// ONE source of truth that both the runtime fallback and the generated `.d.ts`
// union read, so the two cannot disagree. See COMPONENT_API_STANDARDS.md §10 and
// BACKLOG.md.

// Guarantees a unique, stable id for the input so its text label can point at it
// via `for`. Not derived from sliceId because sliceId isn't set during init()
// unless one was explicitly passed to slice.build().
let _sliceCheckboxSeq = 0;

export default class Checkbox extends HTMLElement {

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
      // Mirrors Button's action family (`danger` is the destructive-confirmation
      // look, §3.3) plus `plain`, which drops the decorative container chip.
      variant: {
         type: 'string',
         default: 'default',
         required: false,
         allowedValues: ['default', 'outlined', 'soft', 'danger', 'plain']
      },
      // The same density vocabulary Button and Input expose. Named `size` (not
      // `density`) and swapped idempotently (§3.3). A literal, not a reference to
      // SIZE_VALUES in shared/props.js, so the generated union survives — see the note at the
      // top of this file and the backlog entry about the generator.
      size: {
         type: 'string',
         default: 'md',
         required: false,
         allowedValues: ['sm', 'md', 'lg']
      },
      // Canonical change handler (§3.1). Fired with the new checked state.
      onChange: {
         type: 'function',
         default: null
      },
      customColor: {
         type: 'object',
         default: null
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$container = this.querySelector('.slice_checkbox_container');
      this.$checkbox = this.querySelector('.slice_checkbox');
      this.$checkmark = this.querySelector('.checkmark');
      this.$input = this.querySelector('input');

      slice.controller.setComponentProps(this, props);
   }

   init() {
      // Set initial checked state (default applied by static props)
      this.$input.checked = this.checked;

      // Set initial disabled state
      this.$input.disabled = this.disabled;

      // Apply disabled styling if needed
      if (this.disabled) {
         this.$checkmark.classList.add('disabled');
      }

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
      this.$input.addEventListener('change', (e) => {
         this.checked = e.target.checked;
         if (typeof this._onChange === 'function') this._onChange(e.target.checked);
      });
   }

   createLabel() {
      if (!this.querySelector('.checkbox_label')) {
         // Associate the text label with the input via `for` so clicking the text
         // toggles the box (a bare sibling <label> forwards clicks to nothing).
         // Kept as a sibling (not wrapping the input) so applyLabelPlacement's
         // flex layout on .slice_checkbox is unaffected.
         if (!this.$input.id) this.$input.id = `slice-checkbox-${++_sliceCheckboxSeq}`;
         const label = document.createElement('label');
         label.classList.add('checkbox_label');
         label.setAttribute('for', this.$input.id);
         label.textContent = this.label;
         this.$checkbox.appendChild(label);
      }
   }

   applyLabelPlacement() {
      const placement = this.labelPlacement;
      switch (placement) {
         case 'left':
            this.$checkbox.style.flexDirection = 'row-reverse';
            break;
         case 'right':
            this.$checkbox.style.flexDirection = 'row';
            break;
         case 'top':
            this.$checkbox.style.flexDirection = 'column-reverse';
            break;
         case 'bottom':
            this.$checkbox.style.flexDirection = 'column';
            break;
         default:
            this.$checkbox.style.flexDirection = 'row';
      }
   }

   applyCustomColor() {
      const v = this._customColor;
      if (typeof v === 'string') deprecate('customColor: string', 'customColor { accent }');
      const accent = typeof v === 'string' ? v : (v && (v.accent ?? v.background)) || null;
      if (accent) this.style.setProperty('--success-color', accent);
   }

   // Getters and setters for dynamic prop updates
   get checked() {
      return this._checked;
   }

   set checked(value) {
      this._checked = value;
      if (this.$input) {
         this.$input.checked = value;
      }
   }

   get disabled() {
      return this._disabled;
   }

   set disabled(value) {
      this._disabled = value;
      if (this.$input) {
         this.$input.disabled = value;
      }
      
      if (this.$checkmark) {
         this.$checkmark.classList.toggle('disabled', value);
      }
   }

   get label() {
      return this._label;
   }

   set label(value) {
      this._label = value;
      const existingLabel = this.querySelector('.checkbox_label');
      
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

   get variant() {
      return this._variant;
   }

   set variant(value) {
      // Idempotent swap: remove every known modifier before adding the next, and
      // fall back to the declared default on an unknown value (§3.3). The list
      // comes from `static props`, not a second copy here, so the runtime and the
      // generated union accept exactly the same set.
      const { allowedValues, default: fallback } = Checkbox.props.variant;
      const next = allowedValues.includes(value) ? value : fallback;
      if (this.$container) {
         for (const v of allowedValues) this.$container.classList.remove('slice_checkbox--' + v);
         this.$container.classList.add('slice_checkbox--' + next);
      }
      this._variant = next;
   }

   get size() {
      return this._size;
   }

   set size(value) {
      // `data-size` on the host; Checkbox.css decides what the values mean. Read
      // from `static props` for the same reason as `variant` above.
      const { allowedValues, default: fallback } = Checkbox.props.size;
      const next = allowedValues.includes(value) ? value : fallback;
      this.dataset.size = next;
      this._size = next;
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

   set onChange(value) {
      // Accept null/non-function to CLEAR the handler.
      this._onChange = typeof value === 'function' ? value : null;
   }

   get onChange() {
      return this._onChange;
   }
}

customElements.define('slice-checkbox', Checkbox);