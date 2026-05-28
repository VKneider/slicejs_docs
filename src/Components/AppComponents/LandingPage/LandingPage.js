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

const themeSelector = await slice.build('ThemeSelector');

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
