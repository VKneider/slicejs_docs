export default class UpdateMethodDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      const updateExample = await slice.build('CodeVisualizer', {
         value: `export default class ProductList extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
   }

   async init() {
      this.$productContainer = this.querySelector(".products-container");
      await this.loadAndRenderProducts();
   }

   async update() {
      // Destroy old dynamic child components
      slice.controller.destroyByContainer(this.$productContainer);
      this.$productContainer.innerHTML = '';

      // Re-fetch and re-render
      await this.loadAndRenderProducts();
   }

   async loadAndRenderProducts() {
      this.products = await this.fetchProducts();

      for (const product of this.products) {
         const productCard = await slice.build('ProductCard', {
            sliceId: \`product-\${product.id}\`,
            title: product.title,
            price: product.price,
            image: product.image
         });

         this.$productContainer.appendChild(productCard);
      }
   }
}

 customElements.define('slice-product-list', ProductList);`,
         language: 'javascript'
      });

      const bestPractices = await slice.build('CodeVisualizer', {
         value: `// ✅ update() Best Practices

// 1) Destroy old dynamic components first
slice.controller.destroyByContainer(this.$container);
this.$container.innerHTML = '';

// 2) Re-fetch data that might have changed
const latest = await this.fetchLatestData();

// 3) Recreate child components with stable sliceIds
for (const item of latest) {
    const row = await slice.build('Row', {
       sliceId: \`row-\${item.id}\`,
      ...item
   });
   this.$container.appendChild(row);
}`,
         language: 'javascript'
      });

      const pitfalls = await slice.build('CodeVisualizer', {
         value: `// ❌ update() Pitfalls

// 1) Only clearing DOM without destroying
this.$container.innerHTML = '';
// Components remain in activeComponents and leak memory

// 2) Recreating listeners on every update
this.$button.addEventListener('click', this.onClick);
// Listeners accumulate and leak

// 3) Recreating static components repeatedly
this.header = await slice.build('Header', {});
// Build static elements in init() instead
`,
         language: 'javascript'
      });

      this.querySelector('.update-example').appendChild(updateExample);
      this.querySelector('.best-practices').appendChild(bestPractices);
      this.querySelector('.pitfalls').appendChild(pitfalls);
   }
}

customElements.define('slice-updatemethoddocumentation', UpdateMethodDocumentation);
