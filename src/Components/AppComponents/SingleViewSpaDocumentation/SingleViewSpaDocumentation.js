export default class SingleViewSpaDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/single-view-spa.md";
    this.markdownContent = "---\ntitle: Single-View SPA\nroute: /Documentation/Architecture/Single-View-SPA\nnavLabel: Single-View SPA\nsection: Project Architecture\ngroup: Styles and Patterns\norder: 3\ndescription: Build flow-driven apps with one route and internal state transitions.\ncomponent: SingleViewSpaDocumentation\ntags: [architecture, spa, state-machine, game]\n---\n\n# Single-View SPA\n\nUse this style when your app is one main experience and transitions happen inside that experience.\n\n## When to Use\n- Games (Impostor-style)\n- Multi-step wizards with one dominant screen\n- Tools where URL sections are not the main interaction model\n\n> Deciding between this and App Shell + MultiRoute? See the [decision matrix](/Documentation/Architecture).\n\n## Minimal Route Setup\n```javascript title=\"src/routes.js\"\nconst routes = [\n  { path: '/', component: 'GameRoot' },\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;\n```\n\n## Root State Flow Example\n```javascript title=\"src/Components/AppComponents/GameRoot/GameRoot.js\"\nexport default class GameRoot extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n    this.state = { phase: 'setup', players: [] };\n  }\n\n  async init() {\n    await this.showPhase();\n  }\n\n  async showPhase() {\n    const viewMap = {\n      setup: 'GameSetup',\n      round: 'GameRound',\n      summary: 'GameSummary'\n    };\n\n    const component = await slice.build(viewMap[this.state.phase], {\n      state: this.state,\n      onNext: async (patch) => {\n        this.state = { ...this.state, ...patch };\n        await this.showPhase();\n      }\n    });\n\n    const root = this.querySelector('.game-root-view');\n    slice.controller.destroyByContainer(root);   // clean up the previous phase (no leak)\n    root.replaceChildren(component);\n  }\n}\n\ncustomElements.define('slice-game-root', GameRoot);\n```\n\n## Data Flow Tips\n- Keep flow state in root component state and/or `slice.context`.\n- Emit events for cross-cutting concerns (audio, analytics, notifications).\n- Keep URL stable unless deep links are required.\n\n## Common Mistakes\n:::warning\nDo not create many routes just to represent internal game phases. That usually increases complexity without user value.\n:::\n\n## Outgrowing single-view → App Shell\nWhen users need independent, URL-addressable sections, grow into the\n[App Shell + MultiRoute](/Documentation/Architecture/App-Shell-MultiRoute) pattern. Do it in\nslices, keeping the app working at each step:\n\n1. Add an `AppShell` that owns persistent UI (navbar, theme, footer) and hosts the section content.\n2. Wrap your current single view as **one** section route (e.g. `/play`).\n3. Add new sections only when they're independently navigable and meaningful as URLs.\n4. Move global controls into the shell; keep shared state in `slice.context` to avoid prop-drilling.\n5. Add [route guards](/Documentation/Routing/Guards) only when navigation policy needs it.\n\n:::tip\nMigrate in small slices: keep one route stable, move one section at a time, and verify after each move.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const routes = [\n  { path: '/', component: 'GameRoot' },\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;",
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
               value: "export default class GameRoot extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n    this.state = { phase: 'setup', players: [] };\n  }\n\n  async init() {\n    await this.showPhase();\n  }\n\n  async showPhase() {\n    const viewMap = {\n      setup: 'GameSetup',\n      round: 'GameRound',\n      summary: 'GameSummary'\n    };\n\n    const component = await slice.build(viewMap[this.state.phase], {\n      state: this.state,\n      onNext: async (patch) => {\n        this.state = { ...this.state, ...patch };\n        await this.showPhase();\n      }\n    });\n\n    const root = this.querySelector('.game-root-view');\n    slice.controller.destroyByContainer(root);   // clean up the previous phase (no leak)\n    root.replaceChildren(component);\n  }\n}\n\ncustomElements.define('slice-game-root', GameRoot);",
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
