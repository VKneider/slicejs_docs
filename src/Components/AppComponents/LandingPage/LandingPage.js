export default class LandingPage extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      const div = document.createElement('div');
      const navBar = await slice.build('Navbar', {
         logo: {
            src: '/images/Slice.js-logo.png',
            path: '',
         },
         buttons: [],
      });

      const themeSelector = await slice.build('ThemeSelector', {
         themes: [
            {
               name: 'EmeraldLight',
               colors: { primary: '#10B981', secondary: '#FEFFFE' },
               description: 'Official Slice.js theme'
            },
            {
               name: 'Light',
               colors: { primary: '#F3F4F6', secondary: '#374151' },
               description: 'Clean and bright'
            },
            {
               name: 'Dark',
               colors: { primary: '#18181B', secondary: '#F3F4F6' },
               description: 'Easy on the eyes'
            },
            {
               name: 'CobaltBlue',
               colors: { primary: '#1D4ED8', secondary: '#F97316' },
               description: 'Professional blue with orange accents and light background'
            },
            {
               name: 'Purple',
               colors: { primary: '#9333EA', secondary: '#10B981' },
               description: 'Creative purple'
            }
         ]
      });

      navBar.querySelector('.nav_bar_buttons')?.appendChild(themeSelector);
      div.appendChild(navBar);
      const divView = document.createElement('div');
      divView.classList.add('landing_page');

      const landingMenu = await slice.build('LandingMenu', {});
      divView.appendChild(landingMenu);
      const layOut = await slice.build('Layout', {
         layout: div,
         view: divView,
      });

      this.appendChild(layOut);
   }
}

customElements.define('slice-landingpage', LandingPage);
