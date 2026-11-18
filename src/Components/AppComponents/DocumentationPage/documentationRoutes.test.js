import test from 'node:test';
import assert from 'node:assert/strict';

import { documentationRoutes, getAllRoutes } from './documentationRoutes.js';

test('the retired components docs portal route is gone', () => {
  const allRoutes = getAllRoutes(documentationRoutes);

  assert.equal(allRoutes.some((route) => route.path === '/Documentation/Components'), false);
});
