---
title: Component Styles
route: /Documentation/Architecture/Component-Styles
navLabel: Component Styles
section: Project Architecture
group: Styles and Patterns
order: 7
description: How to write a component's CSS so it stays encapsulated — scope every selector under the component tag, declare an explicit host display, and prefix keyframes.
component: ComponentStylesDocumentation
tags: [css, styles, scoping, encapsulation, display, keyframes]
---

# Component Styles

A Slice component owns three files — `.js`, `.html`, and `.css`. The `.css` is loaded
once when the component is first built and then applies **globally** to the page. That
last word is the whole reason this page exists: nothing about a `.css` file is
automatically scoped to its component. Encapsulation is a convention you follow, not
something the framework enforces.

Three rules keep component styles from leaking into — or being broken by — the rest of
your app.

## 1. Scope every selector under the component tag

Root every selector at the component's custom-element tag, never a bare class. The tag is
whatever the component registers with `customElements.define('slice-...')`.

```css title="MyCard.css"
/* ❌ leaks: every .card-title anywhere on the page is restyled */
.card-title { font-size: 1.25rem; }

/* ✅ encapsulated: only inside <slice-my-card> */
slice-my-card .card-title { font-size: 1.25rem; }
```

Generic names (`.container`, `.item`, `.title`, `.header`) are the ones that bite — two
components each defining a bare `.title` will silently overwrite each other. Prefixing
with the tag makes collisions impossible.

:::warning
`@media` and `@supports` blocks are not an exception. Scope the selectors **inside** them
too: `@media (max-width: 600px) { slice-my-card .card-title { ... } }`.
:::

## 2. Declare an explicit host display

A custom element with no `display` rule defaults to `display: inline`. For most
components that is wrong and surprising: `width` and `height` are ignored, vertical
`margin` is dropped, and the element sits on the text baseline. Always set `display` on
the tag as the first rule of the file.

```css
slice-my-card { display: block; }          /* layout / form / data blocks */
slice-my-chip { display: inline-block; }   /* content-sized inline controls */
```

| `display` | Use for |
| --- | --- |
| `block` | form fields, layout and data containers, full-width strips |
| `inline-block` | content-sized interactive controls that should flow inline |
| `inline-flex` / `flex` | when the host element itself is the flex container |
| `contents` | pure wrappers that must not introduce a box of their own |

:::tip
The tag selector has low specificity, so wherever you *use* the component you can still
override it (`slice-my-card { display: flex }` in your app styles). Declaring a host
`display` only removes the broken `inline` default — it never locks layout.
:::

## 3. Prefix keyframes with the component name

`@keyframes` names are global. A bare `@keyframes spin` in two components is a collision
waiting to happen — prefix every keyframe.

```css
/* ❌ */ @keyframes spin { ... }
/* ✅ */ @keyframes slice_my_card_spin { ... }
```

## The one exception: elements you move to the body

If your component appends an element to `document.body` (a tooltip bubble, a toast stack,
a portaled overlay), that element no longer lives inside your tag, so a `slice-tag`
descendant selector can't reach it. Those — and only those — stay as globally-unique
classes. Give them a name unlikely to collide and a comment saying why.

```css
/* Appended to document.body, so it can't be scoped under the tag. */
.slice-my-tooltip-bubble { position: fixed; ... }
```

:::warning
This exception is narrow. If an element is in your component's template (queried with
`this.querySelector` after `slice.attachTemplate`), it lives inside the tag — scope it.
Only reach for a global class when you genuinely `document.body.appendChild(...)` it.
:::

## Checklist

| Check | Rule |
| --- | --- |
| Every selector starts with `slice-<tag>` (or is a documented body-portal exception) | §1 |
| Selectors inside `@media` / `@supports` are scoped too | §1 |
| The tag has an explicit `display` as the first rule | §2 |
| Every `@keyframes` is prefixed with the component name | §3 |

## Related

- [Themes](/Documentation/Themes) — the CSS variable tokens (`--primary-color`,
  `--font-primary-color`, …) your scoped component styles should use instead of hard-coded
  colors, so components follow the active theme.
