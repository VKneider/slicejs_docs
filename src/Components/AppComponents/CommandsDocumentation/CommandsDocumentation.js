export default class CommandsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "cli-commands.md";
    this.markdownContent = "---\ntitle: Slice CLI\nroute: /Documentation/CLI\nnavLabel: CLI\nsection: Getting Started\ngroup: Tooling\norder: 15\ndescription: Command reference for the Slice.js CLI.\ncomponent: CommandsDocumentation\ntags: [cli, tooling]\n---\n\n# Slice.js CLI\n\n## Overview\nThe Slice.js CLI (`slice`) helps you initialize projects, manage components, run the dev server,\nand maintain your toolchain. For project workflows, prefer `package.json` scripts (`pnpm run ...`\nor `npm run ...`) so execution is pinned to your local dependency tree.\n\n## Installation\n```bash title=\"Local (recommended)\"\nnpm install slicejs-cli --save-dev\n```\n\n```bash title=\"Global (optional launcher install)\"\nnpm install -g slicejs-cli\n```\n\nWhen the `slice` launcher command is available (commonly after a global install\nthat places `slice` in your PATH), it delegates to the nearest\nproject-local `node_modules/slicejs-cli` from your current directory (including\nsubdirectories). This keeps command execution aligned with the version pinned\nin each project.\n\nIf the launcher command is unavailable, use:\n\n```bash\nnpx slicejs-cli <command>\n```\n\nYou can bypass delegation for a specific invocation:\n\n```bash\nSLICE_NO_LOCAL_DELEGATION=1 slice version\n```\n\n## Command Summary\n| Command | Alias | Purpose |\n| --- | --- | --- |\n| `slice init` | - | Initialize project structure and install Visual components. |\n| `slice dev` | - | Start development server. |\n| `slice build` | - | Build production output (bundles + dist). |\n| `slice build clean` | - | Remove generated bundles. |\n| `slice build info` | - | Show bundle configuration summary. |\n| `slice start` | - | Start production server. |\n| `slice component create` | `slice comp new` | Create a local component. |\n| `slice component list` | `slice comp ls` | List local components. |\n| `slice component delete` | `slice comp remove` | Delete a local component. |\n| `slice get` | `slice registry get` | Install components from registry. |\n| `slice browse` | `slice registry list` | List official registry components. |\n| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |\n| `slice docs` | - | Search and retrieve framework or Slice.js Components Markdown. |\n| `slice list` | - | Shortcut for `slice component list`. |\n| `slice version` | `slice v` | Show CLI version. |\n| `slice doctor` | `slice diagnose` | Run project diagnostics. |\n| `slice lint` | - | Run the project's ESLint (refreshes generated declarations first). |\n| `slice typecheck` | - | Type-check with the project's TypeScript (jsconfig.json). |\n| `slice setup lint` | - | Add ESLint + the shared config (and optionally TypeScript) to a project. |\n| `slice types generate` | - | Generate TypeScript typings for `slice.build`. |\n| `slice help` | `slice --help` | Show CLI help. |\n\n## `slice build` options\n| Flag | Purpose |\n| --- | --- |\n| `--strict-external` | Fail the build if a `node_modules` dependency cannot be resolved. See [External Dependencies](/Documentation/External-Dependencies). |\n| `--no-validate` | Skip the component prop validation described below. |\n| `--no-minify` | Disable minification (on by default). |\n| `--no-obfuscate` | Disable obfuscation (on by default). |\n| `--sourcemap` | Emit a `.map` next to each minified bundle (off by default so source isn't shipped unless asked). |\n| `--hash-filenames` | Add a content hash to bundle filenames (`slice-bundle.home.a1b2c3d4.js`) for immutable CDN caching. Off by default (stable names). |\n| `--compress` | Precompress `dist/` assets to `.gz` and max-quality `.br` (brotli). Off by default (brotli max is slow — use it for release builds). |\n| `--preview` | Start a preview server after building. |\n\n### Source maps, hashed filenames & precompression\n- **`--sourcemap`** maps each minified bundle back to its readable pre-minified form, so production stack traces are debuggable. Off by default (source isn't shipped unless you opt in).\n- **`--hash-filenames`** names bundles by content hash for `Cache-Control: immutable` CDN caching. The runtime loads every bundle by the filename recorded in the bundle config, so hashing \"just works\" with no other change.\n- **`--compress`** writes a `.gz` and a brotli `.br` beside every text asset in `dist/`. `slice start` serves the precompressed variant per the client's `Accept-Encoding` (brotli preferred), instead of compressing on every request — a ~900&nbsp;KB bundle ships as ~100&nbsp;KB over the wire.\n\n### Reproducible builds\nSet `SOURCE_DATE_EPOCH` (integer seconds since the Unix epoch) so the timestamps embedded in the bundle metadata/config are deterministic and a clean rebuild is byte-identical:\n\n```bash title=\"Reproducible build\"\nSOURCE_DATE_EPOCH=$(git log -1 --format=%ct) slice build\n```\n\nUnset, the current time is used.\n\n### Validation on build\nBefore bundling, `slice build` runs one validation pass over the project and **blocks** on anything that would ship a broken bundle:\n\n- `sliceConfig` combinations that build but misbehave (for example `context.enabled` with `events.enabled` off: ContextManager reactivity runs through EventManager, which is not bundled).\n- Component files that cannot be bundled: a syntax error, no `default export` while registered as a component, or an unresolved relative import.\n- A component registered in `components.js` whose file does not exist, or that points at a category with no `paths.components` entry, or whose category folder is missing. The runtime resolves `<Category>/<Name>/<Name>.js`, so none of those can load.\n- A reserved build directive (`id`, `sliceId`, `singleton`) declared in `static props`. The runtime strips it before setters run, so it is a silent no-op: pass it to `slice.build(name, { id })` instead.\n- `api/index.js` with a syntax error. The server entry is not part of the bundle, but the deploy fails on it all the same.\n- `src/routes.js` with a syntax error or an unresolved relative import. That file is served as-is and loaded by the browser (it is not bundled), so a broken import stops the router from loading even though the bundle builds.\n- Static props with an unknown `type`, a `schema` on a non-`object` prop, an `items` on a non-`array` prop, or `allowedValues` that don't match the declared `type`.\n\nAdvisories are printed but do not block: a `type: \"any\"`, a `required` prop without a default, a `slice.build()` of a name that is not registered, a component folder without its `<Name>.js`, a route whose `component` is not in `components.js` (it throws only when that route is visited), or a route written as `:id` instead of `${id}` (Slice only compiles `${…}` patterns, so a `:param` route is treated as a literal and never matches).\n\n`slice doctor` reports the exact same classification in its **Configuration** and **Components & Routes** rows, because both commands run the same pass and the same helper decides what is blocking. Skip the component checks with `--no-validate` (not recommended); the `sliceConfig` and `routes.js` rules always run. See [Static Props](/Documentation/Static-Props) for the prop schema.\n\nDoctor does not compile and does not boot the app: it cannot prove that esbuild resolves the whole graph, that `dist/` is complete, or that the server starts. Use it as a fast first gate, then `slice build`, then run the app.\n\n### Exit codes\n`slice build` exits 1 on a blocked build. `slice doctor` exits 1 when any row is a failure (it exits 0 when there are only warnings), so it can be used as a pre-deploy check: `slice doctor && slice build`.\n\n## Recommended package scripts\n\nUse these scripts inside initialized projects:\n\n```bash\npnpm run dev\npnpm run build\npnpm run start\npnpm run browse\npnpm run get -- Button\npnpm run sync\npnpm run component:create -- UserCard --category AppComponents\npnpm run component:list\npnpm run component:delete -- UserCard --category AppComponents --yes\npnpm run slice:types\n```\n\nEquivalent npm forms are the same with `npm run ...`.\n\nIf you prefer direct execution through local devDependencies, use `pnpm exec`:\n\n```bash\npnpm exec slice dev\npnpm exec slice get Button\n```\n\nIf the CLI is installed globally, you can run `slice ...` directly from PATH.\n\n## docs\n\n`slice docs` provides a read-only documentation interface for both documentation catalogs:\n\n- `framework` — framework, CLI, lifecycle, routing, and architecture documentation from `slicejs_docs`.\n- `components` — Visual and Service APIs and examples from Slice.js Components.\n\n```bash title=\"Search either catalog\"\nslice docs search \"service lifecycle\" --source framework\nslice docs search \"modal confirmation\" --source components\nslice docs search \"pagination\" --source all\n```\n\n```bash title=\"Retrieve authored Markdown\"\nslice docs get getting-started/services --source framework --stdout\nslice docs get Button --source components --stdout\n```\n\nUse `--json` for scripts and agents:\n\n```bash\nslice --no-version-check docs search \"table pagination\" --source components --json\nslice --no-version-check docs get Button --source components --json\n```\n\n`slice docs get` reads documentation only. It does not install component source files; use\n`slice get <Name>` when the component itself should be added to the project.\n\n### pnpm build-approval note\nWith pnpm v10+, lifecycle scripts are gated by `allowBuilds` in `pnpm-workspace.yaml`.\n`slice init --pm pnpm` automatically configures:\n\n```yaml\nallowBuilds:\n  slicejs-cli: true\n```\n\nFor existing projects that do not have that setting yet, use:\n\n```bash\npnpm approve-builds slicejs-cli\n```\n\nUse direct CLI commands (`slice ...` or `npx slicejs-cli ...`) mainly for bootstrapping (`init`) or\nwhen scripts are not yet configured.\n\n## init\nCreates a new project folder and initializes it with the framework structure and the starter\ncomponents from the official registry. Everything — `package.json`, `node_modules`, lockfile,\n`src/`, `api/` — is created **inside** the new folder.\n\n```bash title=\"Initialize a project\"\nnpx slicejs-cli init\n```\n\n```bash title=\"Non-interactive\"\nnpx slicejs-cli init my-app -y --pm pnpm\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `[name]` | `string` | `my-slice-app` | Project name (positional). |\n| `-y, --yes` | `boolean` | `false` | Skip interactive prompts. |\n| `--pm <pm>` | `pnpm \\| npm` | auto-detected | Package manager to use. When omitted, init detects it (user agent → available binaries) and only asks when ambiguous. |\n\nWhat it does:\n- Creates the project folder and a `package.json` inside it (before any install, so\n  dependencies always anchor to the project folder).\n- Pins the chosen package manager in the `packageManager` field; later commands\n  (`slice doctor`) detects it from there or from the lockfile.\n- Installs `slicejs-web-framework` (dependency) and `slicejs-cli` (devDependency)\n  with the chosen package manager. Versions are not hard-pinned, so pnpm\n  release-age policies (`minimumReleaseAge`) resolve cleanly.\n- Creates `api/` and `src/` structure from the framework base.\n- Installs the starter Visual and Service components from the registry.\n- Configures package scripts (dev, build, start, get, browse, sync, etc.).\n\n## dev\nStarts the development server and serves from `/src`.\n\n```bash title=\"Start dev server\"\nnpm run dev\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |\n| `--no-hmr` | `boolean` | `false` | Disable hot module reload (HMR is enabled by default). |\n\n### Behavior\n- Ensures `src/` and `api/` exist (otherwise suggests `slice init`).\n- Falls back to port+1 if the requested port is busy.\n- Uses `api/index.js` with `--development`.\n\n### Import support scope\n- Supported: relative imports, bare npm packages (`import 'pkg'`), and absolute imports whose file exists under `src/public/`.\n- `slice dev` and `slice build` keep the same rule for preserved absolute (`public/`) imports.\n- See [External Dependencies](/Documentation/External-Dependencies) for npm packages.\n\n## start\nStarts the production server and serves from `/dist`.\n\n```bash title=\"Start production server\"\nnpm run start\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |\n\n:::tip\nProduction serves static assets from `src/public/` (copied into `dist/`) at the root URL — e.g. `/Themes`, `/Styles`, `/images`.\n:::\n\n## build\nBuilds production output by analyzing dependencies, generating bundles, and writing files to `/dist`.\n\n:::tip\nProduction builds include **Structural framework components** in bundles to avoid runtime fetches.\nThese entries are stored as `Framework/Structural/<ComponentName>` in bundle config.\n:::\n\n```bash title=\"Build production output\"\nnpm run build\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-a, --analyze` | `boolean` | `false` | Analyze only, do not generate bundles. |\n| `-v, --verbose` | `boolean` | `false` | Output analysis metrics. |\n| `--no-minify` | `boolean` | `false` | Disable minification (enabled by default). |\n| `--no-obfuscate` | `boolean` | `false` | Disable obfuscation (enabled by default). |\n| `--preview` | `boolean` | `false` | Start preview server after build. |\n| `--serve` | `boolean` | `false` | Start preview server without building. |\n| `--skip-clean` | `boolean` | `false` | Skip cleaning dist before build. |\n\n### Subcommands\n| Command | Purpose |\n| --- | --- |\n| `slice build clean` | Remove generated bundle files and config. |\n| `slice build info` | Show bundle configuration summary. |\n\n### Import support scope\n- Supported: relative imports, bare npm packages (`import 'pkg'`), and absolute imports whose file exists under `src/public/`.\n- `slice dev` and `slice build` keep the same rule for preserved absolute (`public/`) imports.\n- See [External Dependencies](/Documentation/External-Dependencies) for npm packages.\n\n## component create\nCreates a new local component and registers it in `components.js`. Runs interactively, or\nnon-interactively when you pass the name and category on the command line.\n\n```bash title=\"Interactive (prompts for name + category)\"\nnpm run component:create\n```\n\n```bash title=\"Non-interactive (pass name + --category)\"\nnpm run component:create -- UserCard --category AppComponents\nnpm run component:create -- AuthService -c Service\n```\n\n```bash title=\"Through the npm script (note the -- separator)\"\nnpm run component:create -- UserCard --category Visual\n```\n\n| Argument / option | Notes |\n| --- | --- |\n| `[name]` | Component name (positional). If omitted, you are prompted. |\n| `-c, --category <category>` | A category from `paths.components` in `sliceConfig.json` (e.g. `Visual`, `Service`, `AppComponents`). If omitted, you are prompted. |\n\nOnly the missing pieces are prompted, so `npm run component:create -- UserCard` asks just for the\ncategory. Passing both runs with no prompts — useful for scripts and AI agents.\n\nRules:\n- Name must start with a letter and be alphanumeric.\n- Visual components get `.js`, `.html`, `.css`; Service components get `.js` only.\n- An invalid `--category` fails with a message listing the valid categories.\n\n## component list\nLists all local components by scanning category paths from `sliceConfig.json` and rewrites\n`src/Components/components.js`.\n\n```bash title=\"List components\"\nnpm run component:list\n```\n\n## component delete\nDeletes a local component and updates `components.js`. Interactive by default; pass the name,\n`--category`, and `--yes` to delete non-interactively.\n\n```bash title=\"Interactive (select + confirm)\"\nnpm run component:delete\n```\n\n```bash title=\"Non-interactive\"\nnpm run component:delete -- UserCard --category AppComponents --yes\n```\n\n| Argument / option | Notes |\n| --- | --- |\n| `[name]` | Component to delete. If omitted, you pick from a list. |\n| `-c, --category <category>` | Category to look in. If omitted, you are prompted. |\n| `-y, --yes` | Skip the confirmation prompt (required for a fully non-interactive run). |\n\n## get / registry get\nDownloads components from the official registry (Visual or Service) into your project.\n\n```bash title=\"Get components\"\nnpm run get -- Button Card Input\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-f, --force` | `boolean` | `false` | Overwrite existing components. |\n| `-s, --service` | `boolean` | `false` | Install as Service instead of Visual. |\n\nNotes:\n- If no names are provided, the CLI opens an interactive selector.\n- Registry is fetched from the Slice docs repo.\n\n## browse / registry list\nLists available registry components.\n\n```bash title=\"Browse registry\"\nnpm run browse\n```\n\n## sync / registry sync\nUpdates local Visual components to latest registry versions. Service components are detected but\nnot updated automatically.\n\n```bash title=\"Sync components\"\nnpm run sync\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-f, --force` | `boolean` | `false` | Skip confirmation and force update. |\n\n## doctor\nRuns project diagnostics (structure, config, SEO, dependencies, components and routes, the server\nentry, external imports, port availability) and exits 1 when any row is a failure, so it works as a\ngate. Rows marked as warnings are advisory and exit 0.\n\nThree rows cover what only a static check can see before a deploy:\n\n- **Configuration** validates `sliceConfig.json` against the framework's published\n  `sliceConfig.schema.json` (a string `port` is a pipe for `listen()`, a string `\"false\"` is truthy),\n  and applies the same combination rules as the build.\n- **Dependencies** warns when the declared `slicejs-web-framework` range rejects the installed\n  version, or when the installed CLI requires a different one — the `^3.5.0`-with-4.x case that\n  shipped a broken install.\n- **Server entry** parses `api/index.js`; the build never executes it, so a syntax error there used to\n  reach production as a 500.\n\nThe **Configuration** and **Components & Routes** rows use the same rules as `slice build`: if the\nbuild would be blocked, doctor fails too, with the same message.\n\n```bash title=\"Run diagnostics\"\nnpm run slice:doctor\n```\n\n## lint\nRuns the project's ESLint with the config it declares. The CLI does not bundle ESLint: install it in\nthe project (`npm i -D eslint`). `slice lint` is a thin wrapper so scripts and CI do not need to know the binary name.\n\n```bash title=\"Lint\"\nnpm exec slice lint\nnpm exec slice lint --fix\nnpm exec slice lint src/Components\nnpm exec slice lint --no-types        # skip the declaration refresh\n```\n\nBefore ESLint runs, `slice lint` regenerates the generated declarations (and `jsconfig.json`) when the\nproject uses them, so the editor and `slice typecheck` never read a stale `.d.ts`. `--no-types` skips\nthat phase. The command propagates ESLint's exit status.\n\nThe shared flat config ships with the CLI, so a project's config is one import:\n\n```js title=\"eslint.config.js\"\nimport slice from 'slicejs-cli/eslint-config.js';\n\nexport default [\n  ...slice,\n  // App-specific globals go last, by design.\n  { languageOptions: { globals: { ToastProvider: 'writable' } } },\n];\n```\n\nIt provides the browser environment plus the `slice`/`Slice` globals **only for `src/`**, Node globals for\n`api/`, `scripts/` and `*.config.js`, `js.configs.recommended`, a set of rules that warn rather\nthan block, ignores for generated and vendored output (`dist/`, `components.js`, `*.generated.js`,\n`.agents/`, `.claude/`), and a Node/browser override for `*.spec.js` and `tests/`. Tooling that runs in Node\nimports `nodeConfig` instead:\n\n```js title=\"eslint.config.js (tooling)\"\nimport { nodeConfig } from 'slicejs-cli/eslint-config.js';\nexport default nodeConfig;\n```\n\nA folder that deliberately mixes both worlds (a build script driving a headless browser, docs templates\nthat are browser components) opts into the other globals with the exported presets:\n\n```js title=\"eslint.config.js (mixed folder)\"\nimport slice, { nodeGlobals, sliceGlobals } from 'slicejs-cli/eslint-config.js';\n\nexport default [\n  ...slice,\n  { files: ['scripts/og/**'], languageOptions: { globals: { ...nodeGlobals, ...sliceGlobals } } },\n];\n```\n\nLint is for style and environment mistakes. Framework invariants — a component that cannot load, a\nbroken route, a reserved prop, a prop the build rejects — are `slice build` / `slice doctor` rules and\nare not duplicated here, so the two can never drift.\n\n### Setting it up in an existing project\n`slice setup lint` installs `eslint` and `slicejs-cli` as devDependencies when they are missing,\nwrites `eslint.config.js` if the project has none, and adds `lint` / `lint:fix` scripts. It never\noverwrites a config or a script you already have, and `--dry-run` prints the plan without touching\nanything. `--with-types` also installs `typescript`, adds a `typecheck` script, generates the\ndeclarations and writes `jsconfig.json`.\n\n```bash\nnpm exec slice setup lint\nnpm exec slice setup lint --dry-run\nnpm exec slice setup lint --with-types\n```\n\n`slice init` does not install ESLint: the linter is a choice, and choosing it later is one command.\n\n## typecheck\nRuns the project's own TypeScript over the JS components with `tsc --noEmit`, using the `jsconfig.json`\nthat `slice types generate` maintains (`allowJs` + `checkJs`). It refreshes the generated declarations\nfirst (unless `--no-types`), then compares the code against them.\n\n```bash title=\"Type check\"\nnpm exec slice typecheck\nnpm exec slice typecheck --no-types\nnpm exec slice typecheck -p tsconfig.json\n```\n\nThe scope is the generated declarations plus the components and app entry that use them\n(`src/Components/**/*.js`, `src/App/**/*.js`, `src/routes.js` and `src/**/*.d.ts`, minus the\npublic/vendored folders) — not every file in the project. That keeps `tsc` fast; broad `src/**/*.js`\nor `api/**/*.js` includes are dropped from `jsconfig.json` when it is maintained. Registered events\nare typed, so `slice.events.emit`/`subscribe` reject a payload that does not match the catalog.\nThe exit code is `tsc`'s.\n\nThe two commands split the job: `slice lint` is the fast check editors run on save; `slice typecheck`\nis the compiler step for CI. Run it before `slice build`.\n\n## seo\n\n### seo sitemap\nWrites `src/public/sitemap.xml` from `seo.json`, and `robots.txt` when the manifest has a `robotsTxt`\nblock. Only indexable routes are listed; a `${param}` route cannot be enumerated and never appears.\n\n```bash title=\"Generate the sitemap\"\nnpm exec slice seo sitemap\n```\n\n| Option | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `--dry-run` | `boolean` | `false` | Reports what would change, writes nothing. |\n| `--yes` | `boolean` | `false` | Overwrites an existing file without asking. |\n\nAn existing file that would change asks first (default answer: no). A non-interactive run (CI) fails\nwith a message naming `--yes` instead of waiting for input, and a file whose content is unchanged is\nnever rewritten.\n\n### seo images\nRenders the 1200×630 card each indexable route advertises, from the real page. It boots the app's\n`api/index.js` in development on a free port unless you pass `--base-url`.\n\n```bash title=\"Generate the cards\"\nnpm exec slice seo images\nnpm exec slice seo images --only=/pricing\nnpm exec slice seo images --check\n```\n\n| Option | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `--only <routes>` | `string` | every indexable route | Comma-separated paths. |\n| `--base-url <url>` | `string` | boots the app | Use a running server instead. |\n| `--selector <css>` | `string` | the viewport | The element to capture (a component demo, a card…). |\n| `--out <dir>` | `string` | `src/public/og` | Where the images and the manifest go. |\n| `--check` | `boolean` | `false` | Validate dimensions and weight, no browser. |\n| `--dry-run` | `boolean` | `false` | Capture and compose, write nothing. |\n| `--runner <file>` | `string` | — | Module exporting `prepare(page, route)` / `capture`, for pages behind auth. |\n| `--storage-state <file>` | `string` | — | Playwright storage state for a logged-in capture. |\n\nIt needs Playwright in the project (`npm i -D playwright && npx playwright install chromium`). The\ncommand writes `<outDir>/manifest.json`, which you pass as `seo.images` so the server merges the cards;\n`seo.json` itself is never edited (it is generated). Defaults for the card — `theme`, `selector`,\n`template`, `outDir`, `budgetKB` — live in the `images` block of `seo.json`.\n\n### seo check\nValidates `seo.json`, cross-checks it against `routes.js`, and compares the committed sitemap with\nwhat the manifest would produce. Exits non-zero on any problem, so it belongs in CI.\n\n```bash title=\"Validate before deploying\"\nnpm exec slice seo check\n```\n\nSee [SEO and Share Cards](/Documentation/Architecture/SEO) for the manifest fields and the origin\nrules.\n\n## translator\n\n### translator init\nAdds the `translator` block to `src/sliceConfig.json` and creates `src/locales/<locale>.json`. It\nnever overwrites an existing dictionary or an existing value, so it is safe to re-run.\n\n```bash title=\"Start a translated app\"\nnpm exec slice translator init --locales es,en --default es\n```\n\n| Option | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `--locales <list>` | `string` | `en` | Comma-separated locales; the default locale is added. |\n| `--default <locale>` | `string` | the first locale | Locale an unprefixed URL means. |\n| `--path <path>` | `string` | `/locales` | Where `<path>/<locale>.json` is served from. |\n| `--dry-run` | `boolean` | `false` | Reports what would change, writes nothing. |\n\n### translator check\nScans every `.html` and `.js` under `src/`, reusing the framework's `data-t` rules (text,\n`key.ariaLabel`-style attributes, `data-t-*` params) plus `slice.t()`, `slice.translator.ref()` and\n`tr()` calls. Fails when a key is missing in a locale, when a plural has no `other`, and reports\nparameter drift and raw `href=\"/…\"` links under `routing`.\n\n```bash title=\"Gate a translated app\"\nnpm exec slice translator check\nnpm exec slice translator check --unused\n```\n\n`slice doctor` has a **Translator** row that runs the same scan. See\n[Translating an app](/Documentation/Translator).\n\n## version\nShows CLI version info and checks for updates.\n\n```bash title=\"Version\"\nnpm run slice:version\n```\n\n## help\nShows CLI help output.\n\n```bash title=\"Help\"\nnpm run slice:help\n```\n\n## types generate\nGenerates a TypeScript declaration file from your components' `static props`, so editors can\nautocomplete and type-check `slice.build('Name', { ... })` calls.\n\n```bash title=\"Generate typings\"\nnpm run slice:types\n```\n\n```bash title=\"Custom output path\"\nnpm run slice:types -- --output types/slice-build.d.ts\n```\n\n| Option | Default | Notes |\n| --- | --- | --- |\n| `-o, --output <path>` | `src/slice-build.generated.d.ts` | Where to write the generated `.d.ts`. |\n\nRe-run it whenever you add or change component props. The output is generated — don't edit it by\nhand, and re-generate (or wire it into your build) to keep autocomplete in sync.\n\nIt also writes the event manifest (`src/slice-events.generated.js`), creates `jsconfig.json` when the\nproject has none, and keeps that config pointed at the generated declarations. `slice lint` and\n`slice typecheck` run this refresh for you before they work.\n\n## Best Practices\n:::tip\nPrefer package scripts (`pnpm run ...` / `npm run ...`) for project commands.\n:::\n\n:::tip\nUse `npx slicejs-cli <command>` for bootstrapping and recovery (for example before scripts exist).\n:::\n\n:::tip\nRun `npm run dev` in one terminal and use another for component commands.\n:::\n\n## Gotchas\n:::warning\n`npm run sync` only updates Visual components. Use `npm run get -- <Service> --service --force` for Service updates.\n:::\n\n:::warning\n`npm run component:list` rewrites `src/Components/components.js` based on detected folders.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm install slicejs-cli --save-dev",
               language: "bash"
            });
            if ("Local (recommended)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Local (recommended)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm install -g slicejs-cli",
               language: "bash"
            });
            if ("Global (optional launcher install)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Global (optional launcher install)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx slicejs-cli <command>",
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
               value: "SLICE_NO_LOCAL_DELEGATION=1 slice version",
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
            const lines = ["| Command | Alias | Purpose |","| --- | --- | --- |","| `slice init` | - | Initialize project structure and install Visual components. |","| `slice dev` | - | Start development server. |","| `slice build` | - | Build production output (bundles + dist). |","| `slice build clean` | - | Remove generated bundles. |","| `slice build info` | - | Show bundle configuration summary. |","| `slice start` | - | Start production server. |","| `slice component create` | `slice comp new` | Create a local component. |","| `slice component list` | `slice comp ls` | List local components. |","| `slice component delete` | `slice comp remove` | Delete a local component. |","| `slice get` | `slice registry get` | Install components from registry. |","| `slice browse` | `slice registry list` | List official registry components. |","| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |","| `slice docs` | - | Search and retrieve framework or Slice.js Components Markdown. |","| `slice list` | - | Shortcut for `slice component list`. |","| `slice version` | `slice v` | Show CLI version. |","| `slice doctor` | `slice diagnose` | Run project diagnostics. |","| `slice lint` | - | Run the project's ESLint (refreshes generated declarations first). |","| `slice typecheck` | - | Type-check with the project's TypeScript (jsconfig.json). |","| `slice setup lint` | - | Add ESLint + the shared config (and optionally TypeScript) to a project. |","| `slice types generate` | - | Generate TypeScript typings for `slice.build`. |","| `slice help` | `slice --help` | Show CLI help. |"];
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
            const lines = ["| Flag | Purpose |","| --- | --- |","| `--strict-external` | Fail the build if a `node_modules` dependency cannot be resolved. See [External Dependencies](/Documentation/External-Dependencies). |","| `--no-validate` | Skip the component prop validation described below. |","| `--no-minify` | Disable minification (on by default). |","| `--no-obfuscate` | Disable obfuscation (on by default). |","| `--sourcemap` | Emit a `.map` next to each minified bundle (off by default so source isn't shipped unless asked). |","| `--hash-filenames` | Add a content hash to bundle filenames (`slice-bundle.home.a1b2c3d4.js`) for immutable CDN caching. Off by default (stable names). |","| `--compress` | Precompress `dist/` assets to `.gz` and max-quality `.br` (brotli). Off by default (brotli max is slow — use it for release builds). |","| `--preview` | Start a preview server after building. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "SOURCE_DATE_EPOCH=$(git log -1 --format=%ct) slice build",
               language: "bash"
            });
            if ("Reproducible build") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Reproducible build";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "pnpm run dev\npnpm run build\npnpm run start\npnpm run browse\npnpm run get -- Button\npnpm run sync\npnpm run component:create -- UserCard --category AppComponents\npnpm run component:list\npnpm run component:delete -- UserCard --category AppComponents --yes\npnpm run slice:types",
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "pnpm exec slice dev\npnpm exec slice get Button",
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice docs search \"service lifecycle\" --source framework\nslice docs search \"modal confirmation\" --source components\nslice docs search \"pagination\" --source all",
               language: "bash"
            });
            if ("Search either catalog") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Search either catalog";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice docs get getting-started/services --source framework --stdout\nslice docs get Button --source components --stdout",
               language: "bash"
            });
            if ("Retrieve authored Markdown") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Retrieve authored Markdown";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice --no-version-check docs search \"table pagination\" --source components --json\nslice --no-version-check docs get Button --source components --json",
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "allowBuilds:\n  slicejs-cli: true",
               language: "yaml"
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
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "pnpm approve-builds slicejs-cli",
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
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx slicejs-cli init",
               language: "bash"
            });
            if ("Initialize a project") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Initialize a project";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx slicejs-cli init my-app -y --pm pnpm",
               language: "bash"
            });
            if ("Non-interactive") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Non-interactive";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-17"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `[name]` | `string` | `my-slice-app` | Project name (positional). |","| `-y, --yes` | `boolean` | `false` | Skip interactive prompts. |","| `--pm <pm>` | `pnpm \\| npm` | auto-detected | Package manager to use. When omitted, init detects it (user agent → available binaries) and only asks when ambiguous. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-18"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run dev",
               language: "bash"
            });
            if ("Start dev server") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Start dev server";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-19"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |","| `--no-hmr` | `boolean` | `false` | Disable hot module reload (HMR is enabled by default). |"];
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
         const container = this.querySelector('[data-block-id="doc-block-20"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run start",
               language: "bash"
            });
            if ("Start production server") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Start production server";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-21"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-22"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run build",
               language: "bash"
            });
            if ("Build production output") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Build production output";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-23"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-a, --analyze` | `boolean` | `false` | Analyze only, do not generate bundles. |","| `-v, --verbose` | `boolean` | `false` | Output analysis metrics. |","| `--no-minify` | `boolean` | `false` | Disable minification (enabled by default). |","| `--no-obfuscate` | `boolean` | `false` | Disable obfuscation (enabled by default). |","| `--preview` | `boolean` | `false` | Start preview server after build. |","| `--serve` | `boolean` | `false` | Start preview server without building. |","| `--skip-clean` | `boolean` | `false` | Skip cleaning dist before build. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-24"]');
         if (container) {
            const lines = ["| Command | Purpose |","| --- | --- |","| `slice build clean` | Remove generated bundle files and config. |","| `slice build info` | Show bundle configuration summary. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-25"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:create",
               language: "bash"
            });
            if ("Interactive (prompts for name + category)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Interactive (prompts for name + category)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-26"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:create -- UserCard --category AppComponents\nnpm run component:create -- AuthService -c Service",
               language: "bash"
            });
            if ("Non-interactive (pass name + --category)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Non-interactive (pass name + --category)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-27"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:create -- UserCard --category Visual",
               language: "bash"
            });
            if ("Through the npm script (note the -- separator)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Through the npm script (note the -- separator)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-28"]');
         if (container) {
            const lines = ["| Argument / option | Notes |","| --- | --- |","| `[name]` | Component name (positional). If omitted, you are prompted. |","| `-c, --category <category>` | A category from `paths.components` in `sliceConfig.json` (e.g. `Visual`, `Service`, `AppComponents`). If omitted, you are prompted. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-29"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:list",
               language: "bash"
            });
            if ("List components") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "List components";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-30"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:delete",
               language: "bash"
            });
            if ("Interactive (select + confirm)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Interactive (select + confirm)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-31"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:delete -- UserCard --category AppComponents --yes",
               language: "bash"
            });
            if ("Non-interactive") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Non-interactive";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-32"]');
         if (container) {
            const lines = ["| Argument / option | Notes |","| --- | --- |","| `[name]` | Component to delete. If omitted, you pick from a list. |","| `-c, --category <category>` | Category to look in. If omitted, you are prompted. |","| `-y, --yes` | Skip the confirmation prompt (required for a fully non-interactive run). |"];
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
         const container = this.querySelector('[data-block-id="doc-block-33"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run get -- Button Card Input",
               language: "bash"
            });
            if ("Get components") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Get components";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-34"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-f, --force` | `boolean` | `false` | Overwrite existing components. |","| `-s, --service` | `boolean` | `false` | Install as Service instead of Visual. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-35"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run browse",
               language: "bash"
            });
            if ("Browse registry") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Browse registry";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-36"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run sync",
               language: "bash"
            });
            if ("Sync components") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Sync components";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-37"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-f, --force` | `boolean` | `false` | Skip confirmation and force update. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-38"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:doctor",
               language: "bash"
            });
            if ("Run diagnostics") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Run diagnostics";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-39"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm exec slice lint\nnpm exec slice lint --fix\nnpm exec slice lint src/Components\nnpm exec slice lint --no-types        # skip the declaration refresh",
               language: "bash"
            });
            if ("Lint") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Lint";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-40"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import slice from 'slicejs-cli/eslint-config.js';\n\nexport default [\n  ...slice,\n  // App-specific globals go last, by design.\n  { languageOptions: { globals: { ToastProvider: 'writable' } } },\n];",
               language: "js"
            });
            if ("eslint.config.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "eslint.config.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-41"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import { nodeConfig } from 'slicejs-cli/eslint-config.js';\nexport default nodeConfig;",
               language: "js"
            });
            if ("eslint.config.js (tooling)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "eslint.config.js (tooling)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-42"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import slice, { nodeGlobals, sliceGlobals } from 'slicejs-cli/eslint-config.js';\n\nexport default [\n  ...slice,\n  { files: ['scripts/og/**'], languageOptions: { globals: { ...nodeGlobals, ...sliceGlobals } } },\n];",
               language: "js"
            });
            if ("eslint.config.js (mixed folder)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "eslint.config.js (mixed folder)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-43"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm exec slice setup lint\nnpm exec slice setup lint --dry-run\nnpm exec slice setup lint --with-types",
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
         const container = this.querySelector('[data-block-id="doc-block-44"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm exec slice typecheck\nnpm exec slice typecheck --no-types\nnpm exec slice typecheck -p tsconfig.json",
               language: "bash"
            });
            if ("Type check") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Type check";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-45"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm exec slice seo sitemap",
               language: "bash"
            });
            if ("Generate the sitemap") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Generate the sitemap";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-46"]');
         if (container) {
            const lines = ["| Option | Type | Default | Notes |","| --- | --- | --- | --- |","| `--dry-run` | `boolean` | `false` | Reports what would change, writes nothing. |","| `--yes` | `boolean` | `false` | Overwrites an existing file without asking. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-47"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm exec slice seo images\nnpm exec slice seo images --only=/pricing\nnpm exec slice seo images --check",
               language: "bash"
            });
            if ("Generate the cards") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Generate the cards";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-48"]');
         if (container) {
            const lines = ["| Option | Type | Default | Notes |","| --- | --- | --- | --- |","| `--only <routes>` | `string` | every indexable route | Comma-separated paths. |","| `--base-url <url>` | `string` | boots the app | Use a running server instead. |","| `--selector <css>` | `string` | the viewport | The element to capture (a component demo, a card…). |","| `--out <dir>` | `string` | `src/public/og` | Where the images and the manifest go. |","| `--check` | `boolean` | `false` | Validate dimensions and weight, no browser. |","| `--dry-run` | `boolean` | `false` | Capture and compose, write nothing. |","| `--runner <file>` | `string` | — | Module exporting `prepare(page, route)` / `capture`, for pages behind auth. |","| `--storage-state <file>` | `string` | — | Playwright storage state for a logged-in capture. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-49"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm exec slice seo check",
               language: "bash"
            });
            if ("Validate before deploying") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Validate before deploying";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-50"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm exec slice translator init --locales es,en --default es",
               language: "bash"
            });
            if ("Start a translated app") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Start a translated app";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-51"]');
         if (container) {
            const lines = ["| Option | Type | Default | Notes |","| --- | --- | --- | --- |","| `--locales <list>` | `string` | `en` | Comma-separated locales; the default locale is added. |","| `--default <locale>` | `string` | the first locale | Locale an unprefixed URL means. |","| `--path <path>` | `string` | `/locales` | Where `<path>/<locale>.json` is served from. |","| `--dry-run` | `boolean` | `false` | Reports what would change, writes nothing. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-52"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm exec slice translator check\nnpm exec slice translator check --unused",
               language: "bash"
            });
            if ("Gate a translated app") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Gate a translated app";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-53"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:version",
               language: "bash"
            });
            if ("Version") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Version";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-54"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:help",
               language: "bash"
            });
            if ("Help") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Help";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-55"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:types",
               language: "bash"
            });
            if ("Generate typings") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Generate typings";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-56"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:types -- --output types/slice-build.d.ts",
               language: "bash"
            });
            if ("Custom output path") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Custom output path";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-57"]');
         if (container) {
            const lines = ["| Option | Default | Notes |","| --- | --- | --- |","| `-o, --output <path>` | `src/slice-build.generated.d.ts` | Where to write the generated `.d.ts`. |"];
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

customElements.define('slice-commandsdocumentation', CommandsDocumentation);
