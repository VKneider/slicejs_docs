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
         buttons: [
            {
               value: 'Change Theme',
               onClickCallback: async () => {
                  let theme = slice.stylesManager.themeManager.currentTheme;
                  if (theme === 'Slice') {
                     await slice.setTheme('Light');
                     theme = 'Light';
                  } else if (theme === 'Light') {
                     await slice.setTheme('Dark');
                     theme = 'Dark';
                  } else if (theme === 'Dark') {
                     await slice.setTheme('Slice');
                     theme = 'Slice';
                  }
               },
            },
         ],
      });


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