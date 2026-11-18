export default class ApiReferenceDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "api-reference.md";
    this.markdownContent = "---\ntitle: Quick API Reference\nroute: /Documentation/API-Reference\nnavLabel: API Reference\nsection: Reference\ngroup: ''\norder: 10\ndescription: Every public slice.* method at a glance — build, props, cleanup, router, context, events, logger, env.\ncomponent: ApiReferenceDocumentation\ntags: [api, reference]\n---\n\n# Quick API Reference\n\nThe public `slice.*` surface in one page. Each section links to its full guide. Method names use\n`arg?` for optional arguments and `→` for the return.\n\n## Components & props\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.build` | `build(name, props?) → Promise<instance>` | Build and register a component; resolves to `null` if the name isn't registered. `props.singleton: true` get-or-creates a Service. |\n| `slice.getComponent` | `getComponent(sliceId) → instance` | Get a registered instance by `sliceId` (`undefined` if none). |\n| `slice.setComponentProps` | `setComponentProps(component, props) → void` | Apply props. Auto-detects **build** (applies defaults + validates) vs **refresh** (patch in place, no defaults). |\n| `slice.isComponentAlive` | `isComponentAlive(component) → boolean` | `true` while it's the live registered instance; `false` once destroyed or replaced. |\n| `slice.attachTemplate` | `attachTemplate(component) → void` | Inject the component's `.html`. The DOM is only queryable after this. |\n\nSee [Component Anatomy](/Documentation/Component-Anatomy) and\n[The build method](/Documentation/The-build-method).\n\n**Reserved props** (stripped before your setters run): `id` (HTML id), `sliceId` (registry id,\nauto-generated if omitted), `singleton` (Service-only get-or-create).\n\n## Cleanup\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.controller.destroyComponent` | `destroyComponent(target) → number` | Destroy one or many and their children; `target` is a `sliceId`, an element, or an array. Returns the count. |\n| `slice.controller.destroyByContainer` | `destroyByContainer(container) → number` | Destroy every Slice component nested in a DOM node. |\n| `slice.controller.destroyByPattern` | `destroyByPattern(pattern) → number` | Destroy components whose `sliceId` matches a string/RegExp. |\n\nDestroying runs `beforeDestroy()` and cleans the registry — see [Common Gotchas](/Documentation/Common-Gotchas).\n\n## Router\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.router.navigate` | `navigate(path, options?) → Promise<void>` | Navigate; `options.replace: true` uses history replace. |\n| `slice.router.start` | `start() → Promise<void>` | Start the router and load the first route (auto-starts otherwise). |\n| `slice.router.beforeEach` | `beforeEach((to, from, next) => …) → void` | Guard before each navigation; `next()` continues, `next(false)` cancels, `next('/path')` redirects. |\n| `slice.router.afterEach` | `afterEach((to, from) => …) → void` | Runs after navigation (cannot block). |\n\nRoute params use `${param}` (not `:param`); each captures **one** segment and arrives as a string.\nSee [Routing](/Documentation/Routing) and [Route Guards](/Documentation/Routing/Guards).\n\nComponents read the current page from the shortcuts, never from `window.location`:\n\n| Shortcut | Equivalent | Purpose |\n| --- | --- | --- |\n| `slice.path` | `slice.router.path` | The app path, without locale or query. |\n| `slice.href(path)` | `slice.router.href(path)` | The URL for an `<a>`, with the locale when `routing` is on. |\n\n## Translator\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.t` | `t(key, params?) → string` | Translate a key (shortcut of `slice.translator.t`). |\n| `slice.translator.setLocale` | `setLocale(locale) → Promise<string>` | Load and switch; updates `<html lang\\|dir>`, `data-t`, marker props and route metadata. |\n| `slice.translator.ref` | `key(key, params?) → TranslationRef` | Pass a key as a prop; the framework resolves it and re-assigns it on a locale change. |\n| `slice.translator.watch` | `watch(component, cb) → () => void` | Run `cb(locale, previous)` on every change, for text outside the DOM. |\n| `slice.translator.add` | `add(locale, messages, { defaults }) → void` | Merge messages at runtime; `defaults` never overrides the app's dictionaries. |\n| `slice.translator.setShowKeys` | `setShowKeys(enabled) → boolean` | Debugger: `t()` returns keys instead of texts and the document re-renders. |\n| `slice.translator.format.*` | `number / currency / percent / date / time / relative / list` | Locale-aware `Intl` formatting. |\n\nSee [Translating an app](/Documentation/Translator).\n\n## Context (shared state)\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.context.create` | `create(name, initialState?, options?) → boolean` | Create a context; `options.persist: true` saves to localStorage. |\n| `slice.context.getState` | `getState(name) → state` | Read the whole state. |\n| `slice.context.setState` | `setState(name, updater) → void` | Replace state, or pass `(prev) => next`. |\n| `slice.context.patch` | `patch(name, partial) → void` | Shallow-merge a partial (keeps the rest). |\n| `slice.context.watch` | `watch(name, component, cb, selector?) → id` | React to changes; auto-cleaned on destroy. `selector` narrows what re-runs the callback. |\n| `slice.context.use` | `use(name) → { get, set, patch, watch, bind, has, destroy }` | Bound API for one context. `.bind()` watches **and** fires once with the current value. |\n\nSee [ContextManager](/Documentation/Structural/ContextManager) and\n[Context vs Events](/Documentation/Structural/Context-vs-Events).\n\n## Events (pub/sub)\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.events.subscribe` | `subscribe(event, cb, options?) → id` | Run `cb` on every emit. Pass `options.component` for auto-cleanup. |\n| `slice.events.subscribeOnce` | `subscribeOnce(event, cb, options?) → id` | Fire once, then auto-unsubscribe. |\n| `slice.events.unsubscribe` | `unsubscribe(event, id) → boolean` | Remove a subscription by id. |\n| `slice.events.emit` | `emit(event, ...args) → void` | Fire an event to all subscribers. |\n| `slice.events.bind` | `bind(component) → { subscribe, subscribeOnce, emit }` | Component-bound API; subscriptions auto-clean on destroy. |\n\nSee [EventManager](/Documentation/Structural/EventManager).\n\n## Logger\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.logger.error` | `error(sliceId, message, error?) → void` | Log an error. |\n| `slice.logger.warn` | `warn(sliceId, message, error?) → void` | Log a warning. |\n| `slice.logger.info` | `info(sliceId, message, error?) → void` | Log info. |\n| `slice.logger.debug` | `debug(sliceId, message, error?) → void` | Log debug detail. |\n\nThe old `logError` / `logWarning` / `logInfo` names still work but are **deprecated** — prefer\n`error` / `warn` / `info`. See [Logger](/Documentation/Structural/Logger).\n\n## Environment & theme\n| Method | Signature | Purpose |\n| --- | --- | --- |\n| `slice.getEnv` | `getEnv(name, fallback?) → string` | Read one `SLICE_PUBLIC_*` variable. |\n| `slice.env.bool` | `env.bool(name, fallback?) → boolean` | Parse `1/true/yes/on` as `true`. |\n| `slice.env.int` | `env.int(name, fallback?) → number` | Parse an integer (fallback on `NaN`). |\n| `slice.env.list` | `env.list(name, fallback?) → string[]` | Split a CSV, trimmed. |\n| `slice.env.has` | `env.has(name) → boolean` | Whether the variable is set. |\n| `slice.setTheme` | `setTheme(name) → Promise<void>` | Apply a theme. |\n| `slice.theme` | `theme → string` | Current theme name. |\n| `slice.isProduction` | `isProduction() → boolean` | Runtime mode (reliable after `init()`). |\n\nSee [Environment Variables](/Documentation/Configuration/environment-variables) and\n[Themes](/Documentation/Themes).\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Reference"}]
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
               headers: ["Method","Signature","Purpose"],
               rows: [[{"html":"<code>slice.build</code>"},{"html":"<code>build(name, props?) → Promise&lt;instance&gt;</code>"},{"html":"Build and register a component; resolves to <code>null</code> if the name isn't registered. <code>props.singleton: true</code> get-or-creates a Service."}],[{"html":"<code>slice.getComponent</code>"},{"html":"<code>getComponent(sliceId) → instance</code>"},{"html":"Get a registered instance by <code>sliceId</code> (<code>undefined</code> if none)."}],[{"html":"<code>slice.setComponentProps</code>"},{"html":"<code>setComponentProps(component, props) → void</code>"},{"html":"Apply props. Auto-detects <strong>build</strong> (applies defaults + validates) vs <strong>refresh</strong> (patch in place, no defaults)."}],[{"html":"<code>slice.isComponentAlive</code>"},{"html":"<code>isComponentAlive(component) → boolean</code>"},{"html":"<code>true</code> while it's the live registered instance; <code>false</code> once destroyed or replaced."}],[{"html":"<code>slice.attachTemplate</code>"},{"html":"<code>attachTemplate(component) → void</code>"},{"html":"Inject the component's <code>.html</code>. The DOM is only queryable after this."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Purpose"],
               rows: [[{"html":"<code>slice.controller.destroyComponent</code>"},{"html":"<code>destroyComponent(target) → number</code>"},{"html":"Destroy one or many and their children; <code>target</code> is a <code>sliceId</code>, an element, or an array. Returns the count."}],[{"html":"<code>slice.controller.destroyByContainer</code>"},{"html":"<code>destroyByContainer(container) → number</code>"},{"html":"Destroy every Slice component nested in a DOM node."}],[{"html":"<code>slice.controller.destroyByPattern</code>"},{"html":"<code>destroyByPattern(pattern) → number</code>"},{"html":"Destroy components whose <code>sliceId</code> matches a string/RegExp."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Purpose"],
               rows: [[{"html":"<code>slice.router.navigate</code>"},{"html":"<code>navigate(path, options?) → Promise&lt;void&gt;</code>"},{"html":"Navigate; <code>options.replace: true</code> uses history replace."}],[{"html":"<code>slice.router.start</code>"},{"html":"<code>start() → Promise&lt;void&gt;</code>"},{"html":"Start the router and load the first route (auto-starts otherwise)."}],[{"html":"<code>slice.router.beforeEach</code>"},{"html":"<code>beforeEach((to, from, next) =&gt; …) → void</code>"},{"html":"Guard before each navigation; <code>next()</code> continues, <code>next(false)</code> cancels, <code>next('/path')</code> redirects."}],[{"html":"<code>slice.router.afterEach</code>"},{"html":"<code>afterEach((to, from) =&gt; …) → void</code>"},{"html":"Runs after navigation (cannot block)."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Shortcut","Equivalent","Purpose"],
               rows: [[{"html":"<code>slice.path</code>"},{"html":"<code>slice.router.path</code>"},{"html":"The app path, without locale or query."}],[{"html":"<code>slice.href(path)</code>"},{"html":"<code>slice.router.href(path)</code>"},{"html":"The URL for an <code>&lt;a&gt;</code>, with the locale when <code>routing</code> is on."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Purpose"],
               rows: [[{"html":"<code>slice.t</code>"},{"html":"<code>t(key, params?) → string</code>"},{"html":"Translate a key (shortcut of <code>slice.translator.t</code>)."}],[{"html":"<code>slice.translator.setLocale</code>"},{"html":"<code>setLocale(locale) → Promise&lt;string&gt;</code>"},{"html":"Load and switch; updates <code>&lt;html lang|dir&gt;</code>, <code>data-t</code>, marker props and route metadata."}],[{"html":"<code>slice.translator.ref</code>"},{"html":"<code>key(key, params?) → TranslationRef</code>"},{"html":"Pass a key as a prop; the framework resolves it and re-assigns it on a locale change."}],[{"html":"<code>slice.translator.watch</code>"},{"html":"<code>watch(component, cb) → () =&gt; void</code>"},{"html":"Run <code>cb(locale, previous)</code> on every change, for text outside the DOM."}],[{"html":"<code>slice.translator.add</code>"},{"html":"<code>add(locale, messages, { defaults }) → void</code>"},{"html":"Merge messages at runtime; <code>defaults</code> never overrides the app's dictionaries."}],[{"html":"<code>slice.translator.setShowKeys</code>"},{"html":"<code>setShowKeys(enabled) → boolean</code>"},{"html":"Debugger: <code>t()</code> returns keys instead of texts and the document re-renders."}],[{"html":"<code>slice.translator.format.*</code>"},{"html":"<code>number / currency / percent / date / time / relative / list</code>"},{"html":"Locale-aware <code>Intl</code> formatting."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Purpose"],
               rows: [[{"html":"<code>slice.context.create</code>"},{"html":"<code>create(name, initialState?, options?) → boolean</code>"},{"html":"Create a context; <code>options.persist: true</code> saves to localStorage."}],[{"html":"<code>slice.context.getState</code>"},{"html":"<code>getState(name) → state</code>"},{"html":"Read the whole state."}],[{"html":"<code>slice.context.setState</code>"},{"html":"<code>setState(name, updater) → void</code>"},{"html":"Replace state, or pass <code>(prev) =&gt; next</code>."}],[{"html":"<code>slice.context.patch</code>"},{"html":"<code>patch(name, partial) → void</code>"},{"html":"Shallow-merge a partial (keeps the rest)."}],[{"html":"<code>slice.context.watch</code>"},{"html":"<code>watch(name, component, cb, selector?) → id</code>"},{"html":"React to changes; auto-cleaned on destroy. <code>selector</code> narrows what re-runs the callback."}],[{"html":"<code>slice.context.use</code>"},{"html":"<code>use(name) → { get, set, patch, watch, bind, has, destroy }</code>"},{"html":"Bound API for one context. <code>.bind()</code> watches <strong>and</strong> fires once with the current value."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Purpose"],
               rows: [[{"html":"<code>slice.events.subscribe</code>"},{"html":"<code>subscribe(event, cb, options?) → id</code>"},{"html":"Run <code>cb</code> on every emit. Pass <code>options.component</code> for auto-cleanup."}],[{"html":"<code>slice.events.subscribeOnce</code>"},{"html":"<code>subscribeOnce(event, cb, options?) → id</code>"},{"html":"Fire once, then auto-unsubscribe."}],[{"html":"<code>slice.events.unsubscribe</code>"},{"html":"<code>unsubscribe(event, id) → boolean</code>"},{"html":"Remove a subscription by id."}],[{"html":"<code>slice.events.emit</code>"},{"html":"<code>emit(event, ...args) → void</code>"},{"html":"Fire an event to all subscribers."}],[{"html":"<code>slice.events.bind</code>"},{"html":"<code>bind(component) → { subscribe, subscribeOnce, emit }</code>"},{"html":"Component-bound API; subscriptions auto-clean on destroy."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Purpose"],
               rows: [[{"html":"<code>slice.logger.error</code>"},{"html":"<code>error(sliceId, message, error?) → void</code>"},{"html":"Log an error."}],[{"html":"<code>slice.logger.warn</code>"},{"html":"<code>warn(sliceId, message, error?) → void</code>"},{"html":"Log a warning."}],[{"html":"<code>slice.logger.info</code>"},{"html":"<code>info(sliceId, message, error?) → void</code>"},{"html":"Log info."}],[{"html":"<code>slice.logger.debug</code>"},{"html":"<code>debug(sliceId, message, error?) → void</code>"},{"html":"Log debug detail."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Purpose"],
               rows: [[{"html":"<code>slice.getEnv</code>"},{"html":"<code>getEnv(name, fallback?) → string</code>"},{"html":"Read one <code>SLICE_PUBLIC_*</code> variable."}],[{"html":"<code>slice.env.bool</code>"},{"html":"<code>env.bool(name, fallback?) → boolean</code>"},{"html":"Parse <code>1/true/yes/on</code> as <code>true</code>."}],[{"html":"<code>slice.env.int</code>"},{"html":"<code>env.int(name, fallback?) → number</code>"},{"html":"Parse an integer (fallback on <code>NaN</code>)."}],[{"html":"<code>slice.env.list</code>"},{"html":"<code>env.list(name, fallback?) → string[]</code>"},{"html":"Split a CSV, trimmed."}],[{"html":"<code>slice.env.has</code>"},{"html":"<code>env.has(name) → boolean</code>"},{"html":"Whether the variable is set."}],[{"html":"<code>slice.setTheme</code>"},{"html":"<code>setTheme(name) → Promise&lt;void&gt;</code>"},{"html":"Apply a theme."}],[{"html":"<code>slice.theme</code>"},{"html":"<code>theme → string</code>"},{"html":"Current theme name."}],[{"html":"<code>slice.isProduction</code>"},{"html":"<code>isProduction() → boolean</code>"},{"html":"Runtime mode (reliable after <code>init()</code>)."}]]
            });
            if (table) {
               container.appendChild(table);
            }
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

customElements.define('slice-apireferencedocumentation', ApiReferenceDocumentation);
