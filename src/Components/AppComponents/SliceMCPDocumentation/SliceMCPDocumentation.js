export default class SliceMCPDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "slicejs-mcp.md";
    this.markdownContent = "---\ntitle: Slice.js MCP\nroute: /Documentation/Slice-MCP\nnavLabel: MCP\nsection: Getting Started\ngroup: Tools\norder: 21\ndescription: Model Context Protocol server for accessing Slice.js documentation via npx or local development.\ncomponent: SliceMCPDocumentation\ntags: [mcp, documentation, ai, tools]\n---\n\n# Slice.js MCP\n\n## Overview\nSlice.js provides an MCP (Model Context Protocol) server that allows AI assistants and development tools to access Slice.js documentation programmatically. This enables seamless integration with AI-powered coding assistants for real-time documentation queries during development.\n\n## Installation\n\n### Using npx (No Installation Required)\n```bash\nnpx @vkneider/slicejs-mcp\n```\n\n### Local Development\nClone the repository, install dependencies, build, and run locally:\n```bash\ngit clone https://github.com/VKneider/slicejs-mcp.git\ncd slicejs-mcp\nnpm install\nnpm run build\nnode dist/index.js\n```\n\n## Usage\nThe MCP server runs as a stdio-based service, perfect for integration with MCP-compatible clients and AI assistants.\n\n### Basic Usage\n```bash\nnpx @vkneider/slicejs-mcp\n```\n\n## Tool Summary\n| Tool | Purpose |\n| --- | --- |\n| `list_docs` | Returns available documentation sections/categories. |\n| `search_docs` | Searches across all documentation using keywords or phrases. |\n| `get_doc_content` | Fetches the full content of specific documentation page(s). |\n| `get_llm_full_context` | Fetches the complete documentation bundle (~2000 lines). |\n\n## list_docs\nReturns a list of all available documentation sections and categories.\n\n**Parameters:** None\n\n## search_docs\nSearches across all documentation using keywords or phrases.\n\n### Parameters\n| Parameter | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `query` | string | required | Search term |\n| `max_results` | number | 5 | Maximum number of results |\n\n## get_doc_content\nFetches the full content of specific documentation page(s).\n\n### Parameters\n| Parameter | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `doc_id` | string or string[] | required | Documentation ID(s) to fetch |\n| `include_metadata` | boolean | false | Include additional metadata |\n\n## get_llm_full_context\nFetches the complete documentation bundle (~2000 lines) for comprehensive LLM context.\n\n**Parameters:** None\n\n**Note:** This consumes considerable tokens but provides all documentation in one request.\n\n## Architecture\n\n- **Source**: Documentation fetched from https://github.com/VKneider/slicejs_docs\n- **Caching**: Infinite session cache to minimize API requests and improve performance\n- **Initialization**: Lazy loading of document structure on first tool use\n- **Rate Limiting**: Optimized to stay within GitHub API limits (60 req/hour)\n\n## Integration with AI Assistants\n\nThe MCP server can be integrated with MCP-compatible clients to provide real-time access to Slice.js documentation during development.\n\n## Best Practices\n\n:::tip\nUse `list_docs` first to explore available documentation, then `search_docs` for specific queries.\n:::\n\n:::tip\nFor comprehensive context, use `get_llm_full_context` sparingly due to token consumption.\n:::\n\n:::tip\nThe server maintains a cache during the session, so repeated queries are fast.\n:::\n\n## Gotchas\n\n:::warning\nThe server fetches documentation from GitHub on-demand. Ensure internet connectivity for full functionality.\n:::\n\n:::warning\nLarge documentation requests may consume significant tokens in AI contexts.\n:::";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx @vkneider/slicejs-mcp",
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx @vkneider/slicejs-mcp",
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
            const lines = ["| Tool | Purpose |","| --- | --- |","| `list_docs` | Returns available documentation sections/categories. |","| `search_docs` | Searches across all documentation using keywords or phrases. |","| `get_doc_content` | Fetches the full content of specific documentation page(s). |","| `get_llm_full_context` | Fetches the complete documentation bundle (~2000 lines). |"];
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const lines = ["| Parameter | Type | Default | Notes |","| --- | --- | --- | --- |","| `query` | string | required | Search term |","| `max_results` | number | 5 | Maximum number of results |"];
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const lines = ["| Parameter | Type | Default | Notes |","| --- | --- | --- | --- |","| `doc_id` | string or string[] | required | Documentation ID(s) to fetch |","| `include_metadata` | boolean | false | Include additional metadata |"];
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

customElements.define('slice-slicemcpdocumentation', SliceMCPDocumentation);
