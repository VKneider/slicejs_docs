export default class CommandsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "cli-commands.md";
    this.markdownContent = "---\ntitle: Slice CLI\nroute: /Documentation/CLI\nnavLabel: CLI\nsection: Getting Started\ngroup: Tooling\norder: 15\ndescription: Command reference for the Slice.js CLI.\ncomponent: CommandsDocumentation\ntags: [cli, tooling]\n---\n\n# Slice.js CLI\n\n## Overview\nThe Slice.js CLI (`slice`) helps you initialize projects, manage components, run the dev server,\nand maintain your toolchain. It is distributed as `slicejs-cli` and can be used via `npx` or a local\nnpm script.\n\n## Installation\n```bash title=\"Global (recommended)\"\nnpm install -g slicejs-cli\n```\n\n```bash title=\"Local\"\nnpm install slicejs-cli --save-dev\n```\n\n## Command Summary\n| Command | Alias | Purpose |\n| --- | --- | --- |\n| `slice init` | - | Initialize project structure and install Visual components. |\n| `slice dev` | `slice start` | Start development server. |\n| `slice bundle` | - | Generate production bundles. |\n| `slice bundle clean` | - | Remove generated bundles. |\n| `slice bundle info` | - | Show bundle configuration summary. |\n| `slice component create` | `slice comp new` | Create a local component. |\n| `slice component list` | `slice comp ls` | List local components. |\n| `slice component delete` | `slice comp remove` | Delete a local component. |\n| `slice get` | `slice registry get` | Install components from registry. |\n| `slice browse` | `slice registry list` | List official registry components. |\n| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |\n| `slice list` | - | Shortcut for `slice component list`. |\n| `slice version` | `slice -v` | Show CLI version. |\n| `slice update` | `slice upgrade` | Update CLI/framework. |\n| `slice doctor` | `slice diagnose` | Run project diagnostics. |\n| `slice help` | `slice --help` | Show CLI help. |\n\n## init\nInitializes a new project with the framework structure and installs Visual components from the\nofficial registry.\n\n```bash title=\"Initialize a project\"\nslice init\n```\n\nWhat it does:\n- Ensures latest `slicejs-web-framework` is installed.\n- Creates `api/` and `src/` structure from framework base.\n- Installs all Visual components from the registry.\n- Configures `package.json` scripts (dev, start, get, browse, sync, etc.).\n\n## dev / start\nStarts the development server. Optionally generates bundles before startup and watches files.\n\n```bash title=\"Start dev server\"\nslice dev\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-p, --port` | `number` | `3000` | Uses config `server.port` if defined. Falls back to next port if busy. |\n| `-w, --watch` | `boolean` | `false` | Restart server on file changes. |\n| `-b, --bundled` | `boolean` | `false` | Generate bundles before start; runs in bundled mode. |\n\n### Behavior\n- Ensures `src/` and `api/` exist (otherwise suggests `slice init`).\n- Falls back to port+1 if the requested port is busy.\n- Uses `api/index.js` with `--development` or `--bundled`.\n\n## bundle\nGenerates production bundles by analyzing dependencies and writing bundle files to `src/`.\n\n```bash title=\"Generate bundles\"\nslice bundle\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-a, --analyze` | `boolean` | `false` | Analyze only, do not generate bundles. |\n| `-v, --verbose` | `boolean` | `false` | Output analysis metrics. |\n\n### Subcommands\n| Command | Purpose |\n| --- | --- |\n| `slice bundle clean` | Remove generated bundle files and config. |\n| `slice bundle info` | Show bundle configuration summary. |\n\n## component create\nCreates a new local component. Prompts for name and category from `sliceConfig.json`.\n\n```bash title=\"Create component\"\nslice component create\n```\n\nRules:\n- Name must start with a letter and be alphanumeric.\n- Visual components get `.js`, `.html`, `.css`.\n- Service components get `.js` only.\n\n## component list\nLists all local components by scanning category paths from `sliceConfig.json` and rewrites\n`src/Components/components.js`.\n\n```bash title=\"List components\"\nslice component list\n```\n\n## component delete\nDeletes a local component after interactive selection and confirmation.\n\n```bash title=\"Delete component\"\nslice component delete\n```\n\n## get / registry get\nDownloads components from the official registry (Visual or Service) into your project.\n\n```bash title=\"Get components\"\nslice get Button Card Input\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-f, --force` | `boolean` | `false` | Overwrite existing components. |\n| `-s, --service` | `boolean` | `false` | Install as Service instead of Visual. |\n\nNotes:\n- If no names are provided, the CLI opens an interactive selector.\n- Registry is fetched from the Slice docs repo.\n\n## browse / registry list\nLists available registry components.\n\n```bash title=\"Browse registry\"\nslice browse\n```\n\n## sync / registry sync\nUpdates local Visual components to latest registry versions. Service components are detected but\nnot updated automatically.\n\n```bash title=\"Sync components\"\nslice sync\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-f, --force` | `boolean` | `false` | Skip confirmation and force update. |\n\n## update\nChecks for CLI and framework updates and optionally installs them.\n\n```bash title=\"Update packages\"\nslice update\n```\n\n### Options\n| Flag | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `-y, --yes` | `boolean` | `false` | Auto-confirm updates. |\n| `--cli` | `boolean` | `false` | Update CLI only. |\n| `-f, --framework` | `boolean` | `false` | Update framework only. |\n\n## doctor\nRuns project diagnostics (structure, config, dependencies, components, port availability).\n\n```bash title=\"Run diagnostics\"\nslice doctor\n```\n\n## version\nShows CLI version info and checks for updates.\n\n```bash title=\"Version\"\nslice version\n```\n\n## help\nShows CLI help output.\n\n```bash title=\"Help\"\nslice --help\n```\n\n## Best Practices\n:::tip\nUse the global CLI to run commands from any project.\n:::\n\n:::tip\nRun `slice dev` in one terminal and use another for component commands.\n:::\n\n## Gotchas\n:::warning\n`slice sync` only updates Visual components. Use `slice get <Service> --service --force` for Service updates.\n:::\n\n:::warning\n`slice component list` rewrites `src/Components/components.js` based on detected folders.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm install -g slicejs-cli",
               language: "bash"
            });
            if ("Global (recommended)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Global (recommended)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm install slicejs-cli --save-dev",
               language: "bash"
            });
            if ("Local") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Local";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const lines = ["| Command | Alias | Purpose |","| --- | --- | --- |","| `slice init` | - | Initialize project structure and install Visual components. |","| `slice dev` | `slice start` | Start development server. |","| `slice bundle` | - | Generate production bundles. |","| `slice bundle clean` | - | Remove generated bundles. |","| `slice bundle info` | - | Show bundle configuration summary. |","| `slice component create` | `slice comp new` | Create a local component. |","| `slice component list` | `slice comp ls` | List local components. |","| `slice component delete` | `slice comp remove` | Delete a local component. |","| `slice get` | `slice registry get` | Install components from registry. |","| `slice browse` | `slice registry list` | List official registry components. |","| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |","| `slice list` | - | Shortcut for `slice component list`. |","| `slice version` | `slice -v` | Show CLI version. |","| `slice update` | `slice upgrade` | Update CLI/framework. |","| `slice doctor` | `slice diagnose` | Run project diagnostics. |","| `slice help` | `slice --help` | Show CLI help. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-p, --port` | `number` | `3000` | Uses config `server.port` if defined. Falls back to next port if busy. |","| `-w, --watch` | `boolean` | `false` | Restart server on file changes. |","| `-b, --bundled` | `boolean` | `false` | Generate bundles before start; runs in bundled mode. |"];
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
            const code = await slice.build('CodeVisualizer', {
               value: "slice bundle",
               language: "bash"
            });
            if ("Generate bundles") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Generate bundles";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const lines = ["| Flag | Type | Default | Notes |","| --- | --- | --- | --- |","| `-a, --analyze` | `boolean` | `false` | Analyze only, do not generate bundles. |","| `-v, --verbose` | `boolean` | `false` | Output analysis metrics. |"];
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
            const lines = ["| Command | Purpose |","| --- | --- |","| `slice bundle clean` | Remove generated bundle files and config. |","| `slice bundle info` | Show bundle configuration summary. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
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
         const container = this.querySelector('[data-block-id="doc-block-12"]');
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
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
         const container = this.querySelector('[data-block-id="doc-block-14"]');
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
         const container = this.querySelector('[data-block-id="doc-block-15"]');
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
         const container = this.querySelector('[data-block-id="doc-block-16"]');
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
         const container = this.querySelector('[data-block-id="doc-block-17"]');
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
         const container = this.querySelector('[data-block-id="doc-block-18"]');
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
         const container = this.querySelector('[data-block-id="doc-block-19"]');
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
         const container = this.querySelector('[data-block-id="doc-block-20"]');
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
         const container = this.querySelector('[data-block-id="doc-block-21"]');
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
         const container = this.querySelector('[data-block-id="doc-block-22"]');
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
