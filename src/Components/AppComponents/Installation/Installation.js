export default class Installation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "installation.md";
    this.markdownContent = "---\ntitle: Installation\nroute: /Documentation/Installation\nnavLabel: Installation\nsection: Introduction\ngroup: Overview\norder: 3\ndescription: Install the CLI, initialize a project, and start the dev server.\ncomponent: Installation\ntags: [installation, cli, setup]\ngenerate: true\n---\n\n# Installation\n\n## Requirements\n- Node.js 20+\n- npm or pnpm\n\n## Initialize a Project\n\n`slice init` creates the project folder for you — no `mkdir`, no `npm init` needed.\nEverything (package.json, node_modules, lockfile, `src/`, `api/`) lives **inside**\nthe new folder.\n\nWith npm:\n\n```bash\nnpx slicejs-cli init\n```\n\nWith pnpm:\n\n```bash\npnpm dlx slicejs-cli init\n```\n\nIf the `slice` launcher is already available in your PATH:\n\n```bash\nslice init\n```\n\nThe prompt asks for a project name (and for a package manager when more than one\nis available — pass `--pm npm` or `--pm pnpm` to skip the question). Then init:\n\n- Creates the project folder and its `package.json` (with the chosen package\n  manager pinned in the `packageManager` field).\n- Installs `slicejs-web-framework` as a dependency and `slicejs-cli` as a\n  devDependency — both inside the project folder.\n- Creates the `src/` and `api/` structure and installs the starter Visual and\n  Service components from the registry.\n- Configures package scripts (`dev`, `build`, `start`, `get`, `browse`, `sync`, ...).\n\nNon-interactive form:\n\n```bash\nnpx slicejs-cli init -y my-app --pm pnpm\n```\n\n:::tip\n**pnpm:** init is pnpm-friendly: it never pins a just-published version, so hardened pnpm\nsetups (e.g. `minimumReleaseAge` quarantine) resolve the newest version allowed\nby your policy. With `ignore-scripts` enabled, no postinstall step is required —\ninit configures the scripts itself.\n\nFor pnpm v10+, builds are controlled by `allowBuilds` in `pnpm-workspace.yaml`.\n`slice init --pm pnpm` writes `allowBuilds.slicejs-cli: true` automatically so the\nCLI postinstall can run without a manual `pnpm approve-builds` step.\n:::\n\n## Start Dev Server\n```bash\ncd my-app\nnpm run dev     # or: pnpm run dev\n```\n\nInside the project, prefer package scripts so execution is always pinned to your\nlocal `package.json` scripts:\n\n```bash\npnpm run dev\n```\n\nIf you prefer direct execution from the local dependency, `pnpm exec` is also valid:\n\n```bash\npnpm exec slice dev\n```\n\nIf the CLI is installed globally, you can run the binary directly from PATH:\n\n```bash\nslice dev\n```\n\nIf scripts were not configured (for example with hardened `ignore-scripts` setups),\nrun `npx slicejs-cli postinstall` once to add them.\n\nIf your policy blocks builds in an existing project, you can still approve manually:\n\n```bash\npnpm approve-builds slicejs-cli\n```\n\n## Install the Launcher (Optional)\n\nYou can install the CLI globally to expose the `slice` command everywhere:\n\n```bash\nnpm install -g slicejs-cli      # or: pnpm add -g slicejs-cli\n```\n\nThe launcher always delegates to the project-local `node_modules/slicejs-cli`\nwhen one exists, so each project keeps its pinned CLI version.\n\nTo bypass local delegation for one command:\n\n```bash\nSLICE_NO_LOCAL_DELEGATION=1 slice version\n```\n\n## Next Steps\n- Explore CLI commands: /Documentation/CLI\n- Configure `sliceConfig.json`: /Documentation/Configuration/sliceConfig\n- Build your first component: /Documentation/The-build-method\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx slicejs-cli init",
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
               value: "pnpm dlx slicejs-cli init",
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
               value: "slice init",
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
               value: "npx slicejs-cli init -y my-app --pm pnpm",
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
            const code = await slice.build('CodeVisualizer', {
               value: "cd my-app\nnpm run dev     # or: pnpm run dev",
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "pnpm run dev",
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
               value: "pnpm exec slice dev",
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
               value: "slice dev",
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm install -g slicejs-cli      # or: pnpm add -g slicejs-cli",
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
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

customElements.define('slice-installation', Installation);
