export default class EnvironmentVariablesDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/environment-variables.md";
    this.markdownContent = "---\ntitle: Environment Variables\nroute: /Documentation/Configuration/environment-variables\nnavLabel: Environment Variables\nsection: Getting Started\ngroup: Configuration\norder: 21\ndescription: Expose browser-safe env values with SLICE_PUBLIC_ and runtime helpers.\ncomponent: EnvironmentVariablesDocumentation\ntags: [config, env, security]\n---\n\n# Environment Variables\n\n## Overview\nSlice.js exposes browser-safe environment variables through:\n\n- `GET /slice-env.json`\n- `slice.getEnv(key, fallback)`\n- `slice.getPublicEnv()`\n\nThis is intended for public runtime configuration (for example API base URLs or feature flags).\n\n## Public vs Private Variables\nOnly variables prefixed with `SLICE_PUBLIC_` are exposed to the browser.\n\n| Variable | Exposed to browser | Example |\n| --- | --- | --- |\n| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |\n| Any other key | no | `DB_PASSWORD=...` |\n\n:::warning\nEverything sent to the browser is public. Never put secrets, private tokens, or credentials in `SLICE_PUBLIC_*` variables.\n:::\n\n## Define Variables\nCreate or update your `.env` file:\n\n```bash title=\".env\"\nSLICE_PUBLIC_API_URL=https://api.example.com\nSLICE_PUBLIC_ENABLE_CHAT=true\nDB_PASSWORD=server-only\n```\n\n## Runtime Endpoint Contract\nSlice.js serves environment data at `/slice-env.json` in both development and production.\n\n```json title=\"/slice-env.json\"\n{\n  \"mode\": \"development\",\n  \"env\": {\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\",\n    \"SLICE_PUBLIC_ENABLE_CHAT\": \"true\"\n  }\n}\n```\n\n### Resolution Rules\n- `process.env` has priority over `.env` when both define the same key.\n- In development, values are resolved per request.\n- In production, values are resolved at startup and cached for the process lifetime.\n\n## Runtime Access in Components\n\n```javascript title=\"Read public env from Slice runtime\"\nexport default class HomePage extends HTMLElement {\n  async init() {\n    const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\n    const env = slice.getPublicEnv();\n\n    console.log('API URL:', apiUrl);\n    console.log('All public env:', env);\n  }\n}\n```\n\n## Recommended Workflow\n:::steps\n1. Define browser-safe keys using `SLICE_PUBLIC_`.\n2. Keep secrets in non-public env keys.\n3. Verify endpoint output at `/slice-env.json`.\n4. Read values from `slice.getEnv(...)` in runtime code.\n:::\n\n## Troubleshooting\n:::tip\nIf a key is missing in browser runtime, verify the key starts with `SLICE_PUBLIC_`.\n:::\n\n:::tip\nIf production values do not update, restart the server process to refresh cached env payload.\n:::\n\n## Related Docs\n- `sliceConfig.json`: `/Documentation/Configuration/sliceConfig`\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Variable | Exposed to browser | Example |","| --- | --- | --- |","| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |","| Any other key | no | `DB_PASSWORD=...` |"];
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
               value: "SLICE_PUBLIC_API_URL=https://api.example.com\nSLICE_PUBLIC_ENABLE_CHAT=true\nDB_PASSWORD=server-only",
               language: "bash"
            });
            if (".env") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = ".env";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"mode\": \"development\",\n  \"env\": {\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\",\n    \"SLICE_PUBLIC_ENABLE_CHAT\": \"true\"\n  }\n}",
               language: "json"
            });
            if ("/slice-env.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "/slice-env.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class HomePage extends HTMLElement {\n  async init() {\n    const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\n    const env = slice.getPublicEnv();\n\n    console.log('API URL:', apiUrl);\n    console.log('All public env:', env);\n  }\n}",
               language: "javascript"
            });
            if ("Read public env from Slice runtime") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Read public env from Slice runtime";
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

customElements.define('slice-environmentvariablesdocumentation', EnvironmentVariablesDocumentation);
