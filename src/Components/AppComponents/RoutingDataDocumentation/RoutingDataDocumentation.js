export default class RoutingDataDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/routing-data.md";
    this.markdownContent = "---\r\ntitle: Routing and Data Passing\r\nroute: /Documentation/Architecture/Routing-Data\r\nnavLabel: Routing and Data Passing\r\nsection: Project Architecture\r\ngroup: Styles and Patterns\r\norder: 4\r\ndescription: Understand current Slice routing behavior, slug support, query usage, and route-to-route data strategies.\r\ncomponent: RoutingDataDocumentation\r\ntags: [routing, params, query, context, events]\r\n---\r\n\r\n# Routing and Data Passing\r\n\r\nThis page documents current runtime behavior so architecture decisions match real Slice capabilities.\r\n\r\n## Router Behavior (Current)\r\n| Capability | Supported | Notes |\r\n| --- | --- | --- |\r\n| `pathname` route matching | Yes | Uses History API and `window.location.pathname` |\r\n| Dynamic params (`${param}`) | Yes | One segment per param |\r\n| Query parsing (`?a=1`) | Yes | Exposed in route info (`to.query`, `from.query`) |\r\n| Hash-based route matching (`#state`) | No | Hash is not used for route matching |\r\n| Arbitrary props in `navigate()` | No | No native payload channel in `navigate(path, options)` |\r\n\r\n## Dynamic Params (Slugs)\r\n```javascript title=\"routes.js\"\r\nconst routes = [\r\n  { path: '/post/${slug}', component: 'PostPage' },\r\n  { path: '/404', component: 'NotFound' }\r\n];\r\n```\r\n\r\nUse slugs when the URL should represent identity (post, product, user).\r\n\r\n## Query Params\r\n```javascript title=\"Read query in guard\"\r\nslice.router.beforeEach((to, from, next) => {\r\n  if (to.query.preview === 'true') {\r\n    // preview mode behavior\r\n  }\r\n  next();\r\n});\r\n```\r\n\r\n## Route-to-Route Data Strategies\r\n1. URL params for identity\r\n2. Query params for URL-visible flags\r\n3. `slice.context` for shared app state\r\n4. `slice.events` for event-driven coordination\r\n\r\n```javascript title=\"Shared state with ContextManager\"\r\nslice.context.create('session', { userId: null, role: 'guest' });\r\n\r\nslice.context.setState('session', { userId: 'u-42', role: 'member' });\r\n```\r\n\r\n```javascript title=\"Event-driven handoff\"\r\nslice.events.emit('checkout:started', { cartId: 'c-1001' });\r\n```\r\n\r\n## Important Constraint\r\n:::warning\r\nDo not assume `slice.router.navigate('/path', { data })` passes arbitrary props to destination components. Use context/events/URL state instead.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Capability | Supported | Notes |\r","| --- | --- | --- |\r","| `pathname` route matching | Yes | Uses History API and `window.location.pathname` |\r","| Dynamic params (`${param}`) | Yes | One segment per param |\r","| Query parsing (`?a=1`) | Yes | Exposed in route info (`to.query`, `from.query`) |\r","| Hash-based route matching (`#state`) | No | Hash is not used for route matching |\r","| Arbitrary props in `navigate()` | No | No native payload channel in `navigate(path, options)` |\r"];
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const routes = [\r\n  { path: '/post/${slug}', component: 'PostPage' },\r\n  { path: '/404', component: 'NotFound' }\r\n];\r",
               language: "javascript"
            });
            if ("routes.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "routes.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.router.beforeEach((to, from, next) => {\r\n  if (to.query.preview === 'true') {\r\n    // preview mode behavior\r\n  }\r\n  next();\r\n});\r",
               language: "javascript"
            });
            if ("Read query in guard") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Read query in guard";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.create('session', { userId: null, role: 'guest' });\r\n\r\nslice.context.setState('session', { userId: 'u-42', role: 'member' });\r",
               language: "javascript"
            });
            if ("Shared state with ContextManager") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Shared state with ContextManager";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.events.emit('checkout:started', { cartId: 'c-1001' });\r",
               language: "javascript"
            });
            if ("Event-driven handoff") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Event-driven handoff";
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

customElements.define('slice-routingdatadocumentation', RoutingDataDocumentation);
