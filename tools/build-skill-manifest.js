import fs from 'fs';
import path from 'path';

// Regenerates skill/manifest.json from the skill folder so the file list the
// CLI fetches never drifts from what's on disk. Mirrors tools/build-llm.js.
// Run from the repo root: `node tools/build-skill-manifest.js`.

const ROOT = process.cwd();
const SKILL_NAME = 'slice-js-developer';
const SKILL_DIR = path.join(ROOT, 'skill', SKILL_NAME);
const OUTPUT_PATH = path.join(ROOT, 'skill', 'manifest.json');

// Where the CLI writes the skill inside a consumer project.
const INSTALL_PATH = `.claude/skills/${SKILL_NAME}`;

const readFilesRecursive = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readFilesRecursive(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
};

// Parse the VERSION file (`version:` / `targets:` lines) — the single source
// of truth for the skill's semver and its framework compatibility range.
const parseVersionFile = (versionPath) => {
  const raw = fs.readFileSync(versionPath, 'utf8');
  const grab = (key) => {
    const line = raw.split('\n').find((l) => l.trim().toLowerCase().startsWith(`${key}:`));
    return line ? line.slice(line.indexOf(':') + 1).trim() : null;
  };
  const version = grab('version');
  const targets = grab('targets');
  if (!version) throw new Error(`No "version:" line found in ${versionPath}`);
  return { version, targets };
};

const build = () => {
  if (!fs.existsSync(SKILL_DIR)) {
    throw new Error(`Skill directory not found: ${SKILL_DIR}`);
  }

  const versionPath = path.join(SKILL_DIR, 'VERSION');
  if (!fs.existsSync(versionPath)) {
    throw new Error(`VERSION file not found: ${versionPath}`);
  }
  const { version, targets } = parseVersionFile(versionPath);

  const files = readFilesRecursive(SKILL_DIR)
    .map((file) => path.relative(SKILL_DIR, file).replace(/\\/g, '/'))
    .sort();

  const manifest = {
    name: SKILL_NAME,
    version,
    targets,
    installPath: INSTALL_PATH,
    files,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${OUTPUT_PATH} (v${version}, ${files.length} files)`);
};

try {
  build();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
