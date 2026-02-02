---
title: Services
route: /Documentation/Service
navLabel: Services
section: Getting Started
group: Components
order: 34
description: Service components for shared logic and data.
component: ServiceDocumentation
tags: [services, fetch, state]
---

# Services

## Overview
Services centralize logic and data access. They can cache results, encapsulate API calls,
and integrate with EventManager or ContextManager.

Services are created with `slice.build()` like other components, but they do not render UI.

## Built-in Services
| Service | Purpose | Notes |
| --- | --- | --- |
| `FetchManager` | HTTP requests with loading, timeout, and optional caching | Uses `Loading` component automatically. |
| `IndexedDbManager` | IndexedDB CRUD helpers | Creates store with `keyPath: 'id'`. |
| `LocalStorageManager` | LocalStorage JSON wrapper | Returns parsed JSON or null. |
| `Translator` | Apply translations to active components | Uses `messages.json` and `slice.translator`. |
| `Link` | SPA navigation anchor | Calls `slice.router.navigate`. |

## Using a Service
```javascript title="Access via controller"
const dataService = await slice.build('FetchManager', {
  baseUrl: 'https://api.myapp.com/v1',
  sliceId: 'data-service'
});

export default class ProductList extends HTMLElement {
  async init() {
    this.dataService = slice.controller.getComponent('data-service');
    await this.loadProducts();
  }
}
```

## FetchManager API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `request` | `(method, data, endpoint, onSuccess, onError, refetchOnError=false, requestOptions={})` | `Promise<any>` | Returns JSON response. Caches last response if enabled. |
| `enableCache` | `()` | `void` | Enables in-memory cache. |
| `disableCache` | `()` | `void` | Disables cache. |
| `setDefaultHeaders` | `(headers)` | `void` | Merges default headers into requests. |

## IndexedDbManager API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `openDatabase` | `()` | `Promise<IDBDatabase>` | Opens or creates database. |
| `closeDatabase` | `()` | `void` | Closes the connection. |
| `addItem` | `(item)` | `Promise<number>` | Returns new key. |
| `updateItem` | `(item)` | `Promise<number>` | Returns key. |
| `getItem` | `(id)` | `Promise<any>` | Gets item by id. |
| `deleteItem` | `(id)` | `Promise<void>` | Deletes item by id. |
| `getAllItems` | `()` | `Promise<any[]>` | Returns all items. |
| `clearItems` | `()` | `Promise<void>` | Clears store. |

## LocalStorageManager API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `getItem` | `(key)` | `any | null` | Returns parsed JSON or null. |
| `setItem` | `(key, value)` | `boolean` | Returns success boolean. |
| `removeItem` | `(key)` | `boolean` | Returns success boolean. |
| `clear` | `()` | `boolean` | Clears localStorage. |

## Translator API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `changeLanguage` | `(newLanguage)` | `boolean | void` | Applies translations for active components. |
| `setPropertiesForComponents` | `()` | `boolean | void` | Updates component props from messages. |
| `setMessages` | `(messages)` | `void` | Replaces the messages object. |

## Link API
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `path` | `string` | `'#'` | Route path to navigate. |
| `classes` | `string` | `''` | CSS classes for the anchor. |
| `text` | `string` | `''` | Anchor text. |

```javascript title="Link usage"
const link = await slice.build('Link', {
  path: '/account',
  classes: 'nav-link',
  text: 'Account'
});

nav.appendChild(link);
```

## Best Practices
:::tip
Use `sliceId` when you need global access to a service instance.
:::

:::tip
Pair services with EventManager for notifications or ContextManager for shared state.
:::

## Gotchas
:::warning
`Translator` expects message keys to match active component sliceIds.
:::
