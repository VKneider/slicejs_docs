# Slice.js Markdown Parser

This parser converts markdown docs from `slicejs_docs/markdown` into Slice.js documentation
components in `slicejs_docs/src/Components/AppComponents` and updates routes/menus.

## Usage (planned)

```bash
node parser/index.js
```

## Goals
- Keep current folder/file structure
- Generate component HTML/JS/CSS from markdown
- Update `documentationRoutes.js`, `routes.js`, and `components.js`
- Support CodeVisualizer, Details, tips/warnings, and steps blocks
