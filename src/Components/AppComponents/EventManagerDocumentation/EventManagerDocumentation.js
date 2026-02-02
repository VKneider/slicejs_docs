export default class EventManagerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
      await this.appendCodeBlock("doc-block-1", "{\n  \"events\": { \"enabled\": true }\n}", "json", null);
      await this.appendCodeBlock("doc-block-2", "this.events = slice.events.bind(this);\nthis.events.subscribe(\"user:logout\", () => this.resetUI());", "javascript", "Component-bound subscription (recommended)");
      await this.appendCodeBlock("doc-block-3", "slice.events.subscribe(\"user:logout\", () => this.resetUI(), { component: this });", "javascript", "Component-bound without bind()");
      await this.appendCodeBlock("doc-block-4", "slice.events.subscribeOnce(\"app:ready\", () => {\n  console.log(\"App ready\");\n});", "javascript", "One-time initialization");
      await this.appendCodeBlock("doc-block-5", "slice.events.emit(\"notification:show\", {\n  type: \"success\",\n  message: \"Saved\"\n});", "javascript", "Global notification");
      await this.appendCodeBlock("doc-block-6", "export default class NotificationService {\n  notify(message, type = \"info\") {\n    slice.events.emit(\"notification:show\", { message, type });\n  }\n}\n\nexport default class Toasts extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe(\"notification:show\", ({ message, type }) => {\n      this.showToast(message, type);\n    });\n  }\n}", "javascript", "Service emits, UI listens");
      await this.appendCodeBlock("doc-block-7", "if (slice.events.hasSubscribers(\"cart:updated\")) {\n  slice.events.emit(\"cart:updated\", { items: 3 });\n}", "javascript", "Check if anyone is listening");
      await this.appendDetailsBlock("doc-block-8", "Should I use EventManager for shared state?", "No. Use ContextManager for shared state. EventManager is for ephemeral signals.");
      await this.appendDetailsBlock("doc-block-9", "What happens if events are disabled?", "Slice.js provides a no-op implementation so calls to `slice.events` are safe.");
      await this.appendDetailsBlock("doc-block-10", "Do I need to unsubscribe manually?", "Only if you are not using `bind()` or `options.component`. Component-bound subscriptions auto-clean.");
      await this.appendDetailsBlock("doc-block-11", "Can I debug event usage?", "Use `hasSubscribers` or `subscriberCount` for diagnostics in development.");
  }

  async appendCodeBlock(blockId, value, language, title = null) {
    const container = this.querySelector('[data-block-id="' + blockId + '"]');
    if (!container) return;

    const code = await slice.build('CodeVisualizer', {
      value,
      language
    });

    if (title) {
      const label = document.createElement('div');
      label.classList.add('code-block-title');
      label.textContent = title;
      container.appendChild(label);
    }

    container.appendChild(code);
  }

  async appendDetailsBlock(blockId, title, text) {
    const container = this.querySelector('[data-block-id="' + blockId + '"]');
    if (!container) return;

    const details = await slice.build('Details', { title, text });
    container.appendChild(details);
  }

  async appendComponentBlock(blockId, componentName, propsText) {
    const container = this.querySelector('[data-block-id="' + blockId + '"]');
    if (!container || !componentName) return;

    let props = {};
    if (propsText) {
      try {
        props = JSON.parse(propsText);
      } catch (error) {
        console.warn('Invalid component props JSON:', error);
      }
    }

    const component = await slice.build(componentName, props);
    container.appendChild(component);
  }

  async runInlineScript(scriptContent) {
    if (!scriptContent) return;
    try {
      const fn = new Function('component', 'slice', 'document', scriptContent);
      await fn(this, slice, document);
    } catch (error) {
      console.warn('Inline script failed:', error);
    }
  }
}

customElements.define('slice-eventmanagerdocumentation', EventManagerDocumentation);
