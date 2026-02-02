export default class ContextManagerDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      const contextConfigExample = await slice.build('CodeVisualizer', {
         value: `// sliceConfig.json
{
  "context": { "enabled": true }
}`,
         language: 'json'
      });
      this.querySelector('.context-config-example').appendChild(contextConfigExample);

      const createContextExample = await slice.build('CodeVisualizer', {
         value: `// Create a shared context
slice.context.create("auth", {
   isLoggedIn: false,
   user: null
});

// Read state
const authState = slice.context.getState("auth");
console.log(authState.isLoggedIn);`,
         language: 'javascript'
      });
      this.querySelector('.create-context-example').appendChild(createContextExample);

      const watcherExample = await slice.build('CodeVisualizer', {
         value: `export default class AccountMenu extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
   }

   async init() {
      slice.context.watch(
         "auth",
         this,
         (isLoggedIn) => {
            this.classList.toggle("signed-in", isLoggedIn);
         },
         (state) => state.isLoggedIn
      );
   }
}`,
         language: 'javascript'
      });
      this.querySelector('.watcher-example').appendChild(watcherExample);

      const selectorExample = await slice.build('CodeVisualizer', {
         value: `// Selector for derived values
slice.context.watch(
   "cart",
   this,
   (count) => {
      this.$badge.textContent = count;
   },
   (state) => state.items.length
);`,
         language: 'javascript'
      });
      this.querySelector('.selector-example').appendChild(selectorExample);

      const persistenceExample = await slice.build('CodeVisualizer', {
         value: `// Persist a context in localStorage
slice.context.create(
   "preferences",
   { theme: "light", locale: "en" },
   { persist: true, storageKey: "app:preferences" }
);`,
         language: 'javascript'
      });
      this.querySelector('.persistence-example').appendChild(persistenceExample);

      const functionalUpdateExample = await slice.build('CodeVisualizer', {
         value: `// Functional update when state depends on previous value
slice.context.setState("cart", (prev) => ({
   ...prev,
   items: [...prev.items, newItem],
   total: prev.total + newItem.price
}));`,
         language: 'javascript'
      });
      this.querySelector('.functional-update-example').appendChild(functionalUpdateExample);

      const sharedUiExample = await slice.build('CodeVisualizer', {
         value: `// Shared UI state example
slice.context.create("ui", { sidebarOpen: false });

export default class SidebarToggle extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
   }

   async init() {
      this.addEventListener("click", () => {
         slice.context.setState("ui", (prev) => ({
            ...prev,
            sidebarOpen: !prev.sidebarOpen
         }));
      });
   }
}

export default class SidebarPanel extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
   }

   async init() {
      slice.context.watch(
         "ui",
         this,
         (isOpen) => this.classList.toggle("open", isOpen),
         (state) => state.sidebarOpen
      );
   }
}`,
         language: 'javascript'
      });
      this.querySelector('.shared-ui-example').appendChild(sharedUiExample);

      const faqQuestions = [
         {
            title: 'When should I use ContextManager?',
            text: 'Use ContextManager for shared, persistent state that multiple components need to read or react to. For one-off signals, use EventManager.'
         },
         {
            title: 'Do watchers clean up automatically?',
            text: 'Yes. You must pass a Slice component as the second argument, and the watcher will be removed when the component is destroyed.'
         },
         {
            title: 'How do selectors work?',
            text: 'Selectors are functions that return a subset of state. The watcher runs when the selected value changes, reducing unnecessary updates.'
         },
         {
            title: 'What should be persisted?',
            text: 'Persist small, serializable data such as preferences or session info. Avoid persisting large or volatile data.'
         }
      ];

      const faqContainer = this.querySelector('.faq-section');

      for (const question of faqQuestions) {
         const detailsComponent = await slice.build('Details', {
            title: question.title,
            text: question.text
         });

         faqContainer.appendChild(detailsComponent);
      }
   }
}

customElements.define('slice-contextmanagerdocumentation', ContextManagerDocumentation);
