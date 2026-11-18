export default class LoggerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "logger.md";
    this.markdownContent = "---\ntitle: Logger\nroute: /Documentation/Structural/Logger\nnavLabel: Logger\nsection: Tooling\ngroup: ''\norder: 60\ndescription: Structured logging and filters for Slice.js.\ncomponent: LoggerDocumentation\ntags: [logger, diagnostics, debugging]\n---\n\n# Logger\n\n## Overview\nLogger collects logs and routes them to configured outputs (e.g. console). It supports filtering\nby level and basic querying over the in-memory log list.\n\n## Enable\n```json title=\"sliceConfig.json\"\n{\n  \"logger\": {\n    \"enabled\": true,\n    \"showLogs\": {\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\n    }\n  }\n}\n```\n\n## Logger UI (Optional)\nYou can enable the LogViewer debug panel with a keyboard shortcut.\n\n```json title=\"sliceConfig.json\"\n{\n  \"logger\": {\n    \"enabled\": true,\n    \"ui\": {\n      \"enabled\": true,\n      \"shortcut\": \"alt+shift+l\"\n    }\n  }\n}\n```\n\nThe panel shows a live feed of all logs with level filtering and a search input. It is built with the same `--si-*` tokens as the other debugger panels and only processes logs while visible (conditional subscribe on toggle).\n\n## API Reference\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `error` | `(sliceId, message, error?)` | Log an error (+ optional error object). |\n| `warn` | `(sliceId, message, error?)` | Log a warning. |\n| `info` | `(sliceId, message, error?)` | Log info. |\n| `debug` | `(sliceId, message, error?)` | Log debug detail. |\n| `getLogs` | `()` | Returns all log entries. |\n| `clearLogs` | `()` | Clears stored logs. |\n| `getLogsByLogType` | `(type)` | Filter by type: `error`, `warn`, `info`, `debug`. |\n| `getLogsByComponentCategory` | `(category)` | Filter by component category. |\n| `getLogsByComponent` | `(sliceId)` | Filter by component sliceId. |\n| `onLog` / `offLog` | `(callback)` | Subscribe / unsubscribe to logs in real time. |\n\nThe names `logError` / `logWarning` / `logInfo` still work but are **deprecated** — prefer\n`error` / `warn` / `info`.\n\n## Usage\n```javascript title=\"Log from a component\"\nexport default class Navbar extends HTMLElement {\n  async init() {\n    slice.logger.info('Navbar', 'Navbar initialized');\n  }\n}\n```\n\n```javascript title=\"Log with error\"\ntry {\n  await doWork();\n} catch (error) {\n  slice.logger.error('MyService', 'Work failed', error);\n}\n```\n\n## Notes\n- Logging is disabled when `logger.enabled` is false.\n- Log outputs depend on `logger.showLogs` configuration.\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Tooling"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"logger\": {\n    \"enabled\": true,\n    \"showLogs\": {\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\n    }\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"logger\": {\n    \"enabled\": true,\n    \"ui\": {\n      \"enabled\": true,\n      \"shortcut\": \"alt+shift+l\"\n    }\n  }\n}",
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
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Notes"],
               rows: [[{"html":"<code>error</code>"},{"html":"<code>(sliceId, message, error?)</code>"},{"html":"Log an error (+ optional error object)."}],[{"html":"<code>warn</code>"},{"html":"<code>(sliceId, message, error?)</code>"},{"html":"Log a warning."}],[{"html":"<code>info</code>"},{"html":"<code>(sliceId, message, error?)</code>"},{"html":"Log info."}],[{"html":"<code>debug</code>"},{"html":"<code>(sliceId, message, error?)</code>"},{"html":"Log debug detail."}],[{"html":"<code>getLogs</code>"},{"html":"<code>()</code>"},{"html":"Returns all log entries."}],[{"html":"<code>clearLogs</code>"},{"html":"<code>()</code>"},{"html":"Clears stored logs."}],[{"html":"<code>getLogsByLogType</code>"},{"html":"<code>(type)</code>"},{"html":"Filter by type: <code>error</code>, <code>warn</code>, <code>info</code>, <code>debug</code>."}],[{"html":"<code>getLogsByComponentCategory</code>"},{"html":"<code>(category)</code>"},{"html":"Filter by component category."}],[{"html":"<code>getLogsByComponent</code>"},{"html":"<code>(sliceId)</code>"},{"html":"Filter by component sliceId."}],[{"html":"<code>onLog</code> / <code>offLog</code>"},{"html":"<code>(callback)</code>"},{"html":"Subscribe / unsubscribe to logs in real time."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class Navbar extends HTMLElement {\n  async init() {\n    slice.logger.info('Navbar', 'Navbar initialized');\n  }\n}",
               language: "javascript"
            });
            if ("Log from a component") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Log from a component";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "try {\n  await doWork();\n} catch (error) {\n  slice.logger.error('MyService', 'Work failed', error);\n}",
               language: "javascript"
            });
            if ("Log with error") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Log with error";
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

customElements.define('slice-loggerdocumentation', LoggerDocumentation);
