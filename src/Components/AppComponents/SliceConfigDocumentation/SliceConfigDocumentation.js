export default class SliceConfigDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "slice-config.md";
    this.markdownContent = "---\ntitle: sliceConfig.json\nroute: /Documentation/Configuration/sliceConfig\nnavLabel: sliceConfig.json\nsection: Configuration\ngroup: ''\norder: 10\ndescription: How Slice.js loads and uses sliceConfig.json.\ncomponent: SliceConfigDocumentation\ntags: [config, setup]\n---\n\n# sliceConfig.json\n\n## Overview\n`sliceConfig.json` configures Slice.js at startup. It is fetched from `/sliceConfig.json` and\nused to initialize the main `slice` instance and structural components.\n\nThe configuration controls debugging, logging, themes, global styles, routing, and optional\nstructural services like EventManager and ContextManager.\n\n## How Slice.js Loads Config\nSlice.js fetches the file in `Slice/ Slice.js` and creates the global `slice` instance:\n\n```javascript title=\"Slice.js initialization (simplified)\"\nconst response = await fetch('/sliceConfig.json');\nconst sliceConfig = await response.json();\nwindow.slice = new Slice(sliceConfig);\n```\n\n## IntelliSense (JSON Schema)\nYou can enable editor IntelliSense by adding a `$schema` reference and using the official schema.\n\n```json title=\"sliceConfig.json\"\n{\n  \"$schema\": \"/sliceConfig.schema.json\"\n}\n```\n\nPlace `sliceConfig.schema.json` at the project root so it is served by your dev server.\n\nOnce loaded, Slice.js initializes structural components based on config:\n\n- Logger and Debugger (if enabled)\n- EventManager and ContextManager (if enabled)\n- Loading component (if enabled)\n- StylesManager + ThemeManager\n- Router (routes loaded from `paths.routesFile`)\n\n## Root Schema\n| Key | Type | Required | Notes |\n| --- | --- | --- | --- |\n| `debugger` | `object` | no | Controls the UI debugger. |\n| `stylesManager` | `object` | no | Global style sheet loading. |\n| `themeManager` | `object` | no | Theme selection and persistence. |\n| `logger` | `object` | no | Console log filters and enablement. |\n| `paths` | `object` | yes | Component paths, themes, styles, routes file. |\n| `router` | `object` | no | Router defaults. |\n| `loading` | `object` | no | Loading component toggle. |\n| `events` | `object` | no | EventManager toggle. |\n| `context` | `object` | no | ContextManager toggle. |\n| `production` | `object` | no | Production toggles (if supported). |\n| `server` | `object` | no | Server port/host for dev server. |\n| _(static assets)_ | — | — | Put them under `src/public/` — served at the root URL. No config key; see below. |\n\n## debugger\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables the debug UI. |\n| `click` | `string` | `right` | Mouse button to open debugger. |\n\n## stylesManager\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `requestedStyles` | `string[]` | `[]` | Styles loaded from `paths.styles`. |\n\n## themeManager\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables themes. |\n| `defaultTheme` | `string` | none | Theme to load if none saved. |\n| `saveThemeLocally` | `boolean` | `false` | Persists theme name and CSS in localStorage. |\n| `useBrowserTheme` | `boolean` | `false` | Uses browser prefers-color-scheme. |\n\n## logger\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `true` | Master log toggle. |\n| `showLogs` | `object` | none | Per-level log filters. |\n| `ui` | `object` | none | UI panel configuration. |\n\n### logger.ui\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables the LogViewer debug panel. |\n| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+l`). |\n\n## paths\n| Field | Type | Required | Notes |\n| --- | --- | --- | --- |\n| `components` | `object` | yes | Category -> path/type map. |\n| `themes` | `string` | yes | Base path for theme CSS. |\n| `styles` | `string` | yes | Base path for shared styles. |\n| `routesFile` | `string` | yes | Module that exports routes array. |\n\n### paths.components\nThis is how Slice.js knows **where your components live and how to load them**. Each key is a\n**component category**, and its value tells the framework two things:\n\n| Field | Type | Notes |\n| --- | --- | --- |\n| `path` | `string` | Folder (relative to `src/`) where that category's components live. |\n| `type` | `Visual` or `Service` | How to load a component in this category. |\n| `description` | `string` | Optional short purpose. Used as a seed when the category `AGENTS.md` is created; the guide itself is the formal documentation. |\n\nThe `type` controls loading:\n- **`Visual`** — the component has a UI, so Slice loads three files per component:\n  `<Name>.js` + `<Name>.html` (template) + `<Name>.css` (styles).\n- **`Service`** — logic only, no UI, so Slice loads just `<Name>.js`.\n\nA default project ships three categories:\n\n```json title=\"paths.components\"\n\"components\": {\n  \"AppComponents\": { \"path\": \"/Components/AppComponents\", \"type\": \"Visual\" },\n  \"Visual\":        { \"path\": \"/Components/Visual\",        \"type\": \"Visual\" },\n  \"Service\":       { \"path\": \"/Components/Service\",        \"type\": \"Service\" }\n}\n```\n\n- **`Visual`** holds reusable UI components (often the official registry components).\n- **`AppComponents`** is also a `Visual` category, reserved for your app-specific screens and\n  sections (for example `AppShell`, `HomeSection`). Same three-file pattern as `Visual`.\n- **`Service`** holds plain logic classes (API clients, storage helpers).\n\nWhen you call `slice.build('Name')`, Slice looks up the component's category in `components.js`,\nfinds the matching `paths.components` entry, and loads the files from `<path>/<Name>/` using the\nrules for that `type`. You can add your own categories here (each needs a `path` and a `type`).\n\n`slice init` and `slice docs generate agents` create a `src/Components/<Category>/AGENTS.md` for\nevery category. `Visual` and `Service` are registry categories: `slice get` installs there, and\ntheir guides point to the remote component docs. App categories document their own components in a\nco-located `README.md`. See [Documentation & AGENTS.md](/Documentation/Documentation-System).\n\nYou normally do not edit folders by hand — `slice component create` scaffolds a component in the\nright category and updates `components.js` for you. See Component Anatomy.\n\n:::warning\nIf a category's `path` or `type` is wrong, `slice.build()` returns `null` with a misleading\n\"component not found\" error. A `Service` folder marked `Visual` will fail trying to fetch a\nmissing `.html`.\n:::\n\n## translator\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Creates dictionaries, `data-t` and `t.ref()` support at `slice.translator`. Off: `slice.t()` returns the key. |\n| `defaultLocale` | `string` | — | Required when enabled. The locale an unprefixed URL means. |\n| `fallbackLocale` | `string \\| null` | `null` | Consulted when the active locale has no key. |\n| `locales` | `string[]` | `[defaultLocale]` | Locales the app has; `setLocale()` refuses others. |\n| `path` | `string` | `/locales` | Where `<path>/<locale>.json` is served from (copied into `dist/` by the build). |\n| `saveLocally` | `boolean` | `false` | Remember the choice in `localStorage`. |\n| `useBrowserLocale` | `boolean` | `false` | First visit: use the browser's language when supported. |\n| `localePrefix` | `false \\| \"always\" \\| \"except-default\"` | `false` | Put the locale in the URL (`/es/pricing`; `except-default` leaves the default locale unprefixed). |\n| `ui` | `object` | none | `{ \"enabled\": true, \"shortcut\": \"alt+shift+t\" }` opens the translator panel. |\n\nFull guide: [Translating an app](/Documentation/Translator).\n\n## router\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `defaultRoute` | `string` | `/` | Default route path. |\n| `updateTitles` | `boolean` | `true` | The router writes `document.title` and the description from each route's `metadata` on navigation. `false` leaves them alone. |\n| `titlePrefix` | `string` | `''` | Text before every route title. The separator is part of the string (`\"Acme · \"`). |\n| `titleSuffix` | `string` | `''` | Text after every route title. The separator is part of the string (`\" · Acme\"`). |\n\n## loading\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `true` | Builds `Loading` component on init. |\n\n## events\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables EventManager at `slice.events`. |\n| `ui` | `object` | none | UI panel configuration. |\n\n### events.ui\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables the Events debug panel. |\n| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+e`). |\n\n## context\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables ContextManager at `slice.context`. |\n| `ui` | `object` | none | UI panel configuration. |\n\n### context.ui\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Enables the Contexts debug panel. |\n| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+c`). |\n\n## production\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | If supported, disables dev-only features. |\n\n## Static assets — the `public/` folder\nPut static assets under **`src/public/`**; everything there is served at the root URL and copied into the build — no configuration needed. `Themes`, `Styles` and `images` live under `public/`, and their URLs (`/Themes`, `/Styles`, `/images`) match their paths.\n\nImport resolution:\n- **Relative imports** (`./`, `../`) and **bare npm packages** (`import 'pkg'`) are supported — see [External Dependencies](/Documentation/External-Dependencies).\n- **Absolute imports** (`/libs/x.js`) are preserved when the file exists under `src/public/`, in both development and production.\n\nStructural framework components are bundled automatically during `slice build` based on which\nfeatures are enabled in `sliceConfig.json` (e.g. `logger.enabled`, `events.enabled`).\n\n## server\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `port` | `number` | `3001` | Dev server port fallback. |\n| `host` | `string` | `localhost` | Dev server host. |\n\n## Public Browser Environment (`SLICE_PUBLIC_*`)\nSlice.js can expose selected environment variables to the browser runtime.\n\nOnly variables that start with `SLICE_PUBLIC_` are included in the browser payload.\nAny variable without this prefix stays server-only and is not exposed through the runtime env endpoint.\n\n:::warning\nAll values exposed with `SLICE_PUBLIC_*` are public and readable by any user in the browser.\nNever place secrets, tokens, private keys, or credentials in these variables.\n:::\n\n### Naming Contract\n| Pattern | Exposed in Browser | Example |\n| --- | --- | --- |\n| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |\n| Any other key | no | `DB_PASSWORD=...` |\n\n### Build-time Artifact (`slice-env.generated.js`)\n`slice build` writes browser-safe runtime environment data into `dist/`:\n\n- `slice-env.json` — the shared payload (`{ mode, env }`).\n- `slice-env.generated.js` — an ESM shim that exports the same object.\n\nThe runtime imports `/slice-env.generated.js` at boot; production has no env endpoint. `slice dev`\nkeeps the live `/slice-env.json` provider so `.env` edits do not require a build.\n\nPayload shape:\n\n```json title=\"dist/slice-env.json\"\n{\n  \"mode\": \"production\",\n  \"env\": {\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\"\n  }\n}\n```\n\n| Field | Type | Notes |\n| --- | --- | --- |\n| `mode` | `\"development\"` or `\"production\"` | Current runtime mode. |\n| `env` | `object` | Key/value map of browser-exposed `SLICE_PUBLIC_*` variables. |\n\nIn production the payload is frozen at build time. `slice export` copies both files to the static\nroot; `slice start` serves them as static assets.\n\n### Runtime API Access\nAfter Slice.js initializes, use these runtime helpers:\n\n| API | Returns | Example |\n| --- | --- | --- |\n| `slice.getEnv(key, fallback)` | Value for a single `SLICE_PUBLIC_*` key, or `fallback` when missing. | `slice.getEnv('SLICE_PUBLIC_API_URL', '')` |\n| `slice.getPublicEnv()` | Full public env object currently loaded in runtime. | `slice.getPublicEnv()` |\n\n```javascript title=\"Runtime usage\"\nconst apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\nconst publicEnv = slice.getPublicEnv();\n```\n\n## Example\n```json title=\"sliceConfig.json\"\n{\n  \"debugger\": { \"enabled\": true, \"click\": \"right\" },\n  \"stylesManager\": { \"requestedStyles\": [\"sliceStyles\", \"DocumentationBase\"] },\n  \"themeManager\": {\n    \"enabled\": true,\n    \"defaultTheme\": \"Slice\",\n    \"saveThemeLocally\": true,\n    \"useBrowserTheme\": false\n  },\n  \"logger\": {\n    \"enabled\": true,\n    \"showLogs\": {\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\n    },\n    \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+l\" }\n  },\n  \"paths\": {\n    \"components\": {\n      \"AppComponents\": { \"path\": \"/Components/AppComponents\", \"type\": \"Visual\" },\n      \"Visual\": { \"path\": \"/Components/Visual\", \"type\": \"Visual\" },\n      \"Service\": { \"path\": \"/Components/Service\", \"type\": \"Service\" }\n    },\n    \"themes\": \"/Themes\",\n    \"styles\": \"/Styles\",\n    \"routesFile\": \"/routes.js\"\n  },\n  \"router\": { \"defaultRoute\": \"/\" },\n  \"loading\": { \"enabled\": true },\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\n  \"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }\n}\n```\n\n## Best Practices\nKeep `paths` accurate or component loading will fail.\n\nLoad shared styles through `stylesManager.requestedStyles`.\n\n## Gotchas\n:::warning\nIf `themeManager.enabled` is true and `defaultTheme` is missing, theme loading will fail.\n:::\n\n`events` and `context` are optional. If disabled, Slice.js provides no-op stubs.\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Configuration"}]
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Key","Type","Required","Notes"],
               rows: [[{"html":"<code>debugger</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Controls the UI debugger."}],[{"html":"<code>stylesManager</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Global style sheet loading."}],[{"html":"<code>themeManager</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Theme selection and persistence."}],[{"html":"<code>logger</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Console log filters and enablement."}],[{"html":"<code>paths</code>"},{"html":"<code>object</code>"},{"html":"yes"},{"html":"Component paths, themes, styles, routes file."}],[{"html":"<code>router</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Router defaults."}],[{"html":"<code>loading</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Loading component toggle."}],[{"html":"<code>events</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"EventManager toggle."}],[{"html":"<code>context</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"ContextManager toggle."}],[{"html":"<code>production</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Production toggles (if supported)."}],[{"html":"<code>server</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Server port/host for dev server."}],[{"html":"_(static assets)_"},{"html":"—"},{"html":"—"},{"html":"Put them under <code>src/public/</code> — served at the root URL. No config key; see below."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Enables the debug UI."}],[{"html":"<code>click</code>"},{"html":"<code>string</code>"},{"html":"<code>right</code>"},{"html":"Mouse button to open debugger."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>requestedStyles</code>"},{"html":"<code>string[]</code>"},{"html":"<code>[]</code>"},{"html":"Styles loaded from <code>paths.styles</code>."}]]
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
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Enables themes."}],[{"html":"<code>defaultTheme</code>"},{"html":"<code>string</code>"},{"html":"none"},{"html":"Theme to load if none saved."}],[{"html":"<code>saveThemeLocally</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Persists theme name and CSS in localStorage."}],[{"html":"<code>useBrowserTheme</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Uses browser prefers-color-scheme."}]]
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
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>true</code>"},{"html":"Master log toggle."}],[{"html":"<code>showLogs</code>"},{"html":"<code>object</code>"},{"html":"none"},{"html":"Per-level log filters."}],[{"html":"<code>ui</code>"},{"html":"<code>object</code>"},{"html":"none"},{"html":"UI panel configuration."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Enables the LogViewer debug panel."}],[{"html":"<code>shortcut</code>"},{"html":"<code>string</code>"},{"html":"none"},{"html":"Keyboard shortcut to toggle the panel (e.g. <code>alt+shift+l</code>)."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Required","Notes"],
               rows: [[{"html":"<code>components</code>"},{"html":"<code>object</code>"},{"html":"yes"},{"html":"Category -&gt; path/type map."}],[{"html":"<code>themes</code>"},{"html":"<code>string</code>"},{"html":"yes"},{"html":"Base path for theme CSS."}],[{"html":"<code>styles</code>"},{"html":"<code>string</code>"},{"html":"yes"},{"html":"Base path for shared styles."}],[{"html":"<code>routesFile</code>"},{"html":"<code>string</code>"},{"html":"yes"},{"html":"Module that exports routes array."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Notes"],
               rows: [[{"html":"<code>path</code>"},{"html":"<code>string</code>"},{"html":"Folder (relative to <code>src/</code>) where that category's components live."}],[{"html":"<code>type</code>"},{"html":"<code>Visual</code> or <code>Service</code>"},{"html":"How to load a component in this category."}],[{"html":"<code>description</code>"},{"html":"<code>string</code>"},{"html":"Optional short purpose. Used as a seed when the category <code>AGENTS.md</code> is created; the guide itself is the formal documentation."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "\"components\": {\n  \"AppComponents\": { \"path\": \"/Components/AppComponents\", \"type\": \"Visual\" },\n  \"Visual\":        { \"path\": \"/Components/Visual\",        \"type\": \"Visual\" },\n  \"Service\":       { \"path\": \"/Components/Service\",        \"type\": \"Service\" }\n}",
               language: "json"
            });
            if ("paths.components") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "paths.components";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>If a category's <code>path</code> or <code>type</code> is wrong, <code>slice.build()</code> returns <code>null</code> with a misleading \"component not found\" error. A <code>Service</code> folder marked <code>Visual</code> will fail trying to fetch a missing <code>.html</code>.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Creates dictionaries, <code>data-t</code> and <code>t.ref()</code> support at <code>slice.translator</code>. Off: <code>slice.t()</code> returns the key."}],[{"html":"<code>defaultLocale</code>"},{"html":"<code>string</code>"},{"html":"—"},{"html":"Required when enabled. The locale an unprefixed URL means."}],[{"html":"<code>fallbackLocale</code>"},{"html":"<code>string | null</code>"},{"html":"<code>null</code>"},{"html":"Consulted when the active locale has no key."}],[{"html":"<code>locales</code>"},{"html":"<code>string[]</code>"},{"html":"<code>[defaultLocale]</code>"},{"html":"Locales the app has; <code>setLocale()</code> refuses others."}],[{"html":"<code>path</code>"},{"html":"<code>string</code>"},{"html":"<code>/locales</code>"},{"html":"Where <code>&lt;path&gt;/&lt;locale&gt;.json</code> is served from (copied into <code>dist/</code> by the build)."}],[{"html":"<code>saveLocally</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Remember the choice in <code>localStorage</code>."}],[{"html":"<code>useBrowserLocale</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"First visit: use the browser's language when supported."}],[{"html":"<code>localePrefix</code>"},{"html":"<code>false | \"always\" | \"except-default\"</code>"},{"html":"<code>false</code>"},{"html":"Put the locale in the URL (<code>/es/pricing</code>; <code>except-default</code> leaves the default locale unprefixed)."}],[{"html":"<code>ui</code>"},{"html":"<code>object</code>"},{"html":"none"},{"html":"<code>{ \"enabled\": true, \"shortcut\": \"alt+shift+t\" }</code> opens the translator panel."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>defaultRoute</code>"},{"html":"<code>string</code>"},{"html":"<code>/</code>"},{"html":"Default route path."}],[{"html":"<code>updateTitles</code>"},{"html":"<code>boolean</code>"},{"html":"<code>true</code>"},{"html":"The router writes <code>document.title</code> and the description from each route's <code>metadata</code> on navigation. <code>false</code> leaves them alone."}],[{"html":"<code>titlePrefix</code>"},{"html":"<code>string</code>"},{"html":"<code>''</code>"},{"html":"Text before every route title. The separator is part of the string (<code>\"Acme · \"</code>)."}],[{"html":"<code>titleSuffix</code>"},{"html":"<code>string</code>"},{"html":"<code>''</code>"},{"html":"Text after every route title. The separator is part of the string (<code>\" · Acme\"</code>)."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>true</code>"},{"html":"Builds <code>Loading</code> component on init."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-17"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Enables EventManager at <code>slice.events</code>."}],[{"html":"<code>ui</code>"},{"html":"<code>object</code>"},{"html":"none"},{"html":"UI panel configuration."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-18"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Enables the Events debug panel."}],[{"html":"<code>shortcut</code>"},{"html":"<code>string</code>"},{"html":"none"},{"html":"Keyboard shortcut to toggle the panel (e.g. <code>alt+shift+e</code>)."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-19"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Enables ContextManager at <code>slice.context</code>."}],[{"html":"<code>ui</code>"},{"html":"<code>object</code>"},{"html":"none"},{"html":"UI panel configuration."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-20"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Enables the Contexts debug panel."}],[{"html":"<code>shortcut</code>"},{"html":"<code>string</code>"},{"html":"none"},{"html":"Keyboard shortcut to toggle the panel (e.g. <code>alt+shift+c</code>)."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-21"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>enabled</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"If supported, disables dev-only features."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-22"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Default","Notes"],
               rows: [[{"html":"<code>port</code>"},{"html":"<code>number</code>"},{"html":"<code>3001</code>"},{"html":"Dev server port fallback."}],[{"html":"<code>host</code>"},{"html":"<code>string</code>"},{"html":"<code>localhost</code>"},{"html":"Dev server host."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-23"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>All values exposed with <code>SLICE_PUBLIC_*</code> are public and readable by any user in the browser. Never place secrets, tokens, private keys, or credentials in these variables.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-24"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Pattern","Exposed in Browser","Example"],
               rows: [[{"html":"<code>SLICE_PUBLIC_*</code>"},{"html":"yes"},{"html":"<code>SLICE_PUBLIC_API_URL=https://api.example.com</code>"}],[{"html":"Any other key"},{"html":"no"},{"html":"<code>DB_PASSWORD=...</code>"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-25"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"mode\": \"production\",\n  \"env\": {\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\"\n  }\n}",
               language: "json"
            });
            if ("dist/slice-env.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "dist/slice-env.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-26"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Notes"],
               rows: [[{"html":"<code>mode</code>"},{"html":"<code>\"development\"</code> or <code>\"production\"</code>"},{"html":"Current runtime mode."}],[{"html":"<code>env</code>"},{"html":"<code>object</code>"},{"html":"Key/value map of browser-exposed <code>SLICE_PUBLIC_*</code> variables."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-27"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["API","Returns","Example"],
               rows: [[{"html":"<code>slice.getEnv(key, fallback)</code>"},{"html":"Value for a single <code>SLICE_PUBLIC_*</code> key, or <code>fallback</code> when missing."},{"html":"<code>slice.getEnv('SLICE_PUBLIC_API_URL', '')</code>"}],[{"html":"<code>slice.getPublicEnv()</code>"},{"html":"Full public env object currently loaded in runtime."},{"html":"<code>slice.getPublicEnv()</code>"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-28"]');
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
         const container = this.querySelector('[data-block-id="doc-block-29"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"debugger\": { \"enabled\": true, \"click\": \"right\" },\n  \"stylesManager\": { \"requestedStyles\": [\"sliceStyles\", \"DocumentationBase\"] },\n  \"themeManager\": {\n    \"enabled\": true,\n    \"defaultTheme\": \"Slice\",\n    \"saveThemeLocally\": true,\n    \"useBrowserTheme\": false\n  },\n  \"logger\": {\n    \"enabled\": true,\n    \"showLogs\": {\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\n    },\n    \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+l\" }\n  },\n  \"paths\": {\n    \"components\": {\n      \"AppComponents\": { \"path\": \"/Components/AppComponents\", \"type\": \"Visual\" },\n      \"Visual\": { \"path\": \"/Components/Visual\", \"type\": \"Visual\" },\n      \"Service\": { \"path\": \"/Components/Service\", \"type\": \"Service\" }\n    },\n    \"themes\": \"/Themes\",\n    \"styles\": \"/Styles\",\n    \"routesFile\": \"/routes.js\"\n  },\n  \"router\": { \"defaultRoute\": \"/\" },\n  \"loading\": { \"enabled\": true },\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\n  \"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-30"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>If <code>themeManager.enabled</code> is true and <code>defaultTheme</code> is missing, theme loading will fail.</p>";
            const callout = await slice.build('Callout', {
               tone: "warning",
               variant: "soft",
               title: "Warning",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
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

customElements.define('slice-sliceconfigdocumentation', SliceConfigDocumentation);
