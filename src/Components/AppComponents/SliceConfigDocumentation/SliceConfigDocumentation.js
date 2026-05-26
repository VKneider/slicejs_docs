export default class SliceConfigDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "slice-config.md";
    this.markdownContent = "---\r\ntitle: sliceConfig.json\r\nroute: /Documentation/Configuration/sliceConfig\r\nnavLabel: sliceConfig.json\r\nsection: Getting Started\r\ngroup: Configuration\r\norder: 20\r\ndescription: How Slice.js loads and uses sliceConfig.json.\r\ncomponent: SliceConfigDocumentation\r\ntags: [config, setup]\r\n---\r\n\r\n# sliceConfig.json\r\n\r\n## Overview\r\n`sliceConfig.json` configures Slice.js at startup. It is fetched from `/sliceConfig.json` and\r\nused to initialize the main `slice` instance and structural components.\r\n\r\nThe configuration controls debugging, logging, themes, global styles, routing, and optional\r\nstructural services like EventManager and ContextManager.\r\n\r\n## How Slice.js Loads Config\r\nSlice.js fetches the file in `Slice/ Slice.js` and creates the global `slice` instance:\r\n\r\n```javascript title=\"Slice.js initialization (simplified)\"\r\nconst response = await fetch('/sliceConfig.json');\r\nconst sliceConfig = await response.json();\r\nwindow.slice = new Slice(sliceConfig);\r\n```\r\n\r\n## IntelliSense (JSON Schema)\r\nYou can enable editor IntelliSense by adding a `$schema` reference and using the official schema.\r\n\r\n```json title=\"sliceConfig.json\"\r\n{\r\n  \"$schema\": \"/sliceConfig.schema.json\"\r\n}\r\n```\r\n\r\nPlace `sliceConfig.schema.json` at the project root so it is served by your dev server.\r\n\r\nOnce loaded, Slice.js initializes structural components based on config:\r\n\r\n- Logger and Debugger (if enabled)\r\n- EventManager and ContextManager (if enabled)\r\n- Loading component (if enabled)\r\n- StylesManager + ThemeManager\r\n- Router (routes loaded from `paths.routesFile`)\r\n\r\n## Root Schema\r\n| Key | Type | Required | Notes |\r\n| --- | --- | --- | --- |\r\n| `debugger` | `object` | no | Controls the UI debugger. |\r\n| `stylesManager` | `object` | no | Global style sheet loading. |\r\n| `themeManager` | `object` | no | Theme selection and persistence. |\r\n| `logger` | `object` | no | Console log filters and enablement. |\r\n| `paths` | `object` | yes | Component paths, themes, styles, routes file. |\r\n| `router` | `object` | no | Router defaults. |\r\n| `loading` | `object` | no | Loading component toggle. |\r\n| `events` | `object` | no | EventManager toggle. |\r\n| `context` | `object` | no | ContextManager toggle. |\r\n| `production` | `object` | no | Production toggles (if supported). |\r\n| `server` | `object` | no | Server port/host for dev server. |\r\n| `publicFolders` | `string[]` | no | Allowlist of public folders served in production. |\r\n\r\n## debugger\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `enabled` | `boolean` | `false` | Enables the debug UI. |\r\n| `click` | `string` | `right` | Mouse button to open debugger. |\r\n\r\n## stylesManager\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `requestedStyles` | `string[]` | `[]` | Styles loaded from `paths.styles`. |\r\n\r\n## themeManager\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `enabled` | `boolean` | `false` | Enables themes. |\r\n| `defaultTheme` | `string` | none | Theme to load if none saved. |\r\n| `saveThemeLocally` | `boolean` | `false` | Persists theme name and CSS in localStorage. |\r\n| `useBrowserTheme` | `boolean` | `false` | Uses browser prefers-color-scheme. |\r\n\r\n## logger\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `enabled` | `boolean` | `true` | Master log toggle. |\r\n| `showLogs` | `object` | none | Per-level log filters. |\r\n\r\n## paths\r\n| Field | Type | Required | Notes |\r\n| --- | --- | --- | --- |\r\n| `components` | `object` | yes | Category -> path/type map. |\r\n| `themes` | `string` | yes | Base path for theme CSS. |\r\n| `styles` | `string` | yes | Base path for shared styles. |\r\n| `routesFile` | `string` | yes | Module that exports routes array. |\r\n\r\n### paths.components\r\nEach key is a category name used in `components.js`.\r\n\r\n| Field | Type | Notes |\r\n| --- | --- | --- |\r\n| `path` | `string` | URL path to component folder. |\r\n| `type` | `Visual | Service` | Controls template/CSS loading. |\r\n\r\n## router\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `defaultRoute` | `string` | `/` | Default route path. |\r\n\r\n## loading\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `enabled` | `boolean` | `true` | Builds `Loading` component on init. |\r\n\r\n## events\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `enabled` | `boolean` | `false` | Enables EventManager at `slice.events`. |\r\n| `ui` | `object` | none | UI panel configuration. |\r\n\r\n### events.ui\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `enabled` | `boolean` | `false` | Enables the Events debug panel. |\r\n| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+e`). |\r\n\r\n## context\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `enabled` | `boolean` | `false` | Enables ContextManager at `slice.context`. |\r\n| `ui` | `object` | none | UI panel configuration. |\r\n\r\n### context.ui\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `enabled` | `boolean` | `false` | Enables the Contexts debug panel. |\r\n| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+c`). |\r\n\r\n## production\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `enabled` | `boolean` | `false` | If supported, disables dev-only features. |\r\n\r\n## publicFolders\r\nUse `publicFolders` to declare **public asset folders** that should be served in production.\r\nThis keeps source-only folders private while still exposing the assets your app needs.\r\n\r\nDefaults are intended to be sensible for most apps: `/Themes`, `/Styles`, `/assets`.\r\n\r\nImport resolution scope tied to `publicFolders`:\r\n- Supported: relative imports and absolute imports that point into configured `publicFolders`.\r\n- Unsupported: bare package imports such as `import 'pkg'`.\r\n- Behavior parity: when an absolute import targets a configured public folder, it is preserved consistently in both development and production.\r\n\r\nStructural framework components are bundled automatically during `slice build` based on which\r\nfeatures are enabled in `sliceConfig.json` (e.g. `logger.enabled`, `events.enabled`).\r\n\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `publicFolders` | `string[]` | `[/Themes, /Styles, /assets]` | Public asset folders served in production. |\r\n\r\n## server\r\n| Field | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `port` | `number` | `3001` | Dev server port fallback. |\r\n| `host` | `string` | `localhost` | Dev server host. |\r\n\r\n## Public Browser Environment (`SLICE_PUBLIC_*`)\r\nSlice.js can expose selected environment variables to the browser runtime.\r\n\r\nOnly variables that start with `SLICE_PUBLIC_` are included in the browser payload.\r\nAny variable without this prefix stays server-only and is not exposed through the runtime env endpoint.\r\n\r\n:::warning\r\nAll values exposed with `SLICE_PUBLIC_*` are public and readable by any user in the browser.\r\nNever place secrets, tokens, private keys, or credentials in these variables.\r\n:::\r\n\r\n### Naming Contract\r\n| Pattern | Exposed in Browser | Example |\r\n| --- | --- | --- |\r\n| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |\r\n| Any other key | no | `DB_PASSWORD=...` |\r\n\r\n### Runtime Endpoint Contract (`/slice-env.json`)\r\nSlice.js serves browser-safe runtime environment data at `/slice-env.json`.\r\n\r\nResponse shape:\r\n\r\n```json title=\"/slice-env.json\"\r\n{\r\n  \"mode\": \"development\",\r\n  \"env\": {\r\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\"\r\n  }\r\n}\r\n```\r\n\r\n| Field | Type | Notes |\r\n| --- | --- | --- |\r\n| `mode` | `\"development\" | \"production\"` | Current runtime mode. |\r\n| `env` | `object` | Key/value map of browser-exposed `SLICE_PUBLIC_*` variables. |\r\n\r\nIn development and production, the contract is the same: the endpoint returns `{ mode, env }` and `env` only contains `SLICE_PUBLIC_*` keys.\r\n\r\n### Runtime API Access\r\nAfter Slice.js initializes, use these runtime helpers:\r\n\r\n| API | Returns | Example |\r\n| --- | --- | --- |\r\n| `slice.getEnv(key, fallback)` | Value for a single `SLICE_PUBLIC_*` key, or `fallback` when missing. | `slice.getEnv('SLICE_PUBLIC_API_URL', '')` |\r\n| `slice.getPublicEnv()` | Full public env object currently loaded in runtime. | `slice.getPublicEnv()` |\r\n\r\n```javascript title=\"Runtime usage\"\r\nconst apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\r\nconst publicEnv = slice.getPublicEnv();\r\n```\r\n\r\n## Example\r\n```json title=\"sliceConfig.json\"\r\n{\r\n  \"debugger\": { \"enabled\": true, \"click\": \"right\" },\r\n  \"stylesManager\": { \"requestedStyles\": [\"sliceStyles\", \"DocumentationBase\"] },\r\n  \"themeManager\": {\r\n    \"enabled\": true,\r\n    \"defaultTheme\": \"Slice\",\r\n    \"saveThemeLocally\": true,\r\n    \"useBrowserTheme\": false\r\n  },\r\n  \"logger\": {\r\n    \"enabled\": true,\r\n    \"showLogs\": {\r\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\r\n    }\r\n  },\r\n  \"paths\": {\r\n    \"components\": {\r\n      \"AppComponents\": { \"path\": \"/Components/AppComponents\", \"type\": \"Visual\" },\r\n      \"Visual\": { \"path\": \"/Components/Visual\", \"type\": \"Visual\" },\r\n      \"Service\": { \"path\": \"/Components/Service\", \"type\": \"Service\" }\r\n    },\r\n    \"themes\": \"/Themes\",\r\n    \"styles\": \"/Styles\",\r\n    \"routesFile\": \"/routes.js\"\r\n  },\r\n  \"router\": { \"defaultRoute\": \"/\" },\r\n  \"loading\": { \"enabled\": true },\r\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\r\n  \"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }\r\n  ,\r\n  \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\"]\r\n}\r\n```\r\n\r\n## Best Practices\r\n:::tip\r\nKeep `paths` accurate or component loading will fail.\r\n:::\r\n\r\n:::tip\r\nLoad shared styles through `stylesManager.requestedStyles`.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\nIf `themeManager.enabled` is true and `defaultTheme` is missing, theme loading will fail.\r\n:::\r\n\r\n:::warning\r\n`events` and `context` are optional. If disabled, Slice.js provides no-op stubs.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const response = await fetch('/sliceConfig.json');\r\nconst sliceConfig = await response.json();\r\nwindow.slice = new Slice(sliceConfig);\r",
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
               value: "{\r\n  \"$schema\": \"/sliceConfig.schema.json\"\r\n}\r",
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
            const lines = ["| Key | Type | Required | Notes |\r","| --- | --- | --- | --- |\r","| `debugger` | `object` | no | Controls the UI debugger. |\r","| `stylesManager` | `object` | no | Global style sheet loading. |\r","| `themeManager` | `object` | no | Theme selection and persistence. |\r","| `logger` | `object` | no | Console log filters and enablement. |\r","| `paths` | `object` | yes | Component paths, themes, styles, routes file. |\r","| `router` | `object` | no | Router defaults. |\r","| `loading` | `object` | no | Loading component toggle. |\r","| `events` | `object` | no | EventManager toggle. |\r","| `context` | `object` | no | ContextManager toggle. |\r","| `production` | `object` | no | Production toggles (if supported). |\r","| `server` | `object` | no | Server port/host for dev server. |\r","| `publicFolders` | `string[]` | no | Allowlist of public folders served in production. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `enabled` | `boolean` | `false` | Enables the debug UI. |\r","| `click` | `string` | `right` | Mouse button to open debugger. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `requestedStyles` | `string[]` | `[]` | Styles loaded from `paths.styles`. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `enabled` | `boolean` | `false` | Enables themes. |\r","| `defaultTheme` | `string` | none | Theme to load if none saved. |\r","| `saveThemeLocally` | `boolean` | `false` | Persists theme name and CSS in localStorage. |\r","| `useBrowserTheme` | `boolean` | `false` | Uses browser prefers-color-scheme. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `enabled` | `boolean` | `true` | Master log toggle. |\r","| `showLogs` | `object` | none | Per-level log filters. |\r"];
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
            const lines = ["| Field | Type | Required | Notes |\r","| --- | --- | --- | --- |\r","| `components` | `object` | yes | Category -> path/type map. |\r","| `themes` | `string` | yes | Base path for theme CSS. |\r","| `styles` | `string` | yes | Base path for shared styles. |\r","| `routesFile` | `string` | yes | Module that exports routes array. |\r"];
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
            const lines = ["| Field | Type | Notes |\r","| --- | --- | --- |\r","| `path` | `string` | URL path to component folder. |\r","| `type` | `Visual | Service` | Controls template/CSS loading. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `defaultRoute` | `string` | `/` | Default route path. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `enabled` | `boolean` | `true` | Builds `Loading` component on init. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `enabled` | `boolean` | `false` | Enables EventManager at `slice.events`. |\r","| `ui` | `object` | none | UI panel configuration. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `enabled` | `boolean` | `false` | Enables the Events debug panel. |\r","| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+e`). |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `enabled` | `boolean` | `false` | Enables ContextManager at `slice.context`. |\r","| `ui` | `object` | none | UI panel configuration. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `enabled` | `boolean` | `false` | Enables the Contexts debug panel. |\r","| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+c`). |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `enabled` | `boolean` | `false` | If supported, disables dev-only features. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `publicFolders` | `string[]` | `[/Themes, /Styles, /assets]` | Public asset folders served in production. |\r"];
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
            const lines = ["| Field | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `port` | `number` | `3001` | Dev server port fallback. |\r","| `host` | `string` | `localhost` | Dev server host. |\r"];
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
            const lines = ["| Pattern | Exposed in Browser | Example |\r","| --- | --- | --- |\r","| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |\r","| Any other key | no | `DB_PASSWORD=...` |\r"];
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
               value: "{\r\n  \"mode\": \"development\",\r\n  \"env\": {\r\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\"\r\n  }\r\n}\r",
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
            const lines = ["| Field | Type | Notes |\r","| --- | --- | --- |\r","| `mode` | `\"development\" | \"production\"` | Current runtime mode. |\r","| `env` | `object` | Key/value map of browser-exposed `SLICE_PUBLIC_*` variables. |\r"];
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
            const lines = ["| API | Returns | Example |\r","| --- | --- | --- |\r","| `slice.getEnv(key, fallback)` | Value for a single `SLICE_PUBLIC_*` key, or `fallback` when missing. | `slice.getEnv('SLICE_PUBLIC_API_URL', '')` |\r","| `slice.getPublicEnv()` | Full public env object currently loaded in runtime. | `slice.getPublicEnv()` |\r"];
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
               value: "const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\r\nconst publicEnv = slice.getPublicEnv();\r",
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
               value: "{\r\n  \"debugger\": { \"enabled\": true, \"click\": \"right\" },\r\n  \"stylesManager\": { \"requestedStyles\": [\"sliceStyles\", \"DocumentationBase\"] },\r\n  \"themeManager\": {\r\n    \"enabled\": true,\r\n    \"defaultTheme\": \"Slice\",\r\n    \"saveThemeLocally\": true,\r\n    \"useBrowserTheme\": false\r\n  },\r\n  \"logger\": {\r\n    \"enabled\": true,\r\n    \"showLogs\": {\r\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\r\n    }\r\n  },\r\n  \"paths\": {\r\n    \"components\": {\r\n      \"AppComponents\": { \"path\": \"/Components/AppComponents\", \"type\": \"Visual\" },\r\n      \"Visual\": { \"path\": \"/Components/Visual\", \"type\": \"Visual\" },\r\n      \"Service\": { \"path\": \"/Components/Service\", \"type\": \"Service\" }\r\n    },\r\n    \"themes\": \"/Themes\",\r\n    \"styles\": \"/Styles\",\r\n    \"routesFile\": \"/routes.js\"\r\n  },\r\n  \"router\": { \"defaultRoute\": \"/\" },\r\n  \"loading\": { \"enabled\": true },\r\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\r\n  \"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }\r\n  ,\r\n  \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\"]\r\n}\r",
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
