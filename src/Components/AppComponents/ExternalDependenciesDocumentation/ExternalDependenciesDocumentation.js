export default class ExternalDependenciesDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "external-dependencies.md";
    this.markdownContent = "---\r\ntitle: External Dependencies\r\nroute: /Documentation/External-Dependencies\r\nnavLabel: External Dependencies\r\nsection: Getting Started\r\ngroup: Tooling\r\norder: 25\r\ndescription: Temporary official pattern for using external scripts and libraries in Slice.js.\r\ncomponent: ExternalDependenciesDocumentation\r\ntags: [dependencies, external, publicFolders, bundling]\r\n---\r\n\r\n# External Dependencies\r\n\r\n## Overview\r\nSlice.js currently supports a temporary official pattern for external scripts and libraries using public folders.\r\n\r\nThis is the recommended approach until native bare-package imports are available.\r\n\r\n## What Is Supported Today\r\n- Relative imports (`./`, `../`) for internal project modules.\r\n- Absolute imports that point to folders listed in `sliceConfig.json` `publicFolders`.\r\n\r\nExample:\r\n\r\n```javascript title=\"Valid absolute import\"\r\nimport '/libs/dayjs/dayjs.min.js';\r\n```\r\n\r\n## What Is Not Supported Yet\r\n- Bare package imports such as:\r\n\r\n```javascript title=\"Not supported yet\"\r\nimport dayjs from 'dayjs';\r\n```\r\n\r\n- Automatic browser resolution from `node_modules`.\r\n- CommonJS package interop for browser runtime.\r\n\r\n## Configure `publicFolders`\r\nAdd one or more public folders in `sliceConfig.json`.\r\n\r\n```json title=\"sliceConfig.json\"\r\n{\r\n  \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\", \"/libs\"]\r\n}\r\n```\r\n\r\n## Recommended Project Layout\r\nPlace third-party files in one of your configured public folders.\r\n\r\n```text\r\nsrc/\r\n  libs/\r\n    dayjs/\r\n      dayjs.min.js\r\n```\r\n\r\nThen import them with an absolute URL path:\r\n\r\n```javascript title=\"Component usage\"\r\nimport '/libs/dayjs/dayjs.min.js';\r\n```\r\n\r\n## Dev and Production Behavior\r\n- `slice dev`: absolute public-folder imports are resolved and preserved.\r\n- `slice build`: absolute public-folder imports are preserved with the same rule.\r\n- `slice start`: built output serves public files from `dist`.\r\n\r\n## Build Warnings\r\nSlice CLI warns when:\r\n- You use bare imports (`import 'pkg'`).\r\n- You use absolute imports outside configured `publicFolders`.\r\n\r\nThese warnings help keep behavior predictable between development and production.\r\n\r\n## Troubleshooting\r\n:::warning\r\nIf an external script works in dev but fails in production, verify that:\r\n- the import starts with `/` (absolute path),\r\n- the folder is included in `publicFolders`,\r\n- the file exists under `src/<public-folder>/...` before building.\r\n:::\r\n\r\n## Migration Path\r\nThis approach is temporary by design.\r\n\r\nWhen native package imports are released, you will be able to migrate from:\r\n\r\n```javascript\r\nimport '/libs/some-lib/index.js';\r\n```\r\n\r\nto:\r\n\r\n```javascript\r\nimport 'some-lib';\r\n```\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import '/libs/dayjs/dayjs.min.js';\r",
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
               value: "import dayjs from 'dayjs';\r",
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
               value: "{\r\n  \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\", \"/libs\"]\r\n}\r",
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
               value: "src/\r\n  libs/\r\n    dayjs/\r\n      dayjs.min.js\r",
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
               value: "import '/libs/dayjs/dayjs.min.js';\r",
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
               value: "import '/libs/some-lib/index.js';\r",
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
               value: "import 'some-lib';\r",
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
