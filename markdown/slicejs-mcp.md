---
title: Slice.js MCP
route: /Documentation/Slice-MCP
navLabel: MCP
section: Getting Started
group: Tools
order: 21
description: Model Context Protocol server for accessing Slice.js documentation via npx or local development.
component: SliceMCPDocumentation
tags: [mcp, documentation, ai, tools]
---

# Slice.js MCP

## Overview
Slice.js provides an MCP (Model Context Protocol) server that allows AI assistants and development tools to access Slice.js documentation programmatically. This enables seamless integration with AI-powered coding assistants for real-time documentation queries during development.

## Installation

### Using npx (No Installation Required)
```bash
npx slicejs-mcp
```

### Local Development
Clone the repository, install dependencies, build, and run locally:
```bash
git clone https://github.com/VKneider/slicejs-mcp.git
cd slicejs-mcp
npm install
npm run build
node dist/index.js
```

## Usage
The MCP server runs as a stdio-based service, perfect for integration with MCP-compatible clients and AI assistants.

### Basic Usage
```bash
npx @vkneider/slicejs-mcp
```

## Tool Summary
| Tool | Purpose |
| --- | --- |
| `list_docs` | Returns available documentation sections/categories. |
| `search_docs` | Searches across all documentation using keywords or phrases. |
| `get_doc_content` | Fetches the full content of specific documentation page(s). |
| `get_llm_full_context` | Fetches the complete documentation bundle (~2000 lines). |

## list_docs
Returns a list of all available documentation sections and categories.

**Parameters:** None

## search_docs
Searches across all documentation using keywords or phrases.

### Parameters
| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `query` | string | required | Search term |
| `max_results` | number | 5 | Maximum number of results |

## get_doc_content
Fetches the full content of specific documentation page(s).

### Parameters
| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `doc_id` | string or string[] | required | Documentation ID(s) to fetch |
| `include_metadata` | boolean | false | Include additional metadata |

## get_llm_full_context
Fetches the complete documentation bundle (~2000 lines) for comprehensive LLM context.

**Parameters:** None

**Note:** This consumes considerable tokens but provides all documentation in one request.

## Architecture

- **Source**: Documentation fetched from https://github.com/VKneider/slicejs_docs
- **Caching**: Infinite session cache to minimize API requests and improve performance
- **Initialization**: Lazy loading of document structure on first tool use
- **Rate Limiting**: Optimized to stay within GitHub API limits (60 req/hour)

## Integration with AI Assistants

The MCP server can be integrated with MCP-compatible clients to provide real-time access to Slice.js documentation during development.

## Best Practices

:::tip
Use `list_docs` first to explore available documentation, then `search_docs` for specific queries.
:::

:::tip
For comprehensive context, use `get_llm_full_context` sparingly due to token consumption.
:::

:::tip
The server maintains a cache during the session, so repeated queries are fast.
:::

## Gotchas

:::warning
The server fetches documentation from GitHub on-demand. Ensure internet connectivity for full functionality.
:::

:::warning
Large documentation requests may consume significant tokens in AI contexts.
:::