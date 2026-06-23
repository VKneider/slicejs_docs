const docsIndex = [
  {
    title: 'Component Anatomy',
    route: '/Documentation/Component-Anatomy',
    description: 'How to author a Slice component, generate it with the CLI, and register it.',
    section: 'Getting Started',
    group: 'Components',
    order: 29,
    navLabel: 'Component Anatomy',
    tags: ['components', 'cli', 'anatomy', 'props']
  },
  {
    title: 'Static Props',
    route: '/Documentation/Static-Props',
    description: 'Define and validate component props in Slice.js.',
    section: 'Getting Started',
    group: 'Components',
    order: 30,
    navLabel: 'Static Props',
    tags: ['props', 'static', 'validation']
  },
  {
    title: 'The build method',
    route: '/Documentation/The-build-method',
    description: 'Use slice.build to create components.',
    section: 'Getting Started',
    group: 'Components',
    order: 31,
    navLabel: 'The build method',
    tags: ['build', 'components']
  },
  {
    title: 'Structural',
    route: '/Documentation/Structural',
    description: 'Structural components that power Slice.js.',
    section: 'Getting Started',
    group: 'Components',
    order: 33,
    navLabel: 'Structural',
    tags: ['structural', 'controller', 'router', 'styles']
  },
  {
    title: 'Services',
    route: '/Documentation/Service',
    description: 'Service components for shared logic and data.',
    section: 'Getting Started',
    group: 'Components',
    order: 34,
    navLabel: 'Services',
    tags: ['services', 'fetch', 'state']
  },
  {
    title: 'LifeCycle Methods',
    route: '/Documentation/LifeCycle-Methods',
    description: 'Overview of init, update, and beforeDestroy in Slice.js.',
    section: 'Getting Started',
    group: 'Components',
    order: 40,
    navLabel: 'LifeCycle Methods',
    tags: ['lifecycle', 'init', 'update', 'destroy']
  },
  {
    title: 'init()',
    route: '/Documentation/LifeCycle-Methods/init',
    description: 'One-time setup for Slice.js components.',
    section: 'Getting Started',
    group: 'Components',
    order: 41,
    navLabel: 'init()',
    tags: ['lifecycle', 'init']
  },
  {
    title: 'update()',
    route: '/Documentation/LifeCycle-Methods/update',
    description: 'Refresh dynamic UI in Slice.js components.',
    section: 'Getting Started',
    group: 'Components',
    order: 42,
    navLabel: 'update()',
    tags: ['lifecycle', 'update']
  },
  {
    title: 'beforeDestroy()',
    route: '/Documentation/LifeCycle-Methods/beforeDestroy',
    description: 'Cleanup hooks to avoid memory leaks in Slice.js.',
    section: 'Getting Started',
    group: 'Components',
    order: 43,
    navLabel: 'beforeDestroy()',
    tags: ['lifecycle', 'destroy', 'cleanup']
  },
  {
    title: 'Context vs Events',
    route: '/Documentation/Structural/Context-vs-Events',
    description: 'When to reach for ContextManager and when for EventManager — the one decision that keeps shared state clean.',
    section: 'Getting Started',
    group: 'Components',
    order: 56,
    navLabel: 'Context vs Events',
    tags: ['context', 'events', 'state', 'architecture']
  },
  {
    title: 'sliceConfig.json',
    route: '/Documentation/Configuration/sliceConfig',
    description: 'How Slice.js loads and uses sliceConfig.json.',
    section: 'Getting Started',
    group: 'Configuration',
    order: 20,
    navLabel: 'sliceConfig.json',
    tags: ['config', 'setup']
  },
  {
    title: 'Environment Variables',
    route: '/Documentation/Configuration/environment-variables',
    description: 'Expose browser-safe env values with SLICE_PUBLIC_ and runtime helpers.',
    section: 'Getting Started',
    group: 'Configuration',
    order: 21,
    navLabel: 'Environment Variables',
    tags: ['config', 'env', 'security']
  },
  {
    title: 'Logger',
    route: '/Documentation/Structural/Logger',
    description: 'Structured logging and filters for Slice.js.',
    section: 'Getting Started',
    group: 'Diagnostics',
    order: 40,
    navLabel: 'Logger',
    tags: ['logger', 'diagnostics', 'debugging']
  },
  {
    title: 'DevTools',
    route: '/Documentation/DevTools',
    description: 'The component inspector and the events and context panels, and how live editing works.',
    section: 'Getting Started',
    group: 'Diagnostics',
    order: 42,
    navLabel: 'DevTools',
    tags: ['devtools', 'debugger', 'events', 'context', 'diagnostics']
  },
  {
    title: 'EventManager',
    route: '/Documentation/Structural/EventManager',
    description: 'Lightweight pub/sub for component and app events.',
    section: 'Getting Started',
    group: 'Events',
    order: 20,
    navLabel: 'Events',
    tags: ['events', 'pubsub', 'lifecycle', 'cleanup']
  },
  {
    title: 'Project Anatomy',
    route: '/Documentation/Project-Anatomy',
    description: 'What slice init creates and which files you actually edit.',
    section: 'Getting Started',
    group: 'First Steps',
    order: 11,
    navLabel: 'Project Anatomy',
    tags: ['getting-started', 'project', 'structure']
  },
  {
    title: 'Your First Page',
    route: '/Documentation/First-Page',
    description: 'Edit a section and add a new one in the App Shell starter, end to end.',
    section: 'Getting Started',
    group: 'First Steps',
    order: 12,
    navLabel: 'Your First Page',
    tags: ['getting-started', 'components', 'routing']
  },
  {
    title: 'The Development Loop',
    route: '/Documentation/Development-Workflow',
    description: 'The dev to build to start cycle and where your components live.',
    section: 'Getting Started',
    group: 'First Steps',
    order: 13,
    navLabel: 'The Development Loop',
    tags: ['getting-started', 'cli', 'workflow']
  },
  {
    title: 'Common Gotchas',
    route: '/Documentation/Common-Gotchas',
    description: 'The traps Slice.js developers hit first — DOM timing, cleanup, routing, props — and how to avoid each one.',
    section: 'Getting Started',
    group: 'First Steps',
    order: 28,
    navLabel: 'Common Gotchas',
    tags: ['gotchas', 'troubleshooting', 'errors', 'cleanup']
  },
  {
    title: 'Route Guards',
    route: '/Documentation/Routing/Guards',
    description: 'Guard patterns for secure navigation.',
    section: 'Getting Started',
    group: 'Routing',
    order: 51,
    navLabel: 'Route Guards',
    tags: ['routing', 'guards']
  },
  {
    title: 'ContextManager',
    route: '/Documentation/Structural/ContextManager',
    description: 'Shared state with watchers, selectors, and persistence.',
    section: 'Getting Started',
    group: 'State',
    order: 30,
    navLabel: 'ContextManager',
    tags: ['context', 'state', 'persistence']
  },
  {
    title: 'Slice CLI',
    route: '/Documentation/CLI',
    description: 'Command reference for the Slice.js CLI.',
    section: 'Getting Started',
    group: 'Tooling',
    order: 15,
    navLabel: 'CLI',
    tags: ['cli', 'tooling']
  },
  {
    title: 'External Dependencies',
    route: '/Documentation/External-Dependencies',
    description: 'Temporary official pattern for using external scripts and libraries in Slice.js.',
    section: 'Getting Started',
    group: 'Tooling',
    order: 25,
    navLabel: 'External Dependencies',
    tags: ['dependencies', 'external', 'publicFolders', 'bundling']
  },
  {
    title: 'Slice.js MCP',
    route: '/Documentation/Slice-MCP',
    description: 'Model Context Protocol server for accessing Slice.js documentation via npx or local development.',
    section: 'Getting Started',
    group: 'Tools',
    order: 21,
    navLabel: 'MCP',
    tags: ['mcp', 'documentation', 'ai', 'tools']
  },
  {
    title: 'Installation',
    route: '/Documentation/Installation',
    description: 'Install the CLI, initialize a project, and start the dev server.',
    section: 'Introduction',
    group: 'Overview',
    order: 3,
    navLabel: 'Installation',
    tags: ['installation', 'cli', 'setup']
  },
  {
    title: 'Quick API Reference',
    route: '/Documentation/API-Reference',
    description: 'Every public slice.* method at a glance — build, props, cleanup, router, context, events, logger, env.',
    section: 'Introduction',
    group: 'Reference',
    order: 4,
    navLabel: 'API Reference',
    tags: ['api', 'reference']
  },
  {
    title: 'Choosing a Project Style',
    route: '/Documentation/Architecture',
    description: 'Decide whether your Slice app should use App Shell + MultiRoute or a Single-View SPA.',
    section: 'Project Architecture',
    group: 'Styles and Patterns',
    order: 1,
    navLabel: 'Choosing a Project Style',
    tags: ['architecture', 'project-structure', 'multiroute', 'spa']
  },
  {
    title: 'App Shell + MultiRoute',
    route: '/Documentation/Architecture/App-Shell-MultiRoute',
    description: 'Build section-based apps with a persistent shell and route-driven content switching.',
    section: 'Project Architecture',
    group: 'Styles and Patterns',
    order: 2,
    navLabel: 'App Shell + MultiRoute',
    tags: ['architecture', 'multiroute', 'routing', 'layout']
  },
  {
    title: 'Single-View SPA',
    route: '/Documentation/Architecture/Single-View-SPA',
    description: 'Build flow-driven apps with one route and internal state transitions.',
    section: 'Project Architecture',
    group: 'Styles and Patterns',
    order: 3,
    navLabel: 'Single-View SPA',
    tags: ['architecture', 'spa', 'state-machine', 'game']
  },
  {
    title: 'Routing and Data Passing',
    route: '/Documentation/Architecture/Routing-Data',
    description: 'Understand current Slice routing behavior, slug support, query usage, and route-to-route data strategies.',
    section: 'Project Architecture',
    group: 'Styles and Patterns',
    order: 4,
    navLabel: 'Routing and Data Passing',
    tags: ['routing', 'params', 'query', 'context', 'events']
  },
  {
    title: 'Service Patterns',
    route: '/Documentation/Architecture/Service-Patterns',
    description: 'Where state and logic should live in a Slice app — instance fields, plain helpers, singleton services, providers — and how cleanup actually works.',
    section: 'Project Architecture',
    group: 'Styles and Patterns',
    order: 6,
    navLabel: 'Service Patterns',
    tags: ['architecture', 'services', 'singleton', 'state', 'cleanup']
  },
  {
    title: 'Component Styles',
    route: '/Documentation/Architecture/Component-Styles',
    description: 'How to write a component\'s CSS so it stays encapsulated — scope every selector under the component tag, declare an explicit host display, and prefix keyframes.',
    section: 'Project Architecture',
    group: 'Styles and Patterns',
    order: 7,
    navLabel: 'Component Styles',
    tags: ['css', 'styles', 'scoping', 'encapsulation', 'display', 'keyframes']
  },
  {
    title: 'Refreshing Component Data',
    route: '/Documentation/Architecture/Refreshing-Component-Data',
    description: 'How to update what a component shows after it\'s built — prop setters, update(), context, events, or destroy+recreate — and which to reach for.',
    section: 'Project Architecture',
    group: 'Styles and Patterns',
    order: 7,
    navLabel: 'Refreshing Data',
    tags: ['architecture', 'state', 'update', 'context', 'events']
  },
];

export default docsIndex;
