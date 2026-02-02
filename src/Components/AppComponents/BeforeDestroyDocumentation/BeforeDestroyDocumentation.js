export default class BeforeDestroyDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      const beforeDestroyExample = await slice.build('CodeVisualizer', {
         value: `export default class LiveChart extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.abortController = new AbortController();
   }

   async init() {
      this._pollingId = setInterval(() => this.fetchData(), 5000);
      window.addEventListener('resize', this.onResize);

      await fetch('/api/chart', { signal: this.abortController.signal });
   }

   beforeDestroy() {
      clearInterval(this._pollingId);
      this.abortController.abort();
      window.removeEventListener('resize', this.onResize);
      this.chartInstance?.destroy();
   }
}

customElements.define('slice-live-chart', LiveChart);`,
         language: 'javascript'
      });

      const bestPractices = await slice.build('CodeVisualizer', {
         value: `// ✅ beforeDestroy() Best Practices

// 1) Clear timers
clearInterval(this._pollingId);
clearTimeout(this._timeoutId);

// 2) Abort pending fetch requests
this.abortController?.abort();

// 3) Remove global listeners
window.removeEventListener('resize', this._onResize);

// 4) Dispose external instances
this.chartInstance?.destroy();
this.map?.remove();`,
         language: 'javascript'
      });

      const pitfalls = await slice.build('CodeVisualizer', {
         value: `// ❌ beforeDestroy() Pitfalls

// 1) Forgetting to remove global listeners
window.addEventListener('resize', this._onResize);
// ... later: no removal → leak

// 2) Leaving intervals running
this._pollingId = setInterval(this.fetchData, 5000);
// ... later: no clearInterval → leak

// 3) Ignoring pending fetch requests
fetch('/api/data');
// ... later: no AbortController → leak
`,
         language: 'javascript'
      });

      this.querySelector('.before-destroy-example').appendChild(beforeDestroyExample);
      this.querySelector('.best-practices').appendChild(bestPractices);
      this.querySelector('.pitfalls').appendChild(pitfalls);
   }
}

customElements.define('slice-beforedestroydocumentation', BeforeDestroyDocumentation);
