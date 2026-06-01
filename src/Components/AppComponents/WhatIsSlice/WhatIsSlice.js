export default class WhatIsSlice extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);

    this.ecosystemProjects = [
      {
        name: 'slice.js',
        subtitle: 'Official Repo',
        description: 'The core framework and the place where Slice evolves in public.',
        links: [
          { label: 'GitHub', href: 'https://github.com/VKneider/slice.js' }
        ]
      },
      {
        name: 'sliceDocs',
        subtitle: 'Documentation Site',
        description: 'Concepts, guides, and examples that explain the philosophy and the architecture.',
        links: [
          { label: 'Open Docs', href: 'https://slicejs.com/' },
          { label: 'GitHub', href: 'https://github.com/VKneider/slicejs_docs' }
        ]
      },
      {
        name: 'slice.js_visual_library',
        subtitle: 'Visual Library',
        description: 'Reusable visual components designed for real Slice applications.',
        links: [
          { label: 'Open Library', href: 'https://components.slicejs.com/' }
        ]
      },
      {
        name: 'slicejs-mcp',
        subtitle: 'Slice Docs MCP',
        description: 'MCP bridge to consume Slice documentation in AI-assisted workflows.',
        links: [
          { label: 'GitHub', href: 'https://github.com/VKneider/slicejs-mcp' }
        ]
      }
    ];
  }

  async init() {
    this.renderEcosystemCards();
    this.decorateExternalLinks();
  }

  renderEcosystemCards() {
    const grid = this.querySelector('.ecosystem-grid');
    if (!grid) return;

    const cardMarkup = this.ecosystemProjects.map((project) => {
      const linksMarkup = project.links
        .map((link) => `<a class="ecosystem-link" href="${link.href}" target="_blank" rel="noopener noreferrer">${project.name} ${link.label}</a>`)
        .join('');

      return `
        <article class="ecosystem-card">
          <p class="ecosystem-subtitle">${project.subtitle}</p>
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <div class="ecosystem-actions">${linksMarkup}</div>
        </article>
      `;
    });

    grid.innerHTML = cardMarkup.join('');
  }

  decorateExternalLinks() {
    this.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = link.getAttribute('rel') || '';
      const next = rel.includes('noopener') && rel.includes('noreferrer')
        ? rel
        : 'noopener noreferrer';
      link.setAttribute('rel', next);
    });
  }
}

customElements.define('slice-whatisslice', WhatIsSlice);