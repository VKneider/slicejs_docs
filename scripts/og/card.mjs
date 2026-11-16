// The social card, as HTML. Pure string building — no DOM, no dependencies.
//
// The card is rendered by Chromium (see generate.mjs) because that is the only
// way to show a *real* screenshot of the component at its real size. Keeping
// the design in one CSS string means the image hash changes exactly when the
// look changes, so a design edit invalidates the cache without a manual bump.
//
// 1200×630 is the ratio every platform crops to (1.91:1). Do not change it
// without updating CARD, the manifest and the tests.

export const CARD = { width: 1200, height: 630 };

/** Bump when the layout logic (not the CSS) changes. */
export const CARD_VERSION = '1';

const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/** `/docs/input/button` -> `docs-input-button`, `/` -> `home`. */
export const routeSlug = (route) => {
  if (route === '/') return 'home';
  return String(route)
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase();
};

/** `Button | Slice.js` -> `Button`. The product name lives in the card chrome. */
export const displayTitle = (title) =>
  String(title || '').replace(/\s*\|\s*Slice\.js\s*$/i, '').trim();

const titleClass = (title) => {
  if (title.length > 34) return 'xs';
  if (title.length > 24) return 'sm';
  return '';
};

export const CARD_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: "Source Sans 3", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    background: #fefbff;
    color: #1a0b2e;
    -webkit-font-smoothing: antialiased;
  }
  .card {
    position: relative;
    width: 1200px;
    height: 630px;
    padding: 44px 56px 30px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 6px;
    background: #9333ea;
  }
  .eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3.2px;
    text-transform: uppercase;
    color: #9333ea;
  }
  .eyebrow .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #9333ea;
  }
  h1 {
    font-size: 54px;
    line-height: 1.02;
    letter-spacing: -0.02em;
    font-weight: 700;
    max-width: 1000px;
  }
  h1.sm { font-size: 44px; }
  h1.xs { font-size: 37px; }
  .meta {
    margin-top: 9px;
    font-size: 19px;
    font-weight: 600;
    color: #6b46c1;
  }
  .stage {
    flex: 1;
    min-height: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 26px;
    border-radius: 18px;
    border: 1px solid #ece6f7;
    background: #fefbff;
  }
  .stage[data-kind="page"] {
    padding: 0;
  }
  .stage img {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
  .stage[data-kind="page"] img {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    object-fit: cover;
  }
  .copy {
    font-size: 23px;
    line-height: 1.5;
    color: #4a3a63;
    max-width: 940px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 600;
    color: #9a8cb5;
  }
  footer .brand { color: #6b46c1; }
`;

/**
 * @param {object} input
 * @param {string} input.route        canonical route, e.g. `/docs/input/button`
 * @param {string} input.title        manifest title (`Button | Slice.js`)
 * @param {string} [input.section]    e.g. `Input Components`
 * @param {string} [input.group]      e.g. `Basic`
 * @param {string} [input.description]
 * @param {string} [input.imageData]  `data:image/png;base64,…` capture, if any
 * @param {string} [input.host]       origins shown in the footer
 */
export function buildCardHtml({ route, title, section, group, description, imageData, kind = 'demo', host = 'slicejs.com' }) {
  const name = displayTitle(title);
  const meta = [section, group].filter(Boolean).join(' · ');
  const path = route === '/' ? '/' : route.replace(/\/+$/, '');
  const eyebrow = '<div class="eyebrow"><span class="dot"></span>Slice.js Documentation</div>';
  const stage = imageData
    ? `<img src="${esc(imageData)}" alt="" />`
    : `<p class="copy">${esc(description || '')}</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>${CARD_CSS}</style>
</head>
<body>
  <div class="card">
    <div class="head">
      ${eyebrow}
      <h1 class="${titleClass(name)}">${esc(name)}</h1>
      ${meta ? `<div class="meta">${esc(meta)}</div>` : ''}
    </div>
    <div class="stage" data-kind="${esc(kind)}">${stage}</div>
    <footer>
      <span>${esc(host)}${esc(path)}</span>
      <span class="brand">Slice.js · Documentation</span>
    </footer>
  </div>
</body>
</html>`;
}
