export default class SliceMCPDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "slicejs-mcp.md";
    this.markdownContent = "---\r\ntitle: Slice.js MCP\r\nroute: /Documentation/Slice-MCP\r\nnavLabel: MCP\r\nsection: Getting Started\r\ngroup: Tools\r\norder: 21\r\ndescription: Model Context Protocol server for accessing Slice.js documentation via npx or local development.\r\ncomponent: SliceMCPDocumentation\r\ntags: [mcp, documentation, ai, tools]\r\n---\r\n\r\n# Slice.js MCP\r\n\r\n## Overview\r\nSlice.js provides an MCP (Model Context Protocol) server that allows AI assistants and development tools to access Slice.js documentation programmatically. This enables seamless integration with AI-powered coding assistants for real-time documentation queries during development.\r\n\r\n## Installation\r\n\r\n### Using npx (No Installation Required)\r\n```bash\r\nnpx slicejs-mcp\r\n```\r\n\r\n### Local Development\r\nClone the repository, install dependencies, build, and run locally:\r\n```bash\r\ngit clone https://github.com/VKneider/slicejs-mcp.git\r\ncd slicejs-mcp\r\nnpm install\r\nnpm run build\r\nnode dist/index.js\r\n```\r\n\r\n## Usage\r\nThe MCP server runs as a stdio-based service, perfect for integration with MCP-compatible clients and AI assistants.\r\n\r\n### Basic Usage\r\n```bash\r\nnpx @vkneider/slicejs-mcp\r\n```\r\n\r\n## Tool Summary\r\n| Tool | Purpose |\r\n| --- | --- |\r\n| `list_docs` | Returns available documentation sections/categories. |\r\n| `search_docs` | Searches across all documentation using keywords or phrases. |\r\n| `get_doc_content` | Fetches the full content of specific documentation page(s). |\r\n| `get_llm_full_context` | Fetches the complete documentation bundle (~2000 lines). |\r\n\r\n## list_docs\r\nReturns a list of all available documentation sections and categories.\r\n\r\n**Parameters:** None\r\n\r\n## search_docs\r\nSearches across all documentation using keywords or phrases.\r\n\r\n### Parameters\r\n| Parameter | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `query` | string | required | Search term |\r\n| `max_results` | number | 5 | Maximum number of results |\r\n\r\n## get_doc_content\r\nFetches the full content of specific documentation page(s).\r\n\r\n### Parameters\r\n| Parameter | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `doc_id` | string or string[] | required | Documentation ID(s) to fetch |\r\n| `include_metadata` | boolean | false | Include additional metadata |\r\n\r\n## get_llm_full_context\r\nFetches the complete documentation bundle (~2000 lines) for comprehensive LLM context.\r\n\r\n**Parameters:** None\r\n\r\n**Note:** This consumes considerable tokens but provides all documentation in one request.\r\n\r\n## Architecture\r\n\r\n- **Source**: Documentation fetched from https://github.com/VKneider/slicejs_docs\r\n- **Caching**: Infinite session cache to minimize API requests and improve performance\r\n- **Initialization**: Lazy loading of document structure on first tool use\r\n- **Rate Limiting**: Optimized to stay within GitHub API limits (60 req/hour)\r\n\r\n## Integration with AI Assistants\r\n\r\nThe MCP server can be integrated with MCP-compatible clients to provide real-time access to Slice.js documentation during development.\r\n\r\n## Best Practices\r\n\r\n:::tip\r\nUse `list_docs` first to explore available documentation, then `search_docs` for specific queries.\r\n:::\r\n\r\n:::tip\r\nFor comprehensive context, use `get_llm_full_context` sparingly due to token consumption.\r\n:::\r\n\r\n:::tip\r\nThe server maintains a cache during the session, so repeated queries are fast.\r\n:::\r\n\r\n## Gotchas\r\n\r\n:::warning\r\nThe server fetches documentation from GitHub on-demand. Ensure internet connectivity for full functionality.\r\n:::\r\n\r\n:::warning\r\nLarge documentation requests may consume significant tokens in AI contexts.\r\n:::";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx slicejs-mcp\r",
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
               value: "git clone https://github.com/VKneider/slicejs-mcp.git\r\ncd slicejs-mcp\r\nnpm install\r\nnpm run build\r\nnode dist/index.js\r",
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
               value: "npx @vkneider/slicejs-mcp\r",
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
            const lines = ["| Tool | Purpose |\r","| --- | --- |\r","| `list_docs` | Returns available documentation sections/categories. |\r","| `search_docs` | Searches across all documentation using keywords or phrases. |\r","| `get_doc_content` | Fetches the full content of specific documentation page(s). |\r","| `get_llm_full_context` | Fetches the complete documentation bundle (~2000 lines). |\r"];
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
            const lines = ["| Parameter | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `query` | string | required | Search term |\r","| `max_results` | number | 5 | Maximum number of results |\r"];
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
            const lines = ["| Parameter | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `doc_id` | string or string[] | required | Documentation ID(s) to fetch |\r","| `include_metadata` | boolean | false | Include additional metadata |\r"];
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
