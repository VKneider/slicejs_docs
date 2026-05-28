import { documentationRoutes, getAllRoutes, createTreeViewItems } from './documentationRoutes.js';
import docsIndex from './docsIndex.js';

export default class DocumentationPage extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      const titleByRoute = new Map(docsIndex.map(d => [d.route, d.title]));
      slice.router.afterEach((to) => {
        const title = titleByRoute.get(to.path) || 'Slice - Documentation';
        document.title = `${title} | Slice.js`;
      });

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
         ],
         buttons: [],
      });

const themeSelector = await slice.build('ThemeSelector');

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

      const searchInput = await slice.build('InputSearchDocs', {
         docsIndex,
         maxResults: 10,
         onSelect: async (item) => {
            if (!item?.route) return;
            await slice.router.navigate(item.route);
         }
      });

      const mainMenu = await slice.build('MainMenu', {});
      mainMenu.add(searchInput);
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
