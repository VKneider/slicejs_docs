export default class InitMethodDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/init-method.md";
    this.markdownContent = "---\ntitle: init()\nroute: /Documentation/LifeCycle-Methods/init\nnavLabel: init()\nsection: Components\ngroup: Lifecycle\norder: 20\ndescription: One-time async setup for Slice.js components.\ncomponent: InitMethodDocumentation\ntags: [lifecycle, init]\n---\n\n# init()\n\n## Overview\n`init()` runs once, right after the component is constructed. By this point the constructor has\nalready attached the template with `slice.attachTemplate(this)` and applied props, so the DOM is\nready. Use `init()` for one-time setup that should not repeat during updates.\n\n`slice.build()` awaits `init()` before returning the component instance, so `init()` is the place\nfor **async** work the constructor cannot do — fetching data and building children with\n`await slice.build(...)`. See [Component Anatomy](/Documentation/Component-Anatomy) for the\nconstructor and the two ways to cache DOM references.\n\n## API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `init` | `async init()` | `Promise<void>` | Called once per instance. |\n\n## Ideal use cases\n- Cache DOM references.\n- Attach event listeners for the component lifetime.\n- Fetch initial data.\n- Build static child components.\n\n## Example\n\n```javascript title=\"One-time setup in init()\"\nexport default class UserProfile extends HTMLElement {\n  async init() {\n    this.$userInfo = this.querySelector('.user-info');\n    this.$avatar = this.querySelector('.avatar');\n\n    this.userData = await this.fetchUserData(this.userId);\n\n    this.editButton = await slice.build('Button', {\n      sliceId: 'edit-profile-btn',\n      value: 'Edit Profile',\n      onClick: () => this.editProfile()\n    });\n\n    this.addEventListener('click', this.handleClick.bind(this));\n\n    this.updateUserUI();\n    this.appendChild(this.editButton);\n  }\n\n  updateUserUI() {\n    this.$userInfo.textContent = this.userData.name;\n    this.$avatar.src = this.userData.avatar;\n  }\n}\n```\n\n## Constructor vs init()\n\n:::compare left=\"Constructor — synchronous\" right=\"init() — async\"\nAttach the template, cache DOM refs, bind local listeners, then apply props with `setComponentProps` last. No `await` here.\n---\nFetch data, `await slice.build(...)` children, subscribe to events/context, and finish the first paint. The framework awaits it before `build()` resolves.\n:::\n\nThe constructor and `init()` are not interchangeable: the constructor cannot await, and `init()` is\nthe only place where `slice.build()` is already safe for async children.\n\n## Patterns\n\n```javascript title=\"Bind events with auto-cleanup\"\nexport default class Notifications extends HTMLElement {\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe('notify', (payload) => this.show(payload));\n  }\n}\n```\n\n:::details title=\"Static children vs dynamic lists\"\nBuild **static** children in `init()` — a toolbar, a header, a fixed card. A list whose data can\nchange belongs in `update()` (or in [DomService.reconcile](https://components.slicejs.com/docs/services/dom-service)),\nso it can refresh without rebuilding the whole component.\n:::\n\n:::related\n- [Component Anatomy](/Documentation/Component-Anatomy) - Constructor, template and refs.\n- [update()](/Documentation/LifeCycle-Methods/update) - Refreshing after `init()`.\n- [beforeDestroy()](/Documentation/LifeCycle-Methods/beforeDestroy) - What cleanup runs later.\n- [Service Patterns](/Documentation/Architecture/Service-Patterns) - Building Services from `init()`.\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Components"},{"text":"Lifecycle"}]
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
               headers: ["Method","Signature","Returns","Notes"],
               rows: [[{"html":"<code>init</code>"},{"html":"<code>async init()</code>"},{"html":"<code>Promise&lt;void&gt;</code>"},{"html":"Called once per instance."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class UserProfile extends HTMLElement {\n  async init() {\n    this.$userInfo = this.querySelector('.user-info');\n    this.$avatar = this.querySelector('.avatar');\n\n    this.userData = await this.fetchUserData(this.userId);\n\n    this.editButton = await slice.build('Button', {\n      sliceId: 'edit-profile-btn',\n      value: 'Edit Profile',\n      onClick: () => this.editProfile()\n    });\n\n    this.addEventListener('click', this.handleClick.bind(this));\n\n    this.updateUserUI();\n    this.appendChild(this.editButton);\n  }\n\n  updateUserUI() {\n    this.$userInfo.textContent = this.userData.name;\n    this.$avatar.src = this.userData.avatar;\n  }\n}",
               language: "javascript"
            });
            if ("One-time setup in init()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "One-time setup in init()";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const grid = await slice.build('Grid', { columns: 2, rows: 1, gap: '14px' });
            const buildSide = async (side) => {
               const body = document.createElement('div');
               body.className = 'doc-callout-body';
               body.innerHTML = side.html;
               const callout = await slice.build('Callout', {
                  tone: side.tone,
                  title: side.title,
                  content: Array.from(body.childNodes)
               });
               return callout || body;
            };
            const left = await buildSide({"title":"Constructor — synchronous","tone":"success","html":"<p>Attach the template, cache DOM refs, bind local listeners, then apply props with <code>setComponentProps</code> last. No <code>await</code> here.</p>"});
            const right = await buildSide({"title":"init() — async","tone":"danger","html":"<p>Fetch data, <code>await slice.build(...)</code> children, subscribe to events/context, and finish the first paint. The framework awaits it before <code>build()</code> resolves.</p>"});
            if (grid) {
               await grid.setItem(left);
               await grid.setItem(right);
               container.appendChild(grid);
            } else {
               container.appendChild(left);
               container.appendChild(right);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class Notifications extends HTMLElement {\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe('notify', (payload) => this.show(payload));\n  }\n}",
               language: "javascript"
            });
            if ("Bind events with auto-cleanup") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Bind events with auto-cleanup";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const details = await slice.build('Details', { title: "Static children vs dynamic lists" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>Build <strong>static</strong> children in <code>init()</code> — a toolbar, a header, a fixed card. A list whose data can change belongs in <code>update()</code> (or in <a href=\"https://components.slicejs.com/docs/services/dom-service\" target=\"_blank\" rel=\"noopener noreferrer\">DomService.reconcile</a>), so it can refresh without rebuilding the whole component.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const items = [{"title":"Component Anatomy","path":"/Documentation/Component-Anatomy","text":"Constructor, template and refs."},{"title":"update()","path":"/Documentation/LifeCycle-Methods/update","text":"Refreshing after init()."},{"title":"beforeDestroy()","path":"/Documentation/LifeCycle-Methods/beforeDestroy","text":"What cleanup runs later."},{"title":"Service Patterns","path":"/Documentation/Architecture/Service-Patterns","text":"Building Services from init()."}];
            const grid = await slice.build('Grid', {
               columns: items.length === 4 ? 2 : Math.min(3, Math.max(1, items.length)),
               rows: 1,
               gap: '14px'
            });
            for (const item of items) {
               const card = await slice.build('Card', {
                  title: item.title,
                  text: item.text || '',
                  icon: { name: 'arrow-right', iconStyle: 'outlined' },
                  interactive: true,
                  onClick: () => {
                     if (/^https?:/i.test(item.path)) {
                        window.open(item.path, '_blank', 'noopener,noreferrer');
                     } else {
                        slice.router.navigate(item.path);
                     }
                  }
               });
               if (card && grid) await grid.setItem(card);
            }
            if (grid) container.appendChild(grid);
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

customElements.define('slice-initmethoddocumentation', InitMethodDocumentation);
