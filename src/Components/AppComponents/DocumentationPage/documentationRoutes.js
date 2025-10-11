// Configuración centralizada de rutas para la documentación
export const documentationRoutes = {
   introduction: {
      title: 'Introduction',
      items: [
         {
            title: 'What is Slice.js?',
            path: '/Documentation/Slice',
            component: 'WhatIsSlice'
         },
         {
            title: 'Installation',
            path: '/Documentation/Installation',
            component: 'Installation'
         },
         {
            title: 'Slice-cli Commands',
            path: '/Documentation/Commands',
            component: 'CommandsDocumentation'
         }
      ]
   },
   gettingStarted: {
      title: 'Getting Started',
      items: [
         {
            title: 'SliceConfig.json',
            path: '/Documentation/SliceConfig',
            component: 'SliceConfigDocumentation'
         },
         {
            title: 'Components',
            items: [
               {
                  title: 'The build method',
                  path: '/Documentation/The-build-method',
                  component: 'TheBuildMethod'
               },
               {
                  title: 'Static Props',
                  path: '/Documentation/Static-Props',
                  component: 'StaticPropsDocumentation'
               },
               {
                  title: 'LifeCycle Methods',
                  path: '/Documentation/LifeCycle-Methods',
                  component: 'LifeCycleMethods'
               },
               {
                  title: 'Visual',
                  path: '/Documentation/Visual',
                  component: 'VisualDocumentation'
               },
               {
                  title: 'Structural',
                  path: '/Documentation/Structural',
                  component: 'StructuralDocumentation'
               },
               {
                  title: 'Services',
                  path: '/Documentation/Service',
                  component: 'ServiceDocumentation'
               }
            ]
         },
         {
            title: 'Routing',
            path: '/Documentation/Routing',
            component: 'RoutingDocumentation'
         },
         {
            title: 'Themes',
            path: '/Documentation/Themes',
            component: 'ThemesDocumentation'
         },
         {
            title: 'Slice Styles',
            path: '/Documentation/Slice-Styles',
            component: 'SliceStylesDocumentation'
         }
      ]
   },
   componentsLibrary: {
      title: 'Components Library',
      items: [
         {
            title: 'Visual',
            path: '/Documentation/Visual',
            items: [
               { title: 'Button', path: '/Documentation/Components/Visual/Button', component: 'ButtonDocumentation' },
               { title: 'Card', path: '/Documentation/Components/Visual/Card', component: 'CardDocumentation' },
               { title: 'Checkbox', path: '/Documentation/Components/Visual/Checkbox', component: 'CheckboxDocumentation' },
               { title: 'Input', path: '/Documentation/Components/Visual/Input', component: 'InputDocumentation' },
               { title: 'Switch', path: '/Documentation/Components/Visual/Switch', component: 'SwitchDocumentation' },
               {
                  title: 'MultiRoute',
                  path: '/Documentation/Components/Visual/MultiRoute',
                  component: 'MultiRouteDocumentation'
               },
               { title: 'Layout', path: '/Documentation/Components/Visual/Layout', component: 'LayoutDocumentation' },
               { title: 'Loading', path: '/Documentation/Components/Visual/Loading', component: 'LoadingDocumentation' },
               { title: 'Details', path: '/Documentation/Components/Visual/Details', component: 'DetailsDocumentation' },
               { title: 'TreeView', path: '/Documentation/Components/Visual/TreeView', component: 'TreeViewDocumentation' },
               { title: 'Grid', path: '/Documentation/Components/Visual/Grid', component: 'GridDocumentation' },
               { title: 'NavBar', path: '/Documentation/Components/Visual/NavBar', component: 'NavBarDocumentation' },
               { title: 'Select', path: '/Documentation/Components/Visual/Select', component: 'SelectDocumentation' }
            ]
         }
      ]
   },
   defaultRoute: {
      path: '/Documentation',
      component: 'Documentation'
   }
};

// Función para extraer todas las rutas para MultiRoute
export const getAllRoutes = (routesObj) => {
   const allRoutes = [];

   const processItems = (items) => {
      if (!items) return;

      items.forEach(item => {
         if (item.path && item.component) {
            allRoutes.push({
               path: item.path,
               component: item.component
            });
         }

         if (item.items) {
            processItems(item.items);
         }
      });
   };

   // Procesar cada sección principal
   Object.values(routesObj).forEach(section => {
      if (section.path && section.component) {
         allRoutes.push({
            path: section.path,
            component: section.component
         });
      }

      if (section.items) {
         processItems(section.items);
      }
   });

   return allRoutes;
};

// Función para convertir el config de rutas al formato del TreeView
export const createTreeViewItems = (routesConfig) => {
   return [
      {
         value: routesConfig.introduction.title,
         items: routesConfig.introduction.items.map(item => ({
            value: item.title,
            path: item.path,
            component: item.component
         }))
      },
      {
         value: routesConfig.gettingStarted.title,
         items: routesConfig.gettingStarted.items.map(item => {
            if (item.items) {
               return {
                  value: item.title,
                  items: item.items.map(subItem => ({
                     value: subItem.title,
                     path: subItem.path,
                     component: subItem.component
                  }))
               };
            }
            return {
               value: item.title,
               path: item.path,
               component: item.component
            };
         })
      },
      {
         value: routesConfig.componentsLibrary.title,
         items: routesConfig.componentsLibrary.items.map(item => {
            if (item.items) {
               return {
                  value: item.title,
                  items: item.items.map(subItem => ({
                     value: subItem.title,
                     path: subItem.path,
                     component: subItem.component
                  }))
               };
            }
            return {
               value: item.title,
               path: item.path,
               component: item.component
            };
         })
      }
   ];
};
