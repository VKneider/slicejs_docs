export default class DocumentationAndAgentsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/documentation-and-agents.md";
    this.markdownContent = "---\ntitle: Documentation & AGENTS.md\nroute: /Documentation/Documentation-System\nnavLabel: Documentation & AGENTS\nsection: Getting Started\ngroup: Tooling\norder: 16\ndescription: How Slice projects document components, categories, events and decisions, and how coding agents read that documentation.\ncomponent: DocumentationAndAgentsDocumentation\ntags: [documentation, agents, agents-md, claude, events, cli, categories]\n---\n\n# Documentation & AGENTS.md\n\nSlice projects ship documentation as part of the project, not as a follow-up. The goal is simple:\nan agent or a new teammate should know what a category is for, which component owns a behavior, which\nevents cross a boundary, and what changed — without guessing.\n\n## What `slice init` creates\n\nA fresh project gets the documentation scaffold next to the code:\n\n```text title=\"Project documentation layout\"\nmy-app/\n├── AGENTS.md                         # root guide: commands, categories, read order\n├── CLAUDE.md                         # one line: @AGENTS.md (Claude compatibility)\n├── src/\n│   └── Components/\n│       ├── Visual/\n│       │   └── AGENTS.md             # registry category guide + inventory\n│       ├── Service/\n│       │   └── AGENTS.md\n│       └── AppComponents/\n│           ├── AGENTS.md\n│           └── Dashboard/\n│               ├── Dashboard.js/html/css\n│               └── README.md         # app-owned component docs\n└── docs/\n    └── events/\n        ├── index.md\n        ├── <namespace>.md\n        ├── diagram.mmd\n        └── diagram.html\n```\n\n`src/markdown/` is **not** part of an app project. That folder belongs to the Slice.js Components\nand Slice.js Docs sites, which generate pages from Markdown. Apps document the module next to the\nmodule.\n\n## Read order for agents\n\nEvery coding agent should read, in this order:\n\n1. `AGENTS.md` at the project root.\n2. The nearest `src/Components/<Category>/AGENTS.md`.\n3. The component's `README.md` when changing its API, behavior or events.\n4. `docs/events/` when changing an event contract.\n5. The relevant design/decision note, if the project keeps one.\n\n`AGENTS.md` is an open Markdown format used by Codex, OpenCode, Cursor, Gemini CLI, Aider, Jules,\nFactory, Devin, VS Code/Copilot, Windsurf, Amp and others. Claude Code reads it directly on current\nversions; `CLAUDE.md` imports it for older versions. A direct user instruction wins over all of\nthem.\n\n## Root `AGENTS.md`\n\nThe root file is a router. It answers:\n\n- what this project is;\n- which commands to run;\n- which categories exist and where their guides live;\n- where component docs, event docs and changelogs live;\n- what “done” includes.\n\nIts category table is generated between markers:\n\n```md\n<!-- slice:generated:categories:start -->\n| Category | Type | Path | Components | Guide |\n| --- | --- | --- | --- | --- |\n| Visual | Visual | `src/Components/Visual` | 14 | [AGENTS.md](src/Components/Visual/AGENTS.md) |\n| Domain | Service | `src/Components/Domain` | 5 | [AGENTS.md](src/Components/Domain/AGENTS.md) |\n<!-- slice:generated:categories:end -->\n```\n\nWrite freely around the markers. `slice docs generate agents` rewrites only the marked block.\n\n## Category `AGENTS.md`\n\nEvery category in `sliceConfig.paths.components` has a guide. It explains the category, not just the\nfiles.\n\n### Visual and Service\n\nThese are the registry categories. `slice get` installs components there. Their guide states the\nrule:\n\n- a registry component is not edited by hand;\n- its authoritative docs are `slice docs` / MCP;\n- a local component added to the same category is app-owned and documents its own `README.md`.\n\n### App categories\n\nCustom categories such as `Domain`, `Core`, `Providers` or `AppComponents` are app-owned. Their guide\nshould cover:\n\n- what belongs here and what does not;\n- the local conventions and invariants;\n- the component inventory;\n- which events cross the boundary;\n- gotchas learned during implementation.\n\nThe generated inventory is only the table:\n\n```md\n<!-- slice:generated:components:start -->\n| Component | Type | Files | Docs |\n| --- | --- | --- | --- |\n| CartService | Service | 1 | [README](./CartService/README.md) |\n| PricingService | Service | 1 | [README](./PricingService/README.md) |\n<!-- slice:generated:components:end -->\n```\n\nA good guide is documentation, not boilerplate. “Components go here” is not enough.\n\n## Component `README.md`\n\nAn app-owned component documents itself next to its code:\n\n- purpose and when not to use it;\n- public props/API;\n- events emitted or listened to, with namespaces;\n- a minimal usage example;\n- lifecycle or singleton constraints;\n- gotchas;\n- a link to the category changelog if the project uses one.\n\nRegistry components do not get a local copy of their docs. That would go stale; link to\n`slice docs get <component>` instead.\n\n## Generated documentation\n\n`slice docs generate` writes the generated half:\n\n```bash\nslice docs generate            # agents + types + events\nslice docs generate agents     # components.js + AGENTS generated blocks\nslice docs generate types      # .d.ts + event manifest\nslice docs generate events     # docs/events/*\n```\n\n`slice docs check` is the read-only counterpart. It exits non-zero when a generated file is stale:\n\n```bash\nslice docs check\nslice docs check agents\nslice docs check types\nslice docs check events\n```\n\n`slice types generate` remains an alias of `slice docs generate types`.\n\n| Command | What it does |\n| --- | --- |\n| `slice init` | Seeds `AGENTS.md`, `CLAUDE.md`, category guides, types and event docs |\n| `slice dev` | Regenerates the documentation before starting the watch server |\n| `slice build` | Checks documentation drift for projects that already have the scaffold |\n| `slice doctor` | Reports missing guides, placeholders and generated-doc drift |\n| `slice component create/delete` | Keeps `components.js` and the category inventory in sync |\n| `slice get` / `slice sync` | Updates the installed category inventory |\n\nNever hand-edit `components.js`, `docs/events/*`, `src/slice-events.generated.js` or\n`*.generated.d.ts`.\n\n## Event documentation\n\nThe event catalog is generated from `slice.events.register(...)` and the static `emit` /\n`subscribe` call sites:\n\n```text\ndocs/events/\n├── index.md          # summary by namespace + drift\n├── cart.md           # one page per namespace\n├── router.md\n├── diagram.mmd       # Mermaid source\n└── diagram.html      # self-contained HTML + inline SVG\n```\n\nRules:\n\n- Event names are `namespace:action`.\n- Each namespace page lists payload, emitters, listeners, category and `file:line`.\n- `index.md` lists declared-but-unused events, used-but-undeclared events, names without a\n  namespace, and dynamic sites.\n- The scanner excludes `*.spec.js`, `*.test.js`, `*.generated.js`, `src/public/` and\n  `src/bundles/`.\n- `diagram.html` opens offline; it has no CDN or JavaScript dependency.\n\nExample namespace page:\n\n```md\n# cart events\n\n## `cart:add`\n\nPayload: `{ sku: string, qty: number }`\n\n| Role | Component | Category | Source |\n| --- | --- | --- | --- |\n| emitter | CartService | Domain | `src/Components/Domain/CartService/CartService.js:42` |\n| listener | CartBadge | Visual | `src/Components/Visual/CartBadge/CartBadge.js:18` |\n```\n\n## Changelog is optional\n\nThe scaffold does not force a changelog. If the project uses one:\n\n- `CHANGELOG.md` root for release-level changes;\n- `src/Components/<Category>/CHANGELOG.md` for category-level changes;\n- per-component changelogs only for components with their own release history.\n\nA feature does not create a folder. It adds an entry to the changelog that already exists. If the\nproject has no changelog, do not invent one unless the user asks.\n\n## What to update for each change\n\n| Change | Update |\n| --- | --- |\n| Feature | Component README, category guide if the category changed, changelog if used |\n| Bug | Regression test, component README/gotcha, changelog if user-facing |\n| New component | Component README, category inventory, tests |\n| Removed component | Category inventory, references, changelog if used |\n| Public props/API | Component README and examples |\n| Event contract | `slice.events.register`, `slice docs generate`, namespace page, tests |\n| Config/CLI | Root `AGENTS.md`, framework/CLI docs, changelog |\n| Architecture | Design/ADR doc, category guide, changelog |\n\nIf none apply, say “No docs impact” and why. A test-only change or an internal refactor with no\npublic behavior is a valid reason.\n\n## Library docs are different\n\n`slicejs-components` and `slicejs_docs` are documentation sites. Their Markdown source lives in\n`src/markdown/` or `markdown/` and their parsers generate the pages. That pipeline does not apply to\napps.\n\nWhen working in those repositories:\n\n- edit the Markdown source, never the generated pages;\n- run the repo's docs generator;\n- regenerate the component agent manifest and OG/SEO artifacts when the page is public;\n- update the framework docs and the shared skill when guidance changes.\n\n## Why this helps agents\n\n- The root guide is small and points to the nearest category.\n- The category guide explains the boundary and links the component docs.\n- The component README explains the contract and gotchas.\n- The event catalog is generated from the actual call sites, so it cannot silently drift.\n- `slice docs check` catches stale generated docs before a build or PR.\n\nThe result is documentation that is local, discoverable and current — not a second README nobody\nreads.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "my-app/\n├── AGENTS.md                         # root guide: commands, categories, read order\n├── CLAUDE.md                         # one line: @AGENTS.md (Claude compatibility)\n├── src/\n│   └── Components/\n│       ├── Visual/\n│       │   └── AGENTS.md             # registry category guide + inventory\n│       ├── Service/\n│       │   └── AGENTS.md\n│       └── AppComponents/\n│           ├── AGENTS.md\n│           └── Dashboard/\n│               ├── Dashboard.js/html/css\n│               └── README.md         # app-owned component docs\n└── docs/\n    └── events/\n        ├── index.md\n        ├── <namespace>.md\n        ├── diagram.mmd\n        └── diagram.html",
               language: "text"
            });
            if ("Project documentation layout") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Project documentation layout";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "<!-- slice:generated:categories:start -->\n| Category | Type | Path | Components | Guide |\n| --- | --- | --- | --- | --- |\n| Visual | Visual | `src/Components/Visual` | 14 | [AGENTS.md](src/Components/Visual/AGENTS.md) |\n| Domain | Service | `src/Components/Domain` | 5 | [AGENTS.md](src/Components/Domain/AGENTS.md) |\n<!-- slice:generated:categories:end -->",
               language: "md"
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
               value: "<!-- slice:generated:components:start -->\n| Component | Type | Files | Docs |\n| --- | --- | --- | --- |\n| CartService | Service | 1 | [README](./CartService/README.md) |\n| PricingService | Service | 1 | [README](./PricingService/README.md) |\n<!-- slice:generated:components:end -->",
               language: "md"
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
               value: "slice docs generate            # agents + types + events\nslice docs generate agents     # components.js + AGENTS generated blocks\nslice docs generate types      # .d.ts + event manifest\nslice docs generate events     # docs/events/*",
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
               value: "slice docs check\nslice docs check agents\nslice docs check types\nslice docs check events",
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
            const lines = ["| Command | What it does |","| --- | --- |","| `slice init` | Seeds `AGENTS.md`, `CLAUDE.md`, category guides, types and event docs |","| `slice dev` | Regenerates the documentation before starting the watch server |","| `slice build` | Checks documentation drift for projects that already have the scaffold |","| `slice doctor` | Reports missing guides, placeholders and generated-doc drift |","| `slice component create/delete` | Keeps `components.js` and the category inventory in sync |","| `slice get` / `slice sync` | Updates the installed category inventory |"];
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
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "docs/events/\n├── index.md          # summary by namespace + drift\n├── cart.md           # one page per namespace\n├── router.md\n├── diagram.mmd       # Mermaid source\n└── diagram.html      # self-contained HTML + inline SVG",
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "# cart events\n\n## `cart:add`\n\nPayload: `{ sku: string, qty: number }`\n\n| Role | Component | Category | Source |\n| --- | --- | --- | --- |\n| emitter | CartService | Domain | `src/Components/Domain/CartService/CartService.js:42` |\n| listener | CartBadge | Visual | `src/Components/Visual/CartBadge/CartBadge.js:18` |",
               language: "md"
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
            const lines = ["| Change | Update |","| --- | --- |","| Feature | Component README, category guide if the category changed, changelog if used |","| Bug | Regression test, component README/gotcha, changelog if user-facing |","| New component | Component README, category inventory, tests |","| Removed component | Category inventory, references, changelog if used |","| Public props/API | Component README and examples |","| Event contract | `slice.events.register`, `slice docs generate`, namespace page, tests |","| Config/CLI | Root `AGENTS.md`, framework/CLI docs, changelog |","| Architecture | Design/ADR doc, category guide, changelog |"];
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
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
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

customElements.define('slice-documentationandagentsdocumentation', DocumentationAndAgentsDocumentation);
