# Translation and locales — `slice.translator`

Verified against slicejs-web-framework 4.1.x + the translator feature (framework 0003). When in
doubt about a config field or a signature, check `sliceConfig.schema.json` / the `translator` docs
page; this note carries the **decisions and traps**.

## Mental model

`slice.translator` is **structural**, created by `Slice.init()` like the router. It always exists:

- `enabled: false` → nothing is loaded or observed, `t()` returns the key, `format.*` uses the
  browser's locale. Code written against it runs in an untranslated app.
- `enabled: true` requires `defaultLocale`. Without it the translator stays disabled (silently).

Three mechanisms, chosen by **where the text lives**:

| Text lives in | Use | Why |
| --- | --- | --- |
| A template (`.html`) or `App/index.html` | `data-t="key"` | A `MutationObserver` translates it on entry and on every locale change. Never write translated text from JS. |
| A value passed as a prop | `slice.translator.key('key', params?)` | The component receives a plain string; the framework re-assigns the prop on a locale change. Components need no changes. |
| A string read at the moment of use (toast, confirm, canvas) | `slice.t('key', params?)` | It is correct when created; nothing to refresh. |
| A third-party widget that cached a string | `slice.translator.watch(component, cb)` | Escape hatch for what is outside the DOM. |

## Canonical snippets

```html
<h1 data-t="home.title"></h1>
<input data-t="home.search" placeholder aria-label />
<p data-t="terms.text">Terms: <a data-t-slot="link" data-t="terms.link"></a></p>
<p data-t="cart.items" data-t-count="3"></p>
```

- Attribute keys are `key.<attribute>` in camelCase: `placeholder`, `title`, `alt`,
  `aria-label` → `ariaLabel`, `aria-description`, `aria-placeholder`, `aria-roledescription`,
  `aria-valuetext`, `label` on option/optgroup/track, `value` on button/submit/reset inputs.
- Params are `data-t-*` (`data-t-user-name` → `{ userName }`); numeric strings become numbers.
  `data-t-text` and `data-t-slot` are directives, not params.
- Slots: the message contains `{link}`; the child marked `data-t-slot="link"` keeps its attributes
  and listeners. Dictionaries never contain HTML.

```javascript
// Library components mark built-in texts and ship defaults (en/es) through shared/text/texts.js;
// app dictionaries and instance props win. Routes use slice.path / slice.href().

// Props (markers; nested in arrays/objects is fine)
await slice.build('Button', { value: slice.translator.key('orders.save') });
this.$badge.label = slice.translator.key('cart.items', { count });

// Read at use
slice.t('orders.count', { count: 3 });

// Refresh outside the DOM
slice.translator.watch(this, (locale) => this._draw(locale));
```

## Dictionaries

```
src/locales/es.json          main file (loaded at init with the fallback's)
src/locales/es/orders.json   namespace: await slice.translator.load('orders')
```

Lookup: app (active) → defaults (active) → app (fallback) → defaults (fallback) → **the key**. A
missing key showing up on screen is the designed signal; development warns once per key+locale.

- `add(locale, messages)` merges app messages.
- `add(locale, messages, { defaults: true })` is the library layer: it never overrides the app.
- Plural: `{ "one": "{count} order", "other": "{count} orders", "zero": "No orders" }`; categories
  come from `Intl.PluralRules`, `other` is required, `zero` wins for 0.
- `{name}` interpolates; a number is formatted for the locale; `{{` and `}}` are literal braces.
  No ICU MessageFormat in this version.

## Switching locale

`await slice.translator.setLocale('en')` loads first (rejects and keeps the old locale on failure),
then sets `<html lang|dir>` (rtl for ar/he/fa/ur), saves if `saveLocally`, rewrites the URL with
`routing`, re-translates the document, re-assigns marker props (parents first), re-applies route
metadata, calls `watch()` and emits `translator:change`. **There is no `localeChanged()` hook** — do
not invent one.

## Locale in the URL

`translator.routing`: `false` (default) · `"prefix"` (`/es/pricing`) · `"prefix-except-default"`
(`/pricing` + `/en/pricing`).

Even with routing off, the router is the only URL reader:

```javascript
slice.path                     // '/pricing' — no locale, no query (shortcut of router.path)
slice.href('/pricing')         // '/pricing' or '/en/pricing' (shortcut of router.href)
await slice.router.navigate('/pricing', { locale: 'en' });
```

Components read `slice.path` and build anchors with `slice.href(path)`; they import no helper and never
read `window.location.pathname`.

Traps:

- Routes are declared without a locale; a known prefix is stripped by `matchRoute`.
- `navigate` with a locale loads its dictionaries **before** pushing the URL.
- Under `prefix-except-default`, `/es/pricing` is canonicalized to `/pricing` (replaceState).
- Raw `<a href="/x">` loses the locale. Use `href()`/`Link` in translated apps.
- Guards receive `to.path` (app path), `to.locale` and `to.url` (address bar).
- **Library components that read `window.location.pathname`** (Route, MultiRoute, Navbar, BottomNav,
  SideMenu, Breadcrumbs, TreeView) do not see the active route under `/en/...` until they migrate to
  `slice.router.path` (slicejs-components 0007). Do not turn on `routing` before that migration.

## Server side and SEO

`slice build` copies `src/locales` to `dist/locales`; `api/framework/server.js` mounts the folder at
`translator.path` in both modes. If dictionaries 404 in production, check that mount and the
configured `path` — not `public/`.

With `routing`, native SEO prerenders **one page per route and locale**:

- `title`, `titleTemplate`, `description`, `imageAlt` and the `openGraph`/`twitter` title and
  description in `seo.json` (and `routes.js` metadata) accept `{ t: 'key', params? }`.
- Each page gets its own `<html lang|dir>`, canonical, `og:locale` and
  `<link rel="alternate" hreflang>` (plus `x-default`).
- `/` under `prefix` → 302 to the default locale; `/es/x` under `prefix-except-default` → 301 to
  `/x`; an unknown prefix (`/fr/…`) is a normal 404.
- `slice seo sitemap` emits one `<url>` per route and locale with the same alternates; a `{ t }` key
  missing in a locale fails `slice seo check` and `slice translator check`.
- `og:locale` is the locale with `-` → `_`, unless `seo.json` maps it via
  `locales.<locale>.ogLocale`.

## CLI and the debugger

- `slice translator init [--locales es,en] [--default es]` adds the config block and creates the
  dictionaries (never overwrites).
- `slice translator check [--unused]` scans templates + `data-t-*` + `slice.t()`/`key()`/`tr()` calls
  and fails on a key missing in a locale. `slice doctor` runs the same scan in its Translator row.
- `translator.ui.enabled` + `shortcut` (e.g. `alt+shift+t`) opens a panel with the locale switcher, the
  missing keys on the page, and a **keys** switch (`slice.translator.setShowKeys(true)`) that renders
  every mark as its key.

Keys reached only through an app helper (`tr(key)`, a lookup table) are invisible to the scan, so
unused-key reporting is opt-in.

## Checklist for a translated screen

1. `translator` block in `sliceConfig.json` (`enabled`, `defaultLocale`, `locales`, `path`).
2. Dictionaries under `src/locales/<locale>.json` (+ namespaces for heavy screens).
3. Template text uses `data-t`; attributes need their `key.<attribute>` entry.
4. Text passed as a prop uses `key()`; guard markers when the app may run with the translator off:
   `slice.translator?.enabled ? key(...) : fallback`.
5. `<html lang|dir>` is updated by the framework — do not set it by hand.
6. Test the switch: `setLocale()` must leave no key on screen, props must be re-assigned, and a
   reload must keep the choice when `saveLocally` is on.
