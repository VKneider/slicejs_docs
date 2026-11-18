export default class ProjectArchitectureDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "project-architecture/choosing-project-style.md";
    this.markdownContent = "---\ntitle: Choosing a Project Style\nroute: /Documentation/Architecture\nnavLabel: Choosing a Project Style\nsection: Guides\ngroup: ''\norder: 10\ndescription: Decide whether your Slice app should use App Shell + MultiRoute or a Single-View SPA.\ncomponent: ProjectArchitectureDocumentation\ntags: [architecture, project-structure, multiroute, spa]\n---\n\n# Choosing a Project Style\n\nSlice supports different app structures. Pick the one that matches your product shape, not just your current page count.\n\n## Quick Decision Matrix\n| Project signal | Recommended style | Why |\n| --- | --- | --- |\n| Multiple sections with shared navbar/sidebar | App Shell + MultiRoute | Keeps layout persistent and swaps section views cleanly |\n| Single gameplay/flow surface with internal states | Single-View SPA | Keeps transitions in one component tree and avoids route overhead |\n| You expect to add many independent sections soon | App Shell + MultiRoute | Easier long-term navigation scaling |\n| You optimize for one focused interaction | Single-View SPA | Faster to reason about state transitions |\n\n## Style A: App Shell + MultiRoute\n- Shared shell component renders persistent layout elements.\n- A `MultiRoute` container renders section components by URL.\n- Best for dashboard, portfolio, documentation, and admin-style apps.\n\n## Style B: Single-View SPA\n- App uses one route (`/`) and one root view component.\n- UI transitions are driven by internal state, context, or events.\n- Best for games, wizards, onboarding flows, and kiosk-like interactions.\n\n## Recommended Folder Shapes\n```text title=\"App Shell + MultiRoute\"\nsrc/\n  App/index.js\n  routes.js\n  Components/\n    AppComponents/\n      AppShell/\n      HomeSection/\n      SettingsSection/\n    Visual/\n```\n\n```text title=\"Single-View SPA\"\nsrc/\n  App/index.js\n  routes.js\n  Components/\n    AppComponents/\n      GameRoot/\n      GameSetup/\n      GameRound/\n      GameSummary/\n    Service/\n```\n\n## Rule of thumb\n\n:::compare left=\"App Shell + MultiRoute\" right=\"Single-View SPA\" leftTone=\"info\" rightTone=\"accent\"\nNavigation is user-visible and URL-driven: sections, deep links, back button, shared navbar/sidebar. The shell persists and `MultiRoute` swaps the section.\n---\nTransitions are state-machine-driven inside one experience: a game, a wizard, a kiosk. One route, one root view, internal state/context decides what renders.\n:::\n\n:::related\n- [App Shell + MultiRoute](/Documentation/Architecture/App-Shell-MultiRoute) - The persistent-shell pattern in full.\n- [Single-View SPA](/Documentation/Architecture/Single-View-SPA) - One route, internal transitions.\n- [Routing and Data Passing](/Documentation/Architecture/Routing-Data) - Params and route metadata.\n- [Project Anatomy](/Documentation/Project-Anatomy) - Where each folder lives.\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Guides"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Project signal","Recommended style","Why"],
               rows: [[{"html":"Multiple sections with shared navbar/sidebar"},{"html":"App Shell + MultiRoute"},{"html":"Keeps layout persistent and swaps section views cleanly"}],[{"html":"Single gameplay/flow surface with internal states"},{"html":"Single-View SPA"},{"html":"Keeps transitions in one component tree and avoids route overhead"}],[{"html":"You expect to add many independent sections soon"},{"html":"App Shell + MultiRoute"},{"html":"Easier long-term navigation scaling"}],[{"html":"You optimize for one focused interaction"},{"html":"Single-View SPA"},{"html":"Faster to reason about state transitions"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
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
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const grid = await slice.build('Grid', { columns: 2, rows: 1, gap: '14px' });
            const buildSide = async (side) => {
               const body = document.createElement('div');
               body.className = 'doc-callout-body';
               body.innerHTML = side.html;
               const callout = await slice.build('Callout', {
                  tone: side.tone,
                  title: side.title,
                  content: Array.from(body.childNodes)
               });
               return callout || body;
            };
            const left = await buildSide({"title":"App Shell + MultiRoute","tone":"info","html":"<p>Navigation is user-visible and URL-driven: sections, deep links, back button, shared navbar/sidebar. The shell persists and <code>MultiRoute</code> swaps the section.</p>"});
            const right = await buildSide({"title":"Single-View SPA","tone":"accent","html":"<p>Transitions are state-machine-driven inside one experience: a game, a wizard, a kiosk. One route, one root view, internal state/context decides what renders.</p>"});
            if (grid) {
               await grid.setItem(left);
               await grid.setItem(right);
               container.appendChild(grid);
            } else {
               container.appendChild(left);
               container.appendChild(right);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const items = [{"title":"App Shell + MultiRoute","path":"/Documentation/Architecture/App-Shell-MultiRoute","text":"The persistent-shell pattern in full."},{"title":"Single-View SPA","path":"/Documentation/Architecture/Single-View-SPA","text":"One route, internal transitions."},{"title":"Routing and Data Passing","path":"/Documentation/Architecture/Routing-Data","text":"Params and route metadata."},{"title":"Project Anatomy","path":"/Documentation/Project-Anatomy","text":"Where each folder lives."}];
            const grid = await slice.build('Grid', {
               columns: items.length === 4 ? 2 : Math.min(3, Math.max(1, items.length)),
               rows: 1,
               gap: '14px'
            });
            for (const item of items) {
               const card = await slice.build('Card', {
                  title: item.title,
                  text: item.text || '',
                  icon: { name: 'arrow-right', iconStyle: 'outlined' },
                  interactive: true,
                  onClick: () => {
                     if (/^https?:/i.test(item.path)) {
                        window.open(item.path, '_blank', 'noopener,noreferrer');
                     } else {
                        slice.router.navigate(item.path);
                     }
                  }
               });
               if (card && grid) await grid.setItem(card);
            }
            if (grid) container.appendChild(grid);
         }
      }
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    if (this._contentClick) {
      this.removeEventListener('click', this._contentClick);
      this._contentClick = null;
    }
  }

  // Internal markdown links are plain anchors with data-route. One delegated
  // handler keeps them inside the SPA, including "/page#section" links, without
  // building a component for every link on the page.
  setupRouterLinks() {
    this._contentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest?.('a[data-route]');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('#')) {
        event.preventDefault();
        this.scrollToHash(href.slice(1));
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//')) return;

      event.preventDefault();
      const hashIndex = href.indexOf('#');
      const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? '' : href.slice(hashIndex + 1);
      Promise.resolve(slice.router.navigate(path)).then(() => {
        if (hash) requestAnimationFrame(() => this.scrollToHash(hash));
      });
    };
    this.addEventListener('click', this._contentClick);
  }

  scrollToHash(hash) {
    let id = hash;
    try {
      id = decodeURIComponent(hash);
    } catch {
      id = hash;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
