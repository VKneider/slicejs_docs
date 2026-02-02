---
title: init()
route: /Documentation/LifeCycle-Methods/init
navLabel: init()
section: Getting Started
group: Components
order: 41
description: One-time setup for Slice.js components.
component: InitMethodDocumentation
tags: [lifecycle, init]
---

# init()

## Overview
`init()` runs once, right after the component instance is created and its template is attached.
Use it for one-time setup that should not repeat during updates.

`slice.build()` awaits `init()` before returning the component instance.

## API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `init` | `async init()` | `Promise<void>` | Called once per instance. |

## Ideal Use Cases
- Cache DOM references
- Attach event listeners for the component lifetime
- Fetch initial data
- Build static child components

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
      onClickCallback: () => this.editProfile()
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

## Patterns
```javascript title="Bind events with auto-cleanup"
export default class Notifications extends HTMLElement {
  async init() {
    this.events = slice.events.bind(this);
    this.events.subscribe('notify', (payload) => this.show(payload));
  }
}
```

## Best Practices
:::tip
Query DOM elements in `init()` (not in the constructor).
:::

:::tip
Build static child components here. Dynamic lists belong in `update()`.
:::

## Gotchas
:::warning
Avoid building dynamic lists in `init()` if the list needs to refresh.
:::
