export default class TheBuildMethod extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/build-method.md";
    this.markdownContent = "---\r\ntitle: The build method\r\nroute: /Documentation/The-build-method\r\nnavLabel: The build method\r\nsection: Getting Started\r\ngroup: Components\r\norder: 31\r\ndescription: Use slice.build to create components.\r\ncomponent: TheBuildMethod\r\ntags: [build, components]\r\n---\r\n\r\n# The build method\r\n\r\n## Overview\r\n`slice.build(componentName, props)` creates a component instance, applies Static Props, runs\r\n`init()`, and registers the component with the controller. It returns a ready-to-append component\r\ninstance.\r\n\r\nThis is the standard way to create Visual, App, and Service components in Slice.js.\r\n\r\n## API\r\n| Parameter | Type | Required | Notes |\r\n| --- | --- | --- | --- |\r\n| `componentName` | `string` | yes | Must exist in `components.js`. |\r\n| `props` | `object` | no | Public props for the component. |\r\n\r\n| Returns | Type | Notes |\r\n| --- | --- | --- |\r\n| component instance | `HTMLElement | Object | null` | Returns `null` on error. |\r\n\r\n## Lifecycle Steps\r\n1. Validate component name.\r\n2. Load template, class, and CSS (visual components only).\r\n3. Instantiate component and apply props.\r\n4. Call `init()` if present.\r\n5. Register component in the controller and component tree.\r\n\r\n## Basic Usage\r\n```javascript title=\"Basic build\"\r\nconst myButton = await slice.build('Button', {\r\n  value: 'Click me'\r\n});\r\n\r\ndocument.querySelector('#container').appendChild(myButton);\r\n```\r\n\r\n## Props and Defaults\r\n```javascript title=\"Props are applied immediately\"\r\nconst card = await slice.build('Card', {\r\n  title: 'My Card',\r\n  text: 'Card content',\r\n  icon: { name: 'star', iconStyle: 'filled' }\r\n});\r\n\r\n// Card now has this.title, this.text, this.icon\r\n```\r\n\r\n## id and sliceId\r\n`id` and `sliceId` are handled specially. They are assigned to the instance and then removed\r\nfrom the props object before Static Props are applied.\r\n\r\n```javascript title=\"Use sliceId for lookup\"\r\nconst navbar = await slice.build('Navbar', {\r\n  sliceId: 'main-navbar',\r\n  logo: { src: '/logo.png', path: '/' },\r\n  items: [{ text: 'Home', path: '/' }]\r\n});\r\n\r\nconst sameNavbar = slice.controller.getComponent('main-navbar');\r\n```\r\n\r\n## Nested Components\r\n```javascript title=\"Build children and compose\"\r\nconst grid = await slice.build('Grid', { columns: 3, rows: 1 });\r\nconst card1 = await slice.build('Card', { title: 'Card 1' });\r\nconst card2 = await slice.build('Card', { title: 'Card 2' });\r\nconst card3 = await slice.build('Card', { title: 'Card 3' });\r\n\r\nawait grid.setItem(card1);\r\nawait grid.setItem(card2);\r\nawait grid.setItem(card3);\r\n\r\nthis.appendChild(grid);\r\n```\r\n\r\n## Error Cases\r\n- Missing or non-string component name\r\n- Component not listed in `components.js`\r\n- Structural components cannot be built\r\n\r\n## Best Practices\r\n:::tip\r\nAlways await `slice.build()` to ensure templates, CSS, and `init()` are finished.\r\n:::\r\n\r\n:::tip\r\nUse `sliceId` only when you need to retrieve a component later.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\nBuilding a component can return `null` if the component is missing or fails to load.\r\n:::\r\n\r\n:::warning\r\nStructural components are created by the framework and cannot be built directly.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Parameter | Type | Required | Notes |\r","| --- | --- | --- | --- |\r","| `componentName` | `string` | yes | Must exist in `components.js`. |\r","| `props` | `object` | no | Public props for the component. |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const lines = ["| Returns | Type | Notes |\r","| --- | --- | --- |\r","| component instance | `HTMLElement | Object | null` | Returns `null` on error. |\r"];
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
               value: "const myButton = await slice.build('Button', {\r\n  value: 'Click me'\r\n});\r\n\r\ndocument.querySelector('#container').appendChild(myButton);\r",
               language: "javascript"
            });
            if ("Basic build") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Basic build";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const card = await slice.build('Card', {\r\n  title: 'My Card',\r\n  text: 'Card content',\r\n  icon: { name: 'star', iconStyle: 'filled' }\r\n});\r\n\r\n// Card now has this.title, this.text, this.icon\r",
               language: "javascript"
            });
            if ("Props are applied immediately") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Props are applied immediately";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const navbar = await slice.build('Navbar', {\r\n  sliceId: 'main-navbar',\r\n  logo: { src: '/logo.png', path: '/' },\r\n  items: [{ text: 'Home', path: '/' }]\r\n});\r\n\r\nconst sameNavbar = slice.controller.getComponent('main-navbar');\r",
               language: "javascript"
            });
            if ("Use sliceId for lookup") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Use sliceId for lookup";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const grid = await slice.build('Grid', { columns: 3, rows: 1 });\r\nconst card1 = await slice.build('Card', { title: 'Card 1' });\r\nconst card2 = await slice.build('Card', { title: 'Card 2' });\r\nconst card3 = await slice.build('Card', { title: 'Card 3' });\r\n\r\nawait grid.setItem(card1);\r\nawait grid.setItem(card2);\r\nawait grid.setItem(card3);\r\n\r\nthis.appendChild(grid);\r",
               language: "javascript"
            });
            if ("Build children and compose") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Build children and compose";
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

customElements.define('slice-thebuildmethod', TheBuildMethod);
