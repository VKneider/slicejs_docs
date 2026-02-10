const routes = [
   // Rutas principales
   { path: '/', component: 'LandingPage' },
   {
      path: '/Documentation',
      component: 'DocumentationPage',
      children: [
         {
            path: '/Slice',
            component: 'WhatIsSlice',
         },
         {
            path: '/Commands',
            component: 'CommandsDocumentation',
         },
         {
            path: '/CLI',
            component: 'CommandsDocumentation',
         },
         {
            path: '/SliceConfig',
            component: 'SliceConfigDocumentation',
         },

         {
            path: '/Visual',
            component: 'VisualDocumentation',
         },
         {
            path: '/Service',
            component: 'ServiceDocumentation',
         },
         {
            path: '/Structural',
            component: 'StructuralDocumentation',
         },
         {
            path: '/Structural/EventManager',
            component: 'EventManagerDocumentation',
         },
         {
            path: '/Structural/ContextManager',
            component: 'ContextManagerDocumentation',
         },
         {
            path: '/Structural/Logger',
            component: 'LoggerDocumentation',
         },

         {
            path: '/Themes',
            component: 'ThemesDocumentation',
         },
         {
            path: '/Slice-MCP',
            component: 'SliceMCP',
         },
         {
            path: '/Routing',
            component: 'RoutingDocumentation',
         },
         {
            path:'/Routing/Guards',
            component: 'RouterGuardsDocumentation',
         },
         {
            path: '/Installation',
            component: 'Installation',
         },
         {
            path: '/The-build-method',
            component: 'TheBuildMethod',
         },
         {
            path: '/Static-Props',
            component: 'StaticPropsDocumentation',
         },
         {
            path: '/LifeCycle-Methods',
            component: 'LifeCycleMethods',
         },
         {
            path: '/LifeCycle-Methods/init',
            component: 'InitMethodDocumentation',
         },
         {
            path: '/LifeCycle-Methods/update',
            component: 'UpdateMethodDocumentation',
         },
         {
            path: '/LifeCycle-Methods/beforeDestroy',
            component: 'BeforeDestroyDocumentation',
         },
         {
            path: '/Components',
            component: 'DocumentationPage',
            children: [
               {
                  path: '/Visual',
                  component: 'VisualDocumentation',
                  children: [
                     {
                        path: '/Card',
                        component: 'CardDocumentation',
                     },
                     {
                        path: '/Button',
                        component: 'ButtonDocumentation',
                     },
                     {
                        path: '/Switch',
                        component: 'SwitchDocumentation',
                     },
                     {
                        path: '/Checkbox',
                        component: 'CheckboxDocumentation',
                     },
                     {
                        path: '/Input',
                        component: 'InputDocumentation',
                     },
                     {
                        path: '/MultiRoute',
                        component: 'MultiRouteDocumentation',
                     },
                     {
                        path: '/DropDown',
                        component: 'DropDownDocumentation',
                     },
                     {
                        path: '/Layout',
                        component: 'LayoutDocumentation',
                     },
                     {
                        path: '/Loading',
                        component: 'LoadingDocumentation',
                     },
                     {
                        path: '/Details',
                        component: 'DetailsDocumentation',
                     },
                     {
                        path: '/TreeView',
                        component: 'TreeViewDocumentation',
                     },
                     {
                        path: '/Grid',
                        component: 'GridDocumentation',
                     },
                     {
                        path: '/NavBar',
                        component: 'NavBarDocumentation',
                     },
                     {
                        path: '/Select',
                        component: 'SelectDocumentation',
                     }
                  ]
               },
               /*{
                  path: '/Service',
                  component: 'ServiceDocumentation',
                  children:[
                     {
                        path: '/FetchManager',
                        component: 'FetchManagerDocumentation',
                     }
                  ]
               }*/
            ]
         }
      ]
   },
   // Otras rutas
   { path: '/Playground', component: 'Playground' },
   { path: '/ThemeCreator', component: 'ThemeCreator' },
   { path: '/404', component: 'NotFound' },
   {
      path: '/Docum/${category}/${id}',
      component: 'LandingPage',
   },
   {
      path: '/About',
      component: 'TheSliceTeam',
   },
   {
      path: '/about',
      component: 'TheSliceTeam',
   },

];

export default routes;
