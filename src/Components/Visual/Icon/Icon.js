// Names + geometry, generated from the `lucide` package (see
// scripts/generate-icons.mjs). ALIASES records which Lucide icon backs each
// public name, so the mapping is auditable instead of magic.
//
// Only the default export: the bundler treats a component module as
// single-export, and a named re-export here fails the production build with
// "Export statement may only appear at the top level".
import { ICON_NODES, LEGACY_NODES, LEGACY_VIEWBOX, ALIASES } from './icons.generated.js';

// Warns once per deprecated prop name (kept module-scoped so each component
// reports a given alias only once per session).
const _sliceDeprecated = new Set();
function deprecate(oldName, newName) {
   if (_sliceDeprecated.has(oldName)) return;
   _sliceDeprecated.add(oldName);
   console.warn(`[Slice] "${oldName}" is deprecated; use "${newName}" instead.`);
}

// ── "did you mean" for unknown names ───────────────────────────────────────
// An unknown name renders an empty <svg>. Telling the author only THAT it is
// invalid makes them go read a 291-row table; the realistic mistake is not a
// typo but a name that exists somewhere else — the Lucide name the icon was
// migrated FROM ('circle-check' vs the public 'check-circle'), or a near miss
// ('chek' vs 'check'). So name the replacement.
//
// Keyed on the same "warn once per session" basis as deprecate(): _render() runs
// from the name setter (in the constructor) AND from init(), so an unguarded
// warn fires twice for every instance of every bad name.
const _warnedNames = new Set();

// Reverse of ALIASES: lucide name -> the public name that replaced it.
//
// This is the single most likely mistake, and edit distance cannot see it:
// 'circle-check' and 'check-circle' are the same two words in the other order,
// so distance ranks them far apart and happily proposes 'file-check' instead.
// Reverse-indexing the alias table answers it exactly.
const _lucideToPublic = new Map();
for (const [publicName, lucideName] of Object.entries(ALIASES)) {
   if (!_lucideToPublic.has(lucideName)) _lucideToPublic.set(lucideName, publicName);
}

/** Damerau-free Levenshtein; both strings are short so the row buffer is tiny. */
function _editDistance(a, b) {
   if (a === b) return 0;
   const row = Array.from({ length: b.length + 1 }, (_, i) => i);
   for (let i = 1; i <= a.length; i++) {
      let prev = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j++) {
         const next = row[j];
         row[j] = Math.min(
            row[j] + 1,
            row[j - 1] + 1,
            prev + (a[i - 1] === b[j - 1] ? 0 : 1)
         );
         prev = next;
      }
   }
   return row[b.length];
}

/**
 * Closest public icon name, or null when nothing is close enough to guess.
 *
 * The threshold scales with length because a fixed one is wrong at both ends:
 * at 1 it would turn every typo into a confident wrong suggestion, and at 3 a
 * short name like "x" could match anything.
 */
function _suggest(name) {
   const needle = String(name).toLowerCase();

   // An exact Lucide name is the highest-confidence guess available, so it is
   // checked BEFORE any distance work.
   const renamed = _lucideToPublic.get(needle);
   if (renamed) return renamed;

   const pool = [...Object.keys(ICON_NODES), ...Object.keys(LEGACY_NODES)];

   let best = null;
   let bestDistance = Infinity;
   for (const candidate of pool) {
      const d = _editDistance(needle, candidate.toLowerCase());
      if (d < bestDistance) {
         bestDistance = d;
         best = candidate;
      }
   }

   return bestDistance <= Math.max(1, Math.floor(needle.length / 3)) ? best : null;
}

// Stroke geometry for the Lucide-backed icons (Lucide's own defaults). The
// legacy brand marks are filled, so they get `FILL` attributes instead — one
// svg cannot be both stroke and fill.
const STROKE_ATTRS = {
   fill: 'none',
   stroke: 'currentColor',
   'stroke-width': '2',
   'stroke-linecap': 'round',
   'stroke-linejoin': 'round',
};
const FILL_ATTRS = { fill: 'currentColor', stroke: 'none' };

const SVG_NS = 'http://www.w3.org/2000/svg';
const SIZE_KEYWORDS = { small: '16px', medium: '20px', large: '24px' };

export default class Icon extends HTMLElement {

   static props = {
      name: {
         type: 'string',
         default: 'youtube'
      },
      size: {
         type: 'string',
         default: 'small'
      },
      color: {
         type: 'string',
         default: 'currentColor'
      },
      // Accessible name. Omitted (the default) the icon is `aria-hidden`, which
      // is what you want next to a visible label — an unlabelled glyph should
      // not be announced at all.
      label: {
         type: 'string',
         default: ''
      },
      // Deprecated no-op: the icon set moved from the two-style `slc` font to
      // Lucide, which is stroke-only. Accepted and ignored so existing callers
      // keep working.
      iconStyle: {
         type: 'string',
         default: null
      }
   };

   constructor(props) {
      super();

      slice.attachTemplate(this);
      this.$svg = this.querySelector('svg');

      slice.controller.setComponentProps(this, props);
   }

   init() {
      this._render();
   }

   /** Rebuild the glyph. Safe to call on every prop change — it is cheap. */
   _render() {
      const svg = this.$svg;
      if (!svg) return;

      const nodes = ICON_NODES[this._name];
      const legacy = LEGACY_NODES[this._name];

      if (!nodes && !legacy) {
         // Warn on every PATH, not just init(): the old version only checked at
         // build time, so renaming `name` to a typo rendered a silent blank box.
         // Guarded per name, because _render() runs from the name setter AND
         // from init(), so each bad instance would otherwise warn twice.
         if (this._name && !_warnedNames.has(this._name)) {
            _warnedNames.add(this._name);
            const hint = _suggest(this._name);
            console.warn(
               `[Icon] "${this._name}" is not a valid icon name. ` +
               (hint ? `Did you mean "${hint}"? ` : '') +
               `Check the Icon reference for valid names.`
            );
         }
         svg.replaceChildren();
         return;
      }

      const attrs = legacy ? FILL_ATTRS : STROKE_ATTRS;
      for (const key of Object.keys(attrs)) svg.setAttribute(key, attrs[key]);

      // The sprite's marks are NOT all 24x24 — the brand and Slice logos were
      // authored on a ~1000-1180 unit grid (sliceJs is 1061x1320). The template's
      // viewBox is 24x24, so without this they painted ~55x too large; combined
      // with `overflow: visible` they escaped the layout box and covered the
      // page. The generator reads each symbol's real viewBox from the sprite.
      svg.setAttribute('viewBox', legacy ? (LEGACY_VIEWBOX[this._name] || '0 0 24 24') : '0 0 24 24');

      // Build with the DOM, never innerHTML: the data is generated and trusted,
      // but node construction costs nothing here and keeps the rule absolute.
      const children = (nodes || legacy).map(([tag, nodeAttrs]) => {
         const el = document.createElementNS(SVG_NS, tag);
         for (const [k, v] of Object.entries(nodeAttrs)) el.setAttribute(k, v);
         return el;
      });
      svg.replaceChildren(...children);

      this._applyA11y();
   }

   _applyA11y() {
      const label = this._label;
      if (label) {
         this.removeAttribute('aria-hidden');
         this.setAttribute('role', 'img');
         this.setAttribute('aria-label', label);
      } else {
         this.removeAttribute('role');
         this.removeAttribute('aria-label');
         this.setAttribute('aria-hidden', 'true');
      }
   }

   // Props re-render on assignment. The previous implementation required a
   // separate update() call, which every consumer had to remember.
   get name() { return this._name; }
   set name(value) {
      this._name = value;
      this._render();
   }

   get iconStyle() { return this._iconStyle; }
   set iconStyle(value) {
      this._iconStyle = value;
      // Only an iconStyle someone actually passed is worth a warning: Button and
      // Card forward `icon.iconStyle`, which is usually undefined.
      if (value != null) deprecate('iconStyle', 'a single-style icon (Lucide has no filled variant)');
   }

   get size() { return this._size; }
   set size(value) {
      // Applied to the HOST, not an inner node, so `getComputedStyle(icon)
      // .fontSize` is meaningful and the svg scales with the surrounding text.
      this._size = SIZE_KEYWORDS[value] || value;
      this.style.fontSize = this._size;
   }

   get color() { return this._color; }
   set color(value) {
      this._color = value || 'currentColor';
      this.style.color = this._color;
   }

   get label() { return this._label; }
   set label(value) {
      this._label = typeof value === 'string' ? value : '';
      this._applyA11y();
   }

   /** Re-apply every prop. Kept for compatibility with the old contract. */
   update() {
      if (!this.$svg) return;
      this.name = this._name;
      this.size = this._size;
      this.color = this._color;
      this.label = this._label;
   }
}

customElements.define('slice-icon', Icon);