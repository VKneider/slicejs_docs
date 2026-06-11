export default class ComponentStylesDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/component-styles.md";
    this.markdownContent = "---\ntitle: Component Styles\nroute: /Documentation/Architecture/Component-Styles\nnavLabel: Component Styles\nsection: Project Architecture\ngroup: Styles and Patterns\norder: 7\ndescription: How to write a component's CSS so it stays encapsulated — scope every selector under the component tag, declare an explicit host display, and prefix keyframes.\ncomponent: ComponentStylesDocumentation\ntags: [css, styles, scoping, encapsulation, display, keyframes]\n---\n\n# Component Styles\n\nA Slice component owns three files — `.js`, `.html`, and `.css`. The `.css` is loaded\nonce when the component is first built and then applies **globally** to the page. That\nlast word is the whole reason this page exists: nothing about a `.css` file is\nautomatically scoped to its component. Encapsulation is a convention you follow, not\nsomething the framework enforces.\n\nThree rules keep component styles from leaking into — or being broken by — the rest of\nyour app.\n\n## 1. Scope every selector under the component tag\n\nRoot every selector at the component's custom-element tag, never a bare class. The tag is\nwhatever the component registers with `customElements.define('slice-...')`.\n\n```css title=\"MyCard.css\"\n/* ❌ leaks: every .card-title anywhere on the page is restyled */\n.card-title { font-size: 1.25rem; }\n\n/* ✅ encapsulated: only inside <slice-my-card> */\nslice-my-card .card-title { font-size: 1.25rem; }\n```\n\nGeneric names (`.container`, `.item`, `.title`, `.header`) are the ones that bite — two\ncomponents each defining a bare `.title` will silently overwrite each other. Prefixing\nwith the tag makes collisions impossible.\n\n:::warning\n`@media` and `@supports` blocks are not an exception. Scope the selectors **inside** them\ntoo: `@media (max-width: 600px) { slice-my-card .card-title { ... } }`.\n:::\n\n## 2. Declare an explicit host display\n\nA custom element with no `display` rule defaults to `display: inline`. For most\ncomponents that is wrong and surprising: `width` and `height` are ignored, vertical\n`margin` is dropped, and the element sits on the text baseline. Always set `display` on\nthe tag as the first rule of the file.\n\n```css\nslice-my-card { display: block; }          /* layout / form / data blocks */\nslice-my-chip { display: inline-block; }   /* content-sized inline controls */\n```\n\n| `display` | Use for |\n| --- | --- |\n| `block` | form fields, layout and data containers, full-width strips |\n| `inline-block` | content-sized interactive controls that should flow inline |\n| `inline-flex` / `flex` | when the host element itself is the flex container |\n| `contents` | pure wrappers that must not introduce a box of their own |\n\n:::tip\nThe tag selector has low specificity, so wherever you *use* the component you can still\noverride it (`slice-my-card { display: flex }` in your app styles). Declaring a host\n`display` only removes the broken `inline` default — it never locks layout.\n:::\n\n## 3. Prefix keyframes with the component name\n\n`@keyframes` names are global. A bare `@keyframes spin` in two components is a collision\nwaiting to happen — prefix every keyframe.\n\n```css\n/* ❌ */ @keyframes spin { ... }\n/* ✅ */ @keyframes slice_my_card_spin { ... }\n```\n\n## The one exception: elements you move to the body\n\nIf your component appends an element to `document.body` (a tooltip bubble, a toast stack,\na portaled overlay), that element no longer lives inside your tag, so a `slice-tag`\ndescendant selector can't reach it. Those — and only those — stay as globally-unique\nclasses. Give them a name unlikely to collide and a comment saying why.\n\n```css\n/* Appended to document.body, so it can't be scoped under the tag. */\n.slice-my-tooltip-bubble { position: fixed; ... }\n```\n\n:::warning\nThis exception is narrow. If an element is in your component's template (queried with\n`this.querySelector` after `slice.attachTemplate`), it lives inside the tag — scope it.\nOnly reach for a global class when you genuinely `document.body.appendChild(...)` it.\n:::\n\n## Checklist\n\n| Check | Rule |\n| --- | --- |\n| Every selector starts with `slice-<tag>` (or is a documented body-portal exception) | §1 |\n| Selectors inside `@media` / `@supports` are scoped too | §1 |\n| The tag has an explicit `display` as the first rule | §2 |\n| Every `@keyframes` is prefixed with the component name | §3 |\n\n## Related\n\n- [Themes](/Documentation/Themes) — the CSS variable tokens (`--primary-color`,\n  `--font-primary-color`, …) your scoped component styles should use instead of hard-coded\n  colors, so components follow the active theme.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "/* ❌ leaks: every .card-title anywhere on the page is restyled */\n.card-title { font-size: 1.25rem; }\n\n/* ✅ encapsulated: only inside <slice-my-card> */\nslice-my-card .card-title { font-size: 1.25rem; }",
               language: "css"
            });
            if ("MyCard.css") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "MyCard.css";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice-my-card { display: block; }          /* layout / form / data blocks */\nslice-my-chip { display: inline-block; }   /* content-sized inline controls */",
               language: "css"
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
            const lines = ["| `display` | Use for |","| --- | --- |","| `block` | form fields, layout and data containers, full-width strips |","| `inline-block` | content-sized interactive controls that should flow inline |","| `inline-flex` / `flex` | when the host element itself is the flex container |","| `contents` | pure wrappers that must not introduce a box of their own |"];
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
            const code = await slice.build('CodeVisualizer', {
               value: "/* ❌ */ @keyframes spin { ... }\n/* ✅ */ @keyframes slice_my_card_spin { ... }",
               language: "css"
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
               value: "/* Appended to document.body, so it can't be scoped under the tag. */\n.slice-my-tooltip-bubble { position: fixed; ... }",
               language: "css"
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
            const lines = ["| Check | Rule |","| --- | --- |","| Every selector starts with `slice-<tag>` (or is a documented body-portal exception) | §1 |","| Selectors inside `@media` / `@supports` are scoped too | §1 |","| The tag has an explicit `display` as the first rule | §2 |","| Every `@keyframes` is prefixed with the component name | §3 |"];
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

customElements.define('slice-componentstylesdocumentation', ComponentStylesDocumentation);
