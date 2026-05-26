---
title: Visual
route: /Documentation/Visual
navLabel: Visual
section: Getting Started
group: Components
order: 32
description: Official visual component documentation entrypoint for Slice.js.
component: VisualDocumentation
tags: [visual, components, docs]
---

# Visual Components Documentation

## Overview
Visual component API, interfaces, examples, and generated props metadata now live in the
official `slice.js_visual_library` documentation site.

## Why this page exists
- Keep framework docs in `sliceDocs` and component reference docs in one place.
- Avoid duplicated API tables and drift between repositories.
- Ensure parser-generated component docs remain the source of truth.

## Open the official components docs
:::html
<div class="components-docs-landing" data-components-docs-landing></div>
:::

:::script
const root = component.querySelector('[data-components-docs-landing]');
if (!root) return;

const docsUrl = slice.getEnv('SLICE_PUBLIC_COMPONENTS_DOCS_URL', '/docs');
const isExternal = /^https?:\/\//.test(docsUrl);

const card = document.createElement('div');
card.className = 'components-docs-card';

const title = document.createElement('h3');
title.textContent = 'Components Docs Portal';

const text = document.createElement('p');
text.textContent = 'Open the official visual components documentation to browse API, interfaces, examples, and generated static props metadata.';

const link = document.createElement('a');
link.href = docsUrl;
link.textContent = isExternal ? 'Open components docs (external)' : 'Open components docs';
link.className = 'components-docs-link';
if (isExternal) {
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
}

const urlHint = document.createElement('code');
urlHint.textContent = docsUrl;

card.appendChild(title);
card.appendChild(text);
card.appendChild(link);
card.appendChild(urlHint);
root.appendChild(card);
:::

## Configuration
Set `SLICE_PUBLIC_COMPONENTS_DOCS_URL` in your environment to point this page to the
public component docs deployment.

```bash title=".env"
SLICE_PUBLIC_COMPONENTS_DOCS_URL=https://example.com/docs
```

## Gotchas
:::warning
If `SLICE_PUBLIC_COMPONENTS_DOCS_URL` is not configured, this page falls back to `/docs`.
:::
