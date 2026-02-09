---
title: Themes
route: /Documentation/Themes
navLabel: Themes
section: Getting Started
group: Configuration
order: 7
description: Configure and switch Slice.js themes using CSS variables.
component: ThemesDocumentation
generate: false
tags: [themes, styles, configuration]
---

# Themes in Slice.js

Slice.js themes are CSS-variable driven. A theme is a plain CSS file that defines color, contrast, and surface tokens the UI can reuse consistently.

## Why Themes

- Keep visual decisions centralized in one file
- Switch look and feel without touching components
- Use the same UI components across multiple visual identities

## Theme Structure

Themes live in `src/Themes/` and export variables under `:root`.

```css title="Minimal theme structure"
:root {
  --primary-color: #1d4ed8;
  --primary-color-rgb: 29, 78, 216;
  --primary-color-contrast: #ffffff;

  --primary-background-color: #f8fafc;
  --secondary-background-color: #eef2f6;
  --tertiary-background-color: #e2e8f0;

  --font-primary-color: #0f172a;
  --font-secondary-color: #475569;

  --success-color: #166534;
  --warning-color: #b45309;
  --danger-color: #b91c1c;
}
```

### Required Tokens

At minimum, include:

- `--primary-color`, `--primary-color-rgb`, `--primary-color-contrast`
- `--primary-background-color`, `--secondary-background-color`, `--tertiary-background-color`
- `--font-primary-color`, `--font-secondary-color`

These are used across Visual components and custom CSS.

## Switching Themes

Slice.js applies themes with the StylesManager:

```javascript title="Switching a theme"
await slice.setTheme('CrimsonRed');
```

The theme name matches the CSS file name in `src/Themes/`.

## Using Theme Tokens in Components

Use CSS variables inside component styles to stay themeable:

```css title="Theme tokens in a component"
.card {
  background: var(--secondary-background-color);
  color: var(--font-primary-color);
  border: 1px solid rgba(var(--primary-color-rgb), 0.2);
}
```

## Guidelines

- Prefer a single accent (`--primary-color`) and derive borders via opacity
- Keep contrast strong for text and interactive states
- Use background tokens for surface hierarchy instead of custom colors

## Suggested Theme Tokens

Optional tokens you can add for richer UIs:

- `--accent-color`
- `--primary-color-shade`
- `--secondary-color` and `--secondary-color-contrast`
- `--success-contrast`, `--warning-contrast`, `--danger-contrast`

## Troubleshooting

:::tip
If a component looks off, check that your background and font tokens are present and readable.
:::

:::warning
Avoid hard-coded hex values in component CSS when a theme token exists.
:::
