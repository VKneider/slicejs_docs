<div align="center">
  <img src="https://raw.githubusercontent.com/VKneider/slicejs_docs/master/src/images/Slice.js-logo.svg" alt="Slice.js logo" width="150" />
  <h1>Slice.js Documentation</h1>
  <p>Comprehensive documentation site for the Slice.js web framework</p>
  <p>
    <a href="https://slicejs.com/"><strong>View Live Documentation »</strong></a>
    <br />
    <a href="https://github.com/VKneider/slice.js">Framework Repository</a>
    ·
    <a href="https://github.com/VKneider/slicejs_docs/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/VKneider/slicejs_docs/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

## About this repository

This repository contains the official Slice.js documentation site. It is built with Slice.js itself and includes guides, API references, interactive examples, and visual component documentation.

### Features
- **Interactive examples**: Live code examples embedded in the documentation
- **Comprehensive coverage**: From basic concepts to advanced features
- **Component library**: Visual component references with live demos
- **Full-text search**: Search across all documentation
- **Responsive design**: Mobile-friendly documentation interface

## Prerequisites

- Node.js >= 20
- npm or pnpm

## Local development

1. **Clone the repository**
   ```bash
   git clone https://github.com/VKneider/slicejs_docs.git
   cd slicejs_docs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

## Available commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `node parser/index.js` | Regenerate components from markdown |
| `npm run slice:build` | Build for production |

## Writing documentation

Documentation is written in markdown files inside the `markdown/` folder.

### Frontmatter format

```yaml
---
title: Page Title
route: /Documentation/Route
navLabel: Label
section: Section
group: Group
order: 1
description: Brief description
component: ComponentName
tags: [tag1, tag2]
generate: true
---
```

### Regenerating components

After creating or modifying markdown files, regenerate the components:

```bash
node parser/index.js
```

This generates HTML, JS, and CSS files in `src/Components/AppComponents/` and updates the document index.

### Markdown guide

See `markdown/markdown-guide.md` for the complete guide to supported syntax, special blocks (`:::tip`, `:::warning`, `:::details`, `:::component`, `:::script`), and best practices.

## MCP Server

Slice.js provides an MCP server for programmatic documentation access:

```bash
npx slicejs-mcp
```

**Available tools:**
- `list_docs`: List all documentation sections
- `search_docs`: Search documentation by keywords
- `get_doc_content`: Fetch specific documentation pages
- `get_llm_full_context`: Get complete documentation bundle

## Project structure

```
slicejs_docs/
├── markdown/           # Markdown documentation sources
├── parser/             # Markdown → Slice.js components parser
│   ├── index.js        # Parser entry point
│   └── lib/            # markdownParser, generator, docsIndex, report
├── src/                # Site source code
│   ├── App/            # Application configuration
│   ├── Components/     # Visual and documentation components
│   └── bundles/        # Bundle configuration
└── api/                # API server
```

## Contributing

We welcome contributions to the Slice.js documentation. Whether fixing typos, adding examples, or documenting new features.

### Guidelines
- Follow the [Markdown Guide](markdown/markdown-guide.md)
- Test changes locally before submitting
- Use clear and concise language
- Include code examples when possible

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Slice.js - [@VKneider](https://github.com/VKneider)

Project Link: [https://github.com/VKneider/slicejs_docs](https://github.com/VKneider/slicejs_docs)
