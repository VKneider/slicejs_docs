import test from 'node:test';
import assert from 'node:assert/strict';

import docsIndex from '../../src/Components/AppComponents/DocumentationPage/docsIndex.js';
import routes from '../../src/routes.js';
import {
  documentationRoutes,
  getAllRoutes
} from '../../src/Components/AppComponents/DocumentationPage/documentationRoutes.js';

const clientRoutes = new Set();
for (const route of routes) {
  clientRoutes.add(route.path);
  for (const child of route.children || []) {
    clientRoutes.add(`${route.path}${child.path}`);
  }
}

const innerRoutes = new Set(getAllRoutes(documentationRoutes).map((route) => route.path));

test('every generated docsIndex page exists in the outer and inner route tables', () => {
  for (const entry of docsIndex) {
    assert.ok(clientRoutes.has(entry.route), `missing from src/routes.js: ${entry.route}`);
    assert.ok(innerRoutes.has(entry.route), `missing from documentationRoutes.js: ${entry.route}`);
  }
});

test('the canonical CLI page is reachable through both route tables', () => {
  assert.ok(clientRoutes.has('/Documentation/CLI'), 'src/routes.js is missing /Documentation/CLI');
  assert.ok(innerRoutes.has('/Documentation/CLI'), 'documentationRoutes.js is missing /Documentation/CLI');
  assert.ok(docsIndex.some((entry) => entry.route === '/Documentation/CLI'), 'docsIndex is missing /Documentation/CLI');
});

test('the retired /Commands alias does not linger in either route table', () => {
  assert.ok(!clientRoutes.has('/Documentation/Commands'), 'src/routes.js still has /Documentation/Commands');
  assert.ok(!innerRoutes.has('/Documentation/Commands'), 'documentationRoutes.js still has /Documentation/Commands');
});

test('the dead /Docum/ pattern is gone', () => {
  for (const route of clientRoutes) {
    assert.ok(!route.startsWith('/Docum/'), `unexpected legacy route: ${route}`);
  }
});

test('navigation stays within the documented IA budget', () => {
  const sections = documentationRoutes.sections;
  assert.equal(sections.length, 7, 'the docs should have seven top-level sections');

  let leaves = 0;
  let maxDepth = 1;

  const walk = (items, depth, section) => {
    for (const item of items || []) {
      if (item.items) {
        walk(item.items, depth + 1, section);
      } else if (item.path) {
        leaves += 1;
        maxDepth = Math.max(maxDepth, depth);
        assert.ok(
          leaves <= 60,
          'the navigation has more pages than the IA budget; split or regroup a section'
        );
        assert.ok(item.component, `navigation item without component: ${item.path}`);
      }
    }
  };

  for (const section of sections) {
    let sectionLeaves = 0;
    const count = (items) => {
      for (const item of items || []) {
        if (item.items) count(item.items);
        else if (item.path) sectionLeaves += 1;
      }
    };
    count(section.items);
    assert.ok(
      sectionLeaves <= 12,
      `section "${section.title}" has ${sectionLeaves} pages; split it before it becomes a junk drawer`
    );
    walk(section.items, 2, section.title);
  }

  assert.equal(leaves, 46, 'the docs should expose 46 pages in the tree');
  assert.ok(maxDepth <= 3, `navigation depth is ${maxDepth}; keep it at 3 or less`);
});
