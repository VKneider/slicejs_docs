// Content blocks: the pieces a block that shows information is made of.
//
//   iconName(spec)          'rocket' | { name: 'rocket' } | false → 'rocket' | ''
//   toNodes(content, cls)   a string, a node, a component or an array of them → nodes
//                           (strings become paragraphs with `cls`, never markup)
//   destroyNodes(nodes)     destroy the components in nodes that are going away
//   heading(level, cls)     an <h2>…<h6> (an out-of-range level falls back to `fallback`)
//
// Used by Callout, FeatureList, Stepper, SectionHeader, Timeline and TourOverlay.

/**
 * The Icon name in an `icon` prop.
 * @param {unknown} spec
 * @returns {string}
 */
export function iconName(spec) {
   if (!spec) return '';
   if (typeof spec === 'string') return spec;
   if (typeof spec === 'object' && typeof (/** @type {any} */ (spec)).name === 'string') return /** @type {any} */ (spec).name;
   return '';
}

/**
 * Turn a `content` prop into nodes. Text is always text (a paragraph), never parsed.
 * @param {unknown} content
 * @param {string} paragraphClass
 * @returns {Node[]}
 */
export function toNodes(content, paragraphClass) {
   const list = Array.isArray(content) ? content : [content];
   /** @type {Node[]} */
   const nodes = [];
   for (const item of list) {
      if (item === null || item === undefined || item === false || item === '') continue;
      if (item instanceof Node) {
         nodes.push(item);
         continue;
      }
      const p = document.createElement('p');
      p.className = paragraphClass;
      p.textContent = String(item);
      nodes.push(p);
   }
   return nodes;
}

/**
 * Destroy the Slice components in (or being) these nodes, and take them out of the DOM.
 * @param {Iterable<Node>} nodes
 */
export function destroyNodes(nodes) {
   for (const node of nodes) {
      if (!node) continue;
      const element = /** @type {any} */ (node);
      if (element.sliceId) slice.controller.destroyComponent(element);
      else if (node instanceof Element) slice.controller.destroyByContainer(node);
      if (node.parentNode) node.parentNode.removeChild(node);
   }
}

/**
 * A heading element of the given level.
 * @param {unknown} level
 * @param {string} className
 * @param {number} [fallback]
 * @returns {HTMLHeadingElement}
 */
export function heading(level, className, fallback = 3) {
   const value = Number(level);
   const n = Number.isInteger(value) && value >= 1 && value <= 6 ? value : fallback;
   const el = /** @type {HTMLHeadingElement} */ (document.createElement(`h${n}`));
   el.className = className;
   return el;
}

/**
 * A heading level from a prop value (1–6), or the fallback.
 * @param {unknown} value
 * @param {number} fallback
 * @returns {number}
 */
export function headingLevel(value, fallback) {
   const n = Number(value);
   return Number.isInteger(n) && n >= 1 && n <= 6 ? n : fallback;
}
