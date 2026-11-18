---
title: init()
route: /Documentation/LifeCycle-Methods/init
navLabel: init()
section: Components
group: Lifecycle
order: 20
description: One-time async setup for Slice.js components.
component: InitMethodDocumentation
tags: [lifecycle, init]
---

# init()

## Overview
`init()` runs once, right after the component is constructed. By this point the constructor has
already attached the template with `slice.attachTemplate(this)` and applied props, so the DOM is
ready. Use `init()` for one-time setup that should not repeat during updates.

`slice.build()` awaits `init()` before returning the component instance, so `init()` is the place
for **async** work the constructor cannot do — fetching data and building children with
`await slice.build(...)`. See [Component Anatomy](/Documentation/Component-Anatomy) for the
constructor and the two ways to cache DOM references.

## API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `init` | `async init()` | `Promise<void>` | Called once per instance. |

## Ideal use cases
- Cache DOM references.
- Attach event listeners for the component lifetime.
- Fetch initial data.
- Build static child components.

## Example

```javascript title="One-time setup in init()"
export default class UserProfile extends HTMLElement {
  async init() {
    this.$userInfo = this.querySelector('.user-info');
    this.$avatar = this.querySelector('.avatar');

    this.userData = await this.fetchUserData(this.userId);

    this.editButton = await slice.build('Button', {
      sliceId: 'edit-profile-btn',
      value: 'Edit Profile',
      onClick: () => this.editProfile()
    });

    this.addEventListener('click', this.handleClick.bind(this));

    this.updateUserUI();
    this.appendChild(this.editButton);
  }

  updateUserUI() {
    this.$userInfo.textContent = this.userData.name;
    this.$avatar.src = this.userData.avatar;
  }
}
```

## Constructor vs init()

:::compare left="Constructor — synchronous" right="init() — async"
Attach the template, cache DOM refs, bind local listeners, then apply props with `setComponentProps` last. No `await` here.
---
Fetch data, `await slice.build(...)` children, subscribe to events/context, and finish the first paint. The framework awaits it before `build()` resolves.
:::

The constructor and `init()` are not interchangeable: the constructor cannot await, and `init()` is
the only place where `slice.build()` is already safe for async children.

## Patterns

```javascript title="Bind events with auto-cleanup"
export default class Notifications extends HTMLElement {
  async init() {
    this.events = slice.events.bind(this);
    this.events.subscribe('notify', (payload) => this.show(payload));
  }
}
```

:::details title="Static children vs dynamic lists"
Build **static** children in `init()` — a toolbar, a header, a fixed card. A list whose data can
change belongs in `update()` (or in [DomService.reconcile](https://components.slicejs.com/docs/services/dom-service)),
so it can refresh without rebuilding the whole component.
:::

:::related
- [Component Anatomy](/Documentation/Component-Anatomy) - Constructor, template and refs.
- [update()](/Documentation/LifeCycle-Methods/update) - Refreshing after `init()`.
- [beforeDestroy()](/Documentation/LifeCycle-Methods/beforeDestroy) - What cleanup runs later.
- [Service Patterns](/Documentation/Architecture/Service-Patterns) - Building Services from `init()`.
:::
