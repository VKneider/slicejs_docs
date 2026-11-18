export default class LeakInspectorDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/leak-inspector.md";
    this.markdownContent = "---\ntitle: Leak Inspector\nroute: /Documentation/LeakInspector\nnavLabel: Leak Inspector\nsection: Tooling\ngroup: ''\norder: 50\ndescription: Dev-only panel that surfaces components left registered but detached from the DOM.\ncomponent: LeakInspectorDocumentation\ntags: [diagnostics, leaks, cleanup, lifecycle, devtools]\n---\n\n# Leak Inspector\n\n## Overview\nThe most common Slice leak is silent: a component builds children with `slice.build(...)`\nand later clears them with `innerHTML = ''`, `replaceChildren`, or `remove()` **without**\n`destroyComponent`. The DOM is gone, but the instances stay registered in\n`slice.controller.activeComponents` forever — and their `beforeDestroy()` never runs, so\ntheir listeners, timers, and observers leak too.\n\nThe framework can't see this for you at build time, so the **Leak Inspector** is a dev-only\npanel that watches `activeComponents` and flags the orphans: components that are **registered\nbut detached from the live DOM and not intentionally cached**.\n\n## Enable\nThe Leak Inspector lives under the `debugger` config and is **always off in production**,\nregardless of this flag:\n\n```json title=\"sliceConfig.json\"\n{\n  \"debugger\": {\n    \"enabled\": false,\n    \"click\": \"right\",\n    \"leakInspector\": { \"enabled\": true, \"shortcut\": \"alt+shift+k\" }\n  }\n}\n```\n\nOpen it with the shortcut (`alt+shift+k` by default). The panel computes only while open —\nzero overhead otherwise.\n\n## What it flags (and what it ignores)\nA component is a **candidate leak** when all of the following hold:\n\n- it is registered in `slice.controller.activeComponents`, and\n- it is an `HTMLElement` **detached** from the live DOM (`isConnected === false`), and\n- it is **not intentionally cached**.\n\nThe criteria are deliberately conservative so caching patterns are **not** false-flagged:\n\n| Excluded | Why |\n| --- | --- |\n| `Route` / `MultiRoute` cached views | Marked `__sliceCached` while parked off-DOM between navigations |\n| Router-managed instances (`route-*` ids) | Reused across navigation by the Router |\n| Descendants of a detached cached/orphan root | Only the root is reported, not every child |\n\nThe panel also tracks `activeComponents.size` over time and shows a **trend** marker — a\ncount that only ever grows across navigations is the signal of an accumulation leak even when\nindividual orphans look ambiguous.\n\n## The panel\n- **orphans** — each candidate with its component name, `sliceId`, why it was flagged, and the\n  `parentComponent` retain chain. A per-row **destroy** action calls `destroyComponent` so you\n  can confirm a suspect frees cleanly.\n- **active** — current `activeComponents.size`.\n- **trend** — `stable` or `growing ▲`.\n\n## Programmatic API\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `findOrphans` | `()` | Returns the current candidate leaks (read-only) |\n| `registerLeakExclusion` | `(predicate)` | Mark your own cached-but-detached instances as intentional |\n\n```javascript title=\"Exclude an app-specific cache from leak detection\"\n// Your own pool/cache keeps instances off-DOM on purpose.\nslice.controller.registerLeakExclusion((component) => myPool.has(component.sliceId));\n```\n\n## Fixing a leak\nWhen the inspector flags a component, the fix is almost always to destroy before you detach:\n\n```javascript title=\"Destroy slice.build'd children before clearing\"\nasync update() {\n  /* ❌ leaks: instances stay in activeComponents, beforeDestroy never runs */\n  this.$list.innerHTML = '';\n\n  /* ✅ destroy first, then the DOM is safe to clear */\n  slice.controller.destroyByContainer(this.$list);\n  this.$list.replaceChildren();\n\n  for (const order of this.orders) {\n    this.$list.appendChild(await slice.build('OrderRow', { order }));\n  }\n}\n```\n\nAnd release anything that outlives the subtree in `beforeDestroy()`:\n\n```javascript title=\"Free globals/timers/observers on destroy\"\nbeforeDestroy() {\n  window.removeEventListener('resize', this._onResize);\n  clearInterval(this._timer);\n  this._observer.disconnect();\n}\n```\n\nSee [beforeDestroy()](/Documentation/LifeCycle-Methods/beforeDestroy) for the full cleanup\ncontract, and [DevTools](/Documentation/DevTools) for the other runtime panels.\n\n## Best Practices\n:::tip\nKeep the Leak Inspector enabled in development and exercise your navigation/list flows with it\nopen — accumulation leaks show up as a `growing ▲` trend across route changes.\n:::\n\n:::tip\nFor your own off-DOM caches, register a `registerLeakExclusion` predicate (or set\n`component.__sliceCached = true`) so the inspector doesn't flag intentional retention.\n:::\n\n## Gotchas\n:::warning\nThe Leak Inspector diagnoses; it does not fix. A per-row destroy is a manual probe — the real\nfix is calling `destroyComponent` / `destroyByContainer` before clearing the DOM.\n:::\n\n:::warning\nIt is dev-only. Don't rely on it in production; rely on correct cleanup. The panel never\ninitializes when the app runs in production mode.\n:::\n\n## FAQ\n:::details title=\"Why is my cached Route view not flagged?\"\n`Route` and `MultiRoute` mark their cached instances `__sliceCached` while they sit off-DOM\nbetween navigations, so the inspector treats them as intentional, not leaks.\n:::\n\n:::details title=\"It flagged a component I destroy later — is that a real leak?\"\nIf it is detached now and still registered, yes — it is leaking until you destroy it. Destroy at\nthe moment you remove it from the DOM, not \"later\".\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Tooling"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Excluded","Why"],
               rows: [[{"html":"<code>Route</code> / <code>MultiRoute</code> cached views"},{"html":"Marked <code>__sliceCached</code> while parked off-DOM between navigations"}],[{"html":"Router-managed instances (<code>route-*</code> ids)"},{"html":"Reused across navigation by the Router"}],[{"html":"Descendants of a detached cached/orphan root"},{"html":"Only the root is reported, not every child"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Notes"],
               rows: [[{"html":"<code>findOrphans</code>"},{"html":"<code>()</code>"},{"html":"Returns the current candidate leaks (read-only)"}],[{"html":"<code>registerLeakExclusion</code>"},{"html":"<code>(predicate)</code>"},{"html":"Mark your own cached-but-detached instances as intentional"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Keep the Leak Inspector enabled in development and exercise your navigation/list flows with it open — accumulation leaks show up as a <code>growing ▲</code> trend across route changes.</p>";
            const callout = await slice.build('Callout', {
               tone: "success",
               variant: "soft",
               title: "Tip",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>For your own off-DOM caches, register a <code>registerLeakExclusion</code> predicate (or set <code>component.__sliceCached = true</code>) so the inspector doesn't flag intentional retention.</p>";
            const callout = await slice.build('Callout', {
               tone: "success",
               variant: "soft",
               title: "Tip",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>The Leak Inspector diagnoses; it does not fix. A per-row destroy is a manual probe — the real fix is calling <code>destroyComponent</code> / <code>destroyByContainer</code> before clearing the DOM.</p>";
            const callout = await slice.build('Callout', {
               tone: "warning",
               variant: "soft",
               title: "Warning",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>It is dev-only. Don't rely on it in production; rely on correct cleanup. The panel never initializes when the app runs in production mode.</p>";
            const callout = await slice.build('Callout', {
               tone: "warning",
               variant: "soft",
               title: "Warning",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const details = await slice.build('Details', { title: "Why is my cached Route view not flagged?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p><code>Route</code> and <code>MultiRoute</code> mark their cached instances <code>__sliceCached</code> while they sit off-DOM between navigations, so the inspector treats them as intentional, not leaks.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const details = await slice.build('Details', { title: "It flagged a component I destroy later — is that a real leak?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>If it is detached now and still registered, yes — it is leaking until you destroy it. Destroy at the moment you remove it from the DOM, not \"later\".</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    if (this._contentClick) {
      this.removeEventListener('click', this._contentClick);
      this._contentClick = null;
    }
  }

  // Internal markdown links are plain anchors with data-route. One delegated
  // handler keeps them inside the SPA, including "/page#section" links, without
  // building a component for every link on the page.
  setupRouterLinks() {
    this._contentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest?.('a[data-route]');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('#')) {
        event.preventDefault();
        this.scrollToHash(href.slice(1));
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//')) return;

      event.preventDefault();
      const hashIndex = href.indexOf('#');
      const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? '' : href.slice(hashIndex + 1);
      Promise.resolve(slice.router.navigate(path)).then(() => {
        if (hash) requestAnimationFrame(() => this.scrollToHash(hash));
      });
    };
    this.addEventListener('click', this._contentClick);
  }

  scrollToHash(hash) {
    let id = hash;
    try {
      id = decodeURIComponent(hash);
    } catch {
      id = hash;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
