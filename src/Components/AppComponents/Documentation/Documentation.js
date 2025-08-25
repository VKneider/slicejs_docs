export default class Documentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      const htmlCard = await slice.build('Card', {
         title: 'HTML',
         text: 'HyperText Markup Language is the most basic building block of the Web. It defines the meaning and structure of web content.',
         icon: {
            name: 'html',
            iconStyle: 'filled',
         },
         customColor: {
            card: '#E36A2F',
            icon: 'white',
         },
      });
      const jsCard = await slice.build('Card', {
         title: 'JS',
         text: 'JavaScript is a lightweight interpreted (or just-in-time compiled) programming language with first-class functions.',
         icon: {
            name: 'javascript',
            iconStyle: 'filled',
         },
         customColor: {
            card: 'gold',
            icon: 'white',
         },
      });
      const cssCard = await slice.build('Card', {
         title: 'CSS',
         text: 'Cascading Style Sheets is a stylesheet language used to describe the presentation of a document written in HTML or XML (including XML dialects such as SVG, MathML or XHTML). CSS describes how elements should be rendered on screen, on paper, in speech, or on other media.',
         icon: {
            name: 'css',
            iconStyle: 'filled',
         },
         customColor: {
            card: '#519ABA',
            icon: 'white',
         },
      });
      const grid = await slice.build('Grid', {
         columns: 3,
         rows: 1,
         items: [htmlCard, jsCard, cssCard],
      });

      if (window.screen.width <= 770) {
         grid.columns = 1;
      }

      this.querySelector('.visualComponents').appendChild(grid);

      //Q & A
      const buildQuestion = await slice.build('Details', {
         title: 'How can i build a component?',
         text: "To build a component you need to call the slice.build method with it's required props.",
      });
      const buildExample = await slice.build('CodeVisualizer', {
         value: `const mySliceComponent = await slice.build("MySliceComponentName", props)`,
         language: 'javascript',
      });

      buildQuestion.addDetail(buildExample);

      this.querySelector('.qna').appendChild(buildQuestion);

      // Static Props Section
      const staticPropsTitle = await slice.build('Details', {
         title: 'What are Static Props in Slice.js?',
         text: 'Static Props are predefined properties that can be passed to components during the build process. They provide a way to configure components with consistent, reusable values.',
      });

      const staticPropsExplanation = await slice.build('CodeVisualizer', {
         value: `// Static Props are defined in the component's constructor
constructor(props) {
   super();
   slice.attachTemplate(this);
   
   // Set component props using the controller
   slice.controller.setComponentProps(this, props);
   
   // Access static props directly
   this.debuggerProps = [];
}`,
         language: 'javascript',
      });

      const staticPropsUsage = await slice.build('CodeVisualizer', {
         value: `// Using Static Props when building a component
const component = await slice.build('MyComponent', {
   title: 'My Title',
   description: 'My Description',
   isEnabled: true,
   customClass: 'my-custom-class'
});

// The component receives these as static props
// and can access them via this.title, this.description, etc.`,
         language: 'javascript',
      });

      const staticPropsBenefits = await slice.build('CodeVisualizer', {
         value: `// Benefits of Static Props:
// 1. Type Safety - Props are validated at build time
// 2. Performance - No dynamic property lookups
// 3. Consistency - Same props always work the same way
// 4. Documentation - Props are clearly defined
// 5. IDE Support - Better autocomplete and error checking

// Example of a component with well-defined static props
export default class Button extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      // Set static props
      slice.controller.setComponentProps(this, props);
      
      // Access static props
      this.text = this.text || 'Click me';
      this.onClick = this.onClick || (() => {});
      this.variant = this.variant || 'primary';
   }
}`,
         language: 'javascript',
      });

      staticPropsTitle.addDetail(staticPropsExplanation);
      staticPropsTitle.addDetail(staticPropsUsage);
      staticPropsTitle.addDetail(staticPropsBenefits);

      this.querySelector('.static-props').appendChild(staticPropsTitle);
   }
}

customElements.define('slice-documentation', Documentation);
