export default class CommandsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "cli-commands.md";
    this.markdownContent = "---\ntitle: Slice CLI\nroute: /Documentation/CLI\nnavLabel: CLI\nsection: Getting Started\ngroup: Tooling\norder: 15\ndescription: Command reference for the Slice.js CLI.\ncomponent: CommandsDocumentation\ntags: [cli, tooling]\n---\n\n# Slice.js CLI\n\n## Overview\nThe Slice.js CLI (`slice`) helps you initialize projects, manage components, run the dev server,\nand maintain your toolchain. It is distributed as `slicejs-cli` and can be used via `npx` or a local\nnpm script.\n\n## Installation\n```bash title=\"Local (recommended)\"\nnpm install slicejs-cli --save-dev\n```\n\n```bash title=\"Global (optional launcher install)\"\nnpm install -g slicejs-cli\n```\n\nWhen the `slice` launcher command is available (commonly after a global install\nthat places `slice` in your PATH), it delegates to the nearest\nproject-local `node_modules/slicejs-cli` from your current directory (including\nsubdirectories). This keeps command execution aligned with the version pinned\nin each project.\n\nIf the launcher command is unavailable, use:\n\n```bash\nnpx slicejs-cli <command>\n```\n\nYou can bypass delegation for a specific invocation:\n\n```bash\nSLICE_NO_LOCAL_DELEGATION=1 slice version\n```\n\n## Command Summary\n| Command | Alias | Purpose |\n| --- | --- | --- |\n| `slice init` | - | Initialize project structure and install Visual components. |\n| `slice dev` | - | Start development server. |\n| `slice build` | - | Build production output (bundles + dist). |\n| `slice build clean` | - | Remove generated bundles. |\n| `slice build info` | - | Show bundle configuration summary. |\n| `slice start` | - | Start production server. |\n| `slice component create` | `slice comp new` | Create a local component. |\n| `slice component list` | `slice comp ls` | List local components. |\n| `slice component delete` | `slice comp remove` | Delete a local component. |\n| `slice get` | `slice registry get` | Install components from registry. |\n| `slice browse` | `slice registry list` | List official registry components. |\n| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |\n| `slice list` | - | Shortcut for `slice component list`. |\n| `slice version` | `slice -v` | Show CLI version. |\n| `slice update` | `slice upgrade` | Update CLI/framework. |\n| `slice doctor` | `slice diagnose` | Run project diagnostics. |\n| `slice help` | `slice --help` | Show CLI help. |\n\n## init\nInitializes a new project with the framework structure and installs Visual components from the\nofficial registry.\n\n```bash title=\"Initialize a project\"\nslice init\n```\n\nWhat it does:\n- Ensures latest `slicejs-web-framework` is installed.\n- Creates `api/` and `src/` structure from framework base.\n- Installs all Visual components from the registry.\n- Configures `package.json` scripts (dev, start, get, browse, sync, etc.).\n\n## dev\nStarts the development server and serves from `/src`.\n\n```bash title=\"Start dev server\"\nslice dev\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-p, --port` | `number` | `3000` | Uses config `server.port` if defined. Falls back to next port if busy. |\n| `-w, --watch` | `boolean` | `false` | Restart server on file changes. |\n\n### Behavior\n- Ensures `src/` and `api/` exist (otherwise suggests `slice init`).\n- Falls back to port+1 if the requested port is busy.\n- Uses `api/index.js` with `--development`.\n\n## start\nStarts the production server and serves from `/dist`.\n\n```bash title=\"Start production server\"\nslice start\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-p, --port` | `number` | `3000` | Uses config `server.port` if defined. Falls back to next port if busy. |\n| `-w, --watch` | `boolean` | `false` | Restart server on file changes. |\n\n:::tip\nProduction uses `publicFolders` from `sliceConfig.json` to expose public asset folders\nlike `/Themes`, `/Styles`, and `/assets`.\n:::\n\n## build\nBuilds production output by analyzing dependencies, generating bundles, and writing files to `/dist`.\n\n:::tip\nProduction builds include **Structural framework components** in bundles to avoid runtime fetches.\nThese entries are stored as `Framework/Structural/<ComponentName>` in bundle config.\n:::\n\n```bash title=\"Build production output\"\nslice build\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-a, --analyze` | `boolean` | `false` | Analyze only, do not generate bundles. |\n| `-v, --verbose` | `boolean` | `false` | Output analysis metrics. |\n| `--no-minify` | `boolean` | `false` | Disable minification (enabled by default). |\n| `--no-obfuscate` | `boolean` | `false` | Disable obfuscation (enabled by default). |\n| `--preview` | `boolean` | `false` | Start preview server after build. |\n| `--serve` | `boolean` | `false` | Start preview server without building. |\n| `--skip-clean` | `boolean` | `false` | Skip cleaning dist before build. |\n\n### Subcommands\n| Command | Purpose |\n| --- | --- |\n| `slice build clean` | Remove generated bundle files and config. |\n| `slice build info` | Show bundle configuration summary. |\n\n## component create\nCreates a new local component. Prompts for name and category from `sliceConfig.json`.\n\n```bash title=\"Create component\"\nslice component create\n```\n\nRules:\n- Name must start with a letter and be alphanumeric.\n- Visual components get `.js`, `.html`, `.css`.\n- Service components get `.js` only.\n\n## component list\nLists all local components by scanning category paths from `sliceConfig.json` and rewrites\n`src/Components/components.js`.\n\n```bash title=\"List components\"\nslice component list\n```\n\n## component delete\nDeletes a local component after interactive selection and confirmation.\n\n```bash title=\"Delete component\"\nslice component delete\n```\n\n## get / registry get\nDownloads components from the official registry (Visual or Service) into your project.\n\n```bash title=\"Get components\"\nslice get Button Card Input\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-f, --force` | `boolean` | `false` | Overwrite existing components. |\n| `-s, --service` | `boolean` | `false` | Install as Service instead of Visual. |\n\nNotes:\n- If no names are provided, the CLI opens an interactive selector.\n- Registry is fetched from the Slice docs repo.\n\n## browse / registry list\nLists available registry components.\n\n```bash title=\"Browse registry\"\nslice browse\n```\n\n## sync / registry sync\nUpdates local Visual components to latest registry versions. Service components are detected but\nnot updated automatically.\n\n```bash title=\"Sync components\"\nslice sync\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-f, --force` | `boolean` | `false` | Skip confirmation and force update. |\n\n## update\nChecks for CLI and framework updates and optionally installs them.\n\n```bash title=\"Update packages\"\nslice update\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-y, --yes` | `boolean` | `false` | Auto-confirm updates. |\n| `--cli` | `boolean` | `false` | Update CLI only. |\n| `-f, --framework` | `boolean` | `false` | Update framework only. |\n\n## doctor\nRuns project diagnostics (structure, config, dependencies, components, port availability).\n\n```bash title=\"Run diagnostics\"\nslice doctor\n```\n\n## version\nShows CLI version info and checks for updates.\n\n```bash title=\"Version\"\nslice version\n```\n\n## help\nShows CLI help output.\n\n```bash title=\"Help\"\nslice --help\n```\n\n## Best Practices\n:::tip\nInstall `slicejs-cli` locally per project and use the `slice` launcher so commands resolve to the nearest project-local runtime.\n:::\n\n:::tip\nIf `slice` is not available in your shell, use `npx slicejs-cli <command>` as a fallback.\n:::\n\n:::tip\nRun `slice dev` in one terminal and use another for component commands.\n:::\n\n## Gotchas\n:::warning\n`slice sync` only updates Visual components. Use `slice get <Service> --service --force` for Service updates.\n:::\n\n:::warning\n`slice component list` rewrites `src/Components/components.js` based on detected folders.\n:::\n";
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
            const lines = ["| Command | Alias | Purpose |","| --- | --- | --- |","| `slice init` | - | Initialize project structure and install Visual components. |","| `slice dev` | - | Start development server. |","| `slice build` | - | Build production output (bundles + dist). |","| `slice build clean` | - | Remove generated bundles. |","| `slice build info` | - | Show bundle configuration summary. |","| `slice start` | - | Start production server. |","| `slice component create` | `slice comp new` | Create a local component. |","| `slice component list` | `slice comp ls` | List local components. |","| `slice component delete` | `slice comp remove` | Delete a local component. |","| `slice get` | `slice registry get` | Install components from registry. |","| `slice browse` | `slice registry list` | List official registry components. |","| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |","| `slice list` | - | Shortcut for `slice component list`. |","| `slice version` | `slice -v` | Show CLI version. |","| `slice update` | `slice upgrade` | Update CLI/framework. |","| `slice doctor` | `slice diagnose` | Run project diagnostics. |","| `slice help` | `slice --help` | Show CLI help. |"];
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
            const code = await slice.build('CodeVisualizer', {
               value: "slice init",
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice dev",
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-p, --port` | `number` | `3000` | Uses config `server.port` if defined. Falls back to next port if busy. |","| `-w, --watch` | `boolean` | `false` | Restart server on file changes. |"];
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
            const code = await slice.build('CodeVisualizer', {
               value: "slice start",
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-p, --port` | `number` | `3000` | Uses config `server.port` if defined. Falls back to next port if busy. |","| `-w, --watch` | `boolean` | `false` | Restart server on file changes. |"];
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
            const code = await slice.build('CodeVisualizer', {
               value: "slice build",
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
         const container = this.querySelector('[data-block-id="doc-block-12"]');
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-13"]');
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice component create",
               language: "bash"
            });
            if ("Create component") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Create component";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice component list",
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
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice component delete",
               language: "bash"
            });
            if ("Delete component") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Delete component";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-17"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice get Button Card Input",
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
         const container = this.querySelector('[data-block-id="doc-block-18"]');
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-19"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice browse",
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
         const container = this.querySelector('[data-block-id="doc-block-20"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice sync",
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
         const container = this.querySelector('[data-block-id="doc-block-21"]');
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-22"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice update",
               language: "bash"
            });
            if ("Update packages") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Update packages";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-23"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-y, --yes` | `boolean` | `false` | Auto-confirm updates. |","| `--cli` | `boolean` | `false` | Update CLI only. |","| `-f, --framework` | `boolean` | `false` | Update framework only. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-24"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice doctor",
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
         const container = this.querySelector('[data-block-id="doc-block-25"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice version",
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
         const container = this.querySelector('[data-block-id="doc-block-26"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice --help",
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
