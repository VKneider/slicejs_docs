export default class ApiReferenceDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "api-reference.md";
    this.markdownContent = "---\ntitle: Quick API Reference\nroute: /Documentation/API-Reference\nnavLabel: API Reference\nsection: Introduction\ngroup: Reference\norder: 4\ndescription: Every public slice.* method at a glance — build, props, cleanup, router, context, events, logger, env.\ncomponent: ApiReferenceDocumentation\ntags: [api, reference]\n---\n\n# Quick API Reference\n\nThe public `slice.*` surface in one page. Each section links to its full guide. Method names use\n`arg?` for optional arguments and `→` for the return.\n\n## Components & props\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.build` | `build(name, props?) → Promise<instance>` | Build and register a component; resolves to `null` if the name isn't registered. `props.singleton: true` get-or-creates a Service. |\n| `slice.getComponent` | `getComponent(sliceId) → instance` | Get a registered instance by `sliceId` (`undefined` if none). |\n| `slice.setComponentProps` | `setComponentProps(component, props) → void` | Apply props. Auto-detects **build** (applies defaults + validates) vs **refresh** (patch in place, no defaults). |\n| `slice.isComponentAlive` | `isComponentAlive(component) → boolean` | `true` while it's the live registered instance; `false` once destroyed or replaced. |\n| `slice.attachTemplate` | `attachTemplate(component) → void` | Inject the component's `.html`. The DOM is only queryable after this. |\n\nSee [Component Anatomy](/Documentation/Component-Anatomy) and\n[The build method](/Documentation/The-build-method).\n\n**Reserved props** (stripped before your setters run): `id` (HTML id), `sliceId` (registry id,\nauto-generated if omitted), `singleton` (Service-only get-or-create).\n\n## Cleanup\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.controller.destroyComponent` | `destroyComponent(target) → number` | Destroy one or many and their children; `target` is a `sliceId`, an element, or an array. Returns the count. |\n| `slice.controller.destroyByContainer` | `destroyByContainer(container) → number` | Destroy every Slice component nested in a DOM node. |\n| `slice.controller.destroyByPattern` | `destroyByPattern(pattern) → number` | Destroy components whose `sliceId` matches a string/RegExp. |\n\nDestroying runs `beforeDestroy()` and cleans the registry — see [Common Gotchas](/Documentation/Common-Gotchas).\n\n## Router\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.router.navigate` | `navigate(path, options?) → Promise<void>` | Navigate; `options.replace: true` uses history replace. |\n| `slice.router.start` | `start() → Promise<void>` | Start the router and load the first route (auto-starts otherwise). |\n| `slice.router.beforeEach` | `beforeEach((to, from, next) => …) → void` | Guard before each navigation; `next()` continues, `next(false)` cancels, `next('/path')` redirects. |\n| `slice.router.afterEach` | `afterEach((to, from) => …) → void` | Runs after navigation (cannot block). |\n\nRoute params use `${param}` (not `:param`); each captures **one** segment and arrives as a string.\nSee [Routing](/Documentation/Routing) and [Route Guards](/Documentation/Routing/Guards).\n\n## Context (shared state)\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.context.create` | `create(name, initialState?, options?) → boolean` | Create a context; `options.persist: true` saves to localStorage. |\n| `slice.context.getState` | `getState(name) → state` | Read the whole state. |\n| `slice.context.setState` | `setState(name, updater) → void` | Replace state, or pass `(prev) => next`. |\n| `slice.context.patch` | `patch(name, partial) → void` | Shallow-merge a partial (keeps the rest). |\n| `slice.context.watch` | `watch(name, component, cb, selector?) → id` | React to changes; auto-cleaned on destroy. `selector` narrows what re-runs the callback. |\n| `slice.context.use` | `use(name) → { get, set, patch, watch, bind, has, destroy }` | Bound API for one context. `.bind()` watches **and** fires once with the current value. |\n\nSee [ContextManager](/Documentation/Structural/ContextManager) and\n[Context vs Events](/Documentation/Structural/Context-vs-Events).\n\n## Events (pub/sub)\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.events.subscribe` | `subscribe(event, cb, options?) → id` | Run `cb` on every emit. Pass `options.component` for auto-cleanup. |\n| `slice.events.subscribeOnce` | `subscribeOnce(event, cb, options?) → id` | Fire once, then auto-unsubscribe. |\n| `slice.events.unsubscribe` | `unsubscribe(event, id) → boolean` | Remove a subscription by id. |\n| `slice.events.emit` | `emit(event, ...args) → void` | Fire an event to all subscribers. |\n| `slice.events.bind` | `bind(component) → { subscribe, subscribeOnce, emit }` | Component-bound API; subscriptions auto-clean on destroy. |\n\nSee [EventManager](/Documentation/Structural/EventManager).\n\n## Logger\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.logger.error` | `error(sliceId, message, error?) → void` | Log an error. |\n| `slice.logger.warn` | `warn(sliceId, message, error?) → void` | Log a warning. |\n| `slice.logger.info` | `info(sliceId, message, error?) → void` | Log info. |\n| `slice.logger.debug` | `debug(sliceId, message, error?) → void` | Log debug detail. |\n\nThe old `logError` / `logWarning` / `logInfo` names still work but are **deprecated** — prefer\n`error` / `warn` / `info`. See [Logger](/Documentation/Structural/Logger).\n\n## Environment & theme\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.getEnv` | `getEnv(name, fallback?) → string` | Read one `SLICE_PUBLIC_*` variable. |\n| `slice.env.bool` | `env.bool(name, fallback?) → boolean` | Parse `1/true/yes/on` as `true`. |\n| `slice.env.int` | `env.int(name, fallback?) → number` | Parse an integer (fallback on `NaN`). |\n| `slice.env.list` | `env.list(name, fallback?) → string[]` | Split a CSV, trimmed. |\n| `slice.env.has` | `env.has(name) → boolean` | Whether the variable is set. |\n| `slice.setTheme` | `setTheme(name) → Promise<void>` | Apply a theme. |\n| `slice.theme` | `theme → string` | Current theme name. |\n| `slice.isProduction` | `isProduction() → boolean` | Runtime mode (reliable after `init()`). |\n\nSee [Environment Variables](/Documentation/Configuration/environment-variables) and\n[Themes](/Documentation/Themes).\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Purpose |","| --- | --- | --- |","| `slice.build` | `build(name, props?) → Promise<instance>` | Build and register a component; resolves to `null` if the name isn't registered. `props.singleton: true` get-or-creates a Service. |","| `slice.getComponent` | `getComponent(sliceId) → instance` | Get a registered instance by `sliceId` (`undefined` if none). |","| `slice.setComponentProps` | `setComponentProps(component, props) → void` | Apply props. Auto-detects **build** (applies defaults + validates) vs **refresh** (patch in place, no defaults). |","| `slice.isComponentAlive` | `isComponentAlive(component) → boolean` | `true` while it's the live registered instance; `false` once destroyed or replaced. |","| `slice.attachTemplate` | `attachTemplate(component) → void` | Inject the component's `.html`. The DOM is only queryable after this. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const lines = ["| Method | Signature | Purpose |","| --- | --- | --- |","| `slice.controller.destroyComponent` | `destroyComponent(target) → number` | Destroy one or many and their children; `target` is a `sliceId`, an element, or an array. Returns the count. |","| `slice.controller.destroyByContainer` | `destroyByContainer(container) → number` | Destroy every Slice component nested in a DOM node. |","| `slice.controller.destroyByPattern` | `destroyByPattern(pattern) → number` | Destroy components whose `sliceId` matches a string/RegExp. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const lines = ["| Method | Signature | Purpose |","| --- | --- | --- |","| `slice.router.navigate` | `navigate(path, options?) → Promise<void>` | Navigate; `options.replace: true` uses history replace. |","| `slice.router.start` | `start() → Promise<void>` | Start the router and load the first route (auto-starts otherwise). |","| `slice.router.beforeEach` | `beforeEach((to, from, next) => …) → void` | Guard before each navigation; `next()` continues, `next(false)` cancels, `next('/path')` redirects. |","| `slice.router.afterEach` | `afterEach((to, from) => …) → void` | Runs after navigation (cannot block). |"];
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const lines = ["| Method | Signature | Purpose |","| --- | --- | --- |","| `slice.context.create` | `create(name, initialState?, options?) → boolean` | Create a context; `options.persist: true` saves to localStorage. |","| `slice.context.getState` | `getState(name) → state` | Read the whole state. |","| `slice.context.setState` | `setState(name, updater) → void` | Replace state, or pass `(prev) => next`. |","| `slice.context.patch` | `patch(name, partial) → void` | Shallow-merge a partial (keeps the rest). |","| `slice.context.watch` | `watch(name, component, cb, selector?) → id` | React to changes; auto-cleaned on destroy. `selector` narrows what re-runs the callback. |","| `slice.context.use` | `use(name) → { get, set, patch, watch, bind, has, destroy }` | Bound API for one context. `.bind()` watches **and** fires once with the current value. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const lines = ["| Method | Signature | Purpose |","| --- | --- | --- |","| `slice.events.subscribe` | `subscribe(event, cb, options?) → id` | Run `cb` on every emit. Pass `options.component` for auto-cleanup. |","| `slice.events.subscribeOnce` | `subscribeOnce(event, cb, options?) → id` | Fire once, then auto-unsubscribe. |","| `slice.events.unsubscribe` | `unsubscribe(event, id) → boolean` | Remove a subscription by id. |","| `slice.events.emit` | `emit(event, ...args) → void` | Fire an event to all subscribers. |","| `slice.events.bind` | `bind(component) → { subscribe, subscribeOnce, emit }` | Component-bound API; subscriptions auto-clean on destroy. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const lines = ["| Method | Signature | Purpose |","| --- | --- | --- |","| `slice.logger.error` | `error(sliceId, message, error?) → void` | Log an error. |","| `slice.logger.warn` | `warn(sliceId, message, error?) → void` | Log a warning. |","| `slice.logger.info` | `info(sliceId, message, error?) → void` | Log info. |","| `slice.logger.debug` | `debug(sliceId, message, error?) → void` | Log debug detail. |"];
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
            const lines = ["| Method | Signature | Purpose |","| --- | --- | --- |","| `slice.getEnv` | `getEnv(name, fallback?) → string` | Read one `SLICE_PUBLIC_*` variable. |","| `slice.env.bool` | `env.bool(name, fallback?) → boolean` | Parse `1/true/yes/on` as `true`. |","| `slice.env.int` | `env.int(name, fallback?) → number` | Parse an integer (fallback on `NaN`). |","| `slice.env.list` | `env.list(name, fallback?) → string[]` | Split a CSV, trimmed. |","| `slice.env.has` | `env.has(name) → boolean` | Whether the variable is set. |","| `slice.setTheme` | `setTheme(name) → Promise<void>` | Apply a theme. |","| `slice.theme` | `theme → string` | Current theme name. |","| `slice.isProduction` | `isProduction() → boolean` | Runtime mode (reliable after `init()`). |"];
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

customElements.define('slice-apireferencedocumentation', ApiReferenceDocumentation);
