export default class LeakInspectorDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/leak-inspector.md";
    this.markdownContent = "---\ntitle: Leak Inspector\nroute: /Documentation/LeakInspector\nnavLabel: Leak Inspector\nsection: Getting Started\ngroup: Diagnostics\norder: 43\ndescription: Dev-only panel that surfaces components left registered but detached from the DOM.\ncomponent: LeakInspectorDocumentation\ntags: [diagnostics, leaks, cleanup, lifecycle, devtools]\n---\n\n# Leak Inspector\n\n## Overview\nThe most common Slice leak is silent: a component builds children with `slice.build(...)`\nand later clears them with `innerHTML = ''`, `replaceChildren`, or `remove()` **without**\n`destroyComponent`. The DOM is gone, but the instances stay registered in\n`slice.controller.activeComponents` forever — and their `beforeDestroy()` never runs, so\ntheir listeners, timers, and observers leak too.\n\nThe framework can't see this for you at build time, so the **Leak Inspector** is a dev-only\npanel that watches `activeComponents` and flags the orphans: components that are **registered\nbut detached from the live DOM and not intentionally cached**.\n\n## Enable\nThe Leak Inspector lives under the `debugger` config and is **always off in production**,\nregardless of this flag:\n\n```json title=\"sliceConfig.json\"\n{\n  \"debugger\": {\n    \"enabled\": false,\n    \"click\": \"right\",\n    \"leakInspector\": { \"enabled\": true, \"shortcut\": \"alt+shift+k\" }\n  }\n}\n```\n\nOpen it with the shortcut (`alt+shift+k` by default). The panel computes only while open —\nzero overhead otherwise.\n\n## What it flags (and what it ignores)\nA component is a **candidate leak** when all of the following hold:\n\n- it is registered in `slice.controller.activeComponents`, and\n- it is an `HTMLElement` **detached** from the live DOM (`isConnected === false`), and\n- it is **not intentionally cached**.\n\nThe criteria are deliberately conservative so caching patterns are **not** false-flagged:\n\n| Excluded | Why |\n| --- | --- |\n| `Route` / `MultiRoute` cached views | Marked `__sliceCached` while parked off-DOM between navigations |\n| Router-managed instances (`route-*` ids) | Reused across navigation by the Router |\n| Descendants of a detached cached/orphan root | Only the root is reported, not every child |\n\nThe panel also tracks `activeComponents.size` over time and shows a **trend** marker — a\ncount that only ever grows across navigations is the signal of an accumulation leak even when\nindividual orphans look ambiguous.\n\n## The panel\n- **orphans** — each candidate with its component name, `sliceId`, why it was flagged, and the\n  `parentComponent` retain chain. A per-row **destroy** action calls `destroyComponent` so you\n  can confirm a suspect frees cleanly.\n- **active** — current `activeComponents.size`.\n- **trend** — `stable` or `growing ▲`.\n\n## Programmatic API\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `findOrphans` | `()` | Returns the current candidate leaks (read-only) |\n| `registerLeakExclusion` | `(predicate)` | Mark your own cached-but-detached instances as intentional |\n\n```javascript title=\"Exclude an app-specific cache from leak detection\"\n// Your own pool/cache keeps instances off-DOM on purpose.\nslice.controller.registerLeakExclusion((component) => myPool.has(component.sliceId));\n```\n\n## Fixing a leak\nWhen the inspector flags a component, the fix is almost always to destroy before you detach:\n\n```javascript title=\"Destroy slice.build'd children before clearing\"\nasync update() {\n  /* ❌ leaks: instances stay in activeComponents, beforeDestroy never runs */\n  this.$list.innerHTML = '';\n\n  /* ✅ destroy first, then the DOM is safe to clear */\n  slice.controller.destroyByContainer(this.$list);\n  this.$list.replaceChildren();\n\n  for (const order of this.orders) {\n    this.$list.appendChild(await slice.build('OrderRow', { order }));\n  }\n}\n```\n\nAnd release anything that outlives the subtree in `beforeDestroy()`:\n\n```javascript title=\"Free globals/timers/observers on destroy\"\nbeforeDestroy() {\n  window.removeEventListener('resize', this._onResize);\n  clearInterval(this._timer);\n  this._observer.disconnect();\n}\n```\n\nSee [beforeDestroy()](/Documentation/LifeCycle-Methods/beforeDestroy) for the full cleanup\ncontract, and [DevTools](/Documentation/DevTools) for the other runtime panels.\n\n## Best Practices\n:::tip\nKeep the Leak Inspector enabled in development and exercise your navigation/list flows with it\nopen — accumulation leaks show up as a `growing ▲` trend across route changes.\n:::\n\n:::tip\nFor your own off-DOM caches, register a `registerLeakExclusion` predicate (or set\n`component.__sliceCached = true`) so the inspector doesn't flag intentional retention.\n:::\n\n## Gotchas\n:::warning\nThe Leak Inspector diagnoses; it does not fix. A per-row destroy is a manual probe — the real\nfix is calling `destroyComponent` / `destroyByContainer` before clearing the DOM.\n:::\n\n:::warning\nIt is dev-only. Don't rely on it in production; rely on correct cleanup. The panel never\ninitializes when the app runs in production mode.\n:::\n\n## FAQ\n:::details title=\"Why is my cached Route view not flagged?\"\n`Route` and `MultiRoute` mark their cached instances `__sliceCached` while they sit off-DOM\nbetween navigations, so the inspector treats them as intentional, not leaks.\n:::\n\n:::details title=\"It flagged a component I destroy later — is that a real leak?\"\nIf it is detached now and still registered, yes — it is leaking until you destroy it. Destroy at\nthe moment you remove it from the DOM, not \"later\".\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"debugger\": {\n    \"enabled\": false,\n    \"click\": \"right\",\n    \"leakInspector\": { \"enabled\": true, \"shortcut\": \"alt+shift+k\" }\n  }\n}",
               language: "json"
            });
            if ("sliceConfig.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "sliceConfig.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const lines = ["| Excluded | Why |","| --- | --- |","| `Route` / `MultiRoute` cached views | Marked `__sliceCached` while parked off-DOM between navigations |","| Router-managed instances (`route-*` ids) | Reused across navigation by the Router |","| Descendants of a detached cached/orphan root | Only the root is reported, not every child |"];
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const lines = ["| Method | Signature | Notes |","| --- | --- | --- |","| `findOrphans` | `()` | Returns the current candidate leaks (read-only) |","| `registerLeakExclusion` | `(predicate)` | Mark your own cached-but-detached instances as intentional |"];
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "// Your own pool/cache keeps instances off-DOM on purpose.\nslice.controller.registerLeakExclusion((component) => myPool.has(component.sliceId));",
               language: "javascript"
            });
            if ("Exclude an app-specific cache from leak detection") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Exclude an app-specific cache from leak detection";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async update() {\n  /* ❌ leaks: instances stay in activeComponents, beforeDestroy never runs */\n  this.$list.innerHTML = '';\n\n  /* ✅ destroy first, then the DOM is safe to clear */\n  slice.controller.destroyByContainer(this.$list);\n  this.$list.replaceChildren();\n\n  for (const order of this.orders) {\n    this.$list.appendChild(await slice.build('OrderRow', { order }));\n  }\n}",
               language: "javascript"
            });
            if ("Destroy slice.build'd children before clearing") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Destroy slice.build'd children before clearing";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "beforeDestroy() {\n  window.removeEventListener('resize', this._onResize);\n  clearInterval(this._timer);\n  this._observer.disconnect();\n}",
               language: "javascript"
            });
            if ("Free globals/timers/observers on destroy") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Free globals/timers/observers on destroy";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const details = await slice.build('Details', { title: "Why is my cached Route view not flagged?", text: "`Route` and `MultiRoute` mark their cached instances `__sliceCached` while they sit off-DOM\nbetween navigations, so the inspector treats them as intentional, not leaks." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const details = await slice.build('Details', { title: "It flagged a component I destroy later — is that a real leak?", text: "If it is detached now and still registered, yes — it is leaking until you destroy it. Destroy at\nthe moment you remove it from the DOM, not \"later\"." });
            container.appendChild(details);
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

customElements.define('slice-leakinspectordocumentation', LeakInspectorDocumentation);
