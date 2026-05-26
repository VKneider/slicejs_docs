export default class ProjectArchitectureDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/choosing-project-style.md";
    this.markdownContent = "---\r\ntitle: Choosing a Project Style\r\nroute: /Documentation/Architecture\r\nnavLabel: Choosing a Project Style\r\nsection: Project Architecture\r\ngroup: Styles and Patterns\r\norder: 1\r\ndescription: Decide whether your Slice app should use App Shell + MultiRoute or a Single-View SPA.\r\ncomponent: ProjectArchitectureDocumentation\r\ntags: [architecture, project-structure, multiroute, spa]\r\n---\r\n\r\n# Choosing a Project Style\r\n\r\nSlice supports different app structures. Pick the one that matches your product shape, not just your current page count.\r\n\r\n## Quick Decision Matrix\r\n| Project signal | Recommended style | Why |\r\n| --- | --- | --- |\r\n| Multiple sections with shared navbar/sidebar | App Shell + MultiRoute | Keeps layout persistent and swaps section views cleanly |\r\n| Single gameplay/flow surface with internal states | Single-View SPA | Keeps transitions in one component tree and avoids route overhead |\r\n| You expect to add many independent sections soon | App Shell + MultiRoute | Easier long-term navigation scaling |\r\n| You optimize for one focused interaction | Single-View SPA | Faster to reason about state transitions |\r\n\r\n## Style A: App Shell + MultiRoute\r\n- Shared shell component renders persistent layout elements.\r\n- A `MultiRoute` container renders section components by URL.\r\n- Best for dashboard, portfolio, documentation, and admin-style apps.\r\n\r\n## Style B: Single-View SPA\r\n- App uses one route (`/`) and one root view component.\r\n- UI transitions are driven by internal state, context, or events.\r\n- Best for games, wizards, onboarding flows, and kiosk-like interactions.\r\n\r\n## Recommended Folder Shapes\r\n```text title=\"App Shell + MultiRoute\"\r\nsrc/\r\n  App/index.js\r\n  routes.js\r\n  Components/\r\n    AppComponents/\r\n      AppShell/\r\n      HomeSection/\r\n      SettingsSection/\r\n    Visual/\r\n```\r\n\r\n```text title=\"Single-View SPA\"\r\nsrc/\r\n  App/index.js\r\n  routes.js\r\n  Components/\r\n    AppComponents/\r\n      GameRoot/\r\n      GameSetup/\r\n      GameRound/\r\n      GameSummary/\r\n    Service/\r\n```\r\n\r\n## Rule of Thumb\r\n:::tip\r\nIf your navigation is user-visible and URL-driven, use App Shell + MultiRoute. If your transitions are state-machine-driven inside one experience, use Single-View SPA.\r\n:::\r\n\r\n## Next Guides\r\n- App Shell + MultiRoute: `/Documentation/Architecture/App-Shell-MultiRoute`\r\n- Single-View SPA: `/Documentation/Architecture/Single-View-SPA`\r\n- Routing and Data Passing: `/Documentation/Architecture/Routing-Data`\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Project signal | Recommended style | Why |\r","| --- | --- | --- |\r","| Multiple sections with shared navbar/sidebar | App Shell + MultiRoute | Keeps layout persistent and swaps section views cleanly |\r","| Single gameplay/flow surface with internal states | Single-View SPA | Keeps transitions in one component tree and avoids route overhead |\r","| You expect to add many independent sections soon | App Shell + MultiRoute | Easier long-term navigation scaling |\r","| You optimize for one focused interaction | Single-View SPA | Faster to reason about state transitions |\r"];
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
               value: "src/\r\n  App/index.js\r\n  routes.js\r\n  Components/\r\n    AppComponents/\r\n      AppShell/\r\n      HomeSection/\r\n      SettingsSection/\r\n    Visual/\r",
               language: "text"
            });
            if ("App Shell + MultiRoute") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "App Shell + MultiRoute";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "src/\r\n  App/index.js\r\n  routes.js\r\n  Components/\r\n    AppComponents/\r\n      GameRoot/\r\n      GameSetup/\r\n      GameRound/\r\n      GameSummary/\r\n    Service/\r",
               language: "text"
            });
            if ("Single-View SPA") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Single-View SPA";
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

customElements.define('slice-projectarchitecturedocumentation', ProjectArchitectureDocumentation);
