import test from 'node:test';
import assert from 'node:assert/strict';

import { documentationRoutes, getAllRoutes } from './documentationRoutes.js';

test('components docs uses one external landing route', () => {
  const allRoutes = getAllRoutes(documentationRoutes);

  assert.equal(allRoutes.some((route) => route.path === '/Documentation/Components'), true);
  assert.equal(allRoutes.some((route) => route.path === '/Documentation/Components/Visual/Button'), false);
  assert.equal(allRoutes.some((route) => route.path === '/Documentation/Components/Visual/Card'), false);
});
