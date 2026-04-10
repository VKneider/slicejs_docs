import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { resolvePublicEnv, createPublicEnvProvider } from '../utils/publicEnvResolver.js';

test('resolvePublicEnv exposes only SLICE_PUBLIC_ keys', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slice-docs-env-'));
  const envPath = path.join(tmpDir, '.env');
  fs.writeFileSync(envPath, 'SLICE_PUBLIC_TITLE=Slice Docs\nSECRET_TOKEN=hidden\n', 'utf8');

  const payload = resolvePublicEnv({
    mode: 'development',
    envFilePath: envPath,
    processEnv: {
      SLICE_PUBLIC_THEME: 'light',
      PRIVATE_API_KEY: 'nope',
    },
    logger: { warn() {} },
  });

  assert.equal(payload.mode, 'development');
  assert.deepEqual(payload.env, {
    SLICE_PUBLIC_TITLE: 'Slice Docs',
    SLICE_PUBLIC_THEME: 'light',
  });
});

test('createPublicEnvProvider caches payload in production mode', () => {
  const processEnv = { SLICE_PUBLIC_VERSION: '1.0.0' };
  const provider = createPublicEnvProvider({
    mode: 'production',
    envFilePath: '',
    processEnv,
    logger: { warn() {} },
  });

  const first = provider.getPayload();
  processEnv.SLICE_PUBLIC_VERSION = '2.0.0';
  const second = provider.getPayload();

  assert.equal(first.env.SLICE_PUBLIC_VERSION, '1.0.0');
  assert.equal(second.env.SLICE_PUBLIC_VERSION, '1.0.0');
});
