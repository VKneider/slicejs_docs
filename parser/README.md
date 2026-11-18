<div align="center">
  <img src="https://raw.githubusercontent.com/VKneider/slicejs_docs/master/src/images/Slice.js-logo.svg" alt="Slice.js logo" width="120" />
  <h3>Slice.js Markdown Parser</h3>
  <p>Converts markdown files into Slice.js components for the documentation site</p>
</div>

## About this module

This parser converts markdown files from `markdown/` into Slice.js components inside
`src/Components/AppComponents/`. It also generates the document index (`docsIndex.js`), the SEO
artifacts (`seo.json`, `sitemap.xml`) and the shared documentation stylesheet.

The markdown contract is shared with the Slice.js Components documentation site. When both parsers
support the same constructs and the same registry components, a page can move between the two sites
without being rewritten. The authoritative syntax is in [`MARKDOWN-CONTRACT.md`](MARKDOWN-CONTRACT.md);
keep this file and `markdown-guide.md` in step with the parser.

## Usage

```bash
node parser/index.js
```

This processes all `.md` files in `markdown/` (including subdirectories) and:

- Generates HTML, JS, and CSS files per document in `src/Components/AppComponents/`
- Updates `src/Components/AppComponents/DocumentationPage/docsIndex.js`
- Generates `src/Components/AppComponents/DocumentationPage/documentationRoutes.js` from the
  front matter (`section`, `group`, `order`)
- Writes `src/public/seo.json` and `src/public/sitemap.xml`
- Copies `parser/templates/DocumentationBase.css` to `src/public/Styles/DocumentationBase.css`
- Writes a report to `parser/report.json`

## Markdown file format

Each markdown file must include YAML frontmatter:

```yaml
---
title: Service Patterns
route: /Documentation/Architecture/Service-Patterns
navLabel: Service Patterns
section: Project Architecture
group: Styles and Patterns
order: 6
description: One-line summary.
component: ServicePatternsDocumentation
tags: [architecture, services]
---
```

Files with `generate: false` are skipped by the parser (their routes can still be hand-authored).
The `description` becomes the page lede and the SEO description. `section` and `group` feed the
breadcrumb and the documentation index.

## Inline formatting

- `**bold**`, `*italic*`, `` `inline code` ``
- `[label](/Documentation/Service)` — internal links navigate through the Slice router, including
  `/page#section` links
- `[label](https://example.com)` — external links open in a new tab
- `![alt](/images/diagram.png)` — images are lazy-loaded
- Links and inline code also work in table cells

## Special blocks

| Block | Syntax | Rendered with |
|-------|--------|---------------|
| Code | ```` ```language title="..." ```` | `CodeVisualizer` |
| Page meta | automatic | `Breadcrumbs` + reading time |
| Callout (tip) | `:::tip` | `Callout` (tone `success`) |
| Callout (warning) | `:::warning` | `Callout` (tone `warning`) |
| Callout (note) | `:::note` / `:::info` | `Callout` (tone `info`) |
| Callout (custom) | `:::callout tone="accent" title="..."` | `Callout` |
| Compare | `:::compare left="Do" right="Don't"` | `Grid` + two `Callout` |
| Related | `:::related` + list of links | `Grid` + `Card` |
| Details | `:::details title="Title"` | `Details`, with rich body content |
| Steps | `:::steps` | Styled numbered list |
| Status badge | `status: new` in front matter | `Badge` next to the title |
| Component | `:::component name="MyComp"` + JSON props | `slice.build(name, props)` |
| HTML | `:::html` | Direct HTML |
| Script | `:::script` | Executable JavaScript |
| Tables | markdown tables | `Table` |
| Blockquote | `> quoted text` | Styled blockquote |
| Divider | `---` | `<hr>` |

Unknown directives render their body as a paragraph instead of disappearing. That behavior was
added after three `:::note` blocks were silently dropped from the docs.

## Tests

```bash
node --test parser/tests/
```

## Structure

```
parser/
├── index.js                  # Entry point
├── templates/
│   └── DocumentationBase.css # Shared docs stylesheet (published by docs:generate)
├── lib/
│   ├── markdownParser.js     # Markdown → blocks/HTML
│   ├── generator.js          # Component file generation
│   ├── docsIndex.js          # Document index generation
│   ├── navConfig.js          # Section/group order for the navigation tree
│   ├── tree.js               # Generates documentationRoutes.js from front matter
│   ├── seo.js                # seo.json + sitemap.xml
│   └── report.js             # Candidate component report
├── tests/                    # Parser tests
└── report.json               # Last generated report
```
