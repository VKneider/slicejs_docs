export default class TheBuildMethod extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/build-method.md";
    this.markdownContent = "---\ntitle: The build method\nroute: /Documentation/The-build-method\nnavLabel: The build method\nsection: Components\ngroup: Component Model\norder: 20\ndescription: Use slice.build to create components.\ncomponent: TheBuildMethod\ntags: [build, components]\n---\n\n# The build method\n\n## Overview\n`slice.build(componentName, props)` creates a component instance, applies Static Props, runs\n`init()`, and registers the component with the controller. It returns a ready-to-append component\ninstance.\n\nThis is the standard way to create Visual, App, and Service components in Slice.js.\n\n## API\n| Parameter | Type | Required | Notes |\n| --- | --- | --- | --- |\n| `componentName` | `string` | yes | Must exist in `components.js`. |\n| `props` | `object` | no | Public props for the component. |\n\n| Returns | Type | Notes |\n| --- | --- | --- |\n| component instance | `HTMLElement`, `Object`, or `null` | A Visual returns the element, a Service its instance; `null` on error. |\n\n## Lifecycle Steps\n1. Validate component name.\n2. Load template, class, and CSS (visual components only).\n3. Instantiate component and apply props.\n4. Call `init()` if present.\n5. Register component in the controller and component tree.\n\n## Basic Usage\n```javascript title=\"Basic build\"\nconst myButton = await slice.build('Button', {\n  value: 'Click me'\n});\n\ndocument.querySelector('#container').appendChild(myButton);\n```\n\n## Props and Defaults\n```javascript title=\"Props are applied immediately\"\nconst card = await slice.build('Card', {\n  title: 'My Card',\n  text: 'Card content',\n  icon: { name: 'star', iconStyle: 'filled' }\n});\n\n// Card now has this.title, this.text, this.icon\n```\n\n## Reserved build keys: id, sliceId, singleton\n`id`, `sliceId`, and `singleton` are **build directives**, not component props. They are read by\n`build` to control how the instance is created/registered and are removed from the props object\nbefore Static Props are applied — so they never reach your setters.\n\n```javascript title=\"Use sliceId for lookup\"\nconst navbar = await slice.build('Navbar', {\n  sliceId: 'main-navbar',\n  logo: { src: '/logo.png', path: '/' },\n  items: [{ text: 'Home', path: '/' }]\n});\n\nconst sameNavbar = slice.controller.getComponent('main-navbar');\n```\n\n- `id` — sets the host element's HTML `id` (Visual components only).\n- `sliceId` — the registry key used by `getComponent` and as the singleton identity.\n- `singleton` — `true` get-or-creates one shared instance (Service components only). See\n  [Services](/Documentation/Service).\n\n:::warning\n`id`, `sliceId`, and `singleton` are **reserved names**. Do not declare them in `static props` and\ndo not use them as real props — they will be consumed by `build` and never set on your component.\nA `static props` entry named `singleton`, `sliceId`, or `id` is effectively dead.\n:::\n\n## Nested Components\n```javascript title=\"Build children and compose\"\nconst grid = await slice.build('Grid', { columns: 3, rows: 1 });\nconst card1 = await slice.build('Card', { title: 'Card 1' });\nconst card2 = await slice.build('Card', { title: 'Card 2' });\nconst card3 = await slice.build('Card', { title: 'Card 3' });\n\nawait grid.setItem(card1);\nawait grid.setItem(card2);\nawait grid.setItem(card3);\n\nthis.appendChild(grid);\n```\n\n## Error Cases\n- Missing or non-string component name\n- Component not listed in `components.js`\n- Structural components cannot be built\n\n## Build vs refresh\n\n:::compare left=\"Build once\" right=\"Refresh in place\"\n`await slice.build()` applies defaults, runs `init()`, registers the instance and returns it. Use it when the component does not exist yet.\n---\nAssign a prop, call a method, `slice.setComponentProps` or `update()`. Defaults are not re-applied and omitted props are kept. Use it when the instance already exists.\n:::\n\nBoth paths preserve what matters: build creates identity, refresh keeps state, focus and children.\nFor a variable-length list, [`DomService.reconcile`](https://components.slicejs.com/docs/services/dom-service)\ndecides per item which of the two to do.\n\n:::details title=\"What can go wrong\"\n- A missing entry in `components.js` (or a wrong `paths.components` path/type) makes `build` resolve\n  to `null` instead of throwing. Guard the result.\n- Structural components (Router, EventManager, ContextManager, Logger, Debugger) are created by the\n  framework; you cannot `slice.build` them.\n- Without `await`, you get a Promise instead of a node, and `init()` has not run yet.\n:::\n\n:::related\n- [Component Anatomy](/Documentation/Component-Anatomy) - How the three files fit together.\n- [Static Props](/Documentation/Static-Props) - Typed props, defaults and validation.\n- [LifeCycle Methods](/Documentation/LifeCycle-Methods) - What runs after `slice.build()`.\n- [Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data) - Setter, update, reconcile or rebuild.\n:::\n";
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
               headers: ["Parameter","Type","Required","Notes"],
               rows: [[{"html":"<code>componentName</code>"},{"html":"<code>string</code>"},{"html":"yes"},{"html":"Must exist in <code>components.js</code>."}],[{"html":"<code>props</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Public props for the component."}]]
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
               headers: ["Returns","Type","Notes"],
               rows: [[{"html":"component instance"},{"html":"<code>HTMLElement</code>, <code>Object</code>, or <code>null</code>"},{"html":"A Visual returns the element, a Service its instance; <code>null</code> on error."}]]
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
               value: "const myButton = await slice.build('Button', {\n  value: 'Click me'\n});\n\ndocument.querySelector('#container').appendChild(myButton);",
               language: "javascript"
            });
            if ("Basic build") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Basic build";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const card = await slice.build('Card', {\n  title: 'My Card',\n  text: 'Card content',\n  icon: { name: 'star', iconStyle: 'filled' }\n});\n\n// Card now has this.title, this.text, this.icon",
               language: "javascript"
            });
            if ("Props are applied immediately") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Props are applied immediately";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const navbar = await slice.build('Navbar', {\n  sliceId: 'main-navbar',\n  logo: { src: '/logo.png', path: '/' },\n  items: [{ text: 'Home', path: '/' }]\n});\n\nconst sameNavbar = slice.controller.getComponent('main-navbar');",
               language: "javascript"
            });
            if ("Use sliceId for lookup") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Use sliceId for lookup";
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
            body.innerHTML = "<p><code>id</code>, <code>sliceId</code>, and <code>singleton</code> are <strong>reserved names</strong>. Do not declare them in <code>static props</code> and do not use them as real props — they will be consumed by <code>build</code> and never set on your component. A <code>static props</code> entry named <code>singleton</code>, <code>sliceId</code>, or <code>id</code> is effectively dead.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const grid = await slice.build('Grid', { columns: 3, rows: 1 });\nconst card1 = await slice.build('Card', { title: 'Card 1' });\nconst card2 = await slice.build('Card', { title: 'Card 2' });\nconst card3 = await slice.build('Card', { title: 'Card 3' });\n\nawait grid.setItem(card1);\nawait grid.setItem(card2);\nawait grid.setItem(card3);\n\nthis.appendChild(grid);",
               language: "javascript"
            });
            if ("Build children and compose") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Build children and compose";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
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
            const left = await buildSide({"title":"Build once","tone":"success","html":"<p><code>await slice.build()</code> applies defaults, runs <code>init()</code>, registers the instance and returns it. Use it when the component does not exist yet.</p>"});
            const right = await buildSide({"title":"Refresh in place","tone":"danger","html":"<p>Assign a prop, call a method, <code>slice.setComponentProps</code> or <code>update()</code>. Defaults are not re-applied and omitted props are kept. Use it when the instance already exists.</p>"});
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const details = await slice.build('Details', { title: "What can go wrong" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<ul><li>A missing entry in <code>components.js</code> (or a wrong <code>paths.components</code> path/type) makes <code>build</code> resolve</li></ul><p>to <code>null</code> instead of throwing. Guard the result.</p><ul><li>Structural components (Router, EventManager, ContextManager, Logger, Debugger) are created by the</li></ul><p>framework; you cannot <code>slice.build</code> them.</p><ul><li>Without <code>await</code>, you get a Promise instead of a node, and <code>init()</code> has not run yet.</li></ul>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const items = [{"title":"Component Anatomy","path":"/Documentation/Component-Anatomy","text":"How the three files fit together."},{"title":"Static Props","path":"/Documentation/Static-Props","text":"Typed props, defaults and validation."},{"title":"LifeCycle Methods","path":"/Documentation/LifeCycle-Methods","text":"What runs after slice.build()."},{"title":"Refreshing Component Data","path":"/Documentation/Architecture/Refreshing-Component-Data","text":"Setter, update, reconcile or rebuild."}];
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

customElements.define('slice-thebuildmethod', TheBuildMethod);
