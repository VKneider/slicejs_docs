// Select — a combobox: pick one value or several from a list you can search,
// group, load from a server, or extend by typing.
//
// OPTIONS. Strings and numbers, or objects:
//   { value, label | text | [visibleProp], disabled, icon, description }
//   { label, options: [...] }              a group with a heading
// `value` is what you get back; the label is what is shown. An object without
// `value` uses its `id`, else its label.
//
// VALUE. Three ways to read it, because one shape cannot serve everyone:
//   selected          the value (single) or an array of values (multiple)
//   selectedOptions   the option objects you passed in
//   value             as before: the option object (single), an array of them
//                     (multiple), [] when empty
// Setting `value` or `selected` accepts any of: a value, an array of values,
// an option object, an array of option objects — in any prop order (it waits
// for `options` if they are not there yet).
// `onChange(selected, selectedOptions)` runs with `this` = the Select.
//
// The field is a real <input role="combobox"> with aria-activedescendant on a
// role="listbox" menu (WAI-ARIA combobox pattern). The menu is a manual
// popover: in the top layer, so no ancestor's overflow can clip it.
//
// The enumerated props are LITERAL arrays inside `static props`, read back by
// the setters from `Select.props` (COMPONENT_API_STANDARDS.md §10).

import { texts } from '../../shared/text/texts.js';

const TEXTS = {
   noResultsText: 'No results',
   loadingText: 'Loading…',
   remove: 'Remove {label}',
   selectAll: 'Select all',
   clearSelection: 'Clear selection',
   create: 'Create',
};

// Spanish mirrors TEXTS key by key; the app can override any of them with its dictionary.
const ES = {
   noResultsText: 'Sin resultados',
   loadingText: 'Cargando…',
   remove: 'Quitar {label}',
   selectAll: 'Seleccionar todo',
   clearSelection: 'Borrar selección',
   create: 'Crear',
};

const t = texts('slice.select', { en: TEXTS, es: ES });

function fill(template, values) {
   return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

let _sliceSelectSeq = 0;

const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
   if (_sliceDeprecated.has(oldName)) return;
   _sliceDeprecated.add(oldName);
   console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

// Accent- and case-insensitive, the rule every search in the library uses.
function fold(text) {
   return String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const ROW_HEIGHT = { sm: 32, md: 38, lg: 44 };
const VIRTUAL_THRESHOLD = 150;
const MENU_GAP = 4;
const VIEWPORT_MARGIN = 8;

export default class Select extends HTMLElement {

   static props = {
      options: {
         type: 'array',
         default: [],
         required: false
      },
      // See VALUE above. Kept as the old shape for compatibility.
      value: {
         type: 'array',
         default: null,
         required: false
      },
      // The value(s) themselves (the clean API).
      selected: {
         type: 'array',
         default: null,
         required: false
      },
      label: {
         type: 'string',
         default: '',
         required: false
      },
      placeholder: {
         type: 'string',
         default: '',
         required: false
      },
      // The option property shown as its label (older name for `label`).
      visibleProp: {
         type: 'string',
         default: 'text',
         required: false
      },
      multiple: {
         type: 'boolean',
         default: false
      },
      // Type to filter the options.
      searchable: {
         type: 'boolean',
         default: false
      },
      clearable: {
         type: 'boolean',
         default: false
      },
      disabled: {
         type: 'boolean',
         default: false
      },
      required: {
         type: 'boolean',
         default: false
      },
      // Multiple: a "Select all" row at the top of the list.
      selectAll: {
         type: 'boolean',
         default: false
      },
      // Multiple: at most this many values; the rest of the list disables.
      max: {
         type: 'number',
         default: null,
         required: false
      },
      // Typing something that is not an option offers "Create …".
      creatable: {
         type: 'boolean',
         default: false
      },
      // `(label) => option | Promise<option>`; without it a created option
      // is `{ value: label, label }`.
      onCreate: {
         type: 'function',
         default: null
      },
      // `(query, { signal }) => Promise<options>`: options from a server,
      // asked again as the user types (debounced; the previous request aborts).
      loadOptions: {
         type: 'function',
         default: null
      },
      // Render only the rows in view. 'auto' turns it on past 150 options.
      virtual: {
         type: 'string',
         default: 'auto',
         required: false,
         allowedValues: ['auto', 'on', 'off']
      },
      variant: {
         type: 'string',
         default: 'outlined',
         required: false,
         allowedValues: ['outlined', 'filled', 'ghost']
      },
      size: {
         type: 'string',
         default: 'md',
         required: false,
         allowedValues: ['sm', 'md', 'lg']
      },
      // A message under the field; `error` also marks it invalid.
      error: {
         type: 'string',
         default: '',
         required: false
      },
      help: {
         type: 'string',
         default: '',
         required: false
      },
      // For forms: hidden inputs carry the selected value(s) under this name.
      name: {
         type: 'string',
         default: '',
         required: false
      },
      noResultsText: {
         type: 'string',
         default: null,
         required: false
      },
      loadingText: {
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
      onChange: {
         type: 'function',
         default: null
      },
      onOptionSelect: {
         type: 'function',
         default: null
      },
      // `(open) => void`.
      onOpenChange: {
         type: 'function',
         default: null
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);

      this.$dropdown = this.querySelector('.slice_select_dropdown');
      this.$selectContainer = this.querySelector('.slice_select_container');
      this.$label = this.querySelector('.slice_select_label');
      this.$chips = this.querySelector('.slice_select_chips');
      this.$select = this.querySelector('.slice_select');
      this.$clear = this.querySelector('.slice_select_clear');
      this.$caret = this.querySelector('.slice_select_caret');
      this.$message = this.querySelector('.slice_select_message');
      this.$menu = this.querySelector('.slice_select_menu');
      this.$form = this.querySelector('.slice_select_form');

      this._uid = `slice-select-${++_sliceSelectSeq}`;
      this.$select.id = `${this._uid}-input`;
      this.$label.id = `${this._uid}-label`;
      this.$label.htmlFor = this.$select.id;
      this.$menu.id = `${this._uid}-listbox`;
      this.$message.id = `${this._uid}-message`;
      this.$select.setAttribute('aria-controls', this.$menu.id);
      this.$menu.setAttribute('aria-labelledby', this.$label.id);

      this._options = [];
      this._entries = [];          // flat: options (and group headings)
      this._byValue = new Map();
      this._selectedEntries = [];  // in selection order
      this._known = new Map();     // value key → entry, so remote / created values keep their label
      this._created = [];
      this._pendingValue = undefined;
      this._query = '';
      this._open = false;
      this._activeIndex = -1;
      this._rows = [];             // what the menu lists: { kind, entry?, ... }
      this._remote = null;
      this._remoteTimer = 0;
      this._remoteController = null;
      this._remoteLoading = false;
      this._typeahead = '';
      this._typeaheadTimer = 0;
      this._frame = 0;
      this._onChange = null;
      this._onOpenChange = null;
      this._visibleProp = 'text';
      this._texts = {};

      for (const name of [
         '_handleControlPointerDown', '_handleControlClick', '_handleKeydown', '_handleInput',
         '_handleClear', '_handleMenuPointerDown', '_handleMenuClick', '_handleMenuScroll',
         '_handleChipsClick', '_handleOutsidePointer', '_handleFocusOut', '_handleViewport'
      ]) {
         this[name] = this[name].bind(this);
      }
      this.$selectContainer.addEventListener('pointerdown', this._handleControlPointerDown);
      this.$selectContainer.addEventListener('click', this._handleControlClick);
      this.$select.addEventListener('keydown', this._handleKeydown);
      this.$select.addEventListener('input', this._handleInput);
      this.$clear.addEventListener('click', this._handleClear);
      this.$chips.addEventListener('click', this._handleChipsClick);
      this.$menu.addEventListener('pointerdown', this._handleMenuPointerDown);
      this.$menu.addEventListener('click', this._handleMenuClick);
      this.$menu.addEventListener('scroll', this._handleMenuScroll, { passive: true });
      this.addEventListener('focusout', this._handleFocusOut);

      slice.controller.setComponentProps(this, props);
   }

   init() {
      for (const name of ['variant', 'size', 'virtual']) {
         if (this[`_${name}`] === undefined) this[name] = Select.props[name].default;
      }
      if (this._noResultsText === undefined) this._noResultsText = Select.props.noResultsText.default;
      if (this._loadingText === undefined) this._loadingText = Select.props.loadingText.default;
      // The template ships the English label; the locale may say otherwise.
      this.$clear.setAttribute('aria-label', this._t('clearSelection'));
      // A language change repaints the chips and the open list. The selection,
      // the search text and the open state are not touched.
      slice.translator?.watch?.(this, () => {
         this.$clear.setAttribute('aria-label', this._t('clearSelection'));
         this._renderChips();
         if (this._open) this._refresh();
      });
      this._syncField();
   }

   beforeDestroy() {
      this._setOpen(false, false);
      clearTimeout(this._remoteTimer);
      clearTimeout(this._typeaheadTimer);
      this._remoteController?.abort();
      if (this._frame) cancelAnimationFrame(this._frame);
      // Only while open; removed again here in case (§9).
      this._toggleDocumentListeners(false);
      slice.controller.destroyByContainer(this.$menu);
   }

   // ------------------------------------------------------------------ props

   get options() { return this._options; }
   set options(values) {
      if (!Array.isArray(values)) return;
      this._options = values;
      this._buildEntries();
      // Selected values that are still options take the new objects.
      this._selectedEntries = this._selectedEntries.map((entry) => this._byValue.get(this._key(entry.value)) ?? entry);
      if (this._pendingValue !== undefined) {
         const pending = this._pendingValue;
         this._pendingValue = undefined;
         this._applyValue(pending, false);
      }
      this._syncField();
      if (this._open) this._renderMenu();
   }

   get value() {
      const current = this._selectedEntries.map((entry) => entry.raw);
      if (current.length === 1) return current[0];
      return current;
   }
   set value(input) {
      this._applyValue(input, false);
   }

   get selected() {
      const values = this._selectedEntries.map((entry) => entry.value);
      return this._multiple ? values : (values[0] ?? null);
   }
   set selected(input) {
      this._applyValue(input, false);
   }

   /** The option objects that are selected, in the order they were picked. */
   get selectedOptions() {
      return this._selectedEntries.map((entry) => entry.raw);
   }

   get label() { return this._label; }
   set label(value) {
      this._label = value ?? '';
      this.$label.textContent = this._label;
      this.$label.hidden = this._label === '';
      if (this._label) this.$select.setAttribute('aria-labelledby', this.$label.id);
      else this.$select.removeAttribute('aria-labelledby');
   }

   get placeholder() { return this._placeholder; }
   set placeholder(value) {
      this._placeholder = typeof value === 'string' ? value : '';
      this._syncField();
   }

   get visibleProp() { return this._visibleProp; }
   set visibleProp(value) {
      this._visibleProp = value ? String(value) : 'text';
      if (this._options.length > 0) this.options = this._options;
   }

   get multiple() { return this._multiple === true; }
   set multiple(value) {
      this._multiple = value === true;
      if (this._multiple) this.$menu.setAttribute('aria-multiselectable', 'true');
      else this.$menu.removeAttribute('aria-multiselectable');
      this.classList.toggle('slice_select--multiple', this._multiple);
      if (!this._multiple && this._selectedEntries.length > 1) this._selectedEntries = this._selectedEntries.slice(0, 1);
      this._syncField();
   }

   get searchable() { return this._searchable === true; }
   set searchable(value) {
      this._searchable = value === true;
      this._syncField();
   }

   get clearable() { return this._clearable === true; }
   set clearable(value) {
      this._clearable = value === true;
      this._syncField();
   }

   get disabled() { return this._disabled === true; }
   set disabled(value) {
      this._disabled = value === true;
      this.$select.disabled = this._disabled;
      this.classList.toggle('slice_select--disabled', this._disabled);
      if (this._disabled) this._setOpen(false, false);
   }

   get required() { return this._required === true; }
   set required(value) {
      this._required = value === true;
      this.$select.setAttribute('aria-required', this._required ? 'true' : 'false');
      this.classList.toggle('slice_select--required', this._required);
   }

   get selectAll() { return this._selectAll === true; }
   set selectAll(value) { this._selectAll = value === true; if (this._open) this._renderMenu(); }

   get max() { return this._max; }
   set max(value) {
      const number = Number(value);
      this._max = value === null || value === undefined || !Number.isFinite(number) || number <= 0 ? null : Math.floor(number);
      if (this._open) this._renderMenu();
   }

   get creatable() { return this._creatable === true; }
   set creatable(value) {
      this._creatable = value === true;
      this._syncField();
   }

   get onCreate() { return this._onCreate; }
   set onCreate(value) { this._onCreate = typeof value === 'function' ? value : null; }

   get loadOptions() { return this._loadOptions; }
   set loadOptions(value) {
      this._loadOptions = typeof value === 'function' ? value : null;
      this._syncField();
   }

   get virtual() { return this._virtual; }
   set virtual(value) {
      this._virtual = Select.props.virtual.allowedValues.includes(value) ? value : value === true ? 'on' : value === false ? 'off' : 'auto';
      if (this._open) this._renderMenu();
   }

   get variant() { return this._variant; }
   set variant(value) {
      const { allowedValues, default: fallback } = Select.props.variant;
      this._variant = allowedValues.includes(value) ? value : fallback;
      this.dataset.variant = this._variant;
   }

   get size() { return this._size; }
   set size(value) {
      const { allowedValues, default: fallback } = Select.props.size;
      this._size = allowedValues.includes(value) ? value : fallback;
      this.dataset.size = this._size;
      this.style.setProperty('--select-row-height', `${ROW_HEIGHT[this._size]}px`);
   }

   get error() { return this._error; }
   set error(value) {
      this._error = value ? String(value) : '';
      this._syncMessage();
   }

   get help() { return this._help; }
   set help(value) {
      this._help = value ? String(value) : '';
      this._syncMessage();
   }

   get name() { return this._name; }
   set name(value) {
      this._name = value ? String(value) : '';
      this._syncFormInputs();
   }

   get noResultsText() { return this._noResultsText; }
   set noResultsText(value) {
      this._noResultsText = value === null || value === undefined ? null : String(value);
      if (this._open) this._refresh();
   }

   get loadingText() { return this._loadingText; }
   set loadingText(value) {
      this._loadingText = value === null || value === undefined ? null : String(value);
      if (this._open) this._refresh();
   }

   get texts() { return this._texts; }
   set texts(value) {
      // Only the overrides are kept: every key left out falls back to the
      // translator (or to the English default).
      this._texts = value && typeof value === 'object' ? { ...value } : {};
      this.$clear.setAttribute('aria-label', this._t('clearSelection'));
      this._renderChips();
      if (this._open) this._refresh();
   }

   get onChange() { return this._onChange; }
   set onChange(value) { if (typeof value === 'function') this._onChange = value; }

   // Deprecated alias for onChange.
   get onOptionSelect() { return this._onChange; }
   set onOptionSelect(value) {
      if (typeof value === 'function') {
         this._onChange ??= value;
         deprecate('onOptionSelect', 'onChange');
      }
   }

   get onOpenChange() { return this._onOpenChange; }
   set onOpenChange(value) { this._onOpenChange = typeof value === 'function' ? value : null; }

   /** Whether the list is open. */
   get isOpen() { return this._open; }

   // ------------------------------------------------------------- public API

   open() { if (!this._disabled) this._setOpen(true, true); }
   close() { this._setOpen(false, false); }
   focus(options) { this.$select.focus(options); }
   clear() { this._commit([]); }

   // Old helpers, kept for compatibility.
   isObjectInArray(object, array) {
      for (let i = 0; i < array.length; i++) {
         if (this.sameObject(array[i], object)) return { found: true, index: i };
      }
      return { found: false, index: -1 };
   }

   sameObject(a, b) {
      if (a === b) return true;
      if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      for (const key of keysA) {
         const valueA = a[key];
         const valueB = b[key];
         if (typeof valueA === 'object' && typeof valueB === 'object') {
            if (!this.sameObject(valueA, valueB)) return false;
         } else if (valueA !== valueB) return false;
      }
      return true;
   }

   updateSelectLabel() { this._syncField(); }

   // ---------------------------------------------------------------- options

   _key(value) {
      return typeof value === 'object' && value !== null ? value : `${typeof value}:${String(value)}`;
   }

   _entry(raw, group = null) {
      if (raw !== null && typeof raw === 'object') {
         const label = String(raw[this._visibleProp] ?? raw.label ?? raw.text ?? raw.name ?? raw.value ?? '');
         const value = raw.value !== undefined ? raw.value : raw.id !== undefined ? raw.id : label;
         return { kind: 'option', raw, value, label, disabled: raw.disabled === true, icon: raw.icon ?? null, description: raw.description ?? null, group };
      }
      return { kind: 'option', raw, value: raw, label: String(raw), disabled: false, icon: null, description: null, group };
   }

   _buildEntries(list = this._options) {
      const entries = [];
      const byValue = new Map();
      const add = (raw, group) => {
         const entry = this._entry(raw, group);
         entries.push(entry);
         const key = this._key(entry.value);
         if (!byValue.has(key)) byValue.set(key, entry);
         this._known.set(key, entry);
      };
      for (const raw of Array.isArray(list) ? list : []) {
         if (raw && typeof raw === 'object' && Array.isArray(raw.options)) {
            const group = String(raw.label ?? raw.text ?? '');
            for (const child of raw.options) add(child, group);
         } else if (raw !== null && raw !== undefined) {
            add(raw, null);
         }
      }
      for (const raw of this._created) add(raw, null);
      this._entries = entries;
      this._byValue = byValue;
   }

   // Find the entry an outside value means: the same object, an equal object,
   // or an option's value.
   _resolve(input) {
      if (input && typeof input === 'object') {
         const same = this._entries.find((entry) => entry.raw === input) ??
            this._entries.find((entry) => this.sameObject(entry.raw, input));
         if (same) return same;
         if (input.value !== undefined) return this._byValue.get(this._key(input.value)) ?? this._known.get(this._key(input.value)) ?? this._entry(input);
         return null;
      }
      return this._byValue.get(this._key(input)) ?? this._known.get(this._key(input)) ??
         // A remote or creatable select can be given a value it has not loaded.
         (this._loadOptions || this._creatable ? this._entry({ value: input, label: String(input) }) : null);
   }

   _applyValue(input, emit) {
      if (input === null || input === undefined || input === '') {
         this._selectedEntries = [];
         this._syncField();
         return;
      }
      const list = Array.isArray(input) ? input : [input];
      // Options not there yet (any prop order is fine): try again when they are.
      if (this._entries.length === 0 && !this._loadOptions && !this._creatable) {
         this._pendingValue = input;
         return;
      }
      const resolved = [];
      for (const item of list) {
         const entry = this._resolve(item);
         if (entry) {
            if (!resolved.includes(entry)) resolved.push(entry);
         } else {
            console.warn('[Slice] Select: a value that is not one of the options was ignored:', item);
         }
      }
      this._commit(this._multiple ? resolved : resolved.slice(0, 1), emit);
   }

   // ------------------------------------------------------------- selection

   _isSelected(entry) {
      return this._selectedEntries.some((selected) => selected === entry || this._key(selected.value) === this._key(entry.value));
   }

   _commit(entries, emit = true) {
      const before = this._selectedEntries.map((entry) => this._key(entry.value));
      this._selectedEntries = entries;
      for (const entry of entries) this._known.set(this._key(entry.value), entry);
      const after = entries.map((entry) => this._key(entry.value));
      const changed = before.length !== after.length || before.some((key, i) => key !== after[i]);
      this._syncField();
      if (this._open) this._syncMenuState();
      if (changed && emit && this._onChange) this._onChange.call(this, this.selected, this.selectedOptions);
   }

   _toggle(entry) {
      if (!entry || entry.disabled) return;
      if (!this._multiple) {
         this._commit([entry]);
         this._query = '';
         this._setOpen(false, true);
         return;
      }
      if (this._isSelected(entry)) {
         this._commit(this._selectedEntries.filter((selected) => this._key(selected.value) !== this._key(entry.value)));
      } else {
         if (this._max !== null && this._selectedEntries.length >= this._max) return;
         this._commit([...this._selectedEntries, entry]);
      }
      if (this._searchable && this._query) {
         this._query = '';
         this.$select.value = '';
         this._refresh();
      }
   }

   _toggleAll() {
      const options = this._rows.filter((row) => row.kind === 'option' && !row.entry.disabled).map((row) => row.entry);
      const allOn = options.length > 0 && options.every((entry) => this._isSelected(entry));
      if (allOn) {
         const off = new Set(options.map((entry) => this._key(entry.value)));
         this._commit(this._selectedEntries.filter((entry) => !off.has(this._key(entry.value))));
      } else {
         const next = [...this._selectedEntries];
         for (const entry of options) {
            if (this._max !== null && next.length >= this._max) break;
            if (!next.some((selected) => this._key(selected.value) === this._key(entry.value))) next.push(entry);
         }
         this._commit(next);
      }
   }

   async _create(label) {
      const text = String(label).trim();
      if (!text) return;
      let raw = null;
      if (this._onCreate) {
         try {
            raw = await this._onCreate(text);
         } catch (error) {
            console.error('Select: onCreate failed', error);
            return;
         }
      }
      if (raw === false) return;
      if (raw === null || raw === undefined) raw = { value: text, label: text };
      this._created.push(raw);
      this._buildEntries();
      const entry = this._resolve(raw) ?? this._entry(raw);
      this._query = '';
      this.$select.value = '';
      if (this._multiple) {
         this._commit([...this._selectedEntries, entry]);
         this._refresh();
      } else {
         this._commit([entry]);
         this._setOpen(false, true);
      }
   }

   // --------------------------------------------------------------- the field

   _syncField() {
      const has = this._selectedEntries.length > 0;
      const editable = this._searchable || this._creatable || !!this._loadOptions;
      this.$select.readOnly = !editable;
      this.classList.toggle('slice_select--searchable', editable);
      this.classList.toggle('slice_select--has-value', has);
      // Single: the label of the choice, unless the user is typing.
      if (!this._open || !editable) {
         this.$select.value = !this._multiple && has ? this._selectedEntries[0].label : '';
      }
      const floated = has || this._open || this._query !== '';
      this.$label.classList.toggle('slice_select_value', floated);
      this.$select.placeholder = floated && !(this._multiple && has) ? this._placeholder : '';
      this.$clear.hidden = !(this._clearable && has && !this._disabled);
      this._renderChips();
      this._syncFormInputs();
   }

   _renderChips() {
      if (!this._multiple) {
         this.$chips.replaceChildren();
         return;
      }
      const chips = this._selectedEntries.map((entry) => {
         const chip = document.createElement('span');
         chip.className = 'slice_select_chip';
         chip.dataset.key = String(this._key(entry.value));
         const text = document.createElement('span');
         text.className = 'slice_select_chip_label';
         text.textContent = entry.label;
         const remove = document.createElement('button');
         remove.type = 'button';
         remove.className = 'slice_select_chip_remove';
         remove.tabIndex = -1;
         remove.setAttribute('aria-label', this._t('remove', { label: entry.label }));
         chip.append(text, remove);
         chip._entry = entry;
         return chip;
      });
      this.$chips.replaceChildren(...chips);
   }

   _syncMessage() {
      const text = this._error || this._help;
      this.$message.textContent = text;
      this.$message.hidden = !text;
      this.$message.classList.toggle('slice_select_message--error', !!this._error);
      this.classList.toggle('slice_select--invalid', !!this._error);
      this.$select.setAttribute('aria-invalid', this._error ? 'true' : 'false');
      if (text) this.$select.setAttribute('aria-describedby', this.$message.id);
      else this.$select.removeAttribute('aria-describedby');
   }

   _syncFormInputs() {
      if (!this.$form) return;
      if (!this._name) {
         this.$form.replaceChildren();
         return;
      }
      this.$form.replaceChildren(...this._selectedEntries.map((entry) => {
         const input = document.createElement('input');
         input.type = 'hidden';
         input.name = this._name;
         input.value = typeof entry.value === 'object' ? JSON.stringify(entry.value) : String(entry.value);
         return input;
      }));
   }

   // ------------------------------------------------------------ open / close

   _t(key, values = {}) {
      return fill(this._texts[key] ?? t(key), values);
   }

   _setOpen(open, keepFocus, selectText = true) {
      open = open === true && !this._disabled;
      if (open === this._open) return;
      this._open = open;
      this.$select.setAttribute('aria-expanded', open ? 'true' : 'false');
      this.classList.toggle('slice_select--open', open);
      if (open) {
         this._query = '';
         this._showMenu();
         this._refresh(true);
         this._toggleDocumentListeners(true);
         if (this._loadOptions) this._fetch('', true);
      } else {
         this._query = '';
         this._activeIndex = -1;
         this.$select.removeAttribute('aria-activedescendant');
         this._hideMenu();
         this._toggleDocumentListeners(false);
         this._remoteController?.abort();
         clearTimeout(this._remoteTimer);
         this._remoteLoading = false;
         if (keepFocus) this.$select.focus({ preventScroll: true });
      }
      this._syncField();
      if (open && selectText && (this._searchable || this._creatable || this._loadOptions) && !this._multiple) {
         // Typing replaces the shown label; select it so it is easy to overwrite.
         this.$select.select();
      }
      if (this._onOpenChange) this._onOpenChange(open);
   }

   _showMenu() {
      this.$menu.classList.add('menu_open');
      this.style.setProperty('--select-anchor-width', `${Math.round(this.$selectContainer.getBoundingClientRect().width)}px`);
      if (typeof this.$menu.showPopover === 'function') {
         try {
            if (!this.$menu.matches(':popover-open')) this.$menu.showPopover();
         } catch {
            /* no popover support: the fixed fallback styles apply */
         }
      }
      requestAnimationFrame(() => { if (this._open) this.$menu.classList.add('is-open'); });
   }

   _hideMenu() {
      this.$menu.classList.remove('menu_open', 'is-open');
      if (typeof this.$menu.hidePopover === 'function') {
         try {
            if (this.$menu.matches(':popover-open')) this.$menu.hidePopover();
         } catch {
            /* already hidden */
         }
      }
      slice.controller.destroyByContainer(this.$menu);
      this.$menu.replaceChildren();
   }

   _toggleDocumentListeners(on) {
      const method = on ? 'addEventListener' : 'removeEventListener';
      document[method]('pointerdown', this._handleOutsidePointer, true);
      window[method]('resize', this._handleViewport);
      document[method]('scroll', this._handleViewport, true);
   }

   _position() {
      if (!this._open) return;
      const anchor = this.$selectContainer.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const below = vh - anchor.bottom - MENU_GAP - VIEWPORT_MARGIN;
      const above = anchor.top - MENU_GAP - VIEWPORT_MARGIN;
      this.$menu.style.maxHeight = '';
      const natural = Math.min(this.$menu.scrollHeight + 2, 300);
      const down = natural <= below || below >= above;
      const room = Math.max(120, Math.floor(down ? below : above));
      this.$menu.style.maxHeight = `${Math.min(300, room)}px`;
      const height = Math.min(natural, Math.min(300, room));
      const width = Math.max(anchor.width, this.$menu.offsetWidth);
      const left = Math.min(Math.max(VIEWPORT_MARGIN, anchor.left), Math.max(VIEWPORT_MARGIN, vw - width - VIEWPORT_MARGIN));
      const top = down ? anchor.bottom + MENU_GAP : anchor.top - MENU_GAP - height;
      this.$menu.style.left = `${Math.round(left)}px`;
      this.$menu.style.top = `${Math.round(top)}px`;
      this.$menu.dataset.side = down ? 'bottom' : 'top';
   }

   // ------------------------------------------------------------------ menu

   _isVirtual() {
      if (this._virtual === 'on') return true;
      if (this._virtual === 'off') return false;
      return this._rows.length > VIRTUAL_THRESHOLD;
   }

   // Recompute what the list shows, then draw it.
   _refresh(resetActive = false) {
      const query = fold(this._query.trim());
      const rows = [];
      if (this._remoteLoading && this._entries.length === 0) {
         rows.push({ kind: 'status', text: this._loadingText ?? this._t('loadingText') });
      }
      const local = this._loadOptions ? this._entries : this._entries.filter((entry) => !query || fold(entry.label).includes(query) || fold(entry.description ?? '').includes(query));
      if (this._multiple && this._selectAll && local.some((entry) => !entry.disabled)) {
         rows.push({ kind: 'all' });
      }
      let group = undefined;
      for (const entry of local) {
         if (entry.group !== group) {
            group = entry.group;
            if (group) rows.push({ kind: 'group', text: group });
         }
         rows.push({ kind: 'option', entry });
      }
      const exact = local.some((entry) => fold(entry.label) === query);
      if (this._creatable && query && !exact) rows.push({ kind: 'create', text: this._query.trim() });
      if (!rows.some((row) => row.kind === 'option' || row.kind === 'create' || row.kind === 'status')) {
         rows.push({ kind: 'status', text: this._remoteLoading ? (this._loadingText ?? this._t('loadingText')) : (this._noResultsText ?? this._t('noResultsText')) });
      }
      this._rows = rows;
      if (resetActive || this._activeIndex >= rows.length || !this._isActivatable(rows[this._activeIndex])) {
         // Open on the selected option, else the first one you can pick.
         const selected = rows.findIndex((row) => row.kind === 'option' && this._isSelected(row.entry));
         this._activeIndex = query ? this._firstActivatable(0, 1) : selected !== -1 && !this._multiple ? selected : -1;
      }
      this._renderMenu();
   }

   _isActivatable(row) {
      if (!row) return false;
      if (row.kind === 'all' || row.kind === 'create') return true;
      return row.kind === 'option' && !this._isBlocked(row.entry);
   }

   _isBlocked(entry) {
      if (entry.disabled) return true;
      return this._multiple && this._max !== null && this._selectedEntries.length >= this._max && !this._isSelected(entry);
   }

   _firstActivatable(from, step) {
      for (let i = from; i >= 0 && i < this._rows.length; i += step) if (this._isActivatable(this._rows[i])) return i;
      return -1;
   }

   _renderMenu() {
      if (!this._open) return;
      const virtual = this._isVirtual();
      this.$menu.classList.toggle('slice_select_menu--virtual', virtual);
      const height = ROW_HEIGHT[this._size] ?? ROW_HEIGHT.md;
      let start = 0;
      let end = this._rows.length;
      if (virtual) {
         const view = this.$menu.clientHeight || 300;
         start = Math.max(0, Math.floor(this.$menu.scrollTop / height) - 6);
         end = Math.min(this._rows.length, Math.ceil((this.$menu.scrollTop + view) / height) + 6);
      }
      const nodes = [];
      if (virtual) nodes.push(this._spacer(start * height));
      for (let i = start; i < end; i++) nodes.push(this._rowNode(this._rows[i], i));
      if (virtual) nodes.push(this._spacer((this._rows.length - end) * height));
      slice.controller.destroyByContainer(this.$menu);
      this.$menu.replaceChildren(...nodes);
      this._syncMenuState();
      this._position();
   }

   _spacer(height) {
      const spacer = document.createElement('div');
      spacer.className = 'slice_select_spacer';
      spacer.setAttribute('role', 'presentation');
      spacer.style.height = `${height}px`;
      return spacer;
   }

   _rowNode(row, index) {
      const node = document.createElement('div');
      node.dataset.index = String(index);
      if (row.kind === 'group') {
         node.className = 'slice_select_group';
         node.setAttribute('role', 'presentation');
         node.textContent = row.text;
         return node;
      }
      if (row.kind === 'status') {
         node.className = 'slice_select_no_results';
         node.setAttribute('role', 'presentation');
         if (this._remoteLoading) node.classList.add('slice_select_loading');
         node.textContent = row.text;
         return node;
      }
      node.id = `${this._uid}-opt-${index}`;
      node.setAttribute('role', 'option');
      node.className = 'slice_select_option';
      if (row.kind === 'all') {
         node.classList.add('slice_select_option--all');
         node.appendChild(this._checkNode());
         node.appendChild(this._textNode(this._t('selectAll')));
         return node;
      }
      if (row.kind === 'create') {
         node.classList.add('slice_select_option--create');
         const text = document.createElement('span');
         text.className = 'slice_select_option_label';
         text.append(`${this._t('create')} `);
         const strong = document.createElement('strong');
         strong.textContent = `“${row.text}”`;
         text.appendChild(strong);
         node.appendChild(text);
         return node;
      }
      const entry = row.entry;
      if (this._multiple) node.appendChild(this._checkNode());
      if (entry.icon) {
         const slot = document.createElement('span');
         slot.className = 'slice_select_option_icon';
         slot.setAttribute('aria-hidden', 'true');
         if (entry.icon instanceof Node) slot.appendChild(entry.icon.cloneNode(true));
         else {
            slice.build('Icon', { name: String(entry.icon), size: 'small' }).then((icon) => {
               if (icon && slot.isConnected) slot.appendChild(icon);
               else if (icon) slice.controller.destroyComponent(icon);
            }).catch(() => {});
         }
         node.appendChild(slot);
      }
      node.appendChild(this._textNode(entry.label, entry.description));
      return node;
   }

   _checkNode() {
      const check = document.createElement('span');
      check.className = 'slice_select_check';
      check.setAttribute('aria-hidden', 'true');
      return check;
   }

   _textNode(label, description = null) {
      const box = document.createElement('span');
      box.className = 'slice_select_option_text';
      const main = document.createElement('span');
      main.className = 'slice_select_option_label';
      const query = fold(this._query.trim());
      // Mark the match (accent-insensitive) when filtering locally.
      if (query && !this._loadOptions) {
         let folded = '';
         const origin = [];
         for (let i = 0; i < label.length; i++) {
            const piece = fold(label[i]);
            for (let j = 0; j < piece.length; j++) origin.push(i);
            folded += piece;
         }
         const at = folded.indexOf(query);
         if (at !== -1) {
            const startAt = origin[at];
            const endAt = (origin[at + query.length - 1] ?? label.length - 1) + 1;
            const mark = document.createElement('mark');
            mark.textContent = label.slice(startAt, endAt);
            main.append(label.slice(0, startAt), mark, label.slice(endAt));
         } else main.textContent = label;
      } else main.textContent = label;
      box.appendChild(main);
      if (description) {
         const sub = document.createElement('span');
         sub.className = 'slice_select_option_description';
         sub.textContent = String(description);
         box.appendChild(sub);
      }
      return box;
   }

   // Selected / disabled / active marks, without redrawing the rows.
   _syncMenuState() {
      const options = this._rows.filter((row) => row.kind === 'option' && !row.entry.disabled);
      const allOn = options.length > 0 && options.every((row) => this._isSelected(row.entry));
      const someOn = options.some((row) => this._isSelected(row.entry));
      for (const node of this.$menu.querySelectorAll('[role="option"]')) {
         const row = this._rows[Number(node.dataset.index)];
         if (!row) continue;
         let selected = false;
         let disabled = false;
         if (row.kind === 'option') {
            selected = this._isSelected(row.entry);
            disabled = this._isBlocked(row.entry);
         } else if (row.kind === 'all') {
            selected = allOn;
            node.classList.toggle('is-mixed', !allOn && someOn);
         }
         node.setAttribute('aria-selected', selected ? 'true' : 'false');
         node.classList.toggle('active', selected);
         if (disabled) node.setAttribute('aria-disabled', 'true');
         else node.removeAttribute('aria-disabled');
         const isActive = Number(node.dataset.index) === this._activeIndex;
         node.classList.toggle('highlighted', isActive);
      }
      const activeNode = this._activeIndex >= 0 ? this.$menu.querySelector(`[data-index="${this._activeIndex}"][role="option"]`) : null;
      if (activeNode) this.$select.setAttribute('aria-activedescendant', activeNode.id);
      else this.$select.removeAttribute('aria-activedescendant');
   }

   _setActive(index) {
      this._activeIndex = index;
      const height = ROW_HEIGHT[this._size] ?? ROW_HEIGHT.md;
      if (this._isVirtual() && index >= 0) {
         const top = index * height;
         if (top < this.$menu.scrollTop) this.$menu.scrollTop = top;
         else if (top + height > this.$menu.scrollTop + this.$menu.clientHeight) this.$menu.scrollTop = top + height - this.$menu.clientHeight;
         this._renderMenu();
         return;
      }
      this._syncMenuState();
      this.$menu.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' });
   }

   _move(step) {
      if (this._rows.length === 0) return;
      let index = this._activeIndex;
      for (let tries = 0; tries < this._rows.length; tries++) {
         index += step;
         if (index < 0) index = this._rows.length - 1;
         if (index >= this._rows.length) index = 0;
         if (this._isActivatable(this._rows[index])) {
            this._setActive(index);
            return;
         }
      }
   }

   _activateRow(index) {
      const row = this._rows[index];
      if (!this._isActivatable(row)) return;
      if (row.kind === 'all') this._toggleAll();
      else if (row.kind === 'create') this._create(row.text);
      else this._toggle(row.entry);
   }

   // ---------------------------------------------------------------- remote

   _fetch(query, immediate = false) {
      clearTimeout(this._remoteTimer);
      const run = async () => {
         this._remoteController?.abort();
         const controller = new AbortController();
         this._remoteController = controller;
         this._remoteLoading = true;
         this._refresh();
         let list = [];
         try {
            list = await this._loadOptions(query, { signal: controller.signal });
         } catch (error) {
            if (controller.signal.aborted) return;
            console.error('Select: loadOptions failed', error);
         }
         if (controller.signal.aborted || !this._open) return;
         this._remoteLoading = false;
         this._options = Array.isArray(list) ? list : [];
         this._buildEntries();
         this._refresh(true);
      };
      if (immediate) run();
      else this._remoteTimer = window.setTimeout(run, 250);
   }

   // ---------------------------------------------------------------- events

   _handleControlPointerDown(event) {
      // Keep the focus in the input when the pointer lands on the box.
      if (event.target !== this.$select && !event.target.closest('.slice_select_chip_remove, .slice_select_clear')) {
         event.preventDefault();
      }
   }

   _handleControlClick(event) {
      if (this._disabled) return;
      if (event.target.closest('.slice_select_clear, .slice_select_chip_remove')) return;
      this.$select.focus({ preventScroll: true });
      // Clicking into the text of an open, searchable field keeps it open.
      if (this._open && event.target === this.$select && !this.$select.readOnly) return;
      this._setOpen(!this._open, true);
   }

   _handleChipsClick(event) {
      const remove = event.target.closest('.slice_select_chip_remove');
      if (!remove || this._disabled) return;
      event.stopPropagation();
      const entry = remove.closest('.slice_select_chip')?._entry;
      if (entry) this._commit(this._selectedEntries.filter((selected) => selected !== entry));
      this.$select.focus({ preventScroll: true });
   }

   _handleClear(event) {
      event.stopPropagation();
      if (this._disabled) return;
      this._commit([]);
      this.$select.focus({ preventScroll: true });
   }

   _handleMenuPointerDown(event) {
      // A click in the list must not take the focus from the input.
      event.preventDefault();
   }

   _handleMenuClick(event) {
      const node = event.target.closest('[role="option"]');
      if (!node) return;
      const index = Number(node.dataset.index);
      this._activeIndex = index;
      this._activateRow(index);
   }

   _handleMenuScroll() {
      if (!this._isVirtual() || this._frame) return;
      this._frame = requestAnimationFrame(() => {
         this._frame = 0;
         this._renderMenu();
      });
   }

   _handleInput() {
      if (this.$select.readOnly) return;
      const typed = this.$select.value;
      if (!this._open) this._setOpen(true, true, false);
      this._query = typed;
      if (this.$select.value !== typed) {
         this.$select.value = typed;
         this.$select.setSelectionRange(typed.length, typed.length);
      }
      if (this._loadOptions) this._fetch(this._query);
      this._refresh(true);
      this._syncField();
   }

   _handleKeydown(event) {
      if (this._disabled) return;
      const open = this._open;
      const editable = !this.$select.readOnly;
      switch (event.key) {
         case 'ArrowDown':
            event.preventDefault();
            if (!open) {
               this._setOpen(true, true);
               if (this._activeIndex === -1) this._setActive(this._firstActivatable(0, 1));
            } else this._move(1);
            return;
         case 'ArrowUp':
            event.preventDefault();
            if (!open) {
               this._setOpen(true, true);
               this._setActive(this._firstActivatable(this._rows.length - 1, -1));
            } else this._move(-1);
            return;
         case 'PageDown':
         case 'PageUp':
            if (!open) return;
            event.preventDefault();
            for (let i = 0; i < 8; i++) this._move(event.key === 'PageDown' ? 1 : -1);
            return;
         case 'Home':
         case 'End':
            // In a text field these move the caret.
            if (!open || editable) return;
            event.preventDefault();
            this._setActive(event.key === 'Home' ? this._firstActivatable(0, 1) : this._firstActivatable(this._rows.length - 1, -1));
            return;
         case 'Enter':
            if (!open) {
               event.preventDefault();
               this._setOpen(true, true);
               return;
            }
            event.preventDefault();
            if (this._activeIndex >= 0) this._activateRow(this._activeIndex);
            else if (this._creatable && this._query.trim()) this._create(this._query);
            return;
         case ' ':
            if (editable && open) return; // a space is part of the search
            event.preventDefault();
            if (!open) this._setOpen(true, true);
            else if (this._activeIndex >= 0) this._activateRow(this._activeIndex);
            return;
         case 'Escape':
            if (open) {
               event.preventDefault();
               event.stopPropagation();
               this._setOpen(false, true);
            } else if (this._clearable && this._selectedEntries.length > 0) {
               event.preventDefault();
               this._commit([]);
            }
            return;
         case 'Tab':
            if (open) this._setOpen(false, false);
            return;
         case 'Backspace':
            if (this._multiple && this.$select.value === '' && this._selectedEntries.length > 0) {
               event.preventDefault();
               this._commit(this._selectedEntries.slice(0, -1));
            }
            return;
         default:
            // A select you cannot type in still jumps to an option by its first letters.
            if (!editable && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
               this._typeTo(event.key);
            }
      }
   }

   _typeTo(char) {
      clearTimeout(this._typeaheadTimer);
      this._typeahead += fold(char);
      this._typeaheadTimer = window.setTimeout(() => { this._typeahead = ''; }, 500);
      if (!this._open) this._setOpen(true, true);
      const query = this._typeahead.length > 1 && new Set(this._typeahead).size === 1 ? this._typeahead[0] : this._typeahead;
      const start = Math.max(0, this._activeIndex) + (query.length === 1 ? 1 : 0);
      for (let i = 0; i < this._rows.length; i++) {
         const index = (start + i) % this._rows.length;
         const row = this._rows[index];
         if (row.kind === 'option' && !this._isBlocked(row.entry) && fold(row.entry.label).startsWith(query)) {
            this._setActive(index);
            return;
         }
      }
   }

   _handleOutsidePointer(event) {
      if (!this.contains(event.target)) this._setOpen(false, false);
   }

   _handleFocusOut(event) {
      if (!this._open) return;
      const next = event.relatedTarget;
      if (next && !this.contains(next)) this._setOpen(false, false);
   }

   _handleViewport() {
      if (this._frame) return;
      this._frame = requestAnimationFrame(() => {
         this._frame = 0;
         this._position();
      });
   }
}

customElements.define('slice-select', Select);