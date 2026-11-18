---
title: Slice.js MCP
route: /Documentation/Slice-MCP
navLabel: MCP
section: Tooling
group: ''
order: 70
description: Model Context Protocol server for querying the framework and Components documentation from an AI assistant.
component: SliceMCPDocumentation
tags: [mcp, documentation, ai, tools]
---

# Slice.js MCP

## Overview
Slice.js provides an MCP (Model Context Protocol) server that lets AI assistants and development
tools query the framework and Components documentation. It runs as a stdio service, so the client
launches it on demand and speaks MCP over stdin/stdout.

## Installation

### Using npx (no install)
```bash
npx slicejs-mcp
```

### Global install
```bash
npm install -g slicejs-mcp
slicejs-mcp
```

### Local development
```bash
git clone https://github.com/VKneider/slicejs-mcp.git
cd slicejs-mcp
npm install
npm run build
node dist/index.js
```

:::details title="Client configuration (Claude Desktop, Cursor)"
Add the server to the client's MCP settings. The command/args are the same for any stdio-capable
client; VS Code uses its own MCP settings file.

```json
{
  "mcpServers": {
    "slicejs": {
      "command": "npx",
      "args": ["-y", "slicejs-mcp"]
    }
  }
}
```
:::

## Tool Summary
| Tool | Purpose |
| --- | --- |
| `list_docs` | Returns available documentation sections/categories. |
| `search_docs` | Searches across all documentation using keywords or phrases. |
| `get_doc_content` | Fetches the full content of specific documentation page(s). |
| `get_llm_full_context` | Fetches the complete documentation bundle. Expensive; use deliberately. |
| `slice_framework_*` | Namespace-aware access to framework documentation. |
| `slice_components_*` | Namespace-aware access to Slice.js Components documentation. |

The MCP exposes two catalogs:

- `framework` — `slicejs_docs`, covering the framework, CLI, lifecycle, routing, and architecture.
- `components` — Slice.js Components, covering Visual and Service APIs and examples.

The Components catalog is backed by the published Markdown manifest from the
`slicejs-components` repository. The public product name is **Slice.js Components**.

## list_docs
Returns a list of all available documentation sections and categories.

**Parameters:** none.

## search_docs
Searches across all documentation using keywords or phrases.

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `query` | string | required | Search term |
| `max_results` | number | 5 | Maximum number of results |

## get_doc_content
Fetches the full content of specific documentation page(s).

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `doc_id` | string or string[] | required | Documentation ID(s) to fetch |
| `include_metadata` | boolean | false | Include additional metadata |

## get_llm_full_context
Fetches the complete documentation bundle for comprehensive LLM context.

**Parameters:** none.

Use it sparingly: it is large, expensive in tokens, and usually unnecessary when `search_docs` +
`get_doc_content` can answer the question.

## Namespace-aware catalog tools

Framework:

```text
slice_framework_list_docs()
slice_framework_search_docs(query)
slice_framework_get_doc(doc_id)
```

Components:

```text
slice_components_list_docs()
slice_components_search_docs(query)
slice_components_get_doc(doc_id)
```

`slice_components_get_doc` returns the authored Markdown and metadata such as the component,
catalog version, source path, and revision. The MCP does not execute `:::script` examples.

## Architecture

- **Framework source**: documentation fetched from https://github.com/VKneider/slicejs_docs
- **Components source**: Markdown and manifest fetched from https://github.com/VKneider/slicejs-components
- **Caching**: session cache to minimize API requests and improve performance
- **Initialization**: lazy loading of the document structure on first tool use
- **Rate limiting**: designed to stay within GitHub API limits (60 req/hour)

## Guidelines

| Do | Why |
| --- | --- |
| `list_docs` first, then `search_docs` | Chasing a doc id blind costs more calls than listing the catalog. |
| Use `get_doc_content` for the page you need | Fetching the whole corpus is slower and more expensive. |
| Use `get_llm_full_context` only for broad tasks | It is a large bundle; targeted reads answer most questions. |
| Reuse the session cache | Repeated queries in one session are cheap. |

:::warning
The server fetches documentation from GitHub on demand. It needs network access, and large requests
(especially `get_llm_full_context`) can consume significant tokens in an AI context.
:::

:::related
- [Documentation & AGENTS.md](/Documentation/Documentation-System) - The source the MCP indexes.
- [CLI Commands](/Documentation/CLI) - `slice docs search` / `slice docs get` as the local fallback.
- [API Reference](/Documentation/API-Reference) - The framework surface at a glance.
- [Components documentation](https://components.slicejs.com) - The external Components catalog.
:::
