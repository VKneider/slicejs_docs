export default class ProjectArchitectureDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/choosing-project-style.md";
    this.markdownContent = "---\ntitle: Choosing a Project Style\nroute: /Documentation/Architecture\nnavLabel: Choosing a Project Style\nsection: Project Architecture\ngroup: Styles and Patterns\norder: 1\ndescription: Decide whether your Slice app should use App Shell + MultiRoute or a Single-View SPA.\ncomponent: ProjectArchitectureDocumentation\ntags: [architecture, project-structure, multiroute, spa]\n---\n\n# Choosing a Project Style\n\nSlice supports different app structures. Pick the one that matches your product shape, not just your current page count.\n\n## Quick Decision Matrix\n| Project signal | Recommended style | Why |\n| --- | --- | --- |\n| Multiple sections with shared navbar/sidebar | App Shell + MultiRoute | Keeps layout persistent and swaps section views cleanly |\n| Single gameplay/flow surface with internal states | Single-View SPA | Keeps transitions in one component tree and avoids route overhead |\n| You expect to add many independent sections soon | App Shell + MultiRoute | Easier long-term navigation scaling |\n| You optimize for one focused interaction | Single-View SPA | Faster to reason about state transitions |\n\n## Style A: App Shell + MultiRoute\n- Shared shell component renders persistent layout elements.\n- A `MultiRoute` container renders section components by URL.\n- Best for dashboard, portfolio, documentation, and admin-style apps.\n\n## Style B: Single-View SPA\n- App uses one route (`/`) and one root view component.\n- UI transitions are driven by internal state, context, or events.\n- Best for games, wizards, onboarding flows, and kiosk-like interactions.\n\n## Recommended Folder Shapes\n```text title=\"App Shell + MultiRoute\"\nsrc/\n  App/index.js\n  routes.js\n  Components/\n    AppComponents/\n      AppShell/\n      HomeSection/\n      SettingsSection/\n    Visual/\n```\n\n```text title=\"Single-View SPA\"\nsrc/\n  App/index.js\n  routes.js\n  Components/\n    AppComponents/\n      GameRoot/\n      GameSetup/\n      GameRound/\n      GameSummary/\n    Service/\n```\n\n## Rule of Thumb\n:::tip\nIf your navigation is user-visible and URL-driven, use App Shell + MultiRoute. If your transitions are state-machine-driven inside one experience, use Single-View SPA.\n:::\n\n## Next Guides\n- App Shell + MultiRoute: `/Documentation/Architecture/App-Shell-MultiRoute`\n- Single-View SPA: `/Documentation/Architecture/Single-View-SPA`\n- Routing and Data Passing: `/Documentation/Architecture/Routing-Data`\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Project signal | Recommended style | Why |","| --- | --- | --- |","| Multiple sections with shared navbar/sidebar | App Shell + MultiRoute | Keeps layout persistent and swaps section views cleanly |","| Single gameplay/flow surface with internal states | Single-View SPA | Keeps transitions in one component tree and avoids route overhead |","| You expect to add many independent sections soon | App Shell + MultiRoute | Easier long-term navigation scaling |","| You optimize for one focused interaction | Single-View SPA | Faster to reason about state transitions |"];
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
               value: "src/\n  App/index.js\n  routes.js\n  Components/\n    AppComponents/\n      AppShell/\n      HomeSection/\n      SettingsSection/\n    Visual/",
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
               value: "src/\n  App/index.js\n  routes.js\n  Components/\n    AppComponents/\n      GameRoot/\n      GameSetup/\n      GameRound/\n      GameSummary/\n    Service/",
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
