export default class LandingMenu extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      let logoSize = '500px';
      if (window.screen.width <= 770) {
         logoSize = '300px';
      }
      const svgMarkup = await this.loadLogoSvg();
      if (svgMarkup) {
         const logoWrapper = document.createElement('div');
         logoWrapper.classList.add('sliceLogo');
         logoWrapper.style.width = logoSize;
         logoWrapper.style.height = logoSize;
         logoWrapper.innerHTML = svgMarkup;

         const svgElement = logoWrapper.querySelector('svg');
         if (svgElement) {
            svgElement.style.width = '100%';
            svgElement.style.height = '100%';
         }

         this.querySelector('.intro').appendChild(logoWrapper);
      }
      const goToDocs = await slice.build('Button', {
         value: 'Go to Documentation',
         onClickCallback: async () => {
            await slice.router.navigate('/Documentation');
         },
      });
      this.querySelector('.goToDocs').appendChild(goToDocs);
   }

   async loadLogoSvg() {
      try {
         const response = await fetch('/images/Slice.js-logo.svg');
         if (!response.ok) {
            throw new Error('Failed to load logo');
         }
         return await response.text();
      } catch (error) {
         console.warn('Could not load SVG logo:', error);
         return null;
      }
   }
}

customElements.define('slice-landing-menu', LandingMenu);
