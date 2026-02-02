import { documentationRoutes, getAllRoutes, createTreeViewItems } from './documentationRoutes.js';

export default class DocumentationPage extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
     
      // Usar la configuración de rutas centralizada
      const routesConfig = documentationRoutes;

      const navBar = await slice.build('Navbar', {
         position: 'fixed',
         logo: {
            src: '/images/Slice.js-logo.png',
            path: '/',
         },
         items: [
            { text: 'Home', path: '/' },
            { text: 'Documentation', path: '/Documentation' },
            { text: 'Playground', path: '/Playground' },
            { text: 'Theme Creator', path: '/ThemeCreator' },
            { text: 'About', path: '/About' }
         ],
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
            },
            {
               name: 'NavyYellow',
               colors: { primary: '#020617', secondary: '#FCD34D' },
               description: 'Navy blue with yellow accents'
            },
            {
               name: 'CrimsonRed',
               colors: { primary: '#990000', secondary: '#4A4A4A' },
               description: 'Elegant deep crimson'
            },
            {
               name: 'NeonCyberpunk',
               colors: { primary: '#FF00FF', secondary: '#00FFFF' },
               description: 'High contrast neon madness'
            },
            {
               name: 'CandyPop',
               colors: { primary: '#FF69B4', secondary: '#87CEEB' },
               description: 'Sweet and bubbly pastels'
            },
            {
               name: 'ToxicSlime',
               colors: { primary: '#CCFF00', secondary: '#9D00FF' },
               description: 'Warning: Radioactive colors'
            },
            {
               name: 'RetroVapor',
               colors: { primary: '#FF71CE', secondary: '#01CDFE' },
               description: 'Aesthetic 80s vibes'
            }
         ]
      });

      navBar.querySelector('.nav_bar_buttons')?.appendChild(themeSelector);


      // Obtener todas las rutas planas para el MultiRoute
      const multiRouteItems = getAllRoutes(routesConfig);

      // Asegurarse que la ruta por defecto esté incluida
      if (!multiRouteItems.some(route => route.path === routesConfig.defaultRoute.path)) {
         multiRouteItems.push(routesConfig.defaultRoute);
      }

      console.log('MultiRoute items:', multiRouteItems);

      // Crear el MultiRoute con todas las rutas
      const VisualComponentsMultiRoute = await slice.build('MultiRoute', {
         routes: multiRouteItems
      });

      // Crear el TreeView con la estructura jerárquica
      const treeviewItems = createTreeViewItems(routesConfig);
      const treeview = await slice.build('TreeView', {
         items: treeviewItems,
         onClickCallback: async (item) => {
            if (item.path) {
               await slice.router.navigate(item.path);
            }
         },
      });

      const mainMenu = await slice.build('MainMenu', {});
      mainMenu.add(treeview);

      const myNavigation = await slice.build('MyNavigation', {
         page: VisualComponentsMultiRoute,
      });

      const layOut = await slice.build('Layout', {
         view: VisualComponentsMultiRoute,
      });

      layOut.onLayOut(mainMenu);
      layOut.onLayOut(navBar);
      layOut.onLayOut(myNavigation);

      if (window.location.pathname === '/Documentation') {
         await VisualComponentsMultiRoute.renderIfCurrentRoute();
      }

      this.appendChild(layOut);
   }
}

customElements.define('slice-documentation-page', DocumentationPage);
