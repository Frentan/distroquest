import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Optional authoring tool: ImageMagick is not a runtime/build dependency.
const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), 'distroquest-share-'));
try {
  const mark = readFileSync(join(root, 'public/favicon.svg'), 'utf8').replace(
    '<svg ',
    '<svg x="440" y="80" width="320" height="320" ',
  );
  const source = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#203c32"/>
    ${mark}
    <text x="600" y="510" text-anchor="middle" font-family="DejaVu Sans" font-size="76" font-weight="bold" fill="#efcd7e">DistroQuest.</text>
  </svg>`;
  const path = join(temporary, 'card.svg');
  writeFileSync(path, source);
  const result = spawnSync(
    'magick',
    [
      path,
      '-strip',
      '-define',
      'png:color-type=2',
      join(root, 'public/social-card.png'),
    ],
    { stdio: 'inherit' },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('Social card rendering failed');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
