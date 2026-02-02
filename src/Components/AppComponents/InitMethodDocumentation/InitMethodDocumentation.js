export default class InitMethodDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/init-method.md";
    this.setupCopyButton();
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `init` | `async init()` | `Promise<void>` | Called once per instance. |"];
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
               value: "export default class UserProfile extends HTMLElement {\n  async init() {\n    this.$userInfo = this.querySelector('.user-info');\n    this.$avatar = this.querySelector('.avatar');\n\n    this.userData = await this.fetchUserData(this.userId);\n\n    this.editButton = await slice.build('Button', {\n      sliceId: 'edit-profile-btn',\n      value: 'Edit Profile',\n      onClickCallback: () => this.editProfile()\n    });\n\n    this.addEventListener('click', this.handleClick.bind(this));\n\n    this.updateUserUI();\n    this.appendChild(this.editButton);\n  }\n\n  updateUserUI() {\n    this.$userInfo.textContent = this.userData.name;\n    this.$avatar.src = this.userData.avatar;\n  }\n}",
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
               value: "export default class Notifications extends HTMLElement {\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe('notify', (payload) => this.show(payload));\n  }\n}",
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
      label: '❐'
    });

    container.appendChild(copyMenu);
  }

  async copyMarkdown() {}
}

customElements.define('slice-initmethoddocumentation', InitMethodDocumentation);
