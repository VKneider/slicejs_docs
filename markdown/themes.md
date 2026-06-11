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

Slice.js themes are CSS-variable driven. A theme is a plain CSS file that defines color, contrast, and surface tokens under `:root`, which the UI reuses consistently. Slice.js ships with two canonical themes: **LIGHT** and **DARK**.

## Why Themes

- Keep visual decisions centralized in one file
- Switch look and feel without touching components
- Use the same UI components across multiple visual identities

## Theme Structure

Themes live in `src/Themes/` as one CSS file per theme (`LIGHT.css`, `DARK.css`). Each file exports its tokens under `:root`. The theme name used in code matches the CSS file name (without extension).

## Required Theme Variables

Every theme MUST define these 15 variables. The Theme Creator reads them, and Visual components rely on them being present.

| Variable | Purpose |
|----------|---------|
| `--primary-color` | Main accent / brand color |
| `--primary-background-color` | App-level background surface |
| `--primary-color-contrast` | Readable color on top of the primary color |
| `--primary-color-shade` | Darker variant of the primary color |
| `--secondary-color` | Secondary accent color |
| `--secondary-background-color` | Secondary surface background |
| `--secondary-color-contrast` | Readable color on top of the secondary color |
| `--tertiary-background-color` | Tertiary surface background |
| `--font-primary-color` | Default body text color |
| `--font-secondary-color` | Muted / heading text color |
| `--success-color` | Success state color |
| `--warning-color` | Warning state color |
| `--danger-color` | Error / danger state color |
| `--medium-color` | Neutral mid-tone color |
| `--disabled-color` | Disabled / inactive color |

:::tip
Optional but recommended extras include `--primary-color-rgb`, `--secondary-color-rgb`, `--success-contrast`, `--warning-contrast`, `--danger-contrast`, `--medium-contrast`, and `--accent-color`. The `*-rgb` tokens let you derive translucent borders with `rgba(var(--primary-color-rgb), 0.2)`.
:::

## LIGHT Theme

The default light theme. Values below come from `src/Themes/LIGHT.css`.

```css title="src/Themes/LIGHT.css"
:root {
  /* Typography */
  --font-primary-color: #1A0B2E;
  --font-secondary-color: #6B46C1;

  /* Primary */
  --primary-color: #9333EA;
  --primary-color-rgb: 147, 51, 234;
  --primary-background-color: #FEFBFF;
  --primary-color-contrast: #FFFFFF;
  --primary-color-shade: #7C3AED;

  /* Secondary */
  --secondary-color: #0891B2;
  --secondary-color-rgb: 8, 145, 178;
  --secondary-background-color: #F0F9FF;
  --secondary-color-contrast: #FFFFFF;

  /* Tertiary */
  --tertiary-background-color: #F0F4FF;

  /* States */
  --success-color: #059669;
  --success-contrast: #FFFFFF;
  --warning-color: #D97706;
  --warning-contrast: #FFFFFF;
  --danger-color: #DC2626;
  --danger-contrast: #FFFFFF;

  /* Neutral */
  --medium-color: #6B7280;
  --medium-contrast: #FFFFFF;
  --disabled-color: #D1D5DB;

  /* Accent */
  --accent-color: #06B6D4;
}
```

## DARK Theme

The default dark theme. Values below come from `src/Themes/DARK.css`.

```css title="src/Themes/DARK.css"
:root {
  /* Typography */
  --font-primary-color: #f1e7ff;
  --font-secondary-color: #c4b5fd;

  /* Primary */
  --primary-color: #a855f7;
  --primary-color-rgb: 168, 85, 247;
  --primary-background-color: #1a1028;
  --primary-color-contrast: #ffffff;
  --primary-color-shade: #2e2040;

  /* Secondary */
  --secondary-color: #34d399;
  --secondary-color-rgb: 52, 211, 153;
  --secondary-background-color: #1f1432;
  --secondary-color-contrast: #052e23;

  /* Tertiary */
  --tertiary-background-color: #26183a;

  /* States */
  --success-color: #10b981;
  --success-contrast: #03281f;
  --warning-color: #f59e0b;
  --warning-contrast: #2b1800;
  --danger-color: #ef4444;
  --danger-contrast: #2d0a0a;

  /* Neutral */
  --medium-color: #9ca3af;
  --medium-contrast: #111827;
  --disabled-color: #4b5563;

  /* Accent */
  --accent-color: #22d3ee;
}
```

## Switching Themes

Slice.js applies themes through the StylesManager. Pass the theme name (matching the CSS file name in `src/Themes/`):

```javascript title="Switching a theme"
await slice.setTheme('DARK');
```

```javascript title="Back to light"
await slice.setTheme('LIGHT');
```

## Per-Theme CSS Marker

When a theme is applied, the StylesManager sets a `data-slice-theme` attribute on the root element (`<html>`) with the active theme name. This lets CSS react to the theme directly — no JavaScript theme detection needed.

```css title="Vary something per theme"
/* A white logo SVG that must flip on the light theme */
[data-slice-theme="LIGHT"] .brand-logo { filter: invert(1); }
[data-slice-theme="DARK"]  .brand-logo { filter: none; }
```

```javascript title="Read it in JS too"
document.documentElement.getAttribute('data-slice-theme'); // 'DARK'
slice.theme;                                                // same value
```

:::tip
Prefer theme **CSS variables** (`var(--token)`) for colors — they already swap automatically. Reach for the `data-slice-theme` marker only for things variables can't express per theme (a filter, a background image, a one-off layout tweak).
:::

## Using Theme Tokens in Components

Use the CSS variables inside component styles so components stay themeable across LIGHT and DARK:

```css title="Theme tokens in a component"
.card {
  background: var(--secondary-background-color);
  color: var(--font-primary-color);
  border: 1px solid rgba(var(--primary-color-rgb), 0.2);
}
```

## Guidelines

- Prefer the accent tokens (`--primary-color`, `--secondary-color`) and derive borders via opacity using the `*-rgb` variants
- Keep contrast strong for text and interactive states by pairing each color with its `*-contrast` token
- Use the background tokens (`--primary-background-color`, `--secondary-background-color`, `--tertiary-background-color`) for surface hierarchy instead of custom hex colors
- Define all 15 required variables in every theme so the Theme Creator and Visual components behave consistently

## Troubleshooting

:::tip
If a component looks off, check that your background and font tokens are present and readable in the active theme.
:::

:::warning
Avoid hard-coded hex values in component CSS when a theme token exists. Hard-coded colors will not adapt when switching between LIGHT and DARK.
:::
