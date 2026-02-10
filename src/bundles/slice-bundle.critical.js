/**
 * Slice.js Bundle
 * Type: critical
 * Generated: 2026-02-10T00:22:47.473Z
 * Strategy: hybrid
 * Components: 1
 * Total Size: 1.1 KB
 */

export const SLICE_BUNDLE = {
  metadata: {
  "version": "2.0.0",
  "type": "critical",
  "route": null,
  "generated": "2026-02-10T00:22:47.473Z",
  "totalSize": 1174,
  "componentCount": 1,
  "strategy": "hybrid"
},

  components: {
  "Layout": {
    "name": "Layout",
    "category": "Visual",
    "categoryType": "Visual",
    "js": "class Layout extends HTMLElement {\r\n\r\n   static props = {\r\n      layout: { \r\n         type: 'object', \r\n         default: null, \r\n         required: false \r\n      },\r\n      view: { \r\n         type: 'object', \r\n         default: null, \r\n         required: false \r\n      }\r\n   };\r\n\r\n   constructor(props) {\r\n      super();\r\n      slice.attachTemplate(this);\r\n\r\n      slice.controller.setComponentProps(this, props);\r\n      this.currentView = null;\r\n   }\r\n\r\n   async init() {\r\n      if (this.layout) {\r\n         await this.onLayOut(this.layout);\r\n      }\r\n      if (this.view) {\r\n         await this.showing(this.view);\r\n      }\r\n   }\r\n\r\n   get layout() {\r\n      return this._layout;\r\n   }\r\n\r\n   set layout(value) {\r\n      this._layout = value;\r\n   }\r\n\r\n   get view() {\r\n      return this._view;\r\n   }\r\n\r\n   set view(value) {\r\n      this._view = value;\r\n   }\r\n\r\n   async showing(view) {\r\n      if (this.currentView) {\r\n         this.removeChild(this.currentView);\r\n      }\r\n      this.appendChild(view);\r\n      this.currentView = view;\r\n   }\r\n\r\n   async onLayOut(view) {\r\n      this.appendChild(view);\r\n   }\r\n}\r\n\r\nwindow.Layout = Layout;\ncustomElements.define('slice-layout', Layout);\r\n\nreturn Layout;",
    "externalDependencies": {},
    "componentDependencies": [],
    "html": "",
    "css": "",
    "size": 1174
  }
}
};

// Auto-registration of components
if (window.slice && window.slice.controller) {
  slice.controller.registerBundle(SLICE_BUNDLE);
}
