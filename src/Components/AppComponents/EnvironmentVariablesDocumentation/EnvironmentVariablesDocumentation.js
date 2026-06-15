export default class EnvironmentVariablesDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/environment-variables.md";
    this.markdownContent = "---\r\ntitle: Environment Variables\r\nroute: /Documentation/Configuration/environment-variables\r\nnavLabel: Environment Variables\r\nsection: Getting Started\r\ngroup: Configuration\r\norder: 21\r\ndescription: Expose browser-safe env values with SLICE_PUBLIC_ and runtime helpers.\r\ncomponent: EnvironmentVariablesDocumentation\r\ntags: [config, env, security]\r\n---\r\n\r\n# Environment Variables\r\n\r\n## Overview\r\nSlice.js exposes browser-safe environment variables through:\r\n\r\n- `GET /slice-env.json`\r\n- `slice.getEnv(key, fallback)`\r\n- `slice.getPublicEnv()`\r\n\r\nThis is intended for public runtime configuration (for example API base URLs or feature flags).\r\n\r\n## Public vs Private Variables\r\nOnly variables prefixed with `SLICE_PUBLIC_` are exposed to the browser.\r\n\r\n| Variable | Exposed to browser | Example |\r\n| --- | --- | --- |\r\n| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |\r\n| Any other key | no | `DB_PASSWORD=...` |\r\n\r\n:::warning\r\nEverything sent to the browser is public. Never put secrets, private tokens, or credentials in `SLICE_PUBLIC_*` variables.\r\n:::\r\n\r\n## Define Variables\r\nCreate or update your `.env` file:\r\n\r\n```bash title=\".env\"\r\nSLICE_PUBLIC_API_URL=https://api.example.com\r\nSLICE_PUBLIC_ENABLE_CHAT=true\r\nDB_PASSWORD=server-only\r\n```\r\n\r\n## Runtime Endpoint Contract\r\nSlice.js serves environment data at `/slice-env.json` in both development and production.\r\n\r\n```json title=\"/slice-env.json\"\r\n{\r\n  \"mode\": \"development\",\r\n  \"env\": {\r\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\",\r\n    \"SLICE_PUBLIC_ENABLE_CHAT\": \"true\"\r\n  }\r\n}\r\n```\r\n\r\n### Resolution Rules\r\n- `process.env` has priority over `.env` when both define the same key.\r\n- In development, values are resolved per request.\r\n- In production, values are resolved at startup and cached for the process lifetime.\r\n\r\n## Runtime Access in Components\r\n\r\n```javascript title=\"Read public env from Slice runtime\"\r\nexport default class HomePage extends HTMLElement {\r\n  async init() {\r\n    const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\r\n    const env = slice.getPublicEnv();\r\n\r\n    console.log('API URL:', apiUrl);\r\n    console.log('All public env:', env);\r\n  }\r\n}\r\n```\r\n\r\n## Typed Accessors (`slice.env`)\r\n`slice.getEnv` always returns a string (env values are strings). `slice.env.*` parses common shapes for you, so you stop re-writing `String(...).split(',')` and boolean checks across the app.\r\n\r\n| Accessor | Returns | Example |\r\n| --- | --- | --- |\r\n| `slice.env.get(key, fallback?)` | `string` | `slice.env.get('SLICE_PUBLIC_API_URL', '')` |\r\n| `slice.env.bool(key, fallback?)` | `boolean` | `'1' \\| 'true' \\| 'yes' \\| 'on'` → `true` |\r\n| `slice.env.int(key, fallback?)` | `number` | `slice.env.int('SLICE_PUBLIC_TIMEOUT', 5000)` |\r\n| `slice.env.list(key, fallback?)` | `string[]` | `'a, b'` → `['a','b']` (trims, drops empties) |\r\n| `slice.env.has(key)` | `boolean` | key present in the public env |\r\n| `slice.env.all()` | `object` | snapshot of all `SLICE_PUBLIC_*` keys |\r\n\r\n```javascript title=\"Typed reads\"\r\nconst auth   = slice.env.bool('SLICE_PUBLIC_AUTH_ENABLED');        // false if missing\r\nconst models = slice.env.list('SLICE_PUBLIC_MODELS', ['default']); // ['a','b',...]\r\nconst apiUrl = slice.env.get('SLICE_PUBLIC_API_URL', '');\r\n```\r\n\r\nMissing or empty values fall back: `bool`/`int`/`list` return the provided fallback (or `false` / `0` / `[]`).\r\n\r\n## Recommended Workflow\r\n:::steps\r\n1. Define browser-safe keys using `SLICE_PUBLIC_`.\r\n2. Keep secrets in non-public env keys.\r\n3. Verify endpoint output at `/slice-env.json`.\r\n4. Read values with `slice.env.*` (or `slice.getEnv`) in runtime code.\r\n:::\r\n\r\n## Troubleshooting\r\n:::tip\r\nIf a key is missing in browser runtime, verify the key starts with `SLICE_PUBLIC_`.\r\n:::\r\n\r\n:::tip\r\nIf production values do not update, restart the server process to refresh cached env payload.\r\n:::\r\n\r\n## Related Docs\r\n- `sliceConfig.json`: `/Documentation/Configuration/sliceConfig`\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Variable | Exposed to browser | Example |\r","| --- | --- | --- |\r","| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |\r","| Any other key | no | `DB_PASSWORD=...` |\r"];
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
               value: "SLICE_PUBLIC_API_URL=https://api.example.com\r\nSLICE_PUBLIC_ENABLE_CHAT=true\r\nDB_PASSWORD=server-only\r",
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
               value: "{\r\n  \"mode\": \"development\",\r\n  \"env\": {\r\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\",\r\n    \"SLICE_PUBLIC_ENABLE_CHAT\": \"true\"\r\n  }\r\n}\r",
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
               value: "export default class HomePage extends HTMLElement {\r\n  async init() {\r\n    const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\r\n    const env = slice.getPublicEnv();\r\n\r\n    console.log('API URL:', apiUrl);\r\n    console.log('All public env:', env);\r\n  }\r\n}\r",
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
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const lines = ["| Accessor | Returns | Example |\r","| --- | --- | --- |\r","| `slice.env.get(key, fallback?)` | `string` | `slice.env.get('SLICE_PUBLIC_API_URL', '')` |\r","| `slice.env.bool(key, fallback?)` | `boolean` | `'1' \\| 'true' \\| 'yes' \\| 'on'` → `true` |\r","| `slice.env.int(key, fallback?)` | `number` | `slice.env.int('SLICE_PUBLIC_TIMEOUT', 5000)` |\r","| `slice.env.list(key, fallback?)` | `string[]` | `'a, b'` → `['a','b']` (trims, drops empties) |\r","| `slice.env.has(key)` | `boolean` | key present in the public env |\r","| `slice.env.all()` | `object` | snapshot of all `SLICE_PUBLIC_*` keys |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const auth   = slice.env.bool('SLICE_PUBLIC_AUTH_ENABLED');        // false if missing\r\nconst models = slice.env.list('SLICE_PUBLIC_MODELS', ['default']); // ['a','b',...]\r\nconst apiUrl = slice.env.get('SLICE_PUBLIC_API_URL', '');\r",
               language: "javascript"
            });
            if ("Typed reads") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Typed reads";
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
