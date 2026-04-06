# Markdown Documentation Index

## Authoring Checklist

When adding a new documentation page, use this quick checklist:

1. Create markdown file under `markdown/` with front matter.
2. Run parser from workspace root:
   - `node slicejs_docs/parser/index.js`
3. Verify generated component folder exists in `src/Components/AppComponents/`.
4. Register page manually in:
   - `src/Components/AppComponents/DocumentationPage/documentationRoutes.js`
   - `src/routes.js`
   - `src/Components/components.js`
5. Confirm page appears in TreeView and opens without 404.

:::warning
`docsIndex.js` is generated from markdown metadata, but TreeView and router wiring are still manual.
:::

## Generated from markdown

- EventManagerDocumentation
  - Source: markdown/example.md
- MultiRouteDocumentation
  - Source: markdown/components/multi-route.md

## Markdown candidates

- ContextManagerDocumentation
  - Source: src/Components/AppComponents/ContextManagerDocumentation/ContextManagerDocumentation.js
  - Reason: Details-based FAQ can map to :::details blocks
- RouterGuardsDocumentation
  - Source: src/Components/AppComponents/RouterGuardsDocumentation/RouterGuardsDocumentation.js
  - Reason: Details-based FAQ can map to :::details blocks
- RoutingDocumentation
  - Source: src/Components/AppComponents/RoutingDocumentation/RoutingDocumentation.js
  - Reason: Details-based FAQ can map to :::details blocks
- ServiceDocumentation
  - Source: src/Components/AppComponents/ServiceDocumentation/ServiceDocumentation.js
  - Reason: Details-based FAQ can map to :::details blocks
- StructuralDocumentation
  - Source: src/Components/AppComponents/StructuralDocumentation/StructuralDocumentation.js
  - Reason: Details-based FAQ can map to :::details blocks
- TheBuildMethod
  - Source: src/Components/AppComponents/TheBuildMethod/TheBuildMethod.js
  - Reason: Details-based FAQ can map to :::details blocks
- VisualDocumentation
  - Source: src/Components/AppComponents/VisualDocumentation/VisualDocumentation.js
  - Reason: Details-based FAQ can map to :::details blocks

## Requires custom blocks

- RoutingDocumentation
  - Source: src/Components/AppComponents/RoutingDocumentation/RoutingDocumentation.js
  - Reason: Interactive MultiRoute demo likely needs :::component or :::html block
