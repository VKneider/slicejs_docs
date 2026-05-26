export default class InitMethodDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/init-method.md";
    this.markdownContent = "---\r\ntitle: init()\r\nroute: /Documentation/LifeCycle-Methods/init\r\nnavLabel: init()\r\nsection: Getting Started\r\ngroup: Components\r\norder: 41\r\ndescription: One-time setup for Slice.js components.\r\ncomponent: InitMethodDocumentation\r\ntags: [lifecycle, init]\r\n---\r\n\r\n# init()\r\n\r\n## Overview\r\n`init()` runs once, right after the component instance is created and its template is attached.\r\nUse it for one-time setup that should not repeat during updates.\r\n\r\n`slice.build()` awaits `init()` before returning the component instance.\r\n\r\n## API\r\n| Method | Signature | Returns | Notes |\r\n| --- | --- | --- | --- |\r\n| `init` | `async init()` | `Promise<void>` | Called once per instance. |\r\n\r\n## Ideal Use Cases\r\n- Cache DOM references\r\n- Attach event listeners for the component lifetime\r\n- Fetch initial data\r\n- Build static child components\r\n\r\n## Example\r\n```javascript title=\"One-time setup in init()\"\r\nexport default class UserProfile extends HTMLElement {\r\n  async init() {\r\n    this.$userInfo = this.querySelector('.user-info');\r\n    this.$avatar = this.querySelector('.avatar');\r\n\r\n    this.userData = await this.fetchUserData(this.userId);\r\n\r\n    this.editButton = await slice.build('Button', {\r\n      sliceId: 'edit-profile-btn',\r\n      value: 'Edit Profile',\r\n      onClickCallback: () => this.editProfile()\r\n    });\r\n\r\n    this.addEventListener('click', this.handleClick.bind(this));\r\n\r\n    this.updateUserUI();\r\n    this.appendChild(this.editButton);\r\n  }\r\n\r\n  updateUserUI() {\r\n    this.$userInfo.textContent = this.userData.name;\r\n    this.$avatar.src = this.userData.avatar;\r\n  }\r\n}\r\n```\r\n\r\n## Patterns\r\n```javascript title=\"Bind events with auto-cleanup\"\r\nexport default class Notifications extends HTMLElement {\r\n  async init() {\r\n    this.events = slice.events.bind(this);\r\n    this.events.subscribe('notify', (payload) => this.show(payload));\r\n  }\r\n}\r\n```\r\n\r\n## Best Practices\r\n:::tip\r\nQuery DOM elements in `init()` (not in the constructor).\r\n:::\r\n\r\n:::tip\r\nBuild static child components here. Dynamic lists belong in `update()`.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\nAvoid building dynamic lists in `init()` if the list needs to refresh.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |\r","| --- | --- | --- | --- |\r","| `init` | `async init()` | `Promise<void>` | Called once per instance. |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class UserProfile extends HTMLElement {\r\n  async init() {\r\n    this.$userInfo = this.querySelector('.user-info');\r\n    this.$avatar = this.querySelector('.avatar');\r\n\r\n    this.userData = await this.fetchUserData(this.userId);\r\n\r\n    this.editButton = await slice.build('Button', {\r\n      sliceId: 'edit-profile-btn',\r\n      value: 'Edit Profile',\r\n      onClickCallback: () => this.editProfile()\r\n    });\r\n\r\n    this.addEventListener('click', this.handleClick.bind(this));\r\n\r\n    this.updateUserUI();\r\n    this.appendChild(this.editButton);\r\n  }\r\n\r\n  updateUserUI() {\r\n    this.$userInfo.textContent = this.userData.name;\r\n    this.$avatar.src = this.userData.avatar;\r\n  }\r\n}\r",
               language: "javascript"
            });
            if ("One-time setup in init()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "One-time setup in init()";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class Notifications extends HTMLElement {\r\n  async init() {\r\n    this.events = slice.events.bind(this);\r\n    this.events.subscribe('notify', (payload) => this.show(payload));\r\n  }\r\n}\r",
               language: "javascript"
            });
            if ("Bind events with auto-cleanup") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Bind events with auto-cleanup";
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

customElements.define('slice-initmethoddocumentation', InitMethodDocumentation);
