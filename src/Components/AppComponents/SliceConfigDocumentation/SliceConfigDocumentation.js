export default class SliceConfigDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "slice-config.md";
    this.markdownContent = "---\ntitle: sliceConfig.json\nroute: /Documentation/Configuration/sliceConfig\nnavLabel: sliceConfig.json\nsection: Getting Started\ngroup: Configuration\norder: 20\ndescription: How Slice.js loads and uses sliceConfig.json.\ncomponent: SliceConfigDocumentation\ntags: [config, setup]\n---\n\n# sliceConfig.json\n\n## Overview\n`sliceConfig.json` configures Slice.js at startup. It is fetched from `/sliceConfig.json` and\nused to initialize the main `slice` instance and structural components.\n\nThe configuration controls debugging, logging, themes, global styles, routing, and optional\nstructural services like EventManager and ContextManager.\n\n## How Slice.js Loads Config\nSlice.js fetches the file in `Slice/ Slice.js` and creates the global `slice` instance:\n\n```javascript title=\"Slice.js initialization (simplified)\"\nconst response = await fetch('/sliceConfig.json');\nconst sliceConfig = await response.json();\nwindow.slice = new Slice(sliceConfig);\n```\n\n## IntelliSense (JSON Schema)\nYou can enable editor IntelliSense by adding a `$schema` reference and using the official schema.\n\n```json title=\"sliceConfig.json\"\n{\n  \"$schema\": \"/sliceConfig.schema.json\"\n}\n```\n\nPlace `sliceConfig.schema.json` at the project root so it is served by your dev server.\n\nOnce loaded, Slice.js initializes structural components based on config:\n\n- Logger and Debugger (if enabled)\n- EventManager and ContextManager (if enabled)\n- Loading component (if enabled)\n- StylesManager + ThemeManager\n- Router (routes loaded from `paths.routesFile`)\n\n## Root Schema\n| Key | Type | Required | Notes |\n| --- | --- | --- | --- |\n| `debugger` | `object` | no | Controls the UI debugger. |\n| `stylesManager` | `object` | no | Global style sheet loading. |\n| `themeManager` | `object` | no | Theme selection and persistence. |\n| `logger` | `object` | no | Console log filters and enablement. |\n| `paths` | `object` | yes | Component paths, themes, styles, routes file. |\n| `router` | `object` | no | Router defaults. |\n| `loading` | `object` | no | Loading component toggle. |\n| `events` | `object` | no | EventManager toggle. |\n| `context` | `object` | no | ContextManager toggle. |\n| `production` | `object` | no | Production toggles (if supported). |\n| `server` | `object` | no | Server port/host for dev server. |\n| `publicFolders` | `string[]` | no | Allowlist of public folders served in production. |\n\n## debugger\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables the debug UI. |\n| `click` | `string` | `right` | Mouse button to open debugger. |\n\n## stylesManager\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `requestedStyles` | `string[]` | `[]` | Styles loaded from `paths.styles`. |\n\n## themeManager\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables themes. |\n| `defaultTheme` | `string` | none | Theme to load if none saved. |\n| `saveThemeLocally` | `boolean` | `false` | Persists theme name and CSS in localStorage. |\n| `useBrowserTheme` | `boolean` | `false` | Uses browser prefers-color-scheme. |\n\n## logger\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `true` | Master log toggle. |\n| `showLogs` | `object` | none | Per-level log filters. |\n\n## paths\n| Field | Type | Required | Notes |\n| --- | --- | --- | --- |\n| `components` | `object` | yes | Category -> path/type map. |\n| `themes` | `string` | yes | Base path for theme CSS. |\n| `styles` | `string` | yes | Base path for shared styles. |\n| `routesFile` | `string` | yes | Module that exports routes array. |\n\n### paths.components\nEach key is a category name used in `components.js`.\n\n| Field | Type | Notes |\n| --- | --- | --- |\n| `path` | `string` | URL path to component folder. |\n| `type` | `Visual | Service` | Controls template/CSS loading. |\n\n## router\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `defaultRoute` | `string` | `/` | Default route path. |\n\n## loading\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `true` | Builds `Loading` component on init. |\n\n## events\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables EventManager at `slice.events`. |\n| `ui` | `object` | none | UI panel configuration. |\n\n### events.ui\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables the Events debug panel. |\n| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+e`). |\n\n## context\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables ContextManager at `slice.context`. |\n| `ui` | `object` | none | UI panel configuration. |\n\n### context.ui\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables the Contexts debug panel. |\n| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+c`). |\n\n## production\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | If supported, disables dev-only features. |\n\n## publicFolders\nUse `publicFolders` to declare **public asset folders** that should be served in production.\nThis keeps source-only folders private while still exposing the assets your app needs.\n\nDefaults are intended to be sensible for most apps: `/Themes`, `/Styles`, `/assets`.\n\nImport resolution scope tied to `publicFolders`:\n- Supported: relative imports and absolute imports that point into configured `publicFolders`.\n- Unsupported: bare package imports such as `import 'pkg'`.\n- Behavior parity: when an absolute import targets a configured public folder, it is preserved consistently in both development and production.\n\nStructural framework components are bundled automatically during `slice build` based on which\nfeatures are enabled in `sliceConfig.json` (e.g. `logger.enabled`, `events.enabled`).\n\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `publicFolders` | `string[]` | `[/Themes, /Styles, /assets]` | Public asset folders served in production. |\n\n## server\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `port` | `number` | `3001` | Dev server port fallback. |\n| `host` | `string` | `localhost` | Dev server host. |\n\n## Public Browser Environment (`SLICE_PUBLIC_*`)\nSlice.js can expose selected environment variables to the browser runtime.\n\nOnly variables that start with `SLICE_PUBLIC_` are included in the browser payload.\nAny variable without this prefix stays server-only and is not exposed through the runtime env endpoint.\n\n:::warning\nAll values exposed with `SLICE_PUBLIC_*` are public and readable by any user in the browser.\nNever place secrets, tokens, private keys, or credentials in these variables.\n:::\n\n### Naming Contract\n| Pattern | Exposed in Browser | Example |\n| --- | --- | --- |\n| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |\n| Any other key | no | `DB_PASSWORD=...` |\n\n### Runtime Endpoint Contract (`/slice-env.json`)\nSlice.js serves browser-safe runtime environment data at `/slice-env.json`.\n\nResponse shape:\n\n```json title=\"/slice-env.json\"\n{\n  \"mode\": \"development\",\n  \"env\": {\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\"\n  }\n}\n```\n\n| Field | Type | Notes |\n| --- | --- | --- |\n| `mode` | `\"development\" | \"production\"` | Current runtime mode. |\n| `env` | `object` | Key/value map of browser-exposed `SLICE_PUBLIC_*` variables. |\n\nIn development and production, the contract is the same: the endpoint returns `{ mode, env }` and `env` only contains `SLICE_PUBLIC_*` keys.\n\n### Runtime API Access\nAfter Slice.js initializes, use these runtime helpers:\n\n| API | Returns | Example |\n| --- | --- | --- |\n| `slice.getEnv(key, fallback)` | Value for a single `SLICE_PUBLIC_*` key, or `fallback` when missing. | `slice.getEnv('SLICE_PUBLIC_API_URL', '')` |\n| `slice.getPublicEnv()` | Full public env object currently loaded in runtime. | `slice.getPublicEnv()` |\n\n```javascript title=\"Runtime usage\"\nconst apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\nconst publicEnv = slice.getPublicEnv();\n```\n\n## Example\n```json title=\"sliceConfig.json\"\n{\n  \"debugger\": { \"enabled\": true, \"click\": \"right\" },\n  \"stylesManager\": { \"requestedStyles\": [\"sliceStyles\", \"DocumentationBase\"] },\n  \"themeManager\": {\n    \"enabled\": true,\n    \"defaultTheme\": \"Slice\",\n    \"saveThemeLocally\": true,\n    \"useBrowserTheme\": false\n  },\n  \"logger\": {\n    \"enabled\": true,\n    \"showLogs\": {\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\n    }\n  },\n  \"paths\": {\n    \"components\": {\n      \"AppComponents\": { \"path\": \"/Components/AppComponents\", \"type\": \"Visual\" },\n      \"Visual\": { \"path\": \"/Components/Visual\", \"type\": \"Visual\" },\n      \"Service\": { \"path\": \"/Components/Service\", \"type\": \"Service\" }\n    },\n    \"themes\": \"/Themes\",\n    \"styles\": \"/Styles\",\n    \"routesFile\": \"/routes.js\"\n  },\n  \"router\": { \"defaultRoute\": \"/\" },\n  \"loading\": { \"enabled\": true },\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\n  \"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }\n  ,\n  \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\"]\n}\n```\n\n## Best Practices\n:::tip\nKeep `paths` accurate or component loading will fail.\n:::\n\n:::tip\nLoad shared styles through `stylesManager.requestedStyles`.\n:::\n\n## Gotchas\n:::warning\nIf `themeManager.enabled` is true and `defaultTheme` is missing, theme loading will fail.\n:::\n\n:::warning\n`events` and `context` are optional. If disabled, Slice.js provides no-op stubs.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const response = await fetch('/sliceConfig.json');\nconst sliceConfig = await response.json();\nwindow.slice = new Slice(sliceConfig);",
               language: "javascript"
            });
            if ("Slice.js initialization (simplified)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Slice.js initialization (simplified)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"$schema\": \"/sliceConfig.schema.json\"\n}",
               language: "json"
            });
            if ("sliceConfig.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "sliceConfig.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const lines = ["| Key | Type | Required | Notes |","| --- | --- | --- | --- |","| `debugger` | `object` | no | Controls the UI debugger. |","| `stylesManager` | `object` | no | Global style sheet loading. |","| `themeManager` | `object` | no | Theme selection and persistence. |","| `logger` | `object` | no | Console log filters and enablement. |","| `paths` | `object` | yes | Component paths, themes, styles, routes file. |","| `router` | `object` | no | Router defaults. |","| `loading` | `object` | no | Loading component toggle. |","| `events` | `object` | no | EventManager toggle. |","| `context` | `object` | no | ContextManager toggle. |","| `production` | `object` | no | Production toggles (if supported). |","| `server` | `object` | no | Server port/host for dev server. |","| `publicFolders` | `string[]` | no | Allowlist of public folders served in production. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `false` | Enables the debug UI. |","| `click` | `string` | `right` | Mouse button to open debugger. |"];
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
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `requestedStyles` | `string[]` | `[]` | Styles loaded from `paths.styles`. |"];
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
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `false` | Enables themes. |","| `defaultTheme` | `string` | none | Theme to load if none saved. |","| `saveThemeLocally` | `boolean` | `false` | Persists theme name and CSS in localStorage. |","| `useBrowserTheme` | `boolean` | `false` | Uses browser prefers-color-scheme. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `true` | Master log toggle. |","| `showLogs` | `object` | none | Per-level log filters. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const lines = ["| Field | Type | Required | Notes |","| --- | --- | --- | --- |","| `components` | `object` | yes | Category -> path/type map. |","| `themes` | `string` | yes | Base path for theme CSS. |","| `styles` | `string` | yes | Base path for shared styles. |","| `routesFile` | `string` | yes | Module that exports routes array. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const lines = ["| Field | Type | Notes |","| --- | --- | --- |","| `path` | `string` | URL path to component folder. |","| `type` | `Visual | Service` | Controls template/CSS loading. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `defaultRoute` | `string` | `/` | Default route path. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `true` | Builds `Loading` component on init. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `false` | Enables EventManager at `slice.events`. |","| `ui` | `object` | none | UI panel configuration. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `false` | Enables the Events debug panel. |","| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+e`). |"];
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
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `false` | Enables ContextManager at `slice.context`. |","| `ui` | `object` | none | UI panel configuration. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `false` | Enables the Contexts debug panel. |","| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+c`). |"];
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
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `false` | If supported, disables dev-only features. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-17"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `publicFolders` | `string[]` | `[/Themes, /Styles, /assets]` | Public asset folders served in production. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-18"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `port` | `number` | `3001` | Dev server port fallback. |","| `host` | `string` | `localhost` | Dev server host. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-19"]');
         if (container) {
            const lines = ["| Pattern | Exposed in Browser | Example |","| --- | --- | --- |","| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |","| Any other key | no | `DB_PASSWORD=...` |"];
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
         const container = this.querySelector('[data-block-id="doc-block-20"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"mode\": \"development\",\n  \"env\": {\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\"\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-21"]');
         if (container) {
            const lines = ["| Field | Type | Notes |","| --- | --- | --- |","| `mode` | `\"development\" | \"production\"` | Current runtime mode. |","| `env` | `object` | Key/value map of browser-exposed `SLICE_PUBLIC_*` variables. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-22"]');
         if (container) {
            const lines = ["| API | Returns | Example |","| --- | --- | --- |","| `slice.getEnv(key, fallback)` | Value for a single `SLICE_PUBLIC_*` key, or `fallback` when missing. | `slice.getEnv('SLICE_PUBLIC_API_URL', '')` |","| `slice.getPublicEnv()` | Full public env object currently loaded in runtime. | `slice.getPublicEnv()` |"];
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
         const container = this.querySelector('[data-block-id="doc-block-23"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\nconst publicEnv = slice.getPublicEnv();",
               language: "javascript"
            });
            if ("Runtime usage") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Runtime usage";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-24"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"debugger\": { \"enabled\": true, \"click\": \"right\" },\n  \"stylesManager\": { \"requestedStyles\": [\"sliceStyles\", \"DocumentationBase\"] },\n  \"themeManager\": {\n    \"enabled\": true,\n    \"defaultTheme\": \"Slice\",\n    \"saveThemeLocally\": true,\n    \"useBrowserTheme\": false\n  },\n  \"logger\": {\n    \"enabled\": true,\n    \"showLogs\": {\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\n    }\n  },\n  \"paths\": {\n    \"components\": {\n      \"AppComponents\": { \"path\": \"/Components/AppComponents\", \"type\": \"Visual\" },\n      \"Visual\": { \"path\": \"/Components/Visual\", \"type\": \"Visual\" },\n      \"Service\": { \"path\": \"/Components/Service\", \"type\": \"Service\" }\n    },\n    \"themes\": \"/Themes\",\n    \"styles\": \"/Styles\",\n    \"routesFile\": \"/routes.js\"\n  },\n  \"router\": { \"defaultRoute\": \"/\" },\n  \"loading\": { \"enabled\": true },\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\n  \"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }\n  ,\n  \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\"]\n}",
               language: "json"
            });
            if ("sliceConfig.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "sliceConfig.json";
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

customElements.define('slice-sliceconfigdocumentation', SliceConfigDocumentation);
