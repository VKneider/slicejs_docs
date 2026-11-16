// What Input and Textarea share as text fields: the validation rules, their
// messages, and when an error is allowed to show. DatePicker takes the
// messages, FileUpload the field ids.
//
// Both components import this module, so a rule or a message changes in one
// place and the two fields can never disagree about what "invalid" means.
// The floating label and the error shake are shared too, but as CSS: each
// component's stylesheet carries the same rules (Textarea.spec.js holds them
// to it), because a stylesheet is loaded per component.

import { texts } from '../text/texts.js';

export const DEFAULT_MESSAGES = {
   required: 'This field is required',
   email: 'Enter a valid email address',
   url: 'Enter a valid URL',
   number: 'Enter a number',
   min: 'Must be {min} or more',
   max: 'Must be {max} or less',
   step: 'Must be a multiple of {step}',
   minlength: 'Use at least {minlength} characters',
   maxlength: 'Use at most {maxlength} characters',
   pattern: 'Doesn’t match the expected format',
};

const ES = {
   required: 'Este campo es obligatorio',
   email: 'Introduce un correo válido',
   url: 'Introduce una URL válida',
   number: 'Introduce un número',
   min: 'Debe ser {min} o más',
   max: 'Debe ser {max} o menos',
   step: 'Debe ser múltiplo de {step}',
   minlength: 'Usa al menos {minlength} caracteres',
   maxlength: 'Usa como máximo {maxlength} caracteres',
   pattern: 'No coincide con el formato esperado',
};

const t = texts('slice.validation', { en: DEFAULT_MESSAGES, es: ES });

/** Defaults in the active locale; `rules.messages` still wins over every key. */
const translatedDefaults = () =>
   Object.fromEntries(Object.keys(DEFAULT_MESSAGES).map((key) => [key, t(key)]));

export const VALIDATE_ON = ['blur', 'input', 'manual'];
export const FIELD_VARIANTS = ['outlined', 'filled', 'ghost'];
export const LABEL_PLACEMENTS = ['floating', 'above'];

let counter = 0;
/** A document-unique id, so a <label for> and aria-describedby can point at the field. */
export function fieldId(prefix) {
   counter += 1;
   return `${prefix}-${counter}`;
}

function format(template, values) {
   return String(template).replace(/\{(\w+)\}/g, (_, key) => (values[key] ?? ''));
}

/**
 * The legacy `conditions` object, as a test. `regex` wins; otherwise the
 * character-class counts and lengths are compiled into one pattern, exactly as
 * Input always did, so existing conditions keep meaning the same thing.
 */
export function compileConditions(conditions) {
   if (!conditions || typeof conditions !== 'object') return null;
   const {
      regex,
      minLength = 0, maxLength = Infinity,
      minMinusc = 0, maxMinusc = Infinity,
      minMayusc = 0, maxMayusc = Infinity,
      minNumber = 0, maxNumber = Infinity,
      minSymbol = 0, maxSymbol = Infinity,
   } = conditions;
   if (regex) return regex instanceof RegExp ? regex : new RegExp(regex);
   const bound = (n) => (n === Infinity ? '' : n);
   return new RegExp(
      `^(?=(?:.*[a-z]){${minMinusc},${bound(maxMinusc)}})` +
      `(?=(?:.*[A-Z]){${minMayusc},${bound(maxMayusc)}})` +
      `(?=(?:.*\\d){${minNumber},${bound(maxNumber)}})` +
      `(?=(?:.*[\\W_]){${minSymbol},${bound(maxSymbol)}})` +
      `[\\s\\S]{${minLength},${bound(maxLength)}}$`
   );
}

/**
 * The first rule `value` breaks, as a message; '' when it breaks none.
 *
 * @param {string} value
 * @param {object} rules
 * @param {boolean} [rules.required]
 * @param {string}  [rules.type]       input type: email, url, number…
 * @param {HTMLInputElement|HTMLTextAreaElement} [rules.element] for native validity
 * @param {number}  [rules.minlength]
 * @param {number}  [rules.maxlength]
 * @param {RegExp|null} [rules.conditions] compiled `conditions`
 * @param {string}  [rules.conditionsMessage]
 * @param {(value: string) => (string|null|undefined|false)} [rules.validator]
 * @param {object}  [rules.messages]   overrides for DEFAULT_MESSAGES
 */
export function validationMessage(value, rules = {}) {
   const messages = { ...translatedDefaults(), ...(rules.messages || {}) };
   const text = value ?? '';
   const empty = String(text).trim() === '';

   if (empty) return rules.required ? messages.required : '';

   const el = rules.element;
   const validity = el?.validity;
   if (validity && !validity.valid) {
      // Native checks the platform does well: formats, numeric ranges, pattern.
      if (validity.typeMismatch) return rules.type === 'url' ? messages.url : messages.email;
      if (validity.badInput) return messages.number;
      if (validity.rangeUnderflow) return format(messages.min, { min: el.min });
      if (validity.rangeOverflow) return format(messages.max, { max: el.max });
      if (validity.stepMismatch) return format(messages.step, { step: el.step });
      if (validity.patternMismatch) return messages.pattern;
   }

   // Lengths are checked here, not by the browser: tooShort/tooLong only fire
   // for text a person typed, so a value set from code would always pass.
   const length = [...String(text)].length;
   if (rules.minlength && length < rules.minlength) return format(messages.minlength, rules);
   if (rules.maxlength && length > rules.maxlength) return format(messages.maxlength, rules);

   if (rules.conditions && !rules.conditions.test(String(text))) {
      return rules.conditionsMessage || messages.pattern;
   }

   if (typeof rules.validator === 'function') {
      const result = rules.validator(String(text));
      if (result) return String(result);
   }
   return '';
}

/** "12 / 280", or just "12" with no limit. */
export function countText(value, max) {
   const length = [...String(value ?? '')].length;
   return max ? `${length} / ${max}` : String(length);
}
