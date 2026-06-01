export default class DevelopmentWorkflow extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/development-workflow.md";
    this.markdownContent = "---\ntitle: The Development Loop\nroute: /Documentation/Development-Workflow\nnavLabel: The Development Loop\nsection: Getting Started\ngroup: First Steps\norder: 13\ndescription: The dev to build to start cycle and where your components live.\ncomponent: DevelopmentWorkflow\ntags: [getting-started, cli, workflow]\n---\n\n# The Development Loop\n\n## Overview\nDay-to-day Slice development is a short loop: run the dev server, create and edit components,\nregister them, and iterate. When you are ready, build for production and serve the output.\n\n## The three commands\n| Command | What it does | Serves from |\n| --- | --- | --- |\n| `npm run dev` | Dev server with hot reload. Edits to `.js` / `.html` / `.css` reload the page. | `/src` |\n| `npm run build` | Generates an optimized, bundled production build. | writes `/dist` |\n| `npm run start` | Serves the production build (run `build` first). | `/dist` |\n\n```bash title=\"Typical session\"\nnpm run dev      # work here all day at http://localhost:3001\n# ...edit components...\nnpm run build    # when ready to ship\nnpm run start    # verify the production build locally\n```\n\nThe dev port comes from `sliceConfig.json` (`server.port`, default `3001`) and falls back to the\nnext free port if it is taken.\n\n## Where your code lives\n| You want to… | Put it in |\n| --- | --- |\n| Add an app screen or section | `src/Components/AppComponents/<Name>/` |\n| Reuse a UI element across screens | a Visual component (`slice get <Name>` or create one) |\n| Hold logic/data with no UI (API client, storage) | `src/Components/Service/<Name>/` |\n| Change navigation | `src/routes.js` (and the shell's `MultiRoute`) |\n| Toggle managers, theme, port | `src/sliceConfig.json` |\n\n## Creating and registering components\n```bash title=\"Scaffold a component\"\n# Non-interactive: pass the name and category (writes files + updates components.js)\nslice component create UserCard --category AppComponents\n\n# Interactive: prompts for whatever you omit\nslice component create\n```\n\nComponents must be listed in `src/Components/components.js` (name → category) to be loadable.\n`component:create` updates it for you. If you ever add or move component folders by hand, resync:\n\n```bash title=\"Regenerate the registry\"\nslice component list\n```\n\n:::warning\nA common cause of \"component not found\" / a `null` from `slice.build()` is a component missing\nfrom `components.js`. Run `slice component list` to fix it.\n:::\n\n## Adding registry components\n```bash title=\"Browse and install\"\nslice browse                 # list official components\nslice get Card Input Select  # install the ones you need into src/Components/Visual/\nslice get FetchManager --service   # install a registry Service\n```\n\nThe starter ships only a small set of Visual components. Install the rest on demand so your\nproject stays lean.\n\n## Diagnostics while developing\n- Enable the debug panels in `sliceConfig.json` and toggle them at runtime: `alt+shift+e`\n  (events) and `alt+shift+c` (context).\n- Right-click a component (when `debugger.enabled`) to inspect and live-edit its props.\n- Use `slice doctor` when the project structure or config seems off.\n- Prefer `slice.logger.logInfo / logWarning / logError` over `console.log` — it respects the\n  configured levels and stays quiet in production.\n\n## Production build, briefly\n`npm run build` analyzes what your routes use, bundles and minifies into `/dist`, and copies your\n`publicFolders`. `npm run start` then serves `/dist`. Production mode disables dev-only features\n(prop validation, debug panels) for performance.\n\n:::tip\nAdd a folder you import from (for example `/libs`) to `publicFolders` in `sliceConfig.json`, or it\nwill work in dev but break in the production build.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Command | What it does | Serves from |","| --- | --- | --- |","| `npm run dev` | Dev server with hot reload. Edits to `.js` / `.html` / `.css` reload the page. | `/src` |","| `npm run build` | Generates an optimized, bundled production build. | writes `/dist` |","| `npm run start` | Serves the production build (run `build` first). | `/dist` |"];
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
               value: "npm run dev      # work here all day at http://localhost:3001\n# ...edit components...\nnpm run build    # when ready to ship\nnpm run start    # verify the production build locally",
               language: "bash"
            });
            if ("Typical session") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Typical session";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const lines = ["| You want to… | Put it in |","| --- | --- |","| Add an app screen or section | `src/Components/AppComponents/<Name>/` |","| Reuse a UI element across screens | a Visual component (`slice get <Name>` or create one) |","| Hold logic/data with no UI (API client, storage) | `src/Components/Service/<Name>/` |","| Change navigation | `src/routes.js` (and the shell's `MultiRoute`) |","| Toggle managers, theme, port | `src/sliceConfig.json` |"];
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
               value: "# Non-interactive: pass the name and category (writes files + updates components.js)\nslice component create UserCard --category AppComponents\n\n# Interactive: prompts for whatever you omit\nslice component create",
               language: "bash"
            });
            if ("Scaffold a component") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Scaffold a component";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice component list",
               language: "bash"
            });
            if ("Regenerate the registry") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Regenerate the registry";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice browse                 # list official components\nslice get Card Input Select  # install the ones you need into src/Components/Visual/\nslice get FetchManager --service   # install a registry Service",
               language: "bash"
            });
            if ("Browse and install") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Browse and install";
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

customElements.define('slice-developmentworkflow', DevelopmentWorkflow);
