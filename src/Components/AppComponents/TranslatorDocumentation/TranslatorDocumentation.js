export default class TranslatorDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "translator.md";
    this.markdownContent = "---\ntitle: Translating an app\nroute: /Documentation/Translator\nnavLabel: Translator\nsection: Getting Started\ngroup: Configuration\norder: 8\ndescription: slice.translator — dictionaries, data-t in templates, t.ref() for props, locale-aware URLs and formatting.\ncomponent: TranslatorDocumentation\ntags: [translator, i18n, locales, routing]\n---\n\n# Translating an app\n\n`slice.translator` is a **structural** part of Slice, next to `slice.router` and `slice.context`. It\nowns the dictionaries, the active locale, the translations in the DOM and in component props, and the\nlocale in the URL. `slice.t()` is the shortcut for `slice.translator.t()`.\n\nIt always exists. With `\"enabled\": false` it loads nothing, `t()` returns the key, `data-t` is left\nalone and `format.*` uses the browser's language — so code written against it runs in any app.\n\n## Enable it\n\n```json title=\"src/sliceConfig.json\"\n\"translator\": {\n  \"enabled\": true,\n  \"defaultLocale\": \"es\",\n  \"fallbackLocale\": \"en\",\n  \"locales\": [\"es\", \"en\"],\n  \"path\": \"/locales\",\n  \"saveLocally\": true,\n  \"useBrowserLocale\": true,\n  \"localePrefix\": false\n}\n```\n\n| Field | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `enabled` | `boolean` | `false` | Off: nothing is loaded or observed and `t()` returns the key. |\n| `defaultLocale` | `string` | — | Required when enabled. The locale an unprefixed URL means. |\n| `fallbackLocale` | `string \\| null` | `null` | Asked when the active locale has no entry for a key. |\n| `locales` | `string[]` | `[defaultLocale]` | The locales the app has, plus a configured `fallbackLocale`. `setLocale()` refuses anything else; casing duplicates are merged. |\n| `path` | `string` | `/locales` | Where the dictionaries are served from. A relative value is normalized to `/value`. |\n| `saveLocally` | `boolean` | `false` | Remember the choice in `localStorage` (`slice:locale`). |\n| `useBrowserLocale` | `boolean` | `false` | On a first visit, use the browser language when supported (`es-VE` → `es`); otherwise `defaultLocale`. |\n| `localePrefix` | `false \\| \"always\" \\| \"except-default\"` | `false` | Whether the locale lives in the URL. See [URLs](#urls-and-the-router). |\n| `ui` | `object` | none | `{ enabled, shortcut }`: the translator debugger panel. |\n\n**Which locale starts:** an explicit URL prefix always wins. Without one, the saved choice → the\nbrowser language (`useBrowserLocale`) → `defaultLocale`. Under `\"except-default\"` an unprefixed URL\nmeans \"no explicit choice yet\", so `useBrowserLocale` still works on the first visit; once the user\npicks a language, `saveLocally` keeps it.\n\nThe starting locale is applied before the first route renders. `slice init` projects can add the\nblock by hand; `slice doctor` validates it against the schema.\n\n## Dictionaries\n\n```\nsrc/locales/es.json          loaded at start, together with the fallback's\nsrc/locales/en.json\nsrc/locales/es/orders.json   a namespace: loaded by slice.translator.load('orders')\n```\n\nKeys are hierarchical, values are plain text (never HTML):\n\n```json title=\"src/locales/es.json\"\n{\n  \"orders\": {\n    \"greeting\": \"Hola, {name}\",\n    \"count\": { \"one\": \"{count} pedido\", \"other\": \"{count} pedidos\", \"zero\": \"Sin pedidos\" },\n    \"title\": \"Pedidos\"\n  }\n}\n```\n\nA namespace file is merged under its own name (`orders.json` → the `orders` branch), so\n`load('orders')` only downloads when a screen needs it.\n\nThe lookup order is: **app dictionaries** for the active locale → the **defaults layer** for the\nactive locale → both again for `fallbackLocale` → **the key itself**. A missing key is not a crash: it\nis shown as `orders.title` and reported once in development.\n\n`slice.translator.add(locale, messages)` merges at runtime. `add(locale, messages, { defaults: true })`\nwrites to the lower layer that never overrides the app's dictionaries — that is how a component\nlibrary ships its own texts without taking control of the dictionary.\n\n:::note\n`slice build` copies `src/locales` into `dist/locales`, and the server serves the folder at\n`translator.path` in development and in production. If you move the dictionaries, change `path`; do not\nput them under `public/`.\n:::\n\n## Library components: `texts()`\n\nVisual components are copied one by one (`slice get`), so each one carries its own defaults instead\nof depending on a central file. `shared/text/texts.js` registers them in the defaults layer, once per\nnamespace, when the component module loads:\n\n```js\nimport { texts } from '../../shared/text/texts.js';\n\nconst t = texts('slice.notFound', {\n  en: { title: 'Page Not Found', home: 'Go Home' },\n  es: { title: 'Página no encontrada', home: 'Ir al inicio' }\n});\n\nt('title'); // translated, or the English default with the translator off\n```\n\nThe priority is **instance prop → app dictionary → component default → key**, so an app can translate\na built-in text without touching the component:\n\n```json title=\"src/locales/es.json\"\n{ \"slice\": { \"modal\": { \"close\": \"Cerrar\" } } }\n```\n\nWith the translator disabled (or on a framework without it) `texts()` returns the English default,\nwhich is the text the component showed before. Built-in texts are marked with `data-t` or read\nthrough `texts()`; a text passed as a prop uses `slice.t.ref('slice.modal.close')`. The authoring contract is\n`COMPONENT_API_STANDARDS.md` §16 of the components library.\n\n:::note\nEvery visual component ships en/es defaults for its own chrome (`slice.table.*`,\n`slice.modal.*`, `slice.validation.*`, …). Its text prop (`texts`, `labels`, `closeLabel`…) still wins,\nand an app dictionary always wins over both.\n:::\n\n## Messages\n\n| Feature | Dictionary | Call | Result (`es`) |\n| --- | --- | --- | --- |\n| Interpolation | `\"greeting\": \"Hola, {name}\"` | `slice.t('orders.greeting', { name: 'Ana' })` | `Hola, Ana` |\n| Plural | `\"count\": { \"one\": \"{count} pedido\", \"other\": \"{count} pedidos\" }` | `slice.t('orders.count', { count: 3 })` | `3 pedidos` |\n| Exact zero | `\"zero\": \"Sin pedidos\"` | `slice.t('orders.count', { count: 0 })` | `Sin pedidos` |\n| Numbers | `\"{count} pedidos\"` | `{ count: 1234 }` | `1.234 pedidos` |\n| Literal brace | `\"{{\"` / `\"}}\"` | — | `{` / `}` |\n\nPlural categories come from `Intl.PluralRules` for the current locale; `other` is required. A number\npassed as a parameter is formatted with the locale. There is no ICU MessageFormat in this version.\n\n## Lists\n\nA dictionary value can be an array. `slice.t.list(key, params?)` returns it for the active locale:\n\n```json\n{\n  \"roles\": [\"Professor\", \"Engineer\"],\n  \"greetings\": [\"Hello, {name}\", \"Welcome, {name}\"]\n}\n```\n\n```javascript\nslice.t.list('roles');                       // ['Professor', 'Engineer']\nslice.t.list('greetings', { name: 'Ana' });  // ['Hello, Ana', 'Welcome, Ana']\n```\n\n- String and plural items are formatted like `t()`; objects are returned as-is (a list of records, for\n  example).\n- Missing key or a non-array: `[]` and one development warning. With `showKeys`, string items render as\n  `key.0`, `key.1`…\n- For a prop, `slice.t.ref.list('roles')` is the list marker: the component receives the array and a\n  fresh one on every locale change. The component's setter must rebuild, not append.\n- `t.list()` returns a copy of the array: sorting or splicing it does not mutate the dictionary.\n\nContent arrays inside a content document do not need `t.list()`: they are data, and `t.content()`\nresolves them.\n\n## Content documents\n\nSome text is not UI copy but records: experience, projects, courses. A content document keeps the\nstructure once and the prose once per locale, in `<translator.path>/content/<name>.json`\n(`src/locales/content/…` by default):\n\n```json\n{\n  \"records\": [\n    {\n      \"id\": 1,\n      \"logo\": \"/images/uru.png\",\n      \"startYear\": 2024,\n      \"technologies\": [\"JavaScript\"],\n      \"copy\": {\n        \"en\": { \"position\": \"Professor\", \"responsibilities\": [\"Teach\", \"Build\"] },\n        \"es\": { \"position\": \"Profesor\", \"responsibilities\": [\"Enseñar\", \"Construir\"] }\n      }\n    }\n  ]\n}\n```\n\n```javascript\nconst document = await slice.t.content('experience');\ndocument.records[0].position;          // \"Profesor\"\ndocument.records[0].responsibilities;  // [\"Enseñar\", \"Construir\"]\ndocument.records[0].logo;              // structure, written once\n```\n\n- `copy` is resolved with `slice.t.localized(value)` and merged over the node's fields; `copy` itself\n  disappears from the result. Nested nodes (course → unit → topic) work the same way: every node can\n  carry its own `copy`.\n- The document is fetched once and resolved per locale; `setLocale()` does not re-download it.\n- A missing document returns `null` (and warns). A missing branch falls back to `fallbackLocale` →\n  `defaultLocale` and warns in development.\n- `slice.t.localized({ en, es })` is the primitive, for a one-off value that is not a document.\n- Content is data, not messages: it does not appear in the debugger key panel, and `slice translator\n  check` validates its shape instead of looking for keys.\n- The server reads the same file with `readContent()` / `resolveContentFor()` from\n  `slicejs-web-framework/api/framework/content.js`.\n\n### Per-locale files instead of `copy`\n\nIf an app prefers one file per language, keep full records in `src/locales/<locale>/<section>.json`\nand read them with `slice.translator.load('section')` + `slice.t.list('section.records')`. That layout\nduplicates structure; the `copy` document does not. Both are supported; pick one per section.\n\n## JavaScript API\n\n| API | Signature | Notes |\n| --- | --- | --- |\n| `slice.t` | `t(key, params?) → string` | Shortcut of `slice.translator.t`. |\n| `slice.t.ref` | `t.ref(key, params?) → TranslationRef` | A prop reference. See [Props](#props-the-one-exception). |\n| `slice.t.list` | `t.list(key, params?) → any[]` | A list from the dictionary, or `[]`. See [Lists](#lists). |\n| `slice.t.ref.list` | `t.ref.list(key, params?) → TranslationListRef` | A list prop reference. |\n| `slice.t.localized` | `t.localized(value) → any` | Resolve `{ en, es }` for the active locale. |\n| `slice.t.content` | `t.content(name) → Promise<object\\|null>` | Load and resolve a content document. |\n| `slice.locale` | `string` | Active locale shortcut. |\n| `slice.translator.t` | `t(key, params?) → string` | Lookup + plural + interpolation. |\n| `slice.translator.list` | `list(key, params?) → any[]` | A list of messages or records. |\n| `slice.translator.localized` | `localized(value) → any` | Resolve a localized content value. |\n| `slice.translator.content` | `content(name) → Promise<object\\|null>` | Load/resolve `<path>/content/<name>.json`. |\n| `slice.translator.locale` | `string` | Active locale. |\n| `slice.translator.locales` | `readonly string[]` | Configured locales. |\n| `slice.translator.has` | `has(key, locale?) → boolean` | Is it a message? Does not consult the fallback. |\n| `slice.translator.setLocale` | `setLocale(locale) → Promise<string>` | Loads first, then switches. See below. |\n| `slice.translator.preload` | `preload(locale) → Promise<string>` | Load without switching. |\n| `slice.translator.load` | `load(namespace) → Promise<void>` | Load a namespace for the active and fallback locale. |\n| `slice.translator.add` | `add(locale, messages, { defaults }) → void` | Merge messages at runtime. |\n| `slice.translator.ref` | `ref(key, params?) → TranslationRef` | A prop reference. See [Props](#props-the-one-exception). |\n| `slice.translator.refList` | `refList(key, params?) → TranslationListRef` | A list prop reference. |\n| `slice.translator.watch` | `watch(component, callback) → () => void` | `callback(locale, previous)` until the component is destroyed. |\n| `slice.translator.apply` | `apply(root?) → number` | Translate `data-t` under `root` now (default: the document). |\n| `slice.translator.setShowKeys` | `setShowKeys(enabled) → boolean` | Debugger switch: `t()` returns keys instead of texts and the document re-renders. |\n| `slice.translator.format` | `number / currency / percent / date / time / relative / list` | `Intl` wrappers cached per locale and options. |\n\n```javascript\nslice.t('orders.count', { count: itemCount });\nslice.t('prices.total', { amount: slice.translator.format.currency(1299, 'EUR') });\nslice.translator.format.date(new Date(), { dateStyle: 'long' });\n```\n\n## Templates: mark the text, don't write it\n\n```html\n<h1 data-t=\"home.title\"></h1>\n<input data-t=\"home.search\" placeholder aria-label />\n<p data-t=\"signup.terms\">\n  <a href=\"/terms\" data-t-slot=\"link\" data-t=\"signup.termsLink\"></a>\n</p>\n```\n\nFor `data-t=\"key\"`:\n\n- the element's **text** is `key` — unless the element has translatable attributes, in which case only\n  those are filled. Add `data-t-text` to fill both.\n- every **translatable attribute present** (even empty) is `key.<attribute>` in camelCase: `placeholder`,\n  `title`, `alt`, `aria-label` → `key.ariaLabel`, `aria-description`, `aria-placeholder`,\n  `aria-roledescription`, `aria-valuetext`, `label` on `<option>`/`<optgroup>`/`<track>`, and `value` on\n  `input[type=button|submit|reset]`.\n- **slots**: a message such as `\"Acepto los {link}.\"` is rebuilt around the element marked\n  `data-t-slot=\"link\"`, which keeps its attributes and its listeners. Dictionaries never contain HTML.\n\n**Marked, not written.** Any element with `data-t` — in a component template, in `App/index.html`, or\ncreated later from JavaScript — is translated when it enters the document and again on every locale\nchange. One `MutationObserver` does it, so nothing is copied into JavaScript and no hook has to repaint\nit:\n\n```javascript\nthis.$count.dataset.tCount = items.length;         // re-translates \"cart.items\" with { count }\nthis.$status.dataset.t = `orders.status.${state}`; // a different key: re-translated too\nel.innerHTML = '<p data-t=\"about.description\"></p>'; // HTML built from JavaScript works the same\n```\n\nParameters come from `data-t-*` attributes (`data-t-user-name` → `{ userName }`); numeric strings become\nnumbers. `data-t-text` and `data-t-slot` are directives, not parameters. Templates are translated inside\n`attachTemplate` while the component is still detached, so `init()` reads translated text and the first\npaint has no keys.\n\nText computed at the moment it is used (`slice.t()` in a toast, in a confirm) needs nothing at all.\n\n## One entry point: `t`\n\n`t` is the method you use everywhere. The only exception is a value that must live in a component\nprop and survive a locale change without rebuilding the component; for that, `t` has a namespaced\nreference:\n\n```javascript\nslice.t('orders.save')        // \"Guardar\" — text, right now\nslice.t.ref('orders.save')    // a reference for a prop\n```\n\n| Text | Mechanism |\n| --- | --- |\n| In a template (`.html`) | `data-t` — nothing else |\n| Created from JS (`textContent`, `innerHTML`) | `data-t` / `dataset.t` (+ `data-t-*` params) |\n| Passed as a component prop, must follow the locale | `slice.t.ref()` |\n| Passed as a list prop, must follow the locale | `slice.t.ref.list()` |\n| A dictionary list (`[\"a\", \"b\"]`) | `slice.t.list()` |\n| A content record (`copy: { en, es }`) | `slice.t.content()` |\n| Computed by your component from data | `slice.t()` + `update()`/`watch()` |\n| Outside the DOM (canvas, third-party widget) | `watch()` + `slice.t()` when drawing |\n| Read at the moment of use (toast, confirm) | `slice.t()` |\n\nWhy the reference exists: `t()` returns a `string`, and a string in a prop is frozen. The reference is\nan object the framework resolves before the component sees it and re-assigns on every locale change.\n`data-t` cannot cover props (they are not DOM nodes), and `watch()` alone does not translate.\n\n## Props: the one exception\n\n```javascript\nawait slice.build('Button', { value: slice.t.ref('orders.save') });\nthis.$count.label = slice.t.ref('cart.items', { count });\nawait slice.build('DropDown', {\n  items: [{ label: slice.t.ref('menu.home'), path: '/' }]\n});\n```\n\n- `t.ref()` returns a frozen reference. **The component only ever receives the translated string**,\n  through its normal setter, so components need no changes.\n- References nested in arrays or plain objects are resolved, and the whole prop is assigned again on a\n  locale change.\n- Every prop passed through `setComponentProps` is refreshed. The setters of `static props` are also\n  wrapped once per class, so a later direct assignment (`this.$badge.label = slice.t.ref(…)`) works\n  too; assigning a plain string afterwards stops refreshing that prop.\n- Prop validation (`allowedValues`, unknown props) sees the translated strings, not the references.\n- `String(reference)` returns the key and warns in development: a reference used as text is a mistake.\n\n:::warning\n`t.ref()` resolves to the key when the translator is off. When a component must keep showing readable\ntext on an app without dictionaries, guard it:\n\n```javascript\nconst tr = (key, fallback) => slice.translator?.enabled ? slice.t.ref(key) : fallback;\n```\n:::\n\nOutside the DOM, `slice.translator.watch(component, cb)` is the escape hatch (canvas, a library\nthat copied a string). It is not needed for templates or props.\n\n## Changing the locale\n\n`await slice.translator.setLocale('en')` runs, in order:\n\n1. load what the locale needs (its main file, the namespaces already loaded, the fallback's). On failure\n   the locale does not change and the promise rejects;\n2. set the locale, `<html lang>` and `<html dir>` (`rtl` for `ar`, `he`, `fa`, `ur`), save the choice\n   when `saveLocally`, and rewrite the URL when `localePrefix` is on;\n3. re-translate every `data-t` in the document;\n4. re-assign every prop that came from a marker, parents before children;\n5. re-apply the active route's `metadata` (translated titles work, see [Routing](/Documentation/Routing));\n6. call `watch()` callbacks and emit `translator:change` (`{ locale, previous }`).\n\nThere is no `localeChanged()` lifecycle hook: what lives in the DOM is marked, props are markers, and\nonly what lives outside the DOM uses `watch()`:\n\n```javascript\nslice.translator.watch(this, () => this._drawCanvasLabel());\n```\n\nTwo overlapping `setLocale()` calls: the last one wins. A locale that is not in `locales` throws.\n\n## URLs and the router\n\nIndependently of `localePrefix`, the router is the only reader of the URL:\n\n```javascript\nslice.router.path             // the app path: '/pricing' (no locale, no query)\nslice.router.href('/pricing') // the href to render: '/pricing' or '/en/pricing'\n```\n\n`slice.router.path` and `slice.router.href()` are also exposed as `slice.path` and `slice.href()`.\nComponents use the shortcuts: no shared helper, no `window.location`.\n\nComponent code should use these instead of `window.location.pathname`, and build anchors with\n`href(path)`, so the same component works whether or not the locale is in the URL.\n\nWith `\"localePrefix\": \"always\"` every URL carries the locale (`/es/pricing`, `/en/pricing`); with\n`\"except-default\"` the default locale has no prefix (`/pricing`, `/en/pricing`).\n\n- Routes are declared **once**, without a locale. `matchRoute` strips a known prefix and sets the\n  locale.\n- `navigate('/pricing')` adds the active locale. `navigate('/pricing', { locale: 'en' })` goes to\n  another language: its dictionaries load **before** the URL changes, so the page never paints keys,\n  and a failed load leaves the user where they were.\n- `navigate('/en/pricing')` means “that path in that locale”. A guard redirect stays in the target\n  locale.\n- Back and forward follow the locale of the URL.\n- Under `\"except-default\"`, a default-locale prefix (`/es/pricing`) is canonicalized to\n  `/pricing` with `replaceState`.\n- Guards and `router:change` receive `to.path === '/pricing'`, `to.locale === 'en'` and\n  `to.url === '/en/pricing'`.\n- An unknown prefix (`/fr/…`) is not a locale: it is an ordinary path (a 404 when no route matches).\n\n:::warning\nA raw `<a href=\"/x\">` does not carry the locale when `localePrefix` is on. Use `slice.router.href()` (or the\n`Link` component) inside translated apps.\n:::\n\n## Formatting\n\n`slice.translator.format.*` uses the active locale and caches the `Intl` formatter per locale and\noptions: `number`, `currency`, `percent`, `date`, `time`, `relative`, `list`. A component that owns a\nfixed format (a table of prices in USD, say) can keep its own `Intl` call.\n\n## Multilingual SEO\n\nNative SEO reads the same translator: the server builds **one page per route and locale**.\n\n- **Texts by key.** `title`, `description`, `imageAlt` and the `openGraph`/`twitter`\n  title and description in `seo.json` (defaults, routes and `routes.js` `metadata`) accept\n  `{ \"t\": \"key\", \"params\": { … } }`; route metadata and `seo.json` entries also accept\n  `titleKey` / `descriptionKey` as the shorthand. The server resolves them at startup with the same\n  `src/locales/*.json` the client downloads; a plain string stays the same in every locale.\n- **Per-locale pages.** With a locale prefix, `/pricing` and `/en/pricing` are prerendered separately, each\n  with its own `<html lang>`, `dir`, `og:locale`, canonical and translated `<head>`.\n- **Alternates.** Every page carries `<link rel=\"alternate\" hreflang=\"…\">` for its locales plus\n  `x-default` (the default locale URL).\n- **URLs.** `/` under `\"always\"` answers `302` to the default locale; a known unprefixed path under\n  `\"always\"` answers `302` to its prefixed URL. Under `\"except-default\"`, a default-locale prefix\n  (`/es/pricing`) answers `301` to `/pricing`. A prefix that is not a configured locale (`/fr/…`) is a\n  normal path, so it is a `404`.\n- **Sitemap.** `slice seo sitemap` writes one `<url>` per route and locale with the same\n  `xhtml:link` alternates and `x-default`.\n- **`og:locale`.** The locale as-is, with `-` → `_` (`pt-BR` → `pt_BR`), unless\n  `seo.json` maps it: `\"locales\": { \"en\": { \"ogLocale\": \"en_US\" } }`.\n- **Validation.** A `{ t }` key missing in one locale is an error in `slice seo check` and in the\n  SEO row of `slice doctor`, because the page would advertise the key as its title. `slice translator\n  check` validates the keys used by templates and code against the same dictionaries, including\n  namespace files.\n- **404.** The page uses `seo.notFound.title` and `seo.notFound.description` when the dictionaries\n  define them, plus the same title affixes; otherwise `Not found`, always `noindex`.\n\nRoute metadata in `routes.js` is resolved on the client too (the router re-applies it after a locale\nchange), so the tab title follows the language without a reload. The product name lives once in\n`router.titlePrefix` / `router.titleSuffix` (the separator is part of the string); the server reads the\nsame block, so the prerendered `<title>` and the hydrated one match. A route can override an affix or\ndisable it with `metadata.titlePrefix/titleSuffix: false`. A `titleKey`/`descriptionKey` with the\ntranslator off shows the key and logs one warning per key, so an untranslated page is visible.\n\n## Development tools\n\n- **Debugger panel.** Enable it with `\"translator\": { \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+t\" } }`.\n  It shows the active locale and a switcher, the keys on this page that are missing in the active\n  locale (and the ones answered by the fallback), and a **keys** switch that shows keys instead of\n  texts everywhere (`setShowKeys`) — the fastest way to see what is translated and what is hardcoded.\n- **CLI.** `slice translator init` adds the `translator` block and creates `src/locales/<locale>.json`\n  (never overwrites them). `slice translator check` scans templates, `data-t-*` params and\n  `slice.t()`/`t.ref()`/`t.list()`/`t.ref.list()`/`tr()`/`translate()`/`$t()` calls (plus namespace\n  files), and fails when a key is missing in a locale or a list key is not an array. It also checks\n  every `slice.t.content('name')` against `locales/content/name.json` and validates each `copy`: every\n  locale present, same shape, no empty strings. `--unused` also lists dictionary keys nothing reads.\n- **Doctor.** `slice doctor` has a **Translator** row using the same scan, so CI can gate on it.\n- Development warnings (outside production, once each): missing key per locale, missing list or content\n  document, a `copy` without the active locale, missing parameter, a key that is a group, a marker used\n  as a string, `data-t` with nothing to fill.\n\n## Current limits\n\n- **Locale-aware routing.** Route, MultiRoute, Navbar, BottomNav, Breadcrumbs, SideMenu, TreeView,\n  Link, Card, DataList, DescriptionList and Pagination read `slice.path` / `slice.href()`; every visual\n  component ships en/es defaults for its built-in texts (component feature 0007). The docs site still\n  needs its own dictionaries for its page content.\n- Translated slugs (`/es/precios`) are out of scope.\n- Keys used only through an app helper (`tr(key)`, a lookup table) are invisible to\n  `slice translator check`; that is why unused-key reporting is opt-in.\n\n## Gotchas\n\n- `enabled: true` without `defaultLocale` stays disabled and logs an error. Set both.\n- A missing key is shown as the key on purpose — that is how you find it. Check the development warnings.\n- The observer watches attributes but only reacts to `data-t` / `data-t-*` (not `data-theme`, `data-tab`…), so unrelated animation/style churn does not re-translate.\n- Changing only an element's text content by hand under a `data-t` element lasts until the next locale\n  change or dictionary merge, which re-applies the key.\n- The `aria-label` of a marked element needs its own entry: `{\"home\": {\"search\": {\"ariaLabel\": \"Buscar\"}}}`.\n- Content documents are reads, not marks: a section that renders records must re-render on a locale\n  change (`watch()`), and preserve its own state (active tab, search, page). `data-t` refreshes text,\n  not a record list.\n- A `copy` next to structural fields must be an object (`{ \"title\": \"…\" }`). A scalar/array `copy` only\n  works on a node that has nothing else; otherwise there is no field name for the text.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "\"translator\": {\n  \"enabled\": true,\n  \"defaultLocale\": \"es\",\n  \"fallbackLocale\": \"en\",\n  \"locales\": [\"es\", \"en\"],\n  \"path\": \"/locales\",\n  \"saveLocally\": true,\n  \"useBrowserLocale\": true,\n  \"localePrefix\": false\n}",
               language: "json"
            });
            if ("src/sliceConfig.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/sliceConfig.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const lines = ["| Field | Type | Default | Notes |","| --- | --- | --- | --- |","| `enabled` | `boolean` | `false` | Off: nothing is loaded or observed and `t()` returns the key. |","| `defaultLocale` | `string` | — | Required when enabled. The locale an unprefixed URL means. |","| `fallbackLocale` | `string \\| null` | `null` | Asked when the active locale has no entry for a key. |","| `locales` | `string[]` | `[defaultLocale]` | The locales the app has, plus a configured `fallbackLocale`. `setLocale()` refuses anything else; casing duplicates are merged. |","| `path` | `string` | `/locales` | Where the dictionaries are served from. A relative value is normalized to `/value`. |","| `saveLocally` | `boolean` | `false` | Remember the choice in `localStorage` (`slice:locale`). |","| `useBrowserLocale` | `boolean` | `false` | On a first visit, use the browser language when supported (`es-VE` → `es`); otherwise `defaultLocale`. |","| `localePrefix` | `false \\| \"always\" \\| \"except-default\"` | `false` | Whether the locale lives in the URL. See [URLs](#urls-and-the-router). |","| `ui` | `object` | none | `{ enabled, shortcut }`: the translator debugger panel. |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "src/locales/es.json          loaded at start, together with the fallback's\nsrc/locales/en.json\nsrc/locales/es/orders.json   a namespace: loaded by slice.translator.load('orders')",
               language: "text"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"orders\": {\n    \"greeting\": \"Hola, {name}\",\n    \"count\": { \"one\": \"{count} pedido\", \"other\": \"{count} pedidos\", \"zero\": \"Sin pedidos\" },\n    \"title\": \"Pedidos\"\n  }\n}",
               language: "json"
            });
            if ("src/locales/es.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/locales/es.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import { texts } from '../../shared/text/texts.js';\n\nconst t = texts('slice.notFound', {\n  en: { title: 'Page Not Found', home: 'Go Home' },\n  es: { title: 'Página no encontrada', home: 'Ir al inicio' }\n});\n\nt('title'); // translated, or the English default with the translator off",
               language: "js"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{ \"slice\": { \"modal\": { \"close\": \"Cerrar\" } } }",
               language: "json"
            });
            if ("src/locales/es.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/locales/es.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const lines = ["| Feature | Dictionary | Call | Result (`es`) |","| --- | --- | --- | --- |","| Interpolation | `\"greeting\": \"Hola, {name}\"` | `slice.t('orders.greeting', { name: 'Ana' })` | `Hola, Ana` |","| Plural | `\"count\": { \"one\": \"{count} pedido\", \"other\": \"{count} pedidos\" }` | `slice.t('orders.count', { count: 3 })` | `3 pedidos` |","| Exact zero | `\"zero\": \"Sin pedidos\"` | `slice.t('orders.count', { count: 0 })` | `Sin pedidos` |","| Numbers | `\"{count} pedidos\"` | `{ count: 1234 }` | `1.234 pedidos` |","| Literal brace | `\"{{\"` / `\"}}\"` | — | `{` / `}` |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"roles\": [\"Professor\", \"Engineer\"],\n  \"greetings\": [\"Hello, {name}\", \"Welcome, {name}\"]\n}",
               language: "json"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.t.list('roles');                       // ['Professor', 'Engineer']\nslice.t.list('greetings', { name: 'Ana' });  // ['Hello, Ana', 'Welcome, Ana']",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"records\": [\n    {\n      \"id\": 1,\n      \"logo\": \"/images/uru.png\",\n      \"startYear\": 2024,\n      \"technologies\": [\"JavaScript\"],\n      \"copy\": {\n        \"en\": { \"position\": \"Professor\", \"responsibilities\": [\"Teach\", \"Build\"] },\n        \"es\": { \"position\": \"Profesor\", \"responsibilities\": [\"Enseñar\", \"Construir\"] }\n      }\n    }\n  ]\n}",
               language: "json"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const document = await slice.t.content('experience');\ndocument.records[0].position;          // \"Profesor\"\ndocument.records[0].responsibilities;  // [\"Enseñar\", \"Construir\"]\ndocument.records[0].logo;              // structure, written once",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const lines = ["| API | Signature | Notes |","| --- | --- | --- |","| `slice.t` | `t(key, params?) → string` | Shortcut of `slice.translator.t`. |","| `slice.t.ref` | `t.ref(key, params?) → TranslationRef` | A prop reference. See [Props](#props-the-one-exception). |","| `slice.t.list` | `t.list(key, params?) → any[]` | A list from the dictionary, or `[]`. See [Lists](#lists). |","| `slice.t.ref.list` | `t.ref.list(key, params?) → TranslationListRef` | A list prop reference. |","| `slice.t.localized` | `t.localized(value) → any` | Resolve `{ en, es }` for the active locale. |","| `slice.t.content` | `t.content(name) → Promise<object\\|null>` | Load and resolve a content document. |","| `slice.locale` | `string` | Active locale shortcut. |","| `slice.translator.t` | `t(key, params?) → string` | Lookup + plural + interpolation. |","| `slice.translator.list` | `list(key, params?) → any[]` | A list of messages or records. |","| `slice.translator.localized` | `localized(value) → any` | Resolve a localized content value. |","| `slice.translator.content` | `content(name) → Promise<object\\|null>` | Load/resolve `<path>/content/<name>.json`. |","| `slice.translator.locale` | `string` | Active locale. |","| `slice.translator.locales` | `readonly string[]` | Configured locales. |","| `slice.translator.has` | `has(key, locale?) → boolean` | Is it a message? Does not consult the fallback. |","| `slice.translator.setLocale` | `setLocale(locale) → Promise<string>` | Loads first, then switches. See below. |","| `slice.translator.preload` | `preload(locale) → Promise<string>` | Load without switching. |","| `slice.translator.load` | `load(namespace) → Promise<void>` | Load a namespace for the active and fallback locale. |","| `slice.translator.add` | `add(locale, messages, { defaults }) → void` | Merge messages at runtime. |","| `slice.translator.ref` | `ref(key, params?) → TranslationRef` | A prop reference. See [Props](#props-the-one-exception). |","| `slice.translator.refList` | `refList(key, params?) → TranslationListRef` | A list prop reference. |","| `slice.translator.watch` | `watch(component, callback) → () => void` | `callback(locale, previous)` until the component is destroyed. |","| `slice.translator.apply` | `apply(root?) → number` | Translate `data-t` under `root` now (default: the document). |","| `slice.translator.setShowKeys` | `setShowKeys(enabled) → boolean` | Debugger switch: `t()` returns keys instead of texts and the document re-renders. |","| `slice.translator.format` | `number / currency / percent / date / time / relative / list` | `Intl` wrappers cached per locale and options. |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.t('orders.count', { count: itemCount });\nslice.t('prices.total', { amount: slice.translator.format.currency(1299, 'EUR') });\nslice.translator.format.date(new Date(), { dateStyle: 'long' });",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "<h1 data-t=\"home.title\"></h1>\n<input data-t=\"home.search\" placeholder aria-label />\n<p data-t=\"signup.terms\">\n  <a href=\"/terms\" data-t-slot=\"link\" data-t=\"signup.termsLink\"></a>\n</p>",
               language: "html"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "this.$count.dataset.tCount = items.length;         // re-translates \"cart.items\" with { count }\nthis.$status.dataset.t = `orders.status.${state}`; // a different key: re-translated too\nel.innerHTML = '<p data-t=\"about.description\"></p>'; // HTML built from JavaScript works the same",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.t('orders.save')        // \"Guardar\" — text, right now\nslice.t.ref('orders.save')    // a reference for a prop",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-17"]');
         if (container) {
            const lines = ["| Text | Mechanism |","| --- | --- |","| In a template (`.html`) | `data-t` — nothing else |","| Created from JS (`textContent`, `innerHTML`) | `data-t` / `dataset.t` (+ `data-t-*` params) |","| Passed as a component prop, must follow the locale | `slice.t.ref()` |","| Passed as a list prop, must follow the locale | `slice.t.ref.list()` |","| A dictionary list (`[\"a\", \"b\"]`) | `slice.t.list()` |","| A content record (`copy: { en, es }`) | `slice.t.content()` |","| Computed by your component from data | `slice.t()` + `update()`/`watch()` |","| Outside the DOM (canvas, third-party widget) | `watch()` + `slice.t()` when drawing |","| Read at the moment of use (toast, confirm) | `slice.t()` |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-18"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "await slice.build('Button', { value: slice.t.ref('orders.save') });\nthis.$count.label = slice.t.ref('cart.items', { count });\nawait slice.build('DropDown', {\n  items: [{ label: slice.t.ref('menu.home'), path: '/' }]\n});",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-19"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.translator.watch(this, () => this._drawCanvasLabel());",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-20"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.router.path             // the app path: '/pricing' (no locale, no query)\nslice.router.href('/pricing') // the href to render: '/pricing' or '/en/pricing'",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    // Cleanup timers, listeners, or pending work here
  }

  async setupCopyButton() {
    const container = this.querySelector('[data-copy-md]');
    if (!container) return;

    const copyMenu = await slice.build('CopyMarkdownMenu', {
      markdownPath: this.markdownPath,
      markdownContent: this.markdownContent,
      label: '❐'
    });

    container.appendChild(copyMenu);
  }

  async copyMarkdown() {}
}

customElements.define('slice-translatordocumentation', TranslatorDocumentation);
