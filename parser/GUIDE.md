# Markdown Parser Guide

## Supported blocks

- Headings (#, ##, ###)
- Paragraphs
- Unordered lists (-, *)
- Ordered lists (1.)
- Fenced code blocks (```js) -> CodeVisualizer
- :::details title="..." -> Details component
- :::tip and :::warning callouts
- :::steps -> ordered list
- :::component name="ComponentName" with JSON props in body
- :::html -> raw HTML block
- :::script -> inline JS for complex demos

## Component blocks

Use component blocks for interactive demos or existing components that cannot be expressed
with pure markdown. Provide JSON props in the block body.

Example:

:::component name="MultiRoute"
{
  "routes": [
    { "path": "/demo/button", "component": "ButtonDocumentation" },
    { "path": "/demo/input", "component": "InputDocumentation" }
  ]
}
:::

## Raw HTML blocks

Use raw HTML blocks only when necessary for layout or container structure.

:::html
<div class="my-demo"></div>
:::

## Inline script blocks

Use scripts for complex interactive demos that cannot be expressed with standard blocks.
The script runs in the component context with access to `component`, `slice`, and `document`.

:::script
const container = component.querySelector('.my-demo');
const button = await slice.build('Button', {
  value: 'Click me',
  onClickCallback: () => container.classList.toggle('active')
});
container.appendChild(button);
:::

## Limitations

- Inline HTML is not parsed.
- Nested lists are not supported.
- API tables are not parsed into structured data yet (rendered as plain HTML).
- Advanced custom JS logic requires manual components or a future :::script block.

## Notes on existing docs

Some documentation pages include interactive demos (MultiRoute, Routing). These may require
`:::component` blocks or custom JS handling beyond basic markdown conversion.
