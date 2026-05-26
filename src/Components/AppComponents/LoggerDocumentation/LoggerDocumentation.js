export default class LoggerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "logger.md";
    this.markdownContent = "---\r\ntitle: Logger\r\nroute: /Documentation/Structural/Logger\r\nnavLabel: Logger\r\nsection: Getting Started\r\ngroup: Diagnostics\r\norder: 40\r\ndescription: Structured logging and filters for Slice.js.\r\ncomponent: LoggerDocumentation\r\ntags: [logger, diagnostics, debugging]\r\n---\r\n\r\n# Logger\r\n\r\n## Overview\r\nLogger collects logs and routes them to configured outputs (e.g. console). It supports filtering\r\nby level and basic querying over the in-memory log list.\r\n\r\n## Enable\r\n```json title=\"sliceConfig.json\"\r\n{\r\n  \"logger\": {\r\n    \"enabled\": true,\r\n    \"showLogs\": {\r\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\r\n    }\r\n  }\r\n}\r\n```\r\n\r\n## API Reference\r\n| Method | Signature | Notes |\r\n| --- | --- | --- |\r\n| `logError` | `(componentSliceId, message, error?)` | Logs error + optional error object |\r\n| `logWarning` | `(componentSliceId, message)` | Logs warning |\r\n| `logInfo` | `(componentSliceId, message)` | Logs info |\r\n| `getLogs` | `()` | Returns all logs |\r\n| `clearLogs` | `()` | Clears stored logs |\r\n| `getLogsByLogType` | `(type)` | Filter by `error | warning | info` |\r\n| `getLogsByComponentCategory` | `(category)` | Filter by component category |\r\n| `getLogsByComponent` | `(sliceId)` | Filter by component sliceId |\r\n\r\n## Usage\r\n```javascript title=\"Log from a component\"\r\nexport default class Navbar extends HTMLElement {\r\n  async init() {\r\n    slice.logger.logInfo('Navbar', 'Navbar initialized');\r\n  }\r\n}\r\n```\r\n\r\n```javascript title=\"Log with error\"\r\ntry {\r\n  await doWork();\r\n} catch (error) {\r\n  slice.logger.logError('MyService', 'Work failed', error);\r\n}\r\n```\r\n\r\n## Notes\r\n- Logging is disabled when `logger.enabled` is false.\r\n- Log outputs depend on `logger.showLogs` configuration.\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\r\n  \"logger\": {\r\n    \"enabled\": true,\r\n    \"showLogs\": {\r\n      \"console\": { \"error\": true, \"warning\": true, \"info\": true }\r\n    }\r\n  }\r\n}\r",
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
            const lines = ["| Method | Signature | Notes |\r","| --- | --- | --- |\r","| `logError` | `(componentSliceId, message, error?)` | Logs error + optional error object |\r","| `logWarning` | `(componentSliceId, message)` | Logs warning |\r","| `logInfo` | `(componentSliceId, message)` | Logs info |\r","| `getLogs` | `()` | Returns all logs |\r","| `clearLogs` | `()` | Clears stored logs |\r","| `getLogsByLogType` | `(type)` | Filter by `error | warning | info` |\r","| `getLogsByComponentCategory` | `(category)` | Filter by component category |\r","| `getLogsByComponent` | `(sliceId)` | Filter by component sliceId |\r"];
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
               value: "export default class Navbar extends HTMLElement {\r\n  async init() {\r\n    slice.logger.logInfo('Navbar', 'Navbar initialized');\r\n  }\r\n}\r",
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
               value: "try {\r\n  await doWork();\r\n} catch (error) {\r\n  slice.logger.logError('MyService', 'Work failed', error);\r\n}\r",
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
