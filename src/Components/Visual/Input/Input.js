import { applySize, applyClassName, SIZE_VALUES } from '../../shared/props.js';
import { texts } from '../../shared/text/texts.js';
import {
   fieldId, validationMessage, compileConditions, countText,
   VALIDATE_ON, FIELD_VARIANTS, LABEL_PLACEMENTS,
} from '../../shared/validation/fieldRules.js';

// A single-line text field.
//
// The field is a real <input>, labelled by a real <label for>, so it takes part
// in a native <form>, autofill, password managers and screen readers without
// help. Around it:
//
//   label        floats inside the field and rises above it on focus or a
//                value (labelPlacement: 'floating'), or sits above it ('above')
//   variant      outlined | filled | ghost, the same names Select uses
//   size         sm | md | lg, the same heights as Select
//   icon / prefix / suffix, a clear button, the password reveal toggle
//   help / error under the field, and a character counter
//
// Validation is shared with Textarea (shared/validation/fieldRules.js): required, the native
// formats (email, url, number ranges, pattern), lengths, the legacy
// `conditions`, and your own `validator`. An error shows when the person
// leaves the field (or when validate() is called), and from then on it updates
// as they type, so it disappears the moment the value is fixed.
//
// Older API, still supported: `placeholder` alone is the floating label (as it
// always was), `conditions`, validateValue(), triggerError(), triggerSuccess(),
// clear(), and the .slice_input / .input_area / .slice_input_placeholder
// classes.

const TEXTS = {
   clear: 'Clear',
   togglePassword: 'Toggle password visibility',
};

// Spanish mirrors TEXTS key by key; the app can override any of them with its dictionary.
const ES = {
   clear: 'Borrar',
   togglePassword: 'Mostrar u ocultar la contraseña',
};

const t = texts('slice.input', { en: TEXTS, es: ES });

export default class Input extends HTMLElement {

   static props = {
      label: { type: 'string', default: '' },
      labelPlacement: { type: 'string', default: 'floating', allowedValues: ['floating', 'above'] },
      placeholder: { type: 'string', default: '', required: false },
      value: { type: 'string', default: '', required: false },
      type: { type: 'string', default: 'text' },
      name: { type: 'string', default: '' },
      autocomplete: { type: 'string', default: '' },
      inputmode: { type: 'string', default: '' },
      min: { type: 'any', default: null },
      max: { type: 'any', default: null },
      step: { type: 'any', default: null },
      minlength: { type: 'number', default: null },
      maxlength: { type: 'number', default: null },
      pattern: { type: 'string', default: '' },
      // The same list Button is validated against.
      size: { type: 'string', default: 'md', required: false, allowedValues: SIZE_VALUES },
      variant: { type: 'string', default: 'outlined', allowedValues: ['outlined', 'filled', 'ghost'] },
      icon: { type: 'string', default: '' },
      prefix: { type: 'string', default: '' },
      suffix: { type: 'string', default: '' },
      clearable: { type: 'boolean', default: false },
      secret: { type: 'boolean', default: false },
      showCount: { type: 'boolean', default: false },
      help: { type: 'string', default: '' },
      error: { type: 'string', default: '' },
      invalid: { type: 'boolean', default: false },
      required: { type: 'boolean', default: false },
      disabled: { type: 'boolean', default: false },
      readonly: { type: 'boolean', default: false },
      conditions: { type: 'object', default: null },
      conditionsMessage: { type: 'string', default: '' },
      validator: { type: 'function', default: null },
      messages: { type: 'object', default: null },
      validateOn: { type: 'string', default: 'blur', allowedValues: ['blur', 'input', 'manual'] },
      debounce: { type: 'number', default: 0 },
      ariaLabel: { type: 'string', default: '' },
      className: { type: 'string', default: '', required: false },
      // Per-instance overrides of any built-in text (see TEXTS).
      texts: { type: 'object', default: null },
      // Fired with the new value on every `input` event (after `debounce`).
      onChange: { type: 'function', default: null },
      // Enter pressed in the field: (value, event).
      onEnter: { type: 'function', default: null },
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$wrap = this.querySelector('.slice_input_wrap');
      this.$inputContainer = this.querySelector('.slice_input');
      this.$input = this.querySelector('input');
      this.$placeholder = this.querySelector('.slice_input_placeholder');
      this.$icon = this.querySelector('.slice_input_icon');
      this.$prefix = this.querySelector('.slice_input_prefix');
      this.$suffix = this.querySelector('.slice_input_suffix');
      this.$clear = this.querySelector('.slice_input_clear');
      this.$eyeIcon = this.querySelector('.slice_eye_icon');
      this.$footer = this.querySelector('.slice_input_footer');
      this.$message = this.querySelector('.slice_input_message');
      this.$count = this.querySelector('.slice_input_count');

      const id = fieldId('slice-input');
      this.$input.id = id;
      this.$placeholder.htmlFor = id;
      this.$message.id = `${id}-message`;

      this._label = '';
      this._labelPlacement = 'floating';
      this._placeholder = '';
      this._type = 'text';
      this._variant = 'outlined';
      this._icon = '';
      this._prefix = '';
      this._suffix = '';
      this._clearable = false;
      this._showCount = false;
      this._help = '';
      this._error = '';
      this._invalid = false;
      this._required = false;
      this._disabled = false;
      this._readonly = false;
      this._minlength = null;
      this._maxlength = null;
      this._conditionsTest = null;
      this._conditionsMessage = '';
      this._validator = null;
      this._messages = null;
      this._validateOn = 'blur';
      this._debounce = 0;
      this._ariaLabel = '';
      this._texts = {};
      this._onChange = null;
      this._onEnter = null;

      this._shownError = '';
      this._dirty = false;
      this._focused = false;
      this._iconEl = null;
      this._iconToken = 0;
      this._debounceTimer = null;
      this._shakeTimer = null;

      this._handleInput = this._handleInput.bind(this);
      this._handleFocus = this._handleFocus.bind(this);
      this._handleBlur = this._handleBlur.bind(this);
      this._handleKeyDown = this._handleKeyDown.bind(this);
      this._handleClear = this._handleClear.bind(this);
      this._handleContainerClick = this._handleContainerClick.bind(this);

      slice.controller.setComponentProps(this, props || {});
      this._syncLabel();
      this._syncAdornments();
      this._syncFooter();
   }

   init() {
      this.$input.addEventListener('input', this._handleInput);
      this.$input.addEventListener('focus', this._handleFocus);
      this.$input.addEventListener('blur', this._handleBlur);
      this.$input.addEventListener('keydown', this._handleKeyDown);
      this.$clear.addEventListener('click', this._handleClear);
      // Clicking the padding, the icon or a prefix focuses the field.
      this.$inputContainer.addEventListener('mousedown', this._handleContainerClick);

      if (this._secret && this._type === 'password') this.setupSecretToggle();
      this._applyTexts();
      // A language change repaints the clear button and the reveal toggle; the
      // value, the focused state and the error on screen stay as they are.
      slice.translator?.watch?.(this, () => this._applyTexts());
      this._syncFloat();
   }

   beforeDestroy() {
      window.clearTimeout(this._debounceTimer);
      window.clearTimeout(this._shakeTimer);
      this.$input.removeEventListener('input', this._handleInput);
      this.$input.removeEventListener('focus', this._handleFocus);
      this.$input.removeEventListener('blur', this._handleBlur);
      this.$input.removeEventListener('keydown', this._handleKeyDown);
      this.$clear.removeEventListener('click', this._handleClear);
      this.$inputContainer.removeEventListener('mousedown', this._handleContainerClick);
      if (this._iconEl) {
         slice.controller.destroyComponent(this._iconEl);
         this._iconEl = null;
      }
   }

   // ── Public API ─────────────────────────────────────────────────

   /** Move focus to the real field. */
   focus(options) {
      this.$input.focus(options);
   }

   blur() {
      this.$input.blur();
   }

   /** Select the text in the field. */
   select() {
      this.$input.select();
   }

   /**
    * Check the value against every rule, show the result, and return whether
    * it is valid. An invalid field gives a short shake, once.
    */
   validate() {
      const message = this.validationMessage;
      this._showError(message);
      if (message) this._shake();
      return !message;
   }

   /** Older name for validate(). */
   validateValue() {
      return this.validate();
   }

   /** The message for the first rule the value breaks, '' if none. Shows nothing. */
   get validationMessage() {
      return validationMessage(this.$input.value, {
         required: this._required,
         type: this._type,
         element: /** @type {HTMLInputElement} */ (this.$input),
         minlength: this._minlength,
         maxlength: this._maxlength,
         conditions: this._conditionsTest,
         conditionsMessage: this._conditionsMessage,
         validator: this._validator,
         messages: this._messages,
      });
   }

   // What the field says ON ITS OWN, while someone types or leaves it. An
   // empty field says nothing: "required" or "too short" on a field nobody
   // has written in yet is noise, and turning it red for that is a scolding.
   // Those are for validate(), which a form calls when someone tries to
   // submit, with the shake.
   _autoMessage() {
      return this.$input.value === '' ? '' : this.validationMessage;
   }

   get isValid() {
      return !this.validationMessage;
   }

   /** Empty the field and forget its error. */
   clear() {
      this.$input.value = '';
      this._dirty = false;
      this._showError('');
      this._syncFloat();
      this._syncClear();
      this._syncCount();
   }

   /** Older API: mark the field invalid (with a shake). */
   triggerError() {
      this._showError(this._shownError || this.validationMessage || ' ');
      this._shake();
   }

   /** Older API: clear the invalid mark. */
   triggerSuccess() {
      this._showError('');
   }

   /** Older API: re-run the state after the value changed from outside. */
   updateInputState() {
      this._syncFloat();
      this._syncClear();
      this._syncCount();
      if (this._shownError) this._showError(this.validationMessage);
   }

   // ── Props ──────────────────────────────────────────────────────

   get label() { return this._label; }
   set label(value) {
      this._label = typeof value === 'string' ? value : '';
      this._syncLabel();
   }

   get labelPlacement() { return this._labelPlacement; }
   set labelPlacement(value) {
      this._labelPlacement = LABEL_PLACEMENTS.includes(value) ? value : 'floating';
      this._syncLabel();
   }

   get placeholder() { return this._placeholder; }
   set placeholder(value) {
      this._placeholder = typeof value === 'string' ? value : '';
      this._syncLabel();
   }

   get value() { return this.$input.value; }
   set value(newValue) {
      this.$input.value = newValue === null || newValue === undefined ? '' : String(newValue);
      this.updateInputState();
   }

   get type() { return this._type; }
   set type(value) {
      this._type = typeof value === 'string' && value ? value : 'text';
      this.$input.type = this._type;
      if (this._secret && this._type === 'password') this.setupSecretToggle();
      this._syncFloat();
   }

   get name() { return this.$input.name; }
   set name(value) { this._setAttr('name', value); }

   get autocomplete() { return this.$input.getAttribute('autocomplete') || ''; }
   set autocomplete(value) { this._setAttr('autocomplete', value); }

   get inputmode() { return this.$input.getAttribute('inputmode') || ''; }
   set inputmode(value) { this._setAttr('inputmode', value); }

   get min() { return this.$input.getAttribute('min'); }
   set min(value) { this._setAttr('min', value); }

   get max() { return this.$input.getAttribute('max'); }
   set max(value) { this._setAttr('max', value); }

   get step() { return this.$input.getAttribute('step'); }
   set step(value) { this._setAttr('step', value); }

   get pattern() { return this.$input.getAttribute('pattern') || ''; }
   set pattern(value) { this._setAttr('pattern', value); }

   get minlength() { return this._minlength; }
   set minlength(value) {
      const n = Number(value);
      this._minlength = value !== null && value !== undefined && Number.isFinite(n) && n > 0 ? n : null;
   }

   get maxlength() { return this._maxlength; }
   set maxlength(value) {
      const n = Number(value);
      this._maxlength = value !== null && value !== undefined && Number.isFinite(n) && n > 0 ? n : null;
      if (this._maxlength) this.$input.maxLength = this._maxlength;
      else this.$input.removeAttribute('maxlength');
      this._syncCount();
   }

   get size() { return this._size; }
   set size(value) {
      // data-size on the host; Input.css decides what each size measures.
      this._size = applySize(this, value, 'md');
   }

   get variant() { return this._variant; }
   set variant(value) {
      this._variant = FIELD_VARIANTS.includes(value) ? value : 'outlined';
      this.dataset.variant = this._variant;
   }

   get icon() { return this._icon; }
   set icon(value) {
      this._icon = typeof value === 'string' ? value : '';
      this._renderIcon();
   }

   get prefix() { return this._prefix; }
   set prefix(value) {
      this._prefix = value === null || value === undefined ? '' : String(value);
      this._syncAdornments();
   }

   get suffix() { return this._suffix; }
   set suffix(value) {
      this._suffix = value === null || value === undefined ? '' : String(value);
      this._syncAdornments();
   }

   get clearable() { return this._clearable; }
   set clearable(value) {
      this._clearable = value === true;
      this._syncClear();
   }

   get secret() { return this._secret; }
   set secret(value) {
      this._secret = value === true;
      if (this._secret && this._type === 'password') this.setupSecretToggle();
   }

   get showCount() { return this._showCount; }
   set showCount(value) {
      this._showCount = value === true;
      this._syncCount();
   }

   get help() { return this._help; }
   set help(value) {
      this._help = value ? String(value) : '';
      this._syncFooter();
   }

   get error() { return this._error; }
   set error(value) {
      this._error = value ? String(value) : '';
      this._syncFooter();
   }

   get invalid() { return this._invalid; }
   set invalid(value) {
      this._invalid = value === true;
      this._syncFooter();
   }

   get required() { return this._required; }
   set required(value) {
      this._required = value === true;
      this.$input.required = this._required;
      // Kept for compatibility: it marks the field, it no longer paints it red.
      this.$inputContainer.classList.toggle('required', this._required);
      this.classList.toggle('slice_input--required', this._required);
   }

   get disabled() { return this._disabled; }
   set disabled(value) {
      this._disabled = value === true;
      this.$input.disabled = this._disabled;
      this.$inputContainer.classList.toggle('disabled', this._disabled);
      this._syncClear();
   }

   get readonly() { return this._readonly; }
   set readonly(value) {
      this._readonly = value === true;
      this.$input.readOnly = this._readonly;
      this.$inputContainer.classList.toggle('readonly', this._readonly);
      this._syncClear();
   }

   get conditions() { return this._conditions; }
   set conditions(value) {
      this._conditions = value || null;
      this._conditionsTest = compileConditions(this._conditions);
   }

   /** Older name for compiling `conditions`; still callable. */
   setupConditions() {
      this._conditionsTest = compileConditions(this._conditions);
   }

   get conditionsMessage() { return this._conditionsMessage; }
   set conditionsMessage(value) { this._conditionsMessage = value ? String(value) : ''; }

   get validator() { return this._validator; }
   set validator(value) { this._validator = typeof value === 'function' ? value : null; }

   get messages() { return this._messages; }
   set messages(value) { this._messages = value && typeof value === 'object' ? value : null; }

   get validateOn() { return this._validateOn; }
   set validateOn(value) { this._validateOn = VALIDATE_ON.includes(value) ? value : 'blur'; }

   get debounce() { return this._debounce; }
   set debounce(value) {
      const n = Number(value);
      this._debounce = Number.isFinite(n) && n > 0 ? n : 0;
   }

   get ariaLabel() { return this._ariaLabel; }
   set ariaLabel(value) {
      this._ariaLabel = typeof value === 'string' ? value : '';
      this._syncLabel();
   }

   get className() { return this._className; }
   /** Marked, never substituted: see Button.className. */
   set className(value) {
      applyClassName(this, value);
      this._className = typeof value === 'string' ? value : '';
   }

   get texts() { return this._texts; }
   set texts(value) {
      this._texts = value && typeof value === 'object' ? { ...value } : {};
      this._applyTexts();
   }

   get onChange() { return this._onChange; }
   set onChange(value) {
      // Accept null/non-function to CLEAR the handler.
      this._onChange = typeof value === 'function' ? value : null;
   }

   get onEnter() { return this._onEnter; }
   set onEnter(value) { this._onEnter = typeof value === 'function' ? value : null; }

   // ── Rendering ──────────────────────────────────────────────────

   _t(key) {
      return this._texts[key] ?? t(key);
   }

   // The two buttons inside the field name themselves; the template ships the
   // English words, the locale may not. Validation messages come from
   // shared/validation/fieldRules.js, which is already translated.
   _applyTexts() {
      if (this.$clear) this.$clear.setAttribute('aria-label', this._t('clear'));
      if (this.$eyeIcon) this.$eyeIcon.setAttribute('aria-label', this._t('togglePassword'));
   }

   _setAttr(name, value) {
      if (value === null || value === undefined || value === '') this.$input.removeAttribute(name);
      else this.$input.setAttribute(name, String(value));
   }

   // Who labels the field, and where the label sits.
   //   label given        -> the label floats (or sits above); placeholder is
   //                         the native hint shown once the label has risen
   //   placeholder only   -> the older API: the placeholder IS the floating label
   //   'above', no label  -> a plain field with a native placeholder (a Form
   //                         field, whose label the Form draws)
   _syncLabel() {
      if (!this.$placeholder) return;
      const floating = this._labelPlacement === 'floating';
      const legacy = !this._label && floating && !!this._placeholder;
      const text = this._label || (legacy ? this._placeholder : '');

      this.$placeholder.textContent = text;
      this.$placeholder.hidden = !text;
      this.$input.placeholder = legacy ? '' : this._placeholder;

      // Floating: inside the field box. Above: before it, in normal flow.
      if (floating && this.$placeholder.parentNode !== this.$inputContainer) {
         this.$inputContainer.prepend(this.$placeholder);
      } else if (!floating && this.$placeholder.parentNode !== this.$wrap) {
         this.$wrap.prepend(this.$placeholder);
      }
      this.dataset.labelPlacement = this._labelPlacement;
      this.classList.toggle('slice_input--labelled', !!text);

      if (!text && this._ariaLabel) this.$input.setAttribute('aria-label', this._ariaLabel);
      else this.$input.removeAttribute('aria-label');
      this._syncFloat();
   }

   _syncFloat() {
      if (!this.$placeholder) return;
      const hasValue = this.$input.value !== '';
      // Some types always show something (a date mask, a colour swatch), and a
      // prefix sits where the resting label would: the label stays up.
      const alwaysUp = !!this._prefix || ['date', 'time', 'datetime-local', 'month', 'week', 'color', 'file'].includes(this._type);
      this.$placeholder.classList.toggle('slice_input_value', hasValue || alwaysUp);
      this.$placeholder.classList.toggle('slice_input_focus', this._focused);
      this.classList.toggle('slice_input--filled', hasValue);
   }

   _syncAdornments() {
      if (!this.$prefix) return;
      this.$prefix.textContent = this._prefix;
      this.$prefix.hidden = !this._prefix;
      this.$suffix.textContent = this._suffix;
      this.$suffix.hidden = !this._suffix;
      this._syncFloat();
   }

   async _renderIcon() {
      const token = ++this._iconToken;
      const name = this._icon;
      this.classList.toggle('slice_input--icon', !!name);
      if (!name) {
         this.$icon.hidden = true;
         if (this._iconEl) {
            slice.controller.destroyComponent(this._iconEl);
            this._iconEl.remove();
            this._iconEl = null;
         }
         return;
      }
      this.$icon.hidden = false;
      if (this._iconEl) {
         this._iconEl.name = name;
         return;
      }
      const el = await slice.build('Icon', { name, size: '18px' });
      if (!el) return;
      if (token !== this._iconToken || this._iconEl) {
         slice.controller.destroyComponent(el);
         return;
      }
      this._iconEl = el;
      this.$icon.appendChild(el);
   }

   _syncClear() {
      if (!this.$clear) return;
      this.$clear.hidden = !(this._clearable && this.$input.value !== '' && !this._disabled && !this._readonly);
   }

   _syncCount() {
      if (!this.$count) return;
      this.$count.hidden = !this._showCount;
      if (this._showCount) this.$count.textContent = countText(this.$input.value, this._maxlength);
      this._syncFooter();
   }

   _syncFooter() {
      if (!this.$message) return;
      const error = this._error || this._shownError.trim();
      const text = error || this._help;
      this.$message.textContent = text;
      this.$message.classList.toggle('slice_input_message--error', !!error);
      this.$footer.hidden = !text && !this._showCount;

      const invalid = !!(this._error || this._shownError || this._invalid);
      this.classList.toggle('slice_input--invalid', invalid);
      this.$inputContainer.classList.toggle('is-invalid', invalid);
      this.$input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
      if (text) this.$input.setAttribute('aria-describedby', this.$message.id);
      else this.$input.removeAttribute('aria-describedby');
   }

   _showError(message) {
      this._shownError = message || '';
      this._syncFooter();
   }

   // The shake is the shared "no" of Input and Textarea: same duration, run once.
   _shake() {
      this.$inputContainer.classList.remove('error');
      void this.$inputContainer.offsetWidth;
      this.$inputContainer.classList.add('error');
      window.clearTimeout(this._shakeTimer);
      this._shakeTimer = window.setTimeout(() => this.$inputContainer.classList.remove('error'), 500);
   }

   // ── Events ─────────────────────────────────────────────────────

   _handleInput() {
      this._dirty = true;
      this._syncFloat();
      this._syncClear();
      this._syncCount();
      // Reward early: an error already on screen updates as they type, so it
      // goes away the moment the value is fixed. A new error waits for blur.
      if (this._validateOn === 'input' || this._shownError) {
         this._showError(this._autoMessage());
      }
      this._emitChange();
   }

   _emitChange() {
      if (typeof this._onChange !== 'function') return;
      if (!this._debounce) {
         this._onChange(this.$input.value);
         return;
      }
      window.clearTimeout(this._debounceTimer);
      this._debounceTimer = window.setTimeout(() => {
         if (typeof this._onChange === 'function') this._onChange(this.$input.value);
      }, this._debounce);
   }

   _handleFocus() {
      this._focused = true;
      this.classList.add('slice_input--focused');
      this._syncFloat();
   }

   _handleBlur() {
      this._focused = false;
      this.classList.remove('slice_input--focused');
      this._syncFloat();
      // Punish late: judge the value when they leave, not while they type. An
      // untouched empty field is left alone until someone calls validate().
      if (this._validateOn !== 'manual' && (this._dirty || this.$input.value !== '')) {
         this._showError(this._autoMessage());
      }
   }

   _handleKeyDown(event) {
      if (event.key === 'Enter' && typeof this._onEnter === 'function') {
         this._onEnter(this.$input.value, event);
      } else if (event.key === 'Escape' && this._clearable && this.$input.value !== '' && !this._readonly) {
         // Escape clears a clearable field; it is not passed on to a dialog.
         event.preventDefault();
         event.stopPropagation();
         this._handleClear();
      }
   }

   _handleClear() {
      if (this._disabled || this._readonly) return;
      this.$input.value = '';
      this.$input.focus();
      this._handleInput();
   }

   _handleContainerClick(event) {
      if (event.target === this.$input || event.target.closest('button, .slice_eye_icon')) return;
      // Keep the focus where the click would have left it: in the field.
      event.preventDefault();
      if (!this._disabled) this.$input.focus();
   }

   // ── Password reveal ───────────────────────────────────────────

   setupSecretToggle() {
      // Idempotent: runs from both the `secret` setter and init(); wire once.
      if (!this.$eyeIcon || this._secretToggleReady) return;
      this._secretToggleReady = true;
      this.classList.add('slice_input--secret');
      this.$eyeIcon.style.display = 'block';
      this.$eyeIcon.setAttribute('aria-pressed', 'false');

      // Both glyphs are static markup; CSS picks one from `aria-pressed`.
      const toggleVisibility = () => {
         const revealed = this.$input.type === 'text';
         this.$input.type = revealed ? 'password' : 'text';
         this.$eyeIcon.setAttribute('aria-pressed', String(!revealed));
      };

      this.$eyeIcon.addEventListener('click', toggleVisibility);
      this.$eyeIcon.addEventListener('keydown', (event) => {
         if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleVisibility();
         }
      });
   }
}

customElements.define('slice-input', Input);