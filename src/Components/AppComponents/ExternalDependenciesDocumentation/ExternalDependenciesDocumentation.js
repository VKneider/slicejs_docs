export default class ExternalDependenciesDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "external-dependencies.md";
    this.markdownContent = "---\ntitle: External Dependencies\nroute: /Documentation/External-Dependencies\nnavLabel: External Dependencies\nsection: Getting Started\ngroup: Tooling\norder: 25\ndescription: Temporary official pattern for using external scripts and libraries in Slice.js.\ncomponent: ExternalDependenciesDocumentation\ntags: [dependencies, external, publicFolders, bundling]\n---\n\n# External Dependencies\n\n## Overview\nSlice.js currently supports a temporary official pattern for external scripts and libraries using public folders.\n\nThis is the recommended approach until native bare-package imports are available.\n\n## What Is Supported Today\n- Relative imports (`./`, `../`) for internal project modules.\n- Absolute imports that point to folders listed in `sliceConfig.json` `publicFolders`.\n\nExample:\n\n```javascript title=\"Valid absolute import\"\nimport '/libs/dayjs/dayjs.min.js';\n```\n\n## What Is Not Supported Yet\n- Bare package imports such as:\n\n```javascript title=\"Not supported yet\"\nimport dayjs from 'dayjs';\n```\n\n- Automatic browser resolution from `node_modules`.\n- CommonJS package interop for browser runtime.\n\n## Configure `publicFolders`\nAdd one or more public folders in `sliceConfig.json`.\n\n```json title=\"sliceConfig.json\"\n{\n  \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\", \"/libs\"]\n}\n```\n\n## Recommended Project Layout\nPlace third-party files in one of your configured public folders.\n\n```text\nsrc/\n  libs/\n    dayjs/\n      dayjs.min.js\n```\n\nThen import them with an absolute URL path:\n\n```javascript title=\"Component usage\"\nimport '/libs/dayjs/dayjs.min.js';\n```\n\n## Dev and Production Behavior\n- `slice dev`: absolute public-folder imports are resolved and preserved.\n- `slice build`: absolute public-folder imports are preserved with the same rule.\n- `slice start`: built output serves public files from `dist`.\n\n## Build Warnings\nSlice CLI warns when:\n- You use bare imports (`import 'pkg'`).\n- You use absolute imports outside configured `publicFolders`.\n\nThese warnings help keep behavior predictable between development and production.\n\n## Troubleshooting\n:::warning\nIf an external script works in dev but fails in production, verify that:\n- the import starts with `/` (absolute path),\n- the folder is included in `publicFolders`,\n- the file exists under `src/<public-folder>/...` before building.\n:::\n\n## Migration Path\nThis approach is temporary by design.\n\nWhen native package imports are released, you will be able to migrate from:\n\n```javascript\nimport '/libs/some-lib/index.js';\n```\n\nto:\n\n```javascript\nimport 'some-lib';\n```\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import '/libs/dayjs/dayjs.min.js';",
               language: "javascript"
            });
            if ("Valid absolute import") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Valid absolute import";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import dayjs from 'dayjs';",
               language: "javascript"
            });
            if ("Not supported yet") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Not supported yet";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\", \"/libs\"]\n}",
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
            const code = await slice.build('CodeVisualizer', {
               value: "src/\n  libs/\n    dayjs/\n      dayjs.min.js",
               language: "text"
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
               value: "import '/libs/dayjs/dayjs.min.js';",
               language: "javascript"
            });
            if ("Component usage") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Component usage";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import '/libs/some-lib/index.js';",
               language: "javascript"
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
               value: "import 'some-lib';",
               language: "javascript"
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

customElements.define('slice-externaldependenciesdocumentation', ExternalDependenciesDocumentation);
