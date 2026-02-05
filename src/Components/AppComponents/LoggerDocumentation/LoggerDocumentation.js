export default class LoggerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "logger.md";
    this.markdownContent = "---\ntitle: Logger\nroute: /Documentation/Structural/Logger\nnavLabel: Logger\nsection: Getting Started\ngroup: Diagnostics\norder: 40\ndescription: Structured logging and filters for Slice.js.\ncomponent: LoggerDocumentation\ntags: [logger, diagnostics, debugging]\n---\n\n# Logger\n\n## Overview\nLogger collects logs and routes them to configured outputs (e.g. console). It supports filtering\nby level and basic querying over the in-memory log list.\n\n## Enable\n```json title=\"sliceConfig.json\"\n{\n  \"logger\": {\n    \"enabled\": true,\n    \"showLogs\": {\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\n    }\n  }\n}\n```\n\n## API Reference\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `logError` | `(componentSliceId, message, error?)` | Logs error + optional error object |\n| `logWarning` | `(componentSliceId, message)` | Logs warning |\n| `logInfo` | `(componentSliceId, message)` | Logs info |\n| `getLogs` | `()` | Returns all logs |\n| `clearLogs` | `()` | Clears stored logs |\n| `getLogsByLogType` | `(type)` | Filter by `error | warning | info` |\n| `getLogsByComponentCategory` | `(category)` | Filter by component category |\n| `getLogsByComponent` | `(sliceId)` | Filter by component sliceId |\n\n## Usage\n```javascript title=\"Log from a component\"\nexport default class Navbar extends HTMLElement {\n  async init() {\n    slice.logger.logInfo('Navbar', 'Navbar initialized');\n  }\n}\n```\n\n```javascript title=\"Log with error\"\ntry {\n  await doWork();\n} catch (error) {\n  slice.logger.logError('MyService', 'Work failed', error);\n}\n```\n\n## Notes\n- Logging is disabled when `logger.enabled` is false.\n- Log outputs depend on `logger.showLogs` configuration.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const lines = ["| Method | Signature | Notes |","| --- | --- | --- |","| `logError` | `(componentSliceId, message, error?)` | Logs error + optional error object |","| `logWarning` | `(componentSliceId, message)` | Logs warning |","| `logInfo` | `(componentSliceId, message)` | Logs info |","| `getLogs` | `()` | Returns all logs |","| `clearLogs` | `()` | Clears stored logs |","| `getLogsByLogType` | `(type)` | Filter by `error | warning | info` |","| `getLogsByComponentCategory` | `(category)` | Filter by component category |","| `getLogsByComponent` | `(sliceId)` | Filter by component sliceId |"];
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class Navbar extends HTMLElement {\n  async init() {\n    slice.logger.logInfo('Navbar', 'Navbar initialized');\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "try {\n  await doWork();\n} catch (error) {\n  slice.logger.logError('MyService', 'Work failed', error);\n}",
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

customElements.define('slice-loggerdocumentation', LoggerDocumentation);
