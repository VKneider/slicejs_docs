const docsIndex = [
  {
    title: 'MultiRoute',
    route: '/Documentation/Components/Visual/MultiRoute',
    description: 'Route container with caching and dynamic navigation.',
    section: 'Components Library',
    group: 'Visual',
    order: 60,
    navLabel: 'MultiRoute',
    tags: ['routing', 'multiroute', 'caching']
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
    title: 'Visual',
    route: '/Documentation/Visual',
    description: 'Visual components and usage patterns in Slice.js.',
    section: 'Getting Started',
    group: 'Components',
    order: 32,
    navLabel: 'Visual',
    tags: ['visual', 'components']
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
    title: 'Slice Routing',
    route: '/Documentation/Routing',
    description: 'Router setup, navigation, and guards.',
    section: 'Getting Started',
    group: 'Routing',
    order: 50,
    navLabel: 'Routing',
    tags: ['routing', 'router', 'guards']
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
    route: '/Documentation/ContextManager',
    description: 'Shared state with watchers, selectors, and persistence.',
    section: 'Getting Started',
    group: 'State',
    order: 35,
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
    title: 'Documentation',
    route: '/Documentation',
    description: 'The documentation landing page for Slice.js.',
    section: 'Introduction',
    group: 'Overview',
    order: 1,
    navLabel: 'Documentation',
    tags: ['documentation', 'overview']
  },
  {
    title: 'What is Slice.js?',
    route: '/Documentation/Slice',
    description: 'A quick introduction to Slice.js and its philosophy.',
    section: 'Introduction',
    group: 'Overview',
    order: 2,
    navLabel: 'What is Slice.js?',
    tags: ['introduction', 'overview']
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
];

export default docsIndex;
