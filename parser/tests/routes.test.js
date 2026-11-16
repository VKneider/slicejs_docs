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
