export default class CommandsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "cli-commands.md";
    this.markdownContent = "---\r\ntitle: Slice CLI\r\nroute: /Documentation/CLI\r\nnavLabel: CLI\r\nsection: Getting Started\r\ngroup: Tooling\r\norder: 15\r\ndescription: Command reference for the Slice.js CLI.\r\ncomponent: CommandsDocumentation\r\ntags: [cli, tooling]\r\n---\r\n\r\n# Slice.js CLI\r\n\r\n## Overview\r\nThe Slice.js CLI (`slice`) helps you initialize projects, manage components, run the dev server,\r\nand maintain your toolchain. For project workflows, prefer `package.json` scripts (`pnpm run ...`\r\nor `npm run ...`) so execution is pinned to your local dependency tree.\r\n\r\n## Installation\r\n```bash title=\"Local (recommended)\"\r\nnpm install slicejs-cli --save-dev\r\n```\r\n\r\n```bash title=\"Global (optional launcher install)\"\r\nnpm install -g slicejs-cli\r\n```\r\n\r\nWhen the `slice` launcher command is available (commonly after a global install\r\nthat places `slice` in your PATH), it delegates to the nearest\r\nproject-local `node_modules/slicejs-cli` from your current directory (including\r\nsubdirectories). This keeps command execution aligned with the version pinned\r\nin each project.\r\n\r\nIf the launcher command is unavailable, use:\r\n\r\n```bash\r\nnpx slicejs-cli <command>\r\n```\r\n\r\nYou can bypass delegation for a specific invocation:\r\n\r\n```bash\r\nSLICE_NO_LOCAL_DELEGATION=1 slice version\r\n```\r\n\r\n## Command Summary\r\n| Command | Alias | Purpose |\r\n| --- | --- | --- |\r\n| `slice init` | - | Initialize project structure and install Visual components. |\r\n| `slice dev` | - | Start development server. |\r\n| `slice build` | - | Build production output (bundles + dist). |\r\n| `slice build clean` | - | Remove generated bundles. |\r\n| `slice build info` | - | Show bundle configuration summary. |\r\n| `slice start` | - | Start production server. |\r\n| `slice component create` | `slice comp new` | Create a local component. |\r\n| `slice component list` | `slice comp ls` | List local components. |\r\n| `slice component delete` | `slice comp remove` | Delete a local component. |\r\n| `slice get` | `slice registry get` | Install components from registry. |\r\n| `slice browse` | `slice registry list` | List official registry components. |\r\n| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |\r\n| `slice list` | - | Shortcut for `slice component list`. |\r\n| `slice version` | `slice v` | Show CLI version. |\r\n| `slice doctor` | `slice diagnose` | Run project diagnostics. |\r\n| `slice types generate` | - | Generate TypeScript typings for `slice.build`. |\r\n| `slice help` | `slice --help` | Show CLI help. |\r\n\r\n## Recommended package scripts\r\n\r\nUse these scripts inside initialized projects:\r\n\r\n```bash\r\npnpm run dev\r\npnpm run build\r\npnpm run start\r\npnpm run browse\r\npnpm run get -- Button\r\npnpm run sync\r\npnpm run component:create -- UserCard --category AppComponents\r\npnpm run component:list\r\npnpm run component:delete -- UserCard --category AppComponents --yes\r\npnpm run slice:types\r\n```\r\n\r\nEquivalent npm forms are the same with `npm run ...`.\r\n\r\nIf you prefer direct execution through local devDependencies, use `pnpm exec`:\r\n\r\n```bash\r\npnpm exec slice dev\r\npnpm exec slice get Button\r\n```\r\n\r\nIf the CLI is installed globally, you can run `slice ...` directly from PATH.\r\n\r\n### pnpm build-approval note\r\nWith pnpm v10+, lifecycle scripts are gated by `allowBuilds` in `pnpm-workspace.yaml`.\r\n`slice init --pm pnpm` automatically configures:\r\n\r\n```yaml\r\nallowBuilds:\r\n  slicejs-cli: true\r\n```\r\n\r\nFor existing projects that do not have that setting yet, use:\r\n\r\n```bash\r\npnpm approve-builds slicejs-cli\r\n```\r\n\r\nUse direct CLI commands (`slice ...` or `npx slicejs-cli ...`) mainly for bootstrapping (`init`) or\r\nwhen scripts are not yet configured.\r\n\r\n## init\r\nCreates a new project folder and initializes it with the framework structure and the starter\r\ncomponents from the official registry. Everything — `package.json`, `node_modules`, lockfile,\r\n`src/`, `api/` — is created **inside** the new folder.\r\n\r\n```bash title=\"Initialize a project\"\r\nnpx slicejs-cli init\r\n```\r\n\r\n```bash title=\"Non-interactive\"\r\nnpx slicejs-cli init my-app -y --pm pnpm\r\n```\r\n\r\n### Options\r\n| Flag | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `[name]` | `string` | `my-slice-app` | Project name (positional). |\r\n| `-y, --yes` | `boolean` | `false` | Skip interactive prompts. |\r\n| `--pm <pm>` | `pnpm \\| npm` | auto-detected | Package manager to use. When omitted, init detects it (user agent → available binaries) and only asks when ambiguous. |\r\n\r\nWhat it does:\r\n- Creates the project folder and a `package.json` inside it (before any install, so\r\n  dependencies always anchor to the project folder).\r\n- Pins the chosen package manager in the `packageManager` field; later commands\r\n  (`slice doctor`) detects it from there or from the lockfile.\r\n- Installs `slicejs-web-framework` (dependency) and `slicejs-cli` (devDependency)\r\n  with the chosen package manager. Versions are not hard-pinned, so pnpm\r\n  release-age policies (`minimumReleaseAge`) resolve cleanly.\r\n- Creates `api/` and `src/` structure from the framework base.\r\n- Installs the starter Visual and Service components from the registry.\r\n- Configures package scripts (dev, build, start, get, browse, sync, etc.).\r\n\r\n## dev\r\nStarts the development server and serves from `/src`.\r\n\r\n```bash title=\"Start dev server\"\r\nnpm run dev\r\n```\r\n\r\n### Options\r\n| Flag | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |\r\n| `--no-hmr` | `boolean` | `false` | Disable hot module reload (HMR is enabled by default). |\r\n\r\n### Behavior\r\n- Ensures `src/` and `api/` exist (otherwise suggests `slice init`).\r\n- Falls back to port+1 if the requested port is busy.\r\n- Uses `api/index.js` with `--development`.\r\n\r\n### Import support scope\r\n- Supported: relative imports and absolute imports that resolve into folders listed in `publicFolders`.\r\n- Unsupported: bare package imports such as `import 'pkg'`.\r\n- `slice dev` and `slice build` keep the same rule for preserved absolute imports that target configured public folders.\r\n\r\n## start\r\nStarts the production server and serves from `/dist`.\r\n\r\n```bash title=\"Start production server\"\r\nnpm run start\r\n```\r\n\r\n### Options\r\n| Flag | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |\r\n\r\n:::tip\r\nProduction uses `publicFolders` from `sliceConfig.json` to expose public asset folders\r\nlike `/Themes`, `/Styles`, and `/assets`.\r\n:::\r\n\r\n## build\r\nBuilds production output by analyzing dependencies, generating bundles, and writing files to `/dist`.\r\n\r\n:::tip\r\nProduction builds include **Structural framework components** in bundles to avoid runtime fetches.\r\nThese entries are stored as `Framework/Structural/<ComponentName>` in bundle config.\r\n:::\r\n\r\n```bash title=\"Build production output\"\r\nnpm run build\r\n```\r\n\r\n### Options\r\n| Flag | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `-a, --analyze` | `boolean` | `false` | Analyze only, do not generate bundles. |\r\n| `-v, --verbose` | `boolean` | `false` | Output analysis metrics. |\r\n| `--no-minify` | `boolean` | `false` | Disable minification (enabled by default). |\r\n| `--no-obfuscate` | `boolean` | `false` | Disable obfuscation (enabled by default). |\r\n| `--preview` | `boolean` | `false` | Start preview server after build. |\r\n| `--serve` | `boolean` | `false` | Start preview server without building. |\r\n| `--skip-clean` | `boolean` | `false` | Skip cleaning dist before build. |\r\n\r\n### Subcommands\r\n| Command | Purpose |\r\n| --- | --- |\r\n| `slice build clean` | Remove generated bundle files and config. |\r\n| `slice build info` | Show bundle configuration summary. |\r\n\r\n### Import support scope\r\n- Supported: relative imports and absolute imports that resolve into folders listed in `publicFolders`.\r\n- Unsupported: bare package imports such as `import 'pkg'`.\r\n- Production preserves supported absolute public-folder imports with the same behavior as development.\r\n\r\n## component create\r\nCreates a new local component and registers it in `components.js`. Runs interactively, or\r\nnon-interactively when you pass the name and category on the command line.\r\n\r\n```bash title=\"Interactive (prompts for name + category)\"\r\nnpm run component:create\r\n```\r\n\r\n```bash title=\"Non-interactive (pass name + --category)\"\r\nnpm run component:create -- UserCard --category AppComponents\r\nnpm run component:create -- AuthService -c Service\r\n```\r\n\r\n```bash title=\"Through the npm script (note the -- separator)\"\r\nnpm run component:create -- UserCard --category Visual\r\n```\r\n\r\n| Argument / option | Notes |\r\n| --- | --- |\r\n| `[name]` | Component name (positional). If omitted, you are prompted. |\r\n| `-c, --category <category>` | A category from `paths.components` in `sliceConfig.json` (e.g. `Visual`, `Service`, `AppComponents`). If omitted, you are prompted. |\r\n\r\nOnly the missing pieces are prompted, so `npm run component:create -- UserCard` asks just for the\r\ncategory. Passing both runs with no prompts — useful for scripts and AI agents.\r\n\r\nRules:\r\n- Name must start with a letter and be alphanumeric.\r\n- Visual components get `.js`, `.html`, `.css`; Service components get `.js` only.\r\n- An invalid `--category` fails with a message listing the valid categories.\r\n\r\n## component list\r\nLists all local components by scanning category paths from `sliceConfig.json` and rewrites\r\n`src/Components/components.js`.\r\n\r\n```bash title=\"List components\"\r\nnpm run component:list\r\n```\r\n\r\n## component delete\r\nDeletes a local component and updates `components.js`. Interactive by default; pass the name,\r\n`--category`, and `--yes` to delete non-interactively.\r\n\r\n```bash title=\"Interactive (select + confirm)\"\r\nnpm run component:delete\r\n```\r\n\r\n```bash title=\"Non-interactive\"\r\nnpm run component:delete -- UserCard --category AppComponents --yes\r\n```\r\n\r\n| Argument / option | Notes |\r\n| --- | --- |\r\n| `[name]` | Component to delete. If omitted, you pick from a list. |\r\n| `-c, --category <category>` | Category to look in. If omitted, you are prompted. |\r\n| `-y, --yes` | Skip the confirmation prompt (required for a fully non-interactive run). |\r\n\r\n## get / registry get\r\nDownloads components from the official registry (Visual or Service) into your project.\r\n\r\n```bash title=\"Get components\"\r\nnpm run get -- Button Card Input\r\n```\r\n\r\n### Options\r\n| Flag | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `-f, --force` | `boolean` | `false` | Overwrite existing components. |\r\n| `-s, --service` | `boolean` | `false` | Install as Service instead of Visual. |\r\n\r\nNotes:\r\n- If no names are provided, the CLI opens an interactive selector.\r\n- Registry is fetched from the Slice docs repo.\r\n\r\n## browse / registry list\r\nLists available registry components.\r\n\r\n```bash title=\"Browse registry\"\r\nnpm run browse\r\n```\r\n\r\n## sync / registry sync\r\nUpdates local Visual components to latest registry versions. Service components are detected but\r\nnot updated automatically.\r\n\r\n```bash title=\"Sync components\"\r\nnpm run sync\r\n```\r\n\r\n### Options\r\n| Flag | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `-f, --force` | `boolean` | `false` | Skip confirmation and force update. |\r\n\r\n## doctor\r\nRuns project diagnostics (structure, config, dependencies, components, port availability).\r\n\r\n```bash title=\"Run diagnostics\"\r\nnpm run slice:doctor\r\n```\r\n\r\n## version\r\nShows CLI version info and checks for updates.\r\n\r\n```bash title=\"Version\"\r\nnpm run slice:version\r\n```\r\n\r\n## help\r\nShows CLI help output.\r\n\r\n```bash title=\"Help\"\r\nnpm run slice:help\r\n```\r\n\r\n## types generate\r\nGenerates a TypeScript declaration file from your components' `static props`, so editors can\r\nautocomplete and type-check `slice.build('Name', { ... })` calls.\r\n\r\n```bash title=\"Generate typings\"\r\nnpm run slice:types\r\n```\r\n\r\n```bash title=\"Custom output path\"\r\nnpm run slice:types -- --output types/slice-build.d.ts\r\n```\r\n\r\n| Option | Default | Notes |\r\n| --- | --- | --- |\r\n| `-o, --output <path>` | `src/slice-build.generated.d.ts` | Where to write the generated `.d.ts`. |\r\n\r\nRe-run it whenever you add or change component props. The output is generated — don't edit it by\r\nhand, and re-generate (or wire it into your build) to keep autocomplete in sync.\r\n\r\n## Best Practices\r\n:::tip\r\nPrefer package scripts (`pnpm run ...` / `npm run ...`) for project commands.\r\n:::\r\n\r\n:::tip\r\nUse `npx slicejs-cli <command>` for bootstrapping and recovery (for example before scripts exist).\r\n:::\r\n\r\n:::tip\r\nRun `npm run dev` in one terminal and use another for component commands.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\n`npm run sync` only updates Visual components. Use `npm run get -- <Service> --service --force` for Service updates.\r\n:::\r\n\r\n:::warning\r\n`npm run component:list` rewrites `src/Components/components.js` based on detected folders.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm install slicejs-cli --save-dev\r",
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
               value: "npm install -g slicejs-cli\r",
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
               value: "npx slicejs-cli <command>\r",
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
               value: "SLICE_NO_LOCAL_DELEGATION=1 slice version\r",
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
            const lines = ["| Command | Alias | Purpose |\r","| --- | --- | --- |\r","| `slice init` | - | Initialize project structure and install Visual components. |\r","| `slice dev` | - | Start development server. |\r","| `slice build` | - | Build production output (bundles + dist). |\r","| `slice build clean` | - | Remove generated bundles. |\r","| `slice build info` | - | Show bundle configuration summary. |\r","| `slice start` | - | Start production server. |\r","| `slice component create` | `slice comp new` | Create a local component. |\r","| `slice component list` | `slice comp ls` | List local components. |\r","| `slice component delete` | `slice comp remove` | Delete a local component. |\r","| `slice get` | `slice registry get` | Install components from registry. |\r","| `slice browse` | `slice registry list` | List official registry components. |\r","| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |\r","| `slice list` | - | Shortcut for `slice component list`. |\r","| `slice version` | `slice v` | Show CLI version. |\r","| `slice doctor` | `slice diagnose` | Run project diagnostics. |\r","| `slice types generate` | - | Generate TypeScript typings for `slice.build`. |\r","| `slice help` | `slice --help` | Show CLI help. |\r"];
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
               value: "pnpm run dev\r\npnpm run build\r\npnpm run start\r\npnpm run browse\r\npnpm run get -- Button\r\npnpm run sync\r\npnpm run component:create -- UserCard --category AppComponents\r\npnpm run component:list\r\npnpm run component:delete -- UserCard --category AppComponents --yes\r\npnpm run slice:types\r",
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "pnpm exec slice dev\r\npnpm exec slice get Button\r",
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "allowBuilds:\r\n  slicejs-cli: true\r",
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "pnpm approve-builds slicejs-cli\r",
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
               value: "npx slicejs-cli init\r",
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx slicejs-cli init my-app -y --pm pnpm\r",
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
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `[name]` | `string` | `my-slice-app` | Project name (positional). |\r","| `-y, --yes` | `boolean` | `false` | Skip interactive prompts. |\r","| `--pm <pm>` | `pnpm \\| npm` | auto-detected | Package manager to use. When omitted, init detects it (user agent → available binaries) and only asks when ambiguous. |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run dev\r",
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
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |\r","| `--no-hmr` | `boolean` | `false` | Disable hot module reload (HMR is enabled by default). |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run start\r",
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
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-17"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run build\r",
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
         const container = this.querySelector('[data-block-id="doc-block-18"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `-a, --analyze` | `boolean` | `false` | Analyze only, do not generate bundles. |\r","| `-v, --verbose` | `boolean` | `false` | Output analysis metrics. |\r","| `--no-minify` | `boolean` | `false` | Disable minification (enabled by default). |\r","| `--no-obfuscate` | `boolean` | `false` | Disable obfuscation (enabled by default). |\r","| `--preview` | `boolean` | `false` | Start preview server after build. |\r","| `--serve` | `boolean` | `false` | Start preview server without building. |\r","| `--skip-clean` | `boolean` | `false` | Skip cleaning dist before build. |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-19"]');
         if (container) {
            const lines = ["| Command | Purpose |\r","| --- | --- |\r","| `slice build clean` | Remove generated bundle files and config. |\r","| `slice build info` | Show bundle configuration summary. |\r"];
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
               value: "npm run component:create\r",
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
         const container = this.querySelector('[data-block-id="doc-block-21"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:create -- UserCard --category AppComponents\r\nnpm run component:create -- AuthService -c Service\r",
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
         const container = this.querySelector('[data-block-id="doc-block-22"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:create -- UserCard --category Visual\r",
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
         const container = this.querySelector('[data-block-id="doc-block-23"]');
         if (container) {
            const lines = ["| Argument / option | Notes |\r","| --- | --- |\r","| `[name]` | Component name (positional). If omitted, you are prompted. |\r","| `-c, --category <category>` | A category from `paths.components` in `sliceConfig.json` (e.g. `Visual`, `Service`, `AppComponents`). If omitted, you are prompted. |\r"];
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
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:list\r",
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
         const container = this.querySelector('[data-block-id="doc-block-25"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:delete\r",
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
         const container = this.querySelector('[data-block-id="doc-block-26"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:delete -- UserCard --category AppComponents --yes\r",
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
         const container = this.querySelector('[data-block-id="doc-block-27"]');
         if (container) {
            const lines = ["| Argument / option | Notes |\r","| --- | --- |\r","| `[name]` | Component to delete. If omitted, you pick from a list. |\r","| `-c, --category <category>` | Category to look in. If omitted, you are prompted. |\r","| `-y, --yes` | Skip the confirmation prompt (required for a fully non-interactive run). |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-28"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run get -- Button Card Input\r",
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
         const container = this.querySelector('[data-block-id="doc-block-29"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `-f, --force` | `boolean` | `false` | Overwrite existing components. |\r","| `-s, --service` | `boolean` | `false` | Install as Service instead of Visual. |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-30"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run browse\r",
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
         const container = this.querySelector('[data-block-id="doc-block-31"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run sync\r",
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
         const container = this.querySelector('[data-block-id="doc-block-32"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `-f, --force` | `boolean` | `false` | Skip confirmation and force update. |\r"];
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
               value: "npm run slice:doctor\r",
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
         const container = this.querySelector('[data-block-id="doc-block-34"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:version\r",
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
         const container = this.querySelector('[data-block-id="doc-block-35"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:help\r",
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
         const container = this.querySelector('[data-block-id="doc-block-36"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:types\r",
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
         const container = this.querySelector('[data-block-id="doc-block-37"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:types -- --output types/slice-build.d.ts\r",
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
         const container = this.querySelector('[data-block-id="doc-block-38"]');
         if (container) {
            const lines = ["| Option | Default | Notes |\r","| --- | --- | --- |\r","| `-o, --output <path>` | `src/slice-build.generated.d.ts` | Where to write the generated `.d.ts`. |\r"];
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
