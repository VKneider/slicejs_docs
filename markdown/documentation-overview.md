---
title: Documentation
route: /Documentation
navLabel: Documentation
section: Introduction
group: Overview
order: 1
description: The documentation landing page for Slice.js.
component: Documentation
tags: [documentation, overview]
---

:::html
<div class="docs-landing">
  <section class="docs-hero">
    <div class="hero-content">
      <span class="hero-badge">Slice.js Documentation</span>
      <h1>Build fast, readable, and reusable UI with Slice.js.</h1>
      <p class="hero-lede">
        Learn the core concepts, component patterns, routing, and tooling through focused guides
        and API references. Everything here is built on native Web Components and plain JavaScript.
      </p>
      <div class="hero-cta"></div>
      <div class="hero-stats"></div>
    </div>
    <div class="hero-side">
      <div class="hero-panel">
        <div class="hero-panel-header">
          <span>Quick Start</span>
          <span class="hero-panel-pill">JS</span>
        </div>
        <div class="hero-code"></div>
      </div>
      <div class="hero-links"></div>
    </div>
  </section>

  <section class="docs-section">
    <div class="section-head">
      <h2>Choose your learning path</h2>
      <p>Jump to curated paths based on what you want to build next.</p>
    </div>
    <div class="path-grid"></div>
  </section>

  <section class="docs-section">
    <div class="section-head">
      <h2>Core foundations</h2>
      <p>Understand the building blocks that power Slice.js apps.</p>
    </div>
    <div class="category-grid"></div>
  </section>

  <section class="docs-section">
    <div class="section-head">
      <h2>Tooling and configuration</h2>
      <p>Set up projects, manage components, and streamline workflows.</p>
    </div>
    <div class="tooling-grid"></div>
  </section>

  <section class="docs-section docs-next">
    <div class="next-steps"></div>
  </section>
</div>
:::

:::script
const createHero = async () => {
  const ctaContainer = component.querySelector('.hero-cta');
  const statsContainer = component.querySelector('.hero-stats');
  const codeContainer = component.querySelector('.hero-code');
  const linksContainer = component.querySelector('.hero-links');

  if (ctaContainer) {
    const primary = await slice.build('Button', {
      value: 'Start with Installation',
      onClickCallback: async () => {
        await slice.router.navigate('/Documentation/Installation');
      }
    });

    const secondary = await slice.build('Button', {
      value: 'Explore Components',
      onClickCallback: async () => {
        await slice.router.navigate('/Documentation/Visual');
      }
    });

    const cli = await slice.build('Button', {
      value: 'CLI Commands',
      onClickCallback: async () => {
        await slice.router.navigate('/Documentation/Commands');
      }
    });

    ctaContainer.appendChild(primary);
    ctaContainer.appendChild(secondary);
    ctaContainer.appendChild(cli);
  }

  if (statsContainer) {
    const stats = [
      { label: 'Component types', value: '3' },
      { label: 'Core lifecycle methods', value: '3' },
      { label: 'Built-in services', value: '5' },
      { label: 'Routing modes', value: '2' }
    ];

    stats.forEach((stat) => {
      const item = document.createElement('div');
      item.className = 'stat-card';
      item.innerHTML = `
        <div class="stat-value">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      `;
      statsContainer.appendChild(item);
    });
  }

  if (codeContainer) {
    const code = await slice.build('CodeVisualizer', {
      language: 'javascript',
      value: `// Build a component and attach it
const card = await slice.build('Card', {
  title: 'Slice.js Documentation',
  text: 'Start building with clean components.'
});

document.querySelector('#app').appendChild(card);`
    });

    codeContainer.appendChild(code);
  }

  if (linksContainer) {
    const links = [
      { title: 'What is Slice.js?', desc: 'Architecture, goals, and mental model.', path: '/Documentation/Slice' },
      { title: 'sliceConfig.json', desc: 'Configure themes, paths, router, and services.', path: '/Documentation/Configuration/sliceConfig' },
      { title: 'Routing & Guards', desc: 'Route config, params, and navigation guards.', path: '/Documentation/Routing' }
    ];

    links.forEach((link) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'hero-link';
      item.innerHTML = `
        <div class="hero-link-title">${link.title}</div>
        <div class="hero-link-desc">${link.desc}</div>
        <span class="hero-link-arrow">→</span>
      `;
      item.addEventListener('click', async () => {
        await slice.router.navigate(link.path);
      });
      linksContainer.appendChild(item);
    });
  }
};

const createPathCards = () => {
  const grid = component.querySelector('.path-grid');
  if (!grid) return;

  const paths = [
    {
      tag: 'Start here',
      title: 'Getting Started',
      description: 'Install the CLI, create a project, and learn the core workflow.',
      path: '/Documentation/Installation',
      accent: 'primary'
    },
    {
      tag: 'Components',
      title: 'Build & Compose',
      description: 'Understand build(), static props, and the component lifecycle.',
      path: '/Documentation/The-build-method',
      accent: 'secondary'
    },
    {
      tag: 'Routing',
      title: 'Navigation',
      description: 'Configure routes, guard transitions, and reuse cached views.',
      path: '/Documentation/Routing',
      accent: 'success'
    },
    {
      tag: 'State',
      title: 'Context Manager',
      description: 'Shared state with watchers, selectors, and persistence.',
      path: '/Documentation/ContextManager',
      accent: 'warning'
    }
  ];

  paths.forEach((item) => {
    const card = document.createElement('div');
    card.className = `doc-card`;
    card.dataset.accent = item.accent;
    card.innerHTML = `
      <div class="doc-pill">${item.tag}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <span class="doc-link">Open guide →</span>
    `;
    card.addEventListener('click', async () => {
      await slice.router.navigate(item.path);
    });
    grid.appendChild(card);
  });
};

const createCategoryCards = () => {
  const grid = component.querySelector('.category-grid');
  if (!grid) return;

  const categories = [
    {
      title: 'Visual Components',
      description: 'UI building blocks like Button, Card, Grid, Layout, and forms.',
      path: '/Documentation/Visual',
      icon: '🎨'
    },
    {
      title: 'Structural Components',
      description: 'Router, Controller, StylesManager, and framework services.',
      path: '/Documentation/Structural',
      icon: '⚙️'
    },
    {
      title: 'Services',
      description: 'Fetch, storage, translation, and reusable business logic.',
      path: '/Documentation/Service',
      icon: '🔧'
    },
    {
      title: 'Lifecycle Methods',
      description: 'init(), update(), beforeDestroy() and when to use them.',
      path: '/Documentation/LifeCycle-Methods',
      icon: '⏱️'
    }
  ];

  categories.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'doc-card doc-card-compact';
    card.innerHTML = `
      <div class="doc-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <span class="doc-link">View docs →</span>
    `;
    card.addEventListener('click', async () => {
      await slice.router.navigate(item.path);
    });
    grid.appendChild(card);
  });
};

const createToolingCards = () => {
  const grid = component.querySelector('.tooling-grid');
  if (!grid) return;

  const tools = [
    {
      title: 'Slice CLI',
      description: 'Initialize projects, manage components, and run dev servers.',
      path: '/Documentation/Commands'
    },
    {
      title: 'sliceConfig.json',
      description: 'Configure themes, styles, routes, and structural services.',
      path: '/Documentation/Configuration/sliceConfig'
    },
    {
      title: 'Themes',
      description: 'Customize themes, set defaults, and build your own palettes.',
      path: '/Documentation/Themes'
    },
    {
      title: 'Playground',
      description: 'Experiment with components and routing in a live sandbox.',
      path: '/Playground'
    }
  ];

  tools.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'doc-card doc-card-tool';
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <span class="doc-link">Open →</span>
    `;
    card.addEventListener('click', async () => {
      await slice.router.navigate(item.path);
    });
    grid.appendChild(card);
  });
};

const createNextSteps = () => {
  const container = component.querySelector('.next-steps');
  if (!container) return;

  container.innerHTML = `
    <div class="next-steps-panel">
      <div>
        <h2>Ready to build?</h2>
        <p>Start with installation, then create your first component and wire up routing.</p>
      </div>
      <div class="next-steps-actions"></div>
    </div>
  `;

  const actions = container.querySelector('.next-steps-actions');
  if (!actions) return;

  const actionsList = [
    { label: 'Installation', path: '/Documentation/Installation' },
    { label: 'The build method', path: '/Documentation/The-build-method' },
    { label: 'Routing', path: '/Documentation/Routing' }
  ];

  actionsList.forEach((item) => {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'next-step-link';
    link.textContent = item.label;
    link.addEventListener('click', async () => {
      await slice.router.navigate(item.path);
    });
    actions.appendChild(link);
  });
};

await createHero();
createPathCards();
createCategoryCards();
createToolingCards();
createNextSteps();
:::
