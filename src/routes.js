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
            path: '/Configuration/sliceConfig',
            component: 'SliceConfigDocumentation',
         },
         {
            path: '/External-Dependencies',
            component: 'ExternalDependenciesDocumentation',
         },
         {
            path: '/Configuration/environment-variables',
            component: 'EnvironmentVariablesDocumentation',
         },
         {
            path: '/Configuration/PWA',
            component: 'PwaDocumentation',
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
            path: '/Structural/EventRegistry',
            component: 'EventRegistryDocumentation',
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
            path: '/Architecture',
            component: 'ProjectArchitectureDocumentation',
         },
         {
            path: '/Architecture/App-Shell-MultiRoute',
            component: 'AppShellMultiRouteDocumentation',
         },
         {
            path: '/Architecture/Single-View-SPA',
            component: 'SingleViewSpaDocumentation',
         },
         {
            path: '/Architecture/Routing-Data',
            component: 'RoutingDataDocumentation',
         },
           {
              path: '/Architecture/Service-Patterns',
              component: 'ServicePatternsDocumentation',
           },
           {
              path: '/Architecture/Component-Styles',
              component: 'ComponentStylesDocumentation',
           },
           {
              path: '/Architecture/Refreshing-Component-Data',
              component: 'RefreshingComponentDataDocumentation',
           },
          {
             path: '/Components',
             component: 'VisualDocumentation'
          },
          {
             path: '/Project-Anatomy',
             component: 'ProjectAnatomy',
          },
          {
             path: '/First-Page',
             component: 'FirstPage',
          },
          {
             path: '/Development-Workflow',
             component: 'DevelopmentWorkflow',
          },
          {
             path: '/Component-Anatomy',
             component: 'ComponentAnatomy',
          },
          {
             path: '/DevTools',
             component: 'DevToolsDocumentation',
          },
          {
             path: '/LeakInspector',
             component: 'LeakInspectorDocumentation',
          },
          {
             path: '/Common-Gotchas',
             component: 'CommonGotchasDocumentation',
          },
          {
             path: '/Structural/Context-vs-Events',
             component: 'ContextVsEventsDocumentation',
          },
          {
             path: '/API-Reference',
             component: 'ApiReferenceDocumentation',
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
      path: '/about',
      component: 'TheSliceTeam',
   },

];

export default routes;
