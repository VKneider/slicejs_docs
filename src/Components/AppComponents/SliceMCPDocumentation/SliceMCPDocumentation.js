export default class SliceMCPDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "slicejs-mcp.md";
    this.markdownContent = "---\ntitle: Slice.js MCP\nroute: /Documentation/Slice-MCP\nnavLabel: MCP\nsection: Tooling\ngroup: ''\norder: 70\ndescription: Model Context Protocol server for querying the framework and Components documentation from an AI assistant.\ncomponent: SliceMCPDocumentation\ntags: [mcp, documentation, ai, tools]\n---\n\n# Slice.js MCP\n\n## Overview\nSlice.js provides an MCP (Model Context Protocol) server that lets AI assistants and development\ntools query the framework and Components documentation. It runs as a stdio service, so the client\nlaunches it on demand and speaks MCP over stdin/stdout.\n\n## Installation\n\n### Using npx (no install)\n```bash\nnpx slicejs-mcp\n```\n\n### Global install\n```bash\nnpm install -g slicejs-mcp\nslicejs-mcp\n```\n\n### Local development\n```bash\ngit clone https://github.com/VKneider/slicejs-mcp.git\ncd slicejs-mcp\nnpm install\nnpm run build\nnode dist/index.js\n```\n\n:::details title=\"Client configuration (Claude Desktop, Cursor)\"\nAdd the server to the client's MCP settings. The command/args are the same for any stdio-capable\nclient; VS Code uses its own MCP settings file.\n\n```json\n{\n  \"mcpServers\": {\n    \"slicejs\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"slicejs-mcp\"]\n    }\n  }\n}\n```\n:::\n\n## Tool Summary\n| Tool | Purpose |\n| --- | --- |\n| `list_docs` | Returns available documentation sections/categories. |\n| `search_docs` | Searches across all documentation using keywords or phrases. |\n| `get_doc_content` | Fetches the full content of specific documentation page(s). |\n| `get_llm_full_context` | Fetches the complete documentation bundle. Expensive; use deliberately. |\n| `slice_framework_*` | Namespace-aware access to framework documentation. |\n| `slice_components_*` | Namespace-aware access to Slice.js Components documentation. |\n\nThe MCP exposes two catalogs:\n\n- `framework` — `slicejs_docs`, covering the framework, CLI, lifecycle, routing, and architecture.\n- `components` — Slice.js Components, covering Visual and Service APIs and examples.\n\nThe Components catalog is backed by the published Markdown manifest from the\n`slicejs-components` repository. The public product name is **Slice.js Components**.\n\n## list_docs\nReturns a list of all available documentation sections and categories.\n\n**Parameters:** none.\n\n## search_docs\nSearches across all documentation using keywords or phrases.\n\n| Parameter | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `query` | string | required | Search term |\n| `max_results` | number | 5 | Maximum number of results |\n\n## get_doc_content\nFetches the full content of specific documentation page(s).\n\n| Parameter | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `doc_id` | string or string[] | required | Documentation ID(s) to fetch |\n| `include_metadata` | boolean | false | Include additional metadata |\n\n## get_llm_full_context\nFetches the complete documentation bundle for comprehensive LLM context.\n\n**Parameters:** none.\n\nUse it sparingly: it is large, expensive in tokens, and usually unnecessary when `search_docs` +\n`get_doc_content` can answer the question.\n\n## Namespace-aware catalog tools\n\nFramework:\n\n```text\nslice_framework_list_docs()\nslice_framework_search_docs(query)\nslice_framework_get_doc(doc_id)\n```\n\nComponents:\n\n```text\nslice_components_list_docs()\nslice_components_search_docs(query)\nslice_components_get_doc(doc_id)\n```\n\n`slice_components_get_doc` returns the authored Markdown and metadata such as the component,\ncatalog version, source path, and revision. The MCP does not execute `:::script` examples.\n\n## Architecture\n\n- **Framework source**: documentation fetched from https://github.com/VKneider/slicejs_docs\n- **Components source**: Markdown and manifest fetched from https://github.com/VKneider/slicejs-components\n- **Caching**: session cache to minimize API requests and improve performance\n- **Initialization**: lazy loading of the document structure on first tool use\n- **Rate limiting**: designed to stay within GitHub API limits (60 req/hour)\n\n## Guidelines\n\n| Do | Why |\n| --- | --- |\n| `list_docs` first, then `search_docs` | Chasing a doc id blind costs more calls than listing the catalog. |\n| Use `get_doc_content` for the page you need | Fetching the whole corpus is slower and more expensive. |\n| Use `get_llm_full_context` only for broad tasks | It is a large bundle; targeted reads answer most questions. |\n| Reuse the session cache | Repeated queries in one session are cheap. |\n\n:::warning\nThe server fetches documentation from GitHub on demand. It needs network access, and large requests\n(especially `get_llm_full_context`) can consume significant tokens in an AI context.\n:::\n\n:::related\n- [Documentation & AGENTS.md](/Documentation/Documentation-System) - The source the MCP indexes.\n- [CLI Commands](/Documentation/CLI) - `slice docs search` / `slice docs get` as the local fallback.\n- [API Reference](/Documentation/API-Reference) - The framework surface at a glance.\n- [Components documentation](https://components.slicejs.com) - The external Components catalog.\n:::\n";
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
               value: "npx slicejs-mcp",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm install -g slicejs-mcp\nslicejs-mcp",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "git clone https://github.com/VKneider/slicejs-mcp.git\ncd slicejs-mcp\nnpm install\nnpm run build\nnode dist/index.js",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const details = await slice.build('Details', { title: "Client configuration (Claude Desktop, Cursor)" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>Add the server to the client's MCP settings. The command/args are the same for any stdio-capable client; VS Code uses its own MCP settings file.</p><p>``<code>json { \"mcpServers\": { \"slicejs\": { \"command\": \"npx\", \"args\": [\"-y\", \"slicejs-mcp\"] } } } </code>``</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Tool","Purpose"],
               rows: [[{"html":"<code>list_docs</code>"},{"html":"Returns available documentation sections/categories."}],[{"html":"<code>search_docs</code>"},{"html":"Searches across all documentation using keywords or phrases."}],[{"html":"<code>get_doc_content</code>"},{"html":"Fetches the full content of specific documentation page(s)."}],[{"html":"<code>get_llm_full_context</code>"},{"html":"Fetches the complete documentation bundle. Expensive; use deliberately."}],[{"html":"<code>slice_framework_*</code>"},{"html":"Namespace-aware access to framework documentation."}],[{"html":"<code>slice_components_*</code>"},{"html":"Namespace-aware access to Slice.js Components documentation."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Parameter","Type","Default","Notes"],
               rows: [[{"html":"<code>query</code>"},{"html":"string"},{"html":"required"},{"html":"Search term"}],[{"html":"<code>max_results</code>"},{"html":"number"},{"html":"5"},{"html":"Maximum number of results"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Parameter","Type","Default","Notes"],
               rows: [[{"html":"<code>doc_id</code>"},{"html":"string or string[]"},{"html":"required"},{"html":"Documentation ID(s) to fetch"}],[{"html":"<code>include_metadata</code>"},{"html":"boolean"},{"html":"false"},{"html":"Include additional metadata"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice_framework_list_docs()\nslice_framework_search_docs(query)\nslice_framework_get_doc(doc_id)",
               language: "text"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice_components_list_docs()\nslice_components_search_docs(query)\nslice_components_get_doc(doc_id)",
               language: "text"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Do","Why"],
               rows: [[{"html":"<code>list_docs</code> first, then <code>search_docs</code>"},{"html":"Chasing a doc id blind costs more calls than listing the catalog."}],[{"html":"Use <code>get_doc_content</code> for the page you need"},{"html":"Fetching the whole corpus is slower and more expensive."}],[{"html":"Use <code>get_llm_full_context</code> only for broad tasks"},{"html":"It is a large bundle; targeted reads answer most questions."}],[{"html":"Reuse the session cache"},{"html":"Repeated queries in one session are cheap."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>The server fetches documentation from GitHub on demand. It needs network access, and large requests (especially <code>get_llm_full_context</code>) can consume significant tokens in an AI context.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const items = [{"title":"Documentation & AGENTS.md","path":"/Documentation/Documentation-System","text":"The source the MCP indexes."},{"title":"CLI Commands","path":"/Documentation/CLI","text":"slice docs search / slice docs get as the local fallback."},{"title":"API Reference","path":"/Documentation/API-Reference","text":"The framework surface at a glance."},{"title":"Components documentation","path":"https://components.slicejs.com","text":"The external Components catalog."}];
            const grid = await slice.build('Grid', {
               columns: items.length === 4 ? 2 : Math.min(3, Math.max(1, items.length)),
               rows: 1,
               gap: '14px'
            });
            for (const item of items) {
               const card = await slice.build('Card', {
                  title: item.title,
                  text: item.text || '',
                  // The small mark beside the title, not the banner: a page
                  // of four related links should not be four big arrows.
                  headerIcon: 'arrow-right',
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

customElements.define('slice-slicemcpdocumentation', SliceMCPDocumentation);
