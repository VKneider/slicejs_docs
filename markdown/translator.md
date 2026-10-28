---
title: Translating an app
route: /Documentation/Translator
navLabel: Translator
section: Getting Started
group: Configuration
order: 8
description: slice.translator — dictionaries, data-t in templates, key() props, locale-aware URLs and formatting.
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
| `slice.translator.t` | `t(key, params?) → string` | Lookup + plural + interpolation. |
| `slice.translator.locale` | `string` | Active locale. |
| `slice.translator.locales` | `readonly string[]` | Configured locales. |
| `slice.translator.has` | `has(key, locale?) → boolean` | Is it a message? Does not consult the fallback. |
| `slice.translator.setLocale` | `setLocale(locale) → Promise<string>` | Loads first, then switches. See below. |
| `slice.translator.preload` | `preload(locale) → Promise<string>` | Load without switching. |
| `slice.translator.load` | `load(namespace) → Promise<void>` | Load a namespace for the active and fallback locale. |
| `slice.translator.add` | `add(locale, messages, { defaults }) → void` | Merge messages at runtime. |
| `slice.translator.key` | `key(key, params?) → TranslationKey` | A prop reference. See [Props](#props-key-references). |
| `slice.translator.watch` | `watch(component, callback) → () => void` | `callback(locale, previous)` until the component is destroyed. |
| `slice.translator.apply` | `apply(root?) → number` | Translate `data-t` under `root` now (default: the document). |
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

## Props: key references

```javascript
await slice.build('Button', { value: slice.translator.key('orders.save') });
this.$count.label = slice.translator.key('cart.items', { count });
await slice.build('DropDown', {
  items: [{ label: slice.translator.key('menu.home'), path: '/' }]
});
```

- `key()` returns a frozen marker. **The component only ever receives the translated string**, through
  its normal setter, so components need no changes.
- Markers nested in arrays or plain objects are resolved, and the whole prop is assigned again on a
  locale change.
- Every prop passed through `setComponentProps` is refreshed. The setters of `static props` are also
  wrapped once per class, so a later direct assignment (`this.$badge.label = key(…)`) works too;
  assigning a plain string afterwards stops refreshing that prop.
- Prop validation (`allowedValues`, unknown props) sees the translated strings, not the markers.
- `String(marker)` returns the key and warns in development: a marker used as text is a mistake.

:::warning
`key()` resolves to the key when the translator is off. When a component must keep showing readable
text on an app without dictionaries, guard the marker:

```javascript
const tr = (key, fallback) => slice.translator?.enabled ? slice.translator.key(key) : fallback;
```
:::

Choose between the two mechanisms by where the text lives: **`data-t` for text in a template**,
**`key()` for a value passed as a prop**. `slice.t()` is for text read at the moment of use.

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

## Current limits

- **Native SEO is single-language for now.** With `seo.json` configured, the server still prerenders
  one page per route, so `/en/...` is answered like an unknown path until the multilingual SEO phase
  (framework feature 0003, phase 5) ships. Apps **without** native SEO get the shell and work.
- **Some library components still read `window.location.pathname`** (`Route`, `MultiRoute`, `Navbar`,
  `BottomNav`, `SideMenu`, `Breadcrumbs`, `TreeView`). Until the library migrates to
  `slice.router.path` (slicejs-components feature 0007), do not enable `routing` in an app whose
  active-route UI depends on them; the translator itself works fine without `routing`.
- Translated slugs (`/es/precios`) are out of scope.

## Gotchas

- `enabled: true` without `defaultLocale` stays disabled, silently by design. Set both.
- A missing key is shown as the key on purpose — that is how you find it. Check the development warnings.
- The observer watches every attribute (parameters are open-ended), and discards anything that does not
  start with `data-t`, so unrelated animation/style churn does not re-translate.
- Changing only an element's text content by hand under a `data-t` element lasts until the next locale
  change or dictionary merge, which re-applies the key.
- The `aria-label` of a marked element needs its own entry: `{"home": {"search": {"ariaLabel": "Buscar"}}}`.
