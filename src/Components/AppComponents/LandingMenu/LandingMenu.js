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
         onClick: async () => {
            await slice.router.navigate('/Documentation');
         },
      });
      const actions = this.querySelector('.hero-actions');
      actions.appendChild(goToDocs);

      const github = document.createElement('a');
      github.className = 'landing-github';
      github.href = 'https://github.com/VKneider/slice.js';
      github.target = '_blank';
      github.rel = 'noopener noreferrer';
      github.setAttribute('aria-label', 'Slice.js on GitHub');

      const githubIcon = await slice.build('Icon', {
         name: 'github',
         size: '20',
         color: 'currentColor',
      });
      if (githubIcon) {
         githubIcon.setAttribute('aria-hidden', 'true');
         this._githubIcon = githubIcon;
         github.appendChild(githubIcon);
      }

      const githubLabel = document.createElement('span');
      githubLabel.textContent = 'GitHub';
      github.appendChild(githubLabel);
      actions.appendChild(github);
   }

   beforeDestroy() {
      if (this._githubIcon) {
         slice.controller.destroyComponent(this._githubIcon);
         this._githubIcon = null;
      }
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
