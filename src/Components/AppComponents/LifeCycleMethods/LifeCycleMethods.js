export default class LifeCycleMethods extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/lifecycle-overview.md";
    this.markdownContent = "---\ntitle: LifeCycle Methods\nroute: /Documentation/LifeCycle-Methods\nnavLabel: LifeCycle Methods\nsection: Getting Started\ngroup: Components\norder: 40\ndescription: Overview of init, update, and beforeDestroy in Slice.js.\ncomponent: LifeCycleMethods\ntags: [lifecycle, init, update, destroy]\n---\n\n# LifeCycle Methods\n\n## Overview\nSlice.js components expose three lifecycle methods for predictable behavior:\n\n- `init()` for one-time setup\n- `update()` for refreshes when data or routes change\n- `beforeDestroy()` for cleanup and memory safety\n\nThese methods are called by the framework and are the recommended places to manage state,\nsubscriptions, and DOM updates.\n\n## Which method do I use?\n| I want to… | Use | Why |\n| --- | --- | --- |\n| Cache DOM refs / bind listeners | constructor (after `attachTemplate`) or `init()` | constructor is synchronous; use `init()` if the setup is async |\n| Fetch initial data / build children | `init()` | it is `async` and awaited before first use |\n| Refresh after the data or route changed | `update()` | runs on cached-route revisits; safe to call manually |\n| Clean up timers / listeners / subscriptions | `beforeDestroy()` | runs right before destroy (not awaited) |\n\nFor *how* to refresh (prop setter vs `update()` vs context vs events), see\n[Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data).\n\n## The constructor (before init)\nBefore any lifecycle method runs, the constructor builds the component. Every Visual component's\nconstructor does three things, in order:\n\n```javascript title=\"Canonical constructor\"\nconstructor(props) {\n  super();\n  slice.attachTemplate(this);                       // 1. inject the .html as children\n  // 2. (optional) cache DOM references and bind listeners — they work now\n  slice.controller.setComponentProps(this, props);  // 3. apply props — call LAST\n}\n```\n\n- The DOM is **only** available after `slice.attachTemplate(this)`. Before that call,\n  `querySelector` returns `null`; after it, queries work inside the constructor.\n- `slice.controller.setComponentProps(this, props)` assigns each prop (and each `static props`\n  default) through its **setter**, so side effects belong in setters. Call it last.\n\nThere are two valid ways to cache DOM references:\n- **In the constructor**, after `attachTemplate` (what the official components do). Setters can\n  then update the DOM directly.\n- **In `init()`**, which is also where async work goes (fetching, building children).\n\nSee Component Anatomy for the full authoring guide.\n\n## Lifecycle Summary\n| Method | Called when | Async awaited | Typical responsibilities |\n| --- | --- | --- | --- |\n| `init()` | After construction, before first use | yes | Cache DOM, fetch initial data, build static children. |\n| `update()` | Cached route revisit, or called by a parent / self / watcher | yes | Refresh **in place** (reuse children by `sliceId`); re-fetch data; apply props. The framework **serializes** repeated calls. |\n| `beforeDestroy()` | Right before destruction | no | Cleanup timers, listeners, subscriptions, aborts. |\n\n## Call Order and Timing\n```javascript title=\"Lifecycle timing\"\nclass Example extends HTMLElement {\n  async init() {\n    // Runs once after template is attached and props are set\n  }\n\n  async update() {\n    // Runs when the component is reused or refreshed\n  }\n\n  beforeDestroy() {\n    // Runs right before the component is destroyed\n  }\n}\n```\n\n## Navigation and Reuse\n`update()` is called when a cached component is reused by routing (`Route` / `MultiRoute`\ncontainers), so static structure is never rebuilt. The framework **serializes** your `update()` —\nrapid or concurrent calls coalesce (last wins) — so streaming and fast revisits are safe without\nmanual guards.\n\n## Recommended Structure\nRefresh **in place**: reuse children by a stable `sliceId`, build only the new ones, and prune the\ngone. Survivors keep their scroll, focus, and internal state.\n\n```javascript title=\"init + in-place update + cleanup\"\nexport default class UserList extends HTMLElement {\n  async init() {\n    this.$container = this.querySelector('.users');\n    await this.refresh();\n  }\n\n  async update() {        // cached revisit or data changed → refresh in place\n    await this.refresh();\n  }\n\n  async refresh() {\n    const users = await this.loadUsers();\n    const alive = new Set();\n\n    for (const u of users) {\n      const sliceId = `user-${u.id}`;\n      alive.add(sliceId);\n      const card = slice.getComponent(sliceId);\n      if (card) slice.setComponentProps(card, { name: u.name });   // reuse, no flicker\n      else this.$container.appendChild(await slice.build('UserCard', { sliceId, ...u }));\n    }\n\n    for (const el of Array.from(this.$container.children)) {        // prune the gone\n      const id = el.getAttribute('slice-id');\n      if (id && !alive.has(id)) slice.controller.destroyComponent(id);\n    }\n  }\n\n  beforeDestroy() {\n    clearInterval(this._pollingId);\n    this.abortController?.abort();\n  }\n}\n```\n\n## Best Practices\n:::tip\nKeep `init()` focused on one-time setup and cache DOM references there.\n:::\n\n:::tip\nRefresh lists **in place**: reuse children by a stable `sliceId` (build new, update existing,\nprune gone). Destroy + rebuild only when the content is wholly different.\n:::\n\n## Gotchas\n:::warning\n`beforeDestroy()` is not awaited. Keep it synchronous or fire-and-forget.\n:::\n\n:::warning\nClearing `innerHTML` does not destroy Slice components. Use `destroyByContainer` first.\n:::\n\n## Guides\n- `init()`: /Documentation/LifeCycle-Methods/init\n- `update()`: /Documentation/LifeCycle-Methods/update\n- `beforeDestroy()`: /Documentation/LifeCycle-Methods/beforeDestroy\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| I want to… | Use | Why |","| --- | --- | --- |","| Cache DOM refs / bind listeners | constructor (after `attachTemplate`) or `init()` | constructor is synchronous; use `init()` if the setup is async |","| Fetch initial data / build children | `init()` | it is `async` and awaited before first use |","| Refresh after the data or route changed | `update()` | runs on cached-route revisits; safe to call manually |","| Clean up timers / listeners / subscriptions | `beforeDestroy()` | runs right before destroy (not awaited) |"];
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
               value: "constructor(props) {\n  super();\n  slice.attachTemplate(this);                       // 1. inject the .html as children\n  // 2. (optional) cache DOM references and bind listeners — they work now\n  slice.controller.setComponentProps(this, props);  // 3. apply props — call LAST\n}",
               language: "javascript"
            });
            if ("Canonical constructor") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Canonical constructor";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const lines = ["| Method | Called when | Async awaited | Typical responsibilities |","| --- | --- | --- | --- |","| `init()` | After construction, before first use | yes | Cache DOM, fetch initial data, build static children. |","| `update()` | Cached route revisit, or called by a parent / self / watcher | yes | Refresh **in place** (reuse children by `sliceId`); re-fetch data; apply props. The framework **serializes** repeated calls. |","| `beforeDestroy()` | Right before destruction | no | Cleanup timers, listeners, subscriptions, aborts. |"];
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
               value: "class Example extends HTMLElement {\n  async init() {\n    // Runs once after template is attached and props are set\n  }\n\n  async update() {\n    // Runs when the component is reused or refreshed\n  }\n\n  beforeDestroy() {\n    // Runs right before the component is destroyed\n  }\n}",
               language: "javascript"
            });
            if ("Lifecycle timing") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Lifecycle timing";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class UserList extends HTMLElement {\n  async init() {\n    this.$container = this.querySelector('.users');\n    await this.refresh();\n  }\n\n  async update() {        // cached revisit or data changed → refresh in place\n    await this.refresh();\n  }\n\n  async refresh() {\n    const users = await this.loadUsers();\n    const alive = new Set();\n\n    for (const u of users) {\n      const sliceId = `user-${u.id}`;\n      alive.add(sliceId);\n      const card = slice.getComponent(sliceId);\n      if (card) slice.setComponentProps(card, { name: u.name });   // reuse, no flicker\n      else this.$container.appendChild(await slice.build('UserCard', { sliceId, ...u }));\n    }\n\n    for (const el of Array.from(this.$container.children)) {        // prune the gone\n      const id = el.getAttribute('slice-id');\n      if (id && !alive.has(id)) slice.controller.destroyComponent(id);\n    }\n  }\n\n  beforeDestroy() {\n    clearInterval(this._pollingId);\n    this.abortController?.abort();\n  }\n}",
               language: "javascript"
            });
            if ("init + in-place update + cleanup") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "init + in-place update + cleanup";
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

customElements.define('slice-lifecyclemethods', LifeCycleMethods);
