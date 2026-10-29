---
title: Translating an app
route: /Documentation/Translator
navLabel: Translator
section: Getting Started
group: Configuration
order: 8
description: slice.translator — dictionaries, data-t in templates, t.ref() for props, locale-aware URLs and formatting.
component: TranslatorDocumentation
tags: [translator, i18n, locales, routing]
---

# Translating an app

`slice.translator` is a **structural** part of Slice, next to `slice.router` and `slice.context`. It
owns the dictionaries, the active locale, the translations in the DOM and in component props, and the
locale in the URL. `slice.t()` is the shortcut for `slice.translator.t()`.

It always exists. With `"enabled": false` it loads nothing, `t()` returns the key, `data-t` is left
alone and `format.*` uses the browser's language — so code written against it runs in any app.

## Enable it

```json title="src/sliceConfig.json"
"translator": {
  "enabled": true,
  "defaultLocale": "es",
  "fallbackLocale": "en",
  "locales": ["es", "en"],
  "path": "/locales",
  "saveLocally": true,
  "useBrowserLocale": true,
  "routing": false
}
```

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Off: nothing is loaded or observed and `t()` returns the key. |
| `defaultLocale` | `string` | — | Required when enabled. The locale an unprefixed URL means. |
| `fallbackLocale` | `string \| null` | `null` | Asked when the active locale has no entry for a key. |
| `locales` | `string[]` | `[defaultLocale]` | The locales the app has. `setLocale()` refuses anything else. |
| `path` | `string` | `/locales` | Where the dictionaries are served from. |
| `saveLocally` | `boolean` | `false` | Remember the choice in `localStorage` (`slice:locale`). |
| `useBrowserLocale` | `boolean` | `false` | On a first visit, use the browser's language when it is supported (`es-VE` → `es`). |
| `routing` | `false \| "prefix" \| "prefix-except-default"` | `false` | Whether the locale lives in the URL. See [URLs](#urls-and-the-router). |
| `ui` | `object` | none | `{ enabled, shortcut }`: the translator debugger panel. |

**Which locale starts:** with `routing`, the URL decides — its prefix, or, with
`"prefix-except-default"`, the default locale when there is none. Otherwise: the saved choice → the
browser's language → `defaultLocale`.

The starting locale is applied before the first route renders. `slice init` projects can add the
block by hand; `slice doctor` validates it against the schema.

## Dictionaries

```
src/locales/es.json          loaded at start, together with the fallback's
src/locales/en.json
src/locales/es/orders.json   a namespace: loaded by slice.translator.load('orders')
```

Keys are hierarchical, values are plain text (never HTML):

```json title="src/locales/es.json"
{
  "orders": {
    "greeting": "Hola, {name}",
    "count": { "one": "{count} pedido", "other": "{count} pedidos", "zero": "Sin pedidos" },
    "title": "Pedidos"
  }
}
```

A namespace file is merged under its own name (`orders.json` → the `orders` branch), so
`load('orders')` only downloads when a screen needs it.

The lookup order is: **app dictionaries** for the active locale → the **defaults layer** for the
active locale → both again for `fallbackLocale` → **the key itself**. A missing key is not a crash: it
is shown as `orders.title` and reported once in development.

`slice.translator.add(locale, messages)` merges at runtime. `add(locale, messages, { defaults: true })`
writes to the lower layer that never overrides the app's dictionaries — that is how a component
library ships its own texts without taking control of the dictionary.

:::note
`slice build` copies `src/locales` into `dist/locales`, and the server serves the folder at
`translator.path` in development and in production. If you move the dictionaries, change `path`; do not
put them under `public/`.
:::

## Messages

| Feature | Dictionary | Call | Result (`es`) |
| --- | --- | --- | --- |
| Interpolation | `"greeting": "Hola, {name}"` | `slice.t('orders.greeting', { name: 'Ana' })` | `Hola, Ana` |
| Plural | `"count": { "one": "{count} pedido", "other": "{count} pedidos" }` | `slice.t('orders.count', { count: 3 })` | `3 pedidos` |
| Exact zero | `"zero": "Sin pedidos"` | `slice.t('orders.count', { count: 0 })` | `Sin pedidos` |
| Numbers | `"{count} pedidos"` | `{ count: 1234 }` | `1.234 pedidos` |
| Literal brace | `"{{"` / `"}}"` | — | `{` / `}` |

Plural categories come from `Intl.PluralRules` for the current locale; `other` is required. A number
passed as a parameter is formatted with the locale. There is no ICU MessageFormat in this version.

## JavaScript API

| API | Signature | Notes |
| --- | --- | --- |
| `slice.t` | `t(key, params?) → string` | Shortcut of `slice.translator.t`. |
| `slice.t.ref` | `t.ref(key, params?) → TranslationRef` | A prop reference. See [Props](#props-the-one-exception). |
| `slice.locale` | `string` | Active locale shortcut. |
| `slice.translator.t` | `t(key, params?) → string` | Lookup + plural + interpolation. |
| `slice.translator.locale` | `string` | Active locale. |
| `slice.translator.locales` | `readonly string[]` | Configured locales. |
| `slice.translator.has` | `has(key, locale?) → boolean` | Is it a message? Does not consult the fallback. |
| `slice.translator.setLocale` | `setLocale(locale) → Promise<string>` | Loads first, then switches. See below. |
| `slice.translator.preload` | `preload(locale) → Promise<string>` | Load without switching. |
| `slice.translator.load` | `load(namespace) → Promise<void>` | Load a namespace for the active and fallback locale. |
| `slice.translator.add` | `add(locale, messages, { defaults }) → void` | Merge messages at runtime. |
| `slice.translator.ref` | `ref(key, params?) → TranslationRef` | A prop reference. See [Props](#props-the-one-exception). |
| `slice.translator.watch` | `watch(component, callback) → () => void` | `callback(locale, previous)` until the component is destroyed. |
| `slice.translator.apply` | `apply(root?) → number` | Translate `data-t` under `root` now (default: the document). |
| `slice.translator.setShowKeys` | `setShowKeys(enabled) → boolean` | Debugger switch: `t()` returns keys instead of texts and the document re-renders. |
| `slice.translator.format` | `number / currency / percent / date / time / relative / list` | `Intl` wrappers cached per locale and options. |

```javascript
slice.t('orders.count', { count: itemCount });
slice.t('prices.total', { amount: slice.translator.format.currency(1299, 'EUR') });
slice.translator.format.date(new Date(), { dateStyle: 'long' });
```

## Templates: mark the text, don't write it

```html
<h1 data-t="home.title"></h1>
<input data-t="home.search" placeholder aria-label />
<p data-t="signup.terms">
  <a href="/terms" data-t-slot="link" data-t="signup.termsLink"></a>
</p>
```

For `data-t="key"`:

- the element's **text** is `key` — unless the element has translatable attributes, in which case only
  those are filled. Add `data-t-text` to fill both.
- every **translatable attribute present** (even empty) is `key.<attribute>` in camelCase: `placeholder`,
  `title`, `alt`, `aria-label` → `key.ariaLabel`, `aria-description`, `aria-placeholder`,
  `aria-roledescription`, `aria-valuetext`, `label` on `<option>`/`<optgroup>`/`<track>`, and `value` on
  `input[type=button|submit|reset]`.
- **slots**: a message such as `"Acepto los {link}."` is rebuilt around the element marked
  `data-t-slot="link"`, which keeps its attributes and its listeners. Dictionaries never contain HTML.

**Marked, not written.** Any element with `data-t` — in a component template, in `App/index.html`, or
created later from JavaScript — is translated when it enters the document and again on every locale
change. One `MutationObserver` does it, so nothing is copied into JavaScript and no hook has to repaint
it:

```javascript
this.$count.dataset.tCount = items.length;         // re-translates "cart.items" with { count }
this.$status.dataset.t = `orders.status.${state}`; // a different key: re-translated too
el.innerHTML = '<p data-t="about.description"></p>'; // HTML built from JavaScript works the same
```

Parameters come from `data-t-*` attributes (`data-t-user-name` → `{ userName }`); numeric strings become
numbers. `data-t-text` and `data-t-slot` are directives, not parameters. Templates are translated inside
`attachTemplate` while the component is still detached, so `init()` reads translated text and the first
paint has no keys.

Text computed at the moment it is used (`slice.t()` in a toast, in a confirm) needs nothing at all.

## One entry point: `t`

`t` is the method you use everywhere. The only exception is a value that must live in a component
prop and survive a locale change without rebuilding the component; for that, `t` has a namespaced
reference:

```javascript
slice.t('orders.save')        // "Guardar" — text, right now
slice.t.ref('orders.save')    // a reference for a prop
```

| Text | Mechanism |
| --- | --- |
| In a template (`.html`) | `data-t` — nothing else |
| Created from JS (`textContent`, `innerHTML`) | `data-t` / `dataset.t` (+ `data-t-*` params) |
| Passed as a component prop, must follow the locale | `slice.t.ref()` |
| Computed by your component from data | `slice.t()` + `update()`/`watch()` |
| Outside the DOM (canvas, third-party widget) | `watch()` + `slice.t()` when drawing |
| Read at the moment of use (toast, confirm) | `slice.t()` |

Why the reference exists: `t()` returns a `string`, and a string in a prop is frozen. The reference is
an object the framework resolves before the component sees it and re-assigns on every locale change.
`data-t` cannot cover props (they are not DOM nodes), and `watch()` alone does not translate.

## Props: the one exception

```javascript
await slice.build('Button', { value: slice.t.ref('orders.save') });
this.$count.label = slice.t.ref('cart.items', { count });
await slice.build('DropDown', {
  items: [{ label: slice.t.ref('menu.home'), path: '/' }]
});
```

- `t.ref()` returns a frozen reference. **The component only ever receives the translated string**,
  through its normal setter, so components need no changes.
- References nested in arrays or plain objects are resolved, and the whole prop is assigned again on a
  locale change.
- Every prop passed through `setComponentProps` is refreshed. The setters of `static props` are also
  wrapped once per class, so a later direct assignment (`this.$badge.label = slice.t.ref(…)`) works
  too; assigning a plain string afterwards stops refreshing that prop.
- Prop validation (`allowedValues`, unknown props) sees the translated strings, not the references.
- `String(reference)` returns the key and warns in development: a reference used as text is a mistake.

:::warning
`t.ref()` resolves to the key when the translator is off. When a component must keep showing readable
text on an app without dictionaries, guard it:

```javascript
const tr = (key, fallback) => slice.translator?.enabled ? slice.t.ref(key) : fallback;
```
:::

Outside the DOM, `slice.translator.watch(component, cb)` is still the escape hatch (canvas, a library
that copied a string). It is not needed for templates or props.

## Changing the locale

`await slice.translator.setLocale('en')` runs, in order:

1. load what the locale needs (its main file, the namespaces already loaded, the fallback's). On failure
   the locale does not change and the promise rejects;
2. set the locale, `<html lang>` and `<html dir>` (`rtl` for `ar`, `he`, `fa`, `ur`), save the choice
   when `saveLocally`, and rewrite the URL when `routing` is on;
3. re-translate every `data-t` in the document;
4. re-assign every prop that came from a marker, parents before children;
5. re-apply the active route's `metadata` (translated titles work, see [Routing](/Documentation/Routing));
6. call `watch()` callbacks and emit `translator:change` (`{ locale, previous }`).

There is no `localeChanged()` lifecycle hook: what lives in the DOM is marked, props are markers, and
only what lives outside the DOM uses `watch()`:

```javascript
slice.translator.watch(this, () => this._drawCanvasLabel());
```

Two overlapping `setLocale()` calls: the last one wins. A locale that is not in `locales` throws.

## URLs and the router

Independently of `routing`, the router is the only reader of the URL:

```javascript
slice.router.path             // the app path: '/pricing' (no locale, no query)
slice.router.href('/pricing') // the href to render: '/pricing' or '/en/pricing'
```

`slice.router.path` and `slice.router.href()` are also exposed as `slice.path` and `slice.href()`.
Components use the shortcuts: no shared helper, no `window.location`.

Component code should use these instead of `window.location.pathname`, and build anchors with
`href(path)`, so the same component works whether or not the locale is in the URL.

With `"routing": "prefix"` every URL carries the locale (`/es/pricing`, `/en/pricing`); with
`"prefix-except-default"` the default locale has no prefix (`/pricing`, `/en/pricing`).

- Routes are declared **once**, without a locale. `matchRoute` strips a known prefix and sets the
  locale.
- `navigate('/pricing')` adds the active locale. `navigate('/pricing', { locale: 'en' })` goes to
  another language: its dictionaries load **before** the URL changes, so the page never paints keys,
  and a failed load leaves the user where they were.
- `navigate('/en/pricing')` means “that path in that locale”. A guard redirect stays in the target
  locale.
- Back and forward follow the locale of the URL.
- Under `"prefix-except-default"`, a default-locale prefix (`/es/pricing`) is canonicalized to
  `/pricing` with `replaceState`.
- Guards and `router:change` receive `to.path === '/pricing'`, `to.locale === 'en'` and
  `to.url === '/en/pricing'`.
- An unknown prefix (`/fr/…`) is not a locale: it is an ordinary path (a 404 when no route matches).

:::warning
A raw `<a href="/x">` does not carry the locale when `routing` is on. Use `slice.router.href()` (or the
`Link` component) inside translated apps.
:::

## Formatting

`slice.translator.format.*` uses the active locale and caches the `Intl` formatter per locale and
options: `number`, `currency`, `percent`, `date`, `time`, `relative`, `list`. A component that owns a
fixed format (a table of prices in USD, say) can keep its own `Intl` call.

## Multilingual SEO

Native SEO reads the same translator: the server builds **one page per route and locale**.

- **Texts by key.** `title`, `titleTemplate`, `description`, `imageAlt` and the `openGraph`/`twitter`
  title and description in `seo.json` (defaults, routes and `routes.js` `metadata`) accept
  `{ "t": "key", "params": { … } }`. The server resolves them at startup with the same
  `src/locales/*.json` the client downloads; a plain string stays the same in every locale.
- **Per-locale pages.** With `routing`, `/pricing` and `/en/pricing` are prerendered separately, each
  with its own `<html lang>`, `dir`, `og:locale`, canonical and translated `<head>`.
- **Alternates.** Every page carries `<link rel="alternate" hreflang="…">` for its locales plus
  `x-default` (the default locale URL).
- **URLs.** `/` under `"prefix"` answers `302` to the default locale. Under
  `"prefix-except-default"`, a default-locale prefix (`/es/pricing`) answers `301` to `/pricing`.
  A prefix that is not a configured locale (`/fr/…`) is a normal path, so it is a `404`.
- **Sitemap.** `slice seo sitemap` writes one `<url>` per route and locale with the same
  `xhtml:link` alternates and `x-default`.
- **`og:locale`.** The locale as-is, with `-` → `_` (`pt-BR` → `pt_BR`), unless
  `seo.json` maps it: `"locales": { "en": { "ogLocale": "en_US" } }`.
- **Validation.** A `{ t }` key missing in one locale is an error in `slice seo check` and in the
  SEO row of `slice doctor`, because the page would advertise the key as its title. `slice translator
  check` validates the keys used by templates and code against the same dictionaries.

Route metadata in `routes.js` is resolved on the client too (the router re-applies it after a locale
change), so the tab title follows the language without a reload.

## Development tools

- **Debugger panel.** Enable it with `"translator": { "ui": { "enabled": true, "shortcut": "alt+shift+t" } }`.
  It shows the active locale and a switcher, the keys on this page that are missing in the active
  locale (and the ones answered by the fallback), and a **keys** switch that shows keys instead of
  texts everywhere (`setShowKeys`) — the fastest way to see what is translated and what is hardcoded.
- **CLI.** `slice translator init` adds the `translator` block and creates `src/locales/<locale>.json`
  (never overwrites them). `slice translator check` scans templates, `data-t-*` params and
  `slice.t()`/`t.ref()`/`tr()` calls, and fails when a key is missing in a locale. `--unused` also
  lists dictionary keys nothing reads.
- **Doctor.** `slice doctor` has a **Translator** row using the same scan, so CI can gate on it.
- Development warnings (outside production, once each): missing key per locale, missing parameter, a
  key that is a group, a marker used as a string, `data-t` with nothing to fill.

## Current limits

- **The library migration is partial.** Route, MultiRoute, Navbar, BottomNav, Breadcrumbs, SideMenu,
  TreeView, Link, Card, DataList, DescriptionList, Pagination and the docs shell read `slice.path` /
  `slice.href()`, so locale-in-URL routing works. The built-in texts of DataList, Table, DatePicker,
  Select and Pagination are still English until their inventory lands (component feature 0007);
  NotFound is the reference migration.
- Translated slugs (`/es/precios`) are out of scope.
- Keys used only through an app helper (`tr(key)`, a lookup table) are invisible to
  `slice translator check`; that is why unused-key reporting is opt-in.

## Gotchas

- `enabled: true` without `defaultLocale` stays disabled, silently by design. Set both.
- A missing key is shown as the key on purpose — that is how you find it. Check the development warnings.
- The observer watches every attribute (parameters are open-ended), and discards anything that does not
  start with `data-t`, so unrelated animation/style churn does not re-translate.
- Changing only an element's text content by hand under a `data-t` element lasts until the next locale
  change or dictionary merge, which re-applies the key.
- The `aria-label` of a marked element needs its own entry: `{"home": {"search": {"ariaLabel": "Buscar"}}}`.
