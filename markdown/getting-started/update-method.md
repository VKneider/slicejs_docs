---
title: update()
route: /Documentation/LifeCycle-Methods/update
navLabel: update()
section: Getting Started
group: Components
order: 42
description: Refresh dynamic UI in Slice.js components.
component: UpdateMethodDocumentation
tags: [lifecycle, update]
---

# update()

## Overview
`update()` runs whenever a component needs to refresh. The router calls it when a cached
component is reused by `Route` or `MultiRoute`. You can also call it manually after changing
props or state.

## API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `update` | `async update()` | `Promise<void>` | Called on cached components when revisited. |

## Ideal Use Cases
- Re-fetch data that can change
- Rebuild dynamic child components
- Re-apply dynamic state to the DOM

## Example
```javascript title="Rebuild dynamic UI in update()"
export default class ProductList extends HTMLElement {
  async init() {
    this.$productContainer = this.querySelector('.products-container');
    await this.loadAndRenderProducts();
  }

  async update() {
    slice.controller.destroyByContainer(this.$productContainer);
    this.$productContainer.innerHTML = '';
    await this.loadAndRenderProducts();
  }

  async loadAndRenderProducts() {
    this.products = await this.fetchProducts();

    for (const product of this.products) {
      const productCard = await slice.build('ProductCard', {
        sliceId: `product-${product.id}`,
        title: product.title,
        price: product.price,
        image: product.image
      });

      this.$productContainer.appendChild(productCard);
    }
  }
}
```

## Best Practices
:::steps
1. Destroy old components with `destroyByContainer`.
2. Clear the container.
3. Fetch fresh data.
4. Rebuild components with stable `sliceId`s.
:::

:::tip
Keep `update()` idempotent and safe to call multiple times.
:::

## Gotchas
:::warning
Clearing `innerHTML` alone does not destroy Slice components.
:::

:::warning
Do not rebuild static UI in `update()` unless it depends on changing data.
:::
