# Component Selection Guide

Use this before building any surface. It answers three questions the prop tables cannot:

1. **Which component does this job?**
2. **When is one component the wrong choice, and what is the next one?**
3. **When is there no component yet, and what do I compose instead?**

The full coverage study (mainstream libraries vs Slice) lives in
`slicejs-components/docs/COMPONENT_COVERAGE.md`. This page is the decision layer; prop lists and
examples stay in the component docs, `slice browse`, or the MCP.

## Rule 0 — start from the job, not the component

Name the job in one sentence:

> *When ___ , I want to ___ , so I can ___ .*

Then classify it:

| The user is… | Group |
| --- | --- |
| orienting on a page or moving between places | **navigation** |
| entering or choosing a value | **inputs / forms** |
| scanning, comparing or acting on records | **data display** |
| reacting to something that happened | **feedback** |
| reading content someone wrote | **content / display** |
| opening something over the page | **overlays** |
| doing something in the background (fetch, storage, shortcuts) | **services** |

Do not start from "I need a Carousel". Start from "I need to show six images and let people open one
full size". The answer may be `ElementCarrousel` + `Lightbox`, not a new component.

## UX rules that outrank component choice

These come before "which component": a polished wrong component is still the wrong component.

- **One primary action per view.** Name it with the outcome ("Publish changes"), not "Submit".
- **Prefer undo to a confirmation** for reversible actions. Confirm only what cannot be undone.
- **Show the consequence before a commit**: amount, recipients, scope, what will be deleted.
- **Design every state**: empty, loading, partial, error, no results, disabled with a reason,
  success with a next step. A component that cannot show its empty/error state is not finished.
- **Labels above fields**; placeholders are examples or syntax, never the only label.
- **Progressive disclosure**: show the common path, put advanced options one level deeper.
- **Never rely on colour alone**; pair status colour with text or an icon.
- **Use the lightest loading indicator that fits**: `SkeletonService` when the layout is known,
  `Loading` for a short wait, a busy `Button` for an action the user started.
- **Keyboard and screen reader are part of the choice**, not a later fix. If the component cannot be
  operated without a mouse, it is the wrong component for that job.

## Selection flow

1. **Is the job about state or about layout?** State → likely a form control or a data component.
   Layout → `Layout`, `Grid`, or plain CSS.
2. **Is the thing an object with actions, or a row in a comparison?** Object → `DataList`/`Card`.
   Comparison across columns → `Table`.
3. **Is the feedback part of the page's text, or the result of an action?** Text → `Callout`.
   Result → `Alert`/`Toast`.
4. **Does it open over the page?** A decision → `Modal`/`ConfirmActionModal`. An image → `Lightbox`.
   A menu → `DropDown`. A temporary message → `Toast`.
5. **Does an existing component only need a variant, or does it need a different interaction model?**
   Variant → use the component. Different model → compose or build.
6. **Will this exact composition appear in another product?** If yes and it is non-trivial, capture a
   feature. If no, keep it local.

## Foundations and layout

| Component | Use when | Avoid when | Pairs with |
| --- | --- | --- | --- |
| `Layout` | The page needs a header, sidebar, main, aside or footer; a docs frame; a dashboard shell. | A single centred form or a landing section. | `Navbar`, `SideMenu`, `Grid`, `Tabs` |
| `Grid` | Sets of similar things, dashboards, galleries, bento sections, page regions. | Long text, a list to read top to bottom, or rows to compare column by column. | `Card`, `FeatureList`, `SectionHeader` |
| `SectionHeader` | A section needs an eyebrow, a real heading, a sentence and actions; a portfolio section with a title line. | Inside a card or a form; every heading of an article. | `Grid`, `FeatureList`, `Steps`, `Quote` |
| `Card` | One object with a title, body, actions and an optional icon; a KPI; a preview. | A set of benefits with no surface, or records with search/sort/actions. | `Grid`, `Button`, `Badge` |
| `Details` | A disclosure: FAQ, advanced options, a long note. | A task the user must complete in order (that is `Steps`/`Form`). | `Card`, `Form` |
| `FeatureList` | Services, benefits, plan contents, a checklist in columns. | Objects that need actions or images per item (`Card`/`DataList`). | `SectionHeader`, `Grid` |

**Layout vs Grid vs Card.** `Layout` is the frame of the whole page. `Grid` arranges any set of
children. `Card` is one object. If the children have their own title/actions, they are Cards inside a
Grid; if they are just icon + title + sentence, use `FeatureList`.

**SectionHeader vs a plain heading.** Use `SectionHeader` when the section needs an eyebrow, a
description or actions. Use an `h2` for article sections and ordinary prose.

## Actions and navigation

| Component | Use when | Avoid when | Pairs with |
| --- | --- | --- | --- |
| `Button` | An action in place: save, submit, open, delete. | Navigation to another page; use `Link`. | `Form`, `Modal`, `DropDown` |
| `Link` | Navigation, including in-app routes and external URLs. | An action that changes the current screen without navigating. | `Navbar`, `Breadcrumbs`, `Card` |
| `Navbar` | A persistent top bar with brand, links and actions; mobile panel. | A document with no global navigation. | `Layout`, `SideMenu`, `ThemeSelector` |
| `SideMenu` | Persistent side navigation for an app or docs; sections and links. | A one-level filter or a short list of options. | `Layout`, `TreeView` |
| `BottomNav` | Mobile primary navigation (≤5 destinations). | Desktop or a secondary menu. | `Navbar` (hidden on mobile), `Layout` |
| `Tabs` | Switching between panels of the same object or page; settings sections. | A sequence the user must complete (`Steps`), or global navigation (`Navbar`/`SideMenu`). | `Card`, `Form`, `Table` |
| `Breadcrumbs` | Depth ≥2 in a hierarchy; back to a parent. | A flat app or a single-level page. | `Navbar`, `SideMenu` |
| `Pagination` | Known pages of records; tables and lists. | A feed where "load more" or infinite scroll fits better. | `Table`, `DataList` |
| `DropDown` | A menu of actions or links, a filter menu, an overflow menu. | Arbitrary rich content that needs a popover; or a single choice in a form (`Select`). | `Button`, `Table`, `DataList` |
| `ToolTip` | A short explanation of an icon, a truncated label or a shortcut. | Essential instructions, long text, or content that must be interactive. | `Button`, `Icon`, any control |
| `Steps` | A process to read in order: how it works, install, apply. | A task with a current step and navigation; that is a Stepper (not shipped yet) or a `Form` with steps. | `SectionHeader`, `Callout` |
| `ElementCarrousel` | A small set of panels, quotes, cards or images to move through. | A single hero or a grid that should be visible at once. | `Quote`, `Card`, `Lightbox` |

**Navbar vs SideMenu vs BottomNav.** `Navbar` is global top navigation; `SideMenu` is a persistent
side tree or list; `BottomNav` is the mobile primary tab bar. Do not put the same five links in all
three; choose by viewport and hierarchy.

**Tabs vs SideMenu.** `Tabs` changes the panel of one object and keeps the page. `SideMenu` changes
the page or section. If the URL should change, it is navigation, not tabs.

**DropDown vs Select.** `DropDown` is a menu of commands/links; `Select` is a form value with a
selected state, validation and keyboard typeahead.

**Steps vs Timeline vs Stepper.**

- `Steps`: a static process, no current step, no gating.
- `Timeline`: things that happened (or will) in time.
- **Stepper**: a stateful wizard with done/current/blocked and navigation. Not shipped yet; use
  `Form` steps or a small state machine + `Steps` until it is.

## Inputs and forms

| Component | Use when | Avoid when | Pairs with |
| --- | --- | --- | --- |
| `Form` | More than one field, validation, groups, steps, submit values. | One search box or one isolated control. | `Input`, `Select`, `Checkbox`, `Button` |
| `Input` | A single line of text, email, password, number, search. | A long answer (`Textarea`) or a choice from options (`Select`/`RadioGroup`). | `Form`, `Button` |
| `Textarea` | Multi-line text, comments, descriptions. | A single short value. | `Form` |
| `Select` | Choose one or many from a list; searchable, grouped, creatable, server-loaded, virtual. | ≤5 static options where all choices should be visible (`RadioGroup` or checkboxes). | `Form`, `Table`, `DataList` |
| `Checkbox` | Multiple independent choices; a single boolean in a form. | A binary setting that applies immediately (`Switch`). | `Form`, `DataList`, `Table` |
| `RadioGroup` | One choice from a small set; card or segmented/buttons variants. | Many options (use `Select`) or multiple choices (`Checkbox`). | `Form` |
| `Switch` | A binary setting that applies immediately. | A form value that waits for Submit (`Checkbox`). | Settings, `Navbar` |
| `Slider` | A value on a continuous range (volume, price, opacity). | A precise number (`Input type="number"`) or a few named options. | `Form` |
| `DatePicker` | A date or a date range; typed or calendar; min/max, disabled days, presets. | A free-form timestamp with time zone semantics; store ISO and convert in the app. | `Form`, `Table` |
| `ColorPicker` | A color token, a brand color, a palette. | A fixed set of theme choices (`ThemeSelector`). | `Form`, `ThemeCreator` |
| `FileUpload` | One or many files, drag/drop, progress, validation. | A link to an external file (`Link`). | `Form`, `ToastProvider` |
| `Rating` | A score 1–5/10; review or feedback; read-only average. | Choosing among named options or agree/disagree (use `RadioGroup`). | `Form`, `Quote` |

**Checkbox vs Switch.** `Checkbox` is a value submitted with a form. `Switch` is an immediate
setting. If the user expects the change to apply as soon as they toggle, use `Switch`.

**RadioGroup vs Select.** If the options fit on screen and the labels matter, show them all
(`RadioGroup`, especially `variant: 'buttons'` for segmented controls). If the list is long,
searchable or loaded from a server, `Select`.

**Select multiple vs tags input.** `Select` with `multiple` and `creatable` already covers tags,
chips, max and select-all. Do not build a separate TagsInput.

## Data display

| Component | Use when | Avoid when | Pairs with |
| --- | --- | --- | --- |
| `Table` | Compare records across columns; sort/filter/search; selection, totals, virtual rows, inline editing, server data. | A phone-first record list, or records with a picture + status + actions read one by one. | `Pagination`, `Modal`, `ToastProvider` |
| `DataList` | The app's working list: people, orders, tasks, files; search, views, filters, groups, bulk, CRUD, undo, server data. | Dense numeric comparison across columns (`Table`). | `Modal`, `DropDown`, `Avatar`, `Pagination` |
| `DescriptionList` | One record's properties: plan, owner, dates, IDs. | Many records (use `DataList`/`Table`). | `Card`, `Modal` |
| `Avatar` / `AvatarGroup` | A person or a small group: initials, image, presence. | A generic icon or a decorative shape. | `DataList`, `Quote`, `Card` |
| `Quote` | What someone said: testimonial, review, a line in an article. | Fake or anonymous praise; a note nobody said (`Callout`). | `ElementCarrousel`, `Grid`, `SectionHeader` |
| `Timeline` | Things that happened (or will) in time: history, tracking, changelog, activity. | A process without dates (`Steps`) or records to search (`DataList`/`Table`). | `SectionHeader`, `Card` |
| `TreeView` | Folders, categories, nested navigation, a hierarchy to select from. | A flat list or a table of records. | `SideMenu`, `Layout` |
| `JsonViewer` | API payloads, raw records, webhook logs, configs. | Data people edit or compare in columns (`Table`). | `Modal`, `Card` |
| `CodeVisualizer` | Code samples, JSON snippets, commands. | Long editable code (use a code editor). | Docs, `Callout` |
| `Heatmap` | Activity over time or a value in two dimensions. | Exact comparison of a few numbers (`Table`). | `SectionHeader`, `Card` |
| `ElementCarrousel` | A few cards, quotes or images to move through. | A gallery that should be visible at once (`Grid`). | `Lightbox`, `Quote` |
| `Lightbox` | Full-size images, zoom/pan, captions, thumbnails, swipe. | A small inline image or a hero. | `ElementCarrousel`, `Grid` |
| `EmptyState` | No data yet, no results, a cleared list, a first-use state. | A transient loading state (`SkeletonService`/`Loading`). | `DataList`, `Table`, `Card` |
| `Loading` | A short, indeterminate wait; a busy button or panel. | A structural first load where the layout is known (`SkeletonService`). | `Button`, `Table`, `Modal` |
| `SkeletonService` | A known layout is loading and should not jump; refreshing data already on screen. | A wait under ~300ms, or an action the user started (use a busy button). | `Table`, `Card`, `DataList` |

**Table vs DataList.** `Table` is for comparing values down columns and for dense keyboard work.
`DataList` is for records with a title, two lines of detail, a status and actions; it is the better
phone experience and the better CRUD surface. If the same data appears in both, `Table` is the
desktop analytical view, `DataList` the record view.

**DataList vs DescriptionList.** `DataList` is many records; `DescriptionList` is one record's
properties.

**Card vs DataList.** `Card` is one object in a layout (a KPI, a project preview, a plan). `DataList`
is a collection the user searches, filters and acts on. Ten Cards in a Grid are not a DataList; they
are a dashboard.

## Feedback and status

| Component | Use when | Avoid when | Pairs with |
| --- | --- | --- | --- |
| `Alert` | The result of something the user did or the system just did; a live region. | Static content that belongs to the page (`Callout`). | `Form`, `ToastProvider`, `Modal` |
| `Callout` | A note, tip, warning, definition or aside inside content. | Feedback about an action that just happened (`Alert`). | Docs, `Form`, `Card` |
| `Toast` / `ToastProvider` | A temporary confirmation or error that does not block; undo. | A decision the user must make (`ConfirmActionModal`). | `DataList`, `Table`, forms |
| `ConfirmActionModal` | A destructive or irreversible action; a promise for the answer. | A reversible action; use an undo Toast. | `Button`, `DataList`, `Table` |
| `Badge` | A short status or count on an object. | A long label or an action. | `Card`, `DataList`, `Tabs` |
| `Chip` | A removable filter, a tag, a selected value. | A status badge that never changes. | `DataList`, `Table`, `Select` |
| `Loading` | A busy state. | A structural skeleton. | `Button`, `Table` |
| `EmptyState` | Nothing to show, with a next action. | A 404 route (`NotFound`). | `DataList`, `Table` |
| `NotFound` | A route that does not exist. | An empty list inside a valid page. | Router `/404` |

**Alert vs Callout vs Toast.** `Alert` is feedback (often a live region) about something that
happened. `Callout` is part of the page's text (never a live region). `Toast` is transient and
floating. If the text should still be there after a reload, it is not a Toast.

**Toast vs ConfirmActionModal.** A Toast confirms or offers undo after the fact. A confirm dialog
asks before an irreversible action. Do not use a confirm dialog for something you could undo.

## Overlays and media

| Component | Use when | Avoid when | Pairs with |
| --- | --- | --- | --- |
| `Modal` | A focused task, a form, a detail, a drawer, a bottom sheet, a command palette surface. | A quick confirmation (`ConfirmActionModal`) or an image (`Lightbox`). | `Form`, `Card`, `Table` |
| `ConfirmActionModal` | A yes/no decision with a consequence. | A long form or a multi-step task (`Modal`). | `Button`, `ToastProvider` |
| `Lightbox` | Images at full size; zoom, pan, captions, thumbnails, swipe. | A hero image or a card preview. | `ElementCarrousel`, `Grid` |
| `DropDown` | A menu of actions/links. | A form value (`Select`) or rich interactive content (compose a popover). | `Button`, `Table` |
| `ToolTip` | A short hint/label for an icon or truncated text. | Long content, links, or anything the user must interact with. | `Button`, `Icon` |
| `ElementCarrousel` | A small set of panels/images to cycle. | A gallery of many images that should be browsed in a grid. | `Lightbox`, `Quote` |

**Modal vs ConfirmActionModal vs Lightbox vs Drawer.** All are overlays. `Modal` is the general
surface; `ConfirmActionModal` is a constrained decision; `Lightbox` is media; `Modal layout:
'drawer'` is a side panel, not a navigation menu (that is `SideMenu`).

## Services

| Service | Use when | Avoid when |
| --- | --- | --- |
| `FetchManager` | HTTP with retries, auth, timeouts, JSON/Blob/FormData. | A one-off `fetch` in a tiny demo. |
| `HtmlService` | Rich text from a CMS/editor must be sanitized. | Plain text; never parse user strings as HTML. |
| `StorageService` / `LocalStorageManager` | Persisted app state/preferences. | Large structured data (`IndexedDbManager`). |
| `IndexedDbManager` | Large local datasets, offline queues. | A few preferences (`LocalStorageManager`). |
| `FileDownloadService` | Export JSON/CSV, download a Blob. | A link to a static file (`Link`). |
| `DomService` | DOM helpers that must be consistent across components. | Anything CSS can do. |
| `DragDropService` | Reordering, sortable lists, drop zones. | A simple click-to-move UI. |
| `QueryService` | Read/write query strings safely. | Router params already handled by `slice.path`. |
| `ShortcutService` | Keyboard shortcuts with scope and conflicts. | A single local key listener inside a component. |
| `RealtimeService` | WebSocket/SSE channels with reconnect. | Polling with `FetchManager` if that is enough. |
| `InfiniteScrollService` | Sentinels, next page, retry, prefill. | Pagination where the user wants page numbers (`Pagination`). |
| `DataGridEngine` | Headless sorting/filtering/paging for a custom grid. | `Table`/`DataList` already do it. |
| `UnsavedChangesGuard` | Leaving a dirty form/route. | A form that autosaves. |
| `ToastProvider` | One app-wide toast stack. | A local inline message (`Alert`). |
| `ToolTipProvider` | One app-wide tooltip layer and delegated triggers. | One static tooltip on one element; build `ToolTip` directly. |
| `SkeletonService` | Shape-preserving loading. | A quick spinner (`Loading`). |

## One-vs-another quick table

| Question | Answer |
| --- | --- |
| Alert or Callout? | Did something just happen? Alert. Is it part of the text? Callout. |
| Quote or Callout? | Someone said it? Quote. A note/tip nobody said? Callout. |
| Timeline or DataList? | Events in time? Timeline. Records to search, filter or act on? DataList. |
| Avatar or Icon? | A person/group? Avatar. An action or a meaning? Icon. |
| Toast or Alert? | Floating and temporary? Toast. In place and persistent? Alert. |
| Card or FeatureList? | One object with actions? Card. A list of benefits/items? FeatureList. |
| Card or DataList? | One object in a layout? Card. Many records with search/actions? DataList. |
| Table or DataList? | Compare columns? Table. Act on records one by one / phone? DataList. |
| Table or Grid? | Data with columns? Table. Layout of arbitrary cells? Grid. |
| DataList or DescriptionList? | Many records? DataList. One record's properties? DescriptionList. |
| Tabs or SideMenu? | Same page, switch panels? Tabs. Change page/section? SideMenu. |
| Tabs or Steps? | Parallel views? Tabs. Ordered process? Steps. |
| Steps or Timeline? | A process to follow? Steps. Events in time? Timeline. |
| Steps or Stepper? | Static explanation? Steps. Current/blocked/gated task? Stepper (not shipped yet). |
| Modal or ConfirmActionModal? | General task? Modal. Irreversible yes/no? ConfirmActionModal. |
| Modal or Lightbox? | Content/form? Modal. Images with zoom/swipe? Lightbox. |
| Select or RadioGroup? | Long/searchable list? Select. Few visible options? RadioGroup. |
| Checkbox or Switch? | Form value? Checkbox. Immediate setting? Switch. |
| DatePicker or two Inputs? | A date/range with validation and a calendar? DatePicker. |
| Pagination or InfiniteScrollService? | Known pages/URLs? Pagination. Continuous feed? Infinite scroll. |
| EmptyState or Loading? | No data? EmptyState. Waiting? Loading. |
| Loading or SkeletonService? | Unknown/short wait? Loading. Known layout / refresh? SkeletonService. |
| Card or Stat? | A card with title, body and actions? Card. A KPI is a Card with app markup until `Stat` exists. |
| Carousel or Grid? | A few panels to cycle? Carousel. All items visible at once? Grid. |
| Carousel or Lightbox? | Inline cycling? Carousel. Full-screen image viewing? Lightbox. |
| DropDown or Select? | Menu of actions? DropDown. Form value? Select. |
| ToolTip or Popover? | Short read-only hint? ToolTip. Interactive content? No Popover yet; compose with DropDown/Modal. |

## Composition recipes for gaps

These are the jobs with no first-class component yet. Start with the recipe; capture a feature only
if it repeats.

| Job | Today | If it repeats |
| --- | --- | --- |
| Image gallery | `ElementCarrousel` or `Grid` of `<figure>` + `Lightbox.attach()` | A thin `Gallery` facade over both, with `srcset`, `alt`, `caption`, `thumb`. |
| Command palette | `Modal layout: 'top'` + `Input` + `DataList`/`TreeView` + `ShortcutService` | `CommandPalette` with async commands, keyboard model and empty states. |
| Tour / onboarding spotlight | driver.js / Shepherd, or a custom overlay | `TourService` (see the coverage study and feature 0019). |
| Resizable split pane | CSS grid + pointer events on a handle | `SplitPane` with keyboard resize and min/max. |
| Progress | native `<progress>` styled with tokens, or `Loading` | `ProgressBar` (already wanted). |
| Wizard | `Form` with steps, or a state machine + `Steps` | `Stepper` (already wanted). |
| Persistent notifications | `ToastProvider` for transient + `DataList`/`Modal` for the inbox | Product-specific; do not add a generic inbox. |
| Charts | external chart library inside a `Card` | Do not build a chart engine. |
| Video/audio | native `<video>`/`<audio>` or an external player | Do not build a player. |
| Rich text | external editor + `HtmlService` | Do not build an editor. |
| AI chat | `Textarea` + `Button` + `DataList` + `ToastProvider` | Only if a product ships an assistant; start with message list + prompt input. |

## When to build your own

Build a new component when **all** of these are true:

- the job repeats across at least two products or several screens;
- the interaction has non-trivial accessibility, keyboard, focus or positioning behavior;
- the component can be expressed with the existing tokens and composition rules;
- it has a clear API, a spec, and a docs page with live scenarios.

Do **not** build when:

- the only difference is visual (use CSS variables, variants, `customColor`);
- it is a single flexbox, divider, aspect ratio or stack (CSS);
- it is a chart, map, video player, rich-text editor or scheduler (use an external library);
- it is a product-specific composition that only one app needs.

## Maintenance

- When a component ships, add it to the right group and to the one-vs-another table.
- When a gap becomes a component, remove its composition recipe and link the docs.
- When a mainstream library adds a component, ask which job it serves before adding a row. The
  coverage study is the place for that discussion, not this guide.
