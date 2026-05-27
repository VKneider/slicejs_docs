<div align="center">
  <img src="https://raw.githubusercontent.com/VKneider/slicejs_docs/master/src/images/Slice.js-logo.svg" alt="Slice.js logo" width="120" />
  <h3>Slice.js Markdown Parser</h3>
  <p>Converts markdown files into Slice.js components for the documentation site</p>
</div>

## About this module

This parser converts markdown files from `markdown/` into Slice.js components inside `src/Components/AppComponents/`. It also generates the document index (`docsIndex.js`) and a report of generated components.

## Usage

```bash
node parser/index.js
```

This processes all `.md` files in `markdown/` (including subdirectories) and:
- Generates HTML, JS, and CSS files per document in `src/Components/AppComponents/`
- Updates `src/Components/AppComponents/DocumentationPage/docsIndex.js`
- Writes a report to `parser/report.json`

## Markdown file format

Each markdown file must include YAML frontmatter:

```yaml
---
title: Title
route: /Documentation/Route
component: ComponentName
generate: true
---
```

Files with `generate: false` are skipped by the parser.

## Special blocks

The parser supports custom markdown blocks:

| Block | Syntax | Description |
|-------|--------|-------------|
| Code | ```` ```language ```` | Rendered with CodeVisualizer |
| Details | `:::details title="Title"` | Expandable accordion |
| Tips | `:::tip` | Info box |
| Warnings | `:::warning` | Warning box |
| Steps | `:::steps` | Styled numbered list |
| Component | `:::component name="MyComp"` | Embed a Slice.js component |
| HTML | `:::html` | Direct HTML |
| Script | `:::script` | Executable JavaScript |
| Tables | markdown tables | Rendered with Table component |

## Tests

```bash
node --test parser/tests/
```

## Structure

```
parser/
├── index.js              # Entry point
├── lib/
│   ├── markdownParser.js # Markdown → block parsing
│   ├── generator.js      # Component file generation
│   ├── docsIndex.js      # Document index generation
│   └── report.js         # Candidate component report
├── tests/                # Parser tests
└── report.json           # Last generated report
```
