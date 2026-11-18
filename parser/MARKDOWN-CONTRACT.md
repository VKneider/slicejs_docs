# Markdown Contract

The documentation site and the Slice.js Components documentation site share one markdown contract.
This file is the reference for what authors can write and what the parser renders. When the two
parsers disagree, this contract wins; the Components parser is expected to converge on it.

The executable guard is `parser/tests/markdown-contract.test.js`.

## Front matter

```yaml
---
title: Service Patterns
route: /Documentation/Architecture/Service-Patterns
navLabel: Service Patterns
section: Guides
group: ''
order: 50
description: One-line summary used for the page lede and SEO.
component: ServicePatternsDocumentation
status: new                 # optional
tags: [architecture, services]
---
```

| Field | Required | Purpose |
|---|---|---|
| `title` | yes | Page title and default nav label. |
| `route` | yes | Router path; also the cross-link target. |
| `navLabel` | no | Shorter label for the tree and search. |
| `section` | yes | Top-level navigation section. |
| `group` | no | Optional second-level group inside a section. |
| `order` | yes | Order inside its group/section. |
| `description` | no | Page lede and SEO description. |
| `component` | yes | Generated (or hand-authored) component class. |
| `status` | no | `new`, `updated`, `deprecated`, `beta`, `experimental`. Renders a `Badge`. |
| `tags` | no | Search keywords. |
| `generate` | no | `false` keeps a hand-authored page. |

The navigation is generated from `section` + `group` + `order`. The section order lives in
`parser/lib/navConfig.js`; add a section there only when the IA changes.

## Inline formatting

- `**bold**`, `*italic*`, `` `inline code` ``
- `[label](/Documentation/Service)` — internal link, SPA navigation
- `[label](/Documentation/CLI#build)` — internal link with a section anchor
- `[label](https://example.com)` — external link, new tab
- `![alt](/images/diagram.png)` — lazy-loaded image
- Links and inline code work in table cells.

## Blocks

| Block | Syntax | Rendered with |
|---|---|---|
| Heading | `## Heading` | `<h2>` with a stable id |
| Paragraph | plain text | `<p>` |
| List | `- item`, `1. item` | nested `<ul>` / `<ol>` |
| Code | ```` ```js title="..." ```` | `CodeVisualizer` |
| Table | `| a | b |` | `Table` |
| Blockquote | `> text` | `<blockquote>` |
| Divider | `---` | `<hr>` |
| Callout | `:::tip`, `:::warning`, `:::note` | `Callout` |
| Custom callout | `:::callout tone="accent" title="..."` | `Callout` |
| Compare | `:::compare left="Do" right="Don't"` | `Grid` + two `Callout` |
| Details | `:::details title="..."` | `Details`, rich body |
| Steps | `:::steps` | styled numbered list |
| Related | `:::related` + list of links | `Grid` + `Card` |
| Component | `:::component name="X"` + JSON | `slice.build('X', props)` |
| Script | `:::script` | executable JavaScript |
| HTML | `:::html` | raw HTML |

### Callouts

```md
:::tip title="Optional title"
Advice that changes what the reader does next.
:::

:::warning
A real risk: data loss, a destructive step, a security mistake.
:::

:::note
A quiet aside. `note` is a neutral ghost callout, not another tip.
:::
```

**Budget:** 1–3 callouts per page. A fourth tip in a row is usually a table, a `Details` block, or
plain prose. Warnings are reserved for risk, not preferences.

### Compare

```md
:::compare left="Do" right="Don't"
Assign a prop and let the setter update the DOM.
---
Destroy the subtree and rebuild it for one changed field.
:::
```

`leftTone` and `rightTone` override the default `success` / `danger` tones.

### Details

```md
:::details title="Why use bind()?"
The body is markdown: paragraphs, lists, code and links.
:::
```

### Related

```md
:::related
- [Component Anatomy](/Documentation/Component-Anatomy) - How the three files fit together.
- [Static Props](/Documentation/Static-Props) - Typed props and defaults.
:::
```

### Component embedding

```md
:::component name="Callout"
{
  "tone": "info",
  "title": "Live example",
  "text": "Props are JSON."
}
:::
```

## Page chrome

The parser adds these automatically in `slice.js_docs`; authors do not write them:

- Breadcrumb from `section` and `group` (`Breadcrumbs`).
- Reading time from the body.
- Title bar from the first `#` heading.
- Lede from `description`.
- Copy-markdown button in the title bar.
- Status badge from `status`.

The Components site keeps its own page header and shell; page chrome is site-specific. The shared
part is the markdown syntax and the component mapping.

## Information architecture

- Seven sections: Getting Started, Components, State & Routing, Guides, Configuration, Tooling,
  Reference.
- Maximum three navigation levels. No section gets a fourth visible level.
- No section above ~12 pages; split it instead of growing a junk drawer.
- Section and group order live in `parser/lib/navConfig.js`; page order lives in front matter.
- `parser/tests/routes.test.js` enforces the section count, page count and depth budget.

## Component ownership

| Layer | Owns |
|---|---|
| `parser/lib/markdownParser.js` | Markdown → HTML + `jsBlocks` (the shared contract) |
| `parser/lib/generator.js` | Slice component files, registry components, router links |
| `parser/lib/tree.js` | Navigation tree from front matter |
| `parser/lib/docsIndex.js` | Search index |
| `parser/lib/seo.js` | `seo.json` + `sitemap.xml` |
| Each docs site | Routes, layout, shell, optional page chrome, OG cards |

Both parsers implement this contract. `slice.js_docs` is the reference implementation; the
Components parser mirrors the syntax in `src/markdown/parser-rules.md`. The intentional differences
are site chrome (the Components site keeps its own header) and `:::script` live preview (the
Components site adds `DemoBox`; framework docs execute the script only).
