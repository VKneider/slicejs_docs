export default class SingleViewSpaDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/single-view-spa.md";
    this.markdownContent = "---\r\ntitle: Single-View SPA\r\nroute: /Documentation/Architecture/Single-View-SPA\r\nnavLabel: Single-View SPA\r\nsection: Project Architecture\r\ngroup: Styles and Patterns\r\norder: 3\r\ndescription: Build flow-driven apps with one route and internal state transitions.\r\ncomponent: SingleViewSpaDocumentation\r\ntags: [architecture, spa, state-machine, game]\r\n---\r\n\r\n# Single-View SPA\r\n\r\nUse this style when your app is one main experience and transitions happen inside that experience.\r\n\r\n## When to Use\r\n- Games (Impostor-style)\r\n- Multi-step wizards with one dominant screen\r\n- Tools where URL sections are not the main interaction model\r\n\r\n> Deciding between this and App Shell + MultiRoute? See the [decision matrix](/Documentation/Architecture).\r\n\r\n## Minimal Route Setup\r\n```javascript title=\"src/routes.js\"\r\nconst routes = [\r\n  { path: '/', component: 'GameRoot' },\r\n  { path: '/404', component: 'NotFound' }\r\n];\r\n\r\nexport default routes;\r\n```\r\n\r\n## Root State Flow Example\r\n```javascript title=\"src/Components/AppComponents/GameRoot/GameRoot.js\"\r\nexport default class GameRoot extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n    this.state = { phase: 'setup', players: [] };\r\n  }\r\n\r\n  async init() {\r\n    await this.renderPhase();\r\n  }\r\n\r\n  async renderPhase() {\r\n    const viewMap = {\r\n      setup: 'GameSetup',\r\n      round: 'GameRound',\r\n      summary: 'GameSummary'\r\n    };\r\n\r\n    const component = await slice.build(viewMap[this.state.phase], {\r\n      state: this.state,\r\n      onNext: async (patch) => {\r\n        this.state = { ...this.state, ...patch };\r\n        await this.renderPhase();\r\n      }\r\n    });\r\n\r\n    const root = this.querySelector('.game-root-view');\r\n    root.innerHTML = '';\r\n    root.appendChild(component);\r\n  }\r\n}\r\n\r\ncustomElements.define('slice-game-root', GameRoot);\r\n```\r\n\r\n## Data Flow Tips\r\n- Keep flow state in root component state and/or `slice.context`.\r\n- Emit events for cross-cutting concerns (audio, analytics, notifications).\r\n- Keep URL stable unless deep links are required.\r\n\r\n## Common Mistakes\r\n:::warning\r\nDo not create many routes just to represent internal game phases. That usually increases complexity without user value.\r\n:::\r\n\r\n## Upgrade Trigger\r\nWhen users need independent URL-addressable sections, move to App Shell + MultiRoute.\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const routes = [\r\n  { path: '/', component: 'GameRoot' },\r\n  { path: '/404', component: 'NotFound' }\r\n];\r\n\r\nexport default routes;\r",
               language: "javascript"
            });
            if ("src/routes.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/routes.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class GameRoot extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n    this.state = { phase: 'setup', players: [] };\r\n  }\r\n\r\n  async init() {\r\n    await this.renderPhase();\r\n  }\r\n\r\n  async renderPhase() {\r\n    const viewMap = {\r\n      setup: 'GameSetup',\r\n      round: 'GameRound',\r\n      summary: 'GameSummary'\r\n    };\r\n\r\n    const component = await slice.build(viewMap[this.state.phase], {\r\n      state: this.state,\r\n      onNext: async (patch) => {\r\n        this.state = { ...this.state, ...patch };\r\n        await this.renderPhase();\r\n      }\r\n    });\r\n\r\n    const root = this.querySelector('.game-root-view');\r\n    root.innerHTML = '';\r\n    root.appendChild(component);\r\n  }\r\n}\r\n\r\ncustomElements.define('slice-game-root', GameRoot);\r",
               language: "javascript"
            });
            if ("src/Components/AppComponents/GameRoot/GameRoot.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/Components/AppComponents/GameRoot/GameRoot.js";
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

customElements.define('slice-singleviewspadocumentation', SingleViewSpaDocumentation);
