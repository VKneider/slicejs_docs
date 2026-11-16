// SEO artifacts for the documentation site.
//
// Both files are generated from the same markdown front matter that generates
// the pages: a hand-maintained sitemap silently rots (it was already missing
// Deployment, SEO and Server-Entrypoint).
//
//   src/public/seo.json     -> per-route title/description/canonical/JSON-LD
//                              injected into the SPA shell by the framework
//   src/public/sitemap.xml  -> what crawlers are told to index
//
// The manifest is also the route inventory the framework server uses to answer
// a real 404 for a path that is not a page.

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { buildSitemap as buildFrameworkSitemap } from 'slicejs-web-framework/api/framework/seo.js';

export const ORIGIN = 'https://slicejs.com';
export const TITLE_SUFFIX = ' | Slice.js';
export const MARKDOWN_DIR = 'markdown';

// Routes that are not generated from markdown. The docs landing page is a
// markdown entry (`/Documentation`), so it is not duplicated here.
const STATIC_ROUTES = {
  '/about': {
    title: 'About',
    description: 'Who builds Slice.js, why it exists, and how the project is maintained.',
    priority: '0.5',
    changefreq: 'monthly'
  }
};

// Present in routes.js but not part of the public site.
const HIDDEN_ROUTES = {
  '/404': 'Not found'
};

const DESCRIPTION_FALLBACK = (title) =>
  `${title} — official Slice.js documentation with guides, examples and API references.`;

/** Read the shell's own metadata so the home page has one source of truth. */
const readShellMeta = (root) => {
  const shellPath = path.join(root, 'src', 'App', 'index.html');
  const fallback = {
    title: 'Slice.js Web Framework',
    description:
      'Build web apps one slice at a time. Official documentation for Slice.js, a lightweight web framework built on native Web Components. No build step required.'
  };

  try {
    const html = fs.readFileSync(shellPath, 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
    const description = html.match(
      /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
    )?.[1]?.trim();
    return {
      title: title || fallback.title,
      description: description || fallback.description
    };
  } catch {
    return fallback;
  }
};

/**
 * Latest commit date per markdown file, in one `git log` call.
 * A fresh clone resets mtimes, which would churn the sitemap on every CI run;
 * the commit date only moves when the page actually changed.
 *
 * @returns {Map<string, string>} repo-relative path -> YYYY-MM-DD
 */
const collectLastModified = (root) => {
  const dates = new Map();

  try {
    const output = execFileSync(
      'git',
      ['log', '--format=@@%as', '--name-only', '--', MARKDOWN_DIR],
      { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }
    );

    let currentDate = null;
    for (const rawLine of output.split('\n')) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.startsWith('@@')) {
        currentDate = line.slice(2);
        continue;
      }
      if (currentDate && !dates.has(line)) dates.set(line, currentDate);
    }
  } catch {
    // No git (tarball export, docker image without .git): the sitemap is still
    // valid, it just omits <lastmod>.
  }

  return dates;
};

const normalizeRoute = (route) => {
  const trimmed = String(route || '').trim();
  if (!trimmed) return '';
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : '/';
};

/**
 * Build the route table the framework reads (`seo.json`).
 *
 * @param {Array<{route: string, title: string, description?: string, section?: string,
 *   group?: string, markdownFile?: string}>} entries docs entries
 * @param {{ root?: string, lastModified?: Map<string, string>, shellMeta?: object }} [options]
 */
export const buildSeoManifest = (entries = [], options = {}) => {
  const root = options.root || process.cwd();
  const shellMeta = options.shellMeta || readShellMeta(root);
  const lastModified = options.lastModified || new Map();
  const routes = {};

  const websiteJsonLd = {
    '@type': 'WebSite',
    name: 'Slice.js',
    url: ORIGIN,
    description: shellMeta.description
  };

  const docsJsonLd = (route, title, description, lastmod) => {
    const canonical = `${ORIGIN}${route}`;
    const pageTitle = `${title}${TITLE_SUFFIX}`;
    const breadcrumbs = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Documentation',
          item: `${ORIGIN}/Documentation`
        }
      ]
    };
    if (route !== '/Documentation') {
      const segments = route.split('/').filter(Boolean).slice(1); // drop "Documentation"
      let position = 3;
      // Intermediate segments (Architecture, LifeCycle-Methods…) get their own
      // crumb; the final crumb carries the page title, not the URL slug.
      for (let index = 0; index < segments.length - 1; index += 1) {
        const segment = segments[index];
        breadcrumbs.itemListElement.push({
          '@type': 'ListItem',
          position,
          name: segment.replace(/-/g, ' '),
          item: `${ORIGIN}/Documentation/${segments.slice(0, index + 1).join('/')}`
        });
        position += 1;
      }
      breadcrumbs.itemListElement.push({
        '@type': 'ListItem',
        position,
        name: title,
        item: canonical
      });
    }
    const article = {
      '@type': 'TechArticle',
      headline: pageTitle,
      description,
      url: canonical,
      author: { '@type': 'Organization', name: 'vkneider.dev' },
      publisher: { '@type': 'Organization', name: 'Slice.js' }
    };
    if (lastmod) article.dateModified = lastmod;
    return [article, breadcrumbs];
  };

  // Home: the shell title already carries the site identity, so it is not
  // suffixed again.
  routes['/'] = {
    title: shellMeta.title,
    description: shellMeta.description,
    robots: { index: true, follow: true },
    sitemap: { priority: '1.0', changefreq: 'weekly' },
    jsonLd: [websiteJsonLd]
  };

  for (const [route, meta] of Object.entries(STATIC_ROUTES)) {
    routes[route] = {
      title: `${meta.title}${TITLE_SUFFIX}`,
      description: meta.description,
      robots: { index: true, follow: true },
      sitemap: { priority: meta.priority, changefreq: meta.changefreq },
      jsonLd: [websiteJsonLd]
    };
  }

  for (const [route, title] of Object.entries(HIDDEN_ROUTES)) {
    routes[route] = {
      title: `${title}${TITLE_SUFFIX}`,
      description: '',
      // The server turns this into <meta name="robots" content="noindex, nofollow">
      // and keeps the route out of the sitemap.
      robots: false,
      jsonLd: [websiteJsonLd]
    };
  }

  for (const entry of entries) {
    const route = normalizeRoute(entry.route);
    if (!route || route === '/') continue;
    if (routes[route]) continue;

    const title = String(entry.title || '').trim() || route;
    const description = String(entry.description || '').trim() || DESCRIPTION_FALLBACK(title);
    const markdownFile = entry.markdownFile || '';
    const lastmod = markdownFile ? lastModified.get(markdownFile) || null : null;

    routes[route] = {
      title: `${title}${TITLE_SUFFIX}`,
      description,
      robots: { index: true, follow: true },
      // Documentation pages are articles, not the site landing page.
      openGraph: { type: 'article' },
      sitemap: {
        lastmod,
        priority: route === '/Documentation' ? '0.9' : '0.7',
        changefreq: 'monthly'
      },
      jsonLd: route.startsWith('/Documentation')
        ? docsJsonLd(route, title, description, lastmod)
        : [websiteJsonLd]
    };
  }

  // Sorted so the generated file only changes when the input does.
  const sortedRoutes = {};
  for (const route of Object.keys(routes).sort()) sortedRoutes[route] = routes[route];

  return {
    version: 1,
    origin: ORIGIN,
    defaults: {
      image: '/images/og-image.png',
      imageWidth: 1899,
      imageHeight: 931,
      imageType: 'image/png',
      imageAlt: 'Slice.js documentation',
      siteName: 'Slice.js',
      locale: 'en_US'
    },
    routes: sortedRoutes
  };
};

/**
 * Sitemap XML from a manifest.
 *
 * Delegate to the framework's builder so `slice seo check` and this generator
 * cannot disagree about route order or escaping.
 */
export const buildSitemap = (manifest) =>
  buildFrameworkSitemap({ manifest, origin: manifest.origin });

const writeFileIfChanged = (filePath, content) => {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) return false;
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
};

/**
 * Write the crawler-facing artifacts.
 *
 * @returns {{ manifest: object, changed: string[] }}
 */
export const writeSeoArtifacts = ({ root, publicDir, entries }) => {
  const manifest = buildSeoManifest(entries, {
    root,
    lastModified: collectLastModified(root)
  });
  const changed = [];

  if (writeFileIfChanged(path.join(publicDir, 'seo.json'), `${JSON.stringify(manifest, null, 2)}\n`)) {
    changed.push('seo.json');
  }
  if (writeFileIfChanged(path.join(publicDir, 'sitemap.xml'), buildSitemap(manifest))) {
    changed.push('sitemap.xml');
  }

  return { manifest, changed };
};
