export default class StructuralDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/structural-components.md";
    this.markdownContent = "---\ntitle: Structural\nroute: /Documentation/Structural\nnavLabel: Structural\nsection: Components\ngroup: Component Model\norder: 60\ndescription: Structural components that power Slice.js.\ncomponent: StructuralDocumentation\ntags: [structural, controller, router, styles]\n---\n\n# Structural Components\n\n## Overview\nStructural components power the framework runtime. They are created by Slice.js and exposed\nunder `slice.*`. You do not build them directly.\n\n## Key Components\n- `slice.controller` for component lifecycle and lookup\n- `slice.router` for navigation and route rendering\n- `slice.translator` for translations, locale and formatting (optional to enable)\n- `slice.stylesManager` for styles and themes\n- `slice.events` for pub/sub (optional)\n- `slice.context` for shared state (optional)\n\n## Which one?\n| Need | Use | One-liner |\n| --- | --- | --- |\n| Build / look up / destroy components | `slice.controller` | Lifecycle and the component registry. |\n| Navigate, guards, route params | `slice.router` | Client-side routing. |\n| Translate text and format dates/numbers | `slice.translator` | `slice.t()`, `data-t`, `t.ref()` props. |\n| Shared state many components read | `slice.context` | Holds state; watchers + selectors. |\n| Announce \"something happened\" | `slice.events` | Fire-and-forget pub/sub. |\n| Themes and styles | `slice.stylesManager` | `slice.setTheme(name)`. |\n\nFor state vs signals see [Context vs Events](/Documentation/Structural/Context-vs-Events); for full\nsignatures, the [API Reference](/Documentation/API-Reference).\n\n## Controller API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `getComponent` | `(sliceId)` | instance or undefined | Lookup by sliceId. |\n| `destroyByContainer` | `(container)` | `number` | Destroys Slice components inside container. |\n| `destroyByPattern` | `(pattern)` | `number` | Destroys components whose sliceId matches pattern. |\n\n```javascript title=\"Destroy components safely\"\nconst container = this.querySelector('.items');\nslice.controller.destroyByContainer(container);\ncontainer.innerHTML = '';\n```\n\n## Router API\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `path` | `string` (getter) | The app path, without locale or query: `/pricing`. |\n| `href` | `(path, { locale }?) → string` | The URL for an `<a>`, with the locale when `localePrefix` is on. |\n| `navigate` | `(path, options?)` | Programmatic navigation. `{ replace: true }` replaces history; `{ locale: 'en' }` switches language. |\n| `beforeEach` | `(to, from, next)` | Register a guard before navigation. |\n| `afterEach` | `(to, from)` | Run logic after navigation. |\n| `start` | `()` | Start routing immediately. |\n\n## Styles and Themes\n`slice.setTheme(themeName)` applies a theme through the StylesManager.\n\n```javascript title=\"Switch themes\"\nawait slice.setTheme('Dark');\n```\n\n## EventManager & ContextManager (Optional)\n- **`slice.events`** — pub/sub (`subscribe` / `emit` / `bind`). Full guide:\n  [EventManager](/Documentation/Structural/EventManager).\n- **`slice.context`** — shared state (`create` / `setState` / `watch`, with selectors and optional\n  persistence). Full guide: [ContextManager](/Documentation/Structural/ContextManager).\n\nWhen to use which: [Context vs Events](/Documentation/Structural/Context-vs-Events). All signatures:\n[API Reference](/Documentation/API-Reference).\n\nThe Events debug panel (`alt+shift+e`) shows live subscribers + an emit history; the Context panel\nshows live state. See [DevTools](/Documentation/DevTools).\n\n## Best Practices\n:::tip\nUse `destroyByContainer` before recreating dynamic lists to avoid leaks.\n:::\n\n:::tip\nRegister guards before calling `slice.router.start()`.\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Components"},{"text":"Component Model"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Need","Use","One-liner"],
               rows: [[{"html":"Build / look up / destroy components"},{"html":"<code>slice.controller</code>"},{"html":"Lifecycle and the component registry."}],[{"html":"Navigate, guards, route params"},{"html":"<code>slice.router</code>"},{"html":"Client-side routing."}],[{"html":"Translate text and format dates/numbers"},{"html":"<code>slice.translator</code>"},{"html":"<code>slice.t()</code>, <code>data-t</code>, <code>t.ref()</code> props."}],[{"html":"Shared state many components read"},{"html":"<code>slice.context</code>"},{"html":"Holds state; watchers + selectors."}],[{"html":"Announce \"something happened\""},{"html":"<code>slice.events</code>"},{"html":"Fire-and-forget pub/sub."}],[{"html":"Themes and styles"},{"html":"<code>slice.stylesManager</code>"},{"html":"<code>slice.setTheme(name)</code>."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Returns","Notes"],
               rows: [[{"html":"<code>getComponent</code>"},{"html":"<code>(sliceId)</code>"},{"html":"instance or undefined"},{"html":"Lookup by sliceId."}],[{"html":"<code>destroyByContainer</code>"},{"html":"<code>(container)</code>"},{"html":"<code>number</code>"},{"html":"Destroys Slice components inside container."}],[{"html":"<code>destroyByPattern</code>"},{"html":"<code>(pattern)</code>"},{"html":"<code>number</code>"},{"html":"Destroys components whose sliceId matches pattern."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const container = this.querySelector('.items');\nslice.controller.destroyByContainer(container);\ncontainer.innerHTML = '';",
               language: "javascript"
            });
            if ("Destroy components safely") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Destroy components safely";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Notes"],
               rows: [[{"html":"<code>path</code>"},{"html":"<code>string</code> (getter)"},{"html":"The app path, without locale or query: <code>/pricing</code>."}],[{"html":"<code>href</code>"},{"html":"<code>(path, { locale }?) → string</code>"},{"html":"The URL for an <code>&lt;a&gt;</code>, with the locale when <code>localePrefix</code> is on."}],[{"html":"<code>navigate</code>"},{"html":"<code>(path, options?)</code>"},{"html":"Programmatic navigation. <code>{ replace: true }</code> replaces history; <code>{ locale: 'en' }</code> switches language."}],[{"html":"<code>beforeEach</code>"},{"html":"<code>(to, from, next)</code>"},{"html":"Register a guard before navigation."}],[{"html":"<code>afterEach</code>"},{"html":"<code>(to, from)</code>"},{"html":"Run logic after navigation."}],[{"html":"<code>start</code>"},{"html":"<code>()</code>"},{"html":"Start routing immediately."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "await slice.setTheme('Dark');",
               language: "javascript"
            });
            if ("Switch themes") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Switch themes";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Use <code>destroyByContainer</code> before recreating dynamic lists to avoid leaks.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Register guards before calling <code>slice.router.start()</code>.</p>";
            const callout = await slice.build('Callout', {
               tone: "success",
               variant: "soft",
               title: "Tip",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
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

customElements.define('slice-structuraldocumentation', StructuralDocumentation);
