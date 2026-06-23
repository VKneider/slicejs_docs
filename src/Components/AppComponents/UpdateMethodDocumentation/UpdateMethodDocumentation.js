export default class UpdateMethodDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/update-method.md";
    this.markdownContent = "---\ntitle: update()\nroute: /Documentation/LifeCycle-Methods/update\nnavLabel: update()\nsection: Getting Started\ngroup: Components\norder: 42\ndescription: Refresh dynamic UI in Slice.js components.\ncomponent: UpdateMethodDocumentation\ntags: [lifecycle, update]\n---\n\n# update()\n\n## Overview\n`update()` refreshes a component **in place** after `init()` — same instance, no destroy, no\nflicker. The router calls it when a cached `Route` / `MultiRoute` is revisited; a parent, the\ncomponent itself, or a `slice.context` watcher can call it too. Define it only when a refresh\nneeds logic beyond a prop setter — rebuilding child components, an async fetch, or applying\nseveral props at once.\n\nThe framework **wraps your `update()`**: calls are **serialized and coalesced** (last wins). An\n`async update()` driven rapidly — streaming tokens, fast state changes — never overlaps itself\nor tears the DOM. You write a plain `update()`; no manual tokens, queues, or guards.\n\n## API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `update` | `async update(props?)` | `Promise<void>` | Wrapped by the framework (serialized + coalesced). The router calls it with no args — read `this.props` (route params); a parent passes props as the argument. |\n\n## Refresh in place — reuse, don't rebuild\nWhen the data changed but the entities persist, **reuse instances by a stable `sliceId`** and let\neach one refresh itself. Survivors are never recreated, so scroll, focus, and internal state are\npreserved.\n\n```javascript title=\"Reuse surviving rows, build new ones, prune the gone\"\nasync update(state = {}) {\n  const items = state.items || [];\n  const alive = new Set();\n\n  for (const item of items) {\n    const sliceId = `row-${item.id}`;\n    alive.add(sliceId);\n\n    const row = slice.getComponent(sliceId);\n    if (row) {\n      slice.setComponentProps(row, { title: item.title });   // refresh in place\n    } else {\n      const node = await slice.build('Row', { sliceId, ...item });\n      if (node) this.$list.appendChild(node);\n    }\n  }\n\n  // prune: destroy rows whose data is gone\n  for (const el of Array.from(this.$list.children)) {\n    const id = el.getAttribute('slice-id');\n    if (id && !alive.has(id)) slice.controller.destroyComponent(id);\n  }\n}\n```\n\n`slice.setComponentProps(comp, props)` applies a bag of props to a component. On a built\ncomponent it **refreshes**: re-runs the setters, does **not** re-apply defaults, and won't clobber\nthe props you omit. (At construction time the same call applies defaults — it detects the mode.)\n\n## Total replacement — build-then-swap\nWhen the new data shares nothing with the old (e.g. a different conversation), build the\nreplacement **off-DOM first**, then swap in one operation — no empty frame.\n\n```javascript title=\"Build off-DOM, then swap atomically\"\nasync update(state = {}) {\n  const old = Array.from(this.$slot.children)\n    .map((el) => el.getAttribute('slice-id')).filter(Boolean);\n\n  const frag = document.createDocumentFragment();\n  for (const item of state.items) {\n    const node = await slice.build('Card', { sliceId: `card-${item.id}`, ...item });\n    if (node) frag.appendChild(node);\n  }\n\n  this.$slot.replaceChildren(frag);                       // atomic swap\n  if (old.length) slice.controller.destroyComponent(old); // clean up the old instances\n}\n```\n\n## Best Practices\n:::tip\nPrefer a **prop setter** for single-value changes — see\n[Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data). Reach for\n`update()` when the refresh needs logic: rebuilding children, an async fetch, or several props.\n:::\n\n:::tip\nReuse by `sliceId` for lists. The framework serializes your `update()`, so streaming and rapid\ncalls are safe without writing any guards yourself.\n:::\n\n## Gotchas\n:::warning\nClearing `innerHTML` alone does not destroy Slice components — use `destroyComponent` /\n`destroyByContainer` so `beforeDestroy` runs and the registry is cleaned.\n:::\n\n:::warning\n`update()` is for refreshes **after** `init()`. The framework does not call it on first build —\n`init()` does the first paint.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `update` | `async update(props?)` | `Promise<void>` | Wrapped by the framework (serialized + coalesced). The router calls it with no args — read `this.props` (route params); a parent passes props as the argument. |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async update(state = {}) {\n  const items = state.items || [];\n  const alive = new Set();\n\n  for (const item of items) {\n    const sliceId = `row-${item.id}`;\n    alive.add(sliceId);\n\n    const row = slice.getComponent(sliceId);\n    if (row) {\n      slice.setComponentProps(row, { title: item.title });   // refresh in place\n    } else {\n      const node = await slice.build('Row', { sliceId, ...item });\n      if (node) this.$list.appendChild(node);\n    }\n  }\n\n  // prune: destroy rows whose data is gone\n  for (const el of Array.from(this.$list.children)) {\n    const id = el.getAttribute('slice-id');\n    if (id && !alive.has(id)) slice.controller.destroyComponent(id);\n  }\n}",
               language: "javascript"
            });
            if ("Reuse surviving rows, build new ones, prune the gone") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Reuse surviving rows, build new ones, prune the gone";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async update(state = {}) {\n  const old = Array.from(this.$slot.children)\n    .map((el) => el.getAttribute('slice-id')).filter(Boolean);\n\n  const frag = document.createDocumentFragment();\n  for (const item of state.items) {\n    const node = await slice.build('Card', { sliceId: `card-${item.id}`, ...item });\n    if (node) frag.appendChild(node);\n  }\n\n  this.$slot.replaceChildren(frag);                       // atomic swap\n  if (old.length) slice.controller.destroyComponent(old); // clean up the old instances\n}",
               language: "javascript"
            });
            if ("Build off-DOM, then swap atomically") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Build off-DOM, then swap atomically";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    // Cleanup timers, listeners, or pending work here
  }

  async setupCopyButton() {
    const container = this.querySelector('[data-copy-md]');
    if (!container) return;

    const copyMenu = await slice.build('CopyMarkdownMenu', {
      markdownPath: this.markdownPath,
      markdownContent: this.markdownContent,
      label: '❐'
    });

    container.appendChild(copyMenu);
  }

  async copyMarkdown() {}
}

customElements.define('slice-updatemethoddocumentation', UpdateMethodDocumentation);
